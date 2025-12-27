### 29.12.4 Tabelas de Eventos de Espera do Schema de Desempenho

29.12.4.1 Tabela `events_waits_current`

29.12.4.2 Tabela `events_waits_history`

29.12.4.3 Tabela `events_waits_history_long`

Os instrumentos do Schema de Desempenho monitoram as espera, que são eventos que levam tempo. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de espera:

* `events_waits_current`: O evento de espera atual para cada thread.

* `events_waits_history`: Os eventos de espera mais recentes que terminaram por thread.

* `events_waits_history_long`: Os eventos de espera mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de espera. Há também tabelas resumidas que agregam informações sobre eventos de espera; veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, veja a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

#### Configurando a Coleta de Eventos de Espera

Para controlar se os eventos de espera devem ser coletados, configure o estado dos instrumentos e consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `wait`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de espera.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes das tabelas de eventos de espera atuais e históricas. Use esses consumidores para filtrar a coleta de eventos de espera.

Alguns instrumentos de espera são habilitados por padrão; outros são desabilitados. Por exemplo:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb%';
+-------------------------------------------------+---------+-------+
| NAME                                            | ENABLED | TIMED |
+-------------------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_tablespace_open_file | YES     | YES   |
| wait/io/file/innodb/innodb_data_file            | YES     | YES   |
| wait/io/file/innodb/innodb_log_file             | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file            | YES     | YES   |
| wait/io/file/innodb/innodb_arch_file            | YES     | YES   |
| wait/io/file/innodb/innodb_clone_file           | YES     | YES   |
+-------------------------------------------------+---------+-------+
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/socket/%';
+----------------------------------------+---------+-------+
| NAME                                   | ENABLED | TIMED |
+----------------------------------------+---------+-------+
| wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
| wait/io/socket/sql/server_unix_socket  | NO      | NO    |
| wait/io/socket/sql/client_connection   | NO      | NO    |
+----------------------------------------+---------+-------+
```

Os consumidores de espera são desabilitados por padrão:

```
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

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

* Desabilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a coleta de eventos de espera durante a execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

* Desabilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas eventos de espera específicos, habilite apenas os instrumentos de espera correspondentes. Para coletar eventos de espera apenas para tabelas específicas de eventos de espera, habilite os instrumentos de espera, mas apenas os consumidores de espera correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”, e a Seção 29.4, “Configuração de Execução do Schema de Desempenho”.