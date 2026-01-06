#### 16.1.2.5 Configurando Replicas

As seções a seguir descrevem como configurar réplicas. Antes de prosseguir, certifique-se de que você tem:

- Configurou a fonte com as propriedades de configuração necessárias. Consulte Seção 16.1.2.1, "Definindo a configuração da fonte de replicação".

- Obteve as informações de status da fonte ou uma cópia do arquivo de índice de log binário da fonte, feito durante um desligamento para o instantâneo de dados. Consulte Seção 16.1.2.3, “Obtendo as coordenadas de log binário da fonte de replicação”.

- Na fonte, liberou o bloqueio de leitura:

  ```sql
  mysql> UNLOCK TABLES;
  ```

##### 16.1.2.5.1 Configuração de replicação

Cada replica deve ter um ID de servidor único, conforme especificado pela variável de sistema `server_id`. Se você estiver configurando múltiplas replicas, cada uma deve ter um valor único de `server_id` que difere do do servidor de origem e de qualquer outra replica. Se o ID de servidor da replica ainda não estiver definido ou o valor atual entrar em conflito com o valor que você escolheu para o servidor de origem ou outra replica, você deve alterá-lo. Com o valor padrão de `server_id` de 0, uma replica se recusa a se conectar a um servidor de origem.

Você pode alterar o valor de `server_id` dinamicamente emitindo uma declaração como esta:

```sql
SET GLOBAL server_id = 21;
```

Se o valor padrão do `server_id` de 0 foi definido anteriormente, você deve reiniciar o servidor para inicializar a replica com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID do servidor, a menos que você faça outras alterações de configuração que o exijam. Por exemplo, se o registro binário foi desativado no servidor e você deseja ativá-lo para sua replica, um reinício do servidor é necessário para ativá-lo.

Se você estiver desligando o servidor de replicação, pode editar a seção `[mysqld]` do arquivo de configuração para especificar um ID de servidor único. Por exemplo:

```sql
[mysqld]
server-id=21
```

Uma réplica não precisa ter o registro binário habilitado para que a replicação ocorra. No entanto, o registro binário em uma réplica significa que o log binário da réplica pode ser usado para backups de dados e recuperação em caso de falha. Réplicas que têm o registro binário habilitado também podem ser usadas como parte de uma topologia de replicação mais complexa. Se você deseja habilitar o registro binário em uma réplica, use a opção `log-bin` na seção `[mysqld]` do arquivo de configuração. Um reinício do servidor é necessário para iniciar o registro binário em um servidor que não o usou anteriormente.

##### 16.1.2.5.2. Definir a configuração de fonte no replicador

Para configurar a replica para se comunicar com a fonte de replicação, configure a replica com as informações de conexão necessárias. Para fazer isso, execute a seguinte instrução na replica, substituindo os valores da opção pelos valores reais relevantes para o seu sistema:

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

A declaração `CHANGE MASTER TO` também possui outras opções. Por exemplo, é possível configurar a replicação segura usando SSL. Para uma lista completa das opções e informações sobre o comprimento máximo permitido para as opções de valor de string, consulte Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.

Os próximos passos dependem de você ter dados existentes para importar na replica ou não. Consulte Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados” para obter mais informações. Escolha um dos seguintes:

- Se você não tiver uma instantânea de um banco de dados a ser importado, consulte Seção 16.1.2.5.3, “Configurando a replicação entre uma nova fonte e réplicas”.

- Se você tiver uma instantânea de um banco de dados a ser importado, consulte Seção 16.1.2.5.4, “Configurando a Replicação com Dados Existentes”.

##### 16.1.2.5.3 Configurando a replicação entre uma nova fonte e réplicas

Quando não houver uma cópia de um banco de dados anterior para importar, configure a replicação para começar a replicar a partir da nova fonte.

Para configurar a replicação entre uma fonte e uma nova réplica:

1. Inicie a replica e conecte-se a ela.
2. Execute a declaração `CHANGE MASTER TO` para definir a configuração da fonte. Veja Seção 16.1.2.5.2, “Definindo a Configuração da Fonte no Replica”.

Realize essas etapas de configuração em cada réplica.

Esse método também pode ser usado se você estiver configurando novos servidores, mas tiver um dump existente dos bancos de dados de um servidor diferente que deseja carregar na configuração de replicação. Ao carregar os dados em uma nova fonte, os dados são replicados automaticamente para as réplicas.

Se você estiver configurando um novo ambiente de replicação usando os dados de um servidor de banco de dados existente para criar uma nova fonte, execute o arquivo de dump gerado a partir desse servidor na nova fonte. As atualizações do banco de dados são automaticamente propagadas para as réplicas:

```sql
$> mysql -h master < fulldb.dump
```

##### 16.1.2.5.4 Configurando a replicação com dados existentes

Ao configurar a replicação com dados existentes, transfira o instantâneo da fonte para a replica antes de iniciar a replicação. O processo de importação de dados para a replica depende de como você criou o instantâneo dos dados na fonte.

Siga este procedimento para configurar a replicação com dados existentes:

1. Importe os dados para a replica usando um dos seguintes métodos:

   1. Se você usou **mysqldump**, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`. Em seguida, importe o arquivo de dump:

      ```sql
      $> mysql < fulldb.dump
      ```

   2. Se você criou um instantâneo usando os arquivos de dados brutos, extraia os arquivos de dados para o diretório de dados da replica. Por exemplo:

      ```sql
      $> tar xvf dbdump.tar
      ```

      Você pode precisar definir permissões e propriedade dos arquivos para que o servidor de replicação possa acessá-los e modificá-los. Em seguida, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`.

2. Configure a replica com as coordenadas de replicação da fonte. Isso informa à replica o arquivo de log binário e a posição dentro do arquivo onde a replicação deve começar. Além disso, configure a replica com as credenciais de login e o nome do host da fonte. Para mais informações sobre a declaração `CHANGE MASTER TO`, consulte Seção 16.1.2.5.2, “Definindo a Configuração da Fonte na Replica”.

3. Comece os threads de replicação:

   ```sql
   mysql> START SLAVE;
   ```

Depois de realizar este procedimento, a réplica se conecta à fonte e replica todas as atualizações que ocorreram na fonte desde que o instantâneo foi feito.

Se a variável de sistema `server_id` para a fonte não estiver configurada corretamente, as réplicas não poderão se conectar a ela. Da mesma forma, se você não tiver configurado corretamente o `server_id` para a réplica, você receberá o seguinte erro no log de erro da réplica:

```sql
Warning: You should set server-id to a non-0 value if master_host
is set; we will force server id to 2, but this MySQL server will
not act as a slave.
```

Você também encontrará mensagens de erro no log de erro da replica se ela não conseguir replicar por qualquer outro motivo.

A replica armazena informações sobre a fonte configurada em seu repositório de metadados de conexão. O repositório de metadados de conexão pode estar na forma de arquivos ou uma tabela, conforme determinado pelo valor definido para a variável de sistema `master_info_repository`. Quando uma replica é executada com `master_info_repository=FILE`, dois arquivos são armazenados no diretório de dados, chamados `master.info` e `relay-log.info`. Se, em vez disso, for definido `master_info_repository=TABLE`, essas informações são salvas na tabela `master_slave_info` no banco de dados `mysql`. Em qualquer caso, *não* remova ou edite os arquivos ou a tabela. Sempre use a declaração `[ALTER MASTER TO]`]\(change-master-to.html) para alterar os parâmetros de replicação. A replica pode usar os valores especificados na declaração para atualizar os arquivos de status automaticamente. Consulte Seção 16.2.4, “Repositórios de Metadados de Relógio de Relay e Replicação” para obter mais informações.

Nota

O conteúdo do repositório de metadados de conexão substitui algumas das opções do servidor especificadas na linha de comando ou no `my.cnf`. Consulte Seção 16.1.6, “Opções e variáveis de replicação e registro binário” para obter mais detalhes.

Um único instantâneo da fonte é suficiente para múltiplas réplicas. Para configurar réplicas adicionais, use o mesmo instantâneo da fonte e siga a parte da réplica do procedimento descrito anteriormente.
