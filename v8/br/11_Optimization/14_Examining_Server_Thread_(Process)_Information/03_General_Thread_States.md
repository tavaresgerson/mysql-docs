### 10.14.3 Estados gerais de fios

A lista a seguir descreve os valores da rosca `State` que estão associados ao processamento de consultas gerais e não a atividades mais especializadas, como a replicação. Muitos deles são úteis apenas para encontrar erros no servidor.

- `After create`

  Isso ocorre quando o fio cria uma tabela (incluindo tabelas temporárias internas), no final da função que cria a tabela. Esse estado é usado mesmo se a tabela não puder ser criada devido a algum erro.

- `altering table`

  O servidor está em processo de execução de um `ALTER TABLE` in-place.

- `Analyzing`

  O fio está calculando as distribuições de chaves da tabela `MyISAM` (por exemplo, para `ANALYZE TABLE`).

- `checking permissions`

  O fio está verificando se o servidor tem os privilégios necessários para executar a declaração.

- `Checking table`

  O fio está realizando uma operação de verificação de tabela.

- `cleaning up`

  O fio processou um comando e está se preparando para liberar memória e reiniciar certas variáveis de estado.

- `closing tables`

  O fio está descarregando os dados da tabela alterados no disco e fechando as tabelas usadas. Isso deve ser uma operação rápida. Se não for, verifique se não há disco cheio e se o disco não está sendo muito utilizado.

- `committing alter table to storage engine`

  O servidor terminou uma `ALTER TABLE` no local e está commitando o resultado.

- `converting HEAP to ondisk`

  O fio está convertendo uma tabela temporária interna de uma tabela `MEMORY` para uma tabela em disco.

- `copy to tmp table`

  O fio está processando uma declaração `ALTER TABLE`. Esse estado ocorre após a tabela com a nova estrutura ter sido criada, mas antes de as linhas serem copiadas nela.

  Para um fio nesse estado, o Schema de Desempenho pode ser usado para obter informações sobre o progresso da operação de cópia. Veja a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

- `Copying to group table`

  Se uma declaração tiver diferentes critérios `ORDER BY` e `GROUP BY`, as linhas são ordenadas por grupo e copiadas para uma tabela temporária.

- `Copying to tmp table`

  O servidor está copiando para uma tabela temporária na memória.

- `Copying to tmp table on disk`

  O servidor está copiando para uma tabela temporária no disco. O conjunto de resultados temporário tornou-se muito grande (veja a Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”). Consequentemente, o thread está alterando a tabela temporária do formato de memória para o formato baseado em disco para economizar memória.

- `Creating index`

  O fio está processando `ALTER TABLE ... ENABLE KEYS` para uma tabela `MyISAM`.

- `Creating sort index`

  O fio está processando um `SELECT` que é resolvido usando uma tabela temporária interna.

- `creating table`

  O fio está criando uma tabela. Isso inclui a criação de tabelas temporárias.

- `Creating tmp table`

  O fio está criando uma tabela temporária na memória ou no disco. Se a tabela for criada na memória, mas posteriormente convertida em uma tabela no disco, o estado durante essa operação é `Copying to tmp table on disk`.

- `deleting from main table`

  O servidor está executando a primeira parte de uma exclusão de múltiplas tabelas. Ele está excluindo apenas da primeira tabela e salvando as colunas e deslocamentos a serem usados para excluir das outras tabelas (referência).

- `deleting from reference tables`

  O servidor está executando a segunda parte de uma exclusão de múltiplas tabelas e excluindo as linhas correspondentes das outras tabelas.

- `discard_or_import_tablespace`

  O fio está processando uma declaração `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.

- `end`

  Isso ocorre no final, mas antes da limpeza das instruções `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

  Para o estado `end`, as seguintes operações poderiam estar acontecendo:

  - Escrever um evento no log binário
  - Liberando buffers de memória, incluindo para blobs

- `executing`

  O fio começou a executar uma declaração.

- `Execution of init_command`

  O fio está executando instruções no valor da variável de sistema `init_command`.

- `freeing items`

  O fio executou um comando. Esse estado é geralmente seguido por `cleaning up`.

- `FULLTEXT initialization`

  O servidor está se preparando para realizar uma pesquisa de texto completo em linguagem natural.

- `init`

  Isso ocorre antes da inicialização das instruções `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações realizadas pelo servidor neste estado incluem o esvaziamento do log binário e do log `InnoDB`.

- `Killed`

  Alguém enviou uma declaração `KILL` para o tópico e ela deve abortar na próxima vez que verificar a bandeira de interrupção. A bandeira é verificada em cada grande laço no MySQL, mas, em alguns casos, ainda pode levar um curto tempo para o tópico morrer. Se o tópico estiver bloqueado por outro tópico, a interrupção entra em vigor assim que o outro tópico liberar sua trava.

- `Locking system tables`

  O fio está tentando bloquear uma tabela do sistema (por exemplo, uma tabela de fuso horário ou uma tabela de registro).

- `logging slow query`

  O fio está escrevendo uma declaração no log de consulta lenta.

- `login`

  O estado inicial de um fio de conexão até que o cliente seja autenticado com sucesso.

- `manage keys`

  O servidor está habilitando ou desabilitando um índice de tabela.

- `Opening system tables`

  O fio está tentando abrir uma tabela do sistema (por exemplo, uma tabela de fuso horário ou uma tabela de registro).

- `Opening tables`

  O fio está tentando abrir uma tabela. Este deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma instrução `ALTER TABLE` ou `LOCK TABLE` pode impedir a abertura de uma tabela até que a instrução seja concluída. Também vale a pena verificar se o valor `table_open_cache` é grande o suficiente.

  Para as tabelas do sistema, o estado `Opening system tables` é usado.

- `optimizing`

  O servidor está realizando otimizações iniciais para uma consulta.

- `preparing`

  Esse estado ocorre durante a otimização da consulta.

- `preparing for alter table`

  O servidor está se preparando para executar um `ALTER TABLE` in-place.

- `Purging old relay logs`

  O fio está removendo arquivos de log de relé desnecessários.

- `query end`

  Esse estado ocorre após o processamento de uma consulta, mas antes do estado `freeing items`.

- `Receiving from client`

  O servidor está lendo um pacote do cliente.

- `Removing duplicates`

  A consulta estava usando `SELECT DISTINCT` de tal forma que o MySQL não conseguia otimizar a operação DISTINCT em uma fase inicial. Por isso, o MySQL exige uma etapa extra para remover todas as linhas duplicadas antes de enviar o resultado ao cliente.

- `removing tmp table`

  O fio está removendo uma tabela temporária interna após o processamento de uma declaração `SELECT`. Esse estado não é usado se nenhuma tabela temporária foi criada.

- `rename`

  O fio está renomeando uma tabela.

- `rename result table`

  O fio está processando uma declaração `ALTER TABLE`, criou a nova tabela e está renomeando-a para substituir a tabela original.

- `Reopen tables`

  O fio obteve um bloqueio para a tabela, mas percebeu, após obter o bloqueio, que a estrutura subjacente da tabela havia mudado. Ele liberou o bloqueio, fechou a tabela e está tentando reabri-la.

- `Repair by sorting`

  O código de reparo está usando uma classificação para criar índices.

- `Repair done`

  O fio concluiu uma reparação multifilar para uma tabela `MyISAM`.

- `Repair with keycache`

  O código de reparo está usando a criação de chaves uma por uma através do cache de chaves. Isso é muito mais lento do que `Repair by sorting`.

- `Rolling back`

  O fio está revertendo uma transação.

- `Saving state`

  Para operações de tabela `MyISAM`, como reparo ou análise, o fio está salvando o novo estado da tabela no cabeçalho do arquivo `.MYI`. O estado inclui informações como o número de linhas, o contador `AUTO_INCREMENT` e as distribuições de chaves.

- `Searching rows for update`

  O fio está realizando uma primeira fase para encontrar todas as linhas correspondentes antes de atualizá-las. Isso deve ser feito se o `UPDATE` estiver alterando o índice usado para encontrar as linhas envolvidas.

- `Sending data`

  *Antes do MySQL 8.0.17*: O fio está lendo e processando linhas para uma declaração `SELECT` e enviando dados ao cliente. Como as operações que ocorrem nesse estado tendem a realizar grandes quantidades de acesso ao disco (leitura), ele é frequentemente o estado com maior duração ao longo da vida de uma consulta específica. *MySQL 8.0.17 e versões posteriores*: Esse estado não é mais indicado separadamente, mas sim incluído no estado `Executing`.

- `Sending to client`

  O servidor está escrevendo um pacote para o cliente.

- `setup`

  O fio está iniciando uma operação `ALTER TABLE`.

- `Sorting for group`

  O fio está fazendo uma limpeza para satisfazer um `GROUP BY`.

- `Sorting for order`

  O fio está fazendo uma limpeza para satisfazer um `ORDER BY`.

- `Sorting index`

  O índice de threads está classificando as páginas de índice para um acesso mais eficiente durante uma operação de otimização da tabela `MyISAM`.

- `Sorting result`

  Para uma declaração `SELECT`, isso é semelhante a `Creating sort index`, mas para tabelas não temporárias.

- `starting`

  A primeira etapa no início da execução da declaração.

- `statistics`

  O servidor está calculando estatísticas para desenvolver um plano de execução de consulta. Se um fio estiver nesse estado por muito tempo, o servidor provavelmente está preso no disco, realizando outro trabalho.

- `System lock`

  O fio chamou `mysql_lock_tables()` e o estado do fio não foi atualizado desde então. Este é um estado muito geral que pode ocorrer por várias razões.

  Por exemplo, o fio vai solicitar ou está aguardando uma bloqueio interno ou externo do sistema para a tabela. Isso pode ocorrer quando o `InnoDB` aguarda um bloqueio de nível de tabela durante a execução do `LOCK TABLES`. Se este estado estiver sendo causado por solicitações de bloqueios externos e você não estiver usando múltiplos servidores **mysqld** que estão acessando as mesmas tabelas `MyISAM`, você pode desabilitar os bloqueios de sistema externos com a opção `--skip-external-locking`. No entanto, o bloqueio externo é desativado por padrão, então é provável que esta opção não tenha efeito. Para o `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não aguardando por ele).

  Para as tabelas do sistema, o estado `Locking system tables` é usado.

- `update`

  O fio está se preparando para começar a atualizar a tabela.

- `Updating`

  O fio está procurando linhas para atualizar e as está atualizando.

- `updating main table`

  O servidor está executando a primeira parte de uma atualização de várias tabelas. Ele está atualizando apenas a primeira tabela e salvando as colunas e deslocamentos a serem usados para atualizar as outras tabelas (referência).

- `updating reference tables`

  O servidor está executando a segunda parte de uma atualização de várias tabelas e atualizando as linhas correspondentes das outras tabelas.

- `User lock`

  O fio vai solicitar ou está aguardando uma bloqueio de aconselhamento solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não aguardando por ele).

- `User sleep`

  O fio invocou uma chamada `SLEEP()`.

- `Waiting for commit lock`

  `FLUSH TABLES WITH READ LOCK` está aguardando um bloqueio de commit.

- `waiting for handler commit`

  O fio está aguardando a conclusão de uma transação em comparação com outras partes do processamento de consultas.

- `Waiting for tables`

  O fio recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e que ele precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

  Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

- `Waiting for table flush`

  O fio está executando `FLUSH TABLES` e está esperando que todos os fios fechem suas tabelas, ou o fio recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

  Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes declarações na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

- `Waiting for lock_type lock`

  O servidor está aguardando a aquisição de um bloqueio `THR_LOCK` ou de um bloqueio do subsistema de bloqueio de metadados, onde `lock_type` indica o tipo de bloqueio.

  Esse estado indica uma espera por um `THR_LOCK`:

  - `Waiting for table level lock`

  Estes estados indicam uma espera por um bloqueio de metadados:

  - `Waiting for event metadata lock`

  - `Waiting for global read lock`

  - `Waiting for schema metadata lock`

  - `Waiting for stored function metadata lock`

  - `Waiting for stored procedure metadata lock`

  - `Waiting for table metadata lock`

  - `Waiting for trigger metadata lock`

  Para obter informações sobre indicadores de bloqueio de tabelas, consulte a Seção 10.11.1, “Métodos de bloqueio interno”. Para obter informações sobre bloqueio de metadados, consulte a Seção 10.11.4, “Bloqueio de metadados”. Para ver quais bloqueios estão bloqueando solicitações de bloqueio, use as tabelas de bloqueio do Schema de desempenho descritas na Seção 29.12.13, “Tabelas de bloqueio do Schema de desempenho”.

- `Waiting on cond`

  Um estado genérico em que o fio está aguardando que uma condição se torne verdadeira. Não há informações específicas sobre o estado.

- `Writing to net`

  O servidor está escrevendo um pacote na rede.
