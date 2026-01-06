#### 8.2.2.1 Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações de semijoin

Um semijoin é uma transformação de tempo de preparação que permite várias estratégias de execução, como extração de tabela, eliminação de duplicatas, primeira correspondência, varredura solta e materialização. O otimizador utiliza estratégias de semijoin para melhorar a execução de subconsultas, conforme descrito nesta seção.

Para uma junção interna entre duas tabelas, a junção retorna uma linha de uma tabela tantas vezes quanto houver correspondências na outra tabela. Mas, para algumas perguntas, a única informação que importa é se há uma correspondência, não o número de correspondências. Suponha que existam tabelas chamadas `classe` e `rotas` que listam as classes em um currículo de curso e os rostos das classes (alunos matriculados em cada classe), respectivamente. Para listar as classes que realmente têm alunos matriculados, você poderia usar essa junção:

```sql
SELECT class.class_num, class.class_name
FROM class INNER JOIN roster
WHERE class.class_num = roster.class_num;
```

No entanto, o resultado lista cada turma uma vez para cada aluno matriculado. Para a pergunta em questão, essa é uma duplicação desnecessária de informações.

Supondo que `class_num` seja uma chave primária na tabela `class`, a supressão de duplicatas é possível usando `SELECT DISTINCT`, mas é ineficiente gerar todas as linhas correspondentes primeiro e apenas eliminar as duplicatas mais tarde.

O mesmo resultado sem duplicatas pode ser obtido usando uma subconsulta:

```sql
SELECT class_num, class_name
FROM class
WHERE class_num IN (SELECT class_num FROM roster);
```

Aqui, o otimizador pode reconhecer que a cláusula `IN` exige que a subconsulta retorne apenas uma instância de cada número de classe da tabela `roster`. Neste caso, a consulta pode usar uma junção parcial; ou seja, uma operação que retorne apenas uma instância de cada linha em `class` que seja correspondida por linhas em `roster`.

A sintaxe de junção externa e interna é permitida na especificação da consulta externa, e as referências de tabela podem ser tabelas base, tabelas derivadas ou referências de visualização.

Em MySQL, uma subconsulta deve satisfazer esses critérios para ser tratada como uma junção parcial:

- Deve ser uma subconsulta `IN` (ou `=ANY`) que apareça no nível superior da cláusula `WHERE` ou `ON`, possivelmente como um termo em uma expressão `AND`. Por exemplo:

  ```sql
  SELECT ...
  FROM ot1, ...
  WHERE (oe1, ...) IN (SELECT ie1, ... FROM it1, ... WHERE ...);
  ```

  Aqui, `ot_i` e `it_i` representam tabelas nas partes externa e interna da consulta, e `oe_i` e `ie_i` representam expressões que se referem a colunas nas tabelas externa e interna.

- Deve ser um único `SELECT` sem construções `UNION`.

- Não deve conter uma cláusula `GROUP BY` ou `HAVING`.

- Não deve ser agrupado implicitamente (não deve conter funções agregadas).

- Não deve ter `ORDER BY` com `LIMIT`.

- A declaração não deve usar o tipo de junção `STRAIGHT_JOIN` na consulta externa.

- O modificador `STRAIGHT_JOIN` não deve estar presente.

- O número de tabelas externas e internas juntas deve ser menor que o número máximo de tabelas permitidas em uma junção.

A subconsulta pode ser correlacionada ou não. O `DISTINCT` é permitido, assim como o `LIMIT`, a menos que `ORDER BY` também seja usado.

Se uma subconsulta atender aos critérios anteriores, o MySQL a converte em uma junção parcial e faz uma escolha baseada no custo entre essas estratégias:

- Converta a subconsulta em uma junção ou use a extração de tabela e execute a consulta como uma junção interna entre as tabelas da subconsulta e as tabelas externas. A extração de tabela extrai uma tabela da subconsulta para a consulta externa.

- Weedout Duplicado: Execute a semijoin como se fosse uma junção e remova os registros duplicados usando uma tabela temporária.

- FirstMatch: Ao digitalizar as tabelas internas em busca de combinações de linhas e houver múltiplas instâncias de um grupo de valores específico, escolha uma em vez de retornar todas. Esse "atravessar" a digitalização elimina a produção de linhas desnecessárias.

- LooseScan: Escanear uma tabela de subconsulta usando um índice que permite que um único valor seja escolhido do grupo de valores de cada subconsulta.

- Materialize a subconsulta em uma tabela temporária indexada que será usada para realizar uma junção, onde o índice será usado para remover duplicatas. O índice também pode ser usado posteriormente para consultas ao realizar a junção da tabela temporária com as tabelas externas; caso contrário, a tabela será escaneada. Para mais informações sobre materialização, consulte a Seção 8.2.2.2, “Otimizando Subconsultas com Materialização”.

Cada uma dessas estratégias pode ser habilitada ou desabilitada usando as seguintes flags da variável de sistema `optimizer_switch`:

- A bandeira `semijoin` controla se os semijoins são usados.

- Se o `semijoin` estiver habilitado, as opções `firstmatch`, `loosescan`, `duplicateweedout` e `materialization` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

- Se a estratégia de junção semijunta `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

- Se o `duplicateweedout` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, o que pode ser evitado definindo `optimizer_prune_level=0`.

Essas bandeiras estão habilitadas por padrão. Veja a Seção 8.9.2, “Otimizações Alternativas”.

O otimizador minimiza as diferenças no tratamento de visualizações e tabelas derivadas. Isso afeta consultas que utilizam o modificador `STRAIGHT_JOIN` e uma visualização com uma subconsulta `IN` que pode ser convertida em um semijoin. A consulta a seguir ilustra isso, pois a mudança no processamento causa uma mudança na transformação e, portanto, uma estratégia de execução diferente:

```sql
CREATE VIEW v AS
SELECT *
FROM t1
WHERE a IN (SELECT b
           FROM t2);

SELECT STRAIGHT_JOIN *
FROM t3 JOIN v ON t3.x = v.a;
```

O otimizador primeiro analisa a vista e converte a subconsulta `IN` em uma junção parcial, depois verifica se é possível combinar a vista com a consulta externa. Como o modificador `STRAIGHT_JOIN` na consulta externa impede a junção parcial, o otimizador recusa a junção, causando a avaliação da tabela derivada usando uma tabela materializada.

A saída `EXPLAIN` indica o uso de estratégias de junção parcial da seguinte forma:

- As tabelas semijoinadas aparecem no select externo. Para obter uma saída detalhada do `EXPLAIN`, o texto exibido por um `SHOW WARNINGS` subsequente mostra a consulta reescrita, que exibe a estrutura semijoin. (Veja a Seção 8.8.3, “Formato de Saída EXPLAIN Detalhada”.) Com isso, você pode ter uma ideia de quais tabelas foram extraídas da semijoin. Se uma subconsulta foi convertida em uma semijoin, você pode ver que o predicado da subconsulta foi removido e suas tabelas e cláusula `WHERE` foram unidas à lista de junção da consulta externa e à cláusula `WHERE`.

- O uso de uma tabela temporária para o Weedout Duplicado é indicado por `Início temporário` e `Fim temporário` na coluna `Extra`. As tabelas que não foram extraídas e estão na faixa das linhas de saída `EXPLAIN` cobertas por `Início temporário` e `Fim temporário` têm seu `rowid` na tabela temporária.

- `FirstMatch(tbl_name)` na coluna `Extra` indica o uso de atalhos de junção.

- `LooseScan(m..n)` na coluna `Extra` indica o uso da estratégia LooseScan. *`m`* e *`n`* são números de peças-chave.

- O uso de tabela temporária para materialização é indicado por linhas com um valor `select_type` de `MATERIALIZED` e linhas com um valor `table` de `<subqueryN>`.
