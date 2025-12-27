### 5.3.4 Recuperando Informações de uma Tabela

5.3.4.1 Selecionando Todos os Dados

5.3.4.2 Selecionando Linhas Específicas

5.3.4.3 Selecionando Colunas Específicas

5.3.4.4 Ordenando Linhas

5.3.4.5 Cálculos de Data

5.3.4.6 Trabalhando com Valores NULL

5.3.4.7 Contagem de Linhas

5.3.4.8 Contagem de Linhas com Padrão

5.3.4.9 Usando Mais de uma Tabela

A instrução `SELECT` é usada para extrair informações de uma tabela. O formato geral da instrução é:

```
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indica o que você deseja ver. Isso pode ser uma lista de colunas, ou `*` para indicar "todas as colunas". *`which_table`* indica a tabela a partir da qual deseja recuperar dados. A cláusula `WHERE` é opcional. Se estiver presente, *`conditions_to_satisfy`* especifica uma ou mais condições que as linhas devem satisfazer para serem qualificadas para a recuperação.