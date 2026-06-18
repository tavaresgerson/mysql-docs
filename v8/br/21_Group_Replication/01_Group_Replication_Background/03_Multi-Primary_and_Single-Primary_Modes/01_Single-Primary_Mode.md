#### 20.1.3.1 Modo de Primordial Único

No modo de primário único (`group_replication_single_primary_mode=ON`), o grupo tem um único servidor primário configurado no modo de leitura/escrita. Todos os outros membros do grupo estão configurados no modo de leitura apenas (com `super_read_only=ON`). O primário geralmente inicializa todo o grupo. Todos os outros servidores que se juntam ao grupo aprendem sobre o servidor primário e são automaticamente configurados no modo de leitura apenas.

No modo de replicação primária única, o Grupo de Replicação garante que apenas um único servidor escreve para o grupo, portanto, em comparação com o modo de replicação primária múltipla, a verificação de consistência pode ser menos rigorosa e as instruções DDL não precisam ser tratadas com algum cuidado extra. A opção `group_replication_enforce_update_everywhere_checks` habilita ou desabilita verificações de consistência rigorosas para um grupo. Ao implantar no modo de replicação primária única ou ao alterar o grupo para o modo de replicação primária única, essa variável de sistema deve ser definida como `OFF`.

O membro designado como servidor primário pode ser alterado das seguintes maneiras:

- Se a primeira eleição sair do grupo, seja voluntariamente ou de forma inesperada, uma nova primeira eleição é automaticamente escolhida.

- Você pode nomear um membro específico como o novo principal usando a função `group_replication_set_as_primary()`.

- Se você usar a função `group_replication_switch_to_single_primary_mode()` para alterar um grupo que estava em modo multi-primário para rodar em modo single-primário, um novo primário é eleito automaticamente, ou você pode nomear o novo primário especificando-o com a função.

Essas funções só podem ser usadas quando todos os membros do grupo estão executando o MySQL 8.0.13 ou uma versão posterior.

Quando um novo servidor primário é eleito (automática ou manualmente), ele é configurado automaticamente para leitura/escrita, e os outros membros do grupo permanecem como secundários e, como tal, apenas de leitura. O diagrama a seguir mostra esse processo:

**Figura 20.4 Nova eleição primária**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. Server S1 is the primary. Write clients are communicating with server S1, and a read client is communicating with server S4. Server S1 then fails, breaking communication with the write clients. Server S2 then takes over as the new primary, and the write clients now communicate with server S2.](images/single-primary-election.png)

Quando uma nova primária é escolhida, ela pode ter um atraso de alterações que foram aplicadas na primária antiga, mas ainda não foram aplicadas na nova. Nesse caso, até que a nova primária alcance a primária antiga, as transações de leitura/escrita podem resultar em conflitos e serem revertidas, e as transações de leitura apenas podem resultar em leituras desatualizadas. O mecanismo de controle de fluxo de replicação em grupo minimiza a diferença entre membros rápidos e lentos, e, portanto, reduz as chances de isso acontecer se estiver ativado e ajustado corretamente. Para mais informações sobre controle de fluxo, consulte a Seção 20.7.2, “Controle de Fluxo”. No MySQL 8.0.14 e versões posteriores, você também pode usar a variável de sistema `group_replication_consistency` para definir o nível de consistência de transação do grupo para evitar esse problema. Definir essa variável para `BEFORE_ON_PRIMARY_FAILOVER` (o padrão) ou qualquer nível de consistência mais alto mantém novas transações em uma primária recém-eleita até que o atraso seja aplicado.

Para obter mais informações sobre a consistência das transações, consulte a Seção 20.5.3, “Garantindo a Consistência das Transações”. Se o controle de fluxo e as garantias de consistência das transações não forem usados para um grupo, é uma boa prática aguardar que o novo primário aplique seu log de retransmissão relacionado à replicação antes de redirecionar as aplicações do cliente para ele.

##### 20.1.3.1.1 Algoritmo de Eleição Primária

O processo de eleição automática de membros primários envolve cada membro analisando a nova visualização do grupo, ordenando os potenciais novos membros primários e escolhendo o membro que se qualifica como o mais adequado. Cada membro toma sua própria decisão localmente, seguindo o algoritmo de eleição primária na versão do seu MySQL Server. Como todos os membros devem chegar à mesma decisão, os membros adaptam seu algoritmo de eleição primária se outros membros do grupo estiverem executando versões mais antigas do MySQL Server, para que tenham o mesmo comportamento do membro com a versão mais baixa do MySQL Server no grupo.

Os fatores considerados pelos membros ao eleger um candidato primário, em ordem, são os seguintes:

1. O primeiro fator considerado é qual membro ou quais membros estão executando a versão mais baixa do MySQL Server. Se todos os membros do grupo estiverem executando o MySQL 8.0.17 ou uma versão superior, os membros são ordenados primeiro pela versão do patch de sua versão. Se algum membro estiver executando o MySQL 5.7 ou o MySQL 8.0.16 ou uma versão anterior, os membros são ordenados primeiro pela versão principal de sua versão, e a versão do patch é ignorada.

2. Se mais de um membro estiver executando a versão mais baixa do MySQL Server, o segundo fator considerado é o peso do membro de cada um desses membros, conforme especificado pela variável de sistema `group_replication_member_weight` no membro. Se algum membro do grupo estiver executando o MySQL Server 5.7, onde essa variável de sistema não estava disponível, esse fator é ignorado.

   A variável de sistema `group_replication_member_weight` especifica um número no intervalo de 0 a 100. Todos os membros têm um peso padrão de 50, então defina um peso abaixo disso para reduzir a ordem deles e um peso acima disso para aumentar a ordem deles. Você pode usar essa função de ponderação para priorizar o uso de hardware melhor ou para garantir a falha para um membro específico durante a manutenção programada do primário.

3. Se mais de um membro estiver executando a versão mais baixa do servidor MySQL e mais de um desses membros tiver o maior peso do membro (ou o ponderação do membro estiver sendo ignorada), o terceiro fator considerado é a ordem lexicográfica dos UUIDs gerados de cada membro, conforme especificado pela variável de sistema `server_uuid`. O membro com o UUID do servidor mais baixo é escolhido como o primário. Este fator atua como um recurso garantido e previsível para resolver empates, para que todos os membros do grupo cheguem à mesma decisão, caso não possa ser determinado por nenhum fator importante.

##### 20.1.3.1.2 Encontrar o Primário

Para descobrir qual servidor é o principal atualmente quando implantado no modo de único principal, use a coluna `MEMBER_ROLE` na tabela `performance_schema.replication_group_members`. Por exemplo:

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

Aviso

A variável de status `group_replication_primary_member` foi descontinuada; espere-se que ela seja removida em uma versão futura.

Alternativamente, use a variável de status `group_replication_primary_member`, da seguinte forma:

```
mysql> SHOW STATUS LIKE 'group_replication_primary_member'
```
