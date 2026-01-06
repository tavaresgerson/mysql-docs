#### 26.4.3.22 A lista de processos e as visualizações x$processlist

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. As visualizações `processlist` e `x$processlist` resumem as informações dos processos. Elas fornecem informações mais completas do que a instrução `SHOW PROCESSLIST` e a tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, e também são não-bloqueadas. Por padrão, as linhas são ordenadas por tempo de execução do processo em ordem decrescente e tempo de espera em ordem decrescente. Para uma comparação das fontes de informações sobre processos, consulte Fontes de Informações sobre Processos.

As descrições das colunas aqui são breves. Para obter informações adicionais, consulte a descrição da tabela do Schema de Desempenho `threads` na Seção 25.12.16.4, “A tabela threads”.

As views `processlist` e `x$processlist` têm essas colunas:

- `thd_id`

  O ID do fio.

- `conn_id`

  O ID de conexão.

- `usuário`

  O usuário do tópico ou o nome do tópico.

- `db`

  O banco de dados padrão para o tópico, ou `NULL` se não houver nenhum.

- `comando`

  Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa.

- "estado"

  Uma ação, evento ou estado que indica o que o fio está fazendo.

- `tempo`

  O tempo em segundos que o fio esteve em seu estado atual.

- `declaração_atual`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração.

- `statement_latency`

  Quanto tempo a declaração está sendo executada.

- "progresso"

  A porcentagem de trabalho concluído para as etapas que suportam o relatório de progresso. Veja a Seção 26.3, “Relatório de Progresso do Schema sys”.

- `lock_latency`

  O tempo gasto esperando por trancas pela declaração atual.

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

- `última_declaração`

  A última instrução executada pelo fio, se não houver nenhuma instrução atualmente em execução ou espera.

- `last_statement_latency`

  Quanto tempo a última declaração foi executada.

- `memória_atual`

  O número de bytes alocados pelo thread.

- `last_wait`

  O nome do evento de espera mais recente para o fio.

- `last_wait_latency`

  O tempo de espera do evento de espera mais recente para o fio.

- `fonte`

  O arquivo de origem e o número de linha que contêm o código instrumentado que produziu o evento.

- `trx_latency`

  O tempo de espera da transação atual para o fio.

- `trx_state`

  O estado para a transação atual para o fio.

- `trx_autocommit`

  Se o modo de autocommit foi ativado quando a transação atual começou.

- `pid`

  O ID do processo do cliente.

- `nome_do_programa`

  O nome do programa cliente.
