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

Normalmente, você cria todos os índices em uma tabela no momento em que a própria tabela é criada com `CREATE TABLE`. Veja Seção 13.1.18, “Instrução CREATE TABLE”. Esta diretriz é especialmente importante para tabelas de `InnoDB`, onde a chave primária determina o layout físico das linhas no arquivo de dados. O `CREATE INDEX` permite que você adicione índices a tabelas existentes.

`CREATE INDEX` é mapeado para uma declaração `ALTER TABLE` para criar índices. Veja Seção 13.1.8, “Declaração ALTER TABLE”. O `CREATE INDEX` não pode ser usado para criar uma `PRIMARY KEY`; use `ALTER TABLE` em vez disso. Para mais informações sobre índices, consulte Seção 8.3.1, “Como o MySQL Usa Índices”.

O `InnoDB` suporta índices secundários em colunas virtuais. Para mais informações, consulte Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

Quando a configuração `innodb_stats_persistent` estiver habilitada, execute a instrução `ANALYZE TABLE` para uma tabela de `InnoDB` após a criação de um índice naquela tabela.

Uma especificação de índice na forma `(chave_part1, chave_part2, ...)` cria um índice com múltiplas partes de chave. Os valores de chave do índice são formados pela concatenação dos valores das partes de chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um índice de múltiplas colunas com chaves de índice consistindo de valores de `col1`, `col2` e `col3`.

Uma especificação de `key_part` pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões para especificar o armazenamento de valores de índice ascendentes ou descendentes. Atualmente, elas são analisadas, mas ignoradas; os valores de índice são sempre armazenados em ordem ascendente.

As seções a seguir descrevem diferentes aspectos da instrução `CREATE INDEX`:

- Prefixo da coluna - partes-chave
- Índices Únicos
- Índices de texto completo
- Índices Espaciais
- Opções de índice
- Opções de Copiar e Bloquear Tabelas

#### Prefixo da coluna Chave de partes

Para colunas de texto, é possível criar índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice:

- Prefixos podem ser especificados para as partes de chave `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

- Os prefixos *devem* ser especificados para as partes-chave `BLOB` e `TEXT`. Além disso, as colunas `BLOB` e `TEXT` só podem ser indexadas para tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

- Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  O suporte a prefixos e as comprimentos dos prefixos (quando suportado) dependem do mecanismo de armazenamento. Por exemplo, um prefixo pode ter até 767 bytes para tabelas de `InnoDB` ou 3072 bytes se a opção `innodb_large_prefix` estiver habilitada. Para tabelas de `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes. O mecanismo de armazenamento `NDB` não suporta prefixos (consulte Seção 21.2.7.6, “Recursos Não Suportado ou Ausentes no NDB Cluster”).

A partir do MySQL 5.7.17, se um prefixo de índice especificado exceder o tamanho máximo do tipo de dado da coluna, o `CREATE INDEX` trata o índice da seguinte forma:

- Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver ativado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dado da coluna e uma mensagem de aviso é exibida (se o modo SQL rigoroso não estiver ativado).

- Para um índice único, um erro ocorre independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um índice usando os primeiros 10 caracteres da coluna `name` (assumindo que `name` tem um tipo de string não binário):

```sql
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as consultas realizadas usando esse índice não devem ser muito mais lentas do que usando um índice criado a partir de toda a coluna `name`. Além disso, usar prefixos de coluna para índices pode tornar o arquivo do índice muito menor, o que pode economizar muito espaço em disco e também acelerar as operações de `INSERT` (insert.html).

#### Índices Únicos

Um índice `UNIQUE` cria uma restrição de forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Se você especificar um valor de prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo. Um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme segue:

- `_rowid` refere-se à coluna `PRIMARY KEY` se houver um `PRIMARY KEY` composto por uma única coluna de inteiro. Se houver um `PRIMARY KEY`, mas ele não for composto por uma única coluna de inteiro, `_rowid` não pode ser usado.

- Caso contrário, `_rowid` se refere à coluna no primeiro índice `UNIQUE NOT NULL` se esse índice consistir em uma única coluna de inteiro. Se o primeiro índice `UNIQUE NOT NULL` não consistir em uma única coluna de inteiro, `_rowid` não pode ser usado.

#### Índices de texto completo

Os índices `FULLTEXT` são suportados apenas para tabelas de `InnoDB` e `MyISAM` e podem incluir apenas as colunas `CHAR`, `VARCHAR` e `TEXT`. O índice é criado sempre sobre toda a coluna; o índice de prefixo de coluna não é suportado e qualquer comprimento de prefixo é ignorado se especificado. Consulte Seção 12.9, “Funções de Busca de Texto Completo” para obter detalhes sobre a operação.

#### Índices Espaciais

Os motores de armazenamento `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE` suportam colunas espaciais como `POINT` e `GEOMETRY`. (Seção 11.4, “Tipos de dados espaciais” descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os motores. Índices espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Os índices espaciais em colunas espaciais (criados usando `SPATIAL INDEX`) têm essas características:

- Disponível apenas para tabelas ``MyISAM` e ``InnoDB` . Especificar `SPATIAL INDEX` para outros motores de armazenamento resulta em um erro.

- As colunas indexadas devem ser `NOT NULL`.

- As comprimentos dos prefixos das colunas são proibidos. A largura total de cada coluna é indexada.

Os índices não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm essas características:

- Permitido para qualquer mecanismo de armazenamento que suporte colunas espaciais, exceto `ARCHIVE`.

- As colunas podem ser `NULL` a menos que o índice seja uma chave primária.

- Para cada coluna espacial em um índice que não é `SPATIAL`, exceto as colunas de tipo `POINT` (ver `spatial-type-overview.html`), deve ser especificado o comprimento do prefixo da coluna. (Essa é a mesma exigência para as colunas de tipo `BLOB` indexadas.) O comprimento do prefixo é dado em bytes.

- O tipo de índice para um índice não `SPATIAL` depende do mecanismo de armazenamento. Atualmente, o B-tree é usado.

- Permitido para uma coluna que pode ter valores `NULL` apenas para as tabelas `InnoDB`, `MyISAM` e `MEMORY`.

#### Opções de índice

Após a lista de partes-chave, as opções de índice podem ser fornecidas. Um valor de *`index_option`* pode ser qualquer um dos seguintes:

- `KEY_BLOCK_SIZE [=] valor`

  Para as tabelas `[MyISAM]` (myisam-storage-engine.html), o `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave do índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de `KEY_BLOCK_SIZE` em nível de tabela.

  O `KEY_BLOCK_SIZE` não é suportado no nível do índice para tabelas de `InnoDB`. Veja Seção 13.1.18, “Instrução CREATE TABLE”.

- *`index_type`*

  Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. Por exemplo:

  ```sql
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

  Tabela 13.1, “Tipos de índice por motor de armazenamento” mostra os valores permitidos dos tipos de índice suportados por diferentes motores de armazenamento. Quando vários tipos de índice são listados, o primeiro é o padrão quando não é fornecido um especificador de tipo de índice. Motores de armazenamento não listados na tabela não suportam uma cláusula *`index_type`* nas definições de índice.

  **Tabela 13.1 Tipos de índice por motor de armazenamento**

  <table summary="Tipos de índice permitidos pelo motor de armazenamento."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Motor de Armazenamento</th> <th>Tipos de índice permitidos</th> </tr></thead><tbody><tr> <td><a class="link" href="innodb-storage-engine.html" title="Capítulo 14: O Motor de Armazenamento InnoDB">[[PH_HTML_CODE_<code class="literal">BTREE</code>]</a></td> <td>[[PH_HTML_CODE_<code class="literal">BTREE</code>]</td> </tr><tr> <td><a class="link" href="myisam-storage-engine.html" title="15.2 O Motor de Armazenamento MyISAM">[[<code class="literal">MyISAM</code>]]</a></td> <td>[[<code class="literal">BTREE</code>]]</td> </tr><tr> <td><a class="link" href="memory-storage-engine.html" title="15.3 O Motor de Armazenamento de MEMÓRIA">[[<code class="literal">MEMORY</code>]]</a>/[[<code class="literal">HEAP</code>]]</td> <td>[[<code class="literal">HASH</code>]], [[<code class="literal">BTREE</code>]]</td> </tr><tr> <td><a class="link" href="mysql-cluster.html" title="Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6">[[<code class="literal">NDB</code>]]</a></td> <td>[[<code class="literal">HASH</code>]], [[<code class="literal">BTREE</code>]] (ver nota no texto)</td> </tr></tbody></table>

  A cláusula `index_type` não pode ser usada para especificações de `FULLTEXT INDEX` ou `SPATIAL INDEX`. A implementação de índices full-text depende do mecanismo de armazenamento. Os índices espaciais são implementados como índices R-tree.

  Os índices `BTREE` são implementados pelo mecanismo de armazenamento `NDB` como índices T-tree.

  Nota

  Para índices nas colunas da tabela `NDB`, a opção `USING` pode ser especificada apenas para um índice único ou chave primária. `USING HASH` impede a criação de um índice ordenado; caso contrário, a criação de um índice único ou chave primária em uma tabela `NDB` resulta automaticamente na criação de um índice ordenado e um índice hash, cada um dos quais indexa o mesmo conjunto de colunas.

  Para índices únicos que incluem uma ou mais colunas `NULL` de uma tabela `NDB`, o índice de hash pode ser usado apenas para procurar valores literais, o que significa que as condições `[NÃO] É NULL` exigem uma varredura completa da tabela. Uma solução é garantir que um índice único usando uma ou mais colunas `NULL` em uma tabela seja sempre criado de maneira que inclua o índice ordenado; ou seja, evite usar `USING HASH` ao criar o índice.

  Se você especificar um tipo de índice que não é válido para um determinado mecanismo de armazenamento, mas outro tipo de índice está disponível e o mecanismo pode usá-lo sem afetar os resultados das consultas, o mecanismo usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para nenhum mecanismo de armazenamento.

  Nota

  O uso da opção *`index_type`* antes da cláusula `ON tbl_name` está desatualizada; você deve esperar que o suporte para o uso dessa opção nessa posição seja removido em uma futura versão do MySQL. Se uma opção *`index_type`* for fornecida tanto na posição anterior quanto na posterior, a opção final será aplicada.

  `TYPE type_name` é reconhecido como sinônimo de `USING type_name`. No entanto, `USING` é a forma preferida.

  As tabelas a seguir mostram as características do índice para os motores de armazenamento que suportam a opção *`index_type`*.

  **Tabela 13.2 Características do Engate de Armazenamento InnoDB**

  <table summary="Características do índice do motor de armazenamento InnoDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">[[<code class="literal">FULLTEXT</code>]]</th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th scope="row">[[<code class="literal">SPATIAL</code>]]</th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 13.3 Características do Motor de Armazenamento MyISAM**

  <table summary="Características do índice do motor de armazenamento MyISAM."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">[[<code class="literal">FULLTEXT</code>]]</th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th scope="row">[[<code class="literal">SPATIAL</code>]]</th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 13.4 Características do Índice do Motor de Armazenamento de MEMÓRIA**

  <table summary="Características do índice do motor de armazenamento de memória."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr></tbody></table>

  **Tabela 13.5 Características do Índice do Motor de Armazenamento NDB**

  <table summary="Características do índice do motor de armazenamento NDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th scope="row">Chave primária</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Não</td> <td>Não</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th scope="row">Único</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th scope="row">Chave</th> <td>[[<code class="literal">HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr></tbody></table>

  Nota da tabela:

  1. Se `USING HASH` for especificado, isso impedirá a criação de um índice ordenado implícito.

- `COM PARSEUR parser_name`

  Esta opção só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de analisador ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. O `InnoDB` e o `MyISAM` suportam plugins de analisadores de texto completo. Se você tiver uma tabela `MyISAM` com um plugin de analisador de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Consulte Plugins de Analisador de Texto Completo e Escrevendo Plugins de Analisador de Texto Completo para obter mais informações.

- `COMENTÁRIO 'string'`

  As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

  O `MERGE_THRESHOLD` para páginas de índice pode ser configurado para índices individuais usando a cláusula `COMMENT` do *`index_option`* da instrução `CREATE INDEX`. Por exemplo:

  ```sql
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  Se a porcentagem de páginas cheia para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão de `MERGE_THRESHOLD` é 50, que é o valor previamente codificado.

  O `MERGE_THRESHOLD` também pode ser definido no nível do índice e da tabela usando as instruções `CREATE TABLE` e `ALTER TABLE`. Para mais informações, consulte Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índices”.

#### Opções de Copiar e Bloquear Tabelas

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a instrução `ALTER TABLE`. Para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE”

Anteriormente, o NDB Cluster suportava operações `CREATE INDEX` online usando uma sintaxe alternativa que não é mais suportada. Agora, o NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster” para obter mais informações.
