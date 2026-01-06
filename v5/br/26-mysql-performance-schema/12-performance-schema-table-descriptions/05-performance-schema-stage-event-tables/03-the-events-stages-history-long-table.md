#### 25.12.5.3 A tabela events\_stages\_history\_long

A tabela `events_stages_history_long` contém os *`N`* eventos de estágio mais recentes que terminaram globalmente, em todas as threads. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado aquela linha.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_stages_history_long_size` durante o início do servidor.

A tabela `events_stages_history_long` tem as mesmas colunas que a tabela `events_stages_current`. Veja Seção 25.12.5.1, “A tabela events\_stages\_current”.

A operação `TRUNCATE TABLE` é permitida para a tabela `events_stages_history_long`. Ela remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte Seção 25.9, "Tabelas do Schema de Desempenho para Eventos Atuais e Históricos".

Para obter informações sobre como configurar se os eventos de estágio devem ser coletados, consulte Seção 25.12.5, "Tabelas de Eventos de Estágio do Schema de Desempenho".
