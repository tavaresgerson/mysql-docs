### 29.4.4 Pré-filtragem por Instrumento

A tabela `setup_instruments` lista os instrumentos disponíveis:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments;
+---------------------------------------------------+---------+-------+
| NAME                                              | ENABLED | TIMED |
+---------------------------------------------------+---------+-------+
...
| stage/sql/end                                     | NO      | NO    |
| stage/sql/executing                               | NO      | NO    |
| stage/sql/init                                    | NO      | NO    |
| stage/sql/insert                                  | NO      | NO    |
...
| statement/sql/load                                | YES     | YES   |
| statement/sql/grant                               | YES     | YES   |
| statement/sql/check                               | YES     | YES   |
| statement/sql/flush                               | YES     | YES   |
...
| wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
| wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
| wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
| wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
...
| wait/synch/rwlock/sql/LOCK_grant                  | YES     | YES   |
| wait/synch/rwlock/sql/LOGGER::LOCK_logger         | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_connect       | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_slave         | YES     | YES   |
...
| wait/io/file/sql/binlog                           | YES     | YES   |
| wait/io/file/sql/binlog_index                     | YES     | YES   |
| wait/io/file/sql/casetest                         | YES     | YES   |
| wait/io/file/sql/dbopt                            | YES     | YES   |
...
```

Para controlar se um instrumento está habilitado, defina sua coluna `ENABLED` para `YES` ou `NO`. Para configurar se a coleta de informações de temporização para um instrumento habilitado deve ser realizada, defina seu valor `TIMED` para `YES` ou `NO`. A definição da coluna `TIMED` afeta o conteúdo da tabela do Schema de Desempenho, conforme descrito na Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

As modificações na maioria das linhas da `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são efetivas ao iniciar o servidor; alterá-las em tempo de execução não tem efeito. Isso afeta principalmente mútues, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

A tabela `setup_instruments` fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou thread que está sendo monitorado, outras tabelas podem ser usadas, conforme descrito na Seção 29.4.3, “Pré-filtragem de Eventos”.

Os seguintes exemplos demonstram operações possíveis na tabela `setup_instruments`. Essas alterações, como outras operações de pré-filtragem, afetam todos os usuários. Algumas dessas consultas usam o operador `LIKE` e uma correspondência de padrão para nomes de instrumentos. Para obter informações adicionais sobre como especificar padrões para selecionar instrumentos, consulte a Seção 29.4.9, “Nomeando Instrumentos ou Consumidores para Operações de Filtragem”.

* Desabilitar todos os instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO';
  ```

  Agora, nenhum evento é coletado.

* Desabilitar todos os instrumentos de arquivo, adicionando-os ao conjunto atual de instrumentos desabilitados:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'wait/io/file/%';
  ```

* Desabilitar apenas os instrumentos de arquivo, habilitar todos os outros instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(NAME LIKE 'wait/io/file/%', 'NO', 'YES');
  ```

* Habilitar todos, exceto aqueles instrumentos da biblioteca `mysys`:

```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = CASE WHEN NAME LIKE '%/mysys/%' THEN 'YES' ELSE 'NO' END;
  ```

* Desativar um instrumento específico:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Para alternar o estado de um instrumento, "inverter" seu valor `ENABLED`:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(ENABLED = 'YES', 'NO', 'YES')
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Desativar o temporizador para todos os eventos:

  ```
  UPDATE performance_schema.setup_instruments
  SET TIMED = 'NO';
  ```