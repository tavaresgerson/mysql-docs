#### 29.12.4.3 A tabela events\_waits\_history\_long

A tabela `events_waits_history_long` contém `N` os eventos de espera mais recentes que terminaram globalmente, em todas as threads. Os eventos de espera não são adicionados à tabela até que terminem. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O Schema de Desempenho autodimensiona o valor de `N` durante o início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_waits_history_long_size` durante o início do servidor.

A tabela `events_waits_history_long` tem as mesmas colunas que a tabela `events_waits_current`. Veja a Seção 29.12.4.1, “A tabela events\_waits\_current”. Ao contrário de `events_waits_current`, `events_waits_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de espera devem ser coletados, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.
