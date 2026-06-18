### 28.7.2 A tabela INFORMATION\_SCHEMA MYSQL\_FIREWALL\_USERS

A tabela `MYSQL_FIREWALL_USERS` oferece uma visão do cache de dados em memória do MySQL Enterprise Firewall. Ela lista nomes e modos operacionais dos perfis de contas de firewall registrados. Ela é usada em conjunto com a tabela `mysql.firewall_users` do sistema, que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_USERS` tem essas colunas:

- `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

- `MODE`

  O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

A partir do MySQL 8.0.26, essa tabela é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.
