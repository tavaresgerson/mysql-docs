#### 29.12.13.1 A tabela `data_locks`

A tabela `data_locks` mostra as bloqueadoras de dados mantidas e solicitadas. Para obter informações sobre quais solicitações de bloqueio são bloqueadas por quais bloqueadores mantidos, consulte a Seção 29.12.13.2, “A tabela `data_lock_waits`”.

Exemplo de informações sobre bloqueadores de dados:

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

Ao contrário da maioria da coleta de dados do Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis de sistema para controlar os tamanhos das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, então não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlam sua coleta.

Use a tabela `data_locks` para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Para o `InnoDB`, consulte a discussão sobre esse tópico na Seção 17.15.2, “Transação e Informações de Bloqueio do Schema de INNODB”.

A tabela `data_locks` tem essas colunas:

* `ENGINE`

  O motor de armazenamento que mantém ou solicitou o bloqueio.

* `ENGINE_LOCK_ID`

  O ID do bloqueio mantido ou solicitado pelo motor de armazenamento. Os tuplas de valores (`ENGINE_LOCK_ID`, `ENGINE`) são únicos.

  Os formatos de ID de bloqueio são internos e estão sujeitos a alterações a qualquer momento. As aplicações não devem depender dos IDs de bloqueio terem um formato específico.

* `ENGINE_TRANSACTION_ID`

  O ID interno do transação do motor de armazenamento que solicitou o bloqueio. Isso pode ser considerado o proprietário do bloqueio, embora o bloqueio ainda possa estar pendente, não sendo realmente concedido (`LOCK_STATUS='WAITING'`).

  Se a transação ainda não realizou nenhuma operação de escrita (ser ainda considerada apenas de leitura), a coluna contém dados internos que os usuários não devem tentar interpretar. Caso contrário, a coluna é o ID da transação.

Para o `InnoDB`, para obter detalhes sobre a transação, junte esta coluna com a coluna `TRX_ID` da tabela `INFORMATION_SCHEMA` `INNODB_TRX`.

* `THREAD_ID`

  O ID do thread da sessão que criou o bloqueio. Para obter detalhes sobre o thread, junte esta coluna com a coluna `THREAD_ID` da tabela `Performance Schema` `threads`.

  `THREAD_ID` pode ser usado junto com `EVENT_ID` para determinar o evento durante o qual a estrutura de dados do bloqueio foi criada na memória. (Esse evento pode ter ocorrido antes deste pedido de bloqueio específico, se a estrutura de dados for usada para armazenar múltiplos bloqueios.)

* `EVENT_ID`

  O evento do Schema de Desempenho que causou o bloqueio. Os tuplas de valores (`THREAD_ID`, `EVENT_ID`) identificam implicitamente um evento pai em outras tabelas do Schema de Desempenho:

  + O evento de espera pai nas tabelas `events_waits_xxx`

  + O evento de estágio pai nas tabelas `events_stages_xxx`

  + O evento de declaração pai nas tabelas `events_statements_xxx`

  + O evento de transação pai na tabela `events_transactions_current`

  Para obter detalhes sobre o evento pai, junte as colunas `THREAD_ID` e `EVENT_ID` com as colunas de nome semelhante na tabela de evento pai apropriada. Veja a Seção 29.19.2, “Obtendo Informações sobre o Evento Pai”.

* `OBJECT_SCHEMA`

  O esquema que contém a tabela bloqueada.

* `OBJECT_NAME`

  O nome da tabela bloqueada.

* `PARTITION_NAME`

  O nome da partição bloqueada, se houver; `NULL` caso contrário.

* `SUBPARTITION_NAME`

  O nome da subpartição bloqueada, se houver; `NULL` caso contrário.

* `INDEX_NAME`

  O nome do índice bloqueado, se houver; `NULL` caso contrário.

  Na prática, o `InnoDB` sempre cria um índice (`GEN_CLUST_INDEX`), então `INDEX_NAME` não é `NULL` para tabelas `InnoDB`.

O endereço em memória do bloqueio.

* `LOCK_TYPE`

  O tipo de bloqueio.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `RECORD` para um bloqueio de nível de linha, `TABLE` para um bloqueio de nível de tabela.

* `LOCK_MODE`

  Como o bloqueio é solicitado.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `S[,GAP]`, `X[,GAP]`, `IS[,GAP]`, `IX[,GAP]`, `AUTO_INC` e `UNKNOWN`. Os modos de bloqueio diferentes de `AUTO_INC` e `UNKNOWN` indicam bloqueios de lacuna, se presentes. Para informações sobre `S`, `X`, `IS`, `IX` e bloqueios de lacuna, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

* `LOCK_STATUS`

  O status da solicitação de bloqueio.

  O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `GRANTED` (o bloqueio é mantido) e `WAITING` (o bloqueio está sendo aguardado).

* `LOCK_DATA`

  Os dados associados ao bloqueio, se houver. O valor depende do mecanismo de armazenamento. Para `InnoDB`, um valor é exibido se o `LOCK_TYPE` for `RECORD`, caso contrário, o valor é `NULL`. Os valores da chave primária do registro bloqueado são exibidos para um bloqueio colocado no índice de chave primária. Os valores do índice secundário do registro bloqueado são exibidos com os valores da chave primária anexados para um bloqueio colocado em um índice secundário. Se não houver chave primária, `LOCK_DATA` exibe os valores da chave de um índice único selecionado ou o número de ID de linha interno `InnoDB` único, de acordo com as regras que regem o uso de índices agrupados `InnoDB` (consulte a Seção 17.6.2.1, “Indizes Agrupados e Secundários”). `LOCK_DATA` relata “pseudo-registro máximo” para um bloqueio tomado em um pseudo-registro máximo. Se a página contendo o registro bloqueado não estiver no pool de buffers porque foi escrita no disco enquanto o bloqueio estava mantido, o `InnoDB` não carrega a página do disco. Em vez disso, `LOCK_DATA` relata `NULL`.

A tabela `data_locks` tem esses índices:

* Chave primária em (`ENGINE_LOCK_ID`, `ENGINE`)

* Índice em (`ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice em (`THREAD_ID`, `EVENT_ID`)

* Índice em (`OBJECT_SCHEMA`, `OBJECT_NAME`, `PARTITION_NAME`, `SUBPARTITION_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `data_locks`.