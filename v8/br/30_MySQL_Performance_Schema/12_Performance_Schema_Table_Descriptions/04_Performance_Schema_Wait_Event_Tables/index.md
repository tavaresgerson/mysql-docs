### 29.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho

29.12.4.1 A tabela events\_waits\_current

29.12.4.2 A tabela events\_waits\_history

29.12.4.3 A tabela events\_waits\_history\_long

Os instrumentos do esquema de desempenho que aguardam, que são eventos que levam tempo. Dentro da hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de espera:

- `events_waits_current`: O evento de espera atual para cada thread.

- `events_waits_history`: Os eventos de espera mais recentes que terminaram por fio.

- `events_waits_history_long`: Os eventos de espera mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de espera. Há também tabelas resumidas que agregam informações sobre eventos de espera; veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

#### Configurar a Coleta de Eventos de Aguardar

Para controlar se os eventos de espera devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

- A tabela `setup_instruments` contém instrumentos com nomes que começam com `wait`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de espera.

- A tabela `setup_consumers` contém valores de consumidores com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de espera. Use esses consumidores para filtrar a coleção de eventos de espera.

Alguns instrumentos de espera estão habilitados por padrão; outros estão desabilitados. Por exemplo:

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

A espera dos consumidores é desabilitada por padrão:

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

- Ativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

- Desativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a coleta de eventos de espera em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

- Ativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

- Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas eventos de espera específicos, habilite apenas os instrumentos de espera correspondentes. Para coletar eventos de espera apenas para tabelas de eventos de espera específicas, habilite os instrumentos de espera, mas apenas os consumidores de espera correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.
