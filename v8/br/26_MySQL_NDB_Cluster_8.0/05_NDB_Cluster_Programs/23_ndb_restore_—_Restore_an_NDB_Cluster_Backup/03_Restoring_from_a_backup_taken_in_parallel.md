#### 25.5.23.3 Restauração a partir de um backup feito em paralelo

O NDB Cluster 8.0 suporta backups paralelos em cada nó de dados usando **ndbmtd**") com vários LDMs (veja a Seção 25.6.8.5, "Fazendo um backup do NDB com nós de dados paralelos"). As duas seções seguintes descrevem como restaurar backups feitos dessa maneira.

##### 25.5.23.3.1 Restaurar um backup paralelo em paralelo

Para restaurar um backup paralelo em paralelo, é necessário um binário **ndb\_restore** de uma distribuição do NDB 8.0. O processo não difere substancialmente do descrito na seção de uso geral, sob a descrição do programa **ndb\_restore**, e consiste em executar **ndb\_restore** duas vezes, de forma semelhante ao que é mostrado aqui:

```
$> ndb_restore -n 1 -b 1 -m --backup-path=path/to/backup_dir/BACKUP/BACKUP-backup_id
$> ndb_restore -n 1 -b 1 -r --backup-path=path/to/backup_dir/BACKUP/BACKUP-backup_id
```

`backup_id` é o ID do backup a ser restaurado. No caso geral, não são necessários argumentos especiais adicionais; **ndb\_restore** sempre verifica a existência de subdiretórios paralelos sob o diretório indicado pela opção `--backup-path` e restaura os metadados (sequencialmente) e, em seguida, os dados da tabela (paralelamente).

##### 25.5.23.3.2 Restaurar um backup paralelo em série

É possível restaurar um backup feito com paralelismo nos nós de dados de forma serial. Para fazer isso, invocando **ndb\_restore** com `--backup-path` apontando para os subdiretórios criados por cada LDM sob o diretório principal do backup, uma vez para qualquer um dos subdiretórios para restaurar os metadados (não importa qual, uma vez que cada subdiretório contém uma cópia completa dos metadados), e depois para cada um dos subdiretórios, uma a uma, para restaurar os dados. Suponha que queremos restaurar o backup com o ID de backup 100 que foi feito com quatro LDMs, e que o `BackupDataDir` é `/opt`. Para restaurar os metadados neste caso, podemos invocar **ndb\_restore** da seguinte forma:

```
$> ndb_restore -n 1 -b 1 -m --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-1-OF-4
```

Para restaurar os dados da tabela, execute **ndb\_restore** quatro vezes, usando uma das subdiretórios a cada vez, conforme mostrado aqui:

```
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-1-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-2-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-3-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-4-OF-4
```

Você pode usar a mesma técnica para restaurar um backup paralelo para uma versão mais antiga do NDB Cluster (7.6 ou anterior) que não suporte backups paralelos, usando o binário **ndb\_restore** fornecido com a versão mais antiga do software NDB Cluster.
