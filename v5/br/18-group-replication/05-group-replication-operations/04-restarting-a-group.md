### 17.5.4 Reiniciando um Group

O Group Replication é projetado para garantir que o serviço de Database esteja continuamente disponível, mesmo que alguns dos Servers que formam o Group estejam temporariamente incapazes de participar devido à manutenção planejada ou problemas não planejados. Desde que os membros restantes sejam a maioria do Group, eles podem eleger um novo Primary e continuar a funcionar como um Group. No entanto, se todos os membros de um Group de Replication saírem do Group, e o Group Replication for interrompido em todos os membros por uma instrução [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") ou um desligamento do sistema, o Group passa a existir apenas em teoria, como uma configuração nos membros. Nessa situação, para recriar o Group, ele deve ser iniciado via *bootstrapping*, como se estivesse sendo iniciado pela primeira vez.

A diferença entre o *bootstrapping* de um Group pela primeira vez e fazê-lo pela segunda ou subsequentes vezes é que, nesta última situação, os membros de um Group que foi desligado podem ter conjuntos de transações (transaction sets) diferentes uns dos outros, dependendo da ordem em que foram parados ou falharam. Um membro não pode ingressar em um Group se tiver transações que não estão presentes nos outros membros do Group. Para o Group Replication, isso inclui tanto as transações que foram committed e applied, que estão no GTID set [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed), quanto as transações que foram certified, mas ainda não applied, que estão no channel `group_replication_applier`. Um membro do Group Replication nunca remove uma transação que foi certified, o que é uma declaração da intenção do membro de fazer o commit da transação.

O Group de Replication deve, portanto, ser reiniciado começando pelo membro mais atualizado (most up to date member), ou seja, o membro que tem o maior número de transações executed e certified. Os membros com menos transações podem então ingressar e fazer o *catch up* (alcançar) das transações ausentes através da Distributed Recovery. Não é correto presumir que o último Primary conhecido do Group seja o membro mais atualizado, pois um membro que foi desligado mais tarde do que o Primary pode ter mais transações. Portanto, você deve reiniciar cada membro para verificar as transações, comparar todos os transaction sets e identificar o membro mais atualizado. Este membro pode então ser usado para fazer o *bootstrap* do Group.

Siga este procedimento para reiniciar um Group de Replication com segurança após o desligamento de todos os membros.

1. Para cada membro do Group, em qualquer ordem:

   1. Conecte um Client ao membro do Group. Se o Group Replication ainda não estiver parado, emita a instrução [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") e espere até que o Group Replication pare.

   2. Edite o arquivo de configuração do MySQL Server (geralmente chamado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows) e defina a variável de sistema [`group_replication_start_on_boot=OFF`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot). Essa configuração impede que o Group Replication inicie quando o MySQL Server é iniciado, o que é o comportamento padrão (default).

      Se você não puder alterar essa configuração no sistema, pode apenas permitir que o Server tente iniciar o Group Replication, o que falhará porque o Group foi totalmente desligado e ainda não foi bootstrapped. Se você adotar essa abordagem, não defina [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) em nenhum Server nesta fase.

   3. Inicie a instância do MySQL Server e verifique se o Group Replication não foi iniciado (ou se falhou ao iniciar). Não inicie o Group Replication nesta fase.

   4. Colete as seguintes informações do membro do Group:

      * O conteúdo do GTID set [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed). Você pode obtê-lo emitindo a seguinte instrução:

        ```sql
        mysql> SELECT @@GLOBAL.GTID_EXECUTED
        ```

      * O conjunto de transações certified no channel `group_replication_applier`. Você pode obtê-lo emitindo a seguinte instrução:

        ```sql
        mysql> SELECT received_transaction_set FROM \
                performance_schema.replication_connection_status WHERE \
                channel_name="group_replication_applier";
        ```

2. Quando você tiver coletado os transaction sets de todos os membros do Group, compare-os para descobrir qual membro tem o maior transaction set geral, incluindo as transações executed ([`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed)) e as transações certified (no channel `group_replication_applier`). Você pode fazer isso manualmente olhando os GTIDs, ou pode comparar os GTID sets usando Stored Functions, conforme descrito na [Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”](replication-gtids-functions.html "16.1.3.7 Stored Function Examples to Manipulate GTIDs”).

3. Use o membro que possui o maior transaction set para fazer o *bootstrap* do Group, conectando um Client a esse membro e emitindo as seguintes instruções:

   ```sql
   mysql> SET GLOBAL group_replication_bootstrap_group=ON;
   mysql> START GROUP_REPLICATION;
   mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
   ```

   É importante não armazenar a configuração [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) no arquivo de configuração, caso contrário, quando o Server for reiniciado novamente, um segundo Group com o mesmo nome será configurado.

4. Para verificar se o Group agora existe com este membro fundador, emita esta instrução no membro que fez o *bootstrap*:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

5. Adicione cada um dos outros membros de volta ao Group, em qualquer ordem, emitindo uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") em cada um deles:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

6. Para verificar se cada membro ingressou no Group, emita esta instrução em qualquer membro:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

7. Quando os membros tiverem reingressado no Group, se você editou seus arquivos de configuração para definir [`group_replication_start_on_boot=OFF`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot), você pode editá-los novamente para definir `ON` (ou remover a variável de sistema, já que `ON` é o default).