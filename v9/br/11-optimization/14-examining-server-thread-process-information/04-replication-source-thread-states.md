### 10.14.4 Estados dos Nodos de Replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `Estado` para o thread `Dump de Binlog` do nó de replicação. Se você não vir nenhum thread `Dump de Binlog` em um nó, isso significa que a replicação não está em execução; ou seja, que nenhuma réplica está conectada atualmente.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Finalizou a leitura de um binlog; passando para o próximo binlog`

  O thread terminou de ler um arquivo de log binário e está abrindo o próximo para enviar para a réplica.

* `O mestre enviou todo o binlog para o escravo; aguardando mais atualizações`

  `A fonte enviou todo o binlog para a réplica; aguardando mais atualizações`

  O thread leu todas as atualizações restantes dos logs binários e as enviou para a réplica. O thread agora está parado, aguardando novos eventos aparecerem no log binário resultantes de novas atualizações ocorrendo na fonte.

* `Enviando evento de binlog para o escravo`

  `Enviando evento de binlog para a réplica`

  Os logs binários consistem em *eventos*, onde um evento geralmente é uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando para a réplica.

* `Aguardando a finalização da terminação`

  Um estado muito breve que ocorre enquanto o thread está parando.