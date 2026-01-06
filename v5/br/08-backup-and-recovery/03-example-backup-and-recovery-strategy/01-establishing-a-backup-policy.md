### 7.3.1 Estabelecimento de uma Política de Backup

Para serem úteis, os backups devem ser agendados regularmente. Um backup completo (um instantâneo dos dados em um determinado momento) pode ser feito no MySQL com várias ferramentas. Por exemplo, o MySQL Enterprise Backup pode realizar um backup físico de uma instância inteira, com otimizações para minimizar o overhead e evitar interrupções ao fazer o backup de arquivos de dados do `InnoDB`; o **mysqldump** fornece backup lógico online. Esta discussão usa **mysqldump**.

Suponha que façamos um backup completo de todas as nossas tabelas `InnoDB` em todos os bancos de dados usando o seguinte comando no domingo, às 13h, quando a carga estiver baixa:

```sql
$> mysqldump --all-databases --master-data --single-transaction > backup_sunday_1_PM.sql
```

O arquivo `.sql` resultante produzido pelo **mysqldump** contém um conjunto de instruções `INSERT` SQL que podem ser usadas para recarregar as tabelas descarregadas posteriormente.

Esta operação de backup adquire um bloqueio de leitura global em todas as tabelas no início do dump (usando `FLUSH TABLES WITH READ LOCK`). Assim que esse bloqueio é adquirido, os endereços do log binário são lidos e o bloqueio é liberado. Se instruções de atualização longas estiverem em execução quando a instrução `FLUSH` for emitida, a operação de backup pode ficar paralisada até que essas instruções terminem. Após isso, o dump se torna livre de bloqueios e não interfere em leituras e escritas nas tabelas.

Anteriormente, acreditava-se que as tabelas de backup eram as tabelas `InnoDB`, então o `--single-transaction` usa uma leitura consistente e garante que os dados vistos pelo **mysqldump** não sejam alterados. (Alterações feitas por outros clientes nas tabelas `InnoDB` não são vistas pelo processo **mysqldump**.) Se a operação de backup incluir tabelas não transacionais, a consistência exige que elas não sejam alteradas durante o backup. Por exemplo, para as tabelas `MyISAM` no banco de dados `mysql`, não deve haver alterações administrativas nas contas do MySQL durante o backup.

Os backups completos são necessários, mas nem sempre é conveniente criá-los. Eles produzem arquivos de backup grandes e demoram para serem gerados. Eles não são ótimos no sentido de que cada backup completo sucessivo inclui todos os dados, mesmo a parte que não mudou desde o backup completo anterior. É mais eficiente fazer um backup completo inicial e, em seguida, fazer backups incrementais. Os backups incrementais são menores e demoram menos para serem produzidos. O sacrifício é que, no momento da recuperação, você não pode restaurar seus dados apenas recarregando o backup completo. Você também deve processar os backups incrementais para recuperar as alterações incrementais.

Para fazer backups incrementais, precisamos salvar as alterações incrementais. No MySQL, essas alterações são representadas no log binário, então o servidor MySQL deve ser sempre iniciado com a opção `--log-bin` para habilitar esse log. Com o registro binário habilitado, o servidor escreve cada alteração de dados em um arquivo enquanto atualiza os dados. Olhando para o diretório de dados de um servidor MySQL que foi iniciado com a opção `--log-bin` e que tem estado em execução por alguns dias, encontramos esses arquivos de log binário do MySQL:

```sql
-rw-rw---- 1 guilhem  guilhem   1277324 Nov 10 23:59 gbichot2-bin.000001
-rw-rw---- 1 guilhem  guilhem         4 Nov 10 23:59 gbichot2-bin.000002
-rw-rw---- 1 guilhem  guilhem        79 Nov 11 11:06 gbichot2-bin.000003
-rw-rw---- 1 guilhem  guilhem       508 Nov 11 11:08 gbichot2-bin.000004
-rw-rw---- 1 guilhem  guilhem 220047446 Nov 12 16:47 gbichot2-bin.000005
-rw-rw---- 1 guilhem  guilhem    998412 Nov 14 10:08 gbichot2-bin.000006
-rw-rw---- 1 guilhem  guilhem       361 Nov 14 10:07 gbichot2-bin.index
```

Cada vez que ele é reiniciado, o servidor MySQL cria um novo arquivo de log binário usando o próximo número na sequência. Enquanto o servidor estiver em execução, você também pode instruí-lo a fechar o arquivo de log binário atual e iniciar um novo manualmente, emitindo uma instrução SQL `FLUSH LOGS` ou com o comando **mysqladmin flush-logs**. O **mysqldump** também tem uma opção para limpar os logs. O arquivo `.index` no diretório de dados contém a lista de todos os logs binários do MySQL no diretório.

Os logs binários do MySQL são importantes para a recuperação, pois formam o conjunto de backups incrementais. Se você garantir que os logs sejam limpos quando fizer seu backup completo, os arquivos de log binário criados posteriormente conterão todas as alterações de dados feitas desde o backup. Vamos modificar o comando anterior do **mysqldump** um pouco para que ele limpe os logs binários do MySQL no momento do backup completo e para que o arquivo de dump contenha o nome do novo log binário atual:

```sql
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases > backup_sunday_1_PM.sql
```

Após executar este comando, o diretório de dados contém um novo arquivo de log binário, `gbichot2-bin.000007`, porque a opção `--flush-logs` faz o servidor esvaziar seus logs. A opção `--master-data` faz com que o **mysqldump** escreva informações de log binário em sua saída, então o arquivo de dump `.sql` resultante inclui essas linhas:

```sql
-- Position to start replication or point-in-time recovery from
-- CHANGE MASTER TO MASTER_LOG_FILE='gbichot2-bin.000007',MASTER_LOG_POS=4;
```

Como o comando **mysqldump** fez um backup completo, essas linhas significam duas coisas:

- O arquivo de implantação contém todas as alterações feitas antes de quaisquer alterações escritas no arquivo de log binário `gbichot2-bin.000007` ou superior.

- Todas as alterações de dados registradas após o backup não estão presentes no arquivo de dump, mas estão presentes no arquivo de log binário `gbichot2-bin.000007` ou superior.

Na segunda-feira, às 13h, podemos criar um backup incremental, descarregando os logs para começar um novo arquivo de log binário. Por exemplo, executar o comando **mysqladmin flush-logs** cria `gbichot2-bin.000008`. Todas as alterações entre o backup completo de domingo às 13h e o backup completo de segunda-feira às 13h estão no arquivo `gbichot2-bin.000007`. Esse backup incremental é importante, então é uma boa ideia copiá-lo para um local seguro. (Por exemplo, faça uma cópia em fita ou DVD, ou copie para outra máquina.) Na terça-feira, às 13h, execute outro comando **mysqladmin flush-logs**. Todas as alterações entre segunda-feira às 13h e terça-feira às 13h estão no arquivo `gbichot2-bin.000008` (que também deve ser copiado para um local seguro).

Os logs binários do MySQL ocupam espaço no disco. Para liberar espaço, elimine-os de tempos em tempos. Uma maneira de fazer isso é excluindo os logs binários que não são mais necessários, como quando fazemos um backup completo:

```sql
$> mysqldump --single-transaction --flush-logs --master-data=2 \
         --all-databases --delete-master-logs > backup_sunday_1_PM.sql
```

Nota

Excluir os logs binários do MySQL com **mysqldump --delete-master-logs** pode ser perigoso se o seu servidor for um servidor de origem de replicação, pois os servidores replicados ainda podem não ter processado completamente o conteúdo do log binário. A descrição da instrução `PURGE BINARY LOGS` explica o que deve ser verificado antes de excluir os logs binários do MySQL. Veja a Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”.
