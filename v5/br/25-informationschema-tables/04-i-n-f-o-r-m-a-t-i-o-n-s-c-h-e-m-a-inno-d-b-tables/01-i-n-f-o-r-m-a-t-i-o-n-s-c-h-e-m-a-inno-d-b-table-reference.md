### 24.4.1 Referência de Tabelas InnoDB do INFORMATION_SCHEMA

A tabela a seguir resume as tabelas InnoDB do `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições individuais das tabelas.

**Tabela 24.3 Tabelas InnoDB do INFORMATION_SCHEMA**

| Nome da Tabela | Descrição | Descontinuada |
| :--- | :--- | :--- |
| `INNODB_BUFFER_PAGE` | Páginas no InnoDB Buffer Pool | |
| `INNODB_BUFFER_PAGE_LRU` | Ordenação LRU das páginas no InnoDB Buffer Pool | |
| `INNODB_BUFFER_POOL_STATS` | Estatísticas do InnoDB Buffer Pool | |
| `INNODB_CMP` | Status das operações relacionadas a tabelas InnoDB compactadas | |
| `INNODB_CMP_PER_INDEX` | Status das operações relacionadas a tabelas e Indexes InnoDB compactados | |
| `INNODB_CMP_PER_INDEX_RESET` | Status das operações relacionadas a tabelas e Indexes InnoDB compactados | |
| `INNODB_CMP_RESET` | Status das operações relacionadas a tabelas InnoDB compactadas | |
| `INNODB_CMPMEM` | Status das páginas compactadas dentro do InnoDB Buffer Pool | |
| `INNODB_CMPMEM_RESET` | Status das páginas compactadas dentro do InnoDB Buffer Pool | |
| `INNODB_FT_BEING_DELETED` | Snapshot da tabela INNODB_FT_DELETED | |
| `INNODB_FT_CONFIG` | Metadados para FULLTEXT Index de tabelas InnoDB e processamento associado | |
| `INNODB_FT_DEFAULT_STOPWORD` | Lista padrão de "stopwords" para FULLTEXT Indexes InnoDB | |
| `INNODB_FT_DELETED` | Linhas excluídas do FULLTEXT Index de tabelas InnoDB | |
| `INNODB_FT_INDEX_CACHE` | Informações de Token para linhas recém-inseridas no FULLTEXT Index InnoDB | |
| `INNODB_FT_INDEX_TABLE` | Informações de Inverted Index para processamento de buscas de texto em FULLTEXT Index de tabelas InnoDB | |
| `INNODB_LOCK_WAITS` | Informações de espera de Lock de transações InnoDB | 5.7.14 |
| `INNODB_LOCKS` | Informações de Lock de transações InnoDB | 5.7.14 |
| `INNODB_METRICS` | Informações de performance do InnoDB | |
| `INNODB_SYS_COLUMNS` | Colunas em cada tabela InnoDB | |
| `INNODB_SYS_DATAFILES` | Informações de caminho de Data File para tablespaces file-per-table e gerais do InnoDB | |
| `INNODB_SYS_FIELDS` | Colunas chave de Indexes InnoDB | |
| `INNODB_SYS_FOREIGN` | Metadados de Foreign Key InnoDB | |
| `INNODB_SYS_FOREIGN_COLS` | Informações de status de coluna de Foreign Key InnoDB | |
| `INNODB_SYS_INDEXES` | Metadados de Index InnoDB | |
| `INNODB_SYS_TABLES` | Metadados de tabela InnoDB | |
| `INNODB_SYS_TABLESPACES` | Metadados de tablespace file-per-table, geral e undo do InnoDB | |
| `INNODB_SYS_TABLESTATS` | Informações de status de baixo nível de tabelas InnoDB | |
| `INNODB_SYS_VIRTUAL` | Metadados de coluna gerada virtual do InnoDB | |
| `INNODB_TEMP_TABLE_INFO` | Informações sobre tabelas temporárias InnoDB ativas criadas pelo usuário | |
| `INNODB_TRX` | Informações de transação InnoDB ativas | |