#### 21.4.2.4 Outros parâmetros de configuração do cluster do NDB

Os listados nesta seção fornecem informações sobre os parâmetros usados nas seções `[computer]`, `[tcp]` e `[shm]` de um arquivo `config.ini` para configurar o NDB Cluster. Para descrições detalhadas e informações adicionais sobre os parâmetros individuais, consulte Seção 21.4.3.10, “Conexões TCP/IP do NDB Cluster”, ou Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, conforme apropriado.

Os seguintes parâmetros se aplicam à seção `[computer]` do arquivo `config.ini`:

- `HostName`: Nome do host ou endereço IP deste computador.

- `Id`: Identificador único para este computador.

Os seguintes parâmetros se aplicam à seção `[tcp]` do arquivo `config.ini`:

- `Checksum`: Se o checksum estiver ativado, todos os sinais entre os nós serão verificados quanto a erros.

- `Grupo`: Usado para proximidade de grupo; um valor menor é interpretado como estar mais próximo.

- `HostName1`: Nome ou endereço IP do primeiro dos dois computadores conectados por uma conexão TCP.

- `HostName2`: Nome ou endereço IP do segundo dos dois computadores conectados por uma conexão TCP.

- `NodeId1`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um dos lados da conexão.

- `NodeId2`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um dos lados da conexão.

- `NodeIdServer`: Defina o lado do servidor da conexão TCP.

- `OverloadLimit`: Quando houver mais que esse número de bytes não enviados no buffer de envio, a conexão será considerada sobrecarregada.

- `PortNumber`: Porta usada para o transportador TCP.

- `PreSendChecksum`: Se este parâmetro e o Checksum estiverem ativados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros.

- `Proxy`: ....

- `ReceiveBufferMemory`: Bytes do buffer para sinais recebidos por este nó.

- `SendBufferMemory`: Bytes do buffer TCP para sinais enviados a partir deste nó.

- `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de registro. Tem o valor padrão true em compilações de depuração.

- `TCP_MAXSEG_SIZE`: Valor usado para TCP\_MAXSEG.

- `TCP_RCV_BUF_SIZE`: Valor usado para SO\_RCVBUF.

- `TCP_SND_BUF_SIZE`: Valor usado para SO\_SNDBUF.

- `TcpBind_INADDR_ANY`: Vincule InADDR\_ANY em vez do nome do host para a parte do servidor da conexão.

Os seguintes parâmetros se aplicam à seção `[shm]` do arquivo `config.ini`:

- `Checksum`: Se o checksum estiver ativado, todos os sinais entre os nós serão verificados quanto a erros.

- `Grupo`: Usado para proximidade de grupo; um valor menor é interpretado como estar mais próximo.

- `HostName1`: Nome ou endereço IP do primeiro dos dois computadores conectados por uma conexão SHM.

- `HostName2`: Nome ou endereço IP do segundo dos dois computadores conectados por uma conexão SHM.

- `NodeId1`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um dos lados da conexão.

- `NodeId2`: ID do nó (nó de dados, nó de API ou nó de gerenciamento) de um dos lados da conexão.

- `NodeIdServer`: Defina o lado do servidor da conexão SHM.

- `OverloadLimit`: Quando houver mais que esse número de bytes não enviados no buffer de envio, a conexão será considerada sobrecarregada.

- `PortNumber`: Porta usada pelo transportador SHM.

- `PreSendChecksum`: Se este parâmetro e o Checksum estiverem ativados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós quanto a erros.

- `SendBufferMemory`: Bytes no buffer de memória compartilhada para sinais enviados a partir deste nó.

- `SendSignalId`: Envia o ID em cada sinal. Usado em arquivos de registro.

- `ShmKey`: Chave de memória compartilhada; quando definida para 1, isso é calculado pelo NDB.

- `ShmSpinTime`: Número de microsegundos para girar antes de dormir ao receber.

- `ShmSize`: Tamanho do segmento de memória compartilhada.

- `Signum`: Número de sinal a ser utilizado para sinalização.
