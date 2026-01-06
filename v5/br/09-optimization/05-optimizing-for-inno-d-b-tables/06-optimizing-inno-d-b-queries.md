### 8.5.6 Otimizando consultas InnoDB

Para ajustar as consultas para tabelas `InnoDB`, crie um conjunto apropriado de índices em cada tabela. Consulte a Seção 8.3.1, “Como o MySQL usa índices”, para obter detalhes. Siga estas diretrizes para índices `InnoDB`:

- Como cada tabela `InnoDB` tem uma chave primária (se você solicitar uma ou não), especifique um conjunto de colunas da chave primária para cada tabela, colunas que são usadas nas consultas mais importantes e críticas.

- Não especifique colunas muito longas ou muito numerosas na chave primária, pois esses valores de coluna são duplicados em cada índice secundário. Quando um índice contém dados desnecessários, o I/O para ler esses dados e a memória para cache-los reduzem o desempenho e a escalabilidade do servidor.

- Não crie um índice secundário separado para cada coluna, porque cada consulta pode usar apenas um índice. Índices em colunas raramente testadas ou com poucos valores diferentes podem não ser úteis para nenhuma consulta. Se você tiver muitas consultas para a mesma tabela, teste diferentes combinações de colunas, tente criar um pequeno número de índices concatenados em vez de um grande número de índices de uma única coluna. Se um índice contiver todas as colunas necessárias para o conjunto de resultados (conhecido como índice coberto), a consulta pode ser capaz de evitar ler os dados da tabela.

- Se uma coluna indexada não puder conter valores `NULL`, declare-a como `NOT NULL` ao criar a tabela. O otimizador pode determinar melhor qual índice é mais eficaz para usar em uma consulta, quando sabe se cada coluna contém valores `NULL`.

- Você pode otimizar transações de consulta única para tabelas do `InnoDB`, usando a técnica descrita na Seção 8.5.3, “Otimizando transações de leitura somente do InnoDB”.
