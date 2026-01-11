#### 30.4.4.25 The revoke\_schema\_privileges\_from\_all\_accounts\_except() Procedure

Revoke specified privileges for all users except those specified with the exclude\_users argument.

##### Parameters

* `in_schema_name`: (CHAR(255)) Schema name on which the privileges are revoked.

* `in_privileges`: (JSON) Privileges to revoke. Privileges are case-insensitive.

* `in_exclude_users`: (JSON) Do not exclude privileges from these users. The host part of the user is case-insensitive.

##### Example

```
            mysql> CALL sys.revoke_schema_privileges_from_all_accounts_except(
                  "my_schema",
                  JSON_ARRAY("SELECT", "INSERT"),
                  JSON_ARRAY("'root'@'localhost'"));
```
