## 21.6 Gerenciamento do NDB Cluster

[21.6.1 Comandos no Management Client do NDB Cluster](mysql-cluster-mgm-client-commands.html)

[21.6.2 Mensagens de Log do NDB Cluster](mysql-cluster-logs-ndb-messages.html)

[21.6.3 Relatórios de Eventos Gerados no NDB Cluster](mysql-cluster-event-reports.html)

[21.6.4 Resumo das Fases de Inicialização do NDB Cluster](mysql-cluster-start-phases.html)

[21.6.5 Executando um Rolling Restart de um NDB Cluster](mysql-cluster-rolling-restart.html)

[21.6.6 Modo de Usuário Único (Single User Mode) do NDB Cluster](mysql-cluster-single-user-mode.html)

[21.6.7 Adicionando Data Nodes ao NDB Cluster Online](mysql-cluster-online-add-node.html)

[21.6.8 Backup Online do NDB Cluster](mysql-cluster-backup.html)

[21.6.9 Importando Dados para o MySQL Cluster](mysql-cluster-importing-data.html)

[21.6.10 Uso do MySQL Server para o NDB Cluster](mysql-cluster-mysqld.html)

[21.6.11 Tabelas Disk Data do NDB Cluster](mysql-cluster-disk-data.html)

[21.6.12 Operações Online com ALTER TABLE no NDB Cluster](mysql-cluster-online-operations.html)

[21.6.13 Privilégios Distribuídos Usando Shared Grant Tables](mysql-cluster-privilege-distribution.html)

[21.6.14 Contadores e Variáveis de Estatísticas da NDB API](mysql-cluster-ndb-api-statistics.html)

[21.6.15 ndbinfo: O Database de Informações do NDB Cluster](mysql-cluster-ndbinfo.html)

[21.6.16 Tabelas INFORMATION_SCHEMA para NDB Cluster](mysql-cluster-information-schema-tables.html)

[21.6.17 Referência Rápida: SQL Statements do NDB Cluster](mysql-cluster-sql-statements.html)

[21.6.18 Questões de Segurança do NDB Cluster](mysql-cluster-security.html)

Gerenciar um NDB Cluster envolve diversas tarefas, sendo a primeira delas configurar e iniciar o NDB Cluster. Isso é abordado em [Seção 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster") e [Seção 21.5, “NDB Cluster Programs”](mysql-cluster-programs.html "21.5 NDB Cluster Programs").

As próximas seções cobrem o gerenciamento de um NDB Cluster em execução.

Para obter informações sobre questões de segurança relacionadas ao gerenciamento e implantação de um NDB Cluster, consulte [Seção 21.6.18, “NDB Cluster Security Issues”](mysql-cluster-security.html "21.6.18 NDB Cluster Security Issues").

Existem essencialmente dois métodos para gerenciar ativamente um NDB Cluster em execução. O primeiro é através do uso de comandos inseridos no management client, pelos quais o status do Cluster pode ser verificado, os níveis de log alterados, os Backups iniciados e interrompidos, e os Nodes parados e iniciados. O segundo método envolve estudar o conteúdo do cluster log `ndb_node_id_cluster.log`; ele é geralmente encontrado no diretório [`DataDir`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-datadir) do management server, mas este local pode ser substituído usando a opção [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination). (Lembre-se de que *`node_id`* representa o identificador único do Node cuja atividade está sendo registrada no Log.) O cluster log contém relatórios de eventos gerados pelo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"). Também é possível enviar entradas do cluster log para um system log Unix.

Alguns aspectos da operação do Cluster também podem ser monitorados a partir de um SQL node usando o statement [`SHOW ENGINE NDB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement").

Informações mais detalhadas sobre as operações do NDB Cluster estão disponíveis em tempo real através de uma interface SQL utilizando o database [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database"). Para mais informações, consulte [Seção 21.6.15, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

Contadores de estatísticas NDB fornecem monitoramento aprimorado usando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Esses contadores, implementados no kernel do NDB, relacionam-se a operações executadas por, ou que afetam, objetos [`Ndb`](/doc/ndbapi/en/ndb-ndb.html), como iniciar, fechar e abortar transactions; operações de Primary Key e Unique Key; table, range e pruned scans; Threads bloqueadas esperando que várias operações sejam concluídas; e dados e eventos enviados e recebidos pelo NDB Cluster. Os contadores são incrementados pelo kernel NDB sempre que chamadas de NDB API são feitas ou dados são enviados ou recebidos pelos Data Nodes.

O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") expõe os contadores de estatísticas da NDB API como variáveis de status do sistema, que podem ser identificadas pelo prefixo comum a todos os seus nomes (`Ndb_api_`). Os valores dessas variáveis podem ser lidos no [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") Client a partir da saída de um statement [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), ou consultando a tabela [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") ou a tabela [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") (no database `INFORMATION_SCHEMA`). Ao comparar os valores das variáveis de status antes e depois da execução de um SQL statement que atua em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), é possível observar as ações tomadas no nível da NDB API que correspondem a esse statement, o que pode ser benéfico para o monitoramento e performance tuning do NDB Cluster.

O MySQL Cluster Manager fornece uma interface de linha de comando avançada que simplifica muitas tarefas de gerenciamento do NDB Cluster que, de outra forma, seriam complexas, como iniciar, parar ou reiniciar um NDB Cluster com um grande número de Nodes. O Client do MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de Configuration dos Nodes, bem como opções e variáveis do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server relacionadas ao NDB Cluster. Consulte [MySQL Cluster Manager 1.4.8 User Manual](/doc/mysql-cluster-manager/1.4/en/), para mais informações.