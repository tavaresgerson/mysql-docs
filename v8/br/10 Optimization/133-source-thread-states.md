### 10.14.4 Estados dos fios de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `Estado` para o fio de `Dump de Binlog` da fonte de replicação. Se você não vir nenhum fio de `Dump de Binlog` em uma fonte, isso significa que a replicação não está em execução; ou seja, que nenhuma réplica está conectada atualmente.

No MySQL 8.0, foram feitas alterações incompatíveis nos nomes de instrumentação. Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser impactadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Finalizou a leitura de um binlog; passando para o próximo binlog`

  O fio terminou de ler um arquivo de log binário e está abrindo o próximo para enviar para a réplica.
* `O mestre enviou todo o binlog para o escravo; aguardando mais atualizações`

  `A fonte enviou todo o binlog para a réplica; aguardando mais atualizações`

  O fio leu todas as atualizações restantes dos logs binários e as enviou para a réplica. O fio agora está parado, aguardando novos eventos aparecerem no log binário resultantes de novas atualizações ocorrendo na fonte.
* `Enviando evento de binlog para o escravo`

  `Enviando evento de binlog para a réplica`

  Os logs binários consistem em *eventos*, onde um evento geralmente é uma atualização mais algumas outras informações. O fio leu um evento do log binário e agora está enviando para a réplica.
* `Aguardando a finalização da terminação`

  Um estado muito breve que ocorre enquanto o fio está parando.