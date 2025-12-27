### 15.2.3 Declaração `DO`

```
DO expr [, expr] ...
```

O `DO` executa as expressões, mas não retorna nenhum resultado. Na maioria dos casos, `DO` é uma abreviação de `SELECT expr, ...`, mas tem a vantagem de ser um pouco mais rápido quando você não se importa com o resultado.

`DO` é útil principalmente com funções que têm efeitos colaterais, como `RELEASE_LOCK()`.

Exemplo: Esta declaração `SELECT` pausa, mas também produz um conjunto de resultados:

```
mysql> SELECT SLEEP(5);
+----------+
| SLEEP(5) |
+----------+
|        0 |
+----------+
1 row in set (5.02 sec)
```

Por outro lado, o `DO` pausa sem produzir um conjunto de resultados:

```
mysql> DO SLEEP(5);
Query OK, 0 rows affected (4.99 sec)
```

Isso pode ser útil, por exemplo, em uma função ou gatilho armazenado, que proíbem declarações que produzem conjuntos de resultados.

`DO` executa apenas expressões. Não pode ser usado em todos os casos em que o `SELECT` pode ser usado. Por exemplo, `DO id FROM t1` é inválido porque faz referência a uma tabela.