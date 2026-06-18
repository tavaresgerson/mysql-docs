#### 10.2.2.1 Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin

Um semijoin é uma transformação de tempo de preparação que permite várias estratégias de execução, como extração de tabela, eliminação de duplicatas, primeira correspondência, varredura solta e materialização. O otimizador utiliza estratégias de semijoin para melhorar a execução de subconsultas, conforme descrito nesta seção.

Para uma junção interna entre duas tabelas, a junção retorna uma linha de uma tabela tantas vezes quanto houver correspondências na outra tabela. Mas, para algumas perguntas, a única informação que importa é se há uma correspondência, não o número de correspondências. Suponha que existam tabelas chamadas `class` e `roster` que listam as classes em um currículo de curso e os cadernos de aula (alunos matriculados em cada aula), respectivamente. Para listar as classes que realmente têm alunos matriculados, você poderia usar essa junção:

```
SELECT class.class_num, class.class_name
    FROM class
    INNER JOIN roster
    WHERE class.class_num = roster.class_num;
```

No entanto, o resultado lista cada turma uma vez para cada aluno matriculado. Para a pergunta em questão, essa é uma duplicação desnecessária de informações.

Supondo que `class_num` seja uma chave primária na tabela `class`, a supressão de duplicatas é possível usando `SELECT DISTINCT`, mas é ineficiente gerar todas as linhas correspondentes primeiro e só depois eliminar as duplicatas.

O mesmo resultado sem duplicatas pode ser obtido usando uma subconsulta:

```
SELECT class_num, class_name
    FROM class
    WHERE class_num IN
        (SELECT class_num FROM roster);
```

Aqui, o otimizador pode reconhecer que a cláusula `IN` exige que a subconsulta retorne apenas uma instância de cada número de classe da tabela `roster`. Neste caso, a consulta pode usar uma junção parcial; ou seja, uma operação que retorne apenas uma instância de cada linha em `class` que seja correspondida por linhas em `roster`.

A seguinte declaração, que contém um predicado de subconsulta `EXISTS`, é equivalente à declaração anterior, que contém um predicado de subconsulta `IN`:

```
SELECT class_num, class_name
    FROM class
    WHERE EXISTS
        (SELECT * FROM roster WHERE class.class_num = roster.class_num);
```

No MySQL 8.0.16 e versões posteriores, qualquer instrução com um predicado de subconsulta `EXISTS` está sujeita às mesmas transformações de semijoin que uma instrução com um predicado de subconsulta equivalente `IN`.

A partir do MySQL 8.0.17, as seguintes subconsultas são transformadas em anticonjuntos:

- `NOT IN (SELECT ... FROM ...)`

- `NOT EXISTS (SELECT ... FROM ...)`.

- `IN (SELECT ... FROM ...) IS NOT TRUE`

- `EXISTS (SELECT ... FROM ...) IS NOT TRUE`.

- `IN (SELECT ... FROM ...) IS FALSE`

- `EXISTS (SELECT ... FROM ...) IS FALSE`.

Em resumo, qualquer negação de uma subconsulta na forma `IN (SELECT ... FROM ...)` ou `EXISTS (SELECT ... FROM ...)` é transformada em um antijoin.

Um antijoin é uma operação que retorna apenas as linhas para as quais não há correspondência. Considere a consulta mostrada aqui:

```
SELECT class_num, class_name
    FROM class
    WHERE class_num NOT IN
        (SELECT class_num FROM roster);
```

Essa consulta é reescrita internamente como o antijoin `SELECT class_num, class_name FROM class ANTIJOIN roster ON class_num`, que retorna uma instância de cada linha em `class` que *não* é correspondida por nenhuma linha em `roster`. Isso significa que, para cada linha em `class`, assim que uma correspondência for encontrada em `roster`, a linha em `class` pode ser descartada.

As transformações Antijoin não podem ser aplicadas na maioria dos casos se as expressões que estão sendo comparadas forem nulos. Uma exceção a essa regra é que `(... NOT IN (SELECT ...)) IS NOT FALSE` e seu equivalente `(... IN (SELECT ...)) IS NOT TRUE` podem ser transformados em anticonjuntos.

A sintaxe de junção externa e interna é permitida na especificação da consulta externa, e as referências de tabela podem ser tabelas base, tabelas derivadas, referências de visualização ou expressões de tabela comuns.

No MySQL, uma subconsulta deve satisfazer esses critérios para ser tratada como uma junção parcial (ou, no MySQL 8.0.17 e versões posteriores, uma junção inversa se `NOT` modificar a subconsulta):

- Deve fazer parte de um predicado `IN`, `= ANY` ou `EXISTS` que aparece no nível superior da cláusula `WHERE` ou `ON`, possivelmente como um termo em uma expressão `AND`. Por exemplo:

  ```
  SELECT ...
      FROM ot1, ...
      WHERE (oe1, ...) IN
          (SELECT ie1, ... FROM it1, ... WHERE ...);
  ```

  Aqui, `ot_i` e `it_i` representam tabelas nas partes externa e interna da consulta, e `oe_i` e `ie_i` representam expressões que se referem a colunas nas tabelas externa e interna.

  No MySQL 8.0.17 e versões posteriores, a subconsulta também pode ser o argumento de uma expressão modificada por `NOT`, `IS [NOT] TRUE` ou `IS [NOT] FALSE`.

- Deve ser um único `SELECT` sem construções `UNION`.

- Não deve conter uma cláusula `HAVING`.

- Não deve conter funções agregadas (seja explicitamente ou implicitamente agrupadas).

- Não deve ter uma cláusula `LIMIT`.

- A declaração não deve usar o tipo de junção `STRAIGHT_JOIN` na consulta externa.

- O modificador `STRAIGHT_JOIN` não deve estar presente.

- O número de tabelas externas e internas juntas deve ser menor que o número máximo de tabelas permitidas em uma junção.

- A subconsulta pode ser correlacionada ou não. No MySQL 8.0.16 e versões posteriores, a decorrelação analisa predicados trivialmente correlacionados na cláusula `WHERE` de uma subconsulta usada como argumento para `EXISTS`, e torna possível otimizá-la como se fosse usada dentro de `IN (SELECT b FROM ...)`. O termo *trivialmente correlacionado* significa que o predicado é um predicado de igualdade, que é o único predicado na cláusula `WHERE` (ou é combinado com `AND`) e que um operando é de uma tabela referenciada na subconsulta e o outro operando é do bloco de consulta externa.

- A palavra-chave `DISTINCT` é permitida, mas ignorada. As estratégias de semijoin lidam automaticamente com a remoção de duplicatas.

- Uma cláusula `GROUP BY` é permitida, mas ignorada, a menos que a subconsulta também contenha uma ou mais funções agregadas.

- Uma cláusula `ORDER BY` é permitida, mas ignorada, uma vez que a ordenação é irrelevante para a avaliação das estratégias de junção parcial.

Se uma subconsulta atender aos critérios anteriores, o MySQL a converte em uma junção parcial (ou, no MySQL 8.0.17 ou posterior, em uma junção inversa, se aplicável) e faz uma escolha baseada no custo dessas estratégias:

- Converta a subconsulta em uma junção ou use a extração de tabela e execute a consulta como uma junção interna entre as tabelas da subconsulta e as tabelas externas. A extração de tabela extrai uma tabela da subconsulta para a consulta externa.

- *Weedout Duplicado*: Execute a semijoin como se fosse uma junção e remova os registros duplicados usando uma tabela temporária.

- *FirstMatch*: Ao digitalizar as tabelas internas em busca de combinações de linhas e houver múltiplas instâncias de um grupo de valores específico, escolha uma em vez de retornar todas. Esse processo de digitalização "atravessa atalhos" e elimina a produção de linhas desnecessárias.

- *LooseScan*: Escanear uma tabela de subconsulta usando um índice que permite que um único valor seja escolhido do grupo de valores de cada subconsulta.

- Materialize a subconsulta em uma tabela temporária indexada que será usada para realizar uma junção, onde o índice será usado para remover duplicatas. O índice também pode ser usado posteriormente para consultas ao realizar a junção da tabela temporária com as tabelas externas; caso contrário, a tabela será escaneada. Para mais informações sobre materialização, consulte a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.

Cada uma dessas estratégias pode ser habilitada ou desabilitada usando as seguintes `optimizer_switch` flags da variável de sistema:

- A bandeira `semijoin` controla se junções parciais são usadas. A partir do MySQL 8.0.17, isso também se aplica a antijunções.

- Se o `semijoin` estiver habilitado, as bandeiras `firstmatch`, `loosescan`, `duplicateweedout` e `materialization` permitem um controle mais preciso sobre as estratégias de junção semijoia permitidas.

- Se a estratégia de junção semi-join `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

- Se `duplicateweedout` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado ao definir `optimizer_prune_level=0`.

Essas bandeiras estão habilitadas por padrão. Veja a Seção 10.9.2, “Otimizações Alternáveis”.

O otimizador minimiza as diferenças no tratamento de visualizações e tabelas derivadas. Isso afeta consultas que utilizam o modificador `STRAIGHT_JOIN` e uma visualização com uma subconsulta `IN` que pode ser convertida em um semijoin. A consulta a seguir ilustra isso, pois a mudança no processamento causa uma mudança na transformação e, portanto, uma estratégia de execução diferente:

```
CREATE VIEW v AS
SELECT *
FROM t1
WHERE a IN (SELECT b
           FROM t2);

SELECT STRAIGHT_JOIN *
FROM t3 JOIN v ON t3.x = v.a;
```

O otimizador primeiro analisa a vista e converte a subconsulta `IN` em uma junção parcial, depois verifica se é possível fundir a vista na consulta externa. Como o modificador `STRAIGHT_JOIN` na consulta externa impede a junção parcial, o otimizador recusa a fusão, causando a avaliação da tabela derivada usando uma tabela materializada.

A saída `EXPLAIN` indica o uso de estratégias de junção parcial conforme a seguir:

- Para obter uma saída `EXPLAIN` estendida, o texto exibido por um `SHOW WARNINGS` subsequente mostra a consulta reescrita, que exibe a estrutura semijoin. (Veja a Seção 10.8.3, “Formato de Saída EXPLAIN Estendida”.) Com isso, você pode ter uma ideia de quais tabelas foram extraídas da semijoin. Se uma subconsulta foi convertida em uma semijoin, você deve ver que o predicado da subconsulta foi removido e suas tabelas e a cláusula `WHERE` foram unidas à lista de junção da consulta externa e à cláusula `WHERE`.

- O uso de tabela temporária para o Weedout Duplicado é indicado por `Start temporary` e `End temporary` na coluna `Extra`. As tabelas que não foram extraídas e estão na faixa das linhas de saída `EXPLAIN` cobertas por `Start temporary` e `End temporary` têm seu `rowid` na tabela temporária.

- O `FirstMatch(tbl_name)` na coluna `Extra` indica o uso de atalhos de junção.

- `LooseScan(m..n)` na coluna `Extra` indica o uso da estratégia LooseScan. `m` e `n` são números de peças-chave.

- O uso de tabela temporária para materialização é indicado por linhas com um valor `select_type` de `MATERIALIZED` e linhas com um valor `table` de `<subqueryN>`.

No MySQL 8.0.21 e versões posteriores, uma transformação semijoin também pode ser aplicada a uma instrução `UPDATE` ou `DELETE` de uma única tabela que utiliza um predicado de subconsulta `[NOT] IN` ou `[NOT] EXISTS`, desde que a instrução não utilize `ORDER BY` ou `LIMIT`, e que as transformações semijoin sejam permitidas por uma dica de otimizador ou pela configuração `optimizer_switch`.
