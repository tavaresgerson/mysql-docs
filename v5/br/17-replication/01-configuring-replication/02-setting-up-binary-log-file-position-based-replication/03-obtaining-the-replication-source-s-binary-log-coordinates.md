#### 16.1.2.3. Obter as coordenadas do log binário da fonte de replicação

Para configurar a replica para iniciar o processo de replicação no ponto correto, você precisa observar as coordenadas atuais da fonte em seu log binário.

Aviso

Esse procedimento usa `FLUSH TABLES WITH READ LOCK`, que bloqueia as operações de `COMMIT` para as tabelas do `InnoDB`.

Se você estiver planejando encerrar a fonte para criar um instantâneo de dados, você pode, opcionalmente, pular esse procedimento e, em vez disso, armazenar uma cópia do arquivo de índice do log binário junto com o instantâneo de dados. Nesse caso, a fonte cria um novo arquivo de log binário na próxima reinicialização. As coordenadas do log binário da fonte onde a replica deve iniciar o processo de replicação são, portanto, o início desse novo arquivo, que é o próximo arquivo de log binário da fonte após os arquivos listados no arquivo de índice de log binário copiado.

Para obter as coordenadas do log binário da fonte, siga estes passos:

1. Comece uma sessão na fonte conectando-se a ela com o cliente de linha de comando e limpe todas as tabelas e instruções de bloqueio de escrita executando a instrução `FLUSH TABLES WITH READ LOCK`:

   ```sql
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

   Aviso

   Deixe o cliente do qual você emitiu a instrução `FLUSH TABLES` em execução para que o bloqueio de leitura permaneça em vigor. Se você sair do cliente, o bloqueio é liberado.

2. Em uma sessão diferente na fonte, use a instrução `SHOW MASTER STATUS` para determinar o nome e a posição do arquivo de log binário atual:

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

   A coluna `Arquivo` mostra o nome do arquivo de log e a coluna `Posição` mostra a posição dentro do arquivo. Neste exemplo, o arquivo de log binário é `mysql-bin.000003` e a posição é 73. Anote esses valores. Você precisará deles mais tarde, quando estiver configurando a replica. Eles representam as coordenadas de replicação nas quais a replica deve começar a processar novas atualizações da fonte.

   Se a fonte já estiver em execução anteriormente sem o registro binário habilitado, os nomes dos arquivos de log e os valores de posição exibidos por `SHOW MASTER STATUS` ou **mysqldump --master-data** serão vazios. Nesse caso, os valores que você precisará usar mais tarde ao especificar o arquivo de log e a posição da fonte serão a string vazia (`''`) e `4`.

Agora você tem as informações necessárias para permitir que a replica comece a ler o log binário no local correto para iniciar a replicação.

O próximo passo depende de você ter dados existentes na fonte. Escolha uma das seguintes opções:

- Se você tiver dados existentes que precisam ser sincronizados com a replica antes de iniciar a replicação, deixe o cliente em execução para que o bloqueio permaneça em vigor. Isso impede que quaisquer alterações adicionais sejam feitas, garantindo que os dados copiados para a replica estejam em sincronia com a fonte. Prossiga para Seção 16.1.2.4, “Escolhendo um Método para Instantâneos de Dados”.

- Se você está configurando uma nova topologia de replicação, pode sair da primeira sessão para liberar o bloqueio de leitura. Veja Seção 16.1.2.5.3, “Configurando a replicação entre uma nova fonte e réplicas” para saber como proceder.
