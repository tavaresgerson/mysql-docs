### 10.15.2 Variáveis do sistema que controlam o rastreamento

As seguintes variáveis de sistema afetam o rastreamento do otimizador:

- `optimizer_trace`: Habilita ou desabilita o rastreamento do otimizador. Veja a Seção 10.15.8, “A variável de sistema optimizer\_trace”.

- `optimizer_trace_features`: Habilita ou desabilita recursos selecionados do MySQL Optimizer, usando a sintaxe mostrada aqui:

  ```
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  Consulte a Seção 10.15.10, “Selecionando recursos do otimizador para rastrear”, para obter mais informações sobre os efeitos desses recursos.

- `optimizer_trace_max_mem_size`: Quantidade máxima de memória que pode ser usada para armazenar todos os rastros.

- `optimizer_trace_limit`: O número máximo de traços do otimizador a serem exibidos. Consulte a Seção 10.15.4, “Ajuste da Purga de Traços”, para obter mais informações.

- `optimizer_trace_offset`: Deslocamento do primeiro traço exibido. Consulte a Seção 10.15.4, “Ajuste da Limpeza de Traços”.

- `end_markers_in_json`: Se definido como `1`, faz com que o rastreamento repita a chave (se presente) perto do parêntese de fechamento. Isso também afeta a saída de `EXPLAIN FORMAT=JSON` nas versões do MySQL que suportam essa declaração. Veja a Seção 10.15.9, “A variável de sistema end\_markers\_in\_json”.
