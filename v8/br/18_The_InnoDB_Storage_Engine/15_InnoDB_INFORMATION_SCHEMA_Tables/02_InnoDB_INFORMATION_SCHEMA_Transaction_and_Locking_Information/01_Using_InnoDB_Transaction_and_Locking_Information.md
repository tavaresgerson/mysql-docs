#### 17.15.2.1 Usando Informações de Transação e Bloqueio do InnoDB

Nota

Esta seção descreve as informações de bloqueio expostas pelas tabelas do Schema de Desempenho `data_locks` e `data_lock_waits`, que substituem as tabelas `INFORMATION_SCHEMA` `INNODB_LOCKS` e `INNODB_LOCK_WAITS` no MySQL 8.0. Para uma discussão semelhante escrita em termos das tabelas mais antigas `INFORMATION_SCHEMA`, consulte o Guia de Referência do MySQL 5.7, Usando Transações e Informações de Bloqueio do InnoDB.

##### Identificar transações bloqueadas

Às vezes, é útil identificar qual transação está bloqueando outra. As tabelas que contêm informações sobre as transações `InnoDB` e bloqueios de dados permitem determinar qual transação está esperando por outra e qual recurso está sendo solicitado. (Para descrições dessas tabelas, consulte a Seção 17.15.2, “Informações de Transações e Bloqueios do Schema de Informações InnoDB”.)

Suponha que três sessões estejam em execução simultaneamente. Cada sessão corresponde a um fio MySQL e executa uma transação após a outra. Considere o estado do sistema quando essas sessões emitiram as seguintes instruções, mas nenhuma ainda comprometeu sua transação:

- Sessão A:

  ```
  BEGIN;
  SELECT a FROM t FOR UPDATE;
  SELECT SLEEP(100);
  ```

- Sessão B:

  ```
  SELECT b FROM t FOR UPDATE;
  ```

- Sessão C:

  ```
  SELECT c FROM t FOR UPDATE;
  ```

Nesse cenário, use a seguinte consulta para ver quais transações estão aguardando e quais as estão bloqueando:

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

Ou, de forma mais simples, use a vista do esquema `sys` `innodb_lock_waits`:

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

Se um valor NULL for reportado para a consulta de bloqueio, consulte Identificando uma consulta de bloqueio após a sessão de emissão ficar inativa.

<table summary="O conjunto de resultados de uma consulta nas tabelas perormance_schema.data_lock_waits e INFORMATION_SCHEMA.INNODB_TRX, mostrada no texto anterior, indica quais threads do InnoDB estão esperando por quais outras threads."><thead><tr> <th scope="col">id de espera trx</th> <th scope="col">fila de espera</th> <th scope="col">consulta de espera</th> <th scope="col">bloquear o ID trx</th> <th scope="col">fio de bloqueio</th> <th scope="col">bloquear consulta</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>5</code>]</th> <td>[[PH_HTML_CODE_<code>5</code>]</td> <td>[[PH_HTML_CODE_<code>A5</code>]</td> <td>[[PH_HTML_CODE_<code>7</code>]</td> <td>[[PH_HTML_CODE_<code>SELECT c FROM t FOR UPDATE</code>]</td> <td>[[PH_HTML_CODE_<code>A4</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>6</code>]</th> <td>[[PH_HTML_CODE_<code>SELECT b FROM t FOR UPDATE</code>]</td> <td>[[<code>SELECT c FROM t FOR UPDATE</code>]]</td> <td>[[<code>A3</code>]]</td> <td>[[<code>5</code>]]</td> <td>[[<code>6</code><code>5</code>]</td> </tr><tr> <th>[[<code>A5</code>]]</th> <td>[[<code>7</code>]]</td> <td>[[<code>SELECT c FROM t FOR UPDATE</code>]]</td> <td>[[<code>A4</code>]]</td> <td>[[<code>6</code>]]</td> <td>[[<code>SELECT b FROM t FOR UPDATE</code>]]</td> </tr></tbody></table>

Na tabela anterior, você pode identificar as sessões pelas colunas “consulta de espera” ou “consulta bloqueada”. Como você pode ver:

- As sessões B (trx id `A4`, thread `6`) e C (trx id `A5`, thread `7`) estão aguardando a sessão A (trx id `A3`, thread `5`).

- A sessão C está esperando a sessão B, assim como a sessão A.

Você pode ver os dados subjacentes na tabela `INFORMATION_SCHEMA` `INNODB_TRX` e nas tabelas do Schema de Desempenho `data_locks` e `data_lock_waits`.

A tabela a seguir mostra alguns conteúdos de amostra da tabela `INNODB_TRX`.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando os tipos típicos de entradas para cada coluna."><thead><tr> <th scope="col">trx id</th> <th scope="col">trx estado</th> <th scope="col">trx começou</th> <th scope="col">trx solicitou o ID de bloqueio</th> <th scope="col">trx wait começou</th> <th scope="col">peso trx</th> <th scope="col">trx mysql thread id</th> <th scope="col">consulta trx</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</th> <td>[[PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</td> <td>[[PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</td> <td>[[PH_HTML_CODE_<code>2</code>]</td> <td>[[PH_HTML_CODE_<code>6</code>]</td> <td>[[PH_HTML_CODE_<code>SELECT b FROM t FOR UPDATE</code>]</td> <td>[[PH_HTML_CODE_<code>A5</code>]</td> <td>[[PH_HTML_CODE_<code>LOCK WAIT</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>2008-01-15 16:45:14</code>]</th> <td>[[PH_HTML_CODE_<code>A5:1:3:2</code>]</td> <td>[[<code>2008-01-15 16:45:09</code>]]</td> <td>[[<code>RUN­NING</code><code>2008-01-15 16:45:09</code>]</td> <td>[[<code>2008-01-15 16:45:09</code>]]</td> <td>[[<code>2</code>]]</td> <td>[[<code>6</code>]]</td> <td>[[<code>SELECT b FROM t FOR UPDATE</code>]]</td> </tr><tr> <th>[[<code>A5</code>]]</th> <td>[[<code>LOCK WAIT</code>]]</td> <td>[[<code>2008-01-15 16:45:14</code>]]</td> <td>[[<code>A5:1:3:2</code>]]</td> <td>[[<code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td>[[<code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td>[[<code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td>[[<code>2008-01-15 16:44:54</code><code>2</code>]</td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela `data_locks`.

<table summary="Dados de amostra da tabela data_locks do Performance Schema, mostrando os tipos típicos de entradas para cada coluna."><thead><tr> <th scope="col">chave de identificação</th> <th scope="col">chave trx id</th> <th scope="col">modo de bloqueio</th> <th scope="col">tipo de trava</th> <th scope="col">esquema de bloqueio</th> <th scope="col">trancar a tabela</th> <th scope="col">índice de bloqueio</th> <th scope="col">bloquear dados</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>X</code>]</th> <td>[[PH_HTML_CODE_<code>X</code>]</td> <td>[[PH_HTML_CODE_<code>test</code>]</td> <td>[[PH_HTML_CODE_<code>t</code>]</td> <td>[[PH_HTML_CODE_<code>PRIMARY</code>]</td> <td>[[PH_HTML_CODE_<code>0x0200</code>]</td> <td>[[PH_HTML_CODE_<code>A5:1:3:2</code>]</td> <td>[[PH_HTML_CODE_<code>A5</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>X</code>]</th> <td>[[PH_HTML_CODE_<code>RECORD</code>]</td> <td>[[<code>X</code>]]</td> <td>[[<code>A3</code><code>X</code>]</td> <td>[[<code>test</code>]]</td> <td>[[<code>t</code>]]</td> <td>[[<code>PRIMARY</code>]]</td> <td>[[<code>0x0200</code>]]</td> </tr><tr> <th>[[<code>A5:1:3:2</code>]]</th> <td>[[<code>A5</code>]]</td> <td>[[<code>X</code>]]</td> <td>[[<code>RECORD</code>]]</td> <td>[[<code>X</code><code>X</code>]</td> <td>[[<code>X</code><code>X</code>]</td> <td>[[<code>X</code><code>test</code>]</td> <td>[[<code>X</code><code>t</code>]</td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela `data_lock_waits`.

<table summary="Dados de amostra da tabela Performance Schema data_lock_waits, mostrando os tipos típicos de entradas para cada coluna."><thead><tr> <th scope="col">solicitando ID trx</th> <th scope="col">ID de bloqueio solicitado</th> <th scope="col">bloquear o ID trx</th> <th scope="col">bloqueio de identificação de bloqueio</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>A4</code>]</th> <td>[[PH_HTML_CODE_<code>A4</code>]</td> <td>[[<code>A3</code>]]</td> <td>[[<code>A3:1:3:2</code>]]</td> </tr><tr> <th>[[<code>A5</code>]]</th> <td>[[<code>A5:1:3:2</code>]]</td> <td>[[<code>A3</code>]]</td> <td>[[<code>A3:1:3:2</code>]]</td> </tr><tr> <th>[[<code>A5</code>]]</th> <td>[[<code>A5:1:3:2</code>]]</td> <td>[[<code>A4</code>]]</td> <td>[[<code>A4:1:3:2</code><code>A4</code>]</td> </tr></tbody></table>

##### Identificando uma consulta bloqueada após a sessão de emissão ficar inativa

Ao identificar transações bloqueadas, um valor NULL é reportado para a consulta de bloqueio se a sessão que emitiu a consulta se tornar inativa. Nesse caso, siga os passos abaixo para determinar a consulta de bloqueio:

1. Identifique o ID do processo da transação que está bloqueando. Na tabela `sys.innodb_lock_waits`, o ID do processo da transação que está bloqueando é o valor `blocking_pid`.

2. Usando o `blocking_pid`, consulte a tabela do Schema de Desempenho do MySQL `threads` para determinar o `THREAD_ID` da transação bloqueada. Por exemplo, se o `blocking_pid` for 6, execute esta consulta:

   ```
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Usando o `THREAD_ID`, consulte a tabela do Schema de Desempenho `events_statements_current` para determinar a última consulta executada pelo thread. Por exemplo, se o `THREAD_ID` for 28, execute esta consulta:

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. Se a última consulta executada pelo thread não for suficiente para determinar por que um bloqueio está sendo mantido, você pode consultar a tabela do Schema de Desempenho `events_statements_history` para visualizar as últimas 10 instruções executadas pelo thread.

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlação de Transações InnoDB com Sessões do MySQL

Às vezes, é útil correlacionar as informações de bloqueio interno `InnoDB` com as informações do nível de sessão mantidas pelo MySQL. Por exemplo, você pode querer saber, para um ID de transação `InnoDB` dado, o ID de sessão MySQL correspondente e o nome da sessão que pode estar mantendo um bloqueio, e assim bloqueando outras transações.

A saída a seguir da tabela `INFORMATION_SCHEMA` `INNODB_TRX` e das tabelas do Schema de Desempenho `data_locks` e `data_lock_waits` é obtida de um sistema um pouco sobrecarregado. Como pode ser visto, há várias transações em execução.

As tabelas `data_locks` e `data_lock_waits` a seguir mostram que:

- A transação `77F` (executando uma `INSERT`) está aguardando a confirmação das transações `77E`, `77D` e `77B`.

- A transação `77E` (executando uma `INSERT`) está aguardando a confirmação das transações `77D` e `77B`.

- A transação `77D` (executando uma transação `INSERT`) está aguardando o commit da transação `77B`.

- A transação `77B` (executando uma transação `INSERT`) está aguardando o commit da transação `77A`.

- A transação `77A` está em execução, atualmente executando `SELECT`.

- A transação `E56` (executando uma transação `INSERT`) está aguardando o commit da transação `E55`.

- A transação `E55` (executando uma transação `INSERT`) está aguardando o commit da transação `19C`.

- A transação `19C` está em execução, atualmente executando uma `INSERT`.

Nota

Pode haver inconsistências entre as consultas exibidas nas tabelas `INFORMATION_SCHEMA` `PROCESSLIST` e `INNODB_TRX`. Para uma explicação, consulte a Seção 17.15.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

A tabela a seguir mostra o conteúdo da tabela `PROCESSLIST` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.PROCESSLIST, mostrando o funcionamento interno dos processos do MySQL sob uma carga de trabalho intensa."><thead><tr> <th scope="col">ID</th> <th scope="col">USUÁRIO</th> <th scope="col">ANfitrião</th> <th scope="col">DB</th> <th scope="col">COMANDO</th> <th scope="col">TIME</th> <th scope="col">ESTADO</th> <th scope="col">INFORMAÇÕES</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>localhost</code>]</th> <td>[[PH_HTML_CODE_<code>localhost</code>]</td> <td>[[PH_HTML_CODE_<code>Query</code>]</td> <td>[[PH_HTML_CODE_<code>3</code>]</td> <td>[[PH_HTML_CODE_<code>update</code>]</td> <td>[[PH_HTML_CODE_<code>INSERT INTO t2 VALUES …</code>]</td> <td>[[PH_HTML_CODE_<code>130</code>]</td> <td>[[PH_HTML_CODE_<code>root</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>localhost</code>]</th> <td>[[PH_HTML_CODE_<code>test</code>]</td> <td>[[<code>localhost</code>]]</td> <td>[[<code>root</code><code>localhost</code>]</td> <td>[[<code>Query</code>]]</td> <td>[[<code>3</code>]]</td> <td>[[<code>update</code>]]</td> <td>[[<code>INSERT INTO t2 VALUES …</code>]]</td> </tr><tr> <th>[[<code>130</code>]]</th> <td>[[<code>root</code>]]</td> <td>[[<code>localhost</code>]]</td> <td>[[<code>test</code>]]</td> <td>[[<code>localhost</code><code>localhost</code>]</td> <td>[[<code>localhost</code><code>localhost</code>]</td> <td>[[<code>localhost</code><code>Query</code>]</td> <td>[[<code>localhost</code><code>3</code>]</td> </tr><tr> <th>[[<code>localhost</code><code>update</code>]</th> <td>[[<code>localhost</code><code>INSERT INTO t2 VALUES …</code>]</td> <td>[[<code>localhost</code><code>130</code>]</td> <td>[[<code>localhost</code><code>root</code>]</td> <td>[[<code>localhost</code><code>localhost</code>]</td> <td>[[<code>localhost</code><code>test</code>]</td> <td>[[<code>test</code><code>localhost</code>]</td> <td>[[<code>test</code><code>localhost</code>]</td> </tr><tr> <th>[[<code>test</code><code>Query</code>]</th> <td>[[<code>test</code><code>3</code>]</td> <td>[[<code>test</code><code>update</code>]</td> <td>[[<code>test</code><code>INSERT INTO t2 VALUES …</code>]</td> <td>[[<code>test</code><code>130</code>]</td> <td>[[<code>test</code><code>root</code>]</td> <td>[[<code>test</code><code>localhost</code>]</td> <td>[[<code>test</code><code>test</code>]</td> </tr><tr> <th>[[<code>Query</code><code>localhost</code>]</th> <td>[[<code>Query</code><code>localhost</code>]</td> <td>[[<code>Query</code><code>Query</code>]</td> <td>[[<code>Query</code><code>3</code>]</td> <td>[[<code>Query</code><code>update</code>]</td> <td>[[<code>Query</code><code>INSERT INTO t2 VALUES …</code>]</td> <td>[[<code>Query</code><code>130</code>]</td> <td>[[<code>Query</code><code>root</code>]</td> </tr><tr> <th>[[<code>Query</code><code>localhost</code>]</th> <td>[[<code>Query</code><code>test</code>]</td> <td>[[<code>10</code><code>localhost</code>]</td> <td>[[<code>10</code><code>localhost</code>]</td> <td>[[<code>10</code><code>Query</code>]</td> <td>[[<code>10</code><code>3</code>]</td> <td>[[<code>10</code><code>update</code>]</td> <td>[[<code>10</code><code>INSERT INTO t2 VALUES …</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela `INNODB_TRX` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando o funcionamento interno das transações do InnoDB sob uma carga de trabalho pesada."><thead><tr> <th scope="col">trx id</th> <th scope="col">trx estado</th> <th scope="col">trx começou</th> <th scope="col">trx solicitou o ID de bloqueio</th> <th scope="col">trx wait começou</th> <th scope="col">peso trx</th> <th scope="col">trx mysql thread id</th> <th scope="col">consulta trx</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</th> <td>[[PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</td> <td>[[PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</td> <td>[[PH_HTML_CODE_<code>1</code>]</td> <td>[[PH_HTML_CODE_<code>875</code>]</td> <td>[[PH_HTML_CODE_<code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[PH_HTML_CODE_<code>77D</code>]</td> <td>[[PH_HTML_CODE_<code>LOCK WAIT</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</th> <td>[[PH_HTML_CODE_<code>77D</code>]</td> <td>[[<code>2008-01-15 13:10:16</code>]]</td> <td>[[<code>LOCK WAIT</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code>]]</td> <td>[[<code>1</code>]]</td> <td>[[<code>875</code>]]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code>]]</td> </tr><tr> <th>[[<code>77D</code>]]</th> <td>[[<code>LOCK WAIT</code>]]</td> <td>[[<code>2008-01-15 13:10:16</code>]]</td> <td>[[<code>77D</code>]]</td> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>1</code>]</td> </tr><tr> <th>[[<code>2008-01-15 13:10:16</code><code>875</code>]</th> <td>[[<code>2008-01-15 13:10:16</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>LOCK WAIT</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td>[[<code>77F</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>77F</code><code>2008-01-15 13:10:16</code>]</td> </tr><tr> <th>[[<code>77F</code><code>2008-01-15 13:10:16</code>]</th> <td>[[<code>77F</code><code>1</code>]</td> <td>[[<code>77F</code><code>875</code>]</td> <td>[[<code>77F</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[<code>77F</code><code>77D</code>]</td> <td>[[<code>77F</code><code>LOCK WAIT</code>]</td> <td>[[<code>77F</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>77F</code><code>77D</code>]</td> </tr><tr> <th>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</th> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>1</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>875</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td>[[<code>2008-01-15 13:10:16</code><code>LOCK WAIT</code>]</td> </tr><tr> <th>[[<code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</th> <td>[[<code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td>[[<code>1</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>1</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>1</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>1</code><code>1</code>]</td> <td>[[<code>1</code><code>875</code>]</td> <td>[[<code>1</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> </tr><tr> <th>[[<code>1</code><code>77D</code>]</th> <td>[[<code>1</code><code>LOCK WAIT</code>]</td> <td>[[<code>1</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>1</code><code>77D</code>]</td> <td>[[<code>876</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>876</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>876</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>876</code><code>1</code>]</td> </tr><tr> <th>[[<code>876</code><code>875</code>]</th> <td>[[<code>876</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[<code>876</code><code>77D</code>]</td> <td>[[<code>876</code><code>LOCK WAIT</code>]</td> <td>[[<code>876</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>876</code><code>77D</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> </tr><tr> <th>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</th> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>1</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>875</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>77D</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>LOCK WAIT</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> <td>[[<code>INSERT INTO t09 (D, B, C) VALUES …</code><code>77D</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela `data_lock_waits` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela Performance Schema data_lock_waits, mostrando o funcionamento interno do bloqueio do InnoDB sob uma carga de trabalho pesada."><thead><tr> <th scope="col">solicitando ID trx</th> <th scope="col">ID de bloqueio solicitado</th> <th scope="col">bloquear o ID trx</th> <th scope="col">bloqueio de identificação de bloqueio</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>77B</code>]</th> <td>[[PH_HTML_CODE_<code>77B</code>]</td> <td>[[PH_HTML_CODE_<code>77E</code>]</td> <td>[[PH_HTML_CODE_<code>77E:806</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>77D</code>]</th> <td>[[PH_HTML_CODE_<code>77D:806</code>]</td> <td>[[PH_HTML_CODE_<code>77E</code>]</td> <td>[[PH_HTML_CODE_<code>77E:806</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>77B</code>]</th> <td>[[PH_HTML_CODE_<code>77B:806</code>]</td> <td>[[<code>77B</code>]]</td> <td>[[<code>77F:806</code><code>77B</code>]</td> </tr><tr> <th>[[<code>77E</code>]]</th> <td>[[<code>77E:806</code>]]</td> <td>[[<code>77D</code>]]</td> <td>[[<code>77D:806</code>]]</td> </tr><tr> <th>[[<code>77E</code>]]</th> <td>[[<code>77E:806</code>]]</td> <td>[[<code>77B</code>]]</td> <td>[[<code>77B:806</code>]]</td> </tr><tr> <th>[[<code>77E</code><code>77B</code>]</th> <td>[[<code>77E</code><code>77B</code>]</td> <td>[[<code>77E</code><code>77E</code>]</td> <td>[[<code>77E</code><code>77E:806</code>]</td> </tr><tr> <th>[[<code>77E</code><code>77D</code>]</th> <td>[[<code>77E</code><code>77D:806</code>]</td> <td>[[<code>77E</code><code>77E</code>]</td> <td>[[<code>77E</code><code>77E:806</code>]</td> </tr><tr> <th>[[<code>77E</code><code>77B</code>]</th> <td>[[<code>77E</code><code>77B:806</code>]</td> <td>[[<code>77E:806</code><code>77B</code>]</td> <td>[[<code>77E:806</code><code>77B</code>]</td> </tr><tr> <th>[[<code>77E:806</code><code>77E</code>]</th> <td>[[<code>77E:806</code><code>77E:806</code>]</td> <td>[[<code>77E:806</code><code>77D</code>]</td> <td>[[<code>77E:806</code><code>77D:806</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela `data_locks` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela data_locks do Performance Schema, mostrando o funcionamento interno do bloqueio do InnoDB sob uma carga de trabalho pesada."><thead><tr> <th scope="col">chave de identificação</th> <th scope="col">chave trx id</th> <th scope="col">modo de bloqueio</th> <th scope="col">tipo de trava</th> <th scope="col">esquema de bloqueio</th> <th scope="col">trancar a tabela</th> <th scope="col">índice de bloqueio</th> <th scope="col">bloquear dados</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>AUTO_INC</code>]</th> <td>[[PH_HTML_CODE_<code>AUTO_INC</code>]</td> <td>[[PH_HTML_CODE_<code>test</code>]</td> <td>[[PH_HTML_CODE_<code>t09</code>]</td> <td>[[PH_HTML_CODE_<code>NULL</code>]</td> <td>[[PH_HTML_CODE_<code>NULL</code>]</td> <td>[[PH_HTML_CODE_<code>77D:806</code>]</td> <td>[[PH_HTML_CODE_<code>77D</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>AUTO_INC</code>]</th> <td>[[PH_HTML_CODE_<code>TABLE</code>]</td> <td>[[<code>AUTO_INC</code>]]</td> <td>[[<code>77F</code><code>AUTO_INC</code>]</td> <td>[[<code>test</code>]]</td> <td>[[<code>t09</code>]]</td> <td>[[<code>NULL</code>]]</td> <td>[[<code>NULL</code>]]</td> </tr><tr> <th>[[<code>77D:806</code>]]</th> <td>[[<code>77D</code>]]</td> <td>[[<code>AUTO_INC</code>]]</td> <td>[[<code>TABLE</code>]]</td> <td>[[<code>AUTO_INC</code><code>AUTO_INC</code>]</td> <td>[[<code>AUTO_INC</code><code>AUTO_INC</code>]</td> <td>[[<code>AUTO_INC</code><code>test</code>]</td> <td>[[<code>AUTO_INC</code><code>t09</code>]</td> </tr><tr> <th>[[<code>AUTO_INC</code><code>NULL</code>]</th> <td>[[<code>AUTO_INC</code><code>NULL</code>]</td> <td>[[<code>AUTO_INC</code><code>77D:806</code>]</td> <td>[[<code>AUTO_INC</code><code>77D</code>]</td> <td>[[<code>AUTO_INC</code><code>AUTO_INC</code>]</td> <td>[[<code>AUTO_INC</code><code>TABLE</code>]</td> <td>[[<code>TABLE</code><code>AUTO_INC</code>]</td> <td>[[<code>TABLE</code><code>AUTO_INC</code>]</td> </tr><tr> <th>[[<code>TABLE</code><code>test</code>]</th> <td>[[<code>TABLE</code><code>t09</code>]</td> <td>[[<code>TABLE</code><code>NULL</code>]</td> <td>[[<code>TABLE</code><code>NULL</code>]</td> <td>[[<code>TABLE</code><code>77D:806</code>]</td> <td>[[<code>TABLE</code><code>77D</code>]</td> <td>[[<code>TABLE</code><code>AUTO_INC</code>]</td> <td>[[<code>TABLE</code><code>TABLE</code>]</td> </tr><tr> <th>[[<code>test</code><code>AUTO_INC</code>]</th> <td>[[<code>test</code><code>AUTO_INC</code>]</td> <td>[[<code>test</code><code>test</code>]</td> <td>[[<code>test</code><code>t09</code>]</td> <td>[[<code>test</code><code>NULL</code>]</td> <td>[[<code>test</code><code>NULL</code>]</td> <td>[[<code>test</code><code>77D:806</code>]</td> <td>[[<code>test</code><code>77D</code>]</td> </tr><tr> <th>[[<code>test</code><code>AUTO_INC</code>]</th> <td>[[<code>test</code><code>TABLE</code>]</td> <td>[[<code>t09</code><code>AUTO_INC</code>]</td> <td>[[<code>t09</code><code>AUTO_INC</code>]</td> <td>[[<code>t09</code><code>test</code>]</td> <td>[[<code>t09</code><code>t09</code>]</td> <td>[[<code>t09</code><code>NULL</code>]</td> <td>[[<code>t09</code><code>NULL</code>]</td> </tr><tr> <th>[[<code>t09</code><code>77D:806</code>]</th> <td>[[<code>t09</code><code>77D</code>]</td> <td>[[<code>t09</code><code>AUTO_INC</code>]</td> <td>[[<code>t09</code><code>TABLE</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> <td>[[<code>NULL</code><code>test</code>]</td> <td>[[<code>NULL</code><code>t09</code>]</td> </tr><tr> <th>[[<code>NULL</code><code>NULL</code>]</th> <td>[[<code>NULL</code><code>NULL</code>]</td> <td>[[<code>NULL</code><code>77D:806</code>]</td> <td>[[<code>NULL</code><code>77D</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> <td>[[<code>NULL</code><code>TABLE</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> </tr><tr> <th>[[<code>NULL</code><code>test</code>]</th> <td>[[<code>NULL</code><code>t09</code>]</td> <td>[[<code>NULL</code><code>NULL</code>]</td> <td>[[<code>NULL</code><code>NULL</code>]</td> <td>[[<code>NULL</code><code>77D:806</code>]</td> <td>[[<code>NULL</code><code>77D</code>]</td> <td>[[<code>NULL</code><code>AUTO_INC</code>]</td> <td>[[<code>NULL</code><code>TABLE</code>]</td> </tr></tbody></table>
