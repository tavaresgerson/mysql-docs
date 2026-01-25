#### 16.4.1.8 Replicação de CURRENT_USER()

As seguintes instruções suportam o uso da função [`CURRENT_USER()`](information-functions.html#function_current-user) para substituir o nome e, possivelmente, o host, de um *user* afetado ou de um *definer*:

* [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement")
* [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement")
* [`GRANT`](grant.html "13.7.1.4 GRANT Statement")
* [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement")
* [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement")
* [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements")
* [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement")
* [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement")
* [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement")
* [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement")
* [`ALTER VIEW`](alter-view.html "13.1.10 ALTER VIEW Statement")
* [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement")

Quando o *binary logging* está habilitado e [`CURRENT_USER()`](information-functions.html#function_current-user) ou [`CURRENT_USER`](information-functions.html#function_current-user) é usado como o *definer* em qualquer uma dessas instruções, o MySQL Server garante que a instrução seja aplicada ao mesmo *user* tanto na *source* quanto na *replica* quando a instrução é replicada. Em alguns casos, como instruções que alteram senhas, a referência da função é expandida antes de ser gravada no *binary log*, de modo que a instrução inclua o nome do *user*. Para todos os outros casos, o nome do *user* atual na *source* é replicado para a *replica* como *metadata*, e a *replica* aplica a instrução ao *user* atual nomeado na *metadata*, em vez de ao *user* atual na *replica*.