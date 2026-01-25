### 7.3.1 Estabelecendo uma Política de Backup

Para serem úteis, os Backups devem ser agendados regularmente. Um full backup (um snapshot dos dados em um ponto no tempo) pode ser feito no MySQL com várias ferramentas. Por exemplo, o MySQL Enterprise Backup pode realizar um physical backup de uma instância inteira, com otimizações para minimizar a sobrecarga e evitar a interrupção ao fazer backup de arquivos de dados `InnoDB`; o **mysqldump** fornece um logical backup online. Esta discussão utiliza o **mysqldump**.

Assuma que fazemos um full backup de todas as nossas tabelas `InnoDB` em todos os Databases usando o seguinte comando no Domingo às 13h, quando o load está baixo:

```sql
$> mysqldump --all-databases --master-data --single-transaction > backup_sunday_1_PM.sql
```

O arquivo `.sql` resultante produzido pelo **mysqldump** contém um conjunto de comandos SQL `INSERT` que podem ser usados para recarregar as tabelas que foram despejadas (dumped tables) posteriormente.

Esta operação de backup adquire um global read lock em todas as tabelas no início do dump (usando `FLUSH TABLES WITH READ LOCK`). Assim que este Lock é adquirido, as coordenadas do binary log são lidas e o Lock é liberado. Se comandos de atualização longos estiverem sendo executados quando o comando `FLUSH` for emitido, a operação de backup pode travar (stall) até que esses comandos terminem. Depois disso, o dump fica livre de Lock e não perturba as leituras e escritas nas tabelas.

Foi assumido anteriormente que as tabelas para backup são tabelas `InnoDB`, então `--single-transaction` usa um consistent read e garante que os dados vistos pelo **mysqldump** não mudem. (As alterações feitas por outros clientes nas tabelas `InnoDB` não são vistas pelo processo **mysqldump**.) Se a operação de backup incluir nontransactional tables, a consistency requer que elas não mudem durante o backup. Por exemplo, para as tabelas `MyISAM` no Database `mysql`, não deve haver alterações administrativas nas contas MySQL durante o backup.

Os full backups são necessários, mas nem sempre é conveniente criá-los. Eles produzem arquivos de backup grandes e levam tempo para serem gerados. Eles não são ideais no sentido de que cada full backup sucessivo inclui todos os dados, mesmo a parte que não foi alterada desde o full backup anterior. É mais eficiente fazer um full backup inicial e, em seguida, fazer incremental backups. Os incremental backups são menores e levam menos tempo para serem produzidos. O tradeoff (compromisso) é que, no momento da recovery, você não pode restaurar seus dados apenas recarregando o full backup. Você também deve processar os incremental backups para recuperar as alterações incrementais.

Para fazer incremental backups, precisamos salvar as alterações incrementais. No MySQL, essas alterações são representadas no binary log, portanto, o MySQL server deve ser sempre iniciado com a opção `--log-bin` para habilitar esse log. Com o binary logging habilitado, o servidor escreve cada alteração de dados em um arquivo enquanto atualiza os dados. Observando o data directory de um MySQL server que foi iniciado com a opção `--log-bin` e que está em execução há alguns dias, encontramos estes arquivos de binary log do MySQL:

```sql
-rw-rw---- 1 guilhem  guilhem   1277324 Nov 10 23:59 gbichot2-bin.000001
-rw-rw---- 1 guilhem  guilhem         4 Nov 10 23:59 gbichot2-bin.000002
-rw-rw---- 1 guilhem  guilhem        79 Nov 11 11:06 gbichot2-bin.000003
-rw-rw---- 1 guilhem  guilhem       508 Nov 11 11:08 gbichot2-bin.000004
-rw-rw---- 1 guilhem  guilhem 220047446 Nov 12 16:47 gbichot2-bin.000005
-rw-rw---- 1 guilhem  guilhem    998412 Nov 14 10:08 gbichot2-bin.000006
-rw-rw---- 1 guilhem  guilhem       361 Nov 14 10:07 gbichot2-bin.index
```

A cada reinicialização, o MySQL server cria um novo arquivo de binary log usando o próximo número na sequência. Enquanto o servidor estiver em execução, você também pode instruí-lo a fechar o arquivo de binary log atual e começar um novo manualmente emitindo um comando SQL `FLUSH LOGS` ou usando um comando **mysqladmin flush-logs**. O **mysqldump** também possui uma opção para fazer o flush dos logs. O arquivo `.index` no data directory contém a lista de todos os binary logs do MySQL no diretório.

Os binary logs do MySQL são importantes para a recovery porque formam o conjunto de incremental backups. Se você garantir que fará o flush dos logs ao realizar seu full backup, os arquivos de binary log criados posteriormente conterão todas as alterações de dados feitas desde o backup. Vamos modificar um pouco o comando **mysqldump** anterior para que ele faça o flush dos binary logs do MySQL no momento do full backup, e para que o arquivo dump contenha o nome do novo binary log atual:

```sql
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases > backup_sunday_1_PM.sql
```

Após executar este comando, o data directory contém um novo arquivo de binary log, `gbichot2-bin.000007`, porque a opção `--flush-logs` faz com que o servidor faça o flush de seus logs. A opção `--master-data` faz com que o **mysqldump** escreva informações de binary log em sua saída, de modo que o arquivo dump `.sql` resultante inclua estas linhas:

```sql
-- Position to start replication or point-in-time recovery from
-- CHANGE MASTER TO MASTER_LOG_FILE='gbichot2-bin.000007',MASTER_LOG_POS=4;
```

Como o comando **mysqldump** realizou um full backup, essas linhas significam duas coisas:

* O arquivo dump contém todas as alterações feitas antes de quaisquer alterações escritas no arquivo de binary log `gbichot2-bin.000007` ou superior.

* Todas as alterações de dados registradas após o backup não estão presentes no arquivo dump, mas estão presentes no arquivo de binary log `gbichot2-bin.000007` ou superior.

Na Segunda-feira às 13h, podemos criar um incremental backup fazendo o flush dos logs para iniciar um novo arquivo de binary log. Por exemplo, executar um comando **mysqladmin flush-logs** cria `gbichot2-bin.000008`. Todas as alterações entre o full backup de Domingo às 13h e Segunda-feira às 13h estão no arquivo `gbichot2-bin.000007`. Este incremental backup é importante, portanto, é uma boa ideia copiá-lo para um local seguro. (Por exemplo, faça backup em fita ou DVD, ou copie para outra máquina.) Na Terça-feira às 13h, execute outro comando **mysqladmin flush-logs**. Todas as alterações entre Segunda-feira às 13h e Terça-feira às 13h estão no arquivo `gbichot2-bin.000008` (que também deve ser copiado para um local seguro).

Os binary logs do MySQL ocupam espaço em disco. Para liberar espaço, faça o purge (limpeza) deles de tempos em tempos. Uma maneira de fazer isso é excluindo os binary logs que não são mais necessários, como quando fazemos um full backup:

```sql
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases --delete-master-logs > backup_sunday_1_PM.sql
```

Note

Excluir os binary logs do MySQL com **mysqldump --delete-master-logs** pode ser perigoso se o seu server for um replication source server, porque os replica servers podem não ter processado totalmente o conteúdo do binary log ainda. A descrição para o comando `PURGE BINARY LOGS` explica o que deve ser verificado antes de excluir os binary logs do MySQL. Consulte a Seção 13.4.1.1, “Comando PURGE BINARY LOGS”.