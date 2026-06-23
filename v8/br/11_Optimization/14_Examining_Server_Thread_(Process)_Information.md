## 10.14 Examinando informações de fio (processo) do servidor

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. Por exemplo:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 5
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

Os threads podem ser mortos com a declaração `KILL`. Veja a Seção 15.7.8.4, “Declaração KILL”.

### 10.14.1 Acessando a Lista de Processos

A discussão a seguir enumera as fontes de informações sobre processos, os privilégios necessários para visualizar informações sobre processos e descreve o conteúdo das entradas da lista de processos.

* Fontes de informações sobre o processo * Privilegios necessários para acessar a lista de processos * Conteúdo das entradas da lista de processos

#### Fontes de Informações sobre o Processo

As informações sobre o processo estão disponíveis nessas fontes:

* A declaração `SHOW PROCESSLIST`: Seção 15.7.7.29, “Declaração SHOW PROCESSLIST”

* O comando **mysqladmin processlist**: Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”

* A tabela `INFORMATION_SCHEMA` `PROCESSLIST`: Seção 28.3.23, “A tabela INFORMATION_SCHEMA PROCESSLIST”

* A tabela do Schema de Desempenho `processlist`: Seção 29.12.21.7, “A tabela processlist”

* Colunas da tabela Schema de desempenho `threads` com nomes que têm um prefixo de `PROCESSLIST_`: Seção 29.12.21.8, “A tabela de fios”

* Os esquemas de `sys` `processlist` e `session`: Seção 30.4.3.22, “O processlist e as vistas x$processlist”, e Seção 30.4.3.33, “A sessão e as vistas x$session”

A tabela `threads` é comparada com `SHOW PROCESSLIST`, `INFORMATION_SCHEMA`, `PROCESSLIST` e **mysqladmin processlist** da seguinte forma:

* O acesso à tabela `threads` não requer um mutex e tem um impacto mínimo no desempenho do servidor. As outras fontes têm consequências negativas de desempenho porque elas requerem um mutex.

Nota

A partir do MySQL 8.0.22, uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela do Gerador de Desempenho `processlist`, que, assim como a tabela `threads`, não requer um mutex e possui melhores características de desempenho. Para detalhes, consulte a Seção 29.12.21.7, “A tabela processlist”.

* A tabela `threads` exibe threads de fundo, que as outras fontes não fazem. Ela também fornece informações adicionais para cada thread que as outras fontes não fornecem, como se a thread é uma thread de primeiro plano ou de fundo, e a localização dentro do servidor associada à thread. Isso significa que a tabela `threads` pode ser usada para monitorar a atividade das threads que as outras fontes não podem.

* Você pode habilitar ou desabilitar o monitoramento de threads do Schema de desempenho, conforme descrito na Seção 29.12.21.8, “A tabela de threads”.

Por essas razões, os DBA que realizam monitoramento de servidores usando uma das outras fontes de informações sobre o thread podem querer monitorar usando a tabela `threads` em vez disso.

A visão `sys` do esquema `processlist` apresenta informações da tabela do Schema de Desempenho `threads` em um formato mais acessível. A visão `sys` do esquema `session` apresenta informações sobre sessões de usuários, como a visão `sys` do esquema `processlist`, mas com processos de fundo filtrados.

#### Privilegios necessários para acessar a lista de processos

Para a maioria das fontes de informações sobre processos, se você tiver o privilégio `PROCESS`, poderá ver todas as threads, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre suas próprias threads, mas não sobre as threads de outros usuários, e os usuários anônimos não têm acesso às informações sobre as threads.

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja a Seção 29.12.21.8, “A tabela de threads”.

#### Conteúdo das entradas da lista de processos

Cada entrada da lista de processos contém várias informações. A lista a seguir descreve essas informações usando as etiquetas do `SHOW PROCESSLIST` de saída. Outras fontes de informações sobre processos usam etiquetas semelhantes.

* `Id` é o identificador de conexão do cliente associado ao thread.

* `User` e `Host` indicam a conta associada ao tópico.

* `db` é o banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `Command` e `State` indicam o que a thread está fazendo.

A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

As seções a seguir listam os possíveis valores de `Command` e os valores de `State` agrupados por categoria. O significado de alguns desses valores é evidente. Para outros, é fornecida uma descrição adicional.

Nota

As aplicações que examinam informações da lista de processos devem estar cientes de que os comandos e os estados estão sujeitos a alterações.

* `Time` indica quanto tempo o fio está em seu estado atual. A noção do fio sobre o tempo atual pode ser alterada em alguns casos: o fio pode alterar o tempo com [[`SET TIMESTAMP = value`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")]. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

* `Info` indica a declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. Para [`SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement")], esse valor contém apenas os primeiros 100 caracteres da declaração. Para ver declarações completas, use [`SHOW FULL PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") (ou consulte uma fonte de informações de processo diferente).

### 10.14.2 Valores dos comandos de fio

Um fio pode ter qualquer um dos seguintes valores `Command`:

* `Binlog Dump`

Este é um fio em uma fonte de replicação para enviar conteúdos de log binário para uma replica.

* `Change user`

O fio está executando uma operação de mudança de usuário.

* `Close stmt`

O fio está fechando uma declaração preparada.

* `Connect`

Utilizado por threads de receptor de replicação conectadas à fonte e por threads de trabalhador de replicação.

* `Connect Out`

Uma réplica está se conectando à sua fonte.

* `Create DB`

O fio está executando uma operação de criação de banco de dados.

* `Daemon`

Este fio é interno ao servidor, não é um fio que atende a uma conexão de cliente.

* `Debug`

O fio está gerando informações de depuração.

* `Delayed insert`

O fio é um manipulador de inserção retardada.

* `Drop DB`

O fio está executando uma operação de drop de banco de dados.

* `Error`
* `Execute`

O fio está executando uma declaração preparada.

* `Fetch`

O fio está obtendo os resultados da execução de uma declaração preparada.

* `Field List`

O fio está obtendo informações para as colunas da tabela.

* `Init DB`

O fio está selecionando um banco de dados padrão.

* `Kill`

O fio está matando outro fio.

* `Long Data`

O fio está recuperando dados longos como resultado da execução de uma declaração preparada.

* `Ping`

O fio está lidando com um pedido de ping do servidor.

* `Prepare`

O fio está preparando uma declaração preparada.

* `Processlist`

O fio está produzindo informações sobre os fios do servidor.

* `Query`

Empregado para clientes usuários enquanto executa consultas por meio de threads de aplicação de replicação de único fio, bem como pelo fio do coordenador de replicação.

* `Quit`

O fio está terminando.

* `Refresh`

O fio está limpando a tabela, os logs ou os caches, ou redefinindo a variável de status ou as informações do servidor de replicação.

* `Register Slave`

O fio está registrando um servidor replica.

* `Reset stmt`

O fio está a redefinir uma declaração preparada.

* `Set option`

O fio está definindo ou redefinindo uma opção de execução de uma declaração do cliente.

* `Shutdown`

O fio está desligando o servidor.

* `Sleep`

O fio está esperando que o cliente envie uma nova declaração para ele.

* `Statistics`

O fio está produzindo informações sobre o status do servidor.

* `Time`

  Unused.

### 10.14.3 Estados gerais de fios

A lista a seguir descreve os valores do fio `State` que estão associados ao processamento de consultas gerais e não a atividades mais especializadas, como a replicação. Muitos desses são úteis apenas para encontrar bugs no servidor.

* `After create`

Isso ocorre quando o thread cria uma tabela (incluindo tabelas temporárias internas), no final da função que cria a tabela. Esse estado é usado mesmo se a tabela não puder ser criada devido a algum erro.

* `altering table`

O servidor está em processo de execução de um `ALTER TABLE` in-place.

* `Analyzing`

O fio está calculando as distribuições de chaves de tabela `MyISAM` (por exemplo, para `ANALYZE TABLE`).

* `checking permissions`

O fio verifica se o servidor tem os privilégios necessários para executar a declaração.

* `Checking table`

O fio está realizando uma operação de verificação de tabela.

* `cleaning up`

O fio processou um comando e está se preparando para liberar memória e redefinir certas variáveis de estado.

* `closing tables`

O fio está apagando os dados da tabela alterada no disco e fechando as tabelas usadas. Isso deve ser uma operação rápida. Se não for, verifique se não tem disco cheio e se o disco não está sendo muito utilizado.

* `committing alter table to storage engine`

O servidor terminou um `ALTER TABLE` in-place e está comprometendo o resultado.

* `converting HEAP to ondisk`

O fio está convertendo uma tabela temporária interna de uma tabela `MEMORY` para uma tabela em disco.

* `copy to tmp table`

O fio está processando uma declaração `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement"). Esse estado ocorre após a tabela com a nova estrutura ter sido criada, mas antes de as linhas serem copiadas nela.

Para um fio nesse estado, o Schema de Desempenho pode ser usado para obter informações sobre o progresso da operação de cópia. Veja a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

* `Copying to group table`

Se uma declaração tiver diferentes critérios de `ORDER BY` e `GROUP BY`, as linhas são ordenadas por grupo e copiadas para uma tabela temporária.

* `Copying to tmp table`

O servidor está copiando para uma tabela temporária na memória.

* `Copying to tmp table on disk`

O servidor está copiando para uma tabela temporária no disco. O conjunto de resultados temporário tornou-se muito grande (veja Seção 10.4.4, "Uso de tabela temporária interna no MySQL"). Consequentemente, o thread está alterando a tabela temporária do formato de memória para o formato baseado em disco para economizar memória.

* `Creating index`

O fio está processando `ALTER TABLE ... ENABLE KEYS` para uma tabela `MyISAM`.

* `Creating sort index`

O fio está processando um `SELECT` que é resolvido usando uma tabela temporária interna.

* `creating table`

O fio está criando uma tabela. Isso inclui a criação de tabelas temporárias.

* `Creating tmp table`

O fio está criando uma tabela temporária na memória ou em disco. Se a tabela for criada na memória, mas posteriormente convertida em uma tabela em disco, o estado durante essa operação é `Copying to tmp table on disk`.

* `deleting from main table`

O servidor está executando a primeira parte de uma exclusão de múltiplas tabelas. Ele está excluindo apenas da primeira tabela e salvando as colunas e deslocamentos a serem usados para excluir das outras (tabelas de referência).

* `deleting from reference tables`

O servidor está executando a segunda parte de uma exclusão de múltiplas tabelas e excluindo as linhas correspondentes das outras tabelas.

* `discard_or_import_tablespace`

O fio está processando uma declaração `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.

* `end`

Isso ocorre no final, mas antes da limpeza das declarações de `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

Para o estado `end`, as seguintes operações poderiam estar acontecendo:

+ Escrever um evento no log binário
+ Liberar buffers de memória, incluindo para blobs
* `executing`

O fio começou a executar uma declaração.

* `Execution of init_command`

O fio está executando declarações no valor da variável de sistema `init_command`.

* `freeing items`

O fio executou um comando. Esse estado é geralmente seguido por `cleaning up`.

* `FULLTEXT initialization`

O servidor está se preparando para realizar uma pesquisa de texto completo em linguagem natural.

* `init`

Isso ocorre antes da inicialização das declarações `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações realizadas pelo servidor neste estado incluem o esvaziamento do log binário e do log `InnoDB`.

* `Killed`

Alguém enviou uma declaração `KILL` para o tópico e ela deve abortar na próxima vez que verificar a bandeira de interrupção. A bandeira é verificada em cada grande laço no MySQL, mas, em alguns casos, ainda pode levar um curto período de tempo para o tópico morrer. Se o tópico for bloqueado por outro tópico, a interrupção entra em vigor assim que o outro tópico libera seu bloqueio.

* `Locking system tables`

O fio está tentando bloquear uma tabela do sistema (por exemplo, um fuso horário ou uma tabela de registro).

* `logging slow query`

O thread está escrevendo uma declaração no log de consulta lenta.

* `login`

O estado inicial de um fio de conexão até que o cliente tenha sido autenticado com sucesso.

* `manage keys`

O servidor está habilitando ou desabilitando um índice de tabela.

* `Opening system tables`

O fio está tentando abrir uma tabela do sistema (por exemplo, um fuso horário ou uma tabela de registro).

* `Opening tables`

O fio está tentando abrir uma tabela. Este deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma declaração `ALTER TABLE` ou `LOCK TABLE`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") pode impedir a abertura de uma tabela até que a declaração seja concluída. Também vale a pena verificar se o seu valor `table_open_cache` é grande o suficiente.

Para as tabelas do sistema, o estado `Opening system tables` é usado em vez disso.

* `optimizing`

O servidor está realizando otimizações iniciais para uma consulta.

* `preparing`

Esse estado ocorre durante a otimização da consulta.

* `preparing for alter table`

O servidor está se preparando para executar um `ALTER TABLE` in-place.

* `Purging old relay logs`

O fio está removendo arquivos de registro de relé desnecessários.

* `query end`

Esse estado ocorre após o processamento de uma consulta, mas antes do estado `freeing items`.

* `Receiving from client`

O servidor está lendo um pacote do cliente.

* `Removing duplicates`

A consulta estava usando `SELECT DISTINCT`(select.html "15.2.13 SELECT Statement") de tal forma que o MySQL não conseguia otimizar a operação distinta em uma fase inicial. Por isso, o MySQL requer uma etapa extra para remover todas as linhas duplicadas antes de enviar o resultado ao cliente.

* `removing tmp table`

O fio está removendo uma tabela temporária interna após o processamento de uma declaração `SELECT`. Esse estado não é usado se nenhuma tabela temporária foi criada.

* `rename`

O fio está renomeando uma tabela.

* `rename result table`

O fio está processando uma declaração `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), criou a nova tabela e está renomeando-a para substituir a tabela original.

* `Reopen tables`

O fio obteve um bloqueio para a tabela, mas percebeu, após obter o bloqueio, que a estrutura subjacente da tabela havia mudado. Ele liberou o bloqueio, fechou a tabela e está tentando reabri-la.

* `Repair by sorting`

O código de reparo está usando uma classificação para criar índices.

* `Repair done`

O fio concluiu uma reparação multifilamentar para uma tabela `MyISAM`.

* `Repair with keycache`

O código de reparo está usando a criação de chaves uma por uma através do cache de chaves. Isso é muito mais lento do que `Repair by sorting`.

* `Rolling back`

O fio está revertendo uma transação.

* `Saving state`

Para operações de tabela `MyISAM`, como reparo ou análise, o fio está salvando o novo estado da tabela no cabeçalho do arquivo [[`.MYI`]. O estado inclui informações como o número de linhas, o contador `AUTO_INCREMENT` e as distribuições de chaves.

* `Searching rows for update`

O fio está realizando uma primeira fase para encontrar todas as linhas correspondentes antes de as atualizar. Isso deve ser feito se o `UPDATE` estiver alterando o índice que é usado para encontrar as linhas envolvidas.

* `Sending data`

*Antes do MySQL 8.0.17*: O fio está lendo e processando linhas para uma declaração `SELECT`, e enviando dados ao cliente. Como as operações que ocorrem durante este estado tendem a realizar grandes quantidades de acesso ao disco (leitura), é frequentemente o estado com maior duração ao longo da vida de uma consulta específica. *MySQL 8.0.17 e posterior*: Este estado não é mais indicado separadamente, mas sim incluído no estado `Executing`.

* `Sending to client`

O servidor está escrevendo um pacote para o cliente.

* `setup`

O fio está começando uma operação [[`ALTER TABLE`][(alter-table.html "15.1.9 ALTER TABLE Statement")]].

* `Sorting for group`

O fio está fazendo uma espécie de `GROUP BY`.

* `Sorting for order`

O fio está fazendo uma espécie de `ORDER BY`.

* `Sorting index`

O índice de fios está classificando as páginas de índice para acesso mais eficiente durante uma operação de otimização de tabela `MyISAM`.

* `Sorting result`

Para uma declaração `SELECT`, isso é semelhante a `Creating sort index`, mas para tabelas não temporárias.

* `starting`

A primeira etapa no início da execução da declaração.

* `statistics`

O servidor está calculando estatísticas para desenvolver um plano de execução de consulta. Se um thread estiver nesse estado por um longo período, o servidor provavelmente está vinculado ao disco, realizando outro trabalho.

* `System lock`

O fio foi chamado de `mysql_lock_tables()` e o estado do fio não foi atualizado desde então. Esse é um estado muito geral que pode ocorrer por muitas razões.

Por exemplo, o fio vai solicitar ou está aguardando uma bloqueio interno ou externo para a tabela. Isso pode ocorrer quando o `InnoDB` aguarda um bloqueio de nível de tabela durante a execução do `LOCK TABLES`. Se este estado está sendo causado por solicitações de bloqueios externos e você não está usando vários servidores **mysqld** que estão acessando as mesmas tabelas `MyISAM`, você pode desabilitar os bloqueios de sistema externos com a opção `--skip-external-locking`. No entanto, o bloqueio externo é desativado por padrão, então é provável que esta opção não tenha efeito. Para o `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não aguardando por ele).

Para as tabelas do sistema, o estado `Locking system tables` é usado em vez disso.

* `update`

O fio está se preparando para começar a atualizar a tabela.

* `Updating`

O fio está procurando linhas para atualizar e as está atualizando.

* `updating main table`

O servidor está executando a primeira parte de uma atualização de várias tabelas. Ele está atualizando apenas a primeira tabela e salvando as colunas e deslocamentos a serem usados para atualizar as outras (referência) tabelas.

* `updating reference tables`

O servidor está executando a segunda parte de uma atualização de várias tabelas e atualizando as linhas correspondentes das outras tabelas.

* `User lock`

O fio vai solicitar ou está esperando por um bloqueio de aconselhamento solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não esperando por ele).

* `User sleep`

O fio invocou uma chamada `SLEEP()`.

* `Waiting for commit lock`

`FLUSH TABLES WITH READ LOCK` está esperando por um bloqueio de commit.

* `waiting for handler commit`

O fio está esperando por uma transação para ser confirmada em relação a outras partes do processamento de consulta.

* `Waiting for tables`

O fio recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e que ele precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

* `Waiting for table flush`

O fio está executando `FLUSH TABLES` e está esperando que todos os fios fechem suas tabelas, ou o fio recebeu uma notificação de que a estrutura subjacente para uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

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

Para informações sobre indicadores de bloqueio de tabela, consulte a Seção 10.11.1, “Métodos de bloqueio interno”. Para informações sobre bloqueio de metadados, consulte a Seção 10.11.4, “Bloqueio de metadados”. Para ver quais bloqueios estão bloqueando solicitações de bloqueio, use as tabelas de bloqueio do Schema de desempenho descritas na Seção 29.12.13, “Tabelas de bloqueio do Schema de desempenho”.

* `Waiting on cond`

Um estado genérico em que o fio está esperando que uma condição se torne verdadeira. Não há informações específicas sobre o estado disponíveis.

* `Writing to net`

O servidor está escrevendo um pacote na rede.

### 10.14.4 Estados de fios de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para o fio `Binlog Dump` da fonte de replicação. Se você não ver nenhuma `Binlog Dump` em uma fonte, isso significa que a replicação não está em execução; ou seja, que nenhuma réplica está conectada atualmente.

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes dos instrumentos, incluindo os nomes das etapas de thread, contendo os termos “master”, que é alterado para “source”, “slave”, que é alterado para “replica”, e “mts” (para “multithreaded slave”), que é alterado para “mta” (para “multithreaded applier”). As ferramentas de monitoramento que trabalham com esses nomes de instrumentos podem ser afetadas. Se as alterações incompatíveis tiverem impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais, ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consulta lenta contém as versões antigas dos nomes.

* `Finished reading one binlog; switching to next binlog`

O fio terminou de ler um arquivo de registro binário e está abrindo o próximo para enviar para a replica.

* `Master has sent all binlog to slave; waiting for more updates`

De MySQL 8.0.26: `Source has sent all binlog to replica; waiting for more updates`

O fio leu todas as atualizações restantes dos logs binários e as enviou para a replica. O fio agora está parado, esperando que novos eventos apareçam no log binário resultantes de novas atualizações ocorrendo na fonte.

* `Sending binlog event to slave`

De MySQL 8.0.26: `Sending binlog event to replica`

Os logs binários consistem em *eventos*, onde um evento é geralmente uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando-o para a replica.

* `Waiting to finalize termination`

Um estado muito breve que ocorre quando o fio está parando.

### 10.14.5 Estados de Threads de I/O de Replicação (Receptor)

A lista a seguir mostra os estados mais comuns que você vê na coluna `State` para uma thread de I/O de replicação (receptor) em um servidor de replicação. Esse estado também aparece na coluna `Replica_IO_State` exibida por `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") (ou antes do MySQL 8.0.22, `SHOW REPLICA STATUS`[[(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement")]), para que você possa ter uma boa visão do que está acontecendo usando essa declaração.

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes dos instrumentos, incluindo os nomes das etapas de thread, contendo os termos “master”, que é alterado para “source”, “slave”, que é alterado para “replica”, e “mts” (para “multithreaded slave”), que é alterado para “mta” (para “multithreaded applier”). As ferramentas de monitoramento que trabalham com esses nomes de instrumentos podem ser afetadas. Se as alterações incompatíveis tiverem impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais, ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consulta lenta contém as versões antigas dos nomes.

* `Checking master version`

De MySQL 8.0.26: `Checking source version`

Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

* `Connecting to master`

De MySQL 8.0.26: `Connecting to source`

O fio está tentando se conectar à fonte.

* `Queueing master event to the relay log`

De MySQL 8.0.26: `Queueing source event to the relay log`

O fio leu um evento e está copiando-o para o log do relé para que o fio SQL possa processá-lo.

* `Reconnecting after a failed binlog dump request`

O fio está tentando se reconectar à fonte.

* `Reconnecting after a failed master event read`

De MySQL 8.0.26: `Reconnecting after a failed source event read`

O fio está tentando se reconectar à fonte. Quando a conexão é estabelecida novamente, o estado se torna `Waiting for master to send event`.

* `Registering slave on master`

De MySQL 8.0.26: `Registering replica on source`

Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

* `Requesting binlog dump`

Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte uma solicitação dos conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.

* `Waiting for its turn to commit`

Um estado que ocorre quando o fio de replicação está esperando que os fios de trabalhadores mais antigos se comprometam se `replica_preserve_commit_order` ou `slave_preserve_commit_order` estiverem habilitados.

* `Waiting for master to send event`

De MySQL 8.0.26: `Waiting for source to send event`

O fio se conectou à fonte e está esperando por eventos de registro binário chegar. Isso pode durar um longo tempo se a fonte estiver inativa. Se a espera durar `replica_net_timeout` ou `slave_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o fio considera a conexão como rompida e tenta reconectar.

* `Waiting for master update`

De MySQL 8.0.26: `Waiting for source update`

O estado inicial antes de `Connecting to master` ou `Connecting to source`.

* `Waiting for slave mutex on exit`

De MySQL 8.0.26: `Waiting for replica mutex on exit`

Um estado que ocorre brevemente quando o fio está parando.

* `Waiting for the slave SQL thread to free enough relay log space`

De MySQL 8.0.26: `Waiting for the replica SQL thread to free enough relay log space`

Você está usando um valor não nulo de `relay_log_space_limit`, e os registros do relé cresceram o suficiente para que seu tamanho combinado exceda esse valor. O thread de I/O (receptor) está esperando até que o thread SQL (aplicador) libere espaço suficiente, processando o conteúdo dos registros do relé, para que possa excluir alguns arquivos de registro do relé.

* `Waiting to reconnect after a failed binlog dump request`

Se o pedido de exclusão de registro binário falhou (devido à desconexão), o thread entra neste estado enquanto dorme, e depois tenta se reconectar periodicamente. O intervalo entre os tentativas pode ser especificado usando a declaração `CHANGE REPLICATION SOURCE TO` (de MySQL 8.0.23) ou a declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes de MySQL 8.0.23).

* `Waiting to reconnect after a failed master event read`

De MySQL 8.0.26: `Waiting to reconnect after a failed source event read`

Um erro ocorreu durante a leitura (devido à desconexão). O fio está dormindo por o número de segundos definido pela declaração `CHANGE REPLICATION SOURCE TO` (de MySQL 8.0.23) ou pela declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes de MySQL 8.0.23), que tem como padrão 60, antes de tentar se reconectar.

### 10.14.6 Estados de fila de threads de replicação SQL

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para um fio de SQL de replicação em um servidor de replicação.

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes dos instrumentos, incluindo os nomes das etapas de thread, contendo os termos “master”, que é alterado para “source”, “slave”, que é alterado para “replica”, e “mts” (para “multithreaded slave”), que é alterado para “mta” (para “multithreaded applier”). As ferramentas de monitoramento que trabalham com esses nomes de instrumentos podem ser afetadas. Se as alterações incompatíveis tiverem impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais, ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consulta lenta contém as versões antigas dos nomes.

* `Making temporary file (append) before replaying LOAD DATA INFILE`

O fio está executando uma declaração `LOAD DATA` (load-data.html "15.2.9 LOAD DATA Statement") e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

O fio está executando uma declaração `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê as linhas. Esse estado só pode ser encontrado se a declaração original `LOAD DATA` foi registrada por uma fonte que executa uma versão do MySQL inferior a MySQL 5.0.3.

* `Reading event from the relay log`

O fio leu um evento do registro do relé para que o evento possa ser processado.

* `Slave has read all relay log; waiting for more updates`

De MySQL 8.0.26: `Replica has read all relay log; waiting for more updates`

O fio processou todos os eventos nos arquivos de registro do relé e agora está esperando que o fio de I/O (receptor) escreva novos eventos no registro do relé.

* `Waiting for an event from Coordinator`

Se o uso da replica multithread (`replica_parallel_workers` ou `slave_parallel_workers` for maior que 1), um dos threads do trabalhador da replica está esperando um evento do thread do coordenador.

* `Waiting for slave mutex on exit`

De MySQL 8.0.26: `Waiting for replica mutex on exit`

Um estado muito breve que ocorre quando o fio está parando.

* `Waiting for Slave Workers to free pending events`

De MySQL 8.0.26: `Waiting for Replica Workers to free pending events`

Essa ação de espera ocorre quando o tamanho total dos eventos que estão sendo processados pelos Workers excede o tamanho da variável de sistema `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max`. O Coordenador retoma a programação quando o tamanho cai abaixo desse limite. Esse estado ocorre apenas quando `replica_parallel_workers` ou `slave_parallel_workers` é definido maior que 0.

* `Waiting for the next event in relay log`

O estado inicial antes de `Reading event from the relay log`.

* `Waiting until MASTER_DELAY seconds after master executed event`

De MySQL 8.0.26: `Waiting until SOURCE_DELAY seconds after master executed event`

O fio SQL leu um evento, mas está esperando que o atraso da replicação expire. Esse atraso é definido com a opção `SOURCE_DELAY` | `MASTER_DELAY` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23).

A coluna `Info` para o fio SQL também pode exibir o texto de uma declaração. Isso indica que o fio leu um evento do registro do relé, extraiu a declaração a partir dele e pode estar executando-a.

### 10.14.7 Estados dos fios de conexão de replicação

Estes estados de fio ocorrem em um servidor de replicação, mas estão associados a threads de conexão, não a threads de E/S ou SQL.

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes dos instrumentos, incluindo os nomes das etapas de thread, contendo os termos “master”, que é alterado para “source”, “slave”, que é alterado para “replica”, e “mts” (para “multithreaded slave”), que é alterado para “mta” (para “multithreaded applier”). As ferramentas de monitoramento que trabalham com esses nomes de instrumentos podem ser afetadas. Se as alterações incompatíveis tiverem impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais, ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consulta lenta contém as versões antigas dos nomes.

* `Changing master`

De MySQL 8.0.26: `Changing replication source`

O fio está processando uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23).

* `Killing slave`

O fio está processando uma declaração `STOP REPLICA`.

* `Opening master dump table`

Este estado ocorre após `Creating table from master dump`.

* `Reading master dump table data`

Este estado ocorre após `Opening master dump table`.

* `Rebuilding the index on master dump table`

Este estado ocorre após `Reading master dump table data`.

### 10.14.8 Estados de fila de nós do NDB Cluster

* `Committing events to binlog`
* `Opening mysql.ndb_apply_status`
* `Processing events`

O fio está processando eventos para registro binário.

* `Processing events from schema table`

O fio está fazendo o trabalho de replicação de esquema.

* `Shutting down`
* `Syncing ndb table schema operation and binlog`

Isso é usado para ter um registro binário correto das operações do esquema para o NDB.

* `Waiting for allowed to take ndbcluster global schema lock`

O fio está esperando permissão para obter um bloqueio de esquema global.

* `Waiting for event from ndbcluster`

O servidor está atuando como um nó SQL em um NDB Cluster e está conectado a um nó de gerenciamento de cluster.

* `Waiting for first event from ndbcluster`
* `Waiting for ndbcluster binlog update to reach current position`

* `Waiting for ndbcluster global schema lock`

O fio está esperando que um bloqueio de esquema global mantido por outro fio seja liberado.

* `Waiting for ndbcluster to start`
* `Waiting for schema epoch`

O fio está esperando por uma época de esquema (ou seja, um ponto de verificação global).

### 10.14.9 Estados dos fios do cronograma de eventos

Estes estados ocorrem para o fio do Agendamento de Eventos, fios que são criados para executar eventos agendados, ou fios que terminam o agendamento.

* `Clearing`

O fio do agendador ou um fio que estava executando um evento está terminando e está prestes a terminar.

* `Initialized`

O fio do agendador ou um fio que executa um evento foi inicializado.

* `Waiting for next activation`

O agendador tem uma fila de eventos não vazia, mas a próxima ativação está no futuro.

* `Waiting for scheduler to stop`

O fio emitiu `SET GLOBAL event_scheduler=OFF` e está esperando que o agendamento pare.

* `Waiting on empty queue`

A fila de eventos do planejador está vazia e está dormindo.