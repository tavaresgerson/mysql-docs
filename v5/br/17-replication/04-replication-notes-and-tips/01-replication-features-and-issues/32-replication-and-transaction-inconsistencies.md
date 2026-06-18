#### 16.4.1.32 Replicação e Inconsistências de Transação

Inconsistências na sequência de transações que foram executadas a partir do *relay log* podem ocorrer dependendo da sua configuração de replicação. Esta seção explica como evitar inconsistências e resolver quaisquer problemas que elas causem.

Os seguintes tipos de inconsistências podem existir:

*   ***Transações parcialmente aplicadas*** (*Half-applied transactions*). Uma transação que atualiza tabelas não transacionais aplicou algumas, mas não todas, as suas alterações.

*   ***Lacunas*** (*Gaps*). Uma lacuna é uma transação que não foi totalmente aplicada, mesmo que alguma transação posterior na sequência tenha sido aplicada. Lacunas só podem aparecer ao usar uma réplica multithread. Para evitar que lacunas ocorram, defina `slave_preserve_commit_order=1`, o que requer `slave_parallel_type=LOGICAL_CLOCK`, e que `log-bin` e `log-slave-updates` também estejam habilitados. Note que `slave_preserve_commit_order=1` não preserva a ordem das atualizações DML não transacionais, portanto, estas podem ser *commited* antes das transações que as precedem no *relay log*, o que pode resultar em lacunas.

*   ***Atraso na posição do Binary Log da Source*** (*Source binary log position lag*). Mesmo na ausência de lacunas, é possível que transações após `Exec_master_log_pos` tenham sido aplicadas. Ou seja, todas as transações até o ponto `N` foram aplicadas, e nenhuma transação após `N` foi aplicada, mas `Exec_master_log_pos` possui um valor menor que `N`. Nesta situação, `Exec_master_log_pos` é uma "low-water mark" das transações aplicadas e está atrasada em relação à posição da transação aplicada mais recentemente. Isso só pode ocorrer em réplicas multithread. Habilitar `slave_preserve_commit_order` não impede o atraso na posição do *binary log* da *Source*.

Os cenários a seguir são relevantes para a existência de transações parcialmente aplicadas, lacunas e atraso na posição do *binary log* da *Source*:

1. Enquanto os *threads* de replicação estiverem em execução, pode haver lacunas e transações parcialmente aplicadas.

2. **mysqld** é desligado. Desligamentos limpos e não limpos abortam transações em andamento e podem deixar lacunas e transações parcialmente aplicadas.

3. `KILL` de *threads* de replicação (o *SQL thread* ao usar uma réplica single-threaded, o *coordinator thread* ao usar uma réplica multithread). Isso aborta transações em andamento e pode deixar lacunas e transações parcialmente aplicadas.

4. Erro nos *applier threads*. Isso pode deixar lacunas. Se o erro estiver em uma transação mista, essa transação é parcialmente aplicada. Ao usar uma réplica multithread, os *workers* que não receberam um erro completam suas *queues*, então pode levar tempo para parar todos os *threads*.

5. `STOP SLAVE` ao usar uma réplica multithread. Após emitir `STOP SLAVE`, a réplica aguarda que quaisquer lacunas sejam preenchidas e então atualiza `Exec_master_log_pos`. Isso garante que ela nunca deixe lacunas ou atraso na posição do *binary log* da *Source*, a menos que um dos casos acima se aplique; em outras palavras, antes que `STOP SLAVE` seja concluído, ou um erro ocorre, ou outro *thread* emite `KILL`, ou o servidor reinicia. Nesses casos, `STOP SLAVE` retorna com sucesso.

6. Se a última transação no *relay log* for apenas parcialmente recebida e o coordenador da réplica multithread tiver começado a agendar a transação para um *worker*, então `STOP SLAVE` aguarda até 60 segundos para que a transação seja recebida. Após este *timeout*, o coordenador desiste e aborta a transação. Se a transação for mista, ela pode ser deixada parcialmente concluída.

7. `STOP SLAVE` quando a transação em andamento atualiza apenas tabelas transacionais, caso em que ela é *rolled back* e `STOP SLAVE` para imediatamente. Se a transação em andamento for mista, `STOP SLAVE` aguarda até 60 segundos para que a transação seja concluída. Após este *timeout*, ela aborta a transação, podendo assim ser deixada parcialmente concluída.

A variável global `rpl_stop_slave_timeout` não está relacionada ao processo de parada dos *threads* de replicação. Ela apenas faz com que o cliente que emite `STOP SLAVE` retorne ao cliente, mas os *threads* de replicação continuam a tentar parar.

Se um canal de replicação tiver lacunas, isso terá as seguintes consequências:

1. O *Database* da réplica está em um estado que pode nunca ter existido na *Source*.

2. O campo `Exec_master_log_pos` em `SHOW SLAVE STATUS` é apenas uma "low-water mark". Em outras palavras, as transações que aparecem antes da posição têm garantia de terem sido *commited*, mas as transações após a posição podem ter sido *commited* ou não.

3. Instruções `CHANGE MASTER TO` para esse canal falham com um erro, a menos que os *applier threads* estejam em execução e a instrução `CHANGE MASTER TO` defina apenas opções de *receiver*.

4. Se **mysqld** for iniciado com `--relay-log-recovery`, nenhuma recuperação (*recovery*) será feita para esse canal, e um aviso será impresso.

5. Se **mysqldump** for usado com `--dump-slave`, ele não registra a existência de lacunas; portanto, ele imprime `CHANGE MASTER TO` com `RELAY_LOG_POS` definido para a posição "low-water mark" em `Exec_master_log_pos`.

   Após aplicar o *dump* em outro servidor e iniciar os *threads* de replicação, as transações que aparecem após a posição são replicadas novamente. Note que isso é inofensivo se *GTIDs* estiverem habilitados (no entanto, nesse caso, não é recomendado usar `--dump-slave`).

Se um canal de replicação tiver atraso na posição do *binary log* da *Source*, mas nenhuma lacuna, os casos 2 a 5 acima se aplicam, mas o caso 1 não.

A informação de posição do *binary log* da *Source* é persistida em formato binário na tabela interna `mysql.slave_worker_info`. `START SLAVE [SQL_THREAD]` sempre consulta esta informação para que aplique apenas as transações corretas. Isso permanece verdadeiro mesmo se `slave_parallel_workers` tiver sido alterado para 0 antes de `START SLAVE`, e mesmo se `START SLAVE` for usado com cláusulas `UNTIL`. `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` aplica apenas o número de transações necessário para preencher as lacunas. Se `START SLAVE` for usado com cláusulas `UNTIL` que o instruem a parar antes de consumir todas as lacunas, ele deixará as lacunas restantes.

> [!Warning]
>
> `RESET SLAVE` remove os *relay logs* e redefine a posição de replicação. Assim, emitir `RESET SLAVE` em uma réplica com lacunas significa que a réplica perde qualquer informação sobre as lacunas, sem corrigir as lacunas.

Quando a replicação baseada em *GTID* está em uso, a partir do MySQL 5.7.28, uma réplica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON` e, em caso afirmativo, omite a etapa de calcular as transações que devem ou não ser ignoradas. Nessa situação, os *relay logs* antigos não são necessários para o processo de recuperação.