#### 14.16.2.1 Usando Informações de Transação e Bloqueio do InnoDB

##### Identificar transações bloqueadas

Às vezes, é útil identificar qual transação está bloqueando outra. As tabelas que contêm informações sobre transações e bloqueios de dados do `InnoDB` permitem determinar qual transação está esperando por outra e qual recurso está sendo solicitado. (Para descrições dessas tabelas, consulte a Seção 14.16.2, “Informações de Transações e Bloqueios do InnoDB do Schema de Informações”).

Suponha que três sessões estejam em execução simultaneamente. Cada sessão corresponde a um fio MySQL e executa uma transação após a outra. Considere o estado do sistema quando essas sessões emitiram as seguintes instruções, mas nenhuma ainda comprometeu sua transação:

- Sessão A:

  ```sql
  BEGIN;
  SELECT a FROM t FOR UPDATE;
  SELECT SLEEP(100);
  ```

- Sessão B:

  ```sql
  SELECT b FROM t FOR UPDATE;
  ```

- Sessão C:

  ```sql
  SELECT c FROM t FOR UPDATE;
  ```

Nesse cenário, use a seguinte consulta para ver quais transações estão aguardando e quais as estão bloqueando:

```sql
SELECT
  r.trx_id waiting_trx_id,
  r.trx_mysql_thread_id waiting_thread,
  r.trx_query waiting_query,
  b.trx_id blocking_trx_id,
  b.trx_mysql_thread_id blocking_thread,
  b.trx_query blocking_query
FROM       information_schema.innodb_lock_waits w
INNER JOIN information_schema.innodb_trx b
  ON b.trx_id = w.blocking_trx_id
INNER JOIN information_schema.innodb_trx r
  ON r.trx_id = w.requesting_trx_id;
```

Ou, de forma mais simples, use a visão `sys` do esquema `innodb_lock_waits`:

```sql
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

<table summary="O conjunto de resultados de uma consulta nas tabelas INFORMATION_SCHEMA.INNODB_LOCK_WAITS e INFORMATION_SCHEMA.INNODB_TRX, mostrada no texto anterior, indica quais threads do InnoDB estão esperando por quais outras threads."><col style="width: 9%"/><col style="width: 9%"/><col style="width: 33%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 33%"/><thead><tr> <th>id de espera trx</th> <th>fila de espera</th> <th>consulta de espera</th> <th>bloquear o ID trx</th> <th>fio de bloqueio</th> <th>bloquear consulta</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>5</code>]</th> <td>PH_HTML_CODE_<code>5</code>]</td> <td>PH_HTML_CODE_<code>A5</code>]</td> <td>PH_HTML_CODE_<code>7</code>]</td> <td>PH_HTML_CODE_<code>SELECT c FROM t FOR UPDATE</code>]</td> <td>PH_HTML_CODE_<code>A4</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>6</code>]</th> <td>PH_HTML_CODE_<code>SELECT b FROM t FOR UPDATE</code>]</td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A3</code></td> <td><code>5</code></td> <td><code>6</code><code>5</code>]</td> </tr><tr> <th><code>A5</code></th> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A4</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr></tbody></table>

Na tabela anterior, você pode identificar as sessões pelas colunas “consulta de espera” ou “consulta bloqueada”. Como você pode ver:

- A sessão B (id de transação `A4`, fio `6`) e a sessão C (id de transação `A5`, fio `7`) estão ambas aguardando a sessão A (id de transação `A3`, fio `5`).

- A sessão C está esperando a sessão B, assim como a sessão A.

Você pode ver os dados subjacentes nas tabelas `INNODB_TRX`, `INNODB_LOCKS` e `INNODB_LOCK_WAITS`.

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_TRX`.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th>trx id</th> <th>trx estado</th> <th>trx começou</th> <th>trx solicitou o ID de bloqueio</th> <th>trx wait começou</th> <th>peso trx</th> <th>trx mysql thread id</th> <th>consulta trx</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</th> <td>PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</td> <td>PH_HTML_CODE_<code>2008-01-15 16:45:09</code>]</td> <td>PH_HTML_CODE_<code>2</code>]</td> <td>PH_HTML_CODE_<code>6</code>]</td> <td>PH_HTML_CODE_<code>SELECT b FROM t FOR UPDATE</code>]</td> <td>PH_HTML_CODE_<code>A5</code>]</td> <td>PH_HTML_CODE_<code>LOCK WAIT</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>2008-01-15 16:45:14</code>]</th> <td>PH_HTML_CODE_<code>A5:1:3:2</code>]</td> <td><code>2008-01-15 16:45:09</code></td> <td><code>RUN­NING</code><code>2008-01-15 16:45:09</code>]</td> <td><code>2008-01-15 16:45:09</code></td> <td><code>2</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr><tr> <th><code>A5</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 16:45:14</code></td> <td><code>A5:1:3:2</code></td> <td><code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td><code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td><code>2008-01-15 16:44:54</code><code>2008-01-15 16:45:09</code>]</td> <td><code>2008-01-15 16:44:54</code><code>2</code>]</td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_LOCKS`.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_LOCKS, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 31%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th>chave de identificação</th> <th>chave trx id</th> <th>modo de bloqueio</th> <th>tipo de trava</th> <th>trancar a tabela</th> <th>índice de bloqueio</th> <th>bloquear dados</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>RECORD</code>]</th> <td>PH_HTML_CODE_<code>RECORD</code>]</td> <td>PH_HTML_CODE_<code>PRIMARY</code>]</td> <td>PH_HTML_CODE_<code>0x0200</code>]</td> <td>PH_HTML_CODE_<code>A5:1:3:2</code>]</td> <td>PH_HTML_CODE_<code>A5</code>]</td> <td>PH_HTML_CODE_<code>X</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>RECORD</code>]</th> <td>PH_HTML_CODE_<code>test.t</code>]</td> <td>PH_HTML_CODE_<code>PRIMARY</code>]</td> <td><code>RECORD</code></td> <td><code>A3</code><code>RECORD</code>]</td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr><tr> <th><code>A5:1:3:2</code></th> <td><code>A5</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t</code></td> <td><code>PRIMARY</code></td> <td><code>X</code><code>RECORD</code>]</td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_LOCK_WAITS`.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_LOCK_WAITS, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><thead><tr> <th>solicitando ID trx</th> <th>ID de bloqueio solicitado</th> <th>bloquear o ID trx</th> <th>bloqueio de identificação de bloqueio</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>A4</code>]</th> <td>PH_HTML_CODE_<code>A4</code>]</td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A4</code></td> <td><code>A4:1:3:2</code><code>A4</code>]</td> </tr></tbody></table>

##### Identificando uma consulta bloqueada após a sessão de emissão ficar inativa

Ao identificar transações bloqueadas, um valor NULL é reportado para a consulta de bloqueio se a sessão que emitiu a consulta se tornar inativa. Nesse caso, siga os passos abaixo para determinar a consulta de bloqueio:

1. Identifique o ID do processo da transação que está bloqueando. Na tabela `sys.innodb_lock_waits`, o ID do processo da transação que está bloqueando é o valor `blocking_pid`.

2. Usando `blocking_pid`, consulte a tabela `threads` do Schema de Desempenho do MySQL para determinar o `THREAD_ID` da transação bloqueada. Por exemplo, se `blocking_pid` for 6, execute esta consulta:

   ```sql
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Usando o `THREAD_ID`, consulte a tabela `events_statements_current` do Schema de Desempenho para determinar a última consulta executada pelo thread. Por exemplo, se o `THREAD_ID` for 28, execute esta consulta:

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. Se a última consulta executada pelo thread não for suficiente para determinar por que um bloqueio está sendo mantido, você pode consultar a tabela `events_statements_history` do Gerenciamento de Desempenho para visualizar as últimas 10 instruções executadas pelo thread.

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlação de Transações InnoDB com Sessões do MySQL

Às vezes, é útil correlacionar as informações de bloqueio do `InnoDB` interno com as informações de nível de sessão mantidas pelo MySQL. Por exemplo, você pode querer saber, para um ID de transação `InnoDB` específico, o ID de sessão MySQL correspondente e o nome da sessão que pode estar segurando um bloqueio, e assim bloqueando outras transações.

O seguinte resultado das tabelas `INFORMATION_SCHEMA` é obtido de um sistema um pouco sobrecarregado. Como pode ser visto, há várias transações em execução.

As tabelas `INNODB_LOCKS` e `INNODB_LOCK_WAITS` a seguir mostram que:

- A transação `77F` (que executa um `INSERT`) está aguardando o commit das transações `77E`, `77D` e `77B`.

- A transação `77E` (executando uma `INSERT`) está aguardando a conclusão das transações `77D` e `77B`.

- A transação `77D` (executando uma `INSERT`) está aguardando o commit da transação `77B`.

- A transação `77B` (executando uma `INSERT`) está aguardando o commit da transação `77A`.

- A transação `77A` está em execução, atualmente executando `SELECT`.

- A transação `E56` (executando uma `INSERT`) está aguardando o commit da transação `E55`.

- A transação `E55` (executando uma `INSERT`) está aguardando o commit da transação `19C`.

- A transação `19C` está em execução, atualmente executando uma `INSERT`.

Nota

Pode haver inconsistências entre as consultas exibidas nas tabelas `INFORMATION_SCHEMA` `PROCESSLIST` e `INNODB_TRX`. Para uma explicação, consulte a Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `PROCESSLIST` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.PROCESSLIST, mostrando o funcionamento interno dos processos do MySQL sob uma carga de trabalho intensa."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>ID</th> <th>USUÁRIO</th> <th>ANfitrião</th> <th>DB</th> <th>COMANDO</th> <th>TIME</th> <th>ESTADO</th> <th>INFORMAÇÕES</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>localhost</code>]</th> <td>PH_HTML_CODE_<code>localhost</code>]</td> <td>PH_HTML_CODE_<code>Query</code>]</td> <td>PH_HTML_CODE_<code>3</code>]</td> <td>PH_HTML_CODE_<code>update</code>]</td> <td>PH_HTML_CODE_<code>INSERT INTO t2 VALUES …</code>]</td> <td>PH_HTML_CODE_<code>130</code>]</td> <td>PH_HTML_CODE_<code>root</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>localhost</code>]</th> <td>PH_HTML_CODE_<code>test</code>]</td> <td><code>localhost</code></td> <td><code>root</code><code>localhost</code>]</td> <td><code>Query</code></td> <td><code>3</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>130</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>localhost</code><code>localhost</code>]</td> <td><code>localhost</code><code>localhost</code>]</td> <td><code>localhost</code><code>Query</code>]</td> <td><code>localhost</code><code>3</code>]</td> </tr><tr> <th><code>localhost</code><code>update</code>]</th> <td><code>localhost</code><code>INSERT INTO t2 VALUES …</code>]</td> <td><code>localhost</code><code>130</code>]</td> <td><code>localhost</code><code>root</code>]</td> <td><code>localhost</code><code>localhost</code>]</td> <td><code>localhost</code><code>test</code>]</td> <td><code>test</code><code>localhost</code>]</td> <td><code>test</code><code>localhost</code>]</td> </tr><tr> <th><code>test</code><code>Query</code>]</th> <td><code>test</code><code>3</code>]</td> <td><code>test</code><code>update</code>]</td> <td><code>test</code><code>INSERT INTO t2 VALUES …</code>]</td> <td><code>test</code><code>130</code>]</td> <td><code>test</code><code>root</code>]</td> <td><code>test</code><code>localhost</code>]</td> <td><code>test</code><code>test</code>]</td> </tr><tr> <th><code>Query</code><code>localhost</code>]</th> <td><code>Query</code><code>localhost</code>]</td> <td><code>Query</code><code>Query</code>]</td> <td><code>Query</code><code>3</code>]</td> <td><code>Query</code><code>update</code>]</td> <td><code>Query</code><code>INSERT INTO t2 VALUES …</code>]</td> <td><code>Query</code><code>130</code>]</td> <td><code>Query</code><code>root</code>]</td> </tr><tr> <th><code>Query</code><code>localhost</code>]</th> <td><code>Query</code><code>test</code>]</td> <td><code>10</code><code>localhost</code>]</td> <td><code>10</code><code>localhost</code>]</td> <td><code>10</code><code>Query</code>]</td> <td><code>10</code><code>3</code>]</td> <td><code>10</code><code>update</code>]</td> <td><code>10</code><code>INSERT INTO t2 VALUES …</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_TRX` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando o funcionamento interno das transações do InnoDB sob uma carga de trabalho pesada."><col style="width: 8%"/><col style="width: 10%"/><col style="width: 19%"/><col style="width: 21%"/><col style="width: 19%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 31%"/><thead><tr> <th>trx id</th> <th>trx estado</th> <th>trx começou</th> <th>trx solicitou o ID de bloqueio</th> <th>trx wait começou</th> <th>peso trx</th> <th>trx mysql thread id</th> <th>consulta trx</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</th> <td>PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</td> <td>PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</td> <td>PH_HTML_CODE_<code>1</code>]</td> <td>PH_HTML_CODE_<code>875</code>]</td> <td>PH_HTML_CODE_<code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td>PH_HTML_CODE_<code>77D</code>]</td> <td>PH_HTML_CODE_<code>LOCK WAIT</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>2008-01-15 13:10:16</code>]</th> <td>PH_HTML_CODE_<code>77D</code>]</td> <td><code>2008-01-15 13:10:16</code></td> <td><code>LOCK WAIT</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>875</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77D</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77D</code></td> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>1</code>]</td> </tr><tr> <th><code>2008-01-15 13:10:16</code><code>875</code>]</th> <td><code>2008-01-15 13:10:16</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td><code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td><code>2008-01-15 13:10:16</code><code>LOCK WAIT</code>]</td> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td><code>77F</code><code>2008-01-15 13:10:16</code>]</td> <td><code>77F</code><code>2008-01-15 13:10:16</code>]</td> </tr><tr> <th><code>77F</code><code>2008-01-15 13:10:16</code>]</th> <td><code>77F</code><code>1</code>]</td> <td><code>77F</code><code>875</code>]</td> <td><code>77F</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td><code>77F</code><code>77D</code>]</td> <td><code>77F</code><code>LOCK WAIT</code>]</td> <td><code>77F</code><code>2008-01-15 13:10:16</code>]</td> <td><code>77F</code><code>77D</code>]</td> </tr><tr> <th><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</th> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</td> <td><code>2008-01-15 13:10:16</code><code>1</code>]</td> <td><code>2008-01-15 13:10:16</code><code>875</code>]</td> <td><code>2008-01-15 13:10:16</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td><code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td><code>2008-01-15 13:10:16</code><code>LOCK WAIT</code>]</td> </tr><tr> <th><code>2008-01-15 13:10:16</code><code>2008-01-15 13:10:16</code>]</th> <td><code>2008-01-15 13:10:16</code><code>77D</code>]</td> <td><code>1</code><code>2008-01-15 13:10:16</code>]</td> <td><code>1</code><code>2008-01-15 13:10:16</code>]</td> <td><code>1</code><code>2008-01-15 13:10:16</code>]</td> <td><code>1</code><code>1</code>]</td> <td><code>1</code><code>875</code>]</td> <td><code>1</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> </tr><tr> <th><code>1</code><code>77D</code>]</th> <td><code>1</code><code>LOCK WAIT</code>]</td> <td><code>1</code><code>2008-01-15 13:10:16</code>]</td> <td><code>1</code><code>77D</code>]</td> <td><code>876</code><code>2008-01-15 13:10:16</code>]</td> <td><code>876</code><code>2008-01-15 13:10:16</code>]</td> <td><code>876</code><code>2008-01-15 13:10:16</code>]</td> <td><code>876</code><code>1</code>]</td> </tr><tr> <th><code>876</code><code>875</code>]</th> <td><code>876</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td><code>876</code><code>77D</code>]</td> <td><code>876</code><code>LOCK WAIT</code>]</td> <td><code>876</code><code>2008-01-15 13:10:16</code>]</td> <td><code>876</code><code>77D</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> </tr><tr> <th><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</th> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>1</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>875</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>INSERT INTO t09 (D, B, C) VALUES …</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>77D</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>LOCK WAIT</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>2008-01-15 13:10:16</code>]</td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code><code>77D</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_LOCK_WAITS` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_LOCK_WAITS, mostrando o funcionamento interno do bloqueio do InnoDB sob uma carga de trabalho pesada."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>solicitando ID trx</th> <th>ID de bloqueio solicitado</th> <th>bloquear o ID trx</th> <th>bloqueio de identificação de bloqueio</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>77B</code>]</th> <td>PH_HTML_CODE_<code>77B</code>]</td> <td>PH_HTML_CODE_<code>77E</code>]</td> <td>PH_HTML_CODE_<code>77E:806</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>77D</code>]</th> <td>PH_HTML_CODE_<code>77D:806</code>]</td> <td>PH_HTML_CODE_<code>77E</code>]</td> <td>PH_HTML_CODE_<code>77E:806</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>77B</code>]</th> <td>PH_HTML_CODE_<code>77B:806</code>]</td> <td><code>77B</code></td> <td><code>77F:806</code><code>77B</code>]</td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77D</code></td> <td><code>77D:806</code></td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77E</code><code>77B</code>]</th> <td><code>77E</code><code>77B</code>]</td> <td><code>77E</code><code>77E</code>]</td> <td><code>77E</code><code>77E:806</code>]</td> </tr><tr> <th><code>77E</code><code>77D</code>]</th> <td><code>77E</code><code>77D:806</code>]</td> <td><code>77E</code><code>77E</code>]</td> <td><code>77E</code><code>77E:806</code>]</td> </tr><tr> <th><code>77E</code><code>77B</code>]</th> <td><code>77E</code><code>77B:806</code>]</td> <td><code>77E:806</code><code>77B</code>]</td> <td><code>77E:806</code><code>77B</code>]</td> </tr><tr> <th><code>77E:806</code><code>77E</code>]</th> <td><code>77E:806</code><code>77E:806</code>]</td> <td><code>77E:806</code><code>77D</code>]</td> <td><code>77E:806</code><code>77D:806</code>]</td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_LOCKS` para um sistema que executa uma carga de trabalho pesada.

<table summary="Dados de amostra da tabela INFORMATION_SCHEMA.INNODB_LOCKS, mostrando o funcionamento interno do bloqueio do InnoDB sob uma carga de trabalho pesada."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 14%"/><col style="width: 17%"/><col style="width: 17%"/><thead><tr> <th>chave de identificação</th> <th>chave trx id</th> <th>modo de bloqueio</th> <th>tipo de trava</th> <th>trancar a tabela</th> <th>índice de bloqueio</th> <th>bloquear dados</th> </tr></thead><tbody><tr> <th>PH_HTML_CODE_<code>TABLE</code>]</th> <td>PH_HTML_CODE_<code>TABLE</code>]</td> <td>PH_HTML_CODE_<code>NULL</code>]</td> <td>PH_HTML_CODE_<code>NULL</code>]</td> <td>PH_HTML_CODE_<code>77D:806</code>]</td> <td>PH_HTML_CODE_<code>77D</code>]</td> <td>PH_HTML_CODE_<code>AUTO_INC</code>]</td> </tr><tr> <th>PH_HTML_CODE_<code>TABLE</code>]</th> <td>PH_HTML_CODE_<code>test.t09</code>]</td> <td>PH_HTML_CODE_<code>NULL</code>]</td> <td><code>TABLE</code></td> <td><code>77F</code><code>TABLE</code>]</td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77D:806</code></th> <td><code>77D</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test.t09</code></td> <td><code>NULL</code></td> <td><code>AUTO_INC</code><code>TABLE</code>]</td> </tr><tr> <th><code>AUTO_INC</code><code>TABLE</code>]</th> <td><code>AUTO_INC</code><code>NULL</code>]</td> <td><code>AUTO_INC</code><code>NULL</code>]</td> <td><code>AUTO_INC</code><code>77D:806</code>]</td> <td><code>AUTO_INC</code><code>77D</code>]</td> <td><code>AUTO_INC</code><code>AUTO_INC</code>]</td> <td><code>AUTO_INC</code><code>TABLE</code>]</td> </tr><tr> <th><code>AUTO_INC</code><code>test.t09</code>]</th> <td><code>AUTO_INC</code><code>NULL</code>]</td> <td><code>TABLE</code><code>TABLE</code>]</td> <td><code>TABLE</code><code>TABLE</code>]</td> <td><code>TABLE</code><code>NULL</code>]</td> <td><code>TABLE</code><code>NULL</code>]</td> <td><code>TABLE</code><code>77D:806</code>]</td> </tr><tr> <th><code>TABLE</code><code>77D</code>]</th> <td><code>TABLE</code><code>AUTO_INC</code>]</td> <td><code>TABLE</code><code>TABLE</code>]</td> <td><code>TABLE</code><code>test.t09</code>]</td> <td><code>TABLE</code><code>NULL</code>]</td> <td><code>test.t09</code><code>TABLE</code>]</td> <td><code>test.t09</code><code>TABLE</code>]</td> </tr><tr> <th><code>test.t09</code><code>NULL</code>]</th> <td><code>test.t09</code><code>NULL</code>]</td> <td><code>test.t09</code><code>77D:806</code>]</td> <td><code>test.t09</code><code>77D</code>]</td> <td><code>test.t09</code><code>AUTO_INC</code>]</td> <td><code>test.t09</code><code>TABLE</code>]</td> <td><code>test.t09</code><code>test.t09</code>]</td> </tr><tr> <th><code>test.t09</code><code>NULL</code>]</th> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>NULL</code>]</td> <td><code>NULL</code><code>NULL</code>]</td> <td><code>NULL</code><code>77D:806</code>]</td> <td><code>NULL</code><code>77D</code>]</td> </tr><tr> <th><code>NULL</code><code>AUTO_INC</code>]</th> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>test.t09</code>]</td> <td><code>NULL</code><code>NULL</code>]</td> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>NULL</code>]</td> </tr><tr> <th><code>NULL</code><code>NULL</code>]</th> <td><code>NULL</code><code>77D:806</code>]</td> <td><code>NULL</code><code>77D</code>]</td> <td><code>NULL</code><code>AUTO_INC</code>]</td> <td><code>NULL</code><code>TABLE</code>]</td> <td><code>NULL</code><code>test.t09</code>]</td> <td><code>NULL</code><code>NULL</code>]</td> </tr></tbody></table>
