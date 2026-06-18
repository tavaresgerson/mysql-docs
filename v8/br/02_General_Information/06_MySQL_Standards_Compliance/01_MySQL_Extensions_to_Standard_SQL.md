### 1.6.1 Extensões do MySQL para SQL Padrão

O MySQL Server suporta algumas extensões que você provavelmente não encontrará em outros SGBD SQL. Esteja ciente de que, se você as usar, seu código provavelmente não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```
/*! MySQL-specific code */
```

Nesse caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra instrução SQL, mas outros servidores SQL devem ignorar as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte instrução, mas outros servidores não devem:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário será executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no comentário a seguir será executada apenas por servidores do MySQL 5.1.10 ou superior:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As descrições a seguir listam as extensões do MySQL, organizadas por categoria.

- Organização de dados no disco

  O MySQL Server mapeia cada banco de dados para um diretório sob o diretório de dados do MySQL e mapeia as tabelas dentro de um banco de dados para nomes de arquivos no diretório do banco de dados. Consequentemente, os nomes de banco de dados e tabelas são sensíveis ao maiúsculas e minúsculas no MySQL Server em sistemas operacionais que têm nomes de arquivos sensíveis a maiúsculas e minúsculas (como a maioria dos sistemas Unix). Veja a Seção 11.2.3, “Sensibilidade ao Maiúsculas e Minúsculas dos Identificadores”.

- Sintaxe geral da linguagem

  - Por padrão, as strings podem ser fechadas com `"` e também com `'`. Se o modo SQL `ANSI_QUOTES` estiver ativado, as strings podem ser fechadas apenas com `'` e o servidor interpreta as strings fechadas com `"` como identificadores.

  - `\` é o caractere de escape em strings.

  - Nas instruções SQL, você pode acessar tabelas de diferentes bancos de dados com a sintaxe `db_name.tbl_name`. Alguns servidores SQL fornecem a mesma funcionalidade, mas chamam isso de `User space`. O MySQL Server não suporta tabelaspaces, como os usados em instruções como esta: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

- Sintaxe da instrução SQL

  - As declarações `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

  - As instruções `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`. Veja a Seção 15.1.12, “Instrução CREATE DATABASE”, a Seção 15.1.24, “Instrução DROP DATABASE” e a Seção 15.1.2, “Instrução ALTER DATABASE”.

  - A declaração `DO`.

  - `EXPLAIN SELECT` para obter uma descrição de como as tabelas são processadas pelo otimizador de consultas.

  - As declarações `FLUSH` e `RESET`.

  - A declaração `SET`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

  - A declaração `SHOW`. Veja a Seção 15.7.7, “Declarações SHOW”. As informações produzidas por muitas das declarações `SHOW` específicas do MySQL podem ser obtidas de maneira mais padrão usando `SELECT` para consultar `INFORMATION_SCHEMA`. Veja o Capítulo 28, *Tabelas do INFORMATION\_SCHEMA*.

  - Uso de `LOAD DATA`. Em muitos casos, essa sintaxe é compatível com a Oracle `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

  - Uso de `RENAME TABLE`. Veja a Seção 15.1.36, “Instrução RENAME TABLE”.

  - Use de `REPLACE` em vez de `DELETE` mais `INSERT`. Veja a Seção 15.2.12, “Instrução REPLACE”.

  - Uso de `CHANGE col_name`, `DROP col_name`, ou `DROP INDEX`, `IGNORE` ou `RENAME` em declarações `ALTER TABLE`. Uso de múltiplas cláusulas `ADD`, `ALTER`, `DROP` ou `CHANGE` em uma declaração `ALTER TABLE`. Consulte a Seção 15.1.9, “Declaração ALTER TABLE”.

  - Uso de nomes de índices, índices em um prefixo de uma coluna e uso de `INDEX` ou `KEY` em instruções `CREATE TABLE`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

  - Uso de `TEMPORARY` ou `IF NOT EXISTS` com `CREATE TABLE`.

  - Uso de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.

  - A capacidade de excluir várias tabelas com uma única declaração `DROP TABLE`.

  - As cláusulas `ORDER BY` e `LIMIT` das declarações `UPDATE` e `DELETE`.

  - `INSERT INTO tbl_name SET col_name = ...` sintaxe.

  - A cláusula `DELAYED` das declarações `INSERT` e `REPLACE`.

  - A cláusula `LOW_PRIORITY` das declarações `INSERT`, `REPLACE`, `DELETE` e `UPDATE`.

  - Uso de `INTO OUTFILE` ou `INTO DUMPFILE` em declarações `SELECT`. Veja a Seção 15.2.13, “Instrução SELECT”.

  - Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` nas declarações `SELECT`.

  - Você não precisa nomear todas as colunas selecionadas na cláusula `GROUP BY`. Isso proporciona um melhor desempenho para algumas consultas muito específicas, mas bastante comuns. Veja a Seção 14.19, “Funções de Agregação”.

  - Você pode especificar `ASC` e `DESC` com `GROUP BY`, não apenas com `ORDER BY`.

  - A capacidade de definir variáveis em uma declaração com o operador de atribuição `:=`. Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

- Tipos de dados

  - Os tipos de dados `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET` e `ENUM` e os vários tipos de dados `BLOB` e `TEXT`.

  - Os atributos dos tipos de dados `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED` e `ZEROFILL`.

- Funções e operadores

  - Para facilitar a migração de usuários de outros ambientes SQL, o MySQL Server suporta aliases para muitas funções. Por exemplo, todas as funções de string suportam tanto a sintaxe SQL padrão quanto a sintaxe ODBC.

  - O MySQL Server entende os operadores `||` e `&&` para significar OU lógico e E lógico, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Devido a essa sintaxe agradável, o MySQL Server não suporta o operador SQL padrão `||` para concatenação de strings; use `CONCAT()` em vez disso. Como o `CONCAT()` aceita qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.

  - Uso de `COUNT(DISTINCT value_list)` onde `value_list` tem mais de um elemento.

  - As comparações de strings são case-insensitive por padrão, com a ordem de classificação determinada pela collation do conjunto de caracteres atual, que é `utf8mb4` por padrão. Para realizar comparações case-sensitive em vez disso, você deve declarar suas colunas com o atributo `BINARY` ou usar a cast `BINARY`, que faz com que as comparações sejam feitas usando os valores dos códigos de caracteres subjacentes, em vez de uma classificação lexical.

  - O operador `%` é sinônimo de `MOD()`. Ou seja, `N % M` é equivalente a `MOD(N,M)`. `%` é suportado para programadores em C e para compatibilidade com o PostgreSQL.

  - Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR` ou `LIKE` podem ser usados em expressões na lista de colunas de saída (à esquerda do `FROM`) nas instruções `SELECT`. Por exemplo:

    ```
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

  - A função `LAST_INSERT_ID()` retorna o valor mais recente da `AUTO_INCREMENT`. Veja a Seção 14.15, “Funções de Informação”.

  - `LIKE` é permitido em valores numéricos.

  - Os operadores de expressão regular `REGEXP` e `NOT REGEXP` estendem a expressão regular.

  - `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, essas funções podem receber um número variável de argumentos.)

  - As funções `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `MD5()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()` e `WEEKDAY()`.

  - Uso de `TRIM()` para cortar substratos. O SQL padrão suporta a remoção de apenas um caractere.

  - As funções `GROUP BY` são `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()` e `GROUP_CONCAT()`. Veja a Seção 14.19, “Funções Agregadas”.
