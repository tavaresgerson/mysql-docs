### 24.4.9 A Tabela INFORMATION_SCHEMA INNODB_FT_CONFIG

A tabela `INNODB_FT_CONFIG` fornece metadata sobre o Index `FULLTEXT` e o processamento associado para uma tabela `InnoDB`.

Esta tabela está vazia inicialmente. Antes de realizar um Query nela, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do Database) da tabela que contém o Index `FULLTEXT`; por exemplo `test/articles`.

Para informações de uso e exemplos relacionados, veja Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”.

A tabela `INNODB_FT_CONFIG` possui estas colunas:

* `KEY`

  O nome que designa um item de metadata para uma tabela `InnoDB` que contém um Index `FULLTEXT`.

  Os valores para esta coluna podem mudar, dependendo das necessidades de tuning de performance e debugging para o processamento full-text do `InnoDB`. Os nomes das KEYs e seus significados incluem:

  + `optimize_checkpoint_limit`: O número de segundos após o qual a execução de um `OPTIMIZE TABLE` é interrompida.

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

* Você deve ter o privilégio `PROCESS` para realizar Query nesta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou o Statement `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, veja Seção 14.6.2.4, “Indexes Full-Text do InnoDB” e Seção 12.9, “Funções de Busca Full-Text”.