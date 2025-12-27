### 28.4.4 A Tabela `INFORMATION\_SCHEMA INNODB\_BUFFER\_POOL\_STATS`

A tabela `INNODB_BUFFER_POOL_STATS` fornece grande parte das mesmas informações sobre o pool de buffers fornecidas pela saída do comando `SHOW ENGINE INNODB STATUS`. Grande parte das mesmas informações também pode ser obtida usando as variáveis de status do servidor do pool de buffers do `InnoDB`.

A ideia de tornar as páginas no pool de buffers “jovens” ou “não jovens” refere-se à transferência delas entre as sublistas na extremidade da estrutura de dados do pool de buffers. As páginas tornadas “jovens” demoram mais para serem excluídas do pool de buffers, enquanto as páginas tornadas “não jovens” são movidas muito mais perto do ponto de expulsão.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.5, “Tabelas de Pool de Buffers do INFORMATION\_SCHEMA do InnoDB”.

A tabela `INNODB_BUFFER_POOL_STATS` tem as seguintes colunas:

* `POOL_ID`

  O ID do pool de buffers. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffers.

* `POOL_SIZE`

  O tamanho do pool de buffers do `InnoDB` em páginas.

* `FREE_BUFFERS`

  O número de páginas livres no pool de buffers do `InnoDB`.

* `DATABASE_PAGES`

  O número de páginas no pool de buffers do `InnoDB` que contêm dados. Este número inclui tanto páginas sujas quanto limpas.

* `OLD_DATABASE_PAGES`

  O número de páginas na sublista `old` do pool de buffers.

* `MODIFIED_DATABASE_PAGES`

  O número de páginas de banco de dados modificadas (sujas).

* `PENDING_DECOMPRESS`

  O número de páginas pendentes de descompactação.

* `PENDING_READS`

  O número de leituras pendentes.

* `PENDING_FLUSH_LRU`

  O número de páginas pendentes de varredura no LRU.

* `PENDING_FLUSH_LIST`

  O número de páginas pendentes de varredura na lista de varredura.

* `PAGES_MADE_YOUNG`

  O número de páginas tornadas jovens.

* `PAGES_NOT_MADE_YOUNG`

  O número de páginas que não foram tornadas jovens.

* `PAGES_MADE_YOUNG_RATE`

O número de páginas criadas por segundo (páginas criadas desde a última impressão / tempo decorrido).

* `TAXA_DE_CRIAÇÃO_DE_PAGINAS_JOVENS`

  O número de páginas não criadas por segundo (páginas não criadas desde a última impressão / tempo decorrido).

* `NÚMERO_PAGINAS_LIDAS`

  O número de páginas lidas.

* `NÚMERO_PAGINAS_CRITICAS`

  O número de páginas críticas.

* `NÚMERO_PAGINAS_ESCRITAS`

  O número de páginas escritas.

* `TAXA_DE_LEITURA_DE_PAGINAS`

  O número de páginas lidas por segundo (páginas lidas desde a última impressão / tempo decorrido).

* `TAXA_DE_CRIAÇÃO_DE_PAGINAS`

  O número de páginas criadas por segundo (páginas criadas desde a última impressão / tempo decorrido).

* `TAXA_DE_ESCRITA_DE_PAGINAS`

  O número de páginas escritas por segundo (páginas escritas desde a última impressão / tempo decorrido).

* `NÚMERO_PAGINAS_BUSCAR`

  O número de solicitações lógicas de leitura.

* `TAXA_DE_ATUALIZAÇÃO_DE_BUFFER`

  A taxa de uso do pool de buffer de atualização.

* `JOVENS_CRIAÇÃO_POR_MIL_BUSCAIS`

  O número de páginas criadas por mil buscas.

* `CRIAÇÃO_SEM_JOVENS_POR_MIL_BUSCAIS`

  O número de páginas não criadas por mil buscas.

* `NÚMERO_PAGINAS_LIDAS_ATUAL`

  O número de páginas lidas atual.

* `LIDAS_ATUAL_EVICTADAS`

  O número de páginas lidas no pool de buffer `InnoDB` pelo fio de leitura antecipada que foram posteriormente removidas sem terem sido acessadas por consultas.

* `TAXA_DE_LEITURA_ANTECIPADA`

  A taxa de leitura antecipada por segundo (páginas lidas antecipadamente desde a última impressão / tempo decorrido).

* `TAXA_DE_EVICTAMENTO_DE_LEITURA_ANTECIPADA`

  O número de páginas de leitura antecipada removidas sem acesso por segundo (páginas de leitura antecipada não acessadas desde a última impressão / tempo decorrido).

* `LRU_IO_TOTAL`

  LRU I/O total.

* `LRU_IO_CORRENTE`

  LRU I/O para o intervalo atual.

* `DESCOMPRIMIR_TOTAL`

  Número total de páginas descomprimidos.

* `DESCOMPRIMIR_CORRENTE`

O número de páginas descompactadas no intervalo atual.

#### Exemplo

```
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

* Esta tabela é útil principalmente para monitoramento de desempenho de nível avançado, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.