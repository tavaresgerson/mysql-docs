## 9.2 Nomes de Objetos de Esquema

Certos objetos dentro do MySQL, incluindo banco de dados, tabela, índice, coluna, alias, visão, procedimento armazenado, partição, tablespace e outros nomes de objetos são conhecidos como identificadores. Esta seção descreve a sintaxe permitida para identificadores no MySQL. A Seção 9.2.1, “Limites de comprimento do identificador”, indica o comprimento máximo de cada tipo de identificador. A Seção 9.2.3, “Sensibilidade ao caso dos identificadores”, descreve quais tipos de identificadores são sensíveis ao caso e sob quais condições.

Um identificador pode ser citado ou não. Se um identificador contém caracteres especiais ou é uma palavra reservada, você *deve* citá-lo sempre que se referir a ele. (Exceção: uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, portanto, não precisa ser citada.) As palavras reservadas estão listadas na Seção 9.3, “Palavras-chave e Palavras Reservadas”.

Internamente, os identificadores são convertidos e armazenados como Unicode (UTF-8). Os caracteres Unicode permitidos nos identificadores são aqueles no Plano Multilíngue Básico (BMP). Caracteres suplementares não são permitidos. Assim, os identificadores podem conter esses caracteres:

* Caracteres permitidos em identificadores não citados:

+ ASCII: [0-9, a-z, A-Z$_] (letras latinas básicas, dígitos 0-9, dólar, sublinhado)

+ Extendido: U+0080 .. U+FFFF
* Caracteres permitidos em identificadores citados incluem o plano básico multilíngue completo Unicode (BMP), exceto U+0000:

+ ASCII: U+0001 .. U+007F
+ Extendido: U+0080 .. U+FFFF
* ASCII NUL (U+0000) e caracteres suplementares (U+10000 e superiores) não são permitidos em identificadores citados ou não citados.

* Os identificadores podem começar com um dígito, mas, a menos que citados, não podem consistir exclusivamente em dígitos.

* Os nomes de banco de dados, tabela e coluna não podem terminar com caracteres de espaço.

O caractere de citação de identificador é o backtick (`` ` ``):

```sql
mysql> SELECT * FROM `select` WHERE `select`.id > 100;
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, também é permitido citar identificadores entre aspas duplas:

```sql
mysql> CREATE TABLE "test" (col INT);
ERROR 1064: You have an error in your SQL syntax...
mysql> SET sql_mode='ANSI_QUOTES';
mysql> CREATE TABLE "test" (col INT);
Query OK, 0 rows affected (0.00 sec)
```

O modo `ANSI_QUOTES` faz com que o servidor interprete as cadeias de caracteres com aspas duplas como identificadores. Consequentemente, quando este modo é ativado, as cadeias de caracteres literais devem ser encerradas entre aspas simples. Elas não podem ser encerradas entre aspas duplas. O modo SQL do servidor é controlado conforme descrito na Seção 5.1.10, “Modos SQL do servidor”.

Os caracteres de citação de identificadores podem ser incluídos dentro de um identificador se você citar o identificador. Se o caractere a ser incluído dentro do identificador for o mesmo que o usado para citar o próprio identificador, então você precisa duplicá-lo. A seguinte declaração cria uma tabela chamada `` a`b ` that contains a column named `c`d:

```sql
mysql> CREATE TABLE `a``b` (`c"d` INT);
```

Na lista selecionada de uma consulta, um alias de coluna com citação pode ser especificado usando caracteres de citação de identificador ou cadeia:

```sql
mysql> SELECT 1 AS `one`, 2 AS 'two';
+-----+-----+
| one | two |
+-----+-----+
|   1 |   2 |
+-----+-----+
```

Em outros lugares na declaração, as referências a alíases citadas devem usar citação de identificador ou a referência é tratada como uma literal de string.

Recomenda-se que você não use nomes que comecem com `Me` ou `MeN`, onde *`M`* e *`N`* são inteiros. Por exemplo, evite usar `1e` como um identificador, porque uma expressão como `1e+3` é ambígua. Dependendo do contexto, ela pode ser interpretada como a expressão `1e

+ 3` or as the number `1e+3`.

Tenha cuidado ao usar `MD5()` para criar nomes de tabelas, pois ele pode gerar nomes em formatos ilegais ou ambíguos, como os descritos acima.

Uma variável de usuário não pode ser usada diretamente em uma declaração SQL como um identificador ou como parte de um identificador. Consulte a Seção 9.4, “Variáveis Definidas pelo Usuário”, para obter mais informações e exemplos de soluções alternativas.

Os caracteres especiais nos nomes de banco de dados e tabelas são codificados nos nomes correspondentes dos sistemas de arquivos, conforme descrito na Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”. Se você tiver bancos de dados ou tabelas de uma versão anterior do MySQL que contenham caracteres especiais e para as quais os nomes dos diretórios ou nomes de arquivos subjacentes não tenham sido atualizados para usar o novo codificação, o servidor exibe seus nomes com um prefixo de `#mysql50#`. Para obter informações sobre como referenciar tais nomes ou convertê-los para o novo codificação, consulte essa seção.

### 9.2.1 Limites de comprimento do identificador

A tabela a seguir descreve o comprimento máximo para cada tipo de identificador.

<table summary="The maximum length for each type of MySQL object identifier.">
<col style="width: 15%"/>
<col style="width: 15%"/>
<thead>
<tr>
<th>Identifier Type</th>
<th>Maximum Length (characters)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Database</td>
<td>64 (<code>NDB</code> storage engine: 63)</td>
</tr>
<tr>
<td>Table</td>
<td>64 (<code>NDB</code> storage engine: 63)</td>
</tr>
<tr>
<td>Column</td>
<td>64</td>
</tr>
<tr>
<td>Index</td>
<td>64</td>
</tr>
<tr>
<td>Constraint</td>
<td>64</td>
</tr>
<tr>
<td>Stored Program</td>
<td>64</td>
</tr>
<tr>
<td>View</td>
<td>64</td>
</tr>
<tr>
<td>Tablespace</td>
<td>64</td>
</tr>
<tr>
<td>Server</td>
<td>64</td>
</tr>
<tr>
<td>Log File Group</td>
<td>64</td>
</tr>
<tr>
<td>Alias</td>
<td>256 (see exception following table)</td>
</tr>
<tr>
<td>Compound Statement Label</td>
<td>16</td>
</tr>
<tr>
<td>User-Defined Variable</td>
<td>64</td>
</tr>
</tbody>
</table>

Os aliases para os nomes das colunas nas declarações `CREATE VIEW` são verificados contra o comprimento máximo da coluna de 64 caracteres (e não o comprimento máximo do alias de 256 caracteres).

Para definições de restrição que não incluem nenhum nome de restrição, o servidor gera internamente um nome derivado do nome da tabela associada. Por exemplo, os nomes de restrição de chave estrangeira gerados internamente consistem no nome da tabela mais `_ibfk_` e um número. Se o nome da tabela estiver próximo ao limite de comprimento para nomes de restrição, os caracteres adicionais necessários para o nome da restrição podem fazer com que o nome exceda o limite, resultando em um erro.

Os identificadores são armazenados usando Unicode (UTF-8). Isso se aplica a identificadores em definições de tabela que são armazenados em arquivos `.frm` e a identificadores armazenados nas tabelas de concessão no banco de dados `mysql`. Os tamanhos das colunas de cadeia de identificadores nas tabelas de concessão são medidos em caracteres. Você pode usar caracteres multibyte sem reduzir o número de caracteres permitidos para valores armazenados nessas colunas.

O NDB Cluster impõe um comprimento máximo de 63 caracteres para os nomes de bancos de dados e tabelas. Veja a Seção 21.2.7.5, “Limites associados aos objetos de banco de dados no NDB Cluster”.

Valores como nome do usuário e nomes de host nos nomes de contas do MySQL são strings e não identificadores. Para obter informações sobre o comprimento máximo desses valores armazenados em tabelas de concessão, consulte Propriedades de Coluna de Escopo da Tabela de Concessão.

### 9.2.2 Identificadores de qualificadores

Os nomes dos objetos podem ser não qualificados ou qualificados. Um nome não qualificado é permitido em contextos onde a interpretação do nome é inequívoca. Um nome qualificado inclui pelo menos um qualificador para esclarecer o contexto interpretativo, substituindo um contexto padrão ou fornecendo o contexto ausente.

Por exemplo, esta declaração cria uma tabela usando o nome não qualificado `t1`:

```sql
CREATE TABLE t1 (i INT);
```

Como o `t1` não inclui um qualificador para especificar um banco de dados, a declaração cria a tabela no banco de dados padrão. Se não houver um banco de dados padrão, ocorrerá um erro.

Essa declaração cria uma tabela usando o nome qualificado `db1.t1`:

```sql
CREATE TABLE db1.t1 (i INT);
```

Como o `db1.t1` inclui um qualificador de banco de dados `db1`, a declaração cria `t1` no banco de dados denominado `db1`, independentemente do banco de dados padrão. O qualificador *deve* ser especificado se não houver banco de dados padrão. O qualificador *pode* ser especificado se houver um banco de dados padrão, para especificar um banco de dados diferente do padrão, ou para tornar o banco de dados explícito se o padrão for o mesmo que o especificado.

Os qualificadores têm essas características:

* Um nome não qualificado é composto por um único identificador. Um nome qualificado é composto por vários identificadores.

* Os componentes de um nome de várias partes devem ser separados por caracteres de ponto (`.`) Os componentes iniciais de um nome de várias partes atuam como qualificadores que afetam o contexto em que o identificador final deve ser interpretado.

* O caractere qualificador é um token separado e não precisa estar contiguo aos identificadores associados. Por exemplo, *`tbl_name.col_name`* e *`tbl_name . col_name`* são equivalentes.

* Se algum componente de um nome composto exigir citação, cite-o individualmente, em vez de citar o nome como um todo. Por exemplo, escreva `` `minha-tabela`.`minha-coluna` ``, not `` `minha-tabela.minha-coluna` ``.

* Uma palavra reservada que segue um ponto em um nome qualificado deve ser um identificador, portanto, nesse contexto, não precisa ser citada.

* A sintaxe `.tbl_name` significa a tabela *`tbl_name`* no banco de dados padrão.

Nota

Essa sintaxe é descontinuada a partir do MySQL 5.7.20; espere que ela seja removida em uma versão futura do MySQL.

Os qualificadores permitidos para os nomes de objetos dependem do tipo de objeto:

* O nome de um banco de dados é totalmente qualificado e não aceita qualificadores:

  ```sql
  CREATE DATABASE db1;
  ```

* Um nome de tabela, visualização ou programa armazenado pode receber um qualificador de nome de banco de dados. Exemplos de nomes não qualificados e qualificados em declarações `CREATE`:

  ```sql
  CREATE TABLE mytable ...;
  CREATE VIEW myview ...;
  CREATE PROCEDURE myproc ...;
  CREATE FUNCTION myfunc ...;
  CREATE EVENT myevent ...;

  CREATE TABLE mydb.mytable ...;
  CREATE VIEW mydb.myview ...;
  CREATE PROCEDURE mydb.myproc ...;
  CREATE FUNCTION mydb.myfunc ...;
  CREATE EVENT mydb.myevent ...;
  ```

* Um gatilho é associado a uma tabela, então qualquer qualificador se aplica ao nome da tabela:

  ```sql
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```

* Um nome de coluna pode receber várias qualificações para indicar o contexto em declarações que a referenciam, conforme mostrado na tabela a seguir.

  <table summary="Column reference formats that can be used to refer to table columns."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Column Reference</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>col_name</code></td> <td>Column <code>col_name</code> from whichever table used in the statement contains a column of that name</td> </tr><tr> <td><code>tbl_name.col_name</code></td> <td>Column <code>col_name</code> from table <code>tbl_name</code> of the default database</td> </tr><tr> <td><code>db_name.tbl_name.col_name</code></td> <td>Column <code>col_name</code> from table <code>tbl_name</code> of the database <code>db_name</code></td> </tr></tbody></table>

Em outras palavras, um nome de coluna pode receber um qualificador de nome de tabela, que por sua vez pode receber um qualificador de nome de banco de dados. Exemplos de referências de coluna não qualificadas e qualificadas em declarações `SELECT`:

  ```sql
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

Você não precisa especificar um qualificador para uma referência a um objeto em uma declaração, a menos que a referência não qualificada seja ambígua. Suponha que a coluna `c1` ocorra apenas na tabela `t1`, `c2` apenas na `t2`, e `c` em ambas as tabelas `t1` e `t2`. Qualquer referência não qualificada a `c` é ambígua em uma declaração que se refere a ambas as tabelas e deve ser qualificada como `t1.c` ou `t2.c` para indicar qual tabela você quer dizer:

```sql
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```

Da mesma forma, para recuperar de uma tabela `t` no banco de dados `db1` e de uma tabela `t` no banco de dados `db2` na mesma declaração, você deve qualificar as referências de tabela: para referências a colunas nessas tabelas, os qualificadores são necessários apenas para os nomes de colunas que aparecem em ambas as tabelas. Suponha que a coluna `c1` ocorra apenas na tabela `db1.t`, `c2` apenas em `db2.t`, e `c` em ambas as tabelas `db1.t` e `db2.t`. Neste caso, `c` é ambíguo e deve ser qualificado, mas `c1` e `c2` não precisam ser:

```sql
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```

Os aliases de tabela permitem que referências qualificadas de coluna sejam escritas de forma mais simples:

```sql
SELECT c1, c2, t1.c FROM db1.t AS t1 INNER JOIN db2.t AS t2
WHERE t2.c > 100;
```

### 9.2.3 Sensibilidade do identificador à grafia maiúscula e minúscula

Em MySQL, os bancos de dados correspondem a diretórios dentro do diretório de dados. Cada tabela dentro de um banco de dados corresponde a pelo menos um arquivo dentro do diretório do banco de dados (e possivelmente mais, dependendo do mecanismo de armazenamento). Os gatilhos também correspondem a arquivos. Consequentemente, a sensibilidade ao caso do sistema operacional subjacente desempenha um papel na sensibilidade ao caso dos nomes de banco de dados, tabela e gatilho. Isso significa que tais nomes não são sensíveis ao caso no Windows, mas são sensíveis ao caso na maioria das variedades de Unix. Uma exceção notável é o macOS, que é baseado em Unix, mas usa um tipo de sistema de arquivos padrão (HFS+) que não é sensível ao caso. No entanto, o macOS também suporta volumes UFS, que são sensíveis ao caso assim como em qualquer Unix. Veja a Seção 1.6.1, “Extensões MySQL ao SQL Padrão”. A variável de sistema `lower_case_table_names` também afeta como o servidor lida com a sensibilidade ao caso do identificador, conforme descrito mais adiante nesta seção.

Nota

Embora os nomes de banco de dados, tabela e gatilho não sejam sensíveis ao caso em algumas plataformas, você não deve se referir a um desses usando diferentes casos dentro da mesma declaração. A declaração seguinte não funcionaria porque se refere a uma tabela tanto como `my_table` quanto como `MY_TABLE`:

```sql
mysql> SELECT * FROM my_table WHERE MY_TABLE.col=1;
```

Os nomes de colunas, índices, rotinas armazenadas e eventos não são sensíveis ao caso em qualquer plataforma, assim como os aliases de coluna.

No entanto, os nomes dos grupos de logfile são sensíveis a maiúsculas e minúsculas. Isso difere do SQL padrão.

Por padrão, os aliases de tabela são sensíveis ao caso em Unix, mas não no Windows ou no macOS. A seguinte declaração não funcionaria em Unix, porque ela se refere ao alias tanto como `a` quanto como `A`:

```sql
mysql> SELECT col_name FROM tbl_name AS a
       WHERE a.col_name = 1 OR A.col_name = 2;
```

No entanto, essa mesma declaração é permitida no Windows. Para evitar problemas causados por tais diferenças, é melhor adotar uma convenção consistente, como sempre criar e referir-se a bancos de dados e tabelas usando nomes em minúsculas. Essa convenção é recomendada para máxima portabilidade e facilidade de uso.

Como os nomes de tabela e banco de dados são armazenados no disco e utilizados no MySQL é afetado pela variável de sistema `lower_case_table_names`, que você pode definir ao iniciar `mysqld`. `lower_case_table_names` pode assumir os valores mostrados na tabela a seguir. Esta variável *não* afeta a sensibilidade ao caso dos identificadores de gatilho. No Unix, o valor padrão de `lower_case_table_names` é 0. No Windows, o valor padrão é 1. No macOS, o valor padrão é 2.

<table summary="Values for the lower_case_table_names system variable.">
<col style="width: 10%"/>
<col style="width: 90%"/>
<thead>
<tr>
<th>Value*</th>
<th>Significado</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>0</code></td>
<td>Os nomes de tabela e banco de dados são armazenados no disco usando a letra maiúscula especificada no<code>CREATE TABLE</code>ou<code>CREATE DATABASE</code>As comparações de nomes são sensíveis ao caso. Você deve<em>não</em>defina essa variável para 0 se estiver executando o MySQL em um sistema que tem nomes de arquivos insensíveis a maiúsculas e minúsculas (como Windows ou macOS). Se você forçar essa variável para 0 com<code>--lower-case-table-names=0</code>sobre um sistema de arquivos sensível a maiúsculas e minúsculas e acesso<code>MyISAM</code>Se os nomes de tabela usarem diferentes maiúsculas e minúsculas, pode resultar corrupção de índice.</td>
</tr>
<tr>
<td><code>1</code></td>
<td>Os nomes das tabelas são armazenados em minúsculas no disco e as comparações de nome não são sensíveis ao caso. O MySQL converte todos os nomes das tabelas para minúsculas no armazenamento e na pesquisa. Esse comportamento também se aplica aos nomes dos bancos de dados e aos aliases das tabelas.</td>
</tr>
<tr>
<td><code>2</code></td>
<td>Os nomes de tabela e banco de dados são armazenados no disco usando a letra maiúscula especificada no<code>CREATE TABLE</code>ou<code>CREATE DATABASE</code>A declaração, mas o MySQL as converte para minúsculas na pesquisa. As comparações de nome não são sensíveis ao caso. Isso funciona<em>apenas</em>em sistemas de arquivos que não são sensíveis ao caso!<code>InnoDB</code>os nomes de tabelas e de visualizações são armazenados em letras minúsculas, como no<code>lower_case_table_names=1</code>.</td>
</tr>
</tbody>
</table>

Se você estiver usando MySQL em apenas uma plataforma, normalmente não precisa alterar a variável `lower_case_table_names` do seu valor padrão. No entanto, você pode encontrar dificuldades se quiser transferir tabelas entre plataformas que diferem na sensibilidade do caso do sistema de arquivos. Por exemplo, no Unix, você pode ter duas tabelas diferentes com os nomes `my_table` e `MY_TABLE`, mas no Windows, esses dois nomes são considerados idênticos. Para evitar problemas de transferência de dados decorrentes da letra do caso dos nomes dos bancos de dados ou das tabelas, você tem duas opções:

* Use `lower_case_table_names=1` em todos os sistemas. A principal desvantagem disso é que, quando você usa `SHOW TABLES` ou `SHOW DATABASES`, você não vê os nomes em maiúsculas.

* Use `lower_case_table_names=0` em Unix e `lower_case_table_names=2` em Windows. Isso preserva a maiúscula das letras dos nomes do banco de dados e das tabelas. A desvantagem disso é que você deve garantir que suas declarações sempre se refiram aos nomes do banco de dados e das tabelas com a letra correta em Windows. Se você transferir suas declarações para Unix, onde a maiúscula é importante, elas não funcionarão se a letra não estiver correta.

**Exceção**: Se você está usando as tabelas `InnoDB` e está tentando evitar esses problemas de transferência de dados, você deve definir `lower_case_table_names` para 1 em todas as plataformas para forçar que os nomes sejam convertidos para minúsculas.

Se você planeja definir a variável de sistema `lower_case_table_names` para 1 no Unix, você deve primeiro converter os nomes do banco de dados e das tabelas antigas para minúsculas antes de parar o `mysqld` e reiniciá-lo com o novo ajuste de variável. Para fazer isso para uma tabela individual, use `RENAME TABLE`:

```sql
RENAME TABLE T1 TO t1;
```

Para converter um ou mais bancos de dados inteiros, faça um dump deles antes de definir `lower_case_table_names`, depois descarte os bancos de dados e recarregue-os após definir `lower_case_table_names`:

1. Use **mysqldump** para drenar cada banco de dados:

   ```sql
   mysqldump --databases db1 > db1.sql
   mysqldump --databases db2 > db2.sql
   ...
   ```

Faça isso para cada banco de dados que deve ser recriado.

2. Use `DROP DATABASE` para descartar cada banco de dados.
3. Parar o servidor, definir `lower_case_table_names` e reiniciar o servidor.

4. Recarregue o arquivo de dump para cada banco de dados. Como `lower_case_table_names` está definido, cada nome de banco de dados e tabela é convertido para minúsculas ao ser recriado:

   ```sql
   mysql < db1.sql
   mysql < db2.sql
   ...
   ```

Os nomes de objetos podem ser considerados duplicados se suas formas maiúsculas forem iguais de acordo com uma ordenação binária. Isso é verdadeiro para nomes de cursors, condições, procedimentos, funções, pontos de salvamento, parâmetros locais de rotina armazenada e plugins. Não é verdadeiro para nomes de colunas, restrições, bancos de dados, partições, declarações preparadas com `PREPARE`, tabelas, gatilhos, usuários e variáveis definidas pelo usuário.

A sensibilidade ao caso de letra do sistema de arquivos pode afetar as pesquisas em colunas de string das tabelas de `INFORMATION_SCHEMA`. Para mais informações, consulte a Seção 10.8.7, “Usando a Colaboração em Pesquisas do SCHEMA_INFORMADO”.

### 9.2.4 Mapeamento de Identificadores a Nomes de Arquivo

Existe uma correspondência entre os identificadores e os nomes de banco de dados e tabelas no sistema de arquivos. Para a estrutura básica, o MySQL representa cada banco de dados como um diretório no diretório de dados, e cada tabela por um ou mais arquivos no diretório do banco de dados apropriado. Para os arquivos de formato de tabela (`.FRM`), os dados são sempre armazenados nesta estrutura e localização.

Para os arquivos de dados e índices, a representação exata no disco é específica do mecanismo de armazenamento. Esses arquivos podem ser armazenados na mesma localização que os arquivos `FRM`, ou as informações podem ser armazenadas em um arquivo separado. Os dados do `InnoDB` são armazenados nos arquivos de dados do InnoDB. Se você estiver usando espaços de tabela com `InnoDB`, então os arquivos de espaço de tabela específicos que você cria são usados em vez disso.

Qualquer caractere é legal em identificadores de banco de dados ou tabela, exceto o ASCII NUL (`X'00'`). O MySQL codifica quaisquer caracteres que sejam problemáticos nos objetos correspondentes do sistema de arquivos quando cria diretórios de banco de dados ou arquivos de tabela:

As letras latinas básicas (`a..zA..Z`), dígitos (`0..9`) e sublinhado (`_`) são codificados como estão. Consequentemente, sua sensibilidade de caso depende diretamente das características do sistema de arquivos.

* Todas as outras letras nacionais de alfabetos que possuem mapeamento de maiúsculas/minúsculas são codificadas conforme mostrado na tabela a seguir. Os valores na coluna Código de intervalo são valores UCS-2.

<table summary="The encoding for national letters from alphabets that have uppercase/lowercase mapping, excluding basic Latin letters (a..zA..Z), digits (0..9) and underscore (_), which are encoded as is.">
<thead>
<tr>
<th>Code Range*</th>
<th>Pattern*</th>
<th>Number*</th>
<th>Used*</th>
<th>Unused*</th>
<th>Blocks*</th>
</tr>
</thead>
<tbody>
<tr>
<th>00C0..017F</th>
<td>[@][0..4][g..z]</td>
<td>5*20= 100</td>
<td>97</td>
<td>3</td>
<td>Latin-1 Supplement + Latin Extended-A</td>
</tr>
<tr>
<th>0370..03FF</th>
<td>[@][5..9][g..z]</td>
<td>5*20= 100</td>
<td>88</td>
<td>12</td>
<td>Greek and Coptic</td>
</tr>
<tr>
<th>0400..052F</th>
<td>[@][g..z][0..6]</td>
<td>20*7= 140</td>
<td>137</td>
<td>3</td>
<td>Cyrillic + Cyrillic Supplement</td>
</tr>
<tr>
<th>0530..058F</th>
<td>[@][g..z][7..8]</td>
<td>20*2= 40</td>
<td>38</td>
<td>2</td>
<td>Armenian</td>
</tr>
<tr>
<th>2160..217F</th>
<td>[@][g..z][9]</td>
<td>20*1= 20</td>
<td>16</td>
<td>4</td>
<td>Number Forms</td>
</tr>
<tr>
<th>0180..02AF</th>
<td>[@][g..z][a..k]</td>
<td>20*11=220</td>
<td>203</td>
<td>17</td>
<td>Latin Extended-B + IPA Extensions</td>
</tr>
<tr>
<th>1E00..1EFF</th>
<td>[@][g..z][l..r]</td>
<td>20*7= 140</td>
<td>136</td>
<td>4</td>
<td>Latin Extended Additional</td>
</tr>
<tr>
<th>1F00..1FFF</th>
<td>[@][g..z][s..z]</td>
<td>20*8= 160</td>
<td>144</td>
<td>16</td>
<td>Greek Extended</td>
</tr>
<tr>
<th>.... ....</th>
<td>[@][a..f][g..z]</td>
<td>6*20= 120</td>
<td>0</td>
<td>120</td>
<td>RESERVED</td>
</tr>
<tr>
<th>24B6..24E9</th>
<td>[@][@][a..z]</td>
<td>26</td>
<td>26</td>
<td>0</td>
<td>Enclosed Alphanumerics</td>
</tr>
<tr>
<th>FF21..FF5A</th>
<td>[@][a..z][@]</td>
<td>26</td>
<td>26</td>
<td>0</td>
<td>Halfwidth and Fullwidth forms</td>
</tr>
</tbody>
</table>

Um dos bytes na sequência codifica a maiúscula. Por exemplo: `LATIN CAPITAL LETTER A WITH GRAVE` é codificado como `@0G`, enquanto `LATIN SMALL LETTER A WITH GRAVE` é codificado como `@0g`. Aqui, o terceiro byte (`G` ou `g`) indica a maiúscula. (Em um sistema de arquivos que não é sensível à maiúscula, ambas as letras são tratadas como a mesma.)

Para alguns blocos, como o cirílico, o segundo byte determina a maiúscula da letra. Para outros blocos, como o suplemento Latin1, o terceiro byte determina a maiúscula da letra. Se dois bytes na sequência forem letras (como no grego estendido), o caractere da letra mais à esquerda representa a maiúscula da letra. Todos os outros bytes de letra devem estar em minúsculas.

* Todos os caracteres que não são letras, exceto sublinhado (`_`), bem como letras de alfabetos que não têm mapeamento de maiúsculas e minúsculas (como o hebraico), são codificados usando representação hexadecimal, utilizando letras minúsculas para dígitos hexadecimais `a..f`:

  ```sql
  0x003F -> @003f
  0xFFFF -> @ffff
  ```

Os valores hexadecimais correspondem aos valores de caracteres no conjunto de caracteres de dois bytes `ucs2`.

Em Windows, alguns nomes, como `nul`, `prn` e `aux`, são codificados anexando `@@@` ao nome quando o servidor cria o arquivo ou diretório correspondente. Isso ocorre em todas as plataformas para a portabilidade do objeto de banco de dados correspondente entre as plataformas.

Se você tiver bancos de dados ou tabelas de uma versão do MySQL mais antiga que 5.1.6 que contenham caracteres especiais e para as quais os nomes dos diretórios ou nomes dos arquivos subjacentes não tenham sido atualizados para usar o novo codificação, o servidor exibe seus nomes com um prefixo de `#mysql50#` na saída das tabelas `INFORMATION_SCHEMA` ou das declarações `SHOW`. Por exemplo, se você tiver uma tabela chamada `a@b` e seu codificação de nome não tenha sido atualizada, `SHOW TABLES` a exibe assim:

```sql
mysql> SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| #mysql50#a@b   |
+----------------+
```

Para se referir a um nome para o qual a codificação não tenha sido atualizada, você deve fornecer o prefixo `#mysql50#`:

```sql
mysql> SHOW COLUMNS FROM `a@b`;
ERROR 1146 (42S02): Table 'test.a@b' doesn't exist

mysql> SHOW COLUMNS FROM `#mysql50#a@b`;
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| i     | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
```

Para atualizar nomes antigos e eliminar a necessidade de usar o prefixo especial para se referir a eles, reencode-os com **mysqlcheck**. Os seguintes comandos atualizam todos os nomes para o novo codificação:

```sql
mysqlcheck --check-upgrade --all-databases
mysqlcheck --fix-db-names --fix-table-names --all-databases
```

Para verificar apenas bancos de dados ou tabelas específicas, omita `--all-databases` e forneça os argumentos apropriados para o banco de dados ou tabela. Para informações sobre a sintaxe de invocação do **mysqlcheck**, consulte a Seção 4.5.3, “mysqlcheck — Um programa de manutenção de tabela”.

Nota

O prefixo `#mysql50#` é destinado apenas para uso interno pelo servidor. Você não deve criar bancos de dados ou tabelas com nomes que utilizem este prefixo.

Além disso, o **mysqlcheck** não pode corrigir nomes que contenham instâncias literais do caractere `@` que é usado para codificar caracteres especiais. Se você tiver bancos de dados ou tabelas que contenham esse caractere, use **mysqldump** para fazer o dump deles antes de fazer a atualização para o MySQL 5.1.6 ou posterior, e, em seguida, recarregue o arquivo de dump após a atualização.

Nota

A conversão de nomes de bancos de dados pré-MySQL 5.1 que contêm caracteres especiais para o formato 5.1, com a adição de um prefixo `#mysql50#`, é descontinuada; espera-se que ela seja removida em uma versão futura do MySQL. Como tais conversões são descontinuadas, as opções `--fix-db-names` e `--fix-table-names` para o **mysqlcheck** e a cláusula `UPGRADE DATA DIRECTORY NAME` para a declaração `ALTER DATABASE` também são descontinuadas.

As atualizações são suportadas apenas de uma série de lançamentos para outra (por exemplo, 5.0 para 5.1 ou 5.1 para 5.5), portanto, deve haver pouca necessidade de conversão de nomes de bancos de dados mais antigos de 5.0 para versões atuais do MySQL. Como uma solução alternativa, atualize uma instalação do MySQL 5.0 para o MySQL 5.1 antes de atualizar para uma versão mais recente.

### 9.2.5 Análise e resolução do nome da função

O MySQL suporta funções embutidas (nativas), funções carregáveis e funções armazenadas. Esta seção descreve como o servidor reconhece se o nome de uma função embutida é usado como uma chamada de função ou como um identificador, e como o servidor determina qual função usar em casos em que funções de diferentes tipos existem com um nome dado.

* Parsificação de nome de função embutida
* Resolução de nome de função

#### Parametrização do nome de função integrada

O analisador utiliza regras padrão para a análise de nomes de funções embutidas. Essas regras podem ser alteradas ao habilitar o modo `IGNORE_SPACE` SQL.

Quando o analisador encontra uma palavra que é o nome de uma função embutida, ele deve determinar se o nome significa uma chamada de função ou, em vez disso, é uma referência não-expressão a um identificador, como o nome de uma tabela ou coluna. Por exemplo, nas seguintes declarações, a primeira referência a `count` é uma chamada de função, enquanto a segunda referência é o nome de uma tabela:

```sql
SELECT COUNT(*) FROM mytable;
CREATE TABLE count (i INT);
```

O analisador deve reconhecer o nome de uma função embutida como indicando uma chamada de função apenas ao analisar o que se espera ser uma expressão. Isso significa que, em contextos que não são expressões, os nomes de funções são permitidos como identificadores.

No entanto, algumas funções embutidas têm considerações especiais de análise ou implementação, então o analisador usa as seguintes regras por padrão para distinguir se seus nomes estão sendo usados como chamadas de função ou como identificadores em contexto não expressão:

* Para usar o nome como uma chamada de função em uma expressão, não deve haver espaços em branco entre o nome e o caractere de parênteses `(` a seguir.

* Por outro lado, para usar o nome da função como um identificador, ele não deve ser seguido imediatamente por uma parêntese.

O requisito de que as chamadas de função sejam escritas sem espaços em branco entre o nome e o parêntese se aplica apenas às funções internas que têm considerações especiais. `COUNT` é um desses nomes. O arquivo de fonte `sql/lex.h` lista os nomes dessas funções especiais para as quais o seguinte espaço em branco determina sua interpretação: nomes definidos pela macro `SYM_FN()` na matriz `symbols[]`.

A lista a seguir lista as funções no MySQL 5.7 que são afetadas pelo ajuste `IGNORE_SPACE` e listadas como especiais no arquivo fonte `sql/lex.h`. Você pode achar mais fácil tratar o requisito sem espaços em branco como aplicável a todas as chamadas de função.

* `ADDDATE`
* `BIT_AND`
* `BIT_OR`
* `BIT_XOR`
* `CAST`
* `COUNT`
* `CURDATE`
* `CURTIME`
* `DATE_ADD`
* `DATE_SUB`
* `EXTRACT`
* `GROUP_CONCAT`
* `MAX`
* `MID`
* `MIN`
* `NOW`
* `POSITION`
* `SESSION_USER`
* `STD`
* `STDDEV`
* `STDDEV_POP`
* `STDDEV_SAMP`
* `SUBDATE`
* `SUBSTR`
* `SUBSTRING`
* `SUM`
* `SYSDATE`
* `SYSTEM_USER`
* `TRIM`
* `VARIANCE`
* `VAR_POP`
* `VAR_SAMP`

Para funções não listadas como especiais em `sql/lex.h`, o espaço em branco não importa. Elas são interpretadas como chamadas de função apenas quando usadas em contexto de expressão e podem ser usadas livremente como identificadores, caso contrário. `ASCII` é um desses nomes. No entanto, para esses nomes de funções não afetados, a interpretação pode variar em contexto de expressão: `func_name ()` é interpretado como uma função embutida se houver uma com o nome dado; se não, `func_name ()` é interpretado como uma função carregável ou armazenada se existir um com esse nome.

O modo SQL `IGNORE_SPACE` pode ser usado para modificar a forma como o analisador trata os nomes de funções que são sensíveis a espaços em branco:

* Com `IGNORE_SPACE` desativado, o analisador interpreta o nome como uma chamada de função quando não há espaço em branco entre o nome e os parênteses seguintes. Isso ocorre mesmo quando o nome da função é usado em contexto não expresso:

  ```sql
  mysql> CREATE TABLE count(i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax ...
  near 'count(i INT)'
  ```

Para eliminar o erro e fazer com que o nome seja tratado como um identificador, use espaço em branco após o nome ou escreva-o como um identificador citado (ou ambos):

  ```sql
  CREATE TABLE count (i INT);
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

* Com `IGNORE_SPACE` habilitado, o analisador relaxa a exigência de que não haja espaços em branco entre o nome da função e os parênteses seguintes. Isso oferece mais flexibilidade na escrita de chamadas de função. Por exemplo, qualquer uma das seguintes chamadas de função é válida:

  ```sql
  SELECT COUNT(*) FROM mytable;
  SELECT COUNT (*) FROM mytable;
  ```

No entanto, habilitar `IGNORE_SPACE` também tem o efeito colateral de que o analisador trata os nomes de funções afetadas como palavras reservadas (veja Seção 9.3, “Palavras-chave e Palavras Reservadas”). Isso significa que um espaço que segue o nome não mais significa seu uso como um identificador. O nome pode ser usado em chamadas de função com ou sem espaço em branco, mas causa um erro de sintaxe em contexto não expresso, a menos que seja citado. Por exemplo, com `IGNORE_SPACE` habilitado, ambas as seguintes declarações falham com um erro de sintaxe porque o analisador interpreta `count` como uma palavra reservada:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

Para usar o nome da função em contexto não expressão, escreva-o como um identificador citado:

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

Para habilitar o modo SQL `IGNORE_SPACE`, use esta declaração:

```sql
SET sql_mode = 'IGNORE_SPACE';
```

`IGNORE_SPACE` também é habilitado por outros modos compostos, como `ANSI`, que o incluem em seu valor:

```sql
SET sql_mode = 'ANSI';
```

Consulte a Seção 5.1.10, “Modos SQL do servidor”, para verificar quais modos compostos permitem `IGNORE_SPACE`.

Para minimizar a dependência do código SQL da configuração `IGNORE_SPACE`, use essas diretrizes:

* Evite criar funções carregáveis ou armazenadas que tenham o mesmo nome que uma função embutida.

* Evite usar nomes de funções em contexto não expresso. Por exemplo, essas declarações usam `count` (um dos nomes de funções afetadas afetadas por `IGNORE_SPACE`), então elas falham com ou sem espaço em branco após o nome se `IGNORE_SPACE` estiver habilitado:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

Se você deve usar um nome de função em contexto não expresso, escreva-o como um identificador citado:

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

#### Resolução do Nome da Função

As regras a seguir descrevem como o servidor resolve referências a nomes de funções para criação e invocação de funções:

* Funções embutidas e funções carregáveis

Um erro ocorre se você tentar criar uma função carregável com o mesmo nome que uma função embutida.

* Funções embutidas e funções armazenadas

É possível criar uma função armazenada com o mesmo nome que uma função embutida, mas para invocá-la, é necessário qualificá-la com o nome do esquema. Por exemplo, se você criar uma função armazenada com o nome `PI` no esquema `test`, invocá-la como `test.PI()`, porque o servidor resolve `PI()` sem um qualificador como referência à função embutida. O servidor gera um aviso se o nome da função armazenada colidir com o nome de uma função embutida. O aviso pode ser exibido com `SHOW WARNINGS`.

* Funções carregáveis e funções armazenadas

As funções carregáveis e as funções armazenadas compartilham o mesmo espaço de nome, portanto, você não pode criar uma função carregável e uma função armazenada com o mesmo nome.

As regras de resolução de nomes de funções anteriores têm implicações para a atualização para versões do MySQL que implementam novas funções integradas:

* Se você já criou uma função carregável com um nome específico e atualizou o MySQL para uma versão que implementa uma nova função integrada com o mesmo nome, a função carregável se torna inacessível. Para corrigir isso, use `DROP FUNCTION` para descartar a função carregável e `CREATE FUNCTION` para recriar a função carregável com um nome diferente e não conflitante. Em seguida, modifique qualquer código afetado para usar o novo nome.

* Se uma nova versão do MySQL implementar uma função embutida com o mesmo nome que uma função armazenada existente, você tem duas opções: Renomear a função armazenada para usar um nome não conflitante ou alterar as chamadas à função para que elas usem um qualificador de esquema (ou seja, use a sintaxe `schema_name.func_name()`). Em qualquer caso, modifique o código afetado conforme necessário.