### 10.14.6 Estados de Filo de Solução SQL de Replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` (Estado) para um fio de solução SQL de replicação em um servidor de replica.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Fazendo arquivo temporário (append) antes de refazer LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê linhas.

* `Fazendo arquivo temporário (create) antes de refazer LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está criando um arquivo temporário que contém os dados a partir dos quais a replica lê linhas. Esse estado só pode ser encontrado se a instrução `LOAD DATA` original foi registrada por uma fonte executando uma versão do MySQL menor que MySQL 5.0.3.

* `Lendo evento do log de relevo`

  O fio leu um evento do log de relevo para que o evento possa ser processado.

* `O escravo leu todo o log de relevo; aguardando mais atualizações`

  `A replica leu todo o log de relevo; aguardando mais atualizações`

  O fio processou todos os eventos nos arquivos de log de relevo e agora está aguardando que o fio de receptor (I/O) escreva novos eventos no log de relevo.

* `Aguardando um evento do Coordenador`

  Usando a replica multifilo (`replica_parallel_workers` é maior que 1), um dos fios de trabalho da replica está aguardando um evento do fio de thread do coordenador.

* `Aguardando o mutex do escravo na saída`

  `Aguardando o mutex da replica na saída`

  Um estado muito breve que ocorre quando o fio está sendo interrompido.

* `Aguardando os trabalhadores do escravo liberarem eventos pendentes`

`Aguardando trabalhadores de replicação para liberar eventos pendentes`

Esta ação de espera ocorre quando o tamanho total dos eventos sendo processados pelos Trabalhadores excede o tamanho da variável de sistema `replica_pending_jobs_size_max`. O Coordenador retoma a agendamento quando o tamanho cai abaixo desse limite.

* `Aguardando o próximo evento no log de retransmissão`

  O estado inicial antes de `Leitura de evento do log de retransmissão`

* `Aguardando até que o tempo `SOURCE_DELAY` após o evento executado pela fonte expire`

  O thread SQL leu um evento, mas está aguardando o atraso da replicação para expirar. Esse atraso é definido com a opção `SOURCE_DELAY` da `ALTERAR A REPLICA PARA`.

A coluna `Info` para o thread SQL também pode exibir o texto de uma declaração. Isso indica que o thread leu um evento do log de retransmissão, extraiu a declaração dele e pode estar executando-a.