#### 20.8.3.3 Métodos de Atualização Online de Replicação em Grupo

Escolha um dos seguintes métodos para atualizar um grupo de Replicação em Grupo:

##### Atualização Rolling em Grupo

Este método é suportado desde que os servidores que executam uma versão mais recente não estejam gerando carga de trabalho para o grupo enquanto ainda houver servidores com uma versão mais antiga nele. Em outras palavras, os servidores com uma versão mais recente podem se juntar ao grupo apenas como secundários. Neste método, há sempre um único grupo, e cada instância do servidor é removida do grupo, atualizada e depois reintegrada ao grupo.

Este método é bem adequado para grupos de único primário. Quando o grupo está operando no modo de único primário, se você precisar que o primário permaneça o mesmo ao longo do tempo (exceto quando ele está sendo atualizado), ele deve ser o último membro a ser atualizado. O primário não pode permanecer como primário a menos que esteja executando a versão mais baixa do MySQL Server no grupo. Após a atualização do primário, você pode usar a função `group_replication_set_as_primary()` para reapontá-lo como primário. Se você não se importa com qual membro é o primário, os membros podem ser atualizados em qualquer ordem. O grupo elege um novo primário sempre que necessário, entre os membros que estão executando a versão mais baixa do MySQL Server, seguindo as políticas de eleição descritas na Seção 20.1.3.1, “Modo de Único Primário”.

Para grupos que operam no modo de múltiplos primárias, durante uma atualização Rolling em Grupo, o número de primárias é reduzido, causando uma redução na disponibilidade de escrita. Isso ocorre porque, se um membro se junta a um grupo quando está executando uma versão mais alta do MySQL Server do que a versão mais baixa que os membros do grupo existentes estão executando, ele permanece automaticamente no modo de leitura apenas (`super_read_only=ON`).

Para obter informações completas sobre a compatibilidade das versões em um grupo e como isso influencia o comportamento de um grupo durante o processo de atualização, consulte a Seção 20.8.1, “Combinando Diferentes Versões de Membros em um Grupo”.

##### Atualização por Migração Rolling

Neste método, você remove membros do grupo, atualiza-os e, em seguida, cria um segundo grupo usando os membros atualizados. Para grupos que operam no modo multi-primário, durante esse processo, o número de primários é reduzido, causando uma redução na disponibilidade de escrita. Isso não afeta grupos que operam no modo single-primário.

Como o grupo que executa a versão mais antiga está online enquanto você está atualizando os membros, é necessário que o grupo que executa a versão mais recente acompanhe quaisquer transações executadas enquanto os membros estavam sendo atualizados. Portanto, um dos servidores no novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo acompanhe o grupo mais antigo. Como este método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, consulte o Capítulo 19, *Replicação*. Para grupos que operam no modo single-primário, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo multi-primário, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é o seguinte:

* remover membros do grupo original que executa a versão do servidor mais antiga, um por um, consulte a Seção 20.8.3.2, “Atualizando um Membro de Replicação de Grupo”
* atualizar a versão do servidor que está sendo executada no membro, consulte o Capítulo 3, *Atualizando o MySQL*. Você pode seguir uma abordagem de implantação ou provisionamento para a atualização.

* crie um novo grupo com os membros atualizados, veja o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o antigo grupo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

* configure um canal de replicação assíncrona entre o antigo grupo e o novo grupo, veja a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem da replicação assíncrona e o membro do novo grupo como uma replica baseada em GTID.

Antes de poder redirecionar sua aplicação para o novo grupo, você deve garantir que o novo grupo tenha um número adequado de membros, por exemplo, para que o grupo possa lidar com a falha de um membro. Execute `SELECT * FROM performance_schema.replication_group_members` e compare o tamanho inicial do grupo e o tamanho do novo grupo. Aguarde até que todos os dados do antigo grupo sejam propagados para o novo grupo e, em seguida, interrompa a conexão de replicação assíncrona e atualize os membros ausentes.

##### Atualização por Duplicação Rotativa

Neste método, você cria um segundo grupo composto por membros que estão executando a versão mais recente, e os dados ausentes do grupo mais antigo são replicados para o grupo mais recente. Isso pressupõe que você tem servidores suficientes para executar ambos os grupos simultaneamente. Devido ao fato de que, durante esse processo, o número de primários *não* é reduzido, para grupos que operam no modo multi-primário, não há redução na disponibilidade de escrita. Isso torna a atualização por duplicação rotativa bem adequada para grupos que operam no modo multi-primário. Isso não afeta grupos que operam no modo single-primário.

Como o grupo que está executando a versão mais antiga está online enquanto você está provisionando os membros do novo grupo, é necessário que o grupo que está executando a versão mais recente consiga acompanhar quaisquer transações executadas enquanto os membros estavam sendo provisionados. Portanto, um dos servidores do novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo consiga acompanhar o grupo mais antigo. Como esse método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, consulte o Capítulo 19, *Replicação*. Para grupos que operam no modo de primário único, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo de múltiplos primários, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é:

* implantar um número adequado de membros para que o grupo que está executando a versão mais recente possa lidar com a falha de um membro

* fazer um backup dos dados existentes de um membro do grupo

* usar o backup do membro mais antigo para provisionar os membros do novo grupo, consulte a Seção 20.8.3.4, “Atualização da Replicação de Grupo com **mysqlbackup”** para um método.

Nota

Você deve restaurar o backup para a mesma versão do MySQL da qual o backup foi feito e, em seguida, realizar uma atualização in-place. Para instruções, consulte o Capítulo 3, *Atualização do MySQL*.

* criar um novo grupo com os membros atualizados, consulte o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o grupo antigo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

* configure um canal de replicação assíncrona entre o grupo antigo e o novo grupo, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem da replicação assíncrona e o novo membro do grupo como uma replica baseada em GTIDs.

Assim que os dados em andamento faltando do novo grupo forem pequenos o suficiente para serem transferidos rapidamente, você deve redirecionar as operações de escrita para o novo grupo. Aguarde até que todos os dados do grupo antigo sejam propagados para o novo grupo e, em seguida, interrompa a conexão de replicação assíncrona.