### 25.12.4 Tabelas de Eventos Wait do Performance Schema

[25.12.4.1 A Tabela events_waits_current](performance-schema-events-waits-current-table.html)

[25.12.4.2 A Tabela events_waits_history](performance-schema-events-waits-history-table.html)

[25.12.4.3 A Tabela events_waits_history_long](performance-schema-events-waits-history-long-table.html)

O Performance Schema instrumenta waits (esperas), que são Events (eventos) que consomem tempo. Dentro da hierarquia de Eventos, os Eventos Wait aninham-se em Eventos Stage (Estágio), que se aninham em Eventos Statement (Instrução), que se aninham em Eventos Transaction (Transação).

Estas tabelas armazenam Eventos Wait:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current"): O Evento Wait atual para cada Thread.

* [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 A Tabela events_waits_history"): Os Eventos Wait mais recentes que terminaram por Thread.

* [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 A Tabela events_waits_history_long"): Os Eventos Wait mais recentes que terminaram globalmente (em todos os Threads).

As seções seguintes descrevem as tabelas de Eventos Wait. Existem também tabelas de resumo que agregam informações sobre Eventos Wait; consulte [Section 25.12.15.1, “Tabelas de Resumo de Eventos Wait”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables").

Para mais informações sobre a relação entre as três tabelas de Eventos Wait, consulte [Section 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

#### Configurando a Coleta de Eventos Wait

Para controlar se Eventos Wait devem ser coletados, defina o estado dos Instruments e Consumers relevantes:

* A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments") contém Instruments com nomes que começam com `wait`. Use esses Instruments para habilitar ou desabilitar a Collection de classes individuais de Eventos Wait.

* A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") contém valores de Consumer com nomes correspondentes aos nomes das tabelas de Eventos Wait atuais e históricas. Use esses Consumers para filtrar a Collection de Eventos Wait.

Alguns Instruments Wait são habilitados por padrão; outros são desabilitados. Por exemplo:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb%';
+--------------------------------------+---------+-------+
| NAME                                 | ENABLED | TIMED |
+--------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_data_file | YES     | YES   |
| wait/io/file/innodb/innodb_log_file  | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file | YES     | YES   |
+--------------------------------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_instruments WHERE
       NAME LIKE 'wait/io/socket/%';
+----------------------------------------+---------+-------+
| NAME                                   | ENABLED | TIMED |
+----------------------------------------+---------+-------+
| wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
| wait/io/socket/sql/server_unix_socket  | NO      | NO    |
| wait/io/socket/sql/client_connection   | NO      | NO    |
+----------------------------------------+---------+-------+
```

Os Consumers Wait são desabilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_waits%';
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| events_waits_current      | NO      |
| events_waits_history      | NO      |
| events_waits_history_long | NO      |
+---------------------------+---------+
```

Para controlar a Collection de Eventos Wait na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a Collection de Eventos Wait em tempo de execução (runtime), atualize as tabelas [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments") e [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers"):

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas Eventos Wait específicos, habilite somente os Instruments Wait correspondentes. Para coletar Eventos Wait apenas para tabelas de Eventos Wait específicas, habilite os Instruments Wait, mas somente os Consumers Wait correspondentes às tabelas desejadas.

A tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 A Tabela setup_timers") contém uma linha com um valor `NAME` de `wait` que indica a unidade para o timing (medição de tempo) de Eventos Wait. A unidade padrão é `CYCLE`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'wait';
+------+------------+
| NAME | TIMER_NAME |
+------+------------+
| wait | CYCLE      |
+------+------------+
```

Para alterar a unidade de timing, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'NANOSECOND'
WHERE NAME = 'wait';
```

Para informações adicionais sobre a configuração da Collection de Eventos, consulte [Section 25.3, “Configuração de Inicialização do Performance Schema”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration") e [Section 25.4, “Configuração de Runtime do Performance Schema”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration").
