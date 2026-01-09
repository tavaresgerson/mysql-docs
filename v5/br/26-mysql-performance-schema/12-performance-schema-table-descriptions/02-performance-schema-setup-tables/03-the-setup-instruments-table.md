#### 25.12.2.3 A tabela setup_instruments

A tabela `setup_instruments` lista as classes de objetos instrumentados para os quais eventos podem ser coletados:

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

Cada instrumento adicionado ao código-fonte fornece uma linha para a tabela `setup_instruments`, mesmo quando o código instrumentado não é executado. Quando um instrumento é habilitado e executado, instâncias instrumentadas são criadas, que são visíveis nas tabelas `xxx_instances`, como `file_instances` ou `rwlock_instances`.

As modificações na maioria das linhas de `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes ao iniciar o servidor; alterá-las em tempo de execução não tem efeito. Isso afeta principalmente mútues, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

Para obter mais informações sobre o papel da tabela `setup_instruments` no filtro de eventos, consulte Seção 25.4.3, “Pré-filtro de Eventos”.

A tabela `setup_instruments` tem as seguintes colunas:

- `NOME`

  O nome do instrumento. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido em Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”. Os eventos gerados pela execução de um instrumento têm um valor `EVENT_NAME` que é obtido do valor `NAME` do instrumento. (Os eventos não têm realmente um “nome”, mas isso fornece uma maneira de associar eventos a instrumentos.)

- `ativado`

  Se o instrumento está habilitado. O valor é `SIM` ou `NÃO`. Um instrumento desabilitado não produz eventos. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para instrumentos que já foram criados.

- `TIMED`

  Se o instrumento é temporizado. O valor é `SIM` ou `NÃO`. Esta coluna pode ser modificada, embora a definição de `TIMED` não tenha efeito para instrumentos que já foram criados.

  Para instrumentos de memória, a coluna `TIMED` em `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

  Se um instrumento habilitado não estiver temporizado, o código do instrumento será habilitado, mas o temporizador não. Os eventos gerados pelo instrumento terão `NULL` para os valores de temporizador `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de tempo de soma, mínimo, máximo e média nas tabelas de resumo.

A operação `TRUNCATE TABLE` não é permitida para a tabela `setup_instruments`.
