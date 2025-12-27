### 28.4.17 A Tabela `INFORMATION\_SCHEMA\_INNODB\_FT\_DELETED`

A tabela `INNODB_FT_DELETED` armazena linhas que são excluídas do índice `FULLTEXT` de uma tabela `InnoDB`. Para evitar a reorganização do índice, que é um processo caro, durante operações DML para um índice `FULLTEXT` `InnoDB`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma instrução `OPTIMIZE TABLE` para a tabela `InnoDB`. Para obter mais informações, consulte Otimizando índices de texto completo de InnoDB.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de índice FULLTEXT do INFORMATION_SCHEMA de InnoDB”.

A tabela `INNODB_FT_DELETED` tem as seguintes colunas:

* `DOC_ID`

  O ID do documento da linha recém-excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado ao realizar pesquisas de texto, para ignorar linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `OPTIMIZE TABLE`. Para mais informações, consulte Otimizando índices de texto completo de InnoDB.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
+--------+
| DOC_ID |
+--------+
|      6 |
|      7 |
|      8 |
+--------+
```

#### Notas

* Você deve ter o privilégio `PROCESS` para fazer uma consulta a esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para obter mais informações sobre a pesquisa `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”, e a Seção 14.9, “Funções de Pesquisa de Texto Completo”.