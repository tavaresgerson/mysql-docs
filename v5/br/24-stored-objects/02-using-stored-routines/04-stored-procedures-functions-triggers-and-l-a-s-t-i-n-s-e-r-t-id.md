### 23.2.4 Procedimentos armazenados, funções, gatilhos e LAST\_INSERT\_ID()

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para instruções executadas fora do corpo desses tipos de objetos (veja a Seção 12.15, “Funções de Informação”). O efeito de uma rotina armazenada ou de um gatilho sobre o valor de `LAST_INSERT_ID()` que é observado ao seguir instruções depende do tipo de rotina:

- Se um procedimento armazenado executar instruções que alterem o valor de `LAST_INSERT_ID()`, o valor alterado será visto por instruções que seguem a chamada do procedimento.

- Para funções e gatilhos armazenados que alteram o valor, o valor é restaurado quando a função ou o gatilho termina, então as instruções seguintes não veem um valor alterado.
