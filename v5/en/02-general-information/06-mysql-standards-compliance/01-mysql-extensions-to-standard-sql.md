### 1.6.1 Extensões MySQL para SQL Padrão

O MySQL Server suporta algumas extensões que provavelmente não serão encontradas em outros SGBDs SQL. Esteja avisado que, se você as utilizar, seu código não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclua extensões MySQL, mas que ainda seja portátil, utilizando comentários do seguinte formato:

```sql
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa (parses) e executa o código dentro do comentário como faria com qualquer outra instrução SQL, mas outros servidores SQL ignoram as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte instrução, mas outros servidores não:

```sql
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no seguinte comentário é executada apenas por servidores a partir do MySQL 5.1.10 ou superior:

```sql
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As descrições a seguir listam as extensões MySQL, organizadas por categoria.

* Organização de dados em disco

  O MySQL Server mapeia cada Database para um diretório sob o diretório de dados do MySQL, e mapeia Tables dentro de um Database para nomes de arquivo no diretório do Database. Isso tem algumas implicações:

  + Nomes de Database e Table são sensíveis a maiúsculas e minúsculas (case-sensitive) no MySQL Server em sistemas operacionais que possuem nomes de arquivo sensíveis a maiúsculas e minúsculas (como a maioria dos sistemas Unix). Veja a Seção 9.2.3, “Sensibilidade a Maiúsculas e Minúsculas de Identificadores”.

  + Você pode usar comandos de sistema padrão para fazer backup, renomear, mover, excluir e copiar Tables que são gerenciadas pela Storage Engine `MyISAM`. Por exemplo, é possível renomear uma Table `MyISAM` renomeando os arquivos `.MYD`, `.MYI` e `.frm` aos quais a Table corresponde. (Não obstante, é preferível usar `RENAME TABLE` ou `ALTER TABLE ... RENAME` e deixar o Server renomear os arquivos.)

* Sintaxe geral da linguagem

  + Por padrão, strings podem ser delimitadas por `"` assim como por `'`. Se o modo SQL `ANSI_QUOTES` estiver habilitado, strings podem ser delimitadas apenas por `'` e o Server interpreta strings delimitadas por `"` como identificadores.

  + `\` é o caractere de escape em strings.
  + Em instruções SQL, você pode acessar Tables de diferentes Databases com a sintaxe *`db_name.tbl_name`*. Alguns servidores SQL fornecem a mesma funcionalidade, mas a chamam de `User space`. O MySQL Server não suporta tablespaces como os usados em instruções como esta: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

* Sintaxe de instruções SQL

  + As instruções `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

  + As instruções `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`. Veja a Seção 13.1.11, “Instrução CREATE DATABASE”, Seção 13.1.22, “Instrução DROP DATABASE”, e Seção 13.1.1, “Instrução ALTER DATABASE”.

  + A instrução `DO`.
  + `EXPLAIN SELECT` para obter uma descrição de como as Tables são processadas pelo Query optimizer.

  + As instruções `FLUSH` e `RESET`.

  + A instrução `SET`. Veja a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

  + A instrução `SHOW`. Veja a Seção 13.7.5, “Instruções SHOW”. As informações produzidas por muitas das instruções `SHOW` específicas do MySQL podem ser obtidas de maneira mais padrão usando `SELECT` para consultar o `INFORMATION_SCHEMA`. Veja o Capítulo 24, *INFORMATION_SCHEMA Tables*.

  + Uso de `LOAD DATA`. Em muitos casos, esta sintaxe é compatível com o Oracle `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

  + Uso de `RENAME TABLE`. Veja a Seção 13.1.33, “Instrução RENAME TABLE”.

  + Uso de `REPLACE` em vez de `DELETE` mais `INSERT`. Veja a Seção 13.2.8, “Instrução REPLACE”.

  + Uso de `CHANGE col_name`, `DROP col_name`, ou `DROP INDEX`, `IGNORE` ou `RENAME` em instruções `ALTER TABLE`. Uso de múltiplas cláusulas `ADD`, `ALTER`, `DROP` ou `CHANGE` em uma instrução `ALTER TABLE`. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

  + Uso de nomes de Index, Indexes em um prefixo de uma Column, e uso de `INDEX` ou `KEY` em instruções `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

  + Uso de `TEMPORARY` ou `IF NOT EXISTS` com `CREATE TABLE`.

  + Uso de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.

  + A capacidade de remover múltiplas Tables com uma única instrução `DROP TABLE`.

  + As cláusulas `ORDER BY` e `LIMIT` das instruções `UPDATE` e `DELETE`.

  + Sintaxe `INSERT INTO tbl_name SET col_name = ...`.

  + A cláusula `DELAYED` das instruções `INSERT` e `REPLACE`.

  + A cláusula `LOW_PRIORITY` das instruções `INSERT`, `REPLACE`, `DELETE` e `UPDATE`.

  + Uso de `INTO OUTFILE` ou `INTO DUMPFILE` em instruções `SELECT`. Veja a Seção 13.2.9, “Instrução SELECT”.

  + Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` em instruções `SELECT`.

  + Você não precisa nomear todas as Columns selecionadas na cláusula `GROUP BY`. Isso proporciona melhor performance para algumas Queries muito específicas, mas bastante normais. Veja a Seção 12.19, “Funções de Agregação”.

  + Você pode especificar `ASC` e `DESC` com `GROUP BY`, e não apenas com `ORDER BY`.

  + A capacidade de definir variáveis em uma instrução com o operador de atribuição `:=`. Veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

* Tipos de Dados

  + Os Tipos de Dados `MEDIUMINT`, `SET` e `ENUM`, e os diversos Tipos de Dados `BLOB` e `TEXT`.

  + Os atributos de Tipo de Dado `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED` e `ZEROFILL`.

* Functions e operadores

  + Para facilitar para usuários que migram de outros ambientes SQL, o MySQL Server suporta aliases para muitas Functions. Por exemplo, todas as Funções de string suportam tanto a sintaxe SQL padrão quanto a sintaxe ODBC.

  + O MySQL Server interpreta os operadores `||` e `&&` como OR lógico e AND lógico, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Devido a esta sintaxe conveniente, o MySQL Server não suporta o operador SQL padrão `||` para concatenação de strings; utilize `CONCAT()` em vez disso. Como `CONCAT()` aceita qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.

  + Uso de `COUNT(DISTINCT value_list)` onde *`value_list`* tem mais de um elemento.

  + As comparações de String são, por padrão, case-insensitive (não sensíveis a maiúsculas e minúsculas), com a ordenação de classificação determinada pela collation do conjunto de caracteres atual, que é `latin1` (cp1252 Europeu Ocidental) por padrão. Para realizar comparações case-sensitive (sensíveis a maiúsculas e minúsculas), você deve declarar suas Columns com o atributo `BINARY` ou usar o cast `BINARY`, o que faz com que as comparações sejam feitas usando os valores subjacentes do código de caracteres em vez de uma ordenação lexical.

  + O operador `%` é um sinônimo para `MOD()`. Isto é, `N % M` é equivalente a `MOD(N,M)`. `%` é suportado para programadores C e para compatibilidade com PostgreSQL.

  + Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR` ou `LIKE` podem ser usados em expressões na lista de Columns de saída (à esquerda do `FROM`) em instruções `SELECT`. Por exemplo:

    ```sql
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

  + A Function `LAST_INSERT_ID()` retorna o valor `AUTO_INCREMENT` mais recente. Veja a Seção 12.15, “Information Functions”.

  + `LIKE` é permitido em valores numéricos.

  + Os operadores de expressão regular estendida `REGEXP` e `NOT REGEXP`.

  + `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, estas Functions podem aceitar um número variável de argumentos.)

  + As Functions `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `PASSWORD()`, `ENCRYPT()`, `MD5()`, `ENCODE()`, `DECODE()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()` e `WEEKDAY()`.

  + Uso de `TRIM()` para remover (trim) substrings. O SQL padrão suporta a remoção de caracteres únicos apenas.

  + As Functions de `GROUP BY` `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()` e `GROUP_CONCAT()`. Veja a Seção 12.19, “Funções de Agregação”.