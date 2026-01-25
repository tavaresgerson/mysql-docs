#### 21.6.15.20 A Tabela ndbinfo diskpagebuffer

A tabela `diskpagebuffer` fornece estatísticas sobre o uso do buffer de páginas de disco (disk page buffer) pelas tabelas NDB Cluster Disk Data.

A tabela `diskpagebuffer` contém as seguintes colunas:

* `node_id`

  O ID do node de dados

* `block_instance`

  Instância do Block

* `pages_written`

  Número de páginas escritas no disco.

* `pages_written_lcp`

  Número de páginas escritas por local checkpoints.

* `pages_read`

  Número de páginas lidas do disco

* `log_waits`

  Número de page writes esperando que o log seja escrito no disco

* `page_requests_direct_return`

  Número de requests por páginas que estavam disponíveis no buffer

* `page_requests_wait_queue`

  Número de requests que tiveram que esperar as páginas ficarem disponíveis no buffer

* `page_requests_wait_io`

  Número de requests que tiveram que ser lidas das páginas no disco (páginas estavam indisponíveis no buffer)

##### Notas

Você pode usar esta tabela com as tabelas NDB Cluster Disk Data para determinar se o [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) é grande o suficiente para permitir que os dados sejam lidos do buffer em vez de serem lidos do disco; minimizar os disk seeks pode ajudar a melhorar a performance dessas tabelas.

Você pode determinar a proporção de leituras do [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) em relação ao número total de leituras usando uma Query como esta, que obtém essa proporção como uma porcentagem:

```sql
SELECT
  node_id,
  100 * page_requests_direct_return /
    (page_requests_direct_return + page_requests_wait_io)
      AS hit_ratio
FROM ndbinfo.diskpagebuffer;
```

O resultado desta Query deve ser semelhante ao mostrado aqui, com uma linha para cada data node no cluster (neste exemplo, o cluster tem 4 data nodes):

```sql
+---------+-----------+
| node_id | hit_ratio |
+---------+-----------+
|       5 |   97.6744 |
|       6 |   97.6879 |
|       7 |   98.1776 |
|       8 |   98.1343 |
+---------+-----------+
4 rows in set (0.00 sec)
```

Valores de `hit_ratio` próximos a 100% indicam que apenas um número muito pequeno de leituras está sendo feito a partir do disco em vez de serem feitos a partir do buffer, o que significa que a performance de leitura do Disk Data está se aproximando de um nível ideal. Se qualquer um desses valores for inferior a 95%, este é um forte indicador de que a configuração para [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) precisa ser aumentada no arquivo `config.ini`.

Nota

Uma alteração no [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) requer um rolling restart de todos os data nodes do cluster antes que ela entre em vigor.

`block_instance` refere-se a uma instância de um kernel block. Juntamente com o nome do block, este número pode ser usado para procurar uma determinada instância na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 A Tabela ndbinfo threadblocks"). Usando esta informação, você pode obter métricas sobre o disk page buffer relacionadas a Threads individuais; um exemplo de Query usando `LIMIT 1` para limitar a saída a uma única Thread é mostrado aqui:

```sql
mysql> SELECT
     >   node_id, thr_no, block_name, thread_name, pages_written,
     >   pages_written_lcp, pages_read, log_waits,
     >   page_requests_direct_return, page_requests_wait_queue,
     >   page_requests_wait_io
     > FROM ndbinfo.diskpagebuffer
     >   INNER JOIN ndbinfo.threadblocks USING (node_id, block_instance)
     >   INNER JOIN ndbinfo.threads USING (node_id, thr_no)
     > WHERE block_name = 'PGMAN' LIMIT 1\G
*************************** 1. row ***************************
                    node_id: 1
                     thr_no: 1
                 block_name: PGMAN
                thread_name: rep
              pages_written: 0
          pages_written_lcp: 0
                 pages_read: 1
                  log_waits: 0
page_requests_direct_return: 4
   page_requests_wait_queue: 0
      page_requests_wait_io: 1
1 row in set (0.01 sec)
```