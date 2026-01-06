### 13.2.10 Subconsultas

13.2.10.1 Subconsulta como Operando Escalar

13.2.10.2 Comparativos usando subconsultas

13.2.10.3 Subconsultas com ANY, IN ou SOME

13.2.10.4 Subconsultas com ALL

13.2.10.5 Subconsultas de linhas

13.2.10.6 Subconsultas com EXISTS ou NOT EXISTS

13.2.10.7 Subconsultas Correlacionadas

13.2.10.8 Tabelas Derivadas

13.2.10.9 Erros de subconsultas

13.2.10.10 Otimização de subconsultas

13.2.10.11 Reescrita de subconsultas como junções

13.2.10.12 Restrições para subconsultas

Uma subconsulta é uma instrução `SELECT` dentro de outra instrução.

Todos os formulários e operações de subconsultas que o padrão SQL exige são suportados, além de algumas funcionalidades específicas do MySQL.

Aqui está um exemplo de uma subconsulta:

```sql
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
```

Neste exemplo, `SELECT * FROM t1 ...` é a *consulta externa* (ou *declaração externa*), e `(SELECT column1 FROM t2)` é a *subconsulta*. Dizemos que a subconsulta está *aninhada* dentro da consulta externa, e, de fato, é possível aninhar subconsultas dentro de outras subconsultas, até uma profundidade considerável. Uma subconsulta deve sempre aparecer entre parênteses.

As principais vantagens das subconsultas são:

- Eles permitem consultas que são *estruturadas* para que seja possível isolar cada parte de uma declaração.

- Eles oferecem maneiras alternativas de realizar operações que, de outra forma, exigiriam junções e uniões complexas.

- Muitas pessoas acham que as subconsultas são mais legíveis do que as junções ou uniões complexas. De fato, foi a inovação das subconsultas que deu às pessoas a ideia original de chamar o SQL inicial de "Linguagem de Consulta Estruturada".

Aqui está um exemplo de declaração que mostra os principais pontos sobre a sintaxe de subconsultas, conforme especificado pelo padrão SQL e suportado no MySQL:

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

Uma subconsulta pode retornar um escalar (um único valor), uma única linha, uma única coluna ou uma tabela (uma ou mais linhas de uma ou mais colunas). Essas são chamadas de subconsultas escalares, coluna, linha e tabela. Subconsultas que retornam um tipo específico de resultado geralmente podem ser usadas apenas em certos contextos, conforme descrito nas seções a seguir.

Há poucas restrições sobre o tipo de declarações nas quais subconsultas podem ser usadas. Uma subconsulta pode conter muitas das palavras-chave ou cláusulas que uma consulta comum (`SELECT`) pode conter: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, junções, dicas de índice, construções `UNION`, comentários, funções, e assim por diante.

A declaração externa de uma subconsulta pode ser qualquer uma das seguintes: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `SET` ou `DO`.

No MySQL, você não pode modificar uma tabela e selecionar dados da mesma tabela em uma subconsulta. Isso se aplica a instruções como `DELETE`, `INSERT`, `REPLACE`, `UPDATE` e (porque subconsultas podem ser usadas na cláusula `SET`) `LOAD DATA`.

Para obter informações sobre como o otimizador lida com subconsultas, consulte Seção 8.2.2, “Otimização de Subconsultas, Tabelas Derivadas e Referências de Visualização”. Para uma discussão sobre as restrições de uso de subconsultas, incluindo problemas de desempenho para certas formas de sintaxe de subconsulta, consulte Seção 13.2.10.12, “Restrições de Subconsultas”.
