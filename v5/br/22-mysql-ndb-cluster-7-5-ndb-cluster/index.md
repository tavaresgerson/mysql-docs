# Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6

**Sumário**

21.1 Informações Gerais

21.2 Visão Geral do NDB Cluster : 21.2.1 Conceitos Centrais do NDB Cluster

    21.2.2 Nós do NDB Cluster, Grupos de Nós, Réplicas de Fragmentos e Partições

    21.2.3 Requisitos de Hardware, Software e Rede do NDB Cluster

    21.2.4 O Que Há de Novo no MySQL NDB Cluster

    21.2.5 NDB: Opções, Variáveis e Parâmetros Adicionados, Descontinuados e Removidos

    21.2.6 MySQL Server Usando InnoDB Comparado com NDB Cluster

    21.2.7 Limitações Conhecidas do NDB Cluster

21.3 Instalação do NDB Cluster : 21.3.1 Instalação do NDB Cluster no Linux

    21.3.2 Instalação do NDB Cluster no Windows

    21.3.3 Configuração Inicial do NDB Cluster

    21.3.4 Inicialização do NDB Cluster

    21.3.5 Exemplo de NDB Cluster com Tabelas e Dados

    21.3.6 Desligamento e Reinicialização Seguros do NDB Cluster

    21.3.7 Atualização (Upgrade) e Reversão (Downgrade) do NDB Cluster

    21.3.8 O Auto-Instalador do NDB Cluster (NDB 7.5) (NÃO MAIS SUPORTADO)

    21.3.9 O Auto-Instalador do NDB Cluster (NÃO MAIS SUPORTADO)

21.4 Configuração do NDB Cluster : 21.4.1 Configuração Rápida de Teste do NDB Cluster

    21.4.2 Visão Geral de Parâmetros de Configuração, Opções e Variáveis do NDB Cluster

    21.4.3 Arquivos de Configuração do NDB Cluster

    21.4.4 Usando Interconexões de Alta Velocidade com NDB Cluster

21.5 Programas do NDB Cluster : 21.5.1 ndbd — O Daemon (Data Node) do NDB Cluster

    21.5.2 ndbinfo_select_all — Select de Tabelas ndbinfo

    21.5.3 ndbmtd — O Daemon (Data Node) do NDB Cluster (Multi-Threaded)

    21.5.4 ndb_mgmd — O Daemon do Servidor de Management do NDB Cluster

    21.5.5 ndb_mgm — O Client de Management do NDB Cluster

    21.5.6 ndb_blob_tool — Verificação e Reparo de Colunas BLOB e TEXT de Tabelas NDB Cluster

    21.5.7 ndb_config — Extrair Informações de Configuração do NDB Cluster

    21.5.8 ndb_cpcd — Automatizar Testes para Desenvolvimento NDB

    21.5.9 ndb_delete_all — Deletar Todas as Linhas de uma Tabela NDB

    21.5.10 ndb_desc — Descrever Tabelas NDB

    21.5.11 ndb_drop_index — Remover Index de uma Tabela NDB

    21.5.12 ndb_drop_table — Remover uma Tabela NDB

    21.5.13 ndb_error_reporter — Utilitário de Relatório de Erros NDB

    21.5.14 ndb_import — Importar Dados CSV para NDB

    21.5.15 ndb_index_stat — Utilitário de Estatísticas de Index NDB

    21.5.16 ndb_move_data — Utilitário de Cópia de Dados NDB

    21.5.17 ndb_perror — Obter Informações de Mensagens de Erro NDB

    21.5.18 ndb_print_backup_file — Imprimir Conteúdo do Arquivo de Backup NDB

    21.5.19 ndb_print_file — Imprimir Conteúdo do Arquivo de Dados em Disco NDB

    21.5.20 ndb_print_frag_file — Imprimir Conteúdo do Arquivo de Lista de Fragmentos NDB

    21.5.21 ndb_print_schema_file — Imprimir Conteúdo do Arquivo de Schema NDB

    21.5.22 ndb_print_sys_file — Imprimir Conteúdo do Arquivo de Sistema NDB

    21.5.23 ndb_redo_log_reader — Verificar e Imprimir Conteúdo do Redo Log do Cluster

    21.5.24 ndb_restore — Restaurar um Backup do NDB Cluster

    21.5.25 ndb_select_all — Imprimir Linhas de uma Tabela NDB

    21.5.26 ndb_select_count — Imprimir Contagem de Linhas para Tabelas NDB

    21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB

    21.5.28 ndb_size.pl — Estimador de Requisitos de Tamanho do NDBCLUSTER

    21.5.29 ndb_top — Visualizar informações de uso de CPU para threads NDB

    21.5.30 ndb_waiter — Aguardar o NDB Cluster Atingir um Dado Status

21.6 Gerenciamento do NDB Cluster : 21.6.1 Comandos no Client de Management do NDB Cluster

    21.6.2 Mensagens de Log do NDB Cluster

    21.6.3 Relatórios de Eventos Gerados no NDB Cluster

    21.6.4 Resumo das Fases de Inicialização do NDB Cluster

    21.6.5 Executando um Rolling Restart de um NDB Cluster

    21.6.6 Modo Single User do NDB Cluster

    21.6.7 Adicionando Data Nodes ao NDB Cluster Online

    21.6.8 Backup Online do NDB Cluster

    21.6.9 Importando Dados para o MySQL Cluster

    21.6.10 Uso do MySQL Server para o NDB Cluster

    21.6.11 Tabelas Disk Data do NDB Cluster

    21.6.12 Operações Online com ALTER TABLE no NDB Cluster

    21.6.13 Privilégios Distribuídos Usando Tabelas Grant Compartilhadas

    21.6.14 Contadores e Variáveis de Estatísticas da NDB API

    21.6.15 ndbinfo: O Database de Informações do NDB Cluster

    21.6.16 Tabelas INFORMATION_SCHEMA para NDB Cluster

    21.6.17 Referência Rápida: Declarações SQL do NDB Cluster

    21.6.18 Questões de Security do NDB Cluster

21.7 Replicação do NDB Cluster : 21.7.1 Replicação do NDB Cluster: Abreviaturas e Símbolos

    21.7.2 Requisitos Gerais para Replicação do NDB Cluster

    21.7.3 Issues Conhecidos na Replicação do NDB Cluster

    21.7.4 Schema e Tabelas de Replicação do NDB Cluster

    21.7.5 Preparando o NDB Cluster para Replicação

    21.7.6 Iniciando a Replicação do NDB Cluster (Canal Único de Replicação)

    21.7.7 Usando Dois Canais de Replicação para Replicação do NDB Cluster

    21.7.8 Implementando Failover com Replicação do NDB Cluster

    21.7.9 Backups do NDB Cluster com Replicação do NDB Cluster

    21.7.10 Replicação do NDB Cluster: Replicação Bidirecional e Circular

    21.7.11 Resolução de Conflitos na Replicação do NDB Cluster

21.8 Notas de Release do NDB Cluster

Este capítulo fornece informações sobre o MySQL NDB Cluster, uma versão de alta disponibilidade e alta redundância do MySQL, adaptada para o ambiente de computação distribuída, que permite executar vários computadores com MySQL servers e outros softwares em um Cluster. Este capítulo também fornece informações específicas para as releases NDB Cluster 7.5 até 5.7.44-ndb-7.5.36 e NDB Cluster 7.6 até 5.7.44-ndb-7.6.36, as quais são releases General Availability (GA) anteriores que ainda são suportadas em produção. As últimas releases disponíveis destas são 5.7.44-ndb-7.5.36 e 5.7.44-ndb-7.6.35, respectivamente. Uma série de releases estáveis mais recente do NDB Cluster utiliza a versão 8.0 do storage engine `NDB` (também conhecido como `NDBCLUSTER`). O NDB Cluster 8.0, agora disponível como uma release General Availability (GA) a partir da versão 8.0.19, incorpora a versão 8.0 do storage engine `NDB`; veja MySQL NDB Cluster 8.0, para mais informações sobre o NDB 8.0. O NDB Cluster 8.4 (NDB 8.4.7), baseado na versão 8.4 do storage engine NDB, também está disponível como uma release LTS. Consulte What is New in MySQL NDB Cluster 8.4, para obter informações sobre as diferenças no NDB 8.4 em comparação com releases anteriores. As releases GA anteriores NDB Cluster 7.4 e NDB Cluster 7.3 incorporaram as versões `NDB` 7.4 e 7.3, respectivamente. *As séries de releases NDB 7.4 e mais antigas não são mais suportadas ou mantidas*. Tanto NDB 8.0 quanto NDB 8.1 são suportados em produção e são recomendados para novas implementações (deployments).