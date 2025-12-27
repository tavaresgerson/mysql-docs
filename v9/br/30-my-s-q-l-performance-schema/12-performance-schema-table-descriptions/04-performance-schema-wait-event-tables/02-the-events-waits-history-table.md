#### 29.12.4.2 A tabela eventos_waits_history

A tabela `events_waits_history` contém os *N* eventos de espera mais recentes que terminaram por thread. Os eventos de espera não são adicionados à tabela até que terminem. Quando a tabela contém o número máximo de linhas para um determinado thread, a linha mais antiga do thread é descartada quando uma nova linha para esse thread é adicionada. Quando um thread termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o início do servidor. Para definir explicitamente o número de linhas por thread, configure a variável de sistema `performance_schema_events_waits_history_size` durante o início do servidor.

A tabela `events_waits_history` tem as mesmas colunas e indexação que a `events_waits_current`. Consulte a Seção 29.12.4.1, “A tabela eventos_waits_current”.

O `TRUNCATE TABLE` é permitido para a tabela `events_waits_history`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de espera, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.