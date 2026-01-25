## 8.3 Otimização e Indexes

8.3.1 Como o MySQL Usa Indexes

8.3.2 Otimização de Primary Key

8.3.3 Otimização de Foreign Key

8.3.4 Indexes de Coluna

8.3.5 Indexes de Múltiplas Colunas

8.3.6 Verificando o Uso de Index

8.3.7 Coleta de Estatísticas de Index do InnoDB e MyISAM

8.3.8 Comparação de Indexes B-Tree e Hash

8.3.9 Uso de Extensões de Index

8.3.10 Uso de Indexes de Coluna Gerada pelo Optimizer

8.3.11 Buscas Indexadas em Colunas TIMESTAMP

A melhor maneira de melhorar a performance de operações `SELECT` é criar indexes em uma ou mais colunas que são testadas na `query`. As entradas do index agem como ponteiros para as linhas da tabela, permitindo que a `query` determine rapidamente quais linhas correspondem a uma condição na cláusula `WHERE`, e recupere os demais valores das colunas para essas linhas. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar um index para cada coluna possível usada em uma `query`, indexes desnecessários desperdiçam espaço e tempo para o MySQL determinar quais indexes usar. Indexes também aumentam o custo de `inserts`, `updates` e `deletes` porque cada index deve ser atualizado. É necessário encontrar o equilíbrio certo para alcançar `queries` rápidas usando o conjunto ideal de indexes.