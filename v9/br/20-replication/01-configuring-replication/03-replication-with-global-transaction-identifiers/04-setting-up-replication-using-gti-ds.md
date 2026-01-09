#### 19.1.3.4 Configurando a Replicação Usando GTIDs

Esta seção descreve um processo para configurar e iniciar a replicação baseada em GTIDs no MySQL 9.5. Este é um procedimento de “início frio” que assume que você está iniciando o servidor de origem pela primeira vez ou que é possível interromper o servidor. Para informações sobre provisionamento de réplicas usando GTIDs de um servidor de origem em execução, consulte a Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”. Para informações sobre alterar o modo GTID em servidores online, consulte a Seção 19.1.4, “Alterando o Modo GTID em Servidores Online”.

Os passos principais deste processo de inicialização para a topologia de replicação GTID mais simples possível, consistindo de um servidor de origem e uma réplica, são os seguintes:

1. Se a replicação já estiver em execução, sincronize ambos os servidores, tornando-os de leitura somente.

2. Interrompa ambos os servidores.
3. Reinicie ambos os servidores com GTIDs habilitados e as opções corretas configuradas.

   As opções **mysqld** necessárias para iniciar os servidores conforme descrito são discutidas no exemplo que segue mais adiante nesta seção.

4. Instrua a réplica a usar o servidor de origem como a fonte de dados de replicação e a usar o posicionamento automático. As instruções SQL necessárias para realizar essa etapa são descritas no exemplo que segue mais adiante nesta seção.

5. Faça um novo backup. Logs binários contendo transações sem GTIDs não podem ser usados em servidores onde GTIDs estão habilitados, então backups feitos antes deste ponto não podem ser usados com sua nova configuração.

6. Inicie a réplica, depois desabilite o modo de leitura somente em ambos os servidores, para que eles possam aceitar atualizações.

No exemplo a seguir, dois servidores já estão em execução como fonte e réplica, usando o protocolo de replicação baseado na posição do log binário do MySQL. Se você estiver começando com novos servidores, consulte a Seção 19.1.2.3, “Criando um Usuário para Conexões de Replicação”, para obter informações sobre como adicionar um usuário específico para conexões de replicação e a Seção 19.1.2.1, “Definindo a Configuração da Fonte de Replicação”, para obter informações sobre como definir a variável `server_id`. Os exemplos a seguir mostram como armazenar as opções de inicialização do **mysqld** no arquivo de opções do servidor, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções” para mais informações. Alternativamente, você pode usar as opções de inicialização ao executar o **mysqld**.

A maioria das etapas que seguem requer o uso da conta `root` do MySQL ou de outra conta de usuário do MySQL que tenha o privilégio `SUPER`. O **mysqladmin** `shutdown` requer o privilégio `SUPER` ou o privilégio `SHUTDOWN`.

**Passo 1: Sincronize os servidores.** Este passo é necessário apenas quando você estiver trabalhando com servidores que já estão replicando sem usar GTIDs. Para novos servidores, vá para o Passo 3. Faça os servidores de leitura somente, definindo a variável de sistema `read_only` para `ON` em cada servidor, emitindo o seguinte:

Aguarde que todas as transações em andamento sejam confirmadas ou revertidas. Em seguida, permita que a réplica alcance a fonte. *É extremamente importante que você garanta que a réplica processou todas as atualizações antes de continuar*.

Se você usar logs binários para qualquer outra coisa além da replicação, por exemplo, para fazer backup e restauração em um ponto no tempo, espere até que você não precise dos logs binários antigos que contêm transações sem GTIDs. Idealmente, espere que o servidor limpe todos os logs binários e espere que qualquer backup existente expire.

Importante

É importante entender que os logs que contêm transações sem GTIDs não podem ser usados em servidores onde os GTIDs estão habilitados. Antes de prosseguir, você deve ter certeza de que as transações sem GTIDs não existem em nenhum lugar da topologia.

**Passo 2: Parar ambos os servidores.** Parar cada servidor usando **mysqladmin** como mostrado aqui, onde *`username`* é o nome de usuário para um usuário MySQL com privilégios suficientes para desligar o servidor:

```
mysql> SET @@GLOBAL.read_only = ON;
```

Em seguida, forneça a senha desse usuário na prompt.

**Passo 3: Iniciar ambos os servidores com GTIDs habilitados.** Para habilitar a replicação baseada em GTID, cada servidor deve ser iniciado com o modo GTID habilitado, definindo a variável `gtid_mode` para `ON`, e com a variável `enforce_gtid_consistency` habilitada para garantir que apenas as instruções que são seguras para a replicação baseada em GTID sejam registradas. Por exemplo:

```
$> mysqladmin -uusername -p shutdown
```

Inicie cada replica com `--skip-replica-start`. Para obter mais informações sobre as opções e variáveis relacionadas a GTID, consulte a Seção 19.1.6.5, “Variáveis do Sistema de Identificador de Transação Global”.

Não é obrigatório ter o registro binário habilitado para usar GTIDs ao usar a Tabela mysql.gtid_executed. Os servidores de origem devem sempre ter o registro binário habilitado para poderem ser replicados. No entanto, os servidores de replica podem usar GTIDs, mas sem registro binário. Se você precisar desabilitar o registro binário em um servidor de replica, pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` para a replica.

**Passo 4: Configure a replica para usar a autoposição baseada em GTID.** Diga à replica para usar a fonte com transações baseadas em GTID como a fonte de dados de replicação e para usar a autoposição baseada em GTID em vez da posição baseada em arquivos. Emite uma `ALTERE A FONTE DE REPLICA PARA` na replica, incluindo a opção `SOURCE_AUTO_POSITION` na declaração para dizer à replica que as transações da fonte são identificadas por GTIDs.

Você também pode precisar fornecer valores apropriados para o nome do host e o número de porta da fonte, bem como o nome de usuário e a senha para uma conta de usuário de replicação que pode ser usada pela replica para se conectar à fonte; se esses já tiverem sido definidos antes do Passo 1 e não houver necessidade de fazer mais alterações, as opções correspondentes podem ser omitidas da declaração mostrada aqui.

```
gtid_mode=ON
enforce-gtid-consistency=ON
```

**Passo 5: Faça um novo backup.** Os backups existentes que foram feitos antes de você habilitar GTIDs não podem mais ser usados nesses servidores agora que você habilitou GTIDs. Faça um novo backup neste ponto, para não ficar sem um backup utilizável.

Por exemplo, você pode executar `FLUSH LOGS` no servidor onde está fazendo backups. Em seguida, tome um backup explicitamente ou espere pela próxima iteração de qualquer rotina de backup periódica que você possa ter configurado.

**Passo 6: Inicie a replica e desabilite o modo apenas para leitura.** Inicie a replica da seguinte forma:

```
mysql> CHANGE REPLICATION SOURCE TO
     >     SOURCE_HOST = host,
     >     SOURCE_PORT = port,
     >     SOURCE_USER = user,
     >     SOURCE_PASSWORD = password,
     >     SOURCE_AUTO_POSITION = 1;
```

O passo seguinte é necessário apenas se você configurou um servidor para ser apenas de leitura no Passo 1. Para permitir que o servidor comece a aceitar atualizações novamente, emite a seguinte declaração:

```
mysql> START REPLICA;
```

A replicação baseada em GTID agora deve estar em execução, e você pode começar (ou retomar) a atividade na fonte como antes. A Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”, discute a criação de novas réplicas ao usar GTIDs.