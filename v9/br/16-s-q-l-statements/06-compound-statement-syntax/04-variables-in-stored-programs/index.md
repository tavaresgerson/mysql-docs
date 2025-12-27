### 15.6.4 Variáveis em Programas Armazenados

15.6.4.1 Declaração de Variável Local

15.6.4.2 Escopo e Resolução de Variáveis Locais

Variáveis de sistema e variáveis definidas pelo usuário podem ser usadas em programas armazenados, assim como podem ser usadas fora do contexto de programas armazenados. Além disso, programas armazenados podem usar `DECLARE` para definir variáveis locais, e rotinas armazenadas (procedimentos e funções) podem ser declaradas para receber parâmetros que comunicam valores entre a rotina e seu chamador.

* Para declarar variáveis locais, use a declaração `DECLARE`, conforme descrito na Seção 15.6.4.1, “Declaração de Variável Local `DECLARE`”.

* As variáveis podem ser definidas diretamente com a declaração `SET`. Veja a Seção 15.7.6.1, “Sintaxe `SET` para Atribuição de Variáveis”.

* Resultados de consultas podem ser recuperados em variáveis locais usando `SELECT ... INTO var_list` ou abrindo um cursor e usando `FETCH ... INTO var_list`. Veja a Seção 15.2.13.1, “Declaração `SELECT ... INTO`”, e a Seção 15.6.6, “Cursors”.

Para informações sobre o escopo das variáveis locais e como o MySQL resolve nomes ambíguos, veja a Seção 15.6.4.2, “Escopo e Resolução de Variáveis Locais”.

Não é permitido atribuir o valor `DEFAULT` a parâmetros de procedimentos ou funções armazenados ou variáveis locais de programas armazenados (por exemplo, com uma declaração `SET var_name = DEFAULT`). No MySQL 9.5, isso resulta em um erro de sintaxe.