#### 19.4.1.1 Fazer backup de uma réplica usando mysqldump

Usar **mysqldump** para criar uma cópia de um banco de dados permite que você capture todos os dados do banco em um formato que permite a importação das informações para outra instância do MySQL Server (consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”). Como o formato das informações é instruções SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução, caso você precise acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados for muito grande, **mysqldump** pode não ser prático.

Dica

Considere usar as ferramentas de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como streaming de Armazenamento de Objetos da Oracle Cloud Infrastructure e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando as ferramentas de carregamento de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Ao usar **mysqldump**, você deve parar a replicação na réplica antes de iniciar o processo de dump para garantir que o dump contenha um conjunto de dados consistente:

1. Parar a replica de processar solicitações. Você pode parar completamente a replicação na réplica usando **mysqladmin**:

   ```
   $> mysqladmin stop-replica
   ```

   Alternativamente, você pode parar apenas o thread SQL de replicação para pausar a execução de eventos:

   ```
   $> mysql -e 'STOP REPLICA SQL_THREAD;'
   ```

Isso permite que a replica continue recebendo eventos de alteração de dados do log binário da fonte e os armazene nos logs do retransmissor usando o fio do receptor de replicação, mas impede que a replica execute esses eventos e altere seus dados. Em ambientes de replicação movimentados, permitir que o fio do receptor de replicação seja executado durante o backup pode acelerar o processo de recuperação quando você reiniciar o fio do aplicável de replicação.

2. Execute **mysqldump** para fazer o dump de seus bancos de dados. Você pode fazer o dump de todos os bancos de dados ou selecionar os bancos de dados a serem dumpados. Por exemplo, para fazer o dump de todos os bancos de dados:

   ```
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Uma vez que o dump esteja concluído, reinicie a replicação:

   ```
   $> mysqladmin start-replica
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e agrupar o processo em um script que você possa executar automaticamente todos os dias.

Se você usar essa abordagem, certifique-se de monitorar o processo de replicação para garantir que o tempo gasto para executar o backup não afete a capacidade da replica de acompanhar os eventos da fonte. Consulte a Seção 19.1.7.1, “Verificar o Status da Replicação”. Se a replica não conseguir acompanhar, você pode querer adicionar outra replica e distribuir o processo de backup. Para um exemplo de como configurar esse cenário, consulte a Seção 19.4.6, “Replicar Diferentes Bancos de Dados para Diferentes Replicas”.