#### 21.4.3.12 Conexões de Memória Compartilhada do NDB Cluster

As comunicações entre os nós do cluster do NDB são normalmente gerenciadas usando TCP/IP. O transportador de memória compartilhada (SHM) se destaca pelo fato de que os sinais são transmitidos escrevendo na memória em vez de em uma conexão de soquete. O transportador de memória compartilhada (SHM) pode melhorar o desempenho ao negar até 20% do overhead necessário por uma conexão TCP ao executar um nó de API (geralmente um nó SQL) e um nó de dados juntos no mesmo host. Você pode habilitar uma conexão de memória compartilhada de duas das maneiras listadas aqui:

- Ao definir o parâmetro de configuração do nó de dados `UseShm` para `1` e definir `HostName` para o nó de dados e `HostName` para o nó da API para o mesmo valor.

- Ao usar as seções `[shm]` no arquivo de configuração do cluster, cada uma contendo configurações para `[NodeId1]` (mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) e `[NodeId2]` (mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2). Esse método é descrito com mais detalhes mais adiante nesta seção.

Suponha que um clúster esteja executando um nó de dados que tem o ID de nó 1 e um nó SQL com o ID de nó 51 no mesmo computador host em 10.0.0.1. Para habilitar uma conexão SHM entre esses dois nós, tudo o que é necessário é garantir que as seguintes entradas estejam incluídas no arquivo de configuração do clúster:

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

As duas entradas mostradas acima estão além de quaisquer outras entradas e configurações de parâmetros necessárias pelo clúster. Um exemplo mais completo é mostrado mais adiante nesta seção.

Antes de iniciar nós de dados que utilizam conexões SHM, também é necessário garantir que o sistema operacional de cada computador que hospeda um desses nós de dados tenha memória suficiente alocada para os segmentos de memória compartilhada. Consulte a documentação da sua plataforma operacional para obter informações sobre isso. Em configurações em que vários hosts estão executando cada um um nó de dados e um nó de API, é possível habilitar a memória compartilhada em todos esses hosts, configurando `UseShm` na seção `[ndbd default]` do arquivo de configuração. Isso é mostrado no exemplo mais adiante nesta seção.

Embora não seja estritamente necessário, o ajuste para todas as conexões SHM no clúster pode ser feito definindo um ou mais dos seguintes parâmetros na seção `[shm default]` do arquivo de configuração do clúster (`config.ini`):

- `ShmSize`: Tamanho da memória compartilhada

- `ShmSpinTime`: Tempo em µs para girar antes de dormir

- `SendBufferMemory`: Tamanho do buffer para sinais enviados a partir deste nó, em bytes.

- `SendSignalId`: Indica que uma ID de sinal está incluída em cada sinal enviado através do transportador.

- `Checksum`: Indica que um checksum está incluído em cada sinal enviado através do transportador.

- `PreSendChecksum`: As verificações do checksum são feitas antes de enviar o sinal; o checksum também deve estar habilitado para que isso funcione

Este exemplo mostra uma configuração simples com conexões SHM definidas em vários hosts, em um NDB Cluster usando 3 computadores listados aqui por nome de host, hospedando os tipos de nó mostrados:

1. `10.0.0.0`: O servidor de gerenciamento
2. `10.0.0.1`: Um nó de dados e um nó de SQL
3. `10.0.0.2`: Um nó de dados e um nó de SQL

Nesse cenário, cada nó de dados comunica-se tanto com o servidor de gerenciamento quanto com o outro nó de dados usando transportadores TCP; cada nó SQL usa um transportador de memória compartilhada para se comunicar com os nós de dados locais e um transportador TCP para se comunicar com o nó de dados remoto. Uma configuração básica que reflete essa configuração é ativada pelo arquivo config.ini, cujos conteúdos são mostrados aqui:

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

Os parâmetros que afetam todos os transportadores de memória compartilhada são definidos na seção `[shm default]`; esses parâmetros podem ser substituídos individualmente para cada conexão em uma ou mais seções `[shm]`. Cada seção deve ser associada a uma conexão SHM específica usando `NodeId1` e `NodeId2`; os valores necessários para esses parâmetros são os IDs dos nós dos dois nós conectados pelo transportador. Você também pode identificar os nós pelo nome do host usando `HostName1` e `HostName2`, mas esses parâmetros não são obrigatórios.

Os nós da API para os quais não são definidos nomes de host usam o transportador TCP para se comunicar com os nós de dados independentemente dos hosts nos quais são iniciados; os parâmetros e valores definidos na seção `[tcp default]` do arquivo de configuração se aplicam a todos os transportadores TCP no clúster.

Para um desempenho ótimo, você pode definir um tempo de rotação para o transportador SHM (parâmetro `ShmSpinTime`) Isso afeta tanto o fio de recebimento do nó de dados quanto o proprietário da solicitação de pesquisa (fio de recebimento ou fio de usuário) no `NDB`.

- `Checksum`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração da memória de verificação compartilhada" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr><tr> <th>Padrão</th> <td>verdadeiro</td> </tr><tr> <th>Gama</th> <td>verdadeiro, falso</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é um parâmetro booleano (`Y`/`N`) que está desativado por padrão. Quando ativado, os checksums de todas as mensagens são calculados antes de serem colocados no buffer de envio.

  Esse recurso impede que as mensagens sejam corrompidas enquanto aguardam no buffer de envio. Ele também serve como uma verificação contra a corrupção dos dados durante o transporte.

- `Grupo`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Determina a proximidade do grupo; um valor menor é interpretado como estando mais próximo. O valor padrão é suficiente para a maioria das condições.

- `HostName1`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração da memória HostName1" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Os parâmetros `HostName1` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem utilizadas para uma conexão SHM específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

- `HostName2`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração de memória hospedeira HostName2" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Os parâmetros ``HostName1`` e `HostName2` podem ser usados para especificar interfaces de rede específicas a serem usadas para uma conexão SHM específica entre dois nós. Os valores usados para esses parâmetros podem ser nomes de host ou endereços IP.

- `NodeId1`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração da memória de nó Id1" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nós, é necessário fornecer os identificadores de nó para cada um deles, como `NodeId1` e `NodeId2`.

- `NodeId2`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração da memória compartilhada NodeId2" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Para identificar uma conexão entre dois nós, é necessário fornecer os identificadores de nó para cada um deles, como `NodeId1` e `NodeId2` (mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1).

- `NodeIdServer`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração da memória compartilhada NodeIdServer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>numérico</td> </tr><tr> <th>Padrão</th> <td>[nenhum]</td> </tr><tr> <th>Gama</th> <td>1 - 63</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Identifique o final do servidor de uma conexão de memória compartilhada. Por padrão, este é o ID do nó do nó de dados.

- `Limite de sobrecarga`

  <table frame="box" rules="all" summary="Tipo e valor da informação do parâmetro de configuração de memória de sobrecarga do OverloadLimit" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Quando há mais de esse número de bytes não enviados no buffer de envio, a conexão é considerada sobrecarregada.

  Este parâmetro pode ser usado para determinar a quantidade de dados não enviados que devem estar presentes no buffer de envio antes que a conexão seja considerada sobrecarregada. Consulte Seção 21.4.3.13, “Configurando Parâmetros do Buffer de Envio do NDB Cluster” e Seção 21.6.15.44, “A Tabela de Transportadores ndbinfo” para obter mais informações.

- `PortNumber`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração de memória compartilhada PortNumber" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>0 - 64K</td> </tr><tr> <th>Removido</th> <td>NDB 7.5.1</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Defina o porto a ser usado pelo transportador SHM.

- `PreSendChecksum`

  <table frame="box" rules="all" summary="Parâmetro de configuração de memória compartilhada PreSendChecksum tipo e informações de valor" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo ou unidades</th> <td>booleano</td> </tr><tr> <th>Padrão</th> <td>falsa</td> </tr><tr> <th>Gama</th> <td>verdadeiro, falso</td> </tr><tr> <th>Adicionei</th> <td>NDB 7.6.6</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Se este parâmetro e `Checksum` estiverem habilitados, realize verificações de checksum pré-envio e verifique todos os sinais SHM entre os nós em busca de erros. Não tem efeito se `Checksum` não estiver habilitado.

- `SendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>0

  Tamanho (em bytes) do buffer de memória compartilhada para sinais enviados a partir deste nó usando uma conexão de memória compartilhada.

- `SendSignalId`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>1

  Para rastrear o caminho de uma mensagem distribuída, é necessário atribuir um identificador único a cada mensagem. Definir esse parâmetro como `Y` faz com que esses IDs de mensagem sejam transportados pela rede também. Esse recurso é desativado por padrão em builds de produção e ativado em builds de `-debug`.

- `ShmKey`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>2

  Ao configurar segmentos de memória compartilhada, um ID de nó, expresso como um inteiro, é usado para identificar de forma única o segmento de memória compartilhada a ser utilizado para a comunicação. Não há um valor padrão. Se `UseShm` estiver habilitado, a chave de memória compartilhada é calculada automaticamente pelo `NDB`.

- `ShmSize`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>3

  Cada conexão SHM tem um segmento de memória compartilhada onde as mensagens entre os nós são colocadas pelo remetente e lidas pelo leitor. O tamanho desse segmento é definido por `ShmSize`. O valor padrão no NDB 7.6 é de 4 MB.

- `ShmSpinTime`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>4

  Ao receber, o tempo de espera antes de dormir, em microsegundos.

- `SigNum`

  <table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>5

  Este parâmetro não é mais usado no NDB 7.6, no qual qualquer configuração para ele é ignorada.

  O seguinte se aplica apenas no NDB 7.5 (e versões anteriores):

  Ao usar o transportador de memória compartilhada, um processo envia um sinal ao sistema operacional quando há novos dados disponíveis na memória compartilhada. Se esse sinal entrar em conflito com um sinal existente, esse parâmetro pode ser usado para alterá-lo. Essa é uma possibilidade ao usar o SHM devido ao fato de que diferentes sistemas operacionais usam números de sinal diferentes.

  O valor padrão de `SigNum` é 0; portanto, ele deve ser definido para evitar erros no log do cluster ao usar o transportador de memória compartilhada. Normalmente, este parâmetro é definido para 10 na seção `[shm default]` do arquivo `config.ini`.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.20 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="Tipo e valor de parâmetro de configuração da memória em grupo" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>35</td> </tr><tr> <th>Gama</th> <td>0 - 200</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>6
