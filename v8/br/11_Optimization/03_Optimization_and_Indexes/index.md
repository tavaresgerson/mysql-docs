## 10.3 Otimização e índices

10.3.1 Como o MySQL usa índices

10.3.2 Otimização da Chave Primária

10.3.3 Otimização do Índice Espacial

10.3.4 Otimização da Chave Estrangeira

10.3.5 Índices de Colunas

10.3.6 Índices de múltiplas colunas

10.3.7 Verificação do uso do índice

10.3.8 Coleta de estatísticas de índices InnoDB e MyISAM

10.3.9 Comparação de índices B-Tree e Hash

10.3.10 Uso de extensões do índice

10.3.11 Otimizador Uso de Índices de Colunas Gerados

10.3.12 Índices Invisíveis

10.3.13 Índices de descida

10.3.14 Busca indexada a partir de colunas TIMESTAMP

A melhor maneira de melhorar o desempenho das operações do `SELECT` é criar índices em uma ou mais das colunas que são testadas na consulta. As entradas do índice atuam como ponteiros para as linhas da tabela, permitindo que a consulta determine rapidamente quais linhas correspondem a uma condição na cláusula `WHERE` e retorne os outros valores da coluna para essas linhas. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar índices para todas as colunas possíveis usadas em uma consulta, índices desnecessários desperdiçam espaço e tempo para o MySQL determinar quais índices usar. Os índices também aumentam o custo de inserções, atualizações e exclusões, pois cada índice deve ser atualizado. Você deve encontrar o equilíbrio certo para obter consultas rápidas usando o conjunto ótimo de índices.
