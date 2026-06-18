### 28.4.14 A tabela INFORMATION\_SCHEMA INNODB\_FT\_BEING\_DELETED

A tabela `INNODB_FT_BEING_DELETED` fornece um instantâneo da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando o `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` geralmente tem uma vida útil curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para obter informações sobre como executar o `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 14.9.6, “Ajuste fino da pesquisa de texto completo do MySQL”.

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`). A saída aparece semelhante ao exemplo fornecido para a tabela `INNODB_FT_DELETED`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_FT_BEING_DELETED` tem essas colunas:

- `DOC_ID`

  O ID do documento da linha que está sendo excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para pular linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices de texto completo do InnoDB.

#### Notas

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Para obter mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”, e a Seção 14.9, “Funções de Busca de Texto Completo”.
