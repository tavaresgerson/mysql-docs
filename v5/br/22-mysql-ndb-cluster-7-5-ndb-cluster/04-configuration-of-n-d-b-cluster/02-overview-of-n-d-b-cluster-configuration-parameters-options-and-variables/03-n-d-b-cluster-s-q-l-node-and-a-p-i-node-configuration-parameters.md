#### 21.4.2.3 Parâmetros de Configuração de Nó SQL e Nó API do NDB Cluster

A lista nesta seção fornece informações sobre os parâmetros usados nas seções `[mysqld]` e `[api]` de um arquivo `config.ini` para configurar nós SQL e nós API do NDB Cluster. Para descrições detalhadas e informações adicionais sobre cada um desses parâmetros, consulte [Seção 21.4.3.7, “Definindo Nós SQL e Outros Nós API em um NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Definindo Nós SQL e Outros Nós API em um NDB Cluster").

* `ApiVerbose`: Habilita a depuração da NDB API; para desenvolvimento NDB.

* `ArbitrationDelay`: Quando solicitado a arbitrar, o árbitro espera esta quantidade de milissegundos antes de votar.

* `ArbitrationRank`: Se 0, o nó API não é árbitro. O Kernel seleciona árbitros na ordem 1, 2.

* `AutoReconnect`: Especifica se um nó API deve se reconectar totalmente quando desconectado do Cluster.

* `BatchByteSize`: Tamanho de Batch padrão em bytes.

* `BatchSize`: Tamanho de Batch padrão em número de registros.

* `ConnectBackoffMaxTime`: Especifica o tempo máximo em milissegundos (resolução de ~100ms) permitido entre as tentativas de conexão a qualquer nó de dados por este nó API. Exclui o tempo decorrido enquanto as tentativas de conexão estão em andamento, o que, no pior caso, pode levar vários segundos. Desative definindo como 0. Se nenhum nó de dados estiver atualmente conectado a este nó API, `StartConnectBackoffMaxTime` é usado em seu lugar.

* `ConnectionMap`: Especifica a quais nós de dados se conectar.

* `DefaultHashMapSize`: Define o tamanho (em buckets) a ser usado para hash maps de tabela. Três valores são suportados: 0, 240 e 3840.

* `DefaultOperationRedoProblemAction`: Como as operações são tratadas caso o `RedoOverCommitCounter` seja excedido.

* `ExecuteOnComputer`: String que faz referência a um `COMPUTER` definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para send buffers além de qualquer memória alocada por `TotalSendBufferMemory` ou `SendBufferMemory`. O padrão (0) permite até 16MB.

* `HeartbeatThreadPriority`: Define a política e a prioridade da Thread de Heartbeat para nós API; consulte o manual para valores permitidos.

* `HostName`: Nome de Host ou endereço IP para este nó SQL ou API.

* `Id`: Número que identifica o servidor MySQL ou o nó API (Id). Agora obsoleto; use `NodeId` em seu lugar.

* `LocationDomainId`: Atribui este nó API a um domínio ou zona de disponibilidade específico. 0 (padrão) deixa este campo não definido.

* `MaxScanBatchSize`: Tamanho máximo coletivo de Batch para um Scan.

* `NodeId`: Número que identifica de forma única o nó SQL ou o nó API entre todos os nós no Cluster.

* `StartConnectBackoffMaxTime`: O mesmo que `ConnectBackoffMaxTime`, exceto que este parâmetro é usado em seu lugar se nenhum nó de dados estiver conectado a este nó API.

* `TotalSendBufferMemory`: Memória total a ser usada para todos os send buffers de transportadores.

* `wan`: Usa a configuração WAN TCP como padrão.

Para uma discussão sobre as opções do servidor MySQL para NDB Cluster, consulte [Seção 21.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 Opções do Servidor MySQL para NDB Cluster"). Para obter informações sobre variáveis de sistema do servidor MySQL relacionadas ao NDB Cluster, consulte [Seção 21.4.3.9.2, “Variáveis de Sistema do NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 Variáveis de Sistema do NDB Cluster").

Note

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um *rolling restart* de todos os nós do Cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao Cluster.

*Não* é necessário realizar qualquer restart do Cluster se os novos nós SQL ou API puderem usar slots API não utilizados anteriormente na configuração do Cluster para se conectar ao Cluster.