#### 7.5.6.3 Componentente Gerenciador de Recursos de Replicação em Grupo

O componente Gerenciador de Recursos de Replicação em Grupo monitora o atraso do servidor secundário e o uso de memória, e pode expulsar servidores que apresentam um atraso excessivo ou que utilizam muitos recursos do grupo. O tempo de atraso e o uso de recursos permitidos são configuráveis tanto para os canais de aplicação quanto para os canais de recuperação, conforme explicado nesta seção. Este componente está disponível como parte da Edição Empresarial do MySQL.

* Propósito: Fornecer monitoramento e controle sobre o atraso do servidor secundário e o uso de recursos.

* URN: `file://component_group_replication_resource_manager`

Antes de instalar o componente Gerenciador de Recursos de Replicação em Grupo, o plugin de Replicação em Grupo deve ser instalado usando `INSTALL PLUGIN` ou `--plugin-load-add` (consulte a Seção 20.2.1.2, “Configurando uma Instância para Replicação em Grupo”). É possível instalar o componente sem que o plugin de Replicação em Grupo esteja disponível, mas, nesse caso, o componente é útil apenas para monitoramento do uso de memória e não é capaz de tomar nenhuma ação.

O componente Gerenciador de Recursos de Replicação em Grupo pode ser instalado e desinstalado usando `INSTALL COMPONENT` e `UNINSTALL COMPONENT`, respectivamente. Consulte as descrições dessas instruções, bem como a Seção 7.5.1, “Instalando e Desinstalando Componentes”, para obter mais informações.

O componente Gerenciador de Recursos de Replicação em Grupo fornece um mecanismo de expulsão automática configurável que detecta quando o aplicativo ou o canal de recuperação de um secundário de replicação em grupo está atrasado ou quando o secundário está trocando dados de forma excessiva, e expulsa o servidor problemático do grupo, ajudando assim a manter a alta disponibilidade. Devido à exigência de alta disponibilidade, *para usar a funcionalidade de expulsão automática com um grupo de replicação ativo, o grupo deve inicialmente consistir em pelo menos três membros, incluindo o primário de replicação em grupo*; isso garante que haja pelo menos dois membros (um primário e um secundário) no caso de um membro ter sido expulso.

Nota

O componente Gerenciador de Recursos de Replicação em Grupo não monitora o primário de replicação em grupo e não é destinado a expulsar o primário, mas é possível que a decisão de expulsar um secundário seja tomada pouco antes de o mesmo secundário ser promovido ao primário (devido a uma falha primária concorrente), no qual caso, o primário recém-eleito pode ser despejado.

Usando as variáveis de sistema e status fornecidas por este componente, o operador pode monitorar separadamente cada uma das três áreas de preocupação — atraso do aplicativo, atraso de recuperação e esgotamento de recursos do sistema — e definir limiares de expulsão separados para cada uma delas, conforme listados aqui:

* *Canal de Aplicação*: Obtenha o tempo em que o canal de aplicação deste servidor fica atrasado em relação ao do primário a partir da variável de estado `Gr_resource_manager_applier_channel_lag` do servidor. Você pode definir um limite superior para isso configurando a variável de sistema `group_replication_resource_manager.applier_channel_lag`; se o atraso exceder esse valor 10 vezes ou mais consecutivamente, este servidor é expulso do grupo. O limite padrão é de 3600 segundos (1 hora).

* *Canal de Recuperação*: O tempo em que o canal de recuperação deste servidor fica atrasado em relação ao do primário pode ser obtido verificando o valor da variável de estado `Gr_resource_manager_recovery_channel_lag` do servidor. Você pode definir um limite superior configurando `group_replication_resource_manager.recovery_channel_lag`; se o atraso de recuperação do secundário for maior que esse valor 10 vezes consecutivamente, este servidor é expulso do grupo. O limite padrão é de 3600 segundos (1 hora).

* *Uso de Recursos (Memória)*: A variável de sistema `group_replication_resource_manager.memory_used_limit` define o limite de consumo de memória como uma porcentagem da memória total; quando `Gr_resource_manager_memory_used` excede essa porcentagem 10 vezes consecutivamente, este servidor é expulso.

O componente Resource Manager verifica o atraso e o uso em segundos de segundos de replicação do grupo a cada 5 segundos. Esse período não é configurável pelo operador.

Um servidor que tenha sido expulso do grupo pode, posteriormente, tentar se reiniciar nele sem intervenção manual, desde que `group_replication_autorejoin_tries` esteja habilitado (caso contrário, o servidor prossegue conforme especificado por `group_replication_exit_state_action`). O mecanismo e o comportamento de auto-reinício são os mesmos descritos na Seção 20.7.7.3, “Auto-Rejoin”.

Para um membro do grupo de replicação que esteja tentando se juntar ou voltar a se juntar a um grupo após encontrar problemas e ser expulso, um período de quarentena impede a reexpulsão imediata. Esse período é rastreado individualmente para cada membro, para que, durante o período de quarentena iniciado após o membro A ter sido expulso e posteriormente autorizado a se juntar novamente ao grupo, o membro B possa ser expulso com segurança, se necessário. A duração do período de quarentena é determinada pelo valor da variável de sistema `group_replication_resource_manager.quarantine_time`. O comprimento padrão do período de quarentena é de 3600 segundos (1 hora).

O componente de Gerenciamento de Recursos fornece uma série de variáveis de status do servidor que podem ser usadas para monitorar o status da Replicação de Grupo e do componente Gerenciador de Recursos. Além das três variáveis discutidas anteriormente, incluem-se as seguintes:

* `Gr_resource_manager_applier_channel_threshold_hits`: O número de amostras que excederam `group_replication_resource_manager.applier_channel_lag`.

* `Gr_resource_manager_applier_channel_eviction_timestamp`: Quando ocorreu a última expulsão causada pelo atraso do canal de aplicativo.

* `Gr_resource_manager_recovery_channel_threshold_hits`: O número de amostras que excederam `group_replication_resource_manager.recovery_channel_lag`.

* `Gr_resource_manager_recovery_channel_eviction_timestamp`: Quando ocorreu a última expulsão causada pelo atraso do canal de recuperação.

* `Gr_resource_manager_memory_threshold_hits`: O número de amostras que excederam `group_replication_resource_manager.memory_used_limit`.

* `Gr_resource_manager_memory_eviction_timestamp`: Quando ocorreu a última expulsão causada pelo uso excessivo de memória.

Além disso, é possível determinar se e quando ocorreram erros ao tentar obter informações sobre o atraso ou o uso de memória, verificando as variáveis de status listadas aqui:

* `Gr_resource_manager_channel_lag_monitoring_error_timestamp`: Timestamp da última vez que este membro encontrou um erro ao tentar obter um valor para o atraso do canal.

* `Gr_resource_manager_memory_monitoring_error_timestamp`: A última vez que este membro encontrou um erro ao tentar obter um valor para o uso de memória do sistema.

Para informações gerais sobre a replicação em grupo do MySQL, consulte o Capítulo 20, *Replicação em Grupo*.