### 21.6.16 INFORMATION\_SCHEMA Tabelas para NDB Cluster

Duas tabelas do `INFORMATION_SCHEMA` fornecem informações que são particularmente úteis ao gerenciar um NDB Cluster. A tabela `FILES` fornece informações sobre os arquivos de dados do disco do NDB Cluster. A tabela `ndb_transid_mysql_connection_map` fornece uma mapeia entre transações, coordenadores de transações e nós da API.

Dados estatísticos adicionais e outros dados sobre transações, operações, threads, blocos e outros aspectos do desempenho do NDB Cluster podem ser obtidos das tabelas no banco de dados `ndbinfo`. Para obter informações sobre essas tabelas, consulte Seção 21.6.15, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.
