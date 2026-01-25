### 24.3.29 A Tabela TRIGGERS do INFORMATION_SCHEMA

A tabela [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") fornece informações sobre triggers. Para visualizar informações sobre os triggers de uma tabela, você deve ter o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para essa tabela.

A tabela [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") possui as seguintes colunas:

* `TRIGGER_CATALOG`

  O nome do catalog ao qual o trigger pertence. Este valor é sempre `def`.

* `TRIGGER_SCHEMA`

  O nome do schema (Database) ao qual o trigger pertence.

* `TRIGGER_NAME`

  O nome do trigger.

* `EVENT_MANIPULATION`

  O Evento do trigger. Este é o tipo de operação na tabela associada que ativa o trigger. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

* `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA`, e `EVENT_OBJECT_TABLE`

  Como observado na [Seção 23.3, “Using Triggers”](triggers.html "23.3 Using Triggers"), todo trigger está associado a exatamente uma tabela. Estas colunas indicam o catalog e o schema (Database) onde esta tabela ocorre, e o nome da tabela, respectivamente. O valor de `EVENT_OBJECT_CATALOG` é sempre `def`.

* `ACTION_ORDER`

  A posição ordinal da ação do trigger dentro da lista de triggers na mesma tabela com os mesmos valores de `EVENT_MANIPULATION` e `ACTION_TIMING`.

* `ACTION_CONDITION`

  Este valor é sempre `NULL`.

* `ACTION_STATEMENT`

  O corpo do trigger; ou seja, a instrução executada quando o trigger é ativado. Este texto usa codificação UTF-8.

* `ACTION_ORIENTATION`

  Este valor é sempre `ROW`.

* `ACTION_TIMING`

  Se o trigger é ativado antes ou depois do evento de disparo. O valor é `BEFORE` ou `AFTER`.

* `ACTION_REFERENCE_OLD_TABLE`

  Este valor é sempre `NULL`.

* `ACTION_REFERENCE_NEW_TABLE`

  Este valor é sempre `NULL`.

* `ACTION_REFERENCE_OLD_ROW` e `ACTION_REFERENCE_NEW_ROW`

  Os identificadores de coluna old (antigo) e new (novo), respectivamente. O valor de `ACTION_REFERENCE_OLD_ROW` é sempre `OLD` e o valor de `ACTION_REFERENCE_NEW_ROW` é sempre `NEW`.

* `CREATED`

  A data e hora em que o trigger foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionada em centésimos de segundo) para triggers criados no MySQL 5.7.2 ou posterior, e `NULL` para triggers criados antes de 5.7.2.

* `SQL_MODE`

  O SQL mode em vigor quando o trigger foi criado, e sob o qual o trigger é executado. Para os valores permitidos, consulte a [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* `DEFINER`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou o trigger), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando o trigger foi criado.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando o trigger foi criado.

* `DATABASE_COLLATION`

  O collation do Database ao qual o trigger está associado.

#### Exemplo

O exemplo a seguir usa o trigger `ins_sum` definido na [Seção 23.3, “Using Triggers”](triggers.html "23.3 Using Triggers"):

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA='test' AND TRIGGER_NAME='ins_sum'\G
*************************** 1. row ***************************
           TRIGGER_CATALOG: def
            TRIGGER_SCHEMA: test
              TRIGGER_NAME: ins_sum
        EVENT_MANIPULATION: INSERT
      EVENT_OBJECT_CATALOG: def
       EVENT_OBJECT_SCHEMA: test
        EVENT_OBJECT_TABLE: account
              ACTION_ORDER: 1
          ACTION_CONDITION: NULL
          ACTION_STATEMENT: SET @sum = @sum + NEW.amount
        ACTION_ORIENTATION: ROW
             ACTION_TIMING: BEFORE
ACTION_REFERENCE_OLD_TABLE: NULL
ACTION_REFERENCE_NEW_TABLE: NULL
  ACTION_REFERENCE_OLD_ROW: OLD
  ACTION_REFERENCE_NEW_ROW: NEW
                   CREATED: 2018-08-08 10:10:12.61
                  SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                            NO_ZERO_IN_DATE,NO_ZERO_DATE,
                            ERROR_FOR_DIVISION_BY_ZERO,
                            NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
                   DEFINER: me@localhost
      CHARACTER_SET_CLIENT: utf8
      COLLATION_CONNECTION: utf8_general_ci
        DATABASE_COLLATION: latin1_swedish_ci
```

Informações sobre triggers também estão disponíveis através da instrução [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement"). Consulte a [Seção 13.7.5.38, “SHOW TRIGGERS Statement”](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement").