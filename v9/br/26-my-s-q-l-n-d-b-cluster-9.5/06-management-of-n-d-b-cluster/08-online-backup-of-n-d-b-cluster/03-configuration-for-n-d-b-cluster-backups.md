#### 25.6.8.3 Configuração para backups de NDB Cluster

Cinco parâmetros de configuração são essenciais para o backup:

* `BackupDataBufferSize`

  A quantidade de memória usada para bufferizar dados antes de serem escritos no disco.

* `BackupLogBufferSize`

  A quantidade de memória usada para bufferizar registros de log antes de serem escritos no disco.

* `BackupMemory`

  A memória total alocada em um nó de dados para backups. Isso deve ser a soma da memória alocada para o buffer de dados de backup e o buffer de log de backup.

* `BackupWriteSize`

  O tamanho padrão dos blocos escritos no disco. Isso se aplica tanto ao buffer de dados de backup quanto ao buffer de log de backup.

* `BackupMaxWriteSize`

  O tamanho máximo dos blocos escritos no disco. Isso se aplica tanto ao buffer de dados de backup quanto ao buffer de log de backup.

Além disso, `CompressedBackup` faz com que o `NDB` use compressão ao criar e escrever em arquivos de backup.

Informações mais detalhadas sobre esses parâmetros podem ser encontradas em Parâmetros de backup.

Você também pode definir um local para os arquivos de backup usando o parâmetro de configuração `BackupDataDir`. O padrão é `FileSystemPath`/BACKUP/BACKUP-backup_id.

Você pode impor a criptografia dos arquivos de backup configurando `RequireEncryptedBackup` para 1; isso impede a criação de backups sem especificar `ENCRYPT PASSWORD=password` como parte de um comando `START BACKUP`.