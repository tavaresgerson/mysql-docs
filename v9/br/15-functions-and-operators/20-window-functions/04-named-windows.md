### 14.20.4 Janelas com nomes

As janelas podem ser definidas e receber nomes para serem referenciadas em cláusulas `OVER`. Para isso, use uma cláusula `WINDOW`. Se presente em uma consulta, a cláusula `WINDOW` fica entre as posições das cláusulas `HAVING` e `ORDER BY`, e tem a seguinte sintaxe:

```
WINDOW window_name AS (window_spec)
    [, window_name AS (window_spec)] ...
```

Para cada definição de janela, *`window_name`* é o nome da janela, e *`window_spec`* é o mesmo tipo de especificação de janela como o dado entre os parênteses de uma cláusula `OVER`, conforme descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

A cláusula `WINDOW` é útil para consultas em que múltiplas cláusulas `OVER` de outra forma definiriam a mesma janela. Em vez disso, você pode definir a janela uma vez, dar-lhe um nome e referenciar o nome nas cláusulas `OVER`. Considere esta consulta, que define a mesma janela várias vezes:

```
SELECT
  val,
  ROW_NUMBER() OVER (ORDER BY val) AS 'row_number',
  RANK()       OVER (ORDER BY val) AS 'rank',
  DENSE_RANK() OVER (ORDER BY val) AS 'dense_rank'
FROM numbers;
```

A consulta pode ser escrita de forma mais simples usando `WINDOW` para definir a janela uma vez e referenciar a janela pelo nome nas cláusulas `OVER`:

```
SELECT
  val,
  ROW_NUMBER() OVER w AS 'row_number',
  RANK()       OVER w AS 'rank',
  DENSE_RANK() OVER w AS 'dense_rank'
FROM numbers
WINDOW w AS (ORDER BY val);
```

Uma janela com nome também facilita a experimentação com a definição da janela para ver o efeito nos resultados da consulta. Você precisa apenas modificar a definição da janela na cláusula `WINDOW`, em vez de múltiplas definições de cláusulas `OVER`.

Se uma cláusula `OVER` usa `OVER (window_name ...)` em vez de `OVER window_name`, a janela com nome pode ser modificada pela adição de outras cláusulas. Por exemplo, esta consulta define uma janela que inclui particionamento e usa `ORDER BY` nas cláusulas `OVER` para modificar a janela de maneiras diferentes:

```
SELECT
  DISTINCT year, country,
  FIRST_VALUE(year) OVER (w ORDER BY year ASC) AS first,
  FIRST_VALUE(year) OVER (w ORDER BY year DESC) AS last
FROM sales
WINDOW w AS (PARTITION BY country);
```

Uma cláusula `OVER` só pode adicionar propriedades a uma janela nomeada, não modificá-las. Se a definição da janela nomeada incluir uma propriedade de particionamento, ordenação ou enquadramento, a cláusula `OVER` que se refere ao nome da janela não pode incluir o mesmo tipo de propriedade, ou ocorrerá um erro:

* Este construto é permitido porque a definição da janela e a cláusula `OVER` que a refere não contêm o mesmo tipo de propriedades:

  ```
  OVER (w ORDER BY country)
  ... WINDOW w AS (PARTITION BY country)
  ```

* Este construto não é permitido porque a cláusula `OVER` especifica `PARTITION BY` para uma janela nomeada que já tem `PARTITION BY`:

  ```
  OVER (w PARTITION BY year)
  ... WINDOW w AS (PARTITION BY country)
  ```

A definição de uma janela nomeada pode começar com um *`window_name`*. Nesses casos, referências para frente e para trás são permitidas, mas não ciclos:

* Isso é permitido; contém referências para frente e para trás, mas não ciclos:

  ```
  WINDOW w1 AS (w2), w2 AS (), w3 AS (w1)
  ```

* Isso não é permitido porque contém um ciclo:

  ```
  WINDOW w1 AS (w2), w2 AS (w3), w3 AS (w1)
  ```