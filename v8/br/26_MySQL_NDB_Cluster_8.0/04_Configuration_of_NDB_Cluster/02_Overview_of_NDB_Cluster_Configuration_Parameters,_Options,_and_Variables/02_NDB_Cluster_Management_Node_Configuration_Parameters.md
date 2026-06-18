#### 25.4.2.2 Parâmetros de configuração do nó de gerenciamento de cluster do NDB

A listagem nesta seção fornece informações sobre os parâmetros usados na seção `[ndb_mgmd]` ou `[mgm]` de um arquivo `config.ini` para configurar os nós de gerenciamento do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte a Seção 25.4.3.5, “Definindo um Servidor de Gerenciamento de NDB Cluster”.

- `ArbitrationDelay`: Quando solicitado para arbitrar, o árbitro espera tanto tempo antes de votar (milissegundos).

- `ArbitrationRank`: Se 0, então o nó de gerenciamento não é árbitro. O kernel seleciona os árbitros na ordem 1, 2.

- `DataDir`: Diretório de dados para este nó.

- `ExecuteOnComputer`: String que faz referência a um COMPUTADOR definido anteriormente.

- `ExtraSendBufferMemory`: Memória a ser usada para buffers de envio, além de qualquer alocação feita por TotalSendBufferMemory ou SendBufferMemory. O padrão (0) permite até 16 MB.

- `HeartbeatIntervalMgmdMgmd`: Tempo entre os batimentos cardíacos entre os nós de gerenciamento e os nós de gerenciamento; a conexão entre os nós de gerenciamento é considerada perdida após 3 batimentos cardíacos perdidos.

- `HeartbeatThreadPriority`: Defina a política e a prioridade da thread de batimentos cardíacos para os nós de gerenciamento; consulte o manual para os valores permitidos.

- `HostName`: Nome do host ou endereço IP para este nó de gerenciamento.

- `Id`: Número que identifica o nó de gerenciamento. Agora desatualizado; use NodeId.

- `LocationDomainId`: Atribua este nó de gerenciamento a um domínio ou zona de disponibilidade específica. 0 (padrão) deixa isso não definido.

- `LogDestination`: Onde enviar mensagens de log: console, log do sistema ou arquivo de log especificado.

- `NodeId`: Número que identifica de forma única o nó de gerenciamento entre todos os nós do clúster.

- `PortNumber`: Número de porta para enviar comandos e obter configuração do servidor de gerenciamento.

- `PortNumberStats`: Número de porta usado para obter informações estatísticas do servidor de gerenciamento.

- `TotalSendBufferMemory`: Memória total a ser usada para todos os buffers de envio do transportador.

- `wan`: Use a configuração WAN TCP como padrão.

Nota

Após fazer alterações na configuração de um nó de gerenciamento, é necessário realizar um reinício contínuo do clúster para que a nova configuração entre em vigor. Consulte a Seção 25.4.3.5, “Definindo um Servidor de Gerenciamento de Clúster NDB”, para obter mais informações.

Para adicionar novos servidores de gerenciamento a um NDB Cluster em execução, também é necessário realizar um reinício contínuo de todos os nós do cluster após modificar quaisquer arquivos existentes dos `config.ini`. Para obter mais informações sobre problemas que surgem ao usar múltiplos nós de gerenciamento, consulte a Seção 25.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”.
