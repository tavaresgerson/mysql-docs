### 21.5.28 ndb_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER

Este é um script Perl que pode ser usado para estimar a quantidade de espaço que seria exigida por um Database MySQL se ele fosse convertido para usar o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Diferentemente dos outros utilitários discutidos nesta seção, ele não requer acesso a um NDB Cluster (na verdade, não há razão para tal). No entanto, ele precisa acessar o MySQL Server onde o Database a ser testado reside.

#### Requisitos

* Um MySQL Server em execução. A instância do Server não precisa fornecer suporte para NDB Cluster.

* Uma instalação funcional do Perl.
* O módulo `DBI`, que pode ser obtido no CPAN se ainda não fizer parte de sua instalação Perl. (Muitas distribuições Linux e de outros sistemas operacionais fornecem seus próprios pacotes para esta biblioteca.)

* Uma conta de usuário MySQL com os privilégios necessários. Se você não desejar usar uma conta existente, criar uma usando `GRANT USAGE ON db_name.*`—onde *`db_name`* é o nome do Database a ser examinado—é suficiente para este propósito.

`ndb_size.pl` também pode ser encontrado nos fontes do MySQL em `storage/ndb/tools`.

As opções que podem ser usadas com [**ndb_size.pl**](mysql-cluster-programs-ndb-size-pl.html "21.5.28 ndb_size.pl — NDBCLUSTER Size Requirement Estimator") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.44 Opções de linha de comando usadas com o programa ndb_size.pl**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --database=string </code> </p></th> <td>Database ou Databases a examinar; uma lista delimitada por vírgulas; o padrão é ALL (usar todos os Databases encontrados no Server)</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --hostname=string </code> </p></th> <td>Especifica host e porta opcional no formato host[:port]</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --socket=path </code> </p></th> <td>Especifica o socket para conectar</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --user=string </code> </p></th> <td>Especifica o nome de usuário MySQL</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --password=password </code> </p></th> <td>Especifica a senha do usuário MySQL</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --format=string </code> </p></th> <td>Define o formato de saída (text ou HTML)</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --excludetables=list </code> </p></th> <td>Ignora quaisquer Tables em lista separada por vírgulas</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --excludedbs=list </code> </p></th> <td>Ignora quaisquer Databases em lista separada por vírgulas</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --savequeries=path </code> </p></th> <td>Salva todas as Queries no Database no arquivo especificado</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --loadqueries=path </code> </p></th> <td>Carrega todas as Queries do arquivo especificado; não conecta ao Database</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --real_table_name=string </code> </p></th> <td>Designa a Table para lidar com os cálculos de tamanho de Unique Index</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

#### Uso

```sql
perl ndb_size.pl [--database={db_name|ALL}] [--hostname=host[:port [--socket=socket] \
      [--user=user] [--password=password]  \
      [--help|-h] [--format={html|text}] \
      [--loadqueries=file_name] [--savequeries=file_name]
```

Por padrão, este utilitário tenta analisar todos os Databases no Server. Você pode especificar um único Database usando a opção `--database`; o comportamento padrão pode ser tornado explícito usando `ALL` para o nome do Database. Você também pode excluir um ou mais Databases usando a opção `--excludedbs` com uma lista separada por vírgulas dos nomes dos Databases a serem ignorados. Da mesma forma, você pode fazer com que Tables específicas sejam ignoradas listando seus nomes, separados por vírgulas, após a opção opcional `--excludetables`. Um hostname pode ser especificado usando `--hostname`; o padrão é `localhost`. Você pode especificar uma porta além do host usando o formato *`host`*:*`port`* para o valor de `--hostname`. O número da porta padrão é 3306. Se necessário, você também pode especificar um socket; o padrão é `/var/lib/mysql.sock`. Um nome de usuário e senha MySQL podem ser especificados pelas opções correspondentes mostradas. Também é possível controlar o formato da saída usando a opção `--format`; isso pode assumir os valores `html` ou `text`, sendo `text` o padrão. Um exemplo da saída em `text` é mostrado aqui:

```sql
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock
ndb_size.pl report for database: 'test' (1 tables)
--------------------------------------------------
Connected to: DBI:mysql:host=localhost;mysql_socket=/tmp/mysql.sock

Including information for versions: 4.1, 5.0, 5.1

test.t1
-------

DataMemory for Columns (* means varsized DataMemory):
         Column Name            Type  Varsized   Key  4.1  5.0   5.1
     HIDDEN_NDB_PKEY          bigint             PRI    8    8     8
                  c2     varchar(50)         Y         52   52    4*
                  c1         int(11)                    4    4     4
                                                       --   --    --
Fixed Size Columns DM/Row                              64   64    12
   Varsize Columns DM/Row                               0    0     4

DataMemory for Indexes:
   Index Name                 Type        4.1        5.0        5.1
      PRIMARY                BTREE         16         16         16
                                           --         --         --
       Total Index DM/Row                  16         16         16

IndexMemory for Indexes:
               Index Name        4.1        5.0        5.1
                  PRIMARY         33         16         16
                                  --         --         --
           Indexes IM/Row         33         16         16

Summary (for THIS table):
                                 4.1        5.0        5.1
    Fixed Overhead DM/Row         12         12         16
           NULL Bytes/Row          4          4          4
           DataMemory/Row         96         96         48
                    (Includes overhead, bitmap and indexes)

  Varsize Overhead DM/Row          0          0          8
   Varsize NULL Bytes/Row          0          0          4
       Avg Varside DM/Row          0          0         16

                 No. Rows          0          0          0

        Rows/32kb DM Page        340        340        680
Fixedsize DataMemory (KB)          0          0          0

Rows/32kb Varsize DM Page          0          0       2040
  Varsize DataMemory (KB)          0          0          0

         Rows/8kb IM Page        248        512        512
         IndexMemory (KB)          0          0          0

Parameter Minimum Requirements
------------------------------
* indicates greater than default

                Parameter     Default        4.1         5.0         5.1
          DataMemory (KB)       81920          0           0           0
       NoOfOrderedIndexes         128          1           1           1
               NoOfTables         128          1           1           1
         IndexMemory (KB)       18432          0           0           0
    NoOfUniqueHashIndexes          64          0           0           0
           NoOfAttributes        1000          3           3           3
             NoOfTriggers         768          5           5           5
```

Para fins de debugging, os arrays Perl contendo as Queries executadas por este script podem ser salvos em um arquivo usando `--savequeries`; um arquivo contendo tais arrays a serem lidos durante a execução do script pode ser especificado usando `--loadqueries`. Nenhuma dessas opções tem um valor padrão.

Para produzir saída no formato HTML, use a opção `--format` e redirecione a saída para um arquivo, como mostrado aqui:

```sql
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock --format=html > ndb_size.html
```

(Sem o redirecionamento, a saída é enviada para `stdout`.)

A saída deste script inclui as seguintes informações:

* Valores mínimos para os parâmetros de configuração [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory), [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) e [`MaxNoOfTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftriggers) necessários para acomodar as Tables analisadas.

* Requisitos de memória para todas as Tables, attributes, Ordered Indexes e Unique Hash Indexes definidos no Database.

* O [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) e [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) exigidos por Table e por linha de Table (table row).