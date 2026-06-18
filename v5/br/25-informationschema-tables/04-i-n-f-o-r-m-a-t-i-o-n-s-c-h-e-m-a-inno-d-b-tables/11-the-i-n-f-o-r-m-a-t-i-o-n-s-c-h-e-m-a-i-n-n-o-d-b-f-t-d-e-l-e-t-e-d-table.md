### 24.4.11 A Tabela INNODB_FT_DELETED do INFORMATION_SCHEMA

A tabela `INNODB_FT_DELETED` armazena linhas que foram excluídas do Index `FULLTEXT` para uma tabela `InnoDB`. Para evitar uma reorganização custosa do Index durante operações DML em um Index `FULLTEXT` do `InnoDB`, as informações sobre palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de busca quando você executa uma busca de texto, e removidas do Index de busca principal somente quando você emite uma instrução `OPTIMIZE TABLE` para a tabela `InnoDB`. Para mais informações, consulte Otimizando Full-Text Indexes do InnoDB.

Esta tabela está vazia inicialmente. Antes de executar uma Query nela, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do Database) da tabela que contém o Index `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso e exemplos relacionados, consulte Seção 14.16.4, “Tabelas de Index FULLTEXT do InnoDB no INFORMATION_SCHEMA”.

A tabela `INNODB_FT_DELETED` possui estas colunas:

* `DOC_ID`

  O ID do documento da linha recém-excluída. Este valor pode refletir o valor de uma coluna ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Este valor é usado quando você executa buscas de texto, para ignorar linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam fisicamente removidos do Index `FULLTEXT` por meio de uma instrução `OPTIMIZE TABLE`. Para mais informações, consulte Otimizando Full-Text Indexes do InnoDB.

#### Exemplo

```sql
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

* Você deve ter o privilégio `PROCESS` para executar Query nesta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Full-Text Indexes do InnoDB” e Seção 12.9, “Funções de Busca Full-Text”.