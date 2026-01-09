## Programas de NDB Cluster

25.5.1 ndbd — O Daemon do Nó de Dados do NDB Cluster

25.5.2 ndbinfo_select_all — Selecionar de tabelas ndbinfo

25.5.3 ndbmtd — O Daemon do Nó de Dados do NDB Cluster (Multi-Thread)

25.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

25.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster

25.5.6 ndb_blob_tool — Verificar e Reparar Colunas BLOB e TEXT de Tabelas do NDB Cluster

25.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster

25.5.8 ndb_delete_all — Deletar Todas as Linhas de uma Tabela NDB

25.5.9 ndb_desc — Descrever Tabelas NDB

25.5.10 ndb_drop_index — Deletar Índice de uma Tabela NDB

25.5.11 ndb_drop_table — Deletar uma Tabela NDB

25.5.12 ndb_error_reporter — Ferramenta de Relatório de Erros NDB

25.5.13 ndb_import — Importar Dados CSV em NDB

25.5.14 ndb_index_stat — Ferramenta de Estatísticas de Índices NDB

25.5.15 ndb_move_data — Ferramenta de Cópia de Dados NDB

25.5.16 ndb_perror — Obter Informações da Mensagem de Erro NDB

25.5.17 ndb_print_backup_file — Imprimir Conteúdo do Arquivo de Backup NDB

25.5.18 ndb_print_file — Imprimir Conteúdo do Arquivo de Dados do Disco NDB

25.5.19 ndb_print_frag_file — Imprimir Conteúdo do Arquivo de Lista de Fragmentos NDB

25.5.20 ndb_print_schema_file — Imprimir Conteúdo do Arquivo de Esquema NDB

25.5.21 ndb_print_sys_file — Imprimir Conteúdo do Arquivo de Sistema NDB

25.5.22 ndb_redo_log_reader — Verificar e Imprimir Conteúdo do Log de Refazer do NDB Cluster

25.5.23 ndb_restore — Restaurar um Backup do NDB Cluster

25.5.24 ndb_secretsfile_reader — Obter Informações Chave de um Arquivo de Dados NDB Encriptado

25.5.25 ndb_select_all — Imprimir Linhas de uma Tabela NDB

25.5.26 ndb_select_count — Imprimir Contagem de Linhas para Tabelas NDB

25.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB

25.5.28 ndb_sign_keys — Criar, Assinar e Gerenciar Chaves e Certificados TLS para o NDB Cluster

25.5.29 ndb_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER

25.5.30 ndb_top — Visualizar informações de uso da CPU para os threads do NDB

25.5.31 ndb_waiter — Aguardar que o NDB Cluster atinja um status específico

25.5.32 ndbxfrm — Comprimir, descomprimir, criptografar e descriptografar arquivos criados pelo NDB Cluster

Usar e gerenciar um NDB Cluster requer vários programas especializados, que descrevemos neste capítulo. Discutimos os propósitos desses programas em um NDB Cluster, como usar os programas e quais são as opções de inicialização disponíveis para cada um deles.

Esses programas incluem os processos de dados, gerenciamento e nó SQL do NDB Cluster (**ndbd**, **ndbmtd**"), **ndb_mgmd** e **mysqld**) e o cliente de gerenciamento (**ndb_mgm**).

Para informações sobre o uso do **mysqld** como um processo do NDB Cluster, consulte a Seção 25.6.10, “Uso do MySQL Server para NDB Cluster”.

Outros programas de utilitários, diagnóstico e exemplos do `NDB` estão incluídos na distribuição do NDB Cluster. Esses incluem **ndb_restore**, **ndb_show_tables** e **ndb_config**. Esses programas também são cobertos nesta seção.