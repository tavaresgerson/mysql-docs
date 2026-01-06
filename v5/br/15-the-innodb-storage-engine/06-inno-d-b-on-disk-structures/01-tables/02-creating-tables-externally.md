#### 14.6.1.2 Criar tabelas externamente

Existem várias razões para criar tabelas `InnoDB` externamente, ou seja, criar tabelas fora do diretório de dados. Essas razões podem incluir gerenciamento de espaço, otimização de I/O ou colocação de tabelas em um dispositivo de armazenamento com características de desempenho ou capacidade específicas, por exemplo.

O `InnoDB` suporta os seguintes métodos para criar tabelas externamente:

- Usando a cláusula DATA DIRECTORY
- Usando a sintaxe CREATE TABLE ... TABLESPACE
- Criando uma Tabela em um Espaço de Tabela Geral Externo

##### Usando a cláusula DATA DIRECTORY

Você pode criar uma tabela `InnoDB` em um diretório externo especificando uma cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`.

```sql
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

A cláusula `DATA DIRECTORY` é suportada para tabelas criadas em espaços de tabelas por arquivo. As tabelas são criadas implicitamente em espaços de tabelas por arquivo quando a variável `innodb_file_per_table` é habilitada, o que é o caso padrão.

```sql
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

Para obter mais informações sobre os espaços de tabelas por arquivo, consulte a Seção 14.6.3.2, “Espaços de tabelas por arquivo”.

Certifique-se da localização do diretório que você escolheu, pois a cláusula `DATA DIRECTORY` não pode ser usada com `ALTER TABLE` para alterar a localização posteriormente.

Quando você especifica uma cláusula `DATA DIRECTORY` em uma instrução `CREATE TABLE`, o arquivo de dados da tabela (`table_name.ibd`) é criado em um diretório de esquema sob o diretório especificado, e um arquivo `.isl` (`table_name.isl`) que contém o caminho do arquivo de dados é criado no diretório de esquema sob o diretório de dados do MySQL. Um arquivo `.isl` é semelhante em função a um link simbólico. (Links simbólicos reais não são suportados para uso com arquivos de dados `InnoDB`.)

O exemplo a seguir demonstra como criar uma tabela em um diretório externo usando a cláusula `DATA DIRECTORY`. Assume-se que a variável `innodb_file_per_table` está habilitada.

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

###### Observações de uso:

- Inicialmente, o MySQL mantém o arquivo de dados do espaço de tabelas aberto, impedindo que você desmonte o dispositivo, mas pode eventualmente fechar o arquivo se o servidor estiver ocupado. Tenha cuidado para não desmontar acidentalmente um dispositivo externo enquanto o MySQL estiver em execução ou iniciar o MySQL enquanto o dispositivo estiver desconectado. Tentar acessar uma tabela quando o arquivo de dados associado estiver ausente causa um erro grave que requer o reinício do servidor.

  O reinício do servidor pode falhar se o arquivo de dados não for encontrado no caminho esperado. Nesse caso, remova manualmente o arquivo `.isl` do diretório do esquema. Após o reinício, elimine a tabela para remover o arquivo `.frm` e as informações sobre a tabela do dicionário de dados.

- Antes de colocar uma tabela em um volume montado no NFS, revise os problemas potenciais descritos em Usar NFS com MySQL.

- Se estiver usando uma captura de estado do LVM, uma cópia de arquivo ou outro mecanismo baseado em arquivos para fazer backup do arquivo de dados da tabela, sempre use a instrução `FLUSH TABLES ... FOR EXPORT` primeiro para garantir que todas as alterações armazenadas na memória sejam descarregadas no disco antes de o backup ocorrer.

- Usar a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo é uma alternativa ao uso de links simbólicos, que o `InnoDB` não suporta.

- A cláusula `DATA DIRECTORY` não é suportada em um ambiente de replicação onde a fonte e a réplica residem no mesmo host. A cláusula `DATA DIRECTORY` requer um caminho de diretório completo. Replicar o caminho nesse caso causaria a criação da tabela no mesmo local pela fonte e pela réplica.

##### Usando a sintaxe CREATE TABLE ... TABLESPACE

A sintaxe `CREATE TABLE ... TABLESPACE` pode ser usada em combinação com a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo. Para fazer isso, especifique `innodb_file_per_table` como o nome do tablespace.

```sql
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

Este método é suportado apenas para tabelas criadas em espaços de tabelas por arquivo, mas não requer que a variável `innodb_file_per_table` esteja habilitada. Em todos os outros aspectos, este método é equivalente ao método `CREATE TABLE ... DATA DIRECTORY` descrito acima. As mesmas notas de uso se aplicam.

##### Criando uma Tabela em um Espaço de Tabela Geral Externo

Você pode criar uma tabela em um espaço de tabelas geral que reside em um diretório externo.

- Para obter informações sobre como criar um espaço de tabelas geral em um diretório externo, consulte Criar um espaço de tabelas geral.

- Para obter informações sobre como criar uma tabela em um espaço de tabelas geral, consulte Adicionar tabelas a um espaço de tabelas geral.
