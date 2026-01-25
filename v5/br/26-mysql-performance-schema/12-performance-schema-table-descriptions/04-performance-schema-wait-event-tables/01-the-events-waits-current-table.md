#### 25.12.4.1 A Tabela events_waits_current

A tabela `events_waits_current` contém eventos de espera (wait events) atuais. A tabela armazena uma linha por Thread, mostrando o status atual do evento de espera monitorado mais recente daquele Thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela.

Dentre as tabelas que contêm linhas de eventos de espera, a `events_waits_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de espera são logicamente derivadas dos eventos atuais. Por exemplo, as tabelas `events_waits_history` e `events_waits_history_long` são coleções dos eventos de espera mais recentes que terminaram, até um número máximo de linhas por Thread e globalmente em todos os Threads, respectivamente.

Para mais informações sobre o relacionamento entre as três tabelas de eventos de espera, veja [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de eventos de espera, veja [Seção 25.12.4, “Tabelas de Eventos de Espera do Performance Schema”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables").

A tabela `events_waits_current` possui estas colunas:

* `THREAD_ID`, `EVENT_ID`

  O Thread associado ao evento e o número atual do evento do Thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID`, quando combinados, identificam a linha de forma única. Nenhuma linha possui o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o evento começa e é atualizada para o número atual do evento do Thread quando o evento termina.

* `EVENT_NAME`

  O nome do instrument que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Nomes de instruments podem ter múltiplas partes e formar uma hierarquia, conforme discutido em [Seção 25.6, “Convenções de Nomenclatura de Instruments do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `SOURCE`

  O nome do arquivo fonte (source file) contendo o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique o código fonte para determinar exatamente qual código está envolvido. Por exemplo, se um mutex ou Lock estiver sendo bloqueado, você pode verificar o contexto em que isso ocorre.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização (Timing) para o evento. A unidade para esses valores é picosegundos (trilionésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando a temporização do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento não tiver terminado, `TIMER_END` é o valor atual do timer e `TIMER_WAIT` é o tempo decorrido até o momento (`TIMER_END` − `TIMER_START`).

  Se um evento for produzido a partir de um instrument que possui `TIMED = NO`, as informações de timing não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como a unidade para tempos de evento e fatores que afetam os valores de tempo, veja [Seção 25.4.1, “Temporização de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `SPINS`

  Para um Mutex, o número de rodadas de spin. Se o valor for `NULL`, o código não usa rodadas de spin ou o spinning não está instrumentado.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`, `OBJECT_INSTANCE_BEGIN`

  Estas colunas identificam o objeto "sobre o qual a ação está sendo executada". O significado disso depende do tipo de objeto.

  Para um objeto de sincronização (`cond`, `mutex`, `rwlock`):

  + `OBJECT_SCHEMA`, `OBJECT_NAME` e `OBJECT_TYPE` são `NULL`.

  + `OBJECT_INSTANCE_BEGIN` é o endereço do objeto de sincronização na memória.

  Para um objeto de I/O de arquivo:

  + `OBJECT_SCHEMA` é `NULL`.

  + `OBJECT_NAME` é o nome do arquivo (file name).
  + `OBJECT_TYPE` é `FILE`.

  + `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Para um objeto socket:

  + `OBJECT_NAME` é o valor `IP:PORT` para o socket.

  + `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Para um objeto de I/O de tabela:

  + `OBJECT_SCHEMA` é o nome do Schema que contém a Table.

  + `OBJECT_NAME` é o nome da Table (table name).
  + `OBJECT_TYPE` é `TABLE` para uma base table persistente ou `TEMPORARY TABLE` para uma temporary table.

  + `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Um valor `OBJECT_INSTANCE_BEGIN` em si não tem significado, exceto que valores diferentes indicam objetos diferentes. `OBJECT_INSTANCE_BEGIN` pode ser usado para debugging. Por exemplo, ele pode ser usado com `GROUP BY OBJECT_INSTANCE_BEGIN` para ver se a carga em 1.000 Mutexes (que protegem, digamos, 1.000 pages ou blocos de dados) está distribuída uniformemente ou se está atingindo apenas alguns gargalos (bottlenecks). Isso pode ajudar você a correlacionar informações com outras fontes se você vir o mesmo endereço de objeto em um arquivo de log ou em outra ferramenta de debugging ou performance.

* `INDEX_NAME`

  O nome do Index utilizado. `PRIMARY` indica o Primary Index da Table. `NULL` significa que nenhum Index foi utilizado.

* `NESTING_EVENT_ID`

  O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

  O tipo de evento de aninhamento. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

* `OPERATION`

  O tipo de operação realizada, como `lock`, `read` ou `write`.

* `NUMBER_OF_BYTES`

  O número de bytes lidos ou escritos pela operação. Para esperas de I/O de tabela (eventos para o instrument `wait/io/table/sql/handler`), `NUMBER_OF_BYTES` indica o número de linhas. Se o valor for maior que 1, o evento é para uma operação de I/O em lote (batch I/O). A discussão a seguir descreve a diferença entre o relatório exclusivo de linha única (single-row reporting) e o relatório que reflete o batch I/O.

  O MySQL executa Joins usando uma implementação de nested-loop. A função da instrumentação do Performance Schema é fornecer a contagem de linhas e o tempo de execução acumulado por Table no Join. Assuma uma Query de Join no seguinte formato, que é executada usando uma ordem de Join de Table de `t1`, `t2`, `t3`:

```sql
  SELECT ... FROM t1 JOIN t2 ON ... JOIN t3 ON ...
  ```

  O "fanout" (expansão) da Table é o aumento ou diminuição no número de linhas ao adicionar uma Table durante o processamento do Join. Se o fanout para a Table `t3` for maior que 1, a maioria das operações de busca de linha (row-fetch) é para essa Table. Suponha que o Join acesse 10 linhas de `t1`, 20 linhas de `t2` por linha de `t1`, e 30 linhas de `t3` por linha da Table `t2`. Com o single-row reporting, o número total de operações instrumentadas é:

```sql
  10 + (10 * 20) + (10 * 20 * 30) = 6210
  ```

  Uma redução significativa no número de operações instrumentadas é alcançável ao agregá-las por scan (ou seja, por combinação única de linhas de `t1` e `t2`). Com o batch I/O reporting, o Performance Schema produz um evento para cada scan da Table mais interna `t3`, em vez de para cada linha, e o número de operações de linha instrumentadas é reduzido para:

```sql
  10 + (10 * 20) + (10 * 20) = 410
  ```

  Essa é uma redução de 93%, ilustrando como a estratégia de batch-reporting reduz significativamente a sobrecarga do Performance Schema para I/O de Table, diminuindo o número de chamadas de relatório. A desvantagem é a menor precisão na temporização de eventos (event timing). Em vez de o tempo para uma operação de linha individual, como no per-row reporting, a temporização para batch I/O inclui o tempo gasto em operações como join buffering, agregação e retorno de linhas ao cliente.

  Para que o batch I/O reporting ocorra, as seguintes condições devem ser verdadeiras:

  + A execução da Query acessa a Table mais interna de um bloco de Query (para uma Query de Table única, essa Table é contada como a mais interna)

  + A execução da Query não solicita uma única linha da Table (portanto, por exemplo, o acesso `eq_ref` impede o uso de batch reporting)

  + A execução da Query não avalia uma subquery contendo acesso à Table para a Table em questão

* `FLAGS`

  Reservado para uso futuro.

O comando `TRUNCATE TABLE` é permitido para a tabela `events_waits_current`. Ele remove as linhas.