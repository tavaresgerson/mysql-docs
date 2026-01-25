### 24.4.3 A Tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU

A tabela `INNODB_BUFFER_PAGE_LRU` fornece informações sobre as pages no `Buffer Pool` do `InnoDB`; em particular, como elas são ordenadas na lista LRU (Least Recently Used) que determina quais pages devem ser evict (expulsas) do `Buffer Pool` quando ele fica cheio.

A tabela `INNODB_BUFFER_PAGE_LRU` possui as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, exceto que a tabela `INNODB_BUFFER_PAGE_LRU` tem as colunas `LRU_POSITION` e `COMPRESSED` em vez das colunas `BLOCK_ID` e `PAGE_STATE`.

Para informações e exemplos de uso relacionados, consulte [Seção 14.16.5, “Tabelas do Buffer Pool do INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-buffer-pool-tables.html "14.16.5 InnoDB INFORMATION_SCHEMA Buffer Pool Tables").

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE_LRU` pode afetar o performance. Não consulte esta tabela em um sistema de produção a menos que você esteja ciente do impacto no performance e o tenha determinado como aceitável. Para evitar impactar o performance em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do `Buffer Pool` em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE_LRU` possui as seguintes colunas:

* `POOL_ID`

  O ID do `Buffer Pool`. Este é um identificador para distinguir entre múltiplas instâncias do `Buffer Pool`.

* `LRU_POSITION`

  A posição da page na lista LRU.

* `SPACE`

  O ID do `tablespace`; o mesmo valor que `INNODB_SYS_TABLES.SPACE`.

* `PAGE_NUMBER`

  O número da page.

* `PAGE_TYPE`

  O tipo da page. A tabela a seguir mostra os valores permitidos.

  **Tabela 24.6 Valores de INNODB_BUFFER_PAGE_LRU.PAGE_TYPE**

  <table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE_LRU.PAGE_TYPE."><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Tipo de Page</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>`ALLOCATED`</td> <td>Page recém-alocada</td> </tr><tr> <td>`BLOB`</td> <td>Page BLOB não comprimida</td> </tr><tr> <td>`COMPRESSED_BLOB2`</td> <td>Page BLOB comprimida subsequente</td> </tr><tr> <td>`COMPRESSED_BLOB`</td> <td>Primeira page BLOB comprimida</td> </tr><tr> <td>`EXTENT_DESCRIPTOR`</td> <td>Page descritora de Extent</td> </tr><tr> <td>`FILE_SPACE_HEADER`</td> <td>Cabeçalho de espaço de arquivo</td> </tr><tr> <td>`IBUF_BITMAP`</td> <td>Bitmap do Insert Buffer</td> </tr><tr> <td>`IBUF_FREE_LIST`</td> <td>Lista livre do Insert Buffer</td> </tr><tr> <td>`IBUF_INDEX`</td> <td>Index do Insert Buffer</td> </tr><tr> <td>`INDEX`</td> <td>Nó de B-tree</td> </tr><tr> <td>`INODE`</td> <td>Nó de Index</td> </tr><tr> <td>`RTREE_INDEX`</td> <td>Index R-tree</td> </tr><tr> <td>`SYSTEM`</td> <td>Page do Sistema</td> </tr><tr> <td>`TRX_SYSTEM`</td> <td>Dados do sistema de Transaction</td> </tr><tr> <td>`UNDO_LOG`</td> <td>Page de log de Undo</td> </tr><tr> <td>`UNKNOWN`</td> <td>Desconhecido</td> </tr></tbody></table>

* `FLUSH_TYPE`

  O tipo de flush.

* `FIX_COUNT`

  O número de `Threads` usando este `block` dentro do `Buffer Pool`. Quando zero, o `block` é elegível para ser evict (expulso).

* `IS_HASHED`

  Indica se um `hash index` foi construído nesta page.

* `NEWEST_MODIFICATION`

  O Log Sequence Number da modificação mais recente.

* `OLDEST_MODIFICATION`

  O Log Sequence Number da modificação mais antiga.

* `ACCESS_TIME`

  Um número abstrato usado para avaliar o tempo do primeiro acesso à page.

* `TABLE_NAME`

  O nome da tabela à qual a page pertence. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` igual a `INDEX`.

* `INDEX_NAME`

  O nome do `Index` ao qual a page pertence. Este pode ser o nome de um `Index` clusterizado ou um `Index` secundário. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` igual a `INDEX`.

* `NUMBER_RECORDS`

  O número de registros dentro da page.

* `DATA_SIZE`

  A soma dos tamanhos dos registros. Esta coluna é aplicável apenas a pages com um valor `PAGE_TYPE` igual a `INDEX`.

* `COMPRESSED_SIZE`

  O tamanho da page comprimida. `NULL` para pages que não estão comprimidas.

* `COMPRESSED`

  Indica se a page está comprimida.

* `IO_FIX`

  Indica se há algum I/O pendente para esta page: `IO_NONE` = nenhum I/O pendente, `IO_READ` = leitura pendente, `IO_WRITE` = escrita pendente.

* `IS_OLD`

  Indica se o `block` está na sublista de `blocks` antigos na lista LRU.

* `FREE_PAGE_CLOCK`

  O valor do contador `freed_page_clock` quando o `block` foi colocado pela última vez no topo da lista LRU. O contador `freed_page_clock` rastreia o número de `blocks` removidos do final da lista LRU.

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

* Esta tabela é útil principalmente para monitoramento de performance em nível de especialista, ou ao desenvolver extensões relacionadas a performance para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Consultar esta tabela pode exigir que o MySQL aloque um grande `block` de memória contígua, mais de 64 bytes vezes o número de pages ativas no `Buffer Pool`. Essa alocação pode potencialmente causar um erro de falta de memória (`out-of-memory`), especialmente para sistemas com `Buffer Pools` de múltiplos gigabytes.

* Consultar esta tabela exige que o MySQL bloqueie a estrutura de dados que representa o `Buffer Pool` enquanto percorre a lista LRU, o que pode reduzir a concorrência, especialmente em sistemas com `Buffer Pools` de múltiplos gigabytes.

* Quando tabelas, linhas de tabela, partitions ou `Indexes` são excluídos, as pages associadas permanecem no `Buffer Pool` até que o espaço seja necessário para outros dados. A tabela `INNODB_BUFFER_PAGE_LRU` relata informações sobre essas pages até que sejam evict (expulsas) do `Buffer Pool`. Para mais informações sobre como o `InnoDB` gerencia os dados do `Buffer Pool`, consulte [Seção 14.5.1, “Buffer Pool”](innodb-buffer-pool.html "14.5.1 Buffer Pool").