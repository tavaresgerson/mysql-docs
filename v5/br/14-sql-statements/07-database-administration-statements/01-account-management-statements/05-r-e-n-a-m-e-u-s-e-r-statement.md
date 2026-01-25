#### 13.7.1.5 Declaração RENAME USER

```sql
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A declaração [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") renomeia contas MySQL existentes. Ocorre um erro para contas antigas que não existem ou para contas novas que já existem.

Para usar [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement"), você deve ter o privilégio global [`CREATE USER`](privileges-provided.html#priv_create-user), ou o privilégio [`UPDATE`](privileges-provided.html#priv_update) para o Database de sistema `mysql`. Quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) estiver ativada, [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") requer adicionalmente o privilégio [`SUPER`](privileges-provided.html#priv_super).

Cada nome de conta usa o formato descrito na [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Specifying Account Names"). Por exemplo:

```sql
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome do Host do nome da conta, se omitida, assume o padrão `'%'`.

[`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") faz com que os privilégios detidos pelo usuário antigo sejam os mesmos detidos pelo novo usuário. No entanto, [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") não descarta ou invalida automaticamente Databases ou objetos dentro deles que o usuário antigo criou. Isso inclui Stored Programs ou Views para os quais o atributo `DEFINER` nomeia o usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se eles forem executados no contexto de segurança do definer. (Para informações sobre o contexto de segurança, consulte a [Seção 23.6, “Controle de Acesso de Objetos Armazenados”](stored-objects-security.html "23.6 Stored Object Access Control").)

As alterações de privilégio entram em vigor conforme indicado na [Seção 6.2.9, “Quando as Alterações de Privilégio Entram em Vigor”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").