## 29.4 Configuração de execução do esquema de desempenho

Os recursos do esquema de desempenho específico podem ser habilitados em tempo de execução para controlar quais tipos de coleta de eventos ocorrem.

As tabelas de configuração do esquema de desempenho contêm informações sobre a configuração de monitoramento:

```
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
| setup_threads     |
+-------------------+
```

Você pode examinar o conteúdo dessas tabelas para obter informações sobre as características de monitoramento do Schema de Desempenho. Se você tiver o privilégio `UPDATE`, pode alterar a operação do Schema de Desempenho modificando as tabelas de configuração para afetar como o monitoramento ocorre. Para obter detalhes adicionais sobre essas tabelas, consulte a Seção 29.12.2, “Tabelas de Configuração do Schema de Desempenho”.

As tabelas `setup_instruments` e `setup_consumers` listam os instrumentos para os quais os eventos podem ser coletados e os tipos de consumidores para os quais as informações dos eventos são realmente coletadas, respectivamente. Outras tabelas de configuração permitem a modificação adicional da configuração de monitoramento. A Seção 29.4.2, “Filtragem de Eventos do Schema de Desempenho”, discute como você pode modificar essas tabelas para afetar a coleta de eventos.

Se houver alterações na configuração do Schema de Desempenho que devem ser feitas em tempo real usando declarações SQL e você gostaria que essas alterações tivessem efeito cada vez que o servidor é iniciado, coloque as declarações em um arquivo e inicie o servidor com a variável de sistema `init_file` definida para nomear o arquivo. Essa estratégia também pode ser útil se você tiver várias configurações de monitoramento, cada uma adaptada para produzir um tipo diferente de monitoramento, como monitoramento casual da saúde do servidor, investigação de incidentes, solução de problemas de comportamento de aplicativos, e assim por diante. Coloque as declarações para cada configuração de monitoramento em seu próprio arquivo e especifique o arquivo apropriado como o valor da variável `init_file` quando iniciar o servidor.

### 29.4.1 Tempo de cronometragem dos eventos do Schema de desempenho

Os eventos são coletados por meio de instrumentação adicionada ao código-fonte do servidor. Os instrumentos medem os eventos, o que permite que o Schema de Desempenho forneça uma ideia de quanto tempo os eventos levam. Também é possível configurar os instrumentos para não coletar informações de temporização. Esta seção discute os temporizadores disponíveis e suas características, e como os valores de temporização são representados nos eventos.

#### Cronômetros do Schema de Desempenho

Os temporizadores do esquema de desempenho variam em precisão e quantidade de sobrecarga. Para ver quais temporizadores estão disponíveis e suas características, verifique a tabela `performance_timers`:

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

Se os valores associados a um nome de temporizador dado forem `NULL`, esse temporizador não é suportado na sua plataforma.

As colunas têm esses significados:

* A coluna `TIMER_NAME` mostra os nomes dos temporizadores disponíveis. `CYCLE` refere-se ao temporizador que é baseado no contador de ciclos da CPU (processador).

* `TIMER_FREQUENCY` indica o número de unidades temporizadoras por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade da CPU. O valor mostrado foi obtido em um sistema com um processador de 2,4 GHz. Os outros temporizadores são baseados em frações fixas de segundos.

* `TIMER_RESOLUTION` indica o número de unidades de temporizador pelas quais os valores do temporizador aumentam de cada vez. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

* `TIMER_OVERHEAD` é o número mínimo de ciclos de sobrecarga para obter um temporizador com o temporizador dado. A sobrecarga por evento é o dobro do valor exibido porque o temporizador é invocado no início e no final do evento.

O Schema de Desempenho atribui temporizadores da seguinte forma:

* O temporizador de espera utiliza `CYCLE`. * Os temporizadores de inatividade, estágio, declaração e transação utilizam `NANOSECOND` em plataformas onde o temporizador `NANOSECOND` está disponível, `MICROSECOND` caso contrário.

Ao iniciar o servidor, o Schema de Desempenho verifica se as suposições feitas durante a construção sobre as atribuições do temporizador estão corretas e exibe um aviso se um temporizador não estiver disponível.

Para medir eventos de espera, o critério mais importante é reduzir os custos operacionais, às custas da precisão do temporizador, portanto, o uso do temporizador `CYCLE` é o melhor.

O tempo que uma declaração (ou etapa) leva para ser executada é, em geral, de ordens de grandeza maior do que o tempo que leva para executar uma única espera. Para medir declarações, o critério mais importante é ter uma medida precisa, que não é afetada por mudanças na frequência do processador, então o melhor é usar um temporizador que não seja baseado em ciclos. O temporizador padrão para declarações é `NANOSECOND`. O "overhead" extra em comparação com o temporizador `CYCLE` não é significativo, porque o overhead causado por chamar um temporizador duas vezes (uma quando a declaração começa e outra quando ela termina) é de ordens de grandeza menor em comparação com o tempo da CPU usado para executar a própria declaração. Usar o temporizador `CYCLE` não traz benefícios aqui, apenas desvantagens.

A precisão oferecida pelo contador de ciclos depende da velocidade do processador. Se o processador funcionar a 1 GHz (um bilhão de ciclos/segundo) ou mais, o contador de ciclos oferece precisão de sub-nanosegundo. Usar o contador de ciclos é muito mais barato do que obter o horário real do dia. Por exemplo, a função padrão `gettimeofday()` pode levar centenas de ciclos, o que é um desperdício inaceitável para a coleta de dados que pode ocorrer milhares ou milhões de vezes por segundo.

Os contadores de ciclo também têm desvantagens:

* Os usuários finais esperam ver os tempos em unidades de relógio de parede, como frações de segundo. A conversão de ciclos para frações de segundos pode ser cara. Por esse motivo, a conversão é uma operação de multiplicação rápida e bastante grosseira.

* A taxa de ciclo do processador pode mudar, como quando um laptop entra no modo de economia de energia ou quando uma CPU desacelera para reduzir a geração de calor. Se a taxa de ciclo de um processador flutuar, a conversão de ciclos para unidades em tempo real está sujeita a erro.

* Os contadores de ciclo podem ser pouco confiáveis ou indisponíveis, dependendo do processador ou do sistema operacional. Por exemplo, em Pentiums, a instrução é `RDTSC` (uma linguagem de montagem, e não uma instrução em C) e, teoricamente, é possível que o sistema operacional impeça programas em modo de usuário de usá-la.

* Alguns detalhes do processador relacionados à execução fora de ordem ou à sincronização de múltiplos processadores podem fazer com que o contador pareça rápido ou lento em até 1.000 ciclos.

O MySQL funciona com contadores de ciclo em x386 (Windows, macOS, Linux, Solaris e outros sabores Unix), PowerPC e IA-64.

#### Representação do Cronômetro do Schema de Desempenho em Eventos

As linhas em tabelas do Gerador de Desempenho que armazenam eventos atuais e históricos têm três colunas para representar informações de temporização: `TIMER_START` e `TIMER_END` indicam quando um evento começou e terminou, e `TIMER_WAIT` indica a duração do evento.

A tabela `setup_instruments` possui uma coluna `ENABLED` para indicar os instrumentos para os quais os eventos devem ser coletados. A tabela também possui uma coluna `TIMED` para indicar quais instrumentos são temporizados. Se um instrumento não estiver habilitado, ele não produz eventos. Se um instrumento habilitado não for temporizado, os eventos produzidos pelo instrumento têm `NULL` para os valores do temporizador `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular valores de tempo agregados em tabelas resumidas (soma, mínimo, máximo e média).

Internamente, os tempos dentro dos eventos são armazenados em unidades fornecidas pelo temporizador em vigor quando o cronometramento do evento começa. Para exibição quando os eventos são recuperados das tabelas do Gerenciamento de desempenho, os tempos são exibidos em picosegundos (trilhões de um segundo) para normalizá-los a uma unidade padrão, independentemente do temporizador selecionado.

A linha de base do temporizador (“zero de tempo”) ocorre durante a inicialização do Schema de desempenho durante a inicialização do servidor. Os valores `TIMER_START` e `TIMER_END` nos eventos representam picosegundos desde a linha de base. Os valores `TIMER_WAIT` são durações em picosegundos.

Os valores de picosegundo nos eventos são aproximados. Sua precisão está sujeita às formas usuais de erro associadas à conversão de uma unidade para outra. Se o temporizador `CYCLE` for usado e a taxa do processador variar, pode haver um desvio. Por esses motivos, não é razoável considerar o valor do `TIMER_START` para um evento como uma medida precisa do tempo decorrido desde o início do servidor. Por outro lado, é razoável usar os valores do `TIMER_START` ou `TIMER_WAIT` nas cláusulas do `ORDER BY` para ordenar os eventos pelo horário de início ou pela duração.

A escolha de picossegundos em eventos em vez de um valor como microsegundos tem uma base de desempenho. Um objetivo da implementação era mostrar os resultados em uma unidade de tempo uniforme, independentemente do temporizador. Em um mundo ideal, essa unidade de tempo seria semelhante a uma unidade de relógio de parede e seria razoavelmente precisa; em outras palavras, microsegundos. Mas para converter ciclos ou nanosegundos em microsegundos, seria necessário realizar uma divisão para cada instrumentação. A divisão é cara em muitas plataformas. A multiplicação não é cara, então é isso que é usado. Portanto, a unidade de tempo é um múltiplo inteiro do valor mais alto possível do `TIMER_FREQUENCY`, usando um multiplicador grande o suficiente para garantir que não haja perda de precisão significativa. O resultado é que a unidade de tempo é “picossegundos”. Essa precisão é especulativa, mas a decisão permite que o overhead seja minimizado.

Enquanto uma espera, uma etapa, uma declaração ou um evento de transação está sendo executado, as tabelas de eventos atuais respectivos exibem informações de cronometragem de eventos atuais:

```
events_waits_current
events_stages_current
events_statements_current
events_transactions_current
```

Para permitir determinar quanto tempo um evento ainda não concluído já está em andamento, as colunas do temporizador são definidas da seguinte forma:

* `TIMER_START` é preenchido.
* `TIMER_END` é preenchido com o valor atual do temporizador.

* `TIMER_WAIT` é preenchido com o tempo que já passou (`TIMER_END` − `TIMER_START`).

Eventos que ainda não foram concluídos têm um valor `END_EVENT_ID`. Para avaliar o tempo que já passou para um evento, use a coluna `TIMER_WAIT`. Portanto, para identificar eventos que ainda não foram concluídos e que levaram mais tempo do que *`N`* picosegundos até agora, as aplicações de monitoramento podem usar essa expressão em consultas:

```
WHERE END_EVENT_ID IS NULL AND TIMER_WAIT > N
```

A identificação do evento conforme descrito acima pressupõe que os instrumentos correspondentes tenham `ENABLED` e `TIMED` configurados como `YES` e que os consumidores relevantes estejam habilitados.

### 29.4.2 Filtragem de eventos do Schema de desempenho

Os eventos são processados de forma de produtor/consumidor:

* O código instrumentado é a fonte dos eventos e produz eventos que devem ser coletados. A tabela `setup_instruments` lista os instrumentos para os quais os eventos podem ser coletados, se eles estão habilitados e (para instrumentos habilitados) se deve coletar informações de temporização:

  ```
  mysql> SELECT NAME, ENABLED, TIMED
         FROM performance_schema.setup_instruments;
  +---------------------------------------------------+---------+-------+
  | NAME                                              | ENABLED | TIMED |
  +---------------------------------------------------+---------+-------+
  ...
  | wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
  ...
  ```

A tabela `setup_instruments` fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou fio que está sendo monitorado, outras tabelas podem ser usadas conforme descrito na Seção 29.4.3, “Pré-filtragem de Eventos”.

* As tabelas do Schema de desempenho são os destinos para eventos e consomem eventos. A tabela `setup_consumers` lista os tipos de consumidores para os quais as informações dos eventos podem ser enviadas e se eles estão habilitados:

  ```
  mysql> SELECT * FROM performance_schema.setup_consumers;
  +----------------------------------+---------+
  | NAME                             | ENABLED |
  +----------------------------------+---------+
  | events_stages_current            | NO      |
  | events_stages_history            | NO      |
  | events_stages_history_long       | NO      |
  | events_statements_cpu            | NO      |
  | events_statements_current        | YES     |
  | events_statements_history        | YES     |
  | events_statements_history_long   | NO      |
  | events_transactions_current      | YES     |
  | events_transactions_history      | YES     |
  | events_transactions_history_long | NO      |
  | events_waits_current             | NO      |
  | events_waits_history             | NO      |
  | events_waits_history_long        | NO      |
  | global_instrumentation           | YES     |
  | thread_instrumentation           | YES     |
  | statements_digest                | YES     |
  +----------------------------------+---------+
  ```

O filtro pode ser feito em diferentes estágios do monitoramento de desempenho:

* **Pré-filtragem.** Isso é feito modificando a configuração do Gerador de desempenho, de modo que apenas certos tipos de eventos sejam coletados dos produtores, e os eventos coletados atualizem apenas certos consumidores. Para fazer isso, habilite ou desabilite instrumentos ou consumidores. A pré-filtragem é feita pelo Gerador de desempenho e tem um efeito global que se aplica a todos os usuários.

Razões para usar pré-filtragem:

+ Para reduzir os custos. O overhead do Schema de desempenho deve ser mínimo mesmo com todos os instrumentos habilitados, mas talvez você queira reduzi-lo ainda mais. Ou você não se importa com o tempo dos eventos e deseja desabilitar o código de temporização para eliminar o overhead de temporização.

+ Para evitar preencher as tabelas de eventos atuais ou de história com eventos nos quais você não está interessado. O pré-filtro deixa mais "espaço" nessas tabelas para as instâncias das linhas dos tipos de instrumento habilitados. Se você habilitar apenas instrumentos de arquivo com pré-filtro, não são coletadas linhas para instrumentos não de arquivo. Com o pós-filtro, os eventos não de arquivo são coletados, deixando menos linhas para os eventos de arquivo.

+ Para evitar manter alguns tipos de tabelas de eventos. Se você desabilitar um consumidor, o servidor não gasta tempo mantendo destinos para esse consumidor. Por exemplo, se você não se importa com os históricos de eventos, pode desabilitar os consumidores da tabela de histórico para melhorar o desempenho.

* **Pós-filtragem.** Isso envolve o uso de cláusulas `WHERE` em consultas que selecionam informações de tabelas do Gerador de Desempenho, para especificar quais dos eventos disponíveis você deseja ver. A pós-filtragem é realizada por usuário, pois cada usuário seleciona quais dos eventos disponíveis são de interesse.

Razões para usar pós-filtragem:

+ Para evitar tomar decisões sobre quais informações de eventos são de interesse para usuários individuais.

+ Para usar o Schema de Desempenho para investigar um problema de desempenho quando as restrições para impor o uso de pré-filtragem não são conhecidas antecipadamente.

As seções a seguir fornecem mais detalhes sobre o pré-filtro e fornecem diretrizes para nomear instrumentos ou consumidores em operações de filtragem. Para informações sobre como escrever consultas para recuperar informações (pós-filtragem), consulte a Seção 29.5, “Consultas do Schema de Desempenho”.

### 29.4.3 Pré-filtragem de eventos

O pré-filtro é realizado pelo Schema de Desempenho e tem um efeito global que se aplica a todos os usuários. O pré-filtro pode ser aplicado na fase de produção ou consumo do processamento de eventos:

* Para configurar o pré-filtro na fase de produção, várias tabelas podem ser utilizadas:

+ `setup_instruments` indica quais instrumentos estão disponíveis. Um instrumento desabilitado nesta tabela não produz eventos, independentemente do conteúdo das outras tabelas de configuração relacionadas à produção. Um instrumento habilitado nesta tabela é permitido produzir eventos, sujeito ao conteúdo das outras tabelas.

+ `setup_objects` controla se o Schema de Desempenho monitora tabelas e objetos de programas armazenados específicos.

+ `threads` indica se o monitoramento está habilitado para cada fio do servidor.

+ `setup_actors` determina o estado inicial de monitoramento para novos threads de primeiro plano.

* Para configurar o pré-filtro na fase do consumidor, modifique a tabela `setup_consumers`. Isso determina os destinos para os quais os eventos são enviados. `setup_consumers` também afeta implicitamente a produção de eventos. Se um evento específico não for enviado para nenhum destino (ou seja, nunca é consumido), o Schema de Desempenho não o produz.

As modificações em qualquer uma dessas tabelas afetam o monitoramento imediatamente, com exceção de que as modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes.

Quando você altera a configuração de monitoramento, o Schema de desempenho não limpa as tabelas de histórico. Os eventos já coletados permanecem nas tabelas de eventos atuais e histórico até serem substituídos por eventos mais recentes. Se você desabilitar os instrumentos, pode ser necessário esperar um pouco antes de os eventos deles serem substituídos por eventos mais recentes de interesse. Como alternativa, use `TRUNCATE TABLE` para esvaziar as tabelas de histórico.

Após fazer as alterações de instrumentação, você pode querer truncar as tabelas de resumo. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não para remover linhas. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, depois de ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

As seções a seguir descrevem como usar tabelas específicas para controlar o pré-filtro do Schema de Desempenho.

### 29.4.4 Pré-filtragem por Instrumento

A tabela `setup_instruments` lista os instrumentos disponíveis:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments;
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

Para controlar se um instrumento está habilitado, defina sua coluna `ENABLED` para `YES` ou `NO`. Para configurar se deve coletar informações de temporização para um instrumento habilitado, defina o valor da coluna `TIMED` para `YES` ou `NO`. Definir a coluna `TIMED` afeta o conteúdo da tabela do Schema de Desempenho, conforme descrito na Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

As modificações na maioria das linhas de `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes apenas no início da inicialização do servidor; alterar-as durante a execução não tem efeito. Isso afeta principalmente os mutexes, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

A tabela `setup_instruments` fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou fio que está sendo monitorado, outras tabelas podem ser usadas conforme descrito na Seção 29.4.3, “Pré-filtragem de Eventos”.

Os exemplos a seguir demonstram operações possíveis na tabela `setup_instruments`. Essas alterações, assim como outras operações de pré-filtragem, afetam todos os usuários. Algumas dessas consultas utilizam o operador `LIKE` e um instrumento de correspondência de padrões. Para informações adicionais sobre especificação de padrões para seleção de instrumentos, consulte a Seção 29.4.9, “Nomeando Instrumentos ou Consumidores para Operações de Filtragem”.

* Desative todos os instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO';
  ```

Agora, nenhum evento é coletado.

* Desative todos os instrumentos de arquivo, adicionando-os ao conjunto atual de instrumentos desativados:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'wait/io/file/%';
  ```

* Desative apenas os instrumentos de arquivo, ative todos os outros instrumentos:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(NAME LIKE 'wait/io/file/%', 'NO', 'YES');
  ```

* Ative todos, exceto aqueles instrumentos, na biblioteca `mysys`:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = CASE WHEN NAME LIKE '%/mysys/%' THEN 'YES' ELSE 'NO' END;
  ```

* Desativar um instrumento específico:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Para alternar o estado de um instrumento, “volte” o valor de sua `ENABLED`:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = IF(ENABLED = 'YES', 'NO', 'YES')
  WHERE NAME = 'wait/synch/mutex/mysys/TMPDIR_mutex';
  ```

* Desative o cronometramento para todos os eventos:

  ```
  UPDATE performance_schema.setup_instruments
  SET TIMED = 'NO';
  ```

### 29.4.5 Pré-filtragem por Objeto

A tabela `setup_objects` controla se o Schema de Desempenho monitora tabelas e objetos de programas armazenados específicos. O conteúdo inicial da tabela `setup_objects` parece assim:

```
mysql> SELECT * FROM performance_schema.setup_objects;
+-------------+--------------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA      | OBJECT_NAME | ENABLED | TIMED |
+-------------+--------------------+-------------+---------+-------+
| EVENT       | mysql              | %           | NO      | NO    |
| EVENT       | performance_schema | %           | NO      | NO    |
| EVENT       | information_schema | %           | NO      | NO    |
| EVENT       | %                  | %           | YES     | YES   |
| FUNCTION    | mysql              | %           | NO      | NO    |
| FUNCTION    | performance_schema | %           | NO      | NO    |
| FUNCTION    | information_schema | %           | NO      | NO    |
| FUNCTION    | %                  | %           | YES     | YES   |
| PROCEDURE   | mysql              | %           | NO      | NO    |
| PROCEDURE   | performance_schema | %           | NO      | NO    |
| PROCEDURE   | information_schema | %           | NO      | NO    |
| PROCEDURE   | %                  | %           | YES     | YES   |
| TABLE       | mysql              | %           | NO      | NO    |
| TABLE       | performance_schema | %           | NO      | NO    |
| TABLE       | information_schema | %           | NO      | NO    |
| TABLE       | %                  | %           | YES     | YES   |
| TRIGGER     | mysql              | %           | NO      | NO    |
| TRIGGER     | performance_schema | %           | NO      | NO    |
| TRIGGER     | information_schema | %           | NO      | NO    |
| TRIGGER     | %                  | %           | YES     | YES   |
+-------------+--------------------+-------------+---------+-------+
```

As modificações na tabela `setup_objects` afetam o monitoramento de objetos imediatamente.

A coluna `OBJECT_TYPE` indica o tipo de objeto ao qual uma linha se aplica. O filtro `TABLE` afeta eventos de entrada/saída de tabela (instrumento `wait/io/table/sql/handler`) e eventos de bloqueio de tabela (instrumento `wait/lock/table/sql/handler`).

As colunas `OBJECT_SCHEMA` e `OBJECT_NAME` devem conter um nome literal do esquema ou objeto, ou `'%'` para corresponder a qualquer nome.

A coluna `ENABLED` indica se os objetos correspondentes são monitorados, e `TIMED` indica se é necessário coletar informações de temporização. A definição da coluna `TIMED` afeta o conteúdo da tabela do Schema de Desempenho, conforme descrito na Seção 29.4.1, “Temporização dos Eventos do Schema de Desempenho”.

O efeito da configuração padrão do objeto é instrumar todos os objetos, exceto aqueles nos bancos de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas no banco de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de `setup_objects`; a linha para `information_schema.%` faz isso explícito por padrão.)

Quando o Schema de Desempenho verifica uma correspondência em `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Para as linhas que correspondem a um dado `OBJECT_TYPE`, o Schema de Desempenho verifica as linhas nesta ordem:

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='literal'`.

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='%'`.

* Linhas com `OBJECT_SCHEMA='%'` e `OBJECT_NAME='%'`.

Por exemplo, com uma tabela `db1.t1`, o Schema de Desempenho procura nas linhas `TABLE` para uma correspondência com `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, depois para `'%'` e `'%'`. A ordem em que ocorre a correspondência é importante porque diferentes linhas de correspondência `setup_objects` podem ter diferentes valores de `ENABLED` e `TIMED`.

Para eventos relacionados a tabela, o Schema de Desempenho combina os conteúdos de `setup_objects` com `setup_instruments` para determinar se os instrumentos devem ser habilitados e se os instrumentos habilitados devem ser temporizados:

* Para tabelas que correspondem a uma linha em `setup_objects`, os instrumentos da tabela produzem eventos apenas se `ENABLED` é `YES` em ambos `setup_instruments` e `setup_objects`.

* Os valores `TIMED` nas duas tabelas são combinados, de modo que as informações de cronometragem são coletadas apenas quando ambos os valores são `YES`.

Para os objetos de programa armazenados, o Schema de desempenho toma as colunas `ENABLED` e `TIMED` diretamente da linha `setup_objects`. Não há combinação de valores com `setup_instruments`.

Suponha que `setup_objects` contenha as seguintes linhas `TABLE` que se aplicam a `db1`, `db2` e `db3`:

```
+-------------+---------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA | OBJECT_NAME | ENABLED | TIMED |
+-------------+---------------+-------------+---------+-------+
| TABLE       | db1           | t1          | YES     | YES   |
| TABLE       | db1           | t2          | NO      | NO    |
| TABLE       | db2           | %           | YES     | YES   |
| TABLE       | db3           | %           | NO      | NO    |
| TABLE       | %             | %           | YES     | YES   |
+-------------+---------------+-------------+---------+-------+
```

Se um instrumento relacionado a um objeto no `setup_instruments` tiver um valor de `ENABLED` de `NO`, os eventos para o objeto não serão monitorados. Se o valor de `ENABLED` for `YES`, o monitoramento de eventos ocorrerá de acordo com o valor de `ENABLED` na linha relevante do `setup_objects`:

* Eventos `db1.t1` são monitorados
* Eventos `db1.t2` não são monitorados
* Eventos `db2.t3` são monitorados
* Eventos `db3.t4` não são monitorados
* Eventos `db4.t5` são monitorados

A lógica semelhante se aplica para combinar as colunas `TIMED` das tabelas `setup_instruments` e `setup_objects` para determinar se é necessário coletar informações sobre o tempo de eventos.

Se uma tabela persistente e uma tabela temporária tiverem o mesmo nome, a correspondência com as linhas de `setup_objects` ocorre da mesma maneira para ambas. Não é possível habilitar o monitoramento para uma tabela, mas não para a outra. No entanto, cada tabela é instrumentada separadamente.

### 29.4.6 Pré-filtragem por Fóruns

A tabela `threads` contém uma linha para cada fio do servidor. Cada linha contém informações sobre um fio e indica se o monitoramento está habilitado para ele. Para que o Schema de Desempenho monitore um fio, essas coisas devem ser verdadeiras:

* O consumidor `thread_instrumentation` na tabela `setup_consumers` deve ser `YES`.

* A coluna `threads.INSTRUMENTED` deve ser `YES`.

* O monitoramento ocorre apenas para os eventos de fio produzidos a partir de instrumentos que estão habilitados na tabela `setup_instruments`.

A tabela `threads` também indica para cada fio de servidor se deve realizar o registro de eventos históricos. Isso inclui eventos de espera, estágio, declaração e transação e afeta o registro nessas tabelas:

```
events_waits_history
events_waits_history_long
events_stages_history
events_stages_history_long
events_statements_history
events_statements_history_long
events_transactions_history
events_transactions_history_long
```

Para que o registro de eventos históricos ocorra, essas coisas devem ser verdadeiras:

* Os consumidores apropriados relacionados à história na tabela `setup_consumers` devem ser habilitados. Por exemplo, o registro de eventos de espera nas tabelas `events_waits_history` e `events_waits_history_long` requer que os consumidores correspondentes `events_waits_history` e `events_waits_history_long` sejam `YES`.

* A coluna `threads.HISTORY` deve ser `YES`.

* O registro ocorre apenas para aqueles eventos de thread produzidos a partir de instrumentos que estão habilitados na tabela `setup_instruments`.

Para os threads de primeiro plano (resultantes de conexões de clientes), os valores iniciais das colunas `INSTRUMENTED` e `HISTORY` nas linhas da tabela `threads` são determinados pelo fato de a conta de usuário associada a um thread corresponder a qualquer linha na tabela `setup_actors`. Os valores vêm das colunas `ENABLED` e `HISTORY` da linha de correspondência da tabela `setup_actors`.

Para os threads de fundo, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

O conteúdo inicial do `setup_actors` parece assim:

```
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

As colunas `HOST` e `USER` devem conter um nome literal de host ou usuário, ou `'%'` para corresponder a qualquer nome.

As colunas `ENABLED` e `HISTORY` indicam se é necessário habilitar a instrumentação e o registro de eventos históricos para os threads correspondentes, sob reserva das outras condições descritas anteriormente.

Quando o Schema de Desempenho verifica uma correspondência para cada novo fio de plano de fundo em `setup_actors`, ele tenta encontrar correspondências mais específicas primeiro, usando as colunas `USER` e `HOST` (`ROLE` é inutilizado):

* Linhas com `USER='literal'` e `HOST='literal'`.

* Linhas com `USER='literal'` e `HOST='%'`.

* Linhas com `USER='%'` e `HOST='literal'`.

* Linhas com `USER='%'` e `HOST='%'`.

A ordem em que a correspondência ocorre é importante porque diferentes linhas de correspondência `setup_actors` podem ter diferentes valores de `USER` e `HOST`. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host), com base nos valores das colunas `ENABLED` e `HISTORY`:

* Quando a melhor correspondência é uma linha com `ENABLED=YES`, o valor `INSTRUMENTED` para o fio se torna `YES`. Quando a melhor correspondência é uma linha com `HISTORY=YES`, o valor `HISTORY` para o fio se torna `YES`.

* Quando a melhor correspondência é uma linha com `ENABLED=NO`, o valor `INSTRUMENTED` para o fio se torna `NO`. Quando a melhor correspondência é uma linha com `HISTORY=NO`, o valor `HISTORY` para o fio se torna `NO`.

* Quando não é encontrada nenhuma correspondência, os valores `INSTRUMENTED` e `HISTORY` para o fio se tornam `NO`.

As colunas `ENABLED` e `HISTORY` nas linhas `setup_actors` podem ser configuradas para `YES` ou `NO`, independentemente uma da outra. Isso significa que você pode habilitar a instrumentação separadamente, independentemente de você coletar eventos históricos.

Por padrão, o monitoramento e a coleta de eventos históricos estão habilitados para todos os novos threads de primeiro plano, porque a tabela `setup_actors` inicialmente contém uma linha com `'%'` tanto para `HOST` quanto para `USER`. Para realizar uma correspondência mais limitada, como habilitar o monitoramento apenas para alguns threads de primeiro plano, você deve alterar essa linha, pois ela corresponde a qualquer conexão, e adicionar linhas para combinações mais específicas de `HOST`/`USER`.

Suponha que você modifique `setup_actors` da seguinte forma:

```
UPDATE performance_schema.setup_actors
SET ENABLED = 'NO', HISTORY = 'NO'
WHERE HOST = '%' AND USER = '%';
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('localhost','joe','%','YES','YES');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('hosta.example.com','joe','%','YES','NO');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('%','sam','%','NO','YES');
```

A declaração `UPDATE` altera a correspondência padrão para desabilitar a instrumentação e a coleta de eventos históricos. As declarações `INSERT` adicionam linhas para correspondências mais específicas.

Agora, o Schema de Desempenho determina como definir os valores de `INSTRUMENTED` e `HISTORY` para novos threads de conexão da seguinte forma:

* Se `joe` se conecta a partir do host local, a conexão corresponde à primeira linha inserida. Os valores de `INSTRUMENTED` e `HISTORY` para o fio se tornam `YES`.

* Se `joe` se conecta a partir de `hosta.example.com`, a conexão corresponde à segunda linha inserida. O valor `INSTRUMENTED` para o fio se torna `YES` e o valor `HISTORY` se torna `NO`.

* Se `joe` se conecta a qualquer outro host, não há correspondência. Os valores `INSTRUMENTED` e `HISTORY` para o fio se tornam `NO`.

* Se `sam` se conecta a qualquer host, a conexão corresponde à terceira linha inserida. O valor `INSTRUMENTED` para o fio se torna `NO` e o valor `HISTORY` se torna `YES`.

* Para qualquer outra conexão, a linha com `HOST` e `USER` definida como `'%'` corresponde à linha atual, que agora tem `ENABLED` e `HISTORY` definidos como `NO`, então os valores de `INSTRUMENTED` e `HISTORY` para o fio se tornam `NO`.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`.

### 29.4.7 Pré-filtragem pelo Consumidor

A tabela `setup_consumers` lista os tipos de consumidor disponíveis e quais estão habilitados:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_cpu            | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

Modifique a tabela `setup_consumers` para afetar o pré-filtro na etapa do consumidor e determine os destinos para os quais os eventos são enviados. Para habilitar ou desabilitar um consumidor, defina o valor `ENABLED` desse consumidor em `YES` ou `NO`.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

Se você desativar um consumidor, o servidor não gastará tempo mantendo destinos para esse consumidor. Por exemplo, se você não se importa com informações de eventos históricos, desative os consumidores de histórico:

```
UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

As configurações de consumo na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Os seguintes princípios se aplicam:

* Os destinos associados a um consumidor não recebem eventos a menos que o Schema de Desempenho verifique o consumidor e o consumidor esteja habilitado.

* Um consumidor é verificado apenas se todos os consumidores em que ele depende (se houver) estiverem habilitados.

* Se um consumidor não for verificado, ou for verificado, mas estiver desativado, outros consumidores que dependem dele não serão verificados.

* Os consumidores dependentes podem ter seus próprios consumidores dependentes. * Se um evento não for enviado para nenhum destino, o Schema de Desempenho não o produz.

Os seguintes listamentos descrevem os valores de consumo disponíveis. Para discussão de várias configurações de consumo representativas e seu efeito na instrumentação, veja a Seção 29.4.8, “Configurações de Consumo Exemplos”.

* Consumidores globais e de fio
* Consumidores de eventos de espera
* Consumidores de eventos em estágio
* Consumidores de eventos de declaração
* Consumidores de eventos de transação
* Consumidor de digestão de declaração

#### Consumidores globais e de fiação

* `global_instrumentation` é o consumidor de nível mais alto. Se `global_instrumentation` é `NO`, desabilita a instrumentação global. Todos os outros ajustes são de nível inferior e não são verificados; não importa para o que eles são definidos. Não são mantidas informações globais ou por thread e não são coletados eventos individuais nas tabelas de eventos atuais ou histórico de eventos. Se `global_instrumentation` é `YES`, o Schema de Desempenho mantém informações para estados globais e também verifica o consumidor `thread_instrumentation`.

* `thread_instrumentation` é verificado apenas se `global_instrumentation` é `YES`. Caso contrário, se `thread_instrumentation` é `NO`, desativa a instrumentação específica de cada thread e todas as configurações de nível inferior são ignoradas. Não são mantidas informações por thread e não são coletados eventos individuais nas tabelas de eventos atuais ou histórico de eventos. Se `thread_instrumentation` é `YES`, o Schema de Desempenho mantém informações específicas de cada thread e também verifica os consumidores de `events_xxx_current`.

#### Consumidores de Eventos de Aguardar

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não são verificados. Se verificados, eles atuam da seguinte forma:

* `events_waits_current`, se `NO`, desativa a coleta de eventos de espera individuais na tabela `events_waits_current`. Se `YES`, habilita a coleta de eventos de espera e o Schema de Desempenho verifica os consumidores `events_waits_history` e `events_waits_history_long`.

* `events_waits_history` não é verificado se `event_waits_current` é `NO`. Caso contrário, um valor `events_waits_history` de `NO` ou `YES` desativa ou ativa a coleta de eventos de espera na tabela `events_waits_history`.

* `events_waits_history_long` não é verificado se `event_waits_current` é `NO`. Caso contrário, um valor `events_waits_history_long` de `NO` ou `YES` desativa ou ativa a coleta de eventos de espera na tabela `events_waits_history_long`.

#### Evento de estágio Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não são verificados. Se verificados, eles atuam da seguinte forma:

* `events_stages_current`, se `NO`, desativa a coleta de eventos de estágio individuais na tabela `events_stages_current`. Se `YES`, habilita a coleta de eventos de estágio e o Schema de Desempenho verifica os consumidores `events_stages_history` e `events_stages_history_long`.

* `events_stages_history` não é verificado se `event_stages_current` é `NO`. Caso contrário, um valor de `events_stages_history` de `NO` ou `YES` desativa ou ativa a coleta de eventos de estágio na tabela `events_stages_history`.

* `events_stages_history_long` não é verificado se `event_stages_current` é `NO`. Caso contrário, um valor `events_stages_history_long` de `NO` ou `YES` desativa ou ativa a coleta de eventos de estágio na tabela `events_stages_history_long`.

#### Declaração Evento Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não são verificados. Se verificados, eles atuam da seguinte forma:

* `events_statements_cpu`, se `NO`, desativa a medição de `CPU_TIME`. Se `YES`, e a instrumentação estiver habilitada e cronometrada, `CPU_TIME` é medido.

* `events_statements_current`, se `NO`, desativa a coleta de eventos de declaração individuais na tabela `events_statements_current`. Se `YES`, habilita a coleta de eventos de declaração e o Schema de Desempenho verifica os consumidores `events_statements_history` e `events_statements_history_long`.

* `events_statements_history` não é verificado se `events_statements_current` é `NO`. Caso contrário, um valor `events_statements_history` de `NO` ou `YES` desativa ou ativa a coleta de eventos de declaração na tabela `events_statements_history`.

* `events_statements_history_long` não é verificado se `events_statements_current` é `NO`. Caso contrário, um valor `events_statements_history_long` de `NO` ou `YES` desativa ou ativa a coleta de eventos de declaração na tabela `events_statements_history_long`.

#### Evento de Transação Consumidores

Esses consumidores exigem que tanto `global_instrumentation` quanto `thread_instrumentation` sejam `YES` ou eles não são verificados. Se verificados, eles atuam da seguinte forma:

* `events_transactions_current`, se `NO`, desativa a coleta de eventos de transação individual na tabela `events_transactions_current`. Se `YES`, habilita a coleta de eventos de transação e o Schema de Desempenho verifica os consumidores `events_transactions_history` e `events_transactions_history_long`.

* `events_transactions_history` não é verificado se `events_transactions_current` é `NO`. Caso contrário, um valor `events_transactions_history` de `NO` ou `YES` desativa ou ativa a coleta de eventos de transação na tabela `events_transactions_history`.

* `events_transactions_history_long` não é verificado se `events_transactions_current` é `NO`. Caso contrário, um valor `events_transactions_history_long` de `NO` ou `YES` desativa ou ativa a coleta de eventos de transação na tabela `events_transactions_history_long`.

#### Diálogo de declaração do consumidor

O consumidor `statements_digest` exige que o `global_instrumentation` seja `YES` ou não seja verificado. Não há dependência dos consumidores de eventos de declaração, portanto, é possível obter estatísticas por digest sem ter que coletar estatísticas em `events_statements_current`, o que é vantajoso em termos de sobrecarga. Por outro lado, é possível obter declarações detalhadas em `events_statements_current` sem digests (as colunas `DIGEST` e `DIGEST_TEXT` são `NULL` neste caso).

Para mais informações sobre a digestão de declarações, consulte a Seção 29.10, “Digestas e amostragem de declarações do Schema de desempenho”.

### 29.4.8 Configurações do Consumidor Exemplo

As configurações do consumidor na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. O seguinte texto descreve como os consumidores funcionam, mostrando configurações específicas e seus efeitos à medida que as configurações do consumidor são ativadas progressivamente de alto para baixo. Os valores dos consumidores mostrados são representativos. Os princípios gerais descritos aqui se aplicam a outros valores do consumidor que podem estar disponíveis.

As descrições de configuração ocorrem em ordem crescente de funcionalidade e sobrecarga. Se você não precisa das informações fornecidas ao habilitar configurações de nível mais baixo, desative-as para que o Gerador de desempenho execute menos código em seu nome e haja menos informações para analisar.

A tabela `setup_consumers` contém a seguinte hierarquia de valores:

```
global_instrumentation
 thread_instrumentation
   events_waits_current
     events_waits_history
     events_waits_history_long
   events_stages_current
     events_stages_history
     events_stages_history_long
   events_statements_current
     events_statements_history
     events_statements_history_long
   events_transactions_current
     events_transactions_history
     events_transactions_history_long
 statements_digest
```

Nota

Na hierarquia de consumo, os consumidores de espera, estágios, declarações e transações estão todos no mesmo nível. Isso difere da hierarquia de ninho de eventos, na qual os eventos de espera se aninham dentro dos eventos de estágio, que se aninham dentro dos eventos de declaração, que se aninham dentro dos eventos de transação.

Se um determinado perfil do consumidor for `NO`, o Schema de Desempenho desativa a instrumentação associada ao consumidor e ignora todos os ajustes de nível inferior. Se um determinado ajuste for `YES`, o Schema de Desempenho habilita a instrumentação associada a ele e verifica os ajustes no nível imediatamente inferior. Para uma descrição das regras para cada consumidor, consulte a Seção 29.4.7, “Pré-filtragem por Consumidor”.

Por exemplo, se `global_instrumentation` estiver habilitado, `thread_instrumentation` é verificado. Se `thread_instrumentation` estiver habilitado, os consumidores de `events_xxx_current` são verificados. Se `events_waits_current` estiver habilitado, `events_waits_history` e `events_waits_history_long` são verificados.

Cada uma das seguintes descrições de configuração indica quais elementos de configuração o Schema de Desempenho verifica e quais tabelas de saída mantém (ou seja, para quais tabelas ele coleta informações).

* Sem instrumentação
* Apenas instrumentação global
* Apenas instrumentação global e de fio
* Instrumentação global, de fio e de evento atual
* Instrumentação global, de fio, de evento atual e de histórico de eventos

#### Sem Instrumentos

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nessa configuração, nada é instrumentado.

Elementos de configuração verificados:

* Tabela `setup_consumers`, consumidor `global_instrumentation`

Tabelas de saída mantidas:

* Nenhuma

#### Apenas Instrumentos Globais

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | YES     |
| thread_instrumentation    | NO      |
...
+---------------------------+---------+
```

Nessa configuração, a instrumentação é mantida apenas para estados globais. A instrumentação por thread é desativada.

Elementos adicionais de configuração verificados, em relação à configuração anterior:

* Tabela `setup_consumers`, consumidor `thread_instrumentation`

* Tabela `setup_instruments`
* Tabela `setup_objects`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `mutex_instances`
* `rwlock_instances`
* `cond_instances`
* `file_instances`
* `users`
* `hosts`
* `accounts`
* `socket_summary_by_event_name`
* `file_summary_by_instance`
* `file_summary_by_event_name`
* `objects_summary_global_by_type`
* `memory_summary_global_by_event_name`
* `table_lock_waits_summary_by_table`
* `table_io_waits_summary_by_index_usage`
* `table_io_waits_summary_by_table`
* `events_waits_summary_by_instance`
* `events_waits_summary_global_by_event_name`
* `events_stages_summary_global_by_event_name`
* `events_statements_summary_global_by_event_name`
* `events_transactions_summary_global_by_event_name`

#### Apenas Instrumentação Global e de Fiação

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | NO      |
...
| events_stages_current            | NO      |
...
| events_statements_current        | NO      |
...
| events_transactions_current      | NO      |
...
+----------------------------------+---------+
```

Nessa configuração, a instrumentação é mantida globalmente e por fio. Não são coletados eventos individuais nas tabelas de eventos atuais ou de histórico de eventos.

Elementos adicionais de configuração verificados, em relação à configuração anterior:

* Tabela `setup_consumers`, consumidores `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* Tabela `setup_actors`
* Coluna `threads.instrumented`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `events_xxx_summary_by_yyy_by_event_name`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`; e *`yyy`* é `thread`, `user`, `host`, `account`

#### Instrumentação global, de fio e de eventos atuais

Estado da configuração do servidor:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

Nessa configuração, a instrumentação é mantida globalmente e por fio. Os eventos individuais são coletados na tabela de eventos atuais, mas não nas tabelas de histórico de eventos.

Elementos adicionais de configuração verificados, em relação à configuração anterior:

* Consumidores `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* Consumidores `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Tabelas de saída adicionais mantidas, em relação à configuração anterior:

* `events_xxx_current`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Instrumentação Global, Thread, Current-Event e Event-History

A configuração anterior não coleta histórico de eventos porque os consumidores `events_xxx_history` e `events_xxx_history_long` estão desativados. Esses consumidores podem ser habilitados separadamente ou juntos para coletar histórico de eventos por thread, globalmente ou ambos.

Essa configuração coleta o histórico de eventos por thread, mas não globalmente:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

Tabelas de histórico de eventos mantidas para esta configuração:

* `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Essa configuração coleta o histórico de eventos globalmente, mas não por thread:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Tabelas de histórico de eventos mantidas para esta configuração:

* `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

Essa configuração coleta o histórico de eventos por fio e globalmente:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Tabelas de histórico de eventos mantidas para esta configuração:

* `events_xxx_history`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

* `events_xxx_history_long`, onde *`xxx`* é `waits`, `stages`, `statements`, `transactions`

### 29.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtro

Os nomes fornecidos para operações de filtragem podem ser tão específicos ou gerais quanto necessário. Para indicar um único instrumento ou consumidor, especifique seu nome na íntegra:

```
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME = 'wait/synch/mutex/myisammrg/MYRG_INFO::mutex';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME = 'events_waits_current';
```

Para especificar um grupo de instrumentos ou consumidores, use um padrão que corresponda aos membros do grupo:

```
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME LIKE 'wait/synch/mutex/%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

Se você estiver usando um padrão, ele deve ser escolhido de forma que corresponda a todos os itens de interesse e não a outros. Por exemplo, para selecionar todos os instrumentos de E/S de arquivo, é melhor usar um padrão que inclua todo o prefixo do nome do instrumento:

```
... WHERE NAME LIKE 'wait/io/file/%';
```

Um padrão de `'%/file/%'` corresponde a outros instrumentos que possuem um elemento de `'/file/'` em qualquer parte do nome. Ainda menos adequado é o padrão `'%file%'`, pois corresponde a instrumentos com `'file'` em qualquer parte do nome, como `wait/synch/mutex/innodb/file_open_mutex`.

Para verificar qual instrumento ou nome de consumidor um padrão corresponde, realize um teste simples:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE 'pattern';

SELECT NAME FROM performance_schema.setup_consumers
WHERE NAME LIKE 'pattern';
```

Para obter informações sobre os tipos de nomes suportados, consulte a Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

### 29.4.10 Determinando o que é Instrumentado

É sempre possível determinar quais instrumentos o Schema de Desempenho inclui, verificando a tabela `setup_instruments`. Por exemplo, para ver quais eventos relacionados a arquivos são instrumentados para o mecanismo de armazenamento `InnoDB`, use esta consulta:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb/%';
+-------------------------------------------------+---------+-------+
| NAME                                            | ENABLED | TIMED |
+-------------------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_tablespace_open_file | YES     | YES   |
| wait/io/file/innodb/innodb_data_file            | YES     | YES   |
| wait/io/file/innodb/innodb_log_file             | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file            | YES     | YES   |
| wait/io/file/innodb/innodb_arch_file            | YES     | YES   |
| wait/io/file/innodb/innodb_clone_file           | YES     | YES   |
+-------------------------------------------------+---------+-------+
```

Uma descrição exaustiva do que exatamente é instrumentado não é dada nesta documentação, por várias razões:

* O que é instrumentado é o código do servidor. Alterações nesse código ocorrem frequentemente, o que também afeta o conjunto de instrumentos.

* Não é prático listar todos os instrumentos, pois há centenas deles.

* Como descrito anteriormente, é possível descobrir consultando a tabela [[`setup_instruments`]. Essa informação está sempre atualizada para sua versão do MySQL, também inclui instrumentação para plugins instrumentados que você pode ter instalado e que não fazem parte do servidor principal, e pode ser usada por ferramentas automatizadas.