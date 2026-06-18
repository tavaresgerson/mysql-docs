## 7.2 Métodos de backup de banco de dados

Esta seção resume alguns métodos gerais para fazer backups.

### Fazendo um backup quente com o MySQL Enterprise Backup

Os clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups físicos de instâncias inteiras ou bancos de dados, tabelas ou ambas selecionadas. Este produto inclui recursos para backups incrementais e comprimidos. Fazer backup dos arquivos do banco de dados físico torna o processo de restauração muito mais rápido do que técnicas lógicas, como o comando `mysqldump`. As tabelas `InnoDB` são copiadas usando um mecanismo de backup quente. (Idealmente, as tabelas `InnoDB` devem representar uma maioria substancial dos dados.) As tabelas de outros motores de armazenamento são copiadas usando um mecanismo de backup frio. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “MySQL Enterprise Backup Overview”.

### Fazer backups com mysqldump

O programa **mysqldump** pode fazer backups. Ele pode fazer backups de todos os tipos de tabelas. (Veja a Seção 7.4, “Usando mysqldump para backups”).

Para as tabelas do InnoDB, é possível realizar um backup online que não bloqueia as tabelas usando a opção **--single-transaction** no **mysqldump**. Veja a Seção 7.3.1, “Estabelecendo uma Política de Backup”.

### Fazer backups copiando arquivos de tabela

Para motores de armazenamento que representam cada tabela usando seus próprios arquivos, as tabelas podem ser protegidas por meio da cópia desses arquivos. Por exemplo, as tabelas `MyISAM` são armazenadas como arquivos, então é fácil fazer uma cópia por meio da cópia de arquivos (`arquivos *.frm`, `*.MYD` e `*.MYI`). Para obter uma cópia consistente, pare o servidor ou bloqueie e limpe as tabelas relevantes:

```sql
FLUSH TABLES tbl_list WITH READ LOCK;
```

Você só precisa de um bloqueio de leitura; isso permite que outros clientes continuem a consultar as tabelas enquanto você está fazendo uma cópia dos arquivos no diretório do banco de dados. O esvaziamento é necessário para garantir que todas as páginas de índice ativas sejam escritas no disco antes de iniciar o backup. Veja a Seção 13.3.5, “Instruções LOCK TABLES e UNLOCK TABLES” e a Seção 13.7.6.3, “Instrução FLUSH”.

Você também pode criar um backup binário simplesmente copiando todos os arquivos de tabela, desde que o servidor não esteja atualizando nada. (Mas observe que os métodos de cópia de arquivos de tabela não funcionam se o banco de dados contiver tabelas `InnoDB`. Além disso, mesmo que o servidor não esteja atualizando ativamente os dados, o `InnoDB` ainda pode ter dados modificados armazenados em cache na memória e não descarregados no disco.)

### Fazer backups de arquivos de texto delimitados

Para criar um arquivo de texto contendo os dados de uma tabela, você pode usar `SELECT * INTO OUTFILE 'nome_do_arquivo' FROM tbl_name`. O arquivo é criado no host do servidor MySQL, não no host do cliente. Para essa instrução, o arquivo de saída não pode já existir, pois permitir que arquivos sejam sobrescritos constitui um risco de segurança. Veja a Seção 13.2.9, “Instrução SELECT”. Esse método funciona para qualquer tipo de arquivo de dados, mas salva apenas os dados da tabela, não a estrutura da tabela.

Outra maneira de criar arquivos de dados de texto (junto com arquivos que contêm instruções `CREATE TABLE` para as tabelas de backup) é usar o **mysqldump** com a opção `--tab`. Veja a Seção 7.4.3, “Dump de Dados em Formato de Texto Com Delimitadores com mysqldump”.

Para recarregar um arquivo de dados de texto delimitado, use `LOAD DATA` ou **mysqlimport**.

### Fazer backups incrementais ativando o log binário

O MySQL suporta backups incrementais: você deve iniciar o servidor com a opção `--log-bin` para habilitar o registro binário; veja a Seção 5.4.4, “O Log Binário”. Os arquivos de log binário fornecem as informações necessárias para replicar as alterações no banco de dados feitas após o ponto em que você realizou um backup. No momento em que você deseja fazer um backup incremental (contendo todas as alterações que ocorreram desde o último backup completo ou incremental), você deve rotular o log binário usando `FLUSH LOGS`. Feito isso, você precisa copiar para o local de backup todos os logs binários que vão desde o momento do último backup completo ou incremental até o último, mas não o último. Esses logs binários são o backup incremental; no momento do restauro, você os aplica conforme explicado na Seção 7.5, “Recuperação Ponto no Tempo (Incremental”)”). A próxima vez que você fizer um backup completo, você também deve rotular o log binário usando `FLUSH LOGS` ou \*\*mysqldump --flush-logs\`. Veja a Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

### Fazer backups usando réplicas

Se você tiver problemas de desempenho com o servidor de origem durante a realização de backups, uma estratégia que pode ajudar é configurar a replicação e realizar backups na replica em vez do servidor de origem. Consulte a Seção 16.3.1, “Usando a Replicação para Backups”.

Se você está fazendo backup de um servidor replica, você deve fazer backup dos repositórios de informações de origem e logs de retransmissão (consulte a Seção 16.2.4, “Repositórios de Metadados de Log de Retransmissão e Replicação”) ao fazer o backup dos bancos de dados da replica, independentemente do método de backup que você escolher. Esses arquivos de informações são sempre necessários para retomar a replicação após restaurar os dados da replica. Se sua replica estiver replicando instruções `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `slave_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.

### Recuperação de tabelas corrompidas

Se você precisar restaurar tabelas `MyISAM` que se tornaram corrompidas, tente recuperá-las primeiro usando `REPAIR TABLE` ou **myisamchk -r**. Isso deve funcionar em 99,9% de todos os casos. Se o **myisamchk** falhar, consulte a Seção 7.6, “Manutenção e Recuperação de Falhas de Tabelas MyISAM”.

### Fazer backups usando um instantâneo do sistema de arquivos

Se você estiver usando um sistema de arquivos Veritas, você pode fazer um backup assim:

1. Do programa cliente, execute `FLUSH TABLES WITH READ LOCK`.

2. De outra concha, execute `mount vxfs snapshot`.

3. A partir do primeiro cliente, execute `UNLOCK TABLES`.

4. Copie os arquivos do snapshot.

5. Desmonte o instantâneo.

Capacidades semelhantes de instantâneo podem estar disponíveis em outros sistemas de arquivos, como LVM ou ZFS.
