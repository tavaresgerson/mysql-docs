## Sintaxe de Declarações Compostas

15.6.1 Declaração Composta BEGIN ... END

15.6.2 Rótulos de Declarações

15.6.3 Declaração DECLARE

15.6.4 Variáveis em Programas Armazenados

15.6.5 Declarações de Controle de Fluxo

15.6.6 Cursors

15.6.7 Tratamento de Condições

15.6.8 Restrições no Tratamento de Condições

Esta seção descreve a sintaxe da declaração composta `BEGIN ... END` e outras declarações que podem ser usadas no corpo de programas armazenados: procedimentos e funções armazenados, gatilhos e eventos. Esses objetos são definidos em termos de código SQL armazenado no servidor para invocação posterior (consulte o Capítulo 27, *Objetos Armazenados*).

Uma declaração composta é um bloco que pode conter outros blocos; declarações de variáveis, manipuladores de condições e cursors; e construções de controle de fluxo, como loops e testes condicionais.