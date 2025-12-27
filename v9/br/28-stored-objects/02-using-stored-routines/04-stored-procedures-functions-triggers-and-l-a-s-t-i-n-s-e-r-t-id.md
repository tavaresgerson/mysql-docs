### 27.2.4 Procedimentos Armazenados, Funções, Descodificadores e LAST_INSERT_ID()

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um descodificador, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para instruções executadas fora do corpo desses tipos de objetos (veja a Seção 14.15, “Funções de Informação”). O efeito de uma rotina armazenada ou de um descodificador sobre o valor de `LAST_INSERT_ID()` que é visto ao seguir as instruções depende do tipo de rotina:

* Se um procedimento armazenado executa instruções que alteram o valor de `LAST_INSERT_ID()`, o valor alterado é visto por instruções que seguem a chamada do procedimento.

* Para funções e descodificadores armazenados que alteram o valor, o valor é restaurado quando a função ou descodificador termina, então as instruções seguintes não veem um valor alterado.