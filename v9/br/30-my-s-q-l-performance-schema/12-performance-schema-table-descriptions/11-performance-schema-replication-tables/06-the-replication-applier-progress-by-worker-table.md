#### 29.12.11.6 Tabela `replication_applier_progress_by_worker`

Esta tabela fornece informações sobre a transação atualmente sendo aplicada por um determinado trabalhador. Se não houver tal transação, esta tabela estará vazia.

Nota

Esta tabela requer a instalação do componente `replication_applier_metrics`, que está disponível apenas com a Edição Empresarial do MySQL. Consulte a Seção 7.5.6.1, “Componente de Metas de Aplicativo de Replicação”, para obter mais informações.

A tabela `replication_applier_progress_by_worker` tem as seguintes colunas:

* `CHANNEL_NAME`

  O nome do canal de replicação.

* `WORKER_ID`

  O ID do trabalhador.

* `THREAD_ID`

  O ID do thread do trabalhador do thread do aplicável; este é o mesmo ID do thread do trabalhador exibido pela coluna `THREAD_ID` da tabela `replication_applier_status_by_worker`

* `ONGOING_TRANSACTION_TYPE`

  O tipo de transação sendo executada; um dos valores `UNASSIGNED`, `DML` ou `DDL`. O tipo de uma transação dada só é conhecido após o evento GTID associado ter sido processado. Até então, seu tipo é exibido como `UNASSIGNED`.

  Esta informação está disponível apenas para trabalhadores que executam transações.

* `ONGOING_TRANSACTION_FULL_SIZE_BYTES`

  O tamanho total (em bytes) da transação atualmente sendo executada por este trabalhador. Este valor é definido ao processar o evento GTID da transação ou (para transações compactadas) o evento de payload da transação, e é zerado quando a transação é concluída.

  Esta informação está disponível apenas para trabalhadores que executam transações.

* `ONGOING_TRANSACTION_APPLIED_SIZE_BYTES`

  O tamanho (em bytes) das partes da transação em andamento do trabalhador que já foram executadas. Este valor aumenta a cada evento executado (desde que o evento forneça um tamanho de dados), e é zerado quando a transação é concluída.

Essa informação está disponível apenas para os trabalhadores que executam transações.