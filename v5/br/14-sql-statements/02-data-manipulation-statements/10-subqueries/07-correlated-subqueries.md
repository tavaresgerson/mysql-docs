#### 13.2.10.7 Subconsultas Correlacionadas

Uma *subconsulta correlacionada* é uma subconsulta que contém uma referência a uma tabela que também aparece na consulta externa. Por exemplo:

```sql
SELECT * FROM t1
  WHERE column1 = ANY (SELECT column1 FROM t2
                       WHERE t2.column2 = t1.column2);
```

Observe que a subconsulta contém uma referência a uma coluna de `t1`, embora a cláusula `FROM` da subconsulta não mencione uma tabela `t1`. Portanto, o MySQL procura fora da subconsulta e encontra `t1` na consulta externa.

Suponha que a tabela `t1` contenha uma linha onde `column1 = 5` e `column2 = 6`; enquanto isso, a tabela `t2` contém uma linha onde `column1 = 5` e `column2 = 7`. A expressão simples `... WHERE column1 = ANY (SELECT column1 FROM t2)` seria `TRUE`, mas, neste exemplo, a cláusula `WHERE` dentro da subconsulta é `FALSE` (porque `(5,6)` não é igual a `(5,7)`), então a expressão como um todo é `FALSE`.

**Regra de escopo:** O MySQL avalia de dentro para fora. Por exemplo:

```sql
SELECT column1 FROM t1 AS x
  WHERE x.column1 = (SELECT column1 FROM t2 AS x
    WHERE x.column1 = (SELECT column1 FROM t3
      WHERE x.column2 = t3.column1));
```

Nesta declaração, `x.column2` deve ser uma coluna na tabela `t2`, pois `SELECT column1 FROM t2 AS x ...` renomeia `t2`. Não é uma coluna na tabela `t1`, pois `SELECT column1 FROM t1 ...` é uma consulta externa que está *mais distante*.

Para subconsultas nas cláusulas `HAVING` ou `ORDER BY`, o MySQL também procura nomes de colunas na lista de seleção externa.

Para certos casos, uma subconsulta correlacionada é otimizada. Por exemplo:

```sql
val IN (SELECT key_val FROM tbl_name WHERE correlated_condition)
```

Caso contrário, eles são ineficientes e provavelmente serão lentos. Reescrever a consulta como uma junção pode melhorar o desempenho.

As funções agregadas em subconsultas correlacionadas podem conter referências externas, desde que a função contenha apenas referências externas e desde que a função não esteja contida em outra função ou expressão.
