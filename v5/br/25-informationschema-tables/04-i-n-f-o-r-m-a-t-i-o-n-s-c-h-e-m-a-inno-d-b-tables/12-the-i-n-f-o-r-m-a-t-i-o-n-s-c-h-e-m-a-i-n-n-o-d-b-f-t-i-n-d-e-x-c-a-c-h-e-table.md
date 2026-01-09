### 24.4.12 A tabela INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE

A tabela [`INNODB_FT_INDEX_CACHE`](https://pt.wikipedia.org/wiki/Tabela_de_cache_de_índice_FULLTEXT) fornece informações sobre tokens de novas linhas inseridas em um índice `FULLTEXT`. Para evitar a reorganização do índice cara durante operações DML, as informações sobre as palavras indexadas recentemente são armazenadas separadamente e combinadas com o índice de pesquisa principal apenas quando a instrução [`OPTIMIZE TABLE`](https://pt.wikipedia.org/wiki/Optimizar_tabela) é executada, quando o servidor é desligado ou quando o tamanho do cache excede um limite definido pela variável de sistema [`innodb_ft_cache_size`](https://pt.wikipedia.org/wiki/Variável_sysvar_innodb_ft_cache_size) ou pela variável de sistema [`innodb_ft_total_cache_size`](https://pt.wikipedia.org/wiki/Variável_sysvar_innodb_ft_total_cache_size).

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.

A tabela `INNODB_FT_INDEX_CACHE` tem as seguintes colunas:

- `PALAVRA`

  Uma palavra extraída do texto de uma linha recém-inserida.

- `PRIMEIRO_ID_DOC`

  O primeiro ID de documento no qual essa palavra aparece no índice `FULLTEXT`.

- `LAST_DOC_ID`

  O último ID de documento no qual essa palavra aparece no índice `FULLTEXT`.

- `DOC_COUNT`

  O número de linhas em que essa palavra aparece no índice `FULLTEXT`. A mesma palavra pode ocorrer várias vezes na tabela de cache, uma vez para cada combinação de valores de `DOC_ID` e `POSITION`.

- `DOC_ID`

  O ID do documento da linha recém-inserida. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada.

- `POSIÇÃO`

  A posição dessa instância específica da palavra dentro do documento relevante identificado pelo valor `DOC_ID`. O valor não representa uma posição absoluta; é um deslocamento adicionado à `POSIÇÃO` da instância anterior dessa palavra.

#### Notas

- Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`. O exemplo a seguir demonstra como usar a variável de sistema `innodb_ft_aux_table` para exibir informações sobre um índice `FULLTEXT` para uma tabela especificada.

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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indeksos de Texto Completo do InnoDB” e Seção 12.9, “Funções de Pesquisa de Texto Completo”.
