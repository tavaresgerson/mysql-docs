#### 20.5.1.2 Mudando o Modo de Grupo

Esta seção explica como alterar o modo em que um grupo está sendo executado, seja em modo único ou multi-primário. As funções usadas para alterar o modo de um grupo podem ser executadas em qualquer membro.

##### Mudando para o modo de primário único

Use a função `group_replication_switch_to_single_primary_mode()` para alterar um grupo que está em modo multi-primário para modo único-primário, emitindo:

```
SELECT group_replication_switch_to_single_primary_mode()
```

Quando você muda para o modo de único primário, as verificações de consistência rigorosas também são desativadas em todos os membros do grupo, conforme exigido no modo de único primário (`group_replication_enforce_update_everywhere_checks=OFF`).

Se não for passado nenhum texto, a eleição do novo primário no grupo resultante de um único primário segue as políticas de eleição descritas na Seção 20.1.3.1, “Modo de Primário Único”. Para anular o processo de eleição e configurar um membro específico do grupo de múltiplos primários como o novo primário no processo, obtenha o `server_uuid` do membro e passe-o para `group_replication_switch_to_single_primary_mode()`. Por exemplo:

```
SELECT group_replication_switch_to_single_primary_mode(member_uuid);
```

Se você invocar a função em um membro que está executando uma versão do MySQL Server a partir da versão 8.0.17, e todos os membros estão executando a versão do MySQL Server 8.0.17 ou superior, você só pode especificar um novo membro primário que esteja executando a versão mais baixa do MySQL Server no grupo, com base na versão do patch. Esta proteção é aplicada para garantir que o grupo mantenha a compatibilidade com novas funções. Se você não especificar um novo membro primário, o processo de eleição considera a versão do patch dos membros do grupo.

Se algum membro estiver executando uma versão do MySQL Server entre MySQL 8.0.13 e MySQL 8.0.16, essa proteção não será aplicada ao grupo e você pode especificar qualquer novo membro primário, mas é recomendável selecionar um primário que esteja executando a versão mais baixa do MySQL Server no grupo. Se você não especificar um novo membro primário, o processo de eleição considerará apenas a versão principal dos membros do grupo.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo:

```
SELECT event_name, work_completed, work_estimated FROM performance_schema.events_stages_current WHERE event_name LIKE "%stage/group_rpl%";
+----------------------------------------------------------------------------+----------------+----------------+
| event_name                                                                 | work_completed | work_estimated |
+----------------------------------------------------------------------------+----------------+----------------+
| stage/group_rpl/Primary Switch: waiting for pending transactions to finish |              4 |             20 |
+----------------------------------------------------------------------------+----------------+----------------+
```

##### Mudando para o modo Multi-Primaria

Use a função `group_replication_switch_to_multi_primary_mode()` para alterar um grupo que está em modo de único primário para modo de múltiplos primários, emitindo:

```
SELECT group_replication_switch_to_multi_primary_mode()
```

Após algumas operações de grupo coordenadas para garantir a segurança e a consistência dos seus dados, todos os membros que pertencem ao grupo se tornam primárias.

Quando você altera um grupo que estava rodando no modo de primário único para rodar no modo de primário múltiplo, os membros que estão rodando o MySQL 8.0.17 ou superior são automaticamente colocados no modo de leitura somente se estiverem rodando uma versão do servidor MySQL superior à versão mais baixa presente no grupo. Os membros que estão rodando o MySQL 8.0.16 ou versões inferiores não realizam essa verificação e são sempre colocados no modo de leitura e escrita.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo:

```
SELECT event_name, work_completed, work_estimated FROM performance_schema.events_stages_current WHERE event_name LIKE "%stage/group_rpl%";
+----------------------------------------------------------------------+----------------+----------------+
| event_name                                                           | work_completed | work_estimated |
+----------------------------------------------------------------------+----------------+----------------+
| stage/group_rpl/Multi-primary Switch: applying buffered transactions |              0 |              1 |
+----------------------------------------------------------------------+----------------+----------------+
```
