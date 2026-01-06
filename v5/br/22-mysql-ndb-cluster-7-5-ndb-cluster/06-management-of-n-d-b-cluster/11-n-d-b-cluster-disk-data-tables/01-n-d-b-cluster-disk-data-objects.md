#### 21.6.11.1 Objetos de dados de disco do cluster NDB

O armazenamento de dados do disco do cluster do NDB é implementado usando vários objetos de dados de disco. Estes incluem os seguintes:

- Os espaços de tabela atuam como recipientes para outros objetos de dados de disco.

- Desfazer arquivos de registro: desfazer informações necessárias para reverter transações.

- Um ou mais arquivos de registro de desfazer são atribuídos a um grupo de arquivos de registro, que é então atribuído a um espaço de tabelas.

- Os arquivos de dados armazenam os dados da tabela Dados do disco. Um arquivo de dados é atribuído diretamente a um espaço de tabelas.

Os arquivos de log e os arquivos de dados são arquivos reais no sistema de arquivos de cada nó de dados; por padrão, eles são colocados em `ndb_node_id_fs` no *`DataDir`* especificado no arquivo *`config.ini`* do NDB Cluster, e onde *`node_id`* é o ID do nó do nó de dados. É possível colocá-los em outros lugares, especificando um caminho absoluto ou relativo como parte do nome do arquivo ao criar o arquivo de log de desfazer ou o arquivo de dados. As instruções que criam esses arquivos são mostradas mais adiante nesta seção.

Os espaços de tabela e os grupos de arquivos de log do NDB Cluster não são implementados como arquivos.

Importante

Embora nem todos os objetos de Dados de Disco sejam implementados como arquivos, todos compartilham o mesmo namespace. Isso significa que *cada objeto de Dados de Disco* deve ter um nome único (e não apenas cada objeto de Dados de Disco de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de log com os nomes `dd1`.

Supondo que você já tenha configurado um NDB Cluster com todos os nós (incluindo nós de gerenciamento e SQL), os passos básicos para criar uma tabela de NDB Cluster no disco são os seguintes:

1. Crie um grupo de arquivos de registro e atribua um ou mais arquivos de registro de desfazer a ele (um arquivo de registro de desfazer também é chamado de undofile).

   Nota

   Os arquivos de registro desfazer são necessários apenas para as tabelas de Dados do disco; eles não são usados para as tabelas de `NDBCLUSTER` que são armazenadas apenas na memória.

2. Crie um espaço de tabelas; atribua o grupo de arquivos de log, bem como um ou mais arquivos de dados, ao espaço de tabelas.

3. Crie uma tabela de dados de disco que utilize este tablespace para armazenamento de dados.

Cada uma dessas tarefas pode ser realizada usando instruções SQL no cliente **mysql** ou em outras aplicações de cliente MySQL, conforme mostrado no exemplo a seguir.

1. Criamos um grupo de arquivos de registro chamado `lg_1` usando `CREATE LOGFILE GROUP`. Este grupo de arquivos de registro deve ser composto por dois arquivos de registro de desfazer, que chamamos de `undo_1.log` e `undo_2.log`, cujos tamanhos iniciais são de 16 MB e 12 MB, respectivamente. (O tamanho inicial padrão para um arquivo de registro de desfazer é de 128 MB.) Opcionalmente, você também pode especificar um tamanho para o buffer de desfazer do grupo de arquivos de registro, ou permitir que ele assuma o valor padrão de 8 MB. Neste exemplo, definimos o tamanho do buffer UNDO em 2 MB. Um grupo de arquivos de registro deve ser criado com um arquivo de registro de desfazer; então, adicionamos `undo_1.log` a `lg_1` nesta declaração de `CREATE LOGFILE GROUP`:

   ```sql
   CREATE LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_1.log'
       INITIAL_SIZE 16M
       UNDO_BUFFER_SIZE 2M
       ENGINE NDBCLUSTER;
   ```

   Para adicionar `undo_2.log` ao grupo de arquivos de log, use a seguinte instrução `ALTER LOGFILE GROUP`:

   ```sql
   ALTER LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_2.log'
       INITIAL_SIZE 12M
       ENGINE NDBCLUSTER;
   ```

   Alguns pontos importantes:

   - A extensão de arquivo `.log` usada aqui não é necessária. Usamos apenas para tornar os arquivos de log facilmente reconhecíveis.

   - Cada instrução `CREATE LOGFILE GROUP` e `ALTER LOGFILE GROUP` deve incluir uma opção `ENGINE`. Os únicos valores permitidos para essa opção são `NDBCLUSTER` e `NDB`.

     Importante

     Pode existir, no máximo, um grupo de arquivos de registro no mesmo NDB Cluster a qualquer momento.

   - Quando você adiciona um arquivo de registro de desfazer a um grupo de arquivos de registro usando `ADD UNDOFILE 'nome_do_arquivo'`, um arquivo com o nome *`nome_do_arquivo`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó de dados. Cada arquivo de registro de desfazer tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 nós de dados, então a instrução `ALTER LOGFILE GROUP` (alter-logfile-group.html) mostrada agora cria 4 arquivos de registro de desfazer, 1 em cada um dos 4 nós de dados; cada um desses arquivos é chamado de `undo_2.log` e cada arquivo tem 12 MB de tamanho.

   - O `UNDO_BUFFER_SIZE` é limitado pela quantidade de memória do sistema disponível.

   - Para obter mais informações sobre a instrução `CREATE LOGFILE GROUP`, consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”. Para obter mais informações sobre a instrução `ALTER LOGFILE GROUP`, consulte Seção 13.1.5, “Instrução ALTER LOGFILE GROUP”.

2. Agora podemos criar um espaço de tabelas, que contém arquivos que serão usados pelas tabelas de NDB Cluster Disk Data para armazenar seus dados. Um espaço de tabelas também está associado a um grupo de arquivos de log específico. Ao criar um novo espaço de tabelas, você deve especificar o grupo de arquivos de log que ele deve usar para registro de desfazer; você também deve especificar um arquivo de dados. Você pode adicionar mais arquivos de dados ao espaço de tabelas após a criação do espaço de tabelas; também é possível excluir arquivos de dados de um espaço de tabelas (um exemplo de exclusão de arquivos de dados é fornecido mais adiante nesta seção).

   Suponha que desejamos criar um espaço de tabelas chamado `ts_1` que use `lg_1` como seu grupo de arquivo de log. Este espaço de tabelas deve conter dois arquivos de dados chamados `data_1.dat` e `data_2.dat`, cujos tamanhos iniciais são 32 MB e 48 MB, respectivamente. (O valor padrão para `INITIAL_SIZE` é 128 MB.) Podemos fazer isso usando duas instruções SQL, como mostrado aqui:

   ```sql
   CREATE TABLESPACE ts_1
       ADD DATAFILE 'data_1.dat'
       USE LOGFILE GROUP lg_1
       INITIAL_SIZE 32M
       ENGINE NDBCLUSTER;

   ALTER TABLESPACE ts_1
       ADD DATAFILE 'data_2.dat'
       INITIAL_SIZE 48M
       ENGINE NDBCLUSTER;
   ```

   A instrução `CREATE TABLESPACE` cria um tablespace `ts_1` com o arquivo de dados `data_1.dat` e associa `ts_1` ao grupo de arquivos de log `lg_1`. A instrução `ALTER TABLESPACE` adiciona o segundo arquivo de dados (`data_2.dat`).

   Alguns pontos importantes:

   - Assim como acontece com a extensão de arquivo `.log` usada neste exemplo para arquivos de registro de desfazer, não há uma importância especial para a extensão de arquivo `.dat`; ela é usada apenas para facilitar o reconhecimento de arquivos de dados.

   - Quando você adiciona um arquivo de dados a um espaço de tabelas usando `ADD DATAFILE 'nome_do_arquivo'`, um arquivo com o nome *`nome_do_arquivo`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó de dados. Cada arquivo de dados tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 nós de dados, então a instrução `ALTER TABLESPACE` (alter-tablespace.html) mostrada anteriormente cria 4 arquivos de dados, 1 em cada diretório de dados de cada um dos 4 nós de dados; cada um desses arquivos é chamado de `data_2.dat` e cada arquivo tem 48 MB de tamanho.

   - O NDB 7.6 (e versões posteriores) reserva 4% de cada espaço de tabela para uso durante os reinicializações do nó de dados. Esse espaço não está disponível para armazenamento de dados.

   - Todas as instruções `CREATE TABLESPACE` e `ALTER TABLESPACE` devem conter uma cláusula `ENGINE`; apenas tabelas que utilizam o mesmo mecanismo de armazenamento que o tablespace podem ser criadas no tablespace. Para os tablespaces de NDB Cluster, os únicos valores permitidos para esta opção são `NDBCLUSTER` e `NDB`.

   - Para obter mais informações sobre as instruções `CREATE TABLESPACE` e `ALTER TABLESPACE`, consulte Seção 13.1.19, “Instrução CREATE TABLESPACE” e Seção 13.1.9, “Instrução ALTER TABLESPACE”.

3. Agora é possível criar uma tabela cujas colunas não indexadas são armazenadas em disco no tablespace `ts_1`:

   ```sql
   CREATE TABLE dt_1 (
       member_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
       last_name VARCHAR(50) NOT NULL,
       first_name VARCHAR(50) NOT NULL,
       dob DATE NOT NULL,
       joined DATE NOT NULL,
       INDEX(last_name, first_name)
       )
       TABLESPACE ts_1 STORAGE DISK
       ENGINE NDBCLUSTER;
   ```

   A opção `TABLESPACE ... STORAGE DISK` informa ao mecanismo de armazenamento `NDBCLUSTER` (mysql-cluster.html) que deve usar o tablespace `ts_1` para o armazenamento de dados no disco.

   Depois que a tabela `ts_1` foi criada como mostrado, você pode executar as instruções `INSERT`, `SELECT`, `UPDATE` e `DELETE` nela, assim como faria com qualquer outra tabela MySQL.

   Também é possível especificar se uma coluna individual é armazenada no disco ou na memória usando uma cláusula `STORAGE` como parte da definição da coluna em uma instrução `CREATE TABLE` ou `ALTER TABLE`. `STORAGE DISK` faz com que a coluna seja armazenada no disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. Consulte Seção 13.1.18, “Instrução CREATE TABLE” para obter mais informações.

**Indexação de colunas armazenadas implicitamente no disco.** Para a tabela `dt_1` conforme definida no exemplo mostrado anteriormente, apenas as colunas `dob` e `joined` são armazenadas no disco. Isso ocorre porque existem índices nas colunas `id`, `last_name` e `first_name`, e, portanto, os dados pertencentes a essas colunas são armazenados na RAM. Apenas as colunas não indexadas podem ser mantidas no disco; os índices e os dados das colunas indexadas continuam sendo armazenados na memória. Esse compromisso entre o uso de índices e a conservação da RAM é algo que você deve ter em mente ao projetar tabelas de Dados de Disco.

Você não pode adicionar um índice a uma coluna que tenha sido explicitamente declarada como `STORAGE DISK`, sem primeiro alterar seu tipo de armazenamento para `MEMORY`; qualquer tentativa de fazer isso falha com um erro. Uma coluna que *implicitamente* usa armazenamento em disco pode ser indexada; quando isso é feito, o tipo de armazenamento da coluna é alterado para `MEMORY` automaticamente. Por "implicitamente", queremos dizer uma coluna cujo tipo de armazenamento não é declarado, mas que é herdado da tabela pai. Na seguinte instrução CREATE TABLE (usando o tablespace `ts_1` definido anteriormente), as colunas `c2` e `c3` usam armazenamento em disco implicitamente:

```sql
mysql> CREATE TABLE ti (
    ->     c1 INT PRIMARY KEY,
    ->     c2 INT,
    ->     c3 INT,
    ->     c4 INT
    -> )
    ->     STORAGE DISK
    ->     TABLESPACE ts_1
    ->     ENGINE NDBCLUSTER;
Query OK, 0 rows affected (1.31 sec)
```

Como `c2`, `c3` e `c4` não foram declarados com `STORAGE DISK`, é possível indexá-los. Aqui, adicionamos índices a `c2` e `c3`, usando, respectivamente, `CREATE INDEX` e `ALTER TABLE`:

```sql
mysql> CREATE INDEX i1 ON ti(c2);
Query OK, 0 rows affected (2.72 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE ti ADD INDEX i2(c3);
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

`SHOW CREATE TABLE` confirma que os índices foram adicionados.

```sql
mysql> SHOW CREATE TABLE ti\G
*************************** 1. row ***************************
       Table: ti
Create Table: CREATE TABLE `ti` (
  `c1` int(11) NOT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  `c4` int(11) DEFAULT NULL,
  PRIMARY KEY (`c1`),
  KEY `i1` (`c2`),
  KEY `i2` (`c3`)
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Você pode ver usando **ndb\_desc** que as colunas indexadas (texto em negrito) agora usam armazenamento em memória em vez de armazenamento em disco:

```sql
$> ./ndb_desc -d test t1
-- t1 --
Version: 33554433
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 317
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 4
FragmentCount: 4
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-4
-- Attributes --
c1 Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c2 Int NULL AT=FIXED ST=MEMORY
c3 Int NULL AT=FIXED ST=MEMORY
c4 Int NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(c1) - UniqueHashIndex
i2(c3) - OrderedIndex
PRIMARY(c1) - OrderedIndex
i1(c2) - OrderedIndex

NDBT_ProgramExit: 0 - OK
```

**Observação de desempenho.** O desempenho de um clúster que utiliza o armazenamento de Dados de disco é significativamente melhorado se os arquivos de Dados de disco estiverem em um disco físico separado do sistema de arquivos do nó de dados. Isso deve ser feito para cada nó de dados no clúster para obter qualquer benefício perceptível.

Você pode usar caminhos absolutos e relativos do sistema de arquivos com `ADD UNDOFILE` e `ADD DATAFILE`. Os caminhos relativos são calculados em relação ao diretório de dados do nó de dados. Você também pode usar links simbólicos; consulte Seção 21.6.11.2, “Usando Links Simbólicos com Objetos de Dados de Disco” para obter mais informações e exemplos.

Um grupo de arquivos de registro, um espaço de tabelas e quaisquer tabelas de Dados de Disco que os utilizem devem ser criados em uma ordem específica. O mesmo vale para a remoção de qualquer um desses objetos:

- Um grupo de arquivo de registro não pode ser excluído enquanto houver quaisquer espaços de tabela usando ele.

- Um espaço de tabela não pode ser excluído enquanto contiver quaisquer arquivos de dados.

- Você não pode excluir arquivos de dados de um tablespace enquanto houver tabelas que estejam usando o tablespace.

- Não é possível excluir arquivos criados em um espaço de tabela diferente daquele com o qual os arquivos foram criados. (Bug #20053)

Por exemplo, para descartar todos os objetos criados até agora nesta seção, você usaria as seguintes instruções:

```sql
mysql> DROP TABLE dt_1;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_2.dat'
    -> ENGINE NDBCLUSTER;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_1.dat'
    -> ENGINE NDBCLUSTER;

mysql> DROP TABLESPACE ts_1
    -> ENGINE NDBCLUSTER;

mysql> DROP LOGFILE GROUP lg_1
    -> ENGINE NDBCLUSTER;
```

Essas declarações devem ser executadas na ordem mostrada, exceto que as duas declarações `ALTER TABLESPACE ... DROP DATAFILE` podem ser executadas em qualquer ordem.

Você pode obter informações sobre os arquivos de dados usados pelas tabelas de Disk Data consultando a tabela `FILES` no banco de dados `INFORMATION_SCHEMA`. Uma linha extra “`NULL`” fornece informações adicionais sobre os arquivos do log de desfazer. Para mais informações e exemplos, consulte Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”.
