### 24.4.8 A Tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED

A tabela [`INNODB_FT_BEING_DELETED`](information-schema-innodb-ft-being-deleted-table.html "24.4.8 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table") fornece um snapshot da tabela [`INNODB_FT_DELETED`](information-schema-innodb-ft-deleted-table.html "24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table"); ela é usada apenas durante uma operação de manutenção [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"). Quando [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") é executado, a tabela [`INNODB_FT_BEING_DELETED`](information-schema-innodb-ft-being-deleted-table.html "24.4.8 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table") é esvaziada, e os valores de `DOC_ID` são removidos da tabela [`INNODB_FT_DELETED`](information-schema-innodb-ft-deleted-table.html "24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table"). Como o conteúdo de [`INNODB_FT_BEING_DELETED`](information-schema-innodb-ft-being-deleted-table.html "24.4.8 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table") tipicamente tem um tempo de vida curto, esta tabela possui utilidade limitada para monitoramento ou debugging. Para informações sobre a execução de [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") em tabelas com Indexes `FULLTEXT`, consulte [Section 12.9.6, “Fine-Tuning MySQL Full-Text Search”](fulltext-fine-tuning.html "12.9.6 Fine-Tuning MySQL Full-Text Search").

Inicialmente, esta tabela está vazia. Antes de realizar uma Query nela, defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo `test/articles`. A saída é semelhante ao exemplo fornecido para a tabela [`INNODB_FT_DELETED`](information-schema-innodb-ft-deleted-table.html "24.4.11 The INFORMATION_SCHEMA INNODB_FT_DELETED Table").

Para informações de uso e exemplos relacionados, consulte [Section 14.16.4, “InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_BEING_DELETED`](information-schema-innodb-ft-being-deleted-table.html "24.4.8 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table") possui estas colunas:

* `DOC_ID`

  O ID de documento da linha que está em processo de exclusão. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém nenhuma coluna adequada. Este valor é usado quando você realiza buscas de texto, para pular linhas na tabela [`INNODB_FT_INDEX_TABLE`](information-schema-innodb-ft-index-table-table.html "24.4.13 The INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE Table") antes que os dados das linhas excluídas sejam fisicamente removidos do Index `FULLTEXT` por meio de um comando [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"). Para mais informações, consulte [Optimizing InnoDB Full-Text Indexes](fulltext-fine-tuning.html#fulltext-optimize "Optimizing InnoDB Full-Text Indexes").

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para executar Query nesta tabela.

* Utilize a tabela `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte [Section 14.6.2.4, “InnoDB Full-Text Indexes”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Section 12.9, “Full-Text Search Functions”](fulltext-search.html "12.9 Full-Text Search Functions").