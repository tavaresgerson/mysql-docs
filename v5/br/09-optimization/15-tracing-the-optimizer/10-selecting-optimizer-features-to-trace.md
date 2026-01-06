### 8.15.10 Selecionando as características do otimizador para rastrear

Algumas funcionalidades do otimizador podem ser acionadas várias vezes durante a otimização e execução de instruções, podendo, assim, fazer com que o rastreamento cresça além do que é razoável. Elas são:

- *Pesquisa gananciosa*: Com uma junção de tabela `N`, isso poderia explorar planos fatoriais (*`N`*)

- *Otimizador de alcance*

- *Otimização da faixa dinâmica*: mostrada como `faixa verificada para cada registro` na saída `EXPLAIN`; cada linha externa causa uma nova execução do otimizador de faixa.

- *Subconsultas*: Uma subconsulta na qual a cláusula `WHERE` pode ser executada uma vez por linha.

Essas funcionalidades podem ser excluídas do rastreamento definindo um ou mais interruptores da variável de sistema `optimizer_trace_features` para `OFF`. Esses interruptores estão listados aqui:

- `greedy_search`: A busca ganancista não é rastreada.

- `range_optimizer`: O otimizador de intervalo não está sendo rastreado.

- `dynamic_range`: Apenas o primeiro chamado ao otimizador de intervalo nesta `JOIN_TAB::SQL_SELECT` é rastreado.

- `repeated_subselect`: Apenas a primeira execução deste `Item_subselect` é rastreada.
