#### 13.2.10.7 Subqueries Correlacionadas

Uma *Subquery correlacionada* é uma Subquery que contém uma referência a uma tabela que também aparece na Query externa. Por exemplo:

```sql
SELECT * FROM t1
  WHERE column1 = ANY (SELECT column1 FROM t2
                       WHERE t2.column2 = t1.column2);
```

Note que a Subquery contém uma referência a uma coluna de `t1`, embora a cláusula `FROM` da Subquery não mencione uma tabela `t1`. Portanto, o MySQL procura fora da Subquery e encontra `t1` na Query externa.

Suponha que a tabela `t1` contenha uma linha onde `column1 = 5` e `column2 = 6`; enquanto isso, a tabela `t2` contém uma linha onde `column1 = 5` e `column2 = 7`. A expressão simples `... WHERE column1 = ANY (SELECT column1 FROM t2)` seria `TRUE`, mas neste exemplo, a cláusula `WHERE` dentro da Subquery é `FALSE` (porque `(5,6)` não é igual a `(5,7)`), portanto, a expressão como um todo é `FALSE`.

**Regra de Escopo:** O MySQL avalia de dentro para fora. Por exemplo:

```sql
SELECT column1 FROM t1 AS x
  WHERE x.column1 = (SELECT column1 FROM t2 AS x
    WHERE x.column1 = (SELECT column1 FROM t3
      WHERE x.column2 = t3.column1));
```

Nesta instrução, `x.column2` deve ser uma coluna na tabela `t2` porque `SELECT column1 FROM t2 AS x ...` renomeia `t2`. Não é uma coluna na tabela `t1` porque `SELECT column1 FROM t1 ...` é uma Query externa que está *mais distante*.

Para Subqueries nas cláusulas `HAVING` ou `ORDER BY`, o MySQL também procura nomes de colunas na lista de seleção externa.

Para certos casos, uma Subquery correlacionada é otimizada. Por exemplo:

```sql
val IN (SELECT key_val FROM tbl_name WHERE correlated_condition)
```

Caso contrário, elas são ineficientes e provavelmente lentas. Reescrever a Query como um JOIN pode melhorar o desempenho.

Funções de agregação em Subqueries correlacionadas podem conter referências externas, desde que a função contenha apenas referências externas, e desde que a função não esteja contida em outra função ou expressão.