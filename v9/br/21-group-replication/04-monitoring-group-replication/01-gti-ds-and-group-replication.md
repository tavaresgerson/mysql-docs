### 20.4.1 GTIDs e Replicação em Grupo

A Replicação em Grupo utiliza GTIDs (identificadores globais de transações) para rastrear exatamente quais transações foram comprometidas em cada instância do servidor. As configurações `gtid_mode=ON` e `enforce_gtid_consistency=ON` são necessárias em todos os membros do grupo. As transações recebidas dos clientes são atribuídas um GTID pelo membro do grupo que as recebe. Quaisquer transações replicadas recebidas pelos membros do grupo em canais de replicação assíncronos de servidores de origem externos ao grupo retêm os GTIDs que possuem quando chegam ao membro do grupo.

Os GTIDs atribuídos às transações recebidas dos clientes usam o nome do grupo especificado pela variável de sistema `group_replication_group_name` como a parte UUID do identificador, em vez do UUID do servidor do membro do grupo individual que recebeu a transação. Portanto, todas as transações recebidas diretamente pelo grupo podem ser identificadas e agrupadas em conjuntos de GTIDs, e não importa qual membro as recebeu originalmente. Cada membro do grupo tem um bloco de GTIDs consecutivos reservado para seu uso, e quando esses são consumidos, reserva mais. A variável de sistema `group_replication_gtid_assignment_block_size` define o tamanho dos blocos, com um valor padrão de 1 milhão de GTIDs em cada bloco.

Os eventos de alteração (`View_change_log_event`), que são gerados pelo próprio grupo quando um novo membro se junta, recebem GTIDs quando são registrados no log binário. Por padrão, os GTIDs desses eventos também usam o nome do grupo especificado pela variável de sistema `group_replication_group_name` como a parte UUID do identificador. Você pode definir a variável de sistema de Replicação de Grupo `group_replication_view_change_uuid` para usar um UUID alternativo nos GTIDs para eventos de alteração de visualizações, para que sejam fáceis de distinguir das transações recebidas pelo grupo de clientes. Isso pode ser útil se sua configuração permitir o failover entre grupos e você precisar identificar e descartar transações que eram específicas do grupo de backup. O UUID alternativo deve ser diferente dos UUIDs dos servidores membros. Também deve ser diferente de quaisquer UUIDs nos GTIDs aplicados a transações anônimas usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

`GTID_ONLY=1`, `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` são aplicados aos canais de Replicação de Grupo `group_replication_applier` e `group_replication_recovery`. As configurações são feitas automaticamente nos canais de Replicação de Grupo quando eles são criados ou quando um servidor membro de um grupo de replicação é atualizado. Essas opções são normalmente definidas usando uma declaração `CHANGE REPLICATION SOURCE TO`, mas note que você não pode desabilitá-las para um canal de Replicação de Grupo. Com essas opções definidas, o membro do grupo não persiste nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação para esses canais. O autoposicionamento GTID e o autodesvio GTID são usados para localizar as posições corretas do receptor e do aplicador quando necessário.

#### Transações Extra
## Transações Extra

Se um membro associado tiver transações em seu conjunto GTID que não estão presentes nos membros existentes do grupo, ele não poderá completar o processo de recuperação distribuída e não poderá se associar ao grupo. Se uma operação de clonagem remota foi realizada, essas transações seriam excluídas e perdidas, porque o diretório de dados do membro associado é apagado. Se a transferência de estado de um log binário do doador foi realizada, essas transações poderiam entrar em conflito com as transações do grupo.

Transações extras podem estar presentes em um membro se uma transação administrativa for realizada na instância enquanto a Replicação de Grupo estiver parada. Para evitar introduzir novas transações dessa maneira, sempre defina o valor da variável de sistema `sql_log_bin` para `OFF` antes de emitir declarações administrativas e, depois, para `ON`:

```
SET SQL_LOG_BIN=0;
<administrator action>
SET SQL_LOG_BIN=1;
```

Definir essa variável de sistema para `OFF` significa que as transações que ocorrem a partir desse ponto até que você a defina de volta para `ON` não serão escritas no log binário e não terão GTIDs atribuídos a elas.

Se uma transação extra estiver presente em um membro associado, verifique o log binário do servidor afetado para ver o que a transação extra realmente contém. O método mais seguro para reconciliar os dados e o conjunto de GTIDs do membro associado com os membros atualmente no grupo é usar a funcionalidade de clonagem do MySQL para transferir o conteúdo de um servidor no grupo para o servidor afetado. Para obter instruções sobre como fazer isso, consulte a Seção 7.6.6.3, “Clonagem de Dados Remotas”. Se a transação for necessária, execute-a novamente após o membro ter se associado com sucesso.