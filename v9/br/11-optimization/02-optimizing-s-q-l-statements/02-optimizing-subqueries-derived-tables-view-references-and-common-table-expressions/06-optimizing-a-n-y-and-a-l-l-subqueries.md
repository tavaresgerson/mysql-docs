#### 10.2.2.6 Otimizando Subconsultas COM `ANY` E `ALL`

O MySQL 9.5 suporta a transformação de prepositivos de comparação quantificados gerais em junções semijoin ou antijunções. Isso inclui todas as comparações `=`, `<>`, `>`, `>=`, `<`, `<=` com `ANY` ou `ALL`.

As transformações para tabelas derivadas dessas comparações são suportadas tanto na cláusula `SELECT` quanto na cláusula `WHERE` da consulta externa.

(Um operador de comparação quantificada, como `ANY`, `ALL` ou `SOME`, compara um valor a um conjunto de valores. `= ANY` é equivalente a `IN`; `<> ALL` é equivalente a `NOT IN`. Consulte a Seção 15.2.15.3, “Subconsultas com ANY, IN ou SOME”, e a Seção 15.2.15.4, “Subconsultas com ALL”, para mais informações.)

Uma subconsulta que se qualifica para a transformação é convertida em uma tabela derivada da seguinte forma:

* Para prepositivos `=ANY` e `<>ALL`:

  1. A subconsulta é convertida em uma tabela derivada.
  2. A expressão selecionada da subconsulta é convertida de *`expr`* para `MIN(expr)` ou `MAX(expr)`, dependendo do prepositivo real.

  3. Selecione `COUNT(*)` da subconsulta.

  4. Selecione o número de valores distintos não nulos.
* Para outros prepositivos:

  1. A subconsulta é convertida em uma tabela derivada.
  2. A expressão selecionada da subconsulta é selecionada da tabela derivada.

  3. A eliminação de duplicatas é realizada, a menos que a expressão selecionada seja distinta.

  4. Se a expressão selecionada for nulo e o processamento de nulos for necessário, selecione uma indicação de se a subconsulta contém quaisquer nulos.

Observação

Quando a opção de otimização `semijoin` é habilitada, essa opção tem precedência sobre `subquery_to_derived` para as consultas onde uma dessas transformações é possível.

O bloco de consulta externa deve conter pelo menos uma tabela e não pode conter mais de 60 tabelas.

O predicado de comparação quantificada deve ser colocado na cláusula `WHERE` ou na lista `SELECT` da consulta externa; ele não pode estar em uma cláusula `JOIN`, uma cláusula `GROUP BY`, uma cláusula `HAVING`, uma cláusula `ORDER BY`, uma cláusula `QUANTIFY` ou uma cláusula `ORDER BY` ou `PARTITION BY` de uma especificação de janela.

O bloco de consulta interna pode conter referências externas dentro de uma cláusula de igualdade na condição suportada, mas deve ser o único predicado da condição, ou ser combinado com outros predicados e condições com operadores `AND` envolventes.

Um predicado `<>ALL` ou `=ANY`, quando colocado na lista `SELECT` da consulta externa, não deve conter expressões nulos na expressão da mão esquerda ou na(s) expressão(ões) selecionada(s) da subconsulta.

Um predicado `<>ALL`, quando colocado na cláusula `WHERE` da consulta externa, não deve conter expressões nulos na expressão da mão esquerda ou na(s) expressão(ões) selecionada(s) da subconsulta.

A expressão de consulta para a subconsulta não pode conter nenhuma das seguintes:

* Uma operação de conjunto (qualquer uma de `UNION`, `INTERSECT` ou `EXCEPT`).

* Um agrupamento explícito, exceto quando o resolvente puder eliminar o agrupamento.

* Qualquer agrupamento implícito.
* Uma cláusula `WINDOW`.

O bloco de consulta interna também deve referenciar pelo menos uma tabela e pode conter referências externas dentro de uma cláusula de igualdade na condição suportada. Deve ser o único predicado da condição, ou ser combinado com outros predicados e condições com operadores `AND` envolventes.

Observação

A transformação não pode ser aplicada a uma consulta que tenha uma lista `SELECT` com um predicado de comparação quantificada quando também emprega uma função de janela que faça referência ao mesmo predicado.