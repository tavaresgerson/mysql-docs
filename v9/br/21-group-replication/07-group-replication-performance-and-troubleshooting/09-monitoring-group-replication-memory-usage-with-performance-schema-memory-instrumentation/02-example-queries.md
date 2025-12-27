#### 20.7.9.2 Consultas de Exemplo

Esta seção descreve consultas de exemplo usando os instrumentos e eventos para monitorar o uso de memória da Replicação em Grupo. As consultas recuperam dados da tabela `memory_summary_global_by_event_name`.

Os dados de memória podem ser consultados para eventos individuais, por exemplo:

```
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME = 'memory/group_rpl/write_set_encoded'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/write_set_encoded
                 COUNT_ALLOC: 1
                  COUNT_FREE: 0
   SUM_NUMBER_OF_BYTES_ALLOC: 45
    SUM_NUMBER_OF_BYTES_FREE: 0
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 1
             HIGH_COUNT_USED: 1
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 45
   HIGH_NUMBER_OF_BYTES_USED: 45
```

Veja a Seção 29.12.20.10, “Tabelas de Resumo de Memória” para mais informações sobre as colunas.

Você também pode definir consultas que somam vários eventos para fornecer visões gerais de áreas específicas de uso de memória.

Os seguintes exemplos são descritos:

* Memória Usada para Capturar Transações
* Memória Usada para Broadcastar Transações
* Memória Total Usada na Replicação em Grupo
* Memória Usada na Certificação
* Memória Usada na Certificação
* Memória Usada no Pipeline de Replicação
* Memória Usada na Consistência
* Memória Usada no Serviço de Mensagens de Entrega
* Memória Usada para Broadcastar e Receber Transações

##### Memória Usada para Capturar Transações

A memória alocada para capturar transações de usuários é a soma dos valores dos eventos `write_set_encoded`, `write_set_extraction` e `Log_event`. Por exemplo:

```
SELECT * FROM (SELECT
                (CASE
                  WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/Log_event'
                  THEN 'memory/group_rpl/memory_gr'
                  ELSE 'memory_gr_rest'
                END) AS EVENT_NAME,
                SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/Log_event'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 127
                  SUM(COUNT_FREE): 117
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 54808
    SUM(SUM_NUMBER_OF_BYTES_FREE): 52051
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 10
             SUM(HIGH_COUNT_USED): 35
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 2757
   SUM(HIGH_NUMBER_OF_BYTES_USED): 15630
```

##### Memória Usada para Broadcastar Transações

A memória alocada para broadcastar transações é a soma dos valores dos eventos `Gcs_message_data::m_buffer`, `transaction_data` e `GCS_XCom::xcom_cache`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 84
                  SUM(COUNT_FREE): 31
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1072324
    SUM(SUM_NUMBER_OF_BYTES_FREE): 7149
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 53
             SUM(HIGH_COUNT_USED): 59
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
   SUM(HIGH_NUMBER_OF_BYTES_USED): 1065809
```

##### Memória Total Usada na Replicação em Grupo

A alocação de memória para enviar e receber transações, certificação e todos os outros processos principais. É calculada consultando todos os eventos do grupo `memory/group_rpl/`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                    END) AS EVENT_NAME,
                    SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                    SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                    SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                    SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                    SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                    SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                              WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                              THEN 'memory/group_rpl/memory_gr'
                              ELSE 'memory_gr_rest'
                            END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 190
                 SUM(COUNT_FREE): 127
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1096370
   SUM(SUM_NUMBER_OF_BYTES_FREE): 28675
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 63
            SUM(HIGH_COUNT_USED): 77
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1067695
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1069255
```

##### Memória Usada na Certificação

A alocação de memória no processo de certificação é a soma dos valores dos eventos `certification_data`, `certification_data_gc` e `certification_info`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                     THEN 'memory/group_rpl/certification'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                            THEN 'memory/group_rpl/certification'
                            ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/certification
                SUM(COUNT_ALLOC): 80
                 SUM(COUNT_FREE): 80
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 9442
   SUM(SUM_NUMBER_OF_BYTES_FREE): 9442
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 0
            SUM(HIGH_COUNT_USED): 66
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 0
  SUM(HIGH_NUMBER_OF_BYTES_USED): 6561
```

##### Memória Usada no Pipeline de Replicação

A alocação de memória do pipeline de replicação é a soma dos valores dos eventos `certification_data` e `transaction_data`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/pipeline'
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                     THEN 'memory/group_rpl/pipeline'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/pipeline'
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/pipeline'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/pipeline
                COUNT_ALLOC: 17
                 COUNT_FREE: 13
  SUM_NUMBER_OF_BYTES_ALLOC: 2483
   SUM_NUMBER_OF_BYTES_FREE: 1668
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 4
            HIGH_COUNT_USED: 4
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 815
  HIGH_NUMBER_OF_BYTES_USED: 815
```

##### Memória Usada na Consistência

A alocação de memória para o garantido de consistência de transações é a soma dos valores dos eventos `consistent_members_that_must_prepare_transaction`, `consistent_transactions`, `consistent_transactions_prepared`, `consistent_transactions_waiting` e `consistent_transactions_delayed_view_change`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                     THEN 'memory/group_rpl/consistency'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                            THEN 'memory/group_rpl/consistency'
                            ELSE 'memory_gr_rest'
                          END)
                ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/consistency
                 COUNT_ALLOC: 16
                  COUNT_FREE: 6
   SUM_NUMBER_OF_BYTES_ALLOC: 1464
    SUM_NUMBER_OF_BYTES_FREE: 528
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 10
             HIGH_COUNT_USED: 11
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 936
   HIGH_NUMBER_OF_BYTES_USED: 1024
```

##### Memória Usada no Serviço de Mensagens de Entrega

Nota

Esta instrumentação se aplica apenas aos dados recebidos, não aos dados enviados.

A alocação de memória para o serviço de mensagem de entrega de replicação em grupo é a soma dos valores dos eventos `message_service_received_message` e `message_service_queue`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                     THEN 'memory/group_rpl/message_service'
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                     THEN 'memory/group_rpl/message_service'
                     ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                            THEN 'memory/group_rpl/message_service'
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                            THEN 'memory/group_rpl/message_service'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/message_service
                COUNT_ALLOC: 2
                 COUNT_FREE: 0
  SUM_NUMBER_OF_BYTES_ALLOC: 1048664
   SUM_NUMBER_OF_BYTES_FREE: 0
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 2
            HIGH_COUNT_USED: 2
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1048664
  HIGH_NUMBER_OF_BYTES_USED: 1048664
```

##### Memória Usada para Broadcastar e Receber Transações

A alocação de memória para a transmissão e recepção de transações para e a partir da rede é a soma dos valores dos eventos `wGcs_message_data::m_buffer` e `GCS_XCom::xcom_cache`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                           WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                           THEN 'memory/group_rpl/memory_gr'
                           WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                           THEN 'memory/group_rpl/memory_gr'
                           ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 73
                 SUM(COUNT_FREE): 20
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1070845
   SUM(SUM_NUMBER_OF_BYTES_FREE): 5670
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 53
            SUM(HIGH_COUNT_USED): 56
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1065175
```