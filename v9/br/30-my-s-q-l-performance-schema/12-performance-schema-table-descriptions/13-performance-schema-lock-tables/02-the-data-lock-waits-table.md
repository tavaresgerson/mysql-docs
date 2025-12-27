#### 29.12.13.2 A tabela `data_lock_waits`

A tabela `data_lock_waits` implementa uma relação muitos-para-muitos que mostra quais solicitações de bloqueio de dados na tabela `data_locks` são bloqueadas por quais bloqueios de dados mantidos na tabela `data_locks`. Os bloqueios mantidos em `data_locks` aparecem em `data_lock_waits` apenas se eles bloqueiam alguma solicitação de bloqueio.

Essas informações permitem que você entenda as dependências de bloqueio de dados entre as sessões. A tabela expõe não apenas qual bloqueio uma sessão ou transação está esperando, mas também qual sessão ou transação atualmente mantém esse bloqueio.

Exemplo de informações de espera de bloqueio de dados:

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

Ao contrário da maioria da coleta de dados do Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis de sistema para controlar os tamanhos das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, então não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlam sua coleta.

Use a tabela `data_lock_waits` para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Para o `InnoDB`, consulte a discussão sobre esse tópico na Seção 17.15.2, “Transação e Informações de Bloqueio do Schema de Informação do InnoDB”.

Como as colunas na tabela `data_lock_waits` são semelhantes às da tabela `data_locks`, as descrições das colunas aqui são abreviadas. Para descrições mais detalhadas das colunas, consulte a Seção 29.12.13.1, “A tabela `data_locks`”.

A tabela `data_lock_waits` tem essas colunas:

* `ENGINE`

  O motor de armazenamento que solicitou o bloqueio.

* `REQUESTING_ENGINE_LOCK_ID`

  O ID do bloqueio solicitado pelo motor de armazenamento. Para obter detalhes sobre o bloqueio, faça uma junção desta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

* `REQUESTING_ENGINE_TRANSACTION_ID`

  O ID interno do motor de armazenamento da transação que solicitou o bloqueio.

* `REQUESTING_THREAD_ID`

  O ID do thread da sessão que solicitou o bloqueio.

* `REQUESTING_EVENT_ID`

  O evento do Schema de Desempenho que causou a solicitação de bloqueio na sessão que solicitou o bloqueio.

* `REQUESTING_OBJECT_INSTANCE_BEGIN`

  O endereço na memória do bloqueio solicitado.

* `BLOCKING_ENGINE_LOCK_ID`

  O ID do bloqueio que está bloqueando. Para obter detalhes sobre o bloqueio, junte esta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

* `BLOCKING_ENGINE_TRANSACTION_ID`

  O ID interno do motor de armazenamento da transação que mantém o bloqueio.

* `BLOCKING_THREAD_ID`

  O ID do thread da sessão que mantém o bloqueio.

* `BLOCKING_EVENT_ID`

  O evento do Schema de Desempenho que causou o bloqueio do bloqueio na sessão que o mantém.

* `BLOCKING_OBJECT_INSTANCE_BEGIN`

  O endereço na memória do bloqueio que está bloqueando.

A tabela `data_lock_waits` tem esses índices:

* Índice em (`REQUESTING_ENGINE_LOCK_ID`, `ENGINE`)

* Índice em (`BLOCKING_ENGINE_LOCK_ID`, `ENGINE`)

* Índice em (`REQUESTING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice em (`BLOCKING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice em (`REQUESTING_THREAD_ID`, `REQUESTING_EVENT_ID`)

* Índice em (`BLOCKING_THREAD_ID`, `BLOCKING_EVENT_ID`)

O `TRUNCATE TABLE` não é permitido para a tabela `data_lock_waits`.