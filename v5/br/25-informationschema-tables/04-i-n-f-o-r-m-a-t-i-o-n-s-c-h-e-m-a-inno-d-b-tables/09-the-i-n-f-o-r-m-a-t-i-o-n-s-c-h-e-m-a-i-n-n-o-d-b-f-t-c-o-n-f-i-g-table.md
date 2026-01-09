### 24.4.9 A tabela INFORMATION_SCHEMA INNODB_FT_CONFIG

A tabela `INNODB_FT_CONFIG` fornece metadados sobre o índice `FULLTEXT` e o processamento associado a uma tabela `InnoDB`.

Esta tabela está inicialmente vazia. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.

A tabela `INNODB_FT_CONFIG` tem as seguintes colunas:

- `CHAVE`

  O nome que designa um item de metadados para uma tabela `InnoDB` que contém um índice `FULLTEXT`.

  Os valores desta coluna podem mudar, dependendo das necessidades de ajuste de desempenho e depuração para o processamento de texto completo do `InnoDB`. Os nomes das chaves e seus significados incluem:

  - `optimize_checkpoint_limit`: O número de segundos após o qual uma execução de `OPTIMIZE TABLE` é interrompida.

  - `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

  - `stopword_table_name`: O nome do *`banco de dados/tabela`* para uma tabela de palavras-chave definidas pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de palavras-chave definida pelo usuário.

  - `use_stopword`: Indica se uma tabela de palavras-chave é usada, que é definida quando o índice `FULLTEXT` é criado.

- `VALOR`

  O valor associado à coluna `KEY` correspondente, que reflete algum limite ou valor atual para um aspecto de um índice `FULLTEXT` para uma tabela `InnoDB`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
+---------------------------+-------------------+
| KEY                       | VALUE             |
+---------------------------+-------------------+
| optimize_checkpoint_limit | 180               |
| synced_doc_id             | 0                 |
| stopword_table_name       | test/my_stopwords |
| use_stopword              | 1                 |
+---------------------------+-------------------+
```

#### Notas

- Esta tabela é destinada apenas para configuração interna. Não é destinada para fins de informações estatísticas.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indeksos de Texto Completo do InnoDB” e Seção 12.9, “Funções de Pesquisa de Texto Completo”.
