## 25.4 Configuração Runtime do Performance Schema

[25.4.1 Tempo de Eventos do Performance Schema (Performance Schema Event Timing)](performance-schema-timing.html)

[25.4.2 Filtragem de Eventos do Performance Schema (Performance Schema Event Filtering)](performance-schema-filtering.html)

[25.4.3 Pré-filtragem de Eventos (Event Pre-Filtering)](performance-schema-pre-filtering.html)

[25.4.4 Pré-filtragem por Instrument (Pre-Filtering by Instrument)](performance-schema-instrument-filtering.html)

[25.4.5 Pré-filtragem por Object (Pre-Filtering by Object)](performance-schema-object-filtering.html)

[25.4.6 Pré-filtragem por Thread (Pre-Filtering by Thread)](performance-schema-thread-filtering.html)

[25.4.7 Pré-filtragem por Consumer (Pre-Filtering by Consumer)](performance-schema-consumer-filtering.html)

[25.4.8 Exemplos de Configurações de Consumer (Example Consumer Configurations)](performance-schema-consumer-configurations.html)

[25.4.9 Nomenclatura de Instruments ou Consumers para Operações de Filtragem (Naming Instruments or Consumers for Filtering Operations)](performance-schema-filtering-names.html)

[25.4.10 Determinando o que é Instrumented (Determining What Is Instrumented)](performance-schema-instrumentation-checking.html)

Recursos específicos do Performance Schema podem ser habilitados em *runtime* para controlar quais tipos de coleta de eventos ocorrem.

As tabelas de *setup* do Performance Schema contêm informações sobre a configuração de monitoramento:

```sql
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME LIKE 'setup%';
+-------------------+
| TABLE_NAME        |
+-------------------+
| setup_actors      |
| setup_consumers   |
| setup_instruments |
| setup_objects     |
| setup_timers      |
+-------------------+
```

Você pode examinar o conteúdo dessas tabelas para obter informações sobre as características de monitoramento do Performance Schema. Se você tiver o privilégio [`UPDATE`](privileges-provided.html#priv_update), você pode alterar a operação do Performance Schema modificando as tabelas de *setup* para afetar como o monitoramento ocorre. Para detalhes adicionais sobre essas tabelas, consulte [Section 25.12.2, “Performance Schema Setup Tables”](performance-schema-setup-tables.html "25.12.2 Performance Schema Setup Tables").

Para ver quais *timers* de evento estão selecionados, consulte (*query*) a tabela [`setup_timers`]:

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

O valor de `NAME` indica o tipo de *instrument* ao qual o *timer* se aplica, e `TIMER_NAME` indica qual *timer* se aplica a esses *instruments*. O *timer* se aplica aos *instruments* cujo nome começa com um elemento que corresponde ao valor de `NAME`.

Para alterar o *timer*, atualize o valor de `NAME`. Por exemplo, para usar o *timer* `NANOSECOND` para o *timer* de `wait`:

```sql
mysql> UPDATE performance_schema.setup_timers
       SET TIMER_NAME = 'NANOSECOND'
       WHERE NAME = 'wait';
mysql> SELECT * FROM performance_schema.setup_timers;
+-------------+-------------+
| NAME        | TIMER_NAME  |
+-------------+-------------+
| idle        | MICROSECOND |
| wait        | NANOSECOND  |
| stage       | NANOSECOND  |
| statement   | NANOSECOND  |
| transaction | NANOSECOND  |
+-------------+-------------+
```

Para discussão sobre *timers*, consulte [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

As tabelas [`setup_instruments`] e [`setup_consumers`] listam os *instruments* para os quais os eventos podem ser coletados e os tipos de *consumers* para os quais as informações de evento são de fato coletadas, respectivamente. Outras tabelas de *setup* permitem modificações adicionais na configuração de monitoramento. [Section 25.4.2, “Performance Schema Event Filtering”](performance-schema-filtering.html "25.4.2 Performance Schema Event Filtering"), discute como você pode modificar essas tabelas para afetar a coleta de eventos.

Se houver mudanças na configuração do Performance Schema que devam ser feitas em *runtime* usando comandos SQL e você quiser que essas alterações entrem em vigor toda vez que o servidor for iniciado, coloque os comandos em um arquivo e inicie o servidor com a variável de sistema [`init_file`] definida para nomear o arquivo. Esta estratégia também pode ser útil se você tiver várias configurações de monitoramento, cada uma adaptada para produzir um tipo diferente de monitoramento, como monitoramento casual da saúde do servidor, investigação de incidentes, solução de problemas de comportamento de aplicação e assim por diante. Coloque os comandos para cada configuração de monitoramento em seu próprio arquivo e especifique o arquivo apropriado como o valor de [`init_file`] ao iniciar o servidor.