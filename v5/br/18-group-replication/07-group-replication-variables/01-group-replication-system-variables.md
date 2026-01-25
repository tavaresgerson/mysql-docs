### 17.7.1 Variáveis de Sistema do Group Replication

Esta seção lista as variáveis de sistema específicas do plugin Group Replication.

O nome de cada variável de sistema do Group Replication é prefixado com `group_replication_`.

A maioria das variáveis de sistema do Group Replication é descrita como dinâmica, e seus valores podem ser alterados enquanto o server estiver em execução. No entanto, na maioria dos casos, a alteração só entra em vigor após você parar e reiniciar o Group Replication no member do grupo, utilizando uma instrução [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") seguida por uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement"). Alterações nas seguintes variáveis de sistema entram em vigor sem a necessidade de parar e reiniciar o Group Replication:

* [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action)
* [`group_replication_flow_control_applier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_applier_threshold)
* [`group_replication_flow_control_certifier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_certifier_threshold)
* [`group_replication_flow_control_hold_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_hold_percent)
* [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota)
* [`group_replication_flow_control_member_quota_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_member_quota_percent)
* [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota)
* [`group_replication_flow_control_min_recovery_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_recovery_quota)
* [`group_replication_flow_control_mode`](group-replication-system-variables.html#sysvar_group_replication_flow_control_mode)
* [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members)
* [`group_replication_member_weight`](group-replication-system-variables.html#sysvar_group_replication_member_weight)
* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)
* [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout)

A maioria das variáveis de sistema do Group Replication pode ter valores diferentes em members distintos do grupo. Para as variáveis de sistema a seguir, é recomendável definir o mesmo valor em todos os members de um grupo para evitar o rollback desnecessário de Transactions, falha na entrega de mensagens ou falha na recuperação de mensagens:

* [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment)
* [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold)
* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)

Algumas variáveis de sistema em um member do Group Replication, incluindo algumas variáveis específicas do Group Replication e algumas variáveis gerais de sistema, são configurações válidas para todo o grupo (*group-wide configuration settings*). Essas variáveis de sistema devem ter o mesmo valor em todos os members do grupo, não podem ser alteradas enquanto o Group Replication estiver em execução e exigem um reboot completo do grupo (um *bootstrap* por um server com [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) para que a alteração do valor entre em vigor. Estas condições se aplicam às seguintes variáveis de sistema:

* [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)
* [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks)
* [`group_replication_gtid_assignment_block_size`](group-replication-system-variables.html#sysvar_group_replication_gtid_assignment_block_size)
* [`default_table_encryption`](/doc/refman/8.0/en/server-system-variables.html#sysvar_default_table_encryption)
* [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names)
* [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

Importante

* Diversas variáveis de sistema para o Group Replication não são totalmente validadas durante a inicialização do server se forem passadas como argumentos de linha de comando para o server. Essas variáveis de sistema incluem [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name), [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode), [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members), as variáveis SSL e as variáveis de Flow Control. Elas só são totalmente validadas após o server ter sido iniciado.

* Variáveis de sistema para o Group Replication que especificam endereços IP ou nomes de host para members do grupo não são validadas até que uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") seja emitida. O Group Communication System (GCS) do Group Replication não está disponível para validar os valores até esse ponto.

As variáveis de sistema específicas do plugin Group Replication são as seguintes:

* [`group_replication_allow_local_disjoint_gtids_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_disjoint_gtids_join)

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_disjoint_gtids_join"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-disjoint-gtids-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Descontinuado</th> <td>5.7.21</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_disjoint_gtids_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Descontinuado na versão 5.7.21 e programado para remoção em uma versão futura. Permite que o server se junte ao grupo mesmo que tenha Transactions locais que não estejam presentes no grupo.

  Aviso

  Use cautela ao habilitar esta opção, pois o uso incorreto pode levar a conflitos no grupo e ao rollback de Transactions. A opção só deve ser habilitada como um último recurso para permitir que um server que tenha Transactions locais se junte a um grupo existente, e somente se as Transactions locais não afetarem os dados que são gerenciados pelo grupo (por exemplo, uma ação administrativa que foi escrita no binary log). A opção não deve ser mantida habilitada em todos os members do grupo.

* [`group_replication_allow_local_lower_version_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join)

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Permite que o server atual se junte ao grupo mesmo que ele tenha uma versão major inferior à do grupo. Com a configuração padrão `OFF`, servers não têm permissão para se juntar a um grupo de replicação se tiverem uma versão major inferior à dos members existentes do grupo. Por exemplo, um server MySQL 5.7 não pode se juntar a um grupo composto por servers MySQL 8.0. Esta política padrão garante que todos os members de um grupo sejam capazes de trocar mensagens e aplicar Transactions. Defina [`group_replication_allow_local_lower_version_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join) como `ON` apenas nos seguintes cenários:

  + Um server deve ser adicionado ao grupo em uma emergência para melhorar a tolerância a falhas do grupo, e apenas versões mais antigas estão disponíveis.

  + Você deseja realizar um downgrade dos members do grupo de replicação sem encerrar todo o grupo e inicializá-lo novamente via *bootstrap*.

  Aviso

  Definir esta opção como `ON` não torna o novo member compatível com o grupo, e permite que ele se junte ao grupo sem nenhuma proteção contra comportamentos incompatíveis pelos members existentes. Para garantir a operação correta do novo member, tome *ambas* as precauções a seguir:

  1. Antes que o server com a versão major inferior se junte ao grupo, pare todas as operações de escrita nesse server.

  2. A partir do ponto em que o server com a versão major inferior se junta ao grupo, pare todas as operações de escrita nos outros servers do grupo.

  Sem estas precauções, é provável que o server com a versão major inferior enfrente dificuldades e seja encerrado com um erro.

* [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  Determina o intervalo entre valores de coluna sucessivos para Transactions que são executadas nesta instância do server. Esta variável de sistema deve ter o mesmo valor em todos os members do grupo. Quando o Group Replication é iniciado em um server, o valor da variável de sistema do server [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) é alterado para este valor, e o valor da variável de sistema do server [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) é alterado para o Server ID. Essas configurações evitam a seleção de valores auto-increment duplicados para operações de escrita nos members do grupo, o que causa o rollback de Transactions. As alterações são revertidas quando o Group Replication é interrompido. Estas alterações são feitas e revertidas apenas se [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) tiverem o seu valor padrão de 1. Se os seus valores já tiverem sido modificados do padrão, o Group Replication não os altera.

  O valor padrão de 7 representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 members). Se o seu grupo tiver mais ou menos members, você pode definir esta variável de sistema para corresponder ao número esperado de members do grupo antes que o Group Replication seja iniciado. Você não pode alterar a configuração enquanto o Group Replication estiver em execução.

  Importante

  Definir `group_replication_auto_increment_increment` não tem efeito quando [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode) é `ON`.

* [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Configura este server para fazer o *bootstrap* do grupo. Esta opção deve ser definida em apenas um server e somente ao iniciar o grupo pela primeira vez ou ao reiniciar o grupo inteiro. Após o *bootstrap* do grupo, defina esta opção como `OFF`. Ela deve ser definida como `OFF` tanto dinamicamente quanto nos arquivos de configuração. Iniciar dois servers ou reiniciar um server com esta opção definida enquanto o grupo está em execução pode levar a uma situação artificial de *split brain*, onde dois grupos independentes com o mesmo nome são inicializados via *bootstrap*.

* [`group_replication_components_stop_timeout`](group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout)

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-components-stop-timeout=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr> </tbody></table>

  Timeout, em segundos, que o Group Replication espera por cada um dos componentes ao encerrar.

* [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold)

  <table frame="box" rules="all" summary="Propriedades para group_replication_compression_threshold"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-compression-threshold=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_compression_threshold</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1000000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  O valor limite em bytes acima do qual a compressão é aplicada às mensagens enviadas entre os members do grupo. Se esta variável de sistema for definida como zero, a compressão é desabilitada. O valor de [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) deve ser o mesmo em todos os members do grupo.

  O Group Replication usa o algoritmo de compressão LZ4 para compactar mensagens enviadas no grupo. Note que o tamanho máximo de entrada suportado para o algoritmo de compressão LZ4 é de 2113929216 bytes. Este limite é inferior ao valor máximo possível para a variável de sistema [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold), que é igual ao tamanho máximo de mensagem aceito pelo XCom. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold), porque Transactions acima deste tamanho não podem ser commitadas quando a compressão de mensagens está habilitada.

  Para mais informações, consulte [Section 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression").

* [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks)

  <table frame="box" rules="all" summary="Propriedades para group_replication_enforce_update_everywhere_checks"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-enforce-update-everywhere-checks[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_enforce_update_everywhere_checks</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Habilita ou desabilita verificações de consistência estrita para o modo multi-primary update everywhere. O padrão é que as verificações estejam desabilitadas. No modo single-primary, esta opção deve ser desabilitada em todos os members do grupo. No modo multi-primary, quando esta opção está habilitada, as instruções são verificadas da seguinte forma para garantir que sejam compatíveis com o modo multi-primary:

  + Se uma Transaction for executada sob o nível de isolamento `SERIALIZABLE`, o seu commit falhará ao sincronizar-se com o grupo.

  + Se uma Transaction for executada contra uma tabela que tenha foreign keys com restrições em cascata, a Transaction falhará ao commitar-se ao sincronizar-se com o grupo.

  Esta variável de sistema é uma configuração válida para todo o grupo (*group-wide configuration setting*). Ela deve ter o mesmo valor em todos os members do grupo, não pode ser alterada enquanto o Group Replication estiver em execução, e exige um reboot completo do grupo (um *bootstrap* por um server com [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) para que a alteração do valor entre em vigor.

* [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action)

  <table frame="box" rules="all" summary="Propriedades para group_replication_exit_state_action"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-exit-state-action=value</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.24</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_exit_state_action</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>READ_ONLY</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ABORT_SERVER</code></p><p><code>READ_ONLY</code></p></td> </tr> </tbody></table>

  Configura como o Group Replication se comporta quando uma instância do server deixa o grupo não intencionalmente, por exemplo, após encontrar um erro no Applier, ou no caso de perda de maioria, ou quando outro member do grupo o expulsa devido a um timeout de suspeita. O período de timeout para um member deixar o grupo no caso de perda de maioria é definido pela variável de sistema [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout). Note que um member expulso não sabe que foi expulso até se reconectar ao grupo, então a ação especificada só é tomada se o member conseguir se reconectar, ou se o member levantar uma suspeita sobre si mesmo e se expulsar.

  Quando [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action) é definido como `ABORT_SERVER`, se o member sair do grupo não intencionalmente, a instância desliga o MySQL.

  Quando [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action) é definido como `READ_ONLY`, se o member sair do grupo não intencionalmente, a instância muda o MySQL para o modo *super read only* (definindo a variável de sistema [`super_read_only`](server-system-variables.html#sysvar_super_read_only) para `ON`). Esta configuração é o padrão no MySQL 5.7.

  Importante

  Se ocorrer uma falha antes que o member tenha se juntado com sucesso ao grupo, a ação de saída especificada *não é tomada*. Este é o caso se houver uma falha durante a verificação da configuração local, ou uma incompatibilidade entre a configuração do member que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema [`super_read_only`](server-system-variables.html#sysvar_super_read_only) é mantida com seu valor original, e o server não desliga o MySQL. Para garantir que o server não possa aceitar updates quando o Group Replication não foi iniciado, recomendamos, portanto, que [`super_read_only=ON`](server-system-variables.html#sysvar_super_read_only) seja definido no arquivo de configuração do server na inicialização, o que o Group Replication altera para `OFF` em members primary após ter sido iniciado com sucesso. Esta salvaguarda é particularmente importante quando o server está configurado para iniciar o Group Replication na inicialização ([`group_replication_start_on_boot=ON`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot)), mas também é útil quando o Group Replication é iniciado manualmente usando um comando [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement").

  Se ocorrer uma falha depois que o member se juntou com sucesso ao grupo, a ação de saída especificada *é tomada*. Este é o caso se houver um erro no Applier, se o member for expulso do grupo, ou se o member for configurado para ter timeout no caso de uma maioria inalcançável. Nessas situações, se `READ_ONLY` for a ação de saída, a variável de sistema [`super_read_only`](server-system-variables.html#sysvar_super_read_only) é definida como `ON`, ou se `ABORT_SERVER` for a ação de saída, o server desliga o MySQL.

  **Tabela 17.5 Ações de saída em situações de falha do Group Replication**

  <table frame="all" summary="Resume como a ação de saída selecionada opera ou não, dependendo da situação de falha"><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><thead><tr> <th><p> Situação de Falha </p></th> <th><p> Group Replication iniciado com <code>START GROUP_REPLICATION</code> </p></th> <th><p> Group Replication iniciado com <code>group_replication_start_on_boot =ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Member falha na verificação de configuração local </p><p> OU </p><p> Incompatibilidade entre o member que está se juntando e a configuração do grupo </p></th> <td><p> <code>super_read_only</code> inalterado </p><p> MySQL continua em execução </p><p> Defina <code>super_read_only=ON</code> na inicialização para prevenir updates </p></td> <td><p> <code>super_read_only</code> inalterado </p><p> MySQL continua em execução </p><p> Defina <code>super_read_only=ON</code> na inicialização para prevenir updates (Importante) </p></td> </tr><tr> <th><p> Erro no Applier no member </p><p> OU </p><p> Member expulso do grupo </p><p> OU </p><p> Timeout de maioria inalcançável </p></th> <td><p> <code>super_read_only</code> definido como <code>ON</code> </p><p> OU </p><p> MySQL é encerrado </p></td> <td><p> <code>super_read_only</code> definido como <code>ON</code> </p><p> OU </p><p> MySQL é encerrado </p></td> </tr></tbody></table>

* [`group_replication_flow_control_applier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_applier_threshold)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_applier_threshold"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-flow-control-applier-threshold=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_flow_control_applier_threshold</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>25000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>Transactions</td> </tr> </tbody></table>

  Especifica o número de Transactions pendentes na fila do Applier que acionam o Flow Control. Esta variável pode ser alterada sem reiniciar o Group Replication.

* [`group_replication_flow_control_certifier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_certifier_threshold)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_certifier_threshold"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Especifica o número de Transactions pendentes na fila do Certifier que acionam o Flow Control. Esta variável pode ser alterada sem reiniciar o Group Replication.

* [`group_replication_flow_control_hold_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_hold_percent)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_hold_percent"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Define qual porcentagem da Quota do grupo permanece sem uso para permitir que um cluster sob Flow Control recupere o atraso (*backlog*). Um valor de 0 implica que nenhuma parte da Quota é reservada para recuperar o atraso de trabalho.

* [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_max_quota"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Define a Quota máxima de Flow Control do grupo, ou a Quota máxima disponível para qualquer período enquanto o Flow Control estiver habilitado. Um valor de 0 implica que não há Quota máxima definida. Não pode ser menor que [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota) e `group_replication_flow_control_min_recovery_quota`.

* [`group_replication_flow_control_member_quota_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_member_quota_percent)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_member_quota_percent"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Define a porcentagem da Quota que um member deve assumir como disponível para si ao calcular as Quotas. Um valor de 0 implica que a Quota deve ser dividida igualmente entre os members que foram escritores no último período.

* [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_min_quota"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Controla a Quota mínima de Flow Control que pode ser atribuída a um member, independentemente da Quota mínima calculada executada no último período. Um valor de 0 implica que não há Quota mínima. Não pode ser maior que [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota).

* [`group_replication_flow_control_min_recovery_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_recovery_quota)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_min_recovery_quota"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Controla a Quota mínima que pode ser atribuída a um member devido a outro member em recuperação no grupo, independentemente da Quota mínima calculada executada no último período. Um valor de 0 implica que não há Quota mínima. Não pode ser maior que `group_replication_flow_control_max_quota`.

* [`group_replication_flow_control_mode`](group-replication-system-variables.html#sysvar_group_replication_flow_control_mode)

  <table frame="box" rules="all" summary="Propriedades para group_replication_flow_control_mode"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Especifica o modo usado para Flow Control. Esta variável pode ser alterada sem reiniciar o Group Replication.

* [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members)

  <table frame="box" rules="all" summary="Propriedades para group_replication_force_members"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Uma lista de endereços de peers como uma lista separada por vírgulas, como `host1:port1`,`host2:port2`. Esta opção é usada para forçar uma nova *membership* de grupo, na qual os members excluídos não recebem uma nova *view* e são bloqueados. (Você precisa encerrar manualmente os servers excluídos.) Qualquer nome de host inválido na lista pode fazer com que esta ação falhe, pois pode bloquear a *membership* do grupo. Para uma descrição do procedimento a seguir, consulte [Section 17.5.3, “Network Partitioning”](group-replication-network-partitioning.html "17.5.3 Network Partitioning").

  Você deve especificar o endereço ou nome do host e a porta conforme são fornecidos na opção [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) para cada member. Por exemplo:

  ```sql
  "198.51.100.44:33061,example.org:33061"
  ```

  Depois de usar a variável de sistema [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) para forçar com sucesso uma nova *membership* de grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) deve estar vazia para emitir uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement").

* [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name)

  <table frame="box" rules="all" summary="Propriedades para group_replication_group_name"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  O nome do grupo ao qual esta instância do server pertence. Deve ser um UUID válido. Este UUID é usado internamente ao definir GTIDs para eventos do Group Replication no binary log.

  Importante

  Um UUID exclusivo deve ser usado.

* [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds)

  <table frame="box" rules="all" summary="Propriedades para group_replication_group_seeds"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Uma lista de members do grupo aos quais um member que está se juntando pode se conectar para obter detalhes de todos os members atuais do grupo. O member que está se juntando usa esses detalhes para selecionar e se conectar a um member do grupo para obter os dados necessários para a sincronia com o grupo. A lista consiste nos endereços de rede do member *seed* especificados como uma lista separada por vírgulas, como `host1:port1`,`host2:port2`.

  Importante

  Estes endereços não devem ser o hostname e a porta SQL do server do member.

  Note que o valor que você especifica para esta variável não é validado até que uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") seja emitida e o Group Communication System (GCS) esteja disponível.

  Geralmente esta lista consiste em todos os members do grupo, mas você pode escolher um subconjunto dos members do grupo para serem *seeds*. A lista deve conter pelo menos um endereço de member válido. Cada endereço é validado ao iniciar o Group Replication. Se a lista não contiver nenhum nome de host válido, a emissão de [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") falhará.

* [`group_replication_gtid_assignment_block_size`](group-replication-system-variables.html#sysvar_group_replication_gtid_assignment_block_size)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O número de GTIDs consecutivos que são reservados para cada member. Cada member consome seus blocos e reserva mais quando necessário.

  Esta variável de sistema é uma configuração válida para todo o grupo (*group-wide configuration setting*). Ela deve ter o mesmo valor em todos os members do grupo, não pode ser alterada enquanto o Group Replication estiver em execução, e exige um reboot completo do grupo (um *bootstrap* por um server com [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) para que a alteração do valor entre em vigor.

* [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  Especifica a *allowlist* (lista de permissão) de hosts que têm permissão para se conectar ao grupo. O endereço que você especifica para cada member do grupo em [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) deve estar na *allowlist* nos outros servers no grupo de replicação. Note que o valor que você especifica para esta variável não é validado até que uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") seja emitida e o Group Communication System (GCS) esteja disponível.

  Por padrão, esta variável de sistema é definida como `AUTOMATIC`, o que permite conexões de sub-redes privadas ativas no host. O *group communication engine* (XCom) verifica automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas. Estes endereços e o endereço IP `localhost` para IPv4 são usados para criar a *allowlist* do Group Replication. Para uma lista dos intervalos a partir dos quais os endereços são automaticamente incluídos na *allowlist*, consulte [Section 17.6.1, “Group Replication IP Address Allowlisting”](group-replication-ip-address-permissions.html "17.6.1 Group Replication IP Address Allowlisting").

  A *allowlist* automática de endereços privados não pode ser usada para conexões de servers fora da rede privada. Para conexões do Group Replication entre instâncias de server que estão em máquinas diferentes, você deve fornecer endereços IP públicos e especificá-los como uma *allowlist* explícita. Se você especificar quaisquer entradas para a *allowlist*, os endereços privados não são adicionados automaticamente, portanto, se você usar algum deles, deverá especificá-los explicitamente. O endereço IP `localhost` é adicionado automaticamente.

  Como valor da opção [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist), você pode especificar qualquer combinação do seguinte:

  + Endereços IPv4 (por exemplo, `198.51.100.44`)

  + Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

  + Nomes de host, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

  + Nomes de host com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

  Endereços IPv6 e nomes de host que se resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para adicionar um bloco de endereços IP com um prefixo de rede específico à *allowlist*, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

  Uma vírgula deve separar cada entrada na *allowlist*. Por exemplo:

  ```sql
  192.0.2.22,198.51.100.0/24,example.org,www.example.com/24
  ```

  É possível configurar diferentes *allowlists* em diferentes members do grupo de acordo com seus requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. No entanto, isso pode causar problemas quando um grupo é reconfigurado. Se você não tiver um requisito de segurança específico para fazer o contrário, use a mesma *allowlist* em todos os members de um grupo. Para mais detalhes, consulte [Section 17.6.1, “Group Replication IP Address Allowlisting”](group-replication-ip-address-permissions.html "17.6.1 Group Replication IP Address Allowlisting").

  Para nomes de host, a resolução de nomes ocorre somente quando uma solicitação de conexão é feita por outro server. Um nome de host que não pode ser resolvido não é considerado para validação da *allowlist*, e uma mensagem de aviso é gravada no log de erros. A verificação Forward-confirmed reverse DNS (FCrDNS) é realizada para nomes de host resolvidos.

  Aviso

  Nomes de host são inerentemente menos seguros do que endereços IP em uma *allowlist*. A verificação FCrDNS fornece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de host em sua *allowlist* somente quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servers DNS, sejam mantidos sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo *hosts*, para evitar o uso de componentes externos.

* [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O endereço de rede que o member fornece para conexões de outros members, especificado como uma string formatada em `host:port`. Este endereço deve ser alcançável por todos os members do grupo porque é usado pelo *group communication engine* do Group Replication (XCom, uma variante do Paxos) para comunicação TCP entre instâncias XCom remotas. A comunicação com a instância local é feita por um canal de entrada usando memória compartilhada.

  Aviso

  Não use este endereço para comunicação com o member.

  Outros members do Group Replication contatam este member por meio deste `host:port` para toda a comunicação interna do grupo. Este não é o host e a porta do protocolo SQL do server MySQL.

  O endereço ou nome do host que você especifica em [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) é usado pelo Group Replication como o identificador exclusivo para um member do grupo de replicação. Você pode usar a mesma porta para todos os members de um grupo de replicação, contanto que os nomes de host ou endereços IP sejam todos diferentes, e você pode usar o mesmo nome de host ou endereço IP para todos os members, contanto que as portas sejam todas diferentes. A porta recomendada para [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) é 33061. Note que o valor que você especifica para esta variável não é validado até que a instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") seja emitida e o Group Communication System (GCS) esteja disponível.

* [`group_replication_member_weight`](group-replication-system-variables.html#sysvar_group_replication_member_weight)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  Um peso percentual que pode ser atribuído aos members para influenciar a chance de o member ser eleito como primary no evento de failover, por exemplo, quando o primary existente deixa um grupo single-primary. Atribua pesos numéricos aos members para garantir que members específicos sejam eleitos, por exemplo, durante a manutenção programada do primary ou para garantir que um determinado hardware seja priorizado em caso de failover.

  Para um grupo com members configurados da seguinte forma:

  + `member-1`: group_replication_member_weight=30, server_uuid=aaaa

  + `member-2`: group_replication_member_weight=40, server_uuid=bbbb

  + `member-3`: group_replication_member_weight=40, server_uuid=cccc

  + `member-4`: group_replication_member_weight=40, server_uuid=dddd

  durante a eleição de um novo primary, os members acima seriam classificados como `member-2`, `member-3`, `member-4` e `member-1`. Isso resulta na escolha do `member`-2 como o novo primary em caso de failover. Para mais informações, consulte [Section 17.5.1.1, “Single-Primary Mode”](group-replication-single-primary-mode.html "17.5.1.1 Single-Primary Mode").

* [`group_replication_poll_spin_loops`](group-replication-system-variables.html#sysvar_group_replication_poll_spin_loops)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O número de vezes que a Thread de comunicação do grupo espera que o mutex do *communication engine* seja liberado antes que a Thread espere por mais mensagens de rede recebidas.

* [`group_replication_recovery_complete_at`](group-replication-system-variables.html#sysvar_group_replication_recovery_complete_at)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  Políticas de recuperação ao lidar com Transactions em cache após a transferência de estado. Esta opção especifica se um member é marcado como online depois de ter recebido todas as Transactions que perdeu antes de se juntar ao grupo (`TRANSACTIONS_CERTIFIED`) ou depois de as ter recebido e aplicado (`TRANSACTIONS_APPLIED`).

* [`group_replication_recovery_retry_count`](group-replication-system-variables.html#sysvar_group_replication_recovery_retry_count)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O número de vezes que o member que está se juntando tenta se conectar aos donors disponíveis antes de desistir.

* [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O tempo de *sleep*, em segundos, entre as tentativas de reconexão quando nenhum donor foi encontrado no grupo.

* [`group_replication_recovery_ssl_ca`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_ca)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O caminho para um arquivo que contém uma lista de autoridades de certificação SSL confiáveis.

* [`group_replication_recovery_ssl_capath`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_capath)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-auto-increment-increment=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr> </tbody></table>

  O caminho para um diretório que contém certificados de autoridades de certificação SSL confiáveis.

* [`group_replication_recovery_ssl_cert`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_cert)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  O nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão segura.

* [`group_replication_recovery_ssl_key`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_key)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  O nome do arquivo de chave SSL a ser usado para estabelecer uma conexão segura.

* [`group_replication_recovery_ssl_cipher`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_cipher)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  A lista de cifras permitidas para criptografia SSL.

* [`group_replication_recovery_ssl_crl`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_crl)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  O caminho para um arquivo que contém listas de revogação de certificados.

* [`group_replication_recovery_ssl_crlpath`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_crlpath)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  O caminho para um diretório que contém arquivos contendo listas de revogação de certificados.

* [`group_replication_recovery_ssl_verify_server_cert`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_verify_server_cert)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Faz com que o processo de recuperação verifique o valor do Common Name do server no certificado enviado pelo donor.

* [`group_replication_recovery_use_ssl`](group-replication-system-variables.html#sysvar_group_replication_recovery_use_ssl)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Define se a conexão de recuperação do Group Replication deve usar SSL ou não.

* [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Nota

  Esta variável de sistema é uma configuração válida para todo o grupo (*group-wide configuration setting*), e um reboot completo do grupo de replicação é necessário para que uma alteração entre em vigor.

  [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode) instrui o grupo a selecionar automaticamente um único server para ser aquele que lida com a workload de leitura/escrita. Este server é o primary e todos os outros são secondaries.

  Esta variável de sistema é uma configuração válida para todo o grupo. Ela deve ter o mesmo valor em todos os members do grupo, não pode ser alterada enquanto o Group Replication estiver em execução, e exige um reboot completo do grupo (um *bootstrap* por um server com [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) para que a alteração do valor entre em vigor. Para obter instruções sobre como inicializar um grupo com segurança onde Transactions foram executadas e certificadas, consulte [Section 17.5.4, “Restarting a Group”](group-replication-restarting-group.html "17.5.4 Restarting a Group").

  Se o grupo tiver um valor definido para esta variável de sistema, e um member que está se juntando tiver um valor diferente definido para a variável de sistema, o member que está se juntando não poderá aderir ao grupo até que o valor seja alterado para corresponder. Se os members do grupo tiverem um valor definido para esta variável de sistema, e o member que está se juntando não suportar a variável de sistema, ele não poderá aderir ao grupo.

  Definir esta variável como `ON` faz com que qualquer configuração para [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment) seja ignorada.

* [`group_replication_ssl_mode`](group-replication-system-variables.html#sysvar_group_replication_ssl_mode)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Especifica o estado de segurança da conexão entre os members do Group Replication.

* [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot)

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-bootstrap-group[={OFF|ON}]</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr> </tbody></table>

  Define se o server deve iniciar o Group Replication ou não durante a inicialização do server.

* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-components-stop-timeout=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr> </tbody></table>

  Configura o tamanho máximo de Transaction em bytes que o grupo de replicação aceita. Transactions maiores que este tamanho são revertidas pelo member receptor e não são transmitidas para o grupo. Transactions grandes podem causar problemas para um grupo de replicação em termos de alocação de memória, o que pode fazer com que o sistema desacelere, ou em termos de consumo de largura de banda de rede, o que pode fazer com que um member seja suspeito de ter falhado porque está ocupado processando a Transaction grande.

  Quando esta variável de sistema é definida como 0, não há limite para o tamanho das Transactions que o grupo aceita. Nas releases até MySQL 5.7.37 (inclusive), a configuração padrão para esta variável de sistema é 0. A partir do MySQL 5.7.38 e no MySQL 8.0, a configuração padrão é 150000000 bytes (aproximadamente 143 MB). Ajuste o valor desta variável de sistema dependendo do tamanho máximo de mensagem que você precisa que o grupo tolere, tendo em mente que o tempo gasto para processar uma Transaction é proporcional ao seu tamanho. O valor de [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) deve ser o mesmo em todos os members do grupo. Para estratégias adicionais de mitigação para Transactions grandes, consulte [Section 17.3.2, “Group Replication Limitations”](group-replication-limitations.html "17.3.2 Group Replication Limitations").

* [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout)

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><thead><tr><th>Formato de Linha de Comando</th> <th><code>--group-replication-components-stop-timeout=#</code></th> </tr></thead><tbody><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr> </tbody></table>

  Configura por quanto tempo os members que sofrem uma partição de rede e não conseguem se conectar à maioria esperam antes de deixar o grupo.

  Em um grupo de 5 servers (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) está agora em minoria porque não pode contatar mais da metade do grupo. Enquanto o grupo majoritário (S3, S4, S5) permanece em execução, o grupo minoritário espera pelo tempo especificado por uma reconexão de rede. Quaisquer Transactions processadas pelo grupo minoritário são bloqueadas até que o Group Replication seja interrompido usando [`STOP GROUP REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") nos members da minoria. Note que [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout) não tem efeito se for definido nos servers no grupo minoritário após a perda de maioria ter sido detectada.

  Por padrão, esta variável de sistema é definida como 0, o que significa que os members que se encontram em minoria devido a uma partição de rede esperam indefinidamente para deixar o grupo. Se configurado para um número de segundos, os members esperam por esse período de tempo após perderem contato com a maioria dos members antes de deixarem o grupo. Quando o tempo especificado se esgota, todas as Transactions pendentes processadas pela minoria são revertidas (rollback), e os servers na partição minoritária passam para o estado `ERROR`. Esses servers seguem então a ação especificada pela variável de sistema [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action), que pode ser definir-se como modo *super read only* ou desligar o MySQL.

  Aviso

  Quando você tem um grupo simétrico, com apenas dois members, por exemplo (S0, S2), se houver uma partição de rede e não houver maioria, após o timeout configurado, todos os members entrarão no estado `ERROR`.