#### 29.12.17.1 A tabela firewall_groups

A tabela `firewall_groups` fornece uma visão do cache de dados em memória para o Firewall MySQL Enterprise. Ela lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela `mysql.firewall_groups` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do Firewall MySQL Enterprise.

A tabela `firewall_groups` tem as seguintes colunas:

* `NAME`

  O nome do perfil de grupo.

* `MODE`

  O modo operacional atual para o perfil. Os valores permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte Conceitos de Firewall.

* `USERHOST`

  A conta de treinamento para o perfil de grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

  + Se o valor for `NULL`, as regras de allowlist do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.

  + Se o valor for `não NULL`, as regras de allowlist do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

A tabela `firewall_groups` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_groups`.