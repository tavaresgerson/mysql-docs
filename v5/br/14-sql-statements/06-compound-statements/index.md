## 13.6 Instruções Compostas

13.6.1 Instrução Composta BEGIN ... END

13.6.2 Rótulos de Instrução

13.6.3 Instrução DECLARE

13.6.4 Variáveis em Programas Armazenados

13.6.5 Instruções de Controle de Fluxo

13.6.6 Cursors

13.6.7 Tratamento de Condição

Esta seção descreve a sintaxe para a instrução composta `BEGIN ... END` e outras instruções que podem ser usadas no corpo de programas armazenados (*stored programs*): Stored procedures, funções, triggers e events. Esses objetos são definidos em termos de código SQL que é armazenado no servidor para posterior invocação (consulte Capítulo 23, *Objetos Armazenados*).

Uma instrução composta é um bloco que pode conter outros blocos; declarações para variáveis, manipuladores de condição (*condition handlers*) e Cursors; e construções de controle de fluxo (*flow control*), como *loops* e testes condicionais.