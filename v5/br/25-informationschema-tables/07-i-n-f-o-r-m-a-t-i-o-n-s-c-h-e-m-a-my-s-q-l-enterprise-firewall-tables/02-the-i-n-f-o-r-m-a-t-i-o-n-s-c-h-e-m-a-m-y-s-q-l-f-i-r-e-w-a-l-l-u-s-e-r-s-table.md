### 24.7.2 A Tabela INFORMATION_SCHEMA MYSQL_FIREWALL_USERS

A tabela [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "24.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") oferece uma visualização do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista nomes e modos operacionais de perfis de conta de firewall registrados. É utilizada em conjunto com a tabela de sistema `mysql.firewall_users`, que fornece armazenamento persistente dos dados do firewall; consulte [Tabelas do MySQL Enterprise Firewall](firewall-reference.html#firewall-tables "MySQL Enterprise Firewall Tables").

A tabela [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "24.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") possui estas colunas:

* `USERHOST`

  O nome do perfil de conta. Cada nome de conta tem o formato `user_name@host_name`.

* `MODE`

  O modo operacional atual para o perfil. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para detalhes sobre seus significados, consulte [Conceitos do Firewall](firewall-usage.html#firewall-concepts "Firewall Concepts").