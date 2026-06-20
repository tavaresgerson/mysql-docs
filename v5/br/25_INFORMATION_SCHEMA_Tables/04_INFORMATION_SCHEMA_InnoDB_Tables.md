## 24.4 SCHEMA DE INFORMAÇÃO Tabelas InnoDB

Esta seção fornece definições de tabelas para as tabelas `INFORMATION_SCHEMA` `InnoDB`. Para informações relacionadas e exemplos, consulte a Seção 14.16, “Tabelas do esquema de informações InnoDB”.

As tabelas `INFORMATION_SCHEMA` e `InnoDB` podem ser usadas para monitorar a atividade em andamento `InnoDB`, para detectar ineficiências antes que elas se tornem problemas, ou para solucionar problemas de desempenho e capacidade. À medida que seu banco de dados se torna maior e mais movimentado, enfrentando os limites da capacidade do seu hardware, você monitora e ajusta esses aspectos para manter o banco de dados funcionando de forma suave.

### 24.4.1 TABELA DO SCHEMA DE INFORMAÇÃO Referência à tabela InnoDB

A tabela a seguir resume as tabelas `INFORMATION_SCHEMA` do InnoDB. Para mais detalhes, consulte as descrições individuais das tabelas.

**Tabela 24.3 SCHEMA DE INFORMAÇÃO Tabelas InnoDB**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA InnoDB tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>INNODB_BUFFER_PAGE</code></th> <td>Páginas no buffer pool do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_BUFFER_PAGE_LRU</code></th> <td>Ordem de páginas em LRU no buffer pool do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_BUFFER_POOL_STATS</code></th> <td>Estatísticas do pool de buffers do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMP</code></th> <td>Status para operações relacionadas a tabelas compactadas InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMP_PER_INDEX</code></th> <td>Status para operações relacionadas a tabelas e índices compactados do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMP_PER_INDEX_RESET</code></th> <td>Status para operações relacionadas a tabelas e índices compactados do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMP_RESET</code></th> <td>Status para operações relacionadas a tabelas compactadas InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMPMEM</code></th> <td>Status para páginas compactadas dentro do pool de buffer do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_CMPMEM_RESET</code></th> <td>Status para páginas compactadas dentro do pool de buffer do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_FT_BEING_DELETED</code></th> <td>Snapshot of INNODB_FT_DELETED table</td> <td></td> </tr><tr><th><code>INNODB_FT_CONFIG</code></th> <td>Metadados para o índice FULLTEXT da tabela InnoDB e processamento associado</td> <td></td> </tr><tr><th><code>INNODB_FT_DEFAULT_STOPWORD</code></th> <td>Lista padrão de palavras irrelevantes para índices FULLTEXT do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_FT_DELETED</code></th> <td>Strings excluídas do índice FULLTEXT da tabela InnoDB</td> <td></td> </tr><tr><th><code>INNODB_FT_INDEX_CACHE</code></th> <td>Informações sobre tokens para strings recém-inseridas no índice FULLTEXT do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_FT_INDEX_TABLE</code></th> <td>Informações do índice invertido para processar pesquisas de texto contra o índice FULLTEXT da tabela InnoDB</td> <td></td> </tr><tr><th><code>INNODB_LOCK_WAITS</code></th> <td>InnoDB transaction lock-wait information</td> <td>5.7.14</td> </tr><tr><th><code>INNODB_LOCKS</code></th> <td>InnoDB transaction lock information</td> <td>5.7.14</td> </tr><tr><th><code>INNODB_METRICS</code></th> <td>InnoDB performance information</td> <td></td> </tr><tr><th><code>INNODB_SYS_COLUMNS</code></th> <td>Colunas em cada tabela InnoDB</td> <td></td> </tr><tr><th><code>INNODB_SYS_DATAFILES</code></th> <td>Informações sobre o caminho do arquivo de dados para InnoDB file-per-table e espaços de tabela gerais</td> <td></td> </tr><tr><th><code>INNODB_SYS_FIELDS</code></th> <td>Colunas-chave dos índices InnoDB</td> <td></td> </tr><tr><th><code>INNODB_SYS_FOREIGN</code></th> <td>InnoDB foreign-key metadata</td> <td></td> </tr><tr><th><code>INNODB_SYS_FOREIGN_COLS</code></th> <td>Informações sobre o status das colunas de chave estrangeira do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_SYS_INDEXES</code></th> <td>InnoDB index metadata</td> <td></td> </tr><tr><th><code>INNODB_SYS_TABLES</code></th> <td>InnoDB table metadata</td> <td></td> </tr><tr><th><code>INNODB_SYS_TABLESPACES</code></th> <td>Metadados de InnoDB de arquivo por tabela, gerais e espaço de desfazer</td> <td></td> </tr><tr><th><code>INNODB_SYS_TABLESTATS</code></th> <td>Informações de status de tabela de nível baixo do InnoDB</td> <td></td> </tr><tr><th><code>INNODB_SYS_VIRTUAL</code></th> <td>Metadados de coluna virtual gerada por InnoDB</td> <td></td> </tr><tr><th><code>INNODB_TEMP_TABLE_INFO</code></th> <td>Informações sobre tabelas temporárias criadas por usuários ativos no InnoDB</td> <td></td> </tr><tr><th><code>INNODB_TRX</code></th> <td>Informações de transação ativa do InnoDB</td> <td></td> </tr></tbody></table>

### 24.4.2 A tabela INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE

A tabela `INNODB_BUFFER_PAGE` fornece informações sobre cada página no conjunto de buffers `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.5, “Tabelas do Banco de Armazenamento de Buffer do Schema de Informação InnoDB”.

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte esta tabela em um sistema de produção a menos que você esteja ciente do impacto no desempenho e tenha determinado que é aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE` tem essas colunas:

* `POOL_ID`

O ID do pool de buffer. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffer.

* `BLOCK_ID`

O ID do bloco do buffer pool.

* `SPACE`

O ID do tablespace; o mesmo valor que `INNODB_SYS_TABLES.SPACE`.

* `PAGE_NUMBER`

O número da página.

* `PAGE_TYPE`

O tipo de página. O quadro a seguir mostra os valores permitidos.

**Tabela 24.4 Valores de INNODB\_BUFFER\_PAGE.PAGE\_TYPE**

  <table summary="Mapping for interpreting INNODB_BUFFER_PAGE.PAGE_TYPE values."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Page Type</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALLOCATED</code></td> <td>Página recém-atribuída</td> </tr><tr> <td><code>BLOB</code></td> <td>Página BLOB não compactada</td> </tr><tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Página subsequente comp BLOB</td> </tr><tr> <td><code>COMPRESSED_BLOB</code></td> <td>Primeira página BLOB compactada</td> </tr><tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Página de descrição do alcance</td> </tr><tr> <td><code>FILE_SPACE_HEADER</code></td> <td>Cabeçalho de espaço de arquivo</td> </tr><tr> <td><code>IBUF_BITMAP</code></td> <td>Insira a bitmap de buffer</td> </tr><tr> <td><code>IBUF_FREE_LIST</code></td> <td>Insira a lista de buffers livres</td> </tr><tr> <td><code>IBUF_INDEX</code></td> <td>Insira o índice do buffer</td> </tr><tr> <td><code>INDEX</code></td> <td>nó de árvore B</td> </tr><tr> <td><code>INODE</code></td> <td>Nodo do índice</td> </tr><tr> <td><code>RTREE_INDEX</code></td> <td>índice de árvore R</td> </tr><tr> <td><code>SYSTEM</code></td> <td>Página do sistema</td> </tr><tr> <td><code>TRX_SYSTEM</code></td> <td>Dados do sistema de transação</td> </tr><tr> <td><code>UNDO_LOG</code></td> <td>Desfazer página de registro</td> </tr><tr> <td><code>UNKNOWN</code></td> <td>Desconhecido</td> </tr></tbody></table>

* `FLUSH_TYPE`

O tipo de descarga.

* `FIX_COUNT`

O número de threads que utilizam este bloco dentro do pool de buffer. Quando zero, o bloco é elegível para ser ejetado.

* `IS_HASHED`

Se um índice de hash foi construído nesta página.

* `NEWEST_MODIFICATION`

O Número de Sequência de Registro da modificação mais recente.

* `OLDEST_MODIFICATION`

O Número de Sequência de Registro da modificação mais antiga.

* `ACCESS_TIME`

Um número abstrato usado para julgar o primeiro tempo de acesso da página.

* `TABLE_NAME`

O nome da tabela à qual a página pertence. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `INDEX_NAME`

O nome do índice ao qual a página pertence. Isso pode ser o nome de um índice agrupado ou um índice secundário. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `NUMBER_RECORDS`

O número de registros na página.

* `DATA_SIZE`

A soma dos tamanhos dos registros. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `COMPRESSED_SIZE`

O tamanho de página compactada. `NULL` para páginas que não estão compactadas.

* `PAGE_STATE`

O estado da página. O quadro a seguir mostra os valores permitidos.

**Tabela 24.5 Valores de INNODB\_BUFFER\_PAGE.PAGE\_STATE**

  <table summary="Mapping for interpreting INNODB_BUFFER_PAGE.PAGE_STATE values."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Page State</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>FILE_PAGE</code></td> <td>Uma página de arquivo com buffer</td> </tr><tr> <td><code>MEMORY</code></td> <td>Contém um objeto de memória principal</td> </tr><tr> <td><code>NOT_USED</code></td> <td>Na lista gratuita</td> </tr><tr> <td><code>NULL</code></td> <td>Páginas compactadas limpas, páginas compactadas na lista de limpeza, páginas usadas como sentinelas de monitoramento do buffer pool</td> </tr><tr> <td><code>READY_FOR_USE</code></td> <td>Uma página gratuita</td> </tr><tr> <td><code>REMOVE_HASH</code></td> <td>O índice de hash deve ser removido antes de ser colocado na lista livre</td> </tr></tbody></table>

* `IO_FIX`

Se há algum I/O pendente para esta página: `IO_NONE` = nenhum I/O pendente, `IO_READ` = leitura pendente, `IO_WRITE` = escrita pendente.

* `IS_OLD`

Se o bloco está na sublista de blocos antigos na lista LRU.

* `FREE_PAGE_CLOCK`

O valor do contador `freed_page_clock` quando o bloco foi o último colocado na cabeça da lista LRU. O contador `freed_page_clock` acompanha o número de blocos removidos da extremidade da lista LRU.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE LIMIT 1\G
*************************** 1. row ***************************
            POOL_ID: 0
           BLOCK_ID: 0
              SPACE: 97
        PAGE_NUMBER: 2473
          PAGE_TYPE: INDEX
         FLUSH_TYPE: 1
          FIX_COUNT: 0
          IS_HASHED: YES
NEWEST_MODIFICATION: 733855581
OLDEST_MODIFICATION: 0
        ACCESS_TIME: 3378385672
         TABLE_NAME: `employees`.`salaries`
         INDEX_NAME: PRIMARY
     NUMBER_RECORDS: 468
          DATA_SIZE: 14976
    COMPRESSED_SIZE: 0
         PAGE_STATE: FILE_PAGE
             IO_FIX: IO_NONE
             IS_OLD: YES
    FREE_PAGE_CLOCK: 66
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de desempenho de nível de especialista, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Quando tabelas, strings de tabela, partições ou índices são excluídos, as páginas associadas permanecem no buffer pool até que seja necessário espaço para outros dados. A tabela `INNODB_BUFFER_PAGE` reporta informações sobre essas páginas até que elas sejam expulsas do buffer pool. Para mais informações sobre como o `InnoDB` gerencia os dados do buffer pool, consulte a Seção 14.5.1, “Buffer Pool”.

### 24.4.3 A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU

A tabela `INNODB_BUFFER_PAGE_LRU` fornece informações sobre as páginas no conjunto de buffers `InnoDB`; em particular, como elas são ordenadas na lista LRU que determina quais páginas devem ser eliminadas do conjunto de buffers quando ele se tornar cheio.

A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, exceto que a tabela `INNODB_BUFFER_PAGE_LRU` tem as colunas `LRU_POSITION` e `COMPRESSED` em vez das colunas `BLOCK_ID` e `PAGE_STATE`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.5, “Tabelas do Banco de Armazenamento de Buffer do Schema de Informação InnoDB”.

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não consulte esta tabela em um sistema de produção a menos que você esteja ciente do impacto no desempenho e tenha determinado que é aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE_LRU` tem essas colunas:

* `POOL_ID`

O ID do pool de buffer. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffer.

* `LRU_POSITION`

A posição da página na lista LRU.

* `SPACE`

O ID do tablespace; o mesmo valor que `INNODB_SYS_TABLES.SPACE`.

* `PAGE_NUMBER`

O número da página.

* `PAGE_TYPE`

O tipo de página. O quadro a seguir mostra os valores permitidos.

**Tabela 24.6 Valores de INNODB\_BUFFER\_PAGE\_LRU.PAGE\_TYPE**

  <table summary="Mapping for interpreting INNODB_BUFFER_PAGE_LRU.PAGE_TYPE values."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Page Type</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALLOCATED</code></td> <td>Página recém-atribuída</td> </tr><tr> <td><code>BLOB</code></td> <td>Página BLOB não compactada</td> </tr><tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Página subsequente comp BLOB</td> </tr><tr> <td><code>COMPRESSED_BLOB</code></td> <td>Primeira página BLOB compactada</td> </tr><tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Página de descrição do alcance</td> </tr><tr> <td><code>FILE_SPACE_HEADER</code></td> <td>Cabeçalho de espaço de arquivo</td> </tr><tr> <td><code>IBUF_BITMAP</code></td> <td>Insira a bitmap de buffer</td> </tr><tr> <td><code>IBUF_FREE_LIST</code></td> <td>Insira a lista de buffers livres</td> </tr><tr> <td><code>IBUF_INDEX</code></td> <td>Insira o índice do buffer</td> </tr><tr> <td><code>INDEX</code></td> <td>nó de árvore B</td> </tr><tr> <td><code>INODE</code></td> <td>Nodo do índice</td> </tr><tr> <td><code>RTREE_INDEX</code></td> <td>índice de árvore R</td> </tr><tr> <td><code>SYSTEM</code></td> <td>Página do sistema</td> </tr><tr> <td><code>TRX_SYSTEM</code></td> <td>Dados do sistema de transação</td> </tr><tr> <td><code>UNDO_LOG</code></td> <td>Desfazer página de registro</td> </tr><tr> <td><code>UNKNOWN</code></td> <td>Desconhecido</td> </tr></tbody></table>

* `FLUSH_TYPE`

O tipo de descarga.

* `FIX_COUNT`

O número de threads que utilizam este bloco dentro do pool de buffer. Quando zero, o bloco é elegível para ser ejetado.

* `IS_HASHED`

Se um índice de hash foi construído nesta página.

* `NEWEST_MODIFICATION`

O Número de Sequência de Registro da modificação mais recente.

* `OLDEST_MODIFICATION`

O Número de Sequência de Registro da modificação mais antiga.

* `ACCESS_TIME`

Um número abstrato usado para julgar o primeiro tempo de acesso da página.

* `TABLE_NAME`

O nome da tabela à qual a página pertence. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `INDEX_NAME`

O nome do índice ao qual a página pertence. Isso pode ser o nome de um índice agrupado ou um índice secundário. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `NUMBER_RECORDS`

O número de registros na página.

* `DATA_SIZE`

A soma dos tamanhos dos registros. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

* `COMPRESSED_SIZE`

O tamanho de página comprimida. `NULL` para páginas que não estão comprimidas.

* `COMPRESSED`

Se a página está comprimida.

* `IO_FIX`

Se há algum I/O pendente para esta página: `IO_NONE` = nenhum I/O pendente, `IO_READ` = leitura pendente, `IO_WRITE` = escrita pendente.

* `IS_OLD`

Se o bloco está na sublista de blocos antigos na lista LRU.

* `FREE_PAGE_CLOCK`

O valor do contador `freed_page_clock` quando o bloco foi o último colocado na cabeça da lista LRU. O contador `freed_page_clock` acompanha o número de blocos removidos da extremidade da lista LRU.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU LIMIT 1\G
*************************** 1. row ***************************
            POOL_ID: 0
       LRU_POSITION: 0
              SPACE: 97
        PAGE_NUMBER: 1984
          PAGE_TYPE: INDEX
         FLUSH_TYPE: 1
          FIX_COUNT: 0
          IS_HASHED: YES
NEWEST_MODIFICATION: 719490396
OLDEST_MODIFICATION: 0
        ACCESS_TIME: 3378383796
         TABLE_NAME: `employees`.`salaries`
         INDEX_NAME: PRIMARY
     NUMBER_RECORDS: 468
          DATA_SIZE: 14976
    COMPRESSED_SIZE: 0
         COMPRESSED: NO
             IO_FIX: IO_NONE
             IS_OLD: YES
    FREE_PAGE_CLOCK: 0
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de desempenho de nível de especialista, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* A consulta a esta tabela pode exigir que o MySQL aloque um grande bloco de memória contínua, mais de 64 bytes vezes o número de páginas ativas no pool de buffer. Essa alocação pode potencialmente causar um erro de falta de memória, especialmente para sistemas com pools de buffer de vários gigabytes.

* Para consultar essa tabela, o MySQL precisa bloquear a estrutura de dados que representa o buffer pool durante a navegação na lista LRU, o que pode reduzir a concorrência, especialmente para sistemas com buffer pools de vários gigabytes.

* Quando tabelas, strings de tabela, partições ou índices são excluídos, as páginas associadas permanecem no buffer pool até que seja necessário espaço para outros dados. A tabela `INNODB_BUFFER_PAGE_LRU` reporta informações sobre essas páginas até que elas sejam expulsas do buffer pool. Para mais informações sobre como o `InnoDB` gerencia os dados do buffer pool, consulte a Seção 14.5.1, “Buffer Pool”.

### 24.4.4 A tabela INFORMATION_SCHEMA.INNODB_BUFFER_POOL_STATS

A tabela `INNODB_BUFFER_POOL_STATS` fornece muitas das mesmas informações do pool de buffer fornecidas na saída `SHOW ENGINE INNODB STATUS`. Muitas das mesmas informações também podem ser obtidas usando as variáveis de status do servidor do pool de buffer `InnoDB`.

A ideia de fazer as páginas no buffer "jovens" ou "não jovens" refere-se à transferência entre as sublistas na cabeça e na cauda da estrutura de dados do buffer pool. As páginas feitas "jovens" demoram mais para sair do buffer pool, enquanto as páginas feitas "não jovens" são movidas muito mais perto do ponto de expulsão.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.5, “Tabelas do Banco de Armazenamento de Buffer do Schema de Informação InnoDB”.

A tabela `INNODB_BUFFER_POOL_STATS` tem essas colunas:

* `POOL_ID`

O ID do pool de buffer. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffer.

* `POOL_SIZE`

O tamanho do pool de buffer `InnoDB` em páginas.

* `FREE_BUFFERS`

O número de páginas livres no pool de buffer `InnoDB`.

* `DATABASE_PAGES`

O número de páginas no pool de buffer `InnoDB` que contém dados. Esse número inclui páginas limpas e sujas.

* `OLD_DATABASE_PAGES`

O número de páginas no subconjunto de reserva `old`.

* `MODIFIED_DATABASE_PAGES`

O número de páginas de banco de dados modificadas (sujas).

* `PENDING_DECOMPRESS`

Número de páginas pendentes de descompactação.

* `PENDING_READS`

O número de leituras pendentes.

* `PENDING_FLUSH_LRU`

O número de páginas pendentes de limpeza no LRU.

* `PENDING_FLUSH_LIST`

O número de páginas pendentes de limpeza na lista de limpeza.

* `PAGES_MADE_YOUNG`

O número de páginas fez os jovens.

* `PAGES_NOT_MADE_YOUNG`

O número de páginas que não se tornaram jovens.

* `PAGES_MADE_YOUNG_RATE`

O número de páginas produzidas por jovem por segundo (páginas produzidas por jovem desde a última impressão / tempo decorrido).

* `PAGES_MADE_NOT_YOUNG_RATE`

O número de páginas não impressas por segundo (páginas não impressas desde a última impressão/tempo decorrido).

* `NUMBER_PAGES_READ`

O número de páginas lidas.

* `NUMBER_PAGES_CREATED`

O número de páginas criadas.

* `NUMBER_PAGES_WRITTEN`

O número de páginas escritas.

* `PAGES_READ_RATE`

O número de páginas lidas por segundo (páginas lidas desde a última impressão / tempo decorrido).

* `PAGES_CREATE_RATE`

O número de páginas criadas por segundo (páginas criadas desde a última impressão / tempo decorrido).

* `PAGES_WRITTEN_RATE`

O número de páginas escritas por segundo (páginas escritas desde a última impressão / tempo decorrido).

* `NUMBER_PAGES_GET`

O número de solicitações de leitura lógica.

* `HIT_RATE`

Taxa de acerto do pool de buffer.

* `YOUNG_MAKE_PER_THOUSAND_GETS`

O número de páginas feitas por jovem por mil é o que se obtém.

* `NOT_YOUNG_MAKE_PER_THOUSAND_GETS`

O número de páginas que não se tornam jovens por mil obtém.

* `NUMBER_PAGES_READ_AHEAD`

O número de páginas lidas à frente.

* `NUMBER_READ_AHEAD_EVICTED`

O número de páginas lidas no pool de buffer `InnoDB` pelo thread de leitura antecipada em segundo plano que foram posteriormente expulsas sem terem sido acessadas por consultas.

* `READ_AHEAD_RATE`

A taxa de leitura à frente por segundo (páginas lidas à frente desde a última impressão / tempo decorrido).

* `READ_AHEAD_EVICTED_RATE`

O número de páginas de antecipação removidas sem acesso por segundo (páginas de antecipação que não foram acessadas desde a última impressão/tempo decorrido).

* `LRU_IO_TOTAL`

Total I/O LRU.

* `LRU_IO_CURRENT`

LRU I/O para o intervalo atual.

* `UNCOMPRESS_TOTAL`

Número total de páginas descompactadas.

* `UNCOMPRESS_CURRENT`

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

* Esta tabela é útil principalmente para monitoramento de desempenho de nível de especialista, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.5 As tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações de status sobre operações relacionadas a tabelas compactadas `InnoDB`.

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` possuem essas colunas:

* `PAGE_SIZE`

O tamanho da página comprimida em bytes.

* `COMPRESS_OPS`

O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi comprimida. As páginas são comprimidas sempre que uma página vazia é criada ou o espaço para o log de modificação não comprimido esgota.

* `COMPRESS_OPS_OK`

O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi comprimida com sucesso. Esse contagem nunca deve exceder `COMPRESS_OPS`.

* `COMPRESS_TIME`

O tempo total em segundos utilizado para tentativas de compressão de páginas de B-tree do tamanho `PAGE_SIZE`.

* `UNCOMPRESS_OPS`

O número de vezes que uma página de árvore B do tamanho `PAGE_SIZE` foi descomprimida. As páginas de árvore B são descomprimidas sempre que a compressão falha ou na primeira vez de acesso quando a página descomprimida não existe no pool de buffer.

* `UNCOMPRESS_TIME`

O tempo total em segundos usado para descompactação das páginas de B-tree do tamanho `PAGE_SIZE`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP\G
*************************** 1. row ***************************
      page_size: 1024
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 2. row ***************************
      page_size: 2048
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 3. row ***************************
      page_size: 4096
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 4. row ***************************
      page_size: 8192
   compress_ops: 86955
compress_ops_ok: 81182
  compress_time: 27
 uncompress_ops: 26828
uncompress_time: 5
*************************** 5. row ***************************
      page_size: 16384
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
```

#### Notas

* Use essas tabelas para medir a eficácia da compressão da tabela `InnoDB` em seu banco de dados.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações de uso, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabela InnoDB em Tempo Real” e a Seção 14.16.1.3, “Uso das Tabelas de Esquema de Informações de Compressão”. Para informações gerais sobre a compressão da tabela `InnoDB`, consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”.

### 24.4.6 As tabelas INFORMATION\_SCHEMA INNODB\_CMPMEM e INNODB\_CMPMEM\_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre páginas compactadas dentro do conjunto de buffers `InnoDB`.

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` possuem essas colunas:

* `PAGE_SIZE`

O tamanho do bloco em bytes. Cada registro desta tabela descreve blocos desse tamanho.

* `BUFFER_POOL_INSTANCE`

Um identificador único para a instância do buffer pool.

* `PAGES_USED`

O número de blocos do tamanho `PAGE_SIZE` que estão atualmente em uso.

* `PAGES_FREE`

O número de blocos do tamanho `PAGE_SIZE` que estão atualmente disponíveis para alocação. Esta coluna mostra a fragmentação externa na reserva de memória. Idealmente, esses números devem ser no máximo 1.

* `RELOCATION_OPS`

O número de vezes que um bloco do tamanho `PAGE_SIZE` foi realocado. O sistema de amizade pode realocar o "vizinho amigo" alocado de um bloco liberado quando ele tenta formar um bloco liberado maior. A leitura da tabela `INNODB_CMPMEM_RESET` refaz esse contagem.

* `RELOCATION_TIME`

O tempo total em microsegundos usado para realocar blocos do tamanho `PAGE_SIZE`. A leitura da tabela `INNODB_CMPMEM_RESET` refaz esse contagem.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMPMEM\G
*************************** 1. row ***************************
           page_size: 1024
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 2. row ***************************
           page_size: 2048
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 3. row ***************************
           page_size: 4096
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
*************************** 4. row ***************************
           page_size: 8192
buffer_pool_instance: 0
          pages_used: 7673
          pages_free: 15
      relocation_ops: 4638
     relocation_time: 0
*************************** 5. row ***************************
           page_size: 16384
buffer_pool_instance: 0
          pages_used: 0
          pages_free: 0
      relocation_ops: 0
     relocation_time: 0
```

#### Notas

* Use essas tabelas para medir a eficácia da compressão da tabela `InnoDB` em seu banco de dados.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações de uso, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabela InnoDB em Tempo Real” e a Seção 14.16.1.3, “Uso das Tabelas de Esquema de Informações de Compressão”. Para informações gerais sobre a compressão da tabela `InnoDB`, consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”.

### 24.4.7 As tabelas INFORMATION\_SCHEMA INNODB\_CMP\_PER\_INDEX e INNODB\_CMP\_PER\_INDEX\_RESET

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` fornecem informações de status sobre operações relacionadas a tabelas compactadas `InnoDB` e índices, com estatísticas separadas para cada combinação de banco de dados, tabela e índice, para ajudá-lo a avaliar o desempenho e a utilidade da compactação para tabelas específicas.

Para uma tabela compactada `InnoDB`, tanto os dados da tabela quanto todos os índices secundários são compactados. Nesse contexto, os dados da tabela são tratados como apenas outro índice, aquele que por acaso contém todas as colunas: o índice agrupado.

As tabelas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` possuem essas colunas:

* `DATABASE_NAME`

O esquema (banco de dados) que contém a tabela aplicável.

* `TABLE_NAME`

A tabela para monitorar as estatísticas de compressão.

* `INDEX_NAME`

O índice para monitorar as estatísticas de compressão.

* `COMPRESS_OPS`

O número de operações de compressão realizadas. As páginas são comprimidas sempre que uma página vazia é criada ou o espaço para o log de modificação não comprimido esgota.

* `COMPRESS_OPS_OK`

O número de operações de compressão bem-sucedidas. Subtraia do valor de `COMPRESS_OPS` para obter o número de falhas de compressão. Divida pelo valor de `COMPRESS_OPS` para obter a porcentagem de falhas de compressão.

* `COMPRESS_TIME`

O tempo total em segundos usado para comprimir os dados neste índice.

* `UNCOMPRESS_OPS`

O número de operações de descomprimemção realizadas. As páginas compactadas do `InnoDB` são descomprimemdas sempre que a compactação falha, ou na primeira vez que uma página compactada é acessada no pool de buffer e a página descomprimemda não existe.

* `UNCOMPRESS_TIME`

O tempo total em segundos usado para descompactação dos dados neste índice.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP_PER_INDEX\G
*************************** 1. row ***************************
  database_name: employees
     table_name: salaries
     index_name: PRIMARY
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 23451
uncompress_time: 4
*************************** 2. row ***************************
  database_name: employees
     table_name: salaries
     index_name: emp_no
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 1597
uncompress_time: 0
```

#### Notas

* Use essas tabelas para medir a eficácia da compressão da tabela `InnoDB` para tabelas específicas, índices ou ambas.

* Você deve ter o privilégio `PROCESS` para consultar essas tabelas.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessas tabelas, incluindo tipos de dados e valores padrão.

* Como a coleta de medições separadas para cada índice impõe um custo de desempenho substancial, as estatísticas `INNODB_CMP_PER_INDEX` e `INNODB_CMP_PER_INDEX_RESET` não são coletadas por padrão. Você deve habilitar a variável de sistema `innodb_cmp_per_index_enabled` antes de realizar as operações em tabelas compactadas que você deseja monitorar.

* Para informações de uso, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabela InnoDB em Tempo Real” e a Seção 14.16.1.3, “Uso das Tabelas de Esquema de Informações de Compressão”. Para informações gerais sobre a compressão da tabela `InnoDB`, consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”.

### 24.4.8 A tabela INFORMATION\_SCHEMA INNODB\_FT\_BEING\_DELETED

A tabela `INNODB_FT_BEING_DELETED` fornece um instantâneo da tabela `INNODB_FT_DELETED`; ela é usada apenas durante uma operação de manutenção `OPTIMIZE TABLE`. Quando o `OPTIMIZE TABLE` é executado, a tabela `INNODB_FT_BEING_DELETED` é esvaziada e os valores de `DOC_ID` são removidos da tabela `INNODB_FT_DELETED`. Como o conteúdo de `INNODB_FT_BEING_DELETED` geralmente tem uma vida curta, essa tabela tem utilidade limitada para monitoramento ou depuração. Para informações sobre como executar o `OPTIMIZE TABLE` em tabelas com índices `FULLTEXT`, consulte a Seção 12.9.6, “Ajustando o MySQL de Pesquisa de Texto Completo”.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`. A saída aparece semelhante ao exemplo fornecido para a tabela `INNODB_FT_DELETED`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_BEING_DELETED` tem essas colunas:

* `DOC_ID`

O ID do documento da string que está em processo de ser excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para ignorar strings na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das strings excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma declaração `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices full-text InnoDB.

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.9 A tabela INFORMATION\_SCHEMA INNODB\_FT\_CONFIG

A tabela `INNODB_FT_CONFIG` fornece metadados sobre o índice `FULLTEXT` e o processamento associado a uma tabela `InnoDB`.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_CONFIG` tem essas colunas:

* `KEY`

O nome que designa um item de metadados para uma tabela `InnoDB` que contém um índice `FULLTEXT`.

Os valores desta coluna podem mudar, dependendo das necessidades de ajuste de desempenho e depuração para o processamento de texto completo do `InnoDB`. Os nomes das chaves e seus significados incluem:

+ `optimize_checkpoint_limit`: O número de segundos após o qual uma execução de `OPTIMIZE TABLE` é interrompida.

+ `synced_doc_id`: O próximo `DOC_ID` a ser emitido.

+ `stopword_table_name`: O nome *`database/table`* para uma tabela de palavras não definidas pelo usuário. A coluna `VALUE` está vazia se não houver uma tabela de palavras não definidas pelo usuário.

+ `use_stopword`: Indica se uma tabela de palavras-chave é usada, que é definida quando o índice `FULLTEXT` é criado.

* `VALUE`

O valor associado à coluna correspondente `KEY`, refletindo algum limite ou valor atual para um aspecto de um índice `FULLTEXT` para uma tabela `InnoDB`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
+---------------------------+-------------------+
| KEY                       | VALUE             |
+---------------------------+-------------------+
| optimize_checkpoint_limit | 180               |
| synced_doc_id             | 0                 |
| stopword_table_name       | test/my_stopwords |
| use_stopword              | 1                 |
+---------------------------+-------------------+
```

#### Notas

* Esta tabela é destinada apenas para configuração interna. Não é destinada para fins de informações estatísticas.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.10 A tabela INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD

A tabela `INNODB_FT_DEFAULT_STOPWORD` contém uma lista de palavras irrelevantes que são usadas por padrão ao criar um índice `FULLTEXT` em tabelas `InnoDB`. Para informações sobre a lista de palavras irrelevantes padrão `InnoDB` e como definir suas próprias listas de palavras irrelevantes, consulte a Seção 12.9.4, “Palavras irrelevantes de texto completo”.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_DEFAULT_STOPWORD` tem essas colunas:

* `value`

Uma palavra que é usada por padrão como uma palavra parada para índices `FULLTEXT` em tabelas `InnoDB`. Isso não é usado se você sobrepuser o processamento de palavra parada padrão com a variável de sistema `innodb_ft_server_stopword_table` ou `innodb_ft_user_stopword_table`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.11 A tabela INFORMATION\_SCHEMA INNODB\_FT\_DELETED

A tabela `INNODB_FT_DELETED` armazena strings que são excluídas do índice `FULLTEXT` para uma tabela `InnoDB`. Para evitar a reorganização cara do índice durante operações de MQL para um índice `InnoDB` `FULLTEXT`, as informações sobre as palavras recém-excluídas são armazenadas separadamente, filtradas dos resultados de pesquisa quando você faz uma pesquisa de texto e removidas do índice de pesquisa principal apenas quando você emite uma declaração `OPTIMIZE TABLE` para a tabela `InnoDB`. Para mais informações, consulte Otimizando índices de texto completo do InnoDB.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_DELETED` tem essas colunas:

* `DOC_ID`

O ID do documento da string recentemente excluída. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada. Esse valor é usado quando você realiza pesquisas de texto, para ignorar strings na tabela `INNODB_FT_INDEX_TABLE` antes que os dados das strings excluídas sejam removidos fisicamente do índice `FULLTEXT` por uma declaração `OPTIMIZE TABLE`. Para mais informações, consulte Otimização de índices full-text InnoDB.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
+--------+
| DOC_ID |
+--------+
|      6 |
|      7 |
|      8 |
+--------+
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.12 A tabela INFORMATION\_SCHEMA INNODB\_FT\_INDEX\_CACHE

A tabela `INNODB_FT_INDEX_CACHE` fornece informações sobre tokens de novas strings inseridas em um índice `FULLTEXT`. Para evitar a reorganização cara do índice durante operações de DML, as informações sobre as palavras indexadas recentemente são armazenadas separadamente e combinadas com o índice de pesquisa principal apenas quando o `OPTIMIZE TABLE` é executado, quando o servidor é desligado ou quando o tamanho da cache excede um limite definido pela variável de sistema `innodb_ft_cache_size` ou `innodb_ft_total_cache_size`.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_INDEX_CACHE` tem essas colunas:

* `WORD`

Uma palavra extraída do texto de uma string recém-inserida.

* `FIRST_DOC_ID`

O primeiro documento com o ID em que essa palavra aparece no índice `FULLTEXT`.

* `LAST_DOC_ID`

O último ID de documento no qual essa palavra aparece no índice `FULLTEXT`.

* `DOC_COUNT`

O número de strings em que essa palavra aparece no índice `FULLTEXT`. A mesma palavra pode ocorrer várias vezes na tabela de cache, uma vez para cada combinação de valores de `DOC_ID` e `POSITION`.

* `DOC_ID`

O ID do documento da string recém-inserida. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada.

* `POSITION`

A posição dessa instância específica da palavra dentro do documento relevante, identificada pelo valor `DOC_ID`. O valor não representa uma posição absoluta; é um deslocamento adicionado ao `POSITION` da instância anterior dessa palavra.

#### Notas

* Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`. O exemplo a seguir demonstra como usar a variável de sistema `innodb_ft_aux_table` para mostrar informações sobre um índice `FULLTEXT` para uma tabela especificada.

  ```sql
  mysql> USE test;

  mysql> CREATE TABLE articles (
           id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
           title VARCHAR(200),
           body TEXT,
           FULLTEXT (title,body)
         ) ENGINE=InnoDB;

  mysql> INSERT INTO articles (title,body) VALUES
         ('MySQL Tutorial','DBMS stands for DataBase ...'),
         ('How To Use MySQL Well','After you went through a ...'),
         ('Optimizing MySQL','In this tutorial we show ...'),
         ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
         ('MySQL vs. YourSQL','In the following database comparison ...'),
         ('MySQL Security','When configured properly, MySQL ...');

  mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';

  mysql> SELECT WORD, DOC_COUNT, DOC_ID, POSITION
         FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
  +------------+-----------+--------+----------+
  | WORD       | DOC_COUNT | DOC_ID | POSITION |
  +------------+-----------+--------+----------+
  | 1001       |         1 |      4 |        0 |
  | after      |         1 |      2 |       22 |
  | comparison |         1 |      5 |       44 |
  | configured |         1 |      6 |       20 |
  | database   |         2 |      1 |       31 |
  +------------+-----------+--------+----------+
  ```

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.13 Tabela de tabela de índice INNODB\_FT\_ÍNDICE de SCHEMA\_INFORMACIÓN 24.4.13

A tabela `INNODB_FT_INDEX_TABLE` fornece informações sobre o índice invertido usado para processar pesquisas de texto contra o índice `FULLTEXT` de uma tabela `InnoDB`.

Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_FT_INDEX_TABLE` tem essas colunas:

* `WORD`

Uma palavra extraída do texto das colunas que fazem parte de um `FULLTEXT`.

* `FIRST_DOC_ID`

O primeiro documento com o ID em que essa palavra aparece no índice `FULLTEXT`.

* `LAST_DOC_ID`

O último ID de documento no qual essa palavra aparece no índice `FULLTEXT`.

* `DOC_COUNT`

O número de strings em que essa palavra aparece no índice `FULLTEXT`. A mesma palavra pode ocorrer várias vezes na tabela de cache, uma vez para cada combinação de valores de `DOC_ID` e `POSITION`.

* `DOC_ID`

O ID do documento da string que contém a palavra. Esse valor pode refletir o valor de uma coluna de ID que você definiu para a tabela subjacente, ou pode ser um valor de sequência gerado por `InnoDB` quando a tabela não contém uma coluna adequada.

* `POSITION`

A posição dessa instância específica da palavra dentro do documento relevante identificada pelo valor `DOC_ID`.

#### Notas

* Esta tabela está vazia inicialmente. Antes de fazer uma consulta, defina o valor da variável de sistema `innodb_ft_aux_table` para o nome (incluindo o nome do banco de dados) da tabela que contém o índice `FULLTEXT`; por exemplo, `test/articles`. O exemplo a seguir demonstra como usar a variável de sistema `innodb_ft_aux_table` para exibir informações sobre um índice `FULLTEXT` para uma tabela especificada. Antes que as informações das strings recém-inseridas apareçam em `INNODB_FT_INDEX_TABLE`, o cache do índice `FULLTEXT` deve ser apagado no disco. Isso é feito executando uma operação `OPTIMIZE TABLE` na tabela indexada com a variável de sistema `innodb_optimize_fulltext_only` habilitada. (O exemplo desabilita essa variável novamente no final, porque é destinado a ser habilitada apenas temporariamente.)

  ```sql
  mysql> USE test;

  mysql> CREATE TABLE articles (
           id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
           title VARCHAR(200),
           body TEXT,
           FULLTEXT (title,body)
         ) ENGINE=InnoDB;

  mysql> INSERT INTO articles (title,body) VALUES
         ('MySQL Tutorial','DBMS stands for DataBase ...'),
         ('How To Use MySQL Well','After you went through a ...'),
         ('Optimizing MySQL','In this tutorial we show ...'),
         ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
         ('MySQL vs. YourSQL','In the following database comparison ...'),
         ('MySQL Security','When configured properly, MySQL ...');

  mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

  mysql> OPTIMIZE TABLE articles;
  +---------------+----------+----------+----------+
  | Table         | Op       | Msg_type | Msg_text |
  +---------------+----------+----------+----------+
  | test.articles | optimize | status   | OK       |
  +---------------+----------+----------+----------+

  mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';

  mysql> SELECT WORD, DOC_COUNT, DOC_ID, POSITION
         FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
  +------------+-----------+--------+----------+
  | WORD       | DOC_COUNT | DOC_ID | POSITION |
  +------------+-----------+--------+----------+
  | 1001       |         1 |      4 |        0 |
  | after      |         1 |      2 |       22 |
  | comparison |         1 |      5 |       44 |
  | configured |         1 |      6 |       20 |
  | database   |         2 |      1 |       31 |
  +------------+-----------+--------+----------+

  mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
  ```

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para mais informações sobre a pesquisa de `InnoDB` `FULLTEXT`, consulte a Seção 14.6.2.4, “Indeksos de Texto Completo InnoDB”, e a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

### 24.4.14 A tabela INFORMATION\_SCHEMA INNODB\_LOCKS

A tabela `INNODB_LOCKS` fornece informações sobre cada bloqueio que uma transação `InnoDB` solicitou, mas ainda não adquiriu, e sobre cada bloqueio que uma transação mantém e que está bloqueando outra transação.

Nota

Essa tabela é descontinuada a partir do MySQL 5.7.14 e é removida no MySQL 8.0.

A tabela `INNODB_LOCKS` tem essas colunas:

* `LOCK_ID`

Um número de identificação de bloqueio único, interno a `InnoDB`. Trate-o como uma string opaca. Embora `LOCK_ID` atualmente contenha `TRX_ID`, o formato dos dados em `LOCK_ID` está sujeito a alterações a qualquer momento. Não escreva aplicativos que partam o valor do `LOCK_ID`.

* `LOCK_TRX_ID`

O ID da transação que contém o bloqueio. Para obter detalhes sobre a transação, combine esta coluna com a coluna `TRX_ID` da tabela `INNODB_TRX`.

* `LOCK_MODE`

Como o bloqueio é solicitado. Os descritores de modo de bloqueio permitidos são `S`, `X`, `IS`, `IX`, `GAP`, `AUTO_INC` e `UNKNOWN`. Os descritores de modo de bloqueio podem ser usados em combinação para identificar modos de bloqueio específicos. Para informações sobre os modos de bloqueio `InnoDB`, consulte a Seção 14.7.1, “Bloqueio InnoDB”.

* `LOCK_TYPE`

O tipo de bloqueio. Os valores permitidos são `RECORD` para um bloqueio de nível de string, `TABLE` para um bloqueio de nível de tabela.

* `LOCK_TABLE`

O nome da tabela que foi bloqueada ou contém registros bloqueados.

* `LOCK_INDEX`

O nome do índice, se `LOCK_TYPE` é `RECORD`, caso contrário `NULL`.

* `LOCK_SPACE`

O ID do espaço de tabela do registro bloqueado, se `LOCK_TYPE` é `RECORD`; caso contrário, `NULL`.

* `LOCK_PAGE`

O número da página do registro bloqueado, se `LOCK_TYPE` é `RECORD`; caso contrário, `NULL`.

* `LOCK_REC`

O número de pilha do registro bloqueado dentro da página, se `LOCK_TYPE` é `RECORD`; caso contrário, `NULL`.

* `LOCK_DATA`

Os dados associados ao bloqueio, se houver. Um valor é exibido se o `LOCK_TYPE` for `RECORD`, caso contrário, o valor é `NULL`. Os valores da chave primária do registro bloqueado são exibidos para um bloqueio colocado no índice da chave primária. Os valores do índice secundário do registro bloqueado são exibidos para um bloqueio colocado em um índice secundário único. Os valores do índice secundário são exibidos com os valores da chave primária anexados se o índice secundário não for único. Se não houver chave primária, o `LOCK_DATA` exibe os valores da chave de um índice único selecionado ou o número único de ID de string interno `InnoDB`, de acordo com as regras que regem o uso do índice agrupado `InnoDB` (ver Seção 14.6.2.1, “Indizes Agrupados e Secundários”). O `LOCK_DATA` relata “pseudo-registro supremo” para um bloqueio tomado em um pseudo-registro supremo. Se a página contendo o registro bloqueado não estiver na piscina de buffer porque foi escrita no disco enquanto o bloqueio estava sendo mantido, o `InnoDB` não busca a página no disco. Em vez disso, o `LOCK_DATA` relata `NULL`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS\G
*************************** 1. row ***************************
    lock_id: 3723:72:3:2
lock_trx_id: 3723
  lock_mode: X
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
*************************** 2. row ***************************
    lock_id: 3722:72:3:2
lock_trx_id: 3722
  lock_mode: S
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem em períodos de carga concorrente intensa. Seu conteúdo é atualizado conforme descrito na Seção 14.16.2.3, "Persistência e Consistência das Informações de Transação e de Acionamento do InnoDB".

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações sobre uso, consulte a Seção 14.16.2.1, “Usando informações de transação e bloqueio do InnoDB”.

### 24.4.15 A tabela INFORMATION\_SCHEMA INNODB\_LOCK\_WAITS

A tabela `INNODB_LOCK_WAITS` contém uma ou mais strings para cada transação bloqueada `InnoDB`, indicando o bloqueio que ela solicitou e quaisquer bloqueios que estão bloqueando essa solicitação.

Nota

Essa tabela é descontinuada a partir do MySQL 5.7.14 e é removida no MySQL 8.0.

A tabela `INNODB_LOCK_WAITS` tem essas colunas:

* `REQUESTING_TRX_ID`

O ID da transação solicitante (bloqueada).

* `REQUESTED_LOCK_ID`

O ID do bloqueio para o qual uma transação está aguardando. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `LOCK_ID` da tabela `INNODB_LOCKS`.

* `BLOCKING_TRX_ID`

O ID da transação que está sendo bloqueada.

* `BLOCKING_LOCK_ID`

O ID de um bloqueio que impede outra transação de prosseguir. Para obter detalhes sobre o bloqueio, juntem esta coluna com a coluna `LOCK_ID` da tabela `INNODB_LOCKS`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS\G
*************************** 1. row ***************************
requesting_trx_id: 3396
requested_lock_id: 3396:91:3:2
  blocking_trx_id: 3395
 blocking_lock_id: 3395:91:3:2
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem em períodos de carga concorrente intensa. Seu conteúdo é atualizado conforme descrito na Seção 14.16.2.3, "Persistência e Consistência das Informações de Transação e de Acionamento do InnoDB".

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Para informações sobre uso, consulte a Seção 14.16.2.1, “Usando informações de transação e bloqueio do InnoDB”.

### 24.4.16 A tabela INFORMATION\_SCHEMA INNODB\_METRICS

A tabela `INNODB_METRICS` fornece uma ampla variedade de informações de desempenho `InnoDB`, complementando as áreas de foco específicas das tabelas do Schema de Desempenho para `InnoDB`. Com consultas simples, você pode verificar a saúde geral do sistema. Com consultas mais detalhadas, você pode diagnosticar problemas como gargalos de desempenho, escassez de recursos e problemas de aplicativos.

Cada monitor representa um ponto dentro do código-fonte `InnoDB` que é instrumentado para coletar informações de contagem. Cada contador pode ser iniciado, parado e redefinido. Você também pode realizar essas ações para um grupo de contadores usando seu nome de módulo comum.

Por padrão, são coletados relativamente poucos dados. Para começar, parar e reiniciar contadores, defina uma das variáveis do sistema `innodb_monitor_enable`, `innodb_monitor_disable`, `innodb_monitor_reset` ou `innodb_monitor_reset_all`, usando o nome do contador, o nome do módulo, uma correspondência de comodínculo para tal nome usando o caractere “%” ou a palavra-chave especial `all`.

Para informações sobre uso, consulte a Seção 14.16.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_METRICS` tem essas colunas:

* `NAME`

Um nome único para o mostrador.

* `SUBSYSTEM`

O aspecto do `InnoDB` ao qual a métrica se aplica.

* `COUNT`

O valor desde que o contador foi habilitado.

* `MAX_COUNT`

O valor máximo desde que o contador foi habilitado.

* `MIN_COUNT`

O valor mínimo desde que o contador foi habilitado.

* `AVG_COUNT`

O valor médio desde que o contador foi habilitado.

* `COUNT_RESET`

O valor de contagem desde que foi redefinido pela última vez. (As colunas `_RESET` atuam como o contador de voltas em um cronômetro: você pode medir a atividade durante algum intervalo de tempo, enquanto os valores acumulados ainda estão disponíveis em `COUNT`, `MAX_COUNT` e assim por diante.)

* `MAX_COUNT_RESET`

O valor máximo de contagem desde que foi redefinido pela última vez.

* `MIN_COUNT_RESET`

O valor mínimo de contagem desde que foi redefinido pela última vez.

* `AVG_COUNT_RESET`

O valor médio do contador desde que foi redefinido pela última vez.

* `TIME_ENABLED`

O horário de início da última sessão.

* `TIME_DISABLED`

O horário da última parada.

* `TIME_ELAPSED`

O tempo decorrido em segundos desde que o contador começou.

* `TIME_RESET`

O horário de data e hora da última reinicialização.

* `STATUS`

Se o contador ainda está em funcionamento (`enabled`) ou parou (`disabled`).

* `TYPE`

Se o item é um contador cumulativo ou mede o valor atual de algum recurso.

* `COMMENT`

A descrição de contrapartida.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME='dml_inserts'\G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 3
      MAX_COUNT: 3
      MIN_COUNT: NULL
      AVG_COUNT: 0.046153846153846156
    COUNT_RESET: 3
MAX_COUNT_RESET: 3
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-12-04 14:18:28
  TIME_DISABLED: NULL
   TIME_ELAPSED: 65
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Os valores do contador de transações `COUNT` podem diferir do número de eventos de transação relatados nas tabelas do Schema de Desempenho `EVENTS_TRANSACTIONS_SUMMARY`. `InnoDB` conta apenas as transações que ele executa, enquanto o Schema de Desempenho coleta eventos para todas as transações não aborridas iniciadas pelo servidor, incluindo transações vazias.

### 24.4.17 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_COLUMNS

A tabela `INNODB_SYS_COLUMNS` fornece metadados sobre as colunas da tabela `InnoDB`, equivalentes às informações da tabela `SYS_COLUMNS` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_COLUMNS` tem essas colunas:

* `TABLE_ID`

Um identificador que representa a tabela associada à coluna; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

O nome da coluna. Esses nomes podem ser maiúsculos ou minúsculos, dependendo da configuração do `lower_case_table_names`. Não há nomes especiais reservados pelo sistema para colunas.

* `POS`

A posição ordinal da coluna na tabela, começando de 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas de modo que a sequência não tenha lacunas. O valor `POS` para uma coluna gerada virtualmente codifica o número de sequência da coluna e a posição ordinal da coluna. Para mais informações, consulte a descrição da coluna `POS` na Seção 24.4.26, “A tabela INFORMATION\_SCHEMA INNODB\_SYS\_VIRTUAL”.

* `MTYPE`

Representa “tipo principal”. Um identificador numérico para o tipo de coluna. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

* `PRTYPE`

O tipo `InnoDB` “preciso”, um valor binário com bits que representam o tipo de dados MySQL, código do conjunto de caracteres e nulidade.

* `LEN`

O comprimento da coluna, por exemplo, 4 para `INT` e 8 para `BIGINT`. Para colunas de caracteres em conjuntos de caracteres multibyte, esse valor de comprimento é o comprimento máximo em bytes necessário para representar uma definição como `VARCHAR(N)`; ou seja, pode ser `2*N`, `3*N` e assim por diante, dependendo da codificação de caracteres.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71\G
*************************** 1. row ***************************
TABLE_ID: 71
    NAME: col1
     POS: 0
   MTYPE: 6
  PRTYPE: 1027
     LEN: 4
*************************** 2. row ***************************
TABLE_ID: 71
    NAME: col2
     POS: 1
   MTYPE: 2
  PRTYPE: 524542
     LEN: 10
*************************** 3. row ***************************
TABLE_ID: 71
    NAME: col3
     POS: 2
   MTYPE: 1
  PRTYPE: 524303
     LEN: 10
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.18 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_DATAFILES

A tabela `INNODB_SYS_DATAFILES` fornece informações sobre o caminho do arquivo de dados para os arquivos por tabela `InnoDB` e espaços de tabela gerais, equivalentes às informações da tabela `SYS_DATAFILES` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário e os espaços de tabela de reversão, se presentes.

A tabela `INNODB_SYS_DATAFILES` tem essas colunas:

* `SPACE`

O ID do espaço de tabela.

* `PATH`

O caminho do arquivo de dados do espaço de tabela. Se um espaço de tabela por tabela for criado em um local fora do diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.19 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_FIELDS

A tabela `INNODB_SYS_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices `InnoDB`, equivalentes às informações da tabela `SYS_FIELDS` do dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_FIELDS` tem essas colunas:

* `INDEX_ID`

Um identificador para o índice associado a este campo chave; o mesmo valor que `INNODB_SYS_INDEXES.INDEX_ID`.

* `NAME`

O nome da coluna original da tabela; o mesmo valor que `INNODB_SYS_COLUMNS.NAME`.

* `POS`

A posição ordinal do campo chave dentro do índice, começando de 0 e incrementando sequencialmente. Quando uma coluna é descartada, as colunas restantes são reordenadas de modo que a sequência não tenha lacunas.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS WHERE INDEX_ID = 117\G
*************************** 1. row ***************************
INDEX_ID: 117
    NAME: col1
     POS: 0
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.20 Tabela INFORMATION\_SCHEMA INNODB\_SYS\_FOREIGN

A tabela `INNODB_SYS_FOREIGN` fornece metadados sobre as chaves estrangeiras `InnoDB`, equivalentes às informações da tabela `SYS_FOREIGN` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_FOREIGN` tem essas colunas:

* `ID`

O nome (não um valor numérico) do índice da chave estrangeira, precedido pelo nome do esquema (banco de dados) (por exemplo, `test/products_fk`).

* `FOR_NAME`

O nome da tabela de crianças nesta relação de chave estrangeira.

* `REF_NAME`

O nome da tabela pai nessa relação de chave estrangeira.

* `N_COLS`

O número de colunas no índice da chave estrangeira.

* `TYPE`

Uma coleção de bits com informações sobre a coluna chave estrangeira, ORed juntos. 0 = `ON DELETE/UPDATE RESTRICT`, 1 = `ON DELETE CASCADE`, 2 = `ON DELETE SET NULL`, 4 = `ON UPDATE CASCADE`, 8 = `ON UPDATE SET NULL`, 16 = `ON DELETE NO ACTION`, 32 = `ON UPDATE NO ACTION`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN\G
*************************** 1. row ***************************
      ID: test/fk1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.21 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_FOREIGN\_COLS

A tabela `INNODB_SYS_FOREIGN_COLS` fornece informações de status sobre as colunas das chaves estrangeiras `InnoDB`, equivalentes às informações da tabela `SYS_FOREIGN_COLS` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_FOREIGN_COLS` tem essas colunas:

* `ID`

O índice de chave estrangeira associado a este campo da chave de índice, usando o mesmo valor que `INNODB_SYS_FOREIGN.ID`.

* `FOR_COL_NAME`

O nome da coluna associada na tabela de filhos.

* `REF_COL_NAME`

O nome da coluna associada na tabela principal.

* `POS`

A posição ordinal deste campo chave dentro do índice de chave estrangeira, começando de 0.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.22 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_INDEXES

A tabela `INNODB_SYS_INDEXES` fornece metadados sobre os índices `InnoDB`, equivalentes às informações da tabela interna `SYS_INDEXES` do dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_INDEXES` tem essas colunas:

* `INDEX_ID`

Um identificador para o índice. Os identificadores do índice são únicos em todas as bases de dados de uma instância.

* `NAME`

O nome do índice. A maioria dos índices criados implicitamente por `InnoDB` tem nomes consistentes, mas os nomes dos índices não são necessariamente únicos. Exemplos: `PRIMARY` para um índice de chave primária, `GEN_CLUST_INDEX` para o índice que representa uma chave primária quando uma não é especificada, e `ID_IND`, `FOR_IND` e `REF_IND` para restrições de chave estrangeira.

* `TABLE_ID`

Um identificador que representa a tabela associada ao índice; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `TYPE`

Um valor numérico derivado de informações de nível de bits que identifica o tipo de índice. 0 = índice secundário não exclusivo; 1 = índice agrupado automaticamente gerado (`GEN_CLUST_INDEX`); 2 = índice não agrupado exclusivo; 3 = índice agrupado; 32 = índice de texto completo; 64 = índice espacial; 128 = índice secundário em uma coluna virtual gerada.

* `N_FIELDS`

O número de colunas na chave do índice. Para os índices `GEN_CLUST_INDEX`, esse valor é 0, pois o índice é criado usando um valor artificial em vez de uma coluna real da tabela.

* `PAGE_NO`

O número de página raiz da árvore de índice B. Para índices de texto completo, a coluna `PAGE_NO` é inutilizada e definida como -1 (`FIL_NULL`) porque o índice de texto completo é organizado em várias árvores B (tabelas auxiliares).

* `SPACE`

Um identificador para o tablespace onde o índice reside. 0 significa o tablespace de `InnoDB` do sistema. Qualquer outro número representa uma tabela criada com um arquivo separado `.ibd` no modo de arquivo por tabela. Este identificador permanece o mesmo após uma declaração `TRUNCATE TABLE`. Como todos os índices de uma tabela residem no mesmo tablespace que a tabela, este valor não é necessariamente único.

* `MERGE_THRESHOLD`

O valor do limite de fusão para páginas de índice. Se a quantidade de dados em uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma string é excluída ou quando uma string é encurtada por uma operação de atualização, `InnoDB` tenta fusão a página de índice com a página de índice vizinha. O valor padrão do limite é 50%. Para mais informações, consulte a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 34\G
*************************** 1. row ***************************
       INDEX_ID: 39
           NAME: GEN_CLUST_INDEX
       TABLE_ID: 34
           TYPE: 1
       N_FIELDS: 0
        PAGE_NO: 3
          SPACE: 23
MERGE_THRESHOLD: 50
*************************** 2. row ***************************
       INDEX_ID: 40
           NAME: i1
       TABLE_ID: 34
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 23
MERGE_THRESHOLD: 50
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.23 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_TABLES

A tabela `INNODB_SYS_TABLES` fornece metadados sobre as tabelas `InnoDB`, equivalentes às informações da tabela `SYS_TABLES` do dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_TABLES` tem essas colunas:

* `TABLE_ID`

Um identificador para a tabela `InnoDB`. Esse valor é único em todos os bancos de dados da instância.

* `NAME`

O nome da tabela, precedido pelo nome do esquema (banco de dados), quando apropriado (por exemplo, `test/t1`). Os nomes dos bancos de dados e das tabelas de usuário estão no mesmo caso em que foram originalmente definidos, possivelmente influenciados pelo ajuste `lower_case_table_names`.

* `FLAG`

Um valor numérico que representa informações de nível de bits sobre o formato da tabela e as características de armazenamento.

* `N_COLS`

O número de colunas na tabela. O número reportado inclui três colunas ocultas que são criadas por `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O número reportado também inclui colunas geradas virtualmente, se houver.

* `SPACE`

Um identificador para o tablespace onde a tabela reside. 0 significa o tablespace de `InnoDB` de sistema. Qualquer outro número representa um tablespace por arquivo ou um tablespace geral. Este identificador permanece o mesmo após uma declaração `TRUNCATE TABLE`. Para tablespace por arquivo, este identificador é único para tabelas em todos os bancos de dados da instância.

* `FILE_FORMAT`

O formato de arquivo da tabela (`Antelope` ou `Barracuda`).

* `ROW_FORMAT`

O formato da string da tabela (`Compact`, `Redundant`, `Dynamic` ou `Compressed`).

* `ZIP_PAGE_SIZE`

O tamanho da página do zip. Aplica-se apenas a tabelas com um formato de string de `Compressed`.

* `SPACE_TYPE`

O tipo de espaço de tabela ao qual a tabela pertence. Os valores possíveis incluem `System` para o espaço de tabela do sistema, `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo. As tabelas atribuídas ao espaço de tabela do sistema usando `CREATE TABLE` ou `ALTER TABLE` `TABLESPACE=innodb_system` têm um `SPACE_TYPE` de `General`. Para mais informações, consulte `CREATE TABLESPACE`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
     TABLE_ID: 214
         NAME: test/t1
         FLAG: 129
       N_COLS: 4
        SPACE: 233
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: General
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.24 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_TABLESPACES

A tabela `INNODB_SYS_TABLESPACES` fornece metadados sobre os espaços de tabela por arquivo `InnoDB` e espaços de tabela gerais, equivalentes às informações da tabela `SYS_TABLESPACES` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário e os espaços de tabela de reversão, se presentes.

A tabela `INNODB_SYS_TABLESPACES` tem essas colunas:

* `SPACE`

O ID do espaço de tabela.

* `NAME`

O esquema (banco de dados) e o nome da tabela.

* `FLAG`

Um valor numérico que representa informações de nível de bits sobre o formato do espaço de tabela e as características de armazenamento.

* `FILE_FORMAT`

O formato do arquivo de tablespace. Por exemplo, Antelope, Barracuda ou `Any` (os espaços de tabelas gerais suportam qualquer formato de string). Os dados neste campo são interpretados a partir das informações das bandeiras do tablespace que residem no arquivo .ibd. Para mais informações sobre os formatos de arquivo `InnoDB`, consulte a Seção 14.10, “Gestão do formato de arquivo InnoDB”.

* `ROW_FORMAT`

O formato da string do tablespace (`Compact or Redundant`, `Dynamic` ou `Compressed`). Os dados nesta coluna são interpretados a partir das informações das bandeiras do tablespace que residem no arquivo `.ibd`.

* `PAGE_SIZE`

O tamanho da página do tablespace. Os dados nesta coluna são interpretados a partir das informações das bandeiras do tablespace que residem no arquivo `.ibd`.

* `ZIP_PAGE_SIZE`

O tamanho da página do tablespace zip. Os dados nesta coluna são interpretados a partir das informações dos indicadores do tablespace que residem no arquivo `.ibd`.

* `SPACE_TYPE`

O tipo de espaço de tabela. Os valores possíveis incluem `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo.

* `FS_BLOCK_SIZE`

O tamanho do bloco do sistema de arquivos, que é o tamanho da unidade usado para perfuração de buracos. Esta coluna se refere ao recurso de compressão de página transparente `InnoDB`.

* `FILE_SIZE`

O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, descompactado. Esta coluna se refere ao recurso de compressão transparente de página `InnoDB`.

* `ALLOCATED_SIZE`

O tamanho real do arquivo, que é a quantidade de espaço alocada no disco. Esta coluna se refere ao recurso de compressão transparente de página `InnoDB`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
   FILE_FORMAT: Antelope
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Como as bandeiras do tablespace são sempre zero para todos os formatos de arquivo Antelope (ao contrário das bandeiras de tabela), não é possível determinar a partir dessa bandeira inteira se o formato de string do tablespace é Redundante ou Compacto. Como resultado, os valores possíveis para o campo `ROW_FORMAT` são “Compacto ou Redundante”, “Compressão” ou “Dinâmico”.

* Com a introdução de tabelas gerais, os dados dos espaços de tabela do sistema `InnoDB` (para o ESPAÇO 0) são expostos em `INNODB_SYS_TABLESPACES`.

### 24.4.25 A visão INFORMATION\_SCHEMA INNODB\_SYS\_TABLESTATS

A tabela `INNODB_SYS_TABLESTATS` fornece uma visão de informações de status de baixo nível sobre as tabelas `InnoDB`. Esses dados são usados pelo otimizador do MySQL para calcular qual índice usar ao fazer uma consulta a uma tabela `InnoDB`. Essas informações são derivadas de estruturas de dados de memória em vez de dados armazenados em disco. Não há uma tabela interna correspondente do sistema `InnoDB`.

As tabelas `InnoDB` são representadas nesta visualização se elas tiverem sido abertas desde o último reinício do servidor e não tiverem expirado do cache da tabela. As tabelas para as quais estatísticas persistentes estão disponíveis são sempre representadas nesta visualização.

As estatísticas da tabela são atualizadas apenas para operações `DELETE` ou `UPDATE` que modificam colunas indexadas. As estatísticas não são atualizadas por operações que modificam apenas colunas não indexadas.

`ANALYZE TABLE` limpa as estatísticas da tabela e define a coluna `STATS_INITIALIZED` para `Uninitialized`. As estatísticas são coletadas novamente na próxima vez que a tabela é acessada.

Para informações de uso relacionadas e exemplos, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

A tabela `INNODB_SYS_TABLESTATS` tem essas colunas:

* `TABLE_ID`

Um identificador que representa a tabela para a qual as estatísticas estão disponíveis; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

O nome da tabela; o mesmo valor que `INNODB_SYS_TABLES.NAME`.

* `STATS_INITIALIZED`

O valor é `Initialized` se as estatísticas já forem coletadas, `Uninitialized` se não forem.

* `NUM_ROWS`

O número atual estimado de strings na tabela. Atualizado após cada operação DML. O valor pode ser impreciso se transações não confirmadas estão inserindo ou excluindo da tabela.

* `CLUST_INDEX_SIZE`

O número de páginas no disco que armazenam o índice agrupado, que contém os dados da tabela `InnoDB` na ordem da chave primária. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

* `OTHER_INDEX_SIZE`

O número de páginas no disco que armazenam todos os índices secundários da tabela. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

* `MODIFIED_COUNTER`

O número de strings modificadas por operações de DML, como `INSERT`, `UPDATE`, `DELETE`, e também operações de cascata a partir de chaves estrangeiras. Esta coluna é redefinida cada vez que as estatísticas da tabela são recalculadas

* `AUTOINC`

O próximo número a ser emitido para qualquer operação baseada em autoincremento. A taxa em que o valor `AUTOINC` muda depende de quantas vezes os números de autoincremento foram solicitados e quantos números são concedidos por solicitação.

* `REF_COUNT`

Quando esse contador atingir zero, os metadados da tabela podem ser expulsos do cache da tabela.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71\G
*************************** 1. row ***************************
         TABLE_ID: 71
             NAME: test/t1
STATS_INITIALIZED: Initialized
         NUM_ROWS: 1
 CLUST_INDEX_SIZE: 1
 OTHER_INDEX_SIZE: 0
 MODIFIED_COUNTER: 1
          AUTOINC: 0
        REF_COUNT: 1
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de desempenho de nível de especialista, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.26 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_VIRTUAL

A tabela `INNODB_SYS_VIRTUAL` fornece metadados sobre as colunas virtuais geradas pelo `InnoDB` e as colunas nas quais as colunas geradas virtualmente são baseadas, equivalentes às informações da tabela `SYS_VIRTUAL` no dicionário de dados `InnoDB`.

Uma string aparece na tabela `INNODB_SYS_VIRTUAL` para cada coluna sobre a qual uma coluna virtual gerada é baseada.

A tabela `INNODB_SYS_VIRTUAL` tem essas colunas:

* `TABLE_ID`

Um identificador que representa a tabela associada à coluna virtual; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `POS`

O valor da posição da coluna gerada virtualmente. O valor é grande porque codifica o número de sequência da coluna e a posição ordinal. A fórmula usada para calcular o valor utiliza uma operação bit a bit:

  ```sql
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

Por exemplo, se a primeira coluna virtual gerada na instância `InnoDB` for a terceira coluna da tabela, a fórmula é `(0 + 1) << 16) + 2`. A primeira coluna virtual gerada na instância `InnoDB` é sempre o número 0. Como a terceira coluna na tabela, a posição ordinal da coluna gerada virtual é 2. As posições ordenadas são contadas a partir de 0.

* `BASE_POS`

A posição ordinal das colunas sobre as quais uma coluna gerada virtual é baseada.

#### Exemplo

```sql
mysql> CREATE TABLE `t1` (
         `a` int(11) DEFAULT NULL,
         `b` int(11) DEFAULT NULL,
         `c` int(11) GENERATED ALWAYS AS (a+b) VIRTUAL,
         `h` varchar(10) DEFAULT NULL
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_VIRTUAL
       WHERE TABLE_ID IN
         (SELECT TABLE_ID FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE "test/t1");
+----------+-------+----------+
| TABLE_ID | POS   | BASE_POS |
+----------+-------+----------+
|       95 | 65538 |        0 |
|       95 | 65538 |        1 |
+----------+-------+----------+
```

#### Notas

* Se um valor constante for atribuído a uma coluna gerada virtualmente, como na tabela a seguir, uma entrada para a coluna não aparece na tabela [[`INNODB_SYS_VIRTUAL`]. Para que uma entrada apareça, uma coluna gerada virtualmente deve ter uma coluna base.

  ```sql
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

No entanto, os metadados para uma coluna desse tipo aparecem na tabela `INNODB_SYS_COLUMNS`.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.27 A tabela de informações INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO

A tabela `INNODB_TEMP_TABLE_INFO` fornece informações sobre as tabelas temporárias criadas pelo usuário `InnoDB` que estão ativas em uma instância `InnoDB`. Não fornece informações sobre as tabelas temporárias internas `InnoDB` usadas pelo otimizador. A tabela `INNODB_TEMP_TABLE_INFO` é criada quando a consulta é feita pela primeira vez, existe apenas na memória e não é persistida no disco.

Para informações de uso e exemplos, consulte a Seção 14.16.7, “Tabela de informações temporárias da InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_TEMP_TABLE_INFO` tem essas colunas:

* `TABLE_ID`

O ID da tabela temporária.

* `NAME`

O nome da tabela temporária.

* `N_COLS`

O número de colunas na tabela temporária. O número inclui três colunas ocultas criadas por `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`).

* `SPACE`

O ID do espaço de tabelas temporário onde a tabela temporária reside. Em 5.7, as tabelas temporárias não comprimidas `InnoDB` residem em um espaço de tabelas temporário compartilhado. O arquivo de dados para o espaço de tabelas temporário compartilhado é definido pela variável de sistema `innodb_temp_data_file_path`. Por padrão, há um único arquivo de dados para o espaço de tabelas temporárias compartilhado com o nome `ibtmp1`, que está localizado no diretório de dados. As tabelas temporárias comprimidas residem em espaços de tabelas separados por arquivo localizados no diretório de arquivos temporários definido por `tmpdir`. O ID do espaço de tabelas temporário é um valor não nulo que é gerado dinamicamente na reinicialização do servidor.

* `PER_TABLE_TABLESPACE`

Um valor de `TRUE` indica que a tabela temporária reside em um espaço de tabela separado por arquivo. Um valor de `FALSE` indica que a tabela temporária reside no espaço de tabelas temporárias compartilhado.

* `IS_COMPRESSED`

Um valor de `TRUE` indica que a tabela temporária está comprimida.

#### Exemplo

```sql
mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
*************************** 1. row ***************************
            TABLE_ID: 38
                NAME: #sql26cf_6_0
              N_COLS: 4
               SPACE: 52
PER_TABLE_TABLESPACE: FALSE
       IS_COMPRESSED: FALSE
```

#### Notas

* Essa tabela é útil principalmente para monitoramento de nível de especialista. * Você deve ter o privilégio `PROCESS` para consultar essa tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 24.4.28 A tabela INFORMATION\_SCHEMA INNODB\_TRX

A tabela `INNODB_TRX` fornece informações sobre cada transação que está sendo executada atualmente dentro de `InnoDB`, incluindo se a transação está aguardando uma bloqueio, quando a transação começou e a declaração SQL que a transação está executando, se houver.

Para informações sobre uso, consulte a Seção 14.16.2.1, “Usando informações de transação e bloqueio do InnoDB”.

A tabela `INNODB_TRX` tem essas colunas:

* `TRX_ID`

Um número de identificação de transação única, interno a `InnoDB`. Esses IDs não são criados para transações que são apenas de leitura e não bloqueáveis. Para detalhes, consulte a Seção 8.5.3, “Otimizando Transações de Leitura Apenas de InnoDB”.

* `TRX_WEIGHT`

O peso de uma transação, que reflete (mas não necessariamente o número exato) do número de strings alteradas e o número de strings bloqueadas pela transação. Para resolver um impasse, `InnoDB` seleciona a transação com o menor peso como a “vítima” para ser revertida. As transações que alteraram tabelas não transacionais são consideradas mais pesadas do que outras, independentemente do número de strings alteradas e bloqueadas.

* `TRX_STATE`

O estado da execução da transação. Os valores permitidos são `RUNNING`, `LOCK WAIT`, `ROLLING BACK` e `COMMITTING`.

* `TRX_STARTED`

O horário de início da transação.

* `TRX_REQUESTED_LOCK_ID`

O ID do bloqueio para o qual a transação está atualmente aguardando, se `TRX_STATE` é `LOCK WAIT`; caso contrário, `NULL`. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `LOCK_ID` da tabela `INNODB_LOCKS`.

* `TRX_WAIT_STARTED`

O tempo em que a transação começou a esperar na posição de bloqueio, se `TRX_STATE` é `LOCK WAIT`; caso contrário, `NULL`.

* `TRX_MYSQL_THREAD_ID`

O ID do thread do MySQL. Para obter detalhes sobre o thread, juntem esta coluna com a coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, mas veja a Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Acionamento do InnoDB”.

* `TRX_QUERY`

A declaração SQL que está sendo executada pela transação.

* `TRX_OPERATION_STATE`

A operação atual da transação, se houver; caso contrário, `NULL`.

* `TRX_TABLES_IN_USE`

O número de tabelas `InnoDB` utilizadas durante o processamento da declaração SQL atual desta transação.

* `TRX_TABLES_LOCKED`

O número de tabelas `InnoDB` que a declaração SQL atual tem bloqueios de string. (Como esses são bloqueios de string, e não de tabela, as tabelas geralmente ainda podem ser lidas e escritas por várias transações, apesar de algumas strings estarem bloqueadas.)

* `TRX_LOCK_STRUCTS`

O número de bloqueios reservados pela transação.

* `TRX_LOCK_MEMORY_BYTES`

O tamanho total ocupado pelas estruturas de bloqueio desta transação na memória.

* `TRX_ROWS_LOCKED`

O número aproximado de strings bloqueadas por essa transação. O valor pode incluir strings marcadas para exclusão que estão fisicamente presentes, mas não são visíveis para a transação.

* `TRX_ROWS_MODIFIED`

O número de strings modificadas e inseridas nesta transação.

* `TRX_CONCURRENCY_TICKETS`

Um valor que indica quanto trabalho a transação atual pode realizar antes de ser substituída, conforme especificado pela variável de sistema `innodb_concurrency_tickets`.

* `TRX_ISOLATION_LEVEL`

O nível de isolamento da transação atual.

* `TRX_UNIQUE_CHECKS`

Se os verificações únicas estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem ser desativadas durante uma carga de dados em massa.

* `TRX_FOREIGN_KEY_CHECKS`

Se as verificações de chave estrangeira estão ativadas ou desativadas para a transação atual. Por exemplo, elas podem ser desativadas durante uma carga de dados em massa.

* `TRX_LAST_FOREIGN_KEY_ERROR`

A mensagem de erro detalhada para o último erro de chave estrangeira, se houver; caso contrário, `NULL`.

* `TRX_ADAPTIVE_HASH_LATCHED`

Se o índice de hash adaptável está bloqueado pela transação atual. Quando o sistema de busca de índice de hash adaptável é particionado, uma única transação não bloqueia o índice de hash adaptável inteiro. A partição do índice de hash adaptável é controlada por `innodb_adaptive_hash_index_parts`, que é definida como 8 por padrão.

* `TRX_ADAPTIVE_HASH_TIMEOUT`

Descontinuado no MySQL 5.7.8. Sempre retorna 0.

Se deve abandonar imediatamente o gatilho de busca para o índice de hash adaptável ou reservá-lo em todas as chamadas do MySQL. Quando não há concorrência de índice de hash adaptável, esse valor permanece zero e as declarações reservam o gatilho até que terminem. Durante períodos de concorrência, ele conta para zero e as declarações liberam o gatilho imediatamente após cada busca de string. Quando o sistema de busca de índice de hash adaptável é particionado (controlado por `innodb_adaptive_hash_index_parts`), o valor permanece 0.

* `TRX_IS_READ_ONLY`

Um valor de 1 indica que a transação é apenas de leitura.

* `TRX_AUTOCOMMIT_NON_LOCKING`

Um valor de 1 indica que a transação é uma declaração `SELECT` que não utiliza as cláusulas `FOR UPDATE` ou `LOCK IN SHARED MODE`, e está sendo executada com `autocommit` habilitado, de modo que a transação contenha apenas essa declaração. Quando essa coluna e `TRX_IS_READ_ONLY` estão ambos em 1, `InnoDB` otimiza a transação para reduzir o overhead associado às transações que alteram dados de tabela.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TRX\G
*************************** 1. row ***************************
                    trx_id: 1510
                 trx_state: RUNNING
               trx_started: 2014-11-19 13:24:40
     trx_requested_lock_id: NULL
          trx_wait_started: NULL
                trx_weight: 586739
       trx_mysql_thread_id: 2
                 trx_query: DELETE FROM employees.salaries WHERE salary > 65000
       trx_operation_state: updating or deleting
         trx_tables_in_use: 1
         trx_tables_locked: 1
          trx_lock_structs: 3003
     trx_lock_memory_bytes: 450768
           trx_rows_locked: 1407513
         trx_rows_modified: 583736
   trx_concurrency_tickets: 0
       trx_isolation_level: REPEATABLE READ
         trx_unique_checks: 1
    trx_foreign_key_checks: 1
trx_last_foreign_key_error: NULL
 trx_adaptive_hash_latched: 0
 trx_adaptive_hash_timeout: 10000
          trx_is_read_only: 0
trx_autocommit_non_locking: 0
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem em períodos de carga concorrente intensa. Seu conteúdo é atualizado conforme descrito na Seção 14.16.2.3, "Persistência e Consistência das Informações de Transação e de Acionamento do InnoDB".

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a declaração `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.