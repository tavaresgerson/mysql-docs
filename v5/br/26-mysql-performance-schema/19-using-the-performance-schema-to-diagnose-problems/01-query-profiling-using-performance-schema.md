### 25.19.1 Profiling de Query Usando Performance Schema

O exemplo a seguir demonstra como usar eventos de Statement e eventos de Stage do Performance Schema para recuperar dados comparáveis às informações de profiling fornecidas pelas instruções [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") e [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement").

A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") pode ser usada para limitar a coleta de eventos históricos por host, user, ou account, a fim de reduzir o overhead de runtime e a quantidade de dados coletados nas tabelas de histórico. O primeiro passo do exemplo mostra como limitar a coleta de eventos históricos a um user específico.

O Performance Schema exibe informações de timer de eventos em picossegundos (trilionésimos de segundo) para normalizar os dados de tempo para uma unidade padrão. No exemplo a seguir, os valores de `TIMER_WAIT` são divididos por 1000000000000 para mostrar os dados em unidades de segundos. Os valores também são truncados para 6 casas decimais para exibir os dados no mesmo formato das instruções [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") e [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement").

1. Limite a coleta de eventos históricos ao user que está executando a Query. Por padrão, [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") é configurada para permitir o monitoramento e a coleta de eventos históricos para todos os foreground threads:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

   Atualize a linha padrão na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") para desabilitar a coleta de eventos históricos e o monitoramento para todos os foreground threads, e insira uma nova linha que habilite o monitoramento e a coleta de eventos históricos para o user que está executando a Query:

   ```sql
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

   Os dados na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") devem agora aparecer de forma semelhante ao seguinte:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Garanta que a instrumentation de Statement e Stage esteja habilitada, atualizando a tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Alguns instruments podem já estar habilitados por padrão.

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Garanta que os consumers `events_statements_*` e `events_stages_*` estejam habilitados. Alguns consumers podem já estar habilitados por padrão.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Sob a account de user que você está monitorando, execute o Statement que deseja perfilar. Por exemplo:

   ```sql
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identifique o `EVENT_ID` do Statement consultando a tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table"). Este passo é semelhante a executar [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") para identificar o `Query_ID`. A Query a seguir produz uma saída semelhante a [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement"):

   ```sql
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Consulte a tabela [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table") para recuperar os eventos de Stage do Statement. Stages são vinculados a Statements usando aninhamento de eventos (event nesting). Cada registro de evento de Stage possui uma coluna `NESTING_EVENT_ID` que contém o `EVENT_ID` do Statement pai.

   ```sql
   mysql> SELECT event_name AS Stage, TRUNCATE(TIMER_WAIT/1000000000000,6) AS Duration
          FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=31;
   +--------------------------------+----------+
   | Stage                          | Duration |
   +--------------------------------+----------+
   | stage/sql/starting             | 0.000080 |
   | stage/sql/checking permissions | 0.000005 |
   | stage/sql/Opening tables       | 0.027759 |
   | stage/sql/init                 | 0.000052 |
   | stage/sql/System lock          | 0.000009 |
   | stage/sql/optimizing           | 0.000006 |
   | stage/sql/statistics           | 0.000082 |
   | stage/sql/preparing            | 0.000008 |
   | stage/sql/executing            | 0.000000 |
   | stage/sql/Sending data         | 0.000017 |
   | stage/sql/end                  | 0.000001 |
   | stage/sql/query end            | 0.000004 |
   | stage/sql/closing tables       | 0.000006 |
   | stage/sql/freeing items        | 0.000272 |
   | stage/sql/cleaning up          | 0.000001 |
   +--------------------------------+----------+
   ```