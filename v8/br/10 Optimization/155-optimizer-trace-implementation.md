### 10.15.16 Implementação do Rastreamento do Optimizer

Veja os arquivos `sql/opt_trace*`, começando com `sql/opt_trace.h`. O rastreamento é iniciado criando uma instância de `Opt_trace_start`; as informações são adicionadas a este rastreamento criando instâncias de `Opt_trace_object` e `Opt_trace_array`, e usando os métodos `add()` dessas classes.