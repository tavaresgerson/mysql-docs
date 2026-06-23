## 28.7 Tabelas do Schema de Informação do Firewall Empresarial MySQL

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao Firewall Empresarial MySQL (consulte a Seção 8.4.7, “Firewall Empresarial MySQL”). Elas fornecem visões sobre o cache de dados de memória do firewall. Essas tabelas estão disponíveis apenas se os plugins de firewall apropriados estiverem habilitados.

### 28.7.1 Referências à tabela Schema de Informação do Firewall

A tabela a seguir resume as tabelas de firewall `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 28.9 Tabelas do esquema de informação Firewall**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA firewall tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>MYSQL_FIREWALL_USERS</code></th> <td>Dados de firewall em memória para perfis de conta</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>MYSQL_FIREWALL_WHITELIST</code></th> <td>Firewall de dados em memória para listas de perfil de conta</td> <td>8.0.26</td> </tr></tbody></table>

### 28.7.2 A tabela INFORMATION_SCHEMA MYSQL_FIREWALL_USERS

A tabela `MYSQL_FIREWALL_USERS` fornece uma visão do cache de dados de memória para o MySQL Enterprise Firewall. Ela lista os nomes e os modos operacionais dos perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_users` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_USERS` tem essas colunas:

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

A partir do MySQL 8.0.26, essa tabela é desaconselhada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

### 28.7.3 A tabela INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST

A tabela `MYSQL_FIREWALL_WHITELIST` fornece uma visão do cache de dados de memória para o MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_whitelist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` tem essas colunas:

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

A partir do MySQL 8.0.26, essa tabela é desaconselhada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.