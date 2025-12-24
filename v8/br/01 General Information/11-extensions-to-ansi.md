### 1.7.1 Extensões do MySQL para o SQL padrão

O MySQL Server suporta algumas extensões que você provavelmente não encontrará em outros DBMSs SQL. Seja avisado de que, se você as usar, seu código provavelmente não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclui extensões MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra instrução SQL, mas outros servidores SQL devem ignorar as extensões.

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada somente se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no comentário a seguir é executada somente por servidores do MySQL 5.1.10 ou superior:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As seguintes descrições listam extensões do MySQL, organizadas por categoria.

#### Organização dos dados no disco:

O MySQL Server mapeia cada banco de dados para um diretório sob o diretório de dados do MySQL e mapeia tabelas dentro de um banco de dados para nomes de arquivos no diretório do banco de dados. Consequentemente, os nomes de banco de dados e de tabelas são case-sensitivos no MySQL Server em sistemas operacionais que têm nomes de arquivos case-sensitivos (como a maioria dos sistemas Unix).

#### Síntese geral da linguagem:

- Por padrão, as strings podem ser fechadas por `"` bem como por `'`. Se o `ANSI_QUOTES` modo SQL estiver habilitado, as strings podem ser fechadas apenas por `'` e o servidor interpreta strings fechadas por `"` como identificadores.
- `\` é o caractere de escape em strings.
- Em instruções SQL, você pode acessar tabelas de diferentes bancos de dados com a sintaxe \* `db_name.tbl_name` \*. Alguns servidores SQL fornecem a mesma funcionalidade, mas chamam isso de `User space`.

#### Sintase da instrução SQL:

- As instruções `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE`, e `REPAIR TABLE`.
- As instruções `CREATE DATABASE`, `DROP DATABASE`, e `ALTER DATABASE`. Ver Seção 15.1.12, `CREATE DATABASE` Instrução, Seção 15.1.24, `DROP DATABASE` Instrução, e Seção 15.1.2, `ALTER DATABASE` Instrução.
- A instrução `DO`.
- `EXPLAIN SELECT` para obter uma descrição de como as tabelas são processadas pelo otimizador de consulta.
- As instruções `FLUSH` e `RESET`.
- A instrução `SET`. Veja a Seção 15.7.6.1, `SET` Síntese para Atribuição de Variável.
- A instrução `SHOW` Ver Seção 15.7.7, SHOW Statements. As informações produzidas por muitas das instruções `SHOW` específicas do MySQL podem ser obtidas de forma mais padrão usando `SELECT` para consultar `INFORMATION_SCHEMA`.
- Utilização de `LOAD DATA`. Em muitos casos, esta sintaxe é compatível com a Oracle `LOAD DATA`. Ver Seção 15.2.9, `LOAD DATA` Declaração.
- Utilização de `RENAME TABLE`. Ver Seção 15.1.36, `RENAME TABLE` Declaração.
- Utilização de `REPLACE` em vez de `DELETE` mais `INSERT`.
- Uso de `CHANGE col_name`, `DROP col_name`, ou `DROP INDEX`, `IGNORE` ou `RENAME` em `ALTER TABLE` declarações. Uso de múltiplas `ADD`, `ALTER`, `DROP`, ou `CHANGE` cláusulas em uma `ALTER TABLE` declaração. Ver Seção 15.1.9, `ALTER TABLE` Declaração.
- Uso de nomes de índice, índices em um prefixo de uma coluna e uso de `INDEX` ou `KEY` em `CREATE TABLE` instruções.
- Utilização de `TEMPORARY` ou `IF NOT EXISTS` com `CREATE TABLE`.
- Utilização de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.
- A capacidade de soltar várias tabelas com uma única instrução `DROP TABLE`.
- As cláusulas `ORDER BY` e `LIMIT` das instruções `UPDATE` e `DELETE`.
- Síntese \[`INSERT INTO tbl_name SET col_name = ...`].
- A cláusula `DELAYED` das instruções `INSERT` e `REPLACE`.
- A cláusula `LOW_PRIORITY` das instruções `INSERT`, `REPLACE`, `DELETE`, e `UPDATE`.
- Utilização de `INTO OUTFILE` ou `INTO DUMPFILE` em declarações de `SELECT`. Ver Seção 15.2.13, `SELECT` Declaração.
- Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` em `SELECT` instruções.
- Você não precisa nomear todas as colunas selecionadas na cláusula `GROUP BY`. Isso dá um melhor desempenho para algumas consultas muito específicas, mas bastante normais. Veja Seção 14.19,  Funções agregadas.
- Você pode especificar `ASC` e `DESC` com `GROUP BY`, não apenas com `ORDER BY`.
- A capacidade de definir variáveis em uma instrução com o operador de atribuição `:=`.

#### Tipos de dados:

- Os tipos de dados `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET`, e `ENUM`, e os vários tipos de dados `BLOB` e `TEXT`.
- Os atributos do tipo de dados `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED`, e `ZEROFILL`.

#### Funções e operadores:

- Para facilitar a migração de usuários de outros ambientes SQL, o MySQL Server suporta aliases para muitas funções.
- O MySQL Server entende os operadores `||` e `&&` como significando OR e AND lógicos, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Por causa dessa boa sintaxe, o MySQL Server não suporta o operador padrão SQL `||` para concatenação de strings; use `CONCAT()` em vez disso. Como `CONCAT()` leva qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.
- Utilização de `COUNT(DISTINCT value_list)` onde `value_list` tem mais de um elemento.
- As comparações de cadeia são case-insensíveis por padrão, com a ordem de classificação determinada pela coleta do conjunto de caracteres atual, que é `utf8mb4` por padrão. Para realizar comparações case-sensíveis, você deve declarar suas colunas com o atributo `BINARY` ou usar o `BINARY` cast, o que faz com que as comparações sejam feitas usando os valores de código de caracteres subjacentes em vez de uma ordenação léxica.
- O operador `%` é um sinônimo de `MOD()`. Isto é, `N % M` é equivalente a `MOD(N,M)`. `%` é suportado para programadores em C e para compatibilidade com PostgreSQL.
- Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR`, ou `LIKE` podem ser usados em expressões na lista de colunas de saída (à esquerda do `FROM`) nas instruções `SELECT` . Por exemplo:

  ```sql
  mysql> SELECT col1=1 AND col2=2 FROM my_table;
  ```
- A função `LAST_INSERT_ID()` retorna o valor `AUTO_INCREMENT` mais recente.
- \[`LIKE`]] é permitido em valores numéricos.
- O `REGEXP` e o `NOT REGEXP` são operadores de expressão regulares estendidos.
- `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, essas funções podem ter um número variável de argumentos.)
- As funções `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `MD5()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()`, e `WEEKDAY()`.
- Uso de `TRIM()` para cortar substrings. O SQL padrão suporta a remoção de caracteres únicos.
- As funções `GROUP BY` são `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()`, e `GROUP_CONCAT()`.
