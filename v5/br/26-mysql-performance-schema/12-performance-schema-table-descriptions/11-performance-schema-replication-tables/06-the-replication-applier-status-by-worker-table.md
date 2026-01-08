#### 25.12.11.6 Tabela replication\_applier\_status\_by\_worker

Se a replica não for multithreading, esta tabela mostra o status da thread do aplicável. Caso contrário, a replica usa múltiplas threads de trabalho e uma thread de coordenador para gerenciá-las, e esta tabela mostra o status das threads de trabalho. Para uma replica multithreading, a tabela `replication_applier_status_by_coordinator` mostra o status da thread do coordenador.

A tabela `replication_applier_status_by_worker` tem as seguintes colunas:

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `WORKER_ID`

  O identificador do trabalhador (mesmo valor que a coluna `id` na tabela `mysql.slave_worker_info`). Após `STOP SLAVE`, a coluna `THREAD_ID` torna-se `NULL`, mas o valor da coluna `WORKER_ID` é preservado.

- `THREAD_ID`

  O identificador do fio do trabalhador.

- `ESTADO_SERVIÇO`

  `ON` (o tópico existe e está ativo ou em espera) ou `OFF` (o tópico não existe mais).

- `Última transação vista`

  A transação que o trabalhador viu pela última vez. O trabalhador não necessariamente aplicou essa transação, pois ela ainda pode estar em processo de aplicação.

  Se o valor da variável de sistema `gtid_mode` for `OFF`, esta coluna será `ANONYMOUS`, indicando que as transações não possuem identificadores de transação global (GTIDs) e são identificadas apenas por arquivo e posição.

  Se [`gtid_mode`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_gtids) for `ON`, o valor da coluna é definido da seguinte forma:

  - Se nenhuma transação foi executada, a coluna está vazia.

  - Quando uma transação é executada, a coluna é definida a partir de \[`gtid_next`]\(replication-options-gtids.html#sysvar\_gtid\_next] assim que `gtid_next` é definido. A partir deste momento, a coluna sempre exibe um GTID.

  - O GTID é preservado até que a próxima transação seja executada. Se ocorrer um erro, o valor da coluna é o GTID da transação que está sendo executada pelo trabalhador quando o erro ocorreu. A seguinte declaração mostra se essa transação foi ou não confirmada:

    ```sql
    SELECT GTID_SUBSET(LAST_SEEN_TRANSACTION, @@GLOBAL.GTID_EXECUTED)
    FROM performance_schema.replication_applier_status_by_worker;
    ```

    Se a declaração retornar zero, a transação ainda não foi confirmada, porque ainda está sendo processada ou porque o fio de trabalho foi interrompido enquanto estava sendo processado. Se a declaração retornar um valor diferente de zero, a transação foi confirmada.

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread do trabalhador. Um número de erro de 0 e uma mensagem de uma string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores do erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

  Todos os códigos de erro e mensagens exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados em Referência de Mensagem de Erro do Servidor.

- `LAST_ERROR_TIMESTAMP`

  Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro mais recente do trabalhador.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_applier_status_by_worker`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_worker` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status_by_worker e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>[[PH_HTML_CODE_<code>LAST_ERROR_TIMESTAMP</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>LAST_ERROR_TIMESTAMP</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>WORKER_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>THREAD_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LAST_SEEN_TRANSACTION</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LAST_ERROR_NUMBER</code>]]</td> <td>[[<code>Last_SQL_Errno</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_MESSAGE</code>]]</td> <td>[[<code>Last_SQL_Error</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_TIMESTAMP</code>]]</td> <td>[[<code>SHOW SLAVE STATUS</code><code>LAST_ERROR_TIMESTAMP</code>]</td> </tr></tbody></table>
