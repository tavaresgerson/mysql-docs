### 25.4.1 Cronometragem de eventos do esquema de desempenho

Os eventos são coletados por meio de instrumentos adicionados ao código-fonte do servidor. Os instrumentos registram o tempo dos eventos, o que permite que o Schema de Desempenho forneça uma ideia de quanto tempo os eventos levam. Também é possível configurar os instrumentos para não coletar informações de temporização. Esta seção discute os temporizadores disponíveis e suas características, bem como como os valores de temporização são representados nos eventos.

#### Temporizadores do Schema de Desempenho

Duas tabelas do esquema de desempenho fornecem informações sobre o temporizador:

- `performance_timers` lista os temporizadores disponíveis e suas características.

- `setup_timers` indica quais temporizadores são usados para quais instrumentos.

Cada linha de temporizador em `setup_timers` deve se referir a um dos temporizadores listados em `performance_timers`.

Os temporizadores variam em precisão e quantidade de overhead. Para ver quais temporizadores estão disponíveis e suas características, verifique a tabela `performance_timers`:

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

Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma. As linhas que não contêm `NULL` indicam quais temporizadores você pode usar em `setup_timers`.

As colunas têm esses significados:

- A coluna `TIMER_NAME` mostra os nomes dos temporizadores disponíveis. `CYCLE` refere-se ao temporizador baseado no contador de ciclos da CPU (processador). Os temporizadores em `setup_timers` que você pode usar são aqueles que não têm `NULL` nas outras colunas. Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma.

- `TIMER_FREQUENCY` indica o número de unidades de temporizador por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade da CPU. O valor mostrado foi obtido em um sistema com um processador de 2,4 GHz. Os outros temporizadores são baseados em frações fixas de segundos. Para `TICK`, a frequência pode variar de acordo com a plataforma (por exemplo, alguns usam 100 ticks/segundo, outros 1000 ticks/segundo).

- `TIMER_RESOLUTION` indica o número de unidades de temporizador com as quais os valores do temporizador aumentam de cada vez. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

- `TIMER_OVERHEAD` é o número mínimo de ciclos de sobrecarga para obter um temporizador com o temporizador fornecido. A sobrecarga por evento é o dobro do valor exibido, pois o temporizador é invocado no início e no final do evento.

Para ver quais temporizadores estão em vigor ou para alterá-los, acesse a tabela `setup_timers`:

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

Por padrão, o Schema de Desempenho usa o melhor temporizador disponível para cada tipo de instrumento, mas você pode selecionar um diferente.

Para cronometrar eventos de espera, o critério mais importante é reduzir o overhead, às custas da precisão do temporizador, portanto, usar o temporizador `CYCLE` é o melhor.

O tempo que uma instrução (ou etapa) leva para ser executada é, em geral, de ordens de grandeza maior do que o tempo que leva para executar uma única espera. Para medir instruções, o critério mais importante é ter uma medida precisa, que não é afetada por mudanças na frequência do processador, então o melhor é usar um temporizador que não seja baseado em ciclos. O temporizador padrão para instruções é `NANOSECOND`. O "sobrecarga" extra em comparação com o temporizador `CYCLE` não é significativa, porque a sobrecarga causada por chamar um temporizador duas vezes (uma vez quando a instrução começa e outra quando ela termina) é de ordens de grandeza menor em comparação com o tempo de CPU usado para executar a própria instrução. Usar o temporizador `CYCLE` não traz nenhum benefício aqui, apenas desvantagens.

A precisão oferecida pelo contador de ciclos depende da velocidade do processador. Se o processador funcionar a 1 GHz (um bilhão de ciclos por segundo) ou mais, o contador de ciclos oferece precisão em sub-nanosegundos. Usar o contador de ciclos é muito mais barato do que obter o horário exato do dia. Por exemplo, a função padrão `gettimeofday()` pode levar centenas de ciclos, o que é um desperdício inaceitável para a coleta de dados que pode ocorrer milhares ou milhões de vezes por segundo.

Os contadores de ciclos também têm desvantagens:

- Os usuários finais esperam ver os tempos em unidades de relógio de parede, como frações de segundo. A conversão de ciclos para frações de segundos pode ser cara. Por essa razão, a conversão é uma operação de multiplicação rápida e bastante grosseira.

- A taxa de ciclo do processador pode mudar, como quando um laptop entra no modo de economia de energia ou quando uma CPU desacelera para reduzir a geração de calor. Se a taxa de ciclo de um processador flutuar, a conversão de ciclos para unidades em tempo real está sujeita a erros.

- Os contadores de ciclos podem não ser confiáveis ou indisponíveis, dependendo do processador ou do sistema operacional. Por exemplo, em Pentiums, a instrução é `RDTSC` (uma linguagem de montagem, e não uma instrução em C) e, teoricamente, é possível que o sistema operacional impeça programas em modo de usuário de usá-la.

- Alguns detalhes do processador relacionados à execução fora de ordem ou à sincronização de múltiplos processadores podem fazer com que o contador pareça rápido ou lento em até 1000 ciclos.

O MySQL funciona com contadores de ciclo em x386 (Windows, macOS, Linux, Solaris e outros sabores Unix), PowerPC e IA-64.

#### Tempo de execução do esquema de representação de temporizadores em eventos

As linhas nas tabelas do Gerenciamento de Desempenho que armazenam eventos atuais e históricos têm três colunas para representar informações de temporização: `TIMER_START` e `TIMER_END` indicam quando um evento começou e terminou, e `TIMER_WAIT` indica a duração do evento.

A tabela `setup_instruments` possui uma coluna `ENABLED` para indicar os instrumentos para os quais os eventos serão coletados. A tabela também possui uma coluna `TIMED` para indicar quais instrumentos são temporizados. Se um instrumento não estiver habilitado, ele não produzirá eventos. Se um instrumento habilitado não estiver temporizado, os eventos produzidos pelo instrumento terão `NULL` para os valores dos temporizadores `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de tempo agregados em tabelas resumidas (soma, mínimo, máximo e média).

Internamente, os tempos dentro dos eventos são armazenados em unidades fornecidas pelo temporizador em vigor quando o cronometramento do evento começa. Para exibição quando os eventos são recuperados das tabelas do Gerenciamento de Desempenho, os tempos são exibidos em picossegundos (trilhésimos de segundo) para normalizá-los a uma unidade padrão, independentemente do temporizador selecionado.

As modificações na tabela `setup_timers` afetam o monitoramento imediatamente. Eventos já em andamento podem usar o temporizador original para a hora de início e o novo temporizador para a hora de término. Para evitar resultados imprevisíveis após fazer alterações nos temporizadores, use `TRUNCATE TABLE` para redefinir as estatísticas do Schema de Desempenho.

A linha de base do temporizador ("zero de tempo") ocorre durante a inicialização do Schema de Desempenho durante a inicialização do servidor. Os valores `TIMER_START` e `TIMER_END` nos eventos representam picosegundos desde a linha de base. Os valores `TIMER_WAIT` são durações em picosegundos.

Os valores de picosegundos nos eventos são aproximados. Sua precisão está sujeita às formas usuais de erro associadas à conversão de uma unidade para outra. Se o temporizador `CYCLE` for usado e a taxa do processador variar, pode haver um desvio. Por essas razões, não é razoável considerar o valor de `TIMER_START` para um evento como uma medida precisa do tempo decorrido desde o início do servidor. Por outro lado, é razoável usar os valores de `TIMER_START` ou `TIMER_WAIT` nas cláusulas `ORDER BY` para ordenar os eventos pelo tempo de início ou duração.

A escolha de picossegundos em eventos em vez de um valor como microsegundos tem uma base de desempenho. Um objetivo da implementação era mostrar os resultados em uma unidade de tempo uniforme, independentemente do temporizador. Em um mundo ideal, essa unidade de tempo seria semelhante a uma unidade de relógio de parede e seria razoavelmente precisa; em outras palavras, microsegundos. Mas para converter ciclos ou nanosegundos em microsegundos, seria necessário realizar uma divisão para cada instrumento. A divisão é cara em muitas plataformas. A multiplicação não é cara, então é isso que é usado. Portanto, a unidade de tempo é um múltiplo inteiro do valor mais alto possível do `TIMER_FREQUENCY`, usando um multiplicador grande o suficiente para garantir que não haja perda significativa de precisão. O resultado é que a unidade de tempo é “picossegundos”. Essa precisão é especulativa, mas a decisão permite que o overhead seja minimizado.

Enquanto uma espera, uma etapa, uma declaração ou um evento de transação está sendo executado, as tabelas de eventos atuais respectivos exibem informações de cronometragem de eventos atuais:

```sql
events_waits_current
events_stages_current
events_statements_current
events_transactions_current
```

Para permitir determinar quanto tempo um evento ainda não concluído já está em andamento, as colunas do temporizador são definidas da seguinte forma:

- `TIMER_START` foi preenchido.

- `TIMER_END` é preenchido com o valor atual do temporizador.

- `TIMER_WAIT` é preenchido com o tempo que já passou (`TIMER_END` − `TIMER_START`).

Eventos que ainda não foram concluídos têm um valor de `END_EVENT_ID` de `NULL`. Para avaliar o tempo decorrido até o momento para um evento, use a coluna `TIMER_WAIT`. Portanto, para identificar eventos que ainda não foram concluídos e que levaram mais tempo do que *`N`* picosegundos até agora, os aplicativos de monitoramento podem usar essa expressão nas consultas:

```sql
WHERE END_EVENT_ID IS NULL AND TIMER_WAIT > N
```

A identificação de eventos conforme descrito acima pressupõe que os instrumentos correspondentes tenham `ENABLED` e `TIMED` configurados como `YES` e que os consumidores relevantes estejam habilitados.
