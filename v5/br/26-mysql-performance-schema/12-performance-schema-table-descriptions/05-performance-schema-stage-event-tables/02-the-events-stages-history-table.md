#### 25.12.5.2 A tabela events_stages_history

A tabela `events_stages_history` contém os *`N`* eventos de estágio mais recentes que terminaram por fio. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o início do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_stages_history_size` durante o início do servidor.

A tabela `events_stages_history` tem as mesmas colunas que a tabela `events_stages_current`. Veja Seção 25.12.5.1, “A tabela events_stages_current”.

A operação `TRUNCATE TABLE` é permitida para a tabela `events_stages_history`. Ela remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte Seção 25.9, "Tabelas do Schema de Desempenho para Eventos Atuais e Históricos".

Para obter informações sobre como configurar se os eventos de estágio devem ser coletados, consulte Seção 25.12.5, "Tabelas de Eventos de Estágio do Schema de Desempenho".
