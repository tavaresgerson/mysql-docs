### 15.1.21 Declaração CREATE TABLESPACE

```
CREATE [UNDO] TABLESPACE tablespace_name

  InnoDB and NDB:
    [ADD DATAFILE 'file_name']
    [AUTOEXTEND_SIZE [=] value]

  InnoDB only:
    [FILE_BLOCK_SIZE = value]
    [ENCRYPTION [=] {'Y' | 'N'}]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]

  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

Esta declaração é usada para criar um espaço de tabela. A sintaxe e a semântica precisas dependem do mecanismo de armazenamento utilizado. Nas versões padrão do MySQL, este é sempre um espaço de tabela `InnoDB`. O MySQL NDB Cluster também suporta espaços de tabela usando o mecanismo de armazenamento `NDB`.

- Considerações sobre o InnoDB
- Considerações para o NDB Cluster
- Opções
- Notas
- Exemplos de InnoDB
- Exemplo do NDB

#### Considerações sobre o InnoDB

A sintaxe `CREATE TABLESPACE` é usada para criar espaços de tabelas gerais ou espaços de tabelas de desfazer. A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, deve ser especificada para criar um espaço de tabelas de desfazer.

Um espaço de tabela geral é um espaço de tabela compartilhado. Ele pode armazenar múltiplas tabelas e suporta todos os formatos de linha de tabela. Os espaços de tabela gerais podem ser criados em um local relativo ao diretório de dados ou independentemente dele.

Após criar um espaço de tabela geral `InnoDB`, use `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` para adicionar tabelas ao espaço de tabela. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

Os espaços de tabelas de desfazer contêm registros de desfazer. Os espaços de tabelas de desfazer podem ser criados em um local escolhido, especificando um caminho de arquivo de dados totalmente qualificado. Para obter mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabelas de Desfazer”.

#### Considerações para o NDB Cluster

Esta declaração é usada para criar um espaço de tabelas, que pode conter um ou mais arquivos de dados, fornecendo espaço de armazenamento para tabelas de dados do disco do NDB Cluster (consulte a Seção 25.6.11, “Tabelas de Dados do Disco do NDB Cluster”). Um arquivo de dados é criado e adicionado ao espaço de tabelas usando esta declaração. Arquivos de dados adicionais podem ser adicionados ao espaço de tabelas usando a declaração `ALTER TABLESPACE` (consulte a Seção 15.1.10, “Declaração ALTER TABLESPACE”).

Nota

Todos os objetos de disco de dados do NDB Cluster compartilham o mesmo namespace. Isso significa que *cada objeto de dados de disco* deve ter um nome único (e não apenas cada objeto de dados de disco de um determinado tipo). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de log com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Um grupo de arquivo de registro de um ou mais arquivos de registro `UNDO` deve ser atribuído ao tablespace que será criado com a cláusula `USE LOGFILE GROUP`. `logfile_group` deve ser um grupo de arquivo de registro existente criado com `CREATE LOGFILE GROUP` (consulte a Seção 15.1.16, “Instrução CREATE LOGFILE GROUP”). Vários tablespaces podem usar o mesmo grupo de arquivo de registro para o registro `UNDO`.

Ao definir `EXTENT_SIZE` ou `INITIAL_SIZE`, você pode, opcionalmente, seguir o número com uma abreviação de uma letra para indicar a ordem de grandeza, semelhante às usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

`INITIAL_SIZE` e `EXTENT_SIZE` estão sujeitos à arredondagem da seguinte forma:

- `EXTENT_SIZE` é arredondado para o múltiplo inteiro mais próximo de 32K.

- `INITIAL_SIZE` é arredondado *para baixo* para o múltiplo inteiro mais próximo de 32K; esse resultado é arredondado para cima para o múltiplo inteiro mais próximo de `EXTENT_SIZE` (após qualquer arredondamento).

Nota

O `NDB` reserva 4% de um espaço de tabela para operações de reinício do nó de dados. Esse espaço reservado não pode ser usado para armazenamento de dados.

A arredondagem descrita acima é feita explicitamente, e o MySQL Server emite uma mensagem de aviso quando qualquer arredondamento é realizado. Os valores arredondados também são usados pelo kernel NDB para calcular os valores da coluna `INFORMATION_SCHEMA.FILES` e para outros fins. No entanto, para evitar um resultado inesperado, sugerimos que você sempre use múltiplos inteiros de 32K ao especificar essas opções.

Quando `CREATE TABLESPACE` é usado com `ENGINE [=] NDB`, um espaço de tabelas e o arquivo de dados associado são criados em cada nó de dados do cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`. (Veja o exemplo mais adiante nesta seção.)

(Veja a Seção 28.3.15, “A Tabela INFORMATION\_SCHEMA FILES”.)

#### Opções

- `ADD DATAFILE`: Define o nome de um arquivo de dados de um espaço de tabelas. Esta opção é sempre necessária ao criar um espaço de tabelas `NDB`; para `InnoDB` no MySQL 8.0.14 e versões posteriores, é necessária apenas ao criar um espaço de tabelas de desfazer. O `file_name`, incluindo qualquer caminho especificado, deve ser citado com aspas simples ou duplas. Os nomes de arquivos (excluindo a extensão do arquivo) e os nomes de diretórios devem ter pelo menos um byte de comprimento. Nomes de arquivos e diretórios de comprimento zero não são suportados.

  Como há diferenças consideráveis na forma como os arquivos de dados são tratados pelo `InnoDB` e pelo `NDB`, os dois motores de armazenamento são abordados separadamente na discussão a seguir.

  **Arquivos de dados do InnoDB.** Um espaço de tabelas `InnoDB` suporta apenas um único arquivo de dados, cujo nome deve incluir a extensão `.ibd`.

  Para colocar um arquivo de dados de espaço de tabelas geral `InnoDB` em um local fora do diretório de dados, inclua um caminho totalmente qualificado ou um caminho relativo ao diretório de dados. Apenas um caminho totalmente qualificado é permitido para espaços de tabelas de desfazer. Se você não especificar um caminho, um espaço de tabela geral é criado no diretório de dados. Um espaço de tabela de desfazer criado sem especificar um caminho é criado no diretório definido pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` estiver indefinida, espaços de tabelas de desfazer são criados no diretório de dados.

  Para evitar conflitos com os espaços de tabela criados implicitamente por arquivo, a criação de um espaço de tabela geral `InnoDB` em um subdiretório sob o diretório de dados não é suportada. Ao criar um espaço de tabela geral ou um espaço de desfazer fora do diretório de dados, o diretório deve existir e deve ser conhecido pelo `InnoDB` antes de criar o espaço de tabela. Para tornar um diretório conhecido pelo `InnoDB`, adicione-o ao valor `innodb_directories` ou a uma das variáveis cujos valores são anexados ao valor `innodb_directories`. `innodb_directories` é uma variável de leitura somente. Configurar isso requer reiniciar o servidor.

  Se a cláusula `ADD DATAFILE` não for especificada ao criar um espaço de tabelas `InnoDB`, um arquivo de dados do espaço de tabelas com um nome de arquivo único é criado implicitamente. O nome de arquivo único é um UUID de 128 bits formatado em cinco grupos de números hexadecimais separados por traços (`aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`). Uma extensão de arquivo é adicionada, se necessário, pelo motor de armazenamento. Uma extensão de arquivo `.ibd` é adicionada para arquivos de dados de espaço de tabelas gerais `InnoDB`. Em um ambiente de replicação, o nome do arquivo de dados criado no servidor de origem da replicação não é o mesmo que o nome do arquivo de dados criado na replica.

  A partir do MySQL 8.0.17, a cláusula `ADD DATAFILE` não permite referências de diretório circulares ao criar um espaço de tabela `InnoDB`. Por exemplo, a referência de diretório circular (`/../`) na seguinte declaração não é permitida:

  ```
  CREATE TABLESPACE ts1 ADD DATAFILE ts1.ibd 'any_directory/../ts1.ibd';
  ```

  Uma exceção a essa restrição existe no Linux, onde uma referência circular de diretório é permitida se o diretório anterior for um link simbólico. Por exemplo, o caminho do arquivo de dados no exemplo acima é permitido se `any_directory` for um link simbólico. (Ainda é permitido que os caminhos dos arquivos de dados comecem com '`../`'.)

  **Arquivos de dados do NDB.** Um espaço de tabelas `NDB` suporta vários arquivos de dados que podem ter nomes de arquivo legais; mais arquivos de dados podem ser adicionados a um espaço de tabelas do NDB Cluster após sua criação usando uma instrução `ALTER TABLESPACE`.

  Um arquivo de dados do espaço de tabelas `NDB` é criado por padrão no diretório do sistema de arquivos do nó de dados, ou seja, o diretório denominado `ndb_nodeid_fs/TS` sob o diretório de dados do nó de dados (`DataDir`), onde `nodeid` é o `NodeId` do nó de dados. Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão. Se o diretório especificado não existir, o `NDB` tentará criá-lo; a conta de usuário do sistema sob a qual o processo do nó de dados está em execução deve ter as permissões apropriadas para fazer isso.

  Nota

  Ao determinar o caminho usado para um arquivo de dados, o `NDB` não expande o caractere `~` (tilde).

  Quando vários nós de dados são executados no mesmo host físico, as seguintes considerações se aplicam:

  - Você não pode especificar um caminho absoluto ao criar um arquivo de dados.

  - Não é possível criar arquivos de dados do espaço de tabela fora do diretório do sistema de arquivos do nó de dados, a menos que cada nó de dados tenha um diretório de dados separado.

  - Se cada nó de dados tiver seu próprio diretório de dados, os arquivos de dados podem ser criados em qualquer lugar dentro desse diretório.

  - Se cada nó de dados tiver seu próprio diretório de dados, também é possível criar um arquivo de dados fora do diretório de dados do nó usando um caminho relativo, desde que esse caminho resolva para um local único no sistema de arquivos do host para cada nó de dados que esteja em execução nesse host.

- `FILE_BLOCK_SIZE`: Esta opção — que é específica para os `InnoDB` espaços de tabela gerais e é ignorada pelo `NDB` — define o tamanho do bloco para o arquivo de dados do espaço de tabela. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um tamanho de bloco de arquivo de 8 kilobytes pode ser especificado como 8192 ou 8K. Se você não especificar esta opção, o `FILE_BLOCK_SIZE` terá o valor padrão do `innodb_page_size`. O `FILE_BLOCK_SIZE` é necessário quando você pretende usar o espaço de tabela para armazenar tabelas `InnoDB` comprimidas (`ROW_FORMAT=COMPRESSED`). Neste caso, você deve definir o espaço de tabela `FILE_BLOCK_SIZE` ao criar o espaço de tabela.

  Se `FILE_BLOCK_SIZE` for igual ao valor de `innodb_page_size`, o tablespace pode conter apenas tabelas com um formato de linha não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC`). As tabelas com um formato de linha `COMPRESSED` têm um tamanho de página físico diferente dos tabelas não compactadas. Portanto, tabelas compactadas não podem coexistir no mesmo tablespace com tabelas não compactadas.

  Para que um espaço de tabela geral contenha tabelas compactadas, deve ser especificado `FILE_BLOCK_SIZE`, e o valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor `innodb_page_size`. Além disso, o tamanho de página física da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16K` e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

- `USE LOGFILE GROUP`: Requerido para `NDB`, este é o nome de um grupo de arquivos de registro criado anteriormente usando `CREATE LOGFILE GROUP`. Não é suportado para `InnoDB`, onde falha com um erro.

- `EXTENT_SIZE`: Esta opção é específica para o NDB e não é suportada pelo InnoDB, onde falha com um erro. `EXTENT_SIZE` define o tamanho, em bytes, dos extensões usados por quaisquer arquivos pertencentes ao espaço de tabelas. O valor padrão é de 1M. O tamanho mínimo é de 32K e o tamanho máximo teórico é de 2G, embora o tamanho máximo prático dependa de vários fatores. Na maioria dos casos, alterar o tamanho da extensão não tem nenhum efeito mensurável no desempenho, e o valor padrão é recomendado para todas as situações, exceto as mais incomuns.

  Uma extensão é uma unidade de alocação de espaço em disco. Uma extensão é preenchida com tantos dados quanto essa extensão pode conter antes que outra extensão seja usada. Teoricamente, até 65.535 (64K) extensões podem ser usadas por arquivo de dados; no entanto, o tamanho máximo recomendado é de 32.768 (32K). O tamanho máximo recomendado para um único arquivo de dados é de 32G — ou seja, 32K extensões × 1 MB por extensão. Além disso, uma vez que uma extensão é alocada a uma partição específica, ela não pode ser usada para armazenar dados de uma partição diferente; uma extensão não pode armazenar dados de mais de uma partição. Isso significa, por exemplo, que um espaço de tabelas que tem um único arquivo de dados cujo `INITIAL_SIZE` (descrito no item seguinte) é de 256 MB e cujo `EXTENT_SIZE` é de 128M tem apenas duas extensões, e, portanto, pode ser usado para armazenar dados de, no máximo, duas partições diferentes da tabela de dados do disco.

  Você pode ver quantos extenções permanecem livres em um arquivo de dados específico consultando a tabela do esquema de informações `FILES` e, assim, obter uma estimativa de quanto espaço ainda está livre no arquivo. Para mais discussões e exemplos, consulte a Seção 28.3.15, “A Tabela INFORMATION\_SCHEMA FILES”.

- `INITIAL_SIZE`: Esta opção é específica para `NDB` e não é suportada por `InnoDB`, onde falha com um erro.

  O parâmetro `INITIAL_SIZE` define o tamanho total em bytes do arquivo de dados que foi especificado usando `ADD DATATFILE`. Uma vez que esse arquivo tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao tablespace usando `ALTER TABLESPACE ... ADD DATAFILE`.

  `INITIAL_SIZE` é opcional; seu valor padrão é 134217728 (128 MB).

  Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB).

- `AUTOEXTEND_SIZE`: Ignorado pelo MySQL antes do MySQL 8.0.23; A partir do MySQL 8.0.23, define a quantidade pela qual `InnoDB` estende o tamanho do tablespace quando ele fica cheio. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o tablespace seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND\_SIZE do Tablespace”.

  Não tem efeito em nenhuma versão do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

- `MAX_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

- `NODEGROUP`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

- `WAIT`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

- `COMMENT`: Atualmente ignorado pelo MySQL; reservado para uso futuro possível. Não tem efeito em nenhuma versão do MySQL 8.0 ou do MySQL NDB Cluster 8.0, independentemente do motor de armazenamento utilizado.

- A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para um espaço de tabelas geral `InnoDB`. O suporte à criptografia para espaços de tabelas gerais foi introduzido no MySQL 8.0.13.

  A partir do MySQL 8.0.16, se a cláusula `ENCRYPTION` não for especificada, o ajuste `default_table_encryption` controla se a criptografia está habilitada. A cláusula `ENCRYPTION` substitui o ajuste `default_table_encryption`. No entanto, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para usar um ajuste da cláusula `ENCRYPTION` que difere do ajuste da cláusula `default_table_encryption`.

  Um plugin de chave de fenda deve ser instalado e configurado antes que um espaço de tabela habilitado para criptografia possa ser criado.

  Quando um espaço de tabelas geral é criptografado, todas as tabelas que residem nesse espaço de tabelas são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabelas criptografado também é criptografada.

  Para obter mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”

- `ENGINE`: Define o mecanismo de armazenamento que utiliza o tablespace, onde `engine_name` é o nome do mecanismo de armazenamento. Atualmente, apenas o mecanismo de armazenamento `InnoDB` é suportado pelas versões padrão do MySQL 8.0. O MySQL NDB Cluster suporta tanto os tablespace `NDB` quanto os tablespace `InnoDB`. O valor da variável de sistema `default_storage_engine` é usado para `ENGINE` se a opção não for especificada.

- A opção `ENGINE_ATTRIBUTE` (disponível a partir do MySQL 8.0.21) é usada para especificar atributos do espaço de tabela para os motores de armazenamento primário. A opção é reservada para uso futuro.

  Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  Os valores `ENGINE_ATTRIBUTE` podem ser repetidos sem erros. Nesse caso, o último valor especificado é usado.

  Os valores de `ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

#### Notas

- Para as regras que cobrem o nome dos espaços de tabelas do MySQL, consulte a Seção 11.2, “Nomes de Objetos do Esquema”. Além dessas regras, o caractere barra (“/”) não é permitido, e você também não pode usar nomes que comecem com `innodb_`, pois esse prefixo é reservado para uso do sistema.

- A criação de tabelasespaces gerais temporárias não é suportada.

- Os espaços de tabela gerais não suportam tabelas temporárias.

- A opção `TABLESPACE` pode ser usada com `CREATE TABLE` ou `ALTER TABLE` para atribuir uma partição de tabela ou subpartição `InnoDB` a um espaço de tabelas por arquivo. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento. A atribuição de partições de tabela a espaços de tabelas compartilhados `InnoDB` não é suportada. Espaços de tabelas compartilhados incluem o espaço de tabelas do sistema `InnoDB` e espaços de tabelas gerais.

- Os espaços de tabelas gerais suportam a adição de tabelas de qualquer formato de linha usando `CREATE TABLE ... TABLESPACE`. `innodb_file_per_table` não precisa ser habilitado.

- `innodb_strict_mode` não é aplicável a espaços de tabelas gerais. As regras de gerenciamento de espaços de tabelas são rigorosamente aplicadas independentemente de `innodb_strict_mode`. Se os parâmetros de `CREATE TABLESPACE` estiverem incorretos ou incompatíveis, a operação falhará, independentemente da configuração de `innodb_strict_mode`. Quando uma tabela é adicionada a um espaço de tabelas geral usando `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`, `innodb_strict_mode` é ignorado, mas a declaração é avaliada como se `innodb_strict_mode` estivesse habilitado.

- Use `DROP TABLESPACE` para remover um espaço de tabelas. Todas as tabelas devem ser excluídas de um espaço de tabelas usando `DROP TABLE` antes de excluir o espaço de tabelas. Antes de excluir um espaço de tabelas NDB Cluster, você também deve remover todos os seus arquivos de dados usando uma ou mais instruções `ALTER TABLESPACE ... DROP DATATFILE`. Veja a Seção 25.6.11.1, “Objetos de Dados de Disco NDB Cluster”.

- Todas as partes de uma tabela `InnoDB` adicionada a um espaço de tabela geral `InnoDB` residem no espaço de tabela geral, incluindo índices e páginas `BLOB`.

  Para uma tabela `NDB` atribuída a um espaço de tabelas, apenas as colunas que não estão indexadas são armazenadas em disco e, na verdade, utilizam os arquivos de dados do espaço de tabelas. Os índices e as colunas indexadas para todas as tabelas `NDB` são mantidos sempre na memória.

- Assim como as tabelas de sistema, o truncar ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados .ibd do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

- Um espaço de tabela geral não está associado a nenhum banco de dados ou esquema.

- `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ...IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

- O servidor utiliza o bloqueio de metadados de nível de tablespace para DDL que faz referência a tablespaces gerais. Em comparação, o servidor utiliza o bloqueio de metadados de nível de tabela para DDL que faz referência a tablespaces por arquivo por tabela.

- Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

- Não há conflito entre os nomes de tablespace gerais e os nomes de tablespace por arquivo para tabela. O caractere “/”, que está presente nos nomes de tablespace por arquivo para tabela, não é permitido nos nomes de tablespace gerais.

- O **mysqldump** e o **mysqlpump** não fazem o dump das instruções `InnoDB` `CREATE TABLESPACE`.

#### Exemplos de InnoDB

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de três tabelas não compactadas de diferentes formatos de linhas.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela comprimida. O exemplo assume um valor padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Este exemplo demonstra a criação de um espaço de tabela geral sem especificar a cláusula `ADD DATAFILE`, que é opcional a partir do MySQL 8.0.14.

```
mysql> CREATE TABLESPACE `ts3` ENGINE=INNODB;
```

Este exemplo demonstra a criação de um espaço de tabelas para desfazer.

```
mysql> CREATE UNDO TABLESPACE undo_003 ADD DATAFILE 'undo_003.ibu';
```

#### Exemplo do NDB

Suponha que você queira criar um espaço de dados de tabela de NDB Cluster Disk chamado `myts` usando um arquivo de dados chamado `mydata-1.dat`. Um espaço de tabela `NDB` sempre requer o uso de um grupo de arquivos de log que consiste em um ou mais arquivos de log de desfazer. Para este exemplo, primeiro criamos um grupo de arquivos de log chamado `mylg` que contém um arquivo de log longo de desfazer chamado `myundo-1.dat`, usando a instrução `CREATE LOGFILE GROUP` mostrada aqui:

```
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Agora você pode criar o espaço de tabelas descrito anteriormente usando a seguinte declaração:

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

Agora você pode criar uma tabela de Dados de Disco usando uma declaração `CREATE TABLE` com as opções `TABLESPACE` e `STORAGE DISK`, de forma semelhante à mostrada aqui:

```
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

É importante notar que apenas as colunas `dob` e `joined` de `mytable` são armazenadas no disco, devido ao fato de que as colunas `id`, `lname` e `fname` estão todas indexadas.

Como mencionado anteriormente, quando o `CREATE TABLESPACE` é usado com o `ENGINE [=] NDB`, um espaço de tabelas e o arquivo de dados associado são criados em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles consultando a tabela do esquema de informações `FILES`, conforme mostrado aqui:

```
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

Para obter informações adicionais e exemplos, consulte a Seção 25.6.11.1, “Objetos de dados de disco de cluster NDB”.
