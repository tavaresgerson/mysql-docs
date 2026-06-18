### 14.18.1 Funções de Replicação em Grupo

14.18.1.1 Função que configura a replicação primária do grupo

14.18.1.2 Funções que configuram o modo de replicação de grupo

14.18.1.3 Funções para inspecionar e configurar as instâncias de consenso máximo de um grupo

14.18.1.4 Funções para inspecionar e definir a versão do protocolo de comunicação de replicação de grupo

14.18.1.5 Funções para definir e redefinir ações de membros da replicação em grupo

As funções descritas nas seções a seguir são usadas com a replicação em grupo.

**Tabela 14.25 Funções de Replicação por Grupo**

<table summary="Uma referência que lista as funções usadas com a replicação de grupo do MySQL."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>[[<code>group_replication_disable_member_action()</code>]]</th> <td>Desativar ação do membro para o evento especificado</td> <td>8.0.26</td> </tr><tr><th>[[<code>group_replication_enable_member_action()</code>]]</th> <td>Ative a ação do membro para o evento especificado</td> <td>8.0.26</td> </tr><tr><th>[[<code>group_replication_get_communication_protocol()</code>]]</th> <td>Obtenha a versão do protocolo de comunicação de replicação de grupo atualmente em uso</td> <td>8.0.16</td> </tr><tr><th>[[<code>group_replication_get_write_concurrency()</code>]]</th> <td>Obtenha o número máximo de instâncias de consenso atualmente configuradas para o grupo</td> <td>8.0.13</td> </tr><tr><th>[[<code>group_replication_reset_member_actions()</code>]]</th> <td>Reinicie todas as ações dos membros para as configurações padrão e o número da versão da configuração para 1</td> <td>8.0.26</td> </tr><tr><th>[[<code>group_replication_set_as_primary()</code>]]</th> <td>Torne um membro específico do grupo como o principal</td> <td>8.0.29</td> </tr><tr><th>[[<code>group_replication_set_communication_protocol()</code>]]</th> <td>Defina a versão para o protocolo de comunicação de replicação em grupo a ser usado</td> <td>8.0.16</td> </tr><tr><th>[[<code>group_replication_set_write_concurrency()</code>]]</th> <td>Defina o número máximo de instâncias de consenso que podem ser executadas em paralelo</td> <td>8.0.13</td> </tr><tr><th>[[<code>group_replication_switch_to_multi_primary_mode()</code>]]</th> <td>Altera o modo de um grupo que está em modo único primário para modo multiprimário</td> <td>8.0.13</td> </tr><tr><th>[[<code>group_replication_switch_to_single_primary_mode()</code>]]</th> <td>Altera o modo de um grupo que está em modo multi-primário para modo único-primário</td> <td>8.0.13</td> </tr></tbody></table>
