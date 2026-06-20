## 17.2 Começando

O MySQL Group Replication é fornecido como um plugin para o servidor MySQL; cada servidor em um grupo requer configuração e instalação do plugin. Esta seção fornece um tutorial detalhado com os passos necessários para criar um grupo de replicação com pelo menos três membros.

Dica

Uma maneira alternativa de implantar múltiplas instâncias do MySQL é usando o InnoDB Cluster, que utiliza a Replicação por Grupo e o envolve em um ambiente programático que permite trabalhar facilmente com grupos de instâncias do servidor MySQL no MySQL Shell 8.0. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router e simplifica a implantação do MySQL com alta disponibilidade. Veja MySQL AdminAPI.

### 17.2.1 Implementar a Replicação de Grupo no Modo de Primariúnico

Cada uma das instâncias do servidor MySQL em um grupo pode ser executada em uma máquina física independente, que é a maneira recomendada para implantar a Replicação de Grupo. Esta seção explica como criar um grupo de replicação com três instâncias do Servidor MySQL, cada uma executando em uma máquina física diferente. Consulte a Seção 17.2.2, “Implementação da Replicação de Grupo Localmente”, para obter informações sobre a implantação de múltiplas instâncias do servidor MySQL que executam a Replicação de Grupo na mesma máquina física, por exemplo, para fins de teste.

**Figura 17.4 Arquitetura de grupo**

![Three server instances, S1, S2, and S3, are deployed as an interconnected group, and clients communicate with each of the server instances.](images/gr-3-server-group.png)

Este tutorial explica como obter e implantar o MySQL Server com o plugin de Replicação por Grupo, como configurar cada instância do servidor antes de criar um grupo e como usar o monitoramento do Schema de Desempenho para verificar se tudo está funcionando corretamente.

#### 17.2.1.1. Implantação de instâncias para replicação em grupo

O primeiro passo é implantar pelo menos três instâncias do MySQL Server, este procedimento demonstra o uso de vários hosts para as instâncias, nomeadas s1, s2 e s3. Assume-se que o MySQL Server está instalado em cada host (veja o Capítulo 2, *Instalando e Atualizando o MySQL*). O plugin de Replicação de Grupo é fornecido com o MySQL Server 5.7.17 e versões posteriores; não é necessário software adicional, embora o plugin deva ser instalado no servidor MySQL em execução. Consulte a Seção 17.2.1.1, “Implantação de Instâncias para Replicação de Grupo”; para informações adicionais, consulte a Seção 5.5, “Plugins do MySQL Server”.

Neste exemplo, são utilizadas três instâncias para o grupo, que é o número mínimo de instâncias a serem criadas para criar um grupo. Adicionar mais instâncias aumenta a tolerância à falha do grupo. Por exemplo, se o grupo consistir em três membros, em caso de falha de uma instância, o grupo pode continuar. Mas, em caso de outra falha, o grupo não pode mais continuar processando transações de escrita. Ao adicionar mais instâncias, o número de servidores que podem falhar enquanto o grupo continua a processar transações também aumenta. O número máximo de instâncias que podem ser utilizadas em um grupo é de nove. Para mais informações, consulte a Seção 17.1.3.2, “Detecção de Falha”.

#### 17.2.1.2 Configurando uma Instância para Replicação em Grupo

Esta seção explica as configurações necessárias para as instâncias do MySQL Server que você deseja usar para a Replicação de Grupo. Para informações de fundo, consulte a Seção 17.3, “Requisitos e Limitações”.

* Motores de armazenamento
* Estrutura de replicação
* Configurações de replicação de grupo

##### Motores de Armazenamento

Para a Replicação em Grupo, os dados devem ser armazenados no motor de armazenamento transacional InnoDB (para detalhes sobre o porquê, consulte a Seção 17.3.1, “Requisitos de Replicação em Grupo”). O uso de outros motores de armazenamento, incluindo o motor de armazenamento temporário `MEMORY`, pode causar erros na Replicação em Grupo. Defina a variável de sistema `disabled_storage_engines` da seguinte forma para evitar seu uso:

```sql
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Observe que, com o mecanismo de armazenamento `MyISAM` desativado, quando você está atualizando uma instância do MySQL para uma versão onde o `mysqld_upgrade` ainda é usado (antes do MySQL 8.0.16), o `mysqld_upgrade` pode falhar com um erro. Para lidar com isso, você pode reativar esse mecanismo de armazenamento enquanto executa o `mysqld_upgrade`, e depois desativá-lo novamente quando reiniciar o servidor. Para mais informações, consulte a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

##### Estrutura de Replicação

Os seguintes ajustes configuram a replicação de acordo com os requisitos do MySQL Group Replication.

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

Essas configurações configuram o servidor para usar o número de identificador único 1, para habilitar identificadores de transação global e para armazenar metadados de replicação em tabelas do sistema em vez de arquivos. Além disso, instrui o servidor para ativar o registro binário, usar o formato baseado em linha e desabilitar as verificações de checksums de eventos de registro binário. Para mais detalhes, consulte a Seção 17.3.1, “Requisitos de Replicação de Grupo”.

Configurações de Replicação de Grupo

Neste ponto, o arquivo de opções garante que o servidor esteja configurado e instruído a instanciar a infraestrutura de replicação sob uma configuração específica. A seção a seguir configura as configurações de Replicação de Grupo para o servidor.

```sql
plugin_load_add='group_replication.so'
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

* `plugin-load-add` adiciona o plugin de replicação de grupo à lista de plugins que o servidor carrega no início. Isso é preferível em uma implantação em produção em vez de instalar o plugin manualmente.

* Configurar `group_replication_group_name` informa ao plugin que o grupo ao qual ele está se juntando ou criando é chamado de "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

O valor de `group_replication_group_name` deve ser um UUID válido. Esse UUID é usado internamente ao definir GTIDs para eventos de Replicação de Grupo no log binário. Você pode usar `SELECT UUID()` para gerar um UUID.

* Configurar a variável `group_replication_start_on_boot` para `off` instrui o plugin a não iniciar operações automaticamente quando o servidor é iniciado. Isso é importante ao configurar a Replicação de Grupo, pois garante que você pode configurar o servidor antes de iniciar manualmente o plugin. Uma vez que o membro é configurado, você pode definir `group_replication_start_on_boot` para `on` para que a Replicação de Grupo seja iniciada automaticamente após o inicialização do servidor.

* Configurar `group_replication_local_address` define o endereço de rede e a porta que o membro utiliza para a comunicação interna com outros membros do grupo. A Replicação de Grupo utiliza este endereço para conexões internas entre membros que envolvem instâncias remotas do motor de comunicação do grupo (XCom, uma variante Paxos).

Importante

Esse endereço deve ser diferente do `hostname` e `port` utilizado para SQL e não deve ser utilizado para aplicações de clientes. Deve ser utilizado apenas para comunicação interna entre os membros do grupo enquanto o Grupo de Replicação estiver em execução.

O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível através de arquivos `/etc/hosts` configurados corretamente ou outros processos de resolução de nomes. A partir do MySQL 8.0.14, endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4. Um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Para mais informações sobre o suporte à replicação de grupo para redes IPv6 e sobre grupos mistos de IPv4 e IPv6, consulte Suporte para IPv6 e para grupos mistos de IPv6 e IPv4.

O porto recomendado para `group_replication_local_address` é 33061. `group_replication_local_address` é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar o mesmo porto para todos os membros de um grupo de replicação, desde que os nomes de hospedagem ou endereços IP sejam todos diferentes, como demonstrado neste tutorial. Alternativamente, você pode usar o mesmo nome de hospedagem ou endereço IP para todos os membros, desde que os portos sejam todos diferentes, por exemplo, como mostrado na Seção 17.2.2, “Implementando a Replicação de Grupo Localmente”.

* Configurar `group_replication_group_seeds` define o nome do host e a porta dos membros do grupo que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de membros-sementes. Uma vez que a conexão é estabelecida, as informações de filiação do grupo são listadas em `performance_schema.replication_group_members`. Geralmente, a lista `group_replication_group_seeds` contém os `hostname:port` de cada um dos `group_replication_local_address` dos membros do grupo, mas isso não é obrigatório e um subconjunto dos membros do grupo pode ser escolhido como sementes.

Importante

O `hostname:port` listado em `group_replication_group_seeds` é o endereço interno da rede do membro da semente, configurado por `group_replication_local_address` e não o SQL `hostname:port` usado para conexões de clientes, e mostrado, por exemplo, na tabela `performance_schema.replication_group_members`.

O servidor que inicia o grupo não utiliza essa opção, uma vez que é o servidor inicial e, como tal, é responsável por iniciar o grupo. Em outras palavras, quaisquer dados existentes que estejam no servidor que inicia o grupo são usados como dados para o próximo membro que se junta. O segundo servidor que se junta pede ao único membro do grupo que se junta, quaisquer dados ausentes no segundo servidor são replicados dos dados do membro doador e, em seguida, o grupo se expande. O terceiro servidor que se junta pode pedir a qualquer um desses dois para se juntar, os dados são sincronizados com o novo membro e, em seguida, o grupo se expande novamente. Os servidores subsequentes repetem esse procedimento ao se juntarem.

Aviso

Ao conectar vários servidores ao mesmo tempo, certifique-se de que eles apontem para membros de semente que já estejam no grupo. Não use membros que também estejam se conectando ao grupo como sementes, porque eles podem não estar ainda no grupo quando contatados.

É uma boa prática começar com o membro bootstrap primeiro e deixá-lo criar o grupo. Em seguida, faça dele o membro inicial para o resto dos membros que estão se juntando. Isso garante que haja um grupo formado quando se juntar ao resto dos membros.

Criar um grupo e juntar vários membros ao mesmo tempo não é suportado. Pode funcionar, mas é provável que as operações corram e, em seguida, o ato de juntar-se ao grupo acabe em um erro ou em um tempo de espera.

* Configurar `group_replication_bootstrap_group` instrui o plugin se deve iniciar o grupo ou não. Neste caso, embora s1 seja o primeiro membro do grupo, configuramos esta variável para off no arquivo de opções. Em vez disso, configuramos `group_replication_bootstrap_group` quando a instância está em execução, para garantir que apenas um membro realmente inicie o grupo.

Importante

A variável `group_replication_bootstrap_group` deve ser habilitada apenas em uma instância do servidor que pertence a um grupo a qualquer momento, geralmente na primeira vez que você inicializa o grupo (ou no caso de o grupo inteiro ser desligado e reiniciado). Se você inicializar o grupo várias vezes, por exemplo, quando várias instâncias do servidor têm essa opção definida, então eles podem criar um cenário de cérebro artificial, em que dois grupos distintos com o mesmo nome existem. Sempre defina `group_replication_bootstrap_group=off` após a primeira instância do servidor entrar em linha.

A configuração para todos os servidores do grupo é bastante semelhante. Você precisa alterar os detalhes de cada servidor (por exemplo, `server_id`, `datadir`, `group_replication_local_address`). Isso é ilustrado mais tarde neste tutorial.

#### 17.2.1.3 Credenciais do Usuário

A Replicação em Grupo utiliza o protocolo de replicação assíncrona para alcançar a Seção 17.9.5, “Recuperação Distribuída”, sincronizando os membros do grupo antes de os juntar ao grupo. O processo de recuperação distribuída depende de um canal de replicação chamado `group_replication_recovery` que é usado para transferir transações dos membros doadores para os membros que se juntam ao grupo. Portanto, você precisa configurar um usuário de replicação com as permissões corretas para que a Replicação em Grupo possa estabelecer canais de replicação de recuperação membro a membro direto.

Inicie a instância do servidor MySQL e, em seguida, conecte um cliente a ela. Crie um usuário MySQL com o privilégio `REPLICATION SLAVE`. Esse processo pode ser capturado no log binário e, em seguida, você pode confiar na recuperação distribuída para replicar as declarações usadas para criar o usuário. Alternativamente, você pode desabilitar o registro binário usando `SET SQL_LOG_BIN=0;` e, em seguida, criar o usuário manualmente em cada membro, por exemplo, se você deseja evitar que as alterações sejam propagadas a outras instâncias do servidor. Se decidir desabilitar o registro binário, certifique-se de reabilitá-lo uma vez que tenha configurado o usuário.

No exemplo a seguir, o usuário *`rpl_user`* com a senha *`password`* é mostrado. Ao configurar seus servidores, use um nome de usuário e senha adequados.

```sql
mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
mysql> FLUSH PRIVILEGES;
```

Se o registro binário foi desativado, ative-o novamente assim que o usuário tiver sido criado usando `SET SQL_LOG_BIN=1;`.

Uma vez que o usuário tenha sido configurado, use a declaração `CHANGE MASTER TO` para configurar o servidor para usar as credenciais fornecidas para o canal de replicação `group_replication_recovery` na próxima vez que precisar recuperar seu estado de outro membro. Emitir o seguinte, substituindo *`rpl_user`* e *`password`* pelos valores usados ao criar o usuário.

```sql
mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
		      FOR CHANNEL 'group_replication_recovery';
```

A recuperação distribuída é o primeiro passo que um servidor que se junta ao grupo e não tem o mesmo conjunto de transações dos membros do grupo realiza. Se essas credenciais não forem definidas corretamente para o canal de replicação `group_replication_recovery` e o `rpl_user` conforme mostrado, o servidor não poderá se conectar aos membros do doador e executar o processo de recuperação distribuída para obter sincronia com os outros membros do grupo, e, portanto, não poderá, em última análise, se juntar ao grupo. Veja a Seção 17.9.5, “Recuperação Distribuída”.

Da mesma forma, se o servidor não conseguir identificar corretamente os outros membros através do `hostname` do servidor, o processo de recuperação pode falhar. É recomendável que os sistemas operacionais que executam o MySQL tenham um `hostname` único configurado corretamente, utilizando DNS ou configurações locais. Esse `hostname` pode ser verificado na coluna `Member_host` da tabela `performance_schema.replication_group_members`. Se vários membros do grupo externalizarem um conjunto de `hostname` padrão definido pelo sistema operacional, há a possibilidade de o membro não ser resolvido para o endereço correto do membro e não conseguir se juntar ao grupo. Nessa situação, use `report_host` para configurar um `hostname` único que seja externalizado por cada um dos servidores.

#### 17.2.1.4 Lançamento do Grupo de Replicação

Primeiro, é necessário garantir que o plugin de Replicação de Grupo esteja instalado no servidor s1. Se você usou `plugin_load_add='group_replication.so'` no arquivo de opções, então o plugin de Replicação de Grupo já está instalado e você pode prosseguir para o próximo passo. Caso contrário, você deve instalar o plugin manualmente; para isso, conecte-se ao servidor usando o cliente **mysql** e emita a declaração SQL mostrada aqui:

```sql
mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Importante

O usuário `mysql.session` deve existir antes de você poder carregar a Replicação de Grupo. `mysql.session` foi adicionado na versão 5.7.19 do MySQL. Se seu dicionário de dados foi inicializado usando uma versão anterior, você deve realizar o procedimento de atualização do MySQL (consulte Seção 2.10, “Atualizando o MySQL”). Se a atualização não for executada, a Replicação de Grupo não consegue iniciar com a mensagem de erro Houve um erro ao tentar acessar o servidor com o usuário: mysql.session@localhost. Certifique-se de que o usuário está presente no servidor e que o mysql_upgrade foi executado após uma atualização do servidor.

Para verificar se o plugin foi instalado com sucesso, execute `SHOW PLUGINS;` e verifique a saída. Ele deve mostrar algo como isso:

```sql
mysql> SHOW PLUGINS;
+----------------------------+----------+--------------------+----------------------+-------------+
| Name                       | Status   | Type               | Library              | License     |
+----------------------------+----------+--------------------+----------------------+-------------+
| binlog                     | ACTIVE   | STORAGE ENGINE     | NULL                 | PROPRIETARY |

(...)

| group_replication          | ACTIVE   | GROUP REPLICATION  | group_replication.so | PROPRIETARY |
+----------------------------+----------+--------------------+----------------------+-------------+
```

#### 17.2.1.5 Autofinanciamento do Grupo

O processo de criação de um grupo pela primeira vez é chamado de bootstrapping. Você usa a variável de sistema `group_replication_bootstrap_group` para criar um grupo. O bootstrapping deve ser feito apenas por um único servidor, o mesmo que inicia o grupo e apenas uma vez. É por isso que o valor da opção `group_replication_bootstrap_group` não foi armazenado no arquivo de opções da instância. Se for salvo no arquivo de opções, ao reiniciar o servidor, ele automaticamente cria um segundo grupo com o mesmo nome. Isso resultaria em dois grupos distintos com o mesmo nome. O mesmo raciocínio se aplica ao parar e reiniciar o plugin com esta opção definida como `ON`. Portanto, para criar o grupo de forma segura, conecte-se ao s1 e emita:

```sql
mysql> SET GLOBAL group_replication_bootstrap_group=ON;
mysql> START GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
```

Assim que a declaração `START GROUP_REPLICATION` retornar, o grupo foi iniciado. Você pode verificar que o grupo foi criado e que há um membro nele:

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | ce9be252-2b71-11e6-b8f4-00212844f856 |   s1        |       3306  | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

As informações desta tabela confirmam que há um membro no grupo com o identificador único `ce9be252-2b71-11e6-b8f4-00212844f856`, que é `ONLINE` e está em `s1` aguardando conexões de clientes na porta `3306`.

Para demonstrar que o servidor está de fato em um grupo e que é capaz de lidar com a carga, crie uma tabela e adicione algum conteúdo nela.

```sql
mysql> CREATE DATABASE test;
mysql> USE test;
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL);
mysql> INSERT INTO t1 VALUES (1, 'Luis');
```

Verifique o conteúdo da tabela `t1` e o log binário.

```sql
mysql> SELECT * FROM t1;
+----+------+
| c1 | c2   |
+----+------+
|  1 | Luis |
+----+------+

mysql> SHOW BINLOG EVENTS;
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
| Log_name      | Pos | Event_type     | Server_id | End_log_pos | Info                                                               |
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
| binlog.000001 |   4 | Format_desc    |         1 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
| binlog.000001 | 123 | Previous_gtids |         1 |         150 |                                                                    |
| binlog.000001 | 150 | Gtid           |         1 |         211 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'  |
| binlog.000001 | 211 | Query          |         1 |         270 | BEGIN                                                              |
| binlog.000001 | 270 | View_change    |         1 |         369 | view_id=14724817264259180:1                                        |
| binlog.000001 | 369 | Query          |         1 |         434 | COMMIT                                                             |
| binlog.000001 | 434 | Gtid           |         1 |         495 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:2'  |
| binlog.000001 | 495 | Query          |         1 |         585 | CREATE DATABASE test                                               |
| binlog.000001 | 585 | Gtid           |         1 |         646 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:3'  |
| binlog.000001 | 646 | Query          |         1 |         770 | use `test`; CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL) |
| binlog.000001 | 770 | Gtid           |         1 |         831 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:4'  |
| binlog.000001 | 831 | Query          |         1 |         899 | BEGIN                                                              |
| binlog.000001 | 899 | Table_map      |         1 |         942 | table_id: 108 (test.t1)                                            |
| binlog.000001 | 942 | Write_rows     |         1 |         984 | table_id: 108 flags: STMT_END_F                                    |
| binlog.000001 | 984 | Xid            |         1 |        1011 | COMMIT /* xid=38 */                                                |
+---------------+-----+----------------+-----------+-------------+--------------------------------------------------------------------+
```

Como visto acima, o banco de dados e os objetos da tabela foram criados e suas respectivas declarações DDL foram escritas no log binário. Além disso, os dados foram inseridos na tabela e escritos no log binário. A importância das entradas do log binário é ilustrada na seção seguinte, quando o grupo cresce e a recuperação distribuída é executada, à medida que novos membros tentam se atualizar e se tornarem online.

#### 17.2.1.6 Adicionando Instâncias ao Grupo

Neste ponto, o grupo tem um membro, o servidor s1, que possui alguns dados. Agora é hora de expandir o grupo, adicionando os outros dois servidores configurados anteriormente.

##### 17.2.1.6.1 Adicionando uma segunda instância

Para adicionar uma segunda instância, o servidor s2, primeiro crie o arquivo de configuração para ele. A configuração é semelhante àquela usada para o servidor s1, exceto por coisas como o `server_id`.

```sql
[mysqld]

#
# Disable other storage engines
#
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"

#
# Replication configuration parameters
#
server_id=2
gtid_mode=ON
enforce_gtid_consistency=ON
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW

#
# Group Replication configuration
#
transaction_write_set_extraction=XXHASH64
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s2:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

Semelhante ao procedimento para o servidor s1, com a opção de arquivo em uso, você inicia o servidor. Em seguida, configure as credenciais de recuperação da seguinte forma. Os comandos são os mesmos usados ao configurar o servidor s1, pois o usuário é compartilhado dentro do grupo. Este membro precisa ter o mesmo usuário de replicação configurado na Seção 17.2.1.3, “Credenciais do Usuário”. Se você está confiando na recuperação distribuída para configurar o usuário em todos os membros, quando o s2 se conecta ao s1 de origem, o usuário de replicação é relicado para o s1. Se você não tinha o registro binário habilitado quando configurou as credenciais do usuário no s1, você deve criar o usuário de replicação no s2. Neste caso, conecte-se ao s2 e emita:

```sql
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Se necessário, instale o plugin de Replicação de Grupo, consulte a Seção 17.2.1.4, “Lançamento da Replicação de Grupo”.

Inicie a replicação em grupo e o s2 inicia o processo de adesão ao grupo.

```sql
mysql> START GROUP_REPLICATION;
```

Ao contrário das etapas anteriores, que eram as mesmas que as executadas no s1, aqui há uma diferença: você *não* precisa bootstrap o grupo porque o grupo já existe. Em outras palavras, no s2 `group_replication_bootstrap_group` está definido como desligado, e você não emite `SET GLOBAL group_replication_bootstrap_group=ON;` antes de iniciar a Replicação do Grupo, porque o grupo já foi criado e bootstrapado pelo servidor s1. Neste ponto, o servidor s2 só precisa ser adicionado ao grupo já existente.

Dica

Quando a Replicação em Grupo começa com sucesso e o servidor se junta ao grupo, ele verifica a variável `super_read_only`. Ao definir `super_read_only` para ON no arquivo de configuração do membro, você pode garantir que os servidores que falham ao iniciar a Replicação em Grupo por qualquer motivo não aceitem transações. Se o servidor deve se juntar ao grupo como uma instância de leitura e escrita, por exemplo, como o principal em um grupo de principal único ou como um membro de um grupo de múltiplos principais, quando a variável `super_read_only` é definida para ON, ela é definida para OFF ao se juntar ao grupo.

Verificando novamente a tabela `performance_schema.replication_group_members`, mostra-se que agora há dois servidores *ONLINE* no grupo.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE        |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

Quando o s2 tentou se juntar ao grupo, a Seção 17.9.5, “Recuperação Distribuída”, garantiu que o s2 aplicasse as mesmas transações que o s1 havia aplicado. Uma vez que esse processo foi concluído, o s2 pôde se juntar ao grupo como membro, e, neste ponto, ele é marcado como ONLINE. Em outras palavras, ele deve ter se atualizado automaticamente com o servidor s1. Uma vez que o s2 esteja ONLINE, ele então começa a processar transações com o grupo. Verifique se o s2 realmente se sincronizou com o servidor s1 da seguinte forma.

```sql
mysql> SHOW DATABASES LIKE 'test';
+-----------------+
| Database (test) |
+-----------------+
| test            |
+-----------------+

mysql> SELECT * FROM test.t1;
+----+------+
| c1 | c2   |
+----+------+
|  1 | Luis |
+----+------+

mysql> SHOW BINLOG EVENTS;
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| Log_name      | Pos  | Event_type     | Server_id | End_log_pos | Info                                                               |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| binlog.000001 |    4 | Format_desc    |         2 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
| binlog.000001 |  123 | Previous_gtids |         2 |         150 |                                                                    |
| binlog.000001 |  150 | Gtid           |         1 |         211 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'  |
| binlog.000001 |  211 | Query          |         1 |         270 | BEGIN                                                              |
| binlog.000001 |  270 | View_change    |         1 |         369 | view_id=14724832985483517:1                                        |
| binlog.000001 |  369 | Query          |         1 |         434 | COMMIT                                                             |
| binlog.000001 |  434 | Gtid           |         1 |         495 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:2'  |
| binlog.000001 |  495 | Query          |         1 |         585 | CREATE DATABASE test                                               |
| binlog.000001 |  585 | Gtid           |         1 |         646 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:3'  |
| binlog.000001 |  646 | Query          |         1 |         770 | use `test`; CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL) |
| binlog.000001 |  770 | Gtid           |         1 |         831 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:4'  |
| binlog.000001 |  831 | Query          |         1 |         890 | BEGIN                                                              |
| binlog.000001 |  890 | Table_map      |         1 |         933 | table_id: 108 (test.t1)                                            |
| binlog.000001 |  933 | Write_rows     |         1 |         975 | table_id: 108 flags: STMT_END_F                                    |
| binlog.000001 |  975 | Xid            |         1 |        1002 | COMMIT /* xid=30 */                                                |
| binlog.000001 | 1002 | Gtid           |         1 |        1063 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:5'  |
| binlog.000001 | 1063 | Query          |         1 |        1122 | BEGIN                                                              |
| binlog.000001 | 1122 | View_change    |         1 |        1261 | view_id=14724832985483517:2                                        |
| binlog.000001 | 1261 | Query          |         1 |        1326 | COMMIT                                                             |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
```

Como visto acima, o segundo servidor foi adicionado ao grupo e replicou as alterações do servidor s1 automaticamente usando recuperação distribuída. Em outras palavras, as transações aplicadas em s1 até o momento em que s2 se juntou ao grupo foram replicadas para s2.

##### 17.2.1.6.2 Adicionando instâncias adicionais

Adicionar instâncias adicionais ao grupo é essencialmente a mesma sequência de etapas que adicionar o segundo servidor, exceto que a configuração precisa ser alterada, como teve que ser para o servidor s2. Para resumir os comandos necessários:

*1. Crie o arquivo de configuração*

```sql
[mysqld]

#
# Disable other storage engines
#
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"

#
# Replication configuration parameters
#
server_id=3
gtid_mode=ON
enforce_gtid_consistency=ON
master_info_repository=TABLE
relay_log_info_repository=TABLE
binlog_checksum=NONE
log_slave_updates=ON
log_bin=binlog
binlog_format=ROW

#
# Group Replication configuration
#
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s3:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

*2. Inicie o servidor e conecte-se a ele. Configure as credenciais de recuperação para o canal group_replication_recovery.*

```sql
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password'  \\
FOR CHANNEL 'group_replication_recovery';
```

*4. Instale o plugin de Replicação de Grupo e inicie-o.

```sql
INSTALL PLUGIN group_replication SONAME 'group_replication.so';
START GROUP_REPLICATION;
```

Neste ponto, o servidor s3 está inicializado e em funcionamento, se juntou ao grupo e alcançou os outros servidores do grupo. Consultar a tabela `performance_schema.replication_group_members` novamente confirma que este é o caso.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |       3306  | ONLINE        |
| group_replication_applier | 7eb217ff-6df3-11e6-966c-00212844f856 |   s3        |       3306  | ONLINE        |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |       3306  | ONLINE        |
+---------------------------+--------------------------------------+-------------+-------------+---------------+
```

Fazendo essa mesma consulta no servidor s2 ou no servidor s1, obtém-se o mesmo resultado. Além disso, você pode verificar que o servidor s3 já alcançou o mesmo nível:

```sql
mysql> SHOW DATABASES LIKE 'test';
+-----------------+
| Database (test) |
+-----------------+
| test            |
+-----------------+

mysql> SELECT * FROM test.t1;
+----+------+
| c1 | c2   |
+----+------+
|  1 | Luis |
+----+------+

mysql> SHOW BINLOG EVENTS;
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| Log_name      | Pos  | Event_type     | Server_id | End_log_pos | Info                                                               |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
| binlog.000001 |    4 | Format_desc    |         3 |         123 | Server ver: 5.7.44-log, Binlog ver: 4                              |
| binlog.000001 |  123 | Previous_gtids |         3 |         150 |                                                                    |
| binlog.000001 |  150 | Gtid           |         1 |         211 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'  |
| binlog.000001 |  211 | Query          |         1 |         270 | BEGIN                                                              |
| binlog.000001 |  270 | View_change    |         1 |         369 | view_id=14724832985483517:1                                        |
| binlog.000001 |  369 | Query          |         1 |         434 | COMMIT                                                             |
| binlog.000001 |  434 | Gtid           |         1 |         495 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:2'  |
| binlog.000001 |  495 | Query          |         1 |         585 | CREATE DATABASE test                                               |
| binlog.000001 |  585 | Gtid           |         1 |         646 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:3'  |
| binlog.000001 |  646 | Query          |         1 |         770 | use `test`; CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL) |
| binlog.000001 |  770 | Gtid           |         1 |         831 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:4'  |
| binlog.000001 |  831 | Query          |         1 |         890 | BEGIN                                                              |
| binlog.000001 |  890 | Table_map      |         1 |         933 | table_id: 108 (test.t1)                                            |
| binlog.000001 |  933 | Write_rows     |         1 |         975 | table_id: 108 flags: STMT_END_F                                    |
| binlog.000001 |  975 | Xid            |         1 |        1002 | COMMIT /* xid=29 */                                                |
| binlog.000001 | 1002 | Gtid           |         1 |        1063 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:5'  |
| binlog.000001 | 1063 | Query          |         1 |        1122 | BEGIN                                                              |
| binlog.000001 | 1122 | View_change    |         1 |        1261 | view_id=14724832985483517:2                                        |
| binlog.000001 | 1261 | Query          |         1 |        1326 | COMMIT                                                             |
| binlog.000001 | 1326 | Gtid           |         1 |        1387 | SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:6'  |
| binlog.000001 | 1387 | Query          |         1 |        1446 | BEGIN                                                              |
| binlog.000001 | 1446 | View_change    |         1 |        1585 | view_id=14724832985483517:3                                        |
| binlog.000001 | 1585 | Query          |         1 |        1650 | COMMIT                                                             |
+---------------+------+----------------+-----------+-------------+--------------------------------------------------------------------+
```

### 17.2.2 Implementando Replicação de Grupo Localmente

A maneira mais comum de implementar a Replicação em Grupo é usando várias instâncias de servidor, para fornecer alta disponibilidade. Também é possível implementar a Replicação em Grupo localmente, por exemplo, para fins de teste. Esta seção explica como você pode implementar a Replicação em Grupo localmente.

Importante

A Replicação em Grupo é geralmente implantada em vários hosts, pois isso garante a alta disponibilidade. As instruções desta seção não são adequadas para implantações de produção, pois todas as instâncias do servidor MySQL estão em execução no mesmo único host. No caso de falha deste host, todo o grupo falha. Portanto, essas informações devem ser usadas para fins de teste e não devem ser usadas em ambientes de produção.

Esta seção explica como criar um grupo de replicação com três instâncias do MySQL Server em uma máquina física. Isso significa que são necessários três diretórios de dados, um por instância do servidor, e que você precisa configurar cada instância de forma independente. Este procedimento assume que o MySQL Server foi baixado e desempacotado - no diretório denominado `mysql-5.7`. Cada instância do servidor MySQL requer um diretório de dados específico. Crie um diretório denominado `data`, em seguida, nesse diretório, crie um subdiretório para cada instância do servidor, por exemplo, s1, s2 e s3, e inicie cada um.

```sql
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s1
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s2
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s3
```

Dentro de `data/s1`, `data/s2`, `data/s3` é um diretório de dados inicializado, contendo o banco de dados do sistema mysql e tabelas relacionadas e muito mais. Para saber mais sobre o procedimento de inicialização, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Não use `-initialize-insecure` em ambientes de produção, ele é usado apenas aqui para simplificar o tutorial. Para mais informações sobre as configurações de segurança, consulte a Seção 17.6, “Segurança da Replicação em Grupo”.

#### Configuração de membros da replicação de grupo local

Ao seguir a Seção 17.2.1.2, “Configurando uma Instância para Replicação em Grupo”, você precisa adicionar a configuração para os diretórios de dados adicionados na seção anterior. Por exemplo:

```sql
[mysqld]

# server configuration
datadir=<full_path_to_data>/data/s1
basedir=<full_path_to_bin>/mysql-8.0/

port=24801
socket=<full_path_to_sock_dir>/s1.sock
```

Essas configurações configuram o servidor MySQL para usar o diretório de dados criado anteriormente e que porta o servidor deve abrir e começar a ouvir conexões recebidas.

Nota

O porto não padrão de 24801 é usado porque, neste tutorial, as três instâncias do servidor utilizam o mesmo nome de host. Em uma configuração com três máquinas diferentes, isso não seria necessário.

A Replicação em Grupo requer uma conexão de rede entre os membros, o que significa que cada membro deve ser capaz de resolver o endereço de rede de todos os outros membros. Por exemplo, neste tutorial, todas as três instâncias são executadas em uma máquina, então, para garantir que os membros possam se comunicar entre si, você pode adicionar uma linha ao arquivo de opções, como `report_host=127.0.0.1`.

Então, cada membro precisa ser capaz de se conectar aos outros membros em seu `group_replication_local_address`. Por exemplo, no arquivo de opções do membro s1, adicione:

```sql
group_replication_local_address= "127.0.0.1:24901"
group_replication_group_seeds= "127.0.0.1:24901,127.0.0.1:24902,127.0.0.1:24903"
```

Isso configura o s1 para usar a porta 24901 para comunicação interna de grupo com membros da semente. Para cada instância do servidor que você deseja adicionar ao grupo, faça essas alterações no arquivo de opções do membro. Para cada membro, você deve garantir que um endereço único seja especificado, então use uma porta única por instância para `group_replication_local_address`. Geralmente, você deseja que todos os membros possam servir como sementes para membros que estão se juntando ao grupo e não receberam as transações processadas pelo grupo. Neste caso, adicione todas as portas ao `group_replication_group_seeds` como mostrado acima.

Os passos restantes da Seção 17.2.1, “Implementando a Replicação de Grupo no Modo de Primariúnico”, se aplicam igualmente a um grupo que você tenha implementado localmente dessa forma.