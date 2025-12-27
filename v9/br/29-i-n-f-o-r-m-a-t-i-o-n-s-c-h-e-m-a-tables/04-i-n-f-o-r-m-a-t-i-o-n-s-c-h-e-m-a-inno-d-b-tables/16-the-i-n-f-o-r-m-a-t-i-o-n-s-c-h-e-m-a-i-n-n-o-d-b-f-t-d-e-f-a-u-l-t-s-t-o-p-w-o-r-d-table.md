### 28.4.16 A Tabela `INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD`

A tabela `INNODB_FT_DEFAULT_STOPWORD` contém uma lista de palavras que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`. Para obter informações sobre a lista de palavras de parada padrão do `InnoDB` e como definir suas próprias listas de palavras de parada, consulte a Seção 14.9.4, “Palavras de parada do Full-Text”.

Para informações sobre o uso relacionado e exemplos, consulte a Seção 17.15.4, “Tabelas de índices Full-Text do INFORMATION_SCHEMA InnoDB”.

A tabela `INNODB_FT_DEFAULT_STOPWORD` tem as seguintes colunas:

* `value`

  Uma palavra que é usada por padrão como palavra de parada para índices `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você sobrescrever o processamento padrão da palavra de parada com a variável de sistema `innodb_ft_server_stopword_table` ou `innodb_ft_user_stopword_table`.

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

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa `FULL-TEXT` do `InnoDB`, consulte a Seção 17.6.2.4, “Índices Full-Text do InnoDB”, e a Seção 14.9, “Funções de pesquisa Full-Text”.