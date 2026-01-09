### 28.4.3 A Tabela `INFORMATION\_SCHEMA\_INNODB\_BUFFER\_PAGE\_LRU`

A tabela `INNODB_BUFFER_PAGE_LRU` fornece informações sobre as páginas no pool de buffer do `InnoDB`; em particular, como elas estão ordenadas na lista LRU que determina quais páginas devem ser removidas do pool de buffer quando ele ficar cheio.

A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, com algumas exceções. Ela tem as colunas `LRU_POSITION` e `COMPRESSED` em vez de `BLOCK_ID` e `PAGE_STATE`, e não inclui a coluna `IS_STALE`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.5, “Tabelas do Pool de Buffer do Schema de Informação InnoDB”.

Aviso

A consulta à tabela `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não consulte essa tabela em um sistema de produção, a menos que esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffer em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE_LRU` tem essas colunas:

* `POOL_ID`

  O ID do pool de buffer. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffer.

* `LRU_POSITION`

  A posição da página na lista LRU.

* `SPACE`

  O ID do tablespace; o mesmo valor que `INNODB_TABLES.SPACE`.

* `PAGE_NUMBER`

  O número da página.

* `PAGE\_TYPE`

  O tipo de página. A tabela a seguir mostra os valores permitidos.

**Tabela 28.6 Valores de `INNODB\_BUFFER\_PAGE\_LRU.PAGE\_TYPE`**

<table summary="Mapeamento para interpretar os valores de INNODB_BUFFER_PAGE_LRU.PAGE_TYPE.">
<col style="width: 30%"/><col style="width: 30%"/>
<thead><tr>
<th>Tipo de Página</th>
<th>Descrição</th>
</tr></thead>
<tbody>
<tr>
<td><code>ALLOCATED</code></td>
<td>Página recém-aloculada</td>
</tr>
<tr>
<td><code>BLOB</code></td>
<td>Página BLOB não compactada</td>
</tr>
<tr>
<td><code>COMPRESSED_BLOB2</code></td>
<td>Página BLOB compactada subsequente</td>
</tr>
<tr>
<td><code>COMPRESSED_BLOB</code></td>
<td>Página BLOB compactada inicial</td>
</tr>
<tr>
<td><code>ENCRYPTED_RTREE</code></td>
<td>R-tree criptografado</td>
</tr>
<tr>
<td><code>EXTENT_DESCRIPTOR</code></td>
<td>Página descritor de extensão</td>
</tr>
<tr>
<td><code>FILE_SPACE_HEADER</code></td>
<td>Cabeçalho de espaço de arquivo</td>
</tr>
<tr>
<td><code>FIL_PAGE_TYPE_UNUSED</code></td>
<td>Não utilizado</td>
</tr>
<tr>
<td><code>IBUF_BITMAP</code></td>
<td>Bitmap do buffer de inserção</td>
</tr>
<tr>
<td><code>IBUF_FREE_LIST</code></td>
<td>Lista de livre do buffer de inserção</td>
</tr>
<tr>
<td><code>IBUF_INDEX</code></td>
<td>Índice do buffer de inserção</td>
</tr>
<tr>
<td><code>INDEX</code></td>
<td>Núcleo de B-tree</td>
</tr>
<tr>
<td><code>INODE</code></td>
<td>Núcleo de índice</td>
</tr>
<tr>
<td><code>LOB_DATA</code></td>
<td>Dados LOB não compactados</td>
</tr>
<tr>
<td><code>LOB_FIRST</code></td>
<td>Primeira página de dados LOB não compactados</td>
</tr>
<tr>
<td><code>LOB_INDEX</code></td>
<td>Índice de dados LOB não compactados</td>
</tr>
<tr>
<td><code>PAGE_IO_COMPRESSED</code></td>
<td>Página compactada</td>
</tr>
<tr>
<td><code>PAGE_IO_COMPRESSED_ENCRYPTED</code></td>
<td>Página compactada e criptografada</td>
</tr>
<tr>
<td><code>PAGE_IO_ENCRYPTED</code></td>
<td>Página criptografada</td>
</tr>
<tr>
<td><code>RSEG_ARRAY</code></td>
<td>Array de segmento de rollback</td>
</tr>
<tr>
<td><code>RTREE_INDEX</code></td>
<td>Índice de R-tree</td>
</tr>
<tr>
<td><code>SDI_BLOB</code></td>
<td>BLOB SDI não compactado</td>
</tr>
<tr>
<td><code>SDI_COMPRESSED_BLOB</code></td>
<td>BLOB SDI compactado</td>
</tr>
<tr>
<td><code>SDI_INDEX</code></td>
<td>Índice SDI</td>
</tr>
<tr>
<td><code>SYSTEM</code></td>
<td>Página do sistema</td>
</tr>
<tr>
<td><code>TRX_SYSTEM</code></td>
<td>Dados do sistema de transação</td>
</tr>
<tr>
<td><code>UNDO_LOG</code></td>
<td>Página do log de desfazer</td>
</tr>
<tr>
<td><code>UNKNOWN</code></td>
<td>Desconhecido</td>
</tr>
<tr>
<td><code>ZLOB_DATA</code></td>
<td>Dados LOB comprimidos</td>
</tr>
<tr>
<td><code>ZLOB_FIRST</code></td>
<td>Primeira página de dados LOB comprimidos</td>
</tr>
<tr>
<td><code>ZLOB_FRAG</code></td>
<td>Fragmento LOB comprimido</td>
</tr>
<tr>
<td><code>ZLOB_FRAG_ENTRY</code></td>
<td>Índice de entrada de fragmento LOB comprimido</td>
</tr>
<tr>
<td><code>ZLOB_INDEX</code></td>
<td>Índice de dados LOB comprimido</td>
</tr>
</tbody></table>

* `FLUSH_TYPE`

  O tipo de flush.

* `FIX_COUNT`

  O número de threads usando esse bloco dentro do pool de buffers. Quando zero, o bloco está elegível para ser removido.

* `IS_HASHED`

  Se um índice hash foi construído nesta página.

* `NEWEST_MODIFICATION`

  O Número de Sequência do Log da modificação mais recente.

* `OLDEST_MODIFICATION`

  O Número de Sequência do Log da modificação mais antiga.

* `ACCESS_TIME`

  Um número abstrato usado para julgar o primeiro tempo de acesso da página.

* `TABLE_NAME`

  O nome da tabela a que a página pertence. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`. A coluna é `NULL` se o servidor ainda não acessou a tabela.

* `INDEX_NAME`

  O nome do índice a que a página pertence. Isso pode ser o nome de um índice agrupado ou um índice secundário. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`.

* `NUMBER_RECORDS`

  O número de registros dentro da página.

* `DATA_SIZE`

  A soma dos tamanhos dos registros. Esta coluna é aplicável apenas a páginas com um valor de `PAGE_TYPE` de `INDEX`.

* `COMPRESSED_SIZE`

  O tamanho da página comprimida. `NULL` para páginas que não estão comprimidas.

* `COMPRESSED`

  Se a página está comprimida.

* `IO_FIX`

  Se há algum I/O pendente para esta página: `IO_NONE` = sem I/O pendente, `IO_READ` = I/O de leitura pendente, `IO_WRITE` = I/O de escrita pendente.

* `IS_OLD`

  Se o bloco está na sublista de blocos antigos na lista LRU.

* `FREE_PAGE_CLOCK`

  O valor do contador `freed_page_clock` quando o bloco foi o último colocado na cabeça da lista LRU. O contador `freed_page_clock` rastreia o número de blocos removidos do final da lista LRU.

#### Exemplo

```
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

* Esta tabela é útil principalmente para monitoramento de desempenho em nível de especialista ou ao desenvolver extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* A consulta a esta tabela pode exigir que o MySQL aloque um grande bloco de memória contínua, mais de 64 bytes vezes o número de páginas ativas no pool de buffer. Essa alocação pode potencialmente causar um erro de falta de memória, especialmente para sistemas com pools de buffer de vários gigabytes.

* A consulta a esta tabela exige que o MySQL bloqueie a estrutura de dados que representa o pool de buffer enquanto navega pela lista LRU, o que pode reduzir a concorrência, especialmente para sistemas com pools de buffer de vários gigabytes.

* Quando tabelas, linhas de tabela, partições ou índices são excluídos, as páginas associadas permanecem no pool de buffer até que espaço seja necessário para outros dados. A tabela `INNODB_BUFFER_PAGE_LRU` relata informações sobre essas páginas até que sejam expulsas do pool de buffer. Para mais informações sobre como o `InnoDB` gerencia os dados do pool de buffer, consulte a Seção 17.5.1, “Pool de Buffer”.