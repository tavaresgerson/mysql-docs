#### 19.1.2.6 Configuração de Replicas

As seções a seguir descrevem como configurar as replicas. Antes de prosseguir, certifique-se de que você tem:

* Configurado a fonte com as propriedades de configuração necessárias. Consulte a Seção 19.1.2.1, “Configurando a Configuração da Fonte de Replicação”.

* Obtido as informações de status da fonte, ou uma cópia do arquivo de índice do log binário da fonte feito durante uma parada para o instantâneo de dados. Consulte a Seção 19.1.2.4, “Obtendo as Coordenadas do Log Binário da Fonte de Replicação”.

* Na fonte, liberou o bloqueio de leitura:

  ```
  mysql> UNLOCK TABLES;
  ```

* Na replica, editou a configuração do MySQL. Consulte a Seção 19.1.2.2, “Configurando a Configuração da Replica”.

Os próximos passos dependem de você ter dados existentes para importar para a replica ou não. Consulte a Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados” para mais informações. Escolha um dos seguintes:

* Se você não tem um instantâneo de um banco de dados para importar, consulte a Seção 19.1.2.6.1, “Configurando a Replicação com Nova Fonte e Replicas”.

* Se você tem um instantâneo de um banco de dados para importar, consulte a Seção 19.1.2.6.2, “Configurando a Replicação com Dados Existentes”.

##### 19.1.2.6.1 Configurando a Replicação com Nova Fonte e Replicas

Quando não há um instantâneo de um banco de dados anterior para importar, configure a replica para começar a replicar a partir da nova fonte.

Para configurar a replicação entre uma fonte e uma nova replica:

1. Inicie a replica.
2. Execute uma declaração `CHANGE REPLICATION SOURCE TO` na replica para definir a configuração da fonte. Consulte a Seção 19.1.2.7, “Configurando a Configuração da Fonte na Replica”.

Realize esses passos de configuração da replica em cada replica.

Esse método também pode ser usado se você estiver configurando novos servidores, mas tiver um dump existente dos bancos de dados de um servidor diferente que deseja carregar na configuração de replicação. Ao carregar os dados em uma nova fonte, os dados são replicados automaticamente para as réplicas.

Se você estiver configurando um novo ambiente de replicação usando os dados de um servidor de banco de dados existente diferente para criar uma nova fonte, execute o arquivo de dump gerado a partir desse servidor na nova fonte. As atualizações do banco de dados são propagadas automaticamente para as réplicas:

```
$> mysql -h source < fulldb.dump
```

##### 19.1.2.6.2 Configurando a Replicação com Dados Existentes

Ao configurar a replicação com dados existentes, transfira o snapshot da fonte para a réplica antes de iniciar a replicação. O processo de importação de dados para a réplica depende de como você criou o snapshot dos dados na fonte.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias de servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. No entanto, para casos de uso semelhantes que não requerem alta disponibilidade, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Nota

Se o servidor de origem da replicação ou a replica existente que você está copiando para criar a nova replica tiver algum evento agendado, certifique-se de que esses eventos sejam desativados na nova replica antes de iniciá-la. Se um evento for executado na nova replica e já tiver sido executado no servidor de origem, a operação duplicada causa um erro. O Agendamento de Eventos é controlado pela variável de sistema `event_scheduler` (padrão `ON`), então os eventos que estão ativos no servidor original são executados por padrão quando a nova replica é iniciada. Para impedir que todos os eventos sejam executados na nova replica, defina a variável de sistema `event_scheduler` para `OFF` ou `DISABLED` na nova replica. Alternativamente, você pode usar a instrução `ALTER EVENT` para definir eventos individuais para `DISABLE` ou `DISABLE ON REPLICA` para impedir que sejam executados na nova replica. Você pode listar os eventos em um servidor usando a instrução `SHOW` ou a tabela `EVENTS` do Schema de Informações. Para mais informações, consulte a Seção 19.5.1.16, “Replicação de Recursos Convocados”.

Como alternativa à criação de uma nova replica dessa maneira, o plugin de clone do MySQL Server pode ser usado para transferir todos os dados e configurações de replicação de uma replica existente para um clone. Para instruções sobre como usar esse método, consulte a Seção 7.6.6.7, “Clonagem para Replicação”.

Siga este procedimento para configurar a replicação com dados existentes:

1. Se você usou o plugin de clone do MySQL Server para criar um clone a partir de uma replica existente (consulte a Seção 7.6.6.7, “Clonagem para Replicação”), os dados já foram transferidos. Caso contrário, importe os dados para a replica usando um dos seguintes métodos.

   1. Se você usou o **mysqldump**, inicie o servidor de replica, garantindo que a replicação não seja iniciada, iniciando o servidor com `--skip-replica-start`. Em seguida, importe o arquivo de dump:

      ```
      $> mysql < fulldb.dump
      ```

2. Se você criou uma instantânea usando os arquivos de dados brutos, extraia os arquivos de dados para o diretório de dados da replica. Por exemplo:

      ```
      $> tar xvf dbdump.tar
      ```

      Você pode precisar definir permissões e propriedade nos arquivos para que o servidor de replica possa acessá-los e modificá-los. Em seguida, inicie o servidor de replica, garantindo que a replicação não seja iniciada usando `--skip-replica-start`.

2. Configure a replica com as coordenadas de replicação da fonte. Isso informa à replica o arquivo de log binário e a posição dentro do arquivo onde a replicação precisa começar. Além disso, configure a replica com as credenciais de login e o nome do host da fonte. Para mais informações sobre a declaração `CHANGE REPLICATION SOURCE TO`, consulte a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

3. Inicie os threads de replicação emitindo uma declaração `START REPLICA`.

Após realizar este procedimento, a replica se conecta à fonte e replica quaisquer atualizações que ocorreram na fonte desde que a instantânea foi tirada. Mensagens de erro são emitidas para o log de erro da replica se ela não conseguir replicar por qualquer motivo.

A réplica usa informações registradas em seu repositório de metadados de conexão e repositório de metadados de aplicação para acompanhar quanto do log binário da fonte ela já processou. Por padrão, esses repositórios são tabelas chamadas `slave_master_info` e `slave_relay_log_info` no banco de dados `mysql`. *Não* remova ou edite essas tabelas, a menos que você saiba exatamente o que está fazendo e entenda completamente as implicações. Mesmo nesse caso, é preferível usar a instrução `CHANGE REPLICATION SOURCE TO` para alterar os parâmetros de replicação. A réplica usa os valores especificados na instrução para atualizar automaticamente os repositórios de metadados de replicação. Consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”, para obter mais informações.

Nota

O conteúdo do repositório de metadados de conexão da réplica substitui algumas das opções do servidor especificadas na linha de comando ou em `my.cnf`. Consulte a Seção 19.1.6, “Opções e Variáveis de Log Binário e Replicação”, para obter mais detalhes.

Um único instantâneo da fonte é suficiente para múltiplas réplicas. Para configurar réplicas adicionais, use o mesmo instantâneo da fonte e siga a parte da réplica do procedimento descrito anteriormente.