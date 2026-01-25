### 8.15.8 A Variável de Sistema optimizer_trace

A variável de sistema optimizer_trace possui estas opções de ativação/desativação (on/off):

* `enabled`: Ativa (`ON`) ou desativa (`OFF`) o tracing

* `one_line`: Se definido como `ON`, o trace não contém whitespace, conservando assim espaço. Isso torna o trace difícil de ler para humanos, mas ainda utilizável por JSON parsers, já que eles ignoram whitespace.