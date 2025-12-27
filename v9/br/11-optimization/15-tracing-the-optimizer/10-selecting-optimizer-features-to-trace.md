### 10.15.10 Selecionando recursos do otimizador para rastreamento

Alguns recursos do otimizador podem ser acionados várias vezes durante a otimização e execução de instruções, o que pode fazer com que o rastreamento cresça além do que é razoável. São eles:

* *Busca ganancista*: Com uma junção de tabela *`N`*-table, isso pode explorar planos fatoriais(*`N`*) .

* *Otimizador de intervalo*
* *Otimização dinâmica de intervalo*: Mostrado como `intervalo verificado para cada registro` na saída `EXPLAIN`; cada linha externa causa uma nova execução do otimizador de intervalo.

* *Subconsultas*: Uma subconsulta na qual a cláusula `WHERE` pode ser executada uma vez por linha.

Esses recursos podem ser excluídos do rastreamento definindo um ou mais switches da variável de sistema `optimizer_trace_features` para `OFF`. Esses switches estão listados aqui:

* `greedy_search`: A busca ganancista não é rastreada.
* `range_optimizer`: O otimizador de intervalo não é rastreado.

* `dynamic_range`: Apenas a primeira chamada ao otimizador de intervalo nesta `JOIN_TAB::SQL_SELECT` é rastreada.

* `repeated_subselect`: Apenas a primeira execução desta `Item_subselect` é rastreada.