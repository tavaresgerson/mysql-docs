#### 29.12.6.3 A tabela events\_statements\_history\_long

A tabela `events_statements_history_long` contém os eventos de declaração mais recentes do `N` que terminaram globalmente, em todas as threads. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O valor de `N` é dimensionado automaticamente ao iniciar o servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_statements_history_long_size` ao iniciar o servidor.

A tabela `events_statements_history_long` tem as mesmas colunas que a tabela `events_statements_current`. Veja a Seção 29.12.6.1, “A tabela events\_statements\_current”. Ao contrário de `events_statements_current`, `events_statements_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de declaração devem ser coletados, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.
