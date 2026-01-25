## 13.6 Instruções Compostas

[13.6.1 Instrução Composta BEGIN ... END](begin-end.html)

[13.6.2 Rótulos de Instrução](statement-labels.html)

[13.6.3 Instrução DECLARE](declare.html)

[13.6.4 Variáveis em Programas Armazenados](stored-program-variables.html)

[13.6.5 Instruções de Controle de Fluxo](flow-control-statements.html)

[13.6.6 Cursors](cursors.html)

[13.6.7 Tratamento de Condição](condition-handling.html)

Esta seção descreve a sintaxe para a instrução composta [`BEGIN ... END`](begin-end.html "13.6.1 Instrução Composta BEGIN ... END") e outras instruções que podem ser usadas no corpo de programas armazenados (*stored programs*): Stored procedures, funções, triggers e events. Esses objetos são definidos em termos de código SQL que é armazenado no servidor para posterior invocação (consulte [Capítulo 23, *Objetos Armazenados*](stored-objects.html "Chapter 23 Stored Objects")).

Uma instrução composta é um bloco que pode conter outros blocos; declarações para variáveis, manipuladores de condição (*condition handlers*) e Cursors; e construções de controle de fluxo (*flow control*), como *loops* e testes condicionais.