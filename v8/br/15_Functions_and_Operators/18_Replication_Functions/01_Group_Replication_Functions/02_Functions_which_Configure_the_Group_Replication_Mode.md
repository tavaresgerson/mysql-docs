#### 14.18.1.2 Funções que configuram o modo de replicação em grupo

As seguintes funções permitem que você controle o modo em que um grupo de replicação está sendo executado, seja em modo único ou multi-primario.

- `group_replication_switch_to_multi_primary_mode()`

  Altera um grupo que está em modo único de primário para modo multi-primário. Deve ser emitido para um membro de um grupo de replicação que está em modo único de primário.

  Sintaxe:

  ```
  STRING group_replication_switch_to_multi_primary_mode()
  ```

  Esta função não tem parâmetros.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_switch_to_multi_primary_mode()
  ```

  Todos os membros que pertencem ao grupo se tornam primárias.

  Para obter mais informações, consulte a Seção 20.5.1.2, “Alterar o Modo de Grupo”

- `group_replication_switch_to_single_primary_mode()`

  Altera um grupo que está em modo multi-primário para modo único-primário, sem a necessidade de parar a Replicação de Grupo. Deve ser emitido em um membro de um grupo de replicação que está em modo multi-primário. Quando você muda para o modo único-primário, as verificações de consistência rigorosas também são desativadas em todos os membros do grupo, conforme exigido no modo único-primário (`group_replication_enforce_update_everywhere_checks=OFF`).

  Sintaxe:

  ```
  STRING group_replication_switch_to_single_primary_mode([str])
  ```

  Argumentos:

  - `str`: Uma string contendo o UUID de um membro do grupo que deve se tornar o novo primário único. Outros membros do grupo se tornam secundários.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_switch_to_single_primary_mode(member_uuid);
  ```

  Para obter mais informações, consulte a Seção 20.5.1.2, “Alterar o Modo de Grupo”
