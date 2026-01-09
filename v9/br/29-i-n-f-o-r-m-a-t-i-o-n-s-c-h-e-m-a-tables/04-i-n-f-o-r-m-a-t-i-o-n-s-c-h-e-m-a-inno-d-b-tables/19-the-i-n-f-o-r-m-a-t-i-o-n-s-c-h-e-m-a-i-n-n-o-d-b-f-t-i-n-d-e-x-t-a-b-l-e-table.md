### 28.4.19 A Tabela `INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE`

A tabela `INNODB_FT_INDEX_TABLE` fornece informações sobre o índice invertido usado para processar pesquisas de texto contra o índice `FULLTEXT` de uma tabela `InnoDB`.

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de Índices `FULLTEXT` do INFORMATION_SCHEMA de InnoDB”.

A tabela `INNODB_FT_INDEX_TABLE` tem as seguintes colunas:

* `WORD`

  Uma palavra extraída do texto das colunas que fazem parte de um `FULLTEXT`.

* `FIRST_DOC_ID`

  O primeiro ID de documento em que essa palavra aparece no índice `FULLTEXT`.

* `LAST_DOC_ID`

  O último ID de documento em que essa palavra aparece no índice `FULLTEXT`.

* `DOC_COUNT`

  O número de linhas em que essa palavra aparece no índice `FULLTEXT`. A mesma palavra pode ocorrer várias vezes na tabela de cache, uma vez para cada combinação de valores de `DOC_ID` e `POSITION`.

* `DOC_ID`

  O ID de documento da linha que contém a palavra. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada.

* `POSITION`

  A posição dessa instância particular da palavra dentro do documento relevante identificado pelo valor do `DOC_ID`.

#### Notas

* Essa tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`). O exemplo a seguir demonstra como usar a variável de sistema `innodb_ft_aux_table` para exibir informações sobre um índice `FULLTEXT` para uma tabela especificada. Antes que as informações das linhas recém-inseridas apareçam em `INNODB_FT_INDEX_TABLE`, o cache do índice `FULLTEXT` deve ser descarregado no disco. Isso é feito executando uma operação `OPTIMIZE TABLE` na tabela indexada com a variável de sistema `innodb_optimize_fulltext_only` habilitada. (O exemplo desabilita essa variável novamente no final, pois é destinado a ser habilitada apenas temporariamente.)

```JyfdYvmynj
* Você deve ter o privilégio `PROCESS` para consultar essa tabela.
* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessa tabela, incluindo tipos de dados e valores padrão.
* Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte a Seção 17.6.2.4, “Indekses Full-Text do InnoDB”, e a Seção 14.9, “Funções de Pesquisa Full-Text”.