#### 13.7.1.5 Declaração RENAME USER

```sql
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A declaração `RENAME USER` renomeia contas MySQL existentes. Ocorre um erro para contas antigas que não existem ou para contas novas que já existem.

Para usar `RENAME USER`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `UPDATE` para o Database de sistema `mysql`. Quando a variável de sistema `read_only` estiver ativada, `RENAME USER` requer adicionalmente o privilégio `SUPER`.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificando Nomes de Conta”. Por exemplo:

```sql
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome do Host do nome da conta, se omitida, assume o padrão `'%'`.

`RENAME USER` faz com que os privilégios detidos pelo usuário antigo sejam os mesmos detidos pelo novo usuário. No entanto, `RENAME USER` não descarta ou invalida automaticamente Databases ou objetos dentro deles que o usuário antigo criou. Isso inclui Stored Programs ou Views para os quais o atributo `DEFINER` nomeia o usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se eles forem executados no contexto de segurança do definer. (Para informações sobre o contexto de segurança, consulte a Seção 23.6, “Controle de Acesso de Objetos Armazenados”.)

As alterações de privilégio entram em vigor conforme indicado na Seção 6.2.9, “Quando as Alterações de Privilégio Entram em Vigor”.