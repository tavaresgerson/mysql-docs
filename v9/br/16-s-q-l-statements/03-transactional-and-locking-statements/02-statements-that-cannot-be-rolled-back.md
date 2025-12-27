### 15.3.2 Declarações que não podem ser revertidas

Algumas declarações não podem ser revertidas. Em geral, isso inclui declarações de linguagem de definição de dados (DDL), como aquelas que criam ou excluem bancos de dados, aquelas que criam, excluem ou alteram tabelas ou rotinas armazenadas.

Você deve projetar suas transações para não incluir tais declarações. Se você emitir uma declaração no início de uma transação que não pode ser revertida e, em seguida, outra declaração falhar mais tarde, o efeito completo da transação não pode ser revertido nesses casos ao emitir uma declaração `ROLLBACK`.