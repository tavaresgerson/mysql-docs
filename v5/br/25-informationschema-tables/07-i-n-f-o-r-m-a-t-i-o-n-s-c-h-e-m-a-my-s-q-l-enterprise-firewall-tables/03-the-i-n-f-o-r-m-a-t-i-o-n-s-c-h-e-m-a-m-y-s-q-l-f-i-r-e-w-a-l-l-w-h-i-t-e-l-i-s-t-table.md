### 24.7.3 A tabela INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST

A tabela `MYSQL_FIREWALL_WHITELIST` oferece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de contas de firewall registrados. Ela é usada em conjunto com a tabela `mysql.firewall_whitelist` do sistema, que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` tem as seguintes colunas:

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- REGRA

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.
