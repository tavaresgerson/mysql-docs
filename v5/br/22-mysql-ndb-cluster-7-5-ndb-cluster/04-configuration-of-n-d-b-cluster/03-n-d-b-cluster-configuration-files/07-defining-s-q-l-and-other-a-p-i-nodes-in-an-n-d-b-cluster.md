#### 21.4.3.7 Definindo nós SQL e outros nós de API em um cluster NDB

As seções `[mysqld]` e `[api]` no arquivo `config.ini` definem o comportamento dos servidores MySQL (nós SQL) e de outras aplicações (nós API) usados para acessar os dados do cluster. Nenhum dos parâmetros mostrados é obrigatório. Se nenhum nome de computador ou host for fornecido, qualquer host pode usar esse nó SQL ou API.

De modo geral, uma seção `[mysqld]` é usada para indicar um servidor MySQL que fornece uma interface SQL para o clúster, e uma seção `[api]` é usada para aplicações que não são processos do **mysqld** acessando dados do clúster, mas as duas designações são, na verdade, sinônimas; você pode, por exemplo, listar parâmetros para um servidor MySQL que atua como um nó SQL em uma seção `[api]`.

Nota

Para uma discussão sobre as opções do servidor MySQL para o NDB Cluster, consulte Seção 21.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”. Para informações sobre as variáveis do sistema do servidor MySQL relacionadas ao NDB Cluster, consulte Seção 21.4.3.9.2, “Variáveis de Sistema do NDB Cluster”.

- `Id`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir debackup, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  O `Id` é um valor inteiro usado para identificar o nó em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Esse valor deve ser único para cada nó no cluster, independentemente do tipo de nó.

  Nota

  Os IDs dos nós de dados devem ser menores que 49, independentemente da versão do NDB Cluster utilizada. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para os nós da API (e nós de gerenciamento) para valores maiores que 48.

  `NodeId` é o nome de parâmetro preferido a ser usado ao identificar nós da API. (`Id` continua sendo suportado para compatibilidade com versões anteriores, mas agora é desaconselhado e gera uma mensagem de aviso quando usado. Ele também está sujeito à remoção futura.)

- `ConnectionMap`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Especifica quais nós de dados devem ser conectados.

- `NodeId`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir debackup, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  O `NodeId` é um valor inteiro usado para identificar o nó em todas as mensagens internas do cluster. O intervalo permitido de valores é de 1 a 255, inclusive. Esse valor deve ser único para cada nó no cluster, independentemente do tipo de nó.

  Nota

  Os IDs dos nós de dados devem ser menores que 49, independentemente da versão do NDB Cluster utilizada. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para os nós da API (e nós de gerenciamento) para valores maiores que 48.

  `NodeId` é o nome de parâmetro preferido a ser usado ao identificar os nós de gerenciamento. Um alias, `Id`, foi usado para esse propósito em versões muito antigas do NDB Cluster e continua sendo suportado para compatibilidade reversa; ele já está desatualizado e gera uma mensagem de aviso quando usado e está sujeito à remoção em uma futura versão do NDB Cluster.

- `ExecuteOnComputer`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Isso se refere ao conjunto `Id` para um dos computadores (hosts) definidos em uma seção `[computer]` do arquivo de configuração.

  Importante

  Este parâmetro é desaconselhável a partir da NDB 7.5.0 e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

- `HostName`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Especificar este parâmetro define o nome do host do computador em que o nó SQL (nó de API) deve residir.

  Se não for especificado um `HostName` em uma seção específica de `[mysql]` ou `[api]` no arquivo `config.ini`, então um nó SQL ou API pode se conectar usando o "slot" correspondente de qualquer host que possa estabelecer uma conexão de rede com a máquina do servidor de gerenciamento. *Isso difere do comportamento padrão para nós de dados, onde `localhost` é assumido para `HostName`, a menos que especificado de outra forma*.

- `LocationDomainId`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Adicionei</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Atribui um nó SQL ou outro nó de API a um domínio de disponibilidade específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  - Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

  - A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

  - O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que, sempre que possível, os nós SQL e outros nós de API também se comuniquem com os nós de dados locais no mesmo domínio de disponibilidade.

  - O árbitro pode ser selecionado a partir de um domínio de disponibilidade no qual não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

  `LocationDomainId` recebe um valor inteiro entre 0 e 16, inclusive, com 0 sendo o valor padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

- `ArbitrationRank`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API ArbitrationRank" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>0-2</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 a 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro define quais nós podem atuar como árbitros. Tanto os nós de gerenciamento quanto os nós SQL podem ser árbitros. Um valor de 0 significa que o nó fornecido nunca é usado como árbitro, um valor de 1 dá ao nó alta prioridade como árbitro e um valor de 2 dá a ele baixa prioridade. Uma configuração normal usa o servidor de gerenciamento como árbitro, definindo seu `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e os de todos os nós SQL para 0 (o padrão para nós SQL).

  Ao definir `ArbitrationRank` para 0 em todos os nós de gerenciamento e SQL, você pode desativar a arbitragem completamente. Você também pode controlar a arbitragem sobrescrevendo este parâmetro; para fazer isso, defina o parâmetro `Arbitration` na seção `[ndbd default]` do arquivo de configuração global `config.ini`.

- `Atraso na arbitragem`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó da API de arbitragem: tipo e valor de informação" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>milissegundos</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Definir este parâmetro para qualquer outro valor que não 0 (o padrão) significa que as respostas do árbitro às solicitações de arbitragem são atrasadas pelo número especificado de milissegundos. Geralmente, não é necessário alterar esse valor.

- `BatchByteSize`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API BatchByteSize" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>bytes</td> </tr><tr> <th>Padrão</th> <td>16K</td> </tr><tr> <th>Gama</th> <td>1K - 1M</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Para consultas que são traduzidas em varreduras completas da tabela ou varreduras de intervalo em índices, é importante obter os registros em lotes de tamanho adequado para obter o melhor desempenho. É possível definir o tamanho adequado tanto em termos de número de registros (`BatchSize`) quanto em termos de bytes (`BatchByteSize`). O tamanho do lote real é limitado por ambos os parâmetros.

  A velocidade com que as consultas são realizadas pode variar em mais de 40% dependendo da configuração deste parâmetro.

  Este parâmetro é medido em bytes. O valor padrão é 16K.

- `BatchSize`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API BatchSize" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>registros</td> </tr><tr> <th>Padrão</th> <td>256</td> </tr><tr> <th>Gama</th> <td>1 - 992</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é medido em número de registros e, por padrão, é definido para 256. O tamanho máximo é de 992.

- `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro especifica a quantidade de memória de buffer de envio do transportador a ser alocada, além da que foi definida usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

- `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Use este parâmetro para definir a política de agendamento e a prioridade das threads de batida de coração para nós de gerenciamento e API. A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  Ao definir este parâmetro, você deve especificar uma política. Isso é um dos `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (round robin). Isso pode ser seguido opcionalmente pela prioridade (um número inteiro).

- `MaxScanBatchSize`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  O tamanho do lote é o tamanho de cada lote enviado a partir de cada nó de dados. A maioria das varreduras é realizada em paralelo para proteger o servidor MySQL de receber muitos dados de muitos nós em paralelo; este parâmetro define um limite para o tamanho total do lote em todos os nós.

  O valor padrão deste parâmetro é definido em 256 KB. Seu tamanho máximo é de 16 MB.

- `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste nó para a memória do buffer de envio compartilhado entre todos os transportadores configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para obter informações mais detalhadas, consulte Seção 21.4.3.13, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

- `AutoReconnect`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é `false` por padrão. Isso obriga os nós da API desconectados (incluindo servidores MySQL que atuam como nós SQL) a usar uma nova conexão com o clúster em vez de tentar reutilizar uma existente, pois a reutilização de conexões pode causar problemas ao usar IDs de nós alocados dinamicamente. (Bug #45921)

  Nota

  Este parâmetro pode ser sobrescrito usando a API NDB. Para mais informações, consulte Ndb_cluster_connection::set_auto_reconnect() e Ndb_cluster_connection::get_auto_reconnect().

- `DefaultOperationRedoProblemAction`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro (junto com `RedoOverCommitLimit` e `RedoOverCommitCounter`) controla a forma como o nó de dados lida com as operações quando leva muito tempo para limpar os logs de refazer no disco. Isso ocorre quando uma limpeza de log de refazer específico leva mais de `RedoOverCommitLimit` segundos, mais de `RedoOverCommitCounter` vezes, fazendo com que quaisquer transações pendentes sejam abortadas.

  Quando isso acontece, o nó pode responder de duas maneiras, de acordo com o valor de `DefaultOperationRedoProblemAction`, listado aqui:

  - `ABORT`: Qualquer operação pendente de transações abortadas também é abortada.

  - `QUEUE`: As operações pendentes de transações que foram abortadas são colocadas em fila para serem re-providas. Isso é o padrão. As operações pendentes ainda são abortadas quando o log de reverso fica sem espaço — ou seja, quando ocorrem erros P_TAIL_PROBLEM.

- `DefaultHashMapSize`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  O tamanho dos mapas de hash da tabela usados pelo `NDB` é configurável usando este parâmetro. `DefaultHashMapSize` pode assumir qualquer um dos três valores possíveis (0, 240, 3840).

  O uso original previsto para este parâmetro era facilitar as atualizações e, especialmente, as desatualizações para e a partir de versões muito antigas com tamanhos de mapa de hash padrão diferentes. Isso não é um problema ao atualizar o NDB Cluster 7.3 (ou versões posteriores).

  Atualmente, não é possível diminuir esse parâmetro online após a criação ou modificação de tabelas com o valor de `DefaultHashMapSize` igual a 3840.

- `Wan`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Use a configuração WAN TCP como padrão.

- `ConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Em um NDB Cluster com muitos nós de dados não iniciados, o valor deste parâmetro pode ser aumentado para contornar tentativas de conexão com nós de dados que ainda não começaram a funcionar no cluster, além de moderar o tráfego alto nos nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` será aplicado; caso contrário, o `ConnectBackoffMaxTime` será usado para determinar o tempo em milissegundos a ser aguardado entre as tentativas de conexão.

  O tempo decorrido *durante* as tentativas de conexão do nó não é considerado ao calcular o tempo decorrido para este parâmetro. O tempo de espera é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é duplicado até atingir `ConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

  Uma vez que o nó da API esteja conectado a um nó de dados e esse nó informe (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão com esses nós de dados não serão mais afetadas por esse parâmetro e serão feitas a cada 100 ms em seguida, até que sejam conectadas. Uma vez que um nó de dados tenha iniciado, ele pode levar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

- `StartConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó da API ConnectionMap" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Em um NDB Cluster com muitos nós de dados não iniciados, o valor deste parâmetro pode ser aumentado para contornar tentativas de conexão com nós de dados que ainda não começaram a funcionar no cluster, além de moderar o tráfego alto nos nós de gerenciamento. Enquanto o nó da API não estiver conectado a nenhum novo nó de dados, o valor do parâmetro `StartConnectBackoffMaxTime` é aplicado; caso contrário, `ConnectBackoffMaxTime` é usado para determinar o tempo em milissegundos a ser aguardado entre as tentativas de conexão.

  O tempo decorrido *durante* as tentativas de conexão do nó não é considerado ao calcular o tempo decorrido para este parâmetro. O tempo de espera é aplicado com uma resolução de aproximadamente 100 ms, começando com um atraso de 100 ms; para cada tentativa subsequente, o comprimento deste período é duplicado até atingir `StartConnectBackoffMaxTime` milissegundos, até um máximo de 100000 ms (100s).

  Uma vez que o nó da API esteja conectado a um nó de dados e esse nó informe (em uma mensagem de batida de coração) que se conectou a outros nós de dados, as tentativas de conexão com esses nós de dados não serão mais afetadas por esse parâmetro e serão feitas a cada 100 ms em seguida, até que sejam conectadas. Uma vez que um nó de dados tenha iniciado, ele pode levar `HeartbeatIntervalDbApi` para que o nó da API seja notificado de que isso ocorreu.

**Parâmetros de depuração do nó da API.** Você pode usar o parâmetro de configuração `ApiVerbose` para habilitar a saída de depuração de um nó da API específico. Esse parâmetro aceita um valor inteiro. 0 é o padrão e desabilita a depuração; 1 habilita a saída de depuração no log do cluster; 2 adiciona a saída de depuração do `DBDICT`. (Bug #20638450) Veja também DUMP 1229.

Você também pode obter informações de um servidor MySQL que está rodando como um nó SQL do NDB Cluster usando `SHOW STATUS` no cliente **mysql**, conforme mostrado aqui:

```sql
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

Para obter informações sobre as variáveis de status que aparecem na saída desta declaração, consulte Seção 21.4.3.9.3, “Variáveis de Status do NDB Cluster”.

Nota

Para adicionar novos nós SQL ou API à configuração de um NDB Cluster em execução, é necessário realizar um reinício contínuo de todos os nós do cluster após adicionar novas seções `[mysqld]` ou `[api]` ao arquivo `config.ini` (ou arquivos, se você estiver usando mais de um servidor de gerenciamento). Isso deve ser feito antes que os novos nós SQL ou API possam se conectar ao cluster.

Não é *necessário* reiniciar o clúster se novos nós SQL ou API puderem utilizar slots de API anteriormente não utilizados na configuração do clúster para se conectarem ao clúster.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.16 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó da API NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir debackup, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>
