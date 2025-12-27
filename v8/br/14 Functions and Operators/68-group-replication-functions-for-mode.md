#### 14.18.1.2 Funções que configuram o modo de replicação de grupo

As seguintes funções permitem controlar o modo em que um grupo de replicação está sendo executado, seja em modo único ou multi-primario.

*  `group_replication_switch_to_multi_primary_mode()`

  Altera um grupo que está em modo único para modo multi-primario. Deve ser emitido em um membro de um grupo de replicação que está em modo único.

  Sintaxe:

  ```
  STRING group_replication_switch_to_multi_primary_mode()
  ```

  Esta função não tem parâmetros.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT group_replication_switch_to_multi_primary_mode()
  ```

  Todos os membros que pertencem ao grupo se tornam primárias.

  Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”

*  `group_replication_switch_to_single_primary_mode()`

  Altera um grupo que está em modo multi-primario para modo único, sem a necessidade de parar a Replicação de Grupo. Deve ser emitido em um membro de um grupo de replicação que está em modo multi-primario. Quando você muda para modo único, as verificações de consistência estrita também são desativadas em todos os membros do grupo, conforme exigido no modo único ( `group_replication_enforce_update_everywhere_checks=OFF`).

  Sintaxe:

  ```
  STRING group_replication_switch_to_single_primary_mode([str])
  ```

  Argumentos:

  + *`str`*: Uma string contendo o UUID de um membro do grupo que deve se tornar o novo único primário. Outros membros do grupo se tornam secundários.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT group_replication_switch_to_single_primary_mode(member_uuid);
  ```

  Para mais informações, consulte a Seção 20.5.1.2, “Mudando o Modo do Grupo”