### 24.7.3 A Tabela MYSQL_FIREWALL_WHITELIST do INFORMATION_SCHEMA

A tabela `MYSQL_FIREWALL_WHITELIST` fornece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista as regras da allowlist (lista de permissões) de perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela de sistema `mysql.firewall_whitelist`, que fornece armazenamento persistente dos dados do firewall; consulte Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` possui as seguintes colunas:

* `USERHOST`

  O nome do profile da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

  Uma instrução normalizada indicando um padrão de instrução aceitável para o profile. A allowlist de um profile é a união de suas regras.