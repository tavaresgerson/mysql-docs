#### 30.4.3.22 As visualizações processlist e x$processlist

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão executando no servidor. As visualizações `processlist` e `x$processlist` resumem as informações dos processos. Elas fornecem informações mais completas do que a instrução `SHOW PROCESSLIST` e a tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, e também são não-bloqueadas. Por padrão, as linhas são ordenadas por tempo de execução descendente e tempo de espera descendente. Para uma comparação das fontes de informações sobre processos, consulte Fontes de Informações sobre Processos.

As descrições das colunas aqui são breves. Para informações adicionais, consulte a descrição da tabela `threads` do Schema de Desempenho na Seção 29.12.22.10, “A tabela threads”.

As visualizações `processlist` e `x$processlist` têm essas colunas:

* `thd_id`

  O ID do thread.

* `conn_id`

  O ID de conexão.

* `user`

  O usuário do thread ou o nome do thread.

* `db`

  O banco de dados padrão para o thread, ou `NULL` se não houver nenhum.

* `command`

  Para threads em primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa.

* `state`

  Uma ação, evento ou estado que indica o que o thread está fazendo.

* `time`

  O tempo em segundos que o thread está em seu estado atual.

* `current_statement`

  A instrução que o thread está executando, ou `NULL` se não estiver executando nenhuma instrução.

* `execution_engine`

O motor de execução de consultas. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`.

* `statement_latency`

  Quanto tempo a consulta está sendo executada.

* `progress`

  A porcentagem de trabalho concluído para etapas que suportam relatórios de progresso. Veja a Seção 30.3, “Relatório de Progresso do Schema sys”.

* `lock_latency`

  O tempo gasto esperando por bloqueios pelo estado atual da consulta.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_examined`

  O número de linhas lidas dos motores de armazenamento pela consulta atual.

* `rows_sent`

  O número de linhas devolvidas pela consulta atual.

* `rows_affected`

  O número de linhas afetadas pela consulta atual.

* `tmp_tables`

  O número de tabelas temporárias internas em memória criadas pela consulta atual.

* `tmp_disk_tables`

  O número de tabelas temporárias internas em disco criadas pela consulta atual.

* `full_scan`

  O número de varreduras completas de tabelas realizadas pela consulta atual.

* `last_statement`

  A última consulta executada pelo thread, se não houver consulta atualmente em execução ou espera.

* `last_statement_latency`

  Quanto tempo a última consulta executada.

* `current_memory`

  O número de bytes alocados pelo thread.

* `last_wait`

  O nome do evento de espera mais recente para o thread.

* `last_wait_latency`

  O tempo de espera do evento de espera mais recente para o thread.

* `source`

O arquivo de origem e o número de linha que contêm o código instrumentado que produziu o evento.

* `trx_latency`

  O tempo de espera da transação atual para o thread.

* `trx_state`

  O estado da transação atual para o thread.

* `trx_autocommit`

  Se o modo de autocommit foi habilitado quando a transação atual começou.

* `pid`

  O ID do processo do cliente.

* `program_name`

  O nome do programa do cliente.