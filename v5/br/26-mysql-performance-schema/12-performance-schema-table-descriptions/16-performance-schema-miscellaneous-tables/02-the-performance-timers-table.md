#### 25.12.16.2 A Tabela performance_timers

A tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 A Tabela performance_timers") mostra quais *event timers* estão disponíveis:

```sql
mysql> SELECT * FROM performance_schema.performance_timers;
+-------------+-----------------+------------------+----------------+
| TIMER_NAME  | TIMER_FREQUENCY | TIMER_RESOLUTION | TIMER_OVERHEAD |
+-------------+-----------------+------------------+----------------+
| CYCLE       |      2389029850 |                1 |             72 |
| NANOSECOND  |      1000000000 |                1 |            112 |
| MICROSECOND |         1000000 |                1 |            136 |
| MILLISECOND |            1036 |                1 |            168 |
| TICK        |             105 |                1 |           2416 |
+-------------+-----------------+------------------+----------------+
```

Se os valores associados a um determinado nome de *timer* forem `NULL`, esse *timer* não é suportado em sua plataforma. As linhas que não contêm `NULL` indicam quais *timers* você pode usar em [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 A Tabela setup_timers"). Para uma explicação sobre como o *event timing* ocorre, veja [Seção 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

Nota

A partir do MySQL 5.7.21, a tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 A Tabela setup_timers") do Performance Schema está depreciada e foi removida no MySQL 8.0, assim como a linha `TICKS` na tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 A Tabela performance_timers").

A tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 A Tabela performance_timers") possui estas colunas:

* `TIMER_NAME`

  O nome pelo qual o *timer* deve ser referenciado ao configurar a tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 A Tabela setup_timers").

* `TIMER_FREQUENCY`

  O número de unidades de *timer* por segundo. Para um *cycle timer*, a *frequency* está geralmente relacionada à velocidade da CPU. Por exemplo, em um sistema com um processador de 2.4GHz, o `CYCLE` pode estar próximo de 2400000000.

* `TIMER_RESOLUTION`

  Indica o número de unidades de *timer* pelo qual os valores do *timer* aumentam. Se um *timer* tem uma *resolution* de 10, seu valor aumenta em 10 a cada vez.

* `TIMER_OVERHEAD`

  O número mínimo de ciclos de *overhead* para obter um *timing* com o *timer* fornecido. O Performance Schema determina esse valor invocando o *timer* 20 vezes durante a inicialização e escolhendo o menor valor. O *overhead* total é, na verdade, o dobro desse valor, pois a instrumentação invoca o *timer* no início e no fim de cada *event*. O código do *timer* é chamado apenas para *timed events* (eventos temporizados), portanto, esse *overhead* não se aplica a *nontimed events* (eventos não temporizados).

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 Declaração TRUNCATE TABLE") não é permitido para a tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 A Tabela performance_timers").