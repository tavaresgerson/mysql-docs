### 24.4.10 A Tabela INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD

A tabela [`INNODB_FT_DEFAULT_STOPWORD`](information-schema-innodb-ft-default-stopword-table.html "24.4.10 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table") contém uma lista de [stopwords](glossary.html#glos_stopword "stopword") que são usadas por padrão ao criar um Index `FULLTEXT` em tabelas `InnoDB`. Para obter informações sobre a lista padrão de `stopwords` do `InnoDB` e como definir suas próprias listas de `stopwords`, consulte [Seção 12.9.4, “Full-Text Stopwords”](fulltext-stopwords.html "12.9.4 Full-Text Stopwords").

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_DEFAULT_STOPWORD`](information-schema-innodb-ft-default-stopword-table.html "24.4.10 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table") possui estas colunas:

* `value`

  Uma palavra que é usada por padrão como uma `stopword` para Indexes `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você substituir o processamento padrão de `stopwords` com a variável de sistema [`innodb_ft_server_stopword_table`](innodb-parameters.html#sysvar_innodb_ft_server_stopword_table) ou [`innodb_ft_user_stopword_table`](innodb-parameters.html#sysvar_innodb_ft_user_stopword_table).

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

#### Notas

* Você deve ter o privilege [`PROCESS`](privileges-provided.html#priv_process) para realizar uma Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte [Seção 14.6.2.4, “Indexes Full-Text do InnoDB”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Seção 12.9, “Funções de Busca Full-Text”](fulltext-search.html "12.9 Full-Text Search Functions").