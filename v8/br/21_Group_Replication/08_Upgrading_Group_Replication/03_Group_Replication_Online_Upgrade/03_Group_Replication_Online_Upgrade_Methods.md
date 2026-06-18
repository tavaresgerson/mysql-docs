#### 20.8.3.3 Métodos de Atualização Online da Replicação em Grupo

Escolha um dos seguintes métodos para atualizar um grupo de replicação em grupo:

##### Upgrado Rolling In-Group

Este método é suportado, desde que os servidores que executam uma versão mais recente não estejam gerando carga de trabalho para o grupo enquanto ainda houver servidores com uma versão mais antiga. Em outras palavras, os servidores com uma versão mais recente só podem se juntar ao grupo como secundários. Neste método, há apenas um grupo e cada instância do servidor é removida do grupo, atualizada e, em seguida, reintegrada ao grupo.

Este método é adequado para grupos de único primário. Quando o grupo estiver operando no modo de único primário, se você precisar que o primário permaneça o mesmo durante todo o processo (exceto quando ele estiver sendo atualizado), ele deve ser o último membro a ser atualizado. O primário não pode permanecer como primário a menos que esteja executando a versão mais baixa do MySQL Server no grupo. Após a atualização do primário, você pode usar a função `group_replication_set_as_primary()` para reapontá-lo como primário. Se você não se importa com qual membro será o primário, os membros podem ser atualizados em qualquer ordem. O grupo elege um novo primário sempre que necessário, entre os membros que estão executando a versão mais baixa do MySQL Server, seguindo as políticas de eleição descritas na Seção 20.1.3.1, “Modo de Único Primário”.

Para grupos que operam no modo multi-primárias, durante uma atualização em andamento no grupo, o número de primárias é reduzido, causando uma redução na disponibilidade de escrita. Isso ocorre porque, se um membro se junta a um grupo quando ele está executando uma versão do MySQL Server mais alta do que a versão mais baixa que os membros do grupo existentes estão executando, ele permanece automaticamente no modo de leitura apenas (`super_read_only=ON`). Observe que os membros que estão executando o MySQL 8.0.17 ou superior levam em consideração a versão do patch do lançamento ao verificar isso, mas os membros que estão executando o MySQL 8.0.16 ou versões inferiores, ou o MySQL 5.7, levam em consideração apenas a versão principal. Quando todos os membros foram atualizados para a mesma versão, a partir do MySQL 8.0.17, eles todos voltam automaticamente ao modo de leitura e escrita. Para versões anteriores, você deve definir manualmente `super_read_only=OFF` em cada membro que deve funcionar como primário após a atualização.

Para obter informações completas sobre a compatibilidade das versões em um grupo e como isso influencia o comportamento de um grupo durante um processo de atualização, consulte a Seção 20.8.1, “Combinando Diferentes Versões de Membros em um Grupo”.

##### Atualização de Migração Rolling

Nesse método, você remove membros do grupo, atualiza-os e, em seguida, cria um segundo grupo usando os membros atualizados. Para grupos que operam no modo multi-primárias, durante esse processo, o número de primárias é reduzido, causando uma redução na disponibilidade de escrita. Isso não afeta grupos que operam no modo de única primária.

Como o grupo que está executando a versão mais antiga está online enquanto você está atualizando os membros, é necessário que o grupo que está executando a versão mais recente consiga acompanhar quaisquer transações executadas enquanto os membros estavam sendo atualizados. Portanto, um dos servidores do novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo consiga acompanhar o grupo mais antigo. Como esse método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, consulte o Capítulo 19, *Replicação*. Para grupos que operam no modo de primário único, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo de múltiplos primários, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é o seguinte:

- remova os membros do grupo original que está executando a versão do servidor mais antiga, um por um, veja a Seção 20.8.3.2, “Atualizando um Membro da Replicação de Grupo”

- Para atualizar a versão do servidor em execução no membro, consulte o Capítulo 3, *Atualizando o MySQL*. Você pode seguir uma abordagem de atualização local ou de provisionamento.

- Crie um novo grupo com os membros atualizados, veja o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o grupo antigo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

- Configure um canal de replicação assíncrona entre o grupo antigo e o novo, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem da replicação assíncrona e o novo membro do grupo como uma replica baseada em GTIDs.

Antes de poder redirecionar sua aplicação para o novo grupo, você deve garantir que o novo grupo tenha um número adequado de membros, por exemplo, para que o grupo possa lidar com a falha de um membro. Emite `SELECT * FROM performance_schema.replication_group_members` e compare o tamanho inicial do grupo com o novo tamanho do grupo. Aguarde até que todos os dados do grupo antigo sejam propagados para o novo grupo e, em seguida, interrompa a conexão de replicação assíncrona e atualize os membros ausentes.

##### Atualização de Duplicação em Rodada

Nesse método, você cria um segundo grupo composto por membros que estão executando a versão mais recente, e os dados ausentes do grupo mais antigo são replicados para o grupo mais recente. Isso pressupõe que você tenha servidores suficientes para executar ambos os grupos simultaneamente. Devido ao fato de que, durante esse processo, o número de primários *não* é reduzido, para grupos que operam no modo multi-primário, não há redução na disponibilidade de escrita. Isso torna a atualização por duplicação em rotação adequada para grupos que operam no modo multi-primário. Isso não afeta grupos que operam no modo single-primário.

Como o grupo que está executando a versão mais antiga está online enquanto você está provisionando os membros do novo grupo, é necessário que o grupo que está executando a versão mais recente consiga acompanhar quaisquer transações executadas enquanto os membros estavam sendo provisionados. Portanto, um dos servidores do novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo consiga acompanhar o grupo mais antigo. Como esse método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, consulte o Capítulo 19, *Replicação*. Para grupos que operam no modo de primário único, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo de múltiplos primários, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é o seguinte:

- disponibilize um número adequado de membros para que o grupo que executa a versão mais recente possa lidar com a falha de um membro

- faça um backup dos dados existentes de um membro do grupo

- Use o backup do membro mais antigo para provisionar os membros do novo grupo, consulte a Seção 20.8.3.4, “Atualização da Replicação de Grupo com mysqlbackup”, para um método.

  Nota

  Você deve restaurar o backup para a mesma versão do MySQL de onde o backup foi feito e, em seguida, realizar uma atualização local. Para obter instruções, consulte o Capítulo 3, *Atualizando o MySQL*.

- Crie um novo grupo com os membros atualizados, veja o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o grupo antigo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

- Configure um canal de replicação assíncrona entre o grupo antigo e o novo, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem da replicação assíncrona e o novo membro do grupo como uma replica baseada em GTIDs.

Depois que os dados em andamento faltando do grupo mais recente forem pequenos o suficiente para serem transferidos rapidamente, você deve redirecionar as operações de escrita para o novo grupo. Aguarde até que todos os dados do grupo antigo sejam propagados para o novo grupo e, em seguida, interrompa a conexão de replicação assíncrona.
