#### 14.16.2.1 Usando Informações de Transação e Locking do InnoDB

##### Identificando Transações Bloqueadoras

Às vezes, é útil identificar qual transação está bloqueando outra. As tabelas que contêm informações sobre transações `InnoDB` e data locks permitem determinar qual transação está esperando por outra e qual recurso está sendo solicitado. (Para descrições dessas tabelas, consulte Seção 14.16.2, “Informações de Transação e Locking do INFORMATION_SCHEMA do InnoDB”.)

Suponha que três sessões estejam sendo executadas simultaneamente. Cada sessão corresponde a um MySQL Thread e executa uma transação após a outra. Considere o estado do sistema quando essas sessões emitiram as seguintes statements, mas nenhuma delas ainda fez commit de sua transação:

* Sessão A:

  ```sql
  BEGIN;
  SELECT a FROM t FOR UPDATE;
  SELECT SLEEP(100);
  ```

* Sessão B:

  ```sql
  SELECT b FROM t FOR UPDATE;
  ```

* Sessão C:

  ```sql
  SELECT c FROM t FOR UPDATE;
  ```

Neste cenário, use a seguinte Query para ver quais transações estão esperando e quais transações as estão bloqueando:

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

Ou, de forma mais simples, use a view `innodb_lock_waits` do schema `sys`:

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

Se um valor NULL for reportado para a blocking query, consulte Identificando uma Blocking Query Após a Sessão Emissora Entrar em Ociosidade.

<table summary="A tabela de resultados de uma query contra INFORMATION_SCHEMA.INNODB_LOCK_WAITS e INFORMATION_SCHEMA.INNODB_TRX, mostrada no texto precedente, indicando quais threads InnoDB estão esperando por quais outros threads."><col style="width: 9%"/><col style="width: 9%"/><col style="width: 33%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 33%"/><thead><tr> <th>ID da trx em espera</th> <th>thread em espera</th> <th>query em espera</th> <th>ID da trx bloqueadora</th> <th>thread bloqueadora</th> <th>query bloqueadora</th> </tr></thead><tbody><tr> <th>`A4`</th> <td>`6`</td> <td>`SELECT b FROM t FOR UPDATE`</td> <td>`A3`</td> <td>`5`</td> <td>`SELECT SLEEP(100)`</td> </tr><tr> <th>`A5`</th> <td>`7`</td> <td>`SELECT c FROM t FOR UPDATE`</td> <td>`A3`</td> <td>`5`</td> <td>`SELECT SLEEP(100)`</td> </tr><tr> <th>`A5`</th> <td>`7`</td> <td>`SELECT c FROM t FOR UPDATE`</td> <td>`A4`</td> <td>`6`</td> <td>`SELECT b FROM t FOR UPDATE`</td> </tr> </tbody></table>

Na tabela anterior, você pode identificar sessões pelas colunas “query em espera” ou “query bloqueadora”. Como você pode ver:

* A Sessão B (ID da trx `A4`, Thread `6`) e a Sessão C (ID da trx `A5`, Thread `7`) estão ambas esperando pela Sessão A (ID da trx `A3`, Thread `5`).

* A Sessão C está esperando pela Sessão B, bem como pela Sessão A.

Você pode ver os dados subjacentes nas tabelas `INNODB_TRX`, `INNODB_LOCKS` e `INNODB_LOCK_WAITS`.

A tabela a seguir mostra alguns dados de exemplo da tabela `INFORMATION_SCHEMA.INNODB_TRX`.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th>ID da trx</th> <th>estado da trx</th> <th>trx iniciada</th> <th>ID do lock solicitado pela trx</th> <th>espera da trx iniciada</th> <th>peso da trx</th> <th>ID do thread MySQL da trx</th> <th>query da trx</th> </tr></thead><tbody><tr> <th>`A3`</th> <td>`RUNNING` (EM EXECUÇÃO)</td> <td>`2008-01-15 16:44:54`</td> <td>`NULL`</td> <td>`NULL`</td> <td>`2`</td> <td>`5`</td> <td>`SELECT SLEEP(100)`</td> </tr><tr> <th>`A4`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 16:45:09`</td> <td>`A4:1:3:2`</td> <td>`2008-01-15 16:45:09`</td> <td>`2`</td> <td>`6`</td> <td>`SELECT b FROM t FOR UPDATE`</td> </tr><tr> <th>`A5`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 16:45:14`</td> <td>`A5:1:3:2`</td> <td>`2008-01-15 16:45:14`</td> <td>`2`</td> <td>`7`</td> <td>`SELECT c FROM t FOR UPDATE`</td> </tr> </tbody></table>

A tabela a seguir mostra alguns dados de exemplo da tabela `INFORMATION_SCHEMA.INNODB_LOCKS`.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_LOCKS, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 31%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th>ID do lock</th> <th>ID da trx do lock</th> <th>modo do lock</th> <th>tipo do lock</th> <th>tabela do lock</th> <th>Index do lock</th> <th>dados do lock</th> </tr></thead><tbody><tr> <th>`A3:1:3:2`</th> <td>`A3`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t`</td> <td>`PRIMARY`</td> <td>`0x0200`</td> </tr><tr> <th>`A4:1:3:2`</th> <td>`A4`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t`</td> <td>`PRIMARY`</td> <td>`0x0200`</td> </tr><tr> <th>`A5:1:3:2`</th> <td>`A5`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t`</td> <td>`PRIMARY`</td> <td>`0x0200`</td> </tr> </tbody></table>

A tabela a seguir mostra alguns dados de exemplo da tabela `INFORMATION_SCHEMA.INNODB_LOCK_WAITS`.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_LOCK_WAITS, mostrando os tipos típicos de entradas para cada coluna."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><thead><tr> <th>ID da trx solicitante</th> <th>ID do lock solicitado</th> <th>ID da trx bloqueadora</th> <th>ID do lock bloqueador</th> </tr></thead><tbody><tr> <th>`A4`</th> <td>`A4:1:3:2`</td> <td>`A3`</td> <td>`A3:1:3:2`</td> </tr><tr> <th>`A5`</th> <td>`A5:1:3:2`</td> <td>`A3`</td> <td>`A3:1:3:2`</td> </tr><tr> <th>`A5`</th> <td>`A5:1:3:2`</td> <td>`A4`</td> <td>`A4:1:3:2`</td> </tr> </tbody></table>

##### Identificando uma Blocking Query Após a Sessão Emissora Entrar em Ociosidade

Ao identificar blocking transactions, um valor NULL é reportado para a blocking query se a sessão que emitiu a Query tiver se tornado ociosa (idle). Neste caso, use os seguintes passos para determinar a blocking query:

1. Identifique o processlist ID da blocking transaction. Na tabela `sys.innodb_lock_waits`, o processlist ID da blocking transaction é o valor `blocking_pid`.

2. Usando o `blocking_pid`, faça Query na tabela `threads` do Performance Schema do MySQL para determinar o `THREAD_ID` da blocking transaction. Por exemplo, se o `blocking_pid` for 6, emita esta Query:

   ```sql
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Usando o `THREAD_ID`, faça Query na tabela `events_statements_current` do Performance Schema para determinar a última Query executada pelo Thread. Por exemplo, se o `THREAD_ID` for 28, emita esta Query:

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. Se a última Query executada pelo Thread não fornecer informações suficientes para determinar por que um Lock está sendo mantido, você pode fazer Query na tabela `events_statements_history` do Performance Schema para visualizar as últimas 10 statements executadas pelo Thread.

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlacionando Transações InnoDB com Sessões MySQL

Às vezes, é útil correlacionar informações internas de locking do `InnoDB` com as informações de nível de sessão mantidas pelo MySQL. Por exemplo, você pode querer saber, para um dado ID de transação `InnoDB`, o ID de sessão MySQL correspondente e o nome da sessão que pode estar mantendo um Lock e, portanto, bloqueando outras transações.

O output a seguir das tabelas `INFORMATION_SCHEMA` foi extraído de um sistema com alguma carga. Como pode ser visto, existem várias transações em execução.

As tabelas `INNODB_LOCKS` e `INNODB_LOCK_WAITS` a seguir mostram que:

* A Transação `77F` (executando um `INSERT`) está esperando que as transações `77E`, `77D` e `77B` façam commit.

* A Transação `77E` (executando um `INSERT`) está esperando que as transações `77D` e `77B` façam commit.

* A Transação `77D` (executando um `INSERT`) está esperando que a transação `77B` faça commit.

* A Transação `77B` (executando um `INSERT`) está esperando que a transação `77A` faça commit.

* A Transação `77A` está em execução, atualmente executando `SELECT`.

* A Transação `E56` (executando um `INSERT`) está esperando que a transação `E55` faça commit.

* A Transação `E55` (executando um `INSERT`) está esperando que a transação `19C` faça commit.

* A Transação `19C` está em execução, atualmente executando um `INSERT`.

Nota

Pode haver inconsistências entre as Queries mostradas nas tabelas `PROCESSLIST` e `INNODB_TRX` do `INFORMATION_SCHEMA`. Para uma explicação, consulte Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Locking do InnoDB”.

A tabela a seguir mostra o conteúdo da tabela `INFORMATION_SCHEMA.PROCESSLIST` para um sistema executando uma carga de trabalho pesada.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.PROCESSLIST, mostrando o funcionamento interno dos processos MySQL sob uma carga de trabalho pesada."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>ID</th> <th>Usuário</th> <th>Host</th> <th>Banco de Dados</th> <th>Comando</th> <th>Tempo</th> <th>Estado</th> <th>Informação</th> </tr></thead><tbody><tr> <th>`384`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`10`</td> <td>`atualização`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`257`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`3`</td> <td>`atualização`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`130`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`0`</td> <td>`atualização`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`61`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`1`</td> <td>`atualização`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`8`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`1`</td> <td>`atualização`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`4`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Query`</td> <td>`0`</td> <td>`preparando`</td> <td>`SELECT * FROM PROCESSLIST`</td> </tr><tr> <th>`2`</th> <td>`root`</td> <td>`localhost`</td> <td>`test`</td> <td>`Sleep`</td> <td>`566`</td> <td></td> <td>`NULL`</td> </tr> </tbody></table>

A tabela a seguir mostra o conteúdo da tabela `INFORMATION_SCHEMA.INNODB_TRX` para um sistema executando uma carga de trabalho pesada.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_TRX, mostrando o funcionamento interno das transações InnoDB sob uma carga de trabalho pesada."><col style="width: 8%"/><col style="width: 10%"/><col style="width: 19%"/><col style="width: 21%"/><col style="width: 19%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 31%"/><thead><tr> <th>ID da trx</th> <th>estado da trx</th> <th>trx iniciada</th> <th>ID do lock solicitado pela trx</th> <th>espera da trx iniciada</th> <th>peso da trx</th> <th>ID do thread MySQL da trx</th> <th>query da trx</th> </tr></thead><tbody><tr> <th>`77F`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:16`</td> <td>`77F`</td> <td>`2008-01-15 13:10:16`</td> <td>`1`</td> <td>`876`</td> <td>`INSERT INTO t09 (D, B, C) VALUES …`</td> </tr><tr> <th>`77E`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:16`</td> <td>`77E`</td> <td>`2008-01-15 13:10:16`</td> <td>`1`</td> <td>`875`</td> <td>`INSERT INTO t09 (D, B, C) VALUES …`</td> </tr><tr> <th>`77D`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:16`</td> <td>`77D`</td> <td>`2008-01-15 13:10:16`</td> <td>`1`</td> <td>`874`</td> <td>`INSERT INTO t09 (D, B, C) VALUES …`</td> </tr><tr> <th>`77B`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:16`</td> <td>`77B:733:12:1`</td> <td>`2008-01-15 13:10:16`</td> <td>`4`</td> <td>`873`</td> <td>`INSERT INTO t09 (D, B, C) VALUES …`</td> </tr><tr> <th>`77A`</th> <td>`RUNNING` (EM EXECUÇÃO)</td> <td>`2008-01-15 13:10:16`</td> <td>`NULL`</td> <td>`NULL`</td> <td>`4`</td> <td>`872`</td> <td>`SELECT b, c FROM t09 WHERE …`</td> </tr><tr> <th>`E56`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:06`</td> <td>`E56:743:6:2`</td> <td>`2008-01-15 13:10:06`</td> <td>`5`</td> <td>`384`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`E55`</th> <td>`LOCK WAIT` (ESPERANDO LOCK)</td> <td>`2008-01-15 13:10:06`</td> <td>`E55:743:38:2`</td> <td>`2008-01-15 13:10:13`</td> <td>`965`</td> <td>`257`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`19C`</th> <td>`RUNNING` (EM EXECUÇÃO)</td> <td>`2008-01-15 13:09:10`</td> <td>`NULL`</td> <td>`NULL`</td> <td>`2900`</td> <td>`130`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`E15`</th> <td>`RUNNING` (EM EXECUÇÃO)</td> <td>`2008-01-15 13:08:59`</td> <td>`NULL`</td> <td>`NULL`</td> <td>`5395`</td> <td>`61`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr><tr> <th>`51D`</th> <td>`RUNNING` (EM EXECUÇÃO)</td> <td>`2008-01-15 13:08:47`</td> <td>`NULL`</td> <td>`NULL`</td> <td>`9807`</td> <td>`8`</td> <td>`INSERT INTO t2 VALUES …`</td> </tr> </tbody></table>

A tabela a seguir mostra o conteúdo da tabela `INFORMATION_SCHEMA.INNODB_LOCK_WAITS` para um sistema executando uma carga de trabalho pesada.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_LOCK_WAITS, mostrando o funcionamento interno do locking do InnoDB sob uma carga de trabalho pesada."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>ID da trx solicitante</th> <th>ID do lock solicitado</th> <th>ID da trx bloqueadora</th> <th>ID do lock bloqueador</th> </tr></thead><tbody><tr> <th>`77F`</th> <td>`77F:806`</td> <td>`77E`</td> <td>`77E:806`</td> </tr><tr> <th>`77F`</th> <td>`77F:806`</td> <td>`77D`</td> <td>`77D:806`</td> </tr><tr> <th>`77F`</th> <td>`77F:806`</td> <td>`77B`</td> <td>`77B:806`</td> </tr><tr> <th>`77E`</th> <td>`77E:806`</td> <td>`77D`</td> <td>`77D:806`</td> </tr><tr> <th>`77E`</th> <td>`77E:806`</td> <td>`77B`</td> <td>`77B:806`</td> </tr><tr> <th>`77D`</th> <td>`77D:806`</td> <td>`77B`</td> <td>`77B:806`</td> </tr><tr> <th>`77B`</th> <td>`77B:733:12:1`</td> <td>`77A`</td> <td>`77A:733:12:1`</td> </tr><tr> <th>`E56`</th> <td>`E56:743:6:2`</td> <td>`E55`</td> <td>`E55:743:6:2`</td> </tr><tr> <th>`E55`</th> <td>`E55:743:38:2`</td> <td>`19C`</td> <td>`19C:743:38:2`</td> </tr> </tbody></table>

A tabela a seguir mostra o conteúdo da tabela `INFORMATION_SCHEMA.INNODB_LOCKS` para um sistema executando uma carga de trabalho pesada.

<table summary="Dados de exemplo da tabela INFORMATION_SCHEMA.INNODB_LOCKS, mostrando o funcionamento interno do locking do InnoDB sob uma carga de trabalho pesada."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 14%"/><col style="width: 17%"/><col style="width: 17%"/><thead><tr> <th>ID do lock</th> <th>ID da trx do lock</th> <th>modo do lock</th> <th>tipo do lock</th> <th>tabela do lock</th> <th>Index do lock</th> <th>dados do lock</th> </tr></thead><tbody><tr> <th>`77F:806`</th> <td>`77F`</td> <td>`AUTO_INC`</td> <td>`TABLE`</td> <td>`test.t09`</td> <td>`NULL`</td> <td>`NULL`</td> </tr><tr> <th>`77E:806`</th> <td>`77E`</td> <td>`AUTO_INC`</td> <td>`TABLE`</td> <td>`test.t09`</td> <td>`NULL`</td> <td>`NULL`</td> </tr><tr> <th>`77D:806`</th> <td>`77D`</td> <td>`AUTO_INC`</td> <td>`TABLE`</td> <td>`test.t09`</td> <td>`NULL`</td> <td>`NULL`</td> </tr><tr> <th>`77B:806`</th> <td>`77B`</td> <td>`AUTO_INC`</td> <td>`TABLE`</td> <td>`test.t09`</td> <td>`NULL`</td> <td>`NULL`</td> </tr><tr> <th>`77B:733:12:1`</th> <td>`77B`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t09`</td> <td>`PRIMARY`</td> <td>`supremum pseudo-record`</td> </tr><tr> <th>`77A:733:12:1`</th> <td>`77A`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t09`</td> <td>`PRIMARY`</td> <td>`supremum pseudo-record`</td> </tr><tr> <th>`E56:743:6:2`</th> <td>`E56`</td> <td>`S`</td> <td>`RECORD`</td> <td>`test.t2`</td> <td>`PRIMARY`</td> <td>`0, 0`</td> </tr><tr> <th>`E55:743:6:2`</th> <td>`E55`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t2`</td> <td>`PRIMARY`</td> <td>`0, 0`</td> </tr><tr> <th>`E55:743:38:2`</th> <td>`E55`</td> <td>`S`</td> <td>`RECORD`</td> <td>`test.t2`</td> <td>`PRIMARY`</td> <td>`1922, 1922`</td> </tr><tr> <th>`19C:743:38:2`</th> <td>`19C`</td> <td>`X`</td> <td>`RECORD`</td> <td>`test.t2`</td> <td>`PRIMARY`</td> <td>`1922, 1922`</td> </tr> </tbody></table>