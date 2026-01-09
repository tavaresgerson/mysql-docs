### 28.3.11 A Tabela `INFORMATION_SCHEMA_COLUMN_STATISTICS`

A tabela `COLUMN_STATISTICS` fornece acesso às estatísticas de histograma para os valores das colunas.

Para obter informações sobre as estatísticas de histograma, consulte a Seção 10.9.6, “Estatísticas do Otimizador”, e a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

Você pode ver informações apenas para as colunas para as quais você tenha algum privilégio.

A tabela `COLUMN_STATISTICS` tem as seguintes colunas:

* `SCHEMA_NAME`

  Os nomes do esquema para o qual as estatísticas se aplicam.

* `TABLE_NAME`

  Os nomes da coluna para a qual as estatísticas se aplicam.

* `COLUMN_NAME`

  Os nomes da coluna para a qual as estatísticas se aplicam.

* `HISTOGRAM`

  Um objeto `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.