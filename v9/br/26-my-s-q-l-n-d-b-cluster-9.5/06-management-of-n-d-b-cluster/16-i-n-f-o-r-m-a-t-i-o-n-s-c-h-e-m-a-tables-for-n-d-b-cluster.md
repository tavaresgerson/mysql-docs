### 25.6.16 Tabelas do esquema de informações para o NDB Cluster

Duas tabelas do esquema de informações fornecem informações que são particularmente úteis ao gerenciar um NDB Cluster. A tabela `FILES` fornece informações sobre os arquivos de dados de disco do NDB Cluster (consulte a Seção 25.6.11.1, “Objetos de dados de disco do NDB Cluster”). A tabela `ndb_transid_mysql_connection_map` fornece uma mapeia entre transações, coordenadores de transações e nós da API.

Dados estatísticos adicionais e outros dados sobre transações, operações, threads, blocos e outros aspectos do desempenho do NDB Cluster podem ser obtidos das tabelas no banco de dados `ndbinfo`. Para informações sobre essas tabelas, consulte a Seção 25.6.15, “ndbinfo: O banco de dados de informações do NDB Cluster”.