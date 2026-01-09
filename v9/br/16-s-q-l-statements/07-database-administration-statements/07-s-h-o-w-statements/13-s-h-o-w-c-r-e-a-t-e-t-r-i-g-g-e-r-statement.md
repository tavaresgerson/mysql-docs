#### 15.7.7.13 Declaração `SHOW CREATE TRIGGER`

```
SHOW CREATE TRIGGER trigger_name
```

Esta declaração mostra a declaração `CREATE TRIGGER` que cria o gatilho nomeado. Esta declaração requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

```
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER `ins_sum`
                        BEFORE INSERT ON `account`
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8mb4
  collation_connection: utf8mb4_0900_ai_ci
    Database Collation: utf8mb4_0900_ai_ci
               Created: 2018-08-08 10:10:12.61
```

A saída da declaração `SHOW CREATE TRIGGER` tem estas colunas:

* `Trigger`: O nome do gatilho.
* `sql_mode`: O modo SQL em vigor quando o gatilho é executado.

* `SQL Statement Original`: A declaração `CREATE TRIGGER` que define o gatilho.

* `character_set_client`: O valor da variável de sistema `character_set_client` da sessão quando o gatilho foi criado.

* `collation_connection`: O valor da variável de sistema `collation_connection` da sessão quando o gatilho foi criado.

* `Database Collation`: A collation do banco de dados com o qual o gatilho está associado.

* `Created`: A data e hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundo) para gatilhos.

As informações do gatilho também estão disponíveis na tabela `TRIGGERS` do `INFORMATION_SCHEMA`. Consulte a Seção 28.3.50, “A Tabela INFORMATION_SCHEMA TRIGGERS”.