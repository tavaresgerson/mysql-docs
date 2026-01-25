#### 25.12.15.6 Tabelas de Resumo de I/O de Arquivo

O Performance Schema mantém tabelas de resumo de I/O de arquivo que agregam informações sobre operações de I/O.

Exemplo de informações de resumo de eventos de I/O de arquivo:

```sql
mysql> SELECT * FROM performance_schema.file_summary_by_event_name\G
...
*************************** 2. row ***************************
               EVENT_NAME: wait/io/file/sql/binlog
               COUNT_STAR: 31
           SUM_TIMER_WAIT: 8243784888
           MIN_TIMER_WAIT: 0
           AVG_TIMER_WAIT: 265928484
           MAX_TIMER_WAIT: 6490658832
...
mysql> SELECT * FROM performance_schema.file_summary_by_instance\G
...
*************************** 2. row ***************************
                FILE_NAME: /var/mysql/share/english/errmsg.sys
               EVENT_NAME: wait/io/file/sql/ERRMSG
               EVENT_NAME: wait/io/file/sql/ERRMSG
    OBJECT_INSTANCE_BEGIN: 4686193384
               COUNT_STAR: 5
           SUM_TIMER_WAIT: 13990154448
           MIN_TIMER_WAIT: 26349624
           AVG_TIMER_WAIT: 2798030607
           MAX_TIMER_WAIT: 8150662536
...
```

Cada tabela de resumo de I/O de arquivo possui uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se a nomes de instrumentos de eventos na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"):

* [`file_summary_by_event_name`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables") possui uma coluna `EVENT_NAME`. Cada linha resume eventos para um dado nome de evento.

* [`file_summary_by_instance`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables") possui as colunas `FILE_NAME`, `EVENT_NAME`, e `OBJECT_INSTANCE_BEGIN`. Cada linha resume eventos para um dado arquivo e nome de evento.

Cada tabela de resumo de I/O de arquivo possui as seguintes colunas de resumo contendo valores agregados. Algumas colunas são mais gerais e têm valores que são iguais à soma dos valores de colunas mais granulares (fine-grained). Dessa forma, agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de Views definidas pelo usuário que somam colunas de nível inferior.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Estas colunas agregam todas as operações de I/O.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

  Estas colunas agregam todas as operações de leitura (read operations), incluindo `FGETS`, `FGETC`, `FREAD`, e `READ`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Estas colunas agregam todas as operações de escrita (write operations), incluindo `FPUTS`, `FPUTC`, `FPRINTF`, `VFPRINTF`, `FWRITE`, e `PWRITE`.

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

  Estas colunas agregam todas as outras operações de I/O, incluindo `CREATE`, `DELETE`, `OPEN`, `CLOSE`, `STREAM_OPEN`, `STREAM_CLOSE`, `SEEK`, `TELL`, `FLUSH`, `STAT`, `FSTAT`, `CHSIZE`, `RENAME`, e `SYNC`. Não há contagens de bytes para estas operações.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de resumo de I/O de arquivo. Ele redefine as colunas de resumo para zero, em vez de remover as linhas.

O servidor MySQL usa diversas técnicas para evitar operações de I/O por meio do caching de informações lidas de arquivos, então é possível que comandos que você esperaria que resultassem em eventos de I/O não o façam. Você pode garantir que o I/O ocorra fazendo o flush dos caches ou reiniciando o servidor para redefinir seu estado.