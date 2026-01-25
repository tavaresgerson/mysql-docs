### 24.4.2 A Tabela INNODB_BUFFER_PAGE do INFORMATION_SCHEMA

A tabela [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") fornece informações sobre cada [page](glossary.html#glos_page "page") no [buffer pool](glossary.html#glos_buffer_pool "buffer pool") do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.5, “Tabelas do Buffer Pool do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-buffer-pool-tables.html "14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables").

Aviso

Fazer Querys na tabela [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") pode afetar a performance. Não consulte esta tabela em um sistema de produção a menos que você esteja ciente do impacto na performance e o tenha determinado como aceitável. Para evitar impactar a performance em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do buffer pool em uma instância de teste.

A tabela [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") possui as seguintes colunas:

* `POOL_ID`

  O ID do buffer pool. Este é um identificador para distinguir entre múltiplas instâncias de buffer pool.

* `BLOCK_ID`

  O ID do bloco do buffer pool.

* `SPACE`

  O ID do tablespace; o mesmo valor que `INNODB_SYS_TABLES.SPACE`.

* `PAGE_NUMBER`

  O número da page.

* `PAGE_TYPE`

  O tipo de page. A tabela a seguir mostra os valores permitidos.

  **Tabela 24.4 Valores de INNODB_BUFFER_PAGE.PAGE_TYPE**

  <table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE.PAGE_TYPE."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Tipo de Page</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALLOCATED</code></td> <td>Page recém-alocada</td> </tr><tr> <td><code>BLOB</code></td> <td>Page BLOB não compactada</td> </tr><tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Page BLOB compactada subsequente</td> </tr><tr> <td><code>COMPRESSED_BLOB</code></td> <td>Primeira page BLOB compactada</td> </tr><tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Page descritora de Extent</td> </tr><tr> <td><code>FILE_SPACE_HEADER</code></td> <td>Cabeçalho do espaço do arquivo</td> </tr><tr> <td><code>IBUF_BITMAP</code></td> <td>Bitmap do Insert Buffer</td> </tr><tr> <td><code>IBUF_FREE_LIST</code></td> <td>Lista livre do Insert Buffer</td> </tr><tr> <td><code>IBUF_INDEX</code></td> <td>Index do Insert Buffer</td> </tr><tr> <td><code>INDEX</code></td> <td>Nó da B-tree</td> </tr><tr> <td><code>INODE</code></td> <td>Nó de Index</td> </tr><tr> <td><code>RTREE_INDEX</code></td> <td>Index R-tree</td> </tr><tr> <td><code>SYSTEM</code></td> <td>Page do Sistema</td> </tr><tr> <td><code>TRX_SYSTEM</code></td> <td>Dados do sistema de Transaction</td> </tr><tr> <td><code>UNDO_LOG</code></td> <td>Page de log de Undo</td> </tr><tr> <td><code>UNKNOWN</code></td> <td>Desconhecido</td> </tr> </tbody></table>

* `FLUSH_TYPE`

  O tipo de flush.

* `FIX_COUNT`

  O número de threads usando este bloco dentro do buffer pool. Quando zero, o bloco é elegível para ser despejado (evicted).

* `IS_HASHED`

  Se um hash Index foi construído nesta page.

* `NEWEST_MODIFICATION`

  O Log Sequence Number (LSN) da modificação mais recente (youngest).

* `OLDEST_MODIFICATION`

  O Log Sequence Number (LSN) da modificação mais antiga (oldest).

* `ACCESS_TIME`

  Um número abstrato usado para julgar o tempo do primeiro acesso à page.

* `TABLE_NAME`

  O nome da tabela à qual a page pertence. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` de `INDEX`.

* `INDEX_NAME`

  O nome do Index ao qual a page pertence. Pode ser o nome de um clustered index ou de um secondary index. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` de `INDEX`.

* `NUMBER_RECORDS`

  O número de records dentro da page.

* `DATA_SIZE`

  A soma dos tamanhos dos records. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` de `INDEX`.

* `COMPRESSED_SIZE`

  O tamanho da page compactada. `NULL` para pages que não estão compactadas.

* `PAGE_STATE`

  O estado da page. A tabela a seguir mostra os valores permitidos.

  **Tabela 24.5 Valores de INNODB_BUFFER_PAGE.PAGE_STATE**

  <table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE.PAGE_STATE."><thead><tr> <th>Estado da Page</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>FILE_PAGE</code></td> <td>Uma page de arquivo em buffer</td> </tr><tr> <td><code>MEMORY</code></td> <td>Contém um objeto de memória principal</td> </tr><tr> <td><code>NOT_USED</code></td> <td>Na lista livre</td> </tr><tr> <td><code>NULL</code></td> <td>Pages compactadas limpas, pages compactadas na lista de flush, pages usadas como sentinelas de observação do buffer pool</td> </tr><tr> <td><code>READY_FOR_USE</code></td> <td>Uma page livre</td> </tr><tr> <td><code>REMOVE_HASH</code></td> <td>O hash index deve ser removido antes de ser colocado na lista livre</td> </tr></tbody></table>

* `IO_FIX`

  Se há algum I/O pendente para esta page: `IO_NONE` = sem I/O pendente, `IO_READ` = leitura pendente, `IO_WRITE` = escrita pendente.

* `IS_OLD`

  Se o bloco está na sublista de blocos antigos na lista LRU.

* `FREE_PAGE_CLOCK`

  O valor do contador `freed_page_clock` quando o bloco foi colocado pela última vez no início da lista LRU. O contador `freed_page_clock` rastreia o número de blocos removidos do final da lista LRU.

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

#### Observações

* Esta tabela é útil principalmente para monitoramento de performance em nível de especialista, ou ao desenvolver extensões relacionadas à performance para o MySQL.

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para fazer Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Quando tabelas, linhas de tabelas, partições ou Indexes são excluídos, as pages associadas permanecem no buffer pool até que o espaço seja necessário para outros dados. A tabela [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "24.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") reporta informações sobre essas pages até que sejam despejadas do buffer pool. Para mais informações sobre como o `InnoDB` gerencia os dados do buffer pool, consulte [Seção 14.5.1, “Buffer Pool”](innodb-buffer-pool.html "14.5.1 Buffer Pool").