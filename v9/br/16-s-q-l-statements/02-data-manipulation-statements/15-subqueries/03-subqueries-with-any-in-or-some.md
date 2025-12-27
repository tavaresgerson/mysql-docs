#### 15.2.15.3 Subconsultas com ANY, IN ou SOME

Sintaxe:

```
operand comparison_operator ANY (subquery)
operand IN (subquery)
operand comparison_operator SOME (subquery)
```

Onde *`operador_de_comparação`* é um desses operadores:

```
=  >  <  >=  <=  <>  !=
```

A palavra-chave `ANY`, que deve seguir um operador de comparação, significa “retornar `TRUE` se a comparação for `TRUE` para `ANY` dos valores na coluna que a subconsulta retorna.” Por exemplo:

```
SELECT s1 FROM t1 WHERE s1 > ANY (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(21,14,7)` porque há um valor `7` em `t2` que é menor que `10`. A expressão é `FALSE` se a tabela `t2` contiver `(20,10)` ou se a tabela `t2` estiver vazia. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(NULL,NULL,NULL)`.

Quando usada com uma subconsulta, a palavra `IN` é um alias para `= ANY`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 = ANY (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 IN    (SELECT s1 FROM t2);
```

`IN` e `= ANY` não são sinônimos quando usados com uma lista de expressões. `IN` pode aceitar uma lista de expressões, mas `= ANY` não pode. Veja a Seção 14.4.2, “Funções e Operadores de Comparação”.

`NOT IN` não é um alias para `<> ANY`, mas para `<> ALL`. Veja a Seção 15.2.15.4, “Subconsultas com ALL”.

A palavra `SOME` é um alias para `ANY`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 <> ANY  (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 <> SOME (SELECT s1 FROM t2);
```

O uso da palavra `SOME` é raro, mas este exemplo mostra por que ela pode ser útil. Para a maioria das pessoas, a frase em inglês “a não é igual a qualquer b” significa “não há b que seja igual a a”, mas isso não é o que a sintaxe SQL significa. A sintaxe significa “existe algum b para o qual a não é igual.” Usar `<> SOME` em vez disso ajuda a garantir que todos entendam o verdadeiro significado da consulta.

Você pode usar `TABLE` em uma subconsulta escalar `IN`, `ANY` ou `SOME`, desde que a tabela contenha apenas uma única coluna. Se `t2` tiver apenas uma coluna, as instruções mostradas anteriormente nesta seção podem ser escritas como mostrado aqui, substituindo `TABLE t2` por `SELECT s1 FROM t2` em cada caso:

```
SELECT s1 FROM t1 WHERE s1 > ANY (TABLE t2);

SELECT s1 FROM t1 WHERE s1 = ANY (TABLE t2);

SELECT s1 FROM t1 WHERE s1 IN (TABLE t2);

SELECT s1 FROM t1 WHERE s1 <> ANY  (TABLE t2);

SELECT s1 FROM t1 WHERE s1 <> SOME (TABLE t2);
```