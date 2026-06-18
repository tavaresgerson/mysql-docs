#### 16.4.1.8 Replicação de CURRENT_USER()

As seguintes instruções suportam o uso da função `CURRENT_USER()` para substituir o nome e, possivelmente, o host, de um *user* afetado ou de um *definer*:

* `DROP USER`
* `RENAME USER`
* `GRANT`
* `REVOKE`
* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE TRIGGER`
* `CREATE EVENT`
* `CREATE VIEW`
* `ALTER EVENT`
* `ALTER VIEW`
* `SET PASSWORD`

Quando o *binary logging* está habilitado e `CURRENT_USER()` ou `CURRENT_USER` é usado como o *definer* em qualquer uma dessas instruções, o MySQL Server garante que a instrução seja aplicada ao mesmo *user* tanto na *source* quanto na *replica* quando a instrução é replicada. Em alguns casos, como instruções que alteram senhas, a referência da função é expandida antes de ser gravada no *binary log*, de modo que a instrução inclua o nome do *user*. Para todos os outros casos, o nome do *user* atual na *source* é replicado para a *replica* como *metadata*, e a *replica* aplica a instrução ao *user* atual nomeado na *metadata*, em vez de ao *user* atual na *replica*.