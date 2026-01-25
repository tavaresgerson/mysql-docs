#### 16.1.2.5 Configurando Replicas

As seções a seguir descrevem como configurar replicas. Antes de prosseguir, certifique-se de ter:

* Configurado o source com as propriedades de configuração necessárias. Consulte [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration").

* Obtido as informações de status do source, ou uma cópia do arquivo index do Binary Log do source, feita durante um desligamento para o snapshot de dados. Consulte [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

* No source, liberado o Lock de leitura:

```sql
  mysql> UNLOCK TABLES;
  ```

##### 16.1.2.5.1 Configurando a Replica

Cada replica deve ter um Server ID exclusivo, conforme especificado pela variável de sistema [`server_id`](replication-options.html#sysvar_server_id). Se você estiver configurando múltiplas replicas, cada uma deve ter um valor de [`server_id`](replication-options.html#sysvar_server_id) exclusivo que seja diferente do Server ID do source e de qualquer outra replica. Se o Server ID da replica ainda não estiver definido, ou se o valor atual entrar em conflito com o valor que você escolheu para o servidor source ou outra replica, você deve alterá-lo. Com o valor padrão de [`server_id`](replication-options.html#sysvar_server_id) igual a 0, uma replica se recusa a conectar-se a um source.

Você pode alterar o valor de [`server_id`](replication-options.html#sysvar_server_id) dinamicamente emitindo uma instrução como esta:

```sql
SET GLOBAL server_id = 21;
```

Se o valor padrão de [`server_id`](replication-options.html#sysvar_server_id) igual a 0 foi definido anteriormente, você deve reiniciar o servidor para inicializar a replica com seu novo Server ID diferente de zero. Caso contrário, não é necessário reiniciar o servidor ao alterar o Server ID, a menos que você faça outras alterações de configuração que o exijam. Por exemplo, se o Binary Logging estava desativado no servidor e você deseja ativá-lo para sua replica, é necessário reiniciar o servidor para habilitar isso.

Se você estiver desligando o servidor replica, pode editar a seção `[mysqld]` do arquivo de configuração para especificar um Server ID exclusivo. Por exemplo:

```sql
[mysqld]
server-id=21
```

Não é obrigatório que uma replica tenha o Binary Logging habilitado para que a replicação ocorra. No entanto, o Binary Logging em uma replica significa que o Binary Log da replica pode ser usado para backups de dados e Crash Recovery. Replicas que têm o Binary Logging habilitado também podem ser usadas como parte de uma topologia de replicação mais complexa. Se você deseja habilitar o Binary Logging em uma replica, use a opção `log-bin` na seção `[mysqld]` do arquivo de configuração. É necessário reiniciar o servidor para iniciar o Binary Logging em um servidor que não o utilizava anteriormente.

##### 16.1.2.5.2 Configurando o Source na Replica

Para configurar a replica para se comunicar com o source para replicação, configure a replica com as informações de conexão necessárias. Para fazer isso, execute a seguinte instrução na replica, substituindo os valores das opções pelos valores reais relevantes para o seu sistema:

```sql
mysql> CHANGE MASTER TO
    ->     MASTER_HOST='source_host_name',
    ->     MASTER_USER='replication_user_name',
    ->     MASTER_PASSWORD='replication_password',
    ->     MASTER_LOG_FILE='recorded_log_file_name',
    ->     MASTER_LOG_POS=recorded_log_position;
```

Note

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor MySQL source usando TCP/IP.

A instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") também possui outras opções. Por exemplo, é possível configurar uma replicação segura usando SSL. Para obter uma lista completa de opções e informações sobre o comprimento máximo permitido para as opções de valor string, consulte [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

Os próximos passos dependem se você tem dados existentes para importar para a replica ou não. Consulte [Section 16.1.2.4, “Choosing a Method for Data Snapshots”](replication-snapshot-method.html "16.1.2.4 Choosing a Method for Data Snapshots") para mais informações. Escolha uma das seguintes opções:

* Se você não tiver um snapshot de um Database para importar, consulte [Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas").

* Se você tiver um snapshot de um Database para importar, consulte [Section 16.1.2.5.4, “Setting Up Replication with Existing Data”](replication-setup-replicas.html#replication-howto-existingdata "16.1.2.5.4 Setting Up Replication with Existing Data").

##### 16.1.2.5.3 Configurando a Replicação entre um Novo Source e Replicas

Quando não há um snapshot de um Database anterior para importar, configure a replica para iniciar a replicação a partir do novo source.

Para configurar a replicação entre um source e uma nova replica:

1. Inicie a replica e conecte-se a ela.
2. Execute uma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para definir a configuração do source. Consulte [Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

Execute estas etapas de configuração em cada replica.

Este método também pode ser usado se você estiver configurando novos servidores, mas tiver um Dump de Databases existentes de um servidor diferente que deseja carregar em sua configuração de replicação. Ao carregar os dados em um novo source, os dados são automaticamente replicados para as replicas.

Se você estiver configurando um novo ambiente de replicação usando dados de um servidor Database existente diferente para criar um novo source, execute o arquivo dump gerado a partir desse servidor no novo source. As atualizações do Database são automaticamente propagadas para as replicas:

```sql
$> mysql -h master < fulldb.dump
```

##### 16.1.2.5.4 Configurando a Replicação com Dados Existentes

Ao configurar a replicação com dados existentes, transfira o snapshot do source para a replica antes de iniciar a replicação. O processo para importação de dados para a replica depende de como você criou o snapshot dos dados no source.

Siga este procedimento para configurar a replicação com dados existentes:

1. Importe os dados para a replica usando um dos seguintes métodos:

   a. Se você usou [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), inicie o servidor replica, garantindo que a replicação não comece usando a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start). Em seguida, importe o arquivo dump:

      ```sql
      $> mysql < fulldb.dump
      ```

   b. Se você criou um snapshot usando os arquivos de dados brutos, extraia os arquivos de dados para o Data Directory da sua replica. Por exemplo:

      ```sql
      $> tar xvf dbdump.tar
      ```

      Pode ser necessário definir permissões e propriedade nos arquivos para que o servidor replica possa acessá-los e modificá-los. Em seguida, inicie o servidor replica, garantindo que a replicação não comece usando a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start).

2. Configure a replica com as coordenadas de replicação do source. Isso informa à replica o arquivo Binary Log e a posição dentro do arquivo onde a replicação precisa começar. Além disso, configure a replica com as credenciais de login e o nome de host do source. Para obter mais informações sobre a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") necessária, consulte [Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

3. Inicie os Replication Threads:

```sql
   mysql> START SLAVE;
   ```

Depois de executar este procedimento, a replica se conecta ao source e replica quaisquer atualizações que tenham ocorrido no source desde que o snapshot foi tirado.

Se a variável de sistema [`server_id`](replication-options.html#sysvar_server_id) para o source não estiver configurada corretamente, as replicas não poderão se conectar a ele. Da mesma forma, se você não configurou [`server_id`](replication-options.html#sysvar_server_id) corretamente para a replica, você receberá o seguinte erro no Error Log da replica:

```sql
Warning: You should set server-id to a non-0 value if master_host
is set; we will force server id to 2, but this MySQL server will
not act as a slave.
```

Você também encontrará mensagens de erro no Error Log da replica se ela não conseguir replicar por qualquer outro motivo.

A replica armazena informações sobre o source configurado em seu Repositório de Metadados de Conexão (Connection Metadata Repository). O Repositório de Metadados de Conexão pode estar na forma de arquivos ou uma tabela, conforme determinado pelo valor definido para a variável de sistema [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository). Quando uma replica é executada com [`master_info_repository=FILE`](replication-options-replica.html#sysvar_master_info_repository), dois arquivos são armazenados no Data Directory, nomeados `master.info` e `relay-log.info`. Se [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository) for usado, esta informação será salva na tabela `master_slave_info` no Database `mysql`. Em ambos os casos, *não* remova ou edite os arquivos ou a tabela. Sempre use a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para alterar os parâmetros de replicação. A replica pode usar os valores especificados na instrução para atualizar automaticamente os arquivos de status. Consulte [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories"), para mais informações.

Note

O conteúdo do Repositório de Metadados de Conexão substitui algumas das opções de servidor especificadas na linha de comando ou em `my.cnf`. Consulte [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables"), para mais detalhes.

Um único snapshot do source é suficiente para múltiplas replicas. Para configurar replicas adicionais, use o mesmo snapshot do source e siga a parte do procedimento descrita acima para a replica.
