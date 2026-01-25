## 7.2 Métodos de Backup do Database

Esta seção resume alguns métodos gerais para realizar backups.

### Fazendo um Hot Backup com MySQL Enterprise Backup

Clientes do MySQL Enterprise Edition podem usar o produto MySQL Enterprise Backup para realizar backups físicos de instâncias inteiras ou de Databases e Tables selecionadas, ou ambos. Este produto inclui recursos para backups incrementais e compactados. Realizar o backup dos arquivos físicos do Database torna o restore muito mais rápido do que técnicas lógicas, como o comando `mysqldump`. Tables `InnoDB` são copiadas usando um mecanismo de hot backup. (Idealmente, as tables `InnoDB` devem representar a maioria substancial dos dados.) Tables de outros Storage Engines são copiadas usando um mecanismo de warm backup. Para uma visão geral do produto MySQL Enterprise Backup, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

### Fazendo Backups com mysqldump

O programa **mysqldump** pode realizar backups. Ele pode fazer backup de todos os tipos de tables. (Consulte a Seção 7.4, “Usando mysqldump para Backups”.)

Para tables `InnoDB`, é possível realizar um backup online que não aplica Locks nas tables, utilizando a opção `--single-transaction` do **mysqldump**. Consulte a Seção 7.3.1, “Estabelecendo uma Política de Backup”.

### Fazendo Backups Copiando Arquivos de Table

Para Storage Engines que representam cada table usando seus próprios arquivos, as tables podem ter backup realizado pela cópia desses arquivos. Por exemplo, tables `MyISAM` são armazenadas como arquivos, então é fácil fazer um backup copiando arquivos (arquivos `*.frm`, `*.MYD` e `*.MYI`). Para obter um backup consistente, pare o Server ou aplique Lock e faça Flush nas tables relevantes:

```sql
FLUSH TABLES tbl_list WITH READ LOCK;
```

Você precisa apenas de um read lock; isso permite que outros Clients continuem a executar Queries nas tables enquanto você está fazendo uma cópia dos arquivos no diretório do Database. O Flush é necessário para garantir que todas as páginas de Index ativas sejam gravadas em disco antes de você iniciar o backup. Consulte a Seção 13.3.5, “Instruções LOCK TABLES e UNLOCK TABLES”, e a Seção 13.7.6.3, “Instrução FLUSH”.

Você também pode criar um backup binário simplesmente copiando todos os arquivos de table, desde que o Server não esteja atualizando nada. (Mas observe que métodos de cópia de arquivos de table não funcionam se o seu Database contiver tables `InnoDB`. Além disso, mesmo que o Server não esteja ativamente atualizando dados, o `InnoDB` ainda pode ter dados modificados em cache na memória e não ter feito Flush para o disco.)

### Fazendo Backups de Arquivos de Texto Delimitado

Para criar um arquivo de texto contendo os dados de uma table, você pode usar `SELECT * INTO OUTFILE 'nome_do_arquivo' FROM nome_da_tabela`. O arquivo é criado no host do MySQL Server, e não no host do Client. Para esta instrução, o arquivo de saída não pode já existir, pois permitir que arquivos sejam sobrescritos constitui um risco de segurança. Consulte a Seção 13.2.9, “Instrução SELECT”. Este método funciona para qualquer tipo de arquivo de dados, mas salva apenas os dados da table, não a estrutura da table.

Outra maneira de criar arquivos de dados de texto (juntamente com arquivos contendo instruções `CREATE TABLE` para as tables das quais foi feito backup) é usar o **mysqldump** com a opção `--tab`. Consulte a Seção 7.4.3, “Despejando Dados no Formato de Texto Delimitado com mysqldump”.

Para recarregar um arquivo de dados de texto delimitado, use `LOAD DATA` ou **mysqlimport**.

### Fazendo Backups Incrementais Habilitando o Binary Log

O MySQL suporta backups incrementais: Você deve iniciar o Server com a opção `--log-bin` para habilitar o binary logging; consulte a Seção 5.4.4, “O Binary Log”. Os arquivos de binary log fornecem as informações necessárias para replicar as alterações no Database que foram feitas após o ponto em que você realizou um backup. No momento em que você deseja fazer um backup incremental (contendo todas as alterações que ocorreram desde o último backup completo ou incremental), você deve rotacionar o binary log usando `FLUSH LOGS`. Feito isso, você precisa copiar para o local de backup todos os binary logs que vão desde o momento do último backup completo ou incremental até o penúltimo. Estes binary logs são o backup incremental; no momento do restore, você os aplica conforme explicado na Seção 7.5, “Recuperação Pontual (Incremental)”. Na próxima vez que você fizer um backup completo, você também deve rotacionar o binary log usando `FLUSH LOGS` ou **mysqldump --flush-logs**. Consulte a Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”.

### Fazendo Backups Usando Replicas

Se você tiver problemas de performance com o seu Source Server durante a realização de backups, uma estratégia que pode ajudar é configurar a Replication e realizar backups na Replica em vez de na Source. Consulte a Seção 16.3.1, “Usando Replication para Backups”.

Se você estiver fazendo backup de um servidor Replica, você deve fazer backup dos seus repositórios de source info e relay log info (consulte a Seção 16.2.4, “Repositórios de Relay Log e Metadados de Replication”) ao fazer backup dos Databases da Replica, independentemente do método de backup que você escolher. Esses arquivos de informação são sempre necessários para retomar a Replication após você restaurar os dados da Replica. Se a sua Replica estiver replicando instruções `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a Replica usa para essa finalidade. A Replica precisa desses arquivos para retomar a Replication de quaisquer operações `LOAD DATA` interrompidas. O local deste diretório é o valor da variável de sistema `slave_load_tmpdir`. Se o Server não foi iniciado com essa variável definida, o local do diretório é o valor da variável de sistema `tmpdir`.

### Recuperando Tables Corrompidas

Se você precisar restaurar tables `MyISAM` que se corromperam, tente primeiro recuperá-las usando `REPAIR TABLE` ou **myisamchk -r**. Isso deve funcionar em 99,9% de todos os casos. Se o **myisamchk** falhar, consulte a Seção 7.6, “Manutenção de Table MyISAM e Recuperação de Falhas”.

### Fazendo Backups Usando um Snapshot do File System

Se você estiver usando um file system Veritas, você pode fazer um backup da seguinte forma:

1. A partir de um programa Client, execute `FLUSH TABLES WITH READ LOCK`.

2. A partir de outro shell, execute `mount vxfs snapshot`.

3. A partir do primeiro Client, execute `UNLOCK TABLES`.

4. Copie arquivos do Snapshot.
5. Desmonte o Snapshot (Unmount).

Recursos de Snapshot semelhantes podem estar disponíveis em outros file systems, como LVM ou ZFS.
