### 8.14.5 Estados de fios de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `Estado` para o tópico `Dump de Binlog` da fonte de replicação. Se você não vir nenhum tópico `Dump de Binlog` em uma fonte, isso significa que a replicação não está sendo executada; ou seja, que nenhuma réplica está conectada atualmente.

- "Finalizou a leitura de um binlog; passando para o próximo binlog"

  O fio terminou de ler um arquivo de log binário e está abrindo o próximo para enviar para a replica.

- O mestre enviou todos os binlogs para o escravo; aguardando mais atualizações

  O fio leu todas as atualizações restantes dos logs binários e enviou-as para a replica. O fio agora está parado, aguardando novos eventos aparecerem no log binário resultantes de novas atualizações ocorrendo na fonte.

- `Enviar evento binlog para escravo`

  Os logs binários consistem em *eventos*, onde um evento geralmente é uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando-o para a replica.

- "Esperando finalizar a rescisão"

  Um estado muito breve que ocorre quando o fio está parando.
