#### 16.3.9.1 Interface Administrativa de Replicação Semisincronizada

A interface administrativa para replicação semiesincronizada tem vários componentes:

- Dois plugins implementam a capacidade semi-sincronizada. Há um plugin para o lado da fonte e outro para o lado da replica.

- As variáveis do sistema controlam o comportamento do plugin. Alguns exemplos:

  - [`rpl_semi_sync_master_enabled`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

    Controla se a replicação semisoincronizada está habilitada na fonte. Para habilitar ou desabilitar o plugin, defina essa variável para 1 ou 0, respectivamente. O padrão é 0 (desativado).

  - [`rpl_semi_sync_master_timeout`](https://replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

    Um valor em milissegundos que controla quanto tempo a fonte espera por um commit para receber um reconhecimento de uma réplica antes de expirar e reverter para replicação assíncrona. O valor padrão é 10000 (10 segundos).

  - [`rpl_semi_sync_slave_enabled`](https://replicando-opções-replica.html#sysvar_rpl_semi_sync_slave_enabled)

    Semelhante a `rpl_semi_sync_master_enabled`, mas controla o plugin de replicação.

  Todas as variáveis de sistema `rpl_semi_sync_xxx` estão descritas em Seção 16.1.6.2, “Opções e variáveis de fonte de replicação” e Seção 16.1.6.3, “Opções e variáveis de servidor de replicação”.

- A partir do MySQL 5.7.33, você pode melhorar o desempenho da replicação semi-sincronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueios desnecessárias. Essas configurações ajudam à medida que o número de réplicas aumenta, porque a disputa por bloqueios pode desacelerar o desempenho. Os servidores de origem da replicação semi-sincronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, pois usam os mesmos mecanismos de bloqueio que as réplicas.

- As variáveis de status permitem o monitoramento da replicação semiesincronizada. Alguns exemplos:

  - `Rpl_semi_sync_master_clients`

    O número de réplicas semissíncronas.

  - `Rpl_semi_sync_master_status`

    Se a replicação semi-sincronizada está atualmente operacional na fonte. O valor é 1 se o plugin tiver sido habilitado e um reconhecimento de commit não ocorrer. É 0 se o plugin não estiver habilitado ou se a fonte tiver retornado à replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  - `Rpl_semi_sync_master_no_tx`

    O número de commits que não foram reconhecidos com sucesso por uma réplica.

  - `Rpl_semi_sync_master_yes_tx`

    O número de commits que foram reconhecidos com sucesso por uma réplica.

  - `Rpl_semi_sync_slave_status`

    Se a replicação semi-sincronizada está atualmente em operação na replica. É 1 se o plugin tiver sido habilitado e a thread de I/O de replicação estiver em execução, caso contrário, é 0.

  Todas as variáveis de status `Rpl_semi_sync_xxx` estão descritas em Seção 5.1.9, “Variáveis de Status do Servidor”.

As variáveis de sistema e status estão disponíveis apenas se o plugin de fonte ou replicação apropriado tiver sido instalado com `INSTALL PLUGIN`.
