### 15.2.18 Cláusula de UNIÃO

```
query_expression_body UNION [ALL | DISTINCT] query_block
    [UNION [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`UNION` combina o resultado de vários blocos de consulta em um único conjunto de resultados. Este exemplo usa as instruções `SELECT`:

```
mysql> SELECT 1, 2;
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
+---+---+
mysql> SELECT 'a', 'b';
+---+---+
| a | b |
+---+---+
| a | b |
+---+---+
mysql> SELECT 1, 2 UNION SELECT 'a', 'b';
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
| a | b |
+---+---+
```

#### UNION Handing: Entrevista sobre o MySQL 8.0 em comparação com o MySQL 5.7

No MySQL 8.0, as regras do analisador para `SELECT` e `UNION` foram refatoradas para serem mais consistentes (a mesma sintaxe `SELECT` se aplica uniformemente em cada contexto) e reduzir a duplicação. Comparado ao MySQL 5.7, vários efeitos visíveis para o usuário resultaram desse trabalho, que podem exigir a reescrita de certas declarações:

- `NATURAL JOIN` permite a palavra-chave opcional `INNER` (`NATURAL INNER JOIN`), em conformidade com o SQL padrão.

- As junções de direita sem parênteses são permitidas (por exemplo, `... JOIN ... JOIN ... ON ... ON`), em conformidade com o SQL padrão.

- O `STRAIGHT_JOIN` agora permite uma cláusula `USING`, semelhante a outras junções internas.

- O analisador aceita parênteses em torno de expressões de consulta. Por exemplo, `(SELECT ... UNION SELECT ...)` é permitido. Veja também a Seção 15.2.11, “Expressões de Consulta com Parênteses”.

- O analisador se adequa melhor à colocação permitida documentada dos modificadores de consulta `SQL_CACHE` e `SQL_NO_CACHE`.

- A nidificação de operadores à esquerda, anteriormente permitida apenas em subconsultas, agora é permitida em declarações de nível superior. Por exemplo, esta declaração agora é aceita como válida:

  ```
  (SELECT 1 UNION SELECT 1) UNION SELECT 1;
  ```

- As cláusulas de bloqueio (`FOR UPDATE`, `LOCK IN SHARE MODE`) são permitidas apenas em consultas que não são `UNION`. Isso significa que as chaves devem ser usadas para as instruções `SELECT` que contêm cláusulas de bloqueio. Esta declaração não é mais aceita como válida:

  ```
  SELECT 1 FOR UPDATE UNION SELECT 1 FOR UPDATE;
  ```

  Em vez disso, escreva a declaração assim:

  ```
  (SELECT 1 FOR UPDATE) UNION (SELECT 1 FOR UPDATE);
  ```
