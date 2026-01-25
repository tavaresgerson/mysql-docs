## 25.6 Convenções de Nomenclatura de Instrumentos do Performance Schema

Um nome de Instrument é composto por uma sequência de elementos separados pelo caractere `'/'`. Exemplos de nomes:

```sql
wait/io/file/myisam/log
wait/io/file/mysys/charset
wait/lock/table/sql/handler
wait/synch/cond/mysys/COND_alarm
wait/synch/cond/sql/BINLOG::update_cond
wait/synch/mutex/mysys/BITMAP_mutex
wait/synch/mutex/sql/LOCK_delete
wait/synch/rwlock/sql/Query_cache_query::lock
stage/sql/closing tables
stage/sql/Sorting result
statement/com/Execute
statement/com/Query
statement/sql/create_table
statement/sql/lock_tables
```

O namespace de Instrumentos tem uma estrutura em árvore. Os elementos de um nome de Instrument, da esquerda para a direita, fornecem uma progressão do mais geral para o mais específico. O número de elementos que um nome possui depende do tipo de Instrument.

A interpretação de um determinado elemento em um nome depende dos elementos à sua esquerda. Por exemplo, `myisam` aparece em ambos os nomes a seguir, mas `myisam` no primeiro nome está relacionado a I/O de arquivo, enquanto no segundo está relacionado a um Instrument de sincronização:

```sql
wait/io/file/myisam/log
wait/synch/cond/myisam/MI_SORT_INFO::cond
```

Os nomes dos Instrumentos consistem em um prefixo com uma estrutura definida pela implementação do Performance Schema e um sufixo definido pelo desenvolvedor que implementa o código do Instrument. O elemento de nível superior de um prefixo de Instrument indica o tipo de Instrument. Este elemento também determina qual `event timer` na tabela `setup_timers` se aplica ao Instrument. Para a parte do prefixo dos nomes dos Instrumentos, o nível superior indica o tipo de Instrument.

A parte do sufixo dos nomes dos Instrumentos vem do código dos próprios Instrumentos. Os sufixos podem incluir níveis como estes:

* Um nome para o elemento principal (um módulo do servidor, como `myisam`, `innodb`, `mysys` ou `sql`) ou um nome de plugin.

* O nome de uma variável no código, no formato *`XXX`* (uma variável global) ou `CCC::MMM` (um membro *`MMM`* na classe *`CCC`*). Exemplos: `COND_thread_cache`, `THR_LOCK_myisam`, `BINLOG::LOCK_index`.

* [Elementos de Instrumento de Nível Superior](performance-schema-instrument-naming.html#performance-schema-top-level-instrument-elements "Elementos de Instrumento de Nível Superior")
* [Elementos do Instrumento Idle](performance-schema-instrument-naming.html#performance-schema-idle-instrument-elements "Elementos do Instrumento Idle")
* [Elementos do Instrumento Memory](performance-schema-instrument-naming.html#performance-schema-memory-instrument-elements "Elementos do Instrumento Memory")
* [Elementos do Instrumento Stage](performance-schema-instrument-naming.html#performance-schema-stage-instrument-elements "Elementos do Instrumento Stage")
* [Elementos do Instrumento Statement](performance-schema-instrument-naming.html#performance-schema-statement-instrument-elements "Elementos do Instrumento Statement")
* [Elementos do Instrumento Wait](performance-schema-instrument-naming.html#performance-schema-wait-instrument-elements "Elementos do Instrumento Wait")

### Elementos de Instrumento de Nível Superior

* `idle`: Um `idle event` instrumentado. Este Instrument não possui outros elementos.

* `memory`: Um `memory event` instrumentado.
* `stage`: Um `stage event` instrumentado.
* `statement`: Um `statement event` instrumentado.

* `transaction`: Um `transaction event` instrumentado. Este Instrument não possui outros elementos.

* `wait`: Um `wait event` instrumentado.

### Elementos do Instrumento Idle

O Instrument `idle` é usado para `idle events`, que o Performance Schema gera conforme discutido na descrição da coluna `socket_instances.STATE` na [Seção 25.12.3.5, “A Tabela socket_instances”](performance-schema-socket-instances-table.html "25.12.3.5 A Tabela socket_instances").

### Elementos do Instrumento Memory

A maior parte da instrumentação de memória está desativada por padrão e pode ser ativada ou desativada na inicialização, ou dinamicamente em tempo de execução, atualizando a coluna `ENABLED` dos Instruments relevantes na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments"). Os Instruments de memória têm nomes no formato `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`instrument_name`* é o detalhe do Instrument.

Instruments nomeados com o prefixo `memory/performance_schema/` expõem quanta memória é alocada para buffers internos no Performance Schema. Os Instruments `memory/performance_schema/` são integrados (`built-in`), estão sempre ativados e não podem ser desativados na inicialização ou em tempo de execução. Instruments de memória integrados são exibidos apenas na tabela [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória"). Para mais informações, consulte a [Seção 25.17, “O Modelo de Alocação de Memória do Performance Schema”](performance-schema-memory-model.html "25.17 O Modelo de Alocação de Memória do Performance Schema").

### Elementos do Instrumento Stage

Os Stage Instruments têm nomes no formato `stage/code_area/stage_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`stage_name`* indica o estágio do processamento de Statement, como `Sorting result` ou `Sending data`. Stages correspondem aos estados de Thread exibidos por [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") ou que são visíveis na tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 A Tabela PROCESSLIST do INFORMATION_SCHEMA").

### Elementos do Instrumento Statement

* `statement/abstract/*`: Um Instrument abstrato para operações de Statement. Instruments abstratos são usados durante os estágios iniciais da classificação de Statement, antes que o tipo exato de Statement seja conhecido, sendo então alterados para um Statement Instrument mais específico quando o tipo é determinado. Para uma descrição deste processo, consulte a [Seção 25.12.6, “Tabelas de Statement Event do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Tabelas de Statement Event do Performance Schema").

* `statement/com`: Uma operação de comando instrumentada. Estes possuem nomes correspondentes às operações `COM_xxx` (consulte o arquivo header `mysql_com.h` e `sql/sql_parse.cc`). Por exemplo, os Instruments `statement/com/Connect` e `statement/com/Init DB` correspondem aos comandos `COM_CONNECT` e `COM_INIT_DB`.

* `statement/scheduler/event`: Um único Instrument para rastrear todos os `events` executados pelo Event Scheduler. Este Instrument entra em ação quando um `event` agendado começa a ser executado.

* `statement/sp`: Uma instrução interna instrumentada executada por um stored program. Por exemplo, os Instruments `statement/sp/cfetch` e `statement/sp/freturn` são usados para instruções de `cursor fetch` e `function return`.

* `statement/sql`: Uma operação de SQL Statement instrumentada. Por exemplo, os Instruments `statement/sql/create_db` e `statement/sql/select` são usados para Statements [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") e [`SELECT`](select.html "13.2.9 SELECT Statement").

### Elementos do Instrumento Wait

* `wait/io`

  Uma operação de I/O instrumentada.

  + `wait/io/file`

    Uma operação de I/O de arquivo instrumentada. Para arquivos, o `wait` é o tempo de espera para que a operação de arquivo seja concluída (por exemplo, uma chamada para `fwrite()`). Devido ao caching, o I/O físico do arquivo no disco pode não ocorrer dentro desta chamada.

  + `wait/io/socket`

    Uma operação de socket instrumentada. Os Socket Instruments têm nomes no formato `wait/io/socket/sql/socket_type`. O servidor possui um `listening socket` para cada protocolo de rede que ele suporta. Os Instruments associados a `listening sockets` para conexões TCP/IP ou arquivos de socket Unix têm um valor *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente. Quando um `listening socket` detecta uma conexão, o servidor transfere a conexão para um novo socket gerenciado por um Thread separado. O Instrument para o novo Thread de conexão tem um valor *`socket_type`* de `client_connection`.

  + `wait/io/table`

    Uma operação de I/O de tabela instrumentada. Estas incluem acessos em nível de linha a tabelas base persistentes ou tabelas temporárias. As operações que afetam linhas são `fetch`, `insert`, `update` e `delete`. Para uma `view`, os `waits` estão associados às tabelas base referenciadas pela `view`.

    Diferente da maioria dos `waits`, um `wait` de I/O de tabela pode incluir outros `waits`. Por exemplo, o I/O de tabela pode incluir I/O de arquivo ou operações de memória. Assim, [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current") para um `wait` de I/O de tabela geralmente possui duas linhas. Para mais informações, consulte a [Seção 25.8, “Eventos Atom e Molecule do Performance Schema”](performance-schema-atom-molecule-events.html "25.8 Eventos Atom e Molecule do Performance Schema").

    Algumas operações de linha podem causar múltiplos `waits` de I/O de tabela. Por exemplo, um `insert` pode ativar um `trigger` que causa um `update`.

* `wait/lock`

  Uma operação de Lock instrumentada.

  + `wait/lock/table`

    Uma operação de Table Lock instrumentada.

  + `wait/lock/metadata/sql/mdl`

    Uma operação de Metadata Lock instrumentada.

* `wait/synch`

  Um objeto de sincronização instrumentado. Para objetos de sincronização, o tempo `TIMER_WAIT` inclui o tempo bloqueado enquanto tentava adquirir um Lock no objeto, se houver.

  + `wait/synch/cond`

    Uma condition é usada por um Thread para sinalizar a outros Threads que algo pelo qual estavam esperando aconteceu. Se um único Thread estava esperando por uma condition, ele pode acordar e prosseguir com sua execução. Se vários Threads estavam esperando, todos podem acordar e competir pelo recurso pelo qual estavam esperando.

  + `wait/synch/mutex`

    Um objeto de `mutual exclusion` (Mutex) usado para permitir o acesso a um recurso (como uma seção de código executável), impedindo que outros Threads acessem o recurso.

  + `wait/synch/rwlock`

    Um objeto [read/write lock (rwlock)](glossary.html#glos_rw_lock "rw-lock") usado para bloquear uma variável específica para acesso, impedindo seu uso por outros Threads. Um `shared read lock` pode ser adquirido simultaneamente por múltiplos Threads. Um `exclusive write lock` pode ser adquirido por apenas um Thread por vez.

  + `wait/synch/sxlock`

    Um `shared-exclusive (SX) lock` é um tipo de objeto [rwlock](glossary.html#glos_rw_lock "rw-lock") que fornece acesso de escrita a um recurso comum, ao mesmo tempo que permite leituras inconsistentes por outros Threads. Os `sxlocks` otimizam a concorrência e melhoram a escalabilidade para cargas de trabalho de leitura e escrita.
