### 24.4.11 A Tabela INNODB_FT_DELETED do INFORMATION_SCHEMA

A tabela [`INNODB_FT_DELETED`](information-schema-innodb-ft-deleted-table.html "24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table") armazena linhas que foram excluídas do Index `FULLTEXT` para uma tabela `InnoDB`. Para evitar uma reorganização custosa do Index durante operações DML em um Index `FULLTEXT` do `InnoDB`, as informações sobre palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de busca quando você executa uma busca de texto, e removidas do Index de busca principal somente quando você emite uma instrução [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") para a tabela `InnoDB`. Para mais informações, consulte [Otimizando Full-Text Indexes do InnoDB](fulltext-fine-tuning.html#fulltext-optimize "Optimizing InnoDB Full-Text Indexes").

Esta tabela está vazia inicialmente. Antes de executar uma Query nela, defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome do Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.4, “Tabelas de Index FULLTEXT do InnoDB no INFORMATION_SCHEMA”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_DELETED`](information-schema-innodb-ft-deleted-table.html "24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table") possui estas colunas:

* `DOC_ID`

  O ID do documento da linha recém-excluída. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Este valor é usado quando você executa buscas de texto, para ignorar linhas na tabela [`INNODB_FT_INDEX_TABLE`](information-schema-innodb-ft-index-table-table.html "24.4.13 The INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE Table") antes que os dados das linhas excluídas sejam fisicamente removidos do Index `FULLTEXT` por meio de uma instrução [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"). Para mais informações, consulte [Otimizando Full-Text Indexes do InnoDB](fulltext-fine-tuning.html#fulltext-optimize "Optimizing InnoDB Full-Text Indexes").

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
+--------+
| DOC_ID |
+--------+
|      6 |
|      7 |
|      8 |
+--------+
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para executar Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte [Seção 14.6.2.4, “Full-Text Indexes do InnoDB”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Seção 12.9, “Funções de Busca Full-Text”](fulltext-search.html "12.9 Full-Text Search Functions").