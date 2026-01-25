#### 14.6.1.2 Criação de Tabelas Externamente

Existem diferentes razões para criar tabelas `InnoDB` externamente; ou seja, criar tabelas fora do `data directory`. Essas razões podem incluir gerenciamento de espaço, otimização de I/O, ou a colocação de tabelas em um dispositivo de armazenamento com características específicas de desempenho ou capacidade, por exemplo.

O `InnoDB` suporta os seguintes métodos para criar tabelas externamente:

* Uso da Cláusula DATA DIRECTORY
* Uso da Sintaxe CREATE TABLE ... TABLESPACE
* Criação de uma Tabela em um General Tablespace Externo

##### Uso da Cláusula DATA DIRECTORY

Você pode criar uma tabela `InnoDB` em um diretório externo especificando uma cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`.

```sql
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

A cláusula `DATA DIRECTORY` é suportada para tabelas criadas em `file-per-table tablespaces`. As tabelas são criadas implicitamente em `file-per-table tablespaces` quando a variável `innodb_file_per_table` está habilitada, o que ocorre por padrão.

```sql
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

Para mais informações sobre `file-per-table tablespaces`, consulte a Seção 14.6.3.2, “File-Per-Table Tablespaces”.

Certifique-se da localização do diretório escolhido, pois a cláusula `DATA DIRECTORY` não pode ser usada com `ALTER TABLE` para alterar o local posteriormente.

Ao especificar uma cláusula `DATA DIRECTORY` em uma instrução `CREATE TABLE`, o arquivo de dados da tabela (`table_name.ibd`) é criado em um diretório de schema sob o diretório especificado, e um arquivo `.isl` (`table_name.isl`) que contém o caminho do arquivo de dados é criado no diretório de schema sob o `data directory` do MySQL. Um arquivo `.isl` é semelhante em função a um `symbolic link`. (`Symbolic links` reais não são suportados para uso com arquivos de dados `InnoDB`.)

O exemplo a seguir demonstra a criação de uma tabela em um diretório externo usando a cláusula `DATA DIRECTORY`. Presume-se que a variável `innodb_file_per_table` esteja habilitada.

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

###### Notas de Uso:

* O MySQL inicialmente mantém o arquivo de dados do `tablespace` aberto, impedindo a desmontagem (dismount) do dispositivo, mas pode eventualmente fechar o arquivo se o servidor estiver ocupado. Tenha cuidado para não desmontar acidentalmente um dispositivo externo enquanto o MySQL estiver em execução, ou iniciar o MySQL enquanto o dispositivo estiver desconectado. A tentativa de acessar uma tabela quando o arquivo de dados associado está faltando causa um erro grave que requer o reinício do servidor (server restart).

  Um `server restart` pode falhar se o arquivo de dados não for encontrado no caminho esperado. Neste caso, remova manualmente o arquivo `.isl` do diretório do schema. Após a reinicialização, execute `drop the table` para remover o arquivo `.frm` e as informações sobre a tabela do `data dictionary`.

* Antes de colocar uma tabela em um volume montado via NFS, revise os problemas potenciais descritos em Using NFS with MySQL.

* Se estiver usando um `LVM snapshot`, cópia de arquivo, ou outro mecanismo baseado em arquivo para fazer `backup` do arquivo de dados da tabela, sempre use a instrução `FLUSH TABLES ... FOR EXPORT` primeiro para garantir que todas as alterações armazenadas em `memory` sejam descarregadas para o `disk` antes que o `backup` ocorra.

* Usar a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo é uma alternativa ao uso de `symbolic links`, os quais o `InnoDB` não suporta.

* A cláusula `DATA DIRECTORY` não é suportada em um ambiente de `replication` onde o `source` e a `replica` residem no mesmo `host`. A cláusula `DATA DIRECTORY` requer um caminho de diretório completo. A `replication` do caminho, neste caso, faria com que o `source` e a `replica` criassem a tabela no mesmo local.

##### Uso da Sintaxe CREATE TABLE ... TABLESPACE

A sintaxe `CREATE TABLE ... TABLESPACE` pode ser usada em combinação com a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo. Para fazer isso, especifique `innodb_file_per_table` como o nome do `tablespace`.

```sql
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

Este método é suportado apenas para tabelas criadas em `file-per-table tablespaces`, mas não requer que a variável `innodb_file_per_table` esteja habilitada. Em todos os outros aspectos, este método é equivalente ao método `CREATE TABLE ... DATA DIRECTORY` descrito acima. As mesmas notas de uso se aplicam.

##### Criação de uma Tabela em um General Tablespace Externo

Você pode criar uma tabela em um `general tablespace` que reside em um diretório externo.

* Para informações sobre a criação de um `general tablespace` em um diretório externo, consulte Creating a General Tablespace.

* Para informações sobre a criação de uma tabela em um `general tablespace`, consulte Adding Tables to a General Tablespace.