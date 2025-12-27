#### 25.4.2.3 Parâmetros de Configuração de Nó SQL e Nó de API do NDB Cluster

A lista nesta seção fornece informações sobre os parâmetros usados nas seções `[mysqld]` e `[api]` de um arquivo `config.ini` para configurar os nós SQL e nós de API do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 25.4.3.7, “Definindo Nodos SQL e Outros Nodos de API em um NDB Cluster”.

* `ApiVerbose`: Ativa a depuração da API NDB; para desenvolvimento do NDB.

* `ArbitrationDelay`: Quando solicitado a arbitrar, o árbitro aguarda este número de milissegundos antes de votar.

* `ArbitrationRank`: Se 0, então o nó de API não é árbitro. O kernel seleciona os árbitros na ordem 1, 2.

* `AutoReconnect`: Especifica se um nó de API deve se reconectar completamente quando desconectado do cluster.

* `BatchByteSize`: Tamanho padrão do lote em bytes.

* `BatchSize`: Tamanho padrão do lote em número de registros.

* `ConnectBackoffMaxTime`: Especifica o tempo máximo em milissegundos (~resolução de 100ms) para permitir entre tentativas de conexão a qualquer nó de dados por este nó de API. Exclui o tempo decorrido enquanto as tentativas de conexão estão em andamento, o que, no pior dos casos, pode levar vários segundos. Desative definindo para 0. Se nenhum nó de dados estiver conectado a este nó de API atualmente, o StartConnectBackoffMaxTime é usado em vez disso.

* `ConnectionMap`: Especifica quais nós de dados devem ser conectados.

* `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para mapas de hash de tabelas. Três valores são suportados: 0, 240 e 3840.

* `DefaultOperationRedoProblemAction`: Como as operações são tratadas em eventos em que o contador de RedoOverCommit é excedido.

* `ExecuteOnComputer`: Uma string que faz referência ao COMPUTADOR definido anteriormente.

* `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além da alocada por `TotalSendBufferMemory` ou `SendBufferMemory`. O padrão (0) permite até 16 MB.

* `HeartbeatThreadPriority`: Defina a política e a prioridade do thread de batida de coração para os nós da API; consulte o manual para os valores permitidos.

* `HostName`: Nome do host ou endereço IP para este nó da API ou do servidor MySQL.

* `Id`: Número que identifica o servidor MySQL ou o nó da API (Id). Agora desatualizado; use NodeId.

* `LocationDomainId`: Atribua este nó da API a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco.

* `MaxScanBatchSize`: Tamanho máximo do lote coletivo para uma varredura.

* `NodeId`: Número que identifica de forma única o nó da API ou do servidor MySQL entre todos os nós do clúster.

* `StartConnectBackoffMaxTime`: O mesmo que ConnectBackoffMaxTime, exceto que este parâmetro é usado no seu lugar se nenhum nó de dados estiver conectado a este nó da API.

* `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

* `wan`: Use a configuração de TCP WAN como padrão.

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte a Seção 25.4.3.9.1, “Opções do Servidor MySQL para o NDB Cluster”. Para informações sobre as variáveis de sistema do servidor MySQL relacionadas ao NDB Cluster, consulte a Seção 25.4.3.9.2, “Variáveis de Sistema do NDB Cluster”.

Nota

Para adicionar novos nós da API ou do servidor MySQL à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do clúster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós da API ou do servidor MySQL possam se conectar ao clúster.

Não é *necessário* realizar qualquer reinício do clúster se novos nós da API ou da API puderem empregar slots de API não utilizados anteriormente na configuração da API para se conectarem ao clúster.