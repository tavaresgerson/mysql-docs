#### 16.4.1.8 Replicação de CURRENT\_USER()

As seguintes declarações apoiam o uso da função `CURRENT_USER()` para substituir o nome e, possivelmente, o endereço do host de um usuário afetado ou de um definidor:

- `DROP USER`
- `RENOMEAR USUÁRIO`
- `CONCEDER`
- `REVOGAR`
- `Crie função`
- `CREATE PROCEDURE`
- `CREATE TRIGGER`
- `Crie evento`
- `CREATE VIEW`
- `ALTERAR EVENTO`
- `ALTERAR VISTA`
- `SET PASSWORD`

Quando o registro binário está habilitado e `CURRENT_USER()` ou `CURRENT_USER` é usado como o definidor em qualquer uma dessas declarações, o MySQL Server garante que a declaração seja aplicada ao mesmo usuário tanto na fonte quanto na replica quando a declaração for replicada. Em alguns casos, como declarações que alteram senhas, a referência da função é expandida antes de ser escrita no log binário, para que a declaração inclua o nome do usuário. Para todos os outros casos, o nome do usuário atual na fonte é replicado para a replica como metadados, e a replica aplica a declaração ao usuário atual nomeado nos metadados, em vez do usuário atual na replica.
