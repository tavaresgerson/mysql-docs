### 28.4.16 A tabela INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD

A tabela `INNODB_FT_DEFAULT_STOPWORD` contém uma lista de palavras-chave que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`. Para obter informações sobre a lista padrão de palavras-chave `InnoDB` e como definir suas próprias listas de palavras-chave, consulte a Seção 14.9.4, “Palavras-chave de Texto Completo”.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_FT_DEFAULT_STOPWORD` tem essas colunas:

- `value`

  Uma palavra que é usada por padrão como uma palavra-chave de parada para índices `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você substituir o processamento padrão da palavra-chave com a variável de sistema `innodb_ft_server_stopword_table` ou `innodb_ft_user_stopword_table`.

#### Exemplo

```
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

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para obter mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 17.6.2.4, “Indekses de Texto Completo InnoDB”, e a Seção 14.9, “Funções de Busca de Texto Completo”.
