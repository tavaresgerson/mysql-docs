## 12.5 Funções de controle de fluxo

**Tabela 12.7 Operadores de Controle de Fluxo**

<table frame="box" rules="all" summary="Uma referência que lista operadores de controle de fluxo."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>CASE</code></td> <td>Operador de caso</td> </tr><tr><td><code>IF()</code></td> <td>Estrutura if/else</td> </tr><tr><td><code>IFNULL()</code></td> <td>Estrutura if/else nula</td> </tr><tr><td><code>NULLIF()</code></td> <td>Retorne NULL se expr1 = expr2</td> </tr></tbody></table>

- `CASE valor WHEN valor_comparativo ENTÃO resultado [WHEN valor_comparativo ENTÃO resultado ...] [ELSE resultado] FIM`

  `CASE quando condição ENTÃO resultado [Quando condição ENTÃO resultado ...] [ELSE resultado] FIM`

  A sintaxe `CASE` retorna o *`resultado`* para a primeira comparação `value=compare_value` que for verdadeira. A segunda sintaxe retorna o resultado para a primeira condição que for verdadeira. Se nenhuma comparação ou condição for verdadeira, o resultado após `ELSE` é retornado, ou `NULL` se não houver uma parte `ELSE`.

  Nota

  A sintaxe do operador `CASE` descrito aqui difere ligeiramente da do `CASE` *instrução* SQL descrito na Seção 13.6.5.1, “Instrução CASE”, para uso dentro de programas armazenados. A instrução `CASE` não pode ter uma cláusula `ELSE NULL` e é encerrada com `END CASE` em vez de `END`.

  O tipo de retorno de um resultado de uma expressão `CASE` é o tipo agregado de todos os valores de resultado.

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

- `IF(expr1,expr2,expr3)`

  Se *`expr1`* for `TRUE` (`expr1 <> 0` e `expr1 IS NOT NULL`), o `IF()` retorna *`expr2`*. Caso contrário, ele retorna *`expr3`*.

  Nota

  Existe também uma declaração `IF`, que difere da função `IF()` descrita aqui. Veja a Seção 13.6.5.2, “Declaração IF”.

  Se apenas um dos *`expr2`* ou *`expr3`* for explicitamente `NULL`, o tipo de resultado da função `IF()` será o tipo da expressão que não é `NULL`.

  O tipo de retorno padrão do `IF()` (que pode ser importante quando ele é armazenado em uma tabela temporária) é calculado da seguinte forma:

  - Se *`expr2`* ou *`expr3`* produzem uma string, o resultado é uma string.

    Se *`expr2`* e *`expr3`* forem ambas cadeias de caracteres, o resultado será case-sensitive se qualquer uma das cadeias de caracteres for case-sensitive.

  - Se *`expr2`* ou *`expr3`* produzem um valor de ponto flutuante, o resultado é um valor de ponto flutuante.

  - Se *`expr2`* ou *`expr3`* produzem um inteiro, o resultado é um inteiro.

  ```sql
  mysql> SELECT IF(1>2,2,3);
          -> 3
  mysql> SELECT IF(1<2,'yes','no');
          -> 'yes'
  mysql> SELECT IF(STRCMP('test','test1'),'no','yes');
          -> 'no'
  ```

- `IFNULL(expr1, expr2)`

  Se *`expr1`* não for `NULL`, a função `IFNULL()` retorna *`expr1`*; caso contrário, ela retorna *`expr2`*.

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

  O tipo de retorno padrão de `IFNULL(expr1, expr2)` é o mais "geral" das duas expressões, na ordem `STRING`, `REAL` ou `INTEGER`. Considere o caso de uma tabela baseada em expressões ou onde o MySQL deve armazenar internamente um valor retornado por `IFNULL()` em uma tabela temporária:

  ```sql
  mysql> CREATE TABLE tmp SELECT IFNULL(1,'test') AS test;
  mysql> DESCRIBE tmp;
  +-------+--------------+------+-----+---------+-------+
  | Field | Type         | Null | Key | Default | Extra |
  +-------+--------------+------+-----+---------+-------+
  | test  | varbinary(4) | NO   |     |         |       |
  +-------+--------------+------+-----+---------+-------+
  ```

  Neste exemplo, o tipo da coluna `test` é `VARBINARY(4)` (um tipo de string).

- `NULLIF(expr1, expr2)`

  Retorna `NULL` se `expr1 = expr2` for verdadeiro, caso contrário, retorna \*`expr1*`. Isso é o mesmo que `CASE WHEN expr1 = expr2 THEN NULL ELSE expr1 END`.

  O valor de retorno tem o mesmo tipo que o primeiro argumento.

  ```sql
  mysql> SELECT NULLIF(1,1);
          -> NULL
  mysql> SELECT NULLIF(1,2);
          -> 1
  ```

  Nota

  O MySQL avalia *`expr1`* duas vezes se os argumentos não forem iguais.
