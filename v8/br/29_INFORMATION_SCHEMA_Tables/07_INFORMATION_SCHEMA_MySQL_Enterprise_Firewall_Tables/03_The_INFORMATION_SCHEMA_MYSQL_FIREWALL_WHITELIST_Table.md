### 28.7.3 A tabela INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST

A tabela `MYSQL_FIREWALL_WHITELIST` oferece uma visão do cache de dados em memória do MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_whitelist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` tem essas colunas:

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- `RULE`

  Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

A partir do MySQL 8.0.26, essa tabela é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.
