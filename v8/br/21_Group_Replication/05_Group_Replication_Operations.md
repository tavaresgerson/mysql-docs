## 20.5 Operações de Replicação em Grupo

Esta seção explica as operações comuns para gerenciar grupos.

### 20.5.1 Configurando um Grupo Online

Você pode configurar um grupo online enquanto a Replicação de grupo está em execução, usando um conjunto de funções, que dependem de um coordenador de ação de grupo. Essas funções são instaladas pelo plugin de Replicação de grupo na versão 8.0.13 e superior. Esta seção descreve como as alterações são feitas em um grupo em execução e as funções disponíveis.

Importante

Para que o coordenador possa configurar ações em grupo em um grupo em execução, todos os membros devem estar executando o MySQL 8.0.13 ou superior e ter as funções instaladas.

Para usar as funções, conecte-se a um membro do grupo em execução e invoque a função com a declaração `SELECT`. O plugin de Replicação de Grupo processa a ação e seus parâmetros e o coordenador envia-a para todos os membros que são visíveis para o membro onde você invocou a função. Se a ação for aceita, todos os membros executam a ação e enviam uma mensagem de término quando concluída. Uma vez que todos os membros declaram a ação como concluída, o membro que está invocando retorna o resultado ao cliente.

Ao configurar um grupo inteiro, a natureza distribuída das operações significa que elas interagem com muitos processos do plugin de replicação de grupo, e, portanto, você deve observar o seguinte:

**Você pode emitir operações de configuração em qualquer lugar.** Se você quiser tornar o membro A o novo primário, não precisa invocar a operação no membro A. Todas as operações são enviadas e executadas de maneira coordenada em todos os membros do grupo. Além disso, essa execução distribuída de uma operação tem uma ramificação diferente: se o membro que está invocando morrer, qualquer processo de configuração já em execução continua a ser executado em outros membros. No improvável caso de que o membro que está invocando morra, você ainda pode usar as funcionalidades de monitoramento para garantir que outros membros completem a operação com sucesso.

**Todos os membros devem estar online.** Para simplificar os processos de migração ou eleição e garantir que sejam o mais rápidos possível, o grupo não deve conter nenhum membro que esteja atualmente no processo de recuperação distribuída, caso contrário, a ação de configuração é rejeitada pelo membro onde você emite a declaração.

**Nenhum membro pode se juntar a um grupo durante uma alteração de configuração.** Qualquer membro que tente se juntar ao grupo durante uma alteração coordenada de configuração deixa o grupo e cancela seu processo de adesão.

**Apenas uma configuração de cada vez.** Um grupo que está executando uma mudança de configuração não pode aceitar nenhuma outra mudança de configuração do grupo, porque operações de configuração concorrentes podem levar à divergência dos membros.

**Todos os membros devem estar executando o MySQL 8.0.13 ou superior.** Devido à natureza distribuída das ações de configuração, todos os membros devem reconhecê-las para executá-las. Portanto, a operação é rejeitada se qualquer servidor executando a versão do MySQL Server 8.0.12 ou inferior estiver presente no grupo.

#### 20.5.1.1 Mudando o Primário

Esta seção explica como alterar qual membro de um grupo de único primário é o primário, usando a função `group_replication_set_as_primary()`, que pode ser executada em qualquer membro do grupo. Quando isso é feito, o primário atual se torna um secundário somente de leitura e o membro do grupo especificado se torna o primário de leitura e escrita; isso substitui o processo usual de eleição de primário, conforme descrito na Seção 20.1.3.1, "Modo de Primogênito Único".

Se um canal padrão de replicação de fonte para réplica estiver em execução no membro primário existente, além dos canais de replicação de grupo, você deve parar esse canal de replicação antes de poder alterar o membro primário. Você pode identificar o primário atual usando a coluna `MEMBER_ROLE` na tabela do Schema de desempenho `replication_group_members`, ou a variável de status `group_replication_primary_member`.

Se todos os membros não estiverem executando a mesma versão do MySQL Server, você pode especificar um novo membro principal que esteja executando a versão mais baixa do MySQL Server apenas no grupo. Esta proteção é aplicada para garantir que o grupo mantenha compatibilidade com novas funções. Isso é recomendado para todas as versões do MySQL e é exigido a partir do MySQL 8.0.17.

Quaisquer transações não comprometidas que o grupo está esperando devem ser comprometidas, revertidas ou terminadas antes que a operação possa ser concluída. Antes do MySQL 8.0.29, a função espera que todas as transações ativas no primário existente terminem, incluindo as transações recebidas que são iniciadas após o uso da função. A partir do MySQL 8.0.29, você pode especificar um tempo limite de 1 a 3600 segundos (60 minutos) para as transações que estão em execução quando você usa a função. Para que o tempo limite funcione, todos os membros do grupo devem estar no MySQL 8.0.29 ou superior. Especifique 0 para sem tempo limite (ou não especifique um valor de tempo limite), no caso em que o grupo espera indefinidamente. Se você não definir o tempo limite, não há limite superior para o tempo de espera, e novas transações podem começar durante esse tempo.

Quando o tempo de espera expira, para quaisquer transações que ainda não atingiram sua fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram sua fase de commit são permitidas para serem concluídas. Ao definir um tempo de espera, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo de espera, desconexão e bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função está em operação, declarações únicas que não modifiquem dados, conforme listado em Permitidas Perguntas Sob as Regras de Consistência, são permitidas para prosseguir.

Passe no `server_uuid` do membro que deseja tornar-se o novo principal do grupo, emitindo a seguinte declaração:

```
SELECT group_replication_set_as_primary(member_uuid);
```

Em MySQL 8.0.29 e versões posteriores, você pode adicionar um tempo de espera, conforme mostrado aqui:

```
SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300)
```

Para verificar o status do tempo de espera, use a coluna `PROCESSLIST_INFO` na tabela do Gerador de Desempenho `threads`, da seguinte forma:

```
mysql> SELECT NAME, PROCESSLIST_INFO FROM performance_schema.threads
    -> WHERE NAME="thread/group_rpl/THD_transaction_monitor"\G
*************************** 1. row ***************************
            NAME: thread/group_rpl/THD_transaction_monitor
PROCESSLIST_INFO: Group replication transaction monitor: Stopped client connections
```

O status mostra quando o fio de monitoramento de transações foi criado, quando novas transações foram interrompidas, quando as conexões do cliente com transações não comprometidas foram desconectadas e, finalmente, quando o processo está completo e novas transações são permitidas novamente.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo a declaração mostrada aqui:

```
mysql> SELECT event_name, work_completed, work_estimated
    -> FROM performance_schema.events_stages_current
    -> WHERE event_name LIKE "%stage/group_rpl%"\G
*************************** 1. row ***************************
    EVENT_NAME: stage/group_rpl/Primary Election: Waiting for members to turn on super_read_only
WORK_COMPLETED: 3
WORK_ESTIMATED: 5
```

#### 20.5.1.2 Mudando o Modo de Grupo

Esta seção explica como alterar o modo em que um grupo está sendo executado, seja em modo único ou multi-primário. As funções usadas para alterar o modo de um grupo podem ser executadas por qualquer membro.

##### Mudando para Modo de Primari único

Utilize a função `group_replication_switch_to_single_primary_mode()` para alterar um grupo que está em modo multi-primário para modo único-primário, emitindo:

```
SELECT group_replication_switch_to_single_primary_mode()
```

Quando você muda para o modo de único primário, os rigorosos controles de consistência também são desativados em todos os membros do grupo, conforme exigido no modo de único primário (`group_replication_enforce_update_everywhere_checks=OFF`).

Se não for passada nenhuma string, a eleição do novo primário no grupo resultante de único primário segue as políticas de eleição descritas na Seção 20.1.3.1, "Modo de único primário". Para ignorar o processo de eleição e configurar um membro específico do grupo multi-primário como o novo primário no processo, obtenha o `server_uuid` do membro e passe-o para `group_replication_switch_to_single_primary_mode()`. Por exemplo, emita:

```
SELECT group_replication_switch_to_single_primary_mode(member_uuid);
```

Se você invocar a função em um membro que está executando uma versão do MySQL Server da versão 8.0.17, e todos os membros estão executando a versão do MySQL Server 8.0.17 ou superior, você só pode especificar um novo membro primário que está executando a versão mais baixa do MySQL Server no grupo, com base na versão do patch. Esta proteção é aplicada para garantir que o grupo mantenha compatibilidade com novas funções. Se você não especificar um novo membro primário, o processo de eleição considera a versão do patch dos membros do grupo.

Se algum membro estiver executando uma versão do MySQL Server entre MySQL 8.0.13 e MySQL 8.0.16, essa proteção não é aplicada ao grupo e você pode especificar qualquer novo membro primário, mas é recomendável selecionar um primário que esteja executando a versão mais baixa do MySQL Server no grupo. Se você não especificar um novo membro primário, o processo de eleição considera apenas a versão principal dos membros do grupo.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo:

```
SELECT event_name, work_completed, work_estimated FROM performance_schema.events_stages_current WHERE event_name LIKE "%stage/group_rpl%";
+----------------------------------------------------------------------------+----------------+----------------+
| event_name                                                                 | work_completed | work_estimated |
+----------------------------------------------------------------------------+----------------+----------------+
| stage/group_rpl/Primary Switch: waiting for pending transactions to finish |              4 |             20 |
+----------------------------------------------------------------------------+----------------+----------------+
```

##### Mudando para o Modo Multi-Primaria

Utilize a função `group_replication_switch_to_multi_primary_mode()` para alterar um grupo que está em modo de única primária para modo de múltiplas primárias, emitindo:

```
SELECT group_replication_switch_to_multi_primary_mode()
```

Após algumas operações coordenadas do grupo para garantir a segurança e a consistência dos seus dados, todos os membros que pertencem ao grupo se tornam primárias.

Quando você muda um grupo que estava executando no modo de única primária para executar no modo de múltiplas primárias, os membros que estão executando o MySQL 8.0.17 ou superior são colocados automaticamente no modo de leitura somente se estiverem executando uma versão do servidor MySQL superior à versão mais baixa presente no grupo. Os membros que estão executando o MySQL 8.0.16 ou inferior não realizam essa verificação e são sempre colocados no modo de leitura e escrita.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo:

```
SELECT event_name, work_completed, work_estimated FROM performance_schema.events_stages_current WHERE event_name LIKE "%stage/group_rpl%";
+----------------------------------------------------------------------+----------------+----------------+
| event_name                                                           | work_completed | work_estimated |
+----------------------------------------------------------------------+----------------+----------------+
| stage/group_rpl/Multi-primary Switch: applying buffered transactions |              0 |              1 |
+----------------------------------------------------------------------+----------------+----------------+
```

#### 20.5.1.3 Usando o Consenso de Escrita de Grupo de Replicação de Grupo

Esta seção explica como inspecionar e configurar o número máximo de instâncias de consenso em qualquer momento para um grupo. Esse máximo é referido como o horizonte de eventos para um grupo e é o número máximo de instâncias de consenso que o grupo pode executar em paralelo. Isso permite que você ajuste o desempenho da sua implantação de Replicação de Grupo. Por exemplo, o valor padrão de 10 é adequado para um grupo que funciona em uma LAN, mas para grupos que operam em uma rede mais lenta, como uma WAN, aumente esse número para melhorar o desempenho.

##### Inspeção da Concorrência de Escrita de um Grupo

Utilize a função `group_replication_get_write_concurrency()` para inspecionar o valor do horizonte de eventos de um grupo em tempo de execução, emitindo:

```
SELECT group_replication_get_write_concurrency();
```

##### Configurando a Concorrência de Escrita de um Grupo

Utilize a função `group_replication_set_write_concurrency()` para definir o número máximo de instâncias de consenso que o sistema pode executar em paralelo, emitindo:

```
SELECT group_replication_set_write_concurrency(instances);
```

onde *`instances`* é o novo número máximo de instâncias de consenso. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função.

#### 20.5.1.4 Configuração da versão do protocolo de comunicação de um grupo

A partir do MySQL 8.0.16, a Replicação de Grupo tem o conceito de um protocolo de comunicação para o grupo. A versão do protocolo de comunicação de Replicação de Grupo pode ser gerenciada explicitamente e definida para acomodar a versão mais antiga do servidor MySQL que o grupo deve suportar. Isso permite que grupos sejam formados a partir de membros em diferentes versões do servidor MySQL, garantindo compatibilidade reversa.

* As versões do MySQL 5.7.14 permitem a compressão de mensagens (consulte a Seção 20.7.4, “Compressão de Mensagens”).

* As versões do MySQL 8.0.16 também permitem fragmentação de mensagens (consulte a Seção 20.7.5, “Fragmentação de Mensagens”).

* As versões do MySQL 8.0.27 também permitem que o motor de comunicação de grupo opere com um único líder de consenso quando o grupo está no modo de único primário e `group_replication_paxos_single_leader` está definido como verdadeiro (consulte a Seção 20.7.3, “Líder de Consenso Único”).

Todos os membros do grupo devem usar a mesma versão do protocolo de comunicação, para que os membros do grupo possam estar em diferentes versões do servidor MySQL, mas apenas enviar mensagens que possam ser compreendidas por todos os membros do grupo.

Um servidor MySQL na versão X só pode se juntar e alcançar o status `ONLINE` em um grupo de replicação se a versão do protocolo de comunicação do grupo for menor ou igual a X. Quando um novo membro se junta a um grupo de replicação, ele verifica a versão do protocolo de comunicação anunciada pelos membros existentes do grupo. Se o membro que está se juntando suporta essa versão, ele se junta ao grupo e usa o protocolo de comunicação que o grupo anunciou, mesmo que o membro suporte capacidades de comunicação adicionais. Se o membro que está se juntando não suporta a versão do protocolo de comunicação, ele é expulso do grupo.

Se dois membros tentarem participar no mesmo evento de mudança de associação, eles só poderão participar se a versão do protocolo de comunicação para ambos os membros já for compatível com a versão do protocolo de comunicação do grupo. Os membros com versões diferentes do protocolo de comunicação do grupo devem se juntar isoladamente. Por exemplo:

* Uma instância do MySQL Server 8.0.16 pode se juntar com sucesso a um grupo que utiliza a versão do protocolo de comunicação 5.7.24.

* Uma instância do MySQL Server 5.7.24 não pode se juntar com sucesso a um grupo que utiliza a versão do protocolo de comunicação 8.0.16.

* Duas instâncias do MySQL Server 8.0.16 não podem se juntar simultaneamente a um grupo que usa a versão do protocolo de comunicação 5.7.24.

* Duas instâncias do MySQL Server 8.0.16 podem se juntar simultaneamente a um grupo que utiliza a versão do protocolo de comunicação 8.0.16.

Você pode inspecionar o protocolo de comunicação utilizado por um grupo usando a função `group_replication_get_communication_protocol()`, que retorna a versão mais antiga do servidor MySQL que o grupo suporta. Todos os membros existentes do grupo retornam a mesma versão do protocolo de comunicação. Por exemplo:

```
SELECT group_replication_get_communication_protocol();
+------------------------------------------------+
| group_replication_get_communication_protocol() |
+------------------------------------------------+
| 8.0.16                                         |
+------------------------------------------------+
```

Observe que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, que pode diferir do número de versão que foi passado para a função `group_replication_set_communication_protocol()` e da versão do MySQL Server que está instalada no membro onde você usa a função.

Se você precisar alterar a versão do protocolo de comunicação de um grupo para que os membros de versões anteriores possam se juntar, use a função `group_replication_set_communication_protocol()` para especificar a versão do servidor MySQL do membro mais antigo que você deseja permitir. Isso faz com que o grupo volte a uma versão compatível do protocolo de comunicação, se possível. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função, e todos os membros existentes do grupo devem estar online quando você emitir a declaração, sem perda da maioria. Por exemplo:

```
SELECT group_replication_set_communication_protocol("5.7.25");
```

Se você atualizar todos os membros de um grupo de replicação para uma nova versão do MySQL Server, a versão do protocolo de comunicação do grupo não será automaticamente atualizada para corresponder. Se você não precisar mais suportar membros em versões anteriores, você pode usar a função `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação para a nova versão do MySQL Server para a qual você atualizou os membros. Por exemplo:

```
SELECT group_replication_set_communication_protocol("8.0.16");
```

A função `group_replication_set_communication_protocol()` é implementada como uma ação de grupo, portanto, é executada ao mesmo tempo em todos os membros do grupo. A ação de grupo começa a bufferizar mensagens e aguarda a entrega de quaisquer mensagens de saída que já estavam em andamento para serem concluídas, e então altera a versão do protocolo de comunicação e envia as mensagens bufferizadas. Se um membro tentar se juntar ao grupo em qualquer momento após você alterar a versão do protocolo de comunicação, os membros do grupo anunciam a nova versão do protocolo.

O clúster MySQL InnoDB gerencia automaticamente e de forma transparente as versões dos protocolos de comunicação de seus membros, sempre que a topologia do clúster é alterada usando operações da AdminAPI. Um clúster InnoDB sempre usa a versão mais recente do protocolo de comunicação que é suportada por todas as instâncias que fazem parte do clúster ou que estão se juntando a ele. Para obter detalhes, consulte Clúster InnoDB e Protocolo de Replicação de Grupo.

#### 20.5.1.5 Configurando ações de membros

A partir do MySQL 8.0.26, a Replicação por Grupo tem a capacidade de definir ações que os membros de um grupo devem realizar em situações específicas. As ações dos membros podem ser habilitadas e desabilitadas individualmente usando funções. A configuração das ações dos membros de um servidor também pode ser redefinida para o padrão após ele ter deixado o grupo.

Os administradores (com o privilégio `GROUP_REPLICATION_ADMIN`) podem configurar uma ação de membro no primário do grupo usando a função `group_replication_enable_member_action` ou `group_replication_disable_member_action`. A configuração das ações de membro, que consiste em todas as ações de membro e se elas estão habilitadas ou desabilitadas, é então propagada para outros membros do grupo e membros que se juntam usando as mensagens de grupo da Replicação de Grupo. Portanto, todos os membros do grupo têm a mesma configuração de ações de membro. Você também pode configurar ações de membro em um servidor que não faz parte de um grupo, desde que o plugin de Replicação de Grupo esteja instalado. Nesse caso, a configuração das ações de membro não é propagada para nenhum outro servidor.

Se o servidor onde você usa as funções para configurar uma ação de membro faz parte de um grupo, ele deve ser o primário atual em um grupo no modo de único primário e deve fazer parte da maioria. A alteração de configuração é rastreada internamente pela Replicação de Grupo, mas não recebe um GTID e não é escrita no log binário, portanto, não é propagada para nenhum servidor externo ao grupo, como réplicas subsequentes. A Replicação de Grupo incrementa o número de versão para a configuração de suas ações de membro cada vez que uma ação de membro é habilitada ou desabilitada.

A configuração das ações dos membros é propagada aos membros da seguinte forma:

* Ao iniciar um grupo, a configuração das ações dos membros do servidor que inicializa o grupo se torna a configuração do grupo.

* Se a versão mais baixa do servidor MySQL de um grupo suportar ações de membros, os membros que se juntam recebem a configuração das ações de membros do grupo durante o processo de troca de estado que ocorre quando eles se juntam. Nesse caso, o membro que se junta substitui sua própria configuração de ações de membros pela do grupo.

* Se um membro associado que suporta ações de membro se juntar a um grupo onde a versão mais baixa do MySQL Server não suporta ações de membro, ele não receberá uma configuração de ações de membro ao se juntar. Nesse caso, o membro associado redefinirá sua própria configuração para o padrão.

Um membro que não suporte ações de membro não pode se juntar a um grupo que tenha uma configuração de ações de membro, porque sua versão do MySQL Server é menor que a versão mais baixa que os membros do grupo existentes estão executando.

A tabela do Schema de desempenho `replication_group_member_actions` lista as ações do membro que estão disponíveis na configuração, os eventos que as desencadeiam e se elas estão ou não habilitadas atualmente. As ações do membro têm uma prioridade de 1 a 100, com valores menores sendo executados primeiro. Se ocorrer um erro quando a ação do membro está sendo realizada, o fracasso da ação do membro pode ser registrado, mas de outra forma ignorado. Se o fracasso da ação do membro for considerado crítico, ele pode ser tratado de acordo com a política especificada pela variável de sistema `group_replication_exit_state_action`.

A tabela `mysql.replication_group_configuration_version`, que pode ser visualizada usando a tabela do Gerenciamento de Desempenho `replication_group_configuration_version`, registra a versão atual da configuração das ações do membro. Sempre que uma ação do membro é habilitada ou desabilitada usando as funções, o número da versão é incrementado.

A função `group_replication_reset_member_actions` só pode ser usada em um servidor que não faça parte de um grupo. Ela redefre o número de versão da configuração de ações do membro para o valor padrão e redefre seu número de versão para 1. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de Replicação de Grupo instalado. Você pode usar essa função para remover a configuração de ações do membro que um servidor usava quando fazia parte de um grupo, se você pretende usá-lo como um servidor autônomo sem ações do membro ou com ações do membro diferentes.

Ação do membro: `mysql_disable_super_read_only_if_primary`

A ação de membro `mysql_disable_super_read_only_if_primary` pode ser configurada para fazer com que um grupo no modo de primário único permaneça no modo de leitura super-somente quando um novo primário é eleito, de modo que o grupo só aceite transações replicadas e não aceite quaisquer escritas diretas dos clientes. Essa configuração significa que, quando o propósito de um grupo é fornecer um backup secundário para outro grupo para tolerância a desastres, você pode garantir que o grupo secundário permaneça sincronizado com o primeiro.

Por padrão, o modo super-somente-leitura é desativado no primário quando ele é eleito, de modo que o primário se torne de leitura e escrita, e aceite atualizações de um servidor de fonte de replicação e de clientes. Esta é a situação quando a ação do membro `mysql_disable_super_read_only_if_primary` é habilitada, que é sua configuração padrão. Se você definir a ação como desativada usando a função `group_replication_disable_member_action`, o primário permanece no modo super-somente-leitura após a eleição. Neste estado, ele não aceita atualizações de quaisquer clientes, mesmo usuários que possuem o privilégio `CONNECTION_ADMIN` ou `SUPER`. Ele continua a aceitar atualizações realizadas por threads de replicação.

### 20.5.2 Reiniciar um grupo

A Replicação em Grupo é projetada para garantir que o serviço de banco de dados esteja continuamente disponível, mesmo que alguns dos servidores que formam o grupo não estejam atualmente em condições de participar, devido a manutenção planejada ou problemas não planejados. Enquanto os membros restantes representarem a maioria do grupo, eles podem eleger um novo primário e continuar a funcionar como um grupo. No entanto, se todos os membros de um grupo de replicação deixarem o grupo e a Replicação em Grupo for interrompida em todos os membros por uma declaração `STOP GROUP_REPLICATION` ou desligamento do sistema, o grupo agora existe apenas teoricamente, como uma configuração nos membros. Nessa situação, para recriar o grupo, ele deve ser iniciado como se estivesse sendo iniciado pela primeira vez.

A diferença entre iniciar um grupo pela primeira vez e fazer isso pela segunda ou em momentos subsequentes é que, na última situação, os membros de um grupo que foi encerrado podem ter conjuntos de transações diferentes uns dos outros, dependendo da ordem em que foram interrompidos ou falharam. Um membro não pode se juntar a um grupo se tiver transações que não estão presentes nos outros membros do grupo. Para a Replicação de Grupo, isso inclui tanto as transações que foram comprometidas e aplicadas, que estão no conjunto de GTID `gtid_executed`, quanto as transações que foram certificadas, mas ainda não aplicadas, que estão no canal `group_replication_applier`. O ponto exato em que uma transação é comprometida depende do nível de consistência da transação que é definido para o grupo (ver Seção 20.5.3, “Garantindo Consistência de Transações”). No entanto, um membro de um grupo de Replicação de Grupo nunca remove uma transação que foi certificada, o que é uma declaração da intenção do membro de comprometer a transação.

O grupo de replicação deve, portanto, ser reiniciado a partir do membro mais atualizado, ou seja, do membro que tem mais transações executadas e certificadas. Os membros com menos transações podem então se juntar e recuperar as transações que estão faltando por meio de recuperação distribuída. Não é correto assumir que o último membro primário conhecido do grupo é o membro mais atualizado do grupo, porque um membro que foi desligado mais tarde que o primário pode ter mais transações. Portanto, você deve reiniciar cada membro para verificar as transações, comparar todos os conjuntos de transações e identificar o membro mais atualizado. Esse membro pode então ser usado para iniciar o grupo.

Siga este procedimento para reiniciar um grupo de replicação com segurança após cada membro ser desligado.

1. Por vez, para cada membro do grupo, em qualquer ordem:

1. Conecte um cliente ao membro do grupo. Se a Replicação de grupo ainda não tiver sido interrompida, emita uma declaração `STOP GROUP_REPLICATION` (stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") e espere a interrupção da Replicação de grupo.

2. Editar o arquivo de configuração do servidor MySQL (tipicamente denominado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows) e definir a variável de sistema `group_replication_start_on_boot=OFF`. Esta configuração impede que a Replicação de Grupo seja iniciada quando o servidor MySQL é iniciado, o que é o padrão.

Se você não puder alterar essa configuração no sistema, pode simplesmente permitir que o servidor tente iniciar a Replicação de Grupo, que falhará porque o grupo foi totalmente desligado e ainda não foi iniciado. Se você adotar essa abordagem, não defina `group_replication_bootstrap_group=ON` em nenhum servidor nesta fase.

3. Inicie a instância do servidor MySQL e verifique se a Replicação de Grupo não foi iniciada (ou se não conseguiu iniciar). Não inicie a Replicação de Grupo nesta etapa.

4. Coleta as seguintes informações do membro do grupo:

* O conteúdo do conjunto de GTID `gtid_executed`. Você pode obtê-lo emitindo a seguinte declaração:

        ```
        mysql> SELECT @@GLOBAL.GTID_EXECUTED
        ```

* O conjunto de transações certificadas no canal `group_replication_applier`. Você pode obtê-lo emitindo a seguinte declaração:

        ```
        mysql> SELECT received_transaction_set FROM \
                performance_schema.replication_connection_status WHERE \
                channel_name="group_replication_applier";
        ```

2. Quando você tiver coletado os conjuntos de transações de todos os membros do grupo, compare-os para descobrir qual membro tem o maior conjunto de transações no geral, incluindo as transações executadas (`gtid_executed`) e as transações certificadas (no canal `group_replication_applier`). Você pode fazer isso manualmente, olhando para os GTIDs, ou pode comparar os conjuntos de GTID usando funções armazenadas, conforme descrito na Seção 19.1.3.8, “Exemplos de Função Armazenada para Manipular GTIDs”.

3. Use o membro que tem o maior conjunto de transações para iniciar o grupo, conectando um cliente ao membro do grupo e emitindo as seguintes declarações:

   ```
   mysql> SET GLOBAL group_replication_bootstrap_group=ON;
   mysql> START GROUP_REPLICATION;
   mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
   ```

É importante não armazenar o ajuste `group_replication_bootstrap_group=ON` no arquivo de configuração, caso contrário, quando o servidor for reiniciado novamente, um segundo grupo com o mesmo nome será criado.

4. Para verificar se o grupo agora existe com esse membro fundador, emita essa declaração sobre o membro que o iniciou:

   ```
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

5. Adicione cada um dos outros membros de volta ao grupo, em qualquer ordem, emitindo uma declaração `START GROUP_REPLICATION` (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") sobre cada um deles:

   ```
   mysql> START GROUP_REPLICATION;
   ```

6. Para verificar se cada membro se juntou ao grupo, emita esta declaração sobre qualquer membro:

   ```
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

7. Quando os membros se reunirem novamente no grupo, se tiverem editado seus arquivos de configuração para definir `group_replication_start_on_boot=OFF`, poderão editá-los novamente para definir `ON` (ou remover a variável do sistema, uma vez que `ON` é a opção padrão).

### 20.5.3 Garantindo a Consistência das Transações

Uma das principais implicações de um sistema distribuído, como a Replicação por Grupo, são as garantias de consistência que ele oferece como um grupo. Em outras palavras, a consistência da sincronização global das transações distribuídas entre os membros do grupo. Esta seção descreve como a Replicação por Grupo lida com as garantias de consistência, dependendo dos eventos que ocorrem em um grupo, e como configurar a melhor consistência do seu grupo.

#### 20.5.3.1 Compreensão das Garantias de Consistência de Transação

Em termos de garantias de consistência distribuída, tanto em operações de reparo normais quanto em operações de reparo em caso de falha, a Replicação em Grupo sempre foi um sistema de consistência eventual. Isso significa que, assim que o tráfego de entrada desacelera ou para, todos os membros do grupo têm o mesmo conteúdo de dados. Os eventos que se relacionam à consistência de um sistema podem ser divididos em operações de controle, que podem ser manuais ou automaticamente acionadas por falhas; e operações de fluxo de dados.

Para a Replicação em Grupo, as operações de controle que podem ser avaliadas em termos de consistência são:

* um membro que se junta ou sai, que é coberto pela Seção 20.5.4 do Grupo de Replicação, “Recuperação Distribuída” e proteção de escrita.

* falhas na rede, que são cobertas pelos modos de proteção. * em grupos de primário único, failover primário, que também pode ser uma operação acionada por `group_replication_set_as_primary()`.

##### Garantias de Consistência e Failover Primário

Em um grupo de primário único, no caso de uma falha do primário quando um secundário é promovido ao primário, o novo primário pode ser disponibilizado imediatamente para o tráfego de aplicativos, independentemente de quão grande seja o atraso de replicação, ou, como alternativa, o acesso a ele pode ser restringido até que o atraso tenha sido aplicado.

Com a primeira abordagem, o grupo leva o mínimo de tempo possível para garantir a estabilidade da participação do grupo após um fracasso primário, elege um novo primário e, em seguida, permite o acesso aos dados imediatamente, enquanto ainda está aplicando qualquer possível atraso do primário antigo. A consistência de escrita é garantida, mas as leituras podem recuperar temporariamente dados desatualizados enquanto o novo primário aplica o atraso. Por exemplo, se o cliente C1 escreveu `A=2 WHERE A=1` no primário antigo logo antes de sua falha, quando o cliente C1 se reconectar ao novo primário, ele pode potencialmente ler `A=1` até que o novo primário aplique seu atraso e alcance o estado do primário antigo antes de deixar o grupo.

Com a segunda alternativa, o sistema garante a estabilidade da participação do grupo após o primeiro falha e elege um novo primário da mesma forma que a primeira alternativa, mas, neste caso, o grupo então espera até que o novo primário aplique todo o atraso e só então permite o acesso aos dados. Isso garante que, em uma situação como a descrita anteriormente, quando o cliente C1 é reconectado ao novo primário, ele lê `A=2`. No entanto, o preço a pagar é que o tempo necessário para o failover é então proporcional ao tamanho do atraso, que, em um grupo corretamente configurado, deve ser pequeno.

Antes do MySQL 8.0.14, não havia como definir a política de falha; por padrão, a disponibilidade era maximizada conforme descrito na primeira abordagem. Em um grupo com membros executando o MySQL 8.0.14 e versões posteriores, você pode determinar o nível de garantias de consistência de transação fornecidas pelos membros durante o falha primário usando a variável `group_replication_consistency`. Veja o Impacto da Consistência na Eleição Primária.

##### Operações de fluxo de dados

O fluxo de dados é relevante para as garantias de consistência do grupo devido às leituras e escritas executadas contra um grupo, especialmente quando essas operações são distribuídas entre todos os membros. As operações de fluxo de dados se aplicam a ambos os modos de Replicação de Grupo: único-primário e multi-primário, no entanto, para tornar essa explicação mais clara, é restrito ao modo único-primário. A maneira usual de dividir as transações de leitura ou escrita que chegam entre os membros de um grupo único-primário é encaminhar as escritas para o primário e distribuir as leituras de forma uniforme entre os secundários. Como o grupo deve se comportar como uma única entidade, é razoável esperar que as escritas no primário estejam disponíveis instantaneamente nos secundários. Embora a Replicação de Grupo seja escrita usando protocolos do Sistema de Comunicação de Grupo (GCS) que implementam o algoritmo Paxos, algumas partes da Replicação de Grupo são assíncronas, o que implica que os dados são aplicados de forma assíncrona aos secundários. Isso significa que um cliente C2 pode escrever `B=2 WHERE B=1` no primário, conectar-se imediatamente a um secundário e ler `B=1`. Isso ocorre porque o secundário ainda está aplicando backlog e não aplicou a transação que foi aplicada pelo primário.

##### Pontos de sincronização de transações

Você configura a garantia de consistência de um grupo com base no ponto em que deseja sincronizar as transações em todo o grupo. Para ajudá-lo a entender o conceito, esta seção simplifica os pontos de sincronização de transações em um grupo para o momento de uma operação de leitura ou para o momento de uma operação de escrita. Se os dados forem sincronizados no momento de uma leitura, a sessão atual do cliente espera até um determinado ponto, que é o momento em que todas as transações de atualização anteriores foram aplicadas, antes de poder começar a executar. Com essa abordagem, apenas essa sessão é afetada, todas as outras operações de dados concorrentes não são afetadas.

Se os dados forem sincronizados no momento da escrita, a sessão de escrita aguarda até que todos os secundários tenham escrito seus dados. A Replicação por Grupo usa uma ordem total em escritas, e, portanto, isso implica esperar que essa e todas as escritas anteriores que estão nas filas dos secundários sejam aplicadas. Portanto, ao usar este ponto de sincronização, a sessão de escrita aguarda que todas as filas dos secundários sejam aplicadas.

Qualquer alternativa garante que, na situação descrita para o cliente C2, sempre leia `B=2`, mesmo se conectado imediatamente a um secundário. Cada alternativa tem suas vantagens e desvantagens, que estão diretamente relacionadas à carga de trabalho do seu sistema. Os exemplos a seguir descrevem diferentes tipos de cargas de trabalho e aconselham qual ponto de sincronização é apropriado.

Imagine as seguintes situações:

* Você quer equilibrar a carga de leituras sem implementar restrições adicionais sobre qual servidor você lê para evitar ler dados desatualizados. Grupos de escritas são muito menos comuns do que grupos de leituras.

* Para um grupo que tem dados predominantemente de leitura apenas, você deseja que as transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que as leituras subsequentes sejam feitas em dados atualizados que incluam a última escrita. Isso garante que você não pague o custo de sincronização para cada transação de leitura apenas, mas apenas para transações de leitura/escrita.

Nesses casos, você deve optar por sincronizar em gravações.

Imagine as seguintes situações:

* Você quer equilibrar a carga de suas leituras sem implementar restrições adicionais sobre qual servidor você lê para evitar ler dados desatualizados. Grupos de escrita são muito mais comuns do que grupos de leitura.

* Você deseja que transações específicas em sua carga de trabalho sempre leiam dados atualizados do grupo, por exemplo, sempre que dados sensíveis são atualizados (como credenciais para um arquivo ou dados semelhantes) e deseja impor que as leituras obtenham o valor mais atualizado.

Nesses casos, você deve optar por sincronizar em leituras.

#### 20.5.3.2 Configurando Garantias de Consistência de Transação

Embora a seção Pontos de Sincronização de Transação explique que, conceitualmente, existem dois pontos de sincronização a partir dos quais você pode escolher: em leitura ou em escrita, esses termos foram uma simplificação e os termos usados na Replicação por Grupo são: *antes* e *depois* da execução da transação. O nível de consistência pode ter diferentes efeitos em transações somente de leitura e de leitura/escrita processadas pelo grupo, conforme demonstrado nesta seção.

* Como escolher um nível de consistência
* Impactos dos níveis de consistência
* Impacto da consistência na eleição primária
* Perguntas permitidas sob as regras de consistência

A lista a seguir mostra os possíveis níveis de consistência que você pode configurar na Replicação em Grupo usando a variável `group_replication_consistency`, em ordem crescente de garantia de consistência de transação:

* `EVENTUAL`

Nem as operações de leitura nem as de leitura/escrita esperam que as operações anteriores sejam aplicadas antes de serem executadas. Esse era o comportamento da Replicação por Grupo antes de a variável `group_replication_consistency` ser adicionada. Uma operação de leitura/escrita não espera que outros membros apliquem uma operação. Isso significa que uma operação pode ser externalizada em um membro antes dos outros. Isso também significa que, em caso de falha primária, o novo primário pode aceitar novas operações de leitura ou escrita antes que todas as operações do primário anterior sejam aplicadas. As operações de leitura podem resultar em valores desatualizados, as operações de leitura/escrita podem resultar em um rollback devido a conflitos.

* `BEFORE_ON_PRIMARY_FAILOVER`

Novas transações de leitura somente ou de leitura/escrita com um primário recém-eleito que está aplicando um atraso do primário antigo não são aplicadas até que qualquer atraso tenha sido aplicado. Isso garante que, quando um failover de primário acontece, intencionalmente ou não, os clientes sempre vejam o valor mais recente no primário. Isso garante consistência, mas significa que os clientes devem ser capazes de lidar com o atraso no caso de um atraso estar sendo aplicado. Geralmente, esse atraso deve ser mínimo, mas isso depende do tamanho do atraso.

* `BEFORE`

Uma transação de leitura/escrita aguarda que todas as transações anteriores sejam concluídas antes de ser aplicada. Uma transação apenas de leitura aguarda que todas as transações anteriores sejam concluídas antes de ser executada. Isso garante que essa transação leia o valor mais recente, apenas afetando a latência da transação. Isso reduz o overhead de sincronização em cada transação de leitura/escrita, garantindo que a sincronização seja usada apenas em transações apenas de leitura. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

* `AFTER`

Uma transação de leitura/escrita aguarda até que suas alterações tenham sido aplicadas a todos os outros membros. Esse valor não tem efeito em transações apenas de leitura. Esse modo garante que, quando uma transação é comprometida no membro local, quaisquer transações subsequentes leem o valor escrito ou um valor mais recente em qualquer membro do grupo. Use esse modo com um grupo que é usado para operações predominantemente apenas de leitura para garantir que as transações de leitura/escrita aplicadas sejam aplicadas em todos os lugares uma vez que sejam comprometidas. Isso pode ser usado por sua aplicação para garantir que as leituras subsequentes obtenham os dados mais recentes, que incluem as últimas escritas. Isso reduz o overhead da sincronização em cada transação apenas de leitura, garantindo que a sincronização seja usada apenas em transações de leitura/escrita. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

* `BEFORE_AND_AFTER`

Uma transação de leitura/escrita aguarda 1) que todas as transações anteriores sejam concluídas antes de ser aplicada e 2) até que suas alterações sejam aplicadas em outros membros. Uma transação apenas de leitura aguarda que todas as transações anteriores sejam concluídas antes da execução. Esse nível de consistência também inclui as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

Os níveis de consistência `BEFORE` e `BEFORE_AND_AFTER` podem ser usados em transações de leitura somente e de leitura/escrita. O nível de consistência `AFTER` não tem impacto em transações de leitura somente, porque elas não geram alterações.

##### Como escolher um nível de consistência

Os diferentes níveis de consistência oferecem flexibilidade tanto para os DBA, que podem usá-los para configurar sua infraestrutura; quanto para os desenvolvedores, que podem usar o nível de consistência que melhor se adequa aos requisitos de sua aplicação. Os seguintes cenários mostram como escolher um nível de garantia de consistência com base na forma como você usa seu grupo:

* *Cenário 1*: Você quer equilibrar leituras sem se preocupar com leituras obsoletas, e as operações de escrita em grupo são consideravelmente menores do que as operações de leitura em grupo. Nesse caso, você deve escolher `AFTER`.

* *Cenário 2*: Para um conjunto de dados que realiza muitas operações de escrita, você deseja realizar leituras ocasionais sem preocupações com a leitura de dados desatualizados. Nesse caso, você deve escolher `BEFORE`.

* *Cenário 3*: Você deseja que as transações específicas leiam dados atualizados do grupo, para que, sempre que dados sensíveis, como as credenciais de um arquivo, forem atualizados, as leituras sempre utilizem o valor mais recente. Nesse caso, você deve escolher `BEFORE`.

* *Cenário 4*: Para um grupo que tem dados predominantemente de leitura somente, você deseja que as transações de leitura/escrita sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que as leituras subsequentes sejam feitas em dados que incluam suas últimas escritas e você não incorra no custo de sincronização para cada transação de leitura somente, mas apenas para transações de leitura/escrita. Neste caso, você deve escolher `AFTER`.

* *Cenário 5*: Para um grupo que trabalha predominantemente com dados apenas de leitura, você deseja que as transações de leitura/escrita leiam dados atualizados do grupo e sejam aplicadas em todos os lugares uma vez que sejam confirmadas, para que leituras subsequentes sejam realizadas em dados que incluam a última escrita e você não incorra no custo de sincronização para cada transação apenas de leitura, mas apenas para transações de leitura/escrita. Neste caso, você deve escolher `BEFORE_AND_AFTER`.

Você pode escolher o escopo para o qual o nível de consistência é aplicado, definindo `group_replication_consistency` com escopo de sessão ou global. Isso é importante porque os níveis de consistência podem ter um impacto negativo no desempenho do grupo, aplicando-se globalmente.

Para impor o nível de consistência para a sessão atual, use o escopo de sessão, da seguinte forma:

```
> SET @@SESSION.group_replication_consistency= 'BEFORE';
```

Para impor o nível de consistência para todas as sessões, use o escopo global, conforme mostrado aqui:

```
> SET @@GLOBAL.group_replication_consistency= 'BEFORE';
```

A possibilidade de definir o nível de consistência em sessões específicas permite que você aproveite cenários como os listados aqui:

* *Cenário 6*: Um sistema específico lida com várias instruções que não exigem um nível de consistência forte, mas um tipo de instrução exige uma consistência forte: gerenciar permissões de acesso a documentos; Nesse cenário, o sistema altera as permissões de acesso e quer ter certeza de que todos os clientes vejam a permissão correta. Você só precisa de `SET @@SESSION.group_replication_consistency= ‘AFTER’`, para essas instruções e deixe as outras instruções para executar com `EVENTUAL` definido no escopo global.

* *Cenário 7*: No mesmo sistema descrito no Cenário 6, um comando que realiza análises precisa ser executado diariamente, utilizando os dados mais atualizados. Para isso, você só precisa executar a instrução SQL `SET @@SESSION.group_replication_consistency= ‘BEFORE’` antes de executar o comando.

Em resumo, você não precisa executar todas as transações com o mesmo nível de consistência específico, especialmente se apenas algumas transações realmente a exigirem.

Você deve estar ciente de que todas as transações de leitura/escrita são sempre ordenadas na Replicação por Grupo, portanto, mesmo quando você define o nível de consistência para `AFTER` para a sessão atual, essa transação aguarda até que suas alterações sejam aplicadas em todos os membros, o que significa esperar por essa e todas as transações anteriores que possam estar nas filas dos secundários. Em outras palavras, o nível de consistência `AFTER` aguarda tudo até e incluindo essa transação.

##### Impactos dos Níveis de Consistência

Outra forma de classificar os níveis de consistência é em termos de impacto no grupo, ou seja, as repercussões que os níveis de consistência têm nos outros membros.

O nível de consistência `BEFORE`, além de ser ordenado no fluxo de transação, afeta apenas o membro local. Ou seja, não requer coordenação com os outros membros e não tem repercussões em suas transações. Em outras palavras, `BEFORE` afeta apenas as transações nas quais é usado.

Os níveis de consistência `AFTER` e `BEFORE_AND_AFTER` não têm efeitos colaterais em transações concorrentes executadas em outros membros. Esses níveis de consistência fazem com que as transações dos outros membros ajudem a aguardar se transações com o nível de consistência `EVENTUAL` começarem enquanto uma transação com `AFTER` ou `BEFORE_AND_AFTER` está sendo executada. Os outros membros esperam até que a transação `AFTER` seja comprometida nesse membro, mesmo que as transações do outro membro tenham o nível de consistência `EVENTUAL`. Em outras palavras, `AFTER` e `BEFORE_AND_AFTER` afetam *todos* os membros do grupo `ONLINE`.

Para ilustrar isso, imagine um grupo com 3 membros, M1, M2 e M3. Em relação ao membro M1, um cliente emite:

```
> SET @@SESSION.group_replication_consistency= AFTER;
> BEGIN;
> INSERT INTO t1 VALUES (1);
> COMMIT;
```

Em seguida, enquanto a transação acima é aplicada, em membro M2, um cliente emite:

```
> SET SESSION group_replication_consistency= EVENTUAL;
```

Nessa situação, mesmo que o nível de consistência da segunda transação seja `EVENTUAL`, porque ela começa a ser executada enquanto a primeira transação já está na fase de commit no M2, a segunda transação tem que esperar que a primeira transação termine o commit e só então pode ser executada.

Você só pode usar os níveis de consistência `BEFORE`, `AFTER` e `BEFORE_AND_AFTER` em membros do `ONLINE`, tentando usá-los em membros de outros estados causa um erro de sessão.

As transações cujo nível de consistência não é `EVENTUAL` aguardam execução até que um tempo limite, configurado pelo valor `wait_timeout`, que é padrão de 8 horas, seja atingido. Se o tempo limite for atingido, uma `ER_GR_HOLD_WAIT_TIMEOUT` erro é lançado.

##### Impacto da Consistência nas Eleições Primárias

Esta seção descreve como o nível de consistência de um grupo afeta um grupo primário único que elegeu um novo primário. Tal grupo detecta automaticamente falhas e ajusta a visão dos membros que estão ativos, em outras palavras, a configuração da associação. Além disso, se um grupo é implantado no modo de único primário, sempre que a associação do grupo muda, é realizada uma verificação para detectar se ainda há um membro primário no grupo. Se não houver nenhum, um novo é selecionado da lista de membros secundários. Tipicamente, isso é conhecido como promoção secundária.

Dado que o sistema detecta falhas e se reconstrói automaticamente, o usuário também pode esperar que, uma vez que a promoção ocorra, o novo primário esteja exatamente no mesmo estado, em termos de dados, que o antigo. Em outras palavras, o usuário pode esperar que não haja um atraso de transações replicadas a serem aplicadas no novo primário, uma vez que ele possa lê-lo e escrevê-lo nele. Em termos práticos, o usuário pode esperar que, uma vez que sua aplicação faça uma fail-over para o novo primário, não haveria chance, mesmo temporariamente, de ler dados antigos ou escrever em registros de dados antigos.

Quando o controle de fluxo é ativado e ajustado corretamente em um grupo, há apenas uma pequena chance de ler dados obsoletos de um primário recém-eleito imediatamente após a promoção, pois não deve haver um atraso, ou se houver, ele deve ser pequeno. Além disso, você pode ter camadas de proxy ou middleware que governam os acessos da aplicação ao primário após uma promoção e aplicam os critérios de consistência nesse nível. Se todos os membros do grupo estiverem usando MySQL 8.0.14 ou posterior, você pode especificar o comportamento do novo primário uma vez que ele é promovido usando a variável `group_replication_consistency`, que controla se um primário recém-elegido bloqueia leituras e escritas até que o atraso seja totalmente aplicado, ou se ele se comporta da maneira dos membros que executam MySQL 8.0.13 ou anterior. Se a variável `group_replication_consistency` foi definida como `BEFORE_ON_PRIMARY_FAILOVER` em um primário recém-elegido que tem atraso a aplicar, e transações são emitidas contra o novo primário enquanto ele ainda está aplicando o atraso, as transações recebidas são bloqueadas até que o atraso seja totalmente aplicado. Isso previne as seguintes anomalias:

* Sem leituras obsoletas para transações de leitura somente ou de leitura/escrita. Isso impede que leituras obsoletas sejam externalizadas para o aplicativo pelo novo primário.

* Nenhuma reversão falsa para transações de leitura/escrita, devido a conflitos de escrita com transações de leitura/escrita replicadas ainda na fila de espera para serem aplicadas.

* Sem desvio de leitura em transações de leitura/escrita, como esta:

  ```
  > BEGIN;
  > SELECT x FROM t1; -- x=1 because x=2 is in the backlog;
  > INSERT x INTO t2;
  > COMMIT;
  ```

Essa consulta não deve causar um conflito, mas escreve valores desatualizados.

Para resumir, quando `group_replication_consistency` está definido como `BEFORE_ON_PRIMARY_FAILOVER`, você está escolhendo priorizar a consistência em detrimento da disponibilidade, porque as leituras e escritas são realizadas sempre que um novo primário é eleito. Esse é o compromisso que você deve considerar ao configurar seu grupo. Também deve ser lembrado que, se o controle de fluxo estiver funcionando corretamente, o atraso deve ser mínimo. Note que os níveis de consistência mais altos `BEFORE`, `AFTER` e `BEFORE_AND_AFTER` também incluem as garantias de consistência fornecidas por `BEFORE_ON_PRIMARY_FAILOVER`.

Para garantir que o grupo ofereça o mesmo nível de consistência, independentemente de qual membro seja promovido ao primário, todos os membros do grupo devem ter `BEFORE_ON_PRIMARY_FAILOVER` (ou um nível de consistência superior) persistido em sua configuração. Por exemplo, em cada questão do membro:

```
> SET PERSIST group_replication_consistency='BEFORE_ON_PRIMARY_FAILOVER';
```

Isso garante que todos os membros se comportem da mesma maneira e que a configuração seja persistente após o reinício do membro.

Uma transação não pode ficar em espera para sempre, e se o tempo mantido exceder `wait_timeout`, ela retorna um erro ER_GR_HOLD_WAIT_TIMEOUT.

##### Perguntas permitidas sob as regras de consistência

Embora todas as escritas sejam realizadas ao usar o nível de consistência `BEFORE_ON_PRIMARY_FAILOVER`, nem todas as leituras são bloqueadas para garantir que você ainda possa inspecionar o servidor enquanto ele está aplicando o backlog após uma promoção ter ocorrido. Isso é útil para depuração, monitoramento, observabilidade e solução de problemas. Algumas consultas que não modificam dados são permitidas, como as seguintes:

* As declarações `SHOW`: Em MySQL 8.0.27 e versões posteriores, essas são restritas às que não dependem de dados, apenas de status e configuração.

As declarações `SHOW` que são permitidas no MySQL 8.0.27 e posteriores são `SHOW VARIABLES`, `SHOW PROCESSLIST`, `SHOW STATUS`, `SHOW ENGINE INNODB LOGS`, `SHOW ENGINE INNODB STATUS`, `SHOW ENGINE INNODB MUTEX`, `SHOW MASTER STATUS`, `SHOW REPLICA STATUS`, `SHOW CHARACTER SET`, `SHOW COLLATION`, `SHOW BINARY LOGS`, `SHOW OPEN TABLES`, `SHOW REPLICAS`, `SHOW BINLOG EVENTS`, `SHOW WARNINGS`, `SHOW ERRORS`, `SHOW ENGINES`, `SHOW PRIVILEGES`, `SHOW PROCEDURE STATUS`, `SHOW FUNCTION STATUS`, `SHOW PLUGINS,`, `SHOW EVENTS`, `SHOW PROFILE`, `SHOW PROFILES`, e `SHOW RELAYLOG EVENTS`.

* `SET` declarações
* 1 `DO` declarações que não utilizam tabelas ou funções carregáveis

* `EMPTY` declarações
* `USE` declarações
* Uso de `SELECT` declarações contra os bancos de dados `performance_schema` e `sys`

* Uso das declarações `SELECT` contra a tabela `PROCESSLIST` do banco de dados `infoschema`

* `SELECT` declarações que não utilizam tabelas ou funções carregáveis

* `STOP GROUP_REPLICATION` declarações

* `SHUTDOWN` declarações
* `RESET PERSIST` declarações

### 20.5.4 Recuperação Distribuída

Sempre que um membro se junta ou retorna a um grupo de replicação, ele deve recuperar as transações que foram aplicadas pelos membros do grupo antes de se juntar ou enquanto estava ausente. Esse processo é chamado de recuperação distribuída.

O membro que se junta começa verificando o registro do relé para o seu canal `group_replication_applier` em busca de quaisquer transações que já tenha recebido do grupo, mas que ainda não tenha aplicado. Se o membro que se junta já estava no grupo anteriormente, ele pode encontrar transações não aplicadas de antes de ter saído, e, nesse caso, aplica essas transações como um primeiro passo. Um membro que é novo no grupo não tem nada para aplicar.

Depois disso, o membro que se junta conecta a um membro existente online para realizar a transferência de estado. O membro que se junta transfere todas as transações que ocorreram no grupo antes de se juntar ou enquanto estava ausente, que são fornecidas pelo membro existente (chamado de *doador*). Em seguida, o membro que se junta aplica as transações que ocorreram no grupo enquanto essa transferência de estado estava em andamento. Quando esse processo estiver completo, o membro que se junta terá alcançado os servidores restantes no grupo e começará a participar normalmente no grupo.

A Replicação em Grupo utiliza uma combinação desses métodos para transferência de estado durante a recuperação distribuída:

* Uma operação de clonagem remota usando a função do plugin de clonagem, que está disponível a partir do MySQL 8.0.17. Para habilitar este método de transferência de estado, você deve instalar o plugin de clonagem no membro do grupo e no membro que está se juntando. A Replicação de grupo configura automaticamente as configurações necessárias do plugin de clonagem e gerencia a operação de clonagem remota.

* Replicação de um log binário de um doador e aplicação das transações no membro que se junta. Este método utiliza um canal de replicação assíncrona padrão denominado `group_replication_recovery` que é estabelecido entre o doador e o membro que se junta.

A Replicação em Grupo seleciona automaticamente a melhor combinação desses métodos para transferência de estado após você emitir `START GROUP_REPLICATION` no membro que está se juntando. Para isso, a Replicação em Grupo verifica quais membros existentes são adequados como doadores, quantas transações o membro que está se juntando precisa de um doador e se alguma transação necessária não está mais presente nos arquivos de registro binário de qualquer membro do grupo. Se a lacuna de transação entre o membro que está se juntando e um doador adequado for grande, ou se algumas transações necessárias não estiverem em nenhum dos arquivos de registro binário de um doador, a Replicação em Grupo começa a recuperação distribuída com uma operação de clonagem remota. Se não houver uma grande lacuna de transação, ou se o plugin de clonagem não estiver instalado, a Replicação em Grupo prossegue diretamente para a transferência de estado a partir do registro binário de um doador.

* Durante uma operação de clonagem remota, os dados existentes do membro de junção são removidos e substituídos por uma cópia dos dados do doador. Quando a operação de clonagem remota estiver concluída e o membro de junção tiver sido reiniciado, a transferência de estado de um log binário do doador é realizada para obter as transações que o grupo aplicou enquanto a operação de clonagem remota estava em andamento.

* Durante a transferência de estado a partir do log binário de um membro doador, o membro que se junta replica e aplica as transações necessárias do log binário do doador, aplicando as transações conforme elas são recebidas, até o ponto em que o log binário registra que o membro que se junta se juntou ao grupo (um evento de mudança de visão). Enquanto isso está em andamento, o membro que se junta armazena as novas transações que o grupo aplica. Quando a transferência de estado do log binário é concluída, o membro que se junta aplica as transações armazenadas.

Quando o membro associado está atualizado com todas as transações do grupo, ele é declarado online e pode participar do grupo como um membro normal, e a recuperação distribuída está completa.

Dica

A transferência de estado do log binário é o mecanismo básico da Replicação em Grupo para recuperação distribuída, e se os doadores e os membros que se juntam ao seu grupo de replicação não estiverem configurados para suportar clonagem, essa é a única opção disponível. Como a transferência de estado do log binário é baseada na replicação clássica assíncrona, ela pode levar muito tempo se o servidor que se junta ao grupo não tiver absolutamente nenhum dos dados do grupo, ou tiver dados retirados de uma imagem de backup muito antiga. Nessa situação, portanto, é recomendável que, antes de adicionar um servidor ao grupo, você o configure com os dados do grupo, transferindo um instantâneo bastante recente de um servidor que já esteja no grupo. Isso minimiza o tempo necessário para a recuperação distribuída e reduz o impacto nos servidores doadores, uma vez que eles precisam reter e transferir menos arquivos do log binário.

#### 20.5.4.1 Conexões para Recuperação Distribuída

Quando um membro associado se conecta a um membro existente online para transferência de estado durante a recuperação distribuída, o membro associado atua como cliente na conexão e o membro existente atua como servidor. Quando a transferência de estado do log binário do doador está em andamento nesta conexão (usando o canal de replicação assíncrona `group_replication_recovery`, o membro associado atua como replica e o membro existente atua como fonte. Quando uma operação de clonagem remota está em andamento nesta conexão, o membro associado atua como receptor e o membro existente atua como doador. As configurações de configuração que se aplicam a esses papéis fora do contexto da Replicação de Grupo podem ser aplicadas para a Replicação de Grupo também, a menos que sejam sobrescritas por uma configuração ou comportamento específico da Replicação de Grupo.

A conexão que um membro existente oferece a um membro que se junta para recuperação distribuída não é a mesma conexão que é usada pela Replicação em Grupo para comunicação entre membros online do grupo.

* A conexão usada pelo motor de comunicação de grupo para a Replicação de Grupo (XCom, uma variante Paxos) para comunicação TCP entre instâncias remotas de XCom é especificada pela variável de sistema `group_replication_local_address`. Esta conexão é usada para mensagens TCP/IP entre membros online. A comunicação com a instância local é feita por meio de um canal de entrada usando memória compartilhada.

* Para recuperação distribuída antes do MySQL 8.0.21, os membros do grupo oferecem sua conexão padrão de cliente SQL para membros que se juntam, conforme especificado por `hostname` e `port`. Se um número de porta alternativa for especificado por `report_port`, este é usado em vez disso.

* No MySQL 8.0.21 e versões posteriores, os membros do grupo podem anunciar uma lista alternativa de pontos finais de recuperação distribuída como conexões de cliente dedicadas para membros que desejam se juntar, permitindo que você controle o tráfego de recuperação distribuída separadamente das conexões de usuários regulares de cliente do membro. Um membro transmite a lista de pontos finais de recuperação distribuída especificada por `group_replication_advertise_recovery_endpoints` para o grupo quando ele se junta. Por padrão, o membro continua a oferecer a conexão padrão de cliente SQL, como nas versões anteriores.

Importante

A recuperação distribuída pode falhar se um membro que se junta não conseguir identificar corretamente os outros membros usando o nome do host definido pela variável de sistema `hostname` do MySQL Server. É recomendável que os sistemas operacionais que executam o MySQL tenham um nome de host único configurado corretamente, seja usando DNS ou configurações locais. O nome de host que o servidor está usando para conexões de cliente SQL pode ser verificado na coluna `Member_host` da tabela do Schema de Desempenho `replication_group_members`. Se vários membros do grupo externalizarem um nome de host padrão definido pelo sistema operacional, há uma chance de o membro que se junta não resolvê-lo para o endereço correto do membro e não conseguir se conectar para a recuperação distribuída. Nessa situação, você pode usar a variável de sistema `report_host` do MySQL Server para configurar um nome de host único que seja externalizado por cada um dos servidores.

Os passos para um membro associado estabelecer uma conexão para recuperação distribuída são os seguintes:

1. Quando o membro se junta ao grupo, ele se conecta com um dos membros-sinal incluídos na lista em sua variável de sistema `group_replication_group_seeds`, inicialmente usando a conexão `group_replication_local_address` conforme especificado naquela lista. Os membros-sinal podem ser um subconjunto do grupo.

2. Por meio dessa conexão, o membro do grupo utiliza o serviço de adesão do Replicação em grupo para fornecer ao membro que está se juntando uma lista de todos os membros que estão online no grupo, na forma de uma visualização. As informações de adesão incluem os detalhes dos pontos finais de recuperação distribuídos ou a conexão padrão do cliente SQL oferecida por cada membro para recuperação distribuída.

3. O membro associado seleciona um membro do grupo adequado desta lista para ser seu doador para recuperação distribuída, seguindo os comportamentos descritos na Seção 20.5.4.4, "Tolerância a Falhas para Recuperação Distribuída".

4. O membro que se junta tenta, em seguida, conectar-se ao doador usando os pontos finais de recuperação distribuídos anunciados pelo doador, tentando cada um em ordem, conforme especificado na lista. Se o doador não fornecer nenhum ponto final, o membro que se junta tenta conectar-se usando a conexão padrão do cliente SQL do doador. Os requisitos SSL para a conexão são especificados pelos `group_replication_recovery_ssl_*` opções descritas na Seção 20.5.4.1.4, “SSL e Autenticação para Recuperação Distribuída”.

5. Se o membro que se junta não conseguir se conectar ao doador selecionado, ele tenta novamente com outros doadores adequados, seguindo os comportamentos descritos na Seção 20.5.4.4, "Tolerância a Falhas para Recuperação Distribuída". Observe que, se o membro que se junta esgota a lista de pontos finais anunciados sem fazer uma conexão, ele não volta à conexão padrão do cliente SQL do doador, mas muda para outro doador.

6. Quando o membro que está se conectando estabelece uma conexão de recuperação distribuída com um doador, ele usa essa conexão para a transferência de estado conforme descrito na Seção 20.5.4, “Recuperação Distribuída”. O host e o porto para a conexão que é usado são mostrados no log do membro que está se conectando. Note que, se uma operação de clonagem remota for usada, quando o membro que está se conectando tiver reiniciado no final da operação, ele estabelece uma conexão com um novo doador para a transferência de estado do log binário. Isso pode ser uma conexão com um membro diferente do doador original usado para a operação de clonagem remota, ou pode ser uma conexão diferente com o doador original. Em qualquer caso, o processo de recuperação distribuída continua da mesma maneira que teria com o doador original.

##### 20.5.4.1.1 Selecionando endereços para pontos finais de recuperação distribuídos

Os endereços IP fornecidos pela variável de sistema `group_replication_advertise_recovery_endpoints` como pontos finais de recuperação distribuídos não precisam ser configurados para o MySQL Server (ou seja, não precisam ser especificados pela variável de sistema `admin_address` ou na lista para a variável de sistema `bind_address`). Eles precisam ser atribuídos ao servidor. Todos os nomes de host utilizados devem resolver em um endereço IP local. Endereços IPv4 e IPv6 podem ser utilizados.

Os ports fornecidos para os pontos finais de recuperação distribuídos precisam ser configurados para o MySQL Server, portanto, devem ser especificados pela variável de sistema `port`, `report_port` ou `admin_port`. O servidor deve ouvir conexões TCP/IP nessas portas. Se você especificar o `admin_port`, o usuário de replicação para recuperação distribuída precisa do privilégio `SERVICE_CONNECTION_ADMIN` para se conectar. Selecionar o `admin_port` mantém as conexões de recuperação distribuída separadas das conexões regulares do cliente MySQL.

Os membros que se juntam tentam cada um dos pontos finais em ordem, conforme especificado na lista. Se `group_replication_advertise_recovery_endpoints` estiver definido como `DEFAULT` em vez de uma lista de pontos finais, a conexão padrão do cliente SQL é oferecida. Observe que a conexão padrão do cliente SQL não é automaticamente incluída em uma lista de pontos finais de recuperação distribuída e não é oferecida como uma opção de fallback se a lista de pontos finais do doador for esgotada sem uma conexão. Se você deseja oferecer a conexão padrão do cliente SQL como um dos vários pontos finais de recuperação distribuída, você deve incluí-la explicitamente na lista especificada por `group_replication_advertise_recovery_endpoints`. Você pode colocá-la no último lugar para que atue como último recurso para a conexão.

Os pontos finais de recuperação distribuídos de um membro do grupo (ou a conexão padrão do cliente SQL, se os pontos finais não forem fornecidos) não precisam ser adicionados à lista de permissão de replicação do grupo especificada pela variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist`. A lista de permissão é apenas para o endereço especificado por `group_replication_local_address` para cada membro. Um membro que se junta deve ter sua conexão inicial com o grupo permitida pela lista de permissão para recuperar o endereço ou endereços para recuperação distribuída.

Os pontos finais de recuperação distribuídos que você lista são validados quando a variável do sistema é definida e quando uma declaração `START GROUP_REPLICATION` foi emitida. Se a lista não puder ser analisada corretamente ou se nenhum dos pontos finais puder ser acessado no host porque o servidor não está ouvindo neles, a Replicação em Grupo registra um erro e não inicia.

##### 20.5.4.1.2 Compressão para Recuperação Distribuída

No MySQL 8.0.18 e versões posteriores, você pode, opcionalmente, configurar a compressão para recuperação distribuída pelo método de transferência de estado de um log binário de um doador. A compressão pode beneficiar a recuperação distribuída quando a largura de banda da rede é limitada e o doador precisa transferir muitas transações para o membro que está se juntando. As variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level` determinam os algoritmos de compressão permitidos, e o nível de compressão `zstd` usado ao realizar a transferência de estado de um log binário de um doador. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essas configurações de compressão não se aplicam a operações de clonagem remota. Quando uma operação de clonagem remota é usada para recuperação distribuída, a configuração do plugin `clone_enable_compression` do clone se aplica.

##### 20.5.4.1.3 Usuário de replicação para recuperação distribuída

A recuperação distribuída requer um usuário de replicação que tenha as permissões corretas para que a Replicação de Grupo possa estabelecer canais de replicação diretos entre membros. O usuário de replicação também deve ter as permissões corretas para atuar como o usuário clone no doador para uma operação de clonagem remota. O mesmo usuário de replicação deve ser usado para a recuperação distribuída em todos os membros do grupo. Para obter instruções sobre como configurar esse usuário de replicação, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”. Para obter instruções sobre como proteger as credenciais do usuário de replicação, consulte a Seção 20.6.3.1, “Credenciais de Usuário Seguras para Recuperação Distribuída”.

##### 20.5.4.1.4 SSL e Autenticação para Recuperação Distribuída

O SSL para recuperação distribuída é configurado separadamente do SSL para comunicações normais de grupo, que é determinado pelas configurações de SSL do servidor e pela variável de sistema `group_replication_ssl_mode`. Para conexões de recuperação distribuída, variáveis de sistema dedicadas de recuperação distribuída de replicação de grupo estão disponíveis para configurar o uso de certificados e cifras especificamente para recuperação distribuída.

Por padrão, o SSL não é usado para conexões de recuperação distribuída. Para ativá-lo, defina `group_replication_recovery_use_ssl=ON`, e configure as variáveis de sistema de recuperação distribuída de replicação de grupo conforme descrito na Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”. Você precisa de um usuário de replicação configurado para usar SSL.

Quando a recuperação distribuída é configurada para usar SSL, a Replicação em Grupo aplica essa configuração para operações de clonagem remota, bem como para a transferência de estado de um log binário de um doador. A Replicação em Grupo configura automaticamente as configurações das opções SSL do clone (`clone_ssl_ca`, `clone_ssl_cert` e `clone_ssl_key`) para corresponder às configurações das opções correspondentes de recuperação distribuída da Replicação em Grupo (`group_replication_recovery_ssl_ca`, `group_replication_recovery_ssl_cert` e `group_replication_recovery_ssl_key`).

Se você não estiver usando SSL para recuperação distribuída (assim `group_replication_recovery_use_ssl` está definido como `OFF`), e a conta de usuário de replicação do Grupo de Replicação autentica com o plugin `caching_sha2_password` (que é o padrão no MySQL 8.0) ou o plugin `sha256_password`, pares de chaves RSA são usados para troca de senhas. Neste caso, ou use a variável de sistema `group_replication_recovery_public_key_path` para especificar o arquivo de chave pública RSA, ou use a variável de sistema `group_replication_recovery_get_public_key` para solicitar a chave pública da fonte, conforme descrito na Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação Caching SHA-2”.

#### 20.5.4.2 Clonagem para Recuperação Distribuída

O plugin de clonagem do MySQL Server está disponível a partir do MySQL 8.0.17. Se você deseja usar operações de clonagem remota para recuperação distribuída em um grupo, você deve configurar membros existentes e membros que se juntam previamente para suportar essa função. Se você não deseja usar essa função em um grupo, não configure, nesse caso, a Replicação do Grupo usa apenas a transferência de estado do log binário.

Para usar o clonamento, pelo menos um membro do grupo existente e o membro que está se juntando devem ser configurados previamente para suportar operações de clonamento remoto. Como mínimo, você deve instalar o plugin de clone no membro doador e no membro que está se juntando, conceder a permissão `BACKUP_ADMIN` ao usuário de replicação para recuperação distribuída e definir a variável de sistema `group_replication_clone_threshold` em um nível apropriado. Para garantir a disponibilidade máxima dos doadores, é aconselhável configurar todos os membros atuais e futuros do grupo para suportar operações de clonamento remoto.

Tenha em atenção que uma operação de clonagem remota remove os espaços de tabela e os dados criados pelo utilizador do membro que faz a junção antes de transferir os dados do membro doador. Se a operação for interrompida durante a execução, o membro que faz a junção pode ficar com dados parciais ou sem dados. Isso pode ser reparado tentando novamente a operação de clonagem remota, o que a Replicação em Grupo faz automaticamente.

##### 20.5.4.2.1 Pré-requisitos para Clonagem

Para obter instruções completas sobre como configurar e configurar o plugin de clonagem, consulte a Seção 7.6.7, “O Plugin de Clonagem”. Os pré-requisitos detalhados para uma operação de clonagem remota são abordados na Seção 7.6.7.3, “Clonagem de Dados Remotas”. Para a Replicação de Grupo, observe os seguintes pontos-chave e diferenças:

* O doador (um membro existente do grupo) e o destinatário (o membro que está se juntando) devem ter o plugin de clone instalado e ativo. Para obter instruções sobre como fazer isso, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clone”.

* O doador e o receptor devem rodar no mesmo sistema operacional e devem usar a mesma série de lançamento do servidor MySQL. Portanto, o clonamento não é adequado para grupos onde os membros executam diferentes versões menores do servidor MySQL, como MySQL 8.0 e 8.4.

Antes do MySQL 8.0.37, o clonamento exigia que doadores e receptores utilizassem a mesma versão pontual; essa restrição ainda se aplica se o doador, o receptor ou ambos utilizarem o MySQL 8.0.36 ou versões anteriores.

* O doador e o destinatário devem ter o plugin de replicação de grupo instalado e ativo, e quaisquer outros plugins que estejam ativos no doador (como um plugin de chaveiro) também devem estar ativos no destinatário.

* Se a recuperação distribuída for configurada para usar SSL (`group_replication_recovery_use_ssl=ON`), a Replicação de Grupo aplica essa configuração para operações de clonagem remota. A Replicação de Grupo configura automaticamente as configurações das opções SSL do clone (`clone_ssl_ca`, `clone_ssl_cert` e `clone_ssl_key`) para corresponder às configurações das opções correspondentes de recuperação distribuída de Replicação de Grupo (`group_replication_recovery_ssl_ca`, `group_replication_recovery_ssl_cert` e `group_replication_recovery_ssl_key`).

* Você não precisa configurar uma lista de doadores válidos na variável de sistema `clone_valid_donor_list` para a finalidade de se juntar a um grupo de replicação. A Replicação de grupo configura essa configuração automaticamente para você após selecionar um doador dos membros do grupo existente. Observe que as operações de clonagem remota usam o nome de domínio e a porta do protocolo SQL do servidor.

* O plugin de clonagem tem várias variáveis de sistema para gerenciar o impacto da carga de rede e do desempenho da operação de clonagem remota. A Replicação em Grupo não configura essas configurações, então você pode revisá-las e configurá-las, se desejar, ou deixá-las em padrão. Note que, quando uma operação de clonagem remota é usada para recuperação distribuída, a configuração `clone_enable_compression` do plugin de clonagem se aplica à operação, em vez da configuração de compressão da Replicação em Grupo.

* Para invocar a operação de clonagem remota no destinatário, a Replicação em Grupo usa o usuário interno `mysql.session`, que já possui o privilégio `CLONE_ADMIN`, então você não precisa configurá-lo.

* Como o usuário clone no doador para a operação de clonagem remota, a Replicação em Grupo usa o usuário de replicação que você configurou para recuperação distribuída (que é coberto na Seção 20.2.1.3, “Credenciais do Usuário para Recuperação Distribuída”). Portanto, você deve conceder o privilégio `BACKUP_ADMIN` a este usuário de replicação em todos os membros do grupo que suportam clonagem. Além disso, conceda o privilégio ao usuário de replicação quando estiver adicionando membros, pois eles podem atuar como doadores após se unirem ao grupo. O mesmo usuário de replicação é usado para recuperação distribuída em todos os membros do grupo. Para conceder este privilégio ao usuário de replicação em membros existentes, você pode emitir essa declaração em cada membro do grupo individualmente com registro binário desativado, ou em um membro do grupo com registro binário ativado:

  ```
  GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
  ```

* Se você usar `START GROUP_REPLICATION` para especificar as credenciais do usuário de replicação em um servidor que forneceu anteriormente as credenciais do usuário usando (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") | `CHANGE REPLICATION SOURCE TO`, certifique-se de que você remova as credenciais do usuário dos repositórios de metadados de replicação antes que quaisquer operações de clonagem remota ocorram. Além disso, certifique-se de que `group_replication_start_on_boot=OFF` esteja configurado no membro que está se juntando. Para instruções, consulte a Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”. Se você não desativar as credenciais do usuário, elas serão transferidas para o membro que está se juntando durante operações de clonagem remota. O canal `group_replication_recovery` pode então ser iniciado inadvertidamente com as credenciais armazenadas, seja no membro original ou nos membros que foram clonados a partir dele. Um início automático da Replicação em Grupo no boot do servidor (incluindo após uma operação de clonagem remota) usaria as credenciais do usuário armazenadas, e elas também seriam usadas se um operador não especificar as credenciais de recuperação distribuídas em uma declaração `START GROUP_REPLICATION`.

##### 20.5.4.2.2 Limiar para Clonagem

Quando os membros do grupo foram configurados para suportar o clonamento, a variável de sistema `group_replication_clone_threshold` especifica um limite, expresso como um número de transações, para o uso de uma operação de clonamento remoto na recuperação distribuída. Se a lacuna entre as transações do doador e as transações do membro que está se juntando for maior que esse número, uma operação de clonamento remoto é usada para a transferência de estado para o membro que está se juntando, quando isso é tecnicamente possível. A Replicação de Grupo calcula se o limite foi excedido com base nos conjuntos `gtid_executed` dos membros do grupo existentes. Usar uma operação de clonamento remoto no caso de uma grande lacuna de transações permite adicionar novos membros ao grupo sem transferir os dados do grupo para o servidor manualmente previamente, e também permite que um membro que está muito desatualizado se atualize de forma mais eficiente.

A configuração padrão da variável de sistema de replicação em grupo `group_replication_clone_threshold` é extremamente alta (o número de sequência máximo permitido para uma transação em um GTID), portanto, ela desativa efetivamente o clonamento sempre que a transferência de estado do log binário é possível. Para permitir que a replicação em grupo selecione uma operação de clonamento remoto para transferência de estado onde isso seja mais apropriado, defina a variável do sistema para especificar um número de transações como o intervalo de transações acima do qual você deseja que o clonamento ocorra.

Aviso

Não use uma configuração baixa para `group_replication_clone_threshold` em um grupo ativo. Se um número de transações acima do limite ocorrer no grupo enquanto a operação de clonagem remota estiver em andamento, o membro que está se juntando aciona uma operação de clonagem remota novamente após o reinício e pode continuar isso indefinidamente. Para evitar essa situação, certifique-se de que você defina o limite para um número maior do que o número de transações que você espera ocorrer no grupo durante o tempo necessário para a operação de clonagem remota.

A Replicação em Grupo tenta executar uma operação de clonagem remota, independentemente do seu limite, quando a transferência de estado de um log binário de um membro doador é impossível, por exemplo, porque as transações necessárias pelo membro que está se juntando não estão disponíveis no log binário de qualquer membro do grupo existente. A Replicação em Grupo identifica isso com base nos conjuntos `gtid_purged` dos membros do grupo existentes. Você não pode usar a variável de sistema `group_replication_clone_threshold` para desativar a clonagem quando as transações necessárias não estão disponíveis nos arquivos de log binário de qualquer membro, porque, nessa situação, a clonagem é a única alternativa para transferir dados para o membro que está se juntando manualmente.

##### 20.5.4.2.3 Operações de Clonagem

Quando os membros do grupo e os membros que se juntam são configurados para clonagem, a Replicação de grupo gerencia as operações de clonagem remota para você. Uma operação de clonagem remota pode levar algum tempo para ser concluída, dependendo do tamanho dos dados. Consulte a Seção 7.6.7.10, “Monitoramento das operações de clonagem”, para obter informações sobre o monitoramento do processo.

Nota

Quando a transferência de estado estiver concluída, a Replicação em Grupo reinicia o membro que está se juntando para completar o processo. Se o `group_replication_start_on_boot=OFF` estiver definido no membro que está se juntando, por exemplo, porque você especifica as credenciais do usuário de replicação na declaração `START GROUP_REPLICATION`, você deve emitir novamente manualmente o `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") após esse reinício. Se o `group_replication_start_on_boot=ON` e outras configurações necessárias para iniciar a Replicação em Grupo estiverem definidas em um arquivo de configuração ou usando uma declaração `SET PERSIST`, você não precisa intervir e o processo continua automaticamente para colocar o membro que está se juntando online.

Se o procedimento de clonagem remota levar um longo tempo, em versões anteriores ao MySQL 8.0.22, é possível que o conjunto de informações de certificação que se acumula para o grupo durante esse tempo se torne muito grande para ser transmitido ao membro que está se juntando. Nesse caso, o membro que está se juntando registra uma mensagem de erro e não se junta ao grupo. A partir do MySQL 8.0.22, o Grupo de Replicação gerencia o processo de coleta de lixo para as transações aplicadas de maneira diferente para evitar esse cenário. Em versões anteriores, se você observar esse erro, após a operação de clonagem remota ser concluída, espere dois minutos para permitir que uma rodada de coleta de lixo ocorra, para reduzir o tamanho das informações de certificação do grupo. Em seguida, emita a seguinte declaração no membro que está se juntando, para que ele pare de tentar aplicar o conjunto anterior de informações de certificação:

```
RESET SLAVE FOR CHANNEL group_replication_recovery;
Or from MySQL 8.0.22:
RESET REPLICA FOR CHANNEL group_replication_recovery;
```

Uma operação de clonagem remota clona configurações que são persistidas em tabelas do doador para o receptor, bem como os dados. A Replicação de Grupo gerencia as configurações que se relacionam especificamente com os canais de Replicação de Grupo. As configurações do membro da Replicação de Grupo que são persistidas em arquivos de configuração, como o endereço local de replicação de grupo, não são clonadas e não são alteradas no membro que está se juntando. A Replicação de Grupo também preserva as configurações do canal que se relacionam com o uso do SSL, portanto, essas são exclusivas do membro individual.

Se as credenciais de usuário de replicação usadas pelo doador para o canal de replicação `group_replication_recovery` tiverem sido armazenadas nos repositórios de metadados de replicação usando uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), elas são transferidas e usadas pelo membro que se junta após o clonamento, e devem ser válidas lá. Com credenciais armazenadas, todos os membros do grupo que receberam a transferência de estado por uma operação de clonamento remoto recebem automaticamente o usuário e a senha de replicação para recuperação distribuída. Se você especificar as credenciais de usuário de replicação na declaração `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement"), essas são usadas para iniciar a operação de clonamento remoto, mas não são transferidas e usadas pelo membro que se junta após o clonamento. Se você não deseja que as credenciais sejam transferidas para novos participantes e registradas lá, certifique-se de desativá-las antes das operações de clonamento remoto, conforme descrito na Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”, e use `START GROUP_REPLICATION` para fornecê-las em vez disso.

Se uma conta `PRIVILEGE_CHECKS_USER` tiver sido usada para ajudar a garantir os aplicadores de replicação (consulte a Seção 19.3.3.2, “Verificações de privilégio para canais de replicação de grupo”), a conta `PRIVILEGE_CHECKS_USER` e as configurações relacionadas do doador são clonadas para o membro que está se juntando. Se o membro que está se juntando estiver configurado para iniciar a Replicação de grupo no momento do boot, ele usará automaticamente a conta para verificações de privilégio nos canais de replicação apropriados. (No MySQL 8.0.18, devido a várias limitações, é recomendado que você não use uma conta `PRIVILEGE_CHECKS_USER` com canais de replicação de grupo.)

##### 20.5.4.2.4 Clonagem para outros fins

A Replicação em Grupo inicia e gerencia operações de clonagem para recuperação distribuída. Os membros do grupo que foram configurados para suportar clonagem também podem participar das operações de clonagem que um usuário inicia manualmente. Por exemplo, você pode querer criar uma nova instância de servidor clonando de um membro do grupo como doador, mas não quer que a nova instância de servidor se junte ao grupo imediatamente, ou talvez nunca.

Em todas as versões que suportam clonagem, você pode iniciar uma operação de clonagem manualmente envolvendo um membro do grupo no qual a Replicação de Grupo está parada. Observe que, como a clonagem exige que os plugins ativos em um doador e receptor sejam compatíveis, o plugin de Replicação de Grupo deve ser instalado e ativo na outra instância do servidor, mesmo que você não pretenda que essa instância do servidor se junte a um grupo. Você pode instalar o plugin emitindo esta declaração:

```
INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Em versões anteriores ao MySQL 8.0.20, você não pode iniciar uma operação de clonagem manualmente se a operação envolver um membro do grupo no qual a Replicação de Grupo está em execução. A partir do MySQL 8.0.20, você pode fazer isso, desde que a operação de clonagem não remova e não substitua os dados do destinatário. Portanto, a declaração para iniciar a operação de clonagem deve incluir a cláusula `DATA DIRECTORY` se a Replicação de Grupo estiver em execução.

#### 20.5.4.3 Configurando a Recuperação Distribuída

Vários aspectos do processo de recuperação distribuída do Replicação de Grupo podem ser configurados para se adequar ao seu sistema.

##### Número de tentativas de conexão

Para transferência de estado do log binário, a Replicação em Grupo limita o número de tentativas que um membro que está se juntando faz ao tentar se conectar a um doador do conjunto de doadores. Se o limite de tentativa de conexão for atingido sem uma conexão bem-sucedida, o procedimento de recuperação distribuída é encerrado com um erro. Observe que este limite especifica o número total de tentativas que o membro que está se juntando faz para se conectar a um doador. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativa de conexão é definido para 4, o membro que está se juntando faz 2 tentativas para se conectar a cada um dos doadores antes de atingir o limite.

O limite padrão de tentativa de conexão é de 10. Você pode configurar essa configuração usando a variável de sistema `group_replication_recovery_retry_count`. A seguinte declaração define o número máximo de tentativas para se conectar a um doador em 5:

```
mysql> SET GLOBAL group_replication_recovery_retry_count= 5;
```

Para operações de clonagem remota, esse limite não se aplica. A Replicação em grupo faz apenas uma tentativa de conexão com cada doador adequado para clonagem, antes de começar a tentar a transferência de estado do log binário.

Intervalo de sono para tentativas de conexão

Para a transferência de estado do log binário, a variável de sistema `group_replication_recovery_reconnect_interval` define quanto tempo o processo de recuperação distribuída deve dormir entre as tentativas de conexão do doador. Note que a recuperação distribuída não dorme após cada tentativa de conexão do doador. Como o membro que está se juntando está se conectando a servidores diferentes e não ao mesmo repetidamente, pode assumir que o problema que afeta o servidor A não afeta o servidor B. Portanto, a recuperação distribuída suspende apenas quando passou por todos os possíveis doadores. Uma vez que o servidor que está se juntando ao grupo fez uma tentativa de conexão com cada um dos doadores adequados no grupo, o processo de recuperação distribuída dorme por o número de segundos configurados pela variável de sistema `group_replication_recovery_reconnect_interval`. Por exemplo, se 2 membros do grupo são doadores adequados e o limite de tentativa de conexão é definido para 4, o membro que está se juntando faz uma tentativa de conexão com cada um dos doadores, depois dorme pelo intervalo de tentativa de conexão, depois faz uma tentativa adicional de conexão com cada um dos doadores antes de atingir o limite.

O intervalo padrão de tentativa de conexão é de 60 segundos, e você pode alterar esse valor dinamicamente. A seguinte declaração define o intervalo de tentativa de conexão do doador de recuperação distribuída em 120 segundos:

```
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Para operações de clonagem remota, esse intervalo não se aplica. A Replicação em grupo faz apenas uma tentativa de conexão com cada doador adequado para clonagem, antes de começar a tentar a transferência de estado do log binário.

##### Marcando o Membro Juntador Online

Quando a recuperação distribuída tiver concluído com sucesso a transferência de estado do doador para o membro que está se juntando, o membro que está se juntando pode ser marcado como online no grupo e pronto para participar. Por padrão, isso é feito depois que o membro que está se juntando recebeu e aplicou todas as transações que estava faltando. Opcionalmente, você pode permitir que um membro que está se juntando seja marcado como online quando ele tiver recebido e certificado (ou seja, completado a detecção de conflitos para) todas as transações que estava faltando, mas antes de as ter aplicado. Se você quiser fazer isso, use a variável de sistema `group_replication_recovery_complete_at` para especificar o ajuste alternativo `TRANSACTIONS_CERTIFIED`.

#### 20.5.4.4 Tolerância a falhas para recuperação distribuída

O processo de recuperação distribuído do Grupo Replication possui várias medidas integradas para garantir a tolerância a falhas em caso de quaisquer problemas durante o processo.

O doador para recuperação distribuída é selecionado aleatoriamente da lista existente de membros do grupo online adequados na visualização atual. Selecionar um doador aleatório significa que há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando vários membros entram no grupo. Em MySQL 8.0.17 e versões posteriores, para a transferência de estado do log binário, o aderente seleciona apenas um doador que está executando uma versão de patch inferior ou igual ao MySQL Server em comparação com o próprio. Para versões anteriores, todos os membros online podem ser doadores. Para uma operação de clonagem remota, o aderente seleciona um doador que está executando a mesma versão de patch que ele mesmo. Quando o membro que está adentrando é reiniciado no final da operação, ele estabelece uma conexão com um novo doador para transferência de estado do log binário, que pode ser um membro diferente do doador original usado para a operação de clonagem remota.

Nas situações a seguir, a Replicação em Grupo detecta um erro na recuperação distribuída, muda automaticamente para um novo doador e tenta novamente a transferência do estado:

*Erro de conexão* - Há um problema de autenticação ou outro problema ao fazer a conexão com um doador candidato.

* Erros de replicação* - Um dos fios de replicação (os fios do receptor ou do aplicável) que são usados para a transferência de estado do log binário falha. Como este método de transferência de estado utiliza a estrutura de replicação existente do MySQL, é possível que alguns erros transitórios possam causar erros nos fios do receptor ou do aplicável.

* Erros na operação de clonagem remota* - A operação de clonagem remota falha ou é interrompida antes de ser concluída.

* *O doador sai do grupo* - O doador sai do grupo, ou a replicação do grupo é interrompida no doador, enquanto a transferência de estado está em andamento.

A tabela do Schema de Desempenho `replication_applier_status_by_worker` exibe o erro que causou a última tentativa. Nestas situações, a nova conexão após o erro é realizada com um novo doador candidato. Selecionar um doador diferente no caso de um erro significa que há uma chance de o novo doador candidato não ter o mesmo erro. Se o plugin de clone estiver instalado, a Replicação em Grupo tenta uma operação de clonagem remota com cada um dos doadores adequados que suportam clonagem online primeiro. Se todas essas tentativas falharem, a Replicação em Grupo tenta uma transferência de estado do log binário com todos os doadores adequados, em ordem, se isso for possível.

Aviso

Para uma operação de clonagem remota, os espaços de tabela e os dados criados pelo usuário no membro receptor (o membro que realiza a junção) são eliminados antes de começar a operação de clonagem remota para transferir os dados do doador. Se a operação de clonagem remota começar, mas não for concluída, o membro que realiza a junção pode ficar com um conjunto parcial de seus arquivos de dados originais ou sem dados do usuário. Os dados transferidos pelo doador são removidos do receptor se a operação de clonagem for interrompida antes de os dados serem totalmente clonados. Essa situação pode ser corrigida tentando novamente a operação de clonagem, o que a Replicação em Grupo faz automaticamente.

Nas situações a seguir, o processo de recuperação distribuída não pode ser concluído e o membro que está se juntando deixa o grupo:

*Transações excluídas* - As transações que são exigidas pelo membro que se junta não estão presentes nos arquivos de registro binário de nenhum membro do grupo online, e os dados não podem ser obtidos por uma operação de clonagem remota (porque o plugin de clonagem não está instalado ou porque a clonagem foi tentada com todos os possíveis doadores, mas falhou). O membro que se junta, portanto, não consegue acompanhar o grupo.

* *Transações extras* - O membro que está se juntando já contém algumas transações que não estão presentes no grupo. Se uma operação de clonagem remota foi realizada, essas transações seriam excluídas e perdidas, porque o diretório de dados no membro que está se juntando é apagado. Se a transferência de estado de um log binário de um doador foi realizada, essas transações poderiam entrar em conflito com as transações do grupo. Para obter conselhos sobre como lidar com essa situação, consulte Transações extras.

*Limite de tentativas de conexão atingido* - O membro que está se conectando fez todas as tentativas de conexão permitidas pelo limite de tentativas de conexão. Você pode configurar isso usando a variável de sistema `group_replication_recovery_retry_count` (consulte Seção 20.5.4.3, “Configurando a Recuperação Distribuída”).

*Sem mais doadores* - O membro associado tentou sem sucesso uma operação de clonagem remota com cada um dos doadores online que apoiam o clone, em ordem (se o plugin de clonagem estiver instalado), e, em seguida, tentou sem sucesso a transferência de estado do log binário com cada um dos doadores online adequados, se possível.

* O membro que se junta sai do grupo * - O membro que se junta sai do grupo ou a Replicação do Grupo é interrompida no membro que se junta, enquanto a transferência de estado está em andamento.

Se o membro que se juntou tiver saído do grupo sem intenção, ou em qualquer situação listada acima, exceto na última, procede-se a realizar a ação especificada pela variável de sistema `group_replication_exit_state_action`.

#### 20.5.4.5 Como funciona a recuperação distribuída

Quando o processo de recuperação distribuída do Replicação em Grupo está realizando a transferência de estado do log binário, para sincronizar o membro que está se juntando com o doador até um ponto específico no tempo, o membro que está se juntando e o doador utilizam GTIDs (ver Seção 19.1.3, “Replicação com Identificadores Globais de Transação”). No entanto, os GTIDs apenas fornecem um meio para perceber quais transações o membro que está se juntando está faltando. Eles não ajudam a marcar um ponto específico no tempo para o qual o servidor que está se juntando ao grupo deve se atualizar, nem transmitem informações de certificação. Esse é o trabalho dos marcadores de visão do log binário, que marcam as mudanças de visão no fluxo do log binário e também contêm informações de metadados adicionais, fornecendo ao membro que está se juntando os dados relacionados à certificação que estão faltando.

Este tópico explica o papel das mudanças de visão e o identificador de mudança de visão, bem como os passos para realizar a transferência de estado do log binário.

Visualizar e Visualizar Alterações

Uma *visão* corresponde a um grupo de membros que participam ativamente na configuração atual, em outras palavras, em um ponto específico no tempo. Eles estão funcionando corretamente e online no grupo.

Uma *mudança de visão* ocorre quando há uma modificação na configuração do grupo, como a adesão ou saída de um membro. Qualquer mudança na associação do grupo resulta em uma mudança de visão independente comunicada a todos os membros no mesmo ponto lógico de tempo.

Um *identificador de visualização* identifica de forma única uma visualização. Ele é gerado sempre que ocorre uma mudança na visualização.

Na camada de comunicação de grupo, visualize as mudanças com seus identificadores de visualização associados, marcando os limites entre os dados trocados antes e depois de um membro se juntar. Esse conceito é implementado por meio de um evento de registro binário: o "evento de registro de mudança de visualização" (VCLE). O identificador de visualização é registrado para demarcar as transações transmitidas antes e depois de ocorrerem as mudanças na adesão do grupo.

O próprio identificador de visão é composto por duas partes: uma parte gerada aleatoriamente e um número inteiro monotinicamente crescente. A parte gerada aleatoriamente é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. O número é incrementado toda vez que ocorre uma mudança na visão. Utilizar essas duas partes diferentes permite que o identificador de visão identifique mudanças incrementais no grupo causadas por membros que se juntam ou deixam, e também identifique a situação em que todos os membros deixam o grupo em um desligamento completo do grupo, de modo que não permaneça nenhuma informação sobre qual visão o grupo estava. Gerar aleatoriamente parte do identificador quando o grupo é iniciado desde o início garante que os marcadores de dados no log binário permaneçam únicos e que um identificador idêntico não seja reutilizado após um desligamento completo do grupo, pois isso causaria problemas com a recuperação distribuída no futuro.

##### Início: Grupo estável

Todos os servidores estão online e processando transações recebidas do grupo. Alguns servidores podem estar um pouco atrasados em termos de transações replicadas, mas eventualmente convergem. O grupo atua como um banco de dados distribuído e replicado.

**Figura 20.8 Grupo estável**

![Servers S1, S2, and S3 are members of the group. The most recent item in all of their binary logs is transaction T20.](images/gr-recovery-1.png)

Visualizar Alteração: um Membro se junta

Sempre que um novo membro se junta ao grupo e, portanto, uma mudança de visão é realizada, cada servidor online coloca um evento de registro de mudança de visão para execução. Isso é colocado em fila porque, antes da mudança de visão, várias transações podem ser colocadas na fila no servidor para serem aplicadas e, como tal, pertencem à visão antiga. A colocação do evento de mudança de visão após elas garante uma marcação correta de quando isso aconteceu.

Enquanto isso, o membro associado seleciona um doador adequado da lista de servidores online, conforme declarado pelo serviço de associação através da abstração de visualização. Um membro se associa na visualização 4 e os membros online escrevem um evento de alteração de visualização no log binário.

**Figura 20.9 Um Membro se Junta**

![Server S4 joins the group and looks for a donor. Servers S1, S2, and S3 each queue the view change entry VC4 for their binary logs. Meanwhile, server S1 is receiving new transaction T21.](images/gr-recovery-2.png)

##### Transmissão Estadual: Atingindo o Desempenho
(A tradução do texto em inglês para o português brasileiro foi feita automaticamente e pode ter algumas imperfeições)

Se os membros do grupo e o membro que está se juntando estiverem configurados com o plugin de clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e a diferença nas transações entre o membro que está se juntando e o grupo exceder o limite definido para uma operação de clonagem remota (`group_replication_clone_threshold`, a Replicação do Grupo começa a recuperação distribuída com uma operação de clonagem remota. Uma operação de clonagem remota também é realizada se as transações necessárias não estiverem mais presentes nos arquivos de log binário de nenhum membro do grupo. Durante uma operação de clonagem remota, os dados existentes no membro que está se juntando são removidos e substituídos por uma cópia dos dados do doador. Quando a operação de clonagem remota estiver concluída e o membro que está se juntando tiver sido reiniciado, a transferência de estado de um log binário de um doador é realizada para obter as transações que o grupo aplicou enquanto a operação de clonagem remota estava em andamento. Se não houver uma grande lacuna de transações ou se o plugin de clonagem não estiver instalado, a Replicação do Grupo procede diretamente à transferência de estado de um log binário de um doador.

Para a transferência de estado de um log binário de um doador, uma conexão é estabelecida entre o membro que está se juntando e o doador e a transferência de estado começa. Essa interação com o doador continua até que o servidor que está se juntando ao fio de aplicação do grupo processa o evento do log de alteração de visão que corresponde à alteração de visão que é acionada quando o servidor que está se juntando ao grupo entra no grupo. Em outras palavras, o servidor que está se juntando ao grupo replica do doador, até chegar ao marcador com o identificador de visão que corresponde ao marcador de visão em que ele já está.

**Figura 20.10 Transmissão do Estado: Acompanhamento**

![Server S4 has chosen server S2 as the donor. State transfer is executed from server S2 to server S4 until the view change entry VC4 is reached (view_id = VC4). Server S4 uses a temporary applier buffer for state transfer, and its binary log is currently empty.](images/gr-recovery-3.png)

Como os identificadores de visualização são transmitidos a todos os membros do grupo no mesmo momento lógico, o servidor que se junta ao grupo sabe em qual identificador de visualização deve parar de replicar. Isso evita cálculos complexos de conjunto GTID, pois o identificador de visualização marca claramente quais dados pertencem a cada visualização do grupo.

Enquanto o servidor que se junta ao grupo está replicando a partir do doador, ele também está cacheando transações recebidas do grupo. Eventualmente, ele para de replicar a partir do doador e passa a aplicar as que estão cacheadas.

**Figura 20.11 Transações em fila**

![State transfer is complete. Server S4 has applied the transactions up to T20 and written them to its binary log. Server S4 has cached transaction T21, which arrived after the view change, in a temporary applier buffer while recovering.](images/gr-recovery-4.png)

##### Finalizado: Achado de Pela Máquina

Quando o servidor que está se juntando ao grupo reconhece um evento de registro de alterações de visão com o identificador de visão esperado, a conexão com o doador é terminada e ele começa a aplicar as transações armazenadas. Embora atue como um marcador no log binário, delimitando as alterações de visão, o evento de registro de alterações de visão também desempenha outro papel. Ele transmite as informações de certificação percebidas por todos os servidores quando o servidor que está se juntando ao grupo entra no grupo, em outras palavras, a última alteração de visão. Sem ele, o servidor que está se juntando ao grupo não teria as informações necessárias para ser capaz de certificar (detectar conflitos) as transações subsequentes.

A duração do acréscimo não é determinada, pois depende da carga de trabalho e da taxa de transações recebidas pelo grupo. Esse processo é completamente online e o servidor que se junta ao grupo não bloqueia nenhum outro servidor do grupo enquanto está realizando o acréscimo. Portanto, o número de transações que o servidor que se junta ao grupo está atrasado ao passar para essa fase pode, por essa razão, variar e, assim, aumentar ou diminuir de acordo com a carga de trabalho.

Quando o servidor que se junta ao grupo atinge zero transações em fila e seus dados armazenados são iguais aos dos outros membros, seu estado público muda para online.

**Figura 20.12 Instância Online**

![Server S4 is now an online member of the group. It has applied cached transaction T21, so its binary log shows the same items as the binary logs of the other group members, and it no longer needs the temporary applier buffer. New incoming transaction T22 is now received and applied by all group members.](images/gr-recovery-5.png)

### 20.5.5 Suporte para IPv6 e para grupos mistos de IPv6 e IPv4

A partir do MySQL 8.0.14, os membros do grupo de replicação de grupo podem usar endereços IPv6 como alternativa aos endereços IPv4 para comunicações dentro do grupo. Para usar endereços IPv6, o sistema operacional no host do servidor e a instância do MySQL Server devem ser configurados para suportar IPv6. Para obter instruções sobre como configurar o suporte IPv6 para uma instância de servidor, consulte a Seção 7.1.13, “Suporte IPv6”.

Os endereços IPv6 ou nomes de host que os resolvem podem ser especificados como o endereço de rede que o membro fornece na opção `group_replication_local_address` para conexões de outros membros. Quando especificados com um número de porta, um endereço IPv6 deve ser especificado entre colchetes, por exemplo:

```
group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O endereço de rede ou o nome de host especificado em `group_replication_local_address` é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Se um nome de host especificado como o endereço local do Grupo de Replicação de uma instância de servidor resolver tanto um endereço IPv4 quanto um IPv6, o endereço IPv4 é sempre usado para conexões do Grupo de Replicação. O endereço ou nome de host especificado como o endereço local do Grupo de Replicação não é o mesmo que o host e a porta do protocolo SQL do servidor MySQL, e não é especificado na variável de sistema `bind_address` para a instância do servidor. Para o propósito de permissões de endereço IP para o Grupo de Replicação (ver Seção 20.6.4, “Permissões de Endereço IP do Grupo de Replicação”), o endereço que você especifica para cada membro do grupo em `group_replication_local_address` deve ser adicionado à lista para a variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist` nas outras servidores do grupo de replicação.

Um grupo de replicação pode conter uma combinação de membros que apresentam uma endereço IPv6 como seu endereço local de replicação do grupo, e membros que apresentam um endereço IPv4. Quando um servidor se junta a tal grupo misto, ele deve fazer o contato inicial com o membro inicial usando o protocolo que o membro inicial anuncia na opção `group_replication_group_seeds`, seja IPv4 ou IPv6. Se algum dos membros iniciais do grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6 quando um membro que se junta tem um endereço local de replicação do grupo IPv4, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro que se junta para o protocolo requerido (ou um nome de host que resolva a um endereço para esse protocolo). Se um membro que se junta não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. O endereço alternativo ou o nome de host só precisa ser adicionado à variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist` nos outros servidores do grupo de replicação, não ao valor `group_replication_local_address` para o membro que se junta (que só pode conter um único endereço).

Por exemplo, o servidor A é um membro inicial para um grupo e tem as seguintes configurações de configuração para Replicação de grupo, de modo que ele esteja anunciando um endereço IPv6 na opção `group_replication_group_seeds`:

```
group_replication_bootstrap_group=on
group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
group_replication_group_seeds= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O servidor B é um membro de junção para o grupo e tem as seguintes configurações de configuração para Replicação de grupo, de modo que ele tenha um endereço local de Replicação de grupo IPv4:

```
group_replication_bootstrap_group=off
group_replication_local_address= "203.0.113.21:33061"
group_replication_group_seeds= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O servidor B também tem um endereço IPv6 alternativo `2001:db8:8b0:40:3d9c:cc43:e006:19e8`. Para que o servidor B se junte ao grupo com sucesso, tanto seu endereço local de replicação de grupo IPv4 quanto seu endereço IPv6 alternativo devem estar listados na lista de permissão do servidor A, como no exemplo a seguir:

```
group_replication_ip_allowlist=
"203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,
2001:db8:8b0:40:3d9c:cc43:e006:19e8"
```

Como uma prática recomendada para permissões de endereço IP de replicação de grupo, o servidor B (e todos os outros membros do grupo) deve ter a mesma lista de permissão do servidor A, a menos que os requisitos de segurança exijam o contrário.

Se algum ou todos os membros de um grupo de replicação estiverem usando uma versão do MySQL Server mais antiga que não suporte o uso de endereços IPv6 para Replicação de Grupo, um membro não pode participar do grupo usando um endereço IPv6 (ou um nome de host que resolva um) como seu endereço local de Replicação de Grupo. Isso se aplica tanto ao caso em que pelo menos um membro existente usa um endereço IPv6 e um novo membro que não suporta isso tenta se juntar, quanto ao caso em que um novo membro tenta se juntar usando um endereço IPv6, mas o grupo inclui pelo menos um membro que não suporta isso. Em cada situação, o novo membro não pode se juntar. Para fazer com que um membro que está se juntando apresente um endereço IPv4 para comunicações de grupo, você pode alterar o valor de `group_replication_local_address` para um endereço IPv4, ou configurar seu DNS para resolver o nome de host existente do membro que está se juntando para um endereço IPv4. Após ter atualizado todos os membros do grupo para uma versão do MySQL Server que suporte IPv6 para Replicação de Grupo, você pode alterar o valor de `group_replication_local_address` para cada membro para um endereço IPv6, ou configurar seu DNS para apresentar um endereço IPv6. A alteração do valor de `group_replication_local_address` só tem efeito quando você para e reinicia a Replicação de Grupo.

As endereços IPv6 também podem ser usados como pontos finais de recuperação distribuídos, que podem ser especificados no MySQL 8.0.21 e versões posteriores usando a variável de sistema `group_replication_advertise_recovery_endpoints`. As mesmas regras se aplicam aos endereços usados nesta lista. Veja a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”.

### 20.5.6 Usando o MySQL Enterprise Backup com Replicação de Grupo

O MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com a [MySQL Enterprise Edition][(https://www.mysql.com/products/enterprise/)]. Esta seção explica como fazer um backup e, posteriormente, restaurar um membro da Replicação de Grupo usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo membro a um grupo.

#### Fazer backup de um membro da replicação de grupo usando o MySQL Enterprise Backup

Fazer backup de um membro da Replicação de Grupo é semelhante a fazer backup de uma instância MySQL independente. As instruções a seguir pressupem que você já está familiarizado com o uso do MySQL Enterprise Backup para realizar um backup; se não for o caso, revise Fazer backup de um servidor de banco de dados. Além disso, observe os requisitos descritos em Conceder privilégios MySQL ao administrador de backup e Usar o MySQL Enterprise Backup com Replicação de Grupo.

Considere o seguinte grupo com três membros, `s1`, `s2` e `s3`, executando em hosts com os mesmos nomes:

```
mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
+-------------+-------------+--------------+
| member_host | member_port | member_state |
+-------------+-------------+--------------+
| s1          |        3306 | ONLINE       |
| s2          |        3306 | ONLINE       |
| s3          |        3306 | ONLINE       |
+-------------+-------------+--------------+
```

Usando o MySQL Enterprise Backup, crie um backup de `s2` emitindo em seu host, por exemplo, a seguinte declaração:

```
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Notas

* *Para o MySQL Enterprise Backup 8.0.18 e versões anteriores,* Se a variável de sistema `sql_require_primary_key` estiver definida como `ON` para o grupo, o MySQL Enterprise Backup não consegue registrar o progresso do backup nos servidores. Isso ocorre porque a tabela `backup_progress` no servidor é uma tabela CSV, para a qual as chaves primárias não são suportadas. Nesse caso, o **mysqlbackup** emite os seguintes avisos durante a operação de backup:

  ```
  181011 11:17:06 MAIN WARNING: MySQL query 'CREATE TABLE IF NOT EXISTS
  mysql.backup_progress( `backup_id` BIGINT NOT NULL, `tool_name` VARCHAR(4096)
  NOT NULL, `error_code` INT NOT NULL, `error_message` VARCHAR(4096) NOT NULL,
  `current_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP               ON
  UPDATE CURRENT_TIMESTAMP,`current_state` VARCHAR(200) NOT NULL ) ENGINE=CSV
  DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin': 3750, Unable to create a table
  without PK, when system variable 'sql_require_primary_key' is set. Add a PK
  to the table or unset this variable to avoid this message. Note that tables
  without PK can cause performance problems in row-based replication, so please
  consult your DBA before changing this setting.
  181011 11:17:06 MAIN WARNING: This backup operation's progress info cannot be
  logged.
  ```

Isso não impede que o **mysqlbackup** complete o backup.

*Para o MySQL Enterprise Backup 8.0.20 e versões anteriores*, ao fazer um backup de um membro secundário, pois o MySQL Enterprise Backup não pode escrever o status e os metadados do backup em uma instância do servidor somente leitura, ele pode emitir avisos semelhantes ao seguinte durante a operação de backup:

  ```
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

Você pode evitar o aviso usando a opção `--no-history-logging` com seu comando de backup. Isso não é um problema para o MySQL Enterprise Backup 8.0.21 e versões posteriores — consulte o uso do MySQL Enterprise Backup com Replicação de Grupo para obter detalhes.

#### Restaurando um Membro Falhado

Suponha que um dos membros (`s3` no exemplo a seguir) esteja irreconciliavelmente corrompido. O backup mais recente do membro do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são ambos servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

1. Parar o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

2. Preserve os dois arquivos de configuração no diretório de dados do servidor danificado, `auto.cnf` e `mysqld-auto.cnf` (se existir), copiando-os para um local seguro fora do diretório de dados. Isso é necessário para preservar o UUID do servidor e a Seção 7.1.9.3, “Variáveis de sistema persistidas” (se utilizada), que são necessárias nos passos abaixo.

3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para quaisquer diretórios que não sejam o diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falhará.

4. Restaure o backup de `s2` no host para `s3`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

Nota

O comando acima assume que os logs binários e os logs de relevo nos `s2` e `s3` têm o mesmo nome de base e estão no mesmo local nos dois servidores. Se essas condições não forem atendidas, você deve usar as opções `--log-bin` e `--relay-log` para restaurar o log binário e o log de relevo aos seus caminhos de arquivo originais no `s3`. Por exemplo, se você sabe que no `s3` o nome de base do log binário é `s3-bin` e o nome de base do log de relevo é `s3-relay-bin`, seu comando de restauração deve parecer assim:

      ```
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

Ser capaz de restaurar o log binário e o log de retransmissão para os caminhos de arquivo corretos torna o processo de restauração mais fácil; se isso for impossível por algum motivo, veja Rebuilt o membro falhado para se juntar novamente como um novo membro.

3. *Restaure o arquivo `auto.cnf` para s3.* Para se reincorporar ao grupo de replicação, o membro restaurado *deve* ter o mesmo `server_uuid` que ele usava para se juntar ao grupo antes. Forneça o UUID do servidor antigo copiando o arquivo `auto.cnf` preservado no passo 2 acima para o diretório de dados do membro restaurado.

Nota

Se você não puder fornecer o original `server_uuid` do membro falhado ao membro restaurado, restaurando seu antigo arquivo `auto.cnf`, você deve permitir que o membro restaurado se junte ao grupo como um novo membro; veja as instruções na Se reconstruir o membro falhado para se juntar como um novo membro abaixo sobre como fazer isso.

4. *Restaure o arquivo `mysqld-auto.cnf` para o s3 (apenas necessário se o s3 usou variáveis de sistema persistentes).* As configurações da Seção 7.1.9.3, “Variáveis de Sistema Persistentes”, que foram usadas para configurar o membro falhado, devem ser fornecidas ao membro restaurado. Essas configurações podem ser encontradas no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo no diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Persistentes sobre o que fazer se você não tiver uma cópia do arquivo.

5. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que utilizam systemd:

   ```
   systemctl start mysqld
   ```

Nota

Se o servidor que você está restaurando for um membro primário, realize as etapas descritas em Restaurar um membro primário *antes de iniciar o servidor restaurado*.

6. *Reinicie a Replicação de Grupo.* Conecte-se ao `s3` reiniciado, por exemplo, usando um cliente **mysql**, e execute a seguinte declaração:

   ```
   mysql> START GROUP_REPLICATION;
   ```

Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de [recuperação distribuída] do Grupo de Replicação, e o processo começa após a declaração [START GROUP_REPLICATION] (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | RECOVERING   |
   +-------------+-------------+--------------+
   ```

Isso mostra que `s3` está aplicando transações para se recuperar com o grupo. Assim que se recuperou com o resto do grupo, sua `member_state` muda para `ONLINE`:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

Nota

Se o servidor que você está restaurando for um membro primário, uma vez que tenha obtido sincronia com o grupo e se tornado `ONLINE`, realize as etapas descritas no final de Restaurar um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro já foi totalmente restaurado a partir do backup e funciona como um membro regular do grupo.

#### Reorganize o membro falhado para se juntar novamente como um novo membro

Às vezes, os passos descritos acima em Restaurar um Membro Falho não podem ser realizados porque, por exemplo, o log binário ou o log de relevo está corrompido ou simplesmente está ausente no backup. Nessa situação, use o backup para reconstruir o membro e, em seguida, adicione-o ao grupo como um novo membro. Nos passos abaixo, assumimos que o membro reconstruído é chamado `s3`, como o membro falho, e que ele funciona no mesmo host que `s3`:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são ambos servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

1. Parar o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```
      s3> systemctl stop mysqld
      ```

2. Preserve o arquivo de configuração `mysqld-auto.cnf`, se ele for encontrado no diretório de dados do servidor corrompido, copiando-o para um local seguro fora do diretório de dados. Isso é para preservar a Seção 7.1.9.3, “Variáveis de sistema persistidas”, do servidor, que são necessárias posteriormente.

3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```
      s3> rm -rf /var/lib/mysql/*
      ```

Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para quaisquer diretórios que não sejam o diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falha.

4. Restaure o backup de `s2` no host de `s3`. Com essa abordagem, estamos reconstruindo `s3` como um novo membro, para o qual não precisamos ou não queremos usar os logs binários e de releio antigos no backup; portanto, se esses logs tiverem sido incluídos no seu backup, exclua-os usando as opções `--skip-binlog` e `--skip-relaylog`:

      ```
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

Nota

Se você tiver logs binários saudáveis e logs de releio no backup que você pode transferir para o host de destino sem problemas, é recomendável seguir o procedimento mais fácil, conforme descrito em Restaurar um membro falhado acima.

3. *Restaure o arquivo `mysqld-auto.cnf` para o s3 (apenas necessário se o s3 usou variáveis de sistema persistentes).* As configurações da Seção 7.1.9.3, “Variáveis de Sistema Persistentes” que foram usadas para configurar o membro falhado devem ser fornecidas ao servidor restaurado. Essas configurações podem ser encontradas no arquivo `mysqld-auto.cnf` do servidor falhado, que você deve ter preservado no passo 2 acima. Restaure o arquivo para o diretório de dados do servidor restaurado. Veja Restaurar Variáveis de Sistema Persistentes sobre o que fazer se você não tiver uma cópia do arquivo.

Nota

NÃO restaure o arquivo `auto.cnf` do servidor corrompido no diretório de dados do novo membro. Quando o `s3` reconstruído se juntar ao grupo como um novo membro, ele receberá um novo UUID do servidor.

4. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que utilizam systemd:

   ```
   systemctl start mysqld
   ```

Nota

Se o servidor que você está restaurando for um membro primário, realize as etapas descritas em Restaurar um membro primário *antes de iniciar o servidor restaurado*.

5. *Reconfigurar o membro restaurado para se juntar à Replicação em Grupo.* Conecte-se ao servidor restaurado com um cliente **mysql** e redefina as informações da fonte e da replica com as seguintes declarações:

   ```
   mysql> RESET MASTER;
   ```

   ```
   mysql> RESET MASTER;
   mysql> RESET SLAVE ALL;
   ```

Em MySQL 8.0.22 e versões posteriores, use as instruções mostradas aqui:

   ```
   mysql> RESET MASTER;
   mysql> RESET REPLICA ALL;
   ```

Para que o servidor restaurado possa se recuperar automaticamente usando o mecanismo integrado da Replicação por Grupo para [recuperação distribuída][(group-replication-distributed-recovery.html "20.5.4 Distributed Recovery")], configure a variável `gtid_executed` do servidor. Para isso, use o arquivo `backup_gtid_executed.sql` incluído no backup de `s2`, que geralmente é restaurado sob o diretório de dados do membro restaurado. Desative o registro binário, use o arquivo `backup_gtid_executed.sql` para configurar `gtid_executed`, e, em seguida, reative o registro binário emitindo as seguintes declarações com seu cliente **mysql**:

   ```
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

Em seguida, configure as credenciais de usuário da [Replicação de grupo][(group-replication-user-credentials.html "20.2.1.3 User Credentials For Distributed Recovery")] no membro usando as instruções SQL mostradas aqui:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password'
   		-> FOR CHANNEL 'group_replication_recovery';
   ```

Em MySQL 8.0.23 e versões posteriores, use essas instruções:

   ```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password'
   		-> FOR CHANNEL 'group_replication_recovery';
   ```

6. *Reinicie a Replicação de Grupo.* Emite a seguinte declaração para o servidor restaurado com seu cliente **mysql**:

   ```
   mysql>> START GROUP_REPLICATION;
   ```

Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de [recuperação distribuída] do Grupo de Replicação, e o processo começa após a declaração [START GROUP_REPLICATION] (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

Isso mostra que `s3` está aplicando transações para se recuperar com o grupo. Assim que se recuperou com o resto do grupo, sua `member_state` muda para `ONLINE`:

   ```
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

Nota

Se o servidor que você está restaurando for um membro primário, uma vez que tenha obtido sincronia com o grupo e se tornado `ONLINE`, realize as etapas descritas no final de Restaurar um Membro Primário para reverter as alterações de configuração que você fez no servidor antes de iniciá-lo.

O membro foi agora restaurado ao grupo como um novo membro.

**Restauração de variáveis de sistema persistentes.** O **mysqlbackup** não oferece suporte para fazer backup ou preservar a Seção 7.1.9.3, “Variáveis de sistema persistentes” — o arquivo `mysqld-auto.cnf` não é incluído em um backup. Para iniciar o membro restaurado com suas configurações de variáveis persistentes, você precisa fazer uma das seguintes ações:

* Conserve uma cópia do arquivo `mysqld-auto.cnf` do servidor corrompido e copie-o para o diretório de dados do servidor restaurado.

* Copie o arquivo `mysqld-auto.cnf` de outro membro do grupo para o diretório de dados do servidor restaurado, se esse membro tiver as mesmas configurações de variáveis de sistema persistentes que o membro corrompido.

* Após o servidor restaurado ser iniciado e antes de você reiniciar a Replicação de Grupo, defina todas as variáveis do sistema manualmente para seus valores persistentes através de um cliente **mysql**.

**Restauração de um membro primário.** Se o membro restaurado for primário no grupo, é necessário tomar cuidado para evitar gravações no banco de dados restaurado durante o processo de recuperação distribuída de replicação de grupo. Dependendo de como o grupo é acessado pelos clientes, há a possibilidade de declarações DML serem executadas no membro restaurado assim que ele se tornar acessível na rede, antes de o membro terminar sua recuperação das atividades que perdeu ao sair do grupo. Para evitar isso, *antes de começar o servidor restaurado*, configure as seguintes variáveis de sistema no arquivo de opção do servidor:

```
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

Essas configurações garantem que o membro se torne somente de leitura no início e que o cronômetro de eventos seja desligado enquanto o membro se atualiza com o grupo durante o processo de recuperação distribuída. Também é necessário fornecer tratamento adequado de erros nos clientes, uma vez que eles não podem realizar operações DML durante esse período no membro que está sendo restaurado.

Uma vez que o processo de restauração esteja totalmente concluído e o membro restaurado esteja sincronizado com o resto do grupo, você pode reverter essas alterações. Primeiro, reinicie o cronômetro de eventos usando a declaração mostrada aqui:

```
mysql> SET global event_scheduler=ON;
```

Depois disso, você deve definir as seguintes variáveis do sistema no arquivo de opções do membro, para que eles tenham os valores necessários na próxima vez que o membro for iniciado:

```
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
