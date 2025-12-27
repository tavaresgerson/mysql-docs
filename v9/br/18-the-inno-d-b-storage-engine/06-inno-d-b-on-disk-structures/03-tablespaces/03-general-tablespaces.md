#### 17.6.3.3 Espaços de Tabelas Gerais

Um espaço de tabelas geral é um espaço de tabelas `InnoDB` compartilhado que é criado usando a sintaxe `CREATE TABLESPACE`. As capacidades e recursos de um espaço de tabelas geral são descritos nos tópicos a seguir nesta seção:

* Capacidades de Espaços de Tabelas Gerais
* Criando um Espaço de Tabelas Gerais
* Adicionando Tabelas a um Espaço de Tabelas Gerais
* Suporte ao Formato de Linha de Tabela de Espaços de Tabelas Gerais
* Movendo Tabelas entre Espaços de Tabelas Usando ALTER TABLE
* Renomeando um Espaço de Tabelas Gerais
* Excluindo um Espaço de Tabelas Gerais
* Limitações de Espaços de Tabelas Gerais

##### Capacidades de Espaços de Tabelas Gerais

Os espaços de tabelas gerais oferecem as seguintes capacidades:

* Semelhantes ao espaço de tabelas do sistema, os espaços de tabelas gerais são espaços de tabelas compartilhados capazes de armazenar dados para múltiplas tabelas.

* Os espaços de tabelas gerais têm uma vantagem de memória potencial sobre os espaços de tabelas por arquivo. O servidor mantém o metadados do espaço de tabela na memória por toda a vida útil de um espaço de tabela. Múltiplas tabelas em menos espaços de tabelas gerais consomem menos memória para os metadados do espaço de tabela do que o mesmo número de tabelas em espaços de tabelas por arquivo separados.

* Os arquivos de dados do espaço de tabela geral podem ser colocados em um diretório relativo ou independente do diretório de dados do MySQL, o que lhe oferece muitas das capacidades de gerenciamento de arquivos de dados e armazenamento dos espaços de tabelas por arquivo. Como nos espaços de tabelas por arquivo, a capacidade de colocar arquivos de dados fora do diretório de dados do MySQL permite que você gerencie o desempenho de tabelas críticas separadamente, configure RAID ou DRBD para tabelas específicas ou vincule tabelas a discos particulares, por exemplo.

* Os espaços de tabelas gerais suportam todos os formatos de linha de tabela e recursos associados.

* A opção `TABLESPACE` pode ser usada com `CREATE TABLE` para criar tabelas em espaços de tabelas gerais, espaço de tabelas por arquivo ou no espaço de tabelas do sistema.

* A opção `TABLESPACE` pode ser usada com `ALTER TABLE` para mover tabelas entre espaços de tabelas gerais, espaços de tabelas por arquivo e o espaço de tabelas do sistema.

##### Criando um Espaço de Tabelas Geral

Espaços de tabelas gerais são criados usando a sintaxe `CREATE TABLESPACE`.

```
CREATE TABLESPACE tablespace_name
    [ADD DATAFILE 'file_name']
    [FILE_BLOCK_SIZE = value]
        [ENGINE [=] engine_name]
```

Um espaço de tabelas geral pode ser criado no diretório de dados ou fora dele. Para evitar conflitos com espaços de tabelas por arquivo criados implicitamente, não é suportado criar um espaço de tabelas geral em um subdiretório sob o diretório de dados. Ao criar um espaço de tabelas geral fora do diretório de dados, o diretório deve existir e deve ser conhecido pelo `InnoDB` antes de criar o espaço de tabelas. Para tornar um diretório desconhecido conhecido pelo `InnoDB`, adicione o diretório ao valor do argumento `innodb_directories`. `innodb_directories` é uma opção de inicialização somente de leitura. Configurar isso requer reiniciar o servidor.

Exemplos:

Criando um espaço de tabelas geral no diretório de dados:

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;
```

ou

```
mysql> CREATE TABLESPACE `ts1` Engine=InnoDB;
```

A cláusula `ADD DATAFILE` é opcional. Se a cláusula `ADD DATAFILE` não for especificada ao criar um espaço de tabelas, um arquivo de dados do espaço de tabelas com um nome de arquivo único é criado implicitamente. O nome de arquivo único é um UUID de 128 bits formatado em cinco grupos de números hexadecimais separados por traços (*`aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`*). Os arquivos de dados dos espaços de tabelas gerais incluem a extensão `.ibd`. Em um ambiente de replicação, o nome do arquivo de dados criado na fonte não é o mesmo que o nome do arquivo de dados criado na replica.

Criando um espaço de tabelas geral em um diretório fora do diretório de dados:

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '/my/tablespace/directory/ts1.ibd' Engine=InnoDB;
```

Você pode especificar um caminho relativo ao diretório de dados, desde que o diretório do espaço de tabelas não esteja sob o diretório de dados. Neste exemplo, o diretório `my_tablespace` está no mesmo nível que o diretório de dados:

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '../my_tablespace/ts1.ibd' Engine=InnoDB;
```

Observação

A cláusula `ENGINE = InnoDB` deve ser definida como parte da declaração `CREATE TABLESPACE`, ou `InnoDB` deve ser definido como o motor de armazenamento padrão (`default_storage_engine=InnoDB`).

##### Adicionando Tabelas a um Espaço de Tabelas Geral

Após criar um espaço de tabelas geral, as declarações `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` podem ser usadas para adicionar tabelas ao espaço de tabelas, conforme mostrado nos exemplos seguintes:

`CREATE TABLE`:

```
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1;
```

`ALTER TABLE`:

```
mysql> ALTER TABLE t2 TABLESPACE ts1;
```

A adição de partições de tabela a espaços de tabelas compartilhados não é suportada. Espaços de tabelas compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabelas gerais.

Para informações detalhadas sobre a sintaxe, consulte `CREATE TABLE` e `ALTER TABLE`.

##### Suporte ao Formato de Linha de uma Tabela Geral

Espaços de tabelas gerais suportam todos os formatos de linha de tabela (`REDUNDANT`, `COMPACT`, `DYNAMIC`, `COMPRESSED`), com a ressalva de que tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas geral devido aos tamanhos de página físicos diferentes.

Para que um espaço de tabelas geral contenha tabelas compactadas (`ROW_FORMAT=COMPRESSED`), a opção `FILE_BLOCK_SIZE` deve ser especificada, e o valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactado válido em relação ao valor `innodb_page_size`. Além disso, o tamanho de página físico da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16KB` e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

A tabela a seguir mostra as combinações permitidas de `innodb_page_size`, `FILE_BLOCK_SIZE` e `KEY_BLOCK_SIZE`. Os valores de `FILE_BLOCK_SIZE` também podem ser especificados em bytes. Para determinar um valor válido de `KEY_BLOCK_SIZE` para um `FILE_BLOCK_SIZE` dado, divida o valor de `FILE_BLOCK_SIZE` por 1024. A compressão da tabela não é suportada para tamanhos de página `InnoDB` de 32K e 64K. Para obter mais informações sobre `KEY_BLOCK_SIZE`, consulte `CREATE TABLE` e a Seção 17.9.1.2, “Criando Tabelas Compressas”.

**Tabela 17.3 Combinações Permitidas de Tamanho de Página, FILE\_BLOCK\_SIZE e KEY\_BLOCK\_SIZE para Tabelas Compressas**

<table frame="all"><col style="width: 33%"/><col style="width: 33%"/><col style="width: 34%"/><thead><tr> <th scope="col">Tamanho da Página InnoDB (innodb_page_size)</th> <th scope="col">Valor Permitido de <code class="literal">FILE_BLOCK_SIZE</code></th> <th scope="col">Valor Permitido de <code class="literal">KEY_BLOCK_SIZE</code></th> </tr></thead><tbody><tr> <th scope="row">64KB</th> <td>64K (65536)</td> <td>Compressão não é suportada</td> </tr><tr> <th scope="row">32KB</th> <td>32K (32768)</td> <td>Compressão não é suportada</td> </tr><tr> <th scope="row">16KB</th> <td>16K (16384)</td> <td>Nenhum. Se <a class="link" href="innodb-parameters.html#sysvar_innodb_page_size"><code class="literal">innodb_page_size</code></a> for igual a <code class="literal">FILE_BLOCK_SIZE</code>, o espaço de tabelas não pode conter uma tabela comprimida.</td> </tr><tr> <th scope="row">16KB</th> <td>8K (8192)</td> <td>8</td> </tr><tr> <th scope="row">16KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th scope="row">16KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th scope="row">16KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th scope="row">8KB</th> <td>8K (8192)</td> <td>Nenhum. Se <a class="link" href="innodb-parameters.html#sysvar_innodb_page_size"><code class="literal">innodb_page_size</code></a> for igual a <code class="literal">FILE_BLOCK_SIZE</code>, o espaço de tabelas não pode conter uma tabela comprimida.</td> </tr><tr> <th scope="row">8KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th scope="row">8KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th scope="row">8KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th scope="row">4KB</th> <td>4K (4096)</td> <td>Nenhum. Se <a class="link" href="innodb-parameters.html#sysvar_innodb_page_size"><code class="literal">innodb_page_size</code></a> for igual a <code class="literal">FILE_BLOCK_SIZE</code>, o espaço de tabelas não pode conter uma tabela comprimida.</td> </tr><tr> <th scope="row">4KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th scope="row">4KB</th> <td>1K (1024)</td> <td>1</td> </tr></tbody></table>

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela compactada. O exemplo assume um `innodb_page_size` padrão de 16KB. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Se você não especificar `FILE_BLOCK_SIZE` ao criar um espaço de tabelas geral, `FILE_BLOCK_SIZE` tem como padrão `innodb_page_size`. Quando `FILE_BLOCK_SIZE` é igual a `innodb_page_size`, o espaço de tabelas pode conter apenas tabelas com um formato de linha não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC` formatos de linha).

##### Movendo Tabelas Entre Espaços de Tabelas Usando ALTER TABLE

`ALTER TABLE` com a opção `TABLESPACE` pode ser usado para mover uma tabela para um espaço de tabelas existente, para um novo espaço de tabelas por arquivo, ou para o espaço de tabelas do sistema.

Adicionar partições de tabela a espaços de tabelas compartilhados não é suportado. Espaços de tabelas compartilhados incluem o espaço de tabelas do sistema `InnoDB` e espaços de tabelas gerais.

Para mover uma tabela de um espaço de tabelas por arquivo ou do espaço de tabelas do sistema para um espaço de tabelas geral, especifique o nome do espaço de tabelas geral. O espaço de tabelas geral deve existir. Veja `ALTER TABLESPACE` para mais informações.

```
ALTER TABLE tbl_name TABLESPACE [=] tablespace_name;
```

Para mover uma tabela de um espaço de tabelas geral ou de um espaço de tabelas por arquivo para o espaço de tabelas do sistema, especifique `innodb_system` como o nome do espaço de tabelas.

```
ALTER TABLE tbl_name TABLESPACE [=] innodb_system;
```

Para mover uma tabela do espaço de tabelas do sistema ou de um espaço de tabelas geral para um espaço de tabelas por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```
ALTER TABLE tbl_name TABLESPACE [=] innodb_file_per_table;
```

As operações `ALTER TABLE ... TABLESPACE` causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

A sintaxe `ALTER TABLE ... TABLESPACE` não suporta mover uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a opção `TABLESPACE`. O diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido pelo `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

Restrições se aplicam ao mover tabelas de espaços de arquivos criptografados. Veja Limitações de Criptografia.

##### Renomear um Espaço de Tabelas Geral

Renomear um espaço de tabelas geral é suportado usando a sintaxe `ALTER TABLESPACE ... RENAME TO`.

```
ALTER TABLESPACE s1 RENAME TO s2;
```

O privilégio `CREATE TABLESPACE` é necessário para renomear um espaço de tabelas geral.

As operações `RENAME TO` são executadas implicitamente no modo `autocommit`, independentemente da configuração `autocommit`.

Uma operação `RENAME TO` não pode ser realizada enquanto `LOCK TABLES` ou `FLUSH TABLES WITH READ LOCK` estiverem em vigor para tabelas que residem no espaço de tabelas.

Blocos de metadados exclusivos são tomados em tabelas dentro de um espaço de tabelas geral enquanto o espaço de tabelas está sendo renomeado, o que impede DDL concorrente. DML concorrente é suportado.

##### Eliminar um Espaço de Tabelas Geral

A instrução `DROP TABLESPACE` é usada para eliminar um espaço de tabelas `InnoDB` geral.

Todas as tabelas devem ser eliminadas do espaço de tabelas antes de uma operação `DROP TABLESPACE`. Se o espaço de tabelas não estiver vazio, `DROP TABLESPACE` retorna um erro.

Use uma consulta semelhante à seguinte para identificar tabelas em um espaço de tabelas geral.

```
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

Um espaço de tabelas `InnoDB` geral não é excluído automaticamente quando a última tabela no espaço de tabelas é eliminada. O espaço de tabelas deve ser eliminado explicitamente usando `DROP TABLESPACE espaço_de_tabela`.

Um espaço de tabelas geral não pertence a nenhum banco de dados específico. Uma operação `DROP DATABASE` pode excluir tabelas que pertencem a um espaço de tabelas geral, mas não pode excluir o próprio espaço de tabelas, mesmo que a operação `DROP DATABASE` exclua todas as tabelas que pertencem ao espaço de tabelas.

De forma semelhante ao espaço de tabelas do sistema, a exclusão ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados .ibd do espaço de tabelas geral. Esse espaço só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional como acontece quando um espaço de tabelas por arquivo é excluído durante uma operação `DROP TABLE`.

Este exemplo demonstra como excluir um espaço de tabelas `InnoDB` geral. O espaço de tabelas geral `ts1` é criado com uma única tabela. A tabela deve ser excluída antes de excluir o espaço de tabelas.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Observação

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

##### Limitações do Espaço de Tabelas Gerais

* Um espaço de tabelas gerado ou existente não pode ser alterado para um espaço de tabelas geral.
* A criação de espaços de tabelas gerais temporários não é suportada.
* Os espaços de tabelas gerais não suportam tabelas temporárias.
* De forma semelhante ao espaço de tabelas do sistema, a exclusão ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados .ibd do espaço de tabelas geral. Esse espaço só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional como acontece com os espaços de tabelas por arquivo.

Além disso, uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado (um espaço de tabelas geral ou o espaço de tabelas do sistema) pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações exigem tanto espaço adicional quanto os dados da tabela mais os índices. O espaço adicional necessário para a operação `ALTER TABLE` de cópia de tabela não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

* As operações `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ...IMPORT TABLESPACE` não são suportadas para tabelas que pertencem a um espaço de tabelas geral.

* A colocação de partições de tabela em espaços de tabelas gerais não é suportada.

* A cláusula `ADD DATAFILE` não é suportada em um ambiente de replicação onde a fonte e a replica residem no mesmo host, pois isso causaria que a fonte e a replica criassem um espaço de tabelas com o mesmo nome e localização, o que não é suportado. No entanto, se a cláusula `ADD DATAFILE` for omitida, o espaço de tabelas é criado no diretório de dados com um nome de arquivo gerado que é único, o que é permitido.

* Espaços de tabelas gerais não podem ser criados no diretório do espaço de tabelas de desfazer (`innodb_undo_directory`) a menos que isso seja diretamente conhecido pelo `InnoDB`. Diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`.