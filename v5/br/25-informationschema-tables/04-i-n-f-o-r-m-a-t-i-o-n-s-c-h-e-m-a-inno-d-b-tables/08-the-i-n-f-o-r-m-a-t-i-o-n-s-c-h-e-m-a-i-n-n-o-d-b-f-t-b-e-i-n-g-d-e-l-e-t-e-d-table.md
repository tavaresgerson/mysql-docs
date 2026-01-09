### 24.4.8 A tabela INFORMATION_SCHEMA INNODB_FT_BEING_DELETED

A tabela `INNODB_FT_BEING_DELETED` fornece um instantâneo da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção de `OPTIMIZE TABLE`. Quando a `OPTIMIZE TABLE` é executada, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo da tabela `INNODB_FT_BEING_DELETED` geralmente tem uma vida útil curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para obter informações sobre como executar a `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte Seção 12.9.6, “Ajuste fino da pesquisa full-text do MySQL”.

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`. A saída aparece semelhante ao exemplo fornecido para a tabela `INNODB_FT_DELETED`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.

A tabela [`INNODB_FT_BEING_DELETED`](https://pt.wikipedia.org/wiki/Tabela_INNODB_FT_BEING_DELETED) tem as seguintes colunas:

- `DOC_ID`

  O ID do documento da linha que está em processo de exclusão. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para ignorar linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `[OPTIMIZE TABLE`]\(optimize-table.html). Para mais informações, consulte Otimização de índices full-text InnoDB.

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indeksos de Texto Completo do InnoDB” e Seção 12.9, “Funções de Pesquisa de Texto Completo”.
