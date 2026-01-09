#### 25.4.3.7 Definindo nós SQL e outros nós API em um NDB Cluster

As seções `[mysqld]` e `[api]` no arquivo `config.ini` definem o comportamento dos servidores MySQL (nós SQL) e outras aplicações (nós API) usados para acessar os dados do cluster. Nenhum dos parâmetros exibidos é obrigatório. Se nenhum nome de computador ou host for fornecido, qualquer host pode usar este nó SQL ou API.

De maneira geral, uma seção `[mysqld]` é usada para indicar um servidor MySQL que fornece uma interface SQL para o cluster, e uma seção `[api]` é usada para aplicações que não são processos do **mysqld** acessando dados do cluster, mas as duas designações são, na verdade, sinônimas; você pode, por exemplo, listar parâmetros para um servidor MySQL atuando como um nó SQL em uma seção `[api]`.

Nota

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte a Seção 25.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”. Para informações sobre as variáveis de sistema do servidor MySQL relacionadas ao NDB Cluster, consulte a Seção 25.4.3.9.2, “Variáveis de Sistema NDB Cluster”.

* `Id`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó API Id e informações sobre tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício Inicial do Sistema: </strong></span></p>Requer um desligamento completo do cluster, apagando e restaurando o sistema de arquivos do cluster a partir de um backup, e depois reiniciando o cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

O `Id` é um valor inteiro usado para identificar o nó em todas as mensagens internas do cluster. A faixa permitida de valores é de 1 a 255, inclusive. Esse valor deve ser único para cada nó no cluster, independentemente do tipo do nó.

Nota

Os IDs dos nós de dados devem ser menores que 145. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para nós de API (e nós de gerenciamento) a valores maiores que 144.

`NodeId` é o nome de parâmetro preferido a ser usado ao identificar nós de API. (`Id` continua sendo suportado para compatibilidade com versões anteriores, mas agora é desatualizado e gera uma mensagem de aviso quando usado. Também está sujeito à remoção futura.)

* `ConnectionMap`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de API do `ConnectionMap`, com informações sobre versão, tipo ou unidades, valor padrão, faixa e tipo de reinício" width="35%"> <col style="width: 50%"/><col style="width: 50%"> <tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Faixa</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr> </tbody></table>

  Especifica quais nós de dados devem ser conectados.

* `NodeId`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó da API `NodeId`">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 255</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um backup, e depois reiniciando o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  O `NodeId` é um valor inteiro usado para identificar o nó em todas as mensagens internas do clúster. O intervalo permitido de valores é de 1 a 255, inclusive. Esse valor deve ser único para cada nó no clúster, independentemente do tipo do nó.

  Nota

  Os IDs de nós de dados devem ser menores que 145. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs de nós para nós de API (e nós de gerenciamento) a valores maiores que 144.

  `NodeId` é o nome de parâmetro preferido a ser usado ao identificar nós de gerenciamento. Um alias, `Id`, foi usado para esse propósito em versões muito antigas do NDB Cluster e continua a ser suportado para compatibilidade reversa; agora é desatualizado e gera uma mensagem de aviso quando usado e está sujeito à remoção em uma futura versão do NDB Cluster.

* `ExecuteOnComputer`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ExecuteOnComputer: tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>nome</td>
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
    <th>Descontinuado</th>
    <td>Sim (em NDB 7.5)</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Isso se refere ao conjunto de `Id` para um dos computadores (hosts) definidos em uma seção `[computer]` do arquivo de configuração.

Importante

Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

* O ID do nó para este nó pode ser fornecido apenas para conexões que o solicitam explicitamente. Um servidor de gerenciamento que solicita qualquer ID de nó não pode usar este. Este parâmetro pode ser usado ao executar vários servidores de gerenciamento no mesmo host, e `HostName` não é suficiente para distinguir entre processos.

* `HostName`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó da API do HostName">
  <tr>
    <th>Versão (ou superior)</th>
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
    <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício contínuo do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Especificar este parâmetro define o nome do host do computador em que o nó SQL (nó da API) deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

  Se não for especificado `HostName` em uma seção `[mysql]` ou `[api]` dada no arquivo `config.ini`, então um nó SQL ou API pode se conectar usando o "slot" correspondente de qualquer host que possa estabelecer uma conexão de rede com a máquina do servidor de gerenciamento. *Isso difere do comportamento padrão para nós de dados, onde `localhost` é assumido para `HostName`, a menos que especificado de outra forma*.

* `LocationDomainId`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó da API LocationDomainId e informações sobre o tipo e o valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>inteiro</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>0</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>0 - 16</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Atribui um nó SQL ou outro nó de API a um domínio de disponibilidade específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  + Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

  + A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte WAN dos transportadores do `NDB` sem qualquer intervenção manual adicional.

  + O número do grupo do transportador pode ser baseado no domínio de disponibilidade usado, de modo que os nós SQL e outros nós de API também se comuniquem com nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

  + O árbitro pode ser selecionado de um domínio de disponibilidade em que não há nós de dados presentes, ou, se não for possível encontrar tal domínio de disponibilidade, de um terceiro domínio de disponibilidade.

  O `LocationDomainId` aceita um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `ArbitrationRank`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ArbitrationRank: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>0-2</td> </tr><tr><th>Padrão</th> <td>0</td> </tr><tr><th>Intervalo</th> <td>0 - 2</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Este parâmetro define quais nós podem atuar como árbitros. Tanto os nós de gerenciamento quanto os nós SQL podem ser árbitros. Um valor de 0 significa que o nó especificado nunca é usado como árbitro, um valor de 1 dá ao nó alta prioridade como árbitro, e um valor de 2 dá a ele baixa prioridade. Uma configuração normal usa o servidor de gerenciamento como árbitro, definindo sua `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e os de todos os nós SQL para 0 (o padrão para nós SQL).

Ao definir `ArbitrationRank` para 0 em todos os nós de gerenciamento e SQL, você pode desativar a arbitragem completamente. Você também pode controlar a arbitragem sobrescrevendo este parâmetro; para fazer isso, defina o parâmetro `Arbitration` na seção `[ndbd default]` do arquivo de configuração global `config.ini`.

* `ArbitrationDelay`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó da API BatchByteSize e informações sobre o tipo e o valor">
  <tr>
    <th>Versão (ou posterior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Padrão</th>
    <td>16K</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1K - 1M</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício em rolagem do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Definir este parâmetro para qualquer outro valor que não 0 (o padrão) significa que as respostas do árbitro para solicitações de arbitragem são atrasadas pelo número declarado de milissegundos. Geralmente, não é necessário alterar esse valor.

* `BatchByteSize`

Para consultas que são traduzidas em varreduras completas da tabela ou varreduras de intervalo em índices, é importante obter registros em lotes de tamanho adequado para obter o melhor desempenho. É possível definir o tamanho adequado tanto em termos de número de registros (`BatchSize`) quanto em termos de bytes (`BatchByteSize`). O tamanho do lote real é limitado por ambos os parâmetros.

A velocidade com que as consultas são executadas pode variar mais de 40% dependendo da configuração deste parâmetro.

Este parâmetro é medido em bytes. O valor padrão é 16K.

* `BatchSize`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API BatchSize e informações sobre tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>registros</td> </tr><tr> <th>Padrão</th> <td>256</td> </tr><tr> <th>Intervalo</th> <td>1 - 992</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Este parâmetro é medido em número de registros e, por padrão, é definido para 256. O tamanho máximo é 992.

* `ExtraSendBufferMemory`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó da API ConnectionMap: tipo e informações de valor">
  <tr>
    <th>Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th>Tipo ou unidades</th>
    <td>string</td>
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
    <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Este parâmetro especifica a quantidade de memória de buffer de envio do transportador a ser alocada além de qualquer que tenha sido definida usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="Parâmetros de configuração do nó da API ConnectionMap: tipo e informações de valor">
    <tr>
      <th>Versão (ou superior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>string</td>
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
      <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td>
    </tr>
  </table>

  Use este parâmetro para definir a política de agendamento e a prioridade das threads de batida de coração para nós de gerenciamento e nós de API. A sintaxe para definir este parâmetro é mostrada aqui:

  ```
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

Ao definir este parâmetro, você deve especificar uma política. Isso é um dos tipos e valores `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (round robin). Isso é seguido opcionalmente pela prioridade (um número inteiro).

* `MaxScanBatchSize`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ConnectionMap tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>string</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  O tamanho do lote é o tamanho de cada lote enviado de cada nó de dados. A maioria das varreduras é realizada em paralelo para proteger o MySQL Server de receber muito dados de muitos nós em paralelo; este parâmetro define um limite para o tamanho total do lote em todos os nós.

  O valor padrão deste parâmetro é definido para 256KB. Seu tamanho máximo é de 16MB.

* `TotalSendBufferMemory`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó da API ConnectionMap: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>string</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Este parâmetro é `false` por padrão. Isso força os nós de API desconectados (incluindo servidores MySQL que atuam como nós SQL) a usar uma nova conexão com o clúster em vez de tentar reutilizar uma existente, pois a reutilização de conexões pode causar problemas ao usar IDs de nó alocados dinamicamente. (Bug #45921)

Nota

Este parâmetro pode ser sobrescrito usando a API NDB. Para mais informações, consulte Ndb_cluster_connection::set_auto_reconnect() e Ndb_cluster_connection::get_auto_reconnect().

* `DefaultOperationRedoProblemAction`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ConnectionMap tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>string</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do clúster. (NDB 9.5.0)</p></td></tr></tbody></table>

  Este parâmetro (junto com `RedoOverCommitLimit` e `RedoOverCommitCounter`) controla a manipulação das operações pelo nó de dados quando leva muito tempo para esvaziar os logs de redo para o disco. Isso ocorre quando um determinado esvaziamento de log de redo leva mais tempo do que `RedoOverCommitLimit` segundos, mais do que `RedoOverCommitCounter` vezes, fazendo com que quaisquer transações pendentes sejam abortadas.

  Quando isso acontece, o nó pode responder de uma das duas maneiras, de acordo com o valor de `DefaultOperationRedoProblemAction`, listados aqui:

+ `ABORT`: Todas as operações pendentes de transações abortadas também são abortadas.

+ `QUEUE`: Operações pendentes de transações que foram abortadas são colocadas em fila para serem re-probatas. Isso é o padrão. As operações pendentes ainda são abortadas quando o log de revisão fica sem espaço — ou seja, quando ocorrem erros P_TAIL_PROBLEM.

* `DefaultHashMapSize`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ConnectionMap tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  O tamanho dos mapas de hash da tabela usados pelo `NDB` é configurável usando este parâmetro. `DefaultHashMapSize` pode assumir qualquer um dos três valores possíveis (0, 240, 3840). Esses valores e seus efeitos são descritos na tabela a seguir.

**Tabela 25.16 Valores do parâmetro `DefaultHashMapSize`**

<table frame="box" rules="all" summary="Parâmetro de configuração do nó da API ConnectionMap: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>string</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício em rolagem do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

O uso padrão do parâmetro de configuração do nó da API ConnectionMap é o WAN TCP.

* `ConnectBackoffMaxTime`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó da API NDB Cluster: versão, tipo ou unidades, valor padrão, intervalo e tipo de reinício">
  <tr> <th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr>
  <tr> <th>Tipo ou unidades</th> <td>string</td> </tr>
  <tr> <th>Valor padrão</th> <td>[...]</td> </tr>
  <tr> <th>Intervalo</th> <td>...</td> </tr>
  <tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr>
</table>

  Em um NDB Cluster com muitos nós de dados não iniciados, o valor deste parâmetro pode ser aumentado para contornar tentativas de conexão com nós de dados que ainda não começaram a funcionar no cluster, bem como para moderar o tráfego alto nos nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o tempo em milissegundos a ser aguardado entre as tentativas de conexão.

  O tempo decorrido *durante* as tentativas de conexão do nó não é levado em consideração ao calcular o tempo decorrido para este parâmetro. O tempo limite é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é duplicado até atingir os milissegundos `ConnectBackoffMaxTime`, até um máximo de 100000 ms (100s).

Uma vez que o nó da API esteja conectado a um nó de dados e esse nó informe (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão com esses nós de dados não serão mais afetadas por esse parâmetro e serão feitas a cada 100 ms, a partir daí, até que sejam conectadas. Uma vez que um nó de dados tenha começado, ele pode usar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

* `StartConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API do NDB Cluster e informações sobre o tipo e o valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício Inicial do Sistema: </strong></span></p>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um backup, e depois reiniciando o clúster. (NDB 9.5.0)</a></td></tr></tbody></table>

  Em um NDB Cluster com muitos nós de dados não iniciados, o valor desse parâmetro pode ser aumentado para contornar as tentativas de conexão com nós de dados que ainda não começaram a funcionar no clúster, bem como o tráfego moderado de alto tráfego para nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o tempo em milissegundos a ser esperado entre as tentativas de conexão.

O tempo decorrido *durante* as tentativas de conexão do nó não é levado em consideração ao calcular o tempo decorrido para este parâmetro. O tempo de espera é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é dobrado até atingir `StartConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

Uma vez que o nó da API está conectado a um nó de dados e esse nó relata (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão a esses nós de dados não são mais afetadas por este parâmetro e são feitas a cada 100 ms, a partir daí, até a conexão. Uma vez que um nó de dados tenha iniciado, ele pode levar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

**Parâmetros de Depuração do Nó da API.** Você pode usar o parâmetro de configuração `ApiVerbose` para habilitar a saída de depuração de um nó da API dado. Este parâmetro aceita um valor inteiro. 0 é o padrão e desabilita a tal depuração; 1 habilita a saída de depuração para o log do cluster; 2 adiciona a saída de depuração `DBDICT` também. (Bug #20638450) Veja também DUMP 1229.

Você também pode obter informações de um servidor MySQL que está rodando como um nó SQL do NDB Cluster usando `SHOW STATUS` no cliente **mysql**, como mostrado aqui:

```
mysql> SHOW STATUS LIKE 'ndb%';
+-----------------------------+----------------+
| Variable_name               | Value          |
+-----------------------------+----------------+
| Ndb_cluster_node_id         | 5              |
| Ndb_config_from_host        | 198.51.100.112 |
| Ndb_config_from_port        | 1186           |
| Ndb_number_of_storage_nodes | 4              |
+-----------------------------+----------------+
4 rows in set (0.02 sec)
```

Para informações sobre as variáveis de status que aparecem na saída desta declaração, consulte a Seção 25.4.3.9.3, “Variáveis de Status do NDB Cluster”.

Nota

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao cluster.

Não é *necessário* realizar nenhum reinício do cluster se novos nós SQL ou API puderem empregar slots de API não utilizados anteriormente na configuração do cluster para se conectarem ao cluster.

**Tipos de reinício.** As informações sobre os tipos de reinício usados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 25.17 Tipos de reinício do NDB Cluster**

<table frame="box" rules="all" summary="Informações sobre o tipo de reinício e o valor dos parâmetros de configuração do nó API do NDB Cluster" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>1 - 255</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do cluster, apagando e restaurando o sistema de arquivos do cluster a partir de um backup, e depois reiniciando o cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>