## 14.19 Backup e recuperação do InnoDB

Esta seção abrange tópicos relacionados ao backup e recuperação do `InnoDB`.

* Para informações sobre técnicas de backup aplicáveis a `InnoDB`, consulte a Seção 14.19.1, “Backup do InnoDB”.

* Para informações sobre recuperação em ponto no tempo, recuperação a partir de falhas ou corrupção de disco e como o `InnoDB` realiza a recuperação em caso de falha, consulte a Seção 14.19.2, “Recuperação InnoDB”.

### 14.19.1 Backup do InnoDB

A chave para a gestão segura de bancos de dados é fazer backups regulares. Dependendo do volume de dados, do número de servidores MySQL e da carga de trabalho do banco de dados, você pode usar essas técnicas de backup, sozinhas ou em combinação: backup quente com o MySQL Enterprise Backup; backup frio copiando arquivos enquanto o servidor MySQL está desligado; backup lógico com **mysqldump** para volumes de dados menores ou para registrar a estrutura dos objetos do esquema. Os backups quentes e frios são backups físicos que copiam arquivos de dados reais, que podem ser usados diretamente pelo servidor `mysqld` para uma restauração mais rápida.

Usar o *MySQL Enterprise Backup* é o método recomendado para fazer backup dos dados do `InnoDB`.

Nota

`InnoDB` não suporta bancos de dados que são restaurados usando ferramentas de backup de terceiros.

#### Copias de segurança quentes

O comando **mysqlbackup**, parte do componente MySQL Enterprise Backup, permite fazer backup de uma instância de MySQL em execução, incluindo as tabelas `InnoDB`, com mínima interrupção das operações e produção de um instantâneo consistente do banco de dados. Quando o **mysqlbackup** está copiando as tabelas `InnoDB`, as leituras e escritas nas tabelas `InnoDB` podem continuar. O MySQL Enterprise Backup também pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas e bancos de dados. Em conjunto com o log binário do MySQL, os usuários podem realizar recuperação em um ponto no tempo. O MySQL Enterprise Backup faz parte da assinatura do MySQL Enterprise. Para mais detalhes, consulte a Seção 28.1, “Visão geral do MySQL Enterprise Backup”.

#### Cópias de segurança frias

Se você puder desligar o servidor MySQL, pode fazer um backup físico que consiste em todos os arquivos usados pelo `InnoDB` para gerenciar suas tabelas. Use o procedimento a seguir:

1. Realize um desligamento lento do servidor MySQL e certifique-se de que ele pare sem erros.

2. Copie todos os arquivos de dados `InnoDB` (arquivos `ibdata` e arquivos `.ibd`) em um local seguro.

3. Copie todos os arquivos `.frm` para as tabelas `InnoDB` para um local seguro.

4. Copie todos os arquivos de registro `InnoDB` (arquivos `ib_logfile`) para um local seguro.

5. Copie seu arquivo de configuração `my.cnf` para um local seguro.

#### Resumos lógicos usando mysqldump

Além dos backups físicos, é recomendável que você crie regularmente backups lógicos, descarregando suas tabelas usando o **mysqldump**. Um arquivo binário pode ser corrompido sem que você perceba. As tabelas descarregadas são armazenadas em arquivos de texto que são legíveis para humanos, então é mais fácil identificar a corrupção da tabela. Além disso, como o formato é mais simples, a chance de corrupção de dados grave é menor. O **mysqldump** também tem uma opção `--single-transaction` para fazer um instantâneo consistente sem bloquear outros clientes. Veja a Seção 7.3.1, “Estabelecendo uma Política de Backup”.

A replicação funciona com as tabelas `InnoDB`, então você pode usar as capacidades de replicação do MySQL para manter uma cópia do seu banco de dados em locais de banco de dados que exigem alta disponibilidade. Veja a Seção 14.20, “InnoDB e replicação do MySQL”.

### 14.19.2 Recuperação do InnoDB

Esta seção descreve a recuperação de `InnoDB`. Os tópicos incluem:

* Recuperação em Ponto no Tempo
* Recuperação de dados corrompidos ou falha no disco
* Recuperação de falha do InnoDB
* Descoberta de tablespace durante a recuperação de falha

#### Recuperação em Ponto de Tempo

Para recuperar um banco de dados `InnoDB` até o momento em que o backup físico foi feito, você deve executar o servidor MySQL com registro binário habilitado, mesmo antes de fazer o backup. Para realizar a recuperação em um ponto específico após a restauração de um backup, você pode aplicar as alterações do registro binário que ocorreram após o backup ter sido feito. Veja a Seção 7.5, “Recuperação em Ponto de Tempo (Incremental)” (Recuperação).

#### Recuperação de corrupção de dados ou falha no disco

Se o seu banco de dados ficar corrompido ou ocorrer falha no disco, você deve realizar a recuperação usando um backup. No caso de corrupção, primeiro encontre um backup que não esteja corrompido. Após restaurar o backup básico, realize uma recuperação em um ponto no tempo a partir dos arquivos de registro binário usando **mysqlbinlog** e **mysql** para restaurar as alterações que ocorreram após a criação do backup.

Em alguns casos de corrupção de banco de dados, é suficiente descartar, eliminar e recriar uma ou algumas tabelas corruptas. Você pode usar a declaração `CHECK TABLE` para verificar se uma tabela está corrupta, embora `CHECK TABLE` naturalmente não possa detectar todo o tipo possível de corrupção.

Em alguns casos, a aparente corrupção da página do banco de dados é, na verdade, devido ao sistema operacional corromper seu próprio cache de arquivos, e os dados no disco podem estar em ordem. É melhor tentar reiniciar o computador primeiro. Isso pode eliminar erros que pareciam ser corrupção de página do banco de dados. Se o MySQL ainda tiver problemas para iniciar devido a problemas de consistência `InnoDB`, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB”, para obter os passos para iniciar a instância no modo de recuperação, o que lhe permite drenar os dados.

#### Recuperação de falha do InnoDB

Para se recuperar de uma saída inesperada do servidor MySQL, a única exigência é reiniciar o servidor MySQL. `InnoDB` verifica automaticamente os registros e realiza um avanço do banco de dados para o presente. `InnoDB` desfaz automaticamente as transações não comprometidas que estavam presentes no momento do acidente. Durante a recuperação, `mysqld` exibe uma saída semelhante a esta:

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

A recuperação de um `InnoDB` crash consiste em vários passos:

* Descoberta de tablespace

A descoberta de tablespace é o processo que o `InnoDB` utiliza para identificar os tablespace que requerem a aplicação do log de refazer. Veja Descoberta de tablespace durante a recuperação após o crash.

* Aplicação de registro refeito

A aplicação do log de refazer é realizada durante a inicialização, antes de aceitar quaisquer conexões. Se todas as alterações forem descarregadas do buffer pool para os espaços de tabelas (os arquivos `ibdata*` e `*.ibd`) no momento do desligamento ou do crash, a aplicação do log de refazer é ignorada. `InnoDB` também ignora a aplicação do log de refazer se os arquivos de log de refazer estiverem ausentes no início.

Não é recomendado remover os registros de refazer para acelerar a recuperação, mesmo que alguma perda de dados seja aceitável. A remoção dos registros de refazer só deve ser considerada após um desligamento limpo, com `innodb_fast_shutdown` definido como `0` ou `1`.

Para obter informações sobre o processo que o `InnoDB` utiliza para identificar os tablespaces que requerem a aplicação do log de refazer, consulte "Descoberta de tablespace durante a recuperação após o crash".

* Reversão de transações incompletas

As transações incompletas são aquelas que estavam ativas no momento da saída inesperada ou do desligamento rápido. O tempo necessário para reverter uma transação incompleta pode ser três ou quatro vezes o tempo que a transação permanece ativa antes de ser interrompida, dependendo da carga do servidor.

Você não pode cancelar transações que estão sendo revertidas. Em casos extremos, quando se espera que a reversão de transações leve um tempo excepcionalmente longo, pode ser mais rápido começar a `InnoDB` com um `innodb_force_recovery` de configuração de `3` ou superior. Veja a Seção 14.22.2, “Forçando a recuperação do InnoDB”.

* Fusão de buffer de alteração

Aplicar alterações do buffer de alterações (parte do espaço de tabela do sistema) às páginas de folha de índices secundários, à medida que as páginas do índice são lidas para o pool de buffer.

* Limpeza

Excluir registros marcados para exclusão que não são mais visíveis para transações ativas.

Os passos que se seguem à aplicação do log de refazer não dependem do log de refazer (exceto para registrar as escritas) e são realizados em paralelo com o processamento normal. Desses, apenas o rollback de transações incompletas é específico para a recuperação de falhas. A fusão do buffer de inserção e a purga são realizadas durante o processamento normal.

Após a aplicação do log de refazer, o `InnoDB` tenta aceitar conexões o mais cedo possível, para reduzir o tempo de inatividade. Como parte da recuperação em caso de falha, o `InnoDB` desfaz as transações que não foram comprometidas ou estavam no estado do `XA PREPARE` quando o servidor saiu. O desfazimento é realizado por um thread de fundo, executado em paralelo com as transações de novas conexões. Até que a operação de desfazimento seja concluída, novas conexões podem encontrar conflitos de bloqueio com as transações recuperadas.

Na maioria das situações, mesmo que o servidor MySQL tenha sido interrompido inesperadamente durante uma atividade intensa, o processo de recuperação acontece automaticamente e não é necessário que o DBA tome nenhuma ação. Se uma falha de hardware ou um erro grave no sistema corromper os dados do `InnoDB`, o MySQL pode se recusar a iniciar. Nesse caso, consulte a Seção 14.22.2, “Forçando a recuperação do InnoDB”.

Para informações sobre o registro binário e a recuperação de falhas de `InnoDB`, consulte a Seção 5.4.4, “O Registro Binário”.

#### Descoberta de Tablespace durante a recuperação de falha

Se, durante a recuperação, o `InnoDB` encontrar registros de refazer escritos desde o último ponto de verificação, os registros de refazer devem ser aplicados aos espaços de tabela afetados. O processo que identifica os espaços de tabela afetados durante a recuperação é denominado *descoberta de espaço de tabela*.

A descoberta do tablespace é realizada ao digitalizar os registros do log redo do último ponto de verificação até o final do log para registros `MLOG_FILE_NAME` que são escritos quando uma página do tablespace é modificada. Um registro `MLOG_FILE_NAME` contém o ID do espaço do tablespace e o nome do arquivo.

Ao iniciar, `InnoDB` abre o espaço de tabela do sistema e o log de refazer. Se houver registros de log de refazer escritos desde o último ponto de verificação, os arquivos do espaço de tabela afetados são abertos com base nos registros de `MLOG_FILE_NAME`.

Os registros `MLOG_FILE_NAME` são escritos para todos os tipos de espaço de tabela persistente, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema e os espaços de tabela de registro de desfazer.

A descoberta baseada em re-log tem as seguintes características:

* Apenas os arquivos do espaço de tabela `*.ibd` modificados desde o último ponto de verificação são acessados.

* Os arquivos do tablespace `*.ibd` que não estão anexados à instância `InnoDB` são ignorados quando os registros de refazer são aplicados.

* Se os registros `MLOG_FILE_NAME` para o espaço de tabela do sistema não corresponderem à configuração do servidor que afeta os nomes dos arquivos de dados do espaço de tabela do sistema, a recuperação falha com um erro antes que os registros de redo sejam aplicados.

* Se os arquivos do tablespace referenciados na parte analisada do log estiverem ausentes, a inicialização será recusada.

Os registros de refazer para arquivos de espaço de tabela ausentes `*.ibd` são ignorados apenas se houver um registro de log de refazer de exclusão de arquivo `MLOG_FILE_DELETE` no log. Por exemplo, uma falha no renomeamento de uma tabela pode resultar em um arquivo `*.ibd` "ausente" sem um registro `MLOG_FILE_DELETE`. Neste caso, você pode renomear manualmente o arquivo do espaço de tabela e reiniciar a recuperação de falhas, ou você pode reiniciar o servidor no modo de recuperação usando a opção `innodb_force_recovery`. Arquivos `*.ibd` ausentes são ignorados quando o servidor é iniciado no modo de recuperação.

A descoberta baseada em redo-log, introduzida no MySQL 5.7, substitui as varreduras de diretório que eram usadas em versões anteriores do MySQL para construir um mapa de “nome de arquivo de espaço ID-to-tablespace” que era necessário para aplicar logs de redo.