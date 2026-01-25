## 21.5 Programas do NDB Cluster

[21.5.1 ndbd — O Data Node Daemon do NDB Cluster](mysql-cluster-programs-ndbd.html)

[21.5.2 ndbinfo_select_all — Selecionar de Tabelas ndbinfo](mysql-cluster-programs-ndbinfo-select-all.html)

[21.5.3 ndbmtd — O Data Node Daemon do NDB Cluster (Multi-Threaded)](mysql-cluster-programs-ndbmtd.html)

[21.5.4 ndb_mgmd — O Management Server Daemon do NDB Cluster](mysql-cluster-programs-ndb-mgmd.html)

[21.5.5 ndb_mgm — O Management Client do NDB Cluster](mysql-cluster-programs-ndb-mgm.html)

[21.5.6 ndb_blob_tool — Verificar e Reparar Colunas BLOB e TEXT de Tabelas NDB Cluster](mysql-cluster-programs-ndb-blob-tool.html)

[21.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster](mysql-cluster-programs-ndb-config.html)

[21.5.8 ndb_cpcd — Automatizar Testes para Desenvolvimento NDB](mysql-cluster-programs-ndb-cpcd.html)

[21.5.9 ndb_delete_all — Excluir Todas as Rows de uma Tabela NDB](mysql-cluster-programs-ndb-delete-all.html)

[21.5.10 ndb_desc — Descrever Tabelas NDB](mysql-cluster-programs-ndb-desc.html)

[21.5.11 ndb_drop_index — Fazer Drop de Index de uma Tabela NDB](mysql-cluster-programs-ndb-drop-index.html)

[21.5.12 ndb_drop_table — Fazer Drop de uma Tabela NDB](mysql-cluster-programs-ndb-drop-table.html)

[21.5.13 ndb_error_reporter — Utility de Relatório de Erros NDB](mysql-cluster-programs-ndb-error-reporter.html)

[21.5.14 ndb_import — Importar Dados CSV para NDB](mysql-cluster-programs-ndb-import.html)

[21.5.15 ndb_index_stat — Utility de Estatísticas de Index NDB](mysql-cluster-programs-ndb-index-stat.html)

[21.5.16 ndb_move_data — Utility de Cópia de Dados NDB](mysql-cluster-programs-ndb-move-data.html)

[21.5.17 ndb_perror — Obter Informações de Mensagens de Erro NDB](mysql-cluster-programs-ndb-perror.html)

[21.5.18 ndb_print_backup_file — Imprimir Conteúdo de Arquivo Backup NDB](mysql-cluster-programs-ndb-print-backup-file.html)

[21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data NDB](mysql-cluster-programs-ndb-print-file.html)

[21.5.20 ndb_print_frag_file — Imprimir Conteúdo de Arquivo Fragment List NDB](mysql-cluster-programs-ndb-print-frag-file.html)

[21.5.21 ndb_print_schema_file — Imprimir Conteúdo de Arquivo Schema NDB](mysql-cluster-programs-ndb-print-schema-file.html)

[21.5.22 ndb_print_sys_file — Imprimir Conteúdo de Arquivo System NDB](mysql-cluster-programs-ndb-print-sys-file.html)

[21.5.23 ndb_redo_log_reader — Verificar e Imprimir Conteúdo do Redo Log do Cluster](mysql-cluster-programs-ndb-redo-log-reader.html)

[21.5.24 ndb_restore — Restaurar um Backup do NDB Cluster](mysql-cluster-programs-ndb-restore.html)

[21.5.25 ndb_select_all — Imprimir Rows de uma Tabela NDB](mysql-cluster-programs-ndb-select-all.html)

[21.5.26 ndb_select_count — Imprimir Contagens de Rows para Tabelas NDB](mysql-cluster-programs-ndb-select-count.html)

[21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB](mysql-cluster-programs-ndb-show-tables.html)

[21.5.28 ndb_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER](mysql-cluster-programs-ndb-size-pl.html)

[21.5.29 ndb_top — Visualizar informações de uso de CPU para NDB threads](mysql-cluster-programs-ndb-top.html)

[21.5.30 ndb_waiter — Aguardar o NDB Cluster Alcançar um Status Determinado](mysql-cluster-programs-ndb-waiter.html)

Usar e gerenciar um NDB Cluster requer diversos programas especializados, os quais descrevemos neste capítulo. Discutiremos os propósitos desses programas em um NDB Cluster, como utilizá-los e quais opções de inicialização (startup options) estão disponíveis para cada um deles.

Estes programas incluem os processos de Data Node, Management e SQL Node do NDB Cluster ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — O Data Node Daemon do NDB Cluster"), [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Data Node Daemon do NDB Cluster (Multi-Threaded)"), [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Management Server Daemon do NDB Cluster"), e [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) e o Management Client ([**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Management Client do NDB Cluster")).

Para informações sobre o uso de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como um processo NDB Cluster, consulte [Section 21.6.10, “Uso do MySQL Server para NDB Cluster”](mysql-cluster-mysqld.html "21.6.10 MySQL Server Usage for NDB Cluster").

Outros programas de utility, diagnóstico e exemplo do [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") estão incluídos na distribuição do NDB Cluster. Estes incluem [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restaurar um Backup do NDB Cluster"), [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB"), e [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster"). Estes programas também são abordados nesta seção.

A porção final desta seção contém tabelas de opções que são comuns a todos os diversos programas do NDB Cluster.