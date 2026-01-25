#### 8.2.2.4 Otimizando Derived Tables e Referências a Views com Merge ou Materialization

O otimizador pode lidar com referências a derived tables usando duas estratégias (que também se aplicam a referências de view):

* Fazer o Merge da derived table no bloco de Query externo
* Fazer a Materialization da derived table em uma tabela temporária interna

Exemplo 1:

```sql
SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

Com o Merge da derived table `derived_t1`, essa Query é executada de forma semelhante a:

```sql
SELECT * FROM t1;
```

Exemplo 2:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2 ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Com o Merge da derived table `derived_t2`, essa Query é executada de forma semelhante a:

```sql
SELECT t1.*, t2.f1
  FROM t1 JOIN t2 ON t1.f2=t2.f1
  WHERE t1.f1 > 0;
```

Com a Materialization, `derived_t1` e `derived_t2` são tratadas cada uma como uma tabela separada dentro de suas respectivas Queries.

O otimizador lida com derived tables e referências a views da mesma forma: Ele evita Materialization desnecessária sempre que possível, o que permite "empurrar" condições (pushing down conditions) da Query externa para as derived tables e produzir planos de execução mais eficientes. (Para um exemplo, veja a Seção 8.2.2.2, “Otimizando Subqueries com Materialization”.)

Se o Merge resultar em um bloco de Query externo que referencia mais de 61 tabelas base, o otimizador escolhe a Materialization.

O otimizador propaga uma cláusula `ORDER BY` em uma derived table ou referência de view para o bloco de Query externo se todas estas condições forem verdadeiras:

* A Query externa não está agrupada ou agregada.
* A Query externa não especifica `DISTINCT`, `HAVING` ou `ORDER BY`.
* A Query externa tem esta derived table ou referência de view como a única fonte na cláusula `FROM`.

Caso contrário, o otimizador ignora a cláusula `ORDER BY`.

Os seguintes meios estão disponíveis para influenciar se o otimizador tenta fazer o Merge de derived tables e referências de views no bloco de Query externo:

* O flag `derived_merge` da variável de sistema `optimizer_switch` pode ser usado, assumindo que nenhuma outra regra impeça o Merge. Consulte a Seção 8.9.2, “Switchable Optimizations”. Por padrão, o flag está ativado para permitir o Merge. Desabilitar o flag impede o Merge e evita erros `ER_UPDATE_TABLE_USED`.

  O flag `derived_merge` também se aplica a views que não contêm uma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de view que usa uma expressão equivalente à Subquery, adicionar `ALGORITHM=TEMPTABLE` à definição da view impede o Merge e tem precedência sobre o valor de `derived_merge`.

* É possível desabilitar o Merge usando na Subquery quaisquer construções que o impeçam, embora estas não sejam tão explícitas em seu efeito sobre a Materialization. As construções que impedem o Merge são as mesmas para derived tables e referências de views:

  + Funções de agregação (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, e assim por diante)

  + `DISTINCT`
  + `GROUP BY`
  + `HAVING`
  + `LIMIT`
  + `UNION` ou `UNION ALL`

  + Subqueries na lista SELECT
  + Atribuições a variáveis de usuário
  + Referências apenas a valores literais (neste caso, não há tabela subjacente)

O flag `derived_merge` também se aplica a views que não contêm uma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de view que usa uma expressão equivalente à Subquery, adicionar `ALGORITHM=TEMPTABLE` à definição da view impede o Merge e tem precedência sobre o valor atual de `derived_merge`.

Se o otimizador escolher a estratégia de Materialization em vez do Merge para uma derived table, ele lida com a Query da seguinte forma:

* O otimizador adia a Materialization da derived table até que seu conteúdo seja necessário durante a execução da Query. Isso melhora a performance, pois o atraso na Materialization pode fazer com que ela não precise ser feita. Considere uma Query que faz um JOIN do resultado de uma derived table com outra tabela: Se o otimizador processar essa outra tabela primeiro e descobrir que ela não retorna linhas, o JOIN não precisa ser executado e o otimizador pode pular completamente a Materialization da derived table.

* Durante a execução da Query, o otimizador pode adicionar um Index a uma derived table para acelerar a recuperação de linhas a partir dela.

Considere o seguinte comando `EXPLAIN`, para uma Query `SELECT` que contém uma derived table:

```sql
EXPLAIN SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

O otimizador evita materializar a derived table adiando-a até que o resultado seja necessário durante a execução do `SELECT`. Neste caso, a Query não é executada (porque ocorre em um comando `EXPLAIN`), então o resultado nunca é necessário.

Mesmo para Queries que são executadas, o atraso na Materialization da derived table pode permitir que o otimizador evite a Materialization por completo. Quando isso acontece, a execução da Query é mais rápida pelo tempo necessário para realizar a Materialization. Considere a seguinte Query, que faz um JOIN do resultado de uma derived table com outra tabela:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2
          ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Se a otimização processar `t1` primeiro e a cláusula `WHERE` produzir um resultado vazio, o JOIN será necessariamente vazio e a derived table não precisa ser materializada.

Para os casos em que uma derived table requer Materialization, o otimizador pode adicionar um Index à tabela materializada para acelerar o acesso a ela. Se tal Index permitir o `ref` access à tabela, isso pode reduzir significativamente a quantidade de dados lidos durante a execução da Query. Considere a seguinte Query:

```sql
SELECT *
 FROM t1 JOIN (SELECT DISTINCT f1 FROM t2) AS derived_t2
         ON t1.f1=derived_t2.f1;
```

O otimizador constrói um Index sobre a coluna `f1` de `derived_t2` se isso permitir o uso de `ref` access para o plano de execução de menor custo. Após adicionar o Index, o otimizador pode tratar a derived table materializada da mesma forma que uma tabela regular com um Index, e se beneficia de forma semelhante do Index gerado. O overhead (custo adicional) da criação do Index é insignificante em comparação com o custo da execução da Query sem o Index. Se o `ref` access resultar em um custo maior do que algum outro método de acesso, o otimizador não cria Index e não há perda.

Para o output de trace do otimizador, uma derived table ou referência de view que sofreu Merge não é mostrada como um nó. Apenas suas tabelas subjacentes aparecem no plano da Query principal.