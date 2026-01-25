#### 21.4.3.10 Conexões TCP/IP do NDB Cluster

TCP/IP é o mecanismo de transporte padrão para todas as conexões entre nodes em um NDB Cluster. Normalmente, não é necessário definir conexões TCP/IP; o NDB Cluster configura automaticamente essas conexões para todos os data nodes, management nodes e nodes SQL ou API.

Nota

Para uma exceção a esta regra, consulte [Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”](mysql-cluster-tcp-definition-direct.html "21.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections").

Para substituir os parâmetros de conexão padrão (override), é necessário definir uma conexão usando uma ou mais seções `[tcp]` no arquivo `config.ini`. Cada seção `[tcp]` define explicitamente uma conexão TCP/IP entre dois nodes do NDB Cluster e deve conter, no mínimo, os parâmetros [`NodeId1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid1) e [`NodeId2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid2), bem como quaisquer parâmetros de conexão a serem substituídos.

Também é possível alterar os valores padrão para esses parâmetros definindo-os na seção `[tcp default]`.

Importante

Quaisquer seções `[tcp]` no arquivo `config.ini` devem ser listadas por *último*, seguindo todas as outras seções do arquivo. No entanto, isso não é exigido para uma seção `[tcp default]`. Este requisito é um problema conhecido na forma como o arquivo `config.ini` é lido pelo management server do NDB Cluster.

Os parâmetros de conexão que podem ser definidos nas seções `[tcp]` e `[tcp default]` do arquivo `config.ini` estão listados aqui:

* `Checksum`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração Checksum TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>boolean</td> </tr><tr> <th>Padrão</th> <td>false</td> </tr><tr> <th>Intervalo</th> <td>true, false</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é booleano (habilitado definindo-o como `Y` ou `1`, desabilitado definindo-o como `N` ou `0`). Ele é desabilitado por padrão. Quando habilitado, os Checksums para todas as mensagens são calculados antes de serem colocados no send buffer. Este recurso garante que as mensagens não sejam corrompidas enquanto aguardam no send buffer, ou pelo mecanismo de transporte.

* `Group`

  Quando [`ndb_optimized_node_selection`](mysql-cluster-options-variables.html#sysvar_ndb_optimized_node_selection) está habilitado, a proximidade do node é usada em alguns casos para selecionar a qual node se conectar. Este parâmetro pode ser usado para influenciar a proximidade, definindo-o com um valor mais baixo, que é interpretado como "mais próximo". Consulte a descrição da variável de sistema para obter mais informações.

* `HostName1`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os parâmetros `HostName1` e [`HostName2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname2) podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma determinada conexão TCP entre dois nodes. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração HostName2 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os parâmetros [`HostName1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname1) e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma determinada conexão TCP entre dois nodes. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração NodeId1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nodes, é necessário fornecer seus IDs de node na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e [`NodeId2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid2). Esses são os mesmos valores `Id` exclusivos para cada um desses nodes, conforme descrito em [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `NodeId2`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração NodeId2 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nodes, é necessário fornecer seus IDs de node na seção `[tcp]` do arquivo de configuração como os valores de [`NodeId1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid1) e `NodeId2`. Esses são os mesmos valores `Id` exclusivos para cada um desses nodes, conforme descrito em [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* [`NodeIdServer`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeidserver)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração NodeIdServer TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Intervalo</th> <td>1 - 63</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define o lado do servidor de uma conexão TCP.

* `OverloadLimit`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração OverloadLimit TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Quando mais do que essa quantidade de bytes não enviados estiver no send buffer, a conexão é considerada sobrecarregada (overloaded).

  Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que devem estar presentes no send buffer antes que a conexão seja considerada sobrecarregada. Consulte [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters"), para obter mais informações.

* `PortNumber` (*OBSOLETO*)

  Este parâmetro especificava anteriormente o número da porta a ser usada para escutar conexões de outros nodes. Agora está obsoleto (e removido no NDB Cluster 7.5); use o parâmetro de configuração do data node [`ServerPort`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-serverport) para essa finalidade (Bug #77405, Bug #21280456).

* [`PreSendChecksum`](mysql-cluster-tcp-definition.html#ndbparam-tcp-presendchecksum)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração PreSendChecksum TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo ou unidades</th> <td>boolean</td> </tr><tr> <th>Padrão</th> <td>false</td> </tr><tr> <th>Intervalo</th> <td>true, false</td> </tr><tr> <th>Adicionado</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Se este parâmetro e [`Checksum`](mysql-cluster-tcp-definition.html#ndbparam-tcp-checksum) estiverem ambos habilitados, executa verificações de Checksum de pré-envio e verifica todos os sinais TCP entre nodes quanto a erros. Não tem efeito se `Checksum` também não estiver habilitado.

* [`Proxy`](mysql-cluster-tcp-definition.html#ndbparam-tcp-proxy)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração Proxy TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define um proxy para a conexão TCP.

* [`ReceiveBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-receivebuffermemory)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração ReceiveBufferMemory TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>2M</td> </tr><tr> <th>Intervalo</th> <td>16K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Especifica o tamanho do Buffer usado ao receber dados do socket TCP/IP.

  O valor padrão deste parâmetro é 2MB. O valor mínimo possível é 16KB; o máximo teórico é 4GB.

* [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração SendBufferMemory TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Os transportadores TCP usam um Buffer para armazenar todas as mensagens antes de executar a chamada de envio para o sistema operacional. Quando este Buffer atinge 64KB, seu conteúdo é enviado; isso também é enviado quando um ciclo de mensagens é executado. Para lidar com situações temporárias de sobrecarga, também é possível definir um send buffer maior.

  Se este parâmetro for definido explicitamente, a memória não é dedicada a cada transportador; em vez disso, o valor usado denota o limite máximo (hard limit) de quanta memória (do total de memória disponível — ou seja, `TotalSendBufferMemory`) pode ser usada por um único transportador. Para obter mais informações sobre a configuração da alocação dinâmica de memória do send buffer do transportador no NDB Cluster, consulte [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

  O tamanho padrão do send buffer é 2MB, que é o tamanho recomendado na maioria das situações. O tamanho mínimo é 64 KB; o máximo teórico é 4 GB.

* `SendSignalId`

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração SendSignalId TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Para poder rastrear um datagrama de mensagem distribuída, é necessário identificar cada mensagem. Quando este parâmetro é definido como `Y`, os IDs de mensagem são transportados pela rede. Este recurso é desabilitado por padrão em builds de produção e habilitado em builds `-debug`.

* `TcpBind_INADDR_ANY`

  Definir este parâmetro como `TRUE` ou `1` vincula `IP_ADDR_ANY` para que conexões possam ser feitas de qualquer lugar (para conexões autogeradas). O padrão é `FALSE` (`0`).

* [`TCP_MAXSEG_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_maxseg_size)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração TCP_MAXSEG_SIZE TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determina o tamanho da memória definida durante a inicialização do transportador TCP. O padrão é recomendado para a maioria dos casos de uso comuns.

* [`TCP_RCV_BUF_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_rcv_buf_size)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração TCP_RCV_BUF_SIZE TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determina o tamanho do receive buffer definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma defina este valor. O padrão é recomendado para a maioria dos casos de uso comuns.

* [`TCP_SND_BUF_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_snd_buf_size)

  <table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração TCP_SND_BUF_SIZE TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determina o tamanho do send buffer definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma defina este valor. O padrão é recomendado para a maioria dos casos de uso comuns.

**Tipos de Restart.** As informações sobre os tipos de Restart usados nas descrições de parâmetros nesta seção são mostradas na tabela a seguir:

**Table 21.19 Tipos de Restart do NDB Cluster**

<table frame="box" rules="all" summary="Informações sobre o tipo e valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span> Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>
