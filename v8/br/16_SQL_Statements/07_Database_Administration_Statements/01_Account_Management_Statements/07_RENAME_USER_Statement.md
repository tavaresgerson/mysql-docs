#### 15.7.1.7 Declaração de RENOMEAR USUÁRIO

```
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A declaração `RENAME USER` renomeia contas existentes do MySQL. Um erro ocorre para contas antigas que não existem ou para novas contas que já existem.

Para usar `RENAME USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o esquema de sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `RENAME USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

A partir do MySQL 8.0.22, `RENAME USER` falha com um erro se qualquer conta a ser renomeada tiver o nome como o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a instrução falha se o renomear uma conta causar que um objeto armazenado se torne órfão.) Para realizar a operação de qualquer forma, você deve ter o privilégio `SET_USER_ID`; nesse caso, a instrução tem sucesso com um aviso em vez de falhar com um erro. Para obter informações adicionais, incluindo como identificar quais objetos nomeiam uma conta específica como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'`.

`RENAME USER` faz com que os privilégios do usuário antigo sejam os do novo usuário. No entanto, `RENAME USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais os nomes dos atributos `DEFINER` são do usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se forem executados em um contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 27.6, “Controle de Acesso a Objetos Armazenados”.)

As alterações de privilégio entram em vigor conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilégio Entram em Vigor”.
