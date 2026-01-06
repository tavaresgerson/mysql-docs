#### 21.4.3.5 Definindo um servidor de gerenciamento de cluster do NDB

A seção `[ndb_mgmd]` é usada para configurar o comportamento do servidor de gerenciamento. Se vários servidores de gerenciamento forem empregados, você pode especificar parâmetros comuns a todos eles em uma seção `[ndb_mgmd default]`. `[mgm]` e `[mgm default]` são aliases mais antigos para isso, suportados para compatibilidade reversa.

Todos os parâmetros na lista a seguir são opcionais e assumem seus valores padrão se omitidos.

Nota

Se nenhum dos parâmetros `ExecuteOnComputer` ou `HostName` estiver presente, o valor padrão `localhost` é assumido para ambos.

- `Id`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento de IDs" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Cada nó no clúster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado em todas as mensagens internas do clúster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo de nó.

  Nota

  Os IDs dos nós de dados devem ser menores que 49. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para nós de gerenciamento (e nós de API) a valores maiores que 48.

  O uso do parâmetro `Id` para identificar nós de gerenciamento é desaconselhado em favor de `NodeId`. Embora o `Id` continue a ser suportado para compatibilidade reversa, agora gera uma mensagem de aviso e está sujeito à remoção em uma versão futura do NDB Cluster.

- `NodeId`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Cada nó no clúster tem uma identidade única. Para um nó de gerenciamento, isso é representado por um valor inteiro no intervalo de 1 a 255, inclusive. Esse ID é usado em todas as mensagens internas do clúster para endereçar o nó, e, portanto, deve ser único para cada nó do NDB Cluster, independentemente do tipo do nó.

  Nota

  Os IDs dos nós de dados devem ser menores que 49. Se você planeja implantar um grande número de nós de dados, é uma boa ideia limitar os IDs dos nós para nós de gerenciamento (e nós de API) a valores maiores que 48.

  `NodeId` é o nome do parâmetro preferido a ser usado ao identificar nós de gerenciamento. Embora o antigo `Id` continue a ser suportado para compatibilidade reversa, ele já está desatualizado e gera uma mensagem de aviso quando usado; também está sujeito à remoção em uma futura versão do NDB Cluster.

- `ExecuteOnComputer`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento ExecuteOnComputer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Desatualizado</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Isso se refere ao conjunto `Id` para um dos computadores definidos em uma seção `[computer]` do arquivo `config.ini`.

  Importante

  Este parâmetro é desaconselhável a partir da NDB 7.5.0 e está sujeito à remoção em uma futura versão. Use o parâmetro `HostName` em vez disso.

- `PortNumber`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento do PortNumber" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>1186</td> </tr><tr> <th>Gama</th> <td>0 - 64K</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este é o número de porta no qual o servidor de gerenciamento escuta por solicitações de configuração e comandos de gerenciamento.

- `HostName`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento de HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Especificar este parâmetro define o nome do host do computador em que o nó de gerenciamento deve residir. Use `HostName` para especificar um nome de host diferente de `localhost`.

- `LocationDomainId`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do nó de gerenciamento de LocationDomainId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo ou unidades</th> <td>inteiro</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 16</td> </tr><tr> <th>Adicionei</th> <td>NDB 7.6.4</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício do sistema:</strong></span>Requer o desligamento completo e o reinício do clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Atribui um nó de gerenciamento a um domínio de disponibilidade específico (também conhecido como zona de disponibilidade) dentro de uma nuvem. Ao informar o `NDB` quais nós estão em quais domínios de disponibilidade, o desempenho pode ser melhorado em um ambiente de nuvem das seguintes maneiras:

  - Se os dados solicitados não forem encontrados no mesmo nó, as leituras podem ser direcionadas para outro nó no mesmo domínio de disponibilidade.

  - A comunicação entre nós em diferentes domínios de disponibilidade é garantida para usar o suporte de WAN dos transportadores `NDB` sem qualquer intervenção manual adicional.

  - O número do grupo do transportador pode ser baseado no domínio de disponibilidade utilizado, de modo que, sempre que possível, os nós SQL e outros nós de API também se comuniquem com os nós de dados locais no mesmo domínio de disponibilidade.

  - O árbitro pode ser selecionado a partir de um domínio de disponibilidade no qual não há nós de dados, ou, se tal domínio de disponibilidade não puder ser encontrado, de um terceiro domínio de disponibilidade.

  `LocationDomainId` recebe um valor inteiro entre 0 e 16, inclusive, com 0 sendo o valor padrão; usar 0 é o mesmo que deixar o parâmetro sem definição.

- `LogDestination`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento LogDestination" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>{CONSOLE|SYSLOG|FILE}</td> </tr><tr> <th>Padrão</th> <td>ARQUIVO: nome_do_arquivo=ndb_nodeid_cluster.log, maxsize=1.000.000, maxfiles=6</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro especifica para onde enviar as informações de registro do cluster. Existem três opções nesse sentido: `CONSOLE`, `SYSLOG` e `FILE`, sendo `FILE` a opção padrão:

  - `CONSOLE` exibe o log no `stdout`:

    ```sql
    CONSOLE
    ```

  - `SYSLOG` envia o log para uma instalação `syslog`, com valores possíveis sendo um dos `auth`, `authpriv`, `cron`, `daemon`, `ftp`, `kern`, `lpr`, `mail`, `news`, `syslog`, `user`, `uucp`, `local0`, `local1`, `local2`, `local3`, `local4`, `local5`, `local6` ou `local7`.

    Nota

    Nem todas as instalações são necessariamente suportadas por todos os sistemas operacionais.

    ```sql
    SYSLOG:facility=syslog
    ```

  - O `FILE` envia a saída do log do cluster para um arquivo regular na mesma máquina. Os seguintes valores podem ser especificados:

    - `filename`: O nome do arquivo de registro.

      O nome padrão do arquivo de registro usado nesses casos é `ndb_nodeid_cluster.log`.

    - `maxsize`: O tamanho máximo (em bytes) que o arquivo pode crescer antes de o registro ser transferido para um novo arquivo. Quando isso ocorre, o arquivo de registro antigo é renomeado, adicionando *`.N`* ao nome do arquivo, onde *`N`* é o próximo número ainda não utilizado com esse nome.

    - `maxfiles`: O número máximo de arquivos de log.

    ```sql
    FILE:filename=cluster.log,maxsize=1000000,maxfiles=6
    ```

    O valor padrão para o parâmetro `FILE` é `FILE:filename=ndb_node_id_cluster.log,maxsize=1000000,maxfiles=6`, onde *`node_id`* é o ID do nó.

  É possível especificar múltiplos destinos de log separados por ponto e vírgula, conforme mostrado aqui:

  ```sql
  CONSOLE;SYSLOG:facility=local0;FILE:filename=/var/log/mgmd
  ```

- `ArbitrationRank`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento do ArbitrationRank" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>0-2</td> </tr><tr> <th>Padrão</th> <td>1</td> </tr><tr> <th>Gama</th> <td>0 a 2</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este parâmetro é usado para definir quais nós podem atuar como árbitros. Apenas nós de gerenciamento e nós SQL podem ser árbitros. `ArbitrationRank` pode assumir um dos seguintes valores:

  - `0`: O nó nunca é usado como árbitro.

  - `1`: O nó tem alta prioridade; ou seja, é preferido como árbitro em relação a nós de baixa prioridade.

  - `2`: Indica um nó de baixa prioridade que é usado como árbitro apenas se um nó com uma prioridade maior não estiver disponível para esse propósito.

  Normalmente, o servidor de gerenciamento deve ser configurado como árbitro, definindo seu `ArbitrationRank` para 1 (o padrão para nós de gerenciamento) e para todos os nós SQL para 0 (o padrão para nós SQL).

  Você pode desativar a arbitragem completamente, configurando `ArbitrationRank` para 0 em todos os nós de gerenciamento e SQL, ou configurando o parâmetro `[Arbitration]` na seção `[ndbd default]` do arquivo de configuração global `config.ini`. Configurar `[Arbitration]` faz com que quaisquer configurações para `ArbitrationRank` sejam ignoradas.

- `Atraso na arbitragem`

  <table frame="box" rules="all" summary="Parâmetro de configuração do nó de gerenciamento de atraso do tipo e informações de valor" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>milissegundos</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Um valor inteiro que faz com que as respostas do servidor de gerenciamento para solicitações de arbitragem sejam atrasadas por esse número de milissegundos. Por padrão, esse valor é 0; normalmente, não é necessário alterá-lo.

- `DataDir`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento do DataDir" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>caminho</td> </tr><tr> <th>Padrão</th> <td>.</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Isso especifica o diretório onde os arquivos de saída do servidor de gerenciamento são colocados. Esses arquivos incluem arquivos de log do clúster, arquivos de saída de processos e o arquivo do ID do processo (PID) do daemon. (Para arquivos de log, essa localização pode ser substituída definindo o parâmetro `FILE` para `LogDestination` como discutido anteriormente nesta seção.)

  O valor padrão para este parâmetro é o diretório em que o **ndb\_mgmd** está localizado.

- `PortNumberStats`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>0

  Este parâmetro especifica o número de porta usado para obter informações estatísticas de um servidor de gerenciamento do NDB Cluster. Não possui um valor padrão.

- `Wan`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>1

  Use a configuração WAN TCP como padrão.

- `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>2

  Defina a política de agendamento e a prioridade das threads de batimento cardíaco para nós de gerenciamento e API.

  A sintaxe para definir este parâmetro é mostrada aqui:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  Ao definir este parâmetro, você deve especificar uma política. Isso é um dos `FIFO` (primeiro a entrar, primeiro a sair) ou `RR` (round robin). O valor da política é seguido opcionalmente pela prioridade (um inteiro).

- `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>3

  Este parâmetro especifica a quantidade de memória de buffer de envio do transportador a ser alocada, além da que foi definida usando `TotalSendBufferMemory`, `SendBufferMemory` ou ambas.

- `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>4

  Este parâmetro é usado para determinar a quantidade total de memória a ser alocada neste nó para a memória do buffer de envio compartilhado entre todos os transportadores configurados.

  Se este parâmetro for definido, seu valor mínimo permitido é de 256 KB; 0 indica que o parâmetro não foi definido. Para obter informações mais detalhadas, consulte Seção 21.4.3.13, “Configurando Parâmetros de Buffer de Envio do NDB Cluster”.

- `IntervaloEntreBatimentosCardíacosMgmdMgmd`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>5

  Especifique o intervalo entre as mensagens de batimento cardíaco usadas para determinar se outro nó de gerenciamento está em contato com este. O nó de gerenciamento aguarda após 3 desses intervalos para declarar a conexão como morta; assim, o ajuste padrão de 1500 milissegundos faz com que o nó de gerenciamento espere aproximadamente 1600 ms antes de expirar o tempo.

Nota

Após fazer alterações na configuração de um nó de gerenciamento, é necessário realizar um reinício contínuo do clúster para que a nova configuração entre em vigor.

Para adicionar novos servidores de gerenciamento a um NDB Cluster em execução, também é necessário realizar um reinício contínuo de todos os nós do cluster após modificar quaisquer arquivos `config.ini` existentes. Para obter mais informações sobre problemas que surgem ao usar múltiplos nós de gerenciamento, consulte Seção 21.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.8 Tipos de reinício de cluster do NDB**

<table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do nó de gerenciamento NodeId" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>1 - 255</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>6
