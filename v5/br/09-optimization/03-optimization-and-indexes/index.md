## 8.3 Otimização e índices

8.3.1 Como o MySQL usa índices

8.3.2 Otimização da Chave Primária

8.3.3 Otimização da Chave Estrangeira

8.3.4 Índices de Colunas

8.3.5 Índices de múltiplas colunas

8.3.6 Verificação do uso do índice

8.3.7 Coleta de estatísticas de índices InnoDB e MyISAM

8.3.8 Comparação de índices B-Tree e Hash

8.3.9 Uso de extensões do índice

8.3.10 Otimizador Uso de Índices de Colunas Gerados

8.3.11 Busca indexada a partir de colunas TIMESTAMP

A melhor maneira de melhorar o desempenho das operações `SELECT` é criar índices em uma ou mais das colunas testadas na consulta. As entradas do índice atuam como ponteiros para as linhas da tabela, permitindo que a consulta determine rapidamente quais linhas correspondem a uma condição na cláusula `WHERE` e retorne os outros valores da coluna para essas linhas. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar índices para todas as colunas possíveis usadas em uma consulta, índices desnecessários desperdiçam espaço e tempo para o MySQL determinar quais índices usar. Os índices também aumentam o custo de inserções, atualizações e exclusões, pois cada índice deve ser atualizado. Você deve encontrar o equilíbrio certo para obter consultas rápidas usando o conjunto ótimo de índices.
