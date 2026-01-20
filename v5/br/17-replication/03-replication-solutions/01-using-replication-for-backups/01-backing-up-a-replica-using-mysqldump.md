#### 16.3.1.1 Fazer backup de uma réplica usando mysqldump

Usar **mysqldump** para criar uma cópia de um banco de dados permite capturar todos os dados do banco de dados em um formato que permite que as informações sejam importadas para outra instância do MySQL Server (consulte Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”). Como o formato das informações é declarações SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução, caso você precise acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados for muito grande, **mysqldump** pode não ser prático.

Ao usar **mysqldump**, você deve interromper a replicação na replica antes de iniciar o processo de dump para garantir que o dump contenha um conjunto consistente de dados:

1. Pare a replica de processar solicitações. Você pode parar a replicação completamente no replica usando **mysqladmin**:

   ```sql
   $> mysqladmin stop-slave
   ```

   Alternativamente, você pode interromper apenas o thread de replicação SQL para pausar a execução do evento:

   ```sql
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   ```

   Isso permite que a replica continue a receber eventos de alteração de dados do log binário da fonte e os armazene nos logs do retransmissor usando a thread de E/S, mas impede que a replica execute esses eventos e altere seus dados. Em ambientes de replicação movimentados, permitir que a thread de E/S seja executada durante o backup pode acelerar o processo de recuperação quando você reiniciar o thread de SQL da replicação.

2. Execute **mysqldump** para fazer o dump dos seus bancos de dados. Você pode fazer o dump de todos os bancos de dados ou selecionar os bancos de dados que deseja fazer o dump. Por exemplo, para fazer o dump de todos os bancos de dados:

   ```sql
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Depois que o descarte estiver concluído, reinicie as operações de replicação:

   ```sql
   $> mysqladmin start-slave
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e agrupar o processo em um script que você pode executar automaticamente todos os dias.

Se você usar essa abordagem, certifique-se de monitorar o processo de replicação para garantir que o tempo gasto para executar o backup não afete a capacidade da replica de acompanhar os eventos da fonte. Veja Seção 16.1.7.1, “Verificar o Status da Replicação”. Se a replica não conseguir acompanhar, você pode querer adicionar outra replica e distribuir o processo de backup. Para um exemplo de como configurar esse cenário, veja Seção 16.3.5, “Replicar Diferentes Bancos de Dados para Diferentes Replicas”.
