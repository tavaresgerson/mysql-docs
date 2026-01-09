#### 25.6.3.2 Eventos de Registro de NDB Cluster

Um relatório de evento relatado nos registros de evento tem o seguinte formato:

```
datetime [string] severity -- message
```

Por exemplo:

```
09:19:30 2005-07-24 [NDB] INFO -- Node 4 Start phase 4 completed
```

Esta seção discute todos os eventos reportáveis, ordenados por categoria e nível de gravidade dentro de cada categoria.

Nas descrições dos eventos, GCP e LCP significam “Ponto de Controle Global” e “Ponto de Controle Local”, respectivamente.

##### Eventos de CONEXÃO

Esses eventos estão associados a conexões entre nós do Cluster.

**Tabela 25.28 Eventos associados a conexões entre nós do cluster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de Gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>Connected</code></th> <td>8</td> <td><code>INFO</code></td> <td>Nodos de dados conectados</td> </tr><tr> <th><code>Disconnected</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Nodos de dados desconectados</td> </tr><tr> <th><code>CommunicationClosed</code></th> <td>8</td> <td><code>INFO</code></td> <td>Conexão do nó SQL ou do nó de dados fechada</td> </tr><tr> <th><code>CommunicationOpened</code></th> <td>8</td> <td><code>INFO</code></td> <td>Conexão do nó SQL ou do nó de dados aberta</td> </tr><tr> <th><code>ConnectedApiVersion</code></th> <td>8</td> <td><code>INFO</code></td> <td>Conexão usando a versão da API</td> </tr></tbody></table>

##### Eventos de CHECKPOINT

Os mensagens de registro mostradas aqui estão associadas a pontos de controle.

**Tabela 25.29 Eventos associados a pontos de verificação**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>GlobalCheckpointStarted</code></th> <td>9</td> <td><code>INFO</code></td> <td>Início do GCP: o log REDO é escrito no disco</td> </tr><tr> <th><code>GlobalCheckpointCompleted</code></th> <td>10</td> <td><code>INFO</code></td> <td>O GCP terminou</td> </tr><tr> <th><code>LocalCheckpointStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Início do LCP: os dados são escritos no disco</td> </tr><tr> <th><code>LocalCheckpointCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>O LCP foi concluído normalmente</td> </tr><tr> <th><code>LCPStoppedInCalcKeepGci</code></th> <td>0</td> <td><code>ALERT</code></td> <td>O LCP parou</td> </tr><tr> <th><code>LCPFragmentCompleted</code></th> <td>11</td> <td><code>INFO</code></td> <td>O LCP em um fragmento foi concluído</td> </tr><tr> <th><code>UndoLogBlocked</code></th> <td>7</td> <td><code>INFO</code></td> <td>O registro de desfazer bloqueado; buffer próximo ao limite de capacidade</td> </tr><tr> <th><code>RedoStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Status do refazer</td> </tr></tbody></table>

##### Eventos de inicialização

Os seguintes eventos são gerados em resposta ao início de um nó ou de um clúster e ao seu sucesso ou falha. Eles também fornecem informações relacionadas ao progresso do processo de inicialização, incluindo informações sobre atividades de registro.

**Tabela 25.30 Eventos relacionados ao início de um nó ou clúster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>NDBStartStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Fases iniciais do início do nó de dados iniciadas (todos os nós iniciando)</td> </tr><tr> <th><code>NDBStartCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Fases de início concluídas, todos os nós de dados</td> </tr><tr> <th><code>STTORRYRecieved</code></th> <td>15</td> <td><code>INFO</code></td> <td>Blocos recebidos após a conclusão do reinício</td> </tr><tr> <th><code>StartPhaseCompleted</code></th> <td>4</td> <td><code>INFO</code></td> <td>Fase de início do nó de dados <em class="replaceable"><code>X</code></em> concluída</td> </tr><tr> <th><code>CM_REGCONF</code></th> <td>3</td> <td><code>INFO</code></td> <td>O nó foi incluído com sucesso no clúster; mostra o nó, o nó gerenciador e o ID dinâmico</td> </tr><tr> <th><code>CM_REGREF</code></th> <td>8</td> <td><code>INFO</code></td> <td>O nó foi recusado para inclusão no clúster; não pode ser incluído no clúster devido a uma configuração incorreta, incapacidade de estabelecer comunicação ou outro problema</td> </tr><tr> <th><code>FIND_NEIGHBOURS</code></th> <td>8</td> <td><code>INFO</code></td> <td>Mostra os nós de dados vizinhos</td> </tr><tr> <th><code>NDBStopStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Início do desligamento do nó de dados</td> </tr><tr> <th><code>NDBStopCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Desligamento do nó de dados concluído</td> </tr><tr> <th><code>NDBStopForced</code></th> <td>1</td> <td><code>ALERT</code></td> <td>Desligamento forçado do nó de dados</td> </tr><tr> <th><code>NDBStopAborted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Não foi possível desligar o nó de dados normalmente</td> </tr><tr> <th><code>StartREDOLog</code></th> <td>4</td> <td><code>INFO</code></td> <td>Novo log de refazer iniciado; GCI mantenha <em class="replaceable"><code>X</code></em>, o GCI mais recente restaurável <em class="replaceable"><code>Y</code></em></td> </tr><tr> <th><code>StartLog</code></th> <td>10</td> <td><code>INFO</code></td> <td>Novo log iniciado; parte do log <em class="replaceable"><code>X</code></em>, início MB <em class="replaceable"><code>Y</code></em>, fim MB <em class="replaceable"><code>Z</code></em></td> </tr><tr> <th><code>UNDORecordsExecuted</code></th> <td>15</td> <td><code>INFO</code></td> <td>Registros desfeitos</td> </tr><tr> <th><code>StartReport</code></th> <td>4</td> <td><code>INFO</code></td> <td>Relatório iniciado</td> </tr><tr> <th><code>LogFileInitStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Status de inicialização do arquivo de log</td> </tr><tr> <th><code>LogFileInitCompStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Status de conclusão da inicialização do arquivo de log</td> </tr><tr> <th><code class="

##### NODERESTART Eventos

Os seguintes eventos são gerados ao reiniciar um nó e estão relacionados ao sucesso ou ao fracasso do processo de reinício do nó.

**Tabela 25.31 Eventos relacionados ao reinício de um nó**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>NR_CopyDict</code></th> <td>7</td> <td><code>INFO</code></td> <td>Copiando informações do dicionário concluído</td> </tr><tr> <th><code>NR_CopyDistr</code></th> <td>7</td> <td><code>INFO</code></td> <td>Copiando informações de distribuição concluído</td> </tr><tr> <th><code>NR_CopyFragsStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Iniciando a cópia de fragmentos</td> </tr><tr> <th><code>NR_CopyFragDone</code></th> <td>10</td> <td><code>INFO</code></td> <td>Conclusão da cópia de um fragmento</td> </tr><tr> <th><code>NR_CopyFragsCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Conclusão da cópia de todos os fragmentos</td> </tr><tr> <th><code>NodeFailCompleted</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Fase de falha do nó concluída</td> </tr><tr> <th><code>NODE_FAILREP</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Relatório de falha de um nó</td> </tr><tr> <th><code>ArbitState</code></th> <td>6</td> <td><code>INFO</code></td> <td>Relatório se um árbitro foi encontrado ou não; há sete resultados diferentes possíveis ao buscar um árbitro, listados aqui: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> O servidor de gerenciamento reinicia o fio de arbitragem [estado=<em class="replaceable"><code>X</code></em>] </p></li><li class="listitem"><p> Prepare o nó árbitro <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Receba o nó árbitro <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Inicia o nó árbitro <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Perdeu o nó árbitro <em class="replaceable"><code>X</code></em> - falha do processo [estado=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Perdeu o nó árbitro <em class="replaceable"><code>X</code></em> - saída do processo [estado=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Perdeu o nó árbitro <em class="replaceable"><code>X</code></em> <error msg="erro"> [estado=<em class="replaceable"><code>Y</code></em>] </p></li></ul> </div> </td> </tr><tr> <th><code>ArbitResult</code></th> <td>2</td> <td><code>ALERT</code></td> <td>Relatório dos resultados da arbitragem; há oito resultados diferentes possíveis para tentativas de arbitragem, listados aqui: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> A verificação de arbitragem falhou: menos de 1/2 de nós restaram </p></li><li class="listitem"><p> A verificação de arbitragem foi bem-sucedida: maioria do grupo de nós </p></li><li class="listitem"><p> A verificação de arbitragem falhou: nó grupo ausente </p></li><li class="listitem"><p> Partição de rede: arbitragem necessária </p></li><li class="listitem"><p> Arbitragem bem-sucedida: resposta afirmativa do nó <

##### Estatísticas Eventos

Os seguintes eventos são de natureza estatística. Eles fornecem informações como números de transações e outras operações, quantidade de dados enviados ou recebidos por nós individuais e uso de memória.

**Tabela 25.32 Eventos de natureza estatística**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>TransReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Relatório de estatísticas de transações, incluindo números de transações, commits, leituras, leituras simples, escritas, operações concorrentes, informações de atributos e abortos</td> </tr><tr> <th><code>OperationReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Número de operações</td> </tr><tr> <th><code>TableCreated</code></th> <td>7</td> <td><code>INFO</code></td> <td>Relatório do número de tabelas criadas</td> </tr><tr> <th><code>JobStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Estatísticas médias de agendamento de tarefas internas</td> </tr><tr> <th><code>ThreadConfigLoop</code></th> <td>9</td> <td><code>INFO</code></td> <td>Número de loops de configuração de threads</td> </tr><tr> <th><code>SendBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Número médio de bytes enviados para o nó <em class="replaceable"><code>X</code></em></td> </tr><tr> <th><code>ReceiveBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Número médio de bytes recebidos do nó <em class="replaceable"><code>X</code></em></td> </tr><tr> <th><code>MemoryUsage</code></th> <td>5</td> <td><code>INFO</code></td> <td>Uso de memória (80%, 90% e 100%)</td> </tr><tr> <th><code>MTSignalStatistics</code></th> <td>9</td> <td><code>INFO</code></td> <td>Sinais multithreadados</td> </tr></tbody></table>

##### SINALIZAÇÃO DE ERROS

Estes eventos estão relacionados a erros e avisos do NDB Cluster. A presença de um ou mais desses eventos geralmente indica que ocorreu um mau funcionamento ou falha grave.

**Tabela 25.34 Eventos relacionados a erros e avisos do cluster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>TransporterError</code></th> <td>2</td> <td><code>ERROR</code></td> <td>Erro do transportador</td> </tr><tr> <th><code>TransporterWarning</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Aviso do transportador</td> </tr><tr> <th><code>MissedHeartbeat</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Batida cardíaca perdida do nó <em class="replaceable"><code>X</code></em></td> </tr><tr> <th><code>DeadDueToHeartbeat</code></th> <td>8</td> <td><code>ALERT</code></td> <td>O nó <em class="replaceable"><code>X</code></em> declarou <span class="quote">“<span class="quote">morto”</span></span> devido à batida cardíaca perdida</td> </tr><tr> <th><code>WarningEvent</code></th> <td>2</td> <td><code>WARNING</code></td> <td>Evento de aviso geral</td> </tr><tr> <th><code>SubscriptionStatus</code></th> <td>4</td> <td><code>WARNING</code></td> <td>Mudança no status da assinatura</td> </tr></tbody></table>

##### INFO Eventos

Esses eventos fornecem informações gerais sobre o estado do clúster e atividades associadas à manutenção do Clúster, como registro e transmissão de batidas cardíacas.

**Tabela 25.35 Eventos de informação**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>SentHeartbeat</code></th> <td>12</td> <td><code>INFO</code></td> <td>Heartbeat enviado</td> </tr><tr> <th><code>CreateLogBytes</code></th> <td>11</td> <td><code>INFO</code></td> <td>Criação de log: Parte do log, arquivo de log, tamanho em MB</td> </tr><tr> <th><code>InfoEvent</code></th> <td>2</td> <td><code>INFO</code></td> <td>Evento informativo geral</td> </tr><tr> <th><code>EventBufferStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Status do buffer de eventos</td> </tr><tr> <th><code>EventBufferStatus2</code></th> <td>7</td> <td><code>INFO</code></td> <td>Informações melhoradas sobre o status do buffer de eventos</td> </tr></tbody></table>

Observação

Os eventos `SentHeartbeat` estão disponíveis apenas se o NDB Cluster foi compilado com a opção `VM_TRACE` habilitada.

##### Eventos SINGLEUSER

Esses eventos estão associados à entrada e saída do modo de usuário único.

**Tabela 25.36 Eventos relacionados ao modo de usuário único**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>SingleUser</code></th> <td>7</td> <td><code>INFO</code></td> <td>Entrada ou saída do modo de usuário único</td> </tr></tbody></table>

##### BACKUP Eventos

Esses eventos fornecem informações sobre backups sendo criados ou restaurados.

**Tabela 25.37 Eventos de backup**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Evento</th> <th>Prioridade</th> <th>Nível de gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th><code>BackupStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup iniciado</td> </tr><tr> <th><code>BackupStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Status do backup</td> </tr><tr> <th><code>BackupCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup concluído</td> </tr><tr> <th><code>BackupFailedToStart</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup não conseguiu iniciar</td> </tr><tr> <th><code>BackupAborted</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup interrompido pelo usuário</td> </tr><tr> <th><code>RestoreStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restauração iniciada a partir do backup</td> </tr><tr> <th><code>RestoreMetaData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restauração de metadados</td> </tr><tr> <th><code>RestoreData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restauração de dados</td> </tr><tr> <th><code>RestoreLog</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restauração de arquivos de log</td> </tr><tr> <th><code>RestoreCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restauração concluída a partir do backup</td> </tr><tr> <th><code>SavedEvent</code></th> <td>7</td> <td><code>INFO</code></td> <td>Evento salvo</td> </tr></tbody></table>