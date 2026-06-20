## 7.2 Métodos de backup de banco de dados

Esta seção resume alguns métodos gerais para fazer backups.

### Fazendo um backup quente com o MySQL Enterprise Backup

Os clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups físicos de instâncias inteiras ou bancos de dados, tabelas selecionados ou ambos. Este produto inclui recursos para backups incrementais e comprimidos. Fazer backup dos arquivos do banco de dados físico torna o processo de restauração muito mais rápido do que técnicas lógicas, como o comando `mysqldump`. As tabelas `InnoDB` são copiadas usando um mecanismo de backup quente. (Idealmente, as tabelas `InnoDB` devem representar uma maioria substancial dos dados.) As tabelas de outros motores de armazenamento são copiadas usando um mecanismo de backup quente. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

### Fazer backups com mysqldump

O programa **mysqldump** pode fazer backups. Ele pode fazer backups de todos os tipos de tabelas. (Veja a Seção 7.4, “Usando mysqldump para backups”.)

Para as tabelas `InnoDB`, é possível realizar um backup online que não bloqueia as tabelas usando a opção `--single-transaction` para **mysqldump**. Veja a Seção 7.3.1, “Estabelecimento de uma Política de Backup”.

### Fazer backups copiando arquivos de tabela

Para motores de armazenamento que representam cada tabela usando seus próprios arquivos, as tabelas podem ser protegidas copiando esses arquivos. Por exemplo, as tabelas `MyISAM` são armazenadas como arquivos, então é fácil fazer um backup copiando arquivos (arquivos `*.frm`, `*.MYD` e `*.MYI`). Para obter um backup consistente, pare o servidor ou bloqueie e limpe as tabelas relevantes:

```sql
FLUSH TABLES tbl_list WITH READ LOCK;
```

Você só precisa de um bloqueio de leitura; isso permite que outros clientes continuem a consultar as tabelas enquanto você está fazendo uma cópia dos arquivos no diretório do banco de dados. O esvaziamento é necessário para garantir que todas as páginas de índice ativas sejam escritas no disco antes de iniciar o backup. Veja a Seção 13.3.5, “Instruções LOCK TABLES e UNLOCK TABLES”, e a Seção 13.7.6.3, “Instrução FLUSH”.

Você também pode criar um backup binário simplesmente copiando todos os arquivos de tabela, desde que o servidor não esteja atualizando nada. (Mas observe que os métodos de cópia de arquivos de tabela não funcionam se o seu banco de dados contiver tabelas `InnoDB`. Além disso, mesmo que o servidor não esteja atualizando ativamente dados, `InnoDB` ainda pode ter dados modificados cacheados na memória e não esvaziados para o disco.)

### Fazer backups de arquivos de texto delimitado

Para criar um arquivo de texto contendo os dados de uma tabela, você pode usar `SELECT * INTO OUTFILE 'file_name' FROM tbl_name`. O arquivo é criado no host do servidor MySQL, não no host do cliente. Para esta declaração, o arquivo de saída não pode já existir, pois permitir que os arquivos sejam sobrescritos constitui um risco de segurança. Veja a Seção 13.2.9, “Instrução SELECT”. Este método funciona para qualquer tipo de arquivo de dados, mas salva apenas os dados da tabela, não a estrutura da tabela.

Outra maneira de criar arquivos de dados de texto (junto com arquivos que contêm declarações `CREATE TABLE` para as tabelas de backup) é usar o **mysqldump** com a opção `--tab`. Veja a Seção 7.4.3, “Dumpando dados em formato de texto delimitado com mysqldump”.

Para recarregar um arquivo de dados de texto delimitado, use `LOAD DATA` ou **mysqlimport**.

### Fazer backups incrementais habilitando o log binário

O MySQL suporta backups incrementais: você deve iniciar o servidor com a opção `--log-bin` para habilitar o registro binário; veja a Seção 5.4.4, “O Registro Binário”. Os arquivos de registro binário fornecem as informações necessárias para replicar as alterações no banco de dados que são feitas após o ponto em que você realizou um backup. No momento em que você deseja fazer um backup incremental (contendo todas as alterações que ocorreram desde o último backup completo ou incremental), você deve rotular o registro binário usando `FLUSH LOGS`. Feito isso, você precisa copiar para o local de backup todos os registros binários que variam do momento do último backup completo ou incremental ao último, mas não o último. Esses registros binários são o backup incremental; no momento de restauração, você os aplica como explicado na Seção 7.5, “Recuperação Ponto em Tempo (Incremental)” (Recuperação"). A próxima vez que você fizer um backup completo, também deve rotular o registro binário usando `FLUSH LOGS` ou **mysqldump --flush-logs**. Veja a Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

### Fazer backups usando réplicas

Se você tiver problemas de desempenho com o servidor de origem ao fazer backups, uma estratégia que pode ajudar é configurar a replicação e realizar backups na replica em vez do servidor de origem. Veja a Seção 16.3.1, “Usando replicação para backups”.

Se você está fazendo um backup de um servidor replica, você deve fazer backup das informações de origem e dos repositórios de logs de relevo (consulte a Seção 16.2.4, “Repositórios de Logs de Relevo e Metadados de Replicação”) ao fazer o backup dos bancos de dados da replica, independentemente do método de backup que você escolher. Esses arquivos de informações são sempre necessários para retomar a replicação após restaurar os dados da replica. Se sua replica está replicando as declarações `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `slave_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.

### Recuperação de tabelas corrompidas

Se você precisa restaurar tabelas `MyISAM` que se tornaram corrompidas, tente recuperá-las usando `REPAIR TABLE` ou **myisamchk -r** primeiro. Isso deve funcionar em 99,9% de todos os casos. Se o **myisamchk** falhar, consulte a Seção 7.6, “Manutenção e Recuperação de Quebra de Tabela MyISAM”.

### Fazer backups usando um snapshot do sistema de arquivos

Se você estiver usando um sistema de arquivos Veritas, pode fazer um backup assim:

1. De um programa cliente, execute `FLUSH TABLES WITH READ LOCK`.

2. De outra concha, execute `mount vxfs snapshot`.

3. Do primeiro cliente, execute `UNLOCK TABLES`.

4. Copie os arquivos do snapshot. 5. Desmonte o snapshot.

Capacidades semelhantes de instantâneo podem estar disponíveis em outros sistemas de arquivos, como LVM ou ZFS.