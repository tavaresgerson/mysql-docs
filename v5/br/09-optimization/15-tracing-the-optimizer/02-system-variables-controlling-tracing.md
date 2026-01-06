### 8.15.2 Variáveis do sistema que controlam o rastreamento

As seguintes variáveis de sistema afetam o rastreamento do otimizador:

- `optimizer_trace`: Habilita ou desabilita o rastreamento do otimizador. Consulte a Seção 8.15.8, “A variável de sistema optimizer\_trace”.

- `optimizer_trace_features`: Habilita ou desabilita as características selecionadas do MySQL Optimizer, usando a sintaxe mostrada aqui:

  ```sql
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  Consulte a Seção 8.15.10, “Selecionando recursos do otimizador para rastreio”, para obter mais informações sobre os efeitos desses recursos.

- `optimizer_trace_max_mem_size`: Quantidade máxima de memória que pode ser usada para armazenar todos os rastros.

- `optimizer_trace_limit`: O número máximo de traços do otimizador a serem exibidos. Consulte a Seção 8.15.4, “Ajuste da Purga de Rastros”, para obter mais informações.

- `optimizer_trace_offset`: Deslocamento do primeiro rastreamento exibido. Veja a Seção 8.15.4, “Ajuste da Purga de Rastreamentos”.

- `end_markers_in_json`: Se definido como `1`, faz com que o registro repita a chave (se presente) perto do parêntese de fechamento. Isso também afeta a saída do `EXPLAIN FORMAT=JSON` nas versões do MySQL que suportam essa declaração. Veja a Seção 8.15.9, “A variável de sistema end\_markers\_in\_json”.
