## 14.6 Estruturas de disco do InnoDB

Esta seção descreve as estruturas em disco `InnoDB` e tópicos relacionados.

### 14.6.1 Tabelas

Esta seção abrange tópicos relacionados às tabelas `InnoDB`.

#### 14.6.1.1 Criando tabelas InnoDB

As tabelas `InnoDB` são criadas usando a declaração `CREATE TABLE`; por exemplo:

```sql
CREATE TABLE t1 (a INT, b CHAR (20), PRIMARY KEY (a)) ENGINE=InnoDB;
```

A cláusula `ENGINE=InnoDB` não é necessária quando `InnoDB` é definido como o motor de armazenamento padrão, o que é o caso por padrão. No entanto, a cláusula `ENGINE` é útil se a declaração `CREATE TABLE` deve ser reexecutada em uma instância diferente do servidor MySQL onde o motor de armazenamento padrão não é `InnoDB` ou é desconhecido. Você pode determinar o motor de armazenamento padrão em uma instância do servidor MySQL executando a seguinte declaração:

```sql
mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

As tabelas `InnoDB` são criadas por padrão em espaços de tabela por arquivo. Para criar uma tabela `InnoDB` no espaço de tabela `InnoDB`, desative a variável `innodb_file_per_table` antes de criar a tabela. Para criar uma tabela `InnoDB` em um espaço de tabela geral, use a sintaxe `CREATE TABLE ... TABLESPACE`. Para mais informações, consulte a Seção 14.6.3, “Espaços de tabela”.

##### Arquivos .frm

O MySQL armazena informações do dicionário de dados para tabelas em arquivos .frm nos diretórios do banco de dados. Ao contrário de outros motores de armazenamento do MySQL, o `InnoDB` também codifica informações sobre a tabela em seu próprio dicionário de dados interno dentro do espaço de tabela do sistema. Quando o MySQL elimina uma tabela ou um banco de dados, ele exclui um ou mais arquivos `.frm` e as entradas correspondentes no dicionário de dados `InnoDB`. Você não pode mover tabelas `InnoDB` entre bancos simplesmente movendo os arquivos `.frm`. Para informações sobre mover tabelas `InnoDB`, consulte a Seção 14.6.1.4, “Movendo ou copiando tabelas InnoDB”.

##### Formatos de string

O formato de string de uma tabela `InnoDB` determina como suas strings são armazenadas fisicamente no disco. `InnoDB` suporta quatro formatos de string, cada um com diferentes características de armazenamento. Os formatos de string suportados incluem `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`. O formato de string `DYNAMIC` é o padrão. Para informações sobre as características dos formatos de string, consulte a Seção 14.11, “Formatos de string InnoDB”.

A variável `innodb_default_row_format` define o formato de string padrão. O formato de string de uma tabela também pode ser definido explicitamente usando a opção de tabela `ROW_FORMAT` em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Veja Definindo o Formato de String de uma Tabela.

##### Chaves primárias

Recomenda-se que você defina uma chave primária para cada tabela que você criar. Ao selecionar as colunas da chave primária, escolha as colunas com as seguintes características:

* Colunas que são referenciadas pelas consultas mais importantes. * Colunas que nunca ficam em branco. * Colunas que nunca têm valores duplicados. * Colunas que raramente, ou nunca, alteram seu valor uma vez inseridas.

Por exemplo, em uma tabela que contém informações sobre pessoas, você não criaria uma chave primária em `(firstname, lastname)`, porque mais de uma pessoa pode ter o mesmo nome, uma coluna de nome pode ser deixada em branco e, às vezes, as pessoas mudam seus nomes. Com tantas restrições, muitas vezes não há um conjunto óbvio de colunas para usar como chave primária, então você cria uma nova coluna com um ID numérico para servir como toda ou parte da chave primária. Você pode declarar uma coluna de auto-incremento para que os valores ascendentes sejam preenchidos automaticamente à medida que as strings são inseridas:

```sql
# The value of ID can act like a pointer between related items in different tables.
CREATE TABLE t5 (id INT AUTO_INCREMENT, b CHAR (20), PRIMARY KEY (id));

# The primary key can consist of more than one column. Any autoinc column must come first.
CREATE TABLE t6 (id INT AUTO_INCREMENT, a INT, b CHAR (20), PRIMARY KEY (id,a));
```

Para mais informações sobre colunas de autoincremento, consulte a Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”.

Embora uma tabela funcione corretamente sem definir uma chave primária, a chave primária está envolvida em muitos aspectos do desempenho e é um aspecto de design crucial para qualquer tabela grande ou frequentemente usada. É recomendável que você sempre especifique uma chave primária na declaração `CREATE TABLE`. Se você criar a tabela, carregar dados e, em seguida, executar `ALTER TABLE` para adicionar uma chave primária mais tarde, essa operação é muito mais lenta do que definir a chave primária ao criar a tabela. Para mais informações sobre chaves primárias, consulte a Seção 14.6.2.1, “Indekses Clusterados e Secundários”.

##### Visualizando Propriedades da Tabela InnoDB

Para visualizar as propriedades de uma tabela `InnoDB`, execute uma declaração `SHOW TABLE STATUS`.

```sql
mysql> SHOW TABLE STATUS FROM test LIKE 't%' \G;
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 0
      Data_free: 0
 Auto_increment: NULL
    Create_time: 2021-02-18 12:18:28
    Update_time: NULL
     Check_time: NULL
      Collation: utf8mb4_0900_ai_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Para informações sobre a saída de `SHOW TABLE STATUS`, consulte a Seção 13.7.5.36, “Declaração de Status da Tabela”.

Você também pode acessar as propriedades da tabela `InnoDB` fazendo uma consulta às tabelas do esquema de informação `InnoDB` do sistema:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 45
         NAME: test/t1
         FLAG: 1
       N_COLS: 5
        SPACE: 35
  FILE_FORMAT: Barracuda
   ROW_FORMAT: Dynamic
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single
```

Para mais informações, consulte a Seção 14.16.3, “Tabelas do esquema de informações InnoDB”.

#### 14.6.1.2 Criando tabelas externamente

Existem diferentes razões para criar tabelas `InnoDB` externamente, ou seja, criar tabelas fora do diretório de dados. Essas razões podem incluir gerenciamento de espaço, otimização de I/O ou colocação de tabelas em um dispositivo de armazenamento com características de desempenho ou capacidade específicas, por exemplo.

`InnoDB` suporta os seguintes métodos para criar tabelas externamente:

* Usando a cláusula DATA DIRECTORY
* Usando a sintaxe CREATE TABLE ... TABLESPACE
* Criando uma tabela em um espaço de tabelas geral externo

##### Usando a Cláusula de DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO DO DIREITO DE USO

Você pode criar uma tabela `InnoDB` em um diretório externo, especificando uma cláusula `DATA DIRECTORY` na declaração `CREATE TABLE`.

```sql
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

A cláusula `DATA DIRECTORY` é suportada para tabelas criadas em espaços de tabela por arquivo. As tabelas são criadas implicitamente em espaços de tabela por arquivo quando a variável `innodb_file_per_table` é habilitada, o que é o caso por padrão.

```sql
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

Para mais informações sobre os espaços de tabela por arquivo, consulte a Seção 14.6.3.2, “Espaços de tabela por arquivo”.

Certifique-se da localização do diretório que você escolheu, pois a cláusula `DATA DIRECTORY` não pode ser usada com `ALTER TABLE` para alterar a localização posteriormente.

Quando você especifica uma cláusula `DATA DIRECTORY` em uma declaração `CREATE TABLE`, o arquivo de dados da tabela (`table_name.ibd`) é criado em um diretório de esquema sob o diretório especificado, e um arquivo `.isl` (`table_name.isl`) que contém o caminho do arquivo de dados é criado no diretório de esquema sob o diretório de dados do MySQL. Um arquivo `.isl` é semelhante em função a um link simbólico. (Links simbólicos reais não são suportados para uso com arquivos de dados `InnoDB`.

O exemplo a seguir demonstra como criar uma tabela em um diretório externo usando a cláusula `DATA DIRECTORY`. Assume-se que a variável `innodb_file_per_table` esteja habilitada.

```sql
mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';

# MySQL creates the table's data file in a schema directory
# under the external directory

$> cd /external/directory/test
$> ls
t1.ibd

# An .isl file that contains the data file path is created
# in the schema directory under the MySQL data directory

$> cd /path/to/mysql/data/test
$> ls
db.opt  t1.frm  t1.isl
```

###### Notas de uso:

* O MySQL mantém inicialmente o arquivo de dados do espaço de tabela aberto, impedindo que você desmonte o dispositivo, mas pode eventualmente fechar o arquivo se o servidor estiver ocupado. Tenha cuidado para não desmontar acidentalmente um dispositivo externo enquanto o MySQL estiver em execução, ou iniciar o MySQL enquanto o dispositivo estiver desconectado. Tentar acessar uma tabela quando o arquivo de dados associado estiver ausente causa um erro grave que requer o reinício do servidor.

Um reinício do servidor pode falhar se o arquivo de dados não for encontrado no caminho esperado. Nesse caso, remova manualmente o arquivo `.isl` do diretório do esquema. Após o reinício, descarte a tabela para remover o arquivo `.frm` e as informações sobre a tabela do dicionário de dados.

* Antes de colocar uma tabela em um volume montado em NFS, revise os problemas potenciais descritos em Usar NFS com MySQL.

* Se estiver usando um instantâneo LVM, cópia de arquivo ou outro mecanismo baseado em arquivos para fazer backup do arquivo de dados da tabela, sempre use a declaração `FLUSH TABLES ... FOR EXPORT` primeiro para garantir que todas as alterações armazenadas na memória sejam descarregadas no disco antes de ocorrer o backup.

* Usar a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo é uma alternativa ao uso de links simbólicos, que a `InnoDB` não suporta.

* A cláusula `DATA DIRECTORY` não é suportada em um ambiente de replicação onde a fonte e a réplica residem no mesmo host. A cláusula `DATA DIRECTORY` requer um caminho de diretório completo. Replicar o caminho neste caso causaria a fonte e a réplica a criar a tabela na mesma localização.

##### Usando a sintaxe CREATE TABLE ... TABLESPACE

A sintaxe `CREATE TABLE ... TABLESPACE` pode ser usada em combinação com a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo. Para fazer isso, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```sql
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

Este método é suportado apenas para tabelas criadas em espaços de tabela por arquivo, mas não exige que a variável `innodb_file_per_table` seja habilitada. Em todos os outros aspectos, este método é equivalente ao método `CREATE TABLE ... DATA DIRECTORY` descrito acima. As mesmas notas de uso se aplicam.

##### Criando uma tabela em um espaço de tabelas geral externo

Você pode criar uma tabela em um espaço de tabelas geral que reside em um diretório externo.

* Para obter informações sobre a criação de um espaço de tabelas geral em um diretório externo, consulte Criando um espaço de tabelas geral.

* Para obter informações sobre a criação de uma tabela em um espaço de tabelas geral, consulte Adicionar tabelas a um espaço de tabelas geral.

#### 14.6.1.3 Importando tabelas InnoDB

Esta seção descreve como importar tabelas usando o recurso *Transportable Tablespaces*, que permite importar tabelas, tabelas particionadas ou particionamentos de tabela individuais que residem em espaços de tabela por arquivo. Há muitas razões pelas quais você pode querer importar tabelas:

* Para executar relatórios em uma instância de servidor MySQL não de produção para evitar colocar carga extra em um servidor de produção.

* Para copiar dados para um novo servidor replica. * Para restaurar uma tabela a partir de um arquivo de espaço de tabela protegido. * Como uma maneira mais rápida de mover dados do que importar um arquivo de dump, que requer a reinserção de dados e a reconstrução de índices.

* Para mover dados para um servidor com mídia de armazenamento que seja mais adequada às suas necessidades de armazenamento. Por exemplo, você pode mover tabelas ocupadas para um dispositivo SSD ou mover tabelas grandes para um dispositivo de HD de alta capacidade.

O recurso *Tabelas Espaços Transportadoras* é descrito nos seguintes tópicos desta seção:

* Pré-requisitos
* Importar tabelas
* Importar tabelas particionadas
* Partições de tabela
* Limitações
* Notas de uso
* Interiores

##### Pré-requisitos

* A variável `innodb_file_per_table` deve ser habilitada, o que é o caso por padrão.

* O tamanho da página do espaço de tabelas deve corresponder ao tamanho da página da instância do servidor MySQL de destino. O tamanho da página `InnoDB` é definido pela variável `innodb_page_size`, que é configurada ao inicializar uma instância do servidor MySQL.

* Se a tabela tiver uma relação de chave estrangeira, `foreign_key_checks` deve ser desativado antes de executar `DISCARD TABLESPACE`. Além disso, você deve exportar todas as tabelas relacionadas à chave estrangeira no mesmo ponto lógico, pois `ALTER TABLE ... IMPORT TABLESPACE` não aplica restrições de chave estrangeira aos dados importados. Para fazer isso, pare de atualizar as tabelas relacionadas, confirme todas as transações, adquira bloqueios compartilhados nas tabelas e realize as operações de exportação.

* Ao importar uma tabela de outra instância do servidor MySQL, ambas as instâncias do servidor MySQL devem ter o status de Disponibilidade Geral (GA) e devem ser da mesma versão. Caso contrário, a tabela deve ser criada na mesma instância do servidor MySQL na qual ela está sendo importada.

* Se a tabela foi criada em um diretório externo, especificando a cláusula `DATA DIRECTORY` na declaração `CREATE TABLE`, a tabela que você substitui na instância de destino deve ser definida com a mesma cláusula `DATA DIRECTORY`. Um erro de incompatibilidade de esquema é relatado se as cláusulas não corresponderem. Para determinar se a tabela de origem foi definida com uma cláusula `DATA DIRECTORY`, use `SHOW CREATE TABLE` para visualizar a definição da tabela. Para informações sobre o uso da cláusula `DATA DIRECTORY`, consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”.

* Se uma opção `ROW_FORMAT` não for definida explicitamente na definição da tabela ou se for usado `ROW_FORMAT=DEFAULT`, o ajuste `innodb_default_row_format` deve ser o mesmo nas instâncias de origem e destino. Caso contrário, um erro de desalinhamento de esquema será relatado quando você tentar a operação de importação. Use `SHOW CREATE TABLE` para verificar a definição da tabela. Use `SHOW VARIABLES` para verificar o ajuste `innodb_default_row_format`. Para informações relacionadas, consulte Definindo o Formato de String de uma Tabela.

##### Importar tabelas

Este exemplo demonstra como importar uma tabela regular não particionada que reside em um espaço de tabelas por arquivo.

1. Na instância de destino, crie uma tabela com a mesma definição da tabela que você pretende importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será relatado quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   ```

2. Na instância de destino, descarte o tablespace da tabela que você acabou de criar. (Antes de importar, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela que você pretende importar em estado de repouso. Quando uma tabela é colocada em repouso, apenas transações apenas de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

`FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária da tabela possa ser feita enquanto o servidor está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, `InnoDB` gera um arquivo de metadados `.cfg` no diretório do esquema da tabela. O arquivo `.cfg` contém metadados que são usados para verificação do esquema durante a operação de importação.

Nota

A conexão que executa `FLUSH TABLES ... FOR EXPORT` deve permanecer aberta enquanto a operação estiver em execução; caso contrário, o arquivo `.cfg` será removido, pois as chaves são liberadas ao fechar a conexão.

4. Copie o arquivo `.ibd` e o arquivo de metadados `.cfg` da instância de origem para a instância de destino. Por exemplo:

   ```sql
   $> scp /path/to/datadir/test/t1.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

O arquivo `.ibd` e o arquivo `.cfg` devem ser copiados antes de liberar as chaves compartilhadas, conforme descrito no próximo passo.

Nota

Se você está importando uma tabela de um espaço de tabela criptografado, o `InnoDB` gera um arquivo `.cfp`, além de um arquivo de metadados `.cfg`. O arquivo `.cfp` deve ser copiado para a instância de destino juntamente com o arquivo `.cfg`. O arquivo `.cfp` contém uma chave de transferência e uma chave de espaço de tabela criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de dados em repouso do InnoDB”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as chaves adquiridas pela declaração `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

A operação `UNLOCK TABLES` também remove o arquivo `.cfg`.

6. Na instância de destino, importe o tablespace:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Importando tabelas particionadas

Este exemplo demonstra como importar uma tabela particionada, onde cada particionamento da tabela reside em um espaço de tabela por arquivo.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada que você deseja importar. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será relatado quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 3;
   ```

No diretório `/datadir/test`, há um espaço de tabelas `.ibd` para cada uma das três partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   ```

2. Na instância de destino, descarte o tablespace para a tabela particionada. (Antes da operação de importação, você deve descartar o tablespace da tabela receptora.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD TABLESPACE;
   ```

Os três arquivos de espaço de tabela `.ibd` da tabela particionada são descartados do diretório `/datadir/test`, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm
   ```

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada que você pretende importar em estado de repouso. Quando uma tabela é colocada em repouso, apenas transações apenas de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

`FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária da tabela possa ser feita enquanto o servidor está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, `InnoDB` gera arquivos de metadados `.cfg` no diretório do esquema da tabela para cada um dos arquivos do espaço de tabela da tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg
   ```

Os arquivos `.cfg` contêm metadados que são usados para verificação de esquema ao importar o espaço de tabela. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não em partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino. Por exemplo:

   ```sql
   $>scp /path/to/datadir/test/t1*.{ibd,cfg} destination-server:/path/to/datadir/test
   ```

Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as chaves compartilhadas, conforme descrito no próximo passo.

Nota

Se você está importando uma tabela de um espaço de tabela criptografado, o `InnoDB` gera arquivos `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino juntamente com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabela criptografada. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as chaves adquiridas por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe o tablespace da tabela particionada:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT TABLESPACE;
   ```

##### Impor Partições de Tabela

Este exemplo demonstra como importar partições individuais de tabela, onde cada partição reside em um arquivo de espaço de tabela por tabela.

No exemplo a seguir, duas partições (`p2` e `p3`) de uma tabela de quatro partições são importadas.

1. Na instância de destino, crie uma tabela particionada com a mesma definição da tabela particionada da qual você deseja importar as partições. (Você pode obter a definição da tabela usando a sintaxe `SHOW CREATE TABLE`. Se a definição da tabela não corresponder, um erro de incompatibilidade de esquema será relatado quando você tentar a operação de importação.

   ```sql
   mysql> USE test;
   mysql> CREATE TABLE t1 (i int) ENGINE = InnoDB PARTITION BY KEY (i) PARTITIONS 4;
   ```

No diretório `/datadir/test`, há um espaço de tabelas `.ibd` para cada uma das quatro partições.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   ```

2. Na instância de destino, descarte as partições que você pretende importar da instância de origem. (Antes de importar as partições, você deve descartar as partições correspondentes da tabela particionada de recebimento.)

   ```sql
   mysql> ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
   ```

Os arquivos do tablespace `.ibd` para as duas partições descartadas são removidos do diretório `/datadir/test` na instância de destino, deixando os seguintes arquivos:

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1.frm  t1#P#p0.ibd  t1#P#p1.ibd
   ```

Nota

Quando o `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` é executado em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

3. Na instância de origem, execute `FLUSH TABLES ... FOR EXPORT` para colocar a tabela particionada em estado de repouso. Quando uma tabela é colocada em estado de repouso, apenas transações apenas de leitura são permitidas na tabela.

   ```sql
   mysql> USE test;
   mysql> FLUSH TABLES t1 FOR EXPORT;
   ```

`FLUSH TABLES ... FOR EXPORT` garante que as alterações na tabela nomeada sejam descarregadas no disco, para que uma cópia binária da tabela possa ser feita enquanto a instância está em execução. Quando `FLUSH TABLES ... FOR EXPORT` é executado, `InnoDB` gera um arquivo de metadados `.cfg` para cada um dos arquivos do espaço de tabela da tabela no diretório do esquema da tabela.

   ```sql
   mysql> \! ls /path/to/datadir/test/
   db.opt  t1#P#p0.ibd  t1#P#p1.ibd  t1#P#p2.ibd t1#P#p3.ibd
   t1.frm  t1#P#p0.cfg  t1#P#p1.cfg  t1#P#p2.cfg t1#P#p3.cfg
   ```

Os arquivos `.cfg` contêm metadados que são usados para verificação de esquema durante a operação de importação. `FLUSH TABLES ... FOR EXPORT` só pode ser executado na tabela, não em partições individuais da tabela.

4. Copie os arquivos `.ibd` e `.cfg` para a partição `p2` e partição `p3` do diretório do esquema da instância de origem para o diretório do esquema da instância de destino.

   ```sql
   $> scp t1#P#p2.ibd t1#P#p2.cfg t1#P#p3.ibd t1#P#p3.cfg destination-server:/path/to/datadir/test
   ```

Os arquivos `.ibd` e `.cfg` devem ser copiados antes de liberar as chaves compartilhadas, conforme descrito no próximo passo.

Nota

Se você está importando partições de um espaço de tabelas criptografado, `InnoDB` gera um arquivo `.cfp` além de arquivos de metadados `.cfg`. Os arquivos `.cfp` devem ser copiados para a instância de destino juntamente com os arquivos `.cfg`. Os arquivos `.cfp` contêm uma chave de transferência e uma chave de espaço de tabelas criptografada. Na importação, `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

5. Na instância de origem, use `UNLOCK TABLES` para liberar as chaves adquiridas por `FLUSH TABLES ... FOR EXPORT`:

   ```sql
   mysql> USE test;
   mysql> UNLOCK TABLES;
   ```

6. Na instância de destino, importe as partições da tabela `p2` e `p3`:

   ```sql
   mysql> USE test;
   mysql> ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
   ```

Nota

Quando o `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` é executado em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Limitações

* O recurso *Transportable Tablespaces* é suportado apenas para tabelas que residem em tablespaces por arquivo por tabela. Não é suportado para as tabelas que residem no tablespace de tabelas do sistema ou nos tablespaces gerais. As tabelas em tablespaces compartilhados não podem ser quiescidas.

* `FLUSH TABLES ... FOR EXPORT` não é suportado em tabelas com um índice `FULLTEXT`, pois as tabelas auxiliares de pesquisa de texto completo não podem ser esvaziadas. Após importar uma tabela com um índice `FULLTEXT`, execute `OPTIMIZE TABLE` para reconstruir os índices `FULLTEXT`. Alternativamente, exclua os índices `FULLTEXT` antes da operação de exportação e recree os índices após importar a tabela na instância de destino.

* Devido a uma limitação do arquivo de metadados `.cfg`, os desalinhamentos de esquema não são relatados para diferenças no tipo de partição ou na definição de partição ao importar uma tabela particionada. As diferenças de coluna são relatadas.

Observações de uso #####

* `ALTER TABLE ... IMPORT TABLESPACE` não requer um arquivo de metadados `.cfg` para importar uma tabela. No entanto, os verificações de metadados não são realizadas ao importar sem um arquivo `.cfg`, e é emitido um aviso semelhante ao seguinte:

  ```sql
  Message: InnoDB: IO Read error: (2, No such file or directory) Error opening '.\
  test\t.cfg', will attempt to import without schema verification
  1 row in set (0.00 sec)
  ```

A importação de uma tabela sem um arquivo de metadados `.cfg` deve ser considerada apenas se não se espera nenhuma incompatibilidade de esquema. A capacidade de importar sem um arquivo `.cfg` pode ser útil em cenários de recuperação de falhas onde os metadados não são acessíveis.

* Em Windows, `InnoDB` armazena nomes de banco de dados, espaços de tabela e tabelas internamente em minúsculas. Para evitar problemas de importação em sistemas operacionais sensíveis ao caso, como Linux e Unix, crie todos os bancos de dados, espaços de tabela e tabelas usando nomes em minúsculas. Uma maneira conveniente de realizar isso é adicionar `lower_case_table_names=1` à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar bancos de dados, espaços de tabela ou tabelas:

  ```sql
  [mysqld]
  lower_case_table_names=1
  ```

* Ao executar `ALTER TABLE ... DISCARD PARTITION ... TABLESPACE` e `ALTER TABLE ... IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, os nomes de tabelas de partição e subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas na operação.

##### Internos

As informações a seguir descrevem os elementos internos e as mensagens escritas no log de erro durante um procedimento de importação de tabela.

Quando o `ALTER TABLE ... DISCARD TABLESPACE` é executado na instância de destino:

* A tabela está bloqueada no modo X. * O espaço de tabela está separado da tabela.

Quando o `FLUSH TABLES ... FOR EXPORT` é executado na instância de origem:

* A tabela que está sendo limpa para exportação está bloqueada no modo compartilhado. * O thread do coordenador de purga foi interrompido. * As páginas sujas são sincronizadas com o disco. * Os metadados da tabela são escritos no arquivo binário `.cfg`.

Mensagens esperadas de registro de erro para esta operação:

```sql
[Note] InnoDB: Sync to disk of '"test"."t1"' started.
[Note] InnoDB: Stopping purge
[Note] InnoDB: Writing table metadata to './test/t1.cfg'
[Note] InnoDB: Table '"test"."t1"' flushed to disk
```

Quando o `UNLOCK TABLES` é executado na instância de origem:

* O arquivo binário `.cfg` é excluído. * O bloqueio compartilhado na(s) tabela(s) que está(ão) sendo importada(s) é liberado e o thread do coordenador de purga é reiniciado.

Mensagens esperadas de registro de erro para esta operação:

```sql
[Note] InnoDB: Deleting the meta-data file './test/t1.cfg'
[Note] InnoDB: Resuming purge
```

Quando o `ALTER TABLE ... IMPORT TABLESPACE` é executado na instância de destino, o algoritmo de importação realiza as seguintes operações para cada tablespace que está sendo importado:

* Cada página do tablespace é verificada quanto à corrupção. * O ID de espaço e os números de sequência de log (LSNs) em cada página são atualizados.

* As bandeiras são validadas e o LSN atualizado para a página de cabeçalho. * As páginas Btree são atualizadas. * O estado da página é definido como sujo para que seja escrito no disco.

Mensagens esperadas de registro de erro para esta operação:

```sql
[Note] InnoDB: Importing tablespace for table 'test/t1' that was exported
from host 'host_name'
[Note] InnoDB: Phase I - Update all pages
[Note] InnoDB: Sync to disk
[Note] InnoDB: Sync to disk - done!
[Note] InnoDB: Phase III - Flush changes to disk
[Note] InnoDB: Phase IV - Flush complete
```

Nota

Você também pode receber um aviso de que um espaço de tabela é descartado (se você descartou o espaço de tabela para a tabela de destino) e uma mensagem afirmando que as estatísticas não puderam ser calculadas devido a um arquivo `.ibd` ausente:

```sql
[Warning] InnoDB: Table "test"."t1" tablespace is set as discarded.
7f34d9a37700 InnoDB: cannot calculate statistics for table
"test"."t1" because the .ibd file is missing. For help, please refer to
http://dev.mysql.com/doc/refman/5.7/en/innodb-troubleshooting.html
```

#### 14.6.1.4 Movimentando ou copiando tabelas InnoDB

Esta seção descreve técnicas para mover ou copiar algumas ou todas as tabelas do `InnoDB` para um servidor ou instância diferente. Por exemplo, você pode mover uma instância inteira do MySQL para um servidor maior e mais rápido; você pode clonar uma instância inteira do MySQL para um novo servidor de replica; você pode copiar tabelas individuais para outra instância para desenvolver e testar uma aplicação, ou para um servidor de armazém de dados para produzir relatórios.

Em Windows, `InnoDB` armazena sempre os nomes dos bancos de dados e das tabelas internamente em minúsculas. Para mover bancos de dados em formato binário de Unix para Windows ou de Windows para Unix, crie todos os bancos de dados e tabelas usando nomes em minúsculas. Uma maneira conveniente para realizar isso é adicionar a seguinte string à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar quaisquer bancos de dados ou tabelas:

```sql
[mysqld]
lower_case_table_names=1
```

As técnicas para mover ou copiar tabelas `InnoDB` incluem:

* Importar tabelas * Backup empresarial do MySQL * Copiar arquivos de dados (método de backup frio) * Restaurar a partir de um backup lógico)

##### Importar tabelas

Uma tabela que reside em um espaço de tabela por arquivo pode ser importada de outra instância do servidor MySQL ou de um backup usando o recurso *Transportable Tablespace*. Veja a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

##### MySQL Enterprise Backup

O produto MySQL Enterprise Backup permite fazer backup de um banco de dados MySQL em funcionamento com mínima interrupção das operações, ao mesmo tempo em que produz um instantâneo consistente do banco de dados. Quando o MySQL Enterprise Backup está copiando tabelas, as leituras e escritas podem continuar. Além disso, o MySQL Enterprise Backup pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas. Em conjunto com o log binário MySQL, você pode realizar a recuperação em um ponto no tempo. O MySQL Enterprise Backup é incluído como parte da assinatura MySQL Enterprise.

Para mais detalhes sobre o MySQL Enterprise Backup, consulte a Seção 28.1, “Visão geral do MySQL Enterprise Backup”.

##### Copiar arquivos de dados (método de backup frio)

Você pode mover um banco de dados `InnoDB` simplesmente copiando todos os arquivos relevantes listados em "Cópias Frias" na Seção 14.19.1, "Backup InnoDB".

Os arquivos de dados e de registro `InnoDB` são compatíveis em binário em todas as plataformas que possuem o mesmo formato de número de ponto flutuante. Se os formatos de ponto flutuante diferirem, mas você não tenha usado os tipos de dados `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") em suas tabelas, então o procedimento é o mesmo: simplesmente copie os arquivos relevantes.

Quando você mover ou copiar arquivos por tabela `.ibd`, o nome do diretório do banco de dados deve ser o mesmo nos sistemas de origem e destino. A definição da tabela armazenada nos espaços compartilhados `InnoDB` inclui o nome do banco de dados. Os IDs de transação e os números de sequência de registro armazenados nos arquivos do espaço de tabela também diferem entre os bancos de dados.

Para mover um arquivo `.ibd` e a tabela associada de um banco de dados para outro, use uma declaração `RENAME TABLE`:

```sql
RENAME TABLE db1.tbl_name TO db2.tbl_name;
```

Se você tiver um backup “limpo” de um arquivo `.ibd`, você pode restaurá-lo à instalação do MySQL de onde ele se originou da seguinte forma:

1. A tabela não deve ter sido descartada ou truncada desde que você copiou o arquivo `.ibd`, pois isso altera o ID da tabela armazenado dentro do espaço de tabelas.

2. Emitir esta declaração `ALTER TABLE` para excluir o arquivo atual `.ibd`:

   ```sql
   ALTER TABLE tbl_name DISCARD TABLESPACE;
   ```

3. Copie o arquivo de backup `.ibd` para o diretório do banco de dados apropriado.

4. Emite esta declaração `ALTER TABLE` para informar ao `InnoDB` que utilize o novo arquivo `.ibd` para a tabela:

   ```sql
   ALTER TABLE tbl_name IMPORT TABLESPACE;
   ```

Nota

O recurso `ALTER TABLE ... IMPORT TABLESPACE` não aplica restrições de chave estrangeira aos dados importados.

Neste contexto, um backup de arquivo `.ibd` “limpo” é aquele para o qual são satisfeitas as seguintes exigências:

* Não há modificações não comprometidas por transações no arquivo `.ibd`.

* Não há entradas de buffer de inserção não unidas no arquivo `.ibd`.

* O Purge removeu todos os registros de índice marcados como apagados do arquivo `.ibd`.

* `mysqld` limpou todas as páginas modificadas do arquivo `.ibd` do buffer pool para o arquivo.

Você pode fazer um backup limpo do arquivo `.ibd` usando o seguinte método:

1. Parar toda atividade do servidor `mysqld` e confirmar todas as transações.

2. Aguarde até que `SHOW ENGINE INNODB STATUS` mostre que não há transações ativas no banco de dados e que o estado do thread principal de `InnoDB` é `Waiting for server activity`. Em seguida, você pode fazer uma cópia do arquivo `.ibd`.

Outro método para fazer uma cópia limpa de um arquivo `.ibd` é usar o produto MySQL Enterprise Backup:

1. Use o MySQL Enterprise Backup para fazer o backup da instalação do `InnoDB`. 2. Inicie um segundo servidor `mysqld` no backup e deixe-o limpar os arquivos `.ibd` no backup.

##### Restauração a partir de um backup lógico

Você pode usar uma ferramenta como **mysqldump** para realizar um backup lógico, que produz um conjunto de declarações SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas para transferência para outro servidor SQL. Usando esse método, não importa se os formatos diferem ou se suas tabelas contêm dados de ponto flutuante.

Para melhorar o desempenho deste método, desative `autocommit` ao importar dados. Realize um compromisso apenas após importar uma tabela inteira ou um segmento de uma tabela.

#### 14.6.1.5 Converter tabelas de MyISAM para InnoDB

Se você tem tabelas `MyISAM` que deseja converter para `InnoDB` para maior confiabilidade e escalabilidade, revise as diretrizes e dicas a seguir antes de converter.

* Ajustando o uso de memória para MyISAM e InnoDB
* Lidando com transações muito longas ou muito curtas
* Lidando com deadlocks
* Layout de armazenamento
* Convertendo uma tabela existente
* Clonando a estrutura de uma tabela
* Transferindo dados
* Requisitos de armazenamento
* Definindo chaves primárias
* Considerações sobre o desempenho da aplicação
* Entendendo os arquivos associados às tabelas InnoDB

##### Ajustando o uso de memória para MyISAM e InnoDB

À medida que você passa a usar as tabelas `MyISAM`, reduza o valor da opção de configuração `key_buffer_size` para liberar memória que não é mais necessária para o cache de resultados. Aumente o valor da opção de configuração `innodb_buffer_pool_size`, que desempenha um papel semelhante, alocação de memória de cache para as tabelas `InnoDB`. O pool de buffers `InnoDB` cache tanto os dados da tabela quanto os dados do índice, acelerando as consultas e mantendo os resultados das consultas na memória para reutilização. Para obter orientações sobre a configuração do tamanho do pool de buffers, consulte a Seção 8.12.4.1, “Como o MySQL usa memória”.

Em um servidor ocupado, execute benchmarks com o cache de consulta desativado. O pool de buffers `InnoDB` oferece benefícios semelhantes, então o cache de consulta pode estar ocupando memória desnecessariamente. Para informações sobre o cache de consulta, consulte a Seção 8.10.3, “O Cache de Consulta MySQL”.

##### Gerenciamento de transações muito longas ou muito curtas

Como as tabelas `MyISAM` não suportam transações, você pode não ter prestado muita atenção à opção de configuração `autocommit` e às declarações `COMMIT` e `ROLLBACK`. Essas palavras-chave são importantes para permitir que múltiplas sessões leiam e escrevam em tabelas `InnoDB` de forma concorrente, proporcionando benefícios substanciais em termos de escalabilidade em cargas de trabalho com muitos escritos.

Enquanto uma transação está aberta, o sistema mantém um instantâneo dos dados conforme visto no início da transação, o que pode causar um custo substancial se o sistema inserir, atualizar e excluir milhões de strings enquanto uma transação perdida continua em execução. Portanto, tome cuidado para evitar transações que duram por muito tempo:

* Se você estiver usando uma sessão de **mysql** para experimentos interativos, sempre `COMMIT` (para finalizar as alterações) ou `ROLLBACK` (para desfazer as alterações) quando terminar. Feche as sessões interativas em vez de deixá-las abertas por longos períodos, para evitar manter as transações abertas por longos períodos por acidente.

* Certifique-se de que qualquer manipulador de erro em sua aplicação também `ROLLBACK` alterações incompletas ou `COMMIT` alterações completas.

* `ROLLBACK` é uma operação relativamente cara, porque as operações `INSERT`, `UPDATE` e `DELETE` são escritas nas tabelas `InnoDB` antes da `COMMIT`, com a expectativa de que a maioria das alterações seja comprometida com sucesso e que os rollback sejam raros. Ao experimentar com grandes volumes de dados, evite fazer alterações em um grande número de strings e, em seguida, reverter essas alterações.

* Ao carregar grandes volumes de dados com uma sequência de declarações `INSERT`, periodicamente `COMMIT` os resultados para evitar ter transações que duram horas. Em operações de carregamento típicas para armazenamento de dados, se algo der errado, você corta a tabela (usando `TRUNCATE TABLE`) e começa tudo de novo do início, em vez de fazer um `ROLLBACK`.

As dicas anteriores economizam memória e espaço em disco que podem ser desperdiçados durante transações muito longas. Quando as transações são mais curtas do que deveriam ser, o problema é o I/O excessivo. Com cada `COMMIT`, o MySQL garante que cada alteração seja registrada com segurança no disco, o que envolve algum I/O.

* Para a maioria das operações nas tabelas `InnoDB`, você deve usar o ajuste `autocommit=0`. Do ponto de vista de eficiência, isso evita o I/O desnecessário quando você emite um grande número de declarações consecutivas `INSERT`, `UPDATE` ou `DELETE`. Do ponto de vista de segurança, isso permite que você emita uma declaração `ROLLBACK` para recuperar dados perdidos ou distorcidos se você cometer um erro na string de comando do **mysql**, ou em um manipulador de exceção em sua aplicação.

* `autocommit=1` é adequado para tabelas `InnoDB` ao executar uma sequência de consultas para gerar relatórios ou analisar estatísticas. Nessa situação, não há penalização de I/O relacionada a `COMMIT` ou `ROLLBACK`, e `InnoDB` pode otimizar automaticamente o trabalho de leitura somente.

* Se você fizer uma série de alterações relacionadas, finalize todas as alterações de uma vez com um único `COMMIT` no final. Por exemplo, se você inserir peças de informação relacionadas em várias tabelas, faça um único `COMMIT` após fazer todas as alterações. Ou se você executar muitas declarações consecutivas `INSERT`, faça um único `COMMIT` após todos os dados serem carregados; se você está fazendo milhões de declarações `INSERT`, talvez divida a enorme transação emitindo um `COMMIT` a cada dez mil ou cem mil registros, para que a transação não fique muito grande.

* Lembre-se de que até uma declaração `SELECT` abre uma transação, então, após executar algum relatório ou depuração de consultas em uma sessão interativa do **mysql**, emita uma declaração `COMMIT` ou feche a sessão do **mysql**.

Para informações relacionadas, consulte a Seção 14.7.2.2, “autocommit, Commit e Rollback”.

##### Gerenciamento de Deadlocks

Você pode ver mensagens de alerta que fazem referência a "bloqueios" no registro de erro do MySQL, ou a saída de `SHOW ENGINE INNODB STATUS`. Um bloqueio não é um problema sério para as tabelas `InnoDB`, e muitas vezes não requer nenhuma ação corretiva. Quando duas transações começam a modificar múltiplas tabelas, acessando as tabelas em uma ordem diferente, elas podem chegar a um estado em que cada transação está esperando pela outra e nenhuma delas pode prosseguir. Quando a detecção de bloqueio é habilitada (o padrão), o MySQL detecta imediatamente essa condição e cancela (reverte) a "menor" transação, permitindo que a outra prossiga. Se a detecção de bloqueio é desabilitada usando a opção de configuração `innodb_deadlock_detect`, `InnoDB` depende do ajuste de `innodb_lock_wait_timeout` para reverter as transações em caso de bloqueio.

De qualquer forma, suas aplicações precisam de lógica de tratamento de erros para reiniciar uma transação que foi cancelada forçadamente devido a um bloqueio. Quando você emite novamente as mesmas declarações SQL como antes, o problema original de cronometragem não se aplica mais. Ou a outra transação já terminou e a sua pode prosseguir, ou a outra transação ainda está em progresso e sua transação espera até que ela termine.

Se os avisos de bloqueio ocorrerem constantemente, você pode revisar o código do aplicativo para reorganizar as operações SQL de uma maneira consistente ou para encurtar as transações. Você pode testar com a opção `innodb_print_all_deadlocks` habilitada para ver todos os avisos de bloqueio no registro de erro do MySQL, em vez de apenas o último aviso na saída do `SHOW ENGINE INNODB STATUS`.

Para mais informações, consulte a Seção 14.7.5, "Bloqueios em InnoDB".

##### Layout de Armazenamento

Para obter o melhor desempenho das tabelas `InnoDB`, você pode ajustar vários parâmetros relacionados ao layout de armazenamento.

Quando você converte tabelas `MyISAM` que são grandes, frequentemente acessadas e contêm dados vitais, investigue e considere as variáveis `innodb_file_per_table`, `innodb_file_format` e `innodb_page_size`, e as cláusulas `ROW_FORMAT` e `KEY_BLOCK_SIZE` da declaração `CREATE TABLE`.

Durante seus experimentos iniciais, o ajuste mais importante é `innodb_file_per_table`. Quando este ajuste é habilitado, o que é o padrão a partir do MySQL 5.6.6, novas tabelas `InnoDB` são criadas implicitamente em espaços de tabela por arquivo. Em contraste com o espaço de tabela `InnoDB`, os espaços de tabela por arquivo permitem que o espaço em disco seja recuperado pelo sistema operacional quando uma tabela é truncada ou excluída. Os espaços de tabela por arquivo também suportam o formato de arquivo Barracuda e recursos associados, como compressão de tabela, armazenamento eficiente fora da página para colunas de comprimento variável longo e grandes prefixos de índice. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de tabela por arquivo”.

Você também pode armazenar tabelas `InnoDB` em um espaço de tabelas geral compartilhado. Os espaços de tabelas gerais suportam o formato de arquivo Barracuda e podem conter várias tabelas. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

##### Converter uma tabela existente

Para converter uma tabela que não é `InnoDB` para usar `InnoDB`, use `ALTER TABLE`:

```sql
ALTER TABLE table_name ENGINE=InnoDB;
```

Aviso

*Não* converta as tabelas de sistema do MySQL no banco de dados `mysql` das tabelas de `MyISAM` para as tabelas de `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não reiniciará até que você restaure as tabelas de sistema antigas a partir de um backup ou as gere novamente, reinicializando o diretório de dados (consulte Seção 2.9.1, “Inicializando o Diretório de Dados”).

##### Clonando a Estrutura de uma Tabela

Você pode criar uma tabela `InnoDB` que seja um clone de uma tabela MyISAM, em vez de usar `ALTER TABLE` para realizar a conversão, para testar as tabelas antiga e nova lado a lado antes de fazer a mudança.

Crie uma tabela `InnoDB` vazia com definições de coluna e índice idênticas. Use `SHOW CREATE TABLE table_name\G` para ver a declaração completa `CREATE TABLE` a ser usada. Altere a cláusula `ENGINE` para `ENGINE=INNODB`.

##### Transferindo dados

Para transferir um grande volume de dados em uma tabela `InnoDB` vazia criada conforme mostrado na seção anterior, insira as strings com `INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns`.

Você também pode criar os índices para a tabela `InnoDB` após inserir os dados. Historicamente, criar novos índices secundários era uma operação lenta para `InnoDB`, mas agora você pode criar os índices após os dados serem carregados com um custo relativamente baixo em relação à etapa de criação do índice.

Se você tiver restrições `UNIQUE` em chaves secundárias, pode acelerar a importação de uma tabela desativando as verificações de unicidade temporariamente durante a operação de importação:

```sql
SET unique_checks=0;
... import operation ...
SET unique_checks=1;
```

Para tabelas grandes, isso economiza o I/O de disco porque o `InnoDB` pode usar seu buffer de alterações para escrever registros de índice secundário em lote. Certifique-se de que os dados não contenham chaves duplicadas. O `unique_checks` permite, mas não exige, que os motores de armazenamento ignorem chaves duplicadas.

Para um melhor controle sobre o processo de inserção, você pode inserir grandes tabelas em partes:

```sql
INSERT INTO newtable SELECT * FROM oldtable
   WHERE yourkey > something AND yourkey <= somethingelse;
```

Depois que todos os registros forem inseridos, você pode renomear as tabelas.

Durante a conversão de grandes tabelas, aumente o tamanho do pool de buffer `InnoDB` para reduzir o I/O de disco. Normalmente, o tamanho recomendado do pool de buffer é de 50 a 75 por cento da memória do sistema. Você também pode aumentar o tamanho dos arquivos de log `InnoDB`.

##### Requisitos de Armazenamento

Se você pretende fazer várias cópias temporárias dos seus dados nas tabelas `InnoDB` durante o processo de conversão, é recomendável que você crie as tabelas em espaços de tabela por arquivo para que possa recuperar o espaço em disco quando você excluir as tabelas. Quando a opção de configuração `innodb_file_per_table` é habilitada (o padrão), as novas tabelas `InnoDB` são criadas implicitamente em espaços de tabela por arquivo.

Se você converter a tabela `MyISAM` diretamente ou criar uma tabela clonada `InnoDB`, certifique-se de que você tem espaço suficiente no disco para manter as duas tabelas, tanto a antiga quanto a nova, durante o processo. **As tabelas `InnoDB` requerem mais espaço no disco do que as tabelas `MyISAM`.** Se uma operação `ALTER TABLE` ficar sem espaço, ela inicia um rollback, e isso pode levar horas se estiver limitada ao disco. Para inserções, o `InnoDB` usa o buffer de inserção para combinar registros de índice secundário em índices em lotes. Isso economiza muito I/O de disco. Para rollback, não é usado nenhum mecanismo desse tipo, e o rollback pode levar 30 vezes mais tempo do que a inserção.

No caso de um rollback descontrolado, se você não tiver dados valiosos em seu banco de dados, pode ser aconselhável matar o processo do banco de dados em vez de esperar que milhões de operações de E/S de disco sejam concluídas. Para o procedimento completo, consulte a Seção 14.22.2, “Forçando a recuperação do InnoDB”.

##### Definindo Chaves Primárias

A cláusula `PRIMARY KEY` é um fator crítico que afeta o desempenho das consultas do MySQL e o uso de espaço para tabelas e índices. A chave primária identifica de forma única uma string em uma tabela. Cada string da tabela deve ter um valor de chave primária, e nenhuma das duas strings pode ter o mesmo valor de chave primária.

Estas são as diretrizes para a chave primária, seguidas por explicações mais detalhadas.

* Declare um `PRIMARY KEY` para cada tabela. Tipicamente, é a coluna mais importante que você se refere nas cláusulas `WHERE` ao procurar uma única string.

* Declare a cláusula `PRIMARY KEY` na declaração original `CREATE TABLE`, em vez de adicioná-la posteriormente por meio de uma declaração `ALTER TABLE`.

* Escolha a coluna e seu tipo de dados com cuidado. Prefira colunas numéricas em vez de colunas de caracteres ou de texto.

* Considere o uso de uma coluna de autoincremento se não houver outra coluna estável, única, não nula e numérica para usar.

* Uma coluna de autoincremento também é uma boa escolha se houver alguma dúvida sobre se o valor da coluna da chave primária poderá mudar alguma vez. Alterar o valor de uma coluna da chave primária é uma operação cara, que pode envolver a reorganização de dados dentro da tabela e em cada índice secundário.

Considere adicionar uma chave primária a qualquer tabela que ainda não a tenha. Use o menor tipo numérico prático possível, com base no tamanho máximo projetado da tabela. Isso pode tornar cada string um pouco mais compacta, o que pode resultar em economia de espaço substancial para tabelas grandes. A economia de espaço é multiplicada se a tabela tiver quaisquer índices secundários, porque o valor da chave primária é repetido em cada entrada do índice secundário. Além de reduzir o tamanho dos dados no disco, uma chave primária pequena também permite que mais dados se encaixem na piscina de buffer, acelerando todos os tipos de operações e melhorando a concorrência.

Se a tabela já tiver uma chave primária em uma coluna mais longa, como `VARCHAR`, considere adicionar uma nova coluna não assinada `AUTO_INCREMENT` e mudar a chave primária para essa coluna, mesmo que essa coluna não seja referenciada em consultas. Essa mudança de projeto pode produzir economias substanciais de espaço nos índices secundários. Você pode designar as colunas antigas da chave primária como `UNIQUE NOT NULL` para impor as mesmas restrições que a cláusula `PRIMARY KEY`, ou seja, para evitar valores duplicados ou nulos em todas essas colunas.

Se você espalhar informações relacionadas em várias tabelas, normalmente cada tabela usa a mesma coluna como sua chave primária. Por exemplo, um banco de dados de pessoal pode ter várias tabelas, cada uma com uma chave primária do número do funcionário. Um banco de dados de vendas pode ter algumas tabelas com uma chave primária do número do cliente, e outras tabelas com uma chave primária do número do pedido. Como as consultas de busca usando a chave primária são muito rápidas, você pode construir consultas de junção eficientes para tais tabelas.

Se você deixar a cláusula `PRIMARY KEY` completamente fora, o MySQL cria uma invisível para você. É um valor de 6 bytes que pode ser mais longo do que o necessário, desperdiçando espaço. Como é oculto, você não pode referenciá-lo em consultas.

##### Considerações sobre o desempenho da aplicação

As características de confiabilidade e escalabilidade do `InnoDB` exigem mais armazenamento em disco do que as tabelas equivalentes do `MyISAM`. Você pode alterar as definições de coluna e índice levemente, para uma melhor utilização do espaço, redução do consumo de I/O e memória ao processar conjuntos de resultados, e melhores planos de otimização de consulta que fazem uso eficiente das consultas de busca.

Se você configurar uma coluna de ID numérica para a chave primária, use esse valor para fazer uma referência cruzada com valores relacionados em quaisquer outras tabelas, especialmente para consultas de junção. Por exemplo, em vez de aceitar um nome de país como entrada e fazer consultas que buscam o mesmo nome, faça uma pesquisa para determinar o ID do país, em seguida, faça outras consultas (ou uma única consulta de junção) para procurar informações relevantes em várias tabelas. Em vez de armazenar um número de cliente ou item de catálogo como uma cadeia de dígitos, potencialmente usando vários bytes, converta-o em um ID numérico para armazenamento e consulta. Uma coluna de 4 bytes sem sinal `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") pode indexar mais de 4 bilhões de itens (com o significado dos EUA de bilhão: 1000 milhões). Para as faixas dos diferentes tipos de inteiro, consulte a Seção 11.1.2, “Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

##### Entendendo os arquivos associados às tabelas InnoDB

Os arquivos `InnoDB` exigem mais cuidados e planejamento do que os arquivos `MyISAM`.

* Você não deve excluir os arquivos ibdata que representam o espaço de tabela do sistema `InnoDB`.

* Os métodos para mover ou copiar as tabelas `InnoDB` para um servidor diferente são descritos na Seção 14.6.1.4, "Movendo ou copiando tabelas InnoDB".

#### 14.6.1.6 Gerenciamento de AUTO_INCREMENT no InnoDB

`InnoDB` fornece um mecanismo de bloqueio configurável que pode melhorar significativamente a escalabilidade e o desempenho das declarações SQL que adicionam strings a tabelas com colunas `AUTO_INCREMENT`. Para usar o mecanismo `AUTO_INCREMENT` com uma tabela `InnoDB`, uma coluna `AUTO_INCREMENT` deve ser definida como a primeira ou única coluna de algum índice, de modo que seja possível realizar o equivalente a uma pesquisa `SELECT MAX(ai_col)` indexada na tabela para obter o valor máximo da coluna. O índice não precisa ser um `PRIMARY KEY` ou `UNIQUE`, mas para evitar valores duplicados na coluna `AUTO_INCREMENT`, esses tipos de índice são recomendados.

Esta seção descreve os modos de bloqueio do `AUTO_INCREMENT`, as implicações do uso de diferentes configurações dos modos de bloqueio do `AUTO_INCREMENT` e como o `InnoDB` inicializa o contador do `AUTO_INCREMENT`.

* Modos de bloqueio AUTO_INCREMENT do InnoDB
* Implicações do uso do modo de bloqueio AUTO_INCREMENT do InnoDB
* Inicialização do contador AUTO_INCREMENT do InnoDB
* Notas

##### Modos de bloqueio de AUTO_INCREMENT do InnoDB

Esta seção descreve os modos de bloqueio `AUTO_INCREMENT` usados para gerar valores de autoincremento e como cada modo de bloqueio afeta a replicação. O modo de bloqueio de autoincremento é configurado na inicialização usando a variável `innodb_autoinc_lock_mode`.

Os seguintes termos são utilizados na descrição dos ajustes do `innodb_autoinc_lock_mode`:

* Declarações semelhantes a `INSERT`

Todas as declarações que geram novas strings em uma tabela, incluindo `INSERT`, `INSERT ... SELECT`, `REPLACE`, `REPLACE ... SELECT` e `LOAD DATA`. Inclui inserções “simples”, “em massa” e inserções em modo misto.

* “insertos simples”

Declarações para as quais o número de strings a serem inseridas pode ser determinado antecipadamente (quando a declaração é processada inicialmente). Isso inclui declarações de uma única string e declarações de várias strings `INSERT` e `REPLACE` que não possuem uma subconsulta aninhada, mas não `INSERT ... ON DUPLICATE KEY UPDATE`.

* “insertos em massa”

Declarações para as quais o número de strings a serem inseridas (e o número de valores de auto-incremento necessários) não é conhecido antecipadamente. Isso inclui as declarações `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`, mas não a simples `INSERT`. `InnoDB` atribui novos valores para a coluna `AUTO_INCREMENT` uma de cada vez, à medida que cada string é processada.

* Inserções em modo misto

Estas são declarações de "inserção simples" que especificam o valor de autoincremento para algumas (mas não todas) das novas strings. Um exemplo segue, onde `c1` é uma coluna `AUTO_INCREMENT` da tabela `t1`:

  ```sql
  INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

Outro tipo de inserção em modo misto é o `INSERT ... ON DUPLICATE KEY UPDATE`, que, no pior dos casos, é, na verdade, um `INSERT` seguido por um `UPDATE`, onde o valor atribuído para a coluna `AUTO_INCREMENT` pode ou não ser usado durante a fase de atualização.

Existem três configurações possíveis para a variável `innodb_autoinc_lock_mode`. As configurações são 0, 1 ou 2, para modo de bloqueio “tradicional”, “consecutivo” ou “entrelaçado”, respectivamente.

* `innodb_autoinc_lock_mode = 0` (modo de bloqueio "tradicional")

O modo de bloqueio tradicional oferece o mesmo comportamento que existia antes da introdução da variável `innodb_autoinc_lock_mode`. A opção de modo de bloqueio tradicional é fornecida para compatibilidade reversa, testes de desempenho e trabalho em torno de problemas com inserções de "modo misto", devido a possíveis diferenças de semântica.

Neste modo de bloqueio, todas as declarações semelhantes a INSERT obtém um bloqueio especial de nível de tabela `AUTO-INC` para inserções em tabelas com colunas `AUTO_INCREMENT`. Este bloqueio é normalmente mantido até o final da declaração (não até o final da transação) para garantir que os valores de autoincremento sejam atribuídos em uma ordem previsível e repetida para uma sequência dada de declarações `INSERT`, e para garantir que os valores de autoincremento atribuídos por qualquer declaração dada sejam consecutivos.

No caso da replicação baseada em declarações, isso significa que, quando uma declaração SQL é replicada em um servidor de replica, os mesmos valores são usados para a coluna de autoincremento como no servidor de origem. O resultado da execução de múltiplas declarações `INSERT` é determinístico, e a replica reproduz os mesmos dados que no origem. Se os valores de autoincremento gerados por múltiplas declarações `INSERT` fossem intercalados, o resultado de duas declarações `INSERT` concorrentes seria não determinístico e não poderia ser propagado de forma confiável para um servidor de replicação usando replicação baseada em declarações.

Para esclarecer isso, considere um exemplo que usa essa tabela:

  ```sql
  CREATE TABLE t1 (
    c1 INT(11) NOT NULL AUTO_INCREMENT,
    c2 VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (c1)
  ) ENGINE=InnoDB;
  ```

Suponha que haja duas transações em execução, cada uma inserindo strings em uma tabela com uma coluna `AUTO_INCREMENT`. Uma transação está usando uma declaração `INSERT ... SELECT` que insere 1000 strings, e outra está usando uma declaração simples `INSERT` que insere uma string:

  ```sql
  Tx1: INSERT INTO t1 (c2) SELECT 1000 rows from another table ...
  Tx2: INSERT INTO t1 (c2) VALUES ('xxx');
  ```

`InnoDB` não pode prever antecipadamente quantos registros são recuperados do `SELECT` na declaração `INSERT` no Tx1, e atribui os valores de autoincremento um de cada vez à medida que a declaração prossegue. Com um bloqueio de nível de tabela, mantido até o final da declaração, apenas uma declaração `INSERT` que faça referência à tabela `t1` pode ser executada de cada vez, e a geração de números de autoincremento por diferentes declarações não é interrompida. Os valores de autoincremento gerados pela declaração `INSERT ... SELECT` do Tx1 são consecutivos, e o valor de autoincremento (único) usado pela declaração `INSERT` do Tx2 é menor ou maior que todos os usados para o Tx1, dependendo de qual declaração é executada primeiro.

Enquanto as instruções SQL executarem na mesma ordem quando reexecutadas a partir do log binário (quando se usa replicação baseada em instruções, ou em cenários de recuperação), os resultados são os mesmos que quando Tx1 e Tx2 foram executados pela primeira vez. Assim, os bloqueios de nível de tabela mantidos até o final de uma instrução tornam as instruções `INSERT` que utilizam auto-incremento seguras para uso com replicação baseada em instruções. No entanto, esses bloqueios de nível de tabela limitam a concorrência e a escalabilidade quando várias transações estão executando instruções de inserção ao mesmo tempo.

No exemplo anterior, se não houvesse bloqueio em nível de tabela, o valor da coluna de autoincremento usada para o `INSERT` em Tx2 depende exatamente de quando a declaração é executada. Se o `INSERT` de Tx2 é executado enquanto o `INSERT` de Tx1 está em execução (em vez de antes de começar ou depois de completar), os valores específicos de autoincremento atribuídos pelas duas declarações de `INSERT` são não determinísticos e podem variar de uma execução para outra.

No modo de bloqueio consecutivo, `InnoDB` pode evitar o uso de bloqueios de nível de tabela `AUTO-INC` para declarações de "inserção simples" onde o número de strings é conhecido antecipadamente, e ainda preservar a execução determinística e a segurança para a replicação baseada em declarações.

Se você não estiver usando o log binário para reproduzir instruções SQL como parte da recuperação ou replicação, o modo de bloqueio entrelaçado pode ser usado para eliminar todo o uso de bloqueios de nível de tabela `AUTO-INC`, garantindo ainda maior concorrência e desempenho, ao custo de permitir lacunas nos números de autoincremento atribuídos por uma declaração e, potencialmente, ter os números atribuídos por declarações executadas simultaneamente entrelaçados.

* `innodb_autoinc_lock_mode = 1` (modo de bloqueio "consecutivo")

Este é o modo de bloqueio padrão. Neste modo, as "inserções em massa" utilizam o bloqueio especial da tabela `AUTO-INC` e o mantêm até o final da declaração. Isso se aplica a todas as declarações `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`. Apenas uma declaração que mantém o bloqueio `AUTO-INC` pode ser executada de cada vez. Se a tabela de origem da operação de inserção em massa for diferente da tabela de destino, o bloqueio `AUTO-INC` na tabela de destino é tomado após uma bloqueio compartilhado ser tomado na primeira string selecionada da tabela de origem. Se a fonte e o destino da operação de inserção em massa são a mesma tabela, o bloqueio `AUTO-INC` é tomado após blocos compartilhados serem tomados em todas as strings selecionadas.

Os “insertos simples” (para os quais o número de strings a serem inseridas é conhecido antecipadamente) evitam os bloqueios de nível de tabela `AUTO-INC` ao obter o número necessário de valores de autoincremento sob o controle de um mutex (um bloqueio leve) que é mantido apenas durante a duração do processo de alocação, *não* até que a declaração seja concluída. Não é usado um bloqueio de nível de tabela `AUTO-INC` a menos que outra transação mantenha um bloqueio `AUTO-INC`. Se outra transação mantém um bloqueio `AUTO-INC`, um “inserto simples” espera pelo bloqueio `AUTO-INC`, como se fosse um “inserto em massa”.

Este modo de bloqueio garante que, na presença de declarações `INSERT` onde o número de strings não é conhecido antecipadamente (e onde números de auto-incremento são atribuídos à medida que a declaração progride), todos os valores de auto-incremento atribuídos por qualquer declaração "`INSERT`-like" sejam consecutivos, e as operações sejam seguras para replicação baseada em declaração.

Simplificando, esse modo de bloqueio melhora significativamente a escalabilidade, sendo seguro para uso com replicação baseada em declarações. Além disso, assim como no modo "tradicional", os números de autoincremento atribuídos por qualquer declaração são *consecutivos*. Não há *nenhuma mudança* na semântica em comparação com o modo "tradicional" para qualquer declaração que use autoincremento, com uma exceção importante.

A exceção é para os "insertos em modo misto", onde o usuário fornece valores explícitos para uma coluna `AUTO_INCREMENT` para algumas, mas não para todas, strings em um "inserto simples" de várias strings. Para esses insertos, `InnoDB` aloca mais valores de autoincremento do que o número de strings a serem inseridas. No entanto, todos os valores automaticamente atribuídos são gerados consecutivamente (e, portanto, são maiores que) o valor de autoincremento gerado pelo último comando executado anteriormente. Os números "excedentes" são perdidos.

* `innodb_autoinc_lock_mode = 2` (modo de bloqueio "entrelaçado")

Neste modo de bloqueio, nenhuma das declarações semelhantes ao `INSERT` usa o bloqueio de nível de tabela `AUTO-INC`, e várias declarações podem ser executadas ao mesmo tempo. Este é o modo de bloqueio mais rápido e escalável, mas *não é seguro* quando se usa replicação ou cenários de recuperação baseados em declarações, quando as declarações SQL são regravadas a partir do log binário.

Neste modo de bloqueio, os valores de auto-incremento são garantidos como únicos e aumentam de forma monótona em todas as declarações que são executadas simultaneamente semelhantes ao `INSERT`]. No entanto, como múltiplas declarações podem estar gerando números ao mesmo tempo (ou seja, a alocação de números é *intercalada* entre as declarações), os valores gerados para as strings inseridas por qualquer declaração dada podem não ser consecutivos.

Se as únicas declarações que executam são "inserções simples" onde o número de strings a serem inseridas é conhecido antecipadamente, não há lacunas nos números gerados para uma única declaração, exceto para "inserções em modo misto". No entanto, quando "inserções em massa" são executadas, pode haver lacunas nos valores de auto-incremento atribuídos por qualquer declaração dada.

##### Implicações do uso do modo de bloqueio AUTO_INCREMENT do InnoDB

* Uso do autoincremento com replicação

Se você estiver usando replicação baseada em declaração, defina `innodb_autoinc_lock_mode` para 0 ou 1 e use o mesmo valor na fonte e em suas réplicas. Os valores de auto-incremento não são garantidos para serem os mesmos nas réplicas e na fonte se você usar `innodb_autoinc_lock_mode` = 2 (“interligado”) ou configurações onde a fonte e as réplicas não usam o mesmo modo de bloqueio.

Se você estiver usando replicação baseada em string ou de formato misto, todos os modos de bloqueio de autoincremento são seguros, uma vez que a replicação baseada em string não é sensível à ordem de execução das instruções SQL (e o formato misto usa replicação baseada em string para quaisquer instruções que não sejam seguras para replicação baseada em declaração).

* Valores de autoincremento "perdidos" e lacunas na sequência

Em todos os modos de bloqueio (0, 1 e 2), se uma transação que gerou valores de autoincremento for revertida, esses valores de autoincremento são "perdidos". Uma vez que um valor é gerado para uma coluna de autoincremento, ele não pode ser revertido, independentemente de a declaração "`INSERT`-like" ser concluída e independentemente de a transação contendo ser revertida. Esses valores perdidos não são reutilizados. Assim, pode haver lacunas nos valores armazenados em uma coluna `AUTO_INCREMENT` de uma tabela.

* Especificar NULL ou 0 para a coluna `AUTO_INCREMENT`

Em todos os modos de bloqueio (0, 1 e 2), se um usuário especificar NULL ou 0 para a coluna `AUTO_INCREMENT` em um `INSERT`, o `InnoDB` trata a string como se o valor não tivesse sido especificado e gera um novo valor para ela.

* Atribuir um valor negativo à coluna `AUTO_INCREMENT`

Em todos os modos de bloqueio (0, 1 e 2), o comportamento do mecanismo de autoincremento é indefinido se você atribuir um valor negativo à coluna `AUTO_INCREMENT`.

* Se o valor `AUTO_INCREMENT` se tornar maior que o máximo inteiro para o tipo de inteiro especificado

Em todos os modos de bloqueio (0, 1 e 2), o comportamento do mecanismo de autoincremento é indefinido se o valor se tornar maior que o inteiro máximo que pode ser armazenado no tipo de inteiro especificado.

* Lacunas nos valores de autoincremento para “inserções em massa”

Com `innodb_autoinc_lock_mode` definido como 0 (“tradicional”) ou 1 (“consecutivo”), os valores de autoincremento gerados por qualquer declaração dada são consecutivos, sem lacunas, porque o bloqueio de nível de tabela `AUTO-INC` é mantido até o final da declaração, e apenas uma declaração desse tipo pode ser executada de cada vez.

Com `innodb_autoinc_lock_mode` definido em 2 (“interligado”), podem haver lacunas nos valores de autoincremento gerados por “inserções em massa”, mas apenas se houver declarações que executam “`INSERT`-like” simultaneamente.

Para os modos de bloqueio 1 ou 2, podem ocorrer lacunas entre as declarações sucessivas, porque, para inserções em massa, o número exato de valores de autoincremento necessários para cada declaração pode não ser conhecido e a superestimação é possível.

* Valores de autoincremento atribuídos por inserções em modo misto

Considere um "inserto em modo misto", onde um "inserto simples" especifica o valor de autoincremento para algumas (mas não todas) das strings resultantes. Tal declaração se comporta de maneira diferente nos modos de bloqueio 0, 1 e 2. Por exemplo, suponha que `c1` seja uma coluna `AUTO_INCREMENT` da tabela `t1`, e que o número de sequência gerado automaticamente mais recente seja 100.

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      -> c2 CHAR(1)
      -> ) ENGINE = INNODB;
  ```

Agora, considere a seguinte declaração de "inserção em modo misto":

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

Com `innodb_autoinc_lock_mode` definido como 0 (“tradicional”), as quatro novas strings são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

O próximo valor de autoincremento disponível é 103, porque os valores de autoincremento são alocados um de cada vez, não todos de uma vez no início da execução da declaração. Esse resultado é verdadeiro, independentemente de haver declarações "`INSERT`-like" (de qualquer tipo) sendo executadas simultaneamente ou

Com `innodb_autoinc_lock_mode` definido como 1 (“consecutivo”), as quatro novas strings também são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

No entanto, neste caso, o próximo valor de autoincremento disponível é 105, não 103, porque quatro valores de autoincremento são alocados no momento em que a declaração é processada, mas apenas dois são usados. Esse resultado é verdadeiro, independentemente de haver ou não declarações "`INSERT`-like" (de qualquer tipo) sendo executadas simultaneamente.

Com `innodb_autoinc_lock_mode` definido em 2 (“interligado”), as quatro novas strings são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  |   x | b    |
  |   5 | c    |
  |   y | d    |
  +-----+------+
  ```

Os valores de *`x`* e *`y`* são únicos e maiores do que quaisquer strings geradas anteriormente. No entanto, os valores específicos de *`x`* e *`y`* dependem do número de valores de auto-incremento gerados ao executar instruções simultaneamente.

Por fim, considere a seguinte declaração, emitida quando o número de sequência gerado mais recentemente é 100:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (101,'c'), (NULL,'d');
  ```

Com qualquer configuração do `innodb_autoinc_lock_mode`, esta declaração gera um erro de chave duplicada 23000 (`Can't write; duplicate key in table`) porque 101 é alocado para a string `(NULL, 'b')` e a inserção da string `(101, 'c')` falha.

* Modificando os valores da coluna `AUTO_INCREMENT` no meio de uma sequência de declarações `INSERT`

Em todos os modos de bloqueio (0, 1 e 2), modificar o valor de uma coluna `AUTO_INCREMENT` no meio de uma sequência de declarações `INSERT` pode levar a erros de “entrada duplicada”. Por exemplo, se você realizar uma operação `UPDATE` que altera o valor de uma coluna `AUTO_INCREMENT` para um valor maior que o valor atual máximo de autoincremento, operações subsequentes `INSERT` que não especificam um valor de autoincremento não utilizado podem encontrar erros de “entrada duplicada”. Esse comportamento é demonstrado no exemplo a seguir.

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT NOT NULL AUTO_INCREMENT,
      -> PRIMARY KEY (c1)
      ->  ) ENGINE = InnoDB;

  mysql> INSERT INTO t1 VALUES(0), (0), (3);

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  1 |
  |  2 |
  |  3 |
  +----+

  mysql> UPDATE t1 SET c1 = 4 WHERE c1 = 1;

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  2 |
  |  3 |
  |  4 |
  +----+

  mysql> INSERT INTO t1 VALUES(0);
  ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
  ```

##### Inicialização do contador de AUTO_INCREMENT do InnoDB

Esta seção descreve como o `InnoDB` inicializa os contadores do `AUTO_INCREMENT`.

Se você especificar uma coluna `AUTO_INCREMENT` para uma tabela `InnoDB`, o identificador da tabela no dicionário de dados `InnoDB` contém um contador especial chamado contador de auto-incremento que é usado na atribuição de novos valores para a coluna. Esse contador é armazenado apenas na memória principal, não no disco.

Para inicializar um contador de autoincremento após a reinicialização do servidor, `InnoDB` executa o equivalente à seguinte instrução na primeira inserção em uma tabela que contém uma coluna `AUTO_INCREMENT`.

```sql
SELECT MAX(ai_col) FROM table_name FOR UPDATE;
```

`InnoDB` incrementa o valor recuperado pela declaração e o atribui à coluna e ao contador de auto-incremento da tabela. Por padrão, o valor é incrementado em

1. Essa configuração padrão pode ser substituída pela configuração `auto_increment_increment`.

Se a tabela estiver vazia, `InnoDB` usa o valor `1`. Esse padrão pode ser substituído pela configuração `auto_increment_offset`.

Se uma declaração `SHOW TABLE STATUS` examinar a tabela antes que o contador de autoincremento seja inicializado, `InnoDB` inicializa, mas não incrementa o valor. O valor é armazenado para uso em inserções posteriores. Essa inicialização usa uma leitura de bloqueio exclusivo normal na tabela e o bloqueio dura até o final da transação. `InnoDB` segue o mesmo procedimento para inicializar o contador de autoincremento para uma tabela recém-criada.

Após o contador de auto-incremento ter sido inicializado, se você não especificar explicitamente um valor para uma coluna `AUTO_INCREMENT`, `InnoDB` incrementa o contador e atribui o novo valor à coluna. Se você inserir uma string que especifique explicitamente o valor da coluna, e o valor for maior que o valor atual do contador, o contador é definido para o valor da coluna especificado.

`InnoDB` utiliza o contador de autoincremento de memória enquanto o servidor estiver em funcionamento. Quando o servidor é desligado e reiniciado, `InnoDB` reiniicia o contador para cada tabela para o primeiro `INSERT` a tabela, conforme descrito anteriormente.

Um reinício do servidor também anula o efeito da opção da tabela `AUTO_INCREMENT = N` nas declarações de `CREATE TABLE` e `ALTER TABLE`, que você pode usar com as tabelas `InnoDB` para definir o valor inicial do contador ou alterar o valor atual do contador.

##### Notas

* Quando uma coluna inteira `AUTO_INCREMENT` fica sem valores, uma operação subsequente `INSERT` retorna um erro de chave duplicada. Esse é o comportamento geral do MySQL.

* Quando você reiniciar o servidor MySQL, `InnoDB` pode reutilizar um valor antigo que foi gerado para uma coluna `AUTO_INCREMENT`, mas nunca armazenado (ou seja, um valor que foi gerado durante uma transação antiga que foi revertida).

### 14.6.2 Índices

Esta seção abrange tópicos relacionados aos índices `InnoDB`.

#### 14.6.2.1 Índices agrupados e secundários

Cada tabela `InnoDB` possui um índice especial chamado índice agrupado que armazena os dados das strings. Tipicamente, o índice agrupado é sinônimo da chave primária. Para obter o melhor desempenho em consultas, inserções e outras operações de banco de dados, é importante entender como o `InnoDB` utiliza o índice agrupado para otimizar as operações de busca comum e DML.

* Quando você define um `PRIMARY KEY` em uma tabela, o `InnoDB` usa ele como índice agrupado. Uma chave primária deve ser definida para cada tabela. Se não houver uma coluna única lógica e não nula ou um conjunto de colunas para usar como chave primária, adicione uma coluna de auto-incremento. Os valores das colunas de auto-incremento são únicos e são adicionados automaticamente à medida que novas strings são inseridas.

* Se você não definir um `PRIMARY KEY` para uma tabela, o `InnoDB` usa o primeiro índice `UNIQUE` com todas as colunas chave definidas como `NOT NULL` como índice agrupado.

* Se uma tabela não tiver o índice `PRIMARY KEY` ou um índice adequado `UNIQUE`, o `InnoDB` gera um índice agrupado oculto chamado `GEN_CLUST_INDEX` em uma coluna sintética que contém valores de ID de string. As strings são ordenadas pelo ID de string que o `InnoDB` atribui. O ID de string é um campo de 6 bytes que aumenta de forma monótona à medida que novas strings são inseridas. Assim, as strings ordenadas pelo ID de string estão fisicamente em ordem de inserção.

##### Como o Índice Agrupado Acelera as Consultas

Aceder a uma string através do índice agrupado é rápido, pois a pesquisa do índice leva diretamente à página que contém os dados da string. Se uma tabela for grande, a arquitetura do índice agrupado frequentemente economiza uma operação de E/S de disco em comparação com organizações de armazenamento que armazenam os dados da string usando uma página diferente do registro do índice.

##### Como os índices secundários se relacionam com o índice agrupado

Os índices que não são indexados em agrupamento são conhecidos como índices secundários. Em `InnoDB`, cada registro em um índice secundário contém as colunas da chave primária da string, além das colunas especificadas para o índice secundário. `InnoDB` usa esse valor da chave primária para procurar a string no índice em agrupamento.

Se a chave primária for longa, os índices secundários utilizam mais espaço, portanto é vantajoso ter uma chave primária curta.

Para obter orientações sobre como aproveitar os índices agrupados e secundários `InnoDB`, consulte a Seção 8.3, “Otimização e índices”.

#### 14.6.2.2 A estrutura física de um índice InnoDB

Com exceção dos índices espaciais, os índices `InnoDB` são estruturas de dados de tipo B-tree. Os índices espaciais utilizam R-trees, que são estruturas de dados especializadas para indexação de dados multidimensionais. Os registros do índice são armazenados nas páginas de folha de sua estrutura de dados B-tree ou R-tree. O tamanho padrão de uma página de índice é de 16 KB. O tamanho da página é determinado pelo ajuste `innodb_page_size` quando a instância do MySQL é inicializada. Veja a Seção 14.8.1, “Configuração de Inicialização do InnoDB”.

Quando novos registros são inseridos em um índice agrupado `InnoDB`, o `InnoDB` tenta deixar 1/16 da página livre para futuras inserções e atualizações dos registros do índice. Se os registros do índice forem inseridos em ordem sequencial (ascendente ou descendente), as páginas do índice resultantes estarão aproximadamente 15/16 cheias. Se os registros forem inseridos em ordem aleatória, as páginas estarão de 1/2 a 15/16 cheias.

`InnoDB` realiza uma carga em massa ao criar ou reconstruir índices de árvore B. Esse método de criação de índices é conhecido como construção de índice ordenado. A variável `innodb_fill_factor` define a porcentagem de espaço em cada página da árvore B que é preenchida durante uma construção de índice ordenado, com o espaço restante reservado para o crescimento futuro do índice. Construções de índices ordenados não são suportadas para índices espaciais. Para mais informações, consulte a Seção 14.6.2.3, “Construções de Índices Ordenados”. Uma configuração `innodb_fill_factor` de 100 deixa 1/16 do espaço em páginas de índice agrupado livre para crescimento futuro do índice.

Se o fator de preenchimento de uma página de índice `InnoDB` cair abaixo do `MERGE_THRESHOLD`, que é 50% por padrão, se não especificado, o `InnoDB` tenta contrair a árvore de índice para liberar a página. A configuração `MERGE_THRESHOLD` aplica-se tanto aos índices de B-tree quanto de R-tree. Para mais informações, consulte a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

#### 14.6.2.3 Construção de índices ordenados

`InnoDB` realiza uma carga em massa em vez de inserir um registro de índice de cada vez ao criar ou reconstruir índices. Esse método de criação de índices também é conhecido como construção de índice ordenado. Construções de índices ordenados não são suportadas para índices espaciais.

Há três fases para a construção de um índice. Na primeira fase, o índice agrupado é verificado, e as entradas do índice são geradas e adicionadas ao buffer de ordenação. Quando o buffer de ordenação fica cheio, as entradas são ordenadas e escritas em um arquivo intermediário temporário. Esse processo também é conhecido como “execução”. Na segunda fase, com uma ou mais execuções escritas no arquivo intermediário temporário, uma ordenação por fusão é realizada em todas as entradas do arquivo. Na terceira e última fase, as entradas ordenadas são inseridas na árvore B.

Antes da introdução de construções de índice ordenadas, as entradas do índice eram inseridas no B-tree um registro de cada vez usando APIs de inserção. Esse método envolvia abrir um cursor do B-tree para encontrar a posição de inserção e, em seguida, inserir entradas em uma página do B-tree usando uma inserção otimista. Se uma inserção falhasse devido a uma página estar cheia, uma inserção pessimista seria realizada, que envolve abrir um cursor do B-tree e dividir e combinar nós do B-tree conforme necessário para encontrar espaço para a entrada. As desvantagens desse método "de cima para baixo" de construção de um índice são o custo de buscar uma posição de inserção e a constante divisão e combinação de nós do B-tree.

Os índices ordenados utilizam uma abordagem "de baixo para cima" para a construção de um índice. Com essa abordagem, uma referência à página mais à direita da árvore é mantida em todos os níveis da árvore B. A página mais à direita da árvore B na profundidade necessária é alocada e as entradas são inseridas de acordo com sua ordem ordenada. Uma vez que uma página esteja cheia, um ponteiro de nó é anexado à página pai e uma página de folha de irmão é alocada para o próximo inserto. Esse processo continua até que todas as entradas sejam inseridas, o que pode resultar em inserções até o nível da raiz. Quando uma página de irmão é alocada, a referência à página de folha anteriormente pinçada é liberada e a página de folha recém-alocada torna-se a página de folha mais à direita e nova localização de inserção padrão.

Reservar espaço de página de árvore B para crescimento futuro do índice

Para reservar espaço para o crescimento futuro do índice, você pode usar a variável `innodb_fill_factor` para reservar uma porcentagem do espaço da página do B-tree. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20 por cento do espaço nas páginas do B-tree durante a construção de um índice ordenado. Esta configuração se aplica tanto às páginas de folha do B-tree quanto às páginas não-folha. Não se aplica a páginas externas usadas para as entradas `TEXT` ou `BLOB`. O espaço reservado pode não ser exatamente conforme configurado, pois o valor `innodb_fill_factor` é interpretado como um indicativo em vez de um limite rígido.

##### Construção de índices ordenados e suporte a índice de texto completo

Os índices de construção ordenada são suportados para índices full-text. Anteriormente, o SQL era usado para inserir entradas em um índice full-text.

##### Construções de índice classificado e tabelas compactadas

Para tabelas compactadas, o método anterior de criação de índice anexava entradas tanto às páginas compactadas quanto às não compactadas. Quando o log de modificação (representando o espaço livre na página compactada) ficava cheio, a página compactada seria recompactada. Se a compressão falhasse devido à falta de espaço, a página seria dividida. Com construções de índice ordenadas, as entradas são anexadas apenas às páginas não compactadas. Quando uma página não compactada fica cheia, ela é compactada. O alinhamento adaptativo é usado para garantir que a compressão tenha sucesso na maioria dos casos, mas, se a compressão falhar, a página é dividida e a compressão é realizada novamente. Esse processo continua até que a compressão seja bem-sucedida. Para mais informações sobre a compressão de páginas B-Tree, consulte a Seção 14.9.1.5, “Como a compressão funciona para tabelas InnoDB”.

##### Construção de índices ordenados e registro de refazer

O registro redo é desativado durante a construção de um índice ordenado. Em vez disso, há um ponto de verificação para garantir que a construção do índice possa suportar uma saída ou falha inesperada. O ponto de verificação força a gravação de todas as páginas sujas no disco. Durante a construção de um índice ordenado, o thread do limpador de página é sinalizado periodicamente para esvaziar páginas sujas, garantindo que a operação do ponto de verificação possa ser processada rapidamente. Normalmente, o thread do limpador de página esvazia páginas sujas quando o número de páginas limpas cai abaixo de um limite definido. Para construções de índices ordenados, as páginas sujas são esvaziadas prontamente para reduzir o overhead do ponto de verificação e para paralelizar a atividade de E/S e CPU.

##### Construção de índices ordenados e estatísticas do otimizador

Os índices ordenados podem resultar em estatísticas do otimizador que diferem das geradas pelo método anterior de criação de índices. A diferença nas estatísticas, que não é esperada para afetar o desempenho da carga de trabalho, é devida ao algoritmo diferente usado para preencher o índice.

#### 14.6.2.4 Índices de Texto Completo InnoDB

Os índices de texto completo são criados em colunas baseadas em texto (colunas `CHAR`, `VARCHAR` ou `TEXT`) para acelerar consultas e operações de manipulação de dados (DML) nos dados contidos nessas colunas.

Um índice de texto completo é definido como parte de uma declaração `CREATE TABLE` ou adicionado a uma tabela existente usando `ALTER TABLE` ou `CREATE INDEX`.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() ... AGAINST`. Para informações sobre uso, consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

Os índices de texto completo `InnoDB` são descritos nos seguintes tópicos desta seção:

* Projeto de índice de texto completo InnoDB
* Tabelas de índice de texto completo InnoDB
* Cache de índice de texto completo InnoDB
* Coluna DOC_ID e FTS_DOC_ID do índice de texto completo InnoDB
* Gerenciamento de exclusão do índice de texto completo InnoDB
* Gerenciamento de transações do índice de texto completo InnoDB
* Monitoramento de índices de texto completo InnoDB

##### Projeto de índice de texto completo InnoDB

Os índices de texto completo `InnoDB` possuem um projeto de índice invertido. Os índices invertidos armazenam uma lista de palavras e, para cada palavra, uma lista de documentos nos quais a palavra aparece. Para suportar a pesquisa de proximidade, as informações de posição de cada palavra também são armazenadas, como um deslocamento de byte.

##### Tabelas de índice de texto completo InnoDB

Quando um índice de texto completo `InnoDB` é criado, um conjunto de tabelas de índice é criado, conforme mostrado no exemplo a seguir:

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200),
       FULLTEXT idx (opening_line)
       ) ENGINE=InnoDB;

mysql> SELECT table_id, name, space from INFORMATION_SCHEMA.INNODB_SYS_TABLES
       WHERE name LIKE 'test/%';
+----------+----------------------------------------------------+-------+
| table_id | name                                               | space |
+----------+----------------------------------------------------+-------+
|      333 | test/FTS_0000000000000147_00000000000001c9_INDEX_1 |   289 |
|      334 | test/FTS_0000000000000147_00000000000001c9_INDEX_2 |   290 |
|      335 | test/FTS_0000000000000147_00000000000001c9_INDEX_3 |   291 |
|      336 | test/FTS_0000000000000147_00000000000001c9_INDEX_4 |   292 |
|      337 | test/FTS_0000000000000147_00000000000001c9_INDEX_5 |   293 |
|      338 | test/FTS_0000000000000147_00000000000001c9_INDEX_6 |   294 |
|      330 | test/FTS_0000000000000147_BEING_DELETED            |   286 |
|      331 | test/FTS_0000000000000147_BEING_DELETED_CACHE      |   287 |
|      332 | test/FTS_0000000000000147_CONFIG                   |   288 |
|      328 | test/FTS_0000000000000147_DELETED                  |   284 |
|      329 | test/FTS_0000000000000147_DELETED_CACHE            |   285 |
|      327 | test/opening_lines                                 |   283 |
+----------+----------------------------------------------------+-------+
```

Os seis primeiros quadros de índice compõem o índice invertido e são referidos como quadros de índice auxiliar. Quando os documentos recebidos são tokenizados, as palavras individuais (também referidas como “tokens”) são inseridas nos quadros de índice juntamente com informações de posição e um `DOC_ID` associado. As palavras são totalmente ordenadas e divididas entre os seis quadros de índice com base no peso de classificação do conjunto de caracteres do primeiro caractere da palavra.

O índice invertido é dividido em seis tabelas de índice auxiliar para suportar a criação de índice paralelo. Por padrão, dois threads tokenizam, classificam e inserem palavras e dados associados nas tabelas de índice. O número de threads que realizam esse trabalho é configurável usando a variável `innodb_ft_sort_pll_degree`. Considere aumentar o número de threads ao criar índices de texto completo em tabelas grandes.

Os nomes dos índices auxiliares são prefixados com `fts_` e pós-fixados com `index_#`. Cada tabela de índice auxiliar é associada à tabela indexada por um valor hexadecimal no nome da tabela de índice auxiliar que corresponde ao `table_id` da tabela indexada. Por exemplo, o `table_id` da tabela `test/opening_lines` é `327`, para o qual o valor hexadecimal é 0x147. Como mostrado no exemplo anterior, o valor hexadecimal “147” aparece nos nomes dos índices auxiliares que estão associados à tabela `test/opening_lines`.

Um valor hexadecimal que representa o `index_id` do índice de texto completo também aparece nos nomes das tabelas de índice auxiliar. Por exemplo, no nome da tabela auxiliar `test/FTS_0000000000000147_00000000000001c9_INDEX_1`, o valor hexadecimal `1c9` tem um valor decimal de 457. O índice definido na tabela `opening_lines` (`idx`) pode ser identificado consultando a tabela do Esquema de Informações `INNODB_SYS_INDEXES` para este valor (457).

```sql
mysql> SELECT index_id, name, table_id, space from INFORMATION_SCHEMA.INNODB_SYS_INDEXES
       WHERE index_id=457;
+----------+------+----------+-------+
| index_id | name | table_id | space |
+----------+------+----------+-------+
|      457 | idx  |      327 |   283 |
+----------+------+----------+-------+
```

As tabelas de índice são armazenadas em seu próprio espaço de tabela se a tabela principal for criada em um espaço de tabela por arquivo. Caso contrário, as tabelas de índice são armazenadas no espaço de tabela onde a tabela indexada reside.

As outras tabelas de índice mostradas no exemplo anterior são referidas como tabelas de índice comuns e são usadas para o tratamento de exclusão e armazenamento do estado interno dos índices de texto completo. Ao contrário das tabelas de índice invertido, que são criadas para cada índice de texto completo, este conjunto de tabelas é comum a todos os índices de texto completo criados em uma tabela específica.

As tabelas de índice comuns são mantidas mesmo se os índices de texto completo forem removidos. Quando um índice de texto completo é removido, a coluna `FTS_DOC_ID` que foi criada para o índice é mantida, pois a remoção da coluna `FTS_DOC_ID` exigiria a reconstrução da tabela previamente indexada. As tabelas de índice comuns são necessárias para gerenciar a coluna `FTS_DOC_ID`.

* `FTS_*_DELETED` e `FTS_*_DELETED_CACHE`

Contêm os IDs de documentos (DOC_ID) para documentos que foram excluídos, mas cujos dados ainda não foram removidos do índice de texto completo. O `FTS_*_DELETED_CACHE` é a versão de memória da tabela `FTS_*_DELETED`.

* `FTS_*_BEING_DELETED` e `FTS_*_BEING_DELETED_CACHE`

Contêm os IDs de documentos (DOC_ID) para documentos que são excluídos e cujos dados estão atualmente em processo de remoção do índice de texto completo. A tabela `FTS_*_BEING_DELETED_CACHE` é a versão de memória da tabela `FTS_*_BEING_DELETED`.

* `FTS_*_CONFIG`

Armazena informações sobre o estado interno do índice de texto completo. Mais importante, ele armazena o `FTS_SYNCED_DOC_ID`, que identifica documentos que foram analisados e descarregados no disco. Em caso de recuperação após falha, os valores do `FTS_SYNCED_DOC_ID` são usados para identificar documentos que não foram descarregados no disco, para que os documentos possam ser analisados novamente e adicionados de volta ao cache do índice de texto completo. Para visualizar os dados nesta tabela, consulte a tabela do Esquema de Informações `INNODB_FT_CONFIG`.

##### Cache de índice de texto completo InnoDB

Quando um documento é inserido, ele é tokenizado e as palavras individuais e os dados associados são inseridos no índice de texto completo. Esse processo, mesmo para documentos pequenos, pode resultar em inúmeras inserções pequenas nas tabelas de índice auxiliar, tornando o acesso concorrente a essas tabelas um ponto de contenção. Para evitar esse problema, `InnoDB` usa uma cache de índice de texto completo para armazenar temporariamente as inserções das tabelas de índice para as strings recentemente inseridas. Essa estrutura de cache de memória mantém as inserções até que a cache esteja cheia e, em seguida, as descarta em lote no disco (para as tabelas de índice auxiliar). Você pode consultar a tabela do esquema de informações `INNODB_FT_INDEX_CACHE` para visualizar os dados tokenizados para as strings recentemente inseridas.

O comportamento de cache e limpeza em lote evita atualizações frequentes em tabelas de índice auxiliares, o que poderia resultar em problemas de acesso concorrente durante períodos de inserção e atualização ocupados. A técnica de agrupamento também evita múltiplas inserções para a mesma palavra e minimiza entradas duplicadas. Em vez de limpar cada palavra individualmente, as inserções para a mesma palavra são unidas e limpadas para o disco como uma única entrada, melhorando a eficiência da inserção enquanto mantém as tabelas de índice auxiliares o mais pequenas possível.

A variável `innodb_ft_cache_size` é usada para configurar o tamanho do cache do índice de texto completo (em uma base por tabela), o que afeta quantas vezes o cache do índice de texto completo é esvaziado. Você também pode definir um limite global de tamanho do cache de índice de texto completo para todas as tabelas em uma instância específica usando a variável `innodb_ft_total_cache_size`.

O cache do índice de texto completo armazena as mesmas informações que as tabelas de índice auxiliares. No entanto, o cache do índice de texto completo armazena apenas dados tokenizados para strings inseridas recentemente. Os dados que já foram descarregados no disco (para as tabelas de índice auxiliares) não são trazidos de volta para o cache do índice de texto completo quando solicitado. Os dados das tabelas de índice auxiliares são consultados diretamente, e os resultados das tabelas de índice auxiliares são mesclados com os resultados do cache do índice de texto completo antes de serem retornados.

##### Índice de Texto Completo InnoDB DOC_ID e FTS_DOC_ID Coluna

`InnoDB` utiliza um identificador de documento único, referido como `DOC_ID`, para mapear palavras no índice de texto completo para registros de documento onde a palavra aparece. O mapeamento requer uma coluna `FTS_DOC_ID` na tabela indexada. Se uma coluna `FTS_DOC_ID` não for definida, `InnoDB` adiciona automaticamente uma coluna oculta `FTS_DOC_ID` quando o índice de texto completo é criado. O exemplo a seguir demonstra esse comportamento.

A definição da tabela a seguir não inclui uma coluna `FTS_DOC_ID`:

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Quando você cria um índice de texto completo na tabela usando a sintaxe `CREATE FULLTEXT INDEX`, um aviso é retornado, informando que o `InnoDB` está reconstruindo a tabela para adicionar a coluna `FTS_DOC_ID`.

```sql
mysql> CREATE FULLTEXT INDEX idx ON opening_lines(opening_line);
Query OK, 0 rows affected, 1 warning (0.19 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------------+
| Level   | Code | Message                                          |
+---------+------+--------------------------------------------------+
| Warning |  124 | InnoDB rebuilding table to add column FTS_DOC_ID |
+---------+------+--------------------------------------------------+
```

O mesmo aviso é retornado ao usar `ALTER TABLE` para adicionar um índice de texto completo a uma tabela que não tem uma coluna `FTS_DOC_ID`. Se você criar um índice de texto completo no momento `CREATE TABLE` e não especificar uma coluna `FTS_DOC_ID`, `InnoDB` adiciona uma coluna oculta `FTS_DOC_ID`, sem aviso.

Definir uma coluna `FTS_DOC_ID` no momento de `CREATE TABLE` é menos caro do que criar um índice de texto completo em uma tabela que já está carregada com dados. Se uma coluna `FTS_DOC_ID` for definida em uma tabela antes do carregamento de dados, a tabela e seus índices não precisam ser reconstruídos para adicionar a nova coluna. Se você não se preocupa com o desempenho `CREATE FULLTEXT INDEX`, deixe a coluna `FTS_DOC_ID` de fora para que `InnoDB` a crie para você. `InnoDB` cria uma coluna oculta `FTS_DOC_ID` juntamente com um índice único (`FTS_DOC_ID_INDEX`) na coluna `FTS_DOC_ID`. Se você deseja criar sua própria coluna `FTS_DOC_ID`, a coluna deve ser definida como `BIGINT UNSIGNED NOT NULL` e denominada `FTS_DOC_ID` (todas maiúsculas), como no exemplo a seguir:

Nota

A coluna `FTS_DOC_ID` não precisa ser definida como uma coluna `AUTO_INCREMENT`, mas fazer isso pode facilitar o carregamento dos dados.

```sql
mysql> CREATE TABLE opening_lines (
       FTS_DOC_ID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Se você optar por definir a coluna `FTS_DOC_ID` você é responsável por gerenciar a coluna para evitar valores vazios ou duplicados. Os valores de `FTS_DOC_ID` não podem ser reutilizados, o que significa que os valores de `FTS_DOC_ID` devem ser sempre crescentes.

Opcionalmente, você pode criar o `FTS_DOC_ID_INDEX` necessário (todos em maiúsculas) na coluna `FTS_DOC_ID`.

```sql
mysql> CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on opening_lines(FTS_DOC_ID);
```

Se você não criar o `FTS_DOC_ID_INDEX`, o `InnoDB` o cria automaticamente.

Antes do MySQL 5.7.13, a lacuna permitida entre o maior valor usado do `FTS_DOC_ID` e o novo valor do `FTS_DOC_ID` era de 10000. No MySQL 5.7.13 e versões posteriores, a lacuna permitida é de 65535.

Para evitar a reconstrução da tabela, a coluna `FTS_DOC_ID` é mantida ao descartar um índice de texto completo.

##### Manipulação da Deleção de Índices de Texto Completo do InnoDB

A exclusão de um registro que possui uma coluna de índice de texto completo pode resultar em inúmeras pequenas exclusões nas tabelas de índice auxiliar, tornando o acesso concorrente a essas tabelas um ponto de contenção. Para evitar esse problema, o `DOC_ID` de um documento excluído é registrado em uma tabela especial `FTS_*_DELETED` sempre que um registro é excluído de uma tabela indexada, e o registro indexado permanece no índice de texto completo. Antes de retornar os resultados da consulta, as informações na tabela `FTS_*_DELETED` são usadas para filtrar os `DOC_ID`s excluídos. O benefício desse design é que as exclusões são rápidas e econômicas. O inconveniente é que o tamanho do índice não é reduzido imediatamente após a exclusão de registros. Para remover entradas de índice de texto completo para registros excluídos, execute `OPTIMIZE TABLE` na tabela indexada com `innodb_optimize_fulltext_only=ON` para reconstruir o índice de texto completo. Para mais informações, consulte a otimização de índices de texto completo InnoDB.

##### Manipulação de transações de índice de texto completo InnoDB

Os índices de texto completo `InnoDB` têm características especiais de manipulação de transações devido ao seu comportamento de cache e processamento em lote. Especificamente, as atualizações e inserções em um índice de texto completo são processadas no momento do commit da transação, o que significa que uma pesquisa de texto completo só pode ver dados comprometidos. O exemplo a seguir demonstra esse comportamento. A pesquisa de texto completo só retorna um resultado após as strings inseridas serem comprometidas.

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200),
       FULLTEXT idx (opening_line)
       ) ENGINE=InnoDB;

mysql> BEGIN;

mysql> INSERT INTO opening_lines(opening_line,author,title) VALUES
       ('Call me Ishmael.','Herman Melville','Moby-Dick'),
       ('A screaming comes across the sky.','Thomas Pynchon','Gravity\'s Rainbow'),
       ('I am an invisible man.','Ralph Ellison','Invisible Man'),
       ('Where now? Who now? When now?','Samuel Beckett','The Unnamable'),
       ('It was love at first sight.','Joseph Heller','Catch-22'),
       ('All this happened, more or less.','Kurt Vonnegut','Slaughterhouse-Five'),
       ('Mrs. Dalloway said she would buy the flowers herself.','Virginia Woolf','Mrs. Dalloway'),
       ('It was a pleasure to burn.','Ray Bradbury','Fahrenheit 451');

mysql> SELECT COUNT(*) FROM opening_lines WHERE MATCH(opening_line) AGAINST('Ishmael');
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+

mysql> COMMIT;

mysql> SELECT COUNT(*) FROM opening_lines WHERE MATCH(opening_line) AGAINST('Ishmael');
+----------+
| COUNT(*) |
+----------+
|        1 |
+----------+
```

##### Monitoramento de índices full-text InnoDB

Você pode monitorar e examinar os aspectos especiais de processamento de texto do índice de texto completo `InnoDB` fazendo uma consulta nas seguintes tabelas `INFORMATION_SCHEMA`:

* `INNODB_FT_CONFIG`
* `INNODB_FT_INDEX_TABLE`
* `INNODB_FT_INDEX_CACHE`
* `INNODB_FT_DEFAULT_STOPWORD`
* `INNODB_FT_DELETED`
* `INNODB_FT_BEING_DELETED`

Você também pode visualizar informações básicas para índices de texto completo e tabelas, fazendo uma consulta a `INNODB_SYS_INDEXES` e `INNODB_SYS_TABLES`.

Para mais informações, consulte a Seção 14.16.4, “Tabelas de índice FULLTEXT do InnoDB INFORMATION_SCHEMA”.

### 14.6.3 Tablespaces

Esta seção abrange tópicos relacionados aos `InnoDB` tablespaces.

#### 14.6.3.1 Espaço de tabelas do sistema

O espaço de tabela do sistema é a área de armazenamento para o dicionário de dados `InnoDB`, o buffer de dupla escrita, o buffer de alterações e os registros de desfazer. Ele também pode conter dados de tabela e índice, se as tabelas forem criadas no espaço de tabela do sistema, em vez de espaços de tabela por tabela ou espaços de tabela gerais.

O espaço de tabelas do sistema pode ter um ou mais arquivos de dados. Por padrão, um único arquivo de dados de espaço de tabelas do sistema, denominado `ibdata1`, é criado no diretório de dados. O tamanho e o número de arquivos de dados de espaço de tabelas do sistema são definidos pela opção de inicialização `innodb_data_file_path`. Para informações de configuração, consulte Configuração do Arquivo de Dados do Espaço de Tabelas do Sistema.

Informações adicionais sobre o espaço de tabela do sistema são fornecidas nos tópicos a seguir na seção:

* Redimensionar o espaço de tabela do sistema
* Usar partições de disco bruto para o espaço de tabela do sistema

Redimensionar o espaço de tabela do sistema

Esta seção descreve como aumentar ou diminuir o tamanho do espaço de tabela do sistema.

###### Aumentar o tamanho do espaço de tabela do sistema

A maneira mais fácil de aumentar o tamanho do espaço de tabela do sistema é configurá-lo para ser auto-extensibilidade. Para fazer isso, especifique o atributo `autoextend` para o último arquivo de dados no ajuste `innodb_data_file_path` e reinicie o servidor. Por exemplo:

```sql
innodb_data_file_path=ibdata1:10M:autoextend
```

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 8 MB à medida que o espaço necessário é exigido. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Você também pode aumentar o tamanho do espaço de tabela do sistema adicionando outro arquivo de dados. Para fazer isso:

1. Parar o servidor MySQL. 2. Se o último arquivo de dados na configuração `innodb_data_file_path` estiver definido com o atributo `autoextend`, remova-o e modifique o atributo de tamanho para refletir o tamanho atual do arquivo de dados. Para determinar o tamanho de arquivo de dados apropriado a ser especificado, verifique o tamanho do arquivo no seu sistema de arquivos e arredonde esse valor para o valor mais próximo em MB, onde um MB é igual a 1024 x 1024 bytes.

3. Adicione um novo arquivo de dados ao ajuste `innodb_data_file_path`, especificando opcionalmente o atributo `autoextend`. O atributo `autoextend` pode ser especificado apenas para o último arquivo de dados no ajuste `innodb_data_file_path`.

4. Inicie o servidor MySQL.

Por exemplo, este tablespace tem um arquivo de dados com expansão automática:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:10M:autoextend
```

Suponha que o arquivo de dados tenha crescido para 988 MB ao longo do tempo. Esta é a configuração `innodb_data_file_path` após a modificação do atributo de tamanho para refletir o tamanho atual do arquivo de dados, e após a especificação de um novo arquivo de dados auto-extensibile de 50 MB:

```sql
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:988M;/disk2/ibdata2:50M:autoextend
```

Ao adicionar um novo arquivo de dados, não especifique um nome de arquivo existente. `InnoDB` cria e inicializa o novo arquivo de dados quando você inicia o servidor.

Nota

Você não pode aumentar o tamanho de um arquivo de dados de espaço de tabela de sistema existente, alterando seu atributo de tamanho. Por exemplo, alterar o ajuste `innodb_data_file_path` de `ibdata1:10M:autoextend` para `ibdata1:12M:autoextend` produz o seguinte erro ao iniciar o servidor:

```sql
[ERROR] [MY-012263] [InnoDB] The Auto-extending innodb_system
data file './ibdata1' is of a different size 640 pages (rounded down to MB) than
specified in the .cnf file: initial 768 pages, max 0 (relevant if non-zero) pages!
```

O erro indica que o tamanho do arquivo de dados existente (expresso em páginas `InnoDB`) é diferente do tamanho do arquivo de dados especificado no arquivo de configuração. Se você encontrar esse erro, restaure a configuração anterior `innodb_data_file_path` e consulte as instruções para o redimensionamento do espaço de tabela do sistema.

###### Reduzindo o tamanho do espaço de tabela do sistema InnoDB

Você não pode remover um arquivo de dados do espaço de tabela do sistema. Para diminuir o tamanho do espaço de tabela do sistema, use este procedimento:

1. Use o **mysqldump** para drenar todas as suas tabelas do `InnoDB` (incluindo as tabelas do `InnoDB` localizadas no esquema do `mysql`). Identifique as tabelas do `InnoDB` no esquema do `mysql` usando a seguinte consulta:

   ```sql
   mysql> SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='mysql' and ENGINE='InnoDB';
   +---------------------------+
   | TABLE_NAME                |
   +---------------------------+
   | engine_cost               |
   | gtid_executed             |
   | help_category             |
   | help_keyword              |
   | help_relation             |
   | help_topic                |
   | innodb_index_stats        |
   | innodb_table_stats        |
   | plugin                    |
   | server_cost               |
   | servers                   |
   | slave_master_info         |
   | slave_relay_log_info      |
   | slave_worker_info         |
   | time_zone                 |
   | time_zone_leap_second     |
   | time_zone_name            |
   | time_zone_transition      |
   | time_zone_transition_type |
   +---------------------------+
   ```

2. Parar o servidor.
3. Remover todos os arquivos do espaço de tabela existentes (`*.ibd`), incluindo os arquivos `ibdata` e `ib_log`. Não se esqueça de remover os arquivos `*.ibd` para tabelas localizadas no esquema `mysql`.

4. Remova quaisquer arquivos `.frm` para as tabelas `InnoDB`.

5. Configure os arquivos de dados para o novo espaço de tabela do sistema. Veja Configuração de Arquivo de Dados do Espaço de Tabela do Sistema.

6. Reinicie o servidor. 7. Importe os arquivos de dump.

Nota

Se seus bancos de dados usam apenas o motor `InnoDB`, pode ser mais simples descartar **todos** os bancos de dados, parar o servidor, remover todos os arquivos de registro do `InnoDB`, reiniciar o servidor e importar os arquivos de descarte.

Para evitar um grande espaço de tabelas do sistema, considere usar espaços de tabelas por arquivo ou espaços de tabelas gerais para seus dados. Espaços de tabelas por arquivo são o tipo de espaço de tabelas padrão e são usados implicitamente ao criar uma tabela `InnoDB`. Ao contrário do espaço de tabelas do sistema, os espaços de tabelas por arquivo devolvem espaço em disco ao sistema operacional quando são truncados ou eliminados. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de tabelas por arquivo”. Espaços de tabelas gerais são espaços de tabelas multitabela que também podem ser usados como alternativa ao espaço de tabelas do sistema. Consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

##### Usando Partições de Disco Bruto para o Espaço de Tabela do Sistema

As partições de disco bruto podem ser usadas como arquivos de dados de espaço de tabela do sistema. Essa técnica permite o I/O não bufferizado no Windows e em alguns sistemas Linux e Unix sem sobrecarga do sistema de arquivos. Realize testes com e sem partições brutais para verificar se elas melhoram o desempenho do seu sistema.

Ao usar uma partição de disco bruto, certifique-se de que o ID de usuário que executa o servidor MySQL tenha privilégios de leitura e escrita para essa partição. Por exemplo, se estiver executando o servidor como o usuário `mysql`, a partição deve ser legível e gravável pelo `mysql`. Se estiver executando o servidor com a opção `--memlock`, o servidor deve ser executado como `root`, então a partição deve ser legível e gravável pelo `root`.

Os procedimentos descritos abaixo envolvem a modificação do arquivo de opção. Para informações adicionais, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

###### Atribuindo uma Partição de Disco Bruto em Sistemas Linux e Unix

1. Para usar um dispositivo bruto para uma nova instância do servidor, prepare primeiro o arquivo de configuração definindo `innodb_data_file_path` com a palavra-chave `raw`. Por exemplo:

   ```sql
   [mysqld]
   innodb_data_home_dir=
   innodb_data_file_path=/dev/hdd1:3Graw;/dev/hdd2:2Graw
   ```

A partição deve ter pelo menos o tamanho que você especificar. Observe que 1 MB em `InnoDB` é 1024 × 1024 bytes, enquanto 1 MB nas especificações de disco geralmente significa 1.000.000 bytes.

2. Em seguida, inicialize o servidor pela primeira vez usando `--initialize` ou `--initialize-insecure`. O InnoDB nota a palavra-chave `raw` e inicializa a nova partição, e depois ele para o servidor.

3. Agora, reinicie o servidor. `InnoDB` agora permite que alterações sejam feitas.

###### Atribuindo uma Partição de Disco Bruto no Windows

Nos sistemas Windows, os mesmos passos e as diretrizes que acompanham os descritos para sistemas Linux e Unix se aplicam, exceto que o ajuste `innodb_data_file_path` difere ligeiramente no Windows. Por exemplo:

```sql
[mysqld]
innodb_data_home_dir=
innodb_data_file_path=//./D::10Graw
```

O `//./` corresponde à sintaxe do Windows do `\\.\` para acessar unidades físicas. No exemplo acima, `D:` é a letra de unidade da partição.

#### 14.6.3.2 Espaços de tabela por arquivo

Um espaço de tabela por arquivo contém dados e índices para uma única tabela `InnoDB`, e é armazenado no sistema de arquivos em um único arquivo de dados.

As características do espaço de tabela por arquivo são descritas nos seguintes tópicos desta seção:

* Configuração do espaço de tabela por arquivo
* Arquivos de dados do espaço de tabela por tabela
* Vantagens do espaço de tabela por arquivo
* Desvantagens do espaço de tabela por arquivo

##### Configuração do espaço de tabela por arquivo

`InnoDB` cria tabelas em espaços de tabela por arquivo por padrão. Esse comportamento é controlado pela variável `innodb_file_per_table`. Desabilitando `innodb_file_per_table`, o `InnoDB` faz com que crie tabelas no espaço de tabelas do sistema.

Uma configuração `innodb_file_per_table` pode ser especificada em um arquivo de opções ou configurada em tempo de execução usando uma declaração `SET GLOBAL`. Alterar a configuração em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

Arquivo de opção:

```sql
[mysqld]
innodb_file_per_table=ON
```

Usando `SET GLOBAL` em tempo de execução:

```sql
mysql> SET GLOBAL innodb_file_per_table=ON;
```

`innodb_file_per_table` é ativado por padrão no MySQL 5.6 e versões posteriores. Você pode considerar desativá-lo se a compatibilidade reversa com versões anteriores do MySQL é uma preocupação.

Aviso

Desabilitar `innodb_file_per_table` impede que as operações de cópia de tabela `ALTER TABLE` mudem implicitamente uma tabela que reside no espaço de tabela do sistema para um espaço de tabela por tabela. Uma operação de cópia de tabela `ALTER TABLE` recria a tabela usando a configuração atual de `innodb_file_per_table`. Esse comportamento não se aplica ao adicionar ou excluir índices secundários, nem se aplica às operações de `ALTER TABLE` que utilizam o algoritmo `INPLACE`, ou a tabelas adicionadas ao espaço de tabela do sistema usando a sintaxe de `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`.

##### Arquivos de dados do espaço de tabela por tabela

Um espaço de tabela por arquivo é criado em um arquivo de dados `.ibd` em um diretório de esquema sob o diretório de dados do MySQL. O arquivo `.ibd` é nomeado para a tabela (`table_name.ibd`). Por exemplo, o arquivo de dados para a tabela `test.t1` é criado no diretório `test` sob o diretório de dados do MySQL:

```sql
mysql> USE test;

mysql> CREATE TABLE t1 (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(100)
 ) ENGINE = InnoDB;

$> cd /path/to/mysql/data/test
$> ls
t1.ibd
```

Você pode usar a cláusula `DATA DIRECTORY` da declaração `CREATE TABLE` para criar implicitamente um arquivo de dados de espaço de tabela por tabela fora do diretório de dados. Para mais informações, consulte a Seção 14.6.1.2, “Criando tabelas externamente”.

##### File-Per-Table Tablespace: Vantagens

Os espaços de tabela por arquivo têm as seguintes vantagens em relação aos espaços de tabela compartilhados, como o espaço de tabela do sistema ou os espaços de tabela gerais.

O espaço em disco é devolvido ao sistema operacional após a truncagem ou eliminação de uma tabela criada em um espaço de tabela por tabela. A truncagem ou eliminação de uma tabela armazenada em um espaço de tabela compartilhado cria espaço livre dentro do arquivo de dados do espaço de tabela compartilhado, que só pode ser usado para dados do `InnoDB`. Em outras palavras, um arquivo de dados de um espaço de tabela compartilhado não diminui em tamanho após a truncagem ou eliminação de uma tabela.

* Uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço em disco ocupado pelo espaço de tabelas. Tais operações podem exigir tanto espaço adicional quanto os dados da tabela mais os índices. Esse espaço não é liberado de volta ao sistema operacional, como é o caso dos espaços de tabelas por arquivo.

* O desempenho do `TRUNCATE TABLE` é melhor quando executado em tabelas que residem em espaços de tabela por arquivo.

* Os arquivos de dados do espaço de tabela por tabela podem ser criados em dispositivos de armazenamento separados para otimização de I/O, gerenciamento de espaço ou fins de backup. Consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”.

* Você pode importar uma tabela que reside em um espaço de tabela por arquivo de tabelas de outra instância do MySQL. Veja a Seção 14.6.1.3, “Importando tabelas InnoDB”.

* As tabelas criadas em espaços de tabela por arquivo utilizam o formato de arquivo Barracuda. Consulte a Seção 14.10, “Gestão do formato de arquivo InnoDB”. O formato de arquivo Barracuda permite recursos associados aos formatos de string `DYNAMIC` e `COMPRESSED`. Consulte a Seção 14.11, “Formatos de string InnoDB”.

* As tabelas armazenadas em arquivos de dados de espaço de tabela individual podem economizar tempo e melhorar as chances de recuperação bem-sucedida quando ocorre corrupção de dados, quando os backups ou logs binários estão indisponíveis ou quando a instância do servidor MySQL não pode ser reiniciada.

* Você pode fazer backup ou restaurar tabelas criadas em espaços de tabela por tabela rapidamente usando o MySQL Enterprise Backup, sem interromper o uso de outras tabelas `InnoDB`. Isso é benéfico para tabelas com cronogramas de backup variados ou que exigem backup com menos frequência. Veja Fazendo um backup parcial para obter detalhes.

Os espaços de tabela por arquivo permitem o monitoramento do tamanho da tabela no sistema de arquivos, monitorando o tamanho do arquivo de dados do espaço de tabela.

* Os sistemas de arquivos comuns do Linux não permitem gravações concorrentes em um único arquivo, como um arquivo de dados de espaço de tabelas compartilhado, quando `innodb_flush_method` está definido como `O_DIRECT`. Como resultado, há possíveis melhorias de desempenho ao usar espaços de tabela por arquivo em conjunto com essa configuração.

* As tabelas em um espaço de tabelas compartilhado são limitadas pelo limite de tamanho do espaço de tabelas de 64 TB. Em comparação, cada espaço de tabelas por arquivo tem um limite de tamanho de 64 TB, o que oferece bastante espaço para que as tabelas individuais cresçam em tamanho.

Desvantagens do espaço de armazenamento por tabela ##### File-Per-Table Tablespace

Os espaços de tabela por arquivo têm as seguintes desvantagens em comparação com os espaços de tabela compartilhados, como o espaço de tabelas do sistema ou os espaços de tabelas gerais.

* Com espaços de tabela por arquivo, cada tabela pode ter espaço não utilizado que só pode ser utilizado por strings da mesma tabela, o que pode levar a desperdício de espaço se não for gerenciado adequadamente.

* As operações `fsync` são realizadas em múltiplos arquivos por tabela, em vez de um único arquivo de dados de espaço de tabela compartilhado. Como as operações `fsync` são por arquivo, as operações de escrita para múltiplas tabelas não podem ser combinadas, o que pode resultar em um número total maior de operações `fsync`.

* `mysqld` deve manter um controle de arquivo aberto para cada espaço de tabela por arquivo, o que pode afetar o desempenho se você tiver várias tabelas em espaços de tabela por arquivo.

* São necessários mais descritores de arquivo quando cada tabela tem seu próprio arquivo de dados.

* Há potencial para mais fragmentação, o que pode impedir o desempenho do `DROP TABLE` e do varredura de tabela. No entanto, se a fragmentação for gerenciada, os espaços de tabela por arquivo podem melhorar o desempenho dessas operações.

* O buffer pool é verificado ao descartar uma tabela que reside em um espaço de tabela por arquivo, o que pode levar vários segundos para pools de buffer grandes. A verificação é realizada com um bloqueio interno amplo, o que pode atrasar outras operações.

* A variável `innodb_autoextend_increment`, que define o tamanho do incremento para a extensão do tamanho de um arquivo de espaço compartilhado auto-extensível quando ele se torna cheio, não se aplica a arquivos de espaço de tabela por arquivo, que são auto-extensíveis independentemente da configuração do `innodb_autoextend_increment`. As extensões iniciais de espaço de tabela por arquivo são em pequenas quantidades, após as quais as extensões ocorrem em incrementos de 4 MB.

#### 14.6.3.3 Tabelaspaces Gerais

Um espaço de tabela geral é um espaço de tabela `InnoDB` compartilhado que é criado usando a sintaxe `CREATE TABLESPACE`. As capacidades e características do espaço de tabela geral são descritas nos seguintes tópicos desta seção:

* Capacidades gerais do espaço de tabelas
* Criando um espaço de tabelas geral
* Adicionando tabelas a um espaço de tabelas geral
* Suporte ao formato de string de um espaço de tabelas geral
* Movendo tabelas entre espaços de tabelas usando ALTER TABLE
* Retirando um espaço de tabelas geral
* Limitações do espaço de tabelas geral

##### Capacidades do Espaço de Tabela Geral

Os espaços de tabela gerais oferecem as seguintes funcionalidades:

* Semelhante às tabelas de espaço de sistema, os espaços de tabelas gerais são espaços de tabelas compartilhados capazes de armazenar dados para várias tabelas.

* Os espaços de tabela gerais têm uma vantagem de memória potencial em relação aos espaços de tabela por arquivo. O servidor mantém o metadados do espaço de tabela na memória durante a vida útil de um espaço de tabela. Várias tabelas em menos espaços de tabela gerais consomem menos memória para metadados do espaço de tabela do que o mesmo número de tabelas em espaços de tabela separados por arquivo.

* Os arquivos de dados de espaço de tabela geral podem ser colocados em um diretório relativo ao diretório de dados do MySQL ou independente dele, o que lhe oferece muitas das capacidades de gerenciamento de arquivos e armazenamento de espaços de tabela por tabela. Assim como os espaços de tabela por tabela, a capacidade de colocar arquivos de dados fora do diretório de dados do MySQL permite que você gerencie o desempenho de tabelas críticas separadamente, configure RAID ou DRBD para tabelas específicas ou vincule tabelas a discos específicos, por exemplo.

* Os espaços de tabela gerais suportam tanto os formatos de arquivo Antelope quanto Barracuda, e, portanto, suportam todos os formatos de string de tabela e recursos associados. Com suporte para ambos os formatos de arquivo, os espaços de tabela gerais não dependem de configurações de `innodb_file_format` ou `innodb_file_per_table`, e essas variáveis também não têm efeito nos espaços de tabela gerais.

* A opção `TABLESPACE` pode ser usada com `CREATE TABLE` para criar tabelas em um espaço de tabelas geral, espaço de tabelas por arquivo ou no espaço de tabelas de sistema.

* A opção `TABLESPACE` pode ser usada com `ALTER TABLE` para mover tabelas entre espaços de tabela gerais, espaços de tabela por arquivo e o espaço de tabelas do sistema.

##### Criando um espaço de tabela geral

As tabelas gerais são criadas usando a sintaxe `CREATE TABLESPACE`.

```sql
CREATE TABLESPACE tablespace_name
    ADD DATAFILE 'file_name'
    [FILE_BLOCK_SIZE = value]
        [ENGINE [=] engine_name]
```

Um espaço de tabela geral pode ser criado no diretório de dados ou fora dele. Para evitar conflitos com espaços de tabela criados implicitamente por arquivo por tabela, não é suportada a criação de um espaço de tabela geral em um subdiretório sob o diretório de dados. Ao criar um espaço de tabela geral fora do diretório de dados, o diretório deve existir antes de criar o espaço de tabela.

Um arquivo .isl é criado no diretório de dados do MySQL quando um espaço de tabelas geral é criado fora do diretório de dados do MySQL.

Exemplos:

Criar um espaço de tabela geral no diretório de dados:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;
```

Criar um espaço de tabela geral em um diretório fora do diretório de dados:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '/my/tablespace/directory/ts1.ibd' Engine=InnoDB;
```

Você pode especificar um caminho que seja relativo ao diretório de dados, desde que o diretório do espaço de tabela não esteja sob o diretório de dados. Neste exemplo, o diretório `my_tablespace` está no mesmo nível que o diretório de dados:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '../my_tablespace/ts1.ibd' Engine=InnoDB;
```

Nota

A cláusula `ENGINE = InnoDB` deve ser definida como parte da declaração `CREATE TABLESPACE`, ou o `InnoDB` deve ser definido como o motor de armazenamento padrão (`default_storage_engine=InnoDB`).

##### Adicionando tabelas a um espaço de tabelas geral

Após criar um espaço de tabelas geral, as declarações `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` podem ser usadas para adicionar tabelas ao espaço de tabelas, conforme mostrado nos exemplos a seguir:

`CREATE TABLE`:

```sql
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1;
```

`ALTER TABLE`:

```sql
mysql> ALTER TABLE t2 TABLESPACE ts1;
```

Nota

O suporte para adicionar partições de tabela a espaços de tabela compartilhados foi descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela `InnoDB` do sistema e espaços de tabela gerais.

Para informações detalhadas sobre sintaxe, consulte `CREATE TABLE` e `ALTER TABLE`.

##### Suporte ao formato de string do espaço de tabela geral

Os espaços de tabelas gerais suportam todos os formatos de string de tabela (`REDUNDANT`, `COMPACT`, `DYNAMIC`, `COMPRESSED`) com a ressalva de que tabelas comprimidas e não comprimidas não podem coexistir no mesmo espaço de tabelas gerais devido aos tamanhos diferentes das páginas físicas.

Para que um espaço de tabelas geral possa conter tabelas comprimidas (`ROW_FORMAT=COMPRESSED`), a opção `FILE_BLOCK_SIZE` deve ser especificada, e o valor `FILE_BLOCK_SIZE` deve ser um tamanho de página comprimida válido em relação ao valor `innodb_page_size`. Além disso, o tamanho de página física da tabela comprimida (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16KB` e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

A tabela a seguir mostra as combinações permitidas de `innodb_page_size`, `FILE_BLOCK_SIZE` e `KEY_BLOCK_SIZE`. Os valores de `FILE_BLOCK_SIZE` também podem ser especificados em bytes. Para determinar um valor válido de `KEY_BLOCK_SIZE` para um `FILE_BLOCK_SIZE` dado, divida o valor de `FILE_BLOCK_SIZE` por 1024. A compressão de tabela não é suportada para tamanhos de página de `InnoDB` de 32K e 64K. Para mais informações sobre `KEY_BLOCK_SIZE`, consulte `CREATE TABLE` e a Seção 14.9.1.2, “Criando Tabelas Compressas”.

**Tabela 14.3: Combinações de Tamanho de Página Permitido, FILE_BLOCK_SIZE e KEY_BLOCK_SIZE para Tabelas Compactadas**

<table frame="all"><col style="width: 33%"/><col style="width: 33%"/><col style="width: 34%"/><thead><tr> <th>InnoDB Page Size (innodb_page_size)</th> <th>Permitted FILE_BLOCK_SIZE Value</th> <th>Permitted KEY_BLOCK_SIZE Value</th> </tr></thead><tbody><tr> <th>64KB</th> <td>64K (65536)</td> <td>Compression is not supported</td> </tr><tr> <th>32KB</th> <td>32K (32768)</td> <td>Compression is not supported</td> </tr><tr> <th>16 KB</th> <td>16K (16384)</td> <td>Nenhum. Se<code>innodb_page_size</code>é igual a<code>FILE_BLOCK_SIZE</code>, o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>16KB</th> <td>8K (8192)</td> <td>8</td> </tr><tr> <th>16KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th>16KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>16KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th>8 KB</th> <td>8K (8192)</td> <td>Nenhum. Se<code>innodb_page_size</code>é igual a<code>FILE_BLOCK_SIZE</code>, o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>8KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th>8KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>8KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th>4 KB</th> <td>4K (4096)</td> <td>Nenhum. Se<code>innodb_page_size</code>é igual a<code>FILE_BLOCK_SIZE</code>, o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>4K</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>4KB</th> <td>1K (1024)</td> <td>1</td> </tr></tbody></table>

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela comprimida. O exemplo assume um `innodb_page_size` padrão de 16 KB. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Se você não especificar `FILE_BLOCK_SIZE` ao criar um espaço de tabela geral, `FILE_BLOCK_SIZE` por padrão é `innodb_page_size`. Quando `FILE_BLOCK_SIZE` é igual a `innodb_page_size`, o espaço de tabela pode conter apenas tabelas com um formato de string não compactado (formatos de string `COMPACT`, `REDUNDANT` e `DYNAMIC`).

##### Mover tabelas entre tabelaspaces usando ALTER TABLE

`ALTER TABLE` com a opção `TABLESPACE` pode ser usado para mover uma tabela para um espaço de tabelas geral existente, para um novo espaço de tabelas por arquivo, ou para o espaço de tabelas do sistema.

Nota

O suporte para a colocação de partições de tabela em espaços de tabela compartilhados foi descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela `InnoDB` do sistema e espaços de tabela gerais.

Para mover uma tabela de um espaço de tabela por arquivo ou de um espaço de tabelas do sistema para um espaço de tabelas geral, especifique o nome do espaço de tabelas geral. O espaço de tabelas geral deve existir. Consulte `ALTER TABLESPACE` para obter mais informações.

```sql
ALTER TABLE tbl_name TABLESPACE [=] tablespace_name;
```

Para mover uma tabela de um espaço de tabelas geral ou de um espaço de tabelas por arquivo para o espaço de tabelas do sistema, especifique `innodb_system` como o nome do espaço de tabelas.

```sql
ALTER TABLE tbl_name TABLESPACE [=] innodb_system;
```

Para mover uma tabela do espaço de tabelas do sistema ou de um espaço de tabelas geral para um espaço de tabelas por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```sql
ALTER TABLE tbl_name TABLESPACE [=] innodb_file_per_table;
```

As operações `ALTER TABLE ... TABLESPACE` causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

A sintaxe do `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a opção `TABLESPACE`.

Restrições se aplicam ao movimento de tabelas de espaços de tabela criptografados. Consulte Limitações de criptografia.

##### Descartar um espaço de tabela geral

A declaração `DROP TABLESPACE` é usada para descartar um espaço de tabela geral `InnoDB`.

Todas as tabelas devem ser descartadas do espaço de tabelas antes de uma operação `DROP TABLESPACE`. Se o espaço de tabelas não estiver vazio, `DROP TABLESPACE` retorna um erro.

Use uma consulta semelhante à seguinte para identificar tabelas em um espaço de tabelas geral.

```sql
mysql> SELECT a.NAME AS space_name, b.NAME AS table_name FROM INFORMATION_SCHEMA.INNODB_TABLESPACES a,
       INFORMATION_SCHEMA.INNODB_TABLES b WHERE a.SPACE=b.SPACE AND a.NAME LIKE 'ts1';
+------------+------------+
| space_name | table_name |
+------------+------------+
| ts1        | test/t1    |
| ts1        | test/t2    |
| ts1        | test/t3    |
+------------+------------+
```

Se uma operação `DROP TABLESPACE` em um espaço de tabela geral *vazio* retornar um erro, o espaço de tabela pode conter uma tabela temporária ou intermediária órfã que foi deixada por uma operação `ALTER TABLE` que foi interrompida por uma saída do servidor. Para mais informações, consulte a Seção 14.22.3, “Solucionando operações do dicionário de dados InnoDB”.

Um espaço de `InnoDB` geral não é excluído automaticamente quando a última tabela do espaço de tabelas é excluída. O espaço de tabelas deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

Um espaço de tabela geral não pertence a nenhum banco de dados específico. Uma operação `DROP DATABASE` pode descartar tabelas que pertencem a um espaço de tabela geral, mas não pode descartar o espaço de tabela, mesmo que a operação `DROP DATABASE` descarte todas as tabelas que pertencem ao espaço de tabela.

Assim como as tabelas de espaço de sistema, o truncar ou descartar tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados .ibd do espaço de tabelas geral, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece quando um espaço de tabelas por arquivo é excluído durante uma operação de `DROP TABLE`.

Este exemplo demonstra como descartar um espaço de tabelas geral `InnoDB`. O espaço de tabelas geral `ts1` é criado com uma única tabela. A tabela deve ser descartada antes de descartar o espaço de tabelas.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Nota

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

##### Limitações gerais do espaço de tabela

* Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

* A criação de tabelas gerais temporárias não é suportada. * As tabelas gerais não suportam tabelas temporárias. * As tabelas armazenadas em um espaço de tabelas geral só podem ser abertas em versões do MySQL que suportam espaços de tabelas gerais.

* Assim como as tabelas de espaço de sistema, a truncação ou eliminação de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados ibd do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

Além disso, uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado (um espaço de tabelas geral ou o espaço de tabelas do sistema) pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações requerem tanto espaço adicional quanto os dados na tabela mais os índices. O espaço adicional necessário para a operação de cópia de tabela `ALTER TABLE` não é liberado de volta ao sistema operacional, como é o caso dos espaços de tabelas por arquivo.

* `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ...IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

* O suporte para a colocação de partições de tabela em espaços de tabela gerais foi descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL.

* A cláusula `ADD DATAFILE` não é suportada em um ambiente de replicação onde a fonte e a réplica residem no mesmo host, pois isso causaria a fonte e a réplica criarem um espaço de tabelas com o mesmo nome e no mesmo local.

#### 14.6.3.4 Desfazer Espaços de Tabela

Os espaços de tabela desfazíveis contêm registros de desfazer, que são coleções de registros que contêm informações sobre como desfazer a última alteração realizada por uma transação em um registro de índice agrupado.

Os registros de desfazer são armazenados nos espaços de tabela do sistema por padrão, mas podem ser armazenados em um ou mais espaços de tabela de desfazer. O uso de espaços de tabela de desfazer pode reduzir a quantidade de espaço necessária para os registros de desfazer em qualquer espaço de tabela. Os padrões de E/S dos registros de desfazer também tornam os espaços de tabela de desfazer bons candidatos para armazenamento em SSD.

O número de tabelas de desfazer usadas por `InnoDB` é controlado pela opção `innodb_undo_tablespaces`. Esta opção só pode ser configurada ao inicializar a instância do MySQL. Não pode ser alterada posteriormente.

Nota

A opção `innodb_undo_tablespaces` é desatualizada; espere que ela seja removida em uma versão futura.

Os espaços de tabela e os segmentos individuais dentro desses espaços de tabela não podem ser eliminados. No entanto, os registros de desfazer armazenados em espaços de tabela de desfazer podem ser truncados. Para obter mais informações, consulte "Truncar espaços de tabela de desfazer".

##### Configurando Undo Tablespaces

Este procedimento descreve como configurar os espaços de tabela de desfazer. Quando os espaços de tabela de desfazer são configurados, os registros de desfazer são armazenados nos espaços de tabela de desfazer, em vez do espaço de tabela do sistema.

O número de espaços de tabela de desfazer só pode ser configurado ao inicializar uma instância do MySQL e é fixo durante a vida da instância, portanto, é recomendável que você realize o procedimento a seguir em uma instância de teste com uma carga de trabalho representativa antes de implantar a configuração em um sistema de produção.

Para configurar os espaços de tabela de desfazer:

1. Especifique uma localização de diretório para tabelas de desfazer usando a variável `innodb_undo_directory`. Se uma localização de diretório não for especificada, as tabelas de desfazer são criadas no diretório de dados.

2. Defina o número de segmentos de rollback usando a variável `innodb_rollback_segments`. Comece com um valor relativamente baixo e aumente-o gradualmente ao longo do tempo para examinar o efeito no desempenho. O ajuste padrão para `innodb_rollback_segments` é 128, que também é o valor máximo.

Um segmento de rollback é sempre atribuído ao espaço de tabelas do sistema, e 32 segmentos de rollback são reservados para o espaço de tabelas temporário (`ibtmp1`). Portanto, para alocar segmentos de rollback nos espaços de tabelas de desfazer, defina `innodb_rollback_segments` para um valor maior que 33. Por exemplo, se você tiver dois espaços de tabelas de desfazer, defina `innodb_rollback_segments` para 35 para atribuir um segmento de rollback a cada um dos dois espaços de tabelas de desfazer. Os segmentos de rollback são distribuídos entre os espaços de tabelas de desfazer de forma circular.

Quando você adiciona tabelas de desfazer, o segmento de rollback no espaço de tabelas do sistema é tornado inativo.

3. Defina o número de espaços de tabelas de desfazer usando a opção `innodb_undo_tablespaces`. O número especificado de espaços de tabelas de desfazer é fixo durante a vida da instância do MySQL, portanto, se você não tiver certeza sobre um valor ótimo, estime em alta.

4. Crie uma nova instância de teste do MySQL usando as configurações que você escolheu.

5. Use uma carga de trabalho realista na sua instância de teste com volume de dados semelhante aos seus servidores de produção para testar a configuração.

6. Compara o desempenho de cargas de trabalho intensivas em I/O. 7. Aumente periodicamente o valor de `innodb_rollback_segments` e execute novamente os testes de desempenho até não haver mais melhorias no desempenho em I/O.

##### Truncar espaços de tabela desfazer

Para truncar os espaços de tabela de desfazer, é necessário que a instância do MySQL tenha um mínimo de dois espaços de tabela de desfazer ativos, o que garante que um espaço de tabela de desfazer permaneça ativo enquanto o outro é retirado do uso para ser truncado. O número de espaços de tabela de desfazer é definido pela variável `innodb_undo_tablespaces`. O valor padrão é 0. Use esta declaração para verificar o valor de `innodb_undo_tablespaces`:

```sql
mysql> SELECT @@innodb_undo_tablespaces;
+---------------------------+
| @@innodb_undo_tablespaces |
+---------------------------+
|                         2 |
+---------------------------+
```

Para permitir a desfazer-se de tabelas espaços truncadas, habilite a variável `innodb_undo_log_truncate`. Por exemplo:

```sql
mysql> SET GLOBAL innodb_undo_log_truncate=ON;
```

Quando a variável `innodb_undo_log_truncate` é habilitada, as tabelas de desfazer que excedem o limite de tamanho definido pela variável `innodb_max_undo_log_size` estão sujeitas a truncação. A variável `innodb_max_undo_log_size` é dinâmica e tem um valor padrão de 1073741824 bytes (1024 MiB).

```sql
mysql> SELECT @@innodb_max_undo_log_size;
+----------------------------+
| @@innodb_max_undo_log_size |
+----------------------------+
|                 1073741824 |
+----------------------------+
```

Quando a variável `innodb_undo_log_truncate` estiver habilitada:

1. As tabelaspaces que excedem o ajuste `innodb_max_undo_log_size` são marcadas para corte. A seleção de um tabelaspace para corte é realizada de forma circular para evitar o corte do mesmo tabelaspace de volta em cada caso.

2. Os segmentos de recuo que residem no espaço de tabela de desfazer selecionado são tornados inativos para que não sejam atribuídos a novas transações. As transações existentes que estão atualmente usando segmentos de recuo são permitidas para serem concluídas.

3. O sistema de purga esvazia segmentos de recuo, liberando os registros de desfazer que não são mais utilizados.

4. Após todos os segmentos de rollback serem liberados no espaço de tabela de desfazer, a operação de truncar é executada e o espaço de tabela de desfazer é truncado até seu tamanho inicial. O tamanho inicial de um espaço de tabela de desfazer depende do valor `innodb_page_size`. Para o tamanho de página padrão de 16 KB, o tamanho inicial do arquivo do espaço de tabela de desfazer é de 10 MiB. Para tamanhos de página de 4 KB, 8 KB, 32 KB e 64 KB, os tamanhos iniciais dos arquivos do espaço de tabela de desfazer são, respectivamente, 7 MiB, 8 MiB, 20 MiB e 40 MiB.

O tamanho de um espaço de tabelas de desfazer após uma operação de truncar pode ser maior que o tamanho inicial devido ao uso imediato após a conclusão da operação.

A variável `innodb_undo_directory` define a localização dos arquivos de espaço de desfazer. Se a variável `innodb_undo_directory` não estiver definida, os espaços de desfazer residem no diretório de dados.

Os segmentos de recuo são reativados para que possam ser atribuídos a novas transações.

###### Agilizando a Truncagem de Espaços de Tabela Undo

O thread de purga é responsável por esvaziar e truncar espaços de tabelas de desfazer. Por padrão, o thread de purga procura espaços de tabelas de desfazer para truncar uma vez a cada 128 vezes em que a purga é invocada. A frequência com a qual o thread de purga procura espaços de tabelas de desfazer para truncar é controlada pela variável `innodb_purge_rseg_truncate_frequency`, que tem um ajuste padrão de 128.

```sql
mysql> SELECT @@innodb_purge_rseg_truncate_frequency;
+----------------------------------------+
| @@innodb_purge_rseg_truncate_frequency |
+----------------------------------------+
|                                    128 |
+----------------------------------------+
```

Para aumentar a frequência, diminua o ajuste `innodb_purge_rseg_truncate_frequency`. Por exemplo, para que o thread de purga procure espaços de desfazer uma vez a cada 32 vezes que a purga é invocada, defina `innodb_purge_rseg_truncate_frequency` para 32.

```sql
mysql> SET GLOBAL innodb_purge_rseg_truncate_frequency=32;
```

Quando o thread de purga encontra um espaço de tabelas que requer truncação, o thread de purga retorna com maior frequência para rapidamente esvaziar e truncar o espaço de tabelas de desfazer.

###### Impacto no desempenho de truncar arquivos do Undo Tablespace

Quando um espaço de tabela de desfazer é truncado, os segmentos de rollback no espaço de tabela de desfazer são desativados. Os segmentos de rollback ativos em outros espaços de tabela de desfazer assumem a responsabilidade por toda a carga do sistema, o que pode resultar em uma leve degradação do desempenho. A extensão em que o desempenho é afetado depende de vários fatores:

* Número de espaços de tabelas de desfazer * Número de registros de desfazer * Tamanho do espaço de tabelas de desfazer * Velocidade do subsistema de E/S * Transações em execução existentes * Carga do sistema

A maneira mais fácil de evitar o impacto potencial no desempenho é aumentar o número de espaços de tabela de desfazer.

Além disso, duas operações de ponto de verificação são realizadas durante uma operação de truncar um espaço de rascunho. A primeira operação de ponto de verificação remove as páginas antigas do espaço de rascunho do buffer pool. A segunda operação de ponto de verificação esvazia as páginas iniciais do novo espaço de rascunho para o disco. Em um sistema ocupado, a primeira operação de ponto de verificação, em particular, pode afetar temporariamente o desempenho do sistema se houver um grande número de páginas a serem removidas.

###### Reverter a recuperação de truncamento do espaço de tabelas

Uma operação de truncar um espaço de tabelas de desfazer cria um arquivo temporário `undo_space_number_trunc.log` no diretório de registro do servidor. Esse diretório de registro é definido por `innodb_log_group_home_dir`. Se ocorrer uma falha no sistema durante a operação de truncar, o arquivo de registro temporário permite que o processo de inicialização identifique os espaços de tabelas de desfazer que estavam sendo truncados e continue a operação.

#### 14.6.3.5 Tabela de espaço temporário

Tabelas temporárias não compactadas, criadas pelo usuário, e tabelas temporárias internas em disco são criadas em um espaço de tabelas temporárias compartilhado. A variável `innodb_temp_data_file_path` define o caminho relativo, o nome, o tamanho e os atributos dos arquivos de dados do espaço de tabelas temporárias. Se não for especificado nenhum valor para `innodb_temp_data_file_path`, o comportamento padrão é criar um arquivo de dados auto-extensibile chamado `ibtmp1` no diretório `innodb_data_home_dir` que é ligeiramente maior que 12 MB.

Nota

No MySQL 5.6, as tabelas temporárias não compactadas são criadas em espaços de arquivo individuais por tabela no diretório de arquivos temporários, ou no espaço de tabelas do sistema `InnoDB` no diretório de dados, se `innodb_file_per_table` estiver desativado. A introdução de um espaço de tabelas temporárias compartilhado no MySQL 5.7 remove os custos de desempenho associados à criação e remoção de um espaço de tabela por arquivo para cada tabela temporária. Um espaço de tabelas temporárias dedicado também significa que não é mais necessário salvar o metadados das tabelas temporárias no espaço de tabelas do sistema `InnoDB`.

Tabelas temporárias compactadas, que são tabelas temporárias criadas usando o atributo `ROW_FORMAT=COMPRESSED`, são criadas em espaços de tabelas por arquivo no diretório de arquivos temporários.

O espaço de tabela temporário é removido durante o desligamento normal ou em uma inicialização aborrecida e é recriado cada vez que o servidor é iniciado. O espaço de tabela temporário recebe um ID de espaço gerado dinamicamente quando é criado. A inicialização é recusada se o espaço de tabela temporário não puder ser criado. O espaço de tabela temporário não é removido se o servidor parar inesperadamente. Neste caso, um administrador de banco de dados pode remover o espaço de tabela temporário manualmente ou reiniciar o servidor, o que remove e recria o espaço de tabela temporário automaticamente.

O espaço de tabela temporário não pode residir em um dispositivo bruto.

A tabela do esquema de informações `FILES` fornece metadados sobre o espaço de tabelas temporário `InnoDB`. Emita uma consulta semelhante à seguinte para visualizar os metadados do espaço de tabelas temporário:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='innodb_temporary'\G
```

A tabela do esquema de informações `INNODB_TEMP_TABLE_INFO` fornece metadados sobre tabelas temporárias criadas pelo usuário que estão atualmente ativas dentro de uma instância `InnoDB`.

##### Tamanho do arquivo de dados do espaço de tabela temporário

Por padrão, o arquivo de dados do espaço de tabela temporário é autoextensibile e aumenta de tamanho conforme necessário para acomodar tabelas temporárias no disco. Por exemplo, se uma operação cria uma tabela temporária com tamanho de 20 MB, o arquivo de dados do espaço de tabela temporário, que tem tamanho padrão de 12 MB quando criado, se estende em tamanho para acomodá-la. Quando as tabelas temporárias são excluídas, o espaço liberado pode ser reutilizado para novas tabelas temporárias, mas o arquivo de dados permanece no tamanho estendido.

Um arquivo de dados de espaço de tabela temporário que se autoexpande pode se tornar grande em ambientes que utilizam grandes tabelas temporárias ou que utilizam extensivamente tabelas temporárias. Um grande arquivo de dados também pode resultar de consultas de longa duração que utilizam tabelas temporárias.

Para determinar se um arquivo de dados de espaço de tabela temporário está sendo autoextendido, verifique a configuração `innodb_temp_data_file_path`:

```sql
mysql> SELECT @@innodb_temp_data_file_path;
+------------------------------+
| @@innodb_temp_data_file_path |
+------------------------------+
| ibtmp1:12M:autoextend        |
+------------------------------+
```

Para verificar o tamanho dos arquivos de dados do espaço de tabela temporário, consulte a tabela do esquema de informações `FILES` usando uma consulta semelhante a esta:

```sql
mysql> SELECT FILE_NAME, TABLESPACE_NAME, ENGINE, INITIAL_SIZE, TOTAL_EXTENTS*EXTENT_SIZE
       AS TotalSizeBytes, DATA_FREE, MAXIMUM_SIZE FROM INFORMATION_SCHEMA.FILES
       WHERE TABLESPACE_NAME = 'innodb_temporary'\G
*************************** 1. row ***************************
      FILE_NAME: ./ibtmp1
TABLESPACE_NAME: innodb_temporary
         ENGINE: InnoDB
   INITIAL_SIZE: 12582912
 TotalSizeBytes: 12582912
      DATA_FREE: 6291456
   MAXIMUM_SIZE: NULL
```

O valor `TotalSizeBytes` relata o tamanho atual do arquivo de dados do espaço de tabela temporário. Para informações sobre outros valores de campo, consulte a Seção 24.3.9, “A tabela INFORMATION_SCHEMA FILES”.

Como alternativa, verifique o tamanho do arquivo de dados do espaço de tabela temporário no seu sistema operacional. Por padrão, o arquivo de dados do espaço de tabela temporário está localizado no diretório definido pela opção de configuração `innodb_temp_data_file_path`. Se um valor não foi especificado explicitamente para esta opção, um arquivo de dados de espaço de tabela temporário chamado `ibtmp1` é criado em `innodb_data_home_dir`, que por padrão é o diretório de dados do MySQL, se não especificado.

Para recuperar o espaço em disco ocupado por um arquivo de dados de espaço de tabela temporário, reinicie o servidor MySQL. A reinicialização do servidor remove e recria o arquivo de dados do espaço de tabela temporário de acordo com os atributos definidos por `innodb_temp_data_file_path`.

Para evitar que o arquivo de dados temporário fique muito grande, você pode configurar a variável `innodb_temp_data_file_path` para especificar um tamanho máximo de arquivo. Por exemplo:

```sql
[mysqld]
innodb_temp_data_file_path=ibtmp1:12M:autoextend:max:500M
```

Quando o arquivo de dados atinge o tamanho máximo, as consultas falham com um erro que indica que a tabela está cheia. A configuração de `innodb_temp_data_file_path` requer o reinício do servidor.

Alternativamente, configure as variáveis `default_tmp_storage_engine` e `internal_tmp_disk_storage_engine`, que definem o mecanismo de armazenamento a ser usado para tabelas temporárias internas criadas pelo usuário e em disco, respectivamente. Ambas as variáveis são definidas como `InnoDB` por padrão. O mecanismo de armazenamento `MyISAM` usa um arquivo individual para cada tabela temporária, que é removido quando a tabela temporária é removida.

### 14.6.4 Dicionário de Dados InnoDB

O dicionário de dados `InnoDB` é composto por tabelas internas do sistema que contêm metadados usados para acompanhar objetos como tabelas, índices e colunas de tabela. Os metadados estão fisicamente localizados no espaço de tabelas do sistema `InnoDB`. Por razões históricas, os metadados do dicionário de dados se sobrepõem em algum grau com as informações armazenadas nos arquivos de metadados da tabela `InnoDB` (arquivos `.frm`).

### 14.6.5 Buffer de escrita dupla

O buffer de escrita dupla é uma área de armazenamento onde o `InnoDB` escreve páginas esvaziadas do pool de buffer antes de escrever as páginas em suas posições apropriadas nos arquivos de dados do `InnoDB`. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo `mysqld` em meio a uma escrita de página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de escrita dupla durante a recuperação em caso de falha.

Embora os dados sejam escritos duas vezes, o buffer de escrita dupla não exige o dobro do overhead de I/O ou o dobro das operações de I/O. Os dados são escritos no buffer de escrita dupla em um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional (exceto no caso em que `innodb_flush_method` está definido como `O_DIRECT_NO_FSYNC`).

O buffer de escrita dupla é ativado por padrão na maioria dos casos. Para desativar o buffer de escrita dupla, defina `innodb_doublewrite` para 0.

Se os arquivos de espaço de sistema (“arquivos ibdata”) estiverem localizados em dispositivos Fusion-io que suportem gravações atômicas, o bufferamento de dupla gravação será automaticamente desativado e as gravações atômicas da Fusion-io serão usadas para todos os arquivos de dados. Como o ajuste do buffer de dupla gravação é global, o bufferamento de dupla gravação também será desativado para arquivos de dados que estejam em hardware que não é da Fusion-io. Esse recurso é suportado apenas em hardware da Fusion-io e é habilitado apenas para NVMFS da Fusion-io no Linux. Para aproveitar ao máximo esse recurso, é recomendado um ajuste `innodb_flush_method` do `O_DIRECT`.

### 14.6.6 Registro de Refazer

O log de refazer é uma estrutura de dados baseada em disco usada durante a recuperação em caso de falha para corrigir dados escritos por transações incompletas. Durante operações normais, o log de refazer codifica solicitações para alterar os dados da tabela que resultam de declarações SQL ou chamadas de API de nível baixo. As modificações que não terminaram a atualização dos arquivos de dados antes de uma interrupção inesperada são regravadas automaticamente durante a inicialização e antes que as conexões sejam aceitas. Para informações sobre o papel do log de refazer na recuperação em caso de falha, consulte a Seção 14.19.2, “Recuperação InnoDB”.

Por padrão, o log de refazer é representado fisicamente no disco por dois arquivos chamados `ib_logfile0` e `ib_logfile1`. O MySQL escreve nos arquivos do log de refazer de forma circular. Os dados no log de refazer são codificados em termos de registros afetados; esses dados são coletivamente referidos como refazer. A passagem dos dados pelo log de refazer é representada por um valor de LSN (Local Storage Server) sempre crescente.

As informações e os procedimentos relacionados aos registros de revisão são descritos nos seguintes tópicos da seção:

* Alterar o número ou o tamanho dos arquivos de registro de refazer do InnoDB
* Tópicos relacionados

#### Alterando o número ou o tamanho dos arquivos de registro InnoDB Redo

Para alterar o número ou o tamanho dos seus arquivos de registro de refazer `InnoDB`, realize as etapas a seguir:

1. Parar o servidor MySQL e garantir que ele seja desligado sem erros.

2. Editar `my.cnf` para alterar a configuração do arquivo de registro. Para alterar o tamanho do arquivo de registro, configure `innodb_log_file_size`. Para aumentar o número de arquivos de registro, configure `innodb_log_files_in_group`.

3. Inicie o servidor MySQL novamente.

Se o `InnoDB` detectar que o tamanho do arquivo de registro de revisão difere do do arquivo de registro `innodb_log_file_size`, ele escreve um ponto de verificação de registro, fecha e remove os arquivos de registro antigos, cria novos arquivos de registro no tamanho solicitado e abre os novos arquivos de registro.

#### Tópicos Relacionados

* Configuração do arquivo de registro Redo
* Seção 8.5.4, “Otimização do registro de InnoDB Redo”

### 14.6.7 Registros de Desfazer

Um registro do log de desfazer é uma coleção de registros do log de desfazer associados a uma única transação de leitura e escrita. Um registro do log de desfazer contém informações sobre como desfazer a última alteração realizada por uma transação em um registro de índice agrupado. Se outra transação precisar ver os dados originais como parte de uma operação de leitura consistente, os dados não modificados são recuperados dos registros do log de desfazer. Os logs de desfazer existem dentro dos segmentos do log de desfazer, que estão contidos nos segmentos de rollback. Os segmentos de rollback residem no espaço de tabelas do sistema, nos espaços de tabelas de desfazer e no espaço de tabelas temporário.

Os registros de desfazer que residem no espaço de tabela temporário são usados para transações que modificam dados em tabelas temporárias definidas pelo usuário. Esses registros de desfazer não são registrados novamente, pois não são necessários para a recuperação em caso de falha. Eles são usados apenas para o rollback enquanto o servidor está em execução. Esse tipo de registro de desfazer beneficia o desempenho ao evitar o registro de I/O de redo.

`InnoDB` suporta um máximo de 128 segmentos de rollback, dos quais 32 são alocados para o espaço de tabela temporário. Isso deixa 96 segmentos de rollback que podem ser atribuídos a transações que modificam dados em tabelas regulares. A variável `innodb_rollback_segments` define o número de segmentos de rollback utilizados por `InnoDB`.

O número de transações que um segmento de rollback suporta depende do número de slots de desfazer em um segmento de rollback e do número de logs de desfazer necessários para cada transação. O número de slots de desfazer em um segmento de rollback difere de acordo com o tamanho da página `InnoDB`.

<table summary="Number of undo slots in a rollback segment for each InnoDB page size"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>InnoDB Page Size</th> <th>Number of Undo Slots in a Rollback Segment (InnoDB Page Size / 16)</th> </tr></thead><tbody><tr> <td><code>4096 (4KB)</code></td> <td><code>256</code></td> </tr><tr> <td><code>8192 (8KB)</code></td> <td><code>512</code></td> </tr><tr> <td><code>16384 (16KB)</code></td> <td><code>1024</code></td> </tr><tr> <td><code>32768 (32KB)</code></td> <td><code>2048</code></td> </tr><tr> <td><code>65536 (64KB)</code></td> <td><code>4096</code></td> </tr></tbody></table>

Uma transação é atribuída até quatro registros de desfazer, um para cada um dos seguintes tipos de operação:

1. `INSERT` operações em tabelas definidas pelo usuário

2. `UPDATE` e `DELETE` operações em tabelas definidas pelo usuário

3. `INSERT` operações em tabelas temporárias definidas pelo usuário

4. Operações `UPDATE` e `DELETE` em tabelas temporárias definidas pelo usuário

Os registros de desfazer são atribuídos conforme necessário. Por exemplo, uma transação que realiza as operações `INSERT`, `UPDATE` e `DELETE` em tabelas regulares e temporárias requer uma atribuição completa de quatro registros de desfazer. Uma transação que realiza apenas as operações `INSERT` em tabelas regulares requer um único registro de desfazer.

Uma transação que realiza operações em tabelas regulares é atribuída a logs de desfazer de um espaço de tabela de sistema atribuído ou segmento de desfazer de um espaço de tabela temporária. Uma transação que realiza operações em tabelas temporárias é atribuída a logs de desfazer de um segmento de desfazer de um espaço de tabela temporária atribuído.

Um registro de desfazer atribuído a uma transação permanece anexado à transação durante sua duração. Por exemplo, um registro de desfazer atribuído a uma transação para uma operação `INSERT` em uma tabela regular é usado para todas as operações `INSERT` em tabelas regulares realizadas por essa transação.

Dadas as razões descritas acima, as fórmulas a seguir podem ser usadas para estimar o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar.

Nota

É possível encontrar um erro de limite de transação concorrente antes de atingir o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar. Isso ocorre quando o segmento de rollback atribuído a uma transação esgota os slots de desfazer. Nesses casos, tente executar novamente a transação.

Quando as transações realizam operações em tabelas temporárias, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é limitado pelo número de segmentos de rollback alocados ao espaço de tabelas temporárias, que é de 32.

* Se cada transação realizar uma operação de `INSERT` **ou** uma operação de `UPDATE` ou `DELETE`, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16) * (innodb_rollback_segments - 32)
  ```

* Se cada transação realizar uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE`, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16 / 2) * (innodb_rollback_segments - 32)
  ```

* Se cada transação realizar uma operação `INSERT` em uma tabela temporária, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16) * 32
  ```

* Se cada transação realizar uma operação `INSERT` **e** uma operação `UPDATE` ou `DELETE` em uma tabela temporária, o número de transações de leitura e escrita concorrentes que o `InnoDB` é capaz de suportar é:

  ```sql
  (innodb_page_size / 16 / 2) * 32
  ```
