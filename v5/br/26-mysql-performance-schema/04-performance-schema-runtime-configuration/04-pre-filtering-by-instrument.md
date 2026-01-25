### 25.4.4 Pré-Filtragem por Instrumento

A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") lista os instrumentos disponíveis:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments;
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

Para controlar se um instrumento está habilitado, defina sua coluna `ENABLED` como `YES` ou `NO`. Para configurar se as informações de tempo (timing) devem ser coletadas para um instrumento habilitado, defina seu valor `TIMED` como `YES` ou `NO`. Definir a coluna `TIMED` afeta o conteúdo da tabela Performance Schema conforme descrito na [Seção 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

Modificações na maioria das linhas da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações são efetivas apenas na inicialização do server; alterá-los em runtime não tem efeito. Isso afeta principalmente mutexes, conditions e rwlocks no server, embora possa haver outros instrumentos para os quais isso seja verdade.

A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou Thread monitorado, outras tabelas podem ser usadas conforme descrito na [Seção 25.4.3, “Event Pre-Filtering”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").

Os exemplos a seguir demonstram operações possíveis na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Essas alterações, assim como outras operações de pré-filtragem, afetam todos os usuários. Algumas dessas Querys usam o operador [`LIKE`](string-comparison-functions.html#operator_like) e um padrão para corresponder aos nomes dos instrumentos. Para informações adicionais sobre a especificação de padrões para selecionar instrumentos, consulte a [Seção 25.4.9, “Naming Instruments or Consumers for Filtering Operations”](performance-schema-filtering-names.html "25.4.9 Naming Instruments or Consumers for Filtering Operations").

* Desabilitar todos os instrumentos:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO';
  ```

  Agora, nenhum evento é coletado.

* Desabilitar todos os instrumentos de arquivo, adicionando-os ao conjunto atual de instrumentos desabilitados:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'wait/io/file/%';
  ```

* Desabilitar apenas instrumentos de arquivo, habilitar todos os outros instrumentos:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(NAME LIKE 'wait/io/file/%', 'NO', 'YES');
  ```

* Habilitar todos, exceto aqueles instrumentos na biblioteca `mysys`:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = CASE WHEN NAME LIKE '%/mysys/%' THEN 'YES' ELSE 'NO' END;
  ```

* Desabilitar um instrumento específico:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Para alternar o estado de um instrumento, "inverta" seu valor `ENABLED`:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(ENABLED = 'YES', 'NO', 'YES')
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Desabilitar timing para todos os eventos:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET TIMED = 'NO';
  ```