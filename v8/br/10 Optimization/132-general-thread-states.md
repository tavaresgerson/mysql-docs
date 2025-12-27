### 10.14.3 Estados Gerais de Fila

A lista a seguir descreve os valores do estado `Estado` da fila que estão associados ao processamento geral de consultas e não a atividades mais especializadas, como a replicação. Muitos desses estados são úteis apenas para encontrar erros no servidor.

* `Após criar`

  Isso ocorre quando a fila cria uma tabela (incluindo tabelas temporárias internas), no final da função que cria a tabela. Esse estado é usado mesmo se a tabela não puder ser criada devido a algum erro.
* `Altering table`

  O servidor está executando uma `ALTER TABLE` in-place.
* `Analisando`

  A fila está calculando as distribuições de chaves de tabelas `MyISAM` (por exemplo, para `ANALYZE TABLE`).
* `Verificando permissões`

  A fila está verificando se o servidor tem os privilégios necessários para executar a instrução.
* `Verificando tabela`

  A fila está realizando uma operação de verificação de tabela.
* `Limpando`

  A fila processou um comando e está se preparando para liberar memória e reiniciar certas variáveis de estado.
* `Fechando tabelas`

  A fila está descarregando os dados de tabela alterados no disco e fechando as tabelas usadas. Essa operação deve ser rápida. Se não for, verifique se não há disco cheio e se o disco não está sendo muito utilizado.
* `Comprometendo a alteração da tabela ao mecanismo de armazenamento`

  O servidor terminou uma `ALTER TABLE` in-place e está comprometendo o resultado.
* `Convertendo HEAP para ondisk`

  A fila está convertendo uma tabela temporária interna de uma tabela `MEMORY` para uma tabela no disco.
* `Copiando para tabela temporária`

  A fila está processando uma instrução `ALTER TABLE`. Esse estado ocorre após a criação da tabela com a nova estrutura, mas antes de as linhas serem copiadas nela.

  Para uma fila nesse estado, o Gerenciamento de Desempenho pode ser usado para obter informações sobre o progresso da operação de cópia. Veja a Seção 29.12.5, “Tabelas de Eventos de Estágio do Gerenciamento de Desempenho”.
* `Copiando para tabela de grupo`

Se uma declaração tiver critérios diferentes de `ORDER BY` e `GROUP BY`, as linhas são ordenadas por grupo e copiadas para uma tabela temporária.
* `Copiando para tabela temporária`

  O servidor está copiando para uma tabela temporária na memória.
* `Copiando para tabela temporária no disco`

  O servidor está copiando para uma tabela temporária no disco. O conjunto de resultados temporário tornou-se muito grande (veja a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”). Consequentemente, o fio está alterando a tabela temporária do formato de memória para o formato baseado em disco para economizar memória.
* `Criando índice`

  O fio está processando `ALTER TABLE ... ENABLE KEYS` para uma tabela `MyISAM`.
* `Criando índice de ordenação`

  O fio está processando uma `SELECT` que é resolvida usando uma tabela temporária interna.
* `criando tabela`

  O fio está criando uma tabela. Isso inclui a criação de tabelas temporárias.
* `Criando tabela temporária`

  O fio está criando uma tabela temporária na memória ou no disco. Se a tabela for criada na memória, mas posteriormente convertida para um formato baseado em disco, o estado durante essa operação é `Copiando para tabela temporária no disco`.
* `Excluindo da tabela principal`

  O servidor está executando a primeira parte de uma exclusão de várias tabelas. Está excluindo apenas da primeira tabela e salvando as colunas e offsets para serem usados na exclusão das outras (tabelas de referência).
* `Excluindo das tabelas de referência`

  O servidor está executando a segunda parte de uma exclusão de várias tabelas e excluindo as linhas correspondentes das outras tabelas.
* `discard_or_import_tablespace`

  O fio está processando uma declaração `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.
* `end`

  Isso ocorre no final, mas antes da limpeza das declarações `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

  Para o estado `end`, as seguintes operações podem estar ocorrendo:

  + Escrevendo um evento no log binário
  + Liberando buffers de memória, incluindo para blobs
* `executando`

  O fio começou a executar uma declaração.
* `Execução do comando init`

O fio está executando instruções no valor da variável de sistema `init_command`.
* `livrando itens`

  O fio executou um comando. Esse estado geralmente é seguido pela `limpeza`.
* `inicialização FULLTEXT`

  O servidor está se preparando para realizar uma pesquisa de texto completo em linguagem natural.
* `init`

  Isso ocorre antes da inicialização das instruções `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações realizadas pelo servidor nesse estado incluem o descarte do log binário e do log `InnoDB`.
* `Killed`

  Alguém enviou uma instrução `KILL` para o fio e ele deve abortar na próxima vez que verificar a bandeira de exclusão. A bandeira é verificada em cada grande laço no MySQL, mas, em alguns casos, ainda pode levar um curto tempo para o fio morrer. Se o fio estiver bloqueado por outro fio, a exclusão terá efeito assim que o outro fio liberar sua bloqueadora.
* `Bloqueando tabelas do sistema`

  O fio está tentando bloquear uma tabela do sistema (por exemplo, uma tabela de fuso horário ou uma tabela de log).
* `registrando consultas lentas`

  O fio está escrevendo uma instrução no log de consultas lentas.
* `login`

  O estado inicial para um fio de conexão até que o cliente seja autenticado com sucesso.
* `gerenciar chaves`

  O servidor está habilitando ou desabilitando um índice de tabela.
* `Abrindo tabelas do sistema`

  O fio está tentando abrir uma tabela do sistema (por exemplo, uma tabela de fuso horário ou uma tabela de log).
* `Abrindo tabelas`

  O fio está tentando abrir uma tabela. Esse deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma instrução `ALTER TABLE` ou `LOCK TABLE` pode impedir a abertura de uma tabela até que a instrução seja concluída. Também vale a pena verificar se o valor da `table_open_cache` é grande o suficiente.

  Para tabelas do sistema, o estado `Abrindo tabelas do sistema` é usado.
* `optimizando`

  O servidor está realizando otimizações iniciais para uma consulta.
* `preparando`

  Esse estado ocorre durante a otimização da consulta.
* `preparando para alter table`

O servidor está se preparando para executar uma alteração `ALTER TABLE` no local.
* "Limpeza de logs de retransmissão antigos"

  O fio está removendo arquivos de log de retransmissão desnecessários.
* "Fim da consulta"

  Esse estado ocorre após o processamento de uma consulta, mas antes do estado "libertando itens".
* "Recebendo do cliente"

  O servidor está lendo um pacote do cliente.
* "Remoção de duplicatas"

  A consulta estava usando `SELECT DISTINCT` de tal forma que o MySQL não podia otimizar a operação distinta em uma fase inicial. Por isso, o MySQL requer uma etapa extra para remover todas as linhas duplicadas antes de enviar o resultado ao cliente.
* "Remoção da tabela temporária"

  O fio está removendo uma tabela temporária interna após o processamento de uma declaração `SELECT`. Esse estado não é usado se nenhuma tabela temporária foi criada.
* "Renomear"

  O fio está renomeando uma tabela.
* "Renomear a tabela do resultado"

  O fio está processando uma declaração `ALTER TABLE`, criou a nova tabela e está renomeando-a para substituir a tabela original.
* "Reabrir tabelas"

  O fio obteve um bloqueio para a tabela, mas notou, após obter o bloqueio, que a estrutura da tabela subjacente mudou. Ele liberou o bloqueio, fechou a tabela e está tentando reabri-la.
* "Reparo por ordenação"

  O código de reparo está usando uma ordenação para criar índices.
* "Reparo concluído"

  O fio completou um reparo multithread para uma tabela `MyISAM`.
* "Reparo com cache de chaves"

  O código de reparo está usando a criação de chaves uma por uma através do cache de chaves. Isso é muito mais lento que "Reparo por ordenação".
* "Reverter"

  O fio está revertendo uma transação.
* "Salvar o estado"

  Para operações de tabela `MyISAM`, como reparo ou análise, o fio está salvando o novo estado da tabela no cabeçalho do arquivo `.MYI`. O estado inclui informações como o número de linhas, o contador `AUTO_INCREMENT` e as distribuições de chaves.
* "Procurando linhas para atualização"

O fio está realizando uma primeira fase para encontrar todas as linhas correspondentes antes de as atualizar. Isso deve ser feito se a `UPDATE` estiver alterando o índice que é usado para encontrar as linhas envolvidas.
* `Enviando dados`

  Esse estado agora está incluído no estado `Executando`.
* `Enviando para cliente`

  O servidor está escrevendo um pacote para o cliente.
* `configuração`

  O fio está iniciando uma operação `ALTER TABLE`.
* `Ordenação por grupo`

  O fio está realizando uma ordenação para satisfazer uma `GROUP BY`.
* `Ordenação por ordem`

  O fio está realizando uma ordenação para satisfazer uma `ORDER BY`.
* `Ordenação de índice`

  O fio está ordenando páginas de índice para acesso mais eficiente durante uma operação de otimização de tabela `MyISAM`.
* `Resultado da ordenação`

  Para uma instrução `SELECT`, isso é semelhante a `Criando índice de ordenação`, mas para tabelas não temporárias.
* `início`

  A primeira etapa no início da execução da instrução.
* `estatísticas`

  O servidor está calculando estatísticas para desenvolver um plano de execução da consulta. Se um fio estiver nesse estado por um longo tempo, o servidor provavelmente está bloqueado no disco realizando outro trabalho.
* `Bloqueio de sistema`

  O fio chamou `mysql_lock_tables()` e o estado do fio não foi atualizado desde então. Esse é um estado muito geral que pode ocorrer por muitas razões.

  Por exemplo, o fio está solicitando ou está esperando por um bloqueio interno ou externo do sistema para a tabela. Isso pode ocorrer quando o `InnoDB` espera por um bloqueio de nível de tabela durante a execução de `LOCK TABLES`. Se esse estado estiver sendo causado por solicitações de bloqueios externos e você não estiver usando múltiplos servidores `mysqld` acessando as mesmas tabelas `MyISAM`, você pode desabilitar bloqueios de sistema externos com a opção `--skip-external-locking`. No entanto, o bloqueio de sistema é desativado por padrão, então é provável que essa opção não tenha efeito. Para `SHOW PROFILE`, esse estado significa que o fio está solicitando o bloqueio (e não esperando por ele).
* `atualizar`

O fio está se preparando para começar a atualizar a tabela.
* `Atualizando`

O fio está procurando por linhas para atualizar e as está atualizando.
* `atualizando a tabela principal`

O servidor está executando a primeira parte de uma atualização de várias tabelas. Ele está atualizando apenas a primeira tabela e salvando as colunas e offsets para serem usados na atualização das outras (referência) tabelas.
* `atualizando tabelas de referência`

O servidor está executando a segunda parte de uma atualização de várias tabelas e atualizando as linhas correspondentes das outras tabelas.
* `Bloqueio do usuário`

O fio vai solicitar ou está esperando por um bloqueio aconselhável solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (não esperando por ele).
* `Dormir do usuário`

O fio invocou uma chamada `SLEEP()`.
* `Aguardando bloqueio de commit`

`FLUSH TABLES WITH READ LOCK` está esperando por um bloqueio de commit.
* `esperando pelo commit do manipulador`

O fio está esperando por uma transação ser confirmada em comparação com outras partes do processamento da consulta.
* `Aguardando tabelas`

O fio recebeu uma notificação de que a estrutura subjacente para uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

Esta notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes instruções na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.
* `Aguardando varredura de tabela`

O fio está executando `FLUSH TABLES` e está esperando que todos os fios fechem suas tabelas, ou o fio recebeu uma notificação de que a estrutura subjacente para uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

Esta notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes instruções na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.
* `Aguardando lock_type lock`

  O servidor está aguardando para adquirir um `THR_LOCK` lock ou um lock do subsistema de bloqueio de metadados, onde *`lock_type`* indica o tipo de lock.

  Este estado indica uma espera por um `THR_LOCK`:

  + `Aguardando lock de nível de tabela`

  Estes estados indicam uma espera por um lock de metadados:

  + `Aguardando lock de metadados de evento`
  + `Aguardando lock de leitura global`
  + `Aguardando lock de metadados de esquema`
  + `Aguardando lock de metadados de função armazenada`
  + `Aguardando lock de metadados de procedimento armazenado`
  + `Aguardando lock de metadados de tabela`
  + `Aguardando lock de metadados de gatilho`

  Para obter informações sobre os indicadores de bloqueio de tabela, consulte a Seção 10.11.1, “Métodos de Bloqueio Interno”. Para obter informações sobre o bloqueio de metadados, consulte a Seção 10.11.4, “Bloqueio de Metadados”. Para ver quais locks estão bloqueando as solicitações de bloqueio, use as tabelas de bloqueio do Schema de Desempenho descritas na Seção 29.12.13, “Tabelas de Bloqueio do Schema de Desempenho”.
* `Aguardando cond`

  Um estado genérico em que o fio está aguardando que uma condição se torne verdadeira. Não há informações específicas de estado disponíveis.
* `Escrevendo para net`

  O servidor está escrevendo um pacote para a rede.