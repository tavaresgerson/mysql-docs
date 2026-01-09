#### 25.6.15.46 A tabela ndbinfo memoryusage

A consulta a essa tabela fornece informações semelhantes às fornecidas pelo comando `ALL REPORT MemoryUsage` no cliente **ndb_mgm** ou registradas pelo `ALL DUMP 1000`.

A tabela `memoryusage` contém as seguintes colunas:

* `node_id`

  O ID do nó deste nó de dados.

* `memory_type`

  Um dos tipos `Memória de dados`, `Memória de índice` ou `Buffer de mensagens longas`.

* `used`

  Número de bytes atualmente usados para memória de dados ou memória de índice por este nó de dados.

* `used_pages`

  Número de páginas atualmente usadas para memória de dados ou memória de índice por este nó de dados; veja o texto.

* `total`

  Número total de bytes de memória de dados ou memória de índice disponíveis para este nó de dados; veja o texto.

* `total_pages`

  Número total de páginas de memória disponíveis para memória de dados ou memória de índice neste nó de dados; veja o texto.

##### Notas

A coluna `total` representa a quantidade total de memória em bytes disponível para o recurso (memória de dados ou memória de índice) em um nó de dados específico. Esse número deve ser aproximadamente igual ao valor do parâmetro de configuração correspondente no arquivo `config.ini`.

Suponha que o clúster tenha 2 nós de dados com IDs de nó `5` e `6`, e o arquivo `config.ini` contenha o seguinte:

```
[ndbd default]
DataMemory = 1G
IndexMemory = 1G
```

Suponha também que o valor do parâmetro de configuração `LongMessageBuffer` seja permitido assumir seu valor padrão (64 MB).

A seguinte consulta mostra valores aproximadamente iguais:

```
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

Neste caso, os valores da coluna `total` para a memória de índice são ligeiramente maiores que o valor definido de `IndexMemory` devido à arredondamento interno.

Para as colunas `used_pages` e `total_pages`, os recursos são medidos em páginas, que têm 32K de tamanho para `DataMemory` e 8K para `IndexMemory`. Para a memória de buffer de mensagens longas, o tamanho da página é de 256 bytes.