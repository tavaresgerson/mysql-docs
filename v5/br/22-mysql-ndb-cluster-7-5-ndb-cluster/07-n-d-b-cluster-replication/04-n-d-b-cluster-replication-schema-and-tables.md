### 21.7.4 Esquema e Tabelas de Replication do NDB Cluster

* [Tabela ndb_apply_status](mysql-cluster-replication-schema.html#ndb-replication-ndb-apply-status "ndb_apply_status Table")
* [Tabela ndb_binlog_index](mysql-cluster-replication-schema.html#ndb-replication-ndb-binlog-index "ndb_binlog_index Table")
* [Tabela ndb_replication](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table")

A Replication no NDB Cluster faz uso de várias tabelas dedicadas no Database `mysql` em cada instância do MySQL Server que atua como um SQL node, tanto no Cluster que está sendo replicado quanto na replica. Isso é verdade independentemente de a replica ser um único server ou um Cluster.

As tabelas `ndb_binlog_index` e `ndb_apply_status` são criadas no Database `mysql`. Elas não devem ser explicitamente replicadas pelo usuário. Normalmente, a intervenção do usuário não é necessária para criar ou manter qualquer uma dessas tabelas, uma vez que ambas são mantidas pela Thread injetora do binary log (binlog) do [`NDB`] (NDB binlog injector thread). Isso mantém o processo [**mysqld**] source atualizado em relação às alterações realizadas pela Storage Engine [`NDB`]. A NDB binlog injector thread recebe events diretamente da Storage Engine [`NDB`]. O injetor [`NDB`] é responsável por capturar todos os data events dentro do Cluster e garante que todos os events que alteram, inserem ou excluem dados sejam registrados na tabela `ndb_binlog_index`. A I/O thread da replica transfere os events do binary log do source para o relay log da replica.

A tabela `ndb_replication` deve ser criada manualmente. Esta tabela pode ser atualizada pelo usuário para realizar filtering por Database ou tabela. Consulte [Tabela ndb_replication] para mais informações. `ndb_replication` também é usada na detecção e resolução de conflitos da NDB Replication para controle de resolução de conflitos; consulte [Controle de Resolução de Conflitos].

Embora `ndb_binlog_index` e `ndb_apply_status` sejam criadas e mantidas automaticamente, é aconselhável verificar a existência e a integridade dessas tabelas como uma etapa inicial na preparação de um NDB Cluster para Replication. É possível visualizar os data events registrados no binary log consultando a tabela `mysql.ndb_binlog_index` diretamente no source. Isso também pode ser realizado usando a instrução [`SHOW BINLOG EVENTS`] em qualquer SQL node, seja source ou replica. (Consulte [Seção 13.7.5.2, “SHOW BINLOG EVENTS Statement”]).

Você também pode obter informações úteis a partir da saída de [`SHOW ENGINE NDB STATUS`].

Note

Ao realizar schema changes em tabelas [`NDB`], as aplicações devem esperar até que a instrução [`ALTER TABLE`] tenha retornado na conexão do MySQL client que emitiu a instrução antes de tentar usar a definição atualizada da tabela.

#### Tabela ndb_apply_status

A `ndb_apply_status` é usada para manter um registro das operations que foram replicadas do source para a replica. Se a tabela `ndb_apply_status` não existir na replica, [**ndb_restore**] a recria.

Ao contrário do caso com `ndb_binlog_index`, os dados nesta tabela não são específicos de nenhum SQL node no Cluster (replica) e, portanto, `ndb_apply_status` pode usar a Storage Engine `NDBCLUSTER`, conforme mostrado aqui:

```sql
CREATE TABLE `ndb_apply_status` (
    `server_id`   INT(10) UNSIGNED NOT NULL,
    `epoch`       BIGINT(20) UNSIGNED NOT NULL,
    `log_name`    VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
    `start_pos`   BIGINT(20) UNSIGNED NOT NULL,
    `end_pos`     BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (`server_id`) USING HASH
) ENGINE=NDBCLUSTER   DEFAULT CHARSET=latin1;
```

A tabela `ndb_apply_status` é preenchida apenas nas replicas, o que significa que, no source, esta tabela nunca contém nenhuma row; portanto, não há necessidade de alocar qualquer [`DataMemory`] para `ndb_apply_status` lá.

Como esta tabela é preenchida a partir de dados originados no source, ela deve ter permissão para replicar; qualquer replication filtering ou regras de binary log filtering que inadvertidamente impeçam a replica de atualizar `ndb_apply_status`, ou que impeçam o source de escrever no binary log, podem impedir que a Replication entre Clusters funcione corretamente. Para mais informações sobre problemas potenciais decorrentes de tais regras de filtering, consulte [Problemas de Replication e regras de binary log filtering com replication entre NDB Clusters].

`0` na coluna `epoch` desta tabela indica uma transaction originada de uma Storage Engine diferente de `NDB`.

#### Tabela ndb_binlog_index

A NDB Cluster Replication usa a tabela `ndb_binlog_index` para armazenar os dados de Indexing do binary log. Como esta tabela é local para cada MySQL server e não participa do clustering, ela usa a Storage Engine [`InnoDB`]. Isso significa que ela deve ser criada separadamente em cada [**mysqld**] que participa do Cluster source. (O binary log em si contém updates de todos os MySQL servers no Cluster.) Esta tabela é definida conforme segue:

```sql
CREATE TABLE `ndb_binlog_index` (
    `Position` BIGINT(20) UNSIGNED NOT NULL,
    `File` VARCHAR(255) NOT NULL,
    `epoch` BIGINT(20) UNSIGNED NOT NULL,
    `inserts` INT(10) UNSIGNED NOT NULL,
    `updates` INT(10) UNSIGNED NOT NULL,
    `deletes` INT(10) UNSIGNED NOT NULL,
    `schemaops` INT(10) UNSIGNED NOT NULL,
    `orig_server_id` INT(10) UNSIGNED NOT NULL,
    `orig_epoch` BIGINT(20) UNSIGNED NOT NULL,
    `gci` INT(10) UNSIGNED NOT NULL,
    `next_position` bigint(20) unsigned NOT NULL,
    `next_file` varchar(255) NOT NULL,
    PRIMARY KEY (`epoch`,`orig_server_id`,`orig_epoch`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

Note

Antes do NDB 7.5.2, esta tabela sempre usava a Storage Engine [`MyISAM`]. Se você estiver atualizando de uma release anterior, você pode usar [**mysql_upgrade**] com as opções [`--force`] e [`--upgrade-system-tables`] após iniciar o server.) A atualização da system table faz com que uma instrução [`ALTER TABLE ... ENGINE=INNODB`] seja executada para esta tabela. O uso da Storage Engine `MyISAM` para esta tabela continua a ser suportado para backward compatibility.

A `ndb_binlog_index` pode exigir espaço em disco adicional após ser convertida para `InnoDB`. Se isso se tornar um problema, você pode economizar espaço usando um tablespace `InnoDB` para esta tabela, alterando seu `ROW_FORMAT` para `COMPRESSED`, ou ambos. Para mais informações, consulte [Seção 13.1.19, “CREATE TABLESPACE Statement”], e [Seção 13.1.18, “CREATE TABLE Statement”], bem como [Seção 14.6.3, “Tablespaces”].

O tamanho da tabela `ndb_binlog_index` depende do número de epochs por binary log file e do número de binary log files. O número de epochs por binary log file normalmente depende da quantidade de binary log gerada por epoch e do tamanho do binary log file, com epochs menores resultando em mais epochs por file. Você deve estar ciente de que epochs vazios produzem inserts na tabela `ndb_binlog_index`, mesmo quando a opção [`--ndb-log-empty-epochs`] está `OFF`, o que significa que o número de entries por file depende da duração de tempo que o file está em uso; esta relação pode ser representada pela fórmula mostrada aqui:

```sql
[number of epochs per file] = [time spent per file] / TimeBetweenEpochs
```

Um NDB Cluster ocupado escreve no binary log regularmente e presumivelmente rotaciona binary log files mais rapidamente do que um Cluster ocioso. Isso significa que um NDB Cluster “ocioso” com [`--ndb-log-empty-epochs=ON`] pode, na verdade, ter um número muito maior de rows `ndb_binlog_index` por file do que um com muita activity.

Quando [**mysqld**] é iniciado com a opção [`--ndb-log-orig`], as colunas `orig_server_id` e `orig_epoch` armazenam, respectivamente, o ID do server onde o event se originou e o epoch em que o event ocorreu no server de origem, o que é útil em configurações de NDB Cluster Replication que empregam múltiplos sources. A instrução [`SELECT`] usada para encontrar a binary log position mais próxima do highest applied epoch na replica em uma configuração multi-source (consulte [Seção 21.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”]) emprega essas duas colunas, que não são indexed. Isso pode levar a problemas de performance ao tentar o failover, visto que a Query deve realizar um table scan, especialmente quando o source está sendo executado com [`--ndb-log-empty-epochs=ON`]. Você pode melhorar os tempos de failover multi-source adicionando um Index a essas colunas, conforme mostrado aqui:

```sql
ALTER TABLE mysql.ndb_binlog_index
    ADD INDEX orig_lookup USING BTREE (orig_server_id, orig_epoch);
```

Adicionar este Index não oferece benefício ao replicar de um single source para uma single replica, visto que a Query usada para obter a binary log position em tais casos não faz uso de `orig_server_id` ou `orig_epoch`.

Consulte [Seção 21.7.8, “Implementing Failover with NDB Cluster Replication”], para mais informações sobre o uso das colunas `next_position` e `next_file`.

A figura a seguir mostra a relação do replication source server do NDB Cluster, sua injector thread de binary log e a tabela `mysql.ndb_binlog_index`.

**Figura 21.16 O Source Cluster de Replication**

![A maioria dos conceitos é descrita no texto circundante. Esta imagem complexa tem três áreas principais. A área superior esquerda é dividida em três seções: MySQL Server (mysqld), NDBCLUSTER table handler e mutex. Uma connection thread os conecta, e as receiver e injector threads conectam o NDBCLUSTER table handler e o mutex. A área inferior mostra quatro data nodes (ndbd). Todos eles produzem events representados por setas apontando para a receiver thread, e a receiver thread também aponta para as connection e injector threads. Um node envia e recebe para a área do mutex. A seta representando a injector thread aponta para um binary log, bem como para a tabela ndb_binlog_index, que é descrita no texto circundante.](images/cluster-replication-binlog-injector.png)

#### Tabela ndb_replication

A tabela `ndb_replication` é usada para controlar o binary logging e a conflict resolution, e atua por tabela (per-table basis). Cada row nesta tabela corresponde a uma tabela sendo replicada, determina como registrar (log) as changes na tabela e, se uma função de conflict resolution for especificada, determina como resolver conflitos para essa tabela.

Ao contrário das tabelas `ndb_apply_status` e `ndb_replication`, a tabela `ndb_replication` deve ser criada manualmente, usando a instrução SQL mostrada aqui:

```sql
CREATE TABLE mysql.ndb_replication  (
    db VARBINARY(63),
    table_name VARBINARY(63),
    server_id INT UNSIGNED,
    binlog_type INT UNSIGNED,
    conflict_fn VARBINARY(128),
    PRIMARY KEY USING HASH (db, table_name, server_id)
)   ENGINE=NDB
PARTITION BY KEY(db,table_name);
```

As colunas desta tabela estão listadas aqui, com descrições:

* Coluna `db`

  O nome do Database que contém a tabela a ser replicada.

  Você pode empregar um ou ambos os wildcards `_` e `%` como parte do nome do Database. (Veja [Matching com wildcards], mais adiante nesta seção.)

* Coluna `table_name`

  O nome da tabela a ser replicada.

  O nome da tabela pode incluir um ou ambos os wildcards `_` e `%`. Veja [Matching com wildcards], mais adiante nesta seção.

* Coluna `server_id`

  O server ID único da instância MySQL (SQL node) onde a tabela reside.

  `0` nesta coluna funciona como um wildcard equivalente a `%`, e corresponde a qualquer server ID. (Veja [Matching com wildcards], mais adiante nesta seção.)

* Coluna `binlog_type`

  O tipo de binary logging a ser empregado. Consulte o texto para valores e descrições.

* Coluna `conflict_fn`

  A função de conflict resolution a ser aplicada; uma de [NDB$OLD()], [NDB$MAX()], [NDB$MAX_DELETE_WIN()], [NDB$EPOCH()], [NDB$EPOCH_TRANS()], [NDB$EPOCH2()], [NDB$EPOCH2_TRANS()]; `NULL` indica que a conflict resolution não é usada para esta tabela.

  Consulte [Conflict Resolution Functions], para mais informações sobre estas funções e seus usos na conflict resolution do NDB Replication.

  Algumas funções de conflict resolution (`NDB$OLD()`, `NDB$EPOCH()`, `NDB$EPOCH_TRANS()`) exigem o uso de uma ou mais tabelas de exceptions criadas pelo usuário. Consulte [Conflict Resolution Exceptions Table].

Para habilitar a conflict resolution com NDB Replication, é necessário criar e popular esta tabela com control information no SQL node ou nodes onde o conflito deve ser resolvido. Dependendo do tipo e método de conflict resolution a ser empregado, este pode ser o source, a replica, ou ambos os servers. Em uma configuração simples source-replica onde os dados também podem ser alterados localmente na replica, este é tipicamente a replica. Em um esquema de Replication mais complexo, como a bidirectional replication, este é geralmente todos os sources envolvidos. Consulte [Seção 21.7.11, “NDB Cluster Replication Conflict Resolution”], para mais informações.

A tabela `ndb_replication` permite o controle de binary logging em nível de tabela (table-level control) fora do escopo da conflict resolution, caso em que `conflict_fn` é especificado como `NULL`, enquanto os valores das colunas restantes são usados para controlar o binary logging para uma determinada tabela ou conjunto de tabelas que correspondem a uma expressão wildcard. Ao definir o valor apropriado para a coluna `binlog_type`, você pode fazer com que o logging para uma determinada tabela ou tabelas use um formato de binary log desejado, ou desativar o binary logging completamente. Os valores possíveis para esta coluna, com seus valores e descrições, são mostrados na tabela a seguir:

**Tabela 21.64 Valores de binlog_type, com valores e descrições**

<table><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Usar o server default</td> </tr><tr> <td>1</td> <td>Não registrar (log) esta tabela no binary log (mesmo efeito que <code>sql_log_bin = 0</code>, mas se aplica apenas a uma ou mais tabelas especificadas)</td> </tr><tr> <td>2</td> <td>Registrar (log) apenas atributos atualizados; registrá-los como events <code>WRITE_ROW</code></td> </tr><tr> <td>3</td> <td>Registrar (log) a row completa, mesmo que não atualizada (comportamento default do MySQL server)</td> </tr><tr> <td>6</td> <td>Usar atributos atualizados, mesmo que os valores não sejam alterados</td> </tr><tr> <td>7</td> <td>Registrar (log) a row completa, mesmo que nenhum valor seja alterado; registrar updates como events <code>UPDATE_ROW</code></td> </tr><tr> <td>8</td> <td>Registrar (log) update como <code>UPDATE_ROW</code>; registrar apenas colunas de Primary Key na imagem 'before' e apenas colunas atualizadas na imagem 'after' (mesmo efeito que <code>--ndb-log-update-minimal</code>, mas se aplica apenas a uma ou mais tabelas especificadas)</td> </tr><tr> <td>9</td> <td>Registrar (log) update como <code>UPDATE_ROW</code>; registrar apenas colunas de Primary Key na imagem 'before' e todas as colunas diferentes das colunas de Primary Key na imagem 'after'</td> </tr></tbody></table>

Note

Os valores `binlog_type` 4 e 5 não são usados e, portanto, são omitidos da tabela que acabamos de mostrar, bem como da próxima tabela.

Vários valores `binlog_type` são equivalentes a várias combinações das opções de logging do [**mysqld**] [`--ndb-log-updated-only`], [`--ndb-log-update-as-write`] e [`--ndb-log-update-minimal`], conforme mostrado na tabela a seguir:

**Tabela 21.65 Valores de binlog_type com combinações equivalentes de NDB logging options**

<table><thead><tr> <th>Valor</th> <th><code>--ndb-log-updated-only</code> Valor</th> <th><code>--ndb-log-update-as-write</code> Valor</th> <th><code>--ndb-log-update-minimal</code> Valor</th> </tr></thead><tbody><tr> <td>0</td> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <td>1</td> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <td>2</td> <td>ON</td> <td>ON</td> <td>OFF</td> </tr><tr> <td>3</td> <td>OFF</td> <td>ON</td> <td>OFF</td> </tr><tr> <td>6</td> <td>ON</td> <td>OFF</td> <td>OFF</td> </tr><tr> <td>7</td> <td>OFF</td> <td>OFF</td> <td>OFF</td> </tr><tr> <td>8</td> <td>ON</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>9</td> <td>OFF</td> <td>OFF</td> <td>ON</td> </tr></tbody></table>

O binary logging pode ser definido para diferentes formatos para diferentes tabelas inserindo rows na tabela `ndb_replication` usando os valores apropriados para as colunas `db`, `table_name` e `binlog_type`. O valor inteiro interno mostrado na tabela precedente deve ser usado ao definir o formato do binary logging. As duas instruções a seguir definem o binary logging para o registro de rows completas (valor 3) para a tabela `test.a`, e para o registro apenas de updates (valor 2) para a tabela `test.b`:

```sql
# Table test.a: Log full rows
INSERT INTO mysql.ndb_replication VALUES("test", "a", 0, 3, NULL);

# Table test.b: log updates only
INSERT INTO mysql.ndb_replication VALUES("test", "b", 0, 2, NULL);
```

Para desabilitar o logging para uma ou mais tabelas, use 1 para `binlog_type`, conforme mostrado aqui:

```sql
# Disable binary logging for table test.t1
INSERT INTO mysql.ndb_replication VALUES("test", "t1", 0, 1, NULL);

# Disable binary logging for any table in 'test' whose name begins with 't'
INSERT INTO mysql.ndb_replication VALUES("test", "t%", 0, 1, NULL);
```

Desabilitar o logging para uma determinada tabela é o equivalente a definir [`sql_log_bin = 0`], exceto que se aplica a uma ou mais tabelas individualmente. Se um SQL node não estiver realizando binary logging para uma determinada tabela, ele não receberá os row change events para essas tabelas. Isso significa que ele não está recebendo todas as changes e descartando algumas, mas sim que não está se inscrevendo nestas changes.

Desabilitar o logging pode ser útil por uma série de razões, incluindo as listadas aqui:

* Não enviar changes pela network geralmente economiza bandwidth, buffering e recursos de CPU.

* Não registrar (log) changes em tabelas com updates muito frequentes, mas cujo valor não é grande, é ideal para dados transient (como session data) que podem ser relativamente sem importância no caso de uma falha completa do Cluster.

* Usando uma session variable (ou `sql_log_bin`) e código de aplicação, também é possível registrar (log) (ou não registrar) certas instruções SQL ou tipos de instruções SQL; por exemplo, pode ser desejável em alguns casos não registrar instruções DDL em uma ou mais tabelas.

* Dividir replication streams em dois (ou mais) binary logs pode ser feito por razões de performance, uma necessidade de replicar diferentes databases para diferentes locais, uso de diferentes tipos de binary logging para diferentes databases, e assim por diante.

**Matching com wildcards.** Para evitar que seja necessário inserir uma row na tabela `ndb_replication` para cada combinação de Database, tabela e SQL node em sua configuração de Replication, o `NDB` suporta wildcard matching nas colunas `db`, `table_name` e `server_id` desta tabela. Os nomes de Database e tabela usados, respectivamente, em `db` e `table_name` podem conter um ou ambos os wildcards a seguir:

* `_` (caractere underscore): corresponde a zero ou mais caracteres

* `%` (sinal de porcentagem): corresponde a um único caractere

(Estes são os mesmos wildcards suportados pelo operador MySQL [`LIKE`].)

A coluna `server_id` suporta `0` como um wildcard equivalente a `_` (corresponde a qualquer coisa). Isso é usado nos exemplos mostrados anteriormente.

Uma determinada row na tabela `ndb_replication` pode usar wildcards para corresponder a qualquer um dos nomes de Database, nome de tabela e server ID em qualquer combinação. Onde há múltiplas correspondências potenciais na tabela, a melhor correspondência é escolhida, de acordo com a tabela mostrada aqui, onde *W* representa uma correspondência wildcard, *E* uma correspondência exata, e quanto maior o valor na coluna *Quality*, melhor a correspondência:

**Tabela 21.66 Pesos de diferentes combinações de correspondências wildcard e exatas em colunas na tabela mysql.ndb_replication**

<table><thead><tr> <th><code>db</code></th> <th><code>table_name</code></th> <th><code>server_id</code></th> <th>Quality</th> </tr></thead><tbody><tr> <td>W</td> <td>W</td> <td>W</td> <td>1</td> </tr><tr> <td>W</td> <td>W</td> <td>E</td> <td>2</td> </tr><tr> <td>W</td> <td>E</td> <td>W</td> <td>3</td> </tr><tr> <td>W</td> <td>E</td> <td>E</td> <td>4</td> </tr><tr> <td>E</td> <td>W</td> <td>W</td> <td>5</td> </tr><tr> <td>E</td> <td>W</td> <td>E</td> <td>6</td> </tr><tr> <td>E</td> <td>E</td> <td>W</td> <td>7</td> </tr><tr> <td>E</td> <td>E</td> <td>E</td> <td>8</td> </tr></tbody></table>

Assim, uma correspondência exata no nome do Database, nome da tabela e server ID é considerada a melhor (mais forte), enquanto a correspondência mais fraca (pior) é uma correspondência wildcard em todas as três colunas. Apenas a força da correspondência é considerada ao escolher qual regra aplicar; a ordem em que as rows ocorrem na tabela não tem efeito nesta determinação.

**Registro (Logging) de Rows Completas ou Parciais.**

Existem dois métodos básicos para registrar (log) rows, conforme determinado pela configuração da opção [`--ndb-log-updated-only`] para [**mysqld**]:

* Registrar (Log) rows completas (opção definida como `ON`)
* Registrar (Log) apenas os dados de coluna que foram updated — isto é, dados de coluna cujo valor foi definido, independentemente de este valor ter sido realmente alterado ou não. Este é o comportamento default (opção definida como `OFF`).

Geralmente é suficiente — e mais eficiente — registrar apenas as colunas updated; no entanto, se você precisar registrar rows completas, você pode fazê-lo definindo [`--ndb-log-updated-only`] para `0` ou `OFF`.

**Registro (Logging) de Dados Alterados como Updates.**

A configuração da opção [`--ndb-log-update-as-write`] do MySQL Server determina se o logging é realizado com ou sem a imagem “before”.

Como a conflict resolution para updates e delete operations é feita no update handler do MySQL Server, é necessário controlar o logging realizado pelo replication source de modo que os updates sejam updates e não writes; ou seja, para que os updates sejam tratados como changes em rows existentes em vez de escrita de novas rows, mesmo que estas substituam rows existentes.

Esta opção está ativada por default; em outras palavras, os updates são tratados como writes. Ou seja, os updates são, por default, escritos como events `write_row` no binary log, em vez de como events `update_row`.

Para desabilitar a opção, inicie o [**mysqld**] source com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`. Você deve fazer isso ao replicar de tabelas NDB para tabelas que usam uma Storage Engine diferente; consulte [Replication de NDB para outras storage engines] e [Replication de NDB para uma storage engine não transacional], para mais informações.
