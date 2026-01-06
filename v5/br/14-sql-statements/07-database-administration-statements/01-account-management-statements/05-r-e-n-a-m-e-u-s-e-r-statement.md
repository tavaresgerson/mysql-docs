#### 13.7.1.5 Declaração de RENOMEAR USUÁRIO

```sql
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A instrução `RENAME USER` renomeia contas MySQL existentes. Um erro ocorre para contas antigas que não existem ou novas contas que já existem.

Para usar `RENAME USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `RENAME USER` também requer o privilégio `SUPER`.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'.`

`RENAME USER` faz com que os privilégios do usuário antigo sejam os do novo usuário. No entanto, `RENAME USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais o atributo `DEFINER` nomeia o usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se forem executados no contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte Seção 23.6, “Controle de Acesso a Objetos Armazenados”.)

As alterações de privilégio entram em vigor conforme indicado em Seção 6.2.9, “Quando as Alterações de Privilégio Entram em Vigor”.
