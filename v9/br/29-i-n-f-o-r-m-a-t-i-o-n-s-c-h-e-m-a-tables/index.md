# Capítulo 28 Tabelas do esquema de informações

**Índice**

28.1 Introdução

28.2 Referência da tabela do esquema de informações

28.3 Tabelas gerais do esquema de informações:   28.3.1 Referência da tabela geral do esquema de informações

    28.3.2 A tabela de autorizações de papel administrável do esquema de informações

    28.3.3 A tabela de papéis aplicáveis do esquema de informações

    28.3.4 A tabela de conjuntos de caracteres do esquema de informações

    28.3.5 A tabela de restrições de verificação do esquema de informações

    28.3.6 A tabela de combinações do esquema de informações

    28.3.7 A tabela de aplicabilidade de conjuntos de caracteres de combinação do esquema de informações

    28.3.8 A tabela de colunas do esquema de informações

    28.3.9 A tabela de extensões de colunas do esquema de informações

    28.3.10 A tabela de privilégios de colunas do esquema de informações

    28.3.11 A tabela de estatísticas de colunas do esquema de informações

    28.3.12 A tabela de papéis habilitados do esquema de informações

    28.3.13 A tabela de motores do esquema de informações

    28.3.14 A tabela de eventos do esquema de informações

    28.3.15 A tabela de arquivos do esquema de informações

    28.3.16 A tabela de uso de colunas de chaves do esquema de informações

    28.3.17 A tabela de palavras-chave do esquema de informações

    28.3.18 A tabela de visões de dualidade JSON do esquema de informações

    28.3.19 A tabela de colunas de visões de dualidade JSON do esquema de informações

    28.3.20 A tabela de links de visões de dualidade JSON do esquema de informações

    28.3.21 A tabela de tabelas de visões de dualidade JSON do esquema de informações

    28.3.22 A tabela de bibliotecas do esquema de informações

    28.3.23 A tabela de mapeamento de conexões mysql_connection_map do ndb

    28.3.24 A tabela de rastreamento do otimizador do esquema de informações

    28.3.25 A tabela de parâmetros do esquema de informações

    28.3.26 A tabela de partições do esquema de informações

    28.3.27 A tabela de plugins do esquema de informações

28.3.28 A tabela INFORMATION_SCHEMA PROCESSLIST

    28.3.29 A tabela INFORMATION_SCHEMA PROFILING

    28.3.30 A tabela INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS

    28.3.31 A tabela INFORMATION_SCHEMA RESOURCE_GROUPS

    28.3.32 A tabela INFORMATION_SCHEMA ROLE_COLUMN_GRANTS

    28.3.33 A tabela INFORMATION_SCHEMA ROLE_ROUTINE_GRANTS

    28.3.34 A tabela INFORMATION_SCHEMA ROLE_TABLE_GRANTS

    28.3.35 A tabela INFORMATION_SCHEMA ROUTINE_LIBRARIES

    28.3.36 A tabela INFORMATION_SCHEMA ROUTINES

    28.3.37 A tabela INFORMATION_SCHEMA SCHEMATA

    28.3.38 A tabela INFORMATION_SCHEMA SCHEMATA_EXTENSIONS

    28.3.39 A tabela INFORMATION_SCHEMA SCHEMA_PRIVILEGES

    28.3.40 A tabela INFORMATION_SCHEMA STATISTICS

    28.3.41 A tabela INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS

    28.3.42 A tabela INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS

    28.3.43 A tabela INFORMATION_SCHEMA ST_UNITS_OF_MEASURE

    28.3.44 A tabela INFORMATION_SCHEMA TABLES

    28.3.45 A tabela INFORMATION_SCHEMA TABLES_EXTENSIONS

    28.3.46 A tabela INFORMATION_SCHEMA TABLESPACES_EXTENSIONS

    28.3.47 A tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS

    28.3.48 A tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS

    28.3.49 A tabela INFORMATION_SCHEMA TABLE_PRIVILEGES

    28.3.50 A tabela INFORMATION_SCHEMA TRIGGERS

    28.3.51 A tabela INFORMATION_SCHEMA USER_ATTRIBUTES

    28.3.52 A tabela INFORMATION_SCHEMA USER_PRIVILEGES

    28.3.53 A tabela INFORMATION_SCHEMA VIEWS

    28.3.54 A tabela INFORMATION_SCHEMA VIEW_ROUTINE_USAGE

    28.4 Tabelas do INFORMATION_SCHEMA InnoDB:   28.4.1 Referência da tabela INFORMATION_SCHEMA InnoDB

28.4.2 A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE

    28.4.3 A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU

    28.4.4 A tabela INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS

    28.4.5 A tabela INFORMATION_SCHEMA INNODB_CACHED_INDEXES

    28.4.6 As tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET

    28.4.7 As tabelas INFORMATION_SCHEMA INNODB_CMPMEM e INNODB_CMPMEM_RESET

    28.4.8 As tabelas INFORMATION_SCHEMA INNODB_CMP_PER_INDEX e INNODB_CMP_PER_INDEX_RESET

    28.4.9 A tabela INFORMATION_SCHEMA INNODB_COLUMNS

    28.4.10 A tabela INFORMATION_SCHEMA INNODB_DATAFILES

    28.4.11 A tabela INFORMATION_SCHEMA INNODB_FIELDS

    28.4.12 A tabela INFORMATION_SCHEMA INNODB_FOREIGN

    28.4.13 A tabela INFORMATION_SCHEMA INNODB_FOREIGN_COLS

    28.4.14 A tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED

    28.4.15 A tabela INFORMATION_SCHEMA INNODB_FT_CONFIG

    28.4.16 A tabela INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD

    28.4.17 A tabela INFORMATION_SCHEMA INNODB_FT_DELETED

    28.4.18 A tabela INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE

    28.4.19 A tabela INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE

    28.4.20 A tabela INFORMATION_SCHEMA INNODB_INDEXES

    28.4.21 A tabela INFORMATION_SCHEMA INNODB_METRICS

    28.4.22 A tabela INFORMATION_SCHEMA INNODB_SESSION_TEMP_TABLESPACES

    28.4.23 A tabela INFORMATION_SCHEMA INNODB_TABLES

    28.4.24 A tabela INFORMATION_SCHEMA INNODB_TABLESPACES

    28.4.25 A tabela INFORMATION_SCHEMA INNODB_TABLESPACES_BRIEF

    28.4.26 A visualização INFORMATION_SCHEMA INNODB_TABLESTATS

    28.4.27 A tabela INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO

28.4.28 A Tabela `INFORMATION_SCHEMA INNODB_TRX`

    28.4.29 A Tabela `INFORMATION_SCHEMA INNODB_VIRTUAL`

28.5 Tabelas de Pool de Fios do `INFORMATION_SCHEMA`:   28.5.1 Referência à Tabela de Pool de Fios `INFORMATION_SCHEMA`

    28.5.2 A Tabela `INFORMATION_SCHEMA TP_THREAD_GROUP_STATE`

    28.5.3 A Tabela `INFORMATION_SCHEMA TP_THREAD_GROUP_STATS`

    28.5.4 A Tabela `INFORMATION_SCHEMA TP_THREAD_STATE`

28.6 Tabelas de Controle de Conexão do `INFORMATION_SCHEMA`:   28.6.1 Referência à Tabela de Controle de Conexão `INFORMATION_SCHEMA`

    28.6.2 A Tabela `INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`

28.7 Tabelas do Plugin de Firewall do MySQL Enterprise do `INFORMATION_SCHEMA`:   28.7.1 Referência à Tabela de Plugin de Firewall `INFORMATION_SCHEMA`

    28.7.2 A Tabela `INFORMATION_SCHEMA MYSQL_FIREWALL_USERS`

    28.7.3 A Tabela `INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST`

28.8 Extensões para Declarações `SHOW`

O `INFORMATION_SCHEMA` fornece acesso a metadados do banco de dados, informações sobre o servidor MySQL, como o nome de um banco de dados ou tabela, o tipo de dado de uma coluna ou os privilégios de acesso. Outros termos que são usados às vezes para essas informações são dicionário de dados e catálogo do sistema.