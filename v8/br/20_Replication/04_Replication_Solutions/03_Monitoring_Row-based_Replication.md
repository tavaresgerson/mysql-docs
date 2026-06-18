### 19.4.3 Monitoramento da Replicação Baseada em Linhas

O progresso atual do aplicativo de replicação (SQL) quando se usa a replicação baseada em linhas é monitorado por meio das etapas do instrumento do Schema de Desempenho, permitindo que você acompanhe o processamento das operações e verifique a quantidade de trabalho concluído e o trabalho estimado. Quando essas etapas do instrumento do Schema de Desempenho são habilitadas, a tabela `events_stages_current` mostra as etapas dos threads do aplicativo e seu progresso. Para informações de fundo, consulte a Seção 29.12.5, “Tabelas de Eventos de Etapa do Schema de Desempenho”.

Para acompanhar o progresso de todos os três tipos de eventos de replicação baseados em linhas (escrita, atualização e exclusão):

- Ative as três etapas do Schema de Desempenho emitindo:

  ```
  mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
      -> WHERE NAME LIKE 'stage/sql/Applying batch of row changes%';
  ```

- Aguarde que alguns eventos sejam processados pelo fio do aplicador de replicação e, em seguida, verifique o progresso consultando a tabela `events_stages_current`. Por exemplo, para obter o progresso dos eventos `update`:

  ```
  mysql> SELECT WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
      -> WHERE EVENT_NAME LIKE 'stage/sql/Applying batch of row changes (update)'
  ```

- Se `binlog_rows_query_log_events` estiver ativado, as informações sobre as consultas são armazenadas no log binário e são exibidas no campo `processlist_info`. Para ver a consulta original que desencadeou este evento:

  ```
  mysql> SELECT db, processlist_state, processlist_info FROM performance_schema.threads
      -> WHERE processlist_state LIKE 'stage/sql/Applying batch of row changes%' AND thread_id = N;
  ```
