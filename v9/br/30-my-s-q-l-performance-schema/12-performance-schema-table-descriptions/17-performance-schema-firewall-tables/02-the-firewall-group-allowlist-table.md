#### 29.12.17.2 A tabela firewall_group_allowlist

A tabela `firewall_group_allowlist` fornece uma visão dos dados de cache de memória para o Firewall do MySQL Enterprise. Ela lista as regras da lista de permissão de perfis de grupo de firewall registrados. É usada em conjunto com a tabela `mysql.firewall_group_allowlist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do Firewall do MySQL Enterprise.

A tabela `firewall_group_allowlist` tem as seguintes colunas:

* `NAME`

  O nome do perfil do grupo.

* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma lista de permissão de perfil é a união de suas regras.

A tabela `firewall_group_allowlist` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `firewall_group_allowlist`.