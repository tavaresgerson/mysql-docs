#### 13.4.2.6 Declaração STOP SLAVE

```sql
STOP SLAVE [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Interrompe os threads de replicação. `STOP SLAVE` requer o privilégio `SUPER`. A melhor prática recomendada é executar `STOP SLAVE` na réplica antes de interromper o servidor da réplica (consulte [Seção 5.1.16, “O Processo de Desligamento do Servidor”](server-shutdown.html "5.1.16 The Server Shutdown Process"), para mais informações).

*Quando estiver usando o formato de logging baseado em linha (row-based)*: Você deve executar `STOP SLAVE` ou `STOP SLAVE SQL_THREAD` na réplica antes de desligar o servidor da réplica se estiver replicando quaisquer tabelas que usem um storage engine não transacional (consulte a *Nota* mais adiante nesta seção).

Assim como [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), esta declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o thread ou threads a serem interrompidos. Observe que o canal *applier* do Group Replication (`group_replication_applier`) não possui um I/O thread de replicação, apenas um SQL thread de replicação. O uso da opção `SQL_THREAD`, portanto, interrompe completamente este channel.

`STOP SLAVE` causa um implicit commit de uma transação em andamento. Consulte [Seção 13.3.3, “Declarações que Causam um Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

[`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) deve ser definido como `AUTOMATIC` antes de emitir esta declaração.

Você pode controlar quanto tempo `STOP SLAVE` espera antes de atingir o timeout definindo a variável de sistema [`rpl_stop_slave_timeout`](replication-options-replica.html#sysvar_rpl_stop_slave_timeout). Isso pode ser usado para evitar deadlocks entre `STOP SLAVE` e outras declarações SQL que usam conexões de client diferentes para a réplica. Quando o valor do timeout é atingido, o client emissor retorna uma mensagem de erro e para de esperar, mas a instrução `STOP SLAVE` permanece em vigor. Assim que os threads de replicação não estiverem mais ocupados, a declaração `STOP SLAVE` é executada e a réplica é interrompida.

Algumas declarações `CHANGE MASTER TO` são permitidas enquanto a réplica está em execução, dependendo dos estados do SQL thread de replicação e do I/O thread de replicação. No entanto, o uso de `STOP SLAVE` antes de executar `CHANGE MASTER TO` em tais casos ainda é suportado. Consulte [Seção 13.4.2.1, “Declaração CHANGE MASTER TO”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e [Seção 16.3.7, “Alternando Sources Durante o Failover”](replication-solutions-switch.html "16.3.7 Switching Sources During Failover"), para mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie a qual channel de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `STOP SLAVE` a um channel de replicação específico. Se nenhum channel for nomeado e não existirem channels extras, a declaração se aplica ao channel padrão (default). Se uma declaração `STOP SLAVE` não nomear um channel ao usar múltiplos channels, esta declaração interrompe os threads especificados para todos os channels. Esta declaração não pode ser usada com o channel `group_replication_recovery`. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

*Ao usar replicação baseada em declaração (statement-based replication)*: alterar o source enquanto ele tem tabelas temporárias abertas é potencialmente inseguro. Esta é uma das razões pelas quais a replicação de tabelas temporárias baseada em declaração não é recomendada. Você pode descobrir se há tabelas temporárias na réplica verificando o valor de [`Slave_open_temp_tables`](server-status-variables.html#statvar_Slave_open_temp_tables); ao usar replicação baseada em declaração, este valor deve ser 0 antes de executar `CHANGE MASTER TO`. Se houver tabelas temporárias abertas na réplica, emitir uma declaração `CHANGE MASTER TO` após emitir um `STOP SLAVE` causa um aviso [`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_open_temp_tables_must_be_zero).

Ao usar uma réplica multi-threaded ([`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) for um valor não zero), quaisquer lacunas na sequência de transações executadas a partir do relay log são fechadas como parte da interrupção dos worker threads. Se a réplica for interrompida inesperadamente (por exemplo, devido a um erro em um worker thread, ou outro thread emitindo [`KILL`](kill.html "13.7.6.4 KILL Statement")) enquanto uma declaração [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") estiver em execução, a sequência de transações executadas a partir do relay log pode se tornar inconsistente. Consulte [Seção 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies"), para mais informações.

Se o grupo de eventos de replicação atual tiver modificado uma ou mais tabelas não transacionais, `STOP SLAVE` aguarda até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma declaração [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") ou [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement") para o SQL thread de replicação. Se o grupo de eventos permanecer incompleto após o timeout, uma mensagem de erro é registrada.