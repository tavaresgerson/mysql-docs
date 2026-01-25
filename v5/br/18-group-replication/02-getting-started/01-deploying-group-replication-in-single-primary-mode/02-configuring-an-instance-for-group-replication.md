#### 17.2.1.2 Configurando uma Instância para Group Replication

Esta seção explica as configurações necessárias para instâncias do MySQL Server que você deseja usar para Group Replication. Para informações básicas, consulte [Seção 17.3, “Requirements and Limitations” (Requisitos e Limitações)](group-replication-requirements-and-limitations.html "17.3 Requirements and Limitations").

* [Storage Engines](group-replication-configuring-instances.html#group-replication-storage-engines "Storage Engines")
* [Replication Framework](group-replication-configuring-instances.html#group-replication-configure-replication-framework "Replication Framework")
* [Group Replication Settings](group-replication-configuring-instances.html#group-replication-configure-plugin "Group Replication Settings")

##### Storage Engines

Para Group Replication, os dados devem ser armazenados no Storage Engine transacional InnoDB (para detalhes sobre o motivo, consulte [Seção 17.3.1, “Group Replication Requirements” (Requisitos de Group Replication)](group-replication-requirements.html "17.3.1 Group Replication Requirements")). O uso de outros Storage Engines, incluindo o Storage Engine temporário [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine"), pode causar erros no Group Replication. Defina a variável de sistema [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) conforme a seguir para impedir o uso:

```sql
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Observe que, com o Storage Engine [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") desabilitado, ao atualizar uma instância MySQL para uma release onde o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") ainda é usado (antes do MySQL 8.0.16), o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") pode falhar com um erro. Para lidar com isso, você pode reabilitar esse Storage Engine enquanto executa o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") e depois desabilitá-lo novamente ao reiniciar o Server. Para mais informações, consulte [Seção 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

##### Replication Framework

As seguintes configurações definem o replication de acordo com os requisitos do MySQL Group Replication.

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

Essas configurações definem o Server para usar o número de identificador único 1, habilitar identificadores de transação globais e armazenar metadados de replication em tabelas de sistema em vez de arquivos. Além disso, instrui o Server a ativar o binary logging, usar o formato row-based e desabilitar os checksums de eventos do binary log. Para mais detalhes, consulte [Seção 17.3.1, “Group Replication Requirements” (Requisitos de Group Replication)](group-replication-requirements.html "17.3.1 Group Replication Requirements").

##### Group Replication Settings

Neste ponto, o arquivo de opção garante que o Server esteja configurado e seja instruído a instanciar a infraestrutura de replication sob uma dada configuração. A seção a seguir configura as Group Replication Settings para o Server.

```sql
plugin_load_add='group_replication.so'
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

* `plugin-load-add` adiciona o Group Replication Plugin à lista de Plugins que o Server carrega na inicialização. Isso é preferível em um deployment de produção do que instalar o Plugin manualmente.

* Configurar [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name) informa ao Plugin que o grupo ao qual ele está se juntando, ou criando, é denominado "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

  O valor de [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name) deve ser um UUID válido. Este UUID é usado internamente ao definir GTIDs para eventos de Group Replication no binary log. Você pode usar `SELECT UUID()` para gerar um UUID.

* Configurar a variável [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot) como `off` instrui o Plugin a não iniciar as operações automaticamente quando o Server iniciar. Isso é importante ao configurar o Group Replication, pois garante que você possa configurar o Server antes de iniciar o Plugin manualmente. Assim que o membro for configurado, você pode definir [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot) como `on` para que o Group Replication inicie automaticamente na inicialização do Server (server boot).

* Configurar [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) define o endereço de rede e a port que o membro usa para comunicação interna com outros membros no grupo. O Group Replication usa este endereço para conexões internas de membro para membro, envolvendo instâncias remotas do motor de comunicação do grupo (XCom, uma variante Paxos).

  > **Importante**
  >
  > Este endereço deve ser diferente do [`hostname`](server-system-variables.html#sysvar_hostname) e da [`port`](server-system-variables.html#sysvar_port) usados para SQL e não deve ser usado para aplicações cliente. Ele deve ser usado apenas para comunicação interna entre os membros do grupo durante a execução do Group Replication.

  O endereço de rede configurado por [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do Server estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um host name, deve usar um nome totalmente qualificado e garantir que ele seja resolvível via DNS, arquivos `/etc/hosts` configurados corretamente, ou outros processos de resolução de nomes. A partir do MySQL 8.0.14, endereços IPv6 (ou host names que resolvam para eles) podem ser usados, assim como endereços IPv4. Um grupo pode conter uma mistura de membros usando IPv6 e membros usando IPv4. Para mais informações sobre o suporte do Group Replication para redes IPv6 e sobre grupos mistos IPv4 e IPv6, consulte [Suporte para IPv6 e para Grupos Mistos IPv6 e IPv4](/doc/refman/8.0/en/group-replication-ipv6.html).

  A port recomendada para [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) é 33061. O [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) é usado pelo Group Replication como o identificador único para um membro do grupo dentro do grupo de replication. Você pode usar a mesma port para todos os membros de um grupo de replication, desde que os host names ou endereços IP sejam todos diferentes, conforme demonstrado neste tutorial. Alternativamente, você pode usar o mesmo host name ou endereço IP para todos os membros, desde que as ports sejam todas diferentes, por exemplo, conforme mostrado em [Seção 17.2.2, “Deploying Group Replication Locally” (Deploying Group Replication Localmente)](group-replication-deploying-locally.html "17.2.2 Deploying Group Replication Locally").

* Configurar [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) define o hostname e a port dos membros do grupo que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de *seed members* (membros semente). Assim que a conexão é estabelecida, as informações de associação ao grupo são listadas na tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"). Normalmente, a lista [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) contém o `hostname:port` de cada [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) do membro do grupo, mas isso não é obrigatório, e um subconjunto dos membros do grupo pode ser escolhido como seeds.

  > **Importante**
  >
  > O `hostname:port` listado em [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds) é o endereço de rede interno do seed member, configurado por [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address), e não o SQL `hostname:port` usado para conexões de cliente, e mostrado, por exemplo, na tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table").

  O Server que inicia o grupo não utiliza esta opção, pois é o Server inicial e, como tal, é responsável pelo *bootstrapping* do grupo. Em outras palavras, quaisquer dados existentes no Server que inicializa o grupo são os dados usados para o próximo membro que se juntar. O segundo Server que se junta solicita ao único membro no grupo para aderir; quaisquer dados ausentes no segundo Server são replicados a partir dos dados do doador no membro de *bootstrapping*, e então o grupo se expande. O terceiro Server que se junta pode solicitar a qualquer um desses dois para aderir; os dados são sincronizados com o novo membro, e então o grupo se expande novamente. Servers subsequentes repetem este procedimento ao aderir.

  > **Aviso**
  >
  > Ao juntar múltiplos Servers ao mesmo tempo, certifique-se de que eles apontem para seed members que já estejam no grupo. Não use membros que também estejam aderindo ao grupo como seeds, pois eles podem ainda não estar no grupo quando contatados.

  É uma boa prática iniciar primeiro o bootstrap member e deixá-lo criar o grupo. Em seguida, torne-o o seed member para o restante dos membros que estão se juntando. Isso garante que haja um grupo formado ao juntar os demais membros.

  Não é suportado criar um grupo e juntar múltiplos membros ao mesmo tempo. Pode funcionar, mas há chances de as operações entrarem em condição de *race* e, em seguida, o ato de aderir ao grupo resultar em um erro ou *time out*.

* Configurar [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) instrui o Plugin sobre se deve ou não fazer o *bootstrap* do grupo. Neste caso, embora s1 seja o primeiro membro do grupo, definimos esta variável como `off` no arquivo de opção. Em vez disso, configuramos [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) quando a instância está em execução, para garantir que apenas um membro realmente faça o *bootstrap* do grupo.

  > **Importante**
  >
  > A variável [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) deve ser habilitada em apenas uma instância do Server pertencente a um grupo por vez, geralmente na primeira vez em que você inicializa o grupo (*bootstrap*) (ou caso o grupo inteiro seja derrubado e reiniciado). Se você inicializar o grupo múltiplas vezes, por exemplo, quando várias instâncias do Server tiverem esta opção definida, elas poderão criar um cenário artificial de *split brain*, no qual dois grupos distintos com o mesmo nome existem. Sempre defina [`group_replication_bootstrap_group=off`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group) após a primeira instância do Server ficar online.

A configuração para todos os Servers no grupo é bastante semelhante. Você precisa alterar as especificidades de cada Server (por exemplo, [`server_id`](replication-options.html#sysvar_server_id), [`datadir`](server-system-variables.html#sysvar_datadir), [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address)). Isso é ilustrado mais adiante neste tutorial.