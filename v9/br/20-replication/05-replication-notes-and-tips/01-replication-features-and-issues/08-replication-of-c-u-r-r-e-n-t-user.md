#### 19.5.1.8 Replicação de CURRENT_USER()

As seguintes instruções suportam o uso da função `CURRENT_USER()` para substituir o nome e, possivelmente, o host de um usuário afetado ou de um definidor:

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

Quando o registro binário está habilitado e `CURRENT_USER()` ou `CURRENT_USER` é usado como definidor em qualquer uma dessas instruções, o MySQL Server garante que a instrução seja aplicada ao mesmo usuário tanto na fonte quanto na replica quando a instrução é replicada. Em alguns casos, como instruções que alteram senhas, a referência à função é expandida antes de ser escrita no log binário, para que a instrução inclua o nome do usuário. Para todos os outros casos, o nome do usuário atual na fonte é replicado para a replica como metadados, e a replica aplica a instrução ao usuário atual nomeado nos metadados, em vez do usuário atual na replica.