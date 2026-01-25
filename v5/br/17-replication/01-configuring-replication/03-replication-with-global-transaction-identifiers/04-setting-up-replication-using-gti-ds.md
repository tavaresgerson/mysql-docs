#### 16.1.3.4 Configurando a Replication Usando GTIDs

Esta seção descreve um processo para configurar e iniciar a Replication baseada em GTID no MySQL 5.7. Este é um procedimento de "inicialização a frio" (*cold start*) que assume que você está iniciando o Source Server de Replication pela primeira vez, ou que é possível pará-lo; para informações sobre o provisionamento de Replicas usando GTIDs a partir de um Source em execução, consulte [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout"). Para informações sobre como alterar o modo GTID em Servers online, consulte [Section 16.1.4, “Changing Replication Modes on Online Servers”](replication-mode-change-online.html "16.1.4 Changing Replication Modes on Online Servers").

Os passos principais neste processo de inicialização para a topologia de Replication GTID mais simples possível, consistindo de um Source e uma Replica, são os seguintes:

1. Se a Replication já estiver em execução, sincronize ambos os Servers tornando-os `read-only`.

2. Pare ambos os Servers.
3. Reinicie ambos os Servers com GTIDs habilitados e as opções corretas configuradas.

   As opções do [**mysqld**] necessárias para iniciar os Servers conforme descrito são discutidas no exemplo que se segue adiante nesta seção.

4. Instrua a Replica a usar o Source como a fonte de dados de Replication e a usar o *auto-positioning*. As instruções SQL necessárias para realizar esta etapa são descritas no exemplo que se segue adiante nesta seção.

5. Faça um novo Backup. Binary Logs contendo transações sem GTIDs não podem ser usados em Servers onde GTIDs estão habilitados, então Backups feitos antes deste ponto não podem ser usados com sua nova configuração.

6. Inicie a Replica, depois desabilite o modo `read-only` em ambos os Servers, para que possam aceitar Updates.

No exemplo a seguir, dois Servers já estão rodando como Source e Replica, usando o protocolo de Replication baseado em posição de Binary Log do MySQL. Se você estiver começando com novos Servers, consulte [Section 16.1.2.2, “Creating a User for Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication") para obter informações sobre como adicionar um usuário específico para conexões de Replication e [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration") para obter informações sobre como configurar a variável [`server_id`]. Os exemplos a seguir mostram como armazenar as opções de inicialização do [**mysqld**] no arquivo de opções do Server; consulte [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files") para mais informações. Alternativamente, você pode usar opções de inicialização ao executar o [**mysqld**].

A maioria dos passos a seguir requer o uso da conta `root` do MySQL ou de outra conta de usuário MySQL que possua o privilégio [`SUPER`]. O [**mysqladmin**] `shutdown` requer o privilégio `SUPER` ou o privilégio [`SHUTDOWN`].

**Etapa 1: Sincronize os Servers.** Esta etapa é necessária apenas ao trabalhar com Servers que já estão replicando sem usar GTIDs. Para novos Servers, prossiga para a Etapa 3. Torne os Servers `read-only` definindo a variável de sistema [`read_only`] como `ON` em cada Server, executando o seguinte:

```sql
mysql> SET @@GLOBAL.read_only = ON;
```

Espere que todas as transações em andamento sejam `commit` ou `roll back`. Em seguida, permita que a Replica alcance o Source. *É extremamente importante que você se certifique de que a Replica processou todos os Updates antes de continuar*.

Se você usar Binary Logs para algo além da Replication, por exemplo, para realizar Backup e Restore de ponto no tempo (*point in time*), espere até que você não precise mais dos Binary Logs antigos contendo transações sem GTIDs. Idealmente, espere que o Server limpe todos os Binary Logs e espere que qualquer Backup existente expire.

Importante

É importante entender que Logs contendo transações sem GTIDs não podem ser usados em Servers onde GTIDs estão habilitados. Antes de prosseguir, você deve ter certeza de que transações sem GTIDs não existem em nenhuma parte da topologia.

**Etapa 2: Pare ambos os Servers.** Pare cada Server usando o [**mysqladmin**] conforme mostrado aqui, onde *`username`* é o nome de usuário de um usuário MySQL com privilégios suficientes para desligar o Server:

```sql
$> mysqladmin -uusername -p shutdown
```

Em seguida, forneça a senha deste usuário no prompt.

**Etapa 3: Inicie ambos os Servers com GTIDs habilitados.** Para habilitar a Replication baseada em GTID, cada Server deve ser iniciado com o modo GTID habilitado, definindo a variável [`gtid_mode`] como `ON`, e com a variável [`enforce_gtid_consistency`] habilitada para garantir que apenas instruções seguras para Replication baseada em GTID sejam logadas. Por exemplo:

```sql
gtid_mode=ON
enforce-gtid-consistency=ON
```

Além disso, você deve iniciar as Replicas com a opção [`--skip-slave-start`] antes de configurar as definições da Replica. Para mais informações sobre opções e variáveis relacionadas a GTID, consulte [Section 16.1.6.5, “Global Transaction ID System Variables”](replication-options-gtids.html "16.1.6.5 Global Transaction ID System Variables").

Não é obrigatório ter o Binary Logging habilitado para usar GTIDs ao utilizar a [mysql.gtid_executed Table]. O Replication Source Server deve sempre ter o Binary Logging habilitado para poder replicar. No entanto, os Replica Servers podem usar GTIDs, mas sem Binary Logging. Se você precisar desabilitar o Binary Logging em uma Replica, você pode fazê-lo especificando as opções [`--skip-log-bin`] e [`--log-slave-updates=OFF`] para a Replica.

**Etapa 4: Configure a Replica para usar o *auto-positioning* baseado em GTID.** Diga à Replica para usar o Source com transações baseadas em GTID como fonte de dados de Replication, e para usar o *auto-positioning* baseado em GTID em vez do posicionamento baseado em arquivo. Execute uma instrução [`CHANGE MASTER TO`] na Replica, incluindo a opção `MASTER_AUTO_POSITION` na instrução para informar à Replica que as transações do Source são identificadas por GTIDs.

Você também pode precisar fornecer valores apropriados para o *hostname* e número da porta do Source, bem como o nome de usuário e senha para uma conta de usuário de Replication que possa ser usada pela Replica para se conectar ao Source; se estes já tiverem sido definidos antes da Etapa 1 e nenhuma mudança adicional precisar ser feita, as opções correspondentes podem ser omitidas com segurança da instrução mostrada aqui.

```sql
mysql> CHANGE MASTER TO
     >     MASTER_HOST = host,
     >     MASTER_PORT = port,
     >     MASTER_USER = user,
     >     MASTER_PASSWORD = password,
     >     MASTER_AUTO_POSITION = 1;
```

Nem a opção `MASTER_LOG_FILE` nem a opção `MASTER_LOG_POS` podem ser usadas com `MASTER_AUTO_POSITION` definido como 1. A tentativa de fazê-lo fará com que a instrução [`CHANGE MASTER TO`] falhe com um erro.

**Etapa 5: Faça um novo Backup.** Backups existentes que foram feitos antes de você habilitar GTIDs não podem mais ser usados nestes Servers agora que você habilitou GTIDs. Faça um novo Backup neste ponto, para que você não fique sem um Backup utilizável.

Por exemplo, você pode executar [`FLUSH LOGS`] no Server onde você está fazendo Backups. Em seguida, explicitamente faça um Backup ou espere pela próxima iteração de qualquer rotina periódica de Backup que você possa ter configurado.

**Etapa 6: Inicie a Replica e desabilite o modo `read-only`.** Inicie a Replica desta forma:

```sql
mysql> START SLAVE;
```

A etapa a seguir é necessária apenas se você configurou um Server para ser `read-only` na Etapa 1. Para permitir que o Server comece a aceitar Updates novamente, execute a seguinte instrução:

```sql
mysql> SET @@GLOBAL.read_only = OFF;
```

A Replication baseada em GTID deve estar agora em execução, e você pode iniciar (ou retomar) a atividade no Source como antes. [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout"), discute a criação de novas Replicas ao usar GTIDs.