### 15.6.3 Declaração `DECLARE`

A declaração `DECLARE` é usada para definir vários itens locais de um programa:

* Variáveis locais. Consulte a Seção 15.6.4, “Variáveis em Programas Armazenados”.

* Condições e manipuladores. Consulte a Seção 15.6.7, “Manipulação de Condições”.

* Cursors. Consulte a Seção 15.6.6, “Cursors”.

A declaração `DECLARE` é permitida apenas dentro de uma declaração composta `BEGIN ... END` e deve estar no início, antes de qualquer outra declaração.

As declarações devem seguir uma ordem específica. As declarações de cursors devem aparecer antes das declarações de manipuladores. As declarações de variáveis e condições devem aparecer antes das declarações de cursors ou manipuladores.