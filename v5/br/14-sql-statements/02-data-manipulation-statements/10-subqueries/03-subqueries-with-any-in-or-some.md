#### 13.2.10.3 Subconsultas com ANY, IN ou SOME

Sintaxe:

```sql
operand comparison_operator ANY (subquery)
operand IN (subquery)
operand comparison_operator SOME (subquery)
```

Onde *`comparador`* é um desses operadores:

```sql
=  >  <  >=  <=  <>  !=
```

A palavra-chave `ANY`, que deve ser seguida por um operador de comparação, significa “retorne `TRUE` se a comparação for `TRUE` para `ANY` dos valores na coluna que a subconsulta retorna”. Por exemplo:

```sql
SELECT s1 FROM t1 WHERE s1 > ANY (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(21,14,7)` porque há um valor `7` em `t2` que é menor que `10`. A expressão é `FALSE` se a tabela `t2` contiver `(20,10)` ou se a tabela `t2` estiver vazia. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(NULL,NULL,NULL)`.

Quando usado com uma subconsulta, a palavra `IN` é um alias para `= ANY`. Portanto, essas duas instruções são iguais:

```sql
SELECT s1 FROM t1 WHERE s1 = ANY (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 IN    (SELECT s1 FROM t2);
```

`IN` e `= ANY` não são sinônimos quando usados com uma lista de expressão. `IN` pode aceitar uma lista de expressão, mas `= ANY` não pode. Veja Seção 12.4.2, “Funções e Operadores de Comparação”.

`NOT IN` não é um alias para `<> ANY`, mas sim para `<> ALL`. Veja Seção 13.2.10.4, “Subconsultas com ALL”.

A palavra `SOME` é um alias para `ANY`. Assim, essas duas declarações são iguais:

```sql
SELECT s1 FROM t1 WHERE s1 <> ANY  (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 <> SOME (SELECT s1 FROM t2);
```

O uso da palavra `algum` é raro, mas este exemplo mostra por que ela pode ser útil. Para a maioria das pessoas, a frase em inglês “a não é igual a qualquer b” significa “não existe um b que seja igual a a”, mas isso não é o que a sintaxe SQL significa. A sintaxe significa “existe algum b para o qual a não é igual”. Usar `<> algum` em vez disso ajuda a garantir que todos entendam o verdadeiro significado da consulta.
