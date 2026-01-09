### 28.4.2 Tabela `INFORMATION_SCHEMA_INNODB_BUFFER_PAGE`

A tabela `INNODB_BUFFER_PAGE` fornece informações sobre cada página no pool de buffer do `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.5, “Tabelas do Pool de Buffer do INFORMATION_SCHEMA do InnoDB”.

Aviso

A consulta à tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte esta tabela em um sistema de produção, a menos que esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE` tem as seguintes colunas:

* `POOL_ID`

  O ID do pool de buffer. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffer.

* `BLOCK_ID`

  O ID do bloco do pool de buffer.

* `SPACE`

  O ID do tablespace; o mesmo valor que `INNODB_TABLES.SPACE`.

* `PAGE_NUMBER`

  O número da página.

* `PAGE_TYPE`

  O tipo de página. A tabela a seguir mostra os valores permitidos.

**Tabela 28.4 Valores de `PAGE_TYPE` do INNODB_BUFFER_PAGE**

<table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE.PAGE_TYPE.">
<tr> <td style="width: 30%">Tipo de Página</td> <td>Descrição</td> </tr>
<tr> <td><code>ALLOCATED</code></td> <td>Página recém-aloculada</td> </tr>
<tr> <td><code>BLOB</code></td> <td>Página BLOB não compactada</td> </tr>
<tr> <td><code>COMPRESSED_BLOB2</code></td> <td>Página BLOB compactada subsequente</td> </tr>
<tr> <td><code>COMPRESSED_BLOB</code></td> <td>Página BLOB compactada inicial</td> </tr>
<tr> <td><code>ENCRYPTED_RTREE</code></td> <td>R-tree criptografado</td> </tr>
<tr> <td><code>EXTENT_DESCRIPTOR</code></td> <td>Página descritor de extensão</td> </tr>
<tr> <td><code>FILE_SPACE_HEADER</code></td> <td>Cabeçalho de espaço de arquivo</td> </tr>
<tr> <td><code>FIL_PAGE_TYPE_UNUSED</code></td> <td>Não utilizado</td> </tr>
<tr> <td><code>IBUF_BITMAP</code></td> <td>Bitmap do buffer de inserção</td> </tr>
<tr> <td><code>IBUF_FREE_LIST</code></td> <td>Lista de livre do buffer de inserção</td> </tr>
<tr> <td><code>IBUF_INDEX</code></td> <td>Índice do buffer de inserção</td> </tr>
<tr> <td><code>INDEX</code></td> <td>Núcleo de B-tree</td> </tr>
<tr> <td><code>INODE</code></td> <td>Núcleo de índice</td> </tr>
<tr> <td><code>LOB_DATA</code></td> <td>Dados LOB não compactados</td> </tr>
<tr> <td><code>LOB_FIRST</code></td> <td>Primeira página de dados LOB não compactados</td> </tr>
<tr> <td><code>LOB_INDEX</code></td> <td>Índice de dados LOB não compactados</td> </tr>
<tr> <td><code>PAGE_IO_COMPRESSED</code></td> <td>Página compactada</td> </tr>
<tr> <td><code>PAGE_IO_COMPRESSED_ENCRYPTED</code></td> <td>Página compactada e criptografada</td> </tr>
<tr> <td><code>PAGE_IO_ENCRYPTED</code></td> <td>Página criptografada</td> </tr>
<tr> <td><code>RSEG_ARRAY</code></td> <td>Array de segmento de rollback</td> </tr>
<tr> <td><code>RTREE_INDEX</code></td> <td>Índice de R-tree</td> </tr>
<tr> <td><code>SDI_BLOB</code></td> <td>BLOB SDI não compactado</td> </tr>
<tr> <td><code>SDI_COMPRESSED_BLOB</code></td> <td>BLOB SDI compactado</td> </tr>
<tr> <td><code>SDI_INDEX</code></td> <td>Índice SDI</td> </tr>
<tr> <td><code>SYSTEM</code></td> <td>Página do sistema</td> </tr>
<tr> <td><code>TRX_SYSTEM</code></td> <td>Dados do sistema de transação</td> </tr>
<tr> <td><code>UNDO_LOG</code></td> <td>Página do log de desfazer</td> </tr>
<tr> <td><code>UNKNOWN</code></td> <td>Desconhecido</td> </tr>
<tr> <td><code>ZLOB_DATA</code></td> <td>Dados LOB comprimidos</td> </tr>
<tr> <td><code>ZLOB_FIRST</code></td> <td>Primeira página de dados LOB comprimidos</td> </tr>
<tr> <td><code>ZLOB_FRAG</code></td> <td>Fragmento de dados LOB comprimido</td> </tr>
<tr> <td><code>ZLOB_FRAG_ENTRY</code></td> <td>Índice de entrada de fragmento de dados LOB comprimido</td> </tr>
<tr> <td><code>ZLOB_INDEX</code></td> <td>Índice de dados LOB comprimido</td> </tr>
</tbody></table>

* `FLUSH_TYPE`

  O tipo de esvaziamento.

* `FIX_COUNT`

  O número de threads que estão usando esse bloco dentro do pool de buffers. Quando é zero, o bloco está elegível para ser removido.

* `IS_HASHED`

  Se um índice hash foi construído nesta página.

* `NEWEST_MODIFICATION`

  O Número de Sequência do Log da modificação mais recente.

* `OLDEST_MODIFICATION`

  O Número de Sequência do Log da modificação mais antiga.

* `ACCESS_TIME`

  Um número abstrato usado para julgar o primeiro tempo de acesso da página.

* `TABLE_NAME`

  O nome da tabela a qual a página pertence. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`. A coluna é `NULL` se o servidor ainda não acessou a tabela.

* `INDEX_NAME`

  O nome do índice a qual a página pertence. Isso pode ser o nome de um índice agrupado ou de um índice secundário. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`.

* `NUMBER_RECORDS`

  O número de registros dentro da página.

* `DATA_SIZE`

  A soma dos tamanhos dos registros. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`.

* `COMPRESSED_SIZE`

  O tamanho da página comprimida. `NULL` para páginas que não estão comprimidas.

* `PAGE_STATE`

  O estado da página. A tabela a seguir mostra os valores permitidos.

  **Tabela 28.5 INNODB_BUFFER_PAGE.PAGE_STATE Valores**

<table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE.PAGE_STATE."><thead><tr> <th>Estado da Página</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>FILE_PAGE</code></td> <td>Uma página de arquivo em buffer</td> </tr><tr> <td><code>MEMORY</code></td> <td>Contém um objeto de memória principal</td> </tr><tr> <td><code>NOT_USED</code></td> <td>Na lista de livre</td> </tr><tr> <td><code>NULL</code></td> <td>Páginas limpas comprimidas, páginas comprimidas na lista de varredura, páginas usadas como sentinelas de buffer do pool</td> </tr><tr> <td><code>READY_FOR_USE</code></td> <td>Uma página livre</td> </tr><tr> <td><code>REMOVE_HASH</code></td> <td>O índice de hash deve ser removido antes de ser colocado na lista de livre</td> </tr></tbody></table>

* `IO_FIX`

  Se há algum I/O pendente para esta página: `IO_NONE` = sem I/O pendente, `IO_READ` = I/O de leitura pendente, `IO_WRITE` = I/O de escrita pendente, `IO_PIN` = realocação e remoção do varredor não permitidas.

* `IS_OLD`

  Se o bloco está na sublista de blocos antigos na lista LRU.

* `FREE_PAGE_CLOCK`

  O valor do contador `freed_page_clock` quando o bloco foi o último colocado na cabeça da lista LRU. O contador `freed_page_clock` rastreia o número de blocos removidos do final da lista LRU.

* `IS_STALE`

  Se a página está desatualizada.

#### Exemplo

```
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
           IS_STALE: NO
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de desempenho de nível avançado, ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Quando tabelas, linhas de tabela, partições ou índices são excluídos, as páginas associadas permanecem no pool de buffer até que haja espaço necessário para outros dados. A tabela `INNODB_BUFFER_PAGE` relata informações sobre essas páginas até que sejam expulsas do pool de buffer. Para obter mais informações sobre como o `InnoDB` gerencia os dados do pool de buffer, consulte a Seção 17.5.1, “Pool de Buffer”.