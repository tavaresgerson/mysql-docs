### 24.4.4 A tabela INFORMATION\_SCHEMA INNODB\_BUFFER\_POOL\_STATS

A tabela [`INNODB_BUFFER_POOL_STATS`](https://pt.wikipedia.org/wiki/Tabela_INNODB_BUFFER_POOL_STATS) fornece grande parte das mesmas informações do pool de buffers fornecidas na saída do comando [`SHOW ENGINE INNODB STATUS`](https://pt.wikipedia.org/wiki/Mostrar_estado_do_motor_INNODB). Grande parte das mesmas informações também pode ser obtida usando as variáveis de status do pool de buffers do `InnoDB` (<https://pt.wikipedia.org/wiki/Vari%C3%A1veis_de_status_do_servidor_InnoDB>).

A ideia de tornar as páginas no pool de buffer "jovens" ou "não jovens" refere-se à transferência delas entre as \[sublistas]\(glossary.html#glos\_sublist] na cabeça e na cauda da estrutura de dados do pool de buffer. As páginas tornadas "jovens" demoram mais para serem eliminadas do pool de buffer, enquanto as páginas tornadas "não jovens" são movidas muito mais perto do ponto de expulsão.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.5, “Tabelas do Banco de Armazenamento do InnoDB INFORMATION\_SCHEMA”.

A tabela [`INNODB_BUFFER_POOL_STATS`](https://pt.wikipedia.org/wiki/Tabela_`information-schema-innodb-buffer-pool-stats`) possui as seguintes colunas:

- `POOL_ID`

  O ID do pool de buffers. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffers.

- `POOL_SIZE`

  O tamanho do pool de buffers `InnoDB` em páginas.

- `FREE_BUFFERS`

  O número de páginas livres no pool de buffer do `InnoDB`.

- `DATABASE_PAGES`

  O número de páginas no pool de buffer do `InnoDB` que contêm dados. Esse número inclui páginas sujas e limpas.

- `OLD_DATABASE_PAGES`

  O número de páginas no subconjunto `old` do buffer pool.

- `MODIFICADO_DATABASE_PAGES`

  O número de páginas de banco de dados modificadas (sujas).

- `PENDING_DECOMPRESS`

  Número de páginas pendentes de descompactação.

- `PENDING_READS`

  O número de leituras pendentes.

- `PENDING_FLUSH_LRU`

  O número de páginas pendentes de limpeza no LRU.

- `PENDING_FLUSH_LIST`

  O número de páginas pendentes de limpeza na lista de limpeza.

- `PAGES_MADE_YOUNG`

  O número de páginas fez os jovens.

- `PAGES_NOT_MADE_YOUNG`

  O número de páginas que não foram feitas jovens.

- `TAXA_DE_JOVENS_CUIDADOSAS`

  O número de páginas impressas por segundo (páginas impressas desde a última impressão / tempo decorrido).

- `TAXA DE IDADES NÃO JOVENS NAS PÁGINAS`

  O número de páginas não impressas por segundo (páginas não impressas desde a última impressão/tempo decorrido).

- `NUMBER_PAGES_READ`

  O número de páginas lidas.

- `NUMBER_PAGES_CREATED`

  O número de páginas criadas.

- `NÚMERO_PAGINAS_ESCRITAS`

  O número de páginas escritas.

- `TAXA_DE_LEITURA_DE_PAGINAS`

  O número de páginas lidas por segundo (páginas lidas desde a última impressão / tempo decorrido).

- `TAXA_DE_Criação_DE_PAGINAS`

  O número de páginas criadas por segundo (páginas criadas desde a última impressão / tempo decorrido).

- `TAXA DE ESCRITA DE PÁGINAS`

  O número de páginas escritas por segundo (páginas escritas desde a última impressão / tempo decorrido).

- `NUMBER_PAGES_GET`

  O número de solicitações de leitura lógicas.

- `HIT_RATE`

  Taxa de acerto do pool de tampão.

- `JOVENS FAZEM POR MIL HÁBITOS`

  O número de páginas produzidas por jovem por mil pessoas é obtido.

- `NOT_YOUNG_MAKE_PER_THOUSAND_GETS`

  O número de páginas não impressas por mil é o que se obtém.

- `NUMBER_PAGES_READ_AHEAD`

  O número de páginas lidas à frente.

- `NUMBER_READ_AHEAD_EVICTED`

  O número de páginas lidas no pool de buffer do `InnoDB` pela thread de sincronização de leitura que foram posteriormente removidas sem terem sido acessadas por consultas.

- `READ_AHEAD_RATE`

  A taxa de leitura à frente por segundo (páginas lidas à frente desde a última impressão/tempo decorrido).

- `READ_AHEAD_EVICTED_RATE`

  Número de páginas de pré-visualização removidas sem acesso por segundo (páginas de pré-visualização não acessadas desde a última impressão/tempo decorrido).

- `LRU_IO_TOTAL`

  Total I/O LRU.

- `LRU_IO_CURRENT`

  I/O LRU para o intervalo atual.

- `UNCOMPRESS_TOTAL`

  Número total de páginas descompactadas.

- `UNCOMPRESS_CURRENT`

  O número de páginas descompactadas no intervalo atual.

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

- Esta tabela é útil principalmente para o monitoramento de desempenho em nível de especialista, ou quando se desenvolvem extensões relacionadas ao desempenho para o MySQL.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
