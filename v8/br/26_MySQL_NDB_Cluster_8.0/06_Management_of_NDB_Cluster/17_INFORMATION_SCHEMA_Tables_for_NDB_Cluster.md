### 25.6.17 INFORMATION\_SCHEMA Tabelas para NDB Cluster

Duas tabelas `INFORMATION_SCHEMA` fornecem informações que são particularmente úteis ao gerenciar um NDB Cluster. A tabela `FILES` fornece informações sobre os arquivos de dados de disco do NDB Cluster (consulte a Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster”). A tabela `ndb_transid_mysql_connection_map` fornece uma maquete entre transações, coordenadores de transações e nós da API.

Dados estatísticos adicionais e outros dados sobre transações, operações, threads, blocos e outros aspectos do desempenho do NDB Cluster podem ser obtidos das tabelas no banco de dados `ndbinfo`. Para obter informações sobre essas tabelas, consulte a Seção 25.6.16, “ndbinfo: O Banco de Dados de Informações do NDB Cluster”.
