### 10.14.6 Estados de Fios de SQL de Replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `Estado` para um fio de SQL de replicação em um servidor de replica.

No MySQL 8.0, foram feitas alterações incompatíveis nos nomes de instrumentação. Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Criando arquivo temporário (append) antes de refazer LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está anexando os dados a um arquivo temporário contendo os dados a partir dos quais a replica lê linhas.
* `Criando arquivo temporário (create) antes de refazer LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê linhas. Esse estado só pode ser encontrado se a instrução `LOAD DATA` original foi registrada por uma fonte executando uma versão do MySQL menor que MySQL 5.0.3.
* `Lendo evento do log de retransmissão`

  O fio leu um evento do log de retransmissão para que o evento possa ser processado.
* `O escravo leu todo o log de retransmissão; aguardando mais atualizações`

  `Replica leu todo o log de retransmissão; aguardando mais atualizações`

  O fio processou todos os eventos nos arquivos de log de retransmissão e agora está aguardando que o fio de receptor (I/O) escreva novos eventos no log de retransmissão.
* `Aguardando um evento do Coordenador`

Usando a replica multithread (`replica_parallel_workers` é maior que 1), um dos threads de trabalho da replica está aguardando um evento do thread do coordenador.
* `Aguardando o mutex do escravo na saída`

  `Aguardando o mutex da replica na saída`

  Um estado muito breve que ocorre quando o thread está parando.
* `Aguardando os trabalhadores escravos para liberar eventos pendentes`

  `Aguardando os trabalhadores da replica para liberar eventos pendentes`

  Esta ação de espera ocorre quando o tamanho total dos eventos sendo processados pelos Trabalhadores excede o tamanho da variável de sistema `replica_pending_jobs_size_max`. O Coordenador retoma a programação quando o tamanho cai abaixo deste limite. Este estado ocorre apenas quando `replica_parallel_workers` é definido maior que 0.
* `Aguardando o próximo evento no log de retransmissão`

  O estado inicial antes de `Lendo o evento do log de retransmissão`.
* `Aguardando até `SOURCE_DELAY` segundos após o evento ser executado na fonte`

  O thread SQL leu um evento, mas está aguardando que o atraso da replica expire. Este atraso é definido com a opção `SOURCE_DELAY` do `CHANGE REPLICATION SOURCE TO`.
A coluna `Info` para o thread SQL também pode exibir o texto de uma declaração. Isso indica que o thread leu um evento do log de retransmissão, extraiu a declaração dele e pode estar executando-a.