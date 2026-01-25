#### 26.4.3.22 As Views processlist e x$processlist

A lista de processos do MySQL indica as operações que estão sendo executadas atualmente pelo conjunto de Threads em execução no servidor. As views `processlist` e `x$processlist` resumem as informações do processo. Elas fornecem informações mais completas do que a instrução `SHOW PROCESSLIST` e a tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, e também são não bloqueantes. Por padrão, as linhas são ordenadas pelo tempo de processo decrescente e pelo tempo de espera (wait time) decrescente. Para uma comparação das fontes de informação de processo, consulte Sources of Process Information.

As descrições das colunas aqui são breves. Para informações adicionais, consulte a descrição da tabela `threads` do Performance Schema na Seção 25.12.16.4, “A Tabela threads”.

As views `processlist` e `x$processlist` possuem as seguintes colunas:

* `thd_id`

  O ID da Thread.

* `conn_id`

  O ID da conexão.

* `user`

  O usuário da Thread ou o nome da Thread.

* `db`

  O Database padrão para a Thread, ou `NULL` se não houver nenhum.

* `command`

  Para Threads de primeiro plano, o tipo de comando que a Thread está executando em nome do cliente, ou `Sleep` se a sessão estiver ociosa.

* `state`

  Uma ação, evento ou estado que indica o que a Thread está fazendo.

* `time`

  O tempo em segundos que a Thread permaneceu em seu estado atual.

* `current_statement`

  O statement que a Thread está executando, ou `NULL` se não estiver executando nenhum statement.

* `statement_latency`

  Há quanto tempo o statement está sendo executado.

* `progress`

  A porcentagem de trabalho concluída para estágios que suportam relatórios de progresso. Consulte a Seção 26.3, “sys Schema Progress Reporting”.

* `lock_latency`

  O tempo gasto esperando por Locks pelo statement atual.

* `rows_examined`

  O número de linhas lidas dos storage engines pelo statement atual.

* `rows_sent`

  O número de linhas retornadas pelo statement atual.

* `rows_affected`

  O número de linhas afetadas pelo statement atual.

* `tmp_tables`

  O número de tabelas temporárias internas na memória (in-memory) criadas pelo statement atual.

* `tmp_disk_tables`

  O número de tabelas temporárias internas em disco (on-disk) criadas pelo statement atual.

* `full_scan`

  O número de varreduras completas de tabela (full table scans) realizadas pelo statement atual.

* `last_statement`

  O último statement executado pela Thread, se não houver nenhum statement ou espera (wait) em execução no momento.

* `last_statement_latency`

  Há quanto tempo o último statement foi executado.

* `current_memory`

  O número de bytes alocados pela Thread.

* `last_wait`

  O nome do evento de espera (wait event) mais recente para a Thread.

* `last_wait_latency`

  O tempo de espera (wait time) do evento de espera mais recente para a Thread.

* `source`

  O arquivo fonte e o número da linha contendo o código instrumentado que produziu o evento.

* `trx_latency`

  O tempo de espera (wait time) da transação atual para a Thread.

* `trx_state`

  O estado da transação atual para a Thread.

* `trx_autocommit`

  Se o modo autocommit estava habilitado quando a transação atual começou.

* `pid`

  O ID do processo do cliente (client process ID).

* `program_name`

  O nome do programa do cliente.