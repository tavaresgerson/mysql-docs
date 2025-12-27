### 29.19.1 Análise de perfis de execução usando o Gerenciamento de desempenho

O exemplo a seguir demonstra como usar eventos de declarações e eventos de estágio do Gerenciamento de desempenho para recuperar dados comparáveis às informações de perfilagem fornecidas pelas declarações `SHOW PROFILES` e `SHOW PROFILE`.

A tabela `setup_actors` pode ser usada para limitar a coleta de eventos históricos por host, usuário ou conta para reduzir o overhead de execução e a quantidade de dados coletados nas tabelas de histórico. O primeiro passo do exemplo mostra como limitar a coleta de eventos históricos para um usuário específico.

O Gerenciamento de desempenho exibe informações de temporizador de eventos em picossegundos (trilhésimos de segundo) para normalizar os dados de temporização para uma unidade padrão. No exemplo a seguir, os valores de `TIMER_WAIT` são divididos por 1.000.000.000.000 para mostrar os dados em unidades de segundos. Os valores também são truncados para 6 casas decimais para exibir os dados no mesmo formato das declarações `SHOW PROFILES` e `SHOW PROFILE`.

1. Limite a coleta de eventos históricos para o usuário que executa a consulta. Por padrão, `setup_actors` é configurado para permitir o monitoramento e a coleta de eventos históricos para todos os threads em primeiro plano:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

   Atualize a linha padrão na tabela `setup_actors` para desabilitar a coleta e o monitoramento de eventos históricos para todos os threads em primeiro plano, e insira uma nova linha que habilite o monitoramento e a coleta de eventos históricos para o usuário que executa a consulta:

   ```
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

   Os dados na tabela `setup_actors` agora devem parecer semelhantes ao seguinte:

   ```
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Garanta que a instrumentação de declarações e estágios esteja habilitada atualizando a tabela `setup_instruments`. Alguns instrumentos podem já estar habilitados por padrão.

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Certifique-se de que os consumidores `events_statements_*` e `events_stages_*` estejam habilitados. Alguns consumidores podem já estar habilitados por padrão.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Em relação à conta de usuário que você está monitorando, execute a declaração que deseja perfiliar. Por exemplo:

   ```
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identifique o `EVENT_ID` da declaração consultando a tabela `events_statements_history_long`. Esse passo é semelhante ao de executar `SHOW PROFILES` para identificar o `Query_ID`. A consulta a seguir produz um resultado semelhante a `SHOW PROFILES`:

   ```
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Consulte a tabela `events_stages_history_long` para recuperar os eventos de estágio da declaração. Os estágios estão vinculados às declarações usando o nesting de eventos. Cada registro de evento de estágio tem uma coluna `NESTING_EVENT_ID` que contém o `EVENT_ID` da declaração pai.

   ```
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