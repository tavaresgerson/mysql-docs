#### 15.2.15.2 Comparativos Usando Subconsultas

O uso mais comum de uma subconsulta é na forma:

```
non_subquery_operand comparison_operator (subquery)
```

Onde *`operador_de_comparação`* é um desses operadores:

```
=  >  <  >=  <=  <>  !=  <=>
```

Por exemplo:

```
... WHERE 'a' = (SELECT column1 FROM t1)
```

O MySQL também permite essa construção:

```
non_subquery_operand LIKE (subquery)
```

Em um momento, o único local legal para uma subconsulta era no lado direito de uma comparação, e você ainda pode encontrar alguns SGBD antigos que insistem nisso.

Aqui está um exemplo de uma comparação de subconsulta na forma comum que você não pode fazer com uma junção. Ele encontra todas as linhas da tabela `t1` para as quais o valor da `column1` é igual a um valor máximo na tabela `t2`:

```
SELECT * FROM t1
  WHERE column1 = (SELECT MAX(column2) FROM t2);
```

Aqui está outro exemplo, que novamente é impossível com uma junção porque envolve agregação para uma das tabelas. Ele encontra todas as linhas da tabela `t1` contendo um valor que ocorre duas vezes em uma coluna dada:

```
SELECT * FROM t1 AS t
  WHERE 2 = (SELECT COUNT(*) FROM t1 WHERE t1.id = t.id);
```

Para uma comparação da subconsulta com um escalar, a subconsulta deve retornar um escalar. Para uma comparação da subconsulta com um construtor de linha, a subconsulta deve ser uma subconsulta de linha que retorne uma linha com o mesmo número de valores que o construtor de linha. Veja a Seção 15.2.15.5, “Subconsultas de Linha”.