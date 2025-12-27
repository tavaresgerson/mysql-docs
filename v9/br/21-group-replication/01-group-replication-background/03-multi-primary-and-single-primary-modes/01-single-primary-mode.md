#### 20.1.3.1 Modo de Primazia Única

No modo de primazia única (`group_replication_single_primary_mode=ON`), o grupo tem um único servidor primário configurado no modo de leitura/escrita. Todos os outros membros do grupo são configurados no modo de leitura apenas (com `super_read_only=ON`). O primário normalmente inicia o grupo inteiro. Todos os outros servidores que se juntam ao grupo aprendem sobre o servidor primário e são automaticamente configurados no modo de leitura apenas.

No modo de primazia única, a Replicação de Grupo garante que apenas um servidor escreve para o grupo, portanto, em comparação com o modo de primazia múltipla, a verificação de consistência pode ser menos rigorosa e as instruções DDL não precisam ser tratadas com cuidado extra. A opção `group_replication_enforce_update_everywhere_checks` habilita ou desabilita verificações de consistência rigorosas para um grupo. Ao implantar no modo de primazia única ou ao mudar o grupo para o modo de primazia única, essa variável de sistema deve ser configurada para `OFF`.

O membro designado como servidor primário pode ser alterado das seguintes maneiras:

* Se o primário existente sair do grupo, seja voluntariamente ou inesperadamente, um novo primário é eleito automaticamente.

* Você pode designar um membro específico como o novo primário usando a função `group_replication_set_as_primary()`.

* Se você usar a função `group_replication_switch_to_single_primary_mode()` para mudar um grupo que estava em modo de primazia múltipla para rodar no modo de primazia única, um novo primário é eleito automaticamente, ou você pode designar o novo primário especificando-o com a função.

Quando um novo servidor primário é eleito (automática ou manualmente), ele é automaticamente configurado para leitura/escrita, e os outros membros do grupo permanecem como secundários, e como tal, de leitura apenas. O diagrama a seguir mostra esse processo:

**Figura 20.4 Eleição de Novo Primário**

![Cinco instâncias de servidor, S1, S2, S3, S4 e S5, são implantadas como um grupo interconectado. O servidor S1 é o principal. Os clientes de escrita estão se comunicando com o servidor S1, e um cliente de leitura está se comunicando com o servidor S4. O servidor S1 então falha, interrompendo a comunicação com os clientes de escrita. O servidor S2 então assume o novo papel de principal, e os clientes de escrita agora se comunicam com o servidor S2.](images/eleição-primaria-única.png)

Quando uma nova eleição primária é escolhida, ela pode ter um atraso de alterações que foram aplicadas na antiga primária, mas ainda não foram aplicadas na nova. Neste caso, até que a nova primária alcance a antiga, as transações de leitura/escrita podem resultar em conflitos e serem revertidas, e as transações de leitura apenas podem resultar em leituras desatualizadas. O mecanismo de controle de fluxo de controle de replicação do grupo minimiza a diferença entre membros rápidos e lentos, e assim reduz as chances de isso acontecer se estiver ativado e ajustado corretamente. Para mais informações, consulte a Seção 20.7.2, “Controle de Fluxo”. Você também pode usar a variável de sistema `group_replication_consistency` para definir o nível de consistência de transação do grupo para evitar esse problema. Definir essa variável para `BEFORE_ON_PRIMARY_FAILOVER` (o padrão) ou qualquer nível de consistência mais alto mantém as novas transações em uma primária recém-eleita até que o atraso tenha sido aplicado.

Para mais informações sobre consistência de transação, consulte a Seção 20.5.3, “Garantindo Consistência de Transação”. Se o controle de fluxo e as garantias de consistência de transação não forem usados para um grupo, é uma boa prática esperar que a nova primária aplique seu log de relevo relacionado à replicação antes de redirecionar os aplicativos de cliente para ela.

##### 20.1.3.1.1 Algoritmo de Eleição Primária

O processo automático de eleição de membros primários envolve cada membro analisando a nova visualização do grupo, ordenando os potenciais novos membros primários e escolhendo o membro que se qualifica como o mais adequado. Cada membro toma sua própria decisão localmente, seguindo o algoritmo de eleição primária na versão do seu MySQL Server. Como todos os membros devem chegar à mesma decisão, os membros adaptam seu algoritmo de eleição primária se outros membros do grupo estiverem executando versões mais baixas do MySQL Server, para que tenham o mesmo comportamento do membro com a versão mais baixa do MySQL Server no grupo.

Os fatores considerados pelos membros ao eleger um primário, em ordem, são os seguintes:

1. O primeiro fator considerado é qual membro ou quais membros estão executando a versão mais baixa do MySQL Server. Todos os membros do grupo são ordenados primeiro pela versão do patch de sua versão.

2. Se mais de um membro estiver executando a versão mais baixa do MySQL Server, o segundo fator considerado é o peso do membro de cada um desses membros, conforme especificado pela variável de sistema `group_replication_member_weight` no membro.

A variável de sistema `group_replication_member_weight` especifica um número no intervalo de 0 a 100. Todos os membros têm um peso padrão de 50, então defina um peso abaixo disso para diminuir sua ordem e um peso acima disso para aumentar sua ordem. Você pode usar essa função de ponderação para priorizar o uso de hardware melhor ou para garantir a falha para um membro específico durante a manutenção programada do primário.

3. Se mais de um membro estiver executando a versão mais baixa do servidor MySQL e mais de um desses membros tiver o maior peso do membro (ou o peso do membro estiver sendo ignorado), o terceiro fator considerado é a ordem lexicográfica dos UUIDs gerados de cada membro, conforme especificado pela variável de sistema `server_uuid`. O membro com o UUID de servidor mais baixo é escolhido como o primário. Esse fator atua como um recurso de resolução de empate garantido e previsível para que todos os membros do grupo cheguem à mesma decisão, caso não seja possível determinar por meio de quaisquer fatores importantes.

##### 20.1.3.1.2 Encontrando o Primário

Para descobrir qual servidor é o primário atualmente quando implantado no modo de único primário, use a coluna `MEMBER_ROLE` na tabela `performance_schema.replication_group_members`. Por exemplo:

```
mysql> SELECT MEMBER_HOST, MEMBER_ROLE FROM performance_schema.replication_group_members;
+-------------------------+-------------+
| MEMBER_HOST             | MEMBER_ROLE |
+-------------------------+-------------+
| remote1.example.com     | PRIMARY     |
| remote2.example.com     | SECONDARY   |
| remote3.example.com     | SECONDARY   |
+-------------------------+-------------+
```