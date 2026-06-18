#### 19.1.3.4 Configurando a replicação usando GTIDs

Esta seção descreve um processo para configurar e iniciar a replicação baseada em GTID no MySQL 8.0. Este é um procedimento de “início frio” que assume que você está iniciando o servidor de origem pela primeira vez ou que é possível interromper o servidor. Para obter informações sobre a provisionamento de réplicas usando GTIDs de um servidor de origem em execução, consulte a Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”. Para obter informações sobre a alteração do modo GTID em servidores online, consulte a Seção 19.1.4, “Alterando o Modo GTID em Servidores Online”.

Os passos principais deste processo de inicialização para a topologia de replicação de GTID mais simples possível, composta por uma fonte e uma replica, são os seguintes:

1. Se a replicação já estiver em andamento, sincronize os dois servidores, tornando-os apenas de leitura.

2. Pare ambos os servidores.

3. Reinicie ambos os servidores com GTIDs habilitados e as opções corretas configuradas.

   As opções do **mysqld** necessárias para iniciar os servidores conforme descrito são discutidas no exemplo que segue mais adiante nesta seção.

4. Instrua a replica a usar a fonte como fonte de dados de replicação e a usar o posicionamento automático. As instruções SQL necessárias para realizar essa etapa estão descritas no exemplo que segue mais adiante nesta seção.

5. Faça um novo backup. Logs binários que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados, então os backups feitos antes deste ponto não podem ser usados com sua nova configuração.

6. Inicie a replicação e, em seguida, desative o modo apenas de leitura em ambos os servidores, para que eles possam aceitar as atualizações.

No exemplo a seguir, dois servidores já estão em execução como fonte e réplica, usando o protocolo de replicação baseado na posição do log binário do MySQL. Se você está começando com novos servidores, consulte a Seção 19.1.2.3, “Criando um Usuário para Conexões de Replicação”, para obter informações sobre como adicionar um usuário específico para conexões de replicação e a Seção 19.1.2.1, “Definindo a Configuração da Fonte de Replicação”, para obter informações sobre como definir a variável `server_id`. Os exemplos a seguir mostram como armazenar as opções de inicialização do **mysqld** no arquivo de opções do servidor, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”, para obter mais informações. Alternativamente, você pode usar as opções de inicialização ao executar o **mysqld**.

A maioria das etapas que se seguem exige o uso da conta MySQL `root` ou de outra conta de usuário do MySQL que tenha o privilégio `SUPER`. O **mysqladmin** `shutdown` requer o privilégio `SUPER` ou o privilégio `SHUTDOWN`.

**Passo 1: Sincronize os servidores.** Este passo é necessário apenas quando você estiver trabalhando com servidores que já estão replicando sem usar GTIDs. Para novos servidores, vá para o Passo 3. Faça os servidores de leitura somente por definir a variável de sistema `read_only` para `ON` em cada servidor, executando o seguinte:

```
mysql> SET @@GLOBAL.read_only = ON;
```

Aguarde que todas as transações em andamento sejam confirmadas ou revertidas. Em seguida, permita que a replica se atualize com a fonte. *É extremamente importante que você verifique se a replica processou todas as atualizações antes de continuar*.

Se você usar logs binários para qualquer outra finalidade que não seja a replicação, por exemplo, para fazer backup e restauração em um ponto no tempo, espere até que não precise mais dos antigos logs binários que contêm transações sem GTIDs. Idealmente, espere até que o servidor limpe todos os logs binários e espere que qualquer backup existente expire.

Importante

É importante entender que os logs que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados. Antes de prosseguir, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

**Passo 2: Parar ambos os servidores.** Parar cada servidor usando **mysqladmin**, conforme mostrado aqui, onde `username` é o nome do usuário para um usuário MySQL com privilégios suficientes para desligar o servidor:

```
$> mysqladmin -uusername -p shutdown
```

Em seguida, forneça a senha desse usuário na solicitação.

**Passo 3: Inicie ambos os servidores com GTIDs habilitados.** Para habilitar a replicação baseada em GTID, cada servidor deve ser iniciado com o modo GTID habilitado, definindo a variável `gtid_mode` para `ON` e a variável `enforce_gtid_consistency` habilitada para garantir que apenas as instruções que são seguras para replicação baseada em GTID sejam registradas. Por exemplo:

```
gtid_mode=ON
enforce-gtid-consistency=ON
```

Comece cada replica com a opção `--skip-slave-start` ou, a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para garantir que a replicação não seja iniciada até que você configure as configurações da replica. A partir do MySQL 8.0.26, use `--skip-replica-start` ou `skip_replica_start` em vez disso. Para obter mais informações sobre as opções e variáveis relacionadas ao GTID, consulte a Seção 19.1.6.5, “Variáveis de Sistema de ID de Transação Global”.

Não é obrigatório ativar o registro binário para usar GTIDs ao usar a tabela mysql.gtid\_executed. Os servidores de origem devem sempre ter o registro binário ativado para poderem se replicar. No entanto, os servidores de replica podem usar GTIDs, mas sem registro binário. Se você precisar desativar o registro binário em um servidor de replica, pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` ou `--log-slave-updates=OFF` para a replica.

**Passo 4: Configure a replica para usar a autoposição baseada em GTID.** Diga à replica que use a fonte com transações baseadas em GTID como fonte de dados de replicação e que use a autoposição baseada em GTID em vez da posição baseada em arquivos. Emite uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) na replica, incluindo a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` na declaração para dizer à replica que as transações da fonte são identificadas por GTIDs.

Você também pode precisar fornecer os valores apropriados para o nome do host e o número de porta da fonte, bem como o nome de usuário e a senha para uma conta de usuário de replicação que pode ser usada pela replica para se conectar à fonte; se esses valores já tiverem sido definidos antes do Passo 1 e não houver necessidade de fazer mais alterações, as opções correspondentes podem ser omitidas da declaração mostrada aqui.

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

**Passo 5: Faça um novo backup.** Os backups existentes que foram feitos antes de você habilitar os GTIDs não podem mais ser usados nesses servidores agora que você os habilitou. Faça um novo backup neste momento, para que você não fique sem um backup utilizável.

Por exemplo, você pode executar `FLUSH LOGS` no servidor onde está fazendo backups. Em seguida, você pode tomar um backup explicitamente ou esperar pela próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

**Passo 6: Inicie a replica e desative o modo apenas de leitura.** Inicie a replica da seguinte forma:

```
mysql> START SLAVE;
Or from MySQL 8.0.22:
mysql> START REPLICA;
```

A etapa seguinte só é necessária se você configurou um servidor para ser apenas de leitura na Etapa 1. Para permitir que o servidor comece a aceitar atualizações novamente, execute a seguinte declaração:

```
mysql> SET @@GLOBAL.read_only = OFF;
```

A replicação baseada em GTID deve estar em execução agora, e você pode começar (ou retomar) a atividade na fonte como antes. A Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”, discute a criação de novas réplicas ao usar GTIDs.
