### 25.7.4 Esquema e tabelas de replicação de NDB Cluster

* Tabela ndb_apply_status
* Tabela ndb_binlog_index
* Tabela ndb_replication

A replicação no NDB Cluster utiliza várias tabelas dedicadas no banco de dados `mysql` em cada instância do Servidor MySQL, atuando como um nó SQL tanto no cluster sendo replicado quanto na replica. Isso é verdade, independentemente de a replica ser um único servidor ou um cluster.

As tabelas `ndb_binlog_index` e `ndb_apply_status` são criadas no banco de dados `mysql`. Elas não devem ser replicadas explicitamente pelo usuário. A intervenção do usuário normalmente não é necessária para criar ou manter nenhuma dessas tabelas, uma vez que ambas são mantidas pelo fio de injeção de log binário `NDB` (binlog). Isso mantém o processo **mysqld** da fonte atualizado com as alterações realizadas pelo motor de armazenamento `NDB`. O fio de injeção de log binário `NDB` recebe eventos diretamente do motor de armazenamento `NDB`. O injetor `NDB` é responsável por capturar todos os eventos de dados dentro do cluster e garante que todos os eventos que alteram, inserem ou excluem dados sejam registrados na tabela `ndb_binlog_index`. O fio de I/O (receptor) da replica transfere os eventos do log binário da fonte para o log de retransmissão da replica.

A tabela `ndb_replication` deve ser criada manualmente. Esse table pode ser atualizado pelo usuário para realizar filtragem por banco de dados ou tabela. Consulte Tabela ndb_replication, para mais informações. `ndb_replication` também é usado na detecção e resolução de conflitos de replicação NDB para controle de resolução de conflitos; consulte Controle de Resolução de Conflitos.

Embora `ndb_binlog_index` e `ndb_apply_status` sejam criados e mantidos automaticamente, é aconselhável verificar a existência e a integridade dessas tabelas como um passo inicial na preparação de um NDB Cluster para replicação. É possível visualizar os dados de evento registrados no log binário consultando a tabela `mysql.ndb_binlog_index` diretamente no nó SQL da fonte. Isso também pode ser feito usando a instrução `SHOW BINLOG EVENTS` no nó SQL da fonte ou da replica. (Veja a Seção 15.7.7.3, “Instrução SHOW BINLOG EVENTS”.)

Você também pode obter informações úteis a partir da saída da instrução `SHOW ENGINE NDB STATUS`.

Nota

Ao realizar alterações no esquema das tabelas `NDB`, as aplicações devem esperar até que a instrução `ALTER TABLE` tenha retornado na conexão do cliente MySQL que emitiu a instrução antes de tentar usar a definição atualizada da tabela.

#### Tabela ndb\_apply\_status

`ndb_apply_status` é usado para manter um registro das operações que foram replicadas da fonte para a replica. Se a tabela `ndb_apply_status` não existir na replica, o **ndb\_restore** a recria.

Ao contrário do caso de `ndb_binlog_index`, os dados nesta tabela não são específicos de nenhum nó SQL no (replica) cluster, e assim `ndb_apply_status` pode usar o mecanismo de armazenamento `NDBCLUSTER`, como mostrado aqui:

```
CREATE TABLE `ndb_apply_status` (
    `server_id`   INT(10) UNSIGNED NOT NULL,
    `epoch`       BIGINT(20) UNSIGNED NOT NULL,
    `log_name`    VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
    `start_pos`   BIGINT(20) UNSIGNED NOT NULL,
    `end_pos`     BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (`server_id`) USING HASH
) ENGINE=NDBCLUSTER DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

A tabela `ndb_apply_status` é preenchida apenas em replicas, o que significa que, na fonte, essa tabela nunca contém nenhuma linha; portanto, não há necessidade de alocar qualquer `DataMemory` para `ndb_apply_status` lá.

Como essa tabela é preenchida com dados originados na fonte, ela deve ser permitida para se replicar; quaisquer regras de filtragem do log binário ou de filtragem do log de transações que impeçam inadvertidamente a replica de atualizar `ndb_apply_status` ou que impeçam a fonte de escrever no log binário podem impedir que a replicação entre clusters funcione corretamente. Para obter mais informações sobre problemas potenciais decorrentes dessas regras de filtragem, consulte Replicação e regras de filtragem do log binário com replicação entre NDB Clusters.

É possível excluir essa tabela, mas isso não é recomendado. Excluir a tabela coloca todos os nós SQL em modo de leitura somente; o `NDB` detecta que essa tabela foi excluída e a recria, após o que é possível realizar atualizações novamente. A exclusão e a recriação de `ndb_apply_status` cria um evento de lacuna no log binário; o evento de lacuna faz com que os nós SQL da replica parem de aplicar alterações da fonte até que o canal de replicação seja reiniciado.

`0` na coluna `epoch` dessa tabela indica uma transação originada de um motor de armazenamento diferente do `NDB`.

`ndb_apply_status` é usado para registrar quais transações de epoch foram replicadas e aplicadas a um cluster de replica de uma fonte upstream. Essa informação é capturada em um backup online do `NDB`, mas (por design) não é restaurada pelo **ndb\_restore**. Em alguns casos, pode ser útil restaurar essa informação para uso em novas configurações; você pode fazer isso invocando **ndb\_restore** com a opção `--with-apply-status`. Consulte a descrição da opção para obter mais informações.

#### Tabela ndb\_binlog\_index

A replicação em clúster do NDB utiliza a tabela `ndb_binlog_index` para armazenar os dados de indexação do log binário. Como essa tabela é local para cada servidor MySQL e não participa do clúster, ela utiliza o mecanismo de armazenamento `InnoDB`. Isso significa que ela deve ser criada separadamente em cada **mysqld** que participa do clúster de origem. (O próprio log binário contém as atualizações de todos os servidores MySQL no clúster.) Essa tabela é definida da seguinte forma:

```
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

Observação

Se você estiver atualizando de uma versão mais antiga, execute o procedimento de atualização do MySQL e garanta que as tabelas do sistema sejam atualizadas iniciando o servidor MySQL com a opção `--upgrade=FORCE`. A atualização da tabela do sistema faz com que uma instrução `ALTER TABLE ... ENGINE=INNODB` seja executada para essa tabela. O uso do mecanismo de armazenamento `MyISAM` para essa tabela continua sendo suportado para compatibilidade reversa.

O `ndb_binlog_index` pode exigir espaço em disco adicional após ser convertido para `InnoDB`. Se isso se tornar um problema, você pode ser capaz de conservar espaço usando um espaço de tabelas `InnoDB` para essa tabela, alterando sua `ROW_FORMAT` para `COMPRESSED`, ou ambos. Para mais informações, consulte a Seção 15.1.25, “Instrução CREATE TABLESPACE”, e a Seção 15.1.24, “Instrução CREATE TABLE”, além da Seção 17.6.3, “Espaços de Tabelas”.

O tamanho da tabela `ndb_binlog_index` depende do número de épocas por arquivo de log binário e do número de arquivos de log binário. O número de épocas por arquivo de log binário normalmente depende da quantidade de log binário gerado por época e do tamanho do arquivo de log binário, com épocas menores resultando em mais épocas por arquivo. Você deve estar ciente de que épocas vazias produzem inserções na tabela `ndb_binlog_index`, mesmo quando a opção `--ndb-log-empty-epochs` é `OFF`, o que significa que o número de entradas por arquivo depende do tempo em que o arquivo está em uso; essa relação pode ser representada pela fórmula mostrada aqui:

```
[number of epochs per file] = [time spent per file] / TimeBetweenEpochs
```

Um NDB Cluster ocupado escreve no log binário regularmente e, presumivelmente, roda arquivos de log binário mais rapidamente do que um tranquilo. Isso significa que um NDB Cluster "tranquilo" com `--ndb-log-empty-epochs=ON` pode ter, na verdade, um número muito maior de linhas `ndb_binlog_index` por arquivo do que um com muita atividade.

Quando o **mysqld** é iniciado com a opção `--ndb-log-orig`, as colunas `orig_server_id` e `orig_epoch` armazenam, respectivamente, o ID do servidor em que o evento se originou e o período em que o evento ocorreu no servidor de origem, o que é útil em configurações de replicação do NDB Cluster que utilizam múltiplas fontes. A instrução `SELECT` usada para encontrar a posição do log binário mais próxima do período aplicado mais alto na replica em uma configuração de múltiplas fontes (veja a Seção 25.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”) emprega essas duas colunas, que não são indexadas. Isso pode levar a problemas de desempenho ao tentar a falha de sobrevivência, pois a consulta deve realizar uma varredura da tabela, especialmente quando a fonte tem estado em execução com `--ndb-log-empty-epochs=ON`. Você pode melhorar os tempos de falha de sobrevivência em múltiplas fontes adicionando um índice a essas colunas, como mostrado aqui:

```
ALTER TABLE mysql.ndb_binlog_index
    ADD INDEX orig_lookup USING BTREE (orig_server_id, orig_epoch);
```

Adicionar este índice não oferece nenhum benefício ao replicar de uma única fonte para uma única replica, uma vez que a consulta usada para obter a posição do log binário nesses casos não faz uso de `orig_server_id` ou `orig_epoch`.

Veja a Seção 25.7.8, “Implementando Falha de Sobrevivência com Replicação do NDB Cluster”, para mais informações sobre o uso das colunas `next_position` e `next_file`.

A figura a seguir mostra a relação do servidor de origem da replicação do NDB Cluster, seu fio de injetor de log binário e a tabela `mysql.ndb_binlog_index`.

**Figura 25.13 O Cluster de Origem da Replicação**

![A maioria dos conceitos é descrita no texto ao redor. Esta imagem complexa tem três áreas principais. A área superior esquerda é dividida em três seções: MySQL Server (mysqld), manipulador de tabela NDBCLUSTER e mutex. Um fio de conexão conecta esses elementos, e os fios de receptor e injetor conectam o manipulador de tabela NDBCLUSTER e o mutex. A área inferior mostra quatro nós de dados (ndbd). Todos eles produzem eventos representados por setas apontando para o fio de receptor, e o fio de receptor também aponta para os fios de conexão e injetor. Um nó envia e recebe para a área do mutex. A seta representando o fio de injetor aponta para um log binário, bem como para a tabela ndb_binlog_index, que é descrita no texto ao redor.](images/cluster-replication-binlog-injector.png)

#### Tabela ndb\_replication

A tabela `ndb_replication` é usada para controlar o registro binário e a resolução de conflitos, e atua em uma base por tabela. Cada linha desta tabela corresponde a uma tabela sendo replicada, determina como registrar as alterações na tabela e, se uma função de resolução de conflitos for especificada, e determina como resolver conflitos para essa tabela.

Ao contrário das tabelas `ndb_apply_status` e `ndb_replication`, a tabela `ndb_replication` deve ser criada manualmente, usando a instrução SQL mostrada aqui:

```
CREATE TABLE mysql.ndb_replication  (
    db VARBINARY(63),
    table_name VARBINARY(63),
    server_id INT UNSIGNED,
    binlog_type INT UNSIGNED,
    binlog_row_slice_count UNSIGNED,
    binlog_row_slice_id UNSIGNED,
    conflict_fn VARBINARY(128),
    PRIMARY KEY USING HASH (db, table_name, server_id)
)   ENGINE=NDB
PARTITION BY KEY(db,table_name);
```

As colunas desta tabela são listadas aqui, com descrições:

* Coluna `db`

  O nome do banco de dados que contém a tabela a ser replicada.

  Você pode usar qualquer um ou ambos os caracteres `_` e `%` como parte do nome do banco de dados. (Veja Correspondência com caracteres curinga, mais adiante nesta seção.)

* Coluna `table_name`

  O nome da tabela a ser replicada.

  O nome da tabela pode incluir qualquer um ou ambos os caracteres `_` e `%`. Veja Correspondência com caracteres curinga, mais adiante nesta seção.

* coluna `server_id`

  O ID único do servidor da instância do MySQL (nó SQL) onde a tabela reside.

  `0` nesta coluna funciona como um equivalente de ponto de interrogação (`%`), e corresponde a qualquer ID de servidor. (Veja Correspondência com pontos de interrogação, mais adiante nesta seção.)

* coluna `binlog_type`

  O tipo de registro binário a ser empregado. Veja o texto para valores e descrições.

* coluna `binlog_row_slice_count`

  O número de fatias em que o log binário será dividido. `1` se a fatiamento não estiver sendo usado para esta tabela; `0` é ignorado e, portanto, é o mesmo que `1`.

* coluna `binlog_row_slice_id`

  O ID da fatia para este servidor para registrar. `0` se o fatiamento não estiver sendo usado para esta tabela.

* coluna `conflict_fn`

  A função de resolução de conflitos a ser aplicada; uma das funções NDB$OLD()"), NDB$MAX()"), NDB$MAX\_DELETE\_WIN()"), NDB$EPOCH()"), NDB$EPOCH\_TRANS()"), NDB$EPOCH2()"), NDB$EPOCH2\_TRANS()") NDB$MAX\_INS()"), ou NDB$MAX\_DEL\_WIN\_INS()"); `NULL` indica que a resolução de conflitos não está sendo usada para esta tabela.

  Veja Funções de Resolução de Conflitos, para mais informações sobre essas funções e seus usos na resolução de conflitos da replicação NDB.

  Algumas funções de resolução de conflitos (`NDB$OLD()`, `NDB$EPOCH()`, `NDB$EPOCH_TRANS()`) requerem o uso de uma ou mais tabelas de exceções criadas pelo usuário. Veja Tabela de Exceções de Resolução de Conflitos.

Para habilitar a resolução de conflitos com a replicação do NDB, é necessário criar e preencher esta tabela com informações de controle no(s) nó(s) SQL em que o conflito deve ser resolvido. Dependendo do tipo e método de resolução de conflitos a serem empregados, isso pode ser a fonte, a replica ou ambos os servidores. Em uma configuração simples de fonte-replica, onde os dados também podem ser alterados localmente na replica, isso geralmente é a replica. Em um esquema de replicação mais complexo, como a replicação bidirecional, isso geralmente são todas as fontes envolvidas. Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.

A tabela `ndb_replication` permite controle a nível de tabela sobre o registro binário fora do escopo da resolução de conflitos, nesse caso, `conflict_fn` é especificado como `NULL`, enquanto os valores das colunas restantes são usados para controlar o registro binário para uma determinada tabela ou conjunto de tabelas que correspondem a uma expressão de wildcard. Ao definir o valor apropriado para a coluna `binlog_type`, você pode fazer com que o registro para uma determinada tabela ou tabelas use um formato de log binário desejado, ou desabilitar o registro binário completamente. Os valores possíveis para esta coluna, com valores e descrições, são mostrados na tabela a seguir:

**Tabela 25.42 valores de `binlog\_type`, com valores e descrições**

<table><col width="10%"/><col width="55%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Usar o valor padrão do servidor</td> </tr><tr> <td>1</td> <td>Não registrar esta tabela no log binário (mesmo efeito que <a class="link" href="replication-options-binary-log.html#sysvar_sql_log_bin"><code>sql_log_bin = 0</code></a>, mas aplica-se a uma ou mais tabelas especificadas)</td> </tr><tr> <td>2</td> <td>Registrar apenas os atributos atualizados; registrar esses como eventos <code>WRITE_ROW</code></td> </tr><tr> <td>3</td> <td>Registrar a linha completa, mesmo que não seja atualizada (comportamento padrão do servidor MySQL)</td> </tr><tr> <td>6</td> <td>Usar atributos atualizados, mesmo que os valores não tenham sido alterados</td> </tr><tr> <td>7</td> <td>Registrar a linha completa, mesmo que não haja alterações nos valores; registrar as atualizações como eventos <code>UPDATE_ROW</code></td> </tr><tr> <td>8</td> <td>Registrar a atualização como <code>UPDATE_ROW</code>; registrar apenas as colunas da chave primária na imagem anterior e apenas as colunas atualizadas na imagem posterior (mesmo efeito que <a class="link" href="mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal"><code>--ndb-log-update-minimal</code></a>, mas aplica-se a uma ou mais tabelas especificadas)</td> </tr><tr> <td>9</td> <td>Registrar a atualização como <code>UPDATE_ROW</code>; registrar apenas as colunas da chave primária na imagem anterior e todas as colunas, exceto as colunas da chave primária, na imagem posterior</td> </tr></tbody></table>

Observação

Os valores `binlog_type` 4 e 5 não são usados, portanto, são omitidos da tabela mostrada e da tabela a seguir.

Vários valores de `binlog_type` são equivalentes a várias combinações das opções de registro do **mysqld** `--ndb-log-updated-only`, `--ndb-log-update-as-write` e `--ndb-log-update-minimal`, conforme mostrado na tabela a seguir:

**Tabela 25.43 valores de binlog\_type com combinações equivalentes de opções de registro NDB**

<table><col width="10%"/><col width="30%"/><col width="30%"/><col width="30%"/><thead><tr> <th>Valor</th> <th><code>--ndb-log-updated-only</code> Valor</th> <th><code>--ndb-log-update-as-write</code> Valor</th> <th><code>--ndb-log-update-minimal</code> Valor</th> </tr></thead><tbody><tr> <th>0</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th>1</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th>2</th> <td>ON</td> <td>ON</td> <td>OFF</td> </tr><tr> <th>3</th> <td>OFF</td> <td>ON</td> <td>OFF</td> </tr><tr> <th>6</th> <td>ON</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th>7</th> <td>OFF</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th>8</th> <td>ON</td> <td>OFF</td> <td>ON</td> </tr><tr> <th>9</th> <td>OFF</td> <td>OFF</td> <td>ON</td> </tr></tbody></table>

O registro binário pode ser configurado para diferentes formatos para diferentes tabelas inserindo linhas na tabela `ndb_replication` usando os valores apropriados das colunas `db`, `table_name` e `binlog_type`. O valor inteiro interno mostrado na tabela anterior deve ser usado ao configurar o formato de registro binário. As seguintes duas instruções configuram o registro binário para o registro de linhas completas (valor 3) para a tabela `test.a` e para o registro de atualizações apenas (valor 2) para a tabela `test.b`:

```
# Table test.a: Log full rows
INSERT INTO mysql.ndb_replication VALUES("test", "a", 0, 3, 1, 0, NULL);

# Table test.b: log updates only
INSERT INTO mysql.ndb_replication VALUES("test", "b", 0, 2, 1, 0, NULL);
```

Para desabilitar o registro de logs para uma ou mais tabelas, use 1 para `binlog_type`, conforme mostrado aqui:

```
# Disable binary logging for table test.t1
INSERT INTO mysql.ndb_replication VALUES("test", "t1", 0, 1, 1, 0, NULL);

# Disable binary logging for any table in 'test' whose name begins with 't'
INSERT INTO mysql.ndb_replication VALUES("test", "t%", 0, 1, 1, 0, NULL);
```

Desabilitar o registro de logs para uma tabela específica é o equivalente a definir `sql_log_bin = 0`, exceto que isso se aplica a uma ou mais tabelas individualmente. Se um nó SQL não estiver realizando o registro binário para uma tabela específica, ele não receberá os eventos de alteração de linha para essas tabelas. Isso significa que ele não está recebendo todas as alterações e descartando algumas, mas sim não está se subscritindo a essas alterações.

Desabilitar o registro de logs pode ser útil por várias razões, incluindo as listadas aqui:

* Não enviar alterações pela rede geralmente economiza largura de banda, buffer e recursos de CPU.

* Não registrar alterações em tabelas com atualizações muito frequentes, mas cujo valor não é grande, é adequado para dados transitórios (como dados de sessão) que podem ser relativamente irrelevantes em caso de falha completa do clúster.

* Usando uma variável de sessão (ou `sql_log_bin`) e código de aplicativo, também é possível (ou não) registrar certas instruções SQL ou tipos de instruções SQL; por exemplo, pode ser desejável, em alguns casos, não registrar instruções DDL em uma ou mais tabelas.

* Dividir os fluxos de replicação em dois (ou mais) logs binários pode ser feito por razões de desempenho, necessidade de replicar diferentes bancos de dados para diferentes locais, uso de diferentes tipos de registro binário para diferentes bancos de dados, e assim por diante.

**Cortar o log binário por tabela.** Você pode distribuir o registro de uma tabela específica entre vários servidores MySQL inserindo valores apropriados para as colunas `binlog_row_slice_count` e `binlog_row_slice_id`. `binlog_row_slice_count` é o número de fatias do log binário e deve ser o mesmo para todos os servidores MySQL desse grupo; `binlog_row_slice_id` determina qual fatia é escrita no log binário de um servidor específico.

Por exemplo, ao inserir essas linhas na tabela, o **mysqld** com o ID de fatia `0` registra metade das alterações de linha da tabela `t1`, enquanto outro **mysqld** (cujo ID de fatia é `1`) registra a outra metade:

```
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t1", 1, 2, 2, 0, NULL);
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t1", 2, 2, 2, 1, NULL);
```

Em ambas as declarações, `2` é inserido na coluna `binlog_row_slice_count`. Da mesma forma, o registro binário para `t2` pode ser dividido em quatro fatias inserindo quatro linhas na tabela `ndb_replication`, cada linha usando `4` na coluna `binlog_row_slice_count` e IDs em sequência na coluna `binlog_row_slice_id`, assim:

```
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t2", 1, 2, 4, 0, NULL);
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t2", 2, 2, 4, 1, NULL);
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t2", 3, 2, 4, 2, NULL);
mysql> INSERT INTO mysql.ndb_replication VALUES ("test", "t2", 4, 2, 4, 3, NULL);
```

Também é possível configurar o registro redundante por fatia inserindo linhas duplicadas na tabela `ndb_replication`. Por exemplo, a seguinte declaração `INSERT` gera dois grupos de três servidores cada, cada um dividindo o registro binário para a tabela `t3` em três fatias:

```
mysql> INSERT INTO mysql.ndb_replication
    ->   VALUES
    ->     ("test", "t3", 1, 2, 3, 0, NULL),
    ->     ("test", "t3", 2, 2, 3, 1, NULL),
    ->     ("test", "t3", 3, 2, 3, 2, NULL),
    ->     ("test", "t3", 4, 2, 3, 0, NULL),
    ->     ("test", "t3", 5, 2, 3, 1, NULL),
    ->     ("test", "t3", 6, 2, 3, 2, NULL);
```

Você também pode realizar essa tarefa de forma mais geral (para todas as tabelas `NDBCLUSTER` em um MySQL Cluster específico de uma vez) iniciando os servidores com as opções `--ndb-log-row-slice-count` e `--ndb-log-row-slice-id`. Consulte as descrições dessas opções para obter mais informações.

**Correspondência com caracteres curingas.** Para não ser necessário inserir uma linha na tabela `ndb_replication` para cada combinação de banco de dados, tabela e nó SQL na configuração de replicação, o `NDB` suporta a correspondência com caracteres curingas nas colunas `db`, `table_name` e `server_id` dessa tabela. Os nomes de banco de dados e de tabela usados, respectivamente, em `db` e `table_name`, podem conter um ou ambos os seguintes caracteres curingas:

* `_` (caractere sublinhado): corresponde a zero ou mais caracteres

* `%` (símbolo por cento): corresponde a um único caractere

(Estes são os mesmos caracteres curingas suportados pelo operador `LIKE` do MySQL.)

A coluna `server_id` suporta `0` como um equivalente de curinga para `_` (corresponde a qualquer coisa). Isso é usado nos exemplos mostrados anteriormente.

Uma linha dada na tabela `ndb_replication` pode usar caracteres curingas para corresponder a qualquer um dos nomes de banco de dados, nomes de tabela e IDs de servidor em qualquer combinação. Quando houver várias combinações potenciais na tabela, a melhor combinação é escolhida, de acordo com a tabela mostrada aqui, onde *W* representa uma correspondência com curinga, *E* uma correspondência exata, e quanto maior o valor na coluna *Quality*, melhor a correspondência:

**Tabela 25.44 Pesos de diferentes combinações de correspondências com curingas e exatas nas colunas da tabela mysql.ndb\_replication**

<table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th><code>db</code></th> <th><code>nome_tabela</code></th> <th><code>id_servidor</code></th> <th>Qualidade</th> </tr></thead><tbody><tr> <th>W</th> <td>W</td> <td>W</td> <td>1</td> </tr><tr> <th>W</th> <td>W</td> <td>E</td> <td>2</td> </tr><tr> <th>W</th> <td>E</td> <td>W</td> <td>3</td> </tr><tr> <th>W</th> <td>E</td> <td>E</td> <td>4</td> </tr><tr> <th>E</th> <td>W</td> <td>W</td> <td>5</td> </tr><tr> <th>E</th> <td>W</td> <td>E</td> <td>6</td> </tr><tr> <th>E</th> <td>E</td> <td>W</td> <td>7</td> </tr><tr> <th>E</th> <td>E</td> <td>E</td> <td>8</td> </tr></tbody></table>

Portanto, uma correspondência exata no nome da base de dados, no nome da tabela e no ID do servidor é considerada a melhor (mais forte), enquanto a correspondência mais fraca (pior) é uma correspondência com asterisco em todas as três colunas. Apenas a força da correspondência é considerada ao escolher qual regra aplicar; a ordem em que as linhas ocorrem na tabela não tem efeito nessa determinação.

**Registro de Linhas Completas ou Parciais.**

Existem dois métodos básicos de registro de linhas, conforme determinado pela configuração da opção `--ndb-log-updated-only` para o **mysqld**:

* Registrar linhas completas (opção definida como `ON`)
* Registrar apenas os dados das colunas que foram atualizados—ou seja, os dados das colunas cujo valor foi definido, independentemente de esse valor ter sido realmente alterado ou não. Esse é o comportamento padrão (opção definida como `OFF`).

Geralmente, é suficiente — e mais eficiente — registrar apenas as colunas atualizadas; no entanto, se você precisar registrar linhas inteiras, pode fazê-lo configurando `--ndb-log-updated-only` para `0` ou `OFF`.

**Registro de Dados Alterados como Atualizações.**

A configuração da opção `--ndb-log-update-as-write` do MySQL Server determina se o registro é realizado com ou sem a imagem "antes".

Como a resolução de conflitos para operações de atualização e exclusão é realizada no manipulador de atualização do MySQL Server, é necessário controlar o registro realizado pela fonte de replicação para que as atualizações sejam tratadas como atualizações e não como escritas; ou seja, para que as atualizações sejam tratadas como alterações em linhas existentes, em vez da escrita de novas linhas, mesmo que estas substituam linhas existentes.

Esta opção está ativada por padrão; em outras palavras, as atualizações são tratadas como escritas. Ou seja, as atualizações são, por padrão, escritas como eventos `write_row` no log binário, em vez de como eventos `update_row`.

Para desativar a opção, inicie a fonte **mysqld** com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`. Você deve fazer isso ao replicar de tabelas NDB para tabelas usando um motor de armazenamento diferente; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional para obter mais informações.

Importante

Para inserir a resolução de conflitos usando `NDB$MAX_INS()` ou `NDB$MAX_DEL_WIN_INS()`, um nó SQL (ou seja, um processo **mysqld**) pode registrar atualizações de linhas no cluster de origem como eventos `WRITE_ROW` com a opção `--ndb-log-update-as-write` habilitada para impotencialidade e tamanho ótimo. Isso funciona para esses algoritmos, pois ambos mapeiam um evento `WRITE_ROW` para uma inserção ou atualização, dependendo se a linha já existe, e os metadados necessários (a imagem "after" para a coluna de timestamp) estão presentes no evento `WRITE\_ROW`.