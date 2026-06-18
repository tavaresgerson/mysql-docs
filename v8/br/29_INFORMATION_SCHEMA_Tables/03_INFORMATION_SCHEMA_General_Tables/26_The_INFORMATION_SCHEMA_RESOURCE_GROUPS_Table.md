### 28.3.26 A tabela INFORMATION\_SCHEMA RESOURCE\_GROUPS

A tabela `RESOURCE_GROUPS` fornece acesso a informações sobre grupos de recursos. Para uma discussão geral sobre a capacidade dos grupos de recursos, consulte a Seção 7.1.16, “Grupos de Recursos”.

Você pode ver informações apenas para as colunas para as quais você tenha algum privilégio.

A tabela `RESOURCE_GROUPS` tem essas colunas:

- `RESOURCE_GROUP_NAME`

  O nome do grupo de recursos.

- `RESOURCE_GROUP_TYPE`

  O tipo de grupo de recursos, seja `SYSTEM` ou `USER`.

- `RESOURCE_GROUP_ENABLED`

  Se o grupo de recursos está habilitado (1) ou desabilitado (0);

- `VCPU_IDS`

  A afinidade da CPU; ou seja, o conjunto de CPUs virtuais que o grupo de recursos pode usar. O valor é uma lista de números ou faixas de CPUs separados por vírgula.

- `THREAD_PRIORITY`

  A prioridade para os threads atribuídos ao grupo de recursos. A prioridade varia de -20 (maior prioridade) a 19 (menor prioridade). Os grupos de recursos do sistema têm uma prioridade que varia de -20 a 0. Os grupos de recursos de usuário têm uma prioridade que varia de 0 a 19.
