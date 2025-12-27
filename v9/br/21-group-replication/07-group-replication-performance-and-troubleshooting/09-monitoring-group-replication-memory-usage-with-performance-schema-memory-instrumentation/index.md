### 20.7.9 Monitoramento do Uso da Memória da Replicação de Grupo com o Instrumento de Memória do Schema de Desempenho

20.7.9.1 Habilitando ou Desabilitando o Instrumento de Replicação de Grupo

20.7.9.2 Consultas Exemplos

O Schema de Desempenho MySQL fornece instrumentos para monitoramento de desempenho do uso da memória da Replicação de Grupo. Para visualizar os instrumentos de Replicação de Grupo disponíveis, execute a seguinte consulta:

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

Para obter mais informações sobre o instrumentação de memória e eventos do Schema de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

#### Instrumentos de Memória da Replicação de Grupo do Schema de Desempenho

O instrumentação do Schema de Desempenho `memory/group_rpl/` contém os seguintes instrumentos:

* `write_set_encoded`: Memória alocada para codificar o conjunto de escrita antes de ser transmitido aos membros do grupo.

* `Gcs_message_data::m_buffer`: Memória alocada para o payload de dados da transação enviado para a rede.

* `certification_data`: Memória alocada para a certificação de transações recebidas.

* `certification_data_gc`: Memória alocada para o GTID\_EXECUTED enviado por cada membro para coleta de lixo.

* `certification_info`: Memória alocada para o armazenamento de informações de certificação alocadas para resolver conflitos entre transações concorrentes.

* `transaction_data`: Memória alocada para transações recebidas em fila para o pipeline do plugin.

* `message_service_received_message`: Memória alocada para receber mensagens do serviço de entrega de mensagens de Replicação de Grupo.

* `sql_service_command_data`: Memória alocada para processar a fila de comandos do serviço SQL interno.

* `mysql_thread_queued_task`: Memória alocada quando uma tarefa dependente do MySQL-thread é adicionada à fila de processamento.

* `message_service_queue`: Memória alocada para mensagens em fila do serviço de mensagem de entrega de replicação de grupo.

* `GCS_XCom::xcom_cache`: Memória alocada para o XCOM cache para mensagens e metadados trocados entre os membros do grupo como parte do protocolo de consenso.

* `consistent_members_that_must_prepare_transaction`: Memória alocada para manter a lista de membros que preparam a transação para as garantias de consistência de transação da replicação de grupo.

* `consistent_transactions`: Memória alocada para manter a transação e a lista de membros que devem preparar essa transação para as garantias de consistência de transação da replicação de grupo.

* `consistent_transactions_prepared`: Memória alocada para manter a lista de informações da transação preparadas para as garantias de consistência de transação da replicação de grupo.

* `consistent_transactions_waiting`: Memória alocada para manter informações sobre uma lista de transações enquanto as transações preparadas com consistência de `AFTER` e `BEFORE_AND_AFTER` são processadas.

* `consistent_transactions_delayed_view_change`: Memória alocada para manter a lista de eventos de alteração de visualização (`view_change_log_event`) atrasados por transações consistentes preparadas esperando o reconhecimento da preparação.

* `group_member_info`: Memória alocada para manter as propriedades do membro do grupo. Propriedades como o nome do host, a porta, o peso e o papel do membro, e assim por diante.

Os seguintes instrumentos no agrupamento `memory/sql/` também são usados para monitorar a memória da replicação de grupo:

* `Log_event`: Memória alocada para codificar os dados da transação no formato de log binário; este é o mesmo formato no qual a replicação de grupo transmite dados.

* `write_set_extraction`: Memória alocada para o conjunto de escrita gerado pela transação antes de ser comprometido.

* `Gtid_set::to_string`: Memória alocada para armazenar a representação em string de um conjunto de GTID.

* `Gtid_set::Interval_chunk`: Memória alocada para armazenar o objeto GTID.