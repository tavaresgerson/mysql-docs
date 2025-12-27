## 29.19 Utilizando o Schema de Desempenho para Diagnosticar Problemas

29.19.1 Análise de Profilagem de Eventos Usando o Schema de Desempenho

29.19.2 Obtenção de Informações de Eventos Pais

O Schema de Desempenho é uma ferramenta que ajuda um DBA a ajustar o desempenho ao realizar medições reais em vez de "suposições casuais". Esta seção demonstra algumas maneiras de usar o Schema de Desempenho para esse propósito. A discussão aqui depende do uso da filtragem de eventos, que é descrita na Seção 29.4.2, “Filtragem de Eventos do Schema de Desempenho”.

O exemplo a seguir fornece uma metodologia que você pode usar para analisar um problema recorrente, como investigar um gargalo de desempenho. Para começar, você deve ter um caso de uso recorrente onde o desempenho é considerado "muito lento" e precisa de otimização, e você deve habilitar todas as instrumentações (sem pré-filtragem).

1. Execute o caso de uso.
2. Usando as tabelas do Schema de Desempenho, analise a causa raiz do problema de desempenho. Essa análise depende fortemente do pós-filtragem.

3. Para áreas de problema que são descartadas, desabilite os instrumentos correspondentes. Por exemplo, se a análise mostrar que o problema não está relacionado ao I/O de arquivos em um motor de armazenamento específico, desabilite os instrumentos de I/O de arquivos para esse motor. Em seguida, trunque as tabelas de histórico e resumo para remover eventos coletados anteriormente.

4. Repita o processo no passo 1.

   Com cada iteração, a saída do Schema de Desempenho, particularmente a tabela `events_waits_history_long`, contém cada vez menos "ruído" causado por instrumentos não significativos, e, dado que essa tabela tem um tamanho fixo, contém cada vez mais dados relevantes para a análise do problema em questão.

   Com cada iteração, a investigação deve levar cada vez mais perto da causa raiz do problema, à medida que a relação "sinal/ruído" melhora, facilitando a análise.

5. Uma vez que a causa raiz do gargalo de desempenho seja identificada, tome a ação corretiva apropriada, como:

   * Ajustar os parâmetros do servidor (tamanhos de cache, memória, etc.).

   * Ajustar uma consulta escrevendo-a de maneira diferente,
   * Ajustar o esquema do banco de dados (tabelas, índices, etc.).
   * Ajustar o código (isso se aplica apenas aos desenvolvedores do motor de armazenamento ou do servidor).

6. Comece novamente no passo 1, para ver os efeitos das mudanças no desempenho.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Isso é possível graças à instrumentação do Performance Schema da seguinte forma:

1. Suponha que o thread 1 esteja parado esperando por um mutex.
2. Você pode determinar o que o thread está esperando:

   ```
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_1;
   ```

   Digamos que o resultado da consulta identifique que o thread está esperando pelo mutex A, encontrado em `events_waits_current.OBJECT_INSTANCE_BEGIN`.

3. Você pode determinar qual thread está segurando o mutex A:

   ```
   SELECT * FROM performance_schema.mutex_instances
   WHERE OBJECT_INSTANCE_BEGIN = mutex_A;
   ```

   Digamos que o resultado da consulta identifique que é o thread 2 segurando o mutex A, conforme encontrado em `mutex_instances.LOCKED_BY_THREAD_ID`.

4. Você pode ver o que o thread 2 está fazendo:

   ```
   SELECT * FROM performance_schema.events_waits_current
   WHERE THREAD_ID = thread_2;
   ```