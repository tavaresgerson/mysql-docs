#### 21.4.2.3 Parâmetros de configuração do nó SQL do cluster NDB e do nó API

A listagem nesta seção fornece informações sobre os parâmetros usados nas seções `[mysqld]` e `[api]` de um arquivo `config.ini` para configurar os nós SQL do NDB Cluster e os nós API. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte Seção 21.4.3.7, “Definindo nós SQL e outros nós API em um NDB Cluster”.

- `ApiVerbose`: Habilitar depuração da API NDB; para desenvolvimento do NDB.

- `ArbitrationDelay`: Quando solicitado a arbitrar, o árbitro aguarda esse número de milissegundos antes de votar.

- `ArbitrationRank`: Se for 0, então o nó da API não é árbitro. O kernel seleciona os árbitros na ordem 1, 2.

- `AutoReconnect`: Especifica se um nó da API deve se reconectar completamente quando desconectado do cluster.

- `BatchByteSize`: Tamanho padrão do lote em bytes.

- `BatchSize`: Tamanho padrão do lote em número de registros.

- `ConnectBackoffMaxTime`: Especifica o tempo máximo em milissegundos (\~resolução de 100ms) para permitir entre tentativas de conexão a qualquer nó de dados dado por este nó da API. Exclui o tempo decorrido enquanto as tentativas de conexão estão em andamento, o que, no pior dos casos, pode levar vários segundos. Desative-o definindo para 0. Se nenhum nó de dados estiver conectado atualmente a este nó da API, o StartConnectBackoffMaxTime é usado em vez disso.

- `ConnectionMap`: Especifica quais nós de dados devem ser conectados.

- `DefaultHashMapSize`: Defina o tamanho (em buckets) a ser usado para os mapas de hash da tabela. São suportados três valores: 0, 240 e 3840.

- `DefaultOperationRedoProblemAction`: Como as operações são tratadas em eventos em que o contador de RedoOverCommit é excedido.

- `ExecuteOnComputer`: String que faz referência ao COMPUTADOR definido anteriormente.

- `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além de qualquer memória alocada por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

- `HeartbeatThreadPriority`: Defina a política e a prioridade do thread de batimento cardíaco para os nós da API; consulte o manual para os valores permitidos.

- `HostName`: Nome do host ou endereço IP para este nó SQL ou API.

- `Id`: Número que identifica o servidor MySQL ou o nó da API (Id). Agora desatualizado; use NodeId.

- `LocationDomainId`: Atribua este nó da API a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa este campo em branco.

- `MaxScanBatchSize`: Tamanho máximo de lote coletivo para uma varredura.

- `NodeId`: Número que identifica de forma única o nó SQL ou o nó da API entre todos os nós do cluster.

- `StartConnectBackoffMaxTime`: O mesmo que ConnectBackoffMaxTime, exceto que este parâmetro é usado em seu lugar se nenhum nó de dados estiver conectado a este nó da API.

- `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

- `wan`: Use a configuração WAN TCP como padrão.

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte Seção 21.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”. Para informações sobre as variáveis do sistema do servidor MySQL relacionadas ao NDB Cluster, consulte Seção 21.4.3.9.2, “Variáveis de Sistema do NDB Cluster”.

Nota

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao cluster.

Não é *necessário* reiniciar o clúster se novos nós SQL ou API puderem utilizar slots de API anteriormente não utilizados na configuração do clúster para se conectarem ao clúster.
