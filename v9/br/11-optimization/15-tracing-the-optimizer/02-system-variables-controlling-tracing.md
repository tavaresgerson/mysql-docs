### 10.15.2 Variáveis de Sistema que Controlam o Rastreamento

As seguintes variáveis de sistema afetam o rastreamento do otimizador:

* `optimizer_trace`: Habilita ou desabilita o rastreamento do otimizador. Consulte a Seção 10.15.8, “A Variável de Sistema optimizer_trace”.

* `optimizer_trace_features`: Habilita ou desabilita recursos selecionados do Otimizador do MySQL, usando a sintaxe mostrada aqui:

  ```
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  Consulte a Seção 10.15.10, “Selecionando Recursos do Otimizador para Rastrear”, para obter mais informações sobre os efeitos desses recursos.

* `optimizer_trace_max_mem_size`: Quantidade máxima de memória que pode ser usada para armazenar todos os rastros.

* `optimizer_trace_limit`: Número máximo de rastros do otimizador a serem exibidos. Consulte a Seção 10.15.4, “Ajuste da Purga de Rastros”, para obter mais informações.

* `optimizer_trace_offset`: Deslocamento do primeiro rastro exibido. Consulte a Seção 10.15.4, “Ajuste da Purga de Rastros”.

* `end_markers_in_json`: Se definido como `1`, faz com que o rastro repita a chave (se presente) perto do parêntese de fechamento. Isso também afeta a saída de `EXPLAIN FORMAT=JSON` nas versões do MySQL que suportam essa declaração. Consulte a Seção 10.15.9, “A Variável de Sistema end_markers_in_json”.