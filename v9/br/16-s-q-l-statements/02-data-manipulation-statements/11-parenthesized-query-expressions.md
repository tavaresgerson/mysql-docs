### 15.2.11 Expressões de Consulta Parentesiadas

```
parenthesized_query_expression:
    ( query_expression [order_by_clause] [limit_clause] )
      [order_by_clause]
      [limit_clause]
      [into_clause]

query_expression:
    query_block [set_op query_block [set_op query_block ...]]
      [order_by_clause]
      [limit_clause]
      [into_clause]

query_block:
    SELECT ... | TABLE | VALUES

order_by_clause:
    ORDER BY as for SELECT

limit_clause:
    LIMIT as for SELECT

into_clause:
    INTO as for SELECT

set_op:
    UNION | INTERSECT | EXCEPT
```

O MySQL 9.5 suporta expressões de consulta parentesiadas de acordo com a sintaxe anterior. No seu formato mais simples, uma expressão de consulta parentesiada contém uma única instrução `SELECT` ou outra instrução que retorna um conjunto de resultados e nenhuma cláusula opcional subsequente:

```
(SELECT 1);
(SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'mysql');

TABLE t;

VALUES ROW(2, 3, 4), ROW(1, -2, 3);
```

Uma expressão de consulta parentesiada também pode conter consultas vinculadas por uma ou mais operações de conjunto, como `UNION`, e terminar com qualquer ou todas as cláusulas opcionais:

```
mysql> (SELECT 1 AS result UNION SELECT 2);
+--------+
| result |
+--------+
|      1 |
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2) LIMIT 1;
+--------+
| result |
+--------+
|      1 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2) LIMIT 1 OFFSET 1;
+--------+
| result |
+--------+
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2)
       ORDER BY result DESC LIMIT 1;
+--------+
| result |
+--------+
|      2 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 2)
       ORDER BY result DESC LIMIT 1 OFFSET 1;
+--------+
| result |
+--------+
|      1 |
+--------+
mysql> (SELECT 1 AS result UNION SELECT 3 UNION SELECT 2)
       ORDER BY result LIMIT 1 OFFSET 1 INTO @var;
mysql> SELECT @var;
+------+
| @var |
+------+
|    2 |
+------+
```

`INTERSECT` age antes de `UNION` e `EXCEPT`, de modo que as seguintes duas instruções são equivalentes:

```
SELECT a FROM t1 EXCEPT SELECT b FROM t2 INTERSECT SELECT c FROM t3;

SELECT a FROM t1 EXCEPT (SELECT b FROM t2 INTERSECT SELECT c FROM t3);
```

Expressões de consulta parentesiadas também são usadas como expressões de consulta, portanto, uma expressão de consulta, geralmente composta por blocos de consulta, também pode consistir em expressões de consulta parentesiadas:

```
(TABLE t1 ORDER BY a) UNION (TABLE t2 ORDER BY b) ORDER BY z;
```

Blocos de consulta podem ter cláusulas finais `ORDER BY` e `LIMIT`, que são aplicadas antes da operação de conjunto externa, `ORDER BY`, e `LIMIT`.

Você não pode ter um bloco de consulta com uma cláusula final `ORDER BY` ou `LIMIT` sem envolvê-lo em parênteses, mas os parênteses podem ser usados para aplicação de restrições de várias maneiras:

* Para aplicar `LIMIT` em cada bloco de consulta:

  ```
  (SELECT 1 LIMIT 1) UNION (VALUES ROW(2) LIMIT 1);

  (VALUES ROW(1), ROW(2) LIMIT 2) EXCEPT (SELECT 2 LIMIT 1);
  ```

* Para aplicar `LIMIT` em ambos os blocos de consulta e em toda a expressão de consulta:

  ```
  (SELECT 1 LIMIT 1) UNION (SELECT 2 LIMIT 1) LIMIT 1;
  ```

* Para aplicar `LIMIT` em toda a expressão de consulta (sem parênteses):

  ```
  VALUES ROW(1), ROW(2) INTERSECT VALUES ROW(2), ROW(1) LIMIT 1;
  ```

* Aplicação híbrida: `LIMIT` no primeiro bloco de consulta e em toda a expressão de consulta:

  ```
  (SELECT 1 LIMIT 1) UNION SELECT 2 LIMIT 1;
  ```

A sintaxe descrita nesta seção está sujeita a certas restrições:

* Uma cláusula final `INTO` para uma expressão de consulta não é permitida se houver outra cláusula `INTO` dentro dos parênteses.

* Uma expressão de consulta entre colchetes que é aplicada também na consulta externa é tratada de acordo com o padrão SQL.

Expressões de consulta entre colchetes aninhadas são permitidas. O nível máximo de aninhamento suportado é de 63; isso ocorre após quaisquer simplificações ou fusões realizadas pelo analisador.

Um exemplo de tal declaração é mostrado aqui:

```
  mysql> (SELECT 'a' UNION SELECT 'b' LIMIT 2) LIMIT 3;
  +---+
  | a |
  +---+
  | a |
  | b |
  +---+
  2 rows in set (0.00 sec)
  ```

Você deve estar ciente de que, ao compactar os corpos das expressões entre colchetes, o MySQL segue a semântica padrão do SQL, de modo que um limite externo mais alto não pode anular um limite interno mais baixo. Por exemplo, `(SELECT ... LIMIT 5) LIMIT 10` pode retornar no máximo cinco linhas.