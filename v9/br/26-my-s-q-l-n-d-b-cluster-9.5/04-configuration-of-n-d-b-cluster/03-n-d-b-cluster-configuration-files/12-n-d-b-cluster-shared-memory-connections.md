#### 25.4.3.12 Conexões de Memória Compartilhada do NDB Cluster

As comunicações entre os nós do cluster NDB são normalmente realizadas usando TCP/IP. O transportador de memória compartilhada (SHM) se destaca pelo fato de que os sinais são transmitidos escrevendo na memória em vez de em uma soquete. O transportador de memória compartilhada (SHM) pode melhorar o desempenho ao negar até 20% do overhead necessário por uma conexão TCP ao executar um nó de API (geralmente um nó SQL) e um nó de dados juntos no mesmo host. Você pode habilitar uma conexão de memória compartilhada de duas das seguintes maneiras:

* Definindo o parâmetro de configuração do nó de dados `UseShm` para `1` e definindo `HostName` para o nó de dados e `HostName` para o nó de API para o mesmo valor.

* Usando seções `[shm]` no arquivo de configuração do cluster, cada uma contendo configurações para `NodeId1` e `NodeId2`. Esse método é descrito com mais detalhes mais adiante nesta seção.

Suponha que um cluster esteja executando um nó de dados que tem o ID de nó 1 e um nó SQL com o ID de nó 51 no mesmo computador host em 10.0.0.1. Para habilitar uma conexão SHM entre esses dois nós, tudo o que é necessário é garantir que as seguintes entradas estejam incluídas no arquivo de configuração do cluster:

```
[ndbd]
NodeId=1
HostName=10.0.0.1
UseShm=1

[mysqld]
NodeId=51
HostName=10.0.0.1
```

Importante

As duas entradas mostradas acima são adicionais a quaisquer outras entradas e configurações de parâmetros necessárias pelo cluster. Um exemplo mais completo é mostrado mais adiante nesta seção.

Antes de iniciar nós de dados que utilizam conexões SHM, também é necessário garantir que o sistema operacional de cada computador que hospeda um desses nós de dados tenha memória suficiente alocada para os segmentos de memória compartilhada. Consulte a documentação da sua plataforma operacional para obter informações sobre isso. Em configurações em que vários hosts estão executando cada um um nó de dados e um nó de API, é possível habilitar a memória compartilhada em todos esses hosts, configurando `UseShm` na seção `[ndbd default]` do arquivo de configuração. Isso é mostrado no exemplo mais adiante nesta seção.

Embora não seja estritamente necessário, o ajuste para todas as conexões SHM no clúster pode ser feito configurando um ou mais dos seguintes parâmetros na seção `[shm default]` do arquivo de configuração do clúster (`config.ini`):

* `ShmSize`: Tamanho da memória compartilhada

* `ShmSpinTime`: Tempo em µs para girar antes de dormir

* `SendBufferMemory`: Tamanho do buffer para sinais enviados a partir deste nó, em bytes.

* `SendSignalId`: Indica que um ID de sinal é incluído em cada sinal enviado pelo transportador.

* `Checksum`: Indica que um checksum é incluído em cada sinal enviado pelo transportador.

* `PreSendChecksum`: As verificações do checksum são feitas antes de enviar o sinal; o checksum também deve ser habilitado para que isso funcione

Este exemplo mostra uma configuração simples com conexões SHM definidas em vários hosts, em um NDB Cluster usando 3 computadores listados aqui por nome de host, hospedando os tipos de nó mostrados:

1. `10.0.0.0`: O servidor de gerenciamento
2. `10.0.0.1`: Um nó de dados e um nó SQL
3. `10.0.0.2`: Um nó de dados e um nó SQL

Nesse cenário, cada nó de dados comunica-se tanto com o servidor de gerenciamento quanto com o outro nó de dados usando transportadores TCP; cada nó SQL usa um transportador de memória compartilhada para se comunicar com os nós de dados locais e um transportador TCP para se comunicar com o nó de dados remoto. Uma configuração básica que reflete essa configuração é habilitada pelo arquivo `config.ini`, cujos conteúdos são mostrados aqui:

```
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

Os parâmetros que afetam todos os transportadores de memória compartilhada são definidos na seção `[shm default]`; esses parâmetros podem ser sobrescritos por conexão em uma ou mais seções `[shm]`. Cada seção deve ser associada a uma conexão SHM específica usando `NodeId1` e `NodeId2`; os valores necessários para esses parâmetros são os IDs de nó dos dois nós conectados pelo transportador. Você também pode identificar os nós pelo nome do host usando `HostName1` e `HostName2`, mas esses parâmetros não são obrigatórios.

Os nós da API para os quais não são definidos nomes de host usam o transportador TCP para se comunicar com os nós de dados independentemente dos hosts nos quais são iniciados; os parâmetros e valores definidos na seção `[tcp default]` do arquivo de configuração se aplicam a todos os transportadores TCP no clúster.

Para um desempenho ótimo, você pode definir um tempo de rotação para o transportador de memória compartilhada (`ShmSpinTime` parâmetro); isso afeta tanto o thread receptor do nó de dados quanto o proprietário da pesquisa (thread de recebimento ou thread de usuário) em `NDB`.

* `Checksum`

<table frame="box" rules="all" summary="Parâmetro de configuração da memória compartilhada do tipo e informações do valor do checksum">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>booleano</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>true</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>true, false</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Este parâmetro é um parâmetro booleano (`Y`/`N`) que está desativado por padrão. Quando ativado, os checksums de todas as mensagens são calculados antes de serem colocados no buffer de envio.

Esta funcionalidade previne que as mensagens sejam corrompidas enquanto aguardam no buffer de envio. Também serve como uma verificação contra a corrupção de dados durante o transporte.

* `Grupo`

<table frame="box" rules="all" summary="Parâmetro de configuração da memória compartilhada do tipo e informações do valor do checksum">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>35</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>0 - 200</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Determina a proximidade do grupo; um valor menor é interpretado como estando mais próximo. O valor padrão é suficiente para a maioria das condições.

* `HostName1`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada HostName1 tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão SHM específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `HostName2`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada HostName2 tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão SHM específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

* `NodeId1`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada NodeId1 tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>numérico</td></tr><tr><th>Padrão</th><td>[nenhum]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Para identificar uma conexão entre dois nós, é necessário fornecer identificadores de nó para cada um deles, como `NodeId1` e `NodeId2`.

* `NodeId2`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada NodeId2 tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>numérico</td></tr><tr><th>Padrão</th><td>[nenhum]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Para identificar uma conexão entre dois nós, é necessário fornecer os identificadores dos nós para cada um deles, como `NodeId1` e `NodeId2`.

* `NodeIdServer`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada `NodeIdServer` tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>numérico</td></tr><tr><th>Padrão</th><td>[nenhum]</td></tr><tr><th>Intervalo</th><td>1 - 63</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Identifique o final do servidor de uma conexão de memória compartilhada. Por padrão, este é o ID do nó do nó de dados.

* `OverloadLimit`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada `OverloadLimit` tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>bytes</td></tr><tr><th>Padrão</th><td>0</td></tr><tr><th>Intervalo</th><td>0 - 4294967039 (0xFFFFFEFF)</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Quando houver mais de esse número de bytes não enviados no buffer de envio, a conexão será considerada sobrecarregada. Consulte a Seção 25.4.3.14, “Configurando Parâmetros do Buffer de Envio do NDB Cluster”, e a Seção 25.6.15.66, “A Tabela de Transportadores ndbinfo”, para obter mais informações.

* `PreSendChecksum`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração de memória compartilhada PreSendChecksum" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>booleano</td> </tr><tr><th>Padrão</th> <td>false</td> </tr><tr><th>Intervalo</th> <td>true, false</td> </tr><tr><th>Tipo de Reinício</th> <td><p> <span><strong>Reinício de Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver também habilitado.

* `SendBufferMemory`

<table frame="box" rules="all" summary="Parâmetro de configuração do buffer de memória compartilhada SendBufferMemory tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>inteiro</td></tr><tr><th>Padrão</th><td>2M</td></tr><tr><th>Intervalo</th><td>256K - 4294967039 (0xFFFFFEFF)</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Tamanho (em bytes) do buffer de memória compartilhada para sinais enviados a partir deste nó usando uma conexão de memória compartilhada.

* `SendSignalId`

Para rastrear o caminho de uma mensagem distribuída, é necessário fornecer a cada mensagem um identificador único. Definir esse parâmetro como `Y` faz com que esses IDs de mensagem sejam transportados pela rede também. Esse recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

* `ShmKey`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração da memória compartilhada" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>35</td> </tr><tr><th>Intervalo</th> <td>0 - 200</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Ao configurar segmentos de memória compartilhada, um ID de nó, expresso como um inteiro, é usado para identificar de forma única o segmento de memória compartilhada a ser usado para a comunicação. Não há valor padrão. Se `UseShm` estiver habilitado, a chave da memória compartilhada é calculada automaticamente pelo `NDB`.

* `ShmSize`

<table frame="box" rules="all" summary="Parâmetros de configuração do segmento de memória compartilhada do grupo e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>35</td></tr><tr><th>Intervalo</th><td>0 - 200</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Cada conexão SHM tem um segmento de memória compartilhada onde as mensagens entre os nós são colocadas pelo remetente e lidas pelo leitor. O tamanho desse segmento é definido por `ShmSize`. O valor padrão é de 4 MB.

* `ShmSpinTime`

<table frame="box" rules="all" summary="Parâmetros de configuração do segmento de memória compartilhada do grupo e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>35</td></tr><tr><th>Intervalo</th><td>0 - 200</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Ao receber, o tempo de espera antes de dormir, em microsegundos.

* `SigNum`

<table frame="box" rules="all" summary="Parâmetro de configuração do tipo e valor da memória compartilhada do grupo" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>35</td></tr><tr><th>Intervalo</th><td>0 - 200</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>