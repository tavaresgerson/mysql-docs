### 3.3.4 Recuperando Informações de uma Tabela

[3.3.4.1 Selecionando Todos os Dados](selecting-all.html)

[3.3.4.2 Selecionando Linhas Específicas](selecting-rows.html)

[3.3.4.3 Selecionando Colunas Específicas](selecting-columns.html)

[3.3.4.4 Ordenando Linhas](sorting-rows.html)

[3.3.4.5 Cálculos de Data](date-calculations.html)

[3.3.4.6 Trabalhando com Valores NULL](working-with-null.html)

[3.3.4.7 Casamento de Padrões (Pattern Matching)](pattern-matching.html)

[3.3.4.8 Contando Linhas](counting-rows.html)

[3.3.4.9 Usando Mais de uma Tabela](multiple-tables.html)

A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") é usada para extrair informações de uma tabela. A forma geral da instrução é:

```sql
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indica o que você deseja visualizar. Isso pode ser uma lista de colunas, ou `*` para indicar “todas as colunas”. *`which_table`* indica a tabela da qual você deseja recuperar dados. A cláusula `WHERE` é opcional. Se estiver presente, *`conditions_to_satisfy`* especifica uma ou mais condições que as linhas devem satisfazer para serem qualificadas para a recuperação.