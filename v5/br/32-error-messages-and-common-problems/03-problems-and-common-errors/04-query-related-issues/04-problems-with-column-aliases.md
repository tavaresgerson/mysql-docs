#### B.3.4.4 Problemas com Aliases de Coluna

Um alias pode ser usado em uma select list de uma Query para dar à coluna um nome diferente. Você pode usar o alias nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING` para se referir à coluna:

```sql
SELECT SQRT(a*b) AS root FROM tbl_name
  GROUP BY root HAVING root > 0;
SELECT id, COUNT(*) AS cnt FROM tbl_name
  GROUP BY id HAVING cnt > 0;
SELECT id AS 'Customer identity' FROM tbl_name;
```

O SQL Padrão não permite referências a aliases de coluna em uma cláusula `WHERE`. Essa restrição é imposta porque, quando a cláusula `WHERE` é avaliada, o valor da coluna pode ainda não ter sido determinado. Por exemplo, a seguinte Query é ilegal:

```sql
SELECT id, COUNT(*) AS cnt FROM tbl_name
  WHERE cnt > 0 GROUP BY id;
```

A cláusula `WHERE` determina quais linhas devem ser incluídas na cláusula `GROUP BY`, mas ela se refere ao alias de um valor de coluna que não é conhecido até que as linhas tenham sido selecionadas e agrupadas pelo `GROUP BY`.

Na select list de uma Query, um alias de coluna citado (quoted) pode ser especificado usando caracteres de citação de identificador ou de string:

```sql
SELECT 1 AS `one`, 2 AS 'two';
```

Em outros locais na instrução, referências citadas ao alias devem usar citação de identificador (identifier quoting), ou a referência é tratada como um string literal. Por exemplo, esta instrução agrupa pelos valores na coluna `id`, referenciados usando o alias `` `a` ``:

```sql
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY `a`;
```

Esta instrução agrupa pelo string literal `'a'` e não funciona conforme o esperado:

```sql
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY 'a';
```