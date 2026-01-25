#### 16.3.1.1 Fazendo Backup de uma Réplica Usando mysqldump

Usar [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") para criar uma cópia de um Database permite capturar todos os dados no Database em um formato que possibilita a importação das informações em outra instância do MySQL Server (veja [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")). Como o formato da informação são instruções SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução caso seja necessário acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados (data set) for muito grande, o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") pode ser impraticável.

Ao usar [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), você deve parar a *replication* na réplica antes de iniciar o processo de *dump* para garantir que o *dump* contenha um conjunto de dados consistente:

1. Pare a réplica de processar requisições. Você pode parar a *replication* completamente na réplica usando [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"):

   ```sql
   $> mysqladmin stop-slave
   ```

   Alternativamente, você pode parar apenas o `replication SQL thread` para pausar a execução de eventos:

   ```sql
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   ```

   Isso permite que a réplica continue a receber eventos de alteração de dados do *Binary Log* da *source* (origem) e armazená-los nos *relay logs* usando o *I/O thread*, mas impede que a réplica execute esses eventos e altere seus dados. Em ambientes de *replication* movimentados, permitir que o *I/O thread* seja executado durante o backup pode acelerar o processo de recuperação quando você reiniciar o `replication SQL thread`.

2. Execute [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") para fazer o *dump* dos seus Databases. Você pode fazer o *dump* de todos os Databases ou selecionar Databases específicos. Por exemplo, para fazer o *dump* de todos os Databases:

   ```sql
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Assim que o *dump* for concluído, inicie as operações da réplica novamente:

   ```sql
   $> mysqladmin start-slave
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e empacotar o processo em um *script* que possa ser executado automaticamente todos os dias.

Se você usar esta abordagem, certifique-se de monitorar o *replication process* para garantir que o tempo necessário para executar o backup não afete a capacidade da réplica de acompanhar os eventos da *source*. Veja [Section 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status"). Se a réplica for incapaz de acompanhar, você pode considerar adicionar outra réplica e distribuir o processo de backup. Para um exemplo de como configurar este cenário, veja [Section 16.3.5, “Replicating Different Databases to Different Replicas”](replication-solutions-partitioning.html "16.3.5 Replicating Different Databases to Different Replicas").