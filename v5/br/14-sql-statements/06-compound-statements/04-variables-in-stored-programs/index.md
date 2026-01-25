### 13.6.4 Variáveis em Programas Armazenados

[13.6.4.1 Declaração DECLARE de Variável Local](declare-local-variable.html)

[13.6.4.2 Escopo e Resolução de Variável Local](local-variable-scope.html)

Variáveis de sistema e variáveis definidas pelo usuário podem ser usadas em programas armazenados, assim como podem ser usadas fora do contexto de programas armazenados. Além disso, programas armazenados podem usar `DECLARE` para definir variáveis locais, e stored routines (procedures e functions) podem ser declaradas para receber parameters que comunicam valores entre a rotina e quem a chamou (caller).

* Para declarar variáveis locais, utilize a instrução [`DECLARE`](declare-local-variable.html "13.6.4.1 Declaração DECLARE de Variável Local"), conforme descrito na [Seção 13.6.4.1, “Declaração DECLARE de Variável Local”](declare-local-variable.html "13.6.4.1 Declaração DECLARE de Variável Local").

* Variáveis podem ser definidas diretamente com a instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variável"). Consulte a [Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variável”](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variável").

* Resultados de Queries podem ser recuperados em variáveis locais usando [`SELECT ... INTO var_list`](select-into.html "13.2.9.1 Instrução SELECT ... INTO") ou abrindo um cursor e usando [`FETCH ... INTO var_list`](fetch.html "13.6.6.3 Instrução FETCH de Cursor"). Consulte a [Seção 13.2.9.1, “Instrução SELECT ... INTO”](select-into.html "13.2.9.1 Instrução SELECT ... INTO") e a [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

Para obter informações sobre o escopo de variáveis locais e como o MySQL resolve nomes ambíguos, consulte a [Seção 13.6.4.2, “Escopo e Resolução de Variável Local”](local-variable-scope.html "13.6.4.2 Escopo e Resolução de Variável Local").

Não é permitido atribuir o valor `DEFAULT` a parameters de stored procedure ou function, nem a variáveis locais de stored program (por exemplo, com uma instrução `SET var_name = DEFAULT`). No MySQL 5.7, isso resulta em um syntax error.