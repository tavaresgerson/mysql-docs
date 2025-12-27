#### 17.6.1.2 Criando Tabelas Externamente

Há várias razões para criar tabelas `InnoDB` externamente, ou seja, criar tabelas fora do diretório de dados. Essas razões podem incluir gerenciamento de espaço, otimização de I/O ou colocação de tabelas em um dispositivo de armazenamento com características de desempenho ou capacidade específicas, por exemplo.

O `InnoDB` suporta os seguintes métodos para criar tabelas externamente:

* Usando a cláusula DATA DIRECTORY
* Usando a sintaxe CREATE TABLE ... TABLESPACE
* Criando uma tabela em um espaço de tabelas gerais externo

##### Usando a Cláusula DATA DIRECTORY

Você pode criar uma tabela `InnoDB` em um diretório externo especificando uma cláusula DATA DIRECTORY na instrução CREATE TABLE.

```
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

A cláusula DATA DIRECTORY é suportada para tabelas criadas em espaços de tabelas por arquivo. As tabelas são criadas implicitamente em espaços de tabelas por arquivo quando a variável innodb_file_per_table é habilitada, o que é o caso padrão.

```
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

Para mais informações sobre espaços de tabelas por arquivo, consulte a Seção 17.6.3.2, “Espaços de Tabelas por Arquivo”.

Quando você especifica uma cláusula DATA DIRECTORY em uma instrução CREATE TABLE, o arquivo de dados da tabela (`table_name.ibd`) é criado em um diretório de esquema sob o diretório especificado.

Tabelas e partições de tabela criadas fora do diretório de dados usando a cláusula DATA DIRECTORY são restritas a diretórios conhecidos pelo `InnoDB`. Essa exigência permite que os administradores de banco de dados controlem onde os arquivos de dados do espaço de tabelas são criados e garante que os arquivos de dados possam ser encontrados durante a recuperação (veja Recuperação de Falha Durante a Recuperação de Falha do Espaço de Tabelas). Os diretórios conhecidos são aqueles definidos pelas variáveis datadir, innodb_data_home_dir e innodb_directories. Você pode usar a seguinte instrução para verificar essas configurações:

```
mysql> SELECT @@datadir,@@innodb_data_home_dir,@@innodb_directories;
```

Se o diretório que você deseja usar estiver desconhecido, adicione-o à configuração `innodb_directories` antes de criar a tabela. A variável `innodb_directories` é de leitura somente. Configurar isso requer o reinício do servidor. Para informações gerais sobre a configuração de variáveis de sistema, consulte a Seção 7.1.9, “Usando Variáveis de Sistema”.

O exemplo a seguir demonstra como criar uma tabela em um diretório externo usando a cláusula `DATA DIRECTORY`. Assume-se que a variável `innodb_file_per_table` está habilitada e que o diretório é conhecido pelo `InnoDB`.

```
mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';

# MySQL creates the table's data file in a schema directory
# under the external directory

$> cd /external/directory/test
$> ls
t1.ibd
```

###### Notas de Uso:

* O MySQL mantém inicialmente o arquivo de dados do espaço de tabelas aberto, impedindo que você desmonte o dispositivo, mas pode eventualmente fechar o arquivo se o servidor estiver ocupado. Tenha cuidado para não desmontar acidentalmente um dispositivo externo enquanto o MySQL estiver em execução ou iniciar o MySQL enquanto o dispositivo estiver desconectado. Tentar acessar uma tabela quando o arquivo de dados associado estiver ausente causa um erro grave que requer o reinício do servidor.

  O reinício do servidor pode falhar se o arquivo de dados não for encontrado no caminho esperado. Nesse caso, você pode restaurar o arquivo de dados do espaço de tabelas a partir de um backup ou descartar a tabela para remover a informação sobre ela do dicionário de dados.

* Antes de colocar uma tabela em um volume montado em NFS, revise os problemas potenciais descritos em Usar NFS com MySQL.

* Se estiver usando uma captura de instantâneo LVM, cópia de arquivo ou outro mecanismo baseado em arquivos para fazer backup do arquivo de dados da tabela, sempre use a declaração `FLUSH TABLES ... FOR EXPORT` primeiro para garantir que todas as alterações em memória sejam descarregadas no disco antes de ocorrer o backup.

* Usar a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo é uma alternativa ao uso de links simbólicos, que o `InnoDB` não suporta.

* A cláusula `DATA DIRECTORY` não é suportada em um ambiente de replicação onde a fonte e a replica residem no mesmo host. A cláusula `DATA DIRECTORY` requer um caminho de diretório completo. Replicar o caminho nesse caso faria com que a fonte e a replica criassem a tabela na mesma localização.

* Tabelas criadas em espaços de tabelas por arquivo não podem ser criadas no diretório do espaço de tabelas de desfazer (`innodb_undo_directory`) a menos que isso seja diretamente conhecido pelo `InnoDB`. Diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`.

##### Usando a Sintaxe CREATE TABLE ... TABLESPACE

A sintaxe `CREATE TABLE ... TABLESPACE` pode ser usada em combinação com a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo. Para fazer isso, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

Esse método é suportado apenas para tabelas criadas em espaços de tabelas por arquivo, mas não requer que a variável `innodb_file_per_table` esteja habilitada. Em todos os outros aspectos, esse método é equivalente à sintaxe `CREATE TABLE ... DATA DIRECTORY` descrita acima. As mesmas notas de uso se aplicam.

##### Criando uma Tabela em um Espaço de Tabelas Geral Externa

Você pode criar uma tabela em um espaço de tabelas geral que reside em um diretório externo.

* Para informações sobre como criar um espaço de tabelas geral em um diretório externo, consulte Criando um Espaço de Tabelas Geral.

* Para informações sobre como criar uma tabela em um espaço de tabelas geral, consulte Adicionando Tabelas a um Espaço de Tabelas Geral.