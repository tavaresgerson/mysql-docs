#### 25.12.5.2 A Tabela events_stages_history

A tabela `events_stages_history` contém os *`N`* stage events mais recentes que terminaram por Thread. Stage events não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um Thread específico, a linha mais antiga desse Thread é descartada quando uma nova linha é adicionada para ele. Quando um Thread termina, todas as suas linhas são descartadas.

O Performance Schema ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do server. Para definir explicitamente o número de linhas por Thread, configure a variável de sistema `performance_schema_events_stages_history_size` na inicialização do server.

A tabela `events_stages_history` possui as mesmas colunas que `events_stages_current`. Veja Seção 25.12.5.1, “A Tabela events_stages_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history`. Ele remove as linhas.

Para mais informações sobre o relacionamento entre as três tabelas de stage event, veja Seção 25.9, “Tabelas do Performance Schema para Current e Historical Events”.

Para informações sobre como configurar a coleta de stage events, veja Seção 25.12.5, “Tabelas de Stage Event do Performance Schema”.