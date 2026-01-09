### 28.3.24 A Tabela `OPTIMIZER_TRACE` de INFORMAÇÃO_SCHEMA

A tabela `OPTIMIZER_TRACE` fornece informações produzidas pela capacidade de rastreamento do otimizador para instruções rastreadas. Para habilitar o rastreamento, use a variável de sistema `optimizer_trace`. Para obter detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

A tabela `OPTIMIZER_TRACE` tem as seguintes colunas:

* `QUERY`

  O texto da instrução rastreada.

* `TRACE`

  A traça, no formato `JSON`.

* `MISSING_BYTES_BEYOND_MAX_MEM_SIZE`

  Cada traça lembrada é uma string que é estendida à medida que a otimização progride e adiciona dados a ela. A variável `optimizer_trace_max_mem_size` define um limite para a quantidade total de memória usada por todas as traças atualmente lembradas. Se esse limite for atingido, a traça atual não é estendida (e, portanto, é incompleta), e a coluna `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` mostra o número de bytes faltantes da traça.

* `INSUFFICIENT_PRIVILEGES`

  Se uma consulta rastreada usar vistas ou rotinas armazenadas que têm `SQL SECURITY` com um valor de `DEFINER`, pode ser que um usuário diferente do definidor seja negado de ver a traça da consulta. Nesse caso, a traça é exibida como vazia e `INSUFFICIENT_PRIVILEGES` tem um valor de 1. Caso contrário, o valor é 0.