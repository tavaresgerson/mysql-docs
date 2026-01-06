#### 21.4.3.10 Conexões de cluster NDB TCP/IP

O TCP/IP é o mecanismo de transporte padrão para todas as conexões entre os nós de um NDB Cluster. Normalmente, não é necessário definir conexões TCP/IP; o NDB Cluster configura automaticamente essas conexões para todos os nós de dados, nós de gerenciamento e nós de SQL ou API.

Nota

Para uma exceção a essa regra, consulte Seção 21.4.3.11, "Conexões de TCP/IP do NDB Cluster usando Conexões Direitas".

Para substituir os parâmetros de conexão padrão, é necessário definir uma conexão usando uma ou mais seções `[tcp]` no arquivo `config.ini`. Cada seção `[tcp]` define explicitamente uma conexão TCP/IP entre dois nós do NDB Cluster e deve conter, no mínimo, os parâmetros `[NodeId1]` (mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid1) e `[NodeId2]` (mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid2), além de quaisquer parâmetros de conexão a serem substituídos.

É também possível alterar os valores padrão desses parâmetros, definindo-os na seção `[tcp default]`.

Importante

Quaisquer seções `[tcp]` no arquivo `config.ini` devem ser listadas *últimas*, seguidas de todas as outras seções no arquivo. No entanto, essa não é uma exigência para uma seção `[tcp default]`. Essa exigência é um problema conhecido sobre a forma como o servidor de gerenciamento do NDB Cluster lê o arquivo `config.ini`.

Os parâmetros de conexão que podem ser configurados nas seções `[tcp]` e `[tcp default]` do arquivo `config.ini` estão listados aqui:

- `Checksum`

  <table frame="box" rules="all" summary="Verifique o tipo e o valor dos parâmetros de configuração do checksum TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr><tr> <th>Padrão</th> <td>falsa</td> </tr><tr> <th>Gama</th> <td>verdadeiro, falso</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é um parâmetro booleano (ativado definindo-o como `Y` ou `1`, desativado definindo-o como `N` ou `0`). Ele é desativado por padrão. Quando ativado, os checksums de todas as mensagens são calculados antes de serem colocados no buffer de envio. Esse recurso garante que as mensagens não sejam corrompidas enquanto aguardam no buffer de envio ou pelo mecanismo de transporte.

- `Grupo`

  Quando o `ndb_optimized_node_selection` está habilitado, a proximidade do nó é usada em alguns casos para selecionar qual nó conectar. Este parâmetro pode ser usado para influenciar a proximidade, definindo-o para um valor menor, que é interpretado como “mais próximo”. Veja a descrição da variável do sistema para obter mais informações.

- `HostName1`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão TCP específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

- `HostName2`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName2 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Os parâmetros ``HostName1`` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão TCP específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

- `NodeId1`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração NodeId1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nós, é necessário fornecer seus IDs de nó na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e `NodeId2`. Estes são os mesmos valores de `Id` únicos para cada um desses nós, conforme descrito em Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

- `NodeId2`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração NodeId2 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nós, é necessário fornecer seus IDs de nó na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e `NodeId2`. Estes são os mesmos valores de `Id` únicos para cada um desses nós, conforme descrito na Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

- `NodeIdServer`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do NodeIdServer TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 63</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Configure o lado do servidor de uma conexão TCP.

- `Limite de sobrecarga`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração OverloadLimit TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Quando há mais de esse número de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

  Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que devem estar presentes no buffer de envio antes que a conexão seja considerada sobrecarregada. Consulte Seção 21.4.3.13, “Configurando Parâmetros do Buffer de Envio do NDB Cluster” para obter mais informações.

- `PortNumber` (*OBSOLETE*)

  Este parâmetro especificava anteriormente o número de porta a ser usado para ouvir conexões de outros nós. Ele está sendo descontinuado (e removido no NDB Cluster 7.5); use o parâmetro de configuração do nó de dados `ServerPort` para esse propósito (Bug #77405, Bug #21280456).

- `PreSendChecksum`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração PreSendChecksum TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr><tr> <th>Padrão</th> <td>falsa</td> </tr><tr> <th>Gama</th> <td>verdadeiro, falso</td> </tr><tr> <th>Adicionei</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver habilitado.

- `Proxy`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do TCP proxy" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Defina um proxy para a conexão TCP.

- `ReceiveBufferMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração ReceiveBufferMemory TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>2M</td> </tr><tr> <th>Gama</th> <td>16K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Especifica o tamanho do buffer usado ao receber dados do socket TCP/IP.

  O valor padrão deste parâmetro é de 2 MB. O valor mínimo possível é de 16 KB; o valor máximo teórico é de 4 GB.

- `SendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>0

  Os transportadores TCP utilizam um buffer para armazenar todas as mensagens antes de realizar a chamada de envio ao sistema operacional. Quando esse buffer atinge 64 KB, seus conteúdos são enviados; eles também são enviados quando uma rodada de mensagens é executada. Para lidar com situações de sobrecarga temporária, também é possível definir um buffer de envio maior.

  Se este parâmetro for definido explicitamente, a memória não será dedicada a cada transportador; em vez disso, o valor utilizado indica o limite máximo de memória (da memória total disponível, ou seja, `TotalSendBufferMemory`) que pode ser usada por um único transportador. Para obter mais informações sobre a configuração da alocação dinâmica de memória de buffer de envio de transportadores no NDB Cluster, consulte Seção 21.4.3.13, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

  O tamanho padrão do buffer de envio é de 2 MB, que é o tamanho recomendado na maioria das situações. O tamanho mínimo é de 64 KB; o tamanho máximo teórico é de 4 GB.

- `SendSignalId`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>1

  Para poder rastrear um datagrama de mensagem distribuída, é necessário identificar cada mensagem. Quando este parâmetro é definido como `Y`, os IDs das mensagens são transportados pela rede. Este recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

- `TcpBind_INADDR_ANY`

  Definir este parâmetro para `TRUE` ou `1` vincula `IP_ADDR_ANY` para que as conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

- `TCP_MAXSEG_SIZE`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>2

  Determina o tamanho do conjunto de memória durante a inicialização do transportador TCP. O valor padrão é recomendado para a maioria dos casos de uso comuns.

- `TCP_RCV_BUF_SIZE`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>3

  Determina o tamanho do buffer de recebimento definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma definam esse valor. O valor padrão é recomendado para a maioria dos casos de uso comuns.

- `TCP_SND_BUF_SIZE`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>4

  Determina o tamanho do buffer de envio definido durante a inicialização do transportador TCP. O valor padrão e mínimo é 0, o que permite que o sistema operacional ou a plataforma definam esse valor. O valor padrão é recomendado para a maioria dos casos de uso comuns.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.19 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração HostName1 TCP" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>5
