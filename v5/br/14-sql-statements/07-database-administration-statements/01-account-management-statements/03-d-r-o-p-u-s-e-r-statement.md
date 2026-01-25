#### 13.7.1.3 Declaração DROP USER

```sql
DROP USER [IF EXISTS] user [, user] ...
```

A declaração [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") remove uma ou mais contas MySQL e seus privilégios. Ela remove as linhas de privilégio da conta de todas as *grant tables*.

Para usar [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), você deve ter o privilégio global [`CREATE USER`](privileges-provided.html#priv_create-user), ou o privilégio [`DELETE`](privileges-provided.html#priv_delete) para o *system database* `mysql`. Quando a *system variable* [`read_only`](server-system-variables.html#sysvar_read_only) estiver habilitada, [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") requer adicionalmente o privilégio [`SUPER`](privileges-provided.html#priv_super).

Ocorre um erro se você tentar dropar uma conta que não existe. Se a cláusula `IF EXISTS` for fornecida, a declaração produz um *warning* para cada usuário nomeado que não existe, em vez de um erro.

Cada nome de conta usa o formato descrito na [Seção 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). Por exemplo:

```sql
DROP USER 'jeffrey'@'localhost';
```

A parte do *host name* do nome da conta, se omitida, assume o padrão `'%'`.

Importante

[`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") não fecha automaticamente nenhuma *session* de usuário aberta. Em vez disso, no caso de um usuário com uma *session* aberta ser dropado, a declaração não entra em vigor até que a *session* desse usuário seja fechada. Uma vez que a *session* é fechada, o usuário é dropado, e a próxima tentativa desse usuário de realizar o *log in* falha. *Isto é por design*.

[`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") não *dropa* ou invalida automaticamente *databases* ou *objects* dentro deles que o usuário antigo criou. Isso inclui *stored programs* ou *views* para os quais o atributo `DEFINER` nomeia o usuário dropado. Tentativas de acesso a tais *objects* podem produzir um erro se eles forem executados no *definer security context*. (Para obter informações sobre *security context*, consulte a [Seção 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").)