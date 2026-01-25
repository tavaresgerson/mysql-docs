### 24.3.14 A Tabela OPTIMIZER_TRACE do INFORMATION_SCHEMA

A tabela [`OPTIMIZER_TRACE`](information-schema-optimizer-trace-table.html "24.3.14 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table") fornece informações produzidas pela capacidade de *tracing* do optimizer para *statements* rastreadas. Para habilitar o rastreamento, use a variável de sistema [`optimizer_trace`](server-system-variables.html#sysvar_optimizer_trace). Para detalhes, consulte [Seção 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

A tabela [`OPTIMIZER_TRACE`](information-schema-optimizer-trace-table.html "24.3.14 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table") possui as seguintes colunas:

* `QUERY`

  O texto da *statement* rastreada.

* `TRACE`

  O *trace* (rastreamento), no formato `JSON`.

* `MISSING_BYTES_BEYOND_MAX_MEM_SIZE`

  Cada *trace* lembrado é uma *string* que é estendida à medida que a otimização avança e anexa dados a ela. A variável [`optimizer_trace_max_mem_size`](server-system-variables.html#sysvar_optimizer_trace_max_mem_size) define um limite na quantidade total de memória usada por todos os *traces* atualmente lembrados. Se esse limite for atingido, o *trace* atual não é estendido (e, portanto, está incompleto), e a coluna `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` mostra o número de bytes ausentes no *trace*.

* `INSUFFICIENT_PRIVILEGES`

  Se uma Query rastreada usa *views* ou *stored routines* que têm `SQL SECURITY` com um valor de `DEFINER`, pode ser que um usuário diferente do definidor (*definer*) seja impedido de ver o *trace* da Query. Nesse caso, o *trace* é mostrado como vazio e `INSUFFICIENT_PRIVILEGES` tem o valor 1. Caso contrário, o valor é 0.