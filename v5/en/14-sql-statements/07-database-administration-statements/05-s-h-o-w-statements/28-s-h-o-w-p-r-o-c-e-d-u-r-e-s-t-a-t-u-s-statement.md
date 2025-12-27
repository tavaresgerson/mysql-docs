#### 13.7.5.28 SHOW PROCEDURE STATUS Statement

```sql
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

This statement is a MySQL extension. It returns characteristics of a stored procedure, such as the database, name, type, creator, creation and modification dates, and character set information. A similar statement, [`SHOW FUNCTION STATUS`](show-function-status.html "13.7.5.20 SHOW FUNCTION STATUS Statement"), displays information about stored functions (see [Section 13.7.5.20, “SHOW FUNCTION STATUS Statement”](show-function-status.html "13.7.5.20 SHOW FUNCTION STATUS Statement")).

To use either statement, you must be the owner of the routine or have [`SELECT`](select.html "13.2.9 SELECT Statement") access to the `mysql.proc` table.

The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which procedure or function names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

```sql
mysql> SHOW PROCEDURE STATUS LIKE 'sp1'\G
*************************** 1. row ***************************
                  Db: test
                Name: sp1
                Type: PROCEDURE
             Definer: testuser@localhost
            Modified: 2018-08-08 13:54:11
             Created: 2018-08-08 13:54:11
       Security_type: DEFINER
             Comment:
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci

mysql> SHOW FUNCTION STATUS LIKE 'hello'\G
*************************** 1. row ***************************
                  Db: test
                Name: hello
                Type: FUNCTION
             Definer: testuser@localhost
            Modified: 2020-03-10 11:09:33
             Created: 2020-03-10 11:09:33
       Security_type: DEFINER
             Comment:
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` is the session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the routine was created. `collation_connection` is the session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the routine was created. `Database Collation` is the collation of the database with which the routine is associated.

Stored routine information is also available from the `INFORMATION_SCHEMA` [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") and [`ROUTINES`](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table") tables. See [Section 24.3.15, “The INFORMATION\_SCHEMA PARAMETERS Table”](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table"), and [Section 24.3.21, “The INFORMATION\_SCHEMA ROUTINES Table”](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table").
