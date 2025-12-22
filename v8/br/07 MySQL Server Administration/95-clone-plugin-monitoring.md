#### 7.6.7.10 Monitorização das operações de clonagem

Esta secção descreve as opções de monitorização das operações de clonagem.

- Monitoramento de operações de clonagem utilizando tabelas de clonagem de esquema de desempenho
- Monitorização de operações de clonagem utilizando eventos de estágio de esquema de desempenho
- Monitorização de operações de clonagem utilizando o esquema de desempenho Clone Instrumentation
- A variável de status `Com_clone`

##### Monitoramento de operações de clonagem utilizando tabelas de clonagem de esquema de desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e outros fatores relacionados à transferência de dados. Você pode monitorar o status e o progresso de uma operação de clonagem na instância do servidor MySQL receptor usando as tabelas de esquema de desempenho `clone_status` e `clone_progress`.

::: info Note

As tabelas de Esquema de Desempenho `clone_status` e `clone_progress` podem ser usadas para monitorar uma operação de clonagem apenas na instância do servidor MySQL destinatário. Para monitorar uma operação de clonagem na instância do servidor MySQL doador, use os eventos da fase de clonagem, conforme descrito em Monitorar Operações de Clonagem Usando Eventos de Fase de Esquema de Desempenho.

:::

- A tabela `clone_status` fornece o estado da operação de clonagem atual ou última executada. Uma operação de clonagem tem quatro estados possíveis: `Not Started`, `In Progress`, `Completed`, e `Failed`.
- A tabela `clone_progress` fornece informações de progresso para a operação de clonagem atual ou executada pela última vez, por estágio. Os estágios de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

Os privilégios `SELECT` e `EXECUTE` no Performance Schema são necessários para acessar as tabelas de clonagem do Performance Schema.

Para verificar o estado de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Consultar a tabela `clone_status`:

   ```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Caso ocorra uma falha durante uma operação de clonagem, você pode consultar a tabela `clone_status` para obter informações de erro:

```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```

Para rever os detalhes de cada fase de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Por exemplo, a seguinte consulta fornece dados de estado e tempo de término para cada estágio da operação de clonagem:

   ```
   mysql> SELECT STAGE, STATE, END_TIME FROM performance_schema.clone_progress;
   +-----------+-----------+----------------------------+
   | stage     | state     | end_time                   |
   +-----------+-----------+----------------------------+
   | DROP DATA | Completed | 2019-01-27 22:45:43.141261 |
   | FILE COPY | Completed | 2019-01-27 22:45:44.457572 |
   | PAGE COPY | Completed | 2019-01-27 22:45:44.577330 |
   | REDO COPY | Completed | 2019-01-27 22:45:44.679570 |
   | FILE SYNC | Completed | 2019-01-27 22:45:44.918547 |
   | RESTART   | Completed | 2019-01-27 22:45:48.583565 |
   | RECOVERY  | Completed | 2019-01-27 22:45:49.626595 |
   +-----------+-----------+----------------------------+
   ```

   Para outros pontos de dados sobre o estado e progresso da clonagem que possam ser monitorizados, consulte a secção 29.12.19, Performance Schema Clone Tables.

##### Monitorização de operações de clonagem utilizando eventos de estágio de esquema de desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e outros fatores relacionados à transferência de dados. Existem três eventos de estágio para monitorar o progresso de uma operação de clonagem. Cada evento de estágio informa valores de `WORK_COMPLETED` e `WORK_ESTIMATED`. Os valores relatados são revisados à medida que a operação progride.

Este método de monitoramento de uma operação de clonagem pode ser usado na instância do servidor MySQL doador ou receptor.

Por ordem de ocorrência, os eventos da fase de operação de clonagem incluem:

- `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivo da operação de clonagem. `WORK_ESTIMATED` e `WORK_COMPLETED` unidades são pedaços de arquivo. O número de arquivos a serem transferidos é conhecido no início da fase de cópia de arquivo, e o número de pedaços é estimado com base no número de arquivos. `WORK_ESTIMATED` é definido para o número de pedaços de arquivo estimados. `WORK_COMPLETED` é atualizado após cada pedaço é enviado.
- `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia de página da operação de clonagem. `WORK_ESTIMATED` e `WORK_COMPLETED` unidades são páginas. Uma vez concluída a fase de cópia de arquivo, o número de páginas a serem transferidas é conhecido, e `WORK_ESTIMATED` é definido para este valor. `WORK_COMPLETED` é atualizado após cada página ser enviada.
- `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de repetição da operação de clonagem. `WORK_ESTIMATED` e `WORK_COMPLETED` unidades são pedaços de repetição. Uma vez que a fase de cópia da página é concluída, o número de pedaços de repetição a serem transferidos é conhecido, e `WORK_ESTIMATED` é definido para este valor. `WORK_COMPLETED` é atualizado após cada pedaço ser enviado.

O exemplo a seguir demonstra como habilitar os instrumentos de evento `stage/innodb/clone%` e tabelas de consumidores relacionadas para monitorar uma operação de clonagem.

1. Ativar os instrumentos `stage/innodb/clone%`:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```
2. Ative as tabelas de consumo do evento do palco, que incluem `events_stages_current`, `events_stages_history`, e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```
3. Execute uma operação de clonagem. Neste exemplo, um diretório de dados local é clonado para um diretório chamado `cloned_dir`.

   ```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```
4. Verifique o progresso da operação de clonagem consultando a tabela do Esquema de Desempenho `events_stages_current` . O evento de estágio mostrado difere dependendo da fase de clonagem em andamento. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` mostra o trabalho necessário no total.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de clonagem tiver terminado. Neste caso, você pode verificar a tabela `events_stages_history` para ver os dados de evento para a operação concluída. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (file copy) |            301 |            301 |
   | stage/innodb/clone (page copy) |              0 |              0 |
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

##### Monitorização de operações de clonagem utilizando o esquema de desempenho Clone Instrumentation

O Performance Schema fornece instrumentação para monitoramento avançado do desempenho das operações de clonagem.

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE '%clone%';
+---------------------------------------------------+---------+
| NAME                                              | ENABLED |
+---------------------------------------------------+---------+
| wait/synch/mutex/innodb/clone_snapshot_mutex      | NO      |
| wait/synch/mutex/innodb/clone_sys_mutex           | NO      |
| wait/synch/mutex/innodb/clone_task_mutex          | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_donor_list  | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_handler_run | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_query       | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_read_mode   | NO      |
| wait/synch/cond/group_rpl/COND_clone_handler_run  | NO      |
| wait/io/file/innodb/innodb_clone_file             | YES     |
| stage/innodb/clone (file copy)                    | YES     |
| stage/innodb/clone (redo copy)                    | YES     |
| stage/innodb/clone (page copy)                    | YES     |
| statement/abstract/clone                          | YES     |
| statement/clone/local                             | YES     |
| statement/clone/client                            | YES     |
| statement/clone/server                            | YES     |
| memory/innodb/clone                               | YES     |
| memory/clone/data                                 | YES     |
+---------------------------------------------------+---------+
```

###### Instrumentos de espera

Os instrumentos de espera de esquema de desempenho rastreiam eventos que levam tempo.

- `wait/synch/mutex/innodb/clone_snapshot_mutex`: Traça eventos de espera para o mutex de snapshot de clone, que sincroniza o acesso ao objeto de snapshot dinâmico (no doador e no receptor) entre vários threads de clone.
- `wait/synch/mutex/innodb/clone_sys_mutex`: Traça eventos de espera para o mutex do sistema de clonagem. Há um objeto do sistema de clonagem em uma instância do servidor MySQL. Este mutex sincroniza o acesso ao objeto do sistema de clonagem no doador e no destinatário. Ele é adquirido por threads de clonagem e outros threads de primeiro plano e fundo.
- `wait/synch/mutex/innodb/clone_task_mutex`: rastreia eventos de espera para o mutex da tarefa de clonagem, usado para gerenciamento de tarefas de clonagem. O `clone_task_mutex` é adquirido por threads de clonagem.
- `wait/io/file/innodb/innodb_clone_file`: Rastreia todas as operações de espera de E/S para arquivos em que o clone opera.

Para obter informações sobre o monitoramento de mutex waits do `InnoDB`, consulte a Seção 17.16.2, "Monitoramento de mutex waits do InnoDB usando o esquema de desempenho". Para informações sobre o monitoramento de eventos de espera em geral, consulte a Seção 29.12.4, "Tabelas de eventos de espera do esquema de desempenho".

###### Instrumentos de palco

Performance Os eventos de estágio do esquema rastreiam as etapas que ocorrem durante o processo de execução de instruções.

- `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de ficheiro da operação de clonagem.
- `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de repetição da operação de clonagem.
- `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia de página da operação de clonagem.

Para obter informações sobre o controlo de operações de clonagem utilizando eventos de estágio, consulte Monitoring Cloning Operations Using Performance Schema Stage Events (Monitoramento de operações de clonagem utilizando eventos de estágio do esquema de desempenho).

###### Instrumentos de declaração

Quando uma operação de clonagem é iniciada, os diferentes tipos de instrução rastreados pelos instrumentos de instrução de clonagem podem ser executados em paralelo. Você pode observar esses eventos de instrução nas tabelas de eventos de instrução do esquema de desempenho. O número de instruções executadas depende das configurações `clone_max_concurrency` e `clone_autotune_concurrency`.

Os instrumentos de evento de instruções de clonagem incluem:

- `statement/abstract/clone`: rastreia eventos de instrução para qualquer operação de clone antes de ser classificada como um tipo de operação local, cliente ou servidor.
- `statement/clone/local`: rastreia eventos de instruções de clonagem para operações de clonagem locais; gerado ao executar uma instrução `CLONE LOCAL`.
- `statement/clone/client`: Rastreia eventos de instrução de clonagem remota que ocorrem na instância do servidor MySQL do destinatário; gerado ao executar uma instrução `CLONE INSTANCE` no destinatário.
- `statement/clone/server`: Rastreia eventos de instrução de clonagem remota que ocorrem na instância do servidor MySQL doador; gerado ao executar uma instrução `CLONE INSTANCE` no destinatário.

Para obter informações sobre a monitorização de eventos de declaração do esquema de desempenho, ver secção 29.12.6, "Tabelas de eventos de declaração do esquema de desempenho".

###### Instrumentos de memória

Performance Os instrumentos de memória de esquema rastreiam o uso de memória.

- `memory/innodb/clone`: rastreia a memória alocada por `InnoDB` para o instantâneo dinâmico.
- `memory/clone/data`: rastreia a memória alocada pelo plugin clone durante uma operação de clone.

Para obter informações sobre o controlo da utilização da memória através do esquema de desempenho, ver secção 29.12.20.10, "Tabelas de síntese da memória".

##### A variável de status `Com_clone`

A variável de status `Com_clone` fornece uma contagem de execuções de instruções `CLONE`.

Para obter mais informações, consulte a discussão sobre as variáveis de contador de instruções `Com_xxx` na Seção 7.1.10, "Variáveis de status do servidor".
