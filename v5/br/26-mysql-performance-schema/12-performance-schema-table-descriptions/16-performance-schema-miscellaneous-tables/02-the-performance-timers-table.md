#### 25.12.16.2 Tabela performance\_timers

A tabela `performance_timers` mostra quais temporizadores de evento estão disponíveis:

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

Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma. As linhas que não contêm `NULL` indicam quais temporizadores você pode usar em `setup_timers`. Para uma explicação sobre como o temporizador de eventos ocorre, consulte Seção 25.4.1, “Temporizador de Eventos do Schema de Desempenho”.

Nota

A partir do MySQL 5.7.21, a tabela do Schema de Desempenho `setup_timers` está desatualizada e será removida no MySQL 8.0, assim como a linha `TICKS` na tabela `performance_timers`.

A tabela `performance_timers` tem as seguintes colunas:

- `TIMER_NAME`

  O nome pelo qual se refere ao temporizador ao configurar a tabela `setup_timers`.

- `TIMER_FREQUENCY`

  O número de unidades temporizadoras por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade da CPU. Por exemplo, em um sistema com um processador de 2,4 GHz, o `CYCLE` pode estar próximo de 2400000000.

- `TIMER_RESOLUTION`

  Indica o número de unidades de temporizador pelas quais os valores do temporizador aumentam. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

- `TIMER_OVERHEAD`

  O número mínimo de ciclos de overhead para obter um temporizador com o temporizador dado. O Schema de Desempenho determina esse valor ao invocar o temporizador 20 vezes durante a inicialização e selecionar o menor valor. O overhead total é realmente o dobro desse valor porque o instrumentação invoca o temporizador no início e no final de cada evento. O código do temporizador é chamado apenas para eventos temporizados, então esse overhead não se aplica para eventos não temporizados.

A operação `TRUNCATE TABLE` não é permitida para a tabela `performance_timers`.
