#### 13.2.10.2 Comparações Usando Subqueries

O uso mais comum de uma subquery é na forma:

```sql
non_subquery_operand comparison_operator (subquery)
```

Onde *`comparison_operator`* é um destes operadores:

```sql
=  >  <  >=  <=  <>  !=  <=>
```

Por exemplo:

```sql
... WHERE 'a' = (SELECT column1 FROM t1)
```

O MySQL também permite esta construção:

```sql
non_subquery_operand LIKE (subquery)
```

Antigamente, o único local legal para uma subquery era no lado direito de uma comparação, e você ainda pode encontrar alguns DBMSs antigos que insistem nisso.

Aqui está um exemplo de uma comparação de subquery de formato comum que você não pode fazer com um JOIN. Ele encontra todas as linhas na tabela `t1` para as quais o valor de `column1` é igual a um valor máximo na tabela `t2`:

```sql
SELECT * FROM t1
  WHERE column1 = (SELECT MAX(column2) FROM t2);
```

Aqui está outro exemplo, que novamente é impossível com um JOIN porque envolve agregação para uma das tabelas. Ele encontra todas as linhas na tabela `t1` contendo um valor que ocorre duas vezes em uma determinada column:

```sql
SELECT * FROM t1 AS t
  WHERE 2 = (SELECT COUNT(*) FROM t1 WHERE t1.id = t.id);
```

Para uma comparação da subquery com um scalar, a subquery deve retornar um scalar. Para uma comparação da subquery com um row constructor, a subquery deve ser uma row subquery que retorna uma linha com o mesmo número de valores que o row constructor. Consulte [Section 13.2.10.5, “Row Subqueries”](row-subqueries.html "13.2.10.5 Row Subqueries").