## Variáveis e Opções de Servidor e Status Adicionadas, Desatualizadas ou Removidas no MySQL 9.5

Esta seção lista as variáveis de servidor, variáveis de status e opções que foram adicionadas pela primeira vez, têm sido desatualizadas ou foram removidas no MySQL 9.5.

### Opções e Variáveis Introduzidas no MySQL 9.5

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no MySQL 9.5.

* `activate_mandatory_roles`: Ativa rolos obrigatórios e concedidos para todos os usuários. Adicionada no MySQL 9.5.0.

* `component_connection_control.exempt_unknown_users`: Se os hosts que geram conexões TCP falhas devem ser penalizados. Adicionada no MySQL 9.5.0.

* `component_option_tracker.mysql_shell_support`: Se o suporte do MySQL Shell está habilitado para o Rastreador de Opções. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell`: Número de vezes que uma sessão de usuário do MySQL Shell foi criada. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Copy`: Número de vezes que o utilitário de cópia do MySQL Shell foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Dump`: Número de vezes que o utilitário de dump do MySQL Shell foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Dump - Load`: Número de vezes que o utilitário de carregamento de dump do MySQL Shell foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - MRS`: Número de vezes que uma operação de banco de dados é realizada pelo Serviço REST do MySQL. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Upgrade Checker`: Número de vezes que o utilitário checkForServerUpgrade do MySQL Shell foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Dump`: Número de vezes que o utilitário de dump do MySQL Shell para VS Code foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Dump - Load`: Número de vezes que o utilitário de exibição de dump do MySQL Shell para o VS Code foi usado. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - HeatWave Chat`: Número de vezes que o prompt \chat foi executado no MySQL Shell para o VS Code. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Lakehouse Navigator`: Número de vezes que o processo de carregamento de dados foi iniciado no Lakehouse Navigator do MySQL HeatWave. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - MRS`: Número de vezes que uma operação de banco de dados é realizada pelo Serviço REST do MySQL. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Natural Language to SQL`: Número de vezes que o comando \nl foi executado no MySQL Shell para o VS Code. Adicionada no MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell for VS Code`: Número de vezes que uma sessão do usuário do MySQL Shell para o VS Code é criada. Adicionada no MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_logs_secret_headers`: Nome de um segredo que contém os dados sensíveis para cabeçalhos de logs. Adicionada no MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_metrics_secret_headers`: Nome de um segredo que contém os dados sensíveis para cabeçalhos de métricas. Adicionada no MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_traces_secret_headers`: Nome de um segredo que contém os dados sensíveis para cabeçalhos de traços. Adicionada no MySQL 9.5.0.

* `telemetry.resource_provider`: Nome do componente a ser invocado que fornece uma implementação do serviço de provedor de recursos. Adicionada no MySQL 9.5.0.

* `telemetry.run_level`: Estado de inicialização atual do componente Telemetry. Adicionada no MySQL 9.5.0.

* `telemetry.secret_provider`: Nome do componente a ser invocado que fornece uma implementação do serviço de provedor de segredos. Adicionada no MySQL 9.5.0.

### Opções e Variáveis Desatualizadas no MySQL 9.5

Nenhuma variável de sistema, variável de status ou opção do servidor foi desatualizada no MySQL 9.5.

### Opções e Variáveis Removidas no MySQL 9.5

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no MySQL 9.5.

* `Rpl_semi_sync_master_clients`: Número de réplicas semissíncronas. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte esperou por respostas da réplica. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_net_wait_time`: Tempo total que a fonte esperou por respostas da réplica. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou por respostas da réplica. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_no_times`: Número de vezes que a fonte desativou a replicação semissíncrona. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_no_tx`: Número de transações que não foram reconhecidas com sucesso. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_status`: Se a replicação semissíncrona está operacional na fonte. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte esperou por transações. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias menores que os eventos esperados anteriormente. Removida no MySQL 9.5.0.

* `Rpl_semi_sync_master_wait_sessions`: Número de sessões atualmente aguardando respostas da replica. Removido no MySQL 9.5.0.

* `Rpl_semi_sync_master_yes_tx`: Número de commits reconhecidos com sucesso. Removido no MySQL 9.5.0.

* `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional na replica. Removido no MySQL 9.5.0.

* `group_replication_allow_local_lower_version_join`: Permitir que o servidor atual se junte ao grupo mesmo que tenha uma versão de plugin menor que o grupo. Removido no MySQL 9.5.0.

* `replica_parallel_type`: Instrui a replica a usar informações de data e hora (CLOCK LÓGICO) ou particionamento de banco de dados (DATABASE) para paralelizar transações. Removido no MySQL 9.5.0.

* `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte. Removido no MySQL 9.5.0.

* `rpl_semi_sync_master_timeout`: Número de milissegundos para esperar a confirmação da replica. Removido no MySQL 9.5.0.

* `rpl_semi_sync_master_trace_level`: Nível de rastreamento de depuração da replicação semi-sincronizada na fonte. Removido no MySQL 9.5.0.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replica que a fonte deve receber por transação antes de prosseguir. Removido no MySQL 9.5.0.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para a confirmação do recebimento da transação da replica. Removido no MySQL 9.5.0.

* `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada na replica. Removido no MySQL 9.5.0.

* `rpl_semi_sync_slave_trace_level`: Nível de rastreamento de depuração da replicação semi-sincronizada na replica. Removido no MySQL 9.5.0.

* `slave_parallel_type`: Instrui a replica a usar informações de data e hora (CLOCK LÓGICO) ou particionamento de banco de dados (DATABASE) para paralelizar transações. Removido no MySQL 9.5.0.