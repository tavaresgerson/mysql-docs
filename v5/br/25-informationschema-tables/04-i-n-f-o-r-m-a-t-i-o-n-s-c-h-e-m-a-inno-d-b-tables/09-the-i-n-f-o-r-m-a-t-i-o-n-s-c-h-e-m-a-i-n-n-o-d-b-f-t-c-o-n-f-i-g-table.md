### 24.4.9 A Tabela INFORMATION_SCHEMA INNODB_FT_CONFIG

A tabela [`INNODB_FT_CONFIG`](information-schema-innodb-ft-config-table.html "24.4.9 The INFORMATION_SCHEMA INNODB_FT_CONFIG Table") fornece metadata sobre o Index `FULLTEXT` e o processamento associado para uma tabela `InnoDB`.

Esta tabela está vazia inicialmente. Antes de realizar um Query nela, defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome do Database) da tabela que contém o Index `FULLTEXT`; por exemplo `test/articles`.

Para informações de uso e exemplos relacionados, veja [Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_CONFIG`](information-schema-innodb-ft-config-table.html "24.4.9 The INFORMATION_SCHEMA INNODB_FT_CONFIG Table") possui estas colunas:

* `KEY`

  O nome que designa um item de metadata para uma tabela `InnoDB` que contém um Index `FULLTEXT`.

  Os valores para esta coluna podem mudar, dependendo das necessidades de tuning de performance e debugging para o processamento full-text do `InnoDB`. Os nomes das KEYs e seus significados incluem:

  + `optimize_checkpoint_limit`: O número de segundos após o qual a execução de um [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") é interrompida.

  + `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

  + `stopword_table_name`: O nome *`database/table`* para uma tabela de stopword definida pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de stopword definida pelo usuário.

  + `use_stopword`: Indica se uma tabela de stopword é usada, a qual é definida quando o Index `FULLTEXT` é criado.

* `VALUE`

  O valor associado à coluna `KEY` correspondente, refletindo algum limite ou valor atual para um aspecto de um Index `FULLTEXT` para uma tabela `InnoDB`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
+---------------------------+-------------------+
| KEY                       | VALUE             |
+---------------------------+-------------------+
| optimize_checkpoint_limit | 180               |
| synced_doc_id             | 0                 |
| stopword_table_name       | test/my_stopwords |
| use_stopword              | 1                 |
+---------------------------+-------------------+
```

#### Notas

* Esta tabela destina-se apenas à configuração interna. Ela não se destina a fins de informação estatística.

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o Statement [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, veja [Seção 14.6.2.4, “Indexes Full-Text do InnoDB”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Seção 12.9, “Funções de Busca Full-Text”](fulltext-search.html "12.9 Full-Text Search Functions").