#### 29.12.7.3 A tabela `events_transactions_history_long`

A tabela `events_transactions_history_long` contém os *N* eventos de transação mais recentes que terminaram globalmente, em todas as threads. Os eventos de transação não são adicionados à tabela até que terminem. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

O Schema de Desempenho autodimensiona o valor de *N* é autodimensionado no início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_transactions_history_long_size` no início do servidor.

A tabela `events_transactions_history_long` tem as mesmas colunas que `events_transactions_current`. Veja a Seção 29.12.7.1, “A tabela `events_transactions_current`”. Ao contrário de `events_transactions_current`, `events_transactions_history_long` não tem indexação.

O `TRUNCATE TABLE` é permitido para a tabela `events_transactions_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 29.12.7, “Tabelas de transação do Schema de Desempenho”.