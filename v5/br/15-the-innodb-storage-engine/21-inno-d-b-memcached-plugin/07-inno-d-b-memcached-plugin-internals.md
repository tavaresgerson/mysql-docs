### 14.21.7 Interiores do Plugin memcached do InnoDB

#### API InnoDB para o Plugin memcached InnoDB

O motor `InnoDB` **memcached** acessa o `InnoDB` através das APIs do `InnoDB`, a maioria das quais é adotada diretamente do `InnoDB` embutido. As funções da API do `InnoDB` são passadas ao motor `InnoDB` **memcached** como funções de callback. As funções da API do `InnoDB` acessam diretamente as tabelas do `InnoDB` e são, na maioria das vezes, operações DML, com exceção do `TRUNCATE TABLE`.

Os comandos do **memcached** são implementados através da API do **memcached** do **InnoDB**. A tabela a seguir mostra como os comandos do **memcached** são mapeados para operações DML ou DDL.

**Tabela 14.21 Comandos do memcached e operações DML ou DDL associadas**

<table frame="all" summary="comandos do memcached e operações DML ou DDL associadas."><thead><tr> <th>Memcached Command</th> <th>Operações DML ou DDL</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>UPDATE</code>]</td> <td>um comando de leitura/recuperação</td> </tr><tr> <td>[[PH_HTML_CODE_<code>UPDATE</code>]</td> <td>uma busca seguida por um [[PH_HTML_CODE_<code>prepend</code>] ou [[PH_HTML_CODE_<code>UPDATE</code>] (dependendo de se uma chave existe ou não)</td> </tr><tr> <td>[[PH_HTML_CODE_<code>UPDATE</code>]</td> <td>uma busca seguida por um [[PH_HTML_CODE_<code>incr</code>] ou [[PH_HTML_CODE_<code>UPDATE</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>decr</code>]</td> <td>uma busca seguida por um [[PH_HTML_CODE_<code>UPDATE</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>delete</code>]</td> <td>uma busca seguida por um [[<code>UPDATE</code>]] (apende dados ao resultado antes de [[<code>set</code><code>UPDATE</code>])</td> </tr><tr> <td>[[<code>prepend</code>]]</td> <td>uma busca seguida por um [[<code>UPDATE</code>]] (prepara os dados para o resultado antes de [[<code>UPDATE</code>]])</td> </tr><tr> <td>[[<code>incr</code>]]</td> <td>uma busca seguida por um [[<code>UPDATE</code>]]</td> </tr><tr> <td>[[<code>decr</code>]]</td> <td>uma busca seguida por um [[<code>UPDATE</code>]]</td> </tr><tr> <td>[[<code>delete</code>]]</td> <td>uma busca seguida por um [[<code>INSERT</code><code>UPDATE</code>]</td> </tr><tr> <td>[[<code>INSERT</code><code>UPDATE</code>]</td> <td>[[<code>INSERT</code><code>prepend</code>] (DDL)</td> </tr></tbody></table>

#### Tabelas de configuração do plugin InnoDB memcached

Esta seção descreve as tabelas de configuração usadas pelo plugin `daemon_memcached`. A tabela `cache_policies`, a tabela `config_options` e a tabela `containers` são criadas pelo script de configuração `innodb_memcached_config.sql` no banco de dados `innodb_memcache`.

```sql
mysql> USE innodb_memcache;
Database changed
mysql> SHOW TABLES;
+---------------------------+
| Tables_in_innodb_memcache |
+---------------------------+
| cache_policies            |
| config_options            |
| containers                |
+---------------------------+
```

#### Tabela cache\_policies

A tabela `cache_policies` define uma política de cache para a instalação `memcached` do `InnoDB`. Você pode especificar políticas individuais para as operações `get`, `set`, `delete` e `flush`, dentro de uma única política de cache. O ajuste padrão para todas as operações é `innodb_only`.

- `innodb_only`: Use `InnoDB` como o repositório de dados.

- `cache_only`: Use o motor **memcached** como o repositório de dados.

- `caching`: Use tanto o `InnoDB` quanto o motor **memcached** como bancos de dados. Nesse caso, se o **memcached** não encontrar uma chave na memória, ele procura o valor em uma tabela `InnoDB`.

- `disable`: Desativar o cache.

**Tabela 14.22 Colunas de políticas de cache**

<table frame="all" summary="Colunas da tabela cache_policies."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>cache_only</code>]</td> <td>Nome da política de cache. O nome padrão da política de cache é [[PH_HTML_CODE_<code>cache_only</code>].</td> </tr><tr> <td>[[PH_HTML_CODE_<code>disabled</code>]</td> <td>A política de cache para operações get. Os valores válidos são [[PH_HTML_CODE_<code>innodb_only</code>], [[PH_HTML_CODE_<code>delete_policy</code>], [[PH_HTML_CODE_<code>innodb_only</code>] ou [[PH_HTML_CODE_<code>cache_only</code>]. O ajuste padrão é [[PH_HTML_CODE_<code>caching</code>].</td> </tr><tr> <td>[[PH_HTML_CODE_<code>disabled</code>]</td> <td>A política de cache para operações de conjunto. Os valores válidos são [[PH_HTML_CODE_<code>innodb_only</code>], [[<code>cache_only</code>]], [[<code>cache_policy</code><code>cache_only</code>] ou [[<code>disabled</code>]]. O ajuste padrão é [[<code>innodb_only</code>]].</td> </tr><tr> <td>[[<code>delete_policy</code>]]</td> <td>A política de cache para operações de exclusão. Os valores válidos são [[<code>innodb_only</code>]], [[<code>cache_only</code>]], [[<code>caching</code>]] ou [[<code>disabled</code>]]. O ajuste padrão é [[<code>innodb_only</code>]].</td> </tr><tr> <td>[[<code>get_policy</code><code>cache_only</code>]</td> <td>A política de cache para operações de limpeza. Os valores válidos são [[<code>get_policy</code><code>cache_only</code>], [[<code>get_policy</code><code>disabled</code>], [[<code>get_policy</code><code>innodb_only</code>] ou [[<code>get_policy</code><code>delete_policy</code>]. O ajuste padrão é [[<code>get_policy</code><code>innodb_only</code>].</td> </tr></tbody></table>

#### Tabela config\_options

A tabela `config_options` armazena configurações relacionadas ao **memcached** que podem ser alteradas em tempo de execução usando SQL. As opções de configuração suportadas são `separator` e `table_map_delimiter`.

**Tabela 14.23 Opções de configuração de colunas**

<table frame="all" summary="Colunas da tabela config_options."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code>]</td> <td>Nome do<span><strong>memcached</strong></span>- opção de configuração relacionada. As seguintes opções de configuração são suportadas pela tabela [[PH_HTML_CODE_<code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code>]:<div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>[[PH_HTML_CODE_<code>col1</code>]: Usado para separar valores de uma string longa em valores separados quando há vários [[PH_HTML_CODE_<code>valuecoly</code>] definidos. Por padrão, o [[PH_HTML_CODE_<code>col2</code>] é um caractere [[PH_HTML_CODE_<code>table_map_delimiter</code>]. Por exemplo, se você definir [[PH_HTML_CODE_<code>@@</code>] como colunas de valor e [[PH_HTML_CODE_<code>@@t1.some_key</code>] como separador, você pode emitir a seguinte instrução:<span><strong>memcached</strong></span>comandos para inserir valores nos [[PH_HTML_CODE_<code>@@t2.some_key</code>] e [[PH_HTML_CODE_<code>Value</code>], respectivamente:</p><pre class="programlisting copytoclipboard language-terminal">[[<code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code>]]</pre><p>[[<code>config_options</code><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code>] é armazenado em [[<code>col1</code>]] e [[<code>valuecoly</code>]] é armazenado em [[<code>col2</code>]].</p></li><li class="listitem"><p>[[<code>table_map_delimiter</code>]]: O caractere que separa o nome do esquema e o nome da tabela quando você usa a notação [[<code>@@</code>]] em um nome de chave para acessar uma chave em uma tabela específica. Por exemplo, [[<code>@@t1.some_key</code>]] e [[<code>@@t2.some_key</code>]] têm o mesmo valor de chave, mas são armazenados em tabelas diferentes.</p></li></ul> </div> </td> </tr><tr> <td>[[<code>Value</code>]]</td> <td>O valor atribuído ao<span><strong>memcached</strong></span>- opção de configuração relacionada.</td> </tr></tbody></table>

#### contêineres Mesa

A tabela `containers` é a mais importante das três tabelas de configuração. Cada tabela `InnoDB` que é usada para armazenar valores do **memcached** deve ter uma entrada na tabela `containers`. A entrada fornece uma correspondência entre as colunas da tabela `InnoDB` e as colunas da tabela de contêineres, o que é necessário para que o **memcached** funcione com tabelas `InnoDB`.

A tabela `containers` contém uma entrada padrão para a tabela `test.demo_test`, que é criada pelo script de configuração `innodb_memcached_config.sql`. Para usar o plugin `daemon_memcached` com sua própria tabela `InnoDB`, você deve criar uma entrada na tabela `containers`.

**Tabela 14.24 Contêineres Colunas**

<table frame="all" summary="Colunas da tabela de contêineres."><thead><tr> <th>Coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>db_schema</code>]</td> <td>O nome dado ao contêiner. Se uma tabela [[PH_HTML_CODE_<code>db_schema</code>] não for solicitada pelo nome usando a notação [[PH_HTML_CODE_<code>db_table</code>], o plugin [[PH_HTML_CODE_<code>InnoDB</code>] usa a tabela [[PH_HTML_CODE_<code>key_columns</code>] com um valor [[PH_HTML_CODE_<code>InnoDB</code>] de [[PH_HTML_CODE_<code>value_columns</code>]. Se não houver tal entrada, a primeira entrada na tabela [[PH_HTML_CODE_<code>InnoDB</code>], ordenada alfabeticamente por [[PH_HTML_CODE_<code>memcached</code>] (crescente), determina a tabela padrão [[PH_HTML_CODE_<code>innodb_memcached.config_options</code>].</td> </tr><tr> <td>[[<code>db_schema</code>]]</td> <td>O nome do banco de dados onde a tabela [[<code>InnoDB</code><code>db_schema</code>] reside. Este é um valor obrigatório.</td> </tr><tr> <td>[[<code>db_table</code>]]</td> <td>O nome da tabela [[<code>InnoDB</code>]] que armazena<span><strong>memcached</strong></span>valores. Este é um valor obrigatório.</td> </tr><tr> <td>[[<code>key_columns</code>]]</td> <td>A coluna na tabela [[<code>InnoDB</code>]] que contém os valores de chave de busca para<span><strong>memcached</strong></span>operações. Este é um valor obrigatório.</td> </tr><tr> <td>[[<code>value_columns</code>]]</td> <td>As colunas da tabela [[<code>InnoDB</code>]] (uma ou mais) que armazenam os dados [[<code>memcached</code>]]. Várias colunas podem ser especificadas usando o caractere de separador especificado na tabela [[<code>innodb_memcached.config_options</code>]]. Por padrão, o separador é um caractere de barra (<span class="quote">“<span class="quote">|
Português (Brasil):</span>”</span>). Para especificar várias colunas, separe-as com o caractere de separador definido. Por exemplo: [[<code>@@</code><code>db_schema</code>]. Este é um valor obrigatório.</td> </tr><tr> <td>[[<code>@@</code><code>db_schema</code>]</td> <td>As colunas da tabela [[<code>@@</code><code>db_table</code>] que são usadas como flags (um valor numérico definido pelo usuário que é armazenado e recuperado junto com o valor principal) para<span><strong>memcached</strong></span>Um valor de bandeira pode ser usado como especificador de coluna para algumas operações (como [[<code>@@</code><code>InnoDB</code>], [[<code>@@</code><code>key_columns</code>]) se um<span><strong>memcached</strong></span>O valor é mapeado para várias colunas, para que uma operação seja realizada em uma coluna especificada. Por exemplo, se você mapeou um [[<code>@@</code><code>InnoDB</code>] para três colunas de tabela [[<code>@@</code><code>value_columns</code>], e deseja apenas que a operação de incremento seja realizada em uma coluna, use a coluna [[<code>@@</code><code>InnoDB</code>] para especificar a coluna. Se você não usar a coluna [[<code>@@</code><code>memcached</code>], defina um valor de [[<code>@@</code><code>innodb_memcached.config_options</code>] para indicar que ela não está sendo usada.</td> </tr><tr> <td>[[<code>daemon_memcached</code><code>db_schema</code>]</td> <td>A coluna da tabela [[<code>daemon_memcached</code><code>db_schema</code>] que armazena valores de comparar e trocar (cas). O valor [[<code>daemon_memcached</code><code>db_table</code>] está relacionado à maneira<span><strong>memcached</strong></span>envia solicitações para diferentes servidores e armazena dados na memória. Como o [[<code>daemon_memcached</code><code>InnoDB</code>]<span><strong>memcached</strong></span>O plugin está intimamente integrado a um único<span><strong>memcached</strong></span>daemon, e o mecanismo de cache em memória é gerenciado pelo MySQL e pelo<a class="link" href="glossary.html#glos_buffer_pool" title="pool de buffer">Banco de buffers do InnoDB</a>, essa coluna raramente é necessária. Se você não usar essa coluna, defina um valor de [[<code>daemon_memcached</code><code>key_columns</code>] para indicar que ela não está sendo usada.</td> </tr><tr> <td>[[<code>daemon_memcached</code><code>InnoDB</code>]</td> <td>A coluna da tabela [[<code>daemon_memcached</code><code>value_columns</code>] que armazena os valores de expiração. O valor [[<code>daemon_memcached</code><code>InnoDB</code>] está relacionado à maneira<span><strong>memcached</strong></span>envia solicitações para diferentes servidores e armazena dados na memória. Como o [[<code>daemon_memcached</code><code>memcached</code>]<span><strong>memcached</strong></span>O plugin está intimamente integrado a um único<span><strong>memcached</strong></span>daemon, e o mecanismo de cache em memória é gerenciado pelo MySQL e pelo<a class="link" href="glossary.html#glos_buffer_pool" title="pool de buffer">Banco de buffers do InnoDB</a>Essa coluna raramente é necessária. Se você não usar essa coluna, defina um valor de [[<code>daemon_memcached</code><code>innodb_memcached.config_options</code>] para indicar que a coluna não está sendo usada. O tempo máximo de expiração é definido como [[<code>InnoDB</code><code>db_schema</code>] ou 2147483647 segundos (aproximadamente 68 anos).</td> </tr><tr> <td>[[<code>InnoDB</code><code>db_schema</code>]</td> <td>O nome do índice na coluna chave. Ele deve ser um índice único. Pode ser<a class="link" href="glossary.html#glos_primary_key" title="chave primária">chave primária</a>ou um<a class="link" href="glossary.html#glos_secondary_index" title="índice secundário">índice secundário</a>. De preferência, use a chave primária da tabela [[<code>InnoDB</code><code>db_table</code>]. Usar a chave primária evita uma consulta que é realizada ao usar um índice secundário. Você não pode fazer<a class="link" href="glossary.html#glos_covering_index" title="índice de cobertura">índice de cobertura</a>para<span><strong>memcached</strong></span>consultas; [[<code>InnoDB</code><code>InnoDB</code>] retorna um erro se você tentar definir um índice secundário composto sobre as colunas chave e valor.</td> </tr></tbody></table>

##### contêineres Tabela Restrições de coluna

- Você deve fornecer um valor para `db_schema`, `db_name`, `key_columns`, `value_columns` e `unique_idx_name_on_key`. Especifique `0` para `flags`, `cas_column` e `expire_time_column` se eles não estiverem sendo usados. Não fazer isso pode fazer com que sua configuração falhe.

- `key_columns`: O limite máximo para uma chave do **memcached** é de 250 caracteres, o que é exigido pelo **memcached**. A chave mapeada deve ser um tipo `CHAR` ou `VARCHAR` não nulo.

- `value_columns`: Deve ser mapeado para uma coluna `CHAR`, `VARCHAR` ou `BLOB`. Não há restrição de comprimento e o valor pode ser NULL.

- `cas_column`: O valor `cas` é um inteiro de 64 bits. Ele deve ser mapeado para um `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 8 bytes. Se você não usar essa coluna, defina um valor de `0` para indicar que ela não está sendo usada.

- `expiration_time_column`: Deve ser mapeado para um `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 4 bytes. O tempo de expiração é definido como um inteiro de 32 bits para a hora Unix (o número de segundos desde 1º de janeiro de 1970, como um valor de 32 bits) ou o número de segundos a partir do momento atual. Para este último, o número de segundos não pode exceder 60*60*24\*30 (o número de segundos em 30 dias). Se o número enviado por um cliente for maior, o servidor considera que é um valor real de hora Unix, em vez de um deslocamento do momento atual. Se você não usar esta coluna, defina um valor de `0` para indicar que ela não está sendo usada.

- `flags`: Deve ser mapeado para um `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de pelo menos 32 bits e pode ser NULL. Se você não usar essa coluna, defina um valor de `0` para indicar que ela não está sendo usada.

Uma verificação prévia é realizada no momento da carga do plugin para impor restrições de coluna. Se forem encontrados desvios, o plugin não é carregado.

##### Mapeamento de Coluna de Valor Múltiplo

- Durante a inicialização do plugin, quando o **memcached** do **InnoDB** é configurado com informações definidas na tabela `containers`, cada coluna mapeada definida em `containers.value_columns` é verificada contra a tabela **InnoDB** mapeada. Se várias colunas da tabela **InnoDB** forem mapeadas, há uma verificação para garantir que cada coluna exista e seja do tipo correto.

- Durante a execução, para operações de inserção no `memcached`, se houver mais valores delimitados do que o número de colunas mapeadas, apenas os valores mapeados são considerados. Por exemplo, se houver seis colunas mapeadas e sete valores delimitados forem fornecidos, apenas os primeiros seis valores delimitados são considerados. O sétimo valor delimitado é ignorado.

- Se houver menos valores delimitados do que colunas mapeadas, as colunas não preenchidas serão definidas como NULL. Se uma coluna não preenchida não puder ser definida como NULL, as operações de inserção falharão.

- Se uma tabela tiver mais colunas do que os valores mapeados, as colunas extras não afetam os resultados.

#### A tabela de exemplo demo\_test

O script de configuração `innodb_memcached_config.sql` cria uma tabela `demo_test` no banco de dados `test`, que pode ser usada para verificar a instalação do plugin `memcached` do **InnoDB** imediatamente após a configuração.

O script de configuração `innodb_memcached_config.sql` também cria uma entrada para a tabela `demo_test` na tabela `innodb_memcache.containers`.

```sql
mysql> SELECT * FROM innodb_memcache.containers\G
*************************** 1. row ***************************
                  name: aaa
             db_schema: test
              db_table: demo_test
           key_columns: c1
         value_columns: c2
                 flags: c3
            cas_column: c4
    expire_time_column: c5
unique_idx_name_on_key: PRIMARY

mysql> SELECT * FROM test.demo_test;
+----+------------------+------+------+------+
| c1 | c2               | c3   | c4   | c5   |
+----+------------------+------+------+------+
| AA | HELLO, HELLO     |    8 |    0 |    0 |
+----+------------------+------+------+------+
```
