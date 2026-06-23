## 19.1 Configurando a Replicação

Esta seção descreve como configurar os diferentes tipos de replicação disponíveis no MySQL e inclui a configuração e o estabelecimento necessários para um ambiente de replicação, incluindo instruções passo a passo para criar um novo ambiente de replicação. Os principais componentes desta seção são:

* Para um guia sobre como configurar dois ou mais servidores para replicação usando posições de arquivos de registro binário, a Seção 19.1.2, “Configuração da replicação com base em posições de arquivo de registro binário”, trata da configuração dos servidores e fornece métodos para copiar dados entre a fonte e as réplicas.

* Para um guia sobre como configurar dois ou mais servidores para replicação usando transações GTID, a Seção 19.1.3, “Replicação com Identificadores de Transação Global”, trata da configuração dos servidores.

* Os eventos no log binário são registrados usando vários formatos. Esses são referidos como replicação baseada em declarações (SBR) ou replicação baseada em linhas (RBR). Um terceiro tipo, replicação de formatos mistos (MIXED), usa a replicação SBR ou RBR automaticamente para aproveitar os benefícios dos formatos SBR e RBR quando apropriado. Os diferentes formatos são discutidos na Seção 19.2.1, "Formatos de replicação".

* Informações detalhadas sobre as diferentes opções de configuração e variáveis que se aplicam à replicação estão fornecidas na Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

* Uma vez iniciado, o processo de replicação deve exigir pouca administração ou monitoramento. No entanto, para obter conselhos sobre tarefas comuns que você pode querer executar, consulte a Seção 19.1.7, “Tarefas comuns de administração de replicação”.

### 19.1.1 Configuração de Replicação com Base na Posição do Arquivo de Registro Binário
### 19.1.2 Configuração de Replicação com Base na Posição do Arquivo de Registro Binário

Esta seção descreve a replicação entre servidores MySQL com base no método de posição do arquivo de registro binário, onde a instância MySQL que opera como a fonte (onde as alterações de banco de dados ocorrem) escreve atualizações e alterações como "eventos" no registro binário. As informações no registro binário são armazenadas em diferentes formatos de registro de acordo com as alterações de banco de dados que estão sendo registradas. As réplicas são configuradas para ler o registro binário da fonte e para executar os eventos no registro binário no banco de dados local da réplica.

Cada réplica recebe uma cópia de todo o conteúdo do log binário. É responsabilidade da réplica decidir quais declarações no log binário devem ser executadas. A menos que você especifique o contrário, todos os eventos no log binário da fonte são executados na réplica. Se necessário, você pode configurar a réplica para processar apenas eventos que se aplicam a bancos de dados ou tabelas específicas.

Importante

Você não pode configurar a fonte para registrar apenas certos eventos.

Cada réplica mantém um registro das coordenadas do log binário: o nome do arquivo e a posição dentro do arquivo que ela leu e processou a partir da fonte. Isso significa que várias réplicas podem ser conectadas à fonte e executar diferentes partes do mesmo log binário. Como as réplicas controlam esse processo, as réplicas individuais podem ser conectadas e desconectadas do servidor sem afetar a operação da fonte. Além disso, como cada réplica registra a posição atual dentro do log binário, é possível que as réplicas sejam desconectadas, reconectadas e, em seguida, retomem o processamento.

A fonte e cada réplica devem ser configuradas com um ID único (usando a variável de sistema `server_id`). Além disso, cada réplica deve ser configurada com informações sobre o nome do host da fonte, o nome do arquivo de registro e a posição dentro desse arquivo. Esses detalhes podem ser controlados dentro de uma sessão MySQL usando uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) na réplica. Os detalhes são armazenados no repositório de metadados de conexão da réplica (consulte Seção 19.2.4, “Repositórios de Registro e Metadados de Replicação de Relógio”).

### 19.1.2 Configuração da Replicação com Posição de Arquivo de Registro Binário

Esta seção descreve como configurar um servidor MySQL para usar a replicação com posição do arquivo de registro binário. Há vários métodos diferentes para configurar a replicação, e o método exato a ser usado depende de como você está configurando a replicação e se você já tem dados no banco de dados na fonte que você deseja replicar.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

Existem algumas tarefas genéricas que são comuns a todos os cenários:

* Sobre a fonte, você deve garantir que o registro binário esteja habilitado e configurar uma ID de servidor única. Isso pode exigir um reinício do servidor. Veja a Seção 19.1.2.1, “Definindo a configuração da fonte de replicação”.

* Em cada réplica que você deseja conectar à fonte, você deve configurar um ID de servidor único. Isso pode exigir um reinício do servidor. Veja a Seção 19.1.2.2, “Definindo a Configuração da Réplica”.

* Opcionalmente, crie um usuário separado para que suas réplicas sejam usadas durante a autenticação com a fonte ao ler o log binário para replicação. Veja a Seção 19.1.2.3, “Criando um Usuário para Replicação”.

* Antes de criar um instantâneo de dados ou iniciar o processo de replicação, no ponto de origem, você deve registrar a posição atual no log binário. Você precisa dessa informação ao configurar a replica, para que a replica saiba onde, dentro do log binário, deve começar a executar os eventos. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

* Se você já tem dados na fonte e deseja usá-los para sincronizar a replica, você precisa criar um instantâneo de dados para copiar os dados para a replica. O mecanismo de armazenamento que você está usando tem impacto sobre como você cria o instantâneo. Quando você está usando `MyISAM`, você deve parar de processar declarações na fonte para obter um bloqueio de leitura, em seguida, obter suas coordenadas atuais de log binário e descarregar seus dados, antes de permitir que a fonte continue executando declarações. Se você não parar a execução das declarações, o descarte de dados e as informações de status da fonte tornam-se desalinhados, resultando em bancos de dados inconsistentes ou corrompidos nas réplicas. Para mais informações sobre a replicação de uma fonte `MyISAM`, consulte a Seção 19.1.2.4, “Obtenção das coordenadas de log binário da fonte de replicação”. Se você está usando `InnoDB`, você não precisa de um bloqueio de leitura e uma transação que seja longa o suficiente para transferir o instantâneo de dados é suficiente. Para mais informações, consulte a Seção 17.19, “InnoDB e Replicação MySQL”.

* Configure a replica com as configurações para conectar-se à fonte, como o nome do host, as credenciais de login e o nome e a posição do arquivo de log binário. Veja a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

* Implemente medidas de segurança específicas para replicação nas fontes e réplicas, conforme apropriado para o seu sistema. Veja a Seção 19.3, “Segurança da Replicação”.

Nota

Certos passos no processo de configuração exigem o privilégio `SUPER`. Se você não tiver esse privilégio, talvez não seja possível habilitar a replicação.

Após configurar as opções básicas, selecione seu cenário:

* Para configurar a replicação para uma instalação nova de uma fonte e réplicas que não contenham dados, consulte a Seção 19.1.2.6.1, “Configurando a Replicação com Nova Fonte e Réplicas”.

* Para configurar a replicação de uma nova fonte usando os dados de um servidor MySQL existente, consulte a Seção 19.1.2.6.2, “Configurando a Replicação com Dados Existentes”.

* Para adicionar réplicas a um ambiente de replicação existente, consulte a Seção 19.1.2.8, “Adicionar réplicas a um ambiente de replicação”.

Antes de administrar servidores de replicação do MySQL, leia todo o capítulo e tente todas as declarações mencionadas na Seção 15.4.1, “Declarações SQL para controle de servidores de origem”, e na Seção 15.4.2, “Declarações SQL para controle de servidores de réplica”. Além disso, familiarize-se com as opções de inicialização de replicação descritas na Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

#### 19.1.2.1 Configuração da fonte de replicação

Para configurar uma fonte para usar a replicação com posição do arquivo de registro binário, você deve garantir que o registro binário esteja habilitado e estabelecer um ID de servidor único.

Cada servidor dentro de uma topologia de replicação deve ser configurado com um ID de servidor único, que você pode especificar usando a variável de sistema `server_id`. Esse ID de servidor é usado para identificar servidores individuais dentro da topologia de replicação e deve ser um número inteiro positivo entre 1 e (232)−1. O valor padrão `server_id` do MySQL 8.0 é 1. Você pode alterar o valor `server_id` dinamicamente, emitindo uma declaração como esta:

```
SET GLOBAL server_id = 2;
```

Como você organiza e seleciona os IDs do servidor é sua escolha, desde que cada ID de servidor seja diferente de todas as outras IDs de servidor em uso por qualquer outro servidor na topologia de replicação. Note que, se um valor de 0 (que era o padrão em versões anteriores) foi definido anteriormente para o ID do servidor, você deve reiniciar o servidor para inicializar a fonte com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você muda o ID do servidor, a menos que você faça outras alterações de configuração que o exijam.

O registro binário é necessário na fonte porque o registro binário é a base para replicar as alterações da fonte para suas réplicas. O registro binário é ativado por padrão (a variável de sistema `log_bin` é definida como ON). A opção `--log-bin` informa ao servidor qual nome de base usar para os arquivos de registro binário. É recomendável especificar esta opção para dar aos arquivos de registro binário um nome de base não padrão, para que, se o nome do host mudar, você possa facilmente continuar a usar os mesmos nomes de arquivo de registro binário (consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”). Se o registro binário foi anteriormente desativado na fonte usando a opção `--skip-log-bin`, você deve reiniciar o servidor sem esta opção para ativá-lo.

Nota

As seguintes opções também têm impacto na fonte:

* Para a maior durabilidade e consistência possível em um conjunto de replicação usando `InnoDB` com transações, você deve usar `innodb_flush_log_at_trx_commit=1` e `sync_binlog=1` no arquivo `my.cnf` da fonte.

* Certifique-se de que a variável de sistema `skip_networking` não esteja habilitada na fonte. Se a rede foi desativada, a replica não pode se comunicar com a fonte e a replicação falha.

#### 19.1.2.2 Configuração da réplica

Cada réplica deve ter um ID de servidor único, conforme especificado pela variável de sistema `server_id`. Se você está configurando várias réplicas, cada uma deve ter um valor único `server_id` que difere do da fonte e de qualquer outra réplica. Se o ID de servidor da réplica não estiver definido, ou o valor atual entrar em conflito com o valor que você escolheu para a fonte ou outra réplica, você deve alterá-lo.

O valor padrão `server_id` é

1. Você pode alterar o valor `server_id` dinamicamente, emitindo uma declaração como esta:

```
SET GLOBAL server_id = 21;
```

Observe que um valor de 0 para o ID do servidor impede que uma réplica se conecte a uma fonte. Se esse valor do ID do servidor (que era o padrão em versões anteriores) foi definido anteriormente, você deve reiniciar o servidor para inicializar a réplica com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID do servidor, a menos que você faça outras alterações de configuração que o exijam. Por exemplo, se o registro binário foi desativado no servidor e você deseja ativá-lo para sua réplica, um reinício do servidor é necessário para ativar isso.

Se você estiver desligando o servidor de replicação, pode editar a seção `[mysqld]` do arquivo de configuração para especificar um ID de servidor único. Por exemplo:

```
[mysqld]
server-id=21
```

O registro binário é ativado por padrão em todos os servidores. Uma replica não precisa ter registro binário ativado para que a replicação ocorra. No entanto, o registro binário em uma replica significa que o registro binário da replica pode ser usado para backups de dados e recuperação em caso de falha. Replicas que têm registro binário ativado também podem ser usadas como parte de uma topologia de replicação mais complexa. Por exemplo, você pode querer configurar servidores de replicação usando essa disposição em cadeia:

```
A -> B -> C
```

Aqui, `A` serve como fonte para a réplica `B`, e `B` serve como fonte para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma réplica. As atualizações recebidas de `A` devem ser registradas por `B` em seu log binário, a fim de serem passadas para `C`. Além do registro binário, essa topologia de replicação requer que a variável de sistema `log_replica_updates` (do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) seja habilitada. Com as atualizações de replica habilitadas, a réplica escreve atualizações que são recebidas de uma fonte e realizadas pelo thread SQL da réplica em seu próprio log binário. A variável de sistema `log_replica_updates` ou `log_slave_updates` é habilitada por padrão.

Se você precisar desativar o registro binário ou o registro de atualização de replica, pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` ou `--log-slave-updates=OFF` para a replica. Se você decidir reativar esses recursos na replica, remova as opções relevantes e reinicie o servidor.

#### 19.1.2.3 Criando um Usuário para Replicação

Cada réplica se conecta à fonte usando um nome de usuário e senha do MySQL, portanto, deve haver uma conta de usuário na fonte que a réplica possa usar para se conectar. O nome de usuário é especificado pela opção `SOURCE_USER` | `MASTER_USER` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) ao configurar uma réplica. Qualquer conta pode ser usada para essa operação, desde que tenha sido concedido o privilégio `REPLICATION SLAVE`. Você pode optar por criar uma conta diferente para cada réplica ou se conectar à fonte usando a mesma conta para cada réplica.

Embora você não precise criar uma conta especificamente para replicação, você deve estar ciente de que o nome de usuário e a senha de replicação são armazenados em texto plano no repositório de metadados de conexão da replica `mysql.slave_master_info` (consulte Seção 19.2.4.2, “Repositórios de Metadados de Replicação”). Portanto, você pode querer criar uma conta separada que tenha privilégios apenas para o processo de replicação, para minimizar a possibilidade de comprometimento de outras contas.

Para criar uma nova conta, use `CREATE USER` (create-user.html "15.7.1.3 CREATE USER Statement"). Para conceder a conta os privilégios necessários para a replicação, use a declaração `GRANT`. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `repl`, que possa se conectar para replicação de qualquer host dentro do domínio `example.com`, emita essas declarações na fonte:

```
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Consulte a Seção 15.7.1, “Declarações de Gestão de Conta”, para obter mais informações sobre declarações de manipulação de contas de usuário.

Importante

Para se conectar à fonte usando uma conta de usuário que se autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (para detalhes, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Substituível SHA-2”). Se a conta de usuário que você cria ou usa para replicação (conforme especificado pela opção `MASTER_USER`) usar este plugin de autenticação, e você não estiver usando uma conexão segura, você deve habilitar a troca de senha baseada em par de chaves RSA para uma conexão bem-sucedida.

#### 19.1.2.4 Obter as coordenadas do log binário de replicação da fonte

Para configurar a replica para iniciar o processo de replicação no ponto correto, é necessário anotar as coordenadas atuais da fonte dentro de seu log binário.

Aviso

Este procedimento utiliza `FLUSH TABLES WITH READ LOCK`(flush.html#flush-tables-with-read-lock), que bloqueia as operações de `COMMIT` para tabelas de `InnoDB`.

Se você está planejando desligar a fonte para criar um instantâneo de dados, pode optar por ignorar esse procedimento e, em vez disso, armazenar uma cópia do arquivo de índice do log binário junto com o instantâneo de dados. Nessa situação, a fonte cria um novo arquivo de log binário na reinicialização. As coordenadas do log binário da fonte onde a replica deve iniciar o processo de replicação são, portanto, o início desse novo arquivo, que é o próximo arquivo de log binário na fonte após os arquivos listados no arquivo de índice de log binário copiado.

Para obter as coordenadas binárias do log de origem, siga estes passos:

1. Inicie uma sessão na fonte conectando-se a ela com o cliente de linha de comando e limpe todas as tabelas e declarações de escrita de bloco executando a declaração `FLUSH TABLES WITH READ LOCK`(flush.html#flush-tables-with-read-lock):

   ```
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

Aviso

Deixe o cliente do qual você emitiu a declaração `FLUSH TABLES` em execução para que o bloqueio de leitura permaneça em vigor. Se você sair do cliente, o bloqueio é liberado.

2. Em uma sessão diferente na fonte, use a declaração `SHOW MASTER STATUS` para determinar o nome atual do arquivo de registro binário e sua posição:

   ```
   mysql> SHOW MASTER STATUS\G
   *************************** 1. row ***************************
                File: mysql-bin.000003
            Position: 73
        Binlog_Do_DB: test
    Binlog_Ignore_DB: manual, mysql
   Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
   1 row in set (0.00 sec)
   ```

A coluna `File` mostra o nome do arquivo de registro e a coluna `Position` mostra a posição dentro do arquivo. Neste exemplo, o arquivo de registro binário é `mysql-bin.000003` e a posição é 73. Anote esses valores. Você precisa deles mais tarde, quando estiver configurando a replica. Eles representam as coordenadas de replicação nas quais a replica deve começar a processar novas atualizações da fonte.

Se a fonte tiver sido executada anteriormente com o registro binário desativado, os nomes dos arquivos de registro e os valores de posição exibidos por `SHOW MASTER STATUS`(show-master-status.html "15.7.7.23 SHOW MASTER STATUS Statement") ou [**mysqldump --master-data**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") são vazios. Nesse caso, os valores que você precisa usar mais tarde ao especificar o arquivo de registro binário da fonte são a string vazia (`''`) e `4`.

Agora você tem as informações necessárias para habilitar a replica a começar a ler o log binário da fonte no local correto para iniciar a replicação.

O próximo passo depende de você ter dados existentes na fonte. Escolha uma das seguintes opções:

* Se você tiver dados existentes que precisam ser sincronizados com a réplica antes de iniciar a replicação, deixe o cliente em execução para que o bloqueio permaneça no lugar. Isso impede que quaisquer alterações adicionais sejam feitas, para que os dados copiados para a réplica estejam em sincronia com a fonte. Prossiga para a Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”.

* Se você está configurando uma nova combinação de fonte e replica, pode sair da primeira sessão para liberar o bloqueio de leitura. Veja a Seção 19.1.2.6.1, "Configurando a Replicação com Nova Fonte e Replicas", para saber como proceder.

#### 19.1.2.5 Escolhendo um Método para Instantâneos de Dados

Se o banco de dados de origem contiver dados existentes, é necessário copiar esses dados para cada réplica. Existem diferentes maneiras de descartar os dados do banco de dados de origem. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de descarte do banco de dados, escolha entre essas opções:

* Use a ferramenta **mysqldump** para criar um dump de todos os bancos de dados que você deseja replicar. Esse é o método recomendado, especialmente quando você está usando `InnoDB`.

* Se o seu banco de dados for armazenado em arquivos portáteis binários, você pode copiar os arquivos de dados brutos para uma replica. Isso pode ser mais eficiente do que usar o **mysqldump** e importar o arquivo em cada replica, porque ele evita o overhead de atualização de índices à medida que as instruções `INSERT` são reinterpretadas. Com motores de armazenamento como o `InnoDB`, isso não é recomendado.

* Use o plugin de clonagem do MySQL Server para transferir todos os dados de uma replica existente para um clone. Para instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

##### 19.1.2.5.1 Criando um instantâneo de dados usando mysqldump

Para criar um instantâneo dos dados em um banco de dados de origem existente, use a ferramenta **mysqldump**. Uma vez que o dump de dados tenha sido concluído, importe esses dados na replica antes de iniciar o processo de replicação.

O exemplo a seguir descarrega todas as bases de dados em um arquivo chamado `dbdump.db`, e inclui a opção `--master-data` que anexa automaticamente a declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") necessária na replica para iniciar o processo de replicação:

```
$> mysqldump --all-databases --master-data > dbdump.db
```

Nota

Se você não usar `--master-data`, então é necessário bloquear todas as tabelas em uma sessão separada manualmente. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

É possível excluir certos bancos de dados do dump usando a ferramenta **mysqldump**. Se você deseja escolher quais bancos de dados devem ser incluídos no dump, não use `--all-databases`. Escolha uma dessas opções:

* Exclua todas as tabelas no banco de dados usando a opção `--ignore-table`.

* Nomeie apenas os bancos de dados que você deseja descartar usando a opção `--databases`.

Nota

Por padrão, se GTIDs estiverem em uso na fonte (`gtid_mode=ON`), o **mysqldump** inclui os GTIDs do conjunto `gtid_executed` da fonte no resultado do dump para adicioná-los ao conjunto `gtid_purged` da réplica. Se você está fazendo o dump apenas de bancos de dados ou tabelas específicas, é importante notar que o valor que é incluído pelo **mysqldump** inclui os GTIDs de todas as transações no conjunto `gtid_executed` da fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos no dump parcial. Verifique a descrição da opção `--set-gtid-purged` do **mysqldump** para obter o resultado do comportamento padrão para as versões do MySQL Server que você está usando, e como alterar o comportamento se esse resultado não for adequado para sua situação.

Para mais informações, consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”.

Para importar os dados, copie o arquivo de dump para a réplica ou acesse o arquivo na fonte ao se conectar remotamente à réplica.

##### 19.1.2.5.2 Criando um instantâneo de dados usando arquivos de dados brutos

Esta seção descreve como criar um instantâneo de dados usando os arquivos brutos que compõem o banco de dados. Empregar esse método com uma tabela que utiliza um mecanismo de armazenamento que tem algoritmos de cache ou registro complexos requer etapas adicionais para produzir um instantâneo perfeito “no momento atual”: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de registro, mesmo que você tenha adquirido um bloqueio de leitura global. Como o mecanismo de armazenamento responde a isso depende de suas habilidades de recuperação em caso de falha.

Se você usar as tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que é incluído como parte de uma assinatura do MySQL Enterprise. Consulte a Seção 32.1, “Visão geral do MySQL Enterprise Backup”, para obter informações detalhadas.

Esse método também não funciona de forma confiável se a fonte e a replica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas com índices de texto completo.

Supondo que as exceções acima não se apliquem ao seu banco de dados, use a técnica de backup frio para obter um instantâneo binário confiável das tabelas do `InnoDB`: faça um desligamento lento do servidor MySQL e, em seguida, copie os arquivos de dados manualmente.

Para criar um instantâneo de dados brutos das tabelas de `MyISAM` quando seus arquivos de dados MySQL existem em um único sistema de arquivos, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota, como **scp** ou **rsync**, uma ferramenta de arquivamento, como **zip** ou **tar**, ou uma ferramenta de instantâneo de sistema de arquivos, como **dump**. Se você está replicando apenas certos bancos de dados, copie apenas aqueles arquivos que se relacionam com essas tabelas. Para `InnoDB`, todas as tabelas em todos os bancos de dados são armazenadas nos arquivos de [espaço de tabelas do sistema][(glossary.html#glos_system_tablespace "system tablespace")], a menos que você tenha a opção `innodb_file_per_table` habilitada.

Os seguintes arquivos não são necessários para a replicação:

* Arquivos relacionados ao banco de dados `mysql`. * O arquivo de repositório de metadados de conexão da replica `master.info`, se utilizado; o uso deste arquivo é agora desaconselhado (consulte a Seção 19.2.4, "Repositórios de Log de Relógio e Metadados de Replicação").

* Os arquivos de registro binário da fonte, com exceção do arquivo de índice de registro binário, se você vai usá-lo para localizar as coordenadas do registro binário da fonte para a replica.

* Arquivos de registro de relevo.

Dependendo se você está usando as tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando as tabelas `InnoDB`, e também quiser obter os resultados mais consistentes com um instantâneo de dados brutos, desligue o servidor de origem durante o processo, conforme descrito a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do registro binário da fonte de replicação”.

2. Em uma sessão separada, desligue o servidor de origem:

   ```
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor de origem.

Se você não estiver usando as tabelas `InnoDB`, pode obter um instantâneo do sistema a partir de uma fonte sem desligar o servidor, conforme descrito nos passos a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do registro binário da fonte de replicação”.

2. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o bloqueio de leitura, libere o bloqueio:

   ```
   mysql> UNLOCK TABLES;
   ```

Depois de criar o arquivo ou cópia do banco de dados, copie os arquivos para cada réplica antes de iniciar o processo de replicação.

#### 19.1.2.6 Configuração de Replicas

As seções a seguir descrevem como configurar réplicas. Antes de prosseguir, certifique-se de que você tem:

* Configurou a fonte com as propriedades de configuração necessárias. Veja a Seção 19.1.2.1, “Definindo a configuração da fonte de replicação”.

* Obtenha as informações de status da fonte ou uma cópia do arquivo de índice de registro binário da fonte, feito durante uma interrupção para o instantâneo de dados. Veja a Seção 19.1.2.4, “Obtenção das coordenadas de registro binário da fonte de replicação”.

* Sobre a fonte, liberou o bloqueio de leitura:

  ```
  mysql> UNLOCK TABLES;
  ```

* Na réplica, edite a configuração do MySQL. Veja a Seção 19.1.2.2, “Definindo a configuração da réplica”.

Os próximos passos dependem de você ter dados existentes para importar na replica ou não. Consulte a Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”, para mais informações. Escolha um dos seguintes:

* Se você não tiver um instantâneo de um banco de dados a ser importado, consulte a Seção 19.1.2.6.1, “Configurando a Replicação com Nova Fonte e Replicas”.

* Se você tiver um instantâneo de um banco de dados a ser importado, consulte a Seção 19.1.2.6.2, “Configurando a Replicação com Dados Existentes”.

##### 19.1.2.6.1 Configurando a replicação com nova fonte e réplicas

Quando não houver uma instantânea de um banco de dados anterior a ser importado, configure a replicação para começar a replicar a partir da nova fonte.

Para configurar a replicação entre uma fonte e uma nova réplica:

1. Inicie a replica. 2. Execute uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") na replica para definir a configuração da fonte. Veja a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

Realize essas etapas de configuração de replicação em cada replica.

Esse método também pode ser usado se você estiver configurando novos servidores, mas tiver um dump existente dos bancos de dados de um servidor diferente que você deseja carregar na sua configuração de replicação. Ao carregar os dados em uma nova fonte, os dados são automaticamente replicados para as réplicas.

Se você está configurando um novo ambiente de replicação usando os dados de um servidor de banco de dados existente diferente para criar uma nova fonte, execute o arquivo de dump gerado nesse servidor na nova fonte. As atualizações do banco de dados são automaticamente propagadas aos replicados:

```
$> mysql -h source < fulldb.dump
```

##### 19.1.2.6.2 Configurando a replicação com dados existentes

Ao configurar a replicação com dados existentes, transfira o instantâneo da fonte para a replica antes de iniciar a replicação. O processo de importação de dados para a replica depende de como você criou o instantâneo dos dados na fonte.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

Nota

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver algum evento agendado, certifique-se de que esses eventos sejam desativados na nova replica antes de iniciá-la. Se um evento for executado na nova replica que já foi executado na fonte, a operação duplicada causa um erro. O Agendamento de Eventos é controlado pela variável de sistema `event_scheduler`, que tem como padrão `ON` do MySQL 8.0, então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a declaração `ALTER EVENT`(alter-event.html "15.1.3 ALTER EVENT Statement") para definir eventos individuais para `DISABLE` ou `DISABLE ON SLAVE` para impedí-los de serem executados na nova replica. Você pode listar os eventos em um servidor usando a declaração `SHOW` ou a tabela do Esquema de Informações `EVENTS`. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa para criar uma nova réplica dessa forma, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma réplica existente para um clone. Para obter instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Siga este procedimento para configurar a replicação com dados existentes:

1. Se você usou o plugin de clone do MySQL Server para criar um clone a partir de uma replica existente (veja Seção 7.6.7.7, “Clonagem para Replicação”), os dados já foram transferidos. Caso contrário, importe os dados para a replica usando um dos seguintes métodos.

1. Se você usou o **mysqldump**, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`. Em seguida, importe o arquivo de dump:

      ```
      $> mysql < fulldb.dump
      ```

2. Se você criou um instantâneo usando os arquivos de dados brutos, extraia os arquivos de dados para o diretório de dados da replica. Por exemplo:

      ```
      $> tar xvf dbdump.tar
      ```

Você pode precisar definir permissões e propriedade dos arquivos para que o servidor de replicação possa acessá-los e modificá-los. Em seguida, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`.

2. Configure a replica com as coordenadas de replicação da fonte. Isso informa à replica o arquivo de log binário e a posição dentro do arquivo onde a replicação deve começar. Além disso, configure a replica com as credenciais de login e o nome de host da fonte. Para mais informações sobre a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), consulte a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

3. Inicie os threads de replicação emitindo uma declaração `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`).

Após realizar este procedimento, a réplica se conecta à fonte e replica todas as atualizações que ocorreram na fonte desde que o instantâneo foi criado. Mensagens de erro são emitidas para o log de erro da réplica se ela não conseguir replicar por qualquer motivo.

A réplica usa informações registradas em seu repositório de metadados de conexão e repositório de metadados do aplicativo para acompanhar quanto do log binário da fonte ela já processou. A partir do MySQL 8.0, por padrão, esses repositórios são tabelas com o nome `slave_master_info` e `slave_relay_log_info` no banco de dados `mysql`. *Não* remova ou edite essas tabelas, a menos que você saiba exatamente o que está fazendo e entenda completamente as implicações. Mesmo nesse caso, é preferível que você use a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para alterar os parâmetros de replicação. A réplica usa os valores especificados na declaração para atualizar os repositórios de metadados de replicação automaticamente. Consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”, para obter mais informações.

Nota

Os conteúdos do repositório de metadados de conexão da replica substituem algumas das opções do servidor especificadas na linha de comando ou em `my.cnf`. Consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”, para mais detalhes.

Um único instantâneo da fonte é suficiente para múltiplas réplicas. Para configurar réplicas adicionais, use o mesmo instantâneo da fonte e siga a parte da réplica do procedimento descrito anteriormente.

#### 19.1.2.7 Configuração da fonte no replicador

Para configurar a replica para se comunicar com a fonte de replicação, configure a replica com as informações de conexão necessárias. Para isso, na replica, execute a declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23), substituindo os valores das opções pelos valores reais relevantes para o seu sistema:

```
mysql> CHANGE MASTER TO
    ->     MASTER_HOST='source_host_name',
    ->     MASTER_USER='replication_user_name',
    ->     MASTER_PASSWORD='replication_password',
    ->     MASTER_LOG_FILE='recorded_log_file_name',
    ->     MASTER_LOG_POS=recorded_log_position;

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO
    ->     SOURCE_HOST='source_host_name',
    ->     SOURCE_USER='replication_user_name',
    ->     SOURCE_PASSWORD='replication_password',
    ->     SOURCE_LOG_FILE='recorded_log_file_name',
    ->     SOURCE_LOG_POS=recorded_log_position;
```

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor MySQL de origem usando TCP/IP.

A declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` possui outras opções também. Por exemplo, é possível configurar a replicação segura usando SSL. Para uma lista completa das opções e informações sobre o comprimento máximo permitido para as opções de valor de cadeia, consulte a Seção 15.4.2.1, “Declaração CHANGE MASTER TO”.

Importante

Como observado na Seção 19.1.2.3, “Criando um Usuário para Replicação”, se você não estiver usando uma conexão segura e a conta de usuário nomeada na opção `SOURCE_USER` | `MASTER_USER` autentica com o plugin `caching_sha2_password` (o padrão do MySQL 8.0), você deve especificar a opção `SOURCE_PUBLIC_KEY_PATH` | `MASTER_PUBLIC_KEY_PATH` ou `GET_SOURCE_PUBLIC_KEY` | `GET_MASTER_PUBLIC_KEY` | `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para habilitar a troca de senha baseada em par de chave RSA.

#### 19.1.2.8 Adicionando réplicas a um ambiente de replicação

Você pode adicionar outra replica a uma configuração de replicação existente sem parar o servidor de origem. Para fazer isso, você pode configurar a nova replica copiando o diretório de dados de uma replica existente e dando ao novo replica um ID de servidor diferente (que é especificado pelo usuário) e UUID do servidor (que é gerado na inicialização).

Nota

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver algum evento agendado, certifique-se de que esses eventos sejam desativados na nova replica antes de iniciá-la. Se um evento for executado na nova replica que já foi executado na fonte, a operação duplicada causa um erro. O Cronograma de Eventos é controlado pela variável de sistema `event_scheduler`, que tem como padrão `ON` do MySQL 8.0, então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a declaração `ALTER EVENT` para definir eventos individuais para `DISABLE` ou `DISABLE ON SLAVE` para impedí-los de serem executados na nova replica. Você pode listar os eventos em um servidor usando a declaração `SHOW` ou a tabela do Esquema de Informações `EVENTS`. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa para criar uma nova réplica dessa forma, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma réplica existente para um clone. Para obter instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Para duplicar uma réplica existente sem clonagem, siga estes passos:

1. Parar a replica existente e registrar as informações do status da replica, especialmente os arquivos de registro binário de origem e os arquivos de registro de relevo. Você pode visualizar o status da replica nas tabelas de replicação do Schema de desempenho (consulte Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”), ou emitindo `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") da seguinte forma:

   ```
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   Or from MySQL 8.0.22:
   mysql> STOP REPLICA;
   mysql> SHOW REPLICA STATUS\G
   ```

2. Desative a replica existente:

   ```
   $> mysqladmin shutdown
   ```

3. Copie o diretório de dados da replica existente para a nova replica, incluindo os arquivos de log e os arquivos de log de relevo. Você pode fazer isso criando um arquivo usando **tar** ou `WinZip`, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

Importante

* Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão realmente armazenados no diretório de dados. Por exemplo, os espaços de sistema `InnoDB`, espaço de tabela de desfazer e log de refazer podem estar armazenados em um local alternativo. Os arquivos do espaço de tabela `InnoDB` e os espaços de tabela por arquivo podem ter sido criados em outros diretórios. Os logs binários e logs de relevo para a replica podem estar em seus próprios diretórios fora do diretório de dados. Verifique as variáveis do sistema que estão definidas para a replica existente e procure por quaisquer caminhos alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

* Durante a cópia, se os arquivos tiverem sido usados para os repositórios de metadados de replicação (consulte a Seção 19.2.4, "Repositórios de Log de Relay e Metadados de Replicação"), certifique-se de que também copie esses arquivos da replica existente para a nova replica. Se as tabelas tiverem sido usadas para os repositórios, o que é o padrão a partir do MySQL 8.0, as tabelas estão no diretório de dados.

* Após a cópia, exclua o arquivo `auto.cnf` da cópia do diretório de dados na nova réplica, para que a nova réplica seja iniciada com um UUID de servidor gerado de forma diferente. O UUID do servidor deve ser único.

Um problema comum que é encontrado ao adicionar novas réplicas é que a nova réplica falha com uma série de mensagens de aviso e erro, como estas:

   ```
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a replica and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

Essa situação pode ocorrer se a variável de sistema `relay_log` não for especificada, pois os arquivos de registro do relé contêm o nome do host como parte de seus nomes de arquivo. Isso também é verdadeiro para o arquivo de índice de registro do relé se a variável de sistema `relay_log_index` não for usada. Para mais informações sobre essas variáveis, consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”.

Para evitar esse problema, use o mesmo valor para `relay_log` na nova réplica que foi usada na réplica existente. Se essa opção não foi definida explicitamente na réplica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo de índice de log de relevo da réplica existente para a nova réplica e defina a variável de sistema `relay_log_index` na nova réplica para corresponder ao que foi usado na réplica existente. Se essa opção não foi definida explicitamente na réplica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova réplica após seguir os passos restantes nesta seção e encontrou erros como os descritos anteriormente, então realize os passos a seguir:

1. Se ainda não o fez, emita `STOP REPLICA` na nova réplica.

Se você já iniciou a replica existente novamente, emita `STOP REPLICA` na replica existente também.

2. Copie o conteúdo do arquivo de índice de registro de relevo da replica existente para o arquivo de índice de registro de relevo da nova replica, certificando-se de sobrescrever qualquer conteúdo já existente no arquivo.

3. Prossiga com os passos restantes nesta seção.
4. Quando a cópia estiver concluída, reinicie a replica existente.
5. Na nova replica, edite a configuração e dê ao novo replica um ID de servidor único (usando a variável de sistema `server_id`) que não seja usado pela fonte ou por nenhuma das replicas existentes.

6. Inicie o novo servidor de replicação, garantindo que a replicação ainda não tenha começado, especificando a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`. Use as tabelas de replicação do Schema de Desempenho ou emita `SHOW REPLICA STATUS` para confirmar que o novo replica tem as configurações corretas em comparação com a replica existente. Também exiba o ID do servidor e o UUID do servidor e verifique se esses são corretos e únicos para o novo replica.

7. Inicie as threads replicadas emitindo uma declaração `START REPLICA`. O novo replica agora usa as informações em seu repositório de metadados de conexão para iniciar o processo de replicação.

### 19.1.3 Replicação com Identificadores de Transação Global

Esta seção explica a replicação baseada em transações usando identificadores de transação global (GTIDs). Ao usar GTIDs, cada transação pode ser identificada e rastreada à medida que é comprometida no servidor de origem e aplicada por quaisquer réplicas; isso significa que não é necessário, ao usar GTIDs, referir-se a arquivos de registro ou posições dentro desses arquivos ao iniciar uma nova réplica ou falhar para uma nova fonte, o que simplifica muito essas tarefas. Como a replicação baseada em GTID é completamente baseada em transações, é simples determinar se as fontes e réplicas são consistentes; desde que todas as transações comprometidas em uma fonte também sejam comprometidas em uma réplica, a consistência entre as duas é garantida. Você pode usar a replicação baseada em declarações ou baseada em linhas com GTIDs (consulte Seção 19.2.1, “Formatos de Replicação”); no entanto, para obter os melhores resultados, recomendamos que você use o formato baseado em linhas.

Os GTIDs são sempre preservados entre a fonte e a réplica. Isso significa que você sempre pode determinar a fonte de qualquer transação aplicada em qualquer réplica, examinando seu log binário. Além disso, uma vez que uma transação com um GTID dado seja comprometida em um servidor dado, qualquer transação subsequente com o mesmo GTID é ignorada por esse servidor. Assim, uma transação comprometida na fonte pode ser aplicada no máximo uma vez na réplica, o que ajuda a garantir a consistência.

Esta seção discute os seguintes tópicos:

* Como os GTIDs são definidos e criados, e como são representados em um servidor MySQL (consulte a Seção 19.1.3.1, "Formato e Armazenamento do GTID").

* O ciclo de vida de um GTID (ver Seção 19.1.3.2, “Ciclo de vida do GTID”).

* A função de autoposicionamento para sincronizar uma réplica e uma fonte que utilizam GTIDs (ver Seção 19.1.3.3, “Autoposicionamento de GTID”).

* Um procedimento geral para configurar e iniciar a replicação baseada em GTID (consulte a Seção 19.1.3.4, “Configuração da Replicação Usando GTIDs”).

* Métodos sugeridos para provisionamento de novos servidores de replicação ao usar GTIDs (consulte Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”).

* Restrições e limitações que você deve estar ciente ao usar a replicação baseada em GTID (consulte a Seção 19.1.3.7, “Restrições na Replicação com GTIDs”).

* Funções armazenadas que você pode usar para trabalhar com GTIDs (consulte a Seção 19.1.3.8, “Exemplos de função armazenada para manipular GTIDs”).

Para obter informações sobre as opções e variáveis do MySQL Server relacionadas à replicação baseada em GTID, consulte a Seção 19.1.6.5, “Variáveis do Sistema de ID de Transação Global”. Veja também a Seção 14.18.2, “Funções Usadas com Identificadores de Transação Global (GTIDs)”), que descreve as funções SQL suportadas pelo MySQL 8.0 para uso com GTIDs.

#### 19.1.3.1 Formato e Armazenamento do GTID

Um identificador de transação global (GTID) é um identificador único criado e associado a cada transação comprometida no servidor de origem (a fonte). Esse identificador é único não apenas para o servidor no qual ele se originou, mas é único em todos os servidores em uma topologia de replicação dada.

A atribuição de GTID distingue entre as transações do cliente, que são comprometidas na fonte, e as transações replicadas, que são reproduzidas em uma réplica. Quando uma transação do cliente é comprometida na fonte, ela recebe um novo GTID, desde que a transação tenha sido escrita no log binário. As transações do cliente são garantidas para ter GTIDs que aumentam de forma monótona, sem lacunas entre os números gerados. Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), não é atribuído um GTID no servidor de origem.

As transações replicadas retêm o mesmo GTID que foi atribuído à transação no servidor de origem. O GTID está presente antes de a transação replicada começar a ser executada e é persistido mesmo se a transação replicada não for escrita no log binário na replica, ou seja, se ela for filtrada na replica. A tabela do sistema MySQL `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos a todas as transações aplicadas em um servidor MySQL, exceto aquelas que estão armazenadas em um arquivo de log binário atualmente ativo.

A função de auto-saltos para GTIDs significa que uma transação comprometida na fonte pode ser aplicada no máximo uma vez na réplica, o que ajuda a garantir a consistência. Uma vez que uma transação com um GTID dado tenha sido comprometida em um servidor dado, qualquer tentativa de executar uma transação subsequente com o mesmo GTID é ignorada por esse servidor. Não é gerado nenhum erro e nenhuma declaração na transação é executada.

Se uma transação com um GTID dado tiver começado a ser executada em um servidor, mas ainda não tiver sido comprometida ou revertida, qualquer tentativa de iniciar uma transação concorrente no servidor com o mesmo GTID é bloqueada. O servidor não começa a executar a transação concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transação seja comprometida ou revertida, as sessões concorrentes que estavam bloqueadas no mesmo GTID podem prosseguir. Se a primeira tentativa for revertida, uma sessão concorrente prossegue para tentar a transação, e quaisquer outras sessões concorrentes que estavam bloqueadas no mesmo GTID permanecem bloqueadas. Se a primeira tentativa for comprometida, todas as sessões concorrentes deixam de ser bloqueadas e ignoram automaticamente todas as declarações da transação.

Um GTID é representado como um par de coordenadas, separado por um caractere de colon (`:`), conforme mostrado aqui:

```
GTID = source_id:transaction_id
```

O *`source_id` identifica o servidor de origem. Normalmente, o `server_uuid` da fonte é usado para esse propósito. O *`transaction_id` é um número de sequência determinado pela ordem em que a transação foi comprometida no servidor de origem. Por exemplo, a primeira transação a ser comprometida tem `1` como seu *`transaction_id`*, e a décima transação a ser comprometida no mesmo servidor de origem é atribuída um *`transaction_id`* de `10`. Não é possível que uma transação tenha `0` como número de sequência em um GTID. Por exemplo, a vigésima terceira transação a ser comprometida originalmente no servidor com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para números de sequência para GTIDs em uma instância do servidor é o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado a 63 menos 1, ou 9.223.372.036.854.775.807). Se a instância do servidor ficar sem GTIDs, ela toma a ação especificada por `binlog_error_action`. A partir do MySQL 8.0.23, uma mensagem de aviso é emitida quando a instância do servidor está se aproximando do limite.

O GTID para uma transação é mostrado na saída do **mysqlbinlog**, e é usado para identificar uma transação individual nas tabelas de status de replicação do Gerenciador de desempenho, por exemplo, `replication_applier_status_by_worker`. O valor armazenado pela variável de sistema `gtid_next` (`@@GLOBAL.gtid_next`) é um único GTID.

##### Conjuntos GTID

Um conjunto de GTID é um conjunto que compreende uma ou mais GTIDs individuais ou intervalos de GTIDs. Conjuntos de GTID são usados em um servidor MySQL de várias maneiras. Por exemplo, os valores armazenados pelas variáveis de sistema `gtid_executed` e `gtid_purged` são conjuntos de GTID. As cláusulas `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE` (start-slave.html "15.4.2.7 START SLAVE Statement")) `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` podem ser usadas para fazer com que um processo de replicação transações apenas até o primeiro GTID em um conjunto de GTID, ou parar após o último GTID em um conjunto de GTID. As funções internas `GTID_SUBSET()` e `GTID_SUBTRACT()` requerem conjuntos de GTID como entrada.

Uma série de GTIDs originários do mesmo servidor pode ser reduzida a uma única expressão, como mostrado aqui:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa as primeiras cinco transações originadas no servidor MySQL cujo `server_uuid` é `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Múltiplos GTIDs únicos ou intervalos de GTIDs originados do mesmo servidor também podem ser incluídos em uma única expressão, com os GTIDs ou intervalos separados por colchetes, como no exemplo a seguir:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um conjunto de GTID pode incluir qualquer combinação de GTID individuais e intervalos de GTID, e pode incluir GTID que se originam de diferentes servidores. Este exemplo mostra o conjunto de GTID armazenado na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) de uma réplica que aplicou transações de mais de uma fonte:

```
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando os conjuntos GTID são retornados a partir de variáveis do servidor, os UUIDs estão em ordem alfabética e os intervalos numéricos são combinados e em ordem crescente.

A sintaxe para um conjunto de GTID é a seguinte:

```
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

interval:
    n[-n]

    (n >= 1)
```

##### tabela mysql.gtid_executed

Os GTIDs são armazenados em uma tabela denominada `gtid_executed`, no banco de dados `mysql`. Uma linha desta tabela contém, para cada GTID ou conjunto de GTIDs que ela representa, o UUID do servidor de origem e os IDs de transação inicial e final do conjunto; para uma linha que faz referência a apenas um único GTID, esses dois últimos valores são os mesmos.

A tabela `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando uma declaração `CREATE TABLE` semelhante àquela mostrada aqui:

```
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Aviso

Assim como outras tabelas do sistema MySQL, não tente criar ou modificar essa tabela por si mesmo.

A tabela `mysql.gtid_executed` é fornecida para uso interno pelo servidor MySQL. Ela permite que uma replica use GTIDs quando o registro binário está desativado na replica, e permite a retenção do estado do GTID quando os registros binários foram perdidos. Note que a tabela `mysql.gtid_executed` é limpa se você emitir `RESET MASTER`(reset-master.html "15.4.1.2 RESET MASTER Statement").

Os GTIDs são armazenados na tabela `mysql.gtid_executed` apenas quando `gtid_mode` é `ON` ou `ON_PERMISSIVE`. Se o registro binário estiver desativado (`log_bin` é `OFF`), ou se `log_replica_updates` ou `log_slave_updates` estiver desativado, o servidor armazena o GTID pertencente a cada transação junto com a transação no buffer quando a transação é confirmada, e o thread de fundo adiciona o conteúdo do buffer periodicamente como uma ou mais entradas na tabela `mysql.gtid_executed`. Além disso, a tabela é comprimida periodicamente a uma taxa configurável pelo usuário, conforme descrito em Compressão de compressão de tabela mysql.gtid.

Se o registro binário estiver habilitado (`log_bin` é `ON`), a partir do MySQL 8.0.17, apenas para o mecanismo de armazenamento `InnoDB`, o servidor atualiza a tabela `mysql.gtid_executed` da mesma maneira que quando o registro binário ou o registro de atualização de replica não está habilitado, armazenando o GTID para cada transação no momento do commit da transação. No entanto, em versões anteriores ao MySQL 8.0.17 e para outros mecanismos de armazenamento, o servidor atualiza apenas a tabela `mysql.gtid_executed` quando o registro binário é rotado ou o servidor é desligado. Nesses momentos, o servidor escreve GTIDs para todas as transações que foram escritas no registro binário anterior na tabela `mysql.gtid_executed`. Esta situação se aplica em uma fonte anterior ao MySQL 8.0.17, ou em uma replica anterior ao MySQL 8.0.17 onde o registro binário está habilitado, ou com outros mecanismos de armazenamento que não `InnoDB`, tem as seguintes consequências:

* Em caso de parada inesperada do servidor, o conjunto de GTIDs do arquivo de registro binário atual não é salvo na tabela `mysql.gtid_executed`. Esses GTIDs são adicionados à tabela a partir do arquivo de registro binário durante a recuperação, para que a replicação possa continuar. A exceção a isso é se você desabilitar o registro binário quando o servidor for reiniciado (usando `--skip-log-bin` ou `--disable-log-bin`). Nesse caso, o servidor não pode acessar o arquivo de registro binário para recuperar os GTIDs, portanto, a replicação não pode ser iniciada.

* A tabela `mysql.gtid_executed` não contém um registro completo dos GTIDs para todas as transações executadas. Essas informações são fornecidas pelo valor global da variável do sistema `gtid_executed`. Em versões anteriores ao MySQL 8.0.17 e com motores de armazenamento que não são `InnoDB`, sempre use `@@GLOBAL.gtid_executed`, que é atualizado após cada commit, para representar o estado do GTID para o servidor MySQL, em vez de consultar a tabela `mysql.gtid_executed`.

O servidor MySQL pode gravar na tabela `mysql.gtid_executed` mesmo quando o servidor estiver no modo de leitura somente ou de leitura somente privilegiada. Em versões anteriores ao MySQL 8.0.17, isso garante que o arquivo de log binário ainda possa ser rotado nesses modos. Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e o arquivo de log binário for rotado por qualquer motivo que não seja o alcance do tamanho máximo do arquivo (`max_binlog_size`), o arquivo de log binário atual continua sendo usado. Uma mensagem de erro é retornada ao cliente que solicitou a rotação, e uma advertência é registrada no servidor. Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e o `max_binlog_size` for alcançado, o servidor responde de acordo com sua configuração `binlog_error_action`. Se o `IGNORE_ERROR` estiver definido, um erro é registrado no servidor e o registro binário é interrompido, ou se o `ABORT_SERVER` estiver definido, o servidor é desligado.

##### Tabela de compressão mysql.gtid_executed

Ao longo do tempo, a tabela `mysql.gtid_executed` pode ficar cheia de muitas linhas que se referem a GTIDs individuais que se originam no mesmo servidor, e cujos IDs de transação formam uma faixa, semelhante ao que é mostrado aqui:

```
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           |
...
```

Para economizar espaço, o servidor MySQL pode comprimir a tabela `mysql.gtid_executed` periodicamente, substituindo cada conjunto de linhas por uma única linha que abrange todo o intervalo de identificadores de transação, da seguinte forma:

```
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

O servidor pode realizar a compressão usando um fio dedicado de primeiro plano chamado `thread/sql/compress_gtid_table`. Esse fio não está listado na saída de `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"), mas pode ser visto como uma linha na tabela `threads`, conforme mostrado aqui:

```
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

Quando o registro binário está habilitado no servidor, esse método de compressão não é utilizado e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do registro binário. No entanto, quando o registro binário está desativado no servidor, o `thread/sql/compress_gtid_table` adormece até que um número especificado de transações tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Em seguida, adormece até que o mesmo número de transações ocorra, e então acorda para realizar a compressão novamente, repetindo esse loop indefinidamente. O número de transações que transcorrem antes da tabela ser comprimida, e, portanto, a taxa de compressão, é controlado pelo valor da variável de sistema `gtid_executed_compression_period`. Definir esse valor para 0 significa que o `thread/sql/compress_gtid_table` nunca acorda, o que significa que esse método de compressão explícito não é utilizado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

A partir do MySQL 8.0.17, as transações `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado para as transações não `InnoDB`. Esse processo é controlado por um fio diferente, `innodb/clone_gtid_thread`. Esse fio persistente GTID coleta GTIDs em grupos, os elimina para a tabela `mysql.gtid_executed`, e depois comprime a tabela. Se o servidor tiver uma mistura de transações `InnoDB` e não `InnoDB`, que são escritas individualmente na tabela `mysql.gtid_executed`, a compressão realizada pelo fio `compress_gtid_table` interfere no trabalho do fio persistente GTID e pode desacelerá-lo significativamente. Por essa razão, a partir desse lançamento, é recomendado que você defina `gtid_executed_compression_period` para 0, para que o fio `compress_gtid_table` nunca seja ativado.

A partir do MySQL 8.0.23, o valor padrão do `gtid_executed_compression_period` é 0, e tanto as transações `InnoDB` quanto as que não são `InnoDB` são escritas na tabela `mysql.gtid_executed` pelo thread do persistor GTID.

Para as versões anteriores ao MySQL 8.0.17, o valor padrão de 1000 para `gtid_executed_compression_period` pode ser usado, o que significa que a compressão da tabela é realizada após cada 1000 transações, ou você pode escolher um valor alternativo. Nesses lançamentos, se você definir um valor de 0 e o registro binário estiver desativado, a compressão explícita não será realizada na tabela `mysql.gtid_executed`, e você deve estar preparado para um aumento potencialmente grande na quantidade de espaço em disco que pode ser necessário para a tabela se você fizer isso.

Quando uma instância do servidor é iniciada, se `gtid_executed_compression_period` estiver definida com um valor não nulo e o `thread/sql/compress_gtid_table` thread for iniciado, na maioria das configurações do servidor, a compressão explícita é realizada para a tabela `mysql.gtid_executed`. Em versões anteriores ao MySQL 8.0.17, quando o registro binário está habilitado, a compressão é acionada pelo fato de o registro binário ser rotado no início. Em versões a partir do MySQL 8.0.20, a compressão é acionada pelo lançamento do thread. Nas versões intermediárias, a compressão não ocorre no início.

#### 19.1.3.2 Ciclo de Vida do GTID

O ciclo de vida de um GTID consiste nas seguintes etapas:

1. Uma transação é executada e comprometida na fonte. Esta transação do cliente é atribuída um GTID composto pelo UUID da fonte e pelo menor número de sequência de transação não nulo ainda não utilizado neste servidor. O GTID é escrito no log binário da fonte (imediatamente antes da própria transação no log). Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não é atribuída um GTID.

2. Se um GTID foi atribuído para a transação, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário é rotado ou o servidor é desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo anterior do log binário na tabela `mysql.gtid_executed`.

3. Se um GTID foi atribuído para a transação, o GTID é externalizado não-atômico (muito pouco tempo após a transação ser comprometida) adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`). Este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID comprometidas, e é usado na replicação como um token que representa o estado do servidor. Com o registro binário habilitado (como exigido para a fonte), o conjunto de GTIDs na variável de sistema `gtid_executed` é um registro completo das transações aplicadas, mas a tabela `mysql.gtid_executed` não é, porque o histórico mais recente ainda está no arquivo de registro binário atual.

4. Após os dados do log binário serem transmitidos para a replica e armazenados no log de relevo da replica (usando mecanismos estabelecidos para esse processo, consulte a Seção 19.2, “Implementação de Replicação”, para detalhes), a replica lê o GTID e define o valor da variável de sistema `gtid_next` como este GTID. Isso indica à replica que a próxima transação deve ser registrada usando este GTID. É importante notar que a replica define `gtid_next` em um contexto de sessão.

5. A replica verifica que nenhum fio ainda tenha tomado posse do GTID em `gtid_next` para processar a transação. Ao ler e verificar o GTID da transação replicada primeiro, antes de processar a própria transação, a replica garante não apenas que nenhuma transação anterior com este GTID tenha sido aplicada na replica, mas também que nenhuma outra sessão já tenha lido este GTID, mas ainda não tenha comprometido a transação associada. Assim, se vários clientes tentarem aplicar a mesma transação simultaneamente, o servidor resolve isso, permitindo que apenas um deles execute. A variável de sistema `gtid_owned` (`@@GLOBAL.gtid_owned`) para a replica mostra cada GTID que está atualmente em uso e o ID do fio que a possui. Se o GTID já tiver sido usado, não é gerado nenhum erro, e a função de auto-skip é usada para ignorar a transação.

6. Se o GTID não tiver sido utilizado, a replica aplica a transação replicada. Como `gtid_next` está configurado com o GTID já atribuído pela fonte, a replica não tenta gerar um novo GTID para essa transação, mas, em vez disso, utiliza o GTID armazenado em `gtid_next`.

7. Se o registro binário estiver habilitado na replica, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como `Gtid_log_event`). Sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo anterior do log binário na tabela `mysql.gtid_executed`.

8. Se o registro binário estiver desativado na replica, o GTID é persistido de forma atômica, escrevendo-o diretamente na tabela `mysql.gtid_executed`. O MySQL adiciona uma declaração à transação para inserir o GTID na tabela. A partir do MySQL 8.0, essa operação é atômica tanto para declarações DDL quanto para declarações DML. Nessa situação, a tabela `mysql.gtid_executed` é um registro completo das transações aplicadas na replica.

9. Muito pouco tempo após a transação replicada ser confirmada na réplica, o GTID é externalizado não-atômico, adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) para a réplica. Quanto à fonte, este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID confirmadas. Se o registro binário estiver desativado na réplica, a tabela `mysql.gtid_executed` também é um registro completo das transações aplicadas na réplica. Se o registro binário estiver ativado na réplica, o que significa que alguns GTIDs são registrados apenas no log binário, o conjunto de GTIDs na variável de sistema `gtid_executed` é o único registro completo.

As transações do cliente que são completamente filtradas na fonte não recebem um GTID, portanto, não são adicionadas ao conjunto de transações na variável de sistema `gtid_executed`, nem adicionadas à tabela `mysql.gtid_executed`. No entanto, os GTIDs das transações replicadas que são completamente filtradas na replica são preservados. Se o registro binário estiver habilitado na replica, a transação filtrada é escrita no registro binário como um `Gtid_log_event`, seguido por uma transação vazia que contém apenas as declarações `BEGIN` e `COMMIT`. Se o registro binário estiver desabilitado, o GTID da transação filtrada é escrito na tabela `mysql.gtid_executed`. Preservar os GTIDs para as transações filtradas garante que a tabela `mysql.gtid_executed` e o conjunto de GTIDs na variável de sistema `gtid_executed` possam ser comprimidos. Também garante que as transações filtradas não sejam recuperadas novamente se a replica se reconectar com a fonte, conforme explicado na Seção 19.1.3.3, “Autoposicionamento do GTID”.

Em uma replica multithread (com `replica_parallel_workers > 0` ou `slave_parallel_workers > 0`), as transações podem ser aplicadas em paralelo, portanto, as transações replicadas podem ser confirmadas fora de ordem (a menos que `replica_preserve_commit_order=1` ou `slave_preserve_commit_order=1` esteja definido). Quando isso acontece, o conjunto de GTIDs na variável de sistema `gtid_executed` contém múltiplos intervalos de GTIDs com lacunas entre eles. (Em uma fonte ou replica de único thread, há GTIDs que aumentam de forma monótona sem lacunas entre os números.) As lacunas em replicas multithread ocorrem apenas entre as transações mais recentemente aplicadas, e são preenchidas à medida que a replicação progride. Quando as threads de replicação são paradas de forma limpa usando a declaração `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement"), as transações em andamento são aplicadas para que as lacunas sejam preenchidas. No caso de um desligamento, como uma falha no servidor ou o uso da declaração `KILL` para parar as threads de replicação, as lacunas podem permanecer.

Quais mudanças recebem um GTID?

O cenário típico é que o servidor gere um novo GTID para uma transação comprometida. No entanto, GTIDs também podem ser atribuídos a outras alterações além de transações, e, em alguns casos, uma única transação pode receber vários GTIDs.

Cada alteração de banco de dados (DDL ou DML) que é escrita no log binário é atribuída um GTID. Isso inclui alterações que são auto-atribuídas e alterações que são atreladas usando as declarações `BEGIN` e `COMMIT` ou `START TRANSACTION`. Um GTID também é atribuído à criação, alteração ou exclusão de um banco de dados e de um objeto não de tabela de banco de dados, como um procedimento, função, gatilho, evento, visão, usuário, papel ou concessão.

As atualizações não transacionais, assim como as transacionais, recebem GTIDs. Além disso, para uma atualização não transacional, se ocorrer uma falha de escrita em disco ao tentar escrever no cache do log binário e, portanto, uma lacuna for criada no log binário, o evento de registro de incidente resultante recebe um GTID.

Quando uma tabela é automaticamente descartada por uma declaração gerada no log binário, um GTID é atribuído à declaração. As tabelas temporárias são descartadas automaticamente quando uma réplica começa a aplicar eventos de uma fonte que acabou de ser iniciada, e quando a replicação baseada em declarações está em uso (`binlog_format=STATEMENT`) e uma sessão de usuário que tem tabelas temporárias abertas se desconecta. As tabelas que usam o mecanismo de armazenamento `MEMORY` são excluídas automaticamente na primeira vez que são acessadas após o servidor ser iniciado, porque as linhas podem ter sido perdidas durante o desligamento.

Quando uma transação não é escrita no log binário no servidor de origem, o servidor não atribui um GTID a ela. Isso inclui transações que são revertidas e transações que são executadas enquanto o registro binário está desativado no servidor de origem, seja globalmente (com `--skip-log-bin` especificado na configuração do servidor) ou para a sessão (`SET @@SESSION.sql_log_bin = 0`). Isso também inclui transações sem operação quando a replicação baseada em linha está em uso (`binlog_format=ROW`).

As transações XA recebem GTIDs separados para a fase `XA PREPARE` da transação e para a fase `XA COMMIT` ou `XA ROLLBACK` da transação. As transações XA são preparadas de forma persistente, de modo que os usuários possam comprometer ou desfazer elas no caso de uma falha (o que, em uma topologia de replicação, pode incluir uma transição para outro servidor). As duas partes da transação são, portanto, replicadas separadamente, portanto, devem ter seus próprios GTIDs, mesmo que uma transação que não é XA e que é desfeita não tenha um GTID.

Nos seguintes casos especiais, uma única declaração pode gerar várias transações e, portanto, ser atribuída a vários GTIDs:

* É invocada uma procedura armazenada que compromete múltiplas transações. Um GTID é gerado para cada transação que a procedura compromete.

* Uma declaração multi-tabela `DROP TABLE` exclui tabelas de diferentes tipos. Múltiplos GTIDs podem ser gerados se alguma das tabelas utilizar motores de armazenamento que não suportam DDL atômico, ou se alguma das tabelas forem tabelas temporárias.

Uma declaração `CREATE TABLE ... SELECT` é emitida quando a replicação baseada em linha está em uso (`binlog_format=ROW`). Um GTID é gerado para a ação `CREATE TABLE`[(create-table.html "15.1.20 CREATE TABLE Statement")]] e um GTID é gerado para as ações de inserção de linha.

##### A variável de sistema `gtid_next`

Por padrão, para novas transações realizadas em sessões de usuário, o servidor gera e atribui automaticamente um novo GTID. Quando a transação é aplicada em uma réplica, o GTID do servidor de origem é preservado. Você pode alterar esse comportamento definindo o valor da sessão da variável de sistema `gtid_next`:

* Quando `gtid_next` está definido como `AUTOMATIC`, que é o padrão, e uma transação é comprometida e escrita no log binário, o servidor automaticamente gera e atribui um novo GTID. Se uma transação for revertida ou não escrita no log binário por outro motivo, o servidor não gera e não atribui um GTID.

* Se você definir `gtid_next` para um GTID válido (composto por uma UUID e um número de sequência de transação, separados por um colon), o servidor atribui esse GTID à sua transação. Esse GTID é atribuído e adicionado a `gtid_executed`, mesmo quando a transação não é escrita no log binário, ou quando a transação está vazia.

Observe que, após definir `gtid_next` para um GTID específico, e a transação ter sido comprometida ou revertida, uma declaração explícita de `SET @@SESSION.gtid_next` deve ser emitida antes de qualquer outra declaração. Você pode usar isso para definir o valor do GTID de volta para `AUTOMATIC` se você não quiser atribuir mais GTIDs explicitamente.

Quando os threads do aplicativo de replicação aplicam transações replicadas, eles usam essa técnica, definindo explicitamente `@@SESSION.gtid_next` para o GTID da transação replicada, conforme atribuído no servidor de origem. Isso significa que o GTID do servidor de origem é mantido, em vez de um novo GTID ser gerado e atribuído pela replica. Isso também significa que o GTID é adicionado a `gtid_executed` na replica, mesmo quando o registro binário ou o registro de atualização da replica estão desativados na replica, ou quando a transação é uma operação sem efeito ou é filtrada na replica.

É possível que um cliente simule uma transação replicada, definindo `@@SESSION.gtid_next` para um GTID específico antes de executar a transação. Essa técnica é usada pelo **mysqlbinlog** para gerar um dump do log binário que o cliente pode reproduzir para preservar os GTIDs. Uma transação replicada simulada comprometida por um cliente é completamente equivalente a uma transação replicada comprometida por um thread do aplicativo de replicação, e não podem ser distinguidas posteriormente.

##### A variável de sistema `gtid_purged`

O conjunto de GTIDs na variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) contém os GTIDs de todas as transações que foram comprometidas no servidor, mas não existem em nenhum arquivo de registro binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

* GTIDs de transações replicadas que foram comprometidas com registro binário desativado na replica.

* GTIDs das transações que foram escritas em um arquivo de registro binário que agora foi apagado.

* GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Você pode alterar o valor de `gtid_purged` para registrar no servidor que as transações em um determinado conjunto de GTID foram aplicadas, embora elas não existam em nenhum registro binário no servidor. Quando você adiciona GTIDs a `gtid_purged`, eles também são adicionados a `gtid_executed`. Um caso de uso de exemplo para essa ação é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes que contêm as transações no servidor. Antes do MySQL 8.0, você só poderia alterar o valor de `gtid_purged` quando `gtid_executed` (e, portanto, `gtid_purged`) estava vazio. A partir do MySQL 8.0, essa restrição não se aplica, e você também pode escolher se deseja substituir todo o conjunto de GTID em `gtid_purged` com um conjunto de GTID especificado, ou se deseja adicionar um conjunto de GTID especificado aos GTIDs já em `gtid_purged`. Para obter detalhes de como fazer isso, consulte a descrição para `gtid_purged`.

Os conjuntos de GTIDs nas variáveis de sistema `gtid_executed` e `gtid_purged` são inicializados quando o servidor é iniciado. Cada arquivo de registro binário começa com o evento `Previous_gtids_log_event`, que contém o conjunto de GTIDs em todos os arquivos de registro binário anteriores (composto pelos GTIDs no `Previous_gtids_log_event` do arquivo anterior e pelos GTIDs de cada `Gtid_log_event` no próprio arquivo anterior). O conteúdo de `Previous_gtids_log_event` nos arquivos de registro binário mais antigos e mais recentes é usado para calcular os conjuntos `gtid_executed` e `gtid_purged` na inicialização do servidor:

* `gtid_executed` é calculado como a união dos GTIDs em `Previous_gtids_log_event` no arquivo de registro binário mais recente, os GTIDs das transações nesse arquivo de registro binário e os GTIDs armazenados na tabela `mysql.gtid_executed`. Este conjunto de GTIDs contém todos os GTIDs que foram usados (ou adicionados explicitamente em `gtid_purged`) no servidor, independentemente de estarem ou não atualmente em um arquivo de registro binário no servidor. Não inclui os GTIDs para transações que estão atualmente sendo processadas no servidor (`@@GLOBAL.gtid_owned`).

* `gtid_purged` é calculado somando primeiro os GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais recente e os GTIDs das transações nesse arquivo de log binário. Essa etapa fornece o conjunto de GTIDs que estão atualmente, ou que foram, registrados em um log binário no servidor (`gtids_in_binlog`). Em seguida, os GTIDs em `Previous_gtids_log_event` no arquivo de log binário mais antigo são subtraídos de `gtids_in_binlog`. Essa etapa fornece o conjunto de GTIDs que estão atualmente registrados em um log binário no servidor (`gtids_in_binlog_not_purged`). Finalmente, `gtids_in_binlog_not_purged` é subtraído de `gtid_executed`. O resultado é o conjunto de GTIDs que foram usados no servidor, mas que atualmente não estão registrados em um arquivo de log binário no servidor, e esse resultado é usado para inicializar `gtid_purged`.

Se os registros binários do MySQL 5.7.7 ou versões anteriores estiverem envolvidos nesses cálculos, é possível que conjuntos de GTID incorretos sejam calculados para `gtid_executed` e `gtid_purged`, e eles permanecem incorretos mesmo se o servidor for reiniciado posteriormente. Para obter detalhes, consulte a descrição da variável de sistema `binlog_gtid_simple_recovery`, que controla como os registros binários são iterados para calcular os conjuntos de GTID. Se uma das situações descritas lá se aplicar em um servidor, defina `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de iniciá-lo. Essa configuração faz com que o servidor itere todos os arquivos de registro binário (não apenas os mais novos e mais antigos) para encontrar onde os eventos de GTID começam a aparecer. Esse processo pode levar um longo tempo se o servidor tiver um grande número de arquivos de registro binário sem eventos de GTID.

##### Redefinindo o histórico de execução do GTID

Se você precisar redefinir o histórico de execução do GTID em um servidor, use a declaração `RESET MASTER`. Por exemplo, você pode precisar fazer isso após realizar consultas de teste para verificar uma configuração de replicação em novos servidores habilitados para GTID, ou quando você deseja unir um novo servidor a um grupo de replicação, mas ele contém algumas transações locais indesejadas que não são aceitas pela Replicação de Grupo.

Aviso

Use `RESET MASTER` com cautela para evitar a perda de qualquer histórico de execução do GTID e arquivos de log binário desejado.

Antes de emitir `RESET MASTER`, certifique-se de ter backups dos arquivos de log binário do servidor e do arquivo de índice de log binário, se houver, e obtenha e salve o conjunto de GTID contido no valor global da variável de sistema `gtid_executed` (por exemplo, emitindo uma declaração `SELECT @@GLOBAL.gtid_executed` e salvando os resultados). Se você está removendo transações indesejadas desse conjunto de GTID, use **mysqlbinlog** para examinar o conteúdo das transações para garantir que elas não tenham valor, não contenham dados que devam ser salvos ou replicados e não tenham resultado em mudanças de dados no servidor.

Quando você emite `RESET MASTER`, as seguintes operações de reposição são realizadas:

* O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`).

* O valor global (mas não o valor da sessão) da variável de sistema `gtid_executed` é definido como uma string vazia.

* A tabela `mysql.gtid_executed` é limpa (consulte a tabela mysql.gtid_executed).

* Se o servidor tiver o registro binário habilitado, os arquivos de registro binários existentes serão excluídos e o arquivo de índice do registro binário será apagado.

Observe que `RESET MASTER` é o método para redefinir o histórico de execução do GTID, mesmo que o servidor seja uma réplica onde o registro binário está desativado. `RESET REPLICA` não tem efeito no histórico de execução do GTID.

#### 19.1.3.3 GTID de Autoposicionamento

Os GTIDs substituem os pares de deslocamento de arquivo anteriormente necessários para determinar os pontos de início, parada ou retomada do fluxo de dados entre a fonte e a replica. Quando os GTIDs estão em uso, todas as informações que a replica precisa para a sincronização com a fonte são obtidas diretamente do fluxo de dados de replicação.

Para iniciar uma replica usando replicação baseada em GTID, é necessário habilitar a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` na declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou na declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23). As opções alternativas `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` especificam o nome do arquivo de registro e a posição inicial dentro do arquivo, mas com GTIDs a replica não precisa desses dados não locais. Para obter instruções completas sobre como configurar e iniciar fontes e réplicas usando replicação baseada em GTID, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”.

A opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` é desativada por padrão. Se a replicação de múltiplas fontes estiver habilitada na replica, você precisa definir a opção para cada canal de replicação aplicável. Desativar a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` novamente faz com que a replica retorne à replicação baseada em posição; isso significa que, quando `GTID_ONLY=ON`, algumas posições podem ser marcadas como inválidas, nesse caso, você também deve especificar os `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` ao desativar `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION`.

Quando uma réplica tem GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE`) e a opção `MASTER_AUTO_POSITION` habilitada, o autoposicionamento é ativado para a conexão com a fonte. A fonte deve ter `GTID_MODE=ON` definido para que a conexão seja bem-sucedida. No aperto inicial, a réplica envia um conjunto de GTIDs definido contendo as transações que ela já recebeu, comprometeu ou ambas. Este conjunto de GTIDs é igual à união do conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) e o conjunto de GTIDs registrados na tabela do Schema de Desempenho `replication_connection_status` como transações recebidas (o resultado da declaração `SELECT RECEIVED_TRANSACTION_SET FROM PERFORMANCE_SCHEMA.replication_connection_status`).

A fonte responde enviando todas as transações registradas em seu log binário cujo GTID não está incluído no conjunto de GTID enviado pela replica. Para isso, a fonte primeiro identifica o arquivo de log binário apropriado para começar a trabalhar, verificando o `Previous_gtids_log_event` no cabeçalho de cada um de seus arquivos de log binário, começando com o mais recente. Quando a fonte encontra o primeiro `Previous_gtids_log_event` que não contém transações que a replica está faltando, ela começa com esse arquivo de log binário. Esse método é eficiente e leva apenas um tempo significativo se a replica estiver atrás da fonte por um grande número de arquivos de log binário. A fonte então lê as transações nesse arquivo de log binário e arquivos subsequentes até o atual, enviando as transações com GTIDs que a replica está faltando, e ignorando as transações que estavam no conjunto de GTID enviado pela replica. O tempo decorrido até a replica receber a primeira transação faltante depende de seu deslocamento no arquivo de log binário. Essa troca garante que a fonte só envie as transações com um GTID que a replica não tenha recebido ou comprometido ainda. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes.

Se alguma das transações que devem ser enviadas pela fonte tiver sido removida do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged` por outro método, a fonte envia o erro `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não começa. Os GTIDs das transações perdidas e purgadas são identificados e listados no log de erro da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. A replica não pode se recuperar automaticamente desse erro, porque partes do histórico de transações necessárias para se atualizar com a fonte foram purgadas. Tentar se reconectar sem a opção `MASTER_AUTO_POSITION` habilitada resulta apenas na perda das transações purgadas na replica. A abordagem correta para se recuperar dessa situação é a replica se replicar as transações perdidas listadas na mensagem `ER_FOUND_MISSING_GTIDS` de outra fonte, ou para a replica ser substituída por uma nova replica criada a partir de um backup mais recente. Considere revisar o período de expiração do log binário (`binlog_expire_logs_seconds`) na fonte para garantir que a situação não ocorra novamente.

Se, durante a troca de transações, for descoberto que a réplica recebeu ou comprometeu transações com o UUID da fonte no GTID, mas a fonte não possui registro delas, a fonte envia o erro `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` para a réplica e a replicação não é iniciada. Essa situação pode ocorrer se uma fonte que não possui `sync_binlog=1` definida, experimente uma falha de energia ou falha do sistema operacional e perca transações comprometidas que ainda não foram sincronizadas no arquivo de log binário, mas que foram recebidas pela réplica. A fonte e a réplica podem divergir se quaisquer clientes comprometem transações na fonte após ela ser reiniciada, o que pode levar à situação em que a fonte e a réplica estão usando o mesmo GTID para transações diferentes. A abordagem correta para se recuperar dessa situação é verificar manualmente se a fonte e a réplica divergiram. Se o mesmo GTID estiver sendo usado para transações diferentes, você precisa realizar a resolução manual de conflitos para transações individuais conforme necessário, ou remover a fonte ou a réplica da topologia de replicação. Se o problema for apenas a falta de transações na fonte, você pode transformar a fonte em uma réplica, permitir que ela ative as outras servidores na topologia de replicação e, se necessário, torná-la novamente uma fonte.

Para uma replica multi-fonte em uma topologia em forma de diamante (onde a replica se replica a partir de duas ou mais fontes, que por sua vez se replicam a partir de uma fonte comum), quando a replicação baseada em GTID está em uso, certifique-se de que quaisquer filtros de replicação ou outra configuração de canal são idênticos em todos os canais da replica multi-fonte. Com a replicação baseada em GTID, os filtros são aplicados apenas aos dados da transação, e os GTIDs não são filtrados. Isso acontece para que o conjunto de GTIDs da replica permaneça consistente com o da fonte, o que significa que o autoposicionamento de GTID pode ser usado sem re-adquirir transações filtradas a cada vez. No caso em que a replica descendente é multi-fonte e recebe a mesma transação de múltiplas fontes em uma topologia em forma de diamante, a replica descendente agora tem múltiplas versões da transação, e o resultado depende do canal que aplica a transação primeiro. O segundo canal a tentar isso pula a transação usando o auto-salto de GTID, porque o GTID da transação foi adicionado ao conjunto `gtid_executed` pelo primeiro canal. Com filtragem idêntica nos canais, não há problema, porque todas as versões da transação contêm os mesmos dados, então os resultados são os mesmos. No entanto, com filtragem diferente nos canais, o banco de dados pode se tornar inconsistente e a replicação pode ficar parada.

#### 19.1.3.4 Configurando a replicação usando GTIDs

Esta seção descreve um processo para configurar e iniciar a replicação baseada em GTID no MySQL 8.0. Este é um procedimento de "início frio" que assume que você está iniciando o servidor de origem pela primeira vez ou que é possível interromper o servidor; para informações sobre provisionamento de réplicas usando GTIDs de um servidor de origem em execução, consulte a Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”. Para informações sobre alterar o modo GTID em servidores online, consulte a Seção 19.1.4, “Altere o Modo GTID em Servidores Online”.

Os passos-chave neste processo de inicialização para a topologia de replicação de GTID mais simples possível, consistindo em uma fonte e uma replica, são os seguintes:

1. Se a replicação já estiver em execução, sincronize os dois servidores, tornando-os somente leitura.

2. Parar ambos os servidores.  
3. Reiniciar ambos os servidores com GTIDs habilitados e as opções corretas configuradas.

As opções do **mysqld** necessárias para iniciar os servidores conforme descrito são discutidas no exemplo que segue mais adiante nesta seção.

4. Instrua a replica a usar a fonte como fonte de dados de replicação e a usar auto-posicionamento. As instruções SQL necessárias para realizar essa etapa estão descritas no exemplo que segue mais adiante nesta seção.

5. Faça um novo backup. Registros binários que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados, então os backups feitos antes deste ponto não podem ser usados com sua nova configuração.

6. Inicie a replicação e, em seguida, desative o modo somente leitura em ambos os servidores, para que eles possam aceitar as atualizações.

No exemplo a seguir, dois servidores já estão em execução como fonte e réplica, usando o protocolo de replicação baseado na posição do log binário do MySQL. Se você está começando com novos servidores, consulte a Seção 19.1.2.3, “Criando um Usuário para Conexões de Replicação”, para obter informações sobre como adicionar um usuário específico para conexões de replicação e a Seção 19.1.2.1, “Definindo a Configuração da Fonte de Replicação”, para obter informações sobre como definir a variável `server_id`. Os exemplos a seguir mostram como armazenar as opções de inicialização do **mysqld** no arquivo de opções do servidor, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”, para obter mais informações. Alternativamente, você pode usar as opções de inicialização ao executar o **mysqld**.

A maioria dos passos que se seguem exige o uso da conta `root` do MySQL ou de outra conta de usuário do MySQL que tenha o privilégio `SUPER`. O **mysqladmin** `shutdown` requer o privilégio `SUPER` ou o privilégio `SHUTDOWN`.

**Passo 1: Sincronize os servidores.** Este passo é necessário apenas quando você está trabalhando com servidores que já estão replicando sem usar GTIDs. Para novos servidores, prossiga para o Passo 3. Faça os servidores de leitura somente, definindo a variável de sistema `read_only` para `ON` em cada servidor, emitindo o seguinte:

```
mysql> SET @@GLOBAL.read_only = ON;
```

Aguarde que todas as transações em andamento sejam confirmadas ou revertidas. Em seguida, permita que a replica acompanhe a fonte. *É extremamente importante que você garanta que a replica tenha processado todas as atualizações antes de continuar*.

Se você usar logs binários para qualquer outra coisa que não seja replicação, por exemplo, para fazer backup e restauração em um ponto no tempo, espere até que não precise mais dos logs binários antigos que contêm transações sem GTIDs. Idealmente, espere até que o servidor elimine todos os logs binários e espere que qualquer backup existente expire.

Importante

É importante entender que os registros que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados. Antes de prosseguir, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

**Passo 2: Parar ambos os servidores. Parar cada servidor usando **mysqladmin**, conforme mostrado aqui, onde *`username`* é o nome do usuário para um usuário do MySQL que tenha privilégios suficientes para desligar o servidor:

```
$> mysqladmin -uusername -p shutdown
```

Em seguida, forneça a senha desse usuário na solicitação.

**Passo 3: Inicie ambos os servidores com GTIDs habilitados.** Para habilitar a replicação baseada em GTID, cada servidor deve ser iniciado com o modo GTID habilitado, definindo a variável `gtid_mode` para `ON`, e com a variável `enforce_gtid_consistency` habilitada para garantir que apenas as declarações que são seguras para replicação baseada em GTID sejam registradas. Por exemplo:

```
gtid_mode=ON
enforce-gtid-consistency=ON
```

Comece cada replica com a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para garantir que a replicação não comece até que você tenha configurado as configurações da replica. A partir do MySQL 8.0.26, use `--skip-replica-start` ou `skip_replica_start` em vez disso. Para mais informações sobre as opções e variáveis relacionadas ao GTID, consulte a Seção 19.1.6.5, “Variáveis de Sistema de ID de Transação Global”.

Não é obrigatório ter o registro binário habilitado para usar GTIDs ao usar a Tabela mysql.gtid_executed. Os servidores de origem devem sempre ter o registro binário habilitado para poderem ser replicados. No entanto, os servidores de replica podem usar GTIDs, mas sem registro binário. Se você precisar desabilitar o registro binário em um servidor de replica, pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` ou `--log-slave-updates=OFF` para a replica.

**Passo 4: Configure a replica para usar autoposicionamento baseado em GTID.** Diga à replica que use a fonte com transações baseadas em GTID como fonte de dados de replicação e que use autoposicionamento baseado em GTID em vez de posicionamento baseado em arquivos. Emsira uma declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) na replica, incluindo a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` na declaração para dizer à replica que as transações da fonte são identificadas por GTIDs.

Você também pode precisar fornecer os valores apropriados para o nome do host e o número de porta da fonte, bem como o nome de usuário e a senha de uma conta de usuário de replicação que pode ser usada pela replica para se conectar à fonte; se esses já tiverem sido definidos antes do Passo 1 e não precisem de mais alterações, as opções correspondentes podem ser omitidas com segurança da declaração mostrada aqui.

```
mysql> CHANGE MASTER TO
     >     MASTER_HOST = host,
     >     MASTER_PORT = port,
     >     MASTER_USER = user,
     >     MASTER_PASSWORD = password,
     >     MASTER_AUTO_POSITION = 1;

Or from MySQL 8.0.23:

mysql> CHANGE REPLICATION SOURCE TO
     >     SOURCE_HOST = host,
     >     SOURCE_PORT = port,
     >     SOURCE_USER = user,
     >     SOURCE_PASSWORD = password,
     >     SOURCE_AUTO_POSITION = 1;
```

**Passo 5: Faça um novo backup.** Os backups existentes que foram feitos antes de você habilitar GTIDs não podem mais ser usados nesses servidores agora que você habilitou GTIDs. Faça um novo backup neste ponto, para que você não fique sem um backup utilizável.

Por exemplo, você pode executar `FLUSH LOGS` (flush.html#flush-logs) no servidor onde você está fazendo backups. Em seguida, você pode fazer explicitamente um backup ou esperar para a próxima iteração de qualquer rotina de backup periódico que você tenha configurado.

**Passo 6: Inicie a replica e desative o modo somente leitura.** Inicie a replica da seguinte forma:

```
mysql> START SLAVE;
Or from MySQL 8.0.22:
mysql> START REPLICA;
```

O passo a seguir é necessário apenas se você configurou um servidor para ser somente de leitura no Passo 1. Para permitir que o servidor comece a aceitar atualizações novamente, execute a seguinte declaração:

```
mysql> SET @@GLOBAL.read_only = OFF;
```

A replicação baseada em GTID deve estar em execução agora, e você pode começar (ou retomar) a atividade na fonte como antes. A Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”, discute a criação de novas réplicas ao usar GTIDs.

#### 19.1.3.5 Usando GTIDs para Failover e Scaleout

Há várias técnicas ao usar a replicação do MySQL com Identificadores de Transação Global (GTIDs) para provisionar uma nova replica que pode ser usada para escala, sendo promovida como fonte conforme necessário para falha. Esta seção descreve as seguintes técnicas:

* Replicação simples
* Copiar dados e transações para a replica
* Injetar transações vazias
* Excluir transações com gtid_purged
* Restaurar replicas no modo GTID

Identificadores globais de transação foram adicionados ao MySQL Replication com o objetivo de simplificar o gerenciamento geral do fluxo de dados de replicação e, em particular, as atividades de failover. Cada identificador identifica de forma única um conjunto de eventos de log binário que, juntos, compõem uma transação. Os GTIDs desempenham um papel fundamental na aplicação de alterações no banco de dados: o servidor ignora automaticamente qualquer transação que tenha um identificador que o servidor reconheça como uma que ele já processou anteriormente. Esse comportamento é crítico para o posicionamento automático da replicação e o failover correto.

O mapeamento entre identificadores e conjuntos de eventos que compõem uma transação dada é capturado no log binário. Isso apresenta alguns desafios ao provisionar um novo servidor com dados de outro servidor existente. Para reproduzir o conjunto de identificadores no novo servidor, é necessário copiar os identificadores do servidor antigo para o novo e preservar a relação entre os identificadores e os eventos reais. Isso é necessário para restaurar uma replica que está imediatamente disponível como um candidato para se tornar uma nova fonte em caso de falha ou mudança de configuração.

**Replicação simples.** A maneira mais fácil de reproduzir todos os identificadores e transações em um novo servidor é fazer com que o novo servidor se torne a replica de uma fonte que tenha todo o histórico de execução, e habilitar identificadores de transação global em ambos os servidores. Consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”, para mais informações.

Assim que a replicação for iniciada, o novo servidor copia o log binário inteiro a partir da fonte e, assim, obtém todas as informações sobre todos os GTIDs.

Esse método é simples e eficaz, mas exige que a replica leia o log binário da fonte; às vezes, pode levar um tempo relativamente longo para a nova replica se atualizar com a fonte, portanto, esse método não é adequado para falha rápida ou restauração a partir de backup. Esta seção explica como evitar obter todo o histórico de execução da fonte, copiando arquivos de log binário para o novo servidor.

**Copiar dados e transações para a replica.** Executar todo o histórico de transações pode ser demorado quando o servidor de origem processou um grande número de transações anteriormente, e isso pode representar um grande gargalo ao configurar uma nova replica. Para eliminar essa exigência, um instantâneo do conjunto de dados, os registros binários e as informações globais de transação que o servidor de origem contém podem ser importados para a nova replica. O servidor onde o instantâneo é feito pode ser o servidor de origem ou um de seus replicas, mas você deve garantir que o servidor tenha processado todas as transações necessárias antes de copiar os dados.

Existem várias variantes desse método, a diferença sendo a maneira pela qual os dados e as transações dos registros binários são transferidos para a replica, conforme descrito aqui:

Conjunto de dados:   1. Crie um arquivo de dump usando o **mysqldump** no servidor de origem. Defina a opção do **mysqldump** `--master-data` (com o valor padrão de 1) para incluir uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") com informações de registro binário. Defina a opção `--set-gtid-purged` para `AUTO` (o padrão) ou `ON`, para incluir informações sobre as transações executadas no dump. Em seguida, use o cliente **mysql** para importar o arquivo de dump no servidor de destino.

2. Alternativamente, crie um instantâneo de dados do servidor de origem usando arquivos de dados brutos, e depois copie esses arquivos para o servidor de destino, seguindo as instruções na Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”. Se você usar as tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que é incluído como parte de uma assinatura do MySQL Enterprise. Veja a Seção 32.1, “Visão Geral do MySQL Enterprise Backup” para informações detalhadas.

3. Alternativamente, pare os servidores fonte e de destino, copie o conteúdo do diretório de dados da fonte para o diretório de dados da nova réplica, e, em seguida, reinicie a réplica. Se você usar esse método, a réplica deve ser configurada para replicação com base em GTID, ou seja, com `gtid_mode=ON`. Para instruções e informações importantes sobre esse método, consulte a Seção 19.1.2.8, “Adicionando réplicas a um ambiente de replicação”.

Histórico de transações: Se o servidor de origem tiver um histórico de transações completo em seus registros binários (ou seja, o GTID definido em `@@GLOBAL.gtid_purged` estiver vazio), você pode usar esses métodos.

1. Importe os logs binários do servidor de origem para a nova replica usando o **mysqlbinlog**, com as opções `--read-from-remote-server`, `--read-from-remote-source` e `--read-from-remote-master`.

2. Alternativamente, copie os arquivos de log binário do servidor fonte para a replica. Você pode fazer cópias da replica usando o **mysqlbinlog** com as opções `--read-from-remote-server` e `--raw`. Esses arquivos podem ser lidos na replica usando o **mysqlbinlog** `>` `file` (sem a opção `--raw`) para exportar os arquivos de log binário para arquivos SQL, e depois passar esses arquivos para o cliente **mysql** para processamento. Certifique-se de que todos os arquivos de log binário sejam processados usando um único processo **mysql**, em vez de várias conexões. Por exemplo:

       ```
       $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
       ```

Para mais informações, consulte a Seção 6.6.9.3, “Usando mysqlbinlog para fazer backup de arquivos de log binário”.

Esse método tem a vantagem de que um novo servidor está disponível quase imediatamente; apenas as transações que foram comprometidas enquanto o arquivo de instantâneo ou de dump estava sendo reinterpretado ainda precisam ser obtidas da fonte existente. Isso significa que a disponibilidade da replica não é instantânea, mas apenas um período relativamente curto de tempo deve ser necessário para que a replica se atualize com essas poucas transações restantes.

Copiar logs binários para o servidor de destino com antecedência geralmente é mais rápido do que ler todo o histórico de execução de transações a partir da fonte em tempo real. No entanto, nem sempre é viável mover esses arquivos para o destino quando necessário, devido ao tamanho ou outras considerações. Os dois métodos restantes para provisionar uma nova replica discutidos nesta seção utilizam outros meios para transferir informações sobre transações para a nova replica.

**Injetando transações vazias.** A variável global `gtid_executed` da fonte contém o conjunto de todas as transações executadas na fonte. Em vez de copiar os logs binários ao fazer um snapshot para provisionar um novo servidor, você pode, em vez disso, anotar o conteúdo de `gtid_executed` no servidor do qual o snapshot foi feito. Antes de adicionar o novo servidor à cadeia de replicação, simplesmente commit uma transação vazia no novo servidor para cada identificador de transação contido no `gtid_executed` da fonte, assim:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Uma vez que todos os identificadores de transação tenham sido reestabelecidos dessa maneira usando transações vazias, você deve limpar e purgar os logs binários da replica, conforme mostrado aqui, onde *`N`* é o sufixo não nulo do nome atual do arquivo de log binário:

```
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

Você deve fazer isso para evitar que este servidor inunda o fluxo de replicação com transações falsas, no caso de ser promovido para a fonte posteriormente. (A declaração `FLUSH LOGS` (flush.html#flush-logs) força a criação de um novo arquivo de registro binário; `PURGE BINARY LOGS` elimina as transações vazias, mas retém seus identificadores.)

Esse método cria um servidor que é essencialmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte, à medida que seu histórico de registro binário converge com o do fluxo de replicação (ou seja, à medida que ele alcança a fonte ou fontes). Esse resultado é semelhante em efeito ao obtido usando o método de provisionamento restante, que discutimos nos próximos parágrafos.

**Excluindo transações com gtid_purged.** A variável global `gtid_purged` da fonte contém o conjunto de todas as transações que foram apagadas do log binário da fonte. Como mencionado anteriormente (veja Injetando transações vazias), você pode registrar o valor de `gtid_executed` no servidor do qual o instantâneo foi tirado (em vez de copiar os logs binários para o novo servidor). Ao contrário do método anterior, não é necessário compromentar transações vazias (ou emitir `PURGE BINARY LOGS`), em vez disso, você pode definir `gtid_purged` diretamente na replica, com base no valor de `gtid_executed` no servidor do qual o backup ou instantâneo foi tirado.

Assim como o método que utiliza transações vazias, este método cria um servidor que é funcionalmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte, pois seu histórico de registro binário converge com o da fonte e de outras réplicas.

**Restauração de réplicas no modo GTID.** Ao restaurar uma réplica em uma configuração de replicação baseada em GTID que encontrou um erro, a injeção de uma transação vazia pode não resolver o problema, pois um evento não tem um GTID.

Use o **mysqlbinlog** para encontrar a próxima transação, que provavelmente é a primeira transação no próximo arquivo de registro após o evento. Copie tudo até o `COMMIT` para essa transação, garantindo que inclua o `SET @@SESSION.gtid_next`. Mesmo que você não esteja usando replicação baseada em linha, ainda pode executar eventos de linha de registro binário no cliente de linha de comando.

Pare a replica e execute a transação que você copiou. A saída do **mysqlbinlog** define o delimitador como `/*!*/;`, então configure-o novamente:

```
mysql> DELIMITER ;
```

Reinicie a replicação a partir da posição correta automaticamente:

```
mysql> SET GTID_NEXT=automatic;
mysql> RESET SLAVE;
mysql> START SLAVE;
Or from MySQL 8.0.22:
mysql> SET GTID_NEXT=automatic;
mysql> RESET REPLICA;
mysql> START REPLICA;
```

#### 19.1.3.6 Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs

A partir do MySQL 8.0.23, você pode configurar canais de replicação para atribuir um GTID a transações replicadas que ainda não possuem um. Esse recurso permite a replicação de um servidor de origem que não possui GTIDs habilitados e que não usa replicação baseada em GTID, para uma replica que possui GTIDs habilitados. Se for possível habilitar GTIDs no servidor de origem de replicação, conforme descrito na Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”, use essa abordagem em vez disso. Esse recurso é projetado para servidores de origem de replicação onde você não pode habilitar GTIDs. Note que, conforme é padrão para a replicação MySQL, esse recurso não suporta replicação de servidores de origem MySQL anteriores à série de lançamentos anteriores, portanto, o MySQL 5.7 é a fonte de replicação mais antiga suportada para uma replica do MySQL 8.0.

Você pode habilitar a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`. `LOCAL` atribui um GTID que inclui o próprio UUID da replica (a configuração `server_uuid`). `uuid` atribui um GTID que inclui o UUID especificado, como a configuração `server_uuid` para o servidor de origem da replicação. Usar um UUID não local permite diferenciar entre as transações que se originaram na replica e as transações que se originaram na fonte, e, para uma replica de múltiplas fontes, entre as transações que se originaram em diferentes fontes. Se alguma das transações enviadas pela fonte tiver um GTID já existente, esse GTID é mantido.

Importante

Um conjunto de réplica configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal não pode ser promovido para substituir o servidor de origem da replicação, caso seja necessário um failover, e um backup retirado da réplica não pode ser usado para restaurar o servidor de origem da replicação. A mesma restrição se aplica à substituição ou restauração de outras réplicas que utilizam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal.

A réplica deve ter o `gtid_mode=ON` definido, e isso não pode ser alterado posteriormente, a menos que você remova a configuração `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS=ON`. Se o servidor de réplica for iniciado sem GTIDs habilitados e com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` definido para quaisquer canais de replicação, as configurações não são alteradas, mas uma mensagem de aviso é escrita no log de erro explicando como alterar a situação.

Para uma replica multi-fonte, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, e canais que não o fazem. Canais específicos para a Replicação por Grupo não podem usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas um canal de replicação assíncrona para outra fonte em uma instância do servidor que é membro do grupo de Replicação por Grupo pode fazer isso. Para um canal em um membro do grupo de Replicação por Grupo, não especifique o nome do grupo de Replicação por Grupo como o UUID para criar os GTIDs.

Usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em um canal de replicação não é o mesmo que introduzir replicação baseada em GTID para o canal. O conjunto de GTID (`gtid_executed`) de um conjunto de replicação configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` não deve ser transferido para outro servidor ou comparado com o conjunto de GTID de outro servidor. Os GTIDs que são atribuídos às transações anônimas e o UUID que você escolhe para elas têm significado apenas para o uso próprio da replica. A exceção a isso é qualquer replica descendente da replica onde você habilitou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, e quaisquer servidores que foram criados a partir de um backup dessa replica.

Se você configurar quaisquer réplicas subsequentes, esses servidores não têm `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` habilitado. Apenas a réplica que está recebendo transações diretamente do servidor de origem não GTID precisa ter `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` configurado no canal de replicação relevante. Entre essa réplica e suas réplicas subsequentes, você pode comparar conjuntos de GTID, fazer uma transição de uma réplica para outra e usar backups para criar réplicas adicionais, como faria em qualquer topologia de replicação baseada em GTID. `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` é usado onde as transações são recebidas de um servidor não GTID fora deste grupo.

Um canal de replicação que utiliza `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` tem as seguintes diferenças de comportamento em relação à replicação baseada em GTID:

* GTIDs são atribuídos às transações replicadas quando elas são aplicadas (a menos que já tenham um GTID). Normalmente, um GTID é atribuído no servidor de origem da replicação quando a transação é confirmada e enviado para a replica junto com a transação. Em uma replica multi-threaded, isso significa que a ordem dos GTIDs não necessariamente corresponde à ordem das transações, mesmo que `slave-preserve-commit-order=1` esteja definido.

As opções `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` da declaração `CHANGE REPLICATION SOURCE TO` são usadas para posicionar a thread de I/O de replicação (receptor), e não a opção `SOURCE_AUTO_POSITION`.

* A declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` é usada para pular transações em um canal de replicação configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, em vez do método de comprovação de transações vazias. Para instruções, consulte a Seção 19.1.7.3, “Pular transações”.

As opções `UNTIL SQL_BEFORE_GTIDS` e `UNTIL_SQL_AFTER_GTIDS` da declaração `START REPLICA` não podem ser usadas para o canal.

* A função `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, que é descontinuada a partir do MySQL 8.0.18, não pode ser usada com o canal. Seu substituto `WAIT_FOR_EXECUTED_GTID_SET()`, que funciona em todo o servidor, pode ser usado para aguardar quaisquer réplicas descendentes do servidor que tenha `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` habilitado. Para aguardar o canal com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` habilitado para se atualizar com a fonte, que não usa GTIDs, use a função `SOURCE_POS_WAIT()` (a partir do MySQL 8.0.26) ou a função `MASTER_POS_WAIT()`.

A tabela do Schema de desempenho `replication_applier_configuration` mostra se GTIDs são atribuídos a transações anônimas em um canal de replicação, qual é o UUID e se é o UUID do servidor replica (`LOCAL`) ou um UUID especificado pelo usuário (`UUID`). As informações também são registradas no repositório de metadados do aplicável. Uma declaração `RESET REPLICA ALL`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") redefiniu o ajuste `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas uma declaração `RESET REPLICA`

#### 19.1.3.7 Restrições sobre a Replicação com GTIDs

Como a replicação baseada em GTID depende de transações, algumas funcionalidades que, de outra forma, estão disponíveis no MySQL não são suportadas ao usá-la. Esta seção fornece informações sobre as restrições e limitações da replicação com GTIDs.

**Atualizações envolvendo motores de armazenamento não transacionais.** Ao usar GTIDs, as atualizações em tabelas usando motores de armazenamento não transacionais, como `MyISAM`, não podem ser feitas na mesma declaração ou transação que atualizações em tabelas usando motores de armazenamento transacionais, como `InnoDB`.

Essa restrição ocorre porque as atualizações em tabelas que utilizam um mecanismo de armazenamento não transacional, misturadas com atualizações em tabelas que utilizam um mecanismo de armazenamento transacional, dentro da mesma transação, podem resultar em múltiplos GTIDs sendo atribuídos à mesma transação.

Tais problemas também podem ocorrer quando a fonte e a replica usam diferentes motores de armazenamento para suas respectivas versões da mesma tabela, onde um motor de armazenamento é transacional e o outro não é. Além disso, esteja ciente de que os gatilhos que são definidos para operar em tabelas não transacionais podem ser a causa desses problemas.

Em qualquer um dos casos mencionados acima, a correspondência um-para-um entre as transações e os GTIDs é quebrada, com o resultado de que a replicação baseada em GTID não pode funcionar corretamente.

**Criar tabelas com instruções SELECT.** Antes do MySQL 8.0.21, as instruções `CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") não são permitidas ao usar replicação baseada em GTID. Quando `binlog_format` está definido como `STATEMENT`, uma declaração [`CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é registrada no log binário como uma transação com um GTID, mas se o formato `ROW` é usado, a declaração é registrada como duas transações com dois GTIDs. Se uma fonte usou o formato `STATEMENT` e uma réplica usou o formato `ROW`, a réplica não seria capaz de lidar com a transação corretamente, portanto, a declaração [`CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é desaconselhada com GTIDs para prevenir este cenário. Esta restrição é levantada no MySQL 8.0.21 em motores de armazenamento que suportam DDL atômica. Neste caso, [`CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") é registrado no log binário como uma transação. Para mais informações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

**Tabelas temporárias.** Quando `binlog_format` está definido como `STATEMENT`, as declarações [`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") e [`DROP TEMPORARY TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") não podem ser usadas dentro de transações, procedimentos, funções e gatilhos quando GTIDs estão em uso no servidor (ou seja, quando a variável de sistema `enforce_gtid_consistency` está definida como `ON`). Elas podem ser usadas fora desses contextos quando GTIDs estão em uso, desde que `autocommit=1` esteja definido. A partir do MySQL 8.0.13, quando `binlog_format` está definido como `ROW` ou `MIXED`, as declarações [`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") e [`DROP TEMPORARY TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") são permitidas dentro de uma transação, procedimento, função ou gatilho quando GTIDs estão em uso. As declarações não são escritas no log binário e, portanto, não são replicadas para réplicas. O uso da replicação baseada em linhas significa que as réplicas permanecem sincronizadas sem a necessidade de replicar tabelas temporárias. Se a remoção dessas declarações de uma transação resultar em uma transação vazia, a transação não é escrita no log binário.

**Prevenção da execução de declarações não suportadas.** Para evitar a execução de declarações que possam causar o fracasso da replicação baseada em GTID, todos os servidores devem ser iniciados com a opção `--enforce-gtid-consistency` ao habilitar GTIDs. Isso faz com que as declarações de qualquer um dos tipos discutidos anteriormente nesta seção falhem com um erro.

Observe que `--enforce-gtid-consistency` só tem efeito se o registro binário ocorrer para uma declaração. Se o registro binário estiver desativado no servidor, ou se as declarações não forem escritas no log binário porque são removidas por um filtro, a consistência GTID não é verificada ou aplicada para as declarações que não são registradas.

Para obter informações sobre outras opções de inicialização necessárias ao habilitar GTIDs, consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”.

**Saltar transações.** `sql_replica_skip_counter` ou `sql_slave_skip_counter` não está disponível ao usar replicação com base em GTID. Se você precisa saltar transações, use o valor da variável da fonte de `gtid_executed`. Se você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")], `sql_replica_skip_counter` ou `sql_slave_skip_counter` está disponível. Para mais informações, consulte a Seção 19.1.7.3, “Saltar transações”.

**Ignorar servidores.** A opção IGNORE_SERVER_IDS da declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") é desaconselhada ao usar GTIDs, porque as transações que já foram aplicadas são automaticamente ignoradas. Antes de começar a replicação baseada em GTIDs, verifique e limpe todas as listas de IDs de servidor ignoradas que foram previamente definidas nos servidores envolvidos. A declaração `SHOW REPLICA STATUS`, que pode ser emitida para canais individuais, exibe a lista de IDs de servidor ignorados, se houver uma. Se não houver uma lista, o campo `Replicate_Ignore_Server_Ids` está em branco.

Modo GTID e mysql_upgrade. Antes do MySQL 8.0.16, quando o servidor está em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`, não habilite o registro binário pelo **mysql_upgrade** (a opção `--write-binlog`). A partir do MySQL 8.0.16, o servidor realiza todo o procedimento de atualização do MySQL, mas desabilita o registro binário durante a atualização, portanto, não há problema.

#### 19.1.3.8 Exemplos de função armazenada para manipular GTIDs

Esta seção fornece exemplos de funções armazenadas (consulte o Capítulo 27, *Objetos Armazenados*), que você pode criar usando algumas das funções embutidas fornecidas pelo MySQL para uso com replicação baseada em GTID, listadas aqui:

* `GTID_SUBSET()`: Mostra se um conjunto de GTID é um subconjunto de outro.

* `GTID_SUBTRACT()`: Retorna os GTIDs de um conjunto de GTIDs que não estão em outro.

* `WAIT_FOR_EXECUTED_GTID_SET()`: Aguarda até que todas as transações em um conjunto de GTID específico tenham sido executadas.

Veja a Seção 14.18.2, “Funções usadas com Identificadores de Transação Global (GTIDs)”), para obter mais informações sobre as funções listadas acima.

Observe que, nessas funções armazenadas, o comando delimitador foi usado para alterar o delimitador da declaração MySQL em uma barra vertical, assim:

```
mysql> delimiter |
```

Todas as funções armazenadas mostradas nesta seção recebem representações de cadeia de conjuntos GTID como argumentos, portanto, os conjuntos GTID devem ser sempre citados quando utilizados com elas.

Essa função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem o mesmo conjunto, mesmo que não estejam formatados da mesma maneira:

```
CREATE FUNCTION GTID_IS_EQUAL(gs1 LONGTEXT, gs2 LONGTEXT)
  RETURNS INT
  RETURN GTID_SUBSET(gs1, gs2) AND GTID_SUBSET(gs2, gs1)
|
```

Essa função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem disjuntos:

```
CREATE FUNCTION GTID_IS_DISJOINT(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS INT
  RETURN GTID_SUBSET(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Essa função retorna não nula (verdadeiro) se dois conjuntos de GTID forem disjuntos e `sum` for sua união:

```
CREATE FUNCTION GTID_IS_DISJOINT_UNION(gs1 LONGTEXT, gs2 LONGTEXT, sum LONGTEXT)
RETURNS INT
  RETURN GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs1), gs2) AND
         GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs2), gs1)
|
```

Essa função retorna uma forma normalizada do conjunto de GTID, em maiúsculas, sem espaços em branco e sem duplicatas, com UUIDs em ordem alfabética e intervalos em ordem numérica:

```
CREATE FUNCTION GTID_NORMALIZE(gs LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, '')
|
```

Essa função retorna a união de dois conjuntos de GTID:

```
CREATE FUNCTION GTID_UNION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_NORMALIZE(CONCAT(gs1, ',', gs2))
|
```

Essa função retorna a interseção de dois conjuntos de GTID.

```
CREATE FUNCTION GTID_INTERSECTION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Essa função retorna a diferença simétrica entre dois conjuntos de GTID, ou seja, os GTID que existem em `gs1`, mas não em `gs2`, bem como os GTID que existem em `gs2`, mas não em `gs1`.

```
CREATE FUNCTION GTID_SYMMETRIC_DIFFERENCE(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(CONCAT(gs1, ',', gs2), GTID_INTERSECTION(gs1, gs2))
|
```

Essa função remove de um conjunto de GTID todos os GTIDs com a origem especificada e retorna os GTIDs restantes, se houver. O UUID é o identificador usado pelo servidor onde a transação se originou, que normalmente é o valor de `server_uuid`.

```
CREATE FUNCTION GTID_SUBTRACT_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, CONCAT(UUID, ':1-', (1 << 63) - 2))
|
```

Essa função atua como o inverso da anterior; ela retorna apenas os GTIDs do conjunto de GTIDs que se originam do servidor com o identificador especificado (UUID).

```
CREATE FUNCTION GTID_INTERSECTION_WITH_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, GTID_SUBTRACT_UUID(gs, uuid))
|
```

**Exemplo 19.1 Verificando se uma réplica está atualizada**

As funções embutidas `GTID_SUBSET()` e `GTID_SUBTRACT()` podem ser usadas para verificar se uma réplica aplicou pelo menos todas as transações que uma fonte aplicou.

Para realizar essa verificação com `GTID_SUBSET()`, execute a seguinte instrução na réplica:

```
SELECT GTID_SUBSET(source_gtid_executed, replica_gtid_executed);
```

Se o valor dos retornos for `0` (falso), isso significa que alguns GTIDs em *`source_gtid_executed`* não estão presentes em *`replica_gtid_executed`*, e que a replica ainda não aplicou as transações que foram aplicadas na fonte, o que significa que a replica não está atualizada.

Para realizar a mesma verificação com `GTID_SUBTRACT()`, execute a seguinte instrução na réplica:

```
SELECT GTID_SUBTRACT(source_gtid_executed, replica_gtid_executed);
```

Essa declaração retorna quaisquer GTIDs que estejam em *`source_gtid_executed`*, mas não em *`replica_gtid_executed`*. Se algum GTID for retornado, a fonte aplicou algumas transações que a replica não aplicou, e, portanto, a replica não está atualizada.

**Exemplo 19.2 Cenário de backup e restauração**

As funções armazenadas `GTID_IS_EQUAL()`, `GTID_IS_DISJOINT()` e `GTID_IS_DISJOINT_UNION()` podem ser usadas para verificar operações de backup e restauração envolvendo múltiplos bancos de dados e servidores. Neste cenário de exemplo, `server1` contém o banco de dados `db1`, e `server2` contém o banco de dados `db2`. O objetivo é copiar o banco de dados `db2` para `server1`, e o resultado em `server1` deve ser a união dos dois bancos de dados. O procedimento usado é fazer backup de `server2` usando **mysqldump**, então restaurar esse backup em `server1`.

Se o **mysqldump** foi executado com `--set-gtid-purged` definido como `ON` ou `AUTO` (padrão), a saída contém uma declaração `SET @@GLOBAL.gtid_purged` que adiciona o conjunto `gtid_executed` definido em `server2` ao conjunto `gtid_purged` em `server1`. `gtid_purged` contém os GTIDs de todas as transações que foram comprometidas em um servidor específico, mas que não existem em nenhum arquivo de registro binário no servidor. Quando o banco de dados `db2` é copiado para `server1`, os GTIDs das transações comprometidas em `server2`, que não estão nos arquivos de registro binário em `server1`, devem ser adicionados a `gtid_purged` para que `server1` possa completar o conjunto.

As funções armazenadas podem ser usadas para auxiliar nos seguintes passos neste cenário:

* Use `GTID_IS_EQUAL()` para verificar se a operação de backup calculou o conjunto correto de GTID para a declaração `SET @@GLOBAL.gtid_purged`. Em `server2`, extraia essa declaração do **mysqldump** e armazene o conjunto de GTID em uma variável local, como `$gtid_purged_set`. Em seguida, execute a seguinte declaração:

  ```
  server2> SELECT GTID_IS_EQUAL($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

Se o resultado for 1, os dois conjuntos de GTID são iguais e o conjunto foi calculado corretamente.

* Use `GTID_IS_DISJOINT()` para verificar se o GTID definido na saída do **mysqldump** não sobrepõe-se ao definido no `gtid_executed` no `server1`. Ter GTIDs idênticos presentes em ambos os servidores causa erros ao copiar o banco de dados `db2` para `server1`. Para verificar, em `server1`, extraia e armazene `gtid_purged` da saída em uma variável local como feito anteriormente, em seguida, execute a seguinte declaração:

  ```
  server1> SELECT GTID_IS_DISJOINT($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

Se o resultado for 1, não há sobreposição entre os dois conjuntos de GTID, portanto, não há duplicatas de GTID presentes.

* Use `GTID_IS_DISJOINT_UNION()` para verificar se a operação de restauração resultou no estado correto do GTID em `server1`. Antes de restaurar o backup, em `server1`, obtenha o conjunto existente de `gtid_executed` executando a seguinte declaração:

  ```
  server1> SELECT @@GLOBAL.gtid_executed;
  ```

Armazene o resultado em uma variável local `$original_gtid_executed`, assim como o conjunto de `gtid_purged` em outra variável local, conforme descrito anteriormente. Quando o backup de `server2` tiver sido restaurado em `server1`, execute a seguinte instrução para verificar o estado do GTID:

  ```
  server1> SELECT
        ->   GTID_IS_DISJOINT_UNION($original_gtid_executed,
        ->                          $gtid_purged_set,
        ->                          @@GLOBAL.gtid_executed);
  ```

Se o resultado for `1`, a função armazenada verificou que o conjunto original `gtid_executed` do conjunto `server1` (`$original_gtid_executed`) e o conjunto `gtid_purged` que foi adicionado do conjunto `server2` (`$gtid_purged_set`) não têm sobreposição, e que o conjunto atualizado `gtid_executed` em `server1` agora consiste no conjunto anterior `gtid_executed` do conjunto `server1` mais o conjunto `gtid_purged` do conjunto `server2`, que é o resultado desejado. Certifique-se de que essa verificação seja realizada antes que quaisquer outras transações ocorram em `server1`, caso contrário, as novas transações em `gtid_executed` fazem com que ela falhe.

**Exemplo 19.3 Selecionando a replica mais atualizada para falha manual**

A função armazenada `GTID_UNION()` pode ser usada para identificar a réplica mais atualizada de um conjunto de réplicas, a fim de realizar uma operação de falha manual após um servidor fonte ter parado inesperadamente. Se algumas das réplicas estiverem experimentando atraso na replicação, essa função armazenada pode ser usada para calcular a réplica mais atualizada sem esperar que todas as réplicas apliquem seus registros de relevo existentes, e, portanto, para minimizar o tempo de falha. A função pode retornar a união de `gtid_executed` em cada réplica com o conjunto de transações recebidas pela réplica, que é registrado na tabela do Schema de Desempenho `replication_connection_status`. Você pode comparar esses resultados para descobrir qual o registro de transações da réplica é o mais atualizado, mesmo que nem todas as transações tenham sido comprometidas ainda.

Em cada réplica, calcule o registro completo das transações emitindo a seguinte declaração:

```
SELECT GTID_UNION(RECEIVED_TRANSACTION_SET, @@GLOBAL.gtid_executed)
    FROM performance_schema.replication_connection_status
    WHERE channel_name = 'name';
```

Em seguida, você pode comparar os resultados de cada réplica para ver qual delas tem o registro mais atualizado das transações e usar essa réplica como a nova fonte.

**Exemplo 19.4 Verificando transações estranhas em uma replica**

A função armazenada `GTID_SUBTRACT_UUID()` pode ser usada para verificar se uma replica recebeu transações que não se originaram de sua fonte ou fontes designadas. Se tiver, pode haver um problema com a configuração da replicação, ou com um proxy, roteador ou balanceador de carga. Esta função funciona removendo de um conjunto de GTID todos os GTIDs de um servidor de origem especificado e retornando os GTIDs restantes, se houver.

Para uma réplica com uma única fonte, emita a seguinte declaração, fornecendo o identificador da fonte original, que normalmente é o mesmo que `server_uuid`:

```
SELECT GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed, server_uuid_of_source);
```

Se o resultado não estiver vazio, as transações devolvidas são transações adicionais que não se originaram da fonte designada.

Para uma replica em uma topologia multifonte, inclua o UUID do servidor de cada fonte na chamada da função, assim:

```
SELECT
  GTID_SUBTRACT_UUID(GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed,
                                        server_uuid_of_source_1),
                                        server_uuid_of_source_2);
```

Se o resultado não estiver vazio, as transações devolvidas são transações extras que não se originaram de nenhuma das fontes designadas.

**Exemplo 19.5 Verificando se um servidor em uma topologia de replicação é somente leitura**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para verificar se um servidor não originou nenhum GTID e está em estado de leitura somente. A função retorna apenas os GTIDs do conjunto de GTID que se originam do servidor com o identificador especificado. Se alguma das transações listadas em `gtid_executed` deste servidor usar o próprio identificador do servidor, o servidor próprio originou essas transações. Você pode emitir a seguinte declaração no servidor para verificar:

```
SELECT GTID_INTERSECTION_WITH_UUID(@@GLOBAL.gtid_executed, my_server_uuid);
```

**Exemplo 19.6 Validação de uma replica adicional na replicação de múltiplas fontes**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para descobrir se uma réplica anexada a um conjunto de replicação multifonte aplicou todas as transações originárias de uma fonte em particular. Neste cenário, `source1` e `source2` são ambas fontes e réplicas e replicam uma para a outra. `source2` também tem sua própria réplica. A réplica também recebe e aplica transações de `source1` se `source2` estiver configurado com `log_replica_updates=ON`, mas não o faz se `source2` usar `log_replica_updates=OFF`. Independentemente do caso, atualmente queremos apenas descobrir se a réplica está atualizada com `source2`. Nesta situação, `GTID_INTERSECTION_WITH_UUID()` pode ser usado para identificar as transações que `source2` originou, descartando as transações que `source2` replicou de `source1`. A função embutida `GTID_SUBSET()` pode então ser usada para comparar o resultado com o conjunto `gtid_executed` na réplica. Se a réplica estiver atualizada com `source2`, o conjunto `gtid_executed` na réplica contém todas as transações no conjunto de interseção (as transações que originaram de `source2`).

Para realizar essa verificação, armazene os valores de `gtid_executed` e o UUID do servidor de `source2` e o valor de `gtid_executed` da replica em variáveis do usuário da seguinte forma:

```
source2> SELECT @@GLOBAL.gtid_executed INTO @source2_gtid_executed;

source2> SELECT @@GLOBAL.server_uuid INTO @source2_server_uuid;

replica> SELECT @@GLOBAL.gtid_executed INTO @replica_gtid_executed;
```

Em seguida, use `GTID_INTERSECTION_WITH_UUID()` e `GTID_SUBSET()` com essas variáveis como entrada, conforme a seguir:

```
SELECT
  GTID_SUBSET(
    GTID_INTERSECTION_WITH_UUID(@source2_gtid_executed,
                                @source2_server_uuid),
                                @replica_gtid_executed);
```

O identificador do servidor de `source2` (`@source2_server_uuid`) é usado com `GTID_INTERSECTION_WITH_UUID()` para identificar e retornar apenas aqueles GTIDs do conjunto de GTIDs que se originaram em `source2`, omitindo aqueles que se originaram em `source1`. O conjunto de GTIDs resultante é então comparado com o conjunto de todos os GTIDs executados na replica, usando `GTID_SUBSET()`. Se esta declaração retornar um valor não nulo (verdadeiro), todos os GTIDs identificados de `source2` (o primeiro conjunto de entrada) também são encontrados em `gtid_executed` da replica, o que significa que a replica recebeu e executou todas as transações que se originaram de `source2`.

### 19.1.4 Mudando o modo GTID em servidores online

Esta seção descreve como alterar o modo de replicação de e para o modo GTID sem precisar fazer o servidor ficar offline.

#### 19.1.4.1 Conceitos do Modo de Replicação

Antes de definir o modo de replicação de um servidor online, é importante entender alguns conceitos-chave da replicação. Esta seção explica esses conceitos e é uma leitura essencial antes de tentar modificar o modo de replicação de um servidor online.

Os modos de replicação disponíveis no MySQL dependem de diferentes técnicas para identificar transações registradas. Os tipos de transações utilizados pela replicação estão listados aqui:

As transações GTID são identificadas por um identificador global de transação (GTID), que assume a forma `UUID:NUMBER`. Cada transação GTID no log binário é precedida por um `Gtid_log_event`. Uma transação GTID pode ser endereçada pelo seu GTID, ou pelo nome do arquivo no qual ela é registrada e sua posição dentro desse arquivo.

* Uma transação anônima não tem GTID; o MySQL 8.0 garante que cada transação anônima em um log seja precedida por um `Anonymous_gtid_log_event`. (Em versões anteriores do MySQL, uma transação anônima não era precedida por nenhum evento específico.) Uma transação anônima pode ser identificada apenas pelo nome do arquivo e pela posição.

Ao usar GTIDs, você pode aproveitar a autoposição do GTID e o failover automático, e usar as tabelas `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids` e Schema de Desempenho para monitorar transações replicadas (consulte Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”).

Uma transação em um registro de retransmissão de uma fonte que executa uma versão anterior do MySQL pode não ser precedida por nenhum evento específico, mas, após ser retransmitida e registrada no log binário da replica, é precedida por um `Anonymous_gtid_log_event`.

Para alterar o modo de replicação online, é necessário definir as variáveis `gtid_mode` e `enforce_gtid_consistency` usando uma conta que tenha privilégios suficientes para definir variáveis de sistema global; consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. Os valores permitidos para `gtid_mode` estão listados aqui, em ordem, com seus significados:

* `OFF`: Apenas transações anônimas podem ser replicadas.

* `OFF_PERMISSIVE`: Novas transações são anônimas; as transações replicadas podem ser GTID ou anônimas.

* `ON_PERMISSIVE`: Novas transações utilizam GTIDs; transações replicadas podem ser GTID ou anônimas.

* `ON`: Todas as transações devem ter GTIDs; as transações anônimas não podem ser replicadas.

É possível ter servidores que utilizam transações anônimas e servidores que utilizam transações GTID na mesma topologia de replicação. Por exemplo, uma fonte onde `gtid_mode=ON` pode replicar para uma réplica onde `gtid_mode=ON_PERMISSIVE`.

`gtid_mode` pode ser alterado apenas um passo de cada vez, com base na ordem dos valores conforme mostrado na lista anterior. Por exemplo, se `gtid_mode` estiver definido como `OFF_PERMISSIVE`, é possível alterá-lo para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`. Isso garante que o processo de mudança de transações anônimas para transações GTID online seja tratado corretamente pelo servidor; o estado GTID (ou seja, o valor de `gtid_executed`) é persistente. Isso garante que o ajuste GTID aplicado pelo servidor seja sempre mantido e correto, independentemente de quaisquer alterações no valor de `gtid_mode`.

As variáveis do sistema que exibem conjuntos de GTID, como `gtid_executed` e `gtid_purged`, a coluna `RECEIVED_TRANSACTION_SET` da tabela do Gerenciamento de Desempenho `replication_connection_status`, e os resultados relacionados a GTID na saída de `SHOW REPLICA STATUS` retornam todas as strings vazias quando não há GTID presentes. As fontes de informações sobre um único GTID, como as informações exibidas na coluna `CURRENT_TRANSACTION` da tabela do Gerenciamento de Desempenho `replication_applier_status_by_worker`, mostram `ANONYMOUS` quando as transações de GTID não estão em uso.

A replicação a partir de uma fonte que utiliza `gtid_mode=ON` permite a utilização do posicionamento automático do GTID, configurado usando a opção `SOURCE_AUTO_POSITION` da declaração `CHANGE REPLICATION SOURCE TO`. A topologia de replicação em uso tem impacto sobre a possibilidade de habilitar o posicionamento automático ou não, uma vez que essa funcionalidade depende dos GTIDs e não é compatível com transações anônimas. É altamente recomendável garantir que não haja transações anônimas restantes na topologia antes de habilitar o posicionamento automático; veja a Seção 19.1.4.2, “Habilitar Transações GTID Online”.

As combinações válidas de `gtid_mode` e autoposicionamento em fonte e réplica são mostradas na tabela a seguir. O significado de cada entrada é o seguinte:

* `Y`: Os valores de `gtid_mode` na fonte e na réplica são compatíveis.

* `N`: Os valores de `gtid_mode` na fonte e na réplica não são compatíveis.

* `*`: A autoposição pode ser usada com essa combinação de valores.

**Tabela 19.1 Combinações válidas de fonte e replicação gtid_mode**

<table summary="Explains compatible (Y) and incompatible (N) combinations of source and replica GTID mode. An asterisk (*) indicates that auto-positioning can be used with this combination of GTID modes."><col style="width: 26%"/><col style="width: 12%"/><col style="width: 24%"/><col style="width: 24%"/><col style="width: 12%"/><thead><tr> <th scope="col"><p> <code>gtid_mode</code> </p></th> <th scope="col"><p> Source <code>OFF</code> </p></th> <th scope="col"><p> Source <code>OFF_PERMISSIVE</code> </p></th> <th scope="col"><p> Source <code>ON_PERMISSIVE</code> </p></th> <th scope="col"><p> Source <code>ON</code> </p></th> </tr></thead><tbody><tr> <th scope="row"><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th scope="row"><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th scope="row"><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th scope="row"><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr></tbody></table>

O valor atual de `gtid_mode` também afeta `gtid_next`. A tabela a seguir mostra o comportamento do servidor para combinações de diferentes valores de `gtid_mode` e `gtid_next`. O significado de cada entrada é o seguinte:

* `ANONYMOUS`: Gerar uma transação anônima.

* `Error`: Gerar um erro e não executar `SET GTID_NEXT`.

* `UUID:NUMBER`: Gerar um GTID com o UUID especificado: NUMBER.

* `New GTID`: Gerar um GTID com um número gerado automaticamente.

**Tabela 19.2 Combinações válidas de gtid_mode e gtid_next**

<table summary="Explains the behavior for each of the possible combinations of GTID mode and setting for the gtid_next variable. With gtid_next set to AUTOMATIC, the behavior also varies depending on whether binary logging is enabled or disabled."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"></th> <th scope="col"><p> <code>gtid_next</code> AUTOMATIC </p><p> binary log on </p></th> <th scope="col"><p> <code>gtid_next</code> AUTOMATIC </p><p> binary log off </p></th> <th scope="col"><p> <code>gtid_next</code> ANONYMOUS </p></th> <th scope="col"><p> <code>gtid_next</code> UUID:NUMBER </p></th> </tr></thead><tbody><tr> <th scope="row"><p> <code>gtid_mode</code> <code>OFF</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td>ANONYMOUS</td> <td><p> Error </p></td> </tr><tr> <th scope="row"><p> <code>gtid_mode</code> <code>OFF_PERMISSIVE</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th scope="row"><p> <code>gtid_mode</code> <code>ON_PERMISSIVE</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th scope="row"><p> <code>gtid_mode</code> <code>ON</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> Error </p></td> <td><p> UUID:NUMBER </p></td> </tr></tbody></table>

Quando o registro binário não está em uso e `gtid_next` é `AUTOMATIC`, então não é gerado nenhum GTID, o que é consistente com o comportamento das versões anteriores do MySQL.

#### 19.1.4.2 Habilitando Transações GTID Online

Esta seção descreve como habilitar transações GTID e, opcionalmente, autoposicionamento em servidores que já estão online e que utilizam transações anônimas. Esse procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores ao habilitar transações GTID, esse processo é mais fácil.

A partir do MySQL 8.0.23, você pode configurar canais de replicação para atribuir GTIDs às transações replicadas que ainda não possuem nenhum. Esse recurso permite a replicação de um servidor de origem que não usa replicação baseada em GTID para uma replica que o faça. Se for possível habilitar GTIDs no servidor de origem de replicação, conforme descrito neste procedimento, use essa abordagem em vez disso. Atribuir GTIDs é projetado para servidores de origem de replicação onde você não pode habilitar GTIDs. Para mais informações sobre essa opção, consulte a Seção 19.1.3.6, “Replicação de um servidor de origem sem GTIDs para uma replica com GTIDs”.

Antes de começar, certifique-se de que os servidores atendem às seguintes condições prévias:

* Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Você não pode habilitar transações GTID online em qualquer servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

* Todos os servidores têm `gtid_mode` definido no valor padrão `OFF`.

O procedimento a seguir pode ser interrompido a qualquer momento e, posteriormente, retomado onde estava, ou invertido ao pular para o passo correspondente da Seção 19.1.4.3, “Desabilitar Transações GTID Online”, o procedimento online para desabilitar GTIDs. Isso torna o procedimento tolerante a falhas, pois quaisquer problemas não relacionados que possam aparecer no meio do procedimento podem ser tratados como de costume, e, em seguida, o procedimento é continuado onde foi interrompido.

Nota

É crucial que você complete cada etapa antes de continuar para a próxima etapa.

Para habilitar transações GTID:

1. Em cada servidor, execute:

   ```
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN;
   ```

Deixe o servidor rodar por um tempo com a carga de trabalho normal e monitore os registros. Se este passo causar quaisquer avisos no registro, ajuste sua aplicação para que ela use apenas recursos compatíveis com GTID e não gere quaisquer avisos.

Importante

Este é o primeiro passo importante. Você deve garantir que nenhum aviso esteja sendo gerado nos registros de erro antes de passar para o próximo passo.

2. Em cada servidor, execute:

   ```
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
   ```

3. Em cada servidor, execute:

   ```
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

Não importa qual servidor execute essa declaração primeiro, mas é importante que todos os servidores completem essa etapa antes que qualquer servidor comece a próxima etapa.

4. Em cada servidor, execute:

   ```
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

Não importa qual servidor execute essa declaração primeiro.

5. Em cada servidor, espere até que a variável de status `ONGOING_ANONYMOUS_TRANSACTION_COUNT` seja zero. Isso pode ser verificado usando:

   ```
   SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT';
   ```

Nota

Em uma réplica, teoricamente é possível que mostre zero e depois novamente não zero. Isso não é um problema, basta que mostre zero uma vez.

6. Aguarde todas as transações geradas até o passo 5 serem replicadas em todos os servidores. Você pode fazer isso sem parar as atualizações: a única coisa importante é que todas as transações anônimas sejam replicadas.

Veja a Seção 19.1.4.4, “Verificação da Replicação de Transações Anônimas”, para um método de verificação de que todas as transações anônimas foram replicadas para todos os servidores.

7. Se você usar logs binários para qualquer outra finalidade que não seja replicação, por exemplo, backup e restauração em um ponto específico, espere até que não precise mais dos logs binários antigos com transações sem GTIDs.

Por exemplo, após o passo 6 ter sido concluído, você pode executar `FLUSH LOGS` no servidor onde está fazendo backups. Em seguida, você pode fazer explicitamente um backup ou esperar para a próxima iteração de qualquer rotina de backup periódico que você tenha configurado.

Idealmente, espere que o servidor elimine todos os logs binários que existiam quando o passo 6 foi concluído. Além disso, espere que qualquer backup feito antes do passo 6 expire.

Importante

Este é o segundo ponto importante. É vital entender que os registros binários que contêm transações anônimas, sem GTIDs, não podem ser usados após o próximo passo. Após este passo, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

8. Em cada servidor, execute:

   ```
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. Em cada servidor, adicione `gtid_mode=ON` e `enforce_gtid_consistency=ON` ao `my.cnf`.

Agora, você tem a garantia de que todas as transações possuem um GTID (exceto as transações geradas no passo 5 ou anteriormente, que já foram processadas). Para começar a usar o protocolo GTID, a fim de que você possa realizar falha automática posteriormente, execute o seguinte em cada replica. Opcionalmente, se você usa replicação de múltiplas fontes, faça isso para cada canal e inclua a cláusula `FOR CHANNEL channel`:

   ```
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];

   Or from MySQL 8.0.22 / 8.0.23:
   STOP REPLICA [FOR CHANNEL 'channel'];
   CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START REPLICA [FOR CHANNEL 'channel'];
   ```

#### 19.1.4.3 Desativação de Transações GTID Online

Esta seção descreve como desativar as transações GTID em servidores que já estão online. Este procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores quando desativando o modo GTID, esse procedimento é mais fácil.

O processo é semelhante ao de habilitar transações GTID enquanto o servidor está online, mas invertendo os passos. A única coisa que difere é o ponto em que você espera que as transações registradas se repliquem.

Antes de começar, certifique-se de que os servidores atendem às seguintes condições prévias:

* Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Não é possível desabilitar transações GTID online em qualquer servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

* Todos os servidores têm `gtid_mode` definido como `ON`.

* A opção `--replicate-same-server-id` não está definida em nenhum servidor. Não é possível desabilitar as transações GTID se esta opção estiver definida juntamente com a opção `--log-slave-updates` (que é a padrão) e o registro binário estiver habilitado (que também é o padrão). Sem GTIDs, essa combinação de opções causa loops infinitos na replicação circular.

1. Execute as seguintes declarações em cada replica, e, se estiver usando replicação de múltiplas fontes, faça isso para cada canal, incluindo a cláusula `FOR CHANNEL` ao usar replicação de múltiplas fontes (*MySQL 8.0.23 e posterior*):

   ```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO
     SOURCE_AUTO_POSITION = 0,
     SOURCE_LOG_FILE = 'file',
     SOURCE_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```

Você pode obter os valores para *`file`* e *`position`* a partir das colunas `relay_source_log_file` e `exec_source_log_position` no resultado de `SHOW REPLICA STATUS`. Os nomes *`file`* e *`channel`* são strings; ambos devem ser citados quando usados nas declarações `STOP REPLICA`, `CHANGE REPLICATION SOURCE TO` e `START REPLICA`.

* Antes do MySQL 8.0.23:

   ```
   STOP SLAVE [FOR CHANNEL 'channel'];

   CHANGE MASTER TO
     MASTER_AUTO_POSITION = 0,
     MASTER_LOG_FILE = 'file',
     MASTER_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START SLAVE [FOR CHANNEL 'channel'];
   ```

Neste caso, obtenha os valores para *`file`* e *`position`* das colunas `relay_source_log_file` e `exec_source_log_position` na saída de `SHOW SLAVE STATUS`. Os nomes *`file`* e *`channel`* são strings e, portanto, devem ser citados quando utilizados nas declarações de [`STOP SLAVE`](stop-slave.html "15.4.2.9 STOP SLAVE Statement"), [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") e `START SLAVE`.

2. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = OFF_PERMISSIVE;
   ```

4. Em cada servidor, espere até que o valor global de `gtid_owned` seja igual à string vazia. Isso pode ser verificado usando a declaração mostrada aqui:

   ```
   SELECT @@global.gtid_owned;
   ```

Em uma réplica, teoricamente é possível que ela esteja vazia e, em seguida, se torne preenchida novamente. Isso não é um problema; basta que o valor esteja vazio pelo menos uma vez.

5. Aguarde que todas as transações que atualmente existem em qualquer log binário sejam comprometidas em todas as réplicas. Consulte a Seção 19.1.4.4, “Verificação da Replicação de Transações Anônimas”, para um método de verificação de que todas as transações anônimas foram replicadas para todos os servidores.

6. Se você usar logs binários para qualquer outra finalidade que não seja replicação — por exemplo, para realizar backup ou restauração em um ponto no tempo —, espere até que você não precise mais de nenhum log binário antigo que contenha transações GTID.

Por exemplo, após o passo anterior ter sido concluído, você pode executar `FLUSH LOGS` no servidor onde está fazendo o backup. Em seguida, faça um backup manualmente ou espere a próxima iteração de qualquer rotina de backup periódico que você tenha configurado.

Idealmente, você deve esperar que o servidor elimine todos os logs binários que existiam quando o passo 5 foi concluído e que qualquer backup feito antes disso expire.

Você deve ter em mente que os registros que contêm transações GTID não podem ser usados após o próximo passo. Por essa razão, antes de prosseguir, você deve ter certeza de que não existem transações GTID não comprometidas em qualquer lugar da topologia.

7. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = OFF;
   ```

8. Em cada servidor, defina `gtid_mode=OFF` em `my.cnf`.

Opcionalmente, você também pode definir `enforce_gtid_consistency=OFF`. Após fazer isso, você deve adicionar `enforce_gtid_consistency=OFF` ao seu arquivo de configuração.

Se você quiser fazer uma desativação para uma versão anterior do MySQL, pode fazer isso agora, usando o procedimento normal de desativação.

#### 19.1.4.4 Verificando a Replicação de Transações Anônimas

Esta seção explica como monitorar uma topologia de replicação e verificar se todas as transações anônimas foram replicadas. Isso é útil quando você está mudando o modo de replicação online, pois você pode verificar se é seguro mudar para transações GTID.

Existem várias maneiras possíveis de esperar que as transações se repliquem:

O método mais simples, que funciona independentemente da sua topologia, mas que depende do cronometragem, é o seguinte: se você tem certeza de que a replica nunca fica mais de N segundos atrasada, basta esperar um pouco mais de N segundos. Ou espere por um dia, ou qualquer período de tempo que você considere seguro para sua implantação.

Um método mais seguro, no sentido de que não depende do momento: se você tem apenas uma fonte com uma ou mais réplicas, faça o seguinte:

1. No código fonte, execute:

   ```
   SHOW MASTER STATUS;
   ```

Anote os valores nas colunas `File` e `Position`.

2. Em cada réplica, use as informações de arquivo e posição da fonte para executar:

   ```
   SELECT MASTER_POS_WAIT(file, position);

   Or from MySQL 8.0.26:
   SELECT SOURCE_POS_WAIT(file, position);
   ```

Se você tem uma fonte e múltiplos níveis de réplicas, ou, em outras palavras, você tem réplicas de réplicas, repita o passo 2 em cada nível, começando pela fonte, depois todas as réplicas diretas, depois todas as réplicas de réplicas, e assim por diante.

Se você estiver usando uma topologia de replicação circular, onde vários servidores podem ter clientes de escrita, realize o passo 2 para cada conexão fonte-replica, até completar o círculo completo. Repita todo o processo para que você faça o círculo completo *duas vezes*.

Por exemplo, suponha que você tenha três servidores A, B e C, replicando em um círculo de modo que A → B → C → A. O procedimento é então:

* Faça o passo 1 em A e o passo 2 em B.
* Faça o passo 1 em B e o passo 2 em C.
* Faça o passo 1 em C e o passo 2 em A.
* Faça o passo 1 em A e o passo 2 em B.
* Faça o passo 1 em B e o passo 2 em C.
* Faça o passo 1 em C e o passo 2 em A.

### 19.1.5 Replicação de múltiplas fontes do MySQL

A replicação multifonte do MySQL permite que uma replica receba transações de múltiplas fontes imediatas em paralelo. Em uma topologia de replicação multifonte, uma replica cria um canal de replicação para cada fonte da qual deve receber transações. Para mais informações sobre como os canais de replicação funcionam, consulte a Seção 19.2.2, “Canais de replicação”.

Você pode optar por implementar a replicação de múltiplas fontes para alcançar objetivos como esses:

* Fazer backup de vários servidores em um único servidor. * Mesclar fragmentos de tabela. * Consolidar dados de vários servidores em um único servidor.

A replicação de múltiplas fontes não implementa detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para o aplicativo, se necessário.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Não é possível configurar vários canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, portanto, não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica de múltiplas fontes também pode ser configurada como uma replica multi-encadeada, definindo a variável de sistema `replica_parallel_workers` (a partir do MySQL 8.0.26) ou `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica de múltiplas fontes, cada canal na replica tem o número especificado de threads do aplicável, além de um thread de coordenador para gerenciá-los. Você não pode configurar o número de threads do aplicável para canais individuais.

A partir do MySQL 8.0, as réplicas de várias fontes podem ser configuradas com filtros de replicação em canais de replicação específicos. Os filtros de replicação específicos de canal podem ser usados quando o mesmo banco de dados ou tabela está presente em várias fontes e você só precisa que a réplica o replique de uma fonte. Para a replicação baseada em GTID, se a mesma transação pode chegar de várias fontes (como em uma topologia em forma de diamante), você deve garantir que a configuração de filtragem seja a mesma em todos os canais. Para mais informações, consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”.

Esta seção fornece tutoriais sobre como configurar fontes e réplicas para replicação de múltiplas fontes, como iniciar, parar e reiniciar réplicas de múltiplas fontes, e como monitorar a replicação de múltiplas fontes.

#### 19.1.5.1 Configurando a Replicação de Múltiplas Fontes

Uma topologia de replicação de múltiplas fontes requer pelo menos duas fontes e uma replica configurada. Nesses tutoriais, assumimos que você tem duas fontes `source1` e `source2`, e uma replica `replicahost`. A replica replica um banco de dados de cada uma das fontes, `db1` de `source1` e `db2` de `source2`.

Fontes em uma topologia de replicação de múltiplas fontes podem ser configuradas para usar replicação baseada em GTID ou replicação baseada na posição do log binário. Veja a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”, para saber como configurar uma fonte usando replicação baseada em GTID. Veja a Seção 19.1.2.1, “Configurando a Configuração da Fonte de Replicação”, para saber como configurar uma fonte usando replicação baseada na posição do arquivo.

As réplicas em uma topologia de replicação de múltiplas fontes requerem os repositórios `TABLE` para o repositório de metadados de conexão da réplica e o repositório de metadados do aplicável, que são os padrões no MySQL 8.0. A replicação de múltiplas fontes não é compatível com os repositórios de arquivos alternativos obsoletos.

Crie uma conta de usuário adequada em todas as fontes que a replica pode usar para se conectar. Você pode usar a mesma conta em todas as fontes ou uma conta diferente em cada uma. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `ted`, que pode se conectar a partir da replica `replicahost`, use o cliente **mysql** para emitir essas declarações em cada uma das fontes:

```
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

Para mais detalhes e informações importantes sobre o plugin de autenticação padrão para novos usuários do MySQL 8.0, consulte a Seção 19.1.2.3, “Criando um Usuário para Replicação”.

#### 19.1.5.2  Provisão de uma réplica de múltiplas fontes para replicação baseada em GTID

Se as fontes na topologia de replicação multifonte tiverem dados existentes, pode-se economizar tempo ao provisionar a replica com os dados relevantes antes de começar a replicação. Em uma topologia de replicação multifonte, não é possível usar clonagem ou cópia do diretório de dados para provisionar a replica com dados de todas as fontes, e você também pode querer replicar apenas bancos de dados específicos de cada fonte. A melhor estratégia para provisionar uma replica desse tipo é, portanto, usar **mysqldump** para criar um arquivo de dump apropriado em cada fonte, e depois usar o cliente **mysql** para importar o arquivo de dump na replica.

Se você estiver usando replicação baseada em GTID, precisa prestar atenção à declaração `SET @@GLOBAL.gtid_purged` que o **mysqldump** coloca na saída do dump. Essa declaração transfere os GTIDs para as transações executadas na fonte para a replica, e a replica requer essas informações. No entanto, para qualquer caso mais complexo do que provisionar uma nova replica vazia a partir de uma fonte, você precisa verificar qual efeito a declaração tem na versão do MySQL usada pela replica e lidar com a declaração conforme necessário. O seguinte guia resume as ações adequadas, mas, para mais detalhes, consulte a documentação do **mysqldump**.

O comportamento da declaração `SET @@GLOBAL.gtid_purged` escrita pelo **mysqldump** é diferente nas versões do MySQL 8.0 em comparação com o MySQL 5.6 e 5.7. No MySQL 5.6 e 5.7, a declaração substitui o valor de `gtid_purged` na réplica, e também, nessas versões, esse valor só pode ser alterado quando o registro de transações da réplica com GTIDs (o conjunto `gtid_executed`) está vazio. Em uma topologia de replicação de múltiplas fontes, portanto, você deve remover a declaração `SET @@GLOBAL.gtid_purged` do resultado do dump antes de refazer os arquivos de dump, porque você não pode aplicar um segundo ou arquivo de dump subsequente que inclua essa declaração. Além disso, observe que, para o MySQL 5.6 e 5.7, essa limitação significa que todos os arquivos de dump das fontes devem ser aplicados em uma única operação em uma réplica com um conjunto `gtid_executed` vazio. Você pode limpar o histórico de execução do GTID de uma réplica emitindo `RESET MASTER` na réplica, mas se você tiver outras transações desejadas com GTIDs na réplica, escolha um método alternativo de provisionamento descrito na Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”.

A partir do MySQL 8.0, a declaração `SET @@GLOBAL.gtid_purged` adiciona o conjunto de GTID do arquivo de dump ao conjunto existente de `gtid_purged` na replica. Portanto, a declaração pode potencialmente ser deixada na saída do dump quando você reproduzir os arquivos de dump na replica, e os arquivos de dump podem ser reproduzidos em diferentes momentos. No entanto, é importante notar que o valor que é incluído pelo **mysqldump** para a declaração `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto de `gtid_executed` na fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos no servidor que não foram incluídos em um dump parcial. Se você reproduzir um segundo ou arquivo de dump subsequente na replica que contém algum dos mesmos GTIDs (por exemplo, outro dump parcial da mesma fonte, ou um dump de outra fonte que tem transações sobrepostas), qualquer declaração `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falha e, portanto, deve ser removida da saída do dump.

Para fontes do MySQL 8.0.17, como alternativa à remoção da declaração `SET @@GLOBAL.gtid_purged`, você pode definir a opção `--set-gtid-purged` do **mysqldump** para `COMMENTED` para incluir a declaração, mas com comentários, para que ela não seja executada ao carregar o arquivo de dump. Se você está provisionando a replica com dois dumps parciais da mesma fonte, e o GTID definido no segundo dump é o mesmo que o primeiro (para que não tenham sido executadas novas transações na fonte entre os dumps), você pode definir a opção `--set-gtid-purged` do **mysqldump** para `OFF` ao gerar o segundo arquivo de dump, para omitir a declaração.

No exemplo de provisionamento a seguir, assumimos que a declaração `SET @@GLOBAL.gtid_purged` não pode ser deixada na saída do dump e deve ser removida dos arquivos e tratada manualmente. Também assumimos que não há transações desejadas com GTIDs na replica antes do início do provisionamento.

1. Para criar arquivos de depuração para um banco de dados denominado `db1` em `source1` e um banco de dados denominado `db2` em `source2`, execute o **mysqldump** para `source1` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

Em seguida, execute o **mysqldump** para `source2` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor `gtid_purged` que o **mysqldump** adicionou a cada um dos arquivos de dump. Por exemplo, para arquivos de dump criados no MySQL 5.6 ou 5.7, você pode extrair o valor da seguinte forma:

   ```
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

A partir do MySQL 8.0, onde o formato mudou, você pode extrair o valor da seguinte forma:

   ```
   cat dumpM1.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

O resultado em cada caso deve ser um conjunto de GTID, por exemplo:

   ```
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a linha de cada arquivo de dump que contém a declaração `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente **mysql** para importar cada arquivo de dump editado na replica. Por exemplo:

   ```
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na replica, emita `RESET MASTER` para limpar o histórico de execução do GTID (assumindo, como explicado acima, que todos os arquivos de depuração foram importados e que não há transações desejadas com GTIDs na replica). Em seguida, emita uma declaração `SET @@GLOBAL.gtid_purged` para definir o valor do `gtid_purged` na união de todos os conjuntos de GTID de todos os arquivos de depuração, conforme registrado no Passo 2. Por exemplo:

   ```
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

Se houver, ou houver possibilidade de, transações sobrepostas entre os conjuntos de GTID nos arquivos de dump, você pode usar as funções armazenadas descritas na Seção 19.1.3.8, “Exemplos de Função Armazenada para Manipular GTIDs”, para verificar isso previamente e calcular a união de todos os conjuntos de GTID.

#### 19.1.5.3 Adicionando fontes com base em GTID a uma réplica de múltiplas fontes

Esses passos pressupõem que você tenha habilitado GTIDs para transações nas fontes usando `gtid_mode=ON`, criado um usuário de replicação, garantido que a replica esteja usando repositórios de metadados do aplicativo de replicação com base em `TABLE` e, se apropriado, provisionou a replica com dados das fontes.

Utilize a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) para configurar um canal de replicação para cada fonte na replica (consulte Seção 19.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Para a replicação com base em GTID, o posicionamento automático do GTID é usado para sincronizar com a fonte (consulte Seção 19.1.3.3, “Posicionamento Automático do GTID”). A opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` é definida para especificar o uso do posicionamento automático.

Por exemplo, para adicionar `source1` e `source2` como fontes para a replica, use o cliente **mysql** para emitir a declaração duas vezes na replica, como este:

```
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", \
SOURCE_PASSWORD="password", SOURCE_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para fazer a replicação da réplica apenas do banco de dados `db1` de `source1`, e apenas do banco de dados `db2` de `source2`, use o cliente **mysql** para emitir a declaração `CHANGE REPLICATION FILTER` para cada canal, assim:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE REPLICATION FILTER`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement") e outras opções disponíveis, consulte a Seção 15.4.2.2, “Declaração de REPLICAÇÃO DE ALTERAÇÕES”.

#### 19.1.5.4 Adicionando fontes de replicação com registro binário como base a uma replica multifonte

Esses passos pressupem que o registro binário está habilitado na fonte (o que é o padrão), a replica está usando os repositórios de metadados do aplicativo de aplicação de replicação `TABLE` (o que é o padrão no MySQL 8.0) e que você habilitou um usuário de replicação e anotou o nome e a posição atuais do arquivo de registro binário.

Utilize a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) para configurar um canal de replicação para cada fonte na replica (consulte a Seção 19.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Por exemplo, para adicionar `source1` e `source2` como fontes na replica, use o cliente **mysql** para emitir a declaração duas vezes na replica, como este:

```
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source1", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source1-bin.000006', SOURCE_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST="source2", SOURCE_USER="ted", SOURCE_PASSWORD="password", \
SOURCE_LOG_FILE='source2-bin.000018', SOURCE_LOG_POS=104 FOR CHANNEL "source_2";
```

Para fazer a replicação da réplica apenas do banco de dados `db1` de `source1`, e apenas do banco de dados `db2` de `source2`, use o cliente **mysql** para emitir a declaração `CHANGE REPLICATION FILTER` para cada canal, assim:

```
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db1.%') FOR CHANNEL "source_1";
mysql> CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE = ('db2.%') FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE REPLICATION FILTER`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement") e outras opções disponíveis, consulte a Seção 15.4.2.2, “Declaração de REPLICAÇÃO DE ALTERAÇÕES”.

#### 19.1.5.5 Início das Replicas de Múltiplos Fontes

Depois de adicionar canais para todas as fontes de replicação, emita uma declaração `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`) para iniciar a replicação. Quando você habilitou vários canais em uma replica, pode optar por iniciar todos os canais ou selecionar um canal específico para iniciar. Por exemplo, para iniciar os dois canais separadamente, use o cliente **mysql** para emitir as seguintes declarações:

```
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
Or from MySQL 8.0.22:
mysql> START REPLICA FOR CHANNEL "source_1";
mysql> START REPLICA FOR CHANNEL "source_2";
```

Para a sintaxe completa do comando `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") e outras opções disponíveis, consulte a Seção 15.4.2.6, “Declaração START REPLICA”.

Para verificar se ambos os canais começaram e estão operando corretamente, você pode emitir declarações `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") na réplica, por exemplo:

```
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
Or from MySQL 8.0.22:
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_1"\G
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_2"\G
```

#### 19.1.5.6 Parar as Replicas de Múltiplos Fontes

A declaração `STOP REPLICA` pode ser usada para interromper uma replica de múltiplas fontes. Por padrão, se você usar a declaração `STOP REPLICA` em uma replica de múltiplas fontes, todos os canais são interrompidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para interromper apenas um canal específico.

* Para parar todos os canais de replicação configurados atualmente:

  ```
  mysql> STOP SLAVE;
  Or from MySQL 8.0.22:
  mysql> STOP REPLICA;
  ```

* Para interromper apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```
  mysql> STOP SLAVE FOR CHANNEL "source_1";
  Or from MySQL 8.0.22:
  mysql> STOP REPLICA FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement") e outras opções disponíveis, consulte a Seção 15.4.2.8, “Declaração STOP REPLICA”.

#### 19.1.5.7 Redefinindo Replicas de Múltiplas Fontes

A declaração `RESET REPLICA` pode ser usada para redefinir uma replica de múltiplas fontes. Por padrão, se você usar a declaração `RESET REPLICA` em uma replica de múltiplas fontes, todos os canais são redefinidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para redefinir apenas um canal específico.

* Para redefinir todos os canais de replicação configurados atualmente:

  ```
  mysql> RESET SLAVE;
  Or from MySQL 8.0.22:
  mysql> RESET REPLICA;
  ```

* Para redefinir apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```
  mysql> RESET SLAVE FOR CHANNEL "source_1";
  Or from MySQL 8.0.22:
  mysql> RESET REPLICA FOR CHANNEL "source_1";
  ```

Para a replicação baseada em GTID, observe que `RESET REPLICA`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") não afeta o histórico de execução do GTID da replica. Se você deseja limpar isso, execute `RESET MASTER` na replica.

`RESET REPLICA` faz com que a replica esqueça sua posição de replicação e limpe o log do relé, mas não altera nenhum parâmetro de conexão de replicação (como o nome do host de origem) ou filtros de replicação. Se você deseja remover esses parâmetros para um canal, execute `RESET REPLICA ALL` (reset-replica.html "15.4.2.4 RESET REPLICA Statement").

Para a sintaxe completa do comando `RESET REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.4, “Instrução RESET REPLICA”.

#### 19.1.5.8 Monitoramento da Replicação de Múltiplos Fontes

Para monitorar o status dos canais de replicação, existem as seguintes opções:

* Usando as tabelas do Schema de desempenho de replicação. A primeira coluna dessas tabelas é `Channel_Name`. Isso permite que você escreva consultas complexas com base em `Channel_Name` como chave. Veja a Seção 29.12.11, “Tabelas de replicação do Schema de desempenho”.

* Usando `SHOW REPLICA STATUS FOR CHANNEL channel`. Por padrão, se a cláusula `FOR CHANNEL channel` não for usada, esta declaração mostra o status da replicação para todos os canais com uma linha por canal. O identificador `Channel_name` é adicionado como uma coluna no conjunto de resultados. Se for fornecida uma cláusula `FOR CHANNEL channel`, os resultados mostram o status apenas do canal de replicação nomeado.

Nota

A declaração `SHOW VARIABLES` não funciona com múltiplos canais de replicação. As informações que estavam disponíveis através dessas variáveis foram migradas para as tabelas de desempenho de replicação. Usar uma declaração `SHOW VARIABLES` em uma topologia com múltiplos canais mostra o status apenas do canal padrão.

Os códigos de erro e as mensagens emitidas quando a replicação de múltiplas fontes está habilitada especificam o canal que gerou o erro.

##### 19.1.5.8.1 Monitoramento de canais usando tabelas do Schema de desempenho

Esta seção explica como usar as tabelas do Schema de desempenho de replicação para monitorar canais. Você pode optar por monitorar todos os canais ou um subconjunto dos canais existentes.

Para monitorar o status de conexão de todos os canais:

```
mysql> SELECT * FROM replication_connection_status\G;
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
*************************** 2. row ***************************
CHANNEL_NAME: source_2
GROUP_NAME:
SOURCE_UUID: 7475e474-a223-11e4-a978-0811960cc264
THREAD_ID: 26
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 7475e474-a223-11e4-a978-0811960cc264:4-6
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
2 rows in set (0.00 sec)
```

No resultado acima, há dois canais habilitados, e como mostrado pelo campo `CHANNEL_NAME`, eles são chamados de `source_1` e `source_2`.

A adição do campo `CHANNEL_NAME` permite que você consulte as tabelas do Gerador de Desempenho para um canal específico. Para monitorar o estado da conexão de um canal nomeado, use uma cláusula `WHERE CHANNEL_NAME=channel`:

```
mysql> SELECT * FROM replication_connection_status WHERE CHANNEL_NAME='source_1'\G
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
1 row in set (0.00 sec)
```

Da mesma forma, a cláusula `WHERE CHANNEL_NAME=channel` pode ser usada para monitorar as outras tabelas do Schema de desempenho de replicação para um canal específico. Para mais informações, consulte a Seção 29.12.11, “Tabelas de replicação do Schema de desempenho”.

### 19.1.6 Opções e variáveis de replicação e registro binário

As seções a seguir contêm informações sobre as opções do **mysqld** e as variáveis do servidor que são usadas na replicação e para controlar o log binário. As opções e variáveis para uso em fontes e réplicas são abordadas separadamente, assim como as opções e variáveis relacionadas ao registro binário e identificadores de transação global (GTIDs). Um conjunto de tabelas de referência rápida que fornecem informações básicas sobre essas opções e variáveis também está incluído.

De particular importância é a variável de sistema `server_id`.

<table frame="box" rules="all" summary="Properties for server_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--server-id=#</code></td> </tr><tr><th>System Variable</th> <td><code>server_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Essa variável especifica o ID do servidor. `server_id` é definido como 1 por padrão. O servidor pode ser iniciado com esse ID padrão, mas quando o registro binário está habilitado, uma mensagem informativa é emitida se você não tiver especificado explicitamente `server_id` para especificar um ID de servidor.

Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único para cada servidor de replicação, na faixa de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todas as outras IDs usadas por qualquer outra fonte ou réplica na topologia de replicação. Para informações adicionais, consulte a Seção 19.1.6.2, “Opções e Variáveis de Fonte de Replicação”, e a Seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

Se o ID do servidor estiver definido como 0, o registro binário ocorre, mas uma fonte com um ID de servidor de 0 recusa quaisquer conexões de réplicas, e uma réplica com um ID de servidor de 0 recusa-se a se conectar a uma fonte. Note que, embora você possa alterar o ID do servidor dinamicamente para um valor não nulo, isso não permite que a replicação comece imediatamente. Você deve alterar o ID do servidor e, em seguida, reiniciar o servidor para inicializar a réplica.

Para mais informações, consulte a Seção 19.1.2.2, “Definindo a configuração de replicação”.

`server_uuid`

O servidor MySQL gera um UUID verdadeiro, além do ID de servidor padrão ou fornecido pelo usuário definido na variável de sistema `server_id`. Isso está disponível como a variável global, somente de leitura `server_uuid`.

Nota

A presença da variável de sistema `server_uuid` não altera a exigência de definir um valor único `server_id` para cada servidor MySQL como parte da preparação e execução da replicação do MySQL, conforme descrito anteriormente nesta seção.

<table frame="box" rules="all" summary="Properties for server_uuid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>server_uuid</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Ao iniciar, o servidor MySQL obtém automaticamente uma UUID da seguinte forma:

1. Tente ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde *`data_dir`* é o diretório de dados do servidor).

2. Se o `data_dir/auto.cnf` não for encontrado, gere um novo UUID e salve-o neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` tem um formato semelhante ao utilizado para os arquivos `my.cnf` ou `my.ini`. O `auto.cnf` tem apenas uma única seção `[auto]` contendo um único ajuste e valor `server_uuid`; o conteúdo do arquivo parece semelhante ao mostrado aqui:

```
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a replicação do MySQL, as fontes e as réplicas conhecem os UUIDs das outras. O valor do UUID de uma réplica pode ser visto na saída do `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS` (show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement")). Uma vez que o `START REPLICA` tenha sido executado, o valor do UUID da fonte estará disponível na réplica na saída do `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). (No MySQL 8.0.22, a palavra-chave `SLAVE` foi substituída por `REPLICA`.)

Nota

Emitir uma declaração `STOP REPLICA` ou `RESET REPLICA` *não* redefiniu o UUID da fonte conforme utilizado na replica.

O `server_uuid` de um servidor também é usado em GTIDs para transações que têm origem nesse servidor. Para mais informações, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

Ao iniciar, o thread de I/O de replicação (receptor) gera um erro e é abortado se o UUID da fonte for igual ao seu, a menos que a opção `--replicate-same-server-id` tenha sido definida. Além disso, o thread de receptor de replicação gera uma advertência se qualquer um dos seguintes for verdadeiro:

* Não existe nenhuma fonte com o `server_uuid` esperado.

* A fonte `server_uuid` do autor mudou, embora nenhuma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") tenha sido executada.

#### 19.1.6.1 Opção de replicação e registro binário e referência de variáveis

As duas seções seguintes fornecem informações básicas sobre as opções de linha de comando do MySQL e as variáveis do sistema aplicáveis à replicação e ao log binário.

##### Opções e variáveis de replicação

As opções de linha de comando e as variáveis do sistema na lista a seguir se relacionam aos servidores de origem de replicação e réplicas. A Seção 19.1.6.2, “Opções e Variáveis de Origem de Replicação”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas aos servidores de origem de replicação. Para mais informações sobre as opções e variáveis relacionadas às réplicas, consulte a Seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

* `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `auto_increment_increment`: As colunas AUTO_INCREMENT são incrementadas por este valor.

* `auto_increment_offset`: O deslocamento foi adicionado às colunas AUTO_INCREMENT.

* `Com_change_master`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES PARA e ALCANCE MASTER para mudança.

* `Com_change_replication_source`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES PARA e ALTERAÇÃO DO MESTRE EM.

* `Com_replica_start`: Contagem de declarações de START REPLICA e START SLAVE.

* `Com_replica_stop`: Contagem de declarações de STOP REPLICA e STOP SLAVE.

* `Com_show_master_status`: Contagem de declarações de STATUS do SHOW MASTER.

* `Com_show_replica_status`: Contagem de declarações de SHOW REPLICA STATUS e SHOW SLAVE STATUS.

* `Com_show_replicas`: Contagem de REPLICAS mostrada e HOSTS escravos mostrados em declarações.

* `Com_show_slave_hosts`: Contagem de REPLICAS mostrada e HOSTS escravos mostrados em declarações.

* `Com_show_slave_status`: Contagem de declarações de SHOW REPLICA STATUS e SHOW SLAVE STATUS.

* `Com_slave_start`: Contagem de declarações de START REPLICA e START SLAVE.

* `Com_slave_stop`: Contagem de declarações de STOP REPLICA e STOP SLAVE.

* `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `enforce_gtid_consistency`: Previne a execução de declarações que não podem ser registradas de forma segura em transação.

* `expire_logs_days`: Limpe os logs binários após tantos dias.

* `gtid_executed`: Global: Todos os GTIDs no log binário (global) ou na transação atual (sessão). Apenas leitura.

* `gtid_executed_compression_period`: Compress gtid_executed tabela cada vez que ocorrer esse número de transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado.

* `gtid_mode`: Controla se o registro baseado em GTID está habilitado e quais tipos de registros de transações podem conter.

* `gtid_next`: Especifica GTID para transação ou transações subsequentes; consulte a documentação para detalhes.

* `gtid_owned`: Conjunto de GTIDs de propriedade deste cliente (sessão), ou de todos os clientes, juntamente com o ID de fio do proprietário (global). Apenas para leitura.

* `gtid_purged`: Conjunto de todos os GTIDs que foram eliminados do log binário.

* `immediate_server_version`: Número de lançamento do servidor MySQL do servidor que é a fonte de replicação imediata.

* `init_replica`: Declarações que são executadas quando a replica se conecta à fonte.

* `init_slave`: Declarações que são executadas quando a replica se conecta à fonte.

* `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando o --log-bin é usado, a criação de funções armazenadas é permitida apenas para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário.

* `log_statements_unsafe_for_binlog`: Desativa as advertências do erro 1592 que estão sendo escritas no log de erro.

* `master-info-file`: Local e nome do arquivo que lembra a origem e onde o fio de replicação de E/S está no log binário da origem.

* `master-retry-count`: Número de tentativas que a réplica faz para se conectar à fonte antes de desistir.

* `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações de origem e localização do fio de I/O de replicação no log binário da fonte, em arquivo ou tabela.

* `max_relay_log_size`: Se não for nulo, o log do relé é rotado automaticamente quando seu tamanho excede esse valor. Se for zero, o tamanho em que a rotação ocorre é determinado pelo valor de max_binlog_size.

* `original_commit_timestamp`: Hora em que a transação foi realizada na fonte original.

* `original_server_version`: Número de versão do servidor MySQL do qual a transação foi originalmente comprometida.

* `relay_log`: Localização e nome de base a serem usados para os logs de retransmissão.

* `relay_log_basename`: Caminho completo para o log do relé, incluindo o nome do arquivo.

* `relay_log_index`: Localização e nome a serem usados para o arquivo que mantém a lista dos últimos logs do relé.

* `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo, no qual os registros replicam informações sobre os registros de retransmissão.

* `relay_log_info_repository`: Se deve escrever a localização do fio de replicação SQL nos logs do relé em arquivo ou tabela.

* `relay_log_purge`: Determina se os registros do relé são limpos.

* `relay_log_recovery`: Se a recuperação automática dos arquivos de registro do relé da fonte ao iniciar é habilitada; deve ser habilitada para replica segura em caso de falha.

* `relay_log_space_limit`: Espaço máximo a ser utilizado para todos os registros de relé.

* `replica_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

* `replica_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay para disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `replica_compressed_protocol`: Use compressão do protocolo de fonte/replica.

* `replica_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

* `replica_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

* `replica_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem de replicação para a réplica; substitui max_allowed_packet.

* `replica_net_timeout`: Número de segundos para esperar mais dados da conexão da fonte/replica antes de abortar a leitura.

* `Replica_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto.

* `replica_parallel_type`: Diz ao replica que use informações de marcação de tempo (CLOCK_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

* `replica_parallel_workers`: Número de threads do aplicativo para executar transações de replicação. NDB Cluster: consulte a documentação.

* `replica_pending_jobs_size_max`: Tamanho máximo das filas de replicação de trabalhadores que retêm eventos ainda não aplicados.

* `replica_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela.

* `Replica_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linha (índice, tabela ou varredura hash).

* `replica_skip_errors`: Diz ao fio de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

* `replica_transaction_retries`: Número de vezes que o fio de replicação SQL refaz a transação no caso de ela falhar com bloqueio em espera de timeout, antes de desistir e parar.

* `replica_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina uma string vazia para não permitir conversões de tipo entre a fonte e a replica.

* `replicate-do-db`: Diga ao thread de replicação SQL para restringir a replicação ao banco de dados especificado.

* `replicate-do-table`: Diga ao thread de replicação SQL que restrinja a replicação à tabela especificada.

* `replicate-ignore-db`: Diz ao thread de replicação SQL que não replique para o banco de dados especificado.

* `replicate-ignore-table`: Diz ao thread de replicação SQL que não replique para a tabela especificada.

* `replicate-rewrite-db`: Atualizações no banco de dados com um nome diferente do original.

* `replicate-same-server-id`: Na replicação, se habilitada, não ignore eventos com nosso ID do servidor.

* `replicate-wild-do-table`: Diga ao thread de replicação SQL que restrinja a replicação às tabelas que correspondem ao padrão de caracteres curinga especificado.

* `replicate-wild-ignore-table`: Diga ao thread de replicação SQL que não replique para tabelas que correspondem ao padrão de caracteres curinga fornecido.

* `replication_optimize_for_static_plugin_config`: Lâminas compartilhadas para replicação semiesincronizada.

* `replication_sender_observe_commit_only`: Chamadas de retorno limitadas para replicação semiesincrônica.

* `report_host`: Nome de host ou IP da réplica a ser relatada à fonte durante o registro da réplica.

* `report_password`: Senha arbitrária que o servidor replicador deve informar à fonte; não é a mesma senha da conta de usuário de replicação.

* `report_port`: Porta para conectar-se à replica relatada à fonte durante o registro da replica.

* `report_user`: Nome de usuário arbitrário ao qual o servidor de replicação deve relatar a fonte; não é o mesmo nome usado para a conta de usuário de replicação.

* `rpl_read_size`: Defina o valor mínimo de dados em bytes que são lidos dos arquivos de registro binários e dos arquivos de registro de relevo.

* `Rpl_semi_sync_master_clients`: Número de réplicas semi-síncronas.

* `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

* `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica.

* `Rpl_semi_sync_master_net_wait_time`: O tempo total que a fonte de resposta esperou por respostas da réplica.

* `Rpl_semi_sync_master_net_waits`: Número total de vezes que a fonte esperou respostas da réplica.

* `Rpl_semi_sync_master_no_times`: Número de vezes que a fonte desligou a replicação semisíncrona.

* `Rpl_semi_sync_master_no_tx`: Número de compromissos que não foram reconhecidos com sucesso.

* `Rpl_semi_sync_master_status`: Se a replicação semi-sincronizada está operacional na fonte.

* `Rpl_semi_sync_master_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo.

* `rpl_semi_sync_master_timeout`: Número de milissegundos para esperar o reconhecimento da réplica.

* `rpl_semi_sync_master_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada na fonte.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

* `Rpl_semi_sync_master_tx_wait_time`: Tempo total que a fonte de transações esperou.

* `Rpl_semi_sync_master_tx_waits`: Número total de vezes que a fonte esperou por transações.

* `rpl_semi_sync_master_wait_for_slave_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir.

* `rpl_semi_sync_master_wait_no_slave`: Se a fonte espera o tempo limite mesmo sem réplicas.

* `rpl_semi_sync_master_wait_point`: Ponto de espera para o reconhecimento do recebimento da transação replicada.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente.

* `Rpl_semi_sync_master_wait_sessions`: Número de sessões que estão atualmente aguardando respostas replicadas.

* `Rpl_semi_sync_master_yes_tx`: Número de compromissos reconhecidos com sucesso.

* `rpl_semi_sync_replica_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

* `Rpl_semi_sync_replica_status`: Se a replicação semi-sincronizada está operacional na replica.

* `rpl_semi_sync_replica_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada no replica.

* `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

* `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional na replica.

* `rpl_semi_sync_slave_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada no replica.

* `Rpl_semi_sync_source_clients`: Número de réplicas semi-síncronas.

* `rpl_semi_sync_source_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

* `Rpl_semi_sync_source_net_avg_wait_time`: Tempo médio que a fonte de dados esperou por respostas da réplica.

* `Rpl_semi_sync_source_net_wait_time`: O tempo total que a fonte de replicação esperou por respostas.

* `Rpl_semi_sync_source_net_waits`: Número total de vezes que a fonte esperou respostas da réplica.

* `Rpl_semi_sync_source_no_times`: Número de vezes que a fonte desligou a replicação semisíncrona.

* `Rpl_semi_sync_source_no_tx`: Número de compromissos que não foram reconhecidos com sucesso.

* `Rpl_semi_sync_source_status`: Se a replicação semi-sincronizada está operacional na fonte.

* `Rpl_semi_sync_source_timefunc_failures`: Número de vezes que a fonte falhou ao chamar funções de tempo.

* `rpl_semi_sync_source_timeout`: Número de milissegundos para esperar o reconhecimento da réplica.

* `rpl_semi_sync_source_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada na fonte.

* `Rpl_semi_sync_source_tx_avg_wait_time`: Tempo médio que a fonte esperou por cada transação.

* `Rpl_semi_sync_source_tx_wait_time`: Tempo total que a fonte de transações esperou.

* `Rpl_semi_sync_source_tx_waits`: Número total de vezes que a fonte esperou por transações.

* `rpl_semi_sync_source_wait_for_replica_count`: Número de confirmações de replicação que a fonte deve receber por transação antes de prosseguir.

* `rpl_semi_sync_source_wait_no_replica`: Se a fonte espera o tempo limite mesmo sem réplicas.

* `rpl_semi_sync_source_wait_point`: Ponto de espera para o reconhecimento do recebimento da transação replicada.

* `Rpl_semi_sync_source_wait_pos_backtraverse`: Número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente.

* `Rpl_semi_sync_source_wait_sessions`: Número de sessões atualmente aguardando respostas replicadas.

* `Rpl_semi_sync_source_yes_tx`: Número de compromissos reconhecidos com sucesso.

* `rpl_stop_replica_timeout`: Número de segundos que o STOP REPLICA espera antes de expirar o tempo.

* `rpl_stop_slave_timeout`: Número de segundos que o STOP REPLICA ou o STOP SLAVE espera antes de expirar o tempo.

* `server_uuid`: ID globalmente único do servidor, automaticamente (re)gerado no início do servidor.

* `show-replica-auth-info`: Mostre o nome do usuário e a senha na opção "REPLICAS" nesta fonte.

* `show-slave-auth-info`: Mostre o nome do usuário e a senha nas opções de REPLICAS e HOSTS DE ESCLAVA nesta fonte.

* `skip-replica-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

* `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

* `slave-skip-errors`: Diga ao thread de replicação que continue a replicação quando a consulta retorna um erro da lista fornecida.

* `slave_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

* `slave_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay para disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `slave_compressed_protocol`: Use compressão do protocolo de fonte/replica.

* `slave_exec_mode`: Permite alternar o fio de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

* `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

* `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem de replicação para a réplica; substitui max_allowed_packet.

* `slave_net_timeout`: Número de segundos para esperar mais dados da conexão de fonte/replica antes de abortar a leitura.

* `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto.

* `slave_parallel_type`: Diz ao replica que use informações de marcação de tempo (CLOCK_LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

* `slave_parallel_workers`: Número de threads do aplicativo para executar transações de replicação em paralelo; 0 ou 1 desativa a replicação multithreading. NDB Cluster: consulte a documentação.

* `slave_pending_jobs_size_max`: Tamanho máximo das filas de replicação de trabalhadores que retêm eventos ainda não aplicados.

* `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela.

* `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar linhas para replicação baseada em linha (índice, tabela ou varredura hash).

* `slave_rows_search_algorithms`: Determina os algoritmos de busca utilizados para o agrupamento de lotes de atualização de replica. Qualquer um dos 2 ou 3 itens desta lista: INDEX_SEARCH, TABLE_SCAN, HASH_SCAN.

* `slave_transaction_retries`: Número de vezes que o fio de replicação SQL refaz a transação no caso de ela falhar com bloqueio em espera de timeout, antes de desistir e parar.

* `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina uma string vazia para não permitir conversões de tipo entre a fonte e a replica.

* `sql_log_bin`: Controla o registro binário para a sessão atual.

* `sql_replica_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID.

* `sql_slave_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID.

* `sync_master_info`: Sincronize as informações de origem após cada evento a cada # evento.

* `sync_relay_log`: Sincronize o registro do relé no disco após cada evento no #.

* `sync_relay_log_info`: Sincronize o arquivo relay.info no disco após cada evento no #.

* `sync_source_info`: Sincronize as informações de origem após cada evento a cada # evento.

* `terminology_use_previous`: Use a terminologia da versão anterior onde as alterações são incompatíveis.

* `transaction_write_set_extraction`: Define o algoritmo usado para hash os dados extraídos durante a transação.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e variáveis de status usadas com o **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do servidor, variável de sistema e variável de status”.

##### Opções e variáveis de registro binário

As opções de linha de comando e as variáveis do sistema na lista a seguir se relacionam ao log binário. A Seção 19.1.6.4, “Opções e variáveis de registro binário”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas ao registro binário. Para informações gerais adicionais sobre o log binário, consulte a Seção 7.4.4, “O log binário”.

* `binlog-checksum`: Habilitar ou desabilitar verificações de checksums de registro binário.

* `binlog-do-db`: Limita o registro binário a bancos de dados específicos.

* `binlog-ignore-db`: Informe à fonte que as atualizações no banco de dados fornecido não devem ser escritas no log binário.

* `binlog-row-event-max-size`: Tamanho máximo do evento de registro binário.

* `Binlog_cache_disk_use`: Número de transações que utilizaram arquivo temporário em vez de cache de registro binário.

* `binlog_cache_size`: Tamanho do cache para armazenar declarações SQL para o log binário durante a transação.

* `Binlog_cache_use`: Número de transações que utilizaram cache temporário de registro binário.

* `binlog_checksum`: Habilitar ou desabilitar verificações de checksums de registro binário.

* `binlog_direct_non_transactional_updates`: As causas das atualizações que utilizam o formato de declaração para motores não transacionais são escritas diretamente no log binário. Consulte a documentação antes de usar.

* `binlog_encryption`: Habilitar a criptografia para arquivos de registro binários e arquivos de registro de retransmissão neste servidor.

* `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário.

* `binlog_expire_logs_auto_purge`: Controla a purga automática de arquivos de registro binários; pode ser ignorada quando habilitada, definindo binlog_expire_logs_seconds e expire_logs_days como 0.

* `binlog_expire_logs_seconds`: Limpe os logs binários após tantos segundos.

* `binlog_format`: Especifica o formato do log binário.

* `binlog_group_commit_sync_delay`: Define o número de microsegundos para esperar antes de sincronizar as transações no disco.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por binlog_group_commit_sync_delay.

* `binlog_gtid_simple_recovery`: Controla como os registros binários são iterados durante a recuperação do GTID.

* `binlog_max_flush_queue_time`: Quanto tempo para ler as transações antes de ser descartado para o log binário.

* `binlog_order_commits`: Se deve comprometer na mesma ordem que as escritas no log binário.

* `binlog_rotate_encryption_master_key_at_startup`: Rotacionar a chave mestre do log binário na inicialização do servidor.

* `binlog_row_image`: Use imagens completas ou mínimas ao registrar mudanças de linha.

* `binlog_row_metadata`: Se deve registrar todos ou apenas metadados mínimos relacionados à tabela no log binário ao usar registro baseado em linha.

* `binlog_row_value_options`: Habilita o registro binário de atualizações de JSON parciais para replicação baseada em linha.

* `binlog_rows_query_log_events`: Quando ativado, habilita o registro de eventos de log de consulta de linhas quando o registro é baseado em linhas. Desativado por padrão.

* `Binlog_stmt_cache_disk_use`: Número de declarações não transacionais que utilizaram arquivo temporário em vez de cache de declaração de registro binário.

* `binlog_stmt_cache_size`: Tamanho do cache para armazenar declarações não transacionais para o log binário durante a transação.

* `Binlog_stmt_cache_use`: Número de declarações que utilizaram cache temporário de declaração de log binário.

* `binlog_transaction_compression`: Habilitar a compressão para cargas de transação em arquivos de registro binário.

* `binlog_transaction_compression_level_zstd`: Nível de compressão para cargas de transação em arquivos de registro binário.

* `binlog_transaction_dependency_history_size`: Número de hashes de linha mantidos para procurar transações que foram atualizadas recentemente.

* `binlog_transaction_dependency_tracking`: Fonte de informações sobre a dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica.

* `Com_show_binlog_events`: Contagem de declarações de SHOW BINLOG EVENTS.

* `Com_show_binlogs`: Contagem de declarações de SHOW BINLOGS.

* `log-bin`: Nome base para arquivos de log binários.

* `log-bin-index`: Nome do arquivo de índice de log binário.

* `log_bin`: Se o registro binário está habilitado.

* `log_bin_basename`: Caminho e nome de base para arquivos de registro binários.

* `log_bin_use_v1_row_events`: Se o servidor está usando eventos de linha de registro binário da versão 1.

* `log_replica_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário.

* `log_slave_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário.

* `master_verify_checksum`: Faça com que a fonte da causa examine os checksums ao ler o log binário.

* `max-binlog-dump-events`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes utilizados para o cache de transações de múltiplos comandos.

* `max_binlog_size`: O log binário é rotado automaticamente quando o tamanho excede este valor.

* `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para cachear todas as declarações não transacionais durante a transação.

* `replica_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler do log do relé.

* `slave-sql-verify-checksum`: Faça com que a replica examine os checksums ao ler do log do relé.

* `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler do log do relé.

* `source_verify_checksum`: Faça com que a fonte do PH examine os checksums ao ler o log binário.

* `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `sync_binlog`: Limpe o log binário de forma síncrona no disco após cada evento no #.

Para uma lista de todas as opções de linha de comando, variáveis de sistema e de status usadas com o **mysqld**, consulte a Seção 7.1.4, “Referência de Opção do servidor, variável de sistema e variável de status”.

#### 19.1.6.2 Opções e variáveis de fonte de replicação

Esta seção descreve as opções do servidor e as variáveis do sistema que você pode usar nos servidores de origem de replicação. Você pode especificar as opções na linha de comando ou em um arquivo de opções. Você pode especificar os valores das variáveis do sistema usando `SET`.

Na fonte e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único. Para cada servidor, você deve escolher um número inteiro positivo único na faixa de 1 a 232 − 1, e cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo: `server-id=3`.

Para opções usadas na fonte para controlar o registro binário, consulte a Seção 19.1.6.4, “Opções e variáveis de registro binário”.

Opções de inicialização para servidores de origem de replicação

A lista a seguir descreve as opções de inicialização para o controle de servidores de origem de replicação. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

* `--show-replica-auth-info`

  <table frame="box" rules="all" summary="Properties for show-replica-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-replica-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

A partir do MySQL 8.0.26, use `--show-replica-auth-info`, e antes do MySQL 8.0.26, use `--show-slave-auth-info`. Ambas as opções têm o mesmo efeito. As opções exibem os nomes de usuário e senhas de replicação na saída de `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`(show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement")) na fonte para réplicas iniciadas com as opções `--report-user` e `--report-password`.

* `--show-slave-auth-info`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Use esta opção antes do MySQL 8.0.26 em vez de `--show-replica-auth-info`. Ambas as opções têm o mesmo efeito.

##### Variáveis do sistema usadas nos servidores de origem de replicação

As seguintes variáveis de sistema são usadas para ou por servidores de origem de replicação:

* `auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

`auto_increment_increment` e `auto_increment_offset` são destinados para uso com replicação circular (fonte a fonte) e podem ser usados para controlar o funcionamento das colunas `AUTO_INCREMENT`. Ambas as variáveis têm valores globais e de sessão, e cada uma pode assumir um valor inteiro entre 1 e 65.535, inclusive. Definir o valor de qualquer uma dessas duas variáveis para 0 faz com que seu valor seja definido como 1 em vez disso. Tentar definir o valor de qualquer uma dessas duas variáveis para um valor inteiro maior que 65.535 ou menor que 0 faz com que seu valor seja definido como 65.535 em vez disso. Tentar definir o valor de `auto_increment_increment` ou `auto_increment_offset` para um valor não inteiro produz um erro, e o valor real da variável permanece inalterado.

Nota

`auto_increment_increment` também é compatível para uso com as tabelas `NDB`.

A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema não é mais uma operação restrita.

Quando a Replicação em Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é interrompida. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` têm, cada um, seu valor padrão de 1. Se seus valores já tiverem sido modificados a partir do padrão, a Replicação em Grupo não os altera. A partir do MySQL 8.0, as variáveis do sistema também não são modificadas quando a Replicação em Grupo está no modo de único servidor primário, onde apenas um servidor escreve.

`auto_increment_increment` e `auto_increment_offset` afetam o comportamento da coluna `AUTO_INCREMENT` da seguinte forma:

+ `auto_increment_increment` controla o intervalo entre os valores sucessivos dos valores da coluna. Por exemplo:

    ```
    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 1     |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc1
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
      Query OK, 0 rows affected (0.04 sec)

    mysql> SET @@auto_increment_increment=10;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.01 sec)

    mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc1;
    +-----+
    | col |
    +-----+
    |   1 |
    |  11 |
    |  21 |
    |  31 |
    +-----+
    4 rows in set (0.00 sec)
    ```

+ `auto_increment_offset` determina o ponto de partida para o valor da coluna `AUTO_INCREMENT`. Considere o seguinte, assumindo que essas declarações são executadas durante a mesma sessão que o exemplo dado na descrição para `auto_increment_increment`:

    ```
    mysql> SET @@auto_increment_offset=5;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 5     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc2
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
    Query OK, 0 rows affected (0.06 sec)

    mysql> INSERT INTO autoinc2 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc2;
    +-----+
    | col |
    +-----+
    |   5 |
    |  15 |
    |  25 |
    |  35 |
    +-----+
    4 rows in set (0.02 sec)
    ```

Quando o valor de `auto_increment_offset` for maior que o de `auto_increment_increment`, o valor de `auto_increment_offset` é ignorado.

Se alguma dessas variáveis for alterada e, em seguida, novas linhas forem inseridas em uma tabela que contenha uma coluna `AUTO_INCREMENT`, os resultados podem parecer contra-intuitivos, porque a série de valores `AUTO_INCREMENT` é calculada sem considerar quaisquer valores já presentes na coluna, e o próximo valor inserido é o menor valor da série que é maior que o valor máximo existente na coluna `AUTO_INCREMENT`. A série é calculada da seguinte forma:

`auto_increment_offset` + *`N`* × `auto_increment_increment`

onde *`N`* é um valor inteiro positivo na série [1, 2, 3, ...]. Por exemplo:

  ```
  mysql> SHOW VARIABLES LIKE 'auto_inc%';
  +--------------------------+-------+
  | Variable_name            | Value |
  +--------------------------+-------+
  | auto_increment_increment | 10    |
  | auto_increment_offset    | 5     |
  +--------------------------+-------+
  2 rows in set (0.00 sec)

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  +-----+
  4 rows in set (0.00 sec)

  mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
  Query OK, 4 rows affected (0.00 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  |  35 |
  |  45 |
  |  55 |
  |  65 |
  +-----+
  8 rows in set (0.00 sec)
  ```

Os valores mostrados para `auto_increment_increment` e `auto_increment_offset` geram a série 5 + *`N`* × 10, ou seja, [5, 15, 25, 35, 45, ...] O valor mais alto presente na coluna `col` antes do `INSERT` é 31, e o próximo valor disponível na série `AUTO_INCREMENT` é 35, então os valores inseridos para `col` começam nesse ponto e os resultados são conforme mostrado para a consulta `SELECT`.

Não é possível restringir os efeitos dessas duas variáveis a uma única tabela; essas variáveis controlam o comportamento de todas as colunas do `AUTO_INCREMENT` em *todas* as tabelas no servidor MySQL. Se o valor global de qualquer uma dessas variáveis for definido, seus efeitos persistem até que o valor global seja alterado ou substituído pela definição do valor da sessão, ou até que o **mysqld** seja reiniciado. Se o valor local for definido, o novo valor afeta as colunas do `AUTO_INCREMENT` para todas as tabelas nas quais novas linhas são inseridas pelo usuário atual durante a duração da sessão, a menos que os valores sejam alterados durante essa sessão.

O valor padrão de `auto_increment_increment` é

1. Veja a Seção 19.5.1.1, “Replicação e AUTO_INCREMENT”.

* `auto_increment_offset`

  <table frame="box" rules="all" summary="Properties for auto_increment_offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_offset</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

Essa variável tem um valor padrão de 1. Se ela for deixada com seu valor padrão e a Replicação por Grupo for iniciada no servidor no modo multi-primário, ela será alterada para o ID do servidor. Para mais informações, consulte a descrição para `auto_increment_increment`.

Nota

`auto_increment_offset` também é compatível para uso com as tabelas `NDB`.

A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema não é mais uma operação restrita.

* `immediate_server_version`

  <table frame="box" rules="all" summary="Properties for immediate_server_version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Introduced</th> <td>8.0.14</td> </tr><tr><th>System Variable</th> <td><code>immediate_server_version</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>999999</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>999999</code></td> </tr></tbody></table>

Para uso interno por replicação. Esta variável do sistema de sessão contém o número de lançamento do servidor do MySQL Server do servidor que é a fonte imediata em uma topologia de replicação (por exemplo, `80014` para uma instância de servidor do MySQL 8.0.14). Se este servidor imediato estiver em um lançamento que não suporte a variável do sistema de sessão, o valor da variável é definido como 0 (`UNKNOWN_SERVER_VERSION`).

O valor da variável é replicado de uma fonte para uma réplica. Com essas informações, a réplica pode processar corretamente os dados originados de uma fonte em uma versão anterior, reconhecendo onde ocorreram mudanças de sintaxe ou mudanças semânticas entre as versões envolvidas e tratando essas mudanças de forma apropriada. As informações também podem ser usadas em um ambiente de Replicação por Grupo, onde um ou mais membros do grupo de replicação estão em uma versão mais recente do que os outros. O valor da variável pode ser visualizado no log binário de cada transação (como parte do `Gtid_log_event`, ou `Anonymous_gtid_log_event` se GTIDs não estão sendo usados no servidor), e poderia ser útil para depurar problemas de replicação entre versões.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `original_server_version`

  <table frame="box" rules="all" summary="Properties for original_server_version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Introduced</th> <td>8.0.14</td> </tr><tr><th>System Variable</th> <td><code>original_server_version</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>999999</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>999999</code></td> </tr></tbody></table>

Para uso interno por replicação. Esta variável do sistema de sessão contém o número de versão do servidor MySQL do servidor onde uma transação foi originalmente comprometida (por exemplo, `80014` para uma instância de servidor MySQL 8.0.14). Se este servidor original estiver em uma versão que não suporte a variável do sistema de sessão, o valor da variável é definido como 0 (`UNKNOWN_SERVER_VERSION`). Note que, quando um número de versão é definido pelo servidor original, o valor da variável é redefinido para 0 se o servidor imediato ou qualquer outro servidor intermediário na topologia de replicação não suporte a variável do sistema de sessão, e, portanto, não replique seu valor.

O valor da variável é definido e utilizado da mesma forma que para a variável do sistema `immediate_server_version`. Se o valor da variável for o mesmo que o da variável do sistema `immediate_server_version`, apenas esta última é registrada no log binário, com um indicador de que a versão original do servidor é a mesma.

Em um ambiente de Replicação por Grupo, os eventos do log de alterações, que são transações especiais agendadas por cada membro do grupo quando um novo membro se junta ao grupo, são marcados com a versão do servidor do membro do grupo que agendou a transação. Isso garante que a versão do servidor do doador original seja conhecida pelo membro que se junta. Como os eventos do log de alterações agendados para uma alteração específica de visualização têm o mesmo GTID em todos os membros, apenas nesse caso, as instâncias do mesmo GTID podem ter uma versão original do servidor diferente.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `rpl_semi_sync_master_enabled`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Controla se a replicação semisíncrona está habilitada no servidor de origem. Para habilitar ou desabilitar o plugin, defina essa variável em `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_timeout`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

Um valor em milissegundos que controla o tempo que a fonte espera um reconhecimento de uma réplica antes de expirar o prazo e retornar à replicação assíncrona. O valor padrão é 10000 (10 segundos).

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_trace_level`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_trace_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_trace_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

O nível de rastreamento de depuração da replicação semiesincrona no servidor de origem. Quatro níveis são definidos:

+ 1 = nível geral (por exemplo, falhas na função de tempo)  
  + 16 = nível de detalhe (informações mais verbais)  
  + 32 = nível de espera líquida (mais informações sobre as esperas de rede)

+ 64 = nível de função (informações sobre a entrada e saída da função)

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_for_slave_count`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_for_slave_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_for_slave_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

O número de confirmações de replica que a fonte deve receber por transação antes de prosseguir. Por padrão, `rpl_semi_sync_master_wait_for_slave_count` é `1`, o que significa que a replicação semiesincrônica prossegue após receber uma única confirmação de replica. O desempenho é melhor para valores pequenos desta variável.

Por exemplo, se `rpl_semi_sync_master_wait_for_slave_count` é `2`, então 2 réplicas devem reconhecer a recepção da transação antes do período de tempo configurado por `rpl_semi_sync_master_timeout` para que a replicação semiesincronizada possa prosseguir. Se menos réplicas reconhecerem a recepção da transação durante o período de tempo, a fonte retorna à replicação normal.

Nota

Esse comportamento também depende de `rpl_semi_sync_master_wait_no_slave`

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_no_slave`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Controla se a fonte espera que o período de tempo de espera configurado por `rpl_semi_sync_master_timeout` expire, mesmo que o número de réplicas caia para menos do que o número de réplicas configurado por `rpl_semi_sync_master_wait_for_slave_count` durante o período de espera.

Quando o valor de `rpl_semi_sync_master_wait_no_slave` é `ON` (o padrão), é permitido que o número de réplicas caia para menos de `rpl_semi_sync_master_wait_for_slave_count` durante o período de tempo limite. Desde que o número suficiente de réplicas reconheça a transação antes da expiração do período de tempo limite, a replicação semi-sincronizada continua.

Quando o valor de `rpl_semi_sync_master_wait_no_slave` for `OFF`, se o número de réplicas cair para menos do que o número configurado em `rpl_semi_sync_master_wait_for_slave_count` em qualquer momento durante o período de tempo de espera configurado por `rpl_semi_sync_master_timeout`, a fonte retorna à replicação normal.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_point`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Essa variável controla o ponto em que um servidor de origem de replicação semisíncrona aguarda o reconhecimento da replicação da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

+ `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera o reconhecimento da replicação da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

+ `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte espera o reconhecimento da replica sobre a recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

+ Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo: Depois de ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha na fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvo no seu log de relevo). Uma saída inesperada do servidor fonte e a transição para a replica são sem perdas, pois a replica está atualizada. No entanto, observe que a fonte não pode ser reiniciada neste cenário e deve ser descartada, porque seu log binário pode conter transações não comprometidas que causariam um conflito com a replica quando externalizadas após a recuperação do log binário.

+ Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor se comprometer com o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que a comprometeu.

Se algo der errado de tal forma que a réplica não processe a transação, então, em caso de saída inesperada do servidor de origem e failover para a réplica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na origem.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

Com a adição de `rpl_semi_sync_master_wait_point` no MySQL 5.7, uma restrição de compatibilidade de versão foi criada porque ela incrementa a versão da interface semisíncrona: Servidores para MySQL 5.7 e versões superiores não funcionam com plugins de replicação semisíncrona de versões anteriores, nem servidores de versões anteriores funcionam com plugins de replicação semisíncrona para MySQL 5.7 e versões superiores.

* `rpl_semi_sync_source_enabled`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

`rpl_semi_sync_source_enabled` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_master_enabled` está disponível em vez disso.

`rpl_semi_sync_source_enabled` controla se a replicação semisíncrona está habilitada no servidor de origem. Para habilitar ou desabilitar o plugin, defina essa variável em `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

* `rpl_semi_sync_source_timeout`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

`rpl_semi_sync_source_timeout` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_master_timeout` está disponível em vez disso.

`rpl_semi_sync_source_timeout` controla o tempo que a fonte espera um reconhecimento de uma réplica antes de expirar o prazo e retornar à replicação assíncrona. O valor é especificado em milissegundos, e o valor padrão é 10000 (10 segundos).

* `rpl_semi_sync_source_trace_level`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

`rpl_semi_sync_source_trace_level` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_master_trace_level` está disponível em vez disso.

`rpl_semi_sync_source_trace_level` especifica o nível de rastreamento de depuração de replicação semiesincronizada no servidor de origem. Quatro níveis são definidos:

+ 1 = nível geral (por exemplo, falhas na função de tempo)  
  + 16 = nível de detalhe (informações mais verbais)  
  + 32 = nível de espera líquida (mais informações sobre as esperas de rede)

+ 64 = nível de função (informações sobre a entrada e saída da função)

* `rpl_semi_sync_source_wait_for_replica_count`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

`rpl_semi_sync_source_wait_for_replica_count` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_master_wait_for_slave_count` está disponível em vez disso.

`rpl_semi_sync_source_wait_for_replica_count` especifica o número de confirmações de réplica que a fonte deve receber por transação antes de prosseguir. Por padrão, `rpl_semi_sync_source_wait_for_replica_count` é `1`, o que significa que a replicação semiesincrônica prossegue após receber uma única confirmação de réplica. O desempenho é melhor para valores pequenos dessa variável.

Por exemplo, se `rpl_semi_sync_source_wait_for_replica_count` é `2`, então 2 réplicas devem reconhecer a recepção da transação antes do período de tempo configurado por `rpl_semi_sync_source_timeout` para que a replicação semiesincronizada possa prosseguir. Se menos réplicas reconhecerem a recepção da transação durante o período de tempo, a fonte retorna à replicação normal.

Nota

Esse comportamento também depende de `rpl_semi_sync_source_wait_no_replica`.

* `rpl_semi_sync_source_wait_no_replica`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

`rpl_semi_sync_source_wait_no_replica` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_source_wait_no_replica` está disponível em vez disso.

`rpl_semi_sync_source_wait_no_replica` controla se a fonte espera que o período de tempo de espera configurado por `rpl_semi_sync_source_timeout` expire, mesmo que o número de réplicas caia para menos do que o número de réplicas configurado por `rpl_semi_sync_source_wait_for_replica_count` durante o período de espera.

Quando o valor de `rpl_semi_sync_source_wait_no_replica` é `ON` (o padrão), é permitido que o número de réplicas caia para menos de `rpl_semi_sync_source_wait_for_replica_count` durante o período de tempo limite. Desde que o número suficiente de réplicas reconheça a transação antes da expiração do período de tempo limite, a replicação semi-sincronizada continua.

Quando o valor de `rpl_semi_sync_source_wait_no_replica` for `OFF`, se o número de réplicas cair para menos do que o número configurado em `rpl_semi_sync_source_wait_for_replica_count` em qualquer momento durante o período de tempo de espera configurado por `rpl_semi_sync_source_timeout`, a fonte retorna à replicação normal.

* `rpl_semi_sync_source_wait_point`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.26</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

`rpl_semi_sync_source_wait_point` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `rpl_semi_sync_master_wait_point` está disponível em vez disso.

`rpl_semi_sync_source_wait_point` controla o ponto em que um servidor de origem de replicação semisíncrona espera o reconhecimento da replicação da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

+ `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera o reconhecimento da replicação da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

+ `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte espera o reconhecimento da replica sobre a recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

+ Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo: Depois de ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha na fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvo no seu log de relevo). Uma saída inesperada do servidor fonte e a transição para a replica são sem perdas, pois a replica está atualizada. No entanto, observe que a fonte não pode ser reiniciada neste cenário e deve ser descartada, porque seu log binário pode conter transações não comprometidas que causariam um conflito com a replica quando externalizadas após a recuperação do log binário.

+ Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor se comprometer com o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que a comprometeu.

Se algo der errado de tal forma que a réplica não processe a transação, então, em caso de saída inesperada do servidor de origem e failover para a réplica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na origem.

#### 19.1.6.3 Opções e variáveis do servidor de replicação

Esta seção explica as opções do servidor e as variáveis do sistema que se aplicam aos servidores replicados e contém o seguinte:

* Opções de inicialização para servidores replicados
* Variáveis do sistema usadas em servidores replicados

Especifique as opções na linha de comando ou em um arquivo de opções. Muitas das opções podem ser definidas enquanto o servidor está em execução, usando a declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") `CHANGE MASTER TO` (antes do MySQL 8.0.23). Especifique os valores das variáveis do sistema usando `SET`.

**ID do servidor.** No ponto de origem e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```
[mysqld]
server-id=3
```

Opções de inicialização para servidores replicados

Esta seção explica as opções de inicialização para o controle de servidores replicados. Muitas dessas opções podem ser definidas enquanto o servidor está em execução, usando a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). Outras, como as opções `--replicate-*`, só podem ser definidas quando o servidor replica começa. As variáveis de sistema relacionadas à replicação são discutidas mais tarde nesta seção.

* `--master-info-file=file_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>

O uso desta opção já é desaconselhado. Ela era usada para definir o nome do arquivo do repositório de metadados de conexão da replica se `master_info_repository=FILE` fosse definido. `--master-info-file` e o uso da variável de sistema `master_info_repository` são desaconselhados porque o uso de um arquivo para o repositório de metadados de conexão foi substituído por tabelas seguras em caso de falha. Para informações sobre o repositório de metadados de conexão, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

* `--master-retry-count=count`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>

O número de vezes que a réplica tenta se reconectar à fonte antes de desistir. O valor padrão é de 86400 vezes. Um valor de 0 significa "infinito", e a réplica tenta se conectar para sempre. As tentativas de reconexão são acionadas quando a réplica atinge seu tempo limite de conexão (especificado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`) sem receber dados ou um sinal de batida de coração da fonte. A reconexão é tentada em intervalos definidos pela opção `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` (que, por padrão, é a cada 60 segundos).

Essa opção é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` em vez disso.

* `--max-relay-log-size=size`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

O tamanho pelo qual o servidor roda os arquivos de registro do relé automaticamente. Se esse valor não for nulo, o registro do relé é rotado automaticamente quando seu tamanho excede esse valor. Se esse valor for zero (o padrão), o tamanho pelo qual a rotação do registro do relé ocorre é determinado pelo valor de `max_binlog_size`. Para mais informações, consulte a Seção 19.2.4.1, “O Registro do Relé”.

* `--relay-log-purge={0|1}`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Desative ou ative a limpeza automática dos registros do relé assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. Desativar a limpeza dos registros do relé ao habilitar a opção `--relay-log-recovery` arrisca a consistência dos dados e, portanto, não é segura em caso de falha.

* `--relay-log-space-limit=size`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Esta opção estabelece um limite superior para o tamanho total em bytes de todos os registros de relé na replica. Um valor de 0 significa “sem limite”. Isso é útil para um servidor de replica que tem espaço em disco limitado. Quando o limite é atingido, o thread de I/O (receptor) para de ler eventos de log binário do servidor fonte até que o thread SQL tenha atualizado e excluído alguns logs de relé não utilizados. Observe que este limite não é absoluto: Há casos em que o thread SQL (aplicável) precisa de mais eventos antes de poder excluir logs de relé. Nesse caso, o thread receptor excede o limite até que seja possível para o thread aplicável excluir alguns logs de relé, pois não fazer isso causaria um impasse. Você não deve definir `--relay-log-space-limit` para menos que o dobro do valor de `--max-relay-log-size` (ou `--max-binlog-size` se `--max-relay-log-size` for 0). Nesse caso, há uma chance de que o thread receptor espere por espaço livre porque `--relay-log-space-limit` é excedido, mas o thread aplicável não tem nenhum log de relé para purgar e não é capaz de satisfazer o thread receptor. Isso obriga o thread receptor a ignorar `--relay-log-space-limit` temporariamente.

* `--replicate-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_DO_DB` (change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-do-db:channel_1:db_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

O efeito preciso desse filtro de replicação depende se a replicação baseada em declarações ou baseada em linhas está sendo usada.

**Replicação baseada em declarações.** Diga ao thread de replicação SQL para restringir a replicação a declarações onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* replica declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

Aviso

Para especificar múltiplos bancos de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista é tratada como o nome de um único banco de dados.

Um exemplo do que não funciona conforme o esperado ao usar a replicação baseada em declarações: Se a replica for iniciada com `--replicate-do-db=sales` e você emitir as seguintes declarações na fonte, a declaração `UPDATE` *não* será replicada:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão para esse comportamento de "verifique apenas o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando declarações `DELETE` de várias tabelas ou declarações `UPDATE` de várias tabelas que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

**Replicação baseada em linhas.** Diz ao thread SQL de replicação que restrinja a replicação ao banco de dados *`db_name`*. Somente as tabelas pertencentes a *`db_name`* são alteradas; o banco de dados atual não tem efeito sobre isso. Suponha que a replicação seja iniciada com `--replicate-do-db=sales` e a replicação baseada em linhas esteja em vigor, e então as seguintes instruções são executadas na fonte:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

A tabela `february` no banco de dados `sales` na replica é alterada de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, emitir as seguintes declarações na fonte não tem efeito na replica quando se usa replicação baseada em linha e `--replicate-do-db=sales`:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam replicados.

Outra diferença importante na forma como o `--replicate-do-db` é tratado na replicação baseada em declarações, em oposição à replicação baseada em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que a replicação seja iniciada com `--replicate-do-db=db1`, e as seguintes declarações sejam executadas na fonte:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Se você estiver usando replicação baseada em declarações, então ambas as tabelas são atualizadas na replica. No entanto, ao usar replicação baseada em linhas, apenas `table1` é afetado na replica; uma vez que `table2` está em um banco de dados diferente, `table2` na replica não é alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Neste caso, a declaração `UPDATE` não teria efeito na réplica ao usar replicação baseada em declaração. No entanto, se você estiver usando replicação baseada em linha, a declaração `UPDATE` mudaria `table1` na réplica, mas não `table2` — em outras palavras, apenas as tabelas no banco de dados nomeado por `--replicate-do-db` são alteradas, e a escolha do banco de dados padrão não tem efeito sobre esse comportamento.

Se você precisa que as atualizações entre bancos de dados funcionem, use `--replicate-wild-do-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os servidores avaliam os filtros de replicação”.

Nota

Essa opção afeta a replicação da mesma maneira que `--binlog-do-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-do-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de `--binlog-do-db`.

Esta opção não afeta as declarações `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB` (change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-ignore-db:channel_1:db_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Para especificar mais de um banco de dados a ser ignorado, use esta opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, ela é tratada como o nome de um único banco de dados.

Assim como em `--replicate-do-db`, o efeito preciso desse filtro depende se a replicação baseada em declarações ou baseada em linhas está sendo usada, e isso é descrito nos próximos parágrafos.

**Replicação baseada em declarações.** Diz ao fio de replicação SQL que não replique nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

**Replicação baseada em linha.** Diz ao thread de SQL de replicação que não deve atualizar nenhuma tabela no banco de dados *`db_name`*. O banco de dados padrão não tem efeito.

Ao usar a replicação baseada em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que a replicação seja iniciada com `--replicate-ignore-db=sales` e você emita as seguintes declarações na fonte:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* replicada em tal caso porque a declaração `--replicate-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar replicação baseada em linha, os efeitos da declaração `UPDATE` *não* são propagados para a réplica, e a cópia da réplica da tabela `sales.january` não é alterada; nesta instância, `--replicate-ignore-db=sales` faz com que *todas as* alterações feitas em tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas pela réplica.

Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam replicadas. Veja a Seção 19.2.5, “Como os servidores avaliam os filtros de replicação”.

Se você precisa que as atualizações entre bancos de dados funcionem, use `--replicate-wild-ignore-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os servidores avaliam os filtros de replicação”.

Nota

Essa opção afeta a replicação da mesma maneira que `--binlog-ignore-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-ignore-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de `--binlog-ignore-db`.

Esta opção não afeta as declarações `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação, dizendo ao thread SQL de replicação para restringir a replicação a uma determinada tabela. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona tanto para atualizações cruzadas entre bancos de dados quanto para atualizações de banco de dados padrão, em contraste com `--replicate-do-db`. Veja a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação, dizendo ao fio SQL de replicação que não replique qualquer declaração que atualize a tabela especificada, mesmo que outras tabelas possam ser atualizadas pela mesma declaração. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos, em contraste com `--replicate-ignore-db`. Veja a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-ignore-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-rewrite-db=from_name->to_name`

  <table frame="box" rules="all" summary="Properties for replicate-rewrite-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-rewrite-db=old_name-&gt;new_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Diz à replica que crie um filtro de replicação que traduza o banco de dados especificado para *`to_name`* se ele fosse *`from_name`* na fonte. Apenas as declarações que envolvem tabelas são afetadas, não declarações como `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`.

Para especificar múltiplos reescritos, use esta opção várias vezes. O servidor usa a primeira com um valor *`from_name`* que corresponda. A tradução do nome do banco de dados é feita *antes* das regras do `--replicate-*` serem testadas. Você também pode criar um filtro desse tipo emitindo uma declaração [[`CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`](change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement")].

Se você usar a opção `--replicate-rewrite-db` na linha de comando e o caractere `>` é especial para o interpretador de comandos, cite o valor da opção. Por exemplo:

  ```
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

O efeito da opção `--replicate-rewrite-db` difere dependendo se o formato de registro binário baseado em declaração ou baseado em linha é usado para a consulta. Com o formato baseado em declaração, as declarações DML são traduzidas com base no banco de dados atual, conforme especificado pela declaração `USE`. Com o formato baseado em linha, as declarações DML são traduzidas com base no banco de dados onde a tabela modificada existe. As declarações DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela declaração `USE`, independentemente do formato de registro binário.

Para garantir que a reescrita produza os resultados esperados, especialmente em combinação com outras opções de filtragem de replicação, siga essas recomendações ao usar a opção `--replicate-rewrite-db`:

+ Crie os bancos de dados *`from_name`* e *`to_name`* manualmente na fonte e na replica com nomes diferentes.

+ Se você usar o formato de registro binário baseado em declaração ou misto, não use consultas entre bancos de dados e não especifique nomes de banco de dados nas consultas. Para declarações DDL e DML, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela nas consultas.

+ Se você usa o formato de registro binário baseado em linha exclusivamente, para declarações DDL, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela em consultas. Para declarações DML, você pode usar um nome de tabela totalmente qualificado (*`db`*.*`table`*) se desejar.

Se essas recomendações forem seguidas, é seguro usar a opção `--replicate-rewrite-db` em combinação com opções de filtragem de replicação em nível de tabela, como `--replicate-do-table`.

Esta opção suporta filtros de replicação específicos para cada canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Especifique o nome do canal seguido de um colon, seguido da especificação do filtro. O primeiro colon é interpretado como um separador, e quaisquer colones subsequentes são interpretados como colones literais. Por exemplo, para configurar um filtro de replicação específico para um canal com o nome *`channel_1`*, use:

  ```
  $> mysqld --replicate-rewrite-db=channel_1:db_name1->db_name2
  ```

Se você usar um ponto e vírgula, mas não especificar um nome de canal, a opção configura o filtro de replicação para o canal de replicação padrão. Consulte a Seção 19.2.5.4, “Filtros baseados em canal de replicação”, para obter mais informações.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

* `--replicate-same-server-id`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Esta opção é para uso em réplicas. O padrão é 0 (`FALSE`). Com esta opção definida para 1 (`TRUE`), a réplica não pula eventos que têm seu próprio ID de servidor. Este ajuste normalmente é útil apenas em configurações raras.

Quando o registro binário é habilitado em uma replica, a combinação das opções `--replicate-same-server-id` e `--log-slave-updates` na replica pode causar laços infinitos na replicação se o servidor faz parte de uma topologia de replicação circular. (No MySQL 8.0, o registro binário é habilitado por padrão, e o registro de atualização de replica é o padrão quando o registro binário é habilitado). No entanto, o uso de identificadores globais de transação (GTIDs) previne essa situação, ignorando a execução de transações que já foram aplicadas. Se `gtid_mode=ON` estiver definido na replica, você pode iniciar o servidor com essa combinação de opções, mas não pode mudar para qualquer outro modo de GTID enquanto o servidor estiver em execução. Se algum outro modo de GTID estiver definido, o servidor não será iniciado com essa combinação de opções.

Por padrão, o thread de I/O de replicação (receptor) não escreve eventos de log binário no log de releio se eles tiverem o ID do servidor da replica (esta otimização ajuda a economizar o uso do disco). Se você deseja usar `--replicate-same-server-id`, certifique-se de iniciar a replica com esta opção antes de fazer a replica ler seus próprios eventos que você deseja que o thread de SQL de replicação (aplicador) execute.

* `--replicate-wild-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Cria um filtro de replicação, dizendo ao thread SQL (aplicável) de replicação para restringir a replicação a declarações onde qualquer uma das tabelas atualizadas correspondem aos padrões especificados de nome de banco de dados e tabela. Os padrões podem conter os caracteres de comodinho `%` e `_`, que têm o mesmo significado que o operador de correspondência de padrões `LIKE`. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações cruzadas. Veja a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-wild-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Importante

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

O filtro de replicação especificado pela opção `--replicate-wild-do-table` se aplica a tabelas, visualizações e gatilhos. Não se aplica a procedimentos e funções armazenadas ou eventos. Para filtrar declarações que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

Como exemplo, `--replicate-wild-do-table=foo%.bar%` replica apenas as atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

Se o padrão do nome da tabela for `%`, ele corresponde a qualquer nome de tabela e a opção também se aplica a declarações de nível de banco de dados ([`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement"), e [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")). Por exemplo, se você usar `--replicate-wild-do-table=foo%.%`, as declarações de nível de banco de dados são replicadas se o nome do banco de dados corresponder ao padrão `foo%`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de comodínio.

Para incluir caracteres curinga literais nos padrões de nomes de banco de dados ou tabela, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um banco de dados que é denominado `my_own%db`, mas não replicar tabelas do banco de dados `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` assim: `--replicate-wild-do-table=my_own\%db`. Se você usar a opção na linha de comando, você pode precisar duplicar as barras invertidas ou citar o valor da opção, dependendo do seu interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar `--replicate-wild-do-table=my\_own\\%db`.

* `--replicate-wild-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Cria um filtro de replicação que impede que o thread SQL de replicação replique uma declaração em que qualquer tabela corresponda ao padrão de caracteres curinga fornecido. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados. Veja a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

Esta opção suporta filtros de replicação específicos para canais, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico para um canal denominado *`channel_1`*, use `--replicate-wild-ignore:channel_1:db_name.tbl_name`. Neste caso, o primeiro colon é interpretado como um separador e os colons subsequentes são colons literais. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

Importante

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Como exemplo, `--replicate-wild-ignore-table=foo%.bar%` não replica atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`. Para informações sobre como o correspondência funciona, consulte a descrição da opção `--replicate-wild-do-table`. As regras para incluir caracteres curinga literais no valor da opção são as mesmas que para `--replicate-wild-ignore-table`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de comodínio.

Se você precisar filtrar declarações `GRANT` ou outras declarações administrativas, uma solução possível é usar o filtro `--replicate-ignore-db`. Esse filtro opera no banco de dados padrão que está atualmente em vigor, conforme determinado pela declaração `USE`. Portanto, você pode criar um filtro para ignorar declarações para um banco de dados que não está replicado, em seguida, emitir a declaração `USE` para alternar o banco de dados padrão para aquele imediatamente antes de emitir quaisquer declarações administrativas que você deseja ignorar. Na declaração administrativa, nomeie o banco de dados real onde a declaração é aplicada.

Por exemplo, se `--replicate-ignore-db=nonreplicated` estiver configurado no servidor de replicação, a seguinte sequência de declarações faz com que a declaração `GRANT` seja ignorada, porque o banco de dados padrão `nonreplicated` está em vigor:

  ```
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* `--skip-replica-start`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>3

A partir do MySQL 8.0.26, use `--skip-replica-start` em vez de `--skip-slave-start`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `--skip-slave-start`.

`--skip-replica-start` informa ao servidor de replicação que não deve iniciar as threads de I/O (receptor) e SQL (aplicador) de replicação quando o servidor é iniciado. Para iniciar as threads posteriormente, use uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

Você pode usar a variável de sistema `skip_replica_start` em vez da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégio do MySQL Server, para que os administradores de banco de dados não precisem de qualquer acesso privilegiado ao sistema operacional.

* `--skip-slave-start`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>4

A partir do MySQL 8.0.26, `--skip-slave-start` é descontinuado e o alias `--skip-replica-start` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `--skip-slave-start`.

Diz ao servidor de replicação que não inicie as threads de I/O (receptor) e SQL (aplicador) de replicação quando o servidor for iniciado. Para iniciar as threads posteriormente, use uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

A partir do MySQL 8.0.24, você pode usar a variável de sistema `skip_slave_start` em vez da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégio do MySQL Server, para que os administradores de banco de dados não precisem de qualquer acesso privilegiado ao sistema operacional.

* `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>5

Normalmente, a replicação para de quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta opção faz com que o fio de replicação SQL continue a replicação quando uma declaração retorna qualquer um dos erros listados no valor da opção.

Não use esta opção a menos que você entenda completamente por que está recebendo erros. Se não houver erros em sua configuração de replicação e em programas de cliente, e nenhum erro no próprio MySQL, um erro que interrompa a replicação nunca deve ocorrer. O uso indiscriminado desta opção resulta em réplicas ficando desesperadamente fora de sincronia com a fonte, sem você ter ideia do porquê isso ocorreu.

Para códigos de erro, você deve usar os números fornecidos pela mensagem de erro no log de erro do seu replica e na saída de `SHOW REPLICA STATUS`. O Apêndice B, *Mensagens de erro e problemas comuns*, lista códigos de erro do servidor.

O valor abreviado `ddl_exist_errors` é equivalente à lista de códigos de erro `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

Você também pode (mas não deve) usar o valor muito não recomendado de `all` para fazer com que a replica ignore todas as mensagens de erro e continue indo, independentemente do que acontece. Desnecessário dizer que, se você usar `all`, não há garantias quanto à integridade dos seus dados. Por favor, não reclame (ou faça relatórios de bugs) neste caso se os dados da replica não estiverem nem perto do que estão na fonte. *Você foi avisado*.

Esta opção não funciona da mesma maneira ao replicar entre NDB Clusters, devido ao mecanismo interno `NDB` para verificar os números de sequência de época; normalmente, assim que o `NDB` detecta um número de época que está ausente ou de outra forma fora de sequência, ele imediatamente para o fio do aplicável de réplica. A partir do NDB 8.0.28, você pode sobrepor esse comportamento, especificando também `--ndb-applier-allow-skip-epoch` junto com `--slave-skip-errors`; fazendo isso, o `NDB` ignora as transações de época ignoradas.

Exemplos:

  ```
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* `--slave-sql-verify-checksum={0|1}`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>6

Quando essa opção é habilitada, a replica examina os checksums lidos do log do relé. No caso de uma discrepância, a replica para com um erro.

As seguintes opções são usadas internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Elas não são destinadas ao uso em um ambiente de produção.

* `--abort-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>7

Quando esta opção é definida para um número inteiro positivo *`value`* diferente de 0 (padrão), ela afeta o comportamento da replicação da seguinte forma: Após o início do thread de SQL de replicação, os eventos de log *`value`* são permitidos para serem executados; após isso, o thread de SQL de replicação não recebe mais eventos, assim como se a conexão de rede da fonte fosse cortada. O thread de SQL de replicação continua a ser executado, e a saída de `SHOW REPLICA STATUS` exibe `Yes` nas colunas `Replica_IO_Running` e `Replica_SQL_Running`, mas não são lidos mais eventos do log de relé.

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção. A partir do MySQL 8.0.29, ela é desaconselhada e sujeita à remoção em uma versão futura do MySQL.

* `--disconnect-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção. A partir do MySQL 8.0.29, ela é desaconselhada e sujeita à remoção em uma versão futura do MySQL.

##### Variáveis do sistema usadas em servidores replicados

A lista a seguir descreve as variáveis do sistema para o controle de servidores replicados. Elas podem ser definidas na inicialização do servidor e algumas delas podem ser alteradas em tempo real usando `SET`. As opções do servidor usadas com replicados estão listadas anteriormente nesta seção.

* `init_replica`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>9

A partir do MySQL 8.0.26, use `init_replica` em vez de `init_slave`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `init_slave`.

`init_replica` é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replica cada vez que o fio de replicação SQL é iniciado. O formato da string é o mesmo que para a variável `init_connect`. A definição desta variável tem efeito para as declarações subsequentes de `START REPLICA`.

Nota

O fio de replicação SQL envia um reconhecimento ao cliente antes de executar `init_replica`. Portanto, não é garantido que `init_replica` tenha sido executado quando `START REPLICA` retorna. Consulte a Seção 15.4.2.6, “Declaração START REPLICA”, para obter mais informações.

* `init_slave`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

A partir do MySQL 8.0.26, `init_slave` é descontinuado e o alias `init_replica` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `init_slave`.

`init_slave` é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replica cada vez que o fio de replicação SQL é iniciado. O formato da string é o mesmo que para a variável `init_connect`. A definição desta variável tem efeito para as declarações subsequentes de `START REPLICA`.

Nota

O fio de replicação SQL envia um reconhecimento ao cliente antes de executar `init_slave`. Portanto, não é garantido que `init_slave` tenha sido executado quando `START REPLICA` retorna. Consulte a Seção 15.4.2.6, “Declaração START REPLICA”, para obter mais informações.

* `log_slow_replica_statements`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

A partir do MySQL 8.0.26, use `log_slow_replica_statements` em vez de `log_slow_slave_statements`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `log_slow_slave_statements`.

Quando o registro de consultas lentas é habilitado, `log_slow_replica_statements` habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Note que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), `log_slow_replica_statements` não tem efeito. As consultas são adicionadas apenas ao registro de consultas lentas da replica quando são registradas em formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada em formato de declaração. As consultas lentas que são registradas em formato de linha quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_replica_statements` esteja habilitado.

A definição de `log_slow_replica_statements` não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"). Além disso, observe que o ajuste global para `long_query_time` se aplica durante a vida útil do thread de replicação SQL. Se você alterar essa definição, deve parar e reiniciar o thread de replicação SQL para implementar a mudança (por exemplo, emitindo as declarações `STOP REPLICA` e `START REPLICA` com a opção `SQL_THREAD`).

* `log_slow_slave_statements`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

A partir do MySQL 8.0.26, `log_slow_slave_statements` é descontinuado e o alias `log_slow_replica_statements` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `log_slow_slave_statements`.

Quando o registro de consultas lentas é habilitado, `log_slow_slave_statements` habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Note que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), `log_slow_slave_statements` não tem efeito. As consultas são adicionadas apenas ao registro de consultas lentas da replica quando são registradas em formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` é definido, ou quando `binlog_format=MIXED` é definido e a declaração é registrada em formato de declaração. As consultas lentas que são registradas em formato de linha quando `binlog_format=MIXED` é definido, ou que são registradas quando `binlog_format=ROW` é definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_slave_statements` esteja habilitado.

A definição de `log_slow_slave_statements` não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START REPLICA` e (start-replica.html "15.4.2.6 START REPLICA Statement"). Além disso, observe que o ajuste global para `long_query_time` se aplica durante a vida útil do thread de replicação SQL. Se você alterar essa definição, deve parar e reiniciar o thread de replicação SQL para implementar a mudança (por exemplo, emitindo as declarações `STOP REPLICA` e `START REPLICA` com a opção `SQL_THREAD`).

* `master_info_repository`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

O uso dessa variável do sistema já é desaconselhado. O ajuste `TABLE` é o padrão e é necessário quando vários canais de replicação são configurados. O ajuste alternativo `FILE` foi anteriormente desaconselhado.

Com a configuração padrão, os registros de replicação do metadados sobre a fonte, consistindo de status e informações de conexão, são armazenados em uma tabela `InnoDB` no banco de dados do sistema `mysql` denominado `mysql.slave_master_info`. Para mais informações sobre o repositório de metadados de conexão, consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

A configuração `FILE` escreveu o repositório de metadados de conexão da réplica em um arquivo, que foi denominado `master.info` por padrão. O nome poderia ser alterado usando a opção `--master-info-file`.

* `max_relay_log_size`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

Se uma escrita por uma réplica em seu log de retransmissão causar o tamanho atual do arquivo de registro a exceder o valor desta variável, a réplica rotaciona os logs de retransmissão (fecha o arquivo atual e abre o próximo). Se `max_relay_log_size` é 0, o servidor usa `max_binlog_size` tanto para o log binário quanto para o log de retransmissão. Se `max_relay_log_size` é maior que 0, ele restringe o tamanho do log de retransmissão, o que permite que você tenha tamanhos diferentes para os dois logs. Você deve definir `max_relay_log_size` entre 4096 bytes e 1GB (inclusivo), ou para 0. O valor padrão é 0. Veja a Seção 19.2.3, “Eixos de Replicação”.

* `relay_log`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

O nome de base para os arquivos de registro do relé. Para o canal de replicação padrão, o nome de base padrão para os registros do relé é `host_name-relay-bin`. Para canais de replicação não padrão, o nome de base padrão para os registros do relé é `host_name-relay-bin-channel`, onde *`channel`* é o nome do canal de replicação registrado neste registro do relé.

O servidor escreve o arquivo no diretório de dados, a menos que o nome de base seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. O servidor cria arquivos de registro de retransmissão em sequência, adicionando um sufixo numérico ao nome de base.

O registro de relé e o índice de registro de relé em um servidor de replicação não podem ter os mesmos nomes que o registro binário e o índice de registro binário, cujos nomes são especificados pelas opções `--log-bin` e `--log-bin-index`. O servidor emite uma mensagem de erro e não inicia se os nomes de base dos arquivos de registro binário e de registro de relé forem os mesmos.

Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; o nome de base padrão é usado apenas se a opção não for especificada na verdade. Se você especificar a variável de sistema `relay_log` na inicialização do servidor sem especificar um valor, é provável que ocorra comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se elas são especificadas na linha de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 6.2.2, “Especificando opções de programa”.

Se você especificar essa variável, o valor especificado também será usado como o nome base do arquivo de índice do log do relé. Você pode sobrepor esse comportamento especificando um nome de base diferente para o arquivo de índice do log do relé usando a variável de sistema `relay_log_index`.

Quando o servidor lê uma entrada do arquivo de índice, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a variável de sistema `relay_log`. Um caminho absoluto permanece inalterado; nesse caso, o índice deve ser editado manualmente para permitir que o novo caminho ou caminhos sejam utilizados.

Você pode achar útil a variável de sistema `relay_log` para realizar as seguintes tarefas:

+ Criar logs de relé cujos nomes sejam independentes dos nomes dos hosts.

+ Se você precisa colocar os registros do relé em uma área diferente do diretório de dados, porque seus registros do relé tendem a ser muito grandes e você não quer diminuir `max_relay_log_size`.

+ Para aumentar a velocidade usando o balanceamento de carga entre discos.

Você pode obter o nome (e o caminho) do arquivo de registro do relé a partir da variável de sistema `relay_log_basename`.

* `relay_log_basename`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

Contém o nome de base e o caminho completo do arquivo de registro do relé. O comprimento máximo da variável é de 256. Esta variável é definida pelo servidor e é somente leitura.

* `relay_log_index`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

O nome do arquivo de índice do registro de relé. O comprimento máximo é de 256 caracteres. Se você não especificar essa variável, mas a variável do sistema `relay_log` for especificada, seu valor é usado como o nome padrão da base do arquivo de índice do registro de relé. Se `relay_log` também não for especificado, então, para o canal de replicação padrão, o nome padrão é `host_name-relay-bin.index`, usando o nome da máquina hospedeira. Para canais de replicação não padrão, o nome padrão é `host_name-relay-bin-channel.index`, onde *`channel`* é o nome do canal de replicação registrado neste índice de registro de relé.

O local padrão para os arquivos de registro do relé é o diretório de dados, ou qualquer outro local que foi especificado usando a variável de sistema `relay_log`. Você pode usar a variável de sistema `relay_log_index` para especificar um local alternativo, adicionando um nome de caminho absoluto no início do nome da base para especificar um diretório diferente.

O registro de relé e o índice de registro de relé em um servidor de replicação não podem ter os mesmos nomes que o registro binário e o índice de registro binário, cujos nomes são especificados pelas opções `--log-bin` e `--log-bin-index`. O servidor emite uma mensagem de erro e não inicia se os nomes de base dos arquivos de registro binário e de registro de relé forem os mesmos.

Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; o nome de base padrão é usado apenas se a opção não for especificada na verdade. Se você especificar a variável de sistema `relay_log_index` na inicialização do servidor sem especificar um valor, é provável que ocorra comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se elas são especificadas na linha de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 6.2.2, “Especificando opções de programa”.

* `relay_log_info_file`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>8

O uso dessa variável do sistema já é desaconselhado. Ela era usada para definir o nome do arquivo do repositório de metadados do aplicável de replica se `relay_log_info_repository=FILE` fosse definido. `relay_log_info_file` e o uso da variável do sistema `relay_log_info_repository` são desaconselhados porque o uso de um arquivo para o repositório de metadados do aplicável foi substituído por tabelas seguras em caso de falha. Para informações sobre o repositório de metadados do aplicável, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

* `relay_log_info_repository`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>9

O uso dessa variável do sistema já é desaconselhado. O ajuste `TABLE` é o padrão e é necessário quando vários canais de replicação são configurados. O ajuste `TABLE` para o repositório de metadados do aplicável da replica também é necessário para tornar a replicação resiliente a interrupções inesperadas. Consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Replicação”, para obter mais informações. O ajuste alternativo `FILE` foi anteriormente desaconselhado.

Com a configuração padrão, a replica armazena seu repositório de metadados do aplicável como uma tabela `InnoDB` no banco de dados do sistema `mysql` chamado `mysql.slave_relay_log_info`. Para mais informações sobre o repositório de metadados do aplicável, consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

A configuração `FILE` escreveu o repositório de metadados do aplicável da réplica em um arquivo, que foi denominado `relay-log.info` por padrão. O nome poderia ser alterado usando a variável de sistema `relay_log_info_file`.

* `relay_log_purge`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Desabilita ou habilita a limpeza automática dos arquivos de registro do relé assim que eles não forem mais necessários. O valor padrão é 1 (`ON`).

* `relay_log_recovery`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Se habilitada, essa variável permite a recuperação automática do log do relé imediatamente após a inicialização do servidor. O processo de recuperação cria um novo arquivo de log do relé, inicializa a posição do fio SQL (aplicável) para este novo log do relé e inicializa o fio de E/S (receptor) para a posição do fio aplicável. A leitura do log do relé da fonte continua então. Se `SOURCE_AUTO_POSITION=1` foi definido para o canal de replicação usando a opção `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), a posição da fonte usada para iniciar a replicação pode ser a mesma recebida na conexão e não as que foram atribuídas neste processo.

Essa variável global é somente de leitura durante a execução. Seu valor pode ser definido com a opção `--relay-log-recovery` no início da replicação do servidor, que deve ser usada após uma parada inesperada de uma replica para garantir que nenhum registro de relevo possivelmente corrompido seja processado, e deve ser usada para garantir uma replica segura em caso de falha. O valor padrão é 0 (desativado). Para informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Replicação”.

Para uma replica multithread (onde `replica_parallel_workers` ou `slave_parallel_workers` é maior que 0), definir `--relay-log-recovery` no início automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do log de relevo. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”.) O processo de recuperação do log de relevo lida com lacunas usando o mesmo método que a declaração `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`(start-replica.html "15.4.2.6 START REPLICA Statement") faria. Quando a replica multithread atinge um estado consistente sem lacunas, o processo de recuperação do log de relevo passa a buscar transações adicionais a partir da fonte, começando na posição do thread (aplicável) do SQL. Quando a replicação baseada em GTID está em uso, a partir do MySQL 8.0.18, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON`, e se estiver, omite o passo de cálculo das transações que devem ser ignoradas ou não ignoradas, para que os antigos logs de relevo não sejam necessários para o processo de recuperação.

Nota

Essa variável não afeta os seguintes canais de replicação do grupo:

+ `group_replication_applier`
  + `group_replication_recovery`

Qualquer outro canal que esteja sendo executado em um grupo é afetado, como um canal que está replicando de uma fonte externa ou de outro grupo.

* `relay_log_space_limit`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

O valor máximo de espaço a ser utilizado para todos os registros de relé.

* `replica_checkpoint_group`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

A partir do MySQL 8.0.26, use `replica_checkpoint_group` em vez de `slave_checkpoint_group`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_checkpoint_group`.

`replica_checkpoint_group` define o número máximo de transações que podem ser processadas por uma replica multithread antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito sobre as réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todas as declarações subsequentes de `START REPLICA`.

Anteriormente, as réplicas multithread não eram suportadas pelo NDB Cluster, o que silenciosamente ignorava a configuração para essa variável. Essa restrição foi levantada no MySQL 8.0.33.

Essa variável funciona em combinação com a variável de sistema `replica_checkpoint_period` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso, o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor o arredonda para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Não há tal arredondamento realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512, e o valor máximo permitido é 524280.

* `replica_checkpoint_period`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Em MySQL 8.0.26 e versões posteriores, use `replica_checkpoint_period` em vez de `slave_checkpoint_period`, que foi descontinuado a partir dessa versão; antes do MySQL 8.0.26, use `slave_checkpoint_period`.

`replica_checkpoint_period` define o tempo máximo (em milissegundos) que é permitido passar antes de uma operação de ponto de verificação ser chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável tem efeito em todos os canais de replicação imediatamente, incluindo canais em execução.

Anteriormente, as réplicas multithread não eram suportadas pelo NDB Cluster, o que silenciosamente ignorava a configuração para essa variável. Essa restrição foi levantada no MySQL 8.0.33.

Essa variável funciona em combinação com a variável de sistema `replica_checkpoint_group` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

* `replica_compressed_protocol`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

A partir do MySQL 8.0.26, use `replica_compressed_protocol` em vez de `slave_compressed_protocol`, que está desatualizado. Em versões anteriores ao MySQL 8.0.26, use `slave_compressed_protocol`.

`replica_compressed_protocol` especifica se deve usar compressão do protocolo de conexão de origem/replica se tanto a origem quanto a replica o suportar. Se essa variável for desativada (o padrão), as conexões não serão comprimidas. As alterações nessa variável entram em vigor em tentativas subsequentes de conexão; isso inclui após a emissão de uma declaração `START REPLICA`, bem como reconexões feitas por um thread de I/O de replicação em execução (receptor).

A compressão de transações de registro binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você usar compressão de transações de registro binário em combinação com compressão de protocolo, a compressão de protocolo tem menos oportunidade de agir nos dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estão comprimidos. Para mais informações sobre compressão de transações de registro binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Registro Binário”.

Se `replica_compressed_protocol` estiver habilitado, ele tem precedência sobre qualquer opção `SOURCE_COMPRESSION_ALGORITHMS` especificada para a declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"). Neste caso, as conexões à fonte utilizam a compressão `zlib` se tanto a fonte quanto a réplica suportarem esse algoritmo. Se `replica_compressed_protocol` estiver desativado, o valor de `SOURCE_COMPRESSION_ALGORITHMS` se aplica. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `replica_exec_mode`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

A partir do MySQL 8.0.26, use `replica_exec_mode` em vez de `slave_exec_mode`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_exec_mode`.

`replica_exec_mode` controla como um fio de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; `STRICT` significa que tal supressão não ocorre.

O modo `IDEMPOTENT` é destinado ao uso em replicação de múltiplas fontes, replicação circular e alguns outros cenários de replicação especiais para a Replicação de NDB Cluster. (Consulte a Seção 25.7.10, “Replicação de NDB Cluster: Replicação Bidirecional e Circular”, e a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `replica_exec_mode`, e sempre o trata como `IDEMPOTENT`.

No MySQL Server 8.0, o modo `STRICT` é o valor padrão.

Definir essa variável tem efeito imediato para todos os canais de replicação, incluindo os canais em execução.

Para motores de armazenamento que não sejam o `NDB`, o modo *`IDEMPOTENT` deve ser usado apenas quando você tem certeza absoluta de que erros de chave duplicada e erros de chave não encontrada podem ser ignorados com segurança. Ele é destinado a ser usado em cenários de fail-over para NDB Cluster, onde a replicação de várias fontes ou replicação circular é empregada, e não é recomendado para uso em outros casos.

* `replica_load_tmpdir`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

A partir do MySQL 8.0.26, use `replica_load_tmpdir` em vez de `slave_load_tmpdir`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_load_tmpdir`.

`replica_load_tmpdir` especifica o nome do diretório onde a replica cria arquivos temporários. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável do sistema `tmpdir`, ou o padrão que se aplica quando essa variável do sistema não é especificada.

Quando o thread de replicação SQL replica uma declaração `LOAD DATA`, ele extrai o arquivo a ser carregado do log de releio em arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica que coloque os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha um monte de espaço disponível. Nesse caso, os logs de releio também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de releio nesse sistema de arquivos.

O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as declarações `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após uma reinicialização se os arquivos temporários tiverem sido removidos.

* `replica_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

A partir do MySQL 8.0.26, use `replica_max_allowed_packet` em vez de `slave_max_allowed_packet`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_max_allowed_packet`.

`replica_max_allowed_packet` define o tamanho máximo do pacote em bytes que os threads de replicação SQL (aplicador) e I/O (receptor) podem manipular. Definir essa variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. É possível que uma fonte escreva eventos de log binário mais longos do que sua configuração `max_allowed_packet` uma vez que o cabeçalho do evento é adicionado. A configuração para `replica_max_allowed_packet` deve ser maior do que a configuração `max_allowed_packet` na fonte, para que grandes atualizações usando replicação baseada em linha não causem falha na replicação.

Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não é, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `replica_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

* `replica_net_timeout`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

A partir do MySQL 8.0.26, use `replica_net_timeout` em vez de `slave_net_timeout`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_net_timeout`.

`replica_net_timeout` especifica o número de segundos que o replicador deve esperar por mais dados ou um sinal de batida de coração da fonte antes de considerar a conexão quebrada, abortar a leitura e tentar reconectar. A configuração desta variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes `START REPLICA`.

O valor padrão é de 60 segundos (um minuto). O primeiro reajuste ocorre imediatamente após o tempo limite. O intervalo entre os reajustes é controlado pela opção `SOURCE_CONNECT_RETRY` para a declaração `CHANGE REPLICATION SOURCE TO`, e o número de tentativas de reconexão é limitado pela opção `SOURCE_RETRY_COUNT`.

O intervalo de batida de coração, que interrompe o tempo de espera da conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `SOURCE_HEARTBEAT_PERIOD` para a declaração `CHANGE REPLICATION SOURCE TO`. O intervalo de batida de coração tem como padrão metade do valor de `replica_net_timeout`, e é registrado no repositório de metadados de conexão da réplica e mostrado na tabela do `replication_connection_configuration` do Schema de Desempenho. Observe que uma mudança no valor ou configuração padrão de `replica_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o tempo de espera da conexão for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para ajustar o intervalo de batida de coração a um valor apropriado, para que ele ocorra antes do tempo de espera da conexão.

* `replica_parallel_type`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

A partir do MySQL 8.0.26, use `replica_parallel_type` em vez de `slave_parallel_type`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_type`.

Para réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido com um valor maior que 0), `replica_parallel_type` especifica a política usada para decidir quais transações são permitidas para executar em paralelo na réplica. A variável não tem efeito em réplicas para as quais o multithread não está habilitado. Os valores possíveis são:

+ `LOGICAL_CLOCK`: As transações são aplicadas em paralelo na replica, com base em marcações de tempo que a fonte de replicação escreve no log binário. As dependências entre as transações são rastreadas com base em suas marcações de tempo para fornecer adicionalização paralela, quando possível.

+ `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Este valor é apropriado apenas se os dados forem divididos em vários bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

Quando `replica_preserve_commit_order` ou `slave_preserve_commit_order` está habilitado, você deve usar `LOGICAL_CLOCK`. Antes do MySQL 8.0.27, `DATABASE` é o padrão. A partir do MySQL 8.0.27, o multithreading é habilitado por padrão para servidores replica (`replica_parallel_workers=4` por padrão), e `LOGICAL_CLOCK` é o padrão. (No MySQL 8.0.27 e posterior, `replica_preserve_commit_order` também é habilitado por padrão.)

Quando a topologia de replicação utiliza múltiplos níveis de réplicas, `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Para compensar esse efeito, você deve definir `binlog_transaction_dependency_tracking` para `WRITESET` ou `WRITESET_SESSION` na fonte *assim como em cada réplica intermediária* para especificar que conjuntos de escrita são usados em vez de marca-passos para paralelização, quando possível.

Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, se `replica_parallel_type` estiver definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapeadas antes de a transação ser agendada. O uso da compressão de transações de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com as transações não compactadas, que são mapeadas e agendadas para cada evento.

`replica_parallel_type` é descontinuado a partir do MySQL 8.0.29, assim como o suporte para a paralelização de transações usando particionamento de banco de dados. Espera-se que o suporte para esses recursos seja removido em uma versão futura e que `LOGICAL_CLOCK` seja usado exclusivamente a partir daí.

* `replica_parallel_workers`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

Começando com o MySQL 8.0.26, `slave_parallel_workers` é descontinuado e você deve usar `replica_parallel_workers` em vez disso. (Antes do MySQL 8.0.26, você deve usar `slave_parallel_workers` para definir o número de threads do aplicável.)

`replica_parallel_workers` permite a multitarefa na replica e define o número de threads do aplicável para executar transações de replicação em paralelo. Quando o valor é maior ou igual a 1, a replica utiliza o número especificado de threads de trabalho para executar transações, além de um thread de coordenador que lê as transações do log de relevo e as agrupa para os trabalhadores. Quando o valor é 0, há apenas um thread que lê e aplica as transações sequencialmente. Se você está usando vários canais de replicação, o valor desta variável se aplica às threads usadas por cada canal.

Antes do MySQL 8.0.27, o valor padrão dessa variável do sistema é 0, então as réplicas usam um único fio de trabalho por padrão. Começando com o MySQL 8.0.27, o valor padrão é 4, o que significa que as réplicas são multithreadadas por padrão.

A partir do MySQL 8.0.30, definir essa variável para 0 é desaconselhável, gera uma advertência e está sujeito à remoção em uma versão futura do MySQL. Para um único trabalhador, defina `replica_parallel_workers` para 1.

Quando `replica_preserve_commit_order` (ou `slave_preserve_commit_order`) é definido para `ON` (o padrão no MySQL 8.0.27 e versões posteriores), as transações em uma replica são externalizadas na replica na mesma ordem em que aparecem no log de relevo da replica. A maneira pela qual as transações são distribuídas entre os threads do aplicável é determinada por `replica_parallel_type` (MySQL 8.0.26 e versões posteriores) ou `slave_parallel_type` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, essas variáveis do sistema também têm os padrões apropriados para multithreading.

Para desabilitar a execução paralela, defina `replica_parallel_workers` para 1, caso em que a replica usa um fio de coordenador que lê as transações e um fio de trabalhador que as aplica, o que significa que as transações são aplicadas sequencialmente. Quando `replica_parallel_workers` é igual a 1, as variáveis de sistema `replica_parallel_type` (`slave_parallel_type`) e `replica_preserve_commit_order` (`slave_preserve_commit_order`) não têm efeito e são ignoradas. Se `replica_parallel_workers` for igual a 0 enquanto a opção [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") `GTID_ONLY` está habilitada, a replica tem um fio de coordenador e um fio de trabalhador, exatamente como se `replica_parallel_workers` tivesse sido definido para 1. (`GTID_ONLY` está disponível no MySQL 8.0.27 e posterior.) Com um trabalhador paralelo, a variável de sistema `replica_preserve_commit_order` (`slave_preserve_commit_order`) também não tem efeito.

A definição de `replica_parallel_workers` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA`.

As réplicas multithread são suportadas pelo NDB Cluster a partir do NDB 8.0.33. (Anteriormente, `NDB` ignorava silenciosamente qualquer configuração para `replica_parallel_workers`. ) Consulte a Seção 25.7.11, “Replicação do NDB Cluster Usando o Aplicativo Multithread”, para obter mais informações.

Aumentar o número de trabalhadores melhora o potencial de paralelismo. Normalmente, isso melhora o desempenho até um certo ponto, além do qual o aumento do número de trabalhadores reduz o desempenho devido a efeitos de concorrência, como a disputa por bloqueio. O número ideal depende tanto do hardware quanto da carga de trabalho; pode ser difícil prever e, normalmente, precisa ser encontrado por meio de testes. Tabelas sem chaves primárias, que sempre prejudicam o desempenho, podem ter um impacto negativo ainda maior no desempenho das réplicas que têm `replica_parallel_workers` > 1; portanto, certifique-se de que todas as tabelas tenham chaves primárias antes de habilitar essa opção.

* `replica_pending_jobs_size_max`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

A partir do MySQL 8.0.26, use `replica_pending_jobs_size_max` em vez de `slave_pending_jobs_size_max`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_pending_jobs_size_max`.

Para réplicas multithread, essa variável define a quantidade máxima de memória (em bytes) disponível para as filas de aplicação que retêm eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START REPLICA`.

O valor mínimo possível para essa variável é de 1024 bytes; o padrão é de 128 MB. O valor máximo possível é de 18446744073709551615 (16 exibições). Os valores que não são múltiplos exatos de 1024 bytes são arredondados para o próximo múltiplo inferior de 1024 bytes antes de serem armazenados.

O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias, e então processada. Todas as transações subsequentes são mantidas até que a grande transação tenha sido concluída.

* `replica_preserve_commit_order`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

A partir do MySQL 8.0.26, use `replica_preserve_commit_order` em vez de `slave_preserve_commit_order`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_preserve_commit_order`.

Para réplicas multithread (réplicas nas quais `replica_parallel_workers` está definido com um valor maior que 0), definir `replica_preserve_commit_order=ON` garante que as transações sejam executadas e comprometidas na réplica na mesma ordem em que aparecem no log de relevo da réplica. Isso previne lacunas na sequência de transações que foram executadas a partir do log de relevo da réplica, e preserva o mesmo histórico de transações na réplica como na fonte (com as limitações listadas abaixo). Esta variável não tem efeito em réplicas para as quais a multithread não está habilitada.

Antes do MySQL 8.0.27, o padrão para essa variável do sistema é `OFF`, o que significa que as transações podem ser comprometidas fora do devido tempo. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para servidores replicados (`replica_parallel_workers=4` por padrão), então `replica_preserve_commit_order=ON` é o padrão, e o ajuste `replica_parallel_type=LOGICAL_CLOCK` também é o padrão. Além disso, a partir do MySQL 8.0.27, o ajuste para `replica_preserve_commit_order` é ignorado se `replica_parallel_workers` estiver definido como 1, porque, nessa situação, a ordem das transações é preservada de qualquer maneira.

O registro binário e o registro de atualização de replica não são necessários na replica para definir `replica_preserve_commit_order=ON`, e podem ser desativados se desejado. Definir `replica_preserve_commit_order=ON` requer que `replica_parallel_type` seja definido como `LOGICAL_CLOCK`, o que *não* é o ajuste padrão antes do MySQL 8.0.27. Antes de alterar o valor de `replica_preserve_commit_order` ou `replica_parallel_type`, o fio do aplicável de replicação (para todos os canais de replicação se você estiver usando vários canais de replicação) deve ser interrompido.

Quando `replica_preserve_commit_order=OFF` está definido, as transações que uma replica multithread aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação mais recentemente executada não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência de transações que foram executadas no log de relevo da replica. Isso tem implicações para o registro e recuperação ao usar uma replica multithread. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transação”, para obter mais informações.

Quando `replica_preserve_commit_order=ON` é definido, o thread do trabalhador que está executando aguarda até que todas as transações anteriores sejam comprometidas antes de ser comprometido. Enquanto um determinado thread está esperando que outros threads do trabalhador comprometam suas transações, ele reporta seu status como `Waiting for preceding transaction to commit`. Com este modo, uma replica multithread nunca entra em um estado que a fonte não estava. Isso suporta o uso da replicação para escala de leitura. Veja a Seção 19.4.5, “Usando a Replicação para Escala de Leitura”.

Nota

+ `replica_preserve_commit_order=ON` não impede a diferença de posição do log binário da fonte, onde `Exec_master_log_pos` está atrasado até a posição até a qual as transações foram executadas. Veja a Seção 19.5.1.34, “Replicação e Inconsistências de Transação”.

+ `replica_preserve_commit_order=ON` não preserva a ordem de commit e o histórico de transações se a replica utilizar filtros em seu log binário, como `--binlog-do-db`.

+ `replica_preserve_commit_order=ON` não preserva a ordem das atualizações DML não transacionais. Essas podem ser confirmadas antes das transações que as precedem no log de relevo, o que pode resultar em lacunas na sequência de transações que foram executadas a partir do log de relevo da replica.

+ Uma limitação na preservação da ordem de commit no replica pode ocorrer se a replicação baseada em declarações estiver em uso e os motores de armazenamento transacional e não transacional participarem de uma transação não-XA que seja revertida na fonte. Normalmente, as transações não-XA que são revertidas na fonte não são replicadas para o replica, mas, nesta situação particular, a transação pode ser replicada para o replica. Se isso acontecer, uma replica multithread sem registro binário não lida com o rollback da transação, portanto, a ordem de commit no replica diverge da ordem do log de relevo das transações nesse caso.

+ *Replicação em grupo—MySQL 9.2.0 e versões posteriores*: Quando um primário de grupo está recebendo e aplicando transações de uma fonte externa através de um canal assíncrono e um novo membro se junta ao grupo, `replica_preserve_commit_order=ON` não é garantido que respeite a ordem de comprometimento de transações não conflitantes. Por isso, pode haver estados temporários no secundário que nunca existiram na fonte; como isso ocorre apenas em relação a transações não conflitantes, não há divergência real.

* `replica_sql_verify_checksum`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

A partir do MySQL 8.0.26, use `replica_sql_verify_checksum` em vez de `slave_sql_verify_checksum`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_sql_verify_checksum`.

`slave_sql_verify_checksum` faz com que o fio de replicação SQL (aplicável) verifique os dados usando os checksums lidos do log do relé. No caso de uma discrepância, a réplica para com um erro. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

Nota

O fio de I/O de replicação (receptor) sempre lê os checksums, se possível, ao aceitar eventos da rede.

* `replica_transaction_retries`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

A partir do MySQL 8.0.26, use `replica_transaction_retries` em vez de `slave_transaction_retries`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_transaction_retries`.

`replica_transaction_retries` define o número máximo de vezes para a replicação de threads SQL em uma replica de um único ou multithread para tentar novamente automaticamente as transações falhadas antes de parar. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor padrão é 10. Definir a variável para 0 desativa o reprocessamento automático das transações.

Se um fio de replicação SQL não conseguir executar uma transação devido a um `InnoDB` deadlock ou porque o tempo de execução da transação excedeu o `InnoDB` do `innodb_lock_wait_timeout` ou `NDB` do `TransactionDeadlockDetectionTimeout` ou `TransactionInactiveTimeout`, ele recomeça automaticamente `replica_transaction_retries` vezes antes de parar com um erro. As transações com um erro não temporário não são recomeçadas.

A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`. A tabela do Schema de Desempenho `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de transação por threads individuais de aplicação em uma replica de um único ou vários threads, e identifica os erros que causaram a última transação e a transação atualmente em progresso serem reatentadas.

* `replica_type_conversions`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

A partir do MySQL 8.0.26, use `replica_type_conversions` em vez de `slave_type_conversions`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_type_conversions`.

`replica_type_conversions` controla o modo de conversão de tipo em vigor na replica quando se usa replicação baseada em linha. Seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Estabeleça esta variável em uma string vazia para não permitir conversões de tipo entre a fonte e a replica. Estabelecer esta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Para informações adicionais sobre os modos de conversão de tipo aplicáveis à promoção e demissão de atributos na replicação baseada em linha, consulte Replicação baseada em linha: promoção e demissão de atributos.

* `replication_optimize_for_static_plugin_config`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

Use travessas compartilhadas e evite aquisições desnecessárias de travessas, para melhorar o desempenho da replicação semiesincrona. Este ajuste e `replication_sender_observe_commit_only` ajudam, pois o número de réplicas aumenta, pois a disputa por travessas pode desacelerar o desempenho. Embora essa variável do sistema esteja habilitada, o plugin de replicação semiesincrona não pode ser desinstalado, então você deve desabilitar a variável do sistema antes que o desinstalamento possa ser concluído.

Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincrona, e pode ser habilitada enquanto a replicação está em execução. Os servidores de origem de replicação semiesincrona também podem obter benefícios de desempenho ao habilitar essa variável de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

`replication_optimize_for_static_plugin_config` pode ser habilitado quando a Replicação em Grupo está em uso em um servidor. Nesse cenário, ele pode beneficiar o desempenho quando há disputa por bloqueios devido a cargas de trabalho elevadas.

* `replication_sender_observe_commit_only`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

Limite os callbacks para melhorar o desempenho da replicação semiesincronizada. Essa configuração e `replication_optimize_for_static_plugin_config` ajudam, pois o número de réplicas aumenta, pois a disputa por bloqueios pode prejudicar o desempenho.

Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincrona, e pode ser habilitada enquanto a replicação está em execução. Os servidores de origem de replicação semiesincrona também podem obter benefícios de desempenho ao habilitar essa variável de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

* `report_host`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

O nome de domínio ou endereço IP do réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída de `SHOW REPLICAS`(show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") no servidor da fonte. Deixe o valor sem definição se você não quiser que a réplica se registre com a fonte.

Nota

Não é suficiente que a fonte simplesmente leia o endereço IP do servidor de replicação a partir da conexão TCP/IP após a replica se conectar. Devido à NAT e outros problemas de roteamento, esse IP pode não ser válido para se conectar à replica a partir da fonte ou de outros hosts.

* `report_password`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A senha da conta da réplica que será reportada para a fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW REPLICAS` no servidor da fonte se a fonte foi iniciada com `--show-replica-auth-info` ou `--show-slave-auth-info`.

Embora o nome desta variável possa sugerir o contrário, `report_password` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) a mesma senha da conta de usuário de replicação do MySQL.

* `report_port`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

O número do porto TCP/IP para conexão com a réplica, que deve ser informado à fonte durante o registro da réplica. Defina apenas se a réplica estiver ouvindo em um porto não padrão ou se você tiver um túnel especial da fonte ou de outros clientes para a réplica. Se você não tiver certeza, não use esta opção.

O valor padrão para esta opção é o número de porta realmente utilizado pela réplica. Este é também o valor padrão exibido por `SHOW REPLICAS`.

* `report_user`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

O nome de usuário da conta da réplica que será relatada à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW REPLICAS` no servidor da fonte se a fonte foi iniciada com `--show-replica-auth-info` ou `--show-slave-auth-info`.

Embora o nome desta variável possa sugerir o contrário, `report_user` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) o mesmo nome da conta de usuário de replicação do MySQL.

* `rpl_read_size`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

A variável de sistema `rpl_read_size` controla a quantidade mínima de dados em bytes que são lidos dos arquivos de registro binários e dos arquivos de registro de releio. Se a atividade pesada de E/S de disco para esses arquivos está impedindo o desempenho do banco de dados, aumentar o tamanho de leitura pode reduzir as leituras de arquivos e as paradas de E/S quando os dados do arquivo não estão atualmente cacheados pelo sistema operacional.

O valor mínimo e padrão para `rpl_read_size` é de 8192 bytes. O valor deve ser um múltiplo de 4 KB. Observe que um buffer do tamanho desse valor é alocado para cada thread que lê dos arquivos de registro binário e registro de releio, incluindo threads de depuração em fontes e threads de coordenador em réplicas. Definir um valor grande pode, portanto, ter um impacto no consumo de memória dos servidores.

* `rpl_semi_sync_replica_enabled`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

`rpl_semi_sync_replica_enabled` está disponível quando o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado, `rpl_semi_sync_slave_enabled` está disponível em vez disso.

`rpl_semi_sync_replica_enabled` controla se a replicação semisíncrona está habilitada no servidor de replicação. Para habilitar ou desabilitar o plugin, defina essa variável em `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_semi_sync_replica_trace_level`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

`rpl_semi_sync_replica_trace_level` está disponível quando o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado, `rpl_semi_sync_slave_trace_level` está disponível em vez disso.

`rpl_semi_sync_replica_trace_level` controla o nível de rastreamento de depuração da replicação semisocial no servidor replica. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_semi_sync_slave_enabled`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

`rpl_semi_sync_slave_enabled` está disponível quando o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado, `rpl_semi_sync_replica_enabled` está disponível em vez disso.

`rpl_semi_sync_slave_enabled` controla se a replicação semisíncrona está habilitada no servidor de replicação. Para habilitar ou desabilitar o plugin, defina essa variável em `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_semi_sync_slave_trace_level`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

`rpl_semi_sync_slave_trace_level` está disponível quando o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so` foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so` foi instalado, `rpl_semi_sync_replica_trace_level` está disponível em vez disso.

`rpl_semi_sync_slave_trace_level` controla o nível de rastreamento de depuração da replicação semisocial no servidor replica. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_stop_replica_timeout`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

A partir do MySQL 8.0.26, use `rpl_stop_replica_timeout` em vez de `rpl_stop_slave_timeout`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `rpl_stop_slave_timeout`.

Você pode controlar o tempo (em segundos) que o `STOP REPLICA` espera antes de expirar o tempo, definindo essa variável. Isso pode ser usado para evitar deadlocks entre `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica.

O valor máximo e o valor padrão de `rpl_stop_replica_timeout` é de 31536000 segundos (1 ano). O mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP REPLICA`.

Essa variável afeta apenas o cliente que emite uma declaração `STOP REPLICA`. Quando o tempo de espera é atingido, o cliente que emite a declaração retorna uma mensagem de erro indicando que a execução do comando é incompleta. O cliente então para de esperar que os threads de I/O de replicação (receptor) e SQL (aplicador) parem, mas os threads de replicação continuam a tentar parar, e a declaração `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de ser ocupados, a declaração `STOP REPLICA` é executada e a replicação para.

* `rpl_stop_slave_timeout`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

A partir do MySQL 8.0.26, `rpl_stop_slave_timeout` é descontinuado e o alias `rpl_stop_replica_timeout` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `rpl_stop_slave_timeout`.

Você pode controlar o tempo (em segundos) que o `STOP REPLICA` espera antes de expirar o tempo, definindo essa variável. Isso pode ser usado para evitar deadlocks entre o `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica.

O valor máximo e o valor padrão de `rpl_stop_slave_timeout` é de 31536000 segundos (1 ano). O mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP REPLICA`.

Essa variável afeta apenas o cliente que emite uma declaração `STOP REPLICA`. Quando o tempo de espera é atingido, o cliente que emite a declaração retorna uma mensagem de erro indicando que a execução do comando é incompleta. O cliente então para de esperar que os threads de I/O de replicação (receptor) e SQL (aplicador) parem, mas os threads de replicação continuam a tentar parar, e a instrução `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de ser ocupados, a declaração `STOP REPLICA` é executada e a replicação para.

* `skip_replica_start`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A partir do MySQL 8.0.26, use `skip_replica_start` em vez de `skip_slave_start`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `skip_slave_start`.

`skip_replica_start` informa ao servidor de replicação que não deve iniciar as threads de I/O (receptor) e SQL (aplicador) de replicação quando o servidor é iniciado. Para iniciar as threads posteriormente, use uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

Essa variável do sistema é somente de leitura e pode ser definida usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a declaração `SET`. A opção de linha de comando `--skip-replica-start` também define essa variável do sistema. Você pode usar a variável do sistema em vez da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégio do MySQL Server, para que os administradores de banco de dados não precisem de qualquer acesso privilegiado ao sistema operacional.

* `skip_slave_start`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

A partir do MySQL 8.0.26, `skip_slave_start` é descontinuado e o alias `skip_replica_start` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `skip_slave_start`.

Diz ao servidor de replicação que não inicie as threads de I/O (receptor) e SQL (aplicador) de replicação quando o servidor for iniciado. Para iniciar as threads posteriormente, use uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

Essa variável de sistema está disponível a partir do MySQL 8.0.24. É somente de leitura e pode ser definida usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a declaração `SET`. A opção de linha de comando `--skip-slave-start` também define essa variável de sistema. Você pode usar a variável de sistema em vez da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégio do MySQL Server, para que os administradores de banco de dados não precisem de qualquer acesso privilegiado ao sistema operacional.

* `slave_checkpoint_group`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

A partir do MySQL 8.0.26, `slave_checkpoint_group` é descontinuado e o alias `replica_checkpoint_group` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_checkpoint_group`.

`slave_checkpoint_group` define o número máximo de transações que podem ser processadas por uma replica multithread antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito sobre as réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START REPLICA`.

Anteriormente, as réplicas multithread não eram suportadas pelo NDB Cluster, o que silenciosamente ignorava a configuração para essa variável. Essa restrição foi levantada no MySQL 8.0.33.

Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_period` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor o arredonda para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Não há tal arredondamento realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512, e o valor máximo permitido é 524280.

* `slave_checkpoint_period`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

A partir do MySQL 8.0.26, `slave_checkpoint_period` é descontinuado e `replica_checkpoint_period` deve ser usado em vez disso; antes do MySQL 8.0.26, use `slave_checkpoint_period`.

`slave_checkpoint_period` define o tempo máximo (em milissegundos) que é permitido passar antes de uma operação de ponto de verificação ser chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável tem efeito em todos os canais de replicação imediatamente, incluindo canais em execução.

Anteriormente, as réplicas multithread não eram suportadas pelo NDB Cluster, o que silenciosamente ignorava a configuração para essa variável. Essa restrição foi levantada no MySQL 8.0.33.

Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_group` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

* `slave_compressed_protocol`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

`slave_compressed_protocol` é descontinuado e, a partir do MySQL 8.0.26, o alias `replica_compressed_protocol` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_compressed_protocol`.

`slave_compressed_protocol` controla se deve usar compressão do protocolo de conexão de origem/replica se tanto a origem quanto a replica o suportar. Se essa variável for desativada (o padrão), as conexões não serão comprimidas. As alterações nessa variável terão efeito em tentativas subsequentes de conexão; isso inclui após a emissão de uma declaração `START REPLICA`, bem como reconexões feitas por um thread de I/O de replicação em execução (receptor).

A compressão de transações de registro binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você usar compressão de transações de registro binário em combinação com compressão de protocolo, a compressão de protocolo tem menos oportunidade de agir nos dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estão comprimidos. Para mais informações sobre compressão de transações de registro binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Registro Binário”.

A partir do MySQL 8.0.18, se `slave_compressed_protocol` estiver habilitado, ele tem precedência sobre qualquer opção `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` especificada para a declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") . Nesse caso, as conexões à fonte usam a compressão `zlib` se tanto a fonte quanto a replica o suportem. Se `slave_compressed_protocol` estiver desativado, o valor de `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` se aplica. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa variável do sistema é desatualizada. Você deve esperar que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `slave_exec_mode`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

A partir do MySQL 8.0.26, `slave_exec_mode` é descontinuado e o alias `replica_exec_mode` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_exec_mode`.

`slave_exec_mode` controla como um fio de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; `STRICT` significa que tal supressão não ocorre.

O modo `IDEMPOTENT` é destinado ao uso em replicação de múltiplas fontes, replicação circular e alguns outros cenários de replicação especiais para a Replicação de NDB Cluster. (Consulte a Seção 25.7.10, “Replicação de NDB Cluster: Replicação Bidirecional e Circular”, e a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `slave_exec_mode`, e sempre o trata como `IDEMPOTENT`.

No MySQL Server 8.0, o modo `STRICT` é o valor padrão.

Definir essa variável tem efeito imediato para todos os canais de replicação, incluindo os canais em execução.

Para motores de armazenamento que não sejam o `NDB`, o modo *`IDEMPOTENT` deve ser usado apenas quando você tem certeza absoluta de que erros de chave duplicada e erros de chave não encontrada podem ser ignorados com segurança. Ele é destinado a ser usado em cenários de fail-over para NDB Cluster, onde a replicação de várias fontes ou replicação circular é empregada, e não é recomendado para uso em outros casos.

* `slave_load_tmpdir`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

A partir do MySQL 8.0.26, `slave_load_tmpdir` é descontinuado e o alias `replica_load_tmpdir` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_load_tmpdir`.

`slave_load_tmpdir` especifica o nome do diretório onde a replica cria arquivos temporários. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável do sistema `tmpdir`, ou o padrão que se aplica quando essa variável do sistema não é especificada.

Quando o thread de replicação SQL replica uma declaração `LOAD DATA`, ele extrai o arquivo a ser carregado do log de releio em arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica que coloque os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha um monte de espaço disponível. Nesse caso, os logs de releio também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de releio nesse sistema de arquivos.

O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as declarações `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após uma reinicialização se os arquivos temporários tiverem sido removidos.

* `slave_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

A partir do MySQL 8.0.26, `slave_max_allowed_packet` é descontinuado e o alias `replica_max_allowed_packet` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_max_allowed_packet`.

`slave_max_allowed_packet` define o tamanho máximo do pacote em bytes que os threads de replicação SQL (aplicável) e de E/S (receptor) podem manipular. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução. É possível que uma fonte escreva eventos de log binário mais longos do que a definição de `max_allowed_packet` uma vez que o cabeçalho do evento é adicionado. A definição de `slave_max_allowed_packet` deve ser maior do que a definição de `max_allowed_packet` na fonte, para que grandes atualizações usando replicação baseada em linha não causem falha na replicação.

Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não é, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `slave_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

* `slave_net_timeout`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

A partir do MySQL 8.0.26, `slave_net_timeout` é descontinuado e o alias `replica_net_timeout` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_net_timeout`.

`slave_net_timeout` especifica o número de segundos que o replicador deve esperar por mais dados ou um sinal de batida de coração da fonte antes de considerar a conexão quebrada, abortar a leitura e tentar reconectar. A configuração desta variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes `START REPLICA`.

O valor padrão é de 60 segundos (um minuto). O primeiro reatamento ocorre imediatamente após o tempo limite. O intervalo entre os reatamentos é controlado pela opção `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` para a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` e o número de tentativas de reconexão é limitado pela opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT`.

O intervalo de batimento cardíaco, que interrompe o tempo de espera da conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `SOURCE_HEARTBEAT_PERIOD` | `MASTER_HEARTBEAT_PERIOD` para a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. O intervalo de batimento cardíaco tem como padrão metade do valor de `slave_net_timeout`, e é registrado no repositório de metadados de conexão da replica e mostrado na tabela do `replication_connection_configuration` do Schema de Desempenho. Observe que uma mudança no valor ou configuração padrão de `slave_net_timeout` não altera automaticamente o intervalo de batimento cardíaco, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o tempo de espera da conexão for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` | (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` | (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") para ajustar o intervalo de batimento cardíaco a um valor apropriado, de modo que ele ocorra antes do tempo de espera da conexão.

* `slave_parallel_type`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

A partir do MySQL 8.0.26, `slave_parallel_type` é descontinuado e o alias `replica_parallel_type` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_type`.

Para réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido com um valor maior que 0), `slave_parallel_type` especifica a política usada para decidir quais transações são permitidas para executar em paralelo na réplica. A variável não tem efeito em réplicas para as quais o multithread não está habilitado. Os valores possíveis são:

+ `LOGICAL_CLOCK`: As transações que fazem parte do mesmo grupo de registro binário são aplicadas em paralelo em uma replica. As dependências entre as transações são rastreadas com base em seus timestamps para fornecer uma adicionalização paralela, quando possível. Quando este valor é definido, a variável de sistema `binlog_transaction_dependency_tracking` pode ser usada na fonte para especificar que conjuntos de escrita são usados para a adicionalização em vez de timestamps, se um conjunto de escrita estiver disponível para a transação e forneça resultados melhores em comparação com os timestamps.

+ `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Este valor é apropriado apenas se os dados forem divididos em vários bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

Quando `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order` é `ON`, você deve usar `LOGICAL_CLOCK`. Antes do MySQL 8.0.27, `DATABASE` é o padrão. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para servidores replicados (`replica_parallel_workers=4` por padrão), então `LOGICAL_CLOCK` é o padrão, e o ajuste `replica_preserve_commit_order=ON` também é o padrão.

Todas as threads do aplicativo de replicação devem ser interrompidas antes de definir `slave_parallel_type`.

Quando sua topologia de replicação utiliza múltiplos níveis de réplicas, `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Você pode reduzir esse efeito usando `binlog_transaction_dependency_tracking` na fonte para especificar que conjuntos de escrita são usados em vez de marcações de tempo para paralelização, quando possível.

Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, se `replica_parallel_type` ou `slave_parallel_type` está definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapeadas antes de a transação ser agendada. O uso da compressão de transações de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com as transações não comprimidas, que são mapeadas e agendadas para cada evento.

* `slave_parallel_workers`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A partir do MySQL 8.0.26, `slave_parallel_workers` é descontinuado e o alias `replica_parallel_workers` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_workers`.

`slave_parallel_workers` permite a multitarefa na replica e define o número de threads do aplicável para executar transações de replicação em paralelo. Quando o valor é um número maior que 0, a replica é uma replica multitarefa com o número especificado de threads do aplicável, além de um thread de coordenador para gerenciá-los. Se você está usando vários canais de replicação, cada canal tem esse número de threads.

Antes do MySQL 8.0.27, o padrão para essa variável do sistema é 0, então as réplicas não são multithreadadas por padrão. A partir do MySQL 8.0.27, o padrão é 4, então as réplicas são multithreadadas por padrão.

O reprocessamento de transações é suportado quando o multithreading está habilitado em uma replica. Quando `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` está definido, as transações em uma replica são externalizadas na replica na mesma ordem em que aparecem no log de relevo da replica. A maneira pela qual as transações são distribuídas entre os threads do aplicável é configurada por `replica_parallel_type` (a partir do MySQL 8.0.26) ou `slave_parallel_type` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, essas variáveis do sistema também têm os valores padrão apropriados para multithreading.

Para desabilitar a execução paralela, defina `replica_parallel_workers` para 0, o que dá à replica um único fio de aplicador e nenhum fio de coordenador. Com essa configuração, as variáveis de sistema `replica_parallel_type` ou `slave_parallel_type` e `replica_preserve_commit_order` ou `slave_preserve_commit_order` não têm efeito e são ignoradas. A partir do MySQL 8.0.27, se a execução paralela é desativada quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` é habilitada em uma replica, a replica realmente usa um trabalhador paralelo para aproveitar o método para refazer transações sem acessar as posições do arquivo. Com um trabalhador paralelo, a variável de sistema `replica_preserve_commit_order` (`slave_preserve_commit_order`) também não tem efeito.

A definição de `replica_parallel_workers` não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

Anteriormente, as réplicas multithread não eram suportadas pelo NDB Cluster, o que silenciosamente ignorava a configuração para essa variável. Essa restrição foi levantada no MySQL 8.0.33.

* `slave_pending_jobs_size_max`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

A partir do MySQL 8.0.26, `slave_pending_jobs_size_max` é descontinuado e o alias `replica_pending_jobs_size_max` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_pending_jobs_size_max`.

Para réplicas multithread, essa variável define a quantidade máxima de memória (em bytes) disponível para as filas de aplicação que retêm eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes do `START REPLICA`.

O valor mínimo possível para essa variável é de 1024 bytes; o padrão é de 128 MB. O valor máximo possível é de 18446744073709551615 (16 exibições). Os valores que não são múltiplos exatos de 1024 bytes são arredondados para o próximo múltiplo inferior de 1024 bytes antes de serem armazenados.

O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias, e então processada. Todas as transações subsequentes são mantidas até que a grande transação tenha sido concluída.

* `slave_preserve_commit_order`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

A partir do MySQL 8.0.26, `slave_preserve_commit_order` é descontinuado e o alias `replica_preserve_commit_order` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_preserve_commit_order`.

Para réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido com um valor maior que 0), definir `slave_preserve_commit_order=1` garante que as transações sejam executadas e comprometidas na réplica na mesma ordem em que aparecem no log de relevo da réplica. Isso previne lacunas na sequência de transações que foram executadas a partir do log de relevo da réplica, e preserva o mesmo histórico de transações na réplica como na fonte (com as limitações listadas abaixo). Esta variável não tem efeito em réplicas para as quais a multithread não é habilitada.

Antes do MySQL 8.0.27, o padrão para essa variável do sistema é `OFF`, o que significa que as transações podem ser comprometidas fora do devido tempo. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para servidores replicados (`replica_parallel_workers=4` por padrão), então `slave_preserve_commit_order=ON` é o padrão, e o ajuste `slave_parallel_type=LOGICAL_CLOCK` também é o padrão. Além disso, a partir do MySQL 8.0.27, o ajuste para `slave_preserve_commit_order` é ignorado se `slave_parallel_workers` estiver definido como 1, porque, nessa situação, a ordem das transações é preservada de qualquer maneira.

Até e incluindo o MySQL 8.0.18, definir `slave_preserve_commit_order=ON` exige que o registro binário (`log_bin`) e o registro de atualização de replica (`log_slave_updates`) estejam habilitados na replica, que são as configurações padrão do MySQL 8.0. A partir do MySQL 8.0.19, o registro binário e o registro de atualização de replica não são necessários na replica para definir `slave_preserve_commit_order=ON`, e podem ser desativados se desejado. Em todas as versões, definir `slave_preserve_commit_order=ON` exige que `slave_parallel_type` esteja definido como `LOGICAL_CLOCK`, que *não* é a configuração padrão antes do MySQL 8.0.27. Antes de alterar o valor de `slave_preserve_commit_order` ou `slave_parallel_type`, o fio do aplicável de replicação (para todos os canais de replicação se você estiver usando vários canais de replicação) deve ser interrompido.

Quando `slave_preserve_commit_order=OFF` é definido, que é o padrão, as transações que uma replica multithread aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação mais recentemente executada não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência de transações que foram executadas no log de relevo da replica. Isso tem implicações para o registro e recuperação ao usar uma replica multithread. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transação” para mais informações.

Quando `slave_preserve_commit_order` é `ON`, o thread do trabalhador executando espera até que todas as transações anteriores sejam comprometidas antes de ser comprometido. Enquanto um determinado thread está esperando que outros threads de trabalhador comprometam suas transações, ele reporta seu status como `Waiting for preceding transaction to commit`. Com este modo, uma replica multithread nunca entra em um estado que a fonte não estava. Isso suporta o uso da replicação para escala de leitura. Veja a Seção 19.4.5, “Usando Replicação para Escala de Leitura”.

Nota

+ `slave_preserve_commit_order=ON` não impede a diferença de posição do log binário da fonte, onde `Exec_master_log_pos` está atrasado até a posição até a qual as transações foram executadas. Veja a Seção 19.5.1.34, “Replicação e Inconsistências de Transação”.

+ `slave_preserve_commit_order=ON` não preserva a ordem de commit e o histórico de transações se a replica utilizar filtros em seu log binário, como `--binlog-do-db`.

+ `slave_preserve_commit_order=ON` não preserva a ordem das atualizações DML não transacionais. Essas podem ser confirmadas antes das transações que as precedem no log de relevo, o que pode resultar em lacunas na sequência de transações que foram executadas a partir do log de relevo da replica.

+ Em versões anteriores ao MySQL 8.0.19, `slave_preserve_commit_order=ON` não preserva a ordem das declarações com uma cláusula `IF EXISTS` quando o objeto em questão não existe. Essas podem ser confirmadas antes de transações que as precedem no log de relevo, o que pode resultar em lacunas na sequência de transações que foram executadas a partir do log de relevo da réplica.

+ Uma limitação na preservação da ordem de commit no replica pode ocorrer se a replicação baseada em declarações estiver em uso e os motores de armazenamento transacional e não transacional participarem de uma transação não-XA que seja revertida na fonte. Normalmente, as transações não-XA que são revertidas na fonte não são replicadas para o replica, mas, nesta situação particular, a transação pode ser replicada para o replica. Se isso acontecer, uma replica multithread sem registro binário não lida com o rollback da transação, portanto, a ordem de commit no replica diverge da ordem do log de relevo das transações nesse caso.

* `slave_rows_search_algorithms`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Ao preparar lotes de linhas para registro e replicação baseada em linhas, essa variável do sistema controla como as linhas são pesquisadas para correspondências, em particular se escaneios de hash são usados. O uso dessa variável do sistema é agora desaconselhado. O ajuste padrão `INDEX_SCAN,HASH_SCAN` é ótimo para o desempenho e funciona corretamente em todos os cenários. Veja a Seção 19.5.1.27, “Replicação e Pesquisas de Linhas”.

* `slave_skip_errors`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

A partir do MySQL 8.0.26, `slave_skip_errors` é descontinuado e o alias `replica_skip_errors` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_skip_errors`.

Normalmente, a replicação para de quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o fio de replicação SQL continue a replicação quando uma declaração retorna qualquer um dos erros listados no valor da variável.

* `replica_skip_errors`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

A partir do MySQL 8.0.26, use `replica_skip_errors` em vez de `slave_skip_errors`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_skip_errors`.

Normalmente, a replicação para de quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o fio de replicação SQL continue a replicação quando uma declaração retorna qualquer um dos erros listados no valor da variável.

* `slave_sql_verify_checksum`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

A partir do MySQL 8.0.26, `slave_sql_verify_checksum` é descontinuado e o alias `replica_sql_verify_checksum` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_sql_verify_checksum`.

`slave_sql_verify_checksum` faz com que o fio de replicação SQL verifique os dados usando os checksums lidos do log de relé. No caso de uma discrepância, a replicação para com um erro. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Nota

A thread de I/O de replicação (receptor) sempre lê os checksums, se possível, ao aceitar eventos da rede.

* `slave_transaction_retries`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

A partir do MySQL 8.0.26, `slave_transaction_retries` é descontinuado e o alias `replica_transaction_retries` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_transaction_retries`.

`slave_transaction_retries` define o número máximo de vezes para a replicação de threads SQL em uma replica de um único ou multithread para tentar novamente automaticamente as transações falhadas antes de parar. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor padrão é 10. Definir a variável para 0 desativa o reprocessamento automático das transações.

Se um fio de replicação SQL não conseguir executar uma transação devido a um `InnoDB` deadlock ou porque o tempo de execução da transação excedeu o `InnoDB` do `innodb_lock_wait_timeout` ou `NDB` do `TransactionDeadlockDetectionTimeout` ou `TransactionInactiveTimeout`, ele recomeça automaticamente `slave_transaction_retries` vezes antes de parar com um erro. As transações com um erro não temporário não são recomeçadas.

A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`. A tabela do Schema de Desempenho `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de transação por threads individuais de aplicador em uma replica de um único ou multithread, e identifica os erros que causaram a última transação e a transação atualmente em progresso serem reatentadas.

* `slave_type_conversions`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

A partir do MySQL 8.0.26, `slave_type_conversions` é descontinuado e o alias `replica_type_conversions` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_type_conversions`.

`slave_type_conversions` controla o modo de conversão de tipo em vigor na replica quando se usa replicação baseada em linha. Seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Estabeleça esta variável em uma string vazia para não permitir conversões de tipo entre a fonte e a replica. Estabelecer esta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Para informações adicionais sobre os modos de conversão de tipo aplicáveis à promoção e demissão de atributos na replicação baseada em linha, consulte Replicação baseada em linha: promoção e demissão de atributos.

* `sql_replica_skip_counter`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

A partir do MySQL 8.0.26, use `sql_replica_skip_counter` em vez de `sql_slave_skip_counter`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `sql_slave_skip_counter`.

`sql_replica_skip_counter` especifica o número de eventos da fonte que uma réplica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima declaração `START REPLICA`; a próxima declaração `START REPLICA` também altera o valor de volta para 0. Quando essa variável é definida para um valor não nulo e há vários canais de replicação configurados, a declaração `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") só pode ser usada com a cláusula `FOR CHANNEL channel`.

Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando o `gtid_mode=ON` estiver definido. Se você precisar pular transações ao empregar GTIDs, use o `gtid_executed` da fonte em vez disso. Se você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), o `sql_replica_skip_counter` está disponível. Veja a Seção 19.1.7.3, “Pular Transações”.

Importante

Se o número de eventos ignorados, conforme especificado ao definir essa variável, causar o início da replicação no meio de um grupo de eventos, a replicação continua ignorando até encontrar o início do próximo grupo de eventos e começa a partir desse ponto. Para mais informações, consulte a Seção 19.1.7.3, “Ignorar Transações”.

* `sql_slave_skip_counter`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A partir do MySQL 8.0.26, `sql_slave_skip_counter` é descontinuado e o alias `sql_replica_skip_counter` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `sql_slave_skip_counter`.

`sql_slave_skip_counter` especifica o número de eventos da fonte que uma réplica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima declaração `START REPLICA`; a próxima declaração `START REPLICA` também altera o valor de volta para 0. Quando essa variável é definida para um valor não nulo e há vários canais de replicação configurados, a declaração [[`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement")]] só pode ser usada com a cláusula `FOR CHANNEL channel`.

Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando o `gtid_mode=ON` estiver definido. Se você precisar pular transações ao empregar GTIDs, use o `gtid_executed` da fonte em vez disso. Se você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), o `sql_slave_skip_counter` está disponível. Veja a Seção 19.1.7.3, “Pular Transações”.

Importante

Se o número de eventos ignorados, conforme especificado ao definir essa variável, causar o início da replicação no meio de um grupo de eventos, a replicação continua ignorando até encontrar o início do próximo grupo de eventos e começa a partir desse ponto. Para mais informações, consulte a Seção 19.1.7.3, “Ignorar Transações”.

* `sync_master_info`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

A partir do MySQL 8.0.26, `sync_master_info` é descontinuado e o alias `sync_source_info` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `sync_master_info`.

`sync_master_info` especifica o número de eventos após os quais a replica atualiza o repositório de metadados de conexão. Quando o repositório de metadados de conexão é armazenado como uma tabela `InnoDB`, que é a padrão a partir do MySQL 8.0, ele é atualizado após esse número de eventos. Se o repositório de metadados de conexão for armazenado como um arquivo, que é desaconselhado a partir do MySQL 8.0, a replica sincroniza seu arquivo `master.info` no disco (usando `fdatasync()`) após esse número de eventos. O valor padrão é 10000, e um valor zero significa que o repositório nunca é atualizado. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

* `sync_relay_log`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Se o valor desta variável for maior que 0, o servidor MySQL sincroniza seu log de releio no disco (usando `fdatasync()`) após cada evento `sync_relay_log` ser escrito no log de releio. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

Definir `sync_relay_log` para 0 não faz com que seja feita nenhuma sincronização no disco; nesse caso, o servidor depende do sistema operacional para esvaziar o conteúdo do log do relé de tempos em tempos, como qualquer outro arquivo.

Um valor de 1 é a escolha mais segura, pois, em caso de uma parada inesperada, você perde no máximo um evento do log de retransmissão. No entanto, também é a opção mais lenta (a menos que o disco tenha uma cache com bateria, o que torna a sincronização muito rápida). Para informações sobre a combinação de configurações em uma réplica que é mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma parada inesperada de uma réplica”.

* `sync_relay_log_info`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

O número de transações após as quais a réplica atualiza o repositório de metadados do aplicável. Quando o repositório de metadados do aplicável é armazenado como uma tabela `InnoDB` (o padrão no MySQL 8.0 e versões posteriores), ele é atualizado após cada transação e essa variável do sistema é ignorada. Se o repositório de metadados do aplicável for armazenado como um arquivo (desatualizado no MySQL 8.0), a réplica sincroniza seu arquivo `relay-log.info` no disco (usando `fdatasync()`) após esse número de transações. `0` (zero) significa que o conteúdo do arquivo é descarregado pelo sistema operacional apenas. Definir essa variável tem efeito em todos os canais de replicação imediatamente, incluindo canais em execução.

Como o armazenamento de metadados do aplicador como um arquivo é descontinuado, essa variável também é descontinuada; a partir do MySQL 8.0.34, o servidor emite um aviso sempre que você o define ou lê seu valor. Você deve esperar que `sync_relay_log_info` seja removido em uma versão futura do MySQL e migrar aplicativos que possam depender dele agora.

* `sync_source_info`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

A partir do MySQL 8.0.26, use `sync_source_info` em vez de `sync_master_info`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `sync_source_info`.

`sync_source_info` especifica o número de eventos após os quais a replica atualiza o repositório de metadados de conexão. Quando o repositório de metadados de conexão é armazenado como uma tabela `InnoDB`, que é a opção padrão do MySQL 8.0, ele é atualizado após esse número de eventos. Se o repositório de metadados de conexão for armazenado como um arquivo, que é desaconselhado a partir do MySQL 8.0, a replica sincroniza seu arquivo `master.info` no disco (usando `fdatasync()`) após esse número de eventos. O valor padrão é 10000, e um valor zero significa que o repositório nunca é atualizado. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

* `terminology_use_previous`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes de instrumentação que contêm os termos `master`, `slave` e `mts` (para “Escravo com Multi-Thread”), que foram alterados, respectivamente, para `source`, `replica` e `mta` (para “Aplicativo com Multi-Thread”). Se essas alterações incompatíveis afetarem suas aplicações, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer com que o MySQL Server use as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar usuários individuais, ou com escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

Os nomes dos instrumentos afetados estão listados na lista a seguir. A variável de sistema `terminology_use_previous` afeta apenas esses itens. Não afeta os novos aliases para variáveis de sistema, variáveis de status e opções de linha de comando que também foram introduzidas no MySQL 8.0.26, e esses ainda podem ser usados quando configurada.

+ Chaves instrumentadas (mutexes), visíveis nas tabelas do esquema de desempenho `mutex_instances` e `events_waits_*` com o prefixo `wait/synch/mutex/`

+ Lâminas de leitura/escrita, visíveis nas tabelas do Schema de Desempenho `rwlock_instances` e `events_waits_*` com o prefixo `wait/synch/rwlock/`

+ Variáveis de condição instrumentadas, visíveis nas tabelas do Schema de Desempenho `cond_instances` e `events_waits_*` com o prefixo `wait/synch/cond/`

+ Alocações de memória instrumentadas, visíveis nas tabelas do esquema de desempenho `memory_summary_*` com o prefixo `memory/sql/`

+ Nomes dos fios, visíveis na tabela `threads` do Schema de Desempenho com o prefixo `thread/sql/`

+ Etapas do fio, visíveis nas tabelas do Schema de Desempenho `events_stages_*` com o prefixo `stage/sql/`, e sem o prefixo nas tabelas do Schema de Desempenho `threads` e `processlist`, o resultado da declaração `SHOW PROCESSLIST`, a tabela do Schema de Informações `processlist` e o log de consultas lentas

+ Comandos de fio, visíveis nas tabelas do Schema de Desempenho `events_statements_history*` e `events_statements_summary_*_by_event_name`, com o prefixo `statement/com/`, e sem o prefixo nas tabelas do Schema de Desempenho `threads` e `processlist`, a saída da declaração `SHOW PROCESSLIST`, a tabela do Schema de Informação `processlist` e a saída da declaração `SHOW REPLICA STATUS`

#### 19.1.6.4 Opções e variáveis de registro binário

* Opções de inicialização usadas com registro binário
* Variáveis do sistema usadas com registro binário

Você pode usar as opções do **mysqld** e as variáveis do sistema descritas nesta seção para afetar o funcionamento do log binário, bem como para controlar quais instruções são escritas no log binário. Para informações adicionais sobre o log binário, consulte a Seção 7.4.4, “O Log Binário”. Para informações adicionais sobre o uso de opções de servidor MySQL e variáveis do sistema, consulte a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.1.8, “Variáveis do sistema do servidor”.

##### Opções de inicialização usadas com registro binário

A lista a seguir descreve as opções de inicialização para habilitar e configurar o log binário. As variáveis do sistema usadas com o registro binário são discutidas mais adiante nesta seção.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Variável do sistema (≥ 8.0.14)</th> <td><code>binlog_row_event_max_size</code></td> </tr><tr><th>Scope (≥ 8.0.14)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 8.0.14)</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies (≥ 8.0.14)</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8192</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Quando o registro binário baseado em linha é usado, essa configuração é um limite suave para o tamanho máximo de um evento de registro binário baseado em linha, em bytes. Sempre que possível, os registros armazenados no registro binário são agrupados em eventos com um tamanho que não exceda o valor dessa configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O valor deve ser (ou ser arredondado para) um múltiplo de 256. O padrão é 8192 bytes.

* `--log-bin[=base_name]`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Especifica o nome base a ser usado para arquivos de registro binários. Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados no log binário, que é usado para backup e replicação. O log binário é uma sequência de arquivos com um nome base e extensão numérica. O valor da opção `--log-bin` é o nome base da sequência de log. O servidor cria arquivos de registro binário em sequência, adicionando um sufixo numérico ao nome base.

Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome padrão da base para os arquivos de registro binário. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome padrão da base é `host_name-bin`, usando o nome da máquina do host.

O local padrão para os arquivos de registro binários é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto no início do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de registro binário, que rastreiam os arquivos de registro binários que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de registro binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome da base do arquivo de registro binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

Em versões anteriores do MySQL, o registro binário era desativado por padrão e ativado se você especificar a opção `--log-bin`. A partir do MySQL 8.0, o registro binário é ativado por padrão, independentemente de você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário é desativado por padrão. É possível ativar o registro binário neste caso, especificando a opção `--log-bin`. Quando o registro binário é ativado, a variável de sistema `log_bin`, que mostra o status do registro binário no servidor, é definida como AVO.

Para desabilitar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` no momento do início. Se uma dessas opções for especificada e `--log-bin` também for especificado, a opção especificada posteriormente terá precedência. Quando o registro binário é desativado, a variável de sistema `log_bin` é definida como OFF.

Quando os GTIDs estão em uso no servidor, se você desabilitar o registro binário ao reiniciar o servidor após uma parada anormal, é provável que alguns GTIDs sejam perdidos, causando o fracasso da replicação. Em uma parada normal, o conjunto de GTIDs do arquivo de registro binário atual é salvo na tabela `mysql.gtid_executed`. Após uma parada anormal em que isso não aconteceu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de registro binário, desde que o registro binário ainda esteja habilitado. Se o registro binário for desabilitado para o reinício do servidor, o servidor não pode acessar o arquivo de registro binário para recuperar os GTIDs, então a replicação não pode ser iniciada. O registro binário pode ser desabilitado com segurança após uma parada normal.

As opções `--log-slave-updates` e `--slave-preserve-commit-order` exigem registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-slave-updates=OFF` e `--skip-slave-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-slave-updates` ou `--slave-preserve-commit-order` juntamente com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

Em MySQL 5.7, um ID do servidor tinha que ser especificado quando o registro binário estava habilitado, ou o servidor não seria iniciado. Em MySQL 8.0, a variável de sistema `server_id` é definida como 1 por padrão. O servidor agora pode ser iniciado com este ID de servidor padrão quando o registro binário está habilitado, mas uma mensagem informativa é emitida se você não especificar um ID de servidor explicitamente, definindo a variável de sistema `server_id`. Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

Para informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

* `--log-bin-index[=file_name]`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O nome do arquivo de índice de log binário, que contém os nomes dos arquivos de log binário. Por padrão, ele tem a mesma localização e nome de base que o valor especificado para os arquivos de log binário usando a opção `--log-bin`, mais a extensão `.index`. Se você não especificar `--log-bin`, o nome padrão do arquivo de índice de log binário é `binlog.index`. Se você especificar a opção `--log-bin` sem uma string ou uma string vazia, o nome padrão do arquivo de índice de log binário é `host_name-bin.index`, usando o nome da máquina hospedeira.

Para informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

**Opções de seleção de declarações.** As opções na lista a seguir afetam quais declarações são escritas no log binário e, portanto, enviadas por um servidor de origem de replicação para suas réplicas. Há também opções para réplicas que controlam quais declarações recebidas da fonte devem ser executadas ou ignoradas. Para detalhes, consulte a Seção 19.1.6.3, “Opções e variáveis do servidor de réplica”.

* `--binlog-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Esta opção afeta o registro binário de uma maneira semelhante à forma como `--replicate-do-db` afeta a replicação.

Os efeitos desta opção dependem de se o formato de registro baseado em declaração ou baseado em linha está em uso, da mesma forma que os efeitos de `--replicate-do-db` dependem de se a replicação baseada em declaração ou baseada em linha está em uso. Você deve ter em mente que o formato usado para registrar uma declaração dada não é necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como [[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") e [[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") são sempre registradas como declarações, sem considerar o formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-do-db` sempre se aplicam na determinação de se a declaração é registrada ou

**Registro baseado em declarações.** Apenas as declarações são escritas no log binário onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* causa declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, a serem registradas enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

Aviso

Para especificar múltiplos bancos de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Um exemplo do que não funciona conforme o esperado ao usar o registro baseado em declarações: Se o servidor for iniciado com `--binlog-do-db=sales` e você emitir as seguintes declarações, a declaração `UPDATE` *não* será registrada:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão para esse comportamento de "apenas verifique o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando declarações `DELETE` de várias tabelas ou declarações `UPDATE` de várias tabelas que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

Outro caso que pode não ser evidente é quando um banco de dados é replicado, mesmo que não tenha sido especificado ao definir a opção. Se o servidor for iniciado com `--binlog-do-db=sales`, a seguinte declaração `UPDATE` é registrada, mesmo que `prices` não tenha sido incluído ao definir `--binlog-do-db`:

  ```
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

Como o `sales` é o banco de dados padrão quando a declaração `UPDATE` é emitida, o `UPDATE` é registrado.

**Registro baseado em linhas.** O registro é restrito ao banco de dados *`db_name`*. Apenas as alterações nas tabelas pertencentes a *`db_name`* são registradas; o banco de dados padrão não tem efeito sobre isso. Suponha que o servidor seja iniciado com `--binlog-do-db=sales` e o registro baseado em linhas esteja em vigor, e então as seguintes declarações sejam executadas:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

As alterações na tabela `february` no banco de dados `sales` são registradas de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, ao usar o formato de registro baseado em linha e `--binlog-do-db=sales`, as alterações feitas pelos seguintes `UPDATE` não são registradas:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam escritos no log binário.

Outra diferença importante na manipulação do `--binlog-do-db` para o registro baseado em declarações, em oposição ao registro baseado em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que o servidor seja iniciado com `--binlog-do-db=db1`, e as seguintes declarações sejam executadas:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Se você estiver usando o registro baseado em declarações, as atualizações em ambas as tabelas são escritas no log binário. No entanto, ao usar o formato baseado em linhas, apenas as alterações em `table1` são registradas; `table2` está em um banco de dados diferente, portanto, não é alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Neste caso, a declaração `UPDATE` não é escrita no log binário quando se usa o registro baseado em declarações. No entanto, quando se usa o registro baseado em linhas, a mudança para `table1` é registrada, mas não para `table2` — em outras palavras, apenas as alterações nas tabelas do banco de dados nomeado por `--binlog-do-db` são registradas, e a escolha do banco de dados padrão não tem efeito sobre esse comportamento.

* `--binlog-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Esta opção afeta o registro binário de uma maneira semelhante à forma como `--replicate-ignore-db` afeta a replicação.

Os efeitos desta opção dependem de se o formato de registro baseado em declaração ou baseado em linha está em uso, da mesma forma que os efeitos de `--replicate-ignore-db` dependem de se a replicação baseada em declaração ou baseada em linha está em uso. Você deve ter em mente que o formato usado para registrar uma declaração dada não é necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como [[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") e [[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") são sempre registradas como declarações, sem considerar o formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-ignore-db` sempre se aplicam na determinação de se a declaração é registrada ou

**Registro baseado em declarações.** Diga ao servidor que não registre nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

Quando não há um banco de dados padrão, as opções de `--binlog-ignore-db` não são aplicadas e essas declarações são sempre registradas. (Bug #11829838, Bug #60188)

**Formato baseado em linha.** Diz ao servidor que não registre atualizações em nenhuma tabela no banco de dados *`db_name`*. O banco de dados atual não tem efeito.

Ao usar o registro baseado em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que o servidor seja iniciado com `--binlog-ignore-db=sales` e você emita as seguintes declarações:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* registrada nesse caso, porque `--binlog-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar o registro baseado em linha, os efeitos da declaração `UPDATE` *não* são escritos no log binário, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nessa instância, `--binlog-ignore-db=sales` faz com que *todas as* alterações feitas nas tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas para fins de registro binário.

Para especificar mais de um banco de dados a ser ignorado, use esta opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam registradas.

**Opções de verificação de checksum.** O MySQL suporta leitura e escrita de verificações de checksums de log binário. Essas opções são ativadas usando as duas opções listadas aqui:

* `--binlog-checksum={NONE|CRC32}`

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>CRC32</code></p></td> </tr></tbody></table>

Ativação desta opção faz com que a fonte escreva verificações de checksum para eventos escritos no log binário. Defina para `NONE` para desabilitar, ou o nome do algoritmo a ser usado para gerar verificações de checksum; atualmente, apenas verificações de checksum CRC32 são suportadas, e CRC32 é o padrão. Não é possível alterar a configuração desta opção dentro de uma transação.

Para controlar a leitura de verificações de checksums pelo replica (do log do relé), use a opção `--slave-sql-verify-checksum`.

**Opções de teste e depuração.** As seguintes opções de log binário são usadas em testes e depuração de replicação. Elas não são destinadas ao uso em operações normais.

* `--max-binlog-dump-events=N`

  <table frame="box" rules="all" summary="Properties for max-binlog-dump-events"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-binlog-dump-events=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração.

* `--sporadic-binlog-dump-fail`

  <table frame="box" rules="all" summary="Properties for sporadic-binlog-dump-fail"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração.

##### Variáveis do sistema usadas com registro binário

A lista a seguir descreve as variáveis do sistema para o controle de registro binário. Elas podem ser definidas na inicialização do servidor e algumas delas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas para controlar o registro binário estão listadas anteriormente nesta seção.

* `binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_cache_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294963200</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

O tamanho do buffer de memória para armazenar as alterações no log binário durante uma transação.

Quando o registro binário está habilitado no servidor (com a variável de sistema `log_bin` definida como ON), um cache de registro binário é alocado para cada cliente, se o servidor suportar quaisquer motores de armazenamento transacional. Se os dados da transação excederem o espaço no buffer de memória, os dados excedentes são armazenados em um arquivo temporário. Quando a criptografia do registro binário está ativa no servidor, o buffer de memória não é criptografado, mas (a partir do MySQL 8.0.17) qualquer arquivo temporário usado para armazenar o cache do registro binário é criptografado. Após cada transação ser comprometida, o cache de registro binário é redefinido, apagando o buffer de memória e truncando o arquivo temporário, se usado.

Se você usa frequentemente transações grandes, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_cache_use` e `Binlog_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 7.4.4, “O Log Binário”.

`binlog_cache_size` define o tamanho do cache de transações apenas; o tamanho do cache de declarações é regido pela variável de sistema `binlog_stmt_cache_size`.

* `binlog_checksum`

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_checksum</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>CRC32</code></p></td> </tr></tbody></table>

Quando habilitada, essa variável faz com que a fonte escreva um checksum para cada evento no log binário. `binlog_checksum` suporta os valores `NONE` (que desabilita os checksums) e `CRC32`. O padrão é `CRC32`. Quando `binlog_checksum` é desativado (valor `NONE`), o servidor verifica que está escrevendo apenas eventos completos no log binário, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

Definir essa variável na fonte para um valor não reconhecido pela réplica faz com que a réplica defina seu próprio valor `binlog_checksum` para `NONE`, e pare a replicação com um erro. Se a compatibilidade reversa com réplicas mais antigas é uma preocupação, você pode querer definir o valor explicitamente para `NONE`.

Até e incluindo o MySQL 8.0.20, a Replicação por Grupo não pode utilizar verificações de checksum e não suporta sua presença no log binário, portanto, você deve definir `binlog_checksum=NONE` ao configurar uma instância do servidor para se tornar um membro do grupo. A partir do MySQL 8.0.21, a Replicação por Grupo suporta verificações de checksum, portanto, os membros do grupo podem usar o ajuste padrão.

Altere o valor de `binlog_checksum` para fazer com que o log binário seja rotado, porque os checksums devem ser escritos para um arquivo de log binário inteiro e nunca apenas para uma parte dele. Não é possível alterar o valor de `binlog_checksum` dentro de uma transação.

Quando a compressão de transações de registro binário é habilitada usando a variável de sistema `binlog_transaction_compression`, os checksums não são escritos para eventos individuais em um payload de transação comprimida. Em vez disso, um checksum é escrito para o evento GTID e um checksum para o `Transaction_payload_event` comprimido.

* `binlog_direct_non_transactional_updates`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

Devido a problemas de concorrência, uma replica pode se tornar inconsistente quando uma transação contém atualizações em tabelas tanto transacionais quanto não transacionais. O MySQL tenta preservar a causalidade entre essas declarações, escrevendo declarações não transacionais no cache de transação, que é apagado após o commit. No entanto, problemas surgem quando as modificações feitas em tabelas não transacionais em nome de uma transação se tornam imediatamente visíveis para outras conexões, porque essas mudanças podem não ser escritas imediatamente no log binário.

A variável `binlog_direct_non_transactional_updates` oferece uma solução possível para este problema. Por padrão, essa variável está desativada. Ativação de `binlog_direct_non_transactional_updates` faz com que as atualizações de tabelas não transacionais sejam escritas diretamente no log binário, em vez de no cache de transação.

A partir do MySQL 8.0.14, definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

*`binlog_direct_non_transactional_updates` funciona apenas para declarações que são replicadas usando o formato de registro binário baseado em declarações*; ou seja, funciona apenas quando o valor de `binlog_format` é `STATEMENT`, ou quando `binlog_format` é `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em declarações. Esta variável não tem efeito quando o formato de registro binário é `ROW`, ou quando `binlog_format` está definido como `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em linhas.

Importante

Antes de habilitar essa variável, você deve garantir que não haja dependências entre as tabelas transacionais e não transacionais; um exemplo de tal dependência seria a declaração `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, essas declarações provavelmente farão com que a replica se afastem da fonte.

Essa variável não tem efeito quando o formato de registro binário é `ROW` ou `MIXED`.

* `binlog_encryption`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

Permite a criptografia de arquivos de registro binários e arquivos de registro de retransmissão neste servidor. `OFF` é o padrão. `ON` define a criptografia para arquivos de registro binários e arquivos de registro de retransmissão. O registro de log binário não precisa ser habilitado no servidor para habilitar a criptografia, então você pode criptografar os arquivos de registro de retransmissão em uma replica que não tenha registro de log binário. Para usar a criptografia, um plugin de chave deve ser instalado e configurado para fornecer o serviço de chave do MySQL Server. Para obter instruções sobre como fazer isso, consulte a Seção 8.4.4, “O Registro de Chave MySQL”. Qualquer plugin de chave compatível pode ser usado para armazenar chaves de criptografia de registro de log binário.

Quando você inicia o servidor pela primeira vez com a criptografia de log binário habilitada, uma nova chave de criptografia de log binário é gerada antes que os logs binários e os logs de relevo sejam inicializados. Essa chave é usada para criptografar uma senha de arquivo para cada arquivo de log binário (se o servidor tiver criptografia de log binário habilitada) e arquivo de log de relevo (se o servidor tiver canais de replicação), e chaves adicionais geradas a partir das senhas de arquivo são usadas para criptografar os dados nos arquivos. Os arquivos de log de relevo são criptografados para todos os canais, incluindo canais de aplicação de replicação de grupo e novos canais que são criados após a ativação da criptografia. O arquivo de índice de log binário e o arquivo de índice de log de relevo nunca são criptografados.

Se você ativar o criptogramação enquanto o servidor estiver em execução, uma nova chave de criptogramação do log binário será gerada naquela época. A exceção é se o criptogramação estava ativa anteriormente no servidor e foi então desativada, nesse caso, a chave de criptogramação do log binário que estava em uso antes é usada novamente. O arquivo de log binário e os arquivos de log de releio são rotados imediatamente e as senhas dos arquivos novos e todos os arquivos de log binário subsequentes e os arquivos de log de releio são criptografados usando essa chave de criptogramação do log binário. Os arquivos de log binário e os arquivos de log de releio existentes que ainda estão presentes no servidor não são criptografados automaticamente, mas você pode excluí-los se eles não forem mais necessários.

Se você desativar a criptografia alterando a variável de sistema `binlog_encryption` para `OFF`, o arquivo de registro binário e os arquivos de registro de releio são rotados imediatamente e todo o registro subsequente é descriptografado. Arquivos criptografados anteriormente não são descriptografados automaticamente, mas o servidor ainda é capaz de lê-los. O privilégio `BINLOG_ENCRYPTION_ADMIN` (ou o privilégio descontinuado `SUPER`) é necessário para ativar ou desativar a criptografia enquanto o servidor está em execução. Os canais do aplicativo de replicação de grupo não são incluídos na solicitação de rotação de registro de releio, então o registro descriptografado para esses canais não começa até que seus logs sejam rotados no uso normal.

Para mais informações sobre criptografia de arquivos de registro binários e arquivos de registro de relevo, consulte a Seção 19.3.2, “Criptografando arquivos de registro binários e arquivos de registro de relevo”.

* `binlog_error_action`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

Controla o que acontece quando o servidor encontra um erro, como não conseguir escrever, esvaziar ou sincronizar o log binário, o que pode fazer com que o log binário da fonte se torne inconsistente e as réplicas percam a sincronização.

Essa variável tem como padrão `ABORT_SERVER`, o que faz com que o servidor pare de registrar e desligue sempre que encontrar um erro desse tipo no log binário. Na reinicialização, a recuperação prossegue como no caso de uma parada inesperada do servidor (consulte Seção 19.4.2, “Tratamento de uma parada inesperada de uma réplica”).

Quando `binlog_error_action` está definido como `IGNORE_ERROR`, se o servidor encontrar esse erro, ele continua a transação em andamento, registra o erro e, em seguida, interrompe o registro, e continua a realizar atualizações. Para retomá-lo o registro binário `log_bin` deve ser habilitado novamente, o que requer o reinício do servidor. Esse ajuste oferece compatibilidade reversa com versões mais antigas do MySQL.

* `binlog_expire_logs_seconds`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

Define o período de expiração do log binário em segundos. Após o término do período de expiração, os arquivos de log binário podem ser removidos automaticamente. As remoções possíveis ocorrem no início e quando o log binário é esvaziado. O esvaziamento do log ocorre conforme indicado na Seção 7.4, "Logs do MySQL Server".

O período padrão de expiração do log binário é de 2592000 segundos, o que equivale a 30 dias (30 * 24 * 60 * 60 segundos). O padrão se aplica se nem `binlog_expire_logs_seconds` nem a variável de sistema descontinuada `expire_logs_days` tiverem um valor definido no início. Se um valor não nulo para uma das variáveis `binlog_expire_logs_seconds` ou `expire_logs_days` for definido no início, esse valor é usado como período de expiração do log binário. Se um valor não nulo para ambas as variáveis for definido no início, o valor de `binlog_expire_logs_seconds` é usado como período de expiração do log binário, e o valor de `expire_logs_days` é ignorado com uma mensagem de aviso.

Durante a execução, não é possível definir `binlog_expire_logs_seconds` ou `expire_logs_days` para um valor não nulo se o outro estiver definido como não nulo. Como o valor padrão para `binlog_expire_logs_seconds` é não nulo, você deve explicitamente definir `binlog_expire_logs_seconds` para zero antes de poder definir ou alterar o valor de `expire_logs_days`.

Começando com o MySQL 8.0.29, a eliminação automática do log binário pode ser desativada definindo a variável de sistema `binlog_expire_logs_auto_purge` para `OFF`. Isso tem precedência sobre qualquer configuração para `binlog_expire_logs_seconds`.

Em MySQL 8.0.28 e versões anteriores, para desabilitar a limpeza automática do log binário, especifique explicitamente um valor de 0 para `binlog_expire_logs_seconds`, e não especifique um valor para `expire_logs_days`. Para compatibilidade com versões anteriores, a limpeza automática também é desativada se você especificar explicitamente um valor de 0 para `expire_logs_days` e não especificar um valor para `binlog_expire_logs_seconds`. Nesse caso, o padrão para `binlog_expire_logs_seconds` não é aplicado.

Para remover arquivos de registro binários manualmente, use a declaração `PURGE BINARY LOGS`. Veja a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

* `binlog_expire_logs_auto_purge`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

Habilita ou desabilita a limpeza automática de arquivos de registro binários. Definir essa variável para `ON` (padrão) habilita a limpeza automática; definí-la para `OFF` desabilita a limpeza automática. O intervalo de espera antes da limpeza é controlado por `binlog_expire_logs_seconds` e `expire_logs_days`.

Nota

Mesmo que `binlog_expire_logs_auto_purge` seja `ON`, definir tanto `binlog_expire_logs_seconds` quanto `expire_logs_days` como `0` para que o purga automático não ocorra.

Essa variável não tem efeito sobre `PURGE BINARY LOGS`(purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement").

* `binlog_format`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

Essa variável de sistema define o formato de registro binário e pode ser qualquer uma das opções `STATEMENT`, `ROW` ou `MIXED`. (Veja a Seção 19.2.1, “Formatos de Replicação”.) O ajuste entra em vigor quando o registro binário está habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 8.0, o registro binário é habilitado por padrão e, por padrão, utiliza o formato baseado em linha.

Nota

`binlog_format` é descontinuado a partir do MySQL 8.0.34 e está sujeito à remoção em uma versão futura do MySQL. Isso implica que o suporte para formatos de registro que não sejam baseados em linhas também está sujeito à remoção em uma versão futura. Assim, apenas o registro baseado em linhas deve ser empregado para quaisquer novas configurações de replicação do MySQL.

`binlog_format` pode ser definido na inicialização ou durante a execução, exceto que, em algumas condições, alterar essa variável durante a execução não é possível ou causa o fracasso da replicação, conforme descrito mais adiante.

O padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replicação baseada em declarações não é suportada para o NDB Cluster.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

As regras que regem quando as alterações nesta variável entram em vigor e por quanto tempo o efeito dura são as mesmas que para outras variáveis do sistema do servidor MySQL. Para mais informações, consulte a Seção 15.7.6.1, "Sintaxe SET para atribuição de variáveis".

Quando `MIXED` é especificado, a replicação baseada em declarações é usada, exceto nos casos em que apenas a replicação baseada em linhas garante resultados adequados. Por exemplo, isso acontece quando as declarações contêm funções carregáveis ou a função `UUID()`.

Para obter detalhes sobre como os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) são tratados quando cada formato de registro binário é definido, consulte a Seção 27.7, “Registro binário de programas armazenados”.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

+ O formato de replicação não pode ser alterado dentro de uma função armazenada ou de um gatilho.

+ Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).

+ Se houver tabelas temporárias abertas em qualquer canal de replicação, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

+ Se houver algum fio aplicando o canal de replicação em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

Tentar mudar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, porque essa ação não modifica o valor da variável global do sistema em tempo de execução e só se torna eficaz após o reinício do servidor.

Não é recomendado alterar o formato de replicação em tempo de execução quando houver tabelas temporárias, porque as tabelas temporárias são registradas apenas quando se usa replicação baseada em declarações, enquanto que, com replicação baseada em linhas e replicação mista, elas não são registradas.

Mudar o formato de registro em um servidor de fonte de replicação não faz com que a réplica mude seu formato de registro para corresponder. Alterar o formato de replicação enquanto a replicação está em andamento pode causar problemas se a réplica tiver registro binário habilitado, e a mudança resultar na réplica usando registro no formato `STATEMENT` enquanto a fonte está usando registro no formato `ROW` ou `MIXED`. A réplica não é capaz de converter entradas de registro binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio registro binário, então essa situação pode causar falha na replicação. Para mais informações, consulte a Seção 7.4.4.2, “Definindo o Formato de Registro Binário”.

O formato de log binário afeta o comportamento das seguintes opções do servidor:

+ `--replicate-do-db`
  + `--replicate-ignore-db`
  + `--binlog-do-db`
  + `--binlog-ignore-db`

Esses efeitos são discutidos em detalhes nas descrições das opções individuais.

* `binlog_group_commit_sync_delay`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

Controla quantos microsegundos o registro binário de commit espera antes de sincronizar o arquivo do registro binário no disco. Por padrão, `binlog_group_commit_sync_delay` está definido como 0, o que significa que não há atraso. Definir `binlog_group_commit_sync_delay` com um atraso de microsegundo permite que mais transações sejam sincronizadas juntas no disco de uma vez, reduzindo o tempo geral para comprometer um grupo de transações, pois os grupos maiores requerem menos unidades de tempo por grupo.

Quando `sync_binlog=0` ou `sync_binlog=1` é definido, o atraso especificado por `binlog_group_commit_sync_delay` é aplicado para cada grupo de commit de log binário antes da sincronização (ou, no caso de `sync_binlog=0`, antes de prosseguir). Quando `sync_binlog` é definido para um valor *n* maior que 1, o atraso é aplicado após cada *n* grupos de commit de log binário.

Definir `binlog_group_commit_sync_delay` pode aumentar o número de transações de commit paralelas em qualquer servidor que tenha (ou possa ter após uma falha) uma replica, e, portanto, pode aumentar a execução paralela nas réplicas. Para se beneficiar desse efeito, os servidores de réplica devem ter definido `replica_parallel_type=LOGICAL_CLOCK` (a partir do MySQL 8.0.26) ou `slave_parallel_type=LOGICAL_CLOCK`, e o efeito é mais significativo quando `binlog_transaction_dependency_tracking=COMMIT_ORDER` também é definido. É importante levar em consideração tanto o throughput da fonte quanto o throughput das réplicas ao ajustar a configuração para `binlog_group_commit_sync_delay`.

Definir `binlog_group_commit_sync_delay` também pode reduzir o número de chamadas `fsync()` ao log binário em qualquer servidor (fonte ou replica) que tenha um log binário.

Observe que a definição de `binlog_group_commit_sync_delay` aumenta a latência das transações no servidor, o que pode afetar as aplicações do cliente. Além disso, em cargas de trabalho altamente concorrentes, é possível que o atraso aumente a concorrência e, portanto, reduza o desempenho. Normalmente, os benefícios da definição de um atraso superam as desvantagens, mas o ajuste sempre deve ser realizado para determinar a configuração ótima.

* `binlog_group_commit_sync_no_delay_count`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

O número máximo de transações a serem esperadas antes de abortar o atraso atual, conforme especificado por `binlog_group_commit_sync_delay`. Se `binlog_group_commit_sync_delay` estiver definido como 0, então esta opção não terá efeito.

* `binlog_max_flush_queue_time`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

`binlog_max_flush_queue_time` é desatualizado e marcado para eventual remoção em uma versão futura do MySQL. Anteriormente, essa variável de sistema controlava o tempo em microsegundos para continuar lendo transações da fila de esvaziamento antes de prosseguir com o grupo de comprometimento. Não tem mais nenhum efeito.

* `binlog_order_commits`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

Quando essa variável é habilitada em um servidor de fonte de replicação (que é o padrão), as instruções de comprovação de transações emitidas para os motores de armazenamento são serializadas em um único fio, de modo que as transações são sempre comprometidas na mesma ordem em que são escritas no log binário. Desabilitar essa variável permite que as instruções de comprovação de transações sejam emitidas usando vários fios. Usada em combinação com o compromisso de grupo de log binário, isso impede que a taxa de comprometimento de uma única transação seja um gargalo para o desempenho e, portanto, pode produzir uma melhoria de desempenho.

As transações são escritas no log binário no ponto em que todos os motores de armazenamento envolvidos confirmaram que a transação está preparada para ser confirmada. A lógica de commit do grupo de log binário então confirma um grupo de transações após a escrita no log binário ter ocorrido. Quando o `binlog_order_commits` é desativado, porque vários threads são usados para este processo, as transações em um grupo de commit podem ser confirmadas em uma ordem diferente da ordem em que estão no log binário. (As transações de um único cliente sempre são confirmadas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transações separadas devem produzir resultados consistentes, e se isso não for o caso, uma única transação deve ser usada em vez disso.

Se você deseja garantir que o histórico de transações no banco de origem e na replica multithread permaneça idêntico, defina `slave_preserve_commit_order=1` na replica.

* `binlog_rotate_encryption_master_key_at_startup`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

Especifica se a chave mestre de criptografia do log binário é rotacionada ou não ao iniciar o servidor. A chave mestre de criptografia do log binário é a chave de criptografia do log binário que é usada para criptografar as senhas dos arquivos dos arquivos de log binário e dos arquivos de log de releio no servidor. Quando um servidor é iniciado pela primeira vez com a criptografia de log binário habilitada (`binlog_encryption=ON`), uma nova chave de criptografia de log binário é gerada e usada como a chave mestre de criptografia do log binário. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` também for definida como `ON`, sempre que o servidor for reiniciado, uma chave de criptografia de log binário adicional é gerada e usada como a chave mestre de criptografia do log binário para todos os arquivos de log binário e arquivos de log de releio subsequentes. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` for definida como `OFF`, que é a opção padrão, a chave mestre de criptografia do log binário existente é usada novamente após o servidor ser reiniciado. Para mais informações sobre as chaves de criptografia de log binário e a chave mestre de criptografia do log binário, consulte a Seção 19.3.2, “Criptografando arquivos de log binário e arquivos de log de releio”.

* `binlog_row_event_max_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

Quando o registro binário baseado em linha é usado, essa configuração é um limite suave para o tamanho máximo de um evento de registro binário baseado em linha, em bytes. Sempre que possível, os registros armazenados no registro binário são agrupados em eventos com um tamanho que não exceda o valor dessa configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O padrão é de 8192 bytes.

Essa variável de sistema global é somente de leitura e pode ser definida apenas na inicialização do servidor. Seu valor, portanto, só pode ser modificado usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a declaração `SET`.

* `binlog_row_image`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

Para a replicação baseada em linha do MySQL, essa variável determina como as imagens de linha são escritas no log binário.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

Na replicação baseada em linha do MySQL, cada evento de mudança de linha contém duas imagens, uma imagem “antes” cujos campos são correspondidos quando se busca a linha a ser atualizada, e uma imagem “depois” contendo as mudanças. Normalmente, o MySQL registra linhas completas (ou seja, todos os campos) tanto para as imagens antes quanto depois. No entanto, não é estritamente necessário incluir todos os campos em ambas as imagens, e muitas vezes podemos economizar disco, memória e uso de rede ao registrar apenas os campos que são realmente necessários.

Nota

Ao excluir uma linha, apenas a imagem anterior é registrada, uma vez que não há valores alterados para propagar após a exclusão. Ao inserir uma linha, apenas a imagem posterior é registrada, uma vez que não há uma linha existente para ser correspondida. Somente ao atualizar uma linha, as imagens anterior e posterior são necessárias e ambas são escritas no log binário.

Para a imagem anterior, é necessário apenas registrar o conjunto mínimo de colunas necessárias para identificar de forma única as linhas. Se a tabela que contém a linha tiver uma chave primária, então apenas a(s) coluna(s) da chave primária são escritas no log binário. Caso contrário, se a tabela tiver uma chave única cujas colunas são todas `NOT NULL`, então apenas as colunas da chave única precisam ser registradas. (Se a tabela não tiver uma chave primária nem uma chave única sem quaisquer colunas `NULL`, então todas as colunas devem ser usadas na imagem anterior e registradas.) Na imagem posterior, é necessário registrar apenas as colunas que realmente mudaram.

Você pode fazer com que o servidor registre linhas completas ou mínimas usando a variável de sistema `binlog_row_image`. Essa variável, na verdade, assume um dos três valores possíveis, conforme mostrado na lista a seguir:

+ `full`: Registre todas as colunas na imagem antes e na imagem depois.

+ `minimal`: Registre apenas as colunas da imagem anterior que são necessárias para identificar a linha que será alterada; registre apenas as colunas da imagem final onde um valor foi especificado pelo SQL ou gerado por auto-incremento.

+ `noblob`: Registre todas as colunas (mesma que `full`), exceto as colunas `BLOB` e `TEXT` que não são necessárias para identificar as linhas, ou que não foram alteradas.

Nota

Essa variável não é suportada pelo NDB Cluster; definir essa variável não tem efeito sobre o registro das tabelas `NDB`.

O valor padrão é `full`.

Ao usar `minimal` ou `noblob`, as operações de exclusão e atualização são garantidas para funcionar corretamente para uma tabela específica se e somente se as seguintes condições forem verdadeiras tanto para a tabela de origem quanto para a tabela de destino:

+ Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo tipo de dados que sua contraparte na outra tabela.

+ As tabelas devem ter definições de chave primária idênticas.

(Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de índices que não fazem parte das chaves primárias das tabelas.)

Se essas condições não forem atendidas, é possível que os valores das colunas da chave primária na tabela de destino possam se provar insuficientes para fornecer uma correspondência única para uma exclusão ou atualização. Nesse caso, nenhum aviso ou erro é emitido; a fonte e a réplica divergem silenciosamente, rompendo assim a consistência.

Esta variável não tem efeito quando o formato de registro binário é `STATEMENT`. Quando `binlog_format` é `MIXED`, o ajuste para `binlog_row_image` é aplicado a alterações que são registradas usando o formato baseado em linha, mas este ajuste não tem efeito em alterações registradas como declarações.

Definir `binlog_row_image` em nível global ou de sessão não causa um compromisso implícito; isso significa que essa variável pode ser alterada enquanto uma transação está em andamento sem afetar a transação.

* `binlog_row_metadata`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

Configura a quantidade de metadados da tabela adicionados ao log binário ao usar o registro baseado em linha. Quando definido como `MINIMAL`, o padrão, apenas os metadados relacionados aos `SIGNED` flags, conjuntos de caracteres de coluna e tipos de geometria são registrados. Quando definido como `FULL`, são registrados metadados completos para as tabelas, como o nome da coluna, valores de cadeia `ENUM` ou `SET`, `PRIMARY KEY` informações, e assim por diante.

Os metadados estendidos servem aos seguintes propósitos:

+ As réplicas utilizam os metadados para transferir dados quando sua estrutura de tabela é diferente da do banco de origem.

+ O software externo pode usar os metadados para decodificar eventos de linha e armazenar os dados em bancos de dados externos, como um armazém de dados.

* `binlog_row_value_options`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

Quando configurado em `PARTIAL_JSON`, isso permite o uso de um formato de log binário eficiente em termos de espaço para atualizações que modificam apenas uma pequena parte de um documento JSON, o que faz com que a replicação baseada em linhas escreva apenas as partes modificadas do documento JSON na imagem posterior para a atualização no log binário, em vez de escrever o documento completo (veja Atualizações Parciais de Valores JSON). Isso funciona para uma declaração `UPDATE` que modifica uma coluna JSON usando qualquer sequência de `JSON_SET()`, `JSON_REPLACE()` e `JSON_REMOVE()`. Se o servidor não conseguir gerar uma atualização parcial, o documento completo é usado em vez disso.

O valor padrão é uma string vazia, que desativa o uso do formato. Para desativar `binlog_row_value_options` e voltar a escrever o documento JSON completo, defina seu valor como uma string vazia.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

`binlog_row_value_options=PARTIAL_JSON` entra em vigor apenas quando o registro binário está habilitado e `binlog_format` está definido para `ROW` ou `MIXED`. A replicação baseada em declarações *sempre* registra apenas as partes modificadas do documento JSON, independentemente de qualquer valor definido para `binlog_row_value_options`. Para maximizar a quantidade de espaço economizado, use `binlog_row_image=NOBLOB` ou `binlog_row_image=MINIMAL` juntamente com esta opção. `binlog_row_image=FULL` economiza menos espaço do que qualquer um desses, uma vez que o documento JSON completo é armazenado na imagem anterior, e a atualização parcial é armazenada apenas na imagem posterior.

A saída do **mysqlbinlog** inclui atualizações parciais em formato JSON, na forma de eventos codificados como strings baseadas em 64 `BINLOG` utilizando declarações. Se a opção `--verbose` for especificada, o **mysqlbinlog** exibe as atualizações parciais em formato JSON legíveis usando declarações pseudo-SQL.

A replicação do MySQL gera um erro se uma modificação não puder ser aplicada ao documento JSON na replica. Isso inclui a falha em encontrar o caminho. Esteja ciente de que, mesmo com isso e outros verificações de segurança, se um documento JSON em uma replica divergir do documento da fonte e uma atualização parcial for aplicada, ainda é teoricamente possível produzir um documento JSON válido, mas inesperado, na replica.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

Essa variável de sistema afeta apenas o registro baseado em linha. Quando habilitada, ela faz com que o servidor escreva eventos de registro informativos, como eventos de registro de consulta de linha, em seu log binário. Essas informações podem ser usadas para depuração e propósitos relacionados, como obter a consulta original emitida na fonte quando não puder ser reconstruída a partir das atualizações de linha.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

Esses eventos informativos são normalmente ignorados pelos programas do MySQL que leem o log binário e, portanto, não causam problemas ao replicar ou restaurar a partir de um backup. Para visualizá-los, aumente o nível de verbosidade usando a opção `--verbose` do mysqlbinlog duas vezes, como `-vv` ou `--verbose --verbose`.

* `binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

O tamanho do buffer de memória para o log binário para armazenar declarações não transacionais emitidas durante uma transação.

Quando o registro binário está habilitado no servidor (com a variável de sistema `log_bin` definida como ON), caches separados de transações e declarações de registro binário são alocados para cada cliente, se o servidor suportar quaisquer motores de armazenamento transacional. Se os dados das declarações não transacionais usadas na transação excederem o espaço no buffer de memória, os dados em excesso são armazenados em um arquivo temporário. Quando a criptografia do registro binário está ativa no servidor, o buffer de memória não é criptografado, mas (a partir do MySQL 8.0.17) qualquer arquivo temporário usado para armazenar o cache do registro binário é criptografado. Após cada transação ser comprometida, o cache de declarações de registro binário é redefinido, apagando o buffer de memória e truncando o arquivo temporário, se usado.

Se você costuma usar declarações grandes que não estão relacionadas a transações durante as transações, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_stmt_cache_use` e `Binlog_stmt_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 7.4.4, “O Log Binário”.

A variável de sistema `binlog_cache_size` define o tamanho do cache de transações.

* `binlog_transaction_compression`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

Permite a compressão para as transações que são escritas em arquivos de registro binários neste servidor. `OFF` é o padrão. Use a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo `zstd` que é usado para compressão.

A definição de `binlog_transaction_compression` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA` (`START SLAVE`).

Quando a compressão de transações de registro binário é habilitada, os payloads das transações são comprimidos e, em seguida, escritos no arquivo de registro binário como um único evento (`Transaction_payload_event`). Os payloads de transações comprimidos permanecem em estado comprimido enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação do grupo ou clientes como **mysqlbinlog**, e são escritos no log de releio ainda em seu estado comprimido. A compressão de transações de registro binário, portanto, economiza espaço de armazenamento tanto no remetente da transação quanto no destinatário (e para seus backups), e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

Para que `binlog_transaction_compression=ON` tenha um efeito direto, o registro binário deve estar habilitado no servidor. Quando uma instância do servidor MySQL não tem um registro binário, se estiver em uma versão do MySQL 8.0.20, ela pode receber, manipular e exibir cargas de transação comprimidas, independentemente de seu valor para `binlog_transaction_compression`. Cargas de transação comprimidas recebidas por tais instâncias de servidor são escritas em seu estado comprimido no registro de retransmissão, então elas se beneficiam indiretamente da compressão realizada por outros servidores na topologia de replicação.

Essa variável de sistema não pode ser alterada no contexto de uma transação. Definir o valor da sessão dessa variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável de Sistema”.

Para obter mais informações sobre a compressão de transações de log binário, incluindo detalhes sobre quais eventos são e não são comprimidos, e mudanças de comportamento quando a compressão de transações está em uso, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

* Antes da NDB 8.0.31*: Definir essa variável quando o servidor está em execução não tem efeito sobre o registro de transações em tabelas `NDB`. A compressão de transações de log binário pode ser habilitada para tabelas `NDB` iniciando o MySQL com `--binlog-transaction-compression=ON` na linha de comando ou em um arquivo de opção, mas não pode ser habilitada ou desabilitada enquanto o servidor está em execução.

*No NDB 8.0.31 e versões posteriores*: Você pode usar a variável de sistema `ndb_log_transaction_compression` para habilitar este recurso para `NDB`. Além disso, definir `--binlog-transaction-compression=ON` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja habilitado na inicialização do servidor. Consulte a descrição da variável para obter mais informações.

* `binlog_transaction_compression_level_zstd`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

Define o nível de compressão para a compressão de transações de registro binário neste servidor, que é habilitado pela variável de sistema `binlog_transaction_compression`. O valor é um número inteiro que determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). Se você não especificar essa variável de sistema, o nível de compressão é definido como 3.

A definição de `binlog_transaction_compression_level_zstd` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA` (`START SLAVE`).

À medida que o nível de compressão aumenta, a taxa de compressão de dados aumenta, o que reduz o espaço de armazenamento e a largura de banda de rede necessários para o payload da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. O aumento do esforço de compressão não tem uma relação linear com o aumento da taxa de compressão de dados.

Essa variável de sistema não pode ser alterada no contexto de uma transação. Definir o valor da sessão dessa variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável de Sistema”.

Essa variável não afeta o registro de transações nas tabelas `NDB`; no NDB Cluster 8.0.31 e versões posteriores, você pode usar `ndb_log_transaction_compression_level_zstd` em vez disso.

* `binlog_transaction_dependency_tracking`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

Para um servidor de fonte de replicação que tem réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` tem um valor maior que 0), `binlog_transaction_dependency_tracking` especifica como o **mysqld** fonte gera as informações de dependência que ele escreve no log binário para ajudar as réplicas a determinar quais transações podem ser executadas em paralelo.

As informações de dependência escritas pela fonte de replicação são representadas usando marcações de tempo lógicas. (Assim, definir essa variável requer que `replica_parallel_type` ou `slave_parallel_type` já estejam definidos como `LOGICAL_CLOCK`. Há duas marcações de tempo lógicas, listadas aqui, para cada transação:

+ `sequence_number`: Este é 1 para a primeira transação em um log binário dado, 2 para a segunda transação, e assim por diante. A numeração recomeça com 1 em cada arquivo de log binário.

+ `last_committed`: Isso se refere ao `sequence_number` da transação mais recentemente realizada que foi encontrada em conflito com a transação atual. Esse valor é sempre menor que `sequence_number`.

`binlog_transaction_dependency_tracking` controla a escolha do esquema utilizado para calcular esses timestamps lógicos. As opções disponíveis estão listadas aqui:

+ `COMMIT_ORDER`: Duas transações são consideradas independentes se a janela de tempo de commit da primeira transação sobrepõe-se à janela de tempo de commit da segunda transação. Isso é o padrão.

A janela de tempo de commit começa imediatamente após a execução da última declaração da transação e termina imediatamente antes do commit do motor de armazenamento terminar. Como as transações retêm todos os bloqueios de linha entre esses dois pontos no tempo, sabemos que elas não podem atualizar as mesmas linhas.

+ `WRITESET`: As marcações lógicas são calculadas com base em `COMMIT_ORDER`, em combinação com um segundo esquema baseado em conjuntos de escrita para a transação. Cada linha da transação adiciona um conjunto de um ou mais hashes ao conjunto de escrita da transação, um de cada chave única na linha. (Se não houver chaves únicas e não nulos, é usada uma hash da linha.) Isso inclui tanto linhas excluídas quanto inseridas; para linhas atualizadas, tanto a linha antiga quanto a nova também são incluídas.

Duas transações são consideradas conflitantes se seus conjuntos de escrita se sobrepõem, ou seja, se houver algum número (hash) que ocorre nos conjuntos de escrita de ambas as transações. Além disso, devido à maneira como os conjuntos de escrita são calculados, existem pontos de serialização periódicos, de modo que o processo de cálculo do conjunto de escrita considera cada transação após um ponto de serialização como conflitante com cada transação antes do ponto de serialização. Os pontos de serialização afetam apenas as dependências calculadas pelo algoritmo `WRITESET`; transações em lados opostos do ponto de serialização podem ter janelas de commit-time sobrepostas, e, portanto, podem ser paralelizadas na replica, apesar disso. Os pontos de serialização ocorrem para declarações DDL, para transações que atualizam uma tabela com uma chave estrangeira e para transações onde o valor da sessão de `transaction_write_set_extraction` não é o mesmo que o valor global. Um ponto de serialização também é imposto se as transações comprometidas desde o ponto de serialização anterior geraram um total de pelo menos `binlog_transaction_dependency_history_size` hashes únicos.

Para que as réplicas multithread funcionem com a replicação do NDB Cluster (suportada no NDB 8.0.33 e versões posteriores), essa variável deve ser definida como `WRITESET` na fonte. Consulte a Seção 25.7.11, “Replicação do NDB Cluster Usando o Aplicativo Multithread”, para obter mais informações.

+ `WRITESET_SESSION`: Duas transações são consideradas dependentes se uma das seguintes afirmações for verdadeira:

- As transações dependem de acordo com `WRITESET`.

- As transações foram realizadas na mesma sessão do usuário.

No modo `WRITESET` ou `WRITESET_SESSION`, a fonte utiliza `COMMIT_ORDER` para gerar informações de dependência para transações que têm conjuntos de escrita vazios ou parciais, transações que atualizam tabelas sem chaves primárias ou únicas e transações que atualizam tabelas pai em uma relação de chave estrangeira.

Para definir `binlog_transaction_dependency_tracking` para `WRITESET` ou `WRITESET_SESSION`, `transaction_write_set_extraction` deve ser definido para um valor diferente de `OFF`; o valor padrão (`XXHASH64`) é suficiente para isso. `transaction_write_set_extraction` não pode ser alterado sempre que o valor de `binlog_transaction_dependency_tracking` é `WRITESET` ou `WRITESET_SESSION`. Qualquer alteração no valor não terá efeito para transações replicadas até que a replica tenha sido parada e reiniciada com `STOP REPLICA` e `START REPLICA`.

O número de hashes de linha a serem mantidos e verificados para que a última transação tenha alterado uma determinada linha é determinado pelo valor de `binlog_transaction_dependency_history_size`.

A Replicação em Grupo realiza sua própria paralelização após a certificação ao aplicar transações do log de relevo, independentemente de qualquer valor definido para `binlog_transaction_dependency_tracking`, mas essa variável afeta a forma como as transações são escritas nos logs binários dos membros da Replicação em Grupo. As informações de dependência nesses logs são usadas para auxiliar o processo de transferência de estado de um log binário de um doador para recuperação distribuída, que ocorre sempre que um membro se junta ou se reinserta no grupo. Para esse processo, definir `binlog_transaction_dependency_tracking` para `WRITESET` pode melhorar o desempenho de um membro do grupo, dependendo da carga de trabalho do grupo.

* `binlog_transaction_dependency_history_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Define um limite superior para o número de hashes de linha que são mantidos na memória e usados para procurar a transação que modificou a última linha. Assim que esse número de hashes é atingido, o histórico é apagado.

* `expire_logs_days`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Especifica o número de dias antes da remoção automática dos arquivos de registro binários. `expire_logs_days` é descontinuado e você deve esperar que ele seja removido em uma versão futura. Em vez disso, use `binlog_expire_logs_seconds`, que define o período de expiração do registro binário em segundos. Se você não definir um valor para nenhuma das variáveis do sistema, o período de expiração padrão é de 30 dias. As remoções possíveis ocorrem no início e quando o registro binário é esvaziado. O esvaziamento do registro ocorre conforme indicado na Seção 7.4, “Logs do MySQL Server”.

Qualquer valor não nulo que você especificar no início para `expire_logs_days` é ignorado se `binlog_expire_logs_seconds` também for especificado, e o valor de `binlog_expire_logs_seconds` é usado como o período de expiração do log binário. Uma mensagem de aviso é emitida nessa situação. Um valor não nulo para o início de `expire_logs_days` é aplicado apenas como o período de expiração do log binário se `binlog_expire_logs_seconds` não for especificado ou for especificado como 0.

Durante a execução, não é possível definir `binlog_expire_logs_seconds` ou `expire_logs_days` para um valor não nulo se o outro estiver definido como não nulo. Como o valor padrão para `binlog_expire_logs_seconds` é não nulo, você deve definir explicitamente `binlog_expire_logs_seconds` para zero antes de poder definir ou alterar o valor de `expire_logs_days`.

Para desabilitar a limpeza automática do log binário, especifique explicitamente um valor de 0 para `binlog_expire_logs_seconds`, e não especifique um valor para `expire_logs_days`. Para compatibilidade com versões anteriores, a limpeza automática também é desativada se você especificar explicitamente um valor de 0 para `expire_logs_days` e não especificar um valor para `binlog_expire_logs_seconds`. Nesse caso, o padrão para `binlog_expire_logs_seconds` não é aplicado.

Para remover arquivos de registro binários manualmente, use a declaração `PURGE BINARY LOGS`. Veja a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

* `log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Mostra o status do registro binário no servidor, habilitado (`ON`) ou desabilitado (`OFF`). Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados no log binário, que é usado para backup e replicação. `ON` significa que o log binário está disponível, `OFF` significa que ele não está em uso. A opção `--log-bin` pode ser usada para especificar um nome de base e localização para o log binário.

Em versões anteriores do MySQL, o registro binário era desativado por padrão e ativado se você especificar a opção `--log-bin`. A partir do MySQL 8.0, o registro binário é ativado por padrão, com a variável de sistema `log_bin` definida como `ON`, independentemente de você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário é desativado por padrão. É possível ativar o registro binário neste caso, especificando a opção `--log-bin`.

Se a opção `--skip-log-bin` ou `--disable-log-bin` for especificada na inicialização, o registro binário é desativado, com a variável de sistema `log_bin` definida como `OFF`. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificada, a opção especificada posteriormente terá precedência.

Para informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

* `log_bin_basename`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Contém o nome de base e o caminho para os arquivos de log binários, que podem ser definidos com a opção de servidor `--log-bin`. O comprimento máximo da variável é de 256. No MySQL 8.0, se a opção `--log-bin` não for fornecida, o nome de base padrão é `binlog`. Para compatibilidade com o MySQL 5.7, se a opção `--log-bin` for fornecida sem uma string ou com uma string vazia, o nome de base padrão é `host_name-bin`, usando o nome da máquina hospedeira. O local padrão é o diretório de dados.

* `log_bin_index`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Contém o nome de base e o caminho para o arquivo de índice de log binário, que pode ser definido com a opção de servidor [[`--log-bin-index`]. A máxima variável de comprimento é 256.

* `log_bin_trust_function_creators`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Esta variável é aplicada quando o registro binário está habilitado. Ela controla se os criadores de funções armazenadas podem ser confiáveis para não criar funções armazenadas que possam causar eventos inseguros serem escritos no registro binário. Se definida como 0 (o padrão), os usuários não têm permissão para criar ou alterar funções armazenadas, a menos que tenham o privilégio `SUPER` além do privilégio `CREATE ROUTINE`(privileges-provided.html#priv_create-routine) ou `ALTER ROUTINE`(privileges-provided.html#priv_alter-routine). Uma definição de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida como 1, o MySQL não aplica essas restrições à criação de funções armazenadas. Esta variável também se aplica à criação de gatilhos. Veja a Seção 27.7, “Registro Binário de Programas Armazenados”.

* `log_bin_use_v1_row_events`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Essa variável de sistema somente de leitura é desatualizada. Definir a variável de sistema para `ON` no início do servidor habilitou a replicação baseada em linha com réplicas executando o MySQL Server 5.5 e versões anteriores, escrevendo o log binário usando eventos de linha de log binário da Versão 1, em vez de eventos de linha de log binário da Versão 2, que são o padrão a partir do MySQL 5.6.

* `log_replica_updates`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

A partir do MySQL 8.0.26, use `log_replica_updates` em vez de `log_slave_updates`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `log_slave_updates`.

`log_replica_updates` especifica se as atualizações recebidas por um servidor replicador de um servidor de fonte de replicação devem ser registradas no log binário do próprio replicador.

Ativação desta variável faz com que a replica escreva as atualizações que são recebidas de uma fonte e executadas pelo thread de replicação SQL no próprio log binário da replica. O registro binário, que é controlado pela opção `--log-bin` e é ativado por padrão, também deve ser ativado na replica para que as atualizações sejam registradas. Veja a Seção 19.1.6, “Opções e Variáveis de Replicação e Registro Binário”. `log_replica_updates` é ativado por padrão, a menos que você especifique `--skip-log-bin` para desativar o registro binário, no caso, o MySQL também desativa o registro de atualização da replica por padrão. Se você precisar desativar o registro de atualização da replica quando o registro binário estiver ativado, especifique `--log-replica-updates=OFF` na inicialização do servidor da replica.

Ativação de `log_replica_updates` permite que os servidores de replicação sejam encadeados. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```
  A -> B -> C
  ```

Aqui, `A` serve como fonte para a réplica `B`, e `B` serve como fonte para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma réplica. Com o registro binário habilitado e `log_replica_updates` habilitado, que são as configurações padrão, as atualizações recebidas de `A` são registradas por `B` em seu log binário e, portanto, podem ser passadas para `C`.

* `log_slave_updates`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

A partir do MySQL 8.0.26, `log_slave_updates` é descontinuado e o alias `log_replica_updates` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `log_slave_updates`.

`log_slave_updates` especifica se as atualizações recebidas por um servidor replicador de um servidor de fonte de replicação devem ser registradas no log binário do próprio replicador.

Ativação desta variável faz com que a replica escreva as atualizações que são recebidas de uma fonte e executadas pelo thread de replicação SQL no próprio log binário da replica. O registro binário, que é controlado pela opção `--log-bin` e é ativado por padrão, também deve ser ativado na replica para que as atualizações sejam registradas. Veja a Seção 19.1.6, “Opções e Variáveis de Replicação e Registro Binário”. `log_slave_updates` é ativado por padrão, a menos que você especifique `--skip-log-bin` para desativar o registro binário, no caso, o MySQL também desativa o registro de atualização da replica por padrão. Se você precisar desativar o registro de atualização da replica quando o registro binário estiver ativado, especifique `--log-slave-updates=OFF` na inicialização do servidor da replica.

Ativação de `log_slave_updates` permite que os servidores de replicação sejam encadeados. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```
  A -> B -> C
  ```

Aqui, `A` serve como fonte para a réplica `B`, e `B` serve como fonte para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma réplica. Com o registro binário habilitado e `log_slave_updates` habilitado, que são as configurações padrão, as atualizações recebidas de `A` são registradas por `B` em seu log binário e, portanto, podem ser passadas para `C`.

* `log_statements_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

Se o erro 1592 for encontrado, controla se os avisos gerados serão adicionados ao log de erro ou

* `master_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

A partir do MySQL 8.0.26, `master_verify_checksum` é descontinuado e o alias `source_verify_checksum` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `master_verify_checksum`.

Ativação de `master_verify_checksum` faz com que a fonte verifique eventos lidos do log binário examinando checksums e pare com um erro em caso de incompatibilidade. `master_verify_checksum` é desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar eventos, de modo que apenas eventos completos sejam lidos do log binário.

* `max_binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Se uma transação requer mais do que esse número de bytes, o servidor gera um erro de transação de múltiplos registros que requer mais de 'max_binlog_cache_size' bytes de armazenamento. Quando `gtid_mode` não é `ON`, o valor máximo recomendado é de 4 GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de registro binário maiores que 4 GB; quando `gtid_mode` é `ON`, essa limitação não se aplica e o servidor pode trabalhar com posições de registro binário de tamanho arbitrário.

Se, por algum motivo, o fato de que o `gtid_mode` não é `ON`, ou por algum outro motivo, você precisa garantir que o log binário não exceda um tamanho dado *`maxsize`*, você deve definir essa variável de acordo com a fórmula mostrada aqui:

  ```
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

Esse cálculo leva em consideração as seguintes condições:

+ O servidor escreve no log binário enquanto o tamanho antes de começar a escrever for menor que `max_binlog_size`.

+ O servidor não escreve transações individuais, mas sim grupos de transações. O número máximo possível de transações em um grupo é igual a `max_connections`.

+ O servidor escreve dados que não estão incluídos na cache. Isso inclui um checksum de 4 bytes para cada evento; embora isso aumente menos de 20% no tamanho da transação, esse valor não é desprezível. Além disso, o servidor escreve um `Gtid_log_event` para cada transação; cada um desses eventos pode adicionar mais 1 KB ao que é escrito no log binário.

`max_binlog_cache_size` define o tamanho do cache de transações apenas; o limite superior para o cache de declarações é regido pela variável de sistema `max_binlog_stmt_cache_size`.

A visibilidade das sessões do `max_binlog_cache_size` corresponde à do sistema variável `binlog_cache_size`; em outras palavras, alterar seu valor afeta apenas as novas sessões que são iniciadas após o valor ser alterado.

* `max_binlog_size`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Se uma escrita no log binário causar o tamanho atual do arquivo de registro a exceder o valor desta variável, o servidor rotaciona os logs binários (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e o valor padrão é de 1 GB. Os arquivos de registro binários criptografados têm um cabeçalho adicional de 512 bytes, que está incluído em `max_binlog_size`.

Uma transação é escrita em um único bloco no log binário, portanto, ela nunca é dividida entre vários logs binários. Portanto, se você tiver transações grandes, você pode ver arquivos de log binário maiores que `max_binlog_size`.

Se `max_relay_log_size` for 0, o valor de `max_binlog_size` também se aplica aos registros de relés.

Com GTIDs em uso no servidor, quando o `max_binlog_size` é alcançado, se a tabela do sistema `mysql.gtid_executed` não puder ser acessada para escrever os GTIDs do arquivo de registro binário atual, o registro binário não pode ser rotado. Nessa situação, o servidor responde de acordo com a configuração do seu `binlog_error_action`. Se o `IGNORE_ERROR` estiver definido, um erro é registrado no servidor e o registro binário é interrompido, ou se o `ABORT_SERVER` estiver definido, o servidor é desligado.

* `max_binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Se declarações não transacionais dentro de uma transação exigirem mais do que esse número de bytes de memória, o servidor gera um erro. O valor mínimo é de 4096. Os valores máximo e padrão são 4 GB em plataformas de 32 bits e 16 EB (exabytes) em plataformas de 64 bits.

`max_binlog_stmt_cache_size` define o tamanho do cache de declarações apenas; o limite superior para o cache de transações é regido exclusivamente pela variável de sistema `max_binlog_cache_size`.

* `original_commit_timestamp`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Para uso interno por replicação. Ao executar novamente uma transação em uma replica, este valor é definido para o momento em que a transação foi comprometida na fonte original, medido em microsegundos desde a época. Isso permite que o timestamp de comprometimento original seja propagado em toda a topologia de replicação.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `source_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

A partir do MySQL 8.0.26, use `source_verify_checksum` em vez de `master_verify_checksum`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `master_verify_checksum`.

Ativação de `source_verify_checksum` faz com que a fonte verifique eventos lidos do log binário examinando checksums e pare com um erro em caso de incompatibilidade. `source_verify_checksum` é desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar eventos, de modo que apenas eventos completos sejam lidos do log binário.

* `sql_log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Essa variável controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável da sessão `sql_log_bin` para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão que desabilite temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

* Definir essa variável como `OFF` impede que GTIDs sejam atribuídos a transações no log binário. Se você está usando GTIDs para replicação, isso significa que, mesmo quando o registro binário é habilitado novamente, os GTIDs escritos no log a partir desse ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, na prática, essas transações são perdidas.

* `sync_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Controla a frequência com que o servidor MySQL sincroniza o log binário com o disco.

+ `sync_binlog=0`: Desabilita a sincronização do log binário com o disco pelo servidor MySQL. Em vez disso, o servidor MySQL depende do sistema operacional para esvaziar o log binário com o disco de tempos em tempos, como faz com qualquer outro arquivo. Esta configuração oferece o melhor desempenho, mas, em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram sincronizadas com o log binário.

+ `sync_binlog=1`: Habilita a sincronização do log binário com o disco antes que as transações sejam confirmadas. Esta é a configuração mais segura, mas pode ter um impacto negativo no desempenho devido ao número aumentado de gravações no disco. No caso de uma falha de energia ou falha do sistema operacional, as transações que estão ausentes no log binário estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática desconsidere as transações, o que garante que nenhuma transação seja perdida do log binário.

+ `sync_binlog=N`, onde *`N`* é um valor diferente de 0 ou 1: O log binário é sincronizado com o disco após os grupos de commit do log binário `N` terem sido coletados. No caso de uma falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram esvaziadas para o log binário. Esta configuração pode ter um impacto negativo no desempenho devido ao número aumentado de escritas no disco. Um valor mais alto melhora o desempenho, mas com um risco aumentado de perda de dados.

Para a maior durabilidade e consistência possível em uma configuração de replicação que utiliza `InnoDB` com transações, use esses ajustes:

+ `sync_binlog=1`.  
  + `innodb_flush_log_at_trx_commit=1`.

Cuidado

Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de varredura para disco. Eles podem informar ao **mysqld** que a varredura ocorreu, mesmo que não tenha. Neste caso, a durabilidade das transações não é garantida mesmo com as configurações recomendadas, e, no pior dos casos, uma falta de energia pode corromper os dados do `InnoDB`. Usar um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as varreduras de arquivos e torna a operação mais segura. Você também pode tentar desativar o cache de escritas de disco em caches de hardware.

* `transaction_write_set_extraction`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

Essa variável do sistema especifica o algoritmo usado para hashar as gravações extraídas durante uma transação. O padrão é `XXHASH64`. `OFF` significa que os conjuntos de escrita não são coletados.

`transaction_write_set_extraction` é descontinuado a partir do MySQL 8.0.26; espere que ele seja removido em um lançamento futuro do MySQL.

O ajuste `XXHASH64` é necessário para a Replicação em Grupo, onde o processo de extração dos registros de uma transação é utilizado para detecção de conflitos e certificação em todos os membros do grupo (ver Seção 20.3.1, “Requisitos de Replicação em Grupo”). Para um servidor de fonte de replicação que possui réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido com um valor maior que 0), onde `binlog_transaction_dependency_tracking` está definido como `WRITESET` ou `WRITESET_SESSION`, `transaction_write_set_extraction` não deve ser `OFF`. Embora o valor atual de `binlog_transaction_dependency_tracking` seja `WRITESET` ou `WRITESET_SESSION`, você não pode alterar o valor de `transaction_write_set_extraction`.

A partir do MySQL 8.0.14, definir o valor da sessão desta variável do sistema é uma operação restrita; o usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). O `binlog_format` deve ser definido como `ROW` para alterar o valor do `transaction_write_set_extraction`. Se você alterar o valor, o novo valor não terá efeito em transações replicadas até que a réplica tenha sido parada e reiniciada com [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") e [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement").

#### 19.1.6.5 Variáveis do Sistema de Identificação de Transações Globais

As variáveis de sistema do MySQL Server descritas nesta seção são usadas para monitorar e controlar Identificadores de Transação Global (GTIDs). Para informações adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores de Transação Global”.

* `binlog_gtid_simple_recovery`

  <table frame="box" rules="all" summary="Properties for binlog_gtid_simple_recovery"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_gtid_simple_recovery</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Essa variável controla a forma como os arquivos de registro binários são iterados durante a busca por GTIDs quando o MySQL é iniciado ou reiniciado.

Quando `binlog_gtid_simple_recovery=TRUE`, que é o padrão no MySQL 8.0, os valores de `gtid_executed` e `gtid_purged` são calculados no início, com base nos valores de `Previous_gtids_log_event` nos arquivos de registro binário mais recentes e mais antigos. Para uma descrição da computação, consulte a `gtid_purged` Sistema de Variáveis. Esta configuração acessa apenas dois arquivos de registro binário durante o reinício do servidor. Se todos os registros binários no servidor foram gerados usando o MySQL 5.7.8 ou posterior, `binlog_gtid_simple_recovery=TRUE` pode ser usado com segurança sempre.

Se houver algum registro binário do MySQL 5.7.7 ou versões anteriores no servidor (por exemplo, após uma atualização de um servidor mais antigo para o MySQL 8.0), com `binlog_gtid_simple_recovery=TRUE`, `gtid_executed` e `gtid_purged`, pode ser que eles sejam inicializados incorretamente nas seguintes duas situações:

+ O log binário mais recente foi gerado pelo MySQL 5.7.5 ou versões anteriores, e `gtid_mode` foi `ON` para alguns logs binários, mas `OFF` para o log binário mais recente.

Foi emitida uma declaração `SET @@GLOBAL.gtid_purged` sobre o MySQL 5.7.7 ou versões anteriores, e o log binário que estava ativo no momento da declaração `SET @@GLOBAL.gtid_purged` ainda não foi apagado.

Se um conjunto de GTID incorreto for calculado em qualquer uma dessas situações, ele permanecerá incorreto mesmo se o servidor for reiniciado posteriormente com `binlog_gtid_simple_recovery=FALSE`. Se uma dessas situações se aplicar ou possa se aplicar no servidor, defina `binlog_gtid_simple_recovery=FALSE` antes de iniciar ou reiniciar o servidor.

Quando `binlog_gtid_simple_recovery=FALSE` é definido, o método de cálculo de `gtid_executed` e `gtid_purged` conforme descrito no Sistema de Variável `gtid_purged` é alterado para iterar os arquivos de log binário da seguinte forma:

Em vez de usar o valor de `Previous_gtids_log_event` e eventos de registro de GTID do arquivo de registro binário mais recente, a computação para `gtid_executed` itera a partir do arquivo de registro binário mais recente e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de registro de GTID do primeiro arquivo de registro binário onde encontra um valor de `Previous_gtids_log_event`. Se os arquivos de registro binário mais recentes do servidor não tiverem eventos de registro de GTID, por exemplo, se `gtid_mode=ON` foi usado, mas o servidor foi alterado posteriormente para `gtid_mode=OFF`, esse processo pode levar um longo tempo.

Em vez de usar o valor de `Previous_gtids_log_event` do arquivo de registro binário mais antigo, a computação para `gtid_purged` itera a partir do arquivo de registro binário mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro arquivo de registro binário onde encontra ou um valor não vazio de `Previous_gtids_log_event`, ou pelo menos um evento de registro GTID (indicando que o uso de GTIDs começa nesse ponto). Se os arquivos de registro binário mais antigos do servidor não tiverem eventos de registro GTID, por exemplo, se `gtid_mode=ON` foi definido recentemente no servidor, esse processo pode levar um longo tempo.

* `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Properties for enforce_gtid_consistency"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enforce-gtid-consistency[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>enforce_gtid_consistency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>WARN</code></p></td> </tr></tbody></table>

Dependendo do valor desta variável, o servidor garante a consistência do GTID, permitindo a execução apenas de instruções que podem ser registradas com segurança usando um GTID. Você *deve* definir esta variável para `ON` antes de habilitar a replicação baseada em GTID.

Os valores que o `enforce_gtid_consistency` pode ser configurado para são:

+ `OFF`: todas as transações são permitidas para violar a consistência do GTID.

+ `ON`: nenhuma transação é permitida para violar a consistência do GTID.

+ `WARN`: todas as transações são permitidas para violar a consistência do GTID, mas um aviso é gerado neste caso.

`--enforce-gtid-consistency` só tem efeito se o registro binário ocorrer para uma declaração. Se o registro binário estiver desativado no servidor, ou se as declarações não forem escritas no log binário porque são removidas por um filtro, a consistência GTID não é verificada ou aplicada para as declarações que não são registradas.

Apenas as declarações que podem ser registradas usando declarações seguras GTID podem ser registradas quando `enforce_gtid_consistency` está definido como `ON`, portanto, as operações listadas aqui não podem ser usadas com esta opção:

`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") ou `DROP TEMPORARY TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") declarações dentro de transações.

+ Transações ou declarações que atualizam tanto as tabelas transacionais quanto as não transacionais. Há uma exceção de que DML não transacional é permitido na mesma transação ou na mesma declaração como DML transacional, se todas as tabelas *não transacionais* forem temporárias.

As declarações `CREATE TABLE ... SELECT` e (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") devem ser usadas antes do MySQL 8.0.21. A partir do MySQL 8.0.21, as declarações `CREATE TABLE ... SELECT` e (create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") são permitidas para motores de armazenamento que suportam DDL atômico.

Para mais informações, consulte a Seção 19.1.3.7, “Restrições à Replicação com GTIDs”.

Antes do MySQL 5.7 e nas primeiras versões dessa série de lançamentos, o booleano `enforce_gtid_consistency` tinha como padrão `OFF`. Para manter a compatibilidade com esses lançamentos anteriores, a enumeração tem como padrão `OFF`, e definir `--enforce-gtid-consistency` sem um valor é interpretado como definir o valor para `ON`. A variável também tem múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`, `2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em lançamentos anteriores. Essas mudanças afetam o que é retornado pela variável. Usando `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, todos retornam a forma textual, não a forma numérica. Esta é uma mudança incompatível, pois `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e o Esquema de Informação.

* `gtid_executed`

  <table frame="box" rules="all" summary="Properties for gtid_executed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_executed</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

Quando usado com escopo global, esta variável contém uma representação do conjunto de todas as transações executadas no servidor e GTIDs que foram definidos por uma declaração `SET` `gtid_purged`. Isso é o mesmo que o valor da coluna `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` e `SHOW REPLICA STATUS`. O valor desta variável é um conjunto de GTIDs, consulte Conjuntos de GTIDs para mais informações.

Quando o servidor é iniciado, `@@GLOBAL.gtid_executed` é inicializado. Consulte `binlog_gtid_simple_recovery` para obter mais informações sobre como os registros binários são iterados para preencher `gtid_executed`. Os GTIDs são então adicionados ao conjunto à medida que as transações são executadas ou se qualquer declaração `SET` `gtid_purged` for executada.

O conjunto de transações que podem ser encontradas nos registros binários em qualquer momento é igual a `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`(gtid-functions.html#function_gtid-subtract); ou seja, todas as transações no registro binário que ainda não foram eliminadas.

A emissão de `RESET MASTER` faz com que o valor global (mas não o valor da sessão) desta variável seja redefinido para uma string vazia. Os GTIDs não são removidos de outro modo a partir deste conjunto, exceto quando o conjunto é limpo devido a `RESET MASTER`.

* `gtid_executed_compression_period`

  <table frame="box" rules="all" summary="Properties for gtid_executed_compression_period"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-executed-compression-period=#</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_executed_compression_period</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão (≥ 8.0.23)</th> <td><code>0</code></td> </tr><tr><th>Valor padrão (≤ 8.0.22)</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Compressa a tabela `mysql.gtid_executed` cada vez que esse número de transações tenha sido processado. Quando o registro binário está habilitado no servidor, esse método de compressão não é usado, e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do registro binário. Quando o registro binário está desabilitado no servidor, o thread de compressão dorme até que o número especificado de transações tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor dessa variável do sistema para 0 significa que o thread nunca acorda, então esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

A partir do MySQL 8.0.17, as transações `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado para as transações não `InnoDB`. Se o servidor tiver uma mistura de transações `InnoDB` e não `InnoDB`, a compressão controlada por essa variável do sistema interfere no trabalho desse processo e pode desacelerá-lo significativamente. Por esse motivo, a partir desse lançamento, é recomendável que você defina `gtid_executed_compression_period` para 0.

A partir do MySQL 8.0.23, as transações `InnoDB` e não `InnoDB` são escritas na tabela `mysql.gtid_executed` pelo mesmo processo, e o valor padrão do `gtid_executed_compression_period` é 0.

Veja a tabela Compressão de compressão de gtid_executed do mysql para mais informações.

* `gtid_mode`

  <table frame="box" rules="all" summary="Properties for gtid_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-mode=MODE</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>OFF_PERMISSIVE</code></p><p class="valid-value"><code>ON_PERMISSIVE</code></p><p class="valid-value"><code>ON</code></p></td> </tr></tbody></table>

Controla se o registro baseado em GTID está habilitado e que tipo de transações os registros podem conter. Você deve ter privilégios suficientes para definir variáveis de sistema global. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. `enforce_gtid_consistency` deve ser definido como `ON` antes de você poder definir `gtid_mode=ON`. Antes de modificar essa variável, veja a Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”.

As transações registradas podem ser anônimas ou usar GTIDs. As transações anônimas dependem de um arquivo de registro binário e posição para identificar transações específicas. As transações GTID têm um identificador único que é usado para se referir às transações. Os diferentes modos são:

+ `OFF`: As novas e as transações replicadas devem ser anônimas.

+ `OFF_PERMISSIVE`: Novas transações são anônimas. Transações replicadas podem ser anônimas ou transações GTID.

+ `ON_PERMISSIVE`: Novas transações são transações GTID. Transações replicadas podem ser anônimas ou transações GTID.

+ `ON`: As novas e as transações replicadas devem ser transações GTID.

As mudanças de um valor para outro só podem ser feitas de forma gradual. Por exemplo, se `gtid_mode` está atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

Os valores de `gtid_purged` e `gtid_executed` são persistentes, independentemente do valor de `gtid_mode`. Portanto, mesmo após a alteração do valor de `gtid_mode`, essas variáveis contêm os valores corretos.

* `gtid_next`

  <table frame="box" rules="all" summary="Properties for gtid_next"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_next</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AUTOMATIC</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>AUTOMATIC</code></p><p class="valid-value"><code>ANONYMOUS</code></p><p class="valid-value"><code>&lt;UUID&gt;:&lt;NUMBER&gt;</code></p></td> </tr></tbody></table>

Essa variável é usada para especificar se e como o próximo GTID é obtido.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”).

`gtid_next` pode assumir qualquer um dos seguintes valores:

+ `AUTOMATIC`: Use o próximo ID de transação global gerado automaticamente.

+ `ANONYMOUS`: As transações não possuem identificadores globais e são identificadas apenas por arquivo e posição.

+ Um ID de transação global no formato *`UUID`*:*`NUMBER`*.

Exatamente quais das opções acima são válidas depende da configuração de `gtid_mode`, veja a Seção 19.1.4.1, “Conceitos de Modo de Replicação” para mais informações. A configuração desta variável não tem efeito se `gtid_mode` é `OFF`.

Depois que essa variável tiver sido definida para *`UUID`*:*`NUMBER`*, e uma transação tiver sido comprometida ou desfeita, uma declaração explícita de `SET GTID_NEXT` deve ser emitida novamente antes de qualquer outra declaração.

`DROP TABLE` ou [`DROP TEMPORARY TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") falha com um erro explícito quando usado em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando motores de armazenamento transacional com tabelas temporárias usando motores de armazenamento não transacional.

* `gtid_owned`

  <table frame="box" rules="all" summary="Properties for gtid_owned"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_owned</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

Essa variável somente de leitura é utilizada principalmente para uso interno. Seu conteúdo depende de seu escopo.

+ Quando usado com escopo global, `gtid_owned` contém uma lista de todos os GTIDs que estão atualmente em uso no servidor, com os IDs dos threads que os possuem. Essa variável é principalmente útil para uma replica multi-thread para verificar se uma transação já está sendo aplicada em outro thread. Um thread aplicando a propriedade de um GTID de uma transação o tempo todo que está processando a transação, então `@@global.gtid_owned` mostra o GTID e o proprietário durante a duração do processamento. Quando uma transação foi comprometida (ou revertida), o thread aplicando a propriedade do GTID libera a propriedade do GTID.

+ Quando usado com escopo de sessão, `gtid_owned` contém um único GTID que está atualmente em uso e pertence a esta sessão. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente explicitamente atribuiu um GTID para a transação, definindo `gtid_next`. Neste caso, `@@session.gtid_owned` exibe o GTID durante todo o tempo em que o cliente está processando a transação, até que a transação tenha sido comprometida (ou desfeita). Quando o cliente tiver terminado de processar a transação, a variável é limpa. Se `gtid_next=AUTOMATIC` for usado para a sessão, `gtid_owned` é preenchido apenas brevemente durante a execução da declaração de compromisso para a transação, portanto, não pode ser observado a partir da sessão em questão, embora seja listado se `@@global.gtid_owned` for lido no ponto certo. Se você tiver a necessidade de rastrear os GTIDs que são manipulados por um cliente em uma sessão, você pode habilitar o rastreador de estado de sessão controlado pela variável de sistema `session_track_gtids`.

* `gtid_purged`

  <table frame="box" rules="all" summary="Properties for gtid_purged"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_purged</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

O valor global da variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) é um conjunto de GTID que consiste nos GTID de todas as transações que foram comprometidas no servidor, mas que não existem em nenhum arquivo de registro binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTID estão em `gtid_purged`:

+ GTIDs de transações replicadas que foram comprometidas com registro binário desativado na replica.

+ GTIDs das transações que foram escritas em um arquivo de registro binário que agora foi apagado.

+ GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Quando o servidor for iniciado, o valor global de `gtid_purged` será inicializado com um conjunto de GTIDs. Para obter informações sobre como este conjunto de GTIDs é calculado, consulte a `gtid_purged` Sistema de variáveis. Se houver logs binários do MySQL 5.7.7 ou versões anteriores no servidor, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor para produzir a computação correta. Consulte a descrição para `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.

A emissão de `RESET MASTER` faz com que o valor de `gtid_purged` seja redefinido para uma string vazia.

Você pode definir o valor de `gtid_purged` para registrar no servidor que as transações em um determinado conjunto de GTID foram aplicadas, embora elas não existam em nenhum registro binário no servidor. Um caso de uso desse recurso é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os registros binários relevantes que contêm as transações no servidor.

Importante

O número máximo de GTIDs disponíveis em uma instância de servidor é igual ao número de valores não negativos para um inteiro de 64 bits assinado (263 - 1). Se você definir o valor de `gtid_purged` para um número que se aproxime desse limite, os commits subsequentes podem fazer com que o servidor se esgote de GTIDs e, assim, tome a ação especificada por `binlog_error_action`. A partir do MySQL 8.0.23, uma mensagem de aviso é emitida quando o servidor se aproxima desse limite.

Existem duas maneiras de definir o valor de `gtid_purged`. Você pode substituir o valor de `gtid_purged` por um conjunto de GTID especificado ou pode anexar um conjunto de GTID especificado ao conjunto de GTID que já é mantido por `gtid_purged`.

Se o servidor não tiver GTIDs existentes, como no caso de um servidor vazio que você está provisionando com um backup de um banco de dados existente, ambos os métodos têm o mesmo resultado. Se você estiver restaurando um backup que sobrepõe as transações que já estão no servidor, por exemplo, substituindo uma tabela corrompida com um dump parcial da fonte feita usando **mysqldump** (que inclui os GTIDs de todas as transações no servidor, embora o dump seja parcial), use o primeiro método de substituir o valor de `gtid_purged`. Se você estiver restaurando um backup que é disjuntado das transações que já estão no servidor, por exemplo, provisionando uma replica de várias fontes usando dumps de dois servidores diferentes, use o segundo método de adicionar ao valor de `gtid_purged`.

+ Para substituir o valor de `gtid_purged` pelo conjunto de GTID especificado, use a seguinte declaração:

    ```
    SET @@GLOBAL.gtid_purged = 'gtid_set';
    ```

A Replicação em grupo deve ser interrompida antes de alterar o valor de `gtid_purged`.

`gtid_set` deve ser um conjunto superconjunto do valor atual de `gtid_purged`, e não deve se sobrepor a `gtid_subtract(gtid_executed,gtid_purged)`. Em outras palavras, o novo conjunto de GTID **deve** incluir quaisquer GTIDs que já estavam em `gtid_purged`, e **não deve** incluir quaisquer GTIDs em `gtid_executed` que ainda não foram eliminados. `gtid_set` também não pode incluir quaisquer GTIDs que estejam em `@@global.gtid_owned`, ou seja, os GTIDs para transações que estão atualmente sendo processadas no servidor.

O resultado é que o valor global de `gtid_purged` é definido igual a `gtid_set`, e o valor de `gtid_executed` torna-se a união de `gtid_set` e o valor anterior de `gtid_executed`.

+ Para adicionar o conjunto de GTID especificado ao `gtid_purged`, use a seguinte declaração com um sinal de mais (+) antes do conjunto de GTID:

    ```
    SET @@GLOBAL.gtid_purged = '+gtid_set';
    ```

`gtid_set` **não deve** se sobrepor ao valor atual de `gtid_executed`. Em outras palavras, o novo conjunto de GTID não deve incluir quaisquer GTIDs em `gtid_executed`, incluindo transações que já estão também em `gtid_purged`. `gtid_set` também não pode incluir quaisquer GTIDs que estejam em `@@global.gtid_owned`, ou seja, os GTIDs para transações que estão atualmente sendo processadas no servidor.

O resultado é que `gtid_set` é adicionado tanto a `gtid_executed` quanto a `gtid_purged`.

Nota

Se houver algum registro binário do MySQL 5.7.7 ou anterior no servidor (por exemplo, após uma atualização de um servidor mais antigo para o MySQL 8.0), após emitir uma declaração `SET @@GLOBAL.gtid_purged`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de reiniciar o servidor; caso contrário, `gtid_purged` pode ser calculado incorretamente. Consulte a descrição para `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.

### 19.1.7 Tarefas comuns de administração de replicação

Uma vez que a replicação tenha sido iniciada, ela é executada sem exigir muita administração regular. Esta seção descreve como verificar o status da replicação, como pausar uma réplica e como ignorar uma transação falha em uma réplica.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

#### 19.1.7.1 Verificar o estado da replicação

A tarefa mais comum ao gerenciar um processo de replicação é garantir que a replicação esteja ocorrendo e que não haja erros entre a replica e a fonte.

A declaração `SHOW REPLICA STATUS`, que você deve executar em cada réplica, fornece informações sobre a configuração e o estado da conexão entre o servidor de réplica e o servidor de origem. A partir do MySQL 8.0.22, `SHOW SLAVE STATUS` é descontinuada e (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") é disponível para uso. O Schema de Desempenho tem tabelas de replicação que fornecem essas informações de uma forma mais acessível. Veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”.

As informações sobre o batimento cardíaco de replicação mostradas nas tabelas de replicação do Schema de Desempenho permitem verificar se a conexão de replicação está ativa, mesmo que a fonte não tenha enviado eventos para a replica recentemente. A fonte envia um sinal de batimento cardíaco para uma replica se não houver atualizações e nenhum evento não enviado no log binário por um período maior que o intervalo de batimento cardíaco. A configuração `MASTER_HEARTBEAT_PERIOD` na fonte (definida pela declaração `CHANGE MASTER TO`) especifica a frequência do batimento cardíaco, que é a metade do intervalo de tempo de espera da conexão para a replica (especificada pela variável do sistema `replica_net_timeout` ou `slave_net_timeout`). A tabela do Schema de Desempenho `replication_connection_status` mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma replica e quantas senhas de batimento cardíaco ela recebeu.

Se você estiver usando a declaração `SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") para verificar o status de uma replica individual, a declaração fornece as seguintes informações:

```
mysql> SHOW REPLICA STATUS\G
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 127.0.0.1
                  Source_User: root
                  Source_Port: 13000
                Connect_Retry: 1
              Source_Log_File: master-bin.000001
          Read_Source_Log_Pos: 927
               Relay_Log_File: slave-relay-bin.000002
                Relay_Log_Pos: 1145
        Relay_Source_Log_File: master-bin.000001
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 927
              Relay_Log_Space: 1355
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 73f86016-978b-11ee-ade5-8d2a2a562feb
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
            Executed_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
```

Os campos-chave do relatório de status a serem examinados são:

* `Replica_IO_State`: O status atual da replica. Consulte a Seção 10.14.5, “Estados de E/S de Replicação (Receptor)”, e a Seção 10.14.6, “Estados de E/S SQL de Replicação”, para mais informações.

* `Replica_IO_Running`: Se a thread de E/S (receptor) para leitura do log binário da fonte está em execução. Normalmente, você deseja que isso seja `Yes`, a menos que você ainda não tenha iniciado a replicação ou a tenha interrompido explicitamente com `STOP REPLICA`.

* `Replica_SQL_Running`: Se o fio SQL para executar eventos no log de relé está em execução. Assim como o fio de E/S, isso normalmente deve ser `Yes`.

* `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelas threads de I/O (receptor) e SQL (aplicador) ao processar o log de relé. Idealmente, esses devem estar em branco, indicando ausência de erros.

* `Seconds_Behind_Source`: O número de segundos que o thread de replicação SQL (aplicável) está atrasado no processamento do log binário de origem. Um número elevado (ou um número crescente) pode indicar que a replica não consegue lidar com eventos da origem de forma oportuna.

Um valor de 0 para `Seconds_Behind_Source` geralmente pode ser interpretado como indicando que a réplica alcançou a fonte, mas há alguns casos em que isso não é estritamente verdadeiro. Por exemplo, isso pode ocorrer se a conexão de rede entre a fonte e a réplica for interrompida, mas o fio de I/O de replicação (receptor) ainda não notou isso; ou seja, o período de tempo definido por `replica_net_timeout` ou `slave_net_timeout` ainda não passou.

É também possível que os valores transitórios para `Seconds_Behind_Source` não reflitam a situação com precisão. Quando o fio de replicação SQL (aplicável) alcança o I/O, `Seconds_Behind_Source` exibe 0; mas quando o fio de I/O de replicação (receptor) ainda está em fila para um novo evento, `Seconds_Behind_Source` pode mostrar um valor grande até que o fio de aplicação de replicação termine a execução do novo evento. Isso é especialmente provável quando os eventos têm timestamps antigos; nesses casos, se você executar `SHOW REPLICA STATUS` várias vezes em um período relativamente curto, você pode ver esse valor mudar para frente e para trás repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura dos eventos do log binário de origem e seu processamento no log de relevo:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até que ponto a thread de I/O de replicação (receptor) leu eventos desse log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até que ponto o SQL (aplicável) de replicação executou os eventos recebidos desse log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no log do relé de replicação que indicam até onde o SQL de replicação (aplicável) executou o log do relé. Essas correspondem às coordenadas anteriores, mas são expressas em coordenadas do log de relé de replicação em vez de coordenadas do log binário de origem.

Na fonte, você pode verificar o status das réplicas conectadas usando `SHOW PROCESSLIST` para examinar a lista de processos em execução. As conexões da réplica têm `Binlog Dump` no campo `Command`:

```
mysql> SHOW PROCESSLIST \G;
*************************** 4. row ***************************
     Id: 10
   User: root
   Host: replica1:58371
     db: NULL
Command: Binlog Dump
   Time: 777
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
```

Como é a réplica que impulsiona o processo de replicação, muito pouca informação está disponível neste relatório.

Para réplicas que foram iniciadas com a opção `--report-host` e estão conectadas à fonte, a declaração (show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`) na fonte mostra informações básicas sobre as réplicas. A saída inclui o ID do servidor da réplica, o valor da opção `--report-host`, a porta de conexão e o ID da fonte:

```
mysql> SHOW REPLICAS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Source_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```

#### 19.1.7.2 Pausar a replicação na réplica

Você pode parar e iniciar a replicação na replica usando as declarações `STOP REPLICA` e `START REPLICA`. A partir do MySQL 8.0.22, `STOP SLAVE` e `START SLAVE` são desatualizados e `STOP REPLICA` e `START REPLICA` estão disponíveis para uso.

Para parar o processamento do log binário da fonte, use `STOP REPLICA`:

```
mysql> STOP SLAVE;
Or from MySQL 8.0.22:
mysql> STOP REPLICA;
```

Quando a replicação é interrompida, o thread de I/O (receptor) de replicação para de ler eventos do log binário de origem e de escrevê-los no log de relevo, e o thread SQL para de ler eventos do log de relevo e de executá-los. Você pode pausar o thread de I/O (receptor) ou SQL (aplicador) individualmente, especificando o tipo de thread:

```
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
Or from MySQL 8.0.22:
mysql> STOP REPLICA IO_THREAD;
mysql> STOP REPLICA SQL_THREAD;
```

Para iniciar a execução novamente, use a declaração `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"):

```
mysql> START SLAVE;
Or from MySQL 8.0.22:
mysql> START REPLICA;
```

Para iniciar um determinado fio, especifique o tipo de fio:

```
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
Or from MySQL 8.0.22:
mysql> START REPLICA IO_THREAD;
mysql> START REPLICA SQL_THREAD;
```

Para uma replica que realiza atualizações apenas processando eventos da fonte, parar apenas o fio SQL pode ser útil se você quiser realizar um backup ou outra tarefa. O fio de I/O (receptor) continua a ler eventos da fonte, mas eles não são executados. Isso facilita para a replica se atualizar quando você reiniciar o fio SQL (aplicador).

Parar apenas o fio receptor permite que os eventos no log do relé sejam executados pelo fio aplicável até o ponto em que o log do relé termina. Isso pode ser útil quando você deseja pausar a execução para acompanhar eventos já recebidos da fonte, quando deseja realizar administração na replica, mas também garantir que ela tenha processado todas as atualizações até um ponto específico. Esse método também pode ser usado para pausar a recepção de eventos na replica enquanto você realiza a administração na fonte. Parar o fio receptor, mas permitir que o fio aplicável seja executado, ajuda a garantir que não haja um grande acúmulo de eventos a serem executados quando a replicação for iniciada novamente.

#### 19.1.7.3 Saltar transações

Se a replicação parar devido a um problema com um evento em uma transação replicada, você pode retomar a replicação ignorando a transação falha na replica. Antes de ignorar uma transação, certifique-se de que o fio de I/O de replicação (receptor) também esteja parado, assim como o fio de SQL (aplicador).

Primeiro, você precisa identificar o evento replicado que causou o erro. Os detalhes do erro e a última transação aplicada com sucesso são registrados na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Você pode usar **mysqlbinlog** para recuperar e exibir os eventos que foram registrados na época do erro. Para obter instruções sobre como fazer isso, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”). Alternativamente, você pode emitir `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte.

Antes de pular a transação e reiniciar a replica, verifique esses pontos:

* A transação que interrompeu a replicação veio de uma fonte desconhecida ou não confiável? Se sim, investigue a causa, caso haja alguma consideração de segurança que indique que a replica não deve ser reiniciada.

* A transação que parou a replicação precisa ser aplicada na replica? Se sim, faça as correções apropriadas e aplique a transação novamente, ou reconcile manualmente os dados na replica.

* A transação que parou a replicação precisa ser aplicada na fonte? Se não, desfaça a transação manualmente no servidor onde ela ocorreu originalmente.

Para pular a transação, escolha um dos seguintes métodos conforme apropriado:

* Quando GTIDs estão em uso (`gtid_mode` é `ON`), consulte a Seção 19.1.7.3.1, “Saltar Transações com GTIDs”.

* Quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), consulte a Seção 19.1.7.3.2, “Saltar Transações Sem GTIDs”.

* Se você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") ou [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), consulte a Seção 19.1.7.3.2, “Saltar Transações Sem GTIDs”. Usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em um canal de replicação não é o mesmo que introduzir replicação baseada em GTID para o canal, e você não pode usar o método de salto de transação para replicação baseada em GTID com esses canais.

Para reiniciar a replicação após ignorar a transação, emita `START REPLICA`, com a cláusula `FOR CHANNEL` se a replica for uma replica de múltiplas fontes.

##### 19.1.7.3.1 Ignorar transações com GTIDs

Quando os GTIDs estão em uso (`gtid_mode` é `ON`), o GTID para uma transação comprometida é persistido na replica, mesmo se o conteúdo da transação for filtrado. Esse recurso impede que uma replica retorne transações filtradas anteriormente quando se reconecte à fonte usando o autoposicionamento de GTID. Também pode ser usado para pular uma transação na replica, comprometendo uma transação vazia no lugar da transação falhando.

Este método de omissão de transações não é adequado quando você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement").

Se a transação falha gerar um erro em um thread de trabalhador, você pode obter seu GTID diretamente do campo `APPLYING_TRANSACTION` na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Para ver qual transação é, execute `SHOW RELAYLOG EVENTS` na réplica ou [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.2 SHOW BINLOG EVENTS Statement") na fonte, e procure na saída uma transação precedida por esse GTID.

Quando você tiver avaliado a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), para ignorá-la, realize uma transação vazia na replica que tenha o mesmo GTID que a transação falha. Por exemplo:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

A presença dessa transação vazia na replica significa que, quando você emitir uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement") para reiniciar a replicação, a replica usa a função de ignorar a transação falhando, porque ela vê que uma transação com aquele GTID já foi aplicada. Se a replica for uma replica de múltiplas fontes, você não precisa especificar o nome do canal quando você confirma a transação vazia, mas você precisa especificar o nome do canal quando você emitir `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement").

Observe que, se o registro binário estiver em uso nesta réplica, a transação vazia entra no fluxo de replicação se a réplica se tornar uma fonte ou primária no futuro. Se você precisar evitar essa possibilidade, considere limpar e purgar os registros binários da réplica, como neste exemplo:

```
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

O GTID da transação vazia é persistido, mas a própria transação é removida ao purgar os arquivos de log binário.

##### 19.1.7.3.2 Ignorar transações sem GTIDs

Para pular transações que falhem quando GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), você pode pular um número especificado de eventos emitindo uma declaração `SET GLOBAL sql_replica_skip_counter` (a partir do MySQL 8.0.26) ou uma declaração `SET GLOBAL sql_slave_skip_counter`. Alternativamente, você pode pular um evento ou eventos emitindo uma declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO` para avançar a posição do log binário de origem.

Esses métodos também são adequados quando você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") ou `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement").

Ao usar esses métodos, é importante entender que você não está necessariamente ignorando uma transação completa, como é sempre o caso com o método baseado em GTID descrito anteriormente. Esses métodos não baseados em GTID não estão cientes das transações como tal, mas operam em eventos. O log binário é organizado como uma sequência de grupos conhecidos como grupos de eventos, e cada grupo de eventos consiste em uma sequência de eventos.

* Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

* Para tabelas não transacionais, um grupo de eventos corresponde a uma única instrução SQL.

Uma única transação pode conter alterações em tabelas tanto transacionais quanto não transacionais.

Quando você usa uma declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` para pular eventos e a posição resultante estiver no meio de um grupo de eventos, a replicação continua a pular eventos até atingir o final do grupo. A execução então começa com o próximo grupo de eventos. A declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") ou `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") não tem essa função, então você deve ser cuidadoso para identificar a localização correta para reiniciar a replicação no início de um grupo de eventos. No entanto, ao usar `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO`, você não precisa contar os eventos que precisam ser ignorados, como faria com `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter`, e, em vez disso, você pode simplesmente especificar a localização para reiniciar.

###### 19.1.7.3.2.1 Ignorar transações com `SET GLOBAL sql_slave_skip_counter`

Quando você tiver avaliado a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), conte o número de eventos que você precisa ignorar. Um evento normalmente corresponde a uma declaração SQL no log binário, mas observe que as declarações que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` são contadas como dois eventos no log binário. Quando a compressão de transação do log binário está em uso, um payload de transação comprimido (`Transaction_payload_event`) é contado como um único valor de contador, então todos os eventos dentro dele são ignorados como uma unidade.

Se você quiser pular a transação completa, pode contar os eventos até o final da transação, ou simplesmente pular o grupo de eventos relevante. Lembre-se de que, com `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter`, a replica continua a pular até o final de um grupo de eventos. Certifique-se de não pular muito para frente e vá para o próximo grupo de eventos ou transação para que ele também não seja pulado.

Emita a declaração `SET` conforme a seguir, onde *`N`* é o número de eventos da fonte a ser ignorado:

```
SET GLOBAL sql_slave_skip_counter = N

Or from MySQL 8.0.26:
SET GLOBAL sql_replica_skip_counter = N
```

Essa declaração não pode ser emitida se `gtid_mode=ON` estiver definido, ou se as threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução.

A declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` não tem efeito imediato. Quando você emitir a declaração `START REPLICA` da próxima vez após esta declaração `SET`, o novo valor da variável do sistema `sql_replica_skip_counter` ou `sql_slave_skip_counter` é aplicado e os eventos são ignorados. Essa declaração `START REPLICA` também define automaticamente o valor da variável do sistema de volta a

0. Se a réplica for uma réplica de várias fontes, quando emitir a declaração `START REPLICA`, a cláusula `FOR CHANNEL` é necessária. Certifique-se de nomear o canal correto, caso contrário, os eventos serão ignorados no canal errado.

###### 19.1.7.3.2.2 Ignorar transações com `CHANGE MASTER TO`

Quando você tiver avaliado a transação falha para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), identifique as coordenadas (arquivo e posição) no log binário da fonte que representam uma posição adequada para reiniciar a replicação. Isso pode ser o início do grupo de eventos após o evento que causou o problema, ou o início da próxima transação. O thread de I/O de replicação (receptor) começa a ler a partir da fonte nessas coordenadas na próxima vez que o thread começa, ignorando o evento falha. Certifique-se de que você identificou a posição com precisão, porque essa declaração não leva em conta grupos de eventos.

Emita a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") ou `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") conforme a seguir, onde *`source_log_name`* é o arquivo de registro binário que contém a posição de reinício, e *`source_log_pos`* é o número que representa a posição de reinício conforme declarado no arquivo de registro binário:

```
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;

Or from MySQL 8.0.24:
CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='source_log_name', SOURCE_LOG_POS=source_log_pos;
```

Se a réplica for uma réplica de várias fontes, você deve usar a cláusula `FOR CHANNEL` para nomear o canal apropriado na declaração `CHANGE REPLICATION SOURCE TO` ou (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") ou `CHANGE MASTER TO`.

Esta declaração não pode ser emitida se `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1` estiver definido, ou se as threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução. Se você precisar usar esse método de pular uma transação quando `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1` estiver normalmente definido, você pode alterar o ajuste para `SOURCE_AUTO_POSITION=0` ou `MASTER_AUTO_POSITION=0` enquanto emite a declaração, e depois alterá-lo novamente posteriormente. Por exemplo:

```
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;

Or from MySQL 8.0.24:

CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=0, SOURCE_LOG_FILE='binlog.000145', SOURCE_LOG_POS=235;
CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=1;
```
