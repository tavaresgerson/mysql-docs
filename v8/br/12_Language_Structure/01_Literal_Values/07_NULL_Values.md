### 11.1.7 Valores nulos

O valor `NULL` significa “sem dados”. `NULL` pode ser escrito em qualquer caso de letra.

Tenha em mente que o valor `NULL` é diferente dos valores como `0` para tipos numéricos ou a string vazia para tipos de string. Para mais informações, consulte a Seção B.3.4.3, “Problemas com valores NULL”.

Para operações de importação ou exportação de arquivos de texto realizadas com `LOAD DATA` ou `SELECT ... INTO OUTFILE`, `NULL` é representado pela sequência `\N`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

Para a classificação com os valores `ORDER BY` e `NULL`, os valores são classificados antes de outros valores para ordenações ascendentes e depois de outros valores para ordenações descendentes.
