## 25.19 Usando o Performance Schema para Diagnosticar Problemas

[25.19.1 Geração de Perfil de Query Usando Performance Schema](performance-schema-query-profiling.html)

O Performance Schema é uma ferramenta para ajudar um DBA a fazer *performance tuning* (ajuste de desempenho) ao coletar medições reais em vez de "chutes no escuro". Esta seção demonstra algumas maneiras de usar o Performance Schema para essa finalidade. A discussão aqui depende do uso de *event filtering* (filtragem de eventos), que é descrito na [Seção 25.4.2, “Performance Schema Event Filtering”](performance-schema-filtering.html "25.4.2 Performance Schema Event Filtering").

O exemplo a seguir fornece uma metodologia que você pode usar para analisar um problema repetível, como investigar um *performance bottleneck* (gargalo de desempenho). Para começar, você deve ter um caso de uso repetível onde o desempenho é considerado "muito lento" e precisa de otimização, e você deve habilitar toda a instrumentação (sem *pre-filtering* (pré-filtragem) algum).

1. Execute o caso de uso.
2. Usando as tabelas do Performance Schema, analise a causa raiz do problema de desempenho. Essa análise depende muito de *post-filtering* (pós-filtragem).

3. Para áreas problemáticas que forem descartadas, desabilite os instrumentos correspondentes. Por exemplo, se a análise mostrar que o problema não está relacionado a *file I/O* em um *storage engine* específico, desabilite os instrumentos de *file I/O* para esse *engine*. Em seguida, realize um `TRUNCATE` nas tabelas de histórico e resumo para remover eventos coletados anteriormente.

4. Repita o processo na etapa 1.

   A cada iteração, a saída do Performance Schema, particularmente a tabela [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 A Tabela events_waits_history_long"), contém cada vez menos "ruído" causado por instrumentos não significativos e, dado que esta tabela tem um tamanho fixo, contém cada vez mais dados relevantes para a análise do problema em questão.

   A cada iteração, a investigação deve levar cada vez mais perto da causa raiz do problema, à medida que a taxa de sinal-ruído melhora, facilitando a análise.

5. Uma vez identificada a causa raiz de um *performance bottleneck* (gargalo de desempenho), tome a ação corretiva apropriada, como:

   * Ajustar os parâmetros do *server* (tamanhos de *cache*, memória, e assim por diante).

   * Ajustar uma *Query* escrevendo-a de forma diferente.
   * Ajustar o *Database Schema* (*tables*, *indexes*, e assim por diante).
   * Ajustar o código (isso se aplica apenas a desenvolvedores de *storage engine* ou *server*).

6. Comece novamente na etapa 1, para ver os efeitos das alterações no desempenho.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar *performance bottlenecks* ou *deadlocks* (impasses). Isso é possível pela instrumentação do Performance Schema da seguinte forma:

1. Suponha que o *thread* 1 esteja preso esperando por um *mutex*.
2. Você pode determinar o que o *thread* está esperando:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_1;
   ```

   Digamos que o resultado da *Query* identifique que o *thread* está esperando pelo *mutex* A, encontrado em `events_waits_current.OBJECT_INSTANCE_BEGIN`.

3. Você pode determinar qual *thread* está segurando o *mutex* A:

   ```sql
   SELECT * FROM performance_schema.mutex_instances
   WHERE OBJECT_INSTANCE_BEGIN = mutex_A;
   ```

   Digamos que o resultado da *Query* identifique que é o *thread* 2 que está segurando o *mutex* A, conforme encontrado em `mutex_instances.LOCKED_BY_THREAD_ID`.

4. Você pode ver o que o *thread* 2 está fazendo:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_2;
   ```