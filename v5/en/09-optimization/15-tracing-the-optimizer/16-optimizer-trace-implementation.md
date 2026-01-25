### 8.15.16 Implementação do Optimizer Trace

Consulte os arquivos `sql/opt_trace*`, começando com `sql/opt_trace.h`. Um Trace é iniciado criando uma instância de `Opt_trace_start`; informações são adicionadas a este Trace criando instâncias de `Opt_trace_object` e `Opt_trace_array`, e utilizando os métodos `add()` destas classes.