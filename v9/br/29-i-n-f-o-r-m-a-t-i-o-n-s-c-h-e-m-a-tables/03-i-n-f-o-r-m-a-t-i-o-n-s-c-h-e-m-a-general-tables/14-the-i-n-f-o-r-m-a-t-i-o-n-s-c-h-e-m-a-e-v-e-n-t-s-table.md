### 28.3.14 A Tabela INFORMATION_SCHEMA EVENTS

A tabela `EVENTS` fornece informações sobre os eventos do Gestor de Eventos, que são discutidos na Seção 27.5, “Usando o Agendamento de Eventos”.

A tabela `EVENTS` tem as seguintes colunas:

* `EVENT_CATALOG`

  O nome do catálogo ao qual o evento pertence. Esse valor é sempre `def`.

* `EVENT_SCHEMA`

  O nome do esquema (banco de dados) ao qual o evento pertence.

* `EVENT_NAME`

  O nome do evento.

* `DEFINER`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou o evento), no formato `'user_name'@'host_name'`.

* `TIME_ZONE`

  A zona horária do evento, que é a zona horária usada para agendar o evento e que está em vigor dentro do evento conforme ele é executado. O valor padrão é `SYSTEM`.

* `EVENT_BODY`

  A linguagem usada para as declarações na cláusula `DO` do evento. O valor é sempre `SQL`.

* `EVENT_DEFINITION`

  O texto da declaração SQL que compõe a cláusula `DO` do evento; em outras palavras, a declaração executada por este evento.

* `EVENT_TYPE`

  O tipo de repetição do evento, seja `ONE TIME` (transitório) ou `RECURRING` (repetitivo).

* `EXECUTE_AT`

Para um evento único, esse é o valor `DATETIME` especificado na cláusula `AT` da instrução `CREATE EVENT` usada para criar o evento, ou da última instrução `ALTER EVENT` que modificou o evento. O valor exibido nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor exibido nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento for determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento for recorrente), o valor desta coluna é `NULL`.

* `INTERVAL_VALUE`

  Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor é sempre `NULL`.

* `INTERVAL_FIELD`

  As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor é sempre `NULL`.

* `SQL_MODE`

  O modo SQL em vigor quando o evento foi criado ou alterado, e sob o qual o evento é executado. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

* `STARTS`

  A data e hora de início para um evento recorrente. Isso é exibido como um valor `DATETIME`, e é `NULL` se nenhuma data e hora de início forem definidas para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento recorrente cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor `DATETIME` correspondente. Como com a coluna `EXECUTE_AT`, esse valor resolve quaisquer expressões usadas. Se não houver uma cláusula `STARTS` afetando o cronograma do evento, esta coluna é `NULL`

* `ENDS`

Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente `DATETIME`. Como no caso da coluna `EXECUTE_AT`, este valor resolve quaisquer expressões usadas. Se não houver uma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

* `STATUS`

  O status do evento. Um dos valores `ENABLED`, `DISABLED` ou `REPLICA_SIDE_DISABLED` (antes de MySQL 8.2.0, este era `SLAVESIDE_DISABLED`, agora desatualizado). `REPLICA_SIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicada para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado atualmente na replica. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

* `ON_COMPLETION`

  Um dos dois valores `PRESERVE` ou `NOT PRESERVE`.

* `CREATED`

  A data e hora em que o evento foi criado. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

  A data e hora em que o evento foi alterado pela última vez. Este é um valor `TIMESTAMP`. Se o evento não foi modificado desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `LAST_EXECUTED`

  A data e hora em que o evento foi executado pela última vez. Este é um valor `DATETIME`. Se o evento nunca foi executado, esta coluna é `NULL`.

  `LAST_EXECUTED` indica quando o evento começou. Como resultado, a coluna `ENDS` nunca é menor que `LAST_EXECUTED`.

* `EVENT_COMMENT`

  O texto do comentário, se o evento tiver um. Se não, este valor é vazio.

* `ORIGINATOR`

O ID do servidor do MySQL no qual o evento foi criado; utilizado na replicação. Esse valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual aquela instrução ocorre, se executada em uma fonte de replicação. O valor padrão é 0.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `DATABASE_COLLATION`

  A collation do banco de dados com o qual o evento está associado.

#### Notas

* `EVENTS` é uma tabela `INFORMATION_SCHEMA` não padrão.

* Os tempos na tabela `EVENTS` são exibidos usando o fuso horário do evento, o fuso horário da sessão atual ou UTC, conforme descrito na Seção 27.5.4, “Metadados do Evento”.

* Para mais informações sobre `REPLICA_SIDE_DISABLED` e a coluna `ORIGINATOR`, consulte a Seção 19.5.1.16, “Replicação de Recursos Invocáveis”.

#### Exemplo

Suponha que o usuário `'jon'@'ghidora'` crie um evento chamado `e_daily` e, em seguida, o modifique alguns minutos depois usando uma instrução `ALTER EVENT`, conforme mostrado aqui:

```
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

(Observe que os comentários podem ocupar várias linhas.)

Esse usuário pode então executar a seguinte instrução `SELECT` e obter a saída mostrada:

```
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
                      NO_ENGINE_SUBSTITUTION
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
CHARACTER_SET_CLIENT: utf8mb4
COLLATION_CONNECTION: utf8mb4_0900_ai_ci
  DATABASE_COLLATION: utf8mb4_0900_ai_ci
```

As informações do evento também estão disponíveis a partir da instrução `SHOW EVENTS`. Consulte a Seção 15.7.7.20, “Instrução SHOW EVENTS”. As seguintes instruções são equivalentes:

```
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