### 21.5.14 ndb\_import — Importar dados CSV no NDB

**ndb\_import** importa dados formatados em CSV, como os produzidos pelo **mysqldump**, diretamente no `NDB` usando a API NDB. **ndb\_import** requer uma conexão com um servidor de gerenciamento NDB (**ndb\_mgmd**) para funcionar; ele não requer uma conexão com um servidor MySQL.

#### Uso

```sql
ndb_import db_name file_name options
```

**ndb\_import** requer dois argumentos. *`db_name`* é o nome do banco de dados onde a tabela para a qual os dados serão importados está localizada; *`file_name`* é o nome do arquivo CSV a partir do qual os dados serão lidos; este deve incluir o caminho para esse arquivo, se ele não estiver no diretório atual. O nome do arquivo deve corresponder ao da tabela; a extensão do arquivo, se houver, não é considerada. As opções suportadas por **ndb\_import** incluem as para especificar separadores de campo, escapamentos e terminadores de linha, e são descritas mais adiante nesta seção.

**ndb\_import** rejeita quaisquer linhas vazias lidas do arquivo CSV.

**ndb\_import** deve ser capaz de se conectar a um servidor de gerenciamento do NDB Cluster; por essa razão, deve haver um slot `[api]` não utilizado no arquivo `config.ini` do cluster.

Para duplicar uma tabela existente que utiliza um motor de armazenamento diferente, como `InnoDB`, como uma tabela `NDB`, use o cliente **mysql** para executar uma declaração `**SELECT INTO OUTFILE** para exportar a tabela existente para um arquivo CSV, depois execute uma declaração `**CREATE TABLE LIKE** para criar uma nova tabela com a mesma estrutura da tabela existente, depois execute `**ALTER TABLE ... ENGINE=NDB** na nova tabela; depois disso, do shell do sistema, invoque **ndb_import** para carregar os dados na nova tabela `NDB`. Por exemplo, uma tabela `InnoDB`existente chamada`myinnodb\_table`em um banco de dados chamado`myinnodb`pode ser exportada para uma tabela`NDB`chamada`myndb\_table`em um banco de dados chamado`myndb\`, como mostrado aqui, assumindo que você já está logado como um usuário MySQL com os privilégios apropriados:

1. No cliente **mysql**:

   ```sql
   mysql> USE myinnodb;

   mysql> SELECT * INTO OUTFILE '/tmp/myndb_table.csv'
        >  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
        >  LINES TERMINATED BY '\n'
        >  FROM myinnodbtable;

   mysql> CREATE DATABASE myndb;

   mysql> USE myndb;

   mysql> CREATE TABLE myndb_table LIKE myinnodb.myinnodb_table;

   mysql> ALTER TABLE myndb_table ENGINE=NDB;

   mysql> EXIT;
   Bye
   $>
   ```

   Depois que o banco de dados e a tabela de destino forem criados, não será mais necessário manter um **mysqld** em execução. Você pode interromper ele usando **mysqladmin shutdown** ou outro método, se desejar, antes de prosseguir.

2. Na janela do sistema:

   ```sql
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   A saída deve se assemelhar ao que está mostrado aqui:

   ```sql
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

As opções que podem ser usadas com **ndb\_import** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.33 Opções de linha de comando usadas com o programa ndb\_import**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Arrume o núcleo para qualquer erro fatal; usado para depuração</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Para uma tabela com PK oculto, especifique o incremento de autoincremento. Veja o mysqld</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>] </p></th> <td>Para uma tabela com PK oculto, especifique o deslocamento de autoincremento. Veja o mysqld</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>] </p></th> <td>Para uma tabela com PK oculto, especifique o número de valores de autoincremento que serão pré-carregados. Veja o mysqld</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>] </p></th> <td>Número de conexões de cluster a criar</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>]] </p></th> <td>Quando o trabalho falhar, continue para o próximo trabalho</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-increment">--ai-increment=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>]] </p></th> <td>Opção abreviada para definir valores típicos de opções CSV. Consulte a documentação para sintaxe e outras informações</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>]] </p></th> <td>Número de threads, por nó de dados, executando operações de banco de dados</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>]] </p></th> <td>Erro: tipo de inserção, para fins de teste; use "lista" para obter todos os valores possíveis</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>]] </p></th> <td>Atraso no inserimento de erro em milissegundos; variação aleatória é adicionada</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>]] </p></th> <td>O mesmo que a opção FIELDS ENCLOSED BY para as instruções LOAD DATA. Para entrada de CSV, isso é o mesmo que usar a opção --fields-enclosed-optionally-by</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Igual à opção FIELDS ESCAPED BY para as instruções LOAD DATA</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>O mesmo que a opção FIELDS opcionalmente incluída na opção para instruções LOAD DATA</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>] </p></th> <td>O mesmo que a opção TERMINADOS POR CAMPOS para as instruções LOAD DATA</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Número de milissegundos para dormir enquanto espera mais tarefas para fazer</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Número de vezes para tentar novamente antes de idlesleep</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>] </p></th> <td>Ignore as primeiras linhas do arquivo de entrada. Usado para ignorar um cabeçalho não de dados</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>] </p></th> <td>Tipo de entrada: aleatório ou csv</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-offset">--ai-offset=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>] </p></th> <td>Número de threads processando a entrada. Deve ser 2 ou mais se --input-type for csv</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Os arquivos de estado (exceto arquivos *.rej não vazios) são normalmente removidos após a conclusão do trabalho. Ao usar essa opção, todos os arquivos de estado são preservados em vez disso.</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>O mesmo que a opção LINHAS TERMINADAS POR para as instruções LOAD DATA</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>] </p></th> <td>Importe apenas esse número de linhas de dados de entrada; o padrão é 0, que importa todas as linhas</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Imprima periodicamente o status do trabalho em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). O valor 0 desabilita. O valor 1 imprime qualquer mudança observada. Valores mais altos reduzem a impressão do status exponencialmente até um limite pré-definido</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ai-prefetch-sz">--ai-prefetch-sz=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Execute operações de banco de dados em lotes, em transações únicas</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>] </p></th> <td>Informe ao coordenador de transações que não deve usar a dica de chave de distribuição ao selecionar o nó de dados</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Um lote de execução de banco de dados é um conjunto de transações e operações enviadas ao kernel NDB. Esta opção limita as operações do NDB (incluindo operações de blob) em um lote de execução de banco de dados. Portanto, também limita o número de transações assíncronas. O valor 0 não é válido</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Limitar bytes no lote de execução (padrão 0 = sem limite)</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Tipo de saída: ndb é padrão, nulo é usado para testes</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>] </p></th> <td>Número de threads processando saída ou repassando operações de banco de dados</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>] </p></th> <td>Alinhe os buffers de entrada/saída ao tamanho especificado</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>] </p></th> <td>Tamanho dos buffers de E/S como múltiplo do tamanho da página. O trabalhador de entrada CSV aloca um buffer do dobro do tamanho</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Tempo de espera por pesquisa para transações assíncronas concluídas; a pesquisa continua até que todas as pesquisas sejam concluídas ou ocorrer um erro</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>] </p></th> <td>Limite o número de linhas rejeitadas (linhas com erro permanente) na carga de dados. O padrão é 0, o que significa que qualquer linha rejeitada causa um erro fatal. A linha que exceder o limite também é adicionada ao *.rej</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>] </p></th> <td>Se o trabalho for abortado (erro temporário, usuário interrompe), retome com as linhas ainda não processadas</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Limitar linhas em filas de linhas (padrão 0 = sem limite); deve ser 1 ou mais se --input-type for aleatório</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Limitar bytes nas filas de linha (0 = sem limite)</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Onde escrever arquivos de estado; o diretório atual é o padrão</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-type">--errins-type=name</a> </code>] </p></th> <td>Salve as opções relacionadas ao desempenho e as estatísticas internas em arquivos *.sto e *.stt. Esses arquivos são mantidos após a conclusão bem-sucedida, mesmo que a opção --keep-state não seja usada.</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_errins-delay">--errins-delay=#</a> </code>] </p></th> <td>Número de milissegundos para dormir entre erros temporários</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retries">--connect-retries=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by">--fields-enclosed-by=char</a> </code>] </p></th> <td>Número de vezes que uma transação pode falhar devido a um erro temporário, por lote de execução; 0 significa que qualquer erro temporário é fatal. Esses erros não fazem com que nenhuma linha seja escrita no arquivo .rej</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_continue">--continue</a> </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_csvopt">--csvopt=opts</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_db-workers">--db-workers=#</a> </code>] </p></th> <td>Ative a saída detalhada</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-extra-file">--defaults-extra-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-retry-delay">--connect-retry-delay=#</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>ADICIONADO: NDB 7.6.2</p></td> </tr></tbody></table>

- `--abort-on-error`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Arrume o núcleo para qualquer erro fatal; usado apenas para depuração.

- `--ai-increment=*#`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Para uma tabela com uma chave primária oculta, especifique o incremento de autoincremento, como a variável de sistema `auto_increment_increment` faz no MySQL Server.

- `--ai-offset=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Para uma tabela com chave primária oculta, especifique o deslocamento de autoincremento. Semelhante à variável de sistema `auto_increment_offset`.

- `--ai-prefetch-sz=*#`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Para uma tabela com uma chave primária oculta, especifique o número de valores de autoincremento pré-carregados. Funciona da mesma forma que a variável de sistema `ndb_autoincrement_prefetch_sz` faz no MySQL Server.

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connections`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connections=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Número de conexões de cluster a criar.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--continue`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  Quando um trabalho falhar, continue para o próximo trabalho.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--csvopt=*`string\`\*

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Fornece um método de atalho para definir opções típicas de importação de CSV. O argumento desta opção é uma string que consiste em um ou mais dos seguintes parâmetros:

  - `c`: Campos terminados por vírgula

  - `d`: Use os padrões, exceto quando sobrescrito por outro parâmetro

  - `n`: Linhas terminadas por `\n`

  - `q`: Campos opcionalmente fechados por caracteres de aspas duplas (`"`)

  - `r`: Linha terminada por `\r`

  A ordem dos parâmetros não faz diferença, exceto que, se tanto `n` quanto `r` forem especificados, o último será o parâmetro que terá efeito.

  Esta opção é destinada ao uso em testes em condições nas quais é difícil transmitir escapamentos ou aspas.

- `--db-workers=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Número de threads, por nó de dados, executando operações de banco de dados.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Leia também grupos com concatenação (grupo, sufixo).

- `--errins-type=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Erro: tipo de inserção; use `list` como o valor de *`name`* para obter todos os valores possíveis. Esta opção é usada apenas para fins de teste.

- `--errins-delay=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Atraso de inserção de erro em milissegundos; variação aleatória é adicionada. Esta opção é usada apenas para fins de teste.

- `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--abort-on-error</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  Isso funciona da mesma maneira que a opção `FIELDS ENCLOSED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como delimitador de valores de campo. Para entrada CSV, isso é o mesmo que `--fields-optionally-enclosed-by`.

- `--fields-escaped-by=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>0

  Especifique um caractere de escape da mesma maneira que a opção `FIELDS ESCAPED BY` faz para a instrução SQL `LOAD DATA`.

- `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>1

  Isso funciona da mesma maneira que a opção `FIELDS OPTIONALLY ENCLOSED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como citação opcional de valores de campo. Para entrada CSV, isso é o mesmo que `--fields-enclosed-by`.

- `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>2

  Isso funciona da mesma maneira que a opção `FIELDS TERMINATED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como o separador de campos.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>3

  Exibir texto de ajuda e sair.

- `--idlesleep=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>4

  Número de milissegundos para dormir enquanto espera para realizar mais trabalho.

- `--idlespin=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>5

  Número de vezes para tentar novamente antes de dormir.

- `--ignore-lines=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>6

  Faça com que o ndb\_import ignore as primeiras linhas `#` do arquivo de entrada. Isso pode ser usado para ignorar o cabeçalho de um arquivo que não contém dados.

- `--input-type=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>7

  Defina o tipo de entrada. O padrão é `csv`; `random` é destinado apenas para fins de teste.

- `--input-workers=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>8

  Defina o número de threads que processarão a entrada.

- `--keep-state`

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-increment=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>9

  Por padrão, o ndb\_import remove todos os arquivos de estado (exceto arquivos `*.rej` não vazios) quando conclui uma tarefa. Especifique esta opção (não é necessário fornecer argumento) para forçar o programa a reter todos os arquivos de estado.

- `--lines-terminated-by=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>0

  Isso funciona da mesma maneira que a opção `LINHAS TERMINADAS POR` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como o final da linha.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>1

  Leia o caminho fornecido a partir do arquivo de login.

- `--log-level=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>2

  Realiza registro interno no nível especificado. Esta opção é destinada principalmente para uso interno e de desenvolvimento.

  Nas compilações de depuração apenas do NDB, o nível de registro pode ser definido usando essa opção até um máximo de 4.

- `--max-rows=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>3

  Importe apenas esse número de linhas de dados de entrada; o padrão é 0, que importa todas as linhas.

- `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>4

  Imprima periodicamente o status de um trabalho em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). Defina para 0 para desabilitar essa notificação. Definir para 1 imprime qualquer mudança que for vista. Valores mais altos reduzem a frequência dessa notificação de status.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>5

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>6

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>7

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>8

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-asynch`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-offset=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>9

  Execute operações de banco de dados em lotes, em transações únicas.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>0

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--no-hint`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>1

  Não use a chave de distribuição para indicar a seleção de um nó de dados.

- \`--opbatch=*#*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>2

  Defina um limite para o número de operações (incluindo operações de blob) e, assim, para o número de transações assíncronas por lote de execução.

- `--opbytes=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>3

  Defina um limite para o número de bytes por lote de execução. Use 0 para sem limite.

- `--output-type=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>4

  Defina o tipo de saída. `ndb` é o padrão. `null` é usado apenas para testes.

- `--output-workers=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>5

  Defina o número de threads que processam a saída ou retransmitem operações de banco de dados.

- `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>6

  Alinhe os buffers de entrada/saída ao tamanho especificado.

- `--pagecnt=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>7

  Defina o tamanho dos buffers de E/S como múltiplo do tamanho da página. O trabalhador de entrada CSV aloca um buffer do dobro do tamanho.

- `--polltimeout=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>8

  Defina um tempo limite por pesquisa para transações assíncronas concluídas; a pesquisa continua até que todas as pesquisas sejam concluídas ou até que ocorra um erro.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ai-prefetch-sz=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>9

  Imprima a lista de argumentos do programa e saia.

- `--rejects=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  Limite o número de linhas rejeitadas (linhas com erros permanentes) na carga de dados. O padrão é 0, o que significa que qualquer linha rejeitada causa um erro fatal. Quaisquer linhas que excedam o limite são adicionadas ao arquivo `.rej`.

  O limite imposto por essa opção é válido durante a execução atual. Uma execução reiniciada usando `--resume` é considerada uma "nova" execução para esse propósito.

- `--resume`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  Se um trabalho for abortado (devido a um erro temporário no banco de dados ou quando interrompido pelo usuário), continue com todas as linhas que ainda não foram processadas.

- `--rowbatch=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Defina um limite para o número de linhas por fila de linhas. Use 0 para sem limite.

- `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Defina um limite para o número de bytes por fila de linha. Use 0 para sem limite.

- `--stats`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Salve informações sobre opções relacionadas ao desempenho e outras estatísticas internas em arquivos com nomes `*.sto` e `*.stt`. Esses arquivos são sempre mantidos após a conclusão bem-sucedida (mesmo que `--keep-state` não seja especificado também).

- `--state-dir=*`nome\`\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Onde escrever os arquivos do estado (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res` e `tbl_name.stt`) produzidos por uma execução do programa; o padrão é o diretório atual.

- `--tempdelay=*`#\`\*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Número de milissegundos para dormir entre erros temporários.

- `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Número de vezes que uma transação pode falhar devido a um erro temporário, por lote de execução. O padrão é 0, o que significa que qualquer erro temporário é fatal. Erros temporários não fazem com que nenhuma linha seja adicionada ao arquivo `.rej`.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  Ative a saída detalhada.

  Nota

  Anteriormente, essa opção controlava o nível de registro interno para mensagens de depuração. No NDB 7.6, use a opção `--log-level` para esse propósito.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

Assim como no caso de `LOAD DATA`, as opções para formatação de campos e linhas devem corresponder às usadas para criar o arquivo CSV, seja isso feito usando `SELECT INTO ... OUTFILE` ou por algum outro meio. Não há uma opção equivalente à da instrução `STARTING WITH` do `LOAD DATA`.

**ndb\_import** foi adicionado no NDB 7.6.
