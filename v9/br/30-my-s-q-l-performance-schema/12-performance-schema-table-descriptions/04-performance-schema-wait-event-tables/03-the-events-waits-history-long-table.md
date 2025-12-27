#### 29.12.4.3 Tabela `events_waits_history_long`

A tabela `events_waits_history_long` contém *`N`* eventos de espera mais recentes que terminaram globalmente, em todas as threads. Os eventos de espera não são adicionados à tabela até que terminem. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o inicialização do servidor. Para definir explicitamente o tamanho da tabela, configure a variável de sistema `performance_schema_events_waits_history_long_size` durante o inicialização do servidor.

A tabela `events_waits_history_long` tem as mesmas colunas que a `events_waits_current`. Consulte a Seção 29.12.4.1, “A tabela `events_waits_current`”. Ao contrário de `events_waits_current`, `events_waits_history_long` não tem indexação.

O comando `TRUNCATE TABLE` é permitido para a tabela `events_waits_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de espera, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.