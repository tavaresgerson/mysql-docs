## 21.6 Gerenciamento do NDB Cluster

21.6.1 Comandos no Management Client do NDB Cluster

21.6.2 Mensagens de Log do NDB Cluster

21.6.3 Relatórios de Eventos Gerados no NDB Cluster

21.6.4 Resumo das Fases de Inicialização do NDB Cluster

21.6.5 Executando um Rolling Restart de um NDB Cluster

21.6.6 Modo de Usuário Único (Single User Mode) do NDB Cluster

21.6.7 Adicionando Data Nodes ao NDB Cluster Online

21.6.8 Backup Online do NDB Cluster

21.6.9 Importando Dados para o MySQL Cluster

21.6.10 Uso do MySQL Server para o NDB Cluster

21.6.11 Tabelas Disk Data do NDB Cluster

21.6.12 Operações Online com ALTER TABLE no NDB Cluster

21.6.13 Privilégios Distribuídos Usando Shared Grant Tables

21.6.14 Contadores e Variáveis de Estatísticas da NDB API

21.6.15 ndbinfo: O Database de Informações do NDB Cluster

21.6.16 Tabelas INFORMATION_SCHEMA para NDB Cluster

21.6.17 Referência Rápida: SQL Statements do NDB Cluster

21.6.18 Questões de Segurança do NDB Cluster

Gerenciar um NDB Cluster envolve diversas tarefas, sendo a primeira delas configurar e iniciar o NDB Cluster. Isso é abordado em Seção 21.4, “Configuration of NDB Cluster” e Seção 21.5, “NDB Cluster Programs”.

As próximas seções cobrem o gerenciamento de um NDB Cluster em execução.

Para obter informações sobre questões de segurança relacionadas ao gerenciamento e implantação de um NDB Cluster, consulte Seção 21.6.18, “NDB Cluster Security Issues”.

Existem essencialmente dois métodos para gerenciar ativamente um NDB Cluster em execução. O primeiro é através do uso de comandos inseridos no management client, pelos quais o status do Cluster pode ser verificado, os níveis de log alterados, os Backups iniciados e interrompidos, e os Nodes parados e iniciados. O segundo método envolve estudar o conteúdo do cluster log `ndb_node_id_cluster.log`; ele é geralmente encontrado no diretório `DataDir` do management server, mas este local pode ser substituído usando a opção `LogDestination`. (Lembre-se de que *`node_id`* representa o identificador único do Node cuja atividade está sendo registrada no Log.) O cluster log contém relatórios de eventos gerados pelo **ndbd**. Também é possível enviar entradas do cluster log para um system log Unix.

Alguns aspectos da operação do Cluster também podem ser monitorados a partir de um SQL node usando o statement `SHOW ENGINE NDB STATUS`.

Informações mais detalhadas sobre as operações do NDB Cluster estão disponíveis em tempo real através de uma interface SQL utilizando o database `ndbinfo`. Para mais informações, consulte Seção 21.6.15, “ndbinfo: The NDB Cluster Information Database”.

Contadores de estatísticas NDB fornecem monitoramento aprimorado usando o **mysql**. Esses contadores, implementados no kernel do NDB, relacionam-se a operações executadas por, ou que afetam, objetos `Ndb`, como iniciar, fechar e abortar transactions; operações de Primary Key e Unique Key; table, range e pruned scans; Threads bloqueadas esperando que várias operações sejam concluídas; e dados e eventos enviados e recebidos pelo NDB Cluster. Os contadores são incrementados pelo kernel NDB sempre que chamadas de NDB API são feitas ou dados são enviados ou recebidos pelos Data Nodes.

O **mysqld** expõe os contadores de estatísticas da NDB API como variáveis de status do sistema, que podem ser identificadas pelo prefixo comum a todos os seus nomes (`Ndb_api_`). Os valores dessas variáveis podem ser lidos no **mysql** Client a partir da saída de um statement `SHOW STATUS`, ou consultando a tabela `SESSION_STATUS` ou a tabela `GLOBAL_STATUS` (no database `INFORMATION_SCHEMA`). Ao comparar os valores das variáveis de status antes e depois da execução de um SQL statement que atua em tabelas `NDB`, é possível observar as ações tomadas no nível da NDB API que correspondem a esse statement, o que pode ser benéfico para o monitoramento e performance tuning do NDB Cluster.

O MySQL Cluster Manager fornece uma interface de linha de comando avançada que simplifica muitas tarefas de gerenciamento do NDB Cluster que, de outra forma, seriam complexas, como iniciar, parar ou reiniciar um NDB Cluster com um grande número de Nodes. O Client do MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de Configuration dos Nodes, bem como opções e variáveis do **mysqld** server relacionadas ao NDB Cluster. Consulte MySQL Cluster Manager 1.4.8 User Manual, para mais informações.