#### 13.7.5.38 Instrução SHOW TRIGGERS

```sql
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

O [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") lista os Triggers atualmente definidos para tabelas em um Database (o Database padrão, a menos que uma cláusula `FROM` seja fornecida). Esta instrução retorna resultados apenas para Databases e tabelas para as quais você tem o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger). A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de tabela (não nomes de Trigger) devem ser comparados e faz com que a instrução exiba os Triggers para essas tabelas. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões para Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

Para o Trigger `ins_sum` definido na [Seção 23.3, “Usando Triggers”](triggers.html "23.3 Using Triggers"), a saída de [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") é mostrada aqui:

```sql
mysql> SHOW TRIGGERS LIKE 'acc%'\G
*************************** 1. row ***************************
             Trigger: ins_sum
               Event: INSERT
               Table: account
           Statement: SET @sum = @sum + NEW.amount
              Timing: BEFORE
             Created: 2018-08-08 10:10:12.61
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

A saída de [`SHOW TRIGGERS`](show-triggers.html "13.7.5.38 SHOW TRIGGERS Statement") possui as seguintes colunas:

* `Trigger`

  O nome do Trigger.

* `Event`

  O Event do Trigger. Este é o tipo de operação na tabela associada para a qual o Trigger é ativado. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

* `Table`

  A tabela para a qual o Trigger é definido.

* `Statement`

  O corpo (body) do Trigger; ou seja, a instrução executada quando o Trigger é ativado.

* `Timing`

  Indica se o Trigger é ativado antes ou depois do Event acionador. O valor é `BEFORE` ou `AFTER`.

* `Created`

  A data e hora em que o Trigger foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para Triggers criados no MySQL 5.7.2 ou posterior, `NULL` para Triggers criados antes de 5.7.2.

* `sql_mode`

  O SQL mode em vigor quando o Trigger foi criado, e sob o qual o Trigger é executado. Para os valores permitidos, consulte [Seção 5.1.10, “SQL Modes do Servidor”](sql-mode.html "5.1.10 Server SQL Modes").

* `Definer`

  A conta do usuário que criou o Trigger, no formato `'user_name'@'host_name'`.

* `character_set_client`

  O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando o Trigger foi criado.

* `collation_connection`

  O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando o Trigger foi criado.

* `Database Collation`

  O Collation do Database ao qual o Trigger está associado.

Informações sobre Triggers também estão disponíveis na tabela [`TRIGGERS`](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table") do `INFORMATION_SCHEMA`. Consulte a [Seção 24.3.29, “A Tabela TRIGGERS do INFORMATION_SCHEMA”](information-schema-triggers-table.html "24.3.29 The INFORMATION_SCHEMA TRIGGERS Table").