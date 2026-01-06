#### 13.6.7.8 Gerenciamento de Condições e Parâmetros OUT ou INOUT

Se um procedimento armazenado sair com uma exceção não tratada, os valores modificados dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.

Se uma exceção for tratada por um manipulador de `CONTINUE` ou `EXIT` que contém uma instrução `RESIGNAL`, a execução de `RESIGNAL` empurra a pilha da Área de Diagnóstico, sinalizando assim a exceção (ou seja, as informações que existiam antes da entrada no manipulador). Se a exceção for um erro, os valores dos parâmetros `OUT` e `INOUT` não são propagados de volta ao chamador.
