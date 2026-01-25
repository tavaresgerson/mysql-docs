#### 25.12.15.9 Tabelas de Resumo de Memória

O Performance Schema instrumenta o uso de memória e agrega estatísticas de uso de memória, detalhadas por estes fatores:

* Tipo de memória utilizada (vários caches, Buffer Pools internos, e assim por diante)

* Thread, account, user, host que indiretamente performa a operação de memória

O Performance Schema instrumenta os seguintes aspectos do uso de memória:

* Tamanhos de memória utilizados
* Contagens de operações (Operation counts)
* Marcas d'água baixas (Low water marks) e altas (High water marks)

Os tamanhos de memória ajudam a entender ou ajustar o consumo de memória do servidor.

As contagens de operações ajudam a entender ou ajustar a pressão geral que o servidor está exercendo sobre o alocador de memória (memory allocator), o que tem um impacto no desempenho (performance). Alocar um único byte um milhão de vezes não é o mesmo que alocar um milhão de bytes uma única vez; o rastreamento (tracking) de ambos, tamanhos e contagens, pode expor a diferença.

As marcas d'água baixas e altas são críticas para detectar picos de carga de trabalho (workload spikes), estabilidade geral da carga de trabalho e possíveis vazamentos de memória (memory leaks).

As tabelas de resumo de memória não contêm informações de tempo (timing information) porque os eventos de memória não são cronometrados (timed).

Para obter informações sobre como coletar dados de uso de memória, consulte [Comportamento da Instrumentação de Memória](performance-schema-memory-summary-tables.html#memory-instrumentation-behavior "Memory Instrumentation Behavior").

Exemplo de informação de resumo de eventos de memória:

```sql
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

Cada tabela de resumo de memória tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de eventos na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments"):

* [`memory_summary_by_account_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória") possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume eventos para uma determinada conta (combinação de user e host) e nome de evento.

* [`memory_summary_by_host_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória") possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume eventos para um determinado host e nome de evento.

* [`memory_summary_by_thread_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória") possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume eventos para uma determinada Thread e nome de evento.

* [`memory_summary_by_user_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória") possui as colunas `USER` e `EVENT_NAME`. Cada linha resume eventos para um determinado user e nome de evento.

* [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória") possui uma coluna `EVENT_NAME`. Cada linha resume eventos para um determinado nome de evento.

Cada tabela de resumo de memória possui estas colunas de resumo contendo valores agregados:

* `COUNT_ALLOC`, `COUNT_FREE`

  Os números agregados de chamadas às funções de alocação e liberação (free) de memória.

* `SUM_NUMBER_OF_BYTES_ALLOC`, `SUM_NUMBER_OF_BYTES_FREE`

  Os tamanhos agregados dos blocos de memória alocados e liberados.

* `CURRENT_COUNT_USED`

  O número agregado de blocos atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `COUNT_ALLOC` − `COUNT_FREE`.

* `CURRENT_NUMBER_OF_BYTES_USED`

  O tamanho agregado dos blocos de memória atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `SUM_NUMBER_OF_BYTES_ALLOC` − `SUM_NUMBER_OF_BYTES_FREE`.

* `LOW_COUNT_USED`, `HIGH_COUNT_USED`

  As marcas d'água baixa e alta correspondentes à coluna `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED`, `HIGH_NUMBER_OF_BYTES_USED`

  As marcas d'água baixa e alta correspondentes à coluna `CURRENT_NUMBER_OF_BYTES_USED`.

A instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitida para tabelas de resumo de memória. Ela tem estes efeitos:

* Em geral, o `TRUNCATE` redefine a linha de base (baseline) para as estatísticas, mas não altera o estado do servidor. Ou seja, truncar uma tabela de memória não libera memória.

* `COUNT_ALLOC` e `COUNT_FREE` são redefinidos para uma nova linha de base, reduzindo cada contador pelo mesmo valor.

* Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidos para uma nova linha de base.

* `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por account, host, user ou Thread é implicitamente truncada pelo truncamento da tabela de conexão da qual depende, ou pelo truncamento de [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória"). Para obter detalhes, consulte [Seção 25.12.8, “Tabelas de Conexão do Performance Schema”](performance-schema-connection-tables.html "25.12.8 Tabelas de Conexão do Performance Schema").

##### Comportamento da Instrumentação de Memória

Os instrumentos de memória estão listados na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments") e têm nomes no formato `memory/code_area/instrument_name`. A maioria das instrumentações de memória está desabilitada por padrão.

Instrumentos nomeados com o prefixo `memory/performance_schema/` expõem quanta memória é alocada para Buffer Pools internos no próprio Performance Schema. Os instrumentos `memory/performance_schema/` são integrados (built in), estão sempre habilitados e não podem ser desabilitados na inicialização ou em tempo de execução (runtime). Instrumentos de memória integrados são exibidos apenas na tabela [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória").

Para controlar o estado da instrumentação de memória na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar (Enable):

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

* Desabilitar (Disable):

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória em tempo de execução (runtime), atualize a coluna `ENABLED` dos instrumentos relevantes na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments"):

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'memory/%';
  ```

Para instrumentos de memória, a coluna `TIMED` em [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments") é ignorada porque as operações de memória não são cronometradas (timed).

Quando uma Thread no servidor executa uma alocação de memória que foi instrumentada, estas regras se aplicam:

* Se a Thread não for instrumentada ou se o instrumento de memória não estiver habilitado, o bloco de memória alocado não será instrumentado.

* Caso contrário (ou seja, tanto a Thread quanto o instrumento estão habilitados), o bloco de memória alocado será instrumentado.

Para desalocação (deallocation), estas regras se aplicam:

* Se uma operação de alocação de memória foi instrumentada, a operação free (liberação) correspondente é instrumentada, independentemente do status atual de habilitação do instrumento ou da Thread.

* Se uma operação de alocação de memória não foi instrumentada, a operação free correspondente não é instrumentada, independentemente do status atual de habilitação do instrumento ou da Thread.

Para as estatísticas por Thread (per-thread), aplicam-se as seguintes regras.

Quando um bloco de memória instrumentado de tamanho *`N`* é alocado, o Performance Schema faz estas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_ALLOC`: Aumentado em 1
* `CURRENT_COUNT_USED`: Aumentado em 1
* `HIGH_COUNT_USED`: Aumentado se `CURRENT_COUNT_USED` for um novo máximo

* `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentado em *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Aumentado em *`N`*

* `HIGH_NUMBER_OF_BYTES_USED`: Aumentado se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é desalocado, o Performance Schema faz estas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_FREE`: Aumentado em 1
* `CURRENT_COUNT_USED`: Diminuído em 1
* `LOW_COUNT_USED`: Diminuído se `CURRENT_COUNT_USED` for um novo mínimo

* `SUM_NUMBER_OF_BYTES_FREE`: Aumentado em *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Diminuído em *`N`*

* `LOW_NUMBER_OF_BYTES_USED`: Diminuído se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por account, por user, por host), as mesmas regras se aplicam conforme esperado para as marcas d'água baixa e alta.

* `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Performance Schema é garantido como sendo menor ou igual à contagem ou tamanho mais baixo de memória efetivamente usada em tempo de execução (runtime).

* `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Performance Schema é garantido como sendo maior ou igual à contagem ou tamanho mais alto de memória efetivamente usada em tempo de execução (runtime).

Para estimativas mais baixas em tabelas de resumo diferentes de [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória"), é possível que os valores se tornem negativos se a posse da memória for transferida entre Threads.

Aqui está um exemplo de cálculo de estimativa; mas observe que a implementação da estimativa está sujeita a alterações:

A Thread 1 usa memória no intervalo de 1MB a 2MB durante a execução, conforme relatado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela [`memory_summary_by_thread_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Tabelas de Resumo de Memória").

A Thread 2 usa memória no intervalo de 10MB a 12MB durante a execução, conforme relatado da mesma forma.

Quando essas duas Threads pertencem à mesma conta de usuário (user account), o resumo por conta estima que essa conta usou memória no intervalo de 11MB a 14MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (assumindo o pior caso).

11MB é uma estimativa mais baixa que pode ocorrer apenas se ambas as Threads atingirem a marca de baixo uso ao mesmo tempo.

14MB é uma estimativa mais alta que pode ocorrer apenas se ambas as Threads atingirem a marca de alto uso ao mesmo tempo.

O uso real de memória para esta conta poderia ter sido no intervalo de 11,5MB a 13,5MB.

Para planejamento de capacidade (capacity planning), relatar o pior caso é, na verdade, o comportamento desejado, pois mostra o que pode potencialmente acontecer quando as sessões não estão correlacionadas, o que é tipicamente o caso.
