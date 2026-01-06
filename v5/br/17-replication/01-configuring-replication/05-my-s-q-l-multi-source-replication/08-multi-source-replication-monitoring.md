#### 16.1.5.8 Monitoramento da Replicação de Múltiplos Fontes

Para monitorar o status dos canais de replicação, existem as seguintes opções:

- Usando as tabelas do Schema de Desempenho de Replicação. A primeira coluna dessas tabelas é `Channel_Name`. Isso permite que você escreva consultas complexas com base em `Channel_Name` como chave. Veja Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

- Usando `SHOW SLAVE STATUS FOR CHANNEL channel`. Por padrão, se a cláusula `FOR CHANNEL channel` não for usada, esta declaração mostra o status da replicação para todos os canais com uma linha por canal. O identificador `Channel_name` é adicionado como uma coluna no conjunto de resultados. Se for fornecida a cláusula `FOR CHANNEL channel`, os resultados mostram o status apenas do canal de replicação nomeado.

Nota

A instrução `SHOW VARIABLES` não funciona com múltiplos canais de replicação. As informações que estavam disponíveis por meio dessas variáveis foram migradas para as tabelas de desempenho da replicação. Usar uma instrução `SHOW VARIABLES` em uma topologia com múltiplos canais mostra o status apenas do canal padrão.

##### 16.1.5.8.1 Canais de monitoramento usando tabelas do Schema de desempenho

Esta seção explica como usar as tabelas do Schema de Desempenho de Replicação para monitorar os canais. Você pode optar por monitorar todos os canais ou um subconjunto dos canais existentes.

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

No resultado acima, há dois canais habilitados, e, conforme mostrado pelo campo `CHANNEL_NAME`, eles são chamados de `source_1` e `source_2`.

A adição do campo `CHANNEL_NAME` permite que você consulte as tabelas do Schema de Desempenho para um canal específico. Para monitorar o status da conexão de um canal nomeado, use uma cláusula `WHERE CHANNEL_NAME=channel`:

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

Da mesma forma, a cláusula `WHERE CHANNEL_NAME=channel` pode ser usada para monitorar as outras tabelas do Schema de Desempenho de replicação para um canal específico. Para mais informações, consulte Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.
