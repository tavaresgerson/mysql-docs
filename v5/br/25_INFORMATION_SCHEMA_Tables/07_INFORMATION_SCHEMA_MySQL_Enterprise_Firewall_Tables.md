## 24.7 Tabelas do esquema de informação do firewall empresarial MySQL

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao Firewall Empresarial MySQL (consulte a Seção 6.4.6, “Firewall Empresarial MySQL”). Elas fornecem visões sobre o cache de dados de memória do firewall. Essas tabelas estão disponíveis apenas se os plugins de firewall apropriados estiverem habilitados.

### 24.7.1 Referências à tabela do esquema de informação do firewall

A tabela a seguir resume as tabelas de firewall `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 24.10. Tabelas do esquema de informação do firewall**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA firewall tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>MYSQL_FIREWALL_USERS</code></td> <td>Dados de firewall em memória para perfis de conta</td> </tr><tr><td><code>MYSQL_FIREWALL_WHITELIST</code></td> <td>Firewall de dados em memória para listas de perfil de conta</td> </tr></tbody></table>

### 24.7.2 A tabela INFORMATION\_SCHEMA MYSQL\_FIREWALL\_USERS

A tabela `MYSQL_FIREWALL_USERS` fornece uma visão do cache de dados de memória para o MySQL Enterprise Firewall. Ela lista os nomes e os modos operacionais dos perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_users` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_USERS` tem essas colunas:

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

### 24.7.3 A tabela INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST

A tabela `MYSQL_FIREWALL_WHITELIST` fornece uma visão do cache de dados de memória para o MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de conta de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_whitelist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `MYSQL_FIREWALL_WHITELIST` tem essas colunas:

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.