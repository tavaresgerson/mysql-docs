## 25.19 Usar o Schema de Desempenho para diagnosticar problemas

25.19.1 Profilação de consultas usando o Gerenciamento de desempenho

O Schema de Desempenho é uma ferramenta que ajuda um DBA a ajustar o desempenho ao realizar medições reais em vez de "suposições casuais". Esta seção demonstra algumas maneiras de usar o Schema de Desempenho para esse propósito. A discussão aqui depende do uso da filtragem de eventos, que é descrita em Seção 25.4.2, "Filtragem de Eventos do Schema de Desempenho".

O exemplo a seguir apresenta uma metodologia que você pode usar para analisar um problema recorrente, como investigar um gargalo de desempenho. Para começar, você deve ter um caso de uso recorrente em que o desempenho é considerado "muito lento" e precisa ser otimizado, e você deve habilitar toda a instrumentação (sem pré-filtragem).

1. Execute o caso de uso.

2. Utilize as tabelas do Gerenciamento de Desempenho para analisar a causa raiz do problema de desempenho. Essa análise depende muito do pós-filtragem.

3. Para áreas com problemas que foram descartados, desative os instrumentos correspondentes. Por exemplo, se a análise mostrar que o problema não está relacionado ao I/O de arquivos em um determinado mecanismo de armazenamento, desative os instrumentos de I/O de arquivos para esse mecanismo. Em seguida, trunque as tabelas de histórico e resumo para remover eventos coletados anteriormente.

4. Repita o processo no passo 1.

   Em cada iteração, a saída do Schema de Desempenho, particularmente a tabela `events_waits_history_long`, contém cada vez menos "ruído" causado por instrumentos não significativos, e, dado que essa tabela tem um tamanho fixo, contém cada vez mais dados relevantes para a análise do problema em questão.

   Em cada iteração, a investigação deve se aproximar cada vez mais da causa raiz do problema, à medida que a relação sinal/ruído melhora, facilitando a análise.

5. Depois de identificar a causa raiz do gargalo de desempenho, tome a ação corretiva apropriada, como:

   - Ajuste os parâmetros do servidor (tamanhos de cache, memória, etc.).

   - Ajuste uma consulta escrevendo-a de maneira diferente.

   - Ajuste o esquema do banco de dados (tabelas, índices, etc.).

   - Ajuste o código (isso se aplica apenas aos desenvolvedores do mecanismo de armazenamento ou do servidor).

6. Comece novamente no passo 1, para ver os efeitos das alterações no desempenho.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Isso é possível graças à instrumentação do Performance Schema, conforme descrito a seguir:

1. Suponha que o fio 1 esteja preso, esperando por um mutex.

2. Você pode determinar o que o fio está esperando:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_1;
   ```

   Diga que o resultado da consulta identifica que o thread está aguardando o mutex A, encontrado em `events_waits_current.OBJECT_INSTANCE_BEGIN`.

3. Você pode determinar qual fio está segurando o mutex A:

   ```sql
   SELECT * FROM performance_schema.mutex_instances
   WHERE OBJECT_INSTANCE_BEGIN = mutex_A;
   ```

   Diga que o resultado da consulta identifica que é o fio 2 que está segurando o mutex A, conforme encontrado em `mutex_instances.LOCKED_BY_THREAD_ID`.

4. Você pode ver o que o fio 2 está fazendo:

   ```sql
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_2;
   ```
