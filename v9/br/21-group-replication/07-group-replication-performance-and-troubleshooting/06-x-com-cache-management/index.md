### 20.7.6 Gerenciamento de Cache do XCom

20.7.6.1 Aumentar o tamanho do cache

20.7.6.2 Reduzir o tamanho do cache

O motor de comunicação de grupo para a Replicação em Grupo (XCom, uma variante do Paxos) inclui um cache para mensagens (e seus metadados) trocadas entre os membros do grupo como parte do protocolo de consenso. Entre outras funções, o cache de mensagens é usado para a recuperação de mensagens perdidas por membros que se reconectam ao grupo após um período em que não conseguiram se comunicar com os outros membros do grupo.

O limite de tamanho do cache do XCom pode ser definido usando a variável de sistema `group_replication_message_cache_size`. Se o limite de tamanho do cache for atingido, o XCom remove as entradas mais antigas que foram decididas e entregues. O mesmo limite de tamanho do cache deve ser definido em todos os membros do grupo, porque um membro inacessível que está tentando se reconectar seleciona aleatoriamente outro membro para a recuperação de mensagens perdidas. Portanto, os mesmos mensagens devem estar disponíveis no cache de cada membro.

Certifique-se de que há memória suficiente disponível no seu sistema para o limite de tamanho de cache escolhido, considerando o tamanho dos outros caches e pools de objetos do MySQL Server. Note que o limite definido usando `group_replication_message_cache_size` aplica-se apenas aos dados armazenados no cache, e as estruturas do cache requerem um adicional de 50 MB de memória.

Ao escolher o valor para `group_replication_message_cache_size`, faça isso considerando o volume esperado de mensagens no período antes de um membro ser expulso. O comprimento desse período é controlado pela variável de sistema `group_replication_member_expel_timeout`, que determina o período de espera (até uma hora) que é permitido *acima* do período inicial de detecção de 5 segundos para que os membros retornem ao grupo em vez de serem expulsos. O tempo de espera padrão é de 5 segundos, portanto, por padrão, um membro não é expulso até que esteja ausente por pelo menos 10 segundos.