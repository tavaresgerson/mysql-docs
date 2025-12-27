#### 29.12.5.2 Tabela `events_stages_history`

A tabela `events_stages_history` contém os *N* eventos de estágio mais recentes que terminaram por thread. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado thread, a linha mais antiga do thread é descartada quando uma nova linha para esse thread é adicionada. Quando um thread termina, todas as linhas dele são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o inicialização do servidor. Para definir explicitamente o número de linhas por thread, configure a variável de sistema `performance_schema_events_stages_history_size` durante o inicialização do servidor.

A tabela `events_stages_history` tem as mesmas colunas e indexação que a `events_stages_current`. Consulte a Seção 29.12.5.1, “A tabela `events_stages_current`”.

O `TRUNCATE TABLE` é permitido para a tabela `events_stages_history`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de estágio, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.