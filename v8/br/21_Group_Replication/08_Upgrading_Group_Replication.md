## 20.8 Atualizando a Replicação de Grupo

Esta seção explica como atualizar uma configuração de Replicação em grupo. O processo básico de atualização dos membros de um grupo é o mesmo que a atualização de instâncias independentes, veja o Capítulo 3, *Atualizando o MySQL* para o processo real de atualização e os tipos disponíveis. Escolher entre uma atualização local ou lógica depende da quantidade de dados armazenados no grupo. Geralmente, uma atualização local é mais rápida e, portanto, é recomendada. Você também deve consultar a Seção 19.5.3, “Atualizando uma Topologia de Replicação”.

Enquanto você está no processo de atualização de um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server rodando ao mesmo tempo. A Replicação de grupo inclui políticas de compatibilidade que permitem combinar com segurança membros que estão executando diferentes versões do MySQL no mesmo grupo durante o procedimento de atualização. Dependendo do seu grupo, os efeitos dessas políticas podem afetar a ordem em que você deve atualizar os membros do grupo. Para obter detalhes, consulte a Seção 20.8.1, “Combinando diferentes versões de membros em um grupo”.

Se o seu grupo puder ser totalmente desativado, consulte a Seção 20.8.2, “Atualização de Replicação de Grupo Off-line”. Se o seu grupo precisa permanecer online, como é comum em implantações de produção, consulte a Seção 20.8.3, “Atualização de Replicação de Grupo Online” para as diferentes abordagens disponíveis para atualização de um grupo com o mínimo de tempo de inatividade.

### 20.8.1 Combinando diferentes versões do membro em um grupo

A Replicação em Grupo é versionada de acordo com a versão do MySQL Server com a qual o plugin de Replicação em Grupo foi empacotado. Por exemplo, se um membro está executando o MySQL 5.7.26, essa é a versão do plugin de Replicação em Grupo. Para verificar a versão do MySQL Server em um membro do grupo, siga as instruções:

```
SELECT MEMBER_HOST,MEMBER_PORT,MEMBER_VERSION FROM performance_schema.replication_group_members;
+-------------+-------------+----------------+
| member_host | member_port | member_version |
+-------------+-------------+----------------+
| example.com |	   3306     |   8.0.13	     |
+-------------+-------------+----------------+
```

Para obter orientações sobre como entender a versão do MySQL Server e selecionar uma versão, consulte a Seção 2.1.2, “Qual versão e distribuição do MySQL a instalar”.

Para compatibilidade e desempenho ótimos, todos os membros de um grupo devem executar a mesma versão do MySQL Server e, portanto, da Replicação de Grupo. No entanto, enquanto você está no processo de atualização de um grupo online, para maximizar a disponibilidade, você pode precisar ter membros com diferentes versões do MySQL Server executando ao mesmo tempo. Dependendo das alterações feitas entre as versões do MySQL, você pode encontrar incompatibilidades nessa situação. Por exemplo, se uma funcionalidade tiver sido descontinuada entre as versões principais, então combinar as versões em um grupo pode causar falhas em membros que dependem da funcionalidade descontinuada. Por outro lado, escrever em um membro que executa uma versão mais recente do MySQL enquanto há membros de leitura e escrita no grupo executando uma versão mais antiga do MySQL pode causar problemas em membros que não possuem funções introduzidas na versão mais recente.

Para evitar esses problemas, a Replicação em Grupo inclui políticas de compatibilidade que permitem combinar com segurança membros que executam diferentes versões do MySQL no mesmo grupo. Um membro aplica essas políticas para decidir se deve se juntar ao grupo normalmente, ou se deve se juntar em modo de leitura somente, ou não se juntar ao grupo, dependendo da escolha que resulta na operação segura do membro que se junta e dos membros existentes do grupo. Em um cenário de atualização, cada servidor deve deixar o grupo, ser atualizado e se juntar ao grupo com sua nova versão de servidor. Neste ponto, o membro aplica as políticas para sua nova versão de servidor, que pode ter mudado das políticas que ele aplicou quando originalmente se juntou ao grupo.

Como administrador, você pode instruir qualquer servidor a tentar se juntar a qualquer grupo, configurando o servidor adequadamente e emitindo uma declaração `START GROUP_REPLICATION`. A decisão de se juntar ou não ao grupo, ou de se juntar ao grupo no modo de leitura apenas, é feita e implementada pelo próprio membro que está se juntando, após você tentar adicioná-lo ao grupo. O membro que está se juntando recebe informações sobre as versões do MySQL Server dos membros atuais do grupo, avalia sua própria compatibilidade com esses membros e aplica as políticas usadas em sua própria versão do MySQL Server (*não* as políticas usadas pelos membros existentes) para decidir se é compatível.

As políticas de compatibilidade que um membro que se junta aplica ao tentar se juntar a um grupo são as seguintes:

* Um membro não se junta a um grupo se estiver executando uma versão do MySQL Server inferior à versão mais baixa que os membros do grupo existentes estão executando.

* Um membro se junta a um grupo normalmente se estiver executando a mesma versão do servidor MySQL que a versão mais baixa que os membros do grupo existentes estão executando.

* Um membro se junta a um grupo, mas permanece no modo de leitura se estiver executando uma versão do MySQL Server mais alta do que a versão mínima que os membros do grupo existentes estão executando. Esse comportamento só faz diferença quando o grupo está executando no modo multi-primário, porque em um grupo que está executando no modo single-primário, os membros recém-adicionados, por padrão, são de leitura em qualquer caso.

Os membros que executam o MySQL 8.0.17 ou superior devem considerar a versão do patch do lançamento ao verificar a compatibilidade. Os membros que executam o MySQL 8.0.16 ou inferior, ou o MySQL 5.7, devem considerar apenas a versão principal. Por exemplo, se você tiver um grupo com membros executando todas as versões do MySQL 8.0.13:

* Um membro que está executando a versão MySQL 5.7 não se junta. * Um membro que está executando MySQL 8.0.16 se junta normalmente (porque ele considera a versão principal).

* Um membro que executa o MySQL 8.0.17 se junta, mas permanece no modo somente leitura (porque considera a versão do patch).

Observe que, ao fazer a junção de membros que executam versões do MySQL antes do MySQL 5.7.27, verifique se todos os membros do grupo têm a versão principal do MySQL mais baixa. Portanto, eles falham nessa verificação para um grupo onde qualquer membro esteja executando versões do MySQL 8.0, e não podem se juntar ao grupo, mesmo que ele já tenha outros membros executando versões do MySQL 5.7. A partir do MySQL 5.7.27, a verificação de junção verifica apenas os membros do grupo que estão executando a versão principal mais baixa, para que possam se juntar a um grupo de versão mista onde outros servidores do MySQL 5.7 estão presentes.

Em um grupo de modo multi-primario com membros que usam diferentes versões do MySQL Server, a Replicação de Grupo gerencia automaticamente o status de leitura e escrita e apenas de leitura dos membros que executam o MySQL 8.0.17 ou versões superiores. Se um membro sair do grupo, os membros que executam a versão que agora é a mais baixa são automaticamente configurados para o modo de leitura e escrita. Quando você altera um grupo que estava executando em modo de único primário para executar em modo multi-primário, usando a função `group_replication_switch_to_multi_primary_mode()`, a Replicação de Grupo configura automaticamente os membros no modo correto. Os membros são automaticamente colocados no modo apenas de leitura se estiverem executando uma versão do servidor MySQL mais alta do que a versão mais baixa presente no grupo, e os membros que executam a versão mais baixa são colocados no modo de leitura e escrita.

#### 20.8.1.1 Versões dos membros durante as atualizações

Durante um procedimento de atualização online, se o grupo estiver no modo de único primário, todos os servidores que não estão atualmente fora de linha para atualização funcionam como antes. O grupo elege um novo primário sempre que necessário, seguindo as políticas de eleição descritas na Seção 20.1.3.1, “Modo de Único Primário”. Note que, se você precisar que o primário permaneça o mesmo durante todo o processo (exceto quando ele está sendo atualizado), você deve primeiro atualizar todos os segundos para uma versão maior ou igual à versão do membro primário alvo, e depois atualizar o primário por último. O primário não pode permanecer como primário a menos que esteja executando a versão mais baixa do MySQL Server no grupo. Após a atualização do primário, você pode usar a função `group_replication_set_as_primary()` para reaproximá-lo como primário.

Se o grupo estiver no modo multi-primario, menos membros online estarão disponíveis para realizar gravações durante o procedimento de atualização, porque os membros atualizados se juntam no modo de leitura somente após sua atualização. A partir do MySQL 8.0.17, isso se aplica a atualizações entre versões de patch, e para versões menores, isso se aplica apenas a atualizações entre versões principais. Quando todos os membros tiverem sido atualizados para a mesma versão, a partir do MySQL 8.0.17, eles todos voltam automaticamente para o modo de leitura e escrita. Para versões anteriores, você deve definir `super_read_only` para `OFF` manualmente em cada membro que deve funcionar como principal após a atualização.

Para lidar com uma situação problemática, por exemplo, se você precisar reverter uma atualização ou adicionar capacidade extra a um grupo em uma emergência, é possível permitir que um membro se junte a um grupo online, mesmo que esteja executando uma versão do MySQL Server inferior à versão mais baixa utilizada pelos outros membros do grupo. A variável do sistema de Replicação do Grupo `group_replication_allow_local_lower_version_join` pode ser usada em tais situações para anular as políticas de compatibilidade normais.

Importante

Definir `group_replication_allow_local_lower_version_join` para `ON` *não* torna o novo membro compatível com o grupo; fazer isso permite que ele se junte ao grupo sem quaisquer salvaguardas contra comportamentos incompatíveis dos membros existentes. Portanto, isso deve ser usado apenas com cuidado em situações específicas, e você deve tomar precauções adicionais para evitar que o novo membro falhe devido à atividade normal do grupo. Veja a descrição desta variável para obter mais informações.

#### 20.8.1.2 Versão do Protocolo de Comunicação de Replicação em Grupo

Um grupo de replicação utiliza uma versão do protocolo de comunicação de Replicação de Grupo que pode diferir da versão do MySQL Server dos membros. Para verificar a versão do protocolo de comunicação do grupo, execute a seguinte declaração em qualquer membro:

```
SELECT group_replication_get_communication_protocol();
```

O valor de retorno mostra a versão mais antiga do MySQL Server que pode se juntar a este grupo e usar o protocolo de comunicação do grupo. As versões do MySQL 5.7.14 permitem a compressão de mensagens, e as versões do MySQL 8.0.16 também permitem a fragmentação de mensagens. Note que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, que pode diferir do número de versão que foi passado para a função `group_replication_set_communication_protocol()` e da versão do MySQL Server que está instalada no membro onde você usa a função.

Quando você atualiza todos os membros de um grupo de replicação para uma nova versão do MySQL Server, o protocolo de comunicação da Replicação do Grupo não é atualizado automaticamente, caso ainda haja a necessidade de permitir que os membros de versões anteriores se juntem. Se você não precisa suportar membros mais antigos e deseja permitir que os membros atualizados usem quaisquer recursos de comunicação adicionais, após a atualização, use a função `group_replication_set_communication_protocol()` para atualizar o protocolo de comunicação, especificando a nova versão do MySQL Server para a qual você atualizou os membros. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

### 20.8.2 Atualização de Replicação em Modo Off-line para Grupos

Para realizar uma atualização off-line de um grupo de Replicação de Grupo, você remove cada membro do grupo, realiza uma atualização do membro e, em seguida, reinicia o grupo como de costume. Em um grupo multi-primário, você pode desligar os membros em qualquer ordem. Em um grupo único-primário, desligue cada secundário primeiro e, em seguida, finalmente o primário. Veja a Seção 20.8.3.2, “Atualizando um Membro de Replicação de Grupo” para saber como remover membros de um grupo e desligar o MySQL.

Depois que o grupo estiver offline, atualize todos os membros. Veja o Capítulo 3, *Atualizando o MySQL*, para saber como realizar a atualização. Quando todos os membros tiverem sido atualizados, reinicie os membros.

Se você atualizar todos os membros de um grupo de replicação quando eles estiverem offline e, em seguida, reiniciar o grupo, os membros se juntam usando a versão do protocolo de comunicação da Replicação de Grupo da nova versão, para que se torne a versão do protocolo de comunicação do grupo. Se você tiver a necessidade de permitir que membros de versões anteriores se juntem, você pode usar a função `group_replication_set_communication_protocol()` para fazer o downgrade da versão do protocolo de comunicação, especificando a versão do servidor MySQL do membro do grupo em questão que tem a versão do servidor instalada mais antiga.

### 20.8.3 Atualização online de replicação em grupo

Quando você tem um grupo em execução que você deseja atualizar, mas precisa manter o grupo online para atender à sua aplicação, você precisa considerar sua abordagem para a atualização. Esta seção descreve os diferentes elementos envolvidos em uma atualização online e vários métodos de como atualizar seu grupo.

#### 20.8.3.1 Considerações sobre a Atualização Online

Ao atualizar um grupo online, você deve considerar os seguintes pontos:

* Independentemente da forma como você atualiza seu grupo, é importante desativar quaisquer gravações para os membros do grupo até que estejam prontos para se juntar ao grupo novamente.

* Quando um membro é interrompido, a variável `super_read_only` é definida como ativa automaticamente, mas essa alteração não é persistente.

* Quando o MySQL 5.7.22 ou o MySQL 8.0.11 tenta se juntar a um grupo que está executando o MySQL 5.7.21 ou versões anteriores, ele não consegue se juntar ao grupo porque o MySQL 5.7.21 não envia seu valor de `lower_case_table_names`.

#### 20.8.3.2 Atualizando um membro da replicação de grupo

Esta seção explica os passos necessários para atualizar um membro de um grupo. Este procedimento faz parte dos métodos descritos na Seção 20.8.3.3, “Métodos de Atualização Online de Replicação de Grupo”. O processo de atualização de um membro de um grupo é comum a todos os métodos e é explicado primeiro. A maneira pela qual você se junta aos membros atualizados pode depender do método que você está seguindo, e outros fatores, como se o grupo está operando em modo de único ou múltiplo primário. A forma como você atualiza a instância do servidor, usando a abordagem de implantação ou provisionamento, não afeta os métodos descritos aqui.

O processo de atualização de um membro consiste em removê-lo do grupo, seguindo o método escolhido para atualizar o membro, e depois reconectar o membro atualizado a um grupo. A ordem recomendada para atualizar membros em um grupo de único primário é atualizar todos os secundários e, em seguida, o primário por último. Se o primário for atualizado antes de um secundário, um novo primário usando a versão MySQL mais antiga é escolhido, mas não há necessidade desse passo.

Para atualizar um membro de um grupo:

* Conecte um cliente ao membro do grupo e emita `STOP GROUP_REPLICATION`. Antes de prosseguir, garanta que o status do membro seja `OFFLINE` monitorando a tabela `replication_group_members`.

* Desative a Replicação em Grupo para que você possa se conectar com segurança ao membro após a atualização e configurá-lo sem que ele se junte ao grupo, definindo `group_replication_start_on_boot=0`.

Importante

Se um membro atualizado tiver `group_replication_start_on_boot=1`, ele poderá se reincorporar ao grupo antes que você possa realizar o procedimento de atualização do MySQL e isso pode resultar em problemas. Por exemplo, se a atualização falhar e o servidor reiniciar novamente, então um servidor possivelmente quebrado poderá tentar se juntar ao grupo.

* Parar o membro, por exemplo, usando [**mysqladmin shutdown**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")] ou a declaração `SHUTDOWN`. Qualquer outro membro no grupo continua em execução.

* Atualize o membro, usando a abordagem de implantação ou provisionamento. Consulte o Capítulo 3, *Atualizando o MySQL*, para obter detalhes. Ao reiniciar o membro atualizado, porque `group_replication_start_on_boot` está definido como 0, a Replicação de Grupo não é iniciada na instância e, portanto, não se reconecta ao grupo.

* Uma vez que o procedimento de atualização do MySQL tenha sido realizado no membro, o `group_replication_start_on_boot` deve ser definido como 1 para garantir que a Replicação do Grupo comece corretamente após o reinício. Reinicie o membro.

* Conecte-se ao membro atualizado e emita `START GROUP_REPLICATION`. Isso reconecta o membro ao grupo. Os metadados da Replicação de Grupo estão em vigor no servidor atualizado, portanto, geralmente não é necessário reconfigurar a Replicação de Grupo. O servidor precisa acompanhar quaisquer transações processadas pelo grupo enquanto o servidor estava offline. Uma vez que tenha acompanhado o grupo, ele se torna um membro online do grupo.

Nota

Quanto mais tempo leva para atualizar um servidor, mais tempo o membro fica offline e, portanto, mais tempo leva para o servidor se atualizar quando adicionado de volta ao grupo.

Quando um membro atualizado se junta a um grupo que tem algum membro executando uma versão anterior do MySQL Server, o membro atualizado se junta com `super_read_only=on`. Isso garante que nenhuma escrita seja feita em membros atualizados até que todos os membros estejam executando a versão mais nova. Em um grupo de modo multi-primário, quando a atualização tiver sido concluída com sucesso e o grupo estiver pronto para processar transações, os membros que são destinados como primárias legíveis devem ser configurados no modo de leitura e escrita. A partir do MySQL 8.0.17, quando todos os membros de um grupo tiverem sido atualizados para a mesma versão, todos eles voltam automaticamente para o modo de leitura e escrita. Para versões anteriores, você deve configurar cada membro manualmente no modo de leitura e escrita. Conecte-se a cada membro e emita:

```
SET GLOBAL super_read_only=OFF;
```

#### 20.8.3.3 Métodos de atualização online de replicação em grupo

Escolha um dos seguintes métodos para atualizar um grupo de replicação de grupo:

##### Upgrade Rolling In-Group

Este método é suportado, desde que os servidores que executam uma versão mais recente não gerem carga de trabalho para o grupo, enquanto ainda existem servidores com uma versão mais antiga. Em outras palavras, os servidores com uma versão mais recente podem se juntar ao grupo apenas como secundários. Neste método, há sempre apenas um grupo, e cada instância do servidor é removida do grupo, atualizada e, em seguida, reconectada ao grupo.

Este método é bem adequado para grupos de primário único. Quando o grupo está operando no modo de primário único, se você precisar que o primário permaneça o mesmo durante todo o tempo (exceto quando ele está sendo atualizado ele mesmo), ele deve ser o último membro a ser atualizado. O primário não pode permanecer como o primário a menos que esteja executando a versão mais baixa do MySQL Server no grupo. Após o primário ter sido atualizado, você pode usar a função `group_replication_set_as_primary()` para reaproximá-lo como o primário. Se você não se importa com qual membro é o primário, os membros podem ser atualizados em qualquer ordem. O grupo elege um novo primário sempre que necessário, entre os membros que estão executando a versão mais baixa do MySQL Server, seguindo as políticas de eleição descritas na Seção 20.1.3.1, "Modo de Primário Único".

Para grupos que operam no modo multi-primaria, durante uma atualização automática no grupo, o número de primárias é reduzido, causando uma redução na disponibilidade de escrita. Isso ocorre porque, se um membro se junta a um grupo quando ele está executando uma versão do MySQL Server mais alta do que a versão mais baixa que os membros do grupo existentes estão executando, ele permanece automaticamente no modo somente leitura (`super_read_only=ON`). Note que os membros que executam o MySQL 8.0.17 ou superior levam em conta a versão do patch do lançamento ao verificar isso, mas os membros que executam o MySQL 8.0.16 ou inferior, ou o MySQL 5.7, levam em conta apenas a versão principal. Quando todos os membros foram atualizados para a mesma versão, a partir do MySQL 8.0.17, todos eles voltam automaticamente ao modo de leitura e escrita. Para versões anteriores, você deve definir manualmente `super_read_only=OFF` em cada membro que deve funcionar como uma principal após a atualização.

Para obter informações completas sobre a compatibilidade das versões em um grupo e como isso influencia o comportamento de um grupo durante um processo de atualização, consulte a Seção 20.8.1, “Combinando diferentes versões de membros em um grupo”.

##### Atualização de Migração Rolling

Nesse método, você remove membros do grupo, atualiza-os e, em seguida, cria um segundo grupo usando os membros atualizados. Para grupos que operam no modo multi-primaria, durante esse processo, o número de primárias é reduzido, causando uma redução na disponibilidade de escrita. Isso não afeta grupos que operam no modo single-primaria.

Como o grupo que está executando a versão mais antiga está online enquanto você está atualizando os membros, é necessário que o grupo que está executando a versão mais recente acompanhe quaisquer transações executadas enquanto os membros estavam sendo atualizados. Portanto, um dos servidores do novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo acompanhe o grupo mais antigo. Como esse método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, veja o Capítulo 19, *Replicação*. Para grupos que operam no modo de único primário, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo de múltiplos primários, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é o seguinte:

* remova os membros do grupo original que executa a versão do servidor mais antiga, um a um, veja a Seção 20.8.3.2, “Atualizando um membro da replicação de grupo”

* atualize a versão do servidor que está sendo executada no membro, veja o Capítulo 3, *Atualizando o MySQL*. Você pode seguir uma abordagem de atualização in-place ou de provisionamento.

* crie um novo grupo com os membros atualizados, veja o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o grupo antigo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

* configure um canal de replicação assíncrona entre o grupo antigo e o novo grupo, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem de replicação assíncrona e o novo membro do grupo como uma replica baseada em GTID.

Antes de poder redirecionar sua aplicação para o novo grupo, você deve garantir que o novo grupo tenha um número adequado de membros, por exemplo, para que o grupo possa lidar com a falha de um membro. Emite `SELECT * FROM performance_schema.replication_group_members` e compare o tamanho inicial do grupo com o tamanho do novo grupo. Aguarde até que todos os dados do grupo antigo sejam propagados para o novo grupo e, em seguida, interrompa a conexão de replicação assíncrona e atualize os membros ausentes.

Atualização de Duplicação Rotativa

Nesse método, você cria um segundo grupo composto por membros que estão executando a versão mais recente, e os dados ausentes do grupo mais antigo são replicados para o grupo mais recente. Isso pressupõe que você tenha servidores suficientes para executar ambos os grupos simultaneamente. Devido ao fato de que, durante esse processo, o número de primários *não* é reduzido, para grupos que operam no modo multi-primário, não há redução na disponibilidade de escrita. Isso torna a atualização por duplicação em rotação bem adequada para grupos que operam no modo multi-primário. Isso não afeta grupos que operam no modo single-primário.

Como o grupo que executa a versão mais antiga está online enquanto você está provisionando os membros do novo grupo, é necessário que o grupo que executa a versão mais recente acompanhe quaisquer transações executadas enquanto os membros estavam sendo provisionados. Portanto, um dos servidores do novo grupo é configurado como uma replica de um primário do grupo mais antigo. Isso garante que o novo grupo acompanhe o grupo mais antigo. Como esse método depende de um canal de replicação assíncrona que é usado para replicar dados de um grupo para outro, ele é suportado sob as mesmas suposições e requisitos da replicação assíncrona de fonte-replica, consulte o Capítulo 19, *Replicação*. Para grupos que operam no modo de único primário, a conexão de replicação assíncrona com o grupo antigo deve enviar dados para o primário no novo grupo, para um grupo de múltiplos primários, o canal de replicação assíncrona pode se conectar a qualquer primário.

O processo é o seguinte:

* implementar um número adequado de membros para que o grupo que executa a versão mais recente possa lidar com a falha de um membro

* faça um backup dos dados existentes de um membro do grupo

* use o backup do membro mais antigo para provisionar os membros do novo grupo, consulte a Seção 20.8.3.4, “Atualização da Replicação de Grupo com mysqlbackup”, para um método.

Nota

Você deve restaurar o backup para a mesma versão do MySQL da qual o backup foi feito e, em seguida, realizar uma atualização local. Para obter instruções, consulte o Capítulo 3, *Atualizando o MySQL*.

* crie um novo grupo com os membros atualizados, veja o Capítulo 20, *Replicação de Grupo*. Neste caso, você precisa configurar um novo nome de grupo em cada membro (porque o grupo antigo ainda está em execução e usando o nome antigo), inicializar um membro atualizado inicial e, em seguida, adicionar os membros atualizados restantes.

* configure um canal de replicação assíncrona entre o grupo antigo e o novo grupo, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”. Configure o primário mais antigo para funcionar como o servidor de origem de replicação assíncrona e o novo membro do grupo como uma replica baseada em GTID.

Assim que os dados em andamento que faltam do grupo mais recente forem pequenos o suficiente para serem rapidamente transferidos, você deve redirecionar as operações de escrita para o novo grupo. Aguarde até que todos os dados do grupo antigo sejam propagados para o novo grupo e, em seguida, elimine a conexão de replicação assíncrona.

#### 20.8.3.4 Atualização de Replicação de Grupo com mysqlbackup

Como parte de uma abordagem de provisionamento, você pode usar o MySQL Enterprise Backup para copiar e restaurar os dados de um membro do grupo para novos membros. No entanto, você não pode usar essa técnica para restaurar diretamente um backup tirado de um membro que está executando uma versão mais antiga do MySQL para um membro que está executando uma versão mais recente do MySQL. A solução é restaurar o backup em uma nova instância do servidor que esteja executando a mesma versão do MySQL que o membro do qual o backup foi tirado, e depois atualizar a instância. Esse processo consiste em:

* Faça um backup de um membro do grupo mais antigo usando **mysqlbackup**. Veja a Seção 20.5.6, “Usando o MySQL Enterprise Backup com Replicação de Grupo”.

* Implante uma nova instância do servidor, que deve estar executando a mesma versão do MySQL que o membro mais antigo onde o backup foi feito.

* Restaure o backup do membro mais antigo para a nova instância usando **mysqlbackup**.

* Atualize o MySQL na nova instância, veja o Capítulo 3, *Atualizando o MySQL*.

Repita esse processo para criar um número adequado de novas instâncias, por exemplo, para poder lidar com uma falha de replicação. Em seguida, junte as instâncias a um grupo com base na Seção 20.8.3.3, “Métodos de Atualização de Replicação Online”.