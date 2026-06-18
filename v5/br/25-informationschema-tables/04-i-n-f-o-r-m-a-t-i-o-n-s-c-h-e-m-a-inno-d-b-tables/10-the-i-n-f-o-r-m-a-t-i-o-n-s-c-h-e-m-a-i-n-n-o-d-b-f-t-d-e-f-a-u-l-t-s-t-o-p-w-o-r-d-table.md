### 24.4.10 A Tabela INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD

A tabela `INNODB_FT_DEFAULT_STOPWORD` contém uma lista de stopwords que são usadas por padrão ao criar um Index `FULLTEXT` em tabelas `InnoDB`. Para obter informações sobre a lista padrão de `stopwords` do `InnoDB` e como definir suas próprias listas de `stopwords`, consulte Seção 12.9.4, “Full-Text Stopwords”.

Para informações de uso e exemplos relacionados, consulte Seção 14.16.4, “Tabelas de Index FULLTEXT do INFORMATION_SCHEMA do InnoDB”.

A tabela `INNODB_FT_DEFAULT_STOPWORD` possui estas colunas:

* `value`

  Uma palavra que é usada por padrão como uma `stopword` para Indexes `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você substituir o processamento padrão de `stopwords` com a variável de sistema `innodb_ft_server_stopword_table` ou `innodb_ft_user_stopword_table`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

#### Notas

* Você deve ter o privilege `PROCESS` para realizar uma Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a busca `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indexes Full-Text do InnoDB” e Seção 12.9, “Funções de Busca Full-Text”.