### 24.3.14 A tabela INFORMATION\_SCHEMA OPTIMIZER\_TRACE

A tabela `OPTIMIZER_TRACE` fornece informações produzidas pela capacidade de rastreamento do otimizador para instruções rastreadas. Para habilitar o rastreamento, use a variável de sistema `optimizer_trace`. Para obter detalhes, consulte Seção 8.15, “Rastreamento do Otimizador”.

A tabela `OPTIMIZER_TRACE` tem as seguintes colunas:

- `QUERY`

  O texto da declaração traçada.

- `TRACE`

  A trilha, no formato `JSON`.

- `DESLOCAMENTO DE BÔNUS EXCEDENDO O TAMANHO MÁXIMO DE MEMÓRIA`

  Cada rastro lembrado é uma string que é estendida à medida que a otimização avança e adiciona dados a ela. A variável `optimizer_trace_max_mem_size` define um limite para a quantidade total de memória usada por todos os rastros lembrados atualmente. Se esse limite for atingido, o rastro atual não é estendido (e, portanto, é incompleto), e a coluna `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` mostra o número de bytes faltantes do rastro.

- `INSUFFICIENT_PRIVILEGES`

  Se uma consulta rastreada usar visualizações ou rotinas armazenadas que tenham `SQL SECURITY` com o valor `DEFINER`, pode ser que um usuário diferente do definidor seja negado de ver o rastreamento da consulta. Nesse caso, o rastreamento é exibido como vazio e `INSUFFICIENT_PRIVILEGES` tem o valor 1. Caso contrário, o valor é 0.
