#### 29.12.11.16 A tabela `replication_group_member_actions`

Esta tabela lista as ações dos membros que estão incluídas na configuração de ações dos membros para os membros do grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada. Você pode redefinir a configuração das ações dos membros usando a função `group_replication_reset_member_actions()`. Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações dos Membros”.

A tabela `replication_group_member_actions` tem as seguintes colunas:

* `NAME`

  O nome da ação do membro.

* `EVENT`

  O evento que dispara a ação do membro.

* `ENABLED`

  Se a ação do membro está atualmente habilitada. As ações dos membros podem ser habilitadas usando a função `group_replication_enable_member_action()` e desabilitadas usando a função `group_replication_disable_member_action()`.

* `TYPE`

  O tipo da ação do membro. `INTERNAL` é uma ação fornecida pelo plugin de Replicação de Grupo.

* `PRIORITY`

  A prioridade da ação do membro. As ações com valores de prioridade mais baixos são executadas primeiro.

* `ERROR_HANDLING`

  A ação que a Replicação de Grupo executa se ocorrer um erro ao executar a ação do membro. `IGNORE` significa que uma mensagem de erro é registrada para indicar que a ação do membro falhou, mas nenhuma ação adicional é realizada. `CRITICAL` significa que o membro passa para o estado `ERROR` e executa a ação especificada pela variável de sistema `group_replication_exit_state_action`.

A tabela `replication_group_member_actions` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_actions`.