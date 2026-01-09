#### 14.21.5.4 Controle do comportamento transacional do plugin memcached do InnoDB

Ao contrário do **memcached** tradicional, o plugin `daemon_memcached` permite que você controle a durabilidade dos valores de dados produzidos por chamadas a `add`, `set`, `incr`, e assim por diante. Por padrão, os dados escritos através da interface **memcached** são armazenados no disco, e as chamadas a `get` retornam o valor mais recente do disco. Embora o comportamento padrão não ofereça o melhor desempenho bruto possível, ele ainda é rápido em comparação com a interface SQL para tabelas `InnoDB`.

À medida que você ganha experiência usando o plugin `daemon_memcached`, pode considerar relaxar as configurações de durabilidade para classes de dados não críticas, arriscando perder alguns valores atualizados em caso de uma interrupção ou retornar dados ligeiramente desatualizados.

##### Frequência de compromissos

Uma das trocas entre durabilidade e desempenho bruto é a frequência com que novos e alterados dados são comprometidos. Se os dados são críticos, eles devem ser comprometidos imediatamente para garantir sua segurança em caso de uma saída inesperada ou indisponibilidade. Se os dados são menos críticos, como contadores que são redefinidos após uma saída inesperada ou dados de registro que você pode se permitir perder, você pode preferir um desempenho bruto maior, que está disponível com comprometimentos menos frequentes.

Quando uma operação do **memcached** insere, atualiza ou exclui dados na tabela subjacente `InnoDB`, a mudança pode ser aplicada à tabela `InnoDB instantaneamente (se `daemon_memcached_w_batch_size=1`) ou em um momento posterior (se o valor de `daemon_memcached_w_batch_size`for maior que 1). Em qualquer caso, a mudança não pode ser revertida. Se você aumentar o valor de`daemon_memcached_w_batch_size`para evitar um alto custo de I/O durante períodos de alta atividade, os commits podem se tornar infrequentes quando a carga de trabalho diminui. Como medida de segurança, um fio de fundo automaticamente aplica as mudanças feitas através da API do **memcached** em intervalos regulares. O intervalo é controlado pela opção de configuração`innodb_api_bk_commit_interval`, que tem um ajuste padrão de `5\` segundos.

Quando uma operação do **memcached** insere ou atualiza dados na tabela subjacente do `InnoDB`, os dados alterados ficam imediatamente visíveis para outros pedidos do **memcached**, pois o novo valor permanece no cache de memória, mesmo que ainda não tenha sido comprometido no lado do MySQL.

##### Isolamento de Transações

Quando uma operação **memcached**, como `get` ou `incr`, causa uma consulta ou operação DML na tabela subjacente `InnoDB`, você pode controlar se a operação verá os dados mais recentes escritos na tabela, apenas os dados que foram comprometidos ou outras variações do nível de isolamento de transação. Use a opção de configuração `innodb_api_trx_level` para controlar essa funcionalidade. Os valores numéricos especificados para essa opção correspondem a níveis de isolamento, como `REPEATABLE READ`. Consulte a descrição da opção `innodb_api_trx_level` para obter informações sobre outras configurações.

Um nível de isolamento rigoroso garante que os dados que você recupera não sejam revertidos ou alterados de repente, o que pode fazer com que consultas subsequentes retornem valores diferentes. No entanto, níveis de isolamento rigorosos exigem um maior custo de bloqueio, o que pode causar espera. Para um aplicativo estilo NoSQL que não utiliza transações de longa duração, você geralmente pode usar o nível de isolamento padrão ou alternar para um nível de isolamento menos rigoroso.

##### Desativando Bloqueios de Linha para Operações de DML no memcached

A opção `innodb_api_disable_rowlock` pode ser usada para desabilitar bloqueios de linha quando as solicitações do **memcached** através do plugin `daemon_memcached` causam operações de DML. Por padrão, `innodb_api_disable_rowlock` está definido como `OFF`, o que significa que as solicitações do **memcached** bloqueiam linhas para operações `get` e `set`. Quando `innodb_api_disable_rowlock` é definido como `ON`, o **memcached** solicita um bloqueio de tabela em vez de bloqueios de linha.

A opção `innodb_api_disable_rowlock` não é dinâmica. Ela deve ser especificada na linha de comando do **mysqld** ou inserida em um arquivo de configuração do MySQL durante o início.

##### Permitir ou desabilitar DDL

Por padrão, você pode realizar operações DDL, como `ALTER TABLE`, em tabelas usadas pelo plugin `daemon_memcached`. Para evitar possíveis lentidões quando essas tabelas são usadas em aplicações de alto desempenho, desative as operações DDL nessas tabelas, habilitando `innodb_api_enable_mdl` no início. Essa opção é menos apropriada ao acessar as mesmas tabelas tanto através do **memcached** quanto do SQL, porque bloqueia as instruções `CREATE INDEX` nas tabelas, o que poderia ser importante para executar consultas de relatórios.

##### Armazenamento de dados em disco, na memória ou em ambos

A tabela `innodb_memcache.cache_policies` especifica se os dados escritos através da interface **memcached** devem ser armazenados no disco (`innodb_only`, o padrão); apenas na memória, como no **memcached** tradicional (`cache_only`); ou em ambos (`caching`).

Com a configuração de `caching`, se o **memcached** não conseguir encontrar uma chave na memória, ele procura o valor em uma tabela `InnoDB`. Os valores retornados das chamadas `get` com a configuração de `caching` podem estar desatualizados se os valores forem atualizados no disco na tabela \`InnoDB, mas ainda não expiraram do cache de memória.

A política de cache pode ser definida de forma independente para as operações `get`, `set` (incluindo `incr` e `decr`), `delete` e `flush`.

Por exemplo, você pode permitir que as operações `get` e `set` interajam com uma tabela e o cache de memória **memcached** ao mesmo tempo (usando a configuração `caching`), enquanto as operações `delete`, `flush` ou ambas operam apenas na cópia em memória (usando a configuração `cache_only`). Dessa forma, ao excluir ou descartar um item, apenas expira o item do cache, e o valor mais recente será retornado da tabela `InnoDB` na próxima vez que o item for solicitado.

```sql
mysql> SELECT * FROM innodb_memcache.cache_policies;
+--------------+-------------+-------------+---------------+--------------+
| policy_name  | get_policy  | set_policy  | delete_policy | flush_policy |
+--------------+-------------+-------------+---------------+--------------+
| cache_policy | innodb_only | innodb_only | innodb_only   | innodb_only  |
+--------------+-------------+-------------+---------------+--------------+

mysql> UPDATE innodb_memcache.cache_policies SET set_policy = 'caching'
       WHERE policy_name = 'cache_policy';
```

Os valores de `innodb_memcache.cache_policies` são lidos apenas durante o inicialização. Após alterar os valores nesta tabela, desinstale e reinstale o plugin `daemon_memcached` para garantir que as alterações tenham efeito.

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```
