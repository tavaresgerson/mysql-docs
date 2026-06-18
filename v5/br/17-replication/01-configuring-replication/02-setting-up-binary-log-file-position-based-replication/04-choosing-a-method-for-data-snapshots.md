#### 16.1.2.4 Escolhendo um Método para Data Snapshots

Se o Database na Source contiver dados existentes, é necessário copiar esses dados para cada Replica. Existem diferentes maneiras de fazer o dump dos dados da Source. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de dump do Database, escolha entre estas opções:

* Use a ferramenta **mysqldump** para criar um dump de todos os Databases que você deseja replicar. Este é o método recomendado, especialmente ao usar `InnoDB`.

* Se o seu Database estiver armazenado em arquivos binários portáteis, você pode copiar os arquivos de dados brutos (raw data files) para uma Replica. Isso pode ser mais eficiente do que usar **mysqldump** e importar o arquivo em cada Replica, pois ignora a sobrecarga de atualização de Indexes à medida que as instruções `INSERT` são repetidas (replayed). Não é recomendado usar este método com Storage Engines como `InnoDB`.

##### 16.1.2.4.1 Criando um Data Snapshot Usando mysqldump

Para criar um snapshot dos dados em uma Source existente, use a ferramenta **mysqldump**. Assim que o data dump for concluído, importe esses dados para a Replica antes de iniciar o processo de replicação.

O exemplo a seguir faz o dump de todos os Databases para um arquivo chamado `dbdump.db`, e inclui a opção `--master-data` que anexa automaticamente a instrução `CHANGE MASTER TO` exigida na Replica para iniciar o processo de replicação:

```sql
$> mysqldump --all-databases --master-data > dbdump.db
```

Nota

Se você não usar `--master-data`, será necessário bloquear todas as tabelas em uma sessão separada manualmente. Consulte Seção 16.1.2.3, “Obtendo as Coordenadas do Binary Log da Source de Replicação”.

É possível excluir certos Databases do dump usando a ferramenta **mysqldump**. Se você quiser escolher quais Databases incluir no dump, não use `--all-databases`. Escolha uma destas opções:

* Exclua todas as tabelas no Database usando a opção `--ignore-table`.

* Nomeie apenas os Databases que você deseja fazer dump usando a opção `--databases`.

Para mais informações, consulte Section 4.5.4, “mysqldump — A Database Backup Program”.

Para importar os dados, copie o arquivo de dump para a Replica, ou acesse o arquivo da Source ao conectar-se remotamente à Replica.

##### 16.1.2.4.2 Criando um Data Snapshot Usando Raw Data Files

Esta seção descreve como criar um data snapshot usando os raw files (arquivos brutos) que compõem o Database. Empregar este método com uma tabela que utiliza um Storage Engine que possui algoritmos complexos de caching ou logging requer etapas extras para produzir um snapshot "point in time" (ponto no tempo) perfeito: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de logging, mesmo que você tenha adquirido um global read Lock. A maneira como o Storage Engine responde a isso depende de suas habilidades de crash recovery (recuperação de falhas).

Se você usar tabelas `InnoDB`, você pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um snapshot consistente. Este comando registra o nome do log e o offset correspondente ao snapshot para ser usado na Replica. MySQL Enterprise Backup é um produto comercial incluído como parte de uma assinatura MySQL Enterprise. Consulte Section 28.1, “MySQL Enterprise Backup Overview” para obter informações detalhadas.

Este método também não funciona de forma confiável se a Source e a Replica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas que possuem full-text Indexes.

Assumindo que as exceções acima não se apliquem ao seu Database, use a técnica de cold backup para obter um snapshot binário confiável de tabelas `InnoDB`: faça um slow shutdown do MySQL Server e, em seguida, copie os arquivos de dados manualmente.

Para criar um raw data snapshot de tabelas `MyISAM` quando seus arquivos de dados MySQL existirem em um único file system, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota como **scp** ou **rsync**, uma ferramenta de arquivamento como **zip** ou **tar**, ou uma ferramenta de snapshot de file system como **dump**. Se você estiver replicando apenas certos Databases, copie apenas os arquivos relacionados a essas tabelas. Para `InnoDB`, todas as tabelas em todos os Databases são armazenadas nos arquivos do system tablespace, a menos que você tenha a opção `innodb_file_per_table` habilitada.

Os seguintes arquivos não são necessários para a replicação:

* Arquivos relacionados ao Database `mysql`.
* O arquivo de repositório de Metadata de conexão da Replica, se usado (consulte Section 16.2.4, “Relay Log and Replication Metadata Repositories”).

* Os arquivos de Binary Log da Source, com exceção do arquivo de Index do Binary Log, se você for usá-lo para localizar as coordenadas do Binary Log da Source para a Replica.

* Quaisquer arquivos de Relay Log.

Dependendo se você está usando tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando tabelas `InnoDB`, e também para obter os resultados mais consistentes com um raw data snapshot, desligue (shut down) o servidor Source durante o processo, da seguinte forma:

1. Adquira um read Lock e obtenha o status da Source. Consulte Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

2. Em uma sessão separada, desligue o servidor Source:

   ```sql
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados MySQL. Os exemplos a seguir mostram maneiras comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor Source.

Se você não estiver usando tabelas `InnoDB`, você pode obter um snapshot do sistema de uma Source sem desligar o servidor, conforme descrito nas seguintes etapas:

1. Adquira um read Lock e obtenha o status da Source. Consulte Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

2. Faça uma cópia dos arquivos de dados MySQL. Os exemplos a seguir mostram maneiras comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o read Lock, libere o Lock:

   ```sql
   mysql> UNLOCK TABLES;
   ```

Depois de criar o arquivo ou a cópia do Database, copie os arquivos para cada Replica antes de iniciar o processo de replicação.