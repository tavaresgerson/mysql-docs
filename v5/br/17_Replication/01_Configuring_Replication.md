## 16.1 Configurando a Replicação

Esta seção descreve como configurar os diferentes tipos de replicação disponíveis no MySQL e inclui a configuração e o estabelecimento necessários para um ambiente de replicação, incluindo instruções passo a passo para criar um novo ambiente de replicação. Os principais componentes desta seção são:

* Para um guia sobre como configurar dois ou mais servidores para replicação usando posições de arquivos de registro binário, a Seção 16.1.2, “Configuração da replicação com base em posições de arquivo de registro binário”, trata da configuração dos servidores e fornece métodos para copiar dados entre a fonte e as réplicas.

* Para um guia sobre como configurar dois ou mais servidores para replicação usando transações GTID, a Seção 16.1.3, “Replicação com Identificadores de Transação Global”, trata da configuração dos servidores.

* Os eventos no log binário são registrados usando vários formatos. Esses são referidos como replicação baseada em declarações (SBR) ou replicação baseada em strings (RBR). Um terceiro tipo, replicação de formatos mistos (MIXED), usa a replicação SBR ou RBR automaticamente para aproveitar os benefícios dos formatos SBR e RBR quando apropriado. Os diferentes formatos são discutidos na Seção 16.2.1, "Formatos de replicação".

* Informações detalhadas sobre as diferentes opções de configuração e variáveis que se aplicam à replicação estão fornecidas na Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

* Uma vez iniciado, o processo de replicação deve exigir pouca administração ou monitoramento. No entanto, para obter conselhos sobre tarefas comuns que você pode querer executar, consulte a Seção 16.1.7, “Tarefas comuns de administração de replicação”.

### 16.1.1 Configuração de Replicação com Base na Posição do Arquivo de Registro Binário
### 16.1.2 Configuração de Replicação com Base na Posição do Arquivo de Registro Binário

Esta seção descreve a replicação entre servidores MySQL com base no método de posição do arquivo de registro binário, onde a instância MySQL que opera como a fonte (onde as alterações de banco de dados se originam) escreve atualizações e alterações como "eventos" no registro binário. As informações no registro binário são armazenadas em diferentes formatos de registro de acordo com as alterações de banco de dados que estão sendo registradas. As réplicas são configuradas para ler o registro binário da fonte e para executar os eventos no registro binário no banco de dados local da réplica.

Cada réplica recebe uma cópia de todo o conteúdo do log binário. É responsabilidade da réplica decidir quais declarações no log binário devem ser executadas. A menos que você especifique o contrário, todos os eventos no log binário da fonte são executados na réplica. Se necessário, você pode configurar a réplica para processar apenas eventos que se aplicam a bancos de dados ou tabelas específicas.

Importante

Você não pode configurar a fonte para registrar apenas certos eventos.

Cada réplica mantém um registro das coordenadas do log binário: o nome do arquivo e a posição dentro do arquivo que ela leu e processou a partir da fonte. Isso significa que várias réplicas podem ser conectadas à fonte e executar diferentes partes do mesmo log binário. Como as réplicas controlam esse processo, as réplicas individuais podem ser conectadas e desconectadas do servidor sem afetar a operação da fonte. Além disso, como cada réplica registra a posição atual dentro do log binário, é possível que as réplicas sejam desconectadas, reconectadas e, em seguida, retomem o processamento.

A fonte e cada réplica devem ser configuradas com um ID único (usando a variável de sistema `server_id`). Além disso, cada réplica deve ser configurada com informações sobre o nome do host da fonte, o nome do arquivo de registro e a posição dentro desse arquivo. Esses detalhes podem ser controlados dentro de uma sessão MySQL usando a declaração `CHANGE MASTER TO` na réplica. Os detalhes são armazenados no repositório de metadados de conexão da réplica, que pode ser um arquivo ou uma tabela (consulte Seção 16.2.4, “Repositórios de Metadados de Registro e Replicação de Relógio”).

### 16.1.2 Configuração da Replicação com Posição Baseada em Arquivo de Registro Binário

Esta seção descreve como configurar um servidor MySQL para usar a replicação com posição do arquivo de registro binário. Há vários métodos diferentes para configurar a replicação, e o método exato a ser usado depende de como você está configurando a replicação e se você já tem dados no banco de dados na fonte.

Existem algumas tarefas genéricas que são comuns a todos os cenários:

* No ponto de origem, você deve habilitar o registro binário e configurar uma ID de servidor única. Isso pode exigir uma reinicialização do servidor. Consulte a Seção 16.1.2.1, “Definindo a configuração da fonte de replicação”.

* Em cada réplica que você deseja conectar à fonte, você deve configurar um ID de servidor único. Isso pode exigir uma reinicialização do servidor. Veja a Seção 16.1.2.5.1, “Definindo a Configuração da Réplica”.

* Opcionalmente, crie um usuário separado para que suas réplicas sejam usadas durante a autenticação com a fonte ao ler o log binário para replicação. Veja a Seção 16.1.2.2, “Criando um Usuário para Replicação”.

* Antes de criar um instantâneo de dados ou iniciar o processo de replicação, no ponto de origem, você deve registrar a posição atual no log binário. Você precisa dessa informação ao configurar a replica, para que a replica saiba onde, no log binário, começar a executar os eventos. Veja a Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

* Se você já tem dados na fonte e deseja usá-los para sincronizar a replica, você precisa criar um instantâneo de dados para copiar os dados para a replica. O mecanismo de armazenamento que você está usando tem impacto sobre como você cria o instantâneo. Quando você está usando `MyISAM`, você deve parar de processar declarações na fonte para obter um bloqueio de leitura, em seguida, obter suas coordenadas atuais de log binário e descarregar seus dados, antes de permitir que a fonte continue executando declarações. Se você não parar a execução das declarações, o descarte de dados e as informações de status da fonte não correspondem, resultando em bancos de dados inconsistentes ou corrompidos nas réplicas. Para mais informações sobre a replicação de uma fonte `MyISAM`, consulte a Seção 16.1.2.3, “Obtenção das coordenadas de log binário da fonte de replicação”. Se você está usando `InnoDB`, você não precisa de um bloqueio de leitura e uma transação que seja longa o suficiente para transferir o instantâneo de dados é suficiente. Para mais informações, consulte a Seção 14.20, “Replicação de InnoDB e MySQL”.

* Configure a replica com as configurações para conectar-se à fonte, como o nome do host, as credenciais de login e o nome e a posição do arquivo de log binário. Veja a Seção 16.1.2.5.2, “Definindo a Configuração da Fonte na Replica”.

Nota

Certos passos no processo de configuração exigem o privilégio `SUPER`. Se você não tiver esse privilégio, talvez não seja possível habilitar a replicação.

Após configurar as opções básicas, selecione seu cenário:

* Para configurar a replicação para uma instalação nova de uma fonte e réplicas que não contenham dados, consulte a Seção 16.1.2.5.3, “Configurando a replicação entre uma nova fonte e réplicas”.

* Para configurar a replicação de uma nova fonte usando os dados de um servidor MySQL existente, consulte a Seção 16.1.2.5.4, “Configurando a Replicação com Dados Existentes”.

* Para adicionar réplicas a um ambiente de replicação existente, consulte a Seção 16.1.2.6, “Adicionar réplicas a uma topologia de replicação”.

Antes de administrar servidores de replicação do MySQL, leia todo o capítulo e tente todas as declarações mencionadas na Seção 13.4.1, “Declarações SQL para controle de servidores de origem de replicação”, e na Seção 13.4.2, “Declarações SQL para controle de servidores de réplica”. Além disso, familiarize-se com as opções de inicialização de replicação descritas na Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

#### 16.1.2.1 Configuração da fonte de replicação

Para configurar uma fonte para usar a replicação com posição do arquivo de registro binário, você deve garantir que o registro binário esteja habilitado e estabelecer um ID de servidor único.

Cada servidor dentro de uma topologia de replicação deve ser configurado com um ID de servidor único, que você pode especificar usando a variável de sistema `server_id`. Esse ID de servidor é usado para identificar servidores individuais dentro da topologia de replicação e deve ser um número inteiro positivo entre 1 e (232) - 1. Você pode alterar o valor do `server_id` dinamicamente, emitindo uma declaração como esta:

```sql
SET GLOBAL server_id = 2;
```

Com o ID do servidor padrão de 0, uma fonte recusa quaisquer conexões de réplicas, e uma réplica recusa-se a se conectar a uma fonte, portanto, esse valor não pode ser usado em uma topologia de replicação. Além disso, a forma como você organiza e seleciona os IDs do servidor é sua escolha, desde que cada ID de servidor seja diferente de todas as outras IDs de servidor em uso por qualquer outro servidor na topologia de replicação. Note que, se um valor de 0 foi definido anteriormente para o ID do servidor, você deve reiniciar o servidor para inicializar a fonte com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário, a menos que você precise habilitar o registro binário ou fazer outras alterações de configuração que exijam um reinício.

O registro binário *deve* ser habilitado na fonte, pois o registro binário é a base para a replicação das alterações da fonte para suas réplicas. Se o registro binário não for habilitado na fonte usando a opção `log-bin`, a replicação não é possível. Para habilitar o registro binário em um servidor onde ele ainda não está habilitado, você deve reiniciar o servidor. Neste caso, desligue o servidor MySQL e edite o arquivo `my.cnf` ou `my.ini`. Na seção `[mysqld]` do arquivo de configuração, adicione as opções `log-bin` e `server-id`. Se essas opções já existirem, mas estiverem comentadas, descomente as opções e altere-as de acordo com suas necessidades. Por exemplo, para habilitar o registro binário usando um prefixo de nome de arquivo de registro de `mysql-bin`, e configure um ID de servidor de 1, use essas strings:

```sql
[mysqld]
log-bin=mysql-bin
server-id=1
```

Após fazer as alterações, reinicie o servidor.

Nota

As seguintes opções têm impacto nesse procedimento:

* Para a maior durabilidade e consistência possível em um conjunto de replicação usando `InnoDB` com transações, você deve usar `innodb_flush_log_at_trx_commit=1` e `sync_binlog=1` no arquivo `my.cnf` da fonte.

* Certifique-se de que a variável de sistema `skip_networking` não está habilitada em sua fonte. Se a rede foi desativada, a replica não pode se comunicar com a fonte e a replicação falha.

#### 16.1.2.2 Criando um Usuário para Replicação

Cada réplica se conecta à fonte usando um nome de usuário e senha do MySQL, portanto, deve haver uma conta de usuário na fonte que a réplica possa usar para se conectar. O nome de usuário é especificado pela opção `MASTER_USER` no comando `CHANGE MASTER TO` quando você configura uma réplica. Qualquer conta pode ser usada para essa operação, desde que tenha sido concedido o privilégio `REPLICATION SLAVE`. Você pode optar por criar uma conta diferente para cada réplica ou se conectar à fonte usando a mesma conta para cada réplica.

Embora você não precise criar uma conta especificamente para replicação, você deve estar ciente de que o nome de usuário e a senha de replicação são armazenados em texto plano nos repositórios de metadados de replicação (consulte Seção 16.2.4.2, “Repositórios de Metadados de Replicação”). Portanto, você pode querer criar uma conta separada que tenha privilégios apenas para o processo de replicação, para minimizar a possibilidade de comprometimento de outras contas.

Para criar uma nova conta, use `CREATE USER`. Para conceder a conta os privilégios necessários para a replicação, use a declaração `GRANT`. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `repl`, que possa se conectar para replicação de qualquer host dentro do domínio `example.com`, emita essas declarações na fonte:

```sql
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Consulte a Seção 13.7.1, “Declarações de Gestão de Conta”, para obter mais informações sobre declarações de manipulação de contas de usuário.

#### 16.1.2.3 Obter as coordenadas do log binário da fonte de replicação

Para configurar a replica para iniciar o processo de replicação no ponto correto, é necessário anotar as coordenadas atuais da fonte dentro de seu log binário.

Aviso

Este procedimento utiliza `FLUSH TABLES WITH READ LOCK`, que bloqueia as operações de `COMMIT` para as tabelas de `InnoDB`.

Se você está planejando desligar a fonte para criar um instantâneo de dados, pode optar por ignorar esse procedimento e, em vez disso, armazenar uma cópia do arquivo de índice do log binário junto com o instantâneo de dados. Nessa situação, a fonte cria um novo arquivo de log binário na reinicialização. As coordenadas do log binário da fonte onde a replica deve iniciar o processo de replicação são, portanto, o início desse novo arquivo, que é o próximo arquivo de log binário na fonte após os arquivos listados no arquivo de índice de log binário copiado.

Para obter as coordenadas do log binário da fonte, siga estes passos:

1. Inicie uma sessão na fonte conectando-se a ela com o cliente de string de comando e limpe todas as tabelas e declarações de escrita de bloco executando a declaração `FLUSH TABLES WITH READ LOCK`:

   ```sql
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

Aviso

Deixe o cliente do qual você emitiu a declaração `FLUSH TABLES` em execução para que o bloqueio de leitura permaneça em vigor. Se você sair do cliente, o bloqueio é liberado.

2. Em uma sessão diferente na fonte, use a declaração `SHOW MASTER STATUS` para determinar o nome atual do arquivo de registro binário e sua posição:

   ```sql
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

Se a fonte tiver sido executada anteriormente sem registro binário habilitado, os nomes dos arquivos de registro e os valores de posição exibidos por `SHOW MASTER STATUS` ou **mysqldump --master-data** estarão vazios. Nesse caso, os valores que você precisa usar mais tarde ao especificar o arquivo de registro e a posição da fonte são a string vazia (`''`) e `4`.

Agora você tem as informações necessárias para habilitar a replica a começar a ler o log binário no local correto para iniciar a replicação.

O próximo passo depende de você ter dados existentes na fonte. Escolha uma das seguintes opções:

* Se você tiver dados existentes que precisam ser sincronizados com a réplica antes de iniciar a replicação, deixe o cliente em execução para que o bloqueio permaneça no lugar. Isso impede que quaisquer alterações adicionais sejam feitas, para que os dados copiados para a réplica estejam em sincronia com a fonte. Prossiga para a Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados”.

* Se você está configurando uma nova topologia de replicação, pode sair da primeira sessão para liberar o bloqueio de leitura. Veja a Seção 16.1.2.5.3, "Configurando a replicação entre uma nova fonte e réplicas", para saber como proceder.

#### 16.1.2.4 Escolhendo um Método para Instantâneos de Dados

Se o banco de dados na fonte contiver dados existentes, é necessário copiar esses dados para cada réplica. Existem diferentes maneiras de descartar os dados da fonte. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de descarte do banco de dados, escolha entre essas opções:

* Use a ferramenta **mysqldump** para criar um dump de todos os bancos de dados que você deseja replicar. Esse é o método recomendado, especialmente quando você está usando `InnoDB`.

* Se o seu banco de dados for armazenado em arquivos portáteis binários, você pode copiar os arquivos de dados brutos para uma replica. Isso pode ser mais eficiente do que usar o **mysqldump** e importar o arquivo em cada replica, porque ele evita o overhead de atualização de índices à medida que as instruções `INSERT` são reinterpretadas. Com motores de armazenamento como `InnoDB`, isso não é recomendado.

##### 16.1.2.4.1 Criando um instantâneo de dados usando mysqldump

Para criar um instantâneo dos dados em uma fonte existente, use a ferramenta **mysqldump**. Uma vez que o dump de dados tenha sido concluído, importe esses dados na replica antes de iniciar o processo de replicação.

O exemplo a seguir descarrega todos os bancos de dados em um arquivo chamado `dbdump.db`, e inclui a opção `--master-data`, que anexa automaticamente a declaração `CHANGE MASTER TO` necessária na replica para iniciar o processo de replicação:

```sql
$> mysqldump --all-databases --master-data > dbdump.db
```

Nota

Se você não usar `--master-data`, então é necessário bloquear todas as tabelas em uma sessão separada manualmente. Veja a Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

É possível excluir certos bancos de dados do dump usando a ferramenta **mysqldump**. Se você deseja escolher quais bancos de dados devem ser incluídos no dump, não use `--all-databases`. Escolha uma dessas opções:

* Exclua todas as tabelas no banco de dados usando a opção `--ignore-table`.

* Nomeie apenas os bancos de dados que você deseja descartar usando a opção `--databases`.

Para mais informações, consulte a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”.

Para importar os dados, copie o arquivo de dump para a réplica ou acesse o arquivo na fonte ao se conectar remotamente à réplica.

##### 16.1.2.4.2 Criando um instantâneo de dados usando arquivos de dados brutos

Esta seção descreve como criar um instantâneo de dados usando os arquivos brutos que compõem o banco de dados. Empregar esse método com uma tabela que utiliza um mecanismo de armazenamento que tem algoritmos de cache ou registro complexos requer etapas adicionais para produzir um instantâneo perfeito “no momento atual”: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de registro, mesmo que você tenha adquirido um bloqueio de leitura global. Como o mecanismo de armazenamento responde a isso depende de suas habilidades de recuperação em caso de falha.

Se você usar as tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que é incluído como parte de uma assinatura do MySQL Enterprise. Consulte a Seção 28.1, “Visão geral do MySQL Enterprise Backup”, para obter informações detalhadas.

Esse método também não funciona de forma confiável se a fonte e a replica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas com índices de texto completo.

Supondo que as exceções acima não se apliquem ao seu banco de dados, use a técnica de backup frio para obter um instantâneo binário confiável das tabelas do `InnoDB`: faça um desligamento lento do servidor MySQL e, em seguida, copie os arquivos de dados manualmente.

Para criar um instantâneo de dados brutos das tabelas `MyISAM` quando seus arquivos de dados MySQL existem em um único sistema de arquivos, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota, como **scp** ou **rsync**, uma ferramenta de arquivamento, como **zip** ou **tar**, ou uma ferramenta de instantâneo de sistema de arquivos, como **dump**. Se você está replicando apenas certos bancos de dados, copie apenas aqueles arquivos que se relacionam com essas tabelas. Para `InnoDB`, todas as tabelas em todos os bancos de dados são armazenadas nos arquivos do espaço de tabela do sistema, a menos que você tenha a opção `innodb_file_per_table` habilitada.

Os seguintes arquivos não são necessários para a replicação:

* Arquivos relacionados ao banco de dados `mysql`. * O arquivo de repositório de metadados de conexão da replica, se utilizado (consulte a Seção 16.2.4, "Repositórios de Log de Relógio e Metadados de Replicação").

* Os arquivos de registro binário da fonte, com exceção do arquivo de índice de registro binário, se você vai usá-lo para localizar as coordenadas do registro binário da fonte para a replica.

* Arquivos de registro de relevo.

Dependendo se você está usando as tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando as tabelas `InnoDB`, e também quiser obter os resultados mais consistentes com um instantâneo de dados brutos, desligue o servidor de origem durante o processo, conforme descrito a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Em uma sessão separada, desligue o servidor de origem:

   ```sql
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor de origem.

Se você não estiver usando as tabelas `InnoDB`, pode obter um instantâneo do sistema a partir de uma fonte sem desligar o servidor, conforme descrito nos passos a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o bloqueio de leitura, libere o bloqueio:

   ```sql
   mysql> UNLOCK TABLES;
   ```

Depois de criar o arquivo ou cópia do banco de dados, copie os arquivos para cada réplica antes de iniciar o processo de replicação.

#### 16.1.2.5 Configuração de Replicas

As seções a seguir descrevem como configurar réplicas. Antes de prosseguir, certifique-se de que você tem:

* Configurou a fonte com as propriedades de configuração necessárias. Veja a Seção 16.1.2.1, “Definindo a configuração da fonte de replicação”.

* Obteve as informações de status da fonte ou uma cópia do arquivo de índice de log binário da fonte feita durante um desligamento para o instantâneo de dados. Veja a Seção 16.1.2.3, “Obtenção das coordenadas de log binário da fonte de replicação”.

* Sobre a fonte, liberou o bloqueio de leitura:

  ```sql
  mysql> UNLOCK TABLES;
  ```

##### 16.1.2.5.1 Configuração da réplica

Cada réplica deve ter um ID de servidor único, conforme especificado pela variável de sistema `server_id`. Se você está configurando várias réplicas, cada uma deve ter um valor único `server_id` que difere do da fonte e de qualquer outra réplica. Se o ID de servidor da réplica não estiver definido, ou o valor atual entrar em conflito com o valor que você escolheu para o servidor da fonte ou outra réplica, você deve alterá-lo. Com o valor padrão `server_id` de 0, uma réplica se recusa a se conectar a uma fonte.

Você pode alterar o valor `server_id` dinamicamente, emitindo uma declaração como esta:

```sql
SET GLOBAL server_id = 21;
```

Se o valor padrão `server_id` de 0 foi definido anteriormente, você deve reiniciar o servidor para inicializar a replica com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID do servidor, a menos que você faça outras alterações de configuração que exijam isso. Por exemplo, se o registro binário foi desativado no servidor e você deseja ativá-lo para sua replica, um reinício do servidor é necessário para ativar isso.

Se você estiver desligando o servidor de replicação, pode editar a seção `[mysqld]` do arquivo de configuração para especificar um ID de servidor único. Por exemplo:

```sql
[mysqld]
server-id=21
```

Uma réplica não precisa ter o registro binário habilitado para que a replicação ocorra. No entanto, o registro binário em uma réplica significa que o registro binário da réplica pode ser usado para backups de dados e recuperação em caso de falha. Réplicas que têm registro binário habilitado também podem ser usadas como parte de uma topologia de replicação mais complexa. Se você deseja habilitar o registro binário em uma réplica, use a opção `log-bin` na seção `[mysqld]` do arquivo de configuração. Um reinício do servidor é necessário para iniciar o registro binário em um servidor que não o usou anteriormente.

##### 16.1.2.5.2 Configuração da fonte no replicador

Para configurar a replica para se comunicar com a fonte de replicação, configure a replica com as informações de conexão necessárias. Para fazer isso, execute a seguinte declaração na replica, substituindo os valores das opções pelos valores reais relevantes para o seu sistema:

```sql
mysql> CHANGE MASTER TO
    ->     MASTER_HOST='source_host_name',
    ->     MASTER_USER='replication_user_name',
    ->     MASTER_PASSWORD='replication_password',
    ->     MASTER_LOG_FILE='recorded_log_file_name',
    ->     MASTER_LOG_POS=recorded_log_position;
```

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor MySQL de origem usando TCP/IP.

A declaração `CHANGE MASTER TO` também tem outras opções. Por exemplo, é possível configurar a replicação segura usando SSL. Para uma lista completa das opções e informações sobre o comprimento máximo permitido para as opções de valor de cadeia, consulte a Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.

Os próximos passos dependem de você ter dados existentes para importar na replica ou não. Consulte a Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados”, para mais informações. Escolha um dos seguintes:

* Se você não tiver um instantâneo de um banco de dados a ser importado, consulte a Seção 16.1.2.5.3, “Configurando a Replicação entre uma Nova Fonte e Replicas”.

* Se você tiver um instantâneo de um banco de dados a ser importado, consulte a Seção 16.1.2.5.4, “Configurando a Replicação com Dados Existentes”.

##### 16.1.2.5.3 Configurando a replicação entre uma nova fonte e réplicas

Quando não houver uma instantânea de um banco de dados anterior a ser importado, configure a replicação para começar a replicar a partir da nova fonte.

Para configurar a replicação entre uma fonte e uma nova réplica:

1. Inicie a replica e conecte-se a ela.
2. Execute uma declaração `CHANGE MASTER TO` para definir a configuração da fonte. Veja a Seção 16.1.2.5.2, “Definindo a configuração da fonte na replica”.

Realize essas etapas de configuração em cada réplica.

Esse método também pode ser usado se você estiver configurando novos servidores, mas tiver um dump existente dos bancos de dados de um servidor diferente que você deseja carregar na sua configuração de replicação. Ao carregar os dados em uma nova fonte, os dados são automaticamente replicados para as réplicas.

Se você está configurando um novo ambiente de replicação usando os dados de um servidor de banco de dados existente diferente para criar uma nova fonte, execute o arquivo de dump gerado nesse servidor na nova fonte. As atualizações do banco de dados são automaticamente propagadas aos replicados:

```sql
$> mysql -h master < fulldb.dump
```

##### 16.1.2.5.4 Configurando a replicação com dados existentes

Ao configurar a replicação com dados existentes, transfira o instantâneo da fonte para a replica antes de iniciar a replicação. O processo de importação de dados para a replica depende de como você criou o instantâneo dos dados na fonte.

Siga este procedimento para configurar a replicação com dados existentes:

1. Importe os dados para a replica usando um dos seguintes métodos:

1. Se você usou o **mysqldump**, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`. Em seguida, importe o arquivo de dump:

      ```sql
      $> mysql < fulldb.dump
      ```

2. Se você criou um instantâneo usando os arquivos de dados brutos, extraia os arquivos de dados para o diretório de dados da replica. Por exemplo:

      ```sql
      $> tar xvf dbdump.tar
      ```

Você pode precisar definir permissões e propriedade dos arquivos para que o servidor de replicação possa acessá-los e modificá-los. Em seguida, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`.

2. Configure a replica com as coordenadas de replicação da fonte. Isso informa à replica o arquivo de log binário e a posição dentro do arquivo onde a replicação deve começar. Além disso, configure a replica com as credenciais de login e o nome de host da fonte. Para mais informações sobre a declaração `CHANGE MASTER TO` necessária, consulte a Seção 16.1.2.5.2, “Definindo a Configuração da Fonte na Replica”.

3. Inicie os threads de replicação:

   ```sql
   mysql> START SLAVE;
   ```

Depois de realizar esse procedimento, a replica se conecta à fonte e replica todas as atualizações que ocorreram na fonte desde que o instantâneo foi criado.

Se a variável de sistema `server_id` para a fonte não estiver configurada corretamente, as réplicas não poderão se conectar a ela. Da mesma forma, se você não configurou corretamente `server_id` para a réplica, você receberá o seguinte erro no log de erro da réplica:

```sql
Warning: You should set server-id to a non-0 value if master_host
is set; we will force server id to 2, but this MySQL server will
not act as a slave.
```

Você também encontrará mensagens de erro no log de erro da réplica, se ela não conseguir replicar por qualquer outro motivo.

A replica armazena informações sobre a fonte que você configurou em seu repositório de metadados de conexão. O repositório de metadados de conexão pode ser em forma de arquivos ou uma tabela, conforme determinado pelo valor definido para a variável de sistema `master_info_repository`. Quando uma replica é executada com `master_info_repository=FILE`, dois arquivos são armazenados no diretório de dados, com os nomes `master.info` e `relay-log.info`. Se, em vez disso, for usado `master_info_repository=TABLE`, essas informações são salvas na tabela `master_slave_info` no banco de dados `mysql`. Em qualquer caso, *não* remova ou edite os arquivos ou a tabela. Sempre use a declaração `CHANGE MASTER TO` para alterar os parâmetros de replicação. A replica pode usar os valores especificados na declaração para atualizar os arquivos de status automaticamente. Consulte a Seção 16.2.4, “Repositórios de Log de Relay e Metadados de Replicação”, para obter mais informações.

Nota

O conteúdo do repositório de metadados de conexão substitui algumas das opções do servidor especificadas na string de comando ou em `my.cnf`. Consulte a Seção 16.1.6, “Opções e variáveis de replicação e registro binário”, para mais detalhes.

Um único instantâneo da fonte é suficiente para múltiplas réplicas. Para configurar réplicas adicionais, use o mesmo instantâneo da fonte e siga a parte da réplica do procedimento descrito anteriormente.

#### 16.1.2.6 Adicionando réplicas a uma topologia de replicação

Você pode adicionar outra replica a uma configuração de replicação existente sem parar o servidor de origem. Para fazer isso, você pode configurar a nova replica copiando o diretório de dados de uma replica existente e dando ao novo replica um ID de servidor diferente (que é especificado pelo usuário) e UUID do servidor (que é gerado na inicialização).

Para duplicar uma réplica existente:

1. Parar a replica existente e registrar as informações do status da replica, especialmente os arquivos de registro binário da fonte e os arquivos de registro do relé. Você pode visualizar o status da replica nas tabelas de replicação do Schema de Desempenho (consulte Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”), ou emitindo `SHOW SLAVE STATUS` da seguinte forma:

   ```sql
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   ```

2. Desative a replica existente:

   ```sql
   $> mysqladmin shutdown
   ```

3. Copie o diretório de dados da replica existente para a nova replica, incluindo os arquivos de log e os arquivos de log de relevo. Você pode fazer isso criando um arquivo usando **tar** ou `WinZip`, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

Importante

* Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão realmente armazenados no diretório de dados. Por exemplo, os espaços de sistema `InnoDB`, espaço de tabela de desfazer e log de refazer podem estar armazenados em um local alternativo. Os arquivos do espaço de tabela `InnoDB` e os espaços de tabela por arquivo podem ter sido criados em outros diretórios. Os logs binários e logs de relevo para a replica podem estar em seus próprios diretórios fora do diretório de dados. Verifique as variáveis do sistema que estão definidas para a replica existente e procure por quaisquer caminhos alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

* Durante a cópia, se os arquivos tiverem sido usados para os repositórios de metadados de replicação (consulte a Seção 16.2.4, "Repositórios de Log de Relay e Metadados de Replicação"), que é o padrão no MySQL 5.7, certifique-se de que também copie esses arquivos da replica existente para a nova replica. Se as tabelas tiverem sido usadas para os repositórios, as tabelas estão no diretório de dados.

* Após a cópia, exclua o arquivo `auto.cnf` da cópia do diretório de dados na nova réplica, para que a nova réplica seja iniciada com um UUID de servidor gerado de forma diferente. O UUID do servidor deve ser único.

Um problema comum que é encontrado ao adicionar novas réplicas é que a nova réplica falha com uma série de mensagens de aviso e erro, como estas:

   ```sql
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a slave and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

Essa situação pode ocorrer se a variável de sistema `relay_log` não for especificada, pois os arquivos de registro do relé contêm o nome do host como parte de seus nomes de arquivo. Isso também é verdadeiro para o arquivo de índice de registro do relé se a variável de sistema `relay_log_index` não for usada. Para mais informações sobre essas variáveis, consulte a Seção 16.1.6, “Opções e variáveis de registro binário e replicação”.

Para evitar esse problema, use o mesmo valor para `relay_log` na nova réplica que foi usada na réplica existente. Se essa opção não foi definida explicitamente na réplica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo de índice de log de relevo da réplica existente para a nova réplica e defina a variável de sistema `relay_log_index` na nova réplica para corresponder ao que foi usado na réplica existente. Se essa opção não foi definida explicitamente na réplica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova réplica após seguir os passos restantes nesta seção e encontrou erros como os descritos anteriormente, então realize os passos a seguir:

1. Se ainda não o fez, emita `STOP SLAVE` na nova réplica.

Se você já iniciou a replica existente novamente, emita `STOP SLAVE` na replica existente também.

2. Copie o conteúdo do arquivo de índice de registro de relevo da replica existente para o arquivo de índice de registro de relevo da nova replica, certificando-se de sobrescrever qualquer conteúdo já existente no arquivo.

3. Prossiga com os passos restantes nesta seção.
4. Quando a cópia estiver concluída, reinicie a replica existente.
5. Na nova replica, edite a configuração e dê ao novo replica um ID de servidor único (usando a variável de sistema `server_id`) que não seja usado pela fonte ou por nenhuma das replicas existentes.

6. Inicie o novo servidor de replicação, especificando a opção `--skip-slave-start` para que a replicação ainda não comece. Use as tabelas de replicação do Schema de desempenho ou emita `SHOW SLAVE STATUS` para confirmar que o novo replica tem as configurações corretas em comparação com o replica existente. Além disso, exiba o ID do servidor e o UUID do servidor e verifique se esses são corretos e únicos para o novo replica.

7. Inicie os threads de replicação emitindo uma declaração `START SLAVE`:

   ```sql
   mysql> START SLAVE;
   ```

A nova réplica agora usa as informações em seu repositório de metadados de conexão para iniciar o processo de replicação.

### 16.1.3 Replicação com Identificadores de Transação Global

Esta seção explica a replicação baseada em transações usando identificadores de transação global (GTIDs). Ao usar GTIDs, cada transação pode ser identificada e rastreada à medida que é comprometida no servidor de origem e aplicada por quaisquer réplicas; isso significa que não é necessário, ao usar GTIDs, referir-se a arquivos de registro ou posições dentro desses arquivos ao iniciar uma nova réplica ou falhar para uma nova fonte, o que simplifica muito essas tarefas. Como a replicação baseada em GTID é completamente baseada em transações, é simples determinar se as fontes e réplicas são consistentes; desde que todas as transações comprometidas em uma fonte também sejam comprometidas em uma réplica, a consistência entre as duas é garantida. Você pode usar a replicação baseada em declarações ou baseada em strings com GTIDs (consulte Seção 16.2.1, “Formatos de Replicação”); no entanto, para obter os melhores resultados, recomendamos que você use o formato baseado em strings.

Os GTIDs são sempre preservados entre a fonte e a réplica. Isso significa que você sempre pode determinar a fonte de qualquer transação aplicada em qualquer réplica, examinando seu log binário. Além disso, uma vez que uma transação com um GTID dado seja comprometida em um servidor dado, qualquer transação subsequente com o mesmo GTID é ignorada por esse servidor. Assim, uma transação comprometida na fonte pode ser aplicada no máximo uma vez na réplica, o que ajuda a garantir a consistência.

Esta seção discute os seguintes tópicos:

* Como os GTIDs são definidos e criados, e como são representados em um servidor MySQL (consulte a Seção 16.1.3.1, "Formato e Armazenamento do GTID").

* O ciclo de vida de um GTID (ver Seção 16.1.3.2, “Ciclo de vida do GTID”).

* A função de autoposicionamento para sincronizar uma réplica e uma fonte que utilizam GTIDs (ver Seção 16.1.3.3, “Autoposicionamento de GTID”).

* Um procedimento geral para configurar e iniciar a replicação baseada em GTID (consulte a Seção 16.1.3.4, “Configuração da Replicação Usando GTIDs”).

* Métodos sugeridos para provisionamento de novos servidores de replicação ao usar GTIDs (consulte Seção 16.1.3.5, “Usando GTIDs para Failover e Scaleout”).

* Restrições e limitações que você deve estar ciente ao usar a replicação baseada em GTID (consulte a Seção 16.1.3.6, “Restrições na Replicação com GTIDs”).

* Funções armazenadas que você pode usar para trabalhar com GTIDs (consulte a Seção 16.1.3.7, “Exemplos de função armazenada para manipular GTIDs”).

Para obter informações sobre as opções e variáveis do MySQL Server relacionadas à replicação baseada em GTID, consulte a Seção 16.1.6.5, “Variáveis do Sistema de ID de Transação Global”. Veja também a Seção 12.18, “Funções Usadas com Identificadores de Transação Global (GTIDs)”), que descreve as funções SQL suportadas pelo MySQL 5.7 para uso com GTIDs.

#### 16.1.3.1 Formato e Armazenamento do GTID

Um identificador de transação global (GTID) é um identificador único criado e associado a cada transação comprometida no servidor de origem (a fonte). Esse identificador é único não apenas para o servidor no qual ele se originou, mas é único em todos os servidores em uma topologia de replicação dada.

A atribuição de GTID distingue entre as transações do cliente, que são comprometidas na fonte, e as transações replicadas, que são reproduzidas em uma réplica. Quando uma transação do cliente é comprometida na fonte, ela recebe um novo GTID, desde que a transação tenha sido escrita no log binário. As transações do cliente são garantidas para ter GTIDs que aumentam de forma monótona, sem lacunas entre os números gerados. Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), não é atribuído um GTID no servidor de origem.

As transações replicadas retêm o mesmo GTID que foi atribuído à transação no servidor de origem. O GTID está presente antes de a transação replicada começar a ser executada e é persistido mesmo se a transação replicada não for escrita no log binário na replica, ou seja, se ela for filtrada na replica. A tabela do sistema MySQL `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos a todas as transações aplicadas em um servidor MySQL, exceto aquelas que estão armazenadas em um arquivo de log binário atualmente ativo.

A função de auto-saltos para GTIDs significa que uma transação comprometida na fonte pode ser aplicada no máximo uma vez na réplica, o que ajuda a garantir a consistência. Uma vez que uma transação com um GTID dado tenha sido comprometida em um servidor dado, qualquer tentativa de executar uma transação subsequente com o mesmo GTID é ignorada por esse servidor. Não é gerado nenhum erro e nenhuma declaração na transação é executada.

Se uma transação com um GTID dado tiver começado a ser executada em um servidor, mas ainda não tiver sido comprometida ou revertida, qualquer tentativa de iniciar uma transação concorrente no servidor com o mesmo GTID é bloqueada. O servidor não começa a executar a transação concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transação seja comprometida ou revertida, as sessões concorrentes que estavam bloqueadas no mesmo GTID podem prosseguir. Se a primeira tentativa for revertida, uma sessão concorrente prossegue para tentar a transação, e quaisquer outras sessões concorrentes que estavam bloqueadas no mesmo GTID permanecem bloqueadas. Se a primeira tentativa for comprometida, todas as sessões concorrentes deixam de ser bloqueadas e ignoram automaticamente todas as declarações da transação.

Um GTID é representado como um par de coordenadas, separado por um caractere de colon (`:`), conforme mostrado aqui:

```sql
GTID = source_id:transaction_id
```

O *`source_id` identifica o servidor de origem. Normalmente, o `server_uuid` da fonte é usado para esse propósito. O *`transaction_id` é um número de sequência determinado pela ordem em que a transação foi comprometida no servidor de origem. Por exemplo, a primeira transação a ser comprometida tem `1` como seu *`transaction_id`*, e a décima transação a ser comprometida no mesmo servidor de origem é atribuída um *`transaction_id`* de `10`. Não é possível que uma transação tenha `0` como um número de sequência em um GTID. Por exemplo, a vigésima terceira transação a ser comprometida originalmente no servidor com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para números de sequência para GTIDs em uma instância do servidor é o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado a 63 menos 1, ou 9.223.372.036.854.775.807). Se o servidor ficar sem GTIDs, ele realiza a ação especificada por `binlog_error_action`.

O GTID para uma transação é mostrado na saída do **mysqlbinlog**, e é usado para identificar uma transação individual nas tabelas de status de replicação do Gerenciador de desempenho, por exemplo, `replication_applier_status_by_worker`. O valor armazenado pela variável de sistema `gtid_next` (`@@GLOBAL.gtid_next`) é um único GTID.

##### Conjuntos GTID

Um conjunto de GTID é um conjunto que compreende uma ou mais GTIDs individuais ou intervalos de GTIDs. Conjuntos de GTID são usados em um servidor MySQL de várias maneiras. Por exemplo, os valores armazenados pelas variáveis de sistema `gtid_executed` e `gtid_purged` são conjuntos de GTID. As cláusulas `START SLAVE` `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` podem ser usadas para fazer com que um processo de replicação transações apenas até o primeiro GTID em um conjunto de GTID, ou pare após o último GTID em um conjunto de GTID. As funções internas `GTID_SUBSET()` e `GTID_SUBTRACT()` requerem conjuntos de GTID como entrada.

Uma série de GTIDs originários do mesmo servidor pode ser reduzida a uma única expressão, como mostrado aqui:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa as primeiras cinco transações originadas no servidor MySQL cujo `server_uuid` é `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Múltiplos GTIDs únicos ou intervalos de GTIDs originados do mesmo servidor também podem ser incluídos em uma única expressão, com os GTIDs ou intervalos separados por colchetes, como no exemplo a seguir:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um conjunto de GTID pode incluir qualquer combinação de GTID individuais e intervalos de GTID, e pode incluir GTID que se originam de diferentes servidores. Este exemplo mostra o conjunto de GTID armazenado na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) de uma réplica que aplicou transações de mais de uma fonte:

```sql
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando os conjuntos GTID são retornados a partir de variáveis do servidor, os UUIDs estão em ordem alfabética e os intervalos numéricos são combinados e em ordem crescente.

A sintaxe para um conjunto de GTID é a seguinte:

```sql
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

Os GTIDs são armazenados em uma tabela denominada `gtid_executed`, no banco de dados `mysql`. Uma string nesta tabela contém, para cada GTID ou conjunto de GTIDs que representa, o UUID do servidor de origem e os IDs de transação inicial e final do conjunto; para uma string que faz referência a apenas um único GTID, esses dois últimos valores são os mesmos.

A tabela `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando uma declaração `CREATE TABLE` semelhante àquela mostrada aqui:

```sql
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Aviso

Assim como outras tabelas do sistema MySQL, não tente criar ou modificar essa tabela por si mesmo.

A tabela `mysql.gtid_executed` é fornecida para uso interno pelo servidor MySQL. Ela permite que uma replica use GTIDs quando o registro binário está desativado na replica, e permite a retenção do estado do GTID quando os registros binários foram perdidos. Note que a tabela `mysql.gtid_executed` é limpa se você emitir `RESET MASTER`.

Os GTIDs são armazenados na tabela `mysql.gtid_executed` apenas quando `gtid_mode` é `ON` ou `ON_PERMISSIVE`. O ponto em que os GTIDs são armazenados depende se o registro binário está habilitado ou desabilitado:

* Se o registro binário estiver desativado (`log_bin` é `OFF`), ou se `log_slave_updates` estiver desativado, o servidor armazena o GTID pertencente a cada transação junto com a transação no buffer quando a transação é comprometida, e o thread de fundo adiciona periodicamente o conteúdo do buffer como uma ou mais entradas na tabela `mysql.gtid_executed`. Além disso, a tabela é comprimida periodicamente a uma taxa configurável pelo usuário; consulte Compressão da Tabela de Registro de Transações Binárias para obter mais informações. Esta situação só pode ser aplicada em uma replica onde o registro binário ou o registro de atualização de replica está desativado. Não se aplica em um servidor de fonte de replicação, porque na fonte, o registro binário deve ser habilitado para que a replicação ocorra.

* Se o registro binário estiver habilitado (`log_bin` é `ON`), sempre que o registro binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no registro binário anterior na tabela `mysql.gtid_executed`. Esta situação se aplica em um servidor de fonte de replicação ou em uma réplica onde o registro binário está habilitado.

Caso o servidor pare de forma inesperada, o conjunto de GTIDs do arquivo de registro binário atual não é salvo na tabela `mysql.gtid_executed`. Esses GTIDs são adicionados à tabela a partir do arquivo de registro binário durante a recuperação. A exceção a isso é se o registro binário não estiver habilitado quando o servidor é reiniciado. Nessa situação, o servidor não pode acessar o arquivo de registro binário para recuperar os GTIDs, então a replicação não pode ser iniciada.

Quando o registro binário está habilitado, a tabela `mysql.gtid_executed` não contém um registro completo dos GTIDs para todas as transações executadas. Essas informações são fornecidas pelo valor global da variável de sistema `gtid_executed`. Sempre use `@@GLOBAL.gtid_executed`, que é atualizado após cada commit, para representar o estado do GTID para o servidor MySQL, e não consulte a tabela `mysql.gtid_executed`.

##### Tabela de compressão mysql.gtid_executed

Ao longo do tempo, a tabela `mysql.gtid_executed` pode ficar cheia de muitas strings que se referem a GTIDs individuais que se originam no mesmo servidor, e cujos IDs de transação formam uma faixa, semelhante ao que é mostrado aqui:

```sql
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

Para economizar espaço, o servidor MySQL comprime a tabela `mysql.gtid_executed` periodicamente, substituindo cada conjunto de strings por uma única string que abrange todo o intervalo de identificadores de transação, da seguinte forma:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

Você pode controlar o número de transações que são permitidas para ocorrer antes que a tabela seja comprimida, e, assim, a taxa de compressão, definindo a variável de sistema `gtid_executed_compression_period`. O valor padrão dessa variável é 1000, o que significa que, por padrão, a compressão da tabela é realizada após cada 1000 transações. Definir `gtid_executed_compression_period` para 0 impede que a compressão seja realizada, e você deve estar preparado para um aumento potencialmente grande na quantidade de espaço em disco que pode ser necessário para a tabela `gtid_executed` se você fizer isso.

Nota

Quando o registro binário está habilitado, o valor de `gtid_executed_compression_period` *não* é usado e a tabela `mysql.gtid_executed` é comprimida em cada rotação do registro binário.

A compressão da tabela `mysql.gtid_executed` é realizada por um thread de primeiro plano dedicado chamado `thread/sql/compress_gtid_table`. Este thread não está listado na saída de `SHOW PROCESSLIST`, mas pode ser visto como uma string na tabela `threads`, conforme mostrado aqui:

```sql
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

O thread `thread/sql/compress_gtid_table` normalmente dorme até que as transações `gtid_executed_compression_period` tenham sido executadas, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`, conforme descrito anteriormente. Em seguida, dorme até que outras transações `gtid_executed_compression_period` ocorram, e então acorda para realizar a compressão novamente, repetindo esse loop indefinidamente. Definir esse valor para 0 quando o registro binário está desativado significa que o thread sempre dorme e nunca acorda, o que significa que esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

#### 16.1.3.2 Ciclo de Vida do GTID

O ciclo de vida de um GTID consiste nas seguintes etapas:

1. Uma transação é executada e comprometida no servidor de origem da replicação. Essa transação do cliente é atribuída um GTID composto pelo UUID da fonte e pelo menor número de sequência de transação não nulo que ainda não foi usado neste servidor. O GTID é escrito no log binário da fonte (imediatamente antes da própria transação no log). Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não é atribuída um GTID.

2. Se um GTID foi atribuído para a transação, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário é rotado ou o servidor é desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo anterior do log binário na tabela `mysql.gtid_executed`.

3. Se um GTID foi atribuído para a transação, o GTID é externalizado não-atômico (muito pouco tempo após a transação ser comprometida) adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`). Este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID comprometidas, e é usado na replicação como um token que representa o estado do servidor. Com o registro binário habilitado (como exigido para a fonte), o conjunto de GTIDs na variável de sistema `gtid_executed` é um registro completo das transações aplicadas, mas a tabela `mysql.gtid_executed` não é, porque o histórico mais recente ainda está no arquivo de registro binário atual.

4. Após os dados do log binário serem transmitidos para a replica e armazenados no log de relevo da replica (usando mecanismos estabelecidos para esse processo, consulte a Seção 16.2, “Implementação de Replicação”, para detalhes), a replica lê o GTID e define o valor da variável de sistema `gtid_next` como este GTID. Isso indica à replica que a próxima transação deve ser registrada usando este GTID. É importante notar que a replica define `gtid_next` em um contexto de sessão.

5. A replica verifica que nenhum thread ainda tenha tomado posse do GTID em `gtid_next` para processar a transação. Ao ler e verificar o GTID da transação replicada primeiro, antes de processar a própria transação, a replica garante não apenas que nenhuma transação anterior com este GTID tenha sido aplicada na replica, mas também que nenhuma outra sessão já tenha lido este GTID, mas ainda não tenha comprometido a transação associada. Assim, se vários clientes tentarem aplicar a mesma transação simultaneamente, o servidor resolve isso, permitindo que apenas um deles execute. A variável de sistema `gtid_owned` (`@@GLOBAL.gtid_owned`) para a replica mostra cada GTID que está atualmente em uso e o ID do thread que a possui. Se o GTID já tiver sido usado, não é gerado nenhum erro, e a função de auto-skip é usada para ignorar a transação.

6. Se o GTID não tiver sido utilizado, a replica aplica a transação replicada. Como `gtid_next` está configurado com o GTID já atribuído pela fonte, a replica não tenta gerar um novo GTID para essa transação, mas, em vez disso, utiliza o GTID armazenado em `gtid_next`.

7. Se o registro binário estiver habilitado na replica, o GTID é persistido de forma atômica no momento do commit, escrevendo-o no log binário no início da transação (como um `Gtid_log_event`). Sempre que o log binário for rotado ou o servidor for desligado, o servidor escreve GTIDs para todas as transações que foram escritas no arquivo anterior do log binário na tabela `mysql.gtid_executed`.

8. Se o registro binário estiver desativado na replica, o GTID é persistido de forma atômica, escrevendo-o diretamente na tabela `mysql.gtid_executed`. O MySQL adiciona uma declaração à transação para inserir o GTID na tabela. Nessa situação, a tabela `mysql.gtid_executed` é um registro completo das transações aplicadas na replica. Observe que, no MySQL 5.7, a operação de inserção do GTID na tabela é atômica para declarações DML, mas não para declarações DDL, portanto, se o servidor sair inesperadamente após uma transação que envolva declarações DDL, o estado do GTID pode se tornar inconsistente. A partir do MySQL 8.0, a operação é atômica tanto para declarações DDL quanto para declarações DML.

9. Muito pouco tempo após a transação replicada ser confirmada na réplica, o GTID é externalizado não-atômico, adicionando-o ao conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) para a réplica. Quanto à fonte, este conjunto de GTIDs contém uma representação do conjunto de todas as transações GTID confirmadas. Se o registro binário estiver desativado na réplica, a tabela `mysql.gtid_executed` também é um registro completo das transações aplicadas na réplica. Se o registro binário estiver ativado na réplica, o que significa que alguns GTIDs são registrados apenas no log binário, o conjunto de GTIDs na variável de sistema `gtid_executed` é o único registro completo.

As transações do cliente que são completamente filtradas na fonte não recebem um GTID, portanto, não são adicionadas ao conjunto de transações na variável de sistema `gtid_executed`, nem adicionadas à tabela `mysql.gtid_executed`. No entanto, os GTIDs das transações replicadas que são completamente filtradas na replica são preservados. Se o registro binário estiver habilitado na replica, a transação filtrada é escrita no registro binário como um `Gtid_log_event`, seguido por uma transação vazia que contém apenas as declarações `BEGIN` e `COMMIT`. Se o registro binário estiver desabilitado, o GTID da transação filtrada é escrito na tabela `mysql.gtid_executed`. Preservar os GTIDs para transações filtradas garante que a tabela `mysql.gtid_executed` e o conjunto de GTIDs na variável de sistema `gtid_executed` possam ser comprimidos. Também garante que as transações filtradas não sejam recuperadas novamente se a replica se reconectar com a fonte, conforme explicado na Seção 16.1.3.3, “Autoposicionamento do GTID”.

Em uma replica multithread (com `slave_parallel_workers > 0`), as transações podem ser aplicadas em paralelo, então as transações replicadas podem ser confirmadas fora de ordem (a menos que `slave_preserve_commit_order=1` esteja definido). Quando isso acontece, o conjunto de GTIDs na variável de sistema `gtid_executed` contém múltiplos intervalos de GTIDs com lacunas entre eles. (Em uma fonte ou replica de único thread, há GTIDs que aumentam de forma monótona sem lacunas entre os números.) As lacunas em réplicas multithread ocorrem apenas entre as transações mais recentemente aplicadas, e são preenchidas à medida que a replicação progride. Quando as threads de replicação são paradas de forma limpa usando a declaração `STOP SLAVE`, as transações em andamento são aplicadas para que as lacunas sejam preenchidas. No caso de um desligamento, como uma falha no servidor ou o uso da declaração `KILL` para parar as threads de replicação, as lacunas podem permanecer.

Quais mudanças recebem um GTID?

O cenário típico é que o servidor gere um novo GTID para uma transação comprometida. No entanto, GTIDs também podem ser atribuídos a outras alterações além de transações, e, em alguns casos, uma única transação pode receber vários GTIDs.

Cada alteração de banco de dados (DDL ou DML) que é escrita no log binário é atribuída um GTID. Isso inclui alterações que são auto-atribuídas e alterações que são atreladas usando as declarações `BEGIN` e `COMMIT` ou `START TRANSACTION` . Um GTID também é atribuído à criação, alteração ou exclusão de um banco de dados e de um objeto não de tabela de banco de dados, como um procedimento, função, gatilho, evento, visão, usuário, papel ou concessão.

As atualizações não transacionais, assim como as transacionais, recebem GTIDs. Além disso, para uma atualização não transacional, se ocorrer uma falha de escrita em disco ao tentar escrever no cache do log binário e, portanto, uma lacuna for criada no log binário, o evento de registro de incidente resultante recebe um GTID.

Quando uma tabela é automaticamente descartada por uma declaração gerada no log binário, um GTID é atribuído à declaração. As tabelas temporárias são descartadas automaticamente quando uma réplica começa a aplicar eventos de uma fonte que acabou de ser iniciada, e quando a replicação baseada em declarações está em uso (`binlog_format=STATEMENT`) e uma sessão de usuário que tem tabelas temporárias abertas se desconecta. As tabelas que usam o mecanismo de armazenamento `MEMORY` são excluídas automaticamente na primeira vez que são acessadas após o servidor ser iniciado, porque as strings podem ter sido perdidas durante o desligamento.

Quando uma transação não é escrita no log binário no servidor de origem, o servidor não atribui um GTID a ela. Isso inclui transações que são revertidas e transações que são executadas enquanto o registro binário está desativado no servidor de origem, seja globalmente (com `--skip-log-bin` especificado na configuração do servidor) ou para a sessão (`SET @@SESSION.sql_log_bin = 0`). Isso também inclui transações sem operação quando a replicação baseada em string está em uso (`binlog_format=ROW`).

As transações XA recebem GTIDs separados para a fase `XA PREPARE` da transação e para a fase `XA COMMIT` ou `XA ROLLBACK` da transação. As transações XA são preparadas de forma persistente, de modo que os usuários possam comprometer ou desfazer elas no caso de uma falha (o que, em uma topologia de replicação, pode incluir uma transição para outro servidor). As duas partes da transação são, portanto, replicadas separadamente, portanto, devem ter seus próprios GTIDs, mesmo que uma transação que não é XA e que é desfeita não tenha um GTID.

Nos seguintes casos especiais, uma única declaração pode gerar várias transações e, portanto, ser atribuída a vários GTIDs:

* É invocada uma procedura armazenada que compromete múltiplas transações. Um GTID é gerado para cada transação que a procedura compromete.

* Uma declaração multi-tabela `DROP TABLE` exclui tabelas de diferentes tipos.

* Uma declaração `CREATE TABLE ... SELECT` é emitida quando a replicação baseada em string está em uso (`binlog_format=ROW`). Um GTID é gerado para a ação `CREATE TABLE` e um GTID é gerado para as ações de inserção de string.

##### A variável de sistema `gtid_next`

Por padrão, para novas transações realizadas em sessões de usuário, o servidor gera e atribui automaticamente um novo GTID. Quando a transação é aplicada em uma réplica, o GTID do servidor de origem é preservado. Você pode alterar esse comportamento definindo o valor da sessão da variável de sistema `gtid_next`:

* Quando `gtid_next` está definido como `AUTOMATIC`, que é o padrão, e uma transação é comprometida e escrita no log binário, o servidor automaticamente gera e atribui um novo GTID. Se uma transação for revertida ou não escrita no log binário por outro motivo, o servidor não gera e não atribui um GTID.

* Se você definir `gtid_next` para um GTID válido (composto por uma UUID e um número de sequência de transação, separados por um colon), o servidor atribui esse GTID à sua transação. Esse GTID é atribuído e adicionado a `gtid_executed`, mesmo quando a transação não é escrita no log binário, ou quando a transação é vazia.

Observe que, após definir `gtid_next` para um GTID específico, e a transação ter sido comprometida ou revertida, uma declaração explícita de `SET @@SESSION.gtid_next` deve ser emitida antes de qualquer outra declaração. Você pode usar isso para definir o valor do GTID de volta para `AUTOMATIC` se você não quiser atribuir mais GTIDs explicitamente.

Quando os threads do aplicativo de replicação aplicam transações replicadas, eles usam essa técnica, definindo explicitamente `@@SESSION.gtid_next` para o GTID da transação replicada, conforme atribuído no servidor de origem. Isso significa que o GTID do servidor de origem é mantido, em vez de um novo GTID ser gerado e atribuído pela replica. Isso também significa que o GTID é adicionado a `gtid_executed` na replica, mesmo quando o registro binário ou o registro de atualização da replica estão desativados na replica, ou quando a transação é uma operação sem efeito ou é filtrada na replica.

É possível que um cliente simule uma transação replicada, definindo `@@SESSION.gtid_next` para um GTID específico antes de executar a transação. Essa técnica é usada pelo **mysqlbinlog** para gerar um dump do log binário que o cliente pode reproduzir para preservar os GTIDs. Uma transação replicada simulada comprometida por um cliente é completamente equivalente a uma transação replicada comprometida por um thread do aplicativo de replicação, e não podem ser distinguidas posteriormente.

##### A variável de sistema `gtid_purged`

O conjunto de GTIDs na variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) contém os GTIDs de todas as transações que foram comprometidas no servidor, mas não existem em nenhum arquivo de registro binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTIDs estão em `gtid_purged`:

* GTIDs de transações replicadas que foram comprometidas com registro binário desativado na replica.

* GTIDs das transações que foram escritas em um arquivo de registro binário que agora foi apagado.

* GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Você pode alterar o valor de `gtid_purged` para registrar no servidor que as transações em um determinado conjunto de GTID foram aplicadas, embora elas não existam em nenhum log binário no servidor. Quando você adiciona GTIDs a `gtid_purged`, eles também são adicionados a `gtid_executed`. Um caso de uso desse procedimento é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os logs binários relevantes que contêm as transações no servidor. No MySQL 5.7, você só pode alterar o valor de `gtid_purged` quando `gtid_executed` (e, portanto, `gtid_purged`) está vazio. Para obter detalhes sobre como fazer isso, consulte a descrição para `gtid_purged`.

Os conjuntos de GTIDs nas variáveis de sistema `gtid_executed` e `gtid_purged` são inicializados quando o servidor é iniciado. Cada arquivo de registro binário começa com o evento `Previous_gtids_log_event`, que contém o conjunto de GTIDs em todos os arquivos de registro binário anteriores (composto pelos GTIDs no `Previous_gtids_log_event` do arquivo anterior e pelos GTIDs de cada `Gtid_log_event` no próprio arquivo anterior). O conteúdo de `Previous_gtids_log_event` nos arquivos de registro binário mais antigos e mais recentes é usado para calcular os conjuntos `gtid_executed` e `gtid_purged` na inicialização do servidor:

* `gtid_executed` é calculado como a união dos GTIDs em `Previous_gtids_log_event` no arquivo de registro binário mais recente, os GTIDs das transações nesse arquivo de registro binário e os GTIDs armazenados na tabela `mysql.gtid_executed`. Este conjunto de GTIDs contém todos os GTIDs que foram usados (ou adicionados explicitamente em `gtid_purged`) no servidor, independentemente de estarem ou não atualmente em um arquivo de registro binário no servidor. Não inclui os GTIDs para transações que estão atualmente sendo processadas no servidor (`@@GLOBAL.gtid_owned`).

* `gtid_purged` é calculado somando primeiro os GTIDs em `Previous_gtids_log_event` no arquivo de registro binário mais recente e os GTIDs das transações nesse arquivo de registro binário. Essa etapa fornece o conjunto de GTIDs que estão atualmente, ou que foram, registrados em um registro binário no servidor (`gtids_in_binlog`). Em seguida, os GTIDs em `Previous_gtids_log_event` no arquivo de registro binário mais antigo são subtraídos de `gtids_in_binlog`. Essa etapa fornece o conjunto de GTIDs que estão atualmente registrados em um registro binário no servidor (`gtids_in_binlog_not_purged`). Finalmente, `gtids_in_binlog_not_purged` é subtraído de `gtid_executed`. O resultado é o conjunto de GTIDs que foram usados no servidor, mas que atualmente não estão registrados em um arquivo de registro binário no servidor, e esse resultado é usado para inicializar `gtid_purged`.

Se os registros binários do MySQL 5.7.7 ou versões anteriores estiverem envolvidos nesses cálculos, é possível que conjuntos de GTID incorretos sejam calculados para `gtid_executed` e `gtid_purged`, e eles permanecem incorretos mesmo se o servidor for reiniciado posteriormente. Para obter detalhes, consulte a descrição da variável de sistema `binlog_gtid_simple_recovery`, que controla como os registros binários são iterados para calcular os conjuntos de GTID. Se uma das situações descritas lá se aplicar em um servidor, defina `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de iniciá-lo. Essa configuração faz com que o servidor itere todos os arquivos de registro binário (não apenas os mais novos e mais antigos) para encontrar onde os eventos de GTID começam a aparecer. Esse processo pode levar um longo tempo se o servidor tiver um grande número de arquivos de registro binário sem eventos de GTID.

##### Redefinindo o histórico de execução do GTID

Se você precisar redefinir o histórico de execução do GTID em um servidor, use a declaração `RESET MASTER`. Por exemplo, você pode precisar fazer isso após realizar consultas de teste para verificar uma configuração de replicação em novos servidores habilitados para GTID, ou quando você deseja unir um novo servidor a um grupo de replicação, mas ele contém algumas transações locais indesejadas que não são aceitas pela Replicação de Grupo.

Aviso

Use `RESET MASTER` com cautela para evitar a perda de qualquer histórico de execução do GTID e arquivos de log binário desejado.

Antes de emitir `RESET MASTER`, certifique-se de ter backups dos arquivos de log binário do servidor e do arquivo de índice de log binário, se houver, e obtenha e salve o conjunto de GTID contido no valor global da variável de sistema `gtid_executed` (por exemplo, emitindo uma declaração `SELECT @@GLOBAL.gtid_executed` e salvando os resultados). Se você está removendo transações indesejadas desse conjunto de GTID, use **mysqlbinlog** para examinar o conteúdo das transações para garantir que elas não tenham valor, não contenham dados que devam ser salvos ou replicados e não tenham resultado em mudanças de dados no servidor.

Quando você emite `RESET MASTER`, as seguintes operações de reposição são realizadas:

* O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`).

* O valor global (mas não o valor da sessão) da variável de sistema `gtid_executed` é definido como uma string vazia.

* A tabela `mysql.gtid_executed` é limpa (ver tabela mysql.gtid_executed).

* Se o servidor tiver o registro binário habilitado, os arquivos de registro binários existentes serão excluídos e o arquivo de índice do registro binário será apagado.

Observe que `RESET MASTER` é o método para redefinir o histórico de execução do GTID, mesmo que o servidor seja uma réplica onde o registro binário está desativado. `RESET SLAVE` não tem efeito no histórico de execução do GTID.

#### 16.1.3.3 GTID de Autoposicionamento

Os GTIDs substituem os pares de deslocamento de arquivo anteriormente necessários para determinar os pontos de início, parada ou retomada do fluxo de dados entre a fonte e a replica. Quando os GTIDs estão em uso, todas as informações que a replica precisa para a sincronização com a fonte são obtidas diretamente do fluxo de dados de replicação.

Para iniciar uma replica usando replicação com base em GTID, não inclua as opções `MASTER_LOG_FILE` ou `MASTER_LOG_POS` na declaração `CHANGE MASTER TO` usada para direcionar a replica para replicar a partir de uma fonte dada. Essas opções especificam o nome do arquivo de registro e a posição inicial dentro do arquivo, mas com GTIDs a replica não precisa desses dados não locais. Em vez disso, você precisa habilitar a opção `MASTER_AUTO_POSITION`. Para obter instruções completas sobre como configurar e iniciar fontes e réplicas usando replicação com base em GTID, consulte a Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs”.

A opção `MASTER_AUTO_POSITION` é desativada por padrão. Se a replicação de múltiplas fontes estiver habilitada na replica, você precisa definir essa opção para cada canal de replicação aplicável. Desativar novamente a opção `MASTER_AUTO_POSITION` faz com que a replica volte à replicação baseada em posição.

Quando uma réplica tem GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE`) e a opção `MASTER_AUTO_POSITION` habilitada, o autoposicionamento é ativado para a conexão com a fonte. A fonte deve ter `GTID_MODE=ON` definido para que a conexão seja bem-sucedida. No aperto inicial, a réplica envia um conjunto de GTIDs definido contendo as transações que ela já recebeu, comprometeu ou ambas. Este conjunto de GTIDs é igual à união do conjunto de GTIDs na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) e o conjunto de GTIDs registrados na tabela do Schema de Desempenho `replication_connection_status` como transações recebidas (o resultado da declaração `SELECT RECEIVED_TRANSACTION_SET FROM PERFORMANCE_SCHEMA.replication_connection_status`).

A fonte responde enviando todas as transações registradas em seu log binário cujo GTID não está incluído no conjunto de GTID enviado pela replica. Para isso, a fonte primeiro identifica o arquivo de log binário apropriado para começar a trabalhar, verificando o `Previous_gtids_log_event` no cabeçalho de cada um de seus arquivos de log binário, começando com o mais recente. Quando a fonte encontra o primeiro `Previous_gtids_log_event` que não contém transações que a replica está faltando, ela começa com esse arquivo de log binário. Esse método é eficiente e leva apenas um tempo significativo se a replica estiver atrás da fonte por um grande número de arquivos de log binário. A fonte então lê as transações nesse arquivo de log binário e arquivos subsequentes até o atual, enviando as transações com GTIDs que a replica está faltando, e ignorando as transações que estavam no conjunto de GTID enviado pela replica. O tempo decorrido até a replica receber a primeira transação faltante depende de seu deslocamento no arquivo de log binário. Essa troca garante que a fonte só envie as transações com um GTID que a replica não tenha recebido ou comprometido ainda. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes.

Se alguma das transações que devem ser enviadas pela fonte tiver sido eliminada do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged`, por outro método, a fonte envia o erro `ER_MASTER_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não começa. Os GTIDs das transações eliminadas são identificados e listados no log de erro da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. A replica não pode se recuperar automaticamente desse erro porque partes do histórico de transações necessárias para se atualizar com a fonte foram eliminadas. Tentar se reconectar sem a opção `MASTER_AUTO_POSITION` habilitada resulta apenas na perda das transações eliminadas na replica. A abordagem correta para se recuperar dessa situação é a replica se replicar as transações eliminadas listadas na mensagem `ER_FOUND_MISSING_GTIDS` de outra fonte, ou substituir a replica por uma nova replica criada a partir de um backup mais recente. Considere revisar o período de expiração do log binário na fonte para garantir que a situação não ocorra novamente.

Se, durante a troca de transações, for descoberto que a réplica recebeu ou comprometeu transações com o UUID da fonte no GTID, mas a fonte não possui registro delas, a fonte envia o erro `ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER` para a réplica e a replicação não é iniciada. Essa situação pode ocorrer se uma fonte que não possui `sync_binlog=1` definida, experimente uma falha de energia ou falha do sistema operacional e perca transações comprometidas que ainda não foram sincronizadas no arquivo de log binário, mas que foram recebidas pela réplica. A fonte e a réplica podem divergir se quaisquer clientes comprometem transações na fonte após ela ser reiniciada, o que pode levar à situação em que a fonte e a réplica estão usando o mesmo GTID para transações diferentes. A abordagem correta para se recuperar dessa situação é verificar manualmente se a fonte e a réplica divergiram. Se o mesmo GTID estiver sendo usado agora para transações diferentes, você precisa realizar a resolução manual de conflitos para transações individuais conforme necessário, ou remover a fonte ou a réplica da topologia de replicação. Se o problema for apenas a falta de transações na fonte, você pode transformar a fonte em uma réplica, permitir que ela ative as outras servidores na topologia de replicação e, em seguida, transformá-la novamente em fonte, se necessário.

#### 16.1.3.4 Configurando a replicação usando GTIDs

Esta seção descreve um processo para configurar e iniciar a replicação baseada em GTID no MySQL 5.7. Este é um procedimento de "início frio" que assume que você está iniciando o servidor de origem da replicação pela primeira vez ou que é possível interromper o servidor; para informações sobre provisionamento de réplicas usando GTIDs de uma fonte em execução, consulte a Seção 16.1.3.5, “Usando GTIDs para Failover e Scaleout”. Para informações sobre alterar o modo GTID em servidores online, consulte a Seção 16.1.4, “Altering Replication Modes on Online Servers”.

Os passos-chave neste processo de inicialização para a topologia de replicação de GTID mais simples possível, consistindo em uma fonte e uma replica, são os seguintes:

1. Se a replicação já estiver em execução, sincronize os dois servidores, tornando-os somente leitura.

2. Parar ambos os servidores.  
3. Reiniciar ambos os servidores com GTIDs habilitados e as opções corretas configuradas.

As opções necessárias para iniciar os servidores conforme descrito são discutidas no exemplo que segue mais adiante nesta seção.

4. Instrua a replica a usar a fonte como fonte de dados de replicação e a usar auto-posicionamento. As instruções SQL necessárias para realizar essa etapa estão descritas no exemplo que segue mais adiante nesta seção.

5. Faça um novo backup. Registros binários que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados, então os backups feitos antes deste ponto não podem ser usados com sua nova configuração.

6. Inicie a replicação e, em seguida, desative o modo somente leitura em ambos os servidores, para que eles possam aceitar as atualizações.

No exemplo a seguir, dois servidores já estão em execução como fonte e réplica, usando o protocolo de replicação com base na posição do log binário do MySQL. Se você está começando com novos servidores, consulte a Seção 16.1.2.2, “Criando um Usuário para Conexões de Replicação”, para obter informações sobre adicionar um usuário específico para conexões de replicação e a Seção 16.1.2.1, “Definindo a Configuração da Fonte de Replicação”, para obter informações sobre definir a variável `server_id`. Os exemplos a seguir mostram como armazenar as opções de inicialização `mysqld` no arquivo de opções do servidor, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”, para mais informações. Alternativamente, você pode usar opções de inicialização ao executar `mysqld`.

A maioria dos passos que se seguem exige o uso da conta MySQL `root` ou de outra conta de usuário do MySQL que tenha o privilégio `SUPER`. O **mysqladmin** `shutdown` requer o privilégio `SUPER` ou o privilégio `SHUTDOWN`.

**Passo 1: Sincronize os servidores.** Este passo é necessário apenas quando você está trabalhando com servidores que já estão replicando sem usar GTIDs. Para novos servidores, prossiga para o Passo 3. Faça os servidores de leitura somente, definindo a variável de sistema `read_only` para `ON` em cada servidor, emitindo o seguinte:

```sql
mysql> SET @@GLOBAL.read_only = ON;
```

Aguarde que todas as transações em andamento sejam confirmadas ou revertidas. Em seguida, permita que a replica acompanhe a fonte. *É extremamente importante que você garanta que a replica tenha processado todas as atualizações antes de continuar*.

Se você usar logs binários para qualquer outra coisa que não seja replicação, por exemplo, para fazer backup e restauração em um ponto no tempo, espere até que não precise mais dos logs binários antigos que contêm transações sem GTIDs. Idealmente, espere até que o servidor elimine todos os logs binários e espere que qualquer backup existente expire.

Importante

É importante entender que os registros que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados. Antes de prosseguir, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

**Passo 2: Parar ambos os servidores. Parar cada servidor usando **mysqladmin**, conforme mostrado aqui, onde *`username`* é o nome do usuário para um usuário do MySQL que tenha privilégios suficientes para desligar o servidor:

```sql
$> mysqladmin -uusername -p shutdown
```

Em seguida, forneça a senha desse usuário na solicitação.

**Passo 3: Inicie ambos os servidores com GTIDs habilitados.** Para habilitar a replicação baseada em GTID, cada servidor deve ser iniciado com o modo GTID habilitado, definindo a variável `gtid_mode` para `ON`, e com a variável `enforce_gtid_consistency` habilitada para garantir que apenas as declarações que são seguras para replicação baseada em GTID sejam registradas. Por exemplo:

```sql
gtid_mode=ON
enforce-gtid-consistency=ON
```

Além disso, você deve começar as réplicas com a opção `--skip-slave-start` antes de configurar as configurações da réplica. Para mais informações sobre as opções e variáveis relacionadas ao GTID, consulte a Seção 16.1.6.5, “Variáveis do Sistema de ID de Transação Global”.

Não é obrigatório ter o registro binário habilitado para usar GTIDs ao usar a Tabela mysql.gtid_executed. O servidor de origem da replicação deve sempre ter o registro binário habilitado para poder replicar. No entanto, os servidores de replicação podem usar GTIDs, mas sem registro binário. Se você precisar desabilitar o registro binário em uma replica, pode fazer isso especificando as opções `--skip-log-bin` e `--log-slave-updates=OFF` para a replica.

**Passo 4: Configure a replica para usar autoposicionamento baseado em GTID.** Diga à replica que use a fonte com transações baseadas em GTID como fonte de dados de replicação e que use autoposicionamento baseado em GTID em vez de posicionamento baseado em arquivos. Emite uma declaração `CHANGE MASTER TO` na replica, incluindo a opção `MASTER_AUTO_POSITION` na declaração para dizer à replica que as transações da fonte são identificadas por GTIDs.

Você também pode precisar fornecer os valores apropriados para o nome do host e o número de porta da fonte, bem como o nome de usuário e a senha de uma conta de usuário de replicação que pode ser usada pela replica para se conectar à fonte; se esses já tiverem sido definidos antes do Passo 1 e não precisem de mais alterações, as opções correspondentes podem ser omitidas com segurança da declaração mostrada aqui.

```sql
mysql> CHANGE MASTER TO
     >     MASTER_HOST = host,
     >     MASTER_PORT = port,
     >     MASTER_USER = user,
     >     MASTER_PASSWORD = password,
     >     MASTER_AUTO_POSITION = 1;
```

Nem a opção `MASTER_LOG_FILE` nem a opção `MASTER_LOG_POS` podem ser usadas quando o `MASTER_AUTO_POSITION` é igual a 1. Tentar fazer isso faz com que a declaração `CHANGE MASTER TO` falhe com um erro.

**Passo 5: Faça um novo backup.** Os backups existentes que foram feitos antes de você habilitar GTIDs não podem mais ser usados nesses servidores agora que você habilitou GTIDs. Faça um novo backup neste ponto, para que você não fique sem um backup utilizável.

Por exemplo, você pode executar `FLUSH LOGS` no servidor onde você está fazendo backups. Em seguida, você pode fazer explicitamente um backup ou esperar para a próxima iteração de qualquer rotina de backup periódico que você possa ter configurado.

**Passo 6: Inicie a replica e desative o modo somente leitura.** Inicie a replica da seguinte forma:

```sql
mysql> START SLAVE;
```

O passo a seguir é necessário apenas se você configurou um servidor para ser somente de leitura no Passo 1. Para permitir que o servidor comece a aceitar atualizações novamente, execute a seguinte declaração:

```sql
mysql> SET @@GLOBAL.read_only = OFF;
```

A replicação baseada em GTID deve estar em execução agora, e você pode começar (ou retomar) a atividade na fonte como antes. A Seção 16.1.3.5, “Usando GTIDs para Failover e Scaleout”, discute a criação de novas réplicas ao usar GTIDs.

#### 16.1.3.5 Usando GTIDs para Failover e Scaleout

Há várias técnicas ao usar a replicação do MySQL com Identificadores de Transação Global (GTIDs) para provisionar uma nova replica que pode ser usada para escala, sendo promovida como fonte conforme necessário para falha. Esta seção descreve as seguintes técnicas:

* Replicação simples
* Copiar dados e transações para a replica
* Injetar transações vazias
* Excluir transações com gtid_purged
* Restaurar replicas no modo GTID

Identificadores globais de transação foram adicionados ao MySQL Replication com o objetivo de simplificar o gerenciamento geral do fluxo de dados de replicação e, em particular, as atividades de failover. Cada identificador identifica de forma única um conjunto de eventos de log binário que, juntos, compõem uma transação. Os GTIDs desempenham um papel fundamental na aplicação de alterações no banco de dados: o servidor ignora automaticamente qualquer transação que tenha um identificador que o servidor reconheça como uma que ele já processou anteriormente. Esse comportamento é crítico para o posicionamento automático da replicação e o failover correto.

O mapeamento entre identificadores e conjuntos de eventos que compõem uma transação dada é capturado no log binário. Isso apresenta alguns desafios ao provisionar um novo servidor com dados de outro servidor existente. Para reproduzir o conjunto de identificadores no novo servidor, é necessário copiar os identificadores do servidor antigo para o novo e preservar a relação entre os identificadores e os eventos reais. Isso é necessário para restaurar uma replica que está imediatamente disponível como um candidato para se tornar uma nova fonte em caso de falha ou mudança de configuração.

**Replicação simples.** A maneira mais fácil de reproduzir todos os identificadores e transações em um novo servidor é fazer com que o novo servidor se torne a replica de uma fonte que tenha todo o histórico de execução, e habilitar identificadores de transação global em ambos os servidores. Consulte a Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs”, para mais informações.

Assim que a replicação for iniciada, o novo servidor copia o log binário inteiro a partir da fonte e, assim, obtém todas as informações sobre todos os GTIDs.

Esse método é simples e eficaz, mas exige que a replica leia o log binário da fonte; às vezes, pode levar um tempo relativamente longo para a nova replica se atualizar com a fonte, portanto, esse método não é adequado para falha rápida ou restauração a partir de backup. Esta seção explica como evitar obter todo o histórico de execução da fonte, copiando arquivos de log binário para o novo servidor.

**Copiar dados e transações para a replica.** Executar todo o histórico de transações pode ser demorado quando o servidor de origem processou um grande número de transações anteriormente, e isso pode representar um grande gargalo ao configurar uma nova replica. Para eliminar essa exigência, um instantâneo do conjunto de dados, os registros binários e as informações globais de transação que o servidor de origem contém podem ser importados para a nova replica. O servidor de origem pode ser o servidor de origem ou a replica, mas você deve garantir que o servidor de origem tenha processado todas as transações necessárias antes de copiar os dados.

Existem várias variantes desse método, a diferença sendo a maneira pela qual os dados e as transações dos registros binários são transferidos para a replica, conforme descrito aqui:

Conjunto de dados:   1. Crie um arquivo de dump usando o **mysqldump** no servidor de origem. Defina a opção `--master-data` do **mysqldump** (com o valor padrão de 1) para incluir uma declaração `CHANGE MASTER TO` com informações de registro binário. Defina a opção `--set-gtid-purged` para `AUTO` (o padrão) ou `ON`, para incluir informações sobre as transações executadas no dump. Em seguida, use o cliente **mysql** para importar o arquivo de dump no servidor de destino.

2. Alternativamente, crie um instantâneo de dados do servidor de origem usando arquivos de dados brutos, e depois copie esses arquivos para o servidor de destino, seguindo as instruções na Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados”. Se você usar as tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que é incluído como parte de uma assinatura do MySQL Enterprise. Veja a Seção 28.1, “Visão Geral do MySQL Enterprise Backup” para informações detalhadas.

3. Alternativamente, pare os servidores fonte e de destino, copie o conteúdo do diretório de dados da fonte para o diretório de dados da nova replica, e, em seguida, reinicie a replica. Se você usar esse método, a replica deve ser configurada para replicação com base em GTID, ou seja, com `gtid_mode=ON`. Para instruções e informações importantes sobre esse método, consulte a Seção 16.1.2.6, “Adicionando Replicas a uma Topologia de Replicação”.

Histórico de transações: Se o servidor de origem tiver um histórico de transações completo em seus registros binários (ou seja, o GTID definido em `@@GLOBAL.gtid_purged` estiver vazio), você pode usar esses métodos.

1. Importe os logs binários do servidor de origem para a nova replica usando o **mysqlbinlog**, com as opções `--read-from-remote-server` e `--read-from-remote-master`.

2. Alternativamente, copie os arquivos de log binário do servidor fonte para a replica. Você pode fazer cópias da replica usando o **mysqlbinlog** com as opções `--read-from-remote-server` e `--raw`. Esses arquivos podem ser lidos na replica usando o **mysqlbinlog** `>` `file` (sem a opção `--raw`) para exportar os arquivos de log binário para arquivos SQL, e depois passar esses arquivos para o cliente **mysql** para processamento. Certifique-se de que todos os arquivos de log binário sejam processados usando um único processo **mysql**, em vez de várias conexões. Por exemplo:

       ```sql
       $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
       ```

Para mais informações, consulte a Seção 4.6.7.3, “Usando mysqlbinlog para fazer backup de arquivos de log binário”.

Esse método tem a vantagem de que um novo servidor está disponível quase imediatamente; apenas as transações que foram comprometidas enquanto o arquivo de instantâneo ou de dump estava sendo reinterpretado ainda precisam ser obtidas da fonte existente. Isso significa que a disponibilidade da replica não é instantânea, mas apenas um período relativamente curto deve ser necessário para que a replica se atualize com essas poucas transações restantes.

Copiar logs binários para o servidor de destino com antecedência geralmente é mais rápido do que ler todo o histórico de execução de transações a partir da fonte em tempo real. No entanto, nem sempre é viável mover esses arquivos para o destino quando necessário, devido ao tamanho ou outras considerações. Os dois métodos restantes para provisionar uma nova replica discutidos nesta seção utilizam outros meios para transferir informações sobre transações para a nova replica.

**Injetando transações vazias.** A variável global `gtid_executed` da fonte contém o conjunto de todas as transações executadas na fonte. Em vez de copiar os logs binários ao fazer um snapshot para provisionar um novo servidor, você pode, em vez disso, anotar o conteúdo de `gtid_executed` no servidor do qual o snapshot foi feito. Antes de adicionar o novo servidor à cadeia de replicação, simplesmente commit uma transação vazia no novo servidor para cada identificador de transação contido no `gtid_executed` da fonte, assim:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Uma vez que todos os identificadores de transação tenham sido reestabelecidos dessa maneira usando transações vazias, você deve limpar e purgar os logs binários da replica, conforme mostrado aqui, onde *`N`* é o sufixo não nulo do nome atual do arquivo de log binário:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

Você deve fazer isso para evitar que este servidor inunda o fluxo de replicação com transações falsas, no caso de ser promovido para fonte posteriormente. (A declaração `FLUSH LOGS` força a criação de um novo arquivo de registro binário; `PURGE BINARY LOGS` elimina as transações vazias, mas mantém seus identificadores.)

Esse método cria um servidor que é essencialmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte, à medida que seu histórico de registro binário converge com o do fluxo de replicação (ou seja, à medida que ele alcança a fonte ou fontes). Esse resultado é semelhante em efeito ao obtido usando o método de provisionamento restante, que discutimos nos próximos parágrafos.

**Excluindo transações com gtid_purged.** A variável global `gtid_purged` da fonte contém o conjunto de todas as transações que foram purgadas do log binário da fonte. Como mencionado anteriormente (veja Injetando transações vazias), você pode registrar o valor de `gtid_executed` no servidor do qual o instantâneo foi tirado (em vez de copiar os logs binários para o novo servidor). Ao contrário do método anterior, não é necessário compromentar transações vazias (ou emitir `PURGE BINARY LOGS`), em vez disso, você pode definir `gtid_purged` diretamente na replica, com base no valor de `gtid_executed` no servidor do qual o backup ou instantâneo foi tirado.

Assim como o método que utiliza transações vazias, este método cria um servidor que é funcionalmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte, pois seu histórico de registro binário converge com o do servidor fonte de replicação ou do grupo.

**Restauração de réplicas no modo GTID.** Ao restaurar uma réplica em uma configuração de replicação baseada em GTID que encontrou um erro, a injeção de uma transação vazia pode não resolver o problema, pois um evento não tem um GTID.

Use o **mysqlbinlog** para encontrar a próxima transação, que provavelmente é a primeira transação no próximo arquivo de registro após o evento. Copie tudo até o `COMMIT` para essa transação, garantindo que inclua o `SET @@SESSION.GTID_NEXT`. Mesmo que você não esteja usando replicação baseada em string, ainda pode executar eventos de string de registro binário no cliente de string de comando.

Pare a replica e execute a transação que você copiou. A saída do **mysqlbinlog** define o delimitador como `/*!*/;`, então configure-o novamente:

```sql
mysql> DELIMITER ;
```

Reinicie a replicação a partir da posição correta automaticamente:

```sql
mysql> SET GTID_NEXT=automatic;
mysql> RESET SLAVE;
mysql> START SLAVE;
```

#### 16.1.3.6 Restrições sobre a Replicação com GTIDs
#### 16.1.3.7 Restrições sobre a Replicação com GTIDs em Redes de Rede
#### 16.1.3.8 Restrições sobre a Replicação com GTIDs em Redes de Rede de Área de Trabalho (WAN)

Como a replicação baseada em GTID depende de transações, algumas funcionalidades que, de outra forma, estão disponíveis no MySQL não são suportadas ao usá-la. Esta seção fornece informações sobre as restrições e limitações da replicação com GTIDs.

**Atualizações envolvendo motores de armazenamento não transacionais.** Ao usar GTIDs, as atualizações de tabelas usando motores de armazenamento não transacionais, como `MyISAM`, não podem ser feitas na mesma declaração ou transação que atualizações de tabelas usando motores de armazenamento transacionais, como `InnoDB`.

Essa restrição ocorre porque as atualizações em tabelas que utilizam um mecanismo de armazenamento não transacional, misturadas com atualizações em tabelas que utilizam um mecanismo de armazenamento transacional, dentro da mesma transação, podem resultar em múltiplos GTIDs sendo atribuídos à mesma transação.

Tais problemas também podem ocorrer quando a fonte e a replica usam diferentes motores de armazenamento para suas respectivas versões da mesma tabela, onde um motor de armazenamento é transacional e o outro não é. Além disso, esteja ciente de que os gatilhos que são definidos para operar em tabelas não transacionais podem ser a causa desses problemas.

Em qualquer um dos casos mencionados acima, a correspondência um-para-um entre as transações e os GTIDs é quebrada, com o resultado de que a replicação baseada em GTID não pode funcionar corretamente.

**CREATE TABLE ... SELECT instruções.** As instruções `CREATE TABLE ... SELECT` não são permitidas ao usar replicação com base em GTID. Quando `binlog_format` está definido como STATEMENT, uma instrução `CREATE TABLE ... SELECT` é registrada no log binário como uma transação com um GTID, mas se o formato ROW for usado, a instrução é registrada como duas transações com dois GTIDs. Se um formato STATEMENT for usado como fonte e uma replica usar o formato ROW, a replica não seria capaz de lidar com a transação corretamente, portanto, a instrução `CREATE TABLE ... SELECT` é desaconselhada com GTIDs para evitar esse cenário.

**Tabelas temporárias. As declarações `CREATE TEMPORARY TABLE` e `DROP TEMPORARY TABLE` não são suportadas dentro de transações, procedimentos, funções e gatilhos quando se usa GTIDs (ou seja, quando a variável de sistema `enforce_gtid_consistency` está definida como `ON`). É possível usar essas declarações com GTIDs habilitados, mas apenas fora de qualquer transação e apenas com `autocommit=1`.

**Prevenção da execução de declarações não suportadas.** Para evitar a execução de declarações que possam causar o fracasso da replicação baseada em GTID, todos os servidores devem ser iniciados com a opção `--enforce-gtid-consistency` ao habilitar GTIDs. Isso faz com que as declarações de qualquer um dos tipos discutidos anteriormente nesta seção falhem com um erro.

Observe que `--enforce-gtid-consistency` só tem efeito se o registro binário ocorrer para uma declaração. Se o registro binário estiver desativado no servidor, ou se as declarações não forem escritas no registro binário porque são removidas por um filtro, a consistência GTID não é verificada ou aplicada para as declarações que não são registradas.

Para obter informações sobre outras opções de inicialização necessárias ao habilitar GTIDs, consulte a Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs”.

**Saltar transações.** `sql_slave_skip_counter` não é suportado ao usar GTIDs. Se você precisa saltar transações, use o valor da variável da fonte `gtid_executed`. Para instruções, consulte a Seção 16.1.7.3, “Saltar Transações”.

**Ignorar servidores.** A opção IGNORE_SERVER_IDS da declaração `CHANGE MASTER TO` é desaconselhada ao usar GTIDs, porque as transações que já foram aplicadas são ignoradas automaticamente. Antes de começar a replicação baseada em GTIDs, verifique e limpe todas as listas de IDs de servidor ignoradas que foram previamente definidas nos servidores envolvidos. A declaração `SHOW SLAVE STATUS`, que pode ser emitida para canais individuais, exibe a lista de IDs de servidor ignorados, se houver uma. Se não houver uma lista, o campo `Replicate_Ignore_Server_Ids` está em branco.

Modo GTID e mysqldump. É possível importar um dump feito usando **mysqldump** em um servidor MySQL que esteja rodando com o modo GTID habilitado, desde que não haja GTIDs no log binário do servidor de destino.

Modo GTID e mysql_upgrade. Quando o servidor estiver em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`,) não habilite o registro binário por `mysqld_upgrade` (a opção `--write-binlog`).

#### 16.1.3.7 Exemplos de função armazenada para manipular GTIDs

Esta seção fornece exemplos de funções armazenadas (consulte o Capítulo 23, *Objetos Armazenados*), que você pode criar usando algumas das funções embutidas fornecidas pelo MySQL para uso com replicação baseada em GTID, listadas aqui:

* `GTID_SUBSET()`: Mostra se um conjunto de GTID é um subconjunto de outro.

* `GTID_SUBTRACT()`: Retorna os GTIDs de um conjunto de GTIDs que não estão em outro.

* `WAIT_FOR_EXECUTED_GTID_SET()`: Aguarda até que todas as transações em um conjunto de GTID específico tenham sido executadas.

Veja a Seção 12.18, “Funções usadas com Identificadores de Transação Global (GTIDs)”), para obter mais informações sobre as funções listadas acima.

Observe que, nessas funções armazenadas, o comando delimitador foi usado para alterar o delimitador da declaração MySQL em uma barra vertical, assim:

```sql
mysql> delimiter |
```

Todas as funções armazenadas mostradas nesta seção recebem representações de cadeia de conjuntos GTID como argumentos, portanto, os conjuntos GTID devem ser sempre citados quando utilizados com elas.

Essa função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem o mesmo conjunto, mesmo que não estejam formatados da mesma maneira:

```sql
CREATE FUNCTION GTID_IS_EQUAL(gs1 LONGTEXT, gs2 LONGTEXT)
  RETURNS INT
  RETURN GTID_SUBSET(gs1, gs2) AND GTID_SUBSET(gs2, gs1)
|
```

Essa função retorna um valor não nulo (verdadeiro) se dois conjuntos de GTID forem disjuntos:

```sql
CREATE FUNCTION GTID_IS_DISJOINT(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS INT
  RETURN GTID_SUBSET(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Essa função retorna não nula (verdadeiro) se dois conjuntos de GTID forem disjuntos e `sum` for sua união:

```sql
CREATE FUNCTION GTID_IS_DISJOINT_UNION(gs1 LONGTEXT, gs2 LONGTEXT, sum LONGTEXT)
RETURNS INT
  RETURN GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs1), gs2) AND
         GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs2), gs1)
|
```

Essa função retorna uma forma normalizada do conjunto de GTID, em maiúsculas, sem espaços em branco e sem duplicatas, com UUIDs em ordem alfabética e intervalos em ordem numérica:

```sql
CREATE FUNCTION GTID_NORMALIZE(gs LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, '')
|
```

Essa função retorna a união de dois conjuntos de GTID:

```sql
CREATE FUNCTION GTID_UNION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_NORMALIZE(CONCAT(gs1, ',', gs2))
|
```

Essa função retorna a interseção de dois conjuntos de GTID.

```sql
CREATE FUNCTION GTID_INTERSECTION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

Essa função retorna a diferença simétrica entre dois conjuntos de GTID, ou seja, os GTID que existem em `gs1`, mas não em `gs2`, bem como os GTID que existem em `gs2`, mas não em `gs1`.

```sql
CREATE FUNCTION GTID_SYMMETRIC_DIFFERENCE(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(CONCAT(gs1, ',', gs2), GTID_INTERSECTION(gs1, gs2))
|
```

Essa função remove de um conjunto de GTID todos os GTIDs com a origem especificada e retorna os GTIDs restantes, se houver. O UUID é o identificador usado pelo servidor onde a transação se originou, que normalmente é o valor de `server_uuid`.

```sql
CREATE FUNCTION GTID_SUBTRACT_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, CONCAT(UUID, ':1-', (1 << 63) - 2))
|
```

Essa função atua como o inverso da anterior; ela retorna apenas os GTIDs do conjunto de GTIDs que se originam do servidor com o identificador especificado (UUID).

```sql
CREATE FUNCTION GTID_INTERSECTION_WITH_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, GTID_SUBTRACT_UUID(gs, uuid))
|
```

**Exemplo 16.1 Verificando se uma réplica está atualizada**

As funções embutidas `GTID_SUBSET()` e `GTID_SUBTRACT()` podem ser usadas para verificar se uma replica aplicou pelo menos todas as transações que uma fonte aplicou.

Para realizar essa verificação com `GTID_SUBSET()`, execute a seguinte instrução na réplica:

```sql
SELECT GTID_SUBSET(source_gtid_executed, replica_gtid_executed);
```

Se o valor dos retornos for `0` (false), isso significa que alguns GTIDs em *`source_gtid_executed`* não estão presentes em *`replica_gtid_executed`*, e que a replica ainda não aplicou as transações que foram aplicadas na fonte, o que significa que a replica não está atualizada.

Para realizar a mesma verificação com `GTID_SUBTRACT()`, execute a seguinte instrução na réplica:

```sql
SELECT GTID_SUBTRACT(source_gtid_executed, replica_gtid_executed);
```

Essa declaração retorna quaisquer GTIDs que estejam em *`source_gtid_executed`*, mas não em *`replica_gtid_executed`*. Se algum GTID for retornado, a fonte aplicou algumas transações que a replica não aplicou, e, portanto, a replica não está atualizada.

**Exemplo 16.2 Cenário de backup e restauração**

As funções armazenadas `GTID_IS_EQUAL()`, `GTID_IS_DISJOINT()` e `GTID_IS_DISJOINT_UNION()` podem ser usadas para verificar operações de backup e restauração envolvendo múltiplos bancos de dados e servidores. Neste cenário de exemplo, `server1` contém o banco de dados `db1`, e `server2` contém o banco de dados `db2`. O objetivo é copiar o banco de dados `db2` para `server1`, e o resultado em `server1` deve ser a união dos dois bancos de dados. O procedimento usado é fazer backup de `server2` usando **mysqldump**, então restaurar esse backup em `server1`.

Se o **mysqldump** foi executado com `--set-gtid-purged` definido como `ON` ou `AUTO` (padrão), a saída contém uma declaração `SET @@GLOBAL.gtid_purged` que adiciona o conjunto `gtid_executed` definido em `server2` ao conjunto `gtid_purged` em `server1`. `gtid_purged` contém os GTIDs de todas as transações que foram comprometidas em um servidor específico, mas que não existem em nenhum arquivo de registro binário no servidor. Quando o banco de dados `db2` é copiado para `server1`, os GTIDs das transações comprometidas em `server2`, que não estão nos arquivos de registro binário em `server1`, devem ser adicionados a `gtid_purged` para que `server1` complete o conjunto.

As funções armazenadas podem ser usadas para auxiliar nos seguintes passos neste cenário:

* Use `GTID_IS_EQUAL()` para verificar se a operação de backup calculou o conjunto correto de GTID para a declaração `SET @@GLOBAL.gtid_purged`. Em `server2`, extraia essa declaração do **mysqldump** e armazene o conjunto de GTID em uma variável local, como `$gtid_purged_set`. Em seguida, execute a seguinte declaração:

  ```sql
  server2> SELECT GTID_IS_EQUAL($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

Se o resultado for 1, os dois conjuntos de GTID são iguais e o conjunto foi calculado corretamente.

* Use `GTID_IS_DISJOINT()` para verificar se o GTID definido na saída do **mysqldump** não sobrepõe-se ao definido no `gtid_executed` no `server1`. Ter GTIDs idênticos presentes em ambos os servidores causa erros ao copiar o banco de dados `db2` para `server1`. Para verificar, em `server1`, extraia e armazene `gtid_purged` da saída em uma variável local como feito anteriormente, em seguida, execute a seguinte declaração:

  ```sql
  server1> SELECT GTID_IS_DISJOINT($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

Se o resultado for 1, não há sobreposição entre os dois conjuntos de GTID, portanto, não há duplicatas de GTID presentes.

* Use `GTID_IS_DISJOINT_UNION()` para verificar se a operação de restauração resultou no estado correto do GTID em `server1`. Antes de restaurar o backup, em `server1`, obtenha o conjunto existente de `gtid_executed` executando a seguinte declaração:

  ```sql
  server1> SELECT @@GLOBAL.gtid_executed;
  ```

Armazene o resultado em uma variável local `$original_gtid_executed`, assim como o conjunto de `gtid_purged` em outra variável local, conforme descrito anteriormente. Quando o backup de `server2` tiver sido restaurado em `server1`, execute a seguinte instrução para verificar o estado do GTID:

  ```sql
  server1> SELECT
        ->   GTID_IS_DISJOINT_UNION($original_gtid_executed,
        ->                          $gtid_purged_set,
        ->                          @@GLOBAL.gtid_executed);
  ```

Se o resultado for `1`, a função armazenada verificou que o conjunto original `gtid_executed` de `server1` (`$original_gtid_executed`) e o conjunto `gtid_purged` que foi adicionado de `server2` (`$gtid_purged_set`) não têm sobreposição, e que o conjunto atualizado `gtid_executed` em `server1` agora consiste no conjunto anterior `gtid_executed` de `server1` mais o conjunto `gtid_purged` de `server2`, que é o resultado desejado. Certifique-se de que essa verificação seja realizada antes que quaisquer outras transações ocorram em `server1`, caso contrário, as novas transações em `gtid_executed` fazem com que ela falhe.

**Exemplo 16.3 Selecionando a replica mais atualizada para falha manual**

A função armazenada `GTID_UNION()` pode ser usada para identificar a réplica mais atualizada de um conjunto de réplicas, a fim de realizar uma operação de falha manual após um servidor fonte ter parado inesperadamente. Se algumas das réplicas estiverem experimentando atraso na replicação, essa função armazenada pode ser usada para calcular a réplica mais atualizada sem esperar que todas as réplicas apliquem seus registros de relevo existentes, e, portanto, para minimizar o tempo de falha. A função pode retornar a união de `gtid_executed` em cada réplica com o conjunto de transações recebidas pela réplica, que é registrado na tabela do Schema de Desempenho `replication_connection_status`. Você pode comparar esses resultados para descobrir qual o registro de transações da réplica é o mais atualizado, mesmo que nem todas as transações tenham sido comprometidas ainda.

Em cada réplica, calcule o registro completo das transações emitindo a seguinte declaração:

```sql
SELECT GTID_UNION(RECEIVED_TRANSACTION_SET, @@GLOBAL.gtid_executed)
    FROM performance_schema.replication_connection_status
    WHERE channel_name = 'name';
```

Em seguida, você pode comparar os resultados de cada réplica para ver qual delas tem o registro mais atualizado das transações e usar essa réplica como a nova fonte.

**Exemplo 16.4 Verificando transações estranhas em uma replica**

A função armazenada `GTID_SUBTRACT_UUID()` pode ser usada para verificar se uma replica recebeu transações que não se originaram de sua fonte ou fontes designadas. Se tiver, pode haver um problema com a configuração da replicação, ou com um proxy, roteador ou balanceador de carga. Esta função funciona removendo de um conjunto de GTID todos os GTIDs de um servidor de origem especificado e retornando os GTIDs restantes, se houver.

Para uma réplica com uma única fonte, emita a seguinte declaração, fornecendo o identificador da fonte original, que normalmente é o mesmo que `server_uuid`:

```sql
SELECT GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed, server_uuid_of_source);
```

Se o resultado não estiver vazio, as transações devolvidas são transações adicionais que não se originaram da fonte designada.

Para uma replica em uma topologia multifonte, inclua o UUID do servidor de cada fonte na chamada da função, assim:

```sql
SELECT
  GTID_SUBTRACT_UUID(GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed,
                                        server_uuid_of_source_1),
                                        server_uuid_of_source_2);
```

Se o resultado não estiver vazio, as transações devolvidas são transações extras que não se originaram de nenhuma das fontes designadas.

**Exemplo 16.5 Verificando se um servidor em uma topologia de replicação é somente leitura**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para verificar se um servidor não originou nenhum GTID e está em estado de leitura somente. A função retorna apenas os GTIDs do conjunto de GTID que se originam do servidor com o identificador especificado. Se alguma das transações listadas em `gtid_executed` deste servidor usar o próprio identificador do servidor, o servidor próprio originou essas transações. Você pode emitir a seguinte declaração no servidor para verificar:

```sql
SELECT GTID_INTERSECTION_WITH_UUID(@@GLOBAL.gtid_executed, my_server_uuid);
```

**Exemplo 16.6 Validando uma replica adicional na replicação de múltiplas fontes**

A função armazenada `GTID_INTERSECTION_WITH_UUID()` pode ser usada para descobrir se uma replica anexada a um conjunto de replicação multifonte aplicou todas as transações originárias de uma fonte em particular. Neste cenário, `source1` e `source2` são ambas fontes e réplicas e se replicam entre si. `source2` também tem sua própria replica. A replica também recebe e aplica transações de `source1` se `source2` for configurado com `log_replica_updates=ON`, mas não o faz se `source2` usa `log_replica_updates=OFF`. Independentemente do caso, atualmente queremos apenas descobrir se a replica está atualizada com `source2`. Nesta situação, `GTID_INTERSECTION_WITH_UUID()` pode ser usado para identificar as transações que `source2` originou, descartando as transações que `source2` replicou de `source1`. A função embutida `GTID_SUBSET()` pode então ser usada para comparar o resultado com o conjunto `gtid_executed` na replica. Se a replica estiver atualizada com `source2`, o conjunto `gtid_executed` na replica contém todas as transações no conjunto de interseção (as transações que originaram de `source2`).

Para realizar essa verificação, armazene os valores de `gtid_executed` e o UUID do servidor a partir de `source2` e o valor de `gtid_executed` da replica em variáveis do usuário da seguinte forma:

```sql
source2> SELECT @@GLOBAL.gtid_executed INTO @source2_gtid_executed;

source2> SELECT @@GLOBAL.server_uuid INTO @source2_server_uuid;

replica> SELECT @@GLOBAL.gtid_executed INTO @replica_gtid_executed;
```

Em seguida, use `GTID_INTERSECTION_WITH_UUID()` e `GTID_SUBSET()` com essas variáveis como entrada, conforme a seguir:

```sql
SELECT
  GTID_SUBSET(
    GTID_INTERSECTION_WITH_UUID(@source2_gtid_executed,
                                @source2_server_uuid),
                                @replica_gtid_executed);
```

O identificador do servidor de `source2` (`@source2_server_uuid`) é usado com `GTID_INTERSECTION_WITH_UUID()` para identificar e retornar apenas aqueles GTIDs do conjunto de GTIDs que se originaram em `source2`, omitindo aqueles que se originaram em `source1`. O conjunto de GTIDs resultante é então comparado com o conjunto de todos os GTIDs executados na replica, usando `GTID_SUBSET()`. Se esta declaração retornar um valor não nulo (verdadeiro), todos os GTIDs identificados de `source2` (o primeiro conjunto de entrada) também são encontrados em `gtid_executed` da replica, o que significa que a replica recebeu e executou todas as transações que se originaram de `source2`.

### 16.1.4 Mudando modos de replicação em servidores online

Esta seção descreve como alterar o modo de replicação que está sendo usado sem precisar fazer o servidor ficar offline.

#### 16.1.4.1 Conceitos do Modo de Replicação

Para poder configurar com segurança o modo de replicação de um servidor online, é importante entender alguns conceitos-chave da replicação. Esta seção explica esses conceitos e é uma leitura essencial antes de tentar modificar o modo de replicação de um servidor online.

Os modos de replicação disponíveis no MySQL dependem de diferentes técnicas para identificar as transações registradas. Os tipos de transações utilizados pela replicação são os seguintes:

As transações GTID são identificadas por um identificador global de transação (GTID) na forma `UUID:NUMBER`. Cada transação GTID em um registro é sempre precedida por um `Gtid_log_event`. As transações GTID podem ser endereçadas usando o GTID ou usando o nome do arquivo e a posição.

* As transações anônimas não têm um GTID atribuído, e o MySQL garante que cada transação anônima em um log é precedida por um `Anonymous_gtid_log_event`. Em versões anteriores, as transações anônimas não eram precedidas por nenhum evento específico. As transações anônimas só podem ser abordadas usando o nome do arquivo e a posição.

Ao usar GTIDs, você pode aproveitar a autoposição e o fail-over automático, além de usar `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids` e monitorar transações replicadas usando as tabelas do Schema de Desempenho. Com GTIDs habilitados, você não pode usar `sql_slave_skip_counter`, em vez disso, use transações vazias.

As transações em um log de relé que foi recebido de uma fonte que executa uma versão anterior do MySQL podem não ser precedidas por nenhum evento específico, mas, após serem regravadas e registradas no log binário da réplica, são precedidas por um `Anonymous_gtid_log_event`.

A capacidade de configurar o modo de replicação online significa que as variáveis `gtid_mode` e `enforce_gtid_consistency` agora são dinâmicas e podem ser definidas a partir de uma declaração de nível superior por uma conta que tenha privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. Em versões anteriores, ambas as variáveis podiam ser configuradas apenas usando a opção apropriada no início do servidor, o que significava que as alterações no modo de replicação exigiam um reinício do servidor. Em todas as versões, `gtid_mode` podia ser definido para `ON` ou `OFF`, o que correspondia a se GTIDs eram usados para identificar transações ou não. Quando `gtid_mode=ON` não é possível replicar transações anônimas, e quando `gtid_mode=OFF` apenas transações anônimas podem ser replicadas. A partir do MySQL 5.7.6, a variável `gtid_mode` tem dois estados adicionais, `OFF_PERMISSIVE` e `ON_PERMISSIVE`. Quando `gtid_mode=OFF_PERMISSIVE` então *novos* transações são anônimos, permitindo que as transações replicadas sejam ou GTIDs ou transações anônimas. Quando `gtid_mode=ON_PERMISSIVE` então *novos* transações usam GTIDs, permitindo que as transações replicadas sejam ou GTIDs ou transações anônimas. Isso significa que é possível ter uma topologia de replicação que tem servidores usando transações anônimas e GTIDs. Por exemplo, uma fonte com `gtid_mode=ON` pode estar replicando para uma replica com `gtid_mode=ON_PERMISSIVE`. Os valores válidos para `gtid_mode` são os seguintes e nessa ordem:

* `OFF`
* `OFF_PERMISSIVE`
* `ON_PERMISSIVE`
* `ON`

É importante notar que o estado de `gtid_mode` só pode ser alterado de uma vez por vez, com base na ordem acima. Por exemplo, se `gtid_mode` está atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`. Isso garante que o processo de mudança de transações anônimas para transações GTID online seja corretamente tratado pelo servidor. Quando você muda entre `gtid_mode=ON` e `gtid_mode=OFF`, o estado GTID (ou seja, o valor de `gtid_executed`) é persistente. Isso garante que o conjunto de GTID que foi aplicado pelo servidor seja sempre mantido, independentemente das mudanças entre os tipos de `gtid_mode`.

Como parte das mudanças introduzidas pelo MySQL 5.7.6, os campos relacionados aos GTIDs foram modificados para exibirem as informações corretas, independentemente do `gtid_mode` atualmente selecionado. Isso significa que os campos que exibem conjuntos de GTID, como `gtid_executed`, `gtid_purged`, `RECEIVED_TRANSACTION_SET` na tabela `replication_connection_status` do Gerador de Desempenho, e os resultados relacionados ao GTID de `SHOW SLAVE STATUS`, agora retornam a string vazia quando não há GTIDs presentes. Os campos que exibem um único GTID, como `CURRENT_TRANSACTION` na tabela do Gerador de Desempenho `replication_applier_status_by_worker`, agora exibem `ANONYMOUS` quando as transações de GTID não estão sendo usadas.

A replicação a partir de uma fonte usando `gtid_mode=ON` permite a utilização de autoposição, configurada usando a declaração `CHANGE MASTER TO MASTER_AUTO_POSITION = 1;`. A topologia de replicação que está sendo usada afeta se é possível habilitar a autoposição ou não, pois essa funcionalidade depende de GTIDs e não é compatível com transações anônimas. Um erro é gerado se a autoposição for habilitada e uma transação anônima for encontrada. É altamente recomendável garantir que não haja transações anônimas restantes na topologia antes de habilitar a autoposição, veja Seção 16.1.4.2, “Habilitando Transações GTID Online”. As combinações válidas de `gtid_mode` e autoposição na fonte e na replica são mostradas na tabela a seguir, onde o `gtid_mode` da fonte é mostrado na horizontal e o `gtid_mode` da replica é na vertical:

**Tabela 16.1 Combinações válidas de gtid_mode de origem e réplica**

<table width="708"><col style="width: 2%"/><col style="width: 1%"/><col style="width: 2%"/><col style="width: 21%"/><col style="width: 17%"/><thead><tr> <th><p> <code>gtid_mode</code> </p></th> <th><p> Source <code>OFF</code> </p></th> <th><p> Source <code>OFF_PERMISSIVE</code> </p></th> <th><p> Source <code>ON_PERMISSIVE</code> </p></th> <th><p> Source <code>ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr></tbody></table>

Na tabela acima, as entradas são:

* `Y`: o `gtid_mode` da fonte e da replica é compatível

* `N`: o `gtid_mode` da fonte e da replica não é compatível

* `*`: auto-posicionamento pode ser usado

O `gtid_mode` atualmente selecionado também afeta a variável `gtid_next`. O seguinte quadro mostra o comportamento do servidor para os diferentes valores de `gtid_mode` e `gtid_next`.

**Tabela 16.2 Combinações válidas de gtid_mode e gtid_next**

<table><col style="width: 2.03%"/><col style="width: 1%"/><col style="width: 2.01%"/><col style="width: 1.92%"/><col style="width: 1.04%"/><thead><tr> <th><p> <code>gtid_next</code> </p></th> <th><p> AUTOMATIC </p><p> binary log on </p></th> <th><p> AUTOMATIC </p><p> binary log off </p></th> <th><p> ANONYMOUS </p></th> <th><p> UUID:NUMBER </p></th> </tr></thead><tbody><tr> <th><p> <code>&gt;OFF</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td>ANONYMOUS</td> <td><p> Error </p></td> </tr><tr> <th><p> <code>&gt;OFF_PERMISSIVE</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON_PERMISSIVE</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> Error </p></td> <td><p> UUID:NUMBER </p></td> </tr></tbody></table>

Na tabela acima, as entradas são:

* `ANONYMOUS`: gerar uma transação anônima.

* `Error`: gerar um erro e não conseguir executar `SET GTID_NEXT`.

* `UUID:NUMBER`: gerar um GTID com o UUID especificado: NUMBER.

* `New GTID`: gerar um GTID com um número gerado automaticamente.

Quando o log binário está desativado e `gtid_next` está definido como `AUTOMATIC`, então não é gerado nenhum GTID. Isso é consistente com o comportamento das versões anteriores.

#### 16.1.4.2 Habilitando Transações GTID Online

Esta seção descreve como habilitar transações GTID e, opcionalmente, autoposicionamento em servidores que já estão online e que utilizam transações anônimas. Esse procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores ao habilitar transações GTID, esse processo é mais fácil.

Antes de começar, certifique-se de que os servidores atendem às seguintes condições prévias:

* Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Você não pode habilitar transações GTID online em qualquer servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

* Todos os servidores têm `gtid_mode` definido no valor padrão `OFF`.

O procedimento a seguir pode ser interrompido a qualquer momento e, posteriormente, retomado onde estava, ou revertido saltando para o passo correspondente da Seção 16.1.4.3, “Desabilitar Transações GTID Online”, o procedimento online para desabilitar GTIDs. Isso torna o procedimento tolerante a falhas, pois quaisquer problemas não relacionados que possam aparecer no meio do procedimento podem ser tratados como de costume, e, em seguida, o procedimento é continuado onde foi interrompido.

Nota

É crucial que você complete cada etapa antes de continuar para a próxima etapa.

Para habilitar transações GTID:

1. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN;
   ```

Deixe o servidor rodar por um tempo com a carga de trabalho normal e monitore os registros. Se este passo causar quaisquer avisos no registro, ajuste sua aplicação para que ela use apenas recursos compatíveis com GTID e não gere quaisquer avisos.

Importante

Este é o primeiro passo importante. Você deve garantir que nenhum aviso esteja sendo gerado nos registros de erro antes de passar para o próximo passo.

2. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
   ```

3. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

Não importa qual servidor execute essa declaração primeiro, mas é importante que todos os servidores completem essa etapa antes que qualquer servidor comece a próxima etapa.

4. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

Não importa qual servidor execute essa declaração primeiro.

5. Em cada servidor, espere até que a variável de status `ONGOING_ANONYMOUS_TRANSACTION_COUNT` seja zero. Isso pode ser verificado usando:

   ```sql
   SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT';
   ```

Nota

Em uma réplica, teoricamente é possível que mostre zero e depois novamente não zero. Isso não é um problema, basta que mostre zero uma vez.

6. Aguarde todas as transações geradas até o passo 5 serem replicadas em todos os servidores. Você pode fazer isso sem parar as atualizações: a única coisa importante é que todas as transações anônimas sejam replicadas.

Veja a Seção 16.1.4.4, “Verificação da Replicação de Transações Anônimas”, para um método de verificação de que todas as transações anônimas foram replicadas para todos os servidores.

7. Se você usar logs binários para qualquer outra finalidade que não seja replicação, por exemplo, backup e restauração em um ponto específico, espere até que não precise mais dos logs binários antigos com transações sem GTIDs.

Por exemplo, após o passo 6 ter sido concluído, você pode executar `FLUSH LOGS` no servidor onde está fazendo backups. Em seguida, você pode fazer explicitamente um backup ou esperar pela próxima iteração de qualquer rotina de backup periódico que você tenha configurado.

Idealmente, espere que o servidor elimine todos os logs binários que existiam quando o passo 6 foi concluído. Além disso, espere que qualquer backup feito antes do passo 6 expire.

Importante

Este é o segundo ponto importante. É vital entender que os registros binários que contêm transações anônimas, sem GTIDs, não podem ser usados após o próximo passo. Após este passo, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

8. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. Em cada servidor, adicione `gtid_mode=ON` e `enforce_gtid_consistency=ON` ao `my.cnf`.

Agora, você tem a garantia de que todas as transações possuem um GTID (exceto as transações geradas no passo 5 ou anteriormente, que já foram processadas). Para começar a usar o protocolo GTID, a fim de que você possa realizar falha automática posteriormente, execute o seguinte em cada replica. Opcionalmente, se você usa replicação de múltiplas fontes, faça isso para cada canal e inclua a cláusula `FOR CHANNEL channel`:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

#### 16.1.4.3 Desativação de Transações GTID Online

Esta seção descreve como desativar as transações GTID em servidores que já estão online. Este procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores quando desativando o modo GTID, esse procedimento é mais fácil.

O processo é semelhante ao de habilitar transações GTID enquanto o servidor está online, mas invertendo os passos. A única coisa que difere é o ponto em que você espera que as transações registradas se repliquem.

Antes de começar, certifique-se de que os servidores atendem às seguintes condições prévias:

* Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Não é possível desabilitar transações GTID online em qualquer servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

* Todos os servidores têm `gtid_mode` definido como `ON`.

1. Execute o seguinte em cada réplica, e, se estiver usando replicação de múltiplas fontes, faça isso para cada canal e inclua a cláusula de canal `FOR CHANNEL`:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 0, MASTER_LOG_FILE = file, \
   MASTER_LOG_POS = position [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

2. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

4. Em cada servidor, espere até que a variável @@GLOBAL.GTID_OWNED seja igual à string vazia. Isso pode ser verificado usando:

   ```sql
   SELECT @@GLOBAL.GTID_OWNED;
   ```

Em uma réplica, teoricamente é possível que ela esteja vazia e, em seguida, novamente não vazia. Isso não é um problema, basta que ela esteja vazia uma vez.

5. Aguarde todas as transações que atualmente existem em qualquer log binário para se replicar em todas as réplicas. Veja a Seção 16.1.4.4, “Verificando a Replicação de Transações Anônimas”, para um método de verificação de que todas as transações anônimas se replicaram em todos os servidores.

6. Se você usar logs binários para qualquer outra coisa que não seja replicação, por exemplo, para fazer backup ou restauração em um ponto no tempo: espere até que você não precise mais dos logs binários antigos com transações GTID.

Por exemplo, após o passo 5 ter sido concluído, você pode executar `FLUSH LOGS` no servidor onde está fazendo o backup. Em seguida, você pode ou tomar explicitamente um backup ou esperar para a próxima iteração de qualquer rotina de backup periódico que você tenha configurado.

Idealmente, espere que o servidor elimine todos os logs binários que existiam quando o passo 5 foi concluído. Além disso, espere que qualquer backup feito antes do passo 5 expire.

Importante

Este é o único ponto importante durante este procedimento. É importante entender que os registros que contêm transações GTID não podem ser usados após a próxima etapa. Antes de prosseguir, você deve ter certeza de que as transações GTID não existem em nenhuma parte da topologia.

7. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF;
   ```

8. Em cada servidor, defina `gtid_mode=OFF` em `my.cnf`.

Se você deseja definir `enforce_gtid_consistency=OFF`, pode fazer isso agora. Após defini-la, você deve adicionar `enforce_gtid_consistency=OFF` ao seu arquivo de configuração.

Se você quiser fazer uma desativação para uma versão anterior do MySQL, pode fazer isso agora, usando o procedimento normal de desativação.

#### 16.1.4.4 Verificando a Replicação de Transações Anônimas

Esta seção explica como monitorar uma topologia de replicação e verificar se todas as transações anônimas foram replicadas. Isso é útil quando você está mudando o modo de replicação online, pois você pode verificar se é seguro mudar para transações GTID.

Existem várias maneiras possíveis de esperar que as transações se repliquem:

O método mais simples, que funciona independentemente da sua topologia, mas que depende do cronometragem, é o seguinte: se você tem certeza de que a replica nunca fica mais de N segundos atrasada, basta esperar um pouco mais de N segundos. Ou espere por um dia, ou qualquer período de tempo que você considere seguro para sua implantação.

Um método mais seguro, no sentido de que não depende do momento: se você tem apenas uma fonte com uma ou mais réplicas, faça o seguinte:

1. No código fonte, execute:

   ```sql
   SHOW MASTER STATUS;
   ```

Anote os valores nas colunas `File` e `Position`.

2. Em cada réplica, use as informações de arquivo e posição da fonte para executar:

   ```sql
   SELECT MASTER_POS_WAIT(file, position);
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

### 16.1.5 Replicação de múltiplas fontes do MySQL

A replicação multifonte do MySQL permite que uma replica receba transações de múltiplas fontes imediatas em paralelo. Em uma topologia de replicação multifonte, uma replica cria um canal de replicação para cada fonte da qual deve receber transações. Para mais informações sobre como os canais de replicação funcionam, consulte a Seção 16.2.2, “Canais de replicação”.

Você pode optar por implementar a replicação de múltiplas fontes para alcançar objetivos como esses:

* Fazer backup de vários servidores em um único servidor. * Mesclar fragmentos de tabela. * Consolidar dados de vários servidores em um único servidor.

A replicação de múltiplas fontes não implementa detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para o aplicativo, se necessário.

Nota

Cada canal em uma replica multi-fonte deve replicar a partir de uma fonte diferente. Não é possível configurar vários canais de replicação a partir de uma única replica para uma única fonte. Isso ocorre porque os IDs dos servidores das réplicas devem ser únicos em uma topologia de replicação. A fonte distingue as réplicas apenas por seus IDs de servidor, não pelos nomes dos canais de replicação, portanto, não pode reconhecer diferentes canais de replicação da mesma replica.

Uma replica multi-fonte também pode ser configurada como uma replica multi-encadeada, definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0. Quando você faz isso em uma replica multi-fonte, cada canal na replica tem o número especificado de threads do aplicável, além de uma thread de coordenador para gerenciá-las. Você não pode configurar o número de threads do aplicável para canais individuais.

Esta seção fornece tutoriais sobre como configurar fontes e réplicas para replicação de múltiplas fontes, como iniciar, parar e reiniciar réplicas de múltiplas fontes, e como monitorar a replicação de múltiplas fontes.

#### 16.1.5.1 Configurando a Replicação de Múltiplas Fontes

Uma topologia de replicação de múltiplas fontes requer pelo menos duas fontes e uma replica configurada. Nesses tutoriais, assumimos que você tem duas fontes `source1` e `source2`, e uma replica `replicahost`. A replica replica um banco de dados de cada uma das fontes, `db1` de `source1` e `db2` de `source2`.

Fontes em uma topologia de replicação de múltiplas fontes podem ser configuradas para usar replicação baseada em GTID ou replicação baseada na posição do log binário. Veja a Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs”, para saber como configurar uma fonte usando replicação baseada em GTID. Veja a Seção 16.1.2.1, “Configurando a Configuração da Fonte de Replicação”, para saber como configurar uma fonte usando replicação baseada na posição do arquivo.

As réplicas em uma topologia de replicação de múltiplas fontes requerem os repositórios `TABLE` para o repositório de metadados de conexão e o repositório de metadados do aplicável, conforme especificado pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`. A replicação de múltiplas fontes não é compatível com os repositórios `FILE`.

Para modificar uma replica existente que está usando os repositórios `FILE` para os repositórios de metadados de replicação, para usar os repositórios `TABLE`, você pode converter os repositórios existentes dinamicamente, usando o cliente **mysql** para emitir as seguintes declarações na replica:

```sql
mysql> STOP SLAVE;
mysql> SET GLOBAL master_info_repository = 'TABLE';
mysql> SET GLOBAL relay_log_info_repository = 'TABLE';
```

Crie uma conta de usuário adequada em todos os servidores de origem de replicação que a réplica pode usar para se conectar. Você pode usar a mesma conta em todas as fontes ou uma conta diferente em cada uma. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `ted`, que pode se conectar a partir da réplica `replicahost`, use o cliente **mysql** para emitir essas declarações em cada uma das fontes:

```sql
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

Para mais detalhes, consulte a Seção 16.1.2.2, “Criando um Usuário para Replicação”.

#### 16.1.5.2  Provisão de uma réplica de múltiplas fontes para replicação baseada em GTID

Se as fontes na topologia de replicação de múltiplas fontes tiverem dados existentes, pode-se economizar tempo ao provisionar a replica com os dados relevantes antes de começar a replicação. Em uma topologia de replicação de múltiplas fontes, não é possível copiar o diretório de dados para provisionar a replica com dados de todas as fontes, e você também pode querer replicar apenas bancos de dados específicos de cada fonte. Portanto, a melhor estratégia para provisionar uma replica desse tipo é usar o **mysqldump** para criar um arquivo de dump apropriado em cada fonte, e depois usar o cliente **mysql** para importar o arquivo de dump na replica.

Se você estiver usando replicação baseada em GTID, precisa prestar atenção à declaração `SET @@GLOBAL.gtid_purged` que o **mysqldump** coloca na saída do dump. Essa declaração transfere os GTIDs para as transações executadas na fonte para a replica, e a replica requer essas informações. No entanto, para qualquer caso mais complexo do que provisionar uma nova replica vazia a partir de uma fonte, você precisa verificar qual efeito a declaração tem na versão do MySQL da replica e lidar com a declaração conforme necessário. O seguinte guia resume as ações adequadas, mas, para mais detalhes, consulte a documentação do **mysqldump**.

Em MySQL 5.6 e 5.7, a declaração `SET @@GLOBAL.gtid_purged` escrita por **mysqldump** substitui o valor de `gtid_purged` na réplica. Além disso, nesses lançamentos, esse valor só pode ser alterado quando o registro de transações da réplica com GTIDs (o conjunto `gtid_executed`) está vazio. Em uma topologia de replicação de múltiplas fontes, portanto, você deve remover a declaração `SET @@GLOBAL.gtid_purged` da saída do dump antes de refazer os arquivos de dump, porque você não pode aplicar um segundo ou arquivo de dump subsequente que inclua essa declaração. Como alternativa para remover a declaração `SET @@GLOBAL.gtid_purged`, se você está provisionando a réplica com dois dumps parciais da mesma fonte, e o conjunto de GTIDs no segundo dump é o mesmo que o primeiro (para que não tenham sido executadas novas transações na fonte entre os dumps), você pode definir a opção `--set-gtid-purged` de **mysqldump** para `OFF` ao gerar o segundo arquivo de dump, para omitir a declaração.

Para o MySQL 5.6 e 5.7, essas limitações significam que todos os arquivos de dump das fontes devem ser aplicados em uma única operação em uma replica com um conjunto vazio de `gtid_executed`. Você pode limpar o histórico de execução do GTID de uma replica emitindo `RESET MASTER` na replica, mas se você tiver outras transações desejadas com GTIDs na replica, escolha um método alternativo de provisionamento dos descritos na Seção 16.1.3.5, “Usando GTIDs para Failover e Scaleout”.

No exemplo de provisionamento a seguir, assumimos que a declaração `SET @@GLOBAL.gtid_purged` precisa ser removida dos arquivos e tratada manualmente. Também assumimos que não há transações desejadas com GTIDs na replica antes do início do provisionamento.

1. Para criar arquivos de depuração para um banco de dados denominado `db1` em `source1` e um banco de dados denominado `db2` em `source2`, execute o **mysqldump** para `source1` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

Em seguida, execute o **mysqldump** para `source2` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor `gtid_purged` que o **mysqldump** adicionou a cada um dos arquivos de dump. Por exemplo, para arquivos de dump criados no MySQL 5.6 ou 5.7, você pode extrair o valor da seguinte maneira:

   ```sql
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

O resultado em cada caso deve ser um conjunto de GTID, por exemplo:

   ```sql
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a string de cada arquivo de dump que contém a declaração `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```sql
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente **mysql** para importar cada arquivo de dump editado na replica. Por exemplo:

   ```sql
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na replica, emita a instrução `RESET MASTER` para limpar o histórico de execução do GTID (assumindo, como explicado acima, que todos os arquivos de implantação foram importados e que não há transações desejadas com GTIDs na replica). Em seguida, emita uma declaração `SET @@GLOBAL.gtid_purged` para definir o valor do `gtid_purged` na união de todos os conjuntos de GTID de todos os arquivos de implantação, conforme registrado no Passo 2. Por exemplo:

   ```sql
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

Se houver, ou houver possibilidade de, transações sobrepostas entre os conjuntos de GTID nos arquivos de dump, você pode usar as funções armazenadas descritas na Seção 16.1.3.7, “Exemplos de Função Armazenada para Manipular GTIDs”, para verificar isso previamente e calcular a união de todos os conjuntos de GTID.

#### 16.1.5.3 Adicionando fontes com base em GTID a uma réplica de múltiplas fontes

Esses passos pressupõem que você tenha habilitado GTIDs para transações nos servidores da fonte de replicação usando `gtid_mode=ON`, criado um usuário de replicação, garantido que a replica esteja usando repositórios de metadados de replicação com base em `TABLE` e, se apropriado, provisionou a replica com dados das fontes.

Utilize a declaração `CHANGE MASTER TO` para configurar um canal de replicação para cada fonte na replica (consulte Seção 16.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Para a replicação baseada em GTID, o posicionamento automático do GTID é usado para sincronizar com a fonte (consulte Seção 16.1.3.3, “Posicionamento Automático do GTID”). A opção `MASTER_AUTO_POSITION` é definida para especificar o uso do posicionamento automático.

Por exemplo, para adicionar `source1` e `source2` como fontes para a replica, use o cliente **mysql** para emitir a declaração `CHANGE MASTER TO` duas vezes na replica, como este:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE MASTER TO` e outras opções disponíveis, consulte a Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.

#### 16.1.5.4 Adicionando uma fonte de registro binário à replica de múltiplas fontes

Esses passos pressupem que você habilitou o registro binário no servidor de origem de replicação usando `--log-bin`, a replica está usando repositórios de metadados de replicação com base em `TABLE` e que você habilitou um usuário de replicação e anotou a posição atual do registro binário. Você precisa saber os atuais `MASTER_LOG_FILE` e `MASTER_LOG_POSITION`.

Use a declaração `CHANGE MASTER TO` para configurar um canal de replicação para cada fonte na replica (consulte Seção 16.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Por exemplo, para adicionar `source1` e `source2` como fontes na replica, use o cliente **mysql** para emitir a declaração `CHANGE MASTER TO` duas vezes na replica, como este:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE MASTER TO` e outras opções disponíveis, consulte a Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.

#### 16.1.5.5 Início das Replicas de Múltiplos Fontes

Depois de adicionar canais para todas as fontes, emita uma declaração `START SLAVE` para iniciar a replicação. Quando você habilitou vários canais em uma replica, pode optar por iniciar todos os canais ou selecionar um canal específico para iniciar. Por exemplo, para iniciar os dois canais separadamente, use o cliente **mysql** para emitir as seguintes declarações:

```sql
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
```

Para a sintaxe completa do comando `START SLAVE` e outras opções disponíveis, consulte a Seção 13.4.2.5, “Instrução START SLAVE”.

Para verificar se ambos os canais começaram e estão operando corretamente, você pode emitir declarações `SHOW SLAVE STATUS` na réplica, por exemplo:

```sql
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
```

#### 16.1.5.6 Parar as Replicas de Múltiplos Fontes

A declaração `STOP SLAVE` pode ser usada para interromper uma replica de múltiplas fontes. Por padrão, se você usar a declaração `STOP SLAVE` em uma replica de múltiplas fontes, todos os canais são interrompidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para interromper apenas um canal específico.

* Para parar todos os canais de replicação configurados atualmente:

  ```sql
  STOP SLAVE;
  ```

* Para interromper apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando `STOP SLAVE` e outras opções disponíveis, consulte a Seção 13.4.2.6, “Declaração STOP SLAVE”.

#### 16.1.5.7 Redefinindo Replicas de Múltiplas Fontes

A declaração `RESET SLAVE` pode ser usada para redefinir uma replica de múltiplas fontes. Por padrão, se você usar a declaração `RESET SLAVE` em uma replica de múltiplas fontes, todos os canais são redefinidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para redefinir apenas um canal específico.

* Para redefinir todos os canais de replicação configurados atualmente:

  ```sql
  RESET SLAVE;
  ```

* Para redefinir apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  RESET SLAVE FOR CHANNEL "source_1";
  ```

Para a replicação baseada em GTID, observe que `RESET SLAVE` não afeta o histórico de execução do GTID da replica. Se você deseja limpar isso, emita `RESET MASTER` na replica.

`RESET SLAVE` faz com que a replica esqueça sua posição de replicação e limpe o log do relé, mas não altera nenhum parâmetro de conexão de replicação, como o nome do host da fonte. Se você deseja remover esses parâmetros para um canal, execute `RESET SLAVE ALL`.

Para a sintaxe completa do comando `RESET SLAVE` e outras opções disponíveis, consulte a Seção 13.4.2.3, “Declaração RESET SLAVE”.

#### 16.1.5.8 Monitoramento da Replicação de Múltiplos Fontes

Para monitorar o status dos canais de replicação, existem as seguintes opções:

* Usando as tabelas do Schema de desempenho de replicação. A primeira coluna dessas tabelas é `Channel_Name`. Isso permite que você escreva consultas complexas com base em `Channel_Name` como chave. Veja a Seção 25.12.11, “Tabelas de replicação do Schema de desempenho”.

* Usando `SHOW SLAVE STATUS FOR CHANNEL channel`. Por padrão, se a cláusula `FOR CHANNEL channel` não for usada, esta declaração mostra o status da replicação para todos os canais com uma string por canal. O identificador `Channel_name` é adicionado como uma coluna no conjunto de resultados. Se for fornecida uma cláusula `FOR CHANNEL channel`, os resultados mostram o status apenas do canal de replicação nomeado.

Nota

A declaração `SHOW VARIABLES` não funciona com múltiplos canais de replicação. As informações que estavam disponíveis através dessas variáveis foram migradas para as tabelas de desempenho de replicação. Usar uma declaração `SHOW VARIABLES` em uma topologia com múltiplos canais mostra o status apenas do canal padrão.

##### 16.1.5.8.1 Monitoramento de canais usando tabelas do Schema de desempenho

Esta seção explica como usar as tabelas do Schema de desempenho de replicação para monitorar canais. Você pode optar por monitorar todos os canais ou um subconjunto dos canais existentes.

Para monitorar o status de conexão de todos os canais:

```sql
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

No texto acima, há dois canais habilitados, e como mostrado pelo campo `CHANNEL_NAME`, eles são chamados de `source_1` e `source_2`.

A adição do campo `CHANNEL_NAME` permite que você consulte as tabelas do Schema de Desempenho para um canal específico. Para monitorar o estado da conexão de um canal nomeado, use uma cláusula `WHERE CHANNEL_NAME=channel`:

```sql
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

Da mesma forma, a cláusula `WHERE CHANNEL_NAME=channel` pode ser usada para monitorar as outras tabelas do Schema de desempenho de replicação para um canal específico. Para mais informações, consulte a Seção 25.12.11, “Tabelas de replicação do Schema de desempenho”.

### 16.1.6 Opções e variáveis de replicação e registro binário

As seções a seguir contêm informações sobre as opções de `mysqld` e as variáveis do servidor que são usadas na replicação e para o controle do log binário. As opções e variáveis para uso em fontes e réplicas são abordadas separadamente, assim como as opções e variáveis relacionadas ao registro binário e identificadores de transação global (GTIDs). Um conjunto de tabelas de referência rápida que fornecem informações básicas sobre essas opções e variáveis também está incluído.

De particular importância é a variável de sistema `server_id`.

<table frame="box" rules="all" summary="Properties for server_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--server-id=#</code></td> </tr><tr><th>System Variable</th> <td><code>server_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Essa variável especifica o ID do servidor. No MySQL 5.7, `server_id` deve ser especificado se o registro binário estiver habilitado, caso contrário, o servidor não será permitido iniciar.

`server_id` é definido como 0 por padrão. Em um servidor de origem de replicação e em cada réplica, você *deve* especificar `server_id` para estabelecer um ID de replicação único na faixa de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Para informações adicionais, consulte a Seção 16.1.6.2, “Opções e Variáveis de Fonte de Replicação”, e a Seção 16.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

Se o ID do servidor estiver definido como 0, o registro binário ocorre, mas uma fonte com um ID de servidor de 0 recusa quaisquer conexões de réplicas, e uma réplica com um ID de servidor de 0 recusa-se a se conectar a uma fonte. Note que, embora você possa alterar o ID do servidor dinamicamente para um valor não nulo, isso não permite que a replicação comece imediatamente. Você deve alterar o ID do servidor e, em seguida, reiniciar o servidor para inicializar a réplica.

Para mais informações, consulte a Seção 16.1.2.5.1, “Definindo a configuração de replicação”.

`server_uuid`

No MySQL 5.7, o servidor gera um UUID verdadeiro, além do valor `server_id` fornecido pelo usuário. Isso está disponível como a variável de sistema global e somente de leitura `server_uuid`.

Nota

A presença da variável de sistema `server_uuid` no MySQL 5.7 não altera a exigência de definir um valor único `server_id` para cada servidor MySQL como parte da preparação e execução da replicação do MySQL, conforme descrito anteriormente nesta seção.

<table frame="box" rules="all" summary="Properties for server_uuid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>server_uuid</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Ao iniciar, o servidor MySQL obtém automaticamente uma UUID da seguinte forma:

1. Tente ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde *`data_dir`* é o diretório de dados do servidor).

2. Se o `data_dir/auto.cnf` não for encontrado, gere um novo UUID e salve-o neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` tem um formato semelhante ao utilizado para os arquivos `my.cnf` ou `my.ini`. No MySQL 5.7, o `auto.cnf` tem apenas uma única seção `[auto]` contendo um único `server_uuid` de configuração e valor; o conteúdo do arquivo parece semelhante ao mostrado aqui:

```sql
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a replicação do MySQL, as fontes e as réplicas conhecem os UUIDs das outras. O valor do UUID de uma réplica pode ser visto na saída de `SHOW SLAVE HOSTS`. Uma vez que `START SLAVE` tenha sido executado, o valor do UUID da fonte estará disponível na réplica na saída de `SHOW SLAVE STATUS`.

Nota

Emitir uma declaração `STOP SLAVE` ou `RESET SLAVE` *não* redefiniu o UUID da fonte, conforme utilizado na replica.

O `server_uuid` de um servidor também é usado em GTIDs para transações que têm origem nesse servidor. Para mais informações, consulte a Seção 16.1.3, “Replicação com Identificadores Globais de Transação”.

Ao iniciar, o thread de I/O de replicação gera um erro e é abortado se o UUID da fonte for igual ao seu, a menos que a opção `--replicate-same-server-id` tenha sido definida. Além disso, o thread de I/O de replicação gera uma mensagem de alerta se qualquer um dos seguintes for verdadeiro:

* Não existe nenhuma fonte com o `server_uuid` esperado.

* A fonte `server_uuid` do autor mudou, embora nenhuma declaração `CHANGE MASTER TO` tenha sido executada.

#### 16.1.6.1 Opção de replicação e registro binário e referência de variáveis

As duas seções seguintes fornecem informações básicas sobre as opções de string de comando do MySQL e as variáveis do sistema aplicáveis à replicação e ao log binário.

##### Opções e variáveis de replicação

As opções de string de comando e as variáveis do sistema na lista a seguir se relacionam aos servidores de origem de replicação e réplicas. A Seção 16.1.6.2, “Opções e Variáveis de Origem de Replicação”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas aos servidores de origem de replicação. Para mais informações sobre as opções e variáveis relacionadas às réplicas, consulte a Seção 16.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

* `abort-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `auto_increment_increment`: As colunas AUTO_INCREMENT são incrementadas por este valor.

* `auto_increment_offset`: O deslocamento foi adicionado às colunas AUTO_INCREMENT.

* `Com_change_master`: Contagem de declarações de REPLICAÇÃO DE ALTERAÇÕES DE e ALTERAÇÃO DO MESTRE PARA.

* `Com_show_master_status`: Contagem de declarações de STATUS do MESTRE.

* `Com_show_slave_hosts`: Contagem de REPLICAS SHOW e HOSTS SHOW SLAVE.

* `Com_show_slave_status`: Contagem de declarações de SHOW REPLICA STATUS e SHOW SLAVE STATUS.

* `Com_slave_start`: Contagem de declarações de START REPLICA e START SLAVE.

* `Com_slave_stop`: Contagem de declarações de REPLICA de STOP e SLAVE de STOP.

* `disconnect-slave-event-count`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `enforce_gtid_consistency`: Previne a execução de declarações que não podem ser registradas de forma segura em transação.

* `expire_logs_days`: Limpe os registros binários após tantos dias.

* `gtid_executed`: Global: Todos os GTIDs no log binário (global) ou na transação atual (sessão). Apenas leitura.

* `gtid_executed_compression_period`: Compress gtid_executed tabela cada vez que ocorrer esse número de transações. 0 significa nunca comprimir essa tabela. Aplica-se apenas quando o registro binário está desativado.

* `gtid_mode`: Controla se o registro baseado em GTID está habilitado e quais tipos de registros de transações podem conter.

* `gtid_next`: Especifica GTID para transação ou transações subsequentes; consulte a documentação para detalhes.

* `gtid_owned`: Conjunto de GTIDs de propriedade deste cliente (sessão), ou de todos os clientes, juntamente com o ID de thread do proprietário (global). Apenas para leitura.

* `gtid_purged`: Conjunto de todos os GTIDs que foram eliminados do log binário.

* `init_slave`: Declarações que são executadas quando a replica se conecta à fonte.

* `log_bin_trust_function_creators`: Se igual a 0 (padrão), então, quando o --log-bin é usado, a criação de função armazenada é permitida apenas para usuários com privilégio SUPER e apenas se a função criada não quebrar o registro binário.

* `log_builtin_as_identified_by_password`: Se deve registrar CREATE/ALTER USER e GRANT de forma compatível com versões anteriores.

* `log_statements_unsafe_for_binlog`: Desabilita as advertências do erro 1592 que estão sendo escritas no log de erro.

* `master-info-file`: Local e nome do arquivo que lembra a origem e onde o thread de replicação de E/S está no log binário da origem.

* `master-retry-count`: Número de tentativas que a réplica faz para se conectar à fonte antes de desistir.

* `master_info_repository`: Se deve escrever o repositório de metadados de conexão, contendo informações de origem e localização da thread de I/O de replicação no log binário da fonte, em arquivo ou tabela.

* `max_relay_log_size`: Se não for nulo, o log de releio é rotado automaticamente quando seu tamanho excede esse valor. Se for zero, o tamanho em que a rotação ocorre é determinado pelo valor de max_binlog_size.

* `relay_log`: Localização e nome de base a serem utilizados para os registros de retransmissão.

* `relay_log_basename`: Caminho completo para o log de relevo, incluindo o nome do arquivo.

* `relay_log_index`: Local e nome a serem usados para o arquivo que mantém a lista dos últimos logs de releio.

* `relay_log_info_file`: Nome do arquivo para o repositório de metadados do aplicativo, no qual os registros replicam informações sobre os registros de retransmissão.

* `relay_log_info_repository`: Se deve escrever a localização do thread de replicação SQL nos logs do relé em arquivo ou tabela.

* `relay_log_purge`: Determina se os registros de relevo são limpos.

* `relay_log_recovery`: Se a recuperação automática dos arquivos de registro do relé da fonte na inicialização está habilitada; deve ser habilitada para replica segura em caso de falha.

* `relay_log_space_limit`: Espaço máximo a ser utilizado para todos os registros de relé.

* `replicate-do-db`: Diz ao thread de replicação SQL para restringir a replicação ao banco de dados especificado.

* `replicate-do-table`: Diz ao thread de replicação SQL para restringir a replicação à tabela especificada.

* `replicate-ignore-db`: Diz ao thread de replicação SQL que não replique para o banco de dados especificado.

* `replicate-ignore-table`: Diz ao thread de replicação SQL que não replique para a tabela especificada.

* `replicate-rewrite-db`: Atualizações no banco de dados com um nome diferente do original.

* `replicate-same-server-id`: Na replicação, se habilitada, não ignore eventos com nosso ID do servidor.

* `replicate-wild-do-table`: Diz ao thread de replicação SQL que restrinja a replicação às tabelas que correspondem ao padrão de caracteres curinga especificado.

* `replicate-wild-ignore-table`: Diz ao thread de replicação SQL que não replique para tabelas que correspondem ao padrão de caracteres curinga fornecido.

* `replication_optimize_for_static_plugin_config`: Lâminas de compartilhamento para replicação semiesincronizada.

* `replication_sender_observe_commit_only`: Chamadas limitadas para replicação semi-síncrona.

* `report_host`: Nome de host ou IP da réplica a ser relatada à fonte durante o registro da réplica.

* `report_password`: Senha arbitrária que o servidor replicador deve informar à fonte; não é a mesma senha da conta de usuário de replicação.

* `report_port`: Porta para conexão com réplica relatada à fonte durante o registro da réplica.

* `report_user`: Nome de usuário arbitrário ao qual o servidor de replicação deve relatar a fonte; não é o mesmo nome usado para a conta de usuário de replicação.

* `Rpl_semi_sync_master_clients`: Número de réplicas semi-síncronas.

* `rpl_semi_sync_master_enabled`: Se a replicação semi-sincronizada está habilitada na fonte.

* `Rpl_semi_sync_master_net_avg_wait_time`: Tempo médio que a fonte tem aguardado respostas da réplica.

* `Rpl_semi_sync_master_net_wait_time`: O tempo total que a fonte de replicação esperou por respostas.

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

* `rpl_semi_sync_slave_enabled`: Se a replicação semi-sincronizada está habilitada na replica.

* `Rpl_semi_sync_slave_status`: Se a replicação semi-sincronizada está operacional na replica.

* `rpl_semi_sync_slave_trace_level`: Nível de rastreamento de depuração de replicação semiesincronizada no replica.

* `rpl_stop_slave_timeout`: Número de segundos que o STOP REPLICA ou o STOP SLAVE espera antes de expirar o tempo.

* `server_uuid`: ID globalmente único do servidor, automaticamente (re)gerado no início do servidor.

* `show-slave-auth-info`: Mostre o nome do usuário e a senha nas opções de REPLICAS e HOSTS DE ESCLAVA nesta fonte.

* `skip-slave-start`: Se definido, a replicação não é iniciada automaticamente quando o servidor de replicação é iniciado.

* `slave-skip-errors`: Diz ao thread de replicação para continuar a replicação quando a consulta retorna um erro da lista fornecida.

* `slave_checkpoint_group`: Número máximo de transações processadas por replica multithread antes que a operação de verificação de ponto seja chamada para atualizar o status do progresso. Não é suportado pelo NDB Cluster.

* `slave_checkpoint_period`: Atualize o status do progresso da replica multithread e limpe as informações do log do relay para disco após este número de milissegundos. Não é suportado pelo NDB Cluster.

* `slave_compressed_protocol`: Use compressão do protocolo de fonte/replica.

* `slave_exec_mode`: Permite alternar o thread de replicação entre o modo IDEMPOTENT (chave e alguns outros erros suprimidos) e o modo STRICT; o modo STRICT é o padrão, exceto para o NDB Cluster, onde o IDEMPOTENT é sempre usado.

* `Slave_heartbeat_period`: Intervalo de batida de replicação da réplica, em segundos.

* `Slave_last_heartbeat`: Mostra quando o sinal mais recente do batimento cardíaco foi recebido, no formato TIMESTAMP.

* `slave_load_tmpdir`: Local onde a replica deve colocar seus arquivos temporários ao replicar as instruções LOAD DATA.

* `slave_max_allowed_packet`: Tamanho máximo, em bytes, do pacote que pode ser enviado do servidor de origem de replicação para a réplica; substitui max_allowed_packet.

* `slave_net_timeout`: Número de segundos para esperar mais dados da conexão da fonte/replica antes de abortar a leitura.

* `Slave_open_temp_tables`: Número de tabelas temporárias que o thread de replicação do SQL atualmente tem aberto.

* `slave_parallel_type`: Diz ao replica que use informações de marcação de tempo (CLOCK LOGICAL) ou particionamento de banco de dados (DATABASE) para paralelizar as transações.

* `slave_parallel_workers`: Número de threads do aplicativo para executar transações de replicação em paralelo; 0 ou 1 desativa a replicação multithreading. NDB Cluster: consulte a documentação.

* `slave_pending_jobs_size_max`: Tamanho máximo das filas de replicação de trabalhadores que retêm eventos ainda não aplicados.

* `slave_preserve_commit_order`: Garante que todos os commits dos trabalhadores replicados ocorram na mesma ordem que na fonte para manter a consistência ao usar threads de aplicação paralela.

* `Slave_received_heartbeats`: Número de batimentos cardíacos recebidos pela réplica desde o último reajuste.

* `Slave_retried_transactions`: Número total de vezes desde a inicialização em que o thread de replicação SQL refez as transações.

* `Slave_rows_last_search_algorithm_used`: Algoritmo de pesquisa mais recentemente utilizado por esta replica para localizar strings para replicação baseada em string (índice, tabela ou varredura hash).

* `slave_rows_search_algorithms`: Determina os algoritmos de busca utilizados para o agrupamento de lotes de atualização de réplica. Qualquer um dos itens 2 ou 3 desta lista: INDEX_SEARCH, TABLE_SCAN, HASH_SCAN.

* `Slave_running`: Estado deste servidor como replica (status de thread de I/O de replicação).

* `slave_transaction_retries`: Número de vezes que o thread de replicação SQL refaz a transação no caso de ela falhar com bloqueio ou timeout de espera de bloqueio, antes de desistir e parar.

* `slave_type_conversions`: Controla o modo de conversão de tipo na replica. O valor é uma lista de zero ou mais elementos desta lista: ALL_LOSSY, ALL_NON_LOSSY. Defina uma string vazia para não permitir conversões de tipo entre a fonte e a replica.

* `sql_log_bin`: Controla o registro binário para a sessão atual.

* `sql_slave_skip_counter`: Número de eventos da fonte que a replicação deve ignorar. Não é compatível com a replicação GTID.

* `sync_master_info`: Sincronize as informações de origem após cada evento a cada # evento.

* `sync_relay_log`: Sincronizar o registro do relé no disco após cada evento no #.

* `sync_relay_log_info`: Sincronize o arquivo relay.info no disco após cada evento no #.

* `transaction_write_set_extraction`: Define o algoritmo usado para hash os registros extraídos durante a transação.

Para uma lista de todas as opções de string de comando, variáveis de sistema e variáveis de status usadas com `mysqld`, consulte a Seção 5.1.3, “Referência de Opção do Servidor, Variável de Sistema e Variável de Status”.

##### Opções e variáveis de registro binário

As opções de string de comando e as variáveis do sistema na lista a seguir se relacionam ao log binário. A Seção 16.1.6.4, “Opções e variáveis de registro binário”, fornece informações mais detalhadas sobre as opções e variáveis relacionadas ao registro binário. Para informações gerais adicionais sobre o log binário, consulte a Seção 5.4.4, “O log binário”.

* `binlog-checksum`: Habilitar ou desabilitar verificações de checksums de registro binário.

* `binlog-do-db`: Limita o registro binário a bancos de dados específicos.

* `binlog-ignore-db`: Informe à fonte que as atualizações no banco de dados fornecido não devem ser escritas no log binário.

* `binlog-row-event-max-size`: Tamanho máximo do evento de registro binário.

* `Binlog_cache_disk_use`: Número de transações que utilizaram arquivo temporário em vez de cache de registro binário.

* `binlog_cache_size`: Tamanho do cache para armazenar declarações SQL para o log binário durante a transação.

* `Binlog_cache_use`: Número de transações que utilizaram cache temporário de registro binário.

* `binlog_checksum`: Habilitar ou desabilitar verificações de checksums de registro binário.

* `binlog_direct_non_transactional_updates`: As atualizações das causas que utilizam o formato de declaração para motores não transacionais são escritas diretamente no log binário. Consulte a documentação antes de usar.

* `binlog_error_action`: Controla o que acontece quando o servidor não consegue gravar no log binário.

* `binlog_format`: Especifica o formato do log binário.

* `binlog_group_commit_sync_delay`: Define o número de microsegundos para esperar antes de sincronizar as transações no disco.

* `binlog_group_commit_sync_no_delay_count`: Define o número máximo de transações a serem esperadas antes de abortar o atraso atual especificado por binlog_group_commit_sync_delay.

* `binlog_gtid_simple_recovery`: Controla como os registros binários são iterados durante a recuperação do GTID.

* `binlog_max_flush_queue_time`: Quanto tempo deve-se ler as transações antes de serem descarregadas para o log binário.

* `binlog_order_commits`: Se deve comprometer na mesma ordem que as escritas no log binário.

* `binlog_row_image`: Use imagens completas ou mínimas ao registrar mudanças de string.

* `binlog_rows_query_log_events`: Quando ativado, habilita o registro de eventos de log de consulta de strings quando o registro é baseado em strings. Desativado por padrão.

* `Binlog_stmt_cache_disk_use`: Número de declarações não transacionais que utilizaram arquivo temporário em vez de cache de declaração de registro binário.

* `binlog_stmt_cache_size`: Tamanho do cache para armazenar declarações não transacionais para o log binário durante a transação.

* `Binlog_stmt_cache_use`: Número de declarações que utilizaram cache temporário de declaração de log binário.

* `binlog_transaction_dependency_history_size`: Número de hashes de string mantidos para procurar transações que foram atualizadas recentemente em alguma string.

* `binlog_transaction_dependency_tracking`: Fonte de informações sobre a dependência (marcadores de commit ou conjuntos de escrita de transação) a partir da qual se pode avaliar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica.

* `Com_show_binlog_events`: Contagem de declarações de SHOW BINLOG EVENTS.

* `Com_show_binlogs`: Contagem de declarações de SHOW BINLOGS.

* `log-bin`: Nome base para arquivos de log binários.

* `log-bin-index`: Nome do arquivo de índice de log binário.

* `log_bin`: Se o registro binário está habilitado.

* `log_bin_basename`: Caminho e nome de base para arquivos de log binários.

* `log_bin_use_v1_row_events`: Se o servidor está usando eventos de string de registro binário da versão 1.

* `log_slave_updates`: Se a replica deve registrar as atualizações realizadas pelo seu próprio thread de replicação SQL no seu próprio log binário.

* `master_verify_checksum`: Faça com que a fonte da causa examine os checksums ao ler do log binário.

* `max-binlog-dump-events`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `max_binlog_cache_size`: Pode ser usado para restringir o tamanho total em bytes utilizados para o cache de transações de múltiplos comandos.

* `max_binlog_size`: O log binário é rotado automaticamente quando o tamanho excede este valor.

* `max_binlog_stmt_cache_size`: Pode ser usado para restringir o tamanho total usado para cachear todas as declarações não transacionais durante a transação.

* `slave-sql-verify-checksum`: Faça com que a replica examine os checksums ao ler do log do relé.

* `slave_sql_verify_checksum`: Faça com que a replica examine os checksums ao ler do log do relé.

* `sporadic-binlog-dump-fail`: Opção usada pelo mysql-test para depuração e teste de replicação.

* `sync_binlog`: Limpe o log binário de forma síncrona no disco após cada evento do #º evento.

Para uma lista de todas as opções de string de comando, variáveis de sistema e de status usadas com `mysqld`, consulte a Seção 5.1.3, “Referência de variáveis de opção do servidor, variáveis de sistema e variáveis de status”.

#### 16.1.6.2 Opções e variáveis de fonte de replicação

Esta seção descreve as opções do servidor e as variáveis do sistema que você pode usar nos servidores de origem de replicação. Você pode especificar as opções na string de comando ou em um arquivo de opções. Você pode especificar os valores das variáveis do sistema usando `SET`.

Na fonte e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único. Para cada servidor, você deve escolher um número inteiro positivo único na faixa de 1 a 232 − 1, e cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo: `server-id=3`.

Para opções usadas na fonte para controlar o registro binário, consulte a Seção 16.1.6.4, “Opções e variáveis de registro binário”.

Opções de inicialização para servidores de origem de replicação

A lista a seguir descreve as opções de inicialização para o controle de servidores de origem de replicação. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

* `--show-slave-auth-info`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Exibir nomes de usuários e senhas replicadas na saída do `SHOW SLAVE HOSTS` no servidor de origem para réplicas iniciadas com as opções `--report-user` e `--report-password`.

##### Variáveis do sistema usadas nos servidores de origem de replicação

As seguintes variáveis do sistema são usadas para controlar as fontes:

* `auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

`auto_increment_increment` e `auto_increment_offset` são destinados para uso com replicação fonte a fonte e podem ser usados para controlar o funcionamento das colunas `AUTO_INCREMENT`. Ambas as variáveis têm valores globais e de sessão, e cada uma pode assumir um valor inteiro entre 1 e 65.535, inclusive. Definir o valor de qualquer uma dessas duas variáveis para 0 faz com que seu valor seja definido como 1 em vez disso. Tentar definir o valor de qualquer uma dessas duas variáveis para um valor inteiro maior que 65.535 ou menor que 0 faz com que seu valor seja definido como 65.535 em vez disso. Tentar definir o valor de `auto_increment_increment` ou `auto_increment_offset` para um valor não inteiro produz um erro, e o valor real da variável permanece inalterado.

Nota

`auto_increment_increment` também é compatível para uso com as tabelas `NDB`.

Quando a Replicação em Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é interrompida. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` têm, cada um, seu valor padrão de 1. Se seus valores já tiverem sido modificados a partir do padrão, a Replicação em Grupo não os altera.

`auto_increment_increment` e `auto_increment_offset` afetam o comportamento da coluna `AUTO_INCREMENT` da seguinte forma:

+ `auto_increment_increment` controla o intervalo entre os valores sucessivos das colunas. Por exemplo:

    ```sql
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

    ```sql
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

Se alguma dessas variáveis for alterada e, em seguida, novas strings forem inseridas em uma tabela que contenha uma coluna `AUTO_INCREMENT`, os resultados podem parecer contra-intuitivos, porque a série de valores `AUTO_INCREMENT` é calculada sem considerar quaisquer valores já presentes na coluna, e o próximo valor inserido é o menor valor da série que é maior que o valor máximo existente na coluna `AUTO_INCREMENT`. A série é calculada da seguinte forma:

`auto_increment_offset` + *`N`* × `auto_increment_increment`

onde *`N`* é um valor inteiro positivo na série [1, 2, 3, ...]. Por exemplo:

  ```sql
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

Não é possível restringir os efeitos dessas duas variáveis a uma única tabela; essas variáveis controlam o comportamento de todas as colunas do `AUTO_INCREMENT` em *todas* as tabelas no servidor MySQL. Se o valor global de qualquer uma dessas variáveis for definido, seus efeitos persistem até que o valor global seja alterado ou substituído pela definição do valor da sessão, ou até que o `mysqld` seja reiniciado. Se o valor local for definido, o novo valor afeta as colunas do `AUTO_INCREMENT` para todas as tabelas nas quais novas strings são inseridas pelo usuário atual durante a duração da sessão, a menos que os valores sejam alterados durante essa sessão.

O valor padrão de `auto_increment_increment` é

1. Veja a Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”.

* `auto_increment_offset`

  <table frame="box" rules="all" summary="Properties for auto_increment_offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_offset</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

Essa variável tem um valor padrão de 1. Se ela for deixada com seu valor padrão e a Replicação por Grupo for iniciada no servidor, ela será alterada para o ID do servidor. Para mais informações, consulte a descrição para `auto_increment_increment`.

Nota

`auto_increment_offset` também é compatível para uso com as tabelas `NDB`.

* `rpl_semi_sync_master_enabled`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Controla se a replicação semisíncrona está habilitada na fonte. Para habilitar ou desabilitar o plugin, defina essa variável em `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_timeout`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

Um valor em milissegundos que controla o tempo que a fonte espera um reconhecimento de uma réplica antes de expirar o prazo e retornar à replicação assíncrona. O valor padrão é 10000 (10 segundos).

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_trace_level`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_trace_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_trace_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

O nível de rastreamento de depuração da replicação semiesincrona na fonte. Quatro níveis são definidos:

+ 1 = nível geral (por exemplo, falhas na função de tempo)  
  + 16 = nível de detalhe (informações mais verbais)  
  + 32 = nível de espera líquida (mais informações sobre as esperas de rede)

+ 64 = nível de função (informações sobre a entrada e saída da função)

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_for_slave_count`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_for_slave_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_for_slave_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

O número de confirmações de replica que a fonte deve receber por transação antes de prosseguir. Por padrão, `rpl_semi_sync_master_wait_for_slave_count` é `1`, o que significa que a replicação semiesincrônica prossegue após receber uma única confirmação de replica. O desempenho é melhor para valores pequenos desta variável.

Por exemplo, se `rpl_semi_sync_master_wait_for_slave_count` é `2`, então 2 réplicas devem reconhecer a recepção da transação antes do período de tempo configurado por `rpl_semi_sync_master_timeout` para que a replicação semiesincronizada possa prosseguir. Se menos réplicas reconhecerem a recepção da transação durante o período de tempo, a fonte retorna à replicação normal.

Nota

Esse comportamento também depende de `rpl_semi_sync_master_wait_no_slave`

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_no_slave`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_no_slave"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-no-slave[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_no_slave</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Controla se a fonte espera que o período de tempo de espera configurado por `rpl_semi_sync_master_timeout` expire, mesmo que o número de réplicas caia para menos do que o número de réplicas configurado por `rpl_semi_sync_master_wait_for_slave_count` durante o período de espera.

Quando o valor de `rpl_semi_sync_master_wait_no_slave` é `ON` (o padrão), é permitido que o número de réplicas caia para menos de `rpl_semi_sync_master_wait_for_slave_count` durante o período de tempo limite. Desde que o número suficiente de réplicas reconheça a transação antes da expiração do período de tempo limite, a replicação semi-sincronizada continua.

Quando o valor de `rpl_semi_sync_master_wait_no_slave` for `OFF`, se o número de réplicas cair para menos do que o número configurado em `rpl_semi_sync_master_wait_for_slave_count` em qualquer momento durante o período de tempo de espera configurado por `rpl_semi_sync_master_timeout`, a fonte retorna à replicação normal.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `rpl_semi_sync_master_wait_point`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_point"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-point=value</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_point</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AFTER_SYNC</code></td> </tr><tr><th>Valid Values</th> <td><code>AFTER_SYNC</code><code>AFTER_COMMIT</code></td> </tr></tbody></table>

Essa variável controla o ponto em que uma fonte semisíncrona espera o reconhecimento da replicação da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

+ `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera o reconhecimento da replicação da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

+ `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte espera o reconhecimento da replica sobre a recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

+ Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo: Depois de ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha na fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvo no seu log de relevo). Uma saída inesperada da fonte e a transição para a replica são sem perdas, pois a replica está atualizada. No entanto, observe que a fonte não pode ser reiniciada neste cenário e deve ser descartada, pois seu log binário pode conter transações não comprometidas que causariam um conflito com a replica quando externalizadas após a recuperação do log binário.

+ Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor se comprometer com o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que a comprometeu.

Se algo der errado de tal forma que a réplica não processe a transação, então, em caso de saída inesperada da fonte e failover para a réplica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na fonte.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

`rpl_semi_sync_master_wait_point` foi adicionado no MySQL 5.7.2. Para versões mais antigas, o comportamento de fonte semi-sincronizada é equivalente a uma configuração de `AFTER_COMMIT`.

Essa mudança introduz uma restrição de compatibilidade de versão porque incrementa a versão da interface semiesincronia: Servidores para MySQL 5.7.2 e versões posteriores não funcionam com plugins de replicação semiesincronia de versões anteriores, e servidores de versões anteriores também não funcionam com plugins de replicação semiesincronia para MySQL 5.7.2 e versões posteriores.

#### 16.1.6.3 Opções e variáveis do servidor de replicação

Esta seção explica as opções do servidor e as variáveis do sistema que se aplicam aos replicas e contém o seguinte:

* Opções de inicialização para réplicas
* Opções para registrar o status da réplica em tabelas
* Variáveis do sistema usadas em réplicas

Especifique as opções na string de comando ou em um arquivo de opções. Muitas das opções podem ser definidas enquanto o servidor está em execução, usando a declaração `CHANGE MASTER TO`. Especifique os valores das variáveis do sistema usando `SET`.

**ID do servidor.** No ponto de origem e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```sql
[mysqld]
server-id=3
```

Opções de inicialização para réplicas

Esta seção explica as opções de inicialização para o controle de servidores replicados. Muitas dessas opções podem ser definidas enquanto o servidor está em execução, usando a declaração `CHANGE MASTER TO`. Outras, como as opções `--replicate-*`, só podem ser definidas quando o servidor replicado é iniciado. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

* `--log-warnings[=level]`

  <table frame="box" rules="all" summary="Properties for log-warnings"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-warnings[=#]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>log_warnings</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>

Nota

A variável de sistema `log_error_verbosity` é preferida e deve ser usada em vez da opção `--log-warnings` ou da variável de sistema `log_warnings`. Para mais informações, consulte as descrições de `log_error_verbosity` e `log_warnings`. A opção de string de comando `--log-warnings` e a variável de sistema `log_warnings` são desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL.

Faz com que o servidor registre mais mensagens no log de erro sobre o que está fazendo. Em relação à replicação, o servidor gera avisos de que conseguiu reconectar após uma falha de rede ou conexão, e fornece informações sobre como cada thread de replicação foi iniciado. Esta variável é definida como 2 por padrão. Para desabilitar, defina-a como 0. O servidor registra mensagens sobre declarações que são inseguras para o registro baseado em declarações se o valor for maior que 0. Conexões aborridas e erros de negação de acesso para novas tentativas de conexão são registrados se o valor for maior que

1. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

Nota

Os efeitos desta opção não se limitam à replicação. Ela afeta as mensagens de diagnóstico em um espectro de atividades do servidor.

* `--master-info-file=file_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>

O nome a ser usado para o arquivo no qual os registros da replica informam sobre a fonte. O nome padrão é `master.info` no diretório de dados. Para informações sobre o formato desse arquivo, consulte a Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

* `--master-retry-count=count`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>

O número de vezes que a réplica tenta se reconectar à fonte antes de desistir. O valor padrão é de 86400 vezes. Um valor de 0 significa “infinito”, e a réplica tenta se conectar para sempre. As tentativas de reconexão são acionadas quando a réplica atinge seu tempo limite de conexão (especificado pela variável de sistema `slave_net_timeout`) sem receber dados ou um sinal de batida de coração da fonte. A reconexão é tentada em intervalos definidos pela opção `MASTER_CONNECT_RETRY` da declaração `CHANGE MASTER TO` (que tem como padrão a cada 60 segundos).

Essa opção é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a opção `MASTER_RETRY_COUNT` da declaração `CHANGE MASTER TO` em vez disso.

* `--max-relay-log-size=size`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

O tamanho pelo qual o servidor roda os arquivos de registro do relé automaticamente. Se esse valor não for nulo, o registro do relé é rotado automaticamente quando seu tamanho excede esse valor. Se esse valor for zero (o padrão), o tamanho pelo qual a rotação do registro do relé ocorre é determinado pelo valor de [[`max_binlog_size`]. Para mais informações, consulte a Seção 16.2.4.1, “O Registro do Relé”.

* `--relay-log-purge={0|1}`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Desative ou ative a limpeza automática dos registros do relé assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. A desativação da limpeza dos registros do relé quando a opção `--relay-log-recovery` é ativada coloca a consistência dos dados em risco.

* `--relay-log-space-limit=size`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Esta opção estabelece um limite superior para o tamanho total em bytes de todos os registros de relé na replica. Um valor de 0 significa “sem limite”. Isso é útil para um servidor de replica que tem espaço em disco limitado. Quando o limite é atingido, o thread de I/O de replicação para de ler eventos de log binário da fonte até que o thread de SQL de replicação tenha atualizado e excluído alguns logs de relé não utilizados. Observe que esse limite não é absoluto: Há casos em que o thread de SQL precisa de mais eventos antes de poder excluir logs de relé. Nesse caso, o thread de I/O excede o limite até que seja possível para o thread de SQL excluir alguns logs de relé, pois não fazer isso causaria um impasse. Você não deve definir `--relay-log-space-limit` para menos que o dobro do valor de `--max-relay-log-size` (ou `--max-binlog-size` se `--max-relay-log-size` for 0). Nesse caso, há uma chance de que o thread de I/O espere espaço livre porque `--relay-log-space-limit` é excedido, mas o thread de SQL não tem nenhum log de relé para purgar e é incapaz de satisfazer o thread de I/O. Isso obriga o thread de I/O a ignorar `--relay-log-space-limit` temporariamente.

* `--replicate-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_DO_DB`. O efeito preciso desse filtro depende se a replicação baseada em declaração ou baseada em string está sendo usada, e isso é descrito nos próximos parágrafos.

Importante

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

**Replicação baseada em declarações.** Diga ao thread de replicação SQL para restringir a replicação a declarações onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* replica declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

Aviso

Para especificar múltiplos bancos de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista é tratada como o nome de um único banco de dados.

Um exemplo do que não funciona conforme o esperado ao usar a replicação baseada em declarações: Se a replica for iniciada com `--replicate-do-db=sales` e você emitir as seguintes declarações na fonte, a declaração `UPDATE` *não* será replicada:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão para esse comportamento de "verifique apenas o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando declarações `DELETE` de várias tabelas ou declarações `UPDATE` de várias tabelas que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

**Replicação baseada em strings.** Diz ao thread SQL de replicação que restrinja a replicação ao banco de dados *`db_name`*. Somente as tabelas pertencentes a *`db_name`* são alteradas; o banco de dados atual não tem efeito sobre isso. Suponha que a replicação seja iniciada com `--replicate-do-db=sales` e a replicação baseada em strings esteja em vigor, e então as seguintes instruções são executadas na fonte:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

A tabela `february` no banco de dados `sales` na replica é alterada de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, emitir as seguintes declarações na fonte não tem efeito na replica quando se usa replicação baseada em string e `--replicate-do-db=sales`:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam replicados.

Outra diferença importante na forma como o `--replicate-do-db` é tratado na replicação baseada em declarações, em oposição à replicação baseada em strings, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que a replicação seja iniciada com `--replicate-do-db=db1`, e as seguintes declarações sejam executadas na fonte:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Se você estiver usando replicação baseada em declarações, então ambas as tabelas são atualizadas na replica. No entanto, ao usar replicação baseada em strings, apenas `table1` é afetado na replica; uma vez que `table2` está em um banco de dados diferente, `table2` na replica não é alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Neste caso, a declaração `UPDATE` não teria efeito na réplica ao usar replicação baseada em declaração. No entanto, se você estiver usando replicação baseada em string, a declaração `UPDATE` mudaria `table1` na réplica, mas não `table2` — em outras palavras, apenas as tabelas no banco de dados nomeado por `--replicate-do-db` são alteradas, e a escolha do banco de dados padrão não tem efeito sobre esse comportamento.

Se você precisa que as atualizações entre bancos de dados funcionem, use `--replicate-wild-do-table=db_name.%` em vez disso. Veja a Seção 16.2.5, “Como os servidores avaliam os filtros de replicação”.

Nota

Essa opção afeta a replicação da mesma maneira que `--binlog-do-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-do-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de `--binlog-do-db`.

Esta opção não afeta as declarações `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação usando o nome de um banco de dados. Têm também sido criados filtros utilizando `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`. Tal como com `--replicate-do-db`, o efeito preciso deste filtragem depende se a replicação baseada em declarações ou baseada em strings está em uso, e são descritos nos próximos parágrafos.

Importante

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

**Replicação baseada em declarações.** Diz ao thread de replicação SQL que não replique nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

**Replicação baseada em string.** Diz ao thread de SQL de replicação que não deve atualizar nenhuma tabela no banco de dados *`db_name`*. O banco de dados padrão não tem efeito.

Ao usar a replicação baseada em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que a replicação seja iniciada com `--replicate-ignore-db=sales` e você emita as seguintes declarações na fonte:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* replicada em tal caso porque a declaração `--replicate-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar replicação baseada em string, os efeitos da declaração `UPDATE` *não* são propagados para a réplica, e a cópia da tabela `sales.january` da réplica permanece inalterada; nessa instância, `--replicate-ignore-db=sales` faz com que *todas as* alterações feitas nas tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas pela réplica.

Para especificar mais de um banco de dados a ser ignorado, use esta opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista é tratada como o nome de um único banco de dados.

Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam replicadas. Veja a Seção 16.2.5, “Como os servidores avaliam os filtros de replicação”.

Se você precisa que as atualizações entre bancos de dados funcionem, use `--replicate-wild-ignore-table=db_name.%` em vez disso. Veja a Seção 16.2.5, “Como os servidores avaliam os filtros de replicação”.

Nota

Essa opção afeta a replicação da mesma maneira que `--binlog-ignore-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-ignore-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de `--binlog-ignore-db`.

Esta opção não afeta as declarações `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação, dizendo ao thread SQL de replicação para restringir a replicação a uma determinada tabela. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona tanto para atualizações entre bancos de dados quanto para atualizações de banco de dados padrão, em contraste com `--replicate-do-db`. Veja a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`.

Importante

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Cria um filtro de replicação, dizendo ao thread SQL de replicação que não replique qualquer declaração que atualize a tabela especificada, mesmo que outras tabelas possam ser atualizadas pela mesma declaração. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos, em contraste com `--replicate-ignore-db`. Veja a Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`.

Nota

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-rewrite-db=from_name->to_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>0

Diz à replica que crie um filtro de replicação que traduza o banco de dados especificado para *`to_name`* se ele fosse *`from_name`* na fonte. Apenas as declarações que envolvem tabelas são afetadas, não declarações como `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`.

Para especificar múltiplos reescritos, use esta opção várias vezes. O servidor usa a primeira com um valor *`from_name`* que corresponda. A tradução do nome do banco de dados é feita *antes* das regras do `--replicate-*` serem testadas. Você também pode criar um filtro desse tipo emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`.

Se você usar a opção `--replicate-rewrite-db` na string de comando e o caractere `>` é especial para o interpretador de comandos, cite o valor da opção. Por exemplo:

  ```sql
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

O efeito da opção `--replicate-rewrite-db` difere dependendo se o formato de registro binário baseado em declaração ou baseado em string é usado para a consulta. Com o formato baseado em declaração, as declarações DML são traduzidas com base no banco de dados atual, conforme especificado pela declaração `USE`. Com o formato baseado em string, as declarações DML são traduzidas com base no banco de dados onde a tabela modificada existe. As declarações DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela declaração `USE`, independentemente do formato de registro binário.

Para garantir que a reescrita produza os resultados esperados, especialmente em combinação com outras opções de filtragem de replicação, siga essas recomendações ao usar a opção `--replicate-rewrite-db`:

+ Crie os bancos de dados *`from_name`* e *`to_name`* manualmente na fonte e na replica com nomes diferentes.

+ Se você usar o formato de registro binário baseado em declaração ou misto, não use consultas entre bancos de dados e não especifique nomes de banco de dados nas consultas. Para declarações DDL e DML, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela nas consultas.

+ Se você usa o formato de registro binário baseado em string exclusivamente, para declarações DDL, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela em consultas. Para declarações DML, você pode usar um nome de tabela totalmente qualificado (*`db`*.*`table`*) se desejar.

Se essas recomendações forem seguidas, é seguro usar a opção `--replicate-rewrite-db` em combinação com opções de filtragem de replicação em nível de tabela, como `--replicate-do-table`.

Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

* `--replicate-same-server-id`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>1

Para ser usado em servidores replicados. Geralmente, você deve usar a configuração padrão de 0, para evitar laços infinitos causados pela replicação circular. Se definido como 1, a replica não pula eventos que têm seu próprio ID de servidor. Normalmente, isso é útil apenas em configurações raras. Não pode ser definido como 1 se `log_slave_updates` estiver habilitado. Por padrão, o thread de I/O de replicação não escreve eventos de log binário no log de releio se eles tiverem o ID de servidor da replica (esta otimização ajuda a economizar o uso do disco). Se você deseja usar `--replicate-same-server-id`, certifique-se de iniciar a replica com essa opção antes de fazer a replica ler seus próprios eventos que você deseja que o thread de SQL de replicação execute.

* `--replicate-wild-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>2

Cria um filtro de replicação, dizendo ao thread SQL de replicação para restringir a replicação a declarações onde qualquer uma das tabelas atualizadas correspondem aos padrões especificados de nome de banco de dados e tabela. Os padrões podem conter os caracteres de comodinho `%` e `_`, que têm o mesmo significado que o operador de correspondência de padrões `LIKE`. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações cruzadas. Veja a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`.

Nota

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

Esta opção se aplica a tabelas, visualizações e gatilhos. Não se aplica a procedimentos e funções armazenadas ou eventos. Para filtrar declarações que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

Como exemplo, `--replicate-wild-do-table=foo%.bar%` replica apenas as atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

Se o padrão do nome da tabela for `%`, ele corresponde a qualquer nome de tabela e a opção também se aplica a declarações de nível de banco de dados (`CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`). Por exemplo, se você usar `--replicate-wild-do-table=foo%.%`, declarações de nível de banco de dados são replicadas se o nome do banco de dados corresponder ao padrão `foo%`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de comodínio.

Para incluir caracteres curinga literais nos padrões de nomes de banco de dados ou tabela, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um banco de dados que é denominado `my_own%db`, mas não replicar tabelas do banco de dados `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` assim: `--replicate-wild-do-table=my_own\%db`. Se você usar a opção na string de comando, você pode precisar duplicar as barras invertidas ou citar o valor da opção, dependendo do seu interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar `--replicate-wild-do-table=my\_own\\%db`.

* `--replicate-wild-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>3

Cria um filtro de replicação que impede que o thread SQL de replicação replique uma declaração em que qualquer tabela corresponda ao padrão de caracteres curinga fornecido. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos. Veja a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`.

Importante

Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

Como exemplo, `--replicate-wild-ignore-table=foo%.bar%` não replica atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

Para informações sobre como o correspondência funciona, consulte a descrição da opção `--replicate-wild-do-table`. As regras para incluir caracteres curinga literais no valor da opção são as mesmas que para `--replicate-wild-ignore-table`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de comodínio.

Se você precisar filtrar declarações `GRANT` ou outras declarações administrativas, uma solução possível é usar o filtro `--replicate-ignore-db`. Esse filtro opera no banco de dados padrão que está atualmente em vigor, conforme determinado pela declaração `USE`. Portanto, você pode criar um filtro para ignorar declarações para um banco de dados que não está replicado, em seguida, emitir a declaração `USE` para alternar o banco de dados padrão para aquele imediatamente antes de emitir quaisquer declarações administrativas que você deseja ignorar. Na declaração administrativa, nomeie o banco de dados real onde a declaração é aplicada.

Por exemplo, se `--replicate-ignore-db=nonreplicated` estiver configurado no servidor de replicação, a seguinte sequência de declarações faz com que a declaração `GRANT` seja ignorada, porque o banco de dados padrão `nonreplicated` está em vigor:

  ```sql
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* `--skip-slave-start`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>4

Diz ao servidor de replicação que não inicie os threads de replicação quando o servidor for iniciado. Para iniciar os threads mais tarde, use uma declaração `START SLAVE`.

* `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>5

Normalmente, a replicação para de quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta opção faz com que o thread de replicação SQL continue a replicação quando uma declaração retorna qualquer um dos erros listados no valor da opção.

Não use esta opção a menos que você entenda completamente por que está recebendo erros. Se não houver erros em sua configuração de replicação e em programas de cliente, e nenhum erro no próprio MySQL, um erro que interrompa a replicação nunca deve ocorrer. O uso indiscriminado desta opção resulta em réplicas ficando desesperadamente fora de sincronia com a fonte, sem você ter ideia do porquê isso ocorreu.

Para códigos de erro, você deve usar os números fornecidos pela mensagem de erro no log de erro da réplica e na saída de `SHOW SLAVE STATUS`. O Apêndice B, *Mensagens de erro e problemas comuns*, lista os códigos de erro do servidor.

O valor abreviado `ddl_exist_errors` é equivalente à lista de códigos de erro `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

Você também pode (mas não deve) usar o valor muito não recomendado de `all` para fazer com que a replica ignore todas as mensagens de erro e continue indo, independentemente do que acontece. Desnecessário dizer que, se você usar `all`, não há garantias quanto à integridade dos seus dados. Por favor, não se queixe (ou faça relatórios de bugs) neste caso, se os dados da replica não estiverem nem perto do que estão na fonte. *Você foi avisado*.

Essa opção não funciona da mesma maneira ao replicar entre NDB Clusters, devido ao mecanismo interno `NDB` para verificar os números de sequência de época; assim que o `NDB` detecta um número de época que está ausente ou fora de sequência, ele imediatamente para o thread do aplicável de réplica.

Exemplos:

  ```sql
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* `--slave-sql-verify-checksum={0|1}`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>6

Quando essa opção estiver habilitada, a replica examinará os checksums lidos do log do relé. No caso de uma discrepância, a replica parará com um erro.

As seguintes opções são usadas internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Elas não são destinadas ao uso em um ambiente de produção.

* `--abort-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>7

Quando esta opção é definida para um número inteiro positivo *`value`* diferente de 0 (padrão), ela afeta o comportamento da replicação da seguinte forma: Após o início do thread de SQL de replicação, os eventos de log *`value`* são permitidos para serem executados; após isso, o thread de SQL de replicação não recebe mais eventos, assim como se a conexão de rede da fonte fosse cortada. O thread de SQL de replicação continua a ser executado, e a saída de `SHOW SLAVE STATUS` exibe `Yes` nas colunas `Slave_IO_Running` e `Slave_SQL_Running`, mas não são lidos mais eventos do log de relé.

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção.

* `--disconnect-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>8

Esta opção é usada internamente pelo conjunto de testes de MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção.

##### Opções para registrar o status da replicação em tabelas

O MySQL 5.7 suporta o registro de metadados de replicação em tabelas, em vez de em arquivos. A escrita do repositório de metadados de conexão da replica e do repositório de metadados do aplicável pode ser configurada separadamente usando essas duas variáveis do sistema:

* `master_info_repository`
* `relay_log_info_repository`

Para obter informações sobre essas variáveis, consulte a Seção 16.1.6.3, “Opções e variáveis do servidor de replicação”.

Essas variáveis podem ser usadas para tornar uma replica resistente a interrupções inesperadas. Consulte a Seção 16.3.2, “Tratamento de uma interrupção inesperada de uma replica”, para obter mais informações.

As tabelas do log de informações e seus conteúdos são considerados locais para um servidor MySQL específico. Elas não são replicadas, e as alterações nelas não são escritas no log binário.

Para mais informações, consulte a Seção 16.2.4, “Repositórios de metadados do log de relé e de replicação”.

##### Variáveis do sistema usadas em réplicas

A lista a seguir descreve as variáveis do sistema para o controle de servidores replicados. Elas podem ser definidas na inicialização do servidor e algumas delas podem ser alteradas em tempo real usando `SET`. As opções do servidor usadas com replicados estão listadas anteriormente nesta seção.

* `init_slave`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>9

Essa variável é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replica cada vez que o thread de replicação SQL é iniciado. O formato da string é o mesmo que para a variável `init_connect`. A definição dessa variável tem efeito para as declarações subsequentes de `START SLAVE`.

Nota

O thread de replicação SQL envia um reconhecimento ao cliente antes de executar `init_slave`. Portanto, não é garantido que `init_slave` tenha sido executado quando `START SLAVE` retorna. Consulte a Seção 13.4.2.5, “Instrução START SLAVE”, para obter mais informações.

* `log_slow_slave_statements`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Quando o registro de consultas lentas é habilitado, essa variável habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Note que, se a replicação baseada em strings estiver em uso (`binlog_format=ROW`), `log_slow_slave_statements` não tem efeito. As consultas são adicionadas apenas ao registro de consultas lentas da replica quando são registradas em formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada em formato de declaração. As consultas lentas que são registradas em formato de string quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_slave_statements` esteja habilitado.

A definição de `log_slow_slave_statements` não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START SLAVE`. Além disso, observe que o ajuste global para `long_query_time` se aplica durante a vida útil do thread de replicação SQL. Se você alterar essa definição, deve parar e reiniciar o thread de replicação SQL para implementar a mudança (por exemplo, emitindo as declarações `STOP SLAVE` e `START SLAVE` com a opção `SQL_THREAD`).

* `master_info_repository`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>1

A definição desta variável determina se os registros de metadados da replica sobre a fonte, consistindo em status e informações de conexão, são armazenados em uma tabela `InnoDB` no banco de dados do sistema `mysql`, ou como um arquivo no diretório de dados. Para mais informações sobre o repositório de metadados de registro de conexão, consulte a Seção 16.2.4, “Repositórios de Metadados de Registro de Relógio e Replicação”.

A configuração padrão é `FILE`. Como um arquivo, o repositório de metadados de conexão do replica é chamado `master.info` por padrão. Você pode alterar esse nome usando a opção `--master-info-file`.

O ambiente alternativo é `TABLE`. Como uma tabela `InnoDB`, o repositório de metadados de conexão do replica é denominado `mysql.slave_master_info`. O ajuste `TABLE` é necessário quando vários canais de replicação são configurados.

Essa variável deve ser definida como `TABLE` antes de configurar vários canais de replicação. Se você estiver usando vários canais de replicação, não pode definir o valor de volta para `FILE`.

O ambiente para a localização do repositório de metadados de conexão tem uma influência direta no efeito causado pela configuração da variável de sistema [[`sync_master_info`]. Você pode alterar a configuração apenas quando nenhum thread de replicação está sendo executado.

* `max_relay_log_size`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Se uma escrita por uma réplica em seu log de retransmissão causar o tamanho atual do arquivo de registro a exceder o valor desta variável, a réplica rotaciona os logs de retransmissão (fecha o arquivo atual e abre o próximo). Se `max_relay_log_size` é 0, o servidor usa `max_binlog_size` tanto para o log binário quanto para o log de retransmissão. Se `max_relay_log_size` é maior que 0, ele restringe o tamanho do log de retransmissão, o que permite que você tenha tamanhos diferentes para os dois logs. Você deve definir `max_relay_log_size` entre 4096 bytes e 1GB (inclusivo), ou para 0. O valor padrão é 0. Veja a Seção 16.2.3, “Eixos de Replicação”.

* `relay_log`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>3

O nome de base para os arquivos de registro do relé. Para o canal de replicação padrão, o nome de base padrão para os registros do relé é `host_name-relay-bin`. Para canais de replicação não padrão, o nome de base padrão para os registros do relé é `host_name-relay-bin-channel`, onde *`channel`* é o nome do canal de replicação registrado neste registro do relé.

O servidor escreve o arquivo no diretório de dados, a menos que o nome de base seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. O servidor cria arquivos de registro de retransmissão em sequência, adicionando um sufixo numérico ao nome de base.

Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; o nome de base padrão é usado apenas se a opção não for especificada na verdade. Se você especificar a variável de sistema `relay_log` na inicialização do servidor sem especificar um valor, é provável que ocorra comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se elas são especificadas na string de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 4.2.2, “Especificando opções de programa”.

Se você especificar essa variável, o valor especificado também será usado como o nome base do arquivo de índice do log do relé. Você pode sobrepor esse comportamento especificando um nome de base diferente para o arquivo de índice do log do relé usando a variável de sistema `relay_log_index`.

Quando o servidor lê uma entrada do arquivo de índice, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a variável de sistema `relay_log`. Um caminho absoluto permanece inalterado; nesse caso, o índice deve ser editado manualmente para permitir que o novo caminho ou caminhos sejam utilizados.

Você pode achar útil a variável de sistema `relay_log` para realizar as seguintes tarefas:

+ Criar logs de relé cujos nomes sejam independentes dos nomes dos hosts.

+ Se você precisa colocar os registros do relé em uma área diferente do diretório de dados, porque seus registros do relé tendem a ser muito grandes e você não quer diminuir `max_relay_log_size`.

+ Para aumentar a velocidade usando o balanceamento de carga entre discos.

Você pode obter o nome (e o caminho) do arquivo de registro do relé a partir da variável de sistema `relay_log_basename`.

* `relay_log_basename`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>4

Contém o nome de base e o caminho completo do arquivo de registro do relé. O comprimento máximo da variável é de 256. Esta variável é definida pelo servidor e é somente leitura.

* `relay_log_index`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>5

O nome do arquivo de índice do registro de relé. O comprimento máximo é de 256 caracteres. Para o canal de replicação padrão, o nome padrão é `host_name-relay-bin.index`. Para canais de replicação não padrão, o nome padrão é `host_name-relay-bin-channel.index`, onde *`channel`* é o nome do canal de replicação registrado neste índice de registro de relé.

O servidor escreve o arquivo no diretório de dados, a menos que o nome seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente.

Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; o nome de base padrão é usado apenas se a opção não for especificada na verdade. Se você especificar a variável de sistema `relay_log_index` na inicialização do servidor sem especificar um valor, é provável que ocorra comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se elas são especificadas na string de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 4.2.2, “Especificando opções de programa”.

* `relay_log_info_file`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>6

O nome do arquivo no qual os registros da replica armazenam informações sobre os registros do relé, quando `relay_log_info_repository=FILE`. Se `relay_log_info_repository=TABLE`, é o nome do arquivo que seria usado caso o repositório fosse alterado para `FILE`). O nome padrão é `relay-log.info` no diretório de dados. Para informações sobre o repositório de metadados do aplicativo, consulte a Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

* `relay_log_info_repository`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>7

A definição desta variável determina se o servidor de replicação armazena seu repositório de metadados do aplicável como uma tabela `InnoDB` no banco de dados do sistema `mysql`, ou como um arquivo no diretório de dados. Para mais informações sobre o repositório de metadados do aplicável, consulte a Seção 16.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”.

A configuração padrão é `FILE`. Como um arquivo, o repositório de metadados do aplicável da replica é chamado `relay-log.info` por padrão, e você pode alterar esse nome usando a variável de sistema `relay_log_info_file`.

Com a configuração `TABLE`, como uma tabela `InnoDB`, o repositório de metadados do aplicável da replica é denominado `mysql.slave_relay_log_info`. A configuração `TABLE` é necessária quando vários canais de replicação são configurados. A configuração `TABLE` para o repositório de metadados do aplicável da replica também é necessária para tornar a replicação resiliente a interrupções inesperadas. Consulte a Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Replicação”, para obter mais informações.

Essa variável deve ser definida como `TABLE` antes de configurar vários canais de replicação. Se você estiver usando vários canais de replicação, não poderá definir o valor de volta para `FILE`.

O ambiente para a localização do repositório de metadados do aplicativo tem uma influência direta no efeito causado pela configuração da variável do sistema [[`sync_relay_log_info`]. Você pode alterar a configuração apenas quando nenhum thread de replicação está sendo executado.

* `relay_log_purge`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Desabilita ou habilita a limpeza automática dos arquivos de registro do relé assim que eles não forem mais necessários. O valor padrão é 1 (`ON`).

* `relay_log_recovery`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>9

Se habilitada, essa variável permite a recuperação automática do log do relé imediatamente após a inicialização do servidor. O processo de recuperação cria um novo arquivo de log do relé, inicializa a posição do thread SQL para este novo log do relé e inicializa o thread de E/S para a posição do thread SQL. A leitura do log do relé, então, continua.

Essa variável global é somente de leitura durante a execução. Seu valor pode ser definido com a opção `--relay-log-recovery` no início da replicação do servidor, que deve ser usada após uma parada inesperada de uma replica para garantir que nenhum registro de relevo possivelmente corrompido seja processado, e deve ser usada para garantir uma replica segura em caso de falha. O valor padrão é 0 (desativado). Para informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte a Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Replicação”.

Essa variável também interage com a variável `relay_log_purge`, que controla a limpeza dos registros quando eles não são mais necessários. Habilitar `relay_log_recovery` quando `relay_log_purge` está desativado pode expor o registro do relé a arquivos que não foram limpos, levando a inconsistências nos dados.

Para uma replica multithread (onde `slave_parallel_workers` é maior que 0), a partir do MySQL 5.7.13, definir `relay_log_recovery = ON` automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do log de relevo. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”.) O processo de recuperação do log de relevo lida com lacunas usando o mesmo método que a declaração `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` faria. Quando a replica atinge um estado consistente sem lacunas, o processo de recuperação do log de relevo continua a buscar transações adicionais a partir da fonte, começando na posição do thread de SQL de replicação. Nas versões do MySQL anteriores ao MySQL 5.7.13, esse processo não era automático e exigia iniciar o servidor com `relay_log_recovery=0`, iniciar a replica com `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` para corrigir quaisquer inconsistências de transação, e depois reiniciar a replica com `relay_log_recovery=1`. Quando a replicação baseada em GTID está em uso, a partir do MySQL 5.7.28, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definida para `ON`, e se estiver, omite o passo de calcular as transações que devem ser ignoradas ou não ignoradas, para que os logs de relevo antigos não sejam necessários para o processo de recuperação.

Nota

Essa variável não afeta os seguintes canais de replicação do grupo:

+ `group_replication_applier`
  + `group_replication_recovery`

Qualquer outro canal que esteja sendo executado em um grupo é afetado, como um canal que está replicando de uma fonte externa ou de outro grupo.

* `relay_log_space_limit`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

O valor máximo de espaço a ser utilizado para todos os registros de relé.

* `replication_optimize_for_static_plugin_config`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

Use bloqueios compartilhados e evite aquisições desnecessárias de bloqueios, para melhorar o desempenho da replicação semiesincronizada. Embora essa variável do sistema esteja habilitada, o plugin de replicação semiesincronizada não pode ser desinstalado, então você deve desabilitar a variável do sistema antes que a desinstalação possa ser concluída.

Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincrona, e pode ser habilitada enquanto a replicação está em execução. Os servidores de origem de replicação semiesincrona também podem obter benefícios de desempenho ao habilitar essa variável de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

`replication_optimize_for_static_plugin_config` pode ser habilitado quando a Replicação em Grupo está em uso em um servidor. Nesse cenário, ele pode beneficiar o desempenho quando há disputa por bloqueios devido a cargas de trabalho elevadas.

* `replication_sender_observe_commit_only`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

Limite os callbacks para melhorar o desempenho da replicação semiesincrona. Essa variável do sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincrona, e pode ser habilitada enquanto a replicação está em execução. Os servidores de origem da replicação semiesincrona também podem obter benefícios de desempenho ao habilitar essa variável do sistema, pois eles usam os mesmos mecanismos de bloqueio que as réplicas.

* `report_host`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

O nome de domínio ou endereço IP do réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW SLAVE HOSTS` no servidor da fonte. Deixe o valor sem definição se você não quiser que a réplica se registre com a fonte.

Nota

Não é suficiente que a fonte simplesmente leia o endereço IP da réplica a partir do soquete TCP/IP após a réplica se conectar. Devido à NAT e outros problemas de roteamento, esse IP pode não ser válido para se conectar à réplica a partir da fonte ou de outros hosts.

* `report_password`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

A senha da conta de usuário de replicação da replica que será reportada à fonte durante o registro da replica. Esse valor aparece na saída do `SHOW SLAVE HOSTS` no servidor da fonte se a fonte foi iniciada com `--show-slave-auth-info`.

Embora o nome desta variável possa sugerir o contrário, `report_password` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) a mesma senha da conta de usuário de replicação do MySQL.

* `report_port`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

O número do porto TCP/IP para conexão com a réplica, que deve ser informado à fonte durante o registro da réplica. Defina apenas se a réplica estiver ouvindo em um porto não padrão ou se você tiver um túnel especial da fonte ou de outros clientes para a réplica. Se você não tiver certeza, não use esta opção.

O valor padrão para esta opção é o número de porta realmente utilizado pela réplica. Este é também o valor padrão exibido por `SHOW SLAVE HOSTS`.

* `report_user`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

O nome de usuário da conta da réplica que será relatada à fonte durante o registro da réplica. Esse valor aparece na saída de `SHOW SLAVE HOSTS` no servidor da fonte se a fonte foi iniciada com `--show-slave-auth-info`.

Embora o nome desta variável possa sugerir o contrário, `report_user` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) o mesmo nome da conta de usuário de replicação do MySQL.

* `rpl_semi_sync_slave_enabled`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

Controla se a replicação semisíncrona está habilitada na replica. Para habilitar ou desabilitar o plugin, defina essa variável como `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_semi_sync_slave_trace_level`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>8

O nível de rastreamento de depuração da replicação semiesincronizada. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `rpl_stop_slave_timeout`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>9

Você pode controlar o tempo (em segundos) que o `STOP SLAVE` espera antes de expirar o tempo, definindo essa variável. Isso pode ser usado para evitar deadlocks entre o `STOP SLAVE` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica.

O valor máximo e o valor padrão de `rpl_stop_slave_timeout` é de 31536000 segundos (1 ano). O mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP SLAVE`.

Essa variável afeta apenas o cliente que emite uma declaração `STOP SLAVE`. Quando o tempo de espera é atingido, o cliente que emite a declaração retorna uma mensagem de erro indicando que a execução do comando é incompleta. O cliente então para de esperar que os threads de replicação parem, mas os threads de replicação continuam a tentar parar, e a instrução `STOP SLAVE` permanece em vigor. Uma vez que os threads de replicação deixam de estar ocupados, a declaração `STOP SLAVE` é executada e a replicação para.

* `slave_checkpoint_group`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Define o número máximo de transações que podem ser processadas por uma replica multithread antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado por `SHOW SLAVE STATUS`. Definir essa variável não tem efeito sobre as réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes `START SLAVE`.

Nota

As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração para essa variável. Consulte a Seção 21.7.3, “Problemas conhecidos na replicação do NDB Cluster”, para obter mais informações.

Essa variável funciona em combinação com a variável do sistema `slave_checkpoint_period` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor o arredonda para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Não há tal arredondamento realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512, e o valor máximo permitido é 524280.

* `slave_checkpoint_period`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Define o tempo máximo (em milissegundos) que é permitido passar antes de uma operação de ponto de verificação ser chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW SLAVE STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável tem efeito em todos os canais de replicação imediatamente, incluindo canais em execução.

Nota

As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração para essa variável. Consulte a Seção 21.7.3, “Problemas conhecidos na replicação do NDB Cluster”, para obter mais informações.

Essa variável funciona em combinação com a variável do sistema `slave_checkpoint_group` de tal forma que, quando qualquer um dos limites é excedido, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são redefinidos.

O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, no qual caso o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

* `slave_compressed_protocol`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Se deve usar a compressão do protocolo de origem/replica se tanto a origem quanto a replica o suportar. Se essa variável estiver desativada (o padrão), as conexões serão descomprimidos. As alterações nessa variável terão efeito em tentativas de conexão subsequentes; isso inclui após a emissão de uma declaração `START SLAVE`, bem como reconexões feitas por uma thread de E/S de replicação em execução (por exemplo, após a definição da opção `MASTER_RETRY_COUNT` para a declaração `CHANGE MASTER TO`). Veja também a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `slave_exec_mode`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Controla como um thread de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; o `STRICT` significa que tal supressão não ocorre.

O modo `IDEMPOTENT` é destinado ao uso em replicação de múltiplas fontes, replicação circular e alguns outros cenários de replicação especiais para a Replicação de NDB Cluster. (Consulte a Seção 21.7.10, “Replicação de NDB Cluster: Replicação Bidirecional e Circular”, e a Seção 21.7.11, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `slave_exec_mode`, e sempre o trata como `IDEMPOTENT`.

No MySQL Server 5.7, o modo `STRICT` é o valor padrão.

Para motores de armazenamento que não sejam o `NDB`, o modo *`IDEMPOTENT` deve ser usado apenas quando você tem certeza absoluta de que erros de chave duplicada e erros de chave não encontrada podem ser ignorados com segurança. Ele é destinado a ser usado em cenários de fail-over para NDB Cluster, onde a replicação de várias fontes ou replicação circular é empregada, e não é recomendado para uso em outros casos.

* `slave_load_tmpdir`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

O nome do diretório onde a replica cria arquivos temporários. Definir essa variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável do sistema `tmpdir`, ou o padrão que se aplica quando essa variável do sistema não é especificada.

Quando o thread de replicação do SQL replica uma declaração `LOAD DATA`, ele extrai o arquivo a ser carregado do log de releio em arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica que coloque os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha um monte de espaço disponível. Nesse caso, os logs de releio também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de releio nesse sistema de arquivos.

O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as declarações `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após uma reinicialização se os arquivos temporários tiverem sido removidos.

* `slave_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Esta variável define o tamanho máximo do pacote para as threads de replicação SQL e de E/S, de modo que grandes atualizações utilizando replicação baseada em string não causem falha na replicação porque uma atualização excede `max_allowed_packet`. Definir esta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não é, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `slave_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

* `slave_net_timeout`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

O número de segundos para esperar mais dados ou um sinal de batida de coração da fonte antes que a replica considere a conexão quebrada, interrompa a leitura e tente reconectar. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes do `START SLAVE`.

O primeiro reprocessamento ocorre imediatamente após o tempo limite. O intervalo entre os reprocessamentos é controlado pela opção `MASTER_CONNECT_RETRY` para a declaração `CHANGE MASTER TO`, e o número de tentativas de reconexão é limitado pela opção `MASTER_RETRY_COUNT` para a declaração `CHANGE MASTER TO`.

O intervalo de batida de coração, que interrompe o tempo de espera de conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD` para a declaração `CHANGE MASTER TO`. O intervalo de batida de coração tem como padrão metade do valor de `slave_net_timeout`, e é registrado no repositório de metadados de conexão da replica e mostrado na tabela do `replication_connection_configuration` do Schema de Desempenho. Observe que uma mudança no valor ou configuração padrão de `slave_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão previamente calculado. Se o tempo de espera de conexão for alterado, você também deve emitir `CHANGE MASTER TO` para ajustar o intervalo de batida de coração a um valor apropriado, para que ele ocorra antes do tempo de espera de conexão.

* `slave_parallel_type`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

Quando se usa uma replica multithread (`slave_parallel_workers` é maior que 0), essa variável especifica a política usada para decidir quais transações são permitidas para executar em paralelo na replica. A variável não tem efeito em réplicas para as quais o multithread não está habilitado. Os valores possíveis são:

+ `LOGICAL_CLOCK`: As transações que fazem parte do mesmo grupo de registro binário são aplicadas em paralelo em uma replica. As dependências entre as transações são rastreadas com base em seus timestamps para fornecer uma adicionalização paralela, quando possível. Quando este valor é definido, a variável de sistema `binlog_transaction_dependency_tracking` pode ser usada na fonte para especificar que conjuntos de escrita são usados para a adicionalização em vez de timestamps, se um conjunto de escrita estiver disponível para a transação e forneça resultados melhores em comparação com os timestamps.

+ `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Este valor é apropriado apenas se os dados forem divididos em vários bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

Quando `slave_preserve_commit_order` é `1`, `slave_parallel_type` deve ser `LOGICAL_CLOCK`.

Todas as threads do aplicativo de replicação devem ser interrompidas antes de definir `slave_parallel_type`.

Quando sua topologia de replicação utiliza múltiplos níveis de réplicas, `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Você pode reduzir esse efeito usando `binlog_transaction_dependency_tracking` na fonte para especificar que conjuntos de escrita são usados em vez de marcações de tempo para paralelização, quando possível.

* `slave_parallel_workers`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

Define o número de threads do aplicável para executar transações de replicação em paralelo. Definir essa variável para um número maior que 0 cria uma replica multithread com esse número de threads do aplicável. Quando definido como 0 (o padrão), a execução paralela é desativada e a replica usa um único thread do aplicável. Definir `slave_parallel_workers` não tem efeito imediato. O estado da variável se aplica em todas as declarações subsequentes de `START SLAVE`.

Nota

As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração para essa variável. Consulte a Seção 21.7.3, “Problemas conhecidos na replicação do NDB Cluster”, para obter mais informações.

Uma replica multithreading oferece execução paralela usando um thread coordenador e o número de threads aplicadores configurados por esta variável. A maneira pela qual as transações são distribuídas entre os threads aplicadores é configurada por `slave_parallel_type`. As transações que a replica aplica em paralelo podem ser confirmadas fora de ordem, a menos que `slave_preserve_commit_order=1`. Portanto, verificar a transação mais recentemente executada não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Isso tem implicações para o registro e recuperação ao usar uma replica multithreading. Por exemplo, em uma replica multithreading, a declaração `START SLAVE UNTIL` só suporta o uso de `SQL_AFTER_MTS_GAPS`.

Em MySQL 5.7, o reprocessamento de transações é suportado quando o multithreading é habilitado em uma replica. Em versões anteriores, `slave_transaction_retries` era tratado como igual a 0 ao usar replicas multithread.

As réplicas multithread atualmente não são suportadas pelo NDB Cluster. Consulte a Seção 21.7.3, “Problemas conhecidos na replicação do NDB Cluster”, para obter mais informações sobre como o `NDB` lida com as configurações desta variável.

* `slave_pending_jobs_size_max`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

Para réplicas multithread, essa variável define a quantidade máxima de memória (em bytes) disponível para filas de trabalho que retêm eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais a multithread não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica em todos os comandos subsequentes do `START SLAVE`.

O valor mínimo possível para essa variável é 1024; o padrão é 16 MB. O valor máximo possível é 18446744073709551615 (16 exabytes). Os valores que não são múltiplos exatos de 1024 são arredondados para o próximo múltiplo mais alto de 1024 antes de serem armazenados.

O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias, e então processada. Todas as transações subsequentes são mantidas até que a grande transação tenha sido concluída.

* `slave_preserve_commit_order`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

Para réplicas multithread, o ajuste 1 para essa variável garante que as transações sejam externalizadas na réplica na mesma ordem em que aparecem no log de relevo da réplica e previne lacunas na sequência de transações que foram executadas a partir do log de relevo. Essa variável não tem efeito em réplicas para as quais a multithread não está habilitada. Note que `slave_preserve_commit_order=1` não preserva a ordem das atualizações DML não transacionais, portanto, essas podem ser confirmadas antes das transações que as precedem no log de relevo, o que pode resultar em lacunas.

`slave_preserve_commit_order=1` exige que `--log-bin` e `--log-slave-updates` estejam habilitados na replica, e `slave_parallel_type` esteja configurado para `LOGICAL_CLOCK`. Antes de alterar essa variável, todos os threads do aplicativo de replicação (para todos os canais de replicação, se você estiver usando vários canais de replicação) devem ser interrompidos.

Com `slave_preserve_commit_order` habilitado, o thread executando aguarda até que todas as transações anteriores sejam comprometidas antes de comprometer. Enquanto o thread está esperando que outros trabalhadores comprometam suas transações, ele reporta seu status como `Waiting for preceding transaction to commit`. (Antes do MySQL 5.7.8, isso era mostrado como `Waiting for its turn to commit`.) Habilitar este modo em uma replica multithread garante que ele nunca entre em um estado que a fonte não estava. Isso suporta o uso da replicação para escala de leitura. Veja a Seção 16.3.4, “Usando Replicação para Escala de Leitura”.

Se `slave_preserve_commit_order` for `0`, as transações que a replica aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação mais recentemente executada não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência de transações que foram executadas a partir do log de relevo da replica. Isso tem implicações para o registro e recuperação ao usar uma replica multithread. Note que a configuração `slave_preserve_commit_order=1` previne lacunas, mas não previne o atraso da posição do log binário da fonte (onde `Exec_master_log_pos` está atrás da posição até a qual as transações foram executadas). Consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transação”, para obter mais informações.

* `slave_rows_search_algorithms`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

Ao preparar lotes de strings para registro e replicação baseada em strings, essa variável controla como as strings são pesquisadas para correspondências, em particular se varreduras de hash são usadas. Definir essa variável tem efeito imediatamente em todos os canais de replicação, incluindo canais em execução.

Especifique uma lista de vírgulas separadas das seguintes combinações de 2 valores da lista `INDEX_SCAN`, `TABLE_SCAN`, `HASH_SCAN`. O valor é esperado como uma string, portanto, se definido em tempo de execução em vez de na inicialização do servidor, o valor deve ser citado. Além disso, o valor não deve conter espaços. As combinações (listas) recomendadas e seus efeitos são mostrados na tabela a seguir:

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

+ O valor padrão é `INDEX_SCAN,TABLE_SCAN`, o que significa que todas as pesquisas que podem usar índices os utilizam, e as pesquisas sem nenhum índice utilizam varreduras de tabela.

+ Para usar hashing em qualquer pesquisa que não utilize uma chave primária ou única, defina `INDEX_SCAN,HASH_SCAN`. Especificar `INDEX_SCAN,HASH_SCAN` tem o mesmo efeito que especificar `INDEX_SCAN,TABLE_SCAN,HASH_SCAN`, que é permitido.

+ Não use a combinação `TABLE_SCAN,HASH_SCAN`. Esta configuração força a geração de hash para todas as pesquisas. Não oferece vantagem em relação a `INDEX_SCAN,HASH_SCAN`, e pode levar a erros de "registro não encontrado" ou erros de chave duplicada no caso de um único evento que contenha múltiplas atualizações na mesma string, ou atualizações que dependem da ordem.

A ordem em que os algoritmos são especificados na lista não faz diferença para a ordem em que eles são exibidos por uma declaração `SELECT` ou `SHOW VARIABLES`.

É possível especificar um único valor, mas isso não é ótimo, porque definir um único valor limita as pesquisas a usar apenas esse algoritmo. Em particular, definir `INDEX_SCAN` sozinho não é recomendado, pois, nesse caso, as pesquisas não conseguem encontrar strings de forma alguma se não houver índice presente.

* `slave_skip_errors`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

Normalmente, a replicação para de quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o thread de replicação SQL continue a replicação quando uma declaração retorna qualquer um dos erros listados no valor da variável.

* `slave_sql_verify_checksum`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

Faça com que o thread de replicação SQL verifique os dados usando os checksums lidos do log do relé. No caso de uma discrepância, a replica pára com um erro. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

Nota

A thread de I/O de replicação sempre lê os checksums, se possível, ao aceitar eventos da rede.

* `slave_transaction_retries`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

Se um thread de replicação SQL não conseguir executar uma transação devido a um `InnoDB` deadlock ou porque o tempo de execução da transação excedeu o `InnoDB` do `innodb_lock_wait_timeout` ou `NDB` do `TransactionDeadlockDetectionTimeout` ou `TransactionInactiveTimeout`, ele recomeça automaticamente `slave_transaction_retries` vezes antes de parar com um erro. As transações com um erro não temporário não são recomeçadas.

O valor padrão para `slave_transaction_retries` é 10. Definir a variável para 0 desativa o reprocessamento automático de transações. A definição da variável entra em vigor imediatamente em todos os canais de replicação, incluindo os canais em execução.

A partir do MySQL 5.7.5, o reprocessamento de transações é suportado quando o multithreading é habilitado em uma replica. Nas versões anteriores, `slave_transaction_retries` era tratado como igual a 0 ao usar replicas multithread.

A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`.

* `slave_type_conversions`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

Controla o modo de conversão de tipo em vigor na replica quando se usa replicação baseada em string. Em MySQL 5.7.2 e superior, seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Estabeleça esta variável em uma string vazia para não permitir conversões de tipo entre a fonte e a replica. Estabelecer esta variável tem efeito imediatamente em todos os canais de replicação, incluindo canais em execução.

`ALL_SIGNED` e `ALL_UNSIGNED` foram adicionados no MySQL 5.7.2 (Bug#15831300). Para informações adicionais sobre os modos de conversão de tipo aplicáveis à promoção e demissão de atributos na replicação baseada em string, consulte Replicação baseada em string: promoção e demissão de atributos.

* `sql_slave_skip_counter`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

O número de eventos da fonte que uma réplica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima declaração `START SLAVE`; a próxima declaração `START SLAVE` também altera o valor de volta para 0. Quando essa variável é definida para um valor não nulo e há vários canais de replicação configurados, a declaração `START SLAVE` só pode ser usada com a cláusula `FOR CHANNEL channel`.

Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando `gtid_mode=ON`. Se você precisar pular transações ao empregar GTIDs, use `gtid_executed` da fonte em vez disso. Veja a Seção 16.1.7.3, “Pular transações”.

Importante

Se o número de eventos ignorados, conforme especificado ao definir essa variável, causar o início da replicação no meio de um grupo de eventos, a replicação continua ignorando até encontrar o início do próximo grupo de eventos e começa a partir desse ponto. Para mais informações, consulte a Seção 16.1.7.3, “Ignorar Transações”.

* `sync_master_info`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

Os efeitos desta variável em uma réplica dependem de se o `master_info_repository` da réplica está definido como `FILE` ou `TABLE`, conforme explicado nos parágrafos a seguir.

**master_info_repository = FILE.** Se o valor de `sync_master_info` for maior que 0, a replica sincroniza seu arquivo `master.info` no disco (usando `fdatasync()`) após cada evento `sync_master_info`. Se for 0, o servidor MySQL não realiza nenhuma sincronização do arquivo `master.info` no disco; em vez disso, o servidor depende do sistema operacional para esvaziar seu conteúdo periodicamente, como em qualquer outro arquivo.

**master_info_repository = TABLE.** Se o valor de `sync_master_info` for maior que 0, a replica atualiza sua tabela de repositório de metadados de conexão após cada evento `sync_master_info`. Se for 0, a tabela nunca é atualizada.

O valor padrão para `sync_master_info` é

10000. Esta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

* `sync_relay_log`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

Se o valor desta variável for maior que 0, o servidor MySQL sincroniza seu log de releio no disco (usando `fdatasync()`) após cada evento `sync_relay_log` ser escrito no log de releio. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

Definir `sync_relay_log` para 0 não faz com que seja feita nenhuma sincronização no disco; nesse caso, o servidor depende do sistema operacional para esvaziar o conteúdo do log do relé de tempos em tempos, como qualquer outro arquivo.

Um valor de 1 é a escolha mais segura, pois, em caso de uma parada inesperada, você perde no máximo um evento do log de retransmissão. No entanto, também é a opção mais lenta (a menos que o disco tenha uma cache com bateria, o que torna a sincronização muito rápida). Para informações sobre a combinação de configurações em uma réplica que é mais resistente a paradas inesperadas, consulte a Seção 16.3.2, “Tratamento de uma parada inesperada de uma réplica”.

* `sync_relay_log_info`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

O valor padrão para `sync_relay_log_info` é 10000. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Os efeitos desta variável na replica dependem da configuração do servidor `relay_log_info_repository` (`FILE` ou `TABLE`). Se a configuração for `TABLE`, os efeitos da variável também dependem de se o motor de armazenamento usado pela tabela de informações de log de releio é transacional (como `InnoDB`) ou não transacional (`MyISAM`). Os efeitos desses fatores no comportamento do servidor para os valores `sync_relay_log_info` de zero e maiores que zero são os seguintes:

`sync_relay_log_info = 0` :   + Se `relay_log_info_repository` estiver definido como `FILE`, o servidor MySQL não realiza nenhuma sincronização do arquivo `relay-log.info` no disco; em vez disso, o servidor depende do sistema operacional para esvaziar seu conteúdo periodicamente, como em qualquer outro arquivo.

Se `relay_log_info_repository` estiver definido como `TABLE`, e o mecanismo de armazenamento para essa tabela for transacional, a tabela é atualizada após cada transação. (O ajuste `sync_relay_log_info` é efetivamente ignorado neste caso.)

Se `relay_log_info_repository` estiver definido como `TABLE`, e o mecanismo de armazenamento para essa tabela não for transacional, a tabela nunca será atualizada.

`sync_relay_log_info = N > 0` :   + Se `relay_log_info_repository` estiver definido como `FILE`, a replica sincroniza seu arquivo `relay-log.info` no disco (usando `fdatasync()`) após cada *`N`* transações.

Se `relay_log_info_repository` estiver definido como `TABLE`, e o mecanismo de armazenamento para essa tabela for transacional, a tabela é atualizada após cada transação. (O ajuste `sync_relay_log_info` é efetivamente ignorado neste caso.)

Se `relay_log_info_repository` estiver definido como `TABLE`, e o mecanismo de armazenamento para essa tabela não for transacional, a tabela é atualizada após cada *`N`* eventos.

#### 16.1.6.4 Opções e variáveis de registro binário

* Opções de inicialização usadas com registro binário
* Variáveis do sistema usadas com registro binário

Você pode usar as opções `mysqld` e as variáveis do sistema descritas nesta seção para afetar o funcionamento do log binário, bem como para controlar quais declarações são escritas no log binário. Para informações adicionais sobre o log binário, consulte a Seção 5.4.4, “O Log Binário”. Para informações adicionais sobre o uso de opções e variáveis do servidor MySQL, consulte a Seção 5.1.6, “Opções de comando do servidor”, e a Seção 5.1.7, “Variáveis do sistema do servidor”.

##### Opções de inicialização usadas com registro binário

A lista a seguir descreve as opções de inicialização para habilitar e configurar o log binário. As variáveis do sistema usadas com o registro binário são discutidas mais adiante nesta seção.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8192</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

Especifique o tamanho máximo de um evento de registro binário baseado em string, em bytes. As strings são agrupadas em eventos menores que este tamanho, se possível. O valor deve ser um múltiplo de 256. O padrão é 8192. Veja a Seção 16.2.1, “Formatos de Replicação”.

* `--log-bin[=base_name]`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Permite o registro binário. Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados no log binário, que é usado para backup e replicação. O log binário é uma sequência de arquivos com um nome de base e extensão numérica. Para informações sobre o formato e a gestão do log binário, consulte a Seção 5.4.4, “O Log Binário”.

Se você fornecer um valor para a opção `--log-bin`, o valor é usado como o nome base para a sequência de log. O servidor cria arquivos de log binários em sequência, adicionando um sufixo numérico ao nome base. No MySQL 5.7, o nome base é predefinido como `host_name-bin`, usando o nome da máquina hospedeira. É recomendável que você especifique um nome base, para que você possa continuar a usar os mesmos nomes de arquivos de log binários, independentemente das alterações no nome padrão.

O local padrão para os arquivos de registro binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto no início do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de registro binário, que rastreia os arquivos de registro binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção [[`--log-bin`]. Um caminho absoluto registrado no arquivo de índice de registro binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. (Em versões mais antigas do MySQL, uma intervenção manual era necessária sempre que se relocalizava os arquivos de registro binário ou de registro de relevo.) (Bug #11745230, Bug #12133)

Definir esta opção faz com que a variável de sistema `log_bin` seja definida como `ON` (ou `1`), e não pelo nome base. O nome do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

Se você especificar a opção `--log-bin` sem também especificar a variável de sistema `server_id`, o servidor não será permitido iniciar. (Bug #11763963, Bug #56739)

Quando os GTIDs estão em uso no servidor, se o registro binário não estiver habilitado ao reiniciar o servidor após uma parada anormal, é provável que alguns GTIDs sejam perdidos, causando o fracasso da replicação. Em uma parada normal, o conjunto de GTIDs do arquivo de registro binário atual é salvo na tabela `mysql.gtid_executed`. Após uma parada anormal em que isso não aconteceu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de registro binário, desde que o registro binário ainda esteja habilitado. Se o registro binário for desativado para o reinício do servidor, o servidor não pode acessar o arquivo de registro binário para recuperar os GTIDs, então a replicação não pode ser iniciada. O registro binário pode ser desativado com segurança após uma parada normal.

Se você deseja desabilitar o registro binário para um início de servidor, mas manter a configuração `--log-bin` intacta, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` no início. Especifique a opção após a opção `--log-bin`, para que ela tenha precedência. Quando o registro binário é desativado, a variável de sistema `log_bin` é definida como OFF.

* `--log-bin-index[=file_name]`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O nome do arquivo de índice de log binário, que contém os nomes dos arquivos de log binário. Por padrão, ele tem a mesma localização e nome de base que o valor especificado para os arquivos de log binário usando a opção `--log-bin`, mais a extensão `.index`. Se você não especificar `--log-bin`, o nome padrão do arquivo de índice de log binário é `binlog.index`. Se você omitir o nome do arquivo e não especificar um com `--log-bin`, o nome padrão do arquivo de índice de log binário é `host_name-bin.index`, usando o nome da máquina hospedeira.

Para informações sobre o formato e a gestão do log binário, consulte a Seção 5.4.4, “O Log Binário”.

**Opções de seleção de declarações.** As opções na lista a seguir afetam quais declarações são escritas no log binário e, portanto, enviadas por um servidor de fonte de replicação para suas réplicas. Há também opções para servidores de réplica que controlam quais declarações recebidas da fonte devem ser executadas ou ignoradas. Para detalhes, consulte a Seção 16.1.6.3, “Opções e variáveis do servidor de réplica”.

* `--binlog-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Esta opção afeta o registro binário de uma maneira semelhante à forma como `--replicate-do-db` afeta a replicação.

Os efeitos desta opção dependem de se o formato de registro baseado em declaração ou baseado em string está em uso, da mesma forma que os efeitos de `--replicate-do-db` dependem de se a replicação baseada em declaração ou baseada em string está em uso. Você deve ter em mente que o formato usado para registrar uma declaração dada não é necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, sem considerar o formato de registro em vigor, então as seguintes regras baseadas em declarações para `--binlog-do-db` sempre se aplicam na determinação de se a declaração é registrada ou

**Registro baseado em declarações.** Apenas as declarações são escritas no log binário onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* causa declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, a serem registradas enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

Aviso

Para especificar múltiplos bancos de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Um exemplo do que não funciona conforme o esperado ao usar o registro baseado em declarações: Se o servidor for iniciado com `--binlog-do-db=sales` e você emitir as seguintes declarações, a declaração `UPDATE` *não* será registrada:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão para esse comportamento de "apenas verifique o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando declarações `DELETE` de várias tabelas ou declarações `UPDATE` de várias tabelas que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

Outro caso que pode não ser evidente é quando um banco de dados é replicado, mesmo que não tenha sido especificado ao definir a opção. Se o servidor for iniciado com `--binlog-do-db=sales`, a seguinte declaração `UPDATE` é registrada, mesmo que `prices` não tenha sido incluído ao definir `--binlog-do-db`:

  ```sql
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

Como o `sales` é o banco de dados padrão quando a declaração `UPDATE` é emitida, o `UPDATE` é registrado.

**Registro baseado em strings.** O registro é restrito ao banco de dados *`db_name`*. Apenas as alterações nas tabelas pertencentes a *`db_name`* são registradas; o banco de dados padrão não tem efeito sobre isso. Suponha que o servidor seja iniciado com `--binlog-do-db=sales` e o registro baseado em strings esteja em vigor, e então as seguintes declarações sejam executadas:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

As alterações na tabela `february` no banco de dados `sales` são registradas de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, ao usar o formato de registro baseado em string e `--binlog-do-db=sales`, as alterações feitas pelos seguintes `UPDATE` não são registradas:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam escritos no log binário.

Outra diferença importante na manipulação do `--binlog-do-db` para o registro baseado em declarações, em oposição ao registro baseado em strings, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que o servidor seja iniciado com `--binlog-do-db=db1`, e as seguintes declarações sejam executadas:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Se você estiver usando o registro baseado em declarações, as atualizações em ambas as tabelas são escritas no log binário. No entanto, ao usar o formato baseado em strings, apenas as alterações em `table1` são registradas; `table2` está em um banco de dados diferente, então não é alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Neste caso, a declaração `UPDATE` não é escrita no log binário quando se usa o registro baseado em declarações. No entanto, quando se usa o registro baseado em strings, a mudança para `table1` é registrada, mas não para `table2` — em outras palavras, apenas as alterações nas tabelas do banco de dados denominado por `--binlog-do-db` são registradas, e a escolha do banco de dados padrão não tem efeito sobre esse comportamento.

* `--binlog-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Esta opção afeta o registro binário de uma maneira semelhante à forma como `--replicate-ignore-db` afeta a replicação.

Os efeitos desta opção dependem de se o formato de registro baseado em declaração ou baseado em string está em uso, da mesma forma que os efeitos de `--replicate-ignore-db` dependem de se a replicação baseada em declaração ou baseada em string está em uso. Você deve ter em mente que o formato usado para registrar uma declaração dada não é necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, sem considerar o formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-ignore-db` sempre se aplicam na determinação de se a declaração é registrada ou

**Registro baseado em declarações.** Diga ao servidor que não registre nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

Antes do MySQL 5.7.2, essa opção fazia com que quaisquer declarações que contenham nomes de tabela totalmente qualificados não fossem registrados se não houvesse um banco de dados padrão especificado (ou seja, quando `SELECT` `DATABASE()` retornava `NULL`). No MySQL 5.7.2 e versões posteriores, quando não há um banco de dados padrão, nenhuma opção `--binlog-ignore-db` é aplicada e tais declarações são sempre registradas. (Bug #11829838, Bug #60188)

**Formato baseado em string.** Diz ao servidor que não registre atualizações em nenhuma tabela no banco de dados *`db_name`*. O banco de dados atual não tem efeito.

Ao usar o registro baseado em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que o servidor seja iniciado com `--binlog-ignore-db=sales` e você emita as seguintes declarações:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* registrada nesse caso, porque `--binlog-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar o registro baseado em string, os efeitos da declaração `UPDATE` *não* são escritos no log binário, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nessa instância, `--binlog-ignore-db=sales` faz com que *todas as* alterações feitas em tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas para fins de registro binário.

Para especificar mais de um banco de dados a ser ignorado, use esta opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam registradas.

**Opções de verificação de checksum.** O MySQL suporta leitura e escrita de verificações de checksums de log binário. Essas opções são ativadas usando as duas opções listadas aqui:

* `--binlog-checksum={NONE|CRC32}`

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>CRC32</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_cache_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294963200</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

O tamanho do cache para armazenar as alterações no log binário durante uma transação.

Um cache de log binário é alocado para cada cliente se o servidor suportar algum motor de armazenamento transacional e se o servidor tiver o log binário habilitado (opção `--log-bin`). Se você usa frequentemente grandes transações, pode aumentar o tamanho desse cache para obter um melhor desempenho. As variáveis de status `Binlog_cache_use` e `Binlog_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 5.4.4, “O Log Binário”.

`binlog_cache_size` define o tamanho do cache de transações apenas; o tamanho do cache de declarações é regido pela variável de sistema `binlog_stmt_cache_size`.

* `binlog_checksum`

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_checksum</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>CRC32</code></td> </tr></tbody></table>

Quando habilitada, essa variável faz com que a fonte escreva um checksum para cada evento no log binário. `binlog_checksum` suporta os valores `NONE` (desativado) e `CRC32`. O padrão é `CRC32`. Não é possível alterar o valor de `binlog_checksum` dentro de uma transação.

Quando o `binlog_checksum` é desativado (valor `NONE`), o servidor verifica que está escrevendo apenas eventos completos no log binário, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

Alterar o valor desta variável faz com que o log binário seja rotado; os checksums são sempre escritos em um arquivo de log binário completo e nunca apenas em parte de um.

Definir essa variável na fonte para um valor não reconhecido pela réplica faz com que a réplica defina seu próprio valor `binlog_checksum` para `NONE`, e pare a replicação com um erro. (Bug #13553750, Bug #61096) Se a compatibilidade reversa com réplicas mais antigas é uma preocupação, você pode querer definir o valor explicitamente para `NONE`.

* `binlog_direct_non_transactional_updates`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

Devido a problemas de concorrência, uma replica pode se tornar inconsistente quando uma transação contém atualizações em tabelas tanto transacionais quanto não transacionais. O MySQL tenta preservar a causalidade entre essas declarações, escrevendo declarações não transacionais no cache de transação, que é apagado após o commit. No entanto, problemas surgem quando as modificações feitas em tabelas não transacionais em nome de uma transação se tornam imediatamente visíveis para outras conexões, porque essas mudanças podem não ser escritas imediatamente no log binário.

A variável `binlog_direct_non_transactional_updates` oferece uma solução possível para este problema. Por padrão, essa variável está desativada. Ativação de `binlog_direct_non_transactional_updates` faz com que as atualizações de tabelas não transacionais sejam escritas diretamente no log binário, em vez de no cache de transação.

*`binlog_direct_non_transactional_updates` funciona apenas para declarações que são replicadas usando o formato de registro binário baseado em declarações*; ou seja, funciona apenas quando o valor de `binlog_format` é `STATEMENT`, ou quando `binlog_format` é `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em declarações. Esta variável não tem efeito quando o formato de registro binário é `ROW`, ou quando `binlog_format` está definido como `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em strings.

Importante

Antes de habilitar essa variável, você deve garantir que não haja dependências entre tabelas transacionais e não transacionais; um exemplo de tal dependência seria a declaração `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, essas declarações provavelmente farão com que a replica se afastem da fonte.

Essa variável não tem efeito quando o formato de registro binário é `ROW` ou `MIXED`.

* `binlog_error_action`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

Controla o que acontece quando o servidor encontra um erro, como não conseguir escrever, esvaziar ou sincronizar o log binário, o que pode fazer com que o log binário da fonte se torne inconsistente e as réplicas percam a sincronização.

Em MySQL 5.7.7 e superior, essa variável tem como padrão `ABORT_SERVER`, o que faz com que o servidor pare de registrar e desligue sempre que encontrar um erro desse tipo no log binário. Na reinicialização, a recuperação prossegue como no caso de uma parada inesperada do servidor (consulte Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Replicação”).

Quando `binlog_error_action` está definido como `IGNORE_ERROR`, se o servidor encontrar esse erro, ele continua a transação em andamento, registra o erro e, em seguida, interrompe o registro, e continua a realizar atualizações. Para retomá-lo o registro binário `log_bin` deve ser habilitado novamente, o que requer o reinício do servidor. Esse ajuste oferece compatibilidade reversa com versões mais antigas do MySQL.

Em versões anteriores, essa variável era chamada de `binlogging_impossible_mode`.

* `binlog_format`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

Essa variável de sistema define o formato de registro binário e pode ser qualquer uma das opções `STATEMENT`, `ROW` ou `MIXED`. Consulte a Seção 16.2.1, “Formatos de Replicação”. O ajuste entra em vigor quando o registro binário está habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 5.7, o registro binário não é habilitado por padrão, e você o habilita usando a opção `--log-bin`.

`binlog_format` pode ser definido na inicialização ou durante a execução, exceto que, em algumas condições, alterar essa variável durante a execução não é possível ou causa o fracasso da replicação, conforme descrito mais adiante.

Antes do MySQL 5.7.7, o formato padrão era `STATEMENT`. No MySQL 5.7.7 e versões posteriores, o padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replicação baseada em declarações não é suportada para o NDB Cluster.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

As regras que regem quando as alterações nesta variável entram em vigor e por quanto tempo o efeito dura são as mesmas que para outras variáveis do sistema do servidor MySQL. Para mais informações, consulte a Seção 13.7.4.1, "Sintaxe SET para atribuição de variáveis".

Quando `MIXED` é especificado, a replicação baseada em declarações é usada, exceto nos casos em que apenas a replicação baseada em strings garante resultados adequados. Por exemplo, isso acontece quando as declarações contêm funções carregáveis ou a função `UUID()`.

Para obter detalhes sobre como os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) são tratados quando cada formato de registro binário é definido, consulte a Seção 23.7, “Registro binário de programas armazenados”.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

+ De dentro de uma função armazenada ou de um gatilho.  
+ Se a sessão estiver atualmente no modo de replicação baseada em string e tiver tabelas temporárias abertas.

+ De dentro de uma transação.

Tentar mudar o formato nesses casos resulta em um erro.

Mudar o formato de registro em um servidor de fonte de replicação não faz com que a réplica mude seu formato de registro para corresponder. Alterar o formato de replicação enquanto a replicação está em andamento pode causar problemas se a réplica tiver registro binário habilitado, e a mudança resultar na réplica usando registro no formato `STATEMENT` enquanto a fonte está usando registro no formato `ROW` ou `MIXED`. A réplica não é capaz de converter entradas de registro binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio registro binário, então essa situação pode causar falha na replicação. Para mais informações, consulte a Seção 5.4.4.2, “Definindo o Formato de Registro Binário”.

O formato de log binário afeta o comportamento das seguintes opções do servidor:

+ `--replicate-do-db`
  + `--replicate-ignore-db`
  + `--binlog-do-db`
  + `--binlog-ignore-db`

Esses efeitos são discutidos em detalhes nas descrições das opções individuais.

* `binlog_group_commit_sync_delay`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

Controla quantos microsegundos o registro binário de commit espera antes de sincronizar o arquivo do registro binário no disco. Por padrão, `binlog_group_commit_sync_delay` está definido como 0, o que significa que não há atraso. Definir `binlog_group_commit_sync_delay` com um atraso de microsegundo permite que mais transações sejam sincronizadas juntas no disco de uma vez, reduzindo o tempo geral para comprometer um grupo de transações, pois os grupos maiores requerem menos unidades de tempo por grupo.

Quando `sync_binlog=0` ou `sync_binlog=1` é definido, o atraso especificado por `binlog_group_commit_sync_delay` é aplicado para cada grupo de commit de log binário antes da sincronização (ou, no caso de `sync_binlog=0`, antes de prosseguir). Quando `sync_binlog` é definido com um valor *n* maior que 1, o atraso é aplicado após cada *n* grupos de commit de log binário.

Definir `binlog_group_commit_sync_delay` pode aumentar o número de transações de commit paralelas em qualquer servidor que tenha (ou possa ter após uma falha de replicação) uma replica, e, portanto, pode aumentar a execução paralela nas réplicas. Para se beneficiar desse efeito, os servidores de replicação devem ter `slave_parallel_type=LOGICAL_CLOCK` definido, e o efeito é mais significativo quando `binlog_transaction_dependency_tracking=COMMIT_ORDER` também é definido. É importante levar em consideração tanto o throughput da fonte quanto o throughput das réplicas ao ajustar a configuração para `binlog_group_commit_sync_delay`.

Definir `binlog_group_commit_sync_delay` também pode reduzir o número de chamadas `fsync()` ao log binário em qualquer servidor (fonte ou replica) que tenha um log binário.

Observe que a definição de `binlog_group_commit_sync_delay` aumenta a latência das transações no servidor, o que pode afetar as aplicações do cliente. Além disso, em cargas de trabalho altamente concorrentes, é possível que o atraso aumente a concorrência e, portanto, reduza o desempenho. Normalmente, os benefícios da definição de um atraso superam as desvantagens, mas o ajuste sempre deve ser realizado para determinar a configuração ótima.

* `binlog_group_commit_sync_no_delay_count`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

O número máximo de transações a serem esperadas antes de abortar o atraso atual, conforme especificado por `binlog_group_commit_sync_delay`. Se `binlog_group_commit_sync_delay` estiver definido como 0, então esta opção não terá efeito.

* `binlog_max_flush_queue_time`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

Anteriormente, isso controlava o tempo em microssegundos para continuar lendo transações da fila de esvaziamento antes de prosseguir com o compromisso do grupo. No MySQL 5.7, essa variável não tem mais nenhum efeito.

`binlog_max_flush_queue_time` é descontinuado a partir do MySQL 5.7.9 e está marcado para eventual remoção em um lançamento futuro do MySQL.

* `binlog_order_commits`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

Quando essa variável é habilitada em um servidor de fonte de replicação (que é o padrão), as instruções de comprovação de transações emitidas para os motores de armazenamento são serializadas em um único thread, de modo que as transações são sempre comprometidas na mesma ordem em que são escritas no log binário. Desabilitar essa variável permite que as instruções de comprovação de transações sejam emitidas usando vários threads. Usada em combinação com o compromisso de grupo de log binário, isso impede que a taxa de comprometimento de uma única transação seja um gargalo para o desempenho e, portanto, pode produzir uma melhoria de desempenho.

As transações são escritas no log binário no ponto em que todos os motores de armazenamento envolvidos confirmaram que a transação está preparada para ser confirmada. A lógica de commit do grupo de log binário então confirma um grupo de transações após a escrita no log binário ter ocorrido. Quando o `binlog_order_commits` é desativado, porque vários threads são usados para este processo, as transações em um grupo de commit podem ser confirmadas em uma ordem diferente da ordem em que estão no log binário. (As transações de um único cliente sempre são confirmadas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transações separadas devem produzir resultados consistentes, e se isso não for o caso, uma única transação deve ser usada em vez disso.

Se você deseja garantir que o histórico de transações no banco de origem e na replica multithread permaneça idêntico, defina `slave_preserve_commit_order=1` na replica.

* `binlog_row_image`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

Para a replicação baseada em string do MySQL, essa variável determina como as imagens de string são escritas no log binário.

Na replicação baseada em string do MySQL, cada evento de mudança de string contém duas imagens, uma imagem “antes” cujos campos são correspondidos quando se busca a string a ser atualizada, e uma imagem “depois” contendo as mudanças. Normalmente, o MySQL registra strings completas (ou seja, todos os campos) tanto para as imagens antes quanto depois. No entanto, não é estritamente necessário incluir todos os campos em ambas as imagens, e muitas vezes podemos economizar disco, memória e uso de rede ao registrar apenas os campos que são realmente necessários.

Nota

Ao excluir uma string, apenas a imagem anterior é registrada, uma vez que não há valores alterados para propagar após a exclusão. Ao inserir uma string, apenas a imagem posterior é registrada, uma vez que não há uma string existente para ser correspondida. Somente ao atualizar uma string, as imagens anterior e posterior são necessárias e ambas são escritas no log binário.

Para a imagem anterior, é necessário apenas registrar o conjunto mínimo de colunas necessárias para identificar de forma única as strings. Se a tabela que contém a string tiver uma chave primária, então apenas a(s) coluna(s) da chave primária são escritas no log binário. Caso contrário, se a tabela tiver uma chave única cujas colunas são todas `NOT NULL`, então apenas as colunas da chave única precisam ser registradas. (Se a tabela não tiver uma chave primária nem uma chave única sem quaisquer colunas `NULL`, então todas as colunas devem ser usadas na imagem anterior e registradas.) Na imagem posterior, é necessário registrar apenas as colunas que realmente mudaram.

Você pode fazer com que o servidor registre strings completas ou mínimas usando a variável de sistema `binlog_row_image`. Essa variável, na verdade, assume um dos três valores possíveis, conforme mostrado na lista a seguir:

+ `full`: Registre todas as colunas na imagem antes e na imagem depois.

+ `minimal`: Registre apenas as colunas da imagem anterior que são necessárias para identificar a string que será alterada; registre apenas as colunas da imagem final onde um valor foi especificado pelo SQL ou gerado por auto-incremento.

+ `noblob`: Registre todas as colunas (mesma que `full`), exceto as colunas `BLOB` e `TEXT` que não são necessárias para identificar as strings, ou que não foram alteradas.

Nota

Essa variável não é suportada pelo NDB Cluster; definir essa variável não tem efeito sobre o registro das tabelas `NDB`.

O valor padrão é `full`.

Ao usar `minimal` ou `noblob`, as operações de exclusão e atualização são garantidas para funcionar corretamente para uma tabela específica se e somente se as seguintes condições forem verdadeiras tanto para a tabela de origem quanto para a tabela de destino:

+ Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo tipo de dados que sua contraparte na outra tabela.

+ As tabelas devem ter definições de chave primária idênticas.

(Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de índices que não fazem parte das chaves primárias das tabelas.)

Se essas condições não forem atendidas, é possível que os valores das colunas da chave primária na tabela de destino possam se provar insuficientes para fornecer uma correspondência única para uma exclusão ou atualização. Nesse caso, nenhum aviso ou erro é emitido; a fonte e a réplica divergem silenciosamente, rompendo assim a consistência.

Esta variável não tem efeito quando o formato de registro binário é `STATEMENT`. Quando `binlog_format` é `MIXED`, o ajuste para `binlog_row_image` é aplicado a alterações que são registradas usando o formato baseado em string, mas este ajuste não tem efeito em alterações registradas como declarações.

Definir `binlog_row_image` em nível global ou de sessão não causa um compromisso implícito; isso significa que essa variável pode ser alterada enquanto uma transação está em andamento sem afetar a transação.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

Essa variável de sistema afeta apenas o registro baseado em string. Quando habilitada, ela faz com que o servidor escreva eventos de registro informativos, como eventos de registro de consulta de string, em seu log binário. Essas informações podem ser usadas para depuração e propósitos relacionados, como obter a consulta original emitida na fonte quando não puder ser reconstruída a partir das atualizações de string.

Esses eventos informativos são normalmente ignorados pelos programas do MySQL que leem o log binário e, portanto, não causam problemas ao replicar ou restaurar a partir de um backup. Para visualizá-los, aumente o nível de verbosidade usando a opção `--verbose` do mysqlbinlog duas vezes, como `-vv` ou `--verbose --verbose`.

* `binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

Essa variável determina o tamanho do cache para o log binário, que deve conter declarações não transacionais emitidas durante uma transação.

Cache separado de transações binárias e cache de declarações são alocados para cada cliente se o servidor suportar qualquer motor de armazenamento transacional e se o servidor tiver o log binário habilitado (opção `--log-bin`). Se você usa frequentemente grandes declarações não transacionais durante transações, pode aumentar o tamanho desse cache para obter um melhor desempenho. As variáveis de status `Binlog_stmt_cache_use` e `Binlog_stmt_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 5.4.4, “O Log Binário”.

A variável de sistema `binlog_cache_size` define o tamanho do cache de transações.

* `binlog_transaction_dependency_tracking`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

A fonte de informações de dependência que a fonte usa para determinar quais transações podem ser executadas em paralelo pelo aplicativo multithread do replica. Essa variável pode assumir um dos três valores descritos na lista a seguir:

+ `COMMIT_ORDER`: As informações de dependência são geradas a partir dos timestamps de commit da fonte. Isso é o padrão.

+ `WRITESET`: As informações de dependência são geradas a partir do conjunto de escrita da fonte, e quaisquer transações que escrevam tuplas diferentes podem ser paralelizadas.

+ `WRITESET_SESSION`: As informações de dependência são geradas a partir do conjunto de escrita da fonte, e quaisquer transações que escrevam tuplas diferentes podem ser paralelizadas, com exceção de que nenhuma das duas atualizações da mesma sessão pode ser reordenada.

No modo `WRITESET` ou `WRITESET_SESSION`, as transações podem ser confirmadas fora do devido tempo, a menos que você também defina `slave_preserve_commit_order=1`.

Para algumas transações, os modos `WRITESET` e `WRITESET_SESSION` não podem melhorar os resultados que seriam retornados no modo `COMMIT_ORDER`. Esse é o caso de transações que têm conjuntos de escrita vazios ou parciais, transações que atualizam tabelas sem chaves primárias ou únicas e transações que atualizam tabelas pai em uma relação de chave estrangeira. Nessas situações, a fonte usa o modo `COMMIT_ORDER` para gerar as informações de dependência em vez disso.

O valor desta variável não pode ser definido para nada além de `COMMIT_ORDER` se `transaction_write_set_extraction` estiver em `OFF`. Você também deve notar que o valor de `transaction_write_set_extraction` não pode ser alterado se o valor atual de `binlog_transaction_dependency_tracking` estiver em `WRITESET` ou `WRITESET_SESSION`. Se você alterar o valor, o novo valor não terá efeito nas réplicas até que a réplica tenha sido parada e reiniciada com as declarações de `STOP SLAVE` e `START SLAVE`.

O número de hashes de string a serem mantidos e verificados para que a última transação tenha alterado uma determinada string é determinado pelo valor de `binlog_transaction_dependency_history_size`.

* `binlog_transaction_dependency_history_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

Define um limite superior para o número de hashes de string que são mantidos na memória e usados para procurar a transação que modificou a última string. Assim que esse número de hashes é atingido, o histórico é apagado.

* `expire_logs_days`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

O número de dias para a remoção automática de arquivos de registro binário. O padrão é 0, o que significa "sem remoção automática". As remoções possíveis ocorrem no início e quando o registro binário é esvaziado. O esvaziamento do log ocorre conforme indicado na Seção 5.4, "Logs do MySQL Server".

Para remover arquivos de registro binários manualmente, use a declaração `PURGE BINARY LOGS`. Veja a Seção 13.4.1.1, “Declaração PURGE BINARY LOGS”.

* `log_bin`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

Se o registro binário está habilitado. Se a opção `--log-bin` for usada, então o valor desta variável é `ON`; caso contrário, é `OFF`. Esta variável relata apenas o status do registro binário (ativado ou desativado); ela não reporta, na verdade, o valor para o qual `--log-bin` está configurado.

Veja a Seção 5.4.4, “O Log Binário”.

* `log_bin_basename`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

Contém o nome de base e o caminho para os arquivos de registro binários, que podem ser definidos com a opção de servidor `--log-bin`. O comprimento máximo da variável é de 256. No MySQL 5.7, o nome de base padrão é o nome da máquina do host com o sufixo `-bin`. O local padrão é o diretório de dados.

* `log_bin_index`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

Contém o nome de base e o caminho para o arquivo de índice de registro binário, que pode ser definido com a opção de servidor [[`--log-bin-index`]. A máxima variável de comprimento é 256.

* `log_bin_trust_function_creators`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

Esta variável é aplicada quando o registro binário está habilitado. Ela controla se os criadores de funções armazenadas podem ser confiáveis para não criar funções armazenadas que causem eventos inseguros a serem registrados no registro binário. Se definida como 0 (o padrão), os usuários não têm permissão para criar ou alterar funções armazenadas, a menos que tenham o privilégio `SUPER` além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE`. Uma definição de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida como 1, o MySQL não aplica essas restrições à criação de funções armazenadas. Esta variável também se aplica à criação de gatilhos. Veja a Seção 23.7, “Registro Binário de Programas Armazenados”.

* `log_bin_use_v1_row_events`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

Se a versão binária de registro 2 estiver em uso. Se esta variável for 0 (desativada, padrão), os eventos de registro binário da versão 2 estão em uso. Se esta variável for 1 (ativada), o servidor escreve o registro binário usando eventos de registro da versão 1 (a única versão de eventos de registro binário usada em versões anteriores) e, assim, produz um registro binário que pode ser lido por réplicas mais antigas.

O MySQL 5.7 usa eventos de string de registro binário da Versão 2 por padrão. No entanto, os eventos da Versão 2 não podem ser lidos por versões do MySQL Server anteriores ao MySQL 5.6.6. Ativação de `log_bin_use_v1_row_events` faz com que `mysqld` escreva o registro binário usando eventos de registro da Versão 1.

Essa variável é somente de leitura durante a execução. Para alternar entre o registro binário de eventos da Versão 1 e a Versão 2, é necessário definir `log_bin_use_v1_row_events` no início do servidor.

Exceto quando se realiza uma atualização do NDB Cluster Replication, `log_bin_use_v1_row_events` é principalmente de interesse ao configurar a detecção e resolução de conflitos de replicação usando `NDB$EPOCH_TRANS()` como a função de detecção de conflitos, o que requer eventos de string de registro binário da Versão 2. Assim, essa variável e `--ndb-log-transaction-id` não são compatíveis.

Nota

O MySQL NDB Cluster 7.5 usa eventos de string de registro binário da Versão 2 por padrão. Você deve ter isso em mente ao planejar atualizações ou reduções, e para configurações que utilizam a Replicação do NDB Cluster.

Para mais informações, consulte a Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

* `log_builtin_as_identified_by_password`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

Essa variável afeta o registro binário das declarações de gerenciamento de usuários. Quando habilitada, a variável tem os seguintes efeitos:

+ O registro binário para as declarações `CREATE USER` que envolvem plugins de autenticação embutidos reescreve as declarações para incluir uma cláusula `IDENTIFIED BY PASSWORD`.

As declarações do `SET PASSWORD` são registradas como declarações do `SET PASSWORD`, em vez de serem reescritas como declarações do `ALTER USER`.

As declarações do `SET PASSWORD` são alteradas para registrar o hash da senha em vez da senha fornecida em texto claro (não criptografada).

Ativação desta variável garante melhor compatibilidade para replicação entre versões com 5.6 e réplicas pré-5.7.6, e para aplicativos que esperam essa sintaxe no log binário.

* `log_slave_updates`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

Se as atualizações recebidas por um servidor replicado de um servidor fonte devem ser registradas no log binário próprio do servidor replicado.

Normalmente, uma replica não registra em seu próprio log binário quaisquer atualizações que sejam recebidas de um servidor fonte. Habilitar essa variável faz com que a replica escreva as atualizações realizadas por seu thread de replicação SQL em seu próprio log binário. Para que essa opção tenha algum efeito, a replica também deve ser iniciada com a opção `--log-bin` para habilitar o registro binário. Veja a Seção 16.1.6, “Opções e Variáveis de Replicação e Registro Binário”.

`log_slave_updates` é habilitado quando você deseja encadear servidores de replicação. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```sql
  A -> B -> C
  ```

Aqui, `A` serve como fonte para a réplica `B`, e `B` serve como fonte para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma réplica. Você deve iniciar os dois `A` e `B` com `--log-bin` para habilitar o registro binário, e `B` com `log_slave_updates` habilitado para que as atualizações recebidas de `A` sejam registradas por `B` em seu log binário.

* `log_statements_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Se o erro 1592 for encontrado, controla se os avisos gerados serão adicionados ao log de erro ou

* `master_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Ativação desta variável faz com que a fonte verifique eventos lidos do log binário examinando checksums e pare com um erro em caso de incompatibilidade. `master_verify_checksum` é desativado por padrão; neste caso, a fonte usa o comprimento do evento do log binário para verificar eventos, de modo que apenas eventos completos sejam lidos do log binário.

* `max_binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Se uma transação requer mais do que esse número de bytes, o servidor gera um erro de transação de múltiplos registros que exige mais de 'max_binlog_cache_size' bytes de armazenamento. Quando `gtid_mode` não é `ON`, o valor máximo recomendado é de 4 GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de registro binário maiores que 4 GB; quando `gtid_mode` é `ON`, essa limitação não se aplica e o servidor pode trabalhar com posições de registro binário de tamanho arbitrário.

Se, por algum motivo, o fato de que `gtid_mode` não é `ON`, ou por algum outro motivo, você precisa garantir que o log binário não exceda um tamanho dado *`maxsize`*, você deve definir essa variável de acordo com a fórmula mostrada aqui:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Se uma escrita no log binário causar o tamanho atual do arquivo de registro a exceder o valor desta variável, o servidor rotaciona os logs binários (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e o valor padrão é de 1 GB.

Uma transação é escrita em um único bloco no log binário, portanto, ela nunca é dividida entre vários logs binários. Portanto, se você tiver transações grandes, você pode ver arquivos de log binário maiores que `max_binlog_size`.

Se `max_relay_log_size` for 0, o valor de `max_binlog_size` também se aplica aos registros de relés.

* `max_binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Se declarações não transacionais dentro de uma transação exigirem mais do que esse número de bytes de memória, o servidor gera um erro. O valor mínimo é de 4096. Os valores máximo e padrão são 4 GB em plataformas de 32 bits e 16 EB (exabytes) em plataformas de 64 bits.

`max_binlog_stmt_cache_size` define o tamanho do cache de declarações apenas; o limite superior para o cache de transações é regido exclusivamente pela variável de sistema `max_binlog_cache_size`.

* `sql_log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Essa variável controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável da sessão `sql_log_bin` para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão que desabilite temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

* Definir essa variável como `OFF` impede que GTIDs sejam atribuídos a transações no log binário. Se você está usando GTIDs para replicação, isso significa que, mesmo quando o registro binário é habilitado novamente, os GTIDs escritos no log a partir desse ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, na prática, essas transações são perdidas.

A variável global `sql_log_bin` é somente de leitura e não pode ser modificada. O escopo global é desaconselhado; espere que ele seja removido em uma versão futura do MySQL.

* `sync_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Controla a frequência com que o servidor MySQL sincroniza o log binário com o disco.

+ `sync_binlog=0`: Desabilita a sincronização do log binário com o disco pelo servidor MySQL. Em vez disso, o servidor MySQL depende do sistema operacional para esvaziar o log binário para o disco de tempos em tempos, como faz com qualquer outro arquivo. Esta configuração oferece o melhor desempenho, mas, em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram sincronizadas com o log binário.

+ `sync_binlog=1`: Habilita a sincronização do log binário com o disco antes que as transações sejam confirmadas. Esta é a configuração mais segura, mas pode ter um impacto negativo no desempenho devido ao número aumentado de gravações no disco. No caso de uma falha de energia ou falha do sistema operacional, as transações que estão ausentes no log binário estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática desconsidere as transações, o que garante que nenhuma transação seja perdida do log binário.

+ `sync_binlog=N`, onde *`N`* é um valor diferente de 0 ou 1: O log binário é sincronizado com o disco após os grupos de commit do log binário `N` terem sido coletados. No caso de uma falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram esvaziadas para o log binário. Esta configuração pode ter um impacto negativo no desempenho devido ao número aumentado de escritas no disco. Um valor mais alto melhora o desempenho, mas com um risco aumentado de perda de dados.

Para a maior durabilidade e consistência possível em uma configuração de replicação que utiliza `InnoDB` com transações, use esses ajustes:

+ `sync_binlog=1`.
  + `innodb_flush_log_at_trx_commit=1`.

Cuidado

Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de varredura para disco. Eles podem informar ao `mysqld` que a varredura ocorreu, mesmo que não tenha. Neste caso, a durabilidade das transações não é garantida mesmo com as configurações recomendadas, e, no pior dos casos, uma falta de energia pode corromper os dados do `InnoDB`. Usar um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as varreduras de arquivos e torna a operação mais segura. Você também pode tentar desativar o cache de escritas de disco em caches de hardware.

* `transaction_write_set_extraction`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Define o algoritmo usado para gerar um hash que identifica as gravações associadas a uma transação. Se você estiver usando a Replicação por Grupo, o valor do hash é usado para detecção e tratamento de conflitos distribuídos. Em sistemas de 64 bits que executam a Replicação por Grupo, recomendamos definir isso para `XXHASH64` para evitar colisões desnecessárias de hash que resultem em falhas de certificação e rollback das transações dos usuários. Veja a Seção 17.3.1, “Requisitos de Replicação por Grupo”. `binlog_format` deve ser definido para `ROW` para alterar o valor desta variável. Se você alterar o valor, o novo valor não terá efeito nas réplicas até que a réplica tenha sido parada e reiniciada com as declarações `STOP SLAVE` e `START SLAVE`.

Nota

Quando `WRITESET` ou `WRITESET_SESSION` é definido como o valor para `binlog_transaction_dependency_tracking`, `transaction_write_set_extraction` deve ser definido para especificar um algoritmo (não definido para `OFF`). Enquanto o valor atual de `binlog_transaction_dependency_tracking` é `WRITESET` ou `WRITESET_SESSION`, você não pode alterar o valor de `transaction_write_set_extraction`.

#### 16.1.6.5 Variáveis do Sistema de Identificação de Transações Globais

As variáveis de sistema do MySQL Server descritas nesta seção são usadas para monitorar e controlar Identificadores de Transação Global (GTIDs). Para informações adicionais, consulte a Seção 16.1.3, “Replicação com Identificadores de Transação Global”.

* `binlog_gtid_simple_recovery`

  <table frame="box" rules="all" summary="Properties for binlog_gtid_simple_recovery"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_gtid_simple_recovery</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Essa variável controla a forma como os arquivos de registro binários são iterados durante a busca por GTIDs quando o MySQL é iniciado ou reiniciado.

Quando `binlog_gtid_simple_recovery=TRUE`, que é o padrão, os valores de `gtid_executed` e `gtid_purged` são calculados no início, com base nos valores de `Previous_gtids_log_event` nos arquivos binários mais recentes e mais antigos. Para uma descrição da computação, consulte a `gtid_purged` Sistema de Variáveis. Esta configuração acessa apenas dois arquivos binários durante a reinicialização do servidor. Se todos os logs binários no servidor foram gerados usando MySQL 5.7.8 ou posterior e você está usando MySQL 5.7.8 ou posterior, `binlog_gtid_simple_recovery=TRUE` pode ser usado com segurança sempre.

Com `binlog_gtid_simple_recovery=TRUE`, `gtid_executed` e `gtid_purged` pode ser inicializado incorretamente nas seguintes duas situações:

+ O log binário mais recente foi gerado pelo MySQL 5.7.5 ou versões anteriores, e `gtid_mode` foi `ON` para alguns logs binários, mas `OFF` para o log binário mais recente.

Foi emitida uma declaração `SET @@GLOBAL.gtid_purged` sobre o MySQL 5.7.7 ou versões anteriores, e o log binário que estava ativo no momento da declaração `SET @@GLOBAL.gtid_purged` ainda não foi apagado.

Se um conjunto de GTID incorreto for calculado em qualquer uma dessas situações, ele permanecerá incorreto mesmo se o servidor for reiniciado posteriormente com `binlog_gtid_simple_recovery=FALSE`. Se qualquer uma dessas situações se aplicar no servidor, defina `binlog_gtid_simple_recovery=FALSE` antes de iniciar ou reiniciar o servidor. Para verificar a segunda situação, se você estiver usando MySQL 5.7.7 ou versões anteriores, após emitir uma declaração `SET @@GLOBAL.gtid_purged`, anote o nome do arquivo de log binário atual, que pode ser verificado usando `SHOW MASTER STATUS`. Se o servidor for reiniciado antes que esse arquivo tenha sido limpo, então você deve definir `binlog_gtid_simple_recovery=FALSE`.

Quando `binlog_gtid_simple_recovery=FALSE` é definido, o método de cálculo de `gtid_executed` e `gtid_purged` conforme descrito no Sistema de Variável `gtid_purged` é alterado para iterar os arquivos de log binário da seguinte forma:

Em vez de usar o valor de `Previous_gtids_log_event` e eventos de registro GTID do arquivo de registro binário mais recente, a computação para `gtid_executed` itera a partir do arquivo de registro binário mais recente e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de registro GTID do primeiro arquivo de registro binário onde encontra um valor de `Previous_gtids_log_event`. Se os arquivos de registro binário mais recentes do servidor não tiverem eventos de registro GTID, por exemplo, se `gtid_mode=ON` foi usado, mas o servidor foi alterado posteriormente para `gtid_mode=OFF`, esse processo pode levar um longo tempo.

Em vez de usar o valor de `Previous_gtids_log_event` do arquivo de registro binário mais antigo, a computação para `gtid_purged` itera a partir do arquivo de registro binário mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro arquivo de registro binário onde encontra ou um valor não vazio de `Previous_gtids_log_event`, ou pelo menos um evento de registro GTID (indicando que o uso de GTIDs começa nesse ponto). Se os arquivos de registro binário mais antigos do servidor não tiverem eventos de registro GTID, por exemplo, se `gtid_mode=ON` foi definido recentemente no servidor, esse processo pode levar um longo tempo.

Na versão 5.7.5 do MySQL, essa variável foi adicionada como `simplified_binlog_gtid_recovery` e, na versão 5.7.6 do MySQL, foi renomeada para `binlog_gtid_simple_recovery`.

* `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Properties for enforce_gtid_consistency"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enforce-gtid-consistency[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>enforce_gtid_consistency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code><code>ON</code><code>WARN</code></td> </tr></tbody></table>

Dependendo do valor desta variável, o servidor garante a consistência do GTID, permitindo a execução apenas de instruções que podem ser registradas com segurança usando um GTID. Você *deve* definir esta variável para `ON` antes de habilitar a replicação baseada em GTID.

Os valores que o `enforce_gtid_consistency` pode ser configurado para são:

+ `OFF`: todas as transações são permitidas para violar a consistência do GTID.

+ `ON`: nenhuma transação é permitida para violar a consistência do GTID.

+ `WARN`: todas as transações são permitidas para violar a consistência do GTID, mas um aviso é gerado neste caso. `WARN` foi adicionado no MySQL 5.7.6.

Apenas as declarações que podem ser registradas usando declarações seguras GTID podem ser registradas quando `enforce_gtid_consistency` está definido como `ON`, portanto, as operações listadas aqui não podem ser usadas com esta opção:

+ `CREATE TABLE ... SELECT` declarações

+ declarações `CREATE TEMPORARY TABLE` ou `DROP TEMPORARY TABLE` dentro de transações

+ Transações ou declarações que atualizam tanto as tabelas transacionais quanto as não transacionais. Há uma exceção de que DML não transacional é permitido na mesma transação ou na mesma declaração como DML transacional, se todas as tabelas *não transacionais* forem temporárias.

`--enforce-gtid-consistency` só tem efeito se o registro binário ocorrer para uma declaração. Se o registro binário estiver desativado no servidor, ou se as declarações não forem escritas no log binário porque são removidas por um filtro, a consistência GTID não é verificada ou aplicada para as declarações que não são registradas.

Para mais informações, consulte a Seção 16.1.3.6, “Restrições à Replicação com GTIDs”.

Antes do MySQL 5.7.6, o booleano `enforce_gtid_consistency` era padrão para `OFF`. Para manter a compatibilidade com versões anteriores, no MySQL 5.7.6, a enumeração é padrão para `OFF`, e definir `--enforce-gtid-consistency` sem um valor é interpretado como definir o valor para `ON`. A variável também tem múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`, `2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em versões anteriores. Essas mudanças afetam o que é retornado pela variável. Usando `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, todos retornam a forma textual, não a forma numérica. Esta é uma mudança incompatível, pois `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e o Esquema de Informação.

* `gtid_executed`

  <table frame="box" rules="all" summary="Properties for gtid_executed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_executed</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

Quando usado com escopo global, esta variável contém uma representação do conjunto de todas as transações executadas no servidor e GTIDs que foram definidos por uma declaração `SET` `gtid_purged`. Isso é o mesmo que o valor da coluna `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` e `SHOW SLAVE STATUS`. O valor desta variável é um conjunto de GTIDs, consulte Conjuntos de GTIDs para mais informações.

Quando o servidor é iniciado, `@@GLOBAL.gtid_executed` é inicializado. Consulte `binlog_gtid_simple_recovery` para obter mais informações sobre como os registros binários são iterados para preencher `gtid_executed`. Os GTIDs são então adicionados ao conjunto à medida que as transações são executadas ou se qualquer declaração `SET` `gtid_purged` é executada.

O conjunto de transações que podem ser encontradas nos registros binários em qualquer momento é igual a `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; ou seja, todas as transações no registro binário que ainda não foram eliminadas.

A emissão de `RESET MASTER` faz com que o valor global (mas não o valor da sessão) desta variável seja redefinido para uma string vazia. Os GTIDs não são removidos de outro modo a partir deste conjunto, exceto quando o conjunto é limpo devido a `RESET MASTER`.

Antes do MySQL 5.7.7, essa variável também poderia ser usada com escopo de sessão, onde continha uma representação do conjunto de transações que são escritas no cache na sessão atual. O escopo de sessão foi descontinuado no MySQL 5.7.7.

* `gtid_executed_compression_period`

  <table frame="box" rules="all" summary="Properties for gtid_executed_compression_period"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-executed-compression-period=#</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_executed_compression_period</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Compressa a tabela `mysql.gtid_executed` cada vez que esse número de transações tenha sido processado. Quando o registro binário está habilitado no servidor, esse método de compressão não é usado, e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do registro binário. Quando o registro binário está desabilitado no servidor, o thread de compressão dorme até que o número especificado de transações tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor dessa variável do sistema para 0 significa que o thread nunca acorda, então esse método de compressão explícito não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

Veja a Tabela de Compressão de Compressão de Gtid_executed para mais informações.

Essa variável foi adicionada na versão 5.7.5 do MySQL como `executed_gtids_compression_period` e renomeada na versão 5.7.6 do MySQL para `gtid_executed_compression_period`.

* `gtid_mode`

  <table frame="box" rules="all" summary="Properties for gtid_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-mode=MODE</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code><code>OFF_PERMISSIVE</code><code>ON_PERMISSIVE</code><code>ON</code></td> </tr></tbody></table>

Controla se o registro baseado em GTID está habilitado e que tipo de transações os registros podem conter. Antes do MySQL 5.7.6, essa variável era somente de leitura e era definida usando `--gtid-mode` apenas na inicialização do servidor. Antes do MySQL 5.7.5, iniciar o servidor com `--gtid-mode=ON` exigia que o servidor também fosse iniciado com as opções `--log-bin` e `--log-slave-updates`. A partir do MySQL 5.7.5, essa não é mais uma exigência. Veja a tabela mysql.gtid_executed.

O MySQL 5.7.6 permite que essa variável seja definida dinamicamente. Você deve ter privilégios suficientes para definir variáveis de sistema global. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”. `enforce_gtid_consistency` deve ser definido como `ON` antes de poder definir `gtid_mode=ON`. Antes de modificar essa variável, consulte a Seção 16.1.4, “Mudando os Modos de Replicação em Servidores Online”.

As transações registradas no MySQL 5.7.6 e superior podem ser anônimas ou usar GTIDs. As transações anônimas dependem de um arquivo de registro binário e posição para identificar transações específicas. As transações GTID têm um identificador único que é usado para referenciar transações. Os modos `OFF_PERMISSIVE` e `ON_PERMISSIVE` adicionados no MySQL 5.7.6 permitem uma mistura desses tipos de transações na topologia. Os diferentes modos são agora:

+ `OFF`: As novas e as transações replicadas devem ser anônimas.

+ `OFF_PERMISSIVE`: Novas transações são anônimas. Transações replicadas podem ser anônimas ou transações GTID.

+ `ON_PERMISSIVE`: Novas transações são transações GTID. Transações replicadas podem ser anônimas ou transações GTID.

+ `ON`: As novas e as transações replicadas devem ser transações GTID.

As mudanças de um valor para outro só podem ser feitas de forma gradual. Por exemplo, se `gtid_mode` atualmente está definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

Em MySQL 5.7.6 e superior, os valores de `gtid_purged` e `gtid_executed` são persistentes, independentemente do valor de `gtid_mode`. Portanto, mesmo após alterar o valor de `gtid_mode`, essas variáveis contêm os valores corretos. Em MySQL 5.7.5 e versões anteriores, os valores de `gtid_purged` e `gtid_executed` não são persistentes, enquanto `gtid_mode=OFF`. Portanto, após alterar `gtid_mode` para `OFF`, uma vez que todos os logs binários contendo GTIDs são limpos, os valores dessas variáveis são perdidos.

* `gtid_next`

  <table frame="box" rules="all" summary="Properties for gtid_next"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_next</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AUTOMATIC</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTOMATIC</code><code>ANONYMOUS</code><code>&lt;UUID&gt;:&lt;NUMBER&gt;</code></td> </tr></tbody></table>

Essa variável é usada para especificar se e como o próximo GTID é obtido.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

`gtid_next` pode assumir qualquer um dos seguintes valores:

+ `AUTOMATIC`: Use o próximo ID de transação global gerado automaticamente.

+ `ANONYMOUS`: As transações não possuem identificadores globais e são identificadas apenas por arquivo e posição.

+ Um ID de transação global no formato *`UUID`*:*`NUMBER`*.

Exatamente quais das opções acima são válidas depende da configuração de `gtid_mode`, veja a Seção 16.1.4.1, “Conceitos de Modo de Replicação” para mais informações. A configuração desta variável não tem efeito se `gtid_mode` é `OFF`.

Depois que essa variável tiver sido definida para *`UUID`*:*`NUMBER`*, e uma transação tiver sido comprometida ou revertida, uma declaração explícita de `SET GTID_NEXT` deve ser emitida novamente antes de qualquer outra declaração.

Em MySQL 5.7.5 e superior, `DROP TABLE` ou `DROP TEMPORARY TABLE` falha com um erro explícito quando usado em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando motores de armazenamento transacionais com tabelas temporárias usando motores de armazenamento não transacionais. Antes do MySQL 5.7.5, quando GTIDs estavam habilitados, mas `gtid_next` não era `AUTOMATIC`, `DROP TABLE` não funcionava corretamente quando usado com qualquer uma dessas combinações de tabelas. (Bug #17620053)

Em MySQL 5.7.1, não é possível executar nenhuma das declarações `CHANGE MASTER TO`, `START SLAVE`, `STOP SLAVE`, `REPAIR TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE SERVER`, `ALTER SERVER`, `DROP SERVER`, `CACHE INDEX`, `LOAD INDEX INTO CACHE`, `FLUSH` ou `RESET` quando `gtid_next` está definido para qualquer valor diferente de `AUTOMATIC`; nesses casos, a declaração falha com um erro. Tais declarações não são *desativadas* em MySQL 5.7.2 e versões posteriores. (Bug #16062608, Bug #16715809, Bug #69045) (Bug #16062608)

* `gtid_owned`

  <table frame="box" rules="all" summary="Properties for gtid_owned"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_owned</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

Essa variável somente de leitura é utilizada principalmente para uso interno. Seu conteúdo depende de seu escopo.

+ Quando usado com escopo global, `gtid_owned` contém uma lista de todos os GTIDs que estão atualmente em uso no servidor, com os IDs dos threads que os possuem. Essa variável é principalmente útil para uma replica multi-thread para verificar se uma transação já está sendo aplicada em outro thread. Um thread aplicando a propriedade de um GTID de uma transação o tempo todo que está processando a transação, então `@@global.gtid_owned` mostra o GTID e o proprietário durante a duração do processamento. Quando uma transação foi comprometida (ou revertida), o thread aplicando a propriedade do GTID libera a propriedade do GTID.

+ Quando usado com escopo de sessão, `gtid_owned` contém um único GTID que atualmente é usado e pertence a esta sessão. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente explicitamente atribuiu um GTID para a transação, definindo `gtid_next`. Neste caso, `@@session.gtid_owned` exibe o GTID o tempo todo que o cliente está processando a transação, até que a transação tenha sido comprometida (ou desfeita). Quando o cliente terminou de processar a transação, a variável é limpa. Se `gtid_next=AUTOMATIC` for usado para a sessão, `gtid_owned` é preenchido apenas brevemente durante a execução da declaração de compromisso para a transação, portanto, não pode ser observado a partir da sessão em questão, embora seja listado se `@@global.gtid_owned` for lido no ponto certo. Se você tem a necessidade de rastrear os GTIDs que são manipulados por um cliente em uma sessão, você pode habilitar o rastreador de estado de sessão controlado pela variável de sistema `session_track_gtids`.

* `gtid_purged`

  <table frame="box" rules="all" summary="Properties for gtid_purged"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_purged</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

O valor global da variável de sistema `gtid_purged` (`@@GLOBAL.gtid_purged`) é um conjunto de GTID que consiste nos GTID de todas as transações que foram comprometidas no servidor, mas que não existem em nenhum arquivo de registro binário no servidor. `gtid_purged` é um subconjunto de `gtid_executed`. As seguintes categorias de GTID estão em `gtid_purged`:

+ GTIDs de transações replicadas que foram comprometidas com registro binário desativado na replica.

+ GTIDs das transações que foram escritas em um arquivo de registro binário que agora foi apagado.

+ GTIDs que foram adicionados explicitamente ao conjunto pela declaração `SET @@GLOBAL.gtid_purged`.

Quando o servidor é iniciado ou reiniciado, o valor global de `gtid_purged` é inicializado com um conjunto de GTIDs. Para obter informações sobre como este conjunto de GTIDs é calculado, consulte a variável de sistema `gtid_purged`. Se houver logs binários do MySQL 5.7.7 ou versões anteriores no servidor, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor para produzir a computação correta. Consulte a descrição de `binlog_gtid_simple_recovery` para obter detalhes das situações em que essa configuração é necessária.

A emissão de `RESET MASTER` faz com que o valor de `gtid_purged` seja redefinido para uma string vazia.

Você pode definir o valor de `gtid_purged` para registrar no servidor que as transações em um determinado conjunto de GTID foram aplicadas, embora elas não existam em nenhum registro binário no servidor. Um caso de uso desse recurso é quando você está restaurando um backup de um ou mais bancos de dados em um servidor, mas não tem os registros binários relevantes que contêm as transações no servidor.

Importante

Os GTIDs estão disponíveis apenas em uma instância do servidor até o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado a 63, menos 1). Se você definir o valor de `gtid_purged` para um número que se aproxime desse limite, os commits subsequentes podem fazer com que o servidor se esgote de GTIDs e tome a ação especificada por `binlog_error_action`.

Em MySQL 5.7, é possível atualizar o valor de `gtid_purged` apenas quando `gtid_executed` é uma string vazia, e, portanto, `gtid_purged` é uma string vazia. Este é o caso quando a replicação não foi iniciada anteriormente, ou quando a replicação não usou GTIDs anteriormente. Antes do MySQL 5.7.6, `gtid_purged` também era configurável apenas quando `gtid_mode=ON`. Em MySQL 5.7.6 e superior, `gtid_purged` é configurável independentemente do valor de `gtid_mode`.

Para substituir o valor de `gtid_purged` pelo conjunto de GTID especificado, use a seguinte declaração:

  ```sql
  SET @@GLOBAL.gtid_purged = 'gtid_set'
  ```

Nota

Se você estiver usando MySQL 5.7.7 ou anterior, após emitir uma declaração `SET @@GLOBAL.gtid_purged`, você pode precisar definir `binlog_gtid_simple_recovery=FALSE` no arquivo de configuração do servidor antes de reiniciar o servidor, caso contrário, `gtid_purged` pode ser calculado incorretamente. Consulte a descrição para `binlog_gtid_simple_recovery` para detalhes das situações em que essa configuração é necessária. Se todos os logs binários no servidor foram gerados usando MySQL 5.7.8 ou posterior e você está usando MySQL 5.7.8 ou posterior, `binlog_gtid_simple_recovery=TRUE` (que é o ajuste padrão de MySQL 5.7.7) pode ser usado com segurança sempre.

### 16.1.7 Tarefas comuns de administração de replicação

Uma vez que a replicação tenha sido iniciada, ela é executada sem exigir muita administração regular. Esta seção descreve como verificar o status da replicação e como pausar uma réplica.

#### 16.1.7.1 Verificar o estado da replicação

A tarefa mais comum ao gerenciar um processo de replicação é garantir que a replicação esteja ocorrendo e que não haja erros entre a replica e a fonte.

A declaração `SHOW SLAVE STATUS`, que você deve executar em cada réplica, fornece informações sobre a configuração e o status da conexão entre o servidor de réplica e o servidor de origem. A partir do MySQL 5.7, o Gerador de Desempenho tem tabelas de replicação que fornecem essas informações de uma forma mais acessível. Veja a Seção 25.12.11, “Tabelas de Replicação do Gerador de Desempenho”.

A declaração `SHOW STATUS` também forneceu algumas informações relacionadas especificamente a réplicas. A partir da versão 5.7.5 do MySQL, as seguintes variáveis de status que anteriormente eram monitoradas usando `SHOW STATUS` foram descontinuadas e transferidas para as tabelas de replicação do Schema de Desempenho:

* `Slave_retried_transactions`
* `Slave_last_heartbeat`
* `Slave_received_heartbeats`
* `Slave_heartbeat_period`
* `Slave_running`

As informações sobre o batimento cardíaco de replicação mostradas nas tabelas de replicação do Schema de Desempenho permitem verificar se a conexão de replicação está ativa, mesmo que a fonte não tenha enviado eventos para a replica recentemente. A fonte envia um sinal de batimento cardíaco para uma replica se não houver atualizações e nenhum evento não enviado no log binário por um período maior que o intervalo de batimento cardíaco. A configuração `MASTER_HEARTBEAT_PERIOD` na fonte (definida pela declaração `CHANGE MASTER TO`) especifica a frequência do batimento cardíaco, que é a metade do intervalo de tempo de espera da conexão para a replica (`slave_net_timeout`). A tabela do Schema de Desempenho `replication_connection_status` mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma replica e quantas senhas de batimento cardíaco ela recebeu.

Se você estiver usando a declaração `SHOW SLAVE STATUS` para verificar o status de uma réplica individual, a declaração fornece as seguintes informações:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: source1
                  Master_User: root
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000004
          Read_Master_Log_Pos: 931
               Relay_Log_File: replica1-relay-bin.000056
                Relay_Log_Pos: 950
        Relay_Master_Log_File: mysql-bin.000004
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 931
              Relay_Log_Space: 1365
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids: 0
```

Os campos-chave do relatório de status a serem examinados são:

* `Slave_IO_State`: O status atual da replica. Consulte a Seção 8.14.6, “Estados de E/S de Replicação Replica”, e a Seção 8.14.7, “Estados de E/S SQL de Replicação Replica”, para mais informações.

* `Slave_IO_Running`: Se a thread de E/S para leitura do log binário da fonte está em execução. Normalmente, você deseja que isso seja `Yes` a menos que você ainda não tenha iniciado a replicação ou a tenha interrompido explicitamente com `STOP SLAVE`.

* `Slave_SQL_Running`: Se o thread SQL para executar eventos no log de relé está em execução. Assim como o thread de E/S, isso normalmente deve ser `Yes`.

* `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelos threads de I/O e SQL ao processar o log de relé. Idealmente, esses devem estar em branco, indicando ausência de erros.

* `Seconds_Behind_Master`: O número de segundos que o thread de replicação SQL está atrasado no processamento do log binário da fonte. Um número elevado (ou um número crescente) pode indicar que a replica não consegue lidar com eventos da fonte de forma oportuna.

Um valor de 0 para `Seconds_Behind_Master` geralmente pode ser interpretado como indicando que a réplica alcançou a fonte, mas há alguns casos em que isso não é estritamente verdadeiro. Por exemplo, isso pode ocorrer se a conexão de rede entre a fonte e a réplica for interrompida, mas o thread de I/O de replicação ainda não notou isso — ou seja, `slave_net_timeout` ainda não passou.

É também possível que os valores transitórios para `Seconds_Behind_Master` não reflitam a situação com precisão. Quando o thread de replicação SQL alcança o I/O, `Seconds_Behind_Master` exibe 0; mas quando o thread de I/O de replicação ainda está em fila para um novo evento, `Seconds_Behind_Master` pode mostrar um valor grande até que o thread SQL termine a execução do novo evento. Isso é especialmente provável quando os eventos têm timestamps antigos; nesses casos, se você executar `SHOW SLAVE STATUS` várias vezes em um período relativamente curto, você pode ver esse valor mudar para frente e para trás repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura dos eventos do log binário da fonte e seu processamento no log de retransmissão:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no log binário da fonte que indicam até que ponto a thread de I/O de replicação leu eventos desse log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no log binário da fonte que indicam até onde o thread de replicação SQL executou os eventos recebidos desse log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no log de relevo da replica que indicam até onde o thread de SQL de replicação executou o log de relevo. Essas correspondem às coordenadas anteriores, mas são expressas nas coordenadas do log de relevo da replica, em vez das coordenadas do log binário da fonte.

Na fonte, você pode verificar o status das réplicas conectadas usando `SHOW PROCESSLIST` para examinar a lista de processos em execução. As conexões da réplica têm `Binlog Dump` no campo `Command`:

```sql
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

Para réplicas que foram iniciadas com a opção `--report-host` e estão conectadas à fonte, a declaração `SHOW SLAVE HOSTS` na fonte mostra informações básicas sobre as réplicas. A saída inclui o ID do servidor da réplica, o valor da opção `--report-host`, a porta de conexão e o ID da fonte:

```sql
mysql> SHOW SLAVE HOSTS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Master_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```

#### 16.1.7.2 Pausar a replicação na réplica

Você pode parar e iniciar a replicação na replica usando as declarações `STOP SLAVE` e `START SLAVE`.

Para parar o processamento do log binário da fonte, use `STOP SLAVE`:

```sql
mysql> STOP SLAVE;
```

Quando a replicação é interrompida, o thread de I/O de replicação para de ler eventos do log binário da fonte e de escrevê-los no log de relevo, e o thread de SQL de replicação para de ler eventos do log de relevo e de executá-los. Você pode pausar os threads de I/O e SQL de replicação individualmente, especificando o tipo de thread:

```sql
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
```

Para iniciar a execução novamente, use a declaração `START SLAVE`:

```sql
mysql> START SLAVE;
```

Para iniciar um determinado thread, especifique o tipo de thread:

```sql
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
```

Para uma replica que realiza atualizações apenas processando eventos da fonte, parar apenas o thread de replicação SQL pode ser útil se você quiser realizar um backup ou outra tarefa. O thread de I/O de replicação continua a ler eventos da fonte, mas eles não são executados. Isso facilita para a replica se atualizar quando você reiniciar o thread de replicação SQL.

Parar apenas a thread de I/O de replicação permite que os eventos no log de releio sejam executados pela thread de replicação SQL até o ponto em que o log de releio termina. Isso pode ser útil quando você deseja pausar a execução para acompanhar eventos já recebidos da fonte, quando deseja realizar administração na replica, mas também garantir que ela tenha processado todas as atualizações até um ponto específico. Esse método também pode ser usado para pausar a recepção de eventos na replica enquanto você realiza a administração na fonte. Parar a thread de I/O, mas permitir que a thread SQL seja executada, ajuda a garantir que não haja um grande acúmulo de eventos a serem executados quando a replicação for iniciada novamente.

#### 16.1.7.3 Saltar transações

Se a replicação parar devido a um problema com um evento em uma transação replicada, você pode retomar a replicação ignorando a transação falha na replica. Antes de ignorar uma transação, certifique-se de que o thread de I/O de replicação também esteja parado, assim como o thread de SQL de replicação.

Primeiro, você precisa identificar o evento replicado que causou o erro. Os detalhes do erro e a última transação aplicada com sucesso são registrados na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Você pode usar **mysqlbinlog** para recuperar e exibir os eventos que foram registrados na época do erro. Para obter instruções sobre como fazer isso, consulte a Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”). Alternativamente, você pode emitir `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte.

Antes de pular a transação e reiniciar a replica, verifique esses pontos:

* A transação que interrompeu a replicação veio de uma fonte desconhecida ou não confiável? Se sim, investigue a causa, caso haja alguma consideração de segurança que indique que a replica não deve ser reiniciada.

* A transação que parou a replicação precisa ser aplicada na replica? Se sim, faça as correções apropriadas e aplique a transação novamente, ou reconcile manualmente os dados na replica.

* A transação que parou a replicação precisa ser aplicada na fonte? Se não, desfaça a transação manualmente no servidor onde ela ocorreu originalmente.

Para pular a transação, escolha um dos seguintes métodos conforme apropriado:

* Quando GTIDs estão em uso (`gtid_mode` é `ON`), consulte a Seção 16.1.7.3.1, “Saltar Transações com GTIDs”.

* Quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), consulte a Seção 16.1.7.3.2, “Saltar Transações sem GTIDs”.

Para reiniciar a replicação após ignorar a transação, execute `START SLAVE`, com a cláusula `FOR CHANNEL`, se a replica for uma replica de múltiplas fontes.

##### 16.1.7.3.1 Ignorar transações com GTIDs

Quando os GTIDs estão em uso (`gtid_mode` é `ON`), o GTID para uma transação comprometida é persistido na replica, mesmo se o conteúdo da transação for filtrado. Esse recurso impede que uma replica retorne transações filtradas anteriormente quando se reconecte à fonte usando o autoposicionamento de GTID. Também pode ser usado para pular uma transação na replica, comprometendo uma transação vazia no lugar da transação falhando.

Se a transação falha gerar um erro em um thread de trabalho, você pode obter seu GTID diretamente do campo `APPLYING_TRANSACTION` na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Para ver qual transação é, execute `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte, e procure a saída em busca de uma transação precedida por esse GTID.

Quando você tiver avaliado a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), para ignorá-la, realize uma transação vazia na replica que tenha o mesmo GTID que a transação falha. Por exemplo:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

A presença dessa transação vazia na replica significa que, quando você emitir uma declaração `START SLAVE` para reiniciar a replicação, a replica usa a função de ignorar a transação falhando, porque ela vê que uma transação com esse GTID já foi aplicada. Se a replica for uma replica de múltiplas fontes, você não precisa especificar o nome do canal ao confirmar a transação vazia, mas você precisa especificar o nome do canal quando emitir `START SLAVE`.

Observe que, se o registro binário estiver em uso nesta réplica, a transação vazia entra no fluxo de replicação se a réplica se tornar uma fonte ou primária no futuro. Se você precisar evitar essa possibilidade, considere limpar e purgar os registros binários da réplica, como neste exemplo:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

O GTID da transação vazia é persistido, mas a própria transação é removida ao purgar os arquivos de log binário.

##### 16.1.7.3.2 Ignorar transações sem GTIDs

Para pular transações que falhem quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), você pode pular um número especificado de eventos emitindo uma declaração `SET GLOBAL sql_slave_skip_counter`. Alternativamente, você pode pular um evento ou eventos emitindo uma declaração `CHANGE MASTER TO` para avançar a posição do log binário da fonte.

Ao usar esses métodos, é importante entender que você não está necessariamente ignorando uma transação completa, como é sempre o caso com o método baseado em GTID descrito anteriormente. Esses métodos não baseados em GTID não estão cientes das transações como tal, mas operam em eventos. O log binário é organizado como uma sequência de grupos conhecidos como grupos de eventos, e cada grupo de eventos consiste em uma sequência de eventos.

* Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

* Para tabelas não transacionais, um grupo de eventos corresponde a uma única instrução SQL.

Uma única transação pode conter alterações em tabelas tanto transacionais quanto não transacionais.

Quando você usa uma declaração `SET GLOBAL sql_slave_skip_counter` para pular eventos e a posição resultante estiver no meio de um grupo de eventos, a replicação continua a pular eventos até atingir o final do grupo. A execução então começa com o próximo grupo de eventos. A declaração `CHANGE MASTER TO` não tem essa função, então você deve ser cuidadoso para identificar a localização correta para reiniciar a replicação no início de um grupo de eventos. No entanto, ao usar `CHANGE MASTER TO`, você não precisa contar os eventos que precisam ser ignorados, como faria com uma `SET GLOBAL sql_slave_skip_counter`, e, em vez disso, você pode simplesmente especificar a localização para reiniciar.

###### 16.1.7.3.2.1 Ignorar transações com `SET GLOBAL sql_slave_skip_counter`

Quando você tiver avaliado a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), conte o número de eventos que você precisa ignorar. Um evento normalmente corresponde a uma declaração SQL no log binário, mas observe que as declarações que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` contam como dois eventos no log binário.

Se você quiser pular a transação completa, pode contar os eventos até o final da transação, ou simplesmente pular o grupo de eventos relevante. Lembre-se de que, com `SET GLOBAL sql_slave_skip_counter`, a replica continua a pular até o final de um grupo de eventos. Certifique-se de não pular muito para frente e vá para o próximo grupo de eventos ou transação, pois isso faz com que ele também seja ignorado.

Emita a declaração `SET` conforme a seguir, onde *`N`* é o número de eventos da fonte a ser ignorado:

```sql
SET GLOBAL sql_slave_skip_counter = N
```

Esta declaração não pode ser emitida se `gtid_mode=ON` estiver definido ou se as threads de replicação estiverem em execução.

A declaração `SET GLOBAL sql_slave_skip_counter` não tem efeito imediato. Quando você emitir a declaração `START SLAVE` da próxima vez após esta declaração `SET`, o novo valor da variável do sistema `sql_slave_skip_counter` é aplicado e os eventos são ignorados. A declaração `START SLAVE` também define automaticamente o valor da variável do sistema de volta a

0. Se a réplica for uma réplica de várias fontes, quando emitir a declaração `START SLAVE`, a cláusula `FOR CHANNEL` é necessária. Certifique-se de nomear o canal correto, caso contrário, os eventos serão ignorados no canal errado.

###### 16.1.7.3.2.2 Ignorar transações com `CHANGE MASTER TO`

Quando você tiver avaliado a transação falha para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), identifique as coordenadas (arquivo e posição) no log binário da fonte que representam uma posição adequada para reiniciar a replicação. Isso pode ser o início do grupo de eventos após o evento que causou o problema, ou o início da próxima transação. O thread de I/O de replicação começa a ler a partir da fonte nessas coordenadas na próxima vez que o thread começa, ignorando o evento falha. Certifique-se de que você identificou a posição com precisão, porque essa declaração não leva em conta grupos de eventos.

Emita a declaração `CHANGE MASTER TO` da seguinte forma, onde *`source_log_name`* é o arquivo de registro binário que contém a posição de reinício, e *`source_log_pos`* é o número que representa a posição de reinício conforme declarado no arquivo de registro binário:

```sql
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;
```

Se a réplica for uma réplica de várias fontes, você deve usar a cláusula `FOR CHANNEL` para nomear o canal apropriado na declaração `CHANGE MASTER TO`.

Esta declaração não pode ser emitida se `MASTER_AUTO_POSITION=1` estiver definida, ou se as threads de replicação estiverem em execução. Se você precisar usar esse método de pular uma transação quando `MASTER_AUTO_POSITION=1` estiver normalmente definida, você pode alterar o ajuste para `MASTER_AUTO_POSITION=0` enquanto emite a declaração, e depois alterá-lo novamente posteriormente. Por exemplo:

```sql
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;
```
