### 11.1.7 Valores NULO

O valor `NULL` significa “sem dados”. `NULL` pode ser escrito em qualquer caso de letra.

Tenha em mente que o valor `NULL` é diferente de valores como `0` para tipos numéricos ou a string vazia para tipos de string. Para mais informações, consulte a Seção B.3.4.3, “Problemas com Valores NULO”.

Para operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, `NULL` é representado pela sequência `\N`. Consulte a Seção 15.2.9, “Instrução LOAD DATA”.

Para ordenação com `ORDER BY`, os valores `NULL` são ordenados antes de outros valores para ordenações ascendentes, após outros valores para ordenações descendentes.