#### 13.7.5.38. EXIBIR TRIGGERS Statement

```sql
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TRIGGERS` lista os gatilhos atualmente definidos para tabelas em um banco de dados (o banco de dados padrão, a menos que uma cláusula `FROM` seja fornecida). Esta declaração retorna resultados apenas para bancos de dados e tabelas para os quais você tem o privilégio `[TRIGGER]` (privilegios-fornecidos.html#priv_trigger). A cláusula `LIKE` (funções de comparação de strings.html#operador_like), se presente, indica quais nomes de tabelas (e não nomes de gatilhos) devem ser correspondidos e faz com que a declaração exiba gatilhos para essas tabelas. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

Para o gatilho `ins_sum` definido em Seção 23.3, “Usando gatilhos”, o resultado da consulta `SHOW TRIGGERS` é mostrado aqui:

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

A saída `SHOW TRIGGERS` tem essas colunas:

- `Trigger`

  O nome do gatilho.

- Evento

  O evento desencadeador. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

- `Mesa`

  A tabela para a qual o gatilho é definido.

- "Declaração"

  O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado.

- `Horário`

  Se o gatilho é ativado antes ou depois do evento que o desencadeia. O valor é `BEFORE` ou `AFTER`.

- Criado

  A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundo) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

- `sql_mode`

  O modo SQL em vigor quando o gatilho foi criado e sob o qual o gatilho é executado. Para os valores permitidos, consulte Seção 5.1.10, “Modos SQL do Servidor”.

- `Definer`

  A conta do usuário que criou o gatilho, no formato `'user_name'@'host_name'`.

- `character_set_client`

  O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

- `collation_connection`

  O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

- `Colagem de banco de dados`

  A agregação do banco de dados com o qual o gatilho está associado.

As informações sobre gatilhos também estão disponíveis na tabela `INFORMATION_SCHEMA [`TRIGGERS\`]\(information-schema-triggers-table.html). Veja Seção 24.3.29, “A Tabela INFORMATION_SCHEMA TRIGGERS”.
