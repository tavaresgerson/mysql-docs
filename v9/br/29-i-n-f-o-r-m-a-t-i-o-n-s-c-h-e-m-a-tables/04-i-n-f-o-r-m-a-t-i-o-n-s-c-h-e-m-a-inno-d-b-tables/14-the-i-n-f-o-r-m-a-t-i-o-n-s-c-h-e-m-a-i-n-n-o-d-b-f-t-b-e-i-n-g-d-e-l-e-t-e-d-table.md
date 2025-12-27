### 28.4.14 A tabela `INFORMATION\_SCHEMA INNODB\_FT\_BEING\_DELETED`

A tabela `INNODB_FT_BEING_DELETED` fornece um instantâneo da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando a `OPTIMIZE TABLE` é executada, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` geralmente tem uma vida útil curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para obter informações sobre como executar a `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 14.9.6, “Ajuste fino da pesquisa full-text do MySQL”.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`). A saída aparece de forma semelhante ao exemplo fornecido para a tabela `INNODB_FT_DELETED`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de índice full-text do InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_FT_BEING_DELETED` tem essas colunas:

* `DOC_ID`

  O ID do documento da linha que está em processo de ser excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para ignorar linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices full-text do InnoDB.

#### Notas

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Para mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte a Seção 17.6.2.4, “Indeksos Full-Text do InnoDB” e a Seção 14.9, “Funções de Pesquisa Full-Text”.