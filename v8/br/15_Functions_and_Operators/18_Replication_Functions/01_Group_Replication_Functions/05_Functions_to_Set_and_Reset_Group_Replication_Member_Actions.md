#### 14.18.1.5 Funções para definir e redefinir ações de membros da replicação em grupo

As seguintes funções podem ser usadas para habilitar e desabilitar ações que os membros de um grupo podem realizar em situações específicas, além de redefinir a configuração para o ajuste padrão para todas as ações dos membros. Elas só podem ser usadas por administradores com o privilégio `GROUP_REPLICATION_ADMIN` ou o privilégio desatualizado `SUPER`.

Você configura as ações dos membros no grupo primário usando as funções `group_replication_enable_member_action` e `group_replication_disable_member_action`. A configuração das ações dos membros, que consiste em todas as ações dos membros e se elas estão habilitadas ou desabilitadas, é então propagada para outros membros do grupo e membros que estão se juntando usando as mensagens de grupo da Replicação de Grupo. Isso significa que os membros do grupo agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

As funções também podem ser usadas em um servidor que não faz parte de um grupo, desde que o plugin de replicação de grupo esteja instalado. Nesse caso, a configuração das ações do membro não é propagada para nenhum outro servidor.

A função `group_replication_reset_member_actions` só pode ser usada em um servidor que não faça parte de um grupo. Ela redefini o modo de configuração das ações do membro para as configurações padrão e redefini o número de versão. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de replicação de grupo instalado.

As ações disponíveis para os membros são as seguintes:

`mysql_disable_super_read_only_if_primary` :   Esta ação do membro está disponível a partir do MySQL 8.0.26. Ela é executada após um membro ser eleito como o principal do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação do membro é habilitada por padrão. Você pode desabilitá-la usando a função `group_replication_disable_member_action()` e reabilitá-la usando `group_replication_enable_member_action()`.

```
When this member action is enabled and taken, super read-only mode is disabled on the primary, so that the primary becomes read-write and accepts updates from a replication source server and from clients. This is the normal situation.

When this member action is disabled and not taken, the primary remains in super read-only mode after election. In this state, it does not accept updates from any clients, even users who have the `CONNECTION_ADMIN` or `SUPER` privilege. It does continue to accept updates performed by replication threads. This setup means that when a group’s purpose is to provide a secondary backup to another group for disaster tolerance, you can ensure that the secondary group remains synchronized with the first.
```

`mysql_start_failover_channels_if_primary` :   Esta ação do membro está disponível a partir do MySQL 8.0.27. Ela é executada após um membro ser eleito como o principal do grupo, que é o evento `AFTER_PRIMARY_ELECTION`. A ação do membro é habilitada por padrão. Você pode desabilitá-la usando a função `group_replication_disable_member_action()` e reabilitá-la usando a função `group_replication_enable_member_action()`.

```
When this member action is enabled, asynchronous connection failover for replicas is active for a replication channel on a Group Replication primary when you set `SOURCE_CONNECTION_AUTO_FAILOVER=1` in the `CHANGE REPLICATION SOURCE TO` statement for the channel. When the feature is active and correctly configured, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. This is the normal situation. For instructions to configure the feature, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

When this member action is disabled, asynchronous connection failover does not take place for the replicas. If the primary goes offline or into an error state, replication stops for the channel. Note that if there is more than one channel with `SOURCE_CONNECTION_AUTO_FAILOVER=1`, the member action covers all the channels, so they cannot be individually enabled and disabled by this method. Set `SOURCE_CONNECTION_AUTO_FAILOVER=0` to disable an individual channel.
```

Para obter mais informações sobre as ações dos membros e como visualizar a configuração das ações dos membros, consulte a Seção 20.5.1.5, “Configurando Ações dos Membros”.

- `group_replication_disable_member_action()`

  Desative uma ação de membro para que o membro não a execute na situação especificada. Se o servidor onde você usa a função faz parte de um grupo, ele deve ser o primário atual em um grupo no modo único primário e deve fazer parte da maioria. A configuração alterada é propagada para outros membros do grupo e membros que se juntam, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisa usar a função no primário.

  Sintaxe:

  ```
  STRING group_replication_disable_member_action(name, event)
  ```

  Argumentos:

  - `name`: O nome da ação do membro para desabilitar.

  - `event`: O evento que desencadeia a ação do membro.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_disable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  Para obter mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.

- `group_replication_enable_member_action()`

  Ative uma ação do membro para que ele possa tomar a decisão na situação especificada. Se o servidor onde você usa a função faz parte de um grupo, ele deve ser o primário atual em um grupo no modo único primário e deve fazer parte da maioria. A configuração alterada é propagada para outros membros do grupo e membros que se juntam, então todos eles agirão da mesma maneira quando estiverem na situação especificada, e você só precisará usar a função no primário.

  Sintaxe:

  ```
  STRING group_replication_enable_member_action(name, event)
  ```

  Argumentos:

  - `name`: Nome da ação do membro para habilitar.

  - `event`: O evento que desencadeia a ação do membro.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_enable_member_action("mysql_disable_super_read_only_if_primary", "AFTER_PRIMARY_ELECTION");
  ```

  Para obter mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.

- `group_replication_reset_member_actions()`

  Reinicie a configuração das ações do membro para as configurações padrão e reinicie seu número de versão para 1.

  A função `group_replication_reset_member_actions()` só pode ser usada em um servidor que atualmente não faz parte de um grupo. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado. Você pode usar essa função para remover a configuração de ações de membros que um servidor usava quando fazia parte de um grupo, se você pretende usá-lo como um servidor autônomo sem ações de membros ou com ações de membros diferentes.

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

  Para obter mais informações, consulte a Seção 20.5.1.5, “Configurando ações de membros”.
