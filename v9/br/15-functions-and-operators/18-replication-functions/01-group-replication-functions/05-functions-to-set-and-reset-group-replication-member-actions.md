#### 14.18.1.5 Funções para definir e redefinir ações de membros da replicação de grupo

As seguintes funções podem ser usadas para habilitar e desabilitar ações para membros de um grupo em situações específicas, e para redefinir a configuração para o ajuste padrão para todas as ações dos membros. Elas só podem ser usadas por administradores com o privilégio `GROUP_REPLICATION_ADMIN` ou o desatualizado privilégio `SUPER`.

Você configura as ações dos membros no primário do grupo usando as funções `group_replication_enable_member_action` e `group_replication_disable_member_action`. A configuração das ações dos membros, consistindo de todas as ações dos membros e se elas estão habilitadas ou desabilitadas, é então propagada para outros membros do grupo e membros que estão se juntando usando as mensagens de grupo da Replicação de Grupo. Isso significa que os membros do grupo agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

As funções também podem ser usadas em um servidor que não faz parte de um grupo, desde que o plugin de Replicação de Grupo esteja instalado. Nesse caso, a configuração das ações dos membros não é propagada para nenhum outro servidor.

A função `group_replication_reset_member_actions` só pode ser usada em um servidor que não faz parte de um grupo. Ela redefere a configuração das ações dos membros para as configurações padrão e redefere seu número de versão. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado.

As ações dos membros disponíveis são as seguintes:

`mysql_disable_super_read_only_if_primary` :   Esta ação de membro é executada após um membro ser eleito como o primário do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação de membro é habilitada por padrão. Você pode desabilitar usando a função `group_replication_disable_member_action()` e reativá-la usando `group_replication_enable_member_action()`.

    Quando essa ação de membro é habilitada e executada, o modo de leitura apenas super é desativado no primário, de modo que o primário se torne de leitura e escrita e aceite atualizações de um servidor de origem de replicação e de clientes. Esta é a situação normal.

    Quando essa ação de membro é desabilitada e não executada, o primário permanece no modo de leitura apenas super após a eleição. Neste estado, ele não aceita atualizações de nenhum cliente, mesmo usuários que têm o privilégio `CONNECTION_ADMIN` ou `SUPER`. Ele continua a aceitar atualizações realizadas por threads de replicação. Esta configuração significa que, quando o propósito de um grupo é fornecer um backup secundário para outro grupo para tolerância a desastres, você pode garantir que o grupo secundário permaneça sincronizado com o primeiro.

`mysql_start_failover_channels_if_primary` :   Esta ação de membro é executada após um membro ser eleito como o primário do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação de membro é habilitada por padrão. Você pode desabilitar usando a função `group_replication_disable_member_action()` e reativá-la usando a função `group_replication_enable_member_action()`.

Quando essa ação de membro é habilitada, o redirecionamento de conexão assíncrono para réplicas está ativo para um canal de replicação em um primário de Replicação por Grupo quando você define `SOURCE_CONNECTION_AUTO_FAILOVER=1` na declaração `CHANGE REPLICATION SOURCE TO` para o canal. Quando o recurso está ativo e configurado corretamente, se o primário que está replicando sair offline ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Essa é a situação normal. Para obter instruções sobre como configurar o recurso, consulte a Seção 19.4.9.2, “Redirecionamento de Conexão Assíncrono para Réplicas”.

Quando essa ação de membro é desabilitada, o redirecionamento de conexão assíncrono não ocorre para as réplicas. Se o primário sair offline ou entrar em um estado de erro, a replicação para o canal para. Note que, se houver mais de um canal com `SOURCE_CONNECTION_AUTO_FAILOVER=1`, a ação de membro cobre todos os canais, então eles não podem ser habilitados e desabilitados individualmente por esse método. Defina `SOURCE_CONNECTION_AUTO_FAILOVER=0` para desabilitar um canal individual.

Para obter mais informações sobre ações de membro e como visualizar a configuração das ações de membro, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.

* `group_replication_disable_member_action()`

  Desabilitar uma ação de membro para que o membro não a tome na situação especificada. Se o servidor onde você usa a função fazer parte de um grupo, ele deve ser o primário atual em um grupo no modo primário único, e deve fazer parte da maioria. O ajuste alterado é propagado para outros membros do grupo e membros que estão se juntando, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

  Sintaxe:

  ```
  STRING group_replication_disable_member_action(name, event)
  ```

  Argumentos:

+ *`name`*: O nome da ação de membro a ser desativada.

  + *`event`*: O evento que desencadeia a ação de membro.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT group_replication_disable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.

* `group_replication_enable_member_action()`

  Habilitar uma ação de membro para que o membro tome a ação especificada na situação especificada. Se o servidor onde você usa a função faz parte de um grupo, ele deve ser o primário atual em um grupo no modo single-primary, e deve fazer parte da maioria. A configuração alterada é propagada para outros membros do grupo e membros que estão se juntando, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

  Sintaxe:

  ```
  STRING group_replication_enable_member_action(name, event)
  ```

  Argumentos:

  + *`name`*: O nome da ação de membro a ser habilitada.

  + *`event`*: O evento que desencadeia a ação de membro.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT group_replication_enable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.

* `group_replication_reset_member_actions()`

  Reiniciar a configuração das ações de membro para as configurações padrão e reiniciar seu número de versão para 1.

A função `group_replication_reset_member_actions()` só pode ser usada em um servidor que atualmente não faz parte de um grupo. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado. Você pode usar essa função para remover a configuração das ações do membro que um servidor usava quando fazia parte de um grupo, se você pretende usá-lo como um servidor autônomo sem ações de membro ou com ações de membro diferentes.

Sintaxe:

```
  STRING group_replication_reset_member_actions()
  ```

Argumentos:

Nenhum.

Valor de retorno:

Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

Exemplo:

```
  SELECT group_replication_reset_member_actions();
  ```

Para obter mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.