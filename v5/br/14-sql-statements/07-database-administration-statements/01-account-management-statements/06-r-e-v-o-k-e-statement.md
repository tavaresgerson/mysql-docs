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

A declaração [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") permite que administradores de sistema revoguem privilégios de contas MySQL.

Para detalhes sobre os níveis em que os privilégios existem, os valores permitidos para *`priv_type`*, *`priv_level`* e *`object_type`*, e a sintaxe para especificar usuários e senhas, consulte [Seção 13.7.1.4, “Declaração GRANT”](grant.html "13.7.1.4 GRANT Statement").

Quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) está habilitada, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") exige o privilégio [`SUPER`](privileges-provided.html#priv_super) além de quaisquer outros privilégios requeridos descritos na discussão a seguir.

Cada nome de conta usa o formato descrito na [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Specifying Account Names"). Por exemplo:

```sql
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
```

A parte do nome do Host (host name) da conta, se omitida, assume o padrão `'%'`.

Para usar a primeira sintaxe de [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), você deve ter o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option) e deve ter os privilégios que você está revogando.

Para revogar todos os privilégios, use a segunda sintaxe, que remove todos os privilégios globais, de Database, de table, de column e de rotina para o usuário ou usuários nomeados:

```sql
REVOKE ALL PRIVILEGES, GRANT OPTION FROM user [, user] ...
```

Para usar esta sintaxe de [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), você deve ter o privilégio global [`CREATE USER`](privileges-provided.html#priv_create-user), ou o privilégio [`UPDATE`](privileges-provided.html#priv_update) para o system Database `mysql`.

As contas de usuário das quais os privilégios serão revogados devem existir, mas os privilégios a serem revogados não precisam estar atualmente concedidos a elas.

[`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") remove privilégios, mas não remove linhas da system table `mysql.user`. Para remover uma conta de usuário inteiramente, use [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"). Consulte [Seção 13.7.1.3, “Declaração DROP USER”](drop-user.html "13.7.1.3 DROP USER Statement").

Se as grant tables (tabelas de concessão) contiverem linhas de privilégio que possuem nomes de Database ou table com letras mistas (mixed-case) e a variável de sistema [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) estiver definida com um valor diferente de zero, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") não pode ser usado para revogar esses privilégios. É necessário manipular as grant tables diretamente. ([`GRANT`](grant.html "13.7.1.4 GRANT Statement") não cria tais linhas quando [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) está definida, mas essas linhas podem ter sido criadas antes de definir a variável.)

Quando executado com sucesso a partir do programa [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). Consulte [Seção 13.7.5.21, “Declaração SHOW GRANTS”](show-grants.html "13.7.5.21 SHOW GRANTS Statement").