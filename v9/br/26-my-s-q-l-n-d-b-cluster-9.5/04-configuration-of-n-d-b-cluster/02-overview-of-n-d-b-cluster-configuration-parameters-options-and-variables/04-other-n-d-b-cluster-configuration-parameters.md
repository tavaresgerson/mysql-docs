#### 25.4.2.4 Outros Parâmetros de Configuração do NDB Cluster

As listagens nesta seção fornecem informações sobre os parâmetros usados nas seções `[computer]`, `[tcp]` e `[shm]` de um arquivo `config.ini` para configurar o NDB Cluster. Para descrições detalhadas e informações adicionais sobre os parâmetros individuais, consulte a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”, ou a Seção 25.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, conforme apropriado.

Os seguintes parâmetros se aplicam à seção `[computer]` do arquivo `config.ini`:

* `HostName`: Nome de host ou endereço IP deste computador.

* `Id`: Identificador único para este computador.

Os seguintes parâmetros se aplicam à seção `[tcp]` do arquivo `config.ini`:

* `AllowUnresolvedHostNames`: Quando falso (padrão), o falha do nó de gerenciamento em resolver o nome do host resulta em erro fatal; quando verdadeiro, nomes de host não resolvidos são relatados apenas como avisos.

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nós são verificados quanto a erros.

* `Group`: Usado para proximidade de grupo; valor menor é interpretado como estando mais próximo.

* `HostName1`: Nome ou endereço IP do primeiro dos dois computadores unidos pela conexão TCP.

* `HostName2`: Nome ou endereço IP do segundo dos dois computadores unidos pela conexão TCP.

* `NodeId1`: ID do nó (nó de dados, nó API ou nó de gerenciamento) de um lado da conexão.

* `NodeId2`: ID do nó (nó de dados, nó API ou nó de gerenciamento) de um lado da conexão.

* `NodeIdServer`: Defina o lado servidor da conexão TCP.

* `OverloadLimit`: Quando mais que este número de bytes não enviados estão no buffer de envio, a conexão é considerada sobrecarregada.

* `PreferIPVersion`: Indique a preferência do resolutor DNS para a versão 4 ou 6 do IP.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros.

* `Proxy`: ....

* `ReceiveBufferMemory`: Bytes do buffer de sinais recebidos por este nó.

* `RequireLinkTls`: Apenas leitura; é definido como verdadeiro se qualquer um dos pontos finais desta conexão exigir TLS.

* `SendBufferMemory`: Bytes do buffer TCP para sinais enviados a partir deste nó.

* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de registro. Tem o valor padrão verdadeiro em compilações de depuração.

* `TcpSpinTime`: Tempo para girar antes de entrar em modo de espera ao receber.

* `TCP_MAXSEG_SIZE`: Valor usado para TCP\_MAXSEG.

* `TCP_RCV_BUF_SIZE`: Valor usado para SO\_RCVBUF.

* `TCP_SND_BUF_SIZE`: Valor usado para SO\_SNDBUF.

* `TcpBind_INADDR_ANY`: Vincule InAddrAny em vez do nome do host para a parte do servidor da conexão.

Os seguintes parâmetros se aplicam à seção `[shm]` do arquivo `config.ini`:

* `Checksum`: Se o checksum estiver habilitado, todos os sinais entre os nós são verificados em busca de erros.

* `Group`: Usado para proximidade de grupo; um valor menor é interpretado como estando mais próximo.

* `HostName1`: Nome ou endereço IP do primeiro dos dois computadores conectados pela conexão SHM.

* `HostName2`: Nome ou endereço IP do segundo dos dois computadores conectados pela conexão SHM.

* `NodeId1`: ID do nó (nó de dados, nó API ou nó de gerenciamento) de um lado da conexão.

* `NodeId2`: ID do nó (nó de dados, nó API ou nó de gerenciamento) de um lado da conexão.

* `NodeIdServer`: Defina o lado servidor da conexão SHM.

* `OverloadLimit`: Quando mais que este número de bytes não enviados estiverem no buffer de envio, a conexão será considerada sobrecarregada.

* `PreSendChecksum`: Se este parâmetro e o Checksum estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros.

* `SendBufferMemory`: Bytes no buffer de memória compartilhada para sinais enviados a partir deste nó.

* `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de registro.

* `ShmKey`: Chave de memória compartilhada; quando definida para 1, isso é calculado pelo NDB.

* `ShmSpinTime`: Número de microsegundos para girar antes de dormir, ao receber.

* `ShmSize`: Tamanho do segmento de memória compartilhada.

* `Signum`: Número de sinal a ser usado para sinalização.