#### 25.12.15.6 Tabelas de Resumo de Entrada/Saída de Arquivos

O Schema de Desempenho mantém tabelas de resumo de E/S de arquivos que agregam informações sobre operações de E/S.

Exemplo de informações de resumo de eventos de E/S de arquivo:

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

Cada tabela de resumo de entrada/saída de arquivo tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- O `file_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

- O `file_summary_by_instance` possui as colunas `FILE_NAME`, `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um arquivo e um nome de evento específicos.

Cada tabela de resumo de entrada/saída de arquivo tem as seguintes colunas de resumo que contêm valores agregados. Algumas colunas são mais gerais e têm valores que são iguais à soma dos valores de colunas mais detalhadas. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somam colunas de nível mais baixo.

- `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  Essas colunas agregam todas as operações de E/S.

- `CONTAR_LEITURA`, `SOMAR_TEMPO_LEITURA`, `MIN_TEMPO_LEITURA`, `AVG_TEMPO_LEITURA`, `MAX_TEMPO_LEITURA`, `SOMAR_NUMERO_DE_BYTES_LEITURA`

  Essas colunas agregam todas as operações de leitura, incluindo `FGETS`, `FGETC`, `FREAD` e `READ`.

- `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

  Essas colunas agregam todas as operações de escrita, incluindo `FPUTS`, `FPUTC`, `FPRINTF`, `VFPRINTF`, `FWRITE` e `PWRITE`.

- `CONTAGEM_MISC`, `SOMA_TIMER_MISC`, `MIN_TIMER_MISC`, `MÉDIA_TIMER_MISC`, `MAX_TIMER_MISC`

  Essas colunas agregam todas as outras operações de E/S, incluindo `CREATE`, `DELETE`, `OPEN`, `CLOSE`, `STREAM_OPEN`, `STREAM_CLOSE`, `SEEK`, `TELL`, `FLUSH`, `STAT`, `FSTAT`, `CHSIZE`, `RENAME` e `SYNC`. Não há contagem de bytes para essas operações.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de E/S de arquivos. Ela redefine as colunas de resumo para zero, em vez de remover linhas.

O servidor MySQL utiliza várias técnicas para evitar operações de E/S ao armazenar informações lidas de arquivos em cache, portanto, é possível que as instruções que você espera resultar em eventos de E/S não o façam. Você pode garantir que o E/S ocorra ao limpar o cache ou reiniciar o servidor para redefinir seu estado.
