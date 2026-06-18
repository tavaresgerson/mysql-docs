#### 21.6.3.2 Eventos de Log do NDB Cluster

Um relatório de evento registrado nos logs de evento tem o seguinte formato:

```sql
datetime [string] severity -- message
```

Por exemplo:

```sql
09:19:30 2005-07-24 [NDB] INFO -- Node 4 Start phase 4 completed
```

Esta seção discute todos os eventos reportáveis, ordenados por categoria e nível de severidade dentro de cada categoria.

Nas descrições dos eventos, GCP e LCP significam “Global Checkpoint” e “Local Checkpoint”, respectivamente.

##### Eventos CONNECTION

Estes eventos estão associados a conexões entre nodes do Cluster.

**Tabela 21.50 Eventos associados a conexões entre nodes do cluster**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `Connected` | 8 | `INFO` | Data nodes conectados |
| `Disconnected` | 8 | `ALERT` | Data nodes desconectados |
| `CommunicationClosed` | 8 | `INFO` | Conexão de SQL node ou data node fechada |
| `CommunicationOpened` | 8 | `INFO` | Conexão de SQL node ou data node aberta |
| `ConnectedApiVersion` | 8 | `INFO` | Conexão usando versão da API |

##### Eventos CHECKPOINT

As mensagens de logging mostradas aqui estão associadas a Checkpoints.

**Tabela 21.51 Eventos associados a Checkpoints**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `GlobalCheckpointStarted` | 9 | `INFO` | Início do GCP: REDO log é escrito em disco |
| `GlobalCheckpointCompleted` | 10 | `INFO` | GCP finalizado |
| `LocalCheckpointStarted` | 7 | `INFO` | Início do LCP: dados escritos em disco |
| `LocalCheckpointCompleted` | 7 | `INFO` | LCP concluído normalmente |
| `LCPStoppedInCalcKeepGci` | 0 | `ALERT` | LCP interrompido |
| `LCPFragmentCompleted` | 11 | `INFO` | LCP em um fragmento foi concluído |
| `UndoLogBlocked` | 7 | `INFO` | UNDO logging bloqueado; Buffer próximo ao overflow |
| `RedoStatus` | 7 | `INFO` | Status do Redo |

##### Eventos STARTUP

Os eventos a seguir são gerados em resposta à inicialização de um node ou do Cluster e de seu sucesso ou falha. Eles também fornecem informações relacionadas ao progresso do processo de inicialização, incluindo informações sobre atividades de logging.

**Tabela 21.52 Eventos relacionados à inicialização de um node ou cluster**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `NDBStartStarted` | 1 | `INFO` | Fases de inicialização do Data Node iniciadas (todos os nodes iniciando) |
| `NDBStartCompleted` | 1 | `INFO` | Fases de inicialização concluídas, todos os data nodes |
| `STTORRYRecieved` | 15 | `INFO` | Blocos recebidos após a conclusão do restart |
| `StartPhaseCompleted` | 4 | `INFO` | Fase *`X`* de inicialização do Data Node concluída |
| `CM_REGCONF` | 3 | `INFO` | Node foi incluído com sucesso no cluster; mostra o node, o managing node e o ID dinâmico |
| `CM_REGREF` | 8 | `INFO` | Node foi recusado para inclusão no cluster; não pode ser incluído no cluster devido a configuração incorreta, incapacidade de estabelecer comunicação ou outro problema |
| `FIND_NEIGHBOURS` | 8 | `INFO` | Mostra os data nodes vizinhos |
| `NDBStopStarted` | 1 | `INFO` | Data node shutdown iniciado |
| `NDBStopCompleted` | 1 | `INFO` | Data node shutdown completo |
| `NDBStopForced` | 1 | `ALERT` | Shutdown forçado do data node |
| `NDBStopAborted` | 1 | `INFO` | Incapaz de desligar o data node normalmente |
| `StartREDOLog` | 4 | `INFO` | Novo redo log iniciado; GCI keep *`X`*, GCI restaurável mais novo *`Y`* |
| `StartLog` | 10 | `INFO` | Novo log iniciado; parte do log *`X`*, start MB *`Y`*, stop MB *`Z`* |
| `UNDORecordsExecuted` | 15 | `INFO` | Registros Undo executados |
| `StartReport` | 4 | `INFO` | Relatório iniciado |
| `LogFileInitStatus` | 7 | `INFO` | Status de inicialização do arquivo de Log |
| `LogFileInitCompStatus` | 7 | `INFO` | Status de conclusão do arquivo de Log |
| `StartReadLCP` | 10 | `INFO` | Início da leitura para Local Checkpoint |
| `ReadLCPComplete` | 10 | `INFO` | Leitura para Local Checkpoint concluída |
| `RunRedo` | 8 | `INFO` | Executando o redo log |
| `RebuildIndex` | 10 | `INFO` | Reconstruindo Indexes |

##### Eventos NODERESTART

Os eventos a seguir são gerados ao reiniciar um node e se relacionam com o sucesso ou falha do processo de restart do node.

**Tabela 21.53 Eventos relacionados ao restart de um node**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `NR_CopyDict` | 7 | `INFO` | Cópia de informações do Dictionary concluída |
| `NR_CopyDistr` | 7 | `INFO` | Cópia de informações de distribuição concluída |
| `NR_CopyFragsStarted` | 7 | `INFO` | Iniciando a cópia de fragmentos |
| `NR_CopyFragDone` | 10 | `INFO` | Cópia de um fragmento concluída |
| `NR_CopyFragsCompleted` | 7 | `INFO` | Cópia de todos os fragmentos concluída |
| `NodeFailCompleted` | 8 | `ALERT` | Fase de falha do Node concluída |
| `NODE_FAILREP` | 8 | `ALERT` | Reporta que um node falhou |
| `ArbitState` | 6 | `INFO` | Reporta se um árbitro foi encontrado ou não; existem sete resultados possíveis ao procurar um árbitro, listados aqui: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Management server reinicia Thread de arbitragem [state=*`X`*] </p></li><li class="listitem"><p> Preparar node árbitro *`X`* [ticket=*`Y`*] </p></li><li class="listitem"><p> Receber node árbitro *`X`* [ticket=*`Y`*] </p></li><li class="listitem"><p> Node árbitro *`X`* iniciado [ticket=*`Y`*] </p></li><li class="listitem"><p> Node árbitro *`X`* perdido - falha de processo [state=*`Y`*] </p></li><li class="listitem"><p> Node árbitro *`X`* perdido - saída do processo [state=*`Y`*] </p></li><li class="listitem"><p> Node árbitro *`X`* perdido &lt;mensagem de erro&gt; [state=*`Y`*] </p></li></ul> </div> |
| `ArbitResult` | 2 | `ALERT` | Reporta resultados da arbitragem; existem oito resultados possíveis diferentes para tentativas de arbitragem, listados aqui: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Verificação de arbitragem falhou: menos de 1/2 nodes restantes </p></li><li class="listitem"><p> Verificação de arbitragem bem-sucedida: maioria do grupo de nodes </p></li><li class="listitem"><p> Verificação de arbitragem falhou: grupo de nodes ausente </p></li><li class="listitem"><p> Particionamento de rede: arbitragem necessária </p></li><li class="listitem"><p> Arbitragem bem-sucedida: resposta afirmativa do node *`X`* </p></li><li class="listitem"><p> Arbitragem falhou: resposta negativa do node *`X`* </p></li><li class="listitem"><p> Particionamento de rede: nenhum árbitro disponível </p></li><li class="listitem"><p> Particionamento de rede: nenhum árbitro configurado </p></li></ul> </div> |
| `GCP_TakeoverStarted` | 7 | `INFO` | GCP takeover iniciado |
| `GCP_TakeoverCompleted` | 7 | `INFO` | GCP takeover completo |
| `LCP_TakeoverStarted` | 7 | `INFO` | LCP takeover iniciado |
| `LCP_TakeoverCompleted` | 7 | `INFO` | LCP takeover completo (state = *`X`*) |
| `ConnectCheckStarted` | 6 | `INFO` | Verificação de conexão iniciada |
| `ConnectCheckCompleted` | 6 | `INFO` | Verificação de conexão concluída |
| `NodeFailRejected` | 6 | `ALERT` | Fase de falha do Node rejeitada |

##### Eventos STATISTICS

Os eventos a seguir são de natureza estatística. Eles fornecem informações como o número de Transactions e outras operações, a quantidade de dados enviados ou recebidos por nodes individuais e o uso de memória.

**Tabela 21.54 Eventos de natureza estatística**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `TransReportCounters` | 8 | `INFO` | Reporta estatísticas de Transaction, incluindo número de Transactions, commits, reads, simple reads, writes, operações concorrentes, informações de atributos e aborts |
| `OperationReportCounters` | 8 | `INFO` | Número de operações |
| `TableCreated` | 7 | `INFO` | Reporta o número de Tables criadas |
| `JobStatistic` | 9 | `INFO` | Estatísticas médias internas de agendamento de Job |
| `ThreadConfigLoop` | 9 | `INFO` | Número de loops de configuração de Thread |
| `SendBytesStatistic` | 9 | `INFO` | Número médio de bytes enviados ao node *`X`* |
| `ReceiveBytesStatistic` | 9 | `INFO` | Número médio de bytes recebidos do node *`X`* |
| `MemoryUsage` | 5 | `INFO` | Uso de memória de Dados e Index (80%, 90% e 100%) |
| `MTSignalStatistics` | 9 | `INFO` | Sinais Multithreaded |

##### Eventos SCHEMA

Estes eventos se relacionam a operações de Schema do NDB Cluster.

**Tabela 21.55 Eventos relacionados a operações de Schema do NDB Cluster**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `CreateSchemaObject` | 8 | `INFO` | Objeto de Schema criado |
| `AlterSchemaObject` | 8 | `INFO` | Objeto de Schema atualizado |
| `DropSchemaObject` | 8 | `INFO` | Objeto de Schema descartado (dropped) |

##### Eventos ERROR

Estes eventos se relacionam a erros e avisos do Cluster. A presença de um ou mais destes geralmente indica que ocorreu um mau funcionamento ou falha grave.

**Tabela 21.56 Eventos relacionados a erros e avisos do cluster**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `TransporterError` | 2 | `ERROR` | Erro do Transporter |
| `TransporterWarning` | 8 | `WARNING` | Aviso do Transporter |
| `MissedHeartbeat` | 8 | `WARNING` | Node *`X`* perdeu o Heartbeat número *`Y`* |
| `DeadDueToHeartbeat` | 8 | `ALERT` | Node *`X`* declarado “morto” devido a Heartbeat perdido |
| `WarningEvent` | 2 | `WARNING` | Evento de aviso geral |
| `SubscriptionStatus` | 4 | `WARNING` | Mudança no status de subscrição |

##### Eventos INFO

Estes eventos fornecem informações gerais sobre o estado do Cluster e atividades associadas à manutenção do Cluster, como logging e transmissão de Heartbeat.

**Tabela 21.57 Eventos de informação**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `SentHeartbeat` | 12 | `INFO` | Heartbeat enviado |
| `CreateLogBytes` | 11 | `INFO` | Criação de log: Parte do log, arquivo de log, tamanho em MB |
| `InfoEvent` | 2 | `INFO` | Evento informativo geral |
| `EventBufferStatus` | 7 | `INFO` | Status do Event Buffer |
| `EventBufferStatus2` | 7 | `INFO` | Informações aprimoradas do status do Event Buffer; adicionado no NDB 7.5.1 |

Note

Os eventos `SentHeartbeat` estão disponíveis apenas se o NDB Cluster foi compilado com `VM_TRACE` habilitado.

##### Eventos SINGLEUSER

Estes eventos estão associados à entrada e saída do modo de usuário único (single user mode).

**Tabela 21.58 Eventos relacionados ao modo de usuário único**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `SingleUser` | 7 | `INFO` | Entrando ou saindo do modo de usuário único |

##### Eventos BACKUP

Estes eventos fornecem informações sobre Backups sendo criados ou restaurados.

**Tabela 21.59 Eventos de Backup**

| Evento | Prioridade | Nível de Severidade | Descrição |
|---|---|---|---|
| `BackupStarted` | 7 | `INFO` | Backup iniciado |
| `BackupStatus` | 7 | `INFO` | Status do Backup |
| `BackupCompleted` | 7 | `INFO` | Backup concluído |
| `BackupFailedToStart` | 7 | `ALERT` | Falha ao iniciar o Backup |
| `BackupAborted` | 7 | `ALERT` | Backup abortado pelo usuário |
| `RestoreStarted` | 7 | `INFO` | Restauração a partir do Backup iniciada |
| `RestoreMetaData` | 7 | `INFO` | Restaurando metadados |
| `RestoreData` | 7 | `INFO` | Restaurando dados |
| `RestoreLog` | 7 | `INFO` | Restaurando arquivos de log |
| `RestoreCompleted` | 7 | `INFO` | Restauração a partir do Backup concluída |
| `SavedEvent` | 7 | `INFO` | Evento salvo |