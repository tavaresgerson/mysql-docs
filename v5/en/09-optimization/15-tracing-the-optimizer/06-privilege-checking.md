### 8.15.6 Verificação de Privilégios

Em cenários complexos nos quais a query utiliza views ou stored routines do tipo SQL SECURITY DEFINER, é possível que um user seja impedido de visualizar o trace de sua query por não possuir privileges adicionais sobre esses objects. Nesse caso, o trace será exibido como vazio e a column INSUFFICIENT_PRIVILEGES exibirá "1".