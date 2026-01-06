### 13.2.3 Declaração do DO

```sql
DO expr [, expr] ...
```

`DO` executa as expressões, mas não retorna nenhum resultado. Na maioria dos casos, `DO` é uma abreviação de `SELECT expr, ...`, mas tem a vantagem de ser um pouco mais rápido quando você não se importa com o resultado.

`DO` é útil principalmente com funções que têm efeitos colaterais, como `RELEASE_LOCK()`.

Exemplo: A instrução `SELECT` pausa, mas também gera um conjunto de resultados:

```sql
mysql> SELECT SLEEP(5);
+----------+
| SLEEP(5) |
+----------+
|        0 |
+----------+
1 row in set (5.02 sec)
```

`DO`, por outro lado, pausa sem produzir um conjunto de resultados.:

```sql
mysql> DO SLEEP(5);
Query OK, 0 rows affected (4.99 sec)
```

Isso pode ser útil, por exemplo, em uma função ou gatilho armazenado, que proíbem instruções que produzem conjuntos de resultados.

`DO` executa apenas expressões. Não pode ser usado em todos os casos em que o `SELECT` pode ser usado. Por exemplo, `DO id FROM t1` é inválido porque faz referência a uma tabela.
