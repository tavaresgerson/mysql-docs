### 20.9.1 Variáveis do Sistema de Replicação em Grupo

Esta seção lista as variáveis do sistema que são específicas do plugin de Replicação em Grupo.

O nome de cada variável do sistema de Replicação em Grupo é precedido por `group_replication_`.

Observação

O InnoDB Cluster usa a Replicação em Grupo, mas os valores padrão das variáveis do sistema de Replicação em Grupo podem diferir dos valores padrão documentados nesta seção. Por exemplo, no InnoDB Cluster, o valor padrão de `group_replication_communication_stack` é `MYSQL`, e não `XCOM`, como é o caso de uma implementação padrão de Replicação em Grupo.

Para mais informações, consulte MySQL InnoDB Cluster.

Algumas variáveis do sistema em um membro do grupo de Replicação em Grupo, incluindo algumas variáveis do sistema específicas da Replicação em Grupo e algumas variáveis do sistema gerais, são configurações de configuração de nível de grupo. Essas variáveis do sistema devem ter o mesmo valor em todos os membros do grupo e requerem um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a mudança de valor seja efetiva. Para instruções sobre como reiniciar um grupo onde todos os membros foram interrompidos, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se um grupo em execução tiver um valor definido para uma configuração de nível de grupo, e um membro que está se juntando tiver um valor diferente definido para essa variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para corresponder. Se o grupo tiver um valor definido para uma dessas variáveis do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

As seguintes variáveis do sistema são configurações de configuração de nível de grupo:

* `group_replication_single_primary_mode`
* `group_replication_enforce_update_everywhere_checks`
* `group_replication_gtid_assignment_block_size`
* `group_replication_view_change_uuid` (desatualizado)

* `group_replication_paxos_single_leader`
* `group_replication_communication_stack` (um caso especial não monitorado pelas próprias verificações do Grupo de Replicação; consulte a descrição da variável do sistema para detalhes)

* `default_table_encryption`
* `lower_case_table_names`

Os ajustes de configuração de nível de grupo não podem ser alterados pelos métodos usuais enquanto o Grupo de Replicação estiver em execução, mas é possível usar as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar os valores de `group_replication_single_primary_mode` e `group_replication_enforce_update_everywhere_checks` enquanto o grupo ainda estiver em execução. Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”.

A maioria das variáveis do sistema para o Grupo de Replicação pode ter valores diferentes em diferentes membros do grupo. Para as seguintes variáveis do sistema, é aconselhável definir o mesmo valor em todos os membros de um grupo para evitar o rollback desnecessário de transações, a falha na entrega de mensagens ou a falha na recuperação de mensagens:

* `group_replication_auto_increment_increment`
* `group_replication_communication_max_message_size`
* `group_replication_compression_threshold`
* `group_replication_message_cache_size`
* `group_replication_transaction_size_limit`

O valor de `group_replication_preemptive_garbage_collection` deve ser o mesmo em todos os membros do grupo.

A maioria das variáveis de sistema para a Replicação em Grupo é descrita como dinâmica, e seus valores podem ser alterados enquanto o servidor estiver em execução. No entanto, na maioria dos casos, a alteração só entra em vigor após você parar e reiniciar a Replicação em Grupo no membro do grupo usando uma instrução `STOP GROUP_REPLICATION` seguida por uma instrução `START GROUP_REPLICATION`. Alterações nas seguintes variáveis de sistema entram em vigor sem parar e reiniciar a Replicação em Grupo:

* `group_replication_advertise_recovery_endpoints`
* `group_replication_autorejoin_tries`
* `group_replication_consistency`
* `group_replication_elect_prefers_most_updated.enabled`
* `group_replication_exit_state_action`
* `group_replication_flow_control_applier_threshold`
* `group_replication_flow_control_certifier_threshold`
* `group_replication_flow_control_hold_percent`
* `group_replication_flow_control_max_quota`
* `group_replication_flow_control_member_quota_percent`
* `group_replication_flow_control_min_quota`
* `group_replication_flow_control_min_recovery_quota`
* `group_replication_flow_control_mode`
* `group_replication_flow_control_period`
* `group_replication_flow_control_release_percent`
* `group_replication_force_members`
* `group_replication_ip_allowlist`
* `group_replication_member_expel_timeout`
* `group_replication_member_weight`
* `group_replication_transaction_size_limit`
* `group_replication_unreachable_majority_timeout`

Quando você alterar os valores de qualquer variável do sistema de replicação em grupo, lembre-se de que, se houver um ponto em que a replicação em grupo é interrompida em todos os membros de uma vez por uma instrução `STOP GROUP_REPLICATION` ou desligamento do sistema, o grupo deve ser reiniciado por bootstrapping, como se estivesse sendo iniciado pela primeira vez. Para obter instruções sobre como fazer isso com segurança, consulte a Seção 20.5.2, “Reiniciar um Grupo”. No caso de configurações de configuração em todo o grupo, isso é necessário, mas se você estiver alterando outras configurações, tente garantir que pelo menos um membro esteja em execução em todos os momentos.

Importante

* Várias variáveis do sistema para a replicação em grupo não são completamente validadas durante o inicialização do servidor se forem passadas como argumentos de linha de comando para o servidor. Essas variáveis do sistema incluem `group_replication_group_name`, `group_replication_single_primary_mode`, `group_replication_force_members`, as variáveis SSL e as variáveis do sistema de controle de fluxo. Elas são totalmente validadas apenas após o servidor ter iniciado.

* Variáveis do sistema para a replicação em grupo que especificam endereços IP ou nomes de host para membros do grupo não são validadas até que uma instrução `START GROUP_REPLICATION` seja emitida. O Sistema de Comunicação do Grupo (GCS) da Replicação em Grupo (GRG) não está disponível para validar os valores até esse ponto.

As variáveis do sistema do servidor específicas do plugin de replicação em grupo, juntamente com descrições de sua função ou propósito, estão listadas aqui:

* `group_replication_advertise_recovery_endpoints`

<table frame="box" rules="all" summary="Propriedades para group_replication_advertise_recovery_endpoints">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-advertise-recovery-endpoints=valor</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_advertise_recovery_endpoints</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>DEFAULT</code></td>
  </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto o Group Replication estiver em execução. A alteração entra em vigor imediatamente no membro. No entanto, um membro que se junta já que recebeu o valor anterior da variável do sistema continua a usar esse valor. Apenas os membros que se juntam após a alteração do valor recebem o novo valor.

`group_replication_advertise_recovery_endpoints` especifica como um membro que se junta pode estabelecer uma conexão com um membro existente para a transferência de estado para a recuperação distribuída. A conexão é usada tanto para operações de clonagem remota quanto para a transferência de estado do log binário do doador.

Um valor de `DEFAULT`, que é o ajuste padrão, significa que os membros que se juntam usam a conexão padrão do cliente SQL do membro existente, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. Se uma porta alternativa for especificada pela variável de sistema `report_port`, essa será usada em vez disso. A tabela do Schema de Desempenho `replication_group_members` mostra o endereço e o número de porta dessa conexão nas colunas `MEMBER_HOST` e `MEMBER_PORT`.

Em vez de `DEFAULT`, você pode especificar um ou mais pontos finais de recuperação distribuídos, que o membro existente anuncia aos membros que se juntam para que eles possam usar. Oferecer pontos finais de recuperação distribuídos permite que os administradores controlem o tráfego de recuperação distribuída separadamente das conexões regulares do cliente MySQL aos membros do grupo. Os membros que se juntam tentam cada um dos pontos finais em ordem, conforme especificado na lista.

Especifique os pontos finais de recuperação distribuídos como uma lista de endereços IP e números de porta separados por vírgula, por exemplo:

```
  group_replication_advertise_recovery_endpoints= "127.0.0.1:3306,127.0.0.1:4567,[::1]:3306,localhost:3306"
  ```

Endereços IPv4 e IPv6 e nomes de host podem ser usados em qualquer combinação. Endereços IPv6 devem ser especificados entre colchetes. Nomes de host devem resolver para um endereço IP local. Formatos de endereços com asterisco não podem ser usados e você não pode especificar uma lista vazia. Note que a conexão padrão do cliente SQL não é incluída automaticamente em uma lista de pontos finais de recuperação distribuídos. Se você quiser usá-la como um ponto final, deve incluí-la explicitamente na lista.

Para obter detalhes sobre como selecionar endereços IP e portas como pontos finais de recuperação distribuídos e como os membros que se juntam os usam, consulte a Seção 20.5.4.1.1, “Selecionando endereços para pontos finais de recuperação distribuídos”. Um resumo dos requisitos é o seguinte:

+ Os endereços IP não precisam ser configurados para o MySQL Server, mas precisam ser atribuídos ao servidor.

+ As portas precisam ser configuradas para o MySQL Server usando a variável de sistema `port`, `report_port` ou `admin_port`.

+ São necessárias permissões apropriadas para o usuário de replicação para a recuperação distribuída se a `admin_port` for usada.

+ Os endereços IP não precisam ser adicionados à lista de permissões de replicação em grupo especificada pela variável de sistema `group_replication_ip_allowlist`.

+ Os requisitos de SSL para a conexão são especificados pelas opções `group_replication_recovery_ssl_*`.

* `group_replication_auto_increment_increment`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></table>

Essa variável de sistema deve ter o mesmo valor em todos os membros do grupo. Você não pode alterar o valor dessa variável de sistema enquanto a Replicação em Grupo estiver em execução. Você deve parar a Replicação em Grupo, alterar o valor da variável de sistema e, em seguida, reiniciar a Replicação em Grupo, em cada um dos membros do grupo. Durante esse processo, o valor da variável de sistema pode diferir entre os membros do grupo, mas algumas transações nos membros do grupo podem ser revertidas.

`group_replication_auto_increment_increment` determina o intervalo entre os valores sucessivos para colunas com incremento automático para transações que executam nesta instância do servidor. Adicionar um intervalo evita a seleção de valores de incremento automático duplicados para escritas nos membros do grupo, o que causa o rollback das transações. O valor padrão de 7 representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros). Se o seu grupo tiver mais ou menos membros, você pode definir essa variável de sistema para corresponder ao número esperado de membros do grupo antes de a Replicação em Grupo ser iniciada.

Importante

Definir `group_replication_auto_increment_increment` não tem efeito quando `group_replication_single_primary_mode` está em `ON`.

Quando a Replicação em Grupo é iniciada em uma instância do servidor, o valor da variável de sistema do servidor `auto_increment_increment` é alterado para esse valor, e o valor da variável de sistema do servidor `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é interrompida. Essas alterações só são feitas e revertidas se `auto_increment_increment` e `auto_increment_offset` tiverem seu valor padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação em Grupo não os altera. As variáveis de sistema também não são modificadas quando a Replicação em Grupo está no modo de único primário, onde apenas um servidor escreve.

* `group_replication_autorejoin_tries`

  <table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr></tbody></table>

O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente. O valor atual da variável de sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

`group_replication_autorejoin_tries` especifica o número de tentativas que um membro faz para se reiniciar automaticamente no grupo se for expulso ou se não conseguir entrar em contato com a maioria do grupo antes que o ajuste `group_replication_unreachable_majority_timeout` seja alcançado. Quando a expulsão ou o tempo de espera para a maioria inacessível do membro for alcançado, ele tenta se reiniciar (usando os valores atuais das opções do plugin), e continua a fazer tentativas de reinício automático até o número especificado de tentativas. Após uma tentativa de reinício automático malsucedida, o membro espera 5 minutos antes do próximo tentativa. Se o número especificado de tentativas for esgotado sem o membro se reiniciar ou ser interrompido, o membro prossegue para a ação especificada pela variável de sistema `group_replication_exit_state_action`.

Durante e entre as tentativas de reinício automático, um membro permanece no modo de leitura apenas super e não aceita escritas, mas leituras ainda podem ser feitas no membro, com uma probabilidade crescente de leituras desatualizadas ao longo do tempo. Se você não pode tolerar a possibilidade de leituras desatualizadas por qualquer período de tempo, defina `group_replication_autorejoin_tries` para 0. Para mais informações sobre o recurso de reinício automático e considerações ao escolher um valor para esta opção, consulte a Seção 20.7.7.3, “Reinício Automático”.

* `group_replication_bootstrap_group`

<table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_bootstrap_group</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  `group_replication_bootstrap_group` configura este servidor para bootstrapar o grupo. Esta variável do sistema deve ser definida *apenas* em um servidor e *apenas* ao iniciar o grupo pela primeira vez ou reiniciá-lo completamente. Após o grupo ter sido bootstrapado, defina esta opção para `OFF`. Deve ser definida para `OFF` tanto dinamicamente quanto nos arquivos de configuração. Iniciar dois servidores ou reiniciar um servidor com esta opção definida enquanto o grupo está em execução pode levar a uma situação de cérebro artificial, onde dois grupos independentes com o mesmo nome são bootstrapados.

  Para instruções sobre como bootstrapar um grupo pela primeira vez, consulte a Seção 20.2.1.5, “Bootstrap do Grupo”. Para instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

* `group_replication_clone_threshold`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_clone_threshold` especifica a lacuna de transações, em número de transações, entre o membro existente (doador) e o membro que está se juntando (receptor), que desencadeia o uso de uma operação de clonagem remota para a transferência de estado para o membro que está se juntando durante o processo de recuperação distribuída. Se a lacuna de transações entre o membro que está se juntando e um doador adequado exceder o limite, a Replicação em Grupo começa a recuperação distribuída com uma operação de clonagem remota. Se a lacuna de transações estiver abaixo do limite ou se a operação de clonagem remota não for tecnicamente possível, a Replicação em Grupo prossegue diretamente para a transferência de estado do log binário de um doador.

Aviso

Não use um valor baixo para `group_replication_clone_threshold` em um grupo ativo. Se um número de transações acima do limite ocorrer no grupo enquanto a operação de clonagem remota estiver em andamento, o membro que está se juntando aciona novamente uma operação de clonagem remota após o reinício e pode continuar isso indefinidamente. Para evitar essa situação, certifique-se de definir o limite para um número maior do que o número de transações que você esperaria ocorrer no grupo durante o tempo necessário para a operação de clonagem remota.

Para usar essa função, tanto o doador quanto o membro que está se juntando devem ser configurados previamente para suportar o clonagem. Para obter instruções, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”. Quando uma operação de clonagem remota é realizada, a Replicação em Grupo gerencia isso por você, incluindo o reinício do servidor necessário, desde que `group_replication_start_on_boot=ON` esteja configurado. Se não estiver, você deve reiniciar o servidor manualmente. A operação de clonagem remota substitui o dicionário de dados existente no membro que está se juntando, mas a Replicação em Grupo verifica e não prossegue se o membro que está se juntando tiver transações adicionais que não estão presentes nos outros membros do grupo, porque essas transações seriam apagadas pela operação de clonagem.

A configuração padrão (que é o número de sequência máximo permitido para uma transação em um GTID) significa que a transferência de estado de um log binário do doador é praticamente sempre tentada em vez de clonagem. No entanto, note que a Replicação em Grupo sempre tenta executar uma operação de clonagem, independentemente do seu limiar, se a transferência de estado de um log binário do doador for impossível, por exemplo, porque as transações necessárias pelo membro que está se juntando não estão disponíveis nos logs binários de nenhum membro do grupo existente. Se você não quiser usar clonagem em seu grupo de replicação, não instale o plugin clone nos membros.

* `group_replication_communication_debug_options`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_communication_debug_options` configura o nível de mensagens de depuração para fornecer para os diferentes componentes da Replicação em Grupo, como o Sistema de Comunicação do Grupo (GCS) e o motor de comunicação em grupo (XCom, uma variante do Paxos). As informações de depuração são armazenadas no arquivo `GCS_DEBUG_TRACE` no diretório de dados.

O conjunto de opções disponíveis, especificadas como strings, pode ser combinado. As seguintes opções estão disponíveis:

+ `GCS_DEBUG_NONE` desativa todos os níveis de depuração para o GCS e o XCom.

+ `GCS_DEBUG_BASIC` habilita informações básicas de depuração no GCS.

+ `GCS_DEBUG_TRACE` habilita informações de rastreamento no GCS.

+ `XCOM_DEBUG_BASIC` habilita informações básicas de depuração no XCom.

+ `XCOM_DEBUG_TRACE` habilita informações de rastreamento no XCom.

+ `GCS_DEBUG_ALL` habilita todos os níveis de depuração para o GCS e o XCom.

Definir o nível de depuração para `GCS_DEBUG_NONE` só tem efeito quando fornecido sem nenhuma outra opção. Definir o nível de depuração para `GCS_DEBUG_ALL` substitui todas as outras opções.

* `group_replication_communication_max_message_size`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_communication_max_message_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10485760</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Esta variável do sistema deve ter o mesmo valor em todos os membros do grupo. Você não pode alterar o valor desta variável do sistema enquanto a Replicação em Grupo estiver em execução. Você deve parar a Replicação em Grupo, alterar o valor da variável do sistema, e depois reiniciar a Replicação em Grupo, em cada um dos membros do grupo. Durante esse processo, o valor da variável do sistema pode diferir entre os membros do grupo, mas algumas transações nos membros do grupo podem ser revertidas.

`group_replication_communication_max_message_size` especifica um tamanho máximo de mensagem para as comunicações de Replicação em Grupo. Mensagens maiores que esse tamanho são automaticamente divididas em fragmentos que são enviados separadamente e reensamblados pelos destinatários. Para mais informações, consulte a Seção 20.7.5, “Fragmentação de Mensagens”.

Um tamanho máximo de mensagem de 10485760 bytes (10 MiB) é definido por padrão, o que significa que a fragmentação é usada por padrão. O maior valor permitido é o mesmo que o valor máximo da variável de sistema `replica_max_allowed_packet`, que é de 1073741824 bytes (1 GB). `group_replication_communication_max_message_size` deve ser menor que `replica_max_allowed_packet`, porque o thread aplicante não pode lidar com fragmentos de mensagem maiores que o tamanho máximo do pacote permitido. Para desativar a fragmentação, defina `group_replication_communication_max_message_size` para `0`.

Para que os membros de um grupo de replicação usem a fragmentação, a versão do protocolo de comunicação do grupo deve ser 8.0.16 ou posterior. Use a função `group_replication_get_communication_protocol()` para visualizar a versão do protocolo de comunicação do grupo. Se estiver sendo usada uma versão inferior, os membros do grupo não fragmentam as mensagens. Você pode usar a função `group_replication_set_communication_protocol()` para definir o protocolo de comunicação do grupo para uma versão mais alta, se todos os membros do grupo a suportarem. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

* `group_replication_communication_stack`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_communication_stack"><tbody><tr><th>Variável do Sistema</th> <td><code>group_replication_communication_stack</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>XCOM</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>XCOM</code></code><p><code>MYSQL</code></td> </tr></tbody></table>

  Nota

  Esta variável do sistema é efetivamente um ajuste de configuração para todo o grupo; embora possa ser configurada em tempo de execução, é necessário um reinício completo do grupo de replicação para que qualquer alteração tenha efeito.

  `group_replication_communication_stack` especifica se a pilha de comunicação XCom ou a pilha de comunicação MySQL deve ser usada para estabelecer conexões de comunicação entre os membros do grupo. A pilha de comunicação XCom é a implementação própria da Replicação em Grupo e não suporta autenticação ou namespaces de rede. A pilha de comunicação MySQL é a implementação nativa do MySQL Server, com suporte para autenticação e namespaces de rede, e acesso a novas funções de segurança imediatamente após o lançamento. Todos os membros de um grupo devem usar a mesma pilha de comunicação.

Quando você usa a pilha de comunicação MySQL em vez do XCom, o MySQL Server estabelece cada conexão entre os membros do grupo usando seus próprios protocolos de autenticação e criptografia.

Nota

Se você estiver usando o InnoDB Cluster, o valor padrão de `group_replication_communication_stack` é `MYSQL`.

Para mais informações, consulte MySQL InnoDB Cluster.

Configuração adicional é necessária ao configurar um grupo para usar a pilha de comunicação do MySQL; consulte Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

`group_replication_communication_stack` é efetivamente um ajuste de configuração para todo o grupo, e o ajuste deve ser o mesmo em todos os membros do grupo. No entanto, isso não é verificado pelos próprios controles da Replicação de Grupo para ajustes de configuração para todo o grupo. Um membro com um valor diferente do restante do grupo não pode se comunicar com os outros membros, porque os protocolos de comunicação são incompatíveis, então não pode trocar informações sobre seus ajustes de configuração.

Isso significa que, embora o valor da variável do sistema possa ser alterado enquanto a Replicação de Grupo está em execução e tenha efeito após você reiniciar a Replicação de Grupo no membro do grupo, o membro ainda não pode se reiniciar no grupo até que o ajuste tenha sido alterado em todos os membros. Portanto, você deve parar a Replicação de Grupo em todos os membros e alterar o valor da variável do sistema neles antes de poder reiniciar o grupo. Como todos os membros estão parados, é necessário um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração de valor tenha efeito. Para instruções de migração de uma pilha de comunicação para outra, consulte Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

* `group_replication_components_stop_timeout`

  <table frame="box" rules="all" summary="Propriedades para `group_replication_components_stop_timeout`"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_components_stop_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>300</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>2</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo está em execução, mas a alteração só entra em vigor após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_components_stop_timeout` especifica o tempo, em segundos, durante o qual a Replicação em Grupo espera que cada um de seus módulos complete os processos em andamento durante a desativação. O tempo limite do componente aplica-se após a emissão de uma declaração `STOP GROUP_REPLICATION`, que acontece automaticamente durante o reinício do servidor ou a reinserção automática.

O tempo de espera é usado para resolver situações em que os componentes da Replicação em Grupo não podem ser interrompidos normalmente, o que pode acontecer se um membro for expulso do grupo enquanto ele estiver em um estado de erro, ou enquanto um processo como o MySQL Enterprise Backup estiver segurando um bloqueio global nas tabelas do membro. Nessas situações, o membro não pode interromper o thread do aplicável ou completar o processo de recuperação distribuída para se reiniciar. `STOP GROUP_REPLICATION` não é concluído até que a situação seja resolvida (por exemplo, ao liberar o bloqueio) ou o tempo de espera do componente expire e os módulos sejam desligados, independentemente de seu status.

O valor padrão é de 300 segundos, para que os componentes da Replicação em Grupo sejam interrompidos após 5 minutos, se a situação não for resolvida antes desse tempo, permitindo que o membro seja reiniciado e se reinicie.

* `group_replication_compression_threshold`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_compression_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-compression-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_compression_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1000000</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

O valor do limiar em bytes acima do qual a compressão é aplicada às mensagens enviadas entre os membros do grupo. Se esta variável do sistema for definida como zero, a compressão é desativada. O valor de `group_replication_compression_threshold` deve ser o mesmo em todos os membros do grupo.

A replicação em grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é igual ao tamanho máximo de mensagem aceito pelo XCom. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`, pois as transações acima desse tamanho não podem ser confirmadas quando a compressão de mensagens está habilitada.

Para mais informações, consulte a Seção 20.7.4, “Compressão de Mensagens”.

* `group_replication_consistency`

  <table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>7</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></table>

`group_replication_consistency` é uma variável de sistema do servidor, e não uma variável específica do plugin de Replicação por Grupo, portanto, não é necessário reiniciar a Replicação por Grupo para que a mudança entre em vigor. A alteração do valor da sessão da variável de sistema tem efeito imediatamente, e a alteração do valor global tem efeito para novas sessões que começam após a mudança. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para alterar o ajuste global para essa variável de sistema.

`group_replication_consistency` determina a garantia de consistência da transação que um grupo fornece; isso pode ser feito globalmente ou por transação. `group_replication_consistency` também determina o mecanismo de vedação usado pelos primários recém-eleitos em grupos de primários únicos. O efeito da variável deve ser considerado tanto para transações de leitura apenas quanto para transações de leitura/escrita. A lista a seguir mostra os possíveis valores dessa variável, em ordem crescente de garantia de consistência da transação:

  + `EVENTUAL`

    Nem transações de leitura apenas nem transações de leitura/escrita esperam que transações anteriores sejam aplicadas antes de serem executadas. (Antes que essa variável fosse adicionada, esse era o comportamento padrão.) Uma transação de leitura/escrita não espera que outros membros apliquem uma transação. Isso significa que uma transação pode ser externalizada em um membro antes dos outros. Isso também significa que, em caso de falha de failover do primário, o novo primário pode aceitar novas transações de leitura apenas antes que as transações do primário anterior tenham sido aplicadas, embora transações de leitura/escrita não sejam permitidas.

  + `BEFORE_ON_PRIMARY_FAILOVER`

Novas transações de leitura/escrita com um primário recém-eleito que está aplicando um atraso do primário antigo não são aplicadas até que qualquer atraso seja aplicado. Isso garante que, em caso de falha no primário, os clientes sempre vejam o valor mais recente no primário, independentemente de o falhamento ser intencional. Isso garante consistência, mas significa que os clientes devem ser capazes de lidar com o atraso no caso de um atraso estar sendo aplicado. O tempo desse atraso depende do tamanho do atraso em processamento, mas geralmente não é grande.

+ `ANTES`

    Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas antes de ser aplicada. Uma transação de leitura apenas aguarda que todas as transações anteriores sejam concluídas antes de ser executada. Isso garante que essa transação leia o valor mais recente, afetando apenas a latência da transação. Isso reduz qualquer overhead de sincronização, garantindo que seja usado apenas em transações de leitura apenas. Esse nível de consistência também inclui as garantias de consistência fornecidas por `ANTES_EM_FALHA_NO_PRIMÁRIO`.

+ `DEPOIS`

    Uma transação de leitura/escrita aguarda que suas alterações sejam aplicadas a todos os outros membros. Esse valor não tem efeito em transações de leitura apenas e garante que, quando uma transação é comprometida no membro local, qualquer transação subsequente leia o valor escrito ou um valor mais recente em qualquer membro do grupo. Isso significa que as transações de leitura apenas nos outros membros permanecem não comprometidas até que todas as transações anteriores sejam comprometidas, aumentando a latência da transação afetada.

Use este modo com um grupo destinado principalmente a operações de leitura apenas para garantir que quaisquer transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas. Isso pode ser usado por sua aplicação para garantir que leituras subsequentes obtenham os dados mais recentes, incluindo as escritas mais recentes. Isso reduz qualquer sobrecarga da sincronização, garantindo que a sincronização seja usada apenas para transações de leitura/escrita.

`AFTER` inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

+ `BEFORE_AND_AFTER`

Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas e que todas as suas alterações sejam aplicadas em todos os outros membros antes de ser aplicada. Uma transação de leitura apenas aguarda que todas as transações anteriores sejam concluídas antes da execução. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

Para mais informações, consulte a Seção 20.5.3, “Garantias de Consistência de Transações”.

* `group_replication_elect_prefers_most_updated.enabled`

<table frame="box" rules="all" summary="Propriedades para o componente Group Replication auto-incremento">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--group-replication-auto-increment-increment=#</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>group_replication_auto_increment_increment</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>7</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  Se o componente de Eleição Primária de Replicação de Grupo está habilitado neste servidor. Todos os membros do grupo devem tê-lo habilitado (definido como `ON`) para que o mecanismo de seleção primária mais atualizado funcione corretamente. Se algum membro o desabilitar ou se algum membro não o suportar, a seleção primária será baseada nos pesos dos membros.

  Fornecido pelo componente de Eleição Primária de Replicação de Grupo, parte da Edição Empresarial do MySQL. Consulte a Seção 7.5.6.4, “Componente de Eleição Primária de Replicação de Grupo”, para obter mais informações.

* `group_replication_enforce_update_everywhere_checks`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Sim</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>7</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>1</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>65535</code></td> </tr>
    </tr>
  </table>

  Observação

  Esta variável do sistema é um ajuste de configuração para todo o grupo, e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  A opção `group_replication_enforce_update_everywhere_checks` habilita ou desabilita verificações de consistência rigorosas para a atualização multi-primário em todo lugar. O padrão é que as verificações estejam desativadas. No modo de único primário, esta opção deve ser desativada em todos os membros do grupo. No modo multi-primário, quando esta opção está habilitada, as instruções são verificadas da seguinte forma para garantir que sejam compatíveis com o modo multi-primário:

  + Se uma transação for executada com o nível de isolamento `SERIALIZABLE`, seu commit falhará ao se sincronizar com o grupo.

+ Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, a transação não será confirmada ao se sincronizar com o grupo.

Esta variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração de valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura onde transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se o grupo tiver um valor definido para esta variável de sistema e um membro que está se juntando tiver um valor diferente definido para a variável de sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para corresponder. Se os membros do grupo tiverem um valor definido para esta variável de sistema e o membro que está se juntando não suportar a variável de sistema, ele não poderá se juntar ao grupo.

Use as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar o valor desta variável de sistema enquanto o grupo ainda estiver em execução. Para obter mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”.

* `group_replication_exit_state_action`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente. O valor atual da variável do sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

`group_replication_exit_state_action` configura como a Replicação em Grupo se comporta quando essa instância do servidor sai do grupo involuntariamente, por exemplo, após encontrar um erro de aplicável, ou no caso de uma perda da maioria, ou quando outro membro do grupo o expulsa devido a uma suspeita que vence. O período de tempo para um membro sair do grupo no caso de uma perda da maioria é definido pela variável de sistema `group_replication_unreachable_majority_timeout`, e o período de tempo para as suspeitas é definido pela variável de sistema `group_replication_member_expel_timeout`. Note que um membro expulso do grupo não sabe que foi expulso até se reconectar ao grupo, então a ação especificada é realizada apenas se o membro conseguir se reconectar, ou se o membro levantar uma suspeita sobre si mesmo e se expulsar.

Quando um membro do grupo é expulso devido a uma suspeita que vence ou uma perda da maioria, se o membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de auto-rejoin, ele faz primeiro o número especificado de tentativas enquanto estiver no modo de leitura apenas super, e depois segue a ação especificada por `group_replication_exit_state_action`. As tentativas de auto-rejoin não são feitas no caso de um erro de aplicável, porque essas não são recuperáveis.

Quando `group_replication_exit_state_action` é definido como `READ_ONLY`, se o membro sair do grupo involuntariamente ou esgotar suas tentativas de auto-rejoin, a instância muda o MySQL para o modo de leitura apenas super (definindo a variável de sistema `super_read_only` para `ON`).

Quando `group_replication_exit_state_action` está definido como `OFFLINE_MODE`, se o membro sair do grupo involuntariamente ou esgotar suas tentativas de auto-reunificação, a instância muda o MySQL para o modo offline (definindo a variável de sistema `offline_mode` para `ON`). Nesse modo, os usuários clientes conectados são desconectados na próxima solicitação e as conexões não são mais aceitas, com exceção dos usuários clientes que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio `SUPER`, desatualizado). A Replicação de Grupo também define a variável de sistema `super_read_only` para `ON`, para que os clientes não possam fazer quaisquer atualizações, mesmo que tenham se conectado com o privilégio `CONNECTION_ADMIN` ou `SUPER`.

Quando `group_replication_exit_state_action` está definido como `ABORT_SERVER`, se o membro sair do grupo involuntariamente ou esgotar suas tentativas de auto-reunificação, a instância para de usar o MySQL.

Importante

Se uma falha ocorrer antes que o membro tenha se juntado com sucesso ao grupo, a ação de saída especificada *não é executada*. Esse é o caso se houver uma falha durante a verificação de configuração local ou se houver um desajuste entre a configuração do membro que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema `super_read_only` é deixada com seu valor original, as conexões continuam sendo aceitas e o servidor não desliga o MySQL. Para garantir que o servidor não aceite atualizações quando a Replicação de Grupo não foi iniciada, recomendamos que `super_read_only=ON` seja definido no arquivo de configuração do servidor ao iniciar, o que a Replicação de Grupo altera para `OFF` nos membros primários após ter sido iniciada com sucesso. Essa proteção é particularmente importante quando o servidor é configurado para iniciar a Replicação de Grupo ao inicializar o servidor (`group_replication_start_on_boot=ON`), mas também é útil quando a Replicação de Grupo é iniciada manualmente usando um comando `START GROUP_REPLICATION`.

Para obter mais informações sobre o uso dessa opção e a lista completa de situações em que a ação de saída é executada, consulte a Seção 20.7.7.4, “Ação de Saída”.

* `group_replication_flow_control_applier_threshold`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_flow_control_applier_threshold` especifica o número de transações em espera na fila de aplicadores que desencadeiam o controle de fluxo.

* `group_replication_flow_control_certifier_threshold`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

  `group_replication_flow_control_certifier_threshold` especifica o número de transações em espera na fila de certificadores que desencadeiam o controle de fluxo.

* `group_replication_flow_control_hold_percent`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hint de Configuração de <code>SET_VAR</code></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

  `group_replication_flow_control_hold_percent` define que porcentagem da quota do grupo permanece não utilizada para permitir que um cluster sob controle de fluxo recupere o atraso. Um valor de 0 implica que nenhuma parte da quota é reservada para recuperar o trabalho em atraso.

* `group_replication_flow_control_max_quota`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-auto-increment-increment=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_auto_increment_increment</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>7</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>1</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

  `group_replication_flow_control_max_quota` define a quota de controle de fluxo do grupo, ou a quota disponível máxima para qualquer período enquanto o controle de fluxo estiver habilitado. Um valor de 0 implica que não há cotas máximas definidas. O valor desta variável do sistema não pode ser menor que `group_replication_flow_control_min_quota` e `group_replication_flow_control_min_recovery_quota`.

* `group_replication_flow_control_member_quota_percent`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_flow_control_member_quota_percent` define a porcentagem da quota que um membro deve assumir que está disponível para si mesmo ao calcular as cotas. Um valor de 0 implica que a quota deve ser dividida igualmente entre os membros que foram escritores no último período.

* `group_replication_flow_control_min_quota`

<table frame="box" rules="all" summary="Propriedades para group_replication_auto_increment_increment">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_auto_increment_increment</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>7</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

A variável `group_replication_flow_control_min_quota` controla a menor quota de controle de fluxo que pode ser atribuída a um membro, independentemente da quota mínima calculada executada no último período. Um valor de 0 implica que não há quota mínima. O valor desta variável do sistema não pode ser maior que `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_min_recovery_quota`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

O `group_replication_flow_control_min_recovery_quota` controla a menor quota que pode ser atribuída a um membro devido a outro membro em recuperação no grupo, independentemente da quota mínima calculada executada no último período. Um valor de 0 implica que não há quota mínima. O valor desta variável do sistema não pode ser maior que `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_mode`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Sim</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>3</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>2016</code></td> </tr>
    </tr>
  </table>
1. O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_flow_control_mode` especifica o modo usado para o controle de fluxo.

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_flow_control_period` define quantos segundos esperar entre as iterações de controle de fluxo, nos quais os mensagens de controle de fluxo são enviadas e as tarefas de gerenciamento de controle de fluxo são executadas.

* `group_replication_flow_control_release_percent`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente.

`group_replication_flow_control_release_percent` define como a quota do grupo deve ser liberada quando o controle de fluxo não precisar mais restringir os membros do escritor, com este percentual sendo o aumento da quota por período de controle de fluxo. Um valor de 0 implica que, uma vez que os limites do controle de fluxo estejam dentro dos limites, a quota é liberada em uma única iteração de controle de fluxo. A faixa permite que a quota seja liberada em até 10 vezes a quota atual, pois isso permite um maior grau de adaptação, principalmente quando o período de controle de fluxo é grande e as cotas são muito pequenas.

* `group_replication_force_members`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

  Esta variável do sistema é usada para forçar uma nova adesão ao grupo. O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente. Você só precisa definir o valor da variável do sistema em um dos membros do grupo que permanecerá no grupo. Para obter detalhes sobre a situação em que você pode precisar forçar uma nova adesão ao grupo e um procedimento a seguir ao usar esta variável do sistema, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

`group_replication_force_members` especifica uma lista de endereços de pares como uma lista separada por vírgula, como `host1:port1`, `host2:port2`. Qualquer membro existente que não esteja na lista não receberá uma nova visualização do grupo e será bloqueado. Para cada membro existente que deve continuar como membro, você deve incluir o endereço IP ou o nome do host e a porta, conforme fornecidos na variável de sistema `group_replication_local_address` para cada membro. Um endereço IPv6 deve ser especificado entre colchetes. Por exemplo:

  ```
  "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061,example.org:33061"
  ```

  O motor de comunicação de grupo para a Replicação de Grupo (XCom) verifica se os endereços IP fornecidos estão em um formato válido e se você não incluiu nenhum membro do grupo que atualmente não é alcançável. Caso contrário, a nova configuração não será validada, então você deve ter cuidado para incluir apenas servidores online que são membros alcançáveis do grupo. Valores incorretos ou nomes de host inválidos na lista podem fazer com que o grupo seja bloqueado com uma configuração inválida.

  É importante antes de forçar uma nova configuração de associação de grupo garantir que os servidores a serem excluídos tenham sido desligados. Se não estiverem, desligue-os antes de prosseguir. Membros do grupo que ainda estão online podem formar automaticamente novas configurações, e se isso já tiver ocorrido, forçar uma nova configuração adicional pode criar uma situação de split-brain artificial para o grupo.

  Depois de usar a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova associação de grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. `group_replication_force_members` deve estar vazio para emitir uma declaração `START GROUP_REPLICATION`.

* `group_replication_group_name`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr>
    <th>Formato de linha de comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
    <tr>
      <th>Variável do sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Sim</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <code>SET_VAR</th></td> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor padrão</th> <td><code>3</code></td> </tr>
    </tr>
    <tr>
      <th>Valor mínimo</th> <td><code>0</code></td> </tr>
    </tr>
    <tr>
      <th>Valor máximo</th> <td><code>2016</code></td> </tr>
    </tr>
  </table>

  O valor desta variável do sistema não pode ser alterado enquanto a Replicação em Grupo estiver em execução.

  `group_replication_group_name` especifica o nome do grupo ao qual essa instância do servidor pertence, que deve ser um UUID válido. Esse UUID faz parte dos GTIDs que são usados quando as transações recebidas pelos membros do grupo de clientes e os eventos de alteração de visualização que são gerados internamente pelos membros do grupo são escritos no log binário.

  Importante

  Deve-se usar um UUID único.

* `group_replication_group_seeds`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_group_seeds` é uma lista de membros do grupo aos quais um membro que se junta pode se conectar para obter detalhes de todos os membros atuais do grupo. O membro que se junta usa esses detalhes para selecionar e se conectar a um membro do grupo para obter os dados necessários para a sincronização com o grupo. A lista consiste em um único endereço de rede interno ou nome de host para cada membro de semente incluído, conforme configurado na variável de sistema `group_replication_local_address` do membro de semente (não a conexão do cliente SQL do membro de semente, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server). Os endereços dos membros de semente são especificados como uma lista separada por vírgula, como `host1:port1`, `host2:port2`. Um endereço IPv6 deve ser especificado entre colchetes. Por exemplo:

  ```
  group_replication_group_seeds= "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061, example.org:33061"
  ```

  Observe que o valor que você especifica para essa variável não é validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

  Normalmente, essa lista consiste em todos os membros do grupo, mas você pode escolher um subconjunto dos membros do grupo para serem sementes. A lista deve conter pelo menos um endereço de membro válido. Cada endereço é validado ao iniciar a Replicação do Grupo. Se a lista não contiver nenhum endereço de membro válido, a emissão de `START GROUP_REPLICATION` falha.

Quando um servidor está se juntando a um grupo de replicação, ele tenta se conectar ao primeiro membro inicial listado na sua variável de sistema `group_replication_group_seeds`. Se a conexão for recusada, o membro que está se juntando tenta se conectar a cada um dos outros membros iniciais na lista em ordem. Se o membro que está se juntando se conectar a um membro inicial, mas não for adicionado ao grupo de replicação como resultado (por exemplo, porque o membro inicial não tem o endereço do membro que está se juntando em sua allowlist e fecha a conexão), o membro que está se juntando continua tentando os membros iniciais restantes na lista em ordem.

Um membro que está se juntando deve se comunicar com o membro inicial usando o mesmo protocolo (IPv4 ou IPv6) que o membro inicial anuncia na opção `group_replication_group_seeds`. Para fins de permissões de endereço IP para a Replicação em Grupo, a allowlist no membro inicial deve incluir um endereço IP para o membro que está se juntando para o protocolo oferecido pelo membro inicial, ou um nome de host que resolva para um endereço para esse protocolo. Esse endereço ou nome de host deve ser configurado e permitido além do `group_replication_local_address` do membro que está se juntando, se o protocolo para esse endereço não corresponder ao protocolo anunciado pelo membro inicial. Se um membro que está se juntando não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP para Replicação em Grupo”.

* `group_replication_gtid_assignment_block_size`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Sim</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>3</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    </tr>
    <tr>
      <th>Valor Máximo</th> <td><code>2016</code></td> </tr>
    </tr>
  </table>
7

  Nota

  Esta variável do sistema é uma configuração de nível de grupo e é necessário reiniciar completamente o grupo de replicação para que a mudança entre em vigor.

  `group_replication_gtid_assignment_block_size` especifica o número de GTIDs consecutivos reservados para cada membro do grupo. Cada membro consome seus próprios blocos e reserva mais quando necessário.

Esta variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se o grupo tiver um valor definido para essa variável de sistema e um membro que está se juntando tiver um valor diferente definido para a variável de sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para corresponder. Se os membros do grupo tiverem um valor definido para essa variável de sistema e o membro que está se juntando não suportar a variável de sistema, ele não poderá se juntar ao grupo.

* `group_replication_ip_allowlist`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

`group_replication_ip_allowlist` especifica quais hosts são permitidos para se conectar ao grupo. Quando a pilha de comunicação XCom está em uso para o grupo (`group_replication_communication_stack=XCOM`), a allowlist é usada para controlar o acesso ao grupo. Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack=MYSQL`), a autenticação de usuário é usada para controlar o acesso ao grupo, e a allowlist não é usada e é ignorada se definida.

O endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve ser permitido nos outros servidores do grupo de replicação. Note que o valor que você especificar para essa variável não é validado até que uma instrução `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação de Grupo (GCS) esteja disponível.

Por padrão, essa variável do sistema é definida como `AUTOMATIC`, o que permite conexões de sub-redes privadas ativas no host. O motor de comunicação de grupo para a Replicação de Grupo (XCom) escaneia automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas. Esses endereços e o endereço IP `localhost` para IPv4 e IPv6 são usados para criar a lista de permissões de endereço de IP da Replicação de Grupo. Para uma lista dos intervalos a partir dos quais os endereços são permitidos automaticamente, consulte a Seção 20.6.4, “Permissões de Endereço de IP da Replicação de Grupo”.

A lista de permissões de endereços privados automática não pode ser usada para conexões de servidores fora da rede privada. Para conexões de Replicação de Grupo entre instâncias de servidor que estão em máquinas diferentes, você deve fornecer endereços IP públicos e especiá-los como uma lista explícita de permissões. Se você especificar qualquer entrada para a lista de permissões, os endereços privados não são adicionados automaticamente, então, se você usar qualquer um deles, você deve especiá-los explicitamente. Os endereços IP `localhost` são adicionados automaticamente.

Como valor da opção `group_replication_ip_allowlist`, você pode especificar qualquer combinação dos seguintes:

+ Endereços IPv4 (por exemplo, `198.51.100.44`)

+ Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

+ Endereços IPv6 (por exemplo, `2001:db8:85a3:8d3:1319:8a2e:370:7348`)

+ Endereços IPv6 usando notação CIDR (por exemplo, `2001:db8:85a3:8d3::/64`)

+ Nomes de host (por exemplo, `example.org`)
  + Nomes de host com notação CIDR (por exemplo, `www.example.com/24`)

Os nomes de host podem ser resolvidos em endereços IPv4, endereços IPv6 ou em ambos. Se um nome de host for resolvido em um endereço IPv4 e um endereço IPv6, o endereço IPv4 é sempre usado para conexões de Replicação em Grupo. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas você deve garantir que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

```
  "192.0.2.21/24,198.51.100.44,203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,example.org,www.example.com/24"
  ```

Se algum dos membros da semente para o grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6 quando um membro de adesão tiver um `group_replication_local_address` IPv4, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro de adesão para o protocolo oferecido pelo membro da semente (ou um nome de host que seja resolvido em um endereço para esse protocolo). Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP de Replicação em Grupo”.

É possível configurar diferentes allowlists em diferentes membros do grupo de acordo com seus requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. No entanto, isso pode causar problemas quando um grupo é reconfigurado. Se você não tiver um requisito de segurança específico para fazer o contrário, use a mesma allowlist em todos os membros de um grupo. Para mais detalhes, consulte a Seção 20.6.4, “Permissões de Endereço IP de Replicação em Grupo”.

Para nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação do allowlist, e uma mensagem de aviso é escrita no log de erro. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Nomes de host são inerentemente menos seguros do que endereços IP em um allowlist. A verificação FCrDNS fornece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de host em seu allowlist apenas quando estritamente necessário, e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.

* `group_replication_local_address`

<table frame="box" rules="all" summary="Propriedades para group_replication_autorejoin_tries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-autorejoin-tries=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_autorejoin_tries</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2016</code></td> </tr>
</table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_local_address` define o endereço de rede que o membro fornece para conexões de outros membros, especificado como uma string formatada `host:port`. Este endereço deve ser acessível por todos os membros do grupo, pois é usado pelo motor de comunicação do grupo para a Replicação do Grupo (XCom, uma variante do Paxos) para comunicação TCP entre instâncias remotas do XCom. Se você estiver usando a pilha de comunicação MySQL para estabelecer conexões de comunicação de grupo entre membros (`group_replication_communication_stack` = MYSQL), o endereço deve ser um dos endereços IP e portas onde o MySQL Server está ouvindo, conforme especificado pela variável de sistema `bind_address` para o servidor.

Aviso

Não use este endereço para consultar ou administrar os bancos de dados no membro. Este não é o host e a porta de conexão do cliente SQL.

O endereço ou nome de host que você especificar em `group_replication_local_address` é usado pela Replicação do Grupo como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar a mesma porta para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, e você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que as portas sejam todas diferentes. O port recomendado para `group_replication_local_address` é 33061. Note que o valor que você especificar para esta variável não é validado até que a instrução `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível por meio de DNS, arquivos `/etc/hosts` corretamente configurados ou outros processos de resolução de nomes. Um endereço IPv6 deve ser especificado entre colchetes para distinguir o número da porta, por exemplo:

  ```
  group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
  ```

  Se um nome de host especificado como o endereço local de replicação de grupo para uma instância do servidor resolver tanto para um endereço IPv4 quanto para um endereço IPv6, o endereço IPv4 é sempre usado para conexões de replicação de grupo. Para obter mais informações sobre o suporte da replicação de grupo para redes IPv6 e sobre grupos de replicação com uma mistura de membros que usam IPv4 e membros que usam IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4”.

Se você estiver usando a pilha de comunicação XCom para estabelecer conexões de comunicação de grupo entre os membros (`group_replication_communication_stack = XCOM`), o endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve ser adicionado à lista da variável de sistema `group_replication_ip_allowlist` nos outros servidores do grupo de replicação. Quando a pilha de comunicação XCom estiver em uso para o grupo, a allowlist será usada para controlar o acesso ao grupo. Quando a pilha de comunicação MySQL estiver em uso para o grupo, a autenticação de usuário será usada para controlar o acesso ao grupo, e a allowlist não será usada e será ignorada se definida. Se algum dos membros iniciais do grupo estiver listado em `group_replication_group_seeds` com um endereço IPv6 quando esse membro tiver um `group_replication_local_address` IPv4, ou vice-versa, você também deve configurar e permitir um endereço alternativo para esse membro para o protocolo necessário (ou um nome de host que resolva para um endereço para esse protocolo). Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP de Replicação de Grupo”.

<table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_bootstrap_group</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto o Group Replication estiver em execução, e a alteração entra em vigor imediatamente. O valor atual da variável do sistema é lido sempre que o Group Replication verifica o tempo de espera. Não é obrigatório que todos os membros de um grupo tenham a mesma configuração, mas é recomendado para evitar expulsões inesperadas.

`group_replication_member_expel_timeout` especifica o período de tempo em segundos que um membro do grupo de Replicação do Grupo espera após criar uma suspeita, antes de expulsar do grupo o membro suspeito de ter falhado. O período de detecção inicial de 5 segundos antes de uma suspeita ser criada não é contado como parte desse tempo. O valor de `group_replication_member_expel_timeout` tem o valor padrão de 5, o que significa que um membro suspeito é responsável pela expulsão 5 segundos após o período de detecção de 5 segundos.

A alteração do valor de `group_replication_member_expel_timeout` em um membro do grupo entra em vigor imediatamente para suspeitas existentes e futuras desse membro do grupo. Portanto, você pode usar isso como um método para forçar a expiração de uma suspeita e expulsar um membro suspeito, permitindo alterações na configuração do grupo. Para mais informações, consulte a Seção 20.7.7.1, “Expiração de Expulsão”.

O aumento do valor de `group_replication_member_expel_timeout` pode ajudar a evitar expulsões desnecessárias em redes mais lentas ou menos estáveis, ou no caso de interrupções transitórias esperadas na rede ou desacelerações da máquina. Se um membro suspeito se tornar ativo novamente antes da expiração da suspeita, ele aplica todas as mensagens que foram armazenadas pelos membros restantes do grupo e entra no estado `ONLINE`, sem intervenção do operador. Você pode especificar um valor de expiração de até 3600 segundos (1 hora). É importante garantir que o cache de mensagens do XCom seja suficientemente grande para conter o volume esperado de mensagens no seu período de tempo especificado, mais o período inicial de detecção de 5 segundos, caso contrário, os membros não poderão se reconectar. Você pode ajustar o limite de tamanho do cache usando a variável de sistema `group_replication_message_cache_size`. Para mais informações, consulte a Seção 20.7.6, “Gestão do Cache do XCom”.

Se o tempo limite for excedido, o membro suspeito fica sujeito à expulsão imediatamente após o tempo de suspeita expirar. Se o membro conseguir retomar as comunicações e receber uma notificação de expulsão, e o membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de auto-reinserção, ele prossegue com o número especificado de tentativas para se reinserir no grupo enquanto estiver no modo de leitura apenas por superusuário. Se o membro não tiver nenhuma tentativa de auto-reinserção definida ou se tiver esgotado o número especificado de tentativas, ele segue a ação especificada pela variável de sistema `group_replication_exit_state_action`.

Para obter mais informações sobre o uso da configuração `group_replication_member_expel_timeout`, consulte a Seção 20.7.7.1, “Tempo limite de expulsão”. Para estratégias alternativas de mitigação para evitar expulsões desnecessárias quando essa variável de sistema não estiver disponível, consulte a Seção 20.3.2, “Limitações da replicação em grupo”.

* `group_replication_member_weight`

<table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_bootstrap_group</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente. O valor atual da variável do sistema é lido quando ocorre uma situação de falha.

  `group_replication_member_weight` especifica um peso percentual que pode ser atribuído aos membros para influenciar a chance de o membro ser eleito como primário no caso de uma falha, por exemplo, quando o primário existente deixa um grupo de único primário. Atribua pesos numéricos aos membros para garantir que membros específicos sejam eleitos, por exemplo, durante a manutenção programada do primário ou para garantir que certos equipamentos sejam priorizados no caso de uma falha.

  Para um grupo com membros configurados da seguinte forma:

  + `member-1`: group_replication_member_weight=30, server_uuid=aaaa

  + `member-2`: group_replication_member_weight=40, server_uuid=bbbb

+ `member-3`: group_replication_member_weight=40, server_uuid=cccc

+ `member-4`: group_replication_member_weight=40, server_uuid=dddd

Durante a eleição de um novo primário, os membros acima seriam classificados como `member-2`, `member-3`, `member-4` e `member-1`. Isso resulta em `member`-2 sendo escolhido como o novo primário no caso de falha de migração. Para mais informações, consulte a Seção 20.1.3.1, “Modo de Primário Único”.

* `group_replication_message_cache_size`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta variável do sistema deve ter o mesmo valor em todos os membros do grupo. O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução. A alteração entra em vigor em cada membro do grupo após você parar e reiniciar a Replicação em Grupo no membro. Durante esse processo, o valor da variável do sistema é permitido diferir entre os membros do grupo, mas os membros podem não conseguir se reconectar em caso de desconexão.

`group_replication_message_cache_size` define o tamanho máximo de memória disponível para o cache de mensagens no motor de comunicação de grupo para a Replicação de Grupo (XCom). O cache de mensagens do XCom armazena mensagens (e seus metadados) que são trocadas entre os membros do grupo como parte do protocolo de consenso. Entre outras funções, o cache de mensagens é usado para a recuperação de mensagens perdidas por membros que se reconectam ao grupo após um período em que não conseguiram se comunicar com os outros membros do grupo.

A variável de sistema `group_replication_member_expel_timeout` determina o período de espera (até uma hora) que é permitido, além do período inicial de detecção de 5 segundos, para que os membros retornem ao grupo em vez de serem expulsos. O tamanho do cache de mensagens do XCom deve ser definido com referência ao volume esperado de mensagens nesse período de tempo, para que ele contenha todas as mensagens perdidas necessárias para que os membros retornem com sucesso. O valor padrão é um período de espera de 5 segundos após o período de detecção de 5 segundos, para um período total de 10 segundos.

Certifique-se de que há memória suficiente disponível no seu sistema para o limite de tamanho de cache escolhido, considerando o tamanho dos outros caches e pools de objetos do servidor. O ajuste padrão é de 1073741824 bytes (1 GB). O ajuste mínimo de 134217728 bytes (128 MB) permite a implantação em um host que tem uma quantidade restrita de memória disponível e uma boa conectividade de rede para minimizar a frequência e a duração das perdas transitórias de conectividade para os membros do grupo. Note que o limite definido usando `group_replication_message_cache_size` aplica-se apenas aos dados armazenados no cache, e as estruturas do cache requerem um adicional de 50 MB de memória.

O limite de tamanho do cache pode ser aumentado ou reduzido dinamicamente durante a execução. Se você reduzir o limite de tamanho do cache, o XCom remove as entradas mais antigas que foram decididas e entregues até que o tamanho atual esteja abaixo do limite. O Sistema de Comunicação de Grupo (GCS) do Replicação em Grupo (Group Replication) o alerta, por meio de uma mensagem de aviso, quando uma mensagem que provavelmente será necessária para a recuperação por um membro que atualmente não é alcançável é removida do cache de mensagens. Para obter mais informações sobre o ajuste do tamanho do cache de mensagens, consulte a Seção 20.7.6, “Gestão do Cache do XCom”.

* `group_replication_paxos_single_leader`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Nota

  Esta variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

`group_replication_paxos_single_leader` permite que o motor de comunicação de grupo opere com um único líder de consenso quando o grupo está no modo de único primário. Com o ajuste padrão `OFF`, esse comportamento é desativado, e cada membro do grupo é usado como líder, que é o comportamento em versões anteriores do sistema antes que essa variável fosse disponível. Quando essa variável é definida como `ON`, o motor de comunicação de grupo pode usar um único líder para impulsionar o consenso. Operar com um único líder de consenso melhora o desempenho e a resiliência no modo de único primário, particularmente quando alguns dos membros secundários do grupo estão atualmente inacessíveis. Para mais informações, consulte a Seção 20.7.3, “Lider de Consenso Único”.

Para que o motor de comunicação de grupo use um único líder de consenso, a versão do protocolo de comunicação do grupo deve ser MySQL 8.0.27 ou posterior. Use `group_replication_get_communication_protocol()` para obter a versão do protocolo de comunicação do grupo. Se uma versão inferior estiver em uso, o grupo não pode usar esse comportamento. Você pode usar `group_replication_set_communication_protocol()` para definir o protocolo de comunicação para uma versão superior se todos os membros do grupo o suportarem. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

Esta variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração de valor seja efetiva. Para instruções sobre como bootstrap um grupo de forma segura onde transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciando um Grupo”.

Se o grupo tiver um valor definido para essa variável do sistema, e um membro que se junta tiver um valor diferente definido para a variável do sistema, o membro que se junta não poderá se juntar ao grupo até que o valor seja alterado para combinar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que se junta não suportar a variável do sistema, ele não poderá se juntar ao grupo.

A coluna `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE` da tabela `replication_group_communication_information` do Schema de Desempenho mostra se o grupo suporta o uso de um único líder, mesmo que `group_replication_paxos_single_leader` esteja atualmente definido como `OFF` no membro pesquisado. O valor da coluna é 1 se o grupo foi iniciado com `group_replication_paxos_single_leader` definido como `ON` e sua versão do protocolo de comunicação é MySQL 8.0.27 ou posterior.

* `group_replication_poll_spin_loops`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_poll_spin_loops` especifica o número de vezes que o thread de comunicação do grupo espera que o mutex do motor de comunicação seja liberado antes que o thread espere por mais mensagens de rede recebidas.

* `group_replication_preemptive_garbage_collection`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code></a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Ative a coleta de lixo preemptiva no modo de único primário (apenas), mantendo apenas os conjuntos de escrita para aquelas transações que ainda não foram comprometidas no banco de dados.

No modo de única replicação primária, é possível limpar os conjuntos de escrita para uma transação dada mais cedo do que no modo de múltiplas replicações primárias; isso ocorre porque os conflitos são detectados e gerenciados pelo gerenciador de bloqueio do banco de dados no servidor enquanto as transações estão sendo executadas; assim, os conjuntos de escrita são úteis apenas para calcular dependências entre transações e não para detecção de conflitos. Isso significa que os conjuntos de escrita podem ser limpos assim que a transação a qual pertencem for rastreada no módulo de dependência de transação de replicação em grupo e detecção de conflitos.

A limpeza agressiva dos conjuntos de escrita que é realizada quando o `group_replication_preemptive_garbage_collection` é habilitado tem os seguintes efeitos:

+ Redução da memória usada para manter os conjuntos de escrita na memória
+ Redução do impacto dos segundosários atrasados no rastreamento dos conjuntos de escrita no primário
+ Redução da quantidade de tempo que o bloqueio do banco de dados do conjunto de escrita é mantido por rodada de exclusão de conjuntos de escrita, e, assim, uma redução de seu impacto no desempenho

O valor de `group_replication_preemptive_garbage_collection` pode ser alterado apenas quando a replicação em grupo não está em execução e não tem efeito em um grupo que esteja em modo de múltiplas replicações primárias. Além disso, quando essa variável de sistema é habilitada, não é possível mudar entre o modo de múltiplas replicações primárias e o modo de única replicação primária (veja a Seção 20.5.1.2, “Mudando o Modo do Grupo”).

`group_replication_preemptive_garbage_collection` deve ser definido com o mesmo valor em todos os membros do grupo. O valor de `group_replication_preemptive_garbage_collection` de um novo aderente deve ser o mesmo dos membros atuais do grupo, caso contrário, ele não poderá aderir.

Um membro do grupo que executa uma versão do MySQL anterior a 8.4.0 não envia o valor `group_replication_preemptive_garbage_collection`; nesse caso, o valor é considerado como `OFF`.

* `group_replication_preemptive_garbage_collection_rows_threshold`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Quando a coleta de lixo preemptiva no modo de único primário é habilitada (`group_replication_preemptive_garbage_collection` é `ON`), este é o número de linhas de informações de certificação necessárias para desencadear seu uso.

  Esta variável não tem efeito em um grupo que está em modo multi-primário.

* `group_replication_recovery_compression_algorithms`

<table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>group_replication_bootstrap_group</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  `group_replication_recovery_compression_algorithms` especifica os algoritmos de compressão permitidos para as conexões de recuperação distribuída da Replicação em Grupo para a transferência de estado de um log binário do doador. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  Este ajuste não se aplica se o servidor tiver sido configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”) e uma operação de clonagem remota for usada durante a recuperação distribuída. Para este método de transferência de estado, a configuração `clone_enable_compression` do plugin de clonagem se aplica.

* `group_replication_recovery_get_public_key`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_get_public_key` especifica se solicitar ao ponto de origem a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Se `group_replication_recovery_public_key_path` for definido como um arquivo de chave pública válido, ele tem precedência sobre `group_replication_recovery_get_public_key`. Esta variável se aplica se você não estiver usando SSL para recuperação distribuída pelo canal `group_replication_recovery` (`group_replication_recovery_use_ssl=ON`), e a conta de usuário de replicação para a Replicação em Grupo autentica com o plugin `caching_sha2_password` (o padrão). Para mais detalhes, consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação Caching SHA-2”.

* `group_replication_recovery_public_key_path`

  <table frame="box" rules="all" summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_bootstrap_group</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Aplicável</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_public_key_path` especifica o nome do caminho de um arquivo que contém uma cópia do lado da replica da chave pública necessária pelo ponto de origem para a troca de senha com base em pares de chaves RSA. O arquivo deve estar no formato PEM. Se `group_replication_recovery_public_key_path` for definido como um arquivo de chave pública válido, ele terá precedência sobre `group_replication_recovery_get_public_key`. Esta variável se aplica se você não estiver usando SSL para recuperação distribuída pelo canal `group_replication_recovery` (portanto, `group_replication_recovery_use_ssl` está definido como `OFF`), e a conta de usuário de replicação para a Replicação em Grupo autentica com o plugin `caching_sha2_password` (o padrão) ou o plugin `sha256_password` (desatualizado). (Para `sha256_password`, definir `group_replication_recovery_public_key_path` só se aplica se o MySQL foi construído usando OpenSSL.) Para mais detalhes, consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação Caching SHA-2”.

* `group_replication_recovery_reconnect_interval`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

* `group_replication_recovery_reconnect_interval` especifica o tempo de espera, em segundos, entre as tentativas de reconexão quando nenhum dador adequado foi encontrado no grupo para a recuperação distribuída.

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_retry_count` especifica o número de vezes que o membro que está se juntando tenta se conectar aos doadores disponíveis para a recuperação distribuída antes de desistir.

* `group_replication_recovery_ssl_ca`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_ca` especifica o caminho para um arquivo que contém uma lista de autoridades de certificados SSL confiáveis para conexões de recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”) para obter informações sobre a configuração do SSL para a recuperação distribuída.

Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL de clonagem `clone_ssl_ca` para corresponder à sua configuração para `group_replication_recovery_ssl_ca`.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para group_replication_clone_threshold"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

O valor desta variável de sistema pode ser alterado enquanto a replicação em grupo estiver em execução, mas a alteração só entrará em vigor após você parar e reiniciar a replicação em grupo no membro do grupo.

`group_replication_recovery_ssl_capath` especifica o caminho para um diretório que contém certificados de autoridade de certificados SSL confiáveis para conexões de recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação do grupo com Secure Socket Layer (SSL”) para obter informações sobre a configuração do SSL para a recuperação distribuída.

Quando a pilha de comunicação MySQL estiver em uso para o grupo (`group_replication_communication_stack = MYSQL`), esta configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_ssl_cert`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_cert` especifica o nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão segura para a recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL de clonagem `clone_ssl_cert` para corresponder à sua configuração para `group_replication_recovery_ssl_cert`.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_ssl_cipher`

  <table frame="box" rules="all" summary="Propriedades para group_replication_clone_threshold"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_ssl_cipher` especifica a lista de cifrais permitidos para a criptografia SSL. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação do grupo com Secure Socket Layer (SSL”) para obter informações sobre a configuração do SSL para a recuperação distribuída.

Quando a pilha de comunicação MySQL estiver em uso para o grupo (`group_replication_communication_stack = MYSQL`), esta configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para as conexões de recuperação distribuída.

* `group_replication_recovery_ssl_crl`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_crl` especifica o caminho para um diretório que contém arquivos contendo listas de revogação de certificados. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”) para obter informações sobre a configuração do SSL para a recuperação distribuída.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para group_replication_clone_threshold"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo está em execução, mas a alteração só entra em vigor após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_ssl_crlpath` especifica o caminho para um diretório que contém arquivos contendo listas de revogação de certificados. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL das conexões de comunicação de grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_ssl_key`

  <table frame="box" rules="all" summary="Propriedades para group_replication_clone_threshold"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_ssl_key` especifica o nome do arquivo de chave SSL a ser usado para estabelecer uma conexão segura. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação do Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL de clonagem `clone_ssl_key` para corresponder à sua configuração para `group_replication_recovery_ssl_key`.

Quando a pilha de comunicação MySQL estiver em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para as conexões de recuperação distribuída.

* `group_replication_recovery_ssl_verify_server_cert`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_clone_threshold">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-clone-threshold=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_clone_threshold</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>9223372036854775807</code></td> </tr>
  <tr><th>Unidade</th> <td>transações</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_verify_server_cert` especifica se a conexão de recuperação distribuída deve verificar o valor do Nome Comum do servidor no certificado enviado pelo doador. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_tls_ciphersuites`

  <table frame="box" rules="all" summary="Propriedades para group_replication_communication_debug_options"><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></table>

O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

`group_replication_recovery_tls_ciphersuites` especifica uma lista separada por vírgula de uma ou mais suíte de cifra permitidas quando o TLSv1.3 é usado para criptografia de conexão para a conexão de recuperação distribuída, e essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. Se esta variável de sistema for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a variável de sistema), as suíte de cifra habilitadas por padrão serão permitidas, conforme listadas na Seção 8.3.2, “Protocolos e suíte de cifra de conexão criptografada” (Encrypted Connection TLS Protocols and Ciphers). Se esta variável de sistema for definida como a string vazia, nenhuma suíte de cifra será permitida, e o TLSv1.3, portanto, não será usado. Consulte a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”), para obter informações sobre a configuração do SSL para recuperação distribuída.

Quando a pilha de comunicação MySQL estiver em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL para conexões de comunicação de grupo, bem como para conexões de recuperação distribuída.

* `group_replication_recovery_tls_version`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, mas a alteração só terá efeito após você parar e reiniciar o Grupo de Replicação no membro do grupo.

`group_replication_recovery_tls_version` especifica uma lista separada por vírgula de um ou mais protocolos TLS permitidos para criptografia de conexão quando essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. Os membros do grupo envolvidos em cada conexão de recuperação distribuída como cliente (membro que está se juntando) e servidor (doador) negociam a versão do protocolo mais alta que ambos estão configurados para suportar.

Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), este ajuste é usado para a configuração TLS/SSL para conexões de comunicação de grupo, bem como para conexões de recuperação distribuída.

O padrão é “`TLSv1.2,TLSv1.3`”. Certifique-se de que as versões do protocolo especificadas estejam contíguas, sem números de versão omitidos do meio da sequência.

Importante

+ O suporte ao protocolo TLSv1.3 está disponível no MySQL 9.5, desde que o MySQL tenha sido compilado usando OpenSSL 1.1.1. O servidor verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão da variável do sistema. Nesse caso, o padrão é `TLSv1.2`.

+ A Replicação de Grupo suporta TLSv1.3 com suporte para seleção de suíte de cifra. Consulte a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter mais informações.

Consulte a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

* `group_replication_recovery_use_ssl`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, mas a alteração só terá efeito após você parar e reiniciar o Grupo de Replicação no membro do grupo.

`group_replication_recovery_use_ssl` especifica se as conexões de recuperação distribuída do Grupo de Replicação entre os membros do grupo devem usar SSL ou não. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação do Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

Se este servidor tiver sido configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você definir esta opção para `ON`, o Grupo de Replicação usa SSL para operações de clonagem remota, bem como para a transferência de estado de um log binário do doador. Se você definir esta opção para `OFF`, o Grupo de Replicação não usa SSL para operações de clonagem remota.

* `group_replication_recovery_zstd_compression_level`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, mas a alteração só terá efeito após você parar e reiniciar o Grupo de Replicação no membro do grupo.

`group_replication_recovery_zstd_compression_level` especifica o nível de compressão a ser usado para as conexões de recuperação distribuída da Replicação em Grupo que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão `zstd` padrão é 3. Para conexões de recuperação distribuída que não utilizam compressão `zstd`, essa variável não tem efeito.

Para obter mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Especifica o tempo máximo permitido de atraso para um aplicável em um secundário de Replicação de Grupo. Fornecido pelo componente do Gerenciador de Recursos de Replicação de Grupo.

  O valor padrão desta variável é equivalente a 1 hora; o máximo é equivalente a 12 horas. Definir `group_replication_resource_manager.applier_channel_lag` para `0` desativa o gerenciamento do atraso do aplicável.

Se o atraso atual de um aplicador secundário, conforme mostrado por `Gr_resource_manager_applier_channel_lag`, exceder 10 vezes consecutivas o valor de `group_replication_resource_manager.applier_channel_lag`, o sistema inicia uma saída suave do grupo atual e define o estado do membro como `ERROR`.

Consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos da Replicação em Grupo”, para obter mais informações.

* `group_replication_resource_manager.memory_used_limit`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Especifica o uso máximo permitido de memória em um secundário de Replicação de Grupo, como um percentual da memória do sistema. Fornecido pelo componente Gerenciador de Recursos de Replicação de Grupo.

  Definir `group_replication_resource_manager.memory_used_limit` para `0` desativa o monitoramento do uso de memória.

Se o uso atual de memória de um replicador de grupo, conforme mostrado por `Gr_resource_manager_memory_used`, exceder `group_replication_resource_manager.memory_used_limit` 10 vezes consecutivamente, o sistema inicia uma saída suave do grupo atual e define o estado do membro como `ERROR`.

Para mais informações, consulte a Seção 7.5.6.3, “Componente do Gerenciador de Recursos da Replicação de Grupo”.

* `group_replication_resource_manager.quarantine_time`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

Tempo de espera, em segundos, para impedir a rejeição imediata de um membro que tente se juntar ou voltar a se juntar a um grupo após ter sido expulso. Fornecido pelo componente do Gerenciador de Recursos de Replicação de Grupo.

O valor padrão é igual a 1 hora.

Consulte a Seção 7.5.6.3, “Gerenciador de Recursos de Replicação de Grupo”, para obter mais informações.

* `group_replication_resource_manager.recovery_channel_lag`

  <table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de Group Replication"><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></table>

  Especifica o tempo máximo permitido para um atraso de um thread de recuperação em um secundário de Group Replication. Fornecido pelo componente do Gerenciador de Recursos de Group Replication.

O valor padrão desta variável é equivalente a 1 hora; o máximo é equivalente a 12 horas. Definir `group_replication_resource_manager.recovery_channel_lag` para `0` desabilita o gerenciamento do atraso de recuperação.

Se o atraso atual por um fio de recuperação, conforme mostrado por `Gr_resource_manager_recovery_channel_lag`, exceder `group_replication_resource_manager.recovery_channel_lag` 10 vezes consecutivas, o sistema inicia uma saída suave do grupo atual e define o estado do membro como `ERROR`.

Para mais informações, consulte a Seção 7.5.6.3, “Compósito do Gerenciador de Recursos da Replicação em Grupo”.

* `group_replication_single_primary_mode`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Nota

  Esta variável do sistema é um ajuste de configuração para todo o grupo, e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_single_primary_mode` instrui o grupo a escolher automaticamente um único servidor para ser o responsável pela carga de trabalho de leitura/escrita. Esse servidor é o primário e todos os outros são secundários.

Esta variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo com segurança onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se o grupo tiver um valor definido para esta variável de sistema e um membro que está se juntando tiver um valor diferente definido para a variável de sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para corresponder. Se os membros do grupo tiverem um valor definido para esta variável de sistema e o membro que está se juntando não suportar a variável de sistema, ele não poderá se juntar ao grupo.

Definir esta variável `ON` faz com que qualquer configuração para `group_replication_auto_increment_increment` seja ignorada.

Use as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar o valor desta variável de sistema enquanto o grupo ainda estiver em execução. Para obter mais informações, consulte a Seção 20.5.1.2, “Mudar o Modo do Grupo”.

* `group_replication_ssl_mode`

<table frame="box" rules="all" summary="Propriedades para opções de depuração de comunicação de grupo_replication"><tbody><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-debug-options=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_debug_options</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>GCS_DEBUG_NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GCS_DEBUG_NONE</code></p><p><code>GCS_DEBUG_BASIC</code></p><p><code>GCS_DEBUG_TRACE</code></p><p><code>XCOM_DEBUG_BASIC</code></p><p><code>XCOM_DEBUG_TRACE</code></p><p><code>GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, mas a alteração só terá efeito após você parar e reiniciar o Grupo de Replicação no membro do grupo.

  O `group_replication_ssl_mode` define o estado de segurança das conexões de comunicação do Grupo de Replicação entre os membros do Grupo de Replicação. Os valores possíveis são os seguintes:

DESABILITADO:   Estabelecer uma conexão não criptografada (padrão).

REQUERIDO:   Estabelecer uma conexão segura, se o servidor suportar conexões seguras.

VERIFICAR_CA:   Como `REQUERIDO`, mas, adicionalmente, verificar o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.

VERIFICAR_IDENTIDADE:   Como `VERIFICAR_CA`, mas, adicionalmente, verificar se o certificado do servidor corresponde ao hospedeiro ao qual a conexão é realizada.

Esta variável deve ter o mesmo valor em todos os membros do grupo; caso contrário, novos membros podem não conseguir se juntar.

Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para comunicação de grupo.

* `group_replication_start_on_boot`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_communication_max_message_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10485760</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, mas a alteração só terá efeito após você parar e reiniciar o Grupo de Replicação no membro do grupo.

  `group_replication_start_on_boot` especifica se o servidor deve iniciar o Grupo de Replicação automaticamente (`ON`) ou não (`OFF`) durante o início do servidor. Quando você define essa opção para `ON`, o Grupo de Replicação é reiniciado automaticamente após uma operação de clonagem remota ser usada para a recuperação distribuída.

Para iniciar a replicação em grupo automaticamente durante o início do servidor, as credenciais do usuário para a recuperação distribuída devem ser armazenadas nos repositórios de metadados de replicação no servidor usando a instrução `ALTERAR SOURCE DE REPLICAÇÃO`. Se você preferir especificar as credenciais do usuário como parte de `INICIAR REPLICAÇÃO EM GRUPO`, que armazena as credenciais do usuário na memória apenas, certifique-se de que `group_replication_start_on_boot` esteja definido como `OFF`.

* `group_replication_tls_source`

  <table frame="box" rules="all" summary="Propriedades para group_replication_communication_max_message_size"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10485760</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  O valor desta variável do sistema pode ser alterado enquanto a replicação em grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a replicação em grupo no membro do grupo.

`group_replication_tls_source` especifica a fonte do material TLS para a Replicação em Grupo.

* `group_replication_transaction_size_limit`

  <table frame="box" rules="all" summary="Propriedades para group_replication_communication_max_message_size"><tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10485760</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></table>

  Esta variável do sistema deve ter o mesmo valor em todos os membros do grupo. O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução. A alteração entra em vigor imediatamente no membro do grupo e aplica-se a partir da próxima transação iniciada nesse membro. Durante esse processo, o valor da variável do sistema pode diferir entre os membros do grupo, mas algumas transações podem ser rejeitadas.

`group_replication_transaction_size_limit` configura o tamanho máximo da transação em bytes que o grupo de replicação aceita. Transações maiores que esse tamanho são revertidas pelo membro receptor e não são transmitidas para o grupo. Transações grandes podem causar problemas para um grupo de replicação em termos de alocação de memória, o que pode fazer com que o sistema desacelere, ou em termos de consumo de largura de banda da rede, o que pode fazer com que um membro seja suspeito de ter falhado porque está ocupado processando a transação grande.

Quando essa variável de sistema é definida como 0, não há limite para o tamanho das transações que o grupo aceita. O valor padrão é de 150000000 bytes (aproximadamente 143 MB). Ajuste o valor dessa variável de sistema dependendo do tamanho máximo da mensagem que o grupo precisa tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho. O valor de `group_replication_transaction_size_limit` deve ser o mesmo em todos os membros do grupo. Para mais estratégias de mitigação para transações grandes, consulte a Seção 20.3.2, “Limitações da Replicação em Grupo”.

* `group_replication_unreachable_majority_timeout`

<table frame="box" rules="all" summary="Propriedades para grupo_replication_communication_max_message_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>10485760</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  O valor desta variável do sistema pode ser alterado enquanto o Grupo de Replicação estiver em execução, e a alteração entra em vigor imediatamente. O valor atual da variável do sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

`group_replication_unreachable_majority_timeout` especifica um número de segundos durante o qual os membros que sofrem uma partição de rede e não conseguem se conectar à maioria esperam antes de sair do grupo. Em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) agora está em minoria porque não consegue se conectar a mais da metade do grupo. Enquanto o grupo da maioria (S3, S4, S5) permanece em funcionamento, o grupo da minoria espera o tempo especificado para uma reconexão de rede. Para uma descrição detalhada deste cenário, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

Por padrão, `group_replication_unreachable_majority_timeout` é definido para 0, o que significa que os membros que se encontram em minoria devido a uma partição de rede esperam para sempre para sair do grupo. Se você definir um tempo limite, quando o tempo especificado expirar, todas as transações pendentes processadas pela minoria serão revertidas e os servidores na partição da minoria passam para o estado `ERROR`. Se um membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de auto-rejoin, ele prossegue para fazer o número especificado de tentativas de se reiniciar no grupo enquanto estiver no modo de leitura apenas super. Se o membro não tiver nenhuma tentativa de auto-rejoin especificada ou se tiver esgotado o número especificado de tentativas, ele segue a ação especificada pela variável de sistema `group_replication_exit_state_action`.

Aviso

Quando você tem um grupo simétrico, com apenas dois membros, por exemplo (S0, S2), se houver uma partição de rede e não houver maioria, após o tempo configurado expirar, todos os membros entram no estado `ERROR`.

Para obter mais informações sobre o uso desta opção, consulte a Seção 20.7.7.2, “Timeout de maioria inatingível”.

* `group_replication_view_change_uuid`

  <table frame="box" rules="all" summary="Propriedades para group_replication_communication_max_message_size"><tr><th>Formato de linha de comando</th> <td><code>--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>group_replication_communication_max_message_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>10485760</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></table>

  Nota

  Esta variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

`group_replication_view_change_uuid` especifica um UUID alternativo a ser usado como a parte UUID do identificador nos GTIDs para eventos de mudança de visualização gerados pelo grupo. O UUID alternativo facilita a distinção dessas transações geradas internamente das transações recebidas pelo grupo de clientes. Isso pode ser útil se a configuração permitir o failover entre grupos e você precisar identificar e descartar transações específicas do grupo de backup. O valor padrão para essa variável do sistema é `AUTOMATIC`, o que significa que os GTIDs para eventos de mudança de visualização usam o nome do grupo especificado pela variável do sistema `group_replication_group_name`, assim como as transações de clientes. Membros do grupo em uma versão que não possui essa variável do sistema são tratados como tendo o valor `AUTOMATIC`.

O UUID alternativo deve ser diferente do nome do grupo especificado pela variável do sistema `group_replication_group_name` e deve ser diferente do UUID do servidor de qualquer membro do grupo. Também deve ser diferente de quaisquer UUIDs usados nos GTIDs que são aplicados a transações anônimas em canais de replicação em qualquer ponto dessa topologia, usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

Essa variável do sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a mudança de valor seja efetiva. Para instruções sobre como bootstrapar um grupo de forma segura onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se o grupo tiver um valor definido para essa variável de sistema, e um membro que está se juntando tiver um valor diferente definido para a variável de sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para combinar. Se os membros do grupo tiverem um valor definido para essa variável de sistema, e o membro que está se juntando não suportar a variável de sistema, ele não poderá se juntar ao grupo.

O registro de eventos de alteração de visualização é substituído pelo compartilhamento de metadados de recuperação; portanto, essa variável é desatualizada e está sujeita à remoção em uma versão futura do MySQL.

A lista anterior inclui aquelas variáveis de sistema fornecidas pelo componente de Estatísticas de Controle de Fluxo de Replicação de Grupo e pelo componente Gerenciador de Recursos de Replicação de Grupo. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação de Grupo”, e a Seção 7.5.6.3, “Componente Gerenciador de Recursos de Replicação de Grupo”, para obter mais informações sobre esses componentes.