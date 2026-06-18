#### 19.4.1.1 Fazer backup de uma réplica usando mysqldump

Usar o **mysqldump** para criar uma cópia de um banco de dados permite capturar todos os dados do banco de dados em um formato que permite a importação das informações para outra instância do MySQL Server (consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”). Como o formato das informações é de instruções SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução, caso você precise acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados for muito grande, o **mysqldump** pode não ser prático.

Dica

Considere usar os utilitários de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o streaming do Oracle Cloud Infrastructure Object Storage e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carga de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Ao usar o **mysqldump**, você deve interromper a replicação na replica antes de iniciar o processo de dump para garantir que o dump contenha um conjunto consistente de dados:

1. Pare a replica de processar solicitações. Você pode parar a replicação completamente na replica usando **mysqladmin**:

   ```
   $> mysqladmin stop-slave
   ```

   Alternativamente, você pode interromper apenas o fio de replicação SQL para pausar a execução do evento:

   ```
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   Or from MySQL 8.0.22:
   $> mysql -e 'STOP REPLICA SQL_THREAD;'
   ```

   Isso permite que a replica continue a receber eventos de alteração de dados do log binário da fonte e os armazene nos logs do retransmissor usando o fio do receptor de replicação, mas impede que a replica execute esses eventos e altere seus dados. Em ambientes de replicação movimentados, permitir que o fio do receptor de replicação seja executado durante o backup pode acelerar o processo de recuperação quando você reiniciar o fio do aplicável de replicação.

2. Execute o **mysqldump** para fazer o dump dos seus bancos de dados. Você pode fazer o dump de todos os bancos de dados ou selecionar os bancos de dados que serão dumpados. Por exemplo, para fazer o dump de todos os bancos de dados:

   ```
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Depois que o descarregamento estiver concluído, reinicie a replicação:

   ```
   $> mysqladmin start-slave
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e agrupar o processo em um script que você pode executar automaticamente todos os dias.

Se você usar essa abordagem, certifique-se de monitorar o processo de replicação para garantir que o tempo gasto para executar o backup não afete a capacidade da replica de acompanhar os eventos da fonte. Consulte a Seção 19.1.7.1, “Verificar o Status da Replicação”. Se a replica não conseguir acompanhar, você pode querer adicionar outra replica e distribuir o processo de backup. Para um exemplo de como configurar esse cenário, consulte a Seção 19.4.6, “Replicar Bancos de Dados Diferentes para Replicas Diferentes”.
