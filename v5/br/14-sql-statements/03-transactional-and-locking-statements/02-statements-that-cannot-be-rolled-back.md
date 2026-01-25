### 13.3.2 Instruções Que Não Podem Ser Desfeitas

Algumas instruções não podem ser desfeitas (rolled back). Em geral, estas incluem instruções da linguagem de definição de dados (DDL), como aquelas que criam ou descartam Databases, aquelas que criam, descartam ou alteram Tables ou rotinas armazenadas.

Você deve projetar suas transações para não incluir tais instruções. Se você emitir uma instrução no início de uma transação que não pode ser desfeita, e então uma instrução posterior falhar, o efeito total da transação não poderá ser desfeito nesses casos pela emissão de uma instrução [`ROLLBACK`](commit.html "13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK").