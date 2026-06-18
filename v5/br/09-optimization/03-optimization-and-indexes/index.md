## 8.3 Otimização e índices

A melhor maneira de melhorar o desempenho das operações `SELECT` é criar índices em uma ou mais das colunas testadas na consulta. As entradas do índice atuam como ponteiros para as linhas da tabela, permitindo que a consulta determine rapidamente quais linhas correspondem a uma condição na cláusula `WHERE` e retorne os outros valores da coluna para essas linhas. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar índices para todas as colunas possíveis usadas em uma consulta, índices desnecessários desperdiçam espaço e tempo para o MySQL determinar quais índices usar. Os índices também aumentam o custo de inserções, atualizações e exclusões, pois cada índice deve ser atualizado. Você deve encontrar o equilíbrio certo para obter consultas rápidas usando o conjunto ótimo de índices.
