### 23.2.4 Stored Procedures, Functions, Triggers, e LAST_INSERT_ID()

Dentro do corpo de uma rotina armazenada (procedure ou function) ou de um trigger, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para comandos executados fora do corpo desses tipos de objetos (veja Seção 12.15, “Information Functions”). O efeito de uma rotina armazenada ou trigger sobre o valor de `LAST_INSERT_ID()` que é visto pelos comandos subsequentes depende do tipo de rotina:

* Se uma stored procedure executa comandos que alteram o valor de `LAST_INSERT_ID()`, o valor alterado é visto pelos comandos que seguem a chamada da procedure.

* Para stored functions e triggers que alteram o valor, o valor é restaurado quando a function ou trigger termina, de modo que os comandos subsequentes não vejam um valor alterado.