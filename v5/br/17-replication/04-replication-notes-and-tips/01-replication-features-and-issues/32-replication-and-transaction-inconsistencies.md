#### 16.4.1.32 Inconsistências na Replicação e Transações

As inconsistências na sequência das transações executadas a partir do log de retransmissão podem ocorrer dependendo da configuração de replicação. Esta seção explica como evitar inconsistências e resolver quaisquer problemas que elas causam.

Os seguintes tipos de inconsistências podem existir:

- *Transações parciais*. Uma transação que atualiza tabelas não transacionais aplicou algumas, mas não todas, de suas alterações.

- *Lacunas*. Uma lacuna é uma transação que não foi aplicada completamente, mesmo que uma transação posterior na sequência tenha sido aplicada. As lacunas só podem aparecer ao usar uma replica multithread. Para evitar que ocorram lacunas, configure `slave_preserve_commit_order=1`, o que requer `slave_parallel_type=CLOCK_LOGICAL`, e que `log-bin` e `log-slave-updates` também estejam habilitados. Observe que `slave_preserve_commit_order=1` não preserva a ordem de atualizações DML não transacionais, portanto, essas podem ser aplicadas antes das transações que as precedem no log de retransmissão, o que pode resultar em lacunas.

- *Atraso na posição do log binário de origem*. Mesmo na ausência de lacunas, é possível que transações após `Exec_master_log_pos` tenham sido aplicadas. Ou seja, todas as transações até o ponto `N` foram aplicadas, e nenhuma transação após `N` foi aplicada, mas `Exec_master_log_pos` tem um valor menor que `N`. Nessa situação, `Exec_master_log_pos` é uma "marca de baixa água" das transações aplicadas e fica atrasada em relação à posição da transação mais recentemente aplicada. Isso só pode acontecer em réplicas multithread. Ativação de `slave_preserve_commit_order` não impede o atraso na posição do log binário de origem.

Os seguintes cenários são relevantes para a existência de transações parciais, lacunas e atraso na posição do log binário de origem:

1. Enquanto os threads de replicação estiverem em execução, podem haver lacunas e transações parciais.

2. O **mysqld** é desligado. Tanto o desligamento limpo quanto o não limpo abortam as transações em andamento e podem deixar lacunas e transações meio aplicadas.

3. `KILL` (cancelar) os threads de replicação (o thread SQL ao usar uma replicação de único fio, o thread coordenador ao usar uma replicação de múltiplos fios). Isso interrompe as transações em andamento e pode deixar lacunas e transações meio aplicadas.

4. Erro nas threads do aplicador. Isso pode deixar lacunas. Se o erro estiver em uma transação mista, essa transação será aplicada parcialmente. Ao usar uma replica multithreaded, os trabalhadores que não receberam um erro completam suas filas, então pode levar tempo para parar todos os threads.

5. `PARE SLAVE` ao usar uma replica multithreading. Após emitir `PARE SLAVE`, a replica aguarda por quaisquer lacunas serem preenchidas e, em seguida, atualiza `Exec_master_log_pos`. Isso garante que ela nunca deixe lacunas ou atraso na posição do log binário de origem, a menos que algum dos casos acima se aplique, ou seja, antes que `PARE SLAVE` seja concluído, ocorra um erro ou outro thread emita `KILL` ou o servidor seja reiniciado. Nesses casos, `PARE SLAVE` retorna com sucesso.

6. Se a última transação no log de retransmissão for apenas parcialmente recebida e o coordenador da replica multithread tiver começado a agendar a transação para um trabalhador, então o `STOP SLAVE` aguarda até 60 segundos para que a transação seja recebida. Após esse tempo limite, o coordenador desiste e aborta a transação. Se a transação for mista, ela pode ser deixada incompleta.

7. `PARE SLAVE` quando a transação em andamento atualiza apenas as tabelas transacionais, nesse caso, ela é revertida e `PARE SLAVE` para de funcionar imediatamente. Se a transação em andamento for mista, `PARE SLAVE` aguarda até 60 segundos para que a transação seja concluída. Após esse tempo de espera, ela interrompe a transação, então ela pode ficar meio concluída.

A variável global `rpl_stop_slave_timeout` não está relacionada ao processo de parada dos threads de replicação. Ela apenas faz o cliente que emite `STOP SLAVE` retornar ao cliente, mas os threads de replicação continuam tentando parar.

Se um canal de replicação tiver lacunas, isso terá as seguintes consequências:

1. O banco de dados de replicação está em um estado que nunca poderia ter existido na fonte.

2. O campo `Exec_master_log_pos` na consulta `SHOW SLAVE STATUS` é apenas um "limite mínimo". Em outras palavras, as transações que aparecem antes da posição são garantidas como concluídas, mas as transações após a posição podem ter sido concluídas ou

3. As declarações `CHANGE MASTER TO` para esse canal falham com um erro, a menos que os threads do aplicativo estejam em execução e a declaração `CHANGE MASTER TO` apenas defina as opções do receptor.

4. Se o **mysqld** for iniciado com `--relay-log-recovery` (opções de replicação-replica.html#sysvar_relay_log_recovery), não será realizada nenhuma recuperação para esse canal, e uma mensagem de aviso será impressa.

5. Se o **mysqldump** for usado com `--dump-slave`, ele não registra a existência de lacunas; assim, ele imprime `CHANGE MASTER TO` com `RELAY_LOG_POS` definido para a posição do "nível mínimo" em `Exec_master_log_pos`.

   Após aplicar o dump em outro servidor e iniciar os threads de replicação, as transações que aparecem após a posição são replicadas novamente. Observe que isso é inofensivo se os GTIDs estiverem habilitados (no entanto, nesse caso, não é recomendado usar `--dump-slave`).

Se um canal de replicação tiver atraso na posição do log binário de origem, mas sem lacunas, os casos 2 a 5 acima se aplicam, mas o caso 1

As informações de posição do log binário de origem são mantidas em formato binário na tabela interna `mysql.slave_worker_info`. `START SLAVE [SQL_THREAD]` sempre consulta essas informações para que elas sejam aplicadas apenas às transações corretas. Isso permanece verdadeiro mesmo se `slave_parallel_workers` tiver sido alterado para 0 antes de `START SLAVE`, e mesmo se `START SLAVE` for usado com cláusulas `UNTIL`. `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` aplica apenas tantas transações quanto necessário para preencher as lacunas. Se `START SLAVE` for usado com cláusulas `UNTIL` que dizem para ele parar antes de consumir todas as lacunas, ele deixa as lacunas restantes.

Aviso

O comando `RESET SLAVE` remove os registros do relé e redefini o posicionamento da replicação. Portanto, ao emitir o comando `RESET SLAVE` em uma replica com lacunas, a replica perde qualquer informação sobre as lacunas, sem corrigir as lacunas.

Quando a replicação baseada em GTID está em uso, a partir do MySQL 5.7.28, uma replica multisserializa verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON`, e se estiver, omite o passo de cálculo das transações que devem ser ignoradas ou não ignoradas. Nessa situação, os logs do retransmissor antigo não são necessários para o processo de recuperação.
