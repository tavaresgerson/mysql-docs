#### 13.6.7.8 Tratamento de Condições e Parâmetros OUT ou INOUT

Se um stored procedure é encerrado com uma exception não tratada, os valores modificados dos parâmetros `OUT` e `INOUT` não são propagados de volta para o chamador.

Se uma exception é tratada por um `handler` `CONTINUE` ou `EXIT` que contém uma instrução [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"), a execução de [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") retira (pop) elementos do `Diagnostics Area stack`, sinalizando assim a `exception` (ou seja, a informação que existia antes da entrada no `handler`). Se a `exception` for um erro, os valores dos parâmetros `OUT` e `INOUT` não são propagados de volta para o chamador.