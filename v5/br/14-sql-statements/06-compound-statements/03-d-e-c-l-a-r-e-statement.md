### 13.6.3 Declaração de DECLARE

A declaração `DECLARE` é usada para definir vários itens locais de um programa:

- Variáveis locais. Veja Seção 13.6.4, “Variáveis em Programas Armazenados”.

- Condições e manipuladores. Consulte Seção 13.6.7, “Manipulação de Condições”.

- Cursoros. Veja Seção 13.6.6, “Cursoros”.

`DECLARE` é permitido apenas dentro de uma instrução composta `BEGIN ... END` e deve estar no início, antes de qualquer outra instrução.

As declarações devem seguir uma certa ordem. As declarações de cursor devem aparecer antes das declarações de manipulador. As declarações de variáveis e condições devem aparecer antes das declarações de cursor ou manipulador.
