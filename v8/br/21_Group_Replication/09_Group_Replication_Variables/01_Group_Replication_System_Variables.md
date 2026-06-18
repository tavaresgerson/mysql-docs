### 20.9.1 Variáveis do Sistema de Replicação em Grupo

Esta seção lista as variáveis do sistema que são específicas do plugin de replicação de grupo.

O nome de cada variável do sistema de replicação em grupo é precedido por `group_replication_`.

Nota

O InnoDB Cluster usa a Replicação por Grupo, mas os valores padrão das variáveis do sistema de Replicação por Grupo podem diferir dos padrões documentados nesta seção. Por exemplo, no InnoDB Cluster, o valor padrão de `group_replication_communication_stack` é `MYSQL`, e não `XCOM`, como é o caso de uma implementação padrão de Replicação por Grupo.

Para obter mais informações, consulte MySQL InnoDB Cluster.

Algumas variáveis de sistema em um membro do grupo de replicação em grupo, incluindo algumas variáveis de sistema específicas da replicação em grupo e algumas variáveis de sistema gerais, são configurações de nível de grupo. Essas variáveis de sistema devem ter o mesmo valor em todos os membros do grupo e exigem um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a mudança de valor seja efetiva. Para obter instruções sobre como reiniciar um grupo onde todos os membros foram interrompidos, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

Se um grupo de corrida tiver um valor definido para uma configuração de nível de grupo, e um membro que está se juntando tiver um valor diferente definido para essa variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para combinar. Se o grupo tiver um valor definido para uma dessas variáveis do sistema e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

As seguintes variáveis de sistema são configurações de nível de grupo:

- `group_replication_single_primary_mode`

- `group_replication_enforce_update_everywhere_checks`

- `group_replication_gtid_assignment_block_size`

- `group_replication_view_change_uuid`

- `group_replication_paxos_single_leader`

- `group_replication_communication_stack` (um caso especial não monitorado pelas próprias verificações do Grupo de Replicação; consulte a descrição da variável do sistema para detalhes)

- `default_table_encryption`

- `lower_case_table_names`

- `transaction_write_set_extraction` (desatualizado a partir do MySQL 8.0.26)

As configurações de nível de grupo não podem ser alteradas pelos métodos usuais enquanto a Replicação de grupo estiver em execução, mas no MySQL 8.0.16 e versões posteriores, é possível usar as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar os valores de `group_replication_single_primary_mode` e `group_replication_enforce_update_everywhere_checks` enquanto o grupo ainda estiver em execução. Para mais informações, consulte a Seção 20.5.1.2, “Alterando o modo do grupo”.

A maioria das variáveis de sistema para a Replicação em Grupo pode ter valores diferentes em diferentes membros do grupo. Para as seguintes variáveis de sistema, é aconselhável definir o mesmo valor em todos os membros de um grupo para evitar o descarte desnecessário de transações, a falha na entrega de mensagens ou a falha na recuperação de mensagens:

- `group_replication_auto_increment_increment`
- `group_replication_communication_max_message_size`
- `group_replication_compression_threshold`
- `group_replication_message_cache_size`
- `group_replication_transaction_size_limit`

A maioria das variáveis do sistema para a Replicação em Grupo é descrita como dinâmica, e seus valores podem ser alterados enquanto o servidor estiver em execução. No entanto, na maioria dos casos, a alteração só entra em vigor após você parar e reiniciar a Replicação em Grupo no membro do grupo usando uma declaração `STOP GROUP_REPLICATION` seguida por uma declaração `START GROUP_REPLICATION`. As alterações nas seguintes variáveis do sistema entram em vigor sem parar e reiniciar a Replicação em Grupo:

- `group_replication_advertise_recovery_endpoints`
- `group_replication_autorejoin_tries`
- `group_replication_consistency`
- `group_replication_exit_state_action`
- `group_replication_flow_control_applier_threshold`
- `group_replication_flow_control_certifier_threshold`
- `group_replication_flow_control_hold_percent`
- `group_replication_flow_control_max_quota`
- `group_replication_flow_control_member_quota_percent`
- `group_replication_flow_control_min_quota`
- `group_replication_flow_control_min_recovery_quota`
- `group_replication_flow_control_mode`
- `group_replication_flow_control_period`
- `group_replication_flow_control_release_percent`
- `group_replication_force_members`
- `group_replication_ip_allowlist`
- `group_replication_ip_whitelist`
- `group_replication_member_expel_timeout`
- `group_replication_member_weight`
- `group_replication_transaction_size_limit`
- `group_replication_unreachable_majority_timeout`

Quando você alterar os valores de qualquer variável do sistema de replicação em grupo, lembre-se de que, se houver um ponto em que a replicação em grupo é interrompida em todos os membros de uma vez por uma instrução `STOP GROUP_REPLICATION` ou desligamento do sistema, o grupo deve ser reiniciado por bootstrap, como se estivesse sendo iniciado pela primeira vez. Para obter instruções sobre como fazer isso com segurança, consulte a Seção 20.5.2, “Reiniciar um Grupo”. No caso de configurações de configuração em todo o grupo, isso é necessário, mas se você estiver alterando outras configurações, tente garantir que pelo menos um membro esteja em execução em todos os momentos.

Importante

- Várias variáveis do sistema para a Replicação em Grupo não são completamente validadas durante o início do servidor se forem passadas como argumentos na linha de comando para o servidor. Essas variáveis do sistema incluem `group_replication_group_name`, `group_replication_single_primary_mode`, `group_replication_force_members`, as variáveis SSL e as variáveis do sistema de controle de fluxo. Elas são totalmente validadas apenas após o servidor ter sido iniciado.

- As variáveis do sistema para a Replicação em Grupo que especificam endereços IP ou nomes de host para os membros do grupo não são validadas até que uma instrução `START GROUP_REPLICATION` seja emitida. O Sistema de Comunicação do Grupo (GCS) da Replicação em Grupo não está disponível para validar os valores até esse ponto.

As variáveis do sistema do servidor específicas do plugin de replicação de grupo, juntamente com descrições de sua função ou propósito, estão listadas aqui:

- `group_replication_advertise_recovery_endpoints`

  <table summary="Propriedades para grupo_replication_advertise_recovery_endpoints"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-advertise-recovery-endpoints=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_advertise_recovery_endpoints</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>DEFAULT</code>]]</td> </tr></tbody></table>

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução. A alteração entra em vigor imediatamente no membro. No entanto, um membro que se junta e já recebeu o valor anterior da variável de sistema continua a usar esse valor. Apenas os membros que se juntam após a alteração do valor recebem o novo valor.

  `group_replication_advertise_recovery_endpoints` especifica como um membro associado pode estabelecer uma conexão com um membro existente para transferência de estado para recuperação distribuída. A conexão é usada tanto para operações de clonagem remota quanto para transferência de estado do log binário do doador.

  Um valor de `DEFAULT`, que é o ajuste padrão, significa que os membros que se conectam usam a conexão padrão do cliente SQL do membro existente, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. Se um número de porta alternativo for especificado pela variável de sistema `report_port`, esse número será usado em vez disso. A tabela do Schema de Desempenho `replication_group_members` mostra o endereço e o número de porta dessa conexão nas colunas `MEMBER_HOST` e `MEMBER_PORT`. Esse é o comportamento dos membros do grupo que estão executando o MySQL 8.0.20 ou versões anteriores.

  Em vez de `DEFAULT`, você pode especificar um ou mais pontos de recuperação distribuídos, que o membro existente anuncia para que os membros que desejam se juntar usem. Oferecer pontos de recuperação distribuídos permite que os administradores controlem o tráfego de recuperação distribuída separadamente das conexões regulares do cliente MySQL com os membros do grupo. Os membros que se juntam tentam cada um dos pontos de recuperação em ordem, conforme especificado na lista.

  Especifique os pontos finais de recuperação distribuídos como uma lista separada por vírgula de endereços IP e números de porta, por exemplo:

  ```
  group_replication_advertise_recovery_endpoints= "127.0.0.1:3306,127.0.0.1:4567,[::1]:3306,localhost:3306"
  ```

  Os endereços IPv4 e IPv6 e os nomes de host podem ser usados em qualquer combinação. Os endereços IPv6 devem ser especificados entre colchetes. Os nomes de host devem resolver para um endereço IP local. Os formatos de endereços com asteriscos não podem ser usados e você não pode especificar uma lista vazia. Observe que a conexão padrão do cliente SQL não é incluída automaticamente em uma lista de pontos de extremidade de recuperação distribuída. Se você quiser usá-la como um ponto de extremidade, você deve incluí-la explicitamente na lista.

  Para obter detalhes sobre como selecionar endereços IP e portas como pontos finais de recuperação distribuída e como os membros que fazem parte da rede os utilizam, consulte a Seção 20.5.4.1.1, “Selecionando endereços para pontos finais de recuperação distribuída”. Um resumo dos requisitos é o seguinte:

  - Os endereços IP não precisam ser configurados para o MySQL Server, mas eles precisam ser atribuídos ao servidor.

  - Os portos precisam ser configurados para o MySQL Server usando a variável de sistema `port`, `report_port` ou `admin_port`.

  - São necessárias permissões apropriadas para o usuário de replicação para recuperação distribuída se o `admin_port` for usado.

  - Os endereços IP não precisam ser adicionados à lista de permissão de replicação em grupo especificada pela variável de sistema `group_replication_ip_allowlist` ou `group_replication_ip_whitelist`.

  - Os requisitos de SSL para a conexão são especificados pelas opções `group_replication_recovery_ssl_*`.

- `group_replication_allow_local_lower_version_join`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_allow_local_lower_version_join` permite que o servidor atual se junte ao grupo, mesmo que esteja executando uma versão inferior do MySQL Server em comparação com o grupo. Com a configuração padrão `OFF`, os servidores não são permitidos a se juntar a um grupo de replicação se estiverem executando uma versão inferior aos membros existentes do grupo. Essa política padrão garante que todos os membros de um grupo possam trocar mensagens e aplicar transações. Observe que os membros que estão executando o MySQL 8.0.17 ou superior levam em consideração a versão do patch do lançamento ao verificar sua compatibilidade. Os membros que estão executando o MySQL 8.0.16 ou versões anteriores, ou o MySQL 5.7, levam em consideração apenas a versão principal.

  Defina `group_replication_allow_local_lower_version_join` para `ON` apenas nos seguintes cenários:

  - Em caso de emergência, é necessário adicionar um servidor ao grupo para melhorar a tolerância a falhas do grupo, e apenas versões mais antigas estão disponíveis.

  - Você deseja reverter uma atualização para um ou mais membros do grupo de replicação sem desligar o grupo inteiro e iniciá-lo novamente.

  Aviso

  Definir essa opção para `ON` não torna o novo membro compatível com o grupo e permite que ele se junte ao grupo sem quaisquer salvaguardas contra comportamentos incompatíveis dos membros existentes. Para garantir o funcionamento correto do novo membro, tome *ambas* das seguintes precauções:

  1. Antes de o servidor que executa a versão mais antiga se juntar ao grupo, pare todas as gravações nesse servidor.

  2. A partir do ponto em que o servidor que executa a versão mais baixa se junta ao grupo, pare todas as gravações nos outros servidores do grupo.

  Sem essas precauções, o servidor que executa a versão mais baixa provavelmente terá dificuldades e terminará com um erro.

- `group_replication_auto_increment_increment`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  Essa variável de sistema deve ter o mesmo valor em todos os membros do grupo. Você não pode alterar o valor dessa variável de sistema enquanto a Replicação em Grupo estiver em execução. Você deve parar a Replicação em Grupo, alterar o valor da variável de sistema e, em seguida, reiniciar a Replicação em Grupo, em cada um dos membros do grupo. Durante esse processo, o valor da variável de sistema pode diferir entre os membros do grupo, mas algumas transações nos membros do grupo podem ser revertidas.

  `group_replication_auto_increment_increment` determina o intervalo entre os valores consecutivos para colunas com autoincremento para transações que são executadas nesta instância do servidor. Adicionar um intervalo evita a seleção de valores de autoincremento duplicados para escritas em membros do grupo, o que causa o rollback das transações. O valor padrão de 7 representa um equilíbrio entre o número de valores utilizáveis e o tamanho máximo permitido de um grupo de replicação (9 membros). Se o seu grupo tiver mais ou menos membros, você pode definir essa variável de sistema para corresponder ao número esperado de membros do grupo antes de o Replicação de Grupo ser iniciado.

  Importante

  A definição de `group_replication_auto_increment_increment` não tem efeito quando `group_replication_single_primary_mode` é `ON`.

  Quando a Replicação em Grupo é iniciada em uma instância do servidor, o valor da variável de sistema do servidor `auto_increment_increment` é alterado para esse valor, e o valor da variável de sistema do servidor `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é interrompida. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` tiverem seu valor padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação em Grupo não os altera. No MySQL 8.0, as variáveis de sistema também não são modificadas quando a Replicação em Grupo está no modo de único primário, onde apenas um servidor escreve.

- `group_replication_autorejoin_tries`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente. O valor atual da variável de sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

  `group_replication_autorejoin_tries` especifica o número de tentativas que um membro faz para se reiniciar automaticamente no grupo se for expulso ou se não conseguir entrar em contato com a maioria do grupo antes que o tempo limite `group_replication_unreachable_majority_timeout` seja atingido. Quando o tempo limite de expulsão ou maioria inacessível do membro é atingido, ele tenta se reiniciar (usando os valores atuais das opções do plugin), e então continua a fazer tentativas de reinício automático até o número especificado de tentativas. Após uma tentativa de reinício automático malsucedida, o membro espera 5 minutos antes da próxima tentativa. Se o número especificado de tentativas for esgotado sem que o membro se reinicie ou seja interrompido, o membro prossegue para a ação especificada pela variável de sistema `group_replication_exit_state_action`.

  Até o MySQL 8.0.20, o ajuste padrão é 0, o que significa que o membro não tenta se reiniciar automaticamente. A partir do MySQL 8.0.21, o ajuste padrão é 3, o que significa que o membro faz automaticamente 3 tentativas de se reiniciar no grupo, com 5 minutos entre cada uma. Você pode especificar um máximo de 2016 tentativas.

  Durante e entre as tentativas de reinclusão automática, um membro permanece no modo de leitura apenas super e não aceita escritas, mas ainda é possível fazer leituras, com uma probabilidade crescente de leituras desatualizadas ao longo do tempo. Se você não pode tolerar a possibilidade de leituras desatualizadas por qualquer período de tempo, defina `group_replication_autorejoin_tries` para 0. Para obter mais informações sobre o recurso de reinclusão automática e considerações ao escolher um valor para essa opção, consulte a Seção 20.7.7.3, “Reinclusão Automática”.

- `group_replication_bootstrap_group`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  `group_replication_bootstrap_group` configura este servidor para inicializar o grupo. Esta variável de sistema deve ser definida *apenas* em um servidor e *apenas* ao iniciar o grupo pela primeira vez ou reiniciá-lo completamente. Após o grupo ter sido inicializado, defina esta opção para `OFF`. Deve ser definida para `OFF` tanto dinamicamente quanto nos arquivos de configuração. Iniciar dois servidores ou reiniciar um servidor com esta opção definida enquanto o grupo estiver em execução pode levar a uma situação de cérebro artificial, onde dois grupos independentes com o mesmo nome são inicializados.

  Para obter instruções sobre como inicializar um grupo pela primeira vez, consulte a Seção 20.2.1.5, “Inicialização do Grupo”. Para obter instruções sobre como inicializar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reinício de um Grupo”.

- `group_replication_clone_threshold`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_clone_threshold` especifica a lacuna de transações, em número de transações, entre o membro existente (doador) e o membro que está se juntando (receptor), que desencadeia o uso de uma operação de clonagem remota para a transferência de estado para o membro que está se juntando durante o processo de recuperação distribuída. Se a lacuna de transações entre o membro que está se juntando e um doador adequado exceder o limite, a Replicação em Grupo começa a recuperação distribuída com uma operação de clonagem remota. Se a lacuna de transações estiver abaixo do limite ou se a operação de clonagem remota não for tecnicamente possível, a Replicação em Grupo prossegue diretamente para a transferência de estado do log binário de um doador.

  Aviso

  Não use uma configuração baixa para `group_replication_clone_threshold` em um grupo ativo. Se um número de transações acima do limite ocorrer no grupo enquanto a operação de clonagem remota estiver em andamento, o membro que se junta aciona novamente a operação de clonagem remota após o reinício e pode continuar isso indefinidamente. Para evitar essa situação, certifique-se de definir o limite para um número maior que o número de transações que você esperaria ocorrer no grupo durante o tempo necessário para a operação de clonagem remota.

  Para usar essa função, tanto o doador quanto o membro que está se juntando devem ser configurados previamente para suportar o clonagem. Para obter instruções, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”. Quando uma operação de clonagem remota é realizada, a Replicação em Grupo gerencia isso por você, incluindo o reinício do servidor necessário, desde que `group_replication_start_on_boot=ON` esteja definido. Caso contrário, você deve reiniciar o servidor manualmente. A operação de clonagem remota substitui o dicionário de dados existente no membro que está se juntando, mas a Replicação em Grupo verifica e não prossegue se o membro que está se juntando tiver transações adicionais que não estão presentes nos outros membros do grupo, porque essas transações seriam apagadas pela operação de clonagem.

  A configuração padrão (que é o número máximo permitido de sequência para uma transação em um GTID) significa que a transferência de estado de um log binário de um doador é praticamente sempre tentada em vez de clonagem. No entanto, observe que a Replicação em Grupo sempre tenta executar uma operação de clonagem, independentemente do seu limiar, se a transferência de estado de um log binário de um doador for impossível, por exemplo, porque as transações necessárias pelo membro que está se juntando não estão disponíveis nos logs binários de nenhum membro do grupo existente. Se você não quiser usar clonagem em seu grupo de replicação, não instale o plugin de clone nos membros.

- `group_replication_communication_debug_options`

  <table summary="Propriedades para group_replication_communication_debug_options"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-communication-debug-options=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_communication_debug_options</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>GCS_DEBUG_NONE</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>GCS_DEBUG_NONE</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_BASIC</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_TRACE</code>]]</p><p class="valid-value">[[<code>XCOM_DEBUG_BASIC</code>]]</p><p class="valid-value">[[<code>XCOM_DEBUG_TRACE</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_ALL</code>]]</p></td> </tr></tbody></table>

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_communication_debug_options` configura o nível de mensagens de depuração para fornecer suporte aos diferentes componentes da Replicação em Grupo, como o Sistema de Comunicação em Grupo (GCS) e o motor de comunicação em grupo (XCom, uma variante do Paxos). As informações de depuração são armazenadas no arquivo `GCS_DEBUG_TRACE` no diretório de dados.

  O conjunto de opções disponíveis, especificadas como strings, pode ser combinado. As seguintes opções estão disponíveis:

  - `GCS_DEBUG_NONE` desativa todos os níveis de depuração para o GCS e o XCom.

  - `GCS_DEBUG_BASIC` permite informações básicas de depuração no GCS.

  - `GCS_DEBUG_TRACE` permite a obtenção de informações de rastreamento no GCS.

  - `XCOM_DEBUG_BASIC` permite informações básicas de depuração no XCom.

  - `XCOM_DEBUG_TRACE` permite a obtenção de informações de rastreamento no XCom.

  - `GCS_DEBUG_ALL` habilita todos os níveis de depuração para o GCS e o XCom.

  Definir o nível de depuração para `GCS_DEBUG_NONE` só tem efeito quando fornecido sem nenhuma outra opção. Definir o nível de depuração para `GCS_DEBUG_ALL` substitui todas as outras opções.

- `group_replication_communication_max_message_size`

  <table summary="Propriedades para group_replication_communication_max_message_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-communication-max-message-size=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_communication_max_message_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>10485760</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Essa variável de sistema deve ter o mesmo valor em todos os membros do grupo. Você não pode alterar o valor dessa variável de sistema enquanto a Replicação em Grupo estiver em execução. Você deve parar a Replicação em Grupo, alterar o valor da variável de sistema e, em seguida, reiniciar a Replicação em Grupo, em cada um dos membros do grupo. Durante esse processo, o valor da variável de sistema pode diferir entre os membros do grupo, mas algumas transações nos membros do grupo podem ser revertidas.

  `group_replication_communication_max_message_size` especifica um tamanho máximo de mensagem para as comunicações de Replicação em Grupo. Mensagens maiores que esse tamanho são automaticamente divididas em fragmentos que são enviados separadamente e reensamblados pelos destinatários. Para mais informações, consulte a Seção 20.7.5, “Fragmentação de Mensagens”.

  Um tamanho máximo de mensagem de 10485760 bytes (10 MiB) é definido por padrão, o que significa que a fragmentação é usada por padrão no MySQL 8.0.16 e versões posteriores. O maior valor permitido é o mesmo que o valor máximo da variável de sistema `replica_max_allowed_packet` ou `slave_max_allowed_packet`, que é de 1073741824 bytes (1 GB). `group_replication_communication_max_message_size` deve ser menor que `replica_max_allowed_packet`, porque o thread do aplicável não pode lidar com fragmentos de mensagem maiores que o tamanho máximo do pacote permitido. Para desativar a fragmentação, defina `group_replication_communication_max_message_size` para `0`.

  Para que os membros de um grupo de replicação possam usar a fragmentação, a versão do protocolo de comunicação do grupo deve ser 8.0.16 ou posterior. Use a função `group_replication_get_communication_protocol()` para visualizar a versão do protocolo de comunicação do grupo. Se estiver sendo usada uma versão inferior, os membros do grupo não fragmentam as mensagens. Você pode usar a função `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação do grupo para uma versão mais alta, se todos os membros do grupo a suportarem. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

- `group_replication_communication_stack`

  <table summary="Propriedades para grupo_replication_communication_stack"><tbody><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_communication_stack</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>XCOM</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>XCOM</code>]]</p><p class="valid-value">[[<code>MYSQL</code>]]</p></td> </tr></tbody></table>

  Nota

  Essa variável de sistema é, na verdade, um ajuste de configuração para todo o grupo; embora possa ser configurada durante a execução, é necessário reiniciar completamente o grupo de replicação para que qualquer alteração entre em vigor.

  `group_replication_communication_stack` especifica se a pilha de comunicação XCom ou a pilha de comunicação MySQL deve ser usada para estabelecer conexões de comunicação em grupo entre os membros. A pilha de comunicação XCom é a implementação própria do Grupo de Replicação, usada sempre em versões anteriores ao MySQL 8.0.27, e não suporta autenticação ou namespaces de rede. A pilha de comunicação MySQL é a implementação nativa do MySQL Server, com suporte para autenticação e namespaces de rede, e acesso a novas funções de segurança imediatamente após a liberação. Todos os membros de um grupo devem usar a mesma pilha de comunicação.

  Quando você usa a pilha de comunicação MySQL em vez do XCom, o MySQL Server estabelece cada conexão entre os membros do grupo usando seus próprios protocolos de autenticação e criptografia.

  Nota

  Se você estiver usando o InnoDB Cluster, o valor padrão de `group_replication_communication_stack` é `MYSQL`.

  Para obter mais informações, consulte MySQL InnoDB Cluster.

  É necessária uma configuração adicional ao configurar um grupo para usar a pilha de comunicação do MySQL; consulte a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

  `group_replication_communication_stack` é, na verdade, um ajuste de configuração para todo o grupo, e o ajuste deve ser o mesmo em todos os membros do grupo. No entanto, isso não é monitorado pelas próprias verificações da Replicação em Grupo para ajustes de configuração para todo o grupo. Um membro com um valor diferente do restante do grupo não pode se comunicar com os outros membros, porque os protocolos de comunicação são incompatíveis, então não pode trocar informações sobre seus ajustes de configuração.

  Isso significa que, embora o valor da variável do sistema possa ser alterado enquanto a Replicação em Grupo estiver em execução e tenha efeito após você reiniciar a Replicação em Grupo no membro do grupo, o membro ainda não poderá se reiniciar no grupo até que o ajuste tenha sido alterado em todos os membros. Portanto, você deve parar a Replicação em Grupo em todos os membros e alterar o valor da variável do sistema neles antes de poder reiniciar o grupo. Como todos os membros estão parados, é necessário um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração de valor tenha efeito. Para obter instruções sobre a migração de uma pilha de comunicação para outra, consulte a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

- `group_replication_components_stop_timeout`

  <table summary="Propriedades para group_replication_components_stop_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-components-stop-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_components_stop_timeout</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.27)</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.26)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_components_stop_timeout` especifica o tempo, em segundos, durante o qual a Replicação em Grupo aguarda que cada um de seus módulos complete os processos em andamento enquanto o servidor está sendo desligado. O tempo de espera do componente é aplicado após a emissão de uma declaração `STOP GROUP_REPLICATION`, que acontece automaticamente durante o reinício do servidor ou a reinclusão automática.

  O tempo de espera é usado para resolver situações em que os componentes da Replicação em Grupo não podem ser interrompidos normalmente, o que pode acontecer se um membro for expulso do grupo enquanto ele estiver em um estado de erro, ou enquanto um processo como o MySQL Enterprise Backup estiver segurando um bloqueio global nas tabelas do membro. Nessas situações, o membro não pode interromper o fio do aplicável ou completar o processo de recuperação distribuída para se reiniciar. `STOP GROUP_REPLICATION` não é concluído até que a situação seja resolvida (por exemplo, ao liberar o bloqueio) ou o tempo de espera do componente expire e os módulos sejam desligados, independentemente de seu status.

  Antes do MySQL 8.0.27, o tempo limite padrão do componente é de 31536000 segundos, ou 365 dias. Com essa configuração, o tempo limite do componente não ajuda em situações como as descritas, portanto, um valor menor é recomendado. A partir do MySQL 8.0.27, o valor padrão é de 300 segundos, para que os componentes de Replicação por Grupo sejam interrompidos após 5 minutos, se a situação não for resolvida antes desse tempo, permitindo que o membro seja reiniciado e reingressado.

- `group_replication_compression_threshold`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O valor limite em bytes acima do qual a compressão é aplicada às mensagens enviadas entre os membros do grupo. Se essa variável de sistema for definida como zero, a compressão será desativada. O valor de `group_replication_compression_threshold` deve ser o mesmo em todos os membros do grupo.

  A replicação em grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é igual ao tamanho máximo de mensagem aceito pelo XCom. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`, porque as transações acima desse tamanho não podem ser confirmadas quando a compressão de mensagens está habilitada.

  Para obter mais informações, consulte a Seção 20.7.4, “Compressão de Mensagens”.

- `group_replication_consistency`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  `group_replication_consistency` é uma variável do sistema do servidor, e não uma variável específica do plugin de Replicação em Grupo, portanto, não é necessário reiniciar a Replicação em Grupo para que a alteração entre em vigor. A alteração do valor da sessão da variável do sistema tem efeito imediatamente, e a alteração do valor global tem efeito para novas sessões que começam após a mudança. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para alterar o ajuste global para essa variável do sistema.

  `group_replication_consistency` determina a garantia de consistência da transação que um grupo fornece; isso pode ser feito globalmente ou por transação. `group_replication_consistency` também determina o mecanismo de proteção usado por primárias recém-eleitas em grupos de primárias únicas. O efeito da variável deve ser considerado tanto para transações de leitura apenas quanto para transações de leitura/escrita. A lista a seguir mostra os valores possíveis desta variável, em ordem crescente de garantia de consistência da transação:

  - `EVENTUAL`

    Nem as transações de leitura somente ou de leitura/escrita esperam que as transações anteriores sejam aplicadas antes de serem executadas. (Antes que essa variável fosse adicionada, esse era o comportamento padrão.) Uma transação de leitura/escrita não espera que outros membros apliquem uma transação. Isso significa que uma transação pode ser externalizada em um membro antes dos outros. Isso também significa que, em caso de falha primária, o novo primário pode aceitar novas transações de leitura somente e de leitura/escrita antes que todas as transações do primário anterior tenham sido aplicadas.

  - `BEFORE_ON_PRIMARY_FAILOVER`

    Novas transações de leitura somente ou de leitura/escrita com um primário recém-eleito que está aplicando um atraso do primário antigo não são aplicadas até que qualquer atraso seja aplicado. Isso garante que, em caso de falha do primário, os clientes sempre vejam o valor mais recente no primário, independentemente de o falhamento ser intencional. Isso garante consistência, mas significa que os clientes devem ser capazes de lidar com o atraso no caso de um atraso estar sendo aplicado. O tempo desse atraso depende do tamanho do atraso em processamento, mas geralmente não é grande.

  - `BEFORE`

    Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas antes de ser aplicada. Uma transação apenas de leitura aguarda que todas as transações anteriores sejam concluídas antes de ser executada. Isso garante que essa transação leia o valor mais recente, afetando apenas a latência da transação. Isso reduz qualquer sobrecarga da sincronização, garantindo que seja usada apenas em transações de leitura apenas. Esse nível de consistência também inclui as garantias de consistência fornecidas pelo `BEFORE_ON_PRIMARY_FAILOVER`.

  - `AFTER`

    Uma transação de leitura/escrita aguarda até que suas alterações sejam aplicadas a todos os outros membros. Esse valor não tem efeito em transações apenas de leitura e garante que, quando uma transação é comprometida no membro local, qualquer transação subsequente leia o valor escrito ou um valor mais recente em qualquer membro do grupo. Isso significa que as transações apenas de leitura nos outros membros permanecem não comprometidas até que todas as transações anteriores sejam comprometidas, aumentando a latência da transação afetada.

    Use este modo com um grupo destinado principalmente a operações de leitura apenas para garantir que quaisquer transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas. Isso pode ser usado pelo seu aplicativo para garantir que leituras subsequentes obtenham os dados mais recentes, incluindo as últimas escritas. Isso reduz qualquer sobrecarga da sincronização, garantindo que a sincronização seja usada apenas para transações de leitura/escrita.

    `AFTER` inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

  - `BEFORE_AND_AFTER`

    Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas e que todas as suas alterações sejam aplicadas em todos os outros membros antes de ser aplicada. Uma transação de leitura apenas aguarda que todas as transações anteriores sejam concluídas antes da execução. Esse nível de consistência também inclui as garantias de consistência fornecidas pelo `BEFORE_ON_PRIMARY_FAILOVER`.

  Para obter mais informações, consulte a Seção 20.5.3, “Garantias de Consistência de Transações”.

- `group_replication_enforce_update_everywhere_checks`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_enforce_update_everywhere_checks` habilita ou desabilita verificações de consistência estritas para atualização multi-primária em todos os lugares. O padrão é que as verificações estejam desativadas. No modo de único primário, essa opção deve ser desativada em todos os membros do grupo. No modo multi-primário, quando essa opção estiver habilitada, as declarações serão verificadas da seguinte forma para garantir que sejam compatíveis com o modo multi-primário:

  - Se uma transação for executada com o nível de isolamento `SERIALIZABLE`, seu commit falhará ao se sincronizar com o grupo.

  - Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então a transação não consegue ser confirmada ao se sincronizar com o grupo.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

  No MySQL 8.0.16 ou posterior, use as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar o valor dessa variável do sistema enquanto o grupo ainda estiver em execução. Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”.

- `group_replication_exit_state_action`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente. O valor atual da variável de sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

  `group_replication_exit_state_action` configura como a Replicação em Grupo se comporta quando essa instância do servidor deixa o grupo involuntariamente, por exemplo, após encontrar um erro de aplicável, ou no caso de uma perda da maioria, ou quando outro membro do grupo o expulsa devido a uma suspeita que vence. O período de espera para um membro deixar o grupo no caso de uma perda da maioria é definido pela variável de sistema `group_replication_unreachable_majority_timeout`, e o período de espera para as suspeitas é definido pela variável de sistema `group_replication_member_expel_timeout`. Observe que um membro expulso do grupo não sabe que foi expulso até se reconectar ao grupo, então a ação especificada só é realizada se o membro conseguir se reconectar, ou se o membro levantar uma suspeita sobre si mesmo e se expulsar.

  Quando um membro do grupo é expulso devido a uma suspeita que expira ou à perda da maioria, se o membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de reinclusão automática, ele faz primeiro o número especificado de tentativas enquanto estiver no modo de leitura apenas para super, e depois segue a ação especificada por `group_replication_exit_state_action`. As tentativas de reinclusão automática não são feitas em caso de erro do aplicável, porque essas não são recuperáveis.

  Quando `group_replication_exit_state_action` é definido como `READ_ONLY`, se o membro sair do grupo involuntariamente ou esgota suas tentativas de reinclusão automática, a instância muda o MySQL para o modo de leitura apenas super (definindo a variável de sistema `super_read_only` para `ON`). A ação de saída `READ_ONLY` era o comportamento para as versões do MySQL 8.0 antes da introdução da variável de sistema e voltou a ser o padrão no MySQL 8.0.16.

  Quando `group_replication_exit_state_action` é definido como `OFFLINE_MODE`, se o membro sair do grupo involuntariamente ou esgotar suas tentativas de reinclusão automática, a instância desativa o MySQL para o modo offline (definindo a variável de sistema `offline_mode` como `ON`). Nesse modo, os usuários conectados são desconectados na próxima solicitação e as conexões não são mais aceitas, com exceção dos usuários do cliente que possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). A Replicação de Grupo também define a variável de sistema `super_read_only` como `ON`, para que os clientes não possam fazer quaisquer atualizações, mesmo que tenham se conectado com o privilégio `CONNECTION_ADMIN` ou `SUPER`. A ação de saída `OFFLINE_MODE` está disponível no MySQL 8.0.18 e versões posteriores.

  Quando `group_replication_exit_state_action` é definido como `ABORT_SERVER`, se o membro sair do grupo involuntariamente ou esgotar suas tentativas de reinclusão automática, a instância desativa o MySQL. Esse ajuste era o padrão do MySQL 8.0.12, quando a variável de sistema foi adicionada, até o MySQL 8.0.15, inclusive.

  Importante

  Se uma falha ocorrer antes que o membro tenha se juntado com sucesso ao grupo, a ação de saída especificada *não é executada*. Esse é o caso se houver uma falha durante a verificação da configuração local ou se houver uma incompatibilidade entre a configuração do membro que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema `super_read_only` é deixada com seu valor original, as conexões continuam sendo aceitas e o servidor não desliga o MySQL. Para garantir que o servidor não aceite atualizações quando a Replicação de Grupo não foi iniciada, recomendamos que `super_read_only=ON` seja definido no arquivo de configuração do servidor ao iniciar, que a Replicação de Grupo altera para `OFF` nos membros primários após ela ter sido iniciada com sucesso. Essa proteção é particularmente importante quando o servidor é configurado para iniciar a Replicação de Grupo no inicialização do servidor (`group_replication_start_on_boot=ON`), mas também é útil quando a Replicação de Grupo é iniciada manualmente usando uma declaração `START GROUP_REPLICATION`.

  Para obter mais informações sobre o uso dessa opção e a lista completa das situações em que a ação de saída é realizada, consulte a Seção 20.7.7.4, “Ação de Saída”.

- `group_replication_flow_control_applier_threshold`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_applier_threshold` especifica o número de transações pendentes na fila de solicitadores que acionam o controle de fluxo.

- `group_replication_flow_control_certifier_threshold`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_certifier_threshold` especifica o número de transações pendentes na fila de certificação que acionam o controle de fluxo.

- `group_replication_flow_control_hold_percent`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_hold_percent` define qual porcentagem da quota do grupo permanece não utilizada para permitir que um grupo sob controle de fluxo recupere o atraso. Um valor de 0 implica que nenhuma parte da quota é reservada para recuperar o atraso no trabalho.

- `group_replication_flow_control_max_quota`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_max_quota` define a quota máxima de controle de fluxo do grupo, ou a quota máxima disponível para qualquer período enquanto o controle de fluxo estiver habilitado. Um valor de 0 implica que não há nenhuma quota máxima definida. O valor desta variável do sistema não pode ser menor que `group_replication_flow_control_min_quota` e `group_replication_flow_control_min_recovery_quota`.

- `group_replication_flow_control_member_quota_percent`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_member_quota_percent` define a porcentagem da quota que um membro deve assumir como disponível para si mesmo ao calcular as cotas. Um valor de 0 implica que a quota deve ser dividida igualmente entre os membros que foram escritores no último período.

- `group_replication_flow_control_min_quota`

  <table summary="Propriedades para group_replication_allow_local_lower_version_join"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_allow_local_lower_version_join</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_min_quota` controla a menor quota de controle de fluxo que pode ser atribuída a um membro, independentemente da quota mínima calculada executada no último período. Um valor de 0 implica que não há nenhuma quota mínima. O valor desta variável do sistema não pode ser maior que `group_replication_flow_control_max_quota`.

- `group_replication_flow_control_min_recovery_quota`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>0

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_min_recovery_quota` controla a cotas mais baixas que podem ser atribuídas a um membro devido a outro membro em recuperação no grupo, independentemente da cotas mínimas calculadas executadas no último período. Um valor de 0 implica que não há cotas mínimas. O valor desta variável do sistema não pode ser maior que `group_replication_flow_control_max_quota`.

- `group_replication_flow_control_mode`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>1

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_mode` especifica o modo utilizado para o controle de fluxo.

- `group_replication_flow_control_period`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>2

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_period` define quantos segundos esperar entre as iterações de controle de fluxo, nos quais as mensagens de controle de fluxo são enviadas e as tarefas de gerenciamento de controle de fluxo são executadas.

- `group_replication_flow_control_release_percent`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>3

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente.

  `group_replication_flow_control_release_percent` define como a quota do grupo deve ser liberada quando o controle de fluxo não precisa mais restringir os membros do escritor, com essa porcentagem sendo o aumento da quota por período de controle de fluxo. Um valor de 0 implica que, uma vez que os limites do controle de fluxo estejam dentro dos limites, a quota é liberada em uma única iteração do controle de fluxo. A faixa permite que a quota seja liberada até 10 vezes a quota atual, pois isso permite um maior grau de adaptação, principalmente quando o período de controle de fluxo é grande e as cotas são muito pequenas.

- `group_replication_force_members`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>4

  Esta variável de sistema é usada para forçar uma nova adesão a um grupo. O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entra em vigor imediatamente. Você só precisa definir o valor da variável de sistema em um dos membros do grupo que permanecerá no grupo. Para obter detalhes sobre a situação em que você pode precisar forçar uma nova adesão a um grupo e um procedimento a seguir ao usar esta variável de sistema, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

  `group_replication_force_members` especifica uma lista de endereços de pares como uma lista separada por vírgula, como `host1:port1`, `host2:port2`. Qualquer membro existente que não esteja na lista não receberá uma nova visualização do grupo e será bloqueado. Para cada membro existente que deve continuar como membro, você deve incluir o endereço IP ou o nome do host e a porta, conforme fornecidos na variável de sistema `group_replication_local_address` para cada membro. Um endereço IPv6 deve ser especificado entre colchetes. Por exemplo:

  ```
  "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061,example.org:33061"
  ```

  O mecanismo de comunicação em grupo para a Replicação em Grupo (XCom) verifica se os endereços IP fornecidos estão em um formato válido e se você não incluiu nenhum membro do grupo que esteja atualmente inacessível. Caso contrário, a nova configuração não será validada, então você deve ter cuidado para incluir apenas servidores online que sejam membros acessíveis do grupo. Quaisquer valores incorretos ou nomes de host inválidos na lista podem fazer com que o grupo seja bloqueado com uma configuração inválida.

  É importante, antes de forçar uma nova configuração de membro, garantir que os servidores que serão excluídos tenham sido desligados. Se não estiverem desligados, desligue-os antes de prosseguir. Membros do grupo que ainda estiverem online podem formar automaticamente novas configurações, e se isso já tiver ocorrido, forçar uma nova configuração pode criar uma situação de "cérebro partido" artificial para o grupo.

  Depois de usar a variável de sistema `group_replication_force_members` para forçar com sucesso a nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. `group_replication_force_members` deve estar vazio para emitir uma declaração `START GROUP_REPLICATION`.

- `group_replication_group_name`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>5

  O valor desta variável do sistema não pode ser alterado enquanto a replicação em grupo estiver em execução.

  `group_replication_group_name` especifica o nome do grupo ao qual essa instância do servidor pertence, que deve ser um UUID válido. Esse UUID faz parte dos GTIDs que são usados quando as transações recebidas pelos membros do grupo de clientes e os eventos de visualização de alterações gerados internamente pelos membros do grupo são escritos no log binário.

  Importante

  Deve-se usar um UUID único.

- `group_replication_group_seeds`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>6

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_group_seeds` é uma lista de membros do grupo aos quais um membro que se junta pode se conectar para obter detalhes de todos os membros atuais do grupo. O membro que se junta usa esses detalhes para selecionar e se conectar a um membro do grupo para obter os dados necessários para a sincronização com o grupo. A lista consiste em um único endereço de rede interna ou nome de host para cada membro de semente incluído, conforme configurado na variável de sistema `group_replication_local_address` do membro de semente (não a conexão de cliente SQL do membro de semente, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server). Os endereços dos membros de semente são especificados como uma lista separada por vírgula, como `host1:port1`,`host2:port2`. Um endereço IPv6 deve ser especificado entre colchetes. Por exemplo:

  ```
  group_replication_group_seeds= "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061, example.org:33061"
  ```

  Observe que o valor especificado para essa variável não é validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) esteja disponível.

  Normalmente, essa lista consiste em todos os membros do grupo, mas você pode escolher um subconjunto dos membros do grupo para serem as sementes. A lista deve conter pelo menos um endereço de membro válido. Cada endereço é validado ao iniciar a Replicação em Grupo. Se a lista não contiver nenhum endereço de membro válido, o comando `START GROUP_REPLICATION` falhará.

  Quando um servidor está se juntando a um grupo de replicação, ele tenta se conectar ao primeiro membro inicial listado na variável de sistema `group_replication_group_seeds`. Se a conexão for recusada, o membro que está se juntando tenta se conectar a cada um dos outros membros iniciais na lista em ordem. Se o membro que está se juntando se conectar a um membro inicial, mas não for adicionado ao grupo de replicação como resultado (por exemplo, porque o membro inicial não tem o endereço do membro que está se juntando em sua allowlist e fecha a conexão), o membro que está se juntando continua tentando os membros iniciais restantes na lista em ordem.

  Um membro associado deve se comunicar com o membro inicial usando o mesmo protocolo (IPv4 ou IPv6) que o membro inicial anuncia na opção `group_replication_group_seeds`. Para fins de permissões de endereço IP para a Replicação em Grupo, a lista de permissão no membro inicial deve incluir um endereço IP do membro associado para o protocolo oferecido pelo membro inicial, ou um nome de host que resolva para um endereço desse protocolo. Esse endereço ou nome de host deve ser configurado e permitido além do `group_replication_local_address` do membro associado, se o protocolo para esse endereço não corresponder ao protocolo anunciado pelo membro inicial. Se um membro associado não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP para Replicação em Grupo”.

- `group_replication_gtid_assignment_block_size`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>7

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_gtid_assignment_block_size` especifica o número de GTIDs consecutivos reservados para cada membro do grupo. Cada membro consome seus próprios blocos e reserva mais quando necessário.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

- `group_replication_ip_allowlist`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>8

  `group_replication_ip_allowlist` está disponível a partir do MySQL 8.0.22 para substituir `group_replication_ip_whitelist`. A partir do MySQL 8.0.24, o valor desta variável de sistema pode ser alterado enquanto a Replicação por Grupo estiver em execução, e a alteração entra em vigor imediatamente no membro.

  `group_replication_ip_allowlist` especifica quais hosts têm permissão para se conectar ao grupo. Quando a pilha de comunicação XCom está em uso para o grupo (`group_replication_communication_stack=XCOM`), a lista de permissão é usada para controlar o acesso ao grupo. Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack=MYSQL`), a autenticação de usuário é usada para controlar o acesso ao grupo, e a lista de permissão não é usada e é ignorada se definida.

  O endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve ser permitido nos outros servidores do grupo de replicação. Observe que o valor que você especificar para essa variável não será validado até que uma declaração `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação do Grupo (GCS) estiver disponível.

  Por padrão, essa variável de sistema é definida como `AUTOMATIC`, o que permite conexões de subredes privadas ativas no host. O mecanismo de comunicação de grupo para a Replicação de Grupo (XCom) escaneia automaticamente as interfaces ativas no host e identifica aquelas com endereços em subredes privadas. Esses endereços e o endereço IP `localhost` para IPv4 e (a partir do MySQL 8.0.14) IPv6 são usados para criar a lista de permissões de endereço de IP da Replicação de Grupo. Para uma lista dos intervalos a partir dos quais os endereços são permitidos automaticamente, consulte a Seção 20.6.4, “Permissões de Endereço de IP da Replicação de Grupo”.

  A lista de endereços privados permitidos automaticamente não pode ser usada para conexões de servidores externos à rede privada. Para conexões de replicação em grupo entre instâncias de servidor em máquinas diferentes, você deve fornecer endereços IP públicos e especificá-los como uma lista explícita de permissão. Se você especificar qualquer entrada na lista de permissão, os endereços privados não serão adicionados automaticamente, portanto, se você usar qualquer um deles, você deve especificá-los explicitamente. Os endereços IP `localhost` são adicionados automaticamente.

  Como valor da opção `group_replication_ip_allowlist`, você pode especificar qualquer combinação dos seguintes:

  - Endereços IPv4 (por exemplo, `198.51.100.44`)

  - Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

  - Endereços IPv6, no MySQL 8.0.14 e versões posteriores (por exemplo, `2001:db8:85a3:8d3:1319:8a2e:370:7348`)

  - Endereços IPv6 usando notação CIDR, no MySQL 8.0.14 e versões posteriores (por exemplo, `2001:db8:85a3:8d3::/64`)

  - Nomes de hospedagem (por exemplo, `example.org`)

  - Nomes de host com notação CIDR (por exemplo, `www.example.com/24`)

  Antes do MySQL 8.0.14, os nomes de host podiam resolver apenas para endereços IPv4. A partir do MySQL 8.0.14, os nomes de host podem resolver para endereços IPv4, endereços IPv6 ou ambos. Se um nome de host resolver para tanto um endereço IPv4 quanto um IPv6, o endereço IPv4 é sempre usado para conexões de Replicação em Grupo. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas você deve garantir que todos os endereços IP na sub-rede especificada estejam sob seu controle.

  Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

  ```
  "192.0.2.21/24,198.51.100.44,203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,example.org,www.example.com/24"
  ```

  Se algum dos membros iniciais do grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6, enquanto um membro que está se juntando tiver um endereço IPv4 `group_replication_local_address`, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro que está se juntando para o protocolo oferecido pelo membro inicial (ou um nome de host que resolva para um endereço desse protocolo). Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP de Replicação de Grupo”.

  É possível configurar diferentes listas de permissões para diferentes membros do grupo de acordo com os requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. No entanto, isso pode causar problemas quando um grupo é reconfigurado. Se você não tiver um requisito de segurança específico para fazer o contrário, use a mesma lista de permissões em todos os membros de um grupo. Para mais detalhes, consulte a Seção 20.6.4, “Permissões de Endereços IP de Replicação de Grupo”.

  Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação da lista de permissão, e uma mensagem de aviso é escrita no log de erros. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

  Aviso

  Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação do FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique os nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.

- `group_replication_ip_whitelist`

  <table summary="Propriedades para group_replication_auto_increment_increment"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-auto-increment-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_auto_increment_increment</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>9

  A partir do MySQL 8.0.22, `group_replication_ip_whitelist` é descontinuado e `group_replication_ip_allowlist` está disponível para substituí-lo. Para ambas as variáveis de sistema, o valor padrão é `AUTOMATIC`.

  Ao iniciar a replicação em grupo, se uma das variáveis do sistema tiver sido definida para um valor definido pelo usuário e a outra não, o valor alterado será utilizado. Se ambas as variáveis do sistema tiverem sido definidas para um valor definido pelo usuário, o valor de `group_replication_ip_allowlist` será utilizado.

  Se você alterar o valor de `group_replication_ip_whitelist` ou `group_replication_ip_allowlist` enquanto a Replicação em Grupo estiver em execução, o que é possível a partir do MySQL 8.0.24, nenhuma das variáveis tem precedência sobre a outra.

  A nova variável de sistema funciona da mesma maneira que a antiga variável de sistema, apenas a terminologia mudou. A descrição do comportamento dada para `group_replication_ip_allowlist` se aplica tanto às variáveis de sistema antigas quanto às novas.

- `group_replication_local_address`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>0

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_local_address` define o endereço de rede que o membro fornece para conexões de outros membros, especificado como uma string formatada `host:port`. Esse endereço deve ser acessível por todos os membros do grupo, pois é usado pelo motor de comunicação do grupo para a Replicação em Grupo (XCom, uma variante do Paxos) para comunicação TCP entre instâncias remotas do XCom. Se você estiver usando a pilha de comunicação MySQL para estabelecer conexões de comunicação de grupo entre membros (`group_replication_communication_stack` = MYSQL), o endereço deve ser um dos endereços IP e portas onde o MySQL Server está ouvindo, conforme especificado pela variável de sistema `bind_address` para o servidor.

  Aviso

  Não use este endereço para consultar ou administrar as bases de dados do membro. Este não é o host e a porta de conexão do cliente SQL.

  O endereço ou nome de host que você especifica em `group_replication_local_address` é usado pela Replicação em Grupo como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar a mesma porta para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, e você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que as portas sejam todas diferentes. A porta recomendada para `group_replication_local_address` é 33061. Observe que o valor que você especifica para essa variável não é validado até que a instrução `START GROUP_REPLICATION` seja emitida e o Sistema de Comunicação em Grupo (GCS) esteja disponível.

  O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível através do DNS, arquivos de configuração `/etc/hosts` corretamente configurados ou outros processos de resolução de nomes. A partir do MySQL 8.0.14, endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4. Um endereço IPv6 deve ser especificado entre colchetes para distinguir o número da porta, por exemplo:

  ```
  group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
  ```

  Se um nome de host especificado como o endereço local de replicação de grupo para uma instância de servidor resolver tanto para um endereço IPv4 quanto para um endereço IPv6, o endereço IPv4 é sempre usado para conexões de replicação de grupo. Para obter mais informações sobre o suporte da replicação de grupo para redes IPv6 e sobre grupos de replicação com uma mistura de membros que usam IPv4 e membros que usam IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4”.

  Se você estiver usando a pilha de comunicação XCom para estabelecer conexões de comunicação em grupo entre os membros (`group_replication_communication_stack = XCOM`), o endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve ser adicionado à lista para a variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist` (para o MySQL 8.0.21 e versões anteriores) nos outros servidores do grupo de replicação. Quando a pilha de comunicação XCom estiver em uso para o grupo, a lista de permissões (allowlist) será usada para controlar o acesso ao grupo. Quando a pilha de comunicação MySQL estiver em uso para o grupo, a autenticação de usuário será usada para controlar o acesso ao grupo, e a lista de permissões (allowlist) não será usada e será ignorada se definida. Se algum dos membros iniciais do grupo estiver listado em `group_replication_group_seeds` com um endereço IPv6, quando esse membro tiver um endereço IPv4 `group_replication_local_address`, ou vice-versa, você também deve configurar e permitir um endereço alternativo para esse membro para o protocolo necessário (ou um nome de host que resolva para um endereço para esse protocolo). Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP de Replicação de Grupo”.

- `group_replication_member_expel_timeout`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>1

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente. O valor atual da variável do sistema é lido sempre que a Replicação em Grupo verifica o tempo de espera. Não é obrigatório que todos os membros de um grupo tenham a mesma configuração, mas é recomendado para evitar expulsões inesperadas.

  `group_replication_member_expel_timeout` especifica o período de tempo em segundos que um membro do grupo de replicação em grupo espera após criar uma suspeita, antes de expulsar do grupo o membro suspeito de ter falhado. O período inicial de detecção de 5 segundos antes de uma suspeita ser criada não é considerado parte desse tempo. Até e incluindo o MySQL 8.0.20, o valor de `group_replication_member_expel_timeout` é padrão para 0, o que significa que não há período de espera e um membro suspeito é responsável pela expulsão imediatamente após o término do período de detecção de 5 segundos. A partir do MySQL 8.0.21, o valor é padrão para 5, o que significa que um membro suspeito é responsável pela expulsão 5 segundos após o término do período de detecção de 5 segundos.

  A alteração do valor de `group_replication_member_expel_timeout` em um membro do grupo terá efeito imediatamente para suspeitas existentes e futuras desse membro do grupo. Portanto, você pode usar isso como um método para forçar o tempo de expiração de uma suspeita e expulsar um membro suspeito, permitindo alterações na configuração do grupo. Para mais informações, consulte a Seção 20.7.7.1, “Expiração de Tempo de Expulsão”.

  Aumentar o valor de `group_replication_member_expel_timeout` pode ajudar a evitar expulsões desnecessárias em redes mais lentas ou menos estáveis, ou no caso de interrupções transitórias esperadas na rede ou desacelerações das máquinas. Se um membro suspeito voltar a ser ativo antes que a suspeita expire, ele aplica todas as mensagens que foram armazenadas pelos membros restantes do grupo e entra no estado `ONLINE`, sem intervenção do operador. Você pode especificar um valor de tempo de espera de até 3600 segundos (1 hora). É importante garantir que o cache de mensagens do XCom seja suficientemente grande para conter o volume esperado de mensagens no seu período de tempo especificado, mais o período inicial de detecção de 5 segundos, caso contrário, os membros não poderão se reconectar. Você pode ajustar o limite de tamanho do cache usando a variável de sistema `group_replication_message_cache_size`. Para mais informações, consulte a Seção 20.7.6, “Gestão do Cache do XCom”.

  Se o tempo limite for excedido, o membro suspeito fica responsável pela expulsão imediatamente após o tempo de suspeita expirar. Se o membro conseguir retomar as comunicações e receber uma notificação de expulsão, e o membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de reinclusão automática, ele prosseguirá com o número especificado de tentativas para reincorporar-se ao grupo enquanto estiver no modo de leitura apenas para superusuários. Se o membro não tiver nenhuma tentativa de reinclusão automática especificada ou se tiver esgotado o número especificado de tentativas, ele seguirá a ação especificada pela variável de sistema `group_replication_exit_state_action`.

  Para obter mais informações sobre o uso da configuração `group_replication_member_expel_timeout`, consulte a Seção 20.7.7.1, “Timeout de Expulsão”. Para estratégias alternativas de mitigação para evitar expulsões desnecessárias quando essa variável do sistema não estiver disponível, consulte a Seção 20.3.2, “Limitações da Replicação em Grupo”.

- `group_replication_member_weight`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>2

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente. O valor atual da variável de sistema é lido quando ocorre uma situação de falha.

  `group_replication_member_weight` especifica um peso percentual que pode ser atribuído aos membros para influenciar a chance de o membro ser eleito como primário em caso de falha, por exemplo, quando o primário existente deixa um grupo de primário único. Atribua pesos numéricos aos membros para garantir que membros específicos sejam eleitos, por exemplo, durante a manutenção programada do primário ou para garantir que certos equipamentos sejam priorizados em caso de falha.

  Para um grupo com membros configurados da seguinte forma:

  - `member-1`: grupo\_replication\_member\_weight=30, server\_uuid=aaaa

  - `member-2`: grupo\_replication\_member\_weight=40, server\_uuid=bbbb

  - `member-3`: grupo\_replication\_member\_weight=40, server\_uuid=cccc

  - `member-4`: grupo\_replication\_member\_weight=40, server\_uuid=dddd

  Durante a eleição de uma nova primária, os membros acima seriam classificados como `member-2`, `member-3`, `member-4` e `member-1`. Isso resulta em \[\[`member`]-2]] sendo escolhido como a nova primária em caso de falha. Para mais informações, consulte a Seção 20.1.3.1, “Modo de Primária Única”.

- `group_replication_message_cache_size`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>3

  Essa variável de sistema deve ter o mesmo valor em todos os membros do grupo. O valor dessa variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução. A alteração entra em vigor em cada membro do grupo após você parar e reiniciar a Replicação em Grupo no membro. Durante esse processo, o valor da variável de sistema pode diferir entre os membros do grupo, mas os membros podem não conseguir se reconectar em caso de desconexão.

  `group_replication_message_cache_size` define a quantidade máxima de memória disponível para o cache de mensagens no motor de comunicação de grupo para a Replicação em Grupo (XCom). O cache de mensagens do XCom armazena mensagens (e seus metadados) que são trocadas entre os membros do grupo como parte do protocolo de consenso. Entre outras funções, o cache de mensagens é usado para a recuperação de mensagens perdidas por membros que se reconectam ao grupo após um período em que não conseguiram se comunicar com os outros membros do grupo.

  A variável de sistema `group_replication_member_expel_timeout` determina o período de espera (até uma hora) que é permitido, além do período inicial de detecção de 5 segundos, para que os membros retornem ao grupo em vez de serem expulsos. O tamanho do cache de mensagens XCom deve ser definido com referência ao volume esperado de mensagens nesse período de tempo, para que ele contenha todas as mensagens perdidas necessárias para que os membros retornem com sucesso. Até o MySQL 8.0.20, o padrão é apenas o período de detecção de 5 segundos, mas a partir do MySQL 8.0.21, o padrão é um período de espera de 5 segundos após o período de detecção de 5 segundos, para um período de tempo total de 10 segundos.

  Certifique-se de que há memória suficiente disponível no seu sistema para o limite de tamanho de cache escolhido, considerando o tamanho dos outros caches e pools de objetos do servidor. O ajuste padrão é de 1073741824 bytes (1 GB). O ajuste mínimo também é de 1 GB até o MySQL 8.0.20. A partir do MySQL 8.0.21, o ajuste mínimo é de 134217728 bytes (128 MB), o que permite a implantação em um host com uma quantidade limitada de memória disponível e boa conectividade de rede para minimizar a frequência e a duração das perdas transitórias de conectividade para os membros do grupo. Observe que o limite definido usando `group_replication_message_cache_size` aplica-se apenas aos dados armazenados no cache, e as estruturas do cache requerem um adicional de 50 MB de memória.

  O limite de tamanho do cache pode ser aumentado ou reduzido dinamicamente durante a execução. Se você reduzir o limite de tamanho do cache, o XCom remove as entradas mais antigas que foram decididas e entregues até que o tamanho atual esteja abaixo do limite. O Sistema de Comunicação de Grupo (GCS) do Replicação em Grupo (Group Replication) o alerta, por meio de uma mensagem de aviso, quando uma mensagem que provavelmente será necessária para a recuperação por um membro que atualmente não é acessível é removida do cache de mensagens. Para obter mais informações sobre o ajuste do tamanho do cache de mensagens, consulte a Seção 20.7.6, “Gestão do Cache do XCom”.

- `group_replication_paxos_single_leader`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>4

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_paxos_single_leader` permite que o motor de comunicação de grupo opere com um único líder de consenso quando o grupo está no modo de primário único. Com a configuração padrão `OFF`, esse comportamento é desativado, e cada membro do grupo é usado como líder, que é o comportamento em versões anteriores a essa variável do sistema estar disponível. Quando essa variável é definida como `ON`, o motor de comunicação de grupo pode usar um único líder para impulsionar o consenso. Operar com um único líder de consenso melhora o desempenho e a resiliência no modo de primário único, especialmente quando alguns dos membros secundários do grupo estão atualmente inacessíveis. Para mais informações, consulte a Seção 20.7.3, “Liderança de Consenso Única”.

  Para que o mecanismo de comunicação de grupo use um único líder de consenso, a versão do protocolo de comunicação do grupo deve ser MySQL 8.0.27 ou posterior. Use `group_replication_get_communication_protocol()` para obter a versão do protocolo de comunicação do grupo. Se estiver sendo usada uma versão inferior, o grupo não poderá usar esse comportamento. Você pode usar `group_replication_set_communication_protocol()` para definir o protocolo de comunicação para uma versão superior, se todos os membros do grupo o suportarem. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

  A coluna `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE` da tabela do Schema de Desempenho `replication_group_communication_information` mostra se o grupo suporta o uso de um único líder, mesmo que `group_replication_paxos_single_leader` esteja atualmente definido como `OFF` no membro pesquisado. O valor da coluna é 1 se o grupo foi iniciado com `group_replication_paxos_single_leader` definido como `ON` e sua versão do protocolo de comunicação é MySQL 8.0.27 ou posterior.

- `group_replication_poll_spin_loops`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>5

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_poll_spin_loops` especifica quantas vezes o fio de comunicação do grupo aguarda pelo mutex do motor de comunicação ser liberado antes que o fio espere por mais mensagens de rede recebidas.

- `group_replication_recovery_complete_at`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>6

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_complete_at` especifica a política aplicada durante o processo de recuperação distribuída ao lidar com transações em cache após a transferência de estado de um membro existente. Você pode escolher se um membro é marcado como online após receber e certificar todas as transações que ele perdeu antes de se juntar ao grupo (`TRANSACTIONS_CERTIFIED`), ou apenas após recebê-las, certificá-las e aplicá-las (`TRANSACTIONS_APPLIED`).

  Esta variável foi descontinuada a partir do MySQL 8.0.34 (como é o caso de `TRANSACTIONS_CERTIFIED`). Espere sua remoção em uma futura versão do MySQL.

- `group_replication_recovery_compression_algorithms`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>7

  `group_replication_recovery_compression_algorithms` especifica os algoritmos de compressão permitidos para as conexões de recuperação distribuída da replicação em grupo para a transferência de estado a partir do log binário de um doador. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  Essa configuração não se aplica se o servidor tiver sido configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”) e uma operação de clonagem remota for usada durante a recuperação distribuída. Para esse método de transferência de estado, a configuração `clone_enable_compression` do plugin de clonagem é aplicada.

- `group_replication_recovery_get_public_key`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>8

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_get_public_key` especifica se é necessário solicitar à fonte a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Se `group_replication_recovery_public_key_path` estiver definido como um arquivo de chave pública válido, ele terá precedência sobre `group_replication_recovery_get_public_key`. Esta variável é aplicável se você não estiver usando SSL para recuperação distribuída pelo canal `group_replication_recovery` (`group_replication_recovery_use_ssl=ON`), e a conta de usuário de replicação para a Replicação em Grupo autentica com o plugin `caching_sha2_password` (o padrão). Para mais detalhes, consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação Caching SHA-2”.

- `group_replication_recovery_public_key_path`

  <table summary="Propriedades para group_replication_autorejoin_tries"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-autorejoin-tries=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_autorejoin_tries</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão (≥ 8.0.21)</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor padrão (≤ 8.0.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2016</code>]]</td> </tr></tbody></table>9

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_public_key_path` especifica o nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo ponto de origem para a troca de senhas baseada em pares de chaves RSA. O arquivo deve estar no formato PEM. Se `group_replication_recovery_public_key_path` for definido como um arquivo de chave pública válido, ele terá precedência sobre `group_replication_recovery_get_public_key`. Esta variável se aplica se você não estiver usando SSL para recuperação distribuída pelo canal `group_replication_recovery` (então `group_replication_recovery_use_ssl` será definido como `OFF`), e a conta de usuário de replicação para a replicação em grupo autentica com o plugin `caching_sha2_password` (o padrão) ou o plugin `sha256_password`. (Para `sha256_password`, definir `group_replication_recovery_public_key_path` se aplica apenas se o MySQL foi construído usando OpenSSL.) Para mais detalhes, consulte a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação Caching SHA-2”.

- `group_replication_recovery_reconnect_interval`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_reconnect_interval` especifica o tempo de espera, em segundos, entre as tentativas de reconexão quando nenhum doador adequado foi encontrado no grupo para recuperação distribuída.

- `group_replication_recovery_retry_count`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_retry_count` especifica quantas vezes o membro que está se conectando tenta se conectar aos doadores disponíveis para a recuperação distribuída antes de desistir.

- `group_replication_recovery_ssl_ca`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_ca` especifica o caminho para um arquivo que contém uma lista de autoridades de certificados SSL confiáveis para conexões de recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL do clone `clone_ssl_ca` para corresponder à sua configuração para `group_replication_recovery_ssl_ca`.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_capath`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_capath` especifica o caminho para um diretório que contém certificados de autoridade de certificação SSL confiáveis para conexões de recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_cert`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_cert` especifica o nome do arquivo de certificado SSL a ser usado para estabelecer uma conexão segura para a recuperação distribuída. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para a recuperação distribuída.

  Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL do clone `clone_ssl_cert` para corresponder à sua configuração para `group_replication_recovery_ssl_cert`.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_cipher`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_cipher` especifica a lista de cifra permitida para a criptografia SSL. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_crl`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_crl` especifica o caminho para um diretório que contém arquivos contendo listas de revogação de certificados. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_crlpath`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_crlpath` especifica o caminho para um diretório que contém arquivos contendo listas de revogação de certificados. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_key`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_key` especifica o nome do arquivo de chave SSL a ser usado para estabelecer uma conexão segura. Consulte a Seção 20.6.2, "Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL") para obter informações sobre a configuração do SSL para recuperação distribuída.

  Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você configurou `group_replication_recovery_use_ssl` para `ON`, a Replicação em Grupo configura automaticamente a configuração da opção SSL do clone `clone_ssl_key` para corresponder à sua configuração para `group_replication_recovery_ssl_key`.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_ssl_verify_server_cert`

  <table summary="Propriedades para group_replication_bootstrap_group"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-bootstrap-group[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_bootstrap_group</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_ssl_verify_server_cert` especifica se a conexão de recuperação distribuída deve verificar o valor do Nome Comum do servidor no certificado enviado pelo doador. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_tls_ciphersuites`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>0

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_tls_ciphersuites` especifica uma lista separada por vírgula de uma ou mais suítes de cifra permitidas quando o TLSv1.3 é usado para criptografia de conexão para a conexão de recuperação distribuída, e essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. Se essa variável de sistema for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a variável de sistema), as suítes de cifra habilitadas por padrão serão permitidas, conforme listadas na Seção 8.3.2, “Protocolos e cifras de conexão TLS Encriptada”. Se essa variável de sistema for definida como uma string vazia, nenhuma suíte de cifra será permitida, e, portanto, o TLSv1.3 não será usado. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupos com Secure Socket Layer (SSL”)”), para obter informações sobre a configuração do SSL para recuperação distribuída.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

- `group_replication_recovery_tls_version`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>1

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_tls_version` especifica uma lista separada por vírgula de um ou mais protocolos TLS permitidos para criptografia de conexão quando essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. Os membros do grupo envolvidos em cada conexão de recuperação distribuída, como cliente (membro que está se juntando) e servidor (doador), negociam a versão mais alta do protocolo que ambos estão configurados para suportar.

  Quando a pilha de comunicação MySQL está em uso para o grupo (`group_replication_communication_stack = MYSQL`), essa configuração é usada para a configuração TLS/SSL das conexões de comunicação do grupo, bem como para conexões de recuperação distribuída.

  Se essa variável de sistema não for definida, o padrão “`TLSv1,TLSv1.1,TLSv1.2,TLSv1.3`” será usado até e incluindo o MySQL 8.0.27, e a partir do MySQL 8.0.28, o padrão “`TLSv1.2,TLSv1.3`” será usado. Certifique-se de que as versões do protocolo especificadas estejam contiguas, sem números de versão omitidos no meio da sequência.

  Importante

  - O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido do MySQL a partir do MySQL 8.0.28. Os protocolos foram descontinuados no MySQL 8.0.26, embora os clientes do MySQL, incluindo as instâncias do servidor de replicação de grupo que atuam como clientes, não retornem quaisquer avisos quando uma versão de protocolo TLS descontinuada é usada. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

  - O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL tenha sido compilado com o OpenSSL 1.1.1. O servidor verifica a versão do OpenSSL no momento do início, e se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão da variável do sistema. Nesse caso, o padrão é `TLSv1,TLSv1.1,TLSv1.2` antes do MySQL 8.0.28 e `TLSv1.2` depois.

  - A replicação em grupo suporta TLSv1.3 a partir do MySQL 8.0.18, com suporte para seleção de conjuntos de cifra adicionado no MySQL 8.0.19. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação em grupo com Secure Socket Layer (SSL”)” para obter mais informações.

  Consulte a Seção 20.6.2, "Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL)" para obter informações sobre a configuração do SSL para recuperação distribuída.

- `group_replication_recovery_use_ssl`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>2

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_use_ssl` especifica se as conexões de recuperação distribuída do Grupo devem usar SSL ou não entre os membros do grupo. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para recuperação distribuída.

  Se este servidor foi configurado para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e você definiu essa opção para `ON`, a Replicação em Grupo usa SSL para operações de clonagem remota, bem como para transferência de estado de um log binário do doador. Se você definir essa opção para `OFF`, a Replicação em Grupo não usa SSL para operações de clonagem remota.

- `group_replication_recovery_zstd_compression_level`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>3

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_recovery_zstd_compression_level` especifica o nível de compressão a ser usado para as conexões de recuperação distribuída do Grupo de Replicação que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. Para conexões de recuperação distribuída que não utilizam a compressão `zstd`, essa variável não tem efeito.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- `group_replication_single_primary_mode`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>4

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_single_primary_mode` instrui o grupo a escolher um único servidor automaticamente para ser o responsável pela carga de trabalho de leitura/escrita. Esse servidor é o principal e os outros são secundários.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.

  Definir essa variável `ON` faz com que qualquer configuração para `group_replication_auto_increment_increment` seja ignorada.

  No MySQL 8.0.16 e versões posteriores, você pode usar as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para alterar o valor dessa variável do sistema enquanto o grupo ainda estiver em execução. Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”.

- `group_replication_ssl_mode`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>5

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_ssl_mode` define o estado de segurança das conexões de comunicação de grupo entre os membros da Replicação em Grupo. Os valores possíveis são os seguintes:

  DESABILITADO:   Estabelecer uma conexão não criptografada (padrão).

  REQUERIDO: Estabeleça uma conexão segura, se o servidor suportar conexões seguras.

  VERIFY\_CA:  Como `REQUIRED`, mas, adicionalmente, verifique o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.

  VERIFY\_IDENTITY:  Assim como `VERIFY_CA`, mas, adicionalmente, verifique se o certificado do servidor corresponde ao hospedeiro ao qual a conexão é tentada.

  Essa variável deve ter o mesmo valor em todos os membros do grupo; caso contrário, novos membros podem não conseguir se juntar.

  Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)” para obter informações sobre a configuração do SSL para comunicação de grupo.

- `group_replication_start_on_boot`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>6

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_start_on_boot` especifica se o servidor deve iniciar a Replicação em Grupo automaticamente (`ON`) ou não (`OFF`) durante o início do servidor. Quando você define essa opção para `ON`, a Replicação em Grupo é reiniciada automaticamente após uma operação de clonagem remota ser usada para recuperação distribuída.

  Para iniciar a replicação em grupo automaticamente durante o início do servidor, as credenciais do usuário para a recuperação distribuída devem ser armazenadas nos repositórios de metadados de replicação no servidor usando a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Se você prefere especificar as credenciais do usuário como parte de `START GROUP_REPLICATION`, que armazena as credenciais do usuário apenas na memória, certifique-se de que `group_replication_start_on_boot` esteja definido como `OFF`.

- `group_replication_tls_source`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>7

  O valor desta variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, mas a alteração só terá efeito após você parar e reiniciar a Replicação em Grupo no membro do grupo.

  `group_replication_tls_source` especifica a fonte de material TLS para a Replicação em Grupo.

- `group_replication_transaction_size_limit`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>8

  Essa variável de sistema deve ter o mesmo valor em todos os membros do grupo. O valor dessa variável de sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução. A alteração entra em vigor imediatamente no membro do grupo e se aplica a partir da próxima transação iniciada nesse membro. Durante esse processo, o valor da variável de sistema pode diferir entre os membros do grupo, mas algumas transações podem ser rejeitadas.

  `group_replication_transaction_size_limit` configura o tamanho máximo da transação em bytes que o grupo de replicação aceita. Transações maiores que esse tamanho são revertidas pelo membro receptor e não são transmitidas para o grupo. Grandes transações podem causar problemas para um grupo de replicação em termos de alocação de memória, o que pode fazer com que o sistema desacelere, ou em termos de consumo de largura de banda da rede, o que pode fazer com que um membro seja suspeito de ter falhado porque está ocupado processando a grande transação.

  Quando essa variável de sistema é definida como 0, não há limite para o tamanho das transações que o grupo aceita. O valor padrão é de 150000000 bytes (aproximadamente 143 MB). Ajuste o valor dessa variável de sistema de acordo com o tamanho máximo da mensagem que o grupo deve tolerar, tendo em mente que o tempo necessário para processar uma transação é proporcional ao seu tamanho. O valor de `group_replication_transaction_size_limit` deve ser o mesmo em todos os membros do grupo. Para obter mais estratégias de mitigação para transações grandes, consulte a Seção 20.3.2, “Limitações da Replicação em Grupo”.

- `group_replication_unreachable_majority_timeout`

  <table summary="Propriedades para grupo_replication_clone_threshold"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-clone-threshold=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_clone_threshold</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9223372036854775807</code>]]</td> </tr><tr><th>Unidade</th> <td>transações</td> </tr></tbody></table>9

  O valor desta variável do sistema pode ser alterado enquanto a Replicação em Grupo estiver em execução, e a alteração entrará em vigor imediatamente. O valor atual da variável do sistema é lido quando ocorre um problema que indica que o comportamento é necessário.

  `group_replication_unreachable_majority_timeout` especifica o número de segundos durante os quais os membros que sofrem uma partição de rede e não conseguem se conectar à maioria esperam antes de sair do grupo. Em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) agora está em minoria porque não consegue contatar mais de metade do grupo. Enquanto o grupo da maioria (S3, S4, S5) permanece em funcionamento, o grupo da minoria espera o tempo especificado para uma reconexão de rede. Para uma descrição detalhada deste cenário, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”.

  Por padrão, `group_replication_unreachable_majority_timeout` está definido como 0, o que significa que os membros que se encontram em minoria devido a uma partição de rede aguardam para sair do grupo para sempre. Se você definir um tempo limite, quando o tempo especificado expirar, todas as transações pendentes processadas pela minoria serão revertidas e os servidores na partição da minoria passarão para o estado `ERROR`. Se um membro tiver a variável de sistema `group_replication_autorejoin_tries` definida para especificar um número de tentativas de reinclusão automática, ele prosseguirá fazendo o número especificado de tentativas para reincluir-se no grupo enquanto estiver no modo de leitura apenas por superusuário. Se o membro não tiver nenhuma tentativa de reinclusão automática especificada ou se tiver esgotado o número especificado de tentativas, ele seguirá a ação especificada pela variável de sistema `group_replication_exit_state_action`.

  Aviso

  Quando você tem um grupo simétrico, com apenas dois membros, por exemplo (S0, S2), se houver uma partição de rede e não houver maioria, após o tempo limite configurado, todos os membros entram no estado `ERROR`.

  Para obter mais informações sobre o uso dessa opção, consulte a Seção 20.7.7.2, “Timeout de maioria inatingível”.

- `group_replication_view_change_uuid`

  <table summary="Propriedades para group_replication_communication_debug_options"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--group-replication-communication-debug-options=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_replication_communication_debug_options</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>GCS_DEBUG_NONE</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>GCS_DEBUG_NONE</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_BASIC</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_TRACE</code>]]</p><p class="valid-value">[[<code>XCOM_DEBUG_BASIC</code>]]</p><p class="valid-value">[[<code>XCOM_DEBUG_TRACE</code>]]</p><p class="valid-value">[[<code>GCS_DEBUG_ALL</code>]]</p></td> </tr></tbody></table>0

  Nota

  Essa variável de sistema é uma configuração de nível de grupo e uma reinicialização completa do grupo de replicação é necessária para que a mudança entre em vigor.

  `group_replication_view_change_uuid` especifica um UUID alternativo a ser usado como a parte UUID do identificador nos GTIDs para eventos de alteração de visualização gerados pelo grupo. O UUID alternativo facilita a distinção dessas transações geradas internamente das transações recebidas pelo grupo de clientes. Isso pode ser útil se a configuração permitir a falha entre grupos e você precisar identificar e descartar transações específicas do grupo de backup. O valor padrão para essa variável do sistema é `AUTOMATIC`, o que significa que os GTIDs para eventos de alteração de visualização usam o nome do grupo especificado pela variável do sistema `group_replication_group_name`, assim como as transações dos clientes. Os membros do grupo em uma versão que não possui essa variável do sistema são tratados como tendo o valor `AUTOMATIC`.

  O UUID alternativo deve ser diferente do nome do grupo especificado pela variável de sistema `group_replication_group_name` e deve ser diferente do UUID do servidor de qualquer membro do grupo. Além disso, deve ser diferente de quaisquer UUIDs usados nos GTIDs aplicados a transações anônimas em canais de replicação em qualquer ponto dessa topologia, usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

  Essa variável de sistema é uma configuração de nível de grupo. Ela deve ter o mesmo valor em todos os membros do grupo, não pode ser alterada enquanto a Replicação de Grupo estiver em execução e requer um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor seja efetiva. Para obter instruções sobre como bootstrapar um grupo de forma segura, onde as transações foram executadas e certificadas, consulte a Seção 20.5.2, “Reiniciar um Grupo”.

  Se o grupo tiver um valor definido para essa variável do sistema, e um membro que está se juntando tiver um valor diferente definido para a variável do sistema, o membro que está se juntando não poderá se juntar ao grupo até que o valor seja alterado para se alinhar. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que está se juntando não suportar a variável do sistema, ele não poderá se juntar ao grupo.
