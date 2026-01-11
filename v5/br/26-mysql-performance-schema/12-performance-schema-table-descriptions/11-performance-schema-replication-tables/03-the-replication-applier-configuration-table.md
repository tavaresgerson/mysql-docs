#### 25.12.11.3 A tabela replication_applier_configuration

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pela replica. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE MASTER TO`, conforme indicado nas descrições das colunas.

A tabela `replication_applier_configuration` tem as seguintes colunas:

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `DESIRED_DELAY`

  O número de segundos que a réplica deve ficar atrasada em relação à fonte. (`Opção ALTERAR MASTER PARA`: `MASTER_DELAY`)

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_configuration` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_applier_configuration e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_configuration</code> Coluna</th> <th><code>SHOW SLAVE STATUS</code> Coluna</th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>
