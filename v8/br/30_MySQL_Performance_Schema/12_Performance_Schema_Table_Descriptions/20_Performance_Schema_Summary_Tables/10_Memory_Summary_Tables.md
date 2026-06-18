#### 29.12.20.10 Tabelas de Resumo de Memória

Os instrumentos do Schema de Desempenho monitoram o uso da memória e agregam estatísticas de uso de memória, detalhadas por esses fatores:

- Tipo de memória utilizada (várias caches, buffers internos, etc.)

- Ferramenta, conta, usuário, host que realiza indiretamente a operação de memória

O Schema de Desempenho auxilia na medição dos seguintes aspectos do uso da memória

- Tamanhos de memória utilizados
- Contagem de operações
- Marcas de água baixa e alta

Os tamanhos de memória ajudam a entender ou ajustar o consumo de memória do servidor.

As contagens de operações ajudam a entender ou ajustar a pressão geral que o servidor está exercendo sobre o alocador de memória, o que tem um impacto no desempenho. Alocar um único byte um milhão de vezes não é a mesma coisa que alocar um milhão de bytes uma única vez; rastrear ambos os tamanhos e contagens pode expor a diferença.

As marcas de água baixa e alta são essenciais para detectar picos de carga de trabalho, estabilidade geral da carga de trabalho e possíveis vazamentos de memória.

As tabelas de resumo de memória não contêm informações de temporização, pois os eventos de memória não são temporizados.

Para obter informações sobre a coleta de dados de uso de memória, consulte Comportamento de Instrumentação de Memória.

Resumo das informações de evento de memória:

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

Cada tabela de resumo de memória tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- A tabela `memory_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e o nome do evento.

- A tabela `memory_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um determinado host e nome de evento.

- A coluna `memory_summary_by_thread_by_event_name` tem as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

- A tabela `memory_summary_by_user_by_event_name` possui as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- A coluna `memory_summary_global_by_event_name` tem uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de memória tem essas colunas de resumo contendo valores agregados:

- `COUNT_ALLOC`, `COUNT_FREE`

  Os números agregados de chamadas para funções de alocação de memória e liberação de memória.

- `SUM_NUMBER_OF_BYTES_ALLOC`, `SUM_NUMBER_OF_BYTES_FREE`

  Os tamanhos agregados dos blocos de memória alocados e liberados.

- `CURRENT_COUNT_USED`

  O número agregado de blocos atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `COUNT_ALLOC` − `COUNT_FREE`.

- `CURRENT_NUMBER_OF_BYTES_USED`

  O tamanho agregado dos blocos de memória atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `SUM_NUMBER_OF_BYTES_ALLOC` − `SUM_NUMBER_OF_BYTES_FREE`.

- `LOW_COUNT_USED`, `HIGH_COUNT_USED`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_COUNT_USED`.

- `LOW_NUMBER_OF_BYTES_USED`, `HIGH_NUMBER_OF_BYTES_USED`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_NUMBER_OF_BYTES_USED`.

As tabelas de resumo de memória têm esses índices:

- `memory_summary_by_account_by_event_name`:

  - Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

- `memory_summary_by_host_by_event_name`:

  - Chave primária em (`HOST`, `EVENT_NAME`)

- `memory_summary_by_thread_by_event_name`:

  - Chave primária em (`THREAD_ID`, `EVENT_NAME`)

- `memory_summary_by_user_by_event_name`:

  - Chave primária em (`USER`, `EVENT_NAME`)

- `memory_summary_global_by_event_name`:

  - Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de memória. Ele tem esses efeitos:

- Em geral, o truncamento redefini o nível de referência para as estatísticas, mas não altera o estado do servidor. Ou seja, truncar uma tabela de memória não libera memória.

- `COUNT_ALLOC` e `COUNT_FREE` são redefinidos em uma nova linha de base, reduzindo cada contador pelo mesmo valor.

- Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidos para uma nova linha de base.

- `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

- `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão da qual depende, ou pela truncagem de `memory_summary_global_by_event_name`. Para obter detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Comportamento de Instrumentação de Memória

Os instrumentos de memória estão listados na tabela `setup_instruments` e têm nomes do tipo `memory/code_area/instrument_name`. A instrumentação de memória é ativada por padrão.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no próprio Schema de Desempenho. Os instrumentos `memory/performance_schema/` são integrados, sempre ativados e não podem ser desativados no início ou durante o runtime. Os instrumentos de memória integrados são exibidos apenas na tabela `memory_summary_global_by_event_name`.

Para controlar o estado da instrumentação de memória ao iniciar o servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

- Desativar:

  ```
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória em tempo de execução, atualize a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`:

- Ativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

- Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'memory/%';
  ```

Para instrumentos de memória, a coluna `TIMED` em `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

Quando um fio no servidor executa uma alocação de memória que foi instrumentada, essas regras se aplicam:

- Se o fio não estiver instrumentado ou o instrumento de memória não estiver habilitado, o bloco de memória alocado não será instrumentado.

- Caso contrário (ou seja, se o fio e o instrumento estiverem habilitados), o bloco de memória alocado será instrumentado.

Para a liberação, essas regras se aplicam:

- Se uma operação de alocação de memória foi instrumentada, a operação de liberação correspondente também é instrumentada, independentemente do status do instrumento ou da thread habilitada atual.

- Se uma operação de alocação de memória não foi instrumentada, a operação de liberação correspondente não será instrumentada, independentemente do status do instrumento ou da thread habilitada atual.

Para as estatísticas por fio, as seguintes regras se aplicam.

Quando um bloco de memória instrumentado de tamanho `N` é alocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

- `COUNT_ALLOC`: Aumentada em 1

- `CURRENT_COUNT_USED`: Aumentada em 1

- `HIGH_COUNT_USED`: Aumenta se `CURRENT_COUNT_USED` for um novo máximo

- `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentada por `N`

- `CURRENT_NUMBER_OF_BYTES_USED`: Aumentada por `N`

- `HIGH_NUMBER_OF_BYTES_USED`: Aumenta se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é liberado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

- `COUNT_FREE`: Aumentada em 1

- `CURRENT_COUNT_USED`: Reduzido em 1

- `LOW_COUNT_USED`: Reduzida se `CURRENT_COUNT_USED` for um novo mínimo

- `SUM_NUMBER_OF_BYTES_FREE`: Aumentada por `N`

- `CURRENT_NUMBER_OF_BYTES_USED`: Reduzido em `N`

- `LOW_NUMBER_OF_BYTES_USED`: Reduzida se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por conta, por usuário, por host), as mesmas regras se aplicam, conforme esperado para marcas de água altas e baixas.

- `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Schema de Desempenho é garantido para ser menor ou igual ao menor número ou tamanho de memória efetivamente utilizada durante a execução.

- `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Schema de Desempenho é garantido para ser maior ou igual ao maior número ou tamanho de memória efetivamente utilizada durante a execução.

Para estimativas menores em tabelas resumidas que não sejam `memory_summary_global_by_event_name`, é possível que os valores sejam negativos se a propriedade da memória for transferida entre os threads.

Aqui está um exemplo de cálculo de estimativa; mas observe que a implementação da estimativa está sujeita a alterações:

O fio 1 utiliza memória na faixa de 1 MB a 2 MB durante a execução, conforme relatado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela `memory_summary_by_thread_by_event_name`.

O fio 2 usa memória na faixa de 10MB a 12MB durante a execução, conforme relatado da mesma forma.

Quando esses dois fios pertencem à mesma conta de usuário, o resumo por conta estima que essa conta usou memória na faixa de 11 MB a 14 MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (assumindo o pior caso).

11 MB é uma estimativa mais baixa que pode ocorrer apenas se ambos os threads atingirem a marca de baixo uso ao mesmo tempo.

14 MB é uma estimativa mais alta que pode ocorrer apenas se ambos os threads atingirem a marca de alto uso ao mesmo tempo.

O uso real da memória para essa conta poderia ter ficado na faixa de 11,5 MB a 13,5 MB.

Para o planejamento de capacidade, relatar o pior cenário é, na verdade, o comportamento desejado, pois mostra o que pode acontecer quando as sessões não estão correlacionadas, o que geralmente é o caso.
