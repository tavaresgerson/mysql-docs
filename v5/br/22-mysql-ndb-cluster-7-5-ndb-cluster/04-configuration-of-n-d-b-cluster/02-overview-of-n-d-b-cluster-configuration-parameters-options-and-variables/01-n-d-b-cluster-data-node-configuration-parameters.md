#### 21.4.2.1 Parâmetros de configuração do nó de dados do cluster NDB

Os listados nesta seção fornecem informações sobre os parâmetros usados nas seções `[ndbd]` ou `[ndbd default]` de um arquivo `config.ini` para configurar os nós de dados do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte Seção 21.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.

Esses parâmetros também se aplicam a **ndbmtd**, a versão multithread do **ndbd**. Uma lista separada de parâmetros específicos para **ndbmtd** segue.

- `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas no nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10.

- `Arbitração`: Como a arbitragem deve ser realizada para evitar problemas de "split-brain" em caso de falha de um nó.

- `ArbitrationTimeout`: Tempo máximo (em milissegundos) que a partição do banco de dados aguarda pelo sinal de arbitragem.

- `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes).

- `BackupDataDir`: Caminho para onde armazenar os backups. Observe que a string `/BACKUP` é sempre anexada a esta configuração, de modo que o padrão *efetivo* é FileSystemPath/BACKUP.

- `BackupDiskWriteSpeedPct`: Define a porcentagem da velocidade máxima de escrita alocada no nó de dados (MaxDiskWriteSpeed) para reservar para LCPs ao iniciar o backup.

- `BackupLogBufferSize`: Tamanho padrão do buffer de log para backup (em bytes).

- `BackupMaxWriteSize`: Tamanho máximo de escritas no sistema de arquivos feitas pelo backup (em bytes).

- `BackupMemory`: Memória total alocada para backups por nó (em bytes).

- `BackupReportFrequency`: Frequência dos relatórios de status de backup durante o backup em segundos.

- `BackupWriteSize`: Tamanho padrão de escritas no sistema de arquivos feitas pelo backup (em bytes).

- `BatchSizePerLocalScan`: Usado para calcular o número de registros bloqueados para varredura com bloqueio de retenção.

- `BuildIndexThreads`: Número de threads a serem usadas para a construção de índices ordenados durante o reinício do sistema ou do nó. Também se aplica ao executar ndb\_restore --rebuild-indexes. Definir este parâmetro para 0 desativa a construção de índices ordenados em múltiplas threads.

- `CompressedBackup`: Use o zlib para comprimir os backups conforme eles são escritos.

- `CompressedLCP`: Escreva LCPs comprimidos usando zlib.

- `ConnectCheckIntervalDelay`: Tempo entre as etapas de verificação da conectividade do nó de dados. O nó de dados é considerado suspeito após 1 intervalo e morto após 2 intervalos sem resposta.

- `CrashOnCorruptedTuple`: Quando ativado, força o nó a desligar sempre que detectar uma tupla corrompida.

- `DataDir`: Diretório de dados para este nó.

- `DataMemory`: Número de bytes em cada nó de dados alocados para armazenar dados; sujeito à RAM disponível do sistema e ao tamanho do IndexMemory.

- `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para os mapas de hash da tabela. São suportados três valores: 0, 240 e 3840.

- `DictTrace`: Habilitar a depuração do DBDICT; para o desenvolvimento do NDB.

- `DiskIOThreadPool`: Número de threads não vinculadas para acesso a arquivos, aplica-se apenas aos dados do disco.

- `Diskless`: Execute sem usar disco.

- `DiskPageBufferEntries`: Memória a ser alocada na memória DiskPageBufferMemory; transações de disco muito grandes podem exigir o aumento deste valor.

- `DiskPageBufferMemory`: Número de bytes em cada nó de dados alocados para o cache de buffer de página de disco.

- `DiskSyncSize`: Quantidade de dados escritos no arquivo antes que a sincronização seja forçada.

- `EnablePartialLcp`: Ative LCP parcial (verdadeiro); se estiver desativado (falso), todos os LCPs escreverão pontos de verificação completos.

- `EnableRedoControl`: Ative a velocidade adaptativa de verificação de ponto de controle para controlar o uso do log de reverso.

- `EventLogBufferSize`: Tamanho do buffer circular para eventos de log do NDB dentro dos nós de dados.

- `ExecuteOnComputer`: String que faz referência ao COMPUTADOR definido anteriormente.

- `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além de qualquer memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

- `FileSystemPath`: Caminho para o diretório onde o nó de dados armazena seus dados (o diretório deve existir).

- `FileSystemPathDataFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de dados de disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, o FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

- `FileSystemPathDD`: Caminho para o diretório onde o nó de dados armazena seus dados de disco e arquivos de desfazer. O valor padrão é FileSystemPath, se definido; caso contrário, o valor de DataDir é usado.

- `FileSystemPathUndoFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de desfazer para Dados de Disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, o FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

- `FragmentLogFileSize`: Tamanho de cada arquivo de registro de refazer.

- `HeartbeatIntervalDbApi`: Tempo entre os batimentos cardíacos dos nós de dados do nó API. (A conexão da API é fechada após 3 batimentos cardíacos perdidos).

- `HeartbeatIntervalDbDb`: Tempo entre os batimentos cardíacos entre os nós de dados; o nó de dados é considerado morto após 3 batimentos cardíacos perdidos.

- `HeartbeatOrder`: Define a ordem em que os nós de dados verificam os batimentos cardíacos uns dos outros para determinar se o nó dado ainda está ativo e conectado ao clúster. Deve ser zero para todos os nós de dados ou valores distintos e não nulos para todos os nós de dados; consulte a documentação para obter mais informações.

- `HostName`: Nome do host ou endereço IP para este nó de dados.

- `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM disponível do sistema e ao tamanho da DataMemory.

- `IndexStatAutoCreate`: Ative/desative a coleta automática de estatísticas quando os índices são criados.

- `IndexStatAutoUpdate`: Monitore os índices para detectar alterações e ativar atualizações automáticas de estatísticas.

- `IndexStatSaveScale`: Fator de escala usado para determinar o tamanho das estatísticas do índice armazenado.

- `IndexStatSaveSize`: Tamanho máximo em bytes para estatísticas salvas por índice.

- `IndexStatTriggerPct`: Mudança percentual de limiar nas operações de DML para atualizações de estatísticas de índice. O valor é reduzido por IndexStatTriggerScale.

- `IndexStatTriggerScale`: Reduza o IndexStatTriggerPct por essa quantidade, multiplicado pelo logaritmo em base 2 do tamanho do índice, para índices grandes. Defina para 0 para desativar a escala.

- `IndexStatUpdateDelay`: Retardo mínimo entre as atualizações automáticas das estatísticas do índice para o índice especificado. 0 significa sem atraso.

- `InitFragmentLogFiles`: Inicialize os arquivos de registro do fragmento, usando o formato esparso ou completo.

- `InitialLogFileGroup`: Descreve o grupo de arquivos de registro criado durante o início inicial. Consulte a documentação para o formato.

- `InitialNoOfOpenFiles`: Número inicial de arquivos abertos por nó de dados. (Um fio é criado por arquivo).

- `InitialTablespace`: Descreve o espaço de tabelas criado durante o início inicial. Consulte a documentação para o formato.

- `InsertRecoveryWork`: Porcentagem de Trabalho de Recuperação usada para as linhas inseridas; não tem efeito a menos que pontos de verificação locais parciais estejam em uso.

- `LateAlloc`: Alocar memória após a conexão com o servidor de gerenciamento ter sido estabelecida.

- `LcpScanProgressTimeout`: Tempo máximo em que o escaneamento de fragmentos de ponto de verificação local pode ser interrompido antes que o nó seja desligado para garantir o progresso do LCP em todo o sistema. Use 0 para desabilitar.

- `LocationDomainId`: Atribua este nó de dados a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco.

- `LockExecuteThreadToCPU`: Lista de IDs de CPU separados por vírgula.

- `LockMaintThreadsToCPU`: ID da CPU que indica qual CPU executa os threads de manutenção.

- `LockPagesInMainMemory`: 0=desabilitar o bloqueio, 1=bloquear após a alocação de memória, 2=bloquear antes da alocação de memória.

- `LogLevelCheckpoint`: Nível de log da informação do ponto de verificação local e global impressa no stdout.

- `LogLevelCongestion`: Nível de informações de congestionamento impressas no stdout.

- `LogLevelConnection`: Nível de informações de conexão/desconexão do nó impressas no stdout.

- `LogLevelError`: Transportador, erros de batida de coração impressos em stdout.

- `LogLevelInfo`: Informações de batimento cardíaco e log geradas e impressas no stdout.

- `LogLevelNodeRestart`: Nível de reinício do nó e informações de falha do nó impressas no stdout.

- `LogLevelShutdown`: Nível de informações de desligamento do nó impressas no stdout.

- `LogLevelStartup`: Nível de informações de inicialização do nó impressas no stdout.

- `LogLevelStatistic`: Nível de informações de transação, operação e transportador impressas no stdout.

- `LongMessageBuffer`: Número de bytes alocados em cada nó de dados para mensagens longas internas.

- `MaxAllocate`: Não é mais usado; não tem efeito.

- `MaxBufferedEpochs`: Número de épocas permitidas que o nó assinante pode atrasar (épocas não processadas). Exceder esse limite faz com que os assinantes atrasados sejam desconectados.

- `MaxBufferedEpochBytes`: Número total de bytes alocados para o buffer de épocas.

- `MaxDiskWriteSpeed`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando não há reinicializações em andamento.

- `MaxDiskWriteSpeedOtherNodeRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e pelo backup quando outro nó estiver sendo reiniciado.

- `MaxDiskWriteSpeedOwnRestart`: Número máximo de bytes por segundo que o LCP e o backup podem escrever quando este nó estiver sendo reiniciado.

- `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento.

- `MaxDMLOperationsPerTransaction`: Limite do tamanho da transação; interrompe a transação se ela exigir mais do que esse número de operações de DML.

- `MaxLCPStartDelay`: Tempo em segundos que o LCP busca o mutex do ponto de verificação (para permitir que outros nós de dados completem a sincronização de metadados) antes de colocar-se na fila de bloqueio para a recuperação paralela dos dados da tabela.

- `MaxNoOfAttributes`: Sugere o número total de atributos armazenados no banco de dados (soma de todas as tabelas).

- `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados.

- `MaxNoOfConcurrentOperations`: Número máximo de registros de operações no coordenador de transações.

- `MaxNoOfConcurrentScans`: Número máximo de varreduras executadas simultaneamente no nó de dados.

- `MaxNoOfConcurrentSubOperations`: Número máximo de operações de assinante concorrentes.

- `MaxNoOfConcurrentTransactions`: Número máximo de transações que podem ser executadas simultaneamente neste nó de dados. O número total de transações que podem ser executadas simultaneamente é este valor multiplicado pelo número de nós de dados no clúster.

- `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser acionados simultaneamente em um nó de dados.

- `MaxNoOfLocalOperations`: Número máximo de registros de operações definidos neste nó de dados.

- `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados.

- `MaxNoOfOpenFiles`: Número máximo de arquivos abertos por nó de dados. (Um thread é criado por arquivo).

- `MaxNoOfOrderedIndexes`: Número total de índices ordenados que podem ser definidos no sistema.

- `MaxNoOfSavedMessages`: Número máximo de mensagens de erro a serem escritas no log de erro e número máximo de arquivos de rastreamento a serem mantidos.

- `MaxNoOfSubscribers`: Número máximo de assinantes.

- `MaxNoOfSubscriptions`: Número máximo de assinaturas (padrão 0 = MaxNoOfTables).

- `MaxNoOfTables`: Sugere o número total de tabelas NDB armazenadas no banco de dados.

- `MaxNoOfTriggers`: Número total de gatilhos que podem ser definidos no sistema.

- `MaxNoOfUniqueHashIndexes`: Número total de índices de hash únicos que podem ser definidos no sistema.

- `MaxParallelCopyInstances`: Número de cópias paralelas durante o reinício do nó. O valor padrão é 0, que usa o número de LDMs em ambos os nós, até um máximo de 16.

- `MaxParallelScansPerFragment`: Número máximo de varreduras paralelas por fragmento. Quando esse limite é atingido, as varreduras são serializadas.

- `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a reorganização das partições da tabela. Aumentar esse valor pode acelerar a reorganização das partições da tabela, mas também afeta o tráfego em andamento.

- `MaxStartFailRetries`: Retenções máximas quando o nó de dados falha durante o início, requer StopOnError = 0. Definir para 0 faz com que as tentativas de início continuem indefinidamente.

- `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também afeta o tráfego em andamento.

- `MemReportFrequency`: Frequência dos relatórios de memória em segundos; 0 = relatar apenas quando ultrapassar os limites percentuais.

- `MinDiskWriteSpeed`: Número mínimo de bytes por segundo que podem ser escritos pelo LCP e pelo backup.

- `MinFreePct`: Porcentagem de recursos de memória a serem mantidos em reserva para reinicializações.

- `NodeGroup`: Grupo de nós ao qual o nó de dados pertence; usado apenas durante o início inicial do clúster.

- `NodeId`: Número que identifica de forma única o nó de dados entre todos os nós do cluster.

- `NoOfFragmentLogFiles`: Número de arquivos de log de redo de 16 MB em cada um dos 4 conjuntos de arquivos pertencentes ao nó de dados.

- `NoOfReplicas`: Número de cópias de todos os dados no banco de dados.

- `Numa`: (apenas Linux; requer libnuma) Controla o suporte NUMA. Definir para 0 permite que o sistema determine o uso de interleaving pelo processo do nó de dados; 1 significa que é determinado pelo nó de dados.

- `ODirect`: Use leituras e escritas de arquivos O\_DIRECT quando possível.

- `ODirectSyncFlag`: As escritas O\_DIRECT são tratadas como escritas sincronizadas; são ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está configurado como SPARSE ou ambos.

- `RealtimeScheduler`: Quando verdadeiro, os threads dos nós de dados são agendados como threads em tempo real. O padrão é falso.

- `RecoveryWork`: Porcentagem de overhead de armazenamento para arquivos LCP: um valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação.

- `RedoBuffer`: Número de bytes em cada nó de dados alocados para gravação de logs de refazer.

- `RedoOverCommitCounter`: Quando o limite de RedoOverCommit foi ultrapassado quantas vezes, as transações são abortadas e as operações são tratadas conforme especificado pela ação de problema de operação padrão.

- `RedoOverCommitLimit`: Cada vez que o esvaziamento do buffer de redo atual leva mais tempo do que este número de segundos, o número de vezes que isso aconteceu é comparado ao RedoOverCommitCounter.

- `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado.

- `RestartOnErrorInsert`: Tipo de controle de reinício causado pela inserção de um erro (quando o StopOnError está habilitado).

- `RestartSubscriberConnectTimeout`: Tempo que o nó de dados espera para os nós da API de subscrição se conectarem. Defina para 0 para desativar o tempo de espera, que é sempre arredondado para o segundo inteiro mais próximo.

- `SchedulerExecutionTimer`: Número de microsegundos para executar no agendador antes de enviar.

- `SchedulerResponsiveness`: Defina a otimização da resposta do planejador NDB de 0 a 10. Valores mais altos proporcionam um melhor tempo de resposta, mas menor desempenho.

- `SchedulerSpinTimer`: Número de microsegundos para executar no agendador antes de dormir.

- `ServerPort`: Porta usada para configurar o transportador para conexões de entrada de nós da API.

- `SharedGlobalMemory`: Número total de bytes em cada nó de dados alocados para qualquer uso.

- `StartFailRetryDelay`: Retardo em segundos após a falha de início antes de tentar novamente; requer StopOnError = 0.

- `StartFailureTimeout`: Milisegundos para esperar antes de encerrar. (0 = Aguarde para sempre).

- `StartNoNodeGroupTimeout`: Tempo para esperar por nós sem grupo de nós antes de tentar iniciar (0=para sempre).

- `StartPartialTimeout`: Milisegundos para esperar antes de tentar iniciar sem todos os nós. (0 = Aguarde para sempre).

- `StartPartitionedTimeout`: Milisegundos para esperar antes de tentar iniciar a partição. (0 = Aguarde para sempre).

- `StartupStatusReportFrequency`: Frequência dos relatórios de status durante o início.

- `StopOnError`: Quando definido para 0, o nó de dados reinicia automaticamente e recupera após falhas no nó seguinte.

- `StringMemory`: Tamanho padrão da memória de strings (0 a 100 = % do máximo, 101+ = bytes reais).

- `TcpBind_INADDR_ANY`: Vincule o IP\_ADDR\_ANY para que as conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente).

- `TimeBetweenEpochs`: Tempo entre épocas (sincronização usada para replicação).

- `TimeBetweenEpochsTimeout`: Tempo de espera entre épocas. Exceder esse tempo faz com que o nó seja desligado.

- `TimeBetweenGlobalCheckpoints`: Tempo entre os commits de grupo de transações no disco.

- `TimeBetweenGlobalCheckpointsTimeout`: Limite de tempo mínimo para o commit de grupo de transações no disco.

- `TimeBetweenInactiveTransactionAbortCheck`: Tempo entre as verificações de transações inativas.

- `TimeBetweenLocalCheckpoints`: Tempo entre a captura de instantâneos do banco de dados (expresso em logaritmo base 2 de bytes).

- `TimeBetweenWatchDogCheck`: Tempo entre as verificações do WatchDog dentro do nó de dados.

- `TimeBetweenWatchDogCheckInitial`: Tempo entre as verificações do WatchDog no nó de dados (fases de início precoce quando a memória é alocada).

- `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

- `TransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para dados de chave e atributo alocados para cada nó de dados.

- `TransactionDeadlockDetectionTimeout`: Tempo que a transação pode gastar executando dentro do nó de dados. Esse é o tempo que o coordenador da transação espera para cada nó de dados que participa da transação executar a solicitação. Se o nó de dados levar mais tempo do que esse valor, a transação é abortada.

- `TransactionInactiveTimeout`: Milissegundos que o aplicativo espera antes de executar outra parte da transação. Esse é o tempo que o coordenador da transação espera para que o aplicativo execute ou envie outra parte (consulta, declaração) da transação. Se o aplicativo demorar muito, a transação é abortada. O tempo de espera = 0 significa que o aplicativo nunca fica parado.

- `TwoPassInitialNodeRestartCopy`: Copie os dados em 2 passes durante o reinício inicial do nó, o que permite a construção em múltiplas threads de índices ordenados para tais reinicializações.

- `UndoDataBuffer`: Desutilizado; não tem efeito.

- `UndoIndexBuffer`: Não utilizado; não tem efeito.

- `UseShm`: Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está rodando neste host.

- `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente eliminados sempre que ocorrerem problemas com o watchdog; usado para testes e depuração.

Os seguintes parâmetros são específicos para **ndbmtd**:

- `MaxNoOfExecutionThreads`: Apenas para ndbmtd, especifique o número máximo de threads de execução.

- `MaxSendDelay`: Número máximo de microsegundos para atrasar o envio pelo ndbmtd.

- `NoOfFragmentLogParts`: Número de grupos de arquivos de registro de refazer que pertencem a este nó de dados.

- `ThreadConfig`: Usado para a configuração de nós de dados multithread (ndbmtd). O padrão é uma string vazia; consulte a documentação para sintaxe e outras informações.
