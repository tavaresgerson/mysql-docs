## 5.3 O Database de Sistema mysql

O `mysql` database é o database de sistema. Ele contém tabelas que armazenam informações necessárias pelo MySQL server durante sua execução.

As tabelas no `mysql` database se enquadram nestas categorias:

* [Tabelas de Sistema de Concessão (Grant System Tables)](system-schema.html#system-schema-grant-tables "Grant System Tables")
* [Tabelas de Sistema de Informações de Objeto (Object Information System Tables)](system-schema.html#system-schema-object-tables "Object Information System Tables")
* [Tabelas de Sistema de Log (Log System Tables)](system-schema.html#system-schema-log-tables "Log System Tables")
* [Tabelas de Sistema de Ajuda (Help System Tables) do Lado do Server](system-schema.html#system-schema-help-tables "Server-Side Help System Tables")
* [Tabelas de Sistema de Fuso Horário (Time Zone System Tables)](system-schema.html#system-schema-time-zone-tables "Time Zone System Tables")
* [Tabelas de Sistema de Replicação (Replication System Tables)](system-schema.html#system-schema-replication-tables "Replication System Tables")
* [Tabelas de Sistema do Optimizer (Optimizer System Tables)](system-schema.html#system-schema-optimizer-tables "Optimizer System Tables")
* [Outras Tabelas de Sistema (Miscellaneous System Tables)](system-schema.html#system-schema-miscellaneous-tables "Miscellaneous System Tables")

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais. As tabelas de sistema usam o `MyISAM` storage engine, a menos que indicado de outra forma.

Aviso

*Não* converta as tabelas de sistema do MySQL no `mysql` database de `MyISAM` para tabelas `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não será reiniciado até que você restaure as tabelas de sistema antigas a partir de um backup ou as regenere reinicializando o data directory (consulte [Seção 2.9.1, “Inicializando o Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")).

### Tabelas de Sistema de Concessão (Grant System Tables)

Estas tabelas de sistema contêm informações de concessão (grant information) sobre user accounts e os privileges mantidos por elas:

* `user`: User accounts, global privileges e outras colunas que não são de privilege.
* `db`: Privileges no nível do Database.
* `tables_priv`: Privileges no nível da Table.
* `columns_priv`: Privileges no nível da Column.
* `procs_priv`: Privileges de Stored Procedure e Function.
* `proxies_priv`: Privileges de Proxy-user.

Para mais informações sobre a estrutura, conteúdo e propósito das grant tables, consulte [Seção 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables").

### Tabelas de Sistema de Informações de Objeto

Estas tabelas de sistema contêm informações sobre stored programs, loadable functions e server-side plugins:

* `event`: O registro para eventos do Event Scheduler instalados usando [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"). Se o server for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), o event scheduler é desativado e os eventos registrados na tabela não são executados. Consulte [Seção 23.4.2, “Configuração do Event Scheduler”](events-configuration.html "23.4.2 Event Scheduler Configuration").

* `func`: O registro para loadable functions instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Durante a sequência normal de startup, o server carrega functions registradas nesta tabela. Se o server for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), functions registradas na tabela não são carregadas e ficam indisponíveis. Consulte [Seção 5.6.1, “Instalando e Desinstalando Loadable Functions”](function-loading.html "5.6.1 Installing and Uninstalling Loadable Functions").

* `plugin`: O registro para server-side plugins instalados usando [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). Durante a sequência normal de startup, o server carrega plugins registrados nesta tabela. Se o server for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), plugins registrados na tabela não são carregados e ficam indisponíveis. Consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

  A tabela `plugin` usa o `InnoDB` storage engine a partir do MySQL 5.7.6, e `MyISAM` antes disso.

* `proc`: Informações sobre stored procedures e functions. Consulte [Seção 23.2, “Usando Stored Routines”](stored-routines.html "23.2 Using Stored Routines").

### Tabelas de Sistema de Log

O server usa estas tabelas de sistema para logging:

* `general_log`: A tabela de general query log.
* `slow_log`: A tabela de slow query log.

As tabelas de Log usam o `CSV` storage engine.

Para mais informações, consulte [Seção 5.4, “Logs do MySQL Server”](server-logs.html "5.4 MySQL Server Logs").

### Tabelas de Sistema de Ajuda (Help System Tables) do Lado do Server

Estas tabelas de sistema contêm informações de ajuda do lado do server:

* `help_category`: Informações sobre as categorias de ajuda.
* `help_keyword`: Keywords associadas aos tópicos de ajuda.
* `help_relation`: Mapeamentos entre help keywords e tópicos.
* `help_topic`: Conteúdo dos tópicos de ajuda.

Estas tabelas usam o `InnoDB` storage engine a partir do MySQL 5.7.5, e `MyISAM` antes disso.

Para mais informações, consulte [Seção 5.1.14, “Suporte de Ajuda do Lado do Server”](server-side-help-support.html "5.1.14 Server-Side Help Support").

### Tabelas de Sistema de Fuso Horário

Estas tabelas de sistema contêm informações de fuso horário:

* `time_zone`: IDs de fuso horário e se usam leap seconds (segundos bissextos).
* `time_zone_leap_second`: Quando ocorrem os leap seconds.
* `time_zone_name`: Mapeamentos entre IDs e nomes de fuso horário.
* `time_zone_transition`, `time_zone_transition_type`: Descrições de fuso horário.

Estas tabelas usam o `InnoDB` storage engine a partir do MySQL 5.7.5, e `MyISAM` antes disso.

Para mais informações, consulte [Seção 5.1.13, “Suporte a Fuso Horário no MySQL Server”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

### Tabelas de Sistema de Replicação

O server usa estas tabelas de sistema para suportar replication:

* `gtid_executed`: Tabela para armazenar valores GTID. Consulte [Tabela mysql.gtid_executed](replication-gtids-concepts.html#replication-gtids-gtid-executed-table "mysql.gtid_executed Table").

  A tabela `gtid_executed` usa o `InnoDB` storage engine.

* `ndb_binlog_index`: Informações de Binary Log para NDB Cluster replication. Consulte [Seção 21.7.4, “Schema e Tabelas de Replicação do NDB Cluster”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").

  Antes do NDB 7.5.2, esta tabela empregava o `MyISAM` storage engine. No NDB 7.5.2 e posterior, ela usa `InnoDB`. Se você está planejando um upgrade de uma versão anterior do NDB Cluster para o NDB 7.5.2 ou posterior, consulte [Seção 21.3.7, “Upgrade e Downgrade do NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), para obter informações importantes relacionadas a esta mudança.

* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usadas para armazenar informações de replication em replica servers. Consulte [Seção 16.2.4, “Relay Log e Repositórios de Metadados de Replicação”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  Todas as três tabelas usam o `InnoDB` storage engine.

### Tabelas de Sistema do Optimizer

Estas tabelas de sistema são para uso pelo optimizer:

* `innodb_index_stats`, `innodb_table_stats`: Usadas para estatísticas persistentes do optimizer do `InnoDB`. Consulte [Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas Persistentes do Optimizer”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

* `server_cost`, `engine_cost`: O cost model do optimizer usa tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução de Query. `server_cost` contém estimativas de custo do optimizer para operações gerais do server. `engine_cost` contém estimativas para operações específicas de storage engines específicos. Consulte [Seção 8.9.5, “O Cost Model do Optimizer”](cost-model.html "8.9.5 The Optimizer Cost Model").

Estas tabelas usam o `InnoDB` storage engine.

### Outras Tabelas de Sistema (Miscellaneous System Tables)

Outras tabelas de sistema que não se enquadram nas categorias anteriores:

* `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, estas tabelas fornecem armazenamento persistente de definições de filtro de log de auditoria e user accounts. Consulte [Tabelas de Audit Log](audit-log-reference.html#audit-log-tables "Audit Log Tables").

* `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, estas tabelas fornecem armazenamento persistente para informações usadas pelo firewall. Consulte [Seção 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* `servers`: Usada pelo `FEDERATED` storage engine. Consulte [Seção 15.8.2.2, “Criando uma Tabela FEDERATED Usando CREATE SERVER”](federated-create-server.html "15.8.2.2 Creating a FEDERATED Table Using CREATE SERVER").

  A tabela `servers` usa o `InnoDB` storage engine a partir do MySQL 5.7.6, e `MyISAM` antes disso.