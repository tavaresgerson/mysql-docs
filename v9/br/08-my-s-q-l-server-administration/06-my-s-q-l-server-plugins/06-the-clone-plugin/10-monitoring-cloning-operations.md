#### 7.6.6.10 Monitoramento de Operações de Clonagem

Esta seção descreve as opções para monitorar operações de clonagem.

* Monitoramento de Operações de Clonagem usando Tabelas de Clone do Schema de Desempenho
* Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho
* Monitoramento de Operações de Clonagem Usando Instrumentação de Clone do Schema de Desempenho

* A Variável de Status `com_clone`

##### Monitoramento de Operações de Clonagem usando Tabelas de Clone do Schema de Desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Você pode monitorar o status e o progresso de uma operação de clonagem na instância do servidor MySQL do destinatário usando as tabelas `clone_status` e `clone_progress` do Schema de Desempenho.

Nota

As tabelas `clone_status` e `clone_progress` do Schema de Desempenho podem ser usadas para monitorar uma operação de clonagem na instância do servidor MySQL do destinatário. Para monitorar uma operação de clonagem na instância do servidor MySQL do doador, use os eventos de estágio de clone, conforme descrito em Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho.

* A tabela `clone_status` fornece o estado da operação de clonagem atual ou da última executada. Uma operação de clonagem tem quatro estados possíveis: `Não Iniciada`, `Em Processo`, `Concluída` e `Falha`.

* A tabela `clone_progress` fornece informações de progresso para a operação de clonagem atual ou da última executada, por estágio. Os estágios de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

Os privilégios de `SELECT` e `EXECUTE` no Schema de Desempenho são necessários para acessar as tabelas de clone do Schema de Desempenho.

Para verificar o estado de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Faça uma consulta à tabela `clone_status`:

Se ocorrer uma falha durante uma operação de clonagem, você pode consultar a tabela `clone_status` para obter informações sobre o erro:

```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Para revisar os detalhes de cada etapa de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Faça uma consulta à tabela `clone_progress`. Por exemplo, a seguinte consulta fornece dados de estado e tempo de término para cada etapa da operação de clonagem:

   ```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```

   Para outros pontos de dados de status e progresso de clonagem que você pode monitorar, consulte a Seção 29.12.19, “Tabelas de Clonagem do Schema de Desempenho”.

##### Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Existem três eventos de estágio para monitorar o progresso de uma operação de clonagem. Cada evento de estágio relata os valores `WORK_COMPLETED` e `WORK_ESTIMATED`. Os valores relatados são revisados à medida que a operação progride.

Esse método de monitoramento de uma operação de clonagem pode ser usado na instância do servidor MySQL do doador ou do destinatário.

Em ordem de ocorrência, os eventos de estágio da operação de clonagem incluem:

* `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivos da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são pedaços de arquivo. O número de arquivos a serem transferidos é conhecido no início da fase de cópia de arquivos, e o número de pedaços é estimado com base no número de arquivos. `WORK_ESTIMATED` é definido para o número de pedaços de arquivo estimados. `WORK_COMPLETED` é atualizado após cada pedaço ser enviado.

* `stage/innodb/clone (cópia de página)`: Indica o progresso da fase de cópia de página da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são páginas. Uma vez que a fase de cópia de arquivo é concluída, o número de páginas a serem transferidas é conhecido, e `WORK_ESTIMATED` é definido para esse valor. `WORK_COMPLETED` é atualizado após cada página ser enviada.

* `stage/innodb/clone (cópia de refazer)`: Indica o progresso da fase de cópia de refazer da operação de clonagem. As unidades `WORK_ESTIMATED` e `WORK_COMPLETED` são fragmentos de refazer. Uma vez que a fase de cópia de página é concluída, o número de fragmentos de refazer a serem transferidos é conhecido, e `WORK_ESTIMATED` é definido para esse valor. `WORK_COMPLETED` é atualizado após cada fragmento ser enviado.

O exemplo a seguir demonstra como habilitar os instrumentos de evento `stage/innodb/clone%` e as tabelas de consumidores relacionadas para monitorar uma operação de clonagem. Para obter informações sobre os instrumentos de evento de estágio do Schema de Desempenho e as tabelas de consumidores relacionadas, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Habilite os instrumentos `stage/innodb/clone%`:

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

2. Habilite as tabelas de consumidores de evento de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```

3. Execute uma operação de clonagem. Neste exemplo, um diretório de dados local é clonado para um diretório chamado `cloned_dir`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

4. Verifique o progresso da operação de clonagem consultando a tabela `events_stages_current` do Schema de Desempenho. O evento de estágio mostrado difere dependendo da fase de clonagem que está em progresso. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` mostra o trabalho necessário no total.

   ```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação de clonagem tiver sido concluída. Nesse caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

##### Monitoramento de Operações de Clonagem Usando Instrumentação de Clone do Schema de Desempenho

O Schema de Desempenho fornece instrumentação para monitoramento avançado do desempenho de operações de clonagem. Para visualizar a instrumentação de clonagem disponível, execute a seguinte consulta:

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

###### Wait Instruments

Os instrumentos de espera do Schema de Desempenho rastreiam eventos que levam tempo. Os instrumentos de evento de espera do clone incluem:

* `wait/synch/mutex/innodb/clone_snapshot_mutex`: Rastrea eventos de espera para o mutex de snapshot de clone, que sincroniza o acesso ao objeto de snapshot dinâmico (no doador e no receptor) entre vários threads de clone.

* `wait/synch/mutex/innodb/clone_sys_mutex`: Rastrea eventos de espera para o mutex sys clone. Há um objeto de sistema clone em uma instância do servidor MySQL. Esse mutex sincroniza o acesso ao objeto de sistema clone no doador e no receptor. Ele é adquirido por threads de clone e outros threads de primeiro e segundo plano.

* `wait/synch/mutex/innodb/clone_task_mutex`: Rastrea eventos de espera para o mutex de tarefa de clone, usado para gerenciamento de tarefas de clone. O `clone_task_mutex` é adquirido por threads de clone.

* `wait/io/file/innodb/innodb_clone_file`: Rastrea todas as operações de espera de I/O para arquivos sobre os quais a clonagem opera.

Para obter informações sobre o monitoramento de espera de mutexes `InnoDB`, consulte a Seção 17.16.2, “Monitoramento de Espera de Mutex InnoDB Usando o Schema de Desempenho”. Para obter informações sobre o monitoramento de eventos de espera em geral, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

###### Instrumentos de Estágio
```

Os eventos de esquema de execução de instruções rastreiam as etapas que ocorrem durante o processo de execução de instruções. Os instrumentos de evento de esquema de execução de instruções incluem:

* `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivo da operação de clonagem.

* `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem.

* `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia de página da operação de clonagem.

Para obter informações sobre o monitoramento de operações de clonagem usando eventos de esquema de execução, consulte Monitoramento de Operações de Clonagem Usando Eventos de Esquema de Execução. Para informações gerais sobre o monitoramento de eventos de esquema, consulte a Seção 29.12.5, “Tabelas de Eventos de Esquema de Execução”.

###### Instrumentos de Instrução

Os eventos de execução de instruções do Performance Schema rastreiam a execução de instruções. Quando uma operação de clonagem é iniciada, os diferentes tipos de instruções rastreados pelos instrumentos de instrução de clonagem podem ser executados em paralelo. Você pode observar esses eventos de instrução nas tabelas de eventos de instrução do Performance Schema. O número de instruções que são executadas depende das configurações `clone_max_concurrency` e `clone_autotune_concurrency`.

Os instrumentos de evento de instrução de clonagem incluem:

* `statement/abstract/clone`: Rastrea eventos de instrução para qualquer operação de clonagem antes de ser classificada como um tipo de operação local, cliente ou servidor.

* `statement/clone/local`: Rastrea eventos de instrução de clonagem para operações de clonagem locais; gerados ao executar uma instrução `CLONE LOCAL`.

* `statement/clone/client`: Rastrea eventos de clonagem de instruções remotos que ocorrem na instância do servidor MySQL do destinatário; gerados ao executar uma instrução `CLONE INSTANCE` no destinatário.

* `statement/clone/server`: Acompanha eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do doador; gerado quando uma declaração `CLONE INSTANCE` é executada no destinatário.

Para obter informações sobre o monitoramento dos eventos de declaração do Schema de Desempenho, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

###### Instrumentos de Memória

Os instrumentos de memória do Schema de Desempenho acompanham o uso da memória. Os instrumentos de uso de memória de clonagem incluem:

* `memory/innodb/clone`: Acompanha a memória alocada pelo `InnoDB` para o instantâneo dinâmico.

* `memory/clone/data`: Acompanha a memória alocada pelo plugin de clonagem durante uma operação de clonagem.

Para obter informações sobre o monitoramento do uso da memória usando o Schema de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

##### A Variável de Status Com_clone

A variável de status `Com_clone` fornece um contagem das execuções da declaração `CLONE`.

Para mais informações, consulte a discussão sobre as variáveis de contador de declarações `Com_xxx` na Seção 7.1.10, “Variáveis de Status do Servidor”.