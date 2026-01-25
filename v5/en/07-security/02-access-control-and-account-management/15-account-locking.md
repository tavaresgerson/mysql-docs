### 6.2.15 Bloqueio de Contas

O MySQL suporta o Lock e Unlock de contas de usuário usando as cláusulas `ACCOUNT LOCK` e `ACCOUNT UNLOCK` para as instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"):

* Quando usadas com [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), essas cláusulas especificam o estado inicial de Lock para uma nova conta. Na ausência de qualquer uma das cláusulas, a conta é criada em um estado de Unlock.

  Se o plugin `validate_password` estiver habilitado, ele não permitirá a criação de uma conta sem uma password, mesmo que a conta esteja em Lock. Consulte [Seção 6.4.3, “O Plugin de Validação de Password”](validate-password.html "6.4.3 The Password Validation Plugin").

* Quando usadas com [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), essas cláusulas especificam o novo estado de Lock para uma conta existente. Na ausência de qualquer uma das cláusulas, o estado de Lock da conta permanece inalterado.

O estado de Lock da conta é registrado na coluna `account_locked` da tabela de sistema `mysql.user`. A saída de [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement") indica se uma conta está em Lock ou Unlock.

Se um cliente tentar se conectar a uma conta em Lock, a tentativa falhará. O servidor incrementa a variável de status [`Locked_connects`](server-status-variables.html#statvar_Locked_connects), que indica o número de tentativas de conexão a uma conta em Lock, retorna um erro [`ER_ACCOUNT_HAS_BEEN_LOCKED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_account_has_been_locked), e escreve uma mensagem no error log:

```sql
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

O Lock de uma conta não afeta a possibilidade de conexão usando um proxy user que assume a identidade da conta em Lock. Também não afeta a capacidade de executar stored programs ou views que possuam um atributo `DEFINER` nomeando a conta em Lock. Ou seja, a capacidade de usar uma conta por proxy ou stored programs ou views não é afetada pelo Lock da conta.

A capacidade de Lock de contas depende da presença da coluna `account_locked` na tabela de sistema `mysql.user`. Para upgrades de versões do MySQL anteriores à 5.7.6, execute o procedimento de upgrade do MySQL para garantir que esta coluna exista. Consulte [Seção 2.10, “Atualizando MySQL”](upgrading.html "2.10 Upgrading MySQL"). Para instalações não atualizadas que não possuem a coluna `account_locked`, o servidor trata todas as contas como Unlock, e o uso das cláusulas `ACCOUNT LOCK` ou `ACCOUNT UNLOCK` produz um erro.