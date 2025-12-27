#### 29.12.6.3 Tabela `events_statements_history_long`

A tabela `events_statements_history_long` contém os *`N`* eventos de declarações mais recentes que terminaram globalmente em todas as threads. Os eventos de declarações não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado a linha.

O valor de *`N`* é dimensionado automaticamente no início do servidor. Para definir explicitamente o tamanho da tabela, configure a variável de sistema `performance_schema_events_statements_history_long_size` no início do servidor.

A tabela `events_statements_history_long` tem as mesmas colunas que a `events_statements_current`. Consulte a Seção 29.12.6.1, “A tabela `events_statements_current`”. Ao contrário da `events_statements_current`, a `events_statements_history_long` não tem indexação.

O comando `TRUNCATE TABLE` é permitido para a tabela `events_statements_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declarações, consulte a Seção 29.12.6, “Tabelas de Eventos de Declarações do Schema de Desempenho”.