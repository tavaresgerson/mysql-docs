### 28.4.3 A tabela INFORMATION\_SCHEMA INNODB\_BUFFER\_PAGE\_LRU

A tabela `INNODB_BUFFER_PAGE_LRU` fornece informações sobre as páginas no pool de buffer `InnoDB`; em particular, como elas são ordenadas na lista LRU que determina quais páginas devem ser removidas do pool de buffer quando ele ficar cheio.

A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, com algumas exceções. Ela tem as colunas `LRU_POSITION` e `COMPRESSED` em vez das colunas `BLOCK_ID` e `PAGE_STATE`, e não inclui a coluna `IS_STALE`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.5, “Tabelas do Banco de Armazenamento do InnoDB INFORMATION\_SCHEMA”.

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não consulte essa tabela em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffers em uma instância de teste.

A tabela `INNODB_BUFFER_PAGE_LRU` tem essas colunas:

- `POOL_ID`

  O ID do pool de buffers. Este é um identificador para distinguir entre múltiplas instâncias do pool de buffers.

- `LRU_POSITION`

  A posição da página na lista LRU.

- `SPACE`

  O ID do espaço de tabela; o mesmo valor que `INNODB_TABLES.SPACE`.

- `PAGE_NUMBER`

  O número da página.

- `PAGE_TYPE`

  O tipo de página. A tabela a seguir mostra os valores permitidos.

  **Tabela 28.6 Valores de INNODB\_BUFFER\_PAGE\_LRU.PAGE\_TYPE**

  <table summary="Mapeamento para a interpretação dos valores de INNODB_BUFFER_PAGE_LRU.PAGE_TYPE."><thead><tr> <th>Tipo de página</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>IBUF_INDEX</code>]</td> <td>Página recém-atribuída</td> </tr><tr> <td>[[PH_HTML_CODE_<code>IBUF_INDEX</code>]</td> <td>Página BLOB não compactada</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INODE</code>]</td> <td>Página de comp BLOB subsequente</td> </tr><tr> <td>[[PH_HTML_CODE_<code>LOB_DATA</code>]</td> <td>Primeira página compactada BLOB</td> </tr><tr> <td>[[PH_HTML_CODE_<code>LOB_FIRST</code>]</td> <td>R-tree criptografado</td> </tr><tr> <td>[[PH_HTML_CODE_<code>LOB_INDEX</code>]</td> <td>Página de descrição do alcance</td> </tr><tr> <td>[[PH_HTML_CODE_<code>PAGE_IO_COMPRESSED</code>]</td> <td>Cabeçalho de espaço de arquivo</td> </tr><tr> <td>[[PH_HTML_CODE_<code>PAGE_IO_COMPRESSED_ENCRYPTED</code>]</td> <td>Inexercitado</td> </tr><tr> <td>[[PH_HTML_CODE_<code>PAGE_IO_ENCRYPTED</code>]</td> <td>Insira a bitmap de buffer</td> </tr><tr> <td>[[PH_HTML_CODE_<code>RSEG_ARRAY</code>]</td> <td>Insira a lista de buffers livres</td> </tr><tr> <td>[[<code>IBUF_INDEX</code>]]</td> <td>Insira o índice do buffer</td> </tr><tr> <td>[[<code>BLOB</code><code>IBUF_INDEX</code>]</td> <td>nó de árvore B</td> </tr><tr> <td>[[<code>INODE</code>]]</td> <td>Nó do índice</td> </tr><tr> <td>[[<code>LOB_DATA</code>]]</td> <td>Dados LOB não comprimidos</td> </tr><tr> <td>[[<code>LOB_FIRST</code>]]</td> <td>Primeira página de LOB não compactada</td> </tr><tr> <td>[[<code>LOB_INDEX</code>]]</td> <td>Índice LOB não compactado</td> </tr><tr> <td>[[<code>PAGE_IO_COMPRESSED</code>]]</td> <td>Página compactada</td> </tr><tr> <td>[[<code>PAGE_IO_COMPRESSED_ENCRYPTED</code>]]</td> <td>Página comprimida e criptografada</td> </tr><tr> <td>[[<code>PAGE_IO_ENCRYPTED</code>]]</td> <td>Página criptografada</td> </tr><tr> <td>[[<code>RSEG_ARRAY</code>]]</td> <td>Matriz de segmentos de rollback</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>IBUF_INDEX</code>]</td> <td>Índice R-tree</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>IBUF_INDEX</code>]</td> <td>BLOB SDI não compactado</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>INODE</code>]</td> <td>BLOB SDI comprimido</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>LOB_DATA</code>]</td> <td>Índice SDI</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>LOB_FIRST</code>]</td> <td>Página do sistema</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>LOB_INDEX</code>]</td> <td>Dados do sistema de transações</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>PAGE_IO_COMPRESSED</code>]</td> <td>Desfazer página de log</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>PAGE_IO_COMPRESSED_ENCRYPTED</code>]</td> <td>Desconhecido</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>PAGE_IO_ENCRYPTED</code>]</td> <td>Dados LOB comprimidos</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB2</code><code>RSEG_ARRAY</code>]</td> <td>Primeira página de LOB compactado</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB</code><code>IBUF_INDEX</code>]</td> <td>Fragmento LOB comprimido</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB</code><code>IBUF_INDEX</code>]</td> <td>Índice de fragmento LOB comprimido</td> </tr><tr> <td>[[<code>COMPRESSED_BLOB</code><code>INODE</code>]</td> <td>Índice LOB comprimido</td> </tr></tbody></table>

- `FLUSH_TYPE`

  O tipo de descarga.

- `FIX_COUNT`

  O número de threads que estão usando esse bloco dentro do pool de buffer. Quando é zero, o bloco está apto a ser removido.

- `IS_HASHED`

  Se um índice de hash foi construído nesta página.

- `NEWEST_MODIFICATION`

  O Número de Sequência de Registro da modificação mais recente.

- `OLDEST_MODIFICATION`

  O Número de Sequência de Registro da modificação mais antiga.

- `ACCESS_TIME`

  Um número abstrato usado para julgar o tempo de acesso inicial da página.

- `TABLE_NAME`

  O nome da tabela à qual a página pertence. Esta coluna é aplicável apenas para páginas com um valor `PAGE_TYPE` de `INDEX`. A coluna é `NULL` se o servidor ainda não tiver acessado a tabela.

- `INDEX_NAME`

  O nome do índice ao qual a página pertence. Isso pode ser o nome de um índice agrupado ou de um índice secundário. Esta coluna é aplicável apenas a páginas com um valor `PAGE_TYPE` de `INDEX`.

- `NUMBER_RECORDS`

  O número de registros na página.

- `DATA_SIZE`

  A soma dos tamanhos dos registros. Esta coluna é aplicável apenas para páginas com um valor `PAGE_TYPE` de `INDEX`.

- `COMPRESSED_SIZE`

  O tamanho da página comprimida. `NULL` para páginas que não estão comprimidas.

- `COMPRESSED`

  Se a página está comprimida.

- `IO_FIX`

  Se há algum I/O pendente para esta página: `IO_NONE` = nenhum I/O pendente, `IO_READ` = leitura pendente, `IO_WRITE` = escrita pendente.

- `IS_OLD`

  Se o bloco está na sublista de blocos antigos na lista LRU.

- `FREE_PAGE_CLOCK`

  O valor do contador `freed_page_clock` quando o bloco foi o último colocado na cabeça da lista LRU. O contador `freed_page_clock` acompanha o número de blocos removidos do final da lista LRU.

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

- Esta tabela é útil principalmente para o monitoramento de desempenho em nível de especialista, ou quando se desenvolvem extensões relacionadas ao desempenho para o MySQL.

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- A consulta a essa tabela pode exigir que o MySQL aloque um grande bloco de memória contínua, mais de 64 bytes vezes o número de páginas ativas no pool de buffer. Essa alocação pode potencialmente causar um erro de falta de memória, especialmente para sistemas com pools de buffer de vários gigabytes.

- Para consultar essa tabela, o MySQL precisa bloquear a estrutura de dados que representa o pool de buffers enquanto percorre a lista LRU, o que pode reduzir a concorrência, especialmente para sistemas com pools de buffers de vários gigabytes.

- Quando tabelas, linhas de tabela, partições ou índices são excluídos, as páginas associadas permanecem no pool de buffer até que haja espaço necessário para outros dados. A tabela `INNODB_BUFFER_PAGE_LRU` relata informações sobre essas páginas até que sejam expulsas do pool de buffer. Para obter mais informações sobre como o `InnoDB` gerencia os dados do pool de buffer, consulte a Seção 17.5.1, “Pool de Buffer”.
