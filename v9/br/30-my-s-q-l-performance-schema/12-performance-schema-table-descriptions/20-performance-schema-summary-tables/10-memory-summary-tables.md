#### 29.12.20.10 Tabelas de Resumo de Memória

Os instrumentos do Schema de Desempenho monitoram o uso de memória e agregam estatísticas de uso de memória, detalhadas por esses fatores:

* Tipo de memória usada (vários caches, buffers internos, etc.)
* Fio, conta, usuário, host que indiretamente executam a operação de memória

Os instrumentos do Schema de Desempenho analisam os seguintes aspectos do uso de memória:
* Tamanhos de memória usados
* Contas de operações
* Limites de água baixa e alta

Os tamanhos de memória ajudam a entender ou ajustar o consumo de memória do servidor.
* Contas de operações ajudam a entender ou ajustar a pressão geral que o servidor está exercendo sobre o alocador de memória, o que tem impacto no desempenho. Alocar um único byte um milhão de vezes não é a mesma coisa que alocar um milhão de bytes uma única vez; rastrear ambos os tamanhos e contas pode expor a diferença.
* Limites de água baixa e alta são críticos para detectar picos de carga de trabalho, estabilidade geral da carga de trabalho e possíveis vazamentos de memória.
* As tabelas de resumo de memória não contêm informações de temporização porque os eventos de memória não são temporizados.
* Para obter informações sobre a coleta de dados de uso de memória, consulte Comportamento de Instrumentação de Memória.
* Informações de resumo de evento de memória de exemplo:
```
mysql> SELECT *
       FROM performance_schema.memory_summary_global_by_event_name
       WHERE EVENT_NAME = 'memory/sql/TABLE'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/sql/TABLE
                 COUNT_ALLOC: 1381
                  COUNT_FREE: 924
   SUM_NUMBER_OF_BYTES_ALLOC: 2059873
    SUM_NUMBER_OF_BYTES_FREE: 1407432
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 457
             HIGH_COUNT_USED: 461
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 652441
   HIGH_NUMBER_OF_BYTES_USED: 669269
```
Cada tabela de resumo de memória tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:
* `memory_summary_by_account_by_event_name` tem as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e nome de evento.
* `memory_summary_by_host_by_event_name` tem as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um host específico e nome de evento.

* `memory_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado thread e nome de evento.

* `memory_summary_by_user_by_event_name` tem as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um determinado usuário e nome de evento.

* `memory_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um determinado nome de evento.

Cada tabela de resumo de memória tem essas colunas de resumo contendo valores agregados:

* `COUNT_ALLOC`, `COUNT_FREE`

  Os números agregados de chamadas às funções de alocação e liberação de memória.

* `SUM_NUMBER_OF_BYTES_ALLOC`, `SUM_NUMBER_OF_BYTES_FREE`

  Os tamanhos agregados dos blocos de memória alocados e liberados.

* `CURRENT_COUNT_USED`

  O número agregado de blocos alocados atualmente que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `COUNT_ALLOC` − `COUNT_FREE`.

* `CURRENT_NUMBER_OF_BYTES_USED`

  O tamanho agregado dos blocos de memória alocados atualmente que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `SUM_NUMBER_OF_BYTES_ALLOC` − `SUM_NUMBER_OF_BYTES_FREE`.

* `LOW_COUNT_USED`, `HIGH_COUNT_USED`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED`, `HIGH_NUMBER_OF_BYTES_USED`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_NUMBER_OF_BYTES_USED`.

As tabelas de resumo de memória têm esses índices:

* `memory_summary_by_account_by_event_name`:

  + Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `memory_summary_by_host_by_event_name`:

  + Chave primária em (`HOST`, `EVENT_NAME`)

* `memory_summary_by_thread_by_event_name`:

  + Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `memory_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `memory_summary_global_by_event_name`:

  + Chave primária em (`EVENT_NAME`)

O `TRUNCATE TABLE` é permitido para tabelas de resumo de memória. Ele tem esses efeitos:

* Em geral, o truncamento redefiniu a linha de base para estatísticas, mas não altera o estado do servidor. Ou seja, truncar uma tabela de memória não libera memória.

* `COUNT_ALLOC` e `COUNT_FREE` são redefinidos para uma nova linha de base, reduzindo cada contador pelo mesmo valor.

* Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidos para uma nova linha de base.

* `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por conta, host, usuário ou thread é truncada implicitamente pelo truncamento da tabela de conexão na qual depende, ou pelo truncamento de `memory_summary_global_by_event_name`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Comportamento da Instrumentação de Memória

Os instrumentos de memória estão listados na tabela `setup_instruments` e têm nomes da forma `memory/code_area/instrument_name`. A instrumentação de memória é habilitada por padrão.

Os instrumentos nomeados com o prefixo `memory/performance_schema/` exibem quanto memória é alocada para buffers internos no próprio Schema de Desempenho. Os instrumentos `memory/performance_schema/` são construídos internamente, sempre habilitados e não podem ser desabilitados no início ou no runtime. Os instrumentos de memória construídos internamente são exibidos apenas na tabela `memory_summary_global_by_event_name`.

Para controlar o estado da instrumentação de memória no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

* Desabilitar:

```
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória em tempo de execução, atualize a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

* Desabilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'memory/%';
  ```

Para os instrumentos de memória, a coluna `TIMED` na `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

Quando um thread no servidor executa uma alocação de memória que foi instrumentada, essas regras se aplicam:

* Se o thread não estiver instrumentado ou o instrumento de memória não estiver habilitado, o bloco de memória alocado não será instrumentado.

* Caso contrário (ou seja, tanto o thread quanto o instrumento estiverem habilitados), o bloco de memória alocado será instrumentado.

Para a alocação de memória, essas regras se aplicam:

* Se uma operação de alocação de memória foi instrumentada, a operação de liberação correspondente será instrumentada, independentemente do status atual do instrumento ou do thread habilitado.

* Se uma operação de alocação de memória não foi instrumentada, a operação de liberação correspondente não será instrumentada, independentemente do status atual do instrumento ou do thread habilitado.

Para as estatísticas por thread, as seguintes regras se aplicam.

Quando um bloco de memória instrumentado de tamanho *`N`* é alocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_ALLOC`: Aumentada em 1
* `CURRENT_COUNT_USED`: Aumentada em 1
* `HIGH_COUNT_USED`: Aumentada se `CURRENT_COUNT_USED` for um novo máximo

* `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentada em *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Aumentada em *`N`*

* `HIGH_NUMBER_OF_BYTES_USED`: Aumentada se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é liberado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_FREE`: Aumentada em 1
* `CURRENT_COUNT_USED`: Reduzida em 1
* `LOW_COUNT_USED`: Reduzida se `CURRENT_COUNT_USED` for um novo mínimo

* `SUM_NUMBER_OF_BYTES_FREE`: Aumentada em *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Reduzida em *`N`*

* `LOW_NUMBER_OF_BYTES_USED`: Reduzida se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por conta, por usuário, por host), as mesmas regras se aplicam conforme esperado para marcas de baixo e alto nível.

* `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Schema de Desempenho é garantido para ser menor ou igual ao menor contagem ou tamanho de memória efetivamente usada em tempo de execução.

* `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Schema de Desempenho é garantido para ser maior ou igual ao maior contagem ou tamanho de memória efetivamente usada em tempo de execução.

Para estimativas mais baixas em tabelas resumidas, exceto `memory_summary_global_by_event_name`, é possível que os valores sejam negativos se a propriedade da memória for transferida entre threads.

Aqui está um exemplo de cálculo de estimativas; mas note que a implementação da estimativa está sujeita a mudanças:

O Thread 1 usa memória na faixa de 1MB a 2MB durante a execução, conforme reportado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela `memory_summary_by_thread_by_event_name`.

O Thread 2 usa memória na faixa de 10MB a 12MB durante a execução, conforme reportado da mesma forma.

Quando esses dois threads pertencem à mesma conta de usuário, o resumo por conta estima que essa conta usou memória na faixa de 11MB a 14MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` (número baixo de bytes usados) para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (número baixo de bytes usados) (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` (número alto de bytes usados) para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (número alto de bytes usados) (assumindo o pior caso).

11MB é uma estimativa mais baixa que pode ocorrer apenas se ambos os threads atingirem a marca de baixo uso ao mesmo tempo.

14MB é uma estimativa mais alta que pode ocorrer apenas se ambos os threads atingirem a marca de alto uso ao mesmo tempo.

O uso real de memória para essa conta poderia ter sido na faixa de 11,5MB a 13,5MB.

Para o planejamento de capacidade, relatar o pior caso é, na verdade, o comportamento desejado, pois mostra o que pode potencialmente acontecer quando as sessões não estão correlacionadas, o que é tipicamente o caso.