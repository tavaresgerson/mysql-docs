#### 30.4.4.25 O procedimento revoke_schema_privileges_from_all_accounts_except()

Revocar privilégios especificados para todos os usuários, exceto aqueles especificados com o argumento exclude_users.

##### Parâmetros

* `in_schema_name`: (CHAR(255)) Nome do esquema no qual os privilégios são revogados.

* `in_privileges`: (JSON) Privilegios a serem revogados. Os privilégios são case-insensitive.

* `in_exclude_users`: (JSON) Não excluir privilégios desses usuários. A parte do host do usuário é case-insensitive.

##### Exemplo

```
            mysql> CALL sys.revoke_schema_privileges_from_all_accounts_except(
                  "my_schema",
                  JSON_ARRAY("SELECT", "INSERT"),
                  JSON_ARRAY("'root'@'localhost'"));
```