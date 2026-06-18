#### 21.6.8.3 Configuração para Backups do NDB Cluster

Cinco parâmetros de configuração são essenciais para o Backup:

* `BackupDataBufferSize`

  A quantidade de memória usada para o Buffer de dados antes que sejam gravados no disco.

* `BackupLogBufferSize`

  A quantidade de memória usada para o Buffer de registros de Log antes que estes sejam gravados no disco.

* `BackupMemory`

  A memória total alocada em um data node para Backups. Este valor deve ser a soma da memória alocada para o Backup data Buffer e o Backup log Buffer.

* `BackupWriteSize`

  O tamanho padrão dos blocos gravados no disco. Isso se aplica tanto ao Backup data Buffer quanto ao Backup log Buffer.

* `BackupMaxWriteSize`

  O tamanho máximo dos blocos gravados no disco. Isso se aplica tanto ao Backup data Buffer quanto ao Backup log Buffer.

Além disso, `CompressedBackup` faz com que o `NDB` utilize compressão ao criar e gravar nos arquivos de Backup.

Informações mais detalhadas sobre esses parâmetros podem ser encontradas em Parâmetros de Backup.

Você também pode definir um local para os arquivos de Backup usando o parâmetro de configuração `BackupDataDir`. O padrão é `FileSystemPath``/BACKUP/BACKUP-backup_id`.