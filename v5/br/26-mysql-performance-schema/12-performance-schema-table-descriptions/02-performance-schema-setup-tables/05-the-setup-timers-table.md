#### 25.12.2.5 A Tabela setup_timers

A tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") mostra os Timers de evento atualmente selecionados:

```sql
mysql> SELECT * FROM performance_schema.setup_timers;
+-------------+-------------+
| NAME        | TIMER_NAME  |
+-------------+-------------+
| idle        | MICROSECOND |
| wait        | CYCLE       |
| stage       | NANOSECOND  |
| statement   | NANOSECOND  |
| transaction | NANOSECOND  |
+-------------+-------------+
```

Nota

A partir do MySQL 5.7.21, a tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") do Performance Schema está obsoleta (deprecated) e será removida no MySQL 8.0, assim como a linha `TICKS` na tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table").

O valor de `setup_timers.TIMER_NAME` pode ser alterado para selecionar um Timer diferente. O valor pode ser qualquer um dos valores na coluna `performance_timers.TIMER_NAME`. Para uma explicação de como o timing (temporização) de eventos ocorre, veja [Seção 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

Modificações na tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") afetam o monitoramento imediatamente. Eventos que já estão em andamento podem usar o Timer original para o tempo de início e o novo Timer para o tempo de fim. Para evitar resultados imprevisíveis após realizar alterações no Timer, use [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para redefinir as estatísticas do Performance Schema.

A tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") possui as seguintes colunas:

* `NAME`

  O tipo de instrumento para o qual o Timer é usado.

* `TIMER_NAME`

  O Timer que se aplica ao tipo de instrumento. Esta coluna pode ser modificada.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table").