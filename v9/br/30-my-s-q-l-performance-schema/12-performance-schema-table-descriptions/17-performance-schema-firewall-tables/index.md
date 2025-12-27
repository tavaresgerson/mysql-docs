### 29.12.17 Tabelas do Schema de Desempenho Firewall

29.12.17.1 A tabela firewall_groups

29.12.17.2 A tabela firewall_group_allowlist

29.12.17.3 A tabela firewall_membership

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao Firewall do MySQL Enterprise (consulte a Seção 8.4.8, “Firewall do MySQL Enterprise”). Elas fornecem informações sobre o funcionamento do firewall:

* `firewall_groups`: Informações sobre os perfis de grupos de firewall.

* `firewall_group_allowlist`: Regras de allowlist dos perfis de grupo de firewall registrados.

* `firewall_membership`: Membros (contas) dos perfis de grupo de firewall registrados.

Essas tabelas são suportadas tanto pelo plugin firewall (desatualizado) quanto pelo componente Firewall do MySQL Enterprise.