## 20.7 Desempenho e solução de problemas da replicação em grupo

A Replicação em Grupo é projetada para criar sistemas resistentes a falhas com detecção de falha integrada e recuperação automatizada. Se uma instância do servidor membro deixar voluntariamente ou deixar de se comunicar com o grupo, os membros restantes concordam em reconfigurar o grupo entre si e escolhem um novo primário, se necessário. Os membros expulsos tentam automaticamente se reintegrar ao grupo e são atualizados pela recuperação distribuída. Se um grupo apresentar um nível de dificuldades tal que não possa entrar em contato com a maioria de seus membros para concordar com uma decisão, ele se identifica como tendo perdido o quórum e para de processar transações. A Replicação em Grupo também possui mecanismos e configurações integrados para ajudar o grupo a se adaptar e gerenciar variações na carga de trabalho e no tamanho das mensagens, e a permanecer dentro das limitações do sistema subjacente e dos recursos de rede.

As configurações padrão das variáveis do sistema da Replicação por Grupo são projetadas para maximizar o desempenho e a autonomia de um grupo. As informações nesta seção são para ajudá-lo a configurar um grupo de replicação para otimizar o tratamento automático de quaisquer problemas recorrentes que você experimentar em seus sistemas específicos, como interrupções transitórias na rede ou cargas de trabalho e transações que excedem os recursos de uma instância do servidor.

Se você perceber que os membros do grupo estão sendo expulsos e retornando ao grupo com mais frequência do que o que você gostaria, é possível que as configurações padrão de detecção de falha da Replicação de Grupo sejam muito sensíveis para o seu sistema. Isso pode ser o caso em redes ou máquinas mais lentas, redes com uma alta taxa de interrupções transitórias inesperadas ou durante interrupções planejadas de rede. Para obter conselhos sobre como lidar com essa situação ajustando as configurações, consulte a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”.

Você só precisa intervir manualmente em uma configuração de replicação em grupo se algo acontecer que o grupo não possa lidar automaticamente. Algumas questões-chave que podem exigir intervenção do administrador são quando um membro está no status `ERROR` e não pode se reincorporar ao grupo, ou quando uma partição de rede faz com que o grupo perca o quórum.

* Se um membro que funciona e está configurado corretamente, mas não consegue se juntar ou se juntar novamente ao grupo usando recuperação distribuída, e permanece no status `ERROR`, a Seção 20.5.4.4, “Tolerância a Falhas para Recuperação Distribuída”, explica os possíveis problemas. Uma causa provável é que o membro que está se juntando tenha transações extras que não estão presentes nos membros existentes do grupo. Para obter conselhos sobre como lidar com essa situação, consulte a Seção 20.4.1, “GTIDs e Replicação de Grupo”.

* Se um grupo perdeu o quórum, isso pode ser devido a uma partição de rede que divide o grupo em duas partes, ou possivelmente devido ao mau funcionamento da maioria dos servidores. Para obter conselhos sobre como lidar com essa situação, consulte a Seção 20.7.8, “Lidando com uma Partição de Rede e Perda de Quórum”.

### 20.7.1 Ajuste fino do tópico de comunicação do grupo

O fio de comunicação de grupo (GCT) funciona em um loop enquanto o plugin de replicação de grupo está carregado. O GCT recebe mensagens do grupo e do plugin, lida com tarefas relacionadas ao quórum e detecção de falhas, envia algumas mensagens de manutenção em atividade e também lida com as transações de entrada e saída de/para o servidor/grupo. O GCT aguarda mensagens de entrada em uma fila. Quando não há mensagens, o GCT aguarda. Configurar essa espera para ser um pouco mais longa (fazendo uma espera ativa) antes de realmente dormir pode ser benéfico em alguns casos. Isso ocorre porque a alternativa é o sistema operacional trocar o GCT do processador e fazer uma troca de contexto.

Para forçar o GCT a fazer uma espera ativa, use a opção `group_replication_poll_spin_loops`, que faz o loop do GCT, sem fazer nada relevante para o número configurado de loops, antes de realmente coletar a fila para a próxima mensagem.

Por exemplo:

```
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```

### 20.7.2 Controle de fluxo

O MySQL Group Replication garante que uma transação seja confirmada apenas após a maioria dos membros de um grupo a ter recebido e concordado com a ordem relativa entre todas as transações enviadas simultaneamente. Essa abordagem funciona bem se o número total de escritas no grupo não exceder a capacidade de escrita de qualquer membro do grupo. Se isso acontecer e alguns membros tiverem menos throughput de escrita do que outros — especialmente menos do que os membros que escrevem — esses membros podem começar a ficar para trás dos membros que escrevem.

Quando alguns membros ficam para trás do restante do grupo, as leituras em tais membros podem externalizar dados muito antigos. Dependendo do motivo pelo qual o membro está para trás, outros membros do grupo podem ter que salvar mais ou menos do contexto de replicação para poder atender a potenciais solicitações de transferência de dados do membro lento.

O protocolo de replicação fornece um mecanismo para evitar uma distância excessiva, em termos de transações aplicadas, entre membros rápidos e lentos. Isso é conhecido como mecanismo de controle de fluxo, que tem os seguintes objetivos:

1. Manter os membros próximos, para minimizar o buffer e a des sincronização entre eles.

2. Adaptar-se rapidamente a condições em mudança, como diferentes cargas de trabalho ou mais escritores no grupo.

3. Dar a cada membro uma parte da capacidade de escrita disponível.
4. Não reduzir o desempenho mais do que o estritamente necessário para evitar o desperdício de recursos.

Dado o design do Grupo de Replicação, a decisão de restringir ou não a largura de banda pode ser tomada considerando duas filas de trabalho, a fila de certificação e a fila de aplicação do log binário. Sempre que o tamanho de uma dessas filas exceder o limite definido pelo usuário, o mecanismo de restrição é acionado.

O controle de fluxo depende de dois mecanismos básicos:

1. Monitoramento dos membros para coletar estatísticas sobre o desempenho e o tamanho da fila de todos os membros do grupo, para fazer suposições informadas sobre a pressão máxima de escrita à qual cada membro deve ser submetido.

2. Restrição de membros que tentam escrever além de suas cotas alocadas da capacidade disponível em cada momento.

#### 20.7.2.1 Sondas e Estatísticas

O mecanismo de monitoramento funciona com cada membro implantando um conjunto de sondas para coletar informações sobre suas filas de trabalho e desempenho. Em seguida, propaga essas informações periodicamente para o grupo para compartilhar esses dados com os outros membros.

Tais sensores estão espalhados por toda a pilha do plugin e permitem estabelecer métricas, como:

* o tamanho da fila de certificação; * o tamanho da fila de aplicação de replicação; * o número total de transações certificadas; * o número total de transações remotas aplicadas no membro;

* o número total de transações locais.

Assim que um membro recebe uma mensagem com estatísticas de outro membro, ele calcula métricas adicionais sobre quantas transações foram certificadas, aplicadas e executadas localmente no último período de monitoramento.

Os dados de monitoramento são compartilhados com outros membros do grupo periodicamente. O período de monitoramento deve ser suficientemente longo para permitir que os outros membros decidam sobre as solicitações de escrita atuais, mas suficientemente curto para que tenha um impacto mínimo na largura de banda do grupo. As informações são compartilhadas a cada segundo, e esse período é suficiente para atender a ambas as preocupações.

#### 20.7.2.2 Limitação da replicação em grupo

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de controle é ativado e decide se deve limitar a taxa na qual um membro pode executar/comprometer novas transações.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tiver uma fila grande (para certificação ou para o fio de aplicação), então a capacidade para executar novas transações deve estar próxima àquelas certificadas ou aplicadas no último período.

A menor capacidade de todos os membros do grupo determina a capacidade real do grupo, enquanto o número de transações locais determina quantos membros estão escrevendo nela e, consequentemente, quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que cada membro tem uma quota de escrita estabelecida com base na capacidade disponível, ou seja, um número de transações que pode emitir com segurança para o próximo período. A quota de escritor é aplicada pelo mecanismo de controle se o tamanho da fila do certificador ou do aplicativo de registro binário exceder um limite definido pelo usuário.

A quota é reduzida pelo número de transações que foram atrasadas no último período, e depois ainda reduzida em 10% para permitir que a fila que desencadeou o problema reduza seu tamanho. Para evitar grandes saltos no desempenho assim que o tamanho da fila ultrapassar o limite, o desempenho só é permitido crescer em 10% por período após esse.

O mecanismo atual de controle não penaliza as transações abaixo da quota, mas retarda o término das transações que a excedem até o final do período de monitoramento. Como consequência, se a quota for muito pequena para as solicitações de escrita emitidas, algumas transações podem ter latências próximas ao período de monitoramento.

### 20.7.3 Líder Consensual Único

Por padrão, o motor de comunicação de grupo para a Replicação de Grupo (XCom, uma variante do Paxos) opera usando cada membro do grupo de replicação como líder. A partir do MySQL 8.0.27, o motor de comunicação de grupo pode usar um único líder para impulsionar o consenso quando o grupo está no modo de único primário. Operar com um único líder de consenso melhora o desempenho e a resiliência no modo de único primário, especialmente quando alguns dos membros secundários do grupo estão atualmente inacessíveis.

Para usar um único líder de consenso, o grupo deve ser configurado da seguinte forma:

* O grupo deve estar no modo single-primary. * A variável de sistema `group_replication_paxos_single_leader` deve ser definida como `ON`. Com o ajuste padrão `OFF`, o comportamento é desativado. Você deve realizar um reinício completo do grupo de replicação (bootstrap) para que o Grupo de Replicação possa pegar uma mudança nesta configuração.

* A versão do protocolo de comunicação de Replicação do Grupo deve ser definida como 8.0.27 ou superior. Use a função `group_replication_get_communication_protocol()` para visualizar a versão do protocolo de comunicação do grupo. Se estiver sendo usada uma versão inferior, o grupo não pode usar esse comportamento. Você pode usar a função `group_replication_set_communication_protocol()` para definir o protocolo de comunicação do grupo para uma versão superior, se todos os membros do grupo o suportam. O MySQL InnoDB Cluster gerencia automaticamente a versão do protocolo de comunicação. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

Quando essa configuração estiver em vigor, a Replicação de Grupo instrui o motor de comunicação do grupo a usar o primário do grupo como o único líder para impulsionar o consenso. Quando um novo primário é eleito, a Replicação de Grupo informa ao motor de comunicação do grupo que o use em vez disso. Se o primário estiver atualmente insalubre, o motor de comunicação do grupo usa um membro alternativo como líder de consenso. A tabela do Schema de Desempenho `replication_group_communication_information` mostra o líder de consenso preferido e atual, com o líder preferido sendo a escolha da Replicação de Grupo, e o líder atual sendo o que é selecionado pelo motor de comunicação do grupo.

Se o grupo estiver no modo multi-primário, tiver uma versão de protocolo de comunicação mais baixa ou o comportamento estiver desativado pela configuração `group_replication_paxos_single_leader`, todos os membros são usados como líderes para impulsionar o consenso. Nessa situação, a tabela do Schema de Desempenho `replication_group_communication_information` mostra todos os membros como líderes preferidos e reais.

A coluna `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE` da tabela do Schema de Desempenho `replication_group_communication_information` mostra se o grupo suporta o uso de um único líder, mesmo que `group_replication_paxos_single_leader` esteja atualmente definido como `OFF` no membro pesquisado. O valor da coluna é 1 se o grupo foi iniciado com `group_replication_paxos_single_leader` definido como `ON`, e sua versão de protocolo de comunicação é MySQL 8.0.27 ou superior. Esta informação é retornada apenas para membros do grupo em estado `ONLINE` ou `RECOVERING`.

### 20.7.4 Compressão de Mensagens

Para mensagens enviadas entre membros do grupo online, a Replicação de Grupo permite a compressão de mensagens por padrão. Se uma mensagem específica é comprimida depende do limite que você configura usando a variável de sistema `group_replication_compression_threshold`. Mensagens que têm um payload maior que o número especificado de bytes são comprimidas.

O limite de compressão padrão é de 1.000.000 de bytes. Você pode usar as seguintes declarações para aumentar o limite de compressão para 2 MB, por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

Se você definir `group_replication_compression_threshold` como zero, a compressão de mensagens será desativada.

A Replicação em Grupo usa o algoritmo de compressão LZ4 para comprimir as mensagens enviadas no grupo. Observe que o tamanho máximo de entrada suportado pelo algoritmo de compressão LZ4 é de 2113929216 bytes. Esse limite é menor que o valor máximo possível para a variável de sistema `group_replication_compression_threshold`, que é compatível com o tamanho máximo de mensagem aceito pelo XCom. O tamanho máximo de entrada do LZ4 é, portanto, um limite prático para a compressão de mensagens, e as transações acima desse tamanho não podem ser comprometidas quando a compressão de mensagens está habilitada. Com o algoritmo de compressão LZ4, não defina um valor maior que 2113929216 bytes para `group_replication_compression_threshold`.

O valor de `group_replication_compression_threshold` não é necessário que seja o mesmo em todos os membros do grupo. No entanto, é aconselhável definir o mesmo valor em todos os membros do grupo para evitar o descarte desnecessário de transações, falha na entrega de mensagens ou falha na recuperação de mensagens.

A partir do MySQL 8.0.18, você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário de um doador. A compressão dessas mensagens, que são enviadas de um doador que já está no grupo para um membro que está se juntando, é controlada separadamente usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Para mais informações, consulte a Seção 6.2.8, “Controle da Compressão de Conexão”.

A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Os payloads das transações permanecem comprimidos quando são transferidos entre os membros do grupo. Se você usar a compressão de transações de log binário em combinação com a compressão de mensagens da Replicação de Grupo, a compressão de mensagens tem menos oportunidade de agir sobre os dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e payloads de transações que não estão comprimidos. Para mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

A compressão das mensagens enviadas no grupo ocorre no nível do motor de comunicação do grupo, antes de os dados serem entregues ao fio de comunicação do grupo, portanto, ocorre no contexto do fio de sessão do usuário `mysql`. Se o tamanho do payload da mensagem exceder o limite definido por `group_replication_compression_threshold`, o payload da transação é comprimido antes de ser enviado para o grupo e descomprimido quando é recebido. Ao receber uma mensagem, o membro verifica o envelope da mensagem para verificar se ela está comprimida ou não. Se necessário, o membro descomprime a transação, antes de entregá-la à camada superior. Esse processo é mostrado na figura a seguir.

**Figura 20.13 Suporte à compressão**

![The MySQL Group Replication plugin architecture is shown as described in an earlier topic, with the five layers of the plugin positioned between the MySQL server and the replication group. Compression and decompression are handled by the Group Communication System API, which is the fourth layer of the Group Replication plugin. The group communication engine (the fifth layer of the plugin) and the group members use the compressed transactions with the smaller data size. The MySQL Server core and the three higher layers of the Group Replication plugin (the APIs, the capture, applier, and recovery components, and the replication protocol module) use the original transactions with the larger data size.](images/gr-compress-decompress.png)

Quando a largura de banda da rede é um gargalo, a compressão de mensagens pode proporcionar até 30-40% de melhoria no desempenho no nível de comunicação de grupo. Isso é especialmente importante no contexto de grandes grupos de servidores sob carga. A natureza peer-to-peer das interconexões entre os *N* participantes do grupo faz com que o remetente envie a mesma quantidade de dados *N* vezes. Além disso, os logs binários provavelmente apresentarão uma alta taxa de compressão. Isso torna a compressão uma característica atraente para cargas de trabalho de Replicação de Grupo que contêm grandes transações.

### 20.7.5 Fragmentação de Mensagem

Quando uma mensagem anormalmente grande é enviada entre os membros do grupo de replicação de grupo, pode resultar em alguns membros do grupo serem relatados como falhados e expulsos do grupo. Isso ocorre porque o único fio usado pelo motor de comunicação de grupo da Replicação de Grupo (XCom, uma variante Paxos) é ocupado processando a mensagem por muito tempo, então alguns dos membros do grupo podem relatar o receptor como falhado. A partir do MySQL 8.0.16, por padrão, as mensagens grandes são automaticamente divididas em fragmentos que são enviados separadamente e reassembrados pelos destinatários.

A variável de sistema `group_replication_communication_max_message_size` especifica um tamanho máximo de mensagem para comunicações de Replicação por Grupo, acima do qual as mensagens são fragmentadas. O tamanho máximo padrão de mensagem é de 10485760 bytes (10 MiB). O maior valor permitido é o mesmo que o valor máximo das variáveis de sistema `replica_max_allowed_packet` e `slave_max_allowed_packet`, que é de 1073741824 bytes (1 GB). O ajuste para `group_replication_communication_max_message_size` deve ser menor que `replica_max_allowed_packet` (ou `slave_max_allowed_packet`), porque o fio aplicável não pode lidar com fragmentos de mensagem maiores que o tamanho máximo do pacote permitido. Para desativar a fragmentação, especifique um valor zero para `group_replication_communication_max_message_size`.

Assim como a maioria das outras variáveis do sistema de Replicação em Grupo, você deve reiniciar o plugin de Replicação em Grupo para que a alteração se torne efetiva. Por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_communication_max_message_size= 5242880;
START GROUP_REPLICATION;
```

A entrega de mensagens para uma mensagem fragmentada é considerada completa quando todos os fragmentos da mensagem foram recebidos e reassembrados por todos os membros do grupo. As mensagens fragmentadas incluem informações em seus cabeçalhos que permitem que um membro que se junta durante a transmissão da mensagem recobre os fragmentos anteriores que foram enviados antes de se juntar. Se o membro que se junta não conseguir recuperar os fragmentos, expulsa-se do grupo.

Para que um grupo de replicação possa usar fragmentação, todos os membros do grupo devem estar no MySQL 8.0.16 ou superior, e a versão do protocolo de comunicação da Replicação do Grupo que está sendo usada pelo grupo deve permitir a fragmentação. Você pode inspecionar o protocolo de comunicação usado por um grupo usando a função `group_replication_get_communication_protocol()`, que retorna a versão mais antiga do MySQL Server que o grupo suporta. As versões do MySQL 5.7.14 permitem a compressão de mensagens, e as versões do MySQL 8.0.16 também permitem a fragmentação de mensagens. Se todos os membros do grupo estiverem no MySQL 8.0.16 ou superior e não houver necessidade de permitir que membros de versões anteriores se juntem, você pode usar a função `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação para MySQL 8.0.16 ou superior para permitir a fragmentação. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

Se um grupo de replicação não puder usar fragmentação porque alguns membros não a suportam, a variável de sistema `group_replication_transaction_size_limit` pode ser usada para limitar o tamanho máximo das transações que o grupo aceita. No MySQL 8.0, o ajuste padrão é de aproximadamente 143 MB. Transações acima desse tamanho são revertidas. Você também pode usar a variável de sistema `group_replication_member_expel_timeout` para permitir um tempo adicional (até uma hora) antes que um membro sob suspeita de ter falhado seja expulso do grupo.

### 20.7.6 Gerenciamento do Cache XCom

O motor de comunicação em grupo para Replicação em Grupo (XCom, uma variante do Paxos) inclui um cache para mensagens (e seus metadados) trocadas entre os membros do grupo como parte do protocolo de consenso. Entre outras funções, o cache de mensagens é usado para recuperação de mensagens perdidas por membros que se reconectam com o grupo após um período em que não conseguiram se comunicar com os outros membros do grupo.

A partir do MySQL 8.0.16, é possível definir um limite de tamanho de cache para o cache de mensagens do XCom usando a variável de sistema `group_replication_message_cache_size`. Se o limite de tamanho de cache for atingido, o XCom remove as entradas mais antigas que foram decididas e entregues. O mesmo limite de tamanho de cache deve ser definido em todos os membros do grupo, porque um membro inatingível que está tentando se reconectar seleciona qualquer outro membro aleatoriamente para a recuperação de mensagens perdidas. Portanto, as mesmas mensagens devem estar disponíveis no cache de cada membro.

Antes do MySQL 8.0.16, o tamanho do cache era de 1 GB, e o ajuste padrão para o tamanho do cache do MySQL 8.0.16 é o mesmo. Certifique-se de que há memória suficiente disponível no seu sistema para o limite de tamanho do cache escolhido, considerando o tamanho dos outros caches e pools de objetos do MySQL Server. Note que o limite definido usando `group_replication_message_cache_size` se aplica apenas aos dados armazenados no cache, e as estruturas do cache requerem um adicional de 50 MB de memória.

Ao selecionar um ajuste do `group_replication_message_cache_size`, faça-o com referência ao volume esperado de mensagens no período de tempo antes de um membro ser expulso. O comprimento desse período de tempo é controlado pela variável de sistema `group_replication_member_expel_timeout`, que determina o período de espera (até uma hora) que é permitido, além do período inicial de detecção de 5 segundos para que os membros retornem ao grupo em vez de serem expulsos. Note que, antes do MySQL 8.0.21, esse período de tempo era padrão de 5 segundos desde que o membro se tornasse indisponível, o que é apenas o período de detecção antes de uma suspeita ser criada, porque o tempo de espera adicional para expulsão definido pela variável de sistema `group_replication_member_expel_timeout` era padrão de zero. A partir do 8.0.21, o tempo de espera para expulsão é padrão de 5 segundos, então, por padrão, um membro não é expulso até que tenha estado ausente por pelo menos 10 segundos.

#### 20.7.6.1 Aumentar o tamanho do cache

Se um membro estiver ausente por um período que não é longo o suficiente para ser expulso do grupo, ele pode se reconectar e começar a participar do grupo novamente, recuperando as transações perdidas do cache de mensagens XCom de outro membro. No entanto, se as transações que ocorreram durante a ausência do membro tiverem sido excluídas dos caches de mensagens XCom dos outros membros porque seu limite de tamanho máximo foi atingido, o membro não pode se reconectar dessa maneira.

O Sistema de Comunicação de Grupo (GCS) do Grupo Replication alerta você, por meio de uma mensagem de aviso, quando uma mensagem que provavelmente será necessária para a recuperação por um membro que atualmente não está disponível é removida do cache de mensagens. Essa mensagem de aviso é registrada em todos os membros do grupo ativos (apenas uma vez para cada membro não disponível). Embora os membros do grupo não possam saber com certeza qual mensagem foi a última vista pelo membro não disponível, a mensagem de aviso indica que o tamanho do cache pode não ser suficiente para suportar o período de espera escolhido antes de um membro ser expulso.

Nessa situação, considere aumentar o limite do `group_replication_message_cache_size` com referência ao volume esperado de mensagens no período de tempo especificado pela variável de sistema `group_replication_member_expel_timeout`, mais o período de detecção de 5 segundos, para que o cache contenha todas as mensagens perdidas necessárias para que os membros retornem com sucesso. Também pode considerar aumentar o limite do tamanho do cache temporariamente se espera que um membro se torne inatingível por um período de tempo incomum.

#### 20.7.6.2 Reduzir o tamanho do cache

O ajuste mínimo para o tamanho do cache de mensagens XCom é de 1 GB até o MySQL 8.0.20. A partir do MySQL 8.0.21, o ajuste mínimo é de 134217728 bytes (128 MB), o que permite a implantação em um host que tem uma quantidade limitada de memória disponível. Não é recomendado ter um ajuste muito baixo de `group_replication_message_cache_size` se o host estiver em uma rede instável, porque um cache de mensagens menor dificulta a reconexão dos membros do grupo após uma perda transitória de conectividade.

Se um membro que se reconectar não conseguir recuperar todas as mensagens necessárias do cache de mensagens XCom, o membro deve deixar o grupo e se reconectar a ele, a fim de recuperar as transações ausentes do log binário de outro membro usando a recuperação distribuída. A partir do MySQL 8.0.21, um membro que deixou um grupo faz três tentativas de auto-reconexão por padrão, então o processo de reconexão ao grupo ainda pode ocorrer sem intervenção do operador. No entanto, a reconexão usando recuperação distribuída é um processo significativamente mais longo e mais complexo do que recuperar mensagens de um cache de mensagens XCom, então o membro leva mais tempo para ficar disponível e o desempenho do grupo pode ser impactado. Em uma rede estável, que minimiza a frequência e a duração das perdas transitórias de conectividade para os membros, a frequência dessa ocorrência também deve ser minimizada, então o grupo pode ser capaz de tolerar um tamanho menor do cache de mensagens XCom sem um impacto significativo em seu desempenho.

Se você está considerando a redução do limite de tamanho do cache, pode consultar a tabela do Schema de desempenho `memory_summary_global_by_event_name` usando a seguinte declaração:

```
SELECT * FROM performance_schema.memory_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'memory/group_rpl/GCS_XCom::xcom_cache';
```

Isso retorna estatísticas de uso de memória para o cache de mensagens, incluindo o número atual de entradas armazenadas e o tamanho atual do cache. Se você reduzir o limite de tamanho do cache, o XCom remove as entradas mais antigas que foram decididas e entregues até que o tamanho atual esteja abaixo do limite. O XCom pode exceder temporariamente o limite de tamanho do cache enquanto esse processo de remoção está em andamento.

### 20.7.7 Respostas à detecção de falhas e partição de rede

O mecanismo de detecção de falha da Replicação em grupo é projetado para identificar os membros do grupo que não estão mais se comunicando com o grupo e expulsá-los quando e quando parece provável que tenham falhado. Ter um mecanismo de detecção de falha aumenta a chance de que o grupo contenha a maioria dos membros que funcionam corretamente e que, portanto, os pedidos dos clientes sejam processados corretamente.

Normalmente, todos os membros do grupo trocam regularmente mensagens com todos os outros membros do grupo. Se um membro do grupo não receber nenhuma mensagem de um determinado colega por 5 segundos, quando este período de detecção terminar, isso cria uma suspeita sobre o colega. Quando uma suspeita expira, assume-se que o membro suspeito falhou e é expulso do grupo. Um membro expulso é removido da lista de membros vista pelos outros membros, mas ele não sabe que foi expulso do grupo, então ele se vê como online e os outros membros como inacessíveis. Se o membro não falhou na verdade (por exemplo, porque foi apenas desconectado devido a um problema temporário na rede) e é capaz de retomar a comunicação com os outros membros, ele recebe uma visão contendo as informações de que foi expulso do grupo.

As respostas dos membros do grupo, incluindo o próprio membro falhado, a essas situações podem ser configuradas em vários pontos do processo. Por padrão, os seguintes comportamentos ocorrem se um membro for suspeito de ter falhado:

1. Até o MySQL 8.0.20, quando uma suspeita é criada, ela expira imediatamente. O membro suspeito é responsável pela expulsão assim que a suspeita expirada é identificada pelo grupo. O membro pode potencialmente sobreviver por mais alguns segundos após o tempo de espera, pois a verificação de suspeitas expiradas é realizada periodicamente. A partir do MySQL 8.0.21, um período de espera de 5 segundos é adicionado antes de a suspeita expirar e o membro suspeito é responsável pela expulsão.

2. Se um membro expulso retoma a comunicação e percebe que foi expulso, até o MySQL 8.0.20, ele não tenta se reincorporar ao grupo. A partir do MySQL 8.0.21, ele faz três tentativas automáticas de se reincorporar ao grupo (com 5 minutos entre cada tentativa), e se esse procedimento de auto-reincorporação não funcionar, ele então para de tentar se reincorporar ao grupo.

3. Quando um membro expulso não tenta voltar a se juntar ao grupo, ele muda para o modo de leitura apenas super e aguarda atenção do operador. (A exceção é em versões de MySQL 8.0.12 a 8.0.15, onde o padrão era o membro desligar-se. A partir do MySQL 8.0.16, o comportamento foi alterado para corresponder ao comportamento no MySQL 5.7.)

Você pode usar as opções de configuração de Replicação em Grupo descritas nesta seção para alterar esses comportamentos permanentemente ou temporariamente, de acordo com as necessidades do seu sistema e suas prioridades. Se você está enfrentando expulsões desnecessárias causadas por redes ou máquinas mais lentas, redes com uma alta taxa de interrupções transitórias inesperadas ou interrupções planejadas de rede, considere aumentar o tempo de espera para expulsar e as tentativas de auto-rejoin. A partir do MySQL 8.0.21, as configurações padrão foram alteradas nessa direção para reduzir a frequência da necessidade de intervenção do operador para restabelecer membros expulsos nessas situações. Note que, embora um membro esteja passando por algum dos comportamentos padrão descritos acima, embora não aceite escritas, leituras ainda podem ser feitas se o membro ainda estiver se comunicando com clientes, com uma probabilidade crescente de leituras obsoletas ao longo do tempo. Se evitar leituras obsoletas é uma prioridade mais alta para você do que evitar intervenção do operador, considere reduzir o tempo de espera para expulsar e as tentativas de auto-rejoin ou configurá-las para zero.

Os membros que não falharam podem perder contato com parte, mas não com toda a, do grupo de replicação devido a uma partição de rede. Por exemplo, em um grupo de 5 servidores (S1, S2, S3, S4, S5), se houver uma desconexão entre (S1, S2) e (S3, S4, S5), há uma partição de rede. O primeiro grupo (S1, S2) está agora em minoria porque não pode entrar em contato com mais de metade do grupo. Quaisquer transações que são processadas pelos membros do grupo minoritário são bloqueadas, porque a maioria do grupo é inacessível, portanto, o grupo não pode alcançar o quórum. Para uma descrição detalhada deste cenário, consulte a Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”. Nesta situação, o comportamento padrão é que os membros tanto do grupo minoritário quanto do grupo majoritário permaneçam no grupo, continuem a aceitar transações (embora sejam bloqueadas nos membros do grupo minoritário) e esperem pela intervenção do operador. Este comportamento também é configurável.

Observe que, quando os membros do grupo estão em uma versão mais antiga do MySQL Server que não suporta uma configuração relevante, ou em uma versão com um comportamento padrão diferente, eles agem em relação a si mesmos e aos outros membros do grupo de acordo com os comportamentos padrão mencionados acima. Por exemplo, um membro que não suporta a variável de sistema `group_replication_member_expel_timeout` expulsa outros membros assim que uma suspeita expirada é detectada, e essa expulsão é aceita por outros membros, mesmo que eles suportem a variável de sistema e tenham um tempo de espera mais longo definido.

#### 20.7.7.1 Expulsão de tempo de espera

Você pode usar a variável de sistema `group_replication_member_expel_timeout`, que está disponível a partir do MySQL 8.0.13, para permitir um tempo adicional entre a criação de uma suspeita e a expulsão do membro suspeito. Uma suspeita é criada quando um servidor não recebe mensagens de outro servidor, conforme explicado na Seção 20.1.4.2, “Detecção de Falha”.

Há um período inicial de detecção de 5 segundos antes de um membro do grupo de replicação em grupo criar uma suspeita de outro membro (ou de si mesmo). O membro do grupo é então expulso quando a suspeita de outro membro sobre ele (ou a própria suspeita de si mesmo) expira. Pode passar um curto período de tempo após isso antes que o mecanismo de expulsão detecte e implemente a expulsão. `group_replication_member_expel_timeout` especifica o período de tempo em segundos, chamado de expurgo de expurgo, que um membro do grupo espera entre criar uma suspeita e expulsar o membro suspeito. Os membros suspeitos são listados como `UNREACHABLE` durante esse período de espera, mas não são removidos da lista de membros do grupo.

* Se um membro suspeito se tornar ativo novamente antes do término da suspeita no final do período de espera, o membro aplica todas as mensagens que foram armazenadas pelos membros restantes do grupo no cache de mensagens do XCom e entra no estado `ONLINE`, sem intervenção do operador. Nessa situação, o membro é considerado pelo grupo como a mesma encarnação.

* Se um membro suspeito se tornar ativo apenas após o período de suspeita expirar e conseguir retomar as comunicações, ele receberá uma exibição em que é expulso e, nesse ponto, percebe que foi expulso. Você pode usar `group_replication_autorejoin_tries`, que está disponível a partir do MySQL 8.0.16, para fazer o membro tentar automaticamente retomar o grupo nesse ponto. A partir do MySQL 8.0.21, essa funcionalidade é ativada por padrão e o membro faz três tentativas de auto-retomada. Se o procedimento de auto-retomada não for bem-sucedido ou não for tentado, o membro expulso segue então a ação de saída especificada por `group_replication_exit_state_action`.

O período de espera antes de expulsar um membro só se aplica a membros que estiveram anteriormente ativos no grupo. Os não membros que nunca estiveram ativos no grupo não recebem esse período de espera e são removidos após o período de detecção inicial, porque levaram muito tempo para se juntar.

Se `group_replication_member_expel_timeout` estiver definido como 0, não há período de espera, e o membro suspeito é responsável pela expulsão imediatamente após o término do período de detecção de 5 segundos. Este é o comportamento padrão até e incluindo o MySQL 8.0.20. Este é também o comportamento de um membro do grupo que está em uma versão do MySQL Server que não suporta a variável de sistema `group_replication_member_expel_timeout`. A partir do MySQL 8.0.21, o valor padrão é 5, o que significa que o membro suspeito é responsável pela expulsão 5 segundos após o período de detecção de 5 segundos. Não é obrigatório que todos os membros de um grupo tenham o mesmo ajuste para `group_replication_member_expel_timeout`, mas é recomendado para evitar expulsões inesperadas. Qualquer membro pode criar uma suspeita em relação a qualquer outro membro, incluindo a si mesmo, portanto, o tempo máximo de expulsão efetivo é o do membro com o ajuste mais baixo.

Considere aumentar o valor de `group_replication_member_expel_timeout` do padrão nos seguintes cenários:

* A rede é lenta e os 5 ou 10 segundos padrão antes da expulsão não são suficientes para que os membros do grupo sempre troquem pelo menos uma mensagem.

* A rede às vezes tem interrupções transitórias e você quer evitar expulsões desnecessárias e mudanças de membros primários nesses momentos.

* A rede não está sob seu controle direto e você quer minimizar a necessidade de intervenção do operador.

* espera-se uma interrupção temporária da rede e você não quer que alguns ou todos os membros sejam expulsos por causa disso.

* Uma máquina individual está experimentando um atraso e você não quer que ela seja expulsa do grupo.

Você pode especificar um tempo de expurgo de até um máximo de 3600 segundos (1 hora). É importante garantir que o cache de mensagens do XCom seja suficientemente grande para conter o volume esperado de mensagens no período de tempo especificado, além do período inicial de detecção de 5 segundos, caso contrário, os membros não poderão se reconectar. Você pode ajustar o limite do tamanho do cache usando a variável de sistema `group_replication_message_cache_size`. Para mais informações, consulte a Seção 20.7.6, “Gestão do Cache do XCom”.

Se algum membro de um grupo estiver sob suspeita atualmente, a associação do grupo não pode ser reconfigurada (adicionando ou removendo membros ou elege um novo líder). Se as mudanças na associação do grupo precisam ser implementadas enquanto um ou mais membros estiverem sob suspeita e você queira que os membros suspeitos permaneçam no grupo, tome as ações necessárias para tornar os membros ativos novamente, se isso for possível. Se você não puder tornar os membros ativos novamente e deseja que eles sejam expulsos do grupo, pode forçar a suspensão das suspeitas imediatamente. Faça isso alterando o valor de `group_replication_member_expel_timeout` em quaisquer membros ativos para um valor menor que o tempo que já se passou desde que as suspeitas foram criadas. Os membros suspeitos, então, tornam-se responsáveis pela expulsão imediatamente.

Se um membro do grupo de replicação parar inesperadamente e for imediatamente reiniciado (por exemplo, porque foi iniciado com `mysqld_safe`, ele automaticamente tenta se reincorporar ao grupo se o `group_replication_start_on_boot=on` estiver definido. Nessa situação, é possível que a tentativa de reinício e reincorporação ocorra antes de a encarnação anterior do membro ter sido expulsa do grupo, caso em que o membro não pode se reincorporar. A partir do MySQL 8.0.19, a Replicação de Grupo usa automaticamente uma característica do Sistema de Comunicação do Grupo (GCS) para tentar novamente a tentativa de reincorporação para o membro 10 vezes, com um intervalo de 5 segundos entre cada tentativa. Isso deve cobrir a maioria dos casos e permitir tempo suficiente para a encarnação anterior ser expulsa do grupo, permitindo que o membro se reincorpore. Note que, se a variável de sistema `group_replication_member_expel_timeout` estiver definida para especificar um período de espera mais longo antes de o membro ser expulso, as tentativas automáticas de reincorporação ainda podem não ser bem-sucedidas.

Para estratégias alternativas de mitigação que evitem expulsões desnecessárias, quando a variável do sistema `group_replication_member_expel_timeout` não estiver disponível, consulte a Seção 20.3.2, “Limitações da Replicação em Grupo”.

#### 20.7.7.2 Retardo do tempo da maioria inatingível

Por padrão, os membros que se encontram em minoria devido a uma partição de rede não saem automaticamente do grupo. Você pode usar a variável do sistema `group_replication_unreachable_majority_timeout` para definir um número de segundos para que um membro espere após perder contato com a maioria dos membros do grupo e, em seguida, saia do grupo. Definir um limite de tempo significa que você não precisa monitorar ativamente servidores que estão em um grupo minoritário após uma partição de rede, e você pode evitar a possibilidade de criar uma situação de cérebro dividido (com duas versões da filiação ao grupo) devido a uma intervenção inadequada.

Quando o tempo de espera especificado por `group_replication_unreachable_majority_timeout` expira, todas as transações pendentes que foram processadas pelo membro e pelos outros do grupo minoritário são revertidas, e os servidores desse grupo passam para o estado `ERROR`. Você pode usar a variável de sistema `group_replication_autorejoin_tries`, que está disponível a partir do MySQL 8.0.16, para fazer com que o membro tente automaticamente se reconectar ao grupo neste ponto. A partir do MySQL 8.0.21, essa funcionalidade é ativada por padrão e o membro faz três tentativas de autoconexão. Se o procedimento de autoconexão não for bem-sucedido ou não for realizado, o membro minoritário segue então a ação de saída especificada por `group_replication_exit_state_action`.

Considere os seguintes pontos ao decidir se deve ou não definir um limite de tempo para a maioria inacessível:

* Em um grupo simétrico, por exemplo, um grupo com dois ou quatro servidores, se ambas as partições contiverem um número igual de servidores, ambos os grupos consideram que estão em minoria e entram no estado [[`ERROR`]. Nesta situação, o grupo não tem uma partição funcional.

* Embora exista um grupo minoritário, quaisquer transações processadas pelo grupo minoritário são aceitas, mas bloqueadas, pois os servidores minoritários não conseguem atingir o quórum, até que seja emitida a `STOP GROUP_REPLICATION` nesses servidores ou seja atingido o tempo de espera da maioria inacessível.

* Se você não definir um limite de tempo de maioria inacessível, os servidores do grupo minoritário nunca entrarão no estado `ERROR` automaticamente, e você deve paralisá-los manualmente.

Definir um limite de tempo de maioria inalcançável não tem efeito se for definido nos servidores do grupo minoritário após a detecção da perda da maioria.

Se você não usar a variável `group_replication_unreachable_majority_timeout`, o processo para a invenção do operador em caso de uma partição da rede é descrito na Seção 20.7.8, “Tratamento de uma Partição da Rede e Perda de Quórum”. O processo envolve verificar quais servidores estão funcionando e, se necessário, forçar uma nova adesão ao grupo.

#### 20.7.7.3 Auto-Rejoin

A variável de sistema `group_replication_autorejoin_tries`, disponível a partir do MySQL 8.0.16, faz com que um membro que tenha sido expulso ou atingido seu limite de tempo de maioria inacessível tente se reincorporar ao grupo automaticamente. Até o MySQL 8.0.20, o valor da variável de sistema é padrão de 0, portanto, o reinício automático não é ativado por padrão. A partir do MySQL 8.0.21, o valor da variável de sistema é padrão de 3, o que significa que o membro faz automaticamente 3 tentativas para se reincorporar ao grupo, com 5 minutos entre cada uma.

Quando o auto-rejoin não está ativado, um membro aceita sua expulsão assim que retoma a comunicação e procede à ação especificada pela variável de sistema `group_replication_exit_state_action`. Após isso, é necessária uma intervenção manual para trazer o membro de volta ao grupo. Usar o recurso de auto-rejoin é apropriado se você pode tolerar a possibilidade de leituras obsoletas e deseja minimizar a necessidade de intervenção manual, especialmente onde problemas transitórios de rede resultam com frequência na expulsão de membros.

Com o recurso de auto-rejoin, quando a expulsão do membro ou o tempo de espera para a maioria inacessível é atingido, ele tenta se reincorporar (usando os valores atuais das opções do plugin), e depois continua a fazer mais tentativas de auto-rejoin até o número especificado de tentativas. Após uma tentativa de auto-rejoin não bem-sucedida, o membro espera 5 minutos antes do próximo ensaio. As tentativas de auto-rejoin e o tempo entre elas são chamadas de procedimento de auto-rejoin. Se o número especificado de tentativas for esgotado sem o membro se reincorporar ou ser interrompido, o membro prossegue para a ação especificada pela variável de sistema `group_replication_exit_state_action`.

Durante e entre as tentativas de auto-rejoin, um membro permanece no modo de leitura apenas super e exibe um estado `ERROR` em sua visão do grupo de replicação. Durante esse período, o membro não aceita escritas. No entanto, leituras ainda podem ser feitas no membro, com uma probabilidade crescente de leituras desatualizadas ao longo do tempo. Se você deseja intervir para tirar o membro offline durante o procedimento de auto-rejoin, o membro pode ser parado manualmente a qualquer momento usando uma declaração `STOP GROUP_REPLICATION` ou desligando o servidor. Se você não pode tolerar a possibilidade de leituras desatualizadas por qualquer período de tempo, defina a variável de sistema `group_replication_autorejoin_tries` para 0.

Você pode monitorar o procedimento de auto-rejoin usando o Schema de desempenho. Enquanto um procedimento de auto-rejoin está ocorrendo, a tabela do Schema de desempenho `events_stages_current` mostra o evento “Realizando procedimento de auto-rejoin”, com o número de tentativas que foram realizadas até então durante essa instância do procedimento (na coluna `WORK_COMPLETED`). A tabela `events_stages_summary_global_by_event_name` mostra o número de vezes que a instância do servidor iniciou o procedimento de auto-rejoin (na coluna `COUNT_STAR`). A tabela `events_stages_history_long` mostra o tempo em que cada um desses procedimentos de auto-rejoin foi concluído (na coluna `TIMER_END`). Enquanto um membro está se reagrupando em um grupo de replicação, seu status pode ser exibido como `OFFLINE` ou `ERROR` antes que o grupo complete as verificações de compatibilidade e o aceite como membro. Quando o membro está atualizando as transações do grupo, seu status é `RECOVERING`.

#### 20.7.7.4 Ação de saída

A variável de sistema `group_replication_exit_state_action`, disponível a partir do MySQL 8.0.12 e do MySQL 5.7.24, especifica o que a Replicação de Grupo faz quando o membro sai do grupo de forma não intencional devido a um erro ou problema, e não consegue se reincorporar automaticamente ou não tenta. Note que, no caso de um membro expulso, o membro não sabe que foi expulso até se reconectar ao grupo, portanto, a ação especificada é realizada apenas se o membro conseguir se reconectar, ou se o membro levantar uma suspeita sobre si mesmo e se expulsar.

Em ordem de impacto, as ações de saída são as seguintes:

1. Se `READ_ONLY` for a ação de saída, a instância muda o MySQL para o modo de leitura super-sólida ao definir a variável de sistema `super_read_only` para `ON`. Quando o membro estiver no modo de leitura super-sólida, os clientes não poderão fazer quaisquer atualizações, mesmo que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio descontinuado `SUPER`). No entanto, os clientes ainda podem ler dados, e, como as atualizações não estão sendo feitas, há uma probabilidade de leituras obsoletas que aumenta com o tempo. Com essa configuração, você precisa, portanto, monitorar proativamente os servidores em busca de falhas. Essa ação de saída é a padrão do MySQL 8.0.15. Após essa ação de saída ser realizada, o status do membro é exibido como `ERROR` na visualização do grupo.

2. Se `OFFLINE_MODE` for a ação de saída, a instância muda o MySQL para o modo offline, definindo a variável de sistema `offline_mode` para `ON`. Quando o membro estiver no modo offline, os usuários conectados no cliente serão desconectados na próxima solicitação e as conexões não serão mais aceitas, com exceção dos usuários do cliente que possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio descontinuado `SUPER`). A Replicação de Grupo também define a variável de sistema `super_read_only` para `ON`, para que os clientes não possam fazer quaisquer atualizações, mesmo que tenham se conectado com o privilégio `CONNECTION_ADMIN` ou `SUPER`. Esta ação de saída impede tanto as atualizações quanto as leituras obsoletas (com exceção das leituras pelos usuários do cliente com os privilégios declarados), e permite que ferramentas de proxy, como o MySQL Router, reconheçam que o servidor está indisponível e redirecionem as conexões dos clientes. Também deixa a instância em execução, para que um administrador possa tentar resolver o problema sem desligar o MySQL. Esta ação de saída está disponível a partir do MySQL 8.0.18. Após a realização desta ação de saída, o status do membro é exibido como `ERROR` na visualização do grupo (não `OFFLINE`, o que significa que um membro tem a funcionalidade de Replicação de Grupo disponível, mas atualmente não pertence a um grupo).

3. Se `ABORT_SERVER` for a ação de saída, a instância encerra o MySQL. Instruir o membro a desligar-se impede todas as leituras obsoletas e atualizações do cliente, mas isso significa que a instância do servidor MySQL não estará disponível e precisará ser reiniciada, mesmo que o problema possa ter sido resolvido sem essa etapa. Essa ação de saída foi a padrão do MySQL 8.0.12, quando a variável do sistema foi adicionada, até o MySQL 8.0.15 inclusive. Após essa ação de saída ser realizada, o membro é removido da lista de servidores na visualização do grupo.

Tenha em mente que a intervenção do operador é necessária, independentemente da ação de saída definida, pois um ex-membro que esgotou suas tentativas de auto-rejoin (ou nunca as teve) e foi expulso do grupo não pode se reincorporar sem um reinício da Replicação do Grupo. A ação de saída apenas influencia se os clientes ainda podem ler dados no servidor que não conseguiu se reincorporar ao grupo ou se o servidor continua em execução.

Importante

Se uma falha ocorrer antes que o membro tenha se unido com sucesso ao grupo, a ação de saída especificada por `group_replication_exit_state_action` *não é realizada*. Este é o caso se houver uma falha durante a verificação de configuração local, ou uma incompatibilidade entre a configuração do membro que está se juntando e a configuração do grupo. Nessas situações, a variável de sistema `super_read_only` é deixada com seu valor original, e o servidor não desativa o MySQL. Para garantir que o servidor não aceite atualizações quando a Replicação do Grupo não foi iniciada, portanto, recomendamos que `super_read_only=ON` seja definido no arquivo de configuração do servidor na inicialização, que a Replicação do Grupo altera para `OFF` nos membros primários após ter sido iniciada com sucesso. Esta proteção é particularmente importante quando o servidor é configurado para iniciar a Replicação do Grupo no inicialização do servidor (`group_replication_start_on_boot=ON`), mas também é útil quando a Replicação do Grupo é iniciada manualmente usando uma declaração `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement").

Se ocorrer um erro após o membro ter se juntado com sucesso ao grupo, a ação de saída especificada é realizada. Este é o caso nas seguintes situações:

1. *Erro de aplicação* - Há um erro no aplicativo de aplicação de réplica. Esse problema não é recuperável.

2. *Recuperação distribuída não possível* - Há um problema que significa que o processo de recuperação distribuída da Replicação em Grupo (que utiliza operações de clonagem remota e transferência de estado do log binário) não pode ser completado. A Replicação em Grupo recomeça a recuperação distribuída automaticamente quando isso faz sentido, mas para de executar se não houver mais opções para completar o processo. Para detalhes, consulte a Seção 20.5.4.4, "Tolerância a Falhas para Recuperação Distribuída".

3. *Erro de alteração de configuração de grupo* - Um erro ocorreu durante uma alteração de configuração em todo o grupo realizada usando uma função, conforme descrito na Seção 20.5.1, "Configurando um Grupo Online".

4. *Erro na eleição primária* - Um erro ocorreu durante a eleição de um novo membro primário para um grupo no modo de única eleição primária, conforme descrito na Seção 20.1.3.1, "Modo de Única Eleição Primária".

5. *Tempo de espera para maioria inacessível* - O membro perdeu contato com a maioria dos membros do grupo, portanto está em minoria, e o tempo de espera que foi definido pela variável de sistema `group_replication_unreachable_majority_timeout` expirou.

6. *Membro expulso do grupo* - Uma suspeita foi levantada sobre o membro, e qualquer tempo de espera definido pela variável de sistema `group_replication_member_expel_timeout` expirou, e o membro retomou a comunicação com o grupo e descobriu que foi expulso.

7. *De tentativas de reinclusão automática* - A variável de sistema `group_replication_autorejoin_tries` foi definida para especificar o número de tentativas de reinclusão automática após perda da maioria ou expulsão, e o membro completou esse número de tentativas sem sucesso.

A tabela a seguir resume os cenários de falha e as ações em cada caso:

**Tabela 20.3 Ações de saída em situações de falha na replicação em grupo**

<table frame="all" summary="Summarizes how the selected exit action does or does not operate depending on the failure situation"><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><thead><tr> <th scope="col"><p>Situação de falha</p></th> <th scope="col"><p>O Grupo de Replicação começou com<code class="literal">START GROUP_REPLICATION</code> </p></th> <th scope="col"><p>O Grupo de Replicação começou com<code>group_replication_start_on_boot =ON</code> </p></th> </tr></thead><tbody><tr> <th scope="row"><p>O membro não passa na verificação de configuração local</p><p>Desajuste entre a configuração do membro de adesão e do grupo</p></th> <td><p> <code>super_read_only</code>e<code>offline_mode</code>inalterado</p><p>MySQL continua funcionando</p><p>Conjunto<code>super_read_only=ON</code>ao inicializar para evitar atualizações</p></td> <td><p> <code>super_read_only</code>e<code>offline_mode</code>inalterado</p><p>MySQL continua funcionando</p><p>Conjunto<code>super_read_only=ON</code>ao inicializar para evitar atualizações (importante)</p></td> </tr><tr> <th scope="row"><p>Erro de aplicação no membro</p><p>A recuperação distribuída não é possível</p><p>Erro na alteração da configuração do grupo</p><p>Erro na eleição primária</p><p>Tempo limite para maioria inalcançável</p><p>Membro expulso do grupo</p><p>De tentativas de reinclusão automática</p></th> <td><p> <code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p> <code>offline_mode</code>e<code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p>MySQL é desligado</p></td> <td><p> <code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p> <code>offline_mode</code>e<code>super_read_only</code>prontos para<code>ON</code> </p><p>PORTUGUÊS:</p><p>MySQL é desligado</p></td> </tr></tbody></table>

### 20.7.8 Tratamento de uma Partição de Rede e Perda de Quórum

O grupo precisa alcançar consenso sempre que uma mudança que precisa ser replicada acontece. Este é o caso de transações regulares, mas também é necessário para mudanças de membros do grupo e algumas mensagens internas que mantêm o grupo consistente. O consenso exige que a maioria dos membros do grupo concorde em uma decisão dada. Quando a maioria dos membros do grupo é perdida, o grupo não consegue progredir e fica bloqueado porque não consegue garantir maioria ou quórum.

O quórum pode ser perdido quando há múltiplos falhas involuntárias, fazendo com que a maioria dos servidores seja removida abruptamente do grupo. Por exemplo, em um grupo de 5 servidores, se 3 deles se tornarem silenciosos de uma vez, a maioria é comprometida e, portanto, não pode ser alcançado nenhum quórum. De fato, os dois restantes não são capazes de dizer se os outros 3 servidores falharam ou se uma partição de rede isolou esses 2 sozinhos e, portanto, o grupo não pode ser reconfigurado automaticamente.

Por outro lado, se os servidores saem do grupo voluntariamente, eles instruem o grupo a se reconfi gurar. Na prática, isso significa que um servidor que está saindo diz aos outros que está indo embora. Isso significa que outros membros podem reconfi gurar o grupo corretamente, a consistência da adesão é mantida e a maioria é recalculada. Por exemplo, no cenário acima de 5 servidores onde 3 saem de uma vez, se os 3 servidores que estão saindo avisam o grupo que estão indo embora, um a um, então a adesão é capaz de se ajustar de 5 para 2, e ao mesmo tempo, garantindo o quórum enquanto isso acontece.

Nota

A perda de quórum é, por si só, um efeito colateral do mau planejamento. Planeje o tamanho do grupo para o número de falhas esperadas (independentemente de serem consecutivas, ocorrerem todas de uma vez ou sejam esporádicas).

Para um grupo no modo de primário único, o primário pode ter transações que ainda não estão presentes em outros membros no momento da partição da rede. Se você está considerando excluir o primário do novo grupo, esteja ciente de que tais transações podem ser perdidas. Um membro com transações extras não pode se reincorporar ao grupo, e a tentativa resulta em um erro com a mensagem Este membro tem mais transações executadas do que as presentes no grupo. Defina a variável de sistema `group_replication_unreachable_majority_timeout` para os membros do grupo para evitar essa situação.

As seções a seguir explicam o que fazer se o sistema for particionado de tal forma que nenhum quórum seja automaticamente alcançado pelos servidores do grupo.

#### Detectando Partições

A tabela do esquema de desempenho `replication_group_members` apresenta o status de cada servidor na visão atual sob a perspectiva desse servidor. Na maioria das vezes, o sistema não enfrenta partições, e, portanto, a tabela exibe informações consistentes em todos os servidores do grupo. Em outras palavras, o status de cada servidor nesta tabela é acordado por todos na visão atual. No entanto, se houver partição de rede e o quórum for perdido, a tabela exibe o status `UNREACHABLE` para os servidores que não consegue contactar. Essas informações são exportadas pelo detector de falha local integrado na Replicação de Grupo.

**Figura 20.14 Perda de Quórum**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group, which is a stable group. When three of the servers, S3, S4, and S5, fail, the majority is lost and the group can no longer proceed without intervention.](images/gr-majority-lost.png)

Para entender esse tipo de partição de rede, a seção a seguir descreve um cenário em que inicialmente há 5 servidores trabalhando corretamente juntos, e as mudanças que então ocorrem no grupo, uma vez que apenas 2 servidores estão online. O cenário é representado na figura.

Assim, vamos assumir que há um grupo com esses 5 servidores:

* Servidor s1 com identificador de membro `199b2df7-4aaf-11e6-bb16-28b2bd168d07`

* Servidor s2 com identificador de membro `199bb88e-4aaf-11e6-babe-28b2bd168d07`

* Servidor s3 com identificador de membro `1999b9fb-4aaf-11e6-bb54-28b2bd168d07`

* Servidor s4 com identificador do membro `19ab72fc-4aaf-11e6-bb51-28b2bd168d07`

* Servidor s5 com identificador de membro `19b33846-4aaf-11e6-ba81-28b2bd168d07`

Inicialmente, o grupo está funcionando bem e os servidores estão comunicando-se felizmente entre si. Você pode verificar isso ao fazer login no s1 e olhar para a tabela do esquema de desempenho `replication_group_members`. Por exemplo:

```
mysql> SELECT MEMBER_ID,MEMBER_STATE, MEMBER_ROLE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+-------------+
| MEMBER_ID                            | MEMBER_STATE | MEMBER_ROLE |
+--------------------------------------+--------------+-------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | ONLINE       | SECONDARY   |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       | PRIMARY     |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | ONLINE       | SECONDARY   |
+--------------------------------------+--------------+-------------+
```

No entanto, momentos depois, ocorre uma falha catastrófica e os servidores s3, s4 e s5 param inesperadamente. Alguns segundos depois, ao olhar novamente na tabela `replication_group_members` em s1, verifica-se que ela ainda está online, mas vários outros membros não estão. De fato, como visto abaixo, eles são marcados como `UNREACHABLE`. Além disso, o sistema não conseguiu se reconectar para alterar a filiação, porque a maioria foi perdida.

```
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

A tabela mostra que s1 agora está em um grupo que não tem meios de progredir sem intervenção externa, porque a maioria dos servidores é inacessível. Neste caso específico, a lista de membros do grupo precisa ser redefinida para permitir que o sistema prossiga, o que é explicado nesta seção. Alternativamente, você também pode optar por parar a Replicação de Grupo em s1 e s2 (ou parar completamente s1 e s2), descobrir o que aconteceu com s3, s4 e s5 e, em seguida, reiniciar a Replicação de Grupo (ou os servidores).

#### Desbloqueando uma Partição

A replicação em grupo permite que você reconfigure a lista de membros do grupo ao impor uma configuração específica. Por exemplo, no caso acima, onde s1 e s2 são os únicos servidores online, você pode optar por impor uma configuração de membros que consista apenas em s1 e s2. Isso requer a verificação de algumas informações sobre s1 e s2 e, em seguida, o uso da variável `group_replication_force_members`.

**Figura 20.15 Forçando uma nova adesão**

![Three of the servers in a group, S3, S4, and S5, have failed, so the majority is lost and the group can no longer proceed without intervention. With the intervention described in the following text, S1 and S2 are able to form a stable group by themselves.](images/gr-majority-lost-to-stable-group.png)

Suponha que você esteja de volta à situação em que s1 e s2 são os únicos servidores restantes no grupo. Os servidores s3, s4 e s5 saíram do grupo de forma inesperada. Para fazer com que os servidores s1 e s2 continuem, você deseja forçar uma configuração de associação que contenha apenas s1 e s2.

Aviso

Este procedimento utiliza `group_replication_force_members` e deve ser considerado um remédio de último recurso. Deve ser usado com extremo cuidado e apenas para perda excessiva de quórum. Se usado de forma incorreta, pode criar um cenário de cérebro artificialmente dividido ou bloquear o sistema como um todo.

Ao forçar uma nova configuração de membro, certifique-se de que todos os servidores que serão forçados a sair do grupo estão de fato desligados. No cenário descrito acima, se s3, s4 e s5 não forem realmente inacessíveis, mas sim estar online, eles podem ter formado sua própria partição funcional (eles são 3 em 5, portanto, têm a maioria). Nesse caso, forçar uma lista de membros do grupo com s1 e s2 pode criar uma situação de cérebro artificial. Portanto, é importante, antes de forçar uma nova configuração de membro, garantir que os servidores que serão excluídos estejam de fato desligados e, se não estiverem, desligue-os antes de prosseguir.

Aviso

Para um grupo no modo de primário único, o primário pode ter transações que ainda não estão presentes em outros membros no momento da partição da rede. Se você está considerando excluir o primário do novo grupo, esteja ciente de que tais transações podem ser perdidas. Um membro com transações extras não pode se reincorporar ao grupo, e a tentativa resulta em um erro com a mensagem Este membro tem mais transações executadas do que as presentes no grupo. Defina a variável de sistema `group_replication_unreachable_majority_timeout` para os membros do grupo para evitar essa situação.

Lembre-se de que o sistema está bloqueado e a configuração atual é a seguinte (contada pelo detector de falha local em s1):

```
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

A primeira coisa a fazer é verificar qual é o endereço local (identificador de comunicação de grupo) para s1 e s2. Faça login em s1 e s2 e obtenha essas informações da seguinte forma.

```
mysql> SELECT @@group_replication_local_address;
```

Uma vez que você conheça os endereços de comunicação de grupo de s1 (`127.0.0.1:10000`) e s2 (`127.0.0.1:10001`), você pode usar isso em um dos dois servidores para injetar uma nova configuração de membros, substituindo assim a existente que perdeu o quórum. Para fazer isso em s1:

```
mysql> SET GLOBAL group_replication_force_members="127.0.0.1:10000,127.0.0.1:10001";
```

Isso desbloqueia o grupo ao forçar uma configuração diferente. Verifique `replication_group_members` em ambos os s1 e s2 para verificar a filiação ao grupo após essa alteração. Primeiro no s1.

```
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

E depois no s2.

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

Depois de ter usado a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. `group_replication_force_members` deve estar vazio para emitir uma declaração [`START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement")].

### 20.7.9 Monitoramento do uso da memória de replicação do grupo com instrumentação de memória do Schema de desempenho

A partir do MySQL 8.0.30, o [Performance Schema][(performance-schema.html "Chapter 29 MySQL Performance Schema")] fornece instrumentação para monitoramento de desempenho do uso de memória da Replicação de Grupo. Para visualizar a instrumentação de Replicação de Grupo disponível, execute a seguinte consulta:

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'memory/group_rpl/%';
+-------------------------------------------------------------------+---------+
| NAME                                                              | ENABLED |
+-------------------------------------------------------------------+---------+
| memory/group_rpl/write_set_encoded                                | YES     |
| memory/group_rpl/certification_data                               | YES     |
| memory/group_rpl/certification_data_gc                            | YES     |
| memory/group_rpl/certification_info                               | YES     |
| memory/group_rpl/transaction_data                                 | YES     |
| memory/group_rpl/sql_service_command_data                         | YES     |
| memory/group_rpl/mysql_thread_queued_task                         | YES     |
| memory/group_rpl/message_service_queue                            | YES     |
| memory/group_rpl/message_service_received_message                 | YES     |
| memory/group_rpl/group_member_info                                | YES     |
| memory/group_rpl/consistent_members_that_must_prepare_transaction | YES     |
| memory/group_rpl/consistent_transactions                          | YES     |
| memory/group_rpl/consistent_transactions_prepared                 | YES     |
| memory/group_rpl/consistent_transactions_waiting                  | YES     |
| memory/group_rpl/consistent_transactions_delayed_view_change      | YES     |
| memory/group_rpl/GCS_XCom::xcom_cache                             | YES     |
| memory/group_rpl/Gcs_message_data::m_buffer                       | YES     |
+-------------------------------------------------------------------+---------+
```

Para mais informações sobre a instrumentação de memória e eventos do Schema de Desempenho, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

#### Instrumentos de esquema de desempenho Grupo Replicação alocação de memória para Replicação de Grupo.

O `memory/group_rpl/` Instrumento do esquema de desempenho foi atualizado no 8.0.30 para estender o monitoramento do uso de memória da Replicação de grupo. `memory/group_rpl/` contém os seguintes instrumentos:

* `write_set_encoded`: Memória alocada para codificar o conjunto de escrita antes de ser transmitido aos membros do grupo.

* `Gcs_message_data::m_buffer`: Memória alocada para o payload de dados de transação enviado à rede.

* `certification_data`: Memória alocada para a certificação de transações recebidas.

* `certification_data_gc`: Memória alocada para o GTID_EXECUTED enviado por cada membro para coleta de lixo.

* `certification_info`: Memória alocada para armazenamento de informações de certificação, alocada para resolver conflitos entre transações concorrentes.

* `transaction_data`: Memória alocada para transações recebidas em fila para o pipeline do plugin.

* `message_service_received_message`: Memória alocada para receber mensagens do serviço de entrega de mensagens de replicação de grupo.

* `sql_service_command_data`: Memória alocada para processar a fila de comandos de serviço SQL interno.

* `mysql_thread_queued_task`: Memória alocada quando uma tarefa dependente de um thread MySQL é adicionada à fila de processamento.

* `message_service_queue`: Memória alocada para mensagens em fila do serviço de mensagem de entrega de replicação de grupo.

* `GCS_XCom::xcom_cache`: Memória alocada para o XCOM para mensagens e metadados trocados entre membros do grupo como parte do protocolo de consenso.

* `consistent_members_that_must_prepare_transaction`: Memória alocada para manter a lista de membros que preparam a transação para garantias de consistência da transação de Replicação por Grupo.

* `consistent_transactions`: Memória alocada para armazenar a transação e a lista de membros que devem preparar essa transação para garantir a consistência da transação de replicação de grupo.

* `consistent_transactions_prepared`: Memória alocada para armazenar a lista de informações das transações preparadas para as Garantias de Consistência da Replicação do Grupo.

* `consistent_transactions_waiting`: Memória alocada para armazenar informações sobre uma lista de transações, enquanto as transações preparadas anteriores são processadas com consistência de `AFTER` e `BEFORE_AND_AFTER`.

* `consistent_transactions_delayed_view_change`: Memória alocada para armazenar a lista de eventos de alteração de visualização (`view_change_log_event`) atrasada por transações consistentes preparadas à espera de reconhecimento de preparação.

* `group_member_info`: Memória alocada para armazenar as propriedades dos membros do grupo. Propriedades como nome de host, porta, peso do membro e papel, entre outras.

Os seguintes instrumentos do grupo `memory/sql/` também são utilizados para monitorar a memória da replicação em grupo:

* `Log_event`: Memória alocada para codificar os dados da transação no formato de log binário; este é o mesmo formato no qual a Replicação de Grupo transmite os dados.

* `write_set_extraction`: Memória alocada para o conjunto de escrita gerado pela transação antes de ser comprometido.

* `Gtid_set::to_string`: Memória alocada para armazenar a representação em cadeia de um conjunto de GTID.

* `Gtid_set::Interval_chunk`: Memória alocada para armazenar o objeto GTID.

#### 20.7.9.1 Habilitando ou Desabilitando o Instrumento de Replicação de Grupo

Para habilitar todas as ferramentas de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL que você escolheu:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para desabilitar todas as ferramentas de instrumentação de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL que você escolheu:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'NO'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para habilitar todas as ferramentas de Replicação de Grupo na inicialização do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=ON'
```

Para desabilitar toda a instrumentação de Replicação de Grupo na inicialização do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=OFF'
```

Para habilitar ou desabilitar instrumentos individuais nesse grupo, substitua o caractere curinga (%) pelo nome completo do instrumento.

Para mais informações, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho” e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### 20.7.9.2 Consultas de exemplo

Esta seção descreve consultas de amostra usando os instrumentos e eventos para monitorar o uso de memória da Replicação do Grupo. As consultas recuperam dados da tabela `memory_summary_global_by_event_name`.

Os dados de memória podem ser consultados para eventos individuais, por exemplo:

```
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME = 'memory/group_rpl/write_set_encoded'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/write_set_encoded
                 COUNT_ALLOC: 1
                  COUNT_FREE: 0
   SUM_NUMBER_OF_BYTES_ALLOC: 45
    SUM_NUMBER_OF_BYTES_FREE: 0
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 1
             HIGH_COUNT_USED: 1
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 45
   HIGH_NUMBER_OF_BYTES_USED: 45
```

Consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”, para obter mais informações sobre as colunas.

Você também pode definir consultas que somarão vários eventos para fornecer visões gerais de áreas específicas de uso de memória.

Os seguintes exemplos são descritos:

* Memória usada para capturar transações
* Memória usada para transmitir transações
* Memória total usada na replicação em grupo
* Memória usada na certificação
* Memória usada na certificação
* Memória usada no pipeline de replicação
* Memória usada na consistência
* Memória usada no serviço de mensagem de entrega
* Memória usada para transmitir e receber transações

##### Memória usada para capturar transações

A memória alocada para capturar as transações do usuário é a soma dos valores dos eventos `write_set_encoded`, `write_set_extraction` e `Log_event`. Por exemplo:

```
SELECT * FROM (SELECT
                (CASE
                  WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/Log_event'
                  THEN 'memory/group_rpl/memory_gr'
                  ELSE 'memory_gr_rest'
                END) AS EVENT_NAME,
                SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/Log_event'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 127
                  SUM(COUNT_FREE): 117
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 54808
    SUM(SUM_NUMBER_OF_BYTES_FREE): 52051
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 10
             SUM(HIGH_COUNT_USED): 35
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 2757
   SUM(HIGH_NUMBER_OF_BYTES_USED): 15630
```

##### Memória usada para transmitir transações

A memória alocada para transações de transmissão é a soma dos valores dos eventos `Gcs_message_data::m_buffer`, `transaction_data` e `GCS_XCom::xcom_cache`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 84
                  SUM(COUNT_FREE): 31
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1072324
    SUM(SUM_NUMBER_OF_BYTES_FREE): 7149
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 53
             SUM(HIGH_COUNT_USED): 59
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
   SUM(HIGH_NUMBER_OF_BYTES_USED): 1065809
```

##### Memória total usada na replicação em grupo

A alocação de memória para envio e recebimento de transações, certificação e todos os outros processos principais. É calculada por meio da consulta a todos os eventos do grupo `memory/group_rpl/`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                    END) AS EVENT_NAME,
                    SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                    SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                    SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                    SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                    SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                    SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                              WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                              THEN 'memory/group_rpl/memory_gr'
                              ELSE 'memory_gr_rest'
                            END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 190
                 SUM(COUNT_FREE): 127
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1096370
   SUM(SUM_NUMBER_OF_BYTES_FREE): 28675
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 63
            SUM(HIGH_COUNT_USED): 77
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1067695
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1069255
```

##### Memória usada na certificação

A alocação de memória no processo de certificação é a soma dos valores dos eventos `certification_data`, `certification_data_gc` e `certification_info`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                     THEN 'memory/group_rpl/certification'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                            THEN 'memory/group_rpl/certification'
                            ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/certification
                SUM(COUNT_ALLOC): 80
                 SUM(COUNT_FREE): 80
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 9442
   SUM(SUM_NUMBER_OF_BYTES_FREE): 9442
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 0
            SUM(HIGH_COUNT_USED): 66
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 0
  SUM(HIGH_NUMBER_OF_BYTES_USED): 6561
```

##### Memória usada no pipeline de replicação

A alocação de memória do pipeline de replicação é a soma dos valores dos eventos `certification_data` e `transaction_data`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/pipeline'
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                     THEN 'memory/group_rpl/pipeline'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/pipeline'
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/pipeline'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/pipeline
                COUNT_ALLOC: 17
                 COUNT_FREE: 13
  SUM_NUMBER_OF_BYTES_ALLOC: 2483
   SUM_NUMBER_OF_BYTES_FREE: 1668
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 4
            HIGH_COUNT_USED: 4
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 815
  HIGH_NUMBER_OF_BYTES_USED: 815
```

##### Memória usada na consistência

A alocação de memória para garantias de consistência de transação é a soma dos valores dos eventos `consistent_members_that_must_prepare_transaction`, `consistent_transactions`, `consistent_transactions_prepared`, `consistent_transactions_waiting` e `consistent_transactions_delayed_view_change`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                     THEN 'memory/group_rpl/consistency'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                            THEN 'memory/group_rpl/consistency'
                            ELSE 'memory_gr_rest'
                          END)
                ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/consistency
                 COUNT_ALLOC: 16
                  COUNT_FREE: 6
   SUM_NUMBER_OF_BYTES_ALLOC: 1464
    SUM_NUMBER_OF_BYTES_FREE: 528
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 10
             HIGH_COUNT_USED: 11
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 936
   HIGH_NUMBER_OF_BYTES_USED: 1024
```

##### Memória usada no serviço de mensagem de entrega

Nota

Essa instrumentação se aplica apenas aos dados recebidos, não aos dados enviados.

A alocação de memória para o serviço de mensagem de entrega de replicação de grupo é a soma dos valores dos eventos `message_service_received_message` e `message_service_queue`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                     THEN 'memory/group_rpl/message_service'
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                     THEN 'memory/group_rpl/message_service'
                     ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                            THEN 'memory/group_rpl/message_service'
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                            THEN 'memory/group_rpl/message_service'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/message_service
                COUNT_ALLOC: 2
                 COUNT_FREE: 0
  SUM_NUMBER_OF_BYTES_ALLOC: 1048664
   SUM_NUMBER_OF_BYTES_FREE: 0
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 2
            HIGH_COUNT_USED: 2
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1048664
  HIGH_NUMBER_OF_BYTES_USED: 1048664
```

##### Memória usada para transmitir e receber transações

A alocação de memória para as transações de transmissão e recepção para e a partir da rede é a soma dos valores dos eventos `wGcs_message_data::m_buffer` e `GCS_XCom::xcom_cache`. Por exemplo:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                           WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                           THEN 'memory/group_rpl/memory_gr'
                           WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                           THEN 'memory/group_rpl/memory_gr'
                           ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 73
                 SUM(COUNT_FREE): 20
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1070845
   SUM(SUM_NUMBER_OF_BYTES_FREE): 5670
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 53
            SUM(HIGH_COUNT_USED): 56
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1065175
```
