### 24.4.10 A tabela INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD

A tabela [`INNODB_FT_DEFAULT_STOPWORD`](https://pt.wikipedia.org/wiki/Tabela_INNODB_FT_DEFAULT_STOPWORD) contém uma lista de [stopwords](https://pt.wikipedia.org/wiki/Glos%C3%A7rio#stopword) que são usados por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`. Para obter informações sobre a lista de stopwords padrão do `InnoDB` e como definir suas próprias listas de stopwords, consulte [Seção 12.9.4, “Stopwords de Texto Completo”](https://pt.wikipedia.org/wiki/Stopwords_de_Texto_Completo).

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.

A tabela [`INNODB_FT_DEFAULT_STOPWORD`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-ft-default-stopword) tem essas colunas:

- `valor`

  Uma palavra que é usada por padrão como uma palavra-chave de parada para índices `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você substituir o processamento padrão da palavra-chave de parada com a variável de sistema `innodb_ft_server_stopword_table` ou a variável de sistema `innodb_ft_user_stopword_table`.

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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa `FULLTEXT` do `InnoDB`, consulte Seção 14.6.2.4, “Indeksos de Texto Completo do InnoDB” e Seção 12.9, “Funções de Pesquisa de Texto Completo”.
