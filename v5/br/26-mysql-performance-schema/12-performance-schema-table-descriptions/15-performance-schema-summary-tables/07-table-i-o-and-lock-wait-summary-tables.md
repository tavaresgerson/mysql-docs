#### 25.12.15.7 Tabelas de Resumo de I/O de Tabela e Wait de Lock

As seções a seguir descrevem as tabelas de resumo de I/O de tabela e wait de Lock:

* [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table"): Waits de I/O de Tabela por Index

* [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table"): Waits de I/O de Tabela por tabela

* [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table"): Waits de Lock de Tabela por tabela

##### 25.12.15.7.1 A Tabela table_io_waits_summary_by_table

A tabela [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table") agrega todos os eventos de wait de I/O de tabela, conforme gerado pelo instrument `wait/io/table/sql/handler`. O agrupamento é por tabela.

A tabela [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table") possui estas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Estas colunas têm o mesmo significado que na tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). Elas identificam a tabela à qual a linha se aplica.

A tabela [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table") possui as seguintes colunas de resumo contendo valores agregados. Conforme indicado nas descrições das colunas, algumas colunas são mais gerais e contêm valores que são iguais à soma dos valores de colunas mais detalhadas (*fine-grained*). Por exemplo, colunas que agregam todas as operações de write contêm a soma das colunas correspondentes que agregam *inserts*, *updates* e *deletes*. Desta forma, agregações em níveis mais altos estão disponíveis diretamente sem a necessidade de *views* definidas pelo usuário que somam colunas de nível inferior.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Estas colunas agregam todas as operações de I/O. São iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

  Estas colunas agregam todas as operações de leitura (*read*). São iguais à soma das colunas correspondentes `xxx_FETCH`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

  Estas colunas agregam todas as operações de escrita (*write*). São iguais à soma das colunas correspondentes `xxx_INSERT`, `xxx_UPDATE` e `xxx_DELETE`.

* `COUNT_FETCH`, `SUM_TIMER_FETCH`, `MIN_TIMER_FETCH`, `AVG_TIMER_FETCH`, `MAX_TIMER_FETCH`

  Estas colunas agregam todas as operações de *fetch*.

* `COUNT_INSERT`, `SUM_TIMER_INSERT`, `MIN_TIMER_INSERT`, `AVG_TIMER_INSERT`, `MAX_TIMER_INSERT`

  Estas colunas agregam todas as operações de *insert*.

* `COUNT_UPDATE`, `SUM_TIMER_UPDATE`, `MIN_TIMER_UPDATE`, `AVG_TIMER_UPDATE`, `MAX_TIMER_UPDATE`

  Estas colunas agregam todas as operações de *update*.

* `COUNT_DELETE`, `SUM_TIMER_DELETE`, `MIN_TIMER_DELETE`, `AVG_TIMER_DELETE`, `MAX_TIMER_DELETE`

  Estas colunas agregam todas as operações de *delete*.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de I/O de tabela. Ele redefine as colunas de resumo para zero, em vez de remover as linhas. Truncar esta tabela também trunca a tabela [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table").

##### 25.12.15.7.2 A Tabela table_io_waits_summary_by_index_usage

A tabela [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table") agrega todos os eventos de wait de I/O de Index de tabela, conforme gerado pelo instrument `wait/io/table/sql/handler`. O agrupamento é por Index de tabela.

As colunas de [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table") são quase idênticas às de [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table"). A única diferença é a coluna de grupo adicional, `INDEX_NAME`, que corresponde ao nome do Index que foi usado quando o evento de wait de I/O de tabela foi registrado:

* Um valor de `PRIMARY` indica que o I/O de tabela usou o Index primário (*Primary Index*).

* Um valor de `NULL` significa que o I/O de tabela não usou Index.

* Operações de *Insert* são contabilizadas em `INDEX_NAME = NULL`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de I/O de tabela. Ele redefine as colunas de resumo para zero, em vez de remover as linhas. Esta tabela também é truncada pelo *truncate* da tabela [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table"). Uma operação DDL que altera a estrutura do Index de uma tabela pode fazer com que as estatísticas por Index sejam zeradas (*reset*).

##### 25.12.15.7.3 A Tabela table_lock_waits_summary_by_table

A tabela [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table") agrega todos os eventos de wait de Lock de tabela, conforme gerado pelo instrument `wait/lock/table/sql/handler`. O agrupamento é por tabela.

Esta tabela contém informações sobre Locks internos e externos:

* Um Lock interno corresponde a um Lock na camada SQL. Atualmente, isso é implementado por uma chamada a `thr_lock()`. Nas linhas de evento, estes Locks são distinguidos pela coluna `OPERATION`, que tem um destes valores:

  ```sql
  read normal
  read with shared locks
  read high priority
  read no insert
  write allow write
  write concurrent insert
  write delayed
  write low priority
  write normal
  ```

* Um Lock externo corresponde a um Lock na camada do *storage engine*. Atualmente, isso é implementado por uma chamada a `handler::external_lock()`. Nas linhas de evento, estes Locks são distinguidos pela coluna `OPERATION`, que tem um destes valores:

  ```sql
  read external
  write external
  ```

A tabela [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table") possui estas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Estas colunas têm o mesmo significado que na tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). Elas identificam a tabela à qual a linha se aplica.

A tabela [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table") possui as seguintes colunas de resumo contendo valores agregados. Conforme indicado nas descrições das colunas, algumas colunas são mais gerais e contêm valores que são iguais à soma dos valores de colunas mais detalhadas. Por exemplo, colunas que agregam todos os Locks contêm a soma das colunas correspondentes que agregam Locks de leitura (*read*) e escrita (*write*). Desta forma, agregações em níveis mais altos estão disponíveis diretamente sem a necessidade de *views* definidas pelo usuário que somam colunas de nível inferior.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Estas colunas agregam todas as operações de Lock. São iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

  Estas colunas agregam todas as operações de Lock de leitura (*read-Lock*). São iguais à soma das colunas correspondentes `xxx_READ_NORMAL`, `xxx_READ_WITH_SHARED_LOCKS`, `xxx_READ_HIGH_PRIORITY` e `xxx_READ_NO_INSERT`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

  Estas colunas agregam todas as operações de Lock de escrita (*write-Lock*). São iguais à soma das colunas correspondentes `xxx_WRITE_ALLOW_WRITE`, `xxx_WRITE_CONCURRENT_INSERT`, `xxx_WRITE_LOW_PRIORITY` e `xxx_WRITE_NORMAL`.

* `COUNT_READ_NORMAL`, `SUM_TIMER_READ_NORMAL`, `MIN_TIMER_READ_NORMAL`, `AVG_TIMER_READ_NORMAL`, `MAX_TIMER_READ_NORMAL`

  Estas colunas agregam Locks internos de leitura (*read*).

* `COUNT_READ_WITH_SHARED_LOCKS`, `SUM_TIMER_READ_WITH_SHARED_LOCKS`, `MIN_TIMER_READ_WITH_SHARED_LOCKS`, `AVG_TIMER_READ_WITH_SHARED_LOCKS`, `MAX_TIMER_READ_WITH_SHARED_LOCKS`

  Estas colunas agregam Locks internos de leitura.

* `COUNT_READ_HIGH_PRIORITY`, `SUM_TIMER_READ_HIGH_PRIORITY`, `MIN_TIMER_READ_HIGH_PRIORITY`, `AVG_TIMER_READ_HIGH_PRIORITY`, `MAX_TIMER_READ_HIGH_PRIORITY`

  Estas colunas agregam Locks internos de leitura.

* `COUNT_READ_NO_INSERT`, `SUM_TIMER_READ_NO_INSERT`, `MIN_TIMER_READ_NO_INSERT`, `AVG_TIMER_READ_NO_INSERT`, `MAX_TIMER_READ_NO_INSERT`

  Estas colunas agregam Locks internos de leitura.

* `COUNT_READ_EXTERNAL`, `SUM_TIMER_READ_EXTERNAL`, `MIN_TIMER_READ_EXTERNAL`, `AVG_TIMER_READ_EXTERNAL`, `MAX_TIMER_READ_EXTERNAL`

  Estas colunas agregam Locks externos de leitura.

* `COUNT_WRITE_ALLOW_WRITE`, `SUM_TIMER_WRITE_ALLOW_WRITE`, `MIN_TIMER_WRITE_ALLOW_WRITE`, `AVG_TIMER_WRITE_ALLOW_WRITE`, `MAX_TIMER_WRITE_ALLOW_WRITE`

  Estas colunas agregam Locks internos de escrita (*write*).

* `COUNT_WRITE_CONCURRENT_INSERT`, `SUM_TIMER_WRITE_CONCURRENT_INSERT`, `MIN_TIMER_WRITE_CONCURRENT_INSERT`, `AVG_TIMER_WRITE_CONCURRENT_INSERT`, `MAX_TIMER_WRITE_CONCURRENT_INSERT`

  Estas colunas agregam Locks internos de escrita.

* `COUNT_WRITE_LOW_PRIORITY`, `SUM_TIMER_WRITE_LOW_PRIORITY`, `MIN_TIMER_WRITE_LOW_PRIORITY`, `AVG_TIMER_WRITE_LOW_PRIORITY`, `MAX_TIMER_WRITE_LOW_PRIORITY`

  Estas colunas agregam Locks internos de escrita.

* `COUNT_WRITE_NORMAL`, `SUM_TIMER_WRITE_NORMAL`, `MIN_TIMER_WRITE_NORMAL`, `AVG_TIMER_WRITE_NORMAL`, `MAX_TIMER_WRITE_NORMAL`

  Estas colunas agregam Locks internos de escrita.

* `COUNT_WRITE_EXTERNAL`, `SUM_TIMER_WRITE_EXTERNAL`, `MIN_TIMER_WRITE_EXTERNAL`, `AVG_TIMER_WRITE_EXTERNAL`, `MAX_TIMER_WRITE_EXTERNAL`

  Estas colunas agregam Locks externos de escrita.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de Lock de tabela. Ele redefine as colunas de resumo para zero, em vez de remover as linhas.