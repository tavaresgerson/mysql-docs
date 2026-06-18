#### 20.2.1.2 Configurando uma Instância para Replicação em Grupo

Esta seção explica as configurações necessárias para as instâncias do MySQL Server que você deseja usar para a Replicação por Grupo. Para informações de fundo, consulte a Seção 20.3, “Requisitos e Limitações”.

- Motores de Armazenamento
- Framework de replicação
- Configurações de Replicação em Grupo

##### Motores de Armazenamento

Para a replicação em grupo, os dados devem ser armazenados no mecanismo de armazenamento transacional InnoDB (para detalhes sobre o motivo, consulte a Seção 20.3.1, “Requisitos de replicação em grupo”). O uso de outros mecanismos de armazenamento, incluindo o mecanismo de armazenamento temporário `MEMORY`, pode causar erros na replicação em grupo. Defina a variável de sistema `disabled_storage_engines` da seguinte forma para evitar seu uso:

```
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Observe que, com o mecanismo de armazenamento `MyISAM` desativado, ao atualizar uma instância do MySQL para uma versão onde o **mysql\_upgrade** ainda é usado (antes do MySQL 8.0.16), o **mysql\_upgrade** pode falhar com um erro. Para lidar com isso, você pode reativar esse mecanismo de armazenamento enquanto executa o **mysql\_upgrade**, e depois desativá-lo novamente ao reiniciar o servidor. Para mais informações, consulte a Seção 6.4.5, “mysql\_upgrade — Verificar e Atualizar Tabelas do MySQL”.

##### Framework de replicação

As configurações a seguir configuram a replicação de acordo com os requisitos do MySQL Group Replication.

```
server_id=1
gtid_mode=ON
enforce_gtid_consistency=ON
```

Essas configurações configuram o servidor para usar o número de identificador único 1, para habilitar a Seção 19.1.3, “Replicação com Identificadores de Transação Global” e para permitir a execução apenas de instruções que podem ser registradas com segurança usando um GTID.

Até e incluindo o MySQL 8.0.20, o seguinte ajuste também é necessário:

```
binlog_checksum=NONE
```

Essa configuração desabilita os checksums para eventos escritos no log binário, que são habilitados por padrão. No MySQL 8.0.21 e versões posteriores, a Replicação por Grupo suporta a presença de checksums no log binário e pode usá-los para verificar a integridade dos eventos em alguns canais, então você pode usar o ajuste padrão. Para mais detalhes, consulte a Seção 20.3.2, “Limitações da Replicação por Grupo”.

Se você estiver usando uma versão do MySQL anterior à 8.0.3, onde os padrões foram aprimorados para replicação, também é necessário adicionar essas linhas ao arquivo de opções do membro. Se você tiver alguma dessas variáveis de sistema no arquivo de opções em versões posteriores, certifique-se de que elas estejam definidas conforme mostrado. Para mais detalhes, consulte a Seção 20.3.1, “Requisitos de Replicação em Grupo”.

```
log_bin=binlog
log_slave_updates=ON
binlog_format=ROW
master_info_repository=TABLE
relay_log_info_repository=TABLE
transaction_write_set_extraction=XXHASH64
```

##### Configurações de Replicação em Grupo

Neste ponto, o arquivo de opção garante que o servidor esteja configurado e instrui-o a instanciar a infraestrutura de replicação sob uma configuração específica. A seção a seguir configura as configurações de replicação de grupo para o servidor.

```
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

- `plugin-load-add` adiciona o plugin de replicação de grupo à lista de plugins que o servidor carrega ao iniciar. Isso é preferível em uma implantação em produção em vez de instalar o plugin manualmente.

- Configurar `group_replication_group_name` informa ao plugin que o grupo ao qual ele está se juntando ou criando é chamado de "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

  O valor de `group_replication_group_name` deve ser um UUID válido. Você pode usar `SELECT UUID()` para gerar um. Esse UUID faz parte dos GTIDs que são usados quando as transações recebidas pelos membros do grupo de clientes e os eventos de visualização de alterações gerados internamente pelos membros do grupo são escritos no log binário.

- Configurar a variável `group_replication_start_on_boot` para `off` instrui o plugin a não iniciar operações automaticamente quando o servidor for iniciado. Isso é importante ao configurar a Replicação de Grupo, pois garante que você possa configurar o servidor antes de iniciar manualmente o plugin. Uma vez que o membro seja configurado, você pode definir `group_replication_start_on_boot` para `on` para que a Replicação de Grupo seja iniciada automaticamente ao inicializar o servidor.

- Configurando `group_replication_local_address` define o endereço de rede e a porta que o membro usa para a comunicação interna com outros membros do grupo. A replicação em grupo usa esse endereço para conexões internas entre membros que envolvem instâncias remotas do motor de comunicação do grupo (XCom, uma variante do Paxos).

  Importante

  O endereço local de replicação do grupo deve ser diferente do nome do host e do número de porta utilizados para as conexões do cliente SQL, que são definidos pelas variáveis de sistema `hostname` e `port` do MySQL Server. Não deve ser usado para aplicações de clientes. Deve ser usado apenas para comunicação interna entre os membros do grupo enquanto a Replicação em Grupo estiver em execução.

  O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível por meio de arquivos `/etc/hosts` corretamente configurados ou outros processos de resolução de nomes. No MySQL 8.0.14 e versões posteriores, endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4. Um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Para obter mais informações sobre o suporte à replicação de grupo para redes IPv6 e sobre grupos mistos IPv4 e IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4”.

  O porto recomendado para `group_replication_local_address` é 33061. Este é usado pela Replicação em Grupo como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar o mesmo porto para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, como demonstrado neste tutorial. Alternativamente, você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que os portos sejam todos diferentes, por exemplo, como mostrado na Seção 20.2.2, “Implementando a Replicação em Grupo Localmente”.

  A conexão que um membro existente oferece a um membro que está se juntando para o processo de recuperação distribuída do Grupo não é o endereço de rede configurado pelo `group_replication_local_address`. No MySQL 8.0.20 e versões anteriores, os membros do grupo oferecem sua conexão padrão de cliente SQL aos membros que estão se juntando para a recuperação distribuída, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. No MySQL 8.0.21 e versões posteriores, os membros do grupo podem anunciar uma lista alternativa de pontos de extremidade de recuperação distribuída como conexões de cliente dedicadas para os membros que estão se juntando. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”.

  Importante

  A recuperação distribuída pode falhar se um membro de junção não conseguir identificar corretamente os outros membros usando o nome do host conforme definido pela variável de sistema `hostname` do MySQL Server. Recomenda-se que os sistemas operacionais que executam o MySQL tenham um nome de host único configurado corretamente, seja usando DNS ou configurações locais. O nome de host que o servidor está usando para conexões de clientes SQL pode ser verificado na coluna `Member_host` da tabela do Schema de Desempenho `replication_group_members`. Se vários membros do grupo externalizarem um nome de host padrão definido pelo sistema operacional, há a chance de o membro de junção não resolvê-lo para o endereço correto do membro e não conseguir se conectar para a recuperação distribuída. Nessa situação, você pode usar a variável de sistema `report_host` do MySQL Server para configurar um nome de host único que seja externalizado por cada um dos servidores.

- Configurar `group_replication_group_seeds` define o nome do host e a porta dos membros do grupo, que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de membros-sementes. Uma vez que a conexão é estabelecida, as informações de associação ao grupo são listadas na tabela do Schema de Desempenho `replication_group_members`. Normalmente, a lista `group_replication_group_seeds` contém o `hostname:port` de cada um dos `group_replication_local_address` dos membros do grupo, mas isso não é obrigatório e um subconjunto dos membros do grupo pode ser escolhido como sementes.

  Importante

  O endereço interno da rede do membro inicial `hostname:port` listado em `group_replication_group_seeds` é configurado pelo `group_replication_local_address` e não o `hostname:port` usado para conexões de clientes SQL, que é mostrado, por exemplo, na tabela do Gerenciador de Desempenho `replication_group_members`.

  O servidor que inicia o grupo não utiliza essa opção, pois é o servidor inicial e, como tal, é responsável por iniciar o grupo. Em outras palavras, quaisquer dados existentes no servidor que inicia o grupo são usados como dados para o próximo membro que se junta. O segundo servidor que se junta pede ao único membro do grupo que se junte, quaisquer dados faltantes no segundo servidor são replicados dos dados do membro doador que inicia o grupo, e então o grupo se expande. O terceiro servidor que se junta pode pedir a qualquer um desses dois que se junte, os dados são sincronizados com o novo membro e, então, o grupo se expande novamente. Servidores subsequentes repetem esse procedimento ao se juntarem.

  Aviso

  Ao conectar vários servidores ao mesmo tempo, certifique-se de que eles apontem para membros de sementes que já estejam no grupo. Não use membros que também estejam se juntando ao grupo como sementes, pois eles podem não estar ainda no grupo quando contatados.

  É uma boa prática começar com o membro bootstrap primeiro e deixá-lo criar o grupo. Em seguida, faça dele o membro inicial para os outros membros que estão se juntando. Isso garante que haja um grupo formado quando os outros membros se juntarem.

  Criar um grupo e adicionar vários membros ao mesmo tempo não é suportado. Pode funcionar, mas é provável que as operações sejam travadas e, em seguida, o ato de adicionar o grupo termine em um erro ou em um tempo de espera.

  Um membro associado deve se comunicar com um membro inicial usando o mesmo protocolo (IPv4 ou IPv6) que o membro inicial anuncia na opção `group_replication_group_seeds`. Para fins de permissões de endereço IP para a Replicação em Grupo, a lista de permissão no membro inicial deve incluir um endereço IP do membro associado para o protocolo oferecido pelo membro inicial, ou um nome de host que resolva para um endereço desse protocolo. Esse endereço ou nome de host deve ser configurado e permitido além do `group_replication_local_address` do membro associado, se o protocolo para esse endereço não corresponder ao protocolo anunciado pelo membro inicial. Se um membro associado não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP para Replicação em Grupo”.

- Configurar `group_replication_bootstrap_group` instrui o plugin se o grupo deve ser inicializado ou não. Nesse caso, embora s1 seja o primeiro membro do grupo, definimos essa variável como off no arquivo de opções. Em vez disso, configuramos `group_replication_bootstrap_group` quando a instância estiver em execução, para garantir que apenas um membro inicialize realmente o grupo.

  Importante

  A variável `group_replication_bootstrap_group` deve ser habilitada apenas em uma instância de servidor pertencente a um grupo a qualquer momento, geralmente na primeira vez que você inicializa o grupo (ou no caso de todo o grupo ser desligado e reiniciado). Se você inicializar o grupo várias vezes, por exemplo, quando várias instâncias de servidor têm essa opção definida, então elas podem criar um cenário de cérebro artificial dividido, em que dois grupos distintos com o mesmo nome existem. Sempre defina `group_replication_bootstrap_group=off` após a primeira instância de servidor entrar online.

As variáveis de sistema descritas neste tutorial são as configurações de configuração necessárias para iniciar um novo membro, mas há também variáveis de sistema adicionais disponíveis para configurar membros do grupo. Elas estão listadas na Seção 20.9, “Variáveis de Replicação de Grupo”.

Importante

Várias variáveis de sistema, algumas específicas da Replicação em Grupo e outras não, são configurações de nível de grupo que devem ter o mesmo valor em todos os membros do grupo. Se os membros do grupo tiverem um valor definido para uma dessas variáveis de sistema e um membro que se junta tiver um valor diferente definido para ela, o membro que se junta não poderá se juntar ao grupo e uma mensagem de erro será retornada. Se os membros do grupo tiverem um valor definido para essa variável de sistema e o membro que se junta não suportar a variável de sistema, ele não poderá se juntar ao grupo. Essas variáveis de sistema são todas identificadas na Seção 20.9, “Variáveis de Replicação em Grupo”.
