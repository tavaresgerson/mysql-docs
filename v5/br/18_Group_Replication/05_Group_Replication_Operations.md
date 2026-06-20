## 17.5 Operações de Replicação em Grupo

Esta seção descreve os diferentes modos de implantação da Replicação em Grupo, explica as operações comuns para gerenciar grupos e fornece informações sobre como ajustar seus grupos.

### 17.5.1 Implantação no Modo Multi-Primario ou Simples-Primario

A Replicação em Grupo opera nos seguintes modos diferentes:

* modo único primário
* modo multi-primário

O modo padrão é único. Não é possível ter membros do grupo implantados em diferentes modos, por exemplo, um configurado no modo multi-primário enquanto outro está no modo único. Para alternar entre os modos, o grupo, e não o servidor, precisa ser reiniciado com uma configuração operacional diferente. Independentemente do modo implantado, a Replicação de Grupo não gerencia o fail-over do lado do cliente, que deve ser gerenciado pelo próprio aplicativo, um conector ou uma estrutura de middleware, como um proxy ou MySQL Router 8.0.

Quando implantado no modo multi-primario, as declarações são verificadas para garantir que sejam compatíveis com o modo. Os seguintes verificações são feitas quando a Replicação de Grupo é implantada no modo multi-primario:

* Se uma transação for executada com o nível de isolamento SERIALIZABLE, seu commit falha ao se sincronizar com o grupo.

* Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então a transação não consegue se comprometer ao se sincronizar com o grupo.

Esses verificações podem ser desativados definindo a opção `group_replication_enforce_update_everywhere_checks` para `FALSE`. Ao implementar no modo de única primária, esta opção *deve* ser definida para `FALSE`.

#### 17.5.1.1 Modo de Primariedade Única

Nesse modo, o grupo tem um servidor primário único que está configurado no modo de leitura e escrita. Todos os outros membros do grupo estão configurados no modo de leitura apenas (com `super-read-only=ON`). Isso acontece automaticamente. O primário é tipicamente o primeiro servidor a inicializar o grupo, todos os outros servidores que se juntam automaticamente aprendem sobre o servidor primário e são configurados para leitura apenas.

**Figura 17.5 Nova eleição primária**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. Server S1 is the primary. Write clients are communicating with server S1, and a read client is communicating with server S4. Server S1 then fails, breaking communication with the write clients. Server S2 then takes over as the new primary, and the write clients now communicate with server S2.](images/single-primary-election.png)

Quando no modo de único membro primário, alguns dos controles implementados no modo de múltiplos membros primários são desativados, porque o sistema exige que apenas um servidor escreva no grupo. Por exemplo, as alterações em tabelas que possuem chaves estrangeiras em cascata são permitidas, enquanto no modo de múltiplos membros primários elas não são. Após a falha do membro primário, um mecanismo automático de eleição primária escolhe o novo membro primário. O processo de eleição é realizado verificando a nova visão e ordenando as potenciais novas primárias com base no valor de `group_replication_member_weight`. Supondo que o grupo esteja operando com todos os membros executando a mesma versão do MySQL, então o membro com o valor mais alto para `group_replication_member_weight` é eleito como o novo primário. No caso de vários servidores terem o mesmo `group_replication_member_weight`, os servidores são então priorizados com base em seu `server_uuid` em ordem lexicográfica e escolhendo o primeiro. Uma vez que um novo primário é eleito, ele é automaticamente configurado para leitura e escrita e os outros segundos são mantidos como segundos, e como tal, apenas para leitura.

Quando um novo primário é eleito, ele só pode ser escrito uma vez que tenha processado todas as transações que vieram do primário antigo. Isso evita possíveis problemas de concorrência entre as transações antigas do primário antigo e as novas que estão sendo executadas neste membro. É uma boa prática esperar que o novo primário aplique seu relay-log relacionado à replicação antes de redirecionar os aplicativos do cliente para ele.

Se o grupo estiver operando com membros que estão executando diferentes versões do MySQL, o processo de eleição pode ser impactado. Por exemplo, se qualquer membro não apoiar `group_replication_member_weight`, o primário é escolhido com base na ordem `server_uuid` dos membros da versão principal inferior. Alternativamente, se todos os membros que estão executando diferentes versões do MySQL apoiarem `group_replication_member_weight`, o primário é escolhido com base em `group_replication_member_weight` dos membros da versão principal inferior.

#### 17.5.1.2 Modo Multi-Primaria

No modo multi-primario, não há noção de um único primário. Não há necessidade de se envolver em um procedimento eleitoral, porque não há nenhum servidor desempenhando um papel especial.

**Figura 17.6 Falha no cliente**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. All of the servers are primaries. Write clients are communicating with servers S1 and S2, and a read client is communicating with server S4. Server S1 then fails, breaking communication with its write client. This client reconnects to server S3.](images/multi-primary.png)

Todos os servidores estão configurados no modo de leitura e escrita ao se juntarem ao grupo.

#### 17.5.1.3 Encontrando o Principal

O exemplo a seguir mostra como descobrir qual servidor é o principal atualmente quando está sendo implantado no modo de único principal.

```sql
mysql> SHOW STATUS LIKE 'group_replication_primary_member';
```

### 17.5.2  Recuperação de Ajuste

Sempre que um novo membro se junta a um grupo de replicação, ele se conecta a um doador adequado e recupera os dados que ele havia perdido até o ponto em que é declarado online. Esse componente crítico na Replicação em Grupo é tolerante a falhas e configurável. A seção a seguir explica como funciona a recuperação e como sintonizar as configurações

#### Seleção do doador

Um doador aleatório é selecionado entre os membros existentes online no grupo. Dessa forma, há uma boa chance de que o mesmo servidor não seja selecionado mais de uma vez quando vários membros entram no grupo.

Se a conexão com o doador selecionado falhar, uma nova conexão é automaticamente realizada com um novo doador candidato. Quando o limite de tentativa de conexão é atingido, o procedimento de recuperação é encerrado com um erro.

Nota

Um doador é escolhido aleatoriamente da lista de membros online na visualização atual.

#### Conversão Automática de Doadores Aprimorada

O outro ponto principal de preocupação na recuperação como um todo é garantir que ela lidere com falhas. Assim, o Grupo de Replicação oferece mecanismos robustos de detecção de erros. Em versões anteriores do Grupo de Replicação, ao tentar acessar um doador, a recuperação só conseguia detectar erros de conexão devido a problemas de autenticação ou algum outro problema. A reação a tais cenários problemáticos era mudar para um novo doador, assim uma nova tentativa de conexão era feita para um membro diferente.

Esse comportamento foi estendido para cobrir outros cenários de falha:

*Cenários de dados excluídos* - Se o doador selecionado contiver alguns dados excluídos que são necessários para o processo de recuperação, ocorrerá um erro. A recuperação detecta esse erro e um novo doador é selecionado.

*Dados duplicados* - Se um servidor que está se juntando ao grupo já contém alguns dados que entram em conflito com os dados provenientes do doador selecionado durante a recuperação, então ocorre um erro. Isso pode ser causado por algumas transações errôneas presentes no servidor que está se juntando ao grupo.

Pode-se argumentar que a recuperação deve falhar em vez de mudar para outro doador, mas em grupos heterogêneos há a chance de outros membros compartilharem as transações conflitantes e outros não. Por esse motivo, em caso de erro, a recuperação seleciona outro doador do grupo.

* *Outros erros* - Se qualquer um dos fios de recuperação falhar (os fios do receptor ou do aplicador falharem), então ocorre um erro e a recuperação passa para um novo doador.

Nota

Em caso de falhas persistentes ou até mesmo transitórias, a recuperação automaticamente tenta se conectar novamente ao mesmo ou a um novo doador.

#### Tentativas de Conexão com Doadores

A transferência de dados de recuperação depende do log binário e do quadro de replicação existente do MySQL, portanto, é possível que alguns erros transitórios possam causar erros nos threads do receptor ou do aplicável. Nesses casos, o processo de transferência de dados do doador tem uma funcionalidade de tentativa, semelhante àquela encontrada na replicação regular.

#### Número de tentativas

O número de tentativas que um servidor faz ao tentar se conectar a um doador do grupo é de 10. Isso é configurado através da variável do plugin `group_replication_recovery_retry_count`. O seguinte comando define o número máximo de tentativas para se conectar a um doador em 10.

```sql
mysql> SET GLOBAL group_replication_recovery_retry_count= 10;
```

Observe que isso representa o número global de tentativas que o servidor que se junta ao grupo faz para se conectar a cada um dos doadores adequados.

#### Rotinas de sono

A variável do plugin `group_replication_recovery_reconnect_interval` define quanto tempo o processo de recuperação deve dormir entre as tentativas de conexão do doador. Essa variável tem seu valor padrão definido como 60 segundos e você pode alterar esse valor dinamicamente. O seguinte comando define o intervalo de tentativa de conexão do doador de recuperação para 120 segundos.

```sql
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Observe, no entanto, que a recuperação não dorme após cada tentativa de conexão do doador. Como o servidor que se junta ao grupo está se conectando a servidores diferentes e não ao mesmo deles várias vezes, ele pode assumir que o problema que afeta o servidor A não afeta o servidor B. Assim, a recuperação suspende apenas quando ela passou por todos os possíveis doadores. Uma vez que o servidor que se junta ao grupo tentou se conectar a todos os doadores adequados no grupo e nenhum deles permanece, o processo de recuperação dorme por o número de segundos configurados pela variável `group_replication_recovery_reconnect_interval`.

### 17.5.3 Partição de rede

O grupo precisa alcançar consenso sempre que uma mudança que precisa ser replicada acontece. Este é o caso de transações regulares, mas também é necessário para mudanças de membros do grupo e algumas mensagens internas que mantêm o grupo consistente. O consenso exige que a maioria dos membros do grupo concorde em uma decisão dada. Quando a maioria dos membros do grupo é perdida, o grupo não consegue progredir e fica bloqueado porque não consegue garantir maioria ou quórum.

O quórum pode ser perdido quando há múltiplos falhas involuntárias, fazendo com que a maioria dos servidores seja removida abruptamente do grupo. Por exemplo, em um grupo de 5 servidores, se 3 deles se tornarem silenciosos de uma vez, a maioria é comprometida e, portanto, não pode ser alcançado nenhum quórum. De fato, os dois restantes não são capazes de dizer se os outros 3 servidores falharam ou se uma partição de rede isolou esses 2 sozinhos e, portanto, o grupo não pode ser reconfigurado automaticamente.

Por outro lado, se os servidores saem do grupo voluntariamente, eles instruem o grupo a se reconfi gurar. Na prática, isso significa que um servidor que está saindo diz aos outros que está indo embora. Isso significa que outros membros podem reconfi gurar o grupo corretamente, a consistência da adesão é mantida e a maioria é recalculada. Por exemplo, no cenário acima de 5 servidores onde 3 saem de uma vez, se os 3 servidores que estão saindo avisam o grupo que estão indo embora, um a um, então a adesão é capaz de se ajustar de 5 para 2, e ao mesmo tempo, garantindo o quórum enquanto isso acontece.

Nota

A perda de quórum é, por si só, um efeito colateral do mau planejamento. Planeje o tamanho do grupo para o número de falhas esperadas (independentemente de serem consecutivas, ocorrerem todas de uma vez ou sejam esporádicas).

As seções a seguir explicam o que fazer se o sistema for particionado de tal forma que nenhum quórum seja automaticamente alcançado pelos servidores do grupo.

Dica

Um primário que foi excluído de um grupo após uma perda por maioria seguida por uma reconfiguração pode conter transações extras que não estão incluídas no novo grupo. Se isso acontecer, a tentativa de adicionar o membro excluído do grupo resulta em um erro com a mensagem "Este membro tem mais transações executadas do que as presentes no grupo".

#### Detectando Partições

A tabela do esquema de desempenho `replication_group_members` apresenta o status de cada servidor na visão atual sob a perspectiva desse servidor. Na maioria das vezes, o sistema não enfrenta partições, e, portanto, a tabela exibe informações consistentes em todos os servidores do grupo. Em outras palavras, o status de cada servidor nesta tabela é acordado por todos na visão atual. No entanto, se houver partição de rede e o quórum for perdido, a tabela exibe o status `UNREACHABLE` para os servidores que não consegue contactar. Essas informações são exportadas pelo detector de falha local integrado na Replicação de Grupo.

**Figura 17.7 Perda de Quórum**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group, which is a stable group. When three of the servers, S3, S4, and S5, fail, the majority is lost and the group can no longer proceed without intervention.](images/gr-majority-lost.png)

Para entender esse tipo de partição de rede, a seção a seguir descreve um cenário em que inicialmente há 5 servidores trabalhando corretamente juntos, e as mudanças que então ocorrem no grupo, uma vez que apenas 2 servidores estão online. O cenário é representado na figura.

Assim, vamos assumir que há um grupo com esses 5 servidores:

* Servidor s1 com o identificador do membro `199b2df7-4aaf-11e6-bb16-28b2bd168d07`

* Servidor s2 com identificador de membro `199bb88e-4aaf-11e6-babe-28b2bd168d07`

* Servidor s3 com identificador de membro `1999b9fb-4aaf-11e6-bb54-28b2bd168d07`

* Servidor s4 com identificador de membro `19ab72fc-4aaf-11e6-bb51-28b2bd168d07`

* Servidor s5 com identificador de membro `19b33846-4aaf-11e6-ba81-28b2bd168d07`

Inicialmente, o grupo está funcionando bem e os servidores estão comunicando-se felizmente entre si. Você pode verificar isso ao fazer login no s1 e olhar para a tabela do esquema de desempenho `replication_group_members`. Por exemplo:

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE, MEMBER_ROLE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+-------------+
| MEMBER_ID                            | MEMBER_STATE |-MEMBER_ROLE |
+--------------------------------------+--------------+-------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | ONLINE       | SECONDARY   |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       | PRIMARY     |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | ONLINE       | SECONDARY   |
+--------------------------------------+--------------+-------------+
```

No entanto, momentos depois, ocorre uma falha catastrófica e os servidores s3, s4 e s5 param inesperadamente. Alguns segundos depois, ao olhar novamente na tabela `replication_group_members` em s1, verifica-se que ela ainda está online, mas vários outros membros não estão. De fato, como visto abaixo, eles são marcados como `UNREACHABLE`. Além disso, o sistema não conseguiu se reconectar para alterar a filiação, porque a maioria foi perdida.

```sql
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

**Figura 17.8 Forçando uma nova adesão**

![Three of the servers in a group, S3, S4, and S5, have failed, so the majority is lost and the group can no longer proceed without intervention. With the intervention described in the following text, S1 and S2 are able to form a stable group by themselves.](images/gr-majority-lost-to-stable-group.png)

Suponha que você esteja de volta à situação em que s1 e s2 são os únicos servidores restantes no grupo. Os servidores s3, s4 e s5 saíram do grupo de forma inesperada. Para fazer com que os servidores s1 e s2 continuem, você deseja forçar uma configuração de associação que contenha apenas s1 e s2.

Aviso

Este procedimento utiliza `group_replication_force_members` e deve ser considerado um remédio de último recurso. Deve ser usado com extremo cuidado e apenas para perda excessiva de quórum. Se usado de forma incorreta, pode criar um cenário de cérebro artificialmente dividido ou bloquear o sistema como um todo.

Lembre-se de que o sistema está bloqueado e a configuração atual é a seguinte (contada pelo detector de falha local em s1):

```sql
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

```sql
mysql> SELECT @@group_replication_local_address;
```

Uma vez que você conheça os endereços de comunicação de grupo de s1 (`127.0.0.1:10000`) e s2 (`127.0.0.1:10001`), você pode usar isso em um dos dois servidores para injetar uma nova configuração de membros, substituindo assim a existente que perdeu o quórum. Para fazer isso em s1:

```sql
mysql> SET GLOBAL group_replication_force_members="127.0.0.1:10000,127.0.0.1:10001";
```

Isso desbloqueia o grupo ao forçar uma configuração diferente. Verifique `replication_group_members` em ambos os s1 e s2 para verificar a filiação do grupo após essa alteração. Primeiro no s1.

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

E depois no s2.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

Ao forçar uma nova configuração de membro, certifique-se de que todos os servidores que serão forçados a sair do grupo estão de fato desligados. No cenário descrito acima, se s3, s4 e s5 não forem realmente inacessíveis, mas sim estar online, eles podem ter formado sua própria partição funcional (eles são 3 em 5, portanto, têm a maioria). Nesse caso, forçar uma lista de membros do grupo com s1 e s2 pode criar uma situação de cérebro artificial. Portanto, é importante, antes de forçar uma nova configuração de membro, garantir que os servidores que serão excluídos estejam de fato desligados e, se não estiverem, desligue-os antes de prosseguir.

Depois de ter usado a variável de sistema `group_replication_force_members` para forçar com sucesso uma nova adesão ao grupo e desbloquear o grupo, certifique-se de limpar a variável de sistema. `group_replication_force_members` deve estar vazio para emitir uma declaração `START GROUP_REPLICATION`.

### 17.5.4 Reiniciando um Grupo

A Replicação em Grupo é projetada para garantir que o serviço de banco de dados esteja continuamente disponível, mesmo que alguns dos servidores que formam o grupo não estejam atualmente em condições de participar, devido a manutenção planejada ou problemas não planejados. Enquanto os membros restantes representarem a maioria do grupo, eles podem eleger um novo primário e continuar a funcionar como um grupo. No entanto, se todos os membros de um grupo de replicação deixarem o grupo e a Replicação em Grupo for interrompida em todos os membros por uma declaração `STOP GROUP_REPLICATION` ou desligamento do sistema, o grupo agora existe apenas teoricamente, como uma configuração nos membros. Nessa situação, para recriar o grupo, ele deve ser iniciado como se estivesse sendo iniciado pela primeira vez.

A diferença entre iniciar um grupo pela primeira vez e fazer isso pela segunda ou em momentos subsequentes é que, na última situação, os membros de um grupo que foi encerrado podem ter conjuntos de transações diferentes uns dos outros, dependendo da ordem em que foram interrompidos ou falharam. Um membro não pode se juntar a um grupo se tiver transações que não estão presentes nos outros membros do grupo. Para a Replicação de Grupo, isso inclui tanto as transações que foram comprometidas e aplicadas, que estão no conjunto de GTID `gtid_executed`, quanto as transações que foram certificadas, mas ainda não aplicadas, que estão no canal `group_replication_applier`. Um membro de grupo de Replicação de Grupo nunca remove uma transação que foi certificada, o que é uma declaração da intenção do membro de comprometer a transação.

O grupo de replicação deve, portanto, ser reiniciado a partir do membro mais atualizado, ou seja, do membro que tem mais transações executadas e certificadas. Os membros com menos transações podem então se juntar e recuperar as transações que estão faltando por meio de recuperação distribuída. Não é correto assumir que o último membro primário conhecido do grupo é o membro mais atualizado do grupo, porque um membro que foi desligado mais tarde que o primário pode ter mais transações. Portanto, você deve reiniciar cada membro para verificar as transações, comparar todos os conjuntos de transações e identificar o membro mais atualizado. Esse membro pode então ser usado para iniciar o grupo.

Siga este procedimento para reiniciar um grupo de replicação com segurança após cada membro ser desligado.

1. Por vez, para cada membro do grupo, em qualquer ordem:

1. Conecte um cliente ao membro do grupo. Se a Replicação de grupo ainda não tiver sido interrompida, emita uma declaração `STOP GROUP_REPLICATION` e espere a interrupção da Replicação de grupo.

2. Editar o arquivo de configuração do servidor MySQL (tipicamente denominado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows) e definir a variável do sistema `group_replication_start_on_boot=OFF`. Esta configuração impede que a Replicação de Grupo seja iniciada quando o servidor MySQL é iniciado, o que é o padrão.

Se você não puder alterar essa configuração no sistema, pode simplesmente permitir que o servidor tente iniciar a Replicação de Grupo, que falhará porque o grupo foi totalmente desligado e ainda não foi iniciado. Se você adotar essa abordagem, não defina `group_replication_bootstrap_group=ON` em nenhum servidor nesta fase.

3. Inicie a instância do servidor MySQL e verifique se a Replicação de Grupo não foi iniciada (ou se não conseguiu iniciar). Não inicie a Replicação de Grupo nesta etapa.

4. Coleta as seguintes informações do membro do grupo:

* O conteúdo do conjunto de GTID `gtid_executed`. Você pode obtê-lo emitindo a seguinte declaração:

        ```sql
        mysql> SELECT @@GLOBAL.GTID_EXECUTED
        ```

* O conjunto de transações certificadas no canal `group_replication_applier`. Você pode obtê-lo emitindo a seguinte declaração:

        ```sql
        mysql> SELECT received_transaction_set FROM \
                performance_schema.replication_connection_status WHERE \
                channel_name="group_replication_applier";
        ```

2. Quando você tiver coletado os conjuntos de transações de todos os membros do grupo, compare-os para descobrir qual membro tem o maior conjunto de transações no geral, incluindo as transações executadas (`gtid_executed`) e as transações certificadas (no canal `group_replication_applier`). Você pode fazer isso manualmente, olhando para os GTIDs, ou pode comparar os conjuntos de GTID usando funções armazenadas, conforme descrito na Seção 16.1.3.7, “Exemplos de Função Armazenada para Manipular GTIDs”.

3. Use o membro que tem o maior conjunto de transações para iniciar o grupo, conectando um cliente ao membro do grupo e emitindo as seguintes declarações:

   ```sql
   mysql> SET GLOBAL group_replication_bootstrap_group=ON;
   mysql> START GROUP_REPLICATION;
   mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
   ```

É importante não armazenar o ajuste `group_replication_bootstrap_group=ON` no arquivo de configuração, caso contrário, quando o servidor for reiniciado novamente, um segundo grupo com o mesmo nome será criado.

4. Para verificar se o grupo agora existe com esse membro fundador, emita essa declaração sobre o membro que o iniciou:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

5. Adicione cada um dos outros membros de volta ao grupo, em qualquer ordem, emitindo uma declaração `START GROUP_REPLICATION` sobre cada um deles:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

6. Para verificar se cada membro se juntou ao grupo, emita esta declaração sobre qualquer membro:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

7. Quando os membros se reunirem novamente no grupo, se tiverem editado seus arquivos de configuração para definir `group_replication_start_on_boot=OFF`, poderão editá-los novamente para definir `ON` (ou remover a variável do sistema, uma vez que `ON` é a opção padrão).

### 17.5.5 Usando o MySQL Enterprise Backup com Replicação de Grupo

O MySQL Enterprise Backup é um utilitário de backup com licença comercial para o MySQL Server, disponível com [MySQL Enterprise Edition][(https://www.mysql.com/products/enterprise/)]. Esta seção explica como fazer um backup e, posteriormente, restaurar um membro da Replicação de Grupo usando o MySQL Enterprise Backup. A mesma técnica pode ser usada para adicionar rapidamente um novo membro a um grupo.

#### Fazer backup de um membro da replicação de grupo usando o MySQL Enterprise Backup

Fazer backup de um membro da Replicação de Grupo é semelhante a fazer backup de uma instância MySQL independente. As instruções a seguir pressupem que você já está familiarizado com o uso do MySQL Enterprise Backup para realizar um backup; se não for o caso, revise o Guia do Usuário do MySQL Enterprise Backup 4.1, especialmente "Fazendo backup de um servidor de banco de dados". Também observe os requisitos descritos em Conceder privilégios MySQL ao administrador de backup e Usando o MySQL Enterprise Backup com Grupo de Replicação.

Considere o seguinte grupo com três membros, `s1`, `s2` e `s3`, executando em hosts com os mesmos nomes:

```sql
mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
+-------------+-------------+--------------+
| member_host | member_port | member_state |
+-------------+-------------+--------------+
| s1          |        3306 | ONLINE       |
| s2          |        3306 | ONLINE       |
| s3          |        3306 | ONLINE       |
+-------------+-------------+--------------+
```

Usando o MySQL Enterprise Backup, crie um backup de `s2` executando em seu host, por exemplo, o seguinte comando:

```sql
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Nota

* Ao fazer uma cópia de segurança de um membro secundário, pois o MySQL Enterprise Backup não pode escrever o status e os metadados de backup em uma instância do servidor somente leitura, ele pode emitir avisos semelhantes ao seguinte durante a operação de cópia de segurança:

  ```sql
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

Você pode evitar o aviso usando a opção `--no-history-logging` com seu comando de backup.

#### Restaurando um Membro Falhado

Suponha que um dos membros (`s3` no exemplo a seguir) esteja irreconciliavelmente corrompido. O backup mais recente do membro do grupo `s2` pode ser usado para restaurar `s3`. Aqui estão os passos para realizar a restauração:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são ambos servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

1. Parar o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

2. Preserve o arquivo de configuração `auto.cnf`, localizado no diretório de dados do servidor corrompido, copiando-o para um local seguro fora do diretório de dados. Isso é para preservar o UUID do servidor, que será necessário mais tarde.

3. Exclua todo o conteúdo no diretório de dados do `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para quaisquer diretórios que não sejam o diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falhará.

4. Restaure o backup de `s2` no host para `s3`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

Nota

O comando acima assume que os logs binários e os logs de relevo em `s2` e `s3` têm o mesmo nome de base e estão no mesmo local nos dois servidores. Se essas condições não forem atendidas, para o MySQL Enterprise Backup 4.1.2 e versões posteriores, você deve usar as opções `--log-bin` e `--relay-log` para restaurar o log binário e o log de relevo em seus caminhos de arquivo originais em `s3`. Por exemplo, se você sabe que em `s3` o nome de base do log binário é `s3-bin` e o nome de base do log de relevo é `s3-relay-bin`, seu comando de restauração deve parecer assim:

      ```sql
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

4. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que utilizam systemd:

   ```sql
   systemctl start mysqld
   ```

Nota

Se o servidor que você está restaurando for um membro primário, realize as etapas descritas em Restaurar um membro primário *antes de iniciar o servidor restaurado*.

5. *Reinicie a Replicação de Grupo.* Conecte-se ao `s3` reiniciado, por exemplo, usando um cliente **mysql**, e execute o seguinte comando:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuído da Replicação de Grupo, e o processo começa após a declaração START GROUP_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```sql
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

   ```sql
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

Às vezes, os passos descritos acima em Restaurar um Membro Falho não podem ser realizados porque, por exemplo, o log binário ou o log de relevo está corrompido ou simplesmente está ausente no backup. Nessa situação, use o backup para reconstruir o membro e, em seguida, adicione-o ao grupo como um novo membro. Nos passos abaixo, assumimos que o membro reconstruído é chamado `s3`, como o membro falho, e que ele é executado no mesmo host que o `s3` estava:

1. *Copie o backup do s2 para o host do s3.* A maneira exata de copiar o backup depende do sistema operacional e das ferramentas disponíveis para você. Neste exemplo, assumimos que os hosts são ambos servidores Linux e usamos o SCP para copiar os arquivos entre eles:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restaure o backup.* Conecte-se ao hospedeiro de destino (o hospedeiro para `s3` neste caso) e restaure o backup usando o MySQL Enterprise Backup. Aqui estão os passos:

1. Parar o servidor corrompido, se ainda estiver em execução. Por exemplo, em distribuições Linux que usam systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

2. Exclua todo o conteúdo no diretório de dados de `s3`. Por exemplo:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

Se as variáveis de sistema `innodb_data_home_dir`, `innodb_log_group_home_dir` e `innodb_undo_directory` apontarem para quaisquer diretórios que não sejam o diretório de dados, elas também devem ser deixadas em branco; caso contrário, a operação de restauração falha.

3. Restaure o backup de `s2` no host de `s3`. Com essa abordagem, estamos reconstruindo `s3` como um novo membro, para o qual não precisamos ou não queremos usar os logs binários e de releio antigos no backup; portanto, se esses logs tiverem sido incluídos no seu backup, exclua-os usando as opções `--skip-binlog` e `--skip-relaylog`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

Notas

* Se você tiver logs binários saudáveis e logs de releio no backup que você pode transferir para o host de destino sem problemas, é recomendável seguir o procedimento mais fácil, conforme descrito em Restaurar um membro falhado acima.

* **NÃO** restaure manualmente o arquivo `auto.cnf` do servidor corrompido no diretório de dados do novo membro. Quando o `s3` reconstruído se juntar ao grupo como um novo membro, ele receberá um novo UUID do servidor.

3. *Inicie o servidor restaurado.* Por exemplo, em distribuições Linux que utilizam systemd:

   ```sql
   systemctl start mysqld
   ```

Nota

Se o servidor que você está restaurando for um membro primário, realize as etapas descritas em Restaurar um membro primário *antes de iniciar o servidor restaurado*.

4. *Reconfigurar o membro restaurado para se juntar à Replicação em Grupo.* Conecte-se ao servidor restaurado com um cliente **mysql** e redefina as informações da fonte e da replica com os seguintes comandos:

   ```sql
   mysql> RESET MASTER;
   ```

   ```sql
   mysql> RESET SLAVE ALL;
   ```

Para que o servidor restaurado possa se recuperar automaticamente usando o mecanismo de recuperação distribuída integrado do Grupo de Replicação, configure a variável `gtid_executed` do servidor. Para isso, use o arquivo `backup_gtid_executed.sql` incluído no backup de `s2`, que geralmente é restaurado sob o diretório de dados do membro restaurado. Desative o registro binário, use o arquivo `backup_gtid_executed.sql` para configurar `gtid_executed`, e, em seguida, reative o registro binário emitindo as seguintes declarações com seu cliente **mysql**:

   ```sql
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

Em seguida, configure as credenciais de usuário da Replicação de grupo no membro:

   ```sql
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' /
   		FOR CHANNEL 'group_replication_recovery';
   ```

5. *Reinicie a Replicação de Grupo.* Emite o seguinte comando para o servidor restaurado com seu cliente **mysql**:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

Antes que a instância restaurada possa se tornar um membro online do grupo, ela precisa aplicar quaisquer transações que tenham ocorrido no grupo após a cópia de segurança ter sido feita; isso é feito usando o mecanismo de recuperação distribuído da Replicação de Grupo, e o processo começa após a declaração START GROUP_REPLICATION ter sido emitida. Para verificar o status do membro da instância restaurada, execute:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

Isso mostra que `s3` está aplicando transações para se recuperar com o grupo. Assim que se recuperar do resto do grupo, sua `member_state` muda para `ONLINE`:

   ```sql
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

**Restauração de um membro primário.** Se o membro restaurado for primário no grupo, é necessário tomar cuidado para evitar gravações no banco de dados restaurado durante a fase de recuperação da Replicação do grupo: Dependendo de como o grupo é acessado pelos clientes, há a possibilidade de declarações DML serem executadas no membro restaurado assim que ele se tornar acessível na rede, antes de o membro terminar sua recuperação das atividades que perdeu ao sair do grupo. Para evitar isso, *antes de iniciar o servidor restaurado*, configure as seguintes variáveis de sistema no arquivo de opção do servidor:

```sql
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

Essas configurações garantem que o membro se torne somente de leitura no início e que o cronômetro de eventos seja desligado enquanto o membro está se atualizando com o grupo durante a fase de recuperação. O tratamento adequado de erros também deve ser configurado nos clientes, pois eles são temporariamente impedidos de realizar operações DML durante esse período no membro restaurado. Uma vez que o processo de restauração esteja totalmente concluído e o membro restaurado esteja sincronizado com o resto do grupo, requeira essas alterações; reinicie o cronômetro de eventos:

```sql
mysql> SET global event_scheduler=ON;
```

Edite as seguintes variáveis de sistema no arquivo de opções do membro, para que as coisas estejam corretamente configuradas para a próxima inicialização:

```sql
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
