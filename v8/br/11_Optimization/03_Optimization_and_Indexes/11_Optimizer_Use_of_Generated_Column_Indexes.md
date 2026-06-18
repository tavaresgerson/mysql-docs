### 10.3.11 Otimizador Uso de Índices de Colunas Geradas

O MySQL suporta índices em colunas geradas. Por exemplo:

```
CREATE TABLE t1 (f1 INT, gc INT AS (f1 + 1) STORED, INDEX (gc));
```

A coluna gerada, `gc`, é definida como a expressão `f1 + 1`. A coluna também é indexada e o otimizador pode levar esse índice em consideração durante a construção do plano de execução. Na seguinte consulta, a cláusula `WHERE` refere-se a `gc` e o otimizador considera se o índice nessa coluna resulta em um plano mais eficiente:

```
SELECT * FROM t1 WHERE gc > 9;
```

O otimizador pode usar índices em colunas geradas para gerar planos de execução, mesmo na ausência de referências diretas nas consultas a essas colunas pelo nome. Isso ocorre se a cláusula `WHERE`, `ORDER BY` ou `GROUP BY` se referir a uma expressão que corresponde à definição de alguma coluna gerada indexada. A consulta a seguir não se refere diretamente a `gc`, mas usa uma expressão que corresponde à definição de `gc`:

```
SELECT * FROM t1 WHERE f1 + 1 > 9;
```

O otimizador reconhece que a expressão `f1 + 1` corresponde à definição de `gc` e que `gc` está indexado, então ele considera esse índice durante a construção do plano de execução. Você pode ver isso usando `EXPLAIN`:

```
mysql> EXPLAIN SELECT * FROM t1 WHERE f1 + 1 > 9\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: gc
          key: gc
      key_len: 5
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using index condition
```

Na verdade, o otimizador substituiu a expressão \`f1

- 1`with the name of the generated column that matches the expression. That is also apparent in the rewritten query available in the extended`EXPLAIN`information displayed by`MOSTRA ATENÇÕES\`:

```
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`f1` AS `f1`,`test`.`t1`.`gc`
         AS `gc` from `test`.`t1` where (`test`.`t1`.`gc` > 9)
```

As seguintes restrições e condições se aplicam ao uso do otimizador de índices de coluna gerados:

- Para que uma expressão de consulta corresponda a uma definição de coluna gerada, a expressão deve ser idêntica e deve ter o mesmo tipo de resultado. Por exemplo, se a expressão de coluna gerada for `f1 + 1`, o otimizador não reconhecerá uma correspondência se a consulta usar `1 + f1`, ou se `f1 + 1` (uma expressão numérica) for comparada com uma string.

- A otimização se aplica a esses operadores: `=`, `<`, `<=`, `>`, `>=`, `BETWEEN` e `IN()`.

  Para operadores diferentes de `BETWEEN` e `IN()`, qualquer dos operandos pode ser substituído por uma coluna gerada que corresponda. Para `BETWEEN` e `IN()`, apenas o primeiro argumento pode ser substituído por uma coluna gerada que corresponda, e os outros argumentos devem ter o mesmo tipo de resultado. `BETWEEN` e `IN()` ainda não são suportados para comparações envolvendo valores JSON.

- A coluna gerada deve ser definida como uma expressão que contenha pelo menos uma chamada de função ou um dos operadores mencionados no item anterior. A expressão não pode consistir em uma simples referência a outra coluna. Por exemplo, `gc INT AS (f1) STORED` consiste apenas em uma referência a uma coluna, portanto, os índices em `gc` não são considerados.

- Para comparações de cadeias com colunas geradas indexadas que calculam um valor a partir de uma função JSON que retorna uma string entre aspas, é necessário `JSON_UNQUOTE()` na definição da coluna para remover as aspas extras do valor da função. (Para comparação direta de uma string com o resultado da função, o comparador JSON remove as aspas, mas isso não ocorre para consultas de índice. Por exemplo, em vez de escrever uma definição de coluna assim:

  ```
  doc_name TEXT AS (JSON_EXTRACT(jdoc, '$.name')) STORED
  ```

  Escreva assim:

  ```
  doc_name TEXT AS (JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name'))) STORED
  ```

  Com a última definição, o otimizador pode detectar uma correspondência para ambas as comparações:

  ```
  ... WHERE JSON_EXTRACT(jdoc, '$.name') = 'some_string' ...
  ... WHERE JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name')) = 'some_string' ...
  ```

  Sem `JSON_UNQUOTE()` na definição da coluna, o otimizador detecta uma correspondência apenas para a primeira dessas comparações.

- Se o otimizador escolher o índice errado, uma dica de índice pode ser usada para desabilitá-lo e forçar o otimizador a fazer uma escolha diferente.
