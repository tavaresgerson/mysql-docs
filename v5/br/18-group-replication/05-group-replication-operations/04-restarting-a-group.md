### 17.5.4 Reiniciar um grupo

A Replicação em Grupo é projetada para garantir que o serviço de banco de dados esteja continuamente disponível, mesmo que alguns dos servidores que formam o grupo não possam participar atualmente devido a manutenção planejada ou problemas imprevistos. Enquanto os membros restantes representarem a maioria do grupo, eles poderão eleger um novo primário e continuar a funcionar como um grupo. No entanto, se todos os membros de um grupo de replicação deixarem o grupo e a Replicação em Grupo for interrompida em todos os membros por uma declaração `STOP GROUP_REPLICATION` ou desligamento do sistema, o grupo agora existe apenas em teoria, como uma configuração nos membros. Nessa situação, para recriar o grupo, ele deve ser iniciado como se estivesse sendo iniciado pela primeira vez.

A diferença entre iniciar um grupo pela primeira vez e fazê-lo pela segunda ou em momentos subsequentes é que, na última situação, os membros de um grupo que foi encerrado podem ter conjuntos de transações diferentes uns dos outros, dependendo da ordem em que foram interrompidos ou falharam. Um membro não pode se juntar a um grupo se ele tiver transações que não estão presentes nos outros membros do grupo. Para a Replicação de Grupo, isso inclui tanto as transações que foram comprometidas e aplicadas, que estão no conjunto de GTID `gtid_executed`, quanto as transações que foram certificadas, mas ainda não aplicadas, que estão no canal `group_replication_applier`. Um membro do grupo de Replicação de Grupo nunca remove uma transação que foi certificada, o que é uma declaração da intenção do membro de comprometer a transação.

Portanto, o grupo de replicação deve ser reiniciado a partir do membro mais atualizado, ou seja, o membro que tem mais transações executadas e certificadas. Os membros com menos transações podem então se juntar e recuperar as transações que estão faltando por meio da recuperação distribuída. Não é correto assumir que o último membro primário conhecido do grupo é o membro mais atualizado do grupo, porque um membro que foi desligado mais tarde que o primário pode ter mais transações. Portanto, você deve reiniciar cada membro para verificar as transações, comparar todos os conjuntos de transações e identificar o membro mais atualizado. Esse membro pode então ser usado para iniciar o grupo.

Siga este procedimento para reiniciar um grupo de replicação com segurança após cada membro ser desligado.

1. Para cada membro do grupo, em ordem aleatória:

   1. Conecte um cliente ao membro do grupo. Se a Replicação em Grupo ainda não estiver parada, execute a instrução `STOP GROUP_REPLICATION` e aguarde até que a Replicação em Grupo pare.

   2. Editar o arquivo de configuração do MySQL Server (tipicamente chamado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows) e definir a variável do sistema `group_replication_start_on_boot=OFF`. Esta configuração impede que a Replicação de Grupo seja iniciada quando o MySQL Server é iniciado, o que é o padrão.

      Se você não puder alterar essa configuração no sistema, pode simplesmente permitir que o servidor tente iniciar a Replicação de Grupo, o que falhará porque o grupo foi totalmente desligado e ainda não foi inicializado. Se você adotar essa abordagem, não defina `group_replication_bootstrap_group=ON` em nenhum servidor nesta fase.

   3. Inicie a instância do servidor MySQL e verifique se a replicação por grupo não foi iniciada (ou se não conseguiu iniciar). Não inicie a replicação por grupo nesta etapa.

   4. Coleta as seguintes informações do membro do grupo:

      - O conteúdo do conjunto de GTID `gtid_executed`. Você pode obtê-lo executando a seguinte instrução:

        ```sql
        mysql> SELECT @@GLOBAL.GTID_EXECUTED
        ```

      - O conjunto de transações certificadas no canal `group_replication_applier`. Você pode obtê-lo emitindo a seguinte declaração:

        ```sql
        mysql> SELECT received_transaction_set FROM \
                performance_schema.replication_connection_status WHERE \
                channel_name="group_replication_applier";
        ```

2. Quando você tiver coletado os conjuntos de transações de todos os membros do grupo, compare-os para descobrir qual membro tem o maior conjunto de transações no geral, incluindo as transações executadas (`gtid_executed`) e as transações certificadas (no canal `group_replication_applier`). Você pode fazer isso manualmente, olhando para os GTIDs, ou pode comparar os conjuntos de GTIDs usando funções armazenadas, conforme descrito em Seção 16.1.3.7, “Exemplos de Funções Armazenadas para Manipular GTIDs”.

3. Use o membro que tiver o conjunto de transações mais grande para iniciar o grupo, conectando um cliente ao membro do grupo e emitindo as seguintes declarações:

   ```sql
   mysql> SET GLOBAL group_replication_bootstrap_group=ON;
   mysql> START GROUP_REPLICATION;
   mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
   ```

   É importante não armazenar o ajuste `group_replication_bootstrap_group=ON` no arquivo de configuração, caso contrário, quando o servidor for reiniciado novamente, um segundo grupo com o mesmo nome será criado.

4. Para verificar se o grupo agora existe com esse membro fundador, emita essa declaração sobre o membro que o criou:

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

7. Quando os membros se reunirem novamente ao grupo, se você editar seus arquivos de configuração para definir `group_replication_start_on_boot=OFF`, você pode editá-los novamente para definir `ON` (ou remover a variável do sistema, pois `ON` é o padrão).
