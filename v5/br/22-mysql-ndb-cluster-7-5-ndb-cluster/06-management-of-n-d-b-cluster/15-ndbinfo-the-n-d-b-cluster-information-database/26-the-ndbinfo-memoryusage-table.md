#### 21.6.15.26 A Tabela ndbinfo memoryusage

Consultar esta tabela fornece informações semelhantes às fornecidas pelo comando [`ALL REPORT MemoryUsage`](mysql-cluster-mgm-client-commands.html#ndbclient-report) no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), ou registradas por [`ALL DUMP 1000`](/doc/ndb-internals/en/dump-command-1000.html).

A tabela `memoryusage` contém as seguintes colunas:

* `node_id`

  O node ID deste data node.

* `memory_type`

  Um dos seguintes: `Data memory`, `Index memory` ou `Long message buffer`.

* `used`

  Número de bytes atualmente usados para data memory ou index memory por este data node.

* `used_pages`

  Número de pages atualmente usadas para data memory ou index memory por este data node; veja o texto.

* `total`

  Número total de bytes de data memory ou index memory disponíveis para este data node; veja o texto.

* `total_pages`

  Número total de pages de memória disponíveis para data memory ou index memory neste data node; veja o texto.

##### Notas

A coluna `total` representa a quantidade total de memória em bytes disponível para o recurso fornecido (data memory ou index memory) em um data node específico. Este número deve ser aproximadamente igual à configuração do parâmetro de configuração correspondente no arquivo `config.ini`.

Suponha que o Cluster tenha 2 data nodes com node IDs `5` e `6`, e que o arquivo `config.ini` contenha o seguinte:

```sql
[ndbd default]
DataMemory = 1G
IndexMemory = 1G
```

Suponha também que o valor do parâmetro de configuração [`LongMessageBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-longmessagebuffer) possa assumir seu valor padrão (64 MB).

A seguinte Query mostra aproximadamente os mesmos valores:

```sql
mysql> SELECT node_id, memory_type, total
     > FROM ndbinfo.memoryusage;
+---------+---------------------+------------+
| node_id | memory_type         | total      |
+---------+---------------------+------------+
|       5 | Data memory         | 1073741824 |
|       5 | Index memory        | 1074003968 |
|       5 | Long message buffer |   67108864 |
|       6 | Data memory         | 1073741824 |
|       6 | Index memory        | 1074003968 |
|       6 | Long message buffer |   67108864 |
+---------+---------------------+------------+
6 rows in set (0.00 sec)
```

Neste caso, os valores da coluna `total` para index memory são ligeiramente superiores ao valor definido em [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) devido a arredondamentos internos.

Para as colunas `used_pages` e `total_pages`, os recursos são medidos em pages, que têm um tamanho de 32K para [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e 8K para [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory). Para long message buffer memory, o tamanho da page é de 256 bytes.