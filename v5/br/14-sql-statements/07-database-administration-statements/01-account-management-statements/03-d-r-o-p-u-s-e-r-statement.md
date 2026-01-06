#### 13.7.1.3 Declaração DROP USER

```sql
DROP USER [IF EXISTS] user [, user] ...
```

A instrução `DROP USER` remove uma ou mais contas do MySQL e seus privilégios. Ela remove as linhas de privilégio da conta de todas as tabelas de concessão.

Para usar `DROP USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `DELETE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `DROP USER` também requer o privilégio `SUPER`.

Um erro ocorre se você tentar excluir uma conta que não existe. Se a cláusula `IF EXISTS` for fornecida, a instrução gera um aviso para cada usuário nomeado que não existe, em vez de um erro.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
DROP USER 'jeffrey'@'localhost';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'.`

Importante

`DROP USER` não fecha automaticamente nenhuma sessão de usuário aberta. Em vez disso, no caso de um usuário com uma sessão aberta ser excluído, a declaração não entra em vigor até que a sessão do usuário seja fechada. Uma vez que a sessão é fechada, o usuário é excluído e a próxima tentativa do usuário de fazer login falha. *Isso é por design*.

`DROP USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais o atributo `DEFINER` nomeia o usuário excluído. Tentativas de acessar tais objetos podem produzir um erro se eles forem executados no contexto de segurança do definidor. (Para informações sobre o contexto de segurança, consulte Seção 23.6, “Controle de Acesso a Objetos Armazenados”.)
