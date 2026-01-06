#### 25.12.7.3 A tabela events\_transactions\_history\_long

A tabela `events_transactions_history_long` contém os *`N`* eventos de transação mais recentes que terminaram globalmente, em todas as threads. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O esquema de desempenho autodimensiona o valor de *`N`* quando o servidor é inicializado. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_transactions_history_long_size` ao inicializar o servidor.

A tabela `events_transactions_history_long` tem as mesmas colunas que a tabela `events_transactions_current`. Veja Seção 25.12.7.1, “A tabela events\_transactions\_current”.

A operação `TRUNCATE TABLE` é permitida para a tabela `events_transactions_history_long`. Ela remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de transação, consulte Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de transação devem ser coletados, consulte Seção 25.12.7, “Tabelas de Transações do Schema de Desempenho”.
