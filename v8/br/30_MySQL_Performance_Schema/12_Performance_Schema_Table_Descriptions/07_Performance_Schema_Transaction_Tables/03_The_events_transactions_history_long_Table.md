#### 29.12.7.3 A tabela eventos\_transacoes\_historico\_longa

A tabela `events_transactions_history_long` contém os eventos de transação `N` mais recentes que terminaram globalmente, em todas as threads. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O Schema de Desempenho autodimensiona o valor de `N`. O tamanho da tabela é autodimensionado ao iniciar o servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_transactions_history_long_size` ao iniciar o servidor.

A tabela `events_transactions_history_long` tem as mesmas colunas que a tabela `events_transactions_current`. Veja a Seção 29.12.7.1, “A tabela events\_transactions\_current”. Ao contrário de `events_transactions_current`, `events_transactions_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de transação devem ser coletados, consulte a Seção 29.12.7, “Tabelas de Transações do Schema de Desempenho”.
