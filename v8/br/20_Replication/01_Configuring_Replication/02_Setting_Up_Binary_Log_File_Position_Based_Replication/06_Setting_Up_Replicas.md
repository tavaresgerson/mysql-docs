#### 19.1.2.6 Configurando Replicas

As seções a seguir descrevem como configurar réplicas. Antes de prosseguir, certifique-se de que você tem:

- Configurou a fonte com as propriedades de configuração necessárias. Consulte a Seção 19.1.2.1, “Configurando a configuração da fonte de replicação”.

- Obteve as informações de status da fonte ou uma cópia do arquivo de índice de log binário da fonte, feito durante um desligamento para o instantâneo de dados. Consulte a Seção 19.1.2.4, “Obtenção das coordenadas do log binário de origem da replicação”.

- Na fonte, liberou o bloqueio de leitura:

  ```
  mysql> UNLOCK TABLES;
  ```

- Na réplica, editei a configuração do MySQL. Veja a Seção 19.1.2.2, “Definindo a configuração da réplica”.

Os próximos passos dependem de você ter dados existentes para importar na replica ou não. Consulte a Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”, para obter mais informações. Escolha um dos seguintes:

- Se você não tiver uma instantânea de um banco de dados a ser importado, consulte a Seção 19.1.2.6.1, “Configurando a Replicação com Nova Fonte e Replicas”.

- Se você tiver uma instantânea de um banco de dados a ser importado, consulte a Seção 19.1.2.6.2, “Configurando a Replicação com Dados Existentes”.

##### 19.1.2.6.1 Configurando a replicação com nova fonte e réplicas

Quando não houver uma cópia de um banco de dados anterior para importar, configure a replicação para começar a replicar a partir da nova fonte.

Para configurar a replicação entre uma fonte e uma nova réplica:

1. Inicie a replicação.
2. Execute uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` na réplica para definir a configuração de origem. Veja a Seção 19.1.2.7, “Definindo a Configuração de Origem na Réplica”.

Realize essas etapas de configuração de replicação em cada replica.

Esse método também pode ser usado se você estiver configurando novos servidores, mas tiver um dump existente dos bancos de dados de um servidor diferente que deseja carregar na configuração de replicação. Ao carregar os dados em uma nova fonte, os dados são replicados automaticamente para as réplicas.

Se você estiver configurando um novo ambiente de replicação usando os dados de um servidor de banco de dados existente para criar uma nova fonte, execute o arquivo de dump gerado a partir desse servidor na nova fonte. As atualizações do banco de dados são automaticamente propagadas para as réplicas:

```
$> mysql -h source < fulldb.dump
```

##### 19.1.2.6.2 Configurando a replicação com dados existentes

Ao configurar a replicação com dados existentes, transfira o instantâneo da fonte para a replica antes de iniciar a replicação. O processo de importação de dados para a replica depende de como você criou o instantâneo dos dados na fonte.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Nota

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver eventos agendados, certifique-se de que esses eventos sejam desabilitados na nova replica antes de iniciá-la. Se um evento for executado na nova replica e já tiver sido executado na fonte, a operação duplicada causa um erro. O Agendamento de Eventos é controlado pela variável de sistema `event_scheduler`, que tem o valor padrão `ON` a partir do MySQL 8.0, então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a instrução `ALTER EVENT` para definir eventos individuais para `DISABLE` ou `DISABLE ON SLAVE` para impedir que sejam executados na nova replica. Você pode listar os eventos em um servidor usando a instrução `SHOW` ou a tabela do Schema de Informações `EVENTS`. Para obter mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa para criar uma nova réplica dessa maneira, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma réplica existente para um clone. Para obter instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Siga este procedimento para configurar a replicação com dados existentes:

1. Se você usou o plugin de clone do MySQL Server para criar um clone a partir de uma replica existente (veja a Seção 7.6.7.7, “Clonagem para Replicação”), os dados já foram transferidos. Caso contrário, importe os dados para a replica usando um dos seguintes métodos.

   1. Se você usou o **mysqldump**, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`. Em seguida, importe o arquivo de dump:

      ```
      $> mysql < fulldb.dump
      ```

   2. Se você criou um instantâneo usando os arquivos de dados brutos, extraia os arquivos de dados para o diretório de dados da replica. Por exemplo:

      ```
      $> tar xvf dbdump.tar
      ```

      Você pode precisar definir permissões e propriedade dos arquivos para que o servidor de replicação possa acessá-los e modificá-los. Em seguida, inicie o servidor de replicação, garantindo que a replicação não seja iniciada usando a opção `--skip-slave-start` ou, a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`.

2. Configure a replica com as coordenadas de replicação da fonte. Isso informa à replica o arquivo de log binário e a posição dentro do arquivo onde a replicação deve começar. Além disso, configure a replica com as credenciais de login e o nome do host da fonte. Para mais informações sobre a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` necessária, consulte a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

3. Inicie os threads de replicação emitindo uma instrução `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`).

Após realizar este procedimento, a réplica se conecta à fonte e replica todas as atualizações que ocorreram na fonte desde que o instantâneo foi feito. Mensagens de erro são emitidas no log de erro da réplica se ela não conseguir replicar por qualquer motivo.

A réplica usa informações registradas em seu repositório de metadados de conexão e repositório de metadados de aplicação para acompanhar quanto do log binário da fonte foi processado. A partir do MySQL 8.0, por padrão, esses repositórios são tabelas chamadas `slave_master_info` e `slave_relay_log_info` no banco de dados `mysql`. *Não* remova ou edite essas tabelas a menos que você saiba exatamente o que está fazendo e entenda completamente as implicações. Mesmo nesse caso, é preferível que você use a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para alterar os parâmetros de replicação. A réplica usa os valores especificados na declaração para atualizar automaticamente os repositórios de metadados de replicação. Consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”, para obter mais informações.

Nota

O conteúdo do repositório de metadados de conexão da replica substitui algumas das opções do servidor especificadas na linha de comando ou em `my.cnf`. Consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”, para obter mais detalhes.

Um único instantâneo da fonte é suficiente para múltiplas réplicas. Para configurar réplicas adicionais, use o mesmo instantâneo da fonte e siga a parte da réplica do procedimento descrito anteriormente.
