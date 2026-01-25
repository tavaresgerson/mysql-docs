#### 21.4.2.1 Parâmetros de Configuração do Node de Dados do NDB Cluster

As listagens nesta seção fornecem informações sobre os parâmetros usados nas seções `[ndbd]` ou `[ndbd default]` de um arquivo `config.ini` para configurar os Data Nodes do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte [Seção 21.4.3.6, “Definindo NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Definindo NDB Cluster Data Nodes”).

Esses parâmetros também se aplicam ao [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Daemon de Data Node do NDB Cluster (Multi-Threaded)"), a versão multi-threaded do [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — O Daemon de Data Node do NDB Cluster"). Uma listagem separada de parâmetros específicos ao [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Daemon de Data Node do NDB Cluster (Multi-Threaded)") segue abaixo.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falha do Node API antes do escalonamento. 0 significa sem limite de tempo; o valor mínimo utilizável é 10.

* `Arbitration`: Como a Arbitration deve ser executada para evitar problemas de split-brain em caso de falha do Node.

* `ArbitrationTimeout`: Tempo máximo (em milissegundos) que a partição do Database espera pelo sinal de Arbitration.

* `BackupDataBufferSize`: Tamanho padrão do databuffer para o backup (em bytes).

* `BackupDataDir`: Path onde os backups devem ser armazenados. Note que a string '/BACKUP' é sempre anexada a esta configuração, de modo que o padrão \*efetivo\* é FileSystemPath/BACKUP.

* `BackupDiskWriteSpeedPct`: Define a porcentagem da velocidade máxima de gravação alocada (MaxDiskWriteSpeed) do Node de dados a ser reservada para LCPs ao iniciar o backup.

* `BackupLogBufferSize`: Tamanho padrão do log buffer para o backup (em bytes).

* `BackupMaxWriteSize`: Tamanho máximo das gravações do sistema de arquivos feitas pelo backup (em bytes).

* `BackupMemory`: Memória total alocada para backups por Node (em bytes).

* `BackupReportFrequency`: Frequência em segundos dos relatórios de status de backup durante o backup.

* `BackupWriteSize`: Tamanho padrão das gravações do sistema de arquivos feitas pelo backup (em bytes).

* `BatchSizePerLocalScan`: Usado para calcular o número de registros de Lock para scan com hold Lock.

* `BuildIndexThreads`: Número de Threads a serem usados para construir Indexes ordenados durante a reinicialização do sistema ou Node. Também se aplica ao executar ndb_restore --rebuild-indexes. Definir este parâmetro como 0 desabilita a construção multi-threaded de Indexes ordenados.

* `CompressedBackup`: Usa zlib para compactar backups à medida que são gravados.

* `CompressedLCP`: Grava LCPs compactados usando zlib.

* `ConnectCheckIntervalDelay`: Tempo entre os estágios de verificação de conectividade do Data Node. O Data Node é considerado suspeito após 1 intervalo e inativo após 2 intervalos sem resposta.

* `CrashOnCorruptedTuple`: Quando habilitado, força o Node a encerrar sempre que detectar uma tuple corrompida.

* `DataDir`: Diretório de dados para este Node.

* `DataMemory`: Número de bytes em cada Data Node alocado para armazenar dados; sujeito à RAM disponível do sistema e ao tamanho do IndexMemory.

* `DefaultHashMapSize`: Define o tamanho (em buckets) a ser usado para hash maps de tabela. Três valores são suportados: 0, 240 e 3840.

* `DictTrace`: Habilita o debugging do DBDICT; para desenvolvimento NDB.

* `DiskIOThreadPool`: Número de Threads não vinculados para acesso a arquivos, aplica-se apenas a dados em Disk.

* `Diskless`: Executar sem usar Disk.

* `DiskPageBufferEntries`: Memória a ser alocada no DiskPageBufferMemory; transações em Disk muito grandes podem exigir o aumento deste valor.

* `DiskPageBufferMemory`: Número de bytes em cada Data Node alocado para o cache do Disk Page Buffer.

* `DiskSyncSize`: Quantidade de dados gravados no arquivo antes que o synch seja forçado.

* `EnablePartialLcp`: Habilita LCP parcial (true); se desabilitado (false), todos os LCPs gravam checkpoints completos.

* `EnableRedoControl`: Habilita a velocidade de checkpointing adaptável para controlar o uso do redo log.

* `EventLogBufferSize`: Tamanho do circular buffer para eventos de log NDB dentro dos Data Nodes.

* `ExecuteOnComputer`: String que faz referência a um COMPUTER definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para send buffers, além de qualquer memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16MB.

* `FileSystemPath`: Path para o diretório onde o Data Node armazena seus dados (o diretório deve existir).

* `FileSystemPathDataFiles`: Path para o diretório onde o Data Node armazena seus arquivos de Disk Data. O valor padrão é FilesystemPathDD, se configurado; caso contrário, FilesystemPath é usado se estiver configurado; caso contrário, o valor de DataDir é usado.

* `FileSystemPathDD`: Path para o diretório onde o Data Node armazena seus arquivos de Disk Data e undo. O valor padrão é FileSystemPath, se configurado; caso contrário, o valor de DataDir é usado.

* `FileSystemPathUndoFiles`: Path para o diretório onde o Data Node armazena seus undo files para Disk Data. O valor padrão é FilesystemPathDD, se configurado; caso contrário, FilesystemPath é usado se estiver configurado; caso contrário, o valor de DataDir é usado.

* `FragmentLogFileSize`: Tamanho de cada arquivo de redo log.

* `HeartbeatIntervalDbApi`: Tempo entre os heartbeats do Node API e do Data Node. (A conexão API é fechada após 3 heartbeats perdidos).

* `HeartbeatIntervalDbDb`: Tempo entre os heartbeats de Data Node para Data Node; o Data Node é considerado inativo após 3 heartbeats perdidos.

* `HeartbeatOrder`: Define a ordem em que os Data Nodes verificam os heartbeats uns dos outros para determinar se um determinado Node ainda está ativo e conectado ao Cluster. Deve ser zero para todos os Data Nodes ou valores não zero distintos para todos os Data Nodes; consulte a documentação para mais orientações.

* `HostName`: Nome do Host ou endereço IP para este Data Node.

* `IndexMemory`: Número de bytes em cada Data Node alocado para armazenar Indexes; sujeito à RAM disponível do sistema e ao tamanho do DataMemory.

* `IndexStatAutoCreate`: Habilita/desabilita a coleta automática de estatísticas quando Indexes são criados.

* `IndexStatAutoUpdate`: Monitora Indexes quanto a alterações e aciona atualizações automáticas de estatísticas.

* `IndexStatSaveScale`: Fator de escalonamento usado para determinar o tamanho das estatísticas de Index armazenadas.

* `IndexStatSaveSize`: Tamanho máximo em bytes para estatísticas salvas por Index.

* `IndexStatTriggerPct`: Limiar percentual de alteração nas operações DML para atualizações de estatísticas de Index. O valor é reduzido pela IndexStatTriggerScale.

* `IndexStatTriggerScale`: Reduz IndexStatTriggerPct por esta quantidade, multiplicada pelo logaritmo de base 2 do tamanho do Index, para Index grande. Defina como 0 para desabilitar o escalonamento.

* `IndexStatUpdateDelay`: Atraso mínimo entre as atualizações automáticas de estatísticas de Index para um determinado Index. 0 significa sem atraso.

* `InitFragmentLogFiles`: Inicializa os arquivos de log de fragmento, usando formato sparse ou full.

* `InitialLogFileGroup`: Descreve o grupo de log file que é criado durante a inicialização inicial. Consulte a documentação para o formato.

* `InitialNoOfOpenFiles`: Número inicial de arquivos abertos por Data Node. (Um Thread é criado por arquivo).

* `InitialTablespace`: Descreve o tablespace que é criado durante a inicialização inicial. Consulte a documentação para o formato.

* `InsertRecoveryWork`: Porcentagem de RecoveryWork usada para linhas inseridas; não tem efeito a menos que checkpoints locais parciais estejam em uso.

* `LateAlloc`: Aloca memória após a conexão com o servidor Management ter sido estabelecida.

* `LcpScanProgressTimeout`: Tempo máximo que o scan de fragmento do checkpoint local pode ficar paralisado antes que o Node seja encerrado para garantir o progresso do LCP em todo o sistema. Use 0 para desabilitar.

* `LocationDomainId`: Atribui este Data Node a um domínio ou zone de disponibilidade específico. 0 (padrão) deixa-o não configurado.

* `LockExecuteThreadToCPU`: Lista de IDs de CPU delimitada por vírgulas.

* `LockMaintThreadsToCPU`: ID de CPU que indica qual CPU executa Threads de manutenção.

* `LockPagesInMainMemory`: 0=desabilitar Locking, 1=Lock após a alocação de memória, 2=Lock antes da alocação de memória.

* `LogLevelCheckpoint`: Log level das informações de checkpoint local e global impressas no stdout.

* `LogLevelCongestion`: Level de informações de congestionamento impressas no stdout.

* `LogLevelConnection`: Level de informações de conexão/desconexão de Node impressas no stdout.

* `LogLevelError`: Erros de Transporter e heartbeat impressos no stdout.

* `LogLevelInfo`: Informações de Heartbeat e log impressas no stdout.

* `LogLevelNodeRestart`: Level de informações de reinicialização e falha de Node impressas no stdout.

* `LogLevelShutdown`: Level de informações de encerramento de Node impressas no stdout.

* `LogLevelStartup`: Level de informações de inicialização de Node impressas no stdout.

* `LogLevelStatistic`: Level de informações de transaction, operation e transporter impressas no stdout.

* `LongMessageBuffer`: Número de bytes alocados em cada Data Node para mensagens longas internas.

* `MaxAllocate`: Não é mais usado; não tem efeito.

* `MaxBufferedEpochs`: Número permitido de epochs que o Node subscriber pode atrasar (epochs não processados). Exceder este valor faz com que os subscribers atrasados sejam desconectados.

* `MaxBufferedEpochBytes`: Número total de bytes alocados para o buffering de epochs.

* `MaxDiskWriteSpeed`: Número máximo de bytes por segundo que podem ser gravados por LCP e backup quando não há reinicializações em andamento.

* `MaxDiskWriteSpeedOtherNodeRestart`: Número máximo de bytes por segundo que podem ser gravados por LCP e backup quando outro Node está reiniciando.

* `MaxDiskWriteSpeedOwnRestart`: Número máximo de bytes por segundo que podem ser gravados por LCP e backup quando este Node está reiniciando.

* `MaxFKBuildBatchSize`: Tamanho máximo do scan batch a ser usado para construir foreign keys. Aumentar este valor pode acelerar a construção de foreign keys, mas também impacta o tráfego em andamento.

* `MaxDMLOperationsPerTransaction`: Limita o tamanho da transaction; aborta a transaction se ela exigir mais do que esta quantidade de operações DML.

* `MaxLCPStartDelay`: Tempo em segundos que o LCP pesquisa o mutex do checkpoint (para permitir que outros Data Nodes concluam a sincronização de metadados), antes de se colocar na fila de Lock para recuperação paralela de dados de tabela.

* `MaxNoOfAttributes`: Sugere o número total de attributes armazenados no Database (soma de todas as tabelas).

* `MaxNoOfConcurrentIndexOperations`: Número total de operações de Index que podem ser executadas simultaneamente em um Data Node.

* `MaxNoOfConcurrentOperations`: Número máximo de registros de operation no transaction coordinator.

* `MaxNoOfConcurrentScans`: Número máximo de scans sendo executados concorrentemente no Data Node.

* `MaxNoOfConcurrentSubOperations`: Número máximo de operações de subscriber concorrentes.

* `MaxNoOfConcurrentTransactions`: Número máximo de transactions sendo executadas concorrentemente neste Data Node; o número total de transactions que podem ser executadas concorrentemente é este valor vezes o número de Data Nodes no Cluster.

* `MaxNoOfFiredTriggers`: Número total de triggers que podem disparar simultaneamente em um Data Node.

* `MaxNoOfLocalOperations`: Número máximo de registros de operation definidos neste Data Node.

* `MaxNoOfLocalScans`: Número máximo de scans de fragmento em paralelo neste Data Node.

* `MaxNoOfOpenFiles`: Número máximo de arquivos abertos por Data Node. (Um Thread é criado por arquivo).

* `MaxNoOfOrderedIndexes`: Número total de Indexes ordenados que podem ser definidos no sistema.

* `MaxNoOfSavedMessages`: Número máximo de mensagens de erro a serem gravadas no log de erro e número máximo de arquivos de trace a serem retidos.

* `MaxNoOfSubscribers`: Número máximo de subscribers.

* `MaxNoOfSubscriptions`: Número máximo de subscriptions (padrão 0 = MaxNoOfTables).

* `MaxNoOfTables`: Sugere o número total de tabelas NDB armazenadas no Database.

* `MaxNoOfTriggers`: Número total de triggers que podem ser definidos no sistema.

* `MaxNoOfUniqueHashIndexes`: Número total de Unique Hash Indexes que podem ser definidos no sistema.

* `MaxParallelCopyInstances`: Número de cópias paralelas durante as reinicializações de Node. O padrão é 0, que usa o número de LDMs em ambos os Nodes, até um máximo de 16.

* `MaxParallelScansPerFragment`: Número máximo de scans paralelos por fragmento. Uma vez atingido este limite, os scans são serializados.

* `MaxReorgBuildBatchSize`: Tamanho máximo do scan batch a ser usado para a reorganização de partições de tabela. Aumentar este valor pode acelerar a reorganização de partições de tabela, mas também impacta o tráfego em andamento.

* `MaxStartFailRetries`: Tentativas máximas quando o Data Node falha na inicialização, requer StopOnError = 0. Definir como 0 faz com que as tentativas de inicialização continuem indefinidamente.

* `MaxUIBuildBatchSize`: Tamanho máximo do scan batch a ser usado para construir Unique Keys. Aumentar este valor pode acelerar a construção de Unique Keys, mas também impacta o tráfego em andamento.

* `MemReportFrequency`: Frequência de relatórios de memória em segundos; 0 = relatar apenas quando exceder os limites percentuais.

* `MinDiskWriteSpeed`: Número mínimo de bytes por segundo que podem ser gravados por LCP e backup.

* `MinFreePct`: Porcentagem de recursos de memória a serem mantidos em reserva para reinicializações.

* `NodeGroup`: Grupo de Node ao qual o Data Node pertence; usado apenas durante a inicialização inicial do Cluster.

* `NodeId`: Número que identifica o Data Node de forma única entre todos os Nodes no Cluster.

* `NoOfFragmentLogFiles`: Número de arquivos de redo log de 16 MB em cada um dos 4 conjuntos de arquivos pertencentes ao Data Node.

* `NoOfReplicas`: Número de cópias de todos os dados no Database.

* `Numa`: (Apenas Linux; requer libnuma) Controla o suporte NUMA. Definir como 0 permite que o sistema determine o uso de interleaving pelo processo Data Node; 1 significa que é determinado pelo Data Node.

* `ODirect`: Usa leituras e gravações de arquivo O_DIRECT quando possível.

* `ODirectSyncFlag`: Gravações O_DIRECT são tratadas como gravações sincronizadas; ignorado quando ODirect não está habilitado, InitFragmentLogFiles está definido como SPARSE, ou ambos.

* `RealtimeScheduler`: Quando true, os Threads do Data Node são escalonados como Threads de tempo real. O padrão é false.

* `RecoveryWork`: Porcentagem de overhead de armazenamento para arquivos LCP: valor maior significa menos trabalho em operações normais, mais trabalho durante a recovery.

* `RedoBuffer`: Número de bytes em cada Data Node alocado para gravar redo logs.

* `RedoOverCommitCounter`: Quando o RedoOverCommitLimit for excedido este número de vezes, as transactions são abortadas, e as operations são tratadas conforme especificado por DefaultOperationRedoProblemAction.

* `RedoOverCommitLimit`: Cada vez que o flushing do redo buffer atual levar mais do que este número de segundos, o número de vezes que isso ocorreu é comparado ao RedoOverCommitCounter.

* `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado.

* `RestartOnErrorInsert`: Controla o tipo de restart causado por erro de inserção (quando StopOnError está habilitado).

* `RestartSubscriberConnectTimeout`: Quantidade de tempo que o Data Node deve esperar pelos Nodes API subscribers para se conectar. Defina como 0 para desabilitar o timeout, que é sempre resolvido para o segundo completo mais próximo.

* `SchedulerExecutionTimer`: Número de microssegundos a serem executados no scheduler antes de enviar.

* `SchedulerResponsiveness`: Define a otimização de resposta do scheduler NDB de 0 a 10; valores mais altos fornecem melhor tempo de resposta, mas menor throughput.

* `SchedulerSpinTimer`: Número de microssegundos a serem executados no scheduler antes de hibernar.

* `ServerPort`: Porta usada para configurar o transporter para conexões de entrada de Nodes API.

* `SharedGlobalMemory`: Número total de bytes em cada Data Node alocado para qualquer uso.

* `StartFailRetryDelay`: Atraso em segundos após a falha de inicialização antes da repetição; requer StopOnError = 0.

* `StartFailureTimeout`: Milissegundos a aguardar antes de encerrar. (0=Esperar indefinidamente).

* `StartNoNodeGroupTimeout`: Tempo de espera por Nodes sem nodegroup antes de tentar iniciar (0=indefinidamente).

* `StartPartialTimeout`: Milissegundos a aguardar antes de tentar iniciar sem todos os Nodes. (0=Esperar indefinidamente).

* `StartPartitionedTimeout`: Milissegundos a aguardar antes de tentar iniciar particionado. (0=Esperar indefinidamente).

* `StartupStatusReportFrequency`: Frequência de relatórios de status durante a inicialização.

* `StopOnError`: Quando definido como 0, o Data Node reinicia e se recupera automaticamente após falhas de Node.

* `StringMemory`: Tamanho padrão da string memory (0 a 100 = % do máximo, 101+ = bytes reais).

* `TcpBind_INADDR_ANY`: Faz Bind de IP_ADDR_ANY para que as conexões possam ser feitas de qualquer lugar (para conexões autogeradas).

* `TimeBetweenEpochs`: Tempo entre epochs (sincronização usada para Replication).

* `TimeBetweenEpochsTimeout`: Timeout para o tempo entre epochs. Exceder causa o encerramento do Node.

* `TimeBetweenGlobalCheckpoints`: Tempo entre os group commits de transactions para o Disk.

* `TimeBetweenGlobalCheckpointsTimeout`: Timeout mínimo para group commit de transactions para o Disk.

* `TimeBetweenInactiveTransactionAbortCheck`: Tempo entre as verificações de transactions inativas.

* `TimeBetweenLocalCheckpoints`: Tempo entre a captura de snapshots do Database (expresso no logaritmo de base 2 de bytes).

* `TimeBetweenWatchDogCheck`: Tempo entre as verificações de execução dentro do Data Node.

* `TimeBetweenWatchDogCheckInitial`: Tempo entre as verificações de execução dentro do Data Node (fases iniciais de start quando a memória é alocada).

* `TotalSendBufferMemory`: Memória total a ser usada para todos os send buffers do transporter.

* `TransactionBufferMemory`: Espaço de Buffer dinâmico (em bytes) para dados de Key e attribute alocados para cada Data Node.

* `TransactionDeadlockDetectionTimeout`: Tempo que a transaction pode gastar executando dentro do Data Node. Este é o tempo que o transaction coordinator espera que cada Data Node participante da transaction execute a solicitação. Se o Data Node demorar mais do que este tempo, a transaction é abortada.

* `TransactionInactiveTimeout`: Milissegundos que o aplicativo espera antes de executar outra parte da transaction. Este é o tempo que o transaction coordinator espera que o aplicativo execute ou envie outra parte (Query, statement) da transaction. Se o aplicativo demorar muito, a transaction é abortada. Timeout = 0 significa que o aplicativo nunca atinge o Timeout.

* `TwoPassInitialNodeRestartCopy`: Copia dados em 2 passes durante a reinicialização inicial do Node, o que permite a construção multi-threaded de Indexes ordenados para tais reinicializações.

* `UndoDataBuffer`: Não usado; não tem efeito.

* `UndoIndexBuffer`: Não usado; não tem efeito.

* `UseShm`: Usa conexões de shared memory entre este Data Node e o Node API também em execução neste Host.

* `WatchDogImmediateKill`: Quando true, Threads são imediatamente encerrados sempre que ocorrerem problemas de watchdog; usado para teste e debugging.

Os seguintes parâmetros são específicos do [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Daemon de Data Node do NDB Cluster (Multi-Threaded)"):

* `MaxNoOfExecutionThreads`: Apenas para ndbmtd, especifica o número máximo de Execution Threads.

* `MaxSendDelay`: Número máximo de microssegundos para atrasar o envio pelo ndbmtd.

* `NoOfFragmentLogParts`: Número de grupos de redo log file pertencentes a este Data Node.

* `ThreadConfig`: Usado para configuração de Data Nodes multi-threaded (ndbmtd). O padrão é uma string vazia; consulte a documentação para sintaxe e outras informações.