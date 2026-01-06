### 13.6.4 Variáveis em Programas Armazenados

13.6.4.1 Declaração de variável local DECLARE

13.6.4.2 Escopo e resolução de variáveis locais

As variáveis de sistema e as variáveis definidas pelo usuário podem ser usadas em programas armazenados, assim como podem ser usadas fora do contexto de programas armazenados. Além disso, os programas armazenados podem usar `DECLARE` para definir variáveis locais, e as rotinas armazenadas (procedimentos e funções) podem ser declaradas para receber parâmetros que comunicam valores entre a rotina e seu solicitante.

- Para declarar variáveis locais, use a instrução `DECLARE`, conforme descrito na Seção 13.6.4.1, “Instrução de DECLARE de Variável Local”.

- As variáveis podem ser definidas diretamente com a instrução `SET`. Veja Seção 13.7.4.1, “Sintaxe SET para atribuição de variáveis”.

- Os resultados das consultas podem ser recuperados em variáveis locais usando `SELECT ... INTO var_list` ou abrindo um cursor e usando `FETCH ... INTO var_list`. Veja Seção 13.2.9.1, “Instrução SELECT ... INTO” e Seção 13.6.6, “Cursors”.

Para obter informações sobre o escopo das variáveis locais e como o MySQL resolve nomes ambíguos, consulte Seção 13.6.4.2, “Escopo e Resolução de Variáveis Locais”.

Não é permitido atribuir o valor `DEFAULT` aos parâmetros de procedimentos ou funções armazenados ou às variáveis locais de programas armazenados (por exemplo, com uma declaração `SET var_name = DEFAULT`). No MySQL 5.7, isso resulta em um erro de sintaxe.
