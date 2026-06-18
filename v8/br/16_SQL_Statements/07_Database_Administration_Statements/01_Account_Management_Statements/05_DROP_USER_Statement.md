#### 15.7.1.5 Declaração DROP USER

```
DROP USER [IF EXISTS] user [, user] ...
```

A declaração `DROP USER` remove uma ou mais contas do MySQL e seus privilégios. Ela remove as linhas de privilégio para a conta de todas as tabelas de concessão.

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser removidos.

Para usar `DROP USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `DELETE` para o esquema de sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `DROP USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

A partir do MySQL 8.0.22, `DROP USER` falha com um erro se qualquer conta a ser excluída tiver o nome como o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a instrução falha se a exclusão de uma conta causar que um objeto armazenado se torne órfão.) Para realizar a operação de qualquer forma, você deve ter o privilégio `SET_USER_ID`; nesse caso, a instrução tem sucesso com um aviso em vez de falhar com um erro. Para obter informações adicionais, incluindo como identificar quais objetos nomeiam uma conta específica como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

`DROP USER` ou tem sucesso para todos os usuários nomeados ou desfaz e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar excluir um usuário que não existe. Se a cláusula `IF EXISTS` for fornecida, a instrução produz um aviso para cada usuário nomeado que não existe, em vez de um erro.

A declaração é escrita no log binário se ela for bem-sucedida, mas não se ela falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. Uma declaração escrita no log binário inclui todos os usuários nomeados. Se a cláusula `IF EXISTS` for fornecida, isso inclui até mesmo usuários que não existem e não foram excluídos.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
DROP USER 'jeffrey'@'localhost';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'`.

Importante

`DROP USER` não fecha automaticamente nenhuma sessão de usuário aberta. Em vez disso, no caso de um usuário com uma sessão aberta ser descartado, a declaração não entra em vigor até que a sessão desse usuário seja fechada. Uma vez que a sessão é fechada, o usuário é descartado e a próxima tentativa desse usuário de fazer login falha. *Isso é por design*.

`DROP USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais os nomes dos usuários excluídos são indicados pelo atributo `DEFINER`. Tentativas de acessar tais objetos podem produzir um erro se forem executados em um contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 27.6, “Controle de Acesso a Objetos Armazenados”.)
