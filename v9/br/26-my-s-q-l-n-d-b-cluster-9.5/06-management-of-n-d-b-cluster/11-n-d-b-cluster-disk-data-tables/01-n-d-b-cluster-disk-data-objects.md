#### 25.6.11.1 Objetos de Dados de Disco do NDB Cluster

O armazenamento de dados de disco do NDB Cluster é implementado usando os seguintes objetos:

* Tablespace: Atua como contêineres para outros objetos de Dados de Disco. Um tablespace contém um ou mais arquivos de dados e um ou mais grupos de arquivos de log de desfazer.

* Arquivo de dados: Armazena dados de coluna. Um arquivo de dados é atribuído diretamente a um tablespace.

* Arquivo de log de desfazer: Contém informações de desfazer necessárias para reverter transações. Atribuído a um grupo de arquivos de log de desfazer.

* Grupo de arquivos de log: Contém um ou mais arquivos de log de desfazer. Atribuído a um tablespace.

Arquivos de log de desfazer e arquivos de dados são arquivos reais no sistema de arquivos de cada nó de dados; por padrão, eles são colocados em `ndb_node_id_fs` no *`DataDir`* especificado no arquivo `config.ini` do NDB Cluster, e onde *`node_id`* é o ID de nó do nó de dados. É possível colocá-los em outro lugar, especificando um caminho absoluto ou relativo como parte do nome do arquivo ao criar o arquivo de log de desfazer ou de dados. As instruções que criam esses arquivos são mostradas mais adiante nesta seção.

Arquivos de log de desfazer são usados apenas por tabelas de Dados de Disco e não são necessários ou usados por tabelas `NDB` que são armazenadas apenas na memória.

Os tablespace e grupos de arquivos de log do NDB Cluster não são implementados como arquivos.

Embora nem todos os objetos de Dados de Disco sejam implementados como arquivos, todos compartilham o mesmo namespace. Isso significa que *cada objeto de Dados de Disco* deve ser nomeado de forma única (e não apenas cada objeto de Dados de Disco de um tipo específico). Por exemplo, você não pode ter um tablespace e um grupo de arquivos de log ambos com o nome `dd1`.

Supondo que você já tenha configurado um NDB Cluster com todos os nós (incluindo nós de gerenciamento e SQL), os passos básicos para criar uma tabela do NDB Cluster no disco são os seguintes:

1. Crie um grupo de arquivos de registro e atribua um ou mais arquivos de registro de desfazer a ele (um arquivo de registro de desfazer também é às vezes chamado de undofile).

2. Crie um espaço de tabela; atribua o grupo de arquivos de registro, bem como um ou mais arquivos de dados, ao espaço de tabela.

3. Crie uma tabela de Dados de Disco que use este espaço de tabela para armazenamento de dados.

Cada uma dessas tarefas pode ser realizada usando instruções SQL no cliente **mysql** ou em outra aplicação cliente do MySQL, como mostrado no exemplo que segue.

1. Criamos um grupo de arquivos de registro chamado `lg_1` usando `CREATE LOGFILE GROUP`. Este grupo de arquivos de registro será composto por dois arquivos de registro de desfazer, que chamamos de `undo_1.log` e `undo_2.log`, cujos tamanhos iniciais são de 16 MB e 12 MB, respectivamente. (O tamanho inicial padrão para um arquivo de registro de desfazer é de 128 MB.) Opcionalmente, você também pode especificar um tamanho para o buffer de desfazer do grupo de arquivos de registro, ou permitir que ele assuma o valor padrão de 8 MB. Neste exemplo, definimos o tamanho do buffer de desfazer em 2 MB. Um grupo de arquivos de registro deve ser criado com um arquivo de registro de desfazer; então, adicionamos `undo_1.log` a `lg_1` nesta instrução `CREATE LOGFILE GROUP`:

   ```
   CREATE LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_1.log'
       INITIAL_SIZE 16M
       UNDO_BUFFER_SIZE 2M
       ENGINE NDBCLUSTER;
   ```

   Para adicionar `undo_2.log` ao grupo de arquivos de registro, use a seguinte instrução `ALTER LOGFILE GROUP`:

   ```
   ALTER LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_2.log'
       INITIAL_SIZE 12M
       ENGINE NDBCLUSTER;
   ```

   Algumas observações importantes:

   * A extensão de arquivo `.log` usada aqui não é necessária. A empregamos apenas para tornar os arquivos de registro facilmente reconhecíveis.

   * Cada instrução `CREATE LOGFILE GROUP` e `ALTER LOGFILE GROUP` deve incluir uma opção `ENGINE`. Os únicos valores permitidos para esta opção são `NDBCLUSTER` e `NDB`.

   Importante

   Pode existir no máximo um grupo de arquivos de registro no mesmo NDB Cluster a qualquer momento.

* Ao adicionar um arquivo de registro de desfazer a um grupo de arquivos de registro usando `ADD UNDOFILE 'nome_arquivo'`, um arquivo com o nome *`nome_arquivo`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó de dados. Cada arquivo de registro de desfazer tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 nós de dados, então a instrução `ALTER LOGFILE GROUP` mostrada anteriormente cria 4 arquivos de registro de desfazer, 1 em cada diretório de dados de cada um dos 4 nós de dados; cada um desses arquivos é chamado de `undo_2.log` e cada arquivo tem 12 MB de tamanho.

* `UNDO_BUFFER_SIZE` é limitado pela quantidade de memória do sistema disponível.

* Veja a Seção 15.1.20, “Instrução CREATE LOGFILE GROUP”, e a Seção 15.1.8, “Instrução ALTER LOGFILE GROUP”, para mais informações sobre essas instruções.

2. Agora podemos criar um espaço de tabelas—um contêiner abstrato para arquivos usados pelas tabelas de Dados em Disco para armazenar dados. Um espaço de tabelas é associado a um grupo de arquivos de registro particular; ao criar um novo espaço de tabelas, você deve especificar o grupo de arquivos de registro que ele usa para registro de desfazer. Você também deve especificar pelo menos um arquivo de dados; você pode adicionar mais arquivos de dados ao espaço de tabelas após o espaço de tabelas ser criado. Também é possível excluir arquivos de dados de um espaço de tabelas (veja o exemplo mais adiante nesta seção).

   Suponha que desejamos criar um espaço de tabelas chamado `ts_1` que usa `lg_1` como seu grupo de arquivos de registro. Queremos que o espaço de tabelas contenha dois arquivos de dados, chamados `data_1.dat` e `data_2.dat`, cujos tamanhos iniciais são de 32 MB e 48 MB, respectivamente. (O valor padrão para `INITIAL_SIZE` é 128 MB.) Podemos fazer isso usando duas instruções SQL, como mostrado aqui:

   ```
   CREATE TABLESPACE ts_1
       ADD DATAFILE 'data_1.dat'
       USE LOGFILE GROUP lg_1
       INITIAL_SIZE 32M
       ENGINE NDBCLUSTER;

   ALTER TABLESPACE ts_1
       ADD DATAFILE 'data_2.dat'
       INITIAL_SIZE 48M;
   ```

A instrução `CREATE TABLESPACE` cria um espaço de tabelas `ts_1` com o arquivo de dados `data_1.dat` e associa `ts_1` ao grupo de arquivos de log `lg_1`. A instrução `ALTER TABLESPACE` adiciona o segundo arquivo de dados (`data_2.dat`).

Algumas observações importantes:

* Como é o caso da extensão `.log` usada neste exemplo para arquivos de log de desfazer, não há significado especial para a extensão `.dat`; ela é usada apenas para facilitar o reconhecimento.

* Ao adicionar um arquivo de dados a um espaço de tabelas usando `ADD DATAFILE 'nome_arquivo'`, um arquivo com o nome *`nome_arquivo`* é criado no diretório `ndb_node_id_fs` dentro do `DataDir` de cada nó de dados no clúster, onde *`node_id`* é o ID do nó de dados. Cada arquivo de dados tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 nós de dados, então a instrução `ALTER TABLESPACE` mostrada acima cria 4 arquivos de dados, 1 em cada diretório de dados de cada um dos 4 nós de dados; cada um desses arquivos é chamado `data_2.dat`, e cada arquivo tem 48 MB de tamanho.

* `NDB` reserva 4% de cada espaço de tabelas para uso durante os reinícios dos nós de dados. Esse espaço não está disponível para armazenar dados.

* As instruções `CREATE TABLESPACE` devem conter uma cláusula `ENGINE`; apenas tabelas que usam o mesmo motor de armazenamento que o espaço de tabelas podem ser criadas no espaço de tabelas. Para espaços de tabelas `NDB`, a instrução `ALTER TABLESPACE` aceita uma cláusula `ENGINE` apenas para `ALTER TABLESPACE ... ADD DATAFILE`; `ENGINE` é rejeitado para qualquer outra instrução `ALTER TABLESPACE`. Para espaços de tabelas `NDB`, os únicos valores permitidos para a opção `ENGINE` são `NDBCLUSTER` e `NDB`.

* A alocação de extensões é realizada de forma round-robin entre todos os arquivos de dados usados por um espaço de tabelas específico.

* Para obter mais informações sobre as instruções `CREATE TABLESPACE` e `ALTER TABLESPACE`, consulte a Seção 15.1.25, “Instrução CREATE TABLESPACE”, e a Seção 15.1.12, “Instrução ALTER TABLESPACE”.

3. Agora é possível criar uma tabela cujas colunas não indexadas são armazenadas no disco usando arquivos no tablespace `ts_1`:

```
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

`TABLESPACE ts_1 STORAGE DISK` informa ao motor de armazenamento `NDB` que o tablespace `ts_1` será usado para armazenamento de dados no disco.

Uma vez que a tabela `ts_1` tenha sido criada como mostrado, você pode executar as instruções `INSERT`, `SELECT`, `UPDATE` e `DELETE` nela, da mesma forma que faria com qualquer outra tabela MySQL.

Também é possível especificar se uma coluna individual será armazenada no disco ou na memória usando uma cláusula `STORAGE` como parte da definição da coluna em uma instrução `CREATE TABLE` ou `ALTER TABLE`. `STORAGE DISK` faz com que a coluna seja armazenada no disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. Consulte a Seção 15.1.24, “Instrução CREATE TABLE”, para obter mais informações.

Você pode obter informações sobre os arquivos de dados de disco `NDB` e os arquivos de log de desfazer recém-criados consultando a tabela `FILES` no banco de dados `INFORMATION_SCHEMA`, como mostrado aqui:

```
mysql> SELECT
              FILE_NAME AS File, FILE_TYPE AS Type,
              TABLESPACE_NAME AS Tablespace, TABLE_NAME AS Name,
              LOGFILE_GROUP_NAME AS 'File group',
              FREE_EXTENTS AS Free, TOTAL_EXTENTS AS Total
          FROM INFORMATION_SCHEMA.FILES
          WHERE ENGINE='ndbcluster';
+--------------+----------+------------+------+------------+------+---------+
| File         | Type     | Tablespace | Name | File group | Free | Total   |
+--------------+----------+------------+------+------------+------+---------+
| ./undo_1.log | UNDO LOG | lg_1       | NULL | lg_1       |    0 | 4194304 |
| ./undo_2.log | UNDO LOG | lg_1       | NULL | lg_1       |    0 | 3145728 |
| ./data_1.dat | DATAFILE | ts_1       | NULL | lg_1       |   32 |      32 |
| ./data_2.dat | DATAFILE | ts_1       | NULL | lg_1       |   48 |      48 |
+--------------+----------+------------+------+------------+------+---------+
4 rows in set (0.00 sec)
```

Para obter mais informações e exemplos, consulte a Seção 28.3.15, “A Tabela INFORMATION\_SCHEMA FILES”.

**Indexação de colunas armazenadas implicitamente no disco.** Para a tabela `dt_1` conforme definida no exemplo mostrado anteriormente, apenas as colunas `dob` e `joined` são armazenadas no disco. Isso ocorre porque há índices nas colunas `id`, `last_name` e `first_name`, e, portanto, os dados pertencentes a essas colunas são armazenados na RAM. Apenas colunas não indexadas podem ser mantidas no disco; índices e dados de colunas indexadas continuam sendo armazenados na memória. Esse trade-off entre o uso de índices e a conservação da RAM é algo que você deve ter em mente ao projetar tabelas de Dados de Disco.

Você não pode adicionar um índice a uma coluna que tenha sido explicitamente declarada como `STORAGE DISK`, sem primeiro alterar seu tipo de armazenamento para `MEMORY`; qualquer tentativa de fazê-lo falha com um erro. Uma coluna que *implicitamente* usa armazenamento no disco pode ser indexada; quando isso é feito, o tipo de armazenamento da coluna é alterado para `MEMORY` automaticamente. Por "implicitamente", queremos dizer uma coluna cujo tipo de armazenamento não é declarado, mas que é herdada da tabela pai. Na seguinte instrução CREATE TABLE (usando o tablespace `ts_1` definido anteriormente), as colunas `c2` e `c3` usam armazenamento no disco implicitamente:

```
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

Como `c2`, `c3` e `c4` não são declarados com `STORAGE DISK`, é possível indexá-los. Aqui, adicionamos índices a `c2` e `c3`, usando, respectivamente, `CREATE INDEX` e `ALTER TABLE`:

```
mysql> CREATE INDEX i1 ON ti(c2);
Query OK, 0 rows affected (2.72 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE ti ADD INDEX i2(c3);
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

`SHOW CREATE TABLE` confirma que os índices foram adicionados.

```
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
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Você pode ver usando **ndb\_desc** que as colunas indexadas (texto em destaque) agora usam armazenamento em memória em vez de armazenamento no disco:

```
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
```

**Observação de desempenho.** O desempenho de um clúster que utiliza o armazenamento de Dados de disco é significativamente melhorado se os arquivos de Dados de disco forem mantidos em um disco físico separado do sistema de arquivos do nó de dados. Isso deve ser feito para cada nó de dados no clúster para obter qualquer benefício perceptível.

Você pode usar caminhos de sistema de arquivos absolutos e relativos com `ADD UNDOFILE` e `ADD DATAFILE`; os caminhos relativos são calculados em relação ao diretório de dados do nó de dados.

Um grupo de arquivos de log, um espaço de tabelas e quaisquer tabelas de Dados de disco que utilizem esses devem ser criados em uma ordem específica. Isso também é válido para a remoção desses objetos, sujeito às seguintes restrições:

* Um grupo de arquivos de log não pode ser removido enquanto qualquer espaço de tabelas o utilizar.

* Um espaço de tabelas não pode ser removido enquanto ele contiver quaisquer arquivos de dados.

* Você não pode remover quaisquer arquivos de dados de um espaço de tabelas enquanto houver tabelas que os utilizam.

* Não é possível remover arquivos criados em associação com um espaço de tabelas diferente daquele com o qual os arquivos foram criados.

Por exemplo, para remover todos os objetos criados até agora nesta seção, você pode usar as seguintes instruções:

```
mysql> DROP TABLE dt_1;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_2.dat';

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_1.dat';

mysql> DROP TABLESPACE ts_1;

mysql> DROP LOGFILE GROUP lg_1;
```

Essas instruções devem ser executadas na ordem mostrada, exceto que as duas instruções `ALTER TABLESPACE ... DROP DATAFILE` podem ser executadas em qualquer ordem.