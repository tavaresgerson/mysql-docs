### 9.1.7 Valores nulos

O valor `NULL` significa “sem dados”. `NULL` pode ser escrito em qualquer caso de letra. Um sinônimo é `\N` (sensível a maiúsculas e minúsculas). O tratamento de `\N` como sinônimo de `NULL` em instruções SQL é desaconselhável a partir do MySQL 5.7.18 e é removido no MySQL 8.0; use `NULL` em vez disso.

Tenha em mente que o valor `NULL` é diferente de valores como `0` para tipos numéricos ou a string vazia para tipos de string. Para mais informações, consulte a Seção B.3.4.3, “Problemas com valores NULL”.

Para operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, `NULL` é representado pela sequência `\N`. Veja a Seção 13.2.6, “Instrução LOAD DATA”. O uso de `\N` em arquivos de texto não é afetado pela depreciação de `\N` em instruções SQL.

Para a classificação com `ORDER BY`, os valores `NULL` são classificados antes de outros valores em classificações ascendentes e depois de outros valores em classificações descendentes.
