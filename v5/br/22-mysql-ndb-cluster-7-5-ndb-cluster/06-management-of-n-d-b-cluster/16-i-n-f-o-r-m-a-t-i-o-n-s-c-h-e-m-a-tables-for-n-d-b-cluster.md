### 21.6.16 Tabelas INFORMATION_SCHEMA para NDB Cluster

Duas tabelas `INFORMATION_SCHEMA` fornecem informações que são de uso particular ao gerenciar um NDB Cluster. A tabela `FILES` fornece informações sobre os arquivos NDB Cluster Disk Data. A tabela `ndb_transid_mysql_connection_map` fornece um mapeamento entre transactions, transaction coordinators e API nodes.

Dados estatísticos adicionais e outras informações sobre transactions, operations, threads, blocks e outros aspectos de performance do NDB Cluster podem ser obtidos das tabelas no `ndbinfo` database. Para informações sobre essas tabelas, veja Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”.