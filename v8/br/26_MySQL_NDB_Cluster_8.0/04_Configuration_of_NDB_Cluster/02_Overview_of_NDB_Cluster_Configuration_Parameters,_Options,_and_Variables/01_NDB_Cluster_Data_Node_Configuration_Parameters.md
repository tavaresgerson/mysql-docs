#### 25.4.2.1 Parâmetros de configuração do nó de dados do cluster NDB

Os listados nesta seção fornecem informações sobre os parâmetros usados nas seções `[ndbd]` ou `[ndbd default]` de um arquivo `config.ini` para configurar os nós de dados do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.

Esses parâmetros também se aplicam a **ndbmtd**"), a versão multithread do **ndbd**. Uma lista separada de parâmetros específicos para **ndbmtd**") segue abaixo.

- `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas no nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10.

- `Arbitration`: Como a arbitragem deve ser realizada para evitar problemas de "split-brain" em caso de falha do nó.

- `ArbitrationTimeout`: Tempo máximo (em milissegundos) que a partição do banco de dados aguarda pelo sinal de arbitragem.

- `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes).

- `BackupDataDir`: Caminho para onde armazenar os backups. Observe que a string '/BACKUP' é sempre anexada a esta configuração, de modo que o padrão *efetivo* é FileSystemPath/BACKUP.

- `BackupDiskWriteSpeedPct`: Define a porcentagem da velocidade máxima de escrita alocada para o nó de dados (MaxDiskWriteSpeed) para reservar para os LCPs ao iniciar o backup.

- `BackupLogBufferSize`: Tamanho padrão do buffer de log para backup (em bytes).

- `BackupMaxWriteSize`: Tamanho máximo de escritas no sistema de arquivos feitas pelo backup (em bytes).

- `BackupMemory`: Memória total alocada para backups por nó (em bytes).

- `BackupReportFrequency`: Frequência dos relatórios de status de backup durante o backup em segundos.

- `BackupWriteSize`: Tamanho padrão de gravações no sistema de arquivos feitas pelo backup (em bytes).

- `BatchSizePerLocalScan`: Usado para calcular o número de registros de bloqueio para varredura com bloqueio de retenção.

- `BuildIndexThreads`: Número de threads a serem usadas para a construção de índices ordenados durante o reinício do sistema ou do nó. Também se aplica ao executar ndb\_restore --rebuild-indexes. Definir este parâmetro para 0 desativa a construção em multithread de índices ordenados.

- `CompressedBackup`: Use o zlib para comprimir os backups conforme eles são escritos.

- `CompressedLCP`: Escreva LCPs compactados usando zlib.

- `ConnectCheckIntervalDelay`: Tempo entre as etapas de verificação da conectividade do nó de dados. O nó de dados é considerado suspeito após 1 intervalo e morto após 2 intervalos sem resposta.

- `CrashOnCorruptedTuple`: Quando ativado, obriga o nó a desligar sempre que detectar uma tupla corrompida.

- `DataDir`: Diretório de dados para este nó.

- `DataMemory`: Número de bytes em cada nó de dados alocados para armazenar dados; sujeito à RAM do sistema disponível e ao tamanho da IndexMemory.

- `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para mapas de hash de tabelas. São suportados três valores: 0, 240 e 3840.

- `DictTrace`: Habilitar depuração do DBDICT; para o desenvolvimento do NDB.

- `DiskDataUsingSameDisk`: Defina para falso se os espaços de dados de disco estiverem localizados em discos físicos separados.

- `DiskIOThreadPool`: Número de threads não associadas para acesso ao arquivo, aplica-se apenas aos dados do disco.

- `Diskless`: Execute sem usar o disco.

- `DiskPageBufferEntries`: Memória a ser alocada no DiskPageBufferMemory; transações de disco muito grandes podem exigir o aumento deste valor.

- `DiskPageBufferMemory`: Número de bytes em cada nó de dados alocados para o cache de buffer de página de disco.

- `DiskSyncSize`: Quantidade de dados escritos no arquivo antes da sincronização ser forçada.

- `EnablePartialLcp`: Ative LCP parcial (verdadeiro); se estiver desativado (falso), todos os LCPs escreverão pontos de verificação completos.

- `EnableRedoControl`: Habilitar a velocidade de checkpointing adaptativo para controlar o uso do log de revisão.

- `EncryptedFileSystem`: Criptografar arquivos de ponto de verificação e espaço de tabela locais.

- `EventLogBufferSize`: Tamanho do buffer circular para eventos de log do NDB dentro dos nós de dados.

- `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente.

- `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além de qualquer alocação feita por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

- `FileSystemPath`: Caminho para o diretório onde o nó de dados armazena seus dados (o diretório deve existir).

- `FileSystemPathDataFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de dados de disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, o FilesystemPath é usado se estiver definido; caso contrário, o valor de DataDir é usado.

- `FileSystemPathDD`: Caminho para o diretório onde o nó de dados armazena seus dados de disco e arquivos de desfazer. O valor padrão é FileSystemPath, se definido; caso contrário, o valor de DataDir é usado.

- `FileSystemPathUndoFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de desfazer para Dados de Disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, o FilesystemPath é usado se estiver definido; caso contrário, o valor de DataDir é usado.

- `FragmentLogFileSize`: Tamanho de cada arquivo de registro de refazer.

- `HeartbeatIntervalDbApi`: Tempo entre os batimentos cardíacos do nó de dados da API. (A conexão da API foi fechada após 3 batimentos cardíacos perdidos).

- `HeartbeatIntervalDbDb`: Tempo entre os batimentos cardíacos entre os nós de dados; o nó de dados é considerado morto após 3 batimentos cardíacos perdidos.

- `HeartbeatOrder`: Define a ordem em que os nós de dados verificam os batimentos cardíacos uns dos outros para determinar se o nó dado ainda está ativo e conectado ao clúster. Deve ser zero para todos os nós de dados ou valores distintos e não nulos para todos os nós de dados; consulte a documentação para obter mais informações.

- `HostName`: Nome do host ou endereço IP para este nó de dados.

- `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM do sistema disponível e ao tamanho da DataMemory.

- `IndexStatAutoCreate`: Habilitar/desabilitar a coleta automática de estatísticas ao criar índices.

- `IndexStatAutoUpdate`: Monitore índices para detectar alterações e acione atualizações automáticas de estatísticas.

- `IndexStatSaveScale`: Fator de escala utilizado para determinar o tamanho das estatísticas do índice armazenado.

- `IndexStatSaveSize`: Tamanho máximo em bytes para estatísticas salvas por índice.

- `IndexStatTriggerPct`: Porcentagem de mudança de limiar nas operações de DML para atualizações de estatísticas de índice. O valor é reduzido por IndexStatTriggerScale.

- `IndexStatTriggerScale`: Reduza o IndexStatTriggerPct por essa quantidade, multiplicado pelo logaritmo em base 2 do tamanho do índice, para índices grandes. Defina para 0 para desativar a escala.

- `IndexStatUpdateDelay`: Retardo mínimo entre as atualizações automáticas das estatísticas do índice para o índice dado. 0 significa sem atraso.

- `InitFragmentLogFiles`: Inicialize os arquivos de registro de fragmentos, usando o formato esparso ou completo.

- `InitialLogFileGroup`: Descreve o grupo de arquivo de registro que é criado durante o início inicial. Consulte a documentação para o formato.

- `InitialNoOfOpenFiles`: Número inicial de arquivos abertos por nó de dados. (Um fio é criado por arquivo).

- `InitialTablespace`: Descreve o espaço de tabela que é criado durante o início inicial. Consulte a documentação para o formato.

- `InsertRecoveryWork`: Porcentagem de Trabalho de Recuperação usada para linhas inseridas; não tem efeito a menos que pontos de verificação locais parciais estejam em uso.

- `KeepAliveSendInterval`: Tempo entre sinais de manutenção de conexão em links entre nós de dados, em milissegundos. Defina para 0 para desativar.

- `LateAlloc`: Alocar memória após a conexão com o servidor de gerenciamento ter sido estabelecida.

- `LcpScanProgressTimeout`: Tempo máximo que o varrimento de fragmentos de ponto de verificação local pode ser interrompido antes que o nó seja desligado para garantir o progresso do LCP em todo o sistema. Use 0 para desabilitar.

- `LocationDomainId`: Atribua este nó de dados a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco.

- `LockExecuteThreadToCPU`: Lista de IDs de CPU separados por vírgula.

- `LockMaintThreadsToCPU`: ID da CPU que indica qual CPU executa os threads de manutenção.

- `LockPagesInMainMemory`: 0=desabilitar o bloqueio, 1=bloquear após a alocação de memória, 2=bloquear antes da alocação de memória.

- `LogLevelCheckpoint`: Nível de log das informações de verificação local e global impressas no stdout.

- `LogLevelCongestion`: Nível de informação de congestionamento impresso no stdout.

- `LogLevelConnection`: Nível de informações de conexão/desconexão do nó impressas no stdout.

- `LogLevelError`: Erros no coração do transportador impressos no stdout.

- `LogLevelInfo`: Informações de batimento cardíaco e log geradas e impressas no stdout.

- `LogLevelNodeRestart`: Nível de reinício do nó e informações de falha do nó impressas no stdout.

- `LogLevelShutdown`: Nível de informações de desligamento do nó impressas no stdout.

- `LogLevelStartup`: Nível de informações de inicialização do nó impressas no stdout.

- `LogLevelStatistic`: Nível de informações da transação, operação e transportador impressas no stdout.

- `LongMessageBuffer`: Número de bytes alocados em cada nó de dados para mensagens longas internas.

- `MaxAllocate`: Não é mais usado; não tem efeito.

- `MaxBufferedEpochs`: Número máximo de épocas permitidas que o nó assinante pode atrasar (épocas não processadas). Exceder esse limite faz com que os assinantes atrasados sejam desconectados.

- `MaxBufferedEpochBytes`: Número total de bytes alocados para buffer de épocas.

- `MaxDiskDataLatency`: Latência média máxima permitida de acesso ao disco (ms) antes de começar a abortar as transações.

- `MaxDiskWriteSpeed`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando não há reinicializações em andamento.

- `MaxDiskWriteSpeedOtherNodeRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando outro nó estiver sendo reiniciado.

- `MaxDiskWriteSpeedOwnRestart`: Número máximo de bytes por segundo que o LCP e o backup podem escrever quando este nó estiver sendo reiniciado.

- `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento.

- `MaxDMLOperationsPerTransaction`: Limite do tamanho da transação; interrompe a transação se ela exigir mais de quantas operações DML forem necessárias.

- `MaxLCPStartDelay`: Tempo em segundos que o LCP consulta o mutex do ponto de verificação (para permitir que outros nós de dados completem a sincronização de metadados) antes de colocar-se na fila de bloqueio para a recuperação paralela dos dados da tabela.

- `MaxNoOfAttributes`: Sugere o número total de atributos armazenados no banco de dados (soma de todas as tabelas).

- `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados.

- `MaxNoOfConcurrentOperations`: Número máximo de registros de operação no coordenador de transações.

- `MaxNoOfConcurrentScans`: Número máximo de varreduras executadas simultaneamente no nó de dados.

- `MaxNoOfConcurrentSubOperations`: Número máximo de operações de assinante concorrentes.

- `MaxNoOfConcurrentTransactions`: Número máximo de transações que podem ser executadas simultaneamente neste nó de dados. O número total de transações que podem ser executadas simultaneamente é este valor multiplicado pelo número de nós de dados no clúster.

- `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser acionados simultaneamente em um nó de dados.

- `MaxNoOfLocalOperations`: Número máximo de registros de operação definidos neste nó de dados.

- `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados.

- `MaxNoOfOpenFiles`: Número máximo de arquivos abertos por nó de dados. (Um fio é criado por arquivo).

- `MaxNoOfOrderedIndexes`: Número total de índices solicitados que podem ser definidos no sistema.

- `MaxNoOfSavedMessages`: Número máximo de mensagens de erro para serem escritas no log de erro e número máximo de arquivos de rastreamento a serem mantidos.

- `MaxNoOfSubscribers`: Número máximo de assinantes.

- `MaxNoOfSubscriptions`: Número máximo de assinaturas (padrão 0 = MaxNoOfTables).

- `MaxNoOfTables`: Sugere o número total de tabelas NDB armazenadas no banco de dados.

- `MaxNoOfTriggers`: Número total de gatilhos que podem ser definidos no sistema.

- `MaxNoOfUniqueHashIndexes`: Número total de índices de hash únicos que podem ser definidos no sistema.

- `MaxParallelCopyInstances`: Número de cópias paralelas durante o reinício do nó. O padrão é 0, que usa o número de LDMs em ambos os nós, até um máximo de 16.

- `MaxParallelScansPerFragment`: Número máximo de varreduras paralelas por fragmento. Quando esse limite é atingido, as varreduras são serializadas.

- `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para reorganização de partições de tabela. Aumentar esse valor pode acelerar a reorganização de partições de tabela, mas também afeta o tráfego em andamento.

- `MaxStartFailRetries`: Tentativas máximas quando o nó de dados falha ao iniciar, requer StopOnError = 0. Definir para 0 faz com que as tentativas de início continuem indefinidamente.

- `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também afeta o tráfego em andamento.

- `MemReportFrequency`: Frequência de relatórios de memória em segundos; 0 = relatar apenas quando ultrapassar os limites percentuais.

- `MinDiskWriteSpeed`: Número mínimo de bytes por segundo que podem ser escritos pelo LCP e pelo backup.

- `MinFreePct`: Porcentagem de recursos de memória a serem mantidos em reserva para reinicializações.

- `NodeGroup`: Grupo de nós ao qual o nó de dados pertence; usado apenas durante o início inicial do clúster.

- `NodeGroupTransporters`: Número de transportadores a serem usados entre nós no mesmo grupo de nós.

- `NodeId`: Número que identifica de forma única o nó de dados entre todos os nós do cluster.

- `NoOfFragmentLogFiles`: Número de arquivos de registro redo de 16 MB em cada um dos 4 conjuntos de arquivos pertencentes ao nó de dados.

- `NoOfReplicas`: Número de cópias de todos os dados no banco de dados.

- `Numa`: (Apenas para Linux; requer libnuma) Controla o suporte NUMA. Definir para 0 permite que o sistema determine o uso de interleaving pelo processo do nó de dados; 1 significa que é determinado pelo nó de dados.

- `ODirect`: Use leituras e escritas de arquivos O\_DIRECT quando possível.

- `ODirectSyncFlag`: As escritas O\_DIRECT são tratadas como escritas sincronizadas; são ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está configurado como SPARSE ou ambos.

- `RealtimeScheduler`: Quando verdadeiro, os threads dos nós de dados são agendados como threads em tempo real. O padrão é falso.

- `RecoveryWork`: Porcentagem de sobrecarga de armazenamento para arquivos LCP: valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação.

- `RedoBuffer`: Número de bytes em cada nó de dados alocados para gravação de logs de redo.

- `RedoOverCommitCounter`: Quando o limite de refazer foi ultrapassado quantas vezes foram excedidas, as transações são abortadas e as operações são tratadas conforme especificado pela ação de problema de operação padrão de refazer.

- `RedoOverCommitLimit`: Cada vez que o tempo de refazer o buffer de fluxo de limpeza for maior que este número de segundos, o número de vezes que isso aconteceu é comparado ao RedoOverCommitCounter.

- `RequireEncryptedBackup`: Se os backups devem ser criptografados (1 = criptografia necessária, caso contrário 0).

- `ReservedConcurrentIndexOperations`: Número de operações de índice simultâneas com recursos dedicados em um nó de dados.

- `ReservedConcurrentOperations`: Número de operações simultâneas com recursos dedicados nos coordenadores de transação em um nó de dados.

- `ReservedConcurrentScans`: Número de varreduras simultâneas com recursos dedicados em um nó de dados.

- `ReservedConcurrentTransactions`: Número de transações simultâneas com recursos dedicados em um nó de dados.

- `ReservedFiredTriggers`: Número de gatilhos com recursos dedicados em um nó de dados.

- `ReservedLocalScans`: Número de varreduras de fragmentos simultâneas com recursos dedicados em um nó de dados.

- `ReservedTransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para os dados de chave e atributo alocados a cada nó de dados.

- `RestartOnErrorInsert`: Tipo de controle de reinício causado pelo erro de inserção (quando o StopOnError está habilitado).

- `RestartSubscriberConnectTimeout`: Tempo que o nó de dados deve esperar para que os nós de API que se subscrevem se conectem. Defina para 0 para desativar o tempo de espera, que é sempre resolvido para o segundo inteiro mais próximo.

- `SchedulerExecutionTimer`: Número de microsegundos para executar no agendador antes de enviar.

- `SchedulerResponsiveness`: Defina a otimização da resposta do planejador NDB de 0 a 10; valores mais altos proporcionam um melhor tempo de resposta, mas menor desempenho.

- `SchedulerSpinTimer`: Número de microsegundos para executar no agendador antes de dormir.

- `ServerPort`: Porta usada para configurar o transportador para conexões de entrada a partir dos nós da API.

- `SharedGlobalMemory`: Número total de bytes em cada nó de dados alocados para qualquer uso.

- `SpinMethod`: Determina o método de rotação usado pelo nó de dados; consulte a documentação para obter detalhes.

- `StartFailRetryDelay`: Retardo em segundos após a falha de início antes de tentar novamente; requer StopOnError = 0.

- `StartFailureTimeout`: Milisegundos para esperar antes de encerrar. (0 = Aguarde para sempre).

- `StartNoNodeGroupTimeout`: Tempo de espera para nós sem nógroup antes de tentar iniciar (0=para sempre).

- `StartPartialTimeout`: Milisegundos para esperar antes de tentar iniciar sem todos os nós. (0 = Aguarde para sempre).

- `StartPartitionedTimeout`: Milisegundos para esperar antes de tentar iniciar a partição. (0 = Aguarde para sempre).

- `StartupStatusReportFrequency`: Frequência dos relatórios de status durante o início.

- `StopOnError`: Quando configurado para 0, o nó de dados reinicia e recupera automaticamente após falhas no nó seguinte.

- `StringMemory`: Tamanho padrão da memória de string (0 a 100 = % do máximo, 101+ = bytes reais).

- `TcpBind_INADDR_ANY`: Vincule o IP\_ADDR\_ANY para que as conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente).

- `TimeBetweenEpochs`: Tempo entre épocas (sincronização usada para replicação).

- `TimeBetweenEpochsTimeout`: Tempo de espera entre épocas. Exceder esse tempo faz com que o nó seja desligado.

- `TimeBetweenGlobalCheckpoints`: Tempo entre os commits de grupos de transações no disco.

- `TimeBetweenGlobalCheckpointsTimeout`: Limite mínimo de tempo para o commit de grupo de transações no disco.

- `TimeBetweenInactiveTransactionAbortCheck`: Tempo entre os check-ups para transações inativas.

- `TimeBetweenLocalCheckpoints`: Tempo entre a captura de instantâneos do banco de dados (expresso em logaritmo base 2 de bytes).

- `TimeBetweenWatchDogCheck`: Tempo entre os verificações de execução dentro do nó de dados.

- `TimeBetweenWatchDogCheckInitial`: Tempo entre os verificações de execução dentro do nó de dados (fases de início precoce quando a memória é alocada).

- `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

- `TransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para dados de chave e atributo alocados para cada nó de dados.

- `TransactionDeadlockDetectionTimeout`: O tempo de execução da transação pode ser gasto executando dentro do nó de dados. Esse é o tempo que o coordenador da transação espera para cada nó de dados que participa da solicitação. Se o nó de dados levar mais tempo do que esse valor, a transação é abortada.

- `TransactionInactiveTimeout`: Milissegundos que o aplicativo espera antes de executar outra parte da transação. Esse é o tempo que o coordenador da transação espera para que o aplicativo execute ou envie outra parte (consulta, declaração) da transação. Se o aplicativo demorar muito, a transação é abortada. O tempo de espera = 0 significa que o aplicativo nunca é interrompido.

- `TransactionMemory`: Memória alocada para transações em cada nó de dados.

- `TwoPassInitialNodeRestartCopy`: Copie os dados em 2 passes durante o reinício inicial do nó, o que permite a construção em múltiplas threads de índices ordenados para tais reinicializações.

- `UndoDataBuffer`: Não utilizado; sem efeito.

- `UndoIndexBuffer`: Não utilizado; sem efeito.

- `UseShm`: Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está rodando neste host.

- `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente eliminados sempre que ocorrerem problemas com o watchdog; usado para testes e depuração.

Os seguintes parâmetros são específicos para **ndbmtd)**:

- `AutomaticThreadConfig`: Use a configuração automática de threads; substitui quaisquer configurações para ThreadConfig e MaxNoOfExecutionThreads e desabilita a ClassicFragmentation.

- `ClassicFragmentation`: Quando verdadeiro, use a fragmentação tradicional da tabela; defina para falso para habilitar a distribuição flexível dos fragmentos entre os LDM. Desativado por AutomaticThreadConfig.

- `EnableMultithreadedBackup`: Habilitar backup multi-thread.

- `MaxNoOfExecutionThreads`: Para ndbmtd apenas, especifique o número máximo de threads de execução.

- `MaxSendDelay`: Número máximo de microsegundos para atrasar o envio pelo ndbmtd.

- `NoOfFragmentLogParts`: Número de grupos de arquivos de registro de revisão pertencentes a este nó de dados.

- `NumCPUs`: Especifique o número de CPUs a serem usadas com AutomaticThreadConfig.

- `PartitionsPerNode`: Determina o número de partições de tabela criadas em cada nó de dados; não é usado se a fragmentação clássica estiver habilitada.

- `ThreadConfig`: Usado para a configuração de nós de dados multithread (ndbmtd). O padrão é uma string vazia; consulte a documentação para sintaxe e outras informações.
