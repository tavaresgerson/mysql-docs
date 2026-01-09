#### 25.4.3.10 Conexões TCP/IP do NDB Cluster

O TCP/IP é o mecanismo de transporte padrão para todas as conexões entre os nós de um NDB Cluster. Normalmente, não é necessário definir conexões TCP/IP; o NDB Cluster configura automaticamente essas conexões para todos os nós de dados, nós de gerenciamento e nós SQL ou API.

Nota

Para uma exceção a essa regra, consulte a Seção 25.4.3.11, “Conexões TCP/IP do NDB Cluster Usando Conexões Direitas”.

Para sobrescrever os parâmetros de conexão padrão, é necessário definir uma conexão usando uma ou mais seções `[tcp]` no arquivo `config.ini`. Cada seção `[tcp]` define explicitamente uma conexão TCP/IP entre dois nós do NDB Cluster e deve conter, no mínimo, os parâmetros `NodeId1` e `NodeId2`, além de quaisquer parâmetros de conexão para sobrescrever.

Também é possível alterar os valores padrão desses parâmetros definindo-os na seção `[tcp default]`.

Importante

Quaisquer seções `[tcp]` no arquivo `config.ini` devem ser listadas *últimas*, seguidas de todas as outras seções no arquivo. No entanto, essa não é uma exigência para uma seção `[tcp default]`. Essa exigência é um problema conhecido sobre a forma como o servidor de gerenciamento do NDB Cluster lê o arquivo `config.ini`.

Os parâmetros de conexão que podem ser definidos nas seções `[tcp]` e `[tcp default]` do arquivo `config.ini` estão listados aqui:

* `AllowUnresolvedHostNames`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração TCP AllowUnresolvedHostNames">
  <tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr>
  <tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr>
  <tr> <th>Padrão</th> <td>false</td> </tr>
  <tr> <th>Intervalo</th> <td>true, false</td> </tr>
  <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr>
</table>

Por padrão, quando um nó de gerenciamento não consegue resolver um nome de host ao tentar se conectar, isso resulta em um erro fatal. Esse comportamento pode ser ignorado definindo `AllowUnresolvedHostNames` para `true` na seção `[tcp default]` do arquivo de configuração global (geralmente chamado `config.ini`), caso em que a falha em resolver um nome de host é tratada como um aviso e o **ndb\_mgmd** continua a ser iniciado sem interrupções.

* `Checksum`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração TCP Checksum">
    <tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr>
    <tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr>
    <tr> <th>Padrão</th> <td>false</td> </tr>
    <tr> <th>Intervalo</th> <td>true, false</td> </tr>
    <tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr>
  </table>

Este parâmetro é desabilitado por padrão. Quando ativado (definido como `Y` ou `1`), os checksums de todas as mensagens são calculados antes de serem colocadas no buffer de envio. Esse recurso garante que as mensagens não sejam corrompidas enquanto aguardam no buffer de envio ou pelo mecanismo de transporte.

* `Group`

  Quando `ndb_optimized_node_selection` está ativado, a proximidade do nó é usada em alguns casos para selecionar qual nó conectar. Esse parâmetro pode ser usado para influenciar a proximidade definindo-o para um valor menor, que é interpretado como “mais próximo”. Veja a descrição da variável de sistema para obter mais informações.

* `HostName1`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração HostName1 TCP" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rolling de um NDB Cluster" target="_blank">reinício rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão TCP específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração `HostName1` e `HostName2` TCP">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome ou endereço IP</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão TCP específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="Informações sobre o parâmetro de configuração `NodeId1` TCP">
    <tr>
      <th>Versão (ou posterior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>numérico</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[nenhum]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>1 - 255</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td>
    </tr>
  </table>

Para identificar uma conexão entre dois nós, é necessário fornecer seus IDs de nó na seção `[tcp]` do arquivo de configuração como os valores de `NodeId1` e `NodeId2`. Estes são os mesmos valores de `Id` únicos para cada um desses nós, conforme descrito na Seção 25.4.3.7, “Definindo Nodos SQL e Outros Nodos de API em um NDB Cluster”.

* `NodeIdServer`

<table frame="box" rules="all" summary="Parâmetros de configuração do servidor do TCP."><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>numérico</td></tr><tr><th>Padrão</th><td>[nenhum]</td></tr><tr><th>Intervalo</th><td>1 - 63</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Configure o lado do servidor de uma conexão TCP.

* `OverloadLimit`

  <table frame="box" rules="all" summary="Parâmetro de configuração do OverloadLimit do TCP."><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>bytes</td></tr><tr><th>Padrão</th><td>0</td></tr><tr><th>Intervalo</th><td>0 - 4294967039 (0xFFFFFEFF)</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Quando mais que este número de bytes não enviados estão no buffer de envio, a conexão é considerada sobrecarregada.

Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que deve estar presente no buffer de envio antes que a conexão seja considerada sobrecarregada. Consulte a Seção 25.4.3.14, “Configurando Parâmetros do Buffer de Envio do NDB Cluster”, para obter mais informações.

* `PreferIPVersion`

  <table frame="box" rules="all" summary="PreferIPVersion parâmetro de configuração do TCP e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>enumeração</td> </tr><tr><th>Padrão</th> <td>4</td> </tr><tr><th>Intervalo</th> <td>4, 6</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup Online do Clúster NDB">backup</a>, e depois o reinício do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Determina a preferência da resolução DNS para a versão 4 ou versão 6 do IP. Como o mecanismo de recuperação de configuração empregado pelo NDB Cluster exige que todas as conexões usem a mesma preferência, este parâmetro deve ser definido no `[tcp default]` do arquivo de configuração global `config.ini`.

* `PreSendChecksum`

  <table frame="box" rules="all" summary="PreSendChecksum parâmetro de configuração do TCP e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>booleano</td> </tr><tr><th>Padrão</th> <td>false</td> </tr><tr><th>Intervalo</th> <td>true, false</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício de Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realização de um Reinício Rolling de um Clúster NDB">reinício rolling</a> do clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais TCP entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver também habilitado.

* `Proxy`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração TCP de checksum" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>booleano</td> </tr><tr><th>Padrão</th> <td>false</td> </tr><tr><th>Intervalo</th> <td>true, false</td> </tr><tr><th>Tipo de reinício</th> <td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Defina um proxy para a conexão TCP.

* `ReceiveBufferMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração TCP de checksum" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>booleano</td> </tr><tr><th>Padrão</th> <td>false</td> </tr><tr><th>Intervalo</th> <td>true, false</td> </tr><tr><th>Tipo de reinício</th> <td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Especifica o tamanho do buffer usado ao receber dados do socket TCP/IP.

O valor padrão deste parâmetro é de 2 MB. O valor mínimo possível é de 16 KB; o valor máximo teórico é de 4 GB.

* `RequireLinkTls`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração TCP de verificação de checksum" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>booleano</td></tr><tr><th>Padrão</th><td>false</td></tr><tr><th>Intervalo</th><td>true, false</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Se o nó em qualquer dos extremos desta conexão TCP exigir autenticação TLS, o valor deste parâmetro é `true`, caso contrário, `false`. O valor é definido por `NDB` e não pode ser alterado pelo usuário.

* `SendBufferMemory`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração TCP de buffer de envio" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>booleano</td></tr><tr><th>Padrão</th><td>false</td></tr><tr><th>Intervalo</th><td>true, false</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Os transportadores TCP usam um buffer para armazenar todas as mensagens antes de realizar a chamada de envio ao sistema operacional. Quando esse buffer atinge 64 KB, seus conteúdos são enviados; eles também são enviados quando uma rodada de mensagens é executada. Para lidar com situações de sobrecarga temporária, também é possível definir um buffer de envio maior.

Se este parâmetro for definido explicitamente, a memória não será dedicada a cada transportador; em vez disso, o valor usado indica o limite máximo de memória (da memória total disponível, ou seja, `TotalSendBufferMemory`) que pode ser usada por um único transportador. Para obter mais informações sobre a configuração da alocação dinâmica de memória do buffer de envio do transportador no NDB Cluster, consulte a Seção 25.4.3.14, “Configurando os Parâmetros do Buffer de Envio do NDB Cluster”.

O tamanho padrão do buffer de envio é de 2 MB, que é o tamanho recomendado na maioria das situações. O tamanho mínimo é de 64 KB; o limite teórico máximo é de 4 GB.

* `SendSignalId`

  <table frame="box" rules="all" summary="Informações do parâmetro de configuração TCP e tipo e valor do sinal" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>booleano</td></tr><tr><th>Padrão</th><td>false</td></tr><tr><th>Intervalo</th><td>true, false</td></tr><tr><th>Tipo de Reinício</th><td><p><span class="bold"><strong>Reinício de Nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Rolling de um NDB Cluster" target="_blank">reinício rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Para poder rastrear um datagrama de mensagem distribuída, é necessário identificar cada mensagem. Quando este parâmetro é definido como `Y`, os IDs das mensagens são transportados pela rede. Este recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

* `TcpBind_INADDR_ANY`

  Definir este parâmetro como `TRUE` ou `1` vincula `IP_ADDR_ANY` para que conexões possam ser feitas de qualquer lugar (para conexões geradas automaticamente). O padrão é `FALSE` (`0`).

* `TcpSpinTime`

  <table frame="box" rules="all" summary="Informações do parâmetro de configuração TCP checksum e tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr><tr> <th>Padrão</th> <td>false</td> </tr><tr> <th>Intervalo</th> <td>true, false</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Controla a rotação para um transportador TCP; desative, definido para um valor não nulo. Isso funciona tanto para o lado do nó de dados quanto para o lado do nó de gerenciamento ou SQL da conexão.

* `TCP_MAXSEG_SIZE`

<table frame="box" rules="all" summary="Parâmetro de configuração do checksum do transportador TCP e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>booleano</td></tr><tr><th>Padrão</th><td>false</td></tr><tr><th>Intervalo</th><td>true, false</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Determina o tamanho do conjunto de memória durante a inicialização do transportador TCP. O padrão é recomendado para a maioria dos casos de uso comuns.

* `TCP_RCV_BUF_SIZE`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do TCP"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>booleano</td></tr><tr><th>Padrão</th><td>false</td></tr><tr><th>Intervalo</th><td>true, false</td></tr><tr><th>Tipo de reinício</th><td><p><span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>