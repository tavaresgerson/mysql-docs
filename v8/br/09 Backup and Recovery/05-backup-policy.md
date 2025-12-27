### 9.3.1 Estabelecendo uma Política de Backup

Para serem úteis, os backups devem ser agendados regularmente. Um backup completo (um instantâneo dos dados em um determinado momento) pode ser feito no MySQL com várias ferramentas. Por exemplo, o MySQL Enterprise Backup pode realizar um backup físico de toda a instância, com otimizações para minimizar o overhead e evitar interrupções ao fazer o backup de arquivos de dados `InnoDB`; o `mysqldump` fornece backup lógico online. Esta discussão usa `mysqldump`.

Suponha que façamos um backup completo de todas as tabelas `InnoDB` em todos os bancos de dados usando o seguinte comando no domingo às 13h, quando a carga é baixa:

```
$> mysqldump --all-databases --source-data --single-transaction > backup_sunday_1_PM.sql
```

O arquivo `.sql` resultante produzido pelo `mysqldump` contém um conjunto de declarações `INSERT` SQL que podem ser usadas para recarregar as tabelas descarregadas mais tarde.

Esta operação de backup adquire um bloqueio de leitura global em todas as tabelas no início do dump (usando `FLUSH TABLES WITH READ LOCK`). Assim que este bloqueio é adquirido, os endereços de log binário são lidos e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a declaração `FLUSH` for emitida, a operação de backup pode ficar paralisada até que essas declarações terminem. Após isso, o dump se torna livre de bloqueios e não interfere em leituras e escritas nas tabelas.

Antigamente, foi assumido que as tabelas a serem salvas eram tabelas `InnoDB`, então `--single-transaction` usa uma leitura consistente e garante que os dados vistos pelo `mysqldump` não mudem. (Alterações feitas por outros clientes nas tabelas `InnoDB` não são vistas pelo processo `mysqldump`). Se a operação de backup incluir tabelas não transacionais, a consistência exige que elas não mudem durante o backup. Por exemplo, para as tabelas `MyISAM` no banco de dados `mysql`, não deve haver alterações administrativas nas contas do MySQL durante o backup.

Cópias de segurança completas são necessárias, mas nem sempre é conveniente criá-las. Elas produzem arquivos de backup grandes e demoram para serem gerados. Elas não são ótimas no sentido de que cada backup completo sucessivo inclui todos os dados, mesmo a parte que não mudou desde o backup completo anterior. É mais eficiente fazer um backup completo inicial e, em seguida, fazer backups incrementais. Os backups incrementais são menores e demoram menos para serem gerados. O sacrifício é que, no momento da recuperação, você não pode restaurar seus dados apenas recarregando o backup completo. Você também deve processar os backups incrementais para recuperar as alterações incrementais.

Para fazer backups incrementais, precisamos salvar as alterações incrementais. No MySQL, essas alterações são representadas no log binário, então o servidor MySQL deve ser iniciado sempre com a opção `--log-bin` para habilitar esse log. Com o registro binário habilitado, o servidor escreve cada mudança de dados em um arquivo enquanto atualiza os dados. Olhando para o diretório de dados de um servidor MySQL que está rodando há alguns dias, encontramos esses arquivos de log binário MySQL:

```
-rw-rw---- 1 guilhem  guilhem   1277324 Nov 10 23:59 gbichot2-bin.000001
-rw-rw---- 1 guilhem  guilhem         4 Nov 10 23:59 gbichot2-bin.000002
-rw-rw---- 1 guilhem  guilhem        79 Nov 11 11:06 gbichot2-bin.000003
-rw-rw---- 1 guilhem  guilhem       508 Nov 11 11:08 gbichot2-bin.000004
-rw-rw---- 1 guilhem  guilhem 220047446 Nov 12 16:47 gbichot2-bin.000005
-rw-rw---- 1 guilhem  guilhem    998412 Nov 14 10:08 gbichot2-bin.000006
-rw-rw---- 1 guilhem  guilhem       361 Nov 14 10:07 gbichot2-bin.index
```

Cada vez que ele reinicia, o servidor MySQL cria um novo arquivo de log binário usando o próximo número na sequência. Enquanto o servidor estiver rodando, você também pode dizer a ele para fechar o arquivo de log binário atual e começar um novo manualmente emitindo uma declaração SQL `FLUSH LOGS` ou com o comando `mysqladmin flush-logs`. O `mysqldump` também tem uma opção para limpar os logs. O arquivo `.index` no diretório de dados contém a lista de todos os logs binários MySQL no diretório.

Os logs binários do MySQL são importantes para a recuperação porque formam o conjunto de backups incrementais. Se você garantir que os logs sejam descarregados quando fizer seu backup completo, os arquivos de log binário criados posteriormente conterão todas as alterações de dados feitas desde o backup. Vamos modificar o comando anterior de `mysqldump` um pouco para que ele descarregue os logs binários do MySQL no momento do backup completo, e para que o arquivo de dump contenha o nome do novo log binário atual:

```
$> mysqldump --single-transaction --flush-logs --source-data=2 \
         --all-databases > backup_sunday_1_PM.sql
```

Após executar este comando, o diretório de dados contém um novo arquivo de log binário, `gbichot2-bin.000007`, porque a opção `--flush-logs` faz o servidor descarregar seus logs. A opção `--source-data` faz com que o `mysqldump` escreva informações de log binário em sua saída, então o arquivo de dump resultante `.sql` inclui essas linhas:

```
-- Position to start replication or point-in-time recovery from
-- CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='gbichot2-bin.000007',SOURCE_LOG_POS=4;
```

Como o comando `mysqldump` fez um backup completo, essas linhas significam duas coisas:

* O arquivo de dump contém todas as alterações feitas antes de quaisquer alterações escritas no arquivo de log binário `gbichot2-bin.000007` ou superior.
* Todas as alterações de dados registradas após o backup não estão presentes no arquivo de dump, mas estão presentes no arquivo de log binário `gbichot2-bin.000007` ou superior.

Na segunda-feira, às 13h, podemos criar um backup incremental descarregando os logs para começar um novo arquivo de log binário. Por exemplo, executar um comando `mysqladmin flush-logs` cria `gbichot2-bin.000008`. Todas as alterações entre o backup completo de domingo às 13h e a segunda-feira às 13h são escritas em `gbichot2-bin.000007`. Este backup incremental é importante, então é uma boa ideia copiá-lo para um local seguro. (Por exemplo, faça uma cópia em fita ou DVD, ou copie para outra máquina.) Na terça-feira, às 13h, execute outro comando `mysqladmin flush-logs`. Todas as alterações entre segunda-feira às 13h e terça-feira às 13h são escritas em `gbichot2-bin.000008` (que também deve ser copiado para algum lugar seguro).

Os logs binários do MySQL ocupam espaço no disco. Para liberar espaço, purgue-os de tempos em tempos. Uma maneira de fazer isso é excluindo os logs binários que não são mais necessários, como quando fazemos um backup completo:

```
$> mysqldump --single-transaction --flush-logs --source-data=2 \
         --all-databases --delete-source-logs > backup_sunday_1_PM.sql
```

::: info Nota

Excluir os logs binários do MySQL com `mysqldump` `--delete-source-logs` pode ser perigoso se o seu servidor for um servidor de origem de replicação, porque as réplicas ainda podem não ter processado completamente o conteúdo do log binário. A descrição da instrução `PURGE BINARY LOGS` explica o que deve ser verificado antes de excluir os logs binários do MySQL. Veja a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.