### 15.2.11 Expressões de consulta entre parênteses

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

O MySQL 8.0.22 e versões superiores suportam expressões de consulta entre parênteses de acordo com a sintaxe anterior. No seu formato mais simples, uma expressão de consulta entre parênteses contém uma única `SELECT` ou outra instrução que retorna um conjunto de resultados e nenhuma cláusula opcional subsequente:

```
(SELECT 1);
(SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'mysql');

TABLE t;

VALUES ROW(2, 3, 4), ROW(1, -2, 3);
```

(O suporte para as declarações `TABLE` e `VALUES` está disponível a partir do MySQL 8.0.19.)

Uma expressão de consulta entre parênteses também pode conter consultas vinculadas por uma ou mais operações de conjunto, como `UNION`, e terminar com qualquer ou todas as cláusulas opcionais:

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

Além do operador de conjunto `UNION`, os operadores de conjunto `INTERSECT` e `EXCEPT` estão disponíveis a partir do MySQL 8.0.31. `INTERSECT` age antes de `UNION` e `EXCEPT`, de modo que as duas seguintes instruções sejam equivalentes:

```
SELECT a FROM t1 EXCEPT SELECT b FROM t2 INTERSECT SELECT c FROM t3;

SELECT a FROM t1 EXCEPT (SELECT b FROM t2 INTERSECT SELECT c FROM t3);
```

As expressões de consulta entre parênteses também são usadas como expressões de consulta, portanto, uma expressão de consulta, geralmente composta por blocos de consulta, também pode consistir em expressões de consulta entre parênteses:

```
(TABLE t1 ORDER BY a) UNION (TABLE t2 ORDER BY b) ORDER BY z;
```

Os blocos de consulta podem ter cláusulas finais `ORDER BY` e `LIMIT`, que são aplicadas antes da operação de conjunto externo, `ORDER BY` e `LIMIT`.

Você não pode ter um bloco de consulta com um `ORDER BY` ou `LIMIT` final sem envolvê-lo em parênteses, mas os parênteses podem ser usados para aplicação de várias maneiras:

- Para aplicar `LIMIT` em cada bloco de consulta:

  ```
  (SELECT 1 LIMIT 1) UNION (VALUES ROW(2) LIMIT 1);

  (VALUES ROW(1), ROW(2) LIMIT 2) EXCEPT (SELECT 2 LIMIT 1);
  ```

- Para aplicar `LIMIT` tanto nos blocos de consulta quanto na expressão da consulta inteira:

  ```
  (SELECT 1 LIMIT 1) UNION (SELECT 2 LIMIT 1) LIMIT 1;
  ```

- Para aplicar `LIMIT` em toda a expressão da consulta (sem parênteses):

  ```
  VALUES ROW(1), ROW(2) INTERSECT VALUES ROW(2), ROW(1) LIMIT 1;
  ```

- Execução híbrida: `LIMIT` no primeiro bloco de consulta e na expressão da consulta inteira:

  ```
  (SELECT 1 LIMIT 1) UNION SELECT 2 LIMIT 1;
  ```

A sintaxe descrita nesta seção está sujeita a certas restrições:

- Uma cláusula `INTO` de fechamento para uma expressão de consulta não é permitida se houver outra cláusula `INTO` dentro dos parênteses.

- Antes do MySQL 8.0.31, quando `ORDER BY` ou `LIMIT` ocorria dentro de uma expressão de consulta entre parênteses e também era aplicada na consulta externa, o resultado era indefinido. Isso não é um problema no MySQL 8.0.31 e versões posteriores, onde isso é tratado de acordo com o padrão SQL.

  Antes do MySQL 8.0.31, as expressões de consulta entre parênteses não permitiam múltiplos níveis de operações `ORDER BY` ou `LIMIT`, e as instruções que as continham eram rejeitadas com `ER_NOT_SUPPORTED_YET`. No MySQL 8.0.31 e versões posteriores, essa restrição foi levantada e as expressões de consulta entre parênteses aninhadas são permitidas. O nível máximo de aninhamento suportado é de 63; isso ocorre após quaisquer simplificações ou fusões realizadas pelo analisador.

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

  Você deve estar ciente de que, no MySQL 8.0.31 e versões posteriores, ao compactar os corpos das expressões entre parênteses, o MySQL segue a semântica padrão do SQL, de modo que um limite externo superior não pode anular um limite interno inferior. Por exemplo, `(SELECT ... LIMIT 5) LIMIT 10` não pode retornar mais de cinco linhas.
