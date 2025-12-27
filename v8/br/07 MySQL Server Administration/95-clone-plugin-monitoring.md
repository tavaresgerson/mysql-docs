#### 7.6.7.10 Monitoramento de Operações de Clonagem

Esta seção descreve as opções para monitorar operações de clonagem.

* Monitoramento de Operações de Clonagem usando Tabelas de Clone do Schema de Desempenho
* Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho
* Monitoramento de Operações de Clonagem Usando Instrumentação de Clone do Schema de Desempenho
* A Variável de Status `Com_clone`

##### Monitoramento de Operações de Clonagem usando Tabelas de Clone do Schema de Desempenho

Uma operação de clonagem pode levar algum tempo para ser concluída, dependendo da quantidade de dados e de outros fatores relacionados à transferência de dados. Você pode monitorar o status e o progresso de uma operação de clonagem na instância do servidor MySQL do destinatário usando as tabelas `clone_status` e `clone_progress` do Schema de Desempenho.

::: info Nota

As tabelas `clone_status` e `clone_progress` do Schema de Desempenho podem ser usadas para monitorar uma operação de clonagem na instância do servidor MySQL do destinatário. Para monitorar uma operação de clonagem na instância do servidor MySQL do doador, use os eventos de estágio de clone, conforme descrito em Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Schema de Desempenho.

:::

* A tabela `clone_status` fornece o estado da operação de clonagem atual ou da última executada. Uma operação de clonagem tem quatro estados possíveis: `Não Iniciada`, `Em Processo`, `Concluída` e `Falha`.
* A tabela `clone_progress` fornece informações de progresso para a operação de clonagem atual ou da última executada, por estágio. Os estágios de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

Os privilégios de `SELECT` e `EXECUTE` no Schema de Desempenho são necessários para acessar as tabelas de clone do Schema de Desempenho.

Para verificar o estado de uma operação de clonagem:

1. Conecte-se à instância do servidor MySQL do destinatário.
2. Faça uma consulta à tabela `clone_status`:

   ```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Se ocorrer uma falha durante uma operação de clonagem, você pode consultar a tabela `clone_status` para obter informações de erro:

```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```cJA0KQ34RI```
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
   ```zyFRYGEgKb```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```3aqyH17ZvD```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```FXC2qICHnh```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```fQJendE18J```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```Xq2j585BMl```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (file copy) |            301 |            301 |
   | stage/innodb/clone (page copy) |              0 |              0 |
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```6vzW5eAfGv```

###### Instrumentos de Espera

Os instrumentos de espera do Schema de Desempenho rastreiam eventos que levam tempo. Os instrumentos de evento de espera para clonagem incluem:

* `wait/synch/mutex/innodb/clone_snapshot_mutex`: Rastrea eventos de espera para o mutex de snapshot de clonagem, que sincroniza o acesso ao objeto de snapshot dinâmico (no doador e no receptor) entre vários threads de clonagem.
* `wait/synch/mutex/innodb/clone_sys_mutex`: Rastrea eventos de espera para o mutex sys de clonagem. Há um objeto de sistema de clonagem em uma instância do servidor MySQL. Esse mutex sincroniza o acesso ao objeto de sistema de clonagem no doador e no receptor. Ele é adquirido por threads de clonagem e outros threads de primeiro e segundo plano.
* `wait/synch/mutex/innodb/clone_task_mutex`: Rastrea eventos de espera para o mutex de tarefa de clonagem, usado para gerenciamento de tarefas de clonagem. O `clone_task_mutex` é adquirido por threads de clonagem.
* `wait/io/file/innodb/innodb_clone_file`: Rastrea todas as operações de espera de I/O para arquivos sobre os quais a clonagem opera.

Para obter informações sobre o monitoramento das espera dos mutses `InnoDB`, consulte a Seção 17.16.2, “Monitoramento das Espera de Mutses InnoDB Usando o Gerenciamento de Desempenho”. Para obter informações sobre o monitoramento dos eventos de espera em geral, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Gerenciamento de Desempenho”.

###### Instrumentos de Estágio

Os eventos de estágio do Gerenciamento de Desempenho rastreiam os passos que ocorrem durante o processo de execução de instruções. Os instrumentos de evento de estágio de clonagem incluem:

* `stage/innodb/clone (file copy)`: Indica o progresso da fase de cópia de arquivo da operação de clonagem.
* `stage/innodb/clone (redo copy)`: Indica o progresso da fase de cópia de volta da operação de clonagem.
* `stage/innodb/clone (page copy)`: Indica o progresso da fase de cópia de página da operação de clonagem.

Para obter informações sobre o monitoramento das operações de clonagem usando eventos de estágio, consulte Monitoramento de Operações de Clonagem Usando Eventos de Estágio do Gerenciamento de Desempenho. Para informações gerais sobre o monitoramento de eventos de estágio, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Gerenciamento de Desempenho”.

###### Instrumentos de Instrução

Os eventos de instrução do Gerenciamento de Desempenho rastreiam a execução de instruções. Quando uma operação de clonagem é iniciada, os diferentes tipos de instruções rastreados pelos instrumentos de instrução de clonagem podem ser executados em paralelo. Você pode observar esses eventos de instrução nas tabelas de eventos de instrução do Gerenciamento de Desempenho. O número de instruções que são executadas depende das configurações `clone_max_concurrency` e `clone_autotune_concurrency`.

Os instrumentos de evento de instrução de clonagem incluem:

* `statement/abstract/clone`: Acompanha eventos de declaração para qualquer operação de clone antes que ela seja classificada como um tipo de operação local, cliente ou servidor.
* `statement/clone/local`: Acompanha eventos de declaração de clone para operações de clone locais; gerado ao executar uma declaração `CLONE LOCAL`.
* `statement/clone/client`: Acompanha eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do destinatário; gerado ao executar uma declaração `CLONE INSTANCE` no destinatário.
* `statement/clone/server`: Acompanha eventos de declaração de clonagem remota que ocorrem na instância do servidor MySQL do doador; gerado ao executar uma declaração `CLONE INSTANCE` no destinatário.

Para obter informações sobre o monitoramento dos eventos de declaração do Performance Schema, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Performance Schema”.

###### Instrumentos de Memória

Os instrumentos de memória do Performance Schema rastreiam o uso da memória. Os instrumentos de uso de memória de clone incluem:

* `memory/innodb/clone`: Acompanha a memória alocada pelo `InnoDB` para o snapshot dinâmico.
* `memory/clone/data`: Acompanha a memória alocada pelo plugin de clone durante uma operação de clone.

Para obter informações sobre o monitoramento do uso da memória usando o Performance Schema, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

##### A Variável de Status `Com_clone`

A variável de status `Com_clone` fornece um contagem das execuções da declaração `CLONE`.

Para mais informações, consulte a discussão sobre as variáveis de contador de declarações `Com_xxx` na Seção 7.1.10, “Variáveis de Status do Servidor”.