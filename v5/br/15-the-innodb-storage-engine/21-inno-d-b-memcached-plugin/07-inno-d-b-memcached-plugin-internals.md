### 14.21.7 Detalhes Internos do Plugin memcached do InnoDB

#### API do InnoDB para o Plugin memcached do InnoDB

O mecanismo **memcached** do `InnoDB` acessa o `InnoDB` através de APIs do `InnoDB`, a maioria das quais é diretamente adotada do `InnoDB` embutido. As funções da API do `InnoDB` são passadas para o mecanismo **memcached** do `InnoDB` como funções de callback. As funções da API do `InnoDB` acessam as tabelas `InnoDB` diretamente e são, em sua maioria, operações DML, com exceção de `TRUNCATE TABLE`.

Os comandos **memcached** são implementados através da API **memcached** do `InnoDB`. A tabela a seguir descreve como os comandos **memcached** são mapeados para operações DML ou DDL.

**Tabela 14.21 Comandos memcached e Operações DML ou DDL Associadas**

| Comando memcached | Operações DML ou DDL |
| :--- | :--- |
| `get` | um comando de read/fetch |
| `set` | uma busca seguida por um `INSERT` ou `UPDATE` (dependendo se uma key existe ou não) |
| `add` | uma busca seguida por um `INSERT` ou `UPDATE` |
| `replace` | uma busca seguida por um `UPDATE` |
| `append` | uma busca seguida por um `UPDATE` (anexa dados ao resultado antes do `UPDATE`) |
| `prepend` | uma busca seguida por um `UPDATE` (precede dados ao resultado antes do `UPDATE`) |
| `incr` | uma busca seguida por um `UPDATE` |
| `decr` | uma busca seguida por um `UPDATE` |
| `delete` | uma busca seguida por um `DELETE` |
| `flush_all` | `TRUNCATE TABLE` (DDL) |

#### Tabelas de Configuração do Plugin memcached do InnoDB

Esta seção descreve as tabelas de configuração usadas pelo plugin `daemon_memcached`. As tabelas `cache_policies`, `config_options` e `containers` são criadas pelo script de configuração `innodb_memcached_config.sql` no Database `innodb_memcache`.

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

#### Tabela cache_policies

A tabela `cache_policies` define uma política de cache para a instalação `memcached` do `InnoDB`. Você pode especificar políticas individuais para as operações `get`, `set`, `delete` e `flush`, dentro de uma única política de cache. A configuração padrão para todas as operações é `innodb_only`.

*   `innodb_only`: Usa o `InnoDB` como data store.

*   `cache_only`: Usa o mecanismo **memcached** como data store.

*   `caching`: Usa tanto o `InnoDB` quanto o mecanismo **memcached** como data stores. Neste caso, se o **memcached** não conseguir encontrar uma key na memória, ele busca o valor em uma tabela `InnoDB`.

*   `disable`: Desabilita o cache.

**Tabela 14.22 Colunas da tabela cache_policies**

| Coluna | Descrição |
| :--- | :--- |
| `policy_name` | Nome da política de cache. O nome da política de cache padrão é `cache_policy`. |
| `get_policy` | A política de cache para operações get. Os valores válidos são `innodb_only`, `cache_only`, `caching` ou `disabled`. A configuração padrão é `innodb_only`. |
| `set_policy` | A política de cache para operações set. Os valores válidos são `innodb_only`, `cache_only`, `caching` ou `disabled`. A configuração padrão é `innodb_only`. |
| `delete_policy` | A política de cache para operações delete. Os valores válidos são `innodb_only`, `cache_only`, `caching` ou `disabled`. A configuração padrão é `innodb_only`. |
| `flush_policy` | A política de cache para operações flush. Os valores válidos são `innodb_only`, `cache_only`, `caching` ou `disabled`. A configuração padrão é `innodb_only`. |

#### Tabela config_options

A tabela `config_options` armazena configurações relacionadas ao **memcached** que podem ser alteradas em tempo de execução usando SQL. As opções de configuração suportadas são `separator` e `table_map_delimiter`.

**Tabela 14.23 Colunas da tabela config_options**

| Coluna | Descrição |
| :--- | :--- |
| `Name` | Nome da opção de configuração relacionada ao **memcached**. As seguintes opções de configuração são suportadas pela tabela `config_options`: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> `separator`: Usado para separar valores de uma string longa em valores separados quando há múltiplas `value_columns` definidas. Por padrão, o `separator` é o caractere `|`. Por exemplo, se você definir `col1, col2` como value columns, e definir `|` como o separator, você pode emitir o seguinte comando **memcached** para inserir valores em `col1` e `col2`, respectivamente: </p><pre class="programlisting copytoclipboard language-terminal"><code class="language-terminal">set keyx 10 0 19 valuecolx|valuecoly</code></pre><p> `valuecol1x` é armazenado em `col1` e `valuecoly` é armazenado em `col2`. </p></li><li class="listitem"><p> `table_map_delimiter`: O caractere que separa o nome do schema e o nome da table quando você usa a notação `@@` em um nome de key para acessar uma key em uma table específica. Por exemplo, `@@t1.some_key` e `@@t2.some_key` têm o mesmo valor de key, mas são armazenados em tables diferentes. </p></li></ul> </div> |
| `Value` | O valor atribuído à opção de configuração relacionada ao **memcached**. |

#### Tabela containers

A tabela `containers` é a mais importante das três tabelas de configuração. Cada tabela `InnoDB` usada para armazenar valores **memcached** deve ter uma entrada na tabela `containers`. A entrada fornece um mapeamento entre as colunas da tabela `InnoDB` e as colunas da tabela container, o que é necessário para que o `memcached` funcione com tabelas `InnoDB`.

A tabela `containers` contém uma entrada padrão para a tabela `test.demo_test`, que é criada pelo script de configuração `innodb_memcached_config.sql`. Para usar o plugin `daemon_memcached` com sua própria tabela `InnoDB`, você deve criar uma entrada na tabela `containers`.

**Tabela 14.24 Colunas da tabela containers**

| Coluna | Descrição |
| :--- | :--- |
| `name` | O nome dado ao container. Se uma tabela `InnoDB` não for solicitada por nome usando a notação `@@`, o plugin `daemon_memcached` usa a tabela `InnoDB` com um valor `containers.name` de `default`. Se não houver tal entrada, a primeira entrada na tabela `containers`, ordenada alfabeticamente por `name` (ascendente), determina a tabela `InnoDB` padrão. |
| `db_schema` | O nome do Database onde a tabela `InnoDB` reside. Este é um valor obrigatório. |
| `db_table` | O nome da tabela `InnoDB` que armazena valores **memcached**. Este é um valor obrigatório. |
| `key_columns` | A coluna na tabela `InnoDB` que contém valores de lookup key para operações **memcached**. Este é um valor obrigatório. |
| `value_columns` | As colunas da tabela `InnoDB` (uma ou mais) que armazenam dados `memcached`. Múltiplas colunas podem ser especificadas usando o caractere separator definido na tabela `innodb_memcached.config_options`. Por padrão, o separator é um caractere pipe (“\|”). Para especificar múltiplas colunas, separe-as com o caractere separator definido. Por exemplo: `col1|col2|col3`. Este é um valor obrigatório. |
| `flags` | As colunas da tabela `InnoDB` que são usadas como flags (um valor numérico definido pelo usuário que é armazenado e recuperado junto com o valor principal) para **memcached**. Um valor flag pode ser usado como um especificador de coluna para algumas operações (como `incr`, `prepend`) se um valor **memcached** for mapeado para múltiplas colunas, para que uma operação seja realizada em uma coluna especificada. Por exemplo, se você mapeou `value_columns` para três colunas da tabela `InnoDB` e deseja que a operação de increment seja executada apenas em uma coluna, use a coluna `flags` para especificar a coluna. Se você não usar a coluna `flags`, defina um valor de `0` para indicar que não está sendo usada. |
| `cas_column` | A coluna da tabela `InnoDB` que armazena valores compare-and-swap (cas). O valor `cas_column` está relacionado à forma como o **memcached** faz hash de requests para diferentes servidores e armazena dados em cache na memória. Como o plugin **memcached** do `InnoDB` está totalmente integrado a um único daemon **memcached**, e o mecanismo de caching in-memory é tratado pelo MySQL e pelo Buffer Pool do InnoDB, esta coluna raramente é necessária. Se você não usar esta coluna, defina um valor de `0` para indicar que não está sendo usada. |
| `expire_time_column` | A coluna da tabela `InnoDB` que armazena valores de expiração. O valor `expire_time_column` está relacionado à forma como o **memcached** faz hash de requests para diferentes servidores e armazena dados em cache na memória. Como o plugin **memcached** do `InnoDB` está totalmente integrado a um único daemon **memcached**, e o mecanismo de caching in-memory é tratado pelo MySQL e pelo Buffer Pool do InnoDB, esta coluna raramente é necessária. Se você não usar esta coluna, defina um valor de `0` para indicar que a coluna não está sendo usada. O tempo máximo de expiração é definido como `INT_MAX32` ou 2147483647 segundos (aproximadamente 68 anos). |
| `unique_idx_name_on_key` | O nome do Index na coluna key. Deve ser um Unique Index. Pode ser a Primary Key ou um Secondary Index. Preferencialmente, use a Primary Key da tabela `InnoDB`. O uso da Primary Key evita um lookup que é realizado ao usar um Secondary Index. Você não pode criar um covering index para lookups **memcached**; o `InnoDB` retorna um erro se você tentar definir um Secondary Index composto sobre as colunas key e value. |

##### Restrições de Coluna da Tabela containers

*   Você deve fornecer um valor para `db_schema`, `db_name`, `key_columns`, `value_columns` e `unique_idx_name_on_key`. Especifique `0` para `flags`, `cas_column` e `expire_time_column` se não estiverem sendo usados. Não fazer isso pode causar falha na sua configuração.

*   `key_columns`: O limite máximo para uma key **memcached** é de 250 caracteres, que é imposto pelo **memcached**. A key mapeada deve ser do tipo `CHAR` ou `VARCHAR` não-NULL.

*   `value_columns`: Deve ser mapeada para uma coluna `CHAR`, `VARCHAR` ou `BLOB`. Não há restrição de comprimento e o valor pode ser NULL.

*   `cas_column`: O valor `cas` é um integer de 64 bits. Deve ser mapeado para um `BIGINT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) de pelo menos 8 bytes. Se você não usar esta coluna, defina um valor de `0` para indicar que não está sendo usada.

*   `expiration_time_column`: Deve ser mapeada para um `INTEGER` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) de pelo menos 4 bytes. O tempo de expiração é definido como um integer de 32 bits para o tempo Unix (o número de segundos desde 1º de janeiro de 1970, como um valor de 32 bits), ou o número de segundos a partir do tempo atual. Para este último, o número de segundos não pode exceder 60\*60\*24\*30 (o número de segundos em 30 dias). Se o número enviado por um cliente for maior, o servidor o considera um valor de tempo Unix real, e não um offset do tempo atual. Se você não usar esta coluna, defina um valor de `0` para indicar que não está sendo usada.

*   `flags`: Deve ser mapeada para um `INTEGER` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) de pelo menos 32 bits e pode ser NULL. Se você não usar esta coluna, defina um valor de `0` para indicar que não está sendo usada.

Uma verificação prévia é realizada no momento do carregamento do plugin para aplicar as restrições de coluna. Se forem encontradas incompatibilidades, o plugin não é carregado.

##### Mapeamento de Múltiplas Colunas de Valores

*   Durante a inicialização do plugin, quando o **memcached** do `InnoDB` é configurado com informações definidas na tabela `containers`, cada coluna mapeada definida em `containers.value_columns` é verificada em relação à tabela `InnoDB` mapeada. Se múltiplas colunas da tabela `InnoDB` forem mapeadas, há uma verificação para garantir que cada coluna exista e seja do tipo correto.

*   Em tempo de execução, para operações `insert` do `memcached`, se houver mais valores delimitados do que o número de colunas mapeadas, apenas o número de valores mapeados será considerado. Por exemplo, se houver seis colunas mapeadas e sete valores delimitados forem fornecidos, apenas os seis primeiros valores delimitados serão considerados. O sétimo valor delimitado é ignorado.

*   Se houver menos valores delimitados do que colunas mapeadas, as colunas não preenchidas são definidas como NULL. Se uma coluna não preenchida não puder ser definida como NULL, as operações `insert` falham.

*   Se uma table tiver mais colunas do que valores mapeados, as colunas extras não afetam os resultados.

#### A Tabela de Exemplo demo_test

O script de configuração `innodb_memcached_config.sql` cria uma tabela `demo_test` no Database `test`, que pode ser usada para verificar a instalação do plugin **memcached** do `InnoDB` imediatamente após a configuração.

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