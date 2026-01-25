### 24.3.8 A Tabela EVENTS do INFORMATION_SCHEMA

A tabela `EVENTS` fornece informações sobre os eventos do Event Manager, que são discutidos na [Seção 23.4, “Utilizando o Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler").

A tabela `EVENTS` possui as seguintes colunas:

* `EVENT_CATALOG`

  O nome do catálogo ao qual o evento pertence. Este valor é sempre `def`.

* `EVENT_SCHEMA`

  O nome do schema (Database) ao qual o evento pertence.

* `EVENT_NAME`

  O nome do evento.

* `DEFINER`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou o evento), no formato `'user_name'@'host_name'`.

* `TIME_ZONE`

  O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor dentro do evento durante sua execução. O valor padrão é `SYSTEM`.

* `EVENT_BODY`

  A linguagem utilizada para as instruções na cláusula `DO` do evento. O valor é sempre `SQL`.

* `EVENT_DEFINITION`

  O texto da instrução SQL que compõe a cláusula `DO` do evento; em outras palavras, a instrução executada por este evento.

* `EVENT_TYPE`

  O tipo de repetição do evento, sendo `ONE TIME` (transitório) ou `RECURRING` (repetitivo).

* `EXECUTE_AT`

  Para um evento de única execução (one-time), este é o valor `DATETIME` especificado na cláusula `AT` da instrução `CREATE EVENT` usada para criar o evento, ou da última instrução `ALTER EVENT` que modificou o evento. O valor exibido nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento for criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor exibido nesta coluna seria `'2018-02-10 20:05:30'`. Se o tempo do evento for determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento for recorrente), o valor desta coluna é `NULL`.

* `INTERVAL_VALUE`

  Para um evento recorrente, o número de intervalos a aguardar entre as execuções do evento. Para um evento transitório, o valor é sempre `NULL`.

* `INTERVAL_FIELD`

  As unidades de tempo usadas para o intervalo que um evento recorrente aguarda antes de se repetir. Para um evento transitório, o valor é sempre `NULL`.

* `SQL_MODE`

  O SQL mode em vigor quando o evento foi criado ou alterado, e sob o qual o evento é executado. Para os valores permitidos, consulte [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* `STARTS`

  A data e hora de início para um evento recorrente. Isso é exibido como um valor `DATETIME` e é `NULL` se nenhuma data e hora de início estiver definida para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento recorrente cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor `DATETIME` correspondente. Assim como na coluna `EXECUTE_AT`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `STARTS` afetando o tempo do evento, esta coluna é `NULL`.

* `ENDS`

  Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor `DATETIME` correspondente. Assim como na coluna `EXECUTE_AT`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `ENDS` afetando o tempo do evento, esta coluna é `NULL`.

* `STATUS`

  O status do evento. Um dos seguintes: `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL atuando como fonte de replicação e foi replicado para o servidor MySQL atual que está atuando como réplica, mas o evento não está sendo executado no momento na réplica. Para mais informações, consulte [Seção 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

* `ON_COMPLETION`

  Um dos dois valores: `PRESERVE` ou `NOT PRESERVE`.

* `CREATED`

  A data e hora em que o evento foi criado. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

  A data e hora em que o evento foi modificado pela última vez. Este é um valor `TIMESTAMP`. Se o evento não foi modificado desde a sua criação, este valor é o mesmo que o valor `CREATED`.

* `LAST_EXECUTED`

  A data e hora em que o evento foi executado pela última vez. Este é um valor `DATETIME`. Se o evento nunca foi executado, esta coluna é `NULL`.

  `LAST_EXECUTED` indica quando o evento começou. Como resultado, a coluna `ENDS` nunca é menor que `LAST_EXECUTED`.

* `EVENT_COMMENT`

  O texto do comentário, se o evento tiver um. Caso contrário, este valor é vazio.

* `ORIGINATOR`

  O ID do servidor MySQL no qual o evento foi criado; usado na replicação. Este valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual essa instrução ocorre, se executada em uma fonte de replicação. O valor padrão é 0.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `DATABASE_COLLATION`

  O collation do Database ao qual o evento está associado.

#### Notas

* `EVENTS` é uma tabela não padrão do `INFORMATION_SCHEMA`.

* Os horários na tabela `EVENTS` são exibidos usando o fuso horário do evento, o fuso horário da sessão atual ou UTC, conforme descrito em [Seção 23.4.4, “Metadados do Evento”](events-metadata.html "23.4.4 Event Metadata").

* Para mais informações sobre `SLAVESIDE_DISABLED` e a coluna `ORIGINATOR`, consulte [Seção 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

#### Exemplo

Suponha que o usuário `'jon'@'ghidora'` crie um evento chamado `e_daily` e, em seguida, o modifique alguns minutos depois usando uma instrução `ALTER EVENT`, conforme mostrado aqui:

```sql
DELIMITER |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

DELIMITER ;

ALTER EVENT e_daily
    ENABLE;
```

(Observe que os comentários podem abranger várias linhas.)

Este usuário pode então executar a seguinte instrução `SELECT` e obter a saída mostrada:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
       WHERE EVENT_NAME = 'e_daily'
       AND EVENT_SCHEMA = 'myschema'\G
*************************** 1. row ***************************
       EVENT_CATALOG: def
        EVENT_SCHEMA: myschema
          EVENT_NAME: e_daily
             DEFINER: jon@ghidora
           TIME_ZONE: SYSTEM
          EVENT_BODY: SQL
    EVENT_DEFINITION: BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END
          EVENT_TYPE: RECURRING
          EXECUTE_AT: NULL
      INTERVAL_VALUE: 1
      INTERVAL_FIELD: DAY
            SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
              STARTS: 2018-08-08 11:06:34
                ENDS: NULL
              STATUS: ENABLED
       ON_COMPLETION: NOT PRESERVE
             CREATED: 2018-08-08 11:06:34
        LAST_ALTERED: 2018-08-08 11:06:34
       LAST_EXECUTED: 2018-08-08 16:06:34
       EVENT_COMMENT: Saves total number of sessions then clears the
                      table each day
          ORIGINATOR: 1
CHARACTER_SET_CLIENT: utf8
COLLATION_CONNECTION: utf8_general_ci
  DATABASE_COLLATION: latin1_swedish_ci
```

Informações do evento também estão disponíveis a partir da instrução `SHOW EVENTS`. Consulte [Seção 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement"). As seguintes instruções são equivalentes:

```sql
SELECT
    EVENT_SCHEMA, EVENT_NAME, DEFINER, TIME_ZONE, EVENT_TYPE, EXECUTE_AT,
    INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ORIGINATOR,
    CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION
  FROM INFORMATION_SCHEMA.EVENTS
  WHERE table_schema = 'db_name'
  [AND column_name LIKE 'wild']

SHOW EVENTS
  [FROM db_name]
  [LIKE 'wild']
```