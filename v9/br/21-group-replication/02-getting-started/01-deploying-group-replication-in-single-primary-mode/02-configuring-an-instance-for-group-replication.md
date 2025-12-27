#### 20.2.1.2 Configurando uma Instância para Replicação em Grupo

Esta seção explica as configurações necessárias para as instâncias do MySQL Server que você deseja usar para a Replicação em Grupo. Para informações de fundo, consulte a Seção 20.3, “Requisitos e Limitações”.

* Motores de Armazenamento
* Estrutura de Replicação
* Configurações de Replicação em Grupo

##### Motores de Armazenamento

Para a Replicação em Grupo, os dados devem ser armazenados no motor de armazenamento transacional InnoDB (para detalhes sobre o motivo, consulte a Seção 20.3.1, “Requisitos para Replicação em Grupo”). O uso de outros motores de armazenamento, incluindo o motor de armazenamento `MEMORY` temporário, pode causar erros na Replicação em Grupo. Defina a variável de sistema `disabled_storage_engines` da seguinte forma para impedir seu uso:

```
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

##### Estrutura de Replicação

As seguintes configurações configuram a replicação de acordo com os requisitos da Replicação em Grupo do MySQL.

```
server_id=1
gtid_mode=ON
enforce_gtid_consistency=ON
```

Essas configurações configuram o servidor para usar o número de identificador único 1, para habilitar a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”, e para permitir a execução apenas de instruções que podem ser registradas com segurança usando um GTID.

Esta configuração desabilita os checksums para eventos escritos no log binário, que são habilitados por padrão. A Replicação em Grupo no MySQL 9.5 suporta a presença de checksums no log binário e pode usá-los para verificar a integridade dos eventos em alguns canais, então você pode usar o ajuste padrão. Para mais detalhes, consulte a Seção 20.3.2, “Limitações da Replicação em Grupo”.

Veja também a Seção 20.3.1, “Requisitos para Replicação em Grupo”.

##### Configurações de Replicação em Grupo

Neste ponto, o arquivo de opção garante que o servidor esteja configurado e instrui-o a instanciar a infraestrutura de replicação sob uma configuração específica. A seção seguinte configura as configurações de Replicação por Grupo para o servidor.

```
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

* `plugin-load-add` adiciona o plugin de Replicação por Grupo à lista de plugins que o servidor carrega ao iniciar. Isso é preferível em uma implantação em produção em vez de instalar o plugin manualmente.

* Configurar `group_replication_group_name` informa ao plugin que o grupo ao qual ele está se juntando ou criando é chamado de "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

O valor de `group_replication_group_name` deve ser um UUID válido. Você pode usar `SELECT UUID()` para gerar um. Esse UUID faz parte dos GTIDs que são usados quando as transações recebidas pelos membros do grupo de clientes e eventos de visualização de alterações gerados internamente pelos membros do grupo são escritos no log binário.

* Configurar a variável `group_replication_start_on_boot` para `off` instrui o plugin a não iniciar operações automaticamente quando o servidor iniciar. Isso é importante ao configurar a Replicação por Grupo, pois garante que você possa configurar o servidor antes de iniciar manualmente o plugin. Uma vez que o membro seja configurado, você pode configurar `group_replication_start_on_boot` para `on` para que a Replicação por Grupo inicie automaticamente ao iniciar o servidor.

* Configurar `group_replication_local_address` define o endereço de rede e a porta que o membro usa para comunicação interna com outros membros do grupo. A Replicação por Grupo usa esse endereço para conexões internas membro-a-membro envolvendo instâncias remotas do motor de comunicação do grupo (XCom, uma variante do Paxos).

Importante

O endereço de replicação local do grupo deve ser diferente do nome do host e do porto utilizado para as conexões do cliente SQL, que são definidos pelas variáveis de sistema `hostname` e `port` do MySQL Server. Não deve ser usado para aplicações de clientes. Deve ser usado apenas para comunicação interna entre os membros do grupo enquanto o Grupo de Replicação estiver em execução.

O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome completo e garantir que ele seja resolvível através de DNS, arquivos `/etc/hosts` corretamente configurados ou outros processos de resolução de nomes. Endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4; um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Para mais informações sobre o suporte da Replicação de Grupo para redes IPv6 e para grupos mistos IPv6 e IPv4, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4”.

O porto recomendado para `group_replication_local_address` é 33061. Este é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar o mesmo porto para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, como demonstrado neste tutorial. Alternativamente, você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que os portos sejam todos diferentes, por exemplo, como mostrado na Seção 20.2.2, “Implementação da Replicação de Grupo Localmente”.

A conexão que um membro existente oferece a um membro que está se juntando para o processo de recuperação distribuída do Group Replication não é o endereço de rede configurado pelo `group_replication_local_address`. Os membros do grupo oferecem sua conexão padrão de cliente SQL aos membros que estão se juntando para a recuperação distribuída, conforme especificado pelo `hostname` e `port` do MySQL Server; eles podem (também) anunciar uma lista alternativa de pontos de extremidade de recuperação distribuída como conexões de cliente dedicadas para os membros que estão se juntando. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”.

Importante

A recuperação distribuída pode falhar se um membro que está se juntando não puder identificar corretamente os outros membros usando o nome do host definido pela variável de sistema `hostname` do MySQL Server. Recomenda-se que os sistemas operacionais que executam o MySQL tenham um nome de host único configurado corretamente, seja usando DNS ou configurações locais. O nome de host que o servidor está usando para conexões de cliente SQL pode ser verificado na coluna `Member_host` da tabela `replication_group_members` do Schema de Desempenho. Se vários membros do grupo externalizarem um nome de host padrão definido pelo sistema operacional, há a chance de o membro que está se juntando não resolvê-lo para o endereço correto do membro e não conseguir se conectar para a recuperação distribuída. Nessa situação, você pode usar a variável de sistema `report_host` do MySQL Server para configurar um nome de host único que seja externalizado por cada um dos servidores.

* Configurar `group_replication_group_seeds` define o nome do host e a porta dos membros do grupo que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de membros-sementes. Uma vez que a conexão é estabelecida, as informações de associação ao grupo são listadas na tabela do Schema de Desempenho `replication_group_members`. Geralmente, a lista `group_replication_group_seeds` contém o `hostname:port` de cada um dos `group_replication_local_address` dos membros do grupo, mas isso não é obrigatório e um subconjunto dos membros do grupo pode ser escolhido como sementes.

  Importante

  O `hostname:port` listado em `group_replication_group_seeds` é o endereço de rede interno do membro-sementes, configurado por `group_replication_local_address` e não o `hostname:port` usado para conexões de clientes SQL, que é mostrado, por exemplo, na tabela do Schema de Desempenho `replication_group_members`.

  O servidor que inicia o grupo não utiliza essa opção, pois é o servidor inicial e, como tal, é responsável por iniciar o grupo. Em outras palavras, quaisquer dados existentes que estejam no servidor que inicia o grupo são usados como dados para o próximo membro que se junta. O segundo servidor que se junta pede ao único membro do grupo que se junte, quaisquer dados faltantes no segundo servidor são replicados dos dados do doador no membro que inicia o grupo, e então o grupo se expande. O terceiro servidor que se junta pode pedir a qualquer um desses dois que se junte, os dados são sincronizados com o novo membro e, então, o grupo se expande novamente. Servidores subsequentes repetem esse procedimento ao se juntarem.

  Aviso

Ao conectar vários servidores ao mesmo tempo, certifique-se de que eles apontem para membros-sementes que já estejam no grupo. Não use membros que também estejam se conectando ao grupo como sementes, pois eles podem não estar ainda no grupo quando forem contatados.

É uma boa prática começar com o membro-sementes e deixá-lo criar o grupo. Em seguida, faça dele o membro-sementes para os outros membros que estão se conectando. Isso garante que haja um grupo formado quando os outros membros forem conectados.

Criar um grupo e conectar vários membros ao mesmo tempo não é suportado. Pode funcionar, mas há chances de que as operações sejam realizadas em uma corrida e, então, a conexão ao grupo acabe em um erro ou timeout.

Um membro que está se conectando deve se comunicar com um membro-sementes usando o mesmo protocolo (IPv4 ou IPv6) que o membro-sementes anuncia na opção `group_replication_group_seeds`. Para fins de permissões de endereço IP para a Replicação de Grupo, a allowlist no membro-sementes deve incluir um endereço IP do membro que está se conectando para o protocolo oferecido pelo membro-sementes, ou um nome de host que resolva para um endereço para esse protocolo. Esse endereço ou nome de host deve ser configurado e permitido além do `group_replication_local_address` do membro que está se conectando, se o protocolo para esse endereço não corresponder ao protocolo anunciado pelo membro-sementes. Se um membro que está se conectando não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP para Replicação de Grupo”.

* Configurar `group_replication_bootstrap_group` instrui o plugin se deve ou não iniciar o grupo. Neste caso, mesmo que s1 seja o primeiro membro do grupo, definimos essa variável como off no arquivo de opções. Em vez disso, configuramos `group_replication_bootstrap_group` quando a instância está em execução, para garantir que apenas um membro inicie realmente o grupo.

Importante

A variável `group_replication_bootstrap_group` deve ser habilitada apenas em uma instância do servidor pertencente a um grupo, a qualquer momento, geralmente na primeira vez que você inicia o grupo (ou no caso de todo o grupo ser desligado e reiniciado). Se você iniciar o grupo várias vezes, por exemplo, quando várias instâncias do servidor têm essa opção definida, então elas podem criar um cenário de cérebro artificial, em que dois grupos distintos com o mesmo nome existem. Sempre defina `group_replication_bootstrap_group=off` após a primeira instância do servidor entrar online.

As variáveis de sistema descritas neste tutorial são as configurações de configuração necessárias para iniciar um novo membro, mas também estão disponíveis outras variáveis de sistema para configurar membros do grupo. Essas são listadas na Seção 20.9, “Variáveis de Replicação de Grupo”.

Importante

Várias variáveis de sistema, algumas específicas da Replicação em Grupo e outras não, são configurações de nível de grupo que devem ter o mesmo valor em todos os membros do grupo. Se os membros do grupo tiverem um valor definido para uma dessas variáveis de sistema e um membro que se junta tiver um valor diferente definido para ela, o membro que se junta não poderá se juntar ao grupo e uma mensagem de erro será retornada. Se os membros do grupo tiverem um valor definido para essa variável de sistema e o membro que se junta não suportar a variável de sistema, ele não poderá se juntar ao grupo. Essas variáveis de sistema são todas identificadas na Seção 20.9, “Variáveis de Replicação em Grupo”.