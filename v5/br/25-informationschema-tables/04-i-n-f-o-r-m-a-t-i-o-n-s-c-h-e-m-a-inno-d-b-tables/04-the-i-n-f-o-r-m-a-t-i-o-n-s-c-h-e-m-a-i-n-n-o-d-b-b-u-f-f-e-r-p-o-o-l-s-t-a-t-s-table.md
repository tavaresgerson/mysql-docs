### 24.4.4 A Tabela INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS

A tabela [`INNODB_BUFFER_POOL_STATS`](information-schema-innodb-buffer-pool-stats-table.html "24.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table") fornece grande parte das mesmas informações do Buffer Pool que são fornecidas na saída de [`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement"). Grande parte das mesmas informações também pode ser obtida usando as [Server Status Variables](server-status-variables.html "5.1.9 Server Status Variables") do Buffer Pool do `InnoDB`.

A ideia de tornar as pages no Buffer Pool “young” (jovens) ou “not young” (não jovens) refere-se à transferência delas entre as [sublists](glossary.html#glos_sublist "sublist") na cabeça e na cauda da estrutura de dados do Buffer Pool. As pages tornadas “young” demoram mais para serem envelhecidas e saírem do Buffer Pool, enquanto as pages tornadas “not young” são movidas muito mais perto do ponto de [eviction](glossary.html#glos_eviction "eviction") (evicção/descarte).

Para informações de uso e exemplos relacionados, veja [Section 14.16.5, “Tabelas INFORMATION_SCHEMA do Buffer Pool do InnoDB”](innodb-information-schema-buffer-pool-tables.html "14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables").

A tabela [`INNODB_BUFFER_POOL_STATS`](information-schema-innodb-buffer-pool-stats-table.html "24.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table") possui as seguintes colunas:

* `POOL_ID`

  O ID do Buffer Pool. Este é um identificador para distinguir entre múltiplas instâncias do Buffer Pool.

* `POOL_SIZE`

  O tamanho do Buffer Pool do `InnoDB` em pages.

* `FREE_BUFFERS`

  O número de pages livres no Buffer Pool do `InnoDB`.

* `DATABASE_PAGES`

  O número de pages no Buffer Pool do `InnoDB` contendo dados. Este número inclui tanto pages dirty quanto clean.

* `OLD_DATABASE_PAGES`

  O número de pages na sublist `old` do Buffer Pool.

* `MODIFIED_DATABASE_PAGES`

  O número de pages de Database modificadas (dirty).

* `PENDING_DECOMPRESS`

  O número de pages pendentes de descompressão.

* `PENDING_READS`

  O número de reads pendentes.

* `PENDING_FLUSH_LRU`

  O número de pages pendentes de flush na LRU.

* `PENDING_FLUSH_LIST`

  O número de pages pendentes de flush na flush list.

* `PAGES_MADE_YOUNG`

  O número de pages tornadas young.

* `PAGES_NOT_MADE_YOUNG`

  O número de pages não tornadas young.

* `PAGES_MADE_YOUNG_RATE`

  A taxa de pages tornadas young por segundo (pages tornadas young desde o último printout / tempo decorrido).

* `PAGES_MADE_NOT_YOUNG_RATE`

  O número de pages não tornadas young por segundo (pages não tornadas young desde o último printout / tempo decorrido).

* `NUMBER_PAGES_READ`

  O número de pages lidas.

* `NUMBER_PAGES_CREATED`

  O número de pages criadas.

* `NUMBER_PAGES_WRITTEN`

  O número de pages escritas.

* `PAGES_READ_RATE`

  A taxa de pages lidas por segundo (pages lidas desde o último printout / tempo decorrido).

* `PAGES_CREATE_RATE`

  A taxa de pages criadas por segundo (pages criadas desde o último printout / tempo decorrido).

* `PAGES_WRITTEN_RATE`

  A taxa de pages escritas por segundo (pages escritas desde o último printout / tempo decorrido).

* `NUMBER_PAGES_GET`

  O número de requisições de get lógicos.

* `HIT_RATE`

  A taxa de acerto (Hit Rate) do Buffer Pool.

* `YOUNG_MAKE_PER_THOUSAND_GETS`

  O número de pages tornadas young por mil gets.

* `NOT_YOUNG_MAKE_PER_THOUSAND_GETS`

  O número de pages não tornadas young por mil gets.

* `NUMBER_PAGES_READ_AHEAD`

  O número de pages de read-ahead.

* `NUMBER_READ_AHEAD_EVICTED`

  O número de pages lidas no Buffer Pool do `InnoDB` pelo Thread de background de read-ahead que foram subsequentemente descartadas (evicted) sem terem sido acessadas por Queries.

* `READ_AHEAD_RATE`

  A taxa de read-ahead por segundo (pages de read-ahead desde o último printout / tempo decorrido).

* `READ_AHEAD_EVICTED_RATE`

  O número de pages de read-ahead descartadas sem acesso por segundo (pages de read-ahead não acessadas desde o último printout / tempo decorrido).

* `LRU_IO_TOTAL`

  I/O total da LRU.

* `LRU_IO_CURRENT`

  I/O da LRU para o intervalo atual.

* `UNCOMPRESS_TOTAL`

  O número total de pages descompactadas.

* `UNCOMPRESS_CURRENT`

  O número de pages descompactadas no intervalo atual.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_BUFFER_POOL_STATS\G
*************************** 1. row ***************************
                         POOL_ID: 0
                       POOL_SIZE: 8192
                    FREE_BUFFERS: 1
                  DATABASE_PAGES: 8085
              OLD_DATABASE_PAGES: 2964
         MODIFIED_DATABASE_PAGES: 0
              PENDING_DECOMPRESS: 0
                   PENDING_READS: 0
               PENDING_FLUSH_LRU: 0
              PENDING_FLUSH_LIST: 0
                PAGES_MADE_YOUNG: 22821
            PAGES_NOT_MADE_YOUNG: 3544303
           PAGES_MADE_YOUNG_RATE: 357.62602199870594
       PAGES_MADE_NOT_YOUNG_RATE: 0
               NUMBER_PAGES_READ: 2389
            NUMBER_PAGES_CREATED: 12385
            NUMBER_PAGES_WRITTEN: 13111
                 PAGES_READ_RATE: 0
               PAGES_CREATE_RATE: 0
              PAGES_WRITTEN_RATE: 0
                NUMBER_PAGES_GET: 33322210
                        HIT_RATE: 1000
    YOUNG_MAKE_PER_THOUSAND_GETS: 18
NOT_YOUNG_MAKE_PER_THOUSAND_GETS: 0
         NUMBER_PAGES_READ_AHEAD: 2024
       NUMBER_READ_AHEAD_EVICTED: 0
                 READ_AHEAD_RATE: 0
         READ_AHEAD_EVICTED_RATE: 0
                    LRU_IO_TOTAL: 0
                  LRU_IO_CURRENT: 0
                UNCOMPRESS_TOTAL: 0
              UNCOMPRESS_CURRENT: 0
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de performance em nível de especialista, ou ao desenvolver extensões relacionadas à performance para o MySQL.

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para fazer Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo data types e valores Default.