## 14.16 Tabelas do esquema de informação InnoDB

Esta seção fornece informações e exemplos de uso para as tabelas `InnoDB` `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `INFORMATION_SCHEMA` fornecem metadados, informações de status e estatísticas sobre vários aspectos do mecanismo de armazenamento `InnoDB`. Você pode visualizar uma lista de tabelas `InnoDB` e `INFORMATION_SCHEMA` emitindo uma declaração `SHOW TABLES` no banco de dados `INFORMATION_SCHEMA`:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

Para definições de tabela, consulte a Seção 24.4, “INFORMATION_SCHEMA InnoDB Tables”. Para informações gerais sobre o banco de dados `MySQL` `INFORMATION_SCHEMA`, consulte o Capítulo 24, *INFORMATION_SCHEMA Tables*.

### 14.16.1 Tabelas do esquema de informações InnoDB sobre compressão

Existem dois pares de tabelas `InnoDB` `INFORMATION_SCHEMA` sobre compressão que podem fornecer informações sobre o quão bem a compressão está funcionando no geral:

* `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações sobre o número de operações de compressão e o tempo gasto na realização da compressão.

* `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações sobre a forma como a memória é alocada para a compressão.

#### 14.16.1.1 INNODB\_CMP e INNODB\_CMP\_RESET

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações de status sobre operações relacionadas a tabelas compactadas, que são descritas na Seção 14.9, “Compressão de Tabela e Página InnoDB”. A coluna `PAGE_SIZE` relata o tamanho da página compactada.

Essas duas tabelas têm conteúdos idênticos, mas a leitura de `INNODB_CMP_RESET` refaz as estatísticas sobre operações de compressão e descomprição. Por exemplo, se você arquivar a saída de `INNODB_CMP_RESET` a cada 60 minutos, você verá as estatísticas para cada período horário. Se você monitorar a saída de `INNODB_CMP` (assegurando-se de nunca ler `INNODB_CMP_RESET`), você verá as estatísticas acumuladas desde que o InnoDB foi iniciado.

Para a definição da tabela, consulte a Seção 24.4.5, “As tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET”.

#### 14.16.1.2 INNODB\_CMPMEM e INNODB\_CMPMEM\_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre páginas compactadas que residem no buffer pool. Consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”, para obter mais informações sobre tabelas compactadas e o uso do buffer pool. As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` devem fornecer estatísticas mais úteis sobre compressão.

##### Detalhes Internos

`InnoDB` utiliza um sistema de alocador de amigos para gerenciar a memória alocada para páginas de vários tamanhos, de 1 KB a 16 KB. Cada string das duas tabelas descritas aqui corresponde a um único tamanho de página.

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` têm conteúdos idênticos, mas a leitura de `INNODB_CMPMEM_RESET` redefiniu as estatísticas sobre operações de realocação. Por exemplo, se a cada 60 minutos você arquivasse o resultado de `INNODB_CMPMEM_RESET`, ele mostraria as estatísticas horárias. Se você nunca tivesse lido `INNODB_CMPMEM_RESET` e monitorado o resultado de `INNODB_CMPMEM` em vez disso, ele mostraria as estatísticas acumuladas desde que `InnoDB` foi iniciado.

Para a definição da tabela, consulte a Seção 24.4.6, “As tabelas INFORMATION_SCHEMA INNODB_CMPMEM e INNODB_CMPMEM_RESET”.

#### 14.16.1.3 Usando as tabelas do esquema de informações de compressão

**Exemplo 14.1 Usando as tabelas do esquema de informações de compressão**

O que segue é uma saída de exemplo de um banco de dados que contém tabelas comprimidas (consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”, `INNODB_CMP`, `INNODB_CMP_PER_INDEX` e `INNODB_CMPMEM`).

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_CMP` em uma carga de trabalho leve. O único tamanho de página compactada que o pool de buffer contém é de 8K. A compactação ou descompactação de páginas consumiu menos de um segundo desde o momento em que as estatísticas foram redefinidas, porque as colunas `COMPRESS_TIME` e `UNCOMPRESS_TIME` são zero.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_CMP table, showing the internal workings of InnoDB table compression under a light workload."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>page size</th> <th>compress ops</th> <th>compress ops ok</th> <th>compress time</th> <th>uncompress ops</th> <th>uncompress time</th> </tr></thead><tbody><tr> <th>1024</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th>2048</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th>4096</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th>8192</th> <td>1048</td> <td>921</td> <td>0</td> <td>61</td> <td>0</td> </tr><tr> <th>16384</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr></tbody></table>

De acordo com `INNODB_CMPMEM`, há 6169 páginas compactadas de 8 KB no pool de buffer. O único outro tamanho de bloco alocado é de 64 bytes. O menor `PAGE_SIZE` em `INNODB_CMPMEM` é usado para descritores de bloco das páginas compactadas para as quais não existe nenhuma página descompactada no pool de buffer. Vemos que há 5910 páginas desse tipo. Indiretamente, vemos que 259 (6169-5910) páginas compactadas também existem no pool de buffer em forma descompactada.

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_CMPMEM` em carga leve. Algum espaço de memória é inutilizável devido à fragmentação do alocador de memória para páginas compactadas: `SUM(PAGE_SIZE*PAGES_FREE)=6784`. Isso ocorre porque solicitações de alocação de memória pequenas são atendidas dividindo blocos maiores, começando pelos blocos de 16K que são alocados a partir do pool de buffer principal, usando o sistema de alocação buddy. A fragmentação é tão baixa porque alguns blocos alocados foram realocados (copiados) para formar blocos livres adjacentes maiores. Essa cópia de `SUM(PAGE_SIZE*RELOCATION_OPS)` bytes consumiu menos de um segundo `(SUM(RELOCATION_TIME)=0)`.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_CMPMEM table, showing buffer pool memory operations for InnoDB table compression under a light workload."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>page size</th> <th>pages used</th> <th>pages free</th> <th>relocation ops</th> <th>relocation time</th> </tr></thead><tbody><tr> <th>64</th> <td>5910</td> <td>0</td> <td>2436</td> <td>0</td> </tr><tr> <th>128</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th>256</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th>512</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th>1024</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th>2048</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th>4096</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th>8192</th> <td>6169</td> <td>0</td> <td>5</td> <td>0</td> </tr><tr> <th>16384</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr></tbody></table>

### 14.16.2 Informações de transação e bloqueio do esquema de informações InnoDB

Três tabelas `InnoDB` `INFORMATION_SCHEMA` permitem que você monitore transações e diagnostique potenciais problemas de bloqueio:

* `INNODB_TRX`: Fornece informações sobre cada transação que está sendo executada atualmente dentro de `InnoDB`, incluindo o estado da transação (por exemplo, se está em execução ou aguardando uma bloqueio), quando a transação começou e o enunciado SQL específico que a transação está executando.

* `INNODB_LOCKS`: Cada transação em InnoDB que está esperando que outra transação libere um bloqueio (`INNODB_TRX.TRX_STATE` é `LOCK WAIT`) é bloqueada por exatamente uma solicitação de bloqueio. Essa solicitação de bloqueio é para um bloqueio de string ou tabela mantido por outra transação em um modo incompatível. Um bloqueio que bloqueia uma transação é sempre mantido em um modo incompatível com o modo do bloqueio solicitado (leitura vs. escrita, compartilhada vs. exclusiva). A transação bloqueada não pode prosseguir até que a outra transação se comprometa ou desconsidere, liberando assim o bloqueio solicitado. Para cada transação bloqueada, `INNODB_LOCKS` contém uma string que descreve cada bloqueio que a transação solicitou e para o qual está esperando. `INNODB_LOCKS` também contém uma string para cada bloqueio que está bloqueando outra transação, independentemente do estado da transação que mantém o bloqueio (`INNODB_TRX.TRX_STATE` é `RUNNING`, `LOCK WAIT`, `ROLLING BACK` ou `COMMITTING`).

* `INNODB_LOCK_WAITS`: Esta tabela indica quais transações estão aguardando um determinado bloqueio, ou para as quais uma determinada transação está aguardando um bloqueio. Esta tabela contém uma ou mais strings para cada transação bloqueada, indicando o bloqueio que ela solicitou e quaisquer bloqueamentos que este bloqueio está impedindo. O valor `REQUESTED_LOCK_ID` refere-se ao bloqueio solicitado por uma transação, e o valor `BLOCKING_LOCK_ID` refere-se ao bloqueio (mantido por outra transação) que impede a primeira transação de prosseguir. Para qualquer transação bloqueada dada, todas as strings em `INNODB_LOCK_WAITS` têm o mesmo valor para `REQUESTED_LOCK_ID` e valores diferentes para `BLOCKING_LOCK_ID`.

Para mais informações sobre as tabelas anteriores, consulte a Seção 24.4.28, “A Tabela INFORMATION_SCHEMA INNODB_TRX”, a Seção 24.4.14, “A Tabela INFORMATION_SCHEMA INNODB_LOCKS” e a Seção 24.4.15, “A Tabela INFORMATION_SCHEMA INNODB_LOCK_WAITS”.

#### 14.16.2.1 Usando informações de transação e bloqueio do InnoDB

##### Identificando Transações Bloqueadas

Às vezes, é útil identificar qual transação bloqueia outra. As tabelas que contêm informações sobre transações e bloqueios de dados de `InnoDB` permitem determinar qual transação está esperando por outra e qual recurso está sendo solicitado. (Para descrições dessas tabelas, consulte a Seção 14.16.2, “Informações de Transação e Bloqueio do InnoDB do Schema de Informações”.)

Suponha que três sessões estejam em execução simultaneamente. Cada sessão corresponde a um thread do MySQL e executa uma transação após a outra. Considere o estado do sistema quando essas sessões emitiram as seguintes declarações, mas nenhuma ainda havia comprometido sua transação:

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

Ou, de forma mais simples, use o esquema `sys` da visão `innodb_lock_waits`:

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

Se um valor NULL for relatado para a consulta de bloqueio, consulte Identificando uma consulta de bloqueio após a sessão de emissão se tornar inativa.

<table summary="The result set of a query against the INFORMATION_SCHEMA.INNODB_LOCK_WAITS and INFORMATION_SCHEMA.INNODB_TRX tables, shown in the preceding text, indicating which InnoDB threads are waiting for which other threads."><col style="width: 9%"/><col style="width: 9%"/><col style="width: 33%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 33%"/><thead><tr> <th>waiting trx id</th> <th>waiting thread</th> <th>waiting query</th> <th>blocking trx id</th> <th>blocking thread</th> <th>blocking query</th> </tr></thead><tbody><tr> <th><code>A4</code></th> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> <td><code>A3</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A5</code></th> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A3</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A5</code></th> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A4</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr></tbody></table>

Na tabela anterior, você pode identificar as sessões pelas colunas "consulta em espera" ou "consulta bloqueada". Como você pode ver:

* A sessão B (trx id `A4`, thread `6`) e a sessão C (trx id `A5`, thread `7`) estão ambas aguardando a sessão A (trx id `A3`, thread `5`).

* A sessão C está à espera da sessão B, assim como da sessão A.

Você pode ver os dados subjacentes nas tabelas `INNODB_TRX`, `INNODB_LOCKS` e `INNODB_LOCK_WAITS`.

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_TRX`.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th>trx id</th> <th>estado trx</th> <th>trx começou</th> <th>trx solicitou ID de bloqueio</th> <th>trx wait começou</th> <th>peso trx</th> <th>trx mysql thread id</th> <th>consulta trx</th> </tr></thead><tbody><tr> <th><code>A3</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 16:44:54</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>2</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A4</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 16:45:09</code></td> <td><code>A4:1:3:2</code></td> <td><code>2008-01-15 16:45:09</code></td> <td><code>2</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr><tr> <th><code>A5</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 16:45:14</code></td> <td><code>A5:1:3:2</code></td> <td><code>2008-01-15 16:45:14</code></td> <td><code>2</code></td> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_LOCKS`.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_LOCKS table, showing the typical types of entries for each column."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 31%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th>lock id</th> <th>lock trx id</th> <th>lock mode</th> <th>lock type</th> <th>lock table</th> <th>lock index</th> <th>lock data</th> </tr></thead><tbody><tr> <th><code>A3:1:3:2</code></th> <td><code>A3</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr><tr> <th><code>A4:1:3:2</code></th> <td><code>A4</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr><tr> <th><code>A5:1:3:2</code></th> <td><code>A5</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr></tbody></table>

A tabela a seguir mostra alguns conteúdos de amostra da tabela do esquema de informações `INNODB_LOCK_WAITS`.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_LOCK_WAITS table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><thead><tr> <th>solicitando id trx</th> <th>identificador de bloqueio solicitado</th> <th>bloqueio do TRX id</th> <th>bloqueio de identificação de trava</th> </tr></thead><tbody><tr> <th><code>A4</code></th> <td><code>A4:1:3:2</code></td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A4</code></td> <td><code>A4:1:3:2</code></td> </tr></tbody></table>

##### Identificando uma consulta bloqueada após a sessão de emissão se tornar inativa

Ao identificar transações bloqueadas, um valor NULL é relatado para a consulta de bloqueio se a sessão que emitiu a consulta se tornou inativa. Nesse caso, use as seguintes etapas para determinar a consulta de bloqueio:

1. Identifique o ID do processo da transação que está bloqueando. Na tabela `sys.innodb_lock_waits`, o ID do processo da transação que está bloqueando é o valor `blocking_pid`.

2. Usando o `blocking_pid`, consulte a tabela do Schema de Desempenho do MySQL `threads` para determinar o `THREAD_ID` da transação bloqueada. Por exemplo, se o `blocking_pid` for 6, execute esta consulta:

   ```sql
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Usando o `THREAD_ID`, consulte a tabela do Schema de Desempenho `events_statements_current` para determinar a última consulta executada pelo thread. Por exemplo, se o `THREAD_ID` for 28, execute esta consulta:

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. Se a última consulta executada pelo thread não for suficiente para determinar por que um bloqueio é mantido, você pode consultar a tabela do Schema de desempenho `events_statements_history` para visualizar as últimas 10 instruções executadas pelo thread.

   ```sql
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlação de Transações InnoDB com Sessões do MySQL

Às vezes, é útil correlacionar as informações de bloqueio interno `InnoDB` com as informações de nível de sessão mantidas pelo MySQL. Por exemplo, você pode querer saber, para um ID de transação `InnoDB` específico, o ID de sessão MySQL correspondente e o nome da sessão que pode estar segurando um bloqueio, e assim bloqueando outras transações.

A saída a seguir das tabelas `INFORMATION_SCHEMA` é tirada de um sistema um pouco carregado. Como pode ser visto, há várias transações em execução.

As seguintes tabelas `INNODB_LOCKS` e `INNODB_LOCK_WAITS` mostram que:

* A transação `77F` (executando uma `INSERT`) está aguardando a confirmação das transações `77E`, `77D` e `77B`.

A transação `77E` (executando uma `INSERT`) está aguardando a confirmação das transações `77D` e `77B`.

A transação `77D` (executando uma `INSERT`) está aguardando o compromisso da transação `77B`.

A transação `77B` (executando uma `INSERT`) está aguardando o compromisso da transação `77A`.

* A transação `77A` está em execução, atualmente executando `SELECT`.

A transação `E56` (executando uma `INSERT`) está aguardando o compromisso da transação `E55`.

A transação `E55` (executando uma `INSERT`) está aguardando o compromisso da transação `19C`.

* A transação `19C` está em execução, atualmente executando uma `INSERT`.

Nota

Pode haver inconsistências entre as consultas exibidas nas tabelas `INFORMATION_SCHEMA` `PROCESSLIST` e `INNODB_TRX`. Para uma explicação, consulte a Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e de Acionamento do InnoDB”.

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `PROCESSLIST` para um sistema que executa uma carga de trabalho pesada.

<table summary="Sample data from the INFORMATION_SCHEMA.PROCESSLIST table, showing the internal workings of MySQL processes under a heavy workload."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>ID</th> <th>USER</th> <th>HOST</th> <th>DB</th> <th>COMMAND</th> <th>TIME</th> <th>STATE</th> <th>INFO</th> </tr></thead><tbody><tr> <th><code>384</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>10</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>257</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>3</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>130</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>0</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>61</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>1</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>8</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>1</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>4</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>0</code></td> <td><code>preparing</code></td> <td><code>SELECT * FROM PROCESSLIST</code></td> </tr><tr> <th><code>2</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Sleep</code></td> <td><code>566</code></td> <td><code></code></td> <td><code>NULL</code></td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_TRX` para um sistema que executa uma carga de trabalho pesada.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the internal workings of InnoDB transactions under a heavy workload."><col style="width: 8%"/><col style="width: 10%"/><col style="width: 19%"/><col style="width: 21%"/><col style="width: 19%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 31%"/><thead><tr> <th>trx id</th> <th>estado trx</th> <th>trx começou</th> <th>trx solicitou ID de bloqueio</th> <th>trx wait começou</th> <th>peso trx</th> <th>trx mysql thread id</th> <th>consulta trx</th> </tr></thead><tbody><tr> <th><code>77F</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77F</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>876</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77E</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77E</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>875</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77D</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77D</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>874</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77B</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77B:733:12:1</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>4</code></td> <td><code>873</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77A</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>4</code></td> <td><code>872</code></td> <td><code>SELECT b, c FROM t09 WHERE …</code></td> </tr><tr> <th><code>E56</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>E56:743:6:2</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>5</code></td> <td><code>384</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>E55</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>E55:743:38:2</code></td> <td><code>2008-01-15 13:10:13</code></td> <td><code>965</code></td> <td><code>257</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>19C</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:09:10</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>2900</code></td> <td><code>130</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>E15</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:08:59</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>5395</code></td> <td><code>61</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>51D</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:08:47</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>9807</code></td> <td><code>8</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_LOCK_WAITS` para um sistema que executa uma carga de trabalho pesada.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_LOCK_WAITS table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>solicitando id trx</th> <th>identificador de bloqueio solicitado</th> <th>bloqueio do TRX id</th> <th>bloqueio de identificação de trava</th> </tr></thead><tbody><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77E</code></td> <td><code>77E:806</code></td> </tr><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77D</code></td> <td><code>77D:806</code></td> </tr><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77D</code></td> <td><code>77D:806</code></td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77D</code></th> <td><code>77D:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77B</code></th> <td><code>77B:733:12:1</code></td> <td><code>77A</code></td> <td><code>77A:733:12:1</code></td> </tr><tr> <th><code>E56</code></th> <td><code>E56:743:6:2</code></td> <td><code>E55</code></td> <td><code>E55:743:6:2</code></td> </tr><tr> <th><code>E55</code></th> <td><code>E55:743:38:2</code></td> <td><code>19C</code></td> <td><code>19C:743:38:2</code></td> </tr></tbody></table>

A tabela a seguir mostra o conteúdo da tabela do esquema de informações `INNODB_LOCKS` para um sistema que executa uma carga de trabalho pesada.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_LOCKS table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 14%"/><col style="width: 17%"/><col style="width: 17%"/><thead><tr> <th>lock id</th> <th>lock trx id</th> <th>lock mode</th> <th>lock type</th> <th>lock table</th> <th>lock index</th> <th>lock data</th> </tr></thead><tbody><tr> <th><code>77F:806</code></th> <td><code>77F</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test.t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77E:806</code></th> <td><code>77E</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test.t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77D:806</code></th> <td><code>77D</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test.t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77B:806</code></th> <td><code>77B</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test.t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77B:733:12:1</code></th> <td><code>77B</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t09</code></td> <td><code>PRIMARY</code></td> <td><code>supremum pseudo-record</code></td> </tr><tr> <th><code>77A:733:12:1</code></th> <td><code>77A</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t09</code></td> <td><code>PRIMARY</code></td> <td><code>supremum pseudo-record</code></td> </tr><tr> <th><code>E56:743:6:2</code></th> <td><code>E56</code></td> <td><code>S</code></td> <td><code>RECORD</code></td> <td><code>test.t2</code></td> <td><code>PRIMARY</code></td> <td><code>0, 0</code></td> </tr><tr> <th><code>E55:743:6:2</code></th> <td><code>E55</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t2</code></td> <td><code>PRIMARY</code></td> <td><code>0, 0</code></td> </tr><tr> <th><code>E55:743:38:2</code></th> <td><code>E55</code></td> <td><code>S</code></td> <td><code>RECORD</code></td> <td><code>test.t2</code></td> <td><code>PRIMARY</code></td> <td><code>1922, 1922</code></td> </tr><tr> <th><code>19C:743:38:2</code></th> <td><code>19C</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test.t2</code></td> <td><code>PRIMARY</code></td> <td><code>1922, 1922</code></td> </tr></tbody></table>

#### 14.16.2.2 Informações de bloqueio e espera de bloqueio do InnoDB

Quando uma transação atualiza uma string em uma tabela, ou a bloqueia com `SELECT FOR UPDATE`, `InnoDB` estabelece uma lista ou fila de bloqueios sobre essa string. Da mesma forma, `InnoDB` mantém uma lista de bloqueios em uma tabela para bloqueios de nível de tabela. Se uma segunda transação quiser atualizar uma string ou bloquear uma tabela já bloqueada por uma transação anterior em um modo incompatível, `InnoDB` adiciona um pedido de bloqueio para a string à fila correspondente. Para que um bloqueio seja adquirido por uma transação, todos os pedidos de bloqueio incompatíveis previamente inseridos na fila de bloqueio para essa string ou tabela devem ser removidos (o que ocorre quando as transações que detêm ou solicitam esses bloqueios ou realizam um commit ou rollback).

Uma transação pode ter qualquer número de solicitações de bloqueio para diferentes strings ou tabelas. Em qualquer momento, uma transação pode solicitar um bloqueio que é mantido por outra transação, no caso, é bloqueada por essa outra transação. A transação solicitante deve esperar que a transação que mantém o bloqueio se comprometa ou se desfaça. Se uma transação não está esperando por um bloqueio, ela está em um estado `RUNNING`. Se uma transação está esperando por um bloqueio, ela está em um estado `LOCK WAIT`. (A tabela `INFORMATION_SCHEMA` `INNODB_TRX` indica os valores do estado da transação.)

A tabela `INNODB_LOCKS` contém uma ou mais strings para cada transação `LOCK WAIT`, indicando quaisquer solicitações de bloqueio que impeçam seu progresso. Esta tabela também contém uma string que descreve cada bloqueio em uma fila de blocos pendentes para uma determinada string ou tabela. A tabela `INNODB_LOCK_WAITS` mostra quais blocos já mantidos por uma transação estão bloqueando blocos solicitados por outras transações.

#### 14.16.2.3 Persistência e Consistência das Informações de Transação e de Acionamento do InnoDB

Os dados expostos pelas tabelas de transação e bloqueio (`INNODB_TRX`, `INNODB_LOCKS` e `INNODB_LOCK_WAITS`) representam um vislumbre de dados em rápida mudança. Isso não é como as tabelas de usuário, onde os dados mudam apenas quando ocorrem atualizações iniciadas pelo aplicativo. Os dados subjacentes são dados gerenciados internamente pelo sistema e podem mudar muito rapidamente.

Por razões de desempenho e para minimizar a chance de junções enganosas entre a transação e as tabelas de bloqueio, o `InnoDB` coleta as informações necessárias sobre a transação e o bloqueio em um buffer intermediário sempre que é emitida uma `SELECT` em qualquer uma das tabelas. Esse buffer é atualizado apenas se mais de 0,1 segundo tiver passado desde a última vez em que o buffer foi lido. Os dados necessários para preencher as três tabelas são obtidos de forma atômica e consistente e são salvos nesse buffer interno global, formando um "instantâneo" em um determinado momento. Se vários acessos à tabela ocorrerem em 0,1 segundo (como quase certamente acontece quando o MySQL processa uma junção entre essas tabelas), então o mesmo instantâneo é usado para satisfazer a consulta.

Um resultado correto é retornado quando você junta qualquer uma dessas tabelas em uma única consulta, porque os dados das três tabelas vêm do mesmo instantâneo. Como o buffer não é atualizado com cada consulta de qualquer uma dessas tabelas, se você emitir consultas separadas contra essas tabelas em um décimo de segundo, os resultados são os mesmos de consulta a consulta. Por outro lado, duas consultas separadas das mesmas ou diferentes tabelas emitidas com mais de um décimo de segundo de diferença podem ver resultados diferentes, uma vez que os dados vêm de instantâneos diferentes.

Como o `InnoDB` deve ser temporariamente interrompido enquanto as transações e os dados de bloqueio são coletados, consultas muito frequentes a essas tabelas podem impactar negativamente o desempenho, conforme observado por outros usuários.

Como essas tabelas contêm informações sensíveis (pelo menos `INNODB_LOCKS.LOCK_DATA` e `INNODB_TRX.TRX_QUERY`), por razões de segurança, apenas os usuários com o privilégio `PROCESS` têm permissão para `SELECT` a partir delas.

Como descrito anteriormente, os dados que preenchem as tabelas de transação e bloqueio (`INNODB_TRX`, `INNODB_LOCKS` e `INNODB_LOCK_WAITS`) são recuperados automaticamente e armazenados em um buffer intermediário que fornece um instantâneo “em um ponto no tempo”. Os dados em todas as três tabelas são consistentes quando consultados a partir do mesmo instantâneo. No entanto, os dados subjacentes mudam tão rapidamente que vislumbres semelhantes em outros dados que mudam de forma semelhante podem não estar em sincronia. Assim, você deve ter cuidado ao comparar dados na transação e tabelas de bloqueio `InnoDB` com dados na tabela `PROCESSLIST`. Os dados da tabela `PROCESSLIST` não vêm do mesmo instantâneo que os dados sobre bloqueio e transação. Mesmo que você emita um único `SELECT` (juntando `INNODB_TRX` e `PROCESSLIST`, por exemplo), o conteúdo dessas tabelas geralmente não é consistente. `INNODB_TRX` pode referenciar strings que não estão presentes em `PROCESSLIST` ou a consulta SQL atualmente em execução de uma transação mostrada em `INNODB_TRX.TRX_QUERY` pode diferir daquela em `PROCESSLIST.INFO`.

### 14.16.3 Tabelas do esquema de informação InnoDB

Você pode extrair metadados sobre objetos de esquema gerenciados por `InnoDB` usando as tabelas internas do sistema `InnoDB` `INFORMATION_SCHEMA`. Essas informações vêm das tabelas internas do sistema `InnoDB` (também referidas como o dicionário de dados `InnoDB`), que não podem ser consultadas diretamente como as tabelas regulares `InnoDB`. Tradicionalmente, você obteria esse tipo de informação usando as técnicas da Seção 14.18, “Monitoramento do InnoDB”, configurando os monitores `InnoDB` e analisando a saída da declaração `SHOW ENGINE INNODB STATUS`. A interface da tabela `InnoDB` `INFORMATION_SCHEMA` permite que você consulte esses dados usando SQL.

Com exceção de `INNODB_SYS_TABLESTATS`, para o qual não existe uma tabela de sistema interna correspondente, as tabelas de sistema `InnoDB` `INFORMATION_SCHEMA` são preenchidas com dados lidos diretamente de tabelas de sistema interna `InnoDB` em vez de dados provenientes de metadados que são armazenados em cache na memória.

As tabelas de sistema `InnoDB` e `INFORMATION_SCHEMA` incluem as tabelas listadas abaixo.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_SYS%';
+--------------------------------------------+
| Tables_in_information_schema (INNODB_SYS%) |
+--------------------------------------------+
| INNODB_SYS_DATAFILES                       |
| INNODB_SYS_TABLESTATS                      |
| INNODB_SYS_FOREIGN                         |
| INNODB_SYS_COLUMNS                         |
| INNODB_SYS_INDEXES                         |
| INNODB_SYS_FIELDS                          |
| INNODB_SYS_TABLESPACES                     |
| INNODB_SYS_FOREIGN_COLS                    |
| INNODB_SYS_TABLES                          |
+--------------------------------------------+
```

Os nomes das tabelas indicam o tipo de dados fornecidos:

* `INNODB_SYS_TABLES` fornece metadados sobre as tabelas `InnoDB`, equivalentes às informações da tabela `SYS_TABLES` no dicionário de dados `InnoDB`.

* `INNODB_SYS_COLUMNS` fornece metadados sobre as colunas da tabela `InnoDB`, equivalentes às informações da tabela `SYS_COLUMNS` no dicionário de dados `InnoDB`.

* `INNODB_SYS_INDEXES` fornece metadados sobre os índices `InnoDB`, equivalentes às informações da tabela `SYS_INDEXES` no dicionário de dados `InnoDB`.

* `INNODB_SYS_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices `InnoDB`, equivalentes às informações da tabela `SYS_FIELDS` do dicionário de dados `InnoDB`.

* `INNODB_SYS_TABLESTATS` fornece uma visão de informações de status de baixo nível sobre as tabelas `InnoDB` que são derivadas de estruturas de dados em memória. Não há uma tabela interna correspondente do sistema `InnoDB`.

* `INNODB_SYS_DATAFILES` fornece informações sobre o caminho do arquivo de dados para os arquivos por tabela `InnoDB` e espaços de tabela gerais, equivalentes às informações da tabela `SYS_DATAFILES` no dicionário de dados `InnoDB`.

* `INNODB_SYS_TABLESPACES` fornece metadados sobre os arquivos por tabela `InnoDB` e os espaços de tabela gerais, equivalentes às informações da tabela `SYS_TABLESPACES` no dicionário de dados `InnoDB`.

* `INNODB_SYS_FOREIGN` fornece metadados sobre as chaves estrangeiras definidas nas tabelas `InnoDB`, equivalentes às informações da tabela `SYS_FOREIGN` no dicionário de dados `InnoDB`.

* `INNODB_SYS_FOREIGN_COLS` fornece metadados sobre as colunas de chaves estrangeiras que são definidas nas tabelas de `InnoDB`, equivalentes às informações da tabela `SYS_FOREIGN_COLS` no dicionário de dados `InnoDB`.

As tabelas do sistema `InnoDB` podem ser unidas através de campos como `TABLE_ID`, `INDEX_ID` e `SPACE`, permitindo que você obtenha facilmente todos os dados disponíveis para um objeto que você deseja estudar ou monitorar.

Consulte a documentação do `InnoDB` INFORMATION_SCHEMA para obter informações sobre as colunas de cada tabela.

**Exemplo 14.2 Tabelas do esquema de informação InnoDB**

Este exemplo utiliza uma tabela simples (`t1`) com um único índice (`i1`) para demonstrar o tipo de metadados encontrados nas tabelas de sistema `InnoDB` `INFORMATION_SCHEMA`.

1. Crie um banco de dados de teste e uma tabela `t1`:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. Após criar a tabela `t1`, consulte a consulta `INNODB_SYS_TABLES` para localizar os metadados para `test/t1`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
   ...
   ```

A tabela `t1` tem um `TABLE_ID` de 71. O campo `FLAG` fornece informações em nível de bits sobre o formato da tabela e as características de armazenamento. Existem seis colunas, das quais três são colunas ocultas criadas por `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O ID da tabela `SPACE` é 57 (um valor de 0 indicaria que a tabela reside no espaço de tabelas do sistema). O `FILE_FORMAT` é Antelope e o `ROW_FORMAT` é Compact. `ZIP_PAGE_SIZE` só se aplica a tabelas com um formato de string `Compressed`.

3. Usando as informações do `TABLE_ID` do `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_COLUMNS` para obter informações sobre as colunas da tabela.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
   TABLE_ID: 71
       NAME: col1
        POS: 0
      MTYPE: 6
     PRTYPE: 1027
        LEN: 4
   *************************** 2. row ***************************
   TABLE_ID: 71
       NAME: col2
        POS: 1
      MTYPE: 2
     PRTYPE: 524542
        LEN: 10
   *************************** 3. row ***************************
   TABLE_ID: 71
       NAME: col3
        POS: 2
      MTYPE: 1
     PRTYPE: 524303
        LEN: 10
   ```

Além do `TABLE_ID` e da coluna `NAME`, o `INNODB_SYS_COLUMNS` fornece a posição ordinal (`POS`) de cada coluna (iniciando de 0 e incrementando sequencialmente), a coluna `MTYPE` ou “tipo principal” (6 = INT, 2 = CHAR, 1 = VARCHAR), o `PRTYPE` ou “tipo preciso” (um valor binário com bits que representam o tipo de dados MySQL, código de conjunto de caracteres e não nulidade) e o comprimento da coluna (`LEN`).

4. Usando as informações do `TABLE_ID` do `INNODB_SYS_TABLES`, novamente, consulte o `INNODB_SYS_INDEXES` para obter informações sobre os índices associados à tabela `t1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 71 \G
   *************************** 1. row ***************************
          INDEX_ID: 111
              NAME: GEN_CLUST_INDEX
          TABLE_ID: 71
              TYPE: 1
          N_FIELDS: 0
           PAGE_NO: 3
             SPACE: 57
   MERGE_THRESHOLD: 50
   *************************** 2. row ***************************
          INDEX_ID: 112
              NAME: i1
          TABLE_ID: 71
              TYPE: 0
          N_FIELDS: 1
           PAGE_NO: 4
             SPACE: 57
   MERGE_THRESHOLD: 50
   ```

`INNODB_SYS_INDEXES` retorna dados para dois índices. O primeiro índice é `GEN_CLUST_INDEX`, que é um índice agrupado criado por `InnoDB` se a tabela não tiver um índice agrupado definido pelo usuário. O segundo índice (`i1`) é o índice secundário definido pelo usuário.

O `INDEX_ID` é um identificador para o índice que é único em todas as bases de dados de uma instância. O `TABLE_ID` identifica a tabela com a qual o índice está associado. O valor do índice `TYPE` indica o tipo de índice (1 = Índice agrupado, 0 = Índice secundário). O valor do `N_FILEDS` é o número de campos que compõem o índice. O `PAGE_NO` é o número de página raiz do índice B-tree, e o `SPACE` é o ID do espaço de tabelas onde o índice reside. Um valor não nulo indica que o índice não reside no espaço de tabelas do sistema. O `MERGE_THRESHOLD` define um valor de limite percentual para a quantidade de dados em uma página de índice. Se a quantidade de dados em uma página de índice for menor que este valor (o padrão é 50%) quando uma string é excluída ou quando uma string é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha.

5. Usando as informações do `INDEX_ID` do `INNODB_SYS_INDEXES`, consulte o `INNODB_SYS_FIELDS` para obter informações sobre os campos do índice `i1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

`INNODB_SYS_FIELDS` fornece o `NAME` do campo indexado e sua posição ordinal dentro do índice. Se o índice (i1) tivesse sido definido em vários campos, `INNODB_SYS_FIELDS` forneceria metadados para cada um dos campos indexados.

6. Usando as informações do `SPACE` do `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_TABLESPACES` para obter informações sobre o espaço de tabela da tabela.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
           SPACE: 57
            NAME: test/t1
            FLAG: 0
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact or Redundant
       PAGE_SIZE: 16384
   ZIP_PAGE_SIZE: 0
   ```

Além do ID `SPACE` do tablespace e do `NAME` da tabela associada, o `INNODB_SYS_TABLESPACES` fornece dados do tablespace `FLAG`, que são informações de nível de bit sobre o formato do tablespace e as características de armazenamento. Também são fornecidos os tablespace `FILE_FORMAT`, `ROW_FORMAT`, `PAGE_SIZE` e vários outros itens de metadados do tablespace.

7. Usando as informações `SPACE` do `INNODB_SYS_TABLES`, novamente, consulte `INNODB_SYS_DATAFILES` para a localização do arquivo de dados do tablespace.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

O arquivo de dados está localizado no diretório `test` sob o diretório `data` do MySQL. Se um espaço de tabela por arquivo fosse criado em um local fora do diretório de dados do MySQL usando a cláusula `DATA DIRECTORY` da declaração `CREATE TABLE`, o espaço de tabelas `PATH` seria um caminho de diretório totalmente qualificado.

Como último passo, insira uma string na tabela `t1` (`TABLE_ID = 71`) e visualize os dados na tabela `INNODB_SYS_TABLESTATS`. Os dados desta tabela são utilizados pelo otimizador do MySQL para calcular qual índice usar ao consultar uma tabela `InnoDB`. Esta informação é derivada de estruturas de dados de memória. Não existe uma tabela interna correspondente do sistema `InnoDB`.

   ```sql
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
            TABLE_ID: 71
                NAME: test/t1
   STATS_INITIALIZED: Initialized
            NUM_ROWS: 1
    CLUST_INDEX_SIZE: 1
    OTHER_INDEX_SIZE: 0
    MODIFIED_COUNTER: 1
             AUTOINC: 0
           REF_COUNT: 1
   ```

O campo `STATS_INITIALIZED` indica se as estatísticas foram coletadas para a tabela ou não. `NUM_ROWS` é o número atual estimado de strings na tabela. Os campos `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE` relatam o número de páginas no disco que armazenam índices agrupados e secundários para a tabela, respectivamente. O valor `MODIFIED_COUNTER` mostra o número de strings modificadas por operações DML e operações em cascata a partir de chaves estrangeiras. O valor `AUTOINC` é o próximo número a ser emitido para qualquer operação baseada em autoincremento. Não há colunas de autoincremento definidas na tabela `t1`, então o valor é 0. O valor `REF_COUNT` é um contador. Quando o contador atingir 0, isso significa que os metadados da tabela podem ser expulsos do cache da tabela.

**Exemplo 14.3 Tabelas do Sistema INFORMATION_SCHEMA de Chave Estrangeira**

As tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS` fornecem dados sobre as relações de chave estrangeira. Este exemplo usa uma tabela pai e uma tabela filho com uma relação de chave estrangeira para demonstrar os dados encontrados nas tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`.

1. Crie o banco de dados de teste com as tabelas pai e filho:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE parent (id INT NOT NULL,
          PRIMARY KEY (id)) ENGINE=INNODB;

   mysql> CREATE TABLE child (id INT, parent_id INT,
          INDEX par_ind (parent_id),
          CONSTRAINT fk1
          FOREIGN KEY (parent_id) REFERENCES parent(id)
          ON DELETE CASCADE) ENGINE=INNODB;
   ```

2. Após a criação das tabelas de pais e filhos, consulte `INNODB_SYS_FOREIGN` e localize os dados da chave estrangeira para a relação de chave estrangeira `test/child` e `test/parent`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

Os metadados incluem a chave estrangeira `ID` (`fk1`), que é nomeada para a chave estrangeira `CONSTRAINT` que foi definida na tabela de filhos. O `FOR_NAME` é o nome da tabela de filhos onde a chave estrangeira é definida. `REF_NAME` é o nome da tabela pai (a tabela “referenciada”). `N_COLS` é o número de colunas no índice da chave estrangeira. `TYPE` é um valor numérico que representa flags de bits que fornecem informações adicionais sobre a coluna da chave estrangeira. Neste caso, o valor `TYPE` é 1, o que indica que a opção `ON DELETE CASCADE` foi especificada para a chave estrangeira. Consulte a definição da tabela `INNODB_SYS_FOREIGN` para mais informações sobre os valores `TYPE`.

3. Usando a chave estrangeira `ID`, consulte `INNODB_SYS_FOREIGN_COLS` para visualizar dados sobre as colunas da chave estrangeira.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

`FOR_COL_NAME` é o nome da coluna de chave estrangeira na tabela secundária, e `REF_COL_NAME` é o nome da coluna referenciada na tabela principal. O valor `POS` é a posição ordinal do campo chave dentro do índice de chave estrangeira, começando em zero.

**Exemplo 14.4: Conexão a tabelas do esquema de informação InnoDB**

Este exemplo demonstra a junção de três tabelas do sistema `InnoDB` `INFORMATION_SCHEMA` (`INNODB_SYS_TABLES`, `INNODB_SYS_TABLESPACES` e `INNODB_SYS_TABLESTATS`) para coletar informações sobre o formato do arquivo, o formato da string, o tamanho da página e o tamanho do índice sobre as tabelas no banco de dados de amostra de funcionários.

Os seguintes aliases de nome de tabela são usados para encurtar a string de consulta:

* `INFORMATION_SCHEMA.INNODB_SYS_TABLES`: um

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES`: b

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS`: c

Uma função de fluxo de controle `IF()` é usada para contabilizar tabelas comprimidas. Se uma tabela estiver comprimida, o tamanho do índice é calculado usando `ZIP_PAGE_SIZE` em vez de `PAGE_SIZE`. `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE`, que são relatados em bytes, são divididos por `1024*1024` para fornecer tamanhos de índice em megabytes (MBs). Os valores em MB são arredondados para zero espaços decimais usando a função `ROUND()`.

```sql
mysql> SELECT a.NAME, a.FILE_FORMAT, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+-------------+------------+-----------+-------+-----------+
| NAME                   | FILE_FORMAT | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+-------------+------------+-----------+-------+-----------+
| employees/titles       | Antelope    | Compact    |     16384 |    20 |        11 |
| employees/salaries     | Antelope    | Compact    |     16384 |    91 |        33 |
| employees/employees    | Antelope    | Compact    |     16384 |    15 |         0 |
| employees/dept_manager | Antelope    | Compact    |     16384 |     0 |         0 |
| employees/dept_emp     | Antelope    | Compact    |     16384 |    12 |        10 |
| employees/departments  | Antelope    | Compact    |     16384 |     0 |         0 |
+------------------------+-------------+------------+-----------+-------+-----------+
```

### 14.16.4 Tabelas de índice FULLTEXT do esquema de informação InnoDB

As tabelas a seguir fornecem metadados para os índices `FULLTEXT`:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_FT%';
+-------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_FT%) |
+-------------------------------------------+
| INNODB_FT_CONFIG                          |
| INNODB_FT_BEING_DELETED                   |
| INNODB_FT_DELETED                         |
| INNODB_FT_DEFAULT_STOPWORD                |
| INNODB_FT_INDEX_TABLE                     |
| INNODB_FT_INDEX_CACHE                     |
+-------------------------------------------+
```

#### Visão geral da tabela

* `INNODB_FT_CONFIG`: Fornece metadados sobre o índice `FULLTEXT` e o processamento associado a uma tabela `InnoDB`.

* `INNODB_FT_BEING_DELETED`: Fornece um instantâneo da tabela `INNODB_FT_DELETED`; é usado apenas durante uma operação de manutenção do `OPTIMIZE TABLE`. Quando o `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores do `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo do `INNODB_FT_BEING_DELETED` geralmente tem uma vida curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para informações sobre como executar o `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 12.9.6, “Ajustando o MySQL de Pesquisa de Texto Completo”.

* `INNODB_FT_DELETED`: Armazena strings que são excluídas do índice `FULLTEXT` para uma tabela `InnoDB`. Para evitar a reorganização cara do índice durante operações de MQL para um índice `InnoDB` `FULLTEXT`, as informações sobre palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma declaração `OPTIMIZE TABLE` para a tabela `InnoDB`.

* `INNODB_FT_DEFAULT_STOPWORD`: Contém uma lista de palavras-chave que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`.

Para informações sobre a tabela `INNODB_FT_DEFAULT_STOPWORD`, consulte a Seção 12.9.4, “Palavras-chave de parada de texto completo”.

* `INNODB_FT_INDEX_TABLE`: Fornece informações sobre o índice invertido usado para processar pesquisas de texto contra o índice `FULLTEXT` de uma tabela `InnoDB`.

* `INNODB_FT_INDEX_CACHE`: Fornece informações sobre tokens de novas strings inseridas em um índice `FULLTEXT`. Para evitar a reorganização cara de índice durante operações de DML, as informações sobre as palavras indexadas recentemente são armazenadas separadamente e combinadas com o índice de pesquisa principal apenas quando o `OPTIMIZE TABLE` é executado, quando o servidor é desligado ou quando o tamanho da cache excede um limite definido pela variável de sistema `innodb_ft_cache_size` ou `innodb_ft_total_cache_size`.

Nota

Com exceção da tabela `INNODB_FT_DEFAULT_STOPWORD`, essas tabelas estão vazias inicialmente. Antes de fazer qualquer consulta a qualquer uma delas, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT` (por exemplo, `test/articles`).

**Exemplo 14.5 Tabelas de informações do índice FULLTEXT do InnoDB**

Este exemplo usa uma tabela com um índice `FULLTEXT` para demonstrar os dados contidos nas tabelas `FULLTEXT` e `INFORMATION_SCHEMA`.

1. Crie uma tabela com um índice `FULLTEXT` e insira alguns dados:

   ```sql
   mysql> CREATE TABLE articles (
            id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            title VARCHAR(200),
            body TEXT,
            FULLTEXT (title,body)
          ) ENGINE=InnoDB;

   mysql> INSERT INTO articles (title,body) VALUES
          ('MySQL Tutorial','DBMS stands for DataBase ...'),
          ('How To Use MySQL Well','After you went through a ...'),
          ('Optimizing MySQL','In this tutorial we show ...'),
          ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
          ('MySQL vs. YourSQL','In the following database comparison ...'),
          ('MySQL Security','When configured properly, MySQL ...');
   ```

2. Defina a variável `innodb_ft_aux_table` com o nome da tabela que possui o índice `FULLTEXT`. Se essa variável não for definida, as tabelas `InnoDB` `FULLTEXT` `INFORMATION_SCHEMA` serão vazias, com exceção de `INNODB_FT_DEFAULT_STOPWORD`.

   ```sql
   SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Consulte a tabela `INNODB_FT_INDEX_CACHE`, que exibe informações sobre as strings recém-inseridas em um índice `FULLTEXT`. Para evitar a reorganização cara de índice durante operações de DML, os dados das strings recém-inseridas permanecem no cache do índice `FULLTEXT` até que `OPTIMIZE TABLE` seja executado (ou até que o servidor seja desligado ou os limites de cache sejam excedidos).

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

4. Ative a variável de sistema `innodb_optimize_fulltext_only` e execute `OPTIMIZE TABLE` na tabela que contém o índice `FULLTEXT`. Essa operação esvazia o conteúdo do cache do índice `FULLTEXT` para o índice principal `FULLTEXT`. `innodb_optimize_fulltext_only` altera a forma como a declaração `OPTIMIZE TABLE` opera em tabelas `InnoDB`, e é destinado a ser habilitado temporariamente, durante operações de manutenção em tabelas `InnoDB` com índices `FULLTEXT`.

   ```sql
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Consulte a tabela `INNODB_FT_INDEX_TABLE` para visualizar informações sobre os dados no índice principal `FULLTEXT`, incluindo informações sobre os dados que foram recentemente descartados do cache de cache `FULLTEXT`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

A tabela `INNODB_FT_INDEX_CACHE` está agora vazia, uma vez que a operação `OPTIMIZE TABLE` esvaziou o cache do índice `FULLTEXT`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Exclua alguns registros da tabela `test/articles`.

   ```sql
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Consultar a tabela `INNODB_FT_DELETED`. Esta tabela registra as strings que são excluídas do índice `FULLTEXT`. Para evitar a reorganização cara do índice durante operações de MQL, as informações sobre os registros recém-excluídos são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal quando você executa `OPTIMIZE TABLE`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   +--------+
   | DOC_ID |
   +--------+
   |      2 |
   |      3 |
   |      4 |
   +--------+
   ```

8. Execute `OPTIMIZE TABLE` para remover os registros excluídos.

   ```sql
   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

A tabela `INNODB_FT_DELETED` deve agora estar vazia.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Consulte a tabela `INNODB_FT_CONFIG`. Esta tabela contém metadados sobre o índice `FULLTEXT` e o processamento relacionado:

* `optimize_checkpoint_limit`: O número de segundos após o qual uma corrida `OPTIMIZE TABLE` é interrompida.

* `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

* `stopword_table_name`: O nome *`database/table`* para uma tabela de palavras não definidas pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de palavras não definidas pelo usuário.

* `use_stopword`: Indica se uma tabela de palavras-chave é usada, que é definida quando o índice `FULLTEXT` é criado.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
   +---------------------------+-------+
   | KEY                       | VALUE |
   +---------------------------+-------+
   | optimize_checkpoint_limit | 180   |
   | synced_doc_id             | 8     |
   | stopword_table_name       |       |
   | use_stopword              | 1     |
   +---------------------------+-------+
   ```

10. Desative `innodb_optimize_fulltext_only`, pois está destinado a ser habilitado apenas temporariamente:

    ```sql
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```

### 14.16.5 Tabelas do Banco de Buffer do Schema de Informação InnoDB

As tabelas de pool de buffers `InnoDB` e `INFORMATION_SCHEMA` fornecem informações de status do pool de buffers e metadados sobre as páginas dentro do pool de buffers `InnoDB`.

As tabelas do pool de buffers `InnoDB` e `INFORMATION_SCHEMA` incluem as listadas abaixo:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_BUFFER%';
+-----------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_BUFFER%) |
+-----------------------------------------------+
| INNODB_BUFFER_PAGE_LRU                        |
| INNODB_BUFFER_PAGE                            |
| INNODB_BUFFER_POOL_STATS                      |
+-----------------------------------------------+
```

#### Visão geral da tabela

* `INNODB_BUFFER_PAGE`: Armazena informações sobre cada página no `InnoDB` buffer pool.

* `INNODB_BUFFER_PAGE_LRU`: Armazena informações sobre as páginas no `InnoDB` buffer pool, em particular, como elas estão ordenadas na lista LRU que determina quais páginas devem ser removidas do buffer pool quando ele se torna cheio. A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, exceto que a tabela `INNODB_BUFFER_PAGE_LRU` tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

* `INNODB_BUFFER_POOL_STATS`: Fornece informações sobre o estado do pool de buffer. Grande parte das mesmas informações são fornecidas pelo `SHOW ENGINE INNODB STATUS` de saída, ou podem ser obtidas usando as variáveis de status do servidor do pool de buffer `InnoDB`.

Aviso

Consultar as tabelas `INNODB_BUFFER_PAGE` ou `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não consulte essas tabelas em um sistema de produção a menos que você esteja ciente do impacto no desempenho e tenha determinado que é aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

**Exemplo 14.6: Consultando dados do sistema na tabela INNODB\_BUFFER\_PAGE**

Essa consulta fornece um contagem aproximada de páginas que contêm dados do sistema, excluindo as páginas onde o valor `TABLE_NAME` é `NULL` ou inclui uma barra `/` ou período `.` no nome da tabela, o que indica uma tabela definida pelo usuário.

```sql
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+----------+
| COUNT(*) |
+----------+
|     1516 |
+----------+
```

Essa consulta retorna o número aproximado de páginas que contêm dados do sistema, o número total de páginas do pool de buffer e uma porcentagem aproximada de páginas que contêm dados do sistema.

```sql
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0)
       ) AS system_pages,
       (
       SELECT COUNT(*)
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((system_pages/total_pages) * 100)
       ) AS system_page_percentage;
+--------------+-------------+------------------------+
| system_pages | total_pages | system_page_percentage |
+--------------+-------------+------------------------+
|          295 |        8192 |                      4 |
+--------------+-------------+------------------------+
```

O tipo de dados do sistema no buffer pool pode ser determinado consultando o valor `PAGE_TYPE`. Por exemplo, a seguinte consulta retorna oito valores distintos `PAGE_TYPE` entre as páginas que contêm dados do sistema:

```sql
mysql> SELECT DISTINCT PAGE_TYPE FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+-------------------+
| PAGE_TYPE         |
+-------------------+
| SYSTEM            |
| IBUF_BITMAP       |
| UNKNOWN           |
| FILE_SPACE_HEADER |
| INODE             |
| UNDO_LOG          |
| ALLOCATED         |
+-------------------+
```

**Exemplo 14.7: Consultando dados do usuário na tabela INNODB\_BUFFER\_PAGE**

Essa consulta fornece um contagem aproximada de páginas que contêm dados do usuário, contando páginas onde o valor `TABLE_NAME` é `NOT NULL` e `NOT LIKE '%INNODB_SYS_TABLES%'`.

```sql
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND TABLE_NAME NOT LIKE '%INNODB_SYS_TABLES%';
+----------+
| COUNT(*) |
+----------+
|     7897 |
+----------+
```

Essa consulta retorna o número aproximado de páginas que contêm dados do usuário, o número total de páginas do buffer pool e uma porcentagem aproximada de páginas que contêm dados do usuário.

```sql
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       ) AS user_pages,
       (
       SELECT COUNT(*)
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((user_pages/total_pages) * 100)
       ) AS user_page_percentage;
+------------+-------------+----------------------+
| user_pages | total_pages | user_page_percentage |
+------------+-------------+----------------------+
|       7897 |        8192 |                   96 |
+------------+-------------+----------------------+
```

Esta consulta identifica tabelas definidas pelo usuário com páginas no buffer pool:

```sql
mysql> SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       AND TABLE_NAME NOT LIKE '`mysql`.`innodb_%';
+-------------------------+
| TABLE_NAME              |
+-------------------------+
| `employees`.`salaries`  |
| `employees`.`employees` |
+-------------------------+
```

**Exemplo 14.8: Consultando dados de índice na tabela INNODB\_BUFFER\_PAGE**

Para obter informações sobre páginas de índice, consulte a coluna `INDEX_NAME` usando o nome do índice. Por exemplo, a seguinte consulta retorna o número de páginas e o tamanho total dos dados das páginas para o índice `emp_no` que está definido na tabela `employees.salaries`:

```sql
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
       ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
       AS 'Total Data (MB)'
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE INDEX_NAME='emp_no' AND TABLE_NAME = '`employees`.`salaries`';
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1609 |              25 |
+------------+-------+-----------------+
```

Essa consulta retorna o número de páginas e o tamanho total dos dados das páginas para todos os índices definidos na tabela `employees.salaries`:

```sql
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
       ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
       AS 'Total Data (MB)'
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME = '`employees`.`salaries`'
       GROUP BY INDEX_NAME;
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1608 |              25 |
| PRIMARY    |  6086 |              95 |
+------------+-------+-----------------+
```

**Exemplo 14.9: Consultando dados LRU_POSITION na tabela INNODB_BUFFER_PAGE_LRU**

A tabela `INNODB_BUFFER_PAGE_LRU` contém informações sobre as páginas no conjunto de buffers `InnoDB`, em particular, como elas são ordenadas, o que determina quais páginas devem ser eliminadas do conjunto de buffers quando ele ficar cheio. A definição para esta página é a mesma que para `INNODB_BUFFER_PAGE`, exceto que esta tabela tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

Esta consulta conta o número de posições em um local específico na lista LRU ocupadas por páginas da tabela `employees.employees`.

```sql
mysql> SELECT COUNT(LRU_POSITION) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU
       WHERE TABLE_NAME='`employees`.`employees`' AND LRU_POSITION < 3072;
+---------------------+
| COUNT(LRU_POSITION) |
+---------------------+
|                 548 |
+---------------------+
```

**Exemplo 14.10: Consultando a tabela INNODB\_BUFFER\_POOL\_STATS**

A tabela `INNODB_BUFFER_POOL_STATS` fornece informações semelhantes às variáveis de estado de `SHOW ENGINE INNODB STATUS` e `InnoDB` do pool de buffer.

```sql
mysql> SELECT * FROM information_schema.INNODB_BUFFER_POOL_STATS \G
*************************** 1. row ***************************
                         POOL_ID: 0
                       POOL_SIZE: 8192
                    FREE_BUFFERS: 1
                  DATABASE_PAGES: 8173
              OLD_DATABASE_PAGES: 3014
         MODIFIED_DATABASE_PAGES: 0
              PENDING_DECOMPRESS: 0
                   PENDING_READS: 0
               PENDING_FLUSH_LRU: 0
              PENDING_FLUSH_LIST: 0
                PAGES_MADE_YOUNG: 15907
            PAGES_NOT_MADE_YOUNG: 3803101
           PAGES_MADE_YOUNG_RATE: 0
       PAGES_MADE_NOT_YOUNG_RATE: 0
               NUMBER_PAGES_READ: 3270
            NUMBER_PAGES_CREATED: 13176
            NUMBER_PAGES_WRITTEN: 15109
                 PAGES_READ_RATE: 0
               PAGES_CREATE_RATE: 0
              PAGES_WRITTEN_RATE: 0
                NUMBER_PAGES_GET: 33069332
                        HIT_RATE: 0
    YOUNG_MAKE_PER_THOUSAND_GETS: 0
NOT_YOUNG_MAKE_PER_THOUSAND_GETS: 0
         NUMBER_PAGES_READ_AHEAD: 2713
       NUMBER_READ_AHEAD_EVICTED: 0
                 READ_AHEAD_RATE: 0
         READ_AHEAD_EVICTED_RATE: 0
                    LRU_IO_TOTAL: 0
                  LRU_IO_CURRENT: 0
                UNCOMPRESS_TOTAL: 0
              UNCOMPRESS_CURRENT: 0
```

Para comparação, a saída do `SHOW ENGINE INNODB STATUS` e a saída da variável de status do pool de buffer `InnoDB` são mostradas abaixo, com base no mesmo conjunto de dados.

Para mais informações sobre a saída de `SHOW ENGINE INNODB STATUS`, consulte a Seção 14.18.3, “Saída do Monitor Padrão InnoDB e do Monitor de Bloqueio”.

```sql
mysql> SHOW ENGINE INNODB STATUS \G
...
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 137428992
Dictionary memory allocated 579084
Buffer pool size   8192
Free buffers       1
Database pages     8173
Old database pages 3014
Modified db pages  0
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 15907, not young 3803101
0.00 youngs/s, 0.00 non-youngs/s
Pages read 3270, created 13176, written 15109
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
No buffer pool page gets since the last printout
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 8173, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
...
```

Para descrições de variáveis de status, consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

```sql
mysql> SHOW STATUS LIKE 'Innodb_buffer%';
+---------------------------------------+-------------+
| Variable_name                         | Value       |
+---------------------------------------+-------------+
| Innodb_buffer_pool_dump_status        | not started |
| Innodb_buffer_pool_load_status        | not started |
| Innodb_buffer_pool_resize_status      | not started |
| Innodb_buffer_pool_pages_data         | 8173        |
| Innodb_buffer_pool_bytes_data         | 133906432   |
| Innodb_buffer_pool_pages_dirty        | 0           |
| Innodb_buffer_pool_bytes_dirty        | 0           |
| Innodb_buffer_pool_pages_flushed      | 15109       |
| Innodb_buffer_pool_pages_free         | 1           |
| Innodb_buffer_pool_pages_misc         | 18          |
| Innodb_buffer_pool_pages_total        | 8192        |
| Innodb_buffer_pool_read_ahead_rnd     | 0           |
| Innodb_buffer_pool_read_ahead         | 2713        |
| Innodb_buffer_pool_read_ahead_evicted | 0           |
| Innodb_buffer_pool_read_requests      | 33069332    |
| Innodb_buffer_pool_reads              | 558         |
| Innodb_buffer_pool_wait_free          | 0           |
| Innodb_buffer_pool_write_requests     | 11985961    |
+---------------------------------------+-------------+
```

### 14.16.6 Tabela de métricas do esquema de informações InnoDB

A tabela `INNODB_METRICS` fornece informações sobre os contadores de desempenho e relacionados a recursos `InnoDB`.

As colunas da tabela `INNODB_METRICS` são mostradas abaixo. Para descrições de colunas, consulte a Seção 24.4.16, “A tabela INFORMATION_SCHEMA INNODB_METRICS”.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 46273
      MAX_COUNT: 46273
      MIN_COUNT: NULL
      AVG_COUNT: 492.2659574468085
    COUNT_RESET: 46273
MAX_COUNT_RESET: 46273
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-11-28 16:07:53
  TIME_DISABLED: NULL
   TIME_ELAPSED: 94
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Habilitando, Desabilitando e Redefinindo Contadores

Você pode habilitar, desabilitar e redefinir contadores usando as seguintes variáveis:

* `innodb_monitor_enable`: Habilita contadores.

  ```sql
  SET GLOBAL innodb_monitor_enable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_disable`: Desabilita os contadores.

  ```sql
  SET GLOBAL innodb_monitor_disable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset`: Redefine os valores do contador para zero.

  ```sql
  SET GLOBAL innodb_monitor_reset = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset_all`: Redefine todos os valores do contador. Um contador deve ser desativado antes de usar `innodb_monitor_reset_all`.

  ```sql
  SET GLOBAL innodb_monitor_reset_all = [counter-name|module_name|pattern|all];
  ```

Os contadores e módulos de contador também podem ser habilitados na inicialização usando o arquivo de configuração do servidor MySQL. Por exemplo, para habilitar o módulo `log`, os contadores `metadata_table_handles_opened` e `metadata_table_handles_closed`, insira a seguinte string na seção `[mysqld]` do arquivo de configuração do servidor MySQL.

```sql
[mysqld]
innodb_monitor_enable = module_recovery,metadata_table_handles_opened,metadata_table_handles_closed
```

Ao habilitar vários contadores ou módulos em um arquivo de configuração, especifique a variável `innodb_monitor_enable` seguida pelos nomes do contador e do módulo separados por vírgula, conforme mostrado acima. Apenas a variável `innodb_monitor_enable` pode ser usada em um arquivo de configuração. As variáveis `innodb_monitor_disable` e `innodb_monitor_reset` são suportadas apenas na string de comando.

Nota

Como cada contador adiciona um grau de sobrecarga de tempo de execução, use contadores de forma conservadora em servidores de produção para diagnosticar problemas específicos ou monitorar funcionalidades específicas. Um servidor de teste ou de desenvolvimento é recomendado para uso mais extenso de contadores.

#### Contadores

A lista de contadores disponíveis pode ser alterada. Consulte o esquema de informações da tabela `INNODB_METRICS` para obter os contadores disponíveis na versão do seu servidor MySQL.

Os contadores habilitados por padrão correspondem aos mostrados na saída `SHOW ENGINE INNODB STATUS`. Os contadores mostrados na saída `SHOW ENGINE INNODB STATUS` estão sempre habilitados em nível de sistema, mas podem ser desabilitados para a tabela `INNODB_METRICS`. O status do contador não é persistente. A menos que configurado de outra forma, os contadores retornam ao seu status habilitado ou desabilitado padrão quando o servidor é reiniciado.

Se você executa programas que seriam afetados pela adição ou remoção de contagem, é recomendável que você revise as notas de lançamento e consulte a tabela `INNODB_METRICS` para identificar essas mudanças como parte do seu processo de atualização.

```sql
mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS ORDER BY NAME;
+------------------------------------------+---------------------+----------+
| name                                     | subsystem           | status   |
+------------------------------------------+---------------------+----------+
| adaptive_hash_pages_added                | adaptive_hash_index | disabled |
| adaptive_hash_pages_removed              | adaptive_hash_index | disabled |
| adaptive_hash_rows_added                 | adaptive_hash_index | disabled |
| adaptive_hash_rows_deleted_no_hash_entry | adaptive_hash_index | disabled |
| adaptive_hash_rows_removed               | adaptive_hash_index | disabled |
| adaptive_hash_rows_updated               | adaptive_hash_index | disabled |
| adaptive_hash_searches                   | adaptive_hash_index | enabled  |
| adaptive_hash_searches_btree             | adaptive_hash_index | enabled  |
| buffer_data_reads                        | buffer              | enabled  |
| buffer_data_written                      | buffer              | enabled  |
| buffer_flush_adaptive                    | buffer              | disabled |
| buffer_flush_adaptive_avg_pass           | buffer              | disabled |
| buffer_flush_adaptive_avg_time_est       | buffer              | disabled |
| buffer_flush_adaptive_avg_time_slot      | buffer              | disabled |
| buffer_flush_adaptive_avg_time_thread    | buffer              | disabled |
| buffer_flush_adaptive_pages              | buffer              | disabled |
| buffer_flush_adaptive_total_pages        | buffer              | disabled |
| buffer_flush_avg_page_rate               | buffer              | disabled |
| buffer_flush_avg_pass                    | buffer              | disabled |
| buffer_flush_avg_time                    | buffer              | disabled |
| buffer_flush_background                  | buffer              | disabled |
| buffer_flush_background_pages            | buffer              | disabled |
| buffer_flush_background_total_pages      | buffer              | disabled |
| buffer_flush_batches                     | buffer              | disabled |
| buffer_flush_batch_num_scan              | buffer              | disabled |
| buffer_flush_batch_pages                 | buffer              | disabled |
| buffer_flush_batch_scanned               | buffer              | disabled |
| buffer_flush_batch_scanned_per_call      | buffer              | disabled |
| buffer_flush_batch_total_pages           | buffer              | disabled |
| buffer_flush_lsn_avg_rate                | buffer              | disabled |
| buffer_flush_neighbor                    | buffer              | disabled |
| buffer_flush_neighbor_pages              | buffer              | disabled |
| buffer_flush_neighbor_total_pages        | buffer              | disabled |
| buffer_flush_n_to_flush_by_age           | buffer              | disabled |
| buffer_flush_n_to_flush_requested        | buffer              | disabled |
| buffer_flush_pct_for_dirty               | buffer              | disabled |
| buffer_flush_pct_for_lsn                 | buffer              | disabled |
| buffer_flush_sync                        | buffer              | disabled |
| buffer_flush_sync_pages                  | buffer              | disabled |
| buffer_flush_sync_total_pages            | buffer              | disabled |
| buffer_flush_sync_waits                  | buffer              | disabled |
| buffer_LRU_batches_evict                 | buffer              | disabled |
| buffer_LRU_batches_flush                 | buffer              | disabled |
| buffer_LRU_batch_evict_pages             | buffer              | disabled |
| buffer_LRU_batch_evict_total_pages       | buffer              | disabled |
| buffer_LRU_batch_flush_avg_pass          | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_est      | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_slot     | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_thread   | buffer              | disabled |
| buffer_LRU_batch_flush_pages             | buffer              | disabled |
| buffer_LRU_batch_flush_total_pages       | buffer              | disabled |
| buffer_LRU_batch_num_scan                | buffer              | disabled |
| buffer_LRU_batch_scanned                 | buffer              | disabled |
| buffer_LRU_batch_scanned_per_call        | buffer              | disabled |
| buffer_LRU_get_free_loops                | buffer              | disabled |
| buffer_LRU_get_free_search               | Buffer              | disabled |
| buffer_LRU_get_free_waits                | buffer              | disabled |
| buffer_LRU_search_num_scan               | buffer              | disabled |
| buffer_LRU_search_scanned                | buffer              | disabled |
| buffer_LRU_search_scanned_per_call       | buffer              | disabled |
| buffer_LRU_single_flush_failure_count    | Buffer              | disabled |
| buffer_LRU_single_flush_num_scan         | buffer              | disabled |
| buffer_LRU_single_flush_scanned          | buffer              | disabled |
| buffer_LRU_single_flush_scanned_per_call | buffer              | disabled |
| buffer_LRU_unzip_search_num_scan         | buffer              | disabled |
| buffer_LRU_unzip_search_scanned          | buffer              | disabled |
| buffer_LRU_unzip_search_scanned_per_call | buffer              | disabled |
| buffer_pages_created                     | buffer              | enabled  |
| buffer_pages_read                        | buffer              | enabled  |
| buffer_pages_written                     | buffer              | enabled  |
| buffer_page_read_blob                    | buffer_page_io      | disabled |
| buffer_page_read_fsp_hdr                 | buffer_page_io      | disabled |
| buffer_page_read_ibuf_bitmap             | buffer_page_io      | disabled |
| buffer_page_read_ibuf_free_list          | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_leaf         | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_non_leaf     | buffer_page_io      | disabled |
| buffer_page_read_index_inode             | buffer_page_io      | disabled |
| buffer_page_read_index_leaf              | buffer_page_io      | disabled |
| buffer_page_read_index_non_leaf          | buffer_page_io      | disabled |
| buffer_page_read_other                   | buffer_page_io      | disabled |
| buffer_page_read_system_page             | buffer_page_io      | disabled |
| buffer_page_read_trx_system              | buffer_page_io      | disabled |
| buffer_page_read_undo_log                | buffer_page_io      | disabled |
| buffer_page_read_xdes                    | buffer_page_io      | disabled |
| buffer_page_read_zblob                   | buffer_page_io      | disabled |
| buffer_page_read_zblob2                  | buffer_page_io      | disabled |
| buffer_page_written_blob                 | buffer_page_io      | disabled |
| buffer_page_written_fsp_hdr              | buffer_page_io      | disabled |
| buffer_page_written_ibuf_bitmap          | buffer_page_io      | disabled |
| buffer_page_written_ibuf_free_list       | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_leaf      | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_non_leaf  | buffer_page_io      | disabled |
| buffer_page_written_index_inode          | buffer_page_io      | disabled |
| buffer_page_written_index_leaf           | buffer_page_io      | disabled |
| buffer_page_written_index_non_leaf       | buffer_page_io      | disabled |
| buffer_page_written_other                | buffer_page_io      | disabled |
| buffer_page_written_system_page          | buffer_page_io      | disabled |
| buffer_page_written_trx_system           | buffer_page_io      | disabled |
| buffer_page_written_undo_log             | buffer_page_io      | disabled |
| buffer_page_written_xdes                 | buffer_page_io      | disabled |
| buffer_page_written_zblob                | buffer_page_io      | disabled |
| buffer_page_written_zblob2               | buffer_page_io      | disabled |
| buffer_pool_bytes_data                   | buffer              | enabled  |
| buffer_pool_bytes_dirty                  | buffer              | enabled  |
| buffer_pool_pages_data                   | buffer              | enabled  |
| buffer_pool_pages_dirty                  | buffer              | enabled  |
| buffer_pool_pages_free                   | buffer              | enabled  |
| buffer_pool_pages_misc                   | buffer              | enabled  |
| buffer_pool_pages_total                  | buffer              | enabled  |
| buffer_pool_reads                        | buffer              | enabled  |
| buffer_pool_read_ahead                   | buffer              | enabled  |
| buffer_pool_read_ahead_evicted           | buffer              | enabled  |
| buffer_pool_read_requests                | buffer              | enabled  |
| buffer_pool_size                         | server              | enabled  |
| buffer_pool_wait_free                    | buffer              | enabled  |
| buffer_pool_write_requests               | buffer              | enabled  |
| compression_pad_decrements               | compression         | disabled |
| compression_pad_increments               | compression         | disabled |
| compress_pages_compressed                | compression         | disabled |
| compress_pages_decompressed              | compression         | disabled |
| ddl_background_drop_indexes              | ddl                 | disabled |
| ddl_background_drop_tables               | ddl                 | disabled |
| ddl_log_file_alter_table                 | ddl                 | disabled |
| ddl_online_create_index                  | ddl                 | disabled |
| ddl_pending_alter_table                  | ddl                 | disabled |
| ddl_sort_file_alter_table                | ddl                 | disabled |
| dml_deletes                              | dml                 | enabled  |
| dml_inserts                              | dml                 | enabled  |
| dml_reads                                | dml                 | disabled |
| dml_updates                              | dml                 | enabled  |
| file_num_open_files                      | file_system         | enabled  |
| ibuf_merges                              | change_buffer       | enabled  |
| ibuf_merges_delete                       | change_buffer       | enabled  |
| ibuf_merges_delete_mark                  | change_buffer       | enabled  |
| ibuf_merges_discard_delete               | change_buffer       | enabled  |
| ibuf_merges_discard_delete_mark          | change_buffer       | enabled  |
| ibuf_merges_discard_insert               | change_buffer       | enabled  |
| ibuf_merges_insert                       | change_buffer       | enabled  |
| ibuf_size                                | change_buffer       | enabled  |
| icp_attempts                             | icp                 | disabled |
| icp_match                                | icp                 | disabled |
| icp_no_match                             | icp                 | disabled |
| icp_out_of_range                         | icp                 | disabled |
| index_page_discards                      | index               | disabled |
| index_page_merge_attempts                | index               | disabled |
| index_page_merge_successful              | index               | disabled |
| index_page_reorg_attempts                | index               | disabled |
| index_page_reorg_successful              | index               | disabled |
| index_page_splits                        | index               | disabled |
| innodb_activity_count                    | server              | enabled  |
| innodb_background_drop_table_usec        | server              | disabled |
| innodb_checkpoint_usec                   | server              | disabled |
| innodb_dblwr_pages_written               | server              | enabled  |
| innodb_dblwr_writes                      | server              | enabled  |
| innodb_dict_lru_count                    | server              | disabled |
| innodb_dict_lru_usec                     | server              | disabled |
| innodb_ibuf_merge_usec                   | server              | disabled |
| innodb_log_flush_usec                    | server              | disabled |
| innodb_master_active_loops               | server              | disabled |
| innodb_master_idle_loops                 | server              | disabled |
| innodb_master_purge_usec                 | server              | disabled |
| innodb_master_thread_sleeps              | server              | disabled |
| innodb_mem_validate_usec                 | server              | disabled |
| innodb_page_size                         | server              | enabled  |
| innodb_rwlock_sx_os_waits                | server              | enabled  |
| innodb_rwlock_sx_spin_rounds             | server              | enabled  |
| innodb_rwlock_sx_spin_waits              | server              | enabled  |
| innodb_rwlock_s_os_waits                 | server              | enabled  |
| innodb_rwlock_s_spin_rounds              | server              | enabled  |
| innodb_rwlock_s_spin_waits               | server              | enabled  |
| innodb_rwlock_x_os_waits                 | server              | enabled  |
| innodb_rwlock_x_spin_rounds              | server              | enabled  |
| innodb_rwlock_x_spin_waits               | server              | enabled  |
| lock_deadlocks                           | lock                | enabled  |
| lock_rec_locks                           | lock                | disabled |
| lock_rec_lock_created                    | lock                | disabled |
| lock_rec_lock_removed                    | lock                | disabled |
| lock_rec_lock_requests                   | lock                | disabled |
| lock_rec_lock_waits                      | lock                | disabled |
| lock_row_lock_current_waits              | lock                | enabled  |
| lock_row_lock_time                       | lock                | enabled  |
| lock_row_lock_time_avg                   | lock                | enabled  |
| lock_row_lock_time_max                   | lock                | enabled  |
| lock_row_lock_waits                      | lock                | enabled  |
| lock_table_locks                         | lock                | disabled |
| lock_table_lock_created                  | lock                | disabled |
| lock_table_lock_removed                  | lock                | disabled |
| lock_table_lock_waits                    | lock                | disabled |
| lock_timeouts                            | lock                | enabled  |
| log_checkpoints                          | recovery            | disabled |
| log_lsn_buf_pool_oldest                  | recovery            | disabled |
| log_lsn_checkpoint_age                   | recovery            | disabled |
| log_lsn_current                          | recovery            | disabled |
| log_lsn_last_checkpoint                  | recovery            | disabled |
| log_lsn_last_flush                       | recovery            | disabled |
| log_max_modified_age_async               | recovery            | disabled |
| log_max_modified_age_sync                | recovery            | disabled |
| log_num_log_io                           | recovery            | disabled |
| log_padded                               | recovery            | enabled  |
| log_pending_checkpoint_writes            | recovery            | disabled |
| log_pending_log_flushes                  | recovery            | disabled |
| log_waits                                | recovery            | enabled  |
| log_writes                               | recovery            | enabled  |
| log_write_requests                       | recovery            | enabled  |
| metadata_table_handles_closed            | metadata            | disabled |
| metadata_table_handles_opened            | metadata            | disabled |
| metadata_table_reference_count           | metadata            | disabled |
| os_data_fsyncs                           | os                  | enabled  |
| os_data_reads                            | os                  | enabled  |
| os_data_writes                           | os                  | enabled  |
| os_log_bytes_written                     | os                  | enabled  |
| os_log_fsyncs                            | os                  | enabled  |
| os_log_pending_fsyncs                    | os                  | enabled  |
| os_log_pending_writes                    | os                  | enabled  |
| os_pending_reads                         | os                  | disabled |
| os_pending_writes                        | os                  | disabled |
| purge_del_mark_records                   | purge               | disabled |
| purge_dml_delay_usec                     | purge               | disabled |
| purge_invoked                            | purge               | disabled |
| purge_resume_count                       | purge               | disabled |
| purge_stop_count                         | purge               | disabled |
| purge_undo_log_pages                     | purge               | disabled |
| purge_upd_exist_or_extern_records        | purge               | disabled |
| trx_active_transactions                  | transaction         | disabled |
| trx_commits_insert_update                | transaction         | disabled |
| trx_nl_ro_commits                        | transaction         | disabled |
| trx_rollbacks                            | transaction         | disabled |
| trx_rollbacks_savepoint                  | transaction         | disabled |
| trx_rollback_active                      | transaction         | disabled |
| trx_ro_commits                           | transaction         | disabled |
| trx_rseg_current_size                    | transaction         | disabled |
| trx_rseg_history_len                     | transaction         | enabled  |
| trx_rw_commits                           | transaction         | disabled |
| trx_undo_slots_cached                    | transaction         | disabled |
| trx_undo_slots_used                      | transaction         | disabled |
+------------------------------------------+---------------------+----------+
235 rows in set (0.01 sec)
```

#### Módulos de Contador

Cada contador está associado a um módulo específico. Os nomes dos módulos podem ser usados para habilitar, desabilitar ou redefinir todos os contadores para um subsistema específico. Por exemplo, use `module_dml` para habilitar todos os contadores associados ao subsistema `dml`.

```sql
mysql> SET GLOBAL innodb_monitor_enable = module_dml;

mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE subsystem ='dml';
+-------------+-----------+---------+
| name        | subsystem | status  |
+-------------+-----------+---------+
| dml_reads   | dml       | enabled |
| dml_inserts | dml       | enabled |
| dml_deletes | dml       | enabled |
| dml_updates | dml       | enabled |
+-------------+-----------+---------+
```

Os nomes dos módulos podem ser usados com `innodb_monitor_enable` e variáveis relacionadas.

Os nomes dos módulos e os nomes correspondentes ao `SUBSYSTEM` estão listados abaixo.

* `module_adaptive_hash` (subsistema = `adaptive_hash_index`)

* `module_buffer` (subsistema = `buffer`)

* `module_buffer_page` (subsistema = `buffer_page_io`)

* `module_compress` (subsistema = `compression`)

* `module_ddl` (subsistema = `ddl`)

* `module_dml` (subsistema = `dml`)

* `module_file` (subsistema = `file_system`)

* `module_ibuf_system` (subsistema = `change_buffer`)

* `module_icp` (subsistema = `icp`)

* `module_index` (subsistema = `index`)

* `module_innodb` (subsistema = `innodb`)

* `module_lock` (subsistema = `lock`)

* `module_log` (subsistema = `recovery`)

* `module_metadata` (subsistema = `metadata`)

* `module_os` (subsistema = `os`)

* `module_purge` (subsistema = `purge`)

* `module_trx` (subsistema = `transaction`)

**Exemplo 14.11 Trabalhando com Contadores de Tabelas INNODB\_METRICS**

Este exemplo demonstra como habilitar, desabilitar e redefinir um contador, e consultar dados do contador na tabela `INNODB_METRICS`.

1. Crie uma tabela simples `InnoDB`:

   ```sql
   mysql> USE test;
   Database changed

   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   Query OK, 0 rows affected (0.02 sec)
   ```

2. Ative o contador `dml_inserts`.

   ```sql
   mysql> SET GLOBAL innodb_monitor_enable = dml_inserts;
   Query OK, 0 rows affected (0.01 sec)
   ```

Uma descrição do contador `dml_inserts` pode ser encontrada na coluna `COMMENT` da tabela `INNODB_METRICS`:

   ```sql
   mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts";
   +-------------+-------------------------+
   | NAME        | COMMENT                 |
   +-------------+-------------------------+
   | dml_inserts | Number of rows inserted |
   +-------------+-------------------------+
   ```

3. Consulte a tabela `INNODB_METRICS` para obter os dados do contador `dml_inserts`. Como não foram realizadas operações DML, os valores do contador são zero ou NULL. Os valores de `TIME_ENABLED` e `TIME_ELAPSED` indicam quando o contador foi habilitado pela última vez e quantos segundos se passaram desde então.

   ```sql
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: 0
         MIN_COUNT: NULL
         AVG_COUNT: 0
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 28
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

4. Insira três strings de dados na tabela.

   ```sql
   mysql> INSERT INTO t1 values(1);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(2);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(3);
   Query OK, 1 row affected (0.00 sec)
   ```

5. Reflita novamente na tabela `INNODB_METRICS` para obter os dados do contador `dml_inserts`. Vários valores do contador foram incrementados, incluindo `COUNT`, `MAX_COUNT`, `AVG_COUNT` e `COUNT_RESET`. Consulte a definição da tabela `INNODB_METRICS` para descrições desses valores.

   ```sql
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.046153846153846156
       COUNT_RESET: 3
   MAX_COUNT_RESET: 3
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 65
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

6. Redefinir o contador `dml_inserts` e consultar novamente a tabela `INNODB_METRICS` para obter os dados do contador `dml_inserts`. Os valores do `%_RESET` que foram relatados anteriormente, como `COUNT_RESET` e `MAX_RESET`, são redefinidos para zero. Os valores como `COUNT`, `MAX_COUNT` e `AVG_COUNT`, que coletam dados cumulativamente desde o momento em que o contador é habilitado, não são afetados pelo redefinimento.

   ```sql
   mysql> SET GLOBAL innodb_monitor_reset = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.03529411764705882
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 85
        TIME_RESET: 2014-12-04 14:19:44
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

7. Para redefinir todos os valores do contador, você deve primeiro desativar o contador. Desativar o contador define o valor `STATUS` para `disabled`.

   ```sql
   mysql> SET GLOBAL innodb_monitor_disable = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.030612244897959183
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: 2014-12-04 14:20:06
      TIME_ELAPSED: 98
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

Nota

A correspondência com comodinho é suportada para os nomes de contador e módulo. Por exemplo, em vez de especificar o nome completo do contador `dml_inserts`, você pode especificar `dml_i%`. Você também pode habilitar, desabilitar ou reiniciar vários contadores ou módulos de uma vez usando uma correspondência com comodinho. Por exemplo, especifique `dml_%` para habilitar, desabilitar ou reiniciar todos os contadores que começam com `dml_`.

8. Após o contador ser desativado, você pode redefinir todos os valores do contador usando a opção `innodb_monitor_reset_all`. Todos os valores são definidos como zero ou NULL.

   ```sql
   mysql> SET GLOBAL innodb_monitor_reset_all = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: NULL
         MIN_COUNT: NULL
         AVG_COUNT: NULL
       COUNT_RESET: 0
   MAX_COUNT_RESET: NULL
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: NULL
     TIME_DISABLED: NULL
      TIME_ELAPSED: NULL
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

### 14.16.7 Tabela de informações da InnoDB do esquema de informações Tabela de informações temporárias

`INNODB_TEMP_TABLE_INFO` fornece informações sobre tabelas temporárias criadas pelo usuário que estão ativas na instância `InnoDB`. Não fornece informações sobre tabelas temporárias internas `InnoDB` usadas pelo otimizador.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

Para a definição da tabela, consulte a Seção 24.4.27, “A tabela INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO”.

**Exemplo 14.12 INNODB\_TEMP\_TABLE\_INFO**

Este exemplo demonstra as características da tabela `INNODB_TEMP_TABLE_INFO`.

1. Crie uma tabela temporária simples `InnoDB`:

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Faça uma consulta a `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

O `TABLE_ID` é um identificador único para a tabela temporária. A coluna `NAME` exibe o nome gerado pelo sistema para a tabela temporária, que é precedido por “#sql”. O número de colunas (`N_COLS`) é de 4 em vez de 1 porque o `InnoDB` sempre cria três colunas ocultas da tabela (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). `PER_TABLE_TABLESPACE` e `IS_COMPRESSED` relatam `TRUE` para tabelas temporárias comprimidas. Caso contrário, esses campos relatam `FALSE`.

3. Crie uma tabela temporária compactada.

   ```sql
   mysql> CREATE TEMPORARY TABLE t2 (c1 INT) ROW_FORMAT=COMPRESSED ENGINE=INNODB;
   ```

4. Faça novamente a consulta `INNODB_TEMP_TABLE_INFO`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 195
                   NAME: #sql7a79_1_1
                 N_COLS: 4
                  SPACE: 183
   PER_TABLE_TABLESPACE: TRUE
          IS_COMPRESSED: TRUE
   *************************** 2. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

`PER_TABLE_TABLESPACE` e `IS_COMPRESSED` relatam `TRUE` para a tabela temporária comprimida. O ID `SPACE` para a tabela temporária comprimida é diferente porque as tabelas temporárias comprimidas são criadas em espaços de tabela separados por arquivo. As tabelas temporárias não comprimidas são criadas no espaço de tabelas temporárias compartilhado (`ibtmp1`) e relatam o mesmo ID `SPACE`.

5. Reinicie o MySQL e consulte `INNODB_TEMP_TABLE_INFO`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   Empty set (0.00 sec)
   ```

Um conjunto vazio é retornado porque `INNODB_TEMP_TABLE_INFO` e seus dados não são persistidos no disco quando o servidor é desligado.

6. Crie uma nova tabela temporária.

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

7. Faça uma consulta a `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

O ID `SPACE` pode ser diferente, pois é gerado dinamicamente quando o servidor é iniciado.

### 14.16.8 Recuperação de metadados do espaço de tabela InnoDB do esquema INFORMATION_SCHEMA.FILES

A tabela do esquema de informações `FILES` fornece metadados sobre todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, espaços de tabela temporários e espaços de tabela de reversão (se presentes).

Esta seção fornece exemplos de uso específicos para `InnoDB`. Para mais informações, consulte a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”.

Nota

As tabelas `INNODB_SYS_TABLESPACES` e `INNODB_SYS_DATAFILES` também fornecem metadados sobre os espaços de tabela `InnoDB`, mas os dados são limitados a arquivos por tabela e espaços de tabela gerais.

Essa consulta recupera metadados sobre o espaço de sistema `InnoDB` das colunas da tabela do esquema de informações `FILES` que são pertinentes aos espaços de tabelas `InnoDB`. As colunas `FILES` que não são relevantes para `InnoDB` sempre retornam `NULL` e são excluídas da consulta.

```sql
mysql> SELECT FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
       TOTAL_EXTENTS,  EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE, AUTOEXTEND_SIZE, DATA_FREE, STATUS ENGINE
       FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME LIKE 'innodb_system' \G
*************************** 1. row ***************************
        FILE_ID: 0
      FILE_NAME: ./ibdata1
      FILE_TYPE: TABLESPACE
TABLESPACE_NAME: innodb_system
   FREE_EXTENTS: 0
  TOTAL_EXTENTS: 12
    EXTENT_SIZE: 1048576
   INITIAL_SIZE: 12582912
   MAXIMUM_SIZE: NULL
AUTOEXTEND_SIZE: 67108864
      DATA_FREE: 4194304
         ENGINE: NORMAL
```

Essa consulta recupera o `FILE_ID` (equivalente à ID de espaço) e o `FILE_NAME` (que inclui informações de caminho) para os espaços de arquivo por tabela e espaços de tabela gerais `InnoDB`. Os espaços de arquivo por tabela e espaços de tabela gerais têm uma extensão de arquivo `.ibd`.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%.ibd%' ORDER BY FILE_ID;
    +---------+---------------------------------------+
    | FILE_ID | FILE_NAME                             |
    +---------+---------------------------------------+
    |       2 | ./mysql/plugin.ibd                    |
    |       3 | ./mysql/servers.ibd                   |
    |       4 | ./mysql/help_topic.ibd                |
    |       5 | ./mysql/help_category.ibd             |
    |       6 | ./mysql/help_relation.ibd             |
    |       7 | ./mysql/help_keyword.ibd              |
    |       8 | ./mysql/time_zone_name.ibd            |
    |       9 | ./mysql/time_zone.ibd                 |
    |      10 | ./mysql/time_zone_transition.ibd      |
    |      11 | ./mysql/time_zone_transition_type.ibd |
    |      12 | ./mysql/time_zone_leap_second.ibd     |
    |      13 | ./mysql/innodb_table_stats.ibd        |
    |      14 | ./mysql/innodb_index_stats.ibd        |
    |      15 | ./mysql/slave_relay_log_info.ibd      |
    |      16 | ./mysql/slave_master_info.ibd         |
    |      17 | ./mysql/slave_worker_info.ibd         |
    |      18 | ./mysql/gtid_executed.ibd             |
    |      19 | ./mysql/server_cost.ibd               |
    |      20 | ./mysql/engine_cost.ibd               |
    |      21 | ./sys/sys_config.ibd                  |
    |      23 | ./test/t1.ibd                         |
    |      26 | /home/user/test/test/t2.ibd           |
    +---------+---------------------------------------+
```

Essa consulta recupera os `FILE_ID` e `FILE_NAME` para os espaços de tabelas temporárias `InnoDB`. Os nomes dos arquivos de espaço de tabela temporário são prefixados por `ibtmp`.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%ibtmp%';
+---------+-----------+
| FILE_ID | FILE_NAME |
+---------+-----------+
|      22 | ./ibtmp1  |
+---------+-----------+
```

Da mesma forma, os nomes dos arquivos de espaço de undo de `InnoDB` são prefixados por `undo`. A seguinte consulta retorna os `FILE_ID` e `FILE_NAME` para os espaços de undo de `InnoDB`, se espaços de undo separados forem configurados.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%undo%';
```
