### 8.14.3 Estados Gerais de Thread

A lista a seguir descreve os valores de `State` da thread que estão associados ao processamento geral de Query e não a atividades mais especializadas, como Replication. Muitos destes são úteis apenas para encontrar bugs no server.

* `After create`

  Isso ocorre quando a thread cria uma Table (incluindo temporary tables internas), no final da função que cria a Table. Este estado é usado mesmo que a Table não possa ser criada devido a algum erro.

* `altering table`

  O server está em processo de execução de um `ALTER TABLE` in-place.

* `Analyzing`

  A thread está calculando distribuições de Key de Table `MyISAM` (por exemplo, para `ANALYZE TABLE`).

* `checking permissions`

  A thread está verificando se o server tem os privilégios necessários para executar a Statement.

* `Checking table`

  A thread está realizando uma operação de verificação de Table.

* `cleaning up`

  A thread processou um comando e está se preparando para liberar memória e redefinir certas system variables de estado.

* `committing alter table to storage engine`

  O server terminou um `ALTER TABLE` in-place e está fazendo o Commit do resultado.

* `closing tables`

  A thread está descarregando (flushing) os dados da Table alterada para o disco e fechando as Tables usadas. Esta deve ser uma operação rápida. Caso contrário, verifique se você não tem um disco cheio e se o disco não está sendo usado de forma muito intensa.

* `converting HEAP to ondisk`

  A thread está convertendo uma temporary table interna de uma Table `MEMORY` para uma Table em disco (on-disk).

* `copy to tmp table`

  A thread está processando uma Statement `ALTER TABLE`. Este estado ocorre depois que a Table com a nova estrutura foi criada, mas antes que as linhas sejam copiadas para ela.

  Para uma thread neste estado, o Performance Schema pode ser usado para obter informações sobre o progresso da operação de cópia. Consulte Seção 25.12.5, “Performance Schema Stage Event Tables”.

* `Copying to group table`

  Se uma Statement tiver critérios `ORDER BY` e `GROUP BY` diferentes, as linhas são ordenadas por grupo e copiadas para uma temporary table.

* `Copying to tmp table`

  O server está copiando para uma temporary table na memória.

* `Copying to tmp table on disk`

  O server está copiando para uma temporary table no disco. O temporary result set ficou muito grande (consulte Seção 8.4.4, “Internal Temporary Table Use in MySQL”). Consequentemente, a thread está mudando a temporary table do formato em memória para o formato baseado em disco para economizar memória.

* `Creating index`

  A thread está processando `ALTER TABLE ... ENABLE KEYS` para uma Table `MyISAM`.

* `Creating sort index`

  A thread está processando uma `SELECT` que é resolvida usando uma temporary table interna.

* `creating table`

  A thread está criando uma Table. Isso inclui a criação de temporary tables.

* `Creating tmp table`

  A thread está criando uma temporary table na memória ou no disco. Se a Table for criada na memória, mas for convertida posteriormente em uma Table em disco, o estado durante essa operação será `Copying to tmp table on disk`.

* `deleting from main table`

  O server está executando a primeira parte de um Delete de múltiplas Tables. Ele está excluindo apenas da primeira Table e salvando colunas e offsets a serem usados para a exclusão das outras Tables (de referência).

* `deleting from reference tables`

  O server está executando a segunda parte de um Delete de múltiplas Tables e excluindo as linhas correspondentes das outras Tables.

* `discard_or_import_tablespace`

  A thread está processando uma Statement `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.

* `end`

  Isso ocorre no final, mas antes da limpeza das Statements `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

  Para o estado `end`, as seguintes operações podem estar ocorrendo:

  + Remoção de entradas do Query Cache após a alteração dos dados em uma Table
  + Escrita de um evento no Binary Log
  + Liberação de memory buffers, inclusive para blobs
* `executing`

  A thread começou a executar uma Statement.

* `Execution of init_command`

  A thread está executando Statements no valor da system variable `init_command`.

* `freeing items`

  A thread executou um comando. Algumas liberações de itens feitas durante este estado envolvem o Query Cache. Este estado é geralmente seguido por `cleaning up`.

* `FULLTEXT initialization`

  O server está se preparando para realizar uma busca Full-Text em linguagem natural.

* `init`

  Isso ocorre antes da inicialização das Statements `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações tomadas pelo server neste estado incluem flushing do Binary Log, do log do `InnoDB` e algumas operações de limpeza do Query Cache.

* `Killed`

  Alguém enviou uma Statement `KILL` para a thread, e ela deve ser abortada na próxima vez que verificar a flag de kill. A flag é verificada em cada loop principal no MySQL, mas em alguns casos, ainda pode levar um curto período para que a thread morra. Se a thread estiver bloqueada por alguma outra thread, o kill entra em vigor assim que a outra thread liberar seu Lock.

* `logging slow query`

  A thread está escrevendo uma Statement no Slow-Query Log.

* `login`

  O estado inicial para uma thread de conexão até que o cliente tenha sido autenticado com sucesso.

* `manage keys`

  O server está habilitando ou desabilitando um Table Index.

* `Opening tables`

  A thread está tentando abrir uma Table. Este deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma Statement `ALTER TABLE` ou `LOCK TABLE` pode impedir a abertura de uma Table até que a Statement seja concluída. Também vale a pena verificar se o valor de `table_open_cache` é grande o suficiente.

* `optimizing`

  O server está realizando otimizações iniciais para uma Query.

* `preparing`

  Este estado ocorre durante a otimização da Query.

* `preparing for alter table`

  O server está se preparando para executar um `ALTER TABLE` in-place.

* `Purging old relay logs`

  A thread está removendo arquivos de Relay Log desnecessários.

* `query end`

  Este estado ocorre após o processamento de uma Query, mas antes do estado `freeing items`.

* `Receiving from client`

  O server está lendo um packet do cliente. Este estado era chamado `Reading from net` antes do MySQL 5.7.8.

* `Removing duplicates`

  A Query estava usando `SELECT DISTINCT` de tal forma que o MySQL não conseguiu otimizar a operação Distinct em um estágio inicial. Por causa disso, o MySQL requer um estágio extra para remover todas as linhas duplicadas antes de enviar o resultado para o cliente.

* `removing tmp table`

  A thread está removendo uma temporary table interna após processar uma Statement `SELECT`. Este estado não é usado se nenhuma temporary table foi criada.

* `rename`

  A thread está renomeando uma Table.

* `rename result table`

  A thread está processando uma Statement `ALTER TABLE`, criou a nova Table e está renomeando-a para substituir a Table original.

* `Reopen tables`

  A thread obteve um Lock para a Table, mas percebeu após obter o Lock que a estrutura subjacente da Table mudou. Ela liberou o Lock, fechou a Table e está tentando reabri-la.

* `Repair by sorting`

  O código de Repair está usando um sort para criar Indexes.

* `Repair done`

  A thread concluiu um Repair multithreaded para uma Table `MyISAM`.

* `Repair with keycache`

  O código de Repair está criando Keys uma por uma através do Key Cache. Isso é muito mais lento do que `Repair by sorting`.

* `Rolling back`

  A thread está fazendo Rollback de uma Transaction.

* `Saving state`

  Para operações de Table `MyISAM`, como Repair ou Analysis, a thread está salvando o novo estado da Table no cabeçalho do arquivo `.MYI`. O estado inclui informações como número de linhas, o contador `AUTO_INCREMENT` e distribuições de Key.

* `Searching rows for update`

  A thread está realizando uma primeira fase para encontrar todas as linhas correspondentes antes de atualizá-las. Isso deve ser feito se o `UPDATE` estiver alterando o Index usado para encontrar as linhas envolvidas.

* `Sending data`

  A thread está lendo e processando linhas para uma Statement `SELECT` e enviando dados para o cliente. Como as operações que ocorrem durante este estado tendem a realizar grandes quantidades de acesso ao disco (reads), geralmente é o estado de execução mais longo durante a vida útil de uma determinada Query.

* `Sending to client`

  O server está escrevendo um packet para o cliente. Este estado era chamado `Writing to net` antes do MySQL 5.7.8.

* `setup`

  A thread está começando uma operação `ALTER TABLE`.

* `Sorting for group`

  A thread está realizando um sort para satisfazer um `GROUP BY`.

* `Sorting for order`

  A thread está realizando um sort para satisfazer um `ORDER BY`.

* `Sorting index`

  A thread está ordenando páginas de Index para um acesso mais eficiente durante uma operação de otimização de Table `MyISAM`.

* `Sorting result`

  Para uma Statement `SELECT`, isso é semelhante a `Creating sort index`, mas para Tables não temporárias.

* `starting`

  O primeiro estágio no início da execução da Statement.

* `statistics`

  O server está calculando estatísticas para desenvolver um plano de execução de Query. Se uma thread estiver neste estado por muito tempo, o server provavelmente está sobrecarregado pelo disco (disk-bound) executando outro trabalho.

* `System lock`

  A thread chamou `mysql_lock_tables()` e o estado da thread não foi atualizado desde então. Este é um estado muito geral que pode ocorrer por diversos motivos.

  Por exemplo, a thread está prestes a solicitar ou está esperando por um System Lock interno ou externo para a Table. Isso pode ocorrer quando o `InnoDB` espera por um Lock de nível de Table durante a execução de `LOCK TABLES`. Se este estado estiver sendo causado por solicitações de Locks externos e você não estiver usando múltiplos servers **mysqld** que acessam as mesmas Tables `MyISAM`, você pode desabilitar os System Locks externos com a opção `--skip-external-locking`. No entanto, o Locking externo está desabilitado por padrão, então é provável que esta opção não tenha efeito. Para `SHOW PROFILE`, este estado significa que a thread está solicitando o Lock (não esperando por ele).

* `update`

  A thread está se preparando para começar a atualizar a Table.

* `Updating`

  A thread está buscando linhas para atualizar e as está atualizando.

* `updating main table`

  O server está executando a primeira parte de um Update de múltiplas Tables. Ele está atualizando apenas a primeira Table e salvando colunas e offsets a serem usados para a atualização das outras Tables (de referência).

* `updating reference tables`

  O server está executando a segunda parte de um Update de múltiplas Tables e atualizando as linhas correspondentes das outras Tables.

* `User lock`

  A thread está prestes a solicitar ou está esperando por um Lock consultivo (advisory lock) solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que a thread está solicitando o Lock (não esperando por ele).

* `User sleep`

  A thread invocou uma chamada `SLEEP()`.

* `Waiting for commit lock`

  `FLUSH TABLES WITH READ LOCK` está esperando por um Lock de Commit.

* `Waiting for global read lock`

  `FLUSH TABLES WITH READ LOCK` está esperando por um Global Read Lock, ou a system variable global `read_only` está sendo definida.

* `Waiting for tables`

  A thread recebeu uma notificação de que a estrutura subjacente de uma Table mudou e precisa reabrir a Table para obter a nova estrutura. No entanto, para reabrir a Table, ela deve esperar até que todas as outras threads tenham fechado a Table em questão.

  Esta notificação ocorre se outra thread usou `FLUSH TABLES` ou uma das seguintes Statements na Table em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, ou `OPTIMIZE TABLE`.

* `Waiting for table flush`

  A thread está executando `FLUSH TABLES` e está esperando que todas as threads fechem suas Tables, ou a thread recebeu uma notificação de que a estrutura subjacente de uma Table mudou e precisa reabrir a Table para obter a nova estrutura. No entanto, para reabrir a Table, ela deve esperar até que todas as outras threads tenham fechado a Table em questão.

  Esta notificação ocorre se outra thread usou `FLUSH TABLES` ou uma das seguintes Statements na Table em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, ou `OPTIMIZE TABLE`.

* `Waiting for lock_type lock`

  O server está esperando para adquirir um Lock `THR_LOCK` ou um Lock do subsistema de metadata locking, onde *`lock_type`* indica o tipo de Lock.

  Este estado indica uma espera por um `THR_LOCK`:

  + `Waiting for table level lock`

  Estes estados indicam uma espera por um Metadata Lock:

  + `Waiting for event metadata lock`
  + `Waiting for global read lock`
  + `Waiting for schema metadata lock`
  + `Waiting for stored function metadata lock`
  + `Waiting for stored procedure metadata lock`
  + `Waiting for table metadata lock`
  + `Waiting for trigger metadata lock`

  Para obter informações sobre indicadores de Table Lock, consulte Seção 8.11.1, “Internal Locking Methods”. Para obter informações sobre Metadata Locking, consulte Seção 8.11.4, “Metadata Locking”. Para ver quais Locks estão bloqueando as solicitações de Lock, use as Performance Schema Lock Tables descritas na Seção 25.12.12, “Performance Schema Lock Tables”.

* `Waiting on cond`

  Um estado genérico no qual a thread está esperando que uma condição se torne verdadeira. Nenhuma informação de estado específica está disponível.

* `Writing to net`

  O server está escrevendo um packet para a rede. Este estado é chamado `Sending to client` a partir do MySQL 5.7.8.