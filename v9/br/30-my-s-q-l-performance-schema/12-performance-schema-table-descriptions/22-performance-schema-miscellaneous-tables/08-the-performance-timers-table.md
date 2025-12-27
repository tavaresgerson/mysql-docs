#### 29.12.22.8 A tabela `performance_timers`

A tabela `performance_timers` mostra quais temporizadores de evento estão disponíveis:

```
mysql> SELECT * FROM performance_schema.performance_timers;
+-------------+-----------------+------------------+----------------+
| TIMER_NAME  | TIMER_FREQUENCY | TIMER_RESOLUTION | TIMER_OVERHEAD |
+-------------+-----------------+------------------+----------------+
| CYCLE       |      2389029850 |                1 |             72 |
| NANOSECOND  |      1000000000 |                1 |            112 |
| MICROSECOND |         1000000 |                1 |            136 |
| MILLISECOND |            1036 |                1 |            168 |
| THREAD_CPU  |       339101694 |                1 |            798 |
+-------------+-----------------+------------------+----------------+
```

Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma. Para uma explicação sobre como o temporizador de eventos ocorre, consulte a Seção 29.4.1, “Temporizador de Eventos do Schema de Desempenho”.

A tabela `performance_timers` tem as seguintes colunas:

* `TIMER_NAME`

  O nome do temporizador.

* `TIMER_FREQUENCY`

  O número de unidades de temporizador por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade do processador. Por exemplo, em um sistema com um processador de 2,4 GHz, o `CYCLE` pode ser próximo de 2400000000.

* `TIMER_RESOLUTION`

  Indica o número de unidades de temporizador pelas quais os valores do temporizador aumentam. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

* `TIMER_OVERHEAD`

  O número mínimo de ciclos de overhead para obter um temporizador com o temporizador dado. O Schema de Desempenho determina esse valor invocando o temporizador 20 vezes durante a inicialização e selecionando o menor valor. O overhead total realmente é o dobro desse valor porque o instrumentação invoca o temporizador no início e no final de cada evento. O código do temporizador é chamado apenas para eventos temporizados, então esse overhead não se aplica para eventos não temporizados.

A tabela `performance_timers` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `performance_timers`.