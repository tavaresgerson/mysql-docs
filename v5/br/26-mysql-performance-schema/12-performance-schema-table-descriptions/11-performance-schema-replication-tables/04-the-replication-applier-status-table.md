#### 25.12.11.4 A tabela replication_applier_status

Esta tabela mostra o status atual da execução da transação geral na replica. A tabela fornece informações sobre aspectos gerais do status do aplicador de transações que não são específicos de qualquer thread envolvida. Informações de status específicas para cada thread estão disponíveis na tabela `replication_applier_status_by_coordinator` (e na tabela `replication_applier_status_by_worker` se a replica for multithread).

A tabela `replication_applier_status` tem as seguintes colunas:

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `ESTADO_SERVIÇO`

  Mostra `ON` quando as threads do aplicador do canal de replicação estão ativas ou em espera, `OFF` significa que as threads do aplicador não estão ativas.

- `REMAINING_DELAY`

  Se a replica estiver aguardando o passar de `DESIRED_DELAY` segundos desde que a fonte aplicou um evento, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor de `DESIRED_DELAY` é armazenado na tabela `replication_applier_configuration`.

- `CONTAR_REPROVAS_DE_TRANSACOES`

  Mostra o número de tentativas de reexecução que foram feitas porque o thread de replicação SQL não conseguiu aplicar uma transação. O número máximo de tentativas para uma transação específica é definido pela variável de sistema `slave_transaction_retries`.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_applier_status`.

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_status` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status e SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status</code> Coluna</th> <th><code>SHOW SLAVE STATUS</code> Coluna</th> </tr></thead><tbody><tr> <td><code>SERVICE_STATE</code></td> <td>Nenhum</td> </tr><tr> <td><code>REMAINING_DELAY</code></td> <td><code>SQL_Remaining_Delay</code></td> </tr></tbody></table>
