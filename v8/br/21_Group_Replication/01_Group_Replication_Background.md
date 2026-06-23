## 20.1 Contexto da Replicação em Grupo

Esta seção fornece informações de fundo sobre a Replicação do Grupo MySQL.

A maneira mais comum de criar um sistema tolerante a falhas é recorrer à redundância dos componentes, ou seja, o componente pode ser removido e o sistema deve continuar a operar conforme o esperado. Isso cria um conjunto de desafios que elevam a complexidade desses sistemas a um nível completamente diferente. Especificamente, as bases de dados replicadas têm de lidar com o fato de que elas exigem manutenção e administração de vários servidores em vez de apenas um. Além disso, como os servidores estão cooperando juntos para criar o grupo, vários outros problemas clássicos de sistemas distribuídos têm de ser tratados, como a partição de rede ou cenários de cérebro dividido.

Portanto, o desafio final é fundir a lógica do banco de dados e da replicação de dados com a lógica de ter vários servidores coordenados de uma maneira consistente e simples. Em outras palavras, ter vários servidores concordando com o estado do sistema e dos dados em cada mudança que o sistema passa. Isso pode ser resumido em ter servidores chegando a um acordo sobre cada transição de estado do banco de dados, para que todos avancem como um único banco de dados ou, alternativamente, que eventualmente converjam para o mesmo estado. Isso significa que eles precisam operar como uma (máquina de estado) distribuída.

O MySQL Group Replication oferece replicação de máquina de estado distribuída com forte coordenação entre servidores. Os servidores se coordenam automaticamente quando fazem parte do mesmo grupo. O grupo pode operar em modo único de primário com eleição primária automática, onde apenas um servidor aceita atualizações de cada vez. Alternativamente, para usuários mais avançados, o grupo pode ser implantado em modo multi-primário, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente. Esse poder é obtido às custas das aplicações que precisam trabalhar em torno das limitações impostas por tais implantações.

Existe um serviço de associação de grupo integrado que mantém a visão do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visão é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falha detecta isso e notifica o grupo de que a visão foi alterada. Tudo isso é automático.

Para que uma transação seja confirmada, a maioria do grupo precisa concordar com a ordem de uma transação dada na sequência global de transações. Decidir confirmar ou abortar uma transação é feito por cada servidor individualmente, mas todos os servidores tomam a mesma decisão. Se houver uma partição na rede, resultando em uma divisão onde os membros não conseguem chegar a um acordo, então o sistema não progride até que essa questão seja resolvida. Portanto, também há um mecanismo de proteção embutido, automático e de cérebro partido.

Tudo isso é impulsionado pelos protocolos do Sistema de Comunicação de Grupo (GCS) fornecidos. Esses protocolos fornecem um mecanismo de detecção de falha, um serviço de adesão ao grupo e entrega de mensagens seguras e completamente ordenadas. Todas essas propriedades são essenciais para criar um sistema que garante que os dados sejam consistentemente replicados em todo o grupo de servidores. No cerne dessa tecnologia está uma implementação do algoritmo Paxos. Ele atua como o motor de comunicação de grupo.

### 20.1.1 Tecnologias de Replicação

Antes de entrar nos detalhes da Replicação em Grupo do MySQL, esta seção apresenta alguns conceitos básicos e uma visão geral de como as coisas funcionam. Isso fornece algum contexto para ajudar a entender o que é necessário para a Replicação em Grupo e quais são as diferenças entre a Replicação Asíncrona clássica do MySQL e a Replicação em Grupo.

#### 20.1.1.1 Fonte para replicação de réplica

A replicação tradicional do MySQL oferece uma abordagem simples de replicação de fonte. A fonte é a principal, e há uma ou mais réplicas, que são secundárias. A fonte aplica transações, as compromete e, em seguida, são enviadas posteriormente (assim de forma assíncrona) para as réplicas para serem reexecutadas (na replicação baseada em declarações) ou aplicadas (na replicação baseada em linhas). É um sistema sem compartilhamento de nada, onde todos os servidores têm uma cópia completa dos dados por padrão.

**Figura 20.1 Replicação Asíncrona do MySQL**

![A transaction received by the source is executed, written to the binary log, then committed, and a response is sent to the client application. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2 before the commit takes place on the source. On each of the replicas, the transaction is applied, written to the replica's binary log, and committed. The commit on the source and the commits on the replicas are all independent and asynchronous.](images/async-replication-diagram.png)

Há também a replicação semisíncrona, que adiciona uma etapa de sincronização ao protocolo. Isso significa que o primário espera, no momento da aplicação, que o secundário confirme que ele *recebeu* a transação. Somente então o primário retoma a operação de commit.

**Figura 20.2 Replicação semiesincrônica do MySQL**

![A transaction received by the source is executed and written to the binary log. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2. The source then waits for an acknowledgement from the replicas. When both of the replicas have returned the acknowledgement, the source commits the transaction, and a response is sent to the client application. After each replica has returned its acknowledgement, it applies the transaction, writes it to the binary log, and commits it. The commit on the source depends on the acknowledgement from the replicas, but the commits on the replicas are independent from each other and from the commit on the source.](images/semisync-replication-diagram.png)

Nas duas imagens, há um diagrama do protocolo clássico de replicação asíncrona do MySQL (e também de sua variante semiesincrônica). As setas entre as diferentes instâncias representam as mensagens trocadas entre os servidores ou as mensagens trocadas entre os servidores e o aplicativo do cliente.

#### 20.1.1.2 Replicação em grupo

A Replicação em Grupo é uma técnica que pode ser usada para implementar sistemas tolerantes a falhas. Um grupo de replicação é um conjunto de servidores, cada um dos quais possui uma cópia completa dos dados (um esquema de replicação não compartilhado), que interagem entre si através da passagem de mensagens. A camada de comunicação fornece um conjunto de garantias, como entrega de mensagens atômicas e de ordem total. Essas são propriedades muito poderosas que se traduzem em abstrações muito úteis que se pode recorrer para construir soluções de replicação de banco de dados mais avançadas.

O MySQL Group Replication se baseia em tais propriedades e abstrações e implementa um protocolo de replicação de múltiplas fontes em todas as partes. Um grupo de replicação é formado por vários servidores; cada servidor do grupo pode executar transações de forma independente a qualquer momento. As transações de leitura/escrita são confirmadas apenas após terem sido aprovadas pelo grupo. Em outras palavras, para qualquer transação de leitura/escrita, o grupo precisa decidir se a confirma ou não, portanto, a operação de confirmação não é uma decisão unilateral do servidor de origem. As transações de leitura somente não precisam de coordenação dentro do grupo e são confirmadas imediatamente.

Quando uma transação de leitura/escrita está pronta para ser confirmada no servidor de origem, o servidor transmite ativamente os valores de escrita (as linhas que foram alteradas) e o conjunto de escrita correspondente (os identificadores únicos das linhas que foram atualizados). Como a transação é enviada através de uma transmissão atômica, todos os servidores do grupo recebem a transação ou nenhum deles. Se eles a recebem, então todos recebem a transação na mesma ordem em relação às outras transações que foram enviadas anteriormente. Todos os servidores, portanto, recebem o mesmo conjunto de transações na mesma ordem, e um pedido de ordem global é estabelecido para as transações.

No entanto, podem haver conflitos entre transações que são executadas simultaneamente em servidores diferentes. Esses conflitos são detectados ao inspecionar e comparar os conjuntos de escrita de duas transações diferentes e simultâneas, em um processo chamado *certificação*. Durante a certificação, a detecção de conflitos é realizada em nível de linha: se duas transações simultâneas, que foram executadas em servidores diferentes, atualizam a mesma linha, então há um conflito. O procedimento de resolução de conflitos afirma que a transação que foi ordenada primeiro se compromete em todos os servidores, e a transação ordenada em segundo lugar é aborvida, e, portanto, é revertida no servidor de origem e descartada pelos outros servidores do grupo. Por exemplo, se t1 e t2 são executados simultaneamente em locais diferentes, ambos alterando a mesma linha, e t2 é ordenado antes de t1, então t2 vence o conflito e t1 é revertida. Isso é, na verdade, uma regra de primeiro compromisso distribuído. Note que, se duas transações são vinculadas a conflitos com mais frequência do que não, então é uma boa prática iniciá-las no mesmo servidor, onde elas têm a chance de se sincronizar no gerenciador de bloqueio local em vez de serem revertidas como resultado da certificação.

Para a aplicação e externalização das transações certificadas, a Replicação em Grupo permite que os servidores se afastem da ordem acordada das transações, desde que isso não viole a consistência e a validade. A Replicação em Grupo é um sistema de consistência eventual, o que significa que, assim que o tráfego de entrada desacelera ou para, todos os membros do grupo têm o mesmo conteúdo de dados. Enquanto o tráfego está fluindo, as transações podem ser externalizadas em uma ordem ligeiramente diferente, ou externalizadas em alguns membros antes dos outros. Por exemplo, no modo multi-primário, uma transação local pode ser externalizada imediatamente após a certificação, embora uma transação remota que é mais antiga na ordem global ainda não tenha sido aplicada. Isso é permitido quando o processo de certificação estabelece que não há conflito entre as transações. No modo único-primário, no servidor primário, há uma pequena chance de que transações locais concorrentes e não conflitantes possam ser comprometidas e externalizadas em uma ordem diferente da ordem global acordada pela Replicação em Grupo. Nos secundários, que não aceitam escritas de clientes, as transações são sempre comprometidas e externalizadas na ordem acordada.

A figura a seguir descreve o protocolo de replicação em grupo do MySQL e, ao compará-lo com a replicação do MySQL (ou até mesmo a replicação semiesincrônica do MySQL), você pode notar algumas diferenças. Algumas mensagens relacionadas a consenso subjacente e Paxos estão faltando nesta imagem por questões de clareza.

**Figura 20.3 Protocolo de Replicação de Grupo MySQL**

![A transaction received by Source 1 is executed. Source 1 then sends a message to the replication group, consisting of itself, Source 2, and Source 3. When all three members have reached consensus, they certify the transaction. Source 1 then writes the transaction to its binary log, commits it, and sends a response to the client application. Sources 2 and 3 write the transaction to their relay logs, then apply it, write it to the binary log, and commit it.](images/gr-replication-diagram.png)

### 20.1.2 Casos de Uso de Replicação em Grupo

A Replicação em Grupo permite criar sistemas resistentes a falhas com redundância, replicando o estado do sistema em um conjunto de servidores. Mesmo que alguns dos servidores falhem posteriormente, desde que não seja todos ou a maioria, o sistema ainda estará disponível. Dependendo do número de servidores que falham, o grupo pode ter desempenho ou escalabilidade degradada, mas ainda assim estará disponível. As falhas dos servidores são isoladas e independentes. Elas são rastreadas por um serviço de adesão ao grupo que depende de um detector de falha distribuído que é capaz de sinalizar quando qualquer servidor deixa o grupo, seja voluntariamente ou devido a uma parada inesperada. Há um procedimento de recuperação distribuído para garantir que, quando os servidores se juntam ao grupo, eles sejam atualizados automaticamente. Não há necessidade de failover do servidor, e a natureza de atualização de várias fontes em todas as partes garante que até mesmo as atualizações não sejam bloqueadas em caso de falha de um único servidor. Para resumir, a Replicação em Grupo do MySQL garante que o serviço de banco de dados esteja continuamente disponível.

É importante entender que, embora o serviço de banco de dados esteja disponível, no caso de uma saída inesperada do servidor, os clientes conectados a ele devem ser redirecionados ou transferidos para outro servidor. Isso não é algo que a Replicação em Grupo tente resolver. Um conector, um balanceador de carga, um roteador ou alguma forma de middleware são mais adequados para lidar com esse problema. Por exemplo, veja o MySQL Router 8.0.

Para resumir, o MySQL Group Replication oferece um serviço MySQL altamente disponível, altamente elástico e confiável.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

#### Casos de uso de exemplo

Os exemplos a seguir são casos típicos de uso para a Replicação em Grupo.

* *Replicação elástica* - Ambientes que exigem uma infraestrutura de replicação muito fluida, onde o número de servidores precisa crescer ou diminuir dinamicamente e com o menor número possível de efeitos colaterais. Por exemplo, serviços de banco de dados para a nuvem.

* *Fragmentos altamente disponíveis* - A fragmentação é uma abordagem popular para alcançar escalabilidade de escrita. Use a Replicação de Grupo do MySQL para implementar fragmentos altamente disponíveis, onde cada fragmento é mapeado para um grupo de replicação.

* *Alternativa à replicação assíncrona Source-Replica* - Em determinadas situações, usar um único servidor de origem torna-o um único ponto de contenção. Escrever para um grupo inteiro pode se mostrar mais escalável em determinadas circunstâncias.

* Sistemas Autônomos* - Além disso, você pode implementar a Replicação de Grupo MySQL puramente para a automação que está embutida no protocolo de replicação (descrito já neste e nos capítulos anteriores).

### 20.1.3 Modos Multi-Primari e Simples-Primari

A Replicação em Grupo opera no modo único-primário ou no modo multi-primário. O modo do grupo é um ajuste de configuração em todo o grupo, especificado pela variável de sistema `group_replication_single_primary_mode`, que deve ser a mesma em todos os membros. `ON` significa modo único-primário, que é o modo padrão, e `OFF` significa modo multi-primário. Não é possível ter membros do grupo implantados em modos diferentes, por exemplo, um membro configurado no modo multi-primário enquanto outro membro está no modo único-primário.

Você não pode alterar o valor de `group_replication_single_primary_mode` manualmente enquanto a Replicação por Grupo está em execução. No MySQL 8.0.13 e versões posteriores, você pode usar as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para mover um grupo de um modo para outro enquanto a Replicação por Grupo ainda está em execução. Essas funções gerenciam o processo de mudança do modo do grupo e garantem a segurança e a consistência dos seus dados. Em versões anteriores, para alterar o modo do grupo, você deve parar a Replicação por Grupo e alterar o valor de `group_replication_single_primary_mode` em todos os membros. Em seguida, realize um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para implementar a mudança na nova configuração operacional. Você não precisa reiniciar os servidores.

Independentemente do modo implementado, a Replicação em Grupo não gerencia o failover do lado do cliente. Isso deve ser gerenciado por uma estrutura de middleware, como o MySQL Router 8.0, um proxy, um conector ou o próprio aplicativo.

#### 20.1.3.1 Modo de Primariedade Única

No modo de primário único (`group_replication_single_primary_mode=ON`) o grupo tem um único servidor primário que está configurado no modo de leitura/escrita. Todos os outros membros do grupo estão configurados no modo de leitura apenas (com `super_read_only=ON`). O primário tipicamente inicializa todo o grupo. Todos os outros servidores que se juntam ao grupo aprendem sobre o servidor primário e são automaticamente configurados no modo de leitura apenas.

No modo de única primária, o Replicação em grupo exige que apenas um único servidor escreva no grupo, portanto, em comparação com o modo de múltiplas primárias, o controle de consistência pode ser menos rigoroso e as declarações DDL não precisam ser manipuladas com qualquer cuidado extra. A opção `group_replication_enforce_update_everywhere_checks` habilita ou desabilita verificações de consistência rigorosas para um grupo. Ao implantar no modo de única primária ou alterar o grupo para o modo de única primária, essa variável do sistema deve ser definida como `OFF`.

O membro que é designado como servidor primário pode ser alterado das seguintes maneiras:

* Se a principal existente sair do grupo, seja voluntariamente ou de forma inesperada, uma nova principal é eleita automaticamente.

* Você pode designar um membro específico como o novo principal usando a função `group_replication_set_as_primary()`.

* Se você usar a função `group_replication_switch_to_single_primary_mode()` para alterar um grupo que estava em modo multi-primário para executar em modo único-primário, um novo primário é eleito automaticamente, ou você pode designar o novo primário especificando-o com a função.

Essas funções só podem ser usadas quando todos os membros do grupo estão executando o MySQL 8.0.13 ou uma versão posterior.

Quando um novo servidor primário é eleito (automática ou manualmente), ele é automaticamente configurado para leitura/escrita, e os outros membros do grupo permanecem como secundários, e, como tal, apenas de leitura. O diagrama a seguir mostra esse processo:

**Figura 20.4 Nova eleição primária**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. Server S1 is the primary. Write clients are communicating with server S1, and a read client is communicating with server S4. Server S1 then fails, breaking communication with the write clients. Server S2 then takes over as the new primary, and the write clients now communicate with server S2.](images/single-primary-election.png)

Quando uma nova primária é escolhida, ela pode ter um atraso de alterações que foram aplicadas na primária antiga, mas ainda não foram aplicadas na nova. Neste caso, até que a nova primária alcance a primária antiga, as transações de leitura/escrita podem resultar em conflitos e serem revertidas, e as transações somente de leitura podem resultar em leituras desatualizadas. O mecanismo de controle de fluxo de replicação em grupo minimiza a diferença entre membros rápidos e lentos, e, portanto, reduz as chances de isso acontecer se estiver ativado e ajustado corretamente. Para mais informações sobre controle de fluxo, consulte a Seção 20.7.2, “Controle de Fluxo”. Em MySQL 8.0.14 e versões posteriores, você também pode usar a variável de sistema `group_replication_consistency` para definir o nível de consistência de transação do grupo para evitar esse problema. Definir essa variável para `BEFORE_ON_PRIMARY_FAILOVER` (o padrão) ou qualquer nível de consistência mais alto mantém novas transações na primária recém-eleita até que o atraso tenha sido aplicado.

Para obter mais informações sobre a consistência das transações, consulte a Seção 20.5.3, “Garantindo a Consistência das Transações”. Se o controle de fluxo e as garantias de consistência das transações não forem usados para um grupo, é uma boa prática aguardar que o novo primário aplique seu log de relevo relacionado à replicação antes de redirecionar as aplicações do cliente para ele.

##### 20.1.3.1.1 Algoritmo de Eleição Primária

O processo automático de eleição de membros primários envolve cada membro analisando a nova visão do grupo, ordenando os potenciais novos membros primários e escolhendo o membro que se qualifica como o mais adequado. Cada membro toma sua própria decisão localmente, seguindo o algoritmo de eleição primária em sua versão do MySQL Server. Como todos os membros devem chegar à mesma decisão, os membros adaptam seu algoritmo de eleição primária se outros membros do grupo estiverem usando versões mais baixas do MySQL Server, para que tenham o mesmo comportamento que o membro com a versão mais baixa do MySQL Server no grupo.

Os fatores considerados pelos membros ao eleger um primário, em ordem, são os seguintes:

1. O primeiro fator considerado é qual membro ou membros estão executando a versão mais baixa do MySQL Server. Se todos os membros do grupo estiverem executando o MySQL 8.0.17 ou superior, os membros são ordenados primeiro pela versão do patch de sua versão. Se algum membro estiver executando o MySQL 5.7 ou o MySQL 8.0.16 ou anterior, os membros são ordenados primeiro pela versão principal de sua versão, e a versão do patch é ignorada.

2. Se mais de um membro estiver executando a versão mais baixa do MySQL Server, o segundo fator considerado é o peso do membro de cada um desses membros, conforme especificado pela variável de sistema `group_replication_member_weight` no membro. Se qualquer membro do grupo estiver executando o MySQL Server 5.7, onde essa variável de sistema não estiver disponível, esse fator é ignorado.

A variável de sistema `group_replication_member_weight` especifica um número no intervalo de 0 a 100. Todos os membros têm um peso padrão de 50, então, defina um peso abaixo deste para reduzir sua ordem e um peso acima dele para aumentar sua ordem. Você pode usar essa função de ponderação para priorizar o uso de hardware melhor ou para garantir a falha para um membro específico durante a manutenção programada do primário.

3. Se mais de um membro estiver executando a versão mais baixa do servidor MySQL, e mais de um desses membros tiver o peso do membro mais alto (ou o peso do membro está sendo ignorado), o terceiro fator considerado é a ordem lexicográfica dos UUIDs gerados de cada membro, conforme especificado pela variável de sistema `server_uuid`. O membro com o UUID do servidor mais baixo é escolhido como o principal. Este fator atua como um travão de segurança e previsível, de modo que todos os membros do grupo cheguem à mesma decisão, se não puder ser determinado por quaisquer fatores importantes.

##### 20.1.3.1.2 Encontrando o Primário

Para descobrir qual servidor é o principal atualmente quando implementado no modo de único principal, use a coluna `MEMBER_ROLE` na tabela `performance_schema.replication_group_members`. Por exemplo:

```
mysql> SELECT MEMBER_HOST, MEMBER_ROLE FROM performance_schema.replication_group_members;
+-------------------------+-------------+
| MEMBER_HOST             | MEMBER_ROLE |
+-------------------------+-------------+
| remote1.example.com     | PRIMARY     |
| remote2.example.com     | SECONDARY   |
| remote3.example.com     | SECONDARY   |
+-------------------------+-------------+
```

Aviso

A variável de status `group_replication_primary_member` foi descontinuada; espere que ela seja removida em uma versão futura.

Como alternativa, use a variável de status `group_replication_primary_member`, da seguinte forma:

```
mysql> SHOW STATUS LIKE 'group_replication_primary_member'
```

#### 20.1.3.2 Modo Multi-Primari
#### 20.1.3.3 Modo Multi-Secundário
#### 20.1.3.4 Modo Multi-Terciário
#### 20.1.3.5 Modo Multi-Quaternário

No modo multi-primário (`group_replication_single_primary_mode=OFF`) nenhum membro tem um papel especial. Qualquer membro que seja compatível com os outros membros do grupo é configurado para o modo de leitura/escrita ao se juntar ao grupo e pode processar transações de escrita, mesmo que sejam emitidas simultaneamente.

Se um membro parar de aceitar transações de escrita, por exemplo, em caso de uma saída inesperada do servidor, os clientes conectados a ele podem ser redirecionados ou substituídos por qualquer outro membro que esteja no modo de leitura/escrita. A Replicação de Grupo não gerencia o failover do lado do cliente por si só, então você precisa organizar isso usando uma estrutura de middleware, como o MySQL Router 8.0, um proxy, um conector ou o próprio aplicativo. A Figura 20.5, “Failover do Cliente”, mostra como os clientes podem se reconectar a um membro alternativo do grupo se um membro deixar o grupo.

**Figura 20.5 Falha no sobrevoo do cliente**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. All of the servers are primaries. Write clients are communicating with servers S1 and S2, and a read client is communicating with server S4. Server S1 then fails, breaking communication with its write client. This client reconnects to server S3.](images/multi-primary.png)

A Replicação em Grupo é um sistema de consistência eventual. Isso significa que assim que o tráfego recebido desacelera ou para, todos os membros do grupo têm o mesmo conteúdo de dados. Enquanto o tráfego está fluindo, as transações podem ser externalizadas em alguns membros antes dos outros, especialmente se alguns membros tiverem menos throughput de escrita do que outros, criando a possibilidade de leituras desatualizadas. No modo multi-primário, os membros mais lentos também podem acumular um backlog excessivo de transações para certificar e aplicar, o que aumenta o risco de conflitos e falha na certificação. Para limitar esses problemas, você pode ativar e ajustar o mecanismo de controle de fluxo da Replicação em Grupo para minimizar a diferença entre os membros rápidos e lentos. Para mais informações sobre controle de fluxo, consulte a Seção 20.7.2, “Controle de Fluxo”.

No MySQL 8.0.14 e versões posteriores, se você deseja garantir a consistência de transações para cada transação no grupo, pode fazer isso usando a variável de sistema `group_replication_consistency`. Você pode escolher um ajuste que se adeque à carga de trabalho do seu grupo e às suas prioridades para leituras e escritas de dados, levando em consideração o impacto de desempenho da sincronização necessária para aumentar a consistência. Você também pode definir a variável de sistema para sessões individuais para proteger transações particularmente sensíveis à concorrência. Para mais informações sobre consistência de transações, consulte a Seção 20.5.3, “Garantindo Consistência de Transações”.

##### 20.1.3.2.1 Verificação de transações

Quando um grupo é implantado no modo multi-primário, as transações são verificadas para garantir que sejam compatíveis com o modo. As seguintes verificações de consistência rigorosas são feitas quando a Replicação de Grupo é implantada no modo multi-primário:

* Se uma transação for executada com o nível de isolamento SERIALIZABLE, seu commit falha ao se sincronizar com o grupo.

* Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então seu commit falha ao se sincronizar com o grupo.

Os controles são controlados pela variável de sistema `group_replication_enforce_update_everywhere_checks`. No modo multi-primário, a variável de sistema deve ser normalmente definida como `ON`, mas os controles podem ser desativados opcionalmente definindo a variável de sistema como `OFF`. Ao implantar no modo único-primário, a variável de sistema deve ser definida como `OFF`.

##### 20.1.3.2.2 Declarações de definição de dados

Em uma topologia de replicação em grupo no modo multi-primário, é necessário ter cuidado ao executar declarações de definição de dados, também comumente conhecidas como linguagem de definição de dados (DDL).

O MySQL 8.0 introduz suporte para declarações atômicas de Definição de Dados (DDL) onde a declaração completa de DDL é comprometida ou desfeita como uma única transação atômica. As declarações DDL, atômicas ou não, implicitamente encerram qualquer transação ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração. Isso significa que as declarações DDL não podem ser realizadas dentro de outra transação, dentro de declarações de controle de transação como [[`START TRANSACTION ... COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")], ou combinadas com outras declarações dentro da mesma transação.

A Replicação em Grupo é baseada em um paradigma de replicação otimista, onde as declarações são executadas otimisticamente e revertidas posteriormente, se necessário. Cada servidor executa sem garantir o acordo do grupo primeiro. Portanto, é necessário ter mais cuidado ao replicar declarações DDL em modo multi-primário. Se você fizer alterações no esquema (usando DDL) e alterações nos dados que um objeto contém (usando DML) para o mesmo objeto, as alterações precisam ser tratadas através do mesmo servidor enquanto a operação do esquema ainda não foi concluída e replicada em todos os lugares. Não fazer isso pode resultar em inconsistência de dados quando as operações são interrompidas ou apenas parcialmente concluídas. Se o grupo for implantado em modo single-primário, este problema não ocorre, porque todas as alterações são realizadas através do mesmo servidor, o primário.

Para obter mais informações sobre o suporte de DDL atômico no MySQL 8.0 e as mudanças resultantes no comportamento para a replicação de determinadas declarações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

##### 20.1.3.2.3 Compatibilidade da versão

Para compatibilidade e desempenho ótimos, todos os membros de um grupo devem executar a mesma versão do MySQL Server e, portanto, do Grupo de Replicação. No modo multi-primário, isso é mais significativo porque todos os membros normalmente se juntam ao grupo no modo de leitura/escrita. Se um grupo inclui membros que executam mais de uma versão do MySQL Server, há um potencial para alguns membros serem incompatíveis com outros, porque eles suportam funções que outros não têm, ou não têm funções que outros têm. Para se proteger contra isso, quando um novo membro se junta (incluindo um membro antigo que foi atualizado e reiniciado), o membro realiza verificações de compatibilidade contra o resto do grupo.

Um resultado desses verificações de compatibilidade é particularmente importante no modo multi-primário. Se um membro que está participando está executando uma versão do MySQL Server mais alta do que a versão mais baixa que os membros do grupo existentes estão executando, ele se junta ao grupo, mas permanece no modo somente leitura. (Em um grupo que está executando no modo único-primário, novos membros, por padrão, são somente leitura em qualquer caso.) Membros que estão executando o MySQL 8.0.17 ou posterior levam em conta a versão do patch do lançamento ao verificar sua compatibilidade. Membros que estão executando o MySQL 8.0.16 ou anterior, ou MySQL 5.7, levam em conta apenas a versão principal.

Em um grupo que funciona no modo multi-primario com membros que usam diferentes versões do MySQL Server, a Replicação de Grupo gerencia automaticamente seu status de leitura/escrita e apenas leitura. Se um membro sair do grupo, os membros que estão executando a versão que agora é a mais baixa são automaticamente configurados para o modo de leitura/escrita. Quando você altera um grupo que estava executando no modo de único primário para executar no modo multi-primário, usando a função `group_replication_switch_to_multi_primary_mode()`, a Replicação de Grupo configura automaticamente os membros no modo correto. Os membros são automaticamente colocados no modo apenas leitura se estiverem executando uma versão do servidor MySQL mais alta do que a versão mais baixa presente no grupo, e os membros que estão executando a versão mais baixa são colocados no modo leitura/escrita.

Para obter informações completas sobre a compatibilidade das versões em um grupo e como isso influencia o comportamento de um grupo durante um processo de atualização, consulte a Seção 20.8.1, “Combinando diferentes versões de membros em um grupo”.

### 20.1.4 Serviços de Replicação em Grupo

Esta seção apresenta alguns dos serviços que a Replicação em Grupo se baseia.

#### 20.1.4.1 Associação de Grupo

No MySQL Group Replication, um conjunto de servidores forma um grupo de replicação. Um grupo tem um nome, que assume a forma de uma UUID. O grupo é dinâmico e os servidores podem sair (voluntariamente ou involuntariamente) e se juntar a ele a qualquer momento. O grupo se ajusta sempre que servidores se juntam ou saem.

Se um servidor se juntar ao grupo, ele se atualiza automaticamente, obtendo o estado ausente de um servidor existente. Se um servidor sair do grupo, por exemplo, foi desativado para manutenção, os servidores restantes percebem que ele saiu e reconfiguram o grupo automaticamente.

A Replicação em Grupo tem um serviço de membros do grupo que define quais servidores estão online e participando do grupo. A lista de servidores online é referida como uma *visualização*. Cada servidor do grupo tem uma visão consistente de quais servidores estão participando ativamente no grupo em um determinado momento.

Os membros do grupo devem concordar não apenas com os compromissos de transação, mas também sobre qual é a visão atual. Se os membros existentes concordarem que um novo servidor deve fazer parte do grupo, o grupo é reconfigurado para integrar esse servidor, o que desencadeia uma mudança de visão. Se um servidor deixar o grupo, voluntariamente ou não, o grupo rearranja dinamicamente sua configuração e uma mudança de visão é desencadeada.

No caso em que um membro deixa o grupo voluntariamente, ele primeiro inicia uma reconfiguração dinâmica do grupo, durante a qual todos os membros têm que concordar com uma nova visão sem o servidor que está saindo. No entanto, se um membro deixa o grupo involuntariamente, por exemplo, porque parou inesperadamente ou a conexão de rede está fora de serviço, ele não pode iniciar a reconfiguração. Nessa situação, o mecanismo de detecção de falha da Replicação do Grupo reconhece, após um curto período de tempo, que o membro deixou, e é proposta uma reconfiguração do grupo sem o membro falhado. Assim como com um membro que deixa voluntariamente, a reconfiguração requer o acordo da maioria dos servidores do grupo. No entanto, se o grupo não conseguir chegar a um acordo, por exemplo, porque foi particionado de tal forma que não há maioria de servidores online, o sistema não consegue mudar dinamicamente a configuração, e bloqueia para evitar uma situação de cérebro partido. Essa situação requer intervenção de um administrador.

É possível que um membro saia offline por um curto período, tente se reincorporar ao grupo novamente antes que o mecanismo de detecção de falha detecte sua falha e antes que o grupo seja reconfigurado para remover o membro. Nessa situação, o membro que se reincorpora esquece seu estado anterior, mas se outros membros enviarem mensagens destinadas ao seu estado pré-falha, isso pode causar problemas, incluindo possíveis inconsistências de dados. Se um membro nessa situação participa do protocolo de consenso do XCom, isso pode potencialmente fazer com que o XCom forneça diferentes valores para o mesmo ciclo de consenso, tomando uma decisão diferente antes e depois da falha.

Para contrariar essa possibilidade, o MySQL Group Replication verifica a situação em que uma nova encarnação do mesmo servidor está tentando se juntar ao grupo, enquanto sua encarnação antiga (com o mesmo endereço e número de porta) ainda está listada como membro. A nova encarnação é bloqueada de se juntar ao grupo até que a encarnação antiga possa ser removida por uma reconfiguração. Note que, se um período de espera foi adicionado pela variável de sistema `group_replication_member_expel_timeout` para permitir um tempo adicional para os membros se reconectar com o grupo antes de serem expulsos, um membro sob suspeita pode se tornar ativo no grupo novamente como sua encarnação atual se reconectar ao grupo antes que o período de suspeita expire. Quando um membro excede o tempo de expulsa e é expulso do grupo, ou quando a Replicação de Grupo é parada no servidor por uma declaração `STOP GROUP_REPLICATION` ou uma falha no servidor, ele deve se juntar novamente como uma nova encarnação.

#### 20.1.4.2 Detecção de falhas

O mecanismo de detecção de falha da Replicação em grupo é um serviço distribuído que é capaz de identificar que um servidor no grupo não está se comunicando com os outros, e, portanto, é suspeito de estar fora de serviço. Se o consenso do grupo for que a suspeita provavelmente é verdadeira, o grupo toma uma decisão coordenada para expulsar o membro. Expulsar um membro que não está se comunicando é necessário porque o grupo precisa de uma maioria de seus membros concordando com uma transação ou visão de mudança. Se um membro não está participando dessas decisões, o grupo deve removê-lo para aumentar a chance de que o grupo contenha uma maioria de membros que trabalham corretamente, e, portanto, pode continuar a processar transações.

Em um grupo de replicação, cada membro tem um canal de comunicação ponto a ponto com cada outro membro, criando um grafo totalmente conectado. Essas conexões são gerenciadas pelo motor de comunicação do grupo (XCom, uma variante de Paxos) e utilizam soquetes TCP/IP. Um canal é usado para enviar mensagens para o membro e o outro canal é usado para receber mensagens do membro. Se um membro não receber mensagens de outro membro por 5 segundos, ele suspeita que o membro falhou e lista o status desse membro como `UNREACHABLE` em sua própria tabela do Schema de Desempenho `replication_group_members`. Geralmente, dois membros suspeitam um do outro de ter falhado porque cada um não está se comunicando com o outro. É possível, embora menos provável, que o membro A suspeite do membro B de ter falhado, mas o membro B não suspeita do membro A de ter falhado - talvez devido a um problema de roteamento ou firewall. Um membro também pode criar uma suspeita sobre si mesmo. Um membro que está isolado do resto do grupo suspeita que todos os outros falharam.

Se uma suspeita durar mais de 10 segundos, o membro suspeitando tenta propagar sua visão de que o membro suspeito está com defeito aos outros membros do grupo. Um membro suspeitando só faz isso se for um notificador, conforme calculado pelo número do nó XCom interno. Se um membro estiver realmente isolado do resto do grupo, ele pode tentar propagar sua visão, mas isso não terá consequências, pois não consegue garantir um quórum dos outros membros para concordar com isso. Uma suspeita só tem consequências se um membro for um notificador, e sua suspeita durar o tempo suficiente para ser propagada aos outros membros do grupo, e os outros membros concordarem com isso. Nesse caso, o membro suspeito é marcado para expulsão do grupo em uma decisão coordenada, e é expulso após o período de espera definido pela variável de sistema `group_replication_member_expel_timeout` expirar e o mecanismo de expulsão detectar e implementar a expulsão.

Quando a rede é instável e os membros frequentemente perdem e recuperam a conexão uns com os outros em diferentes combinações, teoricamente é possível que um grupo termine marcando todos os seus membros para expulsão, após o que o grupo deixará de existir e terá que ser recriado. Para contrariar essa possibilidade, no MySQL 8.0.20 e versões posteriores, o Sistema de Comunicação de Replicação de Grupo (GCS) do Grupo rastrea os membros do grupo que foram marcados para expulsão e os trata como se estivessem no grupo de membros suspeitos quando decide se há maioria. Isso garante que pelo menos um membro permaneça no grupo e o grupo possa continuar a existir. Quando um membro expulso é realmente removido do grupo, o GCS remove seu registro de ter marcado o membro para expulsão, para que o membro possa se juntar ao grupo novamente, se puder.

Para obter informações sobre as variáveis do sistema de replicação de grupo que você pode configurar para especificar as respostas dos membros do grupo de trabalho em situações de falha, e as ações tomadas pelos membros do grupo que são suspeitos de terem falhado, consulte a Seção 20.7.7, “Respostas à Detecção de Falha e Partição de Rede”.

#### 20.1.4.3 Tolerância a falhas

O MySQL Group Replication se baseia em uma implementação do algoritmo distribuído Paxos para fornecer coordenação distribuída entre servidores. Como tal, ele exige que a maioria dos servidores esteja ativa para alcançar o quórum e, assim, tomar uma decisão. Isso tem impacto direto no número de falhas que o sistema pode tolerar sem comprometer a si mesmo e sua funcionalidade geral. O número de servidores (n) necessário para tolerar `f` falhas é então `n = 2 x f + 1`.

Na prática, isso significa que, para tolerar uma falha, o grupo deve ter três servidores. Assim, se um servidor falhar, ainda há dois servidores para formar uma maioria (dois em três) e permitir que o sistema continue a tomar decisões automaticamente e progredir. No entanto, se um segundo servidor falhar *involuntariamente*, o grupo (com um servidor restante) bloqueia, porque não há maioria para tomar uma decisão.

A tabela a seguir ilustra a fórmula acima.

<table summary="Relationship between replication group size, the number of servers that constitute a majority, and the number of instant failures that can be tolerated."><col style="width: 23%"/><col style="width: 18%"/><col style="width: 59%"/><thead><tr> <th scope="col"><p> Group Size </p></th> <th scope="col"><p> Majority </p></th> <th scope="col"><p> Instant Failures Tolerated </p></th> </tr></thead><tbody><tr> <th scope="row"><p> 1 </p></th> <td><p> 1 </p></td> <td><p> 0 </p></td> </tr><tr> <th scope="row"><p> 2 </p></th> <td><p> 2 </p></td> <td><p> 0 </p></td> </tr><tr> <th scope="row"><p> 3 </p></th> <td><p> 2 </p></td> <td><p> 1 </p></td> </tr><tr> <th scope="row"><p> 4 </p></th> <td><p> 3 </p></td> <td><p> 1 </p></td> </tr><tr> <th scope="row"><p> 5 </p></th> <td><p> 3 </p></td> <td><p> 2 </p></td> </tr><tr> <th scope="row"><p> 6 </p></th> <td><p> 4 </p></td> <td><p> 2 </p></td> </tr><tr> <th scope="row"><p> 7 </p></th> <td><p> 4 </p></td> <td><p> 3 </p></td> </tr></tbody></table>

#### 20.1.4.4 Observabilidade

Há uma grande quantidade de automação embutida no plugin de Replicação de Grupo. No entanto, às vezes você pode precisar entender o que está acontecendo nos bastidores. É aí que a instrumentação da Replicação de Grupo e do Schema de Desempenho se torna importante. Todo o estado do sistema (incluindo a visão, estatísticas de conflitos e estados dos serviços) pode ser consultado através das tabelas do Schema de Desempenho. A natureza distribuída do protocolo de replicação e o fato de que as instâncias do servidor concordam e, portanto, sincronizam em transações e metadados tornam mais simples inspecionar o estado do grupo. Por exemplo, você pode se conectar a um único servidor no grupo e obter informações locais e globais ao emitir declarações select nas tabelas relacionadas ao Schema de Desempenho de Replicação de Grupo. Para mais informações, consulte a Seção 20.4, “Monitoramento da Replicação de Grupo”.

### 20.1.5 Arquitetura do Plugin de Replicação em Grupo

O MySQL Group Replication é um plugin do MySQL e se baseia na infraestrutura de replicação existente do MySQL, aproveitando recursos como o log binário, o registro baseado em linhas e os identificadores de transação global. Ele se integra a frameworks MySQL atuais, como o esquema de desempenho ou infraestruturas de plugins e serviços. A figura a seguir apresenta um diagrama de bloco que ilustra a arquitetura geral do MySQL Group Replication.

**Figura 20.6 Diagrama de bloco do plugin de replicação de grupo**

![The text following the figure describes the content of the diagram.](images/gr-plugin-blocks.png)

O plugin de replicação em grupo do MySQL inclui um conjunto de APIs para captura, aplicação e ciclo de vida, que controlam como o plugin interage com o MySQL Server. Existem interfaces para fazer o fluxo de informações do servidor para o plugin e vice-versa. Essas interfaces isolam o núcleo do MySQL Server do plugin de replicação em grupo e são, na maioria, pontos de conexão colocados na linha de execução da transação. Numa direção, do servidor para o plugin, há notificações para eventos como o servidor iniciando, o servidor recuperando, o servidor estando pronto para aceitar conexões e o servidor prestes a comprometer uma transação. Na outra direção, o plugin instrui o servidor a realizar ações como comprometer ou abortar transações em andamento ou agrupar transações no log de retransmissão.

A próxima camada da arquitetura do plugin de replicação de grupo é um conjunto de componentes que reagem quando uma notificação é encaminhada para eles. O componente de captura é responsável por manter o controle do contexto relacionado às transações que estão sendo executadas. O componente aplicável é responsável por executar transações remotas no banco de dados. O componente de recuperação gerencia a recuperação distribuída e é responsável por obter um servidor que está se juntando ao grupo atualizado, selecionando o doador, gerenciando o procedimento de recuperação e reagindo a falhas do doador.

Continuando na pilha, o módulo do protocolo de replicação contém a lógica específica do protocolo de replicação. Ele lida com a detecção de conflitos e recebe e propaga transações para o grupo.

As duas últimas camadas da arquitetura do plugin de replicação de grupo são o Sistema de Comunicação de Grupo (GCS) API e uma implementação de um motor de comunicação de grupo baseado em Paxos (XCom). A API GCS é uma API de alto nível que abstrai as propriedades necessárias para construir uma máquina de estado replicada (ver Seção 20.1, “Contexto da Replicação de Grupo”). Portanto, ela desvincula a implementação da camada de mensagens das camadas superiores restantes do plugin. O motor de comunicação de grupo lida com comunicações com os membros do grupo de replicação.