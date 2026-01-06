### 13.3.2 Declarações que não podem ser desfeitas

Algumas declarações não podem ser desfeitas. Em geral, isso inclui declarações de linguagem de definição de dados (DDL), como aquelas que criam ou excluem bancos de dados, aquelas que criam, excluem ou alteram tabelas ou rotinas armazenadas.

Você deve projetar suas transações para não incluir tais declarações. Se você emitir uma declaração no início de uma transação que não pode ser revertida, e depois outra declaração falhar mais tarde, o efeito total da transação não pode ser revertido nesses casos ao emitir uma declaração `ROLLBACK`.
