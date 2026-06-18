#### 29.12.11.14 A tabela replication\_group\_member\_actions

Esta tabela lista as ações de membro que estão incluídas na configuração de ações de membro para membros do grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada. Você pode redefinir a configuração de ações de membro usando a função `group_replication_reset_member_actions()`. Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membro”.

A tabela `replication_group_member_actions` tem essas colunas:

- `NAME`

  O nome da ação do membro.

- `EVENT`

  O evento que desencadeia a ação do membro.

- `ENABLED`

  Se a ação do membro está atualmente habilitada. As ações do membro podem ser habilitadas usando a função `group_replication_enable_member_action()` e desabilitadas usando a função `group_replication_disable_member_action()`.

- `TYPE`

  O tipo de ação do membro. `INTERNAL` é uma ação fornecida pelo plugin de replicação de grupo.

- `PRIORITY`

  A ação prioritária do membro. As ações com valores de prioridade mais baixos são executadas primeiro.

- `ERROR_HANDLING`

  A ação que o Replicação em Grupo executa se um erro ocorrer durante a execução da ação do membro. `IGNORE` significa que uma mensagem de erro é registrada para indicar que a ação do membro falhou, mas nenhuma ação adicional é realizada. `CRITICAL` significa que o membro passa para o estado `ERROR` e executa a ação especificada pela variável de sistema `group_replication_exit_state_action`.

A tabela `replication_group_member_actions` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_actions`.
