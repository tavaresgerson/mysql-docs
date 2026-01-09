#### 25.4.3.5 Definindo um Servidor de Gerenciamento de NDB Cluster

A seção `[ndb_mgmd]` é usada para configurar o comportamento do servidor de gerenciamento. Se vários servidores de gerenciamento forem empregados, você pode especificar parâmetros comuns a todos eles em uma seção `[ndb_mgmd default]`. `[mgm]` e `[mgm default]` são aliases mais antigos para esses, suportados para compatibilidade reversa.

Todos os parâmetros na lista a seguir são opcionais e assumem seus valores padrão se omitidos.

Nota

Se nenhum dos parâmetros `ExecuteOnComputer` ou `HostName` estiver presente, o valor padrão `localhost` é assumido para ambos.

* `Id`

  <table frame="box" rules="all" summary="Informações do tipo e valor do parâmetro de configuração do nó de gerenciamento Id" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício Inicial do Sistema: </strong></span></p>Requer um desligamento completo do cluster, apagando e restaurando o sistema de arquivos do cluster a partir de um backup, e depois reiniciando o cluster. (NDB 9.5.0)</a></td></tr></tbody></table>

Cada nó no cluster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado por todas as mensagens internas do cluster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo do nó.

Nota

Os IDs dos nós de dados devem ser menores que 145. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para nós de gerenciamento (e nós de API) para valores maiores que 144.

O uso do parâmetro `Id` para identificar nós de gerenciamento é desaconselhável em favor de `NodeId`. Embora o `Id` continue a ser suportado para compatibilidade com versões anteriores, agora gera uma mensagem de aviso e está sujeito à remoção em uma versão futura do NDB Cluster.

* `NodeId`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de gerenciamento NNodeId" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício Inicial do Sistema: </strong></span></p>Requer o desligamento completo do cluster, apagando e restaurando o sistema de arquivos do cluster a partir de um backup, e depois reiniciando o cluster. (NDB 9.5.0)</a></td></tr></tbody></table>

Cada nó no cluster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado por todas as mensagens internas do cluster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo do nó.

Nota

Os IDs dos nós de dados devem ser menores que 145. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para nós de gerenciamento (e nós de API) para valores maiores que 144.

`NodeId` é o nome do parâmetro preferido para identificar nós de gerenciamento. Embora o parâmetro mais antigo `Id` continue a ser suportado para compatibilidade reversa, ele já está desatualizado e gera uma mensagem de aviso quando usado; também está sujeito à remoção em uma futura versão do NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de gerenciamento ExecuteOnComputer" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Desatualizado</th><td>Sim (em NDB 7.5)</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</td></tr></tbody></table>

  Isso se refere ao `Id` definido para um dos computadores definidos em uma seção `[computer]` do arquivo `config.ini`.

  Importante

  Este parâmetro está desatualizado e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

* `PortNumber`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de gerenciamento PortNumber" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>1186</td></tr><tr><th>Intervalo</th><td>0 - 64K</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do sistema: </strong></span></p>Requer um desligamento e reinício completos do cluster. (NDB 9.5.0)</td></tr></tbody></table>

Este é o número de porta no qual o servidor de gerenciamento escuta por solicitações de configuração e comandos de gerenciamento.

* O ID do nó para este nó pode ser fornecido apenas para conexões que o solicitam explicitamente. Um servidor de gerenciamento que solicita o ID de "qualquer" nó não pode usar este. Este parâmetro pode ser usado ao executar vários servidores de gerenciamento no mesmo host, e `HostName` não é suficiente para distinguir entre os processos.

* `HostName`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração de gerenciamento do nó `HostName`" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>nome ou endereço IP</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Especificar este parâmetro define o nome do host do computador no qual o nó de gerenciamento deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

* `LocationDomainId`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento do [ID de domínio de disponibilidade](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm)" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>inteiro</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>0</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>0 - 16</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span><strong>Reinício do sistema: </strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

  Atribui um nó de gerenciamento a um domínio específico de disponibilidade (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  + Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

  + A comunicação entre nós em diferentes domínios de disponibilidade é garantida usando o suporte de WAN dos transportadores do `NDB`, sem qualquer intervenção manual adicional.

  + O número do grupo do transportador pode ser baseado no domínio de disponibilidade usado, de modo que os nós SQL e outros nós de API também se comuniquem com os nós de dados locais no mesmo domínio de disponibilidade sempre que possível.

  + O árbitro pode ser selecionado de um domínio de disponibilidade em que não há nós de dados presentes, ou, se tal domínio de disponibilidade não for encontrado, de um terceiro domínio de disponibilidade.

  O `LocationDomainId` aceita um valor inteiro entre 0 e 16, inclusive, com 0 sendo o padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

* `LogDestination`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento LogDestination, tipo e informações de valor" width="35%"> <col style="width: 50%"/><col style="width: 50%"/> <tbody> <tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr> <tr> <th>Tipo ou unidades</th> <td>{CONSOLE|SYSLOG|FILE}</td> </tr> <tr> <th>Padrão</th> <td>FILE: filename=ndb_nodeid_cluster.log, maxsize=1000000, maxfiles=6</td> </tr> <tr> <th>Faixa</th> <td>...</td> </tr> <tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr> </tbody> </table>

Este parâmetro especifica para onde enviar as informações de registro do cluster. Existem três opções nesse sentido — `CONSOLE`, `SYSLOG` e `FILE` — com `FILE` sendo o padrão:

+ `CONSOLE` emite o log para `stdout`:

```
    CONSOLE
    ```

+ `SYSLOG` envia o log para uma facilidade `syslog`, com valores possíveis sendo um dos `auth`, `authpriv`, `cron`, `daemon`, `ftp`, `kern`, `lpr`, `mail`, `news`, `syslog`, `user`, `uucp`, `local0`, `local1`, `local2`, `local3`, `local4`, `local5`, `local6` ou `local7`.

Nota

Nem toda facilidade é necessariamente suportada por todos os sistemas operacionais.

```
    SYSLOG:facility=syslog
    ```

+ `FILE` envia a saída do log do cluster para um arquivo regular na mesma máquina. Os seguintes valores podem ser especificados:

- `filename`: O nome do arquivo de log.

O nome padrão do arquivo de log usado nesses casos é `ndb_nodeid_cluster.log`.

- `maxsize`: O tamanho máximo (em bytes) que o arquivo pode crescer antes de o registro ser transferido para um novo arquivo. Quando isso ocorre, o arquivo de registro antigo é renomeado, adicionando *`.N`* ao nome do arquivo, onde *`N`* é o próximo número ainda não utilizado com esse nome.

    - `maxfiles`: O número máximo de arquivos de registro.

    ```
    FILE:filename=cluster.log,maxsize=1000000,maxfiles=6
    ```

    O valor padrão para o parâmetro `FILE` é `FILE:filename=ndb_node_id_cluster.log,maxsize=1000000,maxfiles=6`, onde *`node_id`* é o ID do nó.

  É possível especificar múltiplos destinos de registro separados por vírgulas, como mostrado aqui:

  ```
  CONSOLE;SYSLOG:facility=local0;FILE:filename=/var/log/mgmd
  ```

* `ArbitrationRank`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento de gestão de ArbitrationRank, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>0-2</td> </tr><tr> <th>Padrão</th> <td>1</td> </tr><tr> <th>Intervalo</th> <td>0 - 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício de Nó: </strong></span>Requer um reinício rolling do cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para definir quais nós podem atuar como árbitros. Apenas nós de gerenciamento e nós SQL podem ser árbitros. `ArbitrationRank` pode assumir um dos seguintes valores:

  + `0`: O nó nunca é usado como árbitro.

  + `1`: O nó tem alta prioridade; ou seja, é preferido como árbitro em relação a nós de baixa prioridade.

  + `2`: Indica um nó de baixa prioridade que é usado como árbitro apenas se um nó com prioridade mais alta não estiver disponível para esse propósito.

Normalmente, o servidor de gerenciamento deve ser configurado como árbitro, definindo seu `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e para 0 (o padrão para nós SQL).

Você pode desabilitar a arbitragem completamente, definindo `ArbitrationRank` para 0 em todos os nós de gerenciamento e SQL, ou definindo o parâmetro `Arbitration` na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Definir `Arbitration` faz com que quaisquer configurações para `ArbitrationRank` sejam ignoradas.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento ArbitrationDelay, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>milissegundos</td></tr><tr><th>Padrão</th><td>0</td></tr><tr><th>Intervalo</th><td>0 - 4294967039 (0xFFFFFEFF)</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício do Nó: </strong></span>Requer um reinício rotativo do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Um valor inteiro que faz com que as respostas do servidor de gerenciamento para solicitações de arbitragem sejam atrasadas por esse número de milissegundos. Por padrão, esse valor é 0; normalmente, não é necessário alterá-lo.

* `DataDir`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento do DataDir: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>caminho</td> </tr><tr><th>Padrão</th> <td>.</td> </tr><tr><th>Intervalo</th> <td>...</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício do nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td> </tr></tbody></table>

Isso especifica o diretório onde os arquivos de saída do servidor de gerenciamento são colocados. Esses arquivos incluem arquivos de log do cluster, arquivos de saída de processos e o arquivo do ID de processo (PID) do daemon. (Para arquivos de log, esse local pode ser sobrescrito definindo o parâmetro `FILE` para `LogDestination`, conforme discutido anteriormente nesta seção.)

O valor padrão para este parâmetro é o diretório em que o **ndb_mgmd** está localizado.

* `PortNumberStats`

<table frame="box" rules="all" summary="Parâmetro de configuração do servidor de gerenciamento do NDB Cluster, tipo e informações de valor do parâmetro NodeId">
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
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 255</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reiniciar o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Este parâmetro especifica o número de porta usado para obter informações estatísticas de um servidor de gerenciamento do NDB Cluster. Não tem valor padrão.

* `Wan`

<table frame="box" rules="all" summary="Parâmetro de configuração do servidor de gerenciamento do NDB Cluster, tipo e informações de valor do parâmetro NodeId">
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
    <td>[...]</td>
  </tr>
  <tr>
    <th>Intervalo</th>
    <td>1 - 255</td>
  </tr>
  <tr>
    <th>Tipo de reinício</th>
    <td><p> <span><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e, em seguida, reiniciar o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Use a configuração de TCP WAN como padrão.

* `HeartbeatThreadPriority`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do nó de gerenciamento de NID">
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

  Defina a política de agendamento e a prioridade das threads de batida de coração para nós de gerenciamento e API.

  A sintaxe para definir este parâmetro é mostrada aqui:

  ```
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  Ao definir este parâmetro, você deve especificar uma política. Esta é uma das opções `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (roda-se em círculo). O valor da política é seguido opcionalmente pela prioridade (um inteiro).

* `ExtraSendBufferMemory`

<table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento de NID, tipo e informações de valor"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>1 - 255</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício inicial do sistema: </strong></span></p><p>Backup online do NDB Cluster</p>Requer o desligamento completo do clúster, apagamento e restauração do sistema de arquivos do clúster a partir de um backup, e depois reiniciar o clúster. (NDB 9.5.0)</p></td></tr></tbody></table>

Se este parâmetro for definido como `true`, um cliente, uma vez conectado a este nó de gerenciamento, deve ser autenticado usando TLS antes que a conexão possa ser usada para qualquer outra coisa.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento do NDB, tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um backup, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste nó para a memória do buffer de envio compartilhada entre todos os transportadores configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é de 256KB; 0 indica que o parâmetro não foi definido. Para informações mais detalhadas, consulte a Seção 25.4.3.14, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

* `HeartbeatIntervalMgmdMgmd`

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de gerenciamento do NDB, tipo e valor de versão" width="35%">
  <tr>
    <th style="width: 50%">Versão (ou superior)</th>
    <td>NDB 9.5.0</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo ou unidades</th>
    <td>unsigned</td>
  </tr>
  <tr>
    <th style="width: 50%">Padrão</th>
    <td>[...]</td>
  </tr>
  <tr>
    <th style="width: 50%">Intervalo</th>
    <td>1 - 255</td>
  </tr>
  <tr>
    <th style="width: 50%">Tipo de reinício</th>
    <td><p> <span><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um backup, e depois reiniciando o clúster. (NDB 9.5.0)</p></td>
  </tr>
</table>

Especifique o intervalo entre as mensagens de batida de coração usadas para determinar se outro nó de gerenciamento está em contato com este. O nó de gerenciamento aguarda após 3 desses intervalos para declarar a conexão como morta; assim, o ajuste padrão de 1500 milissegundos faz com que o nó de gerenciamento espere aproximadamente 1600 ms antes de expirar.

Nota

Após fazer alterações na configuração de um nó de gerenciamento, é necessário realizar um reinício em rolagem do clúster para que a nova configuração entre em vigor.

Para adicionar novos servidores de gerenciamento a um clúster NDB em execução, também é necessário realizar um reinício em rolagem de todos os nós do clúster após modificar quaisquer arquivos `config.ini` existentes. Para mais informações sobre problemas que surgem ao usar múltiplos nós de clúster NDB, consulte a Seção 25.2.7.10, “Limitações Relacionadas a Múltiplos Nodos do Clúster NDB”.

**Tipos de reinício.** As informações sobre os tipos de reinício usados pelas descrições de parâmetros nesta seção são mostradas na tabela seguinte:

**Tabela 25.8 Tipos de reinício do clúster NDB**

<table frame="box" rules="all" summary="Parâmetros de configuração do nó de gerenciamento de NID: tipo e informações de valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou superior)</th> <td>NDB 9.5.0</td> </tr><tr><th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr><th>Padrão</th> <td>[...]</td> </tr><tr><th>Intervalo</th> <td>1 - 255</td> </tr><tr><th>Tipo de reinício</th> <td><p> <span><strong>Reinício inicial do sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um backup, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>