### 1.6.1 Extensões do MySQL para SQL Padrão

O MySQL Server suporta algumas extensões que provavelmente não são encontradas em outros SGBD SQL. Esteja ciente de que, se você as usar, seu código não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```sql
/*! MySQL-specific code */
```

Nesse caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra instrução SQL, mas outros servidores SQL ignoram as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte instrução, mas outros servidores não:

```sql
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário será executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no comentário a seguir será executada apenas por servidores do MySQL 5.1.10 ou superior:

```sql
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As descrições a seguir listam as extensões do MySQL, organizadas por categoria.

- Organização de dados no disco

  O MySQL Server mapeia cada banco de dados para um diretório sob o diretório de dados do MySQL e mapeia as tabelas dentro de um banco de dados para nomes de arquivos no diretório do banco de dados. Isso tem algumas implicações:

  - Os nomes de bancos de dados e tabelas são sensíveis ao maiúsculas e minúsculas no MySQL Server em sistemas operacionais que têm nomes de arquivos sensíveis ao maiúsculas e minúsculas (como a maioria dos sistemas Unix). Consulte a Seção 9.2.3, “Sensibilidade ao Maiúsculas e Minúsculas dos Identificadores”.

  - Você pode usar comandos padrão do sistema para fazer backup, renomear, mover, excluir e copiar tabelas gerenciadas pelo motor de armazenamento `MyISAM`. Por exemplo, é possível renomear uma tabela `MyISAM` renomeando os arquivos `.MYD`, `.MYI` e `.frm` aos quais a tabela corresponde. (No entanto, é preferível usar `RENAME TABLE` ou `ALTER TABLE ... RENAME` e deixar o servidor renomear os arquivos.)

- Sintaxe geral da linguagem

  - Por padrão, as cadeias de caracteres podem ser fechadas com `"` assim como `'`. Se o modo SQL `ANSI_QUOTES` estiver ativado, as cadeias de caracteres podem ser fechadas apenas com `'` e o servidor interpreta as cadeias de caracteres fechadas com `"` como identificadores.

  - `\` é o caractere de escape em strings.

  - Nas instruções SQL, você pode acessar tabelas de diferentes bancos de dados com a sintaxe *`db_name.tbl_name`*. Alguns servidores SQL fornecem a mesma funcionalidade, mas chamam isso de `Espaço do usuário`. O MySQL Server não suporta tabelaspaces, como os usados em instruções como: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

- Sintaxe da instrução SQL

  - As instruções `ANALYSE TÁBLIA`, `VER TÁBLIA`, `OTIMIZAR TÁBLIA` e `REPAIR TÁBLIA`.

  - As instruções `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`. Consulte a Seção 13.1.11, “Instrução CREATE DATABASE”, a Seção 13.1.22, “Instrução DROP DATABASE” e a Seção 13.1.1, “Instrução ALTER DATABASE”.

  - A declaração `DO`.

  - `EXPLAIN SELECT` para obter uma descrição de como as tabelas são processadas pelo otimizador de consultas.

  - As instruções `FLUSH` e `RESET`.

  - A instrução `SET`. Veja a Seção 13.7.4.1, “Sintaxe SET para atribuição de variáveis”.

  - A instrução `SHOW`. Veja a Seção 13.7.5, “Instruções SHOW”. As informações produzidas por muitas das instruções `SHOW` específicas do MySQL podem ser obtidas de maneira mais padrão usando `SELECT` para consultar o `INFORMATION_SCHEMA`. Veja o Capítulo 24, *Tabelas INFORMATION\_SCHEMA*.

  - Uso de `LOAD DATA`. Em muitos casos, essa sintaxe é compatível com o `LOAD DATA` do Oracle. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

  - Uso de `RENAME TABLE`. Veja a Seção 13.1.33, “Instrução RENAME TABLE”.

  - Uso de `REPLACE` em vez de `DELETE` mais `INSERT`. Veja a Seção 13.2.8, “Instrução REPLACE”.

  - Uso de `ALTER TABLE` com `CHANGE col_name`, `DROP col_name` ou `DROP INDEX`, `IGNORE` ou `RENAME`. Uso de múltiplas cláusulas `ALTER`, `DROP` ou `CHANGE` em uma instrução `ALTER TABLE`. Consulte a Seção 13.1.8, “Instrução ALTER TABLE”.

  - Uso de nomes de índices, índices em um prefixo de uma coluna e uso de `INDEX` ou `KEY` em instruções `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

  - Uso de `TEMPORARY` ou `IF NOT EXISTS` com `CREATE TABLE`.

  - Uso de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.

  - A capacidade de descartar várias tabelas com uma única instrução `DROP TABLE`.

  - As cláusulas `ORDER BY` e `LIMIT` das instruções `UPDATE` e `DELETE`.

  - A sintaxe `INSERT INTO tbl_name SET col_name = ...`.

  - A cláusula `DELAYED` das instruções `INSERT` e `REPLACE`.

  - A cláusula `LOW_PRIORITY` das instruções `INSERT`, `REPLACE`, `DELETE` e `UPDATE`.

  - Uso de `INTO OUTFILE` ou `INTO DUMPFILE` em instruções `SELECT`. Veja a Seção 13.2.9, “Instrução SELECT”.

  - Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` em instruções `SELECT`.

  - Você não precisa nomear todas as colunas selecionadas na cláusula `GROUP BY`. Isso melhora o desempenho de algumas consultas muito específicas, mas bastante comuns. Veja a Seção 12.19, “Funções de agregação”.

  - Você pode especificar `ASC` e `DESC` com `GROUP BY`, não apenas com `ORDER BY`.

  - A capacidade de definir variáveis em uma declaração com o operador de atribuição `:=`. Veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

- Tipos de dados

  - Os tipos de dados `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET` e `ENUM`, e os vários tipos de dados `BLOB` e `TEXT`.

  - Os atributos de tipos de dados `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED` e `ZEROFILL`.

- Funções e operadores

  - Para facilitar a migração de usuários de outros ambientes SQL, o MySQL Server suporta aliases para muitas funções. Por exemplo, todas as funções de string suportam tanto a sintaxe SQL padrão quanto a sintaxe ODBC.

  - O MySQL Server entende os operadores `||` e `&&` para significar OR lógico e AND, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Devido a essa sintaxe agradável, o MySQL Server não suporta o operador padrão SQL `||` para concatenação de strings; use `CONCAT()`. Como o `CONCAT()` aceita qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.

  - Uso de `COUNT(DISTINCT value_list)` quando *`value_list`* tem mais de um elemento.

  - As comparações de strings são case-insensitive por padrão, com a ordem de classificação determinada pela collation do conjunto de caracteres atual, que é `latin1` (cp1252 europeu ocidental) por padrão. Para realizar comparações case-sensitive em vez disso, você deve declarar suas colunas com o atributo `BINARY` ou usar a cast `BINARY`, que faz com que as comparações sejam feitas usando os valores dos códigos de caracteres subjacentes, em vez de uma classificação lexical.

  - O operador `%` é sinônimo de `MOD()`. Ou seja, `N % M` é equivalente a `MOD(N, M)`. O `%` é suportado para programadores C e para compatibilidade com o PostgreSQL.

  - Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR` ou `LIKE` podem ser usados em expressões na lista de colunas de saída (à esquerda de `FROM`) em instruções `SELECT`. Por exemplo:

    ```sql
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

  - A função `LAST_INSERT_ID()` retorna o valor `AUTO_INCREMENT` mais recente. Veja a Seção 12.15, “Funções de Informação”.

  - O símbolo `LIKE` é permitido em valores numéricos.

  - Os operadores de expressão regular `REGEXP` e `NOT REGEXP`.

  - `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, essas funções podem receber um número variável de argumentos.)

  - As funções `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `PASSWORD()`, `ENCRYPT()`, `MD5()`, `ENCODE()`, `DECODE()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()` e `WEEKDAY()`.

  - Uso de `TRIM()` para cortar substratos. O SQL padrão suporta a remoção de apenas um caractere.

  - As funções `GROUP BY` `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()` e `GROUP_CONCAT()`. Veja a Seção 12.19, “Funções agregadas”.
