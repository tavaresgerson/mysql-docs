#### 13.7.5.37 Declaração SHOW TABLES

```sql
SHOW [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLES` lista as tabelas não `TEMPORARY` em um banco de dados específico. Você também pode obter essa lista usando o comando **mysqlshow *`db_name`***. A cláusula `LIKE` (funções de comparação de strings # operador\_like), se presente, indica quais nomes de tabelas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

A correspondência realizada pela cláusula `LIKE` depende da configuração da variável de sistema `lower_case_table_names`.

Esta declaração também lista quaisquer visões no banco de dados. O modificador opcional `FULL` faz com que `SHOW TABLES` exiba uma segunda coluna de saída com os valores de `BASE TABLE` para uma tabela, `VIEW` para uma visão ou `SYSTEM VIEW` para uma tabela do `INFORMATION_SCHEMA`.

Se você não tiver privilégios para uma tabela ou visualização base, ela não aparecerá na saída do `SHOW TABLES` ou em **mysqlshow db\_name**.

As informações sobre as tabelas também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Veja Seção 24.3.25, “A Tabela INFORMATION\_SCHEMA TABLES”.
