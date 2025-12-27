#### 29.12.17.3 A tabela firewall_membership

A tabela `firewall_membership` fornece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista os membros (contas) dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela `mysql.firewall_membership` do sistema, que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_membership` tem as seguintes colunas:

* `GROUP_ID`

  O nome do perfil do grupo.

* `MEMBER_ID`

  O nome de uma conta que é membro do perfil.

A tabela `firewall_membership` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `firewall_membership`.