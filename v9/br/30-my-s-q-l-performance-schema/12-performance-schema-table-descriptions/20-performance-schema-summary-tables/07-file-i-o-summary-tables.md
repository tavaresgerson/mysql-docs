#### 29.12.20.7 Tabelas de Resumo de E/S de Arquivos

O Schema de Desempenho mantém tabelas de resumo de E/S de arquivos que agregam informações sobre operações de E/S.

Exemplo de informações de resumo de eventos de E/S de arquivo:

```
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

Cada tabela de resumo de E/S de arquivo tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* `file_summary_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

* `file_summary_by_instance` tem as colunas `FILE_NAME`, `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um arquivo e nome de evento específicos.

Cada tabela de resumo de E/S de arquivo tem as seguintes colunas de resumo contendo valores agregados. Algumas colunas são mais gerais e têm valores que são iguais à soma dos valores de colunas mais detalhadas. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente sem a necessidade de visualizações definidas pelo usuário que somam colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações de E/S.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

  Essas colunas agregam todas as operações de leitura, incluindo `FGETS`, `FGETC`, `FREAD` e `READ`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Essas colunas agregam todas as operações de escrita, incluindo `FPUTS`, `FPUTC`, `FPRINTF`, `VFPRINTF`, `FWRITE` e `PWRITE`.

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

Essas colunas agregam todas as outras operações de E/S, incluindo `CREATE`, `DELETE`, `OPEN`, `CLOSE`, `STREAM_OPEN`, `STREAM_CLOSE`, `SEEK`, `TELL`, `FLUSH`, `STAT`, `FSTAT`, `CHSIZE`, `RENAME` e `SYNC`. Não há contagem de bytes para essas operações.

As tabelas de resumo de E/S de arquivos têm esses índices:

* `file_summary_by_event_name`:

  + Chave primária em (`EVENT_NAME`)
* `file_summary_by_instance`:

  + Chave primária em (`OBJECT_INSTANCE_BEGIN`)

  + Índices em (`FILE_NAME`) e (`EVENT_NAME`)

O `TRUNCATE TABLE` é permitido para as tabelas de resumo de E/S de arquivos. Ele redefiniu as colunas de resumo para zero em vez de remover linhas.

O servidor MySQL usa várias técnicas para evitar operações de E/S, cacheando informações lidas de arquivos, portanto, é possível que instruções que você esperaria resultar em eventos de E/S não o façam. Você pode garantir que o E/S ocorra, limpando caches ou reiniciando o servidor para redefinir seu estado.