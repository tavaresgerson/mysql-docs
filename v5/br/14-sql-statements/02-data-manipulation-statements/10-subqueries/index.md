### 13.2.10 Subqueries

[13.2.10.1 A Subquery como Operando Escalar](scalar-subqueries.html)

[13.2.10.2 Comparações Usando Subqueries](comparisons-using-subqueries.html)

[13.2.10.3 Subqueries com ANY, IN, ou SOME](any-in-some-subqueries.html)

[13.2.10.4 Subqueries com ALL](all-subqueries.html)

[13.2.10.5 Subqueries de Linha (Row Subqueries)](row-subqueries.html)

[13.2.10.6 Subqueries com EXISTS ou NOT EXISTS](exists-and-not-exists-subqueries.html)

[13.2.10.7 Subqueries Correlacionadas](correlated-subqueries.html)

[13.2.10.8 Tabelas Derivadas](derived-tables.html)

[13.2.10.9 Erros de Subquery](subquery-errors.html)

[13.2.10.10 Otimizando Subqueries](optimizing-subqueries.html)

[13.2.10.11 Reescrevendo Subqueries como Joins](rewriting-subqueries.html)

[13.2.10.12 Restrições em Subqueries](subquery-restrictions.html)

Uma subquery é uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") dentro de outra instrução.

Todas as formas e operações de subquery exigidas pelo padrão SQL são suportadas, bem como alguns recursos que são específicos do MySQL.

Aqui está um exemplo de uma subquery:

```sql
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
```

Neste exemplo, `SELECT * FROM t1 ...` é a *outer query* (ou *instrução externa*), e `(SELECT column1 FROM t2)` é a *subquery*. Dizemos que a subquery está *aninhada* dentro da outer query, e na verdade é possível aninhar subqueries dentro de outras subqueries, a uma profundidade considerável. Uma subquery deve sempre aparecer entre parênteses.

As principais vantagens das subqueries são:

* Elas permitem que as queries sejam *estruturadas* de modo que seja possível isolar cada parte de uma instrução.

* Elas fornecem maneiras alternativas de executar operações que, de outra forma, exigiriam joins e unions complexos.

* Muitas pessoas acham as subqueries mais legíveis do que joins ou unions complexos. De fato, foi a inovação das subqueries que deu às pessoas a ideia original de chamar o SQL inicial de "Structured Query Language."

Aqui está um exemplo de instrução que mostra os pontos principais sobre a sintaxe de subquery, conforme especificado pelo padrão SQL e suportado no MySQL:

```sql
DELETE FROM t1
WHERE s11 > ANY
 (SELECT COUNT(*) /* no hint */ FROM t2
  WHERE NOT EXISTS
   (SELECT * FROM t3
    WHERE ROW(5*t2.s1,77)=
     (SELECT 50,11*s1 FROM t4 UNION SELECT 50,77 FROM
      (SELECT * FROM t5) AS t5)));
```

Uma subquery pode retornar um escalar (um único valor), uma única linha, uma única coluna ou uma tabela (uma ou mais linhas de uma ou mais colunas). Elas são chamadas de subqueries escalar, de coluna, de linha e de tabela. As subqueries que retornam um tipo específico de resultado geralmente só podem ser usadas em certos contextos, conforme descrito nas seções a seguir.

Existem poucas restrições sobre o tipo de instruções nas quais as subqueries podem ser usadas. Uma subquery pode conter muitas das palavras-chave ou cláusulas que uma [`SELECT`](select.html "13.2.9 SELECT Statement") comum pode conter: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, joins, index hints, construções [`UNION`](union.html "13.2.9.3 UNION Clause"), comentários, funções e assim por diante.

A instrução externa de uma subquery pode ser qualquer uma destas: [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), ou [`DO`](do.html "13.2.3 DO Statement").

No MySQL, você não pode modificar uma table e selecionar da mesma table em uma subquery. Isso se aplica a instruções como [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), e (porque as subqueries podem ser usadas na cláusula `SET`) [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

Para informações sobre como o optimizer lida com subqueries, consulte [Seção 8.2.2, “Otimizando Subqueries, Tabelas Derivadas e Referências de View”](subquery-optimization.html "8.2.2 Optimizing Subqueries, Derived Tables, and View References"). Para uma discussão sobre restrições no uso de subquery, incluindo problemas de performance para certas formas de sintaxe de subquery, consulte [Seção 13.2.10.12, “Restrições em Subqueries”](subquery-restrictions.html "13.2.10.12 Restrictions on Subqueries").