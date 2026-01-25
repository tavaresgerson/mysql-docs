#### 21.4.3.12 Conexões de Memória Compartilhada do NDB Cluster

As comunicações entre os nodes do NDB Cluster são normalmente tratadas usando TCP/IP. O transporter de memória compartilhada (SHM) se distingue pelo fato de que os sinais são transmitidos escrevendo na memória em vez de em um socket. O transporter de memória compartilhada (SHM) pode melhorar o desempenho ao anular até 20% da sobrecarga (overhead) exigida por uma conexão TCP ao executar um API node (geralmente um SQL node) e um data node juntos no mesmo host. Você pode habilitar uma conexão de memória compartilhada de duas maneiras listadas aqui:

* Ao definir o parâmetro de configuração do data node [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) como `1`, e definindo [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) para o data node e [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) para o API node com o mesmo valor.

* Ao usar seções `[shm]` no arquivo de configuração do Cluster, cada uma contendo configurações para [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) e [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2). Este método é descrito em mais detalhes posteriormente nesta seção.

Suponha que um Cluster esteja executando um data node com ID de node 1 e um SQL node com ID de node 51 no mesmo computador host em 10.0.0.1. Para habilitar uma conexão SHM entre esses dois nodes, tudo o que é necessário é garantir que as seguintes entradas estejam incluídas no arquivo de configuração do Cluster:

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

As duas entradas mostradas acima são adicionais a quaisquer outras entradas e configurações de parâmetros necessárias pelo Cluster. Um exemplo mais completo é mostrado posteriormente nesta seção.

Antes de iniciar data nodes que utilizam conexões SHM, também é necessário garantir que o sistema operacional em cada computador que hospeda tal data node tenha memória suficiente alocada para segmentos de memória compartilhada. Consulte a documentação da sua plataforma operacional para obter informações sobre isso. Em configurações onde vários hosts estão executando um data node e um API node, é possível habilitar a memória compartilhada em todos esses hosts definindo `UseShm` na seção `[ndbd default]` do arquivo de configuração. Isso é mostrado no exemplo posterior desta seção.

Embora não seja estritamente obrigatório, o tuning para todas as conexões SHM no Cluster pode ser feito definindo um ou mais dos seguintes parâmetros na seção `[shm default]` do arquivo de configuração do Cluster (`config.ini`):

* [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize): Tamanho da memória compartilhada

* [`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime): Tempo em µs para spin antes de sleep

* [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory): Tamanho do buffer para sinais enviados deste node, em bytes.

* [`SendSignalId`](mysql-cluster-shm-definition.html#ndbparam-shm-sendsignalid): Indica que um ID de sinal está incluído em cada sinal enviado através do transporter.

* [`Checksum`](mysql-cluster-shm-definition.html#ndbparam-shm-checksum): Indica que um checksum está incluído em cada sinal enviado através do transporter.

* [`PreSendChecksum`](mysql-cluster-shm-definition.html#ndbparam-shm-presendchecksum): Verifica se o checksum é feito antes de enviar o sinal; `Checksum` também deve estar habilitado para que isso funcione

Este exemplo mostra uma configuração simples com conexões SHM definidas em múltiplos hosts, em um NDB Cluster usando 3 computadores listados aqui por nome de host, hospedando os tipos de node mostrados:

1. `10.0.0.0`: O servidor de gerenciamento (management server)
2. `10.0.0.1`: Um data node e um SQL node
3. `10.0.0.2`: Um data node e um SQL node

Neste cenário, cada data node se comunica tanto com o servidor de gerenciamento quanto com o outro data node usando TCP transporters; cada SQL node usa um shared memory transporter para se comunicar com os data nodes que lhe são locais, e um TCP transporter para se comunicar com o data node remoto. Uma configuração básica refletindo esta configuração é habilitada pelo arquivo config.ini cujo conteúdo é mostrado aqui:

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

Parâmetros que afetam todos os shared memory transporters são definidos na seção `[shm default]`; eles podem ser sobrescritos por conexão em uma ou mais seções `[shm]`. Cada seção deve ser associada a uma dada conexão SHM usando [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) e [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2); os valores exigidos para estes parâmetros são os IDs de node dos dois nodes conectados pelo transporter. Você também pode identificar os nodes pelo nome do host usando [`HostName1`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname1) e [`HostName2`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname2), mas estes parâmetros não são obrigatórios.

Os API nodes para os quais não são definidos nomes de host usam o TCP transporter para se comunicar com os data nodes independentemente dos hosts nos quais são iniciados; os parâmetros e valores definidos na seção `[tcp default]` do arquivo de configuração se aplicam a todos os TCP transporters no Cluster.

Para um desempenho ótimo, você pode definir um tempo de spin (spin time) para o SHM transporter (parâmetro [`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime)); isso afeta tanto a thread receptora do data node quanto o proprietário da pesquisa (poll owner) (receive thread ou user thread) no `NDB`.

* `Checksum`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Checksum" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>boolean</td> </tr><tr> <th>Padrão</th> <td>true</td> </tr><tr> <th>Intervalo</th> <td>true, false</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é booleano (`Y`/`N`) e está desabilitado por padrão. Quando habilitado, checksums para todas as mensagens são calculados antes de serem colocados no send buffer.

  Este recurso impede que as mensagens sejam corrompidas enquanto esperam no send buffer. Ele também serve como uma verificação contra dados corrompidos durante o transporte.

* `Group`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determina a proximidade do grupo; um valor menor é interpretado como mais próximo. O valor padrão é suficiente para a maioria das condições.

* `HostName1`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada HostName1" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os parâmetros `HostName1` e [`HostName2`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname2) podem ser usados para especificar interfaces de rede específicas a serem usadas para uma dada conexão SHM entre dois nodes. Os valores usados para estes parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada HostName2" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>name ou IP address</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os parâmetros [`HostName1`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname1) e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma dada conexão SHM entre dois nodes. Os valores usados para estes parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada NodeId1" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numeric</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nodes, é necessário fornecer identificadores de node para cada um deles, como `NodeId1` e [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2).

* `NodeId2`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada NodeId2" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numeric</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nodes, é necessário fornecer identificadores de node para cada um deles, como [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) e `NodeId2`.

* `NodeIdServer`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada NodeIdServer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numeric</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 63</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Identifica o lado do servidor de uma conexão de memória compartilhada. Por padrão, este é o ID de node do data node.

* `OverloadLimit`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada OverloadLimit" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando mais do que esta quantidade de bytes não enviados estiverem no send buffer, a conexão é considerada sobrecarregada (overloaded).

  Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que deve estar presente no send buffer antes que a conexão seja considerada sobrecarregada. Veja [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters"), e [Section 21.6.15.44, “The ndbinfo transporters Table”](mysql-cluster-ndbinfo-transporters.html "21.6.15.44 The ndbinfo transporters Table"), para mais informações.

* [`PortNumber`](mysql-cluster-shm-definition.html#ndbparam-shm-portnumber)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada PortNumber" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>0 - 64K</td> </tr><tr> <th>Removido</th> <td>NDB 7.5.1</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Sistema: </strong></span>Requer um shutdown e restart completo do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define a port a ser usada pelo SHM transporter.

* [`PreSendChecksum`](mysql-cluster-shm-definition.html#ndbparam-shm-presendchecksum)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada PreSendChecksum" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo ou unidades</th> <td>boolean</td> </tr><tr> <th>Padrão</th> <td>false</td> </tr><tr> <th>Intervalo</th> <td>true, false</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Se este parâmetro e [`Checksum`](mysql-cluster-shm-definition.html#ndbparam-shm-checksum) estiverem ambos habilitados, realiza verificações de checksum pré-envio, e verifica todos os sinais SHM entre nodes por erros. Não tem efeito se `Checksum` não estiver também habilitado.

* [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Tamanho (em bytes) do shared memory buffer para sinais enviados deste node usando uma conexão de memória compartilhada.

* `SendSignalId`

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para rastrear o caminho de uma mensagem distribuída, é necessário fornecer a cada mensagem um identificador exclusivo. Definir este parâmetro como `Y` faz com que esses IDs de mensagem sejam transportados pela rede também. Este recurso é desabilitado por padrão em builds de produção, e habilitado em builds `-debug`.

* [`ShmKey`](mysql-cluster-shm-definition.html#ndbparam-shm-shmkey)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Ao configurar segmentos de memória compartilhada, um ID de node, expresso como um inteiro, é usado para identificar de forma exclusiva o segmento de memória compartilhada a ser usado para a comunicação. Não há valor padrão. Se [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) estiver habilitado, a chave de memória compartilhada (shared memory key) é calculada automaticamente pelo `NDB`.

* [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Cada conexão SHM tem um segmento de memória compartilhada onde as mensagens entre nodes são colocadas pelo remetente e lidas pelo leitor. O tamanho deste segmento é definido por [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize). O valor padrão no NDB 7.6 é 4MB.

* [`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Ao receber, o tempo de espera antes de dormir (sleeping), em microssegundos.

* [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum)

  <table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro não é mais usado no NDB 7.6, no qual qualquer definição para ele é ignorada.

  O seguinte se aplica somente no NDB 7.5 (e anteriores):

  Ao usar o shared memory transporter, um processo envia um sinal do sistema operacional para o outro processo quando há novos dados disponíveis na memória compartilhada. Caso esse sinal entre em conflito com um sinal existente, este parâmetro pode ser usado para alterá-lo. Esta é uma possibilidade ao usar SHM devido ao fato de que diferentes sistemas operacionais usam diferentes números de sinal.

  O valor padrão de [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum) é 0; portanto, ele deve ser definido para evitar erros no log do Cluster ao usar o shared memory transporter. Tipicamente, este parâmetro é definido como 10 na seção `[shm default]` do arquivo `config.ini`.

**Tipos de reinicialização.** Informações sobre os tipos de reinicialização usados pelas descrições dos parâmetros nesta seção são mostradas na tabela a seguir:

**Tabela 21.20 Tipos de reinicialização do NDB Cluster**

<table frame="box" rules="all" summary="Informações de tipo e valor do parâmetro de configuração de memória compartilhada Group" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Intervalo</th> <td>0 - 200</td> </tr><tr> <th>Tipo de Reinicialização</th> <td><p> <span><strong>Reinicialização de Node: </strong></span>Requer um rolling restart do Cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>