#### 10.2.2.1 Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin e Antijoin

A semijoin é uma transformação de tempo de preparação que permite múltiplas estratégias de execução, como extração de tabela, eliminação de duplicatas, primeira correspondência, varredura solta e materialização. O otimizador usa estratégias de semijoin para melhorar a execução de subconsultas, conforme descrito nesta seção.

Para uma junção interna entre duas tabelas, a junção retorna uma linha de uma tabela tantas vezes quanto houver correspondências na outra tabela. Mas, para algumas perguntas, a única informação que importa é se há uma correspondência, não o número de correspondências. Suponha que existam tabelas chamadas `class` e `roster` que listam as classes em um currículo de curso e os rosters de classe (alunos matriculados em cada classe), respectivamente. Para listar as classes que realmente têm alunos matriculados, você poderia usar essa junção:

```
SELECT class.class_num, class.class_name
    FROM class
    INNER JOIN roster
    WHERE class.class_num = roster.class_num;
```

No entanto, o resultado lista cada classe uma vez para cada aluno matriculado. Para a pergunta em questão, essa é uma duplicação desnecessária de informações.

Supondo que `class_num` seja uma chave primária na tabela `class`, a supressão de duplicatas é possível usando `SELECT DISTINCT`, mas é ineficiente gerar todas as linhas correspondentes primeiro apenas para eliminar duplicatas mais tarde.

O mesmo resultado livre de duplicatas pode ser obtido usando uma subconsulta:

```
SELECT class_num, class_name
    FROM class
    WHERE class_num IN
        (SELECT class_num FROM roster);
```

Aqui, o otimizador pode reconhecer que a cláusula `IN` exige que a subconsulta retorne apenas uma instância de cada número de classe da tabela `roster`. Neste caso, a consulta pode usar uma semijoin; ou seja, uma operação que retorne apenas uma instância de cada linha em `class` que seja correspondida por linhas em `roster`.

A seguinte declaração, que contém um predicado de subconsulta `EXISTS`, é equivalente à declaração anterior que contém um predicado de subconsulta `IN`:

```
SELECT class_num, class_name
    FROM class
    WHERE EXISTS
        (SELECT * FROM roster WHERE class.class_num = roster.class_num);
```

Qualquer declaração com um predicado de subconsulta `EXISTS` está sujeita às mesmas transformações de junção parcial que uma declaração com um predicado de subconsulta `IN` equivalente.

As seguintes subconsultas são transformadas em anticonjuntos:
* `NOT IN (SELECT ... FROM ...)`
* `NOT EXISTS (SELECT ... FROM ...)`.
* `IN (SELECT ... FROM ...) IS NOT TRUE`
* `EXISTS (SELECT ... FROM ...) IS NOT TRUE`.

* `IN (SELECT ... FROM ...) IS FALSE`
* `EXISTS (SELECT ... FROM ...) IS FALSE`.

Em resumo, qualquer negação de uma subconsulta na forma `IN (SELECT ... FROM ...)` ou `EXISTS (SELECT ... FROM ...)` é transformada em um anticonjunto.

Um anticonjunto é uma operação que retorna apenas as linhas para as quais não há correspondência. Considere a consulta mostrada aqui:

```
SELECT class_num, class_name
    FROM class
    WHERE class_num NOT IN
        (SELECT class_num FROM roster);
```

Esta consulta é reescrita internamente como o anticonjunto `SELECT class_num, class_name FROM class ANTIJOIN roster ON class_num`, que retorna uma instância de cada linha em `class` que não é correspondida por nenhuma linha em `roster`. Isso significa que, para cada linha em `class`, assim que uma correspondência é encontrada em `roster`, a linha em `class` pode ser descartada.

As transformações de anticonjuntos não podem, na maioria dos casos, ser aplicadas se as expressões sendo comparadas forem nulos. Uma exceção a essa regra é que `(... NOT IN (SELECT ...)) IS NOT FALSE` e seu equivalente `(... IN (SELECT ...)) IS NOT TRUE` podem ser transformados em anticonjuntos.

A sintaxe de junção externa e interna é permitida na especificação da consulta externa, e as referências de tabelas podem ser tabelas externas, tabelas derivadas, referências de visualizações ou expressões de tabela comuns.

No MySQL, uma subconsulta deve satisfazer esses critérios para ser tratada como uma junção parcial (ou uma junção inversa, se `NOT` modifica a subconsulta):

* Ela deve fazer parte de um predicado `IN`, `= ANY` ou `EXISTS` que apareça no nível superior da cláusula `WHERE` ou `ON`, possivelmente como um termo em uma expressão `AND`. Por exemplo:

  ```
  SELECT ...
      FROM ot1, ...
      WHERE (oe1, ...) IN
          (SELECT ie1, ... FROM it1, ... WHERE ...);
  ```

  Aqui, `ot_i` e `it_i` representam tabelas nas partes externa e interna da consulta, e `oe_i` e `ie_i` representam expressões que se referem a colunas nas tabelas externa e interna.

  A subconsulta também pode ser o argumento de uma expressão modificada por `NOT`, `IS [NOT] TRUE` ou `IS [NOT] FALSE`.

* Ela deve ser uma única `SELECT` sem construções `UNION`.

* Não deve conter uma cláusula `HAVING`.
* Não deve conter nenhuma função agregada (seja explicitamente ou implicitamente agrupada).

* Não deve ter uma cláusula `LIMIT`.
* A declaração não deve usar o tipo de junção `STRAIGHT_JOIN` na consulta externa.

* O modificador `STRAIGHT_JOIN` não deve estar presente.

* O número de tabelas externas e internas juntas deve ser menor que o número máximo de tabelas permitido em uma junção.

* A subconsulta pode ser correlacionada ou não correlacionada. A decorrelação analisa predicados trivialmente correlacionados na cláusula `WHERE` de uma subconsulta usada como argumento para `EXISTS`, e torna possível otimizá-la como se fosse usada dentro de `IN (SELECT b FROM ...)`. O termo *trivialmente correlacionado* significa que o predicado é um predicado de igualdade, que é o único predicado na cláusula `WHERE` (ou é combinado com `AND`) e que um dos operandos é de uma tabela referenciada na subconsulta e o outro operando é do bloco de consulta externa.

* A palavra-chave `DISTINCT` é permitida, mas ignorada. As estratégias de junção parcial lidam automaticamente com a remoção de duplicatas.

* Uma cláusula `GROUP BY` é permitida, mas ignorada, a menos que a subconsulta também contenha uma ou mais funções agregadas.

* Uma cláusula `ORDER BY` é permitida, mas ignorada, uma vez que a ordenação é irrelevante para a avaliação das estratégias de junção parcial.

Se uma subconsulta atender aos critérios anteriores, o MySQL a converte em uma junção parcial (ou em uma junção antiparcial, se aplicável) e faz uma escolha baseada no custo dessas estratégias:

* Converte a subconsulta em uma junção ou usa a extração de tabela e executa a consulta como uma junção interna entre as tabelas da subconsulta e as tabelas externas. A extração de tabela extrai uma tabela da subconsulta para a consulta externa.

* *Duplicar Weedout*: Execute a junção parcial como se fosse uma junção e remova os registros duplicados usando uma tabela temporária.

* *FirstMatch*: Ao digitalizar as tabelas internas em busca de combinações de linhas e houver múltiplas instâncias de um grupo de valores dado, escolha uma em vez de retornar todas. Isso "atravessa" a digitalização e elimina a produção de linhas desnecessárias.

* *LooseScan*: Digitalize uma tabela de subconsulta usando um índice que permite que um único valor seja escolhido do grupo de valores da subconsulta.

* Materialize a subconsulta em uma tabela temporária indexada que é usada para realizar uma junção, onde o índice é usado para remover duplicatas. O índice também pode ser usado mais tarde para consultas ao unir a tabela temporária com as tabelas externas; se não, a tabela é digitalizada. Para mais informações sobre materialização, consulte a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.

Cada uma dessas estratégias pode ser habilitada ou desabilitada usando as seguintes flags de variáveis de sistema `optimizer_switch`:

* O sinalizador `semijoin` controla se junções e antijunções são usadas.

* Se o `semijoin` estiver habilitado, as flags `firstmatch`, `loosescan`, `duplicateweedout` e `materialization` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

* Se a estratégia de semijoin `duplicateweedout` estiver desabilitada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

* Se `duplicateweedout` estiver desativada, ocasionalmente, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado definindo `optimizer_prune_level=0`.

Essas flags são habilitadas por padrão. Veja a Seção 10.9.2, “Otimizações Alternativas”.

O otimizador minimiza as diferenças no tratamento de vistas e tabelas derivadas. Isso afeta consultas que usam o modificador `STRAIGHT_JOIN` e uma vista com uma subconsulta `IN` que pode ser convertida em um semijoin. A consulta a seguir ilustra isso, pois a mudança no processamento causa uma mudança na transformação, e, portanto, uma estratégia de execução diferente:

```
CREATE VIEW v AS
SELECT *
FROM t1
WHERE a IN (SELECT b
           FROM t2);

SELECT STRAIGHT_JOIN *
FROM t3 JOIN v ON t3.x = v.a;
```

O otimizador primeiro analisa a vista e converte a subconsulta `IN` em um semijoin, depois verifica se é possível combinar a vista na consulta externa. Como o modificador `STRAIGHT_JOIN` na consulta externa impede o semijoin, o otimizador recusa a fusão, causando a avaliação da tabela derivada usando uma tabela materializada.

A saída do `EXPLAIN` indica o uso de estratégias de semijoin da seguinte forma:

* Para obter uma saída de `EXPLAIN` estendida, o texto exibido por uma consulta `SHOW WARNINGS` subsequente mostra a consulta reescrita, que exibe a estrutura semijoin. (Veja a Seção 10.8.3, “Formato de Saída de EXPLAIN Estendida”.) Com isso, você pode ter uma ideia de quais tabelas foram extraídas da semijoin. Se uma subconsulta foi convertida em uma semijoin, você deve ver que o predicado da subconsulta foi removido e suas tabelas e cláusula `WHERE` foram unidas à lista de junção da consulta externa e à cláusula `WHERE`.

* O uso de tabela temporária para o Duplicate Weedout é indicado por `Start temporary` e `End temporary` na coluna `Extra`. Tabelas que não foram extraídas e estão no intervalo das linhas de saída de `EXPLAIN` cobertas por `Start temporary` e `End temporary` têm seu `rowid` na tabela temporária.

* `FirstMatch(tbl_name)` na coluna `Extra` indica o uso do atalho de junção.

* `LooseScan(m..n)` na coluna `Extra` indica o uso da estratégia LooseScan. *`m`* e *`n`* são números de chave.

* O uso de tabela temporária para materialização é indicado por linhas com um valor de `select_type` de `MATERIALIZED` e linhas com um valor de `table` de `<subqueryN>`.

Uma transformação semijoin também pode ser aplicada a uma declaração `UPDATE` ou `DELETE` de uma única tabela que usa um predicado de subconsulta `[NOT] IN` ou `[NOT] EXISTS`, desde que a declaração não use `ORDER BY` ou `LIMIT`, e que as transformações semijoin sejam permitidas por uma dica do otimizador ou pela configuração `optimizer_switch`.