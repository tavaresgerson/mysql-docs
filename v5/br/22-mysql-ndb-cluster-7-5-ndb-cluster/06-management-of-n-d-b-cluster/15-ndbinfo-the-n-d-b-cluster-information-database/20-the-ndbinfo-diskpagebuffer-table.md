#### 21.6.15.20 A tabela ndbinfo diskpagebuffer

A tabela `diskpagebuffer` fornece estatísticas sobre o uso do buffer de páginas de disco pelas tabelas de dados de disco do NDB Cluster.

A tabela `diskpagebuffer` contém as seguintes colunas:

- `node_id`

  O ID do nó de dados

- `block_instance`

  Bloquear instância

- `pages_written`

  Número de páginas escritas no disco.

- `pages_written_lcp`

  Número de páginas escritas por pontos de controle locais.

- `pages_read`

  Número de páginas lidas do disco

- `log_waits`

  Número de escritas de página à espera de que o log seja escrito no disco

- `page_requests_direct_return`

  Número de solicitações para páginas que estavam disponíveis no buffer

- `fila de espera de solicitações de página`

  Número de solicitações que tiveram que esperar até que as páginas ficassem disponíveis no buffer

- `page_requests_wait_io`

  Número de solicitações que tiveram que ser lidas a partir de páginas no disco (as páginas estavam indisponíveis no buffer)

##### Notas

Você pode usar essa tabela com tabelas de NDB Cluster Disk Data para determinar se o `DiskPageBufferMemory` é suficientemente grande para permitir que os dados sejam lidos do buffer em vez do disco; minimizar as buscas no disco pode ajudar a melhorar o desempenho dessas tabelas.

Você pode determinar a proporção de leituras do `DiskPageBufferMemory` em relação ao número total de leituras usando uma consulta como esta, que obtém essa proporção como uma porcentagem:

```sql
SELECT
  node_id,
  100 * page_requests_direct_return /
    (page_requests_direct_return + page_requests_wait_io)
      AS hit_ratio
FROM ndbinfo.diskpagebuffer;
```

O resultado dessa consulta deve ser semelhante ao mostrado aqui, com uma linha para cada nó de dados no clúster (neste exemplo, o clúster tem 4 nós de dados):

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

Valores de `hit_ratio` próximos a 100% indicam que apenas um número muito pequeno de leituras está sendo feito a partir do disco, em vez do buffer, o que significa que o desempenho da leitura de Dados de Disco está se aproximando de um nível ótimo. Se algum desses valores for menor que 95%, isso é um forte indicador de que o ajuste para `DiskPageBufferMemory` precisa ser aumentado no arquivo `config.ini`.

Nota

Uma alteração em `DiskPageBufferMemory` exige um reinício contínuo de todos os nós de dados do cluster antes que ela entre em vigor.

`block_instance` refere-se a uma instância de um bloco de kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`. Usando essas informações, você pode obter informações sobre métricas de buffer de página de disco relacionadas a threads individuais; um exemplo de consulta usando `LIMIT 1` para limitar o resultado a um único thread é mostrado aqui:

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
