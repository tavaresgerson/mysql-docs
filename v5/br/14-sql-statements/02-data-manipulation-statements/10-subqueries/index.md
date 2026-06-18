### 13.2.10 Subqueries

13.2.10.1 A Subquery como Operando Escalar

13.2.10.2 Comparações Usando Subqueries

13.2.10.3 Subqueries com ANY, IN, ou SOME

13.2.10.4 Subqueries com ALL

13.2.10.5 Subqueries de Linha (Row Subqueries)

13.2.10.6 Subqueries com EXISTS ou NOT EXISTS

13.2.10.7 Subqueries Correlacionadas

13.2.10.8 Tabelas Derivadas

13.2.10.9 Erros de Subquery

13.2.10.10 Otimizando Subqueries

13.2.10.11 Reescrevendo Subqueries como Joins

13.2.10.12 Restrições em Subqueries

Uma subquery é uma instrução `SELECT` dentro de outra instrução.

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

Existem poucas restrições sobre o tipo de instruções nas quais as subqueries podem ser usadas. Uma subquery pode conter muitas das palavras-chave ou cláusulas que uma `SELECT` comum pode conter: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, joins, index hints, construções `UNION`, comentários, funções e assim por diante.

A instrução externa de uma subquery pode ser qualquer uma destas: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `SET`, ou `DO`.

No MySQL, você não pode modificar uma table e selecionar da mesma table em uma subquery. Isso se aplica a instruções como `DELETE`, `INSERT`, `REPLACE`, `UPDATE`, e (porque as subqueries podem ser usadas na cláusula `SET`) `LOAD DATA`.

Para informações sobre como o optimizer lida com subqueries, consulte Seção 8.2.2, “Otimizando Subqueries, Tabelas Derivadas e Referências de View”. Para uma discussão sobre restrições no uso de subquery, incluindo problemas de performance para certas formas de sintaxe de subquery, consulte Seção 13.2.10.12, “Restrições em Subqueries”.