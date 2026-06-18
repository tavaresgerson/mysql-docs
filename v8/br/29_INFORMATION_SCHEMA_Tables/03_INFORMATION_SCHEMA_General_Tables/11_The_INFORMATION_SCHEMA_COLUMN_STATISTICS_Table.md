### 28.3.11 A tabela INFORMATION\_SCHEMA COLUMN\_STATISTICS

A tabela `COLUMN_STATISTICS` fornece acesso às estatísticas do histograma para os valores da coluna.

Para obter informações sobre as estatísticas do histograma, consulte a Seção 10.9.6, “Estatísticas do otimizador”, e a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

Você pode ver informações apenas para as colunas para as quais você tenha algum privilégio.

A tabela `COLUMN_STATISTICS` tem essas colunas:

- `SCHEMA_NAME`

  Os nomes do esquema para os quais as estatísticas se aplicam.

- `TABLE_NAME`

  Os nomes das colunas para as quais as estatísticas se aplicam.

- `COLUMN_NAME`

  Os nomes das colunas para as quais as estatísticas se aplicam.

- `HISTOGRAM`

  Um objeto `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.
