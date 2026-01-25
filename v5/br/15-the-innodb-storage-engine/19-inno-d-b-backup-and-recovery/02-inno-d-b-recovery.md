### 14.19.2 Recuperação do InnoDB

Esta seção descreve a recuperação do `InnoDB`. Os tópicos incluem:

* Point-in-Time Recovery
* Recuperação de Corrupção de Dados ou Falha de Disco
* Crash Recovery (Recuperação de Falha) do InnoDB
* Descoberta de Tablespace Durante o Crash Recovery

#### Point-in-Time Recovery

Para recuperar um Database `InnoDB` até o momento atual a partir do momento em que o backup físico foi feito, você deve executar o servidor MySQL com o *binary logging* ativado, mesmo antes de fazer o backup. Para alcançar o *Point-in-Time Recovery* após restaurar um backup, você pode aplicar alterações do *binary log* que ocorreram depois que o backup foi feito. Consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.

#### Recuperação de Corrupção de Dados ou Falha de Disco

Se o seu Database for corrompido ou ocorrer uma falha de disco, você deve executar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup base, realize um *Point-in-Time Recovery* a partir dos arquivos do *binary log* usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após o backup ser feito.

Em alguns casos de corrupção do Database, é suficiente fazer *dump*, *drop* e recriar uma ou poucas *tables* corrompidas. Você pode usar o comando `CHECK TABLE` para verificar se uma *table* está corrompida, embora o `CHECK TABLE` naturalmente não consiga detectar todos os tipos possíveis de corrupção.

Em alguns casos, a aparente corrupção de página do Database é, na verdade, devido ao sistema operacional corromper seu próprio *file cache*, e os dados no disco podem estar OK. É melhor tentar reiniciar o computador primeiro. Fazer isso pode eliminar erros que pareciam ser corrupção de página do Database. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência do `InnoDB`, consulte a Seção 14.22.2, “Forcing InnoDB Recovery” para obter etapas para iniciar a instância em modo de *recovery*, o que permite que você faça o *dump* dos dados.

#### Crash Recovery do InnoDB

Para se recuperar de uma saída inesperada do servidor MySQL, o único requisito é reiniciar o servidor MySQL. O `InnoDB` verifica automaticamente os logs e realiza um *roll-forward* do Database até o presente. O `InnoDB` automaticamente realiza o *rollback* das transações não confirmadas que estavam presentes no momento do *crash*. Durante a recuperação, **mysqld** exibe uma saída semelhante a esta:

```sql
InnoDB: Log scan progressed past the checkpoint lsn 369163704
InnoDB: Doing recovery: scanned up to log sequence number 374340608
InnoDB: Doing recovery: scanned up to log sequence number 379583488
InnoDB: Doing recovery: scanned up to log sequence number 384826368
InnoDB: Doing recovery: scanned up to log sequence number 390069248
InnoDB: Doing recovery: scanned up to log sequence number 395312128
InnoDB: Doing recovery: scanned up to log sequence number 400555008
InnoDB: Doing recovery: scanned up to log sequence number 405797888
InnoDB: Doing recovery: scanned up to log sequence number 411040768
InnoDB: Doing recovery: scanned up to log sequence number 414724794
InnoDB: Database was not shutdown normally!
InnoDB: Starting crash recovery.
InnoDB: 1 transaction(s) which must be rolled back or cleaned up in
total 518425 row operations to undo
InnoDB: Trx id counter is 1792
InnoDB: Starting an apply batch of log records to the database...
InnoDB: Progress in percent: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37
38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59
60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81
82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99
InnoDB: Apply batch completed
...
InnoDB: Starting in background the rollback of uncommitted transactions
InnoDB: Rolling back trx with id 1511, 518425 rows to undo
...
InnoDB: Waiting for purge to start
InnoDB: 5.7.18 started; log sequence number 414724794
...
./mysqld: ready for connections.
```

O *Crash Recovery* do `InnoDB` consiste em várias etapas:

* Descoberta de Tablespace

  A Descoberta de Tablespace é o processo que o `InnoDB` usa para identificar os *tablespaces* que exigem aplicação do *redo log*. Consulte Descoberta de Tablespace Durante o *Crash Recovery*.

* Aplicação do Redo Log

  A aplicação do *Redo Log* é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem *flushed* do *Buffer Pool* para os *tablespaces* (arquivos `ibdata*` e `*.ibd`) no momento do desligamento ou *crash*, a aplicação do *Redo Log* é ignorada. O `InnoDB` também ignora a aplicação do *Redo Log* se os arquivos de *redo log* estiverem ausentes na inicialização.

  A remoção de *redo logs* para acelerar a recuperação não é recomendada, mesmo que alguma perda de dados seja aceitável. A remoção de *redo logs* deve ser considerada somente após um desligamento limpo (*clean shutdown*), com `innodb_fast_shutdown` definido como `0` ou `1`.

  Para obter informações sobre o processo que o `InnoDB` usa para identificar os *tablespaces* que exigem aplicação do *redo log*, consulte Descoberta de Tablespace Durante o *Crash Recovery*.

* Rollback de transações incompletas

  Transações incompletas são quaisquer transações que estavam ativas no momento da saída inesperada ou desligamento rápido (*fast shutdown*). O tempo que leva para realizar o *rollback* de uma transação incompleta pode ser três ou quatro vezes o tempo que uma transação fica ativa antes de ser interrompida, dependendo da carga do servidor.

  Você não pode cancelar transações que estão sendo submetidas a *rollback*. Em casos extremos, quando o *rollback* das transações deve levar um tempo excepcionalmente longo, pode ser mais rápido iniciar o `InnoDB` com uma configuração `innodb_force_recovery` de `3` ou superior. Consulte a Seção 14.22.2, “Forcing InnoDB Recovery”.

* Merge do Change Buffer

  Aplicação de alterações do *change buffer* (parte do *system tablespace*) às páginas *leaf* de *Secondary Indexes*, à medida que as páginas do *Index* são lidas para o *Buffer Pool*.

* Purge

  Exclusão de registros marcados para exclusão (*delete-marked records*) que não são mais visíveis para transações ativas.

As etapas que seguem a aplicação do *redo log* não dependem do *redo log* (exceto para logar as operações de escrita) e são realizadas em paralelo com o processamento normal. Destas, apenas o *rollback* de transações incompletas é exclusivo do *crash recovery*. O *insert buffer merge* e o *purge* são realizados durante o processamento normal.

Após a aplicação do *redo log*, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o *downtime*. Como parte do *crash recovery*, o `InnoDB` realiza o *rollback* de transações que não foram confirmadas ou que estavam em estado `XA PREPARE` quando o servidor encerrou. O *rollback* é realizado por uma *background thread*, executada em paralelo com transações de novas conexões. Até que a operação de *rollback* seja concluída, novas conexões podem encontrar conflitos de *locking* com transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido encerrado inesperadamente no meio de uma atividade intensa, o processo de recuperação ocorre automaticamente e nenhuma ação é exigida do DBA. Se uma falha de hardware ou um erro grave de sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Neste caso, consulte a Seção 14.22.2, “Forcing InnoDB Recovery”.

Para obter informações sobre o *binary log* e o *crash recovery* do `InnoDB`, consulte a Seção 5.4.4, “The Binary Log”.

#### Descoberta de Tablespace Durante o Crash Recovery

Se, durante a recuperação, o `InnoDB` encontrar *redo logs* escritos desde o último *checkpoint*, os *redo logs* devem ser aplicados aos *tablespaces* afetados. O processo que identifica os *tablespaces* afetados durante a recuperação é denominado *tablespace discovery* (descoberta de *tablespace*).

A *tablespace discovery* é realizada através da varredura de *redo logs* desde o último *checkpoint* até o final do *log* em busca de registros `MLOG_FILE_NAME` que são escritos quando uma página do *tablespace* é modificada. Um registro `MLOG_FILE_NAME` contém o *space ID* e o *file name* do *tablespace*.

Na inicialização, o `InnoDB` abre o *system tablespace* e o *redo log*. Se houver registros de *redo log* escritos desde o último *checkpoint*, os arquivos de *tablespace* afetados são abertos com base nos registros `MLOG_FILE_NAME`.

Registros `MLOG_FILE_NAME` são escritos para todos os tipos persistentes de *tablespace*, incluindo *file-per-table tablespaces*, *general tablespaces*, o *system tablespace* e *undo log tablespaces*.

A descoberta baseada em *Redo Log* tem as seguintes características:

* Apenas arquivos `*.ibd` de *tablespace* modificados desde o último *checkpoint* são acessados.

* Arquivos `*.ibd` de *tablespace* que não estão anexados à instância `InnoDB` são ignorados quando os *redo logs* são aplicados.

* Se os registros `MLOG_FILE_NAME` para o *system tablespace* não corresponderem à configuração do servidor que afeta os nomes dos arquivos de dados do *system tablespace*, a recuperação falha com um erro antes que os *redo logs* sejam aplicados.

* Se os arquivos de *tablespace* referenciados na porção varrida do *log* estiverem faltando, a inicialização é recusada.

* Os *Redo Logs* para arquivos `*.ibd` de *tablespace* ausentes são desconsiderados apenas se houver um registro de *redo log* de exclusão de arquivo (`MLOG_FILE_DELETE`) no *log*. Por exemplo, uma falha na renomeação de *table* pode resultar em um arquivo `*.ibd` "ausente" sem um registro `MLOG_FILE_DELETE`. Neste caso, você pode renomear manualmente o arquivo do *tablespace* e reiniciar o *crash recovery*, ou pode reiniciar o servidor em modo de *recovery* usando a opção `innodb_force_recovery`. Arquivos `*.ibd` ausentes são ignorados quando o servidor é iniciado em modo de *recovery*.

A descoberta baseada em *Redo Log*, introduzida no MySQL 5.7, substitui as varreduras de diretório que eram usadas em versões anteriores do MySQL para construir um mapa de "space ID para nome de arquivo de *tablespace*" que era necessário para aplicar os *redo logs*.