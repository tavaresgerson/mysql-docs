### 10.15.10 Selecionar as características do otimizador para rastrear

Algumas funcionalidades do otimizador podem ser acionadas várias vezes durante a otimização e execução de instruções, podendo, assim, fazer com que o rastreamento cresça além do que é razoável. Elas são:

- *Pesquisa gananciosa*: Com uma junção da tabela `N`, isso poderia explorar planos de fatorial(`N`).

- *Otimizador de alcance*

- *Otimização da faixa dinâmica*: Apresentado como `range checked for each record` na saída `EXPLAIN`; cada linha externa causa uma nova execução do otimizador de faixa.

- *Subconsultas*: Uma subconsulta na qual a cláusula `WHERE` pode ser executada uma vez por linha.

Essas funcionalidades podem ser excluídas do rastreamento definindo um ou mais interruptores da variável de sistema `optimizer_trace_features` para `OFF`. Esses interruptores estão listados aqui:

- `greedy_search`: A busca gananciosa não é rastreada.

- `range_optimizer`: O otimizador de alcance não está rastreado.

- `dynamic_range`: Apenas a primeira chamada ao otimizador de intervalo neste `JOIN_TAB::SQL_SELECT` é rastreada.

- `repeated_subselect`: Apenas a primeira execução deste `Item_subselect` é rastreada.
