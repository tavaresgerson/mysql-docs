### 6.2.15 Bloqueio da Conta

O MySQL suporta o bloqueio e desbloqueio de contas de usuário usando as cláusulas `ACCOUNT LOCK` e `ACCOUNT UNLOCK` para as instruções `CREATE USER` e `ALTER USER`:

- Quando usadas com `CREATE USER`, essas cláusulas especificam o estado de bloqueio inicial para uma nova conta. Na ausência de qualquer cláusula, a conta é criada em um estado não bloqueado.

  Se o plugin `validate_password` estiver ativado, ele não permite a criação de uma conta sem senha, mesmo que a conta esteja bloqueada. Veja Seção 6.4.3, “O Plugin de Validação de Senha”.

- Quando usadas com `ALTER USER`, essas cláusulas especificam o novo estado de bloqueio para uma conta existente. Na ausência de qualquer cláusula, o estado de bloqueio da conta permanece inalterado.

O estado de bloqueio da conta é registrado na coluna `account_locked` da tabela `mysql.user` do sistema. A saída do `SHOW CREATE USER` indica se uma conta está bloqueada ou desbloqueada.

Se um cliente tentar se conectar a uma conta bloqueada, a tentativa falha. O servidor incrementa a variável de status `Locked_connects`, que indica o número de tentativas de conexão a uma conta bloqueada, retorna um erro `ER_ACCOUNT_HAS_BEEN_LOCKED` e escreve uma mensagem no log de erro:

```sql
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

Bloquear uma conta não afeta a capacidade de se conectar usando um usuário proxy que assume a identidade da conta bloqueada. Também não afeta a capacidade de executar programas ou visualizações armazenadas que tenham um atributo `DEFINER` que nomeia a conta bloqueada. Ou seja, a capacidade de usar uma conta proxy ou programas ou visualizações armazenadas não é afetada pelo bloqueio da conta.

A capacidade de bloquear contas depende da presença da coluna `account_locked` na tabela `mysql.user` do sistema. Para atualizações a partir de versões do MySQL mais antigas que 5.7.6, execute o procedimento de atualização do MySQL para garantir que essa coluna exista. Consulte Seção 2.10, “Atualizando o MySQL”. Para instalações não atualizadas que não possuem a coluna `account_locked`, o servidor trata todas as contas como desbloqueadas, e o uso das cláusulas `ACCOUNT LOCK` ou `ACCOUNT UNLOCK` produz um erro.
