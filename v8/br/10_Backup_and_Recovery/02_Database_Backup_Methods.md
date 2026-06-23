## 9.2 Métodos de backup de banco de dados

Esta seção resume alguns métodos gerais para fazer backups.

### Fazendo um backup quente com o MySQL Enterprise Backup

Os clientes da Edição Empresarial do MySQL podem usar o produto MySQL Enterprise Backup para fazer backups físicos de instâncias inteiras ou bancos de dados, tabelas selecionados ou ambos. Este produto inclui recursos para backups incrementais e comprimidos. Fazer backup dos arquivos do banco de dados físico torna o processo de restauração muito mais rápido do que técnicas lógicas, como o comando `mysqldump`. As tabelas `InnoDB` são copiadas usando um mecanismo de backup quente. (Idealmente, as tabelas `InnoDB` devem representar uma maioria substancial dos dados.) As tabelas de outros motores de armazenamento são copiadas usando um mecanismo de backup [quente](glossary.html#glos_warm_backup "warm backup"). Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

### Fazer backups com mysqldump

O programa **mysqldump** pode fazer backups. Ele pode fazer backups de todos os tipos de tabelas. (Veja a Seção 9.4, “Usando mysqldump para backups”.)

Para as tabelas `InnoDB`, é possível realizar um backup online que não bloqueia as tabelas usando a opção `--single-transaction` no **mysqldump**. Veja a Seção 9.3.1, “Estabelecimento de uma Política de Backup”.

### Fazer backups copiando arquivos de tabela

As tabelas MyISAM podem ser protegidas por meio da cópia de arquivos de tabela (arquivos `*.MYD`, `*.MYI` e arquivos `*.sdi` associados). Para obter uma cópia consistente, pare o servidor ou bloqueie e limpe as tabelas relevantes:

```
FLUSH TABLES tbl_list WITH READ LOCK;
```

Você só precisa de um bloqueio de leitura; isso permite que outros clientes continuem a consultar as tabelas enquanto você está fazendo uma cópia dos arquivos no diretório do banco de dados. O esvaziamento é necessário para garantir que todas as páginas de índice ativas sejam escritas no disco antes de iniciar o backup. Veja a Seção 15.3.6, “Instruções LOCK TABLES e UNLOCK TABLES”, e a Seção 15.7.8.3, “Instrução FLUSH”.

Você também pode criar um backup binário simplesmente copiando os arquivos da tabela, desde que o servidor não esteja atualizando nada. (Mas observe que os métodos de cópia de arquivos de tabela não funcionam se o seu banco de dados contiver tabelas `InnoDB`. Além disso, mesmo que o servidor não esteja atualizando ativamente os dados, `InnoDB` ainda pode ter dados modificados cacheados na memória e não esvaziados para o disco.)

Para um exemplo desse método de backup, consulte o exemplo de exportação e importação na Seção 15.2.6, “Declaração de Importação de Tabela”.

### Fazer backups de arquivos de texto delimitado

Para criar um arquivo de texto contendo os dados de uma tabela, você pode usar `SELECT * INTO OUTFILE 'file_name' FROM tbl_name`(select-into.html "15.2.13.1 SELECT ... INTO Statement"). O arquivo é criado no host do servidor MySQL, não no host do cliente. Para esta declaração, o arquivo de saída não pode já existir, pois permitir que os arquivos sejam sobrescritos constitui um risco de segurança. Veja a Seção 15.2.13, “Instrução SELECT”. Este método funciona para qualquer tipo de arquivo de dados, mas salva apenas os dados da tabela, não a estrutura da tabela.

Outra maneira de criar arquivos de dados de texto (junto com arquivos que contêm declarações `CREATE TABLE` para as tabelas de backup) é usar o **mysqldump** com a opção `--tab`. Veja a Seção 9.4.3, “Dumpando dados em formato de texto delimitado com mysqldump”.

Para recarregar um arquivo de dados de texto delimitado, use `LOAD DATA` ou **mysqlimport**.

### Fazer backups incrementais habilitando o log binário

O MySQL suporta backups incrementais usando o log binário. Os arquivos de log binário fornecem as informações necessárias para replicar as alterações no banco de dados que são feitas após o ponto em que você realizou um backup. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o registro binário deve ser habilitado nele, que é o ajuste padrão para o MySQL 8.0; veja Seção 7.4.4, “O Log Binário”.

No momento em que você deseja fazer um backup incremental (que contenha todas as alterações que ocorreram desde o último backup completo ou incremental), você deve rotular o log binário usando `FLUSH LOGS`. Feito isso, você precisa copiar para o local de backup todos os logs binários que vão do momento do último backup completo ou incremental até o último, mas não o último. Esses logs binários são o backup incremental; no momento da restauração, você os aplica como explicado na Seção 9.5, “Recuperação Ponto no Tempo (Incremental)” (Recuperação). A próxima vez que você fizer um backup completo, também deve rotular o log binário usando `FLUSH LOGS` ou [**mysqldump --flush-logs**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"). Veja a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

### Fazer backups usando réplicas

Se você tiver problemas de desempenho com um servidor ao fazer backups, uma estratégia que pode ajudar é configurar a replicação e realizar backups na replica em vez da fonte. Veja a Seção 19.4.1, “Usando replicação para backups”.

Se você está fazendo um backup de uma réplica, você deve fazer backup do repositório de metadados da conexão e do repositório de metadados do aplicável (consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”) ao fazer o backup dos bancos de dados da réplica, independentemente do método de backup que você escolher. Essas informações são sempre necessárias para retomar a replicação após restaurar os dados da réplica. Se sua réplica está replicando as declarações `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a réplica usa para esse propósito. A réplica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável do sistema `replica_load_tmpdir` (do MySQL 8.0.26) ou `slave_load_tmpdir` (antes do MySQL 8.0.26). Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável do sistema `tmpdir`.

### Recuperação de tabelas corrompidas

Se você precisa restaurar tabelas `MyISAM` que se tornaram corrompidas, tente recuperá-las usando `REPAIR TABLE` ou [**myisamchk -r**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") primeiro. Isso deve funcionar em 99,9% de todos os casos. Se o **myisamchk** falhar, consulte a Seção 9.6, “Manutenção e Recuperação de Quebra de Tabela MyISAM”.

### Fazer backups usando um snapshot do sistema de arquivos

Se você estiver usando um sistema de arquivos Veritas, pode fazer um backup assim:

1. De um programa cliente, execute `FLUSH TABLES WITH READ LOCK`(flush.html#flush-tables-with-read-lock).

2. De outra concha, execute `mount vxfs snapshot`.

3. Do primeiro cliente, execute `UNLOCK TABLES`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

4. Copie os arquivos do snapshot. 5. Desmonte o snapshot.

Capacidades semelhantes de instantâneo podem estar disponíveis em outros sistemas de arquivos, como LVM ou ZFS.