## 25.6 Gerenciamento do NDB Cluster

25.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

25.6.2 Mensagens de Log do NDB Cluster

25.6.3 Relatórios de Eventos Gerados no NDB Cluster

25.6.4 Resumo das Fases de Iniciação do NDB Cluster

25.6.5 Realização de um Reinício Rotativo de um NDB Cluster

25.6.6 Modo de Usuário Único do NDB Cluster

25.6.7 Adição de Nodos de Dados do NDB Cluster Online

25.6.8 Backup Online do NDB Cluster

25.6.9 Importação de Dados no MySQL Cluster

25.6.10 Uso do Servidor MySQL para o NDB Cluster

25.6.11 Tabelas de Dados de Disco do NDB Cluster

25.6.12 Operações Online com ALTER TABLE no NDB Cluster

25.6.13 Sincronização de Privilegios e NDB_STORED_USER

25.6.14 Contadores e Variáveis de Estatísticas da API ndbinfo

25.6.15 ndbinfo: O Banco de Dados de Informações do NDB Cluster

25.6.16 Tabelas do Schema de Informações para o NDB Cluster

25.6.17 NDB Cluster e o Schema de Desempenho

25.6.18 Referência Rápida: Declarações SQL do NDB Cluster

25.6.19 Segurança do NDB Cluster

Para obter informações gerais sobre questões de segurança relacionadas à gestão e implantação de um NDB Cluster, consulte a Seção 25.6.19, “Segurança do NDB Cluster”. Para informações sobre sistemas de arquivos criptografados e o `NDB`, consulte a Seção 25.6.19.4, “Criptografia do Sistema de Arquivos para NDB Cluster”. A Seção 25.6.19.5, “Criptografia do Link TLS para NDB Cluster”, fornece informações sobre o suporte para conexões criptografadas entre nós. O NDB Cluster também suporta backups criptografados que podem ser lidos por muitos programas de linha de comando do `NDB`, incluindo **ndb_restore**, **ndbxfrm**, **ndb_print_backup_file** e **ndb_mgm**. Consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”, para obter mais informações.

Existem essencialmente dois métodos para gerenciar ativamente um NDB Cluster em execução. O primeiro deles é através do uso de comandos inseridos no cliente de gerenciamento, onde o status do cluster pode ser verificado, os níveis de log alterados, os backups iniciados e interrompidos, e os nós parados e iniciados. O segundo método envolve o estudo do conteúdo do log do cluster `ndb_node_id_cluster.log`; este geralmente é encontrado no diretório `DataDir` do servidor de gerenciamento, mas essa localização pode ser sobrescrita usando a opção `LogDestination`. (Lembre-se de que *`node_id`* representa o identificador único do nó cuja atividade está sendo registrada.) O log do cluster contém relatórios de eventos gerados pelo **ndbd**. Também é possível enviar entradas do log do cluster para um log de sistema Unix.

Alguns aspectos da operação do cluster também podem ser monitorados a partir de um nó SQL usando a declaração `SHOW ENGINE NDB STATUS`.

Informações mais detalhadas sobre as operações do NDB Cluster estão disponíveis em tempo real por meio de uma interface SQL usando o banco de dados `ndbinfo`. Para mais informações, consulte a Seção 25.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.

Os contadores de estatísticas do NDB fornecem monitoramento aprimorado usando o cliente **mysql**. Esses contadores, implementados no kernel NDB, estão relacionados às operações realizadas por ou que afetam objetos `Ndb`, como iniciar, fechar e abortar transações; operações de chave primária e chave única; varreduras de tabela, intervalo e aparafusadas; threads bloqueadas aguardando a conclusão de várias operações; e dados e eventos enviados e recebidos pelo NDB Cluster. Os contadores são incrementados pelo kernel NDB sempre que chamadas da API NDB são feitas ou dados são enviados ou recebidos pelos nós de dados.

O **mysqld** expõe os contadores de estatísticas da API NDB como variáveis de status do sistema, que podem ser identificadas pelo prefixo comum a todos os seus nomes (`Ndb_api_`). Os valores dessas variáveis podem ser lidos no cliente **mysql** a partir da saída de uma declaração `SHOW STATUS`, ou consultando a tabela `session_status` ou `global_status` do Schema de Desempenho. Ao comparar os valores das variáveis de status antes e depois da execução de uma declaração SQL que atua em tabelas `NDB`, você pode observar as ações tomadas no nível da API NDB que correspondem a essa declaração, o que pode ser benéfico para o monitoramento e o ajuste de desempenho do NDB Cluster.

O MySQL Cluster Manager oferece uma interface avançada de linha de comando que simplifica muitas tarefas de gerenciamento do NDB Cluster que, de outra forma, seriam complexas, como iniciar, parar ou reiniciar um NDB Cluster com um grande número de nós. O cliente do MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 9.5.0 para obter mais informações.