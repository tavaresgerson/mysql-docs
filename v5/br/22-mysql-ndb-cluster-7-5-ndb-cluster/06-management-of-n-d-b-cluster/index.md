## 21.6 Gerenciamento do NDB Cluster

21.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster

21.6.2 Mensagens de log do cluster NDB

21.6.3 Relatórios de Eventos Gerados no NDB Cluster

21.6.4 Resumo das fases de início do cluster do NDB

21.6.5 Realizar um Reinício Rotativo de um Clúster NDB

21.6.6 Modo de usuário único do cluster NDB

21.6.7 Adicionando nós de dados do NDB Cluster Online

21.6.8 Backup Online de NDB Cluster

21.6.9 Importando dados no MySQL Cluster

21.6.10 Uso do Servidor MySQL para NDB Cluster

21.6.11 Tabelas de dados de disco do cluster NDB

21.6.12 Operações online com ALTER TABLE no NDB Cluster

21.6.13 Distribuição de privilégios usando tabelas de concessão compartilhadas

21.6.14 Contadores e variáveis de estatísticas da API NDB

21.6.15 ndbinfo: A Base de Dados de Informações do NDB Cluster

21.6.16 INFORMAÇÕES\_SCHEMA Tabelas para NDB Cluster

21.6.17 Referência Rápida: Declarações SQL do NDB Cluster

21.6.18 Problemas de segurança do cluster do NDB

Gerenciar um NDB Cluster envolve várias tarefas, sendo a primeira a configuração e inicialização do NDB Cluster. Isso é abordado na Seção 21.4, “Configuração do NDB Cluster” e na Seção 21.5, “Programas do NDB Cluster”.

As próximas seções cobrem a gestão de um cluster NDB em execução.

Para obter informações sobre problemas de segurança relacionados à gestão e implantação de um NDB Cluster, consulte Seção 21.6.18, “Problemas de Segurança do NDB Cluster”.

Existem, essencialmente, dois métodos para gerenciar ativamente um NDB Cluster em execução. O primeiro deles é o uso de comandos inseridos no cliente de gerenciamento, através dos quais é possível verificar o status do cluster, alterar os níveis de log, iniciar e parar backups, e parar e iniciar nós. O segundo método envolve o estudo do conteúdo do log do cluster `ndb_node_id_cluster.log`; esse log geralmente está localizado no diretório do servidor de gerenciamento `DataDir`, mas essa localização pode ser substituída usando a opção `LogDestination`. (Lembre-se de que *`node_id`* representa o identificador único do nó cuja atividade está sendo registrada.) O log do cluster contém relatórios de eventos gerados pelo **ndbd**. Também é possível enviar entradas do log do cluster para um log de sistema Unix.

Alguns aspectos do funcionamento do cluster também podem ser monitorados a partir de um nó SQL usando a instrução `SHOW ENGINE NDB STATUS`.

Informações mais detalhadas sobre as operações do NDB Cluster estão disponíveis em tempo real por meio de uma interface SQL usando o banco de dados `ndbinfo`. Para mais informações, consulte Seção 21.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.

Os contadores de estatísticas do NDB fornecem monitoramento aprimorado usando o cliente **mysql**. Esses contadores, implementados no kernel do NDB, estão relacionados às operações realizadas por ou que afetam os objetos do `Ndb`, como iniciar, fechar e abortar transações; operações de chave primária e chave única; varreduras de tabela, intervalo e aparafusadas; threads bloqueadas esperando a conclusão de várias operações; e dados e eventos enviados e recebidos pelo NDB Cluster. Os contadores são incrementados pelo kernel do NDB sempre que chamadas da API do NDB são feitas ou dados são enviados ou recebidos pelos nós de dados.

**mysqld** expõe os contadores de estatísticas da API NDB como variáveis de status do sistema, que podem ser identificadas a partir do prefixo comum a todos os seus nomes (`Ndb_api_`). Os valores dessas variáveis podem ser lidos no cliente **mysql** a partir da saída de uma declaração `SHOW STATUS`, ou consultando a tabela `**SESSION_STATUS**` ou a tabela `**GLOBAL_STATUS**` (no banco de dados `INFORMATION_SCHEMA`). Ao comparar os valores das variáveis de status antes e depois da execução de uma declaração SQL que atua nas tabelas de `NDB`, você pode observar as ações tomadas no nível da API NDB que correspondem a essa declaração, o que pode ser benéfico para o monitoramento e o ajuste de desempenho do NDB Cluster.

O MySQL Cluster Manager oferece uma interface avançada de linha de comando que simplifica muitas tarefas de gerenciamento do NDB Cluster que, de outra forma, seriam complexas, como iniciar, parar ou reiniciar um NDB Cluster com um grande número de nós. O cliente MySQL Cluster Manager também suporta comandos para obter e definir os valores da maioria dos parâmetros de configuração do nó, bem como as opções e variáveis do servidor **mysqld** relacionadas ao NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 1.4.8, para obter mais informações.
