### 13.1.14 Declaração CREATE INDEX

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part:
    col_name [(length)] [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normalmente, você cria todos os Indexes em uma tabela no momento em que a própria tabela é criada com [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Veja [Seção 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"). Esta diretriz é especialmente importante para tabelas [`InnoDB`], onde a Primary Key determina o layout físico das linhas no arquivo de dados. [`CREATE INDEX`] permite adicionar Indexes a tabelas existentes.

[`CREATE INDEX`] é mapeado para uma declaração [`ALTER TABLE`] para criar Indexes. Veja [Seção 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"). [`CREATE INDEX`] não pode ser usado para criar uma `PRIMARY KEY`; use [`ALTER TABLE`] em vez disso. Para mais informações sobre Indexes, veja [Seção 8.3.1, “How MySQL Uses Indexes”](mysql-indexes.html "8.3.1 How MySQL Uses Indexes").

O [`InnoDB`] suporta Indexes secundários em colunas virtuais. Para mais informações, veja [Seção 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

Quando a configuração [`innodb_stats_persistent`] está habilitada, execute a declaração [`ANALYZE TABLE`] para uma tabela [`InnoDB`] após criar um Index nessa tabela.

Uma especificação de Index na forma `(key_part1, key_part2, ...)` cria um Index com múltiplas partes da chave (key parts). Os valores das chaves do Index são formados pela concatenação dos valores das partes da chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um Index de múltiplas colunas com chaves de Index que consistem em valores de `col1`, `col2` e `col3`.

Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões, visando especificar o armazenamento de valores de Index em ordem ascendente ou descendente. Atualmente, elas são analisadas (parsed), mas ignoradas; os valores do Index são sempre armazenados em ordem crescente.

As seções a seguir descrevem diferentes aspectos da declaração [`CREATE INDEX`]:

* [Partes da Chave de Prefixo de Coluna](create-index.html#create-index-column-prefixes "Column Prefix Key Parts")
* [Indexes Unique](create-index.html#create-index-unique "Unique Indexes")
* [Indexes Full-Text](create-index.html#create-index-fulltext "Full-Text Indexes")
* [Indexes Espaciais](create-index.html#create-index-spatial "Spatial Indexes")
* [Opções de Index](create-index.html#create-index-options "Index Options")
* [Opções de Cópia e Locking de Tabela](create-index.html#create-index-copying "Table Copying and Locking Options")

#### Partes da Chave de Prefixo de Coluna

Para colunas de string, Indexes podem ser criados usando apenas a parte inicial dos valores da coluna, usando a sintaxe `col_name(length)` para especificar um comprimento de prefixo do Index:

* Prefixos podem ser especificados para partes da chave [`CHAR`], [`VARCHAR`], [`BINARY`] e [`VARBINARY`].

* Prefixos *devem* ser especificados para partes da chave [`BLOB`] e [`TEXT`]. Além disso, as colunas [`BLOB`] e [`TEXT`] podem ser indexadas apenas para tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

* Os *limites* de Prefixos são medidos em bytes. No entanto, os *comprimentos* dos Prefixos para especificações de Index nas declarações [`CREATE TABLE`], [`ALTER TABLE`] e [`CREATE INDEX`] são interpretados como número de caracteres para tipos de string não binários ([`CHAR`], [`VARCHAR`], [`TEXT`]) e número de bytes para tipos de string binários ([`BINARY`], [`VARBINARY`], [`BLOB`]). Leve isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  O suporte a Prefixo e os comprimentos dos Prefixos (onde suportados) dependem do storage engine. Por exemplo, um Prefixo pode ter até 767 bytes de comprimento para tabelas [`InnoDB`] ou 3072 bytes se a opção [`innodb_large_prefix`] estiver habilitada. Para tabelas [`MyISAM`], o limite de comprimento do Prefixo é de 1000 bytes. O storage engine [`NDB`] não suporta Prefixos (veja [Seção 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”](mysql-cluster-limitations-unsupported.html "21.2.7.6 Unsupported or Missing Features in NDB Cluster")).

A partir do MySQL 5.7.17, se um Prefix de Index especificado exceder o tamanho máximo do tipo de dado da coluna, [`CREATE INDEX`] lida com o Index da seguinte forma:

* Para um Index não unique, ou ocorre um erro (se o modo SQL estrito estiver habilitado), ou o comprimento do Index é reduzido para se adequar ao tamanho máximo do tipo de dado da coluna e um aviso (warning) é gerado (se o modo SQL estrito não estiver habilitado).

* Para um Index unique, ocorre um erro, independentemente do modo SQL, porque a redução do comprimento do Index pode permitir a inserção de entradas não unique que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um Index usando os 10 primeiros caracteres da coluna `name` (assumindo que `name` tenha um tipo de string não binário):

```sql
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as buscas realizadas usando este Index não devem ser muito mais lentas do que usar um Index criado a partir da coluna `name` inteira. Além disso, usar Prefixos de coluna para Indexes pode tornar o arquivo de Index muito menor, o que pode economizar muito espaço em disco e também pode acelerar operações [`INSERT`].

#### Indexes Unique

Um Index `UNIQUE` cria uma restrição tal que todos os valores no Index devem ser distintos. Ocorre um erro se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Se você especificar um valor de Prefix para uma coluna em um Index `UNIQUE`, os valores da coluna devem ser unique dentro do comprimento do Prefix. Um Index `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver uma `PRIMARY KEY` ou um Index `UNIQUE NOT NULL` que consista em uma única coluna do tipo inteiro, você pode usar `_rowid` para se referir à coluna indexada em declarações [`SELECT`], da seguinte forma:

* `_rowid` se refere à coluna `PRIMARY KEY` se houver uma `PRIMARY KEY` consistindo em uma única coluna inteira. Se houver uma `PRIMARY KEY`, mas ela não consistir em uma única coluna inteira, `_rowid` não poderá ser usado.

* Caso contrário, `_rowid` se refere à coluna no primeiro Index `UNIQUE NOT NULL` se esse Index consistir em uma única coluna inteira. Se o primeiro Index `UNIQUE NOT NULL` não consistir em uma única coluna inteira, `_rowid` não poderá ser usado.

#### Indexes Full-Text

Indexes `FULLTEXT` são suportados apenas para tabelas [`InnoDB`] e [`MyISAM`] e podem incluir apenas colunas [`CHAR`], [`VARCHAR`] e [`TEXT`]. A indexação sempre ocorre sobre a coluna inteira; a indexação de Prefixos de coluna não é suportada e qualquer comprimento de Prefix é ignorado, se especificado. Veja [Seção 12.9, “Full-Text Search Functions”](fulltext-search.html "12.9 Full-Text Search Functions"), para detalhes da operação.

#### Indexes Espaciais

Os storage engines [`MyISAM`], [`InnoDB`], [`NDB`] e [`ARCHIVE`] suportam colunas espaciais como [`POINT`] e [`GEOMETRY`]. ([Seção 11.4, “Spatial Data Types”](spatial-types.html "11.4 Spatial Data Types"), descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os engines. Indexes espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Indexes espaciais em colunas espaciais (criados usando `SPATIAL INDEX`) têm estas características:

* Disponíveis apenas para tabelas [`MyISAM`] e [`InnoDB`]. A especificação de `SPATIAL INDEX` para outros storage engines resulta em um erro.

* As colunas indexadas devem ser `NOT NULL`.
* Comprimentos de Prefixos de coluna são proibidos. A largura total de cada coluna é indexada.

Indexes não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm estas características:

* Permitidos para qualquer storage engine que suporte colunas espaciais, exceto [`ARCHIVE`].

* As colunas podem ser `NULL`, a menos que o Index seja uma Primary Key.

* Para cada coluna espacial em um Index não-`SPATIAL`, exceto colunas [`POINT`], um comprimento de Prefixo de coluna deve ser especificado. (Este é o mesmo requisito que para colunas [`BLOB`] indexadas.) O comprimento do Prefixo é fornecido em bytes.

* O tipo de Index para um Index não-`SPATIAL` depende do storage engine. Atualmente, B-tree é usado.

* Permitido para uma coluna que pode ter valores `NULL` apenas para tabelas [`InnoDB`], [`MyISAM`] e [`MEMORY`].

#### Opções de Index

Após a lista de partes da chave, as opções de Index podem ser fornecidas. Um valor de *`index_option`* pode ser qualquer um dos seguintes:

* `KEY_BLOCK_SIZE [=] valor`

  Para tabelas [`MyISAM`], `KEY_BLOCK_SIZE` opcionalmente especifica o tamanho em bytes a ser usado para os blocos de chave do Index. O valor é tratado como uma sugestão (hint); um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de Index individual substitui um valor `KEY_BLOCK_SIZE` em nível de tabela.

  `KEY_BLOCK_SIZE` não é suportado no nível de Index para tabelas [`InnoDB`]. Veja [Seção 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

* *`index_type`*

  Alguns storage engines permitem que você especifique um tipo de Index ao criar um Index. Por exemplo:

  ```sql
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

  [Tabela 13.1, “Tipos de Index Por Storage Engine”](create-index.html#create-index-storage-engine-index-types "Table 13.1 Index Types Per Storage Engine") mostra os valores de tipo de Index permitidos suportados por diferentes storage engines. Onde múltiplos tipos de Index são listados, o primeiro é o padrão quando nenhum especificador de tipo de Index é fornecido. Storage engines não listados na tabela não suportam uma cláusula *`index_type`* nas definições de Index.

  **Tabela 13.1 Tipos de Index Permitidos Por Storage Engine**

  <table summary="Tipos de Index permitidos por storage engine."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Storage Engine</th> <th>Tipos de Index Permitidos</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MyISAM</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MEMORY</code>/<code>HEAP</code></td> <td><code>HASH</code>, <code>BTREE</code></td> </tr><tr> <td><code>NDB</code></td> <td><code>HASH</code>, <code>BTREE</code> (veja nota no texto)</td> </tr></tbody></table>

  A cláusula *`index_type`* não pode ser usada para especificações `FULLTEXT INDEX` ou `SPATIAL INDEX`. A implementação do Index Full-Text depende do storage engine. Indexes espaciais são implementados como Indexes R-tree.

  Indexes `BTREE` são implementados pelo storage engine [`NDB`] como Indexes T-tree.

  Nota

  Para Indexes em colunas de tabelas [`NDB`], a opção `USING` pode ser especificada apenas para um Index unique ou Primary Key. `USING HASH` impede a criação de um Index ordenado; caso contrário, a criação de um Index unique ou Primary Key em uma tabela [`NDB`] resulta automaticamente na criação de um Index ordenado e um Index Hash, cada um dos quais indexa o mesmo conjunto de colunas.

  Para Indexes unique que incluem uma ou mais colunas `NULL` de uma tabela [`NDB`], o Index Hash pode ser usado apenas para procurar valores literais, o que significa que as condições `IS [NOT] NULL` exigem um scan completo da tabela. Uma solução alternativa (workaround) é garantir que um Index unique usando uma ou mais colunas `NULL` em tal tabela seja sempre criado de forma que inclua o Index ordenado; ou seja, evite empregar `USING HASH` ao criar o Index.

  Se você especificar um tipo de Index que não é válido para um determinado storage engine, mas outro tipo de Index estiver disponível que o engine possa usar sem afetar os resultados da Query, o engine usa o tipo disponível. O parser reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para nenhum storage engine.

  Nota

  O uso da opção *`index_type`* antes da cláusula `ON tbl_name` está depreciado; você deve esperar que o suporte para o uso da opção nesta posição seja removido em uma futura versão do MySQL. Se uma opção *`index_type`* for fornecida nas posições anterior e posterior, a opção final se aplica.

  `TYPE type_name` é reconhecido como um sinônimo para `USING type_name`. No entanto, `USING` é a forma preferida.

  As tabelas a seguir mostram as características de Index para os storage engines que suportam a opção *`index_type`*.

  **Tabela 13.2 Características do Index do Storage Engine InnoDB**

  <table summary="Características do Index do storage engine InnoDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de Index</th> <th>Tipo de Index</th> <th>Armazena Valores NULL</th> <th>Permite Múltiplos Valores NULL</th> <th>Tipo de Scan IS NULL</th> <th>Tipo de Scan IS NOT NULL</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 13.3 Características do Index do Storage Engine MyISAM**

  <table summary="Características do Index do storage engine MyISAM."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de Index</th> <th>Tipo de Index</th> <th>Armazena Valores NULL</th> <th>Permite Múltiplos Valores NULL</th> <th>Tipo de Scan IS NULL</th> <th>Tipo de Scan IS NOT NULL</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 13.4 Características do Index do Storage Engine MEMORY**

  <table summary="Características do Index do storage engine Memory."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de Index</th> <th>Tipo de Index</th> <th>Armazena Valores NULL</th> <th>Permite Múltiplos Valores NULL</th> <th>Tipo de Scan IS NULL</th> <th>Tipo de Scan IS NOT NULL</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr></tbody></table>

  **Tabela 13.5 Características do Index do Storage Engine NDB**

  <table summary="Características do Index do storage engine NDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de Index</th> <th>Tipo de Index</th> <th>Armazena Valores NULL</th> <th>Permite Múltiplos Valores NULL</th> <th>Tipo de Scan IS NULL</th> <th>Tipo de Scan IS NOT NULL</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>Não</td> <td>Não</td> <td>Table (veja nota 1)</td> <td>Table (veja nota 1)</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Table (veja nota 1)</td> <td>Table (veja nota 1)</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Table (veja nota 1)</td> <td>Table (veja nota 1)</td> </tr></tbody></table>

  Nota da Tabela:

  1. Se `USING HASH` for especificado, isso impede a criação de um Index ordenado implícito.

* `WITH PARSER parser_name`

  Esta opção pode ser usada apenas com Indexes `FULLTEXT`. Ela associa um plugin de parser ao Index caso as operações de indexação e busca Full-Text necessitem de tratamento especial. [`InnoDB`] e [`MyISAM`] suportam plugins de parser Full-Text. Se você tiver uma tabela [`MyISAM`] com um plugin de parser Full-Text associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Consulte [Plugins de Parser Full-Text](/doc/extending-mysql/5.7/en/plugin-types.html#full-text-plugin-type) e [Escrevendo Plugins de Parser Full-Text](/doc/extending-mysql/5.7/en/writing-full-text-plugins.html) para mais informações.

* `COMMENT 'string'`

  As definições de Index podem incluir um comentário opcional de até 1024 caracteres.

  O `MERGE_THRESHOLD` (Limite de Fusão) para páginas de Index pode ser configurado para Indexes individuais usando a cláusula `COMMENT` de *`index_option`* da declaração [`CREATE INDEX`]. Por exemplo:

  ```sql
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  Se a porcentagem de preenchimento da página (page-full percentage) para uma página de Index cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de update, o [`InnoDB`] tenta mesclar a página de Index com uma página de Index vizinha. O valor padrão de `MERGE_THRESHOLD` é 50, que é o valor previamente codificado (hardcoded).

  `MERGE_THRESHOLD` também pode ser definido no nível de Index e no nível de tabela usando as declarações [`CREATE TABLE`] e [`ALTER TABLE`]. Para mais informações, veja [Seção 14.8.12, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

#### Opções de Cópia e Locking de Tabela

Cláusulas `ALGORITHM` e `LOCK` podem ser fornecidas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus Indexes estão sendo modificados. Elas têm o mesmo significado que para a declaração [`ALTER TABLE`]. Para mais informações, veja [Seção 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

O NDB Cluster anteriormente suportava operações `CREATE INDEX` online usando uma sintaxe alternativa que não é mais suportada. O NDB Cluster agora suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o MySQL Server padrão. Consulte [Seção 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), para mais informações.
