#### 16.1.5.8 Monitoramento de Replicação Multi-Source

Para monitorar o status dos canais de replicação, existem as seguintes opções:

* Usando as tabelas de replicação do Performance Schema. A primeira coluna dessas tabelas é `Channel_Name`. Isso permite que você escreva Queries complexas baseadas em `Channel_Name` como uma chave. Consulte [Seção 25.12.11, “Tabelas de Replicação do Performance Schema”](performance-schema-replication-tables.html "25.12.11 Tabelas de Replicação do Performance Schema").

* Usando `SHOW SLAVE STATUS FOR CHANNEL channel`. Por padrão, se a cláusula `FOR CHANNEL channel` não for usada, esta instrução mostra o status da réplica (replica status) para todos os canais, com uma linha por canal. O identificador `Channel_name` é adicionado como uma coluna no conjunto de resultados. Se uma cláusula `FOR CHANNEL channel` for fornecida, os resultados mostrarão o status apenas do canal de replicação nomeado.

Nota

A instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") não funciona com múltiplos canais de replicação. As informações que estavam disponíveis por meio dessas variáveis foram migradas para as tabelas de performance de replicação. O uso de uma instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") em uma topologia com múltiplos canais mostra o status apenas do canal padrão (default channel).

##### 16.1.5.8.1 Monitorando Canais Usando Tabelas do Performance Schema

Esta seção explica como usar as tabelas de replicação do Performance Schema para monitorar canais. Você pode escolher monitorar todos os canais, ou um subconjunto dos canais existentes.

Para monitorar o status de conexão de todos os canais:

```sql
mysql> SELECT * FROM replication_connection_status\G;
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
*************************** 2. row ***************************
CHANNEL_NAME: source_2
GROUP_NAME:
SOURCE_UUID: 7475e474-a223-11e4-a978-0811960cc264
THREAD_ID: 26
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 7475e474-a223-11e4-a978-0811960cc264:4-6
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
2 rows in set (0.00 sec)
```

Na saída acima, há dois canais habilitados e, conforme mostrado pelo campo `CHANNEL_NAME`, eles são chamados de `source_1` e `source_2`.

A adição do campo `CHANNEL_NAME` permite que você faça Queries nas tabelas do Performance Schema para um canal específico. Para monitorar o status de conexão de um canal nomeado, use uma cláusula `WHERE CHANNEL_NAME=channel`:

```sql
mysql> SELECT * FROM replication_connection_status WHERE CHANNEL_NAME='source_1'\G
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
1 row in set (0.00 sec)
```

Da mesma forma, a cláusula `WHERE CHANNEL_NAME=channel` pode ser usada para monitorar as outras tabelas de replicação do Performance Schema para um canal específico. Para mais informações, consulte [Seção 25.12.11, “Tabelas de Replicação do Performance Schema”](performance-schema-replication-tables.html "25.12.11 Tabelas de Replicação do Performance Schema").