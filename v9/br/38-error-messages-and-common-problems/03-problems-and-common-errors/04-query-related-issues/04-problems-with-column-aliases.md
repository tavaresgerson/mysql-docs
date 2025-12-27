#### B.3.4.4 Problemas com Alias de Colunas

Um alias pode ser usado em uma lista de seleção de consulta para dar um nome diferente a uma coluna. Você pode usar o alias em cláusulas `GROUP BY`, `ORDER BY` ou `HAVING` para referenciar a coluna:

```
SELECT SQRT(a*b) AS root FROM tbl_name
  GROUP BY root HAVING root > 0;
SELECT id, COUNT(*) AS cnt FROM tbl_name
  GROUP BY id HAVING cnt > 0;
SELECT id AS 'Customer identity' FROM tbl_name;
```

O SQL padrão não permite referências a alias de coluna em uma cláusula `WHERE`. Essa restrição é imposta porque, quando a cláusula `WHERE` é avaliada, o valor da coluna ainda pode não ter sido determinado. Por exemplo, a seguinte consulta é ilegal:

```
SELECT id, COUNT(*) AS cnt FROM tbl_name
  WHERE cnt > 0 GROUP BY id;
```

A cláusula `WHERE` determina quais linhas devem ser incluídas na cláusula `GROUP BY`, mas ela refere-se ao alias de um valor de coluna que não é conhecido até que as linhas tenham sido selecionadas e agrupadas pelo `GROUP BY`.

Na lista de seleção de uma consulta, um alias de coluna citado pode ser especificado usando caracteres de citação de identificador ou de string:

```
SELECT 1 AS `one`, 2 AS 'two';
```

Em outras partes da declaração, referências citadas ao alias devem usar citação de identificador ou a referência é tratada como uma literal de string. Por exemplo, esta declaração agrupa por os valores na coluna `id`, referenciados usando o alias `` `a` ``:

```
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY `a`;
```

Esta declaração agrupa por a literal string `'a'` e não funciona como você pode esperar:

```
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY 'a';
```