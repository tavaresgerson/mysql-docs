#### 19.5.1.34 Inconsistências na replicação e nas transações

As inconsistências na sequência das transações executadas a partir do log de retransmissão podem ocorrer dependendo da configuração de replicação. Esta seção explica como evitar inconsistências e resolver quaisquer problemas que elas causam.

Os seguintes tipos de inconsistências podem existir:

- *Transações parciais*. Uma transação que atualiza tabelas não transacionais aplicou algumas, mas não todas, de suas alterações.

- *Lacunas*. Uma lacuna no conjunto de transações externalizadas aparece quando, dada uma sequência ordenada de transações, uma transação que está mais tarde na sequência é aplicada antes de outra transação que está mais cedo na sequência. As lacunas só podem aparecer ao usar uma replica multithread.

  Para evitar que lacunas ocorram em uma replica multisserial, defina `replica_preserve_commit_order=ON` (a partir do MySQL 8.0.26) ou `slave_preserve_commit_order=ON` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, este ajuste é o padrão, pois todas as réplicas são multisserials por padrão a partir dessa versão.

  Até e incluindo o MySQL 8.0.18, para preservar a ordem de commit, é necessário que o registro binário (`log_bin`) e o registro de atualização de replica (`log_replica_updates` ou `log_slave_updates`) também estejam habilitados, que são as configurações padrão do MySQL 8.0. A partir do MySQL 8.0.19, o registro binário e o registro de atualização de replica não são necessários na replica para definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON`, e podem ser desativados se desejado.

  Em todas as versões, definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` exige que `replica_parallel_type` (a partir do MySQL 8.0.26) ou `slave_parallel_type` (antes do MySQL 8.0.26) seja definido como `LOGICAL_CLOCK`. A partir do MySQL 8.0.27 (mas não para versões anteriores), este é o ajuste padrão.

  Em algumas situações específicas, conforme listadas na descrição para `replica_preserve_commit_order` e `slave_preserve_commit_order`, definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` não pode preservar a ordem de commit na replica, portanto, nesses casos, lacunas ainda podem aparecer na sequência de transações que foram executadas a partir do log de retransmissão da replica.

  Definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` não impede o atraso na posição do log binário de origem.

- *Atraso na posição do log binário de origem*. Mesmo na ausência de lacunas, é possível que transações após `Exec_master_log_pos` tenham sido aplicadas. Ou seja, todas as transações até o ponto `N` foram aplicadas, e nenhuma transação após `N` foi aplicada, mas `Exec_master_log_pos` tem um valor menor que `N`. Nessa situação, `Exec_master_log_pos` é uma "marca de baixa água" das transações aplicadas e fica atrasada em relação à posição da transação mais recentemente aplicada. Isso só pode acontecer em réplicas multithread. Ativação de `replica_preserve_commit_order` ou `slave_preserve_commit_order` não impede o atraso na posição do log binário de origem.

Os seguintes cenários são relevantes para a existência de transações parciais, lacunas e atraso na posição do log binário de origem:

1. Enquanto os threads de replicação estiverem em execução, podem haver lacunas e transações parciais.

2. O **mysqld** é desligado. Tanto o desligamento limpo quanto o não limpo abortam as transações em andamento e podem deixar lacunas e transações parciais aplicadas.

3. `KILL` de threads de replicação (o thread SQL ao usar uma replicação monofilamentar, o thread coordenador ao usar uma replicação multifilamentar). Isso interrompe as transações em andamento e pode deixar lacunas e transações meio aplicadas.

4. Erro nas threads do aplicador. Isso pode deixar lacunas. Se o erro estiver em uma transação mista, essa transação será aplicada parcialmente. Ao usar uma replica multithreaded, os trabalhadores que não receberam um erro completam suas filas, então pode levar tempo para parar todos os threads.

5. `STOP REPLICA` ao usar uma replica multithreading. Após emitir `STOP REPLICA`, a replica aguarda por quaisquer lacunas serem preenchidas e, em seguida, atualiza `Exec_master_log_pos`. Isso garante que ela nunca deixe lacunas ou atraso na posição do log binário de origem, a menos que algum dos casos acima se aplique, ou seja, antes que `STOP REPLICA` seja concluído, ocorra um erro, ou outro thread emita `KILL`, ou o servidor seja reiniciado. Nesses casos, `STOP REPLICA` retorna com sucesso.

6. Se a última transação no log de retransmissão for apenas parcialmente recebida e a thread do coordenador da replica multithread tiver começado a agendar a transação para um trabalhador, então o `STOP REPLICA` aguarda até 60 segundos para que a transação seja recebida. Após esse tempo limite, o coordenador desiste e aborta a transação. Se a transação for mista, ela pode ser deixada incompleta.

7. `STOP REPLICA` quando a transação em andamento atualiza apenas as tabelas transacionais, nesse caso, ela é revertida e `STOP REPLICA` para de imediatamente. Se a transação em andamento for mista, `STOP REPLICA` aguarda até 60 segundos para que a transação seja concluída. Após esse tempo limite, ela interrompe a transação, então ela pode ficar meio concluída.

O ambiente global da variável de sistema `rpl_stop_replica_timeout` (a partir do MySQL 8.0.26) ou `rpl_stop_slave_timeout` (antes do MySQL 8.0.26) não está relacionado ao processo de parada dos threads de replicação. Isso apenas faz com que o cliente que emite `STOP REPLICA` retorne ao cliente, mas os threads de replicação continuam tentando parar.

Se um canal de replicação tiver lacunas, isso terá as seguintes consequências:

1. O banco de dados de replicação está em um estado que nunca poderia ter existido na fonte.

2. O campo `Exec_master_log_pos` em `SHOW REPLICA STATUS` é apenas um "limite de baixa água". Em outras palavras, as transações que aparecem antes da posição são garantidas como concluídas, mas as transações após a posição podem ter sido concluídas ou

3. As instruções `CHANGE REPLICATION SOURCE TO` e `CHANGE MASTER TO` para esse canal falham com um erro, a menos que os threads do aplicável estejam em execução e a instrução apenas defina as opções do receptor.

4. Se o **mysqld** for iniciado com `--relay-log-recovery`, não será realizada nenhuma recuperação para esse canal e será exibido um aviso.

5. Se o **mysqldump** for usado com `--dump-replica` ou `--dump-slave`, ele não registra a existência de lacunas; assim, ele imprime `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` com `RELAY_LOG_POS` definido na posição “marca de baixa água” em `Exec_master_log_pos`.

   Após aplicar o dump em outro servidor e iniciar os threads de replicação, as transações que aparecem após a posição são replicadas novamente. Observe que isso é inofensivo se os GTIDs estiverem habilitados (no entanto, nesse caso, não é recomendado usar `--dump-replica` ou `--dump-slave`).

Se um canal de replicação tiver atraso na posição do log binário de origem, mas sem lacunas, os casos 2 a 5 acima se aplicam, mas o caso 1

As informações de posição do log binário de origem são mantidas em formato binário na tabela interna `mysql.slave_worker_info`. `START REPLICA [SQL_THREAD]` consulta sempre essas informações para aplicar apenas as transações corretas. Isso permanece verdadeiro mesmo se `replica_parallel_workers` ou `slave_parallel_workers` tiver sido alterado para 0 antes de `START REPLICA`, e mesmo se `START REPLICA` for usado com cláusulas `UNTIL`. `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` aplica apenas tantas transações quanto necessário para preencher as lacunas. Se `START REPLICA` for usado com cláusulas `UNTIL` que dizem para ele parar antes de consumir todas as lacunas, então ele deixa as lacunas restantes.

Aviso

`RESET REPLICA` remove os registros do relé e redefini o posicionamento da replicação. Portanto, emitir `RESET REPLICA` em uma replica multithread com lacunas significa que a replica perde qualquer informação sobre as lacunas, sem corrigir as lacunas. Nesta situação, se a replicação baseada em posição do log binário estiver em uso, o processo de recuperação falhará.

Quando a replicação baseada em GTID está em uso (`GTID_MODE=ON`) e `SOURCE_AUTO_POSITION` está configurado para o canal de replicação usando a instrução `CHANGE REPLICATION SOURCE TO`, os logs do relé antigo não são necessários para o processo de recuperação. Em vez disso, a replica pode usar a autoposição do GTID para calcular quais transações estão faltando em relação à fonte. A partir do MySQL 8.0.26, o processo usado para a replicação baseada em posição de log binário para resolver lacunas em uma replica multithread é ignorado completamente quando a replicação baseada em GTID está em uso. Quando o processo é ignorado, uma instrução `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` se comporta de maneira diferente e não tenta verificar lacunas na sequência de transações. Você também pode emitir instruções `CHANGE REPLICATION SOURCE TO`, que não são permitidas em uma replica que não é baseada em GTID, onde há lacunas.
