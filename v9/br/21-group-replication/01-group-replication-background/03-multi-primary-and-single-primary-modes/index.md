### 20.1.3 Modos Multi-Primario e Simples

20.1.3.1 Modo Simples-Primario

20.1.3.2 Modo Multi-Primario

A Replicação em Grupo opera em modo simples-primario ou em modo multi-primario. O modo do grupo é uma configuração de nível de grupo, especificada pela variável de sistema `group_replication_single_primary_mode`, que deve ser a mesma em todos os membros. `ON` significa modo simples-primario, que é o modo padrão, e `OFF` significa modo multi-primario. Não é possível ter membros do grupo implantados em modos diferentes, por exemplo, um membro configurado em modo multi-primario enquanto outro membro está em modo simples-primario.

Você não pode alterar o valor de `group_replication_single_primary_mode` manualmente enquanto a Replicação em Grupo estiver em execução. Você pode usar as funções `group_replication_switch_to_single_primary_mode()` e `group_replication_switch_to_multi_primary_mode()` para mover um grupo de um modo para outro enquanto a Replicação em Grupo ainda estiver em execução. Essas funções gerenciam o processo de mudança do modo do grupo e garantem a segurança e a consistência dos seus dados. Em versões anteriores, para mudar o modo do grupo, você deve parar a Replicação em Grupo e alterar o valor de `group_replication_single_primary_mode` em todos os membros. Em seguida, realize um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para implementar a mudança para a nova configuração operacional. Você não precisa reiniciar os servidores.

Independentemente do modo implantado, a Replicação em Grupo não gerencia o failover do lado do cliente. Isso deve ser gerenciado por uma estrutura de middleware, como o MySQL Router 9.5, um proxy, um conector ou o próprio aplicativo.