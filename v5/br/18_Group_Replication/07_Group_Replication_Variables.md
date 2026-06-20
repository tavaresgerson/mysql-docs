## 17.7 Variáveis de Replicação em Grupo

As duas seções seguintes contêm informações sobre os sistemas do servidor MySQL e as variáveis de status do servidor que são específicas ao plugin de Replicação de Grupo.

**Tabela 17.4 Resumo da variável e opção de replicação por grupo**

<table frame="box" rules="all" summary="Reference for MySQL Group Replication command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th>group_replication_allow_local_disjoint_gtids_join</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_allow_local_lower_version_join</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_auto_increment_increment</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_bootstrap_group</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_components_stop_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_compression_threshold</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_enforce_update_everywhere_checks</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_exit_state_action</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_flow_control_applier_threshold</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_flow_control_certifier_threshold</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_flow_control_mode</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_force_members</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_group_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_group_seeds</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_gtid_assignment_block_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_ip_whitelist</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_local_address</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_member_weight</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_poll_spin_loops</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_primary_member</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>group_replication_recovery_complete_at</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_reconnect_interval</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_retry_count</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_ca</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_capath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_cert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_cipher</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_crl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_crlpath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_key</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_ssl_verify_server_cert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_recovery_use_ssl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_single_primary_mode</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_ssl_mode</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_start_on_boot</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_transaction_size_limit</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>group_replication_unreachable_majority_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>

### 17.7.1 Variáveis do Sistema de Replicação em Grupo

Esta seção lista as variáveis do sistema que são específicas ao plugin de replicação de grupo.

O nome de cada variável do sistema de replicação de grupo é precedido por `group_replication_`.

A maioria das variáveis do sistema para a Replicação em Grupo é descrita como dinâmica, e seus valores podem ser alterados enquanto o servidor estiver em execução. No entanto, na maioria dos casos, a alteração só se torna efetiva após você parar e reiniciar a Replicação em Grupo no membro do grupo usando uma declaração `STOP GROUP_REPLICATION` seguida por uma declaração `START GROUP_REPLICATION`. As alterações nas seguintes variáveis do sistema se tornam efetivas sem parar e reiniciar a Replicação em Grupo:

* `group_replication_exit_state_action`
* `group_replication_flow_control_applier_threshold`
* `group_replication_flow_control_certifier_threshold`
* `group_replication_flow_control_hold_percent`
* `group_replication_flow_control_max_quota`
* `group_replication_flow_control_member_quota_percent`
* `group_replication_flow_control_min_quota`
* `group_replication_flow_control_min_recovery_quota`
* `group_replication_flow_control_mode`
* `group_replication_force_members`
* `group_replication_member_weight`
* `group_replication_transaction_size_limit`
* `group_replication_unreachable_majority_timeout`

A maioria das variáveis do sistema para a Replicação por Grupo pode ter valores diferentes em diferentes membros do grupo. Para as seguintes variáveis do sistema, é aconselhável definir o mesmo valor em todos os membros de um grupo para evitar o descarte desnecessário de transações, falha na entrega de mensagens ou falha na recuperação de mensagens:

* `group_replication_auto_increment_increment`
* `group_replication_compression_threshold`
* `group_replication_transaction_size_limit`

Algumas variáveis do sistema em um membro do grupo de replicação em grupo, incluindo algumas variáveis do sistema específicas para a replicação em grupo e algumas variáveis do sistema gerais, são configurações de nível de grupo. Essas variáveis do sistema devem ter o mesmo valor em todos os membros do grupo, não podem ser alteradas enquanto a replicação em grupo está em execução e requerem um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Essas condições se aplicam às seguintes variáveis do sistema:

* `group_replication_single_primary_mode`
* `group_replication_enforce_update_everywhere_checks`
* `group_replication_gtid_assignment_block_size`
* `default_table_encryption`
* `lower_case_table_names`
* `transaction_write_set_extraction`

Importante

* Várias variáveis do sistema para a Replicação por Grupo não são completamente validadas durante o início do servidor se elas forem passadas como argumentos na string de comando para o servidor. Essas variáveis do sistema incluem `group_replication_group_name`, `group_replication_single_primary_mode`, `group_replication_force_members`, as variáveis SSL e as variáveis do sistema de controle de fluxo. Elas só são totalmente validadas após o servidor ter sido iniciado.

* As variáveis do sistema para a Replicação por Grupo que especificam endereços IP ou nomes de host para os membros do grupo não são validadas até que uma declaração `START GROUP_REPLICATION` seja emitida. O Sistema de Comunicação do Grupo (GCS) da Replicação por Grupo não está disponível para validar os valores até esse ponto.

As variáveis do sistema que são específicas do plugin de replicação de grupo são as seguintes:

* `group_replication_allow_local_disjoint_gtids_join`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_disjoint_gtids_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-disjoint-gtids-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>Deprecated</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_disjoint_gtids_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Descontinuado na versão 5.7.21 e programado para ser removido em uma versão futura. Permite que o servidor se junte ao grupo, mesmo que tenha transações locais que não estão presentes no grupo.

Aviso

Tome cuidado ao habilitar essa opção, pois o uso incorreto pode levar a conflitos no grupo e ao cancelamento de transações. A opção deve ser habilitada apenas como um método de último recurso para permitir que um servidor que tenha transações locais se junte a um grupo existente, e apenas se as transações locais não afetarem os dados que são manipulados pelo grupo (por exemplo, uma ação administrativa que foi escrita no log binário). A opção não deve ser deixada habilitada em todos os membros do grupo.

* `group_replication_allow_local_lower_version_join`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Permite que o servidor atual se junte ao grupo, mesmo que tenha uma versão principal mais baixa do que o grupo. Com a configuração padrão `OFF`, os servidores não são permitidos a se juntar a um grupo de replicação se tiverem uma versão principal mais baixa do que os membros do grupo existentes. Por exemplo, um servidor MySQL 5.7 não pode se juntar a um grupo que consiste em servidores MySQL 8.0. Esta política padrão garante que todos os membros de um grupo possam trocar mensagens e aplicar transações. Defina `group_replication_allow_local_lower_version_join` para `ON` apenas nos seguintes cenários:

+ Um servidor deve ser adicionado ao grupo em caso de emergência para melhorar a tolerância à falha do grupo, e apenas versões mais antigas estão disponíveis.

+ Você deseja realizar uma redução do número de membros do grupo de replicação sem desligar o grupo inteiro e iniciá-lo novamente.

Aviso

Definir esta opção para `ON` não torna o novo membro compatível com o grupo e permite que ele se junte ao grupo sem quaisquer salvaguardas contra comportamentos incompatíveis dos membros existentes. Para garantir o funcionamento correto do novo membro, tome *ambas* das seguintes precauções:

1. Antes do servidor com a versão principal mais baixa se juntar ao grupo, pare todas as gravações nesse servidor.

2. A partir do ponto em que o servidor com a versão principal mais baixa se junta ao grupo, pare todas as escritas nos outros servidores do grupo.

Sem essas precauções, o servidor com a versão principal mais baixa provavelmente enfrentará dificuldades e terminará com um erro.

* `group_replication_auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

Determina o intervalo entre os valores sucessivos dos valores das colunas para as transações que executam nesta instância do servidor. Esta variável do sistema deve ter o mesmo valor em todos os membros do grupo. Quando a Replicação do Grupo é iniciada em um servidor, o valor da variável do sistema do servidor `auto_increment_increment` é alterado para este valor, e o valor da variável do sistema do servidor `auto_increment_offset` é alterado para o ID do servidor. Estes ajustes evitam a seleção de valores de autoincremento duplicados para escritas nos membros do grupo, o que causa o rollback das transações. As alterações são revertidas quando a Replicação do Grupo é interrompida. Estas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` cada um tiver seu valor padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação do Grupo não os altera.

O valor padrão de 7 representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros). Se o seu grupo tiver mais ou menos membros, você pode definir essa variável do sistema para corresponder ao número esperado de membros do grupo antes de o Replicação de Grupo ser iniciado. Você não pode alterar a configuração enquanto o Replicação de Grupo estiver em execução.

Importante

A definição de `group_replication_auto_increment_increment` não tem efeito quando `group_replication_single_primary_mode` é `ON`.

* `group_replication_bootstrap_group`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Configure este servidor para inicializar o grupo. Esta opção deve ser definida apenas em um servidor e apenas ao iniciar o grupo pela primeira vez ou reiniciá-lo completamente. Após o grupo ter sido inicializado, defina esta opção para `OFF`. Deve ser definida para `OFF` tanto dinamicamente quanto nos arquivos de configuração. Iniciar dois servidores ou reiniciar um servidor com esta opção definida enquanto o grupo está em execução pode levar a uma situação de cérebro artificial, onde dois grupos independentes com o mesmo nome são inicializados.

* `group_replication_components_stop_timeout`

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

Tempo de espera, em segundos, que a Replicação em Grupo aguarda para cada um dos componentes ao ser desligado.

* `group_replication_compression_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_compression_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-compression-threshold=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_compression_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

O valor limite em bytes acima do qual a compressão é aplicada às mensagens enviadas entre os membros do grupo. Se esta variável do sistema for definida como zero, a compressão será desativada. O valor de `group_replication_compression_threshold` deve ser o mesmo em todos os membros do grupo.

A Replicação em Grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Note que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é compatível com o tamanho máximo de mensagem aceito pelo XCom. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`, porque as transações acima desse tamanho não podem ser comprometidas quando a compressão de mensagens está habilitada.

Para mais informações, consulte a Seção 17.9.7.2, “Compressão de Mensagens”.

* `group_replication_enforce_update_everywhere_checks`

  <table frame="box" rules="all" summary="Properties for group_replication_enforce_update_everywhere_checks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-enforce-update-everywhere-checks[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_enforce_update_everywhere_checks</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Ative ou desative verificações de consistência estritas para atualização multi-primária em todos os lugares. O padrão é que as verificações estejam desativadas. No modo de único primário, esta opção deve ser desativada em todos os membros do grupo. No modo multi-primário, quando esta opção estiver ativada, as declarações serão verificadas da seguinte forma para garantir que sejam compatíveis com o modo multi-primário:

+ Se uma transação for executada sob o nível de isolamento `SERIALIZABLE`, então seu commit falha ao se sincronizar com o grupo.

+ Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então a transação não consegue se comprometer ao se sincronizar com o grupo.

Essa variável do sistema é um ajuste de configuração para todo o grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e exige um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva.

* `group_replication_exit_state_action`

  <table frame="box" rules="all" summary="Properties for group_replication_exit_state_action"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-exit-state-action=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.24</td> </tr><tr><th>System Variable</th> <td><code>group_replication_exit_state_action</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>READ_ONLY</code></td> </tr><tr><th>Valid Values</th> <td><code>ABORT_SERVER</code><code>READ_ONLY</code></td> </tr></tbody></table>

Configura como a Replicação em Grupo se comporta quando uma instância do servidor deixa o grupo de forma não intencional, por exemplo, após encontrar um erro de aplicável, ou no caso de uma perda da maioria, ou quando outro membro do grupo o expulsa devido a um tempo de suspeita que expira. O período de tempo para um membro deixar o grupo no caso de uma perda da maioria é definido pela variável de sistema `group_replication_unreachable_majority_timeout`. Note que um membro do grupo expulso não sabe que foi expulso até se reconectar ao grupo, portanto, a ação especificada é realizada apenas se o membro conseguir se reconectar, ou se o membro levantar uma suspeita sobre si mesmo e se expulsar.

Quando `group_replication_exit_state_action` está definido como `ABORT_SERVER`, se o membro sai do grupo de forma não intencional, a instância desliga o MySQL.

Quando `group_replication_exit_state_action` está definido como `READ_ONLY`, se o membro sair do grupo sem intenção, a instância muda o MySQL para modo de leitura super-único (definindo a variável de sistema `super_read_only` como `ON`). Esta configuração é a padrão no MySQL 5.7.

Importante

Se uma falha ocorrer antes que o membro tenha se unido com sucesso ao grupo, a ação de saída especificada *não é realizada*. Este é o caso se houver uma falha durante a verificação da configuração local ou uma incompatibilidade entre a configuração do membro que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema `super_read_only` é deixada com seu valor original, e o servidor não desativa o MySQL. Para garantir que o servidor não aceite atualizações quando a Replicação de Grupo não foi iniciada, portanto, recomendamos que `super_read_only=ON` seja definido no arquivo de configuração do servidor na inicialização, que a Replicação de Grupo altera para `OFF` nos membros primários após ter sido iniciada com sucesso. Esta proteção é particularmente importante quando o servidor é configurado para iniciar a Replicação de Grupo no inicialização do servidor (`group_replication_start_on_boot=ON`), mas também é útil quando a Replicação de Grupo é iniciada manualmente usando um comando `START GROUP_REPLICATION`.

Se ocorrer um erro após o membro ter se unido com sucesso ao grupo, a ação de saída especificada *é realizada*. Este é o caso se houver um erro de aplicação, se o membro for expulso do grupo ou se o membro for definido para tempo de espera no caso de uma maioria inalcançável. Nestas situações, se `READ_ONLY` for a ação de saída, a variável de sistema `super_read_only` é definida como `ON`, ou se `ABORT_SERVER` for a ação de saída, o servidor desliga o MySQL.

**Tabela 17.5 Ações de saída em situações de falha na replicação por grupo**

  <table frame="all" summary="Summarizes how the selected exit action does or does not operate depending on the failure situation"><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><thead><tr> <th><p>Situação de falha</p></th> <th><p>O Grupo de Replicação começou com<code>START GROUP_REPLICATION</code> </p></th> <th><p>O Grupo de Replicação começou com<code>group_replication_start_on_boot =ON</code> </p></th> </tr></thead><tbody><tr> <th><p>O membro não passa na verificação de configuração local</p><p>PORTUGUÊS:</p><p>Desajuste entre a configuração do membro de adesão e do grupo</p></th> <td><p> <code>super_read_only</code>inalterado</p><p>MySQL continua funcionando</p><p>Conjunto<code>super_read_only=ON</code>ao inicializar para evitar atualizações</p></td> <td><p> <code>super_read_only</code>inalterado</p><p>MySQL continua funcionando</p><p>Conjunto<code>super_read_only=ON</code>ao inicializar para evitar atualizações (importante)</p></td> </tr><tr> <th><p>Erro de aplicação no membro</p><p>PORTUGUÊS:</p><p>Membro expulso do grupo</p><p>PORTUGUÊS:</p><p>Tempo limite para maioria inalcançável</p></th> <td><p> <code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p>MySQL é desligado</p></td> <td><p> <code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p>MySQL é desligado</p></td> </tr></tbody></table>

* `group_replication_flow_control_applier_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_flow_control_applier_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-flow-control-applier-threshold=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_flow_control_applier_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>25000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

Especifica o número de transações em espera na fila de aplicador que desencadeiam o controle de fluxo. Essa variável pode ser alterada sem a necessidade de reiniciar a Replicação por Grupo.

* `group_replication_flow_control_certifier_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Especifica o número de transações em espera na fila de certificação que desencadeiam o controle de fluxo. Essa variável pode ser alterada sem a necessidade de reiniciar a Replicação por Grupo.

* `group_replication_flow_control_hold_percent`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Define a porcentagem da quota do grupo que permanece não utilizada para permitir que um grupo sob controle de fluxo ative o backlog. Um valor de 0 implica que nenhuma parte da quota é reservada para recuperar o backlog de trabalho.

* `group_replication_flow_control_max_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Define a cota máxima de controle de fluxo do grupo, ou a cota máxima disponível para qualquer período enquanto o controle de fluxo estiver habilitado. Um valor de 0 implica que não há cota máxima definida. Não pode ser menor que `group_replication_flow_control_min_quota` e `group_replication_flow_control_min_recovery_quota`.

* `group_replication_flow_control_member_quota_percent`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Define a porcentagem da quota que um membro deve assumir disponível para si mesmo ao calcular as cotas. Um valor de 0 implica que a quota deve ser dividida igualmente entre os membros que foram escritores no último período.

* `group_replication_flow_control_min_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Controla a menor quota de controle de fluxo que pode ser atribuída a um membro, independentemente da quota mínima calculada executada no último período. Um valor de 0 implica que não há quota mínima. Não pode ser maior que `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_min_recovery_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Controla a cotas mais baixa que pode ser atribuída a um membro devido a outro membro em recuperação no grupo, independentemente da cota mínima calculada executada no último período. Um valor de 0 implica que não há cota mínima. Não pode ser maior que `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Especifica o modo utilizado para o controle de fluxo. Essa variável pode ser alterada sem a necessidade de reiniciar a Replicação de Grupo.

* `group_replication_force_members`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Uma lista de endereços de pares como uma lista separada por vírgula, como `host1:port1`, `host2:port2`. Esta opção é usada para forçar uma nova adesão ao grupo, na qual os membros excluídos não recebem uma nova visualização e são bloqueados. (Você precisa matar manualmente os servidores excluídos.) Quaisquer nomes de host inválidos na lista podem causar o fracasso desta ação, pois podem bloquear a adesão ao grupo. Para uma descrição do procedimento a seguir, consulte a Seção 17.5.3, “Divisão de Rede”.

Você deve especificar o endereço ou o nome do host e o número de porta conforme fornecido na opção `group_replication_local_address` para cada membro. Por exemplo:

  ```sql
  "198.51.100.44:33061,example.org:33061"
  ```

Depois de ter usado a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. `group_replication_force_members` deve estar vazio para emitir uma declaração `START GROUP_REPLICATION`.

* `group_replication_group_name`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

O nome do grupo ao qual essa instância do servidor pertence. Deve ser um UUID válido. Este UUID é usado internamente ao definir GTIDs para eventos de Replicação de Grupo no log binário.

Importante

É necessário usar um UUID único.

* `group_replication_group_seeds`

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Uma lista de membros do grupo para os quais um membro que se junta pode se conectar para obter detalhes de todos os membros atuais do grupo. O membro que se junta usa esses detalhes para selecionar e se conectar a um membro do grupo para obter os dados necessários para a sincronização com o grupo. A lista consiste nos endereços de rede do membro inicial especificados como uma lista separada por vírgula, como `host1:port1`, `host2:port2`.

Importante

Esses endereços não devem ser o nome de host e a porta do membro no SQL.

Observe que o valor que você especificar para essa variável não é validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

Normalmente, essa lista consiste em todos os membros do grupo, mas você pode escolher um subconjunto dos membros do grupo para serem as sementes. A lista deve conter pelo menos um endereço de membro válido. Cada endereço é validado ao iniciar a Replicação do Grupo. Se a lista não contiver nenhum nome de host válido, a emissão de `START GROUP_REPLICATION` falha.

* `group_replication_gtid_assignment_block_size`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>0

O número de GTIDs consecutivos reservados para cada membro. Cada membro consome seus blocos e reserva mais quando necessário.

Essa variável do sistema é um ajuste de configuração para todo o grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e exige um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva.

* `group_replication_ip_whitelist`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>1

Especifica a lista de endereços de hosts que são permitidos para se conectar ao grupo. O endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve estar na lista de endereços dos outros servidores do grupo de replicação. Observe que o valor que você especificar para esta variável não é validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

Por padrão, essa variável do sistema é definida como `AUTOMATIC`, o que permite conexões de sub-redes privadas ativas no host. O motor de comunicação de grupo (XCom) digitaliza automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas. Esses endereços e o endereço IP `localhost` para IPv4 são usados para criar a lista de permissão de replicação de grupo. Para uma lista dos intervalos a partir dos quais os endereços são automaticamente listados, consulte a Seção 17.6.1, “Endereço de IP de Replicação de Grupo”.

A lista automática de endereços privados não pode ser usada para conexões de servidores externos à rede privada. Para conexões de Replicação em Grupo entre instâncias de servidor que estão em máquinas diferentes, você deve fornecer endereços de IP público e especiá-los como uma lista explícita de permissão. Se você especificar qualquer entrada para a lista de permissão, os endereços privados não são adicionados automaticamente, então se você usar qualquer um desses, você deve especiá-los explicitamente. O endereço de IP `localhost` é adicionado automaticamente.

Como valor da opção `group_replication_ip_whitelist`, você pode especificar qualquer combinação dos seguintes:

+ Endereços IPv4 (por exemplo, `198.51.100.44`)

+ Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

+ Nomes de host, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

+ Nomes de host com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

Os endereços IPv6 e os nomes de host que resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

  ```sql
  192.0.2.22,198.51.100.0/24,example.org,www.example.com/24
  ```

É possível configurar diferentes listas de permissão em diferentes membros do grupo de acordo com os requisitos de segurança que você deseja, por exemplo, para manter diferentes sub-redes separadas. No entanto, isso pode causar problemas quando um grupo é reconfigurado. Se você não tiver um requisito de segurança específico para fazer o contrário, use a mesma lista de permissão em todos os membros de um grupo. Para mais detalhes, consulte a Seção 17.6.1, “Listagem de endereços IP de replicação de grupo”.

Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação na lista de permissão, e uma mensagem de aviso é escrita no log de erro. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.

* `group_replication_local_address`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>2

O endereço de rede que o membro fornece para conexões de outros membros, especificado como uma string formatada `host:port`. Este endereço deve ser acessível por todos os membros do grupo, pois é usado pelo motor de comunicação do grupo para Replicação de Grupo (XCom, uma variante Paxos) para comunicação TCP entre instâncias remotas de XCom. A comunicação com a instância local é feita por um canal de entrada usando memória compartilhada.

Aviso

Não use este endereço para comunicação com o membro.

Outros membros da replicação do grupo contatam este membro através deste `host:port` para toda a comunicação interna do grupo. Este não é o host e o porto do protocolo SQL do servidor MySQL.

O endereço ou nome de host que você especifica em `group_replication_local_address` é usado pelo Replicação em Grupo como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar a mesma porta para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, e você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que as portas sejam todas diferentes. O port recomendado para `group_replication_local_address` é 33061. Note que o valor que você especifica para esta variável não é validado até que a declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação em Grupo (GCS) esteja disponível.

* `group_replication_member_weight`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>3

Um peso percentual que pode ser atribuído aos membros para influenciar a chance do membro ser eleito como primário em caso de falha, por exemplo, quando o primário existente deixa um grupo de primário único. Atribua pesos numéricos aos membros para garantir que membros específicos sejam eleitos, por exemplo, durante a manutenção programada do primário ou para garantir que certos equipamentos sejam priorizados em caso de falha.

Para um grupo com membros configurados da seguinte forma:

+ `member-1`: grupo_replicação_membro_peso=30, servidor_uuid=aaaa

+ `member-2`: grupo_replicação_membro_peso=40, servidor_uuid=bbbb

+ `member-3`: grupo_replicação_membro_peso=40, servidor_uuid=cccc

+ `member-4`: grupo_replicação_membro_peso=40, servidor_uuid=dddd

Durante a eleição de um novo primário, os membros acima seriam classificados como `member-2`, `member-3`, `member-4` e `member-1`. Isso resulta em [[`member`]-2]] sendo escolhido como o novo primário no caso de falha. Para mais informações, consulte a Seção 17.5.1.1, “Modo de Primário Único”.

* `group_replication_poll_spin_loops`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>4

O número de vezes que o thread de comunicação do grupo aguarda que o mutex do motor de comunicação seja liberado antes de a thread aguardar mais mensagens de rede recebidas.

* `group_replication_recovery_complete_at`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>5

Políticas de recuperação ao lidar com transações armazenadas após a transferência de estado. Esta opção especifica se um membro é marcado como online após ter recebido todas as transações que ele havia perdido antes de se juntar ao grupo (`TRANSACTIONS_CERTIFIED`) ou após tê-las recebido e aplicado (`TRANSACTIONS_APPLIED`).

* `group_replication_recovery_retry_count`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>6

O número de vezes que o membro que está se juntando tenta se conectar aos doadores disponíveis antes de desistir.

* `group_replication_recovery_reconnect_interval`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>7

O tempo de sono, em segundos, entre as tentativas de reconexão quando não foi encontrado um doador no grupo.

* `group_replication_recovery_ssl_ca`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>8

O caminho para um arquivo que contém uma lista de autoridades de certificados SSL confiáveis.

* `group_replication_recovery_ssl_capath`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>9

O caminho para um diretório que contém certificados de autoridade de certificação SSL confiável.

* `group_replication_recovery_ssl_cert`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão segura.

* `group_replication_recovery_ssl_key`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

O nome do arquivo de chave SSL a ser usado para estabelecer uma conexão segura.

* `group_replication_recovery_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

A lista de cifra permitida para criptografia SSL.

* `group_replication_recovery_ssl_crl`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

O caminho para um diretório que contém arquivos contendo listas de revogação de certificados.

* `group_replication_recovery_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

O caminho para um diretório que contém arquivos contendo listas de revogação de certificados.

* `group_replication_recovery_ssl_verify_server_cert`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Faça com que o processo de recuperação verifique o valor do Nome Comum do servidor no certificado enviado pelo doador.

* `group_replication_recovery_use_ssl`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Se a conexão de recuperação da replicação em grupo deve usar SSL ou

* `group_replication_single_primary_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Nota

Essa variável do sistema é um ajuste de configuração para todo o grupo, e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

`group_replication_single_primary_mode` instrui o grupo a escolher um único servidor automaticamente para ser o responsável pela carga de trabalho de leitura/escrita. Esse servidor é o principal e os outros são secundários.

Essa variável de sistema é um ajuste de configuração para todo o grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para instruções sobre como bootstrap um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 17.5.4, “Reinício de um Grupo”.

Se o grupo tiver um valor definido para essa variável do sistema, e um membro que se junta tiver um valor diferente definido para a variável do sistema, o membro que se junta não poderá se juntar ao grupo até que o valor seja alterado para corresponder. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que se junta não suporte a variável do sistema, ele não poderá se juntar ao grupo.

Definir essa variável `ON` faz com que qualquer configuração para `group_replication_auto_increment_increment` seja ignorada.

* `group_replication_ssl_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Especifica o estado de segurança da conexão entre os membros da Replicação de grupo.

* `group_replication_start_on_boot`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Se o servidor deve iniciar a Replicação de Grupo ou não durante o início do servidor.

* `group_replication_transaction_size_limit`

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>0

Configura o tamanho máximo da transação em bytes que o grupo de replicação aceita. As transações maiores que esse tamanho são revertidas pelo membro receptor e não são transmitidas para o grupo. Grandes transações podem causar problemas para um grupo de replicação em termos de alocação de memória, o que pode fazer com que o sistema fique mais lento, ou em termos de consumo de largura de banda da rede, o que pode fazer com que um membro seja suspeito de ter falhado porque está ocupado processando a grande transação.

Quando essa variável de sistema é definida como 0, não há limite para o tamanho das transações que o grupo aceita. Nas versões até e incluindo o MySQL 5.7.37, o ajuste padrão para essa variável de sistema é 0. A partir do MySQL 5.7.38 e no MySQL 8.0, o ajuste padrão é de 150000000 bytes (aproximadamente 143 MB). Ajuste o valor dessa variável de sistema de acordo com o tamanho máximo da mensagem que o grupo deve tolerar, tendo em vista que o tempo necessário para processar uma transação é proporcional ao seu tamanho. O valor de `group_replication_transaction_size_limit` deve ser o mesmo em todos os membros do grupo. Para estratégias adicionais de mitigação para transações grandes, consulte a Seção 17.3.2, “Limitações da Replicação de Grupo”.

* `group_replication_unreachable_majority_timeout`

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>1

Configura o tempo que os membros que sofrem uma partição de rede e não conseguem se conectar à maioria esperam antes de deixar o grupo.

Em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) está agora em minoria porque não pode entrar em contato com mais de metade do grupo. Enquanto o grupo da maioria (S3, S4, S5) permanece em funcionamento, o grupo da minoria espera o tempo especificado para uma reconexão na rede. Quaisquer transações processadas pelo grupo da minoria são bloqueadas até que a Replicação do Grupo seja parada usando `STOP GROUP REPLICATION` nos membros da minoria. Note que `group_replication_unreachable_majority_timeout` não tem efeito se for definido nos servidores do grupo da minoria após a detecção da perda da maioria.

Por padrão, essa variável do sistema é definida como 0, o que significa que os membros que se encontram em minoria devido a uma partição de rede esperam para sempre sair do grupo. Se configurada para um número de segundos, os membros esperam por esse período de tempo após perderem contato com a maioria dos membros antes de sair do grupo. Quando o tempo especificado passa, todas as transações pendentes processadas pela minoria são revertidas e os servidores na partição da `ERROR` passam para o estado `group_replication_exit_state_action`. Esses servidores, em seguida, seguem a ação especificada pela variável do sistema `group_replication_exit_state_action`, que pode ser definir-se no modo de leitura apenas super ou desligar o MySQL.

Aviso

Quando você tem um grupo simétrico, com apenas dois membros, por exemplo (S0, S2), se houver uma partição de rede e não houver maioria, após o tempo de espera configurado, todos os membros entram no estado `ERROR`.

### 17.7.2 Variáveis de Status de Replicação em Grupo

O MySQL 5.7 suporta uma variável de status que fornece informações sobre a Replicação de Grupo. Essa variável é descrita aqui:

* `group_replication_primary_member`

Mostra o UUID do membro principal quando o grupo está operando no modo de único principal. Se o grupo estiver operando no modo de múltiplos principais, exibe uma string vazia. Veja a Seção 17.5.1.3, “Encontrando o Principal”.