## 9.3 Exemplo de estratégia de backup e recuperação

Esta seção discute um procedimento para realizar backups que permite recuperar dados após vários tipos de falhas:

* Falha no sistema operacional * Falha de energia * Falha no sistema de arquivos * Problema de hardware (disco rígido, placa-mãe, etc.)

Os comandos de exemplo não incluem opções como `--user` e `--password` para os programas de cliente **mysqldump** e **mysql**. Você deve incluir tais opções conforme necessário para permitir que os programas de cliente se conectem ao servidor MySQL.

Suponha que os dados estejam armazenados no motor de armazenamento `InnoDB`, que oferece suporte para transações e recuperação automática em caso de falha. Suponha também que o servidor MySQL esteja sob carga no momento da falha. Se não estivesse, nunca seria necessária a recuperação.

Para casos de falhas no sistema operacional ou falhas de energia, podemos assumir que os dados do disco do MySQL estão disponíveis após um reinício. É possível que os arquivos de dados `InnoDB` não contenham dados consistentes devido à falha, mas o `InnoDB` lê seus registros e encontra neles a lista de transações pendentes, tanto as que foram comprometidas quanto as que não foram comprometidas, mas ainda não foram descarregadas para os arquivos de dados. O `InnoDB` desfaz automaticamente as transações que não foram comprometidas e descarrega para seus arquivos de dados as que foram comprometidas. As informações sobre esse processo de recuperação são transmitidas ao usuário através do registro de erro do MySQL. O seguinte é um trecho de log de exemplo:

```
InnoDB: Database was not shut down normally.
InnoDB: Starting recovery from log files...
InnoDB: Starting log scan based on checkpoint at
InnoDB: log sequence number 0 13674004
InnoDB: Doing recovery: scanned up to log sequence number 0 13739520
InnoDB: Doing recovery: scanned up to log sequence number 0 13805056
InnoDB: Doing recovery: scanned up to log sequence number 0 13870592
InnoDB: Doing recovery: scanned up to log sequence number 0 13936128
...
InnoDB: Doing recovery: scanned up to log sequence number 0 20555264
InnoDB: Doing recovery: scanned up to log sequence number 0 20620800
InnoDB: Doing recovery: scanned up to log sequence number 0 20664692
InnoDB: 1 uncommitted transaction(s) which must be rolled back
InnoDB: Starting rollback of uncommitted transactions
InnoDB: Rolling back trx no 16745
InnoDB: Rolling back of trx no 16745 completed
InnoDB: Rollback of uncommitted transactions completed
InnoDB: Starting an apply batch of log records to the database...
InnoDB: Apply batch completed
InnoDB: Started
mysqld: ready for connections
```

Para os casos de falhas no sistema de arquivos ou problemas de hardware, podemos assumir que os dados do disco MySQL *não* estão disponíveis após um reinício. Isso significa que o MySQL não consegue iniciar com sucesso porque alguns blocos de dados do disco deixam de ser legíveis. Neste caso, é necessário reformatar o disco, instalar um novo ou, de outra forma, corrigir o problema subjacente. Em seguida, é necessário recuperar nossos dados do MySQL a partir de backups, o que significa que os backups já devem ter sido feitos. Para garantir que seja esse o caso, projete e implemente uma política de backup.

### 9.3.1 Estabelecimento de uma Política de Backup

Para ser útil, os backups devem ser agendados regularmente. Um backup completo (um instantâneo dos dados em um determinado momento) pode ser feito no MySQL com várias ferramentas. Por exemplo, o MySQL Enterprise Backup pode realizar um backup físico de uma instância inteira, com otimizações para minimizar o overhead e evitar interrupções ao fazer backup dos arquivos de dados do `InnoDB`; o **mysqldump** oferece backup lógico online. Esta discussão usa o **mysqldump**.

Suponha que façamos um backup completo de todas as nossas tabelas `InnoDB` em todos os bancos de dados usando o seguinte comando no domingo às 13h, quando a carga é baixa:

```
$> mysqldump --all-databases --master-data --single-transaction > backup_sunday_1_PM.sql
```

O arquivo `.sql` resultante produzido pelo **mysqldump** contém um conjunto de declarações SQL `INSERT` que podem ser usadas para recarregar as tabelas descarregadas em um momento posterior.

Essa operação de backup adquire um bloqueio de leitura global em todas as tabelas no início do dump (usando `FLUSH TABLES WITH READ LOCK` (flush.html#flush-tables-with-read-lock)). Assim que esse bloqueio é adquirido, as coordenadas do log binário são lidas e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a declaração `FLUSH` é emitida, a operação de backup pode ficar parada até que essas declarações terminem. Após isso, o dump se torna livre de bloqueio e não interfere em leituras e escritas nas tabelas.

Anteriormente, suportia-se que as tabelas a serem respaldadas eram as tabelas `InnoDB`. Portanto, o `--single-transaction` utiliza uma leitura consistente e garante que os dados vistos pelo **mysqldump** não sejam alterados. (As alterações feitas por outros clientes nas tabelas `InnoDB` não são vistas pelo processo **mysqldump**. Se a operação de backup incluir tabelas não transacionais, a consistência exige que elas não sejam alteradas durante o backup. Por exemplo, para as tabelas `MyISAM` no banco de dados `mysql`, não deve haver alterações administrativas nas contas do MySQL durante o backup.

Os backups completos são necessários, mas nem sempre é conveniente criá-los. Eles produzem arquivos de backup grandes e demoram a serem gerados. Não são ótimos no sentido de que cada backup completo sucessivo inclui todos os dados, mesmo aquela parte que não foi alterada desde o backup completo anterior. É mais eficiente fazer um backup completo inicial e, em seguida, fazer backups incrementais. Os backups incrementais são menores e demoram menos tempo para serem gerados. O sacrifício é que, no momento da recuperação, você não pode restaurar seus dados apenas recarregando o backup completo. Você também deve processar os backups incrementais para recuperar as alterações incrementais.

Para fazer backups incrementais, precisamos salvar as mudanças incrementais. No MySQL, essas mudanças são representadas no log binário, então o servidor MySQL deve ser iniciado sempre com a opção `--log-bin` para habilitar esse log. Com o registro binário habilitado, o servidor escreve cada mudança de dados em um arquivo enquanto atualiza os dados. Olhando para o diretório de dados de um servidor MySQL que tem sido executado por alguns dias, encontramos esses arquivos de log binário MySQL:

```
-rw-rw---- 1 guilhem  guilhem   1277324 Nov 10 23:59 gbichot2-bin.000001
-rw-rw---- 1 guilhem  guilhem         4 Nov 10 23:59 gbichot2-bin.000002
-rw-rw---- 1 guilhem  guilhem        79 Nov 11 11:06 gbichot2-bin.000003
-rw-rw---- 1 guilhem  guilhem       508 Nov 11 11:08 gbichot2-bin.000004
-rw-rw---- 1 guilhem  guilhem 220047446 Nov 12 16:47 gbichot2-bin.000005
-rw-rw---- 1 guilhem  guilhem    998412 Nov 14 10:08 gbichot2-bin.000006
-rw-rw---- 1 guilhem  guilhem       361 Nov 14 10:07 gbichot2-bin.index
```

Cada vez que ele é reiniciado, o servidor MySQL cria um novo arquivo de registro binário usando o próximo número na sequência. Enquanto o servidor estiver em execução, você também pode dizer que ele feche o arquivo de registro binário atual e comece um novo manualmente, emitindo uma declaração SQL `FLUSH LOGS` ou com um comando **mysqladmin flush-logs**. O **mysqldump** também tem uma opção para esvaziar os registros. O arquivo `.index` no diretório de dados contém a lista de todos os registros binários MySQL no diretório.

Os logs binários do MySQL são importantes para a recuperação, pois formam o conjunto de backups incrementais. Se você garantir que os logs sejam limpos quando fizer seu backup completo, os arquivos de log binário criados posteriormente conterão todas as alterações de dados feitas desde o backup. Vamos modificar o comando anterior do **mysqldump** um pouco para que ele limpe os logs binários do MySQL no momento do backup completo, e para que o arquivo de dump contenha o nome do novo log binário atual:

```
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases > backup_sunday_1_PM.sql
```

Após executar este comando, o diretório de dados contém um novo arquivo de log binário, `gbichot2-bin.000007`, porque a opção `--flush-logs` faz com que o servidor limpe seus logs. A opção `--master-data` faz com que o **mysqldump** escreva informações de log binário em sua saída, então o arquivo de dump resultante `.sql` inclui essas linhas:

```
-- Position to start replication or point-in-time recovery from
-- CHANGE MASTER TO MASTER_LOG_FILE='gbichot2-bin.000007',MASTER_LOG_POS=4;
```

Como o comando **mysqldump** fez um backup completo, essas linhas significam duas coisas:

* O arquivo de descarte contém todas as alterações feitas antes de quaisquer alterações escritas no arquivo de registro binário `gbichot2-bin.000007` ou superior.

* Todos os dados que são registrados após o backup não estão presentes no arquivo de dump, mas estão presentes no arquivo de log binário `gbichot2-bin.000007` ou superior.

Na segunda-feira, às 13h, podemos criar um backup incremental, apagando os logs para começar um novo arquivo de log binário. Por exemplo, executar o comando **mysqladmin flush-logs** cria `gbichot2-bin.000008`. Todas as alterações entre o backup completo de domingo às 13h e a segunda-feira às 13h são escritas em `gbichot2-bin.000007`. Esse backup incremental é importante, então é uma boa ideia copiá-lo para um local seguro. (Por exemplo, faça um backup em fita ou DVD, ou copie-o para outra máquina.) Na terça-feira, às 13h, execute outro comando **mysqladmin flush-logs**. Todas as alterações entre segunda-feira às 13h e terça-feira às 13h são escritas em `gbichot2-bin.000008` (que também deve ser copiado em algum lugar seguro).

Os logs binários do MySQL ocupam espaço no disco. Para liberar espaço, elimine-os de tempos em tempos. Uma maneira de fazer isso é excluindo os logs binários que não são mais necessários, como quando fazemos um backup completo:

```
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases --delete-master-logs > backup_sunday_1_PM.sql
```

Nota

Excluir os logs binários do MySQL com [**mysqldump --delete-master-logs**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") pode ser perigoso se o seu servidor for um servidor de fonte de replicação, porque as réplicas ainda podem não ter processado completamente o conteúdo do log binário. A descrição para a declaração [`PURGE BINARY LOGS`](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") explica o que deve ser verificado antes de excluir os logs binários do MySQL. Veja a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

### 9.3.2 Usando backups para recuperação

Agora, vamos supor que tenhamos uma saída catastrófica e inesperada na quarta-feira às 8h. Isso exige a recuperação a partir de backups. Para isso, primeiro restauramos o último backup completo que temos (o do domingo às 13h). O arquivo do backup completo é apenas um conjunto de declarações SQL, então restaurá-lo é muito fácil:

```
$> mysql < backup_sunday_1_PM.sql
```

Neste ponto, os dados são restaurados ao seu estado de domingo às 13h. Para restaurar as alterações feitas desde então, devemos usar os backups incrementais; ou seja, os arquivos de registro binário `gbichot2-bin.000007` e `gbichot2-bin.000008`. Pegue os arquivos, se necessário, de onde foram feitos os backups, e, em seguida, processe o seu conteúdo da seguinte forma:

```
$> mysqlbinlog gbichot2-bin.000007 gbichot2-bin.000008 | mysql
```

Agora, recuperamos os dados até o estado de terça-feira às 13h, mas ainda estamos faltando as alterações dessa data até à data do acidente. Para não perdê-las, teríamos precisado que o servidor MySQL armazenasse seus logs binários MySQL em um local seguro (discos RAID, SAN, etc.) diferente do local onde armazena seus arquivos de dados, para que esses logs não estivessem no disco destruído. (Ou seja, podemos iniciar o servidor com uma opção `--log-bin` que especifica um local em um dispositivo físico diferente do que contém o diretório de dados. Dessa forma, os logs estão seguros, mesmo que o dispositivo que contém o diretório seja perdido.) Se tivéssemos feito isso, teríamos o arquivo `gbichot2-bin.000009` (e quaisquer arquivos subsequentes) à mão, e poderíamos aplicá-los usando **mysqlbinlog** e **mysql** para restaurar as alterações de dados mais recentes sem perda até o momento do acidente:

```
$> mysqlbinlog gbichot2-bin.000009 ... | mysql
```

Para mais informações sobre o uso do **mysqlbinlog** para processar arquivos de log binário, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental) (Recuperação)”.

### 9.3.3 Resumo da Estratégia de Backup

Em caso de falha do sistema operacional ou falha de energia, o próprio `InnoDB` faz todo o trabalho de recuperação de dados. Mas para se certificar de que você pode dormir bem, observe as seguintes diretrizes:

* Sempre configure o servidor MySQL com registro binário habilitado (que é o ajuste padrão para o MySQL 8.0). Se você tiver mídia segura, essa técnica também pode ser boa para o balanceamento de carga do disco (o que resulta em uma melhoria de desempenho).

* Faça backups completos periódicos, usando o comando **mysqldump** mostrado anteriormente na Seção 9.3.1, “Estabelecimento de uma Política de Backup”, que faz um backup online, não bloqueando.

* Faça backups incrementais periódicos, apagando os logs com `FLUSH LOGS` ou **mysqladmin flush-logs**.