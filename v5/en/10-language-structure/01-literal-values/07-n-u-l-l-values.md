### 9.1.7 Valores NULL

O valor `NULL` significa “nenhum dado”. `NULL` pode ser escrito em qualquer caixa. Um sinônimo é `\N` (sensível a maiúsculas/minúsculas). O tratamento de `\N` como sinônimo para `NULL` em instruções SQL está obsoleto (deprecated) a partir do MySQL 5.7.18 e foi removido no MySQL 8.0; use `NULL` em seu lugar.

Esteja ciente de que o valor `NULL` é diferente de valores como `0` para tipos numéricos ou a string vazia para tipos de string. Para mais informações, consulte a Seção B.3.4.3, “Problemas com Valores NULL”.

Para operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, `NULL` é representado pela sequência `\N`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”. O uso de `\N` em arquivos de texto não é afetado pela obsolescência (deprecation) de `\N` em instruções SQL.

Para ordenação com `ORDER BY`, valores `NULL` são classificados antes de outros valores em ordenações ascendentes, e depois de outros valores em ordenações descendentes.