### 29.12.17 Tabelas do Firewall do Schema de Desempenho

29.12.17.1 A tabela firewall\_groups

29.12.17.2 A tabela firewall\_group\_allowlist

29.12.17.3 A tabela firewall\_membership

Nota

As tabelas do Schema de Desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.23. Antes do MySQL 8.0.23, use as tabelas correspondentes `INFORMATION_SCHEMA` em vez disso; veja Tabelas do Firewall do MySQL Enterprise.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao MySQL Enterprise Firewall (consulte a Seção 8.4.7, “MySQL Enterprise Firewall”). Elas fornecem informações sobre o funcionamento do firewall:

- `firewall_groups`: Informações sobre perfis de grupos de firewall.

- `firewall_group_allowlist`: Regras de permissão de grupos de firewall registrados.

- `firewall_membership`: Membros (contas) de perfis de grupos de firewall registrados.
