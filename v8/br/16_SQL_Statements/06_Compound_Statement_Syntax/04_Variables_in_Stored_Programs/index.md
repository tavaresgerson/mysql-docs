### 15.6.4 Variáveis em Programas Armazenados

15.6.4.1 Declaração de variável local DECLARE

15.6.4.2 Âmbito e resolução de variáveis locais

As variáveis de sistema e as variáveis definidas pelo usuário podem ser usadas em programas armazenados, assim como podem ser usadas fora do contexto de programas armazenados. Além disso, os programas armazenados podem usar `DECLARE` para definir variáveis locais, e rotinas armazenadas (procedimentos e funções) podem ser declaradas para receber parâmetros que comunicam valores entre a rotina e seu solicitante.

- Para declarar variáveis locais, use a instrução `DECLARE`, conforme descrito na Seção 15.6.4.1, “Instrução de DECLARE de Variável Local”.

- As variáveis podem ser definidas diretamente com a instrução `SET`. Veja a Seção 15.7.6.1, “Sintaxe de definição de variáveis”.

- Os resultados das consultas podem ser recuperados em variáveis locais usando `SELECT ... INTO var_list` ou abrindo um cursor e usando `FETCH ... INTO var_list`. Veja a Seção 15.2.13.1, “Instrução SELECT ... INTO”, e a Seção 15.6.6, “Cursors”.

Para obter informações sobre o escopo das variáveis locais e como o MySQL resolve nomes ambíguos, consulte a Seção 15.6.4.2, “Escopo e Resolução de Variáveis Locais”.

Não é permitido atribuir o valor `DEFAULT` aos parâmetros de procedimentos ou funções armazenados ou às variáveis locais de programas armazenados (por exemplo, com uma instrução `SET var_name = DEFAULT`). No MySQL 8.0, isso resulta em um erro de sintaxe.
