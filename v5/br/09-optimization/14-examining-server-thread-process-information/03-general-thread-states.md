### 8.14.3 Estados gerais de fios

A lista a seguir descreve os valores do atributo `State` associados ao processamento de consultas gerais e não a atividades mais especializadas, como a replicação. Muitos deles são úteis apenas para encontrar erros no servidor.

- `Após criar`

  Isso ocorre quando o fio cria uma tabela (incluindo tabelas temporárias internas), no final da função que cria a tabela. Esse estado é usado mesmo se a tabela não puder ser criada devido a algum erro.

- "alterar a tabela"

  O servidor está executando uma alteração `ALTER TABLE` in-place.

- "Analisando"

  O fio está calculando as distribuições de chaves de tabelas `MyISAM` (por exemplo, para `ANALYZE TABLE`).

- `verificar permissões`

  O fio está verificando se o servidor tem os privilégios necessários para executar a declaração.

- `Verificar tabela`

  O fio está realizando uma operação de verificação de tabela.

- "limpar"

  O fio processou um comando e está se preparando para liberar memória e reiniciar certas variáveis de estado.

- `comitir alter table para o mecanismo de armazenamento`

  O servidor terminou uma alteração `ALTER TABLE` in-place e está commitando o resultado.

- "mesas de encerramento"

  O fio está descarregando os dados da tabela alterados no disco e fechando as tabelas usadas. Isso deve ser uma operação rápida. Se não for, verifique se não há disco cheio e se o disco não está sendo muito utilizado.

- `converter HEAP para ondisk`

  O fio está convertendo uma tabela temporária interna de uma tabela `MEMORY` para uma tabela em disco.

- `copiar para a tabela tmp`

  O fio está processando uma declaração `ALTER TABLE`. Esse estado ocorre após a tabela com a nova estrutura ter sido criada, mas antes de as linhas serem copiadas nela.

  Para um fio nesse estado, o Schema de Desempenho pode ser usado para obter informações sobre o progresso da operação de cópia. Veja a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

- `Copiar para tabela de grupo`

  Se uma declaração tiver critérios diferentes de `ORDER BY` e `GROUP BY`, as linhas são ordenadas por grupo e copiadas para uma tabela temporária.

- `Copiar para a tabela tmp`

  O servidor está copiando para uma tabela temporária na memória.

- `Copiar para a tabela tmp no disco`

  O servidor está copiando para uma tabela temporária no disco. O conjunto de resultados temporário tornou-se muito grande (consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”). Consequentemente, o thread está alterando a tabela temporária do formato de memória para o formato baseado em disco para economizar memória.

- `Criar índice`

  O fio está processando `ALTER TABLE ... ENABLE KEYS` para uma tabela `MyISAM`.

- `Criar índice de classificação`

  O fio está processando uma `SELECT` que é resolvida usando uma tabela temporária interna.

- `criando tabela`

  O fio está criando uma tabela. Isso inclui a criação de tabelas temporárias.

- `Criar tabela temporária`

  O fio está criando uma tabela temporária na memória ou no disco. Se a tabela for criada na memória, mas posteriormente convertida para uma tabela no disco, o estado durante essa operação será `Copiando para tabela temporária no disco`.

- "excluindo da tabela principal"

  O servidor está executando a primeira parte de uma exclusão de múltiplas tabelas. Ele está excluindo apenas da primeira tabela e salvando as colunas e deslocamentos a serem usados para excluir das outras tabelas (referência).

- "excluindo das tabelas de referência"

  O servidor está executando a segunda parte de uma exclusão de múltiplas tabelas e excluindo as linhas correspondentes das outras tabelas.

- `discard_or_import_tablespace`

  O fio está processando uma declaração `ALTER TABLE ... DISCARD TABLESPACE` ou `ALTER TABLE ... IMPORT TABLESPACE`.

- `final`

  Isso ocorre no final, mas antes da limpeza das instruções `ALTER TABLE`, `CREATE VIEW`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`.

  Para o estado `end`, as seguintes operações poderiam estar acontecendo:

  - Remover entradas do cache de consultas após a alteração de dados em uma tabela

  - Escrever um evento no log binário

  - Liberando buffers de memória, incluindo para blobs

- "executando"

  O fio começou a executar uma declaração.

- `Execução do comando init`

  O fio está executando instruções no valor da variável de sistema `init_command`.

- "libertar itens"

  O fio executou um comando. Algum liberamento de itens foi feito durante este estado, envolvendo o cache de consultas. Este estado é geralmente seguido pela `limpeza`.

- `Inicialização de FULLTEXT`

  O servidor está se preparando para realizar uma pesquisa de texto completo em linguagem natural.

- `init`

  Isso ocorre antes da inicialização das instruções `ALTER TABLE`, `DELETE`, `INSERT`, `SELECT` ou `UPDATE`. As ações realizadas pelo servidor nesse estado incluem o descarte do log binário, do log `InnoDB` e algumas operações de limpeza do cache de consultas.

- "Assassinado"

  Alguém enviou uma declaração `KILL` para o thread e ela deve abortar na próxima vez que verificar a bandeira de kill. A bandeira é verificada em cada grande loop no MySQL, mas, em alguns casos, ainda pode levar um curto tempo para o thread morrer. Se o thread estiver bloqueado por outro thread, o kill entra em vigor assim que o outro thread liberar sua trava.

- `registrando consultas lentas`

  O fio está escrevendo uma declaração no log de consulta lenta.

- `login`

  O estado inicial de um fio de conexão até que o cliente seja autenticado com sucesso.

- gerenciar chaves

  O servidor está habilitando ou desabilitando um índice de tabela.

- `Abrir tabelas`

  O fio está tentando abrir uma tabela. Este deve ser um procedimento muito rápido, a menos que algo impeça a abertura. Por exemplo, uma instrução `ALTER TABLE` ou `LOCK TABLE` pode impedir a abertura de uma tabela até que a instrução seja concluída. Também vale a pena verificar se o valor da `table_open_cache` é grande o suficiente.

- "otimizar"

  O servidor está realizando otimizações iniciais para uma consulta.

- "preparando"

  Esse estado ocorre durante a otimização da consulta.

- `preparando para alter table`

  O servidor está se preparando para executar uma alteração `ALTER TABLE` in-place.

- `Limpar logs de relé antigos`

  O fio está removendo arquivos de log de relé desnecessários.

- `finalizar consulta`

  Esse estado ocorre após o processamento de uma consulta, mas antes do estado de "livrar itens".

- `Receber do cliente`

  O servidor está lendo um pacote do cliente. Esse estado é chamado de `Lendo da rede` antes do MySQL 5.7.8.

- `Remover duplicatas`

  A consulta estava usando `SELECT DISTINCT` de uma maneira que o MySQL não conseguia otimizar a operação de distinção em uma fase inicial. Por isso, o MySQL exige uma etapa extra para remover todas as linhas duplicadas antes de enviar o resultado ao cliente.

- `remover a tabela tmp`

  O fio está removendo uma tabela temporária interna após o processamento de uma instrução `SELECT`. Esse estado não é usado se nenhuma tabela temporária foi criada.

- `renomear`

  O fio está renomeando uma tabela.

- `renomear a tabela de resultados`

  O fio está processando uma declaração `ALTER TABLE`, criou a nova tabela e está renomeando-a para substituir a tabela original.

- "Reabrir mesas"

  O fio obteve um bloqueio para a tabela, mas percebeu, após obter o bloqueio, que a estrutura subjacente da tabela havia mudado. Ele liberou o bloqueio, fechou a tabela e está tentando reabri-la.

- "Reparação por triagem"

  O código de reparo está usando uma classificação para criar índices.

- "A reparação foi feita"

  O fio concluiu uma reparação multifiltrada para uma tabela `MyISAM`.

- `Reparação com keycache`

  O código de reparo está usando a criação de chaves uma por uma através do cache de chaves. Isso é muito mais lento do que a opção "Reparar por classificação".

- "Reverter"

  O fio está revertendo uma transação.

- `Salvar estado`

  Para operações de tabela `MyISAM`, como reparo ou análise, o fio está salvando o novo estado da tabela no cabeçalho do arquivo `.MYI`. O estado inclui informações como o número de linhas, o contador `AUTO_INCREMENT` e as distribuições de chaves.

- `Pesquisar linhas para atualização`

  O fio está realizando uma primeira fase para encontrar todas as linhas correspondentes antes de atualizá-las. Isso precisa ser feito se a `UPDATE` estiver alterando o índice que é usado para encontrar as linhas envolvidas.

- `Enviar dados`

  O fio está lendo e processando linhas para uma instrução `SELECT` e enviando dados ao cliente. Como as operações que ocorrem durante esse estado tendem a realizar grandes quantidades de acesso ao disco (leitura), é frequentemente o estado de execução mais longo ao longo da vida útil de uma consulta específica.

- `Enviar para o cliente`

  O servidor está escrevendo um pacote para o cliente. Esse estado é chamado de `Escrevendo para a rede` antes do MySQL 5.7.8.

- `configuração`

  O fio está iniciando uma operação `ALTER TABLE`.

- `Ordenar por grupo`

  O fio está fazendo uma classificação para satisfazer um `GROUP BY`.

- `Ordenar por ordem`

  O fio está fazendo uma classificação para satisfazer uma `ORDER BY`.

- Índice de classificação

  O índice de threads está classificando as páginas de índice para um acesso mais eficiente durante uma operação de otimização de tabela `MyISAM`.

- `Resultado de classificação`

  Para uma instrução `SELECT`, isso é semelhante a "Criar índice de classificação", mas para tabelas não temporárias.

- `começando`

  A primeira etapa no início da execução da declaração.

- "estatísticas"

  O servidor está calculando estatísticas para desenvolver um plano de execução de consulta. Se um fio estiver nesse estado por muito tempo, o servidor provavelmente está preso no disco, realizando outro trabalho.

- Bloqueio do sistema

  O fio chamou `mysql_lock_tables()` e o estado do fio não foi atualizado desde então. Este é um estado muito geral que pode ocorrer por várias razões.

  Por exemplo, o fio vai solicitar ou está aguardando uma bloqueio interno ou externo do sistema para a tabela. Isso pode ocorrer quando o `InnoDB` aguarda um bloqueio de nível de tabela durante a execução de `LOCK TABLES`. Se este estado estiver sendo causado por solicitações de bloqueios externos e você não estiver usando múltiplos servidores **mysqld** que estão acessando as mesmas tabelas `MyISAM`, você pode desabilitar bloqueios de sistema externos com a opção `--skip-external-locking`. No entanto, o bloqueio externo é desativado por padrão, então é provável que esta opção não tenha efeito. Para `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não aguardando por ele).

- `atualizar`

  O fio está se preparando para começar a atualizar a tabela.

- `Atualizando`

  O fio está procurando linhas para atualizar e as está atualizando.

- `atualizando a tabela principal`

  O servidor está executando a primeira parte de uma atualização de várias tabelas. Ele está atualizando apenas a primeira tabela e salvando as colunas e deslocamentos a serem usados para atualizar as outras tabelas (referência).

- "atualizando tabelas de referência"

  O servidor está executando a segunda parte de uma atualização de várias tabelas e atualizando as linhas correspondentes das outras tabelas.

- Bloqueio do usuário

  O fio vai solicitar ou está aguardando uma bloqueio de aconselhamento solicitado com uma chamada `GET_LOCK()`. Para `SHOW PROFILE`, este estado significa que o fio está solicitando o bloqueio (e não aguardando por ele).

- `Sono do usuário`

  O fio invocou uma chamada `SLEEP()`.

- `Aguardando bloqueio de commit`

  `FLUSH TABLES WITH READ LOCK` está aguardando um bloqueio de commit.

- `Aguardando bloqueio de leitura global`

  `FLUSH TABLES WITH READ LOCK` está aguardando uma bloqueadora de leitura global ou a variável de sistema `read_only` global está sendo definida.

- "Esperando mesas"

  O fio recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e que ele precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

  Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes instruções na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

- `Aguardando o esvaziamento da mesa`

  O fio está executando `FLUSH TABLES` e está esperando que todos os fios fechem suas tabelas, ou o fio recebeu uma notificação de que a estrutura subjacente de uma tabela mudou e precisa reabrir a tabela para obter a nova estrutura. No entanto, para reabrir a tabela, ele deve esperar até que todos os outros fios tenham fechado a tabela em questão.

  Essa notificação ocorre se outro fio tiver usado `FLUSH TABLES` ou uma das seguintes instruções na tabela em questão: `FLUSH TABLES tbl_name`, `ALTER TABLE`, `RENAME TABLE`, `REPAIR TABLE`, `ANALYZE TABLE` ou `OPTIMIZE TABLE`.

- `Aguardando lock_type lock`

  O servidor está aguardando para adquirir uma trava `THR_LOCK` ou uma trava do subsistema de bloqueio de metadados, onde *`lock_type`* indica o tipo de trava.

  Esse estado indica uma espera por um `THR_LOCK`:

  - `Esperando por bloqueio de nível de mesa`

  Estes estados indicam uma espera por um bloqueio de metadados:

  - `Esperando por bloqueio dos metadados do evento`

  - `Aguardando bloqueio de leitura global`

  - `Esperando por bloqueio de metadados do esquema`

  - `Aguardando bloqueio de metadados da função armazenada`

  - `Esperando por bloqueio de metadados do procedimento armazenado`

  - `Esperando por bloqueio de metadados da tabela`

  - `Aguardando bloqueio de metadados do gatilho`

  Para obter informações sobre indicadores de bloqueio de tabelas, consulte a Seção 8.11.1, “Métodos de bloqueio interno”. Para obter informações sobre bloqueio de metadados, consulte a Seção 8.11.4, “Bloqueio de metadados”. Para ver quais bloqueios estão bloqueando solicitações de bloqueio, use as tabelas de bloqueio do Schema de desempenho descritas na Seção 25.12.12, “Tabelas de bloqueio do Schema de desempenho”.

- `Aguardando cond`

  Um estado genérico em que o fio está aguardando que uma condição se torne verdadeira. Não há informações específicas sobre o estado.

- `Escrever para a rede`

  O servidor está escrevendo um pacote na rede. Esse estado é chamado de "Enviando para cliente" a partir do MySQL 5.7.8.
