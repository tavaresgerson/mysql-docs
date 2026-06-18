#### B.3.4.4 Problemas com aliases de colunas

Um alias pode ser usado em uma lista de seleção de consulta para dar um nome diferente a uma coluna. Você pode usar o alias nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING` para referenciar a coluna:

```
SELECT SQRT(a*b) AS root FROM tbl_name
  GROUP BY root HAVING root > 0;
SELECT id, COUNT(*) AS cnt FROM tbl_name
  GROUP BY id HAVING cnt > 0;
SELECT id AS 'Customer identity' FROM tbl_name;
```

O SQL padrão não permite referências a aliases de coluna em uma cláusula `WHERE`. Essa restrição é imposta porque, quando a cláusula `WHERE` é avaliada, o valor da coluna ainda pode não ter sido determinado. Por exemplo, a seguinte consulta é ilegal:

```
SELECT id, COUNT(*) AS cnt FROM tbl_name
  WHERE cnt > 0 GROUP BY id;
```

A cláusula `WHERE` determina quais linhas devem ser incluídas na cláusula `GROUP BY`, mas ela se refere ao alias de um valor de coluna que só será conhecido após as linhas terem sido selecionadas e agrupadas pelo `GROUP BY`.

Na lista selecionada de uma consulta, um alias de coluna com aspas pode ser especificado usando caracteres de aspas para identificadores ou strings:

```
SELECT 1 AS `one`, 2 AS 'two';
```

Em outras partes da declaração, as referências a alias devem usar aspas de identificador ou a referência é tratada como uma literal de string. Por exemplo, esta declaração agrupa por os valores na coluna `id`, referenciada usando o alias `` `a` ``:

```
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY `a`;
```

Essa declaração agrupa por uma string literal `'a'` e não funciona conforme você espera:

```
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY 'a';
```
