#### 15.2.15.7 Subconsultas Correlacionadas

Uma *subconsulta correlacionada* é uma subconsulta que contém uma referência a uma tabela que também aparece na consulta externa. Por exemplo:

```
SELECT * FROM t1
  WHERE column1 = ANY (SELECT column1 FROM t2
                       WHERE t2.column2 = t1.column2);
```

Observe que a subconsulta contém uma referência a uma coluna de `t1`, mesmo que a cláusula `FROM` da subconsulta não mencione uma tabela `t1`. Portanto, o MySQL procura fora da subconsulta e encontra `t1` na consulta externa.

Suponha que a tabela `t1` contenha uma linha onde `column1 = 5` e `column2 = 6`; enquanto isso, a tabela `t2` contém uma linha onde `column1 = 5` e `column2 = 7`. A expressão simples `... WHERE column1 = ANY (SELECT column1 FROM t2)` seria `TRUE`, mas, neste exemplo, a cláusula `WHERE` dentro da subconsulta é `FALSE` (porque `(5,6)` não é igual a `(5,7)`), então a expressão como um todo é `FALSE`.

**Regra de escopo:** O MySQL avalia de dentro para fora. Por exemplo:

```
SELECT column1 FROM t1 AS x
  WHERE x.column1 = (SELECT column1 FROM t2 AS x
    WHERE x.column1 = (SELECT column1 FROM t3
      WHERE x.column2 = t3.column1));
```

Nesta declaração, `x.column2` deve ser uma coluna da tabela `t2`, porque `SELECT column1 FROM t2 AS x ...` renomeia `t2`. Não é uma coluna da tabela `t1`, porque `SELECT column1 FROM t1 ...` é uma consulta externa que está *mais distante*.

O otimizador pode transformar uma subconsulta escalar correlacionada em uma tabela derivada quando a bandeira `subquery_to_derived` da variável `optimizer_switch` está habilitada. Considere a consulta mostrada aqui:

```
SELECT * FROM t1
    WHERE ( SELECT a FROM t2
              WHERE t2.a=t1.a ) > 0;
```

Para evitar a materialização várias vezes para uma tabela derivada dada, podemos, em vez disso, materializar — uma vez — uma tabela derivada que adiciona um agrupamento na coluna de junção da tabela referenciada na consulta interna (`t2.a`) e, em seguida, uma junção externa no predicado levantado (`t1.a = derived.a`) para selecionar o grupo correto para combinar com a linha externa. (Se a subconsulta já tiver um agrupamento explícito, o agrupamento extra é adicionado ao final da lista de agrupamentos.) A consulta anteriormente mostrada pode, portanto, ser reescrita da seguinte forma:

```
SELECT t1.* FROM t1
    LEFT OUTER JOIN
        (SELECT a, COUNT(*) AS ct FROM t2 GROUP BY a) AS derived
    ON  t1.a = derived.a
        AND
        REJECT_IF(
            (ct > 1),
            "ERROR 1242 (21000): Subquery returns more than 1 row"
            )
    WHERE derived.a > 0;
```

Na consulta reescrita, `REJECT_IF()` representa uma função interna que testa uma condição dada (aqui, a comparação `ct > 1`) e levanta um erro dado (neste caso, `ER_SUBQUERY_NO_1_ROW`) se a condição for verdadeira. Isso reflete a verificação de cardinalidade que o otimizador realiza como parte da avaliação da cláusula `JOIN` ou `WHERE`, antes de avaliar qualquer predicado levantado, o que é feito apenas se a subconsulta não retornar mais de uma linha.

Esse tipo de transformação pode ser realizado, desde que sejam atendidas as seguintes condições:

* A subconsulta pode fazer parte de uma lista `SELECT`, condição `WHERE` ou condição `HAVING`, mas não pode fazer parte de uma condição `JOIN` e não pode conter uma cláusula `OFFSET`. A subconsulta pode conter `LIMIT 1`, mas não outra cláusula `LIMIT`; deve usar um literal `1` e nenhum outro valor, substituto (`?`) ou variável. Além disso, a subconsulta não pode conter operações de conjunto, como `UNION`.

* A cláusula `WHERE` pode conter uma ou mais condições, combinadas com `AND`. Se a cláusula `WHERE` contiver uma cláusula `OR`, ela não pode ser transformada. Pelo menos uma das condições da cláusula `WHERE` deve ser elegível para transformação e nenhuma delas pode rejeitar a transformação.

* Para ser elegível para transformação, um predicado da cláusula `WHERE` deve ser um predicado de igualdade; outros predicados de comparação não são elegíveis para transformação. O predicado deve empregar o operador de igualdade `=` para fazer a comparação; o operador `<=>>`, que é seguro para nulos, não é suportado neste contexto.

  Os operandos de podem ser valores de coluna, constantes e expressões que os utilizam, incluindo funções determinísticas chamadas com valores de coluna como argumentos.

* Um predicado da cláusula `WHERE` que contém apenas referências internas não é elegível para transformação, uma vez que pode ser avaliado antes do agrupamento. Um predicado da cláusula `WHERE` que contém apenas referências externas é elegível para transformação, mesmo que possa ser elevado ao bloco de consulta externa. Isso é possível adicionando uma verificação de cardinalidade sem agrupamento na tabela derivada.

* Para ser elegível, um predicado da cláusula `WHERE` deve ter um operando que contenha apenas referências internas e um operando que contenha apenas referências externas. Se o predicado não for elegível devido a esta regra, a transformação da consulta é rejeitada.

* Uma coluna correlacionada pode estar presente apenas na cláusula `WHERE` da subconsulta (e não na lista `SELECT`, na cláusula `JOIN` ou `ORDER BY`, na lista `GROUP BY` ou na cláusula `HAVING`). Também não pode haver nenhuma coluna correlacionada dentro de uma tabela derivada na lista `FROM` da subconsulta.

* Uma coluna correlacionada não pode estar contida na lista de argumentos de uma função agregada.

* Uma coluna correlacionada deve ser resolvida no bloco de consulta diretamente que contém a subconsulta considerada para transformação.

* Uma coluna correlacionada não pode estar presente em uma subconsulta escalar aninhada na cláusula `WHERE`.

* A subconsulta não pode conter funções de janela e não pode conter nenhuma função agregada que agregue em um bloco de consulta externo à subconsulta. Uma função agregada `COUNT()` (CONTAR) se contida no elemento de lista `SELECT` da subconsulta deve estar no nível mais alto e não pode fazer parte de uma expressão.

Veja também a Seção 15.2.15.8, “Tabelas Derivadas”.