#### 29.12.5.2 A tabela events\_stages\_history

A tabela `events_stages_history` contém os eventos de estágio mais recentes do `N` que terminaram por fio. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de `N` durante o início do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_stages_history_size` durante o início do servidor.

A tabela `events_stages_history` tem as mesmas colunas e indexação que a tabela `events_stages_current`. Veja a Seção 29.12.5.1, “A tabela events\_stages\_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history`. Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.
