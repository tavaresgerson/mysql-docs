#### 13.2.10.3 Subqueries com ANY, IN, ou SOME

Sintaxe:

```sql
operand comparison_operator ANY (subquery)
operand IN (subquery)
operand comparison_operator SOME (subquery)
```

Onde *`comparison_operator`* é um destes operadores:

```sql
=  >  <  >=  <=  <>  !=
```

A palavra-chave `ANY`, que deve seguir um comparison operator, significa “retornar `TRUE` se a comparação for `TRUE` para `ANY` (qualquer) dos valores na coluna que a subquery retorna.” Por exemplo:

```sql
SELECT s1 FROM t1 WHERE s1 > ANY (SELECT s1 FROM t2);
```

Suponha que haja uma linha na Table `t1` contendo `(10)`. A expressão é `TRUE` se a Table `t2` contiver `(21,14,7)` porque há um valor `7` em `t2` que é menor que `10`. A expressão é `FALSE` se a Table `t2` contiver `(20,10)`, ou se a Table `t2` estiver vazia. A expressão é *desconhecida* (ou seja, `NULL`) se a Table `t2` contiver `(NULL,NULL,NULL)`.

Quando usada com uma subquery, a palavra `IN` é um alias para `= ANY`. Assim, estas duas declarações são as mesmas:

```sql
SELECT s1 FROM t1 WHERE s1 = ANY (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 IN    (SELECT s1 FROM t2);
```

`IN` e `= ANY` não são sinônimos quando usados com uma lista de expressões. `IN` pode receber uma lista de expressões, mas `= ANY` não. Consulte [Section 12.4.2, “Comparison Functions and Operators”](comparison-operators.html "12.4.2 Comparison Functions and Operators").

`NOT IN` não é um alias para `<> ANY`, mas sim para `<> ALL`. Consulte [Section 13.2.10.4, “Subqueries with ALL”](all-subqueries.html "13.2.10.4 Subqueries with ALL").

A palavra `SOME` é um alias para `ANY`. Assim, estas duas declarações são as mesmas:

```sql
SELECT s1 FROM t1 WHERE s1 <> ANY  (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 <> SOME (SELECT s1 FROM t2);
```

O uso da palavra `SOME` é raro, mas este exemplo mostra por que ela pode ser útil. Para a maioria das pessoas, a frase em inglês “a is not equal to any b” (a não é igual a nenhum b) significa “não existe b que seja igual a a,” mas não é isso que a sintaxe SQL significa. A sintaxe significa “existe algum b ao qual a não é igual.” Usar `<> SOME` em vez disso ajuda a garantir que todos compreendam o verdadeiro significado da Query.