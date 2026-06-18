#### 13.7.1.6 Declaração REVOKE

```sql
REVOKE
    priv_type [(column_list)]
      [, priv_type [(column_list) ...
    ON [object_type] priv_level
    FROM user [, user] ...

REVOKE ALL [PRIVILEGES], GRANT OPTION
    FROM user [, user] ...

REVOKE PROXY ON user
    FROM user [, user] ...
```

A declaração `REVOKE` permite que administradores de sistema revoguem privilégios de contas MySQL.

Para detalhes sobre os níveis em que os privilégios existem, os valores permitidos para *`priv_type`*, *`priv_level`* e *`object_type`*, e a sintaxe para especificar usuários e senhas, consulte Seção 13.7.1.4, “Declaração GRANT”.

Quando a variável de sistema `read_only` está habilitada, `REVOKE` exige o privilégio `SUPER` além de quaisquer outros privilégios requeridos descritos na discussão a seguir.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificando Nomes de Conta”. Por exemplo:

```sql
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
```

A parte do nome do Host (host name) da conta, se omitida, assume o padrão `'%'`.

Para usar a primeira sintaxe de `REVOKE`, você deve ter o privilégio `GRANT OPTION` e deve ter os privilégios que você está revogando.

Para revogar todos os privilégios, use a segunda sintaxe, que remove todos os privilégios globais, de Database, de table, de column e de rotina para o usuário ou usuários nomeados:

```sql
REVOKE ALL PRIVILEGES, GRANT OPTION FROM user [, user] ...
```

Para usar esta sintaxe de `REVOKE`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `UPDATE` para o system Database `mysql`.

As contas de usuário das quais os privilégios serão revogados devem existir, mas os privilégios a serem revogados não precisam estar atualmente concedidos a elas.

`REVOKE` remove privilégios, mas não remove linhas da system table `mysql.user`. Para remover uma conta de usuário inteiramente, use `DROP USER`. Consulte Seção 13.7.1.3, “Declaração DROP USER”.

Se as grant tables (tabelas de concessão) contiverem linhas de privilégio que possuem nomes de Database ou table com letras mistas (mixed-case) e a variável de sistema `lower_case_table_names` estiver definida com um valor diferente de zero, `REVOKE` não pode ser usado para revogar esses privilégios. É necessário manipular as grant tables diretamente. (`GRANT` não cria tais linhas quando `lower_case_table_names` está definida, mas essas linhas podem ter sido criadas antes de definir a variável.)

Quando executado com sucesso a partir do programa **mysql**, `REVOKE` responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use `SHOW GRANTS`. Consulte Seção 13.7.5.21, “Declaração SHOW GRANTS”.