#### 21.2.4.1 Novidades no NDB Cluster 7.5

As principais alterações e novos recursos do NDB Cluster 7.5 que provavelmente serão de interesse estão listados a seguir:

* **Melhorias no ndbinfo.** Uma série de alterações foram feitas no Database `ndbinfo`, sendo a principal delas que agora ele fornece informações detalhadas sobre os parâmetros de configuração do Node do NDB Cluster.

  A tabela `config_params` foi tornada somente leitura e aprimorada com colunas adicionais que fornecem informações sobre cada parâmetro de configuração, incluindo o tipo do parâmetro, valor padrão, valores máximo e mínimo (quando aplicável), uma breve descrição do parâmetro e se o parâmetro é obrigatório. Esta tabela também fornece a cada parâmetro um `param_number` exclusivo.

  Uma linha na tabela `config_values` mostra o valor atual de um determinado parâmetro no Node que possui um ID especificado. O parâmetro é identificado pelo valor da coluna `config_param`, que se mapeia para o `param_number` da tabela `config_params`.

  Usando este relacionamento, você pode escrever um JOIN nessas duas tabelas para obter os valores padrão, máximo, mínimo e atual de um ou mais parâmetros de configuração do NDB Cluster por nome. Um exemplo de instrução SQL usando tal JOIN é mostrado aqui:

  ```sql
  SELECT  p.param_name AS Name,
          v.node_id AS Node,
          p.param_type AS Type,
          p.param_default AS 'Default',
          p.param_min AS Minimum,
          p.param_max AS Maximum,
          CASE p.param_mandatory WHEN 1 THEN 'Y' ELSE 'N' END AS 'Required',
          v.config_value AS Current
  FROM    config_params p
  JOIN    config_values v
  ON      p.param_number = v.config_param
  WHERE   p. param_name IN ('NodeId', 'HostName','DataMemory', 'IndexMemory');
  ```

  Para obter mais informações sobre estas alterações, consulte Seção 21.6.15.8, “The ndbinfo config_params Table”. Consulte Seção 21.6.15.9, “The ndbinfo config_values Table”, para obter informações e exemplos adicionais.

  Além disso, o Database `ndbinfo` não depende mais do storage engine `MyISAM`. Todas as tabelas e views `ndbinfo` agora usam `NDB` (mostrado como `NDBINFO`).

  Várias novas tabelas `ndbinfo` foram introduzidas no NDB 7.5.4. Estas tabelas estão listadas aqui, com breves descrições:

  + `dict_obj_info` fornece os nomes e tipos de objetos de Database em `NDB`, bem como informações sobre objetos pai (parent objects), quando aplicável

  + `table_distribution_status` fornece informações de Status de distribuição da tabela `NDB`

  + `table_fragments` fornece informações sobre a distribuição de fragmentos de tabela `NDB`

  + `table_info` fornece informações sobre Logging, Checkpointing, storage e outras opções em vigor para cada tabela `NDB`

  + `table_replicas` fornece informações sobre réplicas de fragmentos

  Consulte as descrições das tabelas individuais para obter mais informações.

* **Alterações no formato padrão de linha e coluna.** A partir do NDB 7.5.1, o valor padrão para a opção `ROW_FORMAT` e a opção `COLUMN_FORMAT` para `CREATE TABLE` pode ser definido como `DYNAMIC` em vez de `FIXED`, usando uma nova variável do MySQL Server. A variável `ndb_default_column_format` é adicionada como parte desta alteração; defina-a como `FIXED` ou `DYNAMIC` (ou inicie **mysqld** com a opção equivalente `--ndb-default-column-format=FIXED`) para forçar que este valor seja usado para `COLUMN_FORMAT` e `ROW_FORMAT`. Antes do NDB 7.5.4, o padrão para esta variável era `DYNAMIC`; nesta e em versões posteriores, o padrão é `FIXED`, o que oferece compatibilidade com versões anteriores (Bug #24487363).

  O row format e o column format usados pelas colunas de tabelas existentes não são afetados por esta alteração. Novas colunas adicionadas a essas tabelas usam os novos padrões para estas (possivelmente sobrescritos por `ndb_default_column_format`), e as colunas existentes são alteradas para usar estes também, desde que a instrução `ALTER TABLE` que executa esta operação especifique `ALGORITHM=COPY`.

  Nota

  Um `ALTER TABLE` de cópia (copying `ALTER TABLE`) não pode ser feito implicitamente se **mysqld** for executado com `--ndb-allow-copying-alter-table=FALSE`.

* **ndb_binlog_index não depende mais do MyISAM.** A partir do NDB 7.5.2, a tabela `ndb_binlog_index` empregada na NDB Cluster Replication agora usa o storage engine `InnoDB` em vez de `MyISAM`. Ao fazer o Upgrade, você pode executar **mysql_upgrade** com `--force` `--upgrade-system-tables` para que ele execute `ALTER TABLE ... ENGINE=INNODB` nesta tabela. O uso de `MyISAM` para esta tabela continua sendo suportado para compatibilidade com versões anteriores.

  Um benefício desta alteração é que torna possível depender do comportamento transacional e de leituras sem Lock (lock-free reads) para esta tabela, o que pode ajudar a aliviar problemas de concorrência durante operações de purge e rotação de log, e melhorar a disponibilidade desta tabela.

* **Alterações no ALTER TABLE.** O NDB Cluster anteriormente suportava uma sintaxe alternativa para `ALTER TABLE` online. Isso não é mais suportado no NDB Cluster 7.5, que utiliza exclusivamente `ALGORITHM = DEFAULT|COPY|INPLACE` para DDL de tabela, assim como no MySQL Server padrão.

  Outra alteração que afeta o uso desta instrução é que `ALTER TABLE ... ALGORITHM=INPLACE RENAME` agora pode conter operações DDL além da renomeação.

* **Parâmetro ExecuteOnComputer descontinuado (deprecated).** O parâmetro de configuração `ExecuteOnComputer` para nodes de gerenciamento, nodes de dados e nodes API foi descontinuado (deprecated) e agora está sujeito à remoção em uma versão futura do NDB Cluster. Você deve usar o parâmetro equivalente `HostName` para todos os três tipos de nodes.

* **Otimização records-per-key.** O handler NDB agora usa a interface records-per-key para estatísticas de Index implementada para o Optimizer no MySQL 5.7.5. Alguns dos benefícios desta alteração incluem os listados aqui:

  + O Optimizer agora escolhe planos de execução melhores em muitos casos em que um Index JOIN ou ordem de JOIN de tabela menos otimizados teriam sido escolhidos anteriormente.

  + As estimativas de linhas mostradas por `EXPLAIN` são mais precisas.

  + As estimativas de Cardinality mostradas por `SHOW INDEX` são aprimoradas.

* **IDs de Node do Connection Pool.** O NDB 7.5.0 adiciona a opção `--ndb-cluster-connection-pool-nodeids` do **mysqld**, que permite definir um conjunto de IDs de Node para o Connection Pool. Esta configuração sobrescreve `--ndb-nodeid`, o que significa que também sobrescreve a opção `--ndb-connectstring` e a variável de ambiente `NDB_CONNECTSTRING`.

  Nota

  Você pode definir o tamanho do Connection Pool usando a opção `--ndb-cluster-connection-pool` para **mysqld**.

* **create_old_temporals removido.** A system variable `create_old_temporals` foi descontinuada no NDB Cluster 7.4 e agora foi removida.

* **Comando PROMPT do Cliente ndb_mgm.** O NDB Cluster 7.5 adiciona um novo comando para definir o prompt de linha de comando do cliente. O exemplo a seguir ilustra o uso do comando `PROMPT`:

  ```sql
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @10.100.1.1  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0, *)
  id=6    @10.100.1.3  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0)
  id=7    @10.100.1.9  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)
  id=8    @10.100.1.11  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @10.100.1.8  (mysql-5.7.44-ndb-7.5.36)

  [mysqld(API)]   2 node(s)
  id=100  @10.100.1.8  (5.7.44-ndb-7.5.36)
  id=101  @10.100.1.10  (5.7.44-ndb-7.5.36)

  mgm#1: PROMPT
  ndb_mgm> EXIT
  jon@valhaj:/usr/local/mysql/bin>
  ```

  Para obter informações e exemplos adicionais, consulte Seção 21.6.1, “Commands in the NDB Cluster Management Client”.

* **Aumento do armazenamento de colunas FIXED por fragmento.** O NDB Cluster 7.5 e posterior suporta um máximo de 128 TB por fragmento de dados em colunas `FIXED`. No NDB Cluster 7.4 e anterior, este limite era de 16 GB por fragmento.

* **Parâmetros descontinuados removidos.** Os seguintes parâmetros de configuração de Node de dados do NDB Cluster foram descontinuados em versões anteriores do NDB Cluster e foram removidos no NDB 7.5.0:

  + `Id`: descontinuado no NDB 7.1.9; substituído por `NodeId`.

  + `NoOfDiskPagesToDiskDuringRestartTUP`, `NoOfDiskPagesToDiskDuringRestartACC`: ambos descontinuados, não tinham efeito; substituídos no MySQL 5.1.6 por `DiskCheckpointSpeedInRestart`, que por sua vez foi descontinuado posteriormente (no NDB 7.4.1) e agora também foi removido.

  + `NoOfDiskPagesToDiskAfterRestartACC`, `NoOfDiskPagesToDiskAfterRestartTUP`: ambos descontinuados e não tinham efeito; substituídos no MySQL 5.1.6 por `DiskCheckpointSpeed`, que por sua vez foi descontinuado posteriormente (no NDB 7.4.1) e agora também foi removido.

  + `ReservedSendBufferMemory`: Descontinuado; não tinha mais nenhum efeito.

  + `MaxNoOfIndexes`: arcaico (pré-MySQL 4.1), não tinha efeito; há muito tempo substituído por `MaxNoOfOrderedIndexes` ou `MaxNoOfUniqueHashIndexes`.

  + `Discless`: sinônimo arcaico (pré-MySQL 4.1) de e há muito tempo substituído por `Diskless`.

  O parâmetro de configuração de computador `ByteOrder` arcaico e não utilizado (e por isso também não documentado anteriormente) também foi removido no NDB 7.5.0.

  Os parâmetros descritos acima não são suportados no NDB 7.5. A tentativa de usar qualquer um destes parâmetros em um arquivo de configuração do NDB Cluster agora resulta em um erro.

* **Melhorias no DBTC scan.** Os Scans foram melhorados reduzindo o número de sinais usados para comunicação entre os Kernel Blocks `DBTC` e `DBDIH` no `NDB`, permitindo maior escalabilidade dos Nodes de dados quando usados para operações de Scan, diminuindo o uso de recursos de CPU para estas operações, em alguns casos em uma estimativa de cinco por cento.

  Também como resultado destas alterações, os tempos de resposta devem ser bastante melhorados, o que pode ajudar a prevenir problemas de sobrecarga dos Threads principais. Além disso, os Scans realizados no Kernel Block `BACKUP` também foram melhorados e tornados mais eficientes do que em versões anteriores.

* **Suporte à coluna JSON.** O NDB 7.5.2 e posterior suporta o tipo de coluna `JSON` para tabelas `NDB` e as funções JSON encontradas no MySQL Server, sujeito à limitação de que uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

* **Leitura de qualquer réplica de fragmento; especificação do número de fragmentos de partition do hashmap.** Anteriormente, todas as leituras eram direcionadas para a réplica primária do fragmento, exceto por leituras simples. (Uma leitura simples é uma leitura que bloqueia a linha enquanto a lê.) A partir do NDB 7.5.2, é possível habilitar leituras a partir de qualquer réplica de fragmento. Esta opção está desabilitada por padrão, mas pode ser habilitada para um determinado SQL node usando a system variable `ndb_read_backup` adicionada nesta versão.

  Anteriormente, era possível definir tabelas com apenas um tipo de mapeamento de Partition, com uma Partition primária em cada LDM em cada Node, mas no NDB 7.5.2 torna-se possível ser mais flexível quanto à atribuição de Partitions, definindo um balanceamento de Partition (tipo de contagem de fragmentos). Os esquemas de balanceamento possíveis são um por Node, um por grupo de Node, um por LDM por Node e um por LDM por grupo de Node.

  Esta configuração pode ser controlada para tabelas individuais por meio de uma opção `PARTITION_BALANCE` (renomeada de `FRAGMENT_COUNT_TYPE` no NDB 7.5.4) incorporada em comentários `NDB_TABLE` nas instruções `CREATE TABLE` ou `ALTER TABLE`. As configurações de `READ_BACKUP` em nível de tabela também são suportadas usando esta sintaxe. Para obter mais informações e exemplos, consulte Seção 13.1.18.9, “Setting NDB Comment Options”.

  Em aplicações API NDB, o balanceamento de Partition de uma tabela também pode ser obtido e definido usando métodos fornecidos para esta finalidade; consulte Table::getPartitionBalance() e Table::setPartitionBalance(), bem como Object::PartitionBalance, para obter mais informações sobre estes.

  Como parte deste trabalho, o NDB 7.5.2 também introduz a system variable `ndb_data_node_neighbour`. Isso se destina ao uso, em transaction hinting, para fornecer um Node de dados “próximo” (nearby) a este SQL node.

  Além disso, ao restaurar schemas de tabela, **ndb_restore** `--restore-meta` agora usa o particionamento padrão do Cluster de destino, em vez de usar o mesmo número de Partitions do Cluster original do qual o backup foi feito. Consulte Seção 21.5.24.2.2, “Restoring to More Nodes Than the Original”, para obter mais informações e um exemplo.

  O NDB 7.5.3 adiciona um aprimoramento adicional ao `READ_BACKUP`: nesta e em versões posteriores, é possível definir `READ_BACKUP` para uma determinada tabela online como parte de `ALTER TABLE ... ALGORITHM=INPLACE ...`.

* **Melhorias no ThreadConfig.** Uma série de aprimoramentos e adições de recursos são implementados no NDB 7.5.2 para o parâmetro de configuração `ThreadConfig` do Node de dados multi-Thread (**ndbmtd**")), incluindo suporte para um número maior de plataformas. Estas alterações são descritas nos próximos parágrafos.

  O Lock não exclusivo de CPU agora é suportado no FreeBSD e Windows, usando `cpubind` e `cpuset`. O Lock exclusivo de CPU agora é suportado apenas no Solaris, usando os parâmetros `cpubind_exclusive` e `cpuset_exclusive`, que são introduzidos nesta versão.

  A priorização de Thread agora está disponível, controlada pelo novo parâmetro `thread_prio`. `thread_prio` é suportado em Linux, FreeBSD, Windows e Solaris, e varia um pouco de acordo com a plataforma. Para obter mais informações, consulte a descrição de `ThreadConfig`.

  O parâmetro `realtime` agora é suportado em plataformas Windows.

* **Partitions maiores que 16 GB.** Devido a um aprimoramento na implementação do Hash Index usado pelos Nodes de dados do NDB Cluster, as Partitions das tabelas `NDB` agora podem conter mais de 16 GB de dados para colunas fixed, e o tamanho máximo de Partition para colunas fixed agora é elevado para 128 TB. A limitação anterior era devido ao fato de o Block `DBACC` no Kernel `NDB` usar apenas referências de 32 bits para a parte de tamanho fixed de uma linha no Block `DBTUP`, embora referências de 45 bits para estes dados sejam usadas no próprio `DBTUP` e em outras partes do Kernel fora do `DBACC`; todas essas referências aos dados tratados no Block `DBACC` agora usam 45 bits.

* **Imprimir instruções SQL do ndb_restore.** O NDB 7.5.4 adiciona a opção `--print-sql-log` para o utilitário **ndb_restore** fornecido com a distribuição NDB Cluster. Esta opção permite o SQL Logging para `stdout`. **Importante**: Cada tabela a ser restaurada usando esta opção deve ter uma Primary Key explicitamente definida.

  Consulte Seção 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”, para obter mais informações.

* **Organização dos pacotes RPM.** A partir do NDB 7.5.4, a nomenclatura e a organização dos pacotes RPM fornecidos para o NDB Cluster se alinham mais estreitamente com aqueles lançados para o MySQL Server. Os nomes de todos os RPMs do NDB Cluster agora são prefixados com `mysql-cluster`. Os Nodes de dados agora são instalados usando o pacote `data-node`; os Nodes de gerenciamento agora são instalados a partir do pacote `management-server`; e os SQL nodes exigem os pacotes `server` e `common`. Os programas cliente MySQL e `NDB`, incluindo o cliente **mysql** e o cliente de gerenciamento **ndb_mgm**, agora estão incluídos no RPM `client`.

  Para uma lista detalhada dos RPMs do NDB Cluster e outras informações, consulte Seção 21.3.1.2, “Installing NDB Cluster from RPM”.

* **Tabelas ndbinfo processes e config_nodes.** O NDB 7.5.7 adiciona duas tabelas ao Database de informações `ndbinfo` para fornecer informações sobre os Nodes do Cluster; estas tabelas estão listadas aqui:

  + `config_nodes`: Esta tabela fornece o Node ID, o tipo de processo e o nome do host (host name) para cada Node listado em um arquivo de configuração do Cluster NDB.

  + A tabela `processes` mostra informações sobre os Nodes atualmente conectados ao Cluster; estas informações incluem o nome do processo e o ID do processo do sistema; para cada Node de dados e SQL node, ela também mostra o ID do processo do processo angel do Node. Além disso, a tabela mostra um service address para cada Node conectado; este address pode ser definido em aplicações API NDB usando o método `Ndb_cluster_connection::set_service_uri()`, que também é adicionado no NDB 7.5.7.

* **System name.** O system name de um NDB Cluster pode ser usado para identificar um Cluster específico. A partir do NDB 7.5.7, o MySQL Server mostra este nome como o valor da Status Variable `Ndb_system_name`; as aplicações API NDB podem usar o método `Ndb_cluster_connection::get_system_name()` que é adicionado na mesma versão.

  Um system name baseado no horário em que o Management Server foi iniciado é gerado automaticamente; você pode sobrescrever este valor adicionando uma seção `[system]` ao arquivo de configuração do Cluster e definindo o parâmetro `Name` com um valor de sua escolha nesta seção, antes de iniciar o Management Server.

* **Opções do ndb_restore.** A partir do NDB 7.5.13, as opções `--nodeid` e `--backupid` são ambas obrigatórias ao invocar **ndb_restore**.

* **Melhorias no ndb_blob_tool.** A partir do NDB 7.5.18, o utilitário **ndb_blob_tool** pode detectar partes BLOB ausentes para as quais existem partes inline e substituí-las por partes BLOB placeholder (consistindo em caracteres de espaço) do tamanho correto. Para verificar se há partes BLOB ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes BLOB ausentes por placeholders, use a opção `--add-missing`.

  Para obter mais informações, consulte Seção 21.5.6, “ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”.

* **Opção --ndb-log-fail-terminate.** A partir do NDB 7.5.18, você pode fazer com que o SQL node encerre sempre que não conseguir fazer o Logging de todos os row events completamente. Isso pode ser feito iniciando **mysqld** com a opção `--ndb-log-fail-terminate`.

* **Programas NDB — Remoção da dependência NDBT.** A dependência de vários programas utilitários `NDB` da biblioteca `NDBT` foi removida. Esta biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nestes programas pode levar a problemas indesejados durante os testes.

  Os programas afetados estão listados aqui, juntamente com as versões NDB nas quais a dependência foi removida:

  + **ndb_restore**, no NDB 7.5.15
  + **ndb_show_tables**, no NDB 7.5.18
  + **ndb_waiter**, no NDB 7.5.18

  O principal efeito desta alteração para os usuários é que esses programas não imprimem mais `NDBT_ProgramExit - status` após a conclusão de uma execução (run). Aplicações que dependem de tal comportamento devem ser atualizadas para refletir a alteração ao fazer o Upgrade para as versões indicadas.

* **Descontinuação e remoção do Auto-Installer.** A ferramenta de instalação baseada na web MySQL NDB Cluster Auto-Installer (**ndb_setup.py**) está descontinuada (deprecated) no NDB 7.5.20 e é removida no NDB 7.5.21 e posteriores. Não é mais suportada.

* **Descontinuação e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi descontinuado no NDB 7.5.20 e removido no NDB 7.5.21.

* **Suporte a Node.js removido.** A partir da versão NDB Cluster 7.5.20, o suporte ao Node.js pelo NDB 7.5 foi removido.

  O suporte ao Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

* **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 7.5.23, **ndb_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e o inverso, usando as opções listadas aqui:

  + Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

    A coluna originalmente declarada como `NULL` não deve conter nenhuma linha `NULL`; caso contenha, **ndb_restore** é encerrado com um erro.

  + Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

  Para obter mais informações, consulte as descrições das opções indicadas do **ndb_restore**.

* **Suporte a OpenSSL 3.0.** A partir do NDB 7.5.31, todos os binários do MySQL Server e cliente incluídos na distribuição `NDB` são compilados com suporte para OpenSSL 3.0.

O ClusterJPA não é mais suportado a partir do NDB 7.5.7; seu código-fonte e binário foram removidos da distribuição NDB Cluster.

O NDB Cluster 7.5 também é suportado pelo MySQL Cluster Manager, que fornece uma interface de linha de comando avançada que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte MySQL Cluster Manager 1.4.8 User Manual, para obter mais informações.