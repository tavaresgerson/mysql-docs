## 10.3 Otimização e Índices

10.3.1 Como o MySQL Usa Índices

10.3.2 Otimização da Chave Primária

10.3.3 Otimização de Índices Espaciais

10.3.4 Otimização de Chaves Estrangeiras

10.3.5 Índices de Colunas

10.3.6 Índices de Múltiplas Colunas

10.3.7 Verificação do Uso de Índices

10.3.8 Coleta de Estatísticas de Índices InnoDB e MyISAM

10.3.9 Comparação de Índices B-Tree e Hash

10.3.10 Uso de Extensões de Índices

10.3.11 Uso do Otimizador de Índices de Colunas Geradas

10.3.12 Índices Invisíveis

10.3.13 Índices Decrescente

10.3.14 Busca Indexada por Colunas TIMESTAMP

A melhor maneira de melhorar o desempenho das operações `SELECT` é criar índices em uma ou mais das colunas testadas na consulta. As entradas dos índices atuam como ponteiros para as linhas da tabela, permitindo que a consulta determine rapidamente quais linhas correspondem a uma condição na cláusula `WHERE` e retorne os outros valores das colunas para essas linhas. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar índices para todas as colunas possíveis usadas em uma consulta, índices desnecessários desperdiçam espaço e tempo para o MySQL determinar quais índices usar. Os índices também aumentam o custo de inserções, atualizações e exclusões, pois cada índice deve ser atualizado. Você deve encontrar o equilíbrio certo para obter consultas rápidas usando o conjunto ótimo de índices.