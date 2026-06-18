### 28.4.17 A tabela INFORMATION\_SCHEMA INNODB\_FT\_DELETED

A tabela `INNODB_FT_DELETED` armazena linhas que são excluídas do índice `FULLTEXT` para uma tabela `InnoDB`. Para evitar a reorganização cara do índice durante operações de DML para um índice `InnoDB` `FULLTEXT`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma declaração `OPTIMIZE TABLE` para a tabela `InnoDB`. Para obter mais informações, consulte Otimização de índices de texto completo do InnoDB.

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_FT_DELETED` tem essas colunas:

- `DOC_ID`

  O ID do documento da linha recentemente excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para pular linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices de texto completo do InnoDB.

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

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”, e a Seção 14.9, “Funções de Busca de Texto Completo”.
