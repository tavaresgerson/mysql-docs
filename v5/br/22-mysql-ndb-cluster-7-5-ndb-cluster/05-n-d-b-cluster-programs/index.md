## 21.5 Programas do NDB Cluster

21.5.1 ndbd — O Data Node Daemon do NDB Cluster

21.5.2 ndbinfo_select_all — Selecionar de Tabelas ndbinfo

21.5.3 ndbmtd — O Data Node Daemon do NDB Cluster (Multi-Threaded)

21.5.4 ndb_mgmd — O Management Server Daemon do NDB Cluster

21.5.5 ndb_mgm — O Management Client do NDB Cluster

21.5.6 ndb_blob_tool — Verificar e Reparar Colunas BLOB e TEXT de Tabelas NDB Cluster

21.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster

21.5.8 ndb_cpcd — Automatizar Testes para Desenvolvimento NDB

21.5.9 ndb_delete_all — Excluir Todas as Rows de uma Tabela NDB

21.5.10 ndb_desc — Descrever Tabelas NDB

21.5.11 ndb_drop_index — Fazer Drop de Index de uma Tabela NDB

21.5.12 ndb_drop_table — Fazer Drop de uma Tabela NDB

21.5.13 ndb_error_reporter — Utility de Relatório de Erros NDB

21.5.14 ndb_import — Importar Dados CSV para NDB

21.5.15 ndb_index_stat — Utility de Estatísticas de Index NDB

21.5.16 ndb_move_data — Utility de Cópia de Dados NDB

21.5.17 ndb_perror — Obter Informações de Mensagens de Erro NDB

21.5.18 ndb_print_backup_file — Imprimir Conteúdo de Arquivo Backup NDB

21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data NDB

21.5.20 ndb_print_frag_file — Imprimir Conteúdo de Arquivo Fragment List NDB

21.5.21 ndb_print_schema_file — Imprimir Conteúdo de Arquivo Schema NDB

21.5.22 ndb_print_sys_file — Imprimir Conteúdo de Arquivo System NDB

21.5.23 ndb_redo_log_reader — Verificar e Imprimir Conteúdo do Redo Log do Cluster

21.5.24 ndb_restore — Restaurar um Backup do NDB Cluster

21.5.25 ndb_select_all — Imprimir Rows de uma Tabela NDB

21.5.26 ndb_select_count — Imprimir Contagens de Rows para Tabelas NDB

21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB

21.5.28 ndb_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER

21.5.29 ndb_top — Visualizar informações de uso de CPU para NDB threads

21.5.30 ndb_waiter — Aguardar o NDB Cluster Alcançar um Status Determinado

Usar e gerenciar um NDB Cluster requer diversos programas especializados, os quais descrevemos neste capítulo. Discutiremos os propósitos desses programas em um NDB Cluster, como utilizá-los e quais opções de inicialização (startup options) estão disponíveis para cada um deles.

Estes programas incluem os processos de Data Node, Management e SQL Node do NDB Cluster (**ndbd**, **ndbmtd**"), **ndb_mgmd**, e **mysqld**) e o Management Client (**ndb_mgm**).

Para informações sobre o uso de **mysqld** como um processo NDB Cluster, consulte Section 21.6.10, “Uso do MySQL Server para NDB Cluster”.

Outros programas de utility, diagnóstico e exemplo do `NDB` estão incluídos na distribuição do NDB Cluster. Estes incluem **ndb_restore**, **ndb_show_tables**, e **ndb_config**. Estes programas também são abordados nesta seção.

A porção final desta seção contém tabelas de opções que são comuns a todos os diversos programas do NDB Cluster.