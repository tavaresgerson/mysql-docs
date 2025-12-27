#### 29.12.11.15 A tabela `replication_group_configuration_version`

Esta tabela exibe a versão da configuração de ações de membro para os membros do grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada. Sempre que uma ação de membro é habilitada ou desabilitada usando as funções `group_replication_enable_member_action()` e `group_replication_disable_member_action()`, o número da versão é incrementado. Você pode redefinir a configuração de ações de membro usando a função `group_replication_reset_member_actions()`, que redefiniu a configuração de ações de membro para as configurações padrão e redefiniu seu número de versão para 1. Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.

A tabela `replication_group_configuration_version` tem as seguintes colunas:

* `NAME`

  O nome da configuração.

* `VERSION`

  O número da versão da configuração.

A tabela `replication_group_configuration_version` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `replication_group_configuration_version`.