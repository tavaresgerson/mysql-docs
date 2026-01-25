### 8.15.10 Selecionando Recursos do Optimizer para Rastreamento

Alguns recursos no Optimizer podem ser invocados várias vezes durante a otimização e execução de comandos, e, portanto, podem fazer com que o *trace* (rastreamento) cresça excessivamente. Eles são:

*   *Greedy search* (Busca Gulosa): Com um *JOIN* de *`N`* tabelas, isso pode explorar planos no número fatorial de (*`N`*).

*   *Range optimizer*
*   *Dynamic range optimization* (Otimização Dinâmica de Range): Mostrado como `range checked for each record` na saída do `EXPLAIN`; cada linha externa causa uma nova execução do *range optimizer*.

*   *Subqueries*: Uma *subquery* na qual a *WHERE clause* pode ser executada uma vez por linha.

Esses recursos podem ser excluídos do rastreamento (tracing) definindo um ou mais *switches* da variável de sistema `optimizer_trace_features` para `OFF`. Esses *switches* estão listados aqui:

*   `greedy_search`: O *greedy search* não é rastreado.
*   `range_optimizer`: O *range optimizer* não é rastreado.

*   `dynamic_range`: Apenas a primeira chamada ao *range optimizer* neste `JOIN_TAB::SQL_SELECT` é rastreada.

*   `repeated_subselect`: Apenas a primeira execução deste `Item_subselect` é rastreada.