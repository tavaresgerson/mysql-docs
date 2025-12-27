### 28.3.31 A Tabela `INFORMATION\_SCHEMA\_RESOURCE\_GROUPS`

A tabela `RESOURCE\_GROUPS` fornece acesso a informações sobre grupos de recursos. Para uma discussão geral sobre a capacidade do grupo de recursos, consulte a Seção 7.1.16, “Grupos de Recursos”.

Você pode ver informações apenas para as colunas para as quais você tenha algum privilégio.

A tabela `RESOURCE\_GROUPS` tem as seguintes colunas:

* `RESOURCE\_GROUP\_NAME`

  O nome do grupo de recursos.

* `RESOURCE\_GROUP\_TYPE`

  O tipo de grupo de recursos, que pode ser `SYSTEM` ou `USER`.

* `RESOURCE\_GROUP\_ENABLED`

  Se o grupo de recursos está habilitado (1) ou desabilitado (0);

* `VCPU\_IDS`

  A afinidade de CPU; ou seja, o conjunto de CPUs virtuais que o grupo de recursos pode usar. O valor é uma lista de números ou faixas de CPU separados por vírgula.

* `THREAD\_PRIORITY`

  A prioridade para os threads atribuídos ao grupo de recursos. A prioridade varia de -20 (maior prioridade) a 19 (menor prioridade). Os grupos de recursos do sistema têm uma prioridade que varia de -20 a 0. Os grupos de recursos do usuário têm uma prioridade que varia de 0 a 19.