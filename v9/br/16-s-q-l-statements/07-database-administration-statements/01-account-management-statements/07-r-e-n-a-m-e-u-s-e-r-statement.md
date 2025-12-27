#### 15.7.1.7 Declaração de RENOMEAR USUÁRIO

```
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A declaração `RENOMEAR USUÁRIO` renomeia contas existentes do MySQL. Um erro ocorre para contas antigas que não existem ou para novas contas que já existem.

Para usar `RENOMEAR USUÁRIO`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o esquema do sistema `mysql`. Quando a variável de sistema `read_only` está habilitada, `RENOMEAR USUÁRIO` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

`RENOMEAR USUÁRIO` falha com um erro se qualquer conta a ser renomeada tiver o nome como o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a declaração falha se renomear uma conta causaria que um objeto armazenado se tornasse órfão.) Para realizar a operação de qualquer forma, você deve ter o privilégio `SET_ANY_DEFINER` ou `ALLOW_NONEXISTENT_DEFINER`; nesse caso, a declaração tem sucesso com um aviso em vez de falhar com um erro. Para informações adicionais, incluindo como identificar quais objetos nomeiam uma conta dada como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome de conta que contém o nome do host, se omitida, tem como padrão `'%'`.

`RENOMEAR USUÁRIO` faz com que os privilégios mantidos pelo usuário antigo sejam os mantidos pelo novo usuário. No entanto, `RENOMEAR USUÁRIO` não descarta ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais o atributo `DEFINER` nomeia o usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se forem executados no contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 27.8, “Controle de Acesso a Objetos Armazenados”.)

As alterações de privilégio entram em vigor conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilégio Entram em Vigor”.