### 24.4.8 A Tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED

A tabela `INNODB_FT_BEING_DELETED` fornece um snapshot da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada, e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` tipicamente tem um tempo de vida curto, esta tabela possui utilidade limitada para monitoramento ou debugging. Para informações sobre a execução de `OPTIMIZE TABLE` em tabelas com Indexes `FULLTEXT`, consulte Section 12.9.6, “Fine-Tuning MySQL Full-Text Search”.

Inicialmente, esta tabela está vazia. Antes de realizar uma Query nela, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome da Database) da tabela que contém o Index `FULLTEXT`; por exemplo `test/articles`. A saída é semelhante ao exemplo fornecido para a tabela `INNODB_FT_DELETED`.

Para informações de uso e exemplos relacionados, consulte Section 14.16.4, “InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables”.

A tabela `INNODB_FT_BEING_DELETED` possui estas colunas:

* `DOC_ID`

  O ID de documento da linha que está em processo de exclusão. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém nenhuma coluna adequada. Este valor é usado quando você realiza buscas de texto, para pular linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam fisicamente removidos do Index `FULLTEXT` por meio de um comando `OPTIMIZE TABLE`. Para mais informações, consulte Optimizing InnoDB Full-Text Indexes.

#### Notas

* Você deve ter o privilégio `PROCESS` para executar Query nesta tabela.

* Utilize a tabela `INFORMATION_SCHEMA` `COLUMNS` ou o comando `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte Section 14.6.2.4, “InnoDB Full-Text Indexes” e Section 12.9, “Full-Text Search Functions”.