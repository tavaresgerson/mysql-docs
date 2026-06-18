### 25.7.4 Esquema e tabelas de replicação de cluster do NDB

- tabela ndb\_apply\_status
- tabela ndb\_binlog\_index
- tabela ndb\_replication

A replicação no NDB Cluster utiliza várias tabelas dedicadas no banco de dados `mysql` em cada instância do servidor MySQL que atua como um nó SQL tanto no cluster que está sendo replicado quanto na replica. Isso é verdade, independentemente de a replica ser um único servidor ou um cluster.

As tabelas `ndb_binlog_index` e `ndb_apply_status` são criadas no banco de dados `mysql`. Elas não devem ser replicadas explicitamente pelo usuário. A intervenção do usuário normalmente não é necessária para criar ou manter nenhuma dessas tabelas, uma vez que ambas são mantidas pelo fio de injeção de log binário `NDB` (binlog). Isso mantém o processo **mysqld** fonte atualizado com as alterações realizadas pelo motor de armazenamento `NDB`. O fio de injeção de log binário `NDB` recebe eventos diretamente do motor de armazenamento `NDB`. O injeção `NDB` é responsável por capturar todos os eventos de dados dentro do clúster e garante que todos os eventos que alteram, inserem ou excluem dados sejam registrados na tabela `ndb_binlog_index`. O fio de I/O (receptor) de replica transfere os eventos do log binário da fonte para o log de retransmissão da replica.

A tabela `ndb_replication` deve ser criada manualmente. Essa tabela pode ser atualizada pelo usuário para realizar filtragem por banco de dados ou tabela. Consulte a tabela ndb\_replication para obter mais informações. `ndb_replication` também é usado na detecção e resolução de conflitos da replicação NDB para controle de resolução de conflitos; consulte Controle de Resolução de Conflitos.

Embora `ndb_binlog_index` e `ndb_apply_status` sejam criados e mantidos automaticamente, é recomendável verificar a existência e a integridade dessas tabelas como um passo inicial para preparar um NDB Cluster para replicação. É possível visualizar os dados de eventos registrados no log binário consultando a tabela `mysql.ndb_binlog_index` diretamente na fonte. Isso também pode ser feito usando a instrução `SHOW BINLOG EVENTS` no nó SQL da fonte ou da replica. (Veja a Seção 15.7.7.2, “Instrução SHOW BINLOG EVENTS”.)

Você também pode obter informações úteis a partir da saída do `SHOW ENGINE NDB STATUS`.

Nota

Ao realizar alterações no esquema das tabelas `NDB`, as aplicações devem esperar até que a instrução `ALTER TABLE` tenha sido retornada na conexão do cliente MySQL que emitiu a instrução antes de tentar usar a definição atualizada da tabela.

#### tabela ndb\_apply\_status

O `ndb_apply_status` é usado para manter um registro das operações que foram replicadas da fonte para a réplica. Se a tabela `ndb_apply_status` não existir na réplica, o **ndb\_restore** a recria.

Ao contrário do caso do `ndb_binlog_index`, os dados nesta tabela não são específicos de nenhum nó SQL do clúster (replica), e, portanto, o `ndb_apply_status` pode usar o mecanismo de armazenamento `NDBCLUSTER`, como mostrado aqui:

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

A tabela `ndb_apply_status` é preenchida apenas em réplicas, o que significa que, na fonte, essa tabela nunca contém nenhuma linha; portanto, não há necessidade de alocar nenhum `DataMemory` para `ndb_apply_status` lá.

Como esta tabela é preenchida com dados originários da fonte, deve ser permitido que ela seja replicada; quaisquer regras de filtragem de replicação ou de filtragem de log binário que impeçam inadvertidamente a replicação de atualizar `ndb_apply_status` ou que impeçam a fonte de escrever no log binário podem impedir que a replicação entre os clusters funcione corretamente. Para obter mais informações sobre os problemas potenciais decorrentes dessas regras de filtragem, consulte Replicação e regras de filtragem de log binário com replicação entre NDB Clusters.

É possível excluir essa tabela, mas isso não é recomendado. Ao excluí-la, todos os nós SQL passam para o modo de leitura somente; no NDB 8.0.24 e versões posteriores, o `NDB` detecta que a tabela foi excluída e a recria, após o que é possível realizar atualizações novamente. A exclusão e a recriação do `ndb_apply_status` criam um evento de lacuna no log binário; o evento de lacuna faz com que os nós SQL replicados parem de aplicar alterações da fonte até que o canal de replicação seja reiniciado. Antes do NDB 8.0.24, era necessário, nesses casos, reiniciar todos os nós SQL para tirá-los do modo de leitura somente e, em seguida, recriar manualmente o `ndb_apply_status`.

O `0` na coluna `epoch` desta tabela indica uma transação proveniente de um mecanismo de armazenamento diferente de `NDB`.

`ndb_apply_status` é usado para registrar quais transações de uma época foram replicadas e aplicadas a um cluster replica de uma fonte upstream. Essa informação é capturada em um backup online `NDB`, mas (por design) não é restaurada pelo **ndb\_restore**. Em alguns casos, pode ser útil restaurar essa informação para uso em novas configurações; a partir do NDB 8.0.29, você pode fazer isso invocando o **ndb\_restore** com a opção `--with-apply-status`. Veja a descrição da opção para mais informações.

#### tabela ndb\_binlog\_index

A replicação em cluster do NDB utiliza a tabela `ndb_binlog_index` para armazenar os dados de indexação do log binário. Como essa tabela é local a cada servidor MySQL e não participa do clustering, ela utiliza o mecanismo de armazenamento `InnoDB`. Isso significa que ela deve ser criada separadamente em cada **mysqld** que participa do cluster de origem. (O próprio log binário contém as atualizações de todos os servidores MySQL no cluster.) Essa tabela é definida da seguinte forma:

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

Nota

Se você estiver atualizando de uma versão mais antiga (antes da NDB 7.5.2), execute o procedimento de atualização do MySQL e garanta que as tabelas do sistema sejam atualizadas, iniciando o servidor MySQL com a opção `--upgrade=FORCE`. A atualização da tabela do sistema faz com que uma instrução `ALTER TABLE ... ENGINE=INNODB` seja executada para essa tabela. O uso do mecanismo de armazenamento `MyISAM` para essa tabela continua sendo suportado para compatibilidade reversa.

`ndb_binlog_index` pode exigir espaço em disco adicional após a conversão para `InnoDB`. Se isso se tornar um problema, você poderá economizar espaço usando um espaço de tabelas `InnoDB` para essa tabela, alterando seu `ROW_FORMAT` para `COMPRESSED`, ou ambos. Para mais informações, consulte a Seção 15.1.21, “Instrução CREATE TABLESPACE”, e a Seção 15.1.20, “Instrução CREATE TABLE”, além da Seção 17.6.3, “Tabelaspaces”.

O tamanho da tabela `ndb_binlog_index` depende do número de épocas por arquivo de log binário e do número de arquivos de log binário. O número de épocas por arquivo de log binário normalmente depende da quantidade de log binário gerado por época e do tamanho do arquivo de log binário, com épocas menores resultando em mais épocas por arquivo. Você deve estar ciente de que épocas vazias produzem inserções na tabela `ndb_binlog_index`, mesmo quando a opção `--ndb-log-empty-epochs` é `OFF`, o que significa que o número de entradas por arquivo depende do tempo em que o arquivo está em uso; essa relação pode ser representada pela fórmula mostrada aqui:

```
[number of epochs per file] = [time spent per file] / TimeBetweenEpochs
```

Um NDB Cluster ocupado escreve no log binário regularmente e, presumivelmente, roda os arquivos de log binário mais rapidamente do que um tranquilo. Isso significa que um NDB Cluster "tranquilo" com `--ndb-log-empty-epochs=ON` pode, na verdade, ter um número muito maior de linhas `ndb_binlog_index` por arquivo do que um com muita atividade.

Quando o **mysqld** é iniciado com a opção `--ndb-log-orig`, as colunas `orig_server_id` e `orig_epoch` armazenam, respectivamente, o ID do servidor em que o evento se originou e o período em que o evento ocorreu no servidor de origem, o que é útil em configurações de replicação do NDB Cluster que empregam múltiplas fontes. A instrução `SELECT` usada para encontrar a posição do log binário mais próxima da epoch mais aplicada na replica em uma configuração de múltiplas fontes (veja a Seção 25.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”) emprega essas duas colunas, que não são indexadas. Isso pode levar a problemas de desempenho ao tentar uma falha de transição, pois a consulta deve realizar uma varredura da tabela, especialmente quando a fonte tem sido executada com `--ndb-log-empty-epochs=ON`. Você pode melhorar os tempos de falha de transição de múltiplas fontes adicionando um índice a essas colunas, como mostrado aqui:

```
ALTER TABLE mysql.ndb_binlog_index
    ADD INDEX orig_lookup USING BTREE (orig_server_id, orig_epoch);
```

A adição deste índice não oferece nenhum benefício ao replicar de uma única fonte para uma única réplica, uma vez que a consulta usada para obter a posição do log binário nesses casos não utiliza `orig_server_id` ou `orig_epoch`.

Consulte a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”, para obter mais informações sobre o uso das colunas `next_position` e `next_file`.

A figura a seguir mostra a relação entre o servidor de origem da replicação do NDB Cluster, o thread do injetor de log binário e a tabela `mysql.ndb_binlog_index`.

**Figura 25.14: O clúster de origem de replicação**

![Most concepts are described in the surrounding text. This complex image has three main areas. The top left area is divided into three sections: MySQL Server (mysqld), NDBCLUSTER table handler, and mutex. A connection thread connects these, and receiver and injector threads connect the NDBCLUSTER table handler and mutex. The bottom area shows four data nodes (ndbd). They all produce events represented by arrows pointing to the receiver thread, and the receiver thread also points to the connection and injector threads. One node sends and receives to the mutex area. The arrow representing the injector thread points to a binary log as well as the ndb\_binlog\_index table, which is described in the surrounding text.](images/cluster-replication-binlog-injector.png)

#### tabela ndb\_replication

A tabela `ndb_replication` é usada para controlar o registro binário e a resolução de conflitos e atua em nível de tabela. Cada linha desta tabela corresponde a uma tabela sendo replicada, determina como registrar as alterações na tabela e, se uma função de resolução de conflitos for especificada, e determina como resolver conflitos para essa tabela.

Ao contrário das tabelas `ndb_apply_status` e `ndb_replication`, a tabela `ndb_replication` deve ser criada manualmente, usando a instrução SQL mostrada aqui:

```
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

- coluna `db`

  O nome do banco de dados que contém a tabela a ser replicada.

  Você pode usar um ou ambos os caracteres curinga `_` e `%` como parte do nome do banco de dados. (Veja Correspondência com caracteres curinga, mais adiante nesta seção.)

- coluna `table_name`

  O nome da tabela a ser replicada.

  O nome da tabela pode incluir um ou ambos os caracteres especiais `_` e `%`. Veja "Combinar com caracteres especiais", mais adiante nesta seção.

- coluna `server_id`

  O ID único do servidor da instância do MySQL (nó SQL) onde a tabela reside.

  `0` nesta coluna funciona como um equivalente de wildcard `%`, e corresponde a qualquer ID de servidor. (Veja Correspondência com wildcards, mais adiante nesta seção.)

- coluna `binlog_type`

  O tipo de registro binário a ser empregado. Veja o texto para valores e descrições.

- coluna `conflict_fn`

  A função de resolução de conflitos a ser aplicada; uma delas é NDB$OLD()"), NDB$MAX()"), NDB$MAX\_DELETE\_WIN()"), NDB$EPOCH()"), NDB$EPOCH\_TRANS()"), NDB$EPOCH2()"), NDB$EPOCH2\_TRANS()"); `NULL` indica que a resolução de conflitos não é usada para esta tabela. O NDB 8.0.30 e versões posteriores suportam duas funções adicionais de resolução de conflitos NDB$MAX\_INS()") e NDB$MAX\_DEL\_WIN\_INS()").

  Consulte Funções de Resolução de Conflitos para obter mais informações sobre essas funções e seus usos na resolução de conflitos da replicação do NDB.

  Algumas funções de resolução de conflitos (`NDB$OLD()`, `NDB$EPOCH()`, `NDB$EPOCH_TRANS()`) exigem o uso de uma ou mais tabelas de exceções criadas pelo usuário. Veja a Tabela de Exceções de Resolução de Conflitos.

Para habilitar a resolução de conflitos com a Replicação NDB, é necessário criar e preencher esta tabela com informações de controle no(s) nó(s) SQL em que o conflito deve ser resolvido. Dependendo do tipo e do método de resolução de conflitos a serem empregados, isso pode ser a fonte, a replica ou ambos os servidores. Em uma configuração simples de fonte-replica, onde os dados também podem ser alterados localmente na replica, isso geralmente é a replica. Em um esquema de replicação mais complexo, como a replicação bidirecional, isso geralmente são todas as fontes envolvidas. Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.

A tabela `ndb_replication` permite o controle de nível de tabela sobre o registro binário fora do escopo da resolução de conflitos, nesse caso, `conflict_fn` é especificado como `NULL`, enquanto os valores das colunas restantes são usados para controlar o registro binário para uma determinada tabela ou conjunto de tabelas que correspondem a uma expressão de wildcard. Ao definir o valor apropriado para a coluna `binlog_type`, você pode fazer com que o registro para uma determinada tabela ou tabelas use um formato de log binário desejado, ou desativar o registro binário completamente. Os valores possíveis para esta coluna, com valores e descrições, estão mostrados na tabela a seguir:

**Tabela 25.70 valores de binlog\_type, com valores e descrições**

<table><thead><tr> <th scope="col">Valor</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Use o padrão do servidor</td> </tr><tr> <td>1</td> <td>Não registre esta tabela no log binário (mesmo efeito que [[<code>sql_log_bin = 0</code>]], mas aplica-se apenas a uma ou mais tabelas especificadas)</td> </tr><tr> <td>2</td> <td>Atualize apenas os atributos registrados; registre esses como eventos [[<code>WRITE_ROW</code>]]</td> </tr><tr> <td>3</td> <td>Registre toda a linha, mesmo que não seja atualizada (comportamento padrão do servidor MySQL)</td> </tr><tr> <td>6</td> <td>Use atributos atualizados, mesmo que os valores não tenham mudado</td> </tr><tr> <td>7</td> <td>Registre toda a linha, mesmo que nenhum valor seja alterado; registre as atualizações como eventos [[<code>UPDATE_ROW</code>]]</td> </tr><tr> <td>8</td> <td>Atualize o log como [[<code>UPDATE_ROW</code>]]; registre apenas as colunas da chave primária na imagem anterior e apenas as colunas atualizadas na imagem posterior (o mesmo efeito que [[<code>--ndb-log-update-minimal</code>]], mas aplica-se apenas a uma ou mais tabelas especificadas)</td> </tr><tr> <td>9</td> <td>Atualize o log como [[<code>UPDATE_ROW</code>]]; registre apenas as colunas da chave primária na imagem anterior e todas as colunas, exceto as colunas da chave primária, na imagem posterior</td> </tr></tbody></table>

Nota

Os valores `binlog_type` 4 e 5 não são utilizados e, portanto, são omitidos da tabela mostrada anteriormente, bem como da próxima tabela.

Vários valores de `binlog_type` são equivalentes a várias combinações das opções de registro do **mysqld** `--ndb-log-updated-only`, `--ndb-log-update-as-write` e `--ndb-log-update-minimal`, conforme mostrado na tabela a seguir:

**Tabela 25.71 valores de binlog\_type com combinações equivalentes de opções de registro do NDB**

<table><thead><tr> <th scope="col">Valor</th> <th scope="col">[[<code>--ndb-log-updated-only</code>]] Valor</th> <th scope="col">[[<code>--ndb-log-update-as-write</code>]] Valor</th> <th scope="col">[[<code>--ndb-log-update-minimal</code>]] Valor</th> </tr></thead><tbody><tr> <th>0</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th>1</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th>2</th> <td>ON</td> <td>ON</td> <td>OFF</td> </tr><tr> <th>3</th> <td>OFF</td> <td>ON</td> <td>OFF</td> </tr><tr> <th>6</th> <td>ON</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th>7</th> <td>OFF</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th>8</th> <td>ON</td> <td>OFF</td> <td>ON</td> </tr><tr> <th>9</th> <td>OFF</td> <td>OFF</td> <td>ON</td> </tr></tbody></table>

O registro binário pode ser configurado em diferentes formatos para diferentes tabelas inserindo linhas na tabela `ndb_replication` usando os valores apropriados das colunas `db`, `table_name` e `binlog_type`. O valor inteiro interno mostrado na tabela anterior deve ser usado ao configurar o formato de registro binário. As duas seguintes instruções configuram o registro binário para o registro de linhas completas (valor 3) para a tabela `test.a` e para o registro de atualizações apenas (valor 2) para a tabela `test.b`:

```
# Table test.a: Log full rows
INSERT INTO mysql.ndb_replication VALUES("test", "a", 0, 3, NULL);

# Table test.b: log updates only
INSERT INTO mysql.ndb_replication VALUES("test", "b", 0, 2, NULL);
```

Para desativar o registro para uma ou mais tabelas, use 1 para `binlog_type`, conforme mostrado aqui:

```
# Disable binary logging for table test.t1
INSERT INTO mysql.ndb_replication VALUES("test", "t1", 0, 1, NULL);

# Disable binary logging for any table in 'test' whose name begins with 't'
INSERT INTO mysql.ndb_replication VALUES("test", "t%", 0, 1, NULL);
```

Desativar o registro para uma tabela específica é o equivalente a definir `sql_log_bin = 0`, exceto que isso se aplica a uma ou mais tabelas individualmente. Se um nó SQL não estiver realizando o registro binário para uma tabela específica, ele não receberá os eventos de alteração de linha para essas tabelas. Isso significa que ele não está recebendo todas as alterações e descartando algumas, mas sim não está se cadastrando nessas alterações.

Desativar o registro pode ser útil por várias razões, incluindo as listadas aqui:

- Não enviar alterações pela rede geralmente economiza largura de banda, buffer e recursos da CPU.

- Não registrar alterações em tabelas com atualizações muito frequentes, mas cujo valor não é grande, é adequado para dados transitórios (como dados de sessão) que podem ser relativamente irrelevantes em caso de falha completa do clúster.

- Usando uma variável de sessão (ou `sql_log_bin`) e código de aplicação, também é possível registrar (ou não registrar) certas instruções SQL ou tipos de instruções SQL; por exemplo, pode ser desejável, em alguns casos, não registrar instruções DDL em uma ou mais tabelas.

- A divisão dos fluxos de replicação em dois (ou mais) logs binários pode ser feita por razões de desempenho, necessidade de replicar diferentes bancos de dados para diferentes locais, uso de diferentes tipos de registro binário para diferentes bancos de dados, e assim por diante.

**Correspondência com caracteres curingas.** Para não ser necessário inserir uma linha na tabela `ndb_replication` para cada combinação de banco de dados, tabela e nó SQL na configuração de replicação, o `NDB` suporta a correspondência com caracteres curingas nas colunas `db`, `table_name` e `server_id` dessa tabela. Os nomes de banco de dados e de tabela usados, respectivamente, em `db` e `table_name`, podem conter um ou ambos os seguintes caracteres curingas:

- `_` (caractere sublinhado): corresponde a zero ou mais caracteres

- `%` (símbolo de porcentagem): corresponde a um único caractere

(Estes são os mesmos caracteres curinga suportados pelo operador MySQL `LIKE`.

A coluna `server_id` suporta `0` como um equivalente de wildcard para `_` (encontra qualquer coisa). Isso é usado nos exemplos mostrados anteriormente.

Uma linha específica na tabela `ndb_replication` pode usar caracteres curingas para corresponder a qualquer nome de banco de dados, nome de tabela e ID do servidor em qualquer combinação. Quando houver várias combinações potenciais na tabela, a melhor combinação é escolhida, de acordo com a tabela mostrada aqui, onde *W* representa uma correspondência com caracteres curinga, *E* uma correspondência exata e quanto maior o valor na coluna *Qualidade*, melhor a correspondência:

**Tabela 25.72 Pesos de diferentes combinações de correspondências com asteriscos e correspondências exatas em colunas na tabela mysql.ndb\_replication**

<table><thead><tr> <th scope="col">[[<code>db</code>]]</th> <th scope="col">[[<code>table_name</code>]]</th> <th scope="col">[[<code>server_id</code>]]</th> <th scope="col">Qualidade</th> </tr></thead><tbody><tr> <th>W</th> <td>W</td> <td>W</td> <td>1</td> </tr><tr> <th>W</th> <td>W</td> <td>E</td> <td>2</td> </tr><tr> <th>W</th> <td>E</td> <td>W</td> <td>3</td> </tr><tr> <th>W</th> <td>E</td> <td>E</td> <td>4</td> </tr><tr> <th>E</th> <td>W</td> <td>W</td> <td>5</td> </tr><tr> <th>E</th> <td>W</td> <td>E</td> <td>6</td> </tr><tr> <th>E</th> <td>E</td> <td>W</td> <td>7</td> </tr><tr> <th>E</th> <td>E</td> <td>E</td> <td>8</td> </tr></tbody></table>

Assim, uma correspondência exata no nome do banco de dados, no nome da tabela e no ID do servidor é considerada a melhor (mais forte), enquanto a correspondência mais fraca (pior) é uma correspondência com asterisco em todas as três colunas. Apenas a força da correspondência é considerada ao escolher qual regra aplicar; a ordem em que as linhas ocorrem na tabela não tem efeito nessa determinação.

**Registrando linhas completas ou parciais.**

Existem dois métodos básicos de registro de linhas, conforme determinado pela configuração da opção `--ndb-log-updated-only` para o **mysqld**:

- Registre linhas completas (opção definida como `ON`)
- Registre apenas os dados da coluna que foram atualizados, ou seja, os dados da coluna cujo valor foi definido, independentemente de este valor ter sido realmente alterado ou não. Este é o comportamento padrão (opção definida como `OFF`).

Geralmente, é suficiente — e mais eficiente — registrar apenas as colunas atualizadas; no entanto, se você precisar registrar linhas completas, pode fazê-lo definindo `--ndb-log-updated-only` para `0` ou `OFF`.

**Registro de dados alterados como atualizações.**

O ajuste da opção `--ndb-log-update-as-write` do MySQL Server determina se o registro é realizado com ou sem a imagem “antes”.

Como a resolução de conflitos para operações de atualização e exclusão é realizada no manipulador de atualização do MySQL Server, é necessário controlar o registro realizado pela fonte de replicação para que as atualizações sejam atualizações e não escritas; ou seja, para que as atualizações sejam tratadas como alterações em linhas existentes, em vez da escrita de novas linhas, mesmo que estas substituam linhas existentes.

Esta opção está ativada por padrão; em outras palavras, as atualizações são tratadas como escritas. Isso significa que, por padrão, as atualizações são escritas como eventos `write_row` no log binário, em vez de eventos `update_row`.

Para desabilitar a opção, inicie a fonte **mysqld** com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`. Você deve fazer isso ao replicar de tabelas NDB para tabelas usando um motor de armazenamento diferente; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional, para obter mais informações.

Importante

(*NDB 8.0.30 e versões posteriores*:) Para a resolução de conflitos de inserção usando `NDB$MAX_INS()` ou `NDB$MAX_DEL_WIN_INS()`, um nó SQL (ou seja, um processo **mysqld**) pode registrar atualizações de linha no cluster de origem como eventos `WRITE_ROW` com a opção `--ndb-log-update-as-write` habilitada para idempotência e tamanho ótimo. Isso funciona para esses algoritmos, pois ambos mapeiam um evento `WRITE_ROW` para uma inserção ou atualização, dependendo se a linha já existe, e os metadados necessários (a imagem "after" para a coluna de timestamp) estão presentes no evento "WRITE\_ROW".
