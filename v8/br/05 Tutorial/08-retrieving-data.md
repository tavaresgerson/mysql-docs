### 5.3.4 Recuperação de informações de uma tabela

O comando `SELECT` é usado para extrair informações de uma tabela. A forma geral do comando é:

```
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

`what_to_select` indica o que você deseja ver. Esta pode ser uma lista de colunas, ou `*` para indicar  todas as colunas. `which_table` indica a tabela da qual você deseja recuperar dados. A cláusula `WHERE` é opcional. Se estiver presente, `conditions_to_satisfy` especifica uma ou mais condições que as linhas devem satisfazer para se qualificarem para a recuperação.
