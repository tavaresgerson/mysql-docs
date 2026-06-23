## 14.18 Funções de Replicação

As funções descritas nas seções a seguir são usadas com a replicação do MySQL.

**Tabela 14.24 Funções de Replicação**

<table frame="box" rules="all" summary="A reference that lists functions used with MySQL Replication."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>asynchronous_connection_failover_add_managed()</code></th> <td>Adicione informações de configuração do servidor de origem do membro do grupo a uma lista de origem do canal de replicação</td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_add_source()</code></th> <td>Adicione informações de configuração do servidor de origem ao servidor na lista de fontes de um canal de replicação</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_managed()</code></th> <td>Remover um grupo gerenciado de uma lista de fontes de canal de replicação</td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_source()</code></th> <td>Remover um servidor fonte de uma lista de fontes de canal de replicação</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_reset()</code></th> <td>Remova todos os ajustes relacionados ao failover asíncrono de replicação de grupo</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row"><code>group_replication_disable_member_action()</code></th> <td>Desabilitar ação do membro para o evento especificado</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_enable_member_action()</code></th> <td>Habilitar ação do membro para o evento especificado</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_get_communication_protocol()</code></th> <td>Obtenha a versão do protocolo de comunicação de replicação de grupo atualmente em uso</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row"><code>group_replication_get_write_concurrency()</code></th> <td>Obtenha o número máximo de instâncias de consenso atualmente configuradas para o grupo</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_reset_member_actions()</code></th> <td>Redefinir todas as ações dos membros para as configurações padrão e o número da versão da configuração para 1</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_as_primary()</code></th> <td>Faça um membro do grupo específico o principal</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_communication_protocol()</code></th> <td>Defina a versão para o protocolo de comunicação de replicação de grupo a ser usada</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row"><code>group_replication_set_write_concurrency()</code></th> <td>Defina o número máximo de instâncias de consenso que podem ser executadas em paralelo</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_switch_to_multi_primary_mode()</code></th> <td>Altera o modo de um grupo que está em modo de única primária para modo de múltiplas primárias</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>group_replication_switch_to_single_primary_mode()</code></th> <td>Altera o modo de um grupo que está em modo multi-primário para modo único-primário</td> <td>8.0.13</td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBSET()</code></th> <td>Retorne verdadeiro se todos os GTIDs no subconjunto também estiverem no conjunto; caso contrário, falso.</td> <td></td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBTRACT()</code></th> <td>Retorne todos os GTIDs no conjunto que não estão no subconjunto.</td> <td></td> <td></td> </tr><tr><th scope="row"><code>MASTER_POS_WAIT()</code></th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row"><code>SOURCE_POS_WAIT()</code></th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row"><code>WAIT_FOR_EXECUTED_GTID_SET()</code></th> <td>Aguarde até que os GTIDs fornecidos tenham sido executados na replica.</td> <td></td> <td></td> </tr><tr><th scope="row"><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></th> <td> Use <code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> <td></td> <td>8.0.18</td> </tr></tbody></table>

### 14.18.1 Funções de Replicação em Grupo

As funções descritas nas seções a seguir são usadas com Replicação de grupo.

**Tabela 14.25 Funções de Replicação por Grupo**

<table frame="box" rules="all" summary="A reference that lists functions used with MySQL Group Replication."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>group_replication_disable_member_action()</code></th> <td>Desabilitar ação do membro para o evento especificado</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_enable_member_action()</code></th> <td>Habilitar ação do membro para o evento especificado</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_get_communication_protocol()</code></th> <td>Obtenha a versão do protocolo de comunicação de replicação de grupo atualmente em uso</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>group_replication_get_write_concurrency()</code></th> <td>Obtenha o número máximo de instâncias de consenso atualmente configuradas para o grupo</td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_reset_member_actions()</code></th> <td>Redefinir todas as ações dos membros para as configurações padrão e o número da versão da configuração para 1</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>group_replication_set_as_primary()</code></th> <td>Faça um membro do grupo específico o principal</td> <td>8.0.29</td> </tr><tr><th scope="row"><code>group_replication_set_communication_protocol()</code></th> <td>Defina a versão para o protocolo de comunicação de replicação de grupo a ser usada</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>group_replication_set_write_concurrency()</code></th> <td>Defina o número máximo de instâncias de consenso que podem ser executadas em paralelo</td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_switch_to_multi_primary_mode()</code></th> <td>Altera o modo de um grupo que está em modo de única primária para modo de múltiplas primárias</td> <td>8.0.13</td> </tr><tr><th scope="row"><code>group_replication_switch_to_single_primary_mode()</code></th> <td>Altera o modo de um grupo que está em modo multi-primário para modo único-primário</td> <td>8.0.13</td> </tr></tbody></table>

#### 14.18.1.1 Função que configura o principal de replicação de grupo

A função a seguir permite que um membro de um grupo de replicação de único primário assuma o papel de primário. O primário atual se torna um secundário de leitura somente, e o membro do grupo especificado se torna o primário de leitura e escrita. A função pode ser usada em qualquer membro de um grupo de replicação que esteja em modo de único primário. Esta função substitui o processo usual de eleição do primário; consulte a Seção 20.5.1.1, “Mudando o Primário”, para mais informações.

Se uma fonte padrão para o canal de replicação estiver em execução no membro primário existente, além dos canais de replicação de grupo, você deve parar esse canal de replicação antes de poder alterar o membro primário. Você pode identificar o primário atual usando a coluna `MEMBER_ROLE` na tabela do Schema de desempenho `replication_group_members`, ou a variável de status `group_replication_primary_member`.

Quaisquer transações não comprometidas que o grupo está esperando devem ser comprometidas, revertidas ou encerradas antes que a operação possa ser concluída. Antes do MySQL 8.0.29, a função espera que todas as transações ativas no primário existente terminem, incluindo as transações que são iniciadas após o uso da função. A partir do MySQL 8.0.29, você pode especificar um tempo limite para as transações que estão em execução quando você usa a função. Para que o tempo limite funcione, todos os membros do grupo devem estar no MySQL 8.0.29 ou superior.

Quando o tempo de espera expira, para quaisquer transações que ainda não atingiram sua fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram sua fase de commit são permitidas para serem concluídas. Ao definir um tempo de espera, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo de espera, desconexão e bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função está em operação, declarações únicas que não modifiquem dados, conforme listado em Permitidas Perguntas Sob as Regras de Consistência, são permitidas para prosseguir.

* `group_replication_set_as_primary()`

Nomeia um membro específico do grupo como o novo principal, substituindo qualquer processo eleitoral.

Sintaxe:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

Argumentos:

+ *`member_uuid`*: Uma string contendo o UUID do membro do grupo que você deseja tornar o novo principal.

+ *`timeout`*: Um número inteiro que especifica um tempo de espera em segundos para transações que estão em execução no primário existente quando você usa a função. Você pode definir um tempo de espera de 0 segundos (imediatamente) até 3600 segundos (60 minutos). Quando você define um tempo de espera, novas transações não podem começar no primário a partir desse ponto. Não há configuração padrão para o tempo de espera, então se você não a definir, não há limite superior para o tempo de espera, e novas transações podem começar durante esse tempo. Esta opção está disponível a partir do MySQL 8.0.29.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

Para mais informações, consulte a Seção 20.5.1.1, “Mudando o Primário”.

#### 14.18.1.2 Funções que configuram o modo de replicação de grupo

As funções a seguir permitem que você controle o modo em que um grupo de replicação está sendo executado, seja em modo único ou multi-primario.

* `group_replication_switch_to_multi_primary_mode()`

Altera um grupo que está em modo de única primária para modo de múltiplas primárias. Deve ser emitido em um membro de um grupo de replicação que está em modo de única primária.

Sintaxe:

  ```
  STRING group_replication_switch_to_multi_primary_mode()
  ```

Essa função não tem parâmetros.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_switch_to_multi_primary_mode()
  ```

Todos os membros que pertencem ao grupo se tornam primárias.

Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo de Grupo”

* `group_replication_switch_to_single_primary_mode()`

Altera um grupo que está em modo multi-primario para modo único-primario, sem a necessidade de parar a Replicação do Grupo. Deve ser emitido em um membro de um grupo de replicação que está em modo multi-primario. Quando você muda para o modo único-primario, os controles de consistência estritos também são desativados em todos os membros do grupo, conforme exigido no modo único-primario (`group_replication_enforce_update_everywhere_checks=OFF`).

Sintaxe:

  ```
  STRING group_replication_switch_to_single_primary_mode([str])
  ```

Argumentos:

+ *`str`*: Uma string contendo o UUID de um membro do grupo que deve se tornar o novo único primário. Outros membros do grupo se tornam secundários.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_switch_to_single_primary_mode(member_uuid);
  ```

Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo de Grupo”

#### 14.18.1.3 Funções para inspecionar e configurar as instâncias de consenso máximo de um grupo

As funções a seguir permitem que você inspecione e configure o número máximo de instâncias de consenso que um grupo pode executar em paralelo.

* `group_replication_get_write_concurrency()`

Verifique o número máximo de instâncias de consenso que um grupo pode executar em paralelo.

Sintaxe:

  ```
  INT group_replication_get_write_concurrency()
  ```

Essa função não tem parâmetros.

Valor de retorno:

O número máximo de instâncias de consenso atualmente definido para o grupo.

Exemplo:

  ```
  SELECT group_replication_get_write_concurrency()
  ```

Para mais informações, consulte a Seção 20.5.1.3, “Usando o Consenso de Escrita de Grupo de Replicação de Grupo”.

* `group_replication_set_write_concurrency()`

Configura o número máximo de instâncias de consenso que um grupo pode executar em paralelo. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função.

Sintaxe:

  ```
  STRING group_replication_set_write_concurrency(instances)
  ```

Argumentos:

+ *`members`*: Define o número máximo de instâncias de consenso que um grupo pode executar em paralelo. O valor padrão é 10, os valores válidos são números inteiros no intervalo de 10 a 200.

Valor de retorno:

Qualquer erro resultante como uma string.

Exemplo:

  ```
  SELECT group_replication_set_write_concurrency(instances);
  ```

Para mais informações, consulte a Seção 20.5.1.3, “Usando o Consenso de Escrita de Grupo de Replicação de Grupo”.

#### 14.18.1.4 Funções para inspecionar e definir a versão do protocolo de comunicação de replicação do grupo

As funções a seguir permitem que você inspecione e configure a versão do protocolo de comunicação de Replicação de Grupo que é usada por um grupo de replicação.

* As versões do MySQL 5.7.14 permitem a compressão de mensagens (consulte a Seção 20.7.4, “Compressão de Mensagens”).

* As versões do MySQL 8.0.16 também permitem fragmentação de mensagens (consulte a Seção 20.7.5, “Fragmentação de Mensagens”).

* As versões do MySQL 8.0.27 também permitem que o motor de comunicação de grupo opere com um único líder de consenso quando o grupo está no modo de único primário e `group_replication_paxos_single_leader` está definido como verdadeiro (consulte a Seção 20.7.3, “Líder de Consenso Único”).

* `group_replication_get_communication_protocol()`

Inspecione a versão do protocolo de comunicação de replicação de grupo que está atualmente em uso para um grupo.

Sintaxe:

  ```
  STRING group_replication_get_communication_protocol()
  ```

Essa função não tem parâmetros.

Valor de retorno:

A versão mais antiga do servidor MySQL que pode se juntar a este grupo e usar o protocolo de comunicação do grupo. Note que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, que pode diferir do número de versão que foi passado para `group_replication_set_communication_protocol()`, e da versão do servidor MySQL que está instalada no membro onde você usa a função.

Se o protocolo não puder ser inspecionado porque essa instância do servidor não pertence a um grupo de replicação, um erro é retornado como uma string.

Exemplo:

  ```
  SELECT group_replication_get_communication_protocol();
  +------------------------------------------------+
  | group_replication_get_communication_protocol() |
  +------------------------------------------------+
  | 8.0.44                                          |
  +------------------------------------------------+
  ```

Para mais informações, consulte a Seção 20.5.1.4, “Definindo a versão do protocolo de comunicação de um grupo”.

* `group_replication_set_communication_protocol()`

Desdém o protocolo de comunicação de replicação de grupo da versão de um grupo para que os membros em versões anteriores possam se juntar, ou atualize a versão de protocolo de comunicação de replicação de grupo após atualizar o MySQL Server em todos os membros. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função, e todos os membros do grupo existentes devem estar online quando você emitir a declaração, sem perda da maioria.

Nota

Para o clúster MySQL InnoDB, a versão do protocolo de comunicação é gerenciada automaticamente sempre que a topologia do clúster é alterada usando operações da AdminAPI. Você não precisa usar essas funções você mesmo para um clúster InnoDB.

Sintaxe:

  ```
  STRING group_replication_set_communication_protocol(version)
  ```

Argumentos:

+ *`version`*: Para uma desvantagem, especifique a versão do servidor MySQL do membro do grupo em questão que possui a versão do servidor instalada mais antiga. Neste caso, o comando faz com que o grupo volte a um protocolo de comunicação compatível com essa versão do servidor, se possível. A versão mínima do servidor que você pode especificar é MySQL 5.7.14. Para uma atualização, especifique a nova versão do servidor MySQL para a qual os membros do grupo existentes foram atualizados.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_set_communication_protocol("5.7.25");
  ```

Para mais informações, consulte a Seção 20.5.1.4, “Definindo a versão do protocolo de comunicação de um grupo”.

#### 14.18.1.5 Funções para definir e redefinir ações de membros da replicação de grupo

As seguintes funções podem ser usadas para habilitar e desabilitar ações que membros de um grupo podem realizar em situações específicas, e para redefinir a configuração para o ajuste padrão para todas as ações dos membros. Elas só podem ser usadas por administradores com o privilégio `GROUP_REPLICATION_ADMIN` ou o privilégio descontinuado `SUPER`.

Você configura as ações dos membros no primário do grupo usando as funções `group_replication_enable_member_action` e `group_replication_disable_member_action`. A configuração das ações dos membros, que consiste em todas as ações dos membros e se elas estão habilitadas ou desabilitadas, é então propagada para outros membros do grupo e membros que estão se juntando usando as mensagens de grupo da Replicação de Grupo. Isso significa que os membros do grupo agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

As funções também podem ser usadas em um servidor que não faz parte de um grupo, desde que o plugin de Replicação de Grupo esteja instalado. Nesse caso, a configuração das ações do membro não é propagada para nenhum outro servidor.

A função `group_replication_reset_member_actions` só pode ser usada em um servidor que não faça parte de um grupo. Ela redefre o número de versão da configuração das ações do membro e o redefre. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado.

As ações disponíveis para os membros são as seguintes:

`mysql_disable_super_read_only_if_primary` :   Esta ação do membro está disponível a partir do MySQL 8.0.26. É realizada após um membro ser eleito como o principal do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação do membro é habilitada por padrão. Você pode desabilitá-la usando a função `group_replication_disable_member_action()`, e reabilitá-la usando `group_replication_enable_member_action()`.

Quando essa ação do membro é habilitada e realizada, o modo super-somente-leitura é desativado no primário, de modo que o primário se torne de leitura e escrita e aceite atualizações de um servidor de fonte de replicação e de clientes. Esta é a situação normal.

Quando essa ação do membro é desativada e não realizada, o primário permanece no modo de leitura super-sólida após a eleição. Nesse estado, ele não aceita atualizações de quaisquer clientes, mesmo usuários que tenham o privilégio `CONNECTION_ADMIN` ou `SUPER`. Ele continua a aceitar atualizações realizadas por threads de replicação. Essa configuração significa que, quando o propósito de um grupo é fornecer um backup secundário para outro grupo para tolerância a desastres, você pode garantir que o grupo secundário permaneça sincronizado com o primeiro.

`mysql_start_failover_channels_if_primary` :   Essa ação do membro está disponível a partir do MySQL 8.0.27. Ela é realizada após um membro ser eleito como o principal do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação do membro é habilitada por padrão. Você pode desabilitá-la usando a função `group_replication_disable_member_action()`, e reabilitá-la usando a função `group_replication_enable_member_action()`.

Quando essa ação do membro é habilitada, o failover de conexão assíncrona para réplicas está ativo para um canal de replicação em um primário de Replicação por Grupo quando você define `SOURCE_CONNECTION_AUTO_FAILOVER=1` na declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para o canal. Quando o recurso está ativo e configurado corretamente, se o primário que está replicando sair do ar ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Esta é a situação normal. Para obter instruções de configuração do recurso, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Replicas”.

Quando essa ação do membro é desativada, o failover de conexão assíncrona não ocorre para as réplicas. Se o primário sair offline ou entrar em um estado de erro, a replicação para o canal é interrompida. Observe que, se houver mais de um canal com `SOURCE_CONNECTION_AUTO_FAILOVER=1`, a ação do membro cobre todos os canais, portanto, eles não podem ser habilitados e desabilitados individualmente por este método. Defina `SOURCE_CONNECTION_AUTO_FAILOVER=0` para desabilitar um canal individual.

Para obter mais informações sobre as ações dos membros e como visualizar a configuração das ações dos membros, consulte a Seção 20.5.1.5, “Configurando ações dos membros”.

* `group_replication_disable_member_action()`

Desative uma ação de membro para que o membro não a execute na situação especificada. Se o servidor onde você usa a função faz parte de um grupo, ele deve ser o primário atual em um grupo no modo de único primário e deve fazer parte da maioria. O ajuste alterado é propagado para outros membros do grupo e membros associados, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

Sintaxe:

  ```
  STRING group_replication_disable_member_action(name, event)
  ```

Argumentos:

+ *`name`*: O nome da ação do membro a ser desativado.

+ *`event`*: O evento que desencadeia a ação do membro.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_disable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

Para mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.

* `group_replication_enable_member_action()`

Ative uma ação do membro para que o membro tome a ação na situação especificada. Se o servidor onde você usa a função faz parte de um grupo, ele deve ser o primário atual em um grupo no modo de único primário e deve fazer parte da maioria. O ajuste alterado é propagado para outros membros do grupo e membros associados, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

Sintaxe:

  ```
  STRING group_replication_enable_member_action(name, event)
  ```

Argumentos:

+ *`name`*: O nome da ação do membro a ser habilitada.

+ *`event`*: O evento que desencadeia a ação do membro.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_enable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

Para mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.

* `group_replication_reset_member_actions()`

Redefinir a configuração das ações do membro para as configurações padrão e redefinir seu número de versão para 1.

A função `group_replication_reset_member_actions()` só pode ser usada em um servidor que atualmente não faz parte de um grupo. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado. Você pode usar essa função para remover a configuração de ações de membro que um servidor usava quando fazia parte de um grupo, se você pretende usá-lo como um servidor independente sem ações de membro ou com ações de membro diferentes.

Sintaxe:

  ```
  STRING group_replication_reset_member_actions()
  ```

Argumentos:

  None.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT group_replication_reset_member_actions();
  ```

Para mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.

### 14.18.2 Funções utilizadas com Identificadores de Transação Global (GTIDs)

As funções descritas nesta seção são usadas com replicação baseada em GTID. É importante ter em mente que todas essas funções aceitam representações de cadeia de conjuntos de GTID como argumentos. Como tal, os conjuntos de GTID devem ser sempre citados quando usados com eles. Consulte Conjuntos de GTID para obter mais informações.

A união de dois conjuntos de GTID é simplesmente suas representações como strings, unidas com uma vírgula interposta. Em outras palavras, você pode definir uma função muito simples para obter a união de dois conjuntos de GTID, semelhante àquela criada aqui:

```
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

Para mais informações sobre GTIDs e como essas funções GTID são usadas na prática, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

**Tabela 14.26 Funções GTID**

<table frame="box" rules="all" summary="A reference that lists functions used with global transaction identifiers (GTIDs)."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>GTID_SUBSET()</code></th> <td>Retorne verdadeiro se todos os GTIDs no subconjunto também estiverem no conjunto; caso contrário, falso.</td> <td></td> </tr><tr><th scope="row"><code>GTID_SUBTRACT()</code></th> <td>Retorne todos os GTIDs no conjunto que não estão no subconjunto.</td> <td></td> </tr><tr><th scope="row"><code>WAIT_FOR_EXECUTED_GTID_SET()</code></th> <td>Aguarde até que os GTIDs fornecidos tenham sido executados na replica.</td> <td></td> </tr><tr><th scope="row"><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></th> <td> Use <code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> <td>8.0.18</td> </tr></tbody></table>

* `GTID_SUBSET(set1,set2)`

Dado dois conjuntos de identificadores de transação global *`set1`* e *`set2`*, retorna verdadeiro se todos os GTIDs em *`set1`* também estiverem em *`set2`*. Retorna `NULL` se *`set1`* ou *`set2`* for `NULL`. Retorna falso de outra forma.

Os conjuntos de GTID utilizados com esta função são representados como strings, conforme mostrado nos exemplos a seguir:

  ```
  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 0
  1 row in set (0.00 sec)
  ```

* `GTID_SUBTRACT(set1,set2)`

Dado dois conjuntos de identificadores de transação global *`set1`* e *`set2`*, retorne apenas os GTIDs de *`set1`* que não estão em *`set2`*. Retorne `NULL` se *`set1`* ou *`set2`* é `NULL`.

Todos os conjuntos GTID usados com essa função são representados como strings e devem ser citados, conforme mostrado nesses exemplos:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:22-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:26-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:21-22:25-57
  1 row in set (0.01 sec)
  ```

Subtrair um conjunto de GTID de si mesmo produz um conjunto vazio, como mostrado aqui:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

* `WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`(gtid-functions.html#function_wait-for-executed-gtid-set)

Aguarde até que o servidor tenha aplicado todas as transações cujos identificadores de transação global estão contidos em *`gtid_set`*; ou seja, até que a condição GTID_SUBSET(*`gtid_subset`*, `@@GLOBAL.gtid_executed`) seja atendida. Consulte a Seção 19.1.3.1, “Formato e Armazenamento do GTID”, para uma definição dos conjuntos GTID.

Se um tempo de espera for especificado e *`timeout`* segundos se passarem antes que todas as transações no conjunto GTID tenham sido aplicadas, a função para de esperar. *`timeout`* é opcional e o tempo de espera padrão é 0 segundos, caso em que a função sempre espera até que todas as transações no conjunto GTID tenham sido aplicadas. *`timeout`* deve ser maior ou igual a 0; ao executar no modo SQL rigoroso, um valor negativo de *`timeout`* é imediatamente rejeitado com um erro (`ER_WRONG_ARGUMENTS`); caso contrário, a função retorna `NULL`, e emite uma advertência.

`WAIT_FOR_EXECUTED_GTID_SET()` monitora todos os GTIDs que são aplicados no servidor, incluindo as transações que chegam de todos os canais de replicação e clientes de usuários. Não leva em conta se os canais de replicação foram iniciados ou interrompidos.

Para mais informações, consulte a Seção 19.1.3, “Replicação com Identificadores de Transação Global”.

Os conjuntos de GTID usados com essa função são representados como strings e, portanto, devem ser citados como mostrado no exemplo a seguir:

  ```
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

Para uma descrição da sintaxe dos conjuntos GTID, consulte a Seção 19.1.3.1, “Formato e armazenamento do GTID”.

Para `WAIT_FOR_EXECUTED_GTID_SET()`, o valor de retorno é o estado da consulta, onde 0 representa sucesso e 1 representa o tempo de espera. Qualquer outra falha gera um erro.

`gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando essa função para esperar que os GTIDs sejam aplicados.

* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`(gtid-functions.html#function_wait-until-sql-thread-after-gtids)

`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` é desatualizado. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso, que funciona independentemente do canal de replicação ou do cliente do usuário através do qual as transações especificadas chegam ao servidor.

### 14.18.3 Funções de Failover do Canal de Replicação Assíncrona

As seguintes funções, que estão disponíveis a partir do MySQL 8.0.22 para replicação de fonte padrão e a partir do MySQL 8.0.23 para replicação de grupo, permitem que você adicione e remova servidores de fonte de replicação da lista de fonte para um canal de replicação. A partir do MySQL 8.0.27, você também pode limpar a lista de fonte para um servidor.

**Tabela 14.27 Funções do Canal de Failover**

<table frame="box" rules="all" summary="A reference that lists functions used for controlling asynchronous failover for a given channel or server."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>asynchronous_connection_failover_add_managed()</code></th> <td>Adicione informações de configuração do servidor de origem do membro do grupo a uma lista de origem do canal de replicação</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_add_source()</code></th> <td>Adicione informações de configuração do servidor de origem ao servidor na lista de fontes de um canal de replicação</td> <td>8.0.22</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_managed()</code></th> <td>Remover um grupo gerenciado de uma lista de fontes de canal de replicação</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_delete_source()</code></th> <td>Remover um servidor fonte de uma lista de fontes de canal de replicação</td> <td>8.0.22</td> </tr><tr><th scope="row"><code>asynchronous_connection_failover_reset()</code></th> <td>Remova todos os ajustes relacionados ao failover asíncrono de replicação de grupo</td> <td>8.0.27</td> </tr></tbody></table>

O mecanismo de falha de conexão assíncrona estabelece automaticamente uma conexão de replicação assíncrona (fonte para réplica) para uma nova fonte da lista apropriada após a conexão existente da réplica para sua fonte falhar. A partir do MySQL 8.0.23, a conexão também é alterada se a fonte atualmente conectada não tiver a maior prioridade ponderada no grupo. Para servidores de fonte de Replicação de Grupo que são definidos como parte de um grupo gerenciado, a conexão também é transferida para outro membro do grupo se a fonte atualmente conectada deixar o grupo ou deixar de estar na maioria. Para obter mais informações sobre o mecanismo, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão de fonte assíncrona”.

As listas de fontes são armazenadas nas tabelas `mysql.replication_asynchronous_connection_failover` e `mysql.replication_asynchronous_connection_failover_managed`, e podem ser visualizadas na tabela do Gerador de Desempenho `replication_asynchronous_connection_failover`.

Se o canal de replicação estiver em um primário de Replicação por Grupo em um grupo onde o failover entre réplicas está ativo, a lista de fontes é transmitida para todos os membros do grupo quando eles se juntam ou quando é atualizada por qualquer método. O failover entre réplicas é controlado pela ação do membro `mysql_start_failover_channels_if_primary`, que é habilitada por padrão, e pode ser desativada usando a função `group_replication_disable_member_action`.

* `asynchronous_connection_failover_add_managed()`

Adicione as informações de configuração para um servidor de fonte de replicação que faz parte de um grupo gerenciado (um membro do grupo de replicação de grupo) à lista de fontes para um canal de replicação. Você só precisa adicionar um membro do grupo. A replicação adiciona automaticamente o restante da participação atual do grupo e, em seguida, mantém a lista de fontes atualizada de acordo com a mudança de participação.

Sintaxe:

  ```
  asynchronous_connection_failover_add_managed(channel, managed_type, managed_name, host, port, network_namespace, primary_weight, secondary_weight)
  ```

Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem.

+ *`managed_type`*: O tipo de serviço gerenciado que o mecanismo de falha de conexão assíncrona deve fornecer para este servidor. O único valor atualmente aceito é `GroupReplication`.

+ *`managed_name`*: O identificador do grupo gerenciado do qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

+ *`host`*: O nome do host deste servidor de origem de replicação.

+ *`port`*: O número do porto para este servidor de origem de replicação.

+ *`network_namespace`*: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

+ *`primary_weight`*: A prioridade deste servidor de origem da replicação na lista de origem do canal de replicação quando ele está atuando como o principal para o grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior. Para o principal, 80 é um peso adequado. O mecanismo de falha de conexão assíncrona é ativado se a fonte atualmente conectada não for a de maior peso no grupo. Supondo que você configure o grupo gerenciado para dar um peso maior ao principal e um peso menor ao secundário, quando o principal muda, seu peso aumenta e a replicação muda sobre a conexão com ele.

+ *`secondary_weight`*: A prioridade deste servidor de origem de replicação na lista de origem do canal de replicação quando está atuando como secundário no grupo gerenciado. O peso varia de 1 a 100, sendo 100 o maior. Para um secundário, 60 é um peso adequado.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT asynchronous_connection_failover_add_managed('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60);
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', 'GroupReplication', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '127.0.0.1', 3310, '', 80, 60) |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully inserted.                                                                                        |
  +----------------------------------------------------------------------------------------------------------------------------------------------------+
  ```

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

* `asynchronous_connection_failover_add_source()`

Adicione informações de configuração para um servidor de fonte de replicação à lista de fontes de um canal de replicação.

Sintaxe:

  ```
  asynchronous_connection_failover_add_source(channel, host, port, network_namespace, weight)
  ```

Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação faz parte da lista de origem.

+ *`host`*: O nome do host deste servidor de origem de replicação.

+ *`port`*: O número do porto para este servidor de origem de replicação.

+ *`network_namespace`*: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

+ *`weight`*: A prioridade deste servidor de origem da replicação na lista de origem do canal de replicação. A prioridade varia de 1 a 100, sendo 100 a mais alta e 50 a mais baixa. Quando o mecanismo de failover de conexão assíncrona é ativado, a fonte com a configuração de prioridade mais alta entre as fontes alternativas listadas na lista de origem do canal é escolhida para a primeira tentativa de conexão. Se essa tentativa não funcionar, a réplica tenta com todas as fontes listadas em ordem decrescente de prioridade, depois começa novamente a partir da fonte de prioridade mais alta. Se várias fontes tiverem a mesma prioridade, a réplica as ordena aleatoriamente. A partir do MySQL 8.0.23, o mecanismo de failover de conexão assíncrona é ativado se a fonte atualmente conectada não for a mais ponderada no grupo.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80);
  +-------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_add_source('channel2', '127.0.0.1', 3310, '', 80)              |
  +-------------------------------------------------------------------------------------------------+
  | Source configuration details successfully inserted.                                             |
  +-------------------------------------------------------------------------------------------------+
  ```

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

* `asynchronous_connection_failover_delete_managed()`

Remova um grupo gerenciado inteiro da lista de origem para um canal de replicação. Ao usar essa função, todos os servidores de origem de replicação definidos no grupo gerenciado são removidos da lista de origem do canal.

Sintaxe:

  ```
  asynchronous_connection_failover_delete_managed(channel, managed_name)
  ```

Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de origem.

+ *`managed_name`*: O identificador do grupo gerenciado do qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável do sistema `group_replication_group_name`.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  +-----------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_managed('channel2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') |
  +-----------------------------------------------------------------------------------------------------+
  | Source managed configuration details successfully deleted.                                          |
  +-----------------------------------------------------------------------------------------------------+
  ```

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

* `asynchronous_connection_failover_delete_source()`

Remova as informações de configuração do servidor de origem da lista de fontes de replicação para um canal de replicação.

Sintaxe:

  ```
  asynchronous_connection_failover_delete_source(channel, host, port, network_namespace)
  ```

Argumentos:

+ *`channel`*: O canal de replicação para o qual este servidor de origem de replicação fazia parte da lista de origem.

+ *`host`*: O nome do host deste servidor de origem de replicação.

+ *`port`*: O número do porto para este servidor de origem de replicação.

+ *`network_namespace`*: O espaço de rede para este servidor de origem de replicação. Especifique uma string vazia, pois este parâmetro é reservado para uso futuro.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  SELECT asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '');
  +------------------------------------------------------------------------------------------------+
  | asynchronous_connection_failover_delete_source('channel2', '127.0.0.1', 3310, '')              |
  +------------------------------------------------------------------------------------------------+
  | Source configuration details successfully deleted.                                             |
  +------------------------------------------------------------------------------------------------+
  ```

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

* `asynchronous_connection_failover_reset()`

Remova todos os ajustes relacionados ao mecanismo de falha de conexão assíncrona. A função limpa as tabelas do Schema de desempenho `replication_asynchronous_connection_failover` e `replication_asynchronous_connection_failover_managed`.

`asynchronous_connection_failover_reset()` pode ser usado apenas em um servidor que atualmente não faz parte de um grupo e que não tem nenhum canal de replicação em execução. Você pode usar essa função para limpar um servidor que não está sendo mais usado em um grupo gerenciado.

Sintaxe:

  ```
  STRING asynchronous_connection_failover_reset()
  ```

Argumentos:

  None.

Valor de retorno:

Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

Exemplo:

  ```
  mysql> SELECT asynchronous_connection_failover_reset();
  +-------------------------------------------------------------------------+
  | asynchronous_connection_failover_reset()                                |
  +-------------------------------------------------------------------------+
  | The UDF asynchronous_connection_failover_reset() executed successfully. |
  +-------------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

### 14.18.4 Funções de sincronização baseadas em posição

As funções listadas nesta seção são usadas para controlar a sincronização baseada em posição de servidores de origem e réplica no MySQL Replication.

**Tabela 14.28 Funções de sincronização posicional**

<table frame="box" rules="all" summary="A reference that lists functions used with position-based synchronization of replication source and replica servers."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>MASTER_POS_WAIT()</code></th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row"><code>SOURCE_POS_WAIT()</code></th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td>8.0.26</td> <td></td> </tr></tbody></table>

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

Essa função é para controle da sincronização de fonte-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log binário da fonte. A partir do MySQL 8.0.26, `MASTER_POS_WAIT()` é desatualizado e o alias `SOURCE_POS_WAIT()` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `MASTER_POS_WAIT()`.

O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread de replicação SQL não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite for excedido. Se o thread de replicação SQL parar enquanto `MASTER_POS_WAIT()` está esperando, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

Se a posição do arquivo de registro binário tiver sido marcada como inválida, a função aguarda até que uma posição de arquivo válida seja conhecida. A posição do arquivo de registro binário pode ser marcada como inválida quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` é definida para o canal de replicação e o servidor é reiniciado ou a replicação é interrompida. A posição do arquivo se torna válida após uma transação ser aplicada com sucesso além da posição de arquivo especificada. Se o aplicador não atingir a posição indicada, a função aguarda até o tempo limite. Use uma declaração `SHOW REPLICA STATUS` para verificar se a posição do arquivo de registro binário foi marcada como inválida.

Em uma replica multithread, a função aguarda até o vencimento do limite definido pela variável de sistema `replica_checkpoint_group`, `slave_checkpoint_group`, `replica_checkpoint_period` ou `slave_checkpoint_period`, quando a operação de verificação é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

Se a compressão de transações de registro binário estiver em uso e o payload da transação na posição especificada estiver comprimido (como um `Transaction_payload_event`, por exemplo), a função aguarda até que toda a transação tenha sido lida e aplicada, e as posições tenham sido atualizadas.

Se um valor de *`timeout`* for especificado, o `MASTER_POS_WAIT()` para de esperar quando *`timeout`* segundos tenham decorrido. *`timeout`* deve ser maior ou igual a 0. (Quando o servidor está em modo SQL rigoroso, um valor negativo de *`timeout`* é imediatamente rejeitado com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna **`NULL`**, e emite uma advertência.)

O valor opcional *`channel`* permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

* `SOURCE_POS_WAIT(log_name,log_pos[,timeout][,channel])`

Essa função é para controle da sincronização de fonte-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log binário da fonte. A partir do MySQL 8.0.26, use `SOURCE_POS_WAIT()` no lugar de `MASTER_POS_WAIT()`, que é descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `MASTER_POS_WAIT()`.

O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread de replicação SQL não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite for excedido. Se o thread de replicação SQL parar enquanto o `SOURCE_POS_WAIT()` está esperando, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

Se a posição do arquivo de registro binário tiver sido marcada como inválida, a função aguarda até que uma posição de arquivo válida seja conhecida. A posição do arquivo de registro binário pode ser marcada como inválida quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` é definida para o canal de replicação e o servidor é reiniciado ou a replicação é interrompida. A posição do arquivo se torna válida após uma transação ser aplicada com sucesso além da posição de arquivo especificada. Se o aplicador não atingir a posição indicada, a função aguarda até o tempo limite. Use uma declaração `SHOW REPLICA STATUS` para verificar se a posição do arquivo de registro binário foi marcada como inválida.

Em uma replica multithread, a função aguarda até o vencimento do limite definido pela variável de sistema `replica_checkpoint_group` ou `replica_checkpoint_period`, quando a operação de verificação é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

Se a compressão de transações de registro binário estiver em uso e o payload da transação na posição especificada estiver comprimido (como um `Transaction_payload_event`), a função aguarda até que toda a transação tenha sido lida e aplicada, e as posições tenham sido atualizadas.

Se um valor de *`timeout`* for especificado, o `SOURCE_POS_WAIT()` para de esperar quando *`timeout`* segundos tenham decorrido. *`timeout`* deve ser maior ou igual a 0. (No modo SQL estrito, um valor negativo de *`timeout`* é imediatamente rejeitado com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna `NULL`, e emite uma advertência.)

O valor opcional *`channel`* permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.