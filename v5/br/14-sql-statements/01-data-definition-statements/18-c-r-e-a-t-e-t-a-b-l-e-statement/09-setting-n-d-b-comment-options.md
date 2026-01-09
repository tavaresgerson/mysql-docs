#### 13.1.18.9 Definindo as Opções de Comentário do NDB

- NDB_COLUMN Opções
- Opções do NDB_TABLE

É possível definir uma série de opções específicas para o NDB Cluster na tabela de comentários ou nos comentários das colunas de uma tabela `NDB`. As opções de nível de tabela para controlar a leitura de qualquer replica e o equilíbrio de partições podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho da coluna da tabela de partes do blob usada para armazenar partes dos valores do blob pelo `NDB` em seu máximo. Isso funciona para as colunas `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT` e `JSON`.

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao equilíbrio das partições e se a tabela é replicada totalmente, entre outras.

O restante desta seção descreve essas opções e seu uso.

##### Opções de NDB_COLUMN

No NDB Cluster, um comentário de coluna em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_COLUMN`. O NDB 7.5 e 7.6 suportam uma única opção de comentário de coluna `MAX_BLOB_PART_SIZE`; a sintaxe para essa opção é mostrada aqui:

```sql
COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE[={0|1}]'
```

O sinal `=` e o valor que o segue são opcionais. O uso de qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna `TEXT` ou `BLOB` para o número máximo de bytes suportado por `NDB` (13948). Esta opção pode ser aplicada a qualquer tipo de coluna blob suportado pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). `MAX_BLOB_PART_SIZE` não tem efeito em colunas `JSON`.

Além disso, lembre-se, especialmente ao trabalhar com colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` representa o tamanho da coluna em bytes. Isso não indica o número de caracteres, que varia de acordo com o conjunto de caracteres e a ordenação usados pela coluna.

Para ver os efeitos dessa opção, primeiro executamos a seguinte instrução SQL no cliente **mysql** para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções extras e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```sql
mysql> CREATE TABLE test.t (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

No shell do sistema, execute o utilitário **ndb_desc** para obter informações sobre a tabela recém-criada, conforme mostrado neste exemplo:

```sql
$> ndb_desc -d test t
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

As informações da coluna na saída estão listadas sob `Atributos`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto em negrito. Para `c1`, o tamanho da parte do blob é de 2000, o valor padrão; para `c2`, é de 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

Você pode alterar o tamanho da parte do blob para uma coluna de blob específica de uma tabela `NDB` usando uma instrução `ALTER TABLE`, como esta, e verificar as alterações posteriormente usando `SHOW CREATE TABLE`:

```sql
mysql> ALTER TABLE test.t
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

A saída do **ndb_desc** mostra que os tamanhos das partes de blob das colunas foram alterados conforme esperado:

```sql
$> ndb_desc -d test t
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex

NDBT_ProgramExit: 0 - OK
```

Para alterar o tamanho da parte blob de uma coluna, é necessário usar uma cópia do comando `ALTER TABLE`; essa operação não pode ser realizada online (consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”).

Para obter mais informações sobre como o `NDB` armazena colunas de tipos blob, consulte Requisitos de armazenamento do tipo String.

##### Opções da Tabela NDB

Para uma tabela de um cluster NDB, o comentário da tabela em uma instrução `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, seguindo a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

```sql
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,...]]"

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Espaços não são permitidos dentro da string entre aspas. A string é case-insensitive.

As quatro opções da tabela `NDB` que podem ser definidas como parte de um comentário dessa forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são registradas e configuradas com pontos de verificação. Isso as torna resistentes a falhas de todo o clúster. Ao usar `NOLOGGING` ao criar ou alterar uma tabela, significa que essa tabela não é registrada novamente ou incluída em pontos de verificação locais. Nesse caso, a tabela ainda é replicada em todos os nós de dados para alta disponibilidade e atualizada usando transações, mas as alterações feitas nela não são registradas nos logs de registro do nó de dados e seu conteúdo não é configurado em pontos de verificação no disco; ao recuperar de uma falha de clúster, o clúster retém a definição da tabela, mas nenhuma de suas linhas — ou seja, a tabela está vazia.

O uso de tabelas sem registro dessas reduz as demandas do nó de dados em I/O de disco e armazenamento, além da CPU para o checkpointing da CPU. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no improvável caso de falha total do cluster é aceitável.

Também é possível usar a variável de sistema `ndb_table_no_logging` para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto essa variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário do uso direto do comentário, não há nada no caso de saída de `SHOW CREATE TABLE` para indicar que é uma tabela não de log. Recomenda-se o uso da abordagem com o comentário da tabela, pois oferece controle por tabela da funcionalidade, e esse aspecto do esquema da tabela está embutido na declaração de criação da tabela, onde pode ser facilmente encontrado por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir essa opção para 1 tem o mesmo efeito que se o `ndb_read_backup` estivesse habilitado; permite a leitura de qualquer replica. Isso melhora significativamente o desempenho das leituras da tabela, com um custo relativamente baixo no desempenho da escrita.

A partir do MySQL NDB Cluster 7.5.3, você pode definir `READ_BACKUP` para uma tabela existente online (Bug #80858, Bug #23001617), usando uma instrução `ALTER TABLE` semelhante àquelas mostradas aqui:

```sql
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Antes do MySQL NDB Cluster 7.5.4, definir `READ_BACKUP` para 1 também fazia com que `FRAGMENT_COUNT_TYPE` fosse definido como `ONE_PER_LDM_PER_NODE_GROUP`.

Para obter mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`PARTITION_BALANCE`: Oferece controle adicional sobre a atribuição e o posicionamento das partições. Os seguintes quatro esquemas são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por nó.

   Apenas um LDM em cada nó armazena uma partição primária. Cada partição é armazenada no mesmo LDM (mesma ID) em todos os nós.

2. `FOR_RA_BY_NODE`: Uma partição por grupo de nós.

   Cada nó armazena uma única partição, que pode ser uma replica primária ou uma replica de backup. Cada partição é armazenada no mesmo LDM em todos os nós.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada nó; o padrão.

   Esse é o mesmo comportamento do que antes do MySQL NDB Cluster 7.5.2, exceto por uma mapeia ligeiramente diferente das partições para os LDM, começando com o LDM 0 e colocando uma partição por grupo de nós, depois passando para o próximo LDM.

   No MySQL NDB Cluster 7.5.4 e versões posteriores, essa é a configuração usada se `READ_BACKUP` estiver definido como 1. (Bug #82634, Bug #24482114)

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

   Antes do MySQL NDB Cluster 7.5.4, essa era a configuração usada se o `READ_BACKUP` estivesse definido como 1.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

   Essa configuração foi adicionada no NDB 7.5.4.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

   Essa configuração foi adicionada no NDB 7.5.4.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada grupo de nós.

   Essas partições podem ser primárias ou de backup.

   Essa configuração foi adicionada no NDB 7.5.4.

A partir da versão NDB 7.5.4, `PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. O uso de `MAX_ROWS` para forçar o número de partições é desaconselhado a partir da versão NDB 7.5.4, continua a ser suportado na versão 7.6 do NDB Cluster para compatibilidade com versões anteriores, mas está sujeito à remoção em uma futura versão do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

Antes do MySQL NDB Cluster 7.5.4, `PARTITION_BALANCE` era chamado de `FRAGMENT_COUNT_TYPE` e aceita como seu valor um dos seguintes (na mesma ordem que a lista mostrada acima): `ONE_PER_NODE`, `ONE_PER_NODE_GROUP`, `ONE_PER_LDM_PER_NODE` ou `ONE_PER_LDM_PER_NODE_GROUP`. (Bug #81761, Bug
\#23547525)

`FULLY_REPLICATED` controla se a tabela está totalmente replicada, ou seja, se cada nó de dados tem uma cópia completa da tabela. Para habilitar a replicação completa da tabela, use `FULLY_REPLICATED=1`.

Essa configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definindo-a como `ON`, a opção é ativada por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`, que mantém o comportamento anterior (como no MySQL NDB Cluster 7.5.1 e versões anteriores, antes da introdução do suporte para tabelas totalmente replicadas). A variável de sistema `ndb_data_node_neighbour` também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acessemos o nó de dados que é local deste servidor MySQL.

Um exemplo de uma instrução `CREATE TABLE` usando um comentário assim ao criar uma tabela `NDB` é mostrado aqui:

```sql
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

O comentário é exibido como parte do resultado do `SHOW CREATE TABLE`. O texto do comentário também está disponível ao consultar a tabela do Esquema de Informações do MySQL `TABLES`, como neste exemplo:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Essa sintaxe de comentário também é suportada com as instruções `ALTER TABLE` para tabelas `NDB`, como mostrado aqui:

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

A partir da versão NDB 7.6.15, a coluna `TABLE_COMMENT` exibe o comentário necessário para recriar a tabela, conforme a instrução `ALTER TABLE`, da seguinte forma:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Antes da NDB 7.6.15, o comentário da tabela usado com `ALTER TABLE` substituía qualquer comentário existente que a tabela pudesse ter tido. Isso significava que, por exemplo, o valor `READ_BACKUP` não era transferido para o novo comentário definido pela instrução `ALTER TABLE`, e que quaisquer valores não especificados retornavam aos seus valores padrão. (BUG#30428829) Assim, não havia mais nenhuma maneira de usar o SQL para recuperar o valor previamente definido para o comentário. Para evitar que os valores dos comentários retornem aos seus valores padrão, era necessário preservar quaisquer desses valores da string de comentário existente e incluí-los no comentário passado para `ALTER TABLE`.

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída do **ndb_desc**. **ndb_desc** também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Consulte a descrição deste programa para obter mais informações.
