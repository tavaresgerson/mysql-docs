#### 25.12.15.7 Tabelas de Resumo de Temporização de Entrada/Saída e Bloqueio

As seções a seguir descrevem as tabelas de resumo de espera de I/O e bloqueio:

- `table_io_waits_summary_by_index_usage`: Tabela de espera de I/O por índice

- `table_io_waits_summary_by_table`: Esperas de I/O de tabela por tabela

- `table_lock_waits_summary_by_table`: Esperas de bloqueio de tabela por tabela

##### 25.12.15.7.1 A tabela table_io_waits_summary_by_table

A tabela `table_io_waits_summary_by_table` agrega todos os eventos de espera de I/O de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por tabela.

A tabela `table_io_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a linha se aplica.

`table_io_waits_summary_by_table` tem as seguintes colunas de resumo contendo valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são iguais à soma dos valores das colunas mais detalhadas. Por exemplo, as colunas que agregam todas as escritas retêm a soma das colunas correspondentes que agregam inserções, atualizações e exclusões. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somam colunas de nível mais baixo.

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações de E/S. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

- `CONTAR_LEITURA`, `SOMAR_TEMPO_LEITURA`, `MIN_TEMPO_LEITURA`, `AVG_TEMPO_LEITURA`, `MAX_TEMPO_LEITURA`

  Essas colunas agregam todas as operações de leitura. Elas são iguais à soma das colunas correspondentes `xxx_FETCH`.

- `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

  Essas colunas agregam todas as operações de escrita. Elas são iguais à soma das colunas correspondentes `xxx_INSERT`, `xxx_UPDATE` e `xxx_DELETE`.

- `COUNT_FETCH`, `SUM_TIMER_FETCH`, `MIN_TIMER_FETCH`, `AVG_TIMER_FETCH`, `MAX_TIMER_FETCH`

  Essas colunas agregam todas as operações de busca.

- `COUNT_INSERT`, `SUM_TIMER_INSERT`, `MIN_TIMER_INSERT`, `AVG_TIMER_INSERT`, `MAX_TIMER_INSERT`

  Essas colunas agregam todas as operações de inserção.

- `COUNT_UPDATE`, `SUM_TIMER_UPDATE`, `MIN_TIMER_UPDATE`, `AVG_TIMER_UPDATE`, `MAX_TIMER_UPDATE`

  Essas colunas agregam todas as operações de atualização.

- `COUNT_DELETE`, `SUM_TIMER_DELETE`, `MIN_TIMER_DELETE`, `AVG_TIMER_DELETE`, `MAX_TIMER_DELETE`

  Essas colunas agregam todas as operações de exclusão.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de E/S de tabela. Ela redefini o número das colunas de resumo para zero, em vez de remover linhas. O truncamento desta tabela também trunca a tabela `table_io_waits_summary_by_index_usage`.

##### 25.12.15.7.2 A tabela table_io_waits_summary_by_index_usage

A tabela `table_io_waits_summary_by_index_usage` agrega todos os eventos de espera de I/O de índice de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por índice de tabela.

As colunas de `table_io_waits_summary_by_index_usage` são quase idênticas às de `table_io_waits_summary_by_table`. A única diferença é a coluna de grupo adicional, `INDEX_NAME`, que corresponde ao nome do índice que foi usado quando o evento de espera de I/O da tabela foi registrado:

- Um valor de `PRIMARY` indica que o I/O da tabela utilizou o índice primário.

- Um valor de `NULL` significa que o I/O da tabela não usou nenhum índice.

- Os insertos são contados contra `INDEX_NAME = NULL`.

A operação `TRUNCATE TABLE` é permitida para tabelas de resumo de I/O. Ela redefine as colunas de resumo para zero, em vez de remover linhas. Esta tabela também é truncada pela truncagem da tabela `table_io_waits_summary_by_table`. Uma operação DDL que altera a estrutura de índice de uma tabela pode fazer com que as estatísticas por índice sejam redefinidas.

##### 25.12.15.7.3 A tabela table_lock_waits_summary_by_table

A tabela `table_lock_waits_summary_by_table` agrega todos os eventos de espera por bloqueio de tabela, conforme gerado pelo instrumento `wait/lock/table/sql/handler`. O agrupamento é por tabela.

Esta tabela contém informações sobre bloqueios internos e externos:

- Uma trava interna corresponde a uma trava na camada SQL. Isso é atualmente implementado por uma chamada para `thr_lock()`. Nas linhas de evento, essas travadas são distinguidas pela coluna `OPERATION`, que tem um desses valores:

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

- Uma trava externa corresponde a uma trava na camada do motor de armazenamento. Isso é atualmente implementado por uma chamada para `handler::external_lock()`. Nas linhas de evento, essas travadas são distinguidas pela coluna `OPERATION`, que tem um desses valores:

  ```sql
  read external
  write external
  ```

A tabela `table_lock_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a linha se aplica.

`table_lock_waits_summary_by_table` tem as seguintes colunas de resumo contendo valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são iguais à soma dos valores das colunas mais detalhadas. Por exemplo, as colunas que agregam todos os bloqueios têm a soma das colunas correspondentes que agregam bloqueios de leitura e escrita. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somam colunas de nível mais baixo.

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações de bloqueio. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

- `CONTAR_LEITURA`, `SOMAR_TEMPO_LEITURA`, `MIN_TEMPO_LEITURA`, `AVG_TEMPO_LEITURA`, `MAX_TEMPO_LEITURA`

  Essas colunas agregam todas as operações de bloqueio de leitura. Elas são iguais à soma das colunas correspondentes `xxx_READ_NORMAL`, `xxx_READ_WITH_SHARED_LOCKS`, `xxx_READ_HIGH_PRIORITY` e `xxx_READ_NO_INSERT`.

- `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

  Essas colunas agregam todas as operações de bloqueio de escrita. Elas são iguais à soma das colunas correspondentes `xxx_WRITE_ALLOW_WRITE`, `xxx_WRITE_CONCURRENT_INSERT`, `xxx_WRITE_LOW_PRIORITY` e `xxx_WRITE_NORMAL`.

- `CONTAR_LEITURA_NORMAL`, `SOMAR_TEMPO_LEITURA_NORMAL`, `MIN_TEMPO_LEITURA_NORMAL`, `AVG_TEMPO_LEITURA_NORMAL`, `MAX_TEMPO_LEITURA_NORMAL`

  Essas colunas agregam bloqueios de leitura internos.

- `CONTAR_LEITURA_COM_LÂMINAS_PARALELAS`, `SOMAR_TEMPO_LEITURA_COM_LÂMINAS_PARALELAS`, `MIN_TEMPO_LEITURA_COM_LÂMINAS_PARALELAS`, `AVG_TEMPO_LEITURA_COM_LÂMINAS_PARALELAS`, `MAX_TEMPO_LEITURA_COM_LÂMINAS_PARALELAS`

  Essas colunas agregam bloqueios de leitura internos.

- `CONTAR_LEITURA_ALTA_PRIORIDADE`, `SOMAR_TEMPORELA_LEITURA_ALTA_PRIORIDADE`, `MIN_TEMPORELA_LEITURA_ALTA_PRIORIDADE`, `AVG_TEMPORELA_LEITURA_ALTA_PRIORIDADE`, `MAX_TEMPORELA_LEITURA_ALTA_PRIORIDADE`

  Essas colunas agregam bloqueios de leitura internos.

- `COUNT_READ_NO_INSERT`, `SUM_TIMER_READ_NO_INSERT`, `MIN_TIMER_READ_NO_INSERT`, `AVG_TIMER_READ_NO_INSERT`, `MAX_TIMER_READ_NO_INSERT`

  Essas colunas agregam bloqueios de leitura internos.

- `COUNT_READ_EXTERNAL`, `SUM_TIMER_READ_EXTERNAL`, `MIN_TIMER_READ_EXTERNAL`, `AVG_TIMER_READ_EXTERNAL`, `MAX_TIMER_READ_EXTERNAL`

  Essas colunas agregam bloqueios de leitura externos.

- `COUNT_WRITE_ALLOW_WRITE`, `SUM_TIMER_WRITE_ALLOW_WRITE`, `MIN_TIMER_WRITE_ALLOW_WRITE`, `AVG_TIMER_WRITE_ALLOW_WRITE`, `MAX_TIMER_WRITE_ALLOW_WRITE`

  Essas colunas agregam bloqueios de escrita internos.

- `COUNT_WRITE_CONCURRENT_INSERT`, `SUM_TIMER_WRITE_CONCURRENT_INSERT`, `MIN_TIMER_WRITE_CONCURRENT_INSERT`, `AVG_TIMER_WRITE_CONCURRENT_INSERT`, `MAX_TIMER_WRITE_CONCURRENT_INSERT`

  Essas colunas agregam bloqueios de escrita internos.

- `COUNT_WRITE_LOW_PRIORITY`, `SUM_TIMER_WRITE_LOW_PRIORITY`, `MIN_TIMER_WRITE_LOW_PRIORITY`, `AVG_TIMER_WRITE_LOW_PRIORITY`, `MAX_TIMER_WRITE_LOW_PRIORITY`

  Essas colunas agregam bloqueios de escrita internos.

- `COUNT_WRITE_NORMAL`, `SUM_TIMER_WRITE_NORMAL`, `MIN_TIMER_WRITE_NORMAL`, `AVG_TIMER_WRITE_NORMAL`, `MAX_TIMER_WRITE_NORMAL`

  Essas colunas agregam bloqueios de escrita internos.

- `COUNT_WRITE_EXTERNAL`, `SUM_TIMER_WRITE_EXTERNAL`, `MIN_TIMER_WRITE_EXTERNAL`, `AVG_TIMER_WRITE_EXTERNAL`, `MAX_TIMER_WRITE_EXTERNAL`

  Essas colunas agregam bloqueios de escrita externos.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de bloqueio de tabela. Ela redefini o valor das colunas de resumo para zero, em vez de remover linhas.
