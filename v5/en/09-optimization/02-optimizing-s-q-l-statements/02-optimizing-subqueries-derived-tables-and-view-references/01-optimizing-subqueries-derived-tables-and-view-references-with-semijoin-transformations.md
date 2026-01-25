#### 8.2.2.1 Otimizando Subqueries, Derived Tables e Referências a Views com Transformações Semijoin

Uma *semijoin* é uma transformação realizada em tempo de preparação que permite múltiplas estratégias de execução, como *table pullout* (extração de tabela), *duplicate weedout* (remoção de duplicatas), *first match* (primeira correspondência), *loose scan* e *materialization*. O otimizador usa estratégias de *semijoin* para melhorar a execução de *subquery*, conforme descrito nesta seção.

Para um *inner join* entre duas tabelas, o *join* retorna uma linha de uma tabela tantas vezes quantas forem as correspondências na outra tabela. Mas para algumas questões, a única informação relevante é se existe uma correspondência, e não o número de correspondências. Suponha que existam tabelas chamadas `class` e `roster` que listam as aulas em um currículo de curso e as listas de chamada (alunos matriculados em cada aula), respectivamente. Para listar as aulas que realmente têm alunos matriculados, você poderia usar este *join*:

```sql
SELECT class.class_num, class.class_name
FROM class INNER JOIN roster
WHERE class.class_num = roster.class_num;
```

No entanto, o resultado lista cada aula uma vez para cada aluno matriculado. Para a pergunta feita, isso é uma duplicação desnecessária de informação.

Assumindo que `class_num` é uma *Primary Key* na tabela `class`, a supressão de duplicatas é possível usando `SELECT DISTINCT`, mas é ineficiente gerar primeiro todas as linhas correspondentes apenas para eliminar duplicatas posteriormente.

O mesmo resultado sem duplicatas pode ser obtido usando uma *subquery*:

```sql
SELECT class_num, class_name
FROM class
WHERE class_num IN (SELECT class_num FROM roster);
```

Aqui, o otimizador pode reconhecer que a cláusula `IN` exige que a *subquery* retorne apenas uma instância de cada número de aula da tabela `roster`. Neste caso, a *Query* pode usar uma *semijoin*; ou seja, uma operação que retorna apenas uma instância de cada linha em `class` que é correspondida por linhas em `roster`.

A sintaxe de *outer join* e *inner join* é permitida na especificação da *Query* externa, e as referências de tabela podem ser tabelas base, *derived tables* ou referências a *views*.

No MySQL, uma *subquery* deve satisfazer estes critérios para ser tratada como uma *semijoin*:

*   Deve ser uma *subquery* `IN` (ou `=ANY`) que aparece no nível superior da cláusula `WHERE` ou `ON`, possivelmente como um termo em uma expressão `AND`. Por exemplo:

    ```sql
  SELECT ...
  FROM ot1, ...
  WHERE (oe1, ...) IN (SELECT ie1, ... FROM it1, ... WHERE ...);
  ```

    Aqui, `ot_i` e `it_i` representam tabelas nas partes externa e interna da *Query*, e `oe_i` e `ie_i` representam expressões que se referem a colunas nas tabelas externas e internas.

*   Deve ser um único `SELECT` sem construções `UNION`.

*   Não deve conter uma cláusula `GROUP BY` ou `HAVING`.

*   Não deve ser implicitamente agrupada (não deve conter funções de agregação).

*   Não deve ter `ORDER BY` com `LIMIT`.

*   A instrução não deve usar o tipo de *join* `STRAIGHT_JOIN` na *Query* externa.

*   O modificador `STRAIGHT_JOIN` não deve estar presente.

*   O número de tabelas externas e internas juntas deve ser menor que o número máximo de tabelas permitido em um *join*.

A *subquery* pode ser correlacionada ou não correlacionada. `DISTINCT` é permitido, assim como `LIMIT`, a menos que `ORDER BY` também seja usado.

Se uma *subquery* atender aos critérios anteriores, o MySQL a converte em uma *semijoin* e faz uma escolha baseada em custo a partir destas estratégias:

*   Converter a *subquery* em um *join*, ou usar *table pullout* e executar a *Query* como um *inner join* entre as tabelas da *subquery* e as tabelas externas. *Table pullout* extrai uma tabela da *subquery* para a *Query* externa.

*   *Duplicate Weedout*: Executar a *semijoin* como se fosse um *join* e remover registros duplicados usando uma tabela temporária.

*   *FirstMatch*: Ao escanear as tabelas internas em busca de combinações de linhas e houver múltiplas instâncias de um determinado grupo de valores, escolher uma em vez de retornar todas. Isso "atalha" o escaneamento e elimina a produção de linhas desnecessárias.

*   *LooseScan*: Escanear uma tabela de *subquery* usando um *Index* que permite que um único valor seja escolhido de cada grupo de valores da *subquery*.

*   *Materialize* (Materializar) a *subquery* em uma tabela temporária indexada que é usada para realizar um *join*, onde o *Index* é usado para remover duplicatas. O *Index* também pode ser usado posteriormente para *lookups* (pesquisas) ao fazer *join* da tabela temporária com as tabelas externas; caso contrário, a tabela é escaneada. Para mais informações sobre *materialization*, consulte a Seção 8.2.2.2, “Otimizando Subqueries com Materialization”.

Cada uma dessas estratégias pode ser ativada ou desativada usando os seguintes *flags* da variável de sistema `optimizer_switch`:

*   O *flag* `semijoin` controla se as *semijoins* são usadas.

*   Se `semijoin` estiver ativado, os *flags* `firstmatch`, `loosescan`, `duplicateweedout` e `materialization` permitem um controle mais refinado sobre as estratégias de *semijoin* permitidas.

*   Se a estratégia de *semijoin* `duplicateweedout` estiver desativada, ela não será usada a menos que todas as outras estratégias aplicáveis também estejam desativadas.

*   Se `duplicateweedout` estiver desativado, ocasionalmente o otimizador pode gerar um plano de *Query* que está longe de ser ideal. Isso ocorre devido à poda heurística durante a busca gulosa (*greedy search*), o que pode ser evitado definindo `optimizer_prune_level=0`.

Esses *flags* estão ativados por padrão. Consulte a Seção 8.9.2, “Otimizações Alternáveis”.

O otimizador minimiza as diferenças no tratamento de *views* e *derived tables*. Isso afeta as *queries* que usam o modificador `STRAIGHT_JOIN` e uma *view* com uma *subquery* `IN` que pode ser convertida para uma *semijoin*. A seguinte *query* ilustra isso porque a mudança no processamento causa uma mudança na transformação e, portanto, uma estratégia de execução diferente:

```sql
CREATE VIEW v AS
SELECT *
FROM t1
WHERE a IN (SELECT b
           FROM t2);

SELECT STRAIGHT_JOIN *
FROM t3 JOIN v ON t3.x = v.a;
```

O otimizador primeiro examina a *view* e converte a *subquery* `IN` em uma *semijoin*, depois verifica se é possível mesclar a *view* na *Query* externa. Como o modificador `STRAIGHT_JOIN` na *Query* externa impede a *semijoin*, o otimizador recusa a mesclagem, causando a avaliação da *derived table* usando uma tabela *materialized*.

A saída do `EXPLAIN` indica o uso de estratégias de *semijoin* da seguinte forma:

*   Tabelas com *semijoin* aparecem no *select* externo. Para a saída `EXPLAIN` estendida, o texto exibido por um subsequente `SHOW WARNINGS` mostra a *Query* reescrita, que exibe a estrutura da *semijoin*. (Consulte a Seção 8.8.3, “Extended EXPLAIN Output Format”.) A partir disso, você pode ter uma ideia de quais tabelas foram extraídas da *semijoin*. Se uma *subquery* foi convertida em uma *semijoin*, você pode ver que o predicado da *subquery* desapareceu e suas tabelas e cláusula `WHERE` foram mescladas na lista de *join* da *Query* externa e na cláusula `WHERE`.

*   O uso de tabela temporária para *Duplicate Weedout* é indicado por `Start temporary` e `End temporary` na coluna `Extra`. As tabelas que não foram extraídas e estão no intervalo de linhas de saída do `EXPLAIN` cobertas por `Start temporary` e `End temporary` têm seu `rowid` na tabela temporária.

*   `FirstMatch(tbl_name)` na coluna `Extra` indica atalho de *join* (*join shortcutting*).

*   `LooseScan(m..n)` na coluna `Extra` indica o uso da estratégia *LooseScan*. *`m`* e *`n`* são números de parte da chave (*key part numbers*).

*   O uso de tabela temporária para *materialization* é indicado por linhas com um valor `select_type` de `MATERIALIZED` e linhas com um valor `table` de `<subqueryN>`.