#### 21.2.4.1 O que há de novo no NDB Cluster 7.5

As principais mudanças e novas funcionalidades do NDB Cluster 7.5 que provavelmente serão de interesse estão listadas a seguir:

- **Melhorias no ndbinfo.** Várias alterações foram feitas no banco de dados `ndbinfo`, sendo a principal delas que agora fornece informações detalhadas sobre os parâmetros de configuração do nó do NDB Cluster.

  A tabela `config_params` foi tornado somente de leitura e foi aprimorada com colunas adicionais que fornecem informações sobre cada parâmetro de configuração, incluindo o tipo do parâmetro, o valor padrão, os valores máximo e mínimo (quando aplicável), uma breve descrição do parâmetro e se o parâmetro é obrigatório. Esta tabela também fornece a cada parâmetro um `param_number` único.

  Uma linha na tabela `config_values` mostra o valor atual de um parâmetro específico no nó com o ID especificado. O parâmetro é identificado pelo valor da coluna `config_param`, que corresponde ao `param_number` da tabela `config_params`.

  Usando essa relação, você pode criar uma junção nessas duas tabelas para obter os valores padrão, máximo, mínimo e atual para um ou mais parâmetros de configuração do NDB Cluster por nome. Um exemplo de declaração SQL usando essa junção é mostrado aqui:

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

  Para obter mais informações sobre essas alterações, consulte Seção 21.6.15.8, “A tabela ndbinfo config\_params”. Consulte Seção 21.6.15.9, “A tabela ndbinfo config\_values” para obter mais informações e exemplos.

  Além disso, o banco de dados `ndbinfo` não depende mais do mecanismo de armazenamento `MyISAM`. Todas as tabelas e visualizações `ndbinfo` agora usam `NDB` (mostrado como `NDBINFO`).

  Várias novas tabelas `ndbinfo` foram introduzidas no NDB 7.5.4. Essas tabelas estão listadas aqui, com descrições breves:

  - `dict_obj_info` fornece os nomes e tipos dos objetos de banco de dados no `NDB`, além de informações sobre objetos pai, quando aplicável

  - A página `table_distribution_status` fornece informações sobre o status da distribuição de tabelas `NDB`

  - `table_fragments` fornece informações sobre a distribuição dos fragmentos de tabela `NDB`

  - A página `table_info` fornece informações sobre registro, verificação de ponto de controle, armazenamento e outras opções em vigor para cada tabela `NDB`

  - `table_replicas` fornece informações sobre as réplicas de fragmentação

  Veja as descrições das tabelas individuais para mais informações.

- **Alterações no formato da linha e coluna padrão.** A partir do NDB 7.5.1, o valor padrão tanto para a opção `ROW_FORMAT` quanto para a opção `COLUMN_FORMAT` do `CREATE TABLE` pode ser definido como `DYNAMIC`, em vez de `FIXED`. Para isso, uma nova variável do servidor MySQL `ndb_default_column_format` é adicionada como parte dessa mudança; defina isso para `FIXED` ou `DYNAMIC` (ou inicie o **mysqld** com a opção equivalente `--ndb-default-column-format=FIXED`) para forçar o uso desse valor para `COLUMN_FORMAT` e `ROW_FORMAT`. Antes do NDB 7.5.4, o valor padrão dessa variável era `DYNAMIC`; nesta e em versões posteriores, o padrão é `FIXED`, o que oferece compatibilidade reversa com versões anteriores (Bug #24487363).

  O formato de linha e o formato de coluna usados pelas colunas existentes das tabelas não são afetados por essa alteração. Novas colunas adicionadas a essas tabelas usam os novos padrões para essas colunas (possivelmente sobrescritos por `ndb_default_column_format`), e as colunas existentes são alteradas para usá-las também, desde que a instrução `ALTER TABLE` que realiza essa operação especifique `ALGORITHM=COPY`.

  Nota

  Uma cópia de `ALTER TABLE` não pode ser feita implicitamente se o **mysqld** for executado com `--ndb-allow-copying-alter-table=FALSE` (mysql-cluster-options-variables.html#option\_mysqld\_ndb-allow-copying-alter-table).

- **O `ndb_binlog_index` não depende mais do MyISAM.** A partir da versão NDB 7.5.2, a tabela `ndb_binlog_index` usada na Replicação em NDB Cluster agora utiliza o mecanismo de armazenamento `InnoDB` em vez do `MyISAM`. Ao fazer a atualização, você pode executar **mysql\_upgrade** com a opção `--force` (`--upgrade-system-tables` em inglês) para fazer com que ele execute a instrução `ALTER TABLE ... ENGINE=INNODB` (alter-table.html) nesta tabela. O uso do `MyISAM` para esta tabela continua sendo suportado para compatibilidade com versões anteriores.

  Uma vantagem dessa mudança é que ela permite depender do comportamento transacional e de leituras sem bloqueio para essa tabela, o que pode ajudar a aliviar problemas de concorrência durante operações de purga e rotação de log, e melhorar a disponibilidade dessa tabela.

- **Alterações na Tabela.** O NDB Cluster anteriormente suportava uma sintaxe alternativa para a alteração online da tabela `ALTER TABLE`. Isso não é mais suportado no NDB Cluster 7.5, que faz uso exclusivo de `ALGORITHM = DEFAULT|COPY|INPLACE` para DDL de tabelas, como no servidor MySQL padrão.

  Outra mudança que afeta o uso dessa declaração é que `ALTER TABLE ... ALGORITHM=INPLACE RENAME` agora pode conter operações de DDL além da renomeação.

- O parâmetro **ExecuteOnComputer** foi descontinuado. O parâmetro de configuração **ExecuteOnComputer** para os nós de gerenciamento (management nodes), os nós de dados (data nodes) e os nós de API (API nodes) foi descontinuado e agora está sujeito à remoção em uma futura versão do NDB Cluster. Você deve usar o parâmetro equivalente **HostName** para todos os três tipos de nós.

- **Otimização de registros por chave.** O manipulador NDB agora utiliza a interface registros por chave para estatísticas de índice implementadas para o otimizador no MySQL 5.7.5. Alguns dos benefícios dessa mudança incluem os listados aqui:

  - O otimizador agora escolhe melhores planos de execução em muitos casos em que um índice de junção menos ótimo ou uma ordem de junção de tabelas anteriormente seriam escolhidas

  - As estimativas de linha mostradas por `EXPLAIN` são mais precisas

  - As estimativas de cardinalidade exibidas por `SHOW INDEX` foram melhoradas

- **IDs de nós do pool de conexões.** O NDB 7.5.0 adiciona a opção **mysqld** `--ndb-cluster-connection-pool-nodeids`, que permite definir um conjunto de IDs de nós para o pool de conexões. Esta configuração substitui a opção `--ndb-nodeid`, o que significa que também substitui a opção `--ndb-connectstring` e a variável de ambiente `NDB_CONNECTSTRING`.

  Nota

  Você pode definir o tamanho do pool de conexões usando a opção `--ndb-cluster-connection-pool` para o **mysqld**.

- **create\_old\_temporals removido.** A variável de sistema `create_old_temporals` foi descontinuada no NDB Cluster 7.4 e agora foi removida.

- **Prompt do comando CLIENT PROMPT do ndb\_mgm.** O NDB Cluster 7.5 adiciona um novo comando para definir o prompt de linha de comando do cliente. O exemplo a seguir ilustra o uso do comando `PROMPT`:

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

  Para obter informações adicionais e exemplos, consulte Seção 21.6.1, “Comandos no cliente de gerenciamento de cluster NDB”.

- **Armazenamento de coluna FIXA aumentado por fragmento.** O NDB Cluster 7.5 e versões posteriores suportam um máximo de 128 TB por fragmento de dados nas colunas `FIXED`. No NDB Cluster 7.4 e versões anteriores, esse valor era de 16 GB por fragmento.

- **Parâmetros desatualizados removidos.** Os seguintes parâmetros de configuração de nó de dados do NDB Cluster foram desatualizados em versões anteriores do NDB Cluster e foram removidos no NDB 7.5.0:

  - `Id`: descontinuado na NDB 7.1.9; substituído por `NodeId`.

  - `NoOfDiskPagesToDiskDuringRestartTUP`, `NoOfDiskPagesToDiskDuringRestartACC`: ambos desatualizados, não tiveram efeito; foram substituídos no MySQL 5.1.6 por `DiskCheckpointSpeedInRestart`, que, por sua vez, foi posteriormente desatualizado (no NDB 7.4.1) e agora também foi removido.

  - `NoOfDiskPagesToDiskAfterRestartACC`, `NoOfDiskPagesToDiskAfterRestartTUP`: ambos desatualizados e sem efeito; substituídos no MySQL 5.1.6 por `DiskCheckpointSpeed`, que, por sua vez, foi posteriormente desatualizado (no NDB 7.4.1) e agora também foi removido.

  - `ReservedSendBufferMemory`: Desatualizado; não tinha mais efeito.

  - `MaxNoOfIndexes`: arcaico (pré-MySQL 4.1), não teve efeito; há muito tempo substituído por `MaxNoOfOrderedIndexes` ou `MaxNoOfUniqueHashIndexes`.

  - `Discless`: sinônimo arcaico (pré-MySQL 4.1) e já substituído pelo `Diskless`.

  O parâmetro de configuração de computador `ByteOrder`, arcaico e não utilizado (e, por isso, também anteriormente não documentado), também foi removido no NDB 7.5.0.

  Os parâmetros descritos acima não são suportados no NDB 7.5. Se você tentar usar qualquer um desses parâmetros em um arquivo de configuração de um NDB Cluster, agora será gerado um erro.

- Melhorias no rastreamento do DBTC. Os rastreamhos foram aprimorados reduzindo o número de sinais utilizados para a comunicação entre os blocos de kernel `DBTC` e `DBDIH` no `NDB`, permitindo uma maior escalabilidade dos nós de dados quando utilizados para operações de rastreamento, diminuindo o uso de recursos de CPU para operações de rastreamento, em alguns casos, em aproximadamente cinco por cento.

  Além disso, como resultado dessas mudanças, os tempos de resposta devem ser significativamente melhorados, o que pode ajudar a prevenir problemas de sobrecarga dos principais threads. Além disso, as varreduras feitas no bloco do kernel `BACKUP` também foram melhoradas e tornam-se mais eficientes do que em versões anteriores.

- **Suporte a coluna JSON.** O NDB 7.5.2 e versões posteriores suportam o tipo de coluna `JSON` para tabelas `NDB` e as funções JSON encontradas no MySQL Server, sujeito à limitação de que uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

- **Leia de qualquer fragmento de replica; especifique o número de fragmentos de partição do hashmap.** Anteriormente, todas as leituras eram direcionadas para a replica primária do fragmento, exceto para leituras simples. (Uma leitura simples é uma leitura que bloqueia a linha enquanto a lê.) A partir do NDB 7.5.2, é possível habilitar leituras de qualquer replica de fragmento. Isso é desativado por padrão, mas pode ser habilitado para um determinado nó SQL usando a variável de sistema `ndb_read_backup` adicionada nesta versão.

  Anteriormente, era possível definir tabelas com apenas um tipo de mapeamento de partição, com uma partição primária em cada LDM em cada nó, mas no NDB 7.5.2, torna-se possível ser mais flexível na atribuição de partições, definindo um equilíbrio de partição (tipo de contagem de fragmentos). Os esquemas de equilíbrio possíveis são um por nó, um por grupo de nós, um por LDM por nó e um por LDM por grupo de nós.

  Essa configuração pode ser controlada para tabelas individuais por meio de uma opção `PARTITION_BALANCE` (renomeada de `FRAGMENT_COUNT_TYPE` na versão NDB 7.5.4) embutida nos comentários `NDB_TABLE` nas instruções `CREATE TABLE` ou `ALTER TABLE` (create-table.html) ou `ALTER TABLE` (alter-table.html). As configurações para `READ_BACKUP` em nível de tabela também são suportadas usando essa sintaxe. Para mais informações e exemplos, consulte Seção 13.1.18.9, “Definindo Opções de Comentários NDB”.

  Em aplicativos da API NDB, o equilíbrio de partição de uma tabela também pode ser obtido e definido usando métodos fornecidos para esse propósito; consulte Table::getPartitionBalance() e Table::setPartitionBalance(), além de Object::PartitionBalance, para obter mais informações sobre esses métodos.

  Como parte desse trabalho, o NDB 7.5.2 também introduz a variável de sistema `ndb_data_node_neighbour`. Esta variável é destinada a ser usada, na indicação de transações, para fornecer um nó de dados "vizinho" a este nó SQL.

  Além disso, ao restaurar esquemas de tabela, **ndb\_restore** `--restore-meta` agora usa a partição padrão do cluster de destino, em vez de usar o mesmo número de partições que o cluster original do qual o backup foi feito. Consulte Seção 21.5.24.2.2, “Restauração para Mais Nodos do que o Original” para obter mais informações e um exemplo.

  O NDB 7.5.3 adiciona uma melhoria adicional para `READ_BACKUP`: nesta e em versões posteriores, é possível definir `READ_BACKUP` para uma tabela específica online como parte de `ALTER TABLE ... ALGORITHM=INPLACE ...`.

- Melhorias no **ThreadConfig**. Várias melhorias e adições de recursos são implementadas no NDB 7.5.2 para o parâmetro de configuração do nó de dados multithread `ThreadConfig` (**ndbmtd**), incluindo suporte para um número maior de plataformas. Essas mudanças são descritas nos próximos parágrafos.

  O bloqueio exclusivo da CPU agora é suportado no FreeBSD e no Windows, usando `cpubind` e `cpuset`. O bloqueio exclusivo da CPU agora é suportado no Solaris (apenas) usando os parâmetros `cpubind_exclusive` e `cpuset_exclusive`, que foram introduzidos nesta versão.

  A priorização de threads agora está disponível, controlada pelo novo parâmetro `thread_prio`. O `thread_prio` é suportado no Linux, FreeBSD, Windows e Solaris e varia um pouco de acordo com a plataforma. Para mais informações, consulte a descrição de `ThreadConfig`.

  O parâmetro `realtime` agora é suportado nas plataformas Windows.

- **Partições maiores que 16 GB.** Devido a uma melhoria na implementação do índice de hash usado pelos nós de dados do NDB Cluster, as partições das tabelas `NDB` podem agora conter mais de 16 GB de dados para colunas fixas, e o tamanho máximo da partição para colunas fixas foi aumentado para 128 TB. A limitação anterior era devida ao fato de que o bloco `DBACC` no kernel `NDB` usava apenas referências de 32 bits para a parte de tamanho fixo de uma linha no bloco `DBTUP`, embora referências de 45 bits para esses dados sejam usadas no próprio `DBTUP` e em outros lugares do kernel fora do `DBACC`; todas essas referências aos dados tratados no bloco `DBACC` agora usam 45 bits.

- **Imprima instruções SQL do ndb\_restore.** O NDB 7.5.4 adiciona a opção `--print-sql-log` para o utilitário **ndb\_restore** fornecido com a distribuição do NDB Cluster. Esta opção habilita o registro de SQL no `stdout`. **Importante**: Toda tabela que será restaurada usando esta opção deve ter uma chave primária definida explicitamente.

  Para obter mais informações, consulte Seção 21.5.24, “ndb\_restore — Restaurar um backup de um cluster NDB”.

- **Organização dos pacotes RPM.** A partir do NDB 7.5.4, a nomenclatura e a organização dos pacotes RPM fornecidos para o NDB Cluster estão mais alinhadas com as versões lançadas para o servidor MySQL. Os nomes de todos os pacotes RPM do NDB Cluster agora são prefixados com `mysql-cluster`. Os nós de dados são instalados agora usando o pacote `data-node`; os nós de gerenciamento são instalados agora a partir do pacote `management-server`; e os nós SQL requerem os pacotes `server` e `common`. Os programas cliente MySQL e `NDB`, incluindo o cliente **mysql** e o cliente de gerenciamento **ndb\_mgm**, agora estão incluídos no pacote RPM `client`.

  Para uma lista detalhada dos RPMs do NDB Cluster e outras informações, consulte Seção 21.3.1.2, “Instalando o NDB Cluster a partir do RPM”.

- O **ndbinfo processa e configura as tabelas \_config\_nodes.** O NDB 7.5.7 adiciona duas tabelas ao banco de dados de informações `ndbinfo` (mysql-cluster-ndbinfo.html) para fornecer informações sobre os nós do cluster; essas tabelas estão listadas aqui:

  - `config_nodes`: Esta tabela fornece o ID do nó, o tipo de processo e o nome do host para cada nó listado no arquivo de configuração de um cluster NDB.

  - O `processes` mostra informações sobre os nós atualmente conectados ao clúster; essas informações incluem o nome do processo e o ID do processo do sistema; para cada nó de dados e nó SQL, também mostra o ID do processo do processo anjo do nó. Além disso, a tabela mostra um endereço de serviço para cada nó conectado; esse endereço pode ser definido em aplicativos da API NDB usando o método `Ndb_cluster_connection::set_service_uri()`, que também foi adicionado no NDB 7.5.7.

- **Nome do sistema.** O nome do sistema de um clúster NDB pode ser usado para identificar um clúster específico. A partir do NDB 7.5.7, o MySQL Server exibe esse nome como o valor da variável de status `Ndb_system_name`; os aplicativos da API NDB podem usar o método `Ndb_cluster_connection::get_system_name()` que é adicionado na mesma versão.

  Um nome do sistema baseado no horário em que o servidor de gerenciamento foi iniciado é gerado automaticamente; você pode substituir esse valor adicionando uma seção `[system]` ao arquivo de configuração do clúster e definindo o parâmetro `Name` para um valor de sua escolha nesta seção, antes de iniciar o servidor de gerenciamento.

- **Opções de ndb\_restore.** A partir da versão NDB 7.5.13, as opções `--nodeid` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_nodeid) e `--backupid` (mysql-cluster-programs-ndb-restore.html#option\_ndb\_restore\_backupid) são obrigatórias ao invocar o **ndb\_restore**.

- Melhorias no **ndb\_blob\_tool**. A partir do NDB 7.5.18, o utilitário **ndb\_blob\_tool** pode detectar partes de blob ausentes para as quais existem partes em linha e substituí-las por partes de blob de espaço (com caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes por marcadores, use a opção `--add-missing`.

  Para obter mais informações, consulte Seção 21.5.6, “ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”.

- **Opção `--ndb-log-fail-terminate`.** A partir do NDB 7.5.18, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de linha completamente. Isso pode ser feito iniciando o **mysqld** com a opção `--ndb-log-fail-terminate` (mysql-cluster-options-variables.html#option\_mysqld\_ndb-log-fail-terminate).

- **Programas do NDB — Remoção da dependência do NDBT.** A dependência de vários programas de utilitários do NDB na biblioteca NDBT foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nesses programas poderia causar problemas indesejados durante os testes.

  Os programas afetados estão listados aqui, juntamente com as versões do `NDB` nas quais a dependência foi removida:

  - **ndb\_restore**, em NDB 7.5.15
  - **ndb\_show\_tables**, em NDB 7.5.18
  - **ndb\_waiter**, em NDB 7.5.18

  O principal efeito dessa mudança para os usuários é que esses programas não imprimem mais `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao serem atualizadas para as versões indicadas.

- **Depreciação e remoção do Auto-Instalador.** A ferramenta de instalação baseada na web do Auto-Instalador do MySQL NDB Cluster (**ndb\_setup.py**) é descontinuada no NDB 7.5.20 e removida no NDB 7.5.21 e versões posteriores. Ela não é mais suportada.

- **Descontinuidade e remoção do ndbmemcache.** O `ndbmemcache` não é mais suportado. O `ndbmemcache` foi descontinuado no NDB 7.5.20 e removido no NDB 7.5.21.

- **Suporte ao Node.js removido.** A partir da versão 7.5.20 do NDB Cluster, o suporte ao Node.js pela NDB 7.5 foi removido.

  O suporte para Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

- **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 7.5.23, o **ndb\_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

  - Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

    A coluna originalmente declarada como `NULL` não deve conter nenhuma linha `NULL`; se contiver, o **ndb\_restore** sai com um erro.

  - Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

  Para obter mais informações, consulte as descrições das opções indicadas **ndb\_restore**.

- **Suporte ao OpenSSL 3.0.** A partir do NDB 7.5.31, todos os binários do servidor e do cliente MySQL incluídos na distribuição `NDB` são compilados com suporte ao OpenSSL 3.0

O ClusterJPA não é mais suportado a partir do NDB 7.5.7; seu código-fonte e binário foram removidos da distribuição do NDB Cluster.

O NDB Cluster 7.5 também é suportado pelo MySQL Cluster Manager, que oferece uma interface avançada de linha de comando que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 1.4.8, para obter mais informações.
