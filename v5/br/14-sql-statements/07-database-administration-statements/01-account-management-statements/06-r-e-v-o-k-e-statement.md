#### 13.7.1.6 Declaração de REVOGAÇÃO

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

A declaração `REVOKE` permite que os administradores do sistema revoguem privilégios de contas do MySQL.

Para obter detalhes sobre os níveis em que os privilégios existem, os valores permitidos de *`priv_type`*, *`priv_level`* e *`object_type`* e a sintaxe para especificar usuários e senhas, consulte Seção 13.7.1.4, “Instrução GRANT”.

Quando a variável de sistema `read_only` está habilitada, o comando `REVOKE` exige o privilégio `SUPER`, além de quaisquer outros privilégios necessários descritos na discussão a seguir.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'.`

Para usar a sintaxe de primeira remoção `REVOKE`, você deve ter o privilégio `GRANT OPTION` e você deve ter os privilégios que está removendo.

Para revogar todos os privilégios, use a segunda sintaxe, que exclui todos os privilégios globais, de banco de dados, de tabela, de coluna e de rotina para o(s) usuário(s) nomeado(s):

```sql
REVOKE ALL PRIVILEGES, GRANT OPTION FROM user [, user] ...
```

Para usar essa sintaxe de `REVOKE`, você deve ter o privilégio global de `CREATE USER` ou o privilégio de `UPDATE` para o banco de dados do sistema `mysql`.

As contas de usuários das quais os privilégios devem ser revogados devem existir, mas os privilégios que devem ser revogados não precisam ser concedidos atualmente a eles.

`REVOKE` remove privilégios, mas não remove linhas da tabela `mysql.user` do sistema. Para remover uma conta de usuário completamente, use `DROP USER`. Veja Seção 13.7.1.3, “Instrução DROP USER”.

Se as tabelas de concessão contiverem linhas de privilégio que contenham nomes de banco de dados ou tabelas com maiúsculas e minúsculas misturadas e a variável de sistema `lower_case_table_names` estiver definida para um valor diferente de zero, a opção `REVOKE` não pode ser usada para revogar esses privilégios. É necessário manipular as tabelas de concessão diretamente. (`GRANT` não cria essas linhas quando a variável `lower_case_table_names` está definida, mas essas linhas podem ter sido criadas antes de definir a variável.)

Quando executado com sucesso a partir do programa **mysql**, o comando `REVOKE` responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use o comando `SHOW GRANTS`. Consulte Seção 13.7.5.21, “Instrução SHOW GRANTS”.
