#### 25.12.4.3 A tabela events\_waits\_history\_long

A tabela `events_waits_history_long` contém *`N`* eventos de espera mais recentes que terminaram globalmente, em todas as threads. Os eventos de espera não são adicionados à tabela até que terminem. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_waits_history_long_size` no início do servidor.

A tabela `events_waits_history_long` tem as mesmas colunas que a tabela `events_waits_current`. Veja Seção 25.12.4.1, “A tabela events\_waits\_current”.

A operação `TRUNCATE TABLE` é permitida para a tabela `events_waits_history_long`. Ela remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte Seção 25.9, "Tabelas do Schema de Desempenho para Eventos Atuais e Históricos".

Para obter informações sobre como configurar se os eventos de espera devem ser coletados, consulte Seção 25.12.4, "Tabelas de Eventos de Espera do Schema de Desempenho".
