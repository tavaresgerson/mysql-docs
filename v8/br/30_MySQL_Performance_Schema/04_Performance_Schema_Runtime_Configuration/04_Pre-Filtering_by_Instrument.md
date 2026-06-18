### 29.4.4 Pré-filtragem por instrumento

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

Para controlar se um instrumento está habilitado, defina sua coluna `ENABLED` para `YES` ou `NO`. Para configurar se as informações de temporização devem ser coletadas para um instrumento habilitado, defina o valor da coluna `TIMED` para `YES` ou `NO`. A definição da coluna `TIMED` afeta o conteúdo da tabela do Schema de Desempenho, conforme descrito na Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

As modificações na maioria das linhas `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes ao iniciar o servidor; alterá-las durante a execução não tem efeito. Isso afeta principalmente mutexes, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

A tabela `setup_instruments` fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou fio monitorado, outras tabelas podem ser usadas conforme descrito na Seção 29.4.3, “Pré-filtragem de Eventos”.

Os exemplos a seguir demonstram possíveis operações na tabela `setup_instruments`. Essas alterações, assim como outras operações de pré-filtragem, afetam todos os usuários. Algumas dessas consultas usam o operador `LIKE` e um instrumento de correspondência de padrões. Para obter informações adicionais sobre como especificar padrões para selecionar instrumentos, consulte a Seção 29.4.9, “Nomeando Instrumentos ou Consumidores para Operações de Filtragem”.

- Desative todos os instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO';
  ```

  Agora, nenhum evento é coletado.

- Desative todos os instrumentos de arquivo, adicionando-os ao conjunto atual de instrumentos desativados:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'wait/io/file/%';
  ```

- Desative apenas os instrumentos de arquivo, habilite todos os outros instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(NAME LIKE 'wait/io/file/%', 'NO', 'YES');
  ```

- Ative todos, exceto esses instrumentos, na biblioteca `mysys`:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = CASE WHEN NAME LIKE '%/mysys/%' THEN 'YES' ELSE 'NO' END;
  ```

- Desativar um instrumento específico:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

- Para alternar o estado de um instrumento, “inverte” seu valor `ENABLED`:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(ENABLED = 'YES', 'NO', 'YES')
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

- Desative o temporizador para todos os eventos:

  ```
  UPDATE performance_schema.setup_instruments
  SET TIMED = 'NO';
  ```
