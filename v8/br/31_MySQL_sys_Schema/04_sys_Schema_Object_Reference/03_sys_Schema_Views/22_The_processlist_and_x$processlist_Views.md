#### 30.4.3.22 A lista de processos e as visualizações x$processlist

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. As visualizações `processlist` e `x$processlist` resumem as informações sobre os processos. Elas fornecem informações mais completas do que a instrução `SHOW PROCESSLIST` e a tabela `INFORMATION_SCHEMA` `PROCESSLIST`, e também são não-bloqueadas. Por padrão, as linhas são ordenadas por tempo de processo decrescente e tempo de espera decrescente. Para uma comparação das fontes de informações sobre os processos, consulte Fontes de Informações sobre Processos.

As descrições das colunas aqui são breves. Para obter informações adicionais, consulte a descrição da tabela do Schema de Desempenho `threads` na Seção 29.12.21.8, “A Tabela de Threads”.

As visualizações `processlist` e `x$processlist` possuem essas colunas:

- `thd_id`

  O ID do fio.

- `conn_id`

  O ID de conexão.

- `user`

  O usuário do tópico ou o nome do tópico.

- `db`

  O banco de dados padrão para o tópico, ou `NULL` se não houver nenhum.

- `command`

  Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa.

- `state`

  Uma ação, evento ou estado que indica o que o fio está fazendo.

- `time`

  O tempo em segundos que o fio esteve em seu estado atual.

- `current_statement`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração.

- `execution_engine`

  O motor de execução de consultas. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é o `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

- `statement_latency`

  Quanto tempo a declaração está sendo executada.

- `progress`

  A porcentagem de trabalho concluído para as etapas que suportam o relatório de progresso. Veja a Seção 30.3, “Relatório de Progresso do Schema sys”.

- `lock_latency`

  O tempo gasto esperando por trancas pela declaração atual.

- `cpu_latency`

  O tempo gasto na CPU para o thread atual.

- `rows_examined`

  O número de linhas lidas dos motores de armazenamento pela declaração atual.

- `rows_sent`

  O número de linhas devolvidas pela declaração atual.

- `rows_affected`

  O número de linhas afetadas pela declaração atual.

- `tmp_tables`

  O número de tabelas temporárias internas de memória criadas pela declaração atual.

- `tmp_disk_tables`

  O número de tabelas temporárias internas no disco criadas pela declaração atual.

- `full_scan`

  O número de varreduras completas da tabela realizadas pela declaração atual.

- `last_statement`

  A última instrução executada pelo fio, se não houver nenhuma instrução atualmente em execução ou espera.

- `last_statement_latency`

  Quanto tempo a última declaração foi executada.

- `current_memory`

  O número de bytes alocados pelo thread.

- `last_wait`

  O nome do evento de espera mais recente para o fio.

- `last_wait_latency`

  O tempo de espera do evento de espera mais recente para o fio.

- `source`

  O arquivo de origem e o número de linha que contêm o código instrumentado que produziu o evento.

- `trx_latency`

  O tempo de espera da transação atual para o fio.

- `trx_state`

  O estado para a transação atual para o fio.

- `trx_autocommit`

  Se o modo de autocommit foi ativado quando a transação atual começou.

- `pid`

  O ID do processo do cliente.

- `program_name`

  O nome do programa cliente.
