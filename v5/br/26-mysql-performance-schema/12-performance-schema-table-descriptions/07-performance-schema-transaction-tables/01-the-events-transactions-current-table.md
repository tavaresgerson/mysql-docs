#### 25.12.7.1 Tabela events\_transactions\_current

A tabela `events_transactions_current` contém eventos de transações atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de transação mais recente monitorado da thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela. Por exemplo:

```sql
mysql> SELECT *
       FROM performance_schema.events_transactions_current LIMIT 1\G
*************************** 1. row ***************************
                      THREAD_ID: 26
                       EVENT_ID: 7
                   END_EVENT_ID: NULL
                     EVENT_NAME: transaction
                          STATE: ACTIVE
                         TRX_ID: NULL
                           GTID: 3E11FA47-71CA-11E1-9E33-C80AA9429562:56
                            XID: NULL
                       XA_STATE: NULL
                         SOURCE: transaction.cc:150
                    TIMER_START: 420833537900000
                      TIMER_END: NULL
                     TIMER_WAIT: NULL
                    ACCESS_MODE: READ WRITE
                ISOLATION_LEVEL: REPEATABLE READ
                     AUTOCOMMIT: NO
           NUMBER_OF_SAVEPOINTS: 0
NUMBER_OF_ROLLBACK_TO_SAVEPOINT: 0
    NUMBER_OF_RELEASE_SAVEPOINT: 0
          OBJECT_INSTANCE_BEGIN: NULL
               NESTING_EVENT_ID: 6
             NESTING_EVENT_TYPE: STATEMENT
```

Das tabelas que contêm linhas de eventos de transação, `events_transactions_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de transação são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_transactions_history` e `events_transactions_history_long` são coleções dos eventos de transação mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para obter mais informações sobre a relação entre as três tabelas de eventos de transação, consulte Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de transação devem ser coletados, consulte Seção 25.12.7, “Tabelas de Transações do Schema de Desempenho”.

A tabela `events_transactions_current` tem as seguintes colunas:

- `THREAD_ID`, `EVENT_ID`

  O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

- `END_EVENT_ID`

  Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

- `NOME_DO_Evento`

  O nome do instrumento a partir do qual o evento foi coletado. Este é um valor `NOME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

- `ESTADO`

  O estado atual da transação. O valor é `ATIVO` (após `START TRANSACTION` ou `BEGIN`), `COMITADO` (após `COMMIT`) ou `REVERTIDO` (após `ROLLBACK`).

- `TRX_ID`

  Inexercitado.

- `GTID`

  A coluna GTID contém o valor de `gtid_next`, que pode ser `ANONYMOUS`, `AUTOMATIC` ou um GTID usando o formato `UUID:NUMBER`. Para transações que usam `gtid_next=AUTOMATIC`, que são todas as transações normais do cliente, a coluna GTID muda quando a transação é confirmada e o GTID real é atribuído. Se o `gtid_mode` estiver em `ON` ou `ON_PERMISSIVE`, a coluna GTID muda para o GTID da transação. Se o `gtid_mode` estiver em `OFF` ou `OFF_PERMISSIVE`, a coluna GTID muda para `ANONYMOUS`.

- `XID_FORMAT_ID`, `XID_GTRID` e `XID_BQUAL`

  Os elementos do identificador de transação XA. Eles têm o formato descrito na Seção 13.3.7.1, “Instruções SQL de Transação XA”.

- `XA_STATE`

  O estado da transação XA. O valor é `ATIVO` (após `XA START`), `INATIVO` (após `XA END`), `PREPARAÇÃO` (após `XA PREPARE`), `REVERTIDO` (após `XA ROLLBACK`) ou `COMITADO` (após `XA COMMIT`).

  Em uma replica, a mesma transação XA pode aparecer na tabela `events_transactions_current` com diferentes estados em diferentes threads. Isso ocorre porque, imediatamente após a transação XA ser preparada, ela é desacoplada do thread do aplicador de replicação e pode ser confirmada ou revertida por qualquer thread na replica. A tabela `events_transactions_current` exibe o status atual do evento de transação monitorado mais recente no thread e não atualiza esse status quando o thread está parado. Portanto, a transação XA ainda pode ser exibida no estado `PREPARED` para o thread do aplicador original, após ter sido processada por outro thread. Para identificar positivamente as transações XA que ainda estão no estado `PREPARED` e precisam ser recuperadas, use a instrução `XA RECOVER` em vez das tabelas de transações do Schema de Desempenho.

- `FONTE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

- `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade desses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

  Se um evento for gerado a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picossegundos como unidade para tempos de eventos e fatores que afetam os valores de tempo, consulte Seção 25.4.1, “Cronometragem de Eventos do Schema de Desempenho”.

- `MODO_ACESSO`

  O modo de acesso à transação. O valor é `LEITURA/ESCRITA` ou `LEITURA SOMENTE`.

- `NÍVEL_DE_ISOLAÇÃO`

  O nível de isolamento de transação. O valor é `REPEATABLE READ`, `READ COMMITTED`, `READ UNCOMMITTED` ou `SERIALIZABLE`.

- `AUTOCOMMIT`

  Se o modo autcommit foi ativado quando a transação foi iniciada.

- `NUMÉRO_DE_PUNTOS_DE_SALVAMENTO`, `NUMÉRO_DE_VOLTA_PARA_PUNTO_DE_SALVAMENTO`, `NUMÉRO_DE_LIBERAÇÃO_DE_PUNTO_DE_SALVAMENTO`

  O número de instruções `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT` emitidas durante a transação.

- `OBJECT_INSTANCE_BEGIN`

  Inexercitado.

- `NESTING_EVENT_ID`

  O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

- `NESTING_EVENT_TYPE`

  O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`. (`TRANSACTION` não aparece porque as transações não podem ser nidificadas.)

A operação `TRUNCATE TABLE` é permitida para a tabela `events_transactions_current`. Ela remove as linhas.
