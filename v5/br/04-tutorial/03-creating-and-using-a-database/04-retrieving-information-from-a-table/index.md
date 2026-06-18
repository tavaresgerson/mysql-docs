### 3.3.4 Recuperação de informações de uma tabela

A instrução `SELECT` é usada para extrair informações de uma tabela. O formato geral da instrução é:

```sql
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indica o que você deseja ver. Isso pode ser uma lista de colunas ou `*` para indicar “todas as colunas”. *`which_table`* indica a tabela a partir da qual você deseja recuperar dados. A cláusula `WHERE` é opcional. Se estiver presente, *`conditions_to_satisfy`* especifica uma ou mais condições que as linhas devem satisfazer para serem qualificadas para a recuperação.
