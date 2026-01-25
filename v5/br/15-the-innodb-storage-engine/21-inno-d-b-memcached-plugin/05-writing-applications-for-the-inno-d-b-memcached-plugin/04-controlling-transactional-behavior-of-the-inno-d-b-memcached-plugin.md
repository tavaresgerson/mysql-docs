#### 14.21.5.4 Controlando o Comportamento Transacional do Plugin memcached do InnoDB

Ao contrário do **memcached** tradicional, o plugin `daemon_memcached` permite controlar a durabilidade dos valores de dados produzidos através de chamadas para `add`, `set`, `incr`, e assim por diante. Por padrão, os dados escritos através da interface **memcached** são armazenados em disco, e as chamadas para `get` retornam o valor mais recente do disco. Embora o comportamento padrão não ofereça o melhor desempenho bruto possível, ele ainda é rápido comparado à interface SQL para tabelas `InnoDB`.

À medida que você ganha experiência usando o plugin `daemon_memcached`, você pode considerar flexibilizar as configurações de durabilidade para classes de dados não críticos, correndo o risco de perder alguns valores atualizados no caso de uma falha (outage), ou retornar dados que estão ligeiramente desatualizados (out-of-date).

##### Frequência de Commits

Um tradeoff (compromisso) entre durabilidade e desempenho bruto é a frequência com que os dados novos e alterados são submetidos (committed). Se os dados são críticos, eles devem ser committed imediatamente para que estejam seguros em caso de saída inesperada ou falha. Se os dados são menos críticos, como contadores que são redefinidos após uma saída inesperada ou dados de log que você pode se dar ao luxo de perder, você pode preferir uma taxa de transferência (throughput) bruta mais alta, disponível com commits menos frequentes.

Quando uma operação **memcached** insere, atualiza ou exclui dados na tabela `InnoDB` subjacente, a alteração pode ser committed para a tabela `InnoDB` instantaneamente (se `daemon_memcached_w_batch_size=1`) ou algum tempo depois (se o valor de `daemon_memcached_w_batch_size` for maior que 1). Em ambos os casos, a alteração não pode ser rolled back. Se você aumentar o valor de `daemon_memcached_w_batch_size` para evitar alta sobrecarga de I/O durante períodos de pico, os commits podem se tornar infrequentes quando a carga de trabalho diminuir. Como medida de segurança, um Thread em segundo plano submete (commits) automaticamente as alterações feitas através da API **memcached** em intervalos regulares. O intervalo é controlado pela opção de configuração `innodb_api_bk_commit_interval`, que possui uma configuração padrão de `5` segundos.

Quando uma operação **memcached** insere ou atualiza dados na tabela `InnoDB` subjacente, os dados alterados ficam imediatamente visíveis para outras requisições **memcached** porque o novo valor permanece no cache de memória, mesmo que ainda não tenha sido committed no lado do MySQL.

##### Transaction Isolation

Quando uma operação **memcached**, como `get` ou `incr`, causa uma Query ou operação DML na tabela `InnoDB` subjacente, você pode controlar se a operação vê os dados mais recentes escritos na tabela, apenas dados que foram committeds, ou outras variações do nível de Transaction Isolation. Use a opção de configuração `innodb_api_trx_level` para controlar esse recurso. Os valores numéricos especificados para esta opção correspondem a níveis de isolation, como `REPEATABLE READ`. Consulte a descrição da opção `innodb_api_trx_level` para obter informações sobre outras configurações.

Um nível de isolation estrito garante que os dados recuperados não sejam rolled back ou alterados repentinamente, fazendo com que Queries subsequentes retornem valores diferentes. No entanto, níveis de isolation estritos exigem maior sobrecarga de Locking, o que pode causar esperas. Para uma aplicação estilo NoSQL que não usa transactions de longa duração, você pode tipicamente usar o nível de isolation padrão ou mudar para um nível de isolation menos estrito.

##### Desabilitando Row Locks para Operações DML do memcached

A opção `innodb_api_disable_rowlock` pode ser usada para desabilitar Row Locks quando requisições **memcached** através do plugin `daemon_memcached` causam operações DML. Por padrão, `innodb_api_disable_rowlock` é definida como `OFF`, o que significa que o **memcached** solicita Row Locks para operações `get` e `set`. Quando `innodb_api_disable_rowlock` é definida como `ON`, o **memcached** solicita um Table Lock em vez de Row Locks.

A opção `innodb_api_disable_rowlock` não é dinâmica. Ela deve ser especificada na inicialização na linha de comando **mysqld** ou inserida em um arquivo de configuração do MySQL.

##### Permitindo ou Não Permitindo DDL

Por padrão, você pode realizar operações DDL, como `ALTER TABLE`, em tabelas usadas pelo plugin `daemon_memcached`. Para evitar possíveis lentidões quando essas tabelas são usadas para aplicações de alta taxa de transferência (throughput), desabilite as operações DDL nessas tabelas habilitando `innodb_api_enable_mdl` na inicialização. Esta opção é menos apropriada ao acessar as mesmas tabelas através de **memcached** e SQL, pois bloqueia instruções `CREATE INDEX` nas tabelas, o que poderia ser importante para a execução de Reporting Queries.

##### Armazenando Dados em Disco, na Memória ou em Ambos

A tabela `innodb_memcache.cache_policies` especifica se os dados escritos através da interface **memcached** devem ser armazenados em disco (`innodb_only`, o padrão); somente na memória, como no **memcached** tradicional (`cache_only`); ou em ambos (`caching`).

Com a configuração `caching`, se o **memcached** não conseguir encontrar uma key na memória, ele procura pelo valor em uma tabela `InnoDB`. Os valores retornados das chamadas `get` sob a configuração `caching` podem estar desatualizados (out-of-date) se os valores foram atualizados no disco na tabela `InnoDB`, mas ainda não expiraram do cache de memória.

A política de caching pode ser definida independentemente para as operações `get`, `set` (incluindo `incr` e `decr`), `delete` e `flush`.

Por exemplo, você pode permitir que as operações `get` e `set` consultem ou atualizem uma tabela e o cache de memória **memcached** ao mesmo tempo (usando a configuração `caching`), enquanto faz com que `delete`, `flush`, ou ambos, operem apenas na cópia em memória (usando a configuração `cache_only`). Dessa forma, deletar ou fazer um flush de um item apenas o faz expirar do cache, e o valor mais recente é retornado da tabela `InnoDB` na próxima vez que o item for solicitado.

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

Os valores de `innodb_memcache.cache_policies` são lidos apenas na inicialização. Após alterar os valores nesta tabela, desinstale e reinstale o plugin `daemon_memcached` para garantir que as alterações entrem em vigor.

```sql
mysql> UNINSTALL PLUGIN daemon_memcached;

mysql> INSTALL PLUGIN daemon_memcached soname "libmemcached.so";
```