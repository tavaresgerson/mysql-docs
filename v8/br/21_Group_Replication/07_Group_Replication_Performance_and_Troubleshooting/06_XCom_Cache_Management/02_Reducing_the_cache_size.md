#### 20.7.6.2 Reduzir o tamanho do cache

O ajuste mínimo para o tamanho do cache de mensagens do XCom é de 1 GB até o MySQL 8.0.20. A partir do MySQL 8.0.21, o ajuste mínimo é de 134217728 bytes (128 MB), o que permite a implantação em um host com uma quantidade limitada de memória disponível. Ter um ajuste muito baixo do `group_replication_message_cache_size` não é recomendado se o host estiver em uma rede instável, porque um cache de mensagens menor dificulta a reconexão dos membros do grupo após uma perda transitória da conectividade.

Se um membro que se reconectar não conseguir recuperar todas as mensagens necessárias do cache de mensagens XCom, o membro deve sair do grupo e se reconectar a ele, a fim de recuperar as transações ausentes do log binário de outro membro usando a recuperação distribuída. A partir do MySQL 8.0.21, um membro que saiu de um grupo faz três tentativas de auto-reconexão por padrão, então o processo de reconexão ao grupo ainda pode ocorrer sem intervenção do operador. No entanto, a reconexão usando a recuperação distribuída é um processo significativamente mais longo e mais complexo do que recuperar mensagens de um cache de mensagens XCom, então o membro leva mais tempo para ficar disponível e o desempenho do grupo pode ser impactado. Em uma rede estável, que minimiza a frequência e a duração das perdas transitórias de conectividade para os membros, a frequência dessa ocorrência também deve ser minimizada, então o grupo pode ser capaz de tolerar um tamanho menor do cache de mensagens XCom sem um impacto significativo em seu desempenho.

Se você estiver considerando a redução do limite de tamanho do cache, pode consultar a tabela do Schema de Desempenho `memory_summary_global_by_event_name` usando a seguinte instrução:

```
SELECT * FROM performance_schema.memory_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'memory/group_rpl/GCS_XCom::xcom_cache';
```

Isso retorna estatísticas de uso de memória para o cache de mensagens, incluindo o número atual de entradas armazenadas no cache e o tamanho atual do cache. Se você reduzir o limite de tamanho do cache, o XCom remove as entradas mais antigas que foram decididas e entregues até que o tamanho atual esteja abaixo do limite. O XCom pode exceder temporariamente o limite de tamanho do cache enquanto esse processo de remoção estiver em andamento.
