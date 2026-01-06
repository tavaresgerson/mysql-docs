### 21.5.28 ndb\_size.pl — Estimator de Requisitos de Tamanho do NDBCLUSTER

Este é um script em Perl que pode ser usado para estimar a quantidade de espaço que seria necessária para um banco de dados MySQL se fosse convertido para usar o mecanismo de armazenamento `NDBCLUSTER`. Ao contrário dos outros utilitários discutidos nesta seção, ele não requer acesso a um NDB Cluster (de fato, não há motivo para isso). No entanto, ele precisa acessar o servidor MySQL no qual o banco de dados a ser testado reside.

#### Requisitos

- Um servidor MySQL em execução. A instância do servidor não precisa fornecer suporte para o NDB Cluster.

- Uma instalação funcional do Perl.

- O módulo `DBI`, que pode ser obtido do CPAN, caso ele não já faça parte da sua instalação do Perl. (Muitas distribuições de Linux e outros sistemas operacionais fornecem seus próprios pacotes para essa biblioteca.)

- Uma conta de usuário do MySQL com os privilégios necessários. Se você não deseja usar uma conta existente, então criar uma usando `GRANT USAGE ON db_name.*` — onde *`db_name`* é o nome do banco de dados a ser examinado — é suficiente para esse propósito.

O arquivo `ndb_size.pl` também pode ser encontrado nas fontes do MySQL em `storage/ndb/tools`.

As opções que podem ser usadas com **ndb\_size.pl** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.44 Opções de linha de comando usadas com o programa ndb\_size.pl**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--real_table_name=string</a> </code>] </p></th> <td>Banco de dados ou bancos de dados a serem examinados; uma lista delimitada por vírgula; o padrão é TODOS (usar todos os bancos de dados encontrados no servidor)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--real_table_name=string</a> </code>] </p></th> <td>Especifique o host e a porta opcional no formato host[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--real_table_name=string</a> </code></td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--socket=path</a> </code>]] </p></th> <td>Especifique a porta de conexão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--user=string</a> </code>]] </p></th> <td>Especifique o nome do usuário do MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--password=password</a> </code>]] </p></th> <td>Especifique a senha do usuário MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_format">--format=string</a> </code>]] </p></th> <td>Defina o formato de saída (texto ou HTML)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--excludetables=list</a> </code>]] </p></th> <td>Pule qualquer tabela na lista separada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--excludedbs=list</a> </code>]] </p></th> <td>Pular quaisquer bancos de dados em lista separada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_debugging">--savequeries=path</a> </code>]] </p></th> <td>Salva todas as consultas no banco de dados em um arquivo especificado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_debugging">--loadqueries=path</a> </code>]] </p></th> <td>Carrega todas as consultas do arquivo especificado; não se conecta ao banco de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-size-pl.html#option_ndb_size_pl_options">--real_table_name=string</a> </code>]] </p></th> <td>Designa a tabela para lidar com cálculos de tamanho de índice único</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

#### Uso

```sql
perl ndb_size.pl [--database={db_name|ALL}] [--hostname=host[:port]] [--socket=socket] \
      [--user=user] [--password=password]  \
      [--help|-h] [--format={html|text}] \
      [--loadqueries=file_name] [--savequeries=file_name]
```

Por padrão, este utilitário tenta analisar todos os bancos de dados no servidor. Você pode especificar um único banco de dados usando a opção `--database`; o comportamento padrão pode ser explicitado usando `ALL` para o nome do banco de dados. Você também pode excluir um ou mais bancos de dados usando a opção `--excludedbs` com uma lista separada por vírgula dos nomes dos bancos de dados a serem ignorados. Da mesma forma, você pode fazer com que tabelas específicas sejam ignoradas, listando seus nomes, separados por vírgulas, seguindo a opção `--excludetables` opcional. Um nome de host pode ser especificado usando `--hostname`; o padrão é `localhost`. Você pode especificar uma porta além do host usando o formato `*host:*port*` para o valor de `--hostname`. O número de porta padrão é 3306. Se necessário, você também pode especificar um socket; o padrão é `/var/lib/mysql.sock`. Um nome de usuário e senha do MySQL podem ser especificados pelas opções correspondentes mostradas. Também é possível controlar o formato da saída usando a opção `--format`; isso pode assumir qualquer um dos valores `html` ou `text`, com `text` sendo o padrão. Um exemplo da saída em texto é mostrado aqui:

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

Para fins de depuração, os arrays Perl que contêm as consultas executadas por este script podem ser lidos a partir do arquivo especificado usando `--savequeries`; um arquivo contendo esses arrays pode ser especificado para ser lido durante a execução do script usando `--loadqueries`. Nenhuma dessas opções tem um valor padrão.

Para produzir o resultado no formato HTML, use a opção `--format` e redirecionando o resultado para um arquivo, como mostrado aqui:

```sql
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock --format=html > ndb_size.html
```

(Sem a redirecionamento, a saída é enviada para `stdout`.)

A saída deste script inclui as seguintes informações:

- Valores mínimos para os parâmetros de configuração `DataMemory`, `IndexMemory`, `MaxNoOfTables`, `MaxNoOfAttributes`, `MaxNoOfOrderedIndexes` e `MaxNoOfTriggers` necessários para acomodar as tabelas analisadas.

- Requisitos de memória para todas as tabelas, atributos, índices ordenados e índices hash únicos definidos no banco de dados.

- O `IndexMemory` e o `DataMemory` são necessários por tabela e linha de tabela.
