#### 29.12.11.7 A tabela `replication\_applier\_status`

Esta tabela mostra o status atual da execução da transação geral na replica. A tabela fornece informações sobre aspectos gerais do status do aplicador de transações que não são específicos de qualquer fio envolvido. Informações de status específicas para cada fio estão disponíveis na tabela `replication_applier_status_by_coordinator` (e `replication_applier_status_by_worker` se a replica for multifilamentar).

A tabela `replication_applier_status` tem as seguintes colunas:

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação” para mais informações.

* `SERVICE_STATE`

  Mostra `ON` quando os fios do aplicador do canal de replicação estão ativos ou em espera, `OFF` significa que os fios do aplicador não estão ativos.

* `REMAINING_DELAY`

  Se a replica estiver esperando que `DESIRED_DELAY` segundos passem desde que a fonte aplicou uma transação, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor `DESIRED_DELAY` é armazenado na tabela `replication_applier_configuration`.) Consulte a Seção 19.4.11, “Replicação Atrasar” para mais informações.

* `COUNT_TRANSACTIONS_RETRIES`

  Mostra o número de tentativas feitas porque o fio de transação de SQL da replica falhou em aplicar uma transação. O número máximo de tentativas para uma transação específica é definido pela variável de sistema `replica_transaction_retries`. A tabela `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de transação para uma replica multifilamentar ou monofilamentar.

A tabela `replication_applier_status` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_applier_status`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas `replication_applier_status` e `SHOW REPLICA STATUS`">
<col style="width: 60%"/><col style="width: 40%"/>
<thead>
<tr>
<th><code>replication_applier_status</code> Coluna</th>
<th><code>SHOW REPLICA STATUS</code> Coluna</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>SERVICE_STATE</code></td>
<td>Nenhum</td>
</tr>
<tr>
<td><code>REMAINING_DELAY</code></td>
<td><code>SQL_Remaining_Delay</code></td>
</tr>
</tbody>
</table>