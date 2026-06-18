#### 29.12.13.2 Tabela data\_lock\_waits

A tabela `data_lock_waits` implementa uma relação muitos-para-muitos que mostra quais solicitações de bloqueio de dados na tabela `data_locks` são bloqueadas por quais bloqueios de dados mantidos na tabela `data_locks`. Os bloqueios mantidos em `data_locks` aparecem em `data_lock_waits` apenas se eles bloqueiam alguma solicitação de bloqueio.

Essas informações permitem que você entenda as dependências de bloqueio de dados entre as sessões. A tabela exibe não apenas qual bloqueio uma sessão ou transação está esperando, mas também qual sessão ou transação atualmente detém esse bloqueio.

Informações de espera para bloqueio de dados de exemplo:

```
mysql> SELECT * FROM performance_schema.data_lock_waits\G
*************************** 1. row ***************************
                          ENGINE: INNODB
       REQUESTING_ENGINE_LOCK_ID: 140211201964816:2:4:2:140211086465800
REQUESTING_ENGINE_TRANSACTION_ID: 1555
            REQUESTING_THREAD_ID: 47
             REQUESTING_EVENT_ID: 5
REQUESTING_OBJECT_INSTANCE_BEGIN: 140211086465800
         BLOCKING_ENGINE_LOCK_ID: 140211201963888:2:4:2:140211086459880
  BLOCKING_ENGINE_TRANSACTION_ID: 1554
              BLOCKING_THREAD_ID: 46
               BLOCKING_EVENT_ID: 12
  BLOCKING_OBJECT_INSTANCE_BEGIN: 140211086459880
```

Ao contrário da maioria das coleções de dados do Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis do sistema para controlar o tamanho das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, então não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlam sua coleta.

Use a tabela `data_lock_waits` para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Para `InnoDB`, consulte a discussão sobre este tópico na Seção 17.15.2, “Informações de Transações e Bloqueio do Schema de Informações InnoDB”.

Como as colunas da tabela `data_lock_waits` são semelhantes às da tabela `data_locks`, as descrições das colunas aqui são abreviadas. Para descrições mais detalhadas das colunas, consulte a Seção 29.12.13.1, “A tabela data\_locks”.

A tabela `data_lock_waits` tem essas colunas:

- `ENGINE`

  O mecanismo de armazenamento que solicitou o bloqueio.

- `REQUESTING_ENGINE_LOCK_ID`

  O ID do bloqueio solicitado pelo motor de armazenamento. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

- `REQUESTING_ENGINE_TRANSACTION_ID`

  O ID interno do motor de armazenamento da transação que solicitou o bloqueio.

- `REQUESTING_THREAD_ID`

  O ID do fio da sessão que solicitou o bloqueio.

- `REQUESTING_EVENT_ID`

  O evento do Schema de Desempenho que causou o pedido de bloqueio na sessão que solicitou o bloqueio.

- `REQUESTING_OBJECT_INSTANCE_BEGIN`

  O endereço na memória do bloqueio solicitado.

- `BLOCKING_ENGINE_LOCK_ID`

  O ID do bloqueio. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

- `BLOCKING_ENGINE_TRANSACTION_ID`

  O ID interno do motor de armazenamento da transação que mantém o bloqueio.

- `BLOCKING_THREAD_ID`

  O ID do fio da sessão que detém o bloqueio.

- `BLOCKING_EVENT_ID`

  O evento do Schema de Desempenho que causou o bloqueio de bloqueio na sessão que o contém.

- `BLOCKING_OBJECT_INSTANCE_BEGIN`

  O endereço em memória do bloqueio de bloqueio.

A tabela `data_lock_waits` tem esses índices:

- Índice sobre (`REQUESTING_ENGINE_LOCK_ID`, `ENGINE`)

- Índice sobre (`BLOCKING_ENGINE_LOCK_ID`, `ENGINE`)

- Índice sobre (`REQUESTING_ENGINE_TRANSACTION_ID`, `ENGINE`)

- Índice sobre (`BLOCKING_ENGINE_TRANSACTION_ID`, `ENGINE`)

- Índice sobre (`REQUESTING_THREAD_ID`, `REQUESTING_EVENT_ID`)

- Índice sobre (`BLOCKING_THREAD_ID`, `BLOCKING_EVENT_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `data_lock_waits`.

Nota

Antes do MySQL 8.0.1, informações semelhantes às da tabela do Gerenciamento de Desempenho `data_lock_waits` estão disponíveis na tabela `INFORMATION_SCHEMA.INNODB_LOCK_WAITS`, que fornece informações sobre cada transação bloqueada `InnoDB`, indicando o bloqueio que ela solicitou e quaisquer bloqueios que estejam bloqueando essa solicitação. `INFORMATION_SCHEMA.INNODB_LOCK_WAITS` é desatualizado e será removido a partir do MySQL 8.0.1. `data_lock_waits` deve ser usado em vez disso.

As tabelas diferem nos privilégios necessários: a tabela `INNODB_LOCK_WAITS` requer o privilégio global `PROCESS`. A tabela `data_lock_waits` requer o privilégio usual do Schema de Desempenho de `SELECT` sobre a tabela a ser selecionada.

A tabela a seguir mostra a correspondência entre as colunas `INNODB_LOCK_WAITS` e as colunas `data_lock_waits`. Use essas informações para migrar aplicativos de uma tabela para a outra.

**Tabela 29.5: Mapeamento de INNODB\_LOCK\_WAITS para as colunas data\_lock\_waits**

<table summary="Mapeamento de INNODB_LOCK_WAITS para as colunas data_lock_waits."><thead><tr> <th>Coluna INNODB_LOCK_WAITS</th> <th>coluna data_lock_waits</th> </tr></thead><tbody><tr> <td>[[<code>REQUESTING_TRX_ID</code>]]</td> <td>[[<code>REQUESTING_ENGINE_TRANSACTION_ID</code>]]</td> </tr><tr> <td>[[<code>REQUESTED_LOCK_ID</code>]]</td> <td>[[<code>REQUESTING_ENGINE_LOCK_ID</code>]]</td> </tr><tr> <td>[[<code>BLOCKING_TRX_ID</code>]]</td> <td>[[<code>BLOCKING_ENGINE_TRANSACTION_ID</code>]]</td> </tr><tr> <td>[[<code>BLOCKING_LOCK_ID</code>]]</td> <td>[[<code>BLOCKING_ENGINE_LOCK_ID</code>]]</td> </tr></tbody></table>
