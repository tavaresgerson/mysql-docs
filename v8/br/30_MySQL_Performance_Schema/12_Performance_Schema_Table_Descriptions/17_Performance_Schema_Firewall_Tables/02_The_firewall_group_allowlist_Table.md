#### 29.12.17.2 Tabela firewall\_group\_allowlist

A tabela `firewall_group_allowlist` oferece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_group_allowlist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_group_allowlist` tem essas colunas:

- `NAME`

  O nome do perfil do grupo.

- `RULE`

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

A tabela `firewall_group_allowlist` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_group_allowlist`.

A tabela `firewall_group_allowlist` foi adicionada no MySQL 8.0.23.
