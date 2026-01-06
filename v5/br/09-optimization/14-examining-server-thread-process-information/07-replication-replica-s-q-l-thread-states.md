### 8.14.7 Replicação Estados de fio de replicação SQL

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `Estado` para um tópico de servidor de replicação SQL:

- `Criar arquivo temporário (append) antes de refazer LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas.

- `Criar um arquivo temporário (criar) antes de refazer o LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê as linhas. Esse estado só pode ser encontrado se a instrução `LOAD DATA` original foi registrada por uma fonte executando uma versão do MySQL inferior a MySQL 5.0.3.

- "Evento de leitura do registro de relé"

  O fio leu um evento do log de relé para que o evento possa ser processado.

- `Slave leu todo o log do relé; aguardando mais atualizações`

  O fio processou todos os eventos nos arquivos de log do relé e agora está aguardando que o fio de E/S escreva novos eventos no log do relé.

- "Esperando por um evento do Coordenador"

  Usando a replica multithreading (`slave_parallel_workers` é maior que 1), um dos threads de trabalho da replica está aguardando um evento da thread do coordenador.

- `Esperando por um mutex de escravo na saída`

  Um estado muito breve que ocorre quando o fio está parando.

- `Esperando por trabalhadores escravizados para liberar eventos pendentes`

  Essa ação de espera ocorre quando o tamanho total dos eventos sendo processados pelos Workers excede o tamanho da variável de sistema `slave_pending_jobs_size_max`. O Coordenador retoma a agendamento quando o tamanho cai abaixo desse limite. Esse estado ocorre apenas quando `slave_parallel_workers` é definido como maior que 0.

- `Aguardando o próximo evento no log de revezamento`

  O estado inicial antes do evento de leitura do log do relé.

- `Esperar até que o MASTER_DELAY segundos após o evento do mestre sejam executados`

  O fio SQL leu um evento, mas está aguardando o término do atraso da replica. Esse atraso é definido com a opção `MASTER_DELAY` de `CHANGE MASTER TO`.

A coluna `Info` do fio de SQL também pode exibir o texto de uma instrução. Isso indica que o fio leu um evento do log de retransmissão, extraiu a instrução dele e pode estar executando-a.
