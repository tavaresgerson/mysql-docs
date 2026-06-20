## 21.4 Configuração do NDB Cluster

Um servidor MySQL que faz parte de um NDB Cluster difere em um aspecto principal de um servidor MySQL normal (não agrupado), pois utiliza o mecanismo de armazenamento `NDB`. Esse mecanismo também é referido às vezes como `NDBCLUSTER`, embora `NDB` seja preferido.

Para evitar a alocação desnecessária de recursos, o servidor é configurado, por padrão, com o mecanismo de armazenamento `NDB` desativado. Para habilitar o `NDB`, você deve modificar o arquivo de configuração `my.cnf` do servidor ou iniciar o servidor com a opção `--ndbcluster`.

Este servidor MySQL faz parte do clúster, portanto, também deve saber como acessar um nó de gerenciamento para obter os dados da configuração do clúster. O comportamento padrão é procurar o nó de gerenciamento em `localhost`. No entanto, se você precisar especificar que sua localização é em outro lugar, isso pode ser feito em `my.cnf`, ou com o cliente **mysql**. Antes que o mecanismo de armazenamento `NDB` possa ser usado, pelo menos um nó de gerenciamento deve estar operacional, assim como quaisquer nós de dados desejados.

Para mais informações sobre `--ndbcluster` e outras opções `mysqld` específicas para NDB Cluster, consulte a Seção 21.4.3.9.1, “Opções do servidor MySQL para NDB Cluster”.

Para informações gerais sobre a instalação do NDB Cluster, consulte a Seção 21.3, “Instalação do NDB Cluster”.

### 21.4.1 Configuração rápida do teste do NDB Cluster

Para familiarizar você com os conceitos básicos, descrevemos a configuração mais simples possível para um NDB Cluster funcional. Depois disso, você deve ser capaz de projetar a configuração desejada com base nas informações fornecidas nas outras seções relevantes deste capítulo.

Primeiro, você precisa criar um diretório de configuração, como `/var/lib/mysql-cluster`, executando o seguinte comando como usuário do sistema `root`:

```sql
$> mkdir /var/lib/mysql-cluster
```

Neste diretório, crie um arquivo com o nome `config.ini` que contenha as seguintes informações. Substitua os valores apropriados para `HostName` e `DataDir` conforme necessário para o seu sistema.

```sql
# file "config.ini" - showing minimal setup consisting of 1 data node,
# 1 management server, and 3 MySQL servers.
# The empty default sections are not required, and are shown only for
# the sake of completeness.
# Data nodes must provide a hostname but MySQL Servers are not required
# to do so.
# If you do not know the hostname for your machine, use localhost.
# The DataDir parameter also has a default value, but it is recommended to
# set it explicitly.
# [api] and [mgm] are aliases for [mysqld] and [ndb_mgmd], respectively.

[ndbd default]
NoOfReplicas= 1

[mysqld  default]
[ndb_mgmd default]
[tcp default]

[ndb_mgmd]
HostName= myhost.example.com

[ndbd]
HostName= myhost.example.com
DataDir= /var/lib/mysql-cluster

[mysqld]
[mysqld]
[mysqld]
```

Agora você pode iniciar o servidor de gerenciamento **ndb\_mgmd**. Por padrão, ele tenta ler o arquivo `config.ini` no diretório de trabalho atual, então mude a localização para o diretório onde o arquivo está localizado e, em seguida, invoque **ndb\_mgmd**:

```sql
$> cd /var/lib/mysql-cluster
$> ndb_mgmd
```

Em seguida, inicie um único nó de dados executando **ndbd**:

```sql
$> ndbd
```

Por padrão, o **ndbd** procura pelo servidor de gerenciamento em `localhost` na porta 1186.

Nota

Se você instalou o MySQL a partir de um arquivo tar binário, você deve especificar explicitamente o caminho dos servidores **ndb\_mgmd** e **ndbd**. (Normalmente, esses podem ser encontrados em `/usr/local/mysql/bin`.)

Por fim, mude a localização para o diretório de dados do MySQL (geralmente `/var/lib/mysql` ou `/usr/local/mysql/data`) e certifique-se de que o arquivo `my.cnf` contenha a opção necessária para habilitar o motor de armazenamento NDB:

```sql
[mysqld]
ndbcluster
```

Agora você pode iniciar o servidor MySQL como de costume:

```sql
$> mysqld_safe --user=mysql &
```

Aguarde um momento para garantir que o servidor MySQL esteja funcionando corretamente. Se você ver o aviso `mysql ended`, verifique o arquivo do servidor `.err` para descobrir o que deu errado.

Se tudo tiver saído bem até agora, agora você pode começar a usar o clúster. Conecte-se ao servidor e verifique se o mecanismo de armazenamento `NDBCLUSTER` está habilitado:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 5.7.44

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SHOW ENGINES\G
...
*************************** 12. row ***************************
Engine: NDBCLUSTER
Support: YES
Comment: Clustered, fault-tolerant, memory-based tables
*************************** 13. row ***************************
Engine: NDB
Support: YES
Comment: Alias for NDBCLUSTER
...
```

Os números de string mostrados na saída do exemplo anterior podem ser diferentes dos mostrados no seu sistema, dependendo da configuração do seu servidor.

Tente criar uma tabela `NDBCLUSTER`:

```sql
$> mysql
mysql> USE test;
Database changed

mysql> CREATE TABLE ctest (i INT) ENGINE=NDBCLUSTER;
Query OK, 0 rows affected (0.09 sec)

mysql> SHOW CREATE TABLE ctest \G
*************************** 1. row ***************************
       Table: ctest
Create Table: CREATE TABLE `ctest` (
  `i` int(11) default NULL
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Para verificar se seus nós foram configurados corretamente, inicie o cliente de gerenciamento:

```sql
$> ndb_mgm
```

Use o comando **SHOW** dentro do cliente de gerenciamento para obter um relatório sobre o status do clúster:

```sql
ndb_mgm> SHOW
Cluster Configuration
---------------------
[ndbd(NDB)]     1 node(s)
id=2    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36, Nodegroup: 0, *)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)

[mysqld(API)]   3 node(s)
id=3    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)
id=4 (not connected, accepting connect from any host)
id=5 (not connected, accepting connect from any host)
```

Neste ponto, você configurou com sucesso um NDB Cluster funcional. Agora, você pode armazenar dados no cluster usando qualquer tabela criada com `ENGINE=NDBCLUSTER` ou seu alias `ENGINE=NDB`.

### 21.4.2 Visão geral dos parâmetros, opções e variáveis de configuração do cluster NDB

As próximas seções fornecem tabelas resumidas dos parâmetros de configuração do nó do NDB Cluster utilizados no arquivo `config.ini` para governar vários aspectos do comportamento do nó, bem como das opções e variáveis lidas pelo `mysqld` a partir de um arquivo `my.cnf` ou da string de comando quando executado como um processo do NDB Cluster. Cada uma das tabelas de parâmetros do nó lista os parâmetros para um tipo específico (`ndbd`, `ndb_mgmd`, `mysqld`, `computer`, `tcp` ou `shm`). Todas as tabelas incluem o tipo de dados do parâmetro, opção ou variável, bem como seus valores padrão, mínimo e máximo, conforme aplicável.

**Considerações ao reiniciar nós.** Para os parâmetros dos nós, essas tabelas também indicam que tipo de reinício é necessário (reinício de nó ou reinício de sistema) e se o reinício deve ser feito com `--initial` para alterar o valor de um parâmetro de configuração dado. Ao realizar um reinício de nó ou um reinício inicial de nó, todos os nós de dados do clúster devem ser reiniciados em ordem (também referido como um reinício rotativo). É possível atualizar os parâmetros de configuração do clúster marcados como `node` online, ou seja, sem desligar o clúster. Um reinício inicial de nó requer o reinício de cada processo **ndbd** com a opção `--initial`.

Um reinício do sistema requer o desligamento completo e o reinício de todo o clúster. Um reinício inicial do sistema requer a realização de um backup do clúster, a limpeza do sistema de arquivos do clúster após o desligamento e, em seguida, a restauração do backup após o reinício.

Em qualquer reinício de um clúster, todos os servidores de gerenciamento do clúster devem ser reiniciados para que eles leiam os valores dos parâmetros de configuração atualizados.

Importante

Os valores dos parâmetros de agrupamento numérico geralmente podem ser aumentados sem problemas, embora seja aconselhável fazê-lo progressivamente, fazendo tais ajustes em incrementos relativamente pequenos. Muitos desses podem ser aumentados online, usando um reinício contínuo.

No entanto, a diminuição dos valores desses parâmetros — seja feita por meio de um reinício de nó, um reinício inicial de nó ou até mesmo um reinício completo do sistema do clúster — não deve ser feita de forma superficial; é recomendável que você faça isso apenas após um planejamento e testes cuidadosos. Isso é especialmente verdadeiro em relação aos parâmetros que se relacionam com o uso de memória e espaço em disco, como `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes`. Além disso, geralmente é o caso de que os parâmetros de configuração relacionados ao uso de memória e disco podem ser aumentados por meio de um simples reinício de nó, mas eles exigem um reinício inicial do nó para serem reduzidos.

Como alguns desses parâmetros podem ser usados para configurar mais de um tipo de nó de cluster, eles podem aparecer em mais de uma das tabelas.

Nota

`4294967039` geralmente aparece como um valor máximo nessas tabelas. Esse valor é definido nas fontes `NDBCLUSTER` como `MAX_INT_RNIL` e é igual a `0xFFFFFEFF`, ou `232 − 28 − 1`.

#### 21.4.2.1 Parâmetros de configuração do nó de dados do cluster NDB

Os listamentos desta seção fornecem informações sobre os parâmetros utilizados nas seções `[ndbd]` ou `[ndbd default]` de um arquivo `config.ini` para configurar os nós de dados do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 21.4.3.6, “Definindo nós de dados do NDB Cluster”.

Esses parâmetros também se aplicam a **ndbmtd**"), a versão multithread do **ndbd**. Um registro separado de parâmetros específicos para **ndbmtd**") segue.

* `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falha do nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10.

* `Arbitration`: Como a arbitragem deve ser realizada para evitar problemas de cérebro dividido em caso de falha de nó.

* `ArbitrationTimeout`: Tempo máximo (em milissegundos) que a partição do banco de dados aguarda o sinal de arbitragem.

* `BackupDataBufferSize`: Tamanho padrão do buffer de dados para backup (em bytes).

* `BackupDataDir`: Caminho para onde armazenar os backups. Observe que a string '/BACKUP' é sempre anexada a esta configuração, de modo que o valor *efetivo* padrão é FileSystemPath/BACKUP.

* `BackupDiskWriteSpeedPct`: Define a porcentagem da velocidade máxima de escrita alocada no nó de dados (MaxDiskWriteSpeed) para reservar para LCPs ao iniciar o backup.

* `BackupLogBufferSize`: Tamanho padrão do buffer de registro para backup (em bytes).

* `BackupMaxWriteSize`: Tamanho máximo de escritas no sistema de arquivos feitas pelo backup (em bytes).

* `BackupMemory`: Memória total alocada para backups por nó (em bytes).

* `BackupReportFrequency`: Frequência dos relatórios de status de backup durante o backup em segundos.

* `BackupWriteSize`: Tamanho padrão de escritas do sistema de arquivos feitas pelo backup (em bytes).

* `BatchSizePerLocalScan`: Usado para calcular o número de registros de bloqueio para varredura com bloqueio de retenção.

* `BuildIndexThreads`: Número de threads a serem usadas para a construção de índices ordenados durante o reinício do sistema ou do nó. Também se aplica quando se executa ndb_restore --rebuild-indexes. Definir este parâmetro como 0 desativa a construção de índices ordenados em multithread.

* `CompressedBackup`: Use zlib para comprimir os backups conforme eles são escritos.

* `CompressedLCP`: Escreva LCPs comprimidos usando zlib.

* `ConnectCheckIntervalDelay`: Tempo entre as etapas de verificação da conectividade do nó de dados. O nó de dados é considerado suspeito após 1 intervalo e morto após 2 intervalos sem resposta.

* `CrashOnCorruptedTuple`: Quando ativado, obriga o nó a desligar sempre que detecta uma tupla corrompida.

* `DataDir`: Diretório de dados para este nó.

* `DataMemory`: Número de bytes em cada nó de dados alocados para armazenamento de dados; sujeito à RAM disponível do sistema e ao tamanho da IndexMemory.

* `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para mapas de hash de tabela. São suportados três valores: 0, 240 e 3840.

* `DictTrace`: Habilitar depuração do DBDICT; para o desenvolvimento do NDB.

* `DiskIOThreadPool`: Número de threads não vinculados para acesso ao arquivo, aplica-se apenas aos dados do disco.

* `Diskless`: Execute sem usar disco.

* `DiskPageBufferEntries`: Memória para alocar no DiskPageBufferMemory; transações de disco muito grandes podem exigir o aumento deste valor.

* `DiskPageBufferMemory`: Número de bytes em cada nó de dados alocados para cache de buffer de página de disco.

* `DiskSyncSize`: Quantidade de dados escritos no arquivo antes da sincronização forçada.

* `EnablePartialLcp`: Ative LCP parcial (verdadeiro); se estiver desativado (falso), todos os LCP escrevem pontos de verificação completos.

* `EnableRedoControl`: Habilitar a velocidade de verificação adaptativa para o controle do uso do log de revisão.

* `EventLogBufferSize`: Tamanho do buffer circular para eventos de log NDB dentro dos nós de dados.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além da memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

* `FileSystemPath`: Caminho para o diretório onde o nó de dados armazena seus dados (o diretório deve existir).

* `FileSystemPathDataFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de dados de disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, o FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

* `FileSystemPathDD`: Caminho para o diretório onde o nó de dados armazena seus dados de disco e arquivos de desfazer. O valor padrão é FileSystemPath, se definido; caso contrário, o valor de DataDir é usado.

* `FileSystemPathUndoFiles`: Caminho para o diretório onde o nó de dados armazena seus arquivos de desfazer para Dados de Disco. O valor padrão é FilesystemPathDD, se definido; caso contrário, FilesystemPath é usado se definido; caso contrário, o valor de DataDir é usado.

* `FragmentLogFileSize`: Tamanho de cada arquivo de registro de refazer.

* `HeartbeatIntervalDbApi`: Tempo entre os batimentos cardíacos do nó de dados do nó API. (A conexão da API foi fechada após 3 batimentos cardíacos perdidos).

* `HeartbeatIntervalDbDb`: Tempo entre os batimentos cardíacos entre os nós de dados; o nó de dados é considerado morto após 3 batimentos cardíacos perdidos.

* `HeartbeatOrder`: Define a ordem em que os nós de dados verificam os batimentos cardíacos de cada outro para determinar se o nó dado ainda está ativo e conectado ao clúster. Deve ser zero para todos os nós de dados ou valores distintos e não nulos para todos os nós de dados; consulte a documentação para obter mais orientações.

* `HostName`: Nome de domínio ou endereço IP para este nó de dados.

* `IndexMemory`: Número de bytes em cada nó de dados alocados para armazenar índices; sujeito à RAM disponível do sistema e ao tamanho da DataMemory.

* `IndexStatAutoCreate`: Habilitar/desabilitar a coleta automática de estatísticas quando os índices são criados.

* `IndexStatAutoUpdate`: Monitore índices para mudanças e faça atualizações automáticas de estatísticas.

* `IndexStatSaveScale`: Fator de escala utilizado na determinação do tamanho das estatísticas de índice armazenado.

* `IndexStatSaveSize`: Tamanho máximo em bytes para estatísticas salvas por índice.

* `IndexStatTriggerPct`: Porcentagem de mudança de limiar nas operações de DML para atualizações de estatísticas de índice. O valor é reduzido por IndexStatTriggerScale.

* `IndexStatTriggerScale`: Reduza o ÍndiceStatTriggerPct por esse valor, multiplicado pelo logaritmo de base 2 do tamanho do índice, para um índice grande. Defina 0 para desativar a escala.

* `IndexStatUpdateDelay`: Retardo mínimo entre as atualizações automáticas das estatísticas do índice para o índice dado. 0 significa sem atraso.

* `InitFragmentLogFiles`: Inicialize arquivos de registro de fragmentos, usando formato esparso ou completo.

* `InitialLogFileGroup`: Descreve o grupo de arquivo de registro que é criado durante o início inicial. Consulte a documentação para o formato.

* `InitialNoOfOpenFiles`: Número inicial de arquivos abertos por nó de dados. (Um thread é criado por arquivo).

* `InitialTablespace`: Descreve o tablespace que é criado durante o início inicial. Consulte a documentação para o formato.

* `InsertRecoveryWork`: Porcentagem de Trabalho de Recuperação usada para as strings inseridas; não tem efeito a menos que os pontos de verificação locais parciais estejam em uso.

* `LateAlloc`: Atribua memória após a conexão com o servidor de gerenciamento ter sido estabelecida.

* `LcpScanProgressTimeout`: Tempo máximo que o rastreamento de fragmentos de ponto de verificação local pode ser interrompido antes que o nó seja desligado para garantir o progresso do LCP em todo o sistema. Use 0 para desativar.

* `LocationDomainId`: Atribua este nó de dados a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco.

* `LockExecuteThreadToCPU`: Lista de IDs de CPU delimitada por vírgula.

* `LockMaintThreadsToCPU`: ID da CPU que indica qual CPU executa os threads de manutenção.

* `LockPagesInMainMemory`: 0=desabilitar o bloqueio, 1=bloquear após a alocação de memória, 2=bloquear antes da alocação de memória.

* `LogLevelCheckpoint`: Nível de log de informações de verificação local e global impressas no stdout.

* `LogLevelCongestion`: Nível de informação de congestionamento impressa no stdout.

* `LogLevelConnection`: Nível de informações de conexão/desconexão do nó impressas no stdout.

* `LogLevelError`: Erros no transmissor e no batimento cardíaco impressos no stdout.

* `LogLevelInfo`: Informações de batimento cardíaco e registro impressas no stdout.

* `LogLevelNodeRestart`: Nível de informações de reinício do nó e falha do nó impressas no stdout.

* `LogLevelShutdown`: Nível de informações de desligamento do nó impressas no stdout.

* `LogLevelStartup`: Nível de informações de inicialização do nó impressas no stdout.

* `LogLevelStatistic`: Nível de informações sobre transação, operação e transportador impressas no stdout.

* `LongMessageBuffer`: Número de bytes alocados em cada nó de dados para mensagens longas internas.

* `MaxAllocate`: Não é mais utilizado; não tem efeito.

* `MaxBufferedEpochs`: Número permitido de épocas que o nó assinante pode ficar para trás (épocas não processadas). Exceder esse número faz com que os assinantes que estão atrasados sejam desconectados.

* `MaxBufferedEpochBytes`: Número total de bytes alocados para épocas de buffer.

* `MaxDiskWriteSpeed`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e de backup quando não há reinício em andamento.

* `MaxDiskWriteSpeedOtherNodeRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e de backup quando outro nó está sendo reiniciado.

* `MaxDiskWriteSpeedOwnRestart`: Número máximo de bytes por segundo que podem ser escritos pelo LCP e de backup quando este nó está sendo reiniciado.

* `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves estrangeiras. Aumentar esse valor pode acelerar a construção de chaves estrangeiras, mas também afeta o tráfego em andamento.

* `MaxDMLOperationsPerTransaction`: Limite do tamanho da transação; interrompe a transação se ela exigir mais do que esse número de operações DML.

* `MaxLCPStartDelay`: Tempo em segundos que o LCP verifica o mutex do ponto de verificação (para permitir que outros nós de dados completem a sincronização de metadados), antes de colocar-se na fila de bloqueio para recuperação paralela dos dados da tabela.

* `MaxNoOfAttributes`: Sugere o número total de atributos armazenados no banco de dados (soma em todas as tabelas).

* `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados.

* `MaxNoOfConcurrentOperations`: Número máximo de registros de operação no coordenador de transação.

* `MaxNoOfConcurrentScans`: Número máximo de varreduras que podem ser executadas simultaneamente no nó de dados.

* `MaxNoOfConcurrentSubOperations`: Número máximo de operações de assinantes concorrentes.

* `MaxNoOfConcurrentTransactions`: Número máximo de transações que podem ser executadas simultaneamente neste nó de dados, o número total de transações que podem ser executadas simultaneamente é este valor vezes o número de nós de dados no clúster.

* `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser disparados simultaneamente em um nó de dados.

* `MaxNoOfLocalOperations`: Número máximo de registros de operação definidos neste nó de dados.

* `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados.

* `MaxNoOfOpenFiles`: Número máximo de arquivos abertos por nó de dados. (Um thread é criado por arquivo).

* `MaxNoOfOrderedIndexes`: Número total de índices solicitados que podem ser definidos no sistema.

* `MaxNoOfSavedMessages`: Número máximo de mensagens de erro a serem escritas no log de erro e número máximo de arquivos de rastreamento a serem mantidos.

* `MaxNoOfSubscribers`: Número máximo de assinantes.

* `MaxNoOfSubscriptions`: Número máximo de assinaturas (padrão 0 = MaxNoOfTables).

* `MaxNoOfTables`: Sugere o número total de tabelas NDB armazenadas no banco de dados.

* `MaxNoOfTriggers`: Número total de gatilhos que podem ser definidos no sistema.

* `MaxNoOfUniqueHashIndexes`: Número total de índices de hash únicos que podem ser definidos no sistema.

* `MaxParallelCopyInstances`: Número de cópias paralelas durante o restabelecimento do nó. O padrão é 0, que utiliza o número de LDMs em ambos os nós, até um máximo de 16.

* `MaxParallelScansPerFragment`: Número máximo de varreduras paralelas por fragmento. Quando esse limite é atingido, as varreduras são serializadas.

* `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura a ser utilizado para reorganização de partições de tabela. Aumentar esse valor pode acelerar a reorganização de partições de tabela, mas também afeta o tráfego em andamento.

* `MaxStartFailRetries`: Retenções máximas quando o nó de dados falha no início, requer StopOnError = 0. Definir para 0 faz com que as tentativas de início continuem indefinidamente.

* `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura a ser usado para a construção de chaves únicas. Aumentar esse valor pode acelerar a construção de chaves únicas, mas também afeta o tráfego em andamento.

* `MemReportFrequency`: Frequência de relatórios de memória em segundos; 0 = relatório apenas quando exceder os limites percentuais.

* `MinDiskWriteSpeed`: Número mínimo de bytes por segundo que podem ser escritos pelo LCP e pelo backup.

* `MinFreePct`: Porcentagem de recursos de memória a serem mantidos em reserva para reinício.

* `NodeGroup`: Grupo de nós ao qual o nó de dados pertence; usado apenas durante o início inicial do clúster.

* `NodeId`: Número que identifica de forma única o nó de dados entre todos os nós do clúster.

* `NoOfFragmentLogFiles`: Número de arquivos de registro redo de 16 MB em cada um dos 4 conjuntos de arquivos pertencentes ao nó de dados.

* `NoOfReplicas`: Número de cópias de todos os dados no banco de dados.

* `Numa`: (apenas Linux; requer libnuma) Controla o suporte NUMA. Definir para 0 permite que o sistema determine o uso de interleaving pelo processo do nó de dados; 1 significa que é determinado pelo nó de dados.

* `ODirect`: Use leituras e escritas de arquivos O_DIRECT quando possível.

* `ODirectSyncFlag`: As escritas O_DIRECT são tratadas como escritas sincronizadas; ignoradas quando o ODirect não está habilitado, o InitFragmentLogFiles está configurado como SPARSE ou ambos.

* `RealtimeScheduler`: Quando verdadeiro, os threads dos nós de dados são agendados como threads em tempo real. O padrão é falso.

* `RecoveryWork`: Porcentagem de sobrecarga de armazenamento para arquivos LCP: um valor maior significa menos trabalho em operações normais, mais trabalho durante a recuperação.

* `RedoBuffer`: Número de bytes em cada nó de dados alocados para gravação de logs de redo.

* `RedoOverCommitCounter`: Quando o RedoOverCommitLimit foi excedido quantas vezes, as transações são abortadas e as operações são tratadas conforme especificado por DefaultOperationRedoProblemAction.

* `RedoOverCommitLimit`: Cada vez que o buffer de refazer do fluxo de lavagem leva mais tempo do que este número de segundos, o número de vezes que isso aconteceu é comparado ao RedoOverCommitCounter.

* `ReservedSendBufferMemory`: Este parâmetro está presente no código NDB, mas não está habilitado.

* `RestartOnErrorInsert`: Tipo de controle de reinício causado pelo erro de inserção (quando o StopOnError está habilitado).

* `RestartSubscriberConnectTimeout`: Tempo que o nó de dados deve esperar para que os nós da API de subscrição se conectem. Defina 0 para desativar o tempo de espera, que é sempre resolvido para o segundo inteiro mais próximo.

* `SchedulerExecutionTimer`: Número de microsegundos para executar no agendador antes de enviar.

* `SchedulerResponsiveness`: Configurar a otimização da resposta do planejador NDB 0-10; valores mais altos proporcionam um tempo de resposta melhor, mas menor desempenho.

* `SchedulerSpinTimer`: Número de microsegundos para executar no agendador antes de dormir.

* `ServerPort`: Porto utilizado para configurar transportador para conexões de entrada a partir de nós da API.

* `SharedGlobalMemory`: Número total de bytes em cada nó de dados alocados para qualquer uso.

* `StartFailRetryDelay`: Retardo em segundos após falha no início antes de tentar novamente; requer StopOnError = 0.

* `StartFailureTimeout`: Milisegundos para esperar antes de terminar. (0=Esperar para sempre).

* `StartNoNodeGroupTimeout`: Tempo de espera para nós sem grupo de nós antes de tentar iniciar (0=sempre).

* `StartPartialTimeout`: Milisegundos para esperar antes de tentar iniciar sem todos os nós. (0=Esperar para sempre).

* `StartPartitionedTimeout`: Milisegundos para esperar antes de tentar iniciar a partição. (0=Esperar para sempre).

* `StartupStatusReportFrequency`: Frequência dos relatórios de status durante a inicialização.

* `StopOnError`: Quando configurado para 0, o nó de dados reinicia e se recupera automaticamente após falhas no nó.

* `StringMemory`: Tamanho padrão da memória de string (0 a 100 = % do máximo, 101+ = bytes reais).

* `TcpBind_INADDR_ANY`: Vincule IP_ADDR_ANY para que as conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente).

* `TimeBetweenEpochs`: Tempo entre épocas (sincronização usada para replicação).

* `TimeBetweenEpochsTimeout`: Tempo de espera entre épocas. Exceder esse tempo causa o desligamento do nó.

* `TimeBetweenGlobalCheckpoints`: Tempo entre os commits do grupo de transações no disco.

* `TimeBetweenGlobalCheckpointsTimeout`: Limite mínimo para o commit de grupo de transações no disco.

* `TimeBetweenInactiveTransactionAbortCheck`: Tempo entre as verificações de transações inativas.

* `TimeBetweenLocalCheckpoints`: Tempo entre a captura de instantâneos do banco de dados (expresso em logaritmo base-2 de bytes).

* `TimeBetweenWatchDogCheck`: Tempo entre os verificações de execução dentro do nó de dados.

* `TimeBetweenWatchDogCheckInitial`: Tempo entre os verificações de execução dentro do nó de dados (fases de início precoce quando a memória é alocada).

* `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

* `TransactionBufferMemory`: Espaço dinâmico de buffer (em bytes) para dados de chave e atributo alocados para cada nó de dados.

* `TransactionDeadlockDetectionTimeout`: O tempo de execução dentro do nó de dados pode ser gasto. Esse é o tempo que o coordenador de transação espera que cada nó de dados que participa da transação execute a solicitação. Se o nó de dados levar mais tempo do que esse valor, a transação é abortada.

* `TransactionInactiveTimeout`: Milisegundos que o aplicativo espera antes de executar outra parte da transação. Esse é o tempo que o coordenador da transação espera para que o aplicativo execute ou envie outra parte (consulta, declaração) da transação. Se o aplicativo leva muito tempo, então a transação é abortada. O tempo de espera = 0 significa que o aplicativo nunca perde o tempo.

* `TwoPassInitialNodeRestartCopy`: Copie os dados em 2 passes durante o reinício inicial do nó, o que permite a construção de índices ordenados em múltiplos threads para tais reinicializações.

* `UndoDataBuffer`: Não utilizado; não tem efeito.

* `UndoIndexBuffer`: Não utilizado; não tem efeito.

* `UseShm`: Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está sendo executado neste host.

* `WatchDogImmediateKill`: Quando verdadeiro, os threads são imediatamente mortos sempre que ocorrem problemas de watchdog; utilizado para testes e depuração.

Os seguintes parâmetros são específicos para **ndbmtd**):

* `MaxNoOfExecutionThreads`: Para ndbmtd apenas, especifique o número máximo de threads de execução.

* `MaxSendDelay`: Número máximo de microsegundos para o envio ser adiado pelo ndbmtd.

* `NoOfFragmentLogParts`: Número de grupos de arquivo de registro de revisão pertencentes a este nó de dados.

* `ThreadConfig`: Usado para a configuração de nós de dados multithread (ndbmtd). O padrão é uma string vazia; consulte a documentação para sintaxe e outras informações.

#### 21.4.2.2 Parâmetros de configuração do nó de gerenciamento de cluster do NDB

A listagem nesta seção fornece informações sobre os parâmetros utilizados na seção `[ndb_mgmd]` ou `[mgm]` de um arquivo `config.ini` para configurar os nós de gerenciamento do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 21.4.3.5, “Definindo um servidor de gerenciamento de NDB Cluster”.

* `ArbitrationDelay`: Quando solicitado para arbitrar, o árbitro espera tanto tempo antes de votar (em milissegundos).

* `ArbitrationRank`: Se 0, então o nó de gerenciamento não é árbitro. O kernel seleciona os árbitros na ordem 1, 2.

* `DataDir`: Diretório de dados para este nó.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além da memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

* `HeartbeatIntervalMgmdMgmd`: Tempo entre os batimentos cardíacos entre os nós de gerenciamento e os nós de gerenciamento; a conexão entre os nós de gerenciamento é considerada perdida após 3 batimentos cardíacos perdidos.

* `HeartbeatThreadPriority`: Defina a política e a prioridade do thread de batimento cardíaco para os nós de gerenciamento; consulte o manual para os valores permitidos.

* `HostName`: Nome de domínio ou endereço IP para este nó de gerenciamento.

* `Id`: Número que identifica o nó de gerenciamento. Agora desatualizado; use NodeId em vez disso.

* `LocationDomainId`: Atribua este nó de gerenciamento a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa isso não definido.

* `LogDestination`: Onde enviar mensagens de log: console, log do sistema ou arquivo de log especificado.

* `NodeId`: Número que identifica exclusivamente o nó de gerenciamento entre todos os nós do clúster.

* `PortNumber`: Número de porta para enviar comandos e obter configuração do servidor de gerenciamento.

* `PortNumberStats`: Número de porta utilizado para obter informações estatísticas do servidor de gerenciamento.

* `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

* `wan`: Use a configuração WAN TCP como padrão.

Nota

Após fazer alterações na configuração de um nó de gerenciamento, é necessário realizar um reinício contínuo do clúster para que a nova configuração entre em vigor. Consulte a Seção 21.4.3.5, “Definindo um servidor de gerenciamento de clúster NDB”, para obter mais informações.

Para adicionar novos servidores de gerenciamento a um NDB Cluster em execução, também é necessário realizar um reinício contínuo de todos os nós do cluster após modificar quaisquer arquivos existentes do `config.ini`. Para obter mais informações sobre os problemas que surgem ao usar vários nós de gerenciamento, consulte a Seção 21.2.7.10, “Limitações relacionadas a vários nós do NDB Cluster”.

#### 21.4.2.3 Parâmetros de configuração do nó SQL do cluster NDB e do nó API

A listagem nesta seção fornece informações sobre os parâmetros utilizados nas seções `[mysqld]` e `[api]` de um arquivo `config.ini` para configurar nós SQL do NDB Cluster e nós API. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 21.4.3.7, “Definindo nós SQL e outros nós API em um NDB Cluster”.

* `ApiVerbose`: Habilitar depuração da API NDB; para desenvolvimento do NDB.

* `ArbitrationDelay`: Quando solicitado a arbitrar, o árbitro espera esses muitos milissegundos antes de votar.

* `ArbitrationRank`: Se 0, então o nó da API não é árbitro. O kernel seleciona os árbitros na ordem 1, 2.

* `AutoReconnect`: Especifica se um nó da API deve se reconectar completamente quando desconectado do cluster.

* `BatchByteSize`: Tamanho padrão do lote em bytes.

* `BatchSize`: Tamanho padrão do lote em número de registros.

* `ConnectBackoffMaxTime`: Especifica o tempo mais longo em milissegundos (~100ms de resolução) para permitir entre tentativas de conexão com qualquer nó de dados dado por este nó da API. Exclui o tempo decorrido enquanto as tentativas de conexão estão em andamento, o que, no pior dos casos, pode levar vários segundos. Desative-a definindo para 0. Se nenhum nó de dados estiver conectado atualmente a este nó da API, o StartConnectBackoffMaxTime é usado em vez disso.

* `ConnectionMap`: Especifica quais nós de dados devem ser conectados.

* `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para mapas de hash de tabela. São suportados três valores: 0, 240 e 3840.

* `DefaultOperationRedoProblemAction`: Como as operações são tratadas em caso de excedência do RedoOverCommitCounter.

* `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além da memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

* `HeartbeatThreadPriority`: Defina a política e a prioridade do thread de batimento cardíaco para os nós da API; consulte o manual para os valores permitidos.

* `HostName`: Nome de host ou endereço IP para este nó SQL ou API.

* `Id`: Número que identifica o servidor MySQL ou o nó da API (Id). Agora desatualizado; use NodeId em vez disso.

* `LocationDomainId`: Atribua este nó da API a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa isso não definido.

* `MaxScanBatchSize`: Tamanho máximo do lote coletivo para um único exame.

* `NodeId`: Número que identifica de forma única o nó SQL ou o nó API entre todos os nós do clúster.

* `StartConnectBackoffMaxTime`: O mesmo que ConnectBackoffMaxTime, exceto que este parâmetro é usado em seu lugar se nenhum nó de dados estiver conectado a este nó da API.

* `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

* `wan`: Use a configuração WAN TCP como padrão.

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte a Seção 21.4.3.9.1, “Opções do servidor MySQL para NDB Cluster”. Para informações sobre as variáveis do sistema do servidor MySQL relacionadas ao NDB Cluster, consulte a Seção 21.4.3.9.2, “Variáveis do sistema do NDB Cluster”.

Nota

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao cluster.

Não é *necessário* realizar nenhum reinício do clúster se novos nós SQL ou API puderem utilizar slots de API anteriormente não utilizados na configuração do clúster para se conectar ao clúster.

#### 21.4.2.4 Outros parâmetros de configuração do cluster NDB

Os listamentos nesta seção fornecem informações sobre os parâmetros utilizados nas seções `[computer]`, `[tcp]` e `[shm]` de um arquivo `config.ini` para configurar o NDB Cluster. Para descrições detalhadas e informações adicionais sobre os parâmetros individuais, consulte a Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster”, ou a Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, conforme apropriado.

Os seguintes parâmetros se aplicam à seção `[computer]` do arquivo `config.ini`:

* `HostName`: Nome de domínio ou endereço IP deste computador.

* `Id`: Identificador único para este computador.

Os seguintes parâmetros se aplicam à seção `[tcp]` do arquivo `config.ini`:

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nós serão verificados quanto a erros.

* `Group`: Usado para proximidade de grupo; um valor menor é interpretado como estando mais próximo.

* `HostName1`: Nome ou endereço IP do primeiro dos dois computadores conectados por uma conexão TCP.

* `HostName2`: Nome ou endereço IP do segundo dos dois computadores conectados por uma conexão TCP.

* `NodeId1`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um lado da conexão.

* `NodeId2`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um lado da conexão.

* `NodeIdServer`: Configurar o lado servidor da conexão TCP.

* `OverloadLimit`: Quando há mais que esse número de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

* `PortNumber`: Porto utilizado para transportador TCP.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem ativados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros.

* `Proxy`: ....

* `ReceiveBufferMemory`: Bytes de buffer para sinais recebidos por este nó.

* `SendBufferMemory`: Bytes do buffer TCP para sinais enviados a partir deste nó.

* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de rastreamento. Tem como padrão verdadeiro em compilações de depuração.

* `TCP_MAXSEG_SIZE`: Valor utilizado para TCP\_MAXSEG.

* `TCP_RCV_BUF_SIZE`: Valor utilizado para SO_RCVBUF.

* `TCP_SND_BUF_SIZE`: Valor utilizado para SO_SNDBUF.

* `TcpBind_INADDR_ANY`: Vincule InAddrAny em vez do nome do host para a parte do servidor da conexão.

Os seguintes parâmetros se aplicam à seção `[shm]` do arquivo `config.ini`:

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nós serão verificados quanto a erros.

* `Group`: Usado para proximidade de grupo; um valor menor é interpretado como estando mais próximo.

* `HostName1`: Nome ou endereço IP do primeiro dos dois computadores conectados por uma conexão SHM.

* `HostName2`: Nome ou endereço IP do segundo dos dois computadores conectados por uma conexão SHM.

* `NodeId1`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um lado da conexão.

* `NodeId2`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um lado da conexão.

* `NodeIdServer`: Configure o lado servidor da conexão SHM.

* `OverloadLimit`: Quando há mais que esse número de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

* `PortNumber`: Porto utilizado para transportador SHM.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem ativados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros.

* `SendBufferMemory`: Bytes no buffer de memória compartilhada para sinais enviados a partir deste nó.

* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de rastreamento.

* `ShmKey`: Chave de memória compartilhada; quando definida como 1, isso é calculado pelo NDB.

* `ShmSpinTime`: Número de microsegundos para girar antes de dormir ao receber.

* `ShmSize`: Tamanho do segmento de memória compartilhada.

* `Signum`: Número de sinal a ser utilizado para sinalização.

#### 21.4.2.5 Referência à opção e variável do cluster NDB mysqld

A lista a seguir inclui opções de string de comando, variáveis de sistema e variáveis de status aplicáveis dentro de `mysqld` quando ele está sendo executado como um nó SQL em um NDB Cluster. Para uma referência a *todas* as opções de string de comando, variáveis de sistema e variáveis de status usadas com ou relacionadas a `mysqld`, consulte a Seção 5.1.3, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

* `Com_show_ndb_status`: Contagem de declarações SHOW NDB STATUS.

* `Handler_discover`: Número de vezes que as tabelas foram descobertas.

* `ndb-batch-size`: Tamanho (em bytes) a ser usado para lotes de transações NDB.

* `ndb-blob-read-batch-bytes`: Especifica o tamanho em bytes em que os grandes blocos de dados BLOB devem ser agrupados. 0 = sem limite.

* `ndb-blob-write-batch-bytes`: Especifica o tamanho em bytes em que os grandes escritos de BLOB devem ser agrupados. 0 = sem limite.

* `ndb-cluster-connection-pool`: Número de conexões ao cluster utilizado pelo MySQL.

* `ndb-cluster-connection-pool-nodeids`: Lista de IDs de nós separados por vírgula para conexões ao clúster utilizado pelo MySQL; o número de nós na lista deve corresponder ao valor definido para --ndb-cluster-connection-pool.

* `ndb-connectstring`: Endereço do servidor de gerenciamento NDB que distribui informações de configuração para este clúster.

* `ndb-default-column-format`: Use este valor (FIXO ou DINÂMICO) como padrão para as opções COLUMN_FORMAT e ROW_FORMAT ao criar ou adicionar colunas de tabela.

* `ndb-deferred-constraints`: Especifica que os verificações de restrição em índices únicos (onde esses são suportados) devem ser adiadas até o momento do commit. Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb-distribution`: Distribuição padrão para novas tabelas em NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

* `ndb-log-apply-status`: Faça com que o servidor MySQL que atue como replica registre as atualizações do mysql.ndb_apply_status recebidas de sua fonte imediata em seu próprio log binário, usando seu próprio ID de servidor. Efetivo apenas se o servidor for iniciado com a opção --ndbcluster.

* `ndb-log-empty-epochs`: Quando habilitado, faz com que épocas em que não houve alterações a serem escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando a opção --log-slave-updates está habilitada.

* `ndb-log-empty-update`: Quando habilitado, faz com que as atualizações que não produzem alterações sejam escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando a opção --log-slave-updates está habilitada.

* `ndb-log-exclusive-reads`: Leia as chaves primárias de registro com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

* `ndb-log-fail-terminate`: Finalize o processo mysqld se não for possível registrar completamente todos os eventos das strings encontradas.

* `ndb-log-orig`: Registre o ID do servidor de origem e a época na tabela mysql.ndb_binlog_index.

* `ndb-log-transaction-id`: Escreva IDs de transações NDB no log binário. Requer --log-bin-v1-events=OFF.

* `ndb-log-update-minimal`: Atualize os registros no formato mínimo.

* `ndb-log-updated-only`: Atualizações de registro apenas (ATIVADO) ou strings completas (DESATIVADO).

* `ndb-log-update-as-write`: Ativa ou desativa o registro de atualizações na fonte entre atualizações (OFF) e escritas (ON).

* `ndb-mgmd-host`: Defina o host (e o porto, se desejar) para conectar ao servidor de gerenciamento.

* `ndb-nodeid`: ID do nó do cluster NDB para este servidor MySQL.

* `ndb-optimized-node-selection`: Habilitar otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo.

* `ndb-transid-mysql-connection-map`: Ative ou desative o plugin ndb\_transid\_mysql\_connection\_map; ou seja, ative ou desative a tabela INFORMATION_SCHEMA que tem esse nome.

* `ndb-wait-connected`: Tempo (em segundos) para o servidor MySQL esperar a conexão com os nós de gerenciamento do cluster e os nós de dados antes de aceitar conexões de clientes MySQL.

* `ndb-wait-setup`: Tempo (em segundos) para o servidor MySQL esperar que o NDB engine seja configurado.

* `ndb-allow-copying-alter-table`: Defina para OFF para impedir que a ALTER TABLE use operações de cópia em tabelas NDB.

* `Ndb_api_adaptive_send_deferred_count`: Número de chamadas de envio adaptativas que não foram realmente enviadas por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_deferred_count_session`: Número de chamadas de envio adaptativas que não foram realmente enviadas nesta sessão do cliente.

* `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

* `Ndb_api_adaptive_send_forced_count`: Número de envios adaptativos com o conjunto de envios forçados enviados por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_forced_count_session`: Número de envios adaptativos com envio forçado definido nesta sessão do cliente.

* `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o conjunto de envios forçados enviados por esta réplica.

* `Ndb_api_adaptive_send_unforced_count`: Número de envios adaptativos sem envios forçados enviados por este servidor MySQL (nó SQL).

* `Ndb_api_adaptive_send_unforced_count_session`: Número de envios adaptativos sem envio forçado nesta sessão do cliente.

* `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envios forçados enviados por esta réplica.

* `Ndb_api_bytes_received_count`: Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

* `Ndb_api_bytes_received_count_session`: Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

* `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

* `Ndb_api_bytes_sent_count`: Quantidade de dados (em bytes) enviados para os nós de dados por este servidor MySQL (nó SQL).

* `Ndb_api_bytes_sent_count_session`: Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

* `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica.

* `Ndb_api_event_bytes_count`: Número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_event_bytes_count_injector`: Número de bytes de dados de evento recebidos pelo NDB binary log injector thread.

* `Ndb_api_event_data_count`: Número de eventos de mudança de string recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_event_data_count_injector`: Número de eventos de alteração de string recebidos pelo thread do injetor de log binário NDB.

* `Ndb_api_event_nondata_count`: Número de eventos recebidos, exceto eventos de mudança de string, por este servidor MySQL (nó SQL).

* `Ndb_api_event_nondata_count_injector`: Número de eventos recebidos, exceto eventos de mudança de string, pelo NDB binary log injector thread.

* `Ndb_api_pk_op_count`: Número de operações com base em ou que utilizam chaves primárias por este servidor MySQL (nó SQL).

* `Ndb_api_pk_op_count_session`: Número de operações com base em ou que utilizam chaves primárias nesta sessão do cliente.

* `Ndb_api_pk_op_count_slave`: Número de operações com base em ou que utilizam chaves primárias por esta réplica.

* `Ndb_api_pruned_scan_count`: Número de varreduras que foram reduzidas a uma partição por este servidor MySQL (nó SQL).

* `Ndb_api_pruned_scan_count_session`: Número de varreduras que foram reduzidas a uma partição nesta sessão do cliente.

* `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram reduzidas a uma partição por esta réplica.

* `Ndb_api_range_scan_count`: Número de varreduras de intervalo que foram iniciadas por este servidor MySQL (nó SQL).

* `Ndb_api_range_scan_count_session`: Número de varreduras de intervalo que foram iniciadas nesta sessão do cliente.

* `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo que foram iniciadas por esta réplica.

* `Ndb_api_read_row_count`: Número total de strings que foram lidas por este servidor MySQL (nó SQL).

* `Ndb_api_read_row_count_session`: Número total de strings que foram lidas nesta sessão do cliente.

* `Ndb_api_read_row_count_slave`: Número total de strings que foram lidas por esta réplica.

* `Ndb_api_scan_batch_count`: Número de lotes de strings recebidos por este servidor MySQL (nó SQL).

* `Ndb_api_scan_batch_count_session`: Número de lotes de strings recebidos nesta sessão do cliente.

* `Ndb_api_scan_batch_count_slave`: Número de lotes de strings recebidos por esta réplica.

* `Ndb_api_table_scan_count`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por este servidor MySQL (nó SQL).

* `Ndb_api_table_scan_count_session`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, nesta sessão do cliente.

* `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica.

* `Ndb_api_trans_abort_count`: Número de transações abortadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_abort_count_session`: Número de transações abortadas nesta sessão do cliente.

* `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta réplica.

* `Ndb_api_trans_close_count`: Número de transações fechadas por este servidor MySQL (nó SQL); pode ser maior que a soma de TransCommitCount e TransAbortCount.

* `Ndb_api_trans_close_count_session`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) nesta sessão do cliente.

* `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica.

* `Ndb_api_trans_commit_count`: Número de transações realizadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_commit_count_session`: Número de transações realizadas nesta sessão do cliente.

* `Ndb_api_trans_commit_count_slave`: Número de transações realizadas por esta réplica.

* `Ndb_api_trans_local_read_row_count`: Número total de strings que foram lidas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_local_read_row_count_session`: Número total de strings que foram lidas nesta sessão do cliente.

* `Ndb_api_trans_local_read_row_count_slave`: Número total de strings que foram lidas por esta réplica.

* `Ndb_api_trans_start_count`: Número de transações iniciadas por este servidor MySQL (nó SQL).

* `Ndb_api_trans_start_count_session`: Número de transações iniciadas nesta sessão do cliente.

* `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta réplica.

* `Ndb_api_uk_op_count`: Número de operações com base em ou que utilizam chaves únicas por este servidor MySQL (nó SQL).

* `Ndb_api_uk_op_count_session`: Número de operações com base em ou que utilizam chaves únicas nesta sessão do cliente.

* `Ndb_api_uk_op_count_slave`: Número de operações com base em ou que utilizam chaves únicas por esta réplica.

* `Ndb_api_wait_exec_complete_count`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação por este servidor MySQL (nó SQL).

* `Ndb_api_wait_exec_complete_count_session`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação nesta sessão do cliente.

* `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o thread foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica.

* `Ndb_api_wait_meta_request_count`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados por este servidor MySQL (nó SQL).

* `Ndb_api_wait_meta_request_count_session`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados nesta sessão do cliente.

* `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o thread foi bloqueado esperando por um sinal baseado em metadados por esta réplica.

* `Ndb_api_wait_nanos_count`: Tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados por este servidor MySQL (nó SQL).

* `Ndb_api_wait_nanos_count_session`: Tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados nesta sessão do cliente.

* `Ndb_api_wait_nanos_count_slave`: O tempo total (em nanosegundos) gasto esperando algum tipo de sinal dos nós de dados por esta réplica.

* `Ndb_api_wait_scan_result_count`: Número de vezes que o thread foi bloqueado enquanto aguardava um sinal baseado em varredura por este servidor MySQL (nó SQL).

* `Ndb_api_wait_scan_result_count_session`: Número de vezes que o thread foi bloqueado enquanto aguardava um sinal baseado em varredura nesta sessão do cliente.

* `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o thread foi bloqueado enquanto aguardava um sinal baseado em varredura por esta réplica.

* `ndb_autoincrement_prefetch_sz`: Tamanho pré-pré-enchimento de auto-incremento NDB.

* `ndb_cache_check_time`: Número de milissegundos entre os verificações dos nós do SQL do cluster feitas pelo cache de consulta do MySQL.

* `ndb_clear_apply_status`: Causa o RESET SLAVE/RESET REPLICA a limpar todas as strings da tabela ndb\_apply\_status; ON por padrão.

* `Ndb_cluster_node_id`: ID do nó deste servidor quando atuando como nó SQL do NDB Cluster.

* `Ndb_config_from_host`: Nome do servidor de gerenciamento do NDB Cluster ou endereço IP.

* `Ndb_config_from_port`: Porta para conexão com o servidor de gerenciamento do NDB Cluster.

* `Ndb_conflict_fn_epoch`: Número de strings que foram encontradas em conflito pela função de detecção de conflitos de replicação NDB$EPOCH().

* `Ndb_conflict_fn_epoch2`: Número de strings que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2() da replicação NDB.

* `Ndb_conflict_fn_epoch2_trans`: Número de strings que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH2_TRANS() da replicação NDB.

* `Ndb_conflict_fn_epoch_trans`: Número de strings que foram encontradas em conflito pela função de detecção de conflitos NDB$EPOCH_TRANS().

* `Ndb_conflict_fn_max`: Número de vezes em que a resolução de conflitos de replicação NDB com base na "maior marcação de tempo vence" foi aplicada em operações de atualização e exclusão.

* `Ndb_conflict_fn_max_del_win`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX_DELETE_WIN() foi aplicada em operações de atualização e exclusão.

* `Ndb_conflict_fn_old`: Número de vezes que a resolução de conflitos de replicação NDB "mesmo timestamp vence" foi aplicada.

* `Ndb_conflict_last_conflict_epoch`: Época mais recente do NDB nesta réplica na qual foi detectado algum conflito.

* `Ndb_conflict_last_stable_epoch`: A época mais recente que não contém conflitos.

* `Ndb_conflict_reflected_op_discard_count`: Número de operações refletidas que não foram aplicadas devido a um erro durante a execução.

* `Ndb_conflict_reflected_op_prepare_count`: Número de operações refletidas recebidas que foram preparadas para execução.

* `Ndb_conflict_refresh_op_count`: Número de operações de atualização que foram preparadas.

* `Ndb_conflict_trans_conflict_commit_count`: Número de transações de época comprometidas após a exigência de tratamento de conflitos transacionais.

* `Ndb_conflict_trans_detect_iter_count`: Número de iterações internas necessárias para confirmar a transação da época. Deve ser (levemente) maior ou igual a Ndb_conflict_trans_conflict_commit_count.

* `Ndb_conflict_trans_reject_count`: Número de transações rejeitadas após serem encontradas em conflito pela função de conflito transacional.

* `Ndb_conflict_trans_row_conflict_count`: Número de strings encontradas em conflito pela função de conflito transacional. Inclui quaisquer strings incluídas em transações conflitantes ou dependentes delas.

* `Ndb_conflict_trans_row_reject_count`: Número total de strings realinhadas após serem encontradas em conflito pela função de conflito transacional. Inclui Ndb_conflict_trans_row_conflict_count e quaisquer strings incluídas em transações conflitantes ou dependentes delas.

* `ndb_data_node_neighbour`: Especifica o nó de dados do cluster "mais próximo" a este servidor MySQL, para indicação de transações e tabelas totalmente replicadas.

* `ndb_default_column_format`: Define o formato de string e o formato de coluna padrão (FIXO ou DINÂMICO) usado para novas tabelas NDB.

* `ndb_deferred_constraints`: Especifica que os verificações de restrição devem ser diferidas (onde essas são suportadas). Normalmente não é necessário ou usado; apenas para fins de teste.

* `ndb_distribution`: Distribuição padrão para novas tabelas em NDBCLUSTER (KEYHASH ou LINHASH, padrão é KEYHASH).

* `Ndb_epoch_delete_delete_count`: Número de conflitos de delete-delete detectados (operação de delete é aplicada, mas a string não existe).

* `ndb_eventbuffer_free_percent`: Porcentagem de memória livre que deve estar disponível no buffer de eventos antes da retomada do buffer, após atingir o limite definido por ndb_eventbuffer_max_alloc.

* `ndb_eventbuffer_max_alloc`: Memória máxima que pode ser alocada para bufferamento de eventos pela API NDB. Por padrão, é 0 (sem limite).

* `Ndb_execute_count`: Número de viagens de ida e volta ao kernel NDB realizadas pelas operações.

* `ndb_extra_logging`: Controla o registro de eventos de esquema do NDB Cluster, conexão e distribuição de dados no registro de erro do MySQL.

* `ndb_force_send`: Força o envio de buffers para o NDB imediatamente, sem esperar por outros threads.

* `ndb_fully_replicated`: Se as novas tabelas NDB são totalmente replicadas.

* `ndb_index_stat_enable`: Use estatísticas do índice NDB na otimização de consultas.

* `ndb_index_stat_option`: Lista de opções ajustáveis para estatísticas de índice NDB, separadas por vírgula; a lista não deve conter espaços.

* `ndb_join_pushdown`: Habilita a empurrar as junções para os nós de dados.

* `Ndb_last_commit_epoch_server`: Época mais recentemente estabelecida pelo NDB.

* `Ndb_last_commit_epoch_session`: Época mais recentemente comprometida por este cliente do NDB.

* `ndb_log_apply_status`: Se o servidor MySQL estiver atuando como replica, o mysql.ndb_apply_status atualizações recebidas de sua fonte imediata serão registradas em seu próprio log binário, usando seu próprio ID de servidor.

* `ndb_log_bin`: Escreva atualizações em tabelas NDB no log binário. Efetiva apenas se o registro binário estiver habilitado com --log-bin.

* `ndb_log_binlog_index`: Insira mapeamento entre épocas e posições de log binário na tabela ndb\_binlog\_index. Definição padrão: ON. Efetiva apenas se o registro binário estiver habilitado.

* `ndb_log_empty_epochs`: Quando habilitado, as épocas em que não houve alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates está habilitado.

* `ndb_log_empty_update`: Quando habilitado, as atualizações que não produzem alterações são escritas nas tabelas ndb_apply_status e ndb_binlog_index, mesmo quando o log_replica_updates ou log_slave_updates está habilitado.

* `ndb_log_exclusive_reads`: Leia as chaves primárias de registro com bloqueios exclusivos; permita a resolução de conflitos com base em conflitos de leitura.

* `ndb_log_orig`: Se id e época do servidor de origem são registrados na tabela mysql.ndb_binlog_index. Defina usando a opção --ndb-log-orig ao iniciar o mysqld.

* `ndb_log_transaction_id`: Se os IDs de transação NDB são escritos no log binário (somente leitura).

* `Ndb_number_of_data_nodes`: Número de nós de dados neste clúster NDB; definido apenas se o servidor participa do clúster.

* `ndb-optimization-delay`: Número de milissegundos para esperar entre o processamento de conjuntos de strings por OPTIMIZE TABLE em tabelas NDB.

* `ndb_optimized_node_selection`: Determina como o nó SQL escolhe o nó de dados do cluster a ser usado como coordenador de transação.

* `Ndb_pruned_scan_count`: Número de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez, onde o recorte de partição pode ser usado.

* `Ndb_pushed_queries_defined`: Número de junções que os nós da API tentaram enviar para os nós de dados.

* `Ndb_pushed_queries_dropped`: Número de junções que os nós da API tentaram reduzir, mas falharam.

* `Ndb_pushed_queries_executed`: Número de junções que foram com sucesso reduzidas e executadas nos nós de dados.

* `Ndb_pushed_reads`: Número de leituras executadas em nós de dados por junções empurradas para baixo.

* `ndb_read_backup`: Habilitar a leitura de qualquer réplica para todas as tabelas NDB; use NDB_TABLE=READ_BACKUP={0|1} com CREATE TABLE ou ALTER TABLE para habilitar ou desabilitar para tabelas NDB individuais.

* `ndb_recv_thread_activation_threshold`: Limiar de ativação quando o thread de recebimento assume a pesquisa da conexão do cluster (medido em threads ativas simultaneamente).

* `ndb_recv_thread_cpu_mask`: Máscara de CPU para bloquear os threads do receptor em CPUs específicas; especificada como hexadecimal. Consulte a documentação para detalhes.

* `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 e versões posteriores: Limiar para o número de épocas completamente armazenadas, mas ainda não consumidas pelo thread do injetor binlog, que, quando excedido, gera a mensagem de status de buffer de evento BUFFERED_EPOCHS_OVER_THRESHOLD; antes de NDB 7.5: Limiar para o número de épocas que ficam para trás antes de relatar o status do log binário.

* `ndb_report_thresh_binlog_mem_usage`: Limiar para a porcentagem de memória livre restante antes de relatar o status do log binário.

* `ndb_row_checksum`: Quando ativado, defina os checksums de string; ativado por padrão.

* `Ndb_scan_count`: Número total de varreduras executadas pelo NDB desde que o clúster foi iniciado pela última vez.

* `ndb_show_foreign_key_mock_tables`: Mostrar tabelas simuladas usadas para suportar foreign_key_checks=0.

* `ndb_slave_conflict_role`: Papel que a réplica deve desempenhar na detecção e resolução de conflitos. O valor é um dos PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de replicação SQL é interrompido. Consulte a documentação para obter mais informações.

* `Ndb_slave_max_replicated_epoch`: Mais recentemente, o período de NDB comprometido nesta réplica. Quando esse valor é maior ou igual a Ndb_conflict_last_conflict_epoch, ainda não foram detectados conflitos.

* `Ndb_system_name`: Nome do sistema de clúster configurado; vazio se o servidor não estiver conectado ao NDB.

* `ndb_table_no_logging`: As tabelas NDB criadas quando essa configuração é habilitada não são mapeadas para o disco (embora os arquivos de esquema da tabela sejam criados). A configuração é válida quando a tabela é criada ou alterada para usar NDBCLUSTER e permanece válida durante a vida útil da tabela.

* `ndb_table_temporary`: As tabelas NDB não são persistentes no disco: não são criados arquivos de esquema e as tabelas não são registradas.

* `ndb_use_copying_alter_table`: Use operações de cópia ALTER TABLE no NDB Cluster.

* `ndb_use_exact_count`: Força o NDB a usar um contagem de registros durante o planejamento da consulta SELECT COUNT(*) para acelerar esse tipo de consulta.

* `ndb_use_transactions`: Definido em OFF, para desabilitar o suporte de transações pelo NDB. Não recomendado, exceto em certos casos especiais; consulte a documentação para detalhes.

* `ndb_version`: Mostra a versão do motor de construção e NDB como um número inteiro.

* `ndb_version_string`: Mostra informações de construção, incluindo a versão do motor NDB no formato ndb-x.y.z.

* `ndbcluster`: Habilitar NDB Cluster (se esta versão do MySQL a suportar). Desabilitada por `--skip-ndbcluster`.

* `ndbinfo_database`: Nome utilizado para o banco de dados de informações NDB; apenas para leitura.

* `ndbinfo_max_bytes`: Usado apenas para depuração.

* `ndbinfo_max_rows`: Usado apenas para depuração.

* `ndbinfo_offline`: Coloque o banco de dados ndbinfo em modo offline, no qual nenhuma string é devolvida das tabelas ou visualizações.

* `ndbinfo_show_hidden`: Se deve mostrar as tabelas de base internas ndbinfo no cliente mysql; o padrão é OFF.

* `ndbinfo_table_prefix`: Prefixo a ser usado para nomear as tabelas de base internas ndbinfo; apenas para leitura.

* `ndbinfo_version`: versão do motor ndbinfo; apenas para leitura.

* `server_id_bits`: Número de bits menos significativos no servidor _id que são efetivamente utilizados para identificar o servidor, permitindo que aplicativos da API NDB armazenem dados de aplicativos nos bits mais significativos. O servidor _id deve ser menor que 2 elevado a esse valor.

* `skip-ndbcluster`: Desative o motor de armazenamento do NDB Cluster.

* `slave_allow_batching`: Ativa e desativa o agrupamento de atualizações para a replica.

* `transaction_allow_batching`: Permite a agrupamento de declarações dentro de uma transação. Desative o AUTOCOMMIT para usar.

### 21.4.3 Arquivos de configuração do cluster NDB

Configurar o NDB Cluster exige o trabalho com dois arquivos:

* `my.cnf`: Especifica opções para todos os executaveis do NDB Cluster. Este arquivo, com o qual você deve estar familiarizado com o trabalho anterior com o MySQL, deve ser acessível por cada executável que está em execução no cluster.

* `config.ini`: Este arquivo, que às vezes é conhecido como o arquivo de configuração global, é lido apenas pelo servidor de gerenciamento do NDB Cluster, que, em seguida, distribui as informações contidas nele para todos os processos que participam do clúster. `config.ini` contém uma descrição de cada nó envolvido no clúster. Isso inclui parâmetros de configuração para nós de dados e parâmetros de configuração para conexões entre todos os nós no clúster. Para uma referência rápida às seções que podem aparecer neste arquivo e quais tipos de parâmetros de configuração podem ser colocados em cada seção, consulte Seções do arquivo `config.ini`.

**Cache de dados de configuração.** `NDB` utiliza configuração estática. Em vez de ler o arquivo de configuração global toda vez que o servidor de gerenciamento é reiniciado, o servidor de gerenciamento armazena a configuração na primeira vez que é iniciado, e, a partir daí, o arquivo de configuração global é lido apenas quando uma das seguintes condições é verdadeira:

* O servidor de gerenciamento é iniciado usando a opção --initial. Quando `--initial` é usado, o arquivo de configuração global é lido novamente, quaisquer arquivos de cache existentes são excluídos e o servidor de gerenciamento cria um novo cache de configuração.

* O servidor de gerenciamento é iniciado usando a opção --reload. A opção `--reload` faz com que o servidor de gerenciamento compare sua cache com o arquivo de configuração global. Se houver diferença, o servidor de gerenciamento cria uma nova cache de configuração; qualquer cache de configuração existente é preservada, mas não utilizada. Se a cache do servidor de gerenciamento e o arquivo de configuração global contiverem os mesmos dados de configuração, então a cache existente é usada e nenhuma nova cache é criada.

* **O servidor de gerenciamento é iniciado usando --config-cache=FALSE.** Isso desabilita `--config-cache` (ativado por padrão) e pode ser usado para forçar o servidor de gerenciamento a ignorar completamente o cache de configuração. Nesse caso, o servidor de gerenciamento ignora quaisquer arquivos de configuração que possam estar presentes, lendo sempre seus dados de configuração do arquivo `config.ini` em vez disso.

* **Não foi encontrado cache de configuração.** Nesse caso, o servidor de gerenciamento lê o arquivo de configuração global e cria um cache contendo os mesmos dados de configuração encontrados no arquivo.

**Arquivos de cache de configuração.** O servidor de gerenciamento, por padrão, cria arquivos de cache de configuração em um diretório denominado `mysql-cluster` no diretório de instalação do MySQL. (Se você construir o NDB Cluster a partir do código fonte em um sistema Unix, o local padrão é `/usr/local/mysql-cluster`.) Isso pode ser sobrescrito em tempo real ao iniciar o servidor de gerenciamento com a opção `--configdir`. Os arquivos de cache são arquivos binários nomeados de acordo com o padrão `ndb_node_id_config.bin.seq_id`, onde *`node_id`* é o ID do nó do servidor de gerenciamento no clúster, e *`seq_id`* é um identificador de cache. Os arquivos de cache são numerados sequencialmente usando *`seq_id`*, na ordem em que são criados. O servidor de gerenciamento usa o arquivo de cache mais recente conforme determinado pelo *`seq_id`*.

Nota

É possível voltar a uma configuração anterior ao excluir os arquivos de cache de configuração posteriores, ou renomeando um arquivo de cache anterior para que ele tenha um número maior de *`seq_id`*. No entanto, uma vez que os arquivos de cache de configuração são escritos em um formato binário, você não deve tentar editar seu conteúdo manualmente.

Para obter mais informações sobre as opções `--configdir`, `--config-cache`, `--initial` e `--reload` para o servidor de gerenciamento do NDB Cluster, consulte a Seção 21.5.4, “ndb\_mgmd — O Daemon de Gerenciamento do NDB Cluster”.

Estamos continuamente melhorando a configuração do Cluster e tentando simplificar esse processo. Embora nos esforcemos para manter a compatibilidade reversa, pode haver momentos em que introduzimos uma mudança incompatível. Nesses casos, tentamos informar os usuários do NDB Cluster com antecedência se uma mudança não for compatível com versões anteriores. Se você encontrar tal mudança e não a tenha documentado, por favor, informe-a no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”.

#### 21.4.3.1 Configuração do cluster NDB: Exemplo básico

Para suportar o NDB Cluster, você deve atualizar `my.cnf` conforme mostrado no exemplo a seguir. Você também pode especificar esses parâmetros na string de comando ao invocar os arquivos executáveis.

Nota

As opções mostradas aqui não devem ser confundidas com as que são usadas nos arquivos de configuração global `config.ini`. As opções de configuração global são discutidas mais tarde nesta seção.

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (valid in MySQL 5.7)

# enable ndbcluster storage engine, and provide connection string for
# management server host (default port is 1186)
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com


# provide connection string for management server host (default port: 1186)
[ndbd]
connect-string=ndb_mgmd.mysql.com

# provide connection string for management server host (default port: 1186)
[ndb_mgm]
connect-string=ndb_mgmd.mysql.com

# provide location of cluster configuration file
# IMPORTANT: When starting the management server with this option in the
# configuration file, the use of --initial or --reload on the command line when
# invoking ndb_mgmd is also required.
[ndb_mgmd]
config-file=/etc/config.ini
```

(Para mais informações sobre as cadeias de conexão, consulte a Seção 21.4.3.3, “Cadeias de conexão do NDB Cluster”.)

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (works on all versions)

# enable ndbcluster storage engine, and provide connection string for management
# server host to the default port 1186
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Importante

Uma vez que você tenha iniciado um processo `mysqld` com os parâmetros `NDBCLUSTER` e `ndb-connectstring` no `[mysqld]` no arquivo `my.cnf` como mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter realmente iniciado o clúster. Caso contrário, essas instruções falharão com um erro. *Isso é por design*.

Você também pode usar uma seção separada `[mysql_cluster]` no arquivo de clúster `my.cnf` para que as configurações sejam lidas e utilizadas por todos os executáveis:

```sql
# cluster-specific settings
[mysql_cluster]
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Para variáveis adicionais de `NDB` que podem ser definidas no arquivo `my.cnf`, consulte a Seção 21.4.3.9.2, “Variáveis do Sistema de Agrupamento NDB”.

O arquivo de configuração global do NDB Cluster é, por convenção, denominado `config.ini` (mas isso não é necessário). Se necessário, ele é lido pelo **ndb\_mgmd** no início e pode ser colocado em qualquer local que possa ser lido por ele. A localização e o nome da configuração são especificados usando `--config-file=path_name` com **ndb\_mgmd** na string de comando. Esta opção não tem um valor padrão e é ignorada se o **ndb\_mgmd** usar o cache de configuração.

O arquivo de configuração global para o NDB Cluster usa o formato INI, que consiste em seções precedidas por títulos de seção (envolvidos por colchetes), seguidos pelos nomes e valores apropriados dos parâmetros. Uma exceção ao formato INI padrão é que o nome e o valor do parâmetro podem ser separados por um colon (`:`) e também pelo sinal de igual (`=`); no entanto, o sinal de igual é preferido. Outra exceção é que as seções não são identificadas de forma única pelo nome da seção. Em vez disso, as seções únicas (como dois nós diferentes do mesmo tipo) são identificadas por um ID único especificado como um parâmetro dentro da seção.

Os valores padrão são definidos para a maioria dos parâmetros e também podem ser especificados em `config.ini`. Para criar uma seção de valor padrão, basta adicionar a palavra `default` ao nome da seção. Por exemplo, uma seção `[ndbd]` contém parâmetros que se aplicam a um nó de dados específico, enquanto uma seção `[ndbd default]` contém parâmetros que se aplicam a todos os nós de dados. Suponha que todos os nós de dados devam usar o mesmo tamanho de memória de dados. Para configurá-los todos, crie uma seção `[ndbd default]` que contenha uma string `DataMemory` para especificar o tamanho da memória de dados.

Se utilizado, a seção `[ndbd default]` deve preceder qualquer seção `[ndbd]` no arquivo de configuração. Isso também é válido para as seções `default` de qualquer outro tipo.

Nota

Em algumas versões mais antigas do NDB Cluster, não havia um valor padrão para `NoOfReplicas`, que sempre teve que ser especificado explicitamente na seção `[ndbd default]`. Embora este parâmetro agora tenha um valor padrão de 2, que é o ajuste recomendado na maioria dos cenários de uso comum, ainda é uma prática recomendada definir este parâmetro explicitamente.

O arquivo de configuração global deve definir os computadores e os nós envolvidos no clúster e em quais computadores esses nós estão localizados. Um exemplo de um arquivo de configuração simples para um clúster composto por um servidor de gerenciamento, dois nós de dados e dois servidores MySQL é mostrado aqui:

```sql
# file "config.ini" - 2 data nodes and 2 SQL nodes
# This file is placed in the startup directory of ndb_mgmd (the
# management server)
# The first MySQL Server can be started from any host. The second
# can be started only on the host mysqld_5.mysql.com

[ndbd default]
NoOfReplicas= 2
DataDir= /var/lib/mysql-cluster

[ndb_mgmd]
Hostname= ndb_mgmd.mysql.com
DataDir= /var/lib/mysql-cluster

[ndbd]
HostName= ndbd_2.mysql.com

[ndbd]
HostName= ndbd_3.mysql.com

[mysqld]
[mysqld]
HostName= mysqld_5.mysql.com
```

Nota

O exemplo anterior é destinado como uma configuração inicial mínima para fins de familiarização com o NDB Cluster, e quase certamente não será suficiente para configurações de produção. Veja a Seção 21.4.3.2, “Configuração inicial recomendada para o NDB Cluster”, que fornece uma configuração de inicialização mais completa.

Cada nó tem sua própria seção no arquivo `config.ini`. Por exemplo, este clúster tem dois nós de dados, então o arquivo de configuração anterior contém duas seções `[ndbd]` definindo esses nós.

Nota

Não coloque comentários na mesma string que o cabeçalho de uma seção no arquivo `config.ini`; isso faz com que o servidor de gerenciamento não comece, porque ele não pode analisar o arquivo de configuração nesses casos.

##### Seções do arquivo config.ini

Existem seis seções diferentes que você pode usar no arquivo de configuração `config.ini`, conforme descrito na lista a seguir:

* `[computer]`: Define hosts de cluster. Isso não é necessário para configurar um NDB Cluster viável, mas pode ser usado como uma conveniência ao configurar um grande cluster. Consulte a Seção 21.4.3.4, “Definindo Computadores em um NDB Cluster”, para mais informações.

* `[ndbd]`: Define um nó de dados de cluster (processo **ndbd**). Consulte a Seção 21.4.3.6, “Definindo NDB Cluster Data Nodes”, para obter detalhes.

* `[mysqld]`: Define os nós do servidor MySQL do cluster (também chamados de nós SQL ou API). Para uma discussão sobre a configuração do nó SQL, consulte a Seção 21.4.3.7, “Definindo nós SQL e outros nós API em um NDB Cluster”.

* `[mgm]` ou `[ndb_mgmd]`: Define um nó de servidor de gerenciamento de clúster (MGM). Para informações sobre a configuração dos nós de gerenciamento, consulte a Seção 21.4.3.5, “Definindo um servidor de gerenciamento de clúster NDB”.

* `[tcp]`: Define uma conexão TCP/IP entre os nós do cluster, com TCP/IP sendo o protocolo de transporte padrão. Normalmente, as seções `[tcp]` ou `[tcp default]` não são necessárias para configurar um NDB Cluster, pois o cluster trata isso automaticamente; no entanto, pode ser necessário, em algumas situações, sobrepor os padrões fornecidos pelo cluster. Consulte a Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster”, para obter informações sobre os parâmetros de configuração TCP/IP disponíveis e como usá-los. (Você também pode achar que a Seção 21.4.3.11, “Conexões TCP/IP do NDB Cluster Usando Conexões Direta”, seja de interesse em alguns casos.)

* `[shm]`: Define conexões de memória compartilhada entre nós. No MySQL 5.7, ela é habilitada por padrão, mas ainda deve ser considerada experimental. Para uma discussão sobre interconexões de SHM, consulte a Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDBC Cluster”.

* `[sci]`: Define conexões de Interface Coerente Escalável entre nós de dados do cluster. Não é suportada no NDB 7.5 ou 7.6.

Você pode definir os valores de `default` para cada seção. Se utilizado, uma seção `default` deve vir antes de qualquer outra seção desse tipo. Por exemplo, uma seção `[ndbd default]` deve aparecer no arquivo de configuração antes de qualquer seção `[ndbd]`.

Os nomes dos parâmetros do cluster do NDB são sensíveis a maiúsculas e minúsculas, a menos que sejam especificados nos arquivos do MySQL Server `my.cnf` ou `my.ini`.

#### 21.4.3.2 Configuração inicial recomendada para o NDB Cluster

A obtenção do melhor desempenho de um NDB Cluster depende de vários fatores, incluindo os seguintes:

* Versão do software do NDB Cluster * Número de nós de dados e nós SQL * Hardware * Sistema operacional * Quantidade de dados a ser armazenada * Tamanho e tipo de carga sob a qual o cluster deve operar

Portanto, obter uma configuração ótima provavelmente será um processo iterativo, cujo resultado pode variar amplamente com os detalhes de cada implantação do NDB Cluster. As alterações na configuração também provavelmente serão indicadas quando alterações forem feitas na plataforma em que o cluster é executado ou em aplicativos que utilizam os dados do NDB Cluster. Por essas razões, não é possível oferecer uma única configuração que seja ideal para todos os cenários de uso. No entanto, nesta seção, fornecemos uma configuração base recomendada.

**Começando o arquivo config.ini.** O seguinte arquivo `config.ini` é um ponto de partida recomendado para configurar um clúster que executa o NDB Cluster 7.5:

```sql
# TCP PARAMETERS

[tcp default]
SendBufferMemory=2M
ReceiveBufferMemory=2M

# Increasing the sizes of these 2 buffers beyond the default values
# helps prevent bottlenecks due to slow disk I/O.

# MANAGEMENT NODE PARAMETERS

[ndb_mgmd default]
DataDir=path/to/management/server/data/directory

# It is possible to use a different data directory for each management
# server, but for ease of administration it is preferable to be
# consistent.

[ndb_mgmd]
HostName=management-server-A-hostname
# NodeId=management-server-A-nodeid

[ndb_mgmd]
HostName=management-server-B-hostname
# NodeId=management-server-B-nodeid

# Using 2 management servers helps guarantee that there is always an
# arbitrator in the event of network partitioning, and so is
# recommended for high availability. Each management server must be
# identified by a HostName. You may for the sake of convenience specify
# a NodeId for any management server, although one is allocated
# for it automatically; if you do so, it must be in the range 1-255
# inclusive and must be unique among all IDs specified for cluster
# nodes.

# DATA NODE PARAMETERS

[ndbd default]
NoOfReplicas=2

# Using two fragment replicas is recommended to guarantee availability of data;
# using only one fragment replica does not provide any redundancy, which means
# that the failure of a single data node causes the entire cluster to
# shut down. We do not recommend using more than two fragment replicas, since
# two are sufficient to provide high availability, and we do not currently test
# with greater values for this parameter.

LockPagesInMainMemory=1

# On Linux and Solaris systems, setting this parameter locks data node
# processes into memory. Doing so prevents them from swapping to disk,
# which can severely degrade cluster performance.

DataMemory=3072M
IndexMemory=384M

# The values provided for DataMemory and IndexMemory assume 4 GB RAM
# per data node. However, for best results, you should first calculate
# the memory that would be used based on the data you actually plan to
# store (you may find the ndb_size.pl utility helpful in estimating
# this), then allow an extra 20% over the calculated values. Naturally,
# you should ensure that each data node host has at least as much
# physical memory as the sum of these two values.
# NOTE: IndexMemory is deprecated in NDB 7.6 and later.

# ODirect=1

# Enabling this parameter causes NDBCLUSTER to try using O_DIRECT
# writes for local checkpoints and redo logs; this can reduce load on
# CPUs. We recommend doing so when using NDB Cluster on systems running
# Linux kernel 2.6 or later.

NoOfFragmentLogFiles=300
DataDir=path/to/data/node/data/directory
MaxNoOfConcurrentOperations=100000

SchedulerSpinTimer=400
SchedulerExecutionTimer=100
RealTimeScheduler=1
# Setting these parameters allows you to take advantage of real-time scheduling
# of NDB threads to achieve increased throughput when using ndbd. They
# are not needed when using ndbmtd; in particular, you should not set
# RealTimeScheduler for ndbmtd data nodes.

TimeBetweenGlobalCheckpoints=1000
TimeBetweenEpochs=200
RedoBuffer=32M

# CompressedLCP=1
# CompressedBackup=1
# Enabling CompressedLCP and CompressedBackup causes, respectively, local
checkpoint files and backup files to be compressed, which can result in a space
savings of up to 50% over noncompressed LCPs and backups.

# MaxNoOfLocalScans=64
MaxNoOfTables=1024
MaxNoOfOrderedIndexes=256

[ndbd]
HostName=data-node-A-hostname
# NodeId=data-node-A-nodeid

LockExecuteThreadToCPU=1
LockMaintThreadsToCPU=0
# On systems with multiple CPUs, these parameters can be used to lock NDBCLUSTER
# threads to specific CPUs

[ndbd]
HostName=data-node-B-hostname
# NodeId=data-node-B-nodeid

LockExecuteThreadToCPU=1
LockMaintThreadsToCPU=0

# You must have an [ndbd] section for every data node in the cluster;
# each of these sections must include a HostName. Each section may
# optionally include a NodeId for convenience, but in most cases, it is
# sufficient to allow the cluster to allocate node IDs dynamically. If
# you do specify the node ID for a data node, it must be in the range 1
# to 48 inclusive and must be unique among all IDs specified for
# cluster nodes.

# SQL NODE / API NODE PARAMETERS

[mysqld]
# HostName=sql-node-A-hostname
# NodeId=sql-node-A-nodeid

[mysqld]

[mysqld]

# Each API or SQL node that connects to the cluster requires a [mysqld]
# or [api] section of its own. Each such section defines a connection
# “slot”; you should have at least as many of these sections in the
# config.ini file as the total number of API nodes and SQL nodes that
# you wish to have connected to the cluster at any given time. There is
# no performance or other penalty for having extra slots available in
# case you find later that you want or need more API or SQL nodes to
# connect to the cluster at the same time.
# If no HostName is specified for a given [mysqld] or [api] section,
# then any API or SQL node may use that slot to connect to the
# cluster. You may wish to use an explicit HostName for one connection slot
# to guarantee that an API or SQL node from that host can always
# connect to the cluster. If you wish to prevent API or SQL nodes from
# connecting from other than a desired host or hosts, then use a
# HostName for every [mysqld] or [api] section in the config.ini file.
# You can if you wish define a node ID (NodeId parameter) for any API or
# SQL node, but this is not necessary; if you do so, it must be in the
# range 1 to 255 inclusive and must be unique among all IDs specified
# for cluster nodes.
```

**Opções obrigatórias do my.cnf para nós SQL.** Servidores MySQL que atuam como nós SQL do NDB Cluster devem sempre ser iniciados com as opções `--ndbcluster` e `--ndb-connectstring`, na string de comando ou em `my.cnf`.

#### 21.4.3.3 Estruturas de conexão do cluster NDB

Com exceção do servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**), cada nó que faz parte de um NDB Cluster requer uma cadeia de conexão que aponta para a localização do servidor de gerenciamento. Essa cadeia de conexão é usada para estabelecer uma conexão com o servidor de gerenciamento, bem como para realizar outras tarefas, dependendo do papel do nó no cluster. A sintaxe para uma cadeia de conexão é a seguinte:

```sql
[nodeid=node_id, ]host-definition[, host-definition[, ...]]

host-definition:
    host_name[:port_number]
```

`node_id` é um número inteiro maior ou igual a 1 que identifica um nó em `config.ini`. *`host_name`* é uma cadeia de caracteres que representa um nome de host válido da Internet ou endereço IP. *`port_number`* é um número inteiro que se refere a um número de porta TCP/IP.

```sql
example 1 (long):    "nodeid=2,myhost1:1100,myhost2:1100,198.51.100.3:1200"
example 2 (short):   "myhost1"
```

`localhost:1186` é usado como o valor padrão da string de conexão se nenhuma for fornecida. Se *`port_num`* for omitido na string de conexão, a porta padrão é 1186. Essa porta deve estar sempre disponível na rede, pois foi atribuída pela IANA para esse propósito (consulte <http://www.iana.org/assignments/port-numbers> para detalhes).

Ao listar várias definições de host, é possível designar vários servidores de gerenciamento redundantes. Um nó de dados ou API de NDB Cluster tenta entrar em contato com servidores de gerenciamento sucessivos em cada host na ordem especificada, até que uma conexão bem-sucedida seja estabelecida.

Também é possível especificar em uma cadeia de conexão uma ou mais endereços de vinculação a serem utilizados por nós que possuem múltiplas interfaces de rede para se conectar a servidores de gerenciamento. Um endereço de vinculação consiste em um nome de domínio ou endereço de rede e um número de porta opcional. Esta sintaxe aprimorada para cadeias de conexão é mostrada aqui:

```sql
[nodeid=node_id, ]
    [bind-address=host-definition, ]
    host-definition[; bind-address=host-definition]
    host-definition[; bind-address=host-definition]
    [, ...]]

host-definition:
    host_name[:port_number]
```

Se um endereço de vinculação único for usado na string de conexão *antes* de especificar quaisquer hosts de gerenciamento, então esse endereço é usado como padrão para se conectar a qualquer um deles (a menos que seja sobrescrito para um servidor de gerenciamento específico; veja mais adiante nesta seção para um exemplo). Por exemplo, a seguinte string de conexão faz com que o nó use `198.51.100.242` independentemente do servidor de gerenciamento ao qual ele se conecta:

```sql
bind-address=198.51.100.242, poseidon:1186, perch:1186
```

Se um endereço de vinculação for especificado *seguindo* uma definição de host de gerenciamento, ele é usado apenas para se conectar a esse nó de gerenciamento. Considere a seguinte cadeia de conexão:

```sql
poseidon:1186;bind-address=localhost, perch:1186;bind-address=198.51.100.242
```

Neste caso, o nó utiliza `localhost` para se conectar ao servidor de gestão que está em execução no host denominado `poseidon` e `198.51.100.242` para se conectar ao servidor de gestão que está em execução no host denominado `perch`.

Você pode especificar um endereço de vinculação padrão e, em seguida, sobrescrever esse padrão para um ou mais hosts de gerenciamento específicos. No exemplo a seguir, `localhost` é usado para se conectar ao servidor de gerenciamento que está sendo executado no host `poseidon`; uma vez que `198.51.100.242` é especificado primeiro (antes de qualquer definição de servidor de gerenciamento), é o endereço de vinculação padrão e, portanto, é usado para se conectar aos servidores de gerenciamento nos hosts `perch` e `orca`:

```sql
bind-address=198.51.100.242,poseidon:1186;bind-address=localhost,perch:1186,orca:2200
```

Há várias maneiras diferentes de especificar a cadeia de conexão:

* Cada executável tem sua própria opção de string de comando que permite especificar o servidor de gerenciamento no início. (Consulte a documentação do respectivo executável.)

* É também possível definir a cadeia de conexão para todos os nós do clúster de uma vez, colocando-a em uma seção `[mysql_cluster]` no arquivo `my.cnf` do servidor de gerenciamento.

* Para compatibilidade reversa, duas outras opções estão disponíveis, usando a mesma sintaxe:

1. Defina a variável de ambiente `NDB_CONNECTSTRING` para conter a cadeia de conexão.

2. Escreva a string de conexão para cada executável em um arquivo de texto com o nome `Ndb.cfg` e coloque esse arquivo no diretório de inicialização do executável.

Esses devem ser considerados obsoletos e não devem ser usados em novas instalações.

O método recomendado para especificar a cadeia de conexão é defini-la na string de comando ou no arquivo `my.cnf` para cada executável.

#### 21.4.3.4 Definindo Computadores em um NDB Cluster

A seção `[computer]` não tem significado real, exceto para servir como uma maneira de evitar a necessidade de definir nomes de host para cada nó no sistema. Todos os parâmetros mencionados aqui são obrigatórios.

* `Id`

  <table frame="box" rules="all" summary="Id computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este é um identificador único, usado para se referir ao computador hospedeiro em outros lugares do arquivo de configuração.

Importante

O ID do computador *não* é o mesmo que o ID do nó usado para uma gestão, API ou nó de dados. Ao contrário do caso dos IDs de nó, você não pode usar `NodeId` no lugar de `Id` na seção `[computer]` do arquivo `config.ini`.

* `HostName`

  <table frame="box" rules="all" summary="HostName computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este é o nome de domínio ou endereço IP do computador.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.7 Tipos de reinício de cluster do NDB**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Núcleo</td> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulte a Seção 21.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”).</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma mudança nesse parâmetro.</td> </tr><tr> <th>Eu</th> <td>Inicial</td> <td>Os nós de dados devem ser reiniciados usando o<code>--initial</code>opção</td> </tr></tbody></table>

#### 21.4.3.5 Definindo um servidor de gerenciamento de cluster NDB

A seção `[ndb_mgmd]` é usada para configurar o comportamento do servidor de gerenciamento. Se vários servidores de gerenciamento forem empregados, você pode especificar parâmetros comuns a todos eles em uma seção `[ndb_mgmd default]`. `[mgm]` e `[mgm default]` são aliases mais antigos para esses, suportados para compatibilidade reversa.

Todos os parâmetros na lista a seguir são opcionais e assumem seus valores padrão se omitidos.

Nota

Se nem o parâmetro `ExecuteOnComputer` nem o `HostName` estiver presente, o valor padrão `localhost` é assumido para ambos.

* `Id`

  <table frame="box" rules="all" summary="Id management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Cada nó no clúster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado por todas as mensagens internas do clúster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo de nó.

Nota

Os IDs dos nós de dados devem ser menores que 49. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós de gerenciamento (e dos nós da API) para valores maiores que 48.

O uso do parâmetro `Id` para identificar nós de gerenciamento é descontinuado em favor do `NodeId`. Embora `Id` continue a ser suportado para compatibilidade reversa, ele agora gera um aviso e está sujeito à remoção em uma versão futura do NDB Cluster.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Cada nó no clúster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado por todas as mensagens internas do clúster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo de nó.

Nota

Os IDs dos nós de dados devem ser menores que 49. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós de gerenciamento (e dos nós da API) para valores maiores que 48.

`NodeId` é o nome do parâmetro preferido a ser usado ao identificar nós de gerenciamento. Embora o mais antigo `Id` continue a ser suportado para compatibilidade reversa, ele já é descontinuado e gera um aviso quando usado; também está sujeito à remoção em uma futura versão do NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Isso se refere ao conjunto `Id` para um dos computadores definidos em uma seção `[computer]` do arquivo `config.ini`.

Importante

Este parâmetro é desatualizado a partir do NDB 7.5.0 e está sujeito à remoção em uma versão futura. Use o parâmetro `HostName` em vez disso.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>1186</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este é o número de porta no qual o servidor de gerenciamento escuta solicitações de configuração e comandos de gerenciamento.

* `HostName`

  <table frame="box" rules="all" summary="HostName management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Especificar este parâmetro define o nome de host do computador em que o nó de gerenciamento deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Atribui um nó de gerenciamento a um domínio específico de disponibilidade (https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

+ Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

+ A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

+ O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que os nós SQL e outros nós API também comuniquem com os nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

+ O árbitro pode ser selecionado a partir de um domínio de disponibilidade em que não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

`LocationDomainId` assume um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `LogDestination`

  <table frame="box" rules="all" summary="LogDestination management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>{CONSOLE|SYSLOG|FILE}</td> </tr><tr> <th>Default</th> <td>FILE: filename=ndb_nodeid_cluster.log, maxsize=1000000, maxfiles=6</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro especifica para onde enviar as informações de registro do cluster. Existem três opções a esse respeito — `CONSOLE`, `SYSLOG` e `FILE` — com `FILE` sendo o padrão:

+ `CONSOLE` emite o log para `stdout`:

    ```sql
    CONSOLE
    ```

+ `SYSLOG` envia o registro para uma instalação `syslog`, com valores possíveis sendo um dos `auth`, `authpriv`, `cron`, `daemon`, `ftp`, `kern`, `lpr`, `mail`, `news`, `syslog`, `user`, `uucp`, `local0`, `local1`, `local2`, `local3`, `local4`, `local5`, `local6`, ou `local7`.

Nota

Nem toda instalação é necessariamente compatível com todos os sistemas operacionais.

    ```sql
    SYSLOG:facility=syslog
    ```

+ `FILE` envia a saída do log do cluster para um arquivo regular na mesma máquina. Os seguintes valores podem ser especificados:

- `filename`: O nome do arquivo de registro.

O nome padrão do arquivo de registro usado nesses casos é `ndb_nodeid_cluster.log`.

- `maxsize`: O tamanho máximo (em bytes) que o arquivo pode crescer antes de registrar rolar para um novo arquivo. Quando isso ocorre, o arquivo de registro antigo é renomeado, anexando *`.N`* ao nome do arquivo, onde *`N`* é o próximo número ainda não utilizado com este nome.

- `maxfiles`: O número máximo de arquivos de registro.

    ```sql
    FILE:filename=cluster.log,maxsize=1000000,maxfiles=6
    ```

O valor padrão para o parâmetro `FILE` é `FILE:filename=ndb_node_id_cluster.log,maxsize=1000000,maxfiles=6`, onde *`node_id`* é o ID do nó.

É possível especificar vários destinos de registro separados por pontos-e-vírgula, como mostrado aqui:

  ```sql
  CONSOLE;SYSLOG:facility=local0;FILE:filename=/var/log/mgmd
  ```

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>1</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro é usado para definir quais nós podem atuar como árbitros. Apenas nós de gerenciamento e nós SQL podem ser árbitros. `ArbitrationRank` pode ter um dos seguintes valores:

+ `0`: O nó nunca é usado como árbitro.

+ `1`: O nó tem alta prioridade; ou seja, é preferido como árbitro em detrimento de nós de baixa prioridade.

+ `2`: Indica um nó de baixa prioridade que é usado como árbitro apenas se um nó com uma prioridade mais alta não estiver disponível para esse propósito.

Normalmente, o servidor de gerenciamento deve ser configurado como um árbitro, definindo seu `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e os para todos os nós SQL para 0 (o padrão para nós SQL).

Você pode desativar completamente a arbitragem, definindo `ArbitrationRank` como 0 em todos os nós de gerenciamento e SQL, ou definindo o parâmetro `Arbitration` na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Definindo `Arbitration`, quaisquer configurações para `ArbitrationRank` serão ignoradas.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Um valor inteiro que faz com que as respostas do servidor de gerenciamento para solicitações de arbitragem sejam atrasadas por esse número de milissegundos. Por padrão, esse valor é 0; normalmente, não é necessário alterá-lo.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Isso especifica o diretório onde os arquivos de saída do servidor de gerenciamento são colocados. Esses arquivos incluem arquivos de registro do clúster, arquivos de saída de processos e o arquivo do ID do processo (PID) do daemon. (Para arquivos de log, essa localização pode ser substituída definindo o parâmetro `FILE` para `LogDestination` conforme discutido anteriormente nesta seção.)

O valor padrão para este parâmetro é o diretório em que o **ndb\_mgmd** está localizado.

* `PortNumberStats`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro especifica o número de porta usado para obter informações estatísticas de um servidor de gerenciamento de NDB Cluster. Não possui um valor padrão.

* `Wan`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Use a configuração WAN TCP como padrão.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Defina a política de agendamento e a prioridade das threads de batimento cardíaco para nós de gerenciamento e API.

A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

Ao definir este parâmetro, você deve especificar uma política. Isso é um dos `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (round robin). O valor da política é seguido opcionalmente pela prioridade (um número inteiro).

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Este parâmetro especifica a quantidade de memória de buffer que o transportador deve enviar, além daquela que foi definida usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro é usado para determinar o total de memória a ser alocada neste nó para memória de buffer de envio compartilhada entre todos os transportadores configurados.

Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”.

* `HeartbeatIntervalMgmdMgmd`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Especifique o intervalo entre as mensagens de batimento cardíaco usadas para determinar se outro nó de gerenciamento está em contato com este. O nó de gerenciamento espera após 3 desses intervalos para declarar a conexão como morta; assim, o ajuste padrão de 1500 milissegundos faz com que o nó de gerenciamento espere aproximadamente 1600 ms antes de expirar.

Nota

Após fazer alterações na configuração de um nó de gerenciamento, é necessário realizar um reinício contínuo do clúster para que a nova configuração entre em vigor.

Para adicionar novos servidores de gerenciamento a um NDB Cluster em execução, também é necessário realizar um reinício contínuo de todos os nós do cluster após modificar quaisquer arquivos existentes de `config.ini`. Para obter mais informações sobre os problemas que surgem ao usar vários nós de gerenciamento, consulte a Seção 21.2.7.10, “Limitações relacionadas a vários nós do NDB Cluster”.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.8 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

#### 21.4.3.6 Definindo nós de dados do NDB Cluster

As seções `[ndbd]` e `[ndbd default]` são usadas para configurar o comportamento dos nós de dados do cluster.

`[ndbd]` e `[ndbd default]` são sempre usados como nomes de seção, independentemente de você estar usando os binários **ndbd** ou **ndbmtd** para os processos do nó de dados.

Existem muitos parâmetros que controlam os tamanhos dos buffers, os tamanhos dos pools, os tempos de espera, e assim por diante. O único parâmetro obrigatório é `HostName`; este deve ser definido na seção local `[ndbd]`.

O parâmetro `NoOfReplicas` deve ser definido na seção `[ndbd default]`, pois é comum a todos os nós de dados do Cluster. Não é estritamente necessário definir `NoOfReplicas`, mas é uma boa prática defini-lo explicitamente.

A maioria dos parâmetros do nó de dados é definida na seção `[ndbd default]`. Apenas os parâmetros que explicitamente são declarados como podendo definir valores locais são permitidos para serem alterados na seção `[ndbd]`. Onde presentes, os `HostName` e `NodeId` *devem* ser definidos na seção local `[ndbd]`, e não em qualquer outra seção de `config.ini`. Em outras palavras, as configurações para esses parâmetros são específicas para um nó de dados.

Para os parâmetros que afetam o uso de memória ou tamanhos de buffer, é possível usar `K`, `M` ou `G` como sufixo para indicar unidades de 1024, 1024×1024 ou 1024×1024×1024. (Por exemplo, `100K` significa 100 × 1024 = 102400.)

Os nomes e valores dos parâmetros são sensíveis ao caso, a menos que sejam usados em um arquivo do MySQL Server `my.cnf` ou `my.ini`, caso em que são sensíveis ao caso.

Informações sobre os parâmetros de configuração específicos para as tabelas de dados de disco do NDB Cluster podem ser encontradas mais adiante nesta seção (veja Parâmetros de configuração de dados de disco).

Todos esses parâmetros também se aplicam a **ndbmtd**") (a versão multithread de **ndbd**). Três parâmetros adicionais de configuração de nó de dados — `MaxNoOfExecutionThreads`, `ThreadConfig` e `NoOfFragmentLogParts` — se aplicam apenas a **ndbmtd**") e não têm efeito quando usados com **ndbd**. Para mais informações, consulte Parâmetros de configuração de multitarefa (ndbmtd)"). Veja também a Seção 21.5.3, “ndbmtd — O daemon de nó de dados do NDB Cluster (multithreadado)”).

**Identificando nós de dados.** O valor `NodeId` ou `Id` (ou seja, o identificador do nó de dados) pode ser alocado na string de comando quando o nó é iniciado ou no arquivo de configuração.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 48</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Um ID único de nó é usado como o endereço do nó para todas as mensagens internas do clúster. Para nós de dados, este é um número inteiro no intervalo de 1 a 48, inclusive. Cada nó no clúster deve ter um identificador único.

`NodeId` é o único nome de parâmetro suportado a ser usado ao identificar nós de dados. (`Id` foi removido no NDB 7.5.0.)

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Isso se refere ao conjunto `Id` para um dos computadores definidos em uma seção `[computer]`.

Importante

Este parâmetro é desatualizado a partir do NDB 7.5.0 e está sujeito à remoção em uma versão futura. Use o parâmetro `HostName` em vez disso.

* `HostName`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Especificar este parâmetro define o nome de host do computador em que o nó de dados deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* `ServerPort`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Cada nó no clúster usa uma porta para se conectar a outros nós. Por padrão, essa porta é alocada dinamicamente de forma a garantir que nenhum dos dois nós no mesmo computador do host receba o mesmo número de porta, portanto, normalmente não é necessário especificar um valor para este parâmetro.

No entanto, se você precisar ser capaz de abrir portas específicas em um firewall para permitir a comunicação entre nós de dados e nós de API (incluindo nós SQL), você pode definir esse parâmetro para o número da porta desejada em uma seção `[ndbd]` ou (se você precisar fazer isso para vários nós de dados) na seção `[ndbd default]` do arquivo `config.ini`, e depois abrir a porta com esse número para conexões de entrada de nós de SQL, nós de API ou ambos.

Nota

As conexões dos nós de dados aos nós de gerenciamento são feitas usando a porta de gerenciamento **ndb\_mgmd** (o servidor de gerenciamento `PortNumber`) para que as conexões sazonais para essa porta de qualquer nó de dados sempre sejam permitidas.

* `TcpBind_INADDR_ANY`

Definir este parâmetro para `TRUE` ou `1` vincula `IP_ADDR_ANY` de modo que conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

* `NodeGroup`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro pode ser usado para atribuir um nó de dados a um grupo de nós específico. É somente leitura quando o clúster é iniciado pela primeira vez e não pode ser usado para reatribuir um nó de dados a um grupo de nós diferente online. Geralmente, não é desejável usar este parâmetro na seção `[ndbd default]` do arquivo `config.ini`, e deve-se ter cuidado para não atribuir nós a grupos de nós de maneira que números inválidos de nós sejam atribuídos a quaisquer grupos de nós.

O parâmetro `NodeGroup` é destinado principalmente para uso na adição de um novo grupo de nós a um NDB Cluster em execução sem a necessidade de realizar um reinício contínuo. Para este propósito, você deve configurá-lo para 65536 (o valor máximo). Você não é obrigado a configurar um valor `NodeGroup` para todos os nós de dados do cluster, apenas para aqueles que devem ser iniciados e adicionados ao cluster como um novo grupo de nós em um momento posterior. Para mais informações, consulte a Seção 21.6.7.3, “Adicionar nós de dados do NDB Cluster Online: Exemplo detalhado”.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Atribui um nó de dados a um domínio específico de disponibilidade (https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

+ Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

+ A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

+ O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que os nós SQL e outros nós API também comuniquem com os nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

+ O árbitro pode ser selecionado a partir de um domínio de disponibilidade em que não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

`LocationDomainId` assume um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `NoOfReplicas`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro global pode ser definido apenas na seção `[ndbd default]`, e define o número de réplicas de fragmento para cada tabela armazenada no clúster. Este parâmetro também especifica o tamanho dos grupos de nós. Um grupo de nós é um conjunto de nós que armazenam todas as mesmas informações.

Os grupos de nós são formados implicitamente. O primeiro grupo de nós é formado pelo conjunto de nós de dados com os IDs de nó mais baixos, o próximo grupo de nós pelo conjunto dos próximos IDs de nó mais baixos, e assim por diante. Por exemplo, suponha que tenhamos 4 nós de dados e que `NoOfReplicas` esteja definido como 2. Os quatro nós de dados têm IDs de nó 2, 3, 4 e

5. Em seguida, o primeiro grupo de nós é formado pelos nós 2 e 3, e o segundo grupo de nós pelos nós 4 e 5. É importante configurar o clúster de tal forma que os nós dos mesmos grupos de nós não estejam localizados no mesmo computador, pois uma falha de hardware única causaria o falecimento de todo o clúster.

Se não forem fornecidos IDs de nós, a ordem dos nós de dados é o fator determinante para o grupo de nós. Independentemente de serem feitas atribuições explícitas ou não, elas podem ser visualizadas na saída do comando `SHOW` do cliente de gerenciamento.

O valor máximo padrão e recomendado para `NoOfReplicas` é 2. *Este é o valor recomendado para a maioria dos ambientes de produção*.

Importante

Embora teoricamente seja possível que o valor deste parâmetro seja 3 ou 4, **NDB Cluster 7.5 e NDB Cluster 7.6 não suportam definir `NoOfReplicas` para um valor maior que 2 em produção**.

Aviso

Definir `NoOfReplicas` para 1 significa que há apenas uma única cópia de todos os dados do Cluster; nesse caso, a perda de um único nó de dados faz com que o cluster falhe, porque não há cópias adicionais dos dados armazenados por esse nó.

O número de nós de dados no clúster deve ser divisível uniformemente pelo valor deste parâmetro. Por exemplo, se houver dois nós de dados, então `NoOfReplicas` deve ser igual a 1 ou 2, uma vez que 2/3 e 2/4 produzem valores fracionários; se houver quatro nós de dados, então `NoOfReplicas` deve ser igual a 1, 2 ou 4.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro especifica o diretório onde os arquivos de rastreamento, arquivos de log, arquivos pid e logs de erro são colocados.

O diretório de trabalho padrão é o diretório do processo do nó de dados.

* `FileSystemPath`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro especifica o diretório onde todos os arquivos criados para metadados, logs REDO, logs UNDO (para tabelas de Dados de Disco) e arquivos de dados são colocados. O padrão é o diretório especificado por `DataDir`.

Nota

Esse diretório deve existir antes de o processo **ndbd** ser iniciado.

A hierarquia de diretório recomendada para o NDB Cluster inclui `/var/lib/mysql-cluster`, sob a qual é criado um diretório para o sistema de arquivos do nó. O nome deste subdiretório contém o ID do nó. Por exemplo, se o ID do nó é 2, este subdiretório é denominado `ndb_2_fs`.

* `BackupDataDir`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro especifica o diretório em que os backups são colocados.

Importante

A string '`/BACKUP`' é sempre anexada a este valor. Por exemplo, se você definir o valor de `BackupDataDir` para `/var/lib/cluster-data`, então todos os backups serão armazenados em `/var/lib/cluster-data/BACKUP`. Isso também significa que o *efetivo* local de backup padrão é o diretório denominado `BACKUP` sob a localização especificada pelo parâmetro `FileSystemPath`.

##### Memória de dados, memória de índice e memória de cadeia

Os parâmetros `DataMemory` e `IndexMemory` são `[ndbd]` que especificam o tamanho dos segmentos de memória utilizados para armazenar os registros reais e seus índices. Ao definir os valores para esses parâmetros, é importante entender como os `DataMemory` e `IndexMemory` são utilizados, pois eles geralmente precisam ser atualizados para refletir o uso real pelo clúster.

Nota

`IndexMemory` é descontinuado no NDB 7.6 e está sujeito à remoção em uma versão futura do NDB Cluster. Consulte as descrições a seguir para obter mais informações.

* `DataMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro define a quantidade de espaço (em bytes) disponível para armazenar registros do banco de dados. Todo o valor especificado por este valor é alocado na memória, portanto, é extremamente importante que a máquina tenha memória física suficiente para acomodá-lo.

A memória alocada por `DataMemory` é usada para armazenar tanto os registros quanto os índices. Há um sobrepeso de 16 bytes em cada registro; uma quantidade adicional é incorrida por cada registro porque ele é armazenado em uma página de 32 KB com um sobrepeso de página de 128 bytes (veja abaixo). Há também uma pequena quantidade desperdiçada por página devido ao fato de que cada registro é armazenado em apenas uma página.

Para atributos de tabela de tamanho variável, os dados são armazenados em páginas de dados separadas, alocadas a partir de `DataMemory`. Os registros de comprimento variável utilizam uma parte de tamanho fixo com um sobrecarga adicional de 4 bytes para referência à parte de tamanho variável. A parte de tamanho variável tem 2 bytes de sobrecarga mais 2 bytes por atributo.

O tamanho máximo do registro é de 14000 bytes.

Em NDB 7.5 (e versões anteriores), o espaço de memória definido por `DataMemory` também é usado para armazenar índices ordenados, que utilizam cerca de 10 bytes por registro. Cada string da tabela é representada no índice ordenado. Um erro comum entre os usuários é assumir que todos os índices são armazenados no espaço de memória alocado por `IndexMemory`, mas isso não é o caso: Apenas as chaves primárias e os índices de hash únicos utilizam esse espaço de memória; os índices ordenados utilizam o espaço de memória alocado por `DataMemory`. No entanto, criar uma chave primária ou um índice de hash único também cria um índice ordenado nas mesmas chaves, a menos que você especifique `USING HASH` na declaração de criação do índice. Isso pode ser verificado executando **ndb\_desc -d *`db_name`* *`table_name`***.

No NDB 7.6, os recursos atribuídos a `DataMemory` são usados para armazenar *todos* os dados e índices; qualquer memória configurada como `IndexMemory` é automaticamente adicionada àquela usada por `DataMemory` para formar um conjunto de recursos comum.

O espaço de memória alocado por `DataMemory` consiste em páginas de 32 KB, que são alocadas para fragmentos de tabela. Cada tabela é normalmente dividida no mesmo número de fragmentos que há de nós de dados no clúster. Assim, para cada nó, há o mesmo número de fragmentos que os definidos em `NoOfReplicas`.

Uma vez que uma página tenha sido alocada, atualmente não é possível devolvê-la ao conjunto de páginas livres, exceto por meio da exclusão da tabela. (Isso também significa que as páginas `DataMemory`, uma vez alocadas em uma determinada tabela, não podem ser utilizadas por outras tabelas.) Realizar uma recuperação de nó de dados também comprime a partição, pois todos os registros são inseridos em partições vazias de outros nós ativos.

O espaço de memória `DataMemory` também contém informações de ANULAMENTO: para cada atualização, uma cópia do registro não alterado é alocada no `DataMemory`. Há também uma referência a cada cópia nos índices de tabela ordenada. Os índices de hash únicos são atualizados apenas quando as colunas do índice único são atualizadas, nesse caso, uma nova entrada é inserida na tabela de índice e a entrada antiga é excluída no momento do commit. Por essa razão, também é necessário alocar memória suficiente para lidar com as maiores transações realizadas por aplicativos que utilizam o clúster. Em qualquer caso, realizar algumas grandes transações não oferece vantagem em relação ao uso de muitas menores, pelas seguintes razões:

+ Transações grandes não são mais rápidas do que as pequenas.  
+ Transações grandes aumentam o número de operações que são perdidas e devem ser repetidas em caso de falha na transação.

+ Transações grandes utilizam mais memória

Em NDB 7.5 (e versões anteriores), o valor padrão para `DataMemory` é de 80 MB; em NDB 7.6, este valor é de 98 MB. O valor mínimo é de 1 MB. Não há tamanho máximo, mas, na realidade, o tamanho máximo deve ser adaptado para que o processo não comece a fazer swap quando o limite for atingido. Esse limite é determinado pela quantidade de RAM física disponível na máquina e pela quantidade de memória que o sistema operacional pode comprometer para qualquer um dos processos. Sistemas operacionais de 32 bits geralmente estão limitados a 2 a 4 GB por processo; sistemas operacionais de 64 bits podem usar mais. Para bancos de dados grandes, pode ser preferível usar um sistema operacional de 64 bits por esse motivo.

* `IndexMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Em NDB 7.5 e versões anteriores, este parâmetro controla a quantidade de armazenamento usada para índices de hash no NDB Cluster. Os índices de hash são sempre usados para índices de chave primária, índices únicos e restrições únicas. Ao definir uma chave primária ou um índice único, dois índices são criados, um dos quais é um índice de hash usado para todos os acessos de tupla, bem como para o gerenciamento de bloqueio. Este índice também é usado para impor restrições únicas.

No NDB 7.6.2, o parâmetro `IndexMemory` é desatualizado (e sujeito à remoção futura); qualquer memória atribuída a `IndexMemory` é alocada, em vez disso, no mesmo pool que `DataMemory`, que se torna exclusivamente responsável por todos os recursos necessários para armazenar dados e índices na memória. No NDB 7.6, o uso de `IndexMemory` no arquivo de configuração do cluster aciona uma advertência do servidor de gerenciamento.

Você pode estimar o tamanho de um índice de hash usando esta fórmula:

  ```sql
    size  = ( (fragments * 32K) + (rows * 18) )
            * fragment_replicas
  ```

*`fragments`* é o número de fragmentos, *`fragment_replicas`* é o número de réplicas de fragmentos (normalmente dois), e *`rows`* é o número de strings. Se uma tabela tiver um milhão de strings, oito fragmentos e duas réplicas de fragmentos, o uso esperado da memória do índice é calculado conforme mostrado aqui:

  ```sql
    ((8 * 32K) + (1000000 * 18)) * 2 = ((8 * 32768) + (1000000 * 18)) * 2
    = (262144 + 18000000) * 2
    = 18262144 * 2 = 36524288 bytes = ~35MB
  ```

As estatísticas de índice para índices ordenados (quando estes estão habilitados) são armazenadas na tabela `mysql.ndb_index_stat_sample`. Como esta tabela possui um índice de hash, isso aumenta o uso de memória do índice. Um limite superior para o número de strings para um índice ordenado dado pode ser calculado da seguinte forma:

  ```sql
    sample_size= key_size + ((key_attributes + 1) * 4)

    sample_rows = IndexStatSaveSize
                  * ((0.01 * IndexStatSaveScale * log2(rows * sample_size)) + 1)
                  / sample_size
  ```

Na fórmula anterior, *`key_size`* é o tamanho da chave de índice ordenada em bytes, *`key_attributes`* é o número de atributos na chave de índice ordenada e *`rows`* é o número de strings na tabela base.

Suponha que a tabela `t1` tenha 1 milhão de strings e um índice ordenado chamado `ix1` em dois inteiros de quatro bytes. Além disso, suponha que `IndexStatSaveSize` e `IndexStatSaveScale` estejam definidos com seus valores padrão (32K e 100, respectivamente). Usando as fórmulas anteriores, podemos calcular da seguinte forma:

  ```sql
    sample_size = 8  + ((1 + 2) * 4) = 20 bytes

    sample_rows = 32K
                  * ((0.01 * 100 * log2(1000000*20)) + 1)
                  / 20
                  = 32768 * ( (1 * ~16.811) +1) / 20
                  = 32768 * ~17.811 / 20
                  = ~29182 rows
  ```

O uso esperado da memória do índice é, portanto, 2 * 18 * 29182 = ~1050550 bytes.

Antes da NDB 7.6, o valor padrão para `IndexMemory` é de 18 MB e o mínimo é de 1 MB; na NDB 7.6, o valor mínimo e padrão para este parâmetro é 0 (zero). Isso tem implicações para as despromoções da NDB 7.6 para versões anteriores do NDB Cluster; consulte a Seção 21.3.7, “Atualização e Despromoção do NDB Cluster”, para mais informações.

* `StringMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Este parâmetro determina a quantidade de memória alocada para strings, como nomes de tabelas, e é especificado em uma seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`. Um valor entre `0` e `100`, inclusive, é interpretado como um percentual do valor padrão máximo, que é calculado com base em vários fatores, incluindo o número de tabelas, tamanho máximo do nome da tabela, tamanho máximo dos arquivos `.FRM`, `MaxNoOfTriggers`, tamanho máximo do nome da coluna e valor padrão máximo da coluna.

Um valor maior que `100` é interpretado como um número de bytes.

O valor padrão é de 25 — ou seja, 25% do valor máximo padrão.

Na maioria das circunstâncias, o valor padrão deve ser suficiente, mas quando você tem muitas tabelas `NDB` (1000 ou mais), é possível obter o erro 773 de memória de string, modifique o parâmetro de configuração StringMemory: Erro permanente: erro de esquema, nesse caso, você deve aumentar esse valor. `25` (25 por cento) não é excessivo e deve impedir que esse erro ocorra em todas as condições, exceto as mais extremas.

O exemplo a seguir ilustra como a memória é usada para uma tabela. Considere esta definição de tabela:

```sql
CREATE TABLE example (
  a INT NOT NULL,
  b INT NOT NULL,
  c INT NOT NULL,
  PRIMARY KEY(a),
  UNIQUE(b)
) ENGINE=NDBCLUSTER;
```

Para cada registro, há 12 bytes de dados mais 12 bytes de sobrecarga. Não ter colunas nulos economiza 4 bytes de sobrecarga. Além disso, temos dois índices ordenados nas colunas `a` e `b`, consumindo aproximadamente 10 bytes cada, por registro. Há um índice de hash de chave primária na tabela base, usando aproximadamente 29 bytes por registro. A restrição única é implementada por uma tabela separada com `b` como chave primária e `a` como uma coluna. Esta outra tabela consome um adicional de 29 bytes de memória de índice por registro na tabela `example`, além de 8 bytes de dados de registro mais 12 bytes de sobrecarga.

Assim, para um milhão de registros, precisamos de 58 MB de memória de índice para lidar com os índices de hash da chave primária e da restrição única. Também precisamos de 64 MB para os registros da tabela base e da tabela de índice único, além das duas tabelas de índice ordenadas.

Você pode ver que os índices de hash ocupam uma quantidade razoável de espaço de memória; no entanto, eles fornecem acesso muito rápido aos dados em troca. Eles também são usados no NDB Cluster para lidar com restrições de unicidade.

Atualmente, o único algoritmo de particionamento é o hashing e os índices ordenados são locais para cada nó. Assim, os índices ordenados não podem ser usados para lidar com restrições de unicidade no caso geral.

Um ponto importante tanto para `IndexMemory` quanto para `DataMemory` é que o tamanho total do banco de dados é a soma de toda a memória de dados e toda a memória de índice para cada grupo de nós. Cada grupo de nós é usado para armazenar informações replicadas, então, se houver quatro nós com duas réplicas de fragmento, há dois grupos de nós. Assim, a memória de dados total disponível é 2 × `DataMemory` para cada nó de dados.

É altamente recomendável que `DataMemory` e `IndexMemory` sejam definidos com os mesmos valores para todos os nós. A distribuição de dados ocorre mesmo em todos os nós do clúster, portanto, a quantidade máxima de espaço disponível para qualquer nó não pode ser maior do que a do nó mais pequeno do clúster.

`DataMemory` (e no NDB 7.5 e versões anteriores `IndexMemory`) pode ser alterado, mas diminuí-lo pode ser arriscado; isso pode facilmente levar a um nó ou até mesmo a um NDB Cluster inteiro que não consegue reiniciar devido ao espaço de memória insuficiente. Aumentos devem ser aceitáveis, mas é recomendado que essas atualizações sejam realizadas da mesma maneira que uma atualização de software, começando com uma atualização do arquivo de configuração, e então reiniciando o servidor de gerenciamento seguido pelo reinício de cada nó de dados, uma a uma.

**MinFreePct.**

Uma proporção (padrão de 5%) dos recursos dos nós de dados, incluindo `DataMemory` (e, no NDB 7.5 e versões anteriores, `IndexMemory`) é mantida em reserva para garantir que o nó de dados não esgote sua memória ao realizar um reinício. Isso pode ser ajustado usando o parâmetro de configuração do nó de dados `MinFreePct` (padrão de 5).

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

As atualizações não aumentam a quantidade de memória de índice utilizada. As inserções entram em vigor imediatamente; no entanto, as strings não são de fato excluídas até que a transação seja comprometida.

**Parâmetros da transação.** Os próximos parâmetros `[ndbd]` que discutimos são importantes porque afetam o número de transações paralelas e os tamanhos das transações que podem ser manuseadas pelo sistema. `MaxNoOfConcurrentTransactions` define o número de transações paralelas possíveis em um nó. `MaxNoOfConcurrentOperations` define o número de registros que podem estar na fase de atualização ou bloqueados simultaneamente.

Ambos esses parâmetros (especialmente `MaxNoOfConcurrentOperations`) são provavelmente alvos para usuários que definem valores específicos e não usam o valor padrão. O valor padrão é definido para sistemas que utilizam pequenas transações, para garantir que esses não utilizem memória excessiva.

`MaxDMLOperationsPerTransaction` define o número máximo de operações de MLD que podem ser realizadas em uma transação dada.

* `MaxNoOfConcurrentTransactions`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Cada nó de dados do cluster requer um registro de transação para cada transação ativa no cluster. A tarefa de coordenação das transações é distribuída entre todos os nós de dados. O número total de registros de transação no cluster é o número de transações em qualquer nó dado vezes o número de nós no cluster.

Os registros de transação são alocados em servidores MySQL individuais. Cada conexão com um servidor MySQL requer pelo menos um registro de transação, além de um objeto de transação adicional por tabela acessada por essa conexão. Isso significa que um mínimo razoável para o número total de transações no clúster pode ser expresso como

  ```sql
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

Suponha que haja 10 nós SQL usando o clúster. Uma única junção que envolve 10 tabelas requer 11 registros de transação; se houver 10 junções desse tipo em uma transação, então 10 * 11 = 110 registros de transação são necessários para essa transação, por servidor MySQL, ou 110 * 10 = 1100 registros de transação no total. Espera-se que cada nó de dados possa lidar com TotalNoOfConcurrentTransactions / número de nós de dados. Para um NDB Cluster com 4 nós de dados, isso significaria definir `MaxNoOfConcurrentTransactions` em cada nó de dados para 1100 / 4 = 275. Além disso, você deve prever a recuperação em caso de falha, garantindo que um único grupo de nós possa acomodar todas as transações concorrentes; em outras palavras, que o MaxNoOfConcurrentTransactions de cada nó de dados seja suficiente para cobrir um número de transações igual a TotalNoOfConcurrentTransactions / número de grupos de nós. Se este clúster tiver um único grupo de nós, então `MaxNoOfConcurrentTransactions` deve ser definido para 1100 (o mesmo que o número total de transações concorrentes para todo o clúster).

Além disso, cada transação envolve pelo menos uma operação; por essa razão, o valor definido para `MaxNoOfConcurrentTransactions` nunca deve ser superior ao valor de `MaxNoOfConcurrentOperations`.

Este parâmetro deve ser definido com o mesmo valor para todos os nós de dados do cluster. Isso ocorre porque, quando um nó de dados falha, o nó mais antigo que sobrevive recria o estado de transação de todas as transações que estavam em andamento no nó falhado.

É possível alterar esse valor usando um reinício contínuo, mas a quantidade de tráfego no clúster deve ser tal que não ocorram mais transações do que o menor dos níveis antigo e novo, enquanto isso estiver acontecendo.

O valor padrão é 4096.

* `MaxNoOfConcurrentOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

É uma boa ideia ajustar o valor deste parâmetro de acordo com o tamanho e o número de transações. Ao realizar transações que envolvem apenas algumas operações e registros, o valor padrão deste parâmetro geralmente é suficiente. Realizar grandes transações que envolvem muitos registros geralmente exige que você aumente seu valor.

Os registros são mantidos para cada transação que atualiza os dados do cluster, tanto no coordenador de transação quanto nos nós onde as atualizações reais são realizadas. Esses registros contêm informações de estado necessárias para encontrar registros UNDO para rollback, filas de bloqueio e outros propósitos.

Este parâmetro deve ser definido no mínimo para o número de registros que serão atualizados simultaneamente em transações, dividido pelo número de nós de dados do cluster. Por exemplo, em um cluster que tem quatro nós de dados e que espera lidar com uma atualização concorrente de um milhão de usuários usando transações, você deve definir esse valor em 1.000.000 / 4 = 25.000. Para ajudar a fornecer resiliência contra falhas, sugere-se que você defina esse parâmetro em um valor suficientemente alto para permitir que um nó de dados individualmente lidere a carga para seu grupo de nós. Em outras palavras, você deve definir o valor igual a [[`total number of concurrent operations / number of node groups`]. (No caso em que há um único grupo de nós, isso é o mesmo que o número total de operações concorrentes para todo o cluster.)

Como cada transação sempre envolve pelo menos uma operação, o valor de `MaxNoOfConcurrentOperations` deve sempre ser maior ou igual ao valor de `MaxNoOfConcurrentTransactions`.

As consultas que definem bloqueios também geram registros de operação. Algum espaço adicional é alocado dentro dos nós individuais para acomodar casos em que a distribuição não é perfeita pelos nós.

Quando as consultas utilizam o índice de hash exclusivo, na verdade, são usados dois registros de operação por registro na transação. O primeiro registro representa a leitura na tabela de índice e o segundo lida com a operação na tabela base.

O valor padrão é 32768.

Este parâmetro, na verdade, lida com dois valores que podem ser configurados separadamente. O primeiro deles especifica quantos registros de operação devem ser colocados com o coordenador de transação. A segunda parte especifica quantos registros de operação devem ser locais no banco de dados.

Uma transação muito grande realizada em um clúster de oito nós requer tantos registros de operação no coordenador de transação quanto houver de leituras, atualizações e apagamentos envolvidos na transação. No entanto, os registros de operação estão espalhados por todos os oito nós. Assim, se for necessário configurar o sistema para uma transação muito grande, é uma boa ideia configurar as duas partes separadamente. `MaxNoOfConcurrentOperations` é sempre usado para calcular o número de registros de operação na parte do coordenador de transação do nó.

É importante também ter uma ideia dos requisitos de memória para os registros de operação. Esses consomem cerca de 1 KB por registro.

* `MaxNoOfLocalOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Por padrão, este parâmetro é calculado como 1,1 × `MaxNoOfConcurrentOperations`. Isso se encaixa em sistemas com muitas transações simultâneas, nenhuma delas muito grande. Se houver a necessidade de lidar com uma transação muito grande de cada vez e houver muitos nós, é uma boa ideia sobrepor o valor padrão, especificando explicitamente este parâmetro.

* `MaxDMLOperationsPerTransaction`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Este parâmetro limita o tamanho de uma transação. A transação é abortada se exigir mais do que esse número de operações DML.

**Armazenamento temporário de transação.** O próximo conjunto de parâmetros `[ndbd]` é usado para determinar o armazenamento temporário ao executar uma declaração que faz parte de uma transação de cluster. Todos os registros são liberados quando a declaração é concluída e o cluster está aguardando o commit ou o rollback.

Os valores padrão para esses parâmetros são adequados para a maioria das situações. No entanto, os usuários que precisam suportar transações que envolvem um grande número de strings ou operações podem precisar aumentar esses valores para permitir um melhor paralelismo no sistema, enquanto os usuários cujas aplicações exigem transações relativamente pequenas podem diminuir os valores para economizar memória.

* `MaxNoOfConcurrentIndexOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Para consultas que utilizam um índice de hash único, outro conjunto temporário de registros de operação é usado durante a fase de execução da consulta. Este parâmetro define o tamanho desse conjunto de registros. Assim, este registro é alocado apenas durante a execução de uma parte de uma consulta. Assim que essa parte tiver sido executada, o registro é liberado. O estado necessário para lidar com abortos e compromissos é tratado pelos registros de operação normais, onde o tamanho do conjunto é definido pelo parâmetro `MaxNoOfConcurrentOperations`.

O valor padrão deste parâmetro é 8192. Somente em casos raros de paralelismo extremamente alto usando índices de hash únicos é que é necessário aumentar esse valor. É possível usar um valor menor e pode-se economizar memória se o DBA estiver certo de que um alto grau de paralelismo não é necessário para o clúster.

* `MaxNoOfFiredTriggers`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

O valor padrão de `MaxNoOfFiredTriggers` é 4000, o que é suficiente para a maioria das situações. Em alguns casos, ele pode até ser reduzido se o DBA considerar que a necessidade de paralelismo no clúster não é alta.

Um registro é criado quando uma operação é realizada que afeta um índice de hash único. Inserir ou excluir um registro em uma tabela com índices de hash únicos ou atualizar uma coluna que faz parte de um índice de hash único aciona uma inserção ou uma exclusão na tabela de índice. O registro resultante é usado para representar essa operação da tabela de índice enquanto espera que a operação original que a acionou seja concluída. Essa operação é de curta duração, mas ainda pode exigir um grande número de registros em seu conjunto para situações com muitas operações de escrita paralelas em uma tabela de base que contém um conjunto de índices de hash únicos.

* `TransactionBufferMemory`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

A memória afetada por este parâmetro é usada para rastrear operações realizadas ao atualizar tabelas de índice e ler índices únicos. Esta memória é usada para armazenar as informações de chave e coluna para essas operações. É muito raramente que o valor deste parâmetro precise ser alterado do padrão.

O valor padrão para `TransactionBufferMemory` é 1 MB.

As operações normais de leitura e escrita utilizam um buffer semelhante, cujo uso é ainda mais de curta duração. O parâmetro de tempo de compilação `ZATTRBUF_FILESIZE` (encontrado em `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) definido para 4000 × 128 bytes (500KB). Um buffer semelhante para informações chave, `ZDATABUF_FILESIZE` (também em `Dbtc.hpp`) contém 4000 × 16 = 62,5KB de espaço de buffer. `Dbtc` é o módulo que lida com a coordenação de transações.

**Ensaios e bufferamento.** Existem parâmetros adicionais no módulo `[ndbd]` (no `Dblqh`) que afetam leituras e atualizações. Esses incluem `ZATTRINBUF_FILESIZE`, definido como padrão para 10000 × 128 bytes (1250KB) e `ZDATABUF_FILE_SIZE`, definido como padrão para 10000\*16 bytes (aproximadamente 156KB) de espaço de buffer. Até o momento, não houve relatórios de usuários nem resultados de nossos próprios testes extensos que sugiram que algum desses limites de tempo de compilação deva ser aumentado.

* `BatchSizePerLocalScan`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Este parâmetro é usado para calcular o número de registros de bloqueio utilizados para lidar com operações de varredura concorrentes.

`BatchSizePerLocalScan` tem uma forte conexão com o `BatchSize` definido nos nós SQL.

* `LongMessageBuffer`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Este é um buffer interno usado para transmitir mensagens dentro de nós individuais e entre nós. O padrão é de 64 MB.

Esse parâmetro raramente precisa ser alterado do padrão.

* `MaxFKBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Tamanho máximo do lote de varredura usado para a construção de chaves estrangeiras. Aumentar o valor definido para este parâmetro pode acelerar a construção de chaves estrangeiras, às custas de um maior impacto no tráfego em andamento.

* `MaxNoOfConcurrentScans`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro é usado para controlar o número de varreduras paralelas que podem ser realizadas no clúster. Cada coordenador de transação pode lidar com o número de varreduras paralelas definido para este parâmetro. Cada consulta de varredura é realizada realizando a varredura de todas as partições em paralelo. Cada varredura de partição usa um registro de varredura no nó onde a partição está localizada, o número de registros sendo o valor deste parâmetro vezes o número de nós. O clúster deve ser capaz de sustentar `MaxNoOfConcurrentScans` varreduras simultaneamente de todos os nós no clúster.

Os scans são, na verdade, realizados em dois casos. O primeiro desses casos ocorre quando não existe hash ou índices ordenados para lidar com a consulta, no qual caso a consulta é executada realizando um varrimento completo da tabela. O segundo caso é encontrado quando não existe índice hash para suportar a consulta, mas existe um índice ordenado. Usando o índice ordenado significa executar um varrimento paralelo de intervalo. A ordem é mantida apenas nas partições locais, portanto, é necessário realizar o varrimento do índice em todas as partições.

O valor padrão de `MaxNoOfConcurrentScans` é 256. O valor máximo é 500.

* `MaxNoOfLocalScans`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Especifica o número de registros de varredura local, caso muitas varreduras não sejam totalmente paralizadas. Quando o número de registros de varredura local não é fornecido, ele é calculado conforme mostrado aqui:

  ```sql
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

O valor mínimo é de 32.

* `MaxParallelCopyInstances`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Este parâmetro define a paralelização utilizada na fase de cópia de um reinício de nó ou reinício do sistema, quando um nó que está atualmente começando é sincronizado com um nó que já tem dados atuais, copiando quaisquer registros alterados do nó que está atualizado. Como o paralelismo total, nesses casos, pode levar a situações de sobrecarga, o `MaxParallelCopyInstances` fornece um meio para diminuí-lo. O valor padrão deste parâmetro é 0. Este valor significa que o paralelismo efetivo é igual ao número de instâncias do LDM no nó que está começando, bem como no nó que está atualizando.

* `MaxParallelScansPerFragment`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

É possível configurar o número máximo de varreduras paralelas (varreduras `TUP` e `TUX`) permitidas antes de começarem a ficar em fila para tratamento em série. Você pode aumentar isso para aproveitar qualquer CPU não utilizada ao realizar um grande número de varreduras em paralelo e melhorar seu desempenho.

* `MaxReorgBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Tamanho máximo do lote de varredura usado para reorganização de partições de tabela. Aumentar o valor definido para este parâmetro pode acelerar a reorganização em detrimento de um maior impacto no tráfego em andamento.

* `MaxUIBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Tamanho máximo do lote de varredura usado para a construção de chaves únicas. Aumentar o valor definido para este parâmetro pode acelerar essas construções às custas de um maior impacto no tráfego em andamento.

##### Alocação de memória

`MaxAllocate`

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Esse parâmetro era usado em versões mais antigas do NDB Cluster, mas não tem efeito no NDB 7.5 ou no NDB 7.6.

##### Tamanho do Mapa de Hash

`DefaultHashMapSize`

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

O tamanho dos mapas de hash de tabela usados por `NDB` é configurável usando este parâmetro. `DefaultHashMapSize` pode ter qualquer um dos três valores possíveis (0, 240 ou 3840).

O uso original previsto para este parâmetro era facilitar atualizações e, especialmente, atualizações para e a partir de versões muito antigas com tamanhos diferentes do mapa de hash padrão. Este não é um problema ao fazer uma atualização do NDB Cluster 7.3 (ou posterior) para versões posteriores.

A redução desse parâmetro online após a criação ou modificação de quaisquer tabelas com `DefaultHashMapSize` igual a 3840 não é suportada.

**Registro e verificação de ponto.** Os seguintes parâmetros `[ndbd]` controlam o comportamento do registro e da verificação de ponto.

* `FragmentLogFileSize`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Definir este parâmetro permite controlar diretamente o tamanho dos arquivos de registro de refazer. Isso pode ser útil em situações em que o NDB Cluster está operando sob uma carga alta e não consegue fechar os arquivos de registro de fragmentação o suficiente antes de tentar abrir novos (apenas 2 arquivos de registro de fragmentação podem ser abertos ao mesmo tempo); aumentar o tamanho dos arquivos de registro de fragmentação dá ao cluster mais tempo antes de ter que abrir cada novo arquivo de registro de fragmentação. O valor padrão para este parâmetro é 16M.

Para mais informações sobre arquivos de registro de fragmentos, consulte a descrição para `NoOfFragmentLogFiles`.

* `InitialNoOfOpenFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Este parâmetro define o número inicial de threads internas a serem alocadas para arquivos abertos.

O valor padrão é 27.

* `InitFragmentLogFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Por padrão, os arquivos de registro de fragmentos são criados de forma esparsa ao realizar um início inicial de um nó de dados — ou seja, dependendo do sistema operacional e do sistema de arquivos utilizado, nem todos os bytes são necessariamente escritos no disco. No entanto, é possível sobrepor esse comportamento e forçar que todos os bytes sejam escritos, independentemente da plataforma e do tipo de sistema de arquivos utilizado, por meio desse parâmetro. `InitFragmentLogFiles` assume um dos dois valores:

+ `SPARSE`. Arquivos de registro de fragmento são criados de forma esparsa. Este é o valor padrão.

+ `FULL`. Forçar que todos os bytes do arquivo de registro do fragmento sejam escritos no disco.

Dependendo do seu sistema operacional e do sistema de arquivos, definir `InitFragmentLogFiles=FULL` pode ajudar a eliminar erros de E/S em gravações no log REDO.

* `EnablePartialLcp`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Quando `true`, habilite pontos de verificação locais parciais: Isso significa que cada LCP registra apenas parte do banco de dados completo, além de quaisquer registros que contenham strings alteradas desde o último LCP; se nenhuma string tiver sido alterada, o LCP atualiza apenas o arquivo de controle do LCP e não atualiza nenhum arquivo de dados.

Se `EnablePartialLcp` estiver desativado (`false`), cada LCP usa apenas um único arquivo e escreve um ponto de verificação completo; isso requer a menor quantidade de espaço em disco para LCPs, mas aumenta a carga de escrita para cada LCP. O valor padrão está ativado (`true`). A proporção de espaço usada por LCPS parciais pode ser modificada pelo ajuste para o parâmetro de configuração `RecoveryWork`.

Para mais informações sobre os arquivos e diretórios utilizados para LCPs completos e parciais, consulte o diretório do sistema de arquivos do NDB Cluster Data Node.

Em NDB 7.6.7 e versões posteriores, definir esse parâmetro para `false` também desativa o cálculo da velocidade de escrita do disco utilizada pelo mecanismo de controle LCP adaptativo.

* `LcpScanProgressTimeout`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Um rastreador de verificação de fragmento de ponto de controle local verifica periodicamente se não há progresso em cada varredura de fragmento realizada como parte de um ponto de controle local, e desativa o nó se não houver progresso após um determinado período de tempo ter passado. Esse intervalo pode ser definido usando o parâmetro de configuração do nó de dados `LcpScanProgressTimeout`, que define o tempo máximo em que o ponto de controle local pode ficar parado antes de o rastreador de varredura de fragmento LCP desativar o nó.

O valor padrão é de 60 segundos (que oferece compatibilidade com versões anteriores). Definir este parâmetro para 0 desativa o monitor de varredura de fragmento LCP completamente.

* `MaxNoOfOpenFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Este parâmetro define um limite para o número de threads internas a serem alocadas para arquivos abertos. *Qualquer situação que exija uma mudança neste parâmetro deve ser relatada como um erro*.

O valor padrão é 0. No entanto, o valor mínimo para o qual este parâmetro pode ser definido é 20.

* `MaxNoOfSavedMessages`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Este parâmetro define o número máximo de erros escritos no log de erros, bem como o número máximo de arquivos de rastreamento que são mantidos antes de sobrescrever os existentes. Os arquivos de rastreamento são gerados quando, por qualquer motivo, o nó falha.

O padrão é 25, que define esses limites em 25 mensagens de erro e 25 arquivos de rastreamento.

* `MaxLCPStartDelay`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Na recuperação de nós de dados em paralelo, apenas os dados da tabela são realmente copiados e sincronizados em paralelo; a sincronização dos metadados, como informações de dicionário e pontos de verificação, é feita de forma serial. Além disso, a recuperação de informações de dicionário e pontos de verificação não pode ser executada em paralelo com a realização de pontos de verificação locais. Isso significa que, ao iniciar ou reiniciar muitos nós de dados de forma concorrente, os nós de dados podem ser forçados a esperar enquanto um ponto de verificação local é realizado, o que pode resultar em tempos de recuperação dos nós mais longos.

É possível forçar um atraso no ponto de verificação local para permitir que mais (e possivelmente todos) nós de dados completem a sincronização de metadados; uma vez que a sincronização de metadados de cada nó de dados esteja completa, todos os nós de dados podem recuperar os dados da tabela em paralelo, mesmo enquanto o ponto de verificação local está sendo executado. Para forçar tal atraso, defina `MaxLCPStartDelay`, que determina o número de segundos que o clúster pode esperar para iniciar um ponto de verificação local enquanto os nós de dados continuam a sincronizar metadados. Este parâmetro deve ser definido na seção `[ndbd default]` do arquivo `config.ini`, para que seja o mesmo para todos os nós de dados. O valor máximo é 600; o padrão é 0.

* `NoOfFragmentLogFiles`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro define o número de arquivos de registro REDO para o nó, e, portanto, a quantidade de espaço alocada para o registro REDO. Como os arquivos de registro REDO são organizados em um anel, é extremamente importante que os primeiros e últimos arquivos de registro no conjunto (às vezes referidos como os arquivos de registro "cabeça" e "cauda", respectivamente) não se encontrem. Quando esses se aproximam muito próximos uns dos outros, o nó começa a abortar todas as transações que envolvem atualizações devido à falta de espaço para novos registros de registro.

Um registro de log `REDO` não é removido até que ambos os pontos de verificação locais exigidos tenham sido concluídos desde que o registro de log foi inserido. A frequência de verificação é determinada pelo seu próprio conjunto de parâmetros de configuração discutidos em outras partes deste capítulo.

O valor padrão do parâmetro é 16, o que, por padrão, significa 16 conjuntos de 4 arquivos de 16 MB, totalizando 1024 MB. O tamanho dos arquivos de registro individuais é configurável usando o parâmetro `FragmentLogFileSize`. Em cenários que exigem muitas atualizações, o valor para `NoOfFragmentLogFiles` pode precisar ser ajustado para 300 ou até mais alto para fornecer espaço suficiente para os registros REDO.

Se o checkpointing for lento e houver muitas gravações no banco de dados, de modo que os arquivos de registro estejam cheios e a cauda do registro não possa ser cortada sem comprometer a recuperação, todas as transações de atualização serão abortadas com o código de erro interno 410 (`Out of log file space temporarily`). Esta condição prevalece até que um checkpoint seja concluído e a cauda do registro possa ser movida para frente.

Importante

Este parâmetro não pode ser alterado “em tempo real”; você deve reiniciar o nó usando `--initial`. Se você deseja alterar esse valor para todos os nós de dados em um clúster em execução, você pode fazer isso usando um reinício de nó rolante (usando `--initial` ao iniciar cada nó de dados).

* `RecoveryWork`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Porcentagem de sobrecarga de armazenamento para arquivos LCP. Este parâmetro só tem efeito quando `EnablePartialLcp` é verdadeiro, ou seja, só quando os pontos de verificação locais parciais são habilitados. Um valor maior significa:

+ Menos registros são escritos para cada LCP, os LCPs utilizam mais espaço

+ Mais trabalho é necessário durante os reinícios

Um valor menor para `RecoveryWork` significa:

+ Mais registros são escritos durante cada LCP, mas os LCPs exigem menos espaço no disco.

+ Menos trabalho durante o reinício e, portanto, reinícios mais rápidos, às custas de mais trabalho durante as operações normais

Por exemplo, definir `RecoveryWork` para 60 significa que o tamanho total de um LCP é aproximadamente 1 + 0,6 = 1,6 vezes o tamanho dos dados que serão verificados. Isso significa que é necessário realizar 60% mais trabalho durante a fase de restauração de um reinício em comparação com o trabalho realizado durante um reinício que usa pontos de verificação completos. (Isso é mais do que compensado durante outras fases do reinício, de modo que o reinício como um todo ainda é mais rápido ao usar LCPs parciais do que ao usar LCPs completos.) Para não preencher o log de refazer, é necessário escrever na taxa de 1 + (1 / `RecoveryWork`) vezes a taxa de mudanças de dados durante os pontos de verificação — assim, quando `RecoveryWork` = 60, é necessário escrever aproximadamente 1 + (1 / 0,6 ) = 2,67 vezes a taxa de mudança. Em outras palavras, se as mudanças estão sendo escritas na taxa de 10 Mbytes por segundo, o ponto de verificação precisa ser escrito aproximadamente na taxa de 26,7 Mbytes por segundo.

Definir `RecoveryWork` = 40 significa que apenas 1,4 vezes o tamanho total do LCP é necessário (e, assim, a fase de restauração leva 10 a 15 por cento menos tempo. Neste caso, a taxa de escrita do ponto de verificação é 3,5 vezes a taxa de mudança.

A distribuição de fonte do NDB inclui um programa de teste para simular LCPs. `lcp_simulator.cc` pode ser encontrado em `storage/ndb/src/kernel/blocks/backup/`. Para compilar e executá-lo em plataformas Unix, execute os comandos mostrados aqui:

  ```sql
  $> gcc lcp_simulator.cc
  $> ./a.out
  ```

Este programa não tem outras dependências além de `stdio.h`, e não requer uma conexão a um cluster NDB ou a um servidor MySQL. Por padrão, ele simula 300 LCPs (três conjuntos de 100 LCPs, cada um consistindo em inserções, atualizações e excluíções, respectivamente), relatando o tamanho do LCP após cada uma delas. Você pode alterar a simulação alterando os valores de `recovery_work`, `insert_work` e `delete_work` na fonte e recompilar. Para mais informações, consulte a fonte do programa.

* `InsertRecoveryWork`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Porcentagem de `RecoveryWork` usada para as strings inseridas. Um valor mais alto aumenta o número de gravações durante um ponto de verificação local e diminui o tamanho total do LCP. Um valor mais baixo diminui o número de gravações durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo. Este parâmetro tem efeito apenas quando `EnablePartialLcp` é verdadeiro, ou seja, apenas quando os pontos de verificação locais parciais são habilitados.

* `EnableRedoControl`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Ative a velocidade de verificação adaptativa para controlar o uso do log de revisão. Defina `false` para desabilitar (o padrão). Definir `EnablePartialLcp` para `false` também desativa o cálculo adaptativo.

Quando habilitado, `EnableRedoControl` permite que os nós de dados tenham maior flexibilidade em relação à taxa na qual escrevem LCPs no disco. Mais especificamente, habilitar este parâmetro significa que taxas de escrita mais altas podem ser empregadas, de modo que os LCPs possam ser concluídos e os logs de refazer possam ser cortados mais rapidamente, reduzindo assim o tempo de recuperação e os requisitos de espaço em disco. Esta funcionalidade permite que os nós de dados utilizem melhor a taxa mais alta de E/S e a maior largura de banda disponíveis em dispositivos e protocolos de armazenamento de estado sólido modernos, como unidades de estado sólido (SSDs) que utilizam Memória Não Volátil Express (NVMe).

O parâmetro atualmente tem como padrão `false` (desativado) devido ao fato de que `NDB` ainda é amplamente implantado em sistemas cujos I/O ou largura de banda estão limitados em relação aos que empregam tecnologia de estado sólido, como aqueles que utilizam discos rígidos convencionais (HDDs). Em configurações como essas, o mecanismo `EnableRedoControl` pode facilmente fazer com que o subsistema de I/O fique saturado, aumentando os tempos de espera para a entrada e saída do nó de dados. Em particular, isso pode causar problemas com as tabelas de Dados de Disco NDB que têm espaços de tabela ou grupos de arquivos de registro compartilhando um subsistema de IO limitado com LCP e arquivos de registro de refazer do nó de dados; tais problemas podem incluir falha do nó ou do clúster devido a erros de parada do GCP.

**Objetos de metadados.** O próximo conjunto de parâmetros `[ndbd]` define os tamanhos dos pools para objetos de metadados, usados para definir o número máximo de atributos, tabelas, índices e objetos de gatilho usados por índices, eventos e replicação entre clusters.

Nota

Esses atuam apenas como "sugestões" para o grupo, e quaisquer que não sejam especificados retornam aos valores padrão mostrados.

* `MaxNoOfAttributes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro define um número máximo sugerido de atributos que podem ser definidos no clúster; como `MaxNoOfTables`, ele não é destinado a funcionar como um limite superior rígido.

(Em versões mais antigas do NDB Cluster, esse parâmetro era, às vezes, tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e, às vezes, levava a confusão quando era possível [ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfAttributes` atributos.)

O valor padrão é 1000, com o valor mínimo possível sendo 32. O máximo é 4294967039. Cada atributo consome cerca de 200 bytes de armazenamento por nó devido ao fato de que todos os metadados são totalmente replicados nos servidores.

Ao definir `MaxNoOfAttributes`, é importante se preparar antecipadamente para quaisquer declarações `ALTER TABLE` que você possa querer realizar no futuro. Isso ocorre porque, durante a execução de `ALTER TABLE` em uma tabela de Cluster, são usados 3 vezes o número de atributos do que na tabela original, e uma boa prática é permitir o dobro desse valor. Por exemplo, se a tabela NDB Cluster que tem o maior número de atributos (*`greatest_number_of_attributes`*) tiver 100 atributos, um bom ponto de partida para o valor de `MaxNoOfAttributes` seria `6 * greatest_number_of_attributes = 600`.

Você também deve estimar o número médio de atributos por tabela e multiplicar esse valor por `MaxNoOfTables`. Se esse valor for maior que o valor obtido no parágrafo anterior, você deve usar o valor maior.

Supondo que você possa criar todas as tabelas desejadas sem problemas, você também deve verificar se esse número é suficiente, tentando um `ALTER TABLE` real após configurar o parâmetro. Se isso não for bem-sucedido, aumente `MaxNoOfAttributes` por outro múltiplo de `MaxNoOfTables` e teste novamente.

* `MaxNoOfTables`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Um objeto de tabela é alocado para cada tabela e para cada índice de hash único no clúster. Este parâmetro define um número máximo sugerido de objetos de tabela para o clúster como um todo; como `MaxNoOfAttributes`, ele não é destinado a funcionar como um limite superior rígido.

(Em versões mais antigas do NDB Cluster, esse parâmetro era, às vezes, tratado como um limite rígido para certas operações. Isso causava problemas com a Replicação do NDB Cluster, quando era possível criar mais tabelas do que poderiam ser replicadas, e, às vezes, levava a confusão quando era possível [ou não possível, dependendo das circunstâncias] criar mais de `MaxNoOfTables` tabelas.)

Para cada atributo que tem um tipo de dados `BLOB`, uma tabela extra é usada para armazenar a maioria dos dados `BLOB`. Essas tabelas também devem ser consideradas ao definir o número total de tabelas.

O valor padrão deste parâmetro é 128. O mínimo é 8 e o máximo é 20320. Cada objeto de tabela consome aproximadamente 20 KB por nó.

Nota

A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfOrderedIndexes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Para cada índice solicitado no clúster, um objeto é alocado, descrevendo o que está sendo indexado e seus segmentos de armazenamento. Por padrão, cada índice assim definido também define um índice ordenado. Cada índice único e chave primária tem tanto um índice ordenado quanto um índice de hash. `MaxNoOfOrderedIndexes` define o número total de índices ordenados que podem ser utilizados no sistema em qualquer momento.

O valor padrão deste parâmetro é 128. Cada objeto de índice consome aproximadamente 10 KB de dados por nó.

Nota

A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfUniqueHashIndexes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Para cada índice único que não é uma chave primária, é alocada uma tabela especial que mapeia a chave única para a chave primária da tabela indexada. Por padrão, um índice ordenado também é definido para cada índice único. Para evitar isso, você deve especificar a opção `USING HASH` ao definir o índice único.

O valor padrão é 64. Cada índice consome aproximadamente 15 KB por nó.

Nota

A soma de `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes` não deve exceder `232 − 2` (4294967294).

* `MaxNoOfTriggers`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Atualizações internas, inserções e eliminações são alocadas para cada índice de hash único. (Isso significa que três gatilhos são criados para cada índice de hash único.) No entanto, um índice *ordenado* requer apenas um único objeto de gatilho. Os backups também utilizam três objetos de gatilho para cada tabela normal no clúster.

A replicação entre clusters também utiliza gatilhos internos.

Este parâmetro define o número máximo de objetos de gatilho no clúster.

O valor padrão é 768.

* `MaxNoOfSubscriptions`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Cada tabela `NDB` em um NDB Cluster requer uma assinatura no kernel NDB. Para alguns aplicativos da API NDB, pode ser necessário ou desejável alterar esse parâmetro. No entanto, para uso normal com servidores MySQL atuando como nós SQL, não há necessidade de fazer isso.

O valor padrão para `MaxNoOfSubscriptions` é 0, que é tratado como igual a `MaxNoOfTables`. Cada assinatura consome 108 bytes.

* `MaxNoOfSubscribers`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro é de interesse apenas quando se usa a Replicação do NDB Cluster. O valor padrão é 0, que é tratado como `2 * MaxNoOfTables`; ou seja, há uma assinatura por tabela `NDB` para cada um dos dois servidores MySQL (um atuando como fonte de replicação e o outro como replica). Cada assinante usa 16 bytes de memória.

Ao usar replicação circular, replicação de múltiplas fontes e outras configurações de replicação que envolvem mais de 2 servidores MySQL, você deve aumentar este parâmetro para o número de processos `mysqld` incluídos na replicação (isso é frequentemente, mas nem sempre, o mesmo número de clústeres). Por exemplo, se você tiver uma configuração de replicação circular usando três NDB Cluster s, com um `mysqld` conectado a cada clúster, e cada um desses processos `mysqld` atuar como fonte e como replica, você deve definir `MaxNoOfSubscribers` igual a `3 * MaxNoOfTables`.

Para mais informações, consulte a Seção 21.7, “Replicação de aglomerado NDB”.

* `MaxNoOfConcurrentSubOperations`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Este parâmetro define um limite para o número de operações que podem ser realizadas por todos os nós da API no clúster de uma só vez. O valor padrão (256) é suficiente para operações normais e pode precisar ser ajustado apenas em cenários em que há muitos nós da API, cada um executando um grande volume de operações simultaneamente.

**Parâmetros booleanos.** O comportamento dos nós de dados também é afetado por um conjunto de parâmetros `[ndbd]` que assumem valores booleanos. Esses parâmetros podem ser especificados individualmente como `TRUE` ao serem definidos iguais a `1` ou `Y`, e como `FALSE` ao serem definidos iguais a `0` ou `N`.

* `CompressedLCP`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Definir este parâmetro para `1` faz com que os arquivos de ponto de verificação locais sejam comprimidos. A compressão utilizada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de ponto de verificação não comprimidos. LCPs comprimidos podem ser habilitados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

Importante

Você não pode restaurar um ponto de verificação local compactado em um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

O valor padrão é `0` (desativado).

Nas plataformas Windows, este parâmetro não tem efeito no NDB 7.5 ou no NDB 7.6.

* `CrashOnCorruptedTuple`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Quando este parâmetro é ativado, ele obriga um nó de dados a ser desligado sempre que encontrar uma tupla corrompida. No NDB 7.5, ele é ativado por padrão.

* `Diskless`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

É possível especificar tabelas do NDB Cluster como sem disco, o que significa que as tabelas não são verificadas em disco e que não ocorre nenhum registro. Tais tabelas existem apenas na memória principal. Uma consequência do uso de tabelas sem disco é que nem as tabelas nem os registros nessas tabelas sobrevivem a um acidente. No entanto, ao operar no modo sem disco, é possível executar **ndbd** em um computador sem disco.

Importante

Essa característica faz com que *todo* o clúster opere no modo sem disco.

Quando essa funcionalidade é habilitada, o backup online do cluster é desativado. Além disso, um início parcial do cluster não é possível.

`Diskless` é desativado por padrão.

* `LateAlloc`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Alocar memória para este nó de dados após a conexão com o servidor de gerenciamento ter sido estabelecida. Ativado por padrão.

* `LockPagesInMainMemory`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Para vários sistemas operacionais, incluindo Solaris e Linux, é possível bloquear um processo na memória e, assim, evitar qualquer troca para o disco. Isso pode ser usado para ajudar a garantir as características em tempo real do clúster.

Este parâmetro assume um dos valores inteiros `0`, `1` ou `2`, que atuam conforme mostrado na lista a seguir:

+ `0`: Desabilita o bloqueio. Este é o valor padrão.

+ `1`: Realiza o bloqueio após a alocação de memória para o processo.

+ `2`: Realiza o bloqueio antes da alocação de memória para o processo.

Se o sistema operacional não estiver configurado para permitir que usuários não privilegiados bloqueiem páginas, então o processo do nó de dados que utiliza este parâmetro pode ter que ser executado como raiz do sistema. (`LockPagesInMainMemory` usa a função `mlockall`. A partir do kernel Linux 2.6.9, usuários não privilegiados podem bloquear a memória conforme limitado por `max locked memory`. Para mais informações, consulte **ulimit -l** e <http://linux.die.net/man/2/mlock>).

Nota

Em versões mais antigas do NDB Cluster, esse parâmetro era um Booleano. `0` ou `false` era o ajuste padrão, e o bloqueio desativado. `1` ou `true` habilitava o bloqueio do processo após sua memória ser alocada. O NDB Cluster 7.5 trata `true` ou `false` para o valor desse parâmetro como um erro.

Importante

Começando com `glibc` 2.10, `glibc` utiliza arenas por thread para reduzir a disputa por bloqueio em um pool compartilhado, que consome memória real. Em geral, um processo de nó de dados não precisa de arenas por thread, uma vez que ele não realiza nenhuma alocação de memória após a inicialização. (Essa diferença nos alocadores não parece afetar significativamente o desempenho.)

O comportamento `glibc` é destinado a ser configurável através da variável de ambiente `MALLOC_ARENA_MAX`, mas um erro nesse mecanismo antes do `glibc` 2.16 significou que essa variável não poderia ser definida para menos de 8, de modo que a memória desperdiçada não poderia ser recuperada. (Bug #15907219; veja também <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> para mais informações sobre esse problema.)

Uma solução possível para este problema é usar a variável de ambiente `LD_PRELOAD` para pré-carregar uma biblioteca de alocação de memória `jemalloc` para substituir aquela fornecida com `glibc`.

* `ODirect`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Ativação deste parâmetro faz com que `NDB` tente usar `O_DIRECT` para gravações de LCP, backups e logs de redo, geralmente reduzindo o uso de **kswapd** e CPU. Ao usar o NDB Cluster no Linux, ative `ODirect` se você estiver usando um kernel 2.6 ou posterior.

`ODirect` é desativado por padrão.

* `ODirectSyncFlag`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Quando este parâmetro é ativado, as gravações do log de refazer são realizadas de forma que cada escrita no sistema de arquivos concluída é tratada como uma chamada para `fsync`. O ajuste deste parâmetro é ignorado se pelo menos uma das seguintes condições for verdadeira:

+ `ODirect` não está habilitado.

+ `InitFragmentLogFiles` é definido como `SPARSE`.

Desativado por padrão.

* `RestartOnErrorInsert`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Essa funcionalidade é acessível apenas ao construir a versão de depuração, onde é possível inserir erros na execução de blocos individuais de código como parte do teste.

Essa funcionalidade é desativada por padrão.

* `StopOnError`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro especifica se um processo de nó de dados deve sair ou realizar um reinício automático quando uma condição de erro for encontrada.

O valor padrão deste parâmetro é 1; isso significa que, por padrão, um erro faz com que o processo do nó de dados seja interrompido.

Quando um erro é encontrado e `StopOnError` é 0, o processo do nó de dados é reiniciado.

Antes do NDB Cluster 7.5.5, se o processo do nó de dados sair de forma não controlada (devido, por exemplo, ao desempenho de **kill -9** no processo do nó de dados enquanto realiza uma consulta, ou a uma falha de segmentação), e `StopOnError` estiver definido como 0, o processo do anjo tenta reiniciá-lo exatamente da mesma maneira que foi iniciado anteriormente — ou seja, usando as mesmas opções de inicialização que foram empregadas na última vez que o nó foi iniciado. Assim, se o processo do nó de dados foi originalmente iniciado usando a opção `--initial`, ele também é reiniciado com `--initial`. Isso significa que, nesses casos, se a falha ocorrer em um número suficiente de nós de dados em um intervalo muito curto, o efeito é o mesmo como se tivesse realizado um reinício inicial de todo o clúster, levando à perda de todos os dados. Esse problema é resolvido no NDB Cluster 7.5.5 e em versões posteriores do NDB 7.5 (Bug #83510, Bug #24945638).

Os usuários do MySQL Cluster Manager devem notar que, quando `StopOnError` é igual a 1, isso impede que o agente do MySQL Cluster Manager reinicie quaisquer nós de dados após realizar seu próprio reinício e recuperação. Consulte Início e Parada do Agente no Linux, para obter mais informações.

* `UseShm`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Use conexões de memória compartilhada entre este nó de dados e o nó da API que também está sendo executado neste host. Defina para 1 para ativar.

Consulte a Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDBC Cluster”, para obter mais informações.

##### Controle de Temporizadores, Intervalos e Paginação de Disco

Há vários parâmetros `[ndbd]` que especificam tempos de espera e intervalos entre várias ações nos nós de dados do Cluster. A maioria dos valores de tempo de espera é especificada em milissegundos. Quaisquer exceções a isso são mencionadas quando aplicável.

* `TimeBetweenWatchDogCheck`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Para evitar que o thread principal fique preso em um loop infinito em algum momento, um thread "guarda-costas" verifica o thread principal. Este parâmetro especifica o número de milissegundos entre as verificações. Se o processo permanecer no mesmo estado após três verificações, o thread guarda-costas o termina.

Esse parâmetro pode ser facilmente alterado para fins de experimentação ou para se adaptar às condições locais. Pode ser especificado por nó, embora pareça haver pouca razão para isso.

O tempo de espera padrão é de 6000 milissegundos (6 segundos).

* `TimeBetweenWatchDogCheckInitial`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Isso é semelhante ao parâmetro `TimeBetweenWatchDogCheck`, exceto que `TimeBetweenWatchDogCheckInitial` controla o tempo que passa entre os verificações de execução dentro de um nó de armazenamento nas fases iniciais, durante as quais a memória é alocada.

O tempo de espera padrão é de 6000 milissegundos (6 segundos).

* `StartPartialTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro especifica o tempo que o grupo espera para que todos os nós de dados sejam iniciados antes de ser invocada a rotina de inicialização do grupo. Esse tempo de espera é usado para evitar uma inicialização parcial do grupo sempre que possível.

Este parâmetro é ignorado ao realizar um início inicial ou reinício inicial do clúster.

O valor padrão é de 30000 milissegundos (30 segundos). 0 desativa o tempo de espera, no caso em que o clúster só pode começar se todos os nós estiverem disponíveis.

* `StartPartitionedTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Se o clúster estiver pronto para começar após esperar `StartPartialTimeout` milissegundos, mas ainda possivelmente em um estado particionado, o clúster aguarda até que esse tempo limite também tenha passado. Se `StartPartitionedTimeout` estiver definido como 0, o clúster aguarda indefinidamente (232−1 ms, ou aproximadamente 49,71 dias).

Este parâmetro é ignorado ao realizar um início inicial ou reinício inicial do clúster.

O valor padrão no NDB 7.6 é 0; anteriormente, era 60000 (60 segundos).

* `StartFailureTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Se um nó de dados não completar sua sequência de inicialização dentro do tempo especificado por este parâmetro, a inicialização do nó falha. Definir este parâmetro para 0 (o valor padrão) significa que nenhum timeout de nó de dados é aplicado.

Para valores não nulos, esse parâmetro é medido em milissegundos. Para nós de dados que contêm quantidades extremamente grandes de dados, esse parâmetro deve ser aumentado. Por exemplo, no caso de um nó de dados que contém vários gigabytes de dados, pode ser necessário um período de até 10−15 minutos (ou seja, de 600000 a 1000000 milissegundos) para realizar o reinício de um nó.

* `StartNoNodeGroupTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Quando um nó de dados é configurado com `Nodegroup = 65536`, é considerado não estar atribuído a nenhum grupo de nós. Quando isso é feito, o clúster espera `StartNoNodegroupTimeout` milissegundos, depois trata esses nós como se tivessem sido adicionados à lista passada para a opção `--nowait-nodes`, e começa. O valor padrão é `15000` (ou seja, o servidor de gerenciamento espera 15 segundos). Definir este parâmetro igual a `0` significa que o clúster espera indefinidamente.

`StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no clúster; por essa razão, você deve sempre defini-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para nós de dados individuais.

Consulte a Seção 21.6.7, “Adicionar nós de dados do NDB Cluster Online”, para obter mais informações.

* `HeartbeatIntervalDbDb`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Um dos métodos principais para descobrir nós falhos é através do uso de batimentos cardíacos. Este parâmetro indica quantas vezes os sinais de batimento cardíaco são enviados e quantas vezes se espera recebê-los. Os batimentos cardíacos não podem ser desativados.

Após perder quatro intervalos de batimento cardíaco consecutivos, o nó é declarado morto. Assim, o tempo máximo para descobrir uma falha através do mecanismo de batimento cardíaco é cinco vezes o intervalo de batimento cardíaco.

O intervalo padrão de batimento cardíaco é de 5000 milissegundos (5 segundos). Este parâmetro não deve ser alterado drasticamente e não deve variar muito entre os nós. Se um nó usar 5000 milissegundos e o nó que o monitora usar 1000 milissegundos, obviamente o nó é declarado morto muito rapidamente. Este parâmetro pode ser alterado durante uma atualização de software online, mas apenas em incrementos pequenos.

Veja também Comunicação em rede e latência, bem como a descrição do parâmetro de configuração `ConnectCheckIntervalDelay`.

* `HeartbeatIntervalDbApi`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Cada nó de dados envia sinais de batimentos cardíacos para cada servidor MySQL (nó SQL) para garantir que permaneça em contato. Se um servidor MySQL não enviar um batimento cardíaco a tempo, ele é declarado "morto", nesse caso, todas as transações em andamento são concluídas e todos os recursos são liberados. O nó SQL não pode se reconectar até que todas as atividades iniciadas pela instância anterior do MySQL tenham sido concluídas. Os três critérios de batimentos cardíacos para essa determinação são os mesmos descritos em `HeartbeatIntervalDbDb`.

O intervalo padrão é de 1500 milissegundos (1,5 segundos). Esse intervalo pode variar entre os nós de dados individuais, pois cada nó de dados monitora os servidores MySQL conectados a ele, independentemente de todos os outros nós de dados.

Para mais informações, consulte Comunicação de rede e latência.

* `HeartbeatOrder`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Os nós de dados enviam batimentos cardíacos uns para os outros de forma circular, onde cada nó de dados monitora o anterior. Se um batimento cardíaco não for detectado por um dado nó de dados, este nó declara o nó de dados anterior no círculo como "morto" (ou seja, não mais acessível pelo clúster). A determinação de que um nó de dados está morto é feita globalmente; em outras palavras, uma vez que um nó de dados é declarado morto, ele é considerado como tal por todos os nós do clúster.

É possível que os batimentos cardíacos entre nós de dados que residem em diferentes hosts sejam muito lentos em comparação com os batimentos cardíacos entre outros pares de nós (por exemplo, devido a um intervalo de batimento cardíaco muito baixo ou a um problema temporário de conexão), de modo que um nó de dados seja declarado morto, embora o nó ainda possa funcionar como parte do clúster.

Nesse tipo de situação, pode ser que a ordem em que os batimentos cardíacos são transmitidos entre os nós de dados faça diferença em relação à declaração de um nó de dados como morto ou não. Se essa declaração ocorrer desnecessariamente, isso, por sua vez, pode levar à perda desnecessária de um grupo de nós e, assim, a um falha do clúster.

Considere uma configuração onde existem 4 nós de dados A, B, C e D em execução em 2 computadores hostis `host1` e `host2`, e que esses nós de dados compõem 2 grupos de nós, conforme mostrado na tabela a seguir:

**Tabela 21.9 Quatro nós de dados A, B, C, D, operando em dois computadores hospedeiros host1, host2; cada nó de dados pertence a um dos dois grupos de nós.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Suponha que os batimentos cardíacos sejam transmitidos na ordem A->B->C->D->A. Neste caso, a perda do batimento cardíaco entre os hosts faz com que o nó B declare o nó A morto e o nó C declare o nó B morto. Isso resulta na perda do Grupo de Nodos 0, e assim o clúster falha. Por outro lado, se a ordem de transmissão for A->B->D->C->A (e todas as outras condições permanecem como anteriormente declaradas), a perda do batimento cardíaco faz com que os nós A e D sejam declarados mortos; neste caso, cada grupo de nós tem um nó sobrevivente, e o clúster sobrevive.

O parâmetro de configuração `HeartbeatOrder` torna a ordem da transmissão de batimentos cardíacos configurável pelo usuário. O valor padrão para `HeartbeatOrder` é zero; permitindo que o valor padrão seja usado em todos os nós de dados, a ordem da transmissão de batimentos cardíacos é determinada por `NDB`. Se este parâmetro for usado, ele deve ser definido para um valor não nulo (máximo de 65535) para cada nó de dados no clúster, e este valor deve ser único para cada nó de dados; isso faz com que a transmissão de batimentos cardíacos prossiga do nó de dados para o nó de dados na ordem de seus valores de `HeartbeatOrder` do menor para o maior (e depois diretamente do nó de dados com o valor mais alto de `HeartbeatOrder` para o nó de dados com o valor mais baixo, para completar o círculo). Os valores não precisam ser consecutivos. Por exemplo, para forçar a ordem de transmissão de batimentos cardíacos A->B->D->C->A no cenário descrito anteriormente, você pode definir os valores de `HeartbeatOrder` conforme mostrado aqui:

**Tabela 21.10 Valores de HeartbeatOrder para forçar uma ordem de transição de batida de A->B->D->C->A.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Para usar este parâmetro para alterar a ordem de transmissão do batimento cardíaco em um NDB Cluster em execução, você deve primeiro definir `HeartbeatOrder` para cada nó de dados no cluster no arquivo de configuração global (`config.ini`) (ou arquivos). Para fazer a mudança entrar em vigor, você deve realizar uma das seguintes ações:

+ Um desligamento completo e reinício de todo o clúster.  
+ 2 reinicializações roláveis do clúster consecutivas. *Todos os nós devem ser reiniciados na mesma ordem em ambas as reinicializações roláveis*.

Você pode usar `DUMP 908` para observar o efeito desse parâmetro nos logs dos nós de dados.

* `ConnectCheckIntervalDelay`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Este parâmetro permite a verificação de conexão entre nós de dados após um deles ter falhado nas verificações de batimentos cardíacos por 5 intervalos de até `HeartbeatIntervalDbDb` milissegundos.

Um nó de dados que não responda mais dentro de um intervalo de `ConnectCheckIntervalDelay` milissegundos é considerado suspeito e é considerado morto após dois desses intervalos. Isso pode ser útil em configurações com problemas de latência conhecidos.

O valor padrão para este parâmetro é 0 (desativado).

* `TimeBetweenLocalCheckpoints`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro é uma exceção, pois não especifica um tempo de espera antes de iniciar um novo ponto de verificação local; em vez disso, é usado para garantir que os pontos de verificação locais não sejam realizados em um clúster onde ocorrem relativamente poucas atualizações. Na maioria dos clústeres com taxas de atualização elevadas, é provável que um novo ponto de verificação local seja iniciado imediatamente após o anterior ter sido concluído.

O tamanho de todas as operações de escrita executadas desde o início dos pontos de verificação locais anteriores é adicionado. Este parâmetro também é excecional porque é especificado como o logaritmo em base-2 do número de palavras de 4 bytes, de modo que o valor padrão 20 significa 4 MB (4 × 220) de operações de escrita, 21 significaria 8 MB, e assim por diante até um valor máximo de 31, que equivale a 8 GB de operações de escrita.

Todas as operações de escrita no clúster são somadas. Definir `TimeBetweenLocalCheckpoints` para 6 ou menos significa que os pontos de verificação locais são executados continuamente sem pausa, independentemente da carga de trabalho do clúster.

* `TimeBetweenGlobalCheckpoints`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Quando uma transação é comprometida, ela é comprometida na memória principal em todos os nós nos quais os dados são espelhados. No entanto, os registros do log de transação não são apagados no disco como parte do comprometimento. O raciocínio por trás desse comportamento é que ter a transação comprometida com segurança em pelo menos duas máquinas hospedeiras autônomas deve atender a padrões razoáveis de durabilidade.

É também importante garantir que até os piores casos — um colapso completo do clúster — sejam tratados corretamente. Para garantir que isso aconteça, todas as transações que ocorrem dentro de um intervalo determinado são colocadas em um ponto de verificação global, que pode ser considerado um conjunto de transações comprometidas que foram descarregadas no disco. Em outras palavras, como parte do processo de comprometimento, uma transação é colocada em um grupo de registros de ponto de verificação global. Mais tarde, os registros de log desse grupo são descarregados no disco e, em seguida, o grupo inteiro de transações é comprometido com segurança no disco em todos os computadores do clúster.

Este parâmetro define o intervalo entre os pontos de verificação globais. O padrão é de 2000 milissegundos.

* `TimeBetweenGlobalCheckpointsTimeout`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Este parâmetro define o tempo máximo mínimo entre os pontos de verificação globais. O padrão é de 120000 milissegundos.

* `TimeBetweenEpochs`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Este parâmetro define o intervalo entre as épocas de sincronização para a Replicação do NDB Cluster. O valor padrão é de 100 milissegundos.

`TimeBetweenEpochs` faz parte da implementação de "micro-GCPs", que podem ser usadas para melhorar o desempenho da Replicação de NDB Cluster.

* `TimeBetweenEpochsTimeout`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Este parâmetro define um tempo de espera para as épocas de sincronização para a Replicação do NDB Cluster. Se um nó não conseguir participar em um ponto de verificação global dentro do tempo determinado por este parâmetro, o nó é desligado. O valor padrão é 0; em outras palavras, o tempo de espera é desativado.

`TimeBetweenEpochsTimeout` faz parte da implementação de "micro-GCPs", que podem ser usadas para melhorar o desempenho da Replicação de NDB Cluster.

O valor atual deste parâmetro e um aviso são escritos no log do cluster sempre que uma salva no GCP leva mais de 1 minuto ou um compromisso no GCP leva mais de 10 segundos.

Definir esse parâmetro como zero tem o efeito de desabilitar as paradas do GCP causadas por timeouts de salvamento, timeouts de commit ou ambos. O valor máximo possível para esse parâmetro é 256000 milissegundos.

* `MaxBufferedEpochs`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>9

O número de épocas não processadas pelas quais um nó assinante pode ficar para trás. Exceder esse número faz com que um assinante que fica para trás seja desconectado.

O valor padrão de 100 é suficiente para a maioria das operações normais. Se um nó assinante estiver atrasado o suficiente para causar desconexões, geralmente isso ocorre devido a problemas de rede ou de agendamento em relação a processos ou threads. (Em raras circunstâncias, o problema pode ser devido a um bug no cliente `NDB`. Pode ser desejável definir o valor menor que o padrão quando as épocas são mais longas.

A desconexão impede que os problemas do cliente afetem o serviço do nó de dados, que fica sem memória para bufferizar dados e, eventualmente, seja desligado. Em vez disso, apenas o cliente é afetado como resultado da desconexão (por exemplo, eventos de lacuna no log binário), forçando o cliente a se reconectar ou reiniciar o processo.

* `MaxBufferedEpochBytes`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>0

O número total de bytes alocados para buffer de épocas por este nó.

* `TimeBetweenInactiveTransactionAbortCheck`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>1

O gerenciamento de tempo de espera é realizado verificando um temporizador em cada transação uma vez para cada intervalo especificado por este parâmetro. Assim, se este parâmetro for definido como 1000 milissegundos, cada transação é verificada para tempo de espera uma vez por segundo.

O valor padrão é de 1000 milissegundos (1 segundo).

* `TransactionInactiveTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Este parâmetro indica o tempo máximo permitido para o intervalo entre operações na mesma transação antes de a transação ser abortada.

O padrão para este parâmetro é `4G` (também o máximo). Para um banco de dados em tempo real que precisa garantir que nenhuma transação mantenha os bloqueios por muito tempo, este parâmetro deve ser definido para um valor relativamente pequeno. Definí-lo como 0 significa que o aplicativo nunca expira. A unidade é milissegundo.

* `TransactionDeadlockDetectionTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Quando um nó executa uma consulta que envolve uma transação, o nó espera que os outros nós no clúster respondam antes de continuar. Este parâmetro define o tempo que a transação pode gastar executando dentro de um nó de dados, ou seja, o tempo que o coordenador da transação espera que cada nó de dados que participa da transação execute uma solicitação.

Uma falha na resposta pode ocorrer por qualquer uma das seguintes razões:

+ O nó está "morto"  
+ A operação entrou em uma fila de bloqueio  
+ O nó que solicitou a realização da ação pode estar sobrecarregado.

Este parâmetro de tempo de espera indica quanto tempo o coordenador de transação espera para a execução da consulta por outro nó antes de abortar a transação, e é importante tanto para o tratamento de falhas de nó quanto para a detecção de impasses.

O valor padrão do tempo de espera é de 1200 milissegundos (1,2 segundos).

O mínimo para este parâmetro é de 50 milissegundos.

* `DiskSyncSize`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este é o número máximo de bytes a serem armazenados antes de descartar os dados para um arquivo de ponto de verificação local. Isso é feito para evitar o bufferamento de escrita, o que pode impedir significativamente o desempenho. Este parâmetro *não* é destinado a substituir `TimeBetweenLocalCheckpoints`.

Nota

Quando o `ODirect` está habilitado, não é necessário definir o `DiskSyncSize`;, na verdade, nesses casos, seu valor é simplesmente ignorado.

O valor padrão é 4M (4 megabytes).

* `MaxDiskWriteSpeed`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Defina a taxa máxima de gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup quando não houver reinício (por este nó de dados ou qualquer outro nó de dados) neste NDB Cluster.

Para definir a taxa máxima de escrita de disco permitida enquanto este nó de dados está sendo reiniciado, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de escrita de disco permitida enquanto outros nós de dados estão sendo reiniciados, use `MaxDiskWriteSpeedOtherNodeRestart`. A velocidade mínima para a escrita de disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOtherNodeRestart`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Defina a taxa máxima de gravação em disco, em bytes por segundo, por meio de pontos de verificação locais e operações de backup quando um ou mais nós de dados neste NDB Cluster estão sendo reiniciados, exceto este nó.

Para definir a taxa máxima de escrita de disco permitida enquanto este nó de dados está sendo reiniciado, use `MaxDiskWriteSpeedOwnRestart`. Para definir a taxa máxima de escrita de disco permitida quando nenhum nó de dados está sendo reiniciado em nenhum lugar do clúster, use `MaxDiskWriteSpeed`. A velocidade mínima para a escrita de disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOwnRestart`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Defina a taxa máxima de gravação em disco, em bytes por segundo, por pontos de verificação locais e operações de backup enquanto este nó de dados estiver sendo reiniciado.

Para definir a taxa máxima de escrita em disco permitida enquanto outros nós de dados estão sendo reiniciados, use `MaxDiskWriteSpeedOtherNodeRestart`. Para definir a taxa máxima de escrita em disco permitida quando nenhum nó de dados está sendo reiniciado em nenhum lugar do clúster, use `MaxDiskWriteSpeed`. A velocidade mínima para a escrita em disco por todos os LCPs e operações de backup pode ser ajustada definindo `MinDiskWriteSpeed`.

* `MinDiskWriteSpeed`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Defina a taxa mínima para gravação em disco, em bytes por segundo, por meio de pontos de verificação locais e operações de backup.

As taxas máximas de gravação de disco permitidas para LCPs e backups sob várias condições são ajustáveis usando os parâmetros `MaxDiskWriteSpeed`, `MaxDiskWriteSpeedOwnRestart` e `MaxDiskWriteSpeedOtherNodeRestart`. Consulte as descrições desses parâmetros para obter mais informações.

* `ApiFailureHandlingTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Especifica o tempo máximo (em segundos) que o nó de dados espera que o tratamento da falha do nó da API seja concluído antes de escalar para o tratamento da falha do nó de dados.

Adicionado em NDB 7.6.34.

* `ArbitrationTimeout`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro especifica o tempo que os nós de dados esperam por uma resposta do árbitro a uma mensagem de arbitragem. Se isso for excedido, assume-se que a rede se dividiu.

O valor padrão é de 7.500 milissegundos (7,5 segundos).

* `Arbitration`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>1

O parâmetro `Arbitration` permite a escolha de esquemas de arbitragem, correspondendo a um dos 3 valores possíveis para este parâmetro:

+ **Padrão.** Isso permite que a arbitragem prossiga normalmente, conforme determinado pelas configurações do `ArbitrationRank` para os nós de gerenciamento e API. Esse é o valor padrão.

+ **Desativado.** Definir `Arbitration = Disabled` na seção `[ndbd default]` do arquivo `config.ini` para realizar a mesma tarefa que definir `ArbitrationRank` para 0 em todos os nós de gerenciamento e API. Quando `Arbitration` é definido dessa maneira, quaisquer configurações de `ArbitrationRank` são ignoradas.

+ **WaitExternal.** O parâmetro `Arbitration` também permite configurar a arbitragem de forma que o clúster espere até que o tempo determinado por `ArbitrationTimeout` tenha passado para que um aplicativo de gerenciamento de clúster externo realize a arbitragem em vez de lidar com a arbitragem internamente. Isso pode ser feito definindo `Arbitration = WaitExternal` na seção `[ndbd default]` do arquivo `config.ini`. Para obter os melhores resultados com a configuração `WaitExternal`, é recomendável que `ArbitrationTimeout` seja duas vezes o intervalo necessário pelo gerenciador de clúster externo para realizar a arbitragem.

Importante

Este parâmetro deve ser usado apenas na seção `[ndbd default]` do arquivo de configuração do clúster. O comportamento do clúster não é especificado quando `Arbitration` é definido com diferentes valores para nós de dados individuais.

* `RestartSubscriberConnectTimeout`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Este parâmetro determina o tempo que um nó de dados espera para os nós da API se conectarem. Quando esse tempo expira, quaisquer nós da API "faltantes" são desconectados do clúster. Para desabilitar esse tempo limite, defina `RestartSubscriberConnectTimeout` como 0.

Embora este parâmetro seja especificado em milissegundos, o próprio tempo de espera é resolvido para o próximo segundo inteiro maior.

O intervalo de batimento cardíaco entre os nós de gerenciamento e os nós de dados é sempre de 100 milissegundos e não é configurável.

**Buffering e registro.** Vários parâmetros de configuração do `[ndbd]` permitem que o usuário avançado tenha mais controle sobre os recursos utilizados pelos processos do nó e ajuste vários tamanhos de buffer conforme necessário.

Esses buffers são usados como interfaces para o sistema de arquivos ao gravar registros de log no disco. Se o nó estiver em modo sem disco, esses parâmetros podem ser definidos para seus valores mínimos sem penalidade, devido ao fato de que as gravações em disco são "falsas" pela camada de abstração do sistema de arquivos do motor de armazenamento `NDB`.

* `UndoIndexBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Este parâmetro anteriormente definia o tamanho do buffer do índice de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

* `UndoDataBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro anteriormente definia o tamanho do buffer de dados de desfazer, mas não tem efeito nas versões atuais do NDB Cluster.

* `RedoBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Todas as atividades de atualização também precisam ser registradas. O registro REDO permite refazer essas atualizações sempre que o sistema é reiniciado. O algoritmo de recuperação NDB utiliza um ponto de verificação "difuso" dos dados juntamente com o registro UNDO e, em seguida, aplica o registro REDO para reproduzir todas as alterações até o ponto de restauração.

`RedoBuffer` define o tamanho do buffer no qual o log do REDO é escrito. O valor padrão é de 32 MB; o valor mínimo é de 1 MB.

Se esse buffer for muito pequeno, o motor de armazenamento `NDB` emite o código de erro 1221 (overloaded buffers de registro REDO). Por essa razão, você deve ter cuidado se tentar diminuir o valor de `RedoBuffer` como parte de uma alteração online na configuração do clúster.

**ndbmtd**") aloca um buffer separado para cada thread do LDM (ver `ThreadConfig`). Por exemplo, com 4 threads do LDM, um nó de dados **ndbmtd**") possui, na verdade, 4 buffers e aloca `RedoBuffer` bytes para cada um deles, totalizando `4 * RedoBuffer` bytes.

* `EventLogBufferSize`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>6

Controla o tamanho do buffer circular usado para eventos de registro NDB dentro dos nós de dados.

**Controle de mensagens de registro.** Ao gerenciar o clúster, é muito importante ser capaz de controlar o número de mensagens de registro enviadas para o `stdout`. Para cada categoria de evento, há 16 níveis de evento possíveis (numerados de 0 a 15). Definir o relatório de eventos para uma categoria de evento dada no nível 15 significa que todos os relatórios de eventos nessa categoria são enviados para `stdout`; definindo-o como 0 significa que não há relatórios de eventos feitos nessa categoria.

Por padrão, apenas a mensagem de inicialização é enviada para `stdout`, com os demais níveis padrão de relatórios de eventos sendo definidos como 0. A razão para isso é que essas mensagens também são enviadas ao log do clúster do servidor de gerenciamento.

Um conjunto análogo de níveis pode ser definido para o cliente de gerenciamento, para determinar quais níveis de evento devem ser registrados no log do clúster.

* `LogLevelStartup`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>7

O nível de relatórios para eventos gerados durante o início do processo.

O nível padrão é 1.

* `LogLevelShutdown`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>8

O nível de relatório para eventos gerados como parte de um desligamento elegante de um nó.

O nível padrão é 0.

* `LogLevelStatistic`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster; cada nó de dados deve ser reiniciado com<code>--initial</code>. (NDB 7.5.0)</p></td> </tr></tbody></table>9

O nível de relatórios para eventos estatísticos, como número de leituras da chave primária, número de atualizações, número de inserções, informações relacionadas ao uso do buffer, e assim por diante.

O nível padrão é 0.

* `LogLevelCheckpoint`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>00

O nível de relatórios para eventos gerados por pontos de verificação locais e globais.

O nível padrão é 0.

* `LogLevelNodeRestart`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>01

O nível de relatórios para eventos gerados durante o reinício do nó.

O nível padrão é 0.

* `LogLevelConnection`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>02

O nível de relatórios para eventos gerados por conexões entre nós do cluster.

O nível padrão é 0.

* `LogLevelError`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>03

O nível de relatórios para eventos gerados por erros e avisos pelo clúster como um todo. Esses erros não causam falha em nenhum nó, mas ainda são considerados dignos de serem relatados.

O nível padrão é 0.

* `LogLevelCongestion`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>04

O nível de relatórios para eventos gerados por congestionamento. Esses erros não causam falha no nó, mas ainda são considerados dignos de serem relatados.

O nível padrão é 0.

* `LogLevelInfo`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>05

O nível de relatórios para eventos gerados para informações sobre o estado geral do clúster.

O nível padrão é 0.

* `MemReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>06

Este parâmetro controla a frequência com que os relatórios de uso da memória dos nós de dados são registrados no log do clúster; é um valor inteiro que representa o número de segundos entre os relatórios.

O uso da memória de dados e da memória de índice de cada nó de dados é registrado tanto como uma porcentagem quanto como o número de páginas de 32 KB do `DataMemory` e (NDB 7.5 e versões anteriores) `IndexMemory`, respectivamente, definidos no arquivo `config.ini`. Por exemplo, se `DataMemory` for igual a 100 MB e um dado nó de dados estiver usando 50 MB para armazenamento de memória de dados, a string correspondente no log do clúster pode parecer assim:

  ```sql
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

`MemReportFrequency` não é um parâmetro obrigatório. Se for usado, pode ser definido para todos os nós de dados do cluster na seção `[ndbd default]` de `config.ini`, e também pode ser definido ou sobrescrito para nós de dados individuais nas seções correspondentes `[ndbd]` do arquivo de configuração. O valor mínimo — que também é o valor padrão — é 0, no qual caso os relatórios de memória são registrados apenas quando o uso de memória atinge certos porcentagens (80%, 90% e 100%), conforme mencionado na discussão sobre eventos estatísticos na Seção 21.6.3.2, “Eventos de registro do NDB Cluster”.

* `StartupStatusReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>07

Quando um nó de dados é iniciado com o `--initial`, ele inicializa o arquivo de log de refazer durante a Fase de Início 4 (veja a Seção 21.6.4, “Resumo dos Fases de Início do NDB Cluster”). Quando valores muito grandes são definidos para `NoOfFragmentLogFiles`, `FragmentLogFileSize` ou ambos, essa inicialização pode levar um longo tempo. Você pode forçar que os relatórios sobre o progresso desse processo sejam registrados periodicamente, por meio do parâmetro de configuração `StartupStatusReportFrequency`. Neste caso, o progresso é relatado no log do cluster, em termos de número de arquivos e quantidade de espaço que foram inicializados, conforme mostrado aqui:

  ```sql
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

Esses relatórios são registrados a cada `StartupStatusReportFrequency` segundos durante a Fase 4 de Início. Se `StartupStatusReportFrequency` for 0 (o padrão), então os relatórios são escritos no log do clúster apenas no início e no término do processo de inicialização do arquivo de log de refazer.

##### Parâmetros de depuração do nó de dados

Os seguintes parâmetros são destinados ao uso durante testes ou depuração de nós de dados e não para uso em produção.

* `DictTrace`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>08

É possível causar o registro de rastros para eventos gerados ao criar e descartar tabelas usando `DictTrace`. Este parâmetro é útil apenas no depuração do código do kernel NDB. `DictTrace` leva um valor inteiro. 0 desativa o registro; 1 o habilita; definir este parâmetro para 2 habilita o registro de saída adicional de depuração do `DBDICT` (Bug #20368450).

* `WatchDogImmediateKill`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>09

Em NDB 7.6.7 e versões posteriores, você pode fazer com que os threads sejam eliminados imediatamente sempre que ocorrerem problemas de vigilância ao habilitar o parâmetro de configuração do nó de dados `WatchDogImmediateKill`. Este parâmetro deve ser usado apenas durante a depuração ou solução de problemas, para obter arquivos de rastreamento que relatem exatamente o que estava ocorrendo no momento em que a execução foi interrompida.

**Parâmetros de backup.** Os parâmetros `[ndbd]` discutidos nesta seção definem buffers de memória reservados para a execução de backups online.

* `BackupDataBufferSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>10

Ao criar um backup, são utilizados dois buffers para enviar dados para o disco. O buffer de dados do backup é usado para preencher os dados registrados ao digitalizar as tabelas de um nó. Uma vez que este buffer tenha sido preenchido até o nível especificado como `BackupWriteSize`, as páginas são enviadas para o disco. Enquanto o processo de limpeza de dados para o disco continua a preencher este buffer, até esgotar o espaço, quando isso acontece, o processo de backup pausa a digitalização e espera até que algumas gravações de disco tenham concluído a liberação de memória para que a digitalização possa continuar.

* `BackupDiskWriteSpeedPct`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>11

Durante o funcionamento normal, os nós de dados tentam maximizar a velocidade de escrita no disco usada para pontos de verificação locais e backups, mantendo-se dentro dos limites estabelecidos por `MinDiskWriteSpeed` e `MaxDiskWriteSpeed`. O controle de escrita no disco dá a cada thread LDM uma parte igual do orçamento total. Isso permite que os LCPs paralelos ocorram sem exceder o orçamento de I/O do disco. Como um backup é executado por apenas um thread LDM, isso efetivamente causou um corte no orçamento, resultando em tempos de conclusão do backup mais longos e, se a taxa de mudança for suficientemente alta, na falha na conclusão do backup quando a taxa de enchimento do buffer de log de backup for maior que a taxa de escrita alcançável.

Esse problema pode ser resolvido usando o parâmetro de configuração `BackupDiskWriteSpeedPct`, que aceita um valor no intervalo de 0 a 90 (inclusivo), que é interpretado como a porcentagem do orçamento máximo de taxa de escrita do nó que é reservada antes de compartilhar o restante do orçamento entre os threads LDM para LCPs. O thread LDM que executa o backup recebe todo o orçamento de taxa de escrita para o backup, mais sua (reduzida) participação no orçamento de taxa de escrita para pontos de verificação locais. (Isso faz com que o orçamento de taxa de escrita do disco se comporte de maneira semelhante àquela que foi tratada no NDB Cluster 7.3 e versões anteriores.)

O valor padrão para este parâmetro é 50 (interpretado como 50%).

* `BackupLogBufferSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>12

O buffer de log de backup desempenha um papel semelhante ao desempenhado pelo buffer de dados de backup, exceto que é usado para gerar um log de todas as escritas de tabela feitas durante a execução do backup. Os mesmos princípios se aplicam à escrita dessas páginas, como no caso do buffer de dados de backup, exceto que, quando não há mais espaço no buffer de log de backup, o backup falha. Por essa razão, o tamanho do buffer de log de backup deve ser grande o suficiente para lidar com a carga causada pelas atividades de escrita enquanto o backup está sendo feito. Veja a Seção 21.6.8.3, “Configuração para backups de NDB Cluster”.

O valor padrão para este parâmetro deve ser suficiente para a maioria das aplicações. De fato, é mais provável que uma falha de backup seja causada por uma velocidade de escrita no disco insuficiente do que pelo buffer do log de backup ficar cheio. Se o subsistema de disco não estiver configurado para a carga de escrita causada pelas aplicações, é improvável que o clúster consiga realizar as operações desejadas.

É preferível configurar os nós do cluster de tal forma que o processador se torne o gargalo, e não os discos ou as conexões de rede.

O valor padrão para este parâmetro é 16 MB.

* `BackupMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>13

Este parâmetro é desatualizado e está sujeito à remoção em uma versão futura do NDB Cluster. Qualquer configuração feita para ele é ignorada.

* `BackupReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>14

Este parâmetro controla a frequência com que relatórios de status de backup são emitidos no cliente de gerenciamento durante um backup, bem como a frequência com que esses relatórios são escritos no log do clúster (desde que a configuração do registro de eventos do clúster permita isso—consulte Registro e verificação de ponto). `BackupReportFrequency` representa o tempo em segundos entre os relatórios de status de backup.

O valor padrão é 0.

* `BackupWriteSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>15

Este parâmetro especifica o tamanho padrão das mensagens escritas no disco pelo log de backup e nos buffers de dados de backup.

O valor padrão para este parâmetro é 256 KB.

* `BackupMaxWriteSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>16

Este parâmetro especifica o tamanho máximo das mensagens escritas no disco pelo log de backup e nos buffers de dados de backup.

O valor padrão para este parâmetro é 1 MB.

* `CompressedBackup`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>17

Ativação deste parâmetro faz com que os arquivos de backup sejam comprimidos. A compressão utilizada é equivalente a **gzip --fast** e pode economizar 50% ou mais do espaço necessário no nó de dados para armazenar arquivos de backup não comprimidos. Os backups comprimidos podem ser ativados para nós de dados individuais ou para todos os nós de dados (definindo este parâmetro na seção `[ndbd default]` do arquivo `config.ini`).

Importante

Você não pode restaurar um backup comprimido em um clúster que esteja executando uma versão do MySQL que não suporte essa funcionalidade.

O valor padrão é `0` (desativado).

Nota

A localização dos arquivos de backup é determinada pelo parâmetro de configuração do nó de dados `BackupDataDir`.

**Requisitos adicionais.** Ao especificar esses parâmetros, as seguintes relações devem ser respeitadas. Caso contrário, o nó de dados não pode ser iniciado.

* `BackupDataBufferSize >= BackupWriteSize + 188KB`

* `BackupLogBufferSize >= BackupWriteSize + 16KB`

* `BackupMaxWriteSize >= BackupWriteSize`

##### Parâmetros de desempenho em tempo real do NDB Cluster

Os parâmetros `[ndbd]` discutidos nesta seção são usados na programação e bloqueio de threads para CPUs específicas em hosts de nós de dados de multiprocessamento.

Nota

Para utilizar esses parâmetros, o processo do nó de dados deve ser executado como raiz do sistema.

* `BuildIndexThreads`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>18

Este parâmetro determina o número de threads a serem criadas ao reconstruir índices ordenados durante o início de um sistema ou de um nó, bem como ao executar **ndb\_restore** `--rebuild-indexes`. É suportado apenas quando há mais de um fragmento para a tabela por nó de dados (por exemplo, quando `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` é usado com `CREATE TABLE`).

Definir este parâmetro para 0 (o padrão) desativa a construção de índices ordenados em múltiplos threads.

Este parâmetro é suportado ao usar **ndbd** ou **ndbmtd**).

Você pode habilitar a compilação multithread durante os reinícios iniciais do nó de dados, definindo o parâmetro de configuração do nó de dados `TwoPassInitialNodeRestartCopy` como `TRUE`.

* `LockExecuteThreadToCPU`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>19

Quando usado com **ndbd**, este parâmetro (agora uma string) especifica o ID da CPU atribuído para lidar com o `NDBCLUSTER` thread de execução. Quando usado com **ndbmtd**"), o valor deste parâmetro é uma lista de IDs de CPU separados por vírgula atribuídos para lidar com os threads de execução. Cada ID de CPU na lista deve ser um número inteiro no intervalo de 0 a 65535 (inclusivo).

O número de IDs especificado deve corresponder ao número de threads de execução determinado por `MaxNoOfExecutionThreads`. No entanto, não há garantia de que as threads sejam atribuídas aos CPUs em qualquer ordem específica ao usar este parâmetro. Você pode obter um controle mais detalhado deste tipo usando `ThreadConfig`.

`LockExecuteThreadToCPU` não tem valor padrão.

* `LockMaintThreadsToCPU`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>20

Este parâmetro especifica o ID da CPU atribuído para lidar com os threads de manutenção do `NDBCLUSTER`.

O valor deste parâmetro é um número inteiro no intervalo de 0 a 65535 (inclusive). *Não há valor padrão*.

* `Numa`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>21

Este parâmetro determina se o Acesso Não Uniforme de Memória (NUMA) é controlado pelo sistema operacional ou pelo processo do nó de dados, se o nó de dados usa **ndbd** ou **ndbmtd**"). Por padrão, `NDB` tenta usar uma política de alocação de memória NUMA intercalada em qualquer nó de dados onde o sistema operacional do host oferece suporte NUMA.

Definir `Numa = 0` significa que o processo de datanode não tenta definir uma política para a alocação de memória e permite que esse comportamento seja determinado pelo sistema operacional, que pode ser orientado ainda pelo **numactl** separado. Ou seja, `Numa = 0` produz o comportamento padrão do sistema, que pode ser personalizado pelo **numactl**. Para muitos sistemas Linux, o comportamento padrão do sistema é alocar memória local de socket para qualquer processo dado no momento da alocação. Isso pode ser problemático ao usar **ndbmtd"); isso ocorre porque **nbdmtd** aloca toda a memória no início, levando a um desequilíbrio, dando velocidades de acesso diferentes para diferentes sockets, especialmente ao bloquear páginas na memória principal.

Definir `Numa = 1` significa que o processo do nó de dados usa `libnuma` para solicitar alocação de memória interligada. (Isso também pode ser feito manualmente, no nível do sistema operacional, usando **numactl**. ) Usando a alocação interligada, o processo do nó de dados, na verdade, instrui o sistema a ignorar o acesso não uniforme à memória, mas não tenta aproveitar a memória local rápida; em vez disso, o processo do nó de dados tenta evitar desequilíbrios devido à memória remota lenta. Se a alocação interligada não for desejada, defina `Numa` para 0 para que o comportamento desejado possa ser determinado no nível do sistema operacional.

O parâmetro de configuração `Numa` é suportado apenas em sistemas Linux onde `libnuma.so` está disponível.

* `RealtimeScheduler`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>22

Definir este parâmetro para 1 habilita a agendamento em tempo real de threads de nós de dados.

O padrão é 0 (agendamento desativado).

* `SchedulerExecutionTimer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>23

Este parâmetro especifica o tempo em microsegundos para que os threads sejam executados no agendador antes de serem enviados. Definindo-o como 0, minimiza o tempo de resposta; para alcançar um maior desempenho, você pode aumentar o valor em detrimento de tempos de resposta mais longos.

O padrão é de 50 μs, que, conforme demonstrado em nossos testes, aumenta ligeiramente o desempenho em casos de carga alta, sem atrasar materialmente as solicitações.

* `SchedulerResponsiveness`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>24

Defina o equilíbrio no cronograma `NDB` entre velocidade e desempenho. Este parâmetro recebe um número inteiro cujo valor está no intervalo de 0 a 10, inclusive, com 5 como padrão. Valores mais altos fornecem tempos de resposta melhores em relação ao desempenho. Valores mais baixos fornecem um aumento no desempenho às custas de tempos de resposta mais longos.

* `SchedulerSpinTimer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>25

Este parâmetro especifica o tempo em microsegundos para que os threads sejam executados no agendador antes de dormir.

O valor padrão é 0.

* `TwoPassInitialNodeRestartCopy`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>26

A construção de índices ordenados multithread pode ser habilitada para reinicializações iniciais dos nós de dados, definindo este parâmetro de configuração como `true`, que permite a cópia de dados em duas passagens durante reinicializações iniciais de nós. No NDB 7.6, este é o valor padrão (Bug #26704312, Bug #27109117).

Você também deve definir `BuildIndexThreads` para um valor não nulo.

**Parâmetros de configuração de multithreading (ndbmtd).** O **ndbmtd**") é executado, por padrão, como um processo monolínio e deve ser configurado para usar múltiplos threads, utilizando um dos dois métodos, ambos dos quais exigem a definição de parâmetros de configuração no arquivo `config.ini`. O primeiro método é simplesmente definir um valor apropriado para o parâmetro de configuração `MaxNoOfExecutionThreads`. Um segundo método permite configurar regras mais complexas para o **ndbmtd**") multithreading usando `ThreadConfig`. Os próximos parágrafos fornecem informações sobre esses parâmetros e seu uso com nós de dados multithread.

* `MaxNoOfExecutionThreads`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>27

Este parâmetro controla diretamente o número de threads de execução usadas pelo **ndbmtd**"), até um máximo de 72. Embora este parâmetro seja definido nas seções `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`, é exclusivo para **ndbmtd**") e não se aplica ao **ndbd**.

A definição de `MaxNoOfExecutionThreads` define o número de threads para cada tipo, conforme determinado por uma matriz no arquivo `storage/ndb/src/kernel/vm/mt_thr_config.cpp`. Esta tabela mostra esses números de threads para os possíveis valores de `MaxNoOfExecutionThreads`.

**Tabela 21.11 Valores de MaxNoOfExecutionThreads e o número correspondente de threads por tipo de thread (LQH, TC, Enviar, Receber).**

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>28

Há sempre uma única thread de SUMA (replicação).

`NoOfFragmentLogParts` deve ser igual ao número de threads LDM usadas pelo **ndbmtd**"), conforme determinado pelo ajuste deste parâmetro. Essa proporção não deve ser maior que 4:1; a partir do NDB 7.5.7, uma configuração em que isso ocorre é especificamente proibida. (Bug #25333414)

O número de threads LDM também determina o número de partições usadas por uma tabela `NDB` que não é explicitamente particionada; este é o número de threads LDM vezes o número de nós de dados no clúster. (Se **ndbd** é usado nos nós de dados em vez de **ndbmtd**"), então há sempre uma única thread LDM; nesse caso, o número de partições criadas automaticamente é simplesmente igual ao número de nós de dados. Consulte a Seção 21.2.2, “Nodos de clúster NDB, Grupos de Nó, Replicatas de Fragmento e Partições”, para mais informações.

Adicionar grandes espaços de tabelas para tabelas de dados de disco ao usar mais do que o número padrão de threads do LDM pode causar problemas com o uso de recursos e CPU se o buffer de página do disco não for suficientemente grande; consulte a descrição do parâmetro de configuração `DiskPageBufferMemory` para obter mais informações.

Os tipos de threads são descritos mais adiante nesta seção (ver `ThreadConfig`).

Definir este parâmetro fora do intervalo de valores permitido faz com que o servidor de gestão aborrecido no início com o erro Erro string *`number`*: Valor ilegal *`value`* para o parâmetro MaxNoOfExecutionThreads.

Para `MaxNoOfExecutionThreads`, um valor de 0 ou 1 é arredondado para cima internamente por `NDB` para 2, de modo que 2 é considerado o valor padrão e mínimo deste parâmetro.

`MaxNoOfExecutionThreads` é geralmente destinado a ser igual ao número de threads da CPU disponíveis e a alocar um número de threads de cada tipo adequado para cargas de trabalho típicas. Não atribui threads específicas a CPUs especificadas. Para casos em que é desejável variar dos ajustes fornecidos, ou para vincular threads a CPUs, você deve usar `ThreadConfig` em vez disso, que permite que você aloque cada thread diretamente a um tipo desejado, CPU ou ambos.

O processo de nó de dados multithread sempre gera, no mínimo, os seguintes threads:

+ 1 thread de manipulador de consulta local (LDM)
+ 1 thread de recebimento
+ 1 thread de gerenciamento de assinatura (SUMA ou replicação)

Para um valor de `MaxNoOfExecutionThreads` de 8 ou menos, não são criadas threads de TC e, em vez disso, o tratamento de TC é realizado pela thread principal.

Antes da NDB 7.6, alterar o número de threads LDM sempre requer um reinício do sistema, seja alterado usando este parâmetro ou `ThreadConfig`. Na NDB 7.6 e versões posteriores, é possível efetuar a alteração usando um reinício inicial do nó (*NI*) desde que as seguintes condições sejam atendidas:

+ Se, após a mudança, o número de threads do LDM permanecer o mesmo que antes, não é necessário mais do que um simples reinício do nó (reinício em rolagem, ou *N*) para implementar a mudança.

+ Caso contrário (ou seja, se o número de threads LDM mudar), ainda é possível efetuar a mudança usando um reinício inicial do nó (*NI*) desde que as duas condições seguintes sejam atendidas:

1. Cada thread LDM lida com um máximo de 8 fragmentos, e

2. O número total de fragmentos de tabela é um múltiplo inteiro do número de threads LDM.

Antes da NDB 7.6, se o uso do `IndexMemory` do clúster for maior que 50%, para fazer essa mudança é necessário um reinício inicial do clúster. (Nesse caso, é recomendado um uso máximo de 30-35% do `IndexMemory`.) Caso contrário, o uso de recursos e a alocação de threads do LDM não podem ser equilibrados entre os nós, o que pode resultar em threads LDM subutilizadas e superutilizadas, e, em última análise, falhas nos nós de dados. Na NDB 7.6 e versões posteriores, um reinício inicial *não* é necessário para efetuar uma mudança nesse parâmetro.

* `MaxSendDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>29

Esse parâmetro pode ser usado para fazer com que os nós de dados esperem momentaneamente antes de enviar dados para os nós da API; em algumas circunstâncias, descritas nos parágrafos a seguir, isso pode resultar em um envio mais eficiente de volumes maiores de dados e maior capacidade de processamento geral.

`MaxSendDelay` pode ser útil quando há muitos nós de API em ponto de saturação ou próximos a ele, o que pode resultar em ondas de desempenho crescente e decrescente. Isso ocorre quando os nós de dados são capazes de enviar resultados de volta aos nós de API de forma relativamente rápida, com muitos pequenos pacotes a serem processados, o que pode levar mais tempo para processar por byte em comparação com pacotes grandes, assim, desacelerando os nós de API; mais tarde, os nós de dados começam a enviar pacotes maiores novamente.

Para lidar com esse tipo de cenário, você pode definir `MaxSendDelay` para um valor não nulo, o que ajuda a garantir que as respostas não sejam enviadas de volta aos nós da API tão rapidamente. Quando isso é feito, as respostas são enviadas imediatamente quando não há outro tráfego concorrente, mas quando há, definir `MaxSendDelay` faz com que os nós de dados esperem o tempo suficiente para garantir que enviem pacotes maiores. Na verdade, isso introduz um gargalo artificial no processo de envio, o que pode, na verdade, melhorar significativamente o desempenho.

* `NoOfFragmentLogParts`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>30

Defina o número de grupos de arquivos de registro para logs de revisão pertencentes a este **ndbmtd"). O valor deste parâmetro deve ser igual ao número de threads LDM usadas pelo **ndbmtd") conforme determinado pelo ajuste para `MaxNoOfExecutionThreads`. A partir do NDB 7.5.7, uma configuração que use mais de 4 partes de log de revisão por LDM é desaconselhada. (Bug #25333414)

Veja a descrição de `MaxNoOfExecutionThreads` para mais informações.

* `ThreadConfig`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>31

Este parâmetro é usado com **ndbmtd**") para atribuir threads de diferentes tipos a diferentes CPUs. Seu valor é uma string cujo formato tem a seguinte sintaxe:

  ```sql
  ThreadConfig := entry[,entry[,...]]

  entry := type={param[,param[,...]]}

  type := ldm | main | recv | send | rep | io | tc | watchdog | idxbld

  param := count=number
    | cpubind=cpu_list
    | cpuset=cpu_list
    | spintime=number
    | realtime={0|1}
    | nosend={0|1}
    | thread_prio={0..10}
    | cpubind_exclusive=cpu_list
    | cpuset_exclusive=cpu_list
  ```

As chaves espirais (`{`...`}`) que cercam a lista de parâmetros são necessárias, mesmo que haja apenas um parâmetro na lista.

Um *`param`* (parâmetro) especifica qualquer ou todas as informações a seguir:

+ O número de threads do tipo dado (`count`).

+ O conjunto de CPUs para os quais os threads do tipo especificado devem ser vinculados de forma não exclusiva. Isso é determinado por um dos `cpubind` ou `cpuset`). `cpubind` faz com que cada thread seja vinculada (de forma não exclusiva) a uma CPU do conjunto; `cpuset` significa que cada thread é vinculada (de forma não exclusiva) ao conjunto de CPUs especificadas.

Em Solaris, você pode, em vez disso, especificar um conjunto de CPUs para as quais os threads do tipo dado devem ser vinculados exclusivamente. `cpubind_exclusive` faz com que cada thread seja vinculada exclusivamente a uma CPU no conjunto; `cpuset_exclsuive` significa que cada thread é vinculada exclusivamente ao conjunto de CPUs especificadas.

Apenas um dos `cpubind`, `cpuset`, `cpubind_exclusive` ou `cpuset_exclusive` pode ser fornecido em uma única configuração.

+ `spintime` determina o tempo de espera em microsegundos que o thread gira antes de dormir.

O valor padrão para `spintime` é o valor do parâmetro de configuração do nó de dados `SchedulerSpinTimer`.

`spintime` não se aplica a threads de E/S, watchdog ou threads de construção de índice offline, e, portanto, não pode ser definido para esses tipos de thread.

+ `realtime` pode ser definido como 0 ou 1. Se definido como 1, os threads são executados com prioridade em tempo real. Isso também significa que `thread_prio` não pode ser definido.

O parâmetro `realtime` é definido, por padrão, pelo valor do parâmetro de configuração do nó de dados `RealtimeScheduler`.

`realtime` não pode ser definido para os threads de construção de índice offline.

+ Ao definir `nosend` para 1, você pode impedir que um `main`, `ldm`, `rep` ou `tc` de thread ajude os threads de envio. Este parâmetro é 0 por padrão e não pode ser usado com outros tipos de threads.

+ `thread_prio` é um nível de prioridade de thread que pode ser definido de 0 a 10, com 10 representando a maior prioridade. O padrão é 5. Os efeitos precisos deste parâmetro são específicos da plataforma e são descritos mais adiante nesta seção.

O nível de prioridade do thread não pode ser definido para os threads de construção de índice offline.

**configurações e efeitos do thread\_prio por plataforma.** A implementação do `thread_prio` difere entre Linux/FreeBSD, Solaris e Windows. Na lista a seguir, discutimos seus efeitos em cada uma dessas plataformas, uma a uma:

+ *Linux e FreeBSD*: Mapeamos `thread_prio` para um valor que será fornecido à chamada de sistema `nice`. Como um valor de menor novidade para um processo indica uma prioridade de processo mais alta, aumentar `thread_prio` tem o efeito de diminuir o valor de `nice`.

**Tabela 21.12 Mapeamento de thread\_prio para valores nice no Linux e FreeBSD**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>32

Alguns sistemas operacionais podem permitir um nível máximo de niciedade de processo de 20, mas isso não é suportado por todas as versões visadas; por essa razão, escolhemos 19 como o valor máximo do `nice` que pode ser definido.

+ *Solaris*: Definindo `thread_prio` em Solaris, você define a prioridade do Solaris FX, com mapeamentos conforme mostrado na tabela a seguir:

**Tabela 21.13 Mapeamento de thread\_prio para prioridade FX em Solaris**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>33

Uma configuração `thread_prio` de 9 é mapeada no Solaris para o valor de prioridade especial FX 59, o que significa que o sistema operacional também tenta forçar o thread a rodar sozinho em seu próprio núcleo de CPU.

+ *Windows*: Mapeamos `thread_prio` a um valor de prioridade de thread do Windows passado para a função da API do Windows `SetThreadPriority()`. Esse mapeamento é mostrado na tabela a seguir:

**Tabela 21.14 Mapeamento de thread\_prio para prioridade de thread do Windows**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>34

O atributo *`type`* representa um tipo de thread NDB. Os tipos de thread suportados e a faixa de valores `count` permitidos para cada um deles estão fornecidos na lista a seguir:

+ `ldm`: Manipulador de consulta local (`DBLQH` bloco do kernel) que manipula dados. Quanto mais threads LDM são usadas, mais altamente particionada a data se torna. Cada thread LDM mantém seus próprios conjuntos de dados e particionamentos de índice, bem como seu próprio log de refazer. O valor definido para `ldm` deve ser um dos valores 1, 2, 4, 6, 8, 12, 16, 24 ou 32.

Mudar o número de threads LDM normalmente requer um reinício inicial do sistema para ser eficaz e seguro para operações em cluster. Esse requisito é relaxado no NDB 7.6, conforme explicado mais adiante nesta seção. (Isso também é verdadeiro quando isso é feito usando `MaxNoOfExecutionThreads`.) *NDB 7.5 e anteriores*: Se o uso de `IndexMemory` exceder 50%, é necessário um reinício inicial do cluster; é recomendado um uso máximo de 30-35% de `IndexMemory` nesses casos. Caso contrário, a alocação de memória e threads LDM não pode ser equilibrada entre os nós, o que pode, em última análise, levar a falhas nos nós de dados.

Adicionar grandes espaços de tabelas (centenas de gigabytes ou mais) para tabelas de Dados de disco quando se usa mais do número padrão de LDMs pode causar problemas com o uso de recursos e CPU se `DiskPageBufferMemory` não for suficientemente grande.

+ `tc`: Fundo de thread do coordenador de transação (`DBTC` bloco do kernel) que contém o estado de uma transação em andamento. O número máximo de threads do TC é de 32.

Idealmente, cada nova transação pode ser atribuída a um novo thread TC. Na maioria dos casos, 1 thread TC por 2 threads LDM é suficiente para garantir que isso possa acontecer. Nos casos em que o número de escritas é relativamente pequeno em comparação com o número de leituras, é possível que seja necessário apenas 1 thread TC por 4 threads LQH para manter os estados das transações. Por outro lado, em aplicações que realizam muitas atualizações, pode ser necessário que a proporção de threads TC em relação aos threads LDM se aproxime de 1 (por exemplo, 3 threads TC para 4 threads LDM).

Definir `tc` para 0 faz com que o gerenciamento de TC seja feito pelo thread principal. Na maioria dos casos, isso é efetivamente o mesmo que definir para 1.

Faixa: 0 - 32

+ `main`: Dicionário de dados e blocos de coordenador de transação (`DBDIH` e `DBTC` do kernel), que fornecem gerenciamento de esquema. Isso é sempre tratado por um único thread dedicado.

Faixa: apenas 1.

+ `recv`: Receba o thread (`CMVMI` bloco do kernel). Cada thread de recebimento lida com um ou mais sockets para comunicação com outros nós em um NDB Cluster, com um socket por nó. O NDB Cluster suporta vários threads de recebimento; o máximo é 16 desses threads.

Faixa: 1 - 16

+ `send`: Envie o thread (`CMVMI` bloco do kernel). Para aumentar a taxa de transferência, é possível realizar envios a partir de um ou mais threads separados e dedicados (máximo de 8).

Anteriormente, todos os threads manipulavam seu próprio envio diretamente; isso ainda pode ser feito, definindo o número de threads de envio para 0 (isso também acontece quando `MaxNoOfExecutionThreads` é definido em menos de 10). Embora isso possa ter um impacto negativo no desempenho, também pode, em alguns casos, proporcionar uma latência diminuída.

Faixa: 0 - 16

+ `rep`: Fundo de replicação (`SUMA` bloco do kernel). As operações de replicação assíncrona são sempre tratadas por um único e dedicado thread.

Faixa: apenas 1.

+ `io`: Sistema de arquivos e outras operações diversas. Estas não são tarefas exigentes, e são sempre tratadas em grupo por uma única e dedicada thread de E/S.

Faixa: apenas 1.

+ `watchdog`: Os parâmetros associados a este tipo são aplicados a vários threads, cada um com um uso específico. Esses threads incluem o thread `SocketServer`, que recebe configurações de conexão de outros nós; o thread `SocketClient`, que tenta configurar conexões com outros nós; e o thread watchdog, que verifica se os threads estão progredindo.

Faixa: apenas 1.

+ `idxbld`: Threads de construção de índice offline. Ao contrário dos outros tipos de thread listados anteriormente, que são permanentes, estes são threads temporárias que são criadas e usadas apenas durante o reinício do nó ou do sistema, ou quando executando **ndb\_restore** `--rebuild-indexes`. Elas podem ser vinculadas a conjuntos de CPU que se sobrepõem com conjuntos de CPU vinculados a tipos de thread permanentes.

Os valores de `thread_prio`, `realtime` e `spintime` não podem ser definidos para os threads de construção de índice offline. Além disso, `count` é ignorado para este tipo de thread.

Se `idxbld` não for especificado, o comportamento padrão é o seguinte:

- Os tópicos de construção de índice offline não são vinculados se a thread de E/S também não estiver vinculada, e esses tópicos utilizam quaisquer núcleos disponíveis.

- Se a thread de E/S estiver vinculada, então as threads de construção do índice offline estarão vinculadas ao conjunto inteiro de threads vinculadas, devido ao fato de que não deverão haver outras tarefas para essas threads realizarem.

Intervalo: 0 - 1.

Este tipo de thread foi adicionado no NDB 7.6. (Bug #25835748, Bug #26928111)

Antes da NDB 7.6, a alteração de `ThreadCOnfig` requer um reinício inicial do sistema. Na NDB 7.6 (e em versões posteriores), essa exigência pode ser relaxada em certas circunstâncias:

+ Se, após a mudança, o número de threads do LDM permanecer o mesmo que antes, não é necessário mais do que um simples reinício do nó (reinício em rolagem, ou *N*) para implementar a mudança.

+ Caso contrário (ou seja, se o número de threads LDM mudar), ainda é possível efetuar a mudança usando um reinício inicial do nó (*NI*) desde que as duas condições seguintes sejam atendidas:

1. Cada thread LDM lida com um máximo de 8 fragmentos, e

2. O número total de fragmentos de tabela é um múltiplo inteiro do número de threads LDM.

Em qualquer outro caso, é necessário reiniciar o sistema para alterar esse parâmetro.

O NDB 7.6 pode distinguir entre os tipos de threads com base nos seguintes critérios:

+ Se o thread é um thread de execução. Os threads do tipo `main`, `ldm`, `recv`, `rep`, `tc` e `send` são threads de execução; os threads `io`, `watchdog` e `idxbld` não são considerados threads de execução.

+ Se a alocação de threads para uma tarefa dada é permanente ou temporária. Atualmente, todos os tipos de threads, exceto `idxbld` são considerados permanentes; os threads `idxbld` são considerados threads temporárias.

Exemplos simples:

  ```sql
  # Example 1.

  ThreadConfig=ldm={count=2,cpubind=1,2},main={cpubind=12},rep={cpubind=11}

  # Example 2.

  Threadconfig=main={cpubind=0},ldm={count=4,cpubind=1,2,5,6},io={cpubind=3}
  ```

É geralmente desejável, ao configurar o uso de threads para um host de nó de dados, reservar um ou mais números de CPUs para o sistema operacional e outras tarefas. Assim, para uma máquina com 24 CPUs, você pode querer usar 20 threads de CPU (deixando 4 para outros usos), com 8 threads LDM, 4 threads TC (metade do número de threads LDM), 3 threads de envio, 3 threads de recebimento e 1 thread para cada gerenciamento de esquema, replicação assíncrona e operações de E/S. (Isso é quase a mesma distribuição de threads usada quando `MaxNoOfExecutionThreads` é definida como igual a 20.) O seguinte ajuste `ThreadConfig` realiza essas atribuições, além de vincular todos esses threads a CPUs específicas:

  ```sql
  ThreadConfig=ldm{count=8,cpubind=1,2,3,4,5,6,7,8},main={cpubind=9},io={cpubind=9}, \
  rep={cpubind=10},tc{count=4,cpubind=11,12,13,14},recv={count=3,cpubind=15,16,17}, \
  send{count=3,cpubind=18,19,20}
  ```

Na maioria dos casos, é possível vincular o thread principal (gestão de esquema) e o thread de E/S à mesma CPU, como fizemos no exemplo que acabou de ser mostrado.

O exemplo a seguir incorpora grupos de CPUs definidos usando tanto `cpuset` quanto `cpubind`, além do uso da priorização de threads.

  ```sql
  ThreadConfig=ldm={count=4,cpuset=0-3,thread_prio=8,spintime=200}, \
  ldm={count=4,cpubind=4-7,thread_prio=8,spintime=200}, \
  tc={count=4,cpuset=8-9,thread_prio=6},send={count=2,thread_prio=10,cpubind=10-11}, \
  main={count=1,cpubind=10},rep={count=1,cpubind=11}
  ```

Neste caso, criamos dois grupos de LDM; o primeiro usa `cpubind` e o segundo usa `cpuset`. `thread_prio` e `spintime` são definidos com os mesmos valores para cada grupo. Isso significa que há oito threads de LDM no total. (Você deve garantir que `NoOfFragmentLogParts` também esteja definido como 8.) As quatro threads de TC usam apenas dois CPUs; é possível, ao usar `cpuset`, especificar menos CPUs do que threads no grupo. (Isso não é verdade para `cpubind`.). As threads de envio usam duas threads usando `cpubind` para vincular essas threads aos CPUs 10 e 11. As threads principais e de replicação podem reutilizar esses CPUs.

Este exemplo mostra como `ThreadConfig` e `NoOfFragmentLogParts` podem ser configurados para um host com 24 CPUs e hiper-threading, deixando as CPUs 10, 11, 22 e 23 disponíveis para funções do sistema operacional e interrupções:

  ```sql
  NoOfFragmentLogParts=10
  ThreadConfig=ldm={count=10,cpubind=0-4,12-16,thread_prio=9,spintime=200}, \
  tc={count=4,cpuset=6-7,18-19,thread_prio=8},send={count=1,cpuset=8}, \
  recv={count=1,cpuset=20},main={count=1,cpuset=9,21},rep={count=1,cpuset=9,21}, \
  io={count=1,cpuset=9,21,thread_prio=8},watchdog={count=1,cpuset=9,21,thread_prio=9}
  ```

Os próximos exemplos incluem configurações para `idxbld`. Os dois primeiros desses exemplos demonstram como um conjunto de CPU definido para `idxbld` pode sobrepor os especificados para outros tipos de thread (permanentes), o primeiro usando `cpuset` e o segundo usando `cpubind`:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1-8}

  ThreadConfig=main,ldm={count=1,cpubind=1},idxbld={count=1,cpubind=1}
  ```

O próximo exemplo especifica uma CPU para a thread de E/S, mas não para as threads de construção do índice:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8}
  ```

Como o ajuste `ThreadConfig` que acabou de ser mostrado bloqueia os threads em oito núcleos numerados de 1 a 8, ele é equivalente ao ajuste mostrado aqui:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1,2,3,4,5,6,7,8}
  ```

Para aproveitar a estabilidade aprimorada que o uso do `ThreadConfig` oferece, é necessário garantir que as CPUs estejam isoladas e não sejam sujeitas a interrupções ou a serem agendadas para outras tarefas pelo sistema operacional. Em muitos sistemas Linux, você pode fazer isso definindo `IRQBALANCE_BANNED_CPUS` em `/etc/sysconfig/irqbalance` para `0xFFFFF0` e usando a opção de inicialização `isolcpus` em `grub.conf`. Para informações específicas, consulte a documentação do seu sistema operacional ou plataforma.

**Parâmetros de configuração de dados de disco.** Os parâmetros de configuração que afetam o comportamento dos dados de disco incluem os seguintes:

* `DiskPageBufferEntries`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>35

Este é o número de entradas de página (referências de página) a serem alocadas. É especificado como um número de 32K páginas em `DiskPageBufferMemory`. O padrão é suficiente para a maioria dos casos, mas você pode precisar aumentar o valor deste parâmetro se encontrar problemas com transações muito grandes em tabelas de Dados de disco. Cada entrada de página requer aproximadamente 100 bytes.

* `DiskPageBufferMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>36

Isso determina a quantidade de espaço usado para cache de páginas no disco e é definido na seção `[ndbd]` ou `[ndbd default]` do arquivo `config.ini`. É medido em bytes. Cada página ocupa 32 KB. Isso significa que o armazenamento de Dados de Disco do NDB Cluster sempre usa *`N`* \* 32 KB de memória, onde *`N`* é algum inteiro não negativo.

O valor padrão para este parâmetro é `64M` (2000 páginas de 32 KB cada).

Se o valor para `DiskPageBufferMemory` estiver definido muito baixo em conjunto com o uso de mais do que o número padrão de threads LDM em `ThreadConfig` (por exemplo, `{ldm=6...}`), problemas podem surgir ao tentar adicionar um arquivo de dados grande (por exemplo, 500G) a uma tabela `NDB` baseada em disco, onde o processo leva indefinidamente tempo e ocupa um dos núcleos da CPU.

Isso ocorre porque, como parte da adição de um arquivo de dados a um espaço de tabelas, as páginas do extent são bloqueadas na memória em um thread de trabalhador PGMAN adicional, para acesso rápido aos metadados. Ao adicionar um arquivo grande, esse trabalhador tem memória insuficiente para todos os metadados do arquivo de dados. Nesses casos, você deve aumentar `DiskPageBufferMemory`, ou adicionar arquivos de espaço de tabelas menores. Você também pode precisar ajustar `DiskPageBufferEntries`.

Você pode consultar a tabela `ndbinfo.diskpagebuffer` para ajudar a determinar se o valor para este parâmetro deve ser aumentado para minimizar buscas desnecessárias no disco. Consulte a Seção 21.6.15.20, “A tabela ndbinfo diskpagebuffer”, para obter mais informações.

* `SharedGlobalMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>37

Este parâmetro determina a quantidade de memória que é usada para tampões de log, operações de disco (como solicitações de página e filas de espera) e metadados para espaços de tabela, grupos de arquivos de log, arquivos `UNDO` e arquivos de dados. O pool de memória global compartilhada também fornece memória usada para satisfazer os requisitos de memória da opção `UNDO_BUFFER_SIZE` usada com as declarações `CREATE LOGFILE GROUP` e `ALTER LOGFILE GROUP`, incluindo qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`. `SharedGlobalMemory` pode ser definido na seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração `config.ini`, e é medido em bytes.

O valor padrão é `128M`.

* `DiskIOThreadPool`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>38

Este parâmetro determina o número de threads não vinculadas usadas para o acesso ao arquivo de dados do disco. Antes de `DiskIOThreadPool` ser introduzido, exatamente uma thread era gerada para cada arquivo de dados do disco, o que poderia levar a problemas de desempenho, especialmente quando se usam arquivos de dados muito grandes. Com `DiskIOThreadPool`, você pode, por exemplo, acessar um único grande arquivo de dados usando várias threads trabalhando em paralelo.

Este parâmetro se aplica apenas aos threads de E/S de dados do disco.

O valor ótimo para este parâmetro depende do seu hardware e configuração, e inclui esses fatores:

+ **Distribuição física dos arquivos de dados do disco.** Você pode obter um desempenho melhor ao colocar os arquivos de dados, arquivos de registro de desfazer e o sistema de arquivos do nó de dados em discos físicos separados. Se você fizer isso com alguns ou todos esses conjuntos de arquivos, então pode definir `DiskIOThreadPool` mais alto para permitir que os threads separados lidem com os arquivos em cada disco.

+ **Desempenho e tipos de disco.** O número de threads que podem ser acomodados para o manuseio de arquivos de dados de disco também depende da velocidade e do desempenho dos discos. Discos mais rápidos e maior desempenho permitem mais threads de E/S de disco. Nossos resultados de teste indicam que as unidades de disco de estado sólido podem lidar com muito mais threads de E/S de disco do que os discos convencionais, e, portanto, valores mais altos para `DiskIOThreadPool`.

O valor padrão para este parâmetro é 2.

* **Parâmetros do sistema de arquivos de dados do disco.** Os parâmetros da lista a seguir permitem que os arquivos de dados do disco do NDB Cluster sejam colocados em diretórios específicos sem a necessidade de usar links simbólicos.

+ `FileSystemPathDD`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>39

Se este parâmetro for especificado, os arquivos de dados de disco do NDB Cluster e os arquivos de registro de desfazer são colocados no diretório indicado. Isso pode ser sobrescrito para arquivos de dados, arquivos de registro de desfazer ou ambos, especificando valores para `FileSystemPathDataFiles`, `FileSystemPathUndoFiles` ou ambos, conforme explicado para esses parâmetros. Também pode ser sobrescrito para arquivos de dados, especificando um caminho na cláusula `ADD DATAFILE` de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`, e para arquivos de registro de desfazer, especificando um caminho na cláusula `ADD UNDOFILE` de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`. Se `FileSystemPathDD` não for especificado, então `FileSystemPath` é usado.

Se um diretório `FileSystemPathDD` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao começar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

+ `FileSystemPathDataFiles`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>40

Se este parâmetro for especificado, os arquivos de dados do NDB Cluster Disk são colocados no diretório indicado. Isso substitui qualquer valor definido para `FileSystemPathDD`. Este parâmetro pode ser substituído para um arquivo de dados específico, especificando um caminho na cláusula `ADD DATAFILE` de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar esse arquivo de dados. Se `FileSystemPathDataFiles` não for especificado, então `FileSystemPathDD` é usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido definido).

Se um diretório `FileSystemPathDataFiles` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao começar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

+ `FileSystemPathUndoFiles`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>41

Se este parâmetro for especificado, os arquivos de registro de desfazer dos dados do disco do NDB Cluster serão colocados no diretório indicado. Isso substitui qualquer valor especificado para `FileSystemPathDD`. Este parâmetro pode ser substituído para um determinado arquivo de dados especificando um caminho na cláusula `ADD UNDO` de uma declaração `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP` usada para criar esse arquivo de dados. Se `FileSystemPathUndoFiles` não for especificado, então `FileSystemPathDD` será usado (ou `FileSystemPath`, se `FileSystemPathDD` também não tiver sido especificado).

Se um diretório `FileSystemPathUndoFiles` for especificado para um nó de dados dado (incluindo o caso em que o parâmetro é especificado na seção `[ndbd default]` do arquivo `config.ini`, então, ao começar esse nó de dados com `--initial`, todos os arquivos do diretório serão excluídos.

Para mais informações, consulte a Seção 21.6.11.1, “Objetos de dados de disco do cluster NDB”.

* **Parâmetros para a criação de objetos de dados de disco.** Os dois próximos parâmetros permitem que, ao iniciar o clúster pela primeira vez, você crie um grupo de arquivos de registro de dados de disco, um espaço de tabela ou ambos, sem o uso de declarações SQL.

+ `InitialLogFileGroup`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>42

Este parâmetro pode ser usado para especificar um grupo de arquivo de registro que é criado ao realizar um início inicial do clúster. `InitialLogFileGroup` é especificado conforme mostrado aqui:

    ```sql
    InitialLogFileGroup = [name=name;] [undo_buffer_size=size;] file-specification-list

    file-specification-list:
        file-specification[; file-specification[; ...]]

    file-specification:
        filename:size
    ```

O `name` do grupo de arquivos de registro é opcional e tem como padrão `DEFAULT-LG`. O `undo_buffer_size` também é opcional; se omitido, tem como padrão `64M`. Cada *`file-specification`* corresponde a um arquivo de registro de desfazer, e pelo menos um deve ser especificado no *`file-specification-list`*. Os arquivos de registro de desfazer são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathUndoFiles`, assim como se tivessem sido criados como resultado de uma declaração de `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`.

Considere o seguinte:

    ```sql
    InitialLogFileGroup = name=LG1; undo_buffer_size=128M; undo1.log:250M; undo2.log:150M
    ```

Isso é equivalente às seguintes instruções SQL:

    ```sql
    CREATE LOGFILE GROUP LG1
        ADD UNDOFILE 'undo1.log'
        INITIAL_SIZE 250M
        UNDO_BUFFER_SIZE 128M
        ENGINE NDBCLUSTER;

    ALTER LOGFILE GROUP LG1
        ADD UNDOFILE 'undo2.log'
        INITIAL_SIZE 150M
        ENGINE NDBCLUSTER;
    ```

Este grupo de arquivo de registro é criado quando os nós de dados são iniciados com `--initial`.

Os recursos para o grupo inicial de arquivos de registro são adicionados ao pool de memória global juntamente com os indicados pelo valor de `SharedGlobalMemory`.

Este parâmetro, se utilizado, deve ser sempre definido na seção `[ndbd default]` do arquivo `config.ini`. O comportamento de um NDB Cluster quando diferentes valores são definidos em diferentes nós de dados não é definido.

+ `InitialTablespace`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>43

Este parâmetro pode ser usado para especificar um espaço de dados de tabela de disco do NDB Cluster que é criado ao realizar o início inicial do cluster. `InitialTablespace` é especificado conforme mostrado aqui:

    ```sql
    InitialTablespace = [name=name;] [extent_size=size;] file-specification-list
    ```

O `name` do espaço de tabela é opcional e tem como padrão `DEFAULT-TS`. O `extent_size` também é opcional; ele tem como padrão `1M`. O *`file-specification-list`* usa a mesma sintaxe mostrada com o parâmetro `InitialLogfileGroup`, a única diferença sendo que cada *`file-specification`* usado com `InitialTablespace` corresponde a um arquivo de dados. Pelo menos um deve ser especificado no *`file-specification-list`*. Os arquivos de dados são colocados de acordo com quaisquer valores que tenham sido definidos para `FileSystemPath`, `FileSystemPathDD` e `FileSystemPathDataFiles`, assim como se eles tivessem sido criados como resultado de uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`.

Por exemplo, considere a seguinte string que especifica `InitialTablespace` na seção `[ndbd default]` do arquivo `config.ini` (assim como com `InitialLogfileGroup`, este parâmetro deve ser sempre definido na seção `[ndbd default]`, pois o comportamento de um NDB Cluster quando diferentes valores são definidos em diferentes nós de dados não é definido):

    ```sql
    InitialTablespace = name=TS1; extent_size=8M; data1.dat:2G; data2.dat:4G
    ```

Isso é equivalente às seguintes instruções SQL:

    ```sql
    CREATE TABLESPACE TS1
        ADD DATAFILE 'data1.dat'
        EXTENT_SIZE 8M
        INITIAL_SIZE 2G
        ENGINE NDBCLUSTER;

    ALTER TABLESPACE TS1
        ADD DATAFILE 'data2.dat'
        INITIAL_SIZE 4G
        ENGINE NDBCLUSTER;
    ```

Este espaço de tabela é criado quando os nós de dados são iniciados com `--initial`, e pode ser usado sempre que se criar tabelas de dados de disco do NDB Cluster posteriormente.

**Erros de dados do disco e GCP Stop.**

Os erros encontrados ao usar tabelas de dados de disco, como o nó *`nodeid`*, mataram esse nó porque foi detectado o término do GCP (erro 2303) são frequentemente referidos como “erros de término do GCP”. Esses erros ocorrem quando o log de refazer não é descarregado no disco com rapidez suficiente; isso geralmente ocorre devido a discos lentos e throughput de disco insuficiente.

Você pode ajudar a evitar que esses erros ocorram usando discos mais rápidos e colocando os arquivos de Dados de disco em um disco separado do sistema de arquivos do nó de dados. Reduzir o valor de `TimeBetweenGlobalCheckpoints` tende a diminuir a quantidade de dados que devem ser escritos para cada ponto de verificação global, e assim pode fornecer alguma proteção contra a sobrecarga do buffer do log de refazer ao tentar escrever um ponto de verificação global; no entanto, reduzir esse valor também permite menos tempo para escrever o GCP, então isso deve ser feito com cautela.

Além das considerações dadas para `DiskPageBufferMemory`, conforme explicado anteriormente, também é muito importante que o parâmetro de configuração `DiskIOThreadPool` seja configurado corretamente; é muito provável que o GCP pareça se o `DiskIOThreadPool` estiver configurado muito alto (Bug #37227).

Os bloqueios do GCP podem ser causados por temporizadores de salvamento ou de commit; o parâmetro de configuração do nó de dados `TimeBetweenEpochsTimeout` determina o temporizador para commits. No entanto, é possível desativar ambos os tipos de temporizadores, definindo este parâmetro como 0.

**Parâmetros para configuração da alocação de memória do buffer de envio.** A memória do buffer de envio é alocada dinamicamente a partir de um pool de memória compartilhado entre todos os transportadores, o que significa que o tamanho do buffer de envio pode ser ajustado conforme necessário. (Anteriormente, o kernel NDB usava um buffer de envio de tamanho fixo para cada nó no clúster, que era alocado quando o nó era iniciado e não podia ser alterado enquanto o nó estava em execução.) Os parâmetros de configuração dos nós de dados `TotalSendBufferMemory` e `OverLoadLimit` permitem a definição de limites para essa alocação de memória. Para mais informações sobre o uso desses parâmetros (assim como `SendBufferMemory`), consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do Clúster NDB”.

* `ExtraSendBufferMemory`

Este parâmetro especifica a quantidade de memória de buffer que o transportador deve enviar para alocar, além da quantidade definida usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

* `TotalSendBufferMemory`

Este parâmetro é usado para determinar o total de memória a ser alocada neste nó para memória de buffer de envio compartilhada entre todos os transportadores configurados.

Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”.

Veja também a Seção 21.6.7, “Adicionar nós de dados do NDB Cluster Online”.

**Tratamento de sobre-commit de log de refazer.** É possível controlar o tratamento de operações de um nó de dados quando muito tempo é gasto para limpar os logs de refazer no disco. Isso ocorre quando uma limpeza de log de refazer dada leva mais de `RedoOverCommitLimit` segundos, mais de `RedoOverCommitCounter` vezes, causando o abandono de quaisquer transações pendentes. Quando isso acontece, o nó da API que enviou a transação pode lidar com as operações que deveriam ter sido comprometidas, ou seja, colocando as operações em fila e tentando-as novamente, ou abortando-as, conforme determinado por `DefaultOperationRedoProblemAction`. Os parâmetros de configuração do nó de dados para definir o tempo de espera e o número de vezes que pode ser excedido antes que o nó da API tome essa ação são descritos na lista a seguir:

* `RedoOverCommitCounter`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>44

Quando `RedoOverCommitLimit` é excedido ao tentar escrever um log de refazer dado no disco tantas vezes ou mais, quaisquer transações que não foram comprometidas como resultado são abortadas, e um nó da API onde qualquer uma dessas transações se originou lida com as operações que compõem essas transações de acordo com seu valor para `DefaultOperationRedoProblemAction` (por agrupar as operações para serem re-tentas, ou abortá-las).

* `RedoOverCommitLimit`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>45

Este parâmetro define um limite superior em segundos para tentar escrever um log de refazer dado no disco antes de esgotar o tempo. O número de vezes que o nó de dados tenta descartar este log de refazer, mas que leva mais tempo do que `RedoOverCommitLimit`, é mantido e comparado com `RedoOverCommitCounter`, e quando o descarte leva muito tempo, mais do que o valor desse parâmetro, quaisquer transações que não foram comprometidas como resultado do tempo de espera de descarte são abortadas. Quando isso ocorre, o nó da API onde qualquer uma dessas transações se originou processa as operações que compõem essas transações de acordo com a configuração de seu `DefaultOperationRedoProblemAction` (ele ou encaixa as operações para serem re-tentadas, ou as aborta).

**Controle de tentativas de reinício.** É possível exercer um controle fino sobre as tentativas de reinício dos nós de dados quando eles não conseguem iniciar o uso dos parâmetros de configuração dos nós de dados `MaxStartFailRetries` e `StartFailRetryDelay`.

`MaxStartFailRetries` limita o número total de tentativas antes de desistir de iniciar o nó de dados, `StartFailRetryDelay` define o número de segundos entre as tentativas de tentativa. Esses parâmetros estão listados aqui:

* `StartFailRetryDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>46

Use este parâmetro para definir o número de segundos entre as tentativas de reinício do nó de dados no evento de falha na inicialização. O padrão é 0 (sem atraso).

Ambos os parâmetros e `MaxStartFailRetries` são ignorados, a menos que `StopOnError` seja igual a 0.

* `MaxStartFailRetries`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>47

Use este parâmetro para limitar o número de tentativas de reinício feitas pelo nó de dados no caso de falhar na inicialização. O padrão é 3 tentativas.

Ambos os parâmetros e `StartFailRetryDelay` são ignorados, a menos que `StopOnError` seja igual a 0.

**Parâmetros das estatísticas do índice NDB.**

Os parâmetros da lista a seguir estão relacionados à geração de estatísticas do índice NDB.

* `IndexStatAutoCreate`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>48

Ative (defina igual a 1) ou desative (defina igual a 0) a coleta automática de estatísticas quando os índices são criados.

* `IndexStatAutoUpdate`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>49

Ative (defina como igual a 1) ou desative (defina como igual a 0) o monitoramento de índices para detectar mudanças e faça o disparo de atualizações automáticas de estatísticas quando essas forem detectadas. O grau de mudança necessário para disparar as atualizações é determinado pelas configurações das opções `IndexStatTriggerPct` e `IndexStatTriggerScale`.

* `IndexStatSaveSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>50

Espaço máximo em bytes permitido para as estatísticas salvas de qualquer índice dado nas tabelas de sistema `NDB` e na memória cache `mysqld`. No NDB 7.5 e versões anteriores, isso consome `IndexMemory`.

Pelo menos uma amostra é sempre produzida, independentemente de qualquer limite de tamanho. Esse tamanho é escalado por `IndexStatSaveScale`.

O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, vezes 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escalonamento.

* `IndexStatSaveScale`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>51

O tamanho especificado por `IndexStatSaveSize` é escalado pelo valor de `IndexStatTriggerPct` para um grande índice, vezes 0,01. Isso é multiplicado ainda mais pelo logaritmo na base 2 do tamanho do índice. Definir `IndexStatTriggerPct` igual a 0 desativa o efeito de escalonamento.

* `IndexStatTriggerPct`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>52

Alterações percentuais nas atualizações que desencadeiam uma atualização de estatísticas de índice. O valor é escalado por `IndexStatTriggerScale`. Você pode desativar completamente este gatilho definindo `IndexStatTriggerPct` como 0.

* `IndexStatTriggerScale`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>53

Escala `IndexStatTriggerPct` por esse valor vezes 0,01 para um grande índice. Um valor de 0 desativa a escala.

* `IndexStatUpdateDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>54

Atraso mínimo em segundos entre as atualizações automáticas das estatísticas do índice para um índice específico. Definir essa variável como 0 desativa qualquer atraso. O padrão é de 60 segundos.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.15 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>55

#### 21.4.3.7 Definindo SQL e Outros Nodos de API em um NDB Cluster

As seções `[mysqld]` e `[api]` no arquivo `config.ini` definem o comportamento dos servidores MySQL (nós SQL) e outras aplicações (nós API) usados para acessar os dados do clúster. Nenhum dos parâmetros mostrados é necessário. Se nenhum nome de computador ou host for fornecido, qualquer host pode usar este nó SQL ou API.

De modo geral, uma seção `[mysqld]` é usada para indicar um servidor MySQL que fornece uma interface SQL para o clúster, e uma seção `[api]` é usada para aplicações que não são processos `mysqld` que acessam dados do clúster, mas as duas designações são, na verdade, sinônimas; você pode, por exemplo, listar parâmetros para um servidor MySQL que atua como um nó SQL em uma seção `[api]`.

Nota

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte a Seção 21.4.3.9.1, “Opções do servidor MySQL para NDB Cluster”. Para informações sobre as variáveis do sistema do servidor MySQL relacionadas ao NDB Cluster, consulte a Seção 21.4.3.9.2, “Variáveis do sistema do NDB Cluster”.

* `Id`

  <table frame="box" rules="all" summary="Id API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

O `Id` é um valor inteiro usado para identificar o nó em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Este valor deve ser único para cada nó no cluster, independentemente do tipo de nó.

Nota

Os IDs dos nós de dados devem ser menores que 49, independentemente da versão do NDB Cluster utilizada. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós da API (e dos nós de gerenciamento) para valores maiores que 48.

`NodeId` é o nome do parâmetro preferido a ser usado ao identificar nós da API. (`Id` continua sendo suportado para compatibilidade reversa, mas agora é desaconselhado e gera um aviso quando usado. Também está sujeito à remoção futura.)

* `ConnectionMap`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Especifica quais nós de dados devem ser conectados.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

O `NodeId` é um valor inteiro usado para identificar o nó em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Este valor deve ser único para cada nó no cluster, independentemente do tipo de nó.

Nota

Os IDs dos nós de dados devem ser menores que 49, independentemente da versão do NDB Cluster utilizada. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós da API (e dos nós de gerenciamento) para valores maiores que 48.

`NodeId` é o nome do parâmetro preferido a ser usado ao identificar nós de gerenciamento. Um alias, `Id`, foi usado para esse propósito em versões muito antigas do NDB Cluster, e continua a ser suportado para compatibilidade reversa; agora é desaconselhado e gera uma advertência quando usado, e está sujeito à remoção em uma versão futura do NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Isso se refere ao conjunto `Id` para um dos computadores (hosts) definidos em uma seção `[computer]` do arquivo de configuração.

Importante

Este parâmetro é desatualizado a partir do NDB 7.5.0 e está sujeito à remoção em uma versão futura. Use o parâmetro `HostName` em vez disso.

* `HostName`

  <table frame="box" rules="all" summary="HostName API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Especificar este parâmetro define o nome do host do computador em que o nó SQL (nó de API) deve residir.

Se não for especificado nenhum `HostName` em uma seção específica do arquivo `config.ini` `[mysql]` ou `[api]`, então um nó SQL ou API pode se conectar usando o "slot" correspondente de qualquer host que possa estabelecer uma conexão de rede com a máquina do servidor de gerenciamento. *Isso difere do comportamento padrão para nós de dados, onde `localhost` é assumido para `HostName`, a menos que especificado de outra forma*.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Atribui um nó SQL ou outro nó de API a um domínio específico de disponibilidade (https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

+ Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

+ A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

+ O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que os nós SQL e outros nós API também comuniquem com os nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

+ O árbitro pode ser selecionado a partir de um domínio de disponibilidade em que não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

`LocationDomainId` assume um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro define quais nós podem atuar como árbitros. Tanto os nós de gerenciamento quanto os nós SQL podem ser árbitros. Um valor de 0 significa que o nó especificado nunca é usado como árbitro, um valor de 1 dá ao nó alta prioridade como árbitro e um valor de 2 dá baixa prioridade. Uma configuração normal usa o servidor de gerenciamento como árbitro, definindo seu `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e os para todos os nós SQL para 0 (o padrão para nós SQL).

Ao definir `ArbitrationRank` para 0 em todos os nós de gerenciamento e SQL, você pode desativar a arbitragem completamente. Você também pode controlar a arbitragem sobrescrevendo este parâmetro; para fazer isso, defina o parâmetro `Arbitration` na seção `[ndbd default]` do arquivo de configuração global `config.ini`.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Definir este parâmetro para qualquer outro valor que não 0 (o padrão) significa que as respostas do árbitro às solicitações de arbitragem são atrasadas pelo número declarado de milissegundos. Geralmente, não é necessário alterar esse valor.

* `BatchByteSize`

  <table frame="box" rules="all" summary="BatchByteSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>16K</td> </tr><tr> <th>Range</th> <td>1K - 1M</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Para consultas que são traduzidas em varreduras completas de tabela ou varreduras de intervalo em índices, é importante obter os registros em lotes de tamanho adequado para o melhor desempenho. É possível definir o tamanho adequado tanto em termos de número de registros (`BatchSize`) quanto em termos de bytes (`BatchByteSize`). O tamanho do lote real é limitado por ambos os parâmetros.

A velocidade com que as consultas são realizadas pode variar em mais de 40% dependendo de como este parâmetro é configurado.

Este parâmetro é medido em bytes. O valor padrão é 16K.

* `BatchSize`

  <table frame="box" rules="all" summary="BatchSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>records</td> </tr><tr> <th>Default</th> <td>256</td> </tr><tr> <th>Range</th> <td>1 - 992</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro é medido em número de registros e, por padrão, é definido como 256. O tamanho máximo é de 992.

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Este parâmetro especifica a quantidade de memória de buffer que o transportador deve enviar para alocar, além daquela que foi definida usando `TotalSendBufferMemory`, `SendBufferMemory`, ou ambas.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Use este parâmetro para definir a política de agendamento e a prioridade das threads de batida de coração para nós de gerenciamento e nós de API. A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

Ao definir este parâmetro, você deve especificar uma política. Isso é um dos `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (round robin). Isso é seguido opcionalmente pela prioridade (um número inteiro).

* `MaxScanBatchSize`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

O tamanho do lote é o tamanho de cada lote enviado a partir de cada nó de dados. A maioria das varreduras é realizada em paralelo para proteger o servidor MySQL de receber muito dados de muitos nós em paralelo; este parâmetro define um limite para o tamanho total do lote em todos os nós.

O valor padrão deste parâmetro é definido como 256 KB. Seu tamanho máximo é de 16 MB.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Este parâmetro é usado para determinar o total de memória a ser alocada neste nó para memória de buffer de envio compartilhada entre todos os transportadores configurados.

Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”.

* `AutoReconnect`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Este parâmetro é `false` por padrão. Isso obriga os nós API desconectados (incluindo servidores MySQL que atuam como nós SQL) a usar uma nova conexão com o clúster em vez de tentar reutilizar uma existente, pois a reutilização de conexões pode causar problemas ao usar IDs de nó dinamicamente alocados. (Bug #45921)

Nota

Esse parâmetro pode ser sobrescrito usando a API NDB. Para mais informações, consulte Ndb_cluster_connection::set_auto_reconnect() e Ndb_cluster_connection::get_auto_reconnect().

* `DefaultOperationRedoProblemAction`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Este parâmetro (junto com `RedoOverCommitLimit` e `RedoOverCommitCounter`) controla o tratamento dos nós de dados quando há muito tempo para o esvaziamento dos registros de revisão para o disco. Isso ocorre quando um esvaziamento de registro de revisão dado leva mais do que `RedoOverCommitLimit` segundos, mais do que `RedoOverCommitCounter` vezes, causando o abandono de quaisquer transações pendentes.

Quando isso acontece, o nó pode responder de duas maneiras, de acordo com o valor de `DefaultOperationRedoProblemAction`, listado aqui:

+ `ABORT`: Todas as operações pendentes de transações abortadas também são abortadas.

+ `QUEUE`: Operações pendentes de transações que foram interrompidas estão em fila para serem refeitas. Isso é o padrão. As operações pendentes ainda são interrompidas quando o log de refazer fica sem espaço — ou seja, quando ocorrem erros P\_TAIL\_PROBLEM.

* `DefaultHashMapSize`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

O tamanho dos mapas de hash de tabela usados por `NDB` é configurável usando este parâmetro. `DefaultHashMapSize` pode ter qualquer um dos três valores possíveis (0, 240 ou 3840).

O uso original previsto para este parâmetro era facilitar atualizações e, especialmente, atualizações para e a partir de versões muito antigas com tamanhos diferentes do mapa de hash padrão. Isso não é um problema ao fazer uma atualização do NDB Cluster 7.3 (ou posterior) para versões posteriores.

Atualmente, não é possível diminuir esse parâmetro online após a criação ou modificação de tabelas com `DefaultHashMapSize` igual a 3840.

* `Wan`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>7

Use a configuração WAN TCP como padrão.

* `ConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>8

Em um NDB Cluster com muitos nós de dados não iniciados, o valor deste parâmetro pode ser aumentado para contornar tentativas de conexão com nós de dados que ainda não começaram a funcionar no cluster, bem como tráfego moderado em nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o tempo em milissegundos entre as tentativas de conexão.

O tempo decorrido *durante* as tentativas de conexão do nó não é considerado ao calcular o tempo decorrido para este parâmetro. O tempo de espera é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é dobrado até atingir `ConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

Uma vez que o nó da API esteja conectado a um nó de dados e que esse nó informe (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão com esses nós de dados deixam de ser afetadas por este parâmetro e são feitas a cada 100 ms a partir daí, até que sejam conectadas. Uma vez que um nó de dados tenha começado, ele pode enviar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

* `StartConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>9

Em um NDB Cluster com muitos nós de dados não iniciados, o valor deste parâmetro pode ser aumentado para contornar tentativas de conexão com nós de dados que ainda não começaram a funcionar no cluster, bem como tráfego moderado em nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o tempo em milissegundos entre as tentativas de conexão.

O tempo decorrido *durante* as tentativas de conexão do nó não é considerado ao calcular o tempo decorrido para este parâmetro. O tempo de espera é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é dobrado até atingir `StartConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

Uma vez que o nó da API esteja conectado a um nó de dados e que esse nó informe (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão com esses nós de dados deixam de ser afetadas por este parâmetro e são feitas a cada 100 ms a partir daí, até que sejam conectadas. Uma vez que um nó de dados tenha começado, ele pode enviar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

**Parâmetros de depuração do nó da API.** Você pode usar o parâmetro de configuração `ApiVerbose` para habilitar a saída de depuração de um determinado nó da API. Este parâmetro aceita um valor inteiro. 0 é o padrão e desativa a depuração; 1 habilita a saída de depuração no log do cluster; 2 adiciona a saída de depuração `DBDICT` também. (Bug #20638450) Veja também DUMP 1229.

Você também pode obter informações de um servidor MySQL que está sendo executado como um nó SQL do NDB Cluster usando `SHOW STATUS` no cliente **mysql**, conforme mostrado aqui:

```sql
mysql> SHOW STATUS LIKE 'ndb%';
+-----------------------------+----------------+
| Variable_name               | Value          |
+-----------------------------+----------------+
| Ndb_cluster_node_id         | 5              |
| Ndb_config_from_host        | 198.51.100.112 |
| Ndb_config_from_port        | 1186           |
| Ndb_number_of_storage_nodes | 4              |
+-----------------------------+----------------+
4 rows in set (0.02 sec)
```

Para informações sobre as variáveis de status que aparecem na saída desta declaração, consulte a Seção 21.4.3.9.3, “Variáveis de status do cluster NDB”.

Nota

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao cluster.

Não é *necessário* realizar nenhum reinício do clúster se novos nós SQL ou API puderem utilizar slots de API anteriormente não utilizados na configuração do clúster para se conectar ao clúster.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.16 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema:</strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

#### 21.4.3.8 Definindo o Sistema

A seção `[system]` é usada para parâmetros que se aplicam ao conjunto como um todo. O parâmetro do sistema `Name` é usado com o MySQL Enterprise Monitor; `ConfigGenerationNumber` e `PrimaryMGMNode` não são usados em ambientes de produção. Exceto quando se usa o NDB Cluster com o MySQL Enterprise Monitor, não é necessário ter uma seção `[system]` no arquivo `config.ini`.

Mais informações sobre esses parâmetros podem ser encontradas na lista a seguir:

* `ConfigGenerationNumber`

  <table frame="box" rules="all" summary="ConfigGenerationNumber system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Número de geração de configuração. Este parâmetro atualmente não é utilizado.

* `Name`

  <table frame="box" rules="all" summary="Name system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Defina um nome para o clúster. Esse parâmetro é necessário para implantações com o MySQL Enterprise Monitor; caso contrário, ele não é utilizado.

Você pode obter o valor desse parâmetro verificando a variável de status `Ndb_system_name`. Em aplicativos da API NDB, você também pode obtê-lo usando `get_system_name()`.

* `PrimaryMGMNode`

  <table frame="box" rules="all" summary="PrimaryMGMNode system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

ID do nó principal de gerenciamento. Este parâmetro atualmente não é utilizado.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.17 Tipos de reinício de cluster do NDB**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Núcleo</td> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulte a Seção 21.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”).</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma mudança nesse parâmetro.</td> </tr><tr> <th>Eu</th> <td>Inicial</td> <td>Os nós de dados devem ser reiniciados usando o<code>--initial</code>opção</td> </tr></tbody></table>

#### 21.4.3.9 Opções e variáveis do MySQL Server para NDB Cluster

Esta seção fornece informações sobre as opções do servidor MySQL, variáveis do servidor e de status que são específicas para o NDB Cluster. Para informações gerais sobre o uso dessas opções e outras opções e variáveis que não são específicas para o NDB Cluster, consulte a Seção 5.1, “O servidor MySQL”.

Para os parâmetros de configuração do NDB Cluster utilizados no arquivo de configuração do cluster (geralmente denominado `config.ini`), consulte a Seção 21.4, “Configuração do NDB Cluster”.

##### 21.4.3.9.1 Opções do MySQL Server para NDB Cluster

Esta seção fornece descrições das opções do servidor `mysqld` relacionadas ao NDB Cluster. Para informações sobre as opções `mysqld` que não são específicas para o NDB Cluster, e para informações gerais sobre o uso de opções com `mysqld`, consulte a Seção 5.1.6, “Opções de comando do servidor”.

Para informações sobre as opções de string de comando usadas com outros processos do NDB Cluster, consulte a Seção 21.5, “Programas do NDB Cluster”.

* `--ndbcluster`

  <table frame="box" rules="all" summary="Properties for ndbcluster"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndbcluster[=value]</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-ndbcluster</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

O motor de armazenamento `NDBCLUSTER` é necessário para o uso do NDB Cluster. Se um binário `mysqld` incluir suporte para o motor de armazenamento `NDBCLUSTER`, o motor é desativado por padrão. Use a opção `--ndbcluster` para ativá-lo. Use `--skip-ndbcluster` para desativar explicitamente o motor.

Não é necessário ou desejável usar esta opção juntamente com `--initialize`. A partir do NDB 7.5.4, `--ndbcluster` é ignorado (e o mecanismo de armazenamento `NDB` *não* é habilitado) se `--initialize` também for usado. (Bug #81689, Bug #23518923)

* `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Deixe que `ALTER TABLE` e outras declarações DDL utilizem operações de cópia em tabelas de `NDB`. Defina para `OFF` para evitar que isso aconteça; fazer isso pode melhorar o desempenho de aplicações críticas.

* `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Isso define o tamanho em bytes que é usado para os lotes de transações NDB.

* `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>

Ao definir esta opção para um valor maior que 1 (o padrão), um processo `mysqld` pode usar múltiplas conexões ao clúster, imitando efetivamente vários nós SQL. Cada conexão requer sua própria seção `[api]` ou `[mysqld]` no arquivo de configuração do clúster (`config.ini`) e conta contra o número máximo de conexões de API suportadas pelo clúster.

Suponha que você tenha 2 computadores hospedeiros em cluster, cada um executando um nó SQL cujo processo `mysqld` foi iniciado com `--ndb-cluster-connection-pool=4`; isso significa que o cluster deve ter 8 slots de API disponíveis para essas conexões (em vez de 2). Todas essas conexões são configuradas quando o nó SQL se conecta ao cluster e são alocadas para os threads de forma round-robin.

Essa opção é útil apenas quando você está executando `mysqld` em máquinas hostis que possuem múltiplos CPUs, múltiplos núcleos ou ambos. Para obter os melhores resultados, o valor deve ser menor que o número total de núcleos disponíveis na máquina hostis. Definir um valor maior que esse provavelmente degradará severamente o desempenho.

Importante

Como cada nó SQL que utiliza o pool de conexão ocupa vários slots de nó API — cada slot tem seu próprio ID de nó no clúster — você *não* deve usar um ID de nó como parte da string de conexão do clúster ao iniciar qualquer processo `mysqld` que utilize o pool de conexão.

Definir um ID de nó na cadeia de conexão ao usar a opção `--ndb-cluster-connection-pool` causa erros de alocação de ID de nó quando o nó SQL tenta se conectar ao clúster.

* `--ndb-cluster-connection-pool-nodeids=list`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Especifica uma lista de IDs de nó separados por vírgula para conexões ao clúster utilizado por um nó SQL. O número de nós nesta lista deve ser o mesmo que o valor definido para a opção `--ndb-cluster-connection-pool`.

`--ndb-cluster-connection-pool-nodeids` foi adicionado no NDB 7.5.0.

* `--ndb-blob-read-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de leituras de dados do `BLOB` em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados do `BLOB` a serem lidos dentro da transação atual, quaisquer operações de leitura pendentes do `BLOB` são executadas imediatamente.

O valor máximo para esta opção é 4294967295; o padrão é 65536. Definí-lo como 0 tem o efeito de desabilitar a batching de leitura de `BLOB`.

Nota

Em aplicativos da API NDB, você pode controlar o agrupamento de escrita de `BLOB` com os métodos `setMaxPendingBlobReadBytes()` e `getMaxPendingBlobReadBytes()`.

* `--ndb-blob-write-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de `BLOB` dados de escrita em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados `BLOB` a serem escritos dentro da transação atual, quaisquer operações de escrita pendentes `BLOB` são executadas imediatamente.

O valor máximo para esta opção é 4294967295; o padrão é 65536. Definí-lo como 0 tem o efeito de desabilitar a batching de escrita de `BLOB`.

Nota

Em aplicativos da API NDB, você pode controlar o agrupamento de escrita de `BLOB` com os métodos `setMaxPendingBlobWriteBytes()` e `getMaxPendingBlobWriteBytes()`.

* `--ndb-connectstring=connection_string`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Ao usar o motor de armazenamento `NDBCLUSTER`, esta opção especifica o servidor de gerenciamento que distribui os dados de configuração do clúster. Consulte a Seção 21.4.3.3, “Strings de conexão do clúster NDB”, para a sintaxe.

* `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table frame="box" rules="all" summary="Properties for ndb-default-column-format"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Introduced</th> <td>5.7.11-ndb-7.5.1</td> </tr><tr><th>System Variable</th> <td><code>ndb_default_column_format</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Valor padrão (≥ 5.7.16-ndb-7.5.4)</th> <td><code>FIXED</code></td> </tr><tr><th>Valor padrão (≥ 5.7.11-ndb-7.5.1, ≤ 5.7.13-ndb-7.5.3)</th> <td><code>DYNAMIC</code></td> </tr><tr><th>Valid Values</th> <td><code>FIXED</code><code>DYNAMIC</code></td> </tr></tbody></table>

Em NDB 7.5.1 e versões posteriores, define os valores padrão `COLUMN_FORMAT` e `ROW_FORMAT` para novas tabelas (consulte Seção 13.1.18, “Instrução CREATE TABLE”).

Em NDB 7.5.1, o padrão para essa opção era `DYNAMIC`; em NDB 7.5.4, o padrão foi alterado para `FIXED` para manter a compatibilidade reversa com séries de versões mais antigas (Bug #24487363).

* `--ndb-deferred-constraints=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-deferred-constraints"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-deferred-constraints</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_deferred_constraints</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

Controla se os controles de restrição em índices únicos são adiados até o momento do commit, onde tais verificações são suportadas. `0` é o padrão.

Essa opção normalmente não é necessária para o funcionamento do NDB Cluster ou da Replicação do NDB Cluster, e é destinada principalmente para uso em testes.

* `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Controla o método de distribuição padrão para as tabelas `NDB`. Pode ser configurado para `KEYHASH` (hash de chave) ou `LINHASH` (hash linear). `KEYHASH` é o padrão.

* `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Faz com que uma replica `mysqld` registre quaisquer atualizações recebidas de sua fonte imediata na tabela `mysql.ndb_apply_status` em seu próprio log binário, usando seu próprio ID de servidor em vez do ID do servidor da fonte. Em um cenário de replicação circular ou em cadeia, isso permite que essas atualizações se propague para as tabelas `mysql.ndb_apply_status` de quaisquer servidores MySQL configurados como réplicas do `mysqld` atual.

Em uma configuração de replicação em cadeia, o uso dessa opção permite que os clusters descendentes (replica) estejam cientes de suas posições em relação a todos os seus contribuidores (fontes) ascendentes.

Em uma configuração de replicação circular, essa opção faz com que as alterações nas tabelas do `ndb_apply_status` completem o circuito inteiro, propagando-se eventualmente de volta ao NDB Cluster de origem. Isso também permite que um cluster que atue como fonte veja quando suas alterações (epocas) foram aplicadas aos outros clusters no círculo.

Essa opção não tem efeito, a menos que o servidor MySQL seja iniciado com a opção `--ndbcluster`.

* `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Causas épocas durante as quais não houve alterações a serem escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando `log_slave_updates` está habilitado.

Por padrão, essa opção está desativada. Desativar `--ndb-log-empty-epochs` faz com que as transações de época sem alterações não sejam escritas no log binário, embora uma string ainda seja escrita mesmo para uma época vazia em `ndb_binlog_index`.

Como o `--ndb-log-empty-epochs=1` faz com que o tamanho da tabela `ndb_binlog_index` aumente independentemente do tamanho do log binário, os usuários devem estar preparados para gerenciar o crescimento dessa tabela, mesmo que esperem que o clúster esteja inativo grande parte do tempo.

* `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

As causas das atualizações que não produziram alterações são escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, quando o `log_slave_updates` está habilitado.

Por padrão, essa opção está desativada (`OFF`). A desativação de `--ndb-log-empty-update` faz com que as atualizações sem alterações não sejam escritas no log binário.

* `--ndb-log-exclusive-reads=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Iniciar o servidor com esta opção faz com que as leituras da chave primária sejam registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos da Replicação em NDB Cluster com base em conflitos de leitura. Você também pode habilitar e desabilitar esses bloqueios em tempo real, definindo o valor da variável de sistema `ndb_log_exclusive_reads` para 1 ou 0, respectivamente. 0 (desabilitar bloqueio) é o padrão.

Para mais informações, consulte a leitura de detecção e resolução de conflitos.

* `--ndb-log-fail-terminate`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Quando esta opção é especificada e não é possível registrar completamente todos os eventos de string encontrados, o processo `mysqld` é encerrado.

* `--ndb-log-orig`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

Registre o ID do servidor de origem e o período no `ndb_binlog_index` tabela.

Nota

Isso permite que uma determinada época tenha várias strings no `ndb_binlog_index`, uma para cada época de origem.

Para mais informações, consulte a Seção 21.7.4, “Esquema e tabelas de replicação de cluster NDB”.

* `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

Faz com que a replica `mysqld` escreva o ID de transação NDB em cada string do log binário. Esse registro requer o uso do formato de evento da Versão 2 para o log binário; portanto, a variável de sistema `log_bin_use_v1_row_events` deve ser desativada para usar essa opção.

É necessário `--ndb-log-transaction-id` para habilitar a detecção e resolução de conflitos da replicação do NDB Cluster usando a função `NDB$EPOCH_TRANS()` (consulte NDB$EPOCH_TRANS()")).

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `--ndb-log-update-as-write`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

Se as atualizações da fonte são escritas no log binário como atualizações (`OFF`) ou escritas (`ON`). Quando esta opção está habilitada e os `--ndb-log-updated-only` e `--ndb-log-update-minimal` estão desativados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir:

+ `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem posterior é registrada com todas as colunas.

`UPDATE`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

`DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas registradas na imagem anterior; a imagem após não está registrada.

Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte ndb\_replication Table, para mais informações.

* `--ndb-log-updated-only`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

Se `mysqld` escreve atualizações apenas (`ON`) ou strings completas (`OFF`) no log binário. Quando esta opção está habilitada e os `--ndb-log-update-as-write` e `--ndb-log-update-minimal` estão desativados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir

+ `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem posterior é registrada com todas as colunas.

+ `UPDATE`: Registrado como um evento `UPDATE_ROW`, com colunas de chave primária e colunas atualizadas presentes tanto nas imagens antes quanto depois.

+ `DELETE`: Registrado como um evento `DELETE_ROW` com as colunas da chave primária incluídas na imagem anterior; a imagem após não é registrada.

Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte ndb\_replication Table, para mais informações sobre como essas opções interagem entre si.

* `--ndb-log-update-minimal`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

Faça atualizações de registro de forma mínima, escrevendo apenas os valores da chave primária na imagem anterior e apenas as colunas alteradas na imagem posterior. Isso pode causar problemas de compatibilidade se for replicado em motores de armazenamento que não sejam `NDB`. Quando essa opção está habilitada e os `--ndb-log-updated-only` e `--ndb-log-update-as-write` estão desativados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir:

+ `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem posterior é registrada com todas as colunas.

+ `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas de chave primária na imagem anterior; todas as colunas *exceto* as colunas de chave primária são registradas na imagem posterior.

+ `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas na imagem anterior; a imagem após não foi registrada.

Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte ndb\_replication Table, para mais informações.

* `--ndb-mgmd-host=host[:port]`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

Pode ser usado para definir o número do host e do número de porta de um único servidor de gerenciamento para que o programa se conecte. Se o programa exigir IDs de nó ou referências a vários servidores de gerenciamento (ou ambos) em suas informações de conexão, use a opção `--ndb-connectstring`.

* `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

Defina o ID do nó do servidor MySQL em um NDB Cluster.

A opção `--ndb-nodeid` substitui qualquer ID de nó definido com `--ndb-connectstring`, independentemente da ordem em que as duas opções são usadas.

Além disso, se o `--ndb-nodeid` for usado, então ou uma ID de nó correspondente deve ser encontrada em uma seção do `[mysqld]` ou `[api]` do `config.ini`, ou deve haver uma seção “aberta” do `[mysqld]` ou `[api]` no arquivo (ou seja, uma seção sem um parâmetro `NodeId` ou `Id` especificado). Isso também é verdadeiro se a ID do nó for especificada como parte da string de conexão.

Independentemente de como o ID do nó é determinado, ele é mostrado como o valor da variável de status global `Ndb_cluster_node_id` na saída de `SHOW STATUS`, e como `cluster_node_id` na string `connection` da saída de `SHOW ENGINE NDBCLUSTER STATUS`.

Para obter mais informações sobre os IDs de nós para nós de SQL do NDB Cluster, consulte a Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

* `--ndb-optimization-delay=milliseconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

Defina o número de milissegundos para esperar entre os conjuntos de strings por meio das declarações `OPTIMIZE TABLE` em tabelas `NDB`. O padrão é 10.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-transid-mysql-connection-map=state`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

Habilita ou desabilita o plugin que lida com a tabela `ndb_transid_mysql_connection_map` no banco de dados `INFORMATION_SCHEMA`. Assume um dos valores `ON`, `OFF` ou `FORCE`. `ON` (o padrão) habilita o plugin. `OFF` desabilita o plugin, o que torna `ndb_transid_mysql_connection_map` inacessível. `FORCE` impede que o MySQL Server seja iniciado se o plugin não for carregado e iniciado.

Você pode verificar se o plugin da tabela `ndb_transid_mysql_connection_map` está em execução, verificando a saída de `SHOW PLUGINS`.

* `--ndb-wait-connected=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

Esta opção define o período de tempo que o servidor MySQL espera para que as conexões com os nós de gerenciamento e dados do NDB Cluster sejam estabelecidas antes de aceitar conexões de clientes MySQL. O tempo é especificado em segundos. O valor padrão é `30`.

* `--ndb-wait-setup=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

Essa variável indica o período de tempo que o servidor MySQL espera que o mecanismo de armazenamento `NDB` complete a configuração antes de expirar o tempo e tratar `NDB` como indisponível. O tempo é especificado em segundos. O valor padrão é `30`.

* `--skip-ndbcluster`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

Desative o motor de armazenamento `NDBCLUSTER`. Esse é o padrão para binários que foram construídos com suporte ao motor de armazenamento `NDBCLUSTER`; o servidor aloca memória e outros recursos apenas para este motor de armazenamento se a opção `--ndbcluster` for dada explicitamente. Veja a Seção 21.4.1, “Configuração rápida do teste do NDB Cluster”, para um exemplo.

##### 21.4.3.9.2 Variáveis do Sistema de Clúster NDB

Esta seção fornece informações detalhadas sobre as variáveis do sistema do servidor MySQL que são específicas para o NDB Cluster e o mecanismo de armazenamento `NDB`. Para variáveis do sistema que não são específicas para o NDB Cluster, consulte a Seção 5.1.7, “Variáveis do sistema do servidor”. Para informações gerais sobre o uso de variáveis do sistema, consulte a Seção 5.1.8, “Usando variáveis do sistema”.

* `ndb_autoincrement_prefetch_sz`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

Determina a probabilidade de lacunas em uma coluna autoincrementada. Defina-a em `1` para minimizar isso. Definí-la em um valor alto para otimização torna as inserções mais rápidas, mas diminui a probabilidade de números consecutivos de autoincremento serem usados em um lote de inserções.

Essa variável afeta apenas o número de IDs `AUTO_INCREMENT` que são obtidos entre as declarações; dentro de uma declaração dada, pelo menos 32 IDs são obtidos de uma só vez.

Importante

Essa variável não afeta os insertos realizados usando `INSERT ... SELECT`.

* `ndb_cache_check_time`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>0

O número de milissegundos que passam entre os verificações dos nós do NDB Cluster SQL pelo cache de consulta do MySQL. Definir esse valor como 0 (o valor padrão e mínimo) significa que o cache de consulta verifica a validação em cada consulta.

O valor máximo recomendado para essa variável é 1000, o que significa que a verificação é realizada uma vez por segundo. Um valor maior significa que a verificação é realizada e, possivelmente, invalidada devido a atualizações em diferentes nós do SQL com menos frequência. Geralmente, não é desejável definir esse valor em um valor maior que 2000.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `ndb_cache_check_time`.

* `ndb_clear_apply_status`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>1

Por padrão, a execução de `RESET SLAVE` faz com que uma replica do NDB Cluster elimine todas as strings da sua tabela `ndb_apply_status`. Você pode desabilitar isso definindo `ndb_clear_apply_status=OFF`.

* `ndb_data_node_neighbour`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>2

Define o ID de um nó de dados "mais próximo" — ou seja, um nó de dados não local preferido é escolhido para executar a transação, em vez de um que esteja executando no mesmo host que o nó SQL ou API. Isso era usado para garantir que, quando uma tabela totalmente replicada é acessada, acessamos-a neste nó de dados, para garantir que a cópia local da tabela seja sempre usada sempre que possível. Isso também pode ser usado para fornecer dicas para transações.

Isso pode melhorar os tempos de acesso aos dados no caso de um nó que está fisicamente mais próximo e, portanto, tem maior capacidade de transferência de rede do que outros no mesmo host.

Consulte a Seção 13.1.18.9, “Definindo opções de comentário NDB”, para obter mais informações.

Adicionado em NDB 7.5.2.

Nota

Um método equivalente `set_data_node_neighbour()` é fornecido para uso em aplicativos da API NDB.

* `ndb_default_column_format`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>3

Em NDB 7.5.1 e versões posteriores, define os valores padrão `COLUMN_FORMAT` e `ROW_FORMAT` para novas tabelas (consulte Seção 13.1.18, “Instrução CREATE TABLE”).

Em NDB 7.5.1, o padrão para essa variável era `DYNAMIC`; em NDB 7.5.4, o padrão foi alterado para `FIXED` para manter a compatibilidade reversa com séries de versões mais antigas (Bug #24487363).

* `ndb_deferred_constraints`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>4

Controla se os controles de restrição são deferidos ou não, onde esses são suportados. `0` é o padrão.

Essa variável normalmente não é necessária para o funcionamento do NDB Cluster ou da Replicação do NDB Cluster, e é destinada principalmente para uso em testes.

* `ndb_distribution`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>5

Controla o método de distribuição padrão para as tabelas `NDB`. Pode ser configurado para `KEYHASH` (hash de chave) ou `LINHASH` (hash linear). `KEYHASH` é o padrão.

* `ndb_eventbuffer_free_percent`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>6

Define a porcentagem da memória máxima alocada no buffer de eventos (ndb_eventbuffer_max_alloc) que deve estar disponível no buffer de eventos após atingir o máximo, antes de começar a bufferizar novamente.

* `ndb_eventbuffer_max_alloc`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>7

Define o máximo de memória (em bytes) que pode ser alocada para o bufferamento de eventos pela API NDB. 0 significa que não há limite imposto e é o padrão.

* `ndb_extra_logging`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>8

Essa variável permite a gravação no registro de erro do MySQL de informações específicas ao mecanismo de armazenamento `NDB`.

Quando essa variável é definida como 0, as informações específicas para `NDB` que são escritas no registro de erro do MySQL estão relacionadas ao gerenciamento de transações. Se definida com um valor maior que 0, mas menor que 10, o esquema da tabela `NDB` e os eventos de conexão também são registrados, bem como se a resolução de conflitos está sendo usada ou não, e outros erros e informações de `NDB`. Se o valor for definido como 10 ou mais, informações sobre o `NDB` interno, como o progresso da distribuição de dados entre os nós do cluster, também são escritas no registro de erro do MySQL. O padrão é 1.

* `ndb_force_send`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>9

Força o envio de buffers para `NDB` imediatamente, sem esperar por outros threads. O padrão é `ON`.

* `ndb_fully_replicated`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

Determina se as novas tabelas `NDB` são totalmente replicadas. Essa configuração pode ser sobrescrita para uma tabela individual usando `COMMENT="NDB_TABLE=FULLY_REPLICATED=..."` em uma declaração `CREATE TABLE` ou `ALTER TABLE`; consulte Seção 13.1.18.9, “Definindo opções de comentário NDB”, para sintaxe e outras informações.

Adicionado em NDB 7.5.2.

* `ndb_index_stat_enable`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

Use as estatísticas do índice `NDB` na otimização de consultas. O padrão é `ON`.

* `ndb_index_stat_option`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

Essa variável é usada para fornecer opções de ajuste para a geração de estatísticas de índice NDB. A lista consiste em pares de nome-valor separados por vírgula de nomes de opções e valores, e essa lista não deve conter nenhum caractere de espaço.

As opções não utilizadas ao definir `ndb_index_stat_option` não são alteradas de seus valores padrão. Por exemplo, você pode definir `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

Os valores de tempo podem ser sufixados opcionalmente com `h` (horas), `m` (minutos) ou `s` (segundos). Os valores de milissegundo podem ser especificados opcionalmente usando `ms`; valores de milissegundo não podem ser especificados usando `h`, `m` ou `s`.) Os valores inteiros podem ser sufixados com `K`, `M` ou `G`.

Os nomes das opções que podem ser definidos usando essa variável são mostrados na tabela a seguir. A tabela também fornece descrições breves das opções, seus valores padrão e (quando aplicável) seus valores mínimo e máximo.

**Tabela 21.18 ndb\_index\_stat\_option opções e valores**

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

* `ndb_join_pushdown`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

Esta variável controla se as junções nas tabelas `NDB` são empurradas para o núcleo NDB (nós de dados). Anteriormente, uma junção era tratada usando múltiplos acessos de `NDB` pelo nó SQL; no entanto, quando `ndb_join_pushdown` é habilitado, uma junção empurrável é enviada na íntegra para os nós de dados, onde pode ser distribuída entre os nós de dados e executada em paralelo em várias cópias dos dados, com um único resultado combinado sendo retornado para `mysqld`. Isso pode reduzir muito o número de viagens entre um nó SQL e os nós de dados necessárias para lidar com uma tal junção.

Por padrão, `ndb_join_pushdown` está habilitado.

**Condições para junções pushdown do NDB.** Para que uma junção seja pushdown, ela deve atender às seguintes condições:

1. Apenas as colunas podem ser comparadas, e todas as colunas que devem ser unidas devem usar *exatamente* o mesmo tipo de dados.

Isso significa que expressões como `t1.a = t2.a + constant` não podem ser empurradas para baixo, e que, por exemplo, uma junção em uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") também não podem ser empurradas para baixo.

2. As consultas que fazem referência às colunas `BLOB` ou `TEXT` não são suportadas.

3. O bloqueio explícito não é suportado; no entanto, o mecanismo de armazenamento `NDB` com característica de bloqueio implícito baseado em string é aplicado.

Isso significa que uma junção usando `FOR UPDATE` não pode ser empurrada para baixo.

4. Para que uma junção seja impulsionada, as tabelas subordinadas na junção devem ser acessadas usando um dos métodos de acesso `ref`, `eq_ref`, ou `const`, ou alguma combinação desses métodos.

As tabelas filhas externas unidas só podem ser empurradas usando `eq_ref`.

Se a raiz do join empurrado for um `eq_ref` ou `const`, apenas as tabelas filhas que são conectadas por `eq_ref` podem ser anexadas. (Uma tabela conectada por `ref` provavelmente se tornará a raiz de outro join empurrado.)

Se o otimizador de consulta decidir sobre `Using join cache` para uma tabela filha candidata, essa tabela não pode ser empurrada como uma filha. No entanto, ela pode ser a raiz de outro conjunto de tabelas empurradas.

5. As junções que fazem referência a tabelas explicitamente particionadas por `[LINEAR] HASH`, `LIST` ou `RANGE` atualmente não podem ser reduzidas.

Você pode verificar se uma junção específica pode ser reduzida verificando-a com `EXPLAIN`; quando a junção pode ser reduzida, você pode ver referências ao `pushed join` na coluna `Extra` do resultado, como mostrado neste exemplo:

  ```sql
  mysql> EXPLAIN
      ->     SELECT e.first_name, e.last_name, t.title, d.dept_name
      ->         FROM employees e
      ->         JOIN dept_emp de ON e.emp_no=de.emp_no
      ->         JOIN departments d ON d.dept_no=de.dept_no
      ->         JOIN titles t ON e.emp_no=t.emp_no\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: d
           type: ALL
  possible_keys: PRIMARY
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 9
          Extra: Parent of 4 pushed join@1
  *************************** 2. row ***************************
             id: 1
    select_type: SIMPLE
          table: de
           type: ref
  possible_keys: PRIMARY,emp_no,dept_no
            key: dept_no
        key_len: 4
            ref: employees.d.dept_no
           rows: 5305
          Extra: Child of 'd' in pushed join@1
  *************************** 3. row ***************************
             id: 1
    select_type: SIMPLE
          table: e
           type: eq_ref
  possible_keys: PRIMARY
            key: PRIMARY
        key_len: 4
            ref: employees.de.emp_no
           rows: 1
          Extra: Child of 'de' in pushed join@1
  *************************** 4. row ***************************
             id: 1
    select_type: SIMPLE
          table: t
           type: ref
  possible_keys: PRIMARY,emp_no
            key: emp_no
        key_len: 4
            ref: employees.de.emp_no
           rows: 19
          Extra: Child of 'e' in pushed join@1
  4 rows in set (0.00 sec)
  ```

Nota

Se as tabelas filhas unidas internas são unidas por `ref`, *e* o resultado é ordenado ou agrupado por um índice ordenado, este índice não pode fornecer strings ordenadas, o que força a escrita em um arquivo temporário ordenado.

Dois outros recursos de informação sobre o desempenho de junção empurrada estão disponíveis:

1. As variáveis de status `Ndb_pushed_queries_defined`, `Ndb_pushed_queries_dropped`, `Ndb_pushed_queries_executed` e `Ndb_pushed_reads`.

2. Os contagem na tabela `ndbinfo.counters` que pertencem ao bloco do kernel `DBSPJ`.

* `ndb_log_apply_status`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

Uma variável somente de leitura que indica se o servidor foi iniciado com a opção `--ndb-log-apply-status`.

* `ndb_log_bin`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

As causas das atualizações das tabelas `NDB` são escritas no log binário. Esta variável não tem efeito se o registro binário não estiver já habilitado para o servidor usando `log_bin`. `ndb_log_bin` por padrão é 1 (ON); normalmente, nunca é necessário alterar esse valor em um ambiente de produção.

* `ndb_log_binlog_index`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

Faz com que a mapeo de épocas para posições no log binário seja inserido na tabela `ndb_binlog_index`. Definir essa variável não tem efeito se o registro binário não estiver habilitado para o servidor usando `log_bin`. (Além disso, `ndb_log_bin` não deve ser desativado). `ndb_log_binlog_index` por padrão é `1` (`ON`); normalmente, nunca é necessário alterar esse valor em um ambiente de produção.

* `ndb_log_empty_epochs`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

Quando essa variável é definida como 0, as transações de época sem alterações não são escritas no log binário, embora uma string ainda seja escrita, mesmo para uma época vazia em `ndb_binlog_index`.

* `ndb_log_empty_update`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

Quando essa variável é definida como `ON` (`1`), as transações sem alterações são atualizadas no log binário, mesmo quando `log_slave_updates` está habilitado.

* `ndb_log_exclusive_reads`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Essa variável determina se as leituras da chave primária são registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos da Replicação do NDB Cluster com base em conflitos de leitura. Para habilitar esses bloqueios, defina o valor de `ndb_log_exclusive_reads` para 1. 0, que desativa esse bloqueio, é o padrão.

Para mais informações, consulte a leitura de detecção e resolução de conflitos.

* `ndb_log_orig`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Mostra se o ID do servidor de origem e a época estão registrados na tabela `ndb_binlog_index`. Definido usando a opção de servidor `--ndb-log-orig`.

* `ndb_log_transaction_id`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Essa variável do sistema binária, somente de leitura, indica se uma replica `mysqld` escreve IDs de transação NDB no log binário (requerida para usar a Replicação de NDB Cluster “ativo-ativo” com detecção de conflitos `NDB$EPOCH_TRANS()`). Para alterar a configuração, use a opção `--ndb-log-transaction-id`.

`ndb_log_transaction_id` não é suportado no servidor MySQL principal 5.7.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `ndb_optimized_node_selection`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

Existem duas formas de seleção de nós otimizada, descritas aqui:

1. O nó SQL utiliza promixity para determinar o coordenador de transação; ou seja, o nó de dados "mais próximo" ao nó SQL é escolhido como o coordenador de transação. Para esse propósito, um nó de dados que possui uma conexão de memória compartilhada com o nó SQL é considerado "mais próximo" ao nó SQL; os próximos mais próximos (em ordem decrescente de proximidade) são: conexão TCP para `localhost`, seguida por conexão TCP de um host que não seja `localhost`.

2. O thread SQL utiliza o conhecimento da distribuição para selecionar o nó de dados. Ou seja, o nó de dados que abriga a partição do clúster a que o primeiro comando de uma transação dada tem acesso é utilizado como coordenador da transação para toda a transação. (Isso é eficaz apenas se o primeiro comando da transação não acessar mais de uma partição do clúster.)

Esta opção aceita um dos valores inteiros `0`, `1`, `2` ou `3`. `3` é o padrão. Esses valores afetam a seleção de nó da seguinte forma:

+ `0`: A seleção do nó não é otimizada. Cada nó de dados é empregado como coordenador de transação 8 vezes antes de o thread SQL prosseguir para o próximo nó de dados.

+ `1`: A proximidade com o nó SQL é usada para determinar o coordenador da transação.

+ `2`: A consciência da distribuição é usada para selecionar o coordenador de transação. No entanto, se a primeira declaração da transação acessar mais de uma partição de clúster, o nó SQL retorna ao comportamento de rotação em anel visto quando esta opção é definida como `0`.

+ `3`: Se a consciência de distribuição puder ser empregada para determinar o coordenador de transação, então ela é usada; caso contrário, a proximidade é usada para selecionar o coordenador de transação. (Esse é o comportamento padrão.)

A proximidade é determinada da seguinte forma:

1. Comece com o valor definido para o parâmetro `Group` (padrão 55).

2. Para um nó da API que compartilha o mesmo host com outros nós da API, diminua o valor em 1. Supondo o valor padrão para `Group`, o valor efetivo para nós de dados no mesmo host que o nó da API é 54, e para nós de dados remotos 55.

3. (*NDB 7.5.2 e posterior:*) Definindo `ndb_data_node_neighbour` ainda reduz o valor efetivo `Group` em 50, fazendo com que este nó seja considerado o nó mais próximo. Isso é necessário apenas quando todos os nós de dados estão em hosts diferentes daquele que o nó da API e é desejável dedicar um deles ao nó da API. Nos casos normais, o ajuste padrão descrito anteriormente é suficiente.

Alterações frequentes em `ndb_data_node_neighbour` não são aconselháveis, pois isso altera o estado da conexão do cluster e, portanto, pode interromper o algoritmo de seleção para novas transações de cada thread até que ele se estabilize.

* `ndb_read_backup`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

Habilitar a leitura de qualquer fragmento de replica para qualquer tabela `NDB` posteriormente criada; isso melhora significativamente o desempenho da leitura da tabela a um custo relativamente baixo para os escritos.

Se o nó SQL e o nó de dados usarem o mesmo nome de host ou endereço IP, esse fato é detectado automaticamente, de modo que a preferência é enviar leituras para o mesmo host. Se esses nós estiverem no mesmo host, mas usarem endereços IP diferentes, você pode informar ao nó SQL que use o nó de dados correto, definindo o valor de `ndb_data_node_neighbour` no nó SQL para o ID do nó de dados.

Para habilitar ou desabilitar a leitura de qualquer réplica de fragmento para uma tabela individual, você pode definir a opção `NDB_TABLE` `READ_BACKUP` para a tabela conforme necessário, em uma declaração `CREATE TABLE` ou `ALTER TABLE`, veja a Seção 13.1.18.9, “Definindo opções de comentário NDB”, para mais informações.

Adicionado em NDB 7.5.2.

* `ndb_recv_thread_activation_threshold`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

Quando esse número de threads ativas simultaneamente é atingido, a thread de recebimento assume a verificação da conexão do cluster.

Essa variável tem alcance global. Ela também pode ser definida na inicialização.

* `ndb_recv_thread_cpu_mask`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

Máscara de CPU para bloquear os threads do receptor em CPUs específicas. Isso é especificado como uma máscara de bits hexadecimal. Por exemplo, `0x33` significa que uma CPU é usada por cada thread do receptor. Uma string vazia é a padrão; definir `ndb_recv_thread_cpu_mask` para esse valor remove quaisquer bloqueios de thread do receptor previamente definidos.

Essa variável tem alcance global. Ela também pode ser definida na inicialização.

* `ndb_report_thresh_binlog_epoch_slip`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

Em NDB 7.5.4 e versões posteriores, isso representa o limite para o número de épocas completamente armazenadas no buffer de eventos, mas ainda não consumidas pelo thread do injetor de binlog. Quando esse grau de deslizamento (atraso) é excedido, uma mensagem de status do buffer de eventos é relatada, com `BUFFERED_EPOCHS_OVER_THRESHOLD` fornecendo o motivo (ver Seção 21.6.2.3, “Relatório do Buffer de Eventos no Log do Clúster”). O deslizamento é aumentado quando uma época é recebida dos nós de dados e armazenada completamente no buffer de eventos; é reduzido quando uma época é consumida pelo thread do injetor de binlog. Epocas vazias são armazenadas e colocadas em fila, e, portanto, incluídas neste cálculo apenas quando isso é habilitado usando o método `Ndb::setEventBufferQueueEmptyEpoch()` da API do NDB.

Antes da NDB 7.5.4, o valor desse variável servia como um limite para o número de épocas que deveriam ser ultrapassadas antes de relatar o status do log binário. Nesses lançamentos anteriores, um valor de `3`—o padrão—significa que, se a diferença entre qual época foi recebida dos nós de armazenamento e qual época foi aplicada ao log binário for de 3 ou mais, uma mensagem de status é então enviada para o log do clúster.

* `ndb_report_thresh_binlog_mem_usage`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Este é um limite sobre a porcentagem de memória livre restante antes de relatar o status do log binário. Por exemplo, um valor de `10` (o padrão) significa que, se a quantidade de memória disponível para receber dados de log binário dos nós de dados cair abaixo de 10%, uma mensagem de status é enviada ao log do clúster.

* `ndb_row_checksum`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

Tradicionalmente, `NDB` criou tabelas com verificações de checksum de string, que verifica problemas de hardware às custas do desempenho. Definir `ndb_row_checksum` para 0 significa que as verificações de checksum de string *não* são usadas para novas ou alteradas tabelas, o que tem um impacto significativo no desempenho para todos os tipos de consultas. Esta variável é definida como 1 por padrão, para fornecer comportamento compatível com versões anteriores.

* `ndb_show_foreign_key_mock_tables`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

Mostre as tabelas simuladas usadas por `NDB` para suportar `foreign_key_checks=0`. Quando isso é ativado, avisos extras são mostrados ao criar e descartar as tabelas. O nome real (interno) da tabela pode ser visto na saída de `SHOW CREATE TABLE`.

* `ndb_slave_conflict_role`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

Determine o papel deste nó SQL (e do NDB Cluster) em uma configuração de replicação circular (“ativa-ativa”). `ndb_slave_conflict_role` pode assumir qualquer um dos valores `PRIMARY`, `SECONDARY`, `PASS` ou `NULL` (o padrão). O thread de SQL da replica deve ser parado antes de você poder alterar `ndb_slave_conflict_role`. Além disso, não é possível alterar diretamente entre `PASS` e qualquer um dos valores `PRIMARY` ou `SECONDARY` diretamente; nesses casos, você deve garantir que o thread de SQL seja parado, em seguida, execute `SET @@GLOBAL.ndb_slave_conflict_role = 'NONE'` primeiro.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `ndb_table_no_logging`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

Quando essa variável é definida como `ON` ou `1`, ela faz com que todas as tabelas criadas ou alteradas usando `ENGINE NDB` não sejam registradas; ou seja, nenhuma alteração de dados para essa tabela é escrita no log de revisão ou arquivada em disco, assim como se a tabela tivesse sido criada ou alterada usando a opção `NOLOGGING` para `CREATE TABLE` ou `ALTER TABLE`.

Para mais informações sobre tabelas não registradoras `NDB`, consulte Opções de NDB_TABLE.

`ndb_table_no_logging` não afeta a criação de arquivos de esquema de tabela `NDB`; para suprimi-los, use `ndb_table_temporary` em vez disso.

* `ndb_table_temporary`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

Quando configurada para `ON` ou `1`, essa variável faz com que as tabelas `NDB` não sejam escritas em disco: Isso significa que não são criados arquivos de esquema de tabela e as tabelas não são registradas.

Nota

Definir essa variável atualmente não tem efeito. Esse é um problema conhecido; veja o Bug #34036.

* `ndb_use_copying_alter_table`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

Força a `NDB` a usar a cópia de tabelas em caso de problemas com operações online de `ALTER TABLE`. O valor padrão é `OFF`.

* `ndb_use_exact_count`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

Força a `NDB` a usar um contagem de registros durante o planejamento da consulta `SELECT COUNT(*)` para acelerar esse tipo de consulta. O valor padrão é `OFF`, que permite consultas mais rápidas no geral.

* `ndb_use_transactions`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

Você pode desativar o suporte para transações `NDB` definindo o valor desta variável para `OFF`. Geralmente, isso não é recomendado, embora possa ser útil desativar o suporte para transações dentro de uma sessão de cliente específica quando essa sessão é usada para importar um ou mais arquivos de dump com transações grandes; isso permite que uma inserção de várias strings seja executada em partes, em vez de como uma única transação. Nesses casos, uma vez que a importação tenha sido concluída, você deve ou redefinir o valor da variável para esta sessão para `ON`, ou simplesmente encerrar a sessão.

* `ndb_version`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

`NDB` versão do motor, como um número composto.

* `ndb_version_string`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

Versão do motor em formato `ndb-x.y.z`

* `server_id_bits`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

Essa variável indica o número de bits menos significativos dentro do `server_id` de 32 bits que realmente identificam o servidor. Indicar que o servidor é realmente identificado por menos de 32 bits permite que alguns dos bits restantes sejam usados para outros propósitos, como armazenar dados do usuário gerados por aplicativos que utilizam a API de Eventos da NDB dentro do `AnyValue` de uma estrutura `OperationOptions` (o NDB Cluster usa o `AnyValue` para armazenar o ID do servidor).

Ao extrair o ID do servidor efetivo de `server_id` para fins como detecção de laços de replicação, o servidor ignora os bits restantes. A variável `server_id_bits` é usada para mascarar quaisquer bits irrelevantes de `server_id` nos threads de I/O e SQL ao decidir se um evento deve ser ignorado com base no ID do servidor.

Esses dados podem ser lidos do log binário pelo **mysqlbinlog**, desde que seja executado com sua própria variável `server_id_bits` definida como 32 (o padrão).

Se o valor de `server_id` for maior ou igual a 2 elevado a `server_id_bits`; caso contrário, o `mysqld` se recusa a iniciar.

Essa variável do sistema é suportada apenas pelo NDB Cluster. Não é suportada no servidor padrão MySQL 5.7.

* `slave_allow_batching`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Se as atualizações em lote estão habilitadas ou não nas réplicas do NDB Cluster.

Permitir atualizações em lote na replicação melhora muito o desempenho, especialmente ao replicar as colunas `TEXT`, `BLOB` e `JSON`. Por essa razão, você deve sempre habilitar `slave_allow_batching` ao usar a replicação NDB. A partir do NDB 7.6.23, um aviso é emitido sempre que essa variável é definida como `OFF`.

Estabelecer essa variável só tem efeito quando se usa replicação com o mecanismo de armazenamento `NDB`; no MySQL Server 5.7, ele está presente, mas não faz nada. Para mais informações, consulte a Seção 21.7.6, “Começando a replicação do NDB Cluster (Canal de replicação único)”).

* `transaction_allow_batching`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Quando definido para `1` ou `ON`, esta variável permite a agrupamento de declarações dentro da mesma transação. Para usar esta variável, `autocommit` deve ser desativada primeiro, definindo-a para `0` ou `OFF`; caso contrário, definir `transaction_allow_batching` não tem efeito.

É seguro usar essa variável em transações que realizam apenas gravações, pois, ao ativá-la, pode levar a leituras da imagem "antes". Você deve garantir que quaisquer transações pendentes sejam comprometidas (usando um `COMMIT` explícito, se desejado) antes de emitir um `SELECT`.

Importante

`transaction_allow_batching` não deve ser usado sempre que houver a possibilidade de que os efeitos de uma declaração dada dependem do resultado de uma declaração anterior dentro da mesma transação.

Esta variável é atualmente compatível apenas com o NDB Cluster.

As variáveis do sistema na lista a seguir estão todas relacionadas ao banco de dados de informações `ndbinfo`.

* `ndbinfo_database`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Mostra o nome usado para o banco de dados de informações `NDB`; o padrão é `ndbinfo`. Esta é uma variável somente de leitura cujo valor é determinado no momento da compilação.

* `ndbinfo_max_bytes`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Utilizado apenas para testes e depuração.

* `ndbinfo_max_rows`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Utilizado apenas para testes e depuração.

* `ndbinfo_offline`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Coloque o banco de dados `ndbinfo` no modo offline, no qual as tabelas e visualizações podem ser abertas mesmo quando elas não existem na realidade, ou quando elas existem, mas têm definições diferentes em `NDB`. Não são retornadas strings a partir dessas tabelas (ou visualizações).

* `ndbinfo_show_hidden`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Se as tabelas internas subjacentes do banco de dados `ndbinfo` são ou não exibidas no cliente **mysql**. O padrão é `OFF`.

Nota

Quando o `ndbinfo_show_hidden` está habilitado, as tabelas internas são exibidas apenas no banco de dados `ndbinfo`; elas não são visíveis em `TABLES` ou em outras tabelas `INFORMATION_SCHEMA`, independentemente da configuração da variável.

* `ndbinfo_table_prefix`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

O prefixo usado no nome das tabelas de base do banco de dados ndbinfo (normalmente oculto, a menos que exposto ao definir `ndbinfo_show_hidden`). Esta é uma variável somente de leitura cujo valor padrão é `ndb$`; o próprio prefixo é determinado no momento da compilação.

* `ndbinfo_version`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Mostra a versão do motor `ndbinfo` em uso; somente leitura.

##### 21.4.3.9.3 Variáveis de status do cluster NDB

Esta seção fornece informações detalhadas sobre as variáveis de status do servidor MySQL que se relacionam ao NDB Cluster e ao motor de armazenamento `NDB`. Para variáveis de status que não são específicas ao NDB Cluster e para informações gerais sobre o uso de variáveis de status, consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

* `Handler_discover`

O servidor MySQL pode perguntar ao mecanismo de armazenamento `NDBCLUSTER` se ele conhece uma tabela com um nome dado. Isso é chamado de descoberta. `Handler_discover` indica o número de vezes que as tabelas foram descobertas usando esse mecanismo.

* `Ndb_api_adaptive_send_deferred_count`

Número de chamadas de envio adaptativo que não foram realmente enviadas.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_deferred_count_session`

Número de chamadas de envio adaptativo que não foram realmente enviadas.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_deferred_count_slave`

Número de chamadas de envio adaptativo que não foram realmente enviadas por esta réplica.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count`

Número de chamadas de envio adaptativas enviadas usando envio forçado por este servidor MySQL (nó SQL).

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count_session`

Número de chamadas de envio adaptativas com envio forçado nessa sessão do cliente.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count_slave`

Número de chamadas de envio adaptativas enviadas usando envio forçado por esta réplica.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count`

Número de chamadas de envio adaptativas sem envio forçado enviadas por este servidor MySQL (nó SQL).

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count_session`

Número de chamadas de envio adaptativo sem envio forçado nessa sessão do cliente.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count_slave`

Número de chamadas de envio adaptativas sem envio forçado enviadas por esta réplica.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_sent_count_session`

Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_sent_count_slave`

Quantidade de dados (em bytes) enviados para os nós de dados por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_sent_count`

Quantidade de dados (em bytes) enviados aos nós de dados por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_received_count_session`

Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_received_count_slave`

Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_bytes_received_count`

Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_data_count_injector`

O número de eventos de mudança de string recebidos pelo thread do injetor binlog do NDB.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_data_count`

O número de eventos de mudança de string recebidos por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_nondata_count_injector`

O número de eventos recebidos, exceto eventos de mudança de string, pelo thread de inserção de log binário do NDB.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_nondata_count`

O número de eventos recebidos, exceto eventos de mudança de string, por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_bytes_count_injector`

O número de bytes de eventos recebidos pelo thread do injetor binlog do NDB.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_bytes_count`

O número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count_session`

O número de operações nesta sessão do cliente com base em ou que utilizam chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de auto-incremento, bem como operações de chave primária visíveis pelo usuário.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count_slave`

O número de operações realizadas por esta réplica com base em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, bem como operações de chave primária visíveis pelo usuário.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count`

O número de operações desse servidor MySQL (nó SQL) com base em ou que utilizam chaves primárias. Isso inclui operações em tabelas blob, operações de desbloqueio implícitas e operações de auto-incremento, bem como operações de chave primária visíveis pelo usuário.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count_session`

O número de varreduras nesta sessão do cliente que foram reduzidas a uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count_slave`

O número de varreduras desta réplica que foram cortadas em uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count`

O número de varreduras deste servidor MySQL (nó SQL) que foram reduzidas a uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_range_scan_count_session`

O número de varreduras de alcance que foram iniciadas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_range_scan_count_slave`

O número de varreduras de alcance que foram iniciadas por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_range_scan_count`

O número de varreduras de alcance que foram iniciadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_read_row_count_session`

O número total de strings que foram lidas nesta sessão do cliente. Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_read_row_count_slave`

O número total de strings que foram lidas por esta réplica. Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_read_row_count`

O número total de strings que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura feita por este servidor MySQL (nó SQL).

Você deve estar ciente de que esse valor pode não ser completamente preciso em relação às strings lidas por consultas `SELECT` e `COUNT(*)`, devido ao fato de que, neste caso, o servidor MySQL realmente lê pseudo-strings na forma `[table fragment ID]:[number of rows in fragment]` e soma as strings por fragmento para todos os fragmentos na tabela para derivar um contagem estimada para todas as strings. `Ndb_api_read_row_count` usa essa estimativa e não o número real de strings na tabela.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_scan_batch_count_session`

O número de lotes de strings recebidos nesta sessão do cliente. Um lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_scan_batch_count_slave`

O número de lotes de strings recebidos por esta réplica. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_scan_batch_count`

O número de lotes de strings recebidos por este servidor MySQL (nó SQL). 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count_session`

O número de varreduras de tabela que foram iniciadas nesta sessão do cliente, incluindo varreduras de tabelas internas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count_slave`

O número de varreduras de tabela que foram iniciadas por esta réplica, incluindo varreduras de tabelas internas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count`

O número de varreduras de tabela que foram iniciadas por este servidor MySQL (nó SQL), incluindo varreduras de tabelas internas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count_session`

Número de transações abortadas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count_slave`

O número de transações abortadas por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count`

Número de transações abortadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_close_count_session`

O número de transações fechadas nesta sessão do cliente. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_session` e `Ndb_api_trans_abort_count_session`, uma vez que algumas transações podem ter sido revertidas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_close_count_slave`

O número de transações fechadas por esta réplica. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_slave` e `Ndb_api_trans_abort_count_slave`, uma vez que algumas transações podem ter sido revertidas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_close_count`

O número de transações fechadas por este servidor MySQL (nó SQL). Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count` e `Ndb_api_trans_abort_count`, uma vez que algumas transações podem ter sido revertidas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_commit_count_session`

O número de transações realizadas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_commit_count_slave`

O número de transações realizadas por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_commit_count`

O número de transações realizadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count_session`

O número total de strings que foram lidas nesta sessão do cliente. Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count_slave`

O número total de strings que foram lidas por esta réplica. Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count`

O número total de strings que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as strings lidas por qualquer chave primária, chave única ou operação de varredura feita por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_start_count_session`

O número de transações iniciadas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_start_count_slave`

O número de transações iniciadas por esta réplica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_start_count`

O número de transações iniciadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_uk_op_count_session`

O número de operações nesta sessão do cliente com base em ou que utilizam chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_uk_op_count_slave`

O número de operações realizadas por esta réplica com base em ou usando chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_uk_op_count`

O número de operações deste servidor MySQL (nó SQL) com base em ou que utilizam chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count_session`

O número de vezes que um thread foi bloqueado nesta sessão do cliente enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count_slave`

O número de vezes que um thread foi bloqueado por esta replica enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count`

O número de vezes que um thread foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava a conclusão de uma operação. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_meta_request_count_session`

O número de vezes que um thread foi bloqueado nesta sessão do cliente, aguardando um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transação.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_meta_request_count_slave`

O número de vezes que um thread foi bloqueado por esta réplica enquanto aguardava um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transação.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_meta_request_count`

O número de vezes que um thread foi bloqueado por este servidor MySQL (nó SQL) aguardando um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transação.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_nanos_count_session`

Tempo total (em nanosegundos) gasto nesta sessão do cliente esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_nanos_count_slave`

O tempo total (em nanosegundos) gasto por esta réplica esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_nanos_count`

O tempo total (em nanosegundos) gasto por este servidor MySQL (nó SQL) esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_scan_result_count_session`

O número de vezes que um thread foi bloqueado nesta sessão do cliente enquanto aguardava um sinal baseado em varredura, como quando esperando mais resultados de uma varredura, ou quando esperando que a varredura se feche.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste `mysqld`.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_scan_result_count_slave`

O número de vezes que um thread foi bloqueado por esta réplica enquanto aguardava um sinal baseado em varredura, como quando esperando mais resultados de uma varredura, ou quando esperando que a varredura se feche.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global. Se esse servidor MySQL não atuar como uma réplica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_scan_result_count`

O número de vezes que um thread foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava um sinal baseado em varredura, como quando esperando mais resultados de uma varredura, ou quando esperando que a varredura feche.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela tem um escopo efetivamente global.

Para mais informações, consulte a Seção 21.6.14, “Contadores e variáveis de estatísticas da API NDB”.

* `Ndb_cluster_node_id`

Se o servidor estiver atuando como um nó do NDB Cluster, então o valor dessa variável é seu ID de nó no cluster.

Se o servidor não faz parte de um NDB Cluster, então o valor desta variável é 0.

* `Ndb_config_from_host`

Se o servidor faz parte de um NDB Cluster, o valor desta variável é o nome do host ou o endereço IP do servidor de gerenciamento do Cluster, do qual ele obtém seus dados de configuração.

Se o servidor não faz parte de um NDB Cluster, então o valor desta variável é uma string vazia.

* `Ndb_config_from_port`

Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número da porta através da qual ele está conectado ao servidor de gerenciamento do Cluster, do qual ele obtém seus dados de configuração.

Se o servidor não faz parte de um NDB Cluster, então o valor desta variável é 0.

* `Ndb_conflict_fn_epoch`

Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de strings encontradas em conflito usando a resolução de conflitos `NDB$EPOCH()` em um determinado `mysqld` desde a última vez que foi reiniciado.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_fn_epoch_trans`

Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de strings encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS()` em um determinado `mysqld` desde a última vez que foi reiniciado.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_fn_epoch2`

Mostra o número de strings encontradas em conflito na resolução de conflitos da Replicação em NDB Cluster, quando se usa `NDB$EPOCH2()`, na fonte designada como a principal desde a última vez que foi reiniciado.

Para mais informações, consulte NDB$EPOCH2()").

* `Ndb_conflict_fn_epoch2_trans`

Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de strings encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS2()` em um determinado `mysqld` desde a última vez que foi reiniciado.

Para mais informações, consulte (NDB$EPOCH2\_TRANS()").

* `Ndb_conflict_fn_max`

Utilizada na resolução de conflitos de replicação de clúster NDB, essa variável mostra o número de vezes que uma string não foi aplicada no nó SQL atual devido à resolução de conflitos "maior timestamp vence" desde a última vez que este `mysqld` foi iniciado.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_fn_max_del_win`

Mostra o número de vezes que uma string foi rejeitada no nó SQL atual devido à resolução de conflitos da Replicação do NDB Cluster usando `NDB$MAX_DELETE_WIN()`, desde a última vez que este `mysqld` foi iniciado.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_fn_old`

Utilizada na resolução de conflitos de replicação de clúster NDB, essa variável mostra o número de vezes que uma string não foi aplicada como resultado da resolução de conflitos "mesmo timestamp vence" em um dado `mysqld` desde a última vez que foi reiniciado.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_last_conflict_epoch`

A época mais recente em que um conflito foi detectado nesta réplica. Você pode comparar esse valor com `Ndb_slave_max_replicated_epoch`; se `Ndb_slave_max_replicated_epoch` for maior que `Ndb_conflict_last_conflict_epoch`, ainda não foram detectados conflitos.

Consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”, para obter mais informações.

* `Ndb_conflict_reflected_op_discard_count`

Ao usar a resolução de conflitos da replicação do NDB Cluster, este é o número de operações refletidas que não foram aplicadas no secundário, devido ao erro encontrado durante a execução.

Consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”, para obter mais informações.

* `Ndb_conflict_reflected_op_prepare_count`

Ao usar a resolução de conflitos com a Replicação de NDB Cluster, essa variável de status contém o número de operações refletidas que foram definidas (ou seja, preparadas para execução no secundário).

Veja a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_refresh_op_count`

Ao usar a resolução de conflitos com a Replicação de NDB Cluster, isso fornece o número de operações de atualização que foram preparadas para execução no secundário.

Consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”, para obter mais informações.

* `Ndb_conflict_last_stable_epoch`

Número de strings encontradas em conflito por uma função de conflito transacional

Consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”, para obter mais informações.

* `Ndb_conflict_trans_row_conflict_count`

Utilizado na resolução de conflitos da replicação do NDB Cluster, essa variável de status mostra o número de strings encontradas diretamente em conflito por uma função de conflito transacional em um dado `mysqld` desde a última vez que foi reiniciado.

Atualmente, a única função de detecção de conflitos transacionais suportada pelo NDB Cluster é NDB$EPOCH_TRANS(), então essa variável de status é efetivamente a mesma que `Ndb_conflict_fn_epoch_trans`.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_trans_row_reject_count`

Utilizado na resolução de conflitos da replicação do NDB Cluster, essa variável de status mostra o número total de strings realinhadas porque foram determinadas como conflitantes por uma função de detecção de conflitos transacional. Isso inclui não apenas `Ndb_conflict_trans_row_conflict_count`, mas também quaisquer strings em conflitos ou dependentes de transações conflitantes.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_trans_reject_count`

Utilizado na resolução de conflitos da replicação do NDB Cluster, essa variável de status mostra o número de transações que foram encontradas em conflito por uma função de detecção de conflitos transacionais.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_trans_detect_iter_count`

Utilizado na resolução de conflitos da replicação do NDB Cluster, este mostra o número de iterações internas necessárias para confirmar uma transação de época. Deve ser (levemente) maior ou igual a `Ndb_conflict_trans_conflict_commit_count`.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_conflict_trans_conflict_commit_count`

Utilizado na resolução de conflitos da replicação de clúster NDB, este mostra o número de transações de época comprometidas após elas terem exigido o tratamento de conflitos transacionais.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_epoch_delete_delete_count`

Ao usar a detecção de conflitos delete-delete, este é o número de conflitos delete-delete detectados, onde uma operação de exclusão é aplicada, mas a string indicada não existe.

* `Ndb_execute_count`

Fornece o número de viagens de ida e volta ao kernel `NDB` feitas por operações.

* `Ndb_last_commit_epoch_server`

A época mais recentemente comprometida por `NDB`.

* `Ndb_last_commit_epoch_session`

A época mais recentemente realizada por este cliente do `NDB`.

* `Ndb_number_of_data_nodes`

Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número de nós de dados no cluster.

Se o servidor não faz parte de um NDB Cluster, então o valor desta variável é 0.

* `Ndb_pushed_queries_defined`

O número total de junções foi reduzido ao núcleo NDB para o tratamento distribuído nos nós de dados.

Nota

Os testes realizados com `EXPLAIN` que podem ser reduzidos contribuem para esse número.

* `Ndb_pushed_queries_dropped`

O número de junções que foram empurradas para o núcleo NDB, mas que não puderam ser tratadas lá.

* `Ndb_pushed_queries_executed`

O número de junções que foram com sucesso reduzidas para `NDB` e executadas lá.

* `Ndb_pushed_reads`

O número de strings devolvidas a `mysqld` pelo kernel NDB através de junções que foram empurradas para baixo.

Nota

A execução de `EXPLAIN` em junções que podem ser reduzidas a `NDB` não aumenta esse número.

* `Ndb_pruned_scan_count`

Esta variável contém um contador do número de varreduras executadas por `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez, onde `NDBCLUSTER` conseguiu usar o corte de partição.

Usar essa variável juntamente com `Ndb_scan_count` pode ser útil no projeto do esquema para maximizar a capacidade do servidor de podar os scans em uma única partição da tabela, envolvendo assim apenas um único nó de dados.

* `Ndb_scan_count`

Essa variável contém um contador do número total de varreduras executadas por `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez.

* `Ndb_slave_max_replicated_epoch`

A época mais recentemente comprometida nesta réplica. Você pode comparar esse valor com `Ndb_conflict_last_conflict_epoch`; se `Ndb_slave_max_replicated_epoch` é o maior dos dois, ainda não foram detectados conflitos.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `Ndb_system_name`

Se este servidor MySQL estiver conectado a um clúster NDB, essa variável somente de leitura mostrará o nome do sistema do clúster. Caso contrário, o valor é uma string vazia.

#### 21.4.3.10 Conexões de cluster TCP/IP do NDB

O TCP/IP é o mecanismo de transporte padrão para todas as conexões entre os nós em um NDB Cluster. Normalmente, não é necessário definir conexões TCP/IP; o NDB Cluster configura automaticamente essas conexões para todos os nós de dados, nós de gerenciamento e nós de SQL ou API.

Nota

Para uma exceção a essa regra, consulte a Seção 21.4.3.11, "Conexões de NDB Cluster TCP/IP usando conexões diretas".

Para substituir os parâmetros de conexão padrão, é necessário definir uma conexão usando uma ou mais seções `[tcp]` no arquivo `config.ini`. Cada seção `[tcp]` define explicitamente uma conexão TCP/IP entre dois nós do NDB Cluster e deve conter, no mínimo, os parâmetros `NodeId1` e `NodeId2`, bem como quaisquer parâmetros de conexão a serem substituídos.

É também possível alterar os valores padrão desses parâmetros, definindo-os na seção `[tcp default]`.

Importante

Quaisquer seções do `[tcp]` no arquivo `config.ini` devem ser listadas *últimas*, seguindo todas as outras seções do arquivo. No entanto, essa exigência não é necessária para uma seção do `[tcp default]`. Esse requisito é um problema conhecido sobre a forma como o arquivo `config.ini` é lido pelo servidor de gerenciamento do NDB Cluster.

Os parâmetros de conexão que podem ser configurados nas seções `[tcp]` e `[tcp default]` do arquivo `config.ini` estão listados aqui:

* `Checksum`

  <table frame="box" rules="all" summary="Checksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro é um parâmetro booleano (ativado definindo-o como `Y` ou `1`, desativado definindo-o como `N` ou `0`). Ele é desativado por padrão. Quando ativado, os checksums de todas as mensagens são calculados antes de serem colocados no buffer de envio. Esta funcionalidade garante que as mensagens não sejam corrompidas enquanto aguardam no buffer de envio ou pelo mecanismo de transporte.

* `Group`

Quando o `ndb_optimized_node_selection` está habilitado, a proximidade do nó é usada em alguns casos para selecionar qual nó deve ser conectado. Este parâmetro pode ser usado para influenciar a proximidade, definindo-o como um valor menor, que é interpretado como “mais próximo”. Consulte a descrição da variável do sistema para obter mais informações.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão TCP específica entre dois nós. Os valores utilizados para esses parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão TCP específica entre dois nós. Os valores utilizados para esses parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Para identificar uma conexão entre dois nós, é necessário fornecer seus IDs de nó na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e `NodeId2`. Esses são os mesmos valores únicos `Id` para cada um desses nós, conforme descrito na Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Para identificar uma conexão entre dois nós, é necessário fornecer seus IDs de nó na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e `NodeId2`. Esses são os mesmos valores únicos `Id` para cada um desses nós, conforme descrito na Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

* `NodeIdServer`

  <table frame="box" rules="all" summary="NodeIdServer TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Configure o lado servidor de uma conexão TCP.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Quando há mais do que isso de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que devem estar presentes no buffer de envio antes que a conexão seja considerada sobrecarregada. Consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”, para obter mais informações.

* `PortNumber` (*OBSOLETE*)

Este parâmetro especificava anteriormente o número de porta a ser usado para ouvir conexões de outros nós. Ele é agora desatualizado (e removido no NDB Cluster 7.5); use o parâmetro de configuração do nó de dados `ServerPort` para esse propósito, em vez disso (Bug #77405, Bug #21280456).

* `PreSendChecksum`

  <table frame="box" rules="all" summary="PreSendChecksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver habilitado também.

* `Proxy`

  <table frame="box" rules="all" summary="Proxy TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Defina um proxy para a conexão TCP.

* `ReceiveBufferMemory`

  <table frame="box" rules="all" summary="ReceiveBufferMemory TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>2M</td> </tr><tr> <th>Gama</th> <td>16K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Especifica o tamanho do buffer usado ao receber dados do socket TCP/IP.

O valor padrão deste parâmetro é de 2 MB. O valor mínimo possível é de 16 KB; o máximo teórico é de 4 GB.

* `SendBufferMemory`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Os transportadores TCP utilizam um buffer para armazenar todas as mensagens antes de realizar a chamada de envio ao sistema operacional. Quando esse buffer atinge 64 KB, seu conteúdo é enviado; também são enviados quando uma rodada de mensagens é executada. Para lidar com situações de sobrecarga temporária, também é possível definir um buffer de envio maior.

Se este parâmetro for definido explicitamente, a memória não será dedicada a cada transportador; em vez disso, o valor utilizado indica o limite rígido para a quantidade de memória (dentre a memória total disponível — ou seja, `TotalSendBufferMemory`) que pode ser usada por um único transportador. Para mais informações sobre a configuração da alocação dinâmica de memória de buffer de envio de transportador no NDB Cluster, consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”.

O tamanho padrão do buffer de envio é de 2 MB, que é o tamanho recomendado na maioria das situações. O tamanho mínimo é de 64 KB; o tamanho teórico máximo é de 4 GB.

* `SendSignalId`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Para ser possível rastrear um datagrama de mensagem distribuída, é necessário identificar cada mensagem. Quando este parâmetro é definido como `Y`, os IDs das mensagens são transportados pela rede. Este recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

* `TcpBind_INADDR_ANY`

Definir este parâmetro para `TRUE` ou `1` vincula `IP_ADDR_ANY` de modo que conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

* `TCP_MAXSEG_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Determina o tamanho do conjunto de memória durante a inicialização do transportador TCP. O padrão é recomendado para a maioria dos casos de uso comuns.

* `TCP_RCV_BUF_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Determina o tamanho do buffer de recebimento definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma definam esse valor. O padrão é recomendado para a maioria dos casos de uso comuns.

* `TCP_SND_BUF_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Determina o tamanho do buffer de envio definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma definam esse valor. O padrão é recomendado para a maioria dos casos de uso comuns.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.19 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

#### 21.4.3.11 Conexões de cluster TCP/IP do NDB usando conexões diretas

Para configurar um clúster usando conexões diretas entre os nós de dados, é necessário especificar explicitamente os endereços IP de crossover dos nós de dados conectados na seção `[tcp]` do arquivo de clúster `config.ini`.

No exemplo a seguir, imaginamos um clúster com pelo menos quatro hosts, um para cada um dos servidores de gerenciamento, um nó SQL e dois nós de dados. O clúster como um todo reside na sub-rede `172.23.72.*` de uma LAN. Além das conexões de rede usuais, os dois nós de dados são conectados diretamente usando um cabo crossover padrão e se comunicam diretamente usando endereços IP na faixa de endereços `1.1.0.*` como mostrado:

```sql
# Management Server
[ndb_mgmd]
Id=1
HostName=172.23.72.20

# SQL Node
[mysqld]
Id=2
HostName=172.23.72.21

# Data Nodes
[ndbd]
Id=3
HostName=172.23.72.22

[ndbd]
Id=4
HostName=172.23.72.23

# TCP/IP Connections
[tcp]
NodeId1=3
NodeId2=4
HostName1=1.1.0.1
HostName2=1.1.0.2
```

Os parâmetros `HostName1` e `HostName2` são usados apenas ao especificar conexões diretas.

O uso de conexões TCP diretas entre os nós de dados pode melhorar a eficiência geral do clúster, permitindo que os nós de dados ignorem um dispositivo Ethernet, como um switch, um hub ou um roteador, reduzindo assim a latência do clúster.

Nota

Para tirar o melhor proveito das conexões diretas dessa forma com mais de dois nós de dados, você deve ter uma conexão direta entre cada nó de dados e todos os outros nós de dados do mesmo grupo de nós.

#### 21.4.3.12 Conexões de Memória Compartilhada do Aglomerado NDB

As comunicações entre os nós do cluster do NDB são normalmente gerenciadas usando TCP/IP. O transportador de memória compartilhada (SHM) se destaca pelo fato de que os sinais são transmitidos escrevendo na memória em vez de em uma porta. O transportador de memória compartilhada (SHM) pode melhorar o desempenho ao negar até 20% do overhead necessário por uma conexão TCP ao executar um nó de API (geralmente um nó SQL) e um nó de dados juntos no mesmo host. Você pode habilitar uma conexão de memória compartilhada de qualquer uma das duas maneiras listadas aqui:

* Definindo o parâmetro de configuração do nó de dados `UseShm` para `1`, e definindo `HostName` para o nó de dados e `HostName` para o nó da API para o mesmo valor.

* Ao usar as seções `[shm]` no arquivo de configuração do cluster, cada uma contendo configurações para `NodeId1` e `NodeId2`. Esse método é descrito com mais detalhes mais adiante nesta seção.

Suponha que um clúster esteja executando um nó de dados que tem o ID de nó 1 e um nó SQL com o ID de nó 51 no mesmo computador host em 10.0.0.1. Para habilitar uma conexão SHM entre esses dois nós, tudo o que é necessário é garantir que as seguintes entradas estejam incluídas no arquivo de configuração do clúster:

```sql
[ndbd]
NodeId=1
HostName=10.0.0.1
UseShm=1

[mysqld]
NodeId=51
HostName=10.0.0.1
```

Importante

As duas entradas que acabamos de mostrar estão além de quaisquer outras entradas e configurações de parâmetros necessárias pelo clúster. Um exemplo mais completo é mostrado mais adiante nesta seção.

Antes de começar os nós de dados que utilizam conexões SHM, também é necessário garantir que o sistema operacional em cada computador que hospeda um desses nós de dados tenha memória suficiente alocada para segmentos de memória compartilhada. Consulte a documentação da sua plataforma operacional para obter informações sobre isso. Em configurações em que vários hosts estão executando cada um um nó de dados e um nó de API, é possível habilitar a memória compartilhada em todos esses hosts, definindo `UseShm` na seção `[ndbd default]` do arquivo de configuração. Isso é mostrado no exemplo mais adiante nesta seção.

Embora não seja estritamente necessário, o ajuste para todas as conexões SHM no clúster pode ser feito definindo um ou mais dos seguintes parâmetros na seção `[shm default]` do arquivo de configuração do clúster (`config.ini`):

* `ShmSize`: Tamanho da memória compartilhada

* `ShmSpinTime`: Tempo em µs para girar antes de dormir

* `SendBufferMemory`: Tamanho do buffer para sinais enviados a partir deste nó, em bytes.

* `SendSignalId`: Indica que um ID de sinal é incluído em cada sinal enviado através do transportador.

* `Checksum`: Indica que um checksum está incluído em cada sinal enviado através do transportador.

* `PreSendChecksum`: As verificações do checksum são feitas antes de enviar o sinal; o checksum também deve ser habilitado para que isso funcione

Este exemplo mostra uma configuração simples com conexões SHM definidas em vários hosts, em um NDB Cluster usando 3 computadores listados aqui por nome de host, hospedando os tipos de nó mostrados:

1. `10.0.0.0`: O servidor de gerenciamento
2. `10.0.0.1`: Um nó de dados e um nó SQL
3. `10.0.0.2`: Um nó de dados e um nó SQL

Nesse cenário, cada nó de dados comunica-se tanto com o servidor de gerenciamento quanto com o outro nó de dados usando transportadores TCP; cada nó SQL usa um transportador de memória compartilhada para se comunicar com os nós de dados que são locais para ele e um transportador TCP para se comunicar com o nó de dados remoto. Uma configuração básica que reflete essa configuração é ativada pelo arquivo config.ini, cujos conteúdos são mostrados aqui:

```sql
[ndbd default]
DataDir=/path/to/datadir
UseShm=1

[shm default]
ShmSize=8M
ShmSpintime=200
SendBufferMemory=4M

[tcp default]
SendBufferMemory=8M

[ndb_mgmd]
NodeId=49
Hostname=10.0.0.0
DataDir=/path/to/datadir

[ndbd]
NodeId=1
Hostname=10.0.0.1
DataDir=/path/to/datadir

[ndbd]
NodeId=2
Hostname=10.0.0.2
DataDir=/path/to/datadir

[mysqld]
NodeId=51
Hostname=10.0.0.1

[mysqld]
NodeId=52
Hostname=10.0.0.2

[api]
[api]
```

Os parâmetros que afetam todos os transportadores de memória compartilhada são definidos na seção `[shm default]`; esses parâmetros podem ser sobrescritos por conexão em uma ou mais seções `[shm]`. Cada seção deve ser associada a uma conexão SHM específica usando `NodeId1` e `NodeId2`; os valores necessários para esses parâmetros são os IDs dos nós dos dois nós conectados pelo transportador. Você também pode identificar os nós pelo nome do host usando `HostName1` e `HostName2`, mas esses parâmetros não são necessários.

Os nós da API para os quais não são definidos nomes de host utilizam o transportador TCP para se comunicar com nós de dados independentes dos hosts nos quais são iniciados; os parâmetros e valores definidos na seção `[tcp default]` do arquivo de configuração aplicam-se a todos os transportadores TCP do clúster.

Para um desempenho ótimo, você pode definir um tempo de rotação para o transportador SHM (parâmetro `ShmSpinTime`). Isso afeta tanto o thread do receptor do nó de dados quanto o proprietário da pesquisa (thread de recepção ou thread do usuário) em `NDB`.

* `Checksum`

  <table frame="box" rules="all" summary="Checksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>true</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Este parâmetro é um parâmetro booleano (`Y`/`N`) que é desativado por padrão. Quando é ativado, os checksums de todas as mensagens são calculados antes de serem colocados no buffer de envio.

Essa funcionalidade impede que as mensagens sejam corrompidas enquanto estão esperando no buffer de envio. Ela também serve como uma verificação contra a corrupção dos dados durante o transporte.

* `Group`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Determina a proximidade do grupo; um valor menor é interpretado como estando mais próximo. O valor padrão é suficiente para a maioria das condições.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão SHM específica entre dois nós. Os valores utilizados para esses parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão SHM específica entre dois nós. Os valores utilizados para esses parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Para identificar uma conexão entre dois nós, é necessário fornecer identificadores de nó para cada um deles, como `NodeId1` e `NodeId2`.

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Para identificar uma conexão entre dois nós, é necessário fornecer identificadores de nó para cada um deles, como `NodeId1` e `NodeId2`.

* `NodeIdServer`

  <table frame="box" rules="all" summary="NodeIdServer shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Identifique o extremo do servidor de uma conexão de memória compartilhada. Por padrão, este é o ID do nó do nó de dados.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Quando há mais do que isso de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que devem estar presentes no buffer de envio antes de a conexão ser considerada sobrecarregada. Consulte a Seção 21.4.3.13, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”, e a Seção 21.6.15.44, “A Tabela de Transportadores ndbinfo”, para obter mais informações.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.1</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento e o reinício completos do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Defina o porto a ser utilizado pelo transportador SHM.

* `PreSendChecksum`

  <table frame="box" rules="all" summary="PreSendChecksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver habilitado também.

* `SendBufferMemory`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

Tamanho (em bytes) do buffer de memória compartilhada para sinais enviados a partir deste nó usando uma conexão de memória compartilhada.

* `SendSignalId`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

Para rastrear o caminho de uma mensagem distribuída, é necessário fornecer a cada mensagem um identificador único. Definir este parâmetro para `Y` faz com que esses IDs de mensagem sejam transportados pela rede também. Este recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

* `ShmKey`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

Ao configurar segmentos de memória compartilhada, um ID de nó, expresso como um número inteiro, é usado para identificar de forma única o segmento de memória compartilhada a ser usado para a comunicação. Não há um valor padrão. Se `UseShm` estiver habilitado, a chave da memória compartilhada é calculada automaticamente por `NDB`.

* `ShmSize`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

Cada conexão SHM tem um segmento de memória compartilhada onde as mensagens entre os nós são colocadas pelo remetente e lidas pelo leitor. O tamanho desse segmento é definido por `ShmSize`. O valor padrão no NDB 7.6 é de 4 MB.

* `ShmSpinTime`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

Ao receber, o tempo para esperar antes de dormir, em microsegundos.

* `SigNum`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

Este parâmetro não é mais utilizado no NDB 7.6, no qual qualquer configuração para ele é ignorada.

O que se segue aplica apenas no NDB 7.5 (e versões anteriores):

Ao usar o transportador de memória compartilhada, um processo envia um sinal ao sistema operacional ao outro quando há novos dados disponíveis na memória compartilhada. Se esse sinal entrar em conflito com um sinal existente, este parâmetro pode ser usado para alterá-lo. Esta é uma possibilidade ao usar SHM devido ao fato de que diferentes sistemas operacionais usam números de sinal diferentes.

O valor padrão de `SigNum` é 0; portanto, ele deve ser definido para evitar erros no log do clúster ao usar o transportador de memória compartilhada. Normalmente, este parâmetro é definido para 10 na seção `[shm default]` do arquivo `config.ini`.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.20 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>6

#### 21.4.3.13 Configurando parâmetros do buffer de envio do NDB Cluster

O kernel `NDB` emprega um buffer de envio unificado cuja memória é alocada dinamicamente a partir de um conjunto compartilhado por todos os transportadores. Isso significa que o tamanho do buffer de envio pode ser ajustado conforme necessário. A configuração do buffer de envio unificado pode ser realizada definindo os seguintes parâmetros:

* **TotalSendBufferMemory.** Este parâmetro pode ser definido para todos os tipos de nós do NDB Cluster, ou seja, pode ser definido nas seções `[ndbd]`, `[mgm]` e `[api]` (ou `[mysql]`) do arquivo `config.ini`. Representa a quantidade total de memória (em bytes) que será alocada por cada nó para o qual é definido para uso entre todos os transportadores configurados. Se definido, seu mínimo é de 256 KB; o máximo é de 4294967039.

Para ser compatível com configurações existentes, este parâmetro assume como valor padrão a soma dos tamanhos máximos dos buffers de envio de todos os transportadores configurados, mais 32 KB (uma página) por transportador. O máximo depende do tipo de transportador, conforme mostrado na tabela a seguir:

**Tabela 21.21 Tipos de transportador com tamanhos máximos de buffer de envio**

  <table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Transporter</th> <th>Tamanho máximo do buffer de envio (bytes)</th> </tr></thead><tbody><tr> <td>TCP</td> <td><code>SendBufferMemory</code>(padrão = 2M)</td> </tr><tr> <td>SHM</td> <td>20K</td> </tr></tbody></table>

Isso permite que as configurações existentes funcionem de maneira muito semelhante àquelas que eram usadas com o NDB Cluster 6.3 e versões anteriores, com a mesma quantidade de memória e espaço de buffer de envio disponível para cada transportador. No entanto, a memória que não é usada por um transportador não está disponível para outros transportadores.

* **OverloadLimit.** Este parâmetro é utilizado na seção `config.ini` do arquivo `[tcp]` e denota a quantidade de dados não enviados (em bytes) que devem estar presentes no buffer de envio antes que a conexão seja considerada sobrecarregada. Quando ocorre tal condição de sobrecarga, as transações que afetam a conexão sobrecarregada falham com o Erro de API NDB 1218 (Bufetes de envio sobrecarregados no kernel NDB) até que o status de sobrecarga passe. O valor padrão é 0, no qual caso o limite de sobrecarga efetiva é calculado como `SendBufferMemory * 0.8` para uma conexão dada. O valor máximo para este parâmetro é 4G.

* **SendBufferMemory.** Este valor denota um limite rígido para a quantidade de memória que pode ser usada por um único transportador de todo o conjunto especificado por `TotalSendBufferMemory`. No entanto, a soma de `SendBufferMemory` para todos os transportadores configurados pode ser maior que o `TotalSendBufferMemory` que é definido para um nó específico. Esta é uma maneira de economizar memória quando muitos nós estão em uso, desde que a quantidade máxima de memória nunca seja exigida por todos os transportadores ao mesmo tempo.

* **ReservedSendBufferMemory.** Removido antes do GA do NDB 7.5.

  <table frame="box" rules="all" summary="ReservedSendBufferMemory data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>256K</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">reinício em rotação</a>do cluster. (NDB 7.5.0)</p></td> </tr></tbody></table>

Anteriormente, esse parâmetro do nó de dados estava presente, mas não era realmente usado (Bug #77404, Bug #21280428).

Você pode usar a tabela `ndbinfo.transporters` para monitorar o uso da memória do buffer de envio e detectar condições de lentidão e sobrecarga que podem afetar negativamente o desempenho.

### 21.4.4 Usando interconexões de alta velocidade com o NDB Cluster

Mesmo antes do início do projeto do `NDBCLUSTER` em 1996, era evidente que um dos principais problemas que seriam encontrados na construção de bancos de dados paralelos seria a comunicação entre os nós da rede. Por essa razão, o `NDBCLUSTER` foi projetado desde o início para permitir o uso de vários mecanismos de transporte de dados diferentes, ou transportadores.

O NDB Cluster 7.5 e 7.6 suportam três desses (veja Seção 21.2.1, “Conceitos Básicos do NDB Cluster”). Um quarto transportador, a Interface Coerente Escalável (SCI), também era suportado em versões muito antigas do `NDB`. Isso exigia hardware, software e binários do MySQL especializados que não estão mais disponíveis.