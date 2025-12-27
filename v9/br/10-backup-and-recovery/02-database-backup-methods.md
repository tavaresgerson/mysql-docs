## 9.2 Métodos de Backup de Banco de Dados

Esta seção resume alguns métodos gerais para fazer backups.

### Fazendo um Backup Quente com o MySQL Enterprise Backup

Clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups físicos de instâncias inteiras ou bancos de dados, tabelas selecionados ou ambos. Este produto inclui recursos para backups incrementais e comprimidos. Fazer o backup dos arquivos do banco de dados físico torna o restauro muito mais rápido do que técnicas lógicas, como o comando `mysqldump`. As tabelas `InnoDB` são copiadas usando um mecanismo de backup quente. (Idealmente, as tabelas `InnoDB` devem representar uma maioria substancial dos dados.) As tabelas de outros motores de armazenamento são copiadas usando um mecanismo de backup morno. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

### Fazendo Backups com mysqldump

O programa **mysqldump** pode fazer backups. Ele pode fazer backups de todos os tipos de tabelas. (Veja a Seção 9.4, “Usando mysqldump para Backups”.)

Para tabelas `InnoDB`, é possível realizar um backup online que não bloqueia as tabelas usando a opção `--single-transaction` para **mysqldump**. Veja a Seção 9.3.1, “Estabelecendo uma Política de Backup”.

### Fazendo Backups Copiando Arquivos de Tabela

Tabelas MyISAM podem ser backupadas copiando arquivos de tabela (`arquivos *.MYD`, `*.MYI` e arquivos associados `*.sdi`). Para obter um backup consistente, pare o servidor ou bloqueie e limpe as tabelas relevantes:

```
FLUSH TABLES tbl_list WITH READ LOCK;
```

Você precisa apenas de um bloqueio de leitura; isso permite que outros clientes continuem a consultar as tabelas enquanto você está fazendo uma cópia dos arquivos no diretório do banco de dados. O esvaziamento é necessário para garantir que todas as páginas de índice ativas sejam escritas no disco antes de iniciar o backup. Veja a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”, e a Seção 15.7.8.3, “Instrução FLUSH”.

Você também pode criar um backup binário simplesmente copiando os arquivos da tabela, desde que o servidor não esteja atualizando nada. (Mas note que os métodos de cópia de arquivos de tabela não funcionam se o seu banco de dados contiver tabelas `InnoDB`. Além disso, mesmo que o servidor não esteja atualizando ativamente os dados, o `InnoDB` ainda pode ter dados modificados cacheados na memória e não esvaziados para o disco.)

Para um exemplo desse método de backup, consulte o exemplo de exportação e importação na Seção 15.2.6, “Instrução IMPORT TABLE”.

### Fazendo Backups de Arquivos de Texto Com Delimitadores

Para criar um arquivo de texto contendo os dados de uma tabela, você pode usar `SELECT * INTO OUTFILE 'nome_do_arquivo' FROM tbl_name`. O arquivo é criado no host do servidor MySQL, não no host do cliente. Para essa instrução, o arquivo de saída não pode já existir porque permitir que arquivos sejam sobrescritos constitui um risco de segurança. Veja a Seção 15.2.13, “Instrução SELECT”. Esse método funciona para qualquer tipo de arquivo de dados, mas salva apenas os dados da tabela, não a estrutura da tabela.

Outra maneira de criar arquivos de dados de texto (junto com arquivos contendo instruções `CREATE TABLE` para as tabelas de backup) é usar o **mysqldump** com a opção `--tab`. Veja a Seção 9.4.3, “Dumping de Dados em Formato de Texto Com Delimitadores com mysqldump”.

Para recarregar um arquivo de dados de texto delimitado, use `LOAD DATA` ou **mysqlimport**.

O MySQL suporta backups incrementais usando o log binário. Os arquivos de log binário fornecem as informações necessárias para replicar as alterações no banco de dados feitas após o ponto em que você realizou um backup. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o registro binário deve ser habilitado nele, que é o ajuste padrão para o MySQL 9.5; veja a Seção 7.4.4, “O Log Binário”.

No momento em que você deseja fazer um backup incremental (contendo todas as alterações que ocorreram desde o último backup completo ou incremental), você deve rotular o log binário usando `FLUSH LOGS`. Feito isso, você precisa copiar para o local de backup todos os logs binários que vão do momento do último backup completo ou incremental até o último, mas não o último. Esses logs binários são o backup incremental; no momento do restauro, você os aplica como explicado na Seção 9.5, “Recuperação no Ponto no Tempo (Incremental)” (Recovery"). A próxima vez que você fizer um backup completo, você também deve rotular o log binário usando `FLUSH LOGS` ou **mysqldump --flush-logs**. Veja a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

### Fazendo Backups Usando Replicas

Se você tiver problemas de desempenho com um servidor ao fazer backups, uma estratégia que pode ajudar é configurar a replicação e realizar backups na replica em vez da fonte. Veja a Seção 19.4.1, “Usando a Replicação para Backups”.

Se você está fazendo um backup de uma replica, você deve fazer o backup do repositório de metadados da conexão e do repositório de metadados do aplicador (consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”) ao fazer o backup dos bancos de dados da replica, independentemente do método de backup que você escolher. Essas informações são sempre necessárias para retomar a replicação após restaurar os dados da replica. Se sua replica estiver replicando instruções `LOAD DATA`, você também deve fazer o backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `replica_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.

### Recuperação de Tabelas Corrompidas

Se você tiver que restaurar tabelas `MyISAM` que se tornaram corrompidas, tente recuperá-las usando `REPAIR TABLE` ou **myisamchk -r** primeiro. Isso deve funcionar em 99,9% de todos os casos. Se o **myisamchk** falhar, consulte a Seção 9.6, “Manutenção e Recuperação de Falhas de Tabelas MyISAM”.

### Fazendo Backups Usando um Instantâneo do Sistema de Arquivos

Se você estiver usando um sistema de arquivos Veritas, você pode fazer um backup assim:

1. De um programa cliente, execute `FLUSH TABLES WITH READ LOCK`.

2. De outro shell, execute `mount vxfs snapshot`.

3. Do primeiro cliente, execute `UNLOCK TABLES`.

4. Copie os arquivos do snapshot.

5. Desmonte o snapshot.

Capacidades de snapshot semelhantes podem estar disponíveis em outros sistemas de arquivos, como LVM ou ZFS.