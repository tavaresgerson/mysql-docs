### 14.19.2 Recuperação do InnoDB

Esta seção descreve a recuperação do `InnoDB`. Os tópicos incluem:

- Recuperação no Ponto de Tempo
- Recuperação de corrupção de dados ou falha no disco
- Recuperação de falha do InnoDB
- Descoberta de Tablespace durante a recuperação de falhas

#### Recuperação no Ponto de Tempo

Para recuperar um banco de dados `InnoDB` até o momento atual a partir do momento em que o backup físico foi feito, você deve executar o servidor MySQL com o registro binário habilitado, mesmo antes de fazer o backup. Para realizar a recuperação em um ponto específico após restaurar um backup, você pode aplicar as alterações do log binário que ocorreram após o backup ter sido feito. Veja a Seção 7.5, “Recuperação em Ponto Específico (Incremental)”).

#### Recuperação de corrupção de dados ou falha no disco

Se o seu banco de dados ficar corrompido ou ocorrer uma falha no disco, você deve realizar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup básico, realize uma recuperação em um ponto no tempo a partir dos arquivos de log binário usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após a criação do backup.

Em alguns casos de corrupção de banco de dados, é suficiente fazer o dump, drop e recriar uma ou algumas tabelas corrompidas. Você pode usar a instrução `CHECK TABLE` para verificar se uma tabela está corrompida, embora a `CHECK TABLE` naturalmente não possa detectar todos os tipos possíveis de corrupção.

Em alguns casos, a aparente corrupção da página do banco de dados é, na verdade, devido ao sistema operacional corromper seu próprio cache de arquivos, e os dados no disco podem estar em ordem. É melhor tentar reiniciar o computador primeiro. Isso pode eliminar erros que pareciam ser corrupção de página do banco de dados. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência do `InnoDB`, consulte a Seção 14.22.2, “Forçar a Recuperação do InnoDB”, para obter etapas para iniciar a instância no modo de recuperação, o que permite que você faça o dump dos dados.

#### Recuperação de falha do InnoDB

Para se recuperar de uma inesperada saída do servidor MySQL, a única exigência é reiniciar o servidor MySQL. O `InnoDB` verifica automaticamente os logs e realiza um avanço no banco de dados até o momento atual. O `InnoDB` desfaz automaticamente as transações não confirmadas que estavam presentes no momento do crash. Durante a recuperação, o **mysqld** exibe uma saída semelhante à seguinte:

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

A recuperação de falhas do InnoDB consiste em várias etapas:

- Descoberta do espaço de tabela

  A descoberta do tablespace é o processo que o `InnoDB` usa para identificar os tablespaces que precisam da aplicação do log de redo. Veja Descoberta de Tablespace durante a Recuperação após Falha.

- Aplicação de registro de refaça

  A aplicação do log de refazer é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem descarregadas do pool de buffer para os espaços de tabelas (`ibdata*` e arquivos `.ibd`) no momento do desligamento ou do crash, a aplicação do log de refazer é ignorada. O `InnoDB` também ignora a aplicação do log de refazer se os arquivos de log de refazer estiverem ausentes no momento do início.

  Não é recomendado remover os registros de rollback para acelerar a recuperação, mesmo que a perda de dados seja aceitável. A remoção dos registros de rollback só deve ser considerada após um desligamento limpo, com `innodb_fast_shutdown` definido como `0` ou `1`.

  Para obter informações sobre o processo que o `InnoDB` usa para identificar os tablespaces que exigem a aplicação do log de refazer, consulte "Descoberta de tablespace durante a recuperação após falha".

- Reverter transações incompletas

  As transações incompletas são aquelas que estavam ativas no momento da saída inesperada ou do desligamento rápido. O tempo necessário para reverter uma transação incompleta pode ser três ou quatro vezes o tempo que a transação está ativa antes de ser interrompida, dependendo da carga do servidor.

  Você não pode cancelar transações que estão sendo revertidas. Em casos extremos, quando se espera que a reversão de transações leve um tempo excepcionalmente longo, pode ser mais rápido iniciar o `InnoDB` com um valor de configuração `innodb_force_recovery` de 3 ou superior. Consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

- Mudar a fusão do buffer

  Aplicar alterações do buffer de alterações (parte do espaço de tabela do sistema) às páginas de folha de índices secundários, à medida que as páginas do índice são lidas para o pool de buffer.

- Limpeza

  Excluir registros marcados para exclusão que não são mais visíveis para transações ativas.

Os passos que se seguem à aplicação do log de reversão não dependem do log de reversão (exceto para registrar as escritas) e são realizados em paralelo com o processamento normal. Desses, apenas o rollback de transações incompletas é específico para a recuperação de falhas. A fusão do buffer de inserção e a purga são realizadas durante o processamento normal.

Após a aplicação do log de refazer, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o tempo de inatividade. Como parte da recuperação em caso de falha, o `InnoDB` desfaz transações que não foram confirmadas ou no estado `XA PREPARE` quando o servidor foi encerrado. O desfazimento é realizado por um thread de segundo plano, executado em paralelo com as transações de novas conexões. Até que a operação de desfazimento seja concluída, novas conexões podem encontrar conflitos de bloqueio com as transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido interrompido inesperadamente durante uma atividade intensa, o processo de recuperação acontece automaticamente e não é necessário que o DBA tome nenhuma ação. Se uma falha de hardware ou um erro grave no sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Nesse caso, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”.

Para obter informações sobre o registro binário e a recuperação de falhas do `InnoDB`, consulte a Seção 5.4.4, “O Registro Binário”.

#### Descoberta de Tablespace durante a recuperação de falhas

Se, durante a recuperação, o `InnoDB` encontrar logs de refazer escritos desde o último ponto de verificação, os logs de refazer devem ser aplicados aos espaços de tabelas afetados. O processo que identifica os espaços de tabelas afetados durante a recuperação é chamado de *descoberta de espaço de tabela*.

A descoberta do espaço de tabela é realizada ao analisar os registros do log redo do último ponto de verificação até o final do log para `MLOG_FILE_NAME` que são escritos quando uma página do espaço de tabela é modificada. Um registro `MLOG_FILE_NAME` contém o ID do espaço de tabela e o nome do arquivo.

Ao iniciar, o `InnoDB` abre o espaço de tabela do sistema e o log de refazer. Se houver registros do log de refazer escritos desde o último ponto de verificação, os arquivos do espaço de tabela afetados são abertos com base nos registros `MLOG_FILE_NAME`.

Os registros `MLOG_FILE_NAME` são escritos para todos os tipos de espaço de tabela persistente, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema e espaços de log de desfazer.

A descoberta baseada em redo-log tem as seguintes características:

- Apenas os arquivos de espaço de tabela `*.ibd` modificados desde o último ponto de verificação são acessados.

- Os arquivos `*.ibd` do tablespace que não estão vinculados à instância do `InnoDB` são ignorados quando os logs de redo são aplicados.

- Se os registros `MLOG_FILE_NAME` das tabelas do espaço de sistema não corresponderem às configurações do servidor que afetam os nomes dos arquivos de dados do espaço de sistema, a recuperação falhará com um erro antes que os registros de redo sejam aplicados.

- Se os arquivos do tablespace referenciados na parte analisada do log estiverem ausentes, o início será recusado.

- Os registros de refazer para arquivos de espaço de tabela ausentes `*.ibd` são ignorados apenas se houver um registro de log de refazer de exclusão de arquivo (`MLOG_FILE_DELETE`) no log. Por exemplo, uma falha de renomeação de tabela pode resultar em um arquivo `*.ibd` "ausente" sem um registro `MLOG_FILE_DELETE`. Nesse caso, você pode renomear manualmente o arquivo do espaço de tabela e reiniciar a recuperação de falhas, ou você pode reiniciar o servidor no modo de recuperação usando a opção `innodb_force_recovery`. Arquivos `*.ibd` ausentes são ignorados quando o servidor é iniciado no modo de recuperação.

A descoberta baseada em logs de refazimento, introduzida no MySQL 5.7, substitui as varreduras de diretório que eram usadas em versões anteriores do MySQL para construir um mapa de "nome de arquivo de espaço ID para espaço de tabela" que era necessário para aplicar logs de refazimento.
