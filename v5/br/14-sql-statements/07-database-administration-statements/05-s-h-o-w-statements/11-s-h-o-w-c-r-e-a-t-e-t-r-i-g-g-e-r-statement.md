#### 13.7.5.11 Instrução SHOW CREATE TRIGGER

```sql
SHOW CREATE TRIGGER trigger_name
```

Esta instrução exibe a instrução [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") que cria o Trigger nomeado. Esta instrução requer o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para a tabela associada ao Trigger.

```sql
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER ins_sum
                        BEFORE INSERT ON account
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8
  collation_connection: utf8_general_ci
    Database Collation: latin1_swedish_ci
               Created: 2018-08-08 10:10:07.90
```

O resultado de [`SHOW CREATE TRIGGER`](show-create-trigger.html "13.7.5.11 SHOW CREATE TRIGGER Statement") possui estas colunas:

* `Trigger`: O nome do Trigger.
* `sql_mode`: O SQL mode em vigor quando o Trigger é executado.

* `SQL Original Statement`: A instrução [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") que define o Trigger.

* `character_set_client`: O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando o Trigger foi criado.

* `collation_connection`: O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando o Trigger foi criado.

* `Database Collation`: O collation do Database ao qual o Trigger está associado.

* `Created`: A data e hora em que o Trigger foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para Triggers criados no MySQL 5.7.2 ou posterior, `NULL` para Triggers criados antes de 5.7.2.

As informações do Trigger também estão disponíveis na tabela [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") do `INFORMATION_SCHEMA`. Consulte [Seção 24.3.29, “A Tabela INFORMATION_SCHEMA TRIGGERS”](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table").