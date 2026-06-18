#### 29.12.13.1 Tabela data\_locks

A tabela `data_locks` mostra as bloqueadoras e as solicitações de bloqueio de dados. Para obter informações sobre quais solicitações de bloqueio são bloqueadas por quais bloqueio de dados, consulte a Seção 29.12.13.2, “A tabela data\_lock\_waits”.

Informações sobre bloqueio de dados de exemplo:

```
mysql> SELECT * FROM performance_schema.data_locks\G
*************************** 1. row ***************************
               ENGINE: INNODB
       ENGINE_LOCK_ID: 139664434886512:1059:139664350547912
ENGINE_TRANSACTION_ID: 2569
            THREAD_ID: 46
             EVENT_ID: 12
        OBJECT_SCHEMA: test
          OBJECT_NAME: t1
       PARTITION_NAME: NULL
    SUBPARTITION_NAME: NULL
           INDEX_NAME: NULL
OBJECT_INSTANCE_BEGIN: 139664350547912
            LOCK_TYPE: TABLE
            LOCK_MODE: IX
          LOCK_STATUS: GRANTED
            LOCK_DATA: NULL
*************************** 2. row ***************************
               ENGINE: INNODB
       ENGINE_LOCK_ID: 139664434886512:2:4:1:139664350544872
ENGINE_TRANSACTION_ID: 2569
            THREAD_ID: 46
             EVENT_ID: 12
        OBJECT_SCHEMA: test
          OBJECT_NAME: t1
       PARTITION_NAME: NULL
    SUBPARTITION_NAME: NULL
           INDEX_NAME: GEN_CLUST_INDEX
OBJECT_INSTANCE_BEGIN: 139664350544872
            LOCK_TYPE: RECORD
            LOCK_MODE: X
          LOCK_STATUS: GRANTED
            LOCK_DATA: supremum pseudo-record
```

Ao contrário da maioria das coleções de dados do Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis do sistema para controlar o tamanho das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, então não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlam sua coleta.

Use a tabela `data_locks` para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Para `InnoDB`, consulte a discussão sobre este tópico na Seção 17.15.2, “Informações de Transações e Bloqueio do Schema de Informações InnoDB”.

A tabela `data_locks` tem essas colunas:

- `ENGINE`

  O mecanismo de armazenamento que mantém ou solicitou o bloqueio.

- `ENGINE_LOCK_ID`

  O ID do bloqueio mantido ou solicitado pelo motor de armazenamento. Os tuplos de valores (`ENGINE_LOCK_ID`, `ENGINE`) são únicos.

  Os formatos de ID de bloqueio são internos e estão sujeitos a alterações a qualquer momento. As aplicações não devem depender de ID de bloqueio com um formato específico.

- `ENGINE_TRANSACTION_ID`

  O ID interno do motor de armazenamento da transação que solicitou o bloqueio. Isso pode ser considerado o proprietário do bloqueio, embora o bloqueio ainda possa estar pendente e não tenha sido concedido ainda (`LOCK_STATUS='WAITING'`).

  Se a transação ainda não tiver realizado nenhuma operação de escrita (ainda considerada apenas de leitura), a coluna contém dados internos que os usuários não devem tentar interpretar. Caso contrário, a coluna é o ID da transação.

  Para `InnoDB`, para obter detalhes sobre a transação, combine esta coluna com a coluna `TRX_ID` da tabela `INFORMATION_SCHEMA` `INNODB_TRX`.

- `THREAD_ID`

  O ID do fio da sessão que criou o bloqueio. Para obter detalhes sobre o fio, junte esta coluna com a coluna `THREAD_ID` da tabela do Schema de Desempenho `threads`.

  `THREAD_ID` pode ser usado junto com `EVENT_ID` para determinar o evento durante o qual a estrutura de dados de bloqueio foi criada na memória. (Esse evento pode ter ocorrido antes desse pedido de bloqueio específico, se a estrutura de dados for usada para armazenar múltiplos bloqueios.)

- `EVENT_ID`

  O evento do Schema de Desempenho que causou o bloqueio. Os tuplas de valores de (`THREAD_ID`, `EVENT_ID`) implicitamente identificam um evento pai em outras tabelas do Schema de Desempenho:

  - O evento de espera do pai nas tabelas `events_waits_xxx`

  - O evento principal da tabela `events_stages_xxx`

  - O evento de declaração principal nas tabelas `events_statements_xxx`

  - O evento de transação principal na tabela `events_transactions_current`

  Para obter detalhes sobre o evento pai, conecte as colunas `THREAD_ID` e `EVENT_ID` às colunas com o mesmo nome na tabela do evento pai apropriada. Veja a Seção 29.19.2, “Obtendo Informações sobre o Evento Pai”.

- `OBJECT_SCHEMA`

  O esquema que contém a tabela bloqueada.

- `OBJECT_NAME`

  O nome da tabela bloqueada.

- `PARTITION_NAME`

  O nome da partição bloqueada, se houver; `NULL` caso contrário.

- `SUBPARTITION_NAME`

  O nome da subpartição bloqueada, se houver; `NULL` caso contrário.

- `INDEX_NAME`

  O nome do índice bloqueado, se houver; `NULL` caso contrário.

  Na prática, `InnoDB` sempre cria um índice (`GEN_CLUST_INDEX`), portanto, `INDEX_NAME` não é `NULL` para tabelas `InnoDB`.

- `OBJECT_INSTANCE_BEGIN`

  O endereço em memória da fechadura.

- `LOCK_TYPE`

  O tipo de trava.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `RECORD` para um bloqueio de nível de linha e `TABLE` para um bloqueio de nível de tabela.

- `LOCK_MODE`

  Como o bloqueio é solicitado.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `S[,GAP]`, `X[,GAP]`, `IS[,GAP]`, `IX[,GAP]`, `AUTO_INC` e `UNKNOWN`. Modos de bloqueio diferentes de `AUTO_INC` e `UNKNOWN` indicam bloqueios de lacuna, se presentes. Para informações sobre `S`, `X`, `IS`, `IX` e bloqueios de lacuna, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

- `LOCK_STATUS`

  O status do pedido de bloqueio.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `GRANTED` (chave é mantida) e `WAITING` (chave está sendo esperada).

- `LOCK_DATA`

  Os dados associados ao bloqueio, se houver. O valor depende do mecanismo de armazenamento. Para `InnoDB`, um valor é exibido se o `LOCK_TYPE` for `RECORD`, caso contrário, o valor é `NULL`. Os valores da chave primária do registro bloqueado são exibidos para um bloqueio colocado no índice da chave primária. Os valores do índice secundário do registro bloqueado são exibidos com os valores da chave primária anexados para um bloqueio colocado em um índice secundário. Se não houver chave primária, `LOCK_DATA` exibe os valores da chave de um índice único selecionado ou o número de ID de linha interno `InnoDB` único, de acordo com as regras que regem o uso do índice agrupado `InnoDB` (veja a Seção 17.6.2.1, “Indizes Agrupados e Secundários”). `LOCK_DATA` relata “pseudo-registro supremo” para um bloqueio tomado em um pseudo-registro supremo. Se a página contendo o registro bloqueado não estiver no pool de buffer porque foi escrita no disco enquanto o bloqueio estava sendo mantido, `InnoDB` não carrega a página do disco. Em vez disso, `LOCK_DATA` relata `NULL`.

A tabela `data_locks` tem esses índices:

- Chave primária em (`ENGINE_LOCK_ID`, `ENGINE`)

- Índice sobre (`ENGINE_TRANSACTION_ID`, `ENGINE`)

- Índice sobre (`THREAD_ID`, `EVENT_ID`)

- Índice sobre (`OBJECT_SCHEMA`, `OBJECT_NAME`, `PARTITION_NAME`, `SUBPARTITION_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `data_locks`.

Nota

Antes do MySQL 8.0.1, informações semelhantes às da tabela do Gerenciamento de Desempenho `data_locks` estão disponíveis na tabela `INFORMATION_SCHEMA.INNODB_LOCKS`, que fornece informações sobre cada bloqueio solicitado por uma transação `InnoDB`, mas ainda não adquirida, e cada bloqueio mantido por uma transação que está bloqueando outra transação. `INFORMATION_SCHEMA.INNODB_LOCKS` é desatualizado e será removido a partir do MySQL 8.0.1. `data_locks` deve ser usado em vez disso.

Diferenças entre `INNODB_LOCKS` e `data_locks`:

- Se uma transação tiver um bloqueio, `INNODB_LOCKS` exibe o bloqueio apenas se outra transação estiver aguardando por ele. `data_locks` exibe o bloqueio, independentemente de qualquer transação estar aguardando por ele.

- A tabela `data_locks` não tem colunas correspondentes a `LOCK_SPACE`, `LOCK_PAGE` ou `LOCK_REC`.

- A tabela `INNODB_LOCKS` requer o privilégio global `PROCESS`. A tabela `data_locks` requer o privilégio usual do Schema de Desempenho de `SELECT` sobre a tabela a ser selecionada.

A tabela a seguir mostra a correspondência entre as colunas `INNODB_LOCKS` e as colunas `data_locks`. Use essas informações para migrar aplicativos de uma tabela para a outra.

**Tabela 29.4: Mapeamento de INNODB\_LOCKS para colunas data\_locks**

<table summary="Mapeamento de INNODB_LOCKS para as colunas data_locks."><thead><tr> <th>Coluna INNODB_LOCKS</th> <th>coluna data_locks</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>OBJECT_NAME</code>]</td> <td>[[PH_HTML_CODE_<code>OBJECT_NAME</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INDEX_NAME</code>]</td> <td>[[PH_HTML_CODE_<code>LOCK_SPACE</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>LOCK_PAGE</code>]</td> <td>[[PH_HTML_CODE_<code>LOCK_REC</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>LOCK_DATA</code>]</td> <td>[[PH_HTML_CODE_<code>LOCK_DATA</code>]</td> </tr><tr> <td>[[<code>LOCK_TABLE</code>]] (nomes combinados de esquema/tabela)</td> <td>[[<code>OBJECT_SCHEMA</code>]] (nome do esquema), [[<code>OBJECT_NAME</code>]] (nome da tabela)</td> </tr><tr> <td>[[<code>ENGINE_LOCK_ID</code><code>OBJECT_NAME</code>]</td> <td>[[<code>INDEX_NAME</code>]]</td> </tr><tr> <td>[[<code>LOCK_SPACE</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LOCK_PAGE</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LOCK_REC</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LOCK_DATA</code>]]</td> <td>[[<code>LOCK_DATA</code>]]</td> </tr></tbody></table>
