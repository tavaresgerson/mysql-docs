#### 29.12.5.3 Tabela `events_stages_history_long`

A tabela `events_stages_history_long` contém os *N* eventos de estágio mais recentes que terminaram globalmente, em todas as threads. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread tenha gerado a linha.

O Schema de Desempenho autodimensiona o valor de *N* durante o inicialização do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_stages_history_long_size` durante o inicialização do servidor.

A tabela `events_stages_history_long` tem as mesmas colunas que `events_stages_current`. Veja a Seção 29.12.5.1, “A tabela `events_stages_current`”. Ao contrário de `events_stages_current`, `events_stages_history_long` não tem indexação.

O comando `TRUNCATE TABLE` é permitido para a tabela `events_stages_history_long`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de estágio, veja a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, veja a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.