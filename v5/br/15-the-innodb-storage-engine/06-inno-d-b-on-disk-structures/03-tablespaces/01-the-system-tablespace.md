#### 14.6.3.1 O System Tablespace

O system tablespace é a área de armazenamento para o dicionário de dados do `InnoDB`, o doublewrite buffer, o change buffer e os undo logs. Ele também pode conter dados de table e de Index se as tables forem criadas no system tablespace em vez de em file-per-table tablespaces ou general tablespaces.

O system tablespace pode ter um ou mais data files. Por padrão, um único data file do system tablespace, nomeado `ibdata1`, é criado no data directory. O tamanho e o número de data files do system tablespace são definidos pela opção de inicialização `innodb_data_file_path`. Para obter informações de configuração, consulte Configuração do Data File do System Tablespace.

Informações adicionais sobre o system tablespace são fornecidas nos seguintes tópicos desta seção:

* Redimensionando o System Tablespace
* Usando Raw Disk Partitions para o System Tablespace

##### Redimensionando o System Tablespace

Esta seção descreve como aumentar ou diminuir o tamanho do system tablespace.

###### Aumentando o Tamanho do System Tablespace

A maneira mais fácil de aumentar o tamanho do system tablespace é configurá-lo para ser auto-extensível (auto-extending). Para fazer isso, especifique o atributo `autoextend` para o último data file na configuração `innodb_data_file_path` e reinicie o server. Por exemplo:

```sql
innodb_data_file_path=ibdata1:10M:autoextend
```

Quando o atributo `autoextend` é especificado, o data file aumenta automaticamente em incrementos de 8MB conforme o espaço é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Você também pode aumentar o tamanho do system tablespace adicionando outro data file. Para fazer isso:

1. Pare o server MySQL.
2. Se o último data file na configuração `innodb_data_file_path` estiver definido com o atributo `autoextend`, remova-o e modifique o atributo de tamanho para refletir o tamanho atual do data file. Para determinar o tamanho apropriado do data file a ser especificado, verifique o tamanho do arquivo em seu file system e arredonde esse valor para baixo até o valor MB mais próximo, onde um MB é igual a 1024 x 1024 bytes.

3. Anexe um novo data file à configuração `innodb_data_file_path`, especificando opcionalmente o atributo `autoextend`. O atributo `autoextend` pode ser especificado apenas para o último data file na configuração `innodb_data_file_path`.

4. Inicie o server MySQL.

Por exemplo, este tablespace tem um data file auto-extensível:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:10M:autoextend
```

Suponha que o data file tenha crescido para 988MB ao longo do tempo. Esta é a configuração `innodb_data_file_path` após modificar o atributo de tamanho para refletir o tamanho atual do data file e após especificar um novo data file auto-extensível de 50MB:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:988M;/disk2/ibdata2:50M:autoextend
```

Ao adicionar um novo data file, não especifique um nome de arquivo existente. O `InnoDB` cria e inicializa o novo data file quando você inicia o server.

Note

Você não pode aumentar o tamanho de um data file do system tablespace existente alterando seu atributo de tamanho. Por exemplo, alterar a configuração `innodb_data_file_path` de `ibdata1:10M:autoextend` para `ibdata1:12M:autoextend` produz o seguinte erro ao iniciar o server:

```sql
[ERROR] [MY-012263] [InnoDB] The Auto-extending innodb_system
data file './ibdata1' is of a different size 640 pages (rounded down to MB) than
specified in the .cnf file: initial 768 pages, max 0 (relevant if non-zero) pages!
```

O erro indica que o tamanho do data file existente (expresso em `InnoDB` pages) é diferente do tamanho do data file especificado no arquivo de configuração. Se você encontrar esse erro, restaure a configuração `innodb_data_file_path` anterior e consulte as instruções de redimensionamento do system tablespace.

###### Diminuindo o Tamanho do InnoDB System Tablespace

Você não pode remover um data file do system tablespace. Para diminuir o tamanho do system tablespace, use este procedimento:

1. Use o **mysqldump** para realizar o dump de todas as suas tables `InnoDB`, incluindo tables `InnoDB` localizadas no `mysql` schema. Identifique tables `InnoDB` no `mysql` schema usando a seguinte Query:

   ```sql
   mysql> SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='mysql' and ENGINE='InnoDB';
   +---------------------------+
   | TABLE_NAME                |
   +---------------------------+
   | engine_cost               |
   | gtid_executed             |
   | help_category             |
   | help_keyword              |
   | help_relation             |
   | help_topic                |
   | innodb_index_stats        |
   | innodb_table_stats        |
   | plugin                    |
   | server_cost               |
   | servers                   |
   | slave_master_info         |
   | slave_relay_log_info      |
   | slave_worker_info         |
   | time_zone                 |
   | time_zone_leap_second     |
   | time_zone_name            |
   | time_zone_transition      |
   | time_zone_transition_type |
   +---------------------------+
   ```

2. Pare o server.
3. Remova todos os tablespace files existentes (`*.ibd`), incluindo os arquivos `ibdata` e `ib_log`. Não se esqueça de remover os arquivos `*.ibd` para tables localizadas no `mysql` schema.

4. Remova quaisquer arquivos `.frm` para tables `InnoDB`.

5. Configure os data files para o novo system tablespace. Consulte Configuração do Data File do System Tablespace.

6. Reinicie o server.
7. Importe os dump files.

Note

Se seus Databases usarem apenas o engine `InnoDB`, pode ser mais simples fazer o dump de **todos** os Databases, parar o server, remover todos os Databases e `InnoDB` log files, reiniciar o server e importar os dump files.

Para evitar um system tablespace grande, considere usar file-per-table tablespaces ou general tablespaces para seus dados. Os file-per-table tablespaces são o tipo de tablespace padrão e são usados implicitamente ao criar uma table `InnoDB`. Diferentemente do system tablespace, os file-per-table tablespaces retornam espaço em disco para o sistema operacional quando são truncados ou descartados (dropped). Para obter mais informações, consulte a Seção 14.6.3.2, “File-Per-Table Tablespaces”. Os general tablespaces são multi-table tablespaces que também podem ser usados como alternativa ao system tablespace. Consulte a Seção 14.6.3.3, “General Tablespaces”.

##### Usando Raw Disk Partitions para o System Tablespace

Raw disk partitions (Partições de Disco Brutas) podem ser usadas como data files do system tablespace. Essa técnica permite I/O sem Buffer no Windows e em alguns sistemas Linux e Unix sem a sobrecarga do file system. Realize testes com e sem raw partitions para verificar se elas melhoram o performance em seu sistema.

Ao usar uma raw disk partition, certifique-se de que o ID de usuário que executa o server MySQL tenha privilégios de leitura e escrita para essa partition. Por exemplo, se estiver executando o server como o usuário `mysql`, a partition deve ser legível e gravável por `mysql`. Se estiver executando o server com a opção `--memlock`, o server deve ser executado como `root`, então a partition deve ser legível e gravável por `root`.

Os procedimentos descritos abaixo envolvem a modificação de arquivos de opção (option file). Para informações adicionais, consulte a Seção 4.2.2.2, “Using Option Files”.

###### Alocando uma Raw Disk Partition em Sistemas Linux e Unix

1. Para usar um raw device (dispositivo bruto) para uma nova server instance, primeiro prepare o arquivo de configuração definindo `innodb_data_file_path` com a keyword `raw`. Por exemplo:

   ```sql
   [mysqld]
   innodb_data_home_dir=
   innodb_data_file_path=/dev/hdd1:3Graw;/dev/hdd2:2Graw
   ```

   A partition deve ser pelo menos tão grande quanto o tamanho que você especificar. Note que 1MB no `InnoDB` é 1024 × 1024 bytes, enquanto 1MB em especificações de disco geralmente significa 1.000.000 de bytes.

2. Em seguida, inicialize o server pela primeira vez usando `--initialize` ou `--initialize-insecure`. O InnoDB percebe a keyword `raw`, inicializa a nova partition e então para o server.

3. Agora reinicie o server. O `InnoDB` agora permite que mudanças sejam feitas.

###### Alocando uma Raw Disk Partition no Windows

Nos sistemas Windows, as mesmas etapas e diretrizes descritas para os sistemas Linux e Unix se aplicam, exceto que a configuração `innodb_data_file_path` difere ligeiramente no Windows. Por exemplo:

```sql
[mysqld]
innodb_data_home_dir=
innodb_data_file_path=//./D::10Graw
```

O `//./` corresponde à sintaxe do Windows `\\.\` para acessar drives físicos. No exemplo acima, `D:` é a letra do drive da partition.