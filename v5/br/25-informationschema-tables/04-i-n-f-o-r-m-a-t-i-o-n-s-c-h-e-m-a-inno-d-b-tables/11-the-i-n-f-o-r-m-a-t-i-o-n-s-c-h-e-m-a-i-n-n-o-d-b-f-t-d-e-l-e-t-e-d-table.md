### 24.4.11 A tabela INFORMATION_SCHEMA INNODB_FT_DELETED

A tabela [`INNODB_FT_DELETED`](https://pt.wikipedia.org/wiki/Tabela_INNODB_FT_DELETED) armazena linhas que são excluídas do índice `FULLTEXT` de uma tabela `InnoDB`. Para evitar a reorganização do índice, que é cara, durante operações DML para um índice `FULLTEXT` `InnoDB`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma declaração [`OPTIMIZE TABLE`](https://pt.wikipedia.org/wiki/Optimizar_tabela) para a tabela `InnoDB`. Para mais informações, consulte [Otimização de índices full-text `InnoDB`](https://pt.wikipedia.org/wiki/Otimizar_índice_fulltext_InnoDB#Otimizar_índice_fulltext).

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.

A tabela [`INNODB_FT_DELETED`](https://pt.wikipedia.org/wiki/Tabela_INNODB_FT_DELETED) tem as seguintes colunas:

- `DOC_ID`

  O ID do documento da linha recentemente excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado pelo `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para ignorar linhas na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das linhas excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma instrução `[OPTIMIZE TABLE`]\(optimize-table.html). Para mais informações, consulte Otimização de índices full-text InnoDB.

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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indeksos de Texto Completo do InnoDB” e Seção 12.9, “Funções de Pesquisa de Texto Completo”.
