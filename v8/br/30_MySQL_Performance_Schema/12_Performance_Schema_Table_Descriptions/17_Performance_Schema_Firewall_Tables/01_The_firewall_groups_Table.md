#### 29.12.17.1 A tabela firewall\_groups

A tabela `firewall_groups` oferece uma visão do cache de dados em memória do MySQL Enterprise Firewall. Ela lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_groups`, que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_groups` tem essas colunas:

- `NAME`

  O nome do perfil do grupo.

- `MODE`

  O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

- `USERHOST`

  A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e tenha o formato `user_name@host_name`:

  - Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

  - Se o valor não for `NULL`, as regras de allowlist do firewall permitem apenas declarações recebidas da conta nomeada (que deve ser membro do grupo).

A tabela `firewall_groups` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_groups`.

A tabela `firewall_groups` foi adicionada no MySQL 8.0.23.
