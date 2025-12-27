### 28.7.3 A Tabela INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST

A tabela `MYSQL_FIREWALL_WHITELIST` fornece uma visão do cache de dados em memória do plugin MySQL Enterprise Firewall. Ela lista as regras da lista de permissão de perfis de conta de firewall registrados. É usada em conjunto com a tabela `mysql.firewall_whitelist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` tem as seguintes colunas:

* `USERHOST`

  O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma lista de permissão de perfil é a união de suas regras.

Esta tabela é desatualizada e está sujeita à remoção em uma versão futura do MySQL. Veja Migração de perfis de conta para perfis de grupo.