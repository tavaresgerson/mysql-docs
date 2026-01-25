### 25.4.1 Temporização de Eventos do Performance Schema

Events são coletados por meio de instrumentation adicionada ao código-fonte do servidor. Os Instruments cronometram (time) os Events, que é como o Performance Schema fornece uma ideia de quanto tempo os Events demoram. Também é possível configurar os Instruments para não coletarem informações de timing. Esta seção discute os Timers disponíveis e suas características, e como os valores de timing são representados nos Events.

#### Timers do Performance Schema

Duas tabelas do Performance Schema fornecem informações sobre Timer:

* [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") lista os Timers disponíveis e suas características.

* [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") indica quais Timers são usados para quais Instruments.

Cada linha de Timer em [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") deve se referir a um dos Timers listados em [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table").

Os Timers variam em precision e quantidade de overhead. Para ver quais Timers estão disponíveis e suas características, verifique a tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table"):

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

Se os valores associados a um determinado nome de Timer forem `NULL`, esse Timer não é suportado na sua plataforma. As linhas que não contêm `NULL` indicam quais Timers você pode usar em [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table").

As colunas têm os seguintes significados:

* A coluna `TIMER_NAME` mostra os nomes dos Timers disponíveis. `CYCLE` refere-se ao Timer baseado no contador de ciclo da CPU (processador). Os Timers em [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") que você pode usar são aqueles que não possuem `NULL` nas outras colunas. Se os valores associados a um determinado nome de Timer forem `NULL`, esse Timer não é suportado na sua plataforma.

* `TIMER_FREQUENCY` indica o número de unidades de Timer por segundo. Para um Timer de ciclo, a frequency está geralmente relacionada à velocidade da CPU. O valor mostrado foi obtido em um sistema com processador de 2.4GHz. Os outros Timers são baseados em frações fixas de segundos. Para `TICK`, a frequency pode variar por plataforma (por exemplo, algumas usam 100 ticks/segundo, outras 1000 ticks/segundo).

* `TIMER_RESOLUTION` indica o número de unidades de Timer pelas quais os valores do Timer aumentam de cada vez. Se um Timer tem uma resolution de 10, seu valor aumenta em 10 a cada vez.

* `TIMER_OVERHEAD` é o número mínimo de ciclos de overhead para obter um timing com o Timer fornecido. O overhead por Event é o dobro do valor exibido porque o Timer é invocado no início e no fim do Event.

Para ver quais Timers estão em vigor ou para alterá-los, acesse a tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table"):

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

mysql> UPDATE performance_schema.setup_timers
       SET TIMER_NAME = 'MICROSECOND'
       WHERE NAME = 'idle';
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

Por padrão, o Performance Schema usa o melhor Timer disponível para cada tipo de Instrument, mas você pode selecionar um diferente.

Para cronometrar (time) os wait events, o critério mais importante é reduzir o overhead, possivelmente às custas da accuracy do Timer, portanto, usar o Timer `CYCLE` é a melhor opção.

O tempo que um statement (ou stage) leva para ser executado é, em geral, ordens de magnitude maior do que o tempo que leva para executar um único wait. Para cronometrar statements, o critério mais importante é ter uma medida accurate, que não seja afetada por mudanças na frequency do processador, portanto, usar um Timer que não seja baseado em ciclos é a melhor opção. O Timer padrão para statements é `NANOSECOND`. O "overhead" extra em comparação com o Timer `CYCLE` não é significativo, porque o overhead causado pela chamada de um Timer duas vezes (uma vez quando o statement começa, e outra quando termina) é ordens de magnitude menor em comparação com o tempo de CPU usado para executar o próprio statement. Usar o Timer `CYCLE` não traz benefício aqui, apenas desvantagens.

A precision oferecida pelo contador de ciclo depende da velocidade do processador. Se o processador rodar a 1 GHz (um bilhão de ciclos/segundo) ou mais, o contador de ciclo oferece precision sub-nanosecond. Usar o contador de ciclo é muito mais barato do que obter o horário real do dia. Por exemplo, a função padrão `gettimeofday()` pode levar centenas de ciclos, o que é um overhead inaceitável para coleta de dados que pode ocorrer milhares ou milhões de vezes por segundo.

Os contadores de ciclo também têm desvantagens:

* Usuários finais esperam ver timings em unidades de wall-clock (tempo real), como frações de segundo. Converter de ciclos para frações de segundo pode ser caro. Por esse motivo, a conversão é uma operação de multiplicação rápida e razoavelmente grosseira.

* A taxa de ciclo do processador pode mudar, como quando um laptop entra em modo de economia de energia ou quando uma CPU desacelera para reduzir a geração de calor. Se a taxa de ciclo de um processador flutua, a conversão de ciclos para unidades de tempo real está sujeita a erro.

* Contadores de ciclo podem ser não confiáveis ou indisponíveis dependendo do processador ou do sistema operacional. Por exemplo, em Pentiums, a instruction é `RDTSC` (uma instruction em linguagem assembly em vez de C) e é teoricamente possível para o sistema operacional impedir que programas em modo de usuário a utilizem.

* Alguns detalhes do processador relacionados à execução fora de ordem (out-of-order execution) ou à sincronização multiprocessador podem fazer com que o contador pareça rápido ou lento em até 1000 ciclos.

O MySQL funciona com contadores de ciclo em x386 (Windows, macOS, Linux, Solaris e outros 'sabores' Unix), PowerPC e IA-64.

#### Representação do Timer do Performance Schema nos Events

As linhas nas tabelas do Performance Schema que armazenam current events e historical events têm três colunas para representar informações de timing: `TIMER_START` e `TIMER_END` indicam quando um Event começou e terminou, e `TIMER_WAIT` indica a duration do Event.

A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") tem uma coluna `ENABLED` para indicar os Instruments para os quais coletar Events. A tabela também tem uma coluna `TIMED` para indicar quais Instruments são cronometrados (timed). Se um Instrument não estiver enabled, ele não produz Events. Se um Instrument enabled não for timed, os Events produzidos pelo Instrument terão `NULL` para os valores de Timer `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular valores de tempo agregados nas summary tables (soma, mínimo, máximo e average).

Internamente, os tempos dentro dos Events são armazenados em unidades dadas pelo Timer em vigor quando o timing do Event começa. Para exibição, quando os Events são recuperados das tabelas do Performance Schema, os tempos são mostrados em picoseconds (trilionésimos de segundo) para normalizá-los a uma unidade padrão, independentemente do Timer selecionado.

Modificações na tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") afetam o monitoramento imediatamente. Events já em andamento podem usar o Timer original para o tempo de início e o novo Timer para o tempo de fim. Para evitar resultados imprevisíveis após fazer alterações no Timer, use [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para redefinir as estatísticas do Performance Schema.

O baseline do Timer ("tempo zero") ocorre na inicialização do Performance Schema durante o startup do servidor. Os valores `TIMER_START` e `TIMER_END` nos Events representam picoseconds desde o baseline. Os valores `TIMER_WAIT` são durations em picoseconds.

Os valores em picoseconds nos Events são aproximados. Sua accuracy está sujeita às formas usuais de erro associadas à conversão de uma unidade para outra. Se o Timer `CYCLE` for usado e a taxa do processador variar, pode haver drift (deriva). Por essas razões, não é razoável considerar o valor `TIMER_START` para um Event como uma medida accurate do tempo decorrido desde o startup do servidor. Por outro lado, é razoável usar os valores `TIMER_START` ou `TIMER_WAIT` em cláusulas `ORDER BY` para ordenar Events por tempo de início ou duration.

A escolha de picoseconds nos Events, em vez de um valor como microseconds, tem uma base em performance. Um objetivo de implementação era mostrar resultados em uma unidade de tempo uniforme, independentemente do Timer. Em um mundo ideal, essa unidade de tempo se pareceria com uma unidade de wall-clock e seria razoavelmente precise; em outras palavras, microseconds. Mas para converter ciclos ou nanoseconds em microseconds, seria necessário realizar uma divisão para cada instrumentation. A divisão é dispendiosa em muitas plataformas. A multiplicação não é dispendiosa, então é isso que é usado. Portanto, a unidade de tempo é um múltiplo inteiro do valor `TIMER_FREQUENCY` mais alto possível, usando um multiplicador grande o suficiente para garantir que não haja perda de precision significativa. O resultado é que a unidade de tempo é "picoseconds". Esta precision é espúria, mas a decisão permite que o overhead seja minimizado.

Enquanto um wait, stage, statement ou transaction event estiver sendo executado, as respectivas tabelas de current-event exibem informações de timing do current-event:

```sql
events_waits_current
events_stages_current
events_statements_current
events_transactions_current
```

Para tornar possível determinar por quanto tempo um Event ainda não concluído está em execução, as colunas do Timer são definidas da seguinte forma:

* `TIMER_START` é preenchido.
* `TIMER_END` é preenchido com o valor atual do Timer.

* `TIMER_WAIT` é preenchido com o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

Events que ainda não foram concluídos têm um valor `END_EVENT_ID` de `NULL`. Para avaliar o tempo decorrido até agora para um Event, use a coluna `TIMER_WAIT`. Portanto, para identificar Events que ainda não foram concluídos e que demoraram mais do que *`N`* picoseconds até o momento, os aplicativos de monitoramento podem usar esta expression em Queries:

```sql
WHERE END_EVENT_ID IS NULL AND TIMER_WAIT > N
```

A identificação de Events, conforme descrita, pressupõe que os Instruments correspondentes tenham `ENABLED` e `TIMED` definidos como `YES` e que os consumers relevantes estejam enabled.