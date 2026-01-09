#### 15.7.7.40 Declaração `SHOW TABLES`

```
SHOW [EXTENDED] [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLES` lista as tabelas não `TEMPORARY` em um banco de dados específico. Você também pode obter essa lista usando o comando **mysqlshow *`db_name`***. A cláusula `LIKE`, se presente, indica quais nomes de tabelas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

A correspondência realizada pela cláusula `LIKE` depende da configuração da variável de sistema `lower_case_table_names`.

O modificador opcional `EXTENDED` faz com que `SHOW TABLES` liste tabelas ocultas criadas por declarações `ALTER TABLE` falhas. Essas tabelas temporárias têm nomes que começam com `#sql` e podem ser excluídas usando `DROP TABLE`.

Esta declaração também lista quaisquer visualizações no banco de dados. O modificador opcional `FULL` faz com que `SHOW TABLES` exiba uma segunda coluna de saída com valores de `BASE TABLE` para uma tabela, `VIEW` para uma visualização ou `SYSTEM VIEW` para uma tabela do `INFORMATION_SCHEMA`.

Se você não tiver privilégios para uma tabela ou visualização base, ela não aparecerá na saída de `SHOW TABLES` ou **mysqlshow db_name**.

As informações da tabela também estão disponíveis na tabela `TABLES` do `INFORMATION_SCHEMA`. Veja a Seção 28.3.44, “A Tabela TABLES do INFORMATION_SCHEMA”.