#### 25.4.2.1 Parâmetros de Configuração do Nó de Dados do NDB Cluster

As listagens nesta seção fornecem informações sobre os parâmetros usados nas seções `[ndbd]` ou `[ndbd default]` de um arquivo `config.ini` para configurar os nós de dados do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.

Esses parâmetros também se aplicam a **ndbmtd")**, a versão multithread do **ndbd**. Uma lista separada de parâmetros específicos para **ndbmtd")** segue.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas do nó API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10.

* `Arbitration`: Como a arbitragem deve ser realizada para evitar problemas de split-brain em caso de falha do nó.

* `ArbitrationTimeout`: Tempo máximo (em milissegundos) que a partição do banco de dados espera pelo sinal de arbitragem.

* `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes).

* `BackupDataDir`: Caminho para onde os backups serão armazenados. Note que a string `/BACKUP` é sempre anexada a esta configuração, então o valor **efetivo** padrão é FileSystemPath/BACKUP.

* `BackupDiskWriteSpeedPct`: Define a porcentagem da velocidade de escrita máxima alocada pelo nó de dados (MaxDiskWriteSpeed) para reservar para LCPs ao iniciar o backup.

* `BackupLogBufferSize`: Tamanho padrão do buffer de log para backup (em bytes).

* `BackupMaxWriteSize`: Tamanho máximo de escritas no sistema de arquivos feitas pelo backup (em bytes).

* `BackupMemory`: Memória total alocada para backups por nó (em bytes).

* `BackupReportFrequency`: Frequência de relatórios de status de backup durante o backup em segundos.

* `BackupWriteSize`: Tamanho padrão de escritas no sistema de arquivos feitas pelo backup (em bytes).

* `BatchSizePerLocalScan`: Usado para calcular o número de registros de bloqueio para varredura com bloqueio de retenção.

* `BuildIndexThreads`: Número de threads a serem usados para a construção de índices ordenados durante o reinício do sistema ou do nó. Também se aplica ao executar ndb_restore --rebuild-indexes. Definir este parâmetro para 0 desabilita a construção em múltiplos threads de índices ordenados.

* `CompressedBackup`: Use zlib para comprimir backups conforme eles são escritos.

* `CompressedLCP`: Escreva LCPs comprimidos usando zlib.

* `ConnectCheckIntervalDelay`: Tempo entre as etapas de verificação da conectividade do nó de dados. O nó de dados é considerado suspeito após 1 intervalo e morto após 2 intervalos sem resposta.

* `CrashOnCorruptedTuple`: Quando habilitado, força o nó a desligar sempre que detecta um tupla corrompida.

* `DataDir`: Diretório de dados para este nó.

* `DataMemory`: Número de bytes em cada nó de dados alocados para armazenar dados; sujeito à RAM disponível do sistema e ao tamanho do IndexMemory.

* `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para mapas de hash de tabelas. São suportados três valores: 0, 240 e 3840.

* `DictTrace`: Habilitar o depuração DBDICT; para o desenvolvimento do NDB.

* `DiskDataUsingSameDisk`: Definir para false se os espaços de tabelas de dados de disco estiverem localizados em discos físicos separados.

* `DiskIOThreadPool`: Número de threads não ligadas para acesso a arquivos, aplica-se apenas aos dados de disco.

* `Diskless`: Executar sem usar disco.

* `DiskPageBufferEntries`: Memória a ser alocada na DiskPageBufferMemory; transações de disco muito grandes podem exigir o aumento deste valor.

* `DiskPageBufferMemory`: Número de bytes em cada nó de dados alocados para cache de buffer de página de disco.

* `DiskSyncSize`: Quantidade de dados escritos no arquivo antes que a sincronização seja forçada.

* `EnablePartialLcp`: Habilitar LCP parcial (true); se isso for desabilitado (false), todos os LCPs escrevem pontos de verificação completos.

* `EnableRedoControl`: Ative o controle de velocidade adaptativa de ponto de verificação para controlar o uso do log de reverso.

* `EncryptedFileSystem`: Criptografar arquivos de ponto de verificação e espaços de tabelas locais.

* `EventLogBufferSize`: Tamanho do buffer circular para eventos de log NDB dentro dos nós de dados.

* `ExecuteOnComputer`: String que faz referência ao COMPUTADOR definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além da alocada por TotalSendBufferMemory ou SendBufferMemory. O valor padrão (0) permite até 16 MB.

* `FileSystemPath`: Caminho para o diretório onde o nó de dados armazena seus dados (o diretório deve existir).

* `FileSystemPathDataFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de dados de disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

* `FileSystemPathDD`: Caminho para o diretório onde o nó de dados armazena seus arquivos de dados de disco e arquivos de reverso. O valor padrão é FilesystemPath, se definido; caso contrário, o valor de DataDir é usado.

* `FileSystemPathUndoFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de reverso de dados de disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

* `FragmentLogFileSize`: Tamanho de cada arquivo de log de reverso.

* `HeartbeatIntervalDbApi`: Tempo entre os batimentos cardíacos do nó API e do nó de dados. (A conexão de API é fechada após 3 batimentos cardíacos perdidos).

* `HeartbeatIntervalDbDb`: Tempo entre os batimentos cardíacos do nó de dados para o nó de dados; o nó de dados é considerado morto após 3 batimentos cardíacos perdidos.

* `HeartbeatOrder`: Define a ordem em que os nós de dados verificam os batimentos cardíacos uns dos outros para determinar se o nó dado ainda está ativo e conectado ao clúster. Deve ser zero para todos os nós de dados ou valores distintos e não nulos para todos os nós de dados; consulte a documentação para mais orientações.

* `HostName`: Nome do host ou endereço IP para este nó de dados.

* `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM disponível do sistema e ao tamanho da DataMemory.

* `IndexStatAutoCreate`: Ativa/desativa a coleta automática de estatísticas quando os índices são criados.

* `IndexStatAutoUpdate`: Monitora os índices para alterações e dispara atualizações automáticas de estatísticas.

* `IndexStatSaveScale`: Fator de escalonamento usado para determinar o tamanho das estatísticas de índices armazenados.

* `IndexStatSaveSize`: Tamanho máximo em bytes para estatísticas de índice salvas por índice.

* `IndexStatTriggerPct`: Porcentagem de mudança percentual nas operações DML para atualizações de estatísticas de índice. O valor é escalonado por IndexStatTriggerScale.

* `IndexStatTriggerScale`: Descala IndexStatTriggerPct por essa quantidade, multiplicada pelo logaritmo base 2 do tamanho do índice, para índices grandes. Defina para 0 para desativar a escala.

* `IndexStatUpdateDelay`: Retardo mínimo entre as atualizações automáticas de estatísticas de índice para o índice dado. 0 significa sem atraso.

* `InitFragmentLogFiles`: Inicializa arquivos de log de fragmentos, usando formato esparso ou completo.

* `InitialLogFileGroup`: Descreve o grupo de arquivos de log que é criado durante o início inicial. Consulte a documentação para o formato.

* `InitialNoOfOpenFiles`: Número inicial de arquivos abertos por nó de dados. (Um thread é criado por arquivo).

* `InitialTablespace`: Descreve o espaço de tabelas que é criado durante o início inicial. Consulte a documentação para o formato.

* `InsertRecoveryWork`: Porcentagem de RecoveryWork usada para linhas inseridas; não tem efeito a menos que pontos de verificação locais parciais estejam em uso.

* `KeepAliveSendInterval`: Tempo entre sinais de manutenção de conexão em links entre nós de dados, em milissegundos. Defina para 0 para desativar.

* `LateAlloc`: Alocar memória após a conexão com o servidor de gerenciamento ter sido estabelecida.

* `LcpScanProgressTimeout`: Tempo máximo que o varredura de fragmentos de ponto de verificação local pode ficar parado antes que o nó seja desligado para garantir o progresso do LCP em todo o sistema. Use 0 para desativar.

* `LocationDomainId`: Atribua este nó de dados a um domínio de disponibilidade ou zona específica. 0 (padrão) deixa este campo em branco.

* `LockExecuteThreadToCPU`: Lista separada por vírgula de IDs de CPU.

* `LockMaintThreadsToCPU`: ID de CPU que indica qual CPU executa os threads de manutenção.

* `LockPagesInMainMemory`: 0=desativar o bloqueio, 1=bloquear após a alocação de memória, 2=bloquear antes da alocação de memória.

* `LogLevelCheckpoint`: Nível de log das informações de ponto de verificação local e global impressas no stdout.

* `LogLevelCongestion`: Nível de informações de congestionamento impressas no stdout.

* `LogLevelConnection`: Nível de informações de conexão/desconexão do nó impressas no stdout.

* `LogLevelError`: Erros de transportador e erros de batida de coração impressos no stdout.

* `LogLevelInfo`: Informações de batida de coração e log impressas no stdout.

* `LogLevelNodeRestart`: Nível de informações de reinício e falha do nó impressas no stdout.

* `LogLevelShutdown`: Nível de informações de desligamento do nó impressas no stdout.

* `LogLevelStartup`: Nível de informações de inicialização do nó impressas no stdout.

* `LogLevelStatistic`: Nível de informações de transação, operação e transportador impressas no stdout.

* `LongMessageBuffer`: Número de bytes alocados em cada nó de dados para mensagens longas internas.

* `MaxAllocate`: Não é mais usado; não tem efeito.

* `MaxBufferedEpochs`: Número máximo de épocas numeradas que o nó assinante pode ficar atrasado (épocas não processadas). Exceder esse limite faz com que os assinantes atrasados sejam desconectados.

* `MaxBufferedEpochBytes`: Número total de bytes alocados para buffer de épocas.

* `MaxDiskDataLatency`: Latência média máxima permitida de acesso ao disco (ms) antes de começar a abortar transações.

* `MaxDiskWriteSpeed`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando não há reinicializações em andamento.

* `MaxDiskWriteSpeedOtherNodeRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando outro nó está reiniciando.

* `MaxDiskWriteSpeedOwnRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando este nó está reiniciando.

* `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento.

* `MaxDMLOperationsPerTransaction`: Limite de tamanho da transação; interrompe a transação se ela exigir mais do que esse número de operações DML.

* `MaxLCPStartDelay`: Tempo em segundos que o LCP verifica o mutex de ponto de verificação (para permitir que outros nós de dados completem a sincronização de metadados), antes de colocar-se na fila de bloqueio para a recuperação paralela dos dados da tabela.

* `MaxNoOfAttributes`: Sugere o número total de atributos armazenados no banco de dados (soma de todas as tabelas).

* `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados.

* `MaxNoOfConcurrentOperations`: Número máximo de registros de operação no coordenador de transações.

* `MaxNoOfConcurrentScans`: Número máximo de varreduras que podem ser executadas simultaneamente no nó de dados.

* `MaxNoOfConcurrentSubOperations`: Número máximo de operações de assinante concorrentes.

* `MaxNoOfConcurrentTransactions`: Número máximo de transações que podem ser executadas simultaneamente neste nó de dados, o número total de transações que podem ser executadas simultaneamente é esse valor vezes o número de nós de dados no clúster.

* `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser acionados simultaneamente em um nó de dados.

* `MaxNoOfLocalOperations`: Número máximo de registros de operações definidos neste nó de dados.

* `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados.

* `MaxNoOfOpenFiles`: Número máximo de arquivos abertos por nó de dados. (Um thread é criado por arquivo).

* `MaxNoOfOrderedIndexes`: Número total de índices ordenados que podem ser definidos no sistema.

* `MaxNoOfSavedMessages`: Número máximo de mensagens de erro a serem escritas no log de erro e número máximo de arquivos de registro a serem mantidos.

* `MaxNoOfSubscribers`: Número máximo de assinantes.

* `MaxNoOfSubscriptions`: Número máximo de assinaturas (padrão 0 = MaxNoOfTables).

* `MaxNoOfTables`: Sugere o número total de tabelas NDB armazenadas no banco de dados.

* `MaxNoOfTriggers`: Número total de gatilhos que podem ser definidos no sistema.

* `MaxNoOfUniqueHashIndexes`: Número total de índices hash únicos que podem ser definidos no sistema.

* `MaxParallelCopyInstances`: Número de cópias paralelas durante o reinício do nó. O padrão é 0, que usa o número de LDMs em ambos os nós, até um máximo de 16.

* `MaxParallelScansPerFragment`: Número máximo de varreduras paralelas por fragmento. Quando esse limite é atingido, as varreduras são serializadas.

* `MaxReorgBuildBatchSize`: Tamanho máximo da batch de varredura para uso na reorganização de partições de tabela. Aumentar esse valor pode acelerar a reorganização de partições de tabela, mas também impacta o tráfego em andamento.

* `MaxStartFailRetries`: Retrias máximas quando o nó de dados falha ao iniciar, exigindo StopOnError = 0. Definir para 0 faz com que as tentativas de início continuem indefinidamente.

* `MaxUIBuildBatchSize`: Tamanho máximo da batch de varredura para uso na construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também impacta o tráfego em andamento.

* `MemReportFrequency`: Frequência dos relatórios de memória em segundos; 0 = relatar apenas quando ultrapassar os limites de porcentagem.

* `MinDiskWriteSpeed`: Número mínimo de bytes por segundo que o LCP e o backup podem escrever.

* `MinFreePct`: Porcentagem de recursos de memória a serem mantidos em reserva para reinicializações.

* `NodeGroup`: Grupo de nós ao qual o nó de dados pertence; usado apenas durante o início inicial do clúster.

* `NodeGroupTransporters`: Número de transportadores a serem usados entre os nós do mesmo grupo de nós.

* `NodeId`: Número que identifica de forma única o nó de dados entre todos os nós do clúster.

* `NoOfFragmentLogFiles`: Número de arquivos de log de refazer de 16 MB em cada um dos 4 conjuntos de arquivos pertencentes ao nó de dados.

* `NoOfReplicas`: Número de cópias de todos os dados na base de dados.

* `Numa`: (Apenas Linux; requer libnuma) Controla o suporte NUMA. Definir para 0 permite que o sistema determine o uso de interleaving pelo processo do nó de dados; 1 significa que é determinado pelo nó de dados.

* `ODirect`: Usar leituras e escritas de arquivos O_DIRECT quando possível.

* `ODirectSyncFlag`: As escritas O_DIRECT são tratadas como escritas sincronizadas; ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está definido como SPARSE ou ambos.

* `RealtimeScheduler`: Quando verdadeiro, os threads dos nós de dados são agendados como threads em tempo real. O padrão é falso.

* `RecoveryWork`: Porcentagem do overhead de armazenamento para os arquivos LCP: um valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação.

* `RedoBuffer`: Número de bytes em cada nó de dados alocados para escrever logs de refazer.

* `RedoOverCommitCounter`: Quando o RedoOverCommitLimit foi excedido, quantas vezes, as transações são abortadas e as operações são tratadas conforme especificado por DefaultOperationRedoProblemAction.

* `RedoOverCommitLimit`: Cada vez que o processo de esvaziamento do buffer de redo leva mais tempo do que este número de segundos, o número de vezes que isso aconteceu é comparado ao RedoOverCommitCounter.

* `RequireEncryptedBackup`: Se os backups devem ser criptografados (1 = criptografia necessária, caso contrário 0).

* `RequireCertificate`: O nó deve encontrar a chave e o certificado no caminho de busca do TLS.

* `RequireTls`: Exigir conexões seguras autenticadas por TLS.

* `ReservedConcurrentIndexOperations`: Número de operações de índice simultâneas com recursos dedicados em um nó de dados.

* `ReservedConcurrentOperations`: Número de operações simultâneas com recursos dedicados em coordenadores de transação em um nó de dados.

* `ReservedConcurrentScans`: Número de varreduras simultâneas com recursos dedicados em um nó de dados.

* `ReservedConcurrentTransactions`: Número de transações simultâneas com recursos dedicados em um nó de dados.

* `ReservedFiredTriggers`: Número de gatilhos com recursos dedicados em um nó de dados.

* `ReservedLocalScans`: Número de varreduras simultâneas de fragmentos com recursos dedicados em um nó de dados.

* `ReservedTransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para dados de chave e atributo alocados a cada nó de dados.

* `RestartOnErrorInsert`: Tipo de reinício causado pela inserção de erro (quando StopOnError está habilitado).

* `RestartSubscriberConnectTimeout`: Tempo de espera do nó de dados para que os nós de API de subscrição se conectem. Defina para 0 para desabilitar o tempo de espera, que é sempre resolvido para o segundo inteiro mais próximo.

* `SchedulerExecutionTimer`: Número de microsegundos para executar no agendamento antes de enviar.

* `SchedulerResponsiveness`: Defina a otimização da resposta do agendamento NDB de 0 a 10; valores mais altos fornecem um tempo de resposta melhor, mas menor throughput.

* `SchedulerSpinTimer`: Número de microsegundos para executar no agendador antes de dormir.

* `ServerPort`: Porta usada para configurar o transportador para conexões recebidas de nós da API.

* `SharedGlobalMemory`: Número total de bytes em cada nó de dados alocados para qualquer uso.

* `SpinMethod`: Determina o método de rotação usado pelo nó de dados; consulte a documentação para detalhes.

* `StartFailRetryDelay`: Retardo em segundos após a falha de inicialização antes de tentar novamente; requer StopOnError = 0.

* `StartFailureTimeout`: Milisegundos para esperar antes de encerrar. (0=Aguarde para sempre).

* `StartNoNodeGroupTimeout`: Tempo para esperar por nós sem nó grupo antes de tentar iniciar (0=para sempre).

* `StartPartialTimeout`: Milisegundos para esperar antes de tentar iniciar sem todos os nós. (0=Aguarde para sempre).

* `StartPartitionedTimeout`: Milisegundos para esperar antes de tentar iniciar particionado. (0=Aguarde para sempre).

* `StartupStatusReportFrequency`: Frequência de relatórios de status durante a inicialização.

* `StopOnError`: Quando definido para 0, o nó de dados reinicia automaticamente e recupera após falhas de nó.

* `StringMemory`: Tamanho padrão da memória de string (0 a 100 = % do máximo, 101+ = bytes reais).

* `TcpBind_INADDR_ANY`: Vincule IP_ADDR_ANY para que conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente).

* `TimeBetweenEpochs`: Tempo entre épocas (sincronização usada para replicação).

* `TimeBetweenEpochsTimeout`: Retardo para o tempo entre épocas. Exceder causa o desligamento do nó.

* `TimeBetweenGlobalCheckpoints`: Tempo entre os commits de transações no grupo no disco.

* `TimeBetweenGlobalCheckpointsTimeout`: Retardo mínimo para o commit de transações no grupo no disco.

* `TimeBetweenInactiveTransactionAbortCheck`: Tempo entre verificações de transações inativas.

* `TimeBetweenLocalCheckpoints`: Tempo entre a captura de instantâneos do banco de dados (expresso como logaritmo base-2 de bytes).

* `TimeBetweenWatchDogCheck`: Tempo entre as verificações de execução dentro do nó de dados.

* `TimeBetweenWatchDogCheckInitial`: Tempo entre as verificações de execução dentro do nó de dados (fases de início precoce quando a memória é alocada).

* `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

* `TransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para dados de chave e atributo alocados para cada nó de dados.

* `TransactionDeadlockDetectionTimeout`: Tempo que a transação pode gastar executando dentro do nó de dados. Esse é o tempo que o coordenador da transação espera que cada nó de dados que participa da transação execute a solicitação. Se o nó de dados demorar mais que esse tempo, a transação é abortada.

* `TransactionInactiveTimeout`: Milissegundos que o aplicativo espera antes de executar outra parte da transação. Esse é o tempo que o coordenador da transação espera que o aplicativo execute ou envie outra parte (consulta, declaração) da transação. Se o aplicativo demorar muito, a transação é abortada. O tempo de espera = 0 significa que o aplicativo nunca esgota o tempo de espera.

* `TransactionMemory`: Memória alocada para transações em cada nó de dados.

* `TwoPassInitialNodeRestartCopy`: Cópia de dados em 2 passes durante o reinício inicial do nó, o que permite a construção de índices ordenados em multithread para tais reinicializações.

* `UndoDataBuffer`: Desutilizado; não tem efeito.

* `UndoIndexBuffer`: Desutilizado; não tem efeito.

* `UseShm`: Usar conexões de memória compartilhada entre este nó de dados e o nó de API que também está rodando neste host.

* `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente mortos sempre que ocorrerem problemas com o watchdog; usado para testes e depuração.

Os seguintes parâmetros são específicos para **ndbmtd)**:

* `AutomaticThreadConfig`: Use a configuração automática de threads; substitui quaisquer configurações para ThreadConfig e MaxNoOfExecutionThreads e desabilita a Fragmentação Clássica.

* `ClassicFragmentation`: Quando verdadeiro, use a fragmentação tradicional da tabela; defina para falso para habilitar a distribuição flexível dos fragmentos entre os LDM. Desabilitado por AutomaticThreadConfig.

* `EnableMultithreadedBackup`: Habilitar backup multithread.

* `MaxNoOfExecutionThreads`: Para ndbmtd apenas, especifique o número máximo de threads de execução.

* `MaxSendDelay`: Número máximo de microsegundos para atrasar o envio pelo ndbmtd.

* `NoOfFragmentLogParts`: Número de grupos de arquivos de log de revisão que pertencem a este nó de dados.

* `NumCPUs`: Especifique o número de CPUs a serem usadas com AutomaticThreadConfig.

* `PartitionsPerNode`: Determina o número de partições da tabela criadas em cada nó de dados; não é usado se a Fragmentação Clássica estiver habilitada.

* `ThreadConfig`: Usado para a configuração de nós de dados multithread (ndbmtd). O padrão é uma string vazia; consulte a documentação para sintaxe e outras informações.