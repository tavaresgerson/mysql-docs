## 8.14 Examinando informações de thread (processo) do servidor

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. Por exemplo:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: event_scheduler
   Host: localhost
     db: NULL
Command: Daemon
   Time: 2756681
  State: Waiting on empty queue
   Info: NULL
*************************** 2. row ***************************
     Id: 20
   User: me
   Host: localhost:52943
     db: test
Command: Query
   Time: 0
  State: starting
   Info: SHOW PROCESSLIST
```

Os threads podem ser mortos com a declaração `KILL`. Veja a Seção 13.7.6.4, “Declaração KILL”.

### 8.14.1 Acessando a Lista de Processos

A discussão a seguir enumera as fontes de informações sobre processos, os privilégios necessários para visualizar informações sobre processos e descreve o conteúdo das entradas da lista de processos.

* Fontes de informações sobre o processo * Privilegios necessários para acessar a lista de processos * Conteúdo das entradas da lista de processos

#### Fontes de Informações sobre o Processo

As informações sobre o processo estão disponíveis nessas fontes:

* A declaração `SHOW PROCESSLIST`: Seção 13.7.5.29, “Declaração SHOW PROCESSLIST”

* O comando **mysqladmin processlist**: Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”

* A tabela `INFORMATION_SCHEMA` `PROCESSLIST`: Seção 24.3.18, “A tabela INFORMATION_SCHEMA PROCESSLIST”

* A tabela do Schema de Desempenho `processlist`: Seção 25.12.16.3, “A tabela processlist”

* Colunas da tabela Schema de desempenho `threads` com nomes que têm um prefixo de `PROCESSLIST_`: Seção 25.12.16.4, “A tabela de threads”

* Os esquemas de `sys` `processlist` e `session`: Seção 26.4.3.22, “O processlist e as vistas x$processlist”, e Seção 26.4.3.33, “A sessão e as vistas x$session”

A tabela `threads` é comparada com `SHOW PROCESSLIST`, `INFORMATION_SCHEMA`, `PROCESSLIST` e **mysqladmin processlist** da seguinte forma:

* O acesso à tabela `threads` não requer um mutex e tem um impacto mínimo no desempenho do servidor. As outras fontes têm consequências negativas de desempenho porque elas requerem um mutex.

Nota

A partir do MySQL 5.7.39, uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela do Gerador de Desempenho `processlist`, que, assim como a tabela `threads`, não requer um mutex e possui melhores características de desempenho. Para detalhes, consulte a Seção 25.12.16.3, “A tabela processlist”.

* A tabela `threads` exibe threads de fundo, que as outras fontes não fazem. Ela também fornece informações adicionais para cada thread que as outras fontes não fornecem, como se a thread é uma thread de primeiro plano ou de fundo, e a localização dentro do servidor associada à thread. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade das threads que as outras fontes não podem.

* Você pode habilitar ou desabilitar o monitoramento de threads do Schema de desempenho, conforme descrito na Seção 25.12.16.4, “A tabela de threads”.

Por essas razões, os DBA que realizam monitoramento de servidores usando uma das outras fontes de informações sobre o thread podem querer monitorar usando a tabela `threads` em vez disso.

A visão `sys` do esquema `processlist` apresenta informações da tabela do Schema de Desempenho `threads` em um formato mais acessível. A visão `sys` do esquema `session` apresenta informações sobre sessões de usuários, como a visão `sys` do esquema `processlist`, mas com processos de fundo filtrados.

#### Privilegios necessários para acessar a lista de processos

Para a maioria das fontes de informações sobre processos, se você tiver o privilégio `PROCESS`, poderá ver todas as threads, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre suas próprias threads, mas não sobre as threads de outros usuários, e os usuários anônimos não têm acesso às informações sobre as threads.

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja a Seção 25.12.16.4, “A tabela de threads”.

#### Conteúdo das entradas da lista de processos

Cada entrada da lista de processos contém várias informações. A lista a seguir descreve essas informações usando as etiquetas do `SHOW PROCESSLIST` de saída. Outras fontes de informações sobre processos usam etiquetas semelhantes.

* `Id` é o identificador de conexão do cliente associado ao thread.

* `User` e `Host` indicam a conta associada ao tópico.

* `db` é o banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `Command` e `State` indicam o que a thread está fazendo.

A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

As seções a seguir listam os possíveis valores de `Command` e os valores de `State` agrupados por categoria. O significado de alguns desses valores é evidente. Para outros, é fornecida uma descrição adicional.

Nota

As aplicações que examinam informações da lista de processos devem estar cientes de que os comandos e os estados estão sujeitos a alterações.

* `Time` indica quanto tempo o thread está em seu estado atual. A noção do thread sobre o tempo atual pode ser alterada em alguns casos: o thread pode alterar o tempo com `SET TIMESTAMP = value`. Para um thread de replica SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Threads de Replicação”.

* `Info` indica a declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. Para `SHOW PROCESSLIST`, esse valor contém apenas os primeiros 100 caracteres da declaração. Para ver declarações completas, use `SHOW FULL PROCESSLIST` (ou consulte uma fonte de informações de processo diferente).

### 8.14.2 Valores dos comandos de thread

Um thread pode ter qualquer um dos seguintes valores `Command`:

* `Binlog Dump`

Este é um thread em uma fonte de replicação para enviar conteúdos de log binário para uma replica.

* `Change user`

O thread está executando uma operação de mudança de usuário.

* `Close stmt`

O thread está fechando uma declaração preparada.

* `Connect`

Uma réplica está conectada à sua fonte.

* `Connect Out`

Uma réplica está se conectando à sua fonte.

* `Create DB`

O thread está executando uma operação de criação de banco de dados.

* `Daemon`

Este thread é interno ao servidor, não é um thread que atende a uma conexão de cliente.

* `Debug`

O thread está gerando informações de depuração.

* `Delayed insert`

O thread é um manipulador de inserção retardada.

* `Drop DB`

O thread está executando uma operação de drop de banco de dados.

* `Error`
* `Execute`

O thread está executando uma declaração preparada.

* `Fetch`

O thread está obtendo os resultados da execução de uma declaração preparada.

* `Field List`

O thread está obtendo informações para as colunas da tabela.

* `Init DB`

O thread está selecionando um banco de dados padrão.

* `Kill`

O thread está matando outro thread.

* `Long Data`

O thread está recuperando dados longos como resultado da execução de uma declaração preparada.

* `Ping`

O thread está lidando com um pedido de ping do servidor.

* `Prepare`

O thread está preparando uma declaração preparada.

* `Processlist`

O thread está produzindo informações sobre os threads do servidor.

* `Query`

O thread está executando uma declaração.

* `Quit`

O thread está terminando.

* `Refresh`

O thread está limpando a tabela, os logs ou os caches, ou redefinindo a variável de status ou as informações do servidor de replicação.

* `Register Slave`

O thread está registrando um servidor replica.

* `Reset stmt`

O thread está a redefinir uma declaração preparada.

* `Set option`

O thread está definindo ou redefinindo uma opção de execução de uma declaração do cliente.

* `Shutdown`

O thread está desligando o servidor.

* `Sleep`

O thread está esperando que o cliente envie uma nova declaração para ele.

* `Statistics`

O thread está produzindo informações sobre o status do servidor.

* `Time`

  Unused.

### 8.14.3 Estados gerais de threads

A lista a seguir descreve os valores do thread `State` que estão associados ao processamento de consultas gerais e não a atividades mais especializadas, como a replicação. Muitos desses são úteis apenas para encontrar bugs no servidor.

* `After create`

Isso ocorre quando o thread cria uma tabela (incluindo tabelas temporárias internas), no final da função que cria a tabela. Esse estado é usado mesmo se a tabela não puder ser criada devido a algum erro.

* `altering table`

O servidor está em processo de execução de um `ALTER TABLE` in-place.

* `Analyzing`

O thread está calculando as distribuições de chaves de tabela `MyISAM` (por exemplo, para `ANALYZE TABLE`).

* `checking permissions`

O thread verifica se o servidor tem os privilégios necessários para executar a declaração.

* `Checking table`

O thread está realizando uma operação de verificação de tabela.

* `cleaning up`

O thread processou um comando e está se preparando para liberar memória e redefinir certas variáveis de estado.

* `committing alter table to storage engine`

O servidor terminou um `ALTER TABLE` in-place e está comprometendo o resultado.

* `closing tables`

O thread está apagando os dados da tabela alterada no disco e fechando as tabelas usadas. Isso deve ser uma operação rápida. Se não for, verifique se não tem disco cheio e se o disco não está sendo muito utilizado.

* `converting HEAP to ondisk`

O thread está convertendo uma tabela temporária interna de uma tabela `MEMORY` para uma tabela em disco.

* `copy to tmp table`

O thread está processando uma declaração `ALTER TABLE`. Esse estado ocorre após a tabela com a nova estrutura ter sido criada, mas antes de as strings serem copiadas nela.

Para um thread neste estado, o Schema de Desempenho pode ser usado para obter informações sobre o progresso da operação de cópia. Veja a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

* `Copying to group table`

Se uma declaração tiver diferentes critérios de `ORDER BY` e `GROUP BY`, as strings são ordenadas por grupo e copiadas para uma tabela temporária.

* `Copying to tmp table`

O servidor está copiando para uma tabela temporária na memória.

* `Copying to tmp table on disk`

O servidor está copiando para uma tabela temporária no disco. O conjunto de resultados temporário tornou-se muito grande (consulte a Seção 8.4.4, "Uso de tabela temporária interna no MySQL"). Consequentemente, o thread está alterando a tabela temporária do formato de memória para o formato baseado em disco para economizar memória.

* `Creating index`

O thread está processando `ALTER TABLE ... ENABLE KEYS` para uma tabela `MyISAM`.

* `Creating sort index`

O thread está processando um `SELECT` que é resolvido usando uma tabela temporária interna.

* `creating table`

O thread está criando uma tabela. Isso inclui a criação de tabelas temporárias.

* `Creating tmp table`

O thread está criando uma tabela temporária na memória ou em disco. Se a tabela for criada na memória, mas posteriormente convertida em uma tabela em disco, o estado durante essa operação é `Copying to tmp table on disk`.

* `deleting from main table`

O servidor está executando a primeira parte de uma exclusão de múltiplas tabelas. Ele está excluindo apenas da primeira tabela e salvando as colunas e deslocamentos a serem usados para excluir das outras (tabelas de referência).

* `deleting from reference tables`

O servidor está executando a segunda parte de uma exclusão de múltiplas tabelas e excluindo as strings correspondentes das outras tabelas.

* `discard_or_import_tablespace`

O thread está processando uma declaração `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.

* `end`

Isso ocorre no final, mas antes da limpeza das declarações de `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

Para o estado `end`, as seguintes operações poderiam estar acontecendo:

+ Remover entradas do cache de consultas após as alterações de dados em uma tabela

+ Escrever um evento no log binário
+ Liberar buffers de memória, incluindo para blobs
* `executing`

O thread começou a executar uma declaração.

* `Execution of init_command`

O thread está executando declarações no valor da variável de sistema `init_command`.

* `freeing items`

O thread executou um comando. Algum liberamento de itens feito durante este estado envolve o cache de consulta. Este estado é geralmente seguido por `cleaning up`.

* `FULLTEXT initialization`

O servidor está se preparando para realizar uma pesquisa de texto completo em linguagem natural.

* `init`

Isso ocorre antes da inicialização das declarações `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações realizadas pelo servidor neste estado incluem o esvaziamento do log binário, o log `InnoDB` e algumas operações de limpeza do cache de consultas.

* `Killed`

Alguém enviou uma declaração `KILL` para o tópico e ela deve abortar na próxima vez que verificar a bandeira de interrupção. A bandeira é verificada em cada grande laço no MySQL, mas, em alguns casos, ainda pode levar um curto período de tempo para o tópico morrer. Se o tópico for bloqueado por outro tópico, a interrupção entra em vigor assim que o outro tópico libera seu bloqueio.

* `logging slow query`

O thread está escrevendo uma declaração no log de consulta lenta.

* `login`

O estado inicial de um thread de conexão até que o cliente tenha sido autenticado com sucesso.

* `manage keys`

O servidor está habilitando ou desabilitando um índice de tabela.

* `Opening tables`

O thread está tentando abrir uma tabela. Este deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma declaração `ALTER TABLE` ou `LOCK TABLE` pode impedir a abertura de uma tabela até que a declaração seja concluída. Também vale a pena verificar se o valor do `table_open_cache` é grande o suficiente.

* `optimizing`

O servidor está realizando otimizações iniciais para uma consulta.

* `preparing`

Esse estado ocorre durante a otimização da consulta.

* `preparing for alter table`

O servidor está se preparando para executar um `ALTER TABLE` in-place.

* `Purging old relay logs`

O thread está removendo arquivos de registro de relé desnecessários.

* `query end`

Esse estado ocorre após o processamento de uma consulta, mas antes do estado `freeing items`.

* `Receiving from client`

O servidor está lendo um pacote do cliente. Esse estado é chamado `Reading from net` antes do MySQL 5.7.8.

* `Removing duplicates`

A consulta estava usando `SELECT DISTINCT` de tal forma que o MySQL não conseguia otimizar a operação distinta em uma fase inicial. Por isso, o MySQL requer uma etapa extra para remover todas as strings duplicadas antes de enviar o resultado ao cliente.

* `removing tmp table`

O thread está removendo uma tabela temporária interna após o processamento de uma declaração `SELECT`. Esse estado não é usado se nenhuma tabela temporária foi criada.

* `rename`

O thread está renomeando uma tabela.

* `rename result table`

O thread está processando uma declaração `ALTER TABLE`, criou a nova tabela e está renomeando-a para substituir a tabela original.

* `Reopen tables`

O thread obteve um bloqueio para a tabela, mas percebeu, após obter o bloqueio, que a estrutura subjacente da tabela havia mudado. Ele liberou o bloqueio, fechou a tabela e está tentando reabri-la.

* `Repair by sorting`

O código de reparo está usando uma classificação para criar índices.

* `Repair done`

O thread concluiu uma reparação multifilamentar para uma tabela `MyISAM`.

* `Repair with keycache`

O código de reparo está usando a criação de chaves uma por uma através do cache de chaves. Isso é muito mais lento do que `Repair by sorting`.

* `Rolling back`

O thread está revertendo uma transação.

* `Saving state`

Para operações de tabela `MyISAM`, como reparo ou análise, o thread está salvando o novo estado da tabela no cabeçalho do arquivo [[`.MYI`]. O estado inclui informações como o número de strings, o contador `AUTO_INCREMENT` e as distribuições de chaves.

* `Searching rows for update`

O thread está realizando uma primeira fase para encontrar todas as strings correspondentes antes de as atualizar. Isso deve ser feito se o `UPDATE` estiver alterando o índice que é usado para encontrar as strings envolvidas.

* `Sending data`

O thread está lendo e processando strings para uma declaração `SELECT`, e enviando dados ao cliente. Como as operações que ocorrem durante esse estado tendem a realizar grandes quantidades de acesso ao disco (leitura), é frequentemente o estado com maior duração ao longo da vida útil de uma consulta dada.

* `Sending to client`

O servidor está escrevendo um pacote para o cliente. Esse estado é chamado `Writing to net` antes do MySQL 5.7.8.

* `setup`

O thread está começando uma operação `ALTER TABLE`.

* `Sorting for group`

O thread está fazendo uma espécie de `GROUP BY`.

* `Sorting for order`

O thread está fazendo uma espécie de `ORDER BY` para satisfazer.

* `Sorting index`

O índice de threads está sendo organizado para acesso mais eficiente durante uma operação de otimização de tabela `MyISAM`.

* `Sorting result`

Para uma declaração `SELECT`, isso é semelhante a `Creating sort index`, mas para tabelas não temporárias.

* `starting`

A primeira etapa no início da execução da declaração.

* `statistics`

O servidor está calculando estatísticas para desenvolver um plano de execução de consulta. Se um thread estiver nesse estado por um longo período, o servidor provavelmente está vinculado ao disco, realizando outro trabalho.

* `System lock`

O thread foi chamado de `mysql_lock_tables()` e o estado do thread não foi atualizado desde então. Esse é um estado muito geral que pode ocorrer por muitas razões.

Por exemplo, o thread vai solicitar ou está aguardando uma bloqueio interno ou externo para a tabela. Isso pode ocorrer quando o `InnoDB` aguarda um bloqueio de nível de tabela durante a execução do `LOCK TABLES`. Se este estado está sendo causado por solicitações de bloqueios externos e você não está usando vários servidores `mysqld` que estão acessando as mesmas tabelas `MyISAM`, você pode desabilitar bloqueios de sistema externos com a opção `--skip-external-locking`. No entanto, o bloqueio externo é desativado por padrão, então é provável que esta opção não tenha efeito. Para o `SHOW PROFILE`, este estado significa que o thread está solicitando o bloqueio (e não aguardando por ele).

* `update`

O thread está se preparando para começar a atualizar a tabela.

* `Updating`

O thread está procurando strings para atualizar e as está atualizando.

* `updating main table`

O servidor está executando a primeira parte de uma atualização de várias tabelas. Ele está atualizando apenas a primeira tabela e salvando as colunas e deslocamentos a serem usados para atualizar as outras (referência) tabelas.

* `updating reference tables`

O servidor está executando a segunda parte de uma atualização de várias tabelas e atualizando as strings correspondentes das outras tabelas.

* `User lock`

O thread vai solicitar ou está esperando por um bloqueio de aconselhamento solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que o thread está solicitando o bloqueio (e não esperando por ele).

* `User sleep`

O thread invocou uma chamada `SLEEP()`.

* `Waiting for commit lock`

`FLUSH TABLES WITH READ LOCK` está esperando por um bloqueio de commit.

* `Waiting for global read lock`

`FLUSH TABLES WITH READ LOCK` está esperando por um bloqueio de leitura global ou a variável de sistema global `read_only` está sendo definida.

* `Waiting for tables`

O thread recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e que ele precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros threads tenham fechado a tabela em questão.

Essa notificação ocorre se outro thread tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

* `Waiting for table flush`

O thread está executando `FLUSH TABLES` e está esperando que todos os threads fechem suas tabelas, ou o thread recebeu uma notificação de que a estrutura subjacente para uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros threads tenham fechado a tabela em questão.

Essa notificação ocorre se outro thread tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

* `Waiting for lock_type lock`

O servidor está aguardando para adquirir um bloqueio `THR_LOCK` ou um bloqueio do subsistema de bloqueio de metadados, onde *`lock_type`* indica o tipo de bloqueio.

Este estado indica uma espera para um `THR_LOCK`:

+ `Waiting for table level lock`

Estes estados indicam uma espera por uma bloqueio de metadados:

+ `Waiting for event metadata lock`
  + `Waiting for global read lock`
  + `Waiting for schema metadata lock`
  + `Waiting for stored function metadata lock`

+ `Waiting for stored procedure metadata lock`

+ `Waiting for table metadata lock`
  + `Waiting for trigger metadata lock`

Para informações sobre indicadores de bloqueio de tabela, consulte a Seção 8.11.1, “Métodos de bloqueio interno”. Para informações sobre bloqueio de metadados, consulte a Seção 8.11.4, “Bloqueio de metadados”. Para ver quais bloqueios estão bloqueando solicitações de bloqueio, use as tabelas de bloqueio do Schema de desempenho descritas na Seção 25.12.12, “Tabelas de bloqueio do Schema de desempenho”.

* `Waiting on cond`

Um estado genérico em que o thread está esperando que uma condição se torne verdadeira. Não há informações específicas sobre o estado disponíveis.

* `Writing to net`

O servidor está escrevendo um pacote na rede. Esse estado é chamado `Sending to client` a partir do MySQL 5.7.8.

### 8.14.4 Estados de fila do cache de consulta

Estes estados de thread estão associados ao cache de consulta (consulte a Seção 8.10.3, “O cache de consulta do MySQL”).

* `checking privileges on cached query`

O servidor está verificando se o usuário tem privilégios para acessar um resultado de consulta armazenada.

* `checking query cache for query`

O servidor está verificando se a consulta atual está presente no cache de consultas.

* `invalidating query cache entries`

As entradas do cache da consulta estão sendo marcadas como inválidas porque as tabelas subjacentes foram alteradas.

* `sending cached result to client`

O servidor está recebendo o resultado de uma consulta do cache de consulta e enviando-o ao cliente.

* `storing result in query cache`

O servidor está armazenando o resultado de uma consulta no cache de consulta.

* `Waiting for query cache lock`

Esse estado ocorre enquanto uma sessão está esperando para obter o bloqueio do cache de consulta. Isso pode acontecer para qualquer declaração que precise realizar alguma operação de cache de consulta, como um `INSERT` ou `DELETE` que invalida o cache de consulta, um `SELECT` que procura uma entrada em cache, `RESET QUERY CACHE`, e assim por diante.

### 8.14.5 Estados de threads de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para o thread `Binlog Dump` da fonte de replicação. Se você não ver nenhuma `Binlog Dump` threads em uma fonte, isso significa que a replicação não está sendo executada; ou seja, que nenhuma réplica está conectada atualmente.

* `Finished reading one binlog; switching to next binlog`

O thread terminou de ler um arquivo de registro binário e está abrindo o próximo para enviar para a replica.

* `Master has sent all binlog to slave; waiting for more updates`

O thread leu todas as atualizações restantes dos logs binários e as enviou para a replica. O thread agora está parado, esperando que novos eventos apareçam no log binário resultantes de novas atualizações ocorrendo na fonte.

* `Sending binlog event to slave`

Os logs binários consistem em *eventos*, onde um evento é geralmente uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando-o para a replica.

* `Waiting to finalize termination`

Um estado muito breve que ocorre quando o thread está parando.

### 8.14.6 Estados de fila de I/O de replicação Replica I/O

A lista a seguir mostra os estados mais comuns que você vê na coluna `State` para uma thread de I/O de servidor replica. Esse estado também aparece na coluna `Slave_IO_State` exibida pelo `SHOW SLAVE STATUS`, então você pode ter uma boa visão do que está acontecendo usando essa declaração.

* `Checking master version`

Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

* `Connecting to master`

O thread está tentando se conectar à fonte.

* `Queueing master event to the relay log`

O thread leu um evento e está copiando-o para o log do relé para que o thread SQL possa processá-lo.

* `Reconnecting after a failed binlog dump request`

O thread está tentando se reconectar à fonte.

* `Reconnecting after a failed master event read`

O thread está tentando se reconectar à fonte. Quando a conexão é estabelecida novamente, o estado se torna `Waiting for master to send event`.

* `Registering slave on master`

Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

* `Requesting binlog dump`

Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte uma solicitação dos conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.

* `Waiting for its turn to commit`

Um estado que ocorre quando o thread de replicação está esperando que os threads de trabalhadores mais antigos se comprometam se o `slave_preserve_commit_order` estiver habilitado.

* `Waiting for master to send event`

O thread está conectado à fonte e está esperando por eventos de registro binário chegar. Isso pode durar um longo tempo se a fonte estiver inativa. Se a espera durar `slave_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o thread considera a conexão como rompida e tenta reconectar.

* `Waiting for master update`

O estado inicial antes de `Connecting to master`.

* `Waiting for slave mutex on exit`

Um estado que ocorre brevemente quando o thread está parando.

* `Waiting for the slave SQL thread to free enough relay log space`

Você está usando um valor não nulo de `relay_log_space_limit`, e os registros do relé cresceram o suficiente para que seu tamanho combinado exceda esse valor. O thread de E/S está esperando até que o thread SQL libere espaço suficiente ao processar o conteúdo dos registros do relé, para que possa excluir alguns arquivos de registro do relé.

* `Waiting to reconnect after a failed binlog dump request`

Se o pedido de exclusão de registro binário falhou (devido à desconexão), o thread entra nesse estado enquanto dorme, e depois tenta se reconectar periodicamente. O intervalo entre os tentativos pode ser especificado usando a declaração `CHANGE MASTER TO`.

* `Waiting to reconnect after a failed master event read`

Um erro ocorreu durante a leitura (devido à desconexão). O thread fica em espera por o número de segundos definidos pela declaração `CHANGE MASTER TO` (padrão 60) antes de tentar se reconectar.

### 8.14.7 Estados de fila de replicação do SQL Replica

### Descrição
A replicação de estados de fila de replicação do SQL é uma funcionalidade que permite que você replique os estados de fila de replicação de um banco de dados SQL para outro banco de dados SQL. Isso é útil quando você precisa replicar os estados de fila de replicação para uma replica secundária ou para um banco de dados que não está diretamente conectado ao banco de dados principal.

### Como funciona
A replicação de estados de fila de replicação do SQL é executada automaticamente pelo SQL Server. Quando você cria uma replica secundária, o SQL Server replica automaticamente os estados de fila de replicação do banco de dados principal para a replica secundária.

### Requisitos
Para que a replicação de estados de fila de replicação do SQL seja executada, você precisa ter:
- Um banco de dados principal que tenha estados de fila de replicação configurados.
- Um banco de dados secundário que suporte a replicação de estados de fila de replicação.

### Configuração
Para configurar a replicação de estados de fila de replicação do SQL, você pode usar o SQL Server Management Studio (SSMS) ou o SQL Server Configuration Manager.

### Configuração no SSMS
1. Abra o SSMS e conecte-se ao banco de dados principal.
2. Clique em "Replicação" no painel esquerdo.
3. Clique em "Replicação de fila de replicação" no painel esquerdo.
4. Selecione o banco de dados secundário que você deseja replicar.
5. Clique em "Configurar" para configurar os estados de fila de replicação.
6. Clique em "OK" para concluir a configuração.

### Configuração no SQL Server Configuration Manager
1. Abra o SQL Server Configuration Manager.
2. Clique em "Replicação" no painel esquerdo.
3. Clique em "Replicação de fila de replicação" no painel esquerdo.
4. Selecione o banco de dados secundário que você deseja replicar.
5. Clique em "Configurar" para configurar os estados de fila de replicação.
6. Clique em "OK" para concluir a configuração.

### Exemplo
Considere um banco de dados principal chamado "MainDB" e um banco de dados secundário chamado "SecondaryDB". O MainDB tem estados de fila de replicação configurados, e o SecondaryDB é um banco de dados que não está diretamente conectado ao MainDB.

1. Configure o MainDB para replicar os estados de fila de replicação para o SecondaryDB.
2. Configure o SecondaryDB para aceitar

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para um thread de servidor replicado SQL:

* `Making temporary file (append) before replaying LOAD DATA INFILE`

O thread está executando uma declaração `LOAD DATA` e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as strings.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

O thread está executando uma declaração `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê as strings. Esse estado só pode ser encontrado se a declaração original `LOAD DATA` foi registrada por uma fonte que executa uma versão do MySQL inferior a MySQL 5.0.3.

* `Reading event from the relay log`

O thread leu um evento do registro do relé para que o evento possa ser processado.

* `Slave has read all relay log; waiting for more updates`

O thread processou todos os eventos nos arquivos de registro do relé e agora está esperando que o thread de E/S escreva novos eventos no registro do relé.

* `Waiting for an event from Coordinator`

Usando a replica multithread (`slave_parallel_workers` é maior que 1), um dos threads do trabalhador da replica está esperando um evento do thread do coordenador.

* `Waiting for slave mutex on exit`

Um estado muito breve que ocorre quando o thread está parando.

* `Waiting for Slave Workers to free pending events`

Essa ação de espera ocorre quando o tamanho total dos eventos que estão sendo processados pelos Workers excede o tamanho da variável do sistema `slave_pending_jobs_size_max`. O Coordenador retoma a programação quando o tamanho cai abaixo desse limite. Esse estado ocorre apenas quando `slave_parallel_workers` é definido como maior que 0.

* `Waiting for the next event in relay log`

O estado inicial antes de `Reading event from the relay log`.

* `Waiting until MASTER_DELAY seconds after master executed event`

O thread SQL leu um evento, mas está esperando que o atraso da replicação expire. Esse atraso é definido com a opção `MASTER_DELAY` de `CHANGE MASTER TO`.

A coluna `Info` para o thread SQL também pode exibir o texto de uma declaração. Isso indica que o thread leu um evento do registro do relé, extraiu a declaração a partir dele e pode estar executando-a.

### 8.14.8 Estados de Conexão de Replicação do Fila de Conexão da Replica

Estes estados de thread ocorrem em um servidor de replicação, mas estão associados a threads de conexão, não a threads de E/S ou SQL.

* `Changing master`

O thread está processando uma declaração `CHANGE MASTER TO`.

* `Killing slave`

O thread está processando uma declaração `STOP SLAVE`.

* `Opening master dump table`

Esse estado ocorre após `Creating table from master dump`.

* `Reading master dump table data`

Este estado ocorre após `Opening master dump table`.

* `Rebuilding the index on master dump table`

Este estado ocorre após `Reading master dump table data`.

### 8.14.9 Estados de fila de nós do cluster NDB

* `Committing events to binlog`
* `Opening mysql.ndb_apply_status`
* `Processing events`

O thread está processando eventos para registro binário.

* `Processing events from schema table`

O thread está fazendo o trabalho de replicação de esquema.

* `Shutting down`
* `Syncing ndb table schema operation and binlog`

Isso é usado para ter um registro binário correto das operações do esquema para o NDB.

* `Waiting for allowed to take ndbcluster global schema lock`

O thread está esperando permissão para obter um bloqueio de esquema global.

* `Waiting for event from ndbcluster`

O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de cluster.

* `Waiting for first event from ndbcluster`
* `Waiting for ndbcluster binlog update to reach current position`

* `Waiting for ndbcluster global schema lock`

O thread está esperando que um bloqueio de esquema global mantido por outro thread seja liberado.

* `Waiting for ndbcluster to start`
* `Waiting for schema epoch`

O thread está esperando por uma época de esquema (ou seja, um ponto de verificação global).

### 8.14.10 Estados dos threads do cronograma de eventos

Estes estados ocorrem para o thread do Agendamento de Eventos, threads que são criados para executar eventos agendados, ou threads que terminam o agendamento.

* `Clearing`

O thread do agendador ou um thread que estava executando um evento está terminando e está prestes a terminar.

* `Initialized`

O thread do agendador ou um thread que executa um evento foi inicializado.

* `Waiting for next activation`

O agendador tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.

* `Waiting for scheduler to stop`

O thread emitiu `SET GLOBAL event_scheduler=OFF` e está esperando que o agendamento pare.

* `Waiting on empty queue`

A fila de eventos do planejador está vazia e está dormindo.