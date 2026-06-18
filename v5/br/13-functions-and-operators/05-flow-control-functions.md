## 12.5 Funções de Controle de Fluxo

**Tabela 12.7 Operadores de Controle de Fluxo**

<table frame="box" rules="all" summary="Uma referência que lista operadores de controle de fluxo."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>CASE</code></td> <td> Operador CASE </td> </tr><tr><td><code>IF()</code></td> <td> Construto If/else </td> </tr><tr><td><code>IFNULL()</code></td> <td> Construto If/else para NULL </td> </tr><tr><td><code>NULLIF()</code></td> <td> Retorna NULL se expr1 = expr2 </td> </tr> </tbody></table>

* `CASE value WHEN compare_value THEN result [WHEN compare_value THEN result ...] [ELSE result] END`

  `CASE WHEN condition THEN result [WHEN condition THEN result ...] [ELSE result] END`

  A primeira sintaxe `CASE` retorna o *`result`* para a primeira comparação `value=compare_value` que for verdadeira. A segunda sintaxe retorna o resultado para a primeira condição que for verdadeira. Se nenhuma comparação ou condição for verdadeira, o resultado após `ELSE` é retornado, ou `NULL` se não houver parte `ELSE`.

  Nota

  A sintaxe do *operador* `CASE` descrita aqui difere ligeiramente da do *statement* SQL `CASE` descrito na Seção 13.6.5.1, “CASE Statement”, para uso em stored programs. O statement `CASE` não pode ter uma cláusula `ELSE NULL`, e é finalizado com `END CASE` em vez de `END`.

  O tipo de retorno do resultado de uma expressão `CASE` é o tipo agregado de todos os valores de resultado.

  ```sql
  mysql> SELECT CASE 1 WHEN 1 THEN 'one'
      ->     WHEN 2 THEN 'two' ELSE 'more' END;
          -> 'one'
  mysql> SELECT CASE WHEN 1>0 THEN 'true' ELSE 'false' END;
          -> 'true'
  mysql> SELECT CASE BINARY 'B'
      ->     WHEN 'a' THEN 1 WHEN 'b' THEN 2 END;
          -> NULL
  ```

* `IF(expr1,expr2,expr3)`

  Se *`expr1`* for `TRUE` (`expr1 <> 0` e `expr1 IS NOT NULL`), `IF()` retorna *`expr2`*. Caso contrário, retorna *`expr3`*.

  Nota

  Existe também um *statement* `IF`, que difere da *função* `IF()` descrita aqui. Consulte a Seção 13.6.5.2, “IF Statement”.

  Se apenas uma das expressões, *`expr2`* ou *`expr3`*, for explicitamente `NULL`, o tipo de resultado da função `IF()` é o tipo da expressão não-`NULL`.

  O tipo de retorno padrão de `IF()` (o que pode ser relevante quando armazenado em uma temporary table) é calculado da seguinte forma:

  + Se *`expr2`* ou *`expr3`* produzirem uma string, o resultado é uma string.

    Se *`expr2`* e *`expr3`* forem ambas strings, o resultado fará distinção entre maiúsculas e minúsculas (case-sensitive) se qualquer uma das strings for case-sensitive.

  + Se *`expr2`* ou *`expr3`* produzirem um floating-point value, o resultado é um floating-point value.

  + Se *`expr2`* ou *`expr3`* produzirem um inteiro, o resultado é um inteiro.

  ```sql
  mysql> SELECT IF(1>2,2,3);
          -> 3
  mysql> SELECT IF(1<2,'yes','no');
          -> 'yes'
  mysql> SELECT IF(STRCMP('test','test1'),'no','yes');
          -> 'no'
  ```

* `IFNULL(expr1,expr2)`

  Se *`expr1`* não for `NULL`, `IFNULL()` retorna *`expr1`*; caso contrário, retorna *`expr2`*.

  ```sql
  mysql> SELECT IFNULL(1,0);
          -> 1
  mysql> SELECT IFNULL(NULL,10);
          -> 10
  mysql> SELECT IFNULL(1/0,10);
          -> 10
  mysql> SELECT IFNULL(1/0,'yes');
          -> 'yes'
  ```

  O tipo de retorno padrão de `IFNULL(expr1,expr2)` é o mais “geral” das duas expressões, na ordem `STRING`, `REAL`, ou `INTEGER`. Considere o caso de uma table baseada em expressões ou onde o MySQL deve armazenar internamente um valor retornado por `IFNULL()` em uma temporary table:

  ```sql
  mysql> CREATE TABLE tmp SELECT IFNULL(1,'test') AS test;
  mysql> DESCRIBE tmp;
  +-------+--------------+------+-----+---------+-------+
  | Field | Type         | Null | Key | Default | Extra |
  +-------+--------------+------+-----+---------+-------+
  | test  | varbinary(4) | NO   |     |         |       |
  +-------+--------------+------+-----+---------+-------+
  ```

  Neste exemplo, o tipo da coluna `test` é `VARBINARY(4)` (um tipo string).

* `NULLIF(expr1,expr2)`

  Retorna `NULL` se `expr1 = expr2` for verdadeiro, caso contrário, retorna *`expr1`*. Isso é o mesmo que `CASE WHEN expr1 = expr2 THEN NULL ELSE expr1 END`.

  O valor de retorno tem o mesmo tipo que o primeiro argumento.

  ```sql
  mysql> SELECT NULLIF(1,1);
          -> NULL
  mysql> SELECT NULLIF(1,2);
          -> 1
  ```

  Nota

  O MySQL avalia *`expr1`* duas vezes se os argumentos não forem iguais.