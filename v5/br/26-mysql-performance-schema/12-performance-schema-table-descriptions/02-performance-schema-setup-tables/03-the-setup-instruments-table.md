#### 25.12.2.3 A Tabela setup_instruments

A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") lista classes de objetos instrumentados para os quais eventos podem ser coletados:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments;
+---------------------------------------------------+---------+-------+
| NAME                                              | ENABLED | TIMED |
+---------------------------------------------------+---------+-------+
...
| stage/sql/end                                     | NO      | NO    |
| stage/sql/executing                               | NO      | NO    |
| stage/sql/init                                    | NO      | NO    |
| stage/sql/insert                                  | NO      | NO    |
...
| statement/sql/load                                | YES     | YES   |
| statement/sql/grant                               | YES     | YES   |
| statement/sql/check                               | YES     | YES   |
| statement/sql/flush                               | YES     | YES   |
...
| wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
| wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
| wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
| wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
...
| wait/synch/rwlock/sql/LOCK_grant                  | YES     | YES   |
| wait/synch/rwlock/sql/LOGGER::LOCK_logger         | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_connect       | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_slave         | YES     | YES   |
...
| wait/io/file/sql/binlog                           | YES     | YES   |
| wait/io/file/sql/binlog_index                     | YES     | YES   |
| wait/io/file/sql/casetest                         | YES     | YES   |
| wait/io/file/sql/dbopt                            | YES     | YES   |
...
```

Cada instrument que é adicionado ao código-fonte fornece uma linha para a tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"), mesmo quando o código instrumentado não é executado. Quando um instrument é habilitado e executado, `instances` instrumentadas são criadas, que são visíveis nas tabelas `xxx_instances`, como [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table") ou [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table").

Modificações na maioria das linhas de [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") afetam o monitoramento imediatamente. Para alguns instruments, as modificações são eficazes apenas na inicialização do server; alterá-los em tempo de execução (`runtime`) não tem efeito. Isso afeta principalmente `mutexes`, `conditions` e `rwlocks` no server, embora possa haver outros instruments para os quais isso seja verdade.

Para mais informações sobre o papel da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") na filtragem de eventos, consulte [Seção 25.4.3, “Pré-Filtragem de Eventos”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").

A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") possui estas colunas:

* `NAME`

  O nome do instrument. Nomes de instruments podem ter múltiplas partes e formar uma hierarquia, conforme discutido em [Seção 25.6, “Convenções de Nomenclatura de Instruments do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions"). Eventos produzidos a partir da execução de um instrument têm um valor `EVENT_NAME` que é derivado do valor `NAME` do instrument. (Os eventos na verdade não têm um “nome”, mas isso fornece uma maneira de associar eventos a instruments.)

* `ENABLED`

  Indica se o instrument está habilitado. O valor é `YES` ou `NO`. Um instrument desabilitado não produz eventos. Esta coluna pode ser modificada, embora definir `ENABLED` não tenha efeito para instruments que já foram criados.

* `TIMED`

  Indica se o instrument é cronometrado (`timed`). O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora definir `TIMED` não tenha efeito para instruments que já foram criados.

  Para instruments de memória, a coluna `TIMED` em [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") é ignorada porque operações de memória não são cronometradas.

  Se um instrument habilitado não for cronometrado, o código do instrument estará habilitado, mas o `timer` não. Os eventos produzidos pelo instrument terão `NULL` para os valores de timer `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular a soma, mínimo, máximo e a média dos valores de tempo nas tabelas de Summary.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").