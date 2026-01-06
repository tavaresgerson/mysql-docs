#### 21.6.15.26 Tabela ndbinfo memoryusage

A consulta a esta tabela fornece informações semelhantes às fornecidas pelo comando `ALL REPORT MemoryUsage` no cliente **ndb\_mgm**, ou registradas pelo comando `ALL DUMP 1000`.

A tabela `memoryusage` contém as seguintes colunas:

- `node_id`

  O ID do nó deste nó de dados.

- `tipo_memória`

  Uma das memórias de dados, memórias de índice ou buffer de mensagens longas.

- "usada"

  Número de bytes atualmente utilizados para memória de dados ou memória de índice por este nó de dados.

- `used_pages`

  Número de páginas atualmente utilizadas para memória de dados ou memória de índice por este nó de dados; veja o texto.

- `total`

  Número total de bytes de memória de dados ou memória de índice disponíveis para este nó de dados; veja o texto.

- `total_pages`

  Número total de páginas de memória disponíveis para memória de dados ou memória de índice neste nó de dados; veja o texto.

##### Notas

A coluna `total` representa a quantidade total de memória em bytes disponível para o recurso dado (memória de dados ou memória de índice) em um nó de dados específico. Esse número deve ser aproximadamente igual ao valor do parâmetro de configuração correspondente no arquivo `config.ini`.

Suponha que o cluster tenha 2 nós de dados com IDs de nó `5` e `6`, e o arquivo `config.ini` contenha o seguinte:

```sql
[ndbd default]
DataMemory = 1G
IndexMemory = 1G
```

Suponha também que o valor do parâmetro de configuração `LongMessageBuffer` seja permitido assumir seu valor padrão (64 MB).

A consulta a seguir mostra valores aproximadamente iguais:

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

Neste caso, os valores da coluna `total` para a memória de índice são ligeiramente maiores do que o valor definido em `IndexMemory` devido à arredondamento interno.

Para as colunas `used_pages` e `total_pages`, os recursos são medidos em páginas, que têm 32K de tamanho para `DataMemory` e 8K para `IndexMemory`. Para a memória de buffer de mensagens longas, o tamanho da página é de 256 bytes.
