#### 25.12.11.3 A Tabela replication_applier_configuration

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pelo Replica. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE MASTER TO`, conforme indicado nas descrições das colunas.

A tabela `replication_applier_configuration` possui as seguintes colunas:

* `CHANNEL_NAME`

  O canal de Replication que esta linha está exibindo. Há sempre um canal de Replication padrão, e mais canais de Replication podem ser adicionados. Consulte a Seção 16.2.2, “Replication Channels” para mais informações.

* `DESIRED_DELAY`

  O número de segundos que o Replica deve atrasar o Source. (Opção do `CHANGE MASTER TO`: `MASTER_DELAY`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_configuration` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_applier_configuration e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_applier_configuration</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>
