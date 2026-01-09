#### 17.2.1.2 Configurando uma Instância para Replicação em Grupo

Esta seção explica as configurações necessárias para as instâncias do MySQL Server que você deseja usar para a Replicação por Grupo. Para informações de fundo, consulte Seção 17.3, “Requisitos e Limitações”.

- Motores de Armazenamento
- Framework de replicação
- Configurações de Replicação em Grupo

##### Motores de Armazenamento

Para a Replicação em Grupo, os dados devem ser armazenados no mecanismo de armazenamento transacional InnoDB (para detalhes sobre o motivo, consulte Seção 17.3.1, “Requisitos de Replicação em Grupo”). O uso de outros mecanismos de armazenamento, incluindo o mecanismo de armazenamento temporário `MEMORY`, pode causar erros na Replicação em Grupo. Defina a variável de sistema `disabled_storage_engines` da seguinte forma para evitar seu uso:

```sql
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Observe que, com o mecanismo de armazenamento `MyISAM` desativado, quando você está atualizando uma instância do MySQL para uma versão onde o **mysql_upgrade** ainda é usado (antes do MySQL 8.0.16), o **mysql_upgrade** pode falhar com um erro. Para lidar com isso, você pode reativar esse mecanismo de armazenamento enquanto executa o **mysql_upgrade**, e depois desativá-lo novamente ao reiniciar o servidor. Para mais informações, consulte Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

##### Framework de replicação

As configurações a seguir configuram a replicação de acordo com os requisitos do MySQL Group Replication.

```sql
server_id=1
gtid_mode=ON
enforce_gtid_consistency=ON
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW
```

Essas configurações configuram o servidor para usar o número de identificador único 1, para habilitar identificadores de transações globais e para armazenar metadados de replicação em tabelas do sistema em vez de arquivos. Além disso, instrui o servidor a ativar o registro binário, usar o formato baseado em linhas e desabilitar verificações de checksums de eventos do log binário. Para mais detalhes, consulte Seção 17.3.1, “Requisitos de Replicação por Grupo”.

##### Configurações de Replicação em Grupo

Neste ponto, o arquivo de opção garante que o servidor esteja configurado e instrui-o a instanciar a infraestrutura de replicação sob uma configuração específica. A seção a seguir configura as configurações de replicação de grupo para o servidor.

```sql
plugin_load_add='group_replication.so'
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

- `plugin-load-add` adiciona o plugin de replicação de grupo à lista de plugins que o servidor carrega ao iniciar. Isso é preferível em uma implantação em produção em vez de instalar o plugin manualmente.

- Configurar `group_replication_group_name` informa ao plugin que o grupo ao qual ele está se juntando ou criando é chamado de "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

  O valor de `group_replication_group_name` deve ser um UUID válido. Esse UUID é usado internamente ao definir GTIDs para eventos de Replicação de Grupo no log binário. Você pode usar `SELECT UUID()` para gerar um UUID.

- Configurar a variável `group_replication_start_on_boot` para `off` instrui o plugin a não iniciar operações automaticamente quando o servidor for iniciado. Isso é importante ao configurar a Replicação de Grupo, pois garante que você possa configurar o servidor antes de iniciar manualmente o plugin. Uma vez que o membro seja configurado, você pode definir `group_replication_start_on_boot` para `on` para que a Replicação de Grupo seja iniciada automaticamente ao inicializar o servidor.

- A configuração de `group_replication_local_address` define o endereço de rede e a porta que o membro usa para a comunicação interna com outros membros do grupo. A Replicação de Grupo usa esse endereço para conexões internas entre membros que envolvem instâncias remotas do motor de comunicação do grupo (XCom, uma variante do Paxos).

  Importante

  Este endereço deve ser diferente do `hostname` e `port` usados para SQL e não deve ser usado para aplicações de clientes. Deve ser usado apenas para comunicação interna entre os membros do grupo enquanto a Replicação de Grupo estiver em execução.

  O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível através de DNS, arquivos `/etc/hosts` corretamente configurados ou outros processos de resolução de nomes. A partir do MySQL 8.0.14, endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4. Um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Para mais informações sobre o suporte da Replicação de Grupo para redes IPv6 e sobre grupos mistos IPv4 e IPv6, consulte Suporte para IPv6 e para Grupos Mistas IPv6 e IPv4.

  O porto recomendado para `group_replication_local_address` é 33061. O `group_replication_local_address` é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar o mesmo porto para todos os membros de um grupo de replicação, desde que os nomes de host ou endereços IP sejam todos diferentes, como demonstrado neste tutorial. Alternativamente, você pode usar o mesmo nome de host ou endereço IP para todos os membros, desde que os portos sejam todos diferentes, por exemplo, como mostrado em Seção 17.2.2, “Implementando o Grupo de Replicação Localmente”.

- A configuração de `group_replication_group_seeds` define o nome do host e a porta dos membros do grupo que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de membros-sementes. Uma vez que a conexão é estabelecida, as informações de associação ao grupo são listadas em `performance_schema.replication_group_members`. Geralmente, a lista `group_replication_group_seeds` contém o `hostname:port` de cada um dos `group_replication_local_address` dos membros do grupo, mas isso não é obrigatório e um subconjunto dos membros do grupo pode ser escolhido como sementes.

  Importante

  O `hostname:port` listado em `group_replication_group_seeds` é o endereço da rede interna do membro da semente, configurado por `group_replication_local_address` e não o `hostname:port` SQL usado para conexões de clientes, e mostrado, por exemplo, na tabela `performance_schema.replication_group_members`.

  O servidor que inicia o grupo não utiliza essa opção, pois é o servidor inicial e, como tal, é responsável por iniciar o grupo. Em outras palavras, quaisquer dados existentes no servidor que inicia o grupo são usados como dados para o próximo membro que se junta. O segundo servidor que se junta pede ao único membro do grupo que se junte, quaisquer dados faltantes no segundo servidor são replicados dos dados do membro doador que inicia o grupo, e então o grupo se expande. O terceiro servidor que se junta pode pedir a qualquer um desses dois que se junte, os dados são sincronizados com o novo membro e, então, o grupo se expande novamente. Servidores subsequentes repetem esse procedimento ao se juntarem.

  Aviso

  Ao conectar vários servidores ao mesmo tempo, certifique-se de que eles apontem para membros de sementes que já estejam no grupo. Não use membros que também estejam se juntando ao grupo como sementes, pois eles podem não estar ainda no grupo quando contatados.

  É uma boa prática começar com o membro bootstrap primeiro e deixá-lo criar o grupo. Em seguida, faça dele o membro inicial para os outros membros que estão se juntando. Isso garante que haja um grupo formado quando os outros membros se juntarem.

  Criar um grupo e adicionar vários membros ao mesmo tempo não é suportado. Pode funcionar, mas é provável que as operações sejam travadas e, em seguida, o ato de adicionar o grupo termine em um erro ou em um tempo de espera.

- Configurar `group_replication_bootstrap_group` instrui o plugin se deve ou não inicializar o grupo. Neste caso, embora s1 seja o primeiro membro do grupo, configuramos essa variável para off no arquivo de opções. Em vez disso, configuramos `group_replication_bootstrap_group` quando a instância estiver em execução, para garantir que apenas um membro inicialize realmente o grupo.

  Importante

  A variável `group_replication_bootstrap_group` deve ser habilitada apenas em uma instância do servidor pertencente a um grupo a qualquer momento, geralmente na primeira vez que o grupo é iniciado (ou no caso de o grupo inteiro ser desligado e reiniciado). Se você iniciar o grupo várias vezes, por exemplo, quando várias instâncias do servidor têm essa opção definida, então elas podem criar um cenário de cérebro artificial dividido, em que dois grupos distintos com o mesmo nome existem. Sempre defina `group_replication_bootstrap_group=off` após a primeira instância do servidor entrar online.

A configuração para todos os servidores do grupo é bastante semelhante. Você precisa alterar os detalhes de cada servidor (por exemplo, `server_id`, `datadir`, `group_replication_local_address`). Isso é ilustrado mais adiante neste tutorial.
