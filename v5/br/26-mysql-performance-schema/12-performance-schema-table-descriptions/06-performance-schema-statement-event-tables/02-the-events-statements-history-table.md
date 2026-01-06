#### 25.12.6.2 A tabela events\_statements\_history

A tabela `events_statements_history` contém os *`N`* eventos de declaração mais recentes que terminaram por fio. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o início do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_statements_history_size` durante o início do servidor.

A tabela `events_statements_history` tem as mesmas colunas que a tabela `events_statements_current`. Veja Seção 25.12.6.1, “A tabela events\_statements\_current”.

A operação `TRUNCATE TABLE` é permitida para a tabela `events_statements_history`. Ela remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de declaração devem ser coletados, consulte Seção 25.12.6, "Tabelas de Eventos de Declaração do Schema de Desempenho".
