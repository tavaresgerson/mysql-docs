#### 16.1.2.3 Obtendo as Coordenadas do Binary Log da Origem da Replication

Para configurar a replica para iniciar o processo de Replication no ponto correto, você precisa anotar as coordenadas atuais da origem dentro do seu Binary Log.

Aviso

Este procedimento utiliza [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock), que bloqueia operações de [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

Se você estiver planejando desligar a origem para criar um Data Snapshot, você pode opcionalmente pular este procedimento e, em vez disso, armazenar uma cópia do arquivo de índice do Binary Log juntamente com o Data Snapshot. Nessa situação, a origem cria um novo arquivo de Binary Log ao reiniciar. As coordenadas do Binary Log da origem onde a replica deve iniciar o processo de Replication são, portanto, o início desse novo arquivo, que é o próximo arquivo de Binary Log na origem após os arquivos listados no arquivo de índice do Binary Log copiado.

Para obter as coordenadas do Binary Log da origem, siga estes passos:

1. Inicie uma Session na origem conectando-se a ela com o Client de linha de comando, e faça o flush de todas as tabelas e bloqueie instruções de escrita executando a instrução [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock):

   ```sql
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

   Aviso

   Mantenha o Client a partir do qual você emitiu a instrução [`FLUSH TABLES`](flush.html#flush-tables) em execução para que o Read Lock permaneça em vigor. Se você sair do Client, o Lock será liberado.

2. Em uma Session diferente na origem, use a instrução [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") para determinar o nome e a Position atuais do arquivo de Binary Log:

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

   A coluna `File` mostra o nome do arquivo de log e a coluna `Position` mostra a posição dentro do arquivo. Neste exemplo, o arquivo de Binary Log é `mysql-bin.000003` e a Position é 73. Registre estes valores. Você precisará deles mais tarde ao configurar a replica. Eles representam as coordenadas de Replication nas quais a replica deve começar a processar novas atualizações da origem.

   Se a origem estava em execução anteriormente sem o Binary Logging habilitado, os valores de nome do arquivo de log e Position exibidos por [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") ou [**mysqldump --master-data**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") estarão vazios. Nesse caso, os valores que você precisará usar posteriormente ao especificar o arquivo de log e a Position da origem são a string vazia (`''`) e `4`.

Agora você tem as informações necessárias para permitir que a replica comece a ler do Binary Log no local correto para iniciar a Replication.

O próximo passo depende se você tem dados existentes na origem. Escolha uma das seguintes opções:

* Se você tem dados existentes que precisam ser sincronizados com a replica antes de iniciar a Replication, mantenha o Client em execução para que o Lock permaneça ativo. Isso evita que quaisquer outras alterações sejam feitas, de modo que os dados copiados para a replica estejam em sincronia com a origem. Prossiga para [Section 16.1.2.4, “Choosing a Method for Data Snapshots”](replication-snapshot-method.html "16.1.2.4 Choosing a Method for Data Snapshots").

* Se você estiver configurando uma nova topologia de Replication, você pode sair da primeira Session para liberar o Read Lock. Consulte [Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas") para saber como proceder.