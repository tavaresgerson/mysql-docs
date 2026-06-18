#### 7.6.7.10 Monitoramento de operações de clonagem

Esta seção descreve as opções para monitorar operações de clonagem.

- Monitoramento de operações de clonagem usando as tabelas de clonagem do Schema de Desempenho

- Monitoramento de operações de clonagem usando eventos de estágio do Schema de desempenho

- Monitoramento de operações de clonagem usando o instrumentação de clonagem do Schema de Desempenho

- A variável de status Com\_clone

##### Monitoramento de operações de clonagem usando as tabelas de clonagem do Schema de Desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Você pode monitorar o status e o progresso de uma operação de clonagem na instância do servidor MySQL do destinatário usando as tabelas `clone_status` e `clone_progress` do Schema de Desempenho.

Nota

As tabelas do esquema de desempenho `clone_status` e `clone_progress` podem ser usadas para monitorar uma operação de clonagem apenas na instância do servidor MySQL do destinatário. Para monitorar uma operação de clonagem na instância do servidor MySQL do doador, use os eventos da etapa de clonagem, conforme descrito em Monitoramento de operações de clonagem usando eventos da etapa do esquema de desempenho.

- A tabela `clone_status` fornece o estado da operação de clonagem atual ou da última operação executada. Uma operação de clonagem tem quatro estados possíveis: `Not Started`, `In Progress`, `Completed` e `Failed`.

- A tabela `clone_progress` fornece informações sobre o progresso da operação de clone atual ou executada anteriormente, por estágio. Os estágios de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

Os privilégios `SELECT` e `EXECUTE` no Schema de Desempenho são necessários para acessar as tabelas de clone do Schema de Desempenho.

Para verificar o estado de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Consultando a tabela `clone_status`:

   ```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Se ocorrer um erro durante uma operação de clonagem, você pode consultar a tabela `clone_status` para obter informações sobre o erro:

```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```

Para rever os detalhes de cada etapa de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Interrogue a tabela `clone_progress`. Por exemplo, a seguinte consulta fornece dados de estado e hora de término para cada etapa da operação de clonagem:

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

   Para obter informações sobre outros pontos de dados de status e progresso de clone que você pode monitorar, consulte a Seção 29.12.19, “Tabelas de Clone do Schema de Desempenho”.

##### Monitoramento de operações de clonagem usando eventos de estágio do Schema de desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Existem três eventos de estágio para monitorar o progresso de uma operação de clonagem. Cada evento de estágio relata os valores `WORK_COMPLETED` e `WORK_ESTIMATED`. Os valores relatados são revisados à medida que a operação avança.

Esse método de monitoramento de uma operação de clonagem pode ser usado na instância do servidor MySQL do doador ou do receptor.

Em ordem de ocorrência, os eventos da fase da operação de clonagem incluem:

- `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivos da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são pedaços de arquivos. O número de arquivos a serem transferidos é conhecido no início da fase de cópia de arquivos, e o número de pedaços é estimado com base no número de arquivos. `WORK_ESTIMATED` é definido para o número de pedaços de arquivos estimados. `WORK_COMPLETED` é atualizado após cada pedaço ser enviado.

- `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia da página da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são páginas. Uma vez que a fase de cópia do arquivo é concluída, o número de páginas a serem transferidas é conhecido, e `WORK_ESTIMATED` é definido para esse valor. `WORK_COMPLETED` é atualizado após cada página ser enviada.

- `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são blocos de cópia de volta. Uma vez que a fase de cópia de página é concluída, o número de blocos de cópia de volta a serem transferidos é conhecido, e `WORK_ESTIMATED` é definido para esse valor. `WORK_COMPLETED` é atualizado após cada bloco ser enviado.

O exemplo a seguir demonstra como habilitar os instrumentos de evento `stage/innodb/clone%` e as tabelas de consumo relacionadas para monitorar uma operação de clonagem. Para obter informações sobre os instrumentos de evento de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative os instrumentos `stage/innodb/clone%`:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```

2. Ative as tabelas de consumo de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Execute uma operação de clonagem. Neste exemplo, um diretório de dados local é clonado para um diretório chamado `cloned_dir`.

   ```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```

4. Verifique o progresso da operação de clonagem consultando a tabela do Schema de Desempenho `events_stages_current`. O evento de estágio mostrado difere dependendo da fase de clonagem em andamento. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` mostra o trabalho total necessário.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de clonagem tiver sido concluída. Nesse caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

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

##### Monitoramento de operações de clonagem usando o instrumentação de clonagem do Schema de Desempenho

O Schema de Desempenho oferece instrumentação para monitoramento avançado do desempenho das operações de clone. Para ver a instrumentação de clone disponível e emitir a seguinte consulta:

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

###### Aguarde Instrumentos

Os instrumentos de espera do esquema de desempenho rastreiam eventos que levam tempo. Os instrumentos de evento de espera de clonagem incluem:

- `wait/synch/mutex/innodb/clone_snapshot_mutex`: Acompanha os eventos de espera para o mutante do snapshot do clone, que sincroniza o acesso ao objeto de snapshot dinâmico (no doador e no receptor) entre vários threads de clone.

- `wait/synch/mutex/innodb/clone_sys_mutex`: Acompanha os eventos de espera para o mutex do sistema clone. Há um objeto de sistema clone em uma instância do servidor MySQL. Este mutex sincroniza o acesso ao objeto de sistema clone no doador e no receptor. Ele é adquirido por threads de clone e por outros threads de primeiro plano e de segundo plano.

- `wait/synch/mutex/innodb/clone_task_mutex`: Acompanha os eventos de espera para o mutex da tarefa de clone, usado para a gestão da tarefa de clone. O `clone_task_mutex` é adquirido pelas threads de clone.

- `wait/io/file/innodb/innodb_clone_file`: Registra todas as operações de espera de E/S para os arquivos sobre os quais o clone opera.

Para obter informações sobre o monitoramento das espera dos mutexes `InnoDB`, consulte a Seção 17.16.2, “Monitoramento das Espera dos Mutex InnoDB Usando o Gerenciamento de Desempenho”. Para obter informações sobre o monitoramento dos eventos de espera em geral, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Gerenciamento de Desempenho”.

###### Instrumentos de palco

Os eventos de estágio do Schema de desempenho rastreiam os passos que ocorrem durante o processo de execução das declarações. Os instrumentos de clonagem de eventos de estágio incluem:

- `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia do arquivo da operação de clonagem.

- `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem.

- `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia da página da operação de clonagem.

Para obter informações sobre o monitoramento de operações de clonagem usando eventos de estágio, consulte Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho. Para informações gerais sobre o monitoramento de eventos de estágio, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

###### Instrumentos de declaração

Os eventos de declaração do Schema de desempenho rastreiam a execução das declarações. Quando uma operação de clone é iniciada, os diferentes tipos de declarações rastreadas pelos instrumentos de declaração de clone podem ser executados em paralelo. Você pode observar esses eventos de declaração no Schema de desempenho nas tabelas de eventos de declaração. O número de declarações que são executadas depende das configurações `clone_max_concurrency` e `clone_autotune_concurrency`.

Os instrumentos de declaração de eventos clonados incluem:

- `statement/abstract/clone`: Acompanha eventos de declaração para qualquer operação de clone antes que ela seja classificada como um tipo de operação local, cliente ou servidor.

- `statement/clone/local`: Registra eventos de declaração de clone para operações de clone locais; gerado quando uma declaração `CLONE LOCAL` é executada.

- `statement/clone/client`: Acompanha os eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do destinatário; gerado quando uma declaração `CLONE INSTANCE` é executada no destinatário.

- `statement/clone/server`: Acompanha os eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do doador; gerado quando uma declaração `CLONE INSTANCE` é executada no destinatário.

Para obter informações sobre o monitoramento de eventos de declarações do Schema de Desempenho, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

###### Instrumentos de Memória

Os instrumentos de memória do Schema de desempenho rastreiam o uso da memória. Os instrumentos de uso de memória de clonagem incluem:

- `memory/innodb/clone`: Acompanha a memória alocada por `InnoDB` para o instantâneo dinâmico.

- `memory/clone/data`: Acompanha a memória alocada pelo plugin clone durante uma operação de clone.

Para obter informações sobre o monitoramento do uso da memória usando o Gerenciamento de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

##### A variável de status Com\_clone

A variável de status `Com_clone` fornece uma contagem das execuções da instrução `CLONE`.

Para mais informações, consulte a discussão sobre as variáveis de contagem de declarações `Com_xxx` na Seção 7.1.10, “Variáveis de Status do Servidor”.
