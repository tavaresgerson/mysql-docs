#### 19.5.1.35 Inconsistências na Replicação e em Transações

Inconsistências na sequência de transações executadas a partir do log de retransmissão podem ocorrer dependendo da configuração de replicação. Esta seção explica como evitar inconsistências e resolver quaisquer problemas que elas causam.

Os seguintes tipos de inconsistências podem existir:

* *Transações parcialmente aplicadas*. Uma transação que atualiza tabelas não transacionais aplicou algumas, mas não todas, de suas alterações.

* *Lacunas*. Uma lacuna no conjunto de transações externalizadas aparece quando, dada uma sequência ordenada de transações, uma transação que está mais tarde na sequência é aplicada antes de outra transação que está mais cedo na sequência. Lacunas só podem aparecer ao usar uma replica multithread.

Para evitar que lacunas apareçam em uma replica multithread, configure `replica_preserve_commit_order=ON`. Isso é o padrão, porque todas as réplicas são multithread por padrão.

O registro binário e o registro de atualização da replica não são necessários na replica para configurar `replica_preserve_commit_order=ON`, e podem ser desativados se desejado.

Em algumas situações específicas, conforme listadas na descrição para `replica_preserve_commit_order`, configurar `replica_preserve_commit_order=ON` não preserva a ordem de commit na replica, então, nesses casos, lacunas ainda podem aparecer na sequência de transações executadas a partir do log de retransmissão da replica.

Configurar `replica_preserve_commit_order=ON` não impede a lag da posição do log binário de origem.

*Atraso na posição do log binário de origem*. Mesmo na ausência de lacunas, é possível que transações após `Exec_master_log_pos` tenham sido aplicadas. Ou seja, todas as transações até o ponto `N` foram aplicadas, e nenhuma transação após `N` foi aplicada, mas `Exec_master_log_pos` tem um valor menor que `N`. Nessa situação, `Exec_master_log_pos` é uma "marca de baixa água" das transações aplicadas, e fica atrasada em relação à posição da transação mais recentemente aplicada. Isso só pode acontecer em réplicas multithread. Ativação de `replica_preserve_commit_order` não impede o atraso na posição do log binário de origem.

Os seguintes cenários são relevantes para a existência de transações meio aplicadas, lacunas e atraso na posição do log binário de origem:

1. Enquanto os threads de replicação estão em execução, podem haver lacunas e transações meio aplicadas.

2. O **mysqld** é desligado. Tanto o desligamento limpo quanto o não limpo abortam as transações em andamento e podem deixar lacunas e transações meio aplicadas.

3. `KILL` dos threads de replicação (o thread SQL ao usar uma replica monofilamento, o thread coordenador ao usar uma replica multifilamento). Isso abortam as transações em andamento e podem deixar lacunas e transações meio aplicadas.

4. Erro nos threads do aplicável. Isso pode deixar lacunas. Se o erro estiver em uma transação mista, essa transação está meio aplicada. Ao usar uma replica multifilamento, os trabalhadores que não receberam um erro completam suas filas, então pode levar tempo para parar todos os threads.

5. `STOP REPLICA` ao usar uma replica multithreading. Após emitir `STOP REPLICA`, a replica aguarda por quaisquer lacunas serem preenchidas e, em seguida, atualiza `Exec_master_log_pos`. Isso garante que ela nunca deixe lacunas ou atraso na posição do log binário de origem, a menos que algum dos casos acima se aplique, ou seja, antes que `STOP REPLICA` seja concluído, ocorra um erro, ou outro thread emita `KILL`, ou o servidor seja reiniciado. Nesses casos, `STOP REPLICA` retorna com sucesso.

6. Se a última transação no log de retransmissão for apenas parcialmente recebida e o thread coordenador da replica multithreading tiver começado a agendar a transação para um trabalhador, então `STOP REPLICA` aguarda até 60 segundos para que a transação seja recebida. Após esse tempo limite, o coordenador desiste e aborta a transação. Se a transação for mista, ela pode ser deixada incompleta.

7. `STOP REPLICA` quando a transação em andamento atualiza apenas tabelas transacionais, nesse caso, ela é revertida e `STOP REPLICA` para de imediatamente. Se a transação em andamento for mista, `STOP REPLICA` aguarda até 60 segundos para que a transação seja concluída. Após esse tempo limite, ela aborta a transação, então ela pode ser deixada incompleta.

O ajuste global da variável de sistema `rpl_stop_replica_timeout` não está relacionado ao processo de parada dos threads de replicação. Ele apenas faz o cliente que emite `STOP REPLICA` retornar ao cliente, mas os threads de replicação continuam a tentar parar.

Se um canal de replicação tiver lacunas, ele tem as seguintes consequências:

1. O banco de dados da replica está em um estado que nunca poderia ter existido na origem.

2. O campo `Exec_master_log_pos` na consulta `SHOW REPLICA STATUS` é apenas um "limite mínimo". Em outras palavras, as transações que aparecem antes da posição são garantidas como já confirmadas, mas as transações após a posição podem ter sido confirmadas ou não.

3. As instruções `CHANGE REPLICATION SOURCE TO` para esse canal falham com um erro, a menos que os threads do aplicável estejam em execução e a instrução apenas defina as opções do receptor.

4. Se o **mysqld** for iniciado com `--relay-log-recovery`, não será realizada nenhuma recuperação para esse canal, e será impresso um aviso.

5. Se o **mysqldump** for usado com `--dump-replica`, ele não registra a existência de lacunas; assim, ele imprime `CHANGE REPLICATION SOURCE TO` com `RELAY_LOG_POS` definido para a posição do "limite mínimo" em `Exec_master_log_pos`.

   Após aplicar o dump em outro servidor e iniciar os threads de replicação, as transações que aparecem após a posição são replicadas novamente. Note que isso é inofensivo se os GTIDs estiverem habilitados (no entanto, nesse caso, não é recomendado usar `--dump-replica`).

Se um canal de replicação tiver atraso na posição do log binário de origem, mas sem lacunas, os casos 2 a 5 acima se aplicam, mas o caso 1 não.

As informações da posição do log binário de origem são persistidas em formato binário na tabela interna `mysql.slave_worker_info`. `START REPLICA [SQL_THREAD]` consulta sempre essas informações para aplicar apenas as transações corretas. Isso permanece verdadeiro mesmo se o `START REPLICA` for usado com `UNTIL`. `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` aplica apenas tantas transações quanto necessário para preencher as lacunas. Se o `START REPLICA` for usado com cláusulas `UNTIL` que dizem para parar antes de ter consumido todas as lacunas, ele deixa as lacunas restantes.

Aviso

`RESET REPLICA` remove os registros do relé e redefini o posicionamento da replicação. Portanto, emitir `RESET REPLICA` em uma replica multithread com lacunas significa que a replica perde qualquer informação sobre as lacunas, sem corrigir as lacunas. Nesta situação, se a replicação baseada na posição do log binário estiver em uso, o processo de recuperação falhará.

Quando a replicação baseada no GTID estiver em uso (`GTID_MODE=ON`) e o `SOURCE_AUTO_POSITION` estiver definido para o canal de replicação usando a instrução `CHANGE REPLICATION SOURCE TO`, os antigos registros do relé não são necessários para o processo de recuperação. Em vez disso, a replica pode usar a autoposição do GTID para calcular quais transações estão faltando em relação à fonte. O processo usado para a replicação baseada na posição do log binário para resolver lacunas em uma replica multithread é ignorado completamente quando a replicação baseada no GTID estiver em uso. Quando o processo é ignorado, uma instrução `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` se comporta de maneira diferente e não tenta verificar as lacunas na sequência de transações. Você também pode emitir instruções `CHANGE REPLICATION SOURCE TO`, que não são permitidas em uma replica não GTID onde há lacunas.