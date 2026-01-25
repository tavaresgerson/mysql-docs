### 13.2.3 Declaração DO

```sql
DO expr [, expr] ...
```

O [`DO`](do.html "13.2.3 Declaração DO") executa as expressions, mas não retorna nenhum results. Na maioria dos aspectos, o [`DO`](do.html "13.2.3 Declaração DO") é uma forma abreviada para `SELECT expr, ...`, mas tem a vantagem de ser ligeiramente mais rápido quando você não se importa com o result.

O [`DO`](do.html "13.2.3 Declaração DO") é útil principalmente com functions que possuem side effects, como [`RELEASE_LOCK()`](locking-functions.html#function_release-lock).

Exemplo: Esta declaração [`SELECT`](select.html "13.2.9 Declaração SELECT") pausa, mas também produz um result set:

```sql
mysql> SELECT SLEEP(5);
+----------+
| SLEEP(5) |
+----------+
|        0 |
+----------+
1 row in set (5.02 sec)
```

O [`DO`](do.html "13.2.3 Declaração DO"), por outro lado, pausa sem produzir um result set:

```sql
mysql> DO SLEEP(5);
Query OK, 0 rows affected (4.99 sec)
```

Isso pode ser útil, por exemplo, em uma stored function ou trigger, que proíbem statements que produzem result sets.

O [`DO`](do.html "13.2.3 Declaração DO") executa apenas expressions. Ele não pode ser usado em todos os casos em que o `SELECT` pode ser usado. Por exemplo, `DO id FROM t1` é inválido porque faz referência a uma table.