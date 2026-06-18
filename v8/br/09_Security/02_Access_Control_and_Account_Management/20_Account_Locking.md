### 8.2.20 Bloqueio da conta

O MySQL suporta o bloqueio e desbloqueio de contas de usuário usando as cláusulas `ACCOUNT LOCK` e `ACCOUNT UNLOCK` para as instruções `CREATE USER` e `ALTER USER`:

- Quando usados com `CREATE USER`, essas cláusulas especificam o estado de bloqueio inicial para uma nova conta. Na ausência de qualquer cláusula, a conta é criada em um estado não bloqueado.

  Se o componente `validate_password` estiver ativado, a criação de uma conta sem senha não é permitida, mesmo que a conta esteja bloqueada. Veja a Seção 8.4.3, “O Componente de Validação de Senha”.

- Quando usado com `ALTER USER`, essas cláusulas especificam o novo estado de bloqueio para uma conta existente. Na ausência de qualquer cláusula, o estado de bloqueio da conta permanece inalterado.

  A partir do MySQL 8.0.19, `ALTER USER ... UNLOCK` desbloqueia qualquer conta nomeada pelo comando que esteja temporariamente bloqueada devido a muitos tentativas de login malsucedidas. Veja a Seção 8.2.15, “Gerenciamento de Senhas”.

O estado de bloqueio da conta é registrado na coluna `account_locked` da tabela do sistema `mysql.user`. A saída de `SHOW CREATE USER` indica se uma conta está bloqueada ou desbloqueada.

Se um cliente tentar se conectar a uma conta bloqueada, a tentativa falha. O servidor incrementa a variável de status `Locked_connects` que indica o número de tentativas de conexão a uma conta bloqueada, retorna um erro `ER_ACCOUNT_HAS_BEEN_LOCKED` e escreve uma mensagem no log de erro:

```
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

Bloquear uma conta não afeta a capacidade de se conectar usando um usuário proxy que assume a identidade da conta bloqueada. Também não afeta a capacidade de executar programas ou visualizações armazenadas que tenham um atributo `DEFINER` que nomeia a conta bloqueada. Ou seja, a capacidade de usar uma conta proxy ou programas ou visualizações armazenadas não é afetada pelo bloqueio da conta.

A capacidade de bloqueio de contas depende da presença da coluna `account_locked` na tabela de sistema `mysql.user`. Para atualizações a partir de versões do MySQL mais antigas que 5.7.6, execute o procedimento de atualização do MySQL para garantir que essa coluna exista. Consulte o Capítulo 3, *Atualizando o MySQL*. Para instalações não atualizadas que não possuem a coluna `account_locked`, o servidor trata todas as contas como desbloqueadas, e o uso das cláusulas `ACCOUNT LOCK` ou `ACCOUNT UNLOCK` produz um erro.
