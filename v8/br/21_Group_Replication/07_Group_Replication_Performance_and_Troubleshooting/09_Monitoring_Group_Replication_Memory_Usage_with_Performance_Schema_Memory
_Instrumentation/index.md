### 20.7.9 Monitoramento do uso da memória de replicação do Grupo com o Instrumento de Memória do Schema de Desempenho

20.7.9.1 Habilitar ou desabilitar a instrumentação de replicação em grupo

20.7.9.2 Exemplos de consultas

A partir do MySQL 8.0.30, o Gerenciamento de Desempenho oferece instrumentação para monitoramento de desempenho do uso de memória da Replicação por Grupo. Para ver a instrumentação de Replicação por Grupo disponível, execute a seguinte consulta:

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'memory/group_rpl/%';
+-------------------------------------------------------------------+---------+
| NAME                                                              | ENABLED |
+-------------------------------------------------------------------+---------+
| memory/group_rpl/write_set_encoded                                | YES     |
| memory/group_rpl/certification_data                               | YES     |
| memory/group_rpl/certification_data_gc                            | YES     |
| memory/group_rpl/certification_info                               | YES     |
| memory/group_rpl/transaction_data                                 | YES     |
| memory/group_rpl/sql_service_command_data                         | YES     |
| memory/group_rpl/mysql_thread_queued_task                         | YES     |
| memory/group_rpl/message_service_queue                            | YES     |
| memory/group_rpl/message_service_received_message                 | YES     |
| memory/group_rpl/group_member_info                                | YES     |
| memory/group_rpl/consistent_members_that_must_prepare_transaction | YES     |
| memory/group_rpl/consistent_transactions                          | YES     |
| memory/group_rpl/consistent_transactions_prepared                 | YES     |
| memory/group_rpl/consistent_transactions_waiting                  | YES     |
| memory/group_rpl/consistent_transactions_delayed_view_change      | YES     |
| memory/group_rpl/GCS_XCom::xcom_cache                             | YES     |
| memory/group_rpl/Gcs_message_data::m_buffer                       | YES     |
+-------------------------------------------------------------------+---------+
```

Para obter mais informações sobre a instrumentação de memória e os eventos do Schema de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

#### Os instrumentos de replicação em esquema de desempenho do grupo alocam a memória para a replicação em grupo.

O `memory/group_rpl/` Instrumento de Esquema de Desempenho foi atualizado na versão 8.0.30 para estender o monitoramento do uso de memória da Replicação em Grupo. `memory/group_rpl/` contém os seguintes instrumentos:

- `write_set_encoded`: Memória alocada para codificar o conjunto de escrita antes de ser transmitida aos membros do grupo.

- `Gcs_message_data::m_buffer`: Memória alocada para o payload de dados da transação enviado para a rede.

- `certification_data`: Memória alocada para a certificação de transações recebidas.

- `certification_data_gc`: Memória alocada para o GTID\_EXECUTED enviado por cada membro para coleta de lixo.

- `certification_info`: Memória alocada para o armazenamento de informações de certificação, alocada para resolver conflitos entre transações concorrentes.

- `transaction_data`: Memória alocada para transações recebidas em fila para o pipeline do plugin.

- `message_service_received_message`: Memória alocada para receber mensagens do serviço de entrega de mensagens de replicação de grupo.

- `sql_service_command_data`: Memória alocada para processar a fila de comandos do serviço SQL interno.

- `mysql_thread_queued_task`: Memória alocada quando uma tarefa dependente de um thread MySQL é adicionada à fila de processamento.

- `message_service_queue`: Memória alocada para mensagens em fila do serviço de mensagem de entrega de replicação de grupo.

- `GCS_XCom::xcom_cache`: Memória alocada para o XCOM para mensagens e metadados trocados entre os membros do grupo como parte do protocolo de consenso.

- `consistent_members_that_must_prepare_transaction`: Memória alocada para armazenar a lista de membros que estão preparando uma transação para garantir a consistência da transação de replicação de grupo.

- `consistent_transactions`: Memória alocada para armazenar a transação e a lista de membros que devem preparar essa transação para garantir a consistência da transação de replicação em grupo.

- `consistent_transactions_prepared`: Memória alocada para armazenar a lista de informações das transações preparadas para as Garantias de Consistência da Transação de Replicação de Grupo.

- `consistent_transactions_waiting`: Memória alocada para armazenar informações sobre uma lista de transações enquanto as transações preparadas anteriores são processadas com consistência de `AFTER` e `BEFORE_AND_AFTER`.

- `consistent_transactions_delayed_view_change`: Memória alocada para armazenar a lista de eventos de alteração de visualização (`view_change_log_event`) atrasados por transações consistentes preparadas aguardando o reconhecimento da preparação.

- `group_member_info`: Memória alocada para armazenar as propriedades dos membros do grupo. Propriedades como nome do host, porta, peso e papel do membro, e assim por diante.

Os seguintes instrumentos do grupo `memory/sql/` também são usados para monitorar a memória da replicação em grupo:

- `Log_event`: Memória alocada para codificar os dados da transação no formato de log binário; este é o mesmo formato no qual a Replicação por Grupo transmite os dados.

- `write_set_extraction`: Memória alocada para o conjunto de escrita gerado pela transação antes de ser comprometido.

- `Gtid_set::to_string`: Memória alocada para armazenar a representação de string de um conjunto de GTID.

- `Gtid_set::Interval_chunk`: Memória alocada para armazenar o objeto GTID.
