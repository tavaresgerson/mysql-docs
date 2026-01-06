#### 25.12.15.9 Tabelas de Resumo de Memória

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

Cada tabela de resumo de memória tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- A tabela `memory_summary_by_account_by_event_name` (performance-schema-memory-summary-tables.html) possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e nome do evento.

- A tabela `memory_summary_by_host_by_event_name` (performance-schema-memory-summary-tables.html) possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um determinado host e nome de evento.

- `memory_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado thread e nome de evento.

- A tabela `memory_summary_by_user_by_event_name` (performance-schema-memory-summary-tables.html) possui as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- A tabela `memory_summary_global_by_event_name` (performance-schema-memory-summary-tables.html) possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de memória tem essas colunas de resumo contendo valores agregados:

- `COUNT_ALLOC`, `COUNT_FREE`

  Os números agregados de chamadas para funções de alocação de memória e liberação de memória.

- `SUM_NUMBER_OF_BYTES_ALLOC`, `SUM_NUMBER_OF_BYTES_FREE`

  Os tamanhos agregados dos blocos de memória alocados e liberados.

- `CONTAR_ATUAL_USADO`

  O número agregado de blocos atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `COUNT_ALLOC` − `COUNT_FREE`.

- `NUMÉRO_ATUAL_DE_BYTES_USADOS`

  O tamanho agregado dos blocos de memória atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `SUMA_NUMERO_DE_BYTES_ALLOC` − `SUMA_NUMERO_DE_BYTES_FREE`.

- `LOW_COUNT_USED`, `HIGH_COUNT_USED`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_COUNT_USED`.

- `BAIXO NÚMERO DE BYTES USADOS`, `ALTO NÚMERO DE BYTES USADOS`

  As marcas de água baixa e alta correspondentes à coluna `CURRENT_NUMBER_OF_BYTES_USED`.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de memória. Ela tem esses efeitos:

- Em geral, o truncamento redefini o nível de referência para as estatísticas, mas não altera o estado do servidor. Ou seja, truncar uma tabela de memória não libera memória.

- `COUNT_ALLOC` e `COUNT_FREE` são redefinidos para uma nova linha de base, reduzindo cada contador pelo mesmo valor.

- Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidas para uma nova linha de base.

- `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

- `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `memory_summary_global_by_event_name`. Para obter detalhes, consulte Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Comportamento de Instrumentação de Memória

Os instrumentos de memória estão listados na tabela `setup_instruments` e têm nomes do tipo `memory/code_area/instrument_name`. A maioria dos instrumentos de memória está desabilitada por padrão.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no próprio Schema de Desempenho. Os instrumentos `memory/performance_schema/` são pré-construídos, sempre ativados e não podem ser desativados no início ou durante o runtime. Os instrumentos de memória pré-construídos são exibidos apenas na tabela `Resumo de memória global por nome de evento`.

Para controlar o estado da instrumentação de memória no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória em tempo de execução, atualize a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments` (performance-schema-setup-instruments-table.html):

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

- Desativar:

  ```sql
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

Quando um bloco de memória instrumentado de tamanho *`N`* é alocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

- `COUNT_ALLOC`: Aumentada em 1

- `CURRENT_COUNT_USED`: Aumentada em 1

- `HIGH_COUNT_USED`: Aumenta se `CURRENT_COUNT_USED` for um novo máximo

- `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentada em *`N`*

- `CURRENT_NUMBER_OF_BYTES_USED`: Aumentada em *`N`*

- `HIGH_NUMBER_OF_BYTES_USED`: Aumenta se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é liberado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

- `COUNT_FREE`: Aumentada em 1

- `CURRENT_COUNT_USED`: Reduzido em 1

- `LOW_COUNT_USED`: Reduzido se `CURRENT_COUNT_USED` for um novo mínimo

- `SUM_NUMBER_OF_BYTES_FREE`: Aumentada em *`N`*

- `CURRENT_NUMBER_OF_BYTES_USED`: Reduzido em *`N`*

- `LOW_NUMBER_OF_BYTES_USED`: Reduzido se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por conta, por usuário, por host), as mesmas regras se aplicam, conforme esperado para marcas de água altas e baixas.

- `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Gerenciamento de Desempenho é garantido para ser menor ou igual à menor contagem ou tamanho de memória efetivamente usada durante a execução.

- `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Performance Schema é garantido para ser maior ou igual à contagem ou tamanho mais alto de memória efetivamente usada durante a execução.

Para estimativas mais baixas em tabelas resumidas que não sejam `memory_summary_global_by_event_name`, é possível que os valores sejam negativos se a propriedade da memória for transferida entre threads.

Aqui está um exemplo de cálculo de estimativa; mas observe que a implementação da estimativa está sujeita a alterações:

O fio 1 utiliza memória na faixa de 1 MB a 2 MB durante a execução, conforme relatado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela `memory_summary_by_thread_by_event_name`.

O fio 2 usa memória na faixa de 10MB a 12MB durante a execução, conforme relatado da mesma forma.

Quando esses dois fios pertencem à mesma conta de usuário, o resumo por conta estima que essa conta usou memória na faixa de 11 MB a 14 MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (assumindo o pior caso).

11 MB é uma estimativa mais baixa que pode ocorrer apenas se ambos os threads atingirem a marca de baixo uso ao mesmo tempo.

14 MB é uma estimativa mais alta que pode ocorrer apenas se ambos os threads atingirem a marca de alto uso ao mesmo tempo.

O uso real da memória para essa conta poderia ter ficado na faixa de 11,5 MB a 13,5 MB.

Para o planejamento de capacidade, relatar o pior cenário é, na verdade, o comportamento desejado, pois mostra o que pode acontecer quando as sessões não estão correlacionadas, o que geralmente é o caso.
