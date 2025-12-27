#### 15.7.1.5 Declaração `DROP USER`

```
DROP USER [IF EXISTS] user [, user] ...
```

A declaração `DROP USER` remove uma ou mais contas do MySQL e seus privilégios. Ela remove as linhas de privilégio para a conta de todas as tabelas de concessão.

Papéis nomeados no valor da variável de sistema `mandatory_roles` não podem ser removidos.

Para usar `DROP USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `DELETE` para o esquema de sistema `mysql`. Quando a variável de sistema `read_only` está habilitada, `DROP USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

`DROP USER` falha com um erro se alguma conta a ser removida for nomeada como o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a declaração falha se a remoção de uma conta causar que um objeto armazenado se torne órfão.) Para realizar a operação de qualquer maneira, você deve ter o privilégio `SET_ANY_DEFINER` ou `ALLOW_NONEXISTENT_DEFINER`; nesse caso, a declaração tem sucesso com um aviso em vez de falhar com um erro. Para obter informações adicionais, incluindo como identificar quais objetos nomeiam uma conta dada como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

`DROP USER` tem sucesso para todos os usuários nomeados ou é revertido e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar remover um usuário que não existe. Se a cláusula `IF EXISTS` for fornecida, a declaração produz um aviso para cada usuário nomeado que não existe, em vez de um erro.

A declaração é escrita no log binário se tiver sucesso, mas não se falhar; nesse caso, ocorre um rollback e nenhuma mudança é feita. Uma declaração escrita no log binário inclui todos os usuários nomeados. Se a cláusula `IF EXISTS` for fornecida, isso inclui até mesmo usuários que não existem e não foram removidos.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
DROP USER 'jeffrey'@'localhost';
```

A parte do nome de conta que contém o nome do host, se omitida, tem como padrão `'%'`.

Importante

O comando `DROP USER` não fecha automaticamente nenhuma sessão de usuário aberta. Em vez disso, caso um usuário com uma sessão aberta seja excluído, a instrução não terá efeito até que a sessão do usuário seja fechada. Uma vez que a sessão seja fechada, o usuário é excluído e a próxima tentativa de login desse usuário falha. *Isso é por design*.

O comando `DROP USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais o atributo `DEFINER` nomeia o usuário excluído. Tentativas de acessar tais objetos podem produzir um erro se forem executados no contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 27.8, “Controle de Acesso a Objetos Armazenados”.)