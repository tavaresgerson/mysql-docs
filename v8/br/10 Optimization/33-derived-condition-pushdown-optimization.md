#### 10.2.2.5 Otimização de Empurrão de Condição Derivada

O MySQL suporta o empurrão de condição derivada para subconsultas elegíveis. Para uma consulta como `SELECT * FROM (SELECT i, j FROM t1) AS dt WHERE i > constante`, em muitos casos é possível empurrar a condição `WHERE` externa para a tabela derivada, resultando neste caso em `SELECT * FROM (SELECT i, j FROM t1 WHERE i > constante) AS dt`. Quando uma tabela derivada não pode ser mesclada na consulta externa (por exemplo, se a tabela derivada usa agregação), empurrar a condição `WHERE` externa para a tabela derivada deve diminuir o número de linhas que precisam ser processadas e, assim, acelerar a execução da consulta.

As condições `WHERE` externas podem ser empurradas para tabelas materializadas derivadas nas seguintes circunstâncias:

* Quando a tabela derivada não usa funções agregadas ou de janela, a condição `WHERE` externa pode ser empurrada para ela diretamente. Isso inclui condições `WHERE` com múltiplos predicados unidos com `AND`, `OR` ou ambos.

  Por exemplo, a consulta `SELECT * FROM (SELECT f1, f2 FROM t1) AS dt WHERE f1 < 3 AND f2 > 11` é reescrita como `SELECT f1, f2 FROM (SELECT f1, f2 FROM t1 WHERE f1 < 3 AND f2 > 11) AS dt`.
* Quando a tabela derivada tem um `GROUP BY` e não usa funções de janela, uma condição `WHERE` externa que faz referência a uma ou mais colunas que não fazem parte do `GROUP BY` pode ser empurrada para a tabela derivada como uma condição `HAVING`.

  Por exemplo, `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i, j) AS dt WHERE sum > 100` é reescrita seguindo o empurrão de condição derivada como `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i, j HAVING sum > 100) AS dt`.
* Quando a tabela derivada usa um `GROUP BY` e as colunas na condição `WHERE` externa são colunas `GROUP BY`, as condições `WHERE` que fazem referência a essas colunas podem ser empurradas diretamente para a tabela derivada.

Por exemplo, a consulta `SELECT * FROM (SELECT i,j, SUM(k) AS sum FROM t1 GROUP BY i,j) AS dt WHERE i > 10` é reescrita como `SELECT * FROM (SELECT i,j, SUM(k) AS sum FROM t1 WHERE i > 10 GROUP BY i,j) AS dt`.

No caso de a condição `WHERE` externa ter predicados que referenciam colunas que fazem parte do `GROUP BY`, bem como predicados que referenciam colunas que não fazem, os predicados do primeiro tipo são empurrados para baixo como condições `WHERE`, enquanto os do segundo tipo são empurrados para baixo como condições `HAVING`. Por exemplo, na consulta `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i,j) AS dt WHERE i > 10 AND sum > 100`, o predicado `i > 10` na cláusula `WHERE` externa refere-se a uma coluna de `GROUP BY`, enquanto o predicado `sum > 100` não refere-se a nenhuma coluna de `GROUP BY`. Assim, a otimização de empurrão de condição derivada faz com que a consulta seja reescrita de uma maneira semelhante à mostrada aqui:

```
  SELECT * FROM (
      SELECT i, j, SUM(k) AS sum FROM t1
          WHERE i > 10
          GROUP BY i, j
          HAVING sum > 100
      ) AS dt;
  ```

Para habilitar a otimização de empurrão de condição derivada, a variável de sistema `optimizer_switch` deve ter o sinalizador `derived_condition_pushdown` (adicionado nesta versão) definido como `on`, que é o ajuste padrão. Se essa otimização for desabilitada por `optimizer_switch`, você pode habilitá-la para uma consulta específica usando a dica de otimizador `DERIVED_CONDITION_PUSHDOWN`. Para desabilitar a otimização para uma consulta específica, use a dica de otimizador `NO_DERIVED_CONDITION_PUSHDOWN`.

As seguintes restrições e limitações se aplicam à otimização de empurrão de condição de tabela derivada:

* A otimização de empurrão de condição de tabela derivada pode ser empregada com consultas `UNION`, com as seguintes exceções:

+ A empilhamento de condições não pode ser usado com uma consulta `UNION` se qualquer tabela derivada materializada que faça parte da `UNION` for uma expressão comum de tabela recursiva (veja Expressões Comuns de Tabela Recursivas).
+ Condições que contêm expressões não determinísticas não podem ser empilhadas em uma tabela derivada.
* A tabela derivada não pode usar uma cláusula `LIMIT`.
* Condições que contêm subconsultas não podem ser empilhadas.
* A otimização não pode ser usada se a tabela derivada for uma tabela interna de uma junção externa.
* Se uma tabela derivada materializada for uma expressão comum de tabela, as condições não são empilhadas nela se ela for referenciada várias vezes.
* Condições que usam parâmetros podem ser empilhadas se a condição for da forma `coluna_derivada > ?`. Se uma coluna derivada em uma condição `WHERE` externa for uma expressão que contém um `?` na tabela derivada subjacente, essa condição não pode ser empilhada.
* Para uma consulta em que a condição está nas tabelas de uma vista criada usando `ALGORITHM=TEMPTABLE` em vez da própria vista, a igualdade múltipla não é reconhecida na resolução, e, portanto, a condição não pode ser empilhada. Isso ocorre porque, ao otimizar uma consulta, o empilhamento de condições ocorre durante a fase de resolução, enquanto a propagação da igualdade múltipla ocorre durante a otimização.
  
  Este não é um problema em tais casos para uma vista usando `ALGORITHM=MERGE`, onde a igualdade pode ser propagada e a condição empilhada.
* Uma condição não pode ser empilhada se a lista de `SELECT` da tabela derivada contiver atribuições a variáveis de usuário.