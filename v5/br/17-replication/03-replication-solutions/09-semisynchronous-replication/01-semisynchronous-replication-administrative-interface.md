#### 16.3.9.1 Interface Administrativa da Replicação Semisynchronous

A interface administrativa para a replicação semisynchronous possui vários componentes:

* Dois Plugins implementam a capacidade semisynchronous. Há um Plugin para o lado da Source e um para o lado da Replica.

* Variáveis de sistema controlam o comportamento do Plugin. Alguns exemplos:

  + [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

    Controla se a replicação semisynchronous está habilitada na Source. Para habilitar ou desabilitar o Plugin, defina esta variável como 1 ou 0, respectivamente. O padrão é 0 (desabilitado).

  + [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

    Um valor em milissegundos que controla por quanto tempo a Source espera por um Commit para obter reconhecimento de uma Replica antes de atingir o Timeout e reverter para a replicação assíncrona. O valor padrão é 10000 (10 segundos).

  + [`rpl_semi_sync_slave_enabled`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled)

    Semelhante a [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled), mas controla o Plugin da Replica.

  Todas as variáveis de sistema `rpl_semi_sync_xxx` estão descritas na [Seção 16.1.6.2, “Replication Source Options and Variables”](replication-options-source.html "16.1.6.2 Replication Source Options and Variables") e na [Seção 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

* A partir do MySQL 5.7.33, você pode melhorar o desempenho da replicação semisynchronous habilitando as variáveis de sistema [`replication_sender_observe_commit_only`](replication-options-replica.html#sysvar_replication_sender_observe_commit_only), que limita Callbacks, e [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config), que adiciona Shared Locks e evita aquisições de Lock desnecessárias. Essas configurações ajudam à medida que o número de Replicas aumenta, pois a contenção por Locks pode diminuir o desempenho. Servidores Source de replicação semisynchronous também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, pois eles usam os mesmos mecanismos de Locking que as Replicas.

* Variáveis de Status possibilitam o monitoramento da replicação semisynchronous. Alguns exemplos:

  + [`Rpl_semi_sync_master_clients`](server-status-variables.html#statvar_Rpl_semi_sync_master_clients)

    O número de Replicas semisynchronous.

  + [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status)

    Indica se a replicação semisynchronous está atualmente operacional na Source. O valor é 1 se o Plugin foi habilitado e um reconhecimento de Commit não ocorreu. É 0 se o Plugin não estiver habilitado ou se a Source reverteu para a replicação assíncrona devido a um Timeout de reconhecimento de Commit.

  + [`Rpl_semi_sync_master_no_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_tx)

    O número de Commits que não foram reconhecidos com sucesso por uma Replica.

  + [`Rpl_semi_sync_master_yes_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_yes_tx)

    O número de Commits que foram reconhecidos com sucesso por uma Replica.

  + [`Rpl_semi_sync_slave_status`](server-status-variables.html#statvar_Rpl_semi_sync_slave_status)

    Indica se a replicação semisynchronous está atualmente operacional na Replica. É 1 se o Plugin foi habilitado e o I/O Thread de replicação estiver em execução, 0 caso contrário.

  Todas as variáveis de Status `Rpl_semi_sync_xxx` estão descritas na [Seção 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

As variáveis de sistema e de Status estão disponíveis somente se o Plugin de Source ou Replica apropriado tiver sido instalado com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement").