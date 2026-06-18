### 10.14.4 Estados de fios de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para o fio `Binlog Dump` da fonte de replicação. Se você não vir nenhum fio `Binlog Dump` em uma fonte, isso significa que a replicação não está sendo executada, ou seja, que nenhuma réplica está conectada atualmente.

No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes das instrumentações, incluindo os nomes das etapas do thread, que contêm os termos “master”, que foi alterado para “source”, “slave”, que foi alterado para “replica” e “mts” (para “multithreaded slave”), que foi alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

- `Finished reading one binlog; switching to next binlog`

  O fio terminou de ler um arquivo de log binário e está abrindo o próximo para enviar para a replica.

- `Master has sent all binlog to slave; waiting for more updates`

  A partir do MySQL 8.0.26: `Source has sent all binlog to replica; waiting for more updates`

  O fio leu todas as atualizações restantes dos logs binários e enviou-as para a replica. O fio agora está parado, aguardando novos eventos aparecerem no log binário resultantes de novas atualizações ocorrendo na fonte.

- `Sending binlog event to slave`

  A partir do MySQL 8.0.26: `Sending binlog event to replica`

  Os logs binários consistem em *eventos*, onde um evento geralmente é uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando-o para a replica.

- `Waiting to finalize termination`

  Um estado muito breve que ocorre quando o fio está parando.
