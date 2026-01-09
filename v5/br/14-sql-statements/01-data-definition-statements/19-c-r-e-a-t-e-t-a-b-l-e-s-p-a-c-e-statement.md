### 13.1.19 Declaração CREATE TABLESPACE

```sql
CREATE TABLESPACE tablespace_name

  InnoDB and NDB:
    ADD DATAFILE 'file_name'

  InnoDB only:
    [FILE_BLOCK_SIZE = value]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [AUTOEXTEND_SIZE [=] autoextend_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]
```

Esta declaração é usada para criar um espaço de tabela. A sintaxe e a semântica precisas dependem do motor de armazenamento utilizado. Nas versões padrão do MySQL 5.7, este é sempre um espaço de tabela de `InnoDB`. O MySQL NDB Cluster 7.5 também suporta espaços de tabela usando o motor de armazenamento `NDB`, além daqueles que usam `InnoDB`.

- Considerações para InnoDB
- Considerações para o NDB Cluster
- Opções
- Notas
- Exemplos do InnoDB
- Exemplo do NDB

#### Considerações sobre o InnoDB

A sintaxe `CREATE TABLESPACE` é usada para criar espaços de tabelas gerais. Um espaço de tabela geral é um espaço de tabela compartilhado. Ele pode conter múltiplas tabelas e suporta todos os formatos de linha de tabela. Espaços de tabelas gerais podem ser criados em um local relativo ao diretório de dados ou independentemente dele.

Após criar um espaço de tabelas geral `InnoDB`, você pode usar `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` (create-table.html) ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` (alter-table.html) para adicionar tabelas ao espaço de tabelas. Para mais informações, consulte Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

#### Considerações para o NDB Cluster

Esta declaração é usada para criar um espaço de tabelas, que pode conter um ou mais arquivos de dados, fornecendo espaço de armazenamento para tabelas de dados do disco do NDB Cluster (consulte Seção 21.6.11, “Tabelas de Dados do Disco do NDB Cluster”). Um arquivo de dados é criado e adicionado ao espaço de tabelas usando esta declaração. Arquivos de dados adicionais podem ser adicionados ao espaço de tabelas usando a declaração `ALTER TABLESPACE` (consulte Seção 13.1.9, “Declaração ALTER TABLESPACE”).

Nota

Todos os objetos de disco de dados do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto de dados de disco* deve ter um nome único (e não apenas cada objeto de dados de disco de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de log com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Um grupo de arquivo de registro de um ou mais arquivos de registro `UNDO` deve ser atribuído ao tablespace que será criado com a cláusula `USE LOGFILE GROUP`. *`logfile_group`* deve ser um grupo de arquivo de registro existente criado com `CREATE LOGFILE GROUP` (veja Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”). Vários tablespaces podem usar o mesmo grupo de arquivo de registro para o registro `UNDO`.

Ao definir `EXTENT_SIZE` ou `INITIAL_SIZE`, você pode, opcionalmente, seguir o número com uma abreviação de uma letra para indicar a ordem de grandeza, semelhante às usadas no `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

`INITIAL_SIZE` e `EXTENT_SIZE` estão sujeitos a arredondamento da seguinte forma:

- `EXTENT_SIZE` é arredondado para o múltiplo inteiro mais próximo de 32K.

- `INITIAL_SIZE` é arredondado *para baixo* para o múltiplo inteiro mais próximo de 32K; esse resultado é arredondado para cima para o múltiplo inteiro mais próximo de `EXTENT_SIZE` (após qualquer arredondamento).

Nota

O `NDB` reserva 4% de um espaço de tabela para operações de reinício do nó de dados. Esse espaço reservado não pode ser usado para armazenamento de dados. Essa restrição se aplica a partir do NDB 7.6.

A arredondagem descrita acima é feita explicitamente, e o MySQL Server emite uma mensagem de aviso quando qualquer arredondamento é realizado. Os valores arredondados também são usados pelo kernel NDB para calcular os valores das colunas do Schema de Informações `FILES` e para outros fins. No entanto, para evitar um resultado inesperado, sugerimos que você sempre use múltiplos inteiros de 32K ao especificar essas opções.

Quando o comando `CREATE TABLESPACE` é usado com `ENGINE [=] NDB`, um espaço de tabelas e o arquivo de dados associado são criados em cada nó de dados do cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`. (Veja o exemplo mais adiante nesta seção.)

(Veja Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.)

#### Opções

- `ADD DATAFILE`: Define o nome de um arquivo de dados de um tablespace; esta opção é sempre necessária. O `file_name`, incluindo qualquer caminho especificado, deve ser citado com aspas simples ou duplas. Os nomes de arquivos (não contando a extensão do arquivo) e os nomes de diretórios devem ter pelo menos um byte de comprimento. Nomes de arquivos e nomes de diretórios de comprimento zero não são suportados.

  Como há diferenças consideráveis na forma como o `InnoDB` e o `NDB` tratam os arquivos de dados, os dois motores de armazenamento são abordados separadamente na discussão a seguir.

  **Arquivos de dados do InnoDB.** Um espaço de tabela do InnoDB suporta apenas um único arquivo de dados, cujo nome deve incluir a extensão `.ibd`.

  Para um espaço de tabelas `InnoDB`, o arquivo de dados é criado por padrão no diretório de dados do MySQL (`datadir`). Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão.

  Quando um espaço de tabelas `InnoDB` é criado fora do diretório de dados, um arquivo isl é criado no diretório de dados. Para evitar conflitos com espaços de tabelas criados implicitamente por arquivo por tabela, a criação de um espaço de tabelas `InnoDB` geral em um subdiretório sob o diretório de dados não é suportada. Ao criar um espaço de tabelas `InnoDB` fora do diretório de dados, o diretório deve existir antes de criar o espaço de tabelas.

  Nota

  No MySQL 5.7, a opção `ALTER TABLESPACE` não é suportada pelo `InnoDB`.

  **Arquivos de dados NDB.** Um espaço de tabelas `NDB` suporta vários arquivos de dados que podem ter nomes de arquivo legais; mais arquivos de dados podem ser adicionados a um espaço de tabelas NDB Cluster após sua criação usando uma instrução `ALTER TABLESPACE` (alter-tablespace.html).

  Um arquivo de dados do espaço de tabela `NDB` é criado por padrão no diretório do sistema de arquivos do nó de dados, ou seja, o diretório denominado `ndb_nodeid_fs/TS` sob o diretório de dados do nó de dados (`DataDir`), onde *`nodeid`* é o `NodeId` do nó de dados. Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão. Se o diretório especificado não existir, o `NDB` tentará criá-lo; a conta de usuário do sistema sob a qual o processo do nó de dados está em execução deve ter as permissões apropriadas para fazer isso.

  Nota

  Ao determinar o caminho usado para um arquivo de dados, o `NDB` não expande o caractere `~` (tilde).

  Quando vários nós de dados são executados no mesmo host físico, as seguintes considerações se aplicam:

  - Você não pode especificar um caminho absoluto ao criar um arquivo de dados.

  - Não é possível criar arquivos de dados do espaço de tabela fora do diretório do sistema de arquivos do nó de dados, a menos que cada nó de dados tenha um diretório de dados separado.

  - Se cada nó de dados tiver seu próprio diretório de dados, os arquivos de dados podem ser criados em qualquer lugar dentro desse diretório.

  - Se cada nó de dados tiver seu próprio diretório de dados, também é possível criar um arquivo de dados fora do diretório de dados do nó usando um caminho relativo, desde que esse caminho resolva para um local único no sistema de arquivos do host para cada nó de dados que esteja em execução nesse host.

- `FILE_BLOCK_SIZE`: Esta opção, que é específica do `InnoDB` e é ignorada pelo `NDB`, define o tamanho do bloco para o arquivo de dados do espaço de tabelas. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um tamanho de bloco de arquivo de 8 kilobytes pode ser especificado como 8192 ou 8K. Se você não especificar esta opção, `FILE_BLOCK_SIZE` terá o valor padrão da variável `[innodb_page_size]` (innodb-parameters.html#sysvar_innodb_page_size). `FILE_BLOCK_SIZE` é necessário quando você pretende usar o espaço de tabelas para armazenar tabelas `InnoDB` compactadas (`ROW_FORMAT=COMPRESSED`). Nesse caso, você deve definir o `FILE_BLOCK_SIZE` do espaço de tabelas ao criar o espaço de tabelas.

  Se `FILE_BLOCK_SIZE` for igual ao valor de `innodb_page_size`, o espaço de tabelas pode conter apenas tabelas com um formato de linha não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC`). As tabelas com um formato de linha `COMPRESSED` têm um tamanho de página físico diferente dos tabelas não compactadas. Portanto, as tabelas compactadas não podem coexistir no mesmo espaço de tabelas que as tabelas não compactadas.

  Para que um espaço de tabela geral possa conter tabelas compactadas, o valor `FILE_BLOCK_SIZE` deve ser especificado, e o valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor de `innodb_page_size`. Além disso, o tamanho de página físico da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16K`, e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

- `USE LOGFILE GROUP`: Requerido para `NDB`, este é o nome de um grupo de arquivo de log criado anteriormente usando `CREATE LOGFILE GROUP`. Não é suportado para `InnoDB`, onde falha com um erro.

- `EXTENT_SIZE`: Esta opção é específica do NDB e não é suportada pelo InnoDB, onde falha com um erro. `EXTENT_SIZE` define o tamanho, em bytes, dos extents usados por quaisquer arquivos pertencentes ao espaço de tabelas. O valor padrão é de 1M. O tamanho mínimo é de 32K e o tamanho máximo teórico é de 2G, embora o tamanho máximo prático dependa de vários fatores. Na maioria dos casos, alterar o tamanho do extent não tem nenhum efeito mensurável no desempenho, e o valor padrão é recomendado para todas as situações, exceto as mais incomuns.

  Uma extensão é uma unidade de alocação de espaço em disco. Uma extensão é preenchida com tantos dados quanto essa extensão pode conter antes que outra extensão seja usada. Teoricamente, até 65.535 (64K) extensões podem ser usadas por arquivo de dados; no entanto, o tamanho máximo recomendado é de 32.768 (32K). O tamanho máximo recomendado para um único arquivo de dados é de 32G — ou seja, 32K extensões × 1 MB por extensão. Além disso, uma vez que uma extensão é alocada a uma partição específica, ela não pode ser usada para armazenar dados de uma partição diferente; uma extensão não pode armazenar dados de mais de uma partição. Isso significa, por exemplo, que um espaço de tabelas que tem um único arquivo de dados cujo `INITIAL_SIZE` (descrito no item seguinte) é de 256 MB e cujo `EXTENT_SIZE` é de 128M tem apenas duas extensões, e, portanto, pode ser usado para armazenar dados de, no máximo, duas partições diferentes da tabela de dados do disco.

  Você pode ver quantos extenções permanecem livres em um arquivo de dados específico consultando a tabela do esquema de informações `FILES` e, assim, obter uma estimativa de quanto espaço ainda está livre no arquivo. Para mais discussões e exemplos, consulte Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.

- `INITIAL_SIZE`: Esta opção é específica para `NDB` e não é suportada por `InnoDB`, onde ela falha com um erro.

  O parâmetro `INITIAL_SIZE` define o tamanho total em bytes do arquivo de dados que foi especificado usando `ADD DATATFILE`. Uma vez que esse arquivo tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao tablespace usando `ALTER TABLESPACE ... ADD DATAFILE`.

  `INITIAL_SIZE` é opcional; seu valor padrão é 134217728 (128 MB).

  Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB).

- `AUTOEXTEND_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 5.7 ou do MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

- `MAX_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 5.7 ou do MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

- `NODEGROUP`: Atualmente ignorado pelo MySQL; reservado para uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou do MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

- `WAIT`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 5.7 ou do MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

- `COMMENT`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 5.7 ou do MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

- `ENGINE`: Define o motor de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do motor de armazenamento. Atualmente, apenas o motor de armazenamento `InnoDB` é suportado pelas versões padrão do MySQL 5.7. O MySQL NDB Cluster 7.5 suporta tanto os tablespace `NDB` quanto `InnoDB`. O valor da variável de sistema `default_storage_engine` é usado para `ENGINE` se a opção não for especificada.

#### Notas

- Para as regras que cobrem o nome dos espaços de tabelas do MySQL, consulte Seção 9.2, “Nomes de Objetos do Esquema”. Além dessas regras, o caractere barra (“/”) não é permitido, e você também não pode usar nomes que comecem com `innodb_`, pois esse prefixo é reservado para uso do sistema.

- Os espaços de tabela não suportam tabelas temporárias.

- Os parâmetros `innodb_file_per_table`, `innodb_file_format` e `innodb_file_format_max` não têm influência nas operações de `CREATE TABLESPACE`. O `innodb_file_per_table` não precisa ser habilitado. Os espaços de tabelas gerais suportam todos os formatos de linha de tabela, independentemente das configurações do formato de arquivo. Da mesma forma, os espaços de tabelas gerais suportam a adição de tabelas de qualquer formato de linha usando `CREATE TABLE ... TABLESPACE`, independentemente das configurações do formato de arquivo.

- O `innodb_strict_mode` não é aplicável a espaços de tabelas gerais. As regras de gerenciamento de espaços de tabelas são rigorosamente aplicadas independentemente do `innodb_strict_mode`. Se os parâmetros de `CREATE TABLESPACE` estiverem incorretos ou incompatíveis, a operação falhará, independentemente da configuração do `innodb_strict_mode`. Quando uma tabela é adicionada a um espaço de tabelas geral usando `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`, o `innodb_strict_mode` é ignorado, mas a instrução é avaliada como se o `innodb_strict_mode` estivesse habilitado.

- Use `DROP TABLESPACE` para remover um tablespace. Todas as tabelas devem ser removidas de um tablespace usando `DROP TABLE` antes de remover o tablespace. Antes de remover um tablespace de NDB Cluster, você também deve remover todos os seus arquivos de dados usando uma ou mais instruções `ALTER TABLESPACE ... DROP DATATFILE`. Veja Seção 21.6.11.1, “Objetos de dados de disco de NDB Cluster”.

- Todas as partes de uma tabela `InnoDB` adicionada a um espaço de tabela geral `InnoDB` residem no espaço de tabela geral, incluindo índices e páginas de `BLOB` (blob.html).

  Para uma tabela `NDB` atribuída a um espaço de tabelas, apenas as colunas que não estão indexadas são armazenadas em disco e, na verdade, utilizam os arquivos de dados do espaço de tabelas. Os índices e as colunas indexadas de todas as tabelas `NDB` são mantidos sempre na memória.

- Assim como as tabelas de sistema, o truncar ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados geral do IBД .ibd, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

- Um espaço de tabela geral não está associado a nenhum banco de dados ou esquema.

- `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

- O servidor utiliza o bloqueio de metadados de nível de tablespace para DDL que faz referência a tablespaces gerais. Em comparação, o servidor utiliza o bloqueio de metadados de nível de tabela para DDL que faz referência a tablespaces por arquivo por tabela.

- Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

- As tabelas armazenadas em um espaço de tabelas geral só podem ser abertas no MySQL 5.7.6 ou versões posteriores devido à adição de novos indicadores de tabela.

- Não há conflito entre os nomes de tablespace gerais e os nomes de tablespace por arquivo para tabela. O caractere “/”, que está presente nos nomes de tablespace por arquivo para tabela, não é permitido nos nomes de tablespace gerais.

- **mysqldump** e **mysqlpump** não fazem o dump das instruções `CREATE TABLESPACE` do InnoDB.

#### Exemplos de InnoDB

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de três tabelas não compactadas de diferentes formatos de linhas.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela compactada. O exemplo assume um valor padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

#### Exemplo do NDB

Suponha que você queira criar um espaço de dados de tabela de NDB Cluster Disk chamado `myts` usando um arquivo de dados chamado `mydata-1.dat`. Um espaço de tabela `NDB` sempre requer o uso de um grupo de arquivos de log que consiste em um ou mais arquivos de log de desfazer. Para este exemplo, primeiro criamos um grupo de arquivos de log chamado `mylg` que contém um arquivo de log longo de desfazer chamado `myundo-1.dat`, usando a instrução `CREATE LOGFILE GROUP` mostrada aqui:

```sql
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Agora você pode criar o espaço de tabelas descrito anteriormente usando a seguinte declaração:

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

Agora você pode criar uma tabela de dados de disco usando uma instrução `CREATE TABLE` com as opções `TABLESPACE` e `STORAGE DISK`, semelhante ao que está mostrado aqui:

```sql
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

É importante notar que apenas as colunas `dob` e `joined` da `mytable` são armazenadas no disco, devido ao fato de que as colunas `id`, `lname` e `fname` estão todas indexadas.

Como mencionado anteriormente, quando o comando `CREATE TABLESPACE` é usado com `ENGINE [=] NDB`, um espaço de tabelas e o arquivo de dados associado são criados em cada nó de dados do cluster NDB. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`, conforme mostrado aqui:

```sql
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

Para obter informações adicionais e exemplos, consulte Seção 21.6.11.1, “Objetos de dados de disco do cluster NDB”.
