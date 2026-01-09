#### 14.6.3.3 Tabelaspaces Gerais

Um espaço de tabela geral é um espaço de tabela compartilhado do `InnoDB` que é criado usando a sintaxe `CREATE TABLESPACE`. As capacidades e recursos do espaço de tabela geral são descritos nos tópicos a seguir nesta seção:

- Capacidades gerais do espaço de tabela
- Criando um Espaço de Tabelas Geral
- Adicionar tabelas a um espaço de tabelas geral
- Suporte ao formato de linha do espaço de tabela geral
- Mover tabelas entre tabelaspaces usando ALTER TABLE
- Apagando um Espaço de Tabelas Geral
- Limitações gerais do espaço de tabela

##### Capacidades gerais do espaço de tabela

Os espaços de tabela gerais oferecem as seguintes funcionalidades:

- Assim como as tabelas de sistema, as tabelas gerais são tabelas compartilhadas que podem armazenar dados para várias tabelas.

- Os espaços de tabelas gerais têm uma vantagem de memória potencial em relação aos espaços de tabelas por arquivo. O servidor mantém os metadados do espaço de tabela na memória por toda a vida útil de um espaço de tabela. Várias tabelas em menos espaços de tabelas gerais consomem menos memória para os metadados do espaço de tabela do que o mesmo número de tabelas em espaços de tabelas por arquivo separados.

- Os arquivos de dados de espaço geral podem ser colocados em um diretório relativo ou independente do diretório de dados do MySQL, o que lhe oferece muitas das capacidades de gerenciamento de arquivos e armazenamento de espaços de tabelas por arquivo. Como com os espaços de tabelas por arquivo, a capacidade de colocar arquivos de dados fora do diretório de dados do MySQL permite que você gerencie o desempenho de tabelas críticas separadamente, configure RAID ou DRBD para tabelas específicas ou vincule tabelas a discos particulares, por exemplo.

- Os espaços de tabela gerais suportam tanto os formatos de arquivo Antelope quanto Barracuda, e, portanto, suportam todos os formatos de linha de tabela e recursos associados. Com suporte para ambos os formatos de arquivo, os espaços de tabela gerais não dependem das configurações `innodb_file_format` ou `innodb_file_per_table`, e essas variáveis também não têm efeito nos espaços de tabela gerais.

- A opção `TABLESPACE` pode ser usada com `CREATE TABLE` para criar tabelas em espaços de tabelas gerais, em um espaço de tabela por arquivo ou no espaço de tabelas do sistema.

- A opção `TABLESPACE` pode ser usada com `ALTER TABLE` para mover tabelas entre espaços de tabelas gerais, espaços de tabelas por arquivo e o espaço de tabelas do sistema.

##### Criando um Espaço de Tabelas Geral

Os espaços de tabelas gerais são criados usando a sintaxe `CREATE TABLESPACE`.

```sql
CREATE TABLESPACE tablespace_name
    ADD DATAFILE 'file_name'
    [FILE_BLOCK_SIZE = value]
        [ENGINE [=] engine_name]
```

Um espaço de tabela geral pode ser criado no diretório de dados ou fora dele. Para evitar conflitos com espaços de tabela implícita de arquivo por tabela, a criação de um espaço de tabela geral em um subdiretório sob o diretório de dados não é suportada. Ao criar um espaço de tabela geral fora do diretório de dados, o diretório deve existir antes de criar o espaço de tabela.

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

Você pode especificar um caminho relativo ao diretório de dados, desde que o diretório do espaço de tabelas não esteja sob o diretório de dados. Neste exemplo, o diretório `my_tablespace` está no mesmo nível que o diretório de dados:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '../my_tablespace/ts1.ibd' Engine=InnoDB;
```

Nota

A cláusula `ENGINE = InnoDB` deve ser definida como parte da instrução `CREATE TABLESPACE`, ou `InnoDB` deve ser definido como o motor de armazenamento padrão (`default_storage_engine=InnoDB`).

##### Adicionar tabelas a um espaço de tabelas geral

Após criar um espaço de tabela geral, as instruções `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` podem ser usadas para adicionar tabelas ao espaço de tabela, conforme mostrado nos exemplos a seguir:

`CREATE TABLE`:

```sql
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1;
```

`ALTER TABLE`:

```sql
mysql> ALTER TABLE t2 TABLESPACE ts1;
```

Nota

O suporte para adicionar partições de tabela a espaços de tabela compartilhados foi descontinuado no MySQL 5.7.24; espere-se que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais.

Para informações detalhadas sobre sintaxe, consulte `CREATE TABLE` e `ALTER TABLE`.

##### Suporte ao formato de linha do espaço de tabela geral

Os espaços de tabelas gerais suportam todos os formatos de linhas de tabela (`REDUNDANT`, `COMPACT`, `DYNAMIC`, `COMPRESSED`), com a ressalva de que tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais devido aos tamanhos diferentes das páginas físicas.

Para que um espaço de tabela geral contenha tabelas compactadas (`ROW_FORMAT=COMPRESSED`), a opção `FILE_BLOCK_SIZE` deve ser especificada, e o valor de `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor de `innodb_page_size`. Além disso, o tamanho de página física da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16KB` e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

A tabela a seguir mostra as combinações permitidas de `innodb_page_size`, `FILE_BLOCK_SIZE` e `KEY_BLOCK_SIZE`. Os valores de `FILE_BLOCK_SIZE` também podem ser especificados em bytes. Para determinar um valor válido de `KEY_BLOCK_SIZE` para um `FILE_BLOCK_SIZE` dado, divida o valor de `FILE_BLOCK_SIZE` por 1024. A compressão da tabela não é suportada para tamanhos de página `InnoDB` de 32K e 64K. Para obter mais informações sobre `KEY_BLOCK_SIZE`, consulte `CREATE TABLE` e a Seção 14.9.1.2, “Criando Tabelas Compridas”.

**Tabela 14.3 Combinações de Tamanho de Página Permitido, FILE_BLOCK_SIZE e KEY_BLOCK_SIZE para Tabelas Compactadas**

<table frame="all"><col style="width: 33%"/><col style="width: 33%"/><col style="width: 34%"/><thead><tr> <th>Tamanho da página InnoDB (innodb_page_size)</th> <th>Valor Permitido FILE_BLOCK_SIZE</th> <th>Valor PERMISSIDO KEY_BLOCK_SIZE</th> </tr></thead><tbody><tr> <th>64 KB</th> <td>64K (65536)</td> <td>A compressão não é suportada</td> </tr><tr> <th>32 KB</th> <td>32K (32768)</td> <td>A compressão não é suportada</td> </tr><tr> <th>16 KB</th> <td>16K (16384)</td> <td>Nenhum. Se[[<code>innodb_page_size</code>]]Se for igual a [[<code>FILE_BLOCK_SIZE</code>]], o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>16 KB</th> <td>8K (8192)</td> <td>8</td> </tr><tr> <th>16 KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th>16 KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>16 KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th>8 KB</th> <td>8K (8192)</td> <td>Nenhum. Se[[<code>innodb_page_size</code>]]Se for igual a [[<code>FILE_BLOCK_SIZE</code>]], o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>8 KB</th> <td>4K (4096)</td> <td>4</td> </tr><tr> <th>8 KB</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>8 KB</th> <td>1K (1024)</td> <td>1</td> </tr><tr> <th>4 KB</th> <td>4K (4096)</td> <td>Nenhum. Se[[<code>innodb_page_size</code>]]Se for igual a [[<code>FILE_BLOCK_SIZE</code>]], o tablespace não pode conter uma tabela comprimida.</td> </tr><tr> <th>4K</th> <td>2K (2048)</td> <td>2</td> </tr><tr> <th>4 KB</th> <td>1K (1024)</td> <td>1</td> </tr></tbody></table>

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela compactada. O exemplo assume um tamanho padrão de página `innodb_page_size` de 16 KB. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Se você não especificar `FILE_BLOCK_SIZE` ao criar um espaço de tabela geral, `FILE_BLOCK_SIZE` tem como padrão `innodb_page_size`. Quando `FILE_BLOCK_SIZE` é igual a `innodb_page_size`, o espaço de tabela pode conter apenas tabelas com um formato de linha não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC` formatos de linha).

##### Mover tabelas entre tabelaspaces usando ALTER TABLE

A opção `ALTER TABLE` com o `TABLESPACE` pode ser usada para mover uma tabela para um espaço de tabelas geral existente, para um novo espaço de tabelas por arquivo ou para o espaço de tabelas do sistema.

Nota

O suporte para a colocação de partições de tabela em espaços de tabela compartilhados foi descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais.

Para mover uma tabela de um espaço de tabelas por arquivo ou de um espaço de tabelas do sistema para um espaço de tabelas geral, especifique o nome do espaço de tabelas geral. O espaço de tabelas geral deve existir. Consulte `ALTER TABLESPACE` para obter mais informações.

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

A sintaxe `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a opção `TABLESPACE`.

Restrições se aplicam ao mover tabelas de espaços de tabelas criptografados. Consulte Limitações de criptografia.

##### Apagando um Espaço de Tabelas Geral

A instrução `DROP TABLESPACE` é usada para descartar um espaço de tabelas geral `InnoDB`.

Todas as tabelas devem ser excluídas do espaço de tabelas antes de uma operação `DROP TABLESPACE`. Se o espaço de tabelas não estiver vazio, o `DROP TABLESPACE` retornará um erro.

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

Se uma operação `DROP TABLESPACE` em um espaço de tabelas geral `vazio` retornar um erro, o espaço de tabelas pode conter uma tabela temporária ou intermediária órfã que foi deixada por uma operação `ALTER TABLE` que foi interrompida por uma saída do servidor. Para mais informações, consulte a Seção 14.22.3, “Soluções de problemas em operações do Dicionário de Dados InnoDB”.

Um espaço de tabelas `InnoDB` geral não é excluído automaticamente quando a última tabela do espaço de tabelas é excluída. O espaço de tabelas deve ser excluído explicitamente usando `DROP TABLESPACE nome_do_espaço_de_tabelas`.

Um espaço de tabela geral não pertence a nenhum banco de dados específico. Uma operação `DROP DATABASE` pode excluir tabelas que pertencem a um espaço de tabela geral, mas não pode excluir o espaço de tabela, mesmo que a operação `DROP DATABASE` exclua todas as tabelas que pertencem ao espaço de tabela.

Assim como as tabelas de sistema, o truncamento ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados `ibd` do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece quando um espaço de tabelas por arquivo é excluído durante uma operação `DROP TABLE`.

Este exemplo demonstra como excluir um espaço de tabelas geral `InnoDB`. O espaço de tabelas geral `ts1` é criado com uma única tabela. A tabela deve ser excluída antes de excluir o espaço de tabelas.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Nota

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

##### Limitações gerais do espaço de tabela

- Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

- A criação de tabelasespaces gerais temporárias não é suportada.

- Os espaços de tabela gerais não suportam tabelas temporárias.

- As tabelas armazenadas em um espaço de tabelas geral só podem ser abertas em versões do MySQL que suportem espaços de tabelas gerais.

- Assim como as tabelas de sistema, o truncar ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados `ibd` do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

  Além disso, uma operação de cópia de tabela `ALTER TABLE` em uma tabela que reside em um espaço de tabelas compartilhado (um espaço de tabelas geral ou o espaço de tabelas do sistema) pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações exigem tanto espaço adicional quanto os dados na tabela mais os índices. O espaço adicional necessário para a operação `ALTER TABLE` de cópia de tabela não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

- `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

- O suporte para a colocação de partições de tabela em espaços de tabela gerais foi descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL.

- A cláusula `ADD DATAFILE` não é suportada em um ambiente de replicação onde a fonte e a réplica residem no mesmo host, pois isso faria com que a fonte e a réplica criassem um espaço de tabelas com o mesmo nome e na mesma localização.
