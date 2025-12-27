#### 15.7.7.41 Declaração `SHOW TRIGGERS`

```
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TRIGGERS` lista os gatilhos atualmente definidos para tabelas em um banco de dados (o banco de dados padrão, a menos que uma cláusula `FROM` seja fornecida). Esta declaração retorna resultados apenas para bancos de dados e tabelas para os quais você tem o privilégio `TRIGGER`. A cláusula `LIKE`, se presente, indica quais nomes de tabelas (não nomes de gatilhos) devem ser correspondidos e faz com que a declaração exiba gatilhos para essas tabelas. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

Para o gatilho `ins_sum` definido na Seção 27.4, “Usando Gatilhos”, a saída de `SHOW TRIGGERS` é mostrada aqui:

```
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
                      NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

A saída de `SHOW TRIGGERS` tem estas colunas:

* `Trigger`

  O nome do gatilho.

* `Event`

  O evento do gatilho. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

* `Table`

  A tabela para a qual o gatilho é definido.

* `Statement`

  O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado.

* `Timing`

  Se o gatilho é ativado antes ou depois do evento desencadeante. O valor é `BEFORE` ou `AFTER`.

* `Created`

  A data e hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundo) para gatilhos.

* `sql_mode`

  O modo SQL em vigor quando o gatilho foi criado, e sob o qual o gatilho é executado. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

* `Definer`

  A conta do usuário que criou o gatilho, no formato `'user_name'@'host_name'`.

O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

* `collation_connection`

  O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

* `Coligação do banco de dados`

  A coligação do banco de dados com o qual o gatilho está associado.

As informações do gatilho também estão disponíveis na tabela `TRIGGERS` do `INFORMATION_SCHEMA`. Consulte a Seção 28.3.50, “A tabela INFORMATION_SCHEMA TRIGGERS”.