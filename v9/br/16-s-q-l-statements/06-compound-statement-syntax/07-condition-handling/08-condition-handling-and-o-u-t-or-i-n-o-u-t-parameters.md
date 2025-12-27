#### 15.6.7.8 Gerenciamento de exceções e parâmetros OUT ou INOUT

Se um procedimento armazenado sair com uma exceção não gerenciada, os valores modificados dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.

Se uma exceção for gerenciada por um manipulador `CONTINUE` ou `EXIT` que contenha uma instrução `RESIGNAL`, a execução de `RESIGNAL` desponta a pilha da Área de Diagnóstico, sinalizando assim a exceção (ou seja, as informações que existiam antes da entrada no manipulador). Se a exceção for um erro, os valores dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.