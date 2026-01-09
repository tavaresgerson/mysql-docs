#### 13.7.5.11 Declaração `SHOW CREATE TRIGGER`

```sql
SHOW CREATE TRIGGER trigger_name
```

Esta declaração mostra a declaração `CREATE TRIGGER` que cria o gatilho nomeado. Esta declaração requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

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

A saída de `SHOW CREATE TRIGGER` tem essas colunas:

- `Trigger`: O nome do gatilho.

- `sql_mode`: O modo SQL em vigor quando o gatilho é executado.

- `Instrução SQL Original`: A instrução `CREATE TRIGGER` que define o gatilho.

- `character_set_client`: O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

- `collation_connection`: O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

- `Collinação do banco de dados`: A collation do banco de dados com o qual o gatilho está associado.

- `Criado`: A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundo) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

As informações sobre gatilhos também estão disponíveis na tabela `INFORMATION_SCHEMA [`TRIGGERS\`]\(information-schema-triggers-table.html). Veja Seção 24.3.29, “A Tabela INFORMATION_SCHEMA TRIGGERS”.
