### 24.4.13 A Tabela INNODB_FT_INDEX_TABLE do INFORMATION_SCHEMA

A tabela [`INNODB_FT_INDEX_TABLE`](information-schema-innodb-ft-index-table-table.html "24.4.13 A Tabela INNODB_FT_INDEX_TABLE do INFORMATION_SCHEMA") fornece informações sobre o inverted Index usado para processar buscas de texto no Index `FULLTEXT` de uma tabela `InnoDB`.

Esta tabela está vazia inicialmente. Antes de executar uma Query nela, defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_INDEX_TABLE`](information-schema-innodb-ft-index-table-table.html "24.4.13 A Tabela INNODB_FT_INDEX_TABLE do INFORMATION_SCHEMA") possui as seguintes colunas:

* `WORD`

  Uma palavra extraída do texto das colunas que fazem parte de um Index `FULLTEXT`.

* `FIRST_DOC_ID`

  O primeiro ID de documento no qual esta palavra aparece no Index `FULLTEXT`.

* `LAST_DOC_ID`

  O último ID de documento no qual esta palavra aparece no Index `FULLTEXT`.

* `DOC_COUNT`

  O número de linhas nas quais esta palavra aparece no Index `FULLTEXT`. A mesma palavra pode ocorrer várias vezes dentro da tabela de cache, uma vez para cada combinação dos valores `DOC_ID` e `POSITION`.

* `DOC_ID`

  O ID do documento da linha que contém a palavra. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada.

* `POSITION`

  A posição desta ocorrência específica da palavra dentro do documento relevante identificado pelo valor `DOC_ID`.

#### Notas

* Esta tabela está vazia inicialmente. Antes de executar uma Query nela, defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`. O exemplo a seguir demonstra como usar a variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para mostrar informações sobre um Index `FULLTEXT` para uma tabela especificada. Antes que as informações para as linhas recém-inseridas apareçam em `INNODB_FT_INDEX_TABLE`, o cache do Index `FULLTEXT` deve ser descarregado (flushed) para o disco. Isso é realizado executando uma operação [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") na tabela indexada com a variável de sistema [`innodb_optimize_fulltext_only`](innodb-parameters.html#sysvar_innodb_optimize_fulltext_only) habilitada. (O exemplo desabilita essa variável novamente no final, pois ela se destina a ser habilitada apenas temporariamente.)

  ```sql
  mysql> USE test;

  mysql> CREATE TABLE articles (
           id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
           title VARCHAR(200),
           body TEXT,
           FULLTEXT (title,body)
         ) ENGINE=InnoDB;

  mysql> INSERT INTO articles (title,body) VALUES
         ('MySQL Tutorial','DBMS stands for DataBase ...'),
         ('How To Use MySQL Well','After you went through a ...'),
         ('Optimizing MySQL','In this tutorial we show ...'),
         ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
         ('MySQL vs. YourSQL','In the following database comparison ...'),
         ('MySQL Security','When configured properly, MySQL ...');

  mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

  mysql> OPTIMIZE TABLE articles;
  +---------------+----------+----------+----------+
  | Table         | Op       | Msg_type | Msg_text |
  +---------------+----------+----------+----------+
  | test.articles | optimize | status   | OK       |
  +---------------+----------+----------+----------+

  mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';

  mysql> SELECT WORD, DOC_COUNT, DOC_ID, POSITION
         FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
  +------------+-----------+--------+----------+
  | WORD       | DOC_COUNT | DOC_ID | POSITION |
  +------------+-----------+--------+----------+
  | 1001       |         1 |      4 |        0 |
  | after      |         1 |      2 |       22 |
  | comparison |         1 |      5 |       44 |
  | configured |         1 |      6 |       20 |
  | database   |         2 |      1 |       31 |
  +------------+-----------+--------+----------+

  mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
  ```

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para executar uma Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 A Tabela COLUMNS do INFORMATION_SCHEMA") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte [Seção 14.6.2.4, “Indexes Full-Text do InnoDB”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Seção 12.9, “Funções de Busca Full-Text”](fulltext-search.html "12.9 Full-Text Search Functions").