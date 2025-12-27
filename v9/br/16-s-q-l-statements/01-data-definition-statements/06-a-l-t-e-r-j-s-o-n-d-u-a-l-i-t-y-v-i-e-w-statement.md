### 15.1.6 Declaração de visualização de dualidade JSON

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    JSON DUALITY VIEW view_name
    AS json_duality_select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTON]

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name .] root_table_name [AS table_alias_name]
```

Esta declaração atualiza uma visualização de dualidade JSON.

*`json_duality_select_statement`* segue as mesmas regras que para `CREATE JSON DUALITY VIEW`. *`json_duality_object_expression`* é um valor retornado por `JSON_DUALITY_OBJECT()`. Consulte a descrição dessa função para obter informações sobre seus argumentos.

Para mais informações, consulte a Seção 27.7, “Visualizações de dualidade JSON”.