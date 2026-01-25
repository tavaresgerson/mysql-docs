### 8.15.2 Variáveis de Sistema que Controlam o Tracing

As seguintes variáveis de sistema afetam o tracing do Optimizer:

* `optimizer_trace`: Habilita ou desabilita o tracing do Optimizer. Consulte a Seção 8.15.8, “A Variável de Sistema optimizer_trace”.

* `optimizer_trace_features`: Habilita ou desabilita recursos selecionados do MySQL Optimizer, usando a sintaxe mostrada aqui:

  ```sql
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  Consulte a Seção 8.15.10, “Selecionando Recursos do Optimizer para Trace”, para mais informações sobre os efeitos desses recursos.

* `optimizer_trace_max_mem_size`: Quantidade máxima de memória que pode ser usada para armazenar todos os traces.

* `optimizer_trace_limit`: O número máximo de traces do Optimizer a serem exibidos. Consulte a Seção 8.15.4, “Ajustando a Limpeza do Trace”, para mais informações.

* `optimizer_trace_offset`: Offset do primeiro trace exibido. Consulte a Seção 8.15.4, “Ajustando a Limpeza do Trace”.

* `end_markers_in_json`: Se definido como `1`, faz com que o trace repita a chave (se presente) próxima ao colchete de fechamento. Isso também afeta a saída de `EXPLAIN FORMAT=JSON` naquelas versões do MySQL que suportam esta instrução. Consulte a Seção 8.15.9, “A Variável de Sistema end_markers_in_json”.