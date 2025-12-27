### 15.2.15 Subconsultas

15.2.15.1 A subconsulta como operando escalar

15.2.15.2 Comparações usando subconsultas

15.2.15.3 Subconsultas com ANY, IN ou SOME

15.2.15.4 Subconsultas com ALL

15.2.15.5 Subconsultas de linha

15.2.15.6 Subconsultas com EXISTS ou NOT EXISTS

15.2.15.7 Subconsultas correlacionadas

15.2.15.8 Tabelas derivadas

15.2.15.9 Tabelas derivadas laterais

15.2.15.10 Erros de subconsulta

15.2.15.11 Otimização de subconsultas

15.2.15.12 Restrições para subconsultas

Uma subconsulta é uma instrução `SELECT` dentro de outra instrução.

São suportadas todas as formas e operações de subconsulta exigidas pelo padrão SQL, além de algumas funcionalidades específicas do MySQL.

Aqui está um exemplo de uma subconsulta:

```
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
```

Neste exemplo, `SELECT * FROM t1 ...` é a consulta *externa* (ou *instrução externa*), e `(SELECT column1 FROM t2)` é a *subconsulta*. Dizemos que a subconsulta está *aninhada* dentro da consulta externa, e, de fato, é possível aninhar subconsultas dentro de outras subconsultas, até uma profundidade considerável. Uma subconsulta deve sempre aparecer entre parênteses.

As principais vantagens das subconsultas são:

* Permitem consultas *estruturadas* para isolar cada parte de uma instrução.

* Fornecem maneiras alternativas de realizar operações que, de outra forma, exigiriam junções e uniões complexas.

* Muitas pessoas acham que as subconsultas são mais legíveis do que junções ou uniões complexas. De fato, foi a inovação das subconsultas que deu às pessoas a ideia original de chamar o SQL inicial de "Linguagem de Consulta Estruturada".

Aqui está uma declaração de exemplo que mostra os principais pontos sobre a sintaxe de subconsulta conforme especificado pelo padrão SQL e suportado no MySQL:

```
DELETE FROM t1
WHERE s11 > ANY
 (SELECT COUNT(*) /* no hint */ FROM t2
  WHERE NOT EXISTS
   (SELECT * FROM t3
    WHERE ROW(5*t2.s1,77)=
     (SELECT 50,11*s1 FROM t4 UNION SELECT 50,77 FROM
      (SELECT * FROM t5) AS t5)));
```

Uma subconsulta pode retornar um escalar (um único valor), uma única linha, uma única coluna ou uma tabela (uma ou mais linhas de uma ou mais colunas). Essas são chamadas de subconsultas escalar, coluna, linha e tabela. Subconsultas que retornam um tipo específico de resultado geralmente podem ser usadas apenas em certos contextos, conforme descrito nas seções a seguir.

Há poucas restrições sobre o tipo de instruções nas quais subconsultas podem ser usadas. Uma subconsulta pode conter muitas das palavras-chave ou cláusulas que uma `SELECT` comum pode conter: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, junções, dicas de índice, construções `UNION`, comentários, funções, e assim por diante.

As instruções `TABLE` e `VALUES` podem ser usadas em subconsultas. Subconsultas que usam `VALUES` são geralmente versões mais verbais de subconsultas que podem ser reescritas de forma mais compacta usando notação de conjunto, ou com a sintaxe `SELECT` ou `TABLE`; assumindo que a tabela `ts` é criada usando a instrução `CREATE TABLE ts VALUES ROW(2), ROW(4), ROW(6)`, as instruções mostradas aqui são todas equivalentes:

```
SELECT * FROM tt
    WHERE b > ANY (VALUES ROW(2), ROW(4), ROW(6));

SELECT * FROM tt
    WHERE b > ANY (SELECT * FROM ts);

SELECT * FROM tt
    WHERE b > ANY (TABLE ts);
```

Exemplos de subconsultas `TABLE` são mostrados nas seções a seguir.

A instrução externa de uma subconsulta pode ser qualquer uma das seguintes: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `SET` ou `DO`.

Para informações sobre como o otimizador lida com subconsultas, consulte a Seção 10.2.2, “Otimizando Subconsultas, Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comuns”. Para uma discussão sobre as restrições de uso de subconsultas, incluindo problemas de desempenho para certas formas de sintaxe de subconsulta, consulte a Seção 15.2.15.12, “Restrições de Subconsultas”.