### 25.19.1 Análise de perfis de consulta usando o Gerenciamento de desempenho

O exemplo a seguir demonstra como usar os eventos de declarações do Gerenciamento de Desempenho e eventos de estágio para recuperar dados comparáveis às informações de perfilamento fornecidas pelas declarações `SHOW PROFILES` e `SHOW PROFILE`.

A tabela `setup_actors` pode ser usada para limitar a coleta de eventos históricos por host, usuário ou conta, reduzindo o overhead do tempo de execução e a quantidade de dados coletados nas tabelas de histórico. O primeiro passo do exemplo mostra como limitar a coleta de eventos históricos para um usuário específico.

O Schema de desempenho exibe as informações do temporizador de eventos em picossegundos (trilhões de um segundo) para normalizar os dados de temporização para uma unidade padrão. No exemplo a seguir, os valores de `TIMER_WAIT` são divididos por 1.000.000.000.000 para mostrar os dados em unidades de segundos. Os valores também são truncados para 6 casas decimais para exibir os dados no mesmo formato das declarações `SHOW PROFILES` e `SHOW PROFILE`.

1. Limite a coleta de eventos históricos ao usuário que executa a consulta. Por padrão, o `setup_actors` está configurado para permitir o monitoramento e a coleta de eventos históricos para todos os threads em primeiro plano:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +------+------+------+---------+---------+
   | HOST | USER | ROLE | ENABLED | HISTORY |
   +------+------+------+---------+---------+
   | %    | %    | %    | YES     | YES     |
   +------+------+------+---------+---------+
   ```

   Atualize a linha padrão na tabela `setup_actors` para desabilitar a coleta e monitoramento de eventos históricos para todos os threads em primeiro plano e insira uma nova linha que habilite o monitoramento e a coleta de eventos históricos para o usuário que está executando a consulta:

   ```sql
   mysql> UPDATE performance_schema.setup_actors
          SET ENABLED = 'NO', HISTORY = 'NO'
          WHERE HOST = '%' AND USER = '%';

   mysql> INSERT INTO performance_schema.setup_actors
          (HOST,USER,ROLE,ENABLED,HISTORY)
          VALUES('localhost','test_user','%','YES','YES');
   ```

   Os dados na tabela `setup_actors` devem agora parecer semelhantes ao seguinte:

   ```sql
   mysql> SELECT * FROM performance_schema.setup_actors;
   +-----------+-----------+------+---------+---------+
   | HOST      | USER      | ROLE | ENABLED | HISTORY |
   +-----------+-----------+------+---------+---------+
   | %         | %         | %    | NO      | NO      |
   | localhost | test_user | %    | YES     | YES     |
   +-----------+-----------+------+---------+---------+
   ```

2. Certifique-se de que a declaração e a instrumentação de estágio estão habilitadas atualizando a tabela \`setup_instruments. Alguns instrumentos podem estar já habilitados por padrão.

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%statement/%';

   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES', TIMED = 'YES'
          WHERE NAME LIKE '%stage/%';
   ```

3. Certifique-se de que os consumidores `events_statements_*` e `events_stages_*` estejam habilitados. Alguns consumidores podem estar habilitados por padrão.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_statements_%';

   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%events_stages_%';
   ```

4. Sob a conta de usuário que você está monitorando, execute a declaração que deseja perfiliar. Por exemplo:

   ```sql
   mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
   +--------+------------+------------+-----------+--------+------------+
   | emp_no | birth_date | first_name | last_name | gender | hire_date |
   +--------+------------+------------+-----------+--------+------------+
   |  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
   +--------+------------+------------+-----------+--------+------------+
   ```

5. Identifique o `EVENT_ID` da declaração consultando a tabela `events_statements_history_long`. Essa etapa é semelhante ao uso de `SHOW PROFILES` para identificar o `Query_ID`. A seguinte consulta produz um resultado semelhante ao de `SHOW PROFILES`:

   ```sql
   mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
          FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
   +----------+----------+--------------------------------------------------------+
   | event_id | duration | sql_text                                               |
   +----------+----------+--------------------------------------------------------+
   |       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
   +----------+----------+--------------------------------------------------------+
   ```

6. Consulte a tabela `events_stages_history_long` para recuperar os eventos de estágio da declaração. Os estágios estão vinculados às declarações usando o nesting de eventos. Cada registro de evento de estágio tem uma coluna `NESTING_EVENT_ID` que contém o `EVENT_ID` da declaração pai.

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
