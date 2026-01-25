### 15.4.2 Limitações do CSV

O storage engine `CSV` não suporta Indexing.

O particionamento não é suportado para tabelas que utilizam o storage engine `CSV`.

Todas as tabelas que você cria usando o storage engine `CSV` devem ter o atributo `NOT NULL` em todas as colunas.