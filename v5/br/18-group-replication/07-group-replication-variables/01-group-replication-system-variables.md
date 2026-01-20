### 17.7.1 Variáveis do Sistema de Replicação em Grupo

Esta seção lista as variáveis do sistema que são específicas do plugin de replicação de grupo.

O nome de cada variável do sistema de replicação em grupo é precedido por `group_replication_`.

A maioria das variáveis do sistema para a Replicação em Grupo é descrita como dinâmica, e seus valores podem ser alterados enquanto o servidor estiver em execução. No entanto, na maioria dos casos, a alteração só entra em vigor após você parar e reiniciar a Replicação em Grupo no membro do grupo usando uma declaração `STOP GROUP_REPLICATION` seguida por uma declaração `START GROUP_REPLICATION`. As alterações nas seguintes variáveis do sistema entram em vigor sem parar e reiniciar a Replicação em Grupo:

- `grupo_replication_exit_state_action`
- `grupo_replication_flow_control_applier_threshold`
- `grupo_replication_flow_control_certifier_threshold`
- `group_replication_flow_control_hold_percent`
- `grupo_replication_flow_control_max_quota`
- `grupo_replicação_controle_fluxo_membro_quota_percent`
- `grupo_replicação_controle_fluxo_min_quota`
- `grupo_replicação_controle_fluxo_min_quota_recuperação`
- `grupo_replication_flow_control_mode`
- `group_replication_force_members`
- [`group_replication_member_weight`](https://pt.wikipedia.org/wiki/Sistema_de_replicação_por_grupo#variáveis_do_sistema)
- `grupo_replication_transaction_size_limit`
- `group_replication_unreachable_majority_timeout`

A maioria das variáveis de sistema para a Replicação em Grupo pode ter valores diferentes em diferentes membros do grupo. Para as seguintes variáveis de sistema, é aconselhável definir o mesmo valor em todos os membros de um grupo para evitar o descarte desnecessário de transações, a falha na entrega de mensagens ou a falha na recuperação de mensagens:

- `grupo_replicação_auto_incremento_incremento`
- `grupo_replicação_compressão_limite`
- `grupo_replication_transaction_size_limit`

Algumas variáveis de sistema em um membro do grupo de replicação em grupo, incluindo algumas variáveis de sistema específicas da Group Replication e algumas variáveis de sistema gerais, são configurações de nível de grupo. Essas variáveis de sistema devem ter o mesmo valor em todos os membros do grupo, não podem ser alteradas enquanto a Group Replication estiver em execução e exigem um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Essas condições se aplicam às seguintes variáveis de sistema:

- `grupo_replicação_modo_único_primário`
- `group_replication_enforce_update_everywhere_checks`
- `group_replication_gtid_assignment_block_size`
- `default_table_encryption`
- `lower_case_table_names`
- [`transaction_write_set_extraction`](https://replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

Importante

- Várias variáveis de sistema para a Replicação em Grupo não são completamente validadas durante o início do servidor se forem passadas como argumentos na linha de comando para o servidor. Essas variáveis de sistema incluem `group_replication_group_name`, `group_replication_single_primary_mode`, `group_replication_force_members`, as variáveis SSL e as variáveis do sistema de controle de fluxo. Elas só são totalmente validadas após o servidor ter sido iniciado.

- As variáveis do sistema para a Replicação em Grupo que especificam endereços IP ou nomes de host para os membros do grupo não são validadas até que uma declaração `START GROUP_REPLICATION` seja emitida. O Sistema de Comunicação do Grupo (GCS) da Replicação em Grupo não está disponível para validar os valores até esse ponto.

As variáveis do sistema específicas do plugin de replicação em grupo são as seguintes:

- `group_replication_allow_local_disjoint_gtids_join`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_disjoint_gtids_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-disjoint-gtids-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Desatualizado</th> <td>5.7.21</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_disjoint_gtids_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Desatualizado na versão 5.7.21 e previsto para ser removido em uma versão futura. Permite que o servidor se junte ao grupo, mesmo que ele tenha transações locais que não estejam presentes no grupo.

  Aviso

  Tenha cuidado ao habilitar essa opção, pois o uso incorreto pode causar conflitos no grupo e o cancelamento de transações. A opção deve ser habilitada apenas como um método de último recurso para permitir que um servidor que tenha transações locais se junte a um grupo existente, e só se as transações locais não afetarem os dados que são gerenciados pelo grupo (por exemplo, uma ação administrativa que foi escrita no log binário). A opção não deve ser deixada habilitada em todos os membros do grupo.

- `group_replication_allow_local_lower_version_join`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permite que o servidor atual se junte ao grupo, mesmo que ele tenha uma versão maior que a do grupo. Com a configuração padrão `OFF`, os servidores não são permitidos a se juntar a um grupo de replicação se tiverem uma versão maior que a dos membros existentes do grupo. Por exemplo, um servidor MySQL 5.7 não pode se juntar a um grupo que consiste em servidores MySQL 8.0. Essa política padrão garante que todos os membros de um grupo possam trocar mensagens e aplicar transações. Defina `group_replication_allow_local_lower_version_join` para `ON` apenas nos seguintes cenários:

  - Em caso de emergência, é necessário adicionar um servidor ao grupo para melhorar a tolerância a falhas do grupo, e apenas versões mais antigas estão disponíveis.

  - Você deseja realizar uma redução do grupo de replicação sem desligar o grupo inteiro e reiniciá-lo.

  Aviso

  Definir essa opção para `ON` não torna o novo membro compatível com o grupo e permite que ele se junte ao grupo sem quaisquer salvaguardas contra comportamentos incompatíveis dos membros existentes. Para garantir o funcionamento correto do novo membro, tome *ambas* das seguintes precauções:

  1. Antes que o servidor com a versão principal menor se junte ao grupo, pare todas as gravações nesse servidor.

  2. A partir do ponto em que o servidor com a versão principal mais baixa se junta ao grupo, pare todas as gravações nos outros servidores do grupo.

  Sem essas precauções, o servidor com a versão principal mais baixa provavelmente enfrentará dificuldades e terminará com um erro.

- `grupo_replicação_auto_incremento_incremento`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Determina o intervalo entre os valores sucessivos das colunas para as transações que são executadas nesta instância do servidor. Esta variável de sistema deve ter o mesmo valor em todos os membros do grupo. Quando a Replicação de Grupo é iniciada em um servidor, o valor da variável de sistema do servidor `auto_increment_increment` é alterado para este valor, e o valor da variável de sistema do servidor `auto_increment_offset` é alterado para o ID do servidor. Essas configurações evitam a seleção de valores duplicados de auto-incremento para escritas nos membros do grupo, o que causa o rollback das transações. As alterações são revertidas quando a Replicação de Grupo é parada. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` tenham seus valores padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação de Grupo não os altera.

  O valor padrão de 7 representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros). Se o seu grupo tiver mais ou menos membros, você pode definir essa variável de sistema para corresponder ao número esperado de membros do grupo antes de o Replicação de Grupo ser iniciado. Você não pode alterar a configuração enquanto o Replicação de Grupo estiver em execução.

  Importante

  Definir `group_replication_auto_increment_increment` não tem efeito quando `group_replication_single_primary_mode` está definido como `ON`.

- `grupo_replicação_bootstrap_grupo`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Configure este servidor para inicializar o grupo. Esta opção deve ser definida apenas em um servidor e apenas ao iniciar o grupo pela primeira vez ou reiniciá-lo completamente. Após o grupo ter sido inicializado, defina esta opção para `OFF`. Deve ser definida para `OFF` tanto dinamicamente quanto nos arquivos de configuração. Iniciar dois servidores ou reiniciar um servidor com esta opção definida enquanto o grupo estiver em execução pode levar a uma situação de cérebro artificial, onde dois grupos independentes com o mesmo nome são inicializados.

- `group_replication_components_stop_timeout`

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Tempo de espera, em segundos, que a Replicação em Grupo aguarda para cada um dos componentes ao desligar.

- `grupo_replicação_compressão_limite`

  <table frame="box" rules="all" summary="Propriedades para grupo_replication_compression_threshold"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-compression-threshold=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_compression_threshold</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1000000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  O valor limite em bytes acima do qual a compressão é aplicada às mensagens enviadas entre os membros do grupo. Se essa variável de sistema for definida como zero, a compressão será desativada. O valor de `group_replication_compression_threshold` deve ser o mesmo em todos os membros do grupo.

  A replicação em grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é igual ao tamanho máximo de mensagem aceito pelo XCom. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`, porque as transações acima desse tamanho não podem ser confirmadas quando a compressão de mensagens está habilitada.

  Para mais informações, consulte Seção 17.9.7.2, “Compressão de Mensagens”.

- `group_replication_enforce_update_everywhere_checks`

  <table frame="box" rules="all" summary="Propriedades para group_replication_enforce_update_everywhere_checks"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-enforce-update-everywhere-checks[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_enforce_update_everywhere_checks</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Ative ou desative verificações de consistência estritas para atualização multi-primária em todos os lugares. O padrão é que as verificações estejam desativadas. No modo de único primário, essa opção deve ser desativada em todos os membros do grupo. No modo multi-primário, quando essa opção estiver ativada, as declarações serão verificadas da seguinte forma para garantir que sejam compatíveis com o modo multi-primário:

  - Se uma transação for executada com o nível de isolamento `SERIALIZABLE`, seu commit falhará ao se sincronizar com o grupo.

  - Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então a transação não consegue ser confirmada ao se sincronizar com o grupo.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e exige um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva.

- `grupo_replication_exit_state_action`

  <table frame="box" rules="all" summary="Propriedades para group_replication_exit_state_action"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-exit-state-action=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.24</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_exit_state_action</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>READ_ONLY</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ABORT_SERVER</code></p><p><code>READ_ONLY</code></p></td> </tr></tbody></table>

  Configura como a Replicação em Grupo se comporta quando uma instância do servidor deixa o grupo involuntariamente, por exemplo, após encontrar um erro de aplicável, ou no caso de uma perda da maioria, ou quando outro membro do grupo o expulsa devido a uma suspeita de tempo excedido. O período de tempo para um membro deixar o grupo no caso de uma perda da maioria é definido pela variável de sistema `group_replication_unreachable_majority_timeout`. Observe que um membro expulso do grupo não sabe que foi expulso até se reconectar ao grupo, portanto, a ação especificada só é realizada se o membro conseguir se reconectar ou se o membro levantar uma suspeita sobre si mesmo e se expulsar.

  Quando `group_replication_exit_state_action` está definido como `ABORT_SERVER`, se o membro sair do grupo acidentalmente, a instância desativa o MySQL.

  Quando `group_replication_exit_state_action` está definido como `READ_ONLY`, se o membro sair do grupo acidentalmente, a instância altera o MySQL para o modo de leitura super-somente (definindo a variável de sistema `super_read_only` como `ON`). Esse ajuste é o padrão no MySQL 5.7.

  Importante

  Se uma falha ocorrer antes que o membro tenha se juntado com sucesso ao grupo, a ação de saída especificada *não é executada*. Esse é o caso se houver uma falha durante a verificação da configuração local ou se houver uma incompatibilidade entre a configuração do membro que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema `super_read_only` é deixada com seu valor original, e o servidor não desativa o MySQL. Para garantir que o servidor não aceite atualizações quando a Replicação de Grupo não foi iniciada, recomendamos que `super_read_only=ON` seja definido no arquivo de configuração do servidor ao iniciar, o que a Replicação de Grupo altera para `OFF` nos membros primários após ser iniciada com sucesso. Essa proteção é particularmente importante quando o servidor é configurado para iniciar a Replicação de Grupo ao inicializar o servidor (`group_replication_start_on_boot=ON`), mas também é útil quando a Replicação de Grupo é iniciada manualmente usando um comando `START GROUP_REPLICATION`.

  Se ocorrer um erro após o membro ter se juntado com sucesso ao grupo, a ação de saída especificada *é realizada*. Esse é o caso se houver um erro de aplicação, se o membro for expulso do grupo ou se o membro for definido para expirar na hipótese de uma maioria inacessível. Nessas situações, se `READ_ONLY` for a ação de saída, a variável de sistema `super_read_only` é definida como `ON`, ou se `ABORT_SERVER` for a ação de saída, o servidor desativa o MySQL.

  **Tabela 17.5 Ações de saída em situações de falha na replicação em grupo**

  <table frame="all" summary="Resume como a ação de saída selecionada funciona ou não funciona, dependendo da situação de falha"><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><thead><tr> <th><p>Situação de falha</p></th> <th><p>A replicação em grupo começou com <code>START GROUP_REPLICATION</code></p></th> <th><p>A replicação em grupo começou com <code>group_replication_start_on_boot =ON</code></p></th> </tr></thead><tbody><tr> <th><p>O membro falha na verificação de configuração local</p><p>OU</p><p>Desajuste entre o membro que está se juntando e a configuração do grupo</p></th> <td><p><code>super_read_only</code> sem alterações</p><p>MySQL continua funcionando</p><p>Defina <code>super_read_only=ON</code> no momento do início para impedir as atualizações</p></td> <td><p><code>super_read_only</code> inalterado</p><p>MySQL continua funcionando</p><p>Defina <code>super_read_only=ON</code> no momento do início para impedir atualizações (Importante)</p></td> </tr><tr> <th><p>Erro de aplicação no membro</p><p>OU</p><p>Membro expulso do grupo</p><p>OU</p><p>Tempo de espera para maioria inacessível</p></th> <td><p><code>super_read_only</code> definido para <code>ON</code></p><p>OU</p><p>MySQL é desligado</p></td> <td><p><code>super_read_only</code> definido para <code>ON</code></p><p>OU</p><p>MySQL é desligado</p></td> </tr></tbody></table>

- `grupo_replication_flow_control_applier_threshold`

  <table frame="box" rules="all" summary="Propriedades para grupo_replication_flow_control_applier_threshold"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-flow-control-applier-threshold=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_flow_control_applier_threshold</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>25000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

  Especifica o número de transações pendentes na fila de aplicador que acionam o controle de fluxo. Essa variável pode ser alterada sem reiniciar a Replicação por Grupo.

- `grupo_replication_flow_control_certifier_threshold`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o número de transações pendentes na fila de certificação que acionam o controle de fluxo. Essa variável pode ser alterada sem reiniciar a Replicação por Grupo.

- `group_replication_flow_control_hold_percent`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a porcentagem do quociente do grupo que permanece não utilizada para permitir que um grupo sob controle de fluxo recupere o atraso. Um valor de 0 implica que nenhuma parte do quociente é reservada para recuperar o atraso no trabalho.

- `grupo_replication_flow_control_max_quota`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a quota máxima de controle de fluxo do grupo ou a quota máxima disponível para qualquer período enquanto o controle de fluxo estiver habilitado. Um valor de 0 implica que não há cotas máximas definidas. Não pode ser menor que `group_replication_flow_control_min_quota` e `group_replication_flow_control_min_recovery_quota`.

- `grupo_replicação_controle_fluxo_membro_quota_percent`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define a porcentagem da quota que um membro deve assumir como disponível para si mesmo ao calcular as cotas. Um valor de 0 implica que a quota deve ser dividida igualmente entre os membros que foram escritores no último período.

- `grupo_replicação_controle_fluxo_min_quota`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla a quota de controle de fluxo mais baixa que pode ser atribuída a um membro, independentemente da quota mínima calculada executada no último período. Um valor de 0 implica que não há quota mínima. Não pode ser maior que `group_replication_flow_control_max_quota`.

- `grupo_replicação_controle_fluxo_min_quota_recuperação`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla a cotas mais baixas que podem ser atribuídas a um membro devido a outro membro em recuperação no grupo, independentemente da cotas mínimas calculadas executadas no último período. Um valor de 0 implica que não há cotas mínimas. Não pode ser maior que `group_replication_flow_control_max_quota`.

- `grupo_replication_flow_control_mode`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o modo usado para o controle de fluxo. Essa variável pode ser alterada sem reiniciar a Replicação de Grupo.

- `group_replication_force_members`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Uma lista de endereços de pares como uma lista separada por vírgula, como `host1:port1`, `host2:port2`. Esta opção é usada para forçar uma nova adesão ao grupo, na qual os membros excluídos não recebem uma nova visualização e são bloqueados. (Você precisa matar manualmente os servidores excluídos.) Quaisquer nomes de host inválidos na lista podem causar o falha desta ação, pois podem bloquear a adesão ao grupo. Para uma descrição do procedimento a seguir, consulte Seção 17.5.3, “Divisão de Rede”.

  Você deve especificar o endereço ou o nome do host e o número de porta conforme fornecidos na opção `group_replication_local_address` para cada membro. Por exemplo:

  ```sql
  "198.51.100.44:33061,example.org:33061"
  ```

  Depois de usar a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. A variável de sistema `group_replication_force_members` deve estar vazia para emitir uma declaração de `START GROUP_REPLICATION`.

- `grupo_replication_group_name`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nome do grupo ao qual essa instância do servidor pertence. Deve ser um UUID válido. Esse UUID é usado internamente ao definir GTIDs para eventos de Replicação de Grupo no log binário.

  Importante

  Deve-se usar um UUID único.

- `grupo_replicação_grupo_sementes`

  <table frame="box" rules="all" summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_allow_local_lower_version_join</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Uma lista de membros do grupo para os quais um membro que se junta pode se conectar para obter detalhes de todos os membros atuais do grupo. O membro que se junta usa esses detalhes para selecionar e se conectar a um membro do grupo para obter os dados necessários para a sincronização com o grupo. A lista consiste nos endereços de rede do membro inicial especificados como uma lista separada por vírgula, como `host1:port1`, `host2:port2`.

  Importante

  Esses endereços não devem ser o nome do host e a porta do membro no SQL.

  Observe que o valor especificado para essa variável não é validado até que uma instrução `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação de Grupo (GCS) estiver disponível.

  Normalmente, essa lista consiste em todos os membros do grupo, mas você pode escolher um subconjunto dos membros do grupo para serem as sementes. A lista deve conter pelo menos um endereço de membro válido. Cada endereço é validado ao iniciar a Replicação do Grupo. Se a lista não contiver nenhum nome de host válido, a emissão de `START GROUP_REPLICATION` falhará.

- `group_replication_gtid_assignment_block_size`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de GTIDs consecutivos reservados para cada membro. Cada membro consome seus blocos e reserva mais quando necessário.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e exige um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva.

- `grupo_replication_ip_whitelist`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Especifica a lista de permissão de hosts que são permitidos para se conectar ao grupo. O endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve estar na lista de permissão dos outros servidores no grupo de replicação. Observe que o valor que você especificar para essa variável não é validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

  Por padrão, essa variável de sistema é definida como `AUTOMATIC`, o que permite conexões de subredes privadas ativas no host. O motor de comunicação em grupo (XCom) escaneia automaticamente as interfaces ativas no host e identifica aquelas com endereços em subredes privadas. Esses endereços e o endereço IP `localhost` para IPv4 são usados para criar a lista de permissões de replicação em grupo. Para uma lista dos intervalos a partir dos quais os endereços são automaticamente permitidos, consulte Seção 17.6.1, “Permissões de Endereço IP de Replicação em Grupo”.

  A lista de endereços privados permitidos automaticamente não pode ser usada para conexões de servidores externos à rede privada. Para conexões de replicação em grupo entre instâncias de servidor em máquinas diferentes, você deve fornecer endereços IP públicos e especificá-los como uma lista de permissão explícita. Se você especificar qualquer entrada na lista de permissão, os endereços privados não serão adicionados automaticamente, portanto, se você usar qualquer um deles, você deve especificá-los explicitamente. O endereço IP `localhost` é adicionado automaticamente.

  Como o valor da opção `group_replication_ip_whitelist`, você pode especificar qualquer combinação dos seguintes:

  - Endereços IPv4 (por exemplo, `198.51.100.44`)

  - Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

  - Nomes de host, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

  - Nomes de host com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

  Os endereços IPv6 e os nomes de host que resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

  Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

  ```sql
  192.0.2.22,198.51.100.0/24,example.org,www.example.com/24
  ```

  É possível configurar diferentes listas de permissões em diferentes membros do grupo de acordo com os requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. No entanto, isso pode causar problemas quando um grupo é reconfigurado. Se você não tiver um requisito de segurança específico para fazer o contrário, use a mesma lista de permissões em todos os membros de um grupo. Para mais detalhes, consulte Seção 17.6.1, “Permissões de Endereços IP de Replicação de Grupo”.

  Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação da lista de permissão, e uma mensagem de aviso é escrita no log de erros. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

  Aviso

  Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação do FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique os nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.

- `grupo_replicação_endereço_local`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O endereço de rede fornecido pelo membro para conexões de outros membros, especificado como uma string formatada `host:port`. Esse endereço deve ser acessível por todos os membros do grupo, pois é usado pelo motor de comunicação do grupo para a Replicação em Grupo (XCom, uma variante do Paxos) para comunicação TCP entre instâncias remotas do XCom. A comunicação com a instância local é feita por meio de um canal de entrada usando memória compartilhada.

  Aviso

  Não use este endereço para comunicação com o membro.

  Outros membros da replicação em grupo contatam este membro através deste `host:port` para toda a comunicação interna do grupo. Este não é o host e o port do protocolo SQL do servidor MySQL.

  O endereço ou nome de host que você especifica em `group_replication_local_address` é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar a mesma porta para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam diferentes, e você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que as portas sejam diferentes. A porta recomendada para `group_replication_local_address` é 33061. Note que o valor que você especifica para essa variável não é validado até que a instrução `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

- [`group_replication_member_weight`](https://pt.wikipedia.org/wiki/Sistema_de_replicação_por_grupo#variáveis_do_sistema)

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Um peso percentual que pode ser atribuído aos membros para influenciar a chance de o membro ser eleito como primário em caso de falha, por exemplo, quando o primário existente deixa um grupo de primário único. Atribua pesos numéricos aos membros para garantir que membros específicos sejam eleitos, por exemplo, durante a manutenção programada do primário ou para garantir que certos equipamentos sejam priorizados em caso de falha.

  Para um grupo com membros configurados da seguinte forma:

  - `member-1`: grupo_replication_member_weight=30, servidor_uuid=aaaa

  - `member-2`: grupo_replication_member_weight=40, servidor_uuid=bbbb

  - `member-3`: grupo_replication_member_weight=40, server_uuid=cccc

  - `member-4`: grupo_replication_member_weight=40, server_uuid=dddd

  Durante a eleição de uma nova primária, os membros acima seriam classificados como `member-2`, `member-3`, `member-4` e `member-1`. Isso resulta em `member`-2 sendo escolhido como a nova primária em caso de falha. Para mais informações, consulte Seção 17.5.1.1, “Modo Primário Único”.

- `grupo_replication_poll_spin_loops`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de vezes que o thread de comunicação do grupo aguarda pelo mutex do motor de comunicação ser liberado antes que o thread espere por mais mensagens de rede recebidas.

- `grupo_replication_recovery_complete_at`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Políticas de recuperação ao lidar com transações armazenadas em cache após a transferência de estado. Esta opção especifica se um membro é marcado como online após receber todas as transações que ele perdeu antes de se juntar ao grupo (`TRANSACTIONS_CERTIFIED`) ou após recebê-las e aplicá-las (`TRANSACTIONS_APPLIED`).

- `grupo_replication_recovery_retry_count`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número de vezes que o membro que está se conectando tenta se conectar aos doadores disponíveis antes de desistir.

- `intervalo_de_reconexão_de_recuperação_de_replicação_por_grupo`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O tempo de sono, em segundos, entre as tentativas de reconexão quando nenhum doador foi encontrado no grupo.

- `grupo_replication_recovery_ssl_ca`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O caminho para um arquivo que contém uma lista de autoridades de certificação SSL confiáveis.

- `group_replication_recovery_ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>7</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O caminho para um diretório que contém certificados de autoridade de certificação SSL confiáveis.

- `grupo_replication_recovery_ssl_cert`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão segura.

- `grupo_replication_recovery_ssl_key`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nome do arquivo de chave SSL a ser usado para estabelecer uma conexão segura.

- `group_replication_recovery_ssl_cipher`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  A lista de cifra permitida para criptografia SSL.

- `grupo_replication_recovery_ssl_crl`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O caminho para um diretório que contém arquivos contendo listas de revogação de certificados.

- `group_replication_recovery_ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O caminho para um diretório que contém arquivos contendo listas de revogação de certificados.

- `group_replication_recovery_ssl_verify_server_cert`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Na verificação do processo de recuperação, verifique o valor do Nome Comum do servidor no certificado enviado pelo doador.

- `group_replication_recovery_use_ssl`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a conexão de recuperação da replicação em grupo deve usar SSL ou

- `grupo_replicação_modo_único_primário`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_single_primary_mode` instrui o grupo a escolher automaticamente um único servidor para ser o responsável pela carga de trabalho de leitura/escrita. Esse servidor é o primário e todos os outros são secundários.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte Seção 17.5.4, “Reinício de um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

  Definir essa variável como `ON` faz com que qualquer configuração para `group_replication_auto_increment_increment` seja ignorada.

- `grupo_replication_ssl_mode`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Especifica o estado de segurança da conexão entre os membros da replicação em grupo.

- `group_replication_start_on_boot`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o servidor deve iniciar a Replicação em Grupo ou não durante o início do servidor.

- `grupo_replication_transaction_size_limit`

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Configura o tamanho máximo da transação em bytes que o grupo de replicação aceita. Transações maiores que esse tamanho são revertidas pelo membro receptor e não são transmitidas para o grupo. Transações grandes podem causar problemas para um grupo de replicação em termos de alocação de memória, o que pode fazer com que o sistema desacelere, ou em termos de consumo de largura de banda da rede, o que pode fazer com que um membro seja suspeito de ter falhado porque está ocupado processando a transação grande.

  Quando essa variável de sistema é definida como 0, não há limite para o tamanho das transações que o grupo aceita. Nas versões até e incluindo o MySQL 5.7.37, o ajuste padrão para essa variável de sistema é 0. A partir do MySQL 5.7.38 e no MySQL 8.0, o ajuste padrão é de 150000000 bytes (aproximadamente 143 MB). Ajuste o valor dessa variável de sistema de acordo com o tamanho máximo de mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho. O valor de `group_replication_transaction_size_limit` deve ser o mesmo em todos os membros do grupo. Para obter estratégias adicionais de mitigação para transações grandes, consulte Seção 17.3.2, “Limitações da Replicação em Grupo”.

- `group_replication_unreachable_majority_timeout`

  <table frame="box" rules="all" summary="Propriedades para group_replication_components_stop_timeout"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>31536000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Configura quanto tempo os membros que sofrem uma partição de rede e não conseguem se conectar à maioria devem esperar antes de sair do grupo.

  Em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) agora está em minoria porque não pode entrar em contato com mais da metade do grupo. Enquanto o grupo maioritário (S3, S4, S5) permanece em funcionamento, o grupo minoritário aguarda o tempo especificado para uma reconexão de rede. Quaisquer transações processadas pelo grupo minoritário são bloqueadas até que a Replicação de Grupo seja interrompida usando `STOP GROUP REPLICATION` nos membros do grupo minoritário. Note que `group_replication_unreachable_majority_timeout` não tem efeito se for definido nos servidores do grupo minoritário após a detecção da perda da maioria.

  Por padrão, essa variável de sistema é definida como 0, o que significa que os membros que se encontram em minoria devido a uma partição de rede aguardam para sair do grupo para sempre. Se configurada para um número de segundos, os membros aguardam esse tempo após perderem contato com a maioria dos membros antes de sair do grupo. Quando o tempo especificado passa, todas as transações pendentes processadas pela minoria são revertidas e os servidores na partição da minoria passam para o estado `ERROR`. Esses servidores, então, seguem a ação especificada pela variável de sistema `group_replication_exit_state_action`, que pode ser definir-se no modo de leitura apenas super ou desligar o MySQL.

  Aviso

  Quando você tem um grupo simétrico, com apenas dois membros, por exemplo (S0, S2), se houver uma partição de rede e não houver maioria, após o tempo limite configurado, todos os membros entram no estado `ERROR`.
