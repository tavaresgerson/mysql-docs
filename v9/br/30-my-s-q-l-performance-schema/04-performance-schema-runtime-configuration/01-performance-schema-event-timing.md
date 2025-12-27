### 29.4.1 Tempo de Ocorrência dos Eventos do Schema de Desempenho

Os eventos são coletados por meio de instrumentação adicionada ao código-fonte do servidor. Os instrumentos medem o tempo dos eventos, o que permite ao Schema de Desempenho fornecer uma ideia de quanto tempo os eventos levam. Também é possível configurar os instrumentos para não coletar informações de tempo. Esta seção discute os temporizadores disponíveis e suas características, bem como como os valores de tempo são representados nos eventos.

#### Temporizadores do Schema de Desempenho

Os temporizadores do Schema de Desempenho variam em precisão e quantidade de overhead. Para ver quais temporizadores estão disponíveis e suas características, verifique a tabela `performance_timers`:

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

Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma.

As colunas têm esses significados:

* A coluna `TIMER_NAME` mostra os nomes dos temporizadores disponíveis. `CYCLE` refere-se ao temporizador baseado no contador de ciclos do CPU (processador).

* `TIMER_FREQUENCY` indica o número de unidades de tempo por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade do CPU. O valor mostrado foi obtido em um sistema com um processador de 2,4 GHz. Os outros temporizadores são baseados em frações fixas de segundos.

* `TIMER_RESOLUTION` indica o número de unidades de tempo pelas quais os valores do temporizador aumentam em um momento. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

* `TIMER_OVERHEAD` é o número mínimo de ciclos de overhead para obter um tempo com o temporizador dado. O overhead por evento é o dobro do valor exibido porque o temporizador é invocado no início e no final do evento.

O Schema de Desempenho atribui temporizadores da seguinte forma:

* O temporizador de espera usa `CYCLE`.
* Os temporizadores de inatividade, estágio, declaração e transação usam `NANOSECOND` em plataformas onde o temporizador `NANOSECOND` está disponível, `MICROSECOND` caso contrário.

Ao inicializar o servidor, o Schema de Desempenho verifica se as suposições feitas durante a construção sobre as atribuições dos temporizadores estão corretas e exibe uma mensagem de aviso se um temporizador não estiver disponível.

Para medir eventos de espera, o critério mais importante é reduzir o overhead, às custas da precisão do temporizador, então usar o temporizador `CYCLE` é o melhor.

O tempo que uma declaração (ou estágio) leva para ser executada é, em geral, de ordens de grandeza maior do que o tempo que leva para executar uma única espera. Para medir declarações, o critério mais importante é ter uma medida precisa, que não é afetada por mudanças na frequência do processador, então usar um temporizador que não seja baseado em ciclos é o melhor. O temporizador padrão para declarações é `NANOSECOND`. O "overhead" extra em comparação com o temporizador `CYCLE` não é significativo, porque o overhead causado por chamar um temporizador duas vezes (uma vez quando a declaração começa, uma vez quando ela termina) é de ordens de grandeza menor em comparação com o tempo de CPU usado para executar a própria declaração. Usar o temporizador `CYCLE` não traz nenhum benefício aqui, apenas desvantagens.

A precisão oferecida pelo contador de ciclos depende da velocidade do processador. Se o processador funcionar a 1 GHz (um bilhão de ciclos/segundo) ou mais, o contador de ciclos oferece precisão sub-nanosegundo. Usar o contador de ciclos é muito mais barato do que obter o horário exato do dia. Por exemplo, a função padrão `gettimeofday()` pode levar centenas de ciclos, o que é um overhead inaceitável para a coleta de dados que pode ocorrer milhares ou milhões de vezes por segundo.

Os contadores de ciclos também têm desvantagens:

* Os usuários finais esperam ver os tempos em unidades de relógio de parede, como frações de segundo. A conversão de ciclos para frações de segundos pode ser cara. Por essa razão, a conversão é uma operação de multiplicação rápida e bastante grosseira.

* A taxa de ciclos do processador pode mudar, como quando um laptop entra no modo de economia de energia ou quando uma CPU desacelera para reduzir a geração de calor. Se a taxa de ciclos de um processador flutuar, a conversão de ciclos para unidades em tempo real está sujeita a erros.

* Os contadores de ciclos podem ser pouco confiáveis ou indisponíveis, dependendo do processador ou do sistema operacional. Por exemplo, em Pentiums, a instrução é `RDTSC` (uma linguagem de montagem, e não uma instrução em C) e, teoricamente, é possível que o sistema operacional impeça programas em modo de usuário de usá-la.

* Alguns detalhes do processador relacionados à execução fora de ordem ou à sincronização de multiprocessadores podem fazer com que o contador pareça rápido ou lento em até 1000 ciclos.

O MySQL trabalha com contadores de ciclos em x386 (Windows, macOS, Linux, Solaris e outras versões do Unix), PowerPC e IA-64.

#### Representação do Temporizador do Schema de Desempenho em Eventos

As linhas nas tabelas do Schema de Desempenho que armazenam eventos atuais e históricos têm três colunas para representar informações de tempo: `TIMER_START` e `TIMER_END` indicam quando um evento começou e terminou, e `TIMER_WAIT` indica a duração do evento.

A tabela `setup_instruments` possui uma coluna `ENABLED` para indicar os instrumentos para os quais os eventos serão coletados. A tabela também possui uma coluna `TIMED` para indicar quais instrumentos são temporizados. Se um instrumento não estiver habilitado, ele não produzirá eventos. Se um instrumento habilitado não estiver temporizado, os eventos produzidos pelo instrumento terão `NULL` para os valores dos temporizadores `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de tempo agregados em tabelas de resumo (soma, mínimo, máximo e média).

Internacionalmente, os tempos dentro dos eventos são armazenados em unidades determinadas pelo temporizador em vigor quando o temporização do evento começa. Para exibição ao recuperar eventos das tabelas do Performance Schema, os tempos são mostrados em picosegundos (trilhésimos de segundo) para normalizá-los a uma unidade padrão, independentemente do temporizador selecionado.

A linha de base do temporizador (“zero de tempo”) ocorre durante a inicialização do Performance Schema durante a inicialização do servidor. Os valores `TIMER_START` e `TIMER_END` nos eventos representam picosegundos desde a linha de base. Os valores `TIMER_WAIT` são durações em picosegundos.

Os valores em picosegundos nos eventos são aproximados. Sua precisão está sujeita às formas usuais de erro associadas à conversão de uma unidade para outra. Se o temporizador `CYCLE` for usado e a taxa do processador variar, pode haver um desvio. Por essas razões, não é razoável olhar para o valor `TIMER_START` de um evento como uma medida precisa do tempo decorrido desde a inicialização do servidor. Por outro lado, é razoável usar os valores `TIMER_START` ou `TIMER_WAIT` nas cláusulas `ORDER BY` para ordenar os eventos pelo tempo de início ou duração.

A escolha de picosegundos em eventos em vez de um valor como microsegundos tem uma base de desempenho. Um objetivo da implementação foi mostrar os resultados em uma unidade de tempo uniforme, independentemente do temporizador. Em um mundo ideal, essa unidade de tempo seria semelhante a uma unidade de relógio de parede e seria razoavelmente precisa; em outras palavras, microsegundos. Mas para converter ciclos ou nanosegundos em microsegundos, seria necessário realizar uma divisão para cada instrumentação. A divisão é cara em muitas plataformas. A multiplicação não é cara, então isso é o que é usado. Portanto, a unidade de tempo é um múltiplo inteiro do valor mais alto possível de `TIMER_FREQUENCY`, usando um multiplicador grande o suficiente para garantir que não haja perda significativa de precisão. O resultado é que a unidade de tempo é “picosegundos”. Essa precisão é espúria, mas a decisão permite que o overhead seja minimizado.

Enquanto um evento de espera, etapa, declaração ou transação está sendo executado, as tabelas de eventos atuais respetivos exibem informações de temporização de eventos atuais:

```
events_waits_current
events_stages_current
events_statements_current
events_transactions_current
```

Para possibilitar determinar quanto tempo um evento ainda não concluído está em execução, as colunas do temporizador são definidas da seguinte forma:

* `TIMER_START` é preenchido.
* `TIMER_END` é preenchido com o valor atual do temporizador.

* `TIMER_WAIT` é preenchido com o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

Eventos que ainda não foram concluídos têm um valor `END_EVENT_ID` de `NULL`. Para avaliar o tempo decorrido até agora para um evento, use a coluna `TIMER_WAIT`. Portanto, para identificar eventos que ainda não foram concluídos e que levaram mais tempo do que *`N`* picosegundos até agora, as aplicações de monitoramento podem usar essa expressão em consultas:

```
WHERE END_EVENT_ID IS NULL AND TIMER_WAIT > N
```

A identificação de eventos conforme descrito acima pressupõe que os instrumentos correspondentes tenham `ENABLED` e `TIMED` configurados como `YES` e que os consumidores relevantes estejam habilitados.