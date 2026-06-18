#### 17.6.1.2 Criar tabelas externamente

Existem várias razões para criar tabelas `InnoDB` externamente, ou seja, criar tabelas fora do diretório de dados. Essas razões podem incluir gerenciamento de espaço, otimização de I/O ou colocação de tabelas em um dispositivo de armazenamento com características de desempenho ou capacidade específicas, por exemplo.

`InnoDB` suporta os seguintes métodos para criar tabelas externamente:

- Usando a cláusula DATA DIRECTORY
- Usando a sintaxe CREATE TABLE ... TABLESPACE
- Criando uma Tabela em um Espaço de Tabela Geral Externo

##### Usando a cláusula DATA DIRECTORY

Você pode criar uma tabela `InnoDB` em um diretório externo especificando uma cláusula `DATA DIRECTORY` na instrução `CREATE TABLE`.

```
CREATE TABLE t1 (c1 INT PRIMARY KEY) DATA DIRECTORY = '/external/directory';
```

A cláusula `DATA DIRECTORY` é suportada para tabelas criadas em espaços de tabelas por arquivo. As tabelas são criadas implicitamente em espaços de tabelas por arquivo quando a variável `innodb_file_per_table` é habilitada, o que é o caso padrão.

```
mysql> SELECT @@innodb_file_per_table;
+-------------------------+
| @@innodb_file_per_table |
+-------------------------+
|                       1 |
+-------------------------+
```

Para obter mais informações sobre os espaços de tabelas por arquivo, consulte a Seção 17.6.3.2, “Espaços de tabelas por arquivo”.

Quando você especifica uma cláusula `DATA DIRECTORY` em uma declaração `CREATE TABLE`, o arquivo de dados da tabela (`table_name.ibd`) é criado em um diretório de esquema sob o diretório especificado.

A partir do MySQL 8.0.21, tabelas e partições de tabelas criadas fora do diretório de dados usando a cláusula `DATA DIRECTORY` estão restritas a diretórios conhecidos por `InnoDB`. Essa exigência permite que os administradores de banco de dados controlem onde os arquivos de dados do espaço de tabelas são criados e garante que os arquivos de dados possam ser encontrados durante a recuperação (veja Recuperação de Falha Durante a Recuperação de Espaço de Tabela). Os diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Você pode usar a seguinte declaração para verificar essas configurações:

```
mysql> SELECT @@datadir,@@innodb_data_home_dir,@@innodb_directories;
```

Se o diretório que você deseja usar for desconhecido, adicione-o ao ajuste `innodb_directories` antes de criar a tabela. A variável `innodb_directories` é de leitura somente. Configurar isso requer reiniciar o servidor. Para informações gerais sobre a configuração de variáveis do sistema, consulte a Seção 7.1.9, “Usando Variáveis do Sistema”.

O exemplo a seguir demonstra como criar uma tabela em um diretório externo usando a cláusula `DATA DIRECTORY`. Assume-se que a variável `innodb_file_per_table` está habilitada e que o diretório é conhecido por `InnoDB`.

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

###### Observações de uso:

- Inicialmente, o MySQL mantém o arquivo de dados do espaço de tabelas aberto, impedindo que você desmonte o dispositivo, mas pode eventualmente fechar o arquivo se o servidor estiver ocupado. Tenha cuidado para não desmontar acidentalmente um dispositivo externo enquanto o MySQL estiver em execução ou iniciar o MySQL enquanto o dispositivo estiver desconectado. Tentar acessar uma tabela quando o arquivo de dados associado estiver ausente causa um erro grave que requer o reinício do servidor.

  A reinicialização do servidor pode falhar se o arquivo de dados não for encontrado no caminho esperado. Nesse caso, você pode restaurar o arquivo de dados do espaço de tabelas a partir de um backup ou excluir a tabela para remover as informações sobre ela do dicionário de dados.

- Antes de colocar uma tabela em um volume montado no NFS, revise os problemas potenciais descritos em Usar NFS com MySQL.

- Se estiver usando uma captura de estado do LVM, uma cópia de arquivo ou outro mecanismo baseado em arquivos para fazer backup do arquivo de dados da tabela, sempre use a instrução `FLUSH TABLES ... FOR EXPORT` primeiro para garantir que todas as alterações armazenadas na memória sejam descarregadas no disco antes de o backup ocorrer.

- Usar a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo é uma alternativa ao uso de links simbólicos, que o `InnoDB` não suporta.

- A cláusula `DATA DIRECTORY` não é suportada em um ambiente de replicação onde a fonte e a réplica residem no mesmo host. A cláusula `DATA DIRECTORY` requer um caminho de diretório completo. Replicar o caminho nesse caso faria com que a fonte e a réplica criassem a tabela na mesma localização.

- A partir do MySQL 8.0.21, as tabelas criadas em espaços de tabelas por arquivo não podem mais ser criadas no diretório do espaço de tabelas de desfazer (`innodb_undo_directory`) a menos que isso seja diretamente conhecido pelo `InnoDB`. Os diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`.

##### Usando a sintaxe CREATE TABLE ... TABLESPACE

A sintaxe `CREATE TABLE ... TABLESPACE` pode ser usada em combinação com a cláusula `DATA DIRECTORY` para criar uma tabela em um diretório externo. Para fazer isso, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```
mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE = innodb_file_per_table
       DATA DIRECTORY = '/external/directory';
```

Este método é suportado apenas para tabelas criadas em espaços de tabelas por arquivo, mas não requer que a variável `innodb_file_per_table` seja habilitada. Em todos os outros aspectos, este método é equivalente ao método `CREATE TABLE ... DATA DIRECTORY` descrito acima. As mesmas notas de uso se aplicam.

##### Criando uma Tabela em um Espaço de Tabela Geral Externo

Você pode criar uma tabela em um espaço de tabelas geral que reside em um diretório externo.

- Para obter informações sobre como criar um espaço de tabelas geral em um diretório externo, consulte Criar um espaço de tabelas geral.

- Para obter informações sobre como criar uma tabela em um espaço de tabelas geral, consulte Adicionar tabelas a um espaço de tabelas geral.
