#### 21.4.2.4 Outros Parâmetros de Configuração do NDB Cluster

As listas nesta seção fornecem informações sobre os parâmetros usados nas seções `[computer]`, `[tcp]` e `[shm]` de um arquivo `config.ini` para configurar o NDB Cluster. Para descrições detalhadas e informações adicionais sobre parâmetros individuais, consulte [Section 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections"), ou [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), conforme apropriado.

Os seguintes parâmetros se aplicam à seção `[computer]` do arquivo `config.ini`:

* `HostName`: Host name ou IP address deste computador.
* `Id`: Identificador único para este computador.

Os seguintes parâmetros se aplicam à seção `[tcp]` do arquivo `config.ini`:

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nodes são verificados quanto a erros.
* `Group`: Usado para proximidade de grupo; um valor menor é interpretado como estando mais próximo.
* `HostName1`: Nome ou IP address do primeiro de dois computadores unidos pela conexão TCP.
* `HostName2`: Nome ou IP address do segundo de dois computadores unidos pela conexão TCP.
* `NodeId1`: ID do node (data node, API node ou management node) em um lado da connection.
* `NodeId2`: ID do node (data node, API node ou management node) em um lado da connection.
* `NodeIdServer`: Define o lado server da conexão TCP.
* `OverloadLimit`: Quando houver mais do que este número de bytes não enviados no send buffer, a connection é considerada sobrecarregada.
* `PortNumber`: Porta usada para o transporter TCP.
* `PreSendChecksum`: Se este parâmetro e Checksum estiverem ambos habilitados, executa verificações de pre-send checksum e verifica todos os sinais TCP entre os nodes quanto a erros.
* `Proxy`: ....
* `ReceiveBufferMemory`: Bytes do buffer para sinais recebidos por este node.
* `SendBufferMemory`: Bytes do buffer TCP para sinais enviados deste node.
* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos trace. O padrão é true em builds de debug.
* `TCP_MAXSEG_SIZE`: Valor usado para TCP_MAXSEG.
* `TCP_RCV_BUF_SIZE`: Valor usado para SO_RCVBUF.
* `TCP_SND_BUF_SIZE`: Valor usado para SO_SNDBUF.
* `TcpBind_INADDR_ANY`: Faz o Bind de InAddrAny em vez do host name para a parte server da connection.

Os seguintes parâmetros se aplicam à seção `[shm]` do arquivo `config.ini`:

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nodes são verificados quanto a erros.
* `Group`: Usado para proximidade de grupo; um valor menor é interpretado como estando mais próximo.
* `HostName1`: Nome ou IP address do primeiro de dois computadores unidos pela conexão SHM.
* `HostName2`: Nome ou IP address do segundo de dois computadores unidos pela conexão SHM.
* `NodeId1`: ID do node (data node, API node ou management node) em um lado da connection.
* `NodeId2`: ID do node (data node, API node ou management node) em um lado da connection.
* `NodeIdServer`: Define o lado server da conexão SHM.
* `OverloadLimit`: Quando houver mais do que este número de bytes não enviados no send buffer, a connection é considerada sobrecarregada.
* `PortNumber`: Porta usada para o transporter SHM.
* `PreSendChecksum`: Se este parâmetro e Checksum estiverem ambos habilitados, executa verificações de pre-send checksum e verifica todos os sinais SHM entre os nodes quanto a erros.
* `SendBufferMemory`: Bytes no shared memory buffer para sinais enviados deste node.
* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos trace.
* `ShmKey`: Chave de shared memory; quando definido como 1, é calculada pelo NDB.
* `ShmSpinTime`: Ao receber, número de microssegundos para spin antes de sleep.
* `ShmSize`: Tamanho do segmento de shared memory.
* `Signum`: Número do sinal (signal number) a ser usado para sinalização (signalling).