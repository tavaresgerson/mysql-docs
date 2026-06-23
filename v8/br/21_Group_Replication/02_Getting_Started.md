## 20.2 Começando

O MySQL Group Replication é fornecido como um plugin para o servidor MySQL; cada servidor em um grupo requer configuração e instalação do plugin. Esta seção fornece um tutorial detalhado com os passos necessários para criar um grupo de replicação com pelo menos três membros.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

### 20.2.1 Implementando a Replicação de Grupo no Modo de Primariúnico

Cada uma das instâncias do servidor MySQL em um grupo pode ser executada em uma máquina física independente, que é a maneira recomendada para implantar a Replicação de Grupo. Esta seção explica como criar um grupo de replicação com três instâncias do Servidor MySQL, cada uma executando em uma máquina física diferente. Consulte a Seção 20.2.2, “Implementação da Replicação de Grupo Localmente”, para obter informações sobre a implantação de múltiplas instâncias do servidor MySQL que executam a Replicação de Grupo na mesma máquina física, por exemplo, para fins de teste.

**Figura 20.7 Arquitetura de grupo**

![Three server instances, S1, S2, and S3, are deployed as an interconnected group, and clients communicate with each of the server instances.](images/gr-3-server-group.png)

Este tutorial explica como obter e implantar o MySQL Server com o plugin de Replicação por Grupo, como configurar cada instância do servidor antes de criar um grupo e como usar o monitoramento do Schema de Desempenho para verificar se tudo está funcionando corretamente.

#### 20.2.1.1. Implantação de instâncias para replicação em grupo

O primeiro passo é implantar pelo menos três instâncias do MySQL Server, este procedimento demonstra o uso de vários hosts para as instâncias, nomeados s1, s2 e s3. Assume-se que o MySQL Server está instalado em cada host (veja o Capítulo 2, *Instalando o MySQL*). O plugin de Replicação de Grupo é fornecido com o MySQL Server 8.0; não é necessário software adicional, embora o plugin deva ser instalado no servidor MySQL em execução. Consulte a Seção 20.2.1.1, “Implantação de Instâncias para Replicação de Grupo”; para informações adicionais, consulte a Seção 7.6, “Plugins do MySQL Server”.

Neste exemplo, são utilizadas três instâncias para o grupo, que é o número mínimo de instâncias a serem criadas para criar um grupo. Adicionar mais instâncias aumenta a tolerância à falha do grupo. Por exemplo, se o grupo consistir em três membros, em caso de falha de uma instância, o grupo pode continuar. Mas, em caso de outra falha, o grupo não pode mais continuar processando transações de escrita. Ao adicionar mais instâncias, o número de servidores que podem falhar enquanto o grupo continua a processar transações também aumenta. O número máximo de instâncias que podem ser utilizadas em um grupo é de nove. Para mais informações, consulte a Seção 20.1.4.2, “Detecção de Falha”.

#### 20.2.1.2 Configurando uma Instância para Replicação em Grupo

Esta seção explica as configurações necessárias para as instâncias do MySQL Server que você deseja usar para a Replicação de Grupo. Para informações de fundo, consulte a Seção 20.3, “Requisitos e Limitações”.

* Motores de armazenamento
* Estrutura de replicação
* Configurações de replicação de grupo

##### Motores de Armazenamento

Para a Replicação em Grupo, os dados devem ser armazenados no motor de armazenamento transacional InnoDB (para detalhes sobre o porquê, consulte a Seção 20.3.1, “Requisitos de Replicação em Grupo”). O uso de outros motores de armazenamento, incluindo o motor de armazenamento temporário `MEMORY`, pode causar erros na Replicação em Grupo. Defina a variável de sistema `disabled_storage_engines` da seguinte forma para evitar seu uso:

```
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
```

Observe que, com o mecanismo de armazenamento `MyISAM` desativado, quando você está atualizando uma instância do MySQL para uma versão onde o **mysql_upgrade** ainda é usado (antes do MySQL 8.0.16), o **mysql_upgrade** pode falhar com um erro. Para lidar com isso, você pode reativar esse mecanismo de armazenamento enquanto executa o **mysql_upgrade**, e depois desativá-lo novamente quando reiniciar o servidor. Para mais informações, consulte a Seção 6.4.5, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

##### Estrutura de Replicação

Os seguintes ajustes configuram a replicação de acordo com os requisitos do MySQL Group Replication.

```
server_id=1
gtid_mode=ON
enforce_gtid_consistency=ON
```

Essas configurações configuram o servidor para usar o número de identificador único 1, para habilitar a Seção 19.1.3, “Replicação com Identificadores de Transação Global”, e para permitir a execução apenas de declarações que podem ser registradas com segurança usando um GTID.

Até e incluindo o MySQL 8.0.20, o seguinte ajuste também é necessário:

```
binlog_checksum=NONE
```

Essa configuração desativa os checksums para eventos escritos no log binário, que são ativados por padrão. No MySQL 8.0.21 e versões posteriores, a Replicação por Grupo suporta a presença de checksums no log binário e pode usá-los para verificar a integridade dos eventos em alguns canais, então você pode usar o ajuste padrão. Para mais detalhes, consulte a Seção 20.3.2, “Limitações da Replicação por Grupo”.

Se você estiver usando uma versão do MySQL anterior à 8.0.3, onde os padrões foram aprimorados para replicação, também é necessário adicionar essas linhas ao arquivo de opções do membro. Se você tiver alguma dessas variáveis de sistema no arquivo de opções em versões posteriores, certifique-se de que elas estejam definidas conforme mostrado. Para mais detalhes, consulte a Seção 20.3.1, “Requisitos de Replicação de Grupo”.

```
log_bin=binlog
log_slave_updates=ON
binlog_format=ROW
master_info_repository=TABLE
relay_log_info_repository=TABLE
transaction_write_set_extraction=XXHASH64
```

Configurações de Replicação de Grupo

Neste ponto, o arquivo de opções garante que o servidor esteja configurado e instruído a instanciar a infraestrutura de replicação sob uma configuração específica. A seção a seguir configura as configurações de Replicação de Grupo para o servidor.

```
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s1:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group=off
```

* `plugin-load-add` adiciona o plugin de replicação de grupo à lista de plugins que o servidor carrega no início. Isso é preferível em uma implantação em produção em vez de instalar o plugin manualmente.

* Configurar `group_replication_group_name` informa ao plugin que o grupo ao qual ele está se juntando ou criando é chamado de "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".

O valor de `group_replication_group_name` deve ser um UUID válido. Você pode usar `SELECT UUID()` para gerar um. Esse UUID faz parte dos GTIDs que são usados quando as transações recebidas pelos membros do grupo de clientes e eventos de visualização de alterações que são gerados internamente pelos membros do grupo são escritos no log binário.

* Configurar a variável `group_replication_start_on_boot` para `off` instrui o plugin a não iniciar operações automaticamente quando o servidor é iniciado. Isso é importante ao configurar a Replicação de Grupo, pois garante que você pode configurar o servidor antes de iniciar manualmente o plugin. Uma vez que o membro é configurado, você pode definir `group_replication_start_on_boot` para `on` para que a Replicação de Grupo seja iniciada automaticamente após o inicialização do servidor.

* Configurar `group_replication_local_address` define o endereço de rede e a porta que o membro utiliza para a comunicação interna com outros membros do grupo. A Replicação de Grupo utiliza este endereço para conexões internas entre membros que envolvem instâncias remotas do motor de comunicação do grupo (XCom, uma variante Paxos).

Importante

O endereço local de replicação do grupo deve ser diferente do nome do host e do número de porta utilizados para as conexões do cliente SQL, que são definidos pelas variáveis de sistema `hostname` e `port` do MySQL Server. Não deve ser utilizado para aplicações de clientes. Deve ser utilizado apenas para comunicação interna entre os membros do grupo enquanto o Grupo de Replicação estiver em execução.

O endereço de rede configurado por `group_replication_local_address` deve ser resolvível por todos os membros do grupo. Por exemplo, se cada instância do servidor estiver em uma máquina diferente com um endereço de rede fixo, você pode usar o endereço IP da máquina, como 10.0.0.1. Se você usar um nome de host, deve usar um nome totalmente qualificado e garantir que ele seja resolvível através de arquivos `/etc/hosts` configurados corretamente ou outros processos de resolução de nomes. No MySQL 8.0.14 e versões posteriores, endereços IPv6 (ou nomes de host que os resolvam) podem ser usados, assim como endereços IPv4. Um grupo pode conter uma mistura de membros que usam IPv6 e membros que usam IPv4. Para mais informações sobre o suporte à replicação de grupo para redes IPv6 e sobre grupos mistos de IPv4 e IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas de IPv6 e IPv4”.

O porto recomendado para `group_replication_local_address` é 33061. Este é usado pelo Grupo de Replicação como identificador único para um membro do grupo dentro do grupo de replicação. Você pode usar o mesmo porto para todos os membros de um grupo de replicação, desde que os nomes de hospedagem ou endereços IP sejam todos diferentes, como demonstrado neste tutorial. Alternativamente, você pode usar o mesmo nome de hospedagem ou endereço IP para todos os membros, desde que os portos sejam todos diferentes, por exemplo, como mostrado na Seção 20.2.2, “Implementando a Replicação de Grupo Localmente”.

A conexão que um membro existente oferece a um membro que se junta ao processo de recuperação distribuída do Grupo não é o endereço de rede configurado pelo `group_replication_local_address`. No MySQL 8.0.20 e versões anteriores, os membros do grupo oferecem sua conexão padrão de cliente SQL a membros que se juntam para recuperação distribuída, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. No MySQL 8.0.21 e versões posteriores, os membros do grupo podem anunciar uma lista alternativa de pontos finais de recuperação distribuída como conexões de cliente dedicadas para membros que se juntam. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”.

Importante

A recuperação distribuída pode falhar se um membro que se junta não conseguir identificar corretamente os outros membros usando o nome do host definido pela variável de sistema `hostname` do MySQL Server. É recomendável que os sistemas operacionais que executam o MySQL tenham um nome de host único configurado corretamente, seja usando DNS ou configurações locais. O nome de host que o servidor está usando para conexões de cliente SQL pode ser verificado na coluna `Member_host` da tabela do Schema de Desempenho `replication_group_members`. Se vários membros do grupo externalizarem um nome de host padrão definido pelo sistema operacional, há uma chance de o membro que se junta não resolvê-lo para o endereço correto do membro e não conseguir se conectar para a recuperação distribuída. Nessa situação, você pode usar a variável de sistema `report_host` do MySQL Server para configurar um nome de host único que seja externalizado por cada um dos servidores.

* Configurar `group_replication_group_seeds` define o nome do host e a porta dos membros do grupo que são usados pelo novo membro para estabelecer sua conexão com o grupo. Esses membros são chamados de membros de semente. Uma vez que a conexão é estabelecida, as informações de filiação do grupo são listadas na tabela do Schema de Desempenho `replication_group_members`. Geralmente, a lista `group_replication_group_seeds` contém os `hostname:port` de cada um dos `group_replication_local_address` dos membros do grupo, mas isso não é obrigatório e um subconjunto dos membros do grupo pode ser escolhido como sementes.

Importante

O endereço interno da rede do membro da lista `hostname:port` listado em `group_replication_group_seeds` é configurado pelo `group_replication_local_address` e não o `hostname:port` usado para conexões de clientes SQL, que é mostrado, por exemplo, na tabela do Gerador de Desempenho `replication_group_members`.

O servidor que inicia o grupo não utiliza essa opção, uma vez que é o servidor inicial e, como tal, é responsável por iniciar o grupo. Em outras palavras, quaisquer dados existentes que estejam no servidor que inicia o grupo são usados como dados para o próximo membro que se junta. O segundo servidor que se junta pede ao único membro do grupo que se junta, quaisquer dados ausentes no segundo servidor são replicados dos dados do membro doador e, em seguida, o grupo se expande. O terceiro servidor que se junta pode pedir a qualquer um desses dois para se juntar, os dados são sincronizados com o novo membro e, em seguida, o grupo se expande novamente. Os servidores subsequentes repetem esse procedimento ao se juntarem.

Aviso

Ao conectar vários servidores ao mesmo tempo, certifique-se de que eles apontem para membros de semente que já estejam no grupo. Não use membros que também estejam se conectando ao grupo como sementes, porque eles podem não estar ainda no grupo quando contatados.

É uma boa prática começar com o membro bootstrap primeiro e deixá-lo criar o grupo. Em seguida, faça dele o membro inicial para o resto dos membros que estão se juntando. Isso garante que haja um grupo formado quando se juntar ao resto dos membros.

Criar um grupo e juntar vários membros ao mesmo tempo não é suportado. Pode funcionar, mas é provável que as operações corram e, em seguida, o ato de juntar-se ao grupo acabe em um erro ou em um tempo de espera.

Um membro associado deve se comunicar com um membro inicial usando o mesmo protocolo (IPv4 ou IPv6) que o membro inicial anuncia na opção `group_replication_group_seeds`. Para fins de permissão de endereço IP para a Replicação em Grupo, a lista de permissão no membro inicial deve incluir um endereço IP do membro associado para o protocolo oferecido pelo membro inicial, ou um nome de host que resolva a um endereço para esse protocolo. Esse endereço ou nome de host deve ser configurado e permitido além do `group_replication_local_address` do membro associado, se o protocolo para esse endereço não corresponder ao protocolo anunciado pelo membro inicial. Se um membro associado não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações, consulte a Seção 20.6.4, “Permissões de Endereço IP para Replicação em Grupo”.

* Configurar `group_replication_bootstrap_group` instrui o plugin se deve iniciar o grupo ou não. Neste caso, embora s1 seja o primeiro membro do grupo, configuramos esta variável para off no arquivo de opções. Em vez disso, configuramos `group_replication_bootstrap_group` quando a instância está em execução, para garantir que apenas um membro realmente inicie o grupo.

Importante

A variável `group_replication_bootstrap_group` deve ser habilitada apenas em uma instância do servidor que pertence a um grupo a qualquer momento, geralmente na primeira vez que você inicializa o grupo (ou no caso de o grupo inteiro ser desligado e reiniciado). Se você inicializar o grupo várias vezes, por exemplo, quando várias instâncias do servidor têm essa opção definida, então eles podem criar um cenário de cérebro artificial, em que dois grupos distintos com o mesmo nome existem. Sempre defina `group_replication_bootstrap_group=off` após a primeira instância do servidor entrar em linha.

As variáveis do sistema descritas neste tutorial são as configurações de configuração necessárias para iniciar um novo membro, mas também estão disponíveis outras variáveis do sistema para configurar membros do grupo. Essas são listadas na Seção 20.9, “Variáveis de Replicação de Grupo”.

Importante

Várias variáveis do sistema, algumas específicas para a Replicação em Grupo e outras não, são configurações de nível de grupo que devem ter o mesmo valor em todos os membros do grupo. Se os membros do grupo tiverem um valor definido para uma dessas variáveis do sistema, e um membro que se junta tiver um valor diferente definido para ela, o membro que se junta não pode se juntar ao grupo e uma mensagem de erro é retornada. Se os membros do grupo tiverem um valor definido para essa variável do sistema, e o membro que se junta não suporte a variável do sistema, não pode se juntar ao grupo. Essas variáveis do sistema são todas identificadas na Seção 20.9, “Variáveis de Replicação em Grupo”.

#### 20.2.1.3 Credenciais do Usuário para Recuperação Distribuída

A Replicação em Grupo utiliza um processo de recuperação distribuída para sincronizar os membros do grupo ao adicioná-los ao grupo. A recuperação distribuída envolve a transferência de transações de um log binário de um doador para um membro que está sendo adicionado, utilizando um canal de replicação chamado `group_replication_recovery`. Portanto, você deve configurar um usuário de replicação com as permissões corretas para que a Replicação em Grupo possa estabelecer canais de replicação diretos entre os membros. Se os membros do grupo foram configurados para suportar o uso de uma operação de clonagem remota como parte da recuperação distribuída, que está disponível no MySQL 8.0.17 e versões posteriores, este usuário de replicação também é usado como o usuário de clonagem no doador e requer as permissões corretas para este papel também. Para uma descrição completa da recuperação distribuída, consulte a Seção 20.5.4, “Recuperação Distribuída”.

O mesmo usuário de replicação deve ser usado para recuperação distribuída em todos os membros do grupo. O processo de criação do usuário de replicação para recuperação distribuída pode ser registrado no log binário, e então você pode confiar na recuperação distribuída para replicar as declarações usadas para criar o usuário. Alternativamente, você pode desabilitar o registro binário antes de criar o usuário de replicação, e então criar o usuário manualmente em cada membro, por exemplo, se você quiser evitar que as alterações sejam propagadas para outras instâncias do servidor. Se você fizer isso, certifique-se de reativar o registro binário uma vez que tenha configurado o usuário.

Importante

Se as conexões de recuperação distribuídas do seu grupo utilizarem SSL, o usuário de replicação deve ser criado em cada servidor *antes* do membro que se junta se conectar ao doador. Para obter instruções sobre como configurar SSL para conexões de recuperação distribuídas e criar um usuário de replicação que exija SSL, consulte a Seção 20.6.3, “Segurando Conexões de Recuperação Distribuídas”.

Importante

Por padrão, os usuários criados no MySQL 8 utilizam a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”. Se o usuário de replicação para recuperação distribuída utilizar o plugin de autenticação de cache SHA-2 e você não está usando SSL para conexões de recuperação distribuída, pares de chave RSA são usados para troca de senha. Você pode copiar a chave pública do usuário de replicação para o membro que está se juntando, ou configurar os doadores para fornecer a chave pública quando solicitado. Para obter instruções sobre como fazer isso, consulte a Seção 20.6.3.1, “Credenciais de Usuário Seguro para Recuperação Distribuída”.

Para criar o usuário de replicação para recuperação distribuída, siga estes passos:

1. Inicie a instância do servidor MySQL e, em seguida, conecte um cliente a ela.

2. Se você deseja desabilitar o registro binário para criar o usuário de replicação separadamente em cada instância, faça isso emitindo a seguinte declaração:

   ```
   mysql> SET SQL_LOG_BIN=0;
   ```

3. Crie um usuário MySQL com os seguintes privilégios:

* `REPLICATION SLAVE`, que é necessário para fazer uma conexão de recuperação distribuída com um doador para recuperar dados.

* `CONNECTION_ADMIN`, que garante que as conexões de replicação de grupo não sejam terminadas se um dos servidores envolvidos for colocado no modo offline.

* `BACKUP_ADMIN`, se os servidores do grupo de replicação estiverem configurados para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”). Este privilégio é necessário para que um membro atue como doador em uma operação de clonagem para recuperação distribuída.

* `GROUP_REPLICATION_STREAM`, se a pilha de comunicação MySQL estiver em uso para o grupo de replicação (consulte a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”). Este privilégio é necessário para que a conta do usuário possa estabelecer e manter conexões para a Replicação de Grupo usando a pilha de comunicação MySQL.

Neste exemplo, o usuário *`rpl_user`* com a senha *`password`* é mostrado. Ao configurar seus servidores, use um nome de usuário e senha adequados:

   ```
   mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
   mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
   mysql> GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   mysql> FLUSH PRIVILEGES;
   ```

4. Se você desativou o registro binário, ative-o novamente assim que tiver criado o usuário, emitindo a seguinte declaração:

   ```
   mysql> SET SQL_LOG_BIN=1;
   ```

5. Quando você criou o usuário de replicação, deve fornecer as credenciais do usuário ao servidor para uso com recuperação distribuída. Isso pode ser feito definindo as credenciais do usuário como as credenciais para o canal `group_replication_recovery`, usando uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (MySQL 8.0.23 ou posterior) ou declaração `CHANGE MASTER TO` (anterior ao MySQL 8.0.23). Alternativamente, no MySQL 8.0.21 e posterior, você pode especificar as credenciais do usuário para recuperação distribuída na declaração `START GROUP_REPLICATION` (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement").

As credenciais do usuário definidas usando `CHANGE REPLICATION SOURCE TO` e (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` são armazenadas em texto simples nos repositórios de metadados de replicação no servidor. Elas são aplicadas sempre que a Replicação de Grupo é iniciada, incluindo iniciações automáticas se a variável de sistema `group_replication_start_on_boot` for definida como `ON`.

* As credenciais do usuário especificadas em `START GROUP_REPLICATION` são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION` ou desligamento do servidor. Você deve emitir uma declaração `START GROUP_REPLICATION` para fornecer as credenciais novamente, portanto, não é possível iniciar a Replicação em Grupo automaticamente com essas credenciais. Esse método de especificação das credenciais do usuário ajuda a proteger os servidores da Replicação em Grupo contra acesso não autorizado.

Para obter mais informações sobre as implicações de segurança de cada método de fornecimento das credenciais do usuário, consulte a Seção 20.6.3.1.3, “Fornecer credenciais de usuário de replicação de forma segura”. Se você optar por fornecer as credenciais do usuário usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita a seguinte declaração na instância do servidor agora, substituindo *`rpl_user`* e *`password`* pelos valores usados ao criar o usuário:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
   		      FOR CHANNEL 'group_replication_recovery';
   ```

Ou, no MySQL 8.0.23 ou posterior:

   ```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
   		      FOR CHANNEL 'group_replication_recovery';
   ```

#### 20.2.1.4 Lançamento do Grupo de Replicação

Primeiro, é necessário garantir que o plugin de Replicação de Grupo esteja instalado no servidor s1. Se você usou `plugin_load_add='group_replication.so'` no arquivo de opções, então o plugin de Replicação de Grupo já está instalado e você pode prosseguir para o próximo passo. Caso contrário, você deve instalar o plugin manualmente; para isso, conecte-se ao servidor usando o cliente **mysql** e emita a declaração SQL mostrada aqui:

```
mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Importante

O usuário `mysql.session` deve existir antes de você poder carregar a Replicação de Grupo. `mysql.session` foi adicionado na versão 8.0.2 do MySQL. Se seu dicionário de dados foi inicializado usando uma versão anterior, você deve realizar o procedimento de atualização do MySQL (veja o Capítulo 3, *Atualizando o MySQL*). Se a atualização não for executada, a Replicação de Grupo não consegue iniciar com a mensagem de erro Houve um erro ao tentar acessar o servidor com o usuário: mysql.session@localhost. Certifique-se de que o usuário está presente no servidor e que o mysql_upgrade foi executado após uma atualização do servidor.

Para verificar se o plugin foi instalado com sucesso, execute `SHOW PLUGINS;` e verifique a saída. Deveria mostrar algo como isso:

```
mysql> SHOW PLUGINS;
+----------------------------+----------+--------------------+----------------------+-------------+
| Name                       | Status   | Type               | Library              | License     |
+----------------------------+----------+--------------------+----------------------+-------------+
| binlog                     | ACTIVE   | STORAGE ENGINE     | NULL                 | PROPRIETARY |

(...)

| group_replication          | ACTIVE   | GROUP REPLICATION  | group_replication.so | PROPRIETARY |
+----------------------------+----------+--------------------+----------------------+-------------+
```

#### 20.2.1.5 Autofinanciamento do Grupo

O processo de criação de um grupo pela primeira vez é chamado de bootstrapping. Você usa a variável de sistema `group_replication_bootstrap_group` para bootstrapar um grupo. O bootstrapping deve ser feito apenas por um único servidor, o mesmo que inicia o grupo e apenas uma vez. É por isso que o valor da opção `group_replication_bootstrap_group` não foi armazenado no arquivo de opção da instância. Se for salvo no arquivo de opção, ao reiniciar o servidor, ele automaticamente bootstrapa um segundo grupo com o mesmo nome. Isso resultaria em dois grupos distintos com o mesmo nome. O mesmo raciocínio se aplica ao parar e reiniciar o plugin com esta opção definida em `ON`. Portanto, para bootstrapar o grupo com segurança, conecte-se ao s1 e emita as seguintes declarações:

```
mysql> SET GLOBAL group_replication_bootstrap_group=ON;
mysql> START GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
```

Ou, se você estiver fornecendo credenciais de usuário para recuperação distribuída na declaração `START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") (MySQL 8.0.21 e posterior), emita as seguintes declarações:

```
mysql> SET GLOBAL group_replication_bootstrap_group=ON;
mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
```

Assim que a declaração `START GROUP_REPLICATION` retornar, o grupo foi iniciado. Você pode verificar que o grupo agora foi criado e que há um membro nele:

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+---------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE  | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+---------------+-------------+----------------+----------------------------+
| group_replication_applier | ce9be252-2b71-11e6-b8f4-00212844f856 |   s1        |       3306  | ONLINE        |             |                | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+---------------+-------------+----------------+----------------------------+
1 row in set (0.0108 sec)
```

As informações desta tabela confirmam que há um membro no grupo com o identificador único `ce9be252-2b71-11e6-b8f4-00212844f856`, que é `ONLINE` e está em `s1` aguardando conexões de clientes na porta `3306`.

Para demonstrar que o servidor está de fato em um grupo e que é capaz de lidar com a carga, crie uma tabela e adicione algum conteúdo nela.

```
mysql> CREATE DATABASE test;
mysql> USE test;
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 TEXT NOT NULL);
mysql> INSERT INTO t1 VALUES (1, 'Luis');
```

Verifique o conteúdo da tabela `t1` e o log binário.

```
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
| binlog.000001 |   4 | Format_desc    |         1 |         123 | Server ver: 8.0.44-log, Binlog ver: 4                              |
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

Como visto acima, o banco de dados e os objetos da tabela foram criados e suas respectivas declarações DDL foram escritas no log binário. Além disso, os dados foram inseridos na tabela e escritos no log binário, para que possam ser usados para recuperação distribuída por transferência de estado de um log binário do doador.

#### 20.2.1.6 Adicionando Instâncias ao Grupo

Neste ponto, o grupo tem um membro, o servidor s1, que possui alguns dados. Agora é hora de expandir o grupo, adicionando os outros dois servidores configurados anteriormente.

##### 20.2.1.6.1 Adicionando uma segunda instância

Para adicionar uma segunda instância, o servidor s2, primeiro crie o arquivo de configuração para ele. A configuração é semelhante àquela usada para o servidor s1, exceto por coisas como o `server_id`.

```
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
binlog_checksum=NONE           # Not needed in 8.0.21 or later

#
# Group Replication configuration
#
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address= "s2:33061"
group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
group_replication_bootstrap_group= off
```

Semelhante ao procedimento para o servidor s1, com a opção de arquivo em uso, você inicia o servidor. Em seguida, configure as credenciais de recuperação distribuída da seguinte forma. As instruções são as mesmas que as usadas ao configurar o servidor s1, pois o usuário é compartilhado dentro do grupo. Este membro precisa ter o mesmo usuário de replicação configurado na Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”. Se você está confiando na recuperação distribuída para configurar o usuário em todos os membros, quando o s2 se conecta ao s1 de origem, o usuário de replicação é replicado ou clonado para o s1. Se você não tinha o registro binário habilitado quando configurou as credenciais do usuário no s1 e uma operação de clonagem remota não foi usada para transferência de estado, você deve criar o usuário de replicação no s2. Neste caso, conecte-se ao s2 e emita:

```
SET SQL_LOG_BIN=0;
CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
```

Se você estiver fornecendo credenciais de usuário usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita a seguinte declaração após essa:

```
CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Em MySQL 8.0.23 e versões posteriores, use o seguinte em vez disso:

```
CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
	FOR CHANNEL 'group_replication_recovery';
```

Dica

Se você estiver usando o plugin de autenticação com cache SHA-2, o padrão no MySQL 8, veja a Seção 20.6.3.1.1, “Usuário de Replicação com o Plugin de Autenticação com Cache SHA-2”.

Se necessário, instale o plugin de Replicação de Grupo, consulte a Seção 20.2.1.4, “Lançamento da Replicação de Grupo”.

Inicie a replicação em grupo e o s2 inicia o processo de adesão ao grupo.

```
mysql> START GROUP_REPLICATION;
```

Se você estiver fornecendo credenciais de usuário para recuperação distribuída como parte de `START GROUP_REPLICATION` (start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") (MySQL 8.0.21 ou posterior), você pode fazer isso da seguinte forma:

```
mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
```

Ao contrário das etapas anteriores, que eram as mesmas que as executadas no s1, aqui há uma diferença: você *não* precisa inicializar o grupo porque o grupo já existe. Em outras palavras, no s2 `group_replication_bootstrap_group` está definido como `OFF`, e você não emite `SET GLOBAL group_replication_bootstrap_group=ON;` antes de iniciar a Replicação do Grupo, porque o grupo já foi criado e inicializado pelo servidor s1. Neste ponto, o servidor s2 só precisa ser adicionado ao grupo já existente.

Dica

Quando a Replicação em Grupo começa com sucesso e o servidor se junta ao grupo, ele verifica a variável `super_read_only`. Ao definir `super_read_only` para ON no arquivo de configuração do membro, você pode garantir que os servidores que falham ao iniciar a Replicação em Grupo por qualquer motivo não aceitem transações. Se o servidor deve se juntar ao grupo como uma instância de leitura/escrita, por exemplo, como o principal em um grupo de principal único ou como um membro de um grupo de múltiplos principais, quando `super_read_only` é definido para `ON`, ele é definido para `OFF` ao se juntar ao grupo.

Verificando novamente a tabela `performance_schema.replication_group_members`, nota-se que agora há dois servidores `ONLINE` no grupo.

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 8.0.44          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```

Quando o s2 tentou se juntar ao grupo, a Seção 20.5.4, “Recuperação Distribuída”, garantiu que o s2 aplicasse as mesmas transações que o s1 havia aplicado. Uma vez que esse processo foi concluído, o s2 pôde se juntar ao grupo como membro, e, neste ponto, é marcado como `ONLINE`. Em outras palavras, ele deve ter se atualizado automaticamente com o servidor s1. Uma vez que o s2 esteja `ONLINE`, então ele começa a processar transações com o grupo. Verifique se o s2 realmente se sincronizou com o servidor s1 da seguinte forma.

```
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
| binlog.000001 |    4 | Format_desc    |         2 |         123 | Server ver: 8.0.44-log, Binlog ver: 4                              |
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

Como visto acima, o segundo servidor foi adicionado ao grupo e replicou as alterações do servidor s1 automaticamente. Em outras palavras, as transações aplicadas em s1 até o momento em que s2 se juntou ao grupo foram replicadas para s2.

##### 20.2.1.6.2 Adicionando instâncias adicionais

Adicionar instâncias adicionais ao grupo é essencialmente a mesma sequência de etapas que adicionar o segundo servidor, exceto que a configuração precisa ser alterada, como teve que ser para o servidor s2. Para resumir as operações necessárias:

1. Crie o arquivo de configuração.

   ```
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
   binlog_checksum=NONE           # Not needed from 8.0.21

   #
   # Group Replication configuration
   #
   plugin_load_add='group_replication.so'
   group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
   group_replication_start_on_boot=off
   group_replication_local_address= "s3:33061"
   group_replication_group_seeds= "s1:33061,s2:33061,s3:33061"
   group_replication_bootstrap_group= off
   ```

2. Inicie o servidor e conecte-se a ele. Crie o usuário de replicação para recuperação distribuída.

   ```
   SET SQL_LOG_BIN=0;
   CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
   GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
   GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
   GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   FLUSH PRIVILEGES;
   SET SQL_LOG_BIN=1;
   ```

Se você estiver fornecendo credenciais de usuário usando uma declaração `CHANGE REPLICATION SOURCE TO` | (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` | (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") |, emita a seguinte declaração após essa:

   ```
   CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
   	FOR CHANNEL 'group_replication_recovery';
   ```

Em MySQL 8.0.23 ou posterior, use esta declaração em vez disso:

   ```
   CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
   	FOR CHANNEL 'group_replication_recovery';
   ```

3. Instale o plugin de Replicação de Grupo, se necessário, da seguinte forma:

   ```
   mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
   ```

4. Iniciar a Replicação em Grupo:

   ```
   mysql> START GROUP_REPLICATION;
   ```

Se você estiver fornecendo credenciais de usuário para recuperação distribuída na declaração `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") (MySQL 8.0.21 ou posterior), você pode fazer isso da seguinte forma:

   ```
   mysql> START GROUP_REPLICATION USER='rpl_user', PASSWORD='password';
   ```

Neste ponto, o servidor s3 está inicializado e em funcionamento, se juntou ao grupo e alcançou os outros servidores do grupo. Consultar a tabela `performance_schema.replication_group_members` novamente confirma que este é o caso.

```
mysql> SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | 395409e1-6dfa-11e6-970b-00212844f856 |   s1        |        3306 | ONLINE       | PRIMARY     | 8.0.44          | XCom                       |
| group_replication_applier | 7eb217ff-6df3-11e6-966c-00212844f856 |   s3        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
| group_replication_applier | ac39f1e6-6dfa-11e6-a69d-00212844f856 |   s2        |        3306 | ONLINE       | SECONDARY   | 8.0.44          | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
```

Fazendo essa mesma consulta no servidor s2 ou no servidor s1, obtém-se o mesmo resultado. Além disso, você pode verificar que o servidor s3 já alcançou o mesmo nível:

```
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
| binlog.000001 |    4 | Format_desc    |         3 |         123 | Server ver: 8.0.44-log, Binlog ver: 4                              |
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

### 20.2.2 Implementando Replicação de Grupo Localmente

A maneira mais comum de implementar a Replicação em Grupo é usando várias instâncias de servidor, para fornecer alta disponibilidade. Também é possível implementar a Replicação em Grupo localmente, por exemplo, para fins de teste. Esta seção explica como você pode implementar a Replicação em Grupo localmente.

Importante

A Replicação em Grupo é geralmente implantada em vários hosts, pois isso garante a alta disponibilidade. As instruções desta seção não são adequadas para implantações de produção, pois todas as instâncias do servidor MySQL estão em execução no mesmo único host. No caso de falha deste host, todo o grupo falha. Portanto, essas informações devem ser usadas para fins de teste e não devem ser usadas em ambientes de produção.

Esta seção explica como criar um grupo de replicação com três instâncias do MySQL Server em uma máquina física. Isso significa que são necessários três diretórios de dados, um por instância do servidor, e que você precisa configurar cada instância de forma independente. Este procedimento assume que o MySQL Server foi baixado e desempacotado - no diretório denominado `mysql-8.0`. Cada instância do servidor MySQL requer um diretório de dados específico. Crie um diretório denominado `data`, em seguida, nesse diretório, crie um subdiretório para cada instância do servidor, por exemplo, s1, s2 e s3, e inicie cada um.

```
mysql-8.0/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-8.0 --datadir=$PWD/data/s1
mysql-8.0/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-8.0 --datadir=$PWD/data/s2
mysql-8.0/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-8.0 --datadir=$PWD/data/s3
```

Dentro de `data/s1`, `data/s2`, `data/s3` é um diretório de dados inicializado, contendo o banco de dados do sistema mysql e tabelas relacionadas e muito mais. Para saber mais sobre o procedimento de inicialização, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Não use `-initialize-insecure` em ambientes de produção, ele é usado apenas aqui para simplificar o tutorial. Para mais informações sobre configurações de segurança, consulte a Seção 20.6, “Segurança da Replicação em Grupo”.

#### Configuração de membros da replicação de grupo local

Ao seguir a Seção 20.2.1.2, “Configurando uma Instância para Replicação em Grupo”, você precisa adicionar a configuração para os diretórios de dados adicionados na seção anterior. Por exemplo:

```
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

```
group_replication_local_address= "127.0.0.1:24901"
group_replication_group_seeds= "127.0.0.1:24901,127.0.0.1:24902,127.0.0.1:24903"
```

Isso configura o s1 para usar a porta 24901 para comunicação interna de grupo com membros da semente. Para cada instância do servidor que você deseja adicionar ao grupo, faça essas alterações no arquivo de opções do membro. Para cada membro, você deve garantir que um endereço único seja especificado, então use uma porta única por instância para `group_replication_local_address`. Geralmente, você deseja que todos os membros possam servir como sementes para membros que estão se juntando ao grupo e não receberam as transações processadas pelo grupo. Neste caso, adicione todas as portas ao `group_replication_group_seeds` como mostrado acima.

Os passos restantes da Seção 20.2.1, “Implementando a Replicação de Grupo no Modo de Primariúnico”, se aplicam igualmente a um grupo que você tenha implementado localmente dessa forma.