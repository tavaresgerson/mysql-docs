#### 13.7.5.28 Instrução SHOW PROCEDURE STATUS

```sql
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta instrução é uma extensão MySQL. Ela retorna características de uma stored procedure, como o Database, nome, tipo, criador, datas de criação e modificação e informações de character set. Uma instrução semelhante, [`SHOW FUNCTION STATUS`](show-function-status.html "13.7.5.20 SHOW FUNCTION STATUS Statement"), exibe informações sobre stored functions (consulte [Seção 13.7.5.20, “SHOW FUNCTION STATUS Statement”](show-function-status.html "13.7.5.20 SHOW FUNCTION STATUS Statement")).

Para usar qualquer uma das instruções, você deve ser o proprietário da routine ou ter acesso [`SELECT`](select.html "13.2.9 SELECT Statement") à tabela `mysql.proc`.

A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de procedure ou function devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em [Seção 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

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

`character_set_client` é o valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando a routine foi criada. `collation_connection` é o valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando a routine foi criada. `Database Collation` é o collation do Database ao qual a routine está associada.

Informações de Stored Routine também estão disponíveis nas tabelas [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") e [`ROUTINES`](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table") do `INFORMATION_SCHEMA`. Consulte [Seção 24.3.15, “The INFORMATION_SCHEMA PARAMETERS Table”](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") e [Seção 24.3.21, “The INFORMATION_SCHEMA ROUTINES Table”](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table").