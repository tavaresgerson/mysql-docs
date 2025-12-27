#### 17.15.2.1 Uso das Informações de Transação e Bloqueio do InnoDB

Esta seção descreve o uso das informações de bloqueio expostas pelas tabelas do Gerenciamento de Desempenho `data_locks` e `data_lock_waits`.

##### Identificando Transações Bloqueadas

Às vezes, é útil identificar qual transação está bloqueando outra. As tabelas que contêm informações sobre transações `InnoDB` e bloqueios de dados permitem determinar qual transação está aguardando outra e qual recurso está sendo solicitado. (Para descrições dessas tabelas, consulte a Seção 17.15.2, “Informações do InnoDB sobre Transações e Informações de Bloqueio”.)

Suponha que três sessões estejam sendo executadas simultaneamente. Cada sessão corresponde a um fio do MySQL e executa uma transação após a outra. Considere o estado do sistema quando essas sessões emitiram as seguintes instruções, mas nenhuma ainda havia comprometido sua transação:

* Sessão A:

  ```
  BEGIN;
  SELECT a FROM t FOR UPDATE;
  SELECT SLEEP(100);
  ```

* Sessão B:

  ```
  SELECT b FROM t FOR UPDATE;
  ```

* Sessão C:

  ```
  SELECT c FROM t FOR UPDATE;
  ```

Nesse cenário, use a seguinte consulta para ver quais transações estão aguardando e quais transações as estão bloqueando:

```
SELECT
  r.trx_id waiting_trx_id,
  r.trx_mysql_thread_id waiting_thread,
  r.trx_query waiting_query,
  b.trx_id blocking_trx_id,
  b.trx_mysql_thread_id blocking_thread,
  b.trx_query blocking_query
FROM       performance_schema.data_lock_waits w
INNER JOIN information_schema.innodb_trx b
  ON b.trx_id = w.blocking_engine_transaction_id
INNER JOIN information_schema.innodb_trx r
  ON r.trx_id = w.requesting_engine_transaction_id;
```

Ou, de forma mais simples, use a visão `sys` `innodb_lock_waits` do esquema `innodb`:

```
SELECT
  waiting_trx_id,
  waiting_pid,
  waiting_query,
  blocking_trx_id,
  blocking_pid,
  blocking_query
FROM sys.innodb_lock_waits;
```

Se um valor NULL for reportado para a consulta de bloqueio, consulte Identificando uma Consulta de Bloqueio Após a Sessão de Emissão Se Tornar Idente.

Na tabela anterior, você pode identificar as sessões pelas colunas "consulta em espera" ou "consulta bloqueada". Como você pode ver:

* As sessões B (ID de transação `A4`, fio `6`) e C (ID de transação `A5`, fio `7`) estão aguardando a sessão A (ID de transação `A3`, fio `5`).

* A sessão C está aguardando tanto a sessão B quanto a sessão A.

Você pode ver os dados subjacentes na tabela `INFORMATION_SCHEMA` `INNODB_TRX` e nas tabelas `data_locks` e `data_lock_waits` do Schema de Desempenho.

A tabela a seguir mostra alguns conteúdos de amostra da tabela `INNODB_TRX`.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th scope="col">id_trx</th> <th scope="col">estado_trx</th> <th scope="col">iniciado_trx</th> <th scope="col">id_lock_pedido</th> <th scope="col">iniciado_espera_trx</th> <th scope="col">peso_trx</th> <th scope="col">id_thread_mysql_trx</th> <th scope="col">consulta_trx</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A3</code></th> <td><code class="literal">EM_CORRIDA</code></td> <td><code class="literal">2008-01-15 16:44:54</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">2</code></td> <td><code class="literal">5</code></td> <td><code class="literal">SELECT SLEEP(100)</code></td> </tr><tr> <th scope="row"><code class="literal">A4</code></th> <td><code class="literal">espera_lock</code></td> <td><code class="literal">2008-01-15 16:45:09</code></td> <td><code class="literal">A4:1:3:2</code></td> <td><code class="literal">2008-01-15 16:45:09</code></td> <td><code class="literal">2</code></td> <td><code class="literal">6</code></td> <td><code class="literal">SELECT b FROM t FOR UPDATE</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">espera_lock</code></td> <td><code class="literal">2008-01-15 16:45:14</code></td> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">2008-01-15 16:45:14</code></td> <td><code class="literal">2</code></td> <td><code class="literal">7</code></td> <td><code class="literal">SELECT c FROM t FOR UPDATE</code></td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela `data_locks`.

<table summary="Dados de amostra da tabela Performance Schema data_locks, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 16%"/><col style="width: 15%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th scope="col">id do bloqueio</th> <th scope="col">id do transação do bloqueio</th> <th scope="col">modo do bloqueio</th> <th scope="col">tipo de bloqueio</th> <th scope="col">esquema do bloqueio</th> <th scope="col">tabela do bloqueio</th> <th scope="col">índice do bloqueio</th> <th scope="col">dados do bloqueio</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A3:1:3:2</code></th> <td><code class="literal">A3</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr><tr> <th scope="row"><code class="literal">A4:1:3:2</code></th> <td><code class="literal">A4</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr><tr> <th scope="row"><code class="literal">A5:1:3:2</code></th> <td><code class="literal">A5</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela `data_lock_waits`.

<table summary="Dados de amostra da tabela Performance Schema data_lock_waits, mostrando os tipos típicos de entradas para cada coluna." width="10%"> <col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"> <thead><tr> <th>id_trx solicitante</th> <th>id_lock solicitado</th> <th>id_trx bloqueante</th> <th>id_lock bloqueante</th> </tr> </thead><tbody> <tr> <th><code class="literal">A4</code></th> <td><code class="literal">A4:1:3:2</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">A3:1:3:2</code></td> </tr> <tr> <th><code class="literal">A5</code></th> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">A3:1:3:2</code></td> </tr> <tr> <th><code class="literal">A5</code></th> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">A4</code></td> <td><code class="literal">A4:1:3:2</code></td> </tr> </tbody></table>

##### Identificando uma Consulta Bloqueada Após a Sessão de Emissão Torna-se Idilizada

Ao identificar transações bloqueantes, um valor NULL é reportado para a consulta bloqueante se a sessão que emitiu a consulta se tornar idílica. Nesse caso, use as seguintes etapas para determinar a consulta bloqueante:

1. Identifique o ID do processo da transação bloqueante. Na tabela `sys.innodb_lock_waits`, o ID do processo da transação bloqueante é o valor `blocking_pid`.

2. Usando o `blocking_pid`, execute a consulta na tabela `threads` do Schema de Desempenho do MySQL para determinar o `THREAD_ID` da transação bloqueante. Por exemplo, se o `blocking_pid` for 6, execute a seguinte consulta:

   ```
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Usando o `THREAD_ID`, consulte a tabela `events_statements_current` do Schema de Desempenho para determinar a última consulta executada pelo thread. Por exemplo, se o `THREAD_ID` for 28, execute a seguinte consulta:

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. Se a última consulta executada pelo thread não for suficiente para determinar por que um bloqueio está sendo mantido, você pode consultar a tabela `events_statements_history` do Schema de Desempenho para visualizar as últimas 10 declarações executadas pelo thread.

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlação de Transações InnoDB com Sessões MySQL

Às vezes, é útil correlacionar informações de bloqueio interno do `InnoDB` com as informações de nível de sessão mantidas pelo MySQL. Por exemplo, você pode querer saber, para um ID de transação `InnoDB` dado, o ID de sessão MySQL correspondente e o nome da sessão que pode estar mantendo um bloqueio, e assim bloqueando outras transações.

A saída a seguir da tabela `INFORMATION_SCHEMA` `INNODB_TRX` e das tabelas `data_locks` e `data_lock_waits` do Schema de Desempenho é tirada de um sistema um pouco carregado. Como pode ser visto, há várias transações em execução.

As seguintes tabelas `data_locks` e `data_lock_waits` mostram que:

* A transação `77F` (executando uma `INSERT`) está esperando que as transações `77E`, `77D` e `77B` sejam confirmadas.

* A transação `77E` (executando uma `INSERT`) está esperando que as transações `77D` e `77B` sejam confirmadas.

* A transação `77D` (executando uma `INSERT`) está esperando que a transação `77B` seja confirmada.

* A transação `77B` (executando uma `INSERT`) está esperando que a transação `77A` seja confirmada.

* A transação `77A` está em execução, atualmente executando `SELECT`.

* A transação `E56` (executando uma `INSERT`) está esperando que a transação `E55` seja confirmada.

* A transação `E55` (executando uma `INSERT`) está esperando que a transação `19C` seja confirmada.

* A transação `19C` está em execução, atualmente executando uma `INSERT`.

Nota:

Pode haver inconsistências entre as consultas exibidas nas tabelas `INFORMATION_SCHEMA` `PROCESSLIST` e `INNODB_TRX`. Para uma explicação, consulte a Seção 17.15.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

A tabela a seguir mostra o conteúdo da tabela `PROCESSLIST` para um sistema que está executando uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.PROCESSLIST, mostrando o funcionamento interno dos processos do MySQL sob uma carga de trabalho pesada."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th scope="col">ID</th> <th scope="col">USER</th> <th scope="col">HOST</th> <th scope="col">DB</th> <th scope="col">COMMAND</th> <th scope="col">TIME</th> <th scope="col">STATE</th> <th scope="col">INFO</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">384</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">10</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">257</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">3</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">130</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">0</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">61</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">1</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">8</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">1</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">4</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">0</code></td> <td><code class="literal">preparing</code></td> <td><code class="literal">SELECT * FROM PROCESSLIST</code></td> </tr><tr> <th scope="row"><code class="literal">2</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Sleep</code></td> <td><code class="literal">566</code></td> <td><code class="literal"></code></td> <td><code class="literal">NULL</code></td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela `INNODB_TRX` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando o funcionamento interno das transações InnoDB sob carga pesada." width="8%"|width="10%"|width="19%"|width="21%"|width="19%"|width="10%"|width="10%"|width="31%">
<thead><tr>
<th scope="col">ID da transação</th>
<th scope="col">Estado da transação</th>
<th scope="col">Iniciado</th>
<th scope="col">ID do bloqueio solicitado</th>
<th scope="col">Início da espera da transação</th>
<th scope="col">Peso da transação</th>
<th scope="col">ID do thread do MySQL</th>
<th scope="col">Consulta</th>
</tr></thead><tbody>
<tr>
<th scope="row"><code class="literal">77F</code></th>
<td><code class="literal">LOCK WAIT</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">77F</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">1</code></td>
<td><code class="literal">876</code></td>
<td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td>
</tr>
<tr>
<th scope="row"><code class="literal">77E</code></th>
<td><code class="literal">LOCK WAIT</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">77E</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">1</code></td>
<td><code class="literal">875</code></td>
<td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td>
</tr>
<tr>
<th scope="row"><code class="literal">77D</code></th>
<td><code class="literal">LOCK WAIT</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">77D</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">1</code></td>
<td><code class="literal">874</code></td>
<td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td>
</tr>
<tr>
<th scope="row"><code class="literal">77B</code></th>
<td><code class="literal">LOCK WAIT</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">77B:733:12:1</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">4</code></td>
<td><code class="literal">873</code></td>
<td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td>
</tr>
<tr>
<th scope="row"><code class="literal">77A</code></th>
<td><code class="literal">RUN­NING</code></td>
<td><code class="literal">2008-01-15 13:10:16</code></td>
<td><code class="literal">NULL</code></td>
<td><code class="literal">NULL</code></td>
<td><code class="literal">4</code></td>
<td><code class="literal">872</code></td>
<td><code class="literal">SELECT b, c FROM t09 WHERE …</code></td>
</tr>
<tr>
<th scope="row"><code class="literal">E56</code></th>
<td><code class="literal">LOCK WAIT</code></td>
<td><code class="literal">2008-01-15 13:10:06</code></td>
<td><code class="literal">E56:743:6:2</code></td>
<td><code class="literal">2008-01-1

A tabela a seguir mostra o conteúdo da tabela `data_lock_waits` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela Performance Schema data_lock_waits, mostrando o funcionamento interno do bloqueio InnoDB sob uma carga de trabalho pesada."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">ID da transação solicitando</th> <th scope="col">ID do bloqueio solicitado</th> <th scope="col">ID da transação bloqueando</th> <th scope="col">ID do bloqueio bloqueando</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77E</code></td> <td><code class="literal">77E:806</code></td> </tr><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77D</code></td> <td><code class="literal">77D:806</code></td> </tr><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77E</code></th> <td><code class="literal">77E:806</code></td> <td><code class="literal">77D</code></td> <td><code class="literal">77D:806</code></td> </tr><tr> <th scope="row"><code class="literal">77E</code></th> <td><code class="literal">77E:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77D</code></th> <td><code class="literal">77D:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77B</code></th> <td><code class="literal">77B:733:12:1</code></td> <td><code class="literal">77A</code></td> <td><code class="literal">77A:733:12:1</code></td> </tr><tr> <th scope="row"><code class="literal">E56</code></th> <td><code class="literal">E56:743:6:2</code></td> <td><code class="literal">E55</code></td> <td><code class="literal">E55:743:6:2</code></td> </tr><tr> <th scope="row"><code class="literal">E55</code></th> <td><code class="literal">E55:743:38:2</code></td> <td><code class="literal">19C</code></td> <td><code class="literal">19C:743:38:2</code></td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela `data_locks` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela Performance Schema data_locks, mostrando o funcionamento interno do bloqueio InnoDB sob uma carga de trabalho pesada."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 9%"/><col style="width: 8%"/><col style="width: 15%"/><col style="width: 17%"/><thead><tr> <th scope="col">id do bloqueio</th> <th scope="col">id da transação</th> <th scope="col">modo do bloqueio</th> <th scope="col">tipo de bloqueio</th> <th scope="col">esquema do bloqueio</th> <th scope="col">tabela do bloqueio</th> <th scope="col">índice do bloqueio</th> <th scope="col">dados do bloqueio</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">77F:806</code></th> <td><code class="literal">77F</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77E:806</code></th> <td><code class="literal">77E</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77D:806</code></th> <td><code class="literal">77D</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77B:806</code></th> <td><code class="literal">77B</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77B:733:12:1</code></th> <td><code class="literal">77B</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">supremum pseudo-record</code></td> </tr><tr> <th scope="row"><code class="literal">77A:733:12:1</code></th> <td><code class="literal">77A</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td rowspan="2"><td><code class="literal">test</code></td> <td rowspan="2"><td><code class="literal">t09</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">supremum pseudo-record</code></td> </tr><tr> <td rowspan="2"><td><code class="literal">E56:743:6:2</code></td> <td><code class="literal">E56</code></td> <td><code class="literal">S</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t2</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0, 0</code></td> </tr><tr> <td rowspan="2"><td><code class="literal">E55:743:6:2</code></td> <td><code class="literal">E55