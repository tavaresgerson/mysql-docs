### 24.4.12 A Tabela INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE

A tabela [`INNODB_FT_INDEX_CACHE`](information-schema-innodb-ft-index-cache-table.html "24.4.12 The INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE Table") fornece informações de token sobre linhas recém-inseridas em um Index `FULLTEXT`. Para evitar reorganizações dispendiosas do Index durante operações DML, as informações sobre palavras recém-indexadas são armazenadas separadamente e combinadas com o Index de busca principal somente quando [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") é executado, quando o servidor é desligado ou quando o tamanho do cache excede um limite definido pela variável de sistema [`innodb_ft_cache_size`](innodb-parameters.html#sysvar_innodb_ft_cache_size) ou [`innodb_ft_total_cache_size`](innodb-parameters.html#sysvar_innodb_ft_total_cache_size).

Esta tabela está vazia inicialmente. Antes de consultá-la (querying), defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

A tabela [`INNODB_FT_INDEX_CACHE`](information-schema-innodb-ft-index-cache-table.html "24.4.12 The INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE Table") possui estas colunas:

* `WORD`

  Uma palavra extraída do texto de uma linha recém-inserida.

* `FIRST_DOC_ID`

  O primeiro ID de documento no qual esta palavra aparece no Index `FULLTEXT`.

* `LAST_DOC_ID`

  O último ID de documento no qual esta palavra aparece no Index `FULLTEXT`.

* `DOC_COUNT`

  O número de linhas nas quais esta palavra aparece no Index `FULLTEXT`. A mesma palavra pode ocorrer várias vezes dentro da tabela cache, uma vez para cada combinação dos valores `DOC_ID` e `POSITION`.

* `DOC_ID`

  O ID de documento da linha recém-inserida. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada.

* `POSITION`

  A posição desta instância específica da palavra dentro do documento relevante identificado pelo valor `DOC_ID`. O valor não representa uma posição absoluta; é um offset (deslocamento) adicionado ao `POSITION` da instância anterior dessa palavra.

#### Notas

* Esta tabela está vazia inicialmente. Antes de consultá-la (querying), defina o valor da variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`. O exemplo a seguir demonstra como usar a variável de sistema [`innodb_ft_aux_table`](innodb-parameters.html#sysvar_innodb_ft_aux_table) para mostrar informações sobre um Index `FULLTEXT` para uma tabela especificada.

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

  mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';

  mysql> SELECT WORD, DOC_COUNT, DOC_ID, POSITION
         FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
  +------------+-----------+--------+----------+
  | WORD       | DOC_COUNT | DOC_ID | POSITION |
  +------------+-----------+--------+----------+
  | 1001       |         1 |      4 |        0 |
  | after      |         1 |      2 |       22 |
  | comparison |         1 |      5 |       44 |
  | configured |         1 |      6 |       20 |
  | database   |         2 |      1 |       31 |
  +------------+-----------+--------+----------+
  ```

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar (query) esta tabela.

* Use a tabela `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Para obter mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte [Seção 14.6.2.4, “Indexes Full-Text do InnoDB”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes") e [Seção 12.9, “Funções de Busca Full-Text”](fulltext-search.html "12.9 Full-Text Search Functions").
