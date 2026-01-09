### 25.5.13 ndb_import — Importar dados CSV no NDB

O **ndb_import** importa dados formatados em CSV, como os gerados pelo **mysqldump** `--tab`, diretamente no **NDB** usando a API do NDB. O **ndb_import** requer uma conexão com um servidor de gerenciamento do NDB (**ndb_mgmd**) para funcionar; ele não requer uma conexão com um servidor MySQL.

#### Uso

```
ndb_import db_name file_name options
```

O **ndb_import** requer dois argumentos. *`db_name`* é o nome do banco de dados onde a tabela para a qual os dados serão importados está localizada; *`file_name`* é o nome do arquivo CSV a partir do qual os dados serão lidos; este deve incluir o caminho para esse arquivo, se não estiver no diretório atual. O nome do arquivo deve corresponder ao da tabela; a extensão do arquivo, se houver, não é considerada. As opções suportadas pelo **ndb_import** incluem as especificação de separadores de campo, escapamentos e terminadores de linha, e são descritas mais adiante nesta seção.

O **ndb_import** rejeita quaisquer linhas vazias que lê do arquivo CSV, exceto ao importar uma única coluna, no qual caso, um valor vazio pode ser usado como valor da coluna. O **ndb_import** lida com isso da mesma maneira que uma instrução `LOAD DATA`.

O **ndb_import** deve ser capaz de se conectar a um servidor de gerenciamento do NDB Cluster; por essa razão, deve haver um slot `[api]` não utilizado no arquivo `config.ini` do cluster.

Para duplicar uma tabela existente que usa um motor de armazenamento diferente, como `InnoDB`, como uma tabela `NDB`, use o cliente **mysql** para executar uma declaração `SELECT INTO OUTFILE` para exportar a tabela existente para um arquivo CSV, depois execute uma declaração `CREATE TABLE LIKE` para criar uma nova tabela com a mesma estrutura da tabela existente, depois execute `ALTER TABLE ... ENGINE=NDB` na nova tabela; depois disso, do shell do sistema, invoque **ndb\_import** para carregar os dados na nova tabela `NDB`. Por exemplo, uma tabela `InnoDB` existente chamada `myinnodb_table` em um banco de dados chamado `myinnodb` pode ser exportada para uma tabela `NDB` chamada `myndb_table` em um banco de dados chamado `myndb`, como mostrado aqui, assumindo que você já está logado como um usuário MySQL com os privilégios apropriados:

1. No cliente **mysql**:

   ```
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

   Uma vez que o banco de dados e a tabela de destino tenham sido criados, um **mysqld** em execução não é mais necessário. Você pode parar usando **mysqladmin shutdown** ou outro método antes de prosseguir, se desejar.

2. No shell do sistema:

   ```
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   A saída deve se assemelhar à mostrada aqui:

   ```
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

Todas as opções que podem ser usadas com **ndb\_import** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--abort-on-error`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--abort-on-error</code></td> </tr></tbody></table>

  Arrume o núcleo em qualquer erro fatal; usado apenas para depuração.

* `--ai-increment=*``#`*

<table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>

  Para uma tabela com uma chave primária oculta, especifique o incremento de autoincremento, como a variável de sistema `auto_increment_increment` faz no MySQL Server.

* `--ai-offset=*``#`*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>

  Para uma tabela com chave primária oculta, especifique o deslocamento de autoincremento. Semelhante à variável de sistema `auto_increment_offset`.

* `--ai-prefetch-sz=*``#`*

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--ai-prefetch-sz=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">1024</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code class="literal">1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code class="literal">4294967295</code></td>
  </tr>
  </table>

  Para uma tabela com uma chave primária oculta, especifique o número de valores de autoincremento pré-carregados. Comporta-se como a variável de sistema `ndb_autoincrement_prefetch_sz` no MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--character-sets-dir=caminho</code></td>
    </tr>
  </tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para connections">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--connections=#</code></td>
    </tr>
  </tbody></table>

  Número de conexões de cluster a serem criadas.

* `--connect-retries`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
  </table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>

  O mesmo que `--ndb-connectstring`.

* `--continue`

<table frame="box" rules="all" summary="Propriedades para continuar">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--continue</code></td> </tr>
</table>

  Quando um trabalho falha, continue para o próximo trabalho.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para ai-increment">
  <tbody>
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  </tbody>
</table>0

  Escreva o arquivo de código no erro; usado em depuração.

* `--csvopt=*``string`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment">
  <tbody>
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  </tbody>
</table>1

  Fornece um método de atalho para definir opções típicas de importação de CSV. O argumento desta opção é uma string composta por um ou mais dos seguintes parâmetros:

  + `c`: Campos terminados por vírgula
  + `d`: Use os padrões, exceto quando sobrescrito por outro parâmetro

  + `n`: Linhas terminadas por `\n`

  + `q`: Campos opcionalmente encerrados por caracteres de aspas duplas (`"`)

  + `r`: Linha terminada por `\r`

A ordem dos parâmetros usados no argumento desta opção é tratada de forma que o parâmetro mais à direita sempre tem precedência sobre quaisquer parâmetros potencialmente conflitantes que já tenham sido usados no mesmo valor de argumento. Isso também se aplica a quaisquer instâncias duplicadas de um determinado parâmetro.

Esta opção é destinada ao uso em testes em condições nas quais é difícil transmitir escapamentos ou aspas.

* `--db-workers=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>2

  Número de threads, por nó de dados, executando operações de banco de dados.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>3

  Leia opções padrão do arquivo fornecido apenas.

* `--defaults-extra-file`

Leia o arquivo dado após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>5

  Leia também os grupos com concatenação(grupo, sufixo).

* `--errins-type=*``nome`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>6

  Tipo de inserção de erro; use `list` como o valor de *`nome`* para obter todos os valores possíveis. Esta opção é usada apenas para fins de teste.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>7

  Atraso de inserção de erro em milissegundos; uma variação aleatória é adicionada. Esta opção é usada apenas para fins de teste.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>8

  Funciona da mesma maneira que a opção `FIELDS ENCLOSED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como cotação de valores de campos. Para entrada CSV, isso é o mesmo que `--fields-optionally-enclosed-by`.

* `--fields-escaped-by`=*`name`*

<table frame="box" rules="all" summary="Propriedades para ai-increment"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-increment=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>9

Especifique um caractere de escape da mesma maneira que a opção `FIELDS ESCAPED BY` faz para a instrução `LOAD DATA` do SQL.

* `--fields-optionally-enclosed-by=*`char*

<table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>0

Isso funciona da mesma maneira que a opção `FIELDS OPTIONALLY ENCLOSED BY` faz para a instrução `LOAD DATA`, especificando um caractere para ser interpretado como opcionalmente cotizando os valores dos campos. Para entrada CSV, isso é o mesmo que `--fields-enclosed-by`.

* `--fields-terminated-by=*`char*

<table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>1

Isso funciona da mesma maneira que a opção `FIELDS TERMINATED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como o separador de campos.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>2

  Exibir texto de ajuda e sair.

* `--idlesleep=*`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>3

  Número de milissegundos para dormir esperando que mais trabalho seja realizado.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></table>4

  Número de vezes para tentar novamente antes de dormir.

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></table>5

  Fazer com que o ndb\_import ignore as primeiras linhas `#` do arquivo de entrada. Isso pode ser usado para ignorar o cabeçalho de um arquivo que não contém nenhum dado.

* `--input-type`=*`nome`*

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></table>6

Defina o tipo de tipo de entrada. O padrão é `csv`; `random` é destinado apenas para fins de teste. .

* `--input-workers=*`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>7

  Defina o número de threads que processam a entrada.

* `--keep-state`

  <table frame="box" rules="all" summary="Propriedades para ai-offset"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>8

  Por padrão, o ndb\_import remove todos os arquivos de estado (exceto arquivos `*.rej` não vazios) quando conclui um trabalho. Especifique esta opção (não é necessário argumento) para forçar o programa a reter todos os arquivos de estado.

* `--lines-terminated-by=*``nome`*

<table frame="box" rules="all" summary="Propriedades para ai-offset">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--ai-offset=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>

Isso funciona da mesma maneira que a opção `LINES TERMINATED BY` para a instrução `LOAD DATA`, especificando um caractere a ser interpretado como o final de linha.

* `--log-level=*`#*

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--ai-prefetch-sz=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">1024</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>0

Realiza o registro interno no nível especificado. Esta opção é destinada principalmente para uso interno e de desenvolvimento.

Apenas nas compilações de depuração do NDB, o nível de registro pode ser definido usando esta opção para um máximo de 4.

* `--login-path`

Leia o caminho dado a partir do arquivo de login.

* `--no-caminhos-de-login`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-prefetch-sz=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1024</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>1

  Ignora a leitura de opções do arquivo de caminho de login.

* `--max-linhas=*`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-prefetch-sz=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1024</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>3

  Importa apenas esse número de linhas de dados de entrada; o valor padrão é 0, o que importa todas as linhas.

* `--ai-coluna-ausente`

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--ai-prefetch-sz=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">1024</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code class="literal">1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code class="literal">4294967295</code></td>
  </tr>
  </tbody>
</table>4

  Esta opção pode ser usada ao importar uma única tabela ou múltiplas tabelas. Quando usada, indica que o arquivo CSV importado não contém nenhum valor para uma coluna `AUTO_INCREMENT` e que o **ndb_import** deve fornecê-los; se a opção for usada e a coluna `AUTO_INCREMENT` contiver algum valor, a operação de importação não pode prosseguir.

* `--monitor=*`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--ai-prefetch-sz=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">1024</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code class="literal">1</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code class="literal">4294967295</code></td>
    </tr>
  </table>5

  Imprimir periodicamente o status de um trabalho em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). Defina para 0 para desabilitar este relatório. Definir para 1 imprime qualquer mudança que for vista. Valores maiores reduzem a frequência deste relatório de status.

* `--ndb-connectstring`

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--ai-prefetch-sz=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">1024</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code class="literal">1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code class="literal">4294967295</code></td>
  </tr>
</table>
7

  Defina a string de conexão para conectar-se ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--ai-prefetch-sz=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">1024</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code class="literal">1</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code class="literal">4294967295</code></td>
    </tr>
  </table>
7

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que o TLS é necessário para se conectar.

* `--ndb-mgm-host`

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-prefetch-sz=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1024</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></table>8

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para ai-prefetch-sz"><tr><th>Formato de linha de comando</th> <td><code class="literal">--ai-prefetch-sz=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1024</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></table>9

Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>0

Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>1

  Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto-e-vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-asynch`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>2

  Execute operações de banco de dados em lotes, em transações únicas.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>3

  Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--no-hint`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>4

  Não use a indicação de chave de distribuição para selecionar um nó de dados.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>5

  Defina um limite para o número de operações (incluindo operações de blob) e, portanto, o número de transações assíncronas por lote de execução.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>6

  Defina um limite para o número de bytes por lote de execução. Use 0 para sem limite.

* `--output-type`=*`nome`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></table>7

  Defina o tipo de saída. `ndb` é o padrão. `null` é usado apenas para testes.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>8

  Defina o número de threads que processam a saída ou redirecionam operações de banco de dados.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>9

  Alinhe os buffers de entrada/saída ao tamanho especificado.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>0

  Defina o tamanho dos buffers de entrada/saída como múltiplo do tamanho da página. O trabalhador de entrada de CSV aloca um buffer dobrado em tamanho.

* `--polltimeout`=*`#`*

<table frame="box" rules="all" summary="Propriedades para conexões">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>1

  Defina um tempo limite por consulta para transações assíncronas concluídas; a consulta continua até que todas as consultas sejam concluídas ou até que ocorra um erro.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para conexões">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  </table>2

  Imprima a lista de argumentos do programa e saia.

* `--rejects=*`

  <table frame="box" rules="all" summary="Propriedades para conexões">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  </table>3

Limite o número de linhas rejeitadas (linhas com erros permanentes) na carga de dados. O padrão é 0, o que significa que qualquer linha rejeitada causa um erro fatal. Quaisquer linhas que excedam o limite são adicionadas ao arquivo `.rej`.

O limite imposto por esta opção é eficaz durante a execução atual. Uma execução reiniciada usando `--resume` é considerada uma "nova" execução para este propósito.

* `--resume`

  <table frame="box" rules="all" summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>4

  Se um trabalho for abortado (devido a um erro temporário no banco de dados ou quando interrompido pelo usuário), reinicie com quaisquer linhas ainda não processadas.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para conexões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>5

  Defina um limite para o número de linhas por fila de linhas. Use 0 para sem limite.

* `--rowbytes`=*`#`*

<table frame="box" rules="all" summary="Propriedades para conexões">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>7

  Defina um limite para o número de bytes por fila de conexão. Use 0 para sem limite.

* `--stats`

  <table frame="box" rules="all" summary="Propriedades para conexões">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  </table>7

  Salve informações sobre opções relacionadas ao desempenho e outras estatísticas internas em arquivos com nomes `*.sto` e `*.stt`. Esses arquivos são sempre mantidos após a conclusão bem-sucedida (mesmo que `--keep-state` não seja especificado também).

* `--state-dir=*``nome`*

<table frame="box" rules="all" summary="Propriedades para conexões">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>8

Onde escrever os arquivos de estado (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res` e `tbl_name.stt`) produzidos por uma execução do programa; o padrão é o diretório atual.

* `--table=nome`

<table frame="box" rules="all" summary="Propriedades para conexões">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connections=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">4294967295</code></td> </tr>
</table>9

Por padrão, o **ndb\_import** tenta importar dados para uma tabela cujo nome é o nome base do arquivo CSV a partir do qual os dados estão sendo lidos. Você pode substituir a escolha do nome da tabela especificando-o com a opção `--table` (forma abreviada `-t`).

* `--tempdelay=*`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>0

Número de milissegundos para dormir entre erros temporários.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>1

Número de vezes que uma transação pode falhar devido a um erro temporário, por lote de execução. O valor padrão é 0, o que significa que qualquer erro temporário é fatal. Erros temporários não fazem com que nenhuma linha seja adicionada ao arquivo `.rej`.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>2

  Ative a saída detalhada.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>3

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>4

  Exibir informações da versão e sair.

Assim como no caso de `LOAD DATA`, as opções para formatação de campos e linhas são muito semelhantes às usadas para criar o arquivo CSV, seja isso feito usando `SELECT INTO ... OUTFILE` ou por algum outro meio. Não há um equivalente à opção `STARTING WITH` da instrução `LOAD DATA`.