### 8.3.10 Uso de Indexes de Coluna Gerada pelo Optimizer

O MySQL suporta Indexes em colunas geradas. Por exemplo:

```sql
CREATE TABLE t1 (f1 INT, gc INT AS (f1 + 1) STORED, INDEX (gc));
```

A coluna gerada, `gc`, é definida como a expressão `f1 + 1`. A coluna também é indexada e o Optimizer pode levar esse Index em consideração durante a construção do plano de execução. Na Query a seguir, a cláusula `WHERE` faz referência a `gc` e o Optimizer considera se o Index nessa coluna resulta em um plano mais eficiente:

```sql
SELECT * FROM t1 WHERE gc > 9;
```

O Optimizer pode usar Indexes em colunas geradas para gerar planos de execução, mesmo na ausência de referências diretas a essas colunas por nome nas Queries. Isso ocorre se a cláusula `WHERE`, `ORDER BY` ou `GROUP BY` fizer referência a uma expressão que corresponda à definição de alguma coluna gerada indexada. A Query a seguir não faz referência direta a `gc`, mas usa uma expressão que corresponde à definição de `gc`:

```sql
SELECT * FROM t1 WHERE f1 + 1 > 9;
```

O Optimizer reconhece que a expressão `f1 + 1` corresponde à definição de `gc` e que `gc` está indexada, então ele considera esse Index durante a construção do plano de execução. Você pode ver isso usando `EXPLAIN`:

```sql
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

Na prática, o Optimizer substituiu a expressão `f1

+ 1` pelo nome da coluna gerada que corresponde à expressão. Isso também fica evidente na Query reescrita disponível nas informações estendidas do `EXPLAIN` exibidas por `SHOW WARNINGS`:

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`f1` AS `f1`,`test`.`t1`.`gc`
         AS `gc` from `test`.`t1` where (`test`.`t1`.`gc` > 9)
```

As seguintes restrições e condições se aplicam ao uso de Indexes de coluna gerada pelo Optimizer:

* Para que uma expressão de Query corresponda a uma definição de coluna gerada, a expressão deve ser idêntica e deve ter o mesmo tipo de resultado (result type). Por exemplo, se a expressão da coluna gerada for `f1 + 1`, o Optimizer não reconhece uma correspondência se a Query usar `1 + f1`, ou se `f1 + 1` (uma expressão integer) for comparada com uma string.

* A otimização se aplica a estes operadores: `=`, `<`, `<=`, `>`, `>=`, `BETWEEN` e `IN()`.

  Para operadores diferentes de `BETWEEN` e `IN()`, qualquer um dos operandos pode ser substituído por uma coluna gerada correspondente. Para `BETWEEN` e `IN()`, apenas o primeiro argumento pode ser substituído por uma coluna gerada correspondente, e os outros argumentos devem ter o mesmo tipo de resultado (result type). `BETWEEN` e `IN()` ainda não são suportados para comparações envolvendo valores JSON.

* A coluna gerada deve ser definida como uma expressão que contenha pelo menos uma chamada de função (function call) ou um dos operadores mencionados no item anterior. A expressão não pode consistir em uma simples referência a outra coluna. Por exemplo, `gc INT AS (f1) STORED` consiste apenas em uma referência de coluna, portanto, Indexes em `gc` não são considerados.

* Para comparações de strings com colunas geradas indexadas que calculam um valor a partir de uma função JSON que retorna uma string entre aspas, é necessário usar `JSON_UNQUOTE()` na definição da coluna para remover as aspas extras do valor da função. (Para comparação direta de uma string com o resultado da função, o comparador JSON lida com a remoção de aspas, mas isso não ocorre para index lookups.) Por exemplo, em vez de escrever uma definição de coluna assim:

  ```sql
  doc_name TEXT AS (JSON_EXTRACT(jdoc, '$.name')) STORED
  ```

  Escreva-a assim:

  ```sql
  doc_name TEXT AS (JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name'))) STORED
  ```

  Com esta última definição, o Optimizer pode detectar uma correspondência para ambas as comparações:

  ```sql
  ... WHERE JSON_EXTRACT(jdoc, '$.name') = 'some_string' ...
  ... WHERE JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name')) = 'some_string' ...
  ```

  Sem `JSON_UNQUOTE()` na definição da coluna, o Optimizer detecta uma correspondência apenas para a primeira dessas comparações.

* Se o Optimizer falhar ao escolher o Index desejado, uma index hint pode ser usada para forçar o Optimizer a fazer uma escolha diferente.