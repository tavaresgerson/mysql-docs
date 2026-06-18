## 14.5 Funções de controle de fluxo

**Tabela 14.7 Operadores de Controle de Fluxo**

<table summary="Uma referência que lista operadores de controle de fluxo."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>CASE</code>]]</td> <td>Operador de caso</td> </tr><tr><td>[[<code>IF()</code>]]</td> <td>Estrutura if/else</td> </tr><tr><td>[[<code>IFNULL()</code>]]</td> <td>Estrutura if/else nula</td> </tr><tr><td>[[<code>NULLIF()</code>]]</td> <td>Retorne NULL se expr1 = expr2</td> </tr></tbody></table>

- `CASE value WHEN compare_value THEN result [WHEN compare_value THEN result ...] [ELSE result] END`

  `CASE WHEN condition THEN result [WHEN condition THEN result ...] [ELSE result] END`

  A sintaxe `CASE` retorna o `result` para a primeira comparação `value=compare_value` que for verdadeira. A segunda sintaxe retorna o resultado para a primeira condição que for verdadeira. Se nenhuma comparação ou condição for verdadeira, o resultado após `ELSE` é retornado, ou `NULL` se não houver uma parte `ELSE`.

  Nota

  A sintaxe do operador `CASE` \* descrita aqui difere ligeiramente da do *comando* `CASE` SQL descrito na Seção 15.6.5.1, “Comando CASE”, para uso dentro de programas armazenados. O comando `CASE` não pode ter uma cláusula `ELSE NULL`, e é finalizado com `END CASE` em vez de `END`.

  O tipo de retorno de um resultado de expressão `CASE` é o tipo agregado de todos os valores de resultado:

  - Se todos os tipos forem numéricos, o tipo agregado também será numérico:

    - Se pelo menos um argumento for de ponto duplo, o resultado será de ponto duplo.

    - Caso contrário, se pelo menos um argumento for `DECIMAL` - DECIMAL, NUMERIC"), o resultado será `DECIMAL` - DECIMAL, NUMERIC").

    - Caso contrário, o resultado é um tipo inteiro (com uma exceção):

      - Se todos os tipos inteiros forem todos assinados ou todos não assinados, o resultado será o mesmo sinal e a precisão será a mais alta de todos os tipos inteiros especificados (ou seja, `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)").

      - Se houver uma combinação de tipos de inteiros assinados e não assinados, o resultado será assinado e a precisão pode ser maior. Por exemplo, se os tipos forem `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e não assinados `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o resultado será `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

      - A exceção é o tipo de inteiro não assinado `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") combinado com qualquer tipo de inteiro assinado. O resultado é `DECIMAL` - DECIMAL, NUMERIC") com precisão e escala suficientes de 0.

  - Se todos os tipos forem `BIT`, o resultado é `BIT`. Caso contrário, os argumentos `BIT` são tratados de forma semelhante aos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  - Se todos os tipos forem `YEAR`, o resultado é `YEAR`. Caso contrário, os argumentos `YEAR` são tratados de forma semelhante aos `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  - Se todos os tipos forem cadeias de caracteres (`CHAR` ou `VARCHAR`), o resultado será `VARCHAR`, com o comprimento máximo determinado pelo comprimento mais longo dos operandos.

  - Se todos os tipos forem caracteres ou strings binárias, o resultado será `VARBINARY`.

  - `SET` e `ENUM` são tratados de forma semelhante a `VARCHAR`; o resultado é `VARCHAR`.

  - Se todos os tipos forem `JSON`, o resultado será `JSON`.

  - Se todos os tipos são temporais, o resultado também é temporal:

    - Se todos os tipos temporais forem `DATE`, `TIME` ou `TIMESTAMP`, o resultado será `DATE`, `TIME` ou `TIMESTAMP`, respectivamente.

    - Caso contrário, para uma mistura de tipos temporais, o resultado é `DATETIME`.

  - Se todos os tipos forem `GEOMETRY`, o resultado será `GEOMETRY`.

  - Se qualquer tipo for `BLOB`, o resultado é `BLOB`.

  - Para todas as outras combinações de tipos, o resultado é `VARCHAR`.

  - Operandos literais `NULL` são ignorados para a agregação de tipos.

  ```
  mysql> SELECT CASE 1 WHEN 1 THEN 'one'
      ->     WHEN 2 THEN 'two' ELSE 'more' END;
          -> 'one'
  mysql> SELECT CASE WHEN 1>0 THEN 'true' ELSE 'false' END;
          -> 'true'
  mysql> SELECT CASE BINARY 'B'
      ->     WHEN 'a' THEN 1 WHEN 'b' THEN 2 END;
          -> NULL
  ```

- `IF(expr1,expr2,expr3)`

  Se `expr1` for `TRUE` (`expr1 <> 0` e `expr1 IS NOT NULL`), `IF()` retorna `expr2`. Caso contrário, ele retorna `expr3`.

  Nota

  Existe também uma declaração `IF` *que difere da função `IF()`* descrita aqui. Veja a Seção 15.6.5.2, “Declaração IF”.

  Se apenas um dos `expr2` ou `expr3` for explicitamente `NULL`, o tipo de resultado da função `IF()` é o tipo da expressão que não é `NULL`.

  O tipo de retorno padrão de `IF()` (que pode ser importante quando ele é armazenado em uma tabela temporária) é calculado da seguinte forma:

  - Se `expr2` ou `expr3` produzem uma string, o resultado é uma string.

    Se `expr2` e `expr3` forem ambos strings, o resultado será case-sensitive se qualquer uma das strings for case-sensitive.

  - Se `expr2` ou `expr3` produzem um valor de ponto flutuante, o resultado é um valor de ponto flutuante.

  - Se `expr2` ou `expr3` produzem um inteiro, o resultado é um inteiro.

  ```
  mysql> SELECT IF(1>2,2,3);
          -> 3
  mysql> SELECT IF(1<2,'yes','no');
          -> 'yes'
  mysql> SELECT IF(STRCMP('test','test1'),'no','yes');
          -> 'no'
  ```

- `IFNULL(expr1,expr2)`

  Se `expr1` não for `NULL`, `IFNULL()` retorna `expr1`; caso contrário, retorna `expr2`.

  ```
  mysql> SELECT IFNULL(1,0);
          -> 1
  mysql> SELECT IFNULL(NULL,10);
          -> 10
  mysql> SELECT IFNULL(1/0,10);
          -> 10
  mysql> SELECT IFNULL(1/0,'yes');
          -> 'yes'
  ```

  O tipo de retorno padrão de `IFNULL(expr1,expr2)` é o mais "geral" das duas expressões, na ordem `STRING`, `REAL` ou `INTEGER`. Considere o caso de uma tabela baseada em expressões ou onde o MySQL deve armazenar internamente um valor retornado por `IFNULL()` em uma tabela temporária:

  ```
  mysql> CREATE TABLE tmp SELECT IFNULL(1,'test') AS test;
  mysql> DESCRIBE tmp;
  +-------+--------------+------+-----+---------+-------+
  | Field | Type         | Null | Key | Default | Extra |
  +-------+--------------+------+-----+---------+-------+
  | test  | varbinary(4) | NO   |     |         |       |
  +-------+--------------+------+-----+---------+-------+
  ```

  Neste exemplo, o tipo da coluna `test` é `VARBINARY(4)` (um tipo de string).

- `NULLIF(expr1,expr2)`

  Retorna `NULL` se `expr1 = expr2` for verdadeiro, caso contrário, retorna `expr1`. Isso é o mesmo que `CASE WHEN expr1 = expr2 THEN NULL ELSE expr1 END`.

  O valor de retorno tem o mesmo tipo que o primeiro argumento.

  ```
  mysql> SELECT NULLIF(1,1);
          -> NULL
  mysql> SELECT NULLIF(1,2);
          -> 1
  ```

  Nota

  O MySQL avalia `expr1` duas vezes se os argumentos não forem iguais.

O tratamento dos valores das variáveis do sistema por essas funções mudou no MySQL 8.0.22. Para cada uma dessas funções, se o primeiro argumento contiver apenas caracteres presentes no conjunto de caracteres e na collation usados pelo segundo argumento (e for constante), a collation e o conjunto de caracteres usados para a comparação serão os do segundo argumento. No MySQL 8.0.22 e versões posteriores, os valores das variáveis do sistema são tratados como valores de coluna do mesmo conjunto de caracteres e collation. Algumas consultas que usavam essas funções com variáveis do sistema que anteriormente eram bem-sucedidas podem ser rejeitadas posteriormente com "Combinação ilegal de collation". Nesses casos, você deve converter a variável do sistema para o conjunto de caracteres e collation corretos.
