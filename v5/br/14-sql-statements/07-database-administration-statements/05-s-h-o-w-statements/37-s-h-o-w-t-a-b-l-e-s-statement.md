#### 13.7.5.37 Instrução SHOW TABLES

```sql
SHOW [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

A instrução `SHOW TABLES` lista as tabelas não-`TEMPORARY` em um determinado Database. Você também pode obter esta lista usando o comando **mysqlshow *`db_name`***. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões às Instruções SHOW”.

A correspondência realizada pela cláusula `LIKE` depende da configuração da variável de sistema `lower_case_table_names`.

Esta instrução também lista quaisquer Views no Database. O modificador opcional `FULL` faz com que `SHOW TABLES` exiba uma segunda coluna de saída com valores de `BASE TABLE` para uma tabela, `VIEW` para uma View ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

Se você não tiver privilégios para uma tabela base ou View, ela não aparecerá na saída de `SHOW TABLES` ou **mysqlshow db_name**.

Informações da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Consulte a Seção 24.3.25, “A Tabela INFORMATION_SCHEMA TABLES”.