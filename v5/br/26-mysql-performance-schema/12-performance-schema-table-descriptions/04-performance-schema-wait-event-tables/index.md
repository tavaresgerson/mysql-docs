### 25.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho

25.12.4.1 Tabela events_waits_current

25.12.4.2 Tabela de eventos_waits_history

25.12.4.3 A tabela events_waits_history_long

Os instrumentos do esquema de desempenho que aguardam, que são eventos que levam tempo. Dentro da hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de espera:

- `eventos_waits_current`: O evento de espera atual para cada thread.

- `eventos_waits_history`: Os eventos de espera mais recentes que terminaram por fio.

- `eventos_waits_history_long`: Os eventos de espera mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de espera. Existem também tabelas resumidas que agregam informações sobre eventos de espera; consulte Seção 25.12.15.1, “Tabelas Resumo de Eventos de Espera”.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte Seção 25.9, "Tabelas do Schema de Desempenho para Eventos Atuais e Históricos".

#### Configurar a Coleta de Eventos de Aguardar

Para controlar se os eventos de espera devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

- A tabela `setup_instruments` contém instrumentos com nomes que começam com `wait`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de espera.

- A tabela `setup_consumers` contém valores de consumidores com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de espera. Use esses consumidores para filtrar a coleção de eventos de espera.

Alguns instrumentos de espera estão habilitados por padrão; outros estão desabilitados. Por exemplo:

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

A espera dos consumidores é desabilitada por padrão:

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

Para controlar a coleta de eventos de espera na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a coleta de eventos de espera em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

- Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas eventos de espera específicos, habilite apenas os instrumentos de espera correspondentes. Para coletar eventos de espera apenas para tabelas de eventos de espera específicas, habilite os instrumentos de espera, mas apenas os consumidores de espera correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma linha com o valor `NAME` de `wait`, que indica a unidade para o cronometramento de eventos de espera. A unidade padrão é `CYCLE`:

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

Para alterar a unidade de temporização, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'NANOSECOND'
WHERE NAME = 'wait';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte Seção 25.3, “Configuração de Inicialização do Schema de Desempenho” e Seção 25.4, “Configuração de Execução em Tempo Real do Schema de Desempenho”.
