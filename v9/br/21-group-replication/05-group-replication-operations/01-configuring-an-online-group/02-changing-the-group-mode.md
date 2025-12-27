#### 20.5.1.2 Mudando o Modo do Grupo

Esta seção explica como alterar o modo em que um grupo está sendo executado, seja em modo único ou multi-primário. As funções usadas para alterar o modo de um grupo podem ser executadas em qualquer membro.

##### Mudando para o Modo Único-Primário

Use a função `group_replication_switch_to_single_primary_mode()` para alterar um grupo que está executando em modo multi-primário para modo único-primário, emitindo:

```
SELECT group_replication_switch_to_single_primary_mode()
```

Quando você muda para o modo único-primário, as verificações de consistência estritas também são desativadas em todos os membros do grupo, conforme exigido no modo único-primário (`group_replication_enforce_update_everywhere_checks=OFF`).

Se nenhuma string for passada, a eleição do novo primário no grupo único-primário resultante segue as políticas de eleição descritas na Seção 20.1.3.1, “Modo Único-Primário”. Para ignorar o processo de eleição e configurar um membro específico do grupo multi-primário como o novo primário no processo, obtenha o `server_uuid` do membro e passe-o para `group_replication_switch_to_single_primary_mode()`. Por exemplo, emita:

```
SELECT group_replication_switch_to_single_primary_mode(member_uuid);
```

##### Mudando para o Modo Multi-Primário

Use a função `group_replication_switch_to_multi_primary_mode()` para alterar um grupo que está executando em modo único-primário para modo multi-primário, emitindo:

```
SELECT group_replication_switch_to_multi_primary_mode()
```

Após algumas operações coordenadas do grupo para garantir a segurança e consistência dos seus dados, todos os membros que pertencem ao grupo se tornam primários.

Quando você muda um grupo do modo único-primário para o modo multi-primário, os membros são automaticamente colocados no modo de leitura apenas se estiverem executando uma versão mais recente do servidor MySQL do que a versão mais baixa presente no grupo.

Enquanto a ação estiver em execução, você pode verificar seu progresso emitindo a seguinte instrução `SELECT`:

```
SELECT event_name, work_completed, work_estimated FROM performance_schema.events_stages_current WHERE event_name LIKE "%stage/group_rpl%";
+----------------------------------------------------------------------+----------------+----------------+
| event_name                                                           | work_completed | work_estimated |
+----------------------------------------------------------------------+----------------+----------------+
| stage/group_rpl/Multi-primary Switch: applying buffered transactions |              0 |              1 |
+----------------------------------------------------------------------+----------------+----------------+
```